export class FriendsService{
  constructor ($http){
    'ngInject';
    let that = this;
    this.http = $http;
    $http.get('api/follow',{headers:{
        token: localStorage.getItem("id")
    }})
      .then(function(promise) {
          //this.data=success.data;
          that.promise = promise.data;
        },
        function(error) {
          that.promise = error;
        });
    this.senk = function(){
      return "hello";
    };

    this.dataFollow={
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
      getmyFriends: function (offset,searchText){
        return $http.get('api/showFriends',{
          params:{
            offset:offset,
            text:searchText
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
      getPersonPosts: function(offset,id){
        return $http.get('api/OnePersonPosts',{
          params:{
            id:id,
            offset:offset
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


    this.data = [
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

