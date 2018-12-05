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

    }
  }
}
