import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";

const CONTACT_DOC = "contact_info";

/**
 * Get contact information
 * @returns {Promise<Object>} Contact information object
 */
export const getContactInfo = async () => {
  try {
    const docRef = doc(db, CONTACT_DOC, "main");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        success: true,
        data: {
          id: docSnap.id,
          ...data,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        },
      };
    } else {
      // Return default contact info if document doesn't exist
      return {
        success: true,
        data: {
          email: "contact@codeskytz.com",
          phone: "+1 (555) 123-4567",
          address: "123 Tech Street, Digital City, DC 12345",
          socialLinks: {
            facebook: "",
            twitter: "",
            instagram: "",
            linkedin: "",
            github: "",
            youtube: "",
          },
        },
      };
    }
  } catch (error) {
    console.error("Error fetching contact info:", error);
    return {
      success: false,
      error: error.message,
      data: {
        email: "contact@codeskytz.com",
        phone: "+1 (555) 123-4567",
        address: "123 Tech Street, Digital City, DC 12345",
        socialLinks: {
          facebook: "",
          twitter: "",
          instagram: "",
          linkedin: "",
          github: "",
          youtube: "",
        },
      },
    };
  }
};

/**
 * Update contact information
 * @param {Object} contactData - Contact information to update
 * @param {string} contactData.email - Email address
 * @param {string} contactData.phone - Phone number
 * @param {string} contactData.address - Physical address
 * @param {Object} contactData.socialLinks - Social media links
 * @param {string} contactData.socialLinks.facebook - Facebook URL
 * @param {string} contactData.socialLinks.twitter - Twitter URL
 * @param {string} contactData.socialLinks.instagram - Instagram URL
 * @param {string} contactData.socialLinks.linkedin - LinkedIn URL
 * @param {string} contactData.socialLinks.github - GitHub URL
 * @param {string} contactData.socialLinks.youtube - YouTube URL
 * @returns {Promise<Object>}
 */
export const updateContactInfo = async (contactData) => {
  try {
    const docRef = doc(db, CONTACT_DOC, "main");
    
    // Check if document exists
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      // Update existing document
      await updateDoc(docRef, {
        ...contactData,
        updatedAt: Timestamp.now(),
      });
    } else {
      // Create new document
      await setDoc(docRef, {
        ...contactData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating contact info:", error);
    return { success: false, error: error.message };
  }
};

