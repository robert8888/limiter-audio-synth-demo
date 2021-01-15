export default function range(...args){
    let from, to;
    if(!args.length) return [];

    if(args.length === 1){
        from = 0
        to = parseInt(args[0])
    } else {
        from = parseInt(args[0]);
        to = parseInt(args[1]) + 1;
    }

    return new Array(to - from) 
         .fill(0).map((_, i) => from + i)
}