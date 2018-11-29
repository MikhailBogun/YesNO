export function routerConfig ($stateProvider, $urlRouterProvider) {
  'ngInject';
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'app/main/main.html',
      controller: 'MainController',
      controllerAs: 'main'
    })
    .state('follows',{
      url:'/follows',
      templateUrl: 'app/friend/friend.html',
      controller:'FriendController',
      controllerAs:'friend'
    })
    .state('registration',{
    url:'/registration',
    templateUrl: 'app/Registration/registration.html',
    controller:'RegistrationController',
    controllerAs:'reg'
  })
  $urlRouterProvider.otherwise('/');
}
