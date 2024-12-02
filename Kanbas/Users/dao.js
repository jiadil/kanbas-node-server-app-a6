import model from "./model.js";
// import db from "../Database/index.js";
// let { users } = db;

export const createUser = (user) => {
    delete user._id
    return model.create(user);
}

export const findAllUsers = () => model.find();
export const findUserById = (userId) => model.findById(userId);
export const findUserByUsername = (username) => model.findOne({ username: username });
export const findUserByCredentials = (username, password) => model.findOne({ username, password });
export const updateUser = (userId, user) => model.updateOne({ _id: userId }, { $set: user });
export const deleteUser = (userId) => model.deleteOne({ _id: userId });
export const findUsersByRole = (role) => model.find({ role: role }); // or just model.find({ role })
export const findUsersByPartialName = (partialName) => {
    const regex = new RegExp(partialName, "i"); // 'i' makes it case-insensitive
    return model.find({
        $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
    });
};


// export const findUserById = (userId) => {
//     // Compare with string ID directly
//     return users.find((user) => user._id === userId.toString());
// };

// export const updateUser = (userId, userUpdates) => {
//     // Compare with string ID and preserve the existing _id
//     users = users.map((u) => {
//         if (u._id === userId.toString()) {
//             return { ...u, ...userUpdates, _id: u._id }; // Keep the original _id
//         }
//         return u;
//     });
//     return findUserById(userId);
// };

// // Keep other functions as they are
// export const createUser = (user) => {
//     const newUser = { ...user, _id: new Date().getTime().toString() };  // Store new IDs as strings
//     users = [...users, newUser];
//     return newUser;
// };

// export const findAllUsers = () => users;
// export const findUserByUsername = (username) => users.find((user) => user.username === username);
// export const findUserByCredentials = (username, password) =>
//     users.find((user) => user.username === username && user.password === password);
// export const deleteUser = (userId) => (users = users.filter((u) => u._id !== userId.toString()));