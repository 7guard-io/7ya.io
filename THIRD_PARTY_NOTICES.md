# Third Party Notices — 7ya.io

This page contains attribution notices for third-party open-source software used in 7ya.io and its application examples. It is intended as a compliance register generated from the project's actual dependency manifests, not from a third-party notice bundle for another product.

Last updated: 2026-07-07

> Legal note: this file is operational compliance documentation, not legal advice. Re-run the dependency scan before each release and verify package-level `LICENSE` and `NOTICE` files for any package that is shipped to users.

## Compliance Status

- Source of truth: `package-lock.json`, lesson-level `package-lock.json` files, `requirements.txt`, and lesson-level `requirements.txt` files.
- Review status: pending full dependency scan across every lesson and deployment target.
- Current baseline scan: root Node.js production dependency tree from `npm ls --omit=dev --json`.
- Distribution surface: website, API, static assets, lesson examples, documentation tooling, and internal tooling.
- Do not copy third-party notice bundles from unrelated products unless the exact packages and versions are actually used by this repository.

## License Classes

### Apache License 2.0

Required action:

- Retain copyright notices.
- Include the Apache License 2.0 text with redistributed copies.
- Preserve upstream `NOTICE` file contents where applicable.
- Mark modified files when redistributed.
- Track patent, trademark, and attribution requirements separately from copyright notices.

### Apache License 2.0 WITH LLVM Exception

Required action:

- Treat LLVM-related dependencies as separate compliance rows.
- Preserve the Apache License 2.0 text and the LLVM exception text where applicable.
- Verify whether any embedded object-code distribution changes notice placement requirements.

### MIT / Public Domain or MIT

Required action:

- Include the copyright notice.
- Include the permission notice.
- Preserve warranty and liability disclaimers.

### BSD / Boost / zlib / bzip2-style Licenses

Required action:

- Preserve notices and disclaimers.
- Do not imply upstream endorsement.
- Mark altered source versions where the license requires it.
- Keep notice text in source bundles and legal notices for shipped copies.

### CC0

Required action:

- Record attribution for transparency, even where attribution is not strictly required.
- Keep provenance details so future audits can distinguish CC0 assets from code under reciprocal or notice-preserving licenses.

## Dependency Register

This initial register is intentionally limited to the root production Node.js dependency tree. Lesson-specific applications and Python requirements still need a full package-by-package notice extraction pass before release.

| Package | Version | License | Used In | Notice Required | Status |
|---|---:|---|---|---|---|
| `@azure-rest/ai-inference` | 1.0.0-beta.2 | MIT | Root app examples / AI inference client | Yes — retain MIT notice and disclaimer | baseline scanned |
| `@azure/core-auth` | 1.10.1 | MIT | Root app examples / Azure authentication helpers | Yes — retain MIT notice and disclaimer | baseline scanned |
| `openai` | 6.44.0 | Apache-2.0 | Root app examples / OpenAI API client | Yes — retain Apache 2.0 license and any upstream notices | baseline scanned |
| `typescript` | 5.9.3 | Apache-2.0 | Root dependency tree / TypeScript support | Yes — retain Apache 2.0 license and any upstream notices | baseline scanned |
| Lesson-level Node dependencies | TBD | TBD | `06-*`, `07-*`, `08-*`, `09-*`, `11-*` TypeScript and JavaScript examples | TBD after lockfile scan | pending scan |
| Python dependencies | TBD | TBD | Root and lesson-level Python examples | TBD after requirements scan | pending scan |

## Release Checklist

Before a public 7ya.io release:

1. Inventory every deployed package from the lockfile used for that release.
2. Exclude development-only dependencies unless development tooling is redistributed.
3. Extract package names, versions, license identifiers, copyright notices, and bundled `NOTICE` files.
4. Review packages with `UNKNOWN`, custom, deprecated, or multi-license declarations.
5. Preserve warranty and liability disclaimers exactly as required by each upstream license.
6. Add any static assets, fonts, model files, datasets, and documentation snippets that are not captured by package managers.
7. Update this file's dependency register and last-updated date.

## Practical Scan Commands

Use these commands as a starting point for the next compliance pass:

```bash
npm ls --omit=dev --json
find . -name package-lock.json -print
find . -name requirements.txt -print
```

For Python dependencies, resolve pinned transitive packages in a clean environment before recording notices. For Node.js dependencies, inspect each package's `package.json`, `LICENSE`, and `NOTICE` files rather than relying only on SPDX fields in lockfiles.
