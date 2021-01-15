import {  useEffect } from "react";
import useAudioContext from "./AudioContext";
import useMidi from "./midi/useMidi";


export default function useSynthInput(){
    const {synth} = useAudioContext()
    const {noteOn, noteOff} = useMidi();

   useEffect(() =>{
        noteOn.callback = synth.noteOn.bind(synth);
        noteOff.callback = synth.noteOff.bind(synth);

        return () => {
            noteOn.callback = () => {};
            noteOff.callback = () => {};
        }
   }, [])


    return {
        noteOn: synth.noteOn.bind(synth), 
        noteOff: synth.noteOff.bind(synth)
    }
}