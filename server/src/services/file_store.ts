import { PutObjectCommand } from '@aws-sdk/client-s3';
import { S3_BUCKET_NAME, s3Client } from '../configs/s3';
import { getPost } from './posts';
import { APIError, Status } from '../types';
import LOGGER from '../configs/logging';

export const uploadImages = async (
  postId: number,
  auth0Id: string,
  images: Express.Multer.File[],
): Promise<void> => {
  const post = await getPost(postId);
  if (post.user.auth0Id !== auth0Id) {
    throw new APIError(Status.FORBIDDEN, 'You are not authorized to upload images for this post');
  }

  const promises = images.map((image) => s3Client.send(new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: `post-${postId}/${image.originalname}`,
    Body: image.buffer,
    ACL: 'public-read',
  })));
  await Promise.all(promises);
  LOGGER.debug(`Uploaded ${images.length} images for post ${postId}`);
};

export default uploadImages;
