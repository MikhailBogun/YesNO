export class addPostController {

  constructor($http){
    'ngInject'
    this.http = $http;
    this.hello ="hello World!";
    this.dataUsers={};
  }
  submit(){
    var formData= new FormData;

    for (var data in this.dataUsers){
      formData.append(data, this.dataUsers[data]);
    }

     this.http.post('http://localhost:8000/addPost', formData,{
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
