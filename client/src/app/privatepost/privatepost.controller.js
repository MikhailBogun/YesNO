export class PrivatePostCtrl {
  constructor($scope,privatePostService, mainService,friendsService) {
    'ngInject';
    this.onlyFriend = friendsService.dataFollow.getOnlyFriend
    this.friendsService  = friendsService
    this.Hello = "hello1";
    this.scope = $scope;
     this.posts = privatePostService.PrivateData;
     let that = this;
     this.dataPosts = "";
    this.myReaction ="";
    this.Mydata = mainService.Mydata;
     this.posts.getData()
       .then(res=>{
         that.dataPosts = res;
       })
    this.DynamicItemsFriends = function(onlyFriends) {

      this.loadedPages = {};

      this.onlyFriends =onlyFriends
      this.numItems = 0;

      this.PAGE_SIZE = 5;

      this.fetchNumItems_();
      this.check = []
    };
    this.DynamicItemsFriends.prototype.getItemAtIndex = function(index) {
      var pageNumber = Math.floor(index / this.PAGE_SIZE);
      var page = this.loadedPages[pageNumber];

      if (page) {
        return page[index % this.PAGE_SIZE];
      } else if (page !== null) {
        this.fetchPage_(pageNumber);
      }
    };

    // Required.
    this.DynamicItemsFriends.prototype.getLength = function() {
      return this.numItems;
    };

    this.DynamicItemsFriends.prototype.fetchPage_ = function(pageNumber) {

      this.loadedPages[pageNumber] = null;


      var pageOffset = pageNumber * this.PAGE_SIZE;
      this.onlyFriends(pageOffset)
        .then(response=>{
          this.loadedPages[pageNumber] =response.friends
        })

    };

    this.DynamicItemsFriends.prototype.fetchNumItems_ = function() {

      this.onlyFriends("length")
        .then(numPosts=>{
          this.numItems = numPosts.length
        })
      this.numItems = 50000;

    };
    this.onlyFriendsData = new this.DynamicItemsFriends(friendsService.dataFollow.getmyFriends)

    this.DynamicItems = function(onlyFriends,id,dataFollows) {

      this.loadedPages = {};
      this.dataFollows=dataFollows
      this.id=id
      this.onlyFriends =onlyFriends
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


        var pageOffset = pageNumber * this.PAGE_SIZE;
        this.onlyFriends(pageOffset,this.id)
          .then(response=>{
            this.loadedPages[pageNumber] =response.result
          })

    };

    this.DynamicItems.prototype.fetchNumItems_ = function() {

      this.dataFollows.getLength(this.id,1)
        .then(numPosts=>{
          this.numItems = numPosts.length
        })
      this.numItems = 50000;

    };
    this.allprivatePosts = new this.DynamicItems(this.onlyFriend,"all",friendsService.dataFollow)


  }
  getReaction(reaction,posts){
    var that = this;
    that.cheack = reaction;
    this.cheack1 =posts;
    posts.reactions.push({reaction:"true"})
    if(reaction==0){
      posts.no++;
    } else posts.yes++;
    this.Mydata.getReaction(reaction, posts).then(res=>{
      posts.percent = res.percent;
    });
  }
  checkReaction(id){
    for(let i = 0; i<this.myReaction.length;i++){
      if(id == this.myReaction[i].idPost) {
        return false;
      }
    }
    return true;
  }
  checkMyReaction(post){
    for(let i = 0; i<this.myReaction.length;i++){
      if(post.id == this.myReaction[i].idPost) {
        this.scope.count = parseInt((post.yes/((post.no+post.yes)/100)).toString(),10)
        return true;
      }
    }
    return false;
  }
  showPost(id){
    this.allprivatePosts = new this.DynamicItems(this.onlyFriend,id,this.friendsService.dataFollow)
  }
  allPrivatePost(){
    this.allprivatePosts = new this.DynamicItems(this.onlyFriend,"all",this.friendsService.dataFollow)
  }

}
