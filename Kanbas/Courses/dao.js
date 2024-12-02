import model from "./model.js";

export const findAllCourses = () => {
    return model.find();
};

export const findCoursesForEnrolledUser = async (userId) => {
    return model.find({
        _id: { $in: await findEnrollmentsByUser(userId) }
    });
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