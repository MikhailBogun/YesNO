export function routerConfig ($stateProvider, $urlRouterProvider,$locationProvider, $urlMatcherFactoryProvider) {
  'ngInject';
  $urlMatcherFactoryProvider.caseInsensitive(true);
  $stateProvider
    .state('home', {
      url: '/home',
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
    .state('registr',{
    url:'/hhhhh',
    templateUrl: 'app/Registration/registration.html',
    controller:'RegistrationController',
    controllerAs:'reg'
  })
    .state('addPost',{
      url:'/addPost',
      templateUrl: 'app/addPost/addPost.html',
      controller:'addPostController',
      controllerAs:'addPost'
    })
    .state('authorization',{
      url:'/',
      templateUrl: 'app/authorization/authorization.html',
      controller:'authorization',
      controllerAs:'authorization'
    })
    .state('profile',{
      url:'/profile',
      templateUrl: 'app/profile/profile.html',
      controller:'ProfileCtrl',
      controllerAs:'profile'
    })
    .state('privatePost',{
      url:'/privatepost',
      templateUrl: 'app/privatepost/privatepost.html',
      controller:'PrivatePostCtrl',
      controllerAs:'privatePost'
    })
  $urlRouterProvider.otherwise('/');
  $locationProvider.html5Mode(true);
}
