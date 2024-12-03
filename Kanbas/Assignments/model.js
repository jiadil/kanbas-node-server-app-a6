import mongoose from "mongoose";
import assignmentSchema from "./schema.js";
const assignmentModel = mongoose.model("Assignment", assignmentSchema);
export default assignmentModel;

