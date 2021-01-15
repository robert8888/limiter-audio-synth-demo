
export const CONNECTIONS = {
    DIR: "direct",
    FM: "frequency",
    AMP: "amplitude"
}

export default class SynthMode{
    constructor(){
        this._rules = {};
        this._hash = "";
    }


    _composeKey({type, id}){
        return `${type}*${id}`
    }

    _decomposeKey(str){
        const [type, id] = str.split("*");
        return {type, id};
    }

    _validateConnection(value){
        if(!Object.values(CONNECTIONS).includes(value))
            throw Error("Not allowed synthesis mode")
        return true;
    }

    _updateHash(source, connection,  target){
        const ruleHash = `${this._composeKey(source)}-${connection}-${this._composeKey(target)}`
        const ruleHashes  = this._hash.split("_");
        const index = ruleHashes.findIndex(ruleHash => ruleHash.startsWith(this._composeKey(source)))
        if(index !== -1){
            ruleHashes.splice(index, 1, ruleHash);
        } else{
            ruleHashes.push(ruleHash)
        }
        this._hash = ruleHashes.sort().join("_");
    }

    _deleteHashPart(target){
        const ruleHashes  = this._hash.split("_");
        const index = ruleHashes.findIndex(ruleHash => ruleHashes.startsWith(this._composeKey(target)));
        if(index === -1) return;

        ruleHashes.splice(index, 1);
        this._hash = ruleHashes.sort().join("_");
    }

    setRule(source, connection,  target){
        this._validateConnection(connection);
        this._updateHash(...arguments);
 
        this._rules[this._composeKey(source)] = { source, connection, target }
    }

    getRule(target){
        return this._rules[this._composeKey(target)]
    }

    deleteRule(source){
        const key = this._composeKey(source)
        this._deleteHashPart(key);
        delete this.rules[key];
    }

    *rules(){
        for(let key in this._rules){
            yield this._rules[key];
        }
    }

    clone(){
        const clone = new SynthMode();
        clone._hash = this._hash;
        clone._rules = Object.assign({}, this._rules);
        return clone;
    }

    get hash(){
       return this._hash;
    }
}