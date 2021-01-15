export default class AudioNodeMap extends Map{
    constructor(iterable){
        if(iterable && iterable.some(([key, value] )=> !(value instanceof AudioNode)))
            throw new Error("Audio node map can contain only instance of AudioNode");
        super(iterable);
    }

    set(key, value){
        if(!(value instanceof AudioNode))
            throw new Error("Audio node map can contain only instance of AudioNode")
        super.set(key, value);
    }
}