# ut-angular-jsonQ

ut-angular-jsonQ is an AngularJS implementation of the jsonQ library :

jsonQ is a light weight and feature-rich javascript library to make your world around JSON fast and easy.<br />
For a JSON, it makes traversing (you don’t need to make loop inside loop), extracting data and manipulating it very simple.
It also provide some utilty methods , we need while working with JSON which directly works with a JSON .

See documentation on [http://ignitersworld.com/lab/jsonQ.html](http://ignitersworld.com/lab/jsonQ.html)

## Installation
```
> bower install ut-angular-jsonq --save
```

## Usage
```javascript
var onResult = function (result) {
    var jq = jsonQ(result);
    var name = jq.find('husband', function () {
        return this.age > 24;
    }).find('name');
    console.log(name.value());
};

var app = angular.module('demo', ['utJsonQ']).
app.run(['$http', 'jsonQ', function ($http, jsonQ) {
    $http.get('sample.json').then(onResult);
}]);
```

## Author
Vincent Le Badezet ([https://github.com/untemps](https://github.com/untemps))

## Crédits
Sudhanshu Yadav ([https://github.com/s-yadav](https://github.com/s-yadav))

## Copyright
Copyright © 2015 [Vincent Le Badezet](https://github.com/untemps)

## License 
ut-angular-jsonQ is under MIT license - [http://www.opensource.org/licenses/mit-license.php](http://www.opensource.org/licenses/mit-license.php)