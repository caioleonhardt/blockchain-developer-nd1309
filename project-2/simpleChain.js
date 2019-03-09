const Block = require("./Block")
const Blockchain = require("./Blockchain")


let blockchain = new Blockchain();

/* ===== Testing ==============================================================|
|  - Self-invoking function to add blocks to chain                             |
|  - Learn more:                                                               |
|   https://scottiestech.info/2014/07/01/javascript-fun-looping-with-a-delay/  |
|                                                                              |
|  ===========================================================================*/

(function theLoop (i) {
  setTimeout(function () {
      let blockTest = new Block("Test Block - " + (i + 1));
      blockchain.addBlock(blockTest).then((result) => {
          console.log(result);
          i++;
          if (i < 10) theLoop(i);
      });
  }, 1000);
})(0);