(function(){
  'use strict';

  angular.module("NarrowItDownApp", [])
.controller("NarrowItDownController", NarrowItDownController)
.controller("FoundItemsController", FoundItemsController)
.service("MenuSearchService", MenuSearchService)
.directive('foundItems', FoundItemsDirective)
.component("loadingSpinner", {
  templateUrl:'itemsloaderindicator_template.html',
  controller: SpinnerController
});


NarrowItDownController.$inject = ['MenuSearchService','$rootScope']
function NarrowItDownController(searchProvider,$rootScope){
  var ctr1=this;
  ctr1.msg = "";

  ctr1.searchItems = function(searchQuery){
    if(searchQuery){
        ctr1.foundItems = [];
        ctr1.msg = "";
        $rootScope.$broadcast('menu_items:processing',{on:true});
        var promise = searchProvider.getFoundItems(searchQuery);
        promise.then(function(response){
          //console.log(response);
          ctr1.foundItems = response;
          //console.log(ctr1.foundItems);
          $rootScope.$broadcast('menu_items:processing',{on:false});
          if(ctr1.foundItems.length==0){
            ctr1.msg="Nothing found..";
          }
        });

    }
    else{
      ctr1.foundItems = [];
      ctr1.msg="Nothing found..";
    }
  }

  ctr1.removeItem = function(index){
    ctr1.foundItems.splice(index,1);
    if(ctr1.foundItems.length ==0){
      this.msg="Nothing found..";
    }
  }
}

function FoundItemsController(){

}

MenuSearchService.$inject = ['$http','$rootScope']
function MenuSearchService($http,$rootScope){
  var foundItems = [];
  var searchQuery = "";

  var filterItems = function(responsePromise){
    var response_data = responsePromise.data;
    //console.log(response_data);
    var itemList = response_data[Object.keys(response_data)[0]];
    for(var i=0; i<itemList.length; i++){
      console.log(searchQuery);
      var raw_item = itemList[i];
      if(raw_item.description.toLowerCase().indexOf(searchQuery) != -1){
        var item = new Object();
        item.name = raw_item.name;
        item.short_name = raw_item.short_name;
        item.description = raw_item.description;
        foundItems.push(item);
      }
    }
    //console.log(foundItems);
    return foundItems;
  }

  this.getFoundItems = function(searchQueryArg){
    searchQuery = searchQueryArg;
    foundItems = [];
    var promise = $http({
      method: "GET",
      url: "https://davids-restaurant.herokuapp.com/menu_items.json"
    });

    var filteredItemsPromise = promise.then(function(response){
      return filterItems(response);
    });
    return filteredItemsPromise;
  }


}

var loadingSpinnerComponent = {
  templateUrl:'loader/itemsloaderindicator.template.html',
  controller: SpinnerController
};

function FoundItemsDirective(){
  var ddo = {
    templateUrl: "templates/founditem_template.html",
    scope :{
      'found':'<',
      'onRemove': '&',
      'message' : '<'
    },
    controller: FoundItemsController,
    bindToController: true,
    controllerAs: 'ctr2',
    transclude : true
  };
  return ddo;
}

SpinnerController.$inject=['$rootScope']
function SpinnerController($rootScope){
  var $ctrl=this;
  $ctrl.showLoader = false;

  var cancelListener = $rootScope.$on('menu_items:processing', function(event,data){
    if(data.on){
      $ctrl.showLoader = true;
    }
    else{
      $ctrl.showLoader = false;
    }
  });

  $ctrl.$onDestroy = function(){
    cancelListener();
  };
}

})();
