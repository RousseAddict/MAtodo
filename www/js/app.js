var localDB = new PouchDB("todos");

angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  console.log("run ok");
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller("appCtrl", function($scope, $ionicPopup, PouchDBListener) {
    $scope.mmsg = "Main Controller";
    console.log($scope.mmsg);

    $scope.todos = [];
    //bouton afficher suppression
    $scope.data = {showDelete: false};

    //creer un item
    $scope.create = function() {
        $ionicPopup.prompt({
            title: 'What is the next visit ?',
            inputType: 'text'    
        })
        .then(function(result) {
            if(result != "") {
                localDB.post({title: result, check: false});
                $scope.todos.push({title: result, check: false});                
                console.log(result+" saved");
            } else {
                console.log("Action not completed");
            }
        });
    }
    //supprimer item
    $scope.remove = function(i){
        $ionicPopup.confirm({
            title: 'Are you sure ?',
            buttons: [{text: 'No'},
                      {text: '<b>Yes</b>',
                       type: 'button-positive',
                    }]
        })
        .then(function(){
            $scope.todos.splice(i,1);
        });
    }
    
    //supprimer tout
    $scope.removeAll = function(){
        $ionicPopup.confirm({
            title: 'Delete All ?',
            buttons: [{text: 'No'},
                      {text: '<b>Yes</b>',
                       type: 'button-positive',
                    }]
        })
        .then(function(){
            $scope.todos = [];
        });
    }

    $scope.$on('add', function(event, todo) {
        $scope.todos.push(todo);
    });
 
    $scope.$on('delete', function(event, id) {
        for(var i = 0; i < $scope.todos.length; i++) {
            if($scope.todos[i]._id === id) {
                $scope.todos.splice(i, 1);
            }
        }
    });
 
})

.factory('PouchDBListener', ['$rootScope', function($rootScope) {
    console.log("factory ok");
    localDB.changes({
        continuous: true,
        onChange: function(change) {
            if (!change.deleted) {
                $rootScope.$apply(function() {
                    console.log("apply");
                    localDB.get(change.id, function(err, doc) {
                        $rootScope.$apply(function() {
                            if (err) console.log(err);
                            $rootScope.$broadcast('add', doc);
                        })
                    });
                })
            } else {
                $rootScope.$apply(function() {
                    $rootScope.$broadcast('delete', change.id);
                });
            }
        }
    });
 
    return true;
     
}])
/* Home */
.controller("HomeCtrl", function($scope){
    $scope.msg = "Home Ctrl";
    console.log($scope.msg);
})
/* About*/
.controller("AboutCtrl", function($scope){
    $scope.msg = "About Ctrl";
    console.log($scope.msg);
})

//routes
.config(function($stateProvider, $urlRouterProvider){
  $stateProvider.state("app",{
    url:"/home",
    templateUrl:"views/home.html",
    controller:"HomeCtrl"
  })

  $stateProvider.state("about",{
    url:"/about",
    templateUrl:"views/about.html",
    controller:"AboutCtrl"
  })

  $urlRouterProvider.otherwise('/home')

});
