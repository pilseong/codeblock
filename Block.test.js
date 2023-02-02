const Block = require('./Block');
const { GENESIS_DATA, MINE_RATE } = require('./config');
const cryptoHash = require('./crypto-hash');

describe('Block', () => {
  let timestamp = Date.now();
  let lastHash = 'lastHash';
  let data = ['blockchain'];
  let hash = 'hash';
  let nonce = 1;
  const difficulty = 1;

  let block = new Block({
    timestamp,
    lastHash,
    data,
    hash,
    nonce,
    difficulty
  });

  it('has timestamp, lastHahs, data, hash, nonce and difficulty properties', () => {
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.data).toEqual(data);
    expect(block.hash).toEqual(hash);
    expect(block.nonce).toEqual(nonce);
    expect(block.difficulty).toEqual(difficulty);
  });

  describe('genesis()', () => {
    let genesisBlock = Block.genesis();
  
    it('returns a Block instance', () => {
      expect(genesisBlock instanceof Block).toBe(true);
    });
  
    it('returns the genesis data', () => {
      expect(genesisBlock).toEqual(GENESIS_DATA);
    });
  });
  
  describe('mineBlock', () => {
    let lastBlock = Block.genesis();
    let data = 'mined data';
    let minedBlock = Block.mineBlock({ lastBlock, data });
  
    it('returns a block instance', () => {
      expect(minedBlock instanceof Block).toBe(true);
    });
  
    it('sets the lastHash to be the hash of the lastBlock', () => {
      expect(minedBlock.lastHash).toEqual(lastBlock.hash);
    });
  
    it('sets the data', () => {
      expect(minedBlock.data).toEqual(data);
    });
  
    it('sets a timestamp', () => {
      expect(minedBlock.timestamp).not.toBe(undefined);
    });
  
    it('creates a SHA256 hash based on the proper inputs', () => {
      expect(minedBlock.hash)
        .toEqual(cryptoHash(
          minedBlock.timestamp, 
          minedBlock.nonce, 
          lastBlock.difficulty, 
          lastBlock.hash, 
          data));
    });
  
    it('sets a hash that matches the difficulty criteria', () => {
      expect(minedBlock.hash.substring(0, minedBlock.difficulty))
        .toEqual('0'.repeat(minedBlock.difficulty));
    });

    it('adjusts the difficulty', () => {
      const possibleResults = [lastBlock.difficulty+1, lastBlock.difficulty-1];

      expect(possibleResults.includes(minedBlock.difficulty)).toBe(true);
    });
  
  });

  describe('adjustDifficulty()', () => {
    it('raises the difficulty for a quickly mined block', () => {
      expect(Block.adjustDifficulty({
        originalBlock: block,
        timestamp: block.timestamp + MINE_RATE - 100
      })).toEqual(block.difficulty+1);
    });
  
    it ('lowers the difficulty for a slowly mined block', () => {
      expect(Block.adjustDifficulty({
        originalBlock: block,
        timestamp: block.timestamp + MINE_RATE + 100
      })).toEqual(block.difficulty-1);
    });
  });

});
