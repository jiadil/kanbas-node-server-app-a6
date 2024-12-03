import * as dao from "./dao.js";

export default function EnrollmentRoutes(app) {
    const findAllEnrollments = async (req, res) => {
        try {
            const enrollments = await dao.findAllEnrollments();
            res.json(enrollments);
        } catch (error) {
            res.status(500).json({ message: "Error finding enrollments" });
        }
    };

    const createEnrollment = async (req, res) => {
        try {
            const { userId, courseId } = req.body;
            const enrollment = await dao.createEnrollment(userId, courseId);
            res.json(enrollment);
        } catch (error) {
            res.status(500).json({ message: "Error creating enrollment" });
        }
    };

    const deleteEnrollment = async (req, res) => {
        try {
            const { userId, courseId } = req.params;
            const status = await dao.deleteEnrollment(userId, courseId);
            res.json(status);
        } catch (error) {
            res.status(500).json({ message: "Error deleting enrollment" });
        }
    };

    const findEnrollmentsByUser = async (req, res) => {
        try {
            const { userId } = req.params;
            const enrollments = await dao.findEnrollmentsByUser(userId);
            res.json(enrollments);
        } catch (error) {
            res.status(500).json({ message: "Error finding enrollments" });
        }
    };

    const findEnrollmentsByCourse = async (req, res) => {
        try {
            const { courseId } = req.params;
            const enrollments = await dao.findEnrollmentsByCourse(courseId);
            res.json(enrollments);
        } catch (error) {
            res.status(500).json({ message: "Error finding enrollments" });
        }
    };

    app.get("/api/enrollments", findAllEnrollments);
    app.post("/api/enrollments", createEnrollment);
    app.delete("/api/enrollments/:userId/:courseId", deleteEnrollment);
    app.get("/api/users/:userId/enrollments", findEnrollmentsByUser);
    app.get("/api/courses/:courseId/enrollments", findEnrollmentsByCourse);
}