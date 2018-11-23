 

export function PostAllDirective(){
  'ngInject';
  let directive = {
    restrict: 'E',
     template:"<div class='fig' ng-repeat='posts in main.myfirstsService'> {{posts.massage+posts.Namehash[0]}}" +
        "<div>" +"<p class='fig'><img src=\"{{posts.Picture}}\" width=\"400\" height=\"300\" alt='Фотография'></p>"+
        "<div><button type=\"button\" class=\"btn btn-success\" >Yes</button>"+"<button type=\"button\" class=\"btn btn-danger\">No</button></div>"+
        "<div><p  class=\"animated infinite\" ng-class=\"main.classAnimation\" ng-repeat='Person in main.TablePerson'>{{main.addName(Person,posts )}}<img src=\"{{main.addFace(Person,post)}}\" width=\"35\" height=\"35\" alt='Фотография'>"
        +"<button type=\"button\" class=\"btn btn-lg btn-success\" >Подписаться</button></p></div>"+
        "</div></div>",
    controllerAs: 'post'
  }
  return directive;
}
