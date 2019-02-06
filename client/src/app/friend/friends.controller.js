export class FriendController {
  constructor ($timeout, friendsService,mainService, webDevTec, $http, $scope,toastr) {
    'ngInject'
    this.test=true;
    let that = this;
    friendsService.returnFriend().then(info=>{
      that.friends = info.friends;
      that.subscriber = info.subscriber;
      that.followed = info.followed
    })
    this.toastr = toastr
    this.friendsService= friendsService;
    this.tableKey=[1,0,0]
    this.http = $http;
    this.scope = $scope;
    this.promise = $scope.pr;
    this.TablePerson = [];
    this.UserAction = mainService.UsersAction;
    this.MyData = mainService.Mydata;
    this.scope.items=[]
    this.counter =3
    this.activate($timeout, friendsService, webDevTec, $http);

    this.DynamicItems = function(friendServ,id,dataFollows) {

      this.loadedPages = {};
      this.dataFollows=dataFollows
      this.id=id
      this.friendServ =friendServ
      this.numItems = 0;

      this.PAGE_SIZE = 5;

      this.fetchNumItems_();
      this.check = []
    };

    // Required.
    this.DynamicItems.prototype.getItemAtIndex = function(index) {
      var pageNumber = Math.floor(index / this.PAGE_SIZE);
      var page = this.loadedPages[pageNumber];

      if (page) {
        return page[index % this.PAGE_SIZE];
      } else if (page !== null) {
        this.fetchPage_(pageNumber);
      }
    };

    // Required.
    this.DynamicItems.prototype.getLength = function() {
      return this.numItems;
    };

    this.DynamicItems.prototype.fetchPage_ = function(pageNumber) {

      this.loadedPages[pageNumber] = null;

      $timeout(angular.noop, 300).then(angular.bind(this, function() {
        var pageOffset = pageNumber * this.PAGE_SIZE;
        this.friendServ(pageOffset,this.id)
          .then(response=>{
            this.loadedPages[pageNumber] =response.result
          })
      }));
    };

    this.DynamicItems.prototype.fetchNumItems_ = function() {
      this.dataFollows.getLength(this.id,0)
        .then(numPosts=>{
          this.numItems = numPosts.length
        })
        this.numItems = 50000;

    };

  }
  activate($timeout, friendsService, webDevTec, $http) {
    this.getDataFriends(friendsService, webDevTec, $http);
  }
  getDataFriends(friendsService, webDevTec){
    this.friendsData = friendsService.getFriends();
    this.TablePerson = webDevTec.getdata();

  }
  deleteFollows(followers){
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
  deleteFollows1(followers){

    this.UserAction.DeleteFollow(followers.id).then(res=>{
      this.res = res;
    })
    for(let key in followers){
      delete followers[key]
    }
  }
  follow(subs){
    //post.User.follows[0]=1
    var that = this;
    this.UserAction.Follow(subs.id).then(res =>{
      that.res = res;
    })
    that.toastr.info('Подписались на  <a  target="_blank"><b>'+subs.login+'</b></a>');
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
  show(key) {
    for(let i in this.tableKey){
      this.tableKey[i]=0
  }
    this.tableKey[key]=1
  }
  addRow(){
    this.rows.push("Row"+this.counter)
    this.counter++;
  }
  showPost(id){

    this.testOneDataPerson=new this.DynamicItems(this.friendsService.dataFollow.getPersonPosts,id,this.friendsService.dataFollow)

  }
  getReaction(reaction,posts){
    var that = this;
    posts.reactions.push({reaction:"true"})
    if(reaction==0){
      posts.no++;
    } else posts.yes++;

    this.MyData.getReaction(reaction, posts,0).then(res=>{
      that.scope.percent = res;
    });
  }


}
