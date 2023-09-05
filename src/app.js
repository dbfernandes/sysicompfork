import express from 'express';
import exphbs from 'express-handlebars';
import session from 'express-session';
import router from './routes';
import dotenv from 'dotenv';
import * as uuid from 'uuid';
import cors from 'cors';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import morgan from 'morgan';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';


dotenv.config();
const app = express()

app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    partialsDir: `${__dirname}/views/partials/`,
    helpers: require(`${__dirname}/views/helpers/helpers.js`)
}))

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, '/views'));

app.use(cookieParser());

app.use(session({
    genid: (req) => {
        return uuid.v4() // usamos UUIDs para gerar os SESSID
    },
    secret: "eb9ac99d8a53fbfae6cae8e7a48c5b45",
    resave: true,
    saveUninitialized: true,
}));

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
//app.use(morgan('combined'))
app.use(csrf({ cookie: true }));

app.use(
    '/script-adminlte',
    express.static(path.join(__dirname, '/../node_modules/admin-lte/'))
);

app.use(
    '/public',
    express.static(path.join(__dirname, '/public/'))
);

app.use('/', router)

export default app