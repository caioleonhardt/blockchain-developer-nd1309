/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/
// Importing the module 'level'
const level = require('level');
// Declaring the folder path that store the data
const chainDB = './chaindata';
// Declaring a class
class LevelSandbox {
    // Declaring the class constructor
    constructor() {
        this.db = level(chainDB);
    }

    // Get data from levelDB with a key (Promise)
    getLevelDBData(key) {
        let self = this; // Because we are returning a promise, we will need this to be able to reference 'this' inside the Promise constructor
        return new Promise(function (resolve, reject) {
            self.db.get(key, (err, value) => {
				if (err) {
					reject(err);
					return;
				} 
				
				resolve(value);
            });
        });
    }

    // Add data to levelDB with key and value (Promise)
    addLevelDBData(key, value) {
        let self = this;
        return new Promise(function (resolve, reject) {
            self.db.put(key, value, function (err) {
                if (err) {
					reject(err);
					return;
                }
                resolve(value);
            });
        });
    }

    // Implement this method
    getBlockHeight() {
        let self = this;

        return new Promise(function (resolve, reject) {
            let count = 0
            self.db.createReadStream()
                .on('data', function (data) {
                    count++
                })
                .on('error', function (err) {
                    reject(err)
                })
                .on('close', function () {
                    resolve(count);
                });
        })
    }
}

// Export the class
module.exports = LevelSandbox;