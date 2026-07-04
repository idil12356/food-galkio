const router = require('express').Router();
const MenuItem = require('../models/MenuItem');
const { adminAuth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Base URL (Render ama localhost)
const BASE_URL =
  process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;

// Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// ==========================
// GET PUBLIC MENU
// ==========================
router.get('/', async (req, res) => {
  try {
    const filter = { available: true };

    if (req.query.category && req.query.category !== 'All') {
      filter.category = req.query.category;
    }

    const menu = await MenuItem.find(filter);

    res.json(menu);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Server error',
    });
  }
});

// ==========================
// GET ALL MENU (ADMIN)
// ==========================
router.get('/all', adminAuth, async (req, res) => {
  try {
    const menu = await MenuItem.find();
    res.json(menu);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Server error',
    });
  }
});

// ==========================
// ADD MENU ITEM
// ==========================
router.post('/', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      description,
    } = req.body;

    let image = req.body.imageUrl || '';

    if (req.file) {
      image = `${BASE_URL}/uploads/${req.file.filename}`;
    }

    if (!image) {
      return res.status(400).json({
        message: 'Image required',
      });
    }

    const item = await MenuItem.create({
      name,
      category,
      price: parseFloat(price),
      description,
      image,
    });

    res.status(201).json(item);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
    });
  }
});

// ==========================
// UPDATE MENU ITEM
// ==========================
router.put('/:id', adminAuth, upload.single('image'), async (req, res) => {
  try {

    const updates = {
      ...req.body,
    };

    if (updates.price) {
      updates.price = parseFloat(updates.price);
    }

    if (req.file) {
      updates.image = `${BASE_URL}/uploads/${req.file.filename}`;
    }

    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
      }
    );

    if (!item) {
      return res.status(404).json({
        message: 'Menu item not found',
      });
    }

    res.json(item);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Server error',
    });
  }
});

// ==========================
// DELETE MENU ITEM
// ==========================
router.delete('/:id', adminAuth, async (req, res) => {
  try {

    const item = await MenuItem.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: 'Menu item not found',
      });
    }

    res.json({
      message: 'Deleted successfully',
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Server error',
    });
  }
});

module.exports = router;