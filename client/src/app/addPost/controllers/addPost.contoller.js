export class addPostController {
  constructor($document,$http,addPostService,$scope){
    'ngInject'
    var vm = this;
    vm.document = $document
    vm.addPost = addPostService.addData;
    vm.http = $http;
    vm.dataUsers={};
    vm.checkbox = false;
    vm.socket = io.connect("http://localhost:8000/");

    $scope.$on('$locationChangeStart', function(event, newUrl, oldUrl) {
      console.log(oldUrl.slice(oldUrl.lastIndexOf("/") + 1) == "addPost")
      if (oldUrl.slice(oldUrl.lastIndexOf("/") + 1) == "addPost") {
        console.log("dissssssss")
        vm.socket.emit("leave", {token: localStorage.getItem('id')})
        vm.socket.disconnect()

      }
    })

  }
  submit() {
    var formData = new FormData;
    var vm = this;

    for (var data in this.dataUsers) {
      formData.append(data, this.dataUsers[data]);
    }
    formData.append("id", localStorage.getItem("id"));
    vm.ll = formData;
    if (this.checkbox == false) {
      formData.append("private", 0);
      vm.socket.emit('addPost', { token: localStorage.getItem("id") });
    }
    else {
      formData.append("private", 1);
      vm.socket.emit("addPrivatePost",{token:localStorage.getItem('id')});




    }
    this.addPost.addPublicPost(formData).then(res=>{
      vm.res = res;
      vm.dataUsers = {}

      // vm.socket.emit("addPrivatePost",{token:localStorage.getItem('id')});
      // socket.emit('addPost', { token: localStorage.getItem("id") });
      vm.document[0].getElementById("fileup").value = null
    })
  }


}
