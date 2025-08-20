// Global variables
let tasks = [];
let currentFilter = "all";
let currentView = "calendar";
let showCompleted = false;
let currentTheme = "light";

// Backend API Configuration
const API_URL = "/api/tasks";

// Initialize app
document.addEventListener("DOMContentLoaded", function () {
  initializeTheme();
  setCurrentDate();
  fetchTasks(); // Load tasks from backend
});

// Theme Management
function initializeTheme() {
  // Check for saved theme preference or default to 'light'
  const savedTheme = localStorage?.getItem("theme") || "light";
  currentTheme = savedTheme;
  document.documentElement.setAttribute("data-theme", currentTheme);
  updateGreeting();
}

function toggleTheme() {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", currentTheme);

  // Save theme preference if localStorage is available
  try {
    localStorage?.setItem("theme", currentTheme);
  } catch (e) {
    console.log("Theme preference saved to memory only");
  }

  updateGreeting();
}

function updateGreeting() {
  const logoText = document.querySelector(".logo-text");
  const greeting = currentTheme === "dark" ? "Good Evening" : "Good Morning";
  logoText.innerHTML = `${greeting}<br>CHETAN !`;
}

// Date Management
function setCurrentDate() {
  const now = new Date();
  const options = { month: "long", year: "numeric" };
  const dateStr = now.toLocaleDateString("en-US", options);
  const dayStr =
    now.getDate() + "," + now.toLocaleDateString("en-US", { weekday: "short" });

  document.getElementById("currentDate").textContent = dateStr;
  document.getElementById("currentDay").textContent = dayStr;
}

// Backend API Functions
async function fetchTasks(filter = "all") {
  try {
    const res = await fetch(API_URL);
    tasks = await res.json();
    renderTasks(filter);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    // showNotification("Error loading tasks", "error");
  }
}

async function addTask(e) {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const dueDate = document.getElementById("dueDate").value;
  const priority = document.getElementById("priority").value;
  const description = document.getElementById("description").value.trim();

  if (!title) {
    showNotification("Please enter a task title", "warning");
    return;
  }

  const task = {
    title,
    dueDate,
    priority,
    description,
    completed: false,
  };

  try {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });

    document.getElementById("taskForm").reset();
    toggleTaskForm();
    fetchTasks();
    showNotification("Task added successfully!", "success");
  } catch (error) {
    console.error("Error adding task:", error);
    showNotification("Error adding task", "error");
  }
}

async function toggleComplete(id) {
  const task = tasks.find((t) => t._id === id);
  if (!task) return;

  try {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...task, completed: !task.completed }),
    });

    const action = !task.completed ? "completed" : "marked incomplete";
    showNotification(`Task ${action}!`, "success");
    fetchTasks(document.getElementById("filter")?.value || currentFilter);
  } catch (error) {
    console.error("Error toggling task:", error);
    showNotification("Error updating task", "error");
  }
}

async function deleteTask(id) {
  if (confirm("Are you sure you want to delete this task?")) {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      showNotification("Task deleted", "success");
      fetchTasks(document.getElementById("filter")?.value || currentFilter);
    } catch (error) {
      console.error("Error deleting task:", error);
      showNotification("Error deleting task", "error");
    }
  }
}

async function clearCompletedTasks() {
  const completedCount = tasks.filter((task) => task.completed).length;
  if (completedCount === 0) {
    showNotification("No completed tasks to clear", "info");
    return;
  }

  if (
    confirm(
      `Are you sure you want to delete ${completedCount} completed task(s)?`
    )
  ) {
    try {
      await fetch(`${API_URL}/completed`, { method: "DELETE" });
      showNotification(
        `${completedCount} completed task(s) deleted`,
        "success"
      );
      fetchTasks();
    } catch (error) {
      console.error("Error clearing completed tasks:", error);
      showNotification("Error clearing completed tasks", "error");
    }
  }
}

async function clearAllTasks() {
  if (tasks.length === 0) {
    showNotification("No tasks to clear", "info");
    return;
  }

  if (confirm(`Are you sure you want to delete all ${tasks.length} task(s)?`)) {
    try {
      await fetch(API_URL, { method: "DELETE" });
      showNotification("All tasks deleted", "success");
      fetchTasks();
    } catch (error) {
      console.error("Error clearing all tasks:", error);
      showNotification("Error clearing all tasks", "error");
    }
  }
}

