(function () {
    'use strict';

    var onResult = function (result) {
        var jq = jsonQ(result);
        var name = jq.find('husband', function () {
            return this.age > 24;
        }).find('name');

        console.log(name.value());
    };

    angular.module('demo', ['utJsonQ'])
        .run(['$http', 'jsonQ', function ($http, jsonQ) {
            $http.get('sample.json').then(onResult);
    }]);
}());