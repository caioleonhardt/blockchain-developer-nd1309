const Block = require("./Block")
const Blockchain = require("./Blockchain")

let blockchain = new Blockchain()
let logBlock = (block) => console.log("added: ", block) 

blockchain.getBlockHeight().then(height => {
    blockchain.addBlock(new Block("Block " + (parseInt(height) + 1))).then(logBlock)
})