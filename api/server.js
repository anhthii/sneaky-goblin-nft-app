const express = require('express');

const app = express();

const port = process.env.PORT || 9000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/hello', (req, res) => {
    res.send(`Hello!`);
});

app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
