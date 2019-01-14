export class FriendController {
  constructor ($timeout, friendsService,mainService, webDevTec, $http, $scope) {
    'ngInject'
    this.test=true;
    let that = this;
    $http.get('api/PostAll')
      .then(function(promise) {
          //this.data=success.data;
        that.promise = promise.data;
        },
        function(error) {
          that.promise = error;
        });
    this.promise = $scope.pr;
    this.TablePerson = [];
    this.UserAction = mainService.UsersAction;

    this.UserAction.getFriend().then(res=>{
      that.follows = res;
    });


    this.activate($timeout, friendsService, webDevTec, $http);
  }
  activate($timeout, friendsService, webDevTec, $http) {
    this.getDataFriends(friendsService, webDevTec, $http);
  }
  getDataFriends(friendsService, webDevTec){
    this.friendsData = friendsService.getFriends();
    this.TablePerson = webDevTec.getdata();

  }
  Follow(person){
  }
  testF(){
    this.test=false;
  }
}
