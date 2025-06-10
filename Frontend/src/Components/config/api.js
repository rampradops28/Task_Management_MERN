// Get the backend URL from environment variables with a fallback
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
    // User endpoints
    USER_SIGNUP: `${BACKEND_URL}/api/v1/users/signup`,
    USER_LOGIN: `${BACKEND_URL}/api/v1/users/login`,
    USER_UPDATE_PASSWORD: `${BACKEND_URL}/api/v1/users/updatePassword`,
    GET_USERS: `${BACKEND_URL}/api/v1/users`,
    
    // Task endpoints
    CREATE_TASK: (userId) => `${BACKEND_URL}/api/v1/task/create/${userId}`,
    GET_USER_TASKS: (userId) => `${BACKEND_URL}/api/v1/task/${userId}`,
    GET_ALL_TASKS: `${BACKEND_URL}/api/v1/task`,
    UPDATE_TASK: (taskId) => `${BACKEND_URL}/api/v1/task/${taskId}`,
    UPDATE_TASK_STATUS: (taskId) => `${BACKEND_URL}/api/v1/task/status/${taskId}`,
    UPDATE_USER_TASK_STATUS: (taskId) => `${BACKEND_URL}/api/v1/task/user-status/${taskId}`,
    DELETE_TASK: (taskId) => `${BACKEND_URL}/api/v1/task/delete/${taskId}`,
    GET_USER_SPECIFIC_TASKS: (userId) => `${BACKEND_URL}/api/v1/task/user/${userId}`,

    // Admin endpoints
    ADMIN_SIGNUP: `${BACKEND_URL}/api/v1/users/signup/admin`,
    ADMIN_UPDATE_PASSWORD: `${BACKEND_URL}/api/v1/admin/update-password`,
};

export default API_ENDPOINTS; 