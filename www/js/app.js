angular.module('starter', ['ionic', 'firebase'])

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
    document.addEventListener("resume", function () {
        Firebase.goOnline();
    },false);  
        
    document.addEventListener("pause", function () {
        Firebase.goOffline();
    },false);
  });
})

.factory("Items", function($firebaseArray) {
    var itemsRef = new Firebase("https://matodo.firebaseio.com/");
    return $firebaseArray(itemsRef);
})

.controller("appCtrl", function($scope, $ionicPopup, $location, Items, $ionicListDelegate) {
    $scope.mmsg = "Main Controller";
    console.log($scope.mmsg);
    $scope.todos = Items;
    
    //creer un item
    $scope.create = function() {
        $ionicPopup.prompt({
            title: 'What is the next visit ?',
            inputType: 'text'    
        })
        .then(function(result) {
            if(result != "") {
                $scope.todos.$add({title: result, check: false});                
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
            $scope.todos.$remove(i);          
            //$scope.db.child(i).remove();
        });
    }

    //go to info page
    $scope.info = function(i){
        $location.path("/info");
        $scope.infos = i;
        $ionicListDelegate.closeOptionButtons();
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
        //$scope.db.child(i+"/check").set(bool);
        $scope.todos.$save(i);
        console.log(i+" checked has changed to "+bool);
    }
})
/* Info*/
.controller("InfoCtrl", function($scope, $ionicPopup){
    $scope.msg = "Info Ctrl";
    console.log($scope.msg);

    //add favorite
    $scope.favorited = function(){
        $scope.todos.$save($scope.infos);
        console.log($scope.infos.title+" favorite has changed to "+$scope.infos.favorite);
    }
    
    //edit location
    $scope.editL = function(){
        $ionicPopup.prompt({
            title: 'Edit',
            template: '<input type="text" ng-model="infos.location">',
            scope: $scope,
            buttons: [
            {
                text: 'Cancel'
            },{
                text: '<b>Save</b>',
                type: 'button-positive',
                onTap: function(e){
                    $scope.todos.$save($scope.infos);
                }
            }]
        })
    }

    //edit comment
    $scope.editC = function(){
        $ionicPopup.prompt({
            title: 'Edit',
            template: '<input type="text" ng-model="infos.comment">',
            scope: $scope,
            buttons: [
            {
                text: 'Cancel'
            },{
                text: '<b>Save</b>',
                type: 'button-positive',
                onTap: function(e){
                    $scope.todos.$save($scope.infos);
                }
            }]
        })
    }
})
/* Favorites*/
.controller("FavoritesCtrl", function($scope, $filter){
    $scope.msg = "Favorites Ctrl";
    console.log($scope.msg);
    $scope.fav = $filter('filter')($scope.todos, {favorite: true});
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
