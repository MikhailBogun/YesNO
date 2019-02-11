export class PrivatePostController{
  constructor($scope,privatePostService, mainService,friendsService) {
    'ngInject';
    var vm = this;
    vm.onlyFriend = friendsService.dataFollow.getOnlyFriend
    vm.friendsService  = friendsService
    vm.Hello = "hello1";
    vm.scope = $scope;
     vm.posts = privatePostService.PrivateData;
     vm.dataPosts = "";
    vm.myReaction ="";
    vm.Mydata = mainService.Mydata;
     vm.posts.getData()
       .then(res=>{
         vm.dataPosts = res;
       })
    this.DynamicItemsFriends = function(onlyFriends,searchText=null) {

      this.loadedPages = {};
      this.searchText=searchText;
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

    };
    vm.onlyFriendsData = new vm.DynamicItemsFriends(friendsService.dataFollow.getmyFriends)

    vm.DynamicItems = function(onlyFriends,id,dataFollows) {

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
    vm.DynamicItems.prototype.getItemAtIndex = function(index) {
      var pageNumber = Math.floor(index / this.PAGE_SIZE);
      var page = this.loadedPages[pageNumber];

      if (page) {
        return page[index % this.PAGE_SIZE];
      } else if (page !== null) {
        this.fetchPage_(pageNumber);
      }
    };

    // Required.
    vm.DynamicItems.prototype.getLength = function() {
      return this.numItems;
    };

    vm.DynamicItems.prototype.fetchPage_ = function(pageNumber) {

      this.loadedPages[pageNumber] = null;


        var pageOffset = pageNumber * this.PAGE_SIZE;
      this.onlyFriends(pageOffset,this.id)
          .then(response=>{
            this.loadedPages[pageNumber] =response.result
          })

    };

    vm.DynamicItems.prototype.fetchNumItems_ = function() {

      this.dataFollows.getLength(this.id,1)
        .then(numPosts=>{
          this.numItems = numPosts.length
        })

    };
    vm.allprivatePosts = new vm.DynamicItems(vm.onlyFriend,"all",friendsService.dataFollow)

    vm.getReaction = function(reaction,posts) {

      vm.cheack = reaction;
      vm.cheack1 =posts;
      posts.reactions.push({reaction:"true"})
      if(reaction==0){
        posts.no++;
      } else posts.yes++;
      vm.Mydata.getReaction(reaction, posts).then(res=>{
        posts.percent = res.percent;
      });
    }
    vm.checkReaction = function(id) {
      for(let i = 0; i<vm.myReaction.length;i++){
        if(id == vm.myReaction[i].idPost) {
          return false;
        }
      }
      return true;
    }
    vm.checkMyReaction = function(post) {
      for(let i = 0; i<vm.myReaction.length;i++){
        if(post.id == vm.myReaction[i].idPost) {
          vm.scope.count = parseInt((post.yes/((post.no+post.yes)/100)).toString(),10)
          return true;
        }
      }
      return false;
    }
    vm.showPost = function(id){
      vm.allprivatePosts = new vm.DynamicItems(vm.onlyFriend,id,vm.friendsService.dataFollow)
    }
    vm.allPrivatePost = function(){
      vm.allprivatePosts = new vm.DynamicItems(vm.onlyFriend,"all",vm.friendsService.dataFollow)
    }
  }

}
