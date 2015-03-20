/*
 *ut-angular-jsonQ.js v 1.0.0
 *Author: Vincent Le Badezet
 *https://github.com/untemps
 *Copyright (c) 2015 Vincent Le Badezet.
 *Dual licensed under the MIT and GPL licenses
 */

if (!JsonQ) {
  throw new Error("You're required to include the jsonQ library to use the utJsonQ module.");
}

(function(angular, JsonQ) {

  function JsonQProvider() {
    this.$get = ['JsonQ', function (JsonQ) {
      return new JsonQ();
    }];
  }

  if (angular) {
    angular
      .module('utJsonQ', [])
      .provider('jsonQ', JsonQProvider)
      .value('JsonQ', JsonQ);
  }

}(angular, JsonQ));

