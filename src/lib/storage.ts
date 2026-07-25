import { ClaimData } from "@/types/claim";
import { db } from "./firebase";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs, 
  getDoc, 
  deleteDoc, 
  writeBatch 
} from "firebase/firestore";

const COLLECTION_NAME = "claims";

export const saveClaim = async (claim: Omit<ClaimData, "id" | "timestamp">): Promise<ClaimData> => {
  const newClaimData = {
    ...claim,
    timestamp: Date.now(),
  };

  // Add a new document with a generated id
  const docRef = await addDoc(collection(db, COLLECTION_NAME), newClaimData);
  
  return {
    ...newClaimData,
    id: docRef.id,
  };
};

export const updateClaim = async (id: string, updatedData: Partial<ClaimData>): Promise<ClaimData | null> => {
  const claimRef = doc(db, COLLECTION_NAME, id);
  
  // Create a clean object without the id for Firestore
  const dataToUpdate = { ...updatedData };
  delete dataToUpdate.id; // We don't want to save the id as a field if it's already the document key

  await updateDoc(claimRef, dataToUpdate);
  
  // Return the updated claim by merging it (or we could fetch it again, but merging is faster)
  return {
    ...updatedData,
    id,
  } as ClaimData;
};

export const getClaims = async (): Promise<ClaimData[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const claims: ClaimData[] = [];
    
    querySnapshot.forEach((doc) => {
      claims.push({
        id: doc.id,
        ...doc.data()
      } as ClaimData);
    });
    
    // Sort by timestamp descending (newest first)
    return claims.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  } catch (error) {
    console.error("Error fetching claims from Firestore:", error);
    return [];
  }
};

export const getClaimById = async (id: string): Promise<ClaimData | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as ClaimData;
    }
    return null;
  } catch (error) {
    console.error("Error fetching claim by id:", error);
    return null;
  }
};

export const deleteClaim = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error("Error deleting claim:", error);
  }
};

export const seedDatabase = async (seedClaims: ClaimData[]): Promise<void> => {
  try {
    // First, clear existing claims so we don't duplicate on every seed
    await clearAllClaims();
    
    // Use a batch write for better performance when seeding
    const batch = writeBatch(db);
    
    seedClaims.forEach((claim) => {
      // Create a new ref with a generated ID
      const newDocRef = doc(collection(db, COLLECTION_NAME));
      
      // Ensure we don't push the hardcoded ID into Firestore, let Firestore use the doc ID
      const { id, ...claimDataWithoutId } = claim;
      batch.set(newDocRef, claimDataWithoutId);
    });
    
    // Commit the batch
    await batch.commit();
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

export const clearAllClaims = async (): Promise<void> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const batch = writeBatch(db);
    
    querySnapshot.forEach((document) => {
      batch.delete(doc(db, COLLECTION_NAME, document.id));
    });
    
    if (querySnapshot.size > 0) {
      await batch.commit();
    }
  } catch (error) {
    console.error("Error clearing database:", error);
  }
};
