import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";
export default function UserRoutes(app) {
    const createCourse = (req, res) => {
        const currentUser = req.session["currentUser"];
        const newCourse = courseDao.createCourse(req.body);
        enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
        res.json(newCourse);
    };
    app.post("/api/users/current/courses", createCourse);


    const createUser = (req, res) => { };
    const deleteUser = (req, res) => { };
    const findAllUsers = (req, res) => { };
    const findUserById = (req, res) => { };
    const updateUser = (req, res) => {
        const userId = req.params.userId;
        const userUpdates = req.body;

        // First find the user to make sure they exist
        const existingUser = dao.findUserById(userId);
        if (!existingUser) {
            res.sendStatus(404);
            return;
        }

        // Update the user and get the result
        const updatedUser = dao.updateUser(userId, userUpdates);

        // Update session with the new user data
        req.session["currentUser"] = updatedUser;
        res.json(updatedUser);
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

            // Check if username already exists
            const existingUser = dao.findUserByUsername(username);
            if (existingUser) {
                return res.status(400).json({
                    message: "Username is already taken"
                });
            }

            // Create new user
            const newUser = dao.createUser({
                username,
                password,
                role: "STUDENT", // Default role
                _id: new Date().getTime().toString()
            });

            // Set the user in session
            req.session["currentUser"] = newUser;

            // Return the new user
            res.json(newUser);
        } catch (error) {
            console.error("Signup error:", error);
            res.status(500).json({
                message: "Error creating user"
            });
        }
    };
    const signin = (req, res) => {
        const { username, password } = req.body;
        const currentUser = dao.findUserByCredentials(username, password);
        if (currentUser) {
            req.session["currentUser"] = currentUser;
            res.json(currentUser);
        } else {
            res.status(401).json({ message: "Unable to login. Try again later." });
        }
    };

    const signout = (req, res) => {
        req.session.destroy();
        res.sendStatus(200);
    };
    const profile = (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        // Add this line to send back the current user
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
                const allCourses = courseDao.findAllCourses();
                return res.json(allCourses);
            }

            // Return enrolled courses for students
            const enrolledCourses = courseDao.findCoursesForEnrolledUser(currentUser._id);
            return res.json(enrolledCourses);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    };

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
