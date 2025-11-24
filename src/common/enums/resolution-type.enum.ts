export enum ResolutionType {
  FULLY_RESOLVED = 'FULLY_RESOLVED',        // Resolved, no new referral
  REFERRED_FURTHER = 'REFERRED_FURTHER',    // Not resolved, same condition → another specialist
  RESOLVED_REFERRED = 'RESOLVED_REFERRED',  // Original resolved, found different condition
  UNRESOLVED = 'UNRESOLVED',                // Couldn't help
}
