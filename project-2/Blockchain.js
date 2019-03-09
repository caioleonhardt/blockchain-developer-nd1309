/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/
const SHA256 = require('crypto-js/sha256');

/* ===== LevelSandbox ===============================
|  CLass with database operations
|  =================================================*/
const LevelSandbox = require('./levelSandbox');

/* ===== Block ======================================
|  CLass with block model
|  =================================================*/
const Block = require('./Block');
const db = new LevelSandbox();

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain {
	constructor() {
		this.getBlockHeight().then(height => {

			// if height is less then zero, then we need create genesis block
			if (height == -1) {
				this.addBlock(new Block("First block in the chain - Genesis block"))
					.then(block =>{
						console.log("genesis block added: ", block)
					});
			}
		});
	}

	// Add new block
	async addBlock(newBlock) {
		let currentHeight = await this.getBlockHeight()
		// Block height
		newBlock.height = currentHeight + 1;

		// UTC timestamp
		newBlock.time = new Date().getTime().toString().slice(0, -3);
		// previous block hash
		if (currentHeight >= 0) {
			const prevBlock = await this.getBlock(currentHeight);
			newBlock.previousBlockHash = prevBlock.hash;
		}
		// Block hash with SHA256 using newBlock and converting to a string
		newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
		// Adding block object to chain
		const block = await db.addLevelDBData(
			newBlock.height,
			JSON.stringify(newBlock));

		return block;
	}

	// Get block height
	async getBlockHeight() {
		return await db.getBlockHeight();
	}

	// get block
	async getBlock(blockHeight) {
		return JSON.parse(await db.getLevelDBData(blockHeight));
	}

	// validate block
	async validateBlock(blockHeight) {
		// get block object
		let block = await this.getBlock(blockHeight);
		// get block hash
		let blockHash = block.hash;
		// remove block hash to test block integrity
		block.hash = '';
		// generate block hash
		let validBlockHash = SHA256(JSON.stringify(block)).toString();
		// Compare
		if (blockHash === validBlockHash) {
			return true;
		} else {
			console.log('Block #' + blockHeight + ' invalid hash:\n' + blockHash + '<>' + validBlockHash);
			return false;
		}
	}

	// Validate blockchain
	async validateChain() {
		let errorLog = [];
		for (var i = 0; i < await this.getBlockHeight() - 1; i++) {
			// validate block
			if (!this.validateBlock(i)) errorLog.push(i);
			
			// compare blocks hash link
			let block = await this.getBlock(i);
			let blockHash = block.hash;

			let previousBlock = await this.getBlock(i + 1);
			let previousHash = previousBlock.previousBlockHash;
			
			if (blockHash !== previousHash) {
				errorLog.push(i);
			}
		}
		if (errorLog.length > 0) {
			console.log('Block errors = ' + errorLog.length);
			console.log('Blocks: ' + errorLog);
		} else {
			console.log('No errors detected');
		}
	}
}

module.exports = Blockchain