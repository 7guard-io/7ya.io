# AppDeploy runtime-source reconciliation

**App:** `697a008fddc309b142`  
**Base runtime snapshot:** `1787823326631`  
**Known production rollback snapshot:** `1787828789227`  
**Status:** incomplete source export — do not claim a reproducible React build yet.

The canonical GitHub tree contains a partial `src/` directory. The AppDeploy base snapshot supplies a newer `App.tsx`, but its manifest declares modules that are not present in that snapshot directory. `npm run check:runtime-source` makes unresolved imports visible.

The reconciliation order is: inspect the base manifest, identify later deltas that explicitly declare a missing path, restore only public frontend files with a snapshot/SHA-256 provenance record, then typecheck. Backend files, token material and OAuth secrets remain in AppDeploy and are never mirrored.