
export function fileModel($parse) {
  'ngInject';

  let directive =  {
    restrict: 'A',
    link: function (scope, element, attrs) {

      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;
      element.bind('change', function () {
        scope.$apply(function () {
          modelSetter(scope, element[0].files[0]);
        })
      })
    }
  }
  return directive;
}
