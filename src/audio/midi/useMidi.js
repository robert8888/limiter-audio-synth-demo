import { useCallback, useEffect, useState } from "react"
import MidiTranslator from "./MidiTranslator/MidiTranslator"

export default function useMidi(){
    const [noteOn] = useState({callback: () => {}})
    const [noteOff] = useState({callback: () => {}})
    const [midiTranslator] = useState(new MidiTranslator())


    const onInputMessage = useCallback((rawMessage) => {
        const message = midiTranslator.translate(rawMessage.data);
        if(message.name !== "Note on")
            return;

        if(message.velocity){
            console.log("note force)" ,127 / message.velocity)
            noteOn.callback(message.note, 127 / message.velocity);
            return;
        }
        noteOff.callback(message.note)
    }, [midiTranslator, noteOn, noteOff])

    useEffect(() => {
        let inputs = [];
        navigator.requestMIDIAccess().then((midiAccess) => {
            inputs = Array.from(midiAccess.inputs);
            console.log(inputs)
            inputs.forEach(([id, input]) => input.onmidimessage = onInputMessage)
        })

        return () => {
            inputs.forEach(([id, input]) => input.onmidimessage = null)
        }
    }, [])


    return {noteOn, noteOff} 
}