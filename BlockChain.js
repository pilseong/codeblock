const Block = require('./Block');
const cryptoHash = require('./crypto-hash');

class BlockChain {

  constructor() {
    this.chain = [Block.genesis()];
  }

  // 하나의 블록을 추가한다.
  addBlock({ data }) {
    const minedBlock = Block.mineBlock({
      lastBlock: this.chain[this.chain.length-1],
      data
    });

    this.chain.push(minedBlock);
  }

  // 블록을 교체한다.
  replaceChain(newblock) {
    if (this.chain.length >= newblock.chain.length) {
      console.log("new chain is shorter than the original block");
      return;
    }

    if (!BlockChain.isValidChain(newblock.chain)) {
      console.log("new chain is not valid");
      return;
    }
    
    this.chain = newblock.chain;
  }

  // 체인이 유효한지 검증한다.
  static isValidChain(chain) {

    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }

    for (let i=1; i<chain.length; i++) {
      const block = chain[i];

      const acturalLastHash = chain[i-1].hash;

      const { timestamp, lastHash, hash, data, nonce, difficulty } = block;

      if (lastHash !== acturalLastHash) return false;

      const validatedHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);

      if (hash !== validatedHash) return false;
    }

    return true;
  }
}

module.exports = BlockChain;