import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // logged-in user info
  const [token, setToken] = useState(null); // JWT token
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user data is in localStorage
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", jwtToken);
    if (userData?._id) {
      localStorage.setItem("userId", userData._id);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
  };

  const updateUser = (updatedFields = {}) => {
    setUser((prev) => {
      const newUser = { ...(prev || {}), ...updatedFields };
      localStorage.setItem("user", JSON.stringify(newUser));
      if (newUser?._id) {
        localStorage.setItem("userId", newUser._id);
      }
      return newUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
