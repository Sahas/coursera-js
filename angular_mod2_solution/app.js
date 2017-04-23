(function(){
  angular.module('ShoppingListApp', [])
  .service('ListItemService', ListItemService)
  .controller('ToBuyController', ToBuyController)
  .controller('BoughtController', BoughtController);

  ToBuyController.$inject = ['ListItemService']
  function ToBuyController(ListItemService){
    var ctr1 = this;
    ctr1.toBuyList = ListItemService.toBuyList;

    ctr1.removeItemFromList = function($index){
      ListItemService.boughtItem($index);
      ctr1.toBuyList = ListItemService.toBuyList;
    }

    ctr1.isBuyListEmpty = function(){
      if(ctr1.toBuyList.length == 0){
        return true;
      }
    }

  }


  BoughtController.$inject = ['ListItemService']
  function BoughtController(ListItemService){
    var ctr2 = this;
    ctr2.boughtList = ListItemService.boughtList;

    this.isBoughtListEmpty = function(){
      if(ctr2.boughtList.length ==0){
        return true;
      }
    }
  }

  function ListItemService(){
    var service = this;

    service.totalItems = [
      {name: 'icecreams',quantity:10},
      {name: 'cornflakes', quantity:15},
      {name: 'apples', quantity:3},
      {name: 'post-it', quantity:6},
      {name: 'brooms', quantity:1},
      {name: 'frooti', quanity:8}
    ];

    service.toBuyList = service.totalItems;
    service.boughtList = [];

    service.boughtItem = function(index){
      service.boughtList.push(service.toBuyList[index]);
      service.toBuyList.splice(index,1);
    }

  }

})();
