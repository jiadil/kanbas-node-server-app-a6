import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',  // Add reference to Course model
        required: true
    },
    points: {
        type: Number,
        default: 100
    },
    description: {
        type: String,
        default: ""
    },
    available: {
        type: Date,
        default: Date.now
    },
    due: {
        type: Date,
        default: Date.now
    },
    until: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'assignments',
    timestamps: true
});

export default assignmentSchema;