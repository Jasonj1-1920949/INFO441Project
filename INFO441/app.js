import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sessions from 'express-session'
import path from 'path';
import cors from 'cors'

import indexRouter from './routes/index.js';
import usersRouter from './routes/controllers/users.js';
import itinierariesRouter from './routes/controllers/itineraries.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import models from './models.js'

// Azure login
import msIdExpress from 'microsoft-identity-express'
// Azure authentication settings
const appSettings = {
	appCredentials: {
    	clientId:  "a15188e8-98b4-473e-8b56-e328e9d0617c",
    	tenantId:  "f6b6dd5b-f02f-441a-99a0-162ac5060bd2",
    	clientSecret:  "T9n8Q~jd7aRTTrb1.0sZbVPs6TEq9D5efTxr7bpC"
	},
	authRoutes: {
    	redirect: "https://cultured-seattle.herokuapp.com/redirect",
    	error: "/error", // the wrapper will redirect to this route in case of any error.
    	unauthorized: "/unauthorized" // the wrapper will redirect to this route in case of unauthorized access attempt.
	}
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const oneDay = 1000 * 60 * 60 * 24
app.use(sessions({
    secret: "developmentsecret",
    saveUninitialized: true,
    cookie: {maxAge: oneDay},
    resave: false
}));


const msid = new msIdExpress.WebAppAuthClientBuilder(appSettings).build();
app.use(msid.initialize());

app.use(function (req, res, next) {
	req.models = models;
	next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/itineraries', itinierariesRouter);

app.get('/newaccount', (req, res) => {
  res.sendFile('public/newaccount.html', { root: __dirname });
});

app.get('/quiz', (req, res) => {
  res.sendFile('public/quiz.html', { root: __dirname });
});

app.get('/signin',
	msid.signIn({postLoginRedirect: '/'})
);

app.get('/signout',
	msid.signOut({postLogoutRedirect: '/'})
);

app.get('/error', (req, res) => {
	res.send("Server authentication error")
});

app.get('/unauthorized', (req, res) => {
	res.send("Permission denied")
});

export default app;
