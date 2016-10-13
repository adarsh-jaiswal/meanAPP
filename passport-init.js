var mongoose = require('mongoose');
var User = mongoose.model('User');
var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');

//var User = mongoose.model('User');
var Post = mongoose.model('Post');


//this will be exposed when passport-init is required and is called with a function 
// this function is exported
module.exports = function(passport){

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
//tell passport which id to use for user
        console.log('serializing user:',user.username);  //mpngo gives unique id foe evry object
        //return the unique id for the user
        return done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
      //return user object back
        User.findById(id, function(err, user){
           console.log('deserializing user:',user.username);
			done(err, user);
        });
        
        //we found the user object provide it back to passport
     

    });

  
    
   passport.use('login', new LocalStrategy({
			passReqToCallback : true
		},
		function(req, username, password, done) { 
			// check in mongo if a user with username exists or not
			User.findOne({ 'username' :  username }, 
				function(err, user) {
					// In case of any error, return using the done method
					if (err)
						return done(err);
					// Username does not exist, log the error and redirect back
					if (!user){
						console.log('User Not Found with username '+username);
						return done(null, false);                 
					}
					// User exists but wrong password, log the error 
					if (!isValidPassword(user, password)){
						console.log('Invalid Password');
						return done(null, false); // redirect back to login page
					}
					// User and password both match, return user from done method
					// which will be treated like success
				console.log('successfully signed in'+user);	
                return done(null, user);
				}
			);
		}
	));

   
    
    passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { 
            //check if the user already exists
         User.findOne({username: username}, function(err, user){
             if(err){
                 return done(err, false);
             }
             if(user){
                 //we have already signed this user up
                 return done('username already taken', false);
             }
             var newuser = new User();
             
             newuser.username =  username;
             newuser.password = createHash(password);
             
             newuser.save(function(err, user){
                 if(err){
                     return done(err, false);
                 }
                 console.log('successfully signed up user'+newuser.username);
                 return done(null, newuser);
             });
         });   
        
           
         
       
        })
    );

    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    };
    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };

};