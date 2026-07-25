export interface ClaimData {
  id: string; // generated UUID
  companyName: string;
  reportingDate: string;
  createdBy: string;

  // Motor Claims
  dailyClaimsReceived: string;
  dailyFirstVisitCompleted: string;
  dailyApproxClaimAmount: string;
  cumulativeClaimsReceived: string;
  cumulativeFirstVisitCompleted: string;
  cumulativeApproxClaimAmount: string;
  approvedClaimsCount: string;
  approvedClaimAmount: string;
  motorWithdrawClaimsCount: string;
  rejectedClaimsCount: string;
  rejectionReason: string;

  // Property Claims
  propertyDailyClaimsReceived: string;
  propertyDailyFirstVisitCompleted: string;
  propertyDailyApproxClaimAmount: string;
  propertyCumulativeClaimsReceived: string;
  propertyCumulativeFirstVisitCompleted: string;
  propertyCumulativeApproxClaimAmount: string;
  propertyApprovedClaimsCount: string;
  propertyApprovedClaimAmount: string;
  propertyRejectedClaimsCount: string;
  propertyWithdrawClaimsCount: string;
  propertyRejectionReason: string;

  createdDate: string;
  timestamp: number; // for sorting
}
