import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ['HIGH PRIORITY', 'MODERATE PRIORITY', 'LOW PRIORITY'],
      required: true,
    },
    assignUserId: {
      type: String,
      required: false,
    },
    checklist: [
      {
        checked: {
          type: Boolean,
          required: true,
        },
        text: {
          type: String,
          required: true,
        }
      }
    ],
    dueDate: {
      type: Date,
      required: false,
    },
    createdDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Backlog', 'To do', 'In progress', 'Done'],
      required: true,
    },
    taskAdminUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    shareLink: {
      type: String,
      required: false,
    }
  });
  
  const Task = mongoose.model("Task", taskSchema);
  export default Task;
  