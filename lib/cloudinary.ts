import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
  resource_type: string
  created_at: string
  bytes: number
}

/**
 * Upload image to Cloudinary
 */
export async function uploadImage(
  file: Buffer | string,
  options: {
    folder?: string
    public_id?: string
    transformation?: any
  } = {}
): Promise<CloudinaryUploadResult> {
  try {
    const defaultOptions = {
      folder: 'cropguard-scans',
      resource_type: 'image' as const,
      quality: 'auto:good',
      fetch_format: 'auto',
      ...options
    }

    const result = await cloudinary.uploader.upload(
      typeof file === 'string' ? file : `data:image/jpeg;base64,${file.toString('base64')}`,
      defaultOptions
    )

    return result as CloudinaryUploadResult
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error('Failed to upload image')
  }
}

/**
 * Delete image from Cloudinary
 */
export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    // Don't throw error for delete failures, just log
  }
}

/**
 * Generate optimized image URL
 */
export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number
    height?: number
    quality?: string
    format?: string
  } = {}
): string {
  return cloudinary.url(publicId, {
    width: options.width || 400,
    height: options.height || 300,
    crop: 'fill',
    quality: options.quality || 'auto:good',
    fetch_format: options.format || 'auto',
    ...options
  })
}

export default cloudinary