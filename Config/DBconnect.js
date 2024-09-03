
const mongoose =require("mongoose")

const MONGODB_URI = process.env.MONGODB_URI;
const connection = async() => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB connected successfully');
      } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
       
        process.exit(1);
      }
}

module.exports = connection
