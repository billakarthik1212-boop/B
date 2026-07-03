import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(process.cwd(), "data.json");
const UPLOADS_DIR = path.join(process.cwd(), "uploads");

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Increase payload limit for base64 uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Serve uploaded static files
app.use("/uploads", express.static(UPLOADS_DIR));

// Default App Data Initialization
const DEFAULT_HERO_SETTINGS = {
  image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=1600",
  title: "SIDDESHWARA RURAL MART",
  tagline: "Preserving the Legacy of Traditional Tasar Handloom Weaving",
  subheading: "Every Thread Tells a Story of Heritage, Craftsmanship, and Elegance."
};

const DEFAULT_WEAVING_STEPS = [
  {
    number: 1,
    title: "Procuring the Cocoons",
    description: "Authentic Tasar silk cultivation begins in the deep forests of Telangana. The wild forest silkworms (Antheraea mylitta) feed on local Sal and Asan trees. The cocoons are carefully harvested by hand by local forest-dwelling communities, ensuring a sustainable, eco-friendly process that supports tribal livelihoods.",
    images: ["https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=1200"]
  },
  {
    number: 2,
    title: "Boiling",
    description: "Once harvested, the cocoons are subjected to a gentle boiling process in an alkaline solution. This boiling softens the natural gum (sericin) holding the silk fibers together. This is a critical precision step where temperature is carefully regulated to preserve the natural golden color and high tensile strength of the Tasar silk.",
    images: ["https://images.unsplash.com/photo-1558961309-db6262759838?auto=format&fit=crop&q=80&w=1200"]
  },
  {
    number: 3,
    title: "Thigh Reeling (Dashilee Pattu)",
    description: "The most distinctive traditional aspect of Mahadevpur Tasar weaving is Thigh Reeling, locally known as Dashilee Pattu. Experienced women artisans hand-reel the soft silk filaments directly from the cocoons against their thighs, twisting the threads with extreme precision. This age-old technique gives Tasar its uniquely rich, slightly uneven organic texture and majestic golden luster.",
    images: ["https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=1200"]
  },
  {
    number: 4,
    title: "Natural Dyeing",
    description: "The reeled silk yarn is dyed using completely natural and organic pigments extracted from forest barks, roots, wild flowers, seeds, and local minerals. The yarn is washed multiple times in copper vats, resulting in deep, rich, earth-toned hues like deep crimson maroon, royal gold, and forest green, which are completely safe for the skin and environment.",
    images: ["https://images.unsplash.com/photo-1520038410233-7141be7e6f97?auto=format&fit=crop&q=80&w=1200"]
  },
  {
    number: 5,
    title: "Yarn Winding",
    description: "After dyeing, the silk yarns are dried under direct sunlight and wound onto traditional bamboo or wooden spools called 'asaras' or bobbins. This process prepares the yarn for the loom, ensuring that the threads are uniform, tangle-free, and strong enough to withstand the high tension of manual weaving.",
    images: ["https://images.unsplash.com/photo-1584905066893-7d5c142ba4e1?auto=format&fit=crop&q=80&w=1200"]
  },
  {
    number: 6,
    title: "Street Warping & Sizing",
    description: "Warping is done outdoors on quiet streets or yards. The threads are stretched longitudinally in the open air, held by strong wooden stakes. Sizing paste made from natural rice water or wild seed starch is applied to the stretched warp with coarse brushes, strengthening the silk threads and giving them the resilience needed for the shuttle actions.",
    images: ["https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?auto=format&fit=crop&q=80&w=1200"]
  },
  {
    number: 7,
    title: "Tying-in (Atuku Veyadam)",
    description: "Tying-in or 'Atuku Veyadam' is the highly skilled process of manually joining individual warp threads of the new saree to the remaining warp threads of the previous saree on the loom. The weaver sits crouched for hours, joining thousands of fine silk threads together with ash paste and water, ensuring seamless structural continuity.",
    images: ["https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=1200"]
  },
  {
    number: 8,
    title: "Handloom Weaving",
    description: "The ultimate climax of the heritage. Using traditional fly-shuttle pit looms and frame looms, master weavers manually manipulate the warp and weft, interlacing the golden Tasar silk threads. Every centimeter demands absolute rhythmic synchronization of eyes, hands, and feet, taking 5 to 15 days to craft a single masterpiece.",
    images: ["https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1200"]
  }
];

const DEFAULT_PRODUCTS = [
  {
    id: "prod-1",
    name: "Classic Mahadevpur Tasar Silk Saree",
    category: "sarees",
    description: "Authentic hand-woven Tasar silk saree featuring the natural golden-bronze sheen of traditional thigh-reeled silk. Adorned with traditional temple motifs and rich maroon zari borders. Comes with a matching unstitched blouse piece.",
    price: 10000,
    stock: "In Stock" as const,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: "prod-2",
    name: "Tasar Shirting Cloth (Gold Colour)",
    category: "shirting",
    description: "Premium pure Tasar silk shirting fabric in its majestic natural golden hue. Exceptionally breathable, structural, and soft, carrying the exquisite organic slub texture of thigh-reeled yarn. Priced per meter.",
    price: 1300,
    stock: "In Stock" as const,
    image: "https://images.unsplash.com/photo-1606722590583-6951b5ea92ce?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: "prod-3",
    name: "Imperial Tasar Silk Shawl",
    category: "shawls",
    description: "Elegant and warm Tasar silk shawl hand-woven with symmetrical geometrical borders. Captures the luxurious look and traditional sophistication of heritage weaving, perfect for special occasions.",
    price: 1200,
    stock: "In Stock" as const,
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=1200"
  }
];

const DEFAULT_CATEGORIES = [
  {
    id: "sarees",
    name: "Tasar Sarees",
    tagline: "Traditional elegance drape",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600",
    desc: "Elegant hand-reeled pure silk sarees adorned with rich zari and traditional forest temple borders."
  },
  {
    id: "shirting",
    name: "Tasar Shirting Cloth",
    tagline: "Refined structural elegance",
    image: "https://images.unsplash.com/photo-1606722590583-6951b5ea92ce?auto=format&fit=crop&q=80&w=600",
    desc: "Organic golden slub fabric woven for premium breathable shirts, kurtas, and traditional luxury wear."
  },
  {
    id: "shawls",
    name: "Shawls",
    tagline: "Timeless hand-crafted warmth",
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=600",
    desc: "Symmetrical geometric border wraps woven to represent elite Indian heritage and modern sophistication."
  }
];

const initData = () => {
  if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
      products: DEFAULT_PRODUCTS,
      categories: DEFAULT_CATEGORIES,
      weavingSteps: DEFAULT_WEAVING_STEPS,
      heroSettings: DEFAULT_HERO_SETTINGS,
      orders: []
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), "utf8");
    console.log("Initialized default database in data.json");
  } else {
    // Migration: Migrate older data.json categories to have image, tagline, desc
    try {
      const content = fs.readFileSync(DATA_FILE, "utf8");
      const data = JSON.parse(content);
      let updated = false;
      if (data.categories) {
        data.categories = data.categories.map((cat: any) => {
          const match = DEFAULT_CATEGORIES.find((d) => d.id === cat.id);
          if (match) {
            let modified = false;
            if (!cat.image) { cat.image = match.image; modified = true; }
            if (!cat.tagline) { cat.tagline = match.tagline; modified = true; }
            if (!cat.desc) { cat.desc = match.desc; modified = true; }
            if (modified) updated = true;
          } else {
            if (!cat.image) { cat.image = "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=600"; updated = true; }
            if (!cat.tagline) { cat.tagline = "Premium Handwoven Craft"; updated = true; }
            if (!cat.desc) { cat.desc = "Handcrafted by local artisans using pure organic processes."; updated = true; }
          }
          return cat;
        });
      }
      if (updated) {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
        console.log("Migrated categories in data.json with new fields.");
      }
    } catch (err) {
      console.error("Migration failed:", err);
    }
  }
};

initData();

// Helper to read data
const readData = () => {
  try {
    const content = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(content);
  } catch (err) {
    console.error("Error reading data.json, resetting...", err);
    const initialData = {
      products: DEFAULT_PRODUCTS,
      categories: DEFAULT_CATEGORIES,
      weavingSteps: DEFAULT_WEAVING_STEPS,
      heroSettings: DEFAULT_HERO_SETTINGS,
      orders: []
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), "utf8");
    return initialData;
  }
};

// Helper to write data
const writeData = (data: any) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
};

// --- API ROUTES ---

// Get all data
app.get("/api/data", (req, res) => {
  res.json(readData());
});

// Admin login
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  // A simple, secure check for Siddeshwara admin
  if (
    (username === "admin" || username === "billakarthik1212@gmail.com") &&
    password === "siddeshwara2026"
  ) {
    res.json({ success: true, token: "session-siddeshwara-rural-mart-2026" });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// Upload endpoint (accepts base64, saves as file on disk)
app.post("/api/upload", (req, res) => {
  try {
    const { filename, type, base64 } = req.body;
    if (!filename || !base64) {
      return res.status(400).json({ error: "Missing filename or base64 data" });
    }

    // Clean base64 string
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Generate a unique filename to prevent collisons
    const ext = path.extname(filename) || ".jpg";
    const baseName = path.basename(filename, ext).replace(/[^a-zA-Z0-9]/g, "_");
    const uniqueName = `${baseName}_${Date.now()}${ext}`;
    const filePath = path.join(UPLOADS_DIR, uniqueName);

    fs.writeFileSync(filePath, buffer);
    res.json({ url: `/uploads/${uniqueName}` });
  } catch (error: any) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

// Products: CRUD
app.post("/api/products", (req, res) => {
  const data = readData();
  const newProduct = {
    id: `prod-${Date.now()}`,
    ...req.body
  };
  data.products.unshift(newProduct);
  writeData(data);
  res.status(201).json(newProduct);
});

app.put("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const data = readData();
  const index = data.products.findIndex((p: any) => p.id === id);
  if (index !== -1) {
    data.products[index] = { ...data.products[index], ...req.body };
    writeData(data);
    res.json(data.products[index]);
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const data = readData();
  data.products = data.products.filter((p: any) => p.id !== id);
  writeData(data);
  res.json({ success: true });
});

// Categories: Create/Update/Delete
app.post("/api/categories", (req, res) => {
  const data = readData();
  const newCat = {
    id: req.body.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
    name: req.body.name,
    tagline: req.body.tagline || "Curated Collection",
    desc: req.body.desc || "Beautiful handcrafted silk from Mahadevpur weavers.",
    image: req.body.image || "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=600"
  };
  // Prevent duplicate id
  if (data.categories.some((c: any) => c.id === newCat.id)) {
    newCat.id = `${newCat.id}-${Date.now()}`;
  }
  data.categories.push(newCat);
  writeData(data);
  res.status(201).json(newCat);
});

app.put("/api/categories/:id", (req, res) => {
  const { id } = req.params;
  const data = readData();
  const index = data.categories.findIndex((c: any) => c.id === id);
  if (index !== -1) {
    data.categories[index] = { ...data.categories[index], ...req.body };
    writeData(data);
    res.json(data.categories[index]);
  } else {
    res.status(404).json({ error: "Category not found" });
  }
});

app.delete("/api/categories/:id", (req, res) => {
  const { id } = req.params;
  const data = readData();
  data.categories = data.categories.filter((c: any) => c.id !== id);
  writeData(data);
  res.json({ success: true });
});

// Hero Settings
app.post("/api/hero-settings", (req, res) => {
  const data = readData();
  data.heroSettings = { ...data.heroSettings, ...req.body };
  writeData(data);
  res.json(data.heroSettings);
});

// Weaving Steps
app.post("/api/weaving-step/:number", (req, res) => {
  const stepNumber = parseInt(req.params.number);
  const data = readData();
  const index = data.weavingSteps.findIndex((s: any) => s.number === stepNumber);
  if (index !== -1) {
    data.weavingSteps[index] = { ...data.weavingSteps[index], ...req.body };
    writeData(data);
    res.json(data.weavingSteps[index]);
  } else {
    res.status(404).json({ error: "Step not found" });
  }
});

// Create Order
app.post("/api/orders", (req, res) => {
  const data = readData();
  const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
  const date = new Date().toISOString().split("T")[0];
  const newOrder = {
    id: `order-${Date.now()}`,
    invoiceNumber,
    date,
    ...req.body
  };
  data.orders.unshift(newOrder);
  writeData(data);
  res.status(201).json(newOrder);
});

// --- VITE INNER ROUTING ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
