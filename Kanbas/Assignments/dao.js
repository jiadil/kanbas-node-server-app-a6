import Database from "../Database/index.js";

export const findAllAssignments = () => {
    return Database.assignments;
};

export const findAssignmentById = (assignmentId) => {
    return Database.assignments.find((assignment) => assignment._id === assignmentId);
};

export const findAssignmentsForCourse = (courseId) => {
    return Database.assignments.filter((assignment) => assignment.course === courseId);
};

export const createAssignment = (assignment) => {
    const newAssignment = { ...assignment, _id: new Date().getTime().toString() };
    Database.assignments = [...Database.assignments, newAssignment];
    return newAssignment;
};

export const updateAssignment = (aid, assignment) => {
    Database.assignments = Database.assignments.map((a) =>
        a._id === aid ? { ...a, ...assignment } : a
    );
    return assignment;
};

export const deleteAssignment = (aid) => {
    Database.assignments = Database.assignments.filter((a) => a._id !== aid);
    return { status: "ok" };
};