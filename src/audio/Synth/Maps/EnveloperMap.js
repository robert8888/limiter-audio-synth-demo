import Enveloper from "./../Enveloper";

export default class EnveloperMap extends Map{
    static composeKey({type, id} = {}){
        return `${type.toString()}-${id.toString()}`
    }

    static decomposeKey(key){
        const [type, id] = key.split("-");
        return {type, id};
    }

    constructor(iterable){
        if(iterable)
            iterable = iterable.map(([key, value]) => {
                this._validateEntry(key, value)
                return [EnveloperMap.composeKey(key), value]
            })
        super(iterable);
    }

    _validateEntry(key, value){
        if(!(value instanceof Enveloper))
            throw new Error("Envelope map can contain only instance of Envelope")
        if(typeof key !== "object"){
            throw new Error("Envelops Map key have to be object with type and id props")
        }
        const {type, id} = key;
        if(!type || id === undefined){
            throw new Error("Envelops Map key have to be object with type and id props")
        }
    }

    set(key, value){
        this._validateEntry(key, value)
        super.set(EnveloperMap.composeKey(key), value);
    }

    get(key){
        return super.get(EnveloperMap.composeKey(key));
    }
}