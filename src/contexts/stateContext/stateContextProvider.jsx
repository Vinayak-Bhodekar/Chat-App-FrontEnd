import React, { useEffect, useState } from "react";

import stateContext from "./stateContext";

const StateContextProvider = ({children}) => {
    const [defaultState, setDefault] = useState(localStorage.getItem("defaultState") === "true")

    useEffect(() => {
        localStorage.setItem("defaultState",defaultState)
    },[defaultState])

    return (
        <stateContext.Provider value={{defaultState, setDefault}}> 
            {children}
        </stateContext.Provider>
    )
}

export default StateContextProvider;