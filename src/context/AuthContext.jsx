import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

const DEFAULT_USERS = [
  {
    id: "usr-001",
    name: "Alex Rivera",
    email: "admin@grandazure.com",
    password: "password123",
    role: "General Manager",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "usr-002",
    name: "Emma Watson",
    email: "frontdesk@grandazure.com",
    password: "password123",
    role: "Front Desk Lead",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const activeUser = localStorage.getItem('grand_azure_active_user');
      return activeUser ? JSON.parse(activeUser) : null;
    } catch {
      return null;
    }
  });

  const loading = false;

  // Initialize default users in localStorage if empty
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem('grand_azure_users');
      if (!storedUsers) {
        localStorage.setItem('grand_azure_users', JSON.stringify(DEFAULT_USERS));
      }
    } catch (err) {
      console.error('Error saving default users:', err);
    }
  }, []);

  const login = async (email, password, rememberMe = false) => {
    try {
      const storedUsersStr = localStorage.getItem('grand_azure_users');
      const users = storedUsersStr ? JSON.parse(storedUsersStr) : DEFAULT_USERS;

      const matchedUser = users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
      );

      if (matchedUser) {
        // Save session
        const sessionUser = {
          id: matchedUser.id,
          name: matchedUser.name,
          email: matchedUser.email,
          role: matchedUser.role || 'Staff Member',
          avatar: matchedUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
        };

        setUser(sessionUser);
        localStorage.setItem('grand_azure_active_user', JSON.stringify(sessionUser));

        if (rememberMe) {
          localStorage.setItem('grand_azure_remembered_email', email.trim());
        } else {
          localStorage.removeItem('grand_azure_remembered_email');
        }

        toast.success(`Welcome back, ${sessionUser.name}!`);
        return { success: true, user: sessionUser };
      } else {
        toast.error('Invalid email or password. Please check your credentials.');
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (err) {
      toast.error('An unexpected error occurred during login.');
      return { success: false, error: err.message };
    }
  };

  const register = async (userData) => {
    try {
      const storedUsersStr = localStorage.getItem('grand_azure_users');
      const users = storedUsersStr ? JSON.parse(storedUsersStr) : DEFAULT_USERS;

      const emailExists = users.some(
        (u) => u.email.toLowerCase() === userData.email.trim().toLowerCase()
      );

      if (emailExists) {
        toast.error('An account with this email already exists.');
        return { success: false, error: 'Email already registered' };
      }

      const newUser = {
        id: `usr-${Date.now()}`,
        name: userData.name.trim(),
        email: userData.email.trim().toLowerCase(),
        password: userData.password,
        role: userData.role || 'Staff Member',
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`
      };

      const updatedUsers = [...users, newUser];
      localStorage.setItem('grand_azure_users', JSON.stringify(updatedUsers));

      // Auto sign-in new user
      const sessionUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar
      };

      setUser(sessionUser);
      localStorage.setItem('grand_azure_active_user', JSON.stringify(sessionUser));

      toast.success('Registration successful! Welcome to The Grand Azure.');
      return { success: true, user: sessionUser };
    } catch (err) {
      toast.error('Registration failed. Please try again.');
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('grand_azure_active_user');
    toast.info('You have been securely signed out.');
  };

  const resetPassword = (email, newPassword) => {
    try {
      const storedUsersStr = localStorage.getItem('grand_azure_users');
      const users = storedUsersStr ? JSON.parse(storedUsersStr) : DEFAULT_USERS;

      const index = users.findIndex(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (index === -1) {
        toast.error('No account found with this email address.');
        return { success: false, error: 'User not found' };
      }

      users[index].password = newPassword;
      localStorage.setItem('grand_azure_users', JSON.stringify(users));
      toast.success('Password updated successfully! You can now log in.');
      return { success: true };
    } catch (err) {
      toast.error('Failed to reset password.');
      return { success: false, error: err.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
