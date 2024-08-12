const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();

// Ustawienie silnika szablonów EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Statyczne pliki CSS
app.use(express.static(path.join(__dirname, 'public')));
app.use('/container', express.static(path.join(__dirname, 'container')));

// Konfiguracja multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'container'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Strona główna
app.get('/', (req, res) => {
    res.render('index');
});

// Strona upload
app.get('/upload', (req, res) => {
    res.render('upload');
});

// Obsługa uploadu plików
app.post('/upload', upload.single('file'), (req, res) => {
    console.log(`załadowano plik:${req.file.originalname}`);
});

// Strona load
app.get('/load', (req, res) => {
    fs.readdir(path.join(__dirname, 'container'), (err, files) => {
        if (err) {
            return res.status(500).send('Błąd podczas pobierania plików');
        }
        res.render('load', { files: files });
    });
});

// Uruchomienie serwera
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});
