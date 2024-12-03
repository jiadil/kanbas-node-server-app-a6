import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentDao from "../Enrollments/dao.js";

export default function UserRoutes(app) {
    // Middleware
    const requireAuth = (req, res, next) => {
        if (!req.session.currentUser) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        next();
    };

    // Course Management for Users
    const createCourse = async (req, res) => {
        try {
            const currentUser = req.session.currentUser;
            if (currentUser.role !== "FACULTY") {
                return res.status(403).json({ message: "Only faculty can create courses" });
            }

            const courseData = {
                ...req.body,
                faculty: currentUser._id
            };
            delete courseData._id;

            const newCourse = await courseDao.createCourse(courseData);
            try {
                const enrollment = await enrollmentDao.createEnrollment(currentUser._id, newCourse._id);
            } catch (enrollError) {
                console.error("Error creating faculty enrollment:", enrollError);
            }
            res.json(newCourse);
        } catch (error) {
            console.error("Error creating course:", error);
            res.status(500).json({ message: "Error creating course" });
        }
    };

    const findCoursesForUser = async (req, res) => {
        try {
            const currentUser = req.session.currentUser;
            const { showAll } = req.query;

            if (currentUser.role === "FACULTY" || currentUser.role === "ADMIN" || showAll === "true") {
                const allCourses = await courseDao.findAllCourses();
                console.log("All courses for faculty:", allCourses);
                return res.json(allCourses);
            }

            // For students, get their enrolled courses through enrollments
            const enrollments = await enrollmentDao.findEnrollmentsByUser(currentUser._id);
            console.log("Raw enrollments:", enrollments);

            // Filter out null courses and map to course objects
            const enrolledCourses = enrollments
                .map(enrollment => enrollment.course)
                .filter(course => course !== null);  // Remove null courses

            console.log("Filtered enrolled courses:", enrolledCourses);
            return res.json(enrolledCourses);
        } catch (error) {
            console.error("Error finding courses:", error);
            res.status(500).json({ message: "Error finding courses" });
        }
    };

    const enrollInCourse = async (req, res) => {
        try {
            const currentUser = req.session.currentUser;
            const { courseId } = req.params;

            // Create new enrollment
            const enrollment = await enrollmentDao.createEnrollment(currentUser._id, courseId);
            res.json(enrollment);
        } catch (error) {
            console.error("Error enrolling in course:", error);
            res.status(500).json({ message: "Error enrolling in course" });
        }
    };

    const unenrollFromCourse = async (req, res) => {
        try {
            const currentUser = req.session.currentUser;
            const { courseId } = req.params;

            await enrollmentDao.deleteEnrollment(currentUser._id, courseId);
            res.json({ message: "Successfully unenrolled" });
        } catch (error) {
            console.error("Error unenrolling from course:", error);
            res.status(500).json({ message: "Error unenrolling from course" });
        }
    };

    // User CRUD Operations
    const createUser = async (req, res) => {
        try {
            const user = await dao.createUser(req.body);
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: "Error creating user" });
        }
    };

    const findAllUsers = async (req, res) => {
        try {
            const { role, name } = req.query;
            let users;

            if (role) {
                users = await dao.findUsersByRole(role);
            } else if (name) {
                users = await dao.findUsersByPartialName(name);
            } else {
                users = await dao.findAllUsers();
            }

            res.json(users);
        } catch (error) {
            res.status(500).json({ message: "Error finding users" });
        }
    };

    const findUserById = async (req, res) => {
        try {
            const user = await dao.findUserById(req.params.userId);
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: "Error finding user" });
        }
    };

    const updateUser = async (req, res) => {
        try {
            const { userId } = req.params;
            await dao.updateUser(userId, req.body);
            const updatedUser = await dao.findUserById(userId);

            // Update session if it's the current user
            const currentUser = req.session.currentUser;
            if (currentUser && currentUser._id === userId) {
                req.session.currentUser = updatedUser;
            }

            res.json(updatedUser);
        } catch (error) {
            res.status(500).json({ message: "Error updating user" });
        }
    };

    const deleteUser = async (req, res) => {
        try {
            const status = await dao.deleteUser(req.params.userId);
            res.json(status);
        } catch (error) {
            res.status(500).json({ message: "Error deleting user" });
        }
    };

    // Authentication
    const signup = async (req, res) => {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).json({ message: "Username and password are required" });
            }

            const existingUser = await dao.findUserByUsername(username);
            if (existingUser) {
                return res.status(400).json({ message: "Username already taken" });
            }

            const currentUser = await dao.createUser({
                ...req.body,
                role: req.body.role || "STUDENT"
            });

            req.session.currentUser = currentUser;
            res.json(currentUser);
        } catch (error) {
            res.status(500).json({ message: "Error creating user" });
        }
    };

    const signin = async (req, res) => {
        try {
            const { username, password } = req.body;
            const currentUser = await dao.findUserByCredentials(username, password);

            if (!currentUser) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            req.session.currentUser = currentUser;
            await new Promise(resolve => req.session.save(resolve));

            res.json(currentUser);
        } catch (error) {
            res.status(500).json({ message: "Error signing in" });
        }
    };

    const signout = (req, res) => {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ message: "Error signing out" });
            }
            res.sendStatus(200);
        });
    };

    const profile = async (req, res) => {
        res.json(req.session.currentUser);
    };

    // Routes Configuration
    // Authentication routes
    app.post("/api/users/signup", signup);
    app.post("/api/users/signin", signin);
    app.post("/api/users/signout", signout);
    app.post("/api/users/profile", requireAuth, profile);

    // Course management routes
    app.post("/api/users/current/courses/:courseId", requireAuth, enrollInCourse);
    app.delete("/api/users/current/courses/:courseId", requireAuth, unenrollFromCourse);
    app.post("/api/users/current/courses", requireAuth, createCourse);
    app.get("/api/users/current/courses", requireAuth, findCoursesForUser);

    // User CRUD routes
    app.post("/api/users", createUser);
    app.get("/api/users", findAllUsers);
    app.get("/api/users/:userId", findUserById);
    app.put("/api/users/:userId", updateUser);
    app.delete("/api/users/:userId", deleteUser);
}