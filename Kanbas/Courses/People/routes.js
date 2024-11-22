import * as userDao from "../../Users/dao.js";
import * as enrollmentsDao from "../../Enrollments/dao.js";

function PeopleRoutes(app) {
    const findUsersInCourse = (req, res) => {
        try {
            const { courseId } = req.params;
            const allUsers = userDao.findAllUsers();
            const enrollments = enrollmentsDao.findEnrollmentsByCourse(courseId);

            // Filter users who are enrolled in this course
            const courseUsers = allUsers.filter(user =>
                enrollments.some(enrollment =>
                    enrollment.user === user._id.toString()
                )
            );

            res.json(courseUsers);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    const addUserToCourse = (req, res) => {
        try {
            const { courseId } = req.params;
            const user = req.body;

            // Check if current user is faculty
            const currentUser = req.session["currentUser"];
            if (currentUser?.role !== "FACULTY") {
                return res.status(403).json({ message: "Not authorized" });
            }

            const newUser = userDao.createUser(user);
            enrollmentsDao.enrollUserInCourse(newUser._id, courseId);

            res.json(newUser);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    const removeUserFromCourse = (req, res) => {
        try {
            const { courseId, userId } = req.params;

            // Check if current user is faculty
            const currentUser = req.session["currentUser"];
            if (currentUser?.role !== "FACULTY") {
                return res.status(403).json({ message: "Not authorized" });
            }

            enrollmentsDao.deleteEnrollment(userId, courseId);
            res.json({ status: "OK" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    // Define routes
    app.get("/api/courses/:courseId/people", findUsersInCourse);
    app.post("/api/courses/:courseId/people", addUserToCourse);
    app.delete("/api/courses/:courseId/people/:userId", removeUserFromCourse);
}

export default PeopleRoutes;