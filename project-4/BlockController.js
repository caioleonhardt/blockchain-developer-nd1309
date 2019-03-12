const SHA256 = require('crypto-js/sha256');
const Block = require('./Block');
const Blockchain = require('./Blockchain');
const Mempool = require('./Mempool');

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} app 
     * @param {Blockchain} blockchain
     * @param {Mempool} mempool
     */
    constructor(app, blockchain, mempool) {
        this.app = app;
        this.blockchain = blockchain;
        this.mempool = mempool;

        this.getBlockByIndex();
        this.postNewBlock();
        this.getStarBlockByHash();
        this.getStarBlockByAddress();
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
     * Implement a GET Endpoint to retrieve a block by hash, url: "/stars/hash:[HASH]"
     */
    getStarBlockByHash() {
        let self = this;
        self.app.get("/stars/hash:HASH", (req, res) => {
            self.blockchain.getBlockByHash(req.params.HASH.slice(1)).then((result) => {
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
     * Implement a GET Endpoint to retrieve a block by wallet address, url: "/stars/address:[ADDRESS]"
     */
    getStarBlockByAddress() {
        let self = this;
        self.app.get("/stars/address:ADDRESS", (req, res) => {
            self.blockchain.getBlockByWalletAddress(req.params.ADDRESS.slice(1)).then((result) => {
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
            let address = req.body.address;

            if (!address || address.trim().length == 0) {
                res.status(400).send({ 'error': "Invalid adress" });
                return;
            }

            let validAddress = self.mempool.searchValidAdressByWallet(address);
            if (!validAddress || !validAddress.status.messageSignature) {
                res.status(400).send({ 'error': "Invalid message signature" });
                return;
            }

            let RA = req.body.star.ra;
            let DEC = req.body.star.dec;
            let MAG = req.body.star.mag;
            let CEN = req.body.star.cen;

            if (!RA || !DEC) {
                res.status(400).send({ 'error': "Required RA and DEC" });
                return;
            }

            let body = {
                address: req.body.address,
                star: {
                      ra: RA,
                      dec: DEC,
                      mag: MAG,
                      cen: CEN,
                      story: Buffer.from(req.body.star.story, "ascii").toString('hex')
                      }
        };
            let newBlock = new Block(body);

            self.blockchain.addBlock(newBlock).then((result) => {
                let block = JSON.parse(result);
                
                res.status(201).send(block);
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
module.exports = (app, blockchain, mempool) => { return new BlockController(app, blockchain, mempool); }