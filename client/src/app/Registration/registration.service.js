export function RegistrationService($http, $location) {
  'ngInject';
  return {
    Mydata: {

      getData: function () {
        return $http.get('api/PostAll')
          .then(
            res =>{return res.data}
          );
      },

      getUser: function(data){
        return $http.post('api/registration_user', {
          login: data.login,
          password: data.password
        }).then(res =>{

            localStorage.setItem("id",res.data.token)
            $location.path('/home');

          })
      }
    }
  }
}
