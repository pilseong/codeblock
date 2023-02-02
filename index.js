const express = require('express');
const BlockChain = require('./BlockChain');

const app = express();
const blockChain = new BlockChain();

app.use(express.json());

app.get('/api/blocks', (req, res) => {
  res.send(blockChain);
});

app.post('/api/mine', (req, res) => {
  console.log(req.body);
  blockChain.addBlock({
    data: req.body.data
  });

  res.redirect('/api/blocks');
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
