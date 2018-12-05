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
    this.awesomeThings = [];
    this.classAnimation = '';
    this.creationDate = 1542888925003;
    this.toastr = toastr;

    this.myfirstsService = []
    this.TablePerson = [];
    this.Mydata = mainService.Mydata;
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
  addName(person,post){
    if (String(person.id) === post.voted) {
        return person.login;
    }
}
  showToastr() {
    this.toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
    this.classAnimation = '';
  }
  showFollows(person){
    this.toastr.info('Follow ' +person);
  }

}
