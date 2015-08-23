(function(angular) {
    'use strict';
    angular
        .module('highlightwordDemo', ['highlightword']);

    angular
        .module('highlightwordDemo')    
        .controller('highlightctrl', Highlightctrl);

    function Highlightctrl($scope) {
        $scope.$on('highlightEvent',function(eve, data){
            $scope.selectedText = data;
        });
    }
}(window.angular));
