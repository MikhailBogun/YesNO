

export function PostAllDirective(){
  'ngInject';


let directive = {
    restrict: 'E',
    template:"<div class='fig' ng-repeat='posts in main.promise | filter:searchText'> <h2>{{posts.massage+posts.Name}}</h2><br>" +
      "<div>" +"<p class='fig'><img src=\"{{posts.image}}\" width=\"700\" height=\"600\" alt='Фотография'></p>"+
      "<div ng-if='main.checkReaction(posts.id)'><br><button type=\"button\" class=\"btn btn-success\" ng-click=\"main.getReaction(1,posts)\"  >Yes</button>"+"<button type=\"button\" class=\"btn btn-danger\" ng-click=\"main.getReaction(0,posts)\" >No</button></div>"+
      "<div class=\"progressB\" ng-if = 'main.checkMyReaction(posts)'><br><prbar></prbar></div>"+"<div ng-repeat='Person in main.info'><h4 ng-if = 'Person.id == posts.voted' >{{main.addName(Person,posts )}}<img  ng-src=\"{{main.addFace(Person,posts)}}\" width=\"35\" height=\"35\" alt='Фотография'>"
      +"<button type=\"button\" class=\"btn btn-lg btn-success\" ng-click=\"main.showFollows(Person,posts)\" >Подписаться</button></h4></div>"+
      "</div></div>",
    controllerAs: 'post'
  }
  return directive;

}
