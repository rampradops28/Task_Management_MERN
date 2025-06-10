import React, { createContext, useReducer, useEffect, useState } from 'react';

export const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = () => {
      const userToken = localStorage.getItem('userToken');
      const adminToken = localStorage.getItem('AdminToken');
      const userId = localStorage.getItem('userId');
      const userEmail = localStorage.getItem('userEmail');
      const userName = localStorage.getItem('userName');
      const userType = localStorage.getItem('userType');

      if ((userToken || adminToken) && (userId || userEmail)) {
        dispatch({
          type: 'LOGIN',
          payload: {
            id: userId,
            email: userEmail,
            username: userName,
            usertype: userType || (adminToken ? 'admin' : 'user'),
            role: adminToken ? 'admin' : 'user',
            token: userToken || adminToken
          }
        });
      } else {
        // If no valid auth, ensure we mark loading as complete
        dispatch({ type: 'LOGOUT' });
      }
    };

    checkAuth();
  }, []);

  // Logout function
  const logout = () => {
    // Clear all auth-related items from localStorage
    localStorage.removeItem('userToken');
    localStorage.removeItem('AdminToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userType');
    
    // Dispatch logout action
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ 
      ...state, 
      dispatch,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 