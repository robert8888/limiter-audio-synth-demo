import { useCallback, useEffect, useRef } from "react";

export default function useSynthCallbackRegistry(eventNames, synth){
    const listenerRegistry = useRef({})

    const registerListener = useCallback((eventName, id,  callback) => {
        id = id ?? "default";
        listenerRegistry.current[`${eventName}-${id}`] = callback;
    }, [listenerRegistry])

    useEffect(() => {
        eventNames.forEach(eventName => {
            synth.on(eventName,(id, ...args) => {
                listenerRegistry.current[`${eventName}-${id}`]?.(...args);
                listenerRegistry.current[`${eventName}-${"default"}`]?.(id, ...args)
            })
        })

    }, [eventNames, listenerRegistry, synth])   

    return registerListener;
}