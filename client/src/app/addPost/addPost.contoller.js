export class addPostController {
  //localStorage.setItem('mykey','myvalue');
  constructor($document,$http,addPostService){
    'ngInject'
    this.addPost = addPostService.addData;
    this.document = $document
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
      this.addPost.addPublicPost(formData).then(res=>{
        that.res = res;
        that.dataUsers = {}
        this.document.getElementById("fileUpload").value = null
      })

    }
    else {
      this.addPost.addPrivatePost(formData).then(res=>{
        that.res = res;
        that.dataUsers = {}
      })


    }
  }
}
