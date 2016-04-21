var db = new Firebase("https://matodo.firebaseio.com/");

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

.controller("appCtrl", function($scope, $ionicPopup, $location) {
    $scope.mmsg = "Main Controller";
    console.log($scope.mmsg);

    $scope.todos = db;
    //récupérer la liste des items.
    db.on("value", function(snapshot) {
        console.log(snapshot.val());
        $scope.todos = snapshot.val();
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

    //creer un item
    $scope.create = function() {
        $ionicPopup.prompt({
            title: 'What is the next visit ?',
            inputType: 'text'    
        })
        .then(function(result) {
            if(result != "") {
                db.child(result).set({title: result, check: false});
                //$scope.todos.push({title: result, check: false});                
                console.log(result+" saved");
            } else {
                console.log("Action not completed");
            }
        });
    }
    //supprimer un item
    $scope.remove = function(i){
        $ionicPopup.confirm({
            title: 'Are you sure ?',
            buttons: [{text: 'No'},
                      {text: '<b>Yes</b>',
                       type: 'button-positive',
                    }]
        })
        .then(function(){
            //$scope.todos.splice(i,1);            
            db.child(i).remove();
        });
    }

    //go to info page
    $scope.info = function(i){
        $location.path("/info");
        $scope.infos = i;
    }
})


/* Home */
.controller("HomeCtrl", function($scope){
    $scope.msg = "Home Ctrl";
    console.log($scope.msg);

    //bouton afficher suppression
    $scope.data = {showDelete: false};

    //update check
    $scope.checked = function(i, bool){
        db.child(i+"/check").set(bool);
        console.log(i+" checked has changed to "+bool);
    }
})
/* Info*/
.controller("InfoCtrl", function($scope, $ionicPopup){
    $scope.msg = "Info Ctrl";
    console.log($scope.msg);

    //add favorite
    $scope.addFavorite = function(i){
        db.child(i+"/favorite").set(true);
        $ionicPopup.alert({
            title: 'Favorited',
            template: 'This place has been added to favorite !'
        });
    }
    //edit informations
    $scope.edit = function(i,j){
        $ionicPopup.prompt({
            title: 'Edit',
            inputType: 'text' 
        })
        .then(function(result) {
            if(result != "") {
                db.child(i+"/"+j).set(result);
            }
        });
    }
})
/* Favorites*/
.controller("FavoritesCtrl", function($scope){
    $scope.msg = "Favorites Ctrl";
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

  $stateProvider.state("info",{
    url:"/info",
    templateUrl:"views/info.html",
    controller:"InfoCtrl"
  })

  $stateProvider.state("favorites",{
    url:"/favorites",
    templateUrl:"views/favorites.html",
    controller:"FavoritesCtrl"
  })

  $stateProvider.state("about",{
    url:"/about",
    templateUrl:"views/about.html",
    controller:"AboutCtrl"
  })

  $urlRouterProvider.otherwise('/home')

});
