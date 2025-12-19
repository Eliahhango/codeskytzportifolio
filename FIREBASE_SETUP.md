# Firebase Setup Guide

## Firestore Database Structure

### Collections

#### 1. `carousel_ads` Collection
Structure for carousel advertisements:
```javascript
{
  title: string,
  description: string,
  image: string, // URL or Tailwind class (e.g., 'bg-ocean-blue')
  link: string, // Optional CTA link
  order: number, // Display order
  isActive: boolean, // Whether ad is active
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### 2. `projects` Collection
Structure for portfolio projects:
```javascript
{
  title: string,
  description: string,
  tech: array, // Array of technology strings
  image: string, // URL or Tailwind class
  link: string, // Optional project link
  codeLink: string, // Optional code repository link
  order: number, // Display order
  isActive: boolean, // Whether project is active
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## Required Firestore Indexes

You need to create composite indexes in Firebase Console for the following queries:

### 1. Carousel Ads Index
- Collection: `carousel_ads`
- Fields: `isActive` (Ascending), `order` (Ascending)

### 2. Projects Index
- Collection: `projects`
- Fields: `isActive` (Ascending), `order` (Ascending)

### How to Create Indexes:

1. Go to Firebase Console → Firestore Database → Indexes
2. Click "Create Index"
3. Select the collection name
4. Add the fields in the order specified above
5. Click "Create"

Alternatively, Firebase will prompt you to create these indexes when you first run queries that require them.

## Security Rules

Set up Firestore security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Carousel ads - read for all, write for authenticated users
    match /carousel_ads/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Projects - read for all, write for authenticated users
    match /projects/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Authentication Setup

1. Go to Firebase Console → Authentication
2. Enable "Email/Password" sign-in method
3. Create admin users through the Authentication section

## Storage Setup (for image uploads)

1. Go to Firebase Console → Storage
2. Create a storage bucket if not already created
3. Set up security rules for image uploads (if needed)

## Services Available

### Auth Service (`lib/services/authService.js`)
- `signIn(email, password)` - Sign in user
- `signUp(email, password)` - Sign up new user
- `logout()` - Sign out user
- `getCurrentUser()` - Get current authenticated user
- `onAuthChange(callback)` - Listen to auth state changes

### Carousel Service (`lib/services/carouselService.js`)
- `getCarouselAds()` - Get all active carousel ads
- `getAllCarouselAds()` - Get all ads (for admin)
- `addCarouselAd(adData)` - Add new carousel ad
- `updateCarouselAd(adId, adData)` - Update carousel ad
- `deleteCarouselAd(adId)` - Delete carousel ad

### Projects Service (`lib/services/projectsService.js`)
- `getProjects()` - Get all active projects
- `getAllProjects()` - Get all projects (for admin)
- `getProjectById(projectId)` - Get single project
- `addProject(projectData)` - Add new project
- `updateProject(projectId, projectData)` - Update project
- `deleteProject(projectId)` - Delete project

