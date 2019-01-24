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
    // this.dynamicItems = new this.DynamicItems(friendsService.dataFollow.friend,0);
    // this.postsOnePerson = new this.DynamicItems(friendsService.dataFollow.getPersonPosts);

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
    console.log(id)
    var that = this
    this.testOneDataPerson=new this.DynamicItems(this.friendsService.dataFollow.getPersonPosts,id,this.friendsService.dataFollow)
    // this.friendsService.getPersonPosts(id)
    //   .then(posts=>{
    //     that.posts = posts;
    //   })
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
