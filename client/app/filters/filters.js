angular.module('courageousTrapeze.filters',[])
.filter('tel', function () {
    return function (phoneNumber) {
        return phoneNumber.toString().replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
});
