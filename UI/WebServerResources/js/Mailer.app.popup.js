!function(){"use strict";function a(a,h){a.state("mail",{url:"/Mail","abstract":!0,views:{message:{template:"<ui-view/>"}},resolve:{stateAccounts:b}}).state("mail.account",{url:"/:accountId","abstract":!0,template:'<ui-view id="account"/>',resolve:{stateAccount:c}}).state("mail.account.mailbox",{url:"/:mailboxId","abstract":!0,template:'<ui-view id="mailbox"/>',resolve:{stateMailbox:d}}).state("mail.account.mailbox.newMessage",{url:"/new",views:{"message@":{template:"<ui-view/>",controller:"MessageEditorControllerPopup"}},resolve:{stateMessage:e}}).state("mail.account.mailbox.message",{url:"/:messageId",views:{"message@":{templateUrl:"UIxMailViewTemplate",controller:"MessageController",controllerAs:"viewer"}},resolve:{stateMessage:f}}).state("mail.account.mailbox.message.edit",{url:"/edit",views:{"message@":{templateUrl:"UIxMailEditor",controller:"MessageEditorController",controllerAs:"editor"}},resolve:{stateContent:g}}).state("mail.account.mailbox.message.action",{url:"/{actionName:(?:reply|replyall|forward)}",views:{message:{templateUrl:"UIxMailEditor",controller:"MessageEditorController",controllerAs:"editor"}}}),h.otherwise("/Mail/0/folderINBOX/new")}function b(a,b){var c,d=[];return window&&window.opener&&window.opener.$mailboxController?(c=window.opener.$mailboxController.accounts,a.when(c)):(c=b.$findAll(),angular.forEach(c,function(a,b){var c=a.$getMailboxes();d.push(c.then(function(b){return a}))}),a.all(d))}function c(a,b){return _.find(b,function(b){return b.id==a.accountId})}function d(a,b,c){var d,e=c(a.mailboxId);return(d=function(a){var b=_.find(a,function(a){return a.path==e});return b||angular.forEach(a,function(a){!b&&a.children&&a.children.length>0&&(b=d(a.children))}),b})(b.$mailboxes)}function e(a){return a.$newMessage()}function f(a,b,c,d,e,f){var g,h;return window&&window.opener&&window.opener.$messageController&&window.opener.$messageController.message.uid==parseInt(c.messageId)?(h=new f(e.$account.id,e,window.opener.$messageController.message.$omit()),b.when(h)):(g={uid:c.messageId.toString()},h=new f(e.$account.id,e,g),h.$reload())}function g(a){return a.$editableContent()}function h(a,b,c){b.$on("$stateChangeError",function(b,d,e,f,g,h){c.error(h),a.close()}),b.$on("$routeChangeError",function(a,b,d,e){c.error(a,b,d,e)})}function i(a,b,c,d){b.show({hasBackdrop:!1,disableParentScroll:!1,clickOutsideToClose:!1,escapeToClose:!1,templateUrl:"UIxMailEditor",controller:"MessageEditorController",controllerAs:"editor",locals:{stateAccounts:c,stateMessage:d,stateRecipients:[]}})["finally"](function(){a.close()})}angular.module("SOGo.MailerUI",["ui.router","ck","angularFileUpload","SOGo.Common","SOGo.ContactsUI","SOGo.SchedulerUI","ngAnimate","SOGo.PreferencesUI"]).config(a).run(h).controller("MessageEditorControllerPopup",i),a.$inject=["$stateProvider","$urlRouterProvider"],b.$inject=["$q","Account"],c.$inject=["$stateParams","stateAccounts"],d.$inject=["$stateParams","stateAccount","decodeUriFilter"],e.$inject=["stateAccount"],f.$inject=["encodeUriFilter","$q","$stateParams","$state","stateMailbox","Message"],g.$inject=["stateMessage"],h.$inject=["$window","$rootScope","$log"],i.$inject=["$window","$mdDialog","stateAccounts","stateMessage"]}();
//# sourceMappingURL=Mailer.app.popup.js.map