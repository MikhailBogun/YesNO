export function privatePostService($http) {

  'ngInject';
  return {
    PrivateData: {
      getData: function () {
        return $http.get('api/PrivateData',{
        headers:{token:localStorage.getItem(("id"))}})
          .then(
            res => {
              return res.data
            }
          );
      }

    }
  }
}

