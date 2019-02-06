export class RegistrationController {
  constructor(registration,$mdDialog,$document){
    'ngInject'
    this.document = $document
    this.dataUsers={}
     this.Mydata = registration.Mydata;
    this.dialog= $mdDialog
    this.show=1;

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
            .closeTo(angular.element(that.document[0].querySelector('#right')))
        )
      }
      }
    )

  }
  forgotPass(){
    this.show=0
  }
}
