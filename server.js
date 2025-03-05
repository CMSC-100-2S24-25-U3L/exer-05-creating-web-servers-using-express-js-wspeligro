import express from 'express';
import fs from 'fs';

const app = express();
const textFile = 'books.txt';

/* parser */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* add book post */
app.post('/add-book', (req, res) => {
    const { bookName, isbn, author, yearPublished } = req.body;

    if (!bookName || !isbn || !author || !yearPublished){
        return res.json({ success: false });
    }

    /* checks if book already exist */
    if (fs.existsSync(textFile)){
        const book = fs.readFileSync(textFile, "utf8");
        if (book.some(line => line.includes(isbn))){
            return req.json({ success: false });
        }
    }

    /* add a new book */
    const newBook = `${bookName},${isbn},${author},${yearPublished}`;
    fs.appendFileSync(textFile, newBook);
    res.json({ success: true });
});

app.get('/find-by-isbn-author', (req, res) => {
    const { isbn, author } = req.query;

    if (!isbn || !author){
        return res.json({ success: false });
    }

    if (fs.existsSync(textFile)){
        const book = fs.readFileSync(textFile, "utf8");
        const found = book.find(line => {
            const part = line.split(",");
            return part[1] === isbn && part[2] === author;
        });

        return res.json({ success: !!found, book: found || null });
    }

    res.json({ success: false });
});

app.get('/find-by-author', (req, res) => {
    const { author } = req.query;

    if (!author){
        return res.json({ success: false });
    }

    if (fs.existsSync(textFile)){
        const book = fs.readFileSync(textfile, "utf8");
        const found = book.find(line => {
            const part = line.split(",");
            return part[1] === author;
        });
        
        return res.json({ success: !!found, book: found || null});
    }

    res.json({ success: false });
});

app.listen(3000, () => {console.log('Server started at port 3000')});
