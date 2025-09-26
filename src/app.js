
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";

export const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/user", userRouter);



























// import express from "express"
// import cors from "cors"
// import cookieParser from "cookie-parser"

// export const app = express()

// app.use(cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true
// }))

// app.use(express.json({limit: "16kb"}))
// app.use(express.urlencoded({extended: true, limit: "16kb"}))
// app.use(express.static("public"))
// app.use(cookieParser())


// import userRouter from "./routes/user.route.js"

// app.use("/api/v1/user", userRouter)