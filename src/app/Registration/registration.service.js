export class  RegistrationService{
  constructor(){
    'ngInject';
    this.hello = "World!";
    this.data =  {
      user: {
        getUsers: function(userId){
          return $http.get("http://localhost:8000/PostAll" ).then(
            data => {return data.data}
          );
        }
      }
    }
  }
  getData(){
    return this.hello;
  }
  Data(){
    return this.data;
  }
}
