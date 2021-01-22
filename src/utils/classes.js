export default function classes(names){
    return names.reduce((acc, current) => {
        if(!current) return acc;
        if(typeof current === "string"){
            return acc + " " + current;
        } else if(current instanceof Array){
            if(current.length === 1 || (current.length === 2 && !!current[1])){
                return acc + " " + current[0]
            } else if(current.length === 2){
                return acc;
            }
            else if(current.length === 3){
                return acc + " " + current[+!!current[2]]
            }
            return acc + " " + current.join(" ")
        } else if(typeof current === "object"){
            return acc + " " + Object.entries.reduce((acc, [key, value]) => {
                if(!value){
                    return acc + " " + key
                } 
                return acc;
            }, "")
        }
    }, "")
}