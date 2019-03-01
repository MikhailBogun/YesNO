export function routerConfig ($stateProvider, $urlRouterProvider,$locationProvider, $urlMatcherFactoryProvider) {
  'ngInject';
  $urlMatcherFactoryProvider.caseInsensitive(true);
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'app/main/views/main.html',
      controller: 'MainController',
      controllerAs: 'main'
    })
    .state('follows',{
      url:'/follows',
      templateUrl: 'app/friend/views/friend.html',
      controller:'FriendController',
      controllerAs:'friend',
      // resolve: {
      //
      // }
    })
    .state('registr',{
    url:'/registration',
    templateUrl: 'app/Registration/views/registration.html',
    controller:'RegistrationController',
    controllerAs:'reg'
  })
    .state('addPost',{
      url:'/addPost',
      templateUrl: 'app/addPost/views/addPost.html',
      controller:'addPostController',
      controllerAs:'addPost'
    })
    .state('authorization',{
      url:'/',
      templateUrl: 'app/authorization/views/authorization.html',
      controller:'AuthorizationController',
      controllerAs:'authorization'
    })
    .state('profile',{
      url:'/profile',
      templateUrl: 'app/profile/views/profile.html',
      controller:'ProfileController',
      controllerAs:'profile'
    })
    .state('privatePost',{
      url:'/privatepost',
      templateUrl: 'app/privatepost/views/privatepost.html',
      controller:'PrivatePostController',
      controllerAs:'privatePost'
    })
  $urlRouterProvider.otherwise('/');

  // $locationProvider.html5Mode(true);
}
