export class MainController {
  constructor ($log,$timeout,$scope, webDevTec,mainService, toastr, $http,friendsService) {
    'ngInject';
    this.http=$http;
    this.friendsService =friendsService
    this.log = $log;
    this.scope = $scope;
    this.showPost = 0
    this.c = "DDDDD"
    this.testC=false
    this.testC1 = true
    this.cheack ="";
    this.cheack1="";
    this.awesomeThings = [];
    this.classAnimation = '';
    this.creationDate = 1542888925003;
    this.toastr = toastr;
    this.UserAction = mainService.UsersAction;
    this.myfirstsService = []
    this.TablePerson = [];
    this.myReaction ="";
    this.Mydata = mainService.Mydata;
    this.votersYes = "";
    this.count = "Hello"
    // this.scope.getPercent = function (post) {
    //   return post.percent
    // }
    this.test = "123";

    this.DynamicItems = function(id,dataFollows,text=null) {
      this.text = text
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
      let page = this.loadedPages[this.pageNumber];

      if (page) {
        return page[index % this.PAGE_SIZE];
      } else if (page !== null) {
        this.fetchPage_(this.pageNumber);
      }
    };

    // Required.
    this.DynamicItems.prototype.getLength = function() {
      return this.numItems;
    };

    this.DynamicItems.prototype.fetchPage_ = function(pageNumber) {

      this.loadedPages[pageNumber] = null;

      var that = this
      var pageOffset = pageNumber * this.PAGE_SIZE;
      $http.get('api/PostAll', {
        params:{
          offset:pageOffset,
          text: this.text
        },
        headers: {
          token: localStorage.getItem("id")
        }
      })
        .then(function(promise) {
          that.loadedPages[pageNumber] = promise.data.result;
          });
    };

    this.DynamicItems.prototype.fetchNumItems_ = function() {
      var that = this;
      this.dataFollows.getLength(this.id,0,this.text)
        .then(numPosts=>{
          that.numItems = numPosts.length
        })
      //this.numItems = 50000;

    };
    this.allPublicPosts = new this.DynamicItems("all",friendsService.dataFollow)




    this.scope.procent = function(post){
      return parseInt((post.yes/((post.no+post.yes)/100)).toString(),10)
    }

    this.activate($timeout, webDevTec);
    this.scope.testFol = function (user){
      if(!user.follows[0]){

        return true;
      } else if(!user.check[0]){
        return true;
      } else {
        return false;
      }
    }
  }


addFace(person,post){
    if (String(person.id)=== post.idUser) {
        return person.face;
    }
}
  activate($timeout, webDevTec) {
    this.getWebDevTec(webDevTec);
    $timeout(() => {
      this.classAnimation = 'rubberBand';
    }, 4000);
    this.getMydata(webDevTec);

  }
  takeMyReactions() {
    var that = this;
    this.Mydata.takeReacions().then(res=>{
      that.myReaction = res;
      }
    )
  }

  getWebDevTec(webDevTec) {
    this.awesomeThings = webDevTec.getTec();

    angular.forEach(this.awesomeThings, (awesomeThing) => {
      awesomeThing.rank = Math.random();
    });
  }
  getMydata(webDevTec){
    this.myfirstsService = webDevTec.getYesNodata();
    this.TablePerson = webDevTec.getdata();
    angular.forEach(this.myfirstsService, (cont) => {
      cont.rank = Math.random();
    })
  }
  getReaction(reaction,posts){
    posts.reactions.push({reaction:"true"})
    if(reaction==0){
      posts.no++;
    } else posts.yes++;

     this.Mydata.getReaction(reaction, posts,0).then(res=>{
       posts.percent = res.percent
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
  testCh(info){
    if(info==false){
      this.testC1=true
      this.toastr.info('Вы отписались на');
    } else{
      this.testC1=false
      this.toastr.info('Вы подписались на');
    }
    this.testC=info

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
  addName(person,post){
    if (String(person.id) === post.idUser) {
        return person.login;
    }
}

  showToastr() {
    this.toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
    this.classAnimation = '';
  }
  deleteFollows(post){

    let that = this;
    this.UserAction.DeleteFollow(post.idUser).then(res=>{
      this.res = res;
      that.allPublicPosts.loadedPages={};
    })
    post.User.follows[0]=null
  }
  showFollows(post){
    let that = this;
     that.allPublicPosts.loadedPages={}
    post.User.follows[0]=1
    this.UserAction.Follow(post.idUser).then(res =>{
      that.res = res;
      if(res == "ok"){
        this.toastr.info('Follow')
        that.toastr.info('Forkbdf <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
      }
    })
  }
  search(text){
    this.allPublicPosts=null
    this.allPublicPosts = new this.DynamicItems("all",this.friendsService.dataFollow,text)
    this.showPost=1;
  }

}
