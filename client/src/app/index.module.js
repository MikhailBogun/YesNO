/* global malarkey:false, moment:false */

import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { MainController } from './main/main.controller';
import { FriendController } from './friend/friends.controller';
import { RegistrationController } from './Registration/registration.controller';
import { addPostController } from './addPost/addPost.contoller';
import { ProfileCtrl } from './profile/profile.controller';
import { PrivatePostCtrl } from './privatepost/privatepost.controller';
import { authorization } from './authorization/authoriazation.controller.js';
import { GithubContributorService } from './components/githubContributor/githubContributor.service';
import { WebDevTecService } from './components/webDevTec/webDevTec.service';
import { FriendsService } from "./friend/friend.service";
import { addPostService } from './addPost/addPost.service';
import { privatePostService } from './privatepost/privatepost.service';
import { RegistrationService } from "./Registration/registration.service";
import { MainService } from "./main/main.service";
import { NavbarDirective } from './components/navbar/navbar.directive';
import { MalarkeyDirective } from './components/malarkey/malarkey.directive';
import { PostAllDirective } from '../app//PostAll/directivePostAll.directive';
import { ProgressBar } from '../app//PostAll/directiveProgressBarYesNo.directive';
import { fileModel } from '../app//Registration/fileModel.directive';



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
  .controller('authorization', authorization)
  .controller('PrivatePostCtrl', PrivatePostCtrl)
  .controller('ProfileCtrl', ProfileCtrl)
  .directive('acmeNavbar', NavbarDirective)
  .directive('acmeMalarkey', MalarkeyDirective)
  .directive('post', PostAllDirective)
  .directive('prbar', ProgressBar)
  .directive('fileModel', fileModel);
