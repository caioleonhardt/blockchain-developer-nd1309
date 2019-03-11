const SHA256 = require('crypto-js/sha256');
const Block = require('./Block');

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} app 
     * @param {*} blockchain
     */
    constructor(app, blockchain) {
        this.app = app;
        this.blockchain = blockchain;
        this.getBlockByIndex();
        this.postNewBlock();

        // internal resources
        this.mempool = [];
        this.timeoutRequests = [];
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/block/:height"
     */
    getBlockByIndex() {
        let self = this;
        self.app.get("/block/:height", (req, res) => {
            self.blockchain.getBlock(req.params.height).then((result) => {
                res.send(result);
            }).catch((err) => {
                if (err.notFound) {
                    res.status(404).send({ 'error': 'Block not found' });
                    return;
                }

                console.error(err.stack);
                res.status(500).send({ 'error': 'Unexpected error occurred' });
            });
        });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/block"
     */
    postNewBlock() {
        let self = this;
        self.app.post("/block", (req, res) => {
            let body = req.body.body;

            if (!body || body.trim().length == 0) {
                res.status(400).send({ 'error': "Invalid body payload" });
                return;
            }

            let newBlock = new Block(body);

            self.blockchain.addBlock(newBlock).then((result) => {
                res.status(201).send(newBlock);
            }).catch((err) => {
                console.error(err.stack);
                res.status(500).send({ 'error': 'Unexpected error occurred' });
            });
        });
    }

    /**
     * Help method to inizialized Mock dataset, adds 10 test blocks to the blocks array
     */
    initializeMockData() {
        if (this.blocks.length === 0) {
            for (let index = 0; index < 10; index++) {
                let blockAux = new Block(`Test Data #${index}`);
                blockAux.height = index;
                blockAux.hash = SHA256(JSON.stringify(blockAux)).toString();
                this.blocks.push(blockAux);
            }
        }
    }

}

/**
 * Exporting the BlockController class
 * @param {*} app 
 * @param {*} blockchain
 */
module.exports = (app, blockchain) => { return new BlockController(app, blockchain); }