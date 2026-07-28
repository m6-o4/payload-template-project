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

// retrieve values from the environment variables.
const databaseURL = process.env.DATABASE_URL!;
const payloadSecret = process.env.PAYLOAD_SECRET!;

// construct the absolute url for the admin interface favicon/icon meta tag.
const serverURL = process.env.NEXT_PUBLIC_SERVER_URL!;
const metaIcon = process.env.NEXT_PUBLIC_META_ICON!;
const iconURL = `${serverURL}/api/media/file/${metaIcon}`;

export default buildConfig({
	admin: {
		components: {
			providers: ["/components/admin/clerk-admin-provider#ClerkAdminProvider"],
			logout: {
				Button: "/components/admin/custom-signout-button#CustomSignOutButton",
			},
			views: {
				ClerkUsersView: {
					Component: "/components/admin/clerk-users-view#ClerkUsersView",
					path: "/clerk-users",
					exact: true,
				},
			},
		},
		// set base directory for custom component imports.
		importMap: {
			baseDir: path.resolve(dirname),
		},
		meta: {
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
