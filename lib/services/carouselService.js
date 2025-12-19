import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";

const CAROUSEL_COLLECTION = "carousel_ads";

/**
 * Get all active carousel ads
 * Note: Requires Firestore composite index on (isActive, order)
 * @returns {Promise<Array>} Array of carousel ad objects
 */
export const getCarouselAds = async () => {
  try {
    const q = query(
      collection(db, CAROUSEL_COLLECTION),
      where("isActive", "==", true),
      orderBy("order", "asc")
    );
    const querySnapshot = await getDocs(q);
    const ads = [];
    querySnapshot.forEach((doc) => {
      ads.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return { success: true, data: ads };
  } catch (error) {
    console.error("Error fetching carousel ads:", error);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Get all carousel ads (including inactive) - for admin
 * @returns {Promise<Array>} Array of all carousel ad objects
 */
export const getAllCarouselAds = async () => {
  try {
    const q = query(
      collection(db, CAROUSEL_COLLECTION),
      orderBy("order", "asc")
    );
    const querySnapshot = await getDocs(q);
    const ads = [];
    querySnapshot.forEach((doc) => {
      ads.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return { success: true, data: ads };
  } catch (error) {
    console.error("Error fetching all carousel ads:", error);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Add a new carousel ad
 * @param {Object} adData - Carousel ad data
 * @param {string} adData.title - Ad title
 * @param {string} adData.description - Ad description
 * @param {string} adData.image - Image URL or background class
 * @param {string} adData.link - Optional link URL
 * @param {number} adData.order - Display order
 * @param {boolean} adData.isActive - Whether ad is active
 * @returns {Promise<Object>}
 */
export const addCarouselAd = async (adData) => {
  try {
    const newAd = {
      ...adData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    const docRef = await addDoc(collection(db, CAROUSEL_COLLECTION), newAd);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding carousel ad:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Update a carousel ad
 * @param {string} adId - Document ID
 * @param {Object} adData - Updated carousel ad data
 * @returns {Promise<Object>}
 */
export const updateCarouselAd = async (adId, adData) => {
  try {
    const adRef = doc(db, CAROUSEL_COLLECTION, adId);
    await updateDoc(adRef, {
      ...adData,
      updatedAt: Timestamp.now(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating carousel ad:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete a carousel ad
 * @param {string} adId - Document ID
 * @returns {Promise<Object>}
 */
export const deleteCarouselAd = async (adId) => {
  try {
    await deleteDoc(doc(db, CAROUSEL_COLLECTION, adId));
    return { success: true };
  } catch (error) {
    console.error("Error deleting carousel ad:", error);
    return { success: false, error: error.message };
  }
};

