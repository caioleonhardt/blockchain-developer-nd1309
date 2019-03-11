class Mempool {
    
    constructor() {
        this.mempool = [];
        this.timeoutRequests = [];
        this.TimeoutRequestsWindowTime = 5*60*1000;
    }

    async addARequestValidation(walletAddress) {
        let self = this;
        let element = this.mempool.find(mem => mem.walletAddress = walletAddress.walletAddress);
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
}

module.exports = Mempool;