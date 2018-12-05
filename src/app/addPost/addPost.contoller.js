export class addPostController {
  //localStorage.setItem('mykey','myvalue');
  constructor($http){
    'ngInject'
    this.http = $http;
    this.hello ="hello World!";
    this.dataUsers={};
    ///localStorage.setItem('mykey','myvalue');
  }
  submit(){
    var formData= new FormData;

    for (var data in this.dataUsers){
      formData.append(data, this.dataUsers[data]);
    }
    formData.append("id",localStorage.getItem("id"));

     this.http.post('api/addPost', formData,{
            transformRequest: angular.identity,
              headers: {
                'Content-Type':undefined
              }
      })
       .then(function(res){
           this.res = res;
           this.dataUsers={};
         })
       .catch(function(error){
           this.error =error;
         });

  }
}
