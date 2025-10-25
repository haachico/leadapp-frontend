
import React, { createContext, useContext, useState, useEffect } from "react";


const getUserFromStorage = () => {
	try {
		const userStr = localStorage.getItem("authUser");
		return userStr ? JSON.parse(userStr) : null;
	} catch {
		return null;
	}
};

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
		const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("authToken"));
		const [user, setUser] = useState(getUserFromStorage());
		const [token, setToken] = useState(localStorage.getItem("authToken") || null);

		// Keep user in localStorage in sync
		useEffect(() => {
			if (user) {
				localStorage.setItem("authUser", JSON.stringify(user));
			} else {
				localStorage.removeItem("authUser");
			}
		}, [user]);

	// const login = (userData) => {
	// 	setIsAuthenticated(true);
	// 	setUser(userData);
	// };

	// const logout = () => {
	// 	setIsAuthenticated(false);
	// 	setUser(null);
	// };

	return (
		<AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, token, setToken }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
