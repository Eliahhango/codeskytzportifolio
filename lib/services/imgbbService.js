/**
 * ImgBB API Service for image uploads
 * API Key: a9dd0be8e1260b6bfcff8ea6120c15d5
 */

const IMGBB_API_KEY = 'a9dd0be8e1260b6bfcff8ea6120c15d5'
const IMGBB_API_URL = 'https://api.imgbb.com/1/upload'

/**
 * Upload image to ImgBB
 * @param {File|Blob} imageFile - Image file to upload
 * @returns {Promise<Object>} Result object with success status and image URL
 */
export const uploadImage = async (imageFile) => {
  try {
    // Create FormData
    const formData = new FormData()
    formData.append('image', imageFile)
    formData.append('key', IMGBB_API_KEY)

    // Upload to ImgBB
    const response = await fetch(IMGBB_API_URL, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`)
    }

    const data = await response.json()

    if (data.success) {
      return {
        success: true,
        url: data.data.url,
        displayUrl: data.data.display_url,
        thumbUrl: data.data.thumb?.url || data.data.url,
        deleteUrl: data.data.delete_url,
      }
    } else {
      throw new Error(data.error?.message || 'Upload failed')
    }
  } catch (error) {
    console.error('ImgBB upload error:', error)
    return {
      success: false,
      error: error.message || 'Failed to upload image',
    }
  }
}

/**
 * Upload image from base64 string
 * @param {string} base64String - Base64 encoded image string
 * @returns {Promise<Object>} Result object with success status and image URL
 */
export const uploadImageFromBase64 = async (base64String) => {
  try {
    // Remove data:image/...;base64, prefix if present
    const base64Data = base64String.includes(',')
      ? base64String.split(',')[1]
      : base64String

    const formData = new FormData()
    formData.append('image', base64Data)
    formData.append('key', IMGBB_API_KEY)

    const response = await fetch(IMGBB_API_URL, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`)
    }

    const data = await response.json()

    if (data.success) {
      return {
        success: true,
        url: data.data.url,
        displayUrl: data.data.display_url,
        thumbUrl: data.data.thumb?.url || data.data.url,
        deleteUrl: data.data.delete_url,
      }
    } else {
      throw new Error(data.error?.message || 'Upload failed')
    }
  } catch (error) {
    console.error('ImgBB upload error:', error)
    return {
      success: false,
      error: error.message || 'Failed to upload image',
    }
  }
}

/**
 * Validate image file
 * @param {File} file - File to validate
 * @returns {Object} Validation result
 */
export const validateImageFile = (file) => {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

  if (!file) {
    return { valid: false, error: 'No file selected' }
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload JPEG, PNG, GIF, or WebP image.',
    }
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size too large. Maximum size is 10MB.',
    }
  }

  return { valid: true }
}

