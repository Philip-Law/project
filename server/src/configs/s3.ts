import {
  CreateBucketCommand, HeadBucketCommand, PutBucketPolicyCommand, S3Client,
} from '@aws-sdk/client-s3';
import LOGGER from './logging';

export const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!!,
    secretAccessKey: process.env.S3_SECRET_KEY!!,
  },
  forcePathStyle: true,
});

export const S3_BUCKET_NAME = process.env.S3_BUCKET || 'tmu-connect';

export const S3_PUBLIC_URL = `${process.env.S3_ENDPOINT}/${S3_BUCKET_NAME}`;

export const setupBucketAndPolicy = async () => {
  try {
    await s3Client.send(new HeadBucketCommand({
      Bucket: S3_BUCKET_NAME,
    }));
    LOGGER.debug('S3 bucket already setup');
  } catch (err) {
    LOGGER.debug('Creating S3 bucket and policy');
    await s3Client.send(new CreateBucketCommand({
      Bucket: S3_BUCKET_NAME,
      ACL: 'public-read',
    }));

    // set the bucket policy to allow public read access
    await s3Client.send(new PutBucketPolicyCommand({
      Bucket: S3_BUCKET_NAME,
      Policy: JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Sid: 'PublicReadGetObject',
            Effect: 'Allow',
            Principal: '*',
            Action: 's3:GetObject',
            Resource: `arn:aws:s3:::${S3_BUCKET_NAME}/*`,
          },
        ],
      }),
    }));
  }
};
