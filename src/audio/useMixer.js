import { useCallback } from "react";
import useAudioContext from "./AudioContext";

export default function useMixer(){
    const {mixer} = useAudioContext();


    const getLevelMeter = useCallback((id) => {
        const data = mixer.getMeterLevel(id)
        return {
            left: data.peak,
            right: data.peak,
        }
    }, [mixer])

    const getByteTimeDomainData = useCallback((width, buffer) => {
        return mixer.getByteTimeDomainData("limited", width, buffer);
    }, [mixer])

    const getByteFrequencyData = useCallback((id = "limited") => {
        return mixer.getByteFrequencyData(id);
    }, [mixer])

    const getFFTSize = useCallback((id = "limited") => {
        return mixer.getFFTSize(id)
    }, [mixer])

    return {
        getLevelMeter, 
        setVolume: mixer.setVolume.bind(mixer),
        getByteTimeDomainData,
        getByteFrequencyData,
        getFFTSize,
    }
}