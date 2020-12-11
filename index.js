const http = require('http');
const express = require('express');
const es6Renderer = require('express-es6-template-engine');

const app = express();
const server = http.createServer(app);

const port = 3000;
const host = 'localhost';

const morgan = require('morgan');
const logger = morgan('tiny');
app.use(logger);

app.engine('html', es6Renderer);
app.set('views', 'templates');
app.set('view engine', 'html');

const books = [
	{
		Title: 'This Thing Called You',
		Author: 'Ernest Holmes',
		Published: 1948,
	},
	{
		Title: 'A New Earth',
		Author: 'Eckhart Tolle',
		Published: 2005,
	},
	{
		Title: '7 Spiritual Laws of Success',
		Author: 'Deepak Chopra',
		Published: 1994,
	},
	{
		Title: 'The Celestine Prophecy',
		Author: 'James Redfield',
		Published: 1993,
	},
	{
		Title: 'As A Man Thinketh',
		Author: 'James Allen',
		Published: 1903,
	},
];

app.get('/', (req, res) => {
	res.render('home', {
		locals: {
			message: 'Favorite Books📚🤗',
		},
	});
});

app.get('/items', (req, res) => {
	const bookLinks = books
		.map((b) => `<li><a href="/books/${b}">${b.Title}</a></li>`)
		.join('');

	res.render('items', {
		locals: {
			bookLinks,
		},
	});
});

app.get('/items/:bookDesc', (req, res) => {
	const title = req.params.bookDesc;
	res.render('details', {
		locals: {
			title,
		},
	});
});

server.listen(port, host, () => {
	console.log(`Running on http://${host}:${port}`);
});
