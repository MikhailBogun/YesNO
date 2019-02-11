/* global malarkey:false, moment:false */

import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { MainController } from './main/controllers/main.controller';
import { FriendController } from './friend/controllers/friends.controller';
import { RegistrationController } from './Registration/controllers/registration.controller';
import { addPostController } from './addPost/controllers/addPost.contoller';
import { ProfileController } from './profile/controllers/profile.controller';
import { PrivatePostController } from './privatepost/controllers/privatepost.controller';
import { AuthorizationController } from './authorization/controllers/authoriazation.controller.js';
import { GithubContributorService } from './components/githubContributor/githubContributor.service';
import { WebDevTecService } from './components/webDevTec/webDevTec.service';
import { FriendsService } from "./common/services/friend.service";
import { addPostService } from './common/services/addPost.service';
import { privatePostService } from './common/services/privatepost.service';
import { RegistrationService } from "./common/services/registration.service";
import { MainService } from "./common/services/main.service";
import { NavbarDirective } from './components/navbar/navbar.directive';
import { MalarkeyDirective } from './components/malarkey/malarkey.directive';
import { PostAllDirective } from '../app//common/directives/directivePostAll.directive';
import { ProgressBar } from '../app//common/directives/directiveProgressBarYesNo.directive';
import { fileModel } from '../app//common/directives/fileModel.directive';



angular.module('yesno', ['ngAnimate', 'ngCookies', 'ngSanitize', 'ngMessages', 'ngAria', 'ngResource', 'ui.router', 'toastr','ngMaterial'])
  .constant('malarkey', malarkey)
  .constant('moment', moment)
  .config(config)
  .config(routerConfig)
  .run(runBlock)
  .service('githubContributor', GithubContributorService)
  .service('webDevTec', WebDevTecService)
  .service('friendsService', FriendsService)
  .service('registration', RegistrationService)
  .service('mainService', MainService)
  .service('addPostService', addPostService)
  .service('privatePostService', privatePostService)
  .controller('MainController', MainController)
  .controller('FriendController', FriendController)
  .controller('addPostController', addPostController)
  .controller('RegistrationController', RegistrationController)
  .controller('AuthorizationController', AuthorizationController)
  .controller('PrivatePostController', PrivatePostController)
  .controller('ProfileController', ProfileController)
  .directive('acmeNavbar', NavbarDirective)
  .directive('acmeMalarkey', MalarkeyDirective)
  .directive('post', PostAllDirective)
  .directive('prbar', ProgressBar)
  .directive('fileModel', fileModel);
