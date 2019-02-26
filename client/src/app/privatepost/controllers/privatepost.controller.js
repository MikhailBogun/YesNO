export class PrivatePostController {
  constructor($scope, privatePostService, mainService, friendsService) {
    'ngInject';
    var vm = this;
    vm.Mydata = mainService.Mydata;
    vm.checkNewPosts = false;
    vm.oneuserPosts =friendsService.dataFollow.getmyFriends
    vm.socket = vm.Mydata.socket()
    vm.socket.on('privateDate', function (res) {
      console.log("rabotaet")
      console.log(res)
      // $scope.$apply(vm.checkNewPosts = true);
    });
    vm.socket.emit("auth", {token: localStorage.getItem('id')})

    vm.socket.on('send', function (res) {
      $scope.$apply(vm.checkNewPosts = true);
    });

    $scope.$on('$locationChangeStart', function (event, newUrl, oldUrl) {
      console.log(oldUrl.slice(oldUrl.lastIndexOf("/") + 1) == "privatepost")
      if (oldUrl.slice(oldUrl.lastIndexOf("/") + 1) == "privatepost") {
        vm.socket.emit("leave", {token: localStorage.getItem('id')})
        vm.socket.disconnect()

      }

    });
    vm.newPost = function () {
      vm.checkNewPosts = false;
      vm.allprivatePosts.loadedPages = {}
    }
    vm.onlyFriend = friendsService.dataFollow.getOnlyFriend

    vm.friendsService = friendsService
    vm.scope = $scope;
    vm.posts = privatePostService.PrivateData;
    vm.dataPosts = "";
    vm.myReaction = "";

    vm.posts.getData()
      .then(res => {
        vm.dataPosts = res;
      })
    this.DynamicItemsFriends = function (onlyFriends, searchText = null, key) {

      this.loadedPages = {};
      this.searchText = searchText;
      this.onlyFriends = onlyFriends
      this.numItems = 0;
      this.relationship = key;

      this.PAGE_SIZE = 5;

      this.fetchNumItems_();
      this.check = []
    };
    this.DynamicItemsFriends.prototype.getItemAtIndex = function (index) {
      var pageNumber = Math.floor(index / this.PAGE_SIZE);
      var page = this.loadedPages[pageNumber];

      if (page) {
        return page[index % this.PAGE_SIZE];
      } else if (page !== null) {
        this.fetchPage_(pageNumber);
      }
    };

    // Required.
    this.DynamicItemsFriends.prototype.getLength = function () {
      return this.numItems;
    };

    this.DynamicItemsFriends.prototype.fetchPage_ = function (pageNumber) {

      this.loadedPages[pageNumber] = null;


      var pageOffset = pageNumber * this.PAGE_SIZE;
      this.onlyFriends(pageOffset, this.searchText, this.relationship)
        .then(response => {
          this.loadedPages[pageNumber] = response.friends
        })

    };

    this.DynamicItemsFriends.prototype.fetchNumItems_ = function () {

      this.onlyFriends("length", this.searchText, this.relationship)
        .then(numPosts => {
          this.numItems = numPosts.length
        })

    };
    vm.onlyFriendsData = new vm.DynamicItemsFriends(friendsService.dataFollow.getmyFriends, null, 2)

    vm.DynamicItems = function (onlyFriends, id, dataFollows,oneUser=null) {

      this.loadedPages = {};
      this.oneUser = oneUser;
      this.dataFollows = dataFollows
      this.id = id
      this.onlyFriends = onlyFriends
      this.numItems = 0;

      this.PAGE_SIZE = 5;

      this.fetchNumItems_();
      this.check = []
    };

    // Required.
    vm.DynamicItems.prototype.getItemAtIndex = function (index) {
      var pageNumber = Math.floor(index / this.PAGE_SIZE);
      var page = this.loadedPages[pageNumber];

      if (page) {
        return page[index % this.PAGE_SIZE];
      } else if (page !== null) {
        this.fetchPage_(pageNumber);
      }
    };

    // Required.
    vm.DynamicItems.prototype.getLength = function () {
      return this.numItems;
    };

    vm.DynamicItems.prototype.fetchPage_ = function (pageNumber) {

      this.loadedPages[pageNumber] = null;


      var pageOffset = pageNumber * this.PAGE_SIZE;
      this.onlyFriends(pageOffset, this.id,this.oneUser )
        .then(response => {
          this.loadedPages[pageNumber] = response.result
        })

    };

    vm.DynamicItems.prototype.fetchNumItems_ = function () {

      this.dataFollows.getLength(this.id, 1)
        .then(numPosts => {
          this.numItems = numPosts.length;
        })

    };

    vm.allprivatePosts = new vm.DynamicItems(vm.onlyFriend, "allPrivatePost", friendsService.dataFollow);

    vm.getReaction = function (reaction, posts) {

      posts.reactions.push({reaction: "true"})
      if (reaction == 0) {
        posts.no++;
      } else posts.yes++;

      vm.Mydata.getReaction(reaction, posts).then(res => {
        posts.percent = res.percent;
      });
    };

    vm.checkReaction = function (id) {
      for (let i = 0; i < vm.myReaction.length; i++) {
        if (id == vm.myReaction[i].idPost) {
          return false;
        }
      }
      return true;
    };

    vm.checkMyReaction = function (post) {
      for (let i = 0; i < vm.myReaction.length; i++) {
        if (post.id == vm.myReaction[i].idPost) {
          vm.scope.count = parseInt((post.yes / ((post.no + post.yes) / 100)).toString(), 10)
          return true;
        }
      }
      return false;
    };

    vm.showPost = function (id) {
      vm.allprivatePosts = new vm.DynamicItems(vm.friendsService.dataFollow.getPersonPosts, id, vm.friendsService.dataFollow,1);
    };

    vm.allPrivatePost = function () {
      vm.allprivatePosts = new vm.DynamicItems(vm.onlyFriend, "allPrivatePost", vm.friendsService.dataFollow);
    };
  }

}
