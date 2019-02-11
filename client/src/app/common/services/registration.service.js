export function RegistrationService($http, $location) {
  'ngInject';
  return {
    Mydata: {

      getUser: function(data){
        return $http.post('registration/', {
          login: data.login,
          password: data.password,
          email: data.email
        }).then(res =>{

            localStorage.setItem("id",res.data.token)
            $location.path('/home');

          })
          .catch(err=>{
            return err;
          })

      }
    }
  }
}
