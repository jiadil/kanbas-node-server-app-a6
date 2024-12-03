import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        name: String,
        description: String,
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
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