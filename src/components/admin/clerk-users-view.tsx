"use client";

import { SubmitEvent, useState } from "react";
import { updateClerkRolesAction } from "@/app/actions/update-clerk-role";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const ClerkUsersView = () => {
	const [userId, setUserId] = useState("");
	const [selectedRole, setSelectedRole] = useState<"admin" | "editor" | "user">("user");
	const [status, setStatus] = useState<string>("");

	const handleRoleUpdate = async (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!userId) return;

		setStatus("Updating role metadata in Clerk...");
		const res = await updateClerkRolesAction(userId, [selectedRole]);

		if (res.success) {
			setStatus(`Success: User ${userId} updated to role: ${selectedRole}`);
		} else {
			setStatus(`Error updating user: ${res.error}`);
		}
	};

	return (
		<div className="max-w-xl p-8">
			<h1 className="text-2xl font-bold">Clerk User Role Management</h1>
			<p className="text-muted-foreground mt-2 text-sm">
				Assign roles to Clerk `publicMetadata.roles`. Updates will automatically trigger
				webhooks to sync Payload MongoDB records.
			</p>

			<form onSubmit={handleRoleUpdate} className="mt-6 flex flex-col gap-4">
				<div className="grid gap-2">
					<Label htmlFor="clerk-user-id">Clerk User ID</Label>
					<Input
						id="clerk-user-id"
						type="text"
						placeholder="user_2x..."
						value={userId}
						onChange={(e) => setUserId(e.target.value)}
						required
					/>
				</div>

				<div className="grid gap-2">
					<Label htmlFor="role">Select Role</Label>
					<Select
						value={selectedRole}
						onValueChange={(value) =>
							setSelectedRole(value as "admin" | "editor" | "user")
						}
					>
						<SelectTrigger id="role" className="w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="admin">Admin</SelectItem>
							<SelectItem value="editor">Editor</SelectItem>
							<SelectItem value="user">User</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<Button type="submit">Update Clerk Metadata.</Button>
			</form>

			{status && <p className="mt-4 font-bold">{status}</p>}
		</div>
	);
};

export { ClerkUsersView };
