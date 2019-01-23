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
    this.friendsService= friendsService;
    this.tableKey=[0,0,0]
    this.http = $http;
    this.scope = $scope;
    this.promise = $scope.pr;
    this.TablePerson = [];
    this.UserAction = mainService.UsersAction;
    this.MyData = mainService.Mydata;
    this.foods =["Пирожки","Олади"]
    this.scope.items=[]
    let tes = Math.floor(47.6)
    console.log("tyt",tes)
    for(let i=0;i<1000;i++)
    {
      this.scope.items.push(i)
    }
    // this.UserAction.getFriend().then(res=>{
    //   that.follows = res;
    // });

    this.rows =["1","2"]
    this.counter =3
    this.activate($timeout, friendsService, webDevTec, $http);

    var DynamicItems = function(friendServ) {
      /**
       * @type {!Object<?Array>} Data pages, keyed by page number (0-index).
       */
      this.loadedPages = {};
      this.friendServ =friendServ

      /** @type {number} Total number of items. */
      this.numItems = 0;

      /** @const {number} Number of items to fetch per request. */
      this.PAGE_SIZE = 50;

      this.fetchNumItems_();
    };

    // Required.
    DynamicItems.prototype.getItemAtIndex = function(index) {
      var pageNumber = Math.floor(index / this.PAGE_SIZE);
      var page = this.loadedPages[pageNumber];

      if (page) {
        return page[index % this.PAGE_SIZE];
      } else if (page !== null) {
        this.fetchPage_(pageNumber);
      }
    };

    // Required.
    DynamicItems.prototype.getLength = function() {
      return this.numItems;
    };

    DynamicItems.prototype.fetchPage_ = function(pageNumber) {
      // Set the page to null so we know it is already being fetched.
      this.loadedPages[pageNumber] = null;

      // For demo purposes, we simulate loading more items with a timed
      // promise. In real code, this function would likely contain an
      // $http request.
      $timeout(angular.noop, 300).then(angular.bind(this, function() {
        this.loadedPages[pageNumber] = [];
        var pageOffset = pageNumber * this.PAGE_SIZE;
        this.friendServ.Test(pageOffset)
          .then(response=>{
            console.log(response)
          })
        for (var i = pageOffset; i < pageOffset + this.PAGE_SIZE; i++) {
          this.loadedPages[pageNumber].push(i);
        }
      }));
    };

    DynamicItems.prototype.fetchNumItems_ = function() {
      // For demo purposes, we simulate loading the item count with a timed
      // promise. In real code, this function would likely contain an
      // $http request.
      $timeout(angular.noop, 300).then(angular.bind(this, function() {
        this.numItems = 50000;
      }));
    };
    this.dynamicItems = new DynamicItems(friendsService);

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
  show(key) {
    for(let i in this.tableKey){
      this.tableKey[i]=0
  }
    this.tableKey[key]=1
  }
  addRow(){
    console.log("hello")
    this.rows.push("Row"+this.counter)
    this.counter++;
  }
  showPost(id){
    console.log("Hello")
    var that = this
    this.friendsService.getPersonPosts(id)
      .then(posts=>{
        that.posts = posts;
      })
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
