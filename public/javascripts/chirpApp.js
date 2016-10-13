var  app = angular.module('chirpApp',[ 'ngRoute', 'ngResource']).run(function($rootScope, $http){
    $rootScope.authenticated = false;
    $rootScope.current_user = '';
    
    
    $rootScope.signout = function(){
       $http.get('auth/signout');        
        $rootScope.authenticated = false;
         $rootScope.current_user = 'Guest';
    };
});

app.config(function($routeProvider){
  $routeProvider
    //the timeline display
    .when('/', {
      templateUrl: 'main.html',
      controller: 'mainController'
    })
    //the login display
    .when('/login', {
      templateUrl: 'login.html',
      controller: 'authController'
    })
    //the signup display
    .when('/register', {
      templateUrl: 'register.html',
      controller: 'authController'
    });
});

app.factory('postService' , function($resource){
  /* var factory = {};
    factory.getAll = function(){
      return $http.get('/api/posts');  
    };
    return factory;*/
    return $resource('/api/posts/:id');
});

app.controller('mainController', function ($scope , $rootScope, postService) {
    $scope.posts = postService.query();
	$scope.newPost = {created_by: '', text: '', created_at: ''};
    /*postService.getAll().success(function(data){
        $scope.posts = data;
        
    });*/ 
    $scope.post = function(){
       $scope.newPost.created_by = $rootScope.current_user;
       $scope.newPost.created_at = Date.now();
      postService.save($scope.newPost, function(){
            $scope.posts = postService.query();
            $scope.newPost = {created_by: '', text: '', created_at: ''};
  });
    //done to reset newPost 
    };
});

app.controller('authController', function ($scope, $rootScope , $http , $location)  {
     $scope.user = {username:'', password:''};
     $scope.error_message = '';
    
    $scope.register = function(){
       //codes to be written
        $http.post('/auth/signup', $scope.user).success(function(data){
           $rootScope.authenticated= true;
            $rootScope.current_user = data.user.username;  //passed from the mongo db
            $location.path('/');
        });
        
       // $scope.error_message = 'registration request for'+ $scope.user.username;
        
    };
    $scope.login = function(){
        //codes need to be written
         $http.post('/auth/login', $scope.user).success(function(data){
           if(data.state == 'success'){
				$rootScope.authenticated = true;
				$rootScope.current_user = data.user.username;
				$location.path('/');
			}
			else{
				$scope.error_message = data.message;
			}
        //$scope.error_message = 'login request for' + $scope.user.username;
        
    });
  };
});
