// client/test/test-api.ts
import "./setup-localstorage";

async function runTests() {
  try {
    const { authApi, notesApi } = await import("../src/lib/api");
    const { setAuthToken } = await import("../src/lib/auth");

    const email = process.env.TEST_EMAIL ?? "";
    const password = process.env.TEST_PASSWORD ?? "";
    if (!email || !password) {
      throw new Error(
        "Set TEST_EMAIL and TEST_PASSWORD env vars before running.",
      );
    }

    // --- Auth: register/login ---
    console.log("Logging in...");
    const loginRes = await authApi.login({
      email,
      password,
    });
    console.log("Login response:", loginRes);

    setAuthToken(loginRes.token ?? null);

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
