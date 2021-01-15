
export default class EventTarget{
    _eventCallbacks = {}

    on(name, callback){
        if(!this._eventCallbacks[name]){
            this._eventCallbacks[name] = [callback];
        } else {
            this._eventCallbacks[name].push(callback);
        }
    }

    off(name, callback){
        if(!this._eventCallbacks[name]) return;
        this._eventCallbacks = this._eventCallbacks.filter(c => c !== callback);
    }

    fire(name, ...args){
        const callbacks = this._eventCallbacks[name] || [];
        callbacks.forEach(callback => {
            callback.apply(null, args)
        });
    }
}