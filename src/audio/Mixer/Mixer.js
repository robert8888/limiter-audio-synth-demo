import AudioNodeMap from "audio/Synth/Maps/AudioNodeMap";
import { getLevelMeter } from "utils/getLevelMeter";

export default class Mixer{
    chain = [];
    _analysers;

    constructor(context){
        this.context = context;
        const node = this.context.createGain();
        node.connect(context.destination);
        this.chain.push({name: "destination", input: node, output: node})
        this._node = node;
    }

    set analyserNodes(analyserMap){
        if(!(analyserMap instanceof AudioNodeMap))
            throw new Error("Analyser nodes have to be instanceof AudioNodeMap")
        
        this._analysers = analyserMap;
        this._analysersBuffers = {};
        analyserMap.forEach((analyser, id) => {
            this._analysersBuffers[id] = new Float32Array(analyser.fftSize)
        })
    }

    set volumeNode(gainNode){
        if(!(gainNode instanceof GainNode))
            throw new Error("volueme node have to be i instanceof GainNode")
        this._volume = gainNode;
    }

    setVolume(value){
        if(!this._volume)
            throw new Error("Volume gain node not provided");
        this._volume.gain.setTargetAtTime(value, this.context.currentTime, .01)
    }

    getMeterIds(){
        return Array.from(this._analysers.keys())
    }

    getMeterLevel(id){
        const analyserNode = this._analysers.get(id);

        if(!analyserNode) return {avg: 0, peak: 0}

        const sampleBuffer = this._analysersBuffers[id]
        analyserNode.getFloatTimeDomainData(sampleBuffer)

        if(!sampleBuffer) return {avg: 0, peak: 0}

        return getLevelMeter(sampleBuffer);
    }

    getByteTimeDomainData(id, width){
        const analyserNode = this._analysers.get(id);
        const data = new Uint8Array(width);
        analyserNode.getByteTimeDomainData(data);
        return data;
    }

    getFFTSize(id){
        return this._analysers.get(id)?.fftSize;
    }
}
