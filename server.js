const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.json());

app.get('/tasks', (req, res) => {
    console.log("WOOOORK")
    console.log("blablbla")
    res.render('tasks', { message: 'Hello, EJS!' });
});

app.post("/tasks/add", (req, res) => {
    console.log("CALLING ADD")
    const { taskName, taskDesc } = req.body;

    console.log("called")
    if (taskName && taskDesc) {
        return res.status(201).json({ message: "Task added successfully!" });
    }
})

app.delete("/tasks/delete/:taskName", (req, res) => {
    const { taskName } = req.params;

    // tasks = tasks.filter(task => task.taskName !== taskName);  // Remove the task from the list

    res.status(200).send("Task deleted.");
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});