
export function fileModel($parse, $document) {
  'ngInject';

  let directive =  {
    restrict: 'A',
    link: function (scope, element, attrs) {

      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;
      element.bind('change', function () {
        scope.$apply(function () {
          modelSetter(scope, element[0].files[0]);
          var img = $document[0].createElement("img");
          img.src = URL.createObjectURL(element[0].files[0]);
          $document[0].querySelector('#preview').removeAttribute(img)
          // $document[0].querySelector('#preview').appendChild(img);
        })
      });

    }
  }
  return directive;
}
