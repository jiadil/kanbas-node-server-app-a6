import model from "./model.js";
import * as enrollmentDao from "../Enrollments/dao.js";

export const findAllCourses = async () => {
    console.log("findAllCourses: Fetching all courses");
    const courses = await model.find();
    console.log("findAllCourses: Found courses:", courses.length);
    return courses;
};

export const findCoursesForEnrolledUser = async (userId) => {
    console.log("findCoursesForEnrolledUser: Finding courses for user:", userId);

    try {
        const enrollments = await enrollmentDao.findEnrollmentsByUser(userId);
        console.log("findCoursesForEnrolledUser: Found enrollments:", JSON.stringify(enrollments, null, 2));

        if (!enrollments || enrollments.length === 0) {
            console.log("findCoursesForEnrolledUser: No enrollments found for user");
            return [];
        }

        const enrolledCourses = enrollments.map(enrollment => {
            console.log("Processing enrollment:", enrollment);
            return enrollment.course;
        });

        console.log("findCoursesForEnrolledUser: Mapped courses:", JSON.stringify(enrolledCourses, null, 2));
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