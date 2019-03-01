export class addPostController {
  constructor($document, $http, addPostService, $scope,$location, mainService) {
    'ngInject'
    var vm = this;
    vm.checkToken = mainService.checkAuth.checkToken()
    vm.document = $document;
    vm.addPost = addPostService.addData;
    vm.http = $http;
    vm.dataUsers = {};
    vm.checkbox = false;
    vm.socket = io.connect($location.$$absUrl);

    $scope.$on('$locationChangeStart', function (event, newUrl, oldUrl) {
      if (oldUrl.slice(oldUrl.lastIndexOf("/") + 1) == "addPost") {
        vm.socket.emit("leave", {token: localStorage.getItem('id')});
        vm.socket.disconnect();
      }
    });
  }

  submit() {
    var formData = new FormData;
    var vm = this;

    for (var data in this.dataUsers) {
      formData.append(data, this.dataUsers[data]);
    }
    formData.append("id", localStorage.getItem("id"));

    if (this.checkbox == false) {
      formData.append("private", 0);
      vm.socket.emit('addPost', {token: localStorage.getItem("id")});
    } else {
      formData.append("private", 1);
      vm.socket.emit("addPrivatePost", {token: localStorage.getItem('id')});

    }
    this.addPost.addPublicPost(formData).then(res => {
      vm.res = res;
      vm.dataUsers = {};
      vm.document[0].getElementById("fileup").value = null;
    })
  }


}
