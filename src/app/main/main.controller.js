export class MainController {
  constructor ($timeout, webDevTec,mainService, toastr, $http) {
    'ngInject';
    let that = this;
    $http.get('api/PostAll')
      .then(function(promise) {
          //this.data=success.data;
          that.promise = promise.data.reverse();

        },
        function(error) {
          this.promise = error;
        });
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

    this.activate($timeout, webDevTec);
  }


addFace(person,post){
    if (String(person.id)=== post.voted) {
        return person.face;
    }
}
  activate($timeout, webDevTec) {
    this.getWebDevTec(webDevTec);
    $timeout(() => {
      this.classAnimation = 'rubberBand';
    }, 4000);
    this.getMydata(webDevTec);
    this.takeMyReactions();
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
     this.Mydata.getReaction(reaction, posts).then(res=>{
       that.myReaction = res;
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
        // let count = dataNo.length+dataYes.length;
        // let countOne = dataYes.length/((dataNo.length+dataYes.length)/100);
        this.count = parseInt((post.yes/((post.no+post.yes)/100)).toString(),10)
        return true;
      }
    }
    return false;
  }
  addName(person,post){
    if (String(person.id) === post.voted) {
        return person.login;
    }
}
  showToastr() {
    this.toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
    this.classAnimation = '';
  }
  showFollows(person,post){
    let that = this;
    //this.toastr.info('Follow ' +person.login);
    this.p = person;
    this.post=post;
    this.UserAction.Follow(person,post).then(res =>{
      that.res = res;
      if(res == "ok"){
        this.toastr.info('Follow',+ person.login)
      }
    })
  }

}