function startEditTask(id) {
  const task = tasks.find((t) => t._id === id);
  if (!task) return;

  document.getElementById("title").value = task.title;
  document.getElementById("dueDate").value = task.dueDate.split("T")[0];
  document.getElementById("priority").value = task.priority;
  document.getElementById("description").value = task.description;

  // Show the form
  const form = document.getElementById("taskForm");
  form.classList.add("active");
  document.getElementById("title").focus();

  // Change form submit handler to update instead of add
  document.getElementById("taskForm").onsubmit = (e) => updateTask(e, id);
  showNotification("Task loaded for editing", "info");
}

async function updateTask(e, id) {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const dueDate = document.getElementById("dueDate").value;
  const priority = document.getElementById("priority").value;
  const description = document.getElementById("description").value.trim();

  if (!title) {
    showNotification("Please enter a task title", "warning");
    return;
  }

  try {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, dueDate, priority, description }),
    });

    document.getElementById("taskForm").reset();
    document.getElementById("taskForm").onsubmit = addTask;
    toggleTaskForm();
    fetchTasks();
    showNotification("Task updated successfully!", "success");
  } catch (error) {
    console.error("Error updating task:", error);
    showNotification("Error updating task", "error");
  }
}

// Task Form Management
function toggleTaskForm() {
  const form = document.getElementById("taskForm");
  form.classList.toggle("active");

  if (form.classList.contains("active")) {
    document.getElementById("title").focus();
    // Set default date to today
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("dueDate").value = today;
  } else {
    form.reset();
    // Reset form handler to add task
    document.getElementById("taskForm").onsubmit = addTask;
  }
}

// Rendering Functions
function renderTasks(filter = "all") {
  currentFilter = filter;

  let filtered = tasks;

  if (filter === "completed") filtered = tasks.filter((t) => t.completed);
  else if (filter === "incomplete")
    filtered = tasks.filter((t) => !t.completed);
  else if (filter === "high")
    filtered = tasks.filter((t) => t.priority === "High");
  else if (filter === "medium")
    filtered = tasks.filter((t) => t.priority === "Medium");
  else if (filter === "low")
    filtered = tasks.filter((t) => t.priority === "Low");

  renderSidebarTasks(filtered);
  renderKanbanTasks(filtered);
  updateCounts();
}

function renderSidebarTasks(filteredTasks) {
  const incompleteTasks = filteredTasks.filter((task) => !task.completed);
  const completedTasks = filteredTasks.filter((task) => task.completed);

  // Render incomplete tasks in sidebar
  const sidebarContainer = document.getElementById("sidebarTasks");
  sidebarContainer.innerHTML = incompleteTasks
    .map(
      (task) => `
    <div class="sidebar-task ${
      task.completed ? "completed" : ""
    }" onclick="toggleComplete('${task._id}')">
      <div class="task-checkbox ${task.completed ? "completed" : ""}"></div>
      <span>${task.title}</span>
    </div>
  `
    )
    .join("");

  // Render completed tasks
  const completedContainer = document.getElementById("completedTasks");
  completedContainer.innerHTML = completedTasks
    .map(
      (task) => `
    <div class="sidebar-task completed" onclick="toggleComplete('${task._id}')">
      <div class="task-checkbox completed"></div>
      <span>${task.title}</span>
    </div>
  `
    )
    .join("");

  document.getElementById(
    "completedCount"
  ).textContent = `(${completedTasks.length})`;
}

function renderKanbanTasks(filteredTasks) {
  // For kanban view, we'll categorize tasks by status (we'll use a simple logic)
  const todoTasks = filteredTasks.filter(
    (task) => !task.completed && !task.status
  );
  const doingTasks = filteredTasks.filter(
    (task) => !task.completed && task.status === "doing"
  );
  const doneTasks = filteredTasks.filter((task) => task.completed);

  renderColumn("todoTasks", todoTasks);
  renderColumn("doingTasks", doingTasks);
  renderColumn("doneTasks", doneTasks);
}

function renderColumn(containerId, tasks) {
  const container = document.getElementById(containerId);
  container.innerHTML = tasks.map((task) => createTaskCard(task)).join("");
}

