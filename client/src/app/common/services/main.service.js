export function MainService($http){

  'ngInject';

  return {
    Mydata: {
      socket: function(url){
        var socket = io.connect(url);
        return socket;
      },
      getPosts: function(offset, text){
        return $http.get('api/PostAll', {
          params:{
            offset:offset,
            text: text
          },
          headers: {
            token: localStorage.getItem("id")
          }
        })
          .then(function(promise) {
            return promise.data
          });
      },

      deletePosts: function(post){
        return $http.delete('api/deletePost'+post.id, {
          headers:{
            token:localStorage.getItem(("id"))
          }
        })
          .then(res=>{
            return res.data;
          })
      },

      myPosts: function(priv,offset){
        return $http.get('api/myPosts',{
          params:{
            offset:offset,
            private:priv
          },
          headers: {
            token: localStorage.getItem("id")
          }
        })
          .then(
            res =>{return res.data}
          );
      },
      getMyImageFace: function(){
        return $http.get('api/getMyImage',{
          headers: {
            token: localStorage.getItem("id")
          }
        })
          .then(
            res =>{return res.data}
          );
      },

      lengthmyPosts: function(priv){
        return $http.get('api/lengthRowsMyPosts',{
          params:{
            private:priv
          },
          headers: {
            token: localStorage.getItem("id")
          }
        })
          .then(
            res =>{return res.data}
          );
      },

      getData: function () {
        return $http.get('api/PostAll',{
          headers: {
            id: localStorage.getItem("id")
          }
        })
          .then(
            res =>{return res.data}
          );
      },
      getUsers: function(){
        return $http.get('api/users')
          .then(
            res =>{return res.data}
          )
      },
      takeReacions: function () {
        return $http.post('api/myReactions',{
          id:localStorage.getItem(("id"))
        })
          .then(
            res => {
              return res.data
            }
          );
      },
      getReaction: function(reaction,posts,pr){
        return $http.post('api/getReaction',{
            reaction:reaction,
            post: posts,
            private:pr,
            id: localStorage.getItem(("id"))
        },{
          headers:{
            token: localStorage.getItem(("id"))
          }
        })
          .then(
            res =>{return res.data}
          )
      }

    },
    UsersAction: {

      rewritePass: function(newPass){
        return $http.post('forget/newPass',newPass)
          .then(res =>{
            return res.data;
          })
      },

      newFace: function(formData){
        return $http.put('api/removeFace',formData,{
          transformRequest: angular.identity,
          headers: {
            token: localStorage.getItem("id"),
            'Content-Type':undefined
          }
        }).then(res=>{
          return res.data;
        })
      },

      Follow: function (idUser){
        return $http.post('api/follow',{
          follows:idUser,
          id: localStorage.getItem(("id"))},{
          headers: {
            token: localStorage.getItem("id")
          }
        })
          .then(res =>{
            return res.data;
          })

      },
      DeleteFollow: function(followId){
        return $http.delete('api/follow/delete'+ followId, {
          headers:{
            token:localStorage.getItem(("id"))
          }
        })
          .then(res=>{
            return res.data;
          })
      },
      getFriend: function(){
        return $http.get('api/friends',{
          headers: {
            token: localStorage.getItem("id")
          }
        })
          .then(res => {
            return res.data;
          })
      }
    }
  }
}
