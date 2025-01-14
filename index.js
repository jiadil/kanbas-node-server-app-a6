import "dotenv/config";
import express from 'express';
import mongoose from "mongoose";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Hello from "./Hello.js"
import Lab5 from "./Lab5/index.js";
import UserRoutes from "./Kanbas/Users/routes.js";
import CourseRoutes from "./Kanbas/Courses/routes.js";
import ModuleRoutes from "./Kanbas/Modules/routes.js";
import AssignmentRoutes from './Kanbas/Assignments/routes.js';
import EnrollmentRoutes from "./Kanbas/Enrollments/routes.js";
import PeopleRoutes from "./Kanbas/Courses/People/routes.js";
import cors from "cors";
import session from "express-session";

// Set up __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// MongoDB Connection
const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kanbas";

mongoose.connect(CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
})
    .then(() => {
        console.log("Connected successfully to MongoDB Atlas!");
    })
    .catch((error) => {
        console.error("MongoDB Atlas Connection Error:", {
            message: error.message,
            code: error.code,
            name: error.name
        });
    });

const app = express();

// CORS configuration
app.use(
    cors({
        credentials: true,
        origin: [
            process.env.NETLIFY_URL || "http://localhost:3000",
            "https://kanbas-react-web-app-jiadil.netlify.app",
            "https://a6--kanbas-react-web-app-jiadil.netlify.app"
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

// Parse JSON bodies
app.use(express.json());

const sessionOptions = {
    secret: process.env.SESSION_SECRET || "super secret session phrase",
    resave: false,
    saveUninitialized: false,
    name: 'sessionId',
    cookie: {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    }
};

if (process.env.NODE_ENV !== "development") {
    sessionOptions.proxy = true;
    sessionOptions.cookie = {
        ...sessionOptions.cookie,
        sameSite: 'none',
        secure: true
    };
}

// Apply session middleware
app.use(session(sessionOptions));

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, '../build')));

// API Routes
UserRoutes(app);
CourseRoutes(app);
ModuleRoutes(app);
AssignmentRoutes(app);
EnrollmentRoutes(app);
PeopleRoutes(app);

Lab5(app);
Hello(app);

// Catch-all route for client-side routing
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});