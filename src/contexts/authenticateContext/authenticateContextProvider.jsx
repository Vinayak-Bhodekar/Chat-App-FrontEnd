import { useEffect, useState } from "react";

import axios from "axios";
import authenticateContext from "./authenticateContext";

const AuthenticateContextProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true)


    useEffect(() => {

        const checkAuth = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/Users/loggedUser`,{withCredentials:true});
            if(res.data.data.refreshToken) {
            
            setIsAuthenticated(true)
            
            } else {
            setIsAuthenticated(false)
            }

        } catch {
            setIsAuthenticated(false)
        } finally {
            setLoading(false)
        }
        }
        checkAuth()
    }, [])
  
  return (
    <authenticateContext.Provider value={{isAuthenticated, setIsAuthenticated, loading }}>
      {children}
    </authenticateContext.Provider>
  );
};

export default AuthenticateContextProvider;
