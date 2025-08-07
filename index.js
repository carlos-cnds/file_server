const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const app = express();
const port = 3004;
const fs = require('fs');

// Configurações para uploads grandes
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

// Middleware para configurar timeouts
app.use((req, res, next) => {
    req.setTimeout(600000); // 10 minutos
    res.setTimeout(600000); // 10 minutos
    next();
});


// Multer Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        var splt = file.originalname.toString().split('.');
        return cb(null, uuidv4() + '.' + splt.slice(-1));
    },
});

const upload = multer({ 
    storage,
    limits: {
        fileSize: 500 * 1024 * 1024, // 500MB limit
        fieldSize: 500 * 1024 * 1024  // 500    MB field size limit
    }
});

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});

// File Upload Endpoint
app.post('/upload', (req, res, next) => {
    // Aumenta o timeout para 10 minutos
    req.setTimeout(600000); // 10 minutos
    res.setTimeout(600000); // 10 minutos
    next();
}, upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ message: 'File uploaded successfully', filename: req.file.filename });
});
app.get('/file/:name', (req, res) => {
    const options = {
        root: path.join(__dirname)
    };
    const fileName = '/uploads/' + req.params.name;
    res.sendFile(fileName, options, function (err) {
        if (err) {
            console.error('Error sending file:', err);
        } else {
            console.log('Sent:', fileName);
        }
    });
});

app.delete('/delete/:name', upload.single('file'), (req, res) => {
    var pathToDelete = path.join(__dirname + '/uploads/' + req.params.name)
    console.log(pathToDelete)
    fs.unlink(pathToDelete, (err) => {
        if (err) {
            res.json({ sucess: false });
        } else{
            res.json({ sucess: true })
        }
    });
    
});