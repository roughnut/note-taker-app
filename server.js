const { error } = require('console');
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

app.post('/api/notes', (req, res) => {
    // get any existing notes
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json('Error reading notes');
        }
        // parse any existing notes
        const notesArray = JSON.parse(data);
        // create a new note
        const newNote = {
            id: uuid(),
            ...req.body
        };
        // add new note to the notes object
        notesArray.push(newNote);
        
        // write the notes back to db.json
        fs.writeFile('./db/db.json', JSON.stringify(notesArray, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json('Error saving notes');
            }
            res.json(newNote);
        });
    });
});

app.delete('/api/notes/:id', (req, res) => {
    // get id for note to be deleted
    const deleteId = req.params.id;
    // read db.json
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json('Error reading notes');
        }
    // parse the data object
    let notesList = JSON.parse(data);
    // remove note from notesList
    notesList = notesList.filter(note => note.id !== deleteId);
    // write db.json without the deleted note
    fs.writeFile('./db/db.json', JSON.stringify(notesList, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).json(`Couldn't write file`);
      }
      res.send('success!');
    });     
    });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => 
    console.log(`Listening for requests at http://localhost:${PORT} !`)
);

