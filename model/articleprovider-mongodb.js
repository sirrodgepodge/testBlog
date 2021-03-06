var ArticleProvider = function(db) {
    this.db = db;
};

ArticleProvider.prototype.addCommentToArticle = function(articleId, comment, callback) {
    this.getCollection(function(error, article_collection){
	    console.log(articleId);
	    if(error) callback(error);
	    else {
	    article_collection.update(
              {_id: article_collection.db.bson_serializer.ObjectID.createFromHexString(articleId)},
              {"$push": {comments: comment}},
              function(error, article){
                if(error) callback(error);
                else callback(null, article);
	      });
	    }
	});
};

//getCollection
ArticleProvider.prototype.getCollection= function(callback) {
  this.db.collection('articles', function(error, article_collection) {
    if(error) callback(error);
    else callback(null, article_collection);
  });
};

//findAll
ArticleProvider.prototype.findAll = function(callback) {
    this.db.collection('articles').find().toArray(function(error, results) {
	    if(error) callback(error);
	    else callback(null, results);
	});
};

//findById
ArticleProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, article_collection) {
	    if( error ) callback(error);
	    else {
		article_collection.findOne({_id: article_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
			if( error ) callback(error);
			else callback(null, result);
		    });
	    }
	});
};

//save
ArticleProvider.prototype.save = function(articles, callback) {
    this.getCollection(function(error, article_collection) {
	    if(error) callback(error);
	    else {
		if(typeof(articles.length)=="undefined") articles = [articles];
		for( var i =0;i< articles.length;i++ ) {
		    article = articles[i];
		    article.created_at = new Date();
		    if( article.comments === undefined ) article.comments = [];
		    for(var j =0;j< article.comments.length; j++) {
			article.comments[j].created_at = new Date();
		    }
		}
		article_collection.insert(articles, function() {
			callback(null, articles);
		    });
	    }
	});
};

exports.ArticleProvider = ArticleProvider;
