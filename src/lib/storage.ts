import { ClaimData } from "@/types/claim";

const STORAGE_KEY = "claim_records";

export const saveClaim = (claim: Omit<ClaimData, "id" | "timestamp">): ClaimData => {
  const existingClaims = getClaims();
  
  const newClaim: ClaimData = {
    ...claim,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };

  existingClaims.push(newClaim);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existingClaims));
  
  return newClaim;
};

export const updateClaim = (id: string, updatedData: Partial<ClaimData>): ClaimData | null => {
  const existingClaims = getClaims();
  const index = existingClaims.findIndex(claim => claim.id === id);
  
  if (index === -1) return null;
  
  const updatedClaim = {
    ...existingClaims[index],
    ...updatedData,
    id, 
    timestamp: existingClaims[index].timestamp,
  };
  
  existingClaims[index] = updatedClaim;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existingClaims));
  
  return updatedClaim;
};

export const getClaims = (): ClaimData[] => {
  if (typeof window === "undefined") return [];
  
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  
  try {
    return JSON.parse(data) as ClaimData[];
  } catch (error) {
    console.error("Error parsing claims from local storage", error);
    return [];
  }
};

export const getClaimById = (id: string): ClaimData | null => {
  const existingClaims = getClaims();
  return existingClaims.find(claim => claim.id === id) || null;
};

export const deleteClaim = (id: string): void => {
  const existingClaims = getClaims();
  const filtered = existingClaims.filter(claim => claim.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const seedDatabase = (seedClaims: ClaimData[]): void => {
  if (typeof window === "undefined") return;
  // Overwrite existing claims with seed data for testing
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedClaims));
};

export const clearAllClaims = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
