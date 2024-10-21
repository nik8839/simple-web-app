const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello everyone Dockerized Web App!');
});

app.listen(3000, () => {
  console.log('App is running on port 3000');
});
