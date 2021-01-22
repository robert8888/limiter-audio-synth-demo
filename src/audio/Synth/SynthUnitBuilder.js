import Enveloper from "./Enveloper";
import AudioNodeMap from "./Maps/AudioNodeMap";
import EnveloperMap from "./Maps/EnveloperMap";
import GainNodeMap from "./Maps/GainNodeMap";
import OscillatorNodeMap from "./Maps/OscillatorNodeMap";
import SynthUnit from "./SynthUnit";
import SynthUnitRewire from "./SynthUnitRewire";
import "./../WaveShapers/PulsShaper";

export default class SynthUnitBuilder {
    constructor(context,{ mode }){
        this.context = context;
        this._once = mode === "once"
    }

    set rewirderConstructor(rewirder){
        this._rewirderConstructor = rewirder;
    }

    _createOscillatorChannel(){
        const nodes =  {
            oscillator: this.context.createOscillator(),
            shaper: this.context.createPulseShaper(),
            reduction: this.context.createGain(),
            delay: this.context.createDelay(),
            volume: this.context.createGain(),
            envelope: this.context.createGain(),
            output: this.context.createGain(),
        }
        nodes.oscillator.type = "sine";
        nodes.envelope.gain.value = 0;
        nodes.reduction.gain.value = .5;
        nodes.oscillator.start(0)
        return nodes;
    }

    _createFilterChannel(){
        const nodes  = {
            input: this.context.createGain(),
            filter: this.context.createBiquadFilter(),
            output: this.context.createGain(),
        }
        nodes.filter.type = "lowpass";
        nodes.filter.frequency.setValueAtTime(20_000, this.context.currentTime)
        return nodes; 
    }

    _createMainChannel(){
        const nodes = {
            input: this.context.createGain(),
            scaler: this.context.createGain(),
            output: this.context.createGain(),
        }
        return nodes;
    }

    create(synthState, numberOfOscillators = 2, numberOfFilters = 1){
        const SynthRewirder = this._rewirderConstructor || SynthUnitRewire;

        const rewirder = new SynthRewirder();

        const oscillatorChannels = [];
        const filterChannels = [];

        for(let id = 0; id < numberOfOscillators; id++){
            oscillatorChannels[id] = this._createOscillatorChannel(id);
            rewirder.wireOscChannel(id, oscillatorChannels[id]);
        }

        for(let id = 0; id < numberOfFilters; id++){
            filterChannels[id] = this._createFilterChannel(id);
            rewirder.wireFilterChannel(id, filterChannels[id]);
        }

        const main = this._createMainChannel();
        rewirder.wireMainChanel(main)

        rewirder.buildConnection(synthState.mode);

        const unit = new SynthUnit(this.context, synthState, this._once);
        unit.rewirder = rewirder;

        const envelopersMap = new EnveloperMap();
        const oscillatorMap = new OscillatorNodeMap();
        const pulseShaperMap = new AudioNodeMap();
        const delaysMap = new AudioNodeMap();
        const volumeNodeMap = new GainNodeMap();
        const filterNodeMap = new AudioNodeMap();

        oscillatorChannels.forEach((oscillatorChannel, id) => {
            oscillatorMap.set(id, oscillatorChannel.oscillator);
            volumeNodeMap.set(id, oscillatorChannel.volume);
            delaysMap.set(id, oscillatorChannel.delay);
            pulseShaperMap.set(id, oscillatorChannel.shaper);

            const enveloper = new Enveloper(this.context, oscillatorChannel.envelope, "gain");
            envelopersMap.set({type: "oscillator", id}, enveloper)
        })

        filterChannels.forEach((filterChannel, id) => {
            const enveloper = new Enveloper(this.context, filterChannel.filter, "frequency");
            envelopersMap.set({type: "filter", id}, enveloper);
            filterNodeMap.set(id, filterChannel.filter);
        })
        
        unit.envelopers = envelopersMap;
        unit.oscillatorsDelay = delaysMap
        unit.oscillators = oscillatorMap;
        unit.oscillatorsPulseShaper = pulseShaperMap;
        unit.volume = volumeNodeMap;
        unit.filters = filterNodeMap;
        
        unit.scaler = main.scaler;
        unit.output = main.output;

        return unit;
    }

}
