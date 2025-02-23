import express, { json } from "express";
import { existsSync, writeFileSync, readFile, writeFile } from "fs";
import cors from "cors";

const app = express();
app.use(json());
app.use(cors());

const FILE_PATH = "./WorkRotation.json";

// Initialize workers.json if it doesn't exist
if (!existsSync(FILE_PATH)) {
    const initialData = [
        { name: "Ravi", status: "willWork" },
        { name: "Ravi", status: "willWork" },
        { name: "Selvam", status: "willWork" },
        { name: "Selvam", status: "willWork" },
        { name: "Karuppasamy", status: "willWork" },
        { name: "Karuppasamy", status: "willWork" }
    ];
    writeFileSync(FILE_PATH, JSON.stringify(initialData, null, 2));
}

// Get workers list
app.get("/workers", (req, res) => {
    readFile(FILE_PATH, "utf8", (err, data) => {
        if (err) return res.status(500).json({ error: "Error reading file" });
        res.json(JSON.parse(data));
    });
});

// Update workers list
app.post("/workers", (req, res) => {
    writeFile(FILE_PATH, JSON.stringify(req.body, null, 2), (err) => {
        if (err) return res.status(500).json({ error: "Error writing file" });
        res.json({ message: "Workers updated successfully" });
    });
});

// Start the server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
