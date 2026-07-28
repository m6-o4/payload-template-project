"use server";

import { auth } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";

const clerkClient = createClerkClient({
	secretKey: process.env.CLERK_SECRET_KEY,
});

const updateClerkRolesAction = async (userId: string, roles: string[]) => {
	const { userId: callerId } = await auth();

	if (!callerId) {
		return { success: false, error: "Not authenticated." };
	}

	const caller = await clerkClient.users.getUser(callerId);
	const callerRoles = (caller.publicMetadata?.roles as string[]) || [];

	if (!callerRoles.includes("admin")) {
		return { success: false, error: "Forbidden: admin role required." };
	}

	try {
		await clerkClient.users.updateUserMetadata(userId, {
			publicMetadata: {
				roles,
			},
		});
		return { success: true };
	} catch (error: any) {
		return { success: false, error: error.message };
	}
};

export { updateClerkRolesAction };
