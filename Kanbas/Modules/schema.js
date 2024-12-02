import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },  // Back to ObjectId
        name: String,
        description: String,
        course: String,  // Keep this as String for "RS101"
        lessons: [{
            id: String,
            name: String,
            description: String,
            module: String
        }]
    },
    { collection: "modules" }
);

export default schema;