export class FriendController {
  constructor ($timeout, friendsService,mainService, webDevTec, $http, $scope) {
    'ngInject'
    this.test=true;
    let that = this;
    // $http.get('api/PostAll')
    //   .then(function(promise) {
    //       //this.data=success.data;
    //     that.promise = promise.data;
    //     },
    //     function(error) {
    //       that.promise = error;
    //     });
    friendsService.returnFriend().then(info=>{
      that.friends = info.friends;
      that.subscriber = info.subscriber;
      that.followed = info.followed
    })
    this.http = $http;
    this.promise = $scope.pr;
    this.TablePerson = [];
    this.UserAction = mainService.UsersAction;

    // this.UserAction.getFriend().then(res=>{
    //   that.follows = res;
    // });

    this.rows =["1","2"]
    this.counter =3
    this.activate($timeout, friendsService, webDevTec, $http);
  }
  activate($timeout, friendsService, webDevTec, $http) {
    this.getDataFriends(friendsService, webDevTec, $http);
  }
  getDataFriends(friendsService, webDevTec){
    this.friendsData = friendsService.getFriends();
    this.TablePerson = webDevTec.getdata();

  }
  deleteFollows(followers){

    console.log(followers)
    this.UserAction.DeleteFollow(followers.id).then(res=>{
      this.res = res;
    })
    let bufer ={}
    for(let key in followers){
      bufer[key] = followers[key]
      delete followers[key]
    }
    this.subscriber.push(bufer)
    //post.User.follows[0]=null
  }
  follow(subs){
    //post.User.follows[0]=1
    this.UserAction.Follow(subs.id).then(res =>{
      that.res = res;
      this.toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
      if(res == "ok"){
        this.toastr.info('Follow',+ person.login)
        this.toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
      }
    })
    let bufer ={}
    for(let key in subs){
      bufer[key] = subs[key]
      delete subs[key]
    }
    this.friends.push(bufer)
  }
  // Follow(person){
  // }
  testF(){
    this.test=false;
  }
  addRow(){
    console.log("hello")
    this.rows.push("Row"+this.counter)
    this.counter++;
  }

}
