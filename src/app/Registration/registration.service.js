export class  RegistrationService{
  constructor(){
    'ngInject';
    this.hello = "World!";
  }
  getData(){
    return this.hello;
  }
}
