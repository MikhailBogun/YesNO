export function privatePostService($http) {

  'ngInject';
  return {
    PrivateData: {
      getData: function () {
        return $http.get('api/PrivateData',{params: {
          id:localStorage.getItem(("id"))
        }})
          .then(
            res => {
              return res.data
            }
          );
      }

    }
  }
}

