export default function throttle(callback, timeout){
    const that = this;
    let lastCall = null;
    return (...args) => {
        if(!lastCall || performance.now() - lastCall > timeout ){
            lastCall = performance.now();
            callback.call(that, ...args);
        }
    }
}