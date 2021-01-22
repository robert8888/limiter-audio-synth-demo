export default function set(object, path, value){
    if(typeof object !== "object")
        throw new Error("set function expects to typeof of first parameter to be object")
    if(!Array.isArray(path))
        throw new Error("set function expects to get second parameter of type array")
    
    path.slice(0, -1).reduce((acc, current, index) =>
        current in acc 
            ? acc[current]
            : acc[current] = isNaN(+path[index + 1])
                ? {}
                : []
    , object)[path[path.length - 1]] = value;

    return object;
}


