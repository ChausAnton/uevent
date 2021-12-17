import express from 'express';
import routes from '../routes';
import morgan from 'morgan';
import helmet from 'helmet';
const fileUpload = require("express-fileupload")
const cors = require("cors")
const { checkUser } = require('../middleware/authMiddleware.js')
const path = require("path")

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json({extended: true}))
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true, limit: '50mb'}));
app.use(fileUpload({
    createParentPath: true
}))

//static files
app.use(express.static('public'));
app.use('/css', express.static('public/css', {root: '.'}))
app.use('/js', express.static('public/js', {root: '.'}))
app.use('/img', express.static('public/img', {root: '.'}))

app.set('veiws', {root: '.'})
app.set('view engine', 'ejs')

app.use('*', checkUser)
app.use('/image', routes.image)
app.use('/user', routes.user);
app.use('/auth', routes.auth);
app.use('/event', routes.event);
app.use('/comment', routes.comment);
app.use('/category', routes.category);
app.use('/like', routes.like);

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "..", "client", "build")))

    app.get('/*', (req, res) => {
        res.sendFile(path.resolve(__dirname, "..", "client", "build", "index.html"))
    })
}


app.use((req, res) => {
    res.status(404).send('404 page not found');
});

// const host = '0.0.0.0';
// const port = process.env.PORT || 80;

app.listen(8080, function() {
    console.log("Server started.......");
  });