const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  const { domain } = req.query;
  res.location(`https://${domain}/k/`);
  res.statusCode = 303;
  res.end();
});

module.exports = router;
