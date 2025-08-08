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
        // Pega a pasta do header, se não tiver usa 'uploads'
        const folder = req.headers['folder'] || 'uploads';
        const uploadPath = path.join('uploads', folder);

        console.log('Upload path:', uploadPath);
        // Cria a pasta se não existir
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
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

    console.log('File uploaded:', req.file);

    const folder = req.headers['folder'] || 'uploads';
    res.json({
        message: 'File uploaded successfully',
        filename: req.file.filename,
        folder: folder,
        path: req.file.path
    });
});
app.get('/file/:name', (req, res) => {
    // Pega a pasta do header, se não tiver usa 'uploads'
    const folder = req.headers['folder'] || 'uploads';
    const filePath = path.join('uploads', folder, req.params.name);

    // Verifica se o arquivo existe
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
    }

    const options = {
        root: path.join(__dirname)
    };

    res.sendFile(filePath, options, function (err) {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).json({ error: 'Error sending file' });
        } else {
            console.log('Sent:', filePath);
        }
    });
});

app.delete('/delete/:name', (req, res) => {
    // Pega a pasta do header, se não tiver usa 'uploads'
    const folder = req.headers['folder'] || 'uploads';
    const pathToDelete = path.join(__dirname, 'uploads', folder, req.params.name);

    console.log('Tentando deletar:', pathToDelete);

    // Verifica se o arquivo existe antes de tentar deletar
    if (!fs.existsSync(pathToDelete)) {
        return res.status(404).json({ success: false, error: 'File not found' });
    }

    fs.unlink(pathToDelete, (err) => {
        if (err) {
            console.error('Erro ao deletar arquivo:', err);
            res.status(500).json({ success: false, error: 'Error deleting file' });
        } else {
            console.log('Arquivo deletado com sucesso:', pathToDelete);
            res.json({ success: true, message: 'File deleted successfully' });
        }
    });
});

// Endpoint para listar arquivos de uma pasta
app.get('/files', (req, res) => {
    const folder = req.headers['folder'] || 'uploads';
    const folderPath = path.join(__dirname, 'uploads', folder);

    // Cria a pasta se não existir
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        return res.json({ files: [], folder: folder });
    }

    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error('Erro ao listar arquivos:', err);
            return res.status(500).json({ error: 'Error listing files' });
        }

        // Filtra apenas arquivos (não diretórios)
        const fileList = files.filter(file => {
            const filePath = path.join(folderPath, file);
            return fs.statSync(filePath).isFile();
        });

        res.json({
            files: fileList,
            folder: folder,
            count: fileList.length
        });
    });
});