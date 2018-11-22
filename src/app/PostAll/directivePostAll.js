
export function PostAllDirective(){
  'ngInject';
  return{
    // template:"<div class='fig' ng-repeat='post in main.firstsService'> {{post.massage+post.Namehash[0]}}" +
    //   "<div>" +"<p class='fig'><img src=\"{{post.Picture}}\" width=\"400\" height=\"300\" alt='Фотография'></p>"+
    //   "<div><button type=\"button\" class=\"btn btn-success\" ng-click='Result()'>Yes</button>"+"<button type=\"button\" class=\"btn btn-danger\">No</button></div>"+
    //   "<div><p class='fig' ng-repeat='Person in TablePerson'>{{addName(Person,post )}}<img src=\"{{addFace(Person,post)}}\" width=\"35\" height=\"35\" alt='Фотография'>"
    //   +"<button type=\"button\" class=\"btn btn-success\" ng-click='Result()'>Подписаться</button></p></div>"+
    //   "</div></div>"
    template:"<div>{{1+3}}</div>>"
  }
}
