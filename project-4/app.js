//Importing Express.js module
const express = require("express");
//Importing BodyParser.js module
const bodyParser = require("body-parser");
//Importing Blockchain module
const Blockchain = require("./Blockchain");
//Importing Blockchain module
const Mempool = require("./Mempool");

/**
 * Class Definition for the REST API
 */
class BlockAPI {

    /**
     * Constructor that allows initialize the class 
     */
    constructor() {
		this.blockchain = this.initBlockchain();
		this.mempool = this.initMempool();
		this.app = express();
		this.initExpress();
		this.initExpressMiddleWare();
		this.initControllers();
		this.start();
	}

    /**
     * Initilization of the Express framework
     */
	initExpress() {
		this.app.set("port", 8000);
	}

    /**
     * Initialization of the middleware modules
     */
	initExpressMiddleWare() {
		this.app.use(bodyParser.urlencoded({extended:true}));
		this.app.use(bodyParser.json());
	}

    /**
     * Initilization of all the controllers
     */
	initControllers() {
		require("./BlockController")(this.app, this.blockchain, this.mempool);
		require("./MempoolController")(this.app, this.mempool);
	}

	/**
	 * Initialization of the Blockchain
	 */
	initBlockchain() {
		return new Blockchain();
	}

	/**
	 * Initialization of the Mempool
	 */
	initMempool() {
		return new Mempool();
	}

	
    /**
     * Starting the REST Api application
     */
	start() {
		let self = this;
		this.app.listen(this.app.get("port"), () => {
			console.log(`Server Listening for port: ${self.app.get("port")}`);
		});
	}

}

new BlockAPI();