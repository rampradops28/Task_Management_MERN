# ✅ Task Management System (RBAC-Based)

This is a **Role-Based Task Management System** developed during my 3-month internship. The system provides separate dashboards and functionalities for **Admin** and **User** roles, enabling effective task assignment, tracking, and management within an organization.

## 🚀 Features

### 🔐 Role-Based Access (RBAC)
- **Admin**:
  - Full access to all tasks
  - Assign tasks to users
  - Edit/delete assigned tasks
  - View overall dashboard analytics
  - Reset password from profile page
  - Manage user accounts
  - Generate task reports
  - View task statistics

- **User**:
  - View personal tasks
  - Task dashboard with status and deadlines
  - Task history (completed and pending)
  - Access to tasks assigned by admin
  - Update task status
  - View personal performance metrics
  - Profile management

## 🧩 Tech Stack

| Layer          | Technology Used                                    |
|----------------|--------------------------------------------------|
| Frontend       | React, Bootstrap, MDB React UI Kit, Chart.js      |
| Backend        | Node.js, Express.js, RESTful API                  |
| Database       | MongoDB                                           |
| Authentication | JWT (JSON Web Tokens)                             |
| State Management| React Context API                                |
| Charts & Reports| Chart.js, jsPDF                           |
| UI Components  | Material Design Bootstrap (MDB)                   |
| Icons          | Font Awesome, Lucide React                        |

## 📚 Functionality Overview

### 👤 Admin Panel
- **Dashboard**:
  - Overview of all user tasks with status
  - Task completion statistics
  - User performance metrics
  - Interactive charts and graphs
  
- **Manage Tasks**:
  - `Assign Task`: Create and assign tasks to specific users
  - `Assigned Tasks`: View/edit/delete created tasks
  - Task priority management
  - Deadline tracking
  
- **User Management**:
  - View all users
  - User activity monitoring
  - Account management
  
- **Profile Page**:
  - Change password securely
  - Update admin information

### 👥 User Panel
- **Task Dashboard**:
  - View all assigned tasks with deadlines and statuses
  - Task priority indicators
  - Progress tracking
  
- **Task History**:
  - View history of completed and pending tasks
  - Filter tasks by status/date
  - Task completion statistics
  
- **Profile Management**:
  - Update personal information
  - Change password
  - View performance metrics

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/task-management-system.git
   cd task-management-system
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   
   # Configure environment variables
   # Create .env file with:
   # PORT=5000
   # MONGODB_URI=mongodb://localhost:27017/taskManagementDB
   # JWT_SECRET=your_jwt_secret_key
   
   # Start the server
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd Frontend
   npm install
   
   # Start the development server
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000
 

## 🔒 Security Features

- JWT-based authentication
- Password hashing using bcrypt
- Protected API routes
- Role-based access control
- Secure password reset mechanism

## 📊 Data Export Features

- Export task reports to Excel
- Generate PDF reports
- Chart and graph downloads
- Task history exports

## 🎨 UI/UX Features

- Responsive design for all devices
- Modern and clean interface
- Interactive charts and graphs
- Intuitive navigation
- Loading states and animations 

## 🔧 Additional Tools Used

- **Development**:
  - Vite (Frontend build tool)
  - Nodemon (Backend development)
  - ESLint (Code linting)
  
- **Libraries**:
  - Axios (HTTP client)
  - Chart.js (Data visualization)
  - XLSX (Excel export)
  - jsPDF (PDF generation)
  - html2canvas (Screenshot capture)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
 