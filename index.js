const http = require('http');
const express = require('express');
const es6Renderer = require('express-es6-template-engine');

const app = express();
const server = http.createServer(app);

const port = 3000;
const host = 'localhost';

const morgan = require('morgan');
const logger = morgan('tiny');
const helmet = require('helmet');

const db = [];

app.use(helmet());
app.use(logger);

app.engine('html', es6Renderer);
app.set('views', 'templates');
app.set('view engine', 'html');

// Parse any form data from POST requests
app.use(express.urlencoded({ extended: true }));

const layout = {
	partials: {
		header: '/partials/header',
		footer: '/partials/footer',
	},
};

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
		...layout,
		locals: {
			message: 'Favorite Books📚🤗',
		},
	});
});

app.get('/items', (req, res) => {
	const bookLinks = books
		.map((b) => `<li><a href="/items/${b.Title}">${b.Title}</a></li>`)
		.join('');
	res.render('items', {
		...layout,
		locals: {
			bookLinks,
			engagement: 'What are some of your favorite books?',
		},
	});
});

app.get('/items/:bookInfo', (req, res) => {
	const title = req.params.bookInfo;
	const author = books.find((a) => title === a.Title);

	res.render('details', {
		...layout,
		locals: {
			author: author.Author,
			published: author.Published,
			title: author.Title,
		},
	});
	// res.json(author); // checking objs
});

app.get('/create', (req, res) => {
	res.render('create', {
		...layout,
		locals: {
			form: `
	<h1>We'd love to hear from you!</h1>
	<form method="post">
		<label>
			What are some of your favorite books?
			<p><input name="favorite" type="text" autofocus /></p>
		</label>
		<input type="submit" value="Submit" />
		</form>
	`,
		},
	});
});

app.post('/create', (req, res) => {
	const { favorite } = req.body;
	db.push(favorite);
	res.redirect('/thankyou');
	res.render('/create', {
		...layout,
	});
});

app.get('/list', (req, res) => {
	res.send(`
	<a href="/create">Back to the Form</a>
	<ul>
	${db.map((favorite) => `<li>${favorite}</li>`).join('')}
	</ul>	
	`);
});

app.get('/thankyou', (req, res) => {
	res.render('thankyou', {
		...layout,
		locals: {
			thanks: `Thank you for your input🤗 Happy reading!📚`,
		},
	});
});

server.listen(port, host, () => {
	console.log(`Running on http://${host}:${port}`);
});

// function module
// create partials/replce in HTML
// style templates + link 'static'
