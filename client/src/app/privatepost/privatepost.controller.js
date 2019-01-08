export class PrivatePostCtrl {
  constructor($scope,privatePostService, mainService) {
    'ngInject';
    this.Hello = "hello1";
    this.scope = $scope;
     this.posts = privatePostService.PrivateData;
     let that = this;
     this.dataPosts = "";
    this.myReaction ="";
    this.Mydata = mainService.Mydata;
     this.posts.getData()
       .then(res=>{
         that.dataPosts = res;
       })
  }
  getReaction(reaction,posts){
    var that = this;
    that.cheack = reaction;
    this.cheack1 =posts;
    this.Mydata.getReaction(reaction, posts).then(res=>{
      that.myReaction = res;
    });
  }
  checkReaction(id){
    for(let i = 0; i<this.myReaction.length;i++){
      if(id == this.myReaction[i].idPost) {
        return false;
      }
    }
    return true;
  }
  checkMyReaction(post){
    for(let i = 0; i<this.myReaction.length;i++){
      if(post.id == this.myReaction[i].idPost) {
        this.scope.count = parseInt((post.yes/((post.no+post.yes)/100)).toString(),10)
        return true;
      }
    }
    return false;
  }
}
