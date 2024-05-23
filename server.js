const express = require ('express');
const fs = require('fs');
const path = require('path');
// npm package to create unique ids
const { v4: uuid} = require('uuid');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());

app.use(express.static('public'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});


app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        }
        res.json(JSON.parse(data));
    });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => 
    console.log(`Listening for requests at http://localhost:${PORT} !`)
);

