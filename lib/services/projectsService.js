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

const PROJECTS_COLLECTION = "projects";

/**
 * Get all active projects
 * Note: Requires Firestore composite index on (isActive, order)
 * @returns {Promise<Array>} Array of project objects
 */
export const getProjects = async () => {
  try {
    const q = query(
      collection(db, PROJECTS_COLLECTION),
      where("isActive", "==", true),
      orderBy("order", "asc")
    );
    const querySnapshot = await getDocs(q);
    const projects = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      projects.push({
        id: doc.id,
        ...data,
        // Convert Firestore Timestamp to JavaScript Date if needed
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
      });
    });
    return { success: true, data: projects };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Get all projects (including inactive) - for admin
 * @returns {Promise<Array>} Array of all project objects
 */
export const getAllProjects = async () => {
  try {
    const q = query(
      collection(db, PROJECTS_COLLECTION),
      orderBy("order", "asc")
    );
    const querySnapshot = await getDocs(q);
    const projects = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      projects.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
      });
    });
    return { success: true, data: projects };
  } catch (error) {
    console.error("Error fetching all projects:", error);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Get a single project by ID
 * @param {string} projectId - Project document ID
 * @returns {Promise<Object>}
 */
export const getProjectById = async (projectId) => {
  try {
    const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
    const projectSnap = await getDocs(collection(db, PROJECTS_COLLECTION));
    let project = null;
    projectSnap.forEach((doc) => {
      if (doc.id === projectId) {
        const data = doc.data();
        project = {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        };
      }
    });
    return { success: true, data: project };
  } catch (error) {
    console.error("Error fetching project:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Add a new project
 * @param {Object} projectData - Project data
 * @param {string} projectData.title - Project title
 * @param {string} projectData.description - Project description
 * @param {Array} projectData.tech - Array of technology tags
 * @param {string} projectData.image - Image URL or background class
 * @param {string} projectData.link - Project link URL
 * @param {string} projectData.codeLink - Code repository link
 * @param {number} projectData.order - Display order
 * @param {boolean} projectData.isActive - Whether project is active
 * @returns {Promise<Object>}
 */
export const addProject = async (projectData) => {
  try {
    const newProject = {
      ...projectData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), newProject);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding project:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Update a project
 * @param {string} projectId - Document ID
 * @param {Object} projectData - Updated project data
 * @returns {Promise<Object>}
 */
export const updateProject = async (projectId, projectData) => {
  try {
    const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
    await updateDoc(projectRef, {
      ...projectData,
      updatedAt: Timestamp.now(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating project:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete a project
 * @param {string} projectId - Document ID
 * @returns {Promise<Object>}
 */
export const deleteProject = async (projectId) => {
  try {
    await deleteDoc(doc(db, PROJECTS_COLLECTION, projectId));
    return { success: true };
  } catch (error) {
    console.error("Error deleting project:", error);
    return { success: false, error: error.message };
  }
};

