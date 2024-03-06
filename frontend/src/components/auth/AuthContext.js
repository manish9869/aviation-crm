import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    // Check if user data exists in local storage
    const storedUserData = localStorage.getItem("userData");

    console.log("storedUserData Auth Context", storedUserData);
    if (storedUserData) {
      // If user data exists, parse it and set the state
      setUserData(JSON.parse(storedUserData));
    }
  }, []);
  return (
    <AuthContext.Provider value={{ userData, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};
