export function MainService($http){

  'ngInject';
  return {
    Mydata: {

      getData: function () {
        return $http.get('api/PostAll')
          .then(
            res =>{return res.data}
          );
      },
      getUsers: function(){
        return $http.get('api/users')
          .then(
            res =>{return res.data}
          )
      }

    },
    UsersAction: {
      Follow: function (person,post){
        return $http.post('api/follow',{
          person,
          post,
          id: localStorage.getItem(("id"))})
          .then(res =>{
            return res.data;
          })

      },
      getFriend: function(){
        return $http.post('api/friends',{
          id:localStorage.getItem('id')
        })
          .then(res => {
            return res.data;
          })
      }
    }
  }
}
