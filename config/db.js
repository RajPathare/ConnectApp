const mongoose = require('mongoose');
const db = process.env.mongoURI;

const connectDB = async () => {
    try {
        await mongoose.connect(db,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('MongoDB connected!');
    }
    catch (e) {
        console.log(e.message);
        // exit process with failure
        process.exit(1);
    }
}

module.exports = connectDB;