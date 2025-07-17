import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Path setup for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// App setup
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Task storage (in-memory array)
let tasks = [];

// Routes
app.get("/", (req, res) => {
  const filter = req.query.priority || "All";
  const filteredTasks = filter === "All" ? tasks : tasks.filter(t => t.priority === filter);
  const msg = req.query.msg || null;
  res.render("index", { tasks: filteredTasks, filter, msg });
});

app.post("/add", (req, res) => {
  const { task, priority } = req.body;
  // if (!task.trim()) return res.redirect("/?msg=Task%20cannot%20be%20empty");
  tasks.push({
    id: Date.now().toString(),
    name: task.trim(),
    priority,
  });
  res.redirect("/?msg=Task%20added%20successfully");
});

app.post("/edit/:id", (req, res) => {
  const { id } = req.params;
  const { updatedTask } = req.body;
  if (!updatedTask.trim()) return res.redirect("/?msg=Task%20cannot%20be%20empty");
  tasks = tasks.map((task) => (task.id === id ? { ...task, name: updatedTask.trim() } : task));
  res.redirect("/?msg=Task%20updated%20successfully");
});

app.post("/delete/:id", (req, res) => {
  tasks = tasks.filter((task) => task.id !== req.params.id);
  res.redirect("/?msg=Task%20deleted%20successfully");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
