export class MainController {
  constructor ($log,$timeout,$scope, webDevTec,mainService, toastr, $http) {
    'ngInject';
    let that = this;
    this.log = $log;
    this.scope = $scope;
    this.scope.Go = "huilo"
    $http.get('api/PostAll', {
      headers: {
        token: localStorage.getItem("id")
      }
    })
      .then(function(promise) {
          //this.data=success.data;
          that.promise = promise.data;

        },
        function(error) {
          this.promise = error;
        });
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

    this.test = "123";
    this.Mydata.getUsers().then(res=>{
      that.info = res;
    });
    this.scope.procent = function(post){
      return parseInt((post.yes/((post.no+post.yes)/100)).toString(),10)
    }

    this.activate($timeout, webDevTec);
    this.scope.testFol = function (user){
      console.log(user)
      if(!user.follows[0]){
        console.log("1")
        return true;
      } else if(!user.check[0]){
        console.log("2")
        return true;
      } else {
        console.log("3")
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
    var that = this;
    that.cheack = reaction;
    this.cheack1 =posts;

    for(let j=0;j<this.promise.result.length;j++){
      if(this.promise.result[j]==posts){
       this.promise.result[j].reactions.push({reaction:"true"})
        if(reaction==0){
          this.promise.result[j].no++;
        } else this.promise.result[j].yes++;
      }
    }

     this.Mydata.getReaction(reaction, posts,0).then(res=>{
       that.scope.percent = res;
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
        // let count = dataNo.length+dataYes.length;
        // let countOne = dataYes.length/((dataNo.length+dataYes.length)/100);
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

    for(let j=0;j<this.promise.result.length;j++){
      if(this.promise.result[j]==post){
        this.promise.result[j].follows = false;
        this.c=post
      }
    }
    this.c
    this.UserAction.DeleteFollow(post.idUser).then(res=>{
      this.res = res;
    })
  }
  showFollows(person,post){
    let that = this;

    //this.toastr.info('Follow ' +person.login);
    this.p = person;
    this.post=post;
    for(let j=0;j<this.promise.result.length;j++){
      if(this.promise.result[j]==post){
        this.promise.result[j].follows = true;
      }
    }
    this.UserAction.Follow(person,post).then(res =>{
      that.res = res;
      this.toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
      if(res == "ok"){
        this.toastr.info('Follow',+ person.login)
        this.toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
      }
    })
  }

}
