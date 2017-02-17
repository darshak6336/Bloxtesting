var serviceModule = angular.module('serviceModule',['emguo.poller']);

serviceModule.
    factory('socket', function (socketFactory) {
        return socketFactory();
    });
