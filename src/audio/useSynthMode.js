import { useCallback } from "react";
import useAudioContext from "./AudioContext";
import useSynthCallbackRegistry from "./useSynthCallbackRegistry";

export default function useSynthMode(){
    const {synth} = useAudioContext()
    const registerListener = useSynthCallbackRegistry(synth);


    const setSynthMode = useCallback((modeName) => {
        const modes = synth.getAvailableSynthModes();
        if(!modes.includes(modeName)) return;
        synth.setSynthMode(modeName); 
    }, [synth])

    const getModesList = useCallback(() => {
        return synth.getAvailableSynthModes();
    }, [synth])

    return {setSynthMode, getModesList, registerListener}
}