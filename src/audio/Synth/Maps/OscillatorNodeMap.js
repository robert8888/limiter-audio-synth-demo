import AudioNodeMap from "./AudioNodeMap";

export default class OscillatorNodeMap extends AudioNodeMap{
    constructor(iterable){
        if(iterable && iterable.some(([key, value] )=> !(value instanceof OscillatorNode)))
            throw new Error("Audio node map can contain only instance of OscillatorNode");
        super(iterable);
    }

    set(key, value){
        if(!(value instanceof OscillatorNode))
            throw new Error("Audio node map can contain only instance of OscillatorNode")
        super.set(key, value);
    }
}