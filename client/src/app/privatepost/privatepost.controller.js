export class PrivatePostCtrl {
  constructor(privatePostService) {
    'ngInject';
    this.Hello = "hello1";
     this.posts = privatePostService.PrivateData;
     let that = this;
     this.dataPosts = 1;
     this.posts.getData()
       .then(res=>{
         that.dataPosts = res;
       })
  }
}
