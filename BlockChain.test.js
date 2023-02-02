const BlockChain = require('./BlockChain');
const Block = require('./Block');
const cryptoHash = require('./crypto-hash');

describe('BlockChain', () => {
  let blockChain;
  let newChain;
  let originalChain;

  beforeEach(() => {
    blockChain = new BlockChain();
    newChain = new BlockChain();
    originalChain = blockChain.chain;
  });

  it('contains a chain Array instance', () => {
    expect(blockChain.chain instanceof Array).toBe(true);
  });

  it('starts with the genesis block', () => {
    expect(blockChain.chain[0]).toEqual(Block.genesis());
  });

  it('adds a new block to the chain', () => {
    const newData = 'test test';
    blockChain.addBlock({
      data: newData
    });

    expect(blockChain.chain[blockChain.chain.length-1].data).toEqual(newData);
  });
  
  describe('isValidChain()', () => {
    beforeEach(() => {
      blockChain.addBlock({ data: 'block1' });
      blockChain.addBlock({ data: 'block2' });
      blockChain.addBlock({ data: 'block3' });
    });

    describe('when  the chain does not start with the genesis block', () => {
      it('returns false', () => {
        blockChain.chain[0] = {
          data: 'invalid genesis'
        }
  
        expect(BlockChain.isValidChain(blockChain.chain)).toBe(false);
      })
    });
  
    describe('when the chain starts with the genesis block and has multiple blocks', () => {
      describe('and a lashHash reference has changed', () => {
        it('returns false', () => {
          blockChain.chain[2].lastHash = 'broken-lastHash';

          expect(BlockChain.isValidChain(blockChain.chain)).toBe(false);
        });
      });
  
      describe('and chain contains a block with an invalid field', () => {
        it('returns false', () => {
          blockChain.chain[2].data = 'bad data';

          expect(BlockChain.isValidChain(blockChain.chain)).toBe(false);
        });
      });
  
      describe('and the chain does not contain any invalid blocks', () => {
        it('returns true', () => {

          expect(BlockChain.isValidChain(blockChain.chain)).toBe(true);
        });
      });

      describe('and the chain contains a block with a jumped difficulty when adding', () => {
        it('returns false', () => {
          
          const lastBlock = blockChain.chain[blockChain.chain.length-1];
          const lastHash = lastBlock.hash;
          const timestamp = Date.now();
          const nonce = 0;
          const data = [];
          const difficulty = lastBlock.difficulty + 5;

          const hash = cryptoHash(timestamp, lastHash, difficulty, nonce, data);
          const badBlock = new Block({
            timestamp, lastHash, hash, nonce, difficulty, data
          });

          blockChain.chain.push(badBlock);
          expect(BlockChain.isValidChain(blockChain.chain)).toBe(false);
        });
      });
    });
  });

  describe('replaceChain()', () => {
    describe('when the new chain is not longer', () => {
      it('does not replace the chain', () => {
        blockChain.replaceChain(newChain);

        expect(blockChain.chain).toEqual(originalChain);
      });
    });

    describe('when the new chain is longer', () => {
      beforeEach(() => {
        newChain.addBlock({ data: "one more block" });
      });
  
      describe('and the chain is invalid', () => {
        it('does not replace the chain', () => {
          newChain.chain[newChain.chain.length-1].data = "test test test";
          blockChain.replaceChain(newChain);
          expect(blockChain.chain).toEqual(originalChain);
        });
      });

      describe('and the chain is valid', () => {
        it('replaces the chain', () => {
          blockChain.replaceChain(newChain);
          expect(blockChain.chain).toEqual(newChain.chain);
        });
      });
    });
  });
});
