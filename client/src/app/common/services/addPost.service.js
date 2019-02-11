export function addPostService($http){

  'ngInject';
  return {
    addData:{
      addPublicPost: function (formData) {
        return $http.post('api/addPost',formData, {
          transformRequest: angular.identity,
          headers: {
            token: localStorage.getItem("id"),
            'Content-Type': undefined
          }
        })
          .then(
            res => {
              return res.data
            }
          );
      }
    }
  }
}
