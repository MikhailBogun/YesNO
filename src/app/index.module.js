/* global malarkey:false, moment:false */

import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { MainController } from './main/main.controller';
import { FriendController } from './friend/friends.controller';
import { RegistrationController } from './registration/registration.controller';
import { addPostController } from './addPost/addPost.contoller';
import { GithubContributorService } from '../app/components/githubContributor/githubContributor.service';
import { WebDevTecService } from '../app/components/webDevTec/webDevTec.service';
import { FriendsService } from "../app/friend/friend.service";
import { RegistrationService } from "../app/registration/registration.service";
import { NavbarDirective } from '../app/components/navbar/navbar.directive';
import { MalarkeyDirective } from '../app/components/malarkey/malarkey.directive';
import { PostAllDirective } from '../app//PostAll/directivePostAll.directive';
import { fileModel } from '../app//Registration/fileModel.directive';



angular.module('yesno', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMessages', 'ngAria', 'ngResource', 'ui.router', 'toastr'])
  .constant('malarkey', malarkey)
  .constant('moment', moment)
  .config(config)
  .config(routerConfig)
  .run(runBlock)
  .service('githubContributor', GithubContributorService)
  .service('webDevTec', WebDevTecService)
  .service('friendsService', FriendsService)
  .service('registration', RegistrationService)
  .controller('MainController', MainController)
  .controller('FriendController', FriendController)
  .controller('addPostController', addPostController)
  .controller('RegistrationController', RegistrationController)
  .directive('acmeNavbar', NavbarDirective)
  .directive('acmeMalarkey', MalarkeyDirective)
  .directive('post', PostAllDirective)
  .directive('fileModel', fileModel);
