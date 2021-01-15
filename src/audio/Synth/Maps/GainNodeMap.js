import AudioNodeMap from "./AudioNodeMap";

export default class GainNodeMap extends AudioNodeMap{
    constructor(iterable){
        if(iterable && iterable.some(([key, value] )=> !(value instanceof GainNode)))
            throw new Error("Gain Node Map can contain only instance of GainNode");
        super(iterable);
    }

    set(key, value){
        if(!(value instanceof GainNode))
            throw new Error("Gain Node Map can contain only instance of GainNode")
        super.set(key, value);
    }
}