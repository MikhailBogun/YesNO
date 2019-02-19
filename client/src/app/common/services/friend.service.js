export class FriendsService{
  constructor ($http){
    'ngInject';
    var vm = this;
    vm.http = $http;
    $http.get('api/follow',{headers:{
        token: localStorage.getItem("id")
    }})
      .then(function(promise) {
          //vm.data=success.data;
          vm.promise = promise.data;
        },
        function(error) {
          vm.promise = error;
        });
    vm.senk = function(){
      return "hello";
    };

    vm.dataFollow={
      getOnlyFriend: function (offset,id){
        return $http.get('api/onlyFriends',{
          params:{
            offset:offset,
            id:id
          },
          headers:{
            token: localStorage.getItem("id")
          }
        }).then(res=>{
          return res.data;
        })
      },
      showFriends: function (offset){
        return $http.get('api/showFriends',{
          params:{
            offset:offset
          },
          headers:{
            token: localStorage.getItem("id")
          }
        }).then(res=>{
          return res.data;
        })
      },
      getmyFriends: function (offset,searchText,relationship){
        return $http.get('api/showFriends',{
          params:{
            offset:offset,
            text:searchText,
            relationship:relationship
          },
          headers:{
            token: localStorage.getItem("id")
          }
        }).then(res=>{
          return res.data;
        })
      },
      friend: function (offset,relationship){
      return $http.get('api/test',{
        params:{
          offset:offset,
          relationship:relationship
        },
        headers:{
          token: localStorage.getItem("id")
        }
      }).then(res=>{
        return res.data;
      })
    },
      getPersonPosts: function(offset,id,priv=0){
        return $http.get('api/OnePersonPosts',{
          params:{
            id:id,
            offset:offset,
            private:priv
          },
          headers:{
            token: localStorage.getItem("id")
          }
        }).then(res=>{
          return res.data;
        })
      },
      getLength: function(id,privatePost,text=null){
        return $http.get('api/getLengthRows',{
          params:{
            id:id,
            private:privatePost,
            text:text
          },
          headers:{
            token: localStorage.getItem("id")
          }
        }).then(res=>{
          return res.data;
        })
      }
      }


    vm.data = [
      {
        'id':'1000',
        'myFriend': ["1001","1002"]
      }
    ]
  }
   getFriends() {
    return this.data;
  }
  returnFriend(){
    return this.http.get('api/friends',{
      headers:{
        token: localStorage.getItem("id")
      }
    })
      .then(res => {
        return res.data;
      })
  }
  getPersonPosts(id){
    return this.http.get('api/OnePersonPosts'+id,{
      headers:{
        token: localStorage.getItem("id")
      }
    }).then(res=>{
      return res.data;
    })
  }



  Test(offset){
    return this.http.get('api/test',{
      params:{
        offset:offset
      },
      headers:{
        token: localStorage.getItem("id")
      }
    }).then(res=>{
      return res.data;
    })
  }

}

