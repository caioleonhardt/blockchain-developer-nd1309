class MempoolController {

    /**
     * Constructor to create a new MempoolController, you need to initialize here all your endpoints
     * @param {*} app 
     * @param {*} mempool 
     */
    constructor(app, mempool) {
        this.app = app;
        this.mempool = mempool;

        this.requestValidation();
    }

    requestValidation() {
        let self = this;
        self.app.post("/requestValidation", (req, res) => {
            if (!req.body.address) {
                res.status(400).send({ 'error': 'Required address parameter' });
                return;
            }

            let address = req.body.address;
            let currentTime = new Date().getTime().toString().slice(0, -3);

            let requestAddress = {
                "walletAddress": address,
                "requestTimeStamp": currentTime,
                "message": `${address}:${currentTime}:starRegistry`,
                "validationWindow": self.mempool.TimeoutRequestsWindowTime / 1000
            };

            self.mempool.addARequestValidation(requestAddress).then((result) => {
                if (!result) {
                    res.status(500).send({ 'error': 'Unexpected error occurred' });
                    return;
                }

                res.status(201).send(result);
            }).catch((err) => {
                console.error(err)
                res.status(500).send({ 'error': 'Unexpected error occurred' });
            });
        });
    }

    removeValidationRequest(walletAddress) {
        console.log('removing', walletAddress);
    }
}

module.exports = (app, mempool) => { return new MempoolController(app, mempool) };