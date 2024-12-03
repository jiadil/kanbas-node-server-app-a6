import * as dao from "./dao.js";

export default function AssignmentRoutes(app) {
    const findAllAssignments = async (req, res) => {
        try {
            const assignments = await dao.findAllAssignments();
            res.json(assignments);
        } catch (error) {
            res.status(500).json({ message: "Error fetching assignments" });
        }
    };

    const findAssignmentById = async (req, res) => {
        try {
            const { id } = req.params;
            const assignment = await dao.findAssignmentById(id);
            if (!assignment) {
                return res.status(404).json({ message: "Assignment not found" });
            }
            res.json(assignment);
        } catch (error) {
            res.status(500).json({ message: "Error fetching assignment" });
        }
    };

    const findAssignmentsForCourse = async (req, res) => {
        try {
            const { courseId } = req.params;
            const assignments = await dao.findAssignmentsForCourse(courseId);
            res.json(assignments);
        } catch (error) {
            res.status(500).json({ message: "Error fetching course assignments" });
        }
    };

    const createAssignment = async (req, res) => {
        try {
            const { courseId } = req.params;
            const assignment = { ...req.body, course: courseId };
            const newAssignment = await dao.createAssignment(assignment);
            res.json(newAssignment);
        } catch (error) {
            console.error("Route - Creation error:", {
                error: error.message,
                stack: error.stack
            });
            res.status(500).json({
                message: "Error creating assignment",
                details: error.message
            });
        }
    };

    const updateAssignment = async (req, res) => {
        try {
            const { id } = req.params;
            const updated = await dao.updateAssignment(id, req.body);
            if (!updated) {
                return res.status(404).json({ message: "Assignment not found" });
            }
            res.json(updated);
        } catch (error) {
            console.error("Update error:", error);
            res.status(500).json({
                message: "Error updating assignment",
                error: error.message
            });
        }
    };

    const deleteAssignment = async (req, res) => {
        try {
            const { id } = req.params;
            const deleted = await dao.deleteAssignment(id);
            if (!deleted) {
                return res.status(404).json({ message: "Assignment not found" });
            }
            res.json({ message: "Assignment deleted successfully" });
        } catch (error) {
            console.error("Delete error:", error);
            res.status(500).json({
                message: "Error deleting assignment",
                error: error.message
            });
        }
    };

    app.get("/api/assignments", findAllAssignments);
    app.get("/api/assignments/:id", findAssignmentById);
    app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
    app.post("/api/courses/:courseId/assignments", createAssignment);
    app.put("/api/assignments/:id", updateAssignment);
    app.delete("/api/assignments/:id", deleteAssignment);
}