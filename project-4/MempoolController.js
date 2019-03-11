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
        this.validate();
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

    validate() {
        let self = this;
        self.app.post("/message-signature/validate", (req, res) => {
            if (!req.body.address) {
                res.status(400).send({ 'error': 'Required address parameter' });
                return;
            }

            if (!req.body.signature) {
                res.status(400).send({ 'error': 'Required signature parameter' });
                return;
            }

            self.mempool.validateRequestByWallet(req.body.address, req.body.signature).then((result) => {
                if (!result) res.status(404).send("Address not found");

                res.send(result);
            }).catch((err) => {
                console.error(err);
                res.status(500).send({ 'error': 'Unexpected error occurred' });
            });

        });
    }
}

module.exports = (app, mempool) => { return new MempoolController(app, mempool) };