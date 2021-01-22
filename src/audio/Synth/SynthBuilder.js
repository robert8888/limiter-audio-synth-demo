import Synth from "./Synth";
import range from "utils/range";
import Envelope from "./Envelope";
import SynthModeBuilder from "./SynthModeBuilder";
import SynthUnitBuilder from "./SynthUnitBuilder";

export default class SynthBuilder{
    constructor(context, unitBuilderOptions = {}){
        this.context = context;
        this.unitBuilderOptions = unitBuilderOptions;
        const UnitBuilder = unitBuilderOptions.unitBuilderConstructor || SynthUnitBuilder
        this.unitBuilder = new UnitBuilder(this.context, unitBuilderOptions);
    }

    createSynth(){
        const state = {
            oscillator: {
                "0": {
                    waveType: "SAW",
                    envelope: new Envelope(),
                    transpose: 0,
                    detune: 0,
                    shift: 0,
                    vol: 1
                }, 
                "1": {
                    waveType: "SAW",
                    envelope: new Envelope(),
                    transpose: 0,
                    detune: 0,
                    shift: 0,
                    vol: 1
                }, 
            },
            filter: {
                "0": {
                    envelope: new Envelope(),
                    envelopeFreqTarget: 0,
                    frequency: 20_000,
                    gain: 0,
                    Q: 0,
                    type: "lowpass"
                }
            },
            mode: SynthModeBuilder.getSynthConfiguration("Sum"),
        }
        const output = this.context.createGain();

        const synth = new Synth(output, state);

        if(this.unitBuilderOptions.mode === "once"){
            synth.unitFactory = this._createUnit.bind(this, state, output);
        } else {
            const numberOfUnits = this.unitBuilderOptions.numberOfUnits || 12;
            const units = this._unitFactory(numberOfUnits, state, output);
            synth.units = units;
        }

        return synth;
    }

    _unitFactory(numberOfUnits, state, output){
        return range(numberOfUnits).map(() => {
            return this._createUnit(state, output)
        })
    }

    _createUnit(state, output){
        const unit = this.unitBuilder.create(state);
        unit.connect(output);
        return unit;
    }

    
}

  