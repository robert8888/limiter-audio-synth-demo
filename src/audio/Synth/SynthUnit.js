import waves from "audio/waves";
import { getNoteFreq } from "utils/noteTools";
import toRange from "utils/toRange";
import AudioNodeMap from "./Maps/AudioNodeMap";
import EnveloperMap from "./Maps/EnveloperMap";
import GainNodeMap from "./Maps/GainNodeMap";
import OscillatorNodeMap from "./Maps/OscillatorNodeMap";
import SynthUnitRewire from "./SynthUnitRewire";

export default class SynthUnit{
    _busy = false;

    static _id = 0;

    constructor(audioContext, synthStateBus, once = true){
        this._once = once;
        if(!(audioContext instanceof AudioContext))
            throw new Error("Synth context t has to be instance of AudioContext");

        this.ctx = audioContext;
        this.configuration = {filter: {},oscillator: {}}
        Object.keys(synthStateBus.oscillator).forEach(id => 
            this.configuration.oscillator[id] = {...synthStateBus.oscillator[id]}
        )
        Object.keys(synthStateBus.filter).forEach(id => 
            this.configuration.filter[id] = {...synthStateBus.filter[id]}
        )
        this.mode = synthStateBus.mode.clone();
        this._synthStateBus  = synthStateBus;
        this._id = SynthUnit._id++;
    }

    set oscillators(oscillatorNode){
        if(!(oscillatorNode instanceof OscillatorNodeMap))
            throw new Error("Synth unit oscillators s has to be OscillatorNodeMap type")
        this._oscillators = oscillatorNode;
    }

    set oscillatorsDelay(delayNodeMap){
        if(!(delayNodeMap instanceof AudioNodeMap))
            throw new Error("Synth unit oscillators delays has to be AudioNode type")
        this._oscillatorsDelay = delayNodeMap
    }

    set oscillatorsPulseShaper(shaperMap){
        if(!(shaperMap instanceof AudioNodeMap))
            throw new Error("Synth unit oscillator shaper delays has to be AudioNode type")
        this.__oscillatorPulseShaper = shaperMap;
    }

    set volume(gainNodesMap){
        if(!(gainNodesMap instanceof GainNodeMap))
            throw new Error("Synth unit volumes has to be AudioNodeMap type")
        this._volumes = gainNodesMap;
    }

    set envelopers(envelopeMap){
        if(!(envelopeMap instanceof EnveloperMap))
            throw new Error("Synth unit envelopes has to be EnvelopeMap type")
        this._envelopers = envelopeMap;
    }
 
    set filters(audioNodesMap){
        if(!(audioNodesMap instanceof AudioNodeMap))
            throw new Error("Synth unit filters has to be AudioNodeMap type")
        this._filter = audioNodesMap;
    }

    set scaler(gainNode){
        if(!(gainNode instanceof AudioNode))
            throw new Error("Synth unit scaler has to be AudioNode type")
        this._scalers = gainNode;
    }

    set output(gainNode){
        if(!(gainNode instanceof AudioNode))
            throw new Error("Synth unit output has to be AudioNode type")
        this._output = gainNode;
    }

    set rewirder(synthUnitRewirder){
        if(!(synthUnitRewirder instanceof SynthUnitRewire))
            throw new Error("Synth unit  has to be AudioNode type")
        this._rewire = synthUnitRewirder;
    }

    set onEnd(callback){
        if(typeof callback !== "function")
            throw new Error("Synth unit onEnd has to be function");
        this._onEndCallback = callback;
    }

    get oscillatorIds(){
       return [...this._oscillators.keys()];
    }

    get filterIds(){
       return [...this._filter.keys()];
    }

    get isBusy(){
        return this._busy;
    }

    get id(){
        return this._id;
    }

    connect(audioNode){
        if(!(audioNode instanceof AudioNode))
            throw new Error("Synth unit can by only connected to audioNode")
        this._output.connect(audioNode)
    }

    _updateMode(){
        if(this._synthStateBus.mode.hash === this.mode.hash)
            return;

        this.mode = this._synthStateBus.mode.clone();
        this._rewire.reConnection(this.mode);
    }

