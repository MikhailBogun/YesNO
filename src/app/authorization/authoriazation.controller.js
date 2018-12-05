export class authorization {
  //localStorage.setItem('mykey','myvalue');
  constructor($http,$location) {
    'ngInject'
    this.http = $http;
    this.hello = "hello World!";
    this.Users={}
    this.res="hello";
    this.location =$location;
  }
  submit(){
    var that = this;

    this.http.post('/api/authorization', this.Users)
      .then(function(res){
        that.res = res;
        if (res.data!="") {
          localStorage.clear()
          localStorage.setItem("id",res.data.token)
          that.location.path('/home')
        }
        this.Users={};
      })
      .catch(function(error){
        this.error =error;
      });
  }
}
