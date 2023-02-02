const { GENESIS_DATA, MINE_RATE } = require('./config');
const cryptoHash = require('./crypto-hash');
const hexToBinary = require('hex-to-binary');

class Block {
  constructor({ timestamp, lastHash, data, hash, nonce, difficulty }) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.data = data;
    this.hash = hash;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }

  // 제네시스 블록 생성
  static genesis() {
    return new this(GENESIS_DATA);
  }

  // 다음 블록을 생성하는 로직
  static mineBlock({ lastBlock, data }) {
    let hash, timestamp;
    const lastHash = lastBlock.hash;
    let difficulty = lastBlock.difficulty;
    let nonce = 0;
    
    //  difficulty에 적합한 hash를 찾는다.
    
    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty({
        originalBlock: lastBlock,
        timestamp
      });
      hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
    } while (hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty));

    // hash 값은 현재 시간, 이전블록의 해시값, 데이터를 가지고 계산한다.
    return new this({
      timestamp,
      lastHash,
      data,
      nonce,
      difficulty,
      hash
    });
  }

  // 목표한 인터벌을 맞추기 위해 difficult를 증감한다.
  // 이전 블록의 생성 시간과 주어진 timestamp를 비교한다.
  static adjustDifficulty({ originalBlock, timestamp }) {

    if (originalBlock.difficulty < 1) return 1;

    if (timestamp - originalBlock.timestamp > MINE_RATE) {
      return originalBlock.difficulty - 1;
    }

    return originalBlock.difficulty + 1;
  }
}

module.exports = Block;