export class addPostController {
  //localStorage.setItem('mykey','myvalue');
  constructor($document,$http,addPostService){
    'ngInject'
    this.addPost = addPostService.addData;
    this.http = $http;
    this.hello ="hello World!";
    this.dataUsers={};
    this.checkbox = false
    ///localStorage.setItem('mykey','myvalue');
  }
  submit() {
      let that = this;
      var formData = new FormData;

      for (var data in this.dataUsers) {
        formData.append(data, this.dataUsers[data]);
      }
      formData.append("id", localStorage.getItem("id"));
      that.ll = formData;
    if (this.checkbox == false) {
      formData.append("private", 0);
      this.addPost.addPublicPost(formData).then(res=>{
        that.res = res;
        that.dataUsers = {}

        document.getElementById("fileup").value = null
      })

    }
    else {
      formData.append("private", 1);
      this.addPost.addPrivatePost(formData).then(res=>{
        that.res = res;
        that.dataUsers = {}
      })


    }
  }
}
