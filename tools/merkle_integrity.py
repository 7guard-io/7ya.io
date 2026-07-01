"""Merkle integrity utilities for append-only evidence batches.

The module is intentionally dependency-free so it can run in local scripts,
serverless jobs, or verification clients. It uses RFC 6962-style domain
separation prefixes:

- leaf hash: SHA256(0x00 || record_hash_bytes)
- node hash: SHA256(0x01 || left_child || right_child)

Record hashes are expected to be 64-character SHA-256 hex strings.
"""

from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass
from typing import Iterable, Literal, Sequence, TypedDict

EMPTY_BATCH_HASH = hashlib.sha256(b"empty_batch").hexdigest()
Direction = Literal["left", "right"]


class ProofStep(TypedDict):
    """One sibling hash on the audit path from a leaf to the Merkle root."""

    direction: Direction
    hash: str


@dataclass(frozen=True)
class IntegrityBatch:
    """Serializable Merkle batch snapshot."""

    batch_id: str
    batch_type: str
    record_count: int
    previous_batch_hash: str | None
    merkle_root: str
    tree_levels: list[list[str]]

    def to_json(self) -> str:
        return json.dumps(
            {
                "batch_id": self.batch_id,
                "batch_type": self.batch_type,
                "record_count": self.record_count,
                "previous_batch_hash": self.previous_batch_hash,
                "merkle_root": self.merkle_root,
                "tree_levels": self.tree_levels,
            },
            ensure_ascii=False,
            sort_keys=True,
        )


def sha256_hex(data: bytes) -> str:
    """Return a SHA-256 hex digest for raw bytes."""

    return hashlib.sha256(data).hexdigest()


def canonical_payload_hash(payload: object) -> str:
    """Hash a JSON-compatible evidence payload in a deterministic form."""

    canonical = json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    return sha256_hex(canonical.encode("utf-8"))


def chained_record_hash(previous_record_hash: str | None, payload: object) -> str:
    """Create an append-only record hash linked to the previous record hash."""

    previous = previous_record_hash or "0" * 64
    if not _is_sha256_hex(previous):
        raise ValueError("previous_record_hash must be a SHA-256 hex string")

    payload_hash = canonical_payload_hash(payload)
    return sha256_hex(bytes.fromhex(previous) + bytes.fromhex(payload_hash))


def leaf_hash(record_hash: str) -> str:
    """Create a domain-separated Merkle leaf hash from a record hash."""

    _require_sha256_hex(record_hash, "record_hash")
    return sha256_hex(b"\x00" + bytes.fromhex(record_hash))


def node_hash(left: str, right: str) -> str:
    """Create a domain-separated Merkle internal node hash."""

    _require_sha256_hex(left, "left")
    _require_sha256_hex(right, "right")
    return sha256_hex(b"\x01" + bytes.fromhex(left) + bytes.fromhex(right))


class MerkleTree:
    """Binary Merkle tree with duplicate-last padding for odd levels."""

    def __init__(self, record_hashes: Iterable[str] = ()) -> None:
        self.record_hashes = list(record_hashes)
        self.tree_levels: list[list[str]] = []

    def add_record(self, record_hash: str) -> None:
        _require_sha256_hex(record_hash, "record_hash")
        self.record_hashes.append(record_hash)
        self.tree_levels = []

    def build(self) -> str:
        if not self.record_hashes:
            self.tree_levels = []
            return EMPTY_BATCH_HASH

        current_level = [leaf_hash(record_hash) for record_hash in self.record_hashes]
        self.tree_levels = [current_level]

        while len(current_level) > 1:
            next_level: list[str] = []
            for index in range(0, len(current_level), 2):
                left = current_level[index]
                right = current_level[index + 1] if index + 1 < len(current_level) else left
                next_level.append(node_hash(left, right))
            current_level = next_level
            self.tree_levels.append(current_level)

        return self.tree_levels[-1][0]

    def get_proof(self, index: int) -> list[ProofStep]:
        if not self.tree_levels:
            self.build()
        if index < 0 or index >= len(self.record_hashes):
            raise IndexError("record index is outside the tree")

        proof: list[ProofStep] = []
        node_index = index

        for level in self.tree_levels[:-1]:
            is_right_node = node_index % 2 == 1
            sibling_index = node_index - 1 if is_right_node else node_index + 1
            if sibling_index >= len(level):
                sibling_index = node_index
            proof.append(
                {
                    "direction": "left" if is_right_node else "right",
                    "hash": level[sibling_index],
                }
            )
            node_index //= 2

        return proof


def verify_proof(record_hash: str, proof: Sequence[ProofStep], expected_root: str) -> bool:
    """Verify that a record hash is included in a Merkle root."""

    _require_sha256_hex(expected_root, "expected_root")
    current = leaf_hash(record_hash)

    for step in proof:
        sibling = step["hash"]
        _require_sha256_hex(sibling, "proof hash")
        if step["direction"] == "left":
            current = node_hash(sibling, current)
        elif step["direction"] == "right":
            current = node_hash(current, sibling)
        else:
            raise ValueError("proof direction must be 'left' or 'right'")

    return current == expected_root


def create_integrity_batch(
    *,
    batch_id: str,
    batch_type: str,
    record_hashes: Sequence[str],
    previous_batch_hash: str | None = None,
) -> IntegrityBatch:
    """Build an integrity batch snapshot ready for PostgreSQL JSONB storage."""

    if previous_batch_hash is not None:
        _require_sha256_hex(previous_batch_hash, "previous_batch_hash")

    tree = MerkleTree(record_hashes)
    merkle_root = tree.build()
    return IntegrityBatch(
        batch_id=batch_id,
        batch_type=batch_type,
        record_count=len(record_hashes),
        previous_batch_hash=previous_batch_hash,
        merkle_root=merkle_root,
        tree_levels=tree.tree_levels,
    )


def _is_sha256_hex(value: str) -> bool:
    if len(value) != 64:
        return False
    try:
        int(value, 16)
    except ValueError:
        return False
    return True


def _require_sha256_hex(value: str, name: str) -> None:
    if not _is_sha256_hex(value):
        raise ValueError(f"{name} must be a 64-character SHA-256 hex string")
