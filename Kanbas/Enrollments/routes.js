import * as dao from "./dao.js";

export default function EnrollmentRoutes(app) {
    const findAllEnrollments = (req, res) => {
        const enrollments = dao.findAllEnrollments();
        res.json(enrollments);
    };

    const createEnrollment = (req, res) => {
        const { userId, courseId } = req.body;
        const enrollment = dao.createEnrollment(userId, courseId);
        res.json(enrollment);
    };

    const deleteEnrollment = (req, res) => {
        const { userId, courseId } = req.params;
        const status = dao.deleteEnrollment(userId, courseId);
        res.json(status);
    };

    const findEnrollmentsByUser = (req, res) => {
        const { userId } = req.params;
        const enrollments = dao.findEnrollmentsByUser(userId);
        res.json(enrollments);
    };

    const findEnrollmentsByCourse = (req, res) => {
        const { courseId } = req.params;
        const enrollments = dao.findEnrollmentsByCourse(courseId);
        res.json(enrollments);
    };

    app.get("/api/enrollments", findAllEnrollments);
    app.post("/api/enrollments", createEnrollment);
    app.delete("/api/enrollments/:userId/:courseId", deleteEnrollment);
    app.get("/api/users/:userId/enrollments", findEnrollmentsByUser);
    app.get("/api/courses/:courseId/enrollments", findEnrollmentsByCourse);
}