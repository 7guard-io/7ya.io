#!/usr/bin/env python3
from pathlib import Path
import json
import sys

ROOT = Path(__file__).resolve().parents[1]

REQUIRED_FILES = [
    'Dockerfile',
    'docker-compose.yml',
    'package.json',
    'package-lock.json',
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
    "import 'dotenv/config'",
    "from '@google/genai'",
    'GEMINI_API_KEY',
    'gemini-3.5-flash',
    'tailwind-rules.md',
    'readRequiredFile',
    'temperature: 0.0',
    'seed: 7',
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
    env_example = (ROOT / '.env.example').read_text(encoding='utf-8')
    package = json.loads((ROOT / 'package.json').read_text(encoding='utf-8'))

    assert_contains('tailwind-rules.md', rules, REQUIRED_RULE_TOKENS)
    assert_contains('server.js', server, REQUIRED_SERVER_TOKENS)

    dependencies = package.get('dependencies', {})
    if dependencies.get('@google/genai') != '2.11.0' or dependencies.get('dotenv') != '17.4.2':
        fail('package.json must pin the current Google GenAI SDK and dotenv versions')

    if 'node:20-alpine' not in dockerfile or 'npm ci --omit=dev' not in dockerfile or 'USER node' not in dockerfile:
        fail('Dockerfile must use Node 20, npm ci, and a non-root runtime user')

    if 'GEMINI_API_KEY' not in compose or 'read_only: true' not in compose or 'no-new-privileges:true' not in compose:
        fail('docker-compose.yml must inject the API key and harden the runtime')

    if 'gemini-3.5-flash' not in env_example:
        fail('.env.example must use the current stable default model')

    print('PASS: personal-code-master smoke test completed successfully')


if __name__ == '__main__':
    main()
