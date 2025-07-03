# ✅ Task Management System (RBAC-Based)

A simple, secure Task Management System built with the MERN stack. It features role-based dashboards for Admins and Users, making it easy to assign, track, and review tasks in a team.

---

## 🚀 Key Features

### 🔐 Role-Based Access
- **Admin:**
  - Assign, edit, and delete tasks for users
  - Review submitted tasks (accept/reject with feedback)
  - Dashboard with team and task analytics
  - Reset password and manage profile

- **User:**
  - See personal tasks and their status
  - Start tasks, mark as In Progress, and submit for review
  - View admin feedback (accepted/rejected tasks)
  - Track task history and personal performance
  - Manage own profile and password

---

## 🔁 Task Workflow

1. **Admin assigns task** → User sees it on dashboard
2. **User starts task** → Status changes to "In Progress"
3. **User submits for review** → Admin accepts or rejects with feedback
4. **Rejected tasks** → User can rework and resubmit

---

## 🧩 Tech Stack

| Layer             | Technology Used                                   |
|-------------------|---------------------------------------------------|
| Frontend          | React, Bootstrap, MDB React UI Kit, Chart.js      |
| Backend           | Node.js, Express.js                               |
| Database          | MongoDB                                           |
| Authentication    | JWT (JSON Web Tokens)                             |
| State Management  | React Context API                                 |
| Reports/Exports   | Chart.js, jsPDF, XLSX                             |
| UI Components     | Material Design Bootstrap (MDB), Font Awesome     |

---

## 🏗️ How to Run

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/task-management-system.git
   cd task-management-system
   ```

2. **Backend setup**
   ```bash
   cd Backend
   npm install
   # Add your .env file (MongoDB URI, JWT secret, etc.)
   npm start
   ```

3. **Frontend setup**
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```

4. **Open the app**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

---

## 🎉 Why Use This?

- Clean, modern design
- Easy for admins to manage tasks and feedback
- Simple for users to track progress and get feedback
- Secure role-based access

---

Feel free to fork and adapt for your team!
