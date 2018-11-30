export class RegistrationController {
  constructor(registration, $scope, $http){
    'ngInject'
    var that =this;
    this.Hello = "Hello";
    this.data=registration.getData();
    this.MyData=["siski"];
    this.dataUsers={}

    this.http = $http;
    this.scope=$scope;
    // this.submit=function(){
    //   var formData= new FormData;
    //
    //   this.http.post('http://localhost:8000/registration_user', this.dataUsers)
    //     .then(function(res){
    //       that.res = res;
    //       this.dataUsers={};
    //       },
    //       function(error){
    //         that.error =error;
    //       });
    //
    // }
  }

  submit(){
    var formData= new FormData;

    this.http.post('http://localhost:8000/registration_user', this.dataUsers)
      .then(function(res){
          this.res = res;
          this.dataUsers={};
        },
        function(error){
          this.error =error;
        });

  }
}
