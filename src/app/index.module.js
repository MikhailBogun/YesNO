/* global malarkey:false, moment:false */

import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { MainController } from './main/main.controller';
import { FriendController } from './friend/friends.controller';
import { GithubContributorService } from '../app/components/githubContributor/githubContributor.service';
import { WebDevTecService } from '../app/components/webDevTec/webDevTec.service';
import { FriendsService } from "../app/friend/friend.service";
import { NavbarDirective } from '../app/components/navbar/navbar.directive';
import { MalarkeyDirective } from '../app/components/malarkey/malarkey.directive';
import { PostAllDirective } from '../app//PostAll/directivePostAll.directive';



angular.module('yesno', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMessages', 'ngAria', 'ngResource', 'ui.router', 'toastr'])
  .constant('malarkey', malarkey)
  .constant('moment', moment)
  .config(config)
  .config(routerConfig)
  .run(runBlock)
  .service('githubContributor', GithubContributorService)
  .service('webDevTec', WebDevTecService)
  .service('friendsService', FriendsService)
  .controller('MainController', MainController)
  .controller('FriendController', FriendController)
  .directive('acmeNavbar', NavbarDirective)
  .directive('acmeMalarkey', MalarkeyDirective)
  .directive('post', PostAllDirective);
