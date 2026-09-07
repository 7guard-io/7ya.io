export function classify(state = {}) {
  const {
    capture = false,
    canonical = false,
    equal,
    runtimeClass = false,
    binaryVerified = false,
    providerSpecific = false,
    generatedAsset = false,
    historicalUnused = false
  } = state;

  if (binaryVerified) return 'binary-verified';
  if (capture && canonical && equal === true) return 'identical';
  if (capture && canonical && equal === false) return 'unresolved';
  if (capture && !canonical && providerSpecific) return 'provider-specific';
  if (capture && !canonical && generatedAsset) return 'generated-asset';
  if (capture && !canonical && historicalUnused) return 'historical-unused';
  if (capture && !canonical && runtimeClass) return 'production-runtime-required';
  if (!capture && canonical) return 'canonical-repository-newer';
  return 'unresolved';
}
