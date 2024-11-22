// In dao.js
import db from "../Database/index.js";
let { users } = db;

export const findUserById = (userId) => {
    // Compare with string ID directly
    return users.find((user) => user._id === userId.toString());
};

export const updateUser = (userId, userUpdates) => {
    // Compare with string ID and preserve the existing _id
    users = users.map((u) => {
        if (u._id === userId.toString()) {
            return { ...u, ...userUpdates, _id: u._id }; // Keep the original _id
        }
        return u;
    });
    return findUserById(userId);
};

// Keep other functions as they are
export const createUser = (user) => {
    const newUser = { ...user, _id: new Date().getTime().toString() };  // Store new IDs as strings
    users = [...users, newUser];
    return newUser;
};

export const findAllUsers = () => users;
export const findUserByUsername = (username) => users.find((user) => user.username === username);
export const findUserByCredentials = (username, password) =>
    users.find((user) => user.username === username && user.password === password);
export const deleteUser = (userId) => (users = users.filter((u) => u._id !== userId.toString()));