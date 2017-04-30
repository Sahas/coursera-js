(function(){
  'use strict';

  angular.module("NarrowItDownApp", [])
.controller("SearchController", SearchController)
.controller("FoundItemsController", FoundItemsController)
.service("MenuSearchService", MenuSearchService)
.directive('foundItems', FoundItemsDirective);


SearchController.$inject = ['MenuSearchService']
function SearchController(searchProvider){
  var ctr1=this;

  ctr1.searchItems = function(searchQuery){
    if(searchQuery){
        var promise = searchProvider.getFoundItems(searchQuery);
        promise.then(function(response){
          //console.log(response);
          ctr1.foundItems = response;
          console.log(ctr1.foundItems);
        });
    }
    else{
      ctr1.foundItems = [];
    }
  }

  ctr1.removeItem = function(index){
    ctr1.foundItems.splice(index,1);
  }
}

function FoundItemsController(){

}

MenuSearchService.$inject = ['$http']
function MenuSearchService($http){
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


function FoundItemsDirective(){
  var ddo = {
    templateUrl: "templates/founditem_template.html",
    scope :{
      'found':'<',
      'onRemove': '&'
    },
    controller: FoundItemsController,
    bindToController: true,
    controllerAs: 'ctr2',
    transclude : true
  };
  return ddo;
}
})();
