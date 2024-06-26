import mongoose from 'mongoose';
import Task from '../modals/task.js';

export const createTask = async (req, res) => {
    try {
      const { title, priority, assignUserId, checklist, dueDate } = req.body;
  
      if (!title || !priority || !checklist) {
        return res.status(400).json({ message: 'Title, priority, and checklist are required.' });
      }
  
      if (!Array.isArray(checklist) || checklist.some(item => typeof item.checked !== 'boolean' || typeof item.text !== 'string')) {
        return res.status(400).json({ message: 'Checklist must be an array of objects with "checked" as boolean and "text" as string.' });
      }
  
      const validPriorities = ['HIGH PRIORITY', 'MODERATE PRIORITY', 'LOW PRIORITY'];
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({ message: 'Invalid priority value.' });
      }
  
      const newTask = new Task({
        title,
        priority,
        assignUserId: assignUserId ? new mongoose.Types.ObjectId(assignUserId) : null,
        checklist,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: 'Backlog', // Default status
        taskAdminUserId: req.currentUserId, // Set to the logged-in user ID from the middleware
        shareLink: null,
      });
  
      // Save the task to the database
      const savedTask = await newTask.save();
  
      res.status(201).json(savedTask);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  };

  export const updateTask = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, priority, assignUserId, checklist, dueDate, status, shareLink} = req.body;
  
    //   console.log('Request received to update task with id:', id);
  
      // Validate if the task exists
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found.' });
      }
  
      // Validate priority value
      const validPriorities = ['HIGH PRIORITY', 'MODERATE PRIORITY', 'LOW PRIORITY'];
      if (priority && !validPriorities.includes(priority)) {
        return res.status(400).json({ message: 'Invalid priority value.' });
      }
  
      // Validate status value
      const validStatuses = ['Backlog', 'To do', 'In progress', 'Done'];
      if (status && !validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value.' });
      }
  
      // Validate checklist structure
      if (checklist && (!Array.isArray(checklist) || checklist.some(item => typeof item.checked !== 'boolean' || typeof item.text !== 'string'))) {
        return res.status(400).json({ message: 'Checklist must be an array of objects with "checked" as boolean and "text" as string.' });
      }

      // Update task object
      if (title) task.title = title;
      if (priority) task.priority = priority;
      if (assignUserId) task.assignUserId = assignUserId;      
      if (checklist) task.checklist = checklist;
      if (dueDate) task.dueDate = new Date(dueDate);
      if (status) task.status = status;
      if (shareLink) task.shareLink = shareLink;
  
      // Save the updated task to the database
      const updatedTask = await task.save();
  
      res.status(200).json(updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};
  
export const getTasksByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { email } = req.query;
    
        // Validate if either userId or email is provided
        if (!userId && !email) {
          return res.status(400).json({ message: 'User ID or email is required.' });
        }
    
        // Prepare the query criteria based on provided parameters
        let queryCriteria = {};
    
        if (userId) {
          queryCriteria.$or = [
            { taskAdminUserId: new mongoose.Types.ObjectId(userId) },
          ];
        }
    
        if (email) {
          queryCriteria.$or = queryCriteria.$or || []; // Initialize if not already
          queryCriteria.$or.push({ assignUserId: email });
        }
    
        // Find tasks based on the combined query criteria
        const tasks = await Task.find(queryCriteria);
    
        res.status(200).json(tasks);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
      }
};

  export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate if the task ID is provided and is a valid ObjectId
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid task ID.' });
        }

        // Find and delete the task
        const deletedTask = await Task.findByIdAndDelete(id);

        // If the task is not found
        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        res.status(200).json({ message: 'Task deleted successfully.', deletedTask });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};  