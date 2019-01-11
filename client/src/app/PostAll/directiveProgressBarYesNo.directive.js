export function ProgressBar(){
  'ngInject';


  let progressBar = {
    restrict: 'E',
    template:"<div class=\"progress\"> "+
      "<div height=\"100\" class=\"progress-bar progress-bar-warning\" role=\"progressbar\" aria-valuenow=\"40\" "+
      "aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width:{{procent(posts)}}%\">{{procent(posts)}}%</div></div>",
    controllerAs: 'prbar'
  }

  return progressBar;

}
