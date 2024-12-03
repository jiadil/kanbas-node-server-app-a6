import Assignment from "./model.js";
import mongoose from "mongoose";

export const findAllAssignments = () =>
    Assignment.find().lean();

export const findAssignmentById = (assignmentId) =>
    Assignment.findById(assignmentId).lean();

export const findAssignmentsForCourse = async (courseId) => {
    try {
        const courseObjectId = new mongoose.Types.ObjectId(courseId);
        const assignments = await Assignment.find({ course: courseObjectId }).lean();
        return assignments;
    } catch (error) {
        console.error("Error finding assignments for course:", error);
        throw error;
    }
};

export const createAssignment = async (assignment) => {
    try {
        const { _id, ...assignmentData } = assignment;

        const formattedAssignment = {
            ...assignmentData,
            course: new mongoose.Types.ObjectId(assignmentData.course),
            available: assignmentData.available ? new Date(assignmentData.available) : new Date(),
            due: assignmentData.due ? new Date(assignmentData.due) : new Date(),
            until: assignmentData.until ? new Date(assignmentData.until) : new Date()
        };
        const created = await Assignment.create(formattedAssignment);
        return created;
    } catch (error) {
        console.error("Error creating assignment:", error);
        throw error;
    }
};

export const updateAssignment = async (aid, assignment) => {
    try {
        const formattedAssignment = {
            ...assignment,
            course: assignment.course ? new mongoose.Types.ObjectId(assignment.course) : undefined,
            available: assignment.available ? new Date(assignment.available) : undefined,
            due: assignment.due ? new Date(assignment.due) : undefined,
            until: assignment.until ? new Date(assignment.until) : undefined
        };

        const updated = await Assignment.findByIdAndUpdate(
            aid,
            formattedAssignment,
            { new: true, runValidators: true }
        ).lean();

        if (!updated) {
            throw new Error('Assignment not found');
        }

        return updated;
    } catch (error) {
        console.error("Error updating assignment:", error);
        throw error;
    }
};

export const deleteAssignment = async (aid) => {
    try {
        const deleted = await Assignment.findByIdAndDelete(aid);
        if (!deleted) {
            throw new Error('Assignment not found');
        }
        return deleted;
    } catch (error) {
        console.error("Error deleting assignment:", error);
        throw error;
    }
};