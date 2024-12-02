// import Database from "../Database/index.js";
import model from "./model.js";
import courseModel from "../Courses/model.js";

export async function findModulesForCourse(courseId) {
    try {
        const course = await courseModel.findById(courseId);

        const modules = await model.find({ course: course.number });
        return modules;
    } catch (error) {
        throw error;
    }
}

export async function updateModule(moduleId, moduleUpdates) {
    try {
        const cleanUpdates = { ...moduleUpdates };
        delete cleanUpdates._id;  // Remove _id from updates
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
        throw error;
    }
}

// In your modulesDao.js
export async function createModule(module) {
    try {
        const course = await courseModel.findById(module.course);
        if (!course) {
            throw new Error("Course not found");
        }

        // Create new module with course number
        const newModule = {
            name: module.name,
            description: module.description,
            course: course.number,  // Use course.number (like "RS101")
            lessons: module.lessons || []  // Initialize empty lessons array if not provided
        };

        const createdModule = await model.create(newModule);
        return createdModule;
    } catch (error) {
        throw error;
    }
}

export function deleteModule(moduleId) {
    return model.deleteOne({ _id: moduleId.toString() });
}
