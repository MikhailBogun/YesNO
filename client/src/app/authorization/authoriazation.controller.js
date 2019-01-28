export class authorization {
  //localStorage.setItem('mykey','myvalue');
  constructor($http,$location,$mdDialog) {
    'ngInject'
    this.http = $http;
    this.location =$location;
    this.dialog= $mdDialog
  }
  submit(){
    var that = this;

    this.http.post('authorization/', this.Users)
      .then(function(res){
        that.res = res;
        if (res.data!="") {
          localStorage.clear()
          localStorage.setItem("id",res.data.token)
          that.location.path('/home')
        }
        that.Users={};
      })
      .catch(function(error){
        that.error =error;
        console.log(error)
        that.textContent = "";
        if(error.status==500){

          that.textContent= " Ошибка сервера! Пожалуйсто повторите немного позже";
        } else if(error.status==401){
          that.textContent='Вы вели неправильный пароль! Повторите еще раз'
        } else if(error.status==404)
        {
          that.textContent='Неправильно введен пароль либо еmail! Повторите еще раз'

        }
        that.dialog.show(
          that.dialog.alert()
            .clickOutsideToClose(true)
            .title('Ошибка')
            .textContent(that.textContent)
            .ariaLabel('Left to right demo')
            .ok('Понял!')
            // You can specify either sting with query selector
            .openFrom('#left')
            // or an element
            .closeTo(angular.element(document.querySelector('#right')))
        )

      });
  }
}
