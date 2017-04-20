(function(){

  'use strict';
  angular.module('FoodCheckApp', []).controller('MainController', MainController);


  MainController.$inject = ['$scope'];
  function MainController($scope){

     $scope.onkeyup = function(){
      if($scope.items !== ''){
          $scope.message= '';
      }
    }


    $scope.check = function(){

      if($scope.items === ''){
        $scope.message= 'Please enter data first';
        $scope.messageColor = 'text-danger';
      }
      else{
        var itemList = $scope.items.split(',');
        var filteredItemList = itemList.filter(function(item){
          if(item.trim()!=''){
            return item;
          }

        });
        if(filteredItemList.length > 3){
          $scope.message = 'Too much';
        }
        else{
          $scope.message = 'Enjoy!'
        }
        $scope.messageColor = 'text-success';
      }

    }
  }
})();
