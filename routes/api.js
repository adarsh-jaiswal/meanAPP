var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');



//Used for routes that must be authenticated.
function isAuthenticated (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects

    //allow all get request methods
    if(req.method === "GET"){
        return next();
    }
    if (req.isAuthenticated()){
        return next();
    }

    // if the user is not authenticated then redirect him to the login page
    return res.redirect('/#login');
};

//Register the authentication middleware
router.use('/posts', isAuthenticated);

//api for all posts
router.route('/posts')
	
	//creates a new post
	.post(function(req, res){
		if(!req.isAuthenticated()){
			return res.send(401, {message:'not authorized'});
		}
		var post = new Post();
		post.text = req.body.text;
		post.created_by = req.body.created_by;
		post.save(function(err, post) {
			if (err){
				return res.send(500, err);
			}
			return res.json(post);
		});
	})

	.get(function(req, res){

		//TODO get all the posts in the database
	
            Post.find(function(err, data){
               if(err){
                  return   res.send(500, err);
               } 

                return res.send(data); //help in angular to show cheeps

            });
    // res.send({message:"TODO get all the posts in the database"});
	});

//api for a specfic post
router.route('/posts/:id')
	
	//to update or modify existing post
	//updates specified post
    .put(function(req, res){
        Post.findById(req.params.id, function(err, post){
            if(err)
                res.send(err);

            post.username= req.body.username;
            post.text = req.body.text;

            post.save(function(err, post){
                if(err)
                    res.send(err);

                res.json(post);
            });
        });
    })
    
    //returns a particular post
	.get(function(req, res){
        Post.findById(req.params.id, function(err, post){
            if(err)
                res.send(err);
            res.json(post);
        });
    }) 

	//deletes the post
    .delete(function(req, res) {
        Post.remove({
            _id: req.params.id
        }, function(err) {
            if (err)
                res.send(err);
            res.json("deleted :(");
        });
    });

module.exports = router;