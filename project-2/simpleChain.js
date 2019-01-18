const Block = require("./Block")
const Blockchain = require("./Blockchain")

let blockchain = new Blockchain()

blockchain.getBlockHeight().then(height => {
    for (let index = 1; index <= height ; index++) {
        blockchain.getBlock(index).then( block => {
            console.log(block)
        }).catch(err => {
            console.log(err)
        })
    }
})