!function(){"use strict";function a(b){"function"!=typeof b.then&&(angular.extend(this,b),_.each(this.identities,function(a){a.fullName?a.full=a.fullName+" <"+a.email+">":a.full="<"+a.email+">"}),a.$log.debug("Account: "+JSON.stringify(b,void 0,2)))}a.$factory=["$q","$timeout","$log","sgSettings","Resource","Preferences","Mailbox","Message",function(b,c,d,e,f,g,h,i){return angular.extend(a,{$q:b,$timeout:c,$log:d,$$resource:new f(e.activeUser("folderURL")+"Mail",e.activeUser()),$Preferences:g,$Mailbox:h,$Message:i}),a}];try{angular.module("SOGo.MailerUI")}catch(b){angular.module("SOGo.MailerUI",["SOGo.Common"])}angular.module("SOGo.MailerUI").factory("Account",a.$factory),a.$findAll=function(b){return b?a.$unwrapCollection(b):a.$$resource.fetch("","mailAccounts").then(function(b){return a.$unwrapCollection(b)})},a.$unwrapCollection=function(b){var c=[];return angular.forEach(b,function(b,d){b.id=d,c[d]=new a(b)}),c},a.prototype.$getMailboxes=function(b){var c=this;return!this.$mailboxes||b&&b.reload?a.$Mailbox.$find(this).then(function(b){return c.$mailboxes=b,a.$Preferences.ready().then(function(){var b,d=function(a){_.forEach(a,function(a){a.$expanded=b.indexOf("/"+a.id)>=0,a.children&&a.children.length>0&&d(a.children)})};a.$Preferences.settings.Mail.ExpandedFolders&&(b=angular.isString(a.$Preferences.settings.Mail.ExpandedFolders)?angular.fromJson(a.$Preferences.settings.Mail.ExpandedFolders):a.$Preferences.settings.Mail.ExpandedFolders,b.length>0&&d(c.$mailboxes)),c.$flattenMailboxes({reload:!0})}),c.$mailboxes}):a.$q.when(this.$mailboxes)},a.prototype.$flattenMailboxes=function(b){var c=this,d=[],e=[],f=function(a){_.each(a,function(a){d.push(a),(b&&b.all||a.$expanded)&&a.children&&a.children.length>0&&f(a.children)})};return!this.$$flattenMailboxes||b&&(b.reload||b.all)?(f(this.$mailboxes),b&&b.all||(c.$$flattenMailboxes=d,b&&b.saveState&&(_.reduce(d,function(a,b){return b.$expanded&&a.push("/"+b.id),a},e),a.$$resource.post(null,"saveFoldersState",e)))):d=this.$$flattenMailboxes,d},a.prototype.$getMailboxByType=function(a){var b,c=function(b){var d=_.find(b,function(b){return b.type==a});return d||angular.forEach(b,function(a){!d&&a.children&&a.children.length>0&&(d=c(a.children))}),d};b=c(this.$mailboxes),console.debug(b),console.debug(this.specialMailboxes)},a.prototype.$getMailboxByPath=function(a){var b=null,c=function(b){var d=_.find(b,function(b){return b.path==a});return d||angular.forEach(b,function(a){!d&&a.children&&a.children.length>0&&(d=c(a.children))}),d};return b=c(this.$mailboxes)},a.prototype.$newMailbox=function(b,c){var d=this;return a.$$resource.post(b.toString(),"createFolder",{name:c}).then(function(){d.$getMailboxes({reload:!0})})},a.prototype.updateQuota=function(a){var b,c,d;b=Math.round(1e4*a.usedSpace/a.maxQuota)/100,c=l("quotasFormat"),d=c.formatted(b,Math.round(a.maxQuota/10.24)/100),this.$quota={percent:b,description:d}},a.prototype.$newMessage=function(){var b=this;return a.$$resource.fetch(this.id.toString(),"compose").then(function(c){a.$log.debug("New message (compose): "+JSON.stringify(c,void 0,2));var d=new a.$Message(c.accountId,b.$getMailboxByPath(c.mailboxPath),c);return d}).then(function(b){return a.$$resource.fetch(b.$absolutePath({asDraft:!0}),"edit").then(function(c){return a.$log.debug("New message (edit): "+JSON.stringify(c,void 0,2)),angular.extend(b.editable,c),b})})},a.prototype.$addDelegate=function(b){var c=this,d=a.$q.defer(),e={uid:b.uid};return!b.uid||_.indexOf(_.pluck(this.delegates,"uid"),b.uid)>-1?d.resolve():a.$$resource.fetch(this.id.toString(),"addDelegate",e).then(function(){c.delegates.push(b),d.resolve(c.users)},function(a,b){d.reject(l("An error occured please try again."))}),d.promise},a.prototype.$removeDelegate=function(b){var c=this,d={uid:b};return a.$$resource.fetch(this.id.toString(),"removeDelegate",d).then(function(){var a=_.indexOf(_.pluck(c.delegates,"uid"),b);a>=0&&c.delegates.splice(a,1)})}}(),function(){"use strict";function a(b,c){if(this.$account=b,"function"!=typeof c.then){if(this.init(c),this.name&&!this.path){var d=a.$$resource.create("createFolder",this.name);this.$unwrap(d)}}else this.$unwrap(c)}a.$factory=["$q","$timeout","$log","sgSettings","Resource","Message","Acl","Preferences","sgMailbox_PRELOAD",function(b,c,d,e,f,g,h,i,j){return angular.extend(a,{$q:b,$timeout:c,$log:d,$$resource:new f(e.activeUser("folderURL")+"Mail",e.activeUser()),$Message:g,$$Acl:h,$Preferences:i,$query:{sort:"date",asc:0},selectedFolder:null,$refreshTimeout:null,$virtualMode:!1,PRELOAD:j}),i.ready().then(function(){i.settings.Mail.SortingState&&(a.$query.sort=i.settings.Mail.SortingState[0],a.$query.asc=parseInt(i.settings.Mail.SortingState[1]))}),a}];try{angular.module("SOGo.MailerUI")}catch(b){angular.module("SOGo.MailerUI",["SOGo.Common"])}angular.module("SOGo.MailerUI").constant("sgMailbox_PRELOAD",{LOOKAHEAD:50,SIZE:100}).factory("Mailbox",a.$factory),a.$find=function(b){var c;return c=this.$$resource.fetch(b.id.toString(),"view"),a.$unwrapCollection(b,c)},a.$unwrapCollection=function(b,c){var d=[],e=function(c,d){for(var f=0;f<d.children.length;f++)d.children[f].level=c,d.children[f]=new a(b,d.children[f]),e(c+1,d.children[f])};return c.then(function(c){return a.$timeout(function(){return angular.forEach(c.mailboxes,function(c,f){c.level=0;var g=new a(b,c);e(1,g),d.push(g)}),c.quotas&&b.updateQuota(c.quotas),d})})},a.$absolutePath=function(a,b){var c=[];return b&&(c=_.map(b.split("/"),function(a){return"folder"+a.asCSSIdentifier()})),c.splice(0,0,a),c.join("/")},a.prototype.init=function(b){this.$isLoading=!0,this.$messages=[],this.uidsMap={},angular.extend(this,b),this.path&&(this.id=this.$id(),this.$acl=new a.$$Acl("Mail/"+this.id)),this.type&&(this.$isEditable=this.isEditable()),angular.isUndefined(this.$shadowData)&&(this.$shadowData=this.$omit())},a.prototype.getLength=function(){return this.$messages.length},a.prototype.getItemAtIndex=function(a){var b;return a>=0&&a<this.$messages.length&&(b=this.$messages[a],this.$loadMessage(b.uid))?b:null},a.prototype.$id=function(){return a.$absolutePath(this.$account.id,this.path)},a.prototype.$selectedCount=function(){var a;return a=0,this.$messages&&(a=_.filter(this.$messages,function(a){return a.selected}).length),a},a.prototype.isSelectedMessage=function(a){return this.selectedMessage==a},a.prototype.$filter=function(b,c){var d=this,e={};return angular.isDefined(this.unseenCount)||(this.unseenCount=0),a.$timeout(function(){d.$isLoading=!0}),a.$Preferences.ready().then(function(){if(a.$refreshTimeout&&a.$timeout.cancel(a.$refreshTimeout),b&&angular.extend(a.$query,b),angular.extend(e,{sortingAttributes:a.$query}),angular.isDefined(c)&&(e.filters=_.reject(c,function(a){return angular.isUndefined(a.searchInput)||0===a.searchInput.length}),_.each(e.filters,function(a){var b,c=a.searchBy.match(/(\w+)_or_(\w+)/);c&&(e.sortingAttributes.match="OR",a.searchBy=c[1],b=angular.copy(a),b.searchBy=c[2],e.filters.push(b))})),!a.$virtualMode){var f=a.$Preferences.defaults.SOGoRefreshViewCheck;if(f&&"manually"!=f){var g=angular.bind(d,a.prototype.$filter);a.$refreshTimeout=a.$timeout(g,1e3*f.timeInterval())}}var h=a.$$resource.post(d.id,"view",e);return d.$unwrap(h)})},a.prototype.$loadMessage=function(b){var c,d,e,f=this.uidsMap[b],g=this.$messages.length,h=!1;if(angular.isDefined(this.uidsMap[b])&&f<this.$messages.length&&(angular.isDefined(this.$messages[f].subject)&&(h=!0),c=Math.min(f+a.PRELOAD.LOOKAHEAD,g-1),!angular.isDefined(this.$messages[c].subject)&&!angular.isDefined(this.$messages[c].loading))){for(c=Math.min(f+a.PRELOAD.SIZE,g),d=[];c>f&&g>f;f++)angular.isDefined(this.$messages[f].subject)||this.$messages[f].loading?c++:(d.push(this.$messages[f].uid),this.$messages[f].loading=!0);a.$log.debug("Loading UIDs "+d.join(" ")),e=a.$$resource.post(this.id,"headers",{uids:d}),this.$unwrapHeaders(e)}return h},a.prototype.isEditable=function(){return"folder"==this.type},a.prototype.$rename=function(){var b,c,d,e,f=this;return this.name==this.$shadowData.name?a.$q.when():(b=function(a,c){var d=null,e=_.find(c,function(a){return a.path==f.path});return e?d=a:angular.forEach(c,function(a){!d&&a.children&&a.children.length>0&&(d=b(a,a.children))}),d},c=b(null,this.$account.$mailboxes),d=null===c?this.$account.$mailboxes:c.children,e=_.indexOf(_.pluck(d,"id"),this.id),this.$save().then(function(b){var c;angular.extend(f,b),f.id=f.$id(),d.splice(e,1),c=_.find(d,function(b){return a.$log.debug(b.name+" ? "+f.name),"folder"==b.type&&b.name.localeCompare(f.name)>0}),e=c?_.indexOf(_.pluck(d,"id"),c.id):d.length,d.splice(e,0,f)}))},a.prototype.$compact=function(){var b=this;return a.$$resource.post(this.id,"expunge").then(function(a){a.quotas&&b.$account.updateQuota(a.quotas)})},a.prototype.$setFolderAs=function(b){return a.$$resource.post(this.id,"setAs"+b+"Folder")},a.prototype.$emptyTrash=function(){var b=this;return a.$$resource.post(this.id,"emptyTrash").then(function(a){b.$messages=[],b.uidsMap={},b.unseenCount=0,angular.isDefined(b.children)&&b.children.length&&b.$account.$getMailboxes({reload:!0}),a.quotas&&b.$account.updateQuota(a.quotas)})},a.prototype.$markAsRead=function(){return a.$$resource.post(this.id,"markRead")},a.prototype.$flagMessages=function(b,c,d){var e={msgUIDs:b,flags:c,operation:d};return a.$$resource.post(this.id,"addOrRemoveLabel",e)},a.prototype.$delete=function(){var b=this;return a.$$resource.remove(this.id).then(function(){return b.$account.$getMailboxes({reload:!0}),!0})},a.prototype.$deleteMessages=function(b){var c,d=this;return c=_.pluck(b,"uid"),a.$$resource.post(this.id,"batchDelete",{uids:c}).then(function(a){var e,f=d.$messages.length;return e=_.filter(b,function(a,b){return!a.isread}),d.unseenCount-=e.length,_.forEachRight(d.$messages,function(a,b){var e=_.findIndex(c,function(b){return a.uid==b});e>-1?(c.splice(e,1),delete d.uidsMap[a.uid],a.uid==d.selectedMessage&&delete d.selectedMessage,d.$messages.splice(b,1),f>b&&(f=b)):d.uidsMap[a.uid]-=c.length}),a.quotas&&d.$account.updateQuota(a.quotas),f})},a.prototype.$copyMessages=function(b,c){return a.$$resource.post(this.id,"copyMessages",{uids:b,folder:c}).then(function(a){a.quotas&&_this.$account.updateQuota(a.quotas)})},a.prototype.$moveMessages=function(b,c){return a.$$resource.post(this.id,"moveMessages",{uids:b,folder:c})},a.prototype.$reset=function(){var a=this;angular.forEach(this,function(b,c){"constructor"!=c&&"children"!=c&&"$"!=c[0]&&delete a[c]}),angular.extend(this,this.$shadowData),this.$shadowData=this.$omit()},a.prototype.$save=function(){var b=this;return a.$$resource.save(this.id,this.$omit()).then(function(c){return b.$shadowData=b.$omit(),a.$log.debug(JSON.stringify(c,void 0,2)),c},function(c){a.$log.error(JSON.stringify(c,void 0,2)),b.$reset()})},a.prototype.$newMailbox=function(a,b){return this.$account.$newMailbox(a,b)},a.prototype.$omit=function(){var a={};return angular.forEach(this,function(b,c){"constructor"!=c&&"children"!=c&&"$"!=c[0]&&(a[c]=b)}),a},a.prototype.$unwrap=function(b){var c=this,d=a.$q.defer();return this.$futureMailboxData=b,this.$futureMailboxData.then(function(b){a.$timeout(function(){var e,f;c.init(b),c.uids&&(a.$log.debug("unwrapping "+b.uids.length+" messages"),f=_.invoke(c.headers[0],"toLowerCase"),c.headers.splice(0,1),c.threaded&&(e=c.uids[0],c.uids.splice(0,1)),_.reduce(c.uids,function(b,d,f){var g;return g=c.threaded?_.object(e,d):{uid:d.toString()},c.uidsMap[g.uid]=f,b.push(new a.$Message(c.$account.id,c,g,!0)),b},c.$messages),_.each(c.headers,function(a){var b=_.object(f,a),d=c.uidsMap[b.uid.toString()];_.extend(c.$messages[d],b)})),a.$log.debug("mailbox "+c.id+" ready"),c.$isLoading=!1,d.resolve(c.$messages)})},function(a){angular.extend(c,a),c.isError=!0,d.reject()}),d.promise},a.prototype.$unwrapHeaders=function(b){var c=this;b.then(function(b){a.$timeout(function(){var a,d;b.length>0&&(a=_.invoke(b[0],"toLowerCase"),b.splice(0,1),_.each(b,function(b){b=_.object(a,b),d=c.uidsMap[b.uid.toString()],angular.isDefined(d)&&_.extend(c.$messages[d],b)}))})})}}(),function(){"use strict";function a(a,b,c,d){this.accountId=a,this.$mailbox=b,this.$hasUnsafeContent=!1,this.$loadUnsafeContent=!1,this.editable={to:[],cc:[],bcc:[]},this.selected=!1,"function"!=typeof c.then?((angular.isUndefined(d)||!d)&&(angular.extend(this,c),this.$formatFullAddresses()),this.uid=parseInt(c.uid)):this.$unwrap(c)}a.$factory=["$q","$timeout","$log","sgSettings","Gravatar","Resource","Preferences",function(b,c,d,e,f,g,h){return angular.extend(a,{$q:b,$timeout:c,$log:d,$gravatar:f,$$resource:new g(e.activeUser("folderURL")+"Mail",e.activeUser())}),h.ready().then(function(){h.defaults.SOGoMailLabelsColors&&(a.$tags=h.defaults.SOGoMailLabelsColors),h.defaults.SOGoMailDisplayRemoteInlineImages&&"always"==h.defaults.SOGoMailDisplayRemoteInlineImages&&(a.$displayRemoteInlineImages=!0)}),a}];try{angular.module("SOGo.MailerUI")}catch(b){angular.module("SOGo.MailerUI",["SOGo.Common"])}angular.module("SOGo.MailerUI").factory("Message",a.$factory),a.filterTags=function(b){var c=new RegExp(b,"i"),d=[];return _.forEach(_.keys(a.$tags),function(b){var e=a.$tags[b];-1!=e[0].search(c)&&d.push({name:b,description:e[0],color:e[1]})}),d},a.prototype.$absolutePath=function(a){if(angular.isUndefined(this.id)||a){var b;b=_.map(this.$mailbox.path.split("/"),function(a){return"folder"+a.asCSSIdentifier()}),b.splice(0,0,this.accountId),a&&a.asDraft&&this.draftId?b.push(this.draftId):b.push(this.uid),this.id=b.join("/")}return this.id},a.prototype.$setUID=function(a){var b=this.uid||-1;b!=parseInt(a)&&(this.uid=parseInt(a),b>-1?(b=b.toString(),angular.isDefined(this.$mailbox.uidsMap[b])&&(this.$mailbox.uidsMap[a]=this.$mailbox.uidsMap[b],delete this.$mailbox.uidsMap[b])):this.$mailbox.constructor.selectedFolder&&"draft"==this.$mailbox.constructor.selectedFolder.type&&this.$mailbox.constructor.selectedFolder.$filter())},a.prototype.$formatFullAddresses=function(){var b=this,c=_.pluck(b.$mailbox.$account.identities,"email");_.each(["from","to","cc","bcc","reply-to"],function(d){_.each(b[d],function(b,d){b.name&&b.name!=b.email?(b.full=b.name+" <"+b.email+">",b.name.split(" ").length&&(b.shortname=b.name.split(" ")[0].replace("'",""))):(b.full="<"+b.email+">",b.shortname=b.email.split("@")[0]),b.image=a.$gravatar(b.email,32),_.indexOf(c,b.email)>=0&&(b.shortname=l("me"))})})},a.prototype.$shortRecipients=function(){var a=this,b=[];return _.each(["to","cc","bcc"],function(c){_.each(a[c],function(a,c){b.push(a.shortname)})}),b.join(", ")},a.prototype.$shortAddress=function(a){var b="";return this[a]&&this[a].length>0&&(b=this[a][0].name||this[a][0].email||""),b},a.prototype.allowReplyAll=function(){var a=0;return a=_.reduce(["to","cc"],function(a,b){return this[b]?a+this[b].length:a},a,this),!this.isDraft&&a>1},a.prototype.loadUnsafeContent=function(){this.$loadUnsafeContent=!0},a.prototype.$content=function(){var b=this,c=[],d=function(e){if(e.msgclass="msg-attachment-other","UIxMailPartAlternativeViewer"==e.type)d(_.find(e.content,function(a){return e.preferredPart==a.contentType}));else if(angular.isArray(e.content)){if("UIxMailPartSignedViewer"==e.type&&1===e["supports-smime"]){var f="<p>"+e.error.replace(/\n/,'</p><p class="md-caption">');f=f.replace(/\n/g,'</p><p class="md-caption">')+"</p>",b.$smime={validSignature:e.valid,message:f}}_.each(e.content,function(a){d(a)})}else angular.isUndefined(e.safeContent)&&(e.safeContent=e.content,b.$hasUnsafeContent|=e.safeContent.indexOf(" unsafe-")>-1),"UIxMailPartHTMLViewer"==e.type?(e.html=!0,b.$loadUnsafeContent||a.$displayRemoteInlineImages?(angular.isUndefined(e.unsafeContent)&&(e.unsafeContent=document.createElement("div"),e.unsafeContent.innerHTML=e.safeContent,angular.forEach(["src","data","classid","background","style"],function(a){var b,c,d,f=e.unsafeContent.querySelectorAll("[unsafe-"+a+"]");for(d=0;d<f.length;d++)b=angular.element(f[d]),c=b.attr("unsafe-"+a),b.attr(a,c),b.removeAttr("unsafe-"+a)}),b.$hasUnsafeContent=!1),e.content=e.unsafeContent.innerHTML):e.content=e.safeContent,c.push(e)):"UIxMailPartICalViewer"==e.type||"UIxMailPartImageViewer"==e.type||"UIxMailPartLinkViewer"==e.type?(e.participants&&_.each(e.participants,function(b){b.image=a.$gravatar(b.email,32)}),"UIxMailPartImageViewer"==e.type?e.msgclass="msg-attachment-image":"UIxMailPartLinkViewer"==e.type&&(e.msgclass="msg-attachment-link"),e.compile=!0,c.push(e)):(e.html=!0,e.content=e.safeContent,c.push(e))};return d(this.parts),c},a.prototype.$editableContent=function(){var b=this;return a.$$resource.fetch(this.$absolutePath(),"edit").then(function(c){return angular.extend(b,c),a.$$resource.fetch(b.$absolutePath({asDraft:!0}),"edit").then(function(c){return a.$log.debug("editable = "+JSON.stringify(c,void 0,2)),angular.extend(b.editable,c),c.text})})},a.prototype.addTag=function(a){return this.$addOrRemoveTag("add",a)},a.prototype.removeTag=function(a){return this.$addOrRemoveTag("remove",a)},a.prototype.$addOrRemoveTag=function(b,c){var d={operation:b,msgUIDs:[this.uid],flags:c};return c?a.$$resource.post(this.$mailbox.$id(),"addOrRemoveLabel",d):void 0},a.prototype.$imipAction=function(b,c,d){var e=this;a.$$resource.post([this.$absolutePath(),b].join("/"),c,d).then(function(b){a.$timeout(function(){e.$reload()},function(){})})},a.prototype.$sendMDN=function(){return this.shouldAskReceipt=0,a.$$resource.post(this.$absolutePath(),"sendMDN")},a.prototype.$deleteAttachment=function(b){var c="deleteAttachment?filename="+b,d=this;a.$$resource.post(this.$absolutePath({asDraft:!0}),c).then(function(c){a.$timeout(function(){d.editable.attachmentAttrs=_.filter(d.editable.attachmentAttrs,function(a){return a.filename!=b})},function(){})})},a.prototype.toggleFlag=function(){var b=this,c="markMessageFlagged";return this.isflagged&&(c="markMessageUnflagged"),a.$$resource.post(this.$absolutePath(),c).then(function(c){a.$timeout(function(){b.isflagged=!b.isflagged})})},a.prototype.$reload=function(b){var c;return c=a.$$resource.fetch(this.$absolutePath(b),"view"),this.$unwrap(c)},a.prototype.$reply=function(){return this.$newDraft("reply")},a.prototype.$replyAll=function(){return this.$newDraft("replyall")},a.prototype.$forward=function(){return this.$newDraft("forward")},a.prototype.$newDraft=function(b){var c=this;return a.$$resource.fetch(this.$absolutePath(),b).then(function(d){var e,f;return a.$log.debug("New "+b+": "+JSON.stringify(d,void 0,2)),e=c.$mailbox.$account.$getMailboxByPath(d.mailboxPath),f=new a(d.accountId,e,d),a.$$resource.fetch(f.$absolutePath({asDraft:!0}),"edit").then(function(d){return a.$log.debug("New "+b+": "+JSON.stringify(d,void 0,2)+" original UID: "+c.uid),angular.extend(f.editable,d),f.origin={message:c,action:b},f})})},a.prototype.$save=function(){var b=this,c=this.editable;return a.$log.debug("save = "+JSON.stringify(c,void 0,2)),a.$$resource.save(this.$absolutePath({asDraft:!0}),c).then(function(c){a.$log.debug("save = "+JSON.stringify(c,void 0,2)),b.$setUID(c.uid),b.$reload({asDraft:!1})})},a.prototype.$send=function(){var b=this,c=angular.copy(this.editable),d=a.$q.defer();return a.$log.debug("send = "+JSON.stringify(c,void 0,2)),a.$$resource.post(this.$absolutePath({asDraft:!0}),"send",c).then(function(a){"success"==a.status?(d.resolve(a),angular.isDefined(b.origin)&&(b.origin.action.startsWith("reply")?b.origin.message.isanswered=!0:"forward"==b.origin.action&&(b.origin.message.isforwarded=!0))):d.reject(a)}),d.promise},a.prototype.$unwrap=function(b){var c=this;return this.$futureMessageData=b.then(function(b){return 0===c.isread&&a.$$resource.fetch(c.$absolutePath(),"markMessageRead").then(function(){a.$timeout(function(){c.isread=!0,c.$mailbox.unseenCount--})}),a.$timeout(function(){return angular.extend(c,b),c.$formatFullAddresses(),c.$loadUnsafeContent=!1,c})}),this.$futureMessageData},a.prototype.$omit=function(){var a={};return angular.forEach(this,function(b,c){"constructor"!=c&&"$"!=c[0]&&(a[c]=b)}),a}}(),function(){"use strict";function a(a){this.$account=a}a.$factory=["$q","$timeout","$log","sgSettings","Message","Mailbox","sgMailbox_PRELOAD",function(b,c,d,e,f,g,h){return angular.extend(a,{$q:b,$timeout:c,$log:d,$Message:g,selectedFolder:null,PRELOAD:h}),a}];try{angular.module("SOGo.MailerUI")}catch(b){angular.module("SOGo.MailerUI",["SOGo.Common"])}angular.module("SOGo.MailerUI").constant("sgMailbox_PRELOAD",{LOOKAHEAD:50,SIZE:100}).factory("VirtualMailbox",a.$factory),a.$absolutePath=function(a){return[a,"virtual"].join("/")},a.prototype.init=function(a){this.$isLoading=!1,this.$mailboxes=[],this.uidsMap={},angular.extend(this,a),this.id=this.$id()},a.prototype.setMailboxes=function(a){this.$mailboxes=a,_.each(this.$mailboxes,function(a){a.$messages=[],a.uidsMap={}})},a.prototype.startSearch=function(b,c){var d=this,e=a.$q.when();this.$isLoading=!0,_.each(this.$mailboxes,function(f){e=e.then(function(){return d.$isLoading?(a.$log.debug("searching mailbox "+f.path),f.$filter({sort:"date",asc:!1,match:b},c)):void 0})}),e["finally"](function(){d.$isLoading=!1})},a.prototype.stopSearch=function(){a.$log.debug("stopping search..."),this.$isLoading=!1},a.prototype.resetSelectedMessage=function(){_.each(this.$mailboxes,function(a){delete a.selectedMessage})},a.prototype.isSelectedMessage=function(a,b){return angular.isDefined(_.find(this.$mailboxes,function(c){return c.path==b&&c.selectedMessage==a}))},a.prototype.getLength=function(){var a=0;return angular.isDefined(this.$mailboxes)?(_.each(this.$mailboxes,function(b){a+=b.$messages.length}),a):a},a.prototype.getItemAtIndex=function(a){var b,c,d,e,f;if(angular.isDefined(this.$mailboxes)&&a>=0)for(b=0,c=0;c<this.$mailboxes.length;c++)for(e=this.$mailboxes[c],d=0;d<e.$messages.length;b++,d++)if(f=e.$messages[d],b==a&&e.$loadMessage(f.uid))return f;return null},a.prototype.$id=function(){return a.$absolutePath(this.$account.id)},a.prototype.$selectedCount=function(){return 0},a.prototype.$flagMessages=function(a,b,c){},a.prototype.$deleteMessages=function(a){},a.prototype.$copyMessages=function(a,b){},a.prototype.$moveMessages=function(a,b){}}(),function(){"use strict";function a(a,b,c,d,e,f,g,h,i,j){function k(a){j.$virtualMode?b.go("mail.account.virtualMailbox.message",{accountId:e.id,mailboxId:g(a.$mailbox.path),messageId:a.uid}):b.go("mail.account.mailbox.message",{accountId:e.id,mailboxId:g(a.$mailbox.path),messageId:a.uid})}function m(a,b){b.selected=!b.selected,a.preventDefault(),a.stopPropagation()}function n(){_.each(y.selectedFolder.$messages,function(a){a.selected=!1})}function o(){h.confirm(l("Warning"),l("Are you sure you want to delete the selected messages?")).then(function(){var a=!1,c=_.filter(y.selectedFolder.$messages,function(b){return b.selected&&b.uid==y.selectedFolder.selectedMessage&&(a=!0),b.selected});y.selectedFolder.$deleteMessages(c).then(function(c){var d,e,f=c;a&&(j.$virtualMode?b.go("mail.account.virtualMailbox"):(c>0&&(f-=1,d=y.selectedFolder.$messages[f]),c<y.selectedFolder.$messages.length&&(e=y.selectedFolder.$messages[c]),d?d.isread&&e&&!e.isread&&(f=c,d=e):e&&(f=c,d=e),d?(b.go("mail.account.mailbox.message",{messageId:d.uid}),y.selectedFolder.$topIndex=f):b.go("mail.account.mailbox")))})})}function p(a){var b=_.filter(y.selectedFolder.$messages,function(a){return a.selected}),c=_.pluck(b,"uid");y.selectedFolder.$copyMessages(c,"/"+a)}function q(){var a=_.filter(y.selectedFolder.$messages,function(a){return a.selected}),b=_.pluck(a,"uid");window.location.href=ApplicationBaseURL+"/"+y.selectedFolder.id+"/saveMessages?uid="+b.join(",")}function r(){for(var a=0,b=y.selectedFolder.$messages.length;b>a;a++)y.selectedFolder.$messages[a].selected=!0}function s(){var a=_.filter(y.selectedFolder.$messages,function(a){return a.selected}),b=_.pluck(a,"uid");y.selectedFolder.$flagMessages(b,"\\Flagged","add").then(function(b){_.forEach(a,function(a){a.isflagged=!0})})}function t(){var a=_.filter(y.selectedFolder.$messages,function(a){return a.selected}),b=_.pluck(a,"uid");y.selectedFolder.$flagMessages(b,"seen","remove").then(function(b){_.forEach(a,function(a){a.isread=!1,y.selectedFolder.unseenCount++})})}function u(a){y.selectedFolder.$filter({sort:a})}function v(a){return j.$query.sort==a}function w(){y.mode.search=!1,y.selectedFolder.$filter()}function x(a){var b;null===z&&(b=y.account.$newMessage(),z=c.show({parent:angular.element(document.body),targetEvent:a,clickOutsideToClose:!1,escapeToClose:!1,templateUrl:"UIxMailEditor",controller:"MessageEditorController",controllerAs:"editor",locals:{stateAccounts:y.accounts,stateMessage:b,stateRecipients:[]}})["finally"](function(){z=null}))}var y=this,z=null;a.$mailboxController=y,j.selectedFolder=f,y.service=j,y.accounts=d,y.account=e,y.selectedFolder=f,y.selectMessage=k,y.toggleMessageSelection=m,y.unselectMessages=n,y.confirmDeleteSelectedMessages=o,y.copySelectedMessages=p,y.saveSelectedMessages=q,y.markSelectedMessagesAsFlagged=s,y.markSelectedMessagesAsUnread=t,y.selectAll=r,y.sort=u,y.sortedBy=v,y.cancelSearch=w,y.newMessage=x,y.mode={search:!1}}function b(a){return a[0].controller.prototype.resetScroll=function(){"messagesList"==this.$element.parent().attr("id")?this.updateSize():this.scrollTo(0)},a}a.$inject=["$window","$state","$mdDialog","stateAccounts","stateAccount","stateMailbox","encodeUriFilter","Dialog","Account","Mailbox"],angular.module("material.components.virtualRepeat").decorator("mdVirtualRepeatContainerDirective",b),b.$inject=["$delegate"],angular.module("SOGo.MailerUI").controller("MailboxController",a)}(),function(){"use strict";function a(a,b,c,d,e,f,g,h,i,j,k,m,n,o,p,q){function r(a){N.showingAdvancedSearch=!0,N.search.mailbox=a}function s(){N.showingAdvancedSearch=!1,N.service.$virtualMode=!1,L=N.accounts[0],M=N.searchPreviousMailbox,a.go("mail.account.mailbox",{accountId:L.id,mailboxId:h(M.path)})}function t(){if(m.selectedFolder.$isLoading)N.virtualMailbox.stopSearch();else{var b,c=[],d=function(a){_.each(a,function(a){c.push(a),a.children&&a.children.length>0&&d(a.children)})};N.virtualMailbox=new n(N.accounts[0]),m.$virtualMode||(N.searchPreviousMailbox=m.selectedFolder),m.selectedFolder=N.virtualMailbox,m.$virtualMode=!0,angular.isDefined(N.search.mailbox)?(b=N.accounts[0].$getMailboxByPath(N.search.mailbox),c.push(b),N.search.subfolders&&b.children.length&&d(b.children)):c=N.accounts[0].$flattenMailboxes(),N.virtualMailbox.setMailboxes(c),N.virtualMailbox.startSearch(N.search.match,N.search.params),a.go("mail.account.virtualMailbox",{accountId:N.accounts[0].id})}}function u(a){return N.currentSearchParam=a,g("advancedSearch"),!1}function v(a){if(a.length&&N.currentSearchParam.length){var b=0,c=N.currentSearchParam;return a.startsWith("!")&&(b=1,a=a.substring(1).trim()),N.currentSearchParam="",{searchBy:c,searchInput:a,negative:b}}}function w(a){i.prompt(l("New folder"),l("Enter the new name of your folder :")).then(function(b){a.$newMailbox(a.id,b).then(function(){},function(a,c){i.alert(l('An error occured while creating the mailbox "%{0}".',b),l(a.error))})})}function x(a){function b(a,b,c,d){function e(a){return c.$filter(a,d.delegates)}function f(){b.hide()}function g(a){d.$removeDelegate(a.uid)["catch"](function(a,b){i.alert(l("Warning"),l("An error occured please try again."))})}function h(a){a&&d.$addDelegate(a).then(function(){j.userToAdd="",j.searchText=""},function(a){i.alert(l("Warning"),a)})}var j=this;j.users=d.delegates,j.account=d,j.userToAdd="",j.searchText="",j.userFilter=e,j.closeModal=f,j.removeUser=g,j.addUser=h}c.show({templateUrl:a.id+"/delegation",controller:b,controllerAs:"delegate",clickOutsideToClose:!0,escapeToClose:!0,locals:{User:o,account:a}}),b.$inject=["$scope","$mdDialog","User","account"]}function y(a){N.editMode=a.path,g("mailboxName_"+a.path)}function z(a){a.$reset(),N.editMode=!1}function A(b,c,d){N.editMode!=d.path&&(N.editMode=!1,N.showingAdvancedSearch=!1,N.service.$virtualMode=!1,e("xs")&&f("left").close(),a.go("mail.account.mailbox",{accountId:c.id,mailboxId:h(d.path)}),b.stopPropagation(),b.preventDefault())}function B(a){a.$rename().then(function(a){N.editMode=!1})}function C(a){a.$compact().then(function(){d.show(d.simple().content(l("Folder compacted")).position("top right").hideDelay(3e3))})}function D(a){a.$emptyTrash().then(function(){d.show(d.simple().content(l("Trash emptied")).position("top right").hideDelay(3e3))})}function E(a){window.location.href=ApplicationBaseURL+"/"+a.id+"/exportFolder"}function F(b){i.confirm(l("Confirmation"),l("Do you really want to move this folder into the trash ?")).then(function(){b.$delete().then(function(){a.go("mail")},function(a,c){i.alert(l('An error occured while deleting the mailbox "%{0}".',b.name),l(a.error))})})}function G(a){a.$markAsRead()}function H(a){a.$acl.$users().then(function(){c.show({templateUrl:a.id+"/UIxAclEditor",controller:"AclController",controllerAs:"acl",clickOutsideToClose:!0,escapeToClose:!0,locals:{usersWithACL:a.$acl.users,User:o,folder:a}})})}function I(a){return"inbox"==a.type?{name:a.name,icon:"inbox"}:"draft"==a.type?{name:l("DraftsFolderName"),icon:"drafts"}:"sent"==a.type?{name:l("SentFolderName"),icon:"send"}:"trash"==a.type?{name:l("TrashFolderName"),icon:"delete"}:"additional"==a.type?{name:a.name,icon:"folder_shared"}:{name:a.name,icon:"folder_open"}}function J(a,b){a.$setFolderAs(b).then(function(){a.$account.$getMailboxes({reload:!0})})}function K(){var a=window.unseenCountFolders;_.forEach(N.accounts,function(b){_.includes(a,b.id+"/folderINBOX")||a.push(b.id+"/folderINBOX"),_.forEach(b.$$flattenMailboxes,function(b){angular.isDefined(b.unseenCount)&&!_.includes(a,b.id)&&a.push(b.id)})}),k.$$resource.post("","unseenCount",{mailboxes:a}).then(function(a){_.forEach(N.accounts,function(b){_.forEach(b.$$flattenMailboxes,function(b){a[b.id]&&(b.unseenCount=a[b.id])})})}),p.ready().then(function(){var a=p.defaults.SOGoRefreshViewCheck;a&&"manually"!=a&&b(N.refreshUnseenCount,1e3*a.timeInterval())})}var L,M,N=this;N.service=m,N.accounts=q,N.newFolder=w,N.delegate=x,N.editFolder=y,N.revertEditing=z,N.selectFolder=A,N.saveFolder=B,N.compactFolder=C,N.emptyTrashFolder=D,N.exportMails=E,N.confirmDelete=F,N.markFolderRead=G,N.share=H,N.metadataForFolder=I,N.setFolderAs=J,N.refreshUnseenCount=K,N.showingAdvancedSearch=!1,N.currentSearchParam="",N.addSearchParam=u,N.newSearchParam=v,N.showAdvancedSearch=r,N.hideAdvancedSearch=s,N.toggleAdvancedSearch=t,N.search={options:{"":l("Select a criteria"),subject:l("Enter Subject"),from:l("Enter From"),to:l("Enter To"),cc:l("Enter Cc"),body:l("Enter Body")},mailbox:"INBOX",subfolders:1,match:"AND",params:[]},"mail"==a.current.name&&N.accounts.length>0&&N.accounts[0].$mailboxes.length>0&&(L=N.accounts[0],M=L.$mailboxes[0],a.go("mail.account.mailbox",{accountId:L.id,mailboxId:h(M.path)})),N.refreshUnseenCount()}a.$inject=["$state","$timeout","$mdDialog","$mdToast","$mdMedia","$mdSidenav","sgFocus","encodeUriFilter","Dialog","sgSettings","Account","Mailbox","VirtualMailbox","User","Preferences","stateAccounts"],angular.module("SOGo.MailerUI").controller("MailboxesController",a)}(),function(){"use strict";function a(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){function p(){var b,c,d={};return a.opener&&a.opener.$mailboxController&&a.opener.$mailboxController.selectedFolder.$id()==g.$id()&&(c=a.opener.$mailboxController,d.mailboxCtrl=c,a.opener.$messageController&&a.opener.$messageController.message.uid==h.uid&&(b=a.opener.$messageController,d.messageCtrl=b)),d}function q(a){D.$showDetailedRecipients=!0,a.stopPropagation(),a.preventDefault()}function r(){var a,b,d,e,f,i=p();i.messageCtrl?(a=i.mailboxCtrl.selectedFolder,b=i.messageCtrl.message,d=i.messageCtrl.$state):(a=g,b=h,d=c),a.$deleteMessages([b]).then(function(c){var g=c;if(b=null,angular.isDefined(d)){c>0&&(g-=1,e=a.$messages[g]),c<a.$messages.length&&(f=a.$messages[c]),e?e.isread&&f&&!f.isread&&(g=c,e=f):f&&(g=c,e=f);try{e?(d.go("mail.account.mailbox.message",{messageId:e.uid}),a.$topIndex=g):d.go("mail.account.mailbox")}catch(h){}}z()})}function s(a,b,c){null===E&&(angular.isDefined(c)||(c=[]),
E=d.show({parent:angular.element(document.body),targetEvent:a,clickOutsideToClose:!1,escapeToClose:!1,templateUrl:"UIxMailEditor",controller:"MessageEditorController",controllerAs:"editor",locals:{stateAccounts:D.accounts,stateAccount:D.account,stateMessage:b,stateRecipients:c}})["finally"](function(){E=null,z()}))}function t(){c.go("mail.account.mailbox").then(function(){D.message=null,delete g.selectedMessage})}function u(a){var b=D.message.$reply();s(a,b)}function v(a){var b=D.message.$replyAll();s(a,b)}function w(a){var b=D.message.$forward();s(a,b)}function x(a){D.message.$editableContent().then(function(){s(a,D.message)})}function y(){var b=[j.baseURL(),"UIxMailPopupView#/Mail",D.message.accountId,i(i(D.message.$mailbox.path)),D.message.uid].join("/"),c=D.message.$absolutePath();F=a.open(b,c,["width=680","height=520","resizable=1","scrollbars=1","toolbar=0","location=0","directories=0","status=0","menubar=0","copyhistory=0"].join(","))}function z(){a.opener&&a.close()}function A(a,b){var c=D.account.$newMessage();s(a,c,[b]),a.stopPropagation(),a.preventDefault()}function B(){window.location.href=ApplicationBaseURL+"/"+D.mailbox.id+"/saveMessages?uid="+D.message.uid}function C(a){D.showRawSource||D.rawSource?D.showRawSource=!D.showRawSource:o.$$resource.post(D.message.id,"viewsource").then(function(a){D.rawSource=a,D.showRawSource=!0})}var D=this,E=null,F=null;a.$messageController=D,D.$state=c,D.accounts=e,D.account=f,D.mailbox=g,D.message=h,D.service=o,D.tags={searchText:"",selected:""},D.showFlags=h.flags&&h.flags.length>0,D.$showDetailedRecipients=!1,D.showDetailedRecipients=q,D.doDelete=r,D.close=t,D.reply=u,D.replyAll=v,D.forward=w,D.edit=x,D.openPopup=y,D.closePopup=z,D.newMessage=A,D.saveMessage=B,D.toggleRawSource=C,D.showRawSource=!1,a.opener&&(b.$watchCollection("viewer.message.flags",function(a,b){var c;(a||b)&&(c=p(),c.messageCtrl&&c.messageCtrl.service.$timeout(function(){c.messageCtrl.message.flags=a}))}),b.$watch("viewer.message.isflagged",function(a,b){var c=p();c.mailboxCtrl&&c.mailboxCtrl.service.$timeout(function(){var b=_.find(c.mailboxCtrl.selectedFolder.$messages,{uid:D.message.uid});b.isflagged=a})}))}a.$inject=["$window","$scope","$state","$mdDialog","stateAccounts","stateAccount","stateMailbox","stateMessage","encodeUriFilter","sgSettings","sgFocus","Dialog","Account","Mailbox","Message"],angular.module("SOGo.MailerUI").controller("MessageController",a)}(),function(){"use strict";function a(a,b,c,d,e,f,g,h,i,j,k,m,n,o,p){function q(){var b,c={};return a.opener&&a.opener.$mailboxController&&("draft"==a.opener.$mailboxController.selectedFolder.type?(c.draftMailboxCtrl=a.opener.$mailboxController,a.opener.$messageController&&a.opener.$messageController.message.uid==h.uid&&(c.draftMessageCtrl=a.opener.$messageController)):h.origin&&(b=h.origin.message,a.opener.$mailboxController.selectedFolder.$id()==b.$mailbox.$id()&&(c.originMailboxCtrl=a.opener.$mailboxController))),c}function r(){var a,b,c;if(z.message.attachmentAttrs)for(a=0;a<z.message.attachmentAttrs.length;a++)b={name:z.message.attachmentAttrs[a].filename,type:z.message.attachmentAttrs[a].mimetype,size:parseInt(z.message.attachmentAttrs[a].size)},c=new f.FileItem(z.uploader,b),c.progress=100,c.isUploaded=!0,c.isSuccess=!0,c.inlineUrl=z.message.attachmentAttrs[a].url,z.uploader.queue.push(c)}function s(a){a.isUploading?z.uploader.cancelItem(a):(z.message.$deleteAttachment(a.file.name),a.remove())}function t(){z.autosave&&k.cancel(z.autosave),d.cancel()}function u(){var a=q();z.message.$save().then(function(b){a.draftMailboxCtrl&&a.draftMailboxCtrl.selectedFolder.$filter().then(function(){a.draftMessageCtrl&&a.draftMessageCtrl.$state.go("mail.account.mailbox.message",{messageId:z.message.uid})}),e.show(e.simple().content(l("Your email has been saved")).position("top right").hideDelay(3e3))})}function v(){var a=q();z.autosave&&k.cancel(z.autosave),z.message.$send().then(function(b){a.draftMailboxCtrl&&a.draftMailboxCtrl.selectedFolder.$filter().then(function(){a.draftMessageCtrl&&a.draftMessageCtrl.close()}),a.originMailboxCtrl&&a.originMailboxCtrl.selectedFolder.$filter(),e.show(e.simple().content(l("Your email has been sent")).position("top right").hideDelay(3e3)),d.hide()})}function w(a){return n.$filterAll(a),n.$cards}function x(a,b){var c,d,e;return angular.isString(a)?a:(c=z.message.editable[b],a.$isList()?angular.isDefined(a.refs)&&a.refs.length?_.each(a.refs,function(a){a.email.length&&c.push(a.$shortFormat())}):(e=o.$find(a.container,a.c_name),e.$id().then(function(a){_.forEach(e.refs,function(a){a.email.length&&c.push(a.$shortFormat())})})):d=a.$shortFormat(),d?d:null)}function y(){z.message.$save(),p.defaults.SOGoMailAutoSave&&(z.autosave=k(z.autosaveDrafts,1e3*p.defaults.SOGoMailAutoSave*60))}var z=this,A=186;z.addRecipient=x,z.autocomplete={to:{},cc:{},bcc:{}},z.autosave=null,z.autosaveDrafts=y,z.hideCc=!0,z.hideBcc=!0,z.cancel=t,z.save=u,z.send=v,z.removeAttachment=s,z.contactFilter=w,z.identities=_.pluck(_.flatten(_.pluck(g,"identities")),"full"),z.recipientSeparatorKeys=[c.KEY_CODE.ENTER,c.KEY_CODE.COMMA,A],z.uploader=new f({url:h.$absolutePath({asDraft:!0})+"/save",autoUpload:!0,alias:"attachments",removeAfterUpload:!1,onSuccessItem:function(a,b,c,d){h.$setUID(b.uid),h.$reload({asDraft:!1}),a.inlineUrl=b.lastAttachmentAttrs[0].url},onCancelItem:function(a,b,c,d){h.$deleteAttachment(a.file.name),this.removeFromQueue(a)},onErrorItem:function(a,b,c,d){}}),"reply"==b.actionName?h.$reply().then(function(a){z.message=a,z.hideCc=!a.editable.cc||0===a.editable.cc.length,z.hideBcc=!a.editable.bcc||0===a.editable.bcc.length}):"replyall"==b.actionName?h.$replyAll().then(function(a){z.message=a,z.hideCc=!a.editable.cc||0===a.editable.cc.length,z.hideBcc=!a.editable.bcc||0===a.editable.bcc.length}):"forward"==b.actionName?h.$forward().then(function(a){z.message=a,r()}):angular.isDefined(h)&&(z.message=h,r()),angular.isDefined(i)&&(z.message.editable.to=_.union(z.message.editable.to,_.pluck(i,"full"))),p.ready().then(function(){p.defaults.SOGoMailAutoSave&&(z.autosave=k(z.autosaveDrafts,1e3*p.defaults.SOGoMailAutoSave*60)),z.localeCode=p.defaults.LocaleCode})}function b(a,b){a.closeToast=function(){b.hide()}}a.$inject=["$window","$stateParams","$mdConstant","$mdDialog","$mdToast","FileUploader","stateAccounts","stateMessage","stateRecipients","encodeUriFilter","$timeout","Dialog","AddressBook","Card","Preferences"],b.$inject=["$scope","$mdToast"],angular.module("SOGo.MailerUI").controller("SendMessageToastController",b).controller("MessageEditorController",a)}(),function(){"use strict";function a(){function a(a,b,c,d){d.pathToAttachment=c.sgImipPath}return{restrict:"A",link:a,controller:"sgImipController"}}function b(a,b){var c=this;a.delegateInvitation=!1,a.delegatedTo="",a.searchText="",a.userFilter=function(a){return b.$filter(a)},a.iCalendarAction=function(b){var d;"delegate"==b&&(d={receiveUpdates:!1,delegatedTo:a.delegatedTo.c_email}),a.viewer.message.$imipAction(c.pathToAttachment,b,d)}}b.$inject=["$scope","User"],angular.module("SOGo.MailerUI").controller("sgImipController",b).directive("sgImip",a)}(),function(){"use strict";function a(){function a(a,b,c,d){var e,f=b.parent();e=function(a){"IMG"==a.target.tagName&&f.toggleClass("sg-zoom")},b.on("click",e)}return{restrict:"A",link:a}}angular.module("SOGo.MailerUI").directive("sgZoomableImage",a)}();
//# sourceMappingURL=Mailer.services.js.map