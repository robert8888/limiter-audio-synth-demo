export default function connectInChain(nodes = []){
    nodes.reduce((prevNode, currentNode) => {
        prevNode.connect(currentNode);
        return currentNode;
    })
}