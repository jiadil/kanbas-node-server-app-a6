import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function UserRoutes(app) {
    const createCourse = async (req, res) => {
        try {
            const currentUser = req.session["currentUser"];
            const newCourse = await courseDao.createCourse(req.body);
            await enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
            res.json(newCourse);
        } catch (error) {
            console.error("Error creating course:", error);
            res.status(500).json({ message: "Error creating course" });
        }
    };

    const createUser = async (req, res) => {
        const user = await dao.createUser(req.body);
        res.json(user);
    };


    const deleteUser = async (req, res) => {
        const status = await dao.deleteUser(req.params.userId);
        res.json(status);
    };


    const findAllUsers = async (req, res) => {
        const { role, name } = req.query;
        if (role) {
            const users = await dao.findUsersByRole(role);
            res.json(users);
            return;
        }
        if (name) {
            const users = await dao.findUsersByPartialName(name);
            res.json(users);
            return;
        }
        const users = await dao.findAllUsers();
        res.json(users);
    };

    const findUserById = async (req, res) => {
        const user = await dao.findUserById(req.params.userId);
        res.json(user);
    };

    const updateUser = async (req, res) => {
        try {
            const { userId } = req.params;
            const userUpdates = req.body;

            // Update the user in the database
            await dao.updateUser(userId, userUpdates);

            // Fetch the updated user from the database
            const updatedUser = await dao.findUserById(userId);

            // Update session if it's the current user
            const currentUser = req.session["currentUser"];
            if (currentUser && currentUser._id === userId) {
                req.session["currentUser"] = updatedUser;
            }

            // Send back the updated user data, not the currentUser
            res.json(updatedUser);
        } catch (error) {
            console.error("Error updating user:", error);
            res.status(500).json({ message: "Error updating user" });
        }
    };

    const signup = async (req, res) => {
        try {
            const { username, password } = req.body;

            // Validate required fields
            if (!username || !password) {
                return res.status(400).json({
                    message: "Username and password are required"
                });
            }

            const existingUser = await dao.findUserByUsername(username);
            if (existingUser) {
                return res.status(400).json({
                    message: "Username already taken"
                });
            }

            const currentUser = await dao.createUser({
                ...req.body,
                role: req.body.role || "STUDENT" // Default role if not provided
            });

            req.session["currentUser"] = currentUser;
            res.json(currentUser);
        } catch (error) {
            console.error("Signup error:", error);
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
            req.session["currentUser"] = currentUser;
            res.json(currentUser);
        } catch (error) {
            console.error("Signin error:", error);
            res.status(500).json({ message: "Error signing in" });
        }
    };

    const signout = (req, res) => {
        req.session.destroy();
        res.sendStatus(200);
    };

    const profile = (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.status(401).json({ message: "Not authenticated" });
            return;
        }
        res.json(currentUser);
    };

    const findCoursesForUser = async (req, res) => {
        try {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                return res.status(401).json({ message: "Not authenticated" });
            }

            const { showAll } = req.query;

            if (currentUser.role === "FACULTY" || showAll === "true") {
                const allCourses = await courseDao.findAllCourses();
                return res.json(allCourses);
            }

            const enrolledCourses = await courseDao.findCoursesForEnrolledUser(currentUser._id);
            return res.json(enrolledCourses);
        } catch (error) {
            console.error("Error finding courses:", error);
            res.status(500).json({ message: "Error finding courses" });
        }
    };

    // Routes
    app.post("/api/users/current/courses", createCourse);
    app.get("/api/users/current/courses", findCoursesForUser);
    app.post("/api/users", createUser);
    app.get("/api/users", findAllUsers);
    app.get("/api/users/:userId", findUserById);
    app.put("/api/users/:userId", updateUser);
    app.delete("/api/users/:userId", deleteUser);
    app.post("/api/users/signup", signup);
    app.post("/api/users/signin", signin);
    app.post("/api/users/signout", signout);
    app.post("/api/users/profile", profile);
}