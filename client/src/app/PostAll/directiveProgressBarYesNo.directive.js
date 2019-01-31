export function ProgressBar(){
  'ngInject';


  let progressBar = {
    restrict: 'E',
    template:
    "<div>Yes - {{posts.yes}}         No - {{posts.no}}"+
      "</div><md-progress-linear md-mode=\"determinate\" value=\"{{posts.percent}}\" aria-valuetext='20'><p>123</p></md-progress-linear>",
    controllerAs: 'prbar'
  }

  return progressBar;

}
