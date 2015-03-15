// Module dependencies

var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    errorHandler = require('errorhandler'),
    compression = require('compression'),
    ArticleProvider = require('./model/articleprovider-mongodb').ArticleProvider,
    app = module.exports = express(),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

// Configuration
app.use(compression());
app.set('views', __dirname + '/views');
app.set('port', process.env.PORT || 8060);
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({extended:false}));//easy retrieval of HTML body                                
app.use(bodyParser.json());
app.use(methodOverride());
app.use(errorHandler());
app.use(require('stylus').middleware({ src: __dirname + '/public' }));
app.use(express.static(__dirname + '/public'));

// Connect to Mongo
MongoClient.connect('mongodb://bossy:bossy@ds047581.mongolab.com:47581/bawss?connectTimeoutMS=500000', {native_parser:true}, function(err, db){
        assert.equal(null, err);
	console.log("Successfully connected!");
        var articleProvider = new ArticleProvider(db);

	//Routes
	app.get('/', function(req, res){
		articleProvider.findAll(function(error,docs){
			res.render('index.jade', {
				    title: 'Blog',
				    articles: docs
			    });
		    });
	    });

	app.get('/blog/new', function(req, res) {
		res.render('blog_new.jade', {
			    title: 'New Post'
		    });
	    });

	app.post('/blog/new', function(req, res){
		articleProvider.save({
			    title: req.body.title,
			    body: req.body.body
			    },
		    function(error, docs) {
			res.redirect('/');
		    });
	    });

	app.get('/blog/:id', function(req, res) {
		articleProvider.findById(req.params.id, function(error, article) {
			res.render('blog_show.jade',{
				title: article.title,
				article: article
				});
		    });
	    });

	app.post('/blog/addComment', function(req, res) {
		articleProvider.addCommentToArticle(req.body._id, {
			author: req.body.author,
			comment: req.body.comment,
			created_at: new Date()
			},
		    function(error, docs) {
			res.redirect('/blog/' + req.body._id);
		    });
	    });

	app.listen(app.get('port'), function() {
		console.log("Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
	    });
    });