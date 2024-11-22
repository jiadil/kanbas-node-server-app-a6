import Database from "../Database/index.js";

export function enrollUserInCourse(userId, courseId) {
    const { enrollments } = Database;
    enrollments.push({ _id: Date.now(), user: userId, course: courseId });
}

export const findAllEnrollments = () => {
    return Database.enrollments;
};

export const createEnrollment = (userId, courseId) => {
    const enrollment = {
        _id: new Date().getTime().toString(),
        user: userId,
        course: courseId,
    };
    Database.enrollments = [...Database.enrollments, enrollment];
    return enrollment;
};

export const deleteEnrollment = (userId, courseId) => {
    Database.enrollments = Database.enrollments.filter(
        (enrollment) => !(enrollment.user === userId && enrollment.course === courseId)
    );
    return { status: "OK" };
};

export const findEnrollmentsByUser = (userId) => {
    return Database.enrollments.filter(
        (enrollment) => enrollment.user === userId
    );
};

export const findEnrollmentsByCourse = (courseId) => {
    return Database.enrollments.filter(
        (enrollment) => enrollment.course === courseId
    );
};