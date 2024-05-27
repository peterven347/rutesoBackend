const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');

const app = express();
const port = 3001;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/your_database_name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a Mongoose model for images
const ImageModel = mongoose.model('Image', {
  data: Buffer,
  contentType: String,
});

// Set up Multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Handle image upload
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const image = new ImageModel({
      data: req.file.buffer,
      contentType: req.file.mimetype,
    });
    await image.save();
    res.status(201).send('Image uploaded successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Retrieve image by ID
app.get('/image/:id', async (req, res) => {
  try {
    const image = await ImageModel.findById(req.params.id);
    if (!image) {
      return res.status(404).send('Image not found');
    }
    res.set('Content-Type', image.contentType);
    res.send(image.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
