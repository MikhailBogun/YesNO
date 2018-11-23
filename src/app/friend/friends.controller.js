export class FriendController {
  constructor ($timeout, friendsService) {
    'ngInject';
    this.friendsData =[];
    this.activate($timeout, friendsService);
  }
  activate($timeout, friendsService) {
    this.getDataFriends(friendsService);
  }
  getDataFriends(friendsService){
    this.friendsData = friendsService.getFriends();
  }
}
