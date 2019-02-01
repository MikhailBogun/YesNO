export class ProfileCtrl {
  constructor($http,mainService){
    'ngInject'
    this.http = $http;
    this.hello ="hello World!";
    this.info={};
    this.face={};
    this.mainService=mainService;
    ///localStorage.setItem('mykey','myvalue');
    this.checkMenu = 0;
    this.DynamicItems = function(data,privPosts) {
      this.loadedPages = {};
      this.private=privPosts
      this.myPosts=data.myPosts
      this.data=data
      this.numItems = 0;


      this.PAGE_SIZE = 5;

      this.fetchNumItems_();
      this.check = []
    };

    // Required.
    this.DynamicItems.prototype.getItemAtIndex = function(index) {

      var pageNumber = Math.floor(index / this.PAGE_SIZE);
      var page = this.loadedPages[pageNumber];
      if (page) {
        return page[index % this.PAGE_SIZE];
      } else if (page !== null) {
        this.fetchPage_(pageNumber);
      }
    };

    // Required.
    this.DynamicItems.prototype.getLength = function() {
      return this.numItems;
    };

    this.DynamicItems.prototype.fetchPage_ = function(pageNumber) {

      this.loadedPages[pageNumber] = null;

      var that = this
      var pageOffset = pageNumber * this.PAGE_SIZE;

      this.myPosts(this.private,pageOffset).then(posts=>{
        that.loadedPages[pageNumber] = posts.result;
      })

    };

    this.DynamicItems.prototype.fetchNumItems_ = function() {
      var that = this;
      this.data.lengthmyPosts(this.private)
        .then(numPosts=>{
          that.numItems = numPosts.length
        })
      //this.numItems = 50000;

    };
    this.allPublicPosts = new this.DynamicItems(mainService.Mydata,0)
  }
  submit(){



    this.info.id = localStorage.getItem("id");
    this.http.post('api/removePassword', this.info)
      .then(function(res){
        this.res = res;
        this.info={};
      })
      .catch(function(error){
        this.error =error;
      });

  }

  removeFace(){
    let formData= new FormData;
    formData.append("id",localStorage.getItem("id"));
    for (var data in this.face){
      formData.append(data, this.face[data]);
      this.http.post('api/removeFace', formData,{
        transformRequest: angular.identity,
        headers: {
          token: localStorage.getItem("id"),
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
  DeletePost(post){
    this.mainService.Mydata.deletePosts(post).then(res=>{
      if(res.status==200)
          post = null
    })
  }
  PageContect(value){
    this.checkMenu=value;
    if(value==2){
      this.allPublicPosts = new this.DynamicItems(this.mainService.Mydata,1)
    } else if(value==1){
      this.allPublicPosts = new this.DynamicItems(this.mainService.Mydata,0)
    }
}
}
