import { useContext, useEffect, useState } from "react";
import profileContext from "./profileContext.js";
import axios from "axios";
import authenticateContext from "../authenticateContext/authenticateContext.js";

const ProfileContextProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const {isAuthenticated,setIsAuthenticate} = useContext(authenticateContext)

  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/Users/getUserInfo`,
          {},
          { withCredentials: true }
        );

        setProfile(res.data.data);
        localStorage.setItem("getProfile", JSON.stringify(res.data.data));

      } catch (err) {
        console.log(err)
        setProfile(null);
        localStorage.removeItem("getProfile");
      } finally {
        setLoading(false);
      }
    };
    
    if (isAuthenticated) {
      fetchProfile();
    } else {
      setProfile(null);
      localStorage.removeItem("getProfile");
      setLoading(false);
    }

  }, [isAuthenticated]);


  return (
    <profileContext.Provider value={{ profile, setProfile, loading }}>
      {children}
    </profileContext.Provider>
  );
};

export default ProfileContextProvider;