    _updateOscillatorsConfiguration(note) {
        const localConf = this.configuration.oscillator
        const generalConf = this._synthStateBus.oscillator;
        for(let oscId in generalConf){
            const locOscConf = localConf[oscId]
            const genOscConf = generalConf[oscId];
            const osc = this._oscillators.get(+oscId)
            if(locOscConf.waveType !== genOscConf.waveType || this._once){
                const waveType = genOscConf.waveType;
                const waveData = waves[waveType];

                if(waveType === "pulse"){
                    osc.type = "sawtooth";
                    this.__oscillatorPulseShaper.get(+oscId).bypass = false;
                } else {
                    this.__oscillatorPulseShaper.get(+oscId).bypass = true;

                    if(waveData){
                        const wave = this.ctx.createPeriodicWave(waveData.real, waveData.imag)
                        osc.setPeriodicWave(wave)
                    } else {
                        osc.type = waveType;
                    }
                }


                locOscConf.waveType = waveType;
            }
            if(locOscConf.vol !== genOscConf.vol || this._once){
                this._volumes.get(+oscId).gain.setTargetAtTime(genOscConf.vol, this.ctx.currentTime, 0.001)
                locOscConf.vol = genOscConf.vol;
            }
            locOscConf.enveloper = genOscConf.envelope;
            locOscConf.detune =  genOscConf.detune;
            locOscConf.transpose = genOscConf.transpose;
            locOscConf.shift = genOscConf.shift;
            const freq = getNoteFreq(
                note, 
                genOscConf.detune, 
                this._synthStateBus.masterTune || 440, 
                locOscConf.transpose
            );
            if(locOscConf.waveType === "pulse"){
                this.__oscillatorPulseShaper.get(+oscId).width.setValueAtTime(genOscConf.shift * 2, this.ctx.currentTime)
            } else {
                const delayTime = 1 / freq + (1 / freq * locOscConf.shift);
                this._oscillatorsDelay.get(+oscId).delayTime.setValueAtTime(delayTime, this.ctx.currentTime); 
            }


            osc.frequency.setValueAtTime(freq, this.ctx.currentTime)
        }
    }

    _updateFiltersConfiguration(){
        const local = this.configuration.filter
        const general = this._synthStateBus.filter;
        for(let filterId in general){
            const locFilterConf = local[filterId];
            const genFilterConf = general[filterId];
            const filterNode = this._filter.get(+filterId);
            if(locFilterConf.type !== genFilterConf.type || this._once){
                filterNode.type = genFilterConf.type;
                locFilterConf.type = genFilterConf.type;
            }
            ["frequency", "gain", "Q"].forEach(param => {
                if(locFilterConf[param] !== genFilterConf[param] || this._once){
                    filterNode[param].setValueAtTime(genFilterConf[param], this.ctx.currentTime)
                }
                locFilterConf[param] = genFilterConf[param]
            })
            locFilterConf.envelope = genFilterConf.envelope;
            locFilterConf.envelopeFreqTarget = genFilterConf.envelopeFreqTarget;
        }
    }
    
    _updateScale(force){
        this._scalers.gain.setTargetAtTime(force, this.ctx.currentTime, 0.001);
    }


    async _stopEnvelopers(){
        return Promise.all([...this._envelopers.values()].map(enveloper => enveloper.stop()))
    }

    start(note, force){
        this._busy = true;
        this._updateMode();
        this._updateOscillatorsConfiguration(note);
        this._updateFiltersConfiguration();
        this._updateScale(force);
        this._envelopers.forEach((enveloper, key) => {
            const {type, id} = EnveloperMap.decomposeKey(key);
            const config = this.configuration[type];
            const envelope = config[id].envelope;
            if(type === "filter"){
                enveloper.base = config[id].frequency;
                enveloper.target = toRange(config[id].frequency + config[id].envelopeFreqTarget, 0, 20_000);
            }
            enveloper.start(envelope);
        })
    }

    stop(){
        if(this._releasePhase) return;
        this._stopEnvelopers().then(() => this._end())
        this._releasePhase = true;
    }

    _end(){
        if(this._onEndCallback)
            this._onEndCallback(this._id);

        this._busy = false;
        this._releasePhase = false;
        if(this._once){
            this._destroy();
        }
    }

    _destroy(){
        this._output.disconnect();
        this._rewire.disconnectAll();
    }

}