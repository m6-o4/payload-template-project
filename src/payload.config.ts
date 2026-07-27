import path from "path";
import { fileURLToPath } from "url";
import { collections } from "@/payload/collections";
import { Users } from "@/payload/collections/users/schema";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// construct the absolute url for the admin interface favicon/icon meta tag.
const serverURL = process.env.NEXT_PUBLIC_SERVER_URL!;
const metaIcon = process.env.NEXT_PUBLIC_META_ICON!;
const iconURL = `${serverURL}/api/media/file/${metaIcon}`;

// determine the current environment to select the appropriate database connection.
const isProduction = process.env.NODE_ENV === "production";
const productionURL = process.env.DATABASE_URL_PRD!;
const developmentURL = process.env.DATABASE_URL_DEV!;
const databaseURL = isProduction ? productionURL : developmentURL;

// retrieve the payload secret from the environment variables.
const payloadSecret = process.env.PAYLOAD_SECRET!;

export default buildConfig({
	admin: {
		// set base directory for custom component imports.
		importMap: {
			baseDir: path.resolve(dirname),
		},
		meta: {
			// configure the favicon for the admin dashboard.
			icons: [
				{
					fetchPriority: "high",
					rel: "icon",
					sizes: "32x32",
					type: "image/svg+xml",
					url: iconURL,
				},
			],
			// append a suffix to the browser title for all admin pages.
			titleSuffix: " | Superior Software Solutions",
		},

		// set the users collection slug for authentication management
		user: Users.slug,
	},
	collections: collections,
	db: mongooseAdapter({ url: databaseURL }),
	editor: lexicalEditor(),
	plugins: [],
	secret: payloadSecret,
	sharp,
	typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
});
