export class MainController {
  constructor ($rootScope ,$window,$log,$timeout,$scope, webDevTec,mainService, toastr, $http,friendsService) {
    'ngInject';
    var vm = this;
    vm.Mydata = mainService.Mydata;

    vm.checkNewPosts = false;
    vm.socket = vm.Mydata.socket()
    vm.socket.on('check',function(res){
      console.log("zdesss")
      $scope.$apply(vm.checkNewPosts = true);
    });
    $scope.$on('$locationChangeStart', function(event, newUrl, oldUrl){
      // console.log(newUrl.slice(newUrl.lastIndexOf("/")+1))
      if(oldUrl.slice(oldUrl.lastIndexOf("/")+1)=="home"){
        vm.socket.disconnect({test:"discccc"})
      }
    });


    vm.http=$http;
    vm.friendsService =friendsService
    vm.log = $log;
    vm.scope = $scope;
    vm.showPost = 0
    vm.testC=false
    vm.testC1 = true
    vm.cheack ="";
    vm.cheack1="";
    vm.awesomeThings = [];
    vm.toastr = toastr;
    vm.UserAction = mainService.UsersAction;
    vm.myfirstsService = []
    vm.TablePerson = [];
    vm.myReaction ="";



    // this.infiniteItems = {
    //   numLoaded_: [],
    //   toLoad_: 0,
    //   offset:5,
    //   test:[],
    //
    //   // Required.
    //   getItemAtIndex: function(index) {
    //
    //     if (index > this.toLoad_) {
    //       this.fetchMoreItems_(index);
    //       return null;
    //     } else {
    //       return this.numLoaded_[index];
    //     }
    //
    //
    //   },
    //
    //   // Required.
    //   // For infinite scroll behavior, we always return a slightly higher
    //   // number than the previously loaded items.
    //   getLength: function() {
    //
    //     if(this.toLoad_<70) {
    //       console.log(this.toLoad_)
    //       return this.toLoad_ + 5;
    //
    //     } else{
    //       return this.toLoad_
    //     }
    //   },
    //
    //   fetchMoreItems_: function(index) {
    //     // For demo purposes, we simulate loading more items with a timed
    //     // promise. In real code, this function would likely contain an
    //     // $http request.
    //
    //     if (this.toLoad_ < index) {
    //       this.toLoad_ += 5;
    //       vm.Mydata.getPosts(this.toLoad_,null).then(response => {
    //          this.numLoaded_ = this.numLoaded_.concat(response.result)
    //         // this.numLoaded_ .push(response.result);
    //
    //       })
    //         //
    //         // this.numLoaded_ = this.toLoad_;
    //
    //     }
    //   }
    // };

    vm.DynamicItems = function(id,dataFollows,text=null) {
      this.text = text;
      this.loadedPages = {};
      this.dataFollows=dataFollows
      this.id=id
      this.numItems = 0;

      this.PAGE_SIZE = 5;

      this.fetchNumItems_();
      this.check = []
    };

    // Required.
    this.DynamicItems.prototype.getItemAtIndex = function(index) {
      this.pageNumber = Math.floor(index / this.PAGE_SIZE);
      var page = this.loadedPages[this.pageNumber];

      if (page) {
        return page[index % this.PAGE_SIZE];
      } else if (page !== null) {
        this.fetchPage_(this.pageNumber);
      }
    };

    // Required.
    vm.DynamicItems.prototype.getLength = function() {
      return this.numItems;
    };

    vm.DynamicItems.prototype.fetchPage_ = function(pageNumber) {

      this.loadedPages[pageNumber] = null;

      var pageOffset = pageNumber * this.PAGE_SIZE;
      vm.Mydata.getPosts(pageOffset,this.text).then(response => {
        this.loadedPages[pageNumber] = response.result;
      })
    };

    vm.DynamicItems.prototype.fetchNumItems_ = function() {

      this.dataFollows.getLength(this.id,0,this.text)
        .then(numPosts=>{
          this.numItems = numPosts.length
        })
      //vm.numItems = 50000;

    };
    vm.allPublicPosts = new this.DynamicItems("all",friendsService.dataFollow)




    vm.scope.procent = function(post){
      return parseInt((post.yes/((post.no+post.yes)/100)).toString(),10)
    }

    // vm.activate($timeout, webDevTec);
    vm.scope.testFol = function (user){
      if(!user.follows[0]){

        return true;
      } else if(!user.check[0]){
        return true;
      } else {
        return false;
      }
    }
    // vm.activate = function($timeout, webDevTec) {
    //   vm.getWebDevTec(webDevTec);
    //   $timeout(() => {
    //     vm.classAnimation = 'rubberBand';
    //   }, 4000);
    //   vm.getMydata(webDevTec);
    //
    // }
    vm.takeMyReactions = function() {

      vm.Mydata.takeReacions().then(res=>{
          vm.myReaction = res;
        }
      )
    }

    vm.getWebDevTec = function(webDevTec) {
      vm.awesomeThings = webDevTec.getTec();

      angular.forEach(vm.awesomeThings, (awesomeThing) => {
        awesomeThing.rank = Math.random();
      });
    }
    vm.getMydata = function(webDevTec){
      vm.myfirstsService = webDevTec.getYesNodata();
      vm.TablePerson = webDevTec.getdata();
      angular.forEach(vm.myfirstsService, (cont) => {
        cont.rank = Math.random();
      })
    }
    vm.getReaction = function(reaction,posts){
      posts.reactions.push({reaction:"true"})
      if(reaction==0){
        posts.no++;
      } else posts.yes++;

      vm.Mydata.getReaction(reaction, posts,0).then(res=>{
        posts.percent = res.percent
      });

    }
    vm.checkReaction = function(id){
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
    vm.addName = function(person,post){
      if (String(person.id) === post.idUser) {
        return person.login;
      }
    }

    vm.showToastr = function() {
      vm.toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
      vm.classAnimation = '';
    }
    vm.deleteFollows = function(post){
      vm.UserAction.DeleteFollow(post.idUser).then(res=>{
        vm.res = res;
        vm.allPublicPosts.loadedPages={};
      })
      post.User.follows[0]=null
    }
    vm.showFollows = function(post){
      post.User.follows[0]=1
      vm.UserAction.Follow(post.idUser).then(res =>{
        vm.res = res;
        for(var i in vm.allPublicPosts.loadedPages) {
          console.log(i)
          for (var k in vm.allPublicPosts.loadedPages[i]) {
            if(post.User.id == vm.allPublicPosts.loadedPages[i][k].User.id){
              vm.allPublicPosts.loadedPages[i][k].User.follows[0] = true;

            }
                // console.log(vm.allPublicPosts.loadedPages[i][k])
          }
        }


        // for(let i =0;i<)


          vm.toastr.info('Follow')

      })
    }
    vm.search = function(text){
      vm.allPublicPosts=null
      vm.allPublicPosts = new vm.DynamicItems("all",vm.friendsService.dataFollow,text)
      vm.showPost=1;
    }
    vm.newPost = function(){
      vm.checkNewPosts = false;

      vm.allPublicPosts.loadedPages={}
    }
  }





}
