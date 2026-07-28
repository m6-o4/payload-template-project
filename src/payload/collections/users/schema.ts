import { isAdmin, isAdminOrEditor, isAdminOrSelf } from "@/payload/access/access-control";
import { clerkStrategy } from "@/payload/strategy/clerk-strategy";
import type { CollectionConfig, FieldHook } from "payload";

// combines first and last names into a single searchable string
const populateFullName: FieldHook = async ({ data }) => {
	return `${data?.firstName} ${data?.lastName}`;
};

const Users: CollectionConfig = {
	slug: "users",
	labels: { singular: "User", plural: "Users" },
	admin: {
		defaultColumns: ["name", "email", "roles", "clerkId", "createdAt", "updatedAt"],
		group: "Content",
		useAsTitle: "name",
	},
	auth: {
		disableLocalStrategy: true,
		strategies: [clerkStrategy],
	},
	access: {
		admin: isAdminOrEditor,
		create: isAdmin,
		delete: isAdmin,
		read: isAdminOrSelf,
		update: isAdmin,
	},
	fields: [
		{
			name: "clerkId",
			type: "text",
			label: "Clerk ID",
			required: true,
			unique: true,
			index: true,
			admin: { readOnly: true },
		},
		{ name: "email", label: "Email Address", type: "email", required: true },
		{
			type: "row",
			fields: [
				{
					name: "firstName",
					label: "First Name",
					type: "text",
					admin: { width: "50%" },
				},
				{
					name: "lastName",
					label: "Last Name",
					type: "text",
					admin: { width: "50%" },
				},
			],
		},
		{
			name: "roles",
			type: "select",
			hasMany: true,
			defaultValue: ["user"],
			options: [
				{ label: "Admin", value: "admin" },
				{ label: "Editor", value: "editor" },
				{ label: "User", value: "user" },
			],
			required: true,
		},
		{
			// derived field for admin display and searchability
			name: "name",
			type: "text",
			label: "Name",
			admin: { position: "sidebar", hidden: true, readOnly: true },
			hooks: { beforeValidate: [populateFullName] },
		},
	],
};

export { Users };
