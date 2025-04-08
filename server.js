require("dotenv").config()

const express = require('express');
const app = express();
const pool = require("./db");

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.json());

app.get('/tasks', async (req, res) => {
    try {
        const getQuery = "SELECT * FROM tasks";
        const [rows] = await pool.execute(getQuery);
        
        res.render('tasks', { tasks: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.post("/tasks/add", async (req, res) => {
    const { taskTitle, taskDesc } = req.body;

    if (taskTitle && taskDesc) {
        try {
            const insertQuery = 'INSERT INTO tasks (taskTitle, taskDescription) VALUES (?, ?)';
            const [insertResult] = await pool.execute(insertQuery, [taskTitle, taskDesc]);

            return res.status(201).json({ 
                message: "Task added successfully!", 
                id: insertResult.insertId 
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Something went wrong' });
        }
    } else {
        return res.status(400).json({ error: 'Missing values' });
    }
});

app.delete("/tasks/delete/:id", async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'Task ID is required' });
    }

    try {
        const deleteQuery = "DELETE FROM tasks WHERE id = ?";
        const [result] = await pool.execute(deleteQuery, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        return res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Something went wrong' });
    }
});


app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});