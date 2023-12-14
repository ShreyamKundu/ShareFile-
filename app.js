const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const router = require('./routes/file');
require('dotenv').config();

const app = express();
// Templating Engine
app.set('view engine','ejs');
app.set('views','views');

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Routes
app.use('/api/files',router);
app.use('/files',router);
// app.use('/files/download',router);



mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(PORT,console.log(`Server is listening on port ${PORT}`));
    console.log('Database connected');
}).catch(err => console.log(err));