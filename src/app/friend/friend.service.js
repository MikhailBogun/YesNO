export class FriendsService{
  constructor ($http){
    'ngInject';
    let that = this;
    $http.get('api/follows')
      .then(function(promise) {
          //this.data=success.data;
          that.promise = promise.data;
        },
        function(error) {
          that.promise = error;
        });
    this.senk = function(){
      return "hello";
    };

    this.data = [
      {
        'id':'1000',
        'myFriend': ["1001","1002"]
      }
    ]
  }
   getFriends() {
    return this.data;
  }

}
// (function () {
//   'use strict';
//
//   angular
//     .module('yesno')
//     .service('FriendsService', FriendsService);
//
//   function FriendsService($http) {
//     var _FriendsService = this;
//     var data = [
//       {
//         'id':'1000',
//         'myFriend': ["1001","1002"]
//       }
//     ];
//
//     function getFriends(){
//       return data;
//     }
//     function getData(){
//       return this.promise;
//     }
//
//     function _list() {
//       return $http.get('http://localhost:8000/follows')
//         .then(function (res) {
//           return res;
//         })
//         .catch(function (err) {
//           return err;
//         })
//     }
//
//     _FriendsService.getFriends = getFriends;
//     _FriendsService.getData = getData;
//     _FriendsService.list = _list;
//   }
// })();