import * as dao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";
import * as assignmentsDao from "../Assignments/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app) {
    // Course CRUD operations
    app.post("/api/courses", async (req, res) => {
        try {
            const course = await dao.createCourse(req.body);
            const currentUser = req.session["currentUser"];
            if (currentUser) {
                await enrollmentsDao.enrollUserInCourse(currentUser._id, course._id);
            }
            res.json(course);
        } catch (error) {
            console.error("Error creating course:", error);
            res.status(500).json({ message: "Error creating course" });
        }
    });

    app.get("/api/courses", async (req, res) => {
        try {
            const courses = await dao.findAllCourses();
            res.json(courses);
        } catch (error) {
            res.status(500).json({ message: "Error fetching courses" });
        }
    });

    app.delete("/api/courses/:courseId", async (req, res) => {
        try {
            const status = await dao.deleteCourse(req.params.courseId);
            res.json(status);
        } catch (error) {
            res.status(500).json({ message: "Error deleting course" });
        }
    });

    app.put("/api/courses/:courseId", async (req, res) => {
        try {
            const status = await dao.updateCourse(req.params.courseId, req.body);
            res.json(status);
        } catch (error) {
            res.status(500).json({ message: "Error updating course" });
        }
    });

    // Module operations
    app.post("/api/courses/:courseId/modules", async (req, res) => {
        try {
            console.log("CourseId from URL:", req.params.courseId);
            console.log("Request body:", req.body);

            const module = {
                ...req.body,
                course: req.params.courseId,
            };
            console.log("Module to be created:", module);

            const newModule = await modulesDao.createModule(module);
            console.log("Created module:", newModule);

            res.json(newModule);
        } catch (error) {
            console.error("Detailed error:", error);
            res.status(500).json({
                message: "Error creating module",
                error: error.message
            });
        }
    });

    app.get("/api/courses/:courseId/modules", async (req, res) => {
        try {
            const modules = await modulesDao.findModulesForCourse(req.params.courseId);
            res.json(modules);
        } catch (error) {
            res.status(500).json({ message: "Error fetching modules" });
        }
    });

    // Assignment operations
    app.get("/api/courses/:courseId/assignments", async (req, res) => {
        try {
            const assignments = await assignmentsDao.findAssignmentsForCourse(req.params.courseId);
            res.json(assignments);
        } catch (error) {
            res.status(500).json({ message: "Error fetching assignments" });
        }
    });

    app.post("/api/courses/:courseId/assignments", async (req, res) => {
        try {
            const assignment = await assignmentsDao.createAssignment({
                ...req.body,
                course: req.params.courseId
            });
            res.json(assignment);
        } catch (error) {
            res.status(500).json({ message: "Error creating assignment" });
        }
    });
}