const bitcoinMessage = require('bitcoinjs-message');

class Mempool {
    
    constructor() {
        this.TimeoutRequestsWindowTime = 5*60*1000;
        
        this.mempool = [];
        this.timeoutRequests = [];
        
        this.mempoolValid = [];
        this.timeoutRequestsValid = [];
    }

    async addARequestValidation(walletAddress) {
        let self = this;
        let element = this.searchAdressByWallet(walletAddress.walletAddress);
        let address = walletAddress.walletAddress;

        if(!element) {
            self.mempool.push(walletAddress);
            self.timeoutRequests[address] = setTimeout(function(){ self.removeValidationRequest(address) }, this.TimeoutRequestsWindowTime );
            return walletAddress;
        }


        let timeElapse = (new Date().getTime().toString().slice(0,-3)) - element.requestTimeStamp;
        let timeLeft = (this.TimeoutRequestsWindowTime/1000) - timeElapse;
        element.validationWindow = timeLeft;

        return element;
    }

    removeValidationRequest(address) {
    	this.mempool = this.mempool.filter(mem => mem.walletAddress != address);
		delete this.timeoutRequests[address];
    }

    removeValidRequest(address) {
    	this.mempoolValid = this.mempoolValid.filter(mem => mem.status.address != address);
		delete this.timeoutRequestsValid[address];
    }

    searchAdressByWallet(address) {
        return this.mempool.find(mem => mem.walletAddress = address);
    }
    
    async validateRequestByWallet(address, signature) {
        let self = this;
        let memAddress = this.searchAdressByWallet(address);

        if (!memAddress) return;

        let valid = bitcoinMessage.verify(memAddress.message, address, signature);
        let validRequest = {
            "registerStar": true,
            "status": {
                "address": memAddress.walletAddress,
                "requestTimeStamp": memAddress.requestTimeStamp,
                "message": memAddress.message,
                "validationWindow": memAddress.validationWindow,
                "messageSignature": valid
            }
        }
        
        if (valid) {
            let timeElapse = (new Date().getTime().toString().slice(0,-3)) - validRequest.status.requestTimeStamp;
            let timeLeft = (this.TimeoutRequestsWindowTime/1000) - timeElapse;
            validRequest.status.validationWindow = timeLeft;
            self.mempoolValid.push(validRequest);
            self.timeoutRequestsValid[validRequest.status.address] = setTimeout(function(){
                 self.removeValidRequest(validRequest.status.address) }, this.TimeoutRequestsWindowTime );
        }

        return validRequest;
    }
}

module.exports = Mempool;