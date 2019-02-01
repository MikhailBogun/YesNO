export function Menubar() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/components/menubar/menubar.html',
    scope: {
      creationDate: '='
    },
    controller: NavbarController,
    controllerAs: 'vm',
    bindToController: true
  };

  return directive;
}
