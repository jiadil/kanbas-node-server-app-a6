import * as dao from "./dao.js";

export default function AssignmentRoutes(app) {
    const findAllAssignments = async (req, res) => {
        const assignments = await dao.findAllAssignments();
        res.json(assignments);
    };

    const findAssignmentById = async (req, res) => {
        const { id } = req.params;
        const assignment = await dao.findAssignmentById(id);
        res.json(assignment);
    };

    const findAssignmentsForCourse = async (req, res) => {
        const { courseId } = req.params;
        const assignments = await dao.findAssignmentsForCourse(courseId);
        res.json(assignments);
    };

    const createAssignment = async (req, res) => {
        const { courseId } = req.params;
        const assignment = { ...req.body, course: courseId };
        const newAssignment = await dao.createAssignment(assignment);
        res.json(newAssignment);
    };

    const updateAssignment = async (req, res) => {
        const { id } = req.params;
        const status = await dao.updateAssignment(id, req.body);
        res.json(status);
    };

    const deleteAssignment = async (req, res) => {
        const { id } = req.params;
        const status = await dao.deleteAssignment(id);
        res.json(status);
    };

    app.get("/api/assignments", findAllAssignments);
    app.get("/api/assignments/:id", findAssignmentById);
    app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
    app.post("/api/courses/:courseId/assignments", createAssignment);
    app.put("/api/assignments/:id", updateAssignment);
    app.delete("/api/assignments/:id", deleteAssignment);
}