import model from "./model.js";
import courseModel from "../Courses/model.js";
import mongoose from "mongoose";

export async function findModulesForCourse(courseId) {
    try {
        // No need to find course first, just query directly with courseId
        const modules = await model.find({ course: courseId });
        return modules;
    } catch (error) {
        throw error;
    }
}

export async function updateModule(moduleId, moduleUpdates) {
    try {
        // Add validation for MongoDB ObjectId
        if (!mongoose.isValidObjectId(moduleId)) {
            const module = await model.findOne({ _id: moduleId });
            if (!module) {
                throw new Error(`Module not found with ID: ${moduleId}`);
            }
            moduleId = module._id; // Use the MongoDB ObjectId from the found document
        }

        const cleanUpdates = { ...moduleUpdates };
        delete cleanUpdates._id;
        delete cleanUpdates.__v;
        delete cleanUpdates.editing;

        const result = await model.findByIdAndUpdate(
            moduleId,
            cleanUpdates,
            {
                new: true,
                runValidators: true
            }
        );
        return result;
    } catch (error) {
        console.error('Update error details:', error);
        throw error;
    }
}

export async function createModule(module) {
    try {
        const createdModule = await model.create({
            name: module.name,
            course: module.course,
            lessons: module.lessons || []
        });
        return createdModule;
    } catch (error) {
        throw error;
    }
}

export function deleteModule(moduleId) {
    return model.deleteOne({ _id: moduleId.toString() });
}