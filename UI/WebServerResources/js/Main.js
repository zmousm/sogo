!function(){"use strict";function a(a,b,c,d,e){function f(){return e.login(h.creds).then(function(a){window.location.href===a?window.location.reload(!0):window.location.href=a},function(a){c.alert(l("Authentication Failed"),a.error)}),!1}function g(a){function b(a){this.closeDialog=function(){a.hide()}}d.show({targetEvent:a,templateUrl:"aboutBox.html",controller:b,controllerAs:"about"}),b.$inject=["$mdDialog"]}var h=this;h.creds={username:cookieUsername,password:null},h.login=f,h.showAbout=g,h.showLogin=!1,b(function(){h.showLogin=!0},100)}angular.module("SOGo.MainUI",["SOGo.Common","SOGo.Authentication"]),a.$inject=["$scope","$timeout","Dialog","$mdDialog","Authentication"],angular.module("SOGo.MainUI").controller("LoginController",a)}();
//# sourceMappingURL=Main.js.map