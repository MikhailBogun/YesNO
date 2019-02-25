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
        for(var i in vm.allPublicPosts.loadedPages) {
          for (var k in vm.allPublicPosts.loadedPages[i]) {
            if(typeof post.User_id!=="undefined") {
              if(post.User_id == vm.allPublicPosts.loadedPages[i][k].User_id) {
                vm.allPublicPosts.loadedPages[i][k].User_follows_id = false
              }

            } else {
              if(post.User.id == vm.allPublicPosts.loadedPages[i][k].User.id){
                  vm.allPublicPosts.loadedPages[i][k].User.follows[0] = false;
              }
            }

          }
        }
      })
    }
    vm.showFollows = function(post){

      vm.UserAction.Follow(post.idUser).then(res =>{
        vm.res = res;
        for(var i in vm.allPublicPosts.loadedPages) {
          for (var k in vm.allPublicPosts.loadedPages[i]) {

            if(typeof post.User_id!=="undefined"){

              if(post.User_id == vm.allPublicPosts.loadedPages[i][k].User_id) {
                vm.allPublicPosts.loadedPages[i][k].User_follows_id = true
              }

            } else{
              if(post.User.id == vm.allPublicPosts.loadedPages[i][k].User.id){
                vm.allPublicPosts.loadedPages[i][k].User.follows[0] = true;
              }

            }

          }
        }
          if(post.User_login){
            vm.toastr.info('Follow ', post.User_login)

          } else {
            vm.toastr.info('Follow ', post.User.login)
          }

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
