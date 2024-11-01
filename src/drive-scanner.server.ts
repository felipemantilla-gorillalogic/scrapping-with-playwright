import express, { Express, Request, Response } from "express";
import fs from "fs";
import path from "path";

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(express.json());

const STORAGE_FILE = "drive-scanner.json";

// Helper function to read storage file
const readStorage = (): Record<string, any> => {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, "utf8");
      return JSON.parse(data);
    }
    return {};
  } catch (error) {
    console.error("Error reading storage file:", error);
    return {};
  }
};

// Helper function to write storage file
const writeStorage = (data: Record<string, any>): void => {
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing storage file:", error);
  }
};

// POST endpoint to save object
//@ts-ignore
app.post("/drive-scanner", (req: Request, res: Response) => {
  try {
    const id = req.body.id;
    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    const storage = readStorage();
    storage[id] = req.body;
    writeStorage(storage);

    res.status(201).json({ message: "Object saved successfully", id });
  } catch (error) {
    console.error("Error saving object:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET endpoint to retrieve object by ID
//@ts-ignore
app.get("/drive-scanner/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const storage = readStorage();

    if (!storage[id]) {
      return res.json({
        id,
        itemOnStorage: false,
      });
    }

    res.json({
      itemOnStorage: true,
      id,
    });
  } catch (error) {
    console.error("Error retrieving object:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
