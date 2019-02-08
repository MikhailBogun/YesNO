export class RegistrationController {
  constructor(registration,$mdDialog,$document){
    'ngInject'
    var vm = this;
    vm.document = $document
    vm.dataUsers={}
     vm.Mydata = registration.Mydata;
    vm.dialog= $mdDialog
    vm.show=1;

    vm.submit = function() {


      vm.Mydata.getUser(vm.dataUsers).then(res => {
          vm.ret = res;
          if(typeof res !=='undefined') {
            vm.dialog.show(
              vm.dialog.alert()
                .clickOutsideToClose(true)
                .title('Ошибка')
                .textContent("Этот мыло уже лежит у нас на складе!")
                .ariaLabel('Left to right demo')
                .ok('Понял!')
                // You can specify either sting with query selector
                .openFrom('#left')
                // or an element
                .closeTo(angular.element(vm.document[0].querySelector('#right')))
            )
          }
        }
      )

    }
    vm.forgotPass = function(){
      vm.show=0
    }

  }

}
