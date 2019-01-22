export function MainService($http){

  'ngInject';
  return {
    Mydata: {

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
        })
          .then(
            res =>{return res.data}
          )
      }

    },
    UsersAction: {
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