function createTaskCard(task) {
  const priorityClass = task.priority.toLowerCase();
  const dueDate = new Date(task.dueDate.split("T")[0]).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
    }
  );

  const isOverdue =
    new Date(task.dueDate.split("T")[0]) < new Date() && !task.completed;
  const dueDateClass = isOverdue ? "overdue" : "";

  return `
    <div class="kanban-task ${priorityClass}-priority ${dueDateClass}">
      <div class="task-title">${task.title}</div>
      ${
        task.description
          ? `<div class="task-description">${task.description}</div>`
          : ""
      }
      <div class="task-meta">
        <span class="task-due-date ${dueDateClass}">${dueDate}${
    isOverdue ? " (Overdue)" : ""
  }</span>
        <span class="priority-badge priority-${priorityClass}">${
    task.priority
  }</span>
      </div>
      <div class="task-actions">
        ${
          !task.completed
            ? `
          <button class="action-btn btn-complete" onclick="toggleComplete('${task._id}')">Complete</button>
          <button class="action-btn btn-edit" onclick="startEditTask('${task._id}')">Edit</button>
        `
            : `
          <button class="action-btn btn-edit" onclick="toggleComplete('${task._id}')">Undo</button>
        `
        }
        <button class="action-btn btn-delete" onclick="deleteTask('${
          task._id
        }')">Delete</button>
      </div>
    </div>
  `;
}

// Filter Functions
function filterTasks(filter) {
  currentFilter = filter;

  // Update active filter button
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");

  renderTasks(filter);
}

function searchTasks() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const taskCards = document.querySelectorAll(".kanban-task");

  taskCards.forEach((card) => {
    const title = card.querySelector(".task-title").textContent.toLowerCase();
    const description = card.querySelector(".task-description");
    const descText = description ? description.textContent.toLowerCase() : "";

    if (title.includes(searchTerm) || descText.includes(searchTerm)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// Utility Functions
function toggleCompleted() {
  showCompleted = !showCompleted;
  const completedSection = document.getElementById("completedTasks");
  const arrow = document.querySelector(".toggle-arrow");

  completedSection.style.display = showCompleted ? "block" : "none";
  arrow.classList.toggle("rotated", showCompleted);
}

function switchView(view) {
  currentView = view;
  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");

  showNotification(`Switched to ${view} view`, "info");
}

function updateCounts() {
  const todoCount = tasks.filter((t) => !t.completed && !t.status).length;
  const doingCount = tasks.filter(
    (t) => !t.completed && t.status === "doing"
  ).length;
  const doneCount = tasks.filter((t) => t.completed).length;

  document.getElementById("todoCount").textContent = todoCount;
  document.getElementById("doingCount").textContent = doingCount;
  document.getElementById("doneCount").textContent = doneCount;
}

// Notification System
function showNotification(message, type = "info") {
  // Remove existing notification
  const existing = document.querySelector(".notification");
  if (existing) {
    existing.remove();
  }

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Add styles
  Object.assign(notification.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "12px 20px",
    borderRadius: "8px",
    color: "white",
    fontWeight: "500",
    fontSize: "14px",
    zIndex: "9999",
    transform: "translateX(100%)",
    transition: "transform 0.3s ease",
    maxWidth: "300px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  });

  // Set background color based on type
  const colors = {
    success: "#2ecc71",
    error: "#e74c3c",
    info: "#3498db",
    warning: "#f39c12",
  };
  notification.style.backgroundColor = colors[type] || colors.info;

  // Add to DOM
  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 10);

  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 3000);
}

// Keyboard Shortcuts
document.addEventListener("keydown", function (e) {
  // Ctrl/Cmd + N: New task
  if ((e.ctrlKey || e.metaKey) && e.key === "n") {
    e.preventDefault();
    toggleTaskForm();
  }

  // Escape: Close form
  if (e.key === "Escape") {
    const form = document.getElementById("taskForm");
    if (form.classList.contains("active")) {
      toggleTaskForm();
    }
  }

  // Ctrl/Cmd + F: Focus search
  if ((e.ctrlKey || e.metaKey) && e.key === "f") {
    e.preventDefault();
    document.getElementById("searchInput").focus();
  }
});

// Initialize date picker with today's date
document.addEventListener("DOMContentLoaded", function () {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("dueDate").setAttribute("min", today);
});
