import React, { useEffect, useState } from "react";

import themeContext from "./themeContext";

const ThemeContextProvider = ({children}) => {
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("darkMode") === "true"
    )

    useEffect(() => {
        localStorage.setItem("darkMode",darkMode)
    },[darkMode])

    return (
        <themeContext.Provider value={{darkMode, setDarkMode}}> 
            {children}
        </themeContext.Provider>
    )
}

export default ThemeContextProvider;