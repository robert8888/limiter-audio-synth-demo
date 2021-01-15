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

    const getByteTimeDomainData = useCallback((width) => {
        return mixer.getByteTimeDomainData("limited", width);
    }, [])

    const getFFTSize = useCallback(() => {
        return mixer.getFFTSize("limited")
    }, [])

    return {
        getLevelMeter, 
        setVolume: mixer.setVolume.bind(mixer),
        getByteTimeDomainData,
        getFFTSize,
    }
}