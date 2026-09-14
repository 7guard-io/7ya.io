#!/usr/bin/env python3
"""Create a local 7YA VideoContent ledger from MP4 files using ffprobe and ffmpeg.
The script runs entirely on the local machine. It extracts a 1280x720 JPEG
poster at 00:00:01 for every MP4 and writes a ContentLedger-compatible JSON file.
"""
from __future__ import annotations
import argparse
import hashlib
import json
import shutil
import subprocess
import sys
from datetime import UTC, datetime
from pathlib import Path
from typing import Any
from urllib.parse import quote

def command_exists(command: str) -> bool:
    return shutil.which(command) is not None

def run(command: list[str]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(command, check=True, capture_output=True, text=True)

def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open('rb') as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b''):
            digest.update(chunk)
    return f'sha256:{digest.hexdigest()}'

def utc_iso(timestamp: float) -> str:
    return datetime.fromtimestamp(timestamp, UTC).isoformat(timespec='milliseconds').replace('+00:00', 'Z')

def now_iso() -> str:
    return datetime.now(UTC).isoformat(timespec='milliseconds').replace('+00:00', 'Z')

def slugify(value: str) -> str:
    normalized = ''.join(character.lower() if character.isalnum() else '-' for character in value)
    return '-'.join(part for part in normalized.split('-') if part) or 'video'

def public_url(base_url: str, filename: str) -> str:
    return f"{base_url.rstrip('/')}/{quote(filename)}"

def probe_video(ffprobe: str, video_path: Path) -> tuple[int, int, int]:
    result = run([
        ffprobe,
        '-v', 'error',
        '-select_streams', 'v:0',
        '-show_entries', 'stream=width,height:format=duration',
        '-of', 'json',
        str(video_path),
    ])
    payload = json.loads(result.stdout)
    stream = payload.get('streams', [{}])[0]
    duration_seconds = float(payload.get('format', {}).get('duration', 0))
    width = int(stream['width'])
    height = int(stream['height'])
    return width, height, max(0, round(duration_seconds * 1000))

def extract_poster(ffmpeg: str, video_path: Path, poster_path: Path) -> None:
    poster_path.parent.mkdir(parents=True, exist_ok=True)
    run([
        ffmpeg,
        '-y',
        '-ss', '00:00:01',
        '-i', str(video_path),
        '-frames:v', '1',
        '-vf', 'scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:black',
        '-q:v', '2',
        str(poster_path),
    ])

def localized(value: str) -> dict[str, str]:
    return {'he': value, 'en': value, 'ru': value}

def build_video_content(
    video_path: Path,
    content_id: str,
    stream_url: str,
    poster_url: str,
    width: int,
    height: int,
    duration_ms: int,
    poster_checksum: str,
    publication_status: str,
    visibility: str,
    tags: list[str],
) -> dict[str, Any]:
    source_mtime = utc_iso(video_path.stat().st_mtime)
    title = video_path.stem.replace('_', ' ').replace('-', ' ').strip()
    title = ' '.join(part.capitalize() for part in title.split())
    source_checksum = sha256_file(video_path)
    return {
        'id': content_id,
        'kind': 'video',
        'slug': localized(slugify(video_path.stem)),
        'title': localized(title),
        'summary': localized(f'Local media ingestion: {video_path.name}'),
        'tags': tags,
        'publication': {
            'status': publication_status,
            'visibility': visibility,
            'publishedAt': now_iso() if publication_status == 'published' else None,
        },
        'createdAt': source_mtime,
        'updatedAt': now_iso(),
        'provenance': {
            'verification': 'verified',
            'verifiedAt': now_iso(),
            'references': [{
                'title': f'Local source: {video_path.name}',
                'url': stream_url,
                'retrievedAt': now_iso(),
                'contentHash': source_checksum,
            }],
        },
        'format': 'short',
        'media': {
            'id': f'asset-{content_id}',
            'kind': 'video',
            'durationMs': duration_ms,
            'width': width,
            'height': height,
            'poster': {
                'id': f'poster-{content_id}',
                'kind': 'image',
                'url': poster_url,
                'mimeType': 'image/jpeg',
                'width': 1280,
                'height': 720,
                'alt': localized(f'Poster for {title}'),
                'checksum': poster_checksum,
            },
            'streams': [{
                'url': stream_url,
                'format': 'progressive',
                'mimeType': 'video/mp4',
                'width': width,
                'height': height,
            }],
            'checksum': source_checksum,
        },
    }

def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description='Ingest local MP4 files into a 7YA VideoContent ledger.')
    parser.add_argument('input_dir', type=Path, help='Directory containing local MP4 files; scanned recursively.')
    parser.add_argument('--output', type=Path, default=Path('content-ledger.json'), help='Output ContentLedger JSON path.')
    parser.add_argument('--poster-dir', type=Path, default=Path('public/media/posters'), help='Directory for generated 1280x720 JPEG posters.')
    parser.add_argument('--media-url-base', default='/media', help='Public URL base for MP4 delivery.')
    parser.add_argument('--poster-url-base', default='/media/posters', help='Public URL base for generated posters.')
    parser.add_argument('--tag', action='append', default=[], help='Repeatable tag attached to every ingested video.')
    parser.add_argument('--status', choices=['draft', 'scheduled', 'published', 'archived'], default='draft')
    parser.add_argument('--visibility', choices=['public', 'unlisted', 'private'], default='unlisted')
    parser.add_argument('--ffmpeg', default='ffmpeg')
    parser.add_argument('--ffprobe', default='ffprobe')
    return parser.parse_args()

def main() -> int:
    args = parse_arguments()
    if not command_exists(args.ffmpeg) or not command_exists(args.ffprobe):
        print('ffmpeg and ffprobe must be installed and available on PATH.', file=sys.stderr)
        return 2
    if not args.input_dir.is_dir():
        print(f'Input directory does not exist: {args.input_dir}', file=sys.stderr)
        return 2
    mp4_files = sorted(path for path in args.input_dir.rglob('*.mp4') if path.is_file())
    if not mp4_files:
        print(f'No MP4 files found under: {args.input_dir}', file=sys.stderr)
        return 1
    items: list[dict[str, Any]] = []
    for video_path in mp4_files:
        relative_path = video_path.relative_to(args.input_dir)
        content_id = f"video-{slugify(relative_path.with_suffix('').as_posix())}"
        poster_filename = f'{content_id}.jpg'
        poster_path = args.poster_dir / poster_filename
        stream_url = public_url(args.media_url_base, relative_path.as_posix())
        poster_url = public_url(args.poster_url_base, poster_filename)
        try:
            width, height, duration_ms = probe_video(args.ffprobe, video_path)
            extract_poster(args.ffmpeg, video_path, poster_path)
            items.append(build_video_content(
                video_path=video_path,
                content_id=content_id,
                stream_url=stream_url,
                poster_url=poster_url,
                width=width,
                height=height,
                duration_ms=duration_ms,
                poster_checksum=sha256_file(poster_path),
                publication_status=args.status,
                visibility=args.visibility,
                tags=args.tag or ['local-ingestion'],
            ))
        except (KeyError, ValueError, subprocess.CalledProcessError) as error:
            print(f'Failed to ingest {video_path}: {error}', file=sys.stderr)
            return 1
    ledger = {
        'schemaVersion': '1.0',
        'generatedAt': now_iso(),
        'defaultLocale': 'he',
        'items': items,
        'feeds': [{
            'id': 'feed-local-video-ingestion',
            'slug': localized('local-video-ingestion'),
            'title': localized('Local video ingestion'),
            'description': localized('VideoContent generated locally with ffmpeg and ffprobe.'),
            'selection': {'mode': 'manual', 'itemIds': [item['id'] for item in items]},
            'sort': 'manual',
        }],
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(ledger, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'Ingested {len(items)} MP4 file(s) into {args.output}')
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
