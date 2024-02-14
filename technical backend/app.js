const express = require("express");
const cors = require("cors");
const { uploadFile } = require("./controllers/fileController");
const { getFileDetails } = require("./controllers/fileController");

const app = express(); // Initialize express app

app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Route for uploading files
app.post('/upload', uploadFile);

app.get('/getInfo', getFileDetails);

app.listen(8080, () => {
    console.log('Server started');
});
