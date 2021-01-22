import connectInChain from "utils/connectInChainAudioNodes";
import Limiter from "./Limiter/Limiter";
import Mixer from "./Mixer/Mixer";
import AudioNodeMap from "./Synth/Maps/AudioNodeMap";
import SynthBuilder from "./Synth/SynthBuilder";

// const parallelSynth = {
//     numberOfUnits: 24,
//     mode: "parallel"
// }

const onceSynth = {
    mode: "once"
}


export default class AudioBuilder {
    constructor(context){
        this.context = context;
    }

    create(){
        const context = this.context;

        const synthBuilder = new SynthBuilder(context, onceSynth);
        const synth = synthBuilder.createSynth();
        const mixer = new Mixer(context);
        const limiter = new Limiter(context)

        const analyserMaster = new AnalyserNode(context);
        const analyserLimited = new AnalyserNode(context);
        analyserLimited.maxDecibels = 0;
        analyserMaster.fftSize = 256;
        analyserLimited.fftSize = 1024;

        const analysers = new AudioNodeMap();
        analysers.set("master", analyserMaster)
        analysers.set("limited", analyserLimited)
        
        const gain = new GainNode(context);

        mixer.volumeNode = gain;
        mixer.analyserNodes = analysers;
        
        connectInChain([
            synth.output,
            gain,
            analyserMaster,
            limiter.node,
            analyserLimited,
            context.destination
        ])

        return {
            context,
            synth,
            limiter,
            mixer,
        }
    }
}