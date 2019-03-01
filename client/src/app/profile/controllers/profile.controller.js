export class ProfileController {
  constructor($http, mainService, friendsService, $mdDialog, $document) {
    'ngInject'
    var vm = this;
    vm.checkToken = mainService.checkAuth.checkToken();
    vm.http = $http;
    vm.document = $document;
    vm.dialog = $mdDialog;
    vm.info = {};
    vm.face = {};


    vm.mainService = mainService;
    vm.mainService.Mydata.getMyImageFace().then(face => {
      vm.myFace = face.pathImg;
    })
    ///localStorage.setItem('mykey','myvalue');
    vm.checkMenu = 0;
    vm.DynamicItems = function (data, privPosts) {
      this.loadedPages = {};
      this.private = privPosts;
      this.myPosts = data.myPosts;
      this.data = data;
      this.numItems = 0;
      this.PAGE_SIZE = 5;
      this.fetchNumItems_();
      this.check = []
    };

    this.DynamicItems.prototype.getItemAtIndex = function (index) {
      var pageNumber = Math.floor(index / this.PAGE_SIZE);
      var page = this.loadedPages[pageNumber];
      if (page) {
        return page[index % this.PAGE_SIZE];
      } else if (page !== null) {
        this.fetchPage_(pageNumber);
      }
    };

    this.DynamicItems.prototype.getLength = function () {
      return this.numItems;
    };

    this.DynamicItems.prototype.fetchPage_ = function (pageNumber) {
      this.loadedPages[pageNumber] = null;
      var that = this
      var pageOffset = pageNumber * this.PAGE_SIZE;
      friendsService.dataFollow.getPersonPosts(pageOffset, null, this.private).then(posts => {
        that.loadedPages[pageNumber] = posts.result;
      })
      // this.myPosts(pageOffset,null,this.private).then(posts=>{
      //   that.loadedPages[pageNumber] = posts.result;
      // })

    };

    this.DynamicItems.prototype.fetchNumItems_ = function () {
      this.data.lengthmyPosts(this.private)
        .then(numPosts => {
          this.numItems = numPosts.length
        });
    };
    vm.allPublicPosts = new vm.DynamicItems(mainService.Mydata, 0)
  }

  submit() {


    this.info.id = localStorage.getItem("id");
    this.http.put('api/removePassword', this.info, {
      headers: {
        token: localStorage.getItem("id")
      }
    })
      .then(res => {
        this.info = {};

      })
      .catch(error => {
        if (error.status === 401) {
          this.dialog.show(
            this.dialog.alert()
              .clickOutsideToClose(true)
              .title('Ошибка')
              .textContent(error.data)
              .ariaLabel('Left to right demo')
              .ok('Понял!')
              // You can specify either sting with query selector
              .openFrom('#left')
              // or an element
              .closeTo(angular.element(this.document[0].querySelector('#right')))
          );
          this.info = {};
        }
      });
  }

  removeFace() {
    var formData = new FormData;
    formData.append("id", localStorage.getItem("id"));
    for (var data in this.face) {
      formData.append(data, this.face[data]);
      this.mainService.UsersAction.newFace(formData).then(res => {
        this.myFace = res;
        this.dataUsers = {};
      })
    }
  }

  DeletePost(post) {
    this.mainService.Mydata.deletePosts(post).then(res => {
      if (res == "OK") {
        this.allPublicPosts.loadedPages = {}

      }
    });
  }

  PageContect(value) {
    this.checkMenu = value;
    if (value == 2) {
      this.allPublicPosts = new this.DynamicItems(this.mainService.Mydata, 1)
    } else if (value == 1) {
      this.allPublicPosts = new this.DynamicItems(this.mainService.Mydata, 0)
    }
  }
}
