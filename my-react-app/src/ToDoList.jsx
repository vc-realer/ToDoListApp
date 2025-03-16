import React, { useState, useEffect } from "react";
import axios from "axios";

function ToDoList() {
    const [tasks, setTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [newTask, setNewTask] = useState("");

    // Fetch tasks from backend
    useEffect(() => {
        axios.get("http://127.0.0.1:5000/tasks")
            .then(response => {
                const allTasks = response.data;
                setTasks(allTasks.filter(task => !task.completed));  // Unfinished tasks
                setCompletedTasks(allTasks.filter(task => task.completed)); // Finished tasks
            })
            .catch(error => console.error("Error fetching tasks:", error));
    }, []);

    // Add task
    function addTask() {
        if (newTask.trim() !== "") {
            axios.post("http://127.0.0.1:5000/tasks", { title: newTask, completed: false })
                .then(response => setTasks(t => [...t, response.data]))
                .catch(error => console.error("Error adding task:", error));
            setNewTask("");
        }
    }

    // Delete task
    function deleteTask(id) {
        axios.delete(`http://127.0.0.1:5000/tasks/${id}`)
            .then(() => {
                setTasks(t => t.filter(task => task.id !== id));
                setCompletedTasks(t => t.filter(task => task.id !== id));
            })
            .catch(error => console.error("Error deleting task:", error));
    }

    // Mark task as finished
    function finishTask(id) {
        axios.put(`http://127.0.0.1:5000/tasks/${id}`, { completed: true })
            .then(() => {
                const taskToFinish = tasks.find(task => task.id === id);
                setTasks(t => t.filter(task => task.id !== id));
                setCompletedTasks(t => [...t, { ...taskToFinish, completed: true }]);
            })
            .catch(error => console.error("Error updating task:", error));
    }

    function handleOnKeyDown(event) {
        if (event.key === "Enter") {
            addTask();
        }
    }

    return (
        <div className="container">
            {/* Left Column - To-Do List */}
            <div className="to-do-list">
                <h1>To-Do List</h1>
                <input
                    type="text"
                    placeholder="Enter a task..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={handleOnKeyDown}
                />
                <button className="add-button" onClick={addTask}>Add</button>
                <ol>
                    {tasks.map(task => (
                        <li key={task.id}>
                            <span className="text">{task.title}</span>
                            <button className="finish-button" onClick={() => finishTask(task.id)}>Finish</button>
                            <button className="delete-button" onClick={() => deleteTask(task.id)}>Delete</button>
                        </li>
                    ))}
                </ol>
            </div>

            {/* Right Column - Completed Tasks */}
            <div className="completed-tasks">
                <h2>Completed Tasks</h2>
                <ol>
                    {completedTasks.map(task => (
                        <li key={task.id}>
                            <span className="text done">{task.title} ✅</span>
                            <button className="delete-button" onClick={() => deleteTask(task.id)}>Delete</button>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
}

export default ToDoList;
