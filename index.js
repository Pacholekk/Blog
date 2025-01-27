import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import {dirname} from "path"
import { fileURLToPath } from "url";
import path from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));


const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    const dataDir = path.join(__dirname, 'data');
    const topicsPath = path.join(dataDir, 'topics.json');

    fs.readFile(topicsPath, (err, data) => {
        let topics = data ? JSON.parse(data.toString()) : [];

        
        const validTopics = topics.filter(topic => {
            return fs.existsSync(path.join(dataDir, topic.filename));
        });

        res.render("index.ejs", { topics: validTopics });
    });
    });

app.get("/Bio", (req,res) =>{
    res.render("bio.ejs");
});
app.get("/Post", (req,res) =>{
    res.render("post.ejs");
});
app.post("/Post", (req, res) => {
    const { topic, content } = req.body;
    const filename = topic.trim().replace(/\s+/g, '_').toLowerCase() + '.txt';
    const safeFilename = filename.replace(/[^a-z0-9_\-\.]/gi, '').substring(0, 255);
    const dataDir = path.join(__dirname, 'data');
    const filePath = path.join(dataDir, safeFilename);

    const data = `Topic: ${topic}\nContent: ${content}\n`;
    fs.writeFile(filePath, data, (err) => {
        if (err) {
            console.error('Failed to save data:', err);
            return res.status(500).send("Error saving data.");
        }

        
        const topicsPath = path.join(dataDir, 'topics.json');
        fs.readFile(topicsPath, (err, data) => {
            let topics = data ? JSON.parse(data.toString()) : [];
            topics.push({ topic, filename: safeFilename });
            fs.writeFile(topicsPath, JSON.stringify(topics, null, 2), (err) => {
                if (err) {
                    console.error('Failed to save topics list:', err);
                    return res.status(500).send("Error updating topics list.");
                }
                res.redirect("/");
            });
        });
    });
});

app.get("/topic/:filename", (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, 'data', filename);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Failed to read file:', err);
            return res.status(404).send("Topic not found.");
        }

        if (data.trim() === '') {
            console.log(`Deleting empty file: ${filePath}`);
            
            fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error('Failed to delete empty file:', unlinkErr);
                    return res.status(500).send("Error deleting empty file.");
                }
                
                console.log('Empty file deleted successfully.');
                return res.redirect('/'); 
            });
    
            return; 
        }
        
        const parts = data.split('\n');
        const topic = parts[0].replace('Topic: ', '');
        const content = parts[1].replace('Content: ', '');

        res.render("topics.ejs", { topic, content,filename });
    });
});

app.post('/update/:filename', (req, res) => {
    const { topic, content } = req.body;
    const safeFilename = req.params.filename.replace(/[^a-z0-9\-_\.]/gi, '');
    const filePath = path.join(__dirname, 'data', safeFilename);
    const data = `Topic: ${topic}\nContent: ${content}`;

    fs.writeFile(filePath, data, 'utf8', (err) => {
        if (err) {
            console.error('Failed to update file:', err);
            return res.status(500).send("Error updating the post.");
        }
        res.redirect(`/topic/${safeFilename}`);
    });
});

app.get('/edit/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'data', req.params.filename);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Failed to load post for editing:', err);
            return res.status(500).send("Failed to load the post for editing.");
        }

        
        const parts = data.split('\n');
        const topic = parts[0].replace('Topic: ', '');
        const content = parts[1].replace('Content: ', '');

        res.render('edit.ejs', { filename: req.params.filename, topic, content });
    });
});



app.post('/delete/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'data', filename);

    fs.unlink(filePath, err => {
        if (err) {
            console.error('Failed to delete the file:', err);
            return res.status(500).json({ success: false, message: "Failed to delete the post." });
            res.redirect("/");
            
        }

         
        res.redirect("/");
    });
});



app.listen(port, () =>{
    console.log(`Serwer running on port ${port}`);
});