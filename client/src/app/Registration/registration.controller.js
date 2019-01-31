export class RegistrationController {
  constructor(registration,$mdDialog){
    'ngInject'
    var that =this;
    this.dataUsers={}
     this.Mydata = registration.Mydata;
    this.dialog= $mdDialog
    this.show=1;

    // this.Mydata.getData().then(res=>{
     //   that.info = res;
     // });


  }

  submit() {
    var that = this;

    this.Mydata.getUser(this.dataUsers).then(res => {
        that.ret = res;
      if(typeof res !=='undefined') {
        that.dialog.show(
          that.dialog.alert()
            .clickOutsideToClose(true)
            .title('Ошибка')
            .textContent("Этот мыло уже лежит у нас на складе!")
            .ariaLabel('Left to right demo')
            .ok('Понял!')
            // You can specify either sting with query selector
            .openFrom('#left')
            // or an element
            .closeTo(angular.element(document.querySelector('#right')))
        )
      }
      }
    )

    // this.http.post('http://localhost:8000/registration_user', this.dataUsers)
    //   .then(function(res){
    //       this.res = res;
    //       this.dataUsers=null;
    //     },
    //     function(error){
    //       this.error =error;
    //     });

  }
  forgotPass(){
    this.show=0
  }
}
