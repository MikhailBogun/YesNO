export class FriendController {
  constructor ($timeout, friendsService, webDevTec, $http, $scope) {
    'ngInject'

    let that = this;
    $http.get('http://localhost:8000/PostAll')
      .then(function(promise) {
          //this.data=success.data;
        that.promise = promise.data;
        },
        function(error) {
          that.promise = error;
        });
    this.promise = $scope.pr;
    this.TablePerson = [];

    this.activate($timeout, friendsService, webDevTec, $http);
  }
  activate($timeout, friendsService, webDevTec, $http) {
    this.getDataFriends(friendsService, webDevTec, $http);
  }
  getDataFriends(friendsService, webDevTec){
    this.friendsData = friendsService.getFriends();
    this.TablePerson = webDevTec.getdata();

  }
}
