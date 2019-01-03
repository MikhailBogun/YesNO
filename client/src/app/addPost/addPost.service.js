export function addPostService($http){

  'ngInject';
  return {
    addData:{
      addPublicPost: function (formData) {
        return $http.post('api/addPost',formData, {
          transformRequest: angular.identity,
          headers: {
            'Content-Type': undefined
          }
        })
          .then(
            res => {
              return res.data
            }
          );
      },
      addPrivatePost: function (formData) {
        return $http.post('api/addPrivatePost',formData, {
          transformRequest: angular.identity,
          headers: {
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
