import db from './connection'
import { MediaData } from '../../models/media'

export async function uploadMedia(media: MediaData) {
  const { capsule_id, image_url } = media

  try {
    const result = await db('medias').insert({
      capsule_id,
      image_url,
    })

    return result
  } catch (error) {
    console.error('Failed to upload image', error)

    throw new Error('Failed to upload media')
  }
}

export async function getCapsuleMedia(capsule_id: number) {
  try {
    return await db('medias').where('capsule_id', capsule_id).first()
  } catch (error) {
    console.error(error)
  }
}
