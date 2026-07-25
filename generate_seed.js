const fs = require('fs');
const xlsx = require('xlsx');

const wb = xlsx.readFile('../Claim List.xlsx');
const ws = wb.Sheets[wb.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(ws);

const uuid = () => Math.random().toString(36).substring(2, 9);

const claims = data.slice(1).map(row => ({
  id: uuid(),
  companyName: String(row['Claim List'] || ''),
  reportingDate: String(row['__EMPTY'] || ''),
  createdBy: String(row['__EMPTY_1'] || ''),
  dailyClaimsReceived: String(row['__EMPTY_2'] || '-'),
  dailyFirstVisitCompleted: String(row['__EMPTY_3'] || '-'),
  dailyApproxClaimAmount: String(row['__EMPTY_4'] || '-'),
  cumulativeClaimsReceived: String(row['__EMPTY_5'] || '-'),
  cumulativeFirstVisitCompleted: String(row['__EMPTY_6'] || '-'),
  cumulativeApproxClaimAmount: String(row['__EMPTY_7'] || '-'),
  approvedClaimsCount: String(row['__EMPTY_8'] || '-'),
  approvedClaimAmount: String(row['__EMPTY_9'] || '-'),
  motorWithdrawClaimsCount: String(row['__EMPTY_10'] || '-'),
  rejectedClaimsCount: String(row['__EMPTY_11'] || '-'),
  rejectionReason: String(row['__EMPTY_12'] || '-'),
  propertyDailyClaimsReceived: String(row['__EMPTY_13'] || '-'),
  propertyDailyFirstVisitCompleted: String(row['__EMPTY_14'] || '-'),
  propertyDailyApproxClaimAmount: String(row['__EMPTY_15'] || '-'),
  propertyCumulativeClaimsReceived: String(row['__EMPTY_16'] || '-'),
  propertyCumulativeFirstVisitCompleted: String(row['__EMPTY_17'] || '-'),
  propertyCumulativeApproxClaimAmount: String(row['__EMPTY_18'] || '-'),
  propertyApprovedClaimsCount: String(row['__EMPTY_19'] || '-'),
  propertyApprovedClaimAmount: String(row['__EMPTY_20'] || '-'),
  propertyRejectedClaimsCount: String(row['__EMPTY_21'] || '-'),
  propertyWithdrawClaimsCount: String(row['__EMPTY_22'] || '-'),
  propertyRejectionReason: String(row['__EMPTY_23'] || '-'),
  createdDate: String(row['__EMPTY_24'] || ''),
  timestamp: Date.now()
}));

const fileContent = 'import { ClaimData } from "@/types/claim";\n\nexport const seedData: ClaimData[] = ' + JSON.stringify(claims, null, 2) + ';\n';
fs.writeFileSync('src/lib/seedData.ts', fileContent);
console.log('Generated src/lib/seedData.ts with ' + claims.length + ' claims');
