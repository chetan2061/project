# 📝 To-Do List App

A simple and organized **To-Do List application** built with a **Node.js backend** and a **vanilla HTML/CSS/JS frontend**.  
This project helps users create, manage, and track their daily tasks easily.

---

## 🚀 Features
- Add new tasks  
- Mark tasks as complete/incomplete  
- Delete tasks  
- Organized structure with separate **frontend** and **backend**  
- REST API for task management  

## 📂 Project Structure
```plaintext
project/
│── backend/              # Server-side logic
│   ├── controllers/      # API controllers
│   ├── middlewares/      # Middlewares
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── server.js         # Entry point for backend
│   └── .env              # Environment variables
│
│── frontend/             # Client-side files
│   ├── css/
│   │   └── styles.css    # Stylesheet
│   ├── javascript/
│   │   └── script.js     # Frontend logic
│   └── index.html        # Main UI
│
│── node_modules/         # Dependencies
│── package.json          # Project metadata & scripts
│── package-lock.json     # Dependency lock file
│── README.md             # Project documentation
│── .gitignore            # Ignored files
│── logo.jpg              # App logo


## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-link>
   cd project
Install dependencies

bash
Copy
Edit
npm install
Set environment variables
Create a .env file inside the backend/ folder:

env
Copy
Edit
PORT=5000
MONGO_URI=your_mongo_connection_string
Start the backend server

bash
Copy
Edit
cd backend
npm run dev   # or: node server.js
Open the frontend
Open frontend/index.html in your browser.

📌 API Endpoints
Method	Endpoint	Description
GET	/api/tasks	Get all tasks
POST	/api/tasks	Add a new task
PUT	/api/tasks/:id	Update a task
DELETE	/api/tasks/:id	Delete a task

🛠️ Tech Stack
Backend: Node.js, Express, MongoDB

Frontend: HTML, CSS, JavaScript

👨‍💻 Author
Chetan Singh
📌 Passionate developer learning full-stack development.
