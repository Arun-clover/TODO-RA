const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Todo = require("../modules/dataSchema");

router.post("/todo", async (req, res) => {
  const { title, description, completed } = req.body;
  try {
    const newTodo = new Todo({ title, description, completed });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: "Error adding todo", error });
  }
});
router.get("/todo", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (error) {
    res.status(400).json({ message: "Error fetching todos", error });
  }
});
router.delete("/todo/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting todo", error });
  }
});
router.patch("/todo/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;
  try {
    const updateData = {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(completed !== undefined && { completed }),
    };
    const updatedTodo = await Todo.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({
      message: "Error updating todo",
      error: error.message,
    });
  }
});
module.exports = router;
