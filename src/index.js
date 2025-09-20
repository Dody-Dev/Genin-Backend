import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5047;

app.use(express.json());          //convert incoming JSON to JS object


const dbconnect = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(` Connected to MongoDB:`);
  } catch (error) {
    console.error(" MongoDB connection failed:", error.message);
    process.exit(1);
  }
};


app.get("/", (req, res) => {
  res.send("Hello world teri aisi taisi");
});


app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await dbconnect();
});
