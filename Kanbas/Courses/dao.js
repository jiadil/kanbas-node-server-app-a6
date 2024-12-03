import model from "./model.js";
import * as enrollmentDao from "../Enrollments/dao.js";

export const findAllCourses = async () => {
    const courses = await model.find();
    return courses;
};

export const findCoursesForEnrolledUser = async (userId) => {
    try {
        const enrollments = await enrollmentDao.findEnrollmentsByUser(userId);

        if (!enrollments || enrollments.length === 0) {
            return [];
        }

        const enrolledCourses = enrollments.map(enrollment => {
            return enrollment.course;
        });

        return enrolledCourses;
    } catch (error) {
        console.error("Error in findCoursesForEnrolledUser:", error);
        throw error;
    }
};

export const createCourse = async (course) => {
    const courseData = { ...course };
    delete courseData._id;
    return model.create(courseData);
};

export const deleteCourse = (courseId) => {
    return model.deleteOne({ _id: courseId });
};

export const updateCourse = (courseId, courseUpdates) => {
    return model.updateOne(
        { _id: courseId },
        { $set: courseUpdates }
    );
};