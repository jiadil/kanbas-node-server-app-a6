// Kanbas/Enrollments/schema.js
import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserModel",
            required: true
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CourseModel",
            required: true
        },
        status: {
            type: String,
            enum: ["ENROLLED", "DROPPED", "COMPLETED"],
            default: "ENROLLED"
        }
    },
    { collection: "enrollments" }
);

export default enrollmentSchema;