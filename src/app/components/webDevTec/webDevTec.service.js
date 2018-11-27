export class WebDevTecService {
  constructor () {
    'ngInject';

    this.data = [
      {
        'title': 'AngularJS',
        'url': 'https://angularjs.org/',
        'description': 'HTML enhanced for web apps!',
        'logo': 'angular.png'
      },
      {
        'title': 'BrowserSync',
        'url': 'http://browsersync.io/',
        'description': 'Time-saving synchronised browser testing.',
        'logo': 'browsersync.png'
      },
      {
        'title': 'GulpJS',
        'url': 'http://gulpjs.com/',
        'description': 'The streaming build system.',
        'logo': 'gulp.png'
      },
      {
        'title': 'Jasmine',
        'url': 'http://jasmine.github.io/',
        'description': 'Behavior-Driven JavaScript.',
        'logo': 'jasmine.png'
      },
      {
        'title': 'Karma =)',
        'url': 'http://karma-runner.github.io/',
        'description': 'Spectacular Test Runner for JavaScript.',
        'logo': 'karma.png'
      },
      {
        'title': 'Protractor',
        'url': 'https://github.com/angular/protractor',
        'description': 'End to end test framework for AngularJS applications built on top of WebDriverJS.',
        'logo': 'protractor.png'
      },
      {
        'title': 'Bootstrap',
        'url': 'http://getbootstrap.com/',
        'description': 'Bootstrap is the most popular HTML, CSS, and JS framework for developing responsive, mobile first projects on the web.',
        'logo': 'bootstrap.png'
      },
      {
        'title': 'ES6 (Babel formerly 6to5)',
        'url': 'https://babeljs.io/',
        'description': 'Turns ES6+ code into vanilla ES5, so you can use next generation features today.',
        'logo': 'babel.png'
      }
    ];
    this.dataYesNO=[

      {
        'idPerson':"1000",
        'Namehash':["#cat"],
        'massage':"Котик красивый?",
        'Picture':"assets/images/PostAll/Cat1.jpg",
        'Yes': "",
        'No':"",
        'voted':[]
      },
      {
        'idPerson':"1001",
        'Namehash':["#house"],
        'massage':"Дом большой",
        'Picture':"assets/images/PostAll/House1.jpg",
        'Yes': "",
        'No':"",
        'voted':[]
      },
      {
        'idPerson':"1002",
        'massage':"Телефон новый?",
        'Namehash':["#phone"],
        'Picture':"assets/images/PostAll/phone1.jpg",
        'Yes': "",
        'No':"",
        'voted':[]
      },
      {
        'idPerson':"1001",
        'Namehash':["#dog"],
        'massage':"Собака породистая?",
        'Picture':"assets/images/PostAll/Dog1.jpg",
        'Yes': "",
        'No':"",
        'voted':[]


      }
    ];
    this.TablePerson =[ {
          'idPerson':"1000",
          'idFolows':[],
          'idMyFolows':[],
          'Name':"Vasya",
          'PictureFace':"assets/images/persons//1000.jpeg"

      },{
      'idPerson':"1001",
      'idFolows':[],
      'idMyFolows':[],
      'Name':"Anatolii",
      'PictureFace':"assets/images/persons/1001.jpeg"

    },
      {
        'idPerson':"1002",
        'idFolows':[],
        'idMyFolows':[],
        'Name':"Natasha",
        'PictureFace':"assets/images/persons/1002.jpg"

      }

    ]



  }

  getTec() {
    return this.data;
  }
  getYesNodata(){
    return this.dataYesNO;
  }
  getdata(){
    return this.TablePerson;
  }
}
