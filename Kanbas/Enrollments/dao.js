import model from "./model.js";

export const findAllEnrollments = async () => {
    const enrollments = await model.find()
        .populate("user")
        .populate("course");
    return enrollments;
};

export const createEnrollment = async (userId, courseId) => {
    const enrollment = {
        user: userId,
        course: courseId,
        status: "ENROLLED"
    };
    const newEnrollment = await model.create(enrollment);
    return newEnrollment;
};

export const deleteEnrollment = async (userId, courseId) => {
    const result = await model.deleteOne({
        user: userId,
        course: courseId
    });
    return result;
};

export const findEnrollmentsByUser = async (userId) => {
    try {
        const enrollments = await model.find({ user: userId })
            .populate({
                path: "course",
                model: "CourseModel"
            });


        // Clean up any enrollments with missing courses
        const validEnrollments = enrollments.filter(enrollment => enrollment.course);

        // If we found invalid enrollments, we might want to clean them up
        if (validEnrollments.length !== enrollments.length) {
            const invalidEnrollments = enrollments.filter(enrollment => !enrollment.course);
            for (const invalid of invalidEnrollments) {
                await model.deleteOne({ _id: invalid._id });
            }
        }

        return validEnrollments;
    } catch (error) {
        console.error("Error in findEnrollmentsByUser:", error);
        throw error;
    }
};

export const findEnrollmentsByCourse = async (courseId) => {
    try {
        const enrollments = await model.find({ course: courseId })
            .populate({
                path: 'user',
                model: 'UserModel',
                select: 'firstName lastName username email role loginId section totalActivity'
            })
            .lean()
            .exec();
        return enrollments;
    } catch (error) {
        throw error;
    }
};

export const enrollUserInCourse = async (userId, courseId) => {
    const enrollment = {
        user: userId,
        course: courseId,
        status: "ENROLLED"
    };
    const newEnrollment = await model.create(enrollment);
    return newEnrollment;
};