import { useEffect, useState } from "react";
import profileContext from "./profileContext";
import axios from "axios";

const ProfileContextProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const storedProfile = localStorage.getItem("getProfile");

    if (storedProfile && storedProfile !== "undefined") {
      try {
        setProfile(JSON.parse(storedProfile));
      } catch (err) {
        console.error("Invalid localStorage profile");
        localStorage.removeItem("getProfile");
      }
    }

    setLoading(false);
  }, []);

  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.post(
          "http://localhost:9000/api/Users/getUserInfo",
          { withCredentials: true }
        );
        setProfile(res.data.data);
        localStorage.setItem("getProfile", JSON.stringify(res.data.data));
      } catch (err) {
        console.log("User not logged in");
      }
    };

    fetchProfile();
  }, []);

  return (
    <profileContext.Provider value={{ profile, setProfile, loading }}>
      {children}
    </profileContext.Provider>
  );
};

export default ProfileContextProvider;
