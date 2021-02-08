require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const app = express();
app.use(express.json({ extended:false }));

connectDB();

const PORT = process.env.PORT || 5000;

// define routes

app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));

// Server static assets in prod

if(process.env.NODE_ENV === 'production') {
    
    // static folder
    app.use(express.static('client/build'));

    app.get('*', (req,res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);
})