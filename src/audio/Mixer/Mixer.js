import AudioNodeMap from "audio/Synth/Maps/AudioNodeMap";
import { getLevelMeter } from "utils/getLevelMeter";

export default class Mixer{
    chain = [];
    _analysers;
    _intervalCallbacks = [];

    constructor(context){
        this.context = context;
        const node = this.context.createGain();
        node.connect(context.destination);
        this.chain.push({name: "destination", input: node, output: node})
        this._node = node;
        this._intervalHandler = setInterval(this._intervalTick.bind(this), 16)
    }

    _intervalTick(){
        this._intervalCallbacks.forEach((callback) => callback())
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

    _getMeterLevel(analyser, buffer, id){
        analyser.getFloatTimeDomainData(buffer)
        this._meters[id] = getLevelMeter(buffer);
    }

    _getByteTimeDomainData(analyserNode, id){
        analyserNode.getByteTimeDomainData( this._byteTime[id]);
    }

    _getByteFrequencyData(analyserNode, buffer){
        analyserNode.getByteFrequencyData(buffer);
    }

    getMeterLevel(id){
        if(!this._meters || !this._meters[id]){
            this._meters = {};
            const analyser = this._analysers.get(id);
            const buffer = this._analysersBuffers[id];
            this._intervalCallbacks.push(
                this._getMeterLevel.bind(this, analyser, buffer, id)
            )
        }

        return this._meters[id] || {peak: -100, avg: -100};
    }

    getByteTimeDomainData(id, size){
        if(!this._byteTime || !this._byteTime[id]){
            this._byteTime = {};
            this._byteTime[id] = new Uint8Array(size);
            const analyserNode = this._analysers.get(id);
            this._intervalCallbacks.push(
                this._getByteTimeDomainData.bind(this, analyserNode, id)
            )

        }

        return this._byteTime[id];
    }

    getByteFrequencyData(id){
        if(!this._byteFreq || !this._byteFreq[id]){
            this._byteFreq = {};
            const analyserNode = this._analysers.get(id);
            this._byteFreq[id] = new Uint8Array(analyserNode?.frequencyBinCount || 0);
            this._intervalCallbacks.push(
                this._getByteFrequencyData.bind(this, analyserNode, this._byteFreq[id])
            )
        }
 
        return this._byteFreq[id];
    }

    getFFTSize(id){
        return this._analysers.get(id)?.fftSize;
    }
}
