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

    // 제네시스 블록 검증
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }

    // 모든 블록이 적절한치 확인한다.
    for (let i=1; i<chain.length; i++) {
      
      // difficulty가 임의로 변경되는 경우를 방지
      // 임의 변경을 어용할 경우는 지정된 delay의 mining 시간을 줄 수가 없다.
      if (Math.abs(chain[i-1].difficulty - chain[i].difficulty) > 1) return false;

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