// test-api.ts
import { authApi, notesApi } from "./lib/api";

// Temporary helper to set token for requests
let token: string | null = null;
function setAuthToken(newToken: string | null) {
	token = newToken;
}

// Override fetch in api.ts if needed (or modify api.ts to accept a token param)
// Or you can directly call endpoints with fetch for testing

async function runTests() {
	try {
		// --- Auth: register/login ---
		console.log("Logging in...");
		const loginRes = await authApi.login({
			email: "dmrty@icloud.com",
			password: "yourpassword",
		});
		console.log("Login response:", loginRes);

		// Optionally set token for notesApi
		token = loginRes.token ?? null;
		setAuthToken(token);

		// --- Notes API tests ---
		console.log("Fetching all notes...");
		const notes = await notesApi.getAll();
		console.log("Notes:", notes);

		console.log("Creating a new note...");
		const newNote = await notesApi.create({
			title: "Test note",
			content: "This is a test.",
		});
		console.log("Created note:", newNote);

		console.log("Updating note...");
		const updatedNote = await notesApi.update(newNote.id, {
			title: "Updated title",
		});
		console.log("Updated note:", updatedNote);

		console.log("Deleting note...");
		await notesApi.remove(newNote.id);
		console.log("Deleted note successfully.");
	} catch (err) {
		console.error("Test failed:", err);
	}
}

runTests();
