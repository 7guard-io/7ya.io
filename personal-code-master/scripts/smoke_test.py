#!/usr/bin/env python3
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]

REQUIRED_FILES = [
    'Dockerfile',
    'docker-compose.yml',
    'package.json',
    'server.js',
    'context/tailwind-rules.md',
]

REQUIRED_RULE_TOKENS = [
    'Strictly Dark Mode',
    'bg-black',
    'bg-gray-900',
    'bg-gray-800',
    'text-white',
    'text-gray-300',
    'text-gray-400',
    'text-cyan-400',
    'bg-cyan-500',
    'border-cyan-500',
    'text-orange-400',
    'bg-orange-500',
    'No white backgrounds',
    'No blue/red/green generic colors',
    'use exclusively Tailwind utility classes',
]

REQUIRED_SERVER_TOKENS = [
    'GEMINI_API_KEY',
    'tailwind-rules.md',
    'readRequiredFile',
    'temperature: 0.0',
    'MASTER_SYSTEM_INSTRUCTION',
    'executeSupremeMaster',
]


def fail(message: str) -> None:
    print(f'FAIL: {message}', file=sys.stderr)
    raise SystemExit(1)


def assert_contains(label: str, content: str, tokens: list[str]) -> None:
    missing = [token for token in tokens if token not in content]
    if missing:
        fail(f'{label} missing required tokens: {missing}')


def main() -> None:
    for relative_path in REQUIRED_FILES:
        if not (ROOT / relative_path).exists():
            fail(f'missing required file: {relative_path}')

    rules = (ROOT / 'context/tailwind-rules.md').read_text(encoding='utf-8')
    server = (ROOT / 'server.js').read_text(encoding='utf-8')
    dockerfile = (ROOT / 'Dockerfile').read_text(encoding='utf-8')
    compose = (ROOT / 'docker-compose.yml').read_text(encoding='utf-8')

    assert_contains('tailwind-rules.md', rules, REQUIRED_RULE_TOKENS)
    assert_contains('server.js', server, REQUIRED_SERVER_TOKENS)

    if 'node:20-alpine' not in dockerfile:
        fail('Dockerfile must use node:20-alpine')

    if 'GEMINI_API_KEY' not in compose or './context:/app/context:ro' not in compose:
        fail('docker-compose.yml must inject GEMINI_API_KEY and mount context read-only')

    print('PASS: personal-code-master smoke test completed successfully')


if __name__ == '__main__':
    main()
