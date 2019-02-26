export class AuthorizationController {
  //localStorage.setItem('mykey','myvalue');
  constructor($http, $location, $mdDialog, mainService, $document) {
    'ngInject'
    var vm = this;
    var socket = io.connect("http://localhost:3000/");
    socket.on('news', function (data) {
      console.log(data);
      socket.emit('my other event', {my: 'data'});
    });
    vm.document = $document;
    vm.service = mainService.UsersAction
    vm.http = $http;
    vm.location = $location;
    vm.dialog = $mdDialog;
    vm.show = 1;
    vm.showNewPass = 0;
    vm.emailGetCode = {};
    vm.newPass = {};



  }

  submit() {
    var vm = this;

    this.http.post('authorization/', this.Users)
      .then(function (res) {
        vm.res = res;
        if (res.data != "") {
          localStorage.clear()
          localStorage.setItem("id", res.data.token)
          vm.location.path('/home')
        }
        vm.Users = {};
      })
      .catch(function (error) {
        vm.error = error;
        vm.textContent = "";
        if (error.status == 500) {
          vm.textContent = " Ошибка сервера! Пожалуйсто повторите немного позже";
        } else if (error.status == 401) {
          vm.textContent = 'Вы вели неправильный пароль! Повторите еще раз'
        } else if (error.status == 404) {
          vm.textContent = 'Неправильно введен пароль либо еmail! Повторите еще раз'
        }
        vm.dialog.show(
          vm.dialog.alert()
            .clickOutsideToClose(true)
            .title('Ошибка')
            .textContent(vm.textContent)
            .ariaLabel('Left to right demo')
            .ok('Понял!')
            // You can specify either sting with query selector
            .openFrom('#left')
            // or an element
            .closeTo(angular.element(vm.document[0].querySelector('#right')))
        )
      });
  }

  forgotPass() {
    this.show = 0;
  }

  getCode(email) {
    var vm = this;
    this.http.post('forget/', email)
      .then(function (res) {
        vm.showNewPass = 2;
        vm.resStatus = res.status;
        vm.newPass["email"] = email.email;
      })
      .catch(function (error) {
        vm.error = error;
        vm.textContent = "";
        if (error.status == 500) {

          vm.textContent = " Ошибка сервера! Пожалуйсто повторите немного позже";
        } else if (error.status == 404) {
          vm.textContent = 'Пользователь с таким email не зарегистрирован! Исправте ошибки и повторите еще раз'
        }
        vm.dialog.show(
          vm.dialog.alert()
            .clickOutsideToClose(true)
            .title('Ошибка')
            .textContent(vm.textContent)
            .ariaLabel('Left to right demo')
            .ok('Понял!')
            // You can specify either sting with query selector
            .openFrom('#left')
            // or an element
            .closeTo(angular.element(vm.document[0].querySelector('#right')))
        )
      });
  }

  refreshPass() {
    var vm = this;
    this.service.rewritePass(this.newPass).then(statusNewPass => {
      vm.showNewPass = 0;
      vm.show = 1;
      vm.statusNewPass = statusNewPass

    }).catch(error => {
      if (error.status == 500) {
        vm.textContent = " Ошибка сервера! Пожалуйсто повторите немного позже";
      }
      else if (error.status == 401) {
        vm.textContent = 'Вы вели неправильный код! Повторите еще раз'
      }

      vm.dialog.show(
        vm.dialog.alert()
          .clickOutsideToClose(true)
          .title('Ошибка')
          .textContent(vm.textContent)
          .ariaLabel('Left to right demo')
          .ok('Понял!')
          // You can specify either sting with query selector
          .openFrom('#left')
          // or an element
          .closeTo(angular.element(vm.document[0].querySelector('#right')))
      )
    })
  }
}
