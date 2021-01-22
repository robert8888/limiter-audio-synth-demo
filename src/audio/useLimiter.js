import { useCallback } from "react";
import useAudioContext from "./AudioContext"

export default function useLimiter(){
    const {limiter} = useAudioContext();

    const setLimiterParam = useCallback((param, value) =>{
        limiter.setParam(param, value)
    }, [limiter])

    return {
        setLimiterParam,
    }
}