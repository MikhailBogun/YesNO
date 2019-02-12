export class addPostController {
  constructor($document,$http,addPostService){
    'ngInject'
    this.document = $document
    this.addPost = addPostService.addData;
    this.http = $http;
    this.dataUsers={};
    this.checkbox = false
  }
  submit() {
      var that = this;
      var formData = new FormData;

      for (var data in this.dataUsers) {
        formData.append(data, this.dataUsers[data]);
      }
      formData.append("id", localStorage.getItem("id"));
      that.ll = formData;
    if (this.checkbox == false) {
      formData.append("private", 0);
    }
    else {
      formData.append("private", 1);

    }
    this.addPost.addPublicPost(formData).then(res=>{
      that.res = res;
      that.dataUsers = {}

      var socket = io.connect("http://localhost:8000/");

        socket.emit('addPost', { token: localStorage.getItem("id") });
      that.document[0].getElementById("fileup").value = null
    })
  }
}
