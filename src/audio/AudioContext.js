import React, { useContext } from "react";
import AudioBuilder from "./AudioBuilder";

const RAudioContext = new React.createContext(null);

export default function useAudioContext() {return useContext(RAudioContext)};

export const AudioContextProvider = ({children}) => {
    const context = new AudioContext();
    const builder = new AudioBuilder(context);
    const state = builder.create();

    return (
        <RAudioContext.Provider value={state}>
            {children}
        </RAudioContext.Provider>
    )
}