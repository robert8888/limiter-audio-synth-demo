import MidiDataTranslator from "./MidiDataTranslator";
import MidiStatusTranslator from "./MidiStatusTranslator";
import MIDI_STATUS from "./MidiStatus";

export default class MidiTranslator{
    constructor() {
        this.statusTranslator = new MidiStatusTranslator();
        this.dataTranslator = new MidiDataTranslator()
    }
    translate(msg){
        let status = this.statusTranslator.translate(msg[0]);
        let data1 = this.dataTranslator.translateFirstByte(status.name, msg[1]);
        let data2 = this.dataTranslator.translateSecondByte(status.name, msg[2]);
        const translated =  {
            ...status,
            ...data1,
            ...data2,
            original : msg,
        }
        translated.id = this._buildId(translated);
        return translated;
    }

    _buildId(translated){
        let msg = translated;
        let id = ""
        id += "CH:" + msg.channel;
        switch (msg.name){
            case MIDI_STATUS.NOTE_ON : {
                id += "-N_ON:" + msg.note;
                break;
            }
            case MIDI_STATUS.NOTE_OFF : {
                id += "-N_OFF:" + msg.note;
                break;
            }
            case MIDI_STATUS.CONTROL_CHANGE : {
                id += "-CC:" + msg.controller;
                break;
            }
            case MIDI_STATUS.PITCH_WHEEL_RANGE : {
                id += "-PW";
                break;
            }
            default: return id;
        }

        return id;
    }
}