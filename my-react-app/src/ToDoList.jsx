import React, { useState, useEffect } from "react";
import axios from "axios";

function ToDoList() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");

    // Fetch tasks from backend
    useEffect(() => {
        axios.get("http://127.0.0.1:5000/tasks")
            .then(response => setTasks(response.data))
            .catch(error => console.error("Error fetching tasks:", error));
    }, []);

    // Add task
    function addTask() {
        if (newTask.trim() !== "") {
            axios.post("http://127.0.0.1:5000/tasks", { title: newTask })
                .then(response => setTasks(t => [...t, response.data]))
                .catch(error => console.error("Error adding task:", error));
            setNewTask("");
        }
    }

    // Delete task
    function deleteTask(id) {
        axios.delete(`http://127.0.0.1:5000/tasks/${id}`)
            .then(() => setTasks(t => t.filter(task => task.id !== id)))
            .catch(error => console.error("Error deleting task:", error));
    }

    // Move task up
    function moveTaskUp(index) {
        if (index > 0) {
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index - 1]] = [updatedTasks[index - 1], updatedTasks[index]];
            setTasks(updatedTasks);
        }
    }

    // Move task down
    function moveTaskDown(index) {
        if (index < tasks.length - 1) {
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index + 1]] = [updatedTasks[index + 1], updatedTasks[index]];
            setTasks(updatedTasks);
        }
    }

    return (
        <>
            <div className='to-do-list'>
                <h1>To-Do List</h1>
                <input
                    type="text"
                    placeholder="Enter a task..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTask()}
                />
                <button className="add-button" onClick={addTask}>Add</button>
            </div>
            <ol>
                {tasks.map((task, index) => (
                    <li key={task.id}>
                        <span className="text">{task.title}</span>
                        <button
                        className="delete-button"
                        onClick={() => deleteTask(task.id)}>Delete</button>
                        <button
                        className="move-button"
                        onClick={() => moveTaskUp(index)}>Up</button>
                        <button
                        className="move-button"
                        onClick={() => moveTaskDown(index)}>Down</button>
                    </li>
                ))}
            </ol>
        </>
    );
}

export default ToDoList;
