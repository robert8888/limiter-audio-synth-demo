import { useCallback, useRef } from "react";

export default function useSynthCallbackRegistry(synth){
    const listenerRegistry = useRef({})

    const registerListener = useCallback((eventName, id,  callback) => {
        id = id ?? "default";
        listenerRegistry.current[`${eventName}-${id}`] = callback;
        synth.on(eventName,(id, ...args) => {
            listenerRegistry.current[`${eventName}-${id}`]?.(...args);
            listenerRegistry.current[`${eventName}-${"default"}`]?.(id, ...args)
        })
    }, [listenerRegistry, synth])

    return registerListener;
}