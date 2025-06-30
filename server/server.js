import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { networkInterfaces } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure directories exist
const uploadsDir = path.join(__dirname, '../uploads');
const dbPath = path.join(__dirname, 'db.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/', 'video/'];
    const isAllowed = allowedTypes.some(type => file.mimetype.startsWith(type));
    cb(null, isAllowed);
  },
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// Database helpers
async function readDB() {
  return await fs.readJson(dbPath);
}

async function writeDB(data) {
  await fs.writeJson(dbPath, data, { spaces: 2 });
}

// API Routes

// Screens CRUD
app.get('/api/screens', async (req, res) => {
  try {
    const db = await readDB();
    res.json(db.screens);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch screens' });
  }
});

app.get('/api/screens/:id', async (req, res) => {
  try {
    const db = await readDB();
    const screen = db.screens.find(s => s.id === req.params.id);
    if (!screen) return res.status(404).json({ error: 'Screen not found' });
    res.json(screen);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch screen' });
  }
});

app.post('/api/screens', async (req, res) => {
  try {
    const db = await readDB();
    const newScreen = {
      id: uuidv4(),
      name: req.body.name,
      location: req.body.location,
      playlistId: req.body.playlistId || null,
      isActive: req.body.isActive || true,
      createdAt: new Date().toISOString()
    };
    db.screens.push(newScreen);
    await writeDB(db);
    res.json(newScreen);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create screen' });
  }
});

app.patch('/api/screens/:id', async (req, res) => {
  try {
    const db = await readDB();
    const index = db.screens.findIndex(s => s.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Screen not found' });
    
    db.screens[index] = { ...db.screens[index], ...req.body, updatedAt: new Date().toISOString() };
    await writeDB(db);
    res.json(db.screens[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update screen' });
  }
});

app.delete('/api/screens/:id', async (req, res) => {
  try {
    const db = await readDB();
    const index = db.screens.findIndex(s => s.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Screen not found' });
    
    db.screens.splice(index, 1);
    await writeDB(db);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete screen' });
  }
});

// Playlists CRUD
app.get('/api/playlists', async (req, res) => {
  try {
    const db = await readDB();
    res.json(db.playlists);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch playlists' });
  }
});

app.get('/api/playlists/:id', async (req, res) => {
  try {
    const db = await readDB();
    const playlist = db.playlists.find(p => p.id === req.params.id);
    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch playlist' });
  }
});

app.post('/api/playlists', async (req, res) => {
  try {
    const db = await readDB();
    const newPlaylist = {
      id: uuidv4(),
      name: req.body.name,
      description: req.body.description || '',
      contentIds: req.body.contentIds || [],
      duration: req.body.duration || 30,
      createdAt: new Date().toISOString()
    };
    db.playlists.push(newPlaylist);
    await writeDB(db);
    res.json(newPlaylist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create playlist' });
  }
});

app.patch('/api/playlists/:id', async (req, res) => {
  try {
    const db = await readDB();
    const index = db.playlists.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Playlist not found' });
    
    db.playlists[index] = { ...db.playlists[index], ...req.body, updatedAt: new Date().toISOString() };
    await writeDB(db);
    res.json(db.playlists[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update playlist' });
  }
});

app.delete('/api/playlists/:id', async (req, res) => {
  try {
    const db = await readDB();
    const index = db.playlists.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Playlist not found' });
    
    db.playlists.splice(index, 1);
    await writeDB(db);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete playlist' });
  }
});

// Content CRUD
app.get('/api/content', async (req, res) => {
  try {
    const db = await readDB();
    res.json(db.content);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

app.get('/api/content/:id', async (req, res) => {
  try {
    const db = await readDB();
    const content = db.content.find(c => c.id === req.params.id);
    if (!content) return res.status(404).json({ error: 'Content not found' });
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

app.post('/api/content', upload.single('file'), async (req, res) => {
  try {
    const db = await readDB();
    const newContent = {
      id: uuidv4(),
      name: req.body.name,
      type: req.body.type,
      duration: parseInt(req.body.duration) || 30,
      createdAt: new Date().toISOString()
    };

    if (req.file) {
      newContent.url = `/uploads/${req.file.filename}`;
      newContent.fileName = req.file.filename;
    } else if (req.body.url) {
      newContent.url = req.body.url;
    }

    db.content.push(newContent);
    await writeDB(db);
    res.json(newContent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create content' });
  }
});

app.patch('/api/content/:id', upload.single('file'), async (req, res) => {
  try {
    const db = await readDB();
    const index = db.content.findIndex(c => c.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Content not found' });
    
    const updates = { ...req.body, updatedAt: new Date().toISOString() };
    
    if (req.file) {
      // Delete old file if it exists
      if (db.content[index].fileName) {
        const oldPath = path.join(uploadsDir, db.content[index].fileName);
        await fs.remove(oldPath).catch(() => {});
      }
      updates.url = `/uploads/${req.file.filename}`;
      updates.fileName = req.file.filename;
    }
    
    db.content[index] = { ...db.content[index], ...updates };
    await writeDB(db);
    res.json(db.content[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update content' });
  }
});

app.delete('/api/content/:id', async (req, res) => {
  try {
    const db = await readDB();
    const index = db.content.findIndex(c => c.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Content not found' });
    
    // Delete associated file
    if (db.content[index].fileName) {
      const filePath = path.join(uploadsDir, db.content[index].fileName);
      await fs.remove(filePath).catch(() => {});
    }
    
    db.content.splice(index, 1);
    await writeDB(db);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete content' });
  }
});

// Display route - get screen with playlist and content details
app.get('/api/display/:id', async (req, res) => {
  try {
    const db = await readDB();
    const screen = db.screens.find(s => s.id === req.params.id);
    if (!screen) return res.status(404).json({ error: 'Screen not found' });
    
    let playlist = null;
    let content = [];
    
    if (screen.playlistId) {
      playlist = db.playlists.find(p => p.id === screen.playlistId);
      if (playlist) {
        content = playlist.contentIds
          .map(id => db.content.find(c => c.id === id))
          .filter(Boolean);
      }
    }
    
    res.json({
      screen,
      playlist,
      content
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch display data' });
  }
});

// Get network IP for cross-device access
function getNetworkIP() {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

// Initialize server with proper async handling
async function initializeServer() {
  try {
    // Ensure directories exist
    await fs.ensureDir(uploadsDir);

    // Initialize database if it doesn't exist
    if (!await fs.pathExists(dbPath)) {
      await fs.writeJson(dbPath, {
        screens: [],
        playlists: [],
        content: []
      });
    }

    // Start the server
    app.listen(PORT, '0.0.0.0', () => {
      const networkIP = getNetworkIP();
      console.log(`🚀 Digital Signage Server running on:`);
      console.log(`   Local:   http://localhost:${PORT}`);
      console.log(`   Network: http://${networkIP}:${PORT}`);
      console.log(`📱 Access from any device on your network using the Network URL`);
    });
  } catch (error) {
    console.error('❌ Failed to initialize server:', error);
    process.exit(1);
  }
}

// Start the server
initializeServer();