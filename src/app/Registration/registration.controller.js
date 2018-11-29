export class RegistrationController {
  constructor(registration, $scope){
    'ngInject'
    this.Hello = "Hello";
    this.data=registration.getData();
    this.registr=[]
  }
  RegPost(login, password) {
    this.registr.push(login);
    this.registr.push(password);
    console.log("Hello");
  }
}
