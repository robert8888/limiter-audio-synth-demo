export default function debounce(callback, time){
    let timeout;
    return function(...args){
        const that = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => callback.apply(that, args), time)
    }
}