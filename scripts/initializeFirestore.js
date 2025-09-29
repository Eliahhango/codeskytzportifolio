import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Firebase Admin
try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');
  
  if (!serviceAccount.project_id) {
    throw new Error('Invalid service account configuration');
  }

  // Fix private key formatting
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  }

  initializeApp({
    credential: cert(serviceAccount)
  });
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  process.exit(1);
}

const db = getFirestore();

// Collection names
const COLLECTIONS = {
  PROJECTS: 'projects',
  SERVICES: 'services',
  FOUNDERS: 'founders',
  COMMENTS: 'comments',
  CONTACT: 'contact',
  ADS: 'ads'
};

// Sample data structure for each collection
const sampleProject = {
  title: 'Sample Project',
  description: 'This is a sample project description',
  technologies: ['React', 'Firebase', 'NextJS'],
  images: [],
  githubUrl: 'https://github.com/sample/project',
  liveUrl: 'https://sample-project.com',
  createdAt: new Date(),
  updatedAt: new Date()
};

const sampleService = {
  title: 'Web Development',
  description: 'Full stack web development services',
  icon: 'web',
  features: ['Custom Web Applications', 'E-commerce Solutions', 'API Development'],
  createdAt: new Date()
};

const sampleFounder = {
  name: 'John Doe',
  position: 'CEO & Founder',
  bio: 'Experienced developer with 5+ years in web development',
  image: '',
  socialLinks: {
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
    twitter: 'https://twitter.com/johndoe'
  },
  createdAt: new Date()
};

const sampleComment = {
  author: 'Jane Smith',
  content: 'Great work on this project!',
  projectId: 'sample-project-id',
  createdAt: new Date()
};

const sampleContact = {
  name: 'Jane Smith',
  email: 'jane@example.com',
  subject: 'Project Inquiry',
  message: 'I would like to discuss a potential project',
  createdAt: new Date(),
  status: 'new' // new, read, responded
};

const sampleAd = {
  title: 'Special Offer',
  description: 'Get 20% off on web development services',
  image: '',
  link: 'https://example.com/offer',
  startDate: new Date(),
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  isActive: true,
  createdAt: new Date()
};

// Initialize collections with sample data
async function initializeCollections() {
  try {
    // Add sample data to each collection
    await Promise.all([
      db.collection(COLLECTIONS.PROJECTS).add(sampleProject),
      db.collection(COLLECTIONS.SERVICES).add(sampleService),
      db.collection(COLLECTIONS.FOUNDERS).add(sampleFounder),
      db.collection(COLLECTIONS.COMMENTS).add(sampleComment),
      db.collection(COLLECTIONS.CONTACT).add(sampleContact),
      db.collection(COLLECTIONS.ADS).add(sampleAd)
    ]);
    console.log('Successfully initialized Firestore collections with sample data');
  } catch (error) {
    console.error('Error initializing collections:', error);
  }
}

// Run the initialization
initializeCollections();

// Run the initialization
initializeCollections();