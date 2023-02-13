import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      default: "",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    isImportant: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  }
);

const TasksSchema = new mongoose.Schema(
  {
    calendarDate: {
      type: String,
      default: "",
    },
    tasks: [TaskSchema],

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Tasks", TasksSchema);
