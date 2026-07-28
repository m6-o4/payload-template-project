import { s3Storage } from "@payloadcms/storage-s3";
import { Plugin } from "payload";

// retrieve values from the environment variables.
const bucket = process.env.S3_BUCKET!;
const accessKeyId = process.env.S3_ACCESS_KEY_ID!
const accessKeySecret = process.env.S3_ACCESS_KEY_SECRET!
const region = process.env.S3_REGION!
const endpoint = process.env.S3_ENDPOINT!

// defines the central plugin configuration for the payload cms instance
// each plugin extends payload functionality to support forms, seo, search, 
// redirects, storage and cloud hosting
const plugins: Plugin[] = [   
	s3Storage({
		collections: { media: true },
		bucket: bucket,
		config: {
			credentials: {
				accessKeyId: accessKeyId,
				secretAccessKey: accessKeySecret,
			},
			region: region,
			endpoint: endpoint,
			forcePathStyle: true, // required for minio
		},
	}),
]

export { plugins }