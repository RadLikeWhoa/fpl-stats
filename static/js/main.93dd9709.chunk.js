(this["webpackJsonpfpl-stats"]=this["webpackJsonpfpl-stats"]||[]).push([[0],{184:function(e,t,a){e.exports=a(392)},194:function(e,t,a){},195:function(e,t,a){},196:function(e,t,a){},197:function(e,t,a){},198:function(e,t,a){},199:function(e,t,a){},390:function(e,t,a){},391:function(e,t,a){},392:function(e,t,a){"use strict";a.r(t);var n=a(1),r=a.n(n),c=a(14),i=a.n(c);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var l=a(25),o=a(17),s=a(7),u=a(9),d=a(10),m=a(13),f=a.n(m),p=a(26),_=a(15),v=Object(_.b)({name:"bootstrap",initialState:{loading:!0,data:void 0},reducers:{fetchBootstrapStart:function(e){e.loading=!0},fetchBootstrapSuccess:function(e,t){e.data=t.payload,e.loading=!1}}}),b=v.actions,h=b.fetchBootstrapStart,E=b.fetchBootstrapSuccess,g=v.reducer,N=(a(194),function(e){var t=Object(d.c)((function(e){return e.bootstrap.data})),a=null===t||void 0===t?void 0:t.elements.find((function(t){return t.id===e.id})),n=null===t||void 0===t?void 0:t.teams.find((function(e){return e.id===(null===a||void 0===a?void 0:a.team)})),c=null===t||void 0===t?void 0:t.element_types.find((function(e){return e.id===(null===a||void 0===a?void 0:a.element_type)}));return r.a.createElement("div",{className:"player"},r.a.createElement("img",{src:"https://fantasy.premierleague.com/dist/img/shirts/special/shirt_".concat(null===n||void 0===n?void 0:n.code).concat("GKP"===(null===c||void 0===c?void 0:c.singular_name_short)?"_1":"","-66.png"),alt:null===a||void 0===a?void 0:a.web_name,className:"player__shirt"}),r.a.createElement("div",{className:"player__detail"},r.a.createElement("div",{className:"player__name"},r.a.createElement("span",null,null===a||void 0===a?void 0:a.web_name)),r.a.createElement("div",{className:"player__info"},r.a.createElement("span",{className:"player__team",title:null===n||void 0===n?void 0:n.name},null===n||void 0===n?void 0:n.short_name),r.a.createElement("span",{className:"player__position"},null===c||void 0===c?void 0:c.singular_name_short))))}),j=(a(195),a(196),function(){return r.a.createElement("div",{className:"spinner"},r.a.createElement("div",{className:"spinner__item"}),r.a.createElement("div",{className:"spinner__item"}),r.a.createElement("div",{className:"spinner__item"}),r.a.createElement("div",{className:"spinner__item"}),r.a.createElement("div",{className:"spinner__item"}),r.a.createElement("div",{className:"spinner__item"}),r.a.createElement("div",{className:"spinner__item"}),r.a.createElement("div",{className:"spinner__item"}),r.a.createElement("div",{className:"spinner__item"}))}),O=a(4),y=a.n(O),k=function(e){return r.a.createElement("div",{className:y()("widget",{"widget--cloaked":e.cloaked})},r.a.createElement("h2",{className:"widget__title"},e.title),r.a.createElement("div",{className:"widget__content"},e.loading&&r.a.createElement("div",{className:"widget__loading"},r.a.createElement(j,null)),e.children))},w=(a(197),function(e){return r.a.createElement("div",{className:"team"},r.a.createElement("img",{src:"https://fantasy.premierleague.com/dist/img/shirts/special/shirt_".concat(e.team.code,"-66.png"),alt:e.team.short_name,className:"player__shirt"}),r.a.createElement("span",{className:"team__name"},e.team.name))}),S=function(e){var t=Number(e);return e&&!Number.isNaN(t)&&Number.isInteger(t)},x=function(e){return e.data.filter((function(e){return null!==e.multiplier})).length},B=function(e){return e.data.filter((function(e){return e.multiplier&&e.multiplier>0})).length},C=function(e){return e.data.filter((function(e){return 0===e.multiplier})).length},A=function(e){return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")},P=function(e){var t=Date.now();return e.filter((function(e){return 1e3*e.deadline_time_epoch<t}))},F=function(e){return e.name.split(" ").pop()||""},T={"3xc":"TC",bboost:"BB",freehit:"FH",wildcard:"WC"},L=Object(_.b)({name:"settings",initialState:{id:localStorage.getItem("id")||void 0},reducers:{setId:function(e,t){e.id=t.payload,e.id&&localStorage.setItem("id",e.id)}}}),D=L.actions.setId,I=L.reducer,K=(a(198),function(e){return r.a.createElement("button",{className:"button",type:e.type||"button",onClick:e.onClick,disabled:e.disabled},e.label)}),M=function(e){var t=r.a.useRef(null);return r.a.useEffect((function(){var a=function(a){a.target instanceof Node&&t.current&&!t.current.contains(a.target)&&e()};return t.current?document.addEventListener("click",a):document.removeEventListener("click",a),function(){return document.removeEventListener("click",a)}}),[t,e]),t},W=(a(199),function(e){var t=Object(n.useState)(""),a=Object(o.a)(t,2),c=a[0],i=a[1],l=Object(d.c)((function(e){return e.settings.id})),s=Object(d.b)(),u=Object(n.useCallback)((function(t){if(t){if(!l)return}else s(D(Number(c)));e.onClose&&e.onClose()}),[s,e,c,l]),m=M((function(){return u(!0)}));return Object(n.useEffect)((function(){var e=function(e){"Escape"===e.key&&u(!0)};return document.addEventListener("keyup",e),function(){return document.removeEventListener("keyup",e)}}),[u]),r.a.createElement("form",{onSubmit:function(e){u(!1),e.preventDefault()}},r.a.createElement("div",{className:"modal"},r.a.createElement("div",{className:"modal__element",ref:m},r.a.createElement("header",{className:"modal__header"},"Enter Your Team ID"),r.a.createElement("div",{className:"modal__body"},r.a.createElement("input",{className:"modal__input",type:"text",placeholder:"e.g. 4654486",value:c,onChange:function(e){return i(e.target.value)}})),r.a.createElement("footer",{className:"modal__footer"},r.a.createElement(K,{label:"Show Stats",type:"submit",disabled:!S(c)})))))}),R=Object(_.b)({name:"stats",initialState:{loading:!0,data:void 0,chips:void 0},reducers:{buildDataStart:function(e){e.loading=!0,e.data=void 0,e.chips=void 0},buildDataSuccess:function(e,t){e.data=t.payload.data,e.chips=t.payload.chips,e.loading=!1}}}),G=R.actions,H=G.buildDataStart,U=G.buildDataSuccess,z=function(){var e=Object(p.a)(f.a.mark((function e(t,a){var n;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("https://fpl-stats.herokuapp.com/",{headers:{"Target-URL":"https://fantasy.premierleague.com/api/entry/".concat(a,"/event/").concat(t,"/picks/"),Authorization:""}});case 2:return n=e.sent,e.next=5,n.json();case 5:return e.abrupt("return",e.sent);case 6:case"end":return e.stop()}}),e)})));return function(t,a){return e.apply(this,arguments)}}(),J=R.reducer,V=Object(_.b)({name:"history",initialState:{loading:!0,data:void 0},reducers:{fetchHistoryStart:function(e){e.loading=!0,e.data=void 0},fetchHistorySuccess:function(e,t){e.data=t.payload,e.loading=!1}}}),Y=V.actions,$=Y.fetchHistoryStart,q=Y.fetchHistorySuccess,Q=V.reducer,X=a(8),Z=a(155),ee=a(92),te=a.n(ee),ae=(a(390),{selection:x,start:B,bench:C,alphabet:function(e){return-1*e.element.web_name.toLowerCase().charCodeAt(0)}}),ne=[{value:"selection",label:"Most Selected"},{value:"start",label:"Most Started"},{value:"bench",label:"Most Benched"},{value:"alphabet",label:"Alphabetically"}],re=function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],a=Object.values(e).reduce((function(e,t){return[].concat(Object(u.a)(e),Object(u.a)(t))}),[]).map((function(e){var t=x(e),a=C(e),n=B(e);return Object(s.a)(Object(s.a)({},e),{},{benched:a,benchedPercentage:a/t*100,starts:n,startsPercentage:n/t*100})})),n=Object(u.a)(a).sort((function(e,t){var a=t.startsPercentage-e.startsPercentage;return 0===a?t.starts-e.starts:a})),c=Object(u.a)(a).sort((function(e,t){var a=t.benchedPercentage-e.benchedPercentage;return 0===a?t.benched-e.benched:a}));return r.a.createElement("ul",{className:"widget__list"},t&&n.slice(0,10).map((function(e){return r.a.createElement("li",{className:"widget__list__item"},r.a.createElement(N,{id:e.element.id}),r.a.createElement("span",null,e.startsPercentage.toFixed(1),"% (",e.starts,")"))})),!t&&c.slice(0,10).map((function(e){return r.a.createElement("li",{className:"widget__list__item"},r.a.createElement(N,{id:e.element.id}),r.a.createElement("span",null,e.benchedPercentage.toFixed(1),"% (",e.benched,")"))})))},ce=function(){var e=Object(n.useState)(void 0),t=Object(o.a)(e,2),a=t[0],c=t[1],i=Object(n.useState)(void 0),m=Object(o.a)(i,2),_=m[0],v=m[1],b=Object(n.useState)(!0),g=Object(o.a)(b,2),O=g[0],L=g[1],I=Object(n.useState)(ne[0]),M=Object(o.a)(I,2),R=M[0],G=M[1],J=Object(d.c)((function(e){return e.bootstrap.data})),V=Object(d.c)((function(e){return e.bootstrap.loading})),Y=Object(d.c)((function(e){return e.stats.data})),Q=Object(d.c)((function(e){return e.stats.chips})),ee=Object(d.c)((function(e){return e.stats.loading})),ce=Object(d.c)((function(e){return e.settings.id})),ie=Object(d.c)((function(e){return e.history.data})),le=Object(d.c)((function(e){return e.history.loading})),oe=Object(n.useRef)(null),se=Object(d.b)();return Object(n.useEffect)((function(){se(function(){var e=Object(p.a)(f.a.mark((function e(t){var a,n;return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t(h()),e.next=3,fetch("https://fpl-stats.herokuapp.com/",{headers:{"Target-URL":"https://fantasy.premierleague.com/api/bootstrap-static/",Authorization:""}});case 3:return a=e.sent,e.next=6,a.json();case 6:n=e.sent,t(E(n));case 8:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}());var e=te.a.parse(window.location.hash);e.team&&S(e.team)&&se(D(e.team))}),[se]),Object(n.useEffect)((function(){setTimeout((function(){oe&&oe.current&&oe.current.scrollTo(oe.current.scrollWidth,0)}),1)}),[Y]),Object(n.useEffect)((function(){var e;L(!ce),J&&ce&&(se(function(e,t){return function(){var a=Object(p.a)(f.a.mark((function a(n){var r,c,i;return f.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return n(H()),a.next=3,Promise.all(P(e.events).map(function(){var e=Object(p.a)(f.a.mark((function e(a){return f.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,z(a.id,t);case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()));case 3:r=a.sent,c={},i={},r.forEach((function(t){t.active_chip&&(i[t.entry_history.event]=t.active_chip),t.picks.forEach((function(a){c[a.element]||(c[a.element]={element:e.elements.find((function(e){return e.id===a.element})),data:e.events.filter((function(e){return e.id<t.entry_history.event})).map((function(e){return{event:e,multiplier:null}}))}),c[a.element]=Object(s.a)(Object(s.a)({},c[a.element]),{},{data:[].concat(Object(u.a)(c[a.element].data),[{event:e.events.find((function(e){return e.id===t.entry_history.event})),multiplier:a.multiplier}])})})),Object.keys(c).forEach((function(a){var n=Number(a);c[n].data.length<t.entry_history.event&&(c[n]=Object(s.a)(Object(s.a)({},c[n]),{},{data:[].concat(Object(u.a)(c[n].data),[{event:e.events.find((function(e){return e.id===t.entry_history.event})),multiplier:null}])}))}))})),n(U({data:Object.values(c).reduce((function(e,t){return Object(s.a)(Object(s.a)({},e),{},Object(l.a)({},t.element.element_type,[].concat(Object(u.a)(e[t.element.element_type]||[]),[t])))}),{}),chips:i}));case 8:case"end":return a.stop()}}),a)})));return function(e){return a.apply(this,arguments)}}()}(J,ce)),se((e=ce,function(){var t=Object(p.a)(f.a.mark((function t(a){var n,r;return f.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a($()),t.next=3,fetch("https://fpl-stats.herokuapp.com/",{headers:{"Target-URL":"https://fantasy.premierleague.com/api/entry/".concat(e,"/history/"),Authorization:""}});case 3:return n=t.sent,t.next=6,n.json();case 6:r=t.sent,a(q(r));case 8:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}())),window.location.hash=te.a.stringify({team:ce}))}),[ce,se,J]),Object(n.useEffect)((function(){c(Y?Object.entries(Y).reduce((function(e,t){var a=Object(o.a)(t,2),n=a[0],r=a[1];return Object(s.a)(Object(s.a)({},e),{},Object(l.a)({},Number(n),r.map((function(e){return Object(s.a)(Object(s.a)({},e),{},{data:e.data.filter((function(e){var t,a=null===J||void 0===J||null===(t=J.events.find((function(t){return t.id===e.event.id})))||void 0===t?void 0:t.top_element_info.points;return a&&a>0}))})}))))}),{}):void 0)}),[Y,J]),Object(n.useEffect)((function(){v(ie?Object(s.a)(Object(s.a)({},ie),{},{current:ie.current.filter((function(e){var t,a=null===J||void 0===J||null===(t=J.events.find((function(t){return t.id===e.event})))||void 0===t?void 0:t.top_element_info.points;return a&&a>0}))}):void 0)}),[ie,J]),r.a.createElement("div",{className:"app"},O&&r.a.createElement(W,{onClose:function(){return L(!1)}}),r.a.createElement("div",{className:y()("app__loading",{"app__loading--hidden":!V})},r.a.createElement(j,null)),r.a.createElement("div",{className:"app__content"},r.a.createElement("div",{className:"app__legend"},r.a.createElement("div",{className:"app__color"},r.a.createElement("div",{className:"app__color__indicator app__color__indicator--started"}),"Started"),r.a.createElement("div",{className:"app__color"},r.a.createElement("div",{className:"app__color__indicator app__color__indicator--benched"}),"Benched"),r.a.createElement("div",{className:"app__color"},r.a.createElement("div",{className:"app__color__indicator app__color__indicator--triple"}),"TC"),r.a.createElement("div",{className:"app__color"},r.a.createElement("div",{className:"app__color__indicator"}),"Not Selected")),r.a.createElement("div",{className:"app__meta"},r.a.createElement("label",{className:"app__meta__label"},"Sort by"),r.a.createElement(Z.a,{options:ne,value:R,onChange:function(e){return G(e)},styles:{container:function(e){return Object(s.a)(Object(s.a)({},e),{},{width:"100%"})},menu:function(e){return Object(s.a)(Object(s.a)({},e),{},{zIndex:20})}}})),r.a.createElement("div",{className:y()("dashboard",{"dashboard--cloaked":!ce})},ee&&r.a.createElement("div",{className:"dashboard__loading"},r.a.createElement(j,null)),r.a.createElement("div",{className:"dashboard__container",ref:oe},r.a.createElement("header",{className:"dashboard__header"},r.a.createElement("span",{className:"dashboard__heading"},"Player"),(null===J||void 0===J?void 0:J.events)&&P(J.events).filter((function(e){return e.top_element_info.points>0})).map((function(e){return r.a.createElement("span",{className:"dashboard__stat",key:e.id},F(e),Q&&Q[e.id]&&r.a.createElement("div",null,(t=Q[e.id],T[t]||null)));var t})),r.a.createElement("div",{className:"dashboard__totals"},r.a.createElement("span",{className:"dashboard__stat"},"Selected"),r.a.createElement("span",{className:"dashboard__stat"},"Starting"),r.a.createElement("span",{className:"dashboard__stat"},"Benched"))),r.a.createElement("ul",{className:"dashboard__list"},a&&Object.entries(a).map((function(e){var t,a=Object(o.a)(e,2),n=a[0],c=a[1];return r.a.createElement("div",{key:n},r.a.createElement("li",{className:"dashboard__category"},r.a.createElement("span",null,null===J||void 0===J||null===(t=J.element_types.find((function(e){return e.id===Number(n)})))||void 0===t?void 0:t.plural_name_short),r.a.createElement("span",null,c.length)),c.filter((function(e){return e.data.filter((function(e){return null!==e.multiplier})).length})).sort((function(e,t){return ae[R.value](t)-ae[R.value](e)})).map((function(e){return r.a.createElement("li",{key:e.element.id,className:"dashboard__item"},r.a.createElement("div",{className:"dashboard__player"},r.a.createElement(N,{id:e.element.id})),r.a.createElement("div",{className:"dashboard__stats"},e.data.map((function(e){return r.a.createElement("span",{key:e.event.id,className:y()("dashboard__stat",{"dashboard__stat--benched":0===e.multiplier,"dashboard__stat--triple":3===e.multiplier,"dashboard__stat--started":e.multiplier})})}))),r.a.createElement("div",{className:"dashboard__totals"},r.a.createElement("span",{className:"dashboard__stat"},x(e)),r.a.createElement("span",{className:"dashboard__stat"},(x(e)/e.data.length*100).toFixed(1),"%"),r.a.createElement("span",{className:"dashboard__stat"},B(e)),r.a.createElement("span",{className:"dashboard__stat"},(B(e)/e.data.length*100).toFixed(1),"%"),r.a.createElement("span",{className:"dashboard__stat"},C(e)),r.a.createElement("span",{className:"dashboard__stat"},(C(e)/e.data.length*100).toFixed(1),"%")))})))}))))),r.a.createElement("div",{className:"dashboard__widgets"},r.a.createElement(k,{title:"Top Selections",loading:ee,cloaked:!ce},a&&function(e){var t=Object.values(e).reduce((function(e,t){return[].concat(Object(u.a)(e),Object(u.a)(t))}),[]).sort((function(e,t){return x(t)-x(e)}));return r.a.createElement("ul",{className:"widget__list"},t.slice(0,10).map((function(e){return r.a.createElement("li",{className:"widget__list__item"},r.a.createElement(N,{id:e.element.id}),x(e))})))}(a)),r.a.createElement(k,{title:"Top Starters",loading:ee,cloaked:!ce},a&&function(e){var t=Object.values(e).reduce((function(e,t){return[].concat(Object(u.a)(e),Object(u.a)(t))}),[]).sort((function(e,t){return B(t)-B(e)}));return r.a.createElement("ul",{className:"widget__list"},t.slice(0,10).map((function(e){return r.a.createElement("li",{className:"widget__list__item"},r.a.createElement(N,{id:e.element.id}),B(e))})))}(a)),r.a.createElement(k,{title:"Top Benchwarmers",loading:ee,cloaked:!ce},a&&function(e){var t=Object.values(e).reduce((function(e,t){return[].concat(Object(u.a)(e),Object(u.a)(t))}),[]).sort((function(e,t){return C(t)-C(e)}));return r.a.createElement("ul",{className:"widget__list"},t.slice(0,10).map((function(e){return r.a.createElement("li",{className:"widget__list__item"},r.a.createElement(N,{id:e.element.id}),C(e))})))}(a)),r.a.createElement(k,{title:"Most Consistent Starters",loading:ee,cloaked:!ce},a&&re(a,!0)),r.a.createElement(k,{title:"Most Consistent Benchwarmers",loading:ee,cloaked:!ce},a&&re(a)),r.a.createElement(k,{title:"Breakdown by Team",loading:ee,cloaked:!ce},a&&J&&function(e,t){var a=Object.values(e).reduce((function(e,t){return[].concat(Object(u.a)(e),Object(u.a)(t.map((function(e){return e.element.team}))))}),[]).reduce((function(e,t){return Object(s.a)(Object(s.a)({},e),{},Object(l.a)({},t,(e[Number(t)]||0)+1))}),{}),n=Object(u.a)(t.teams).sort((function(e,t){return(a[t.id]||0)-(a[e.id]||0)}));return r.a.createElement("ul",{className:"widget__list"},n.map((function(e){return r.a.createElement("li",{className:"widget__list__item"},r.a.createElement(w,{team:e}),r.a.createElement("span",null,a[e.id]||0))})))}(a,J)),r.a.createElement(k,{title:"Breakdown by Position",loading:ee,cloaked:!ce},a&&J&&function(e,t){var a=Object.entries(e).reduce((function(e,t){var a=Object(o.a)(t,2),n=a[0],r=a[1];return Object(s.a)(Object(s.a)({},e),{},Object(l.a)({},n,r.length))}),{});return r.a.createElement("ul",{className:"widget__list"},Object.entries(a).map((function(e){var a,n=Object(o.a)(e,2),c=n[0],i=n[1];return r.a.createElement("li",{className:"widget__list__item"},r.a.createElement("span",null,null===(a=t.element_types.find((function(e){return e.id===Number(c)})))||void 0===a?void 0:a.plural_name),r.a.createElement("span",null,Number(i)))})))}(a,J))),r.a.createElement("div",{className:"dashboard__graphs"},r.a.createElement(k,{title:"Overall Rank Evolution",loading:le,cloaked:!ce},_&&J&&function(e,t){var a=e.current.map((function(e){var a=t.events.find((function(t){return t.id===e.event}));return{name:"GW ".concat(a?F(a):e.event),value:e.overall_rank}}));return r.a.createElement("div",{className:"chart chart--reversed"},r.a.createElement(X.d,{height:300,width:"100%"},r.a.createElement(X.b,{data:a,margin:{bottom:45,left:15,right:15}},r.a.createElement(X.a,{type:"monotone",dataKey:"value",stroke:"#177B47",fill:"#177B47"}),r.a.createElement(X.g,{reversed:!0,tickFormatter:function(e){return function(e){return e>999999?"".concat((e/1e6).toFixed(0),"M"):e>999?"".concat((e/1e3).toFixed(0),"K"):"".concat(e)}(e)},interval:"preserveStart"}),r.a.createElement(X.f,{dataKey:"name",angle:-90,textAnchor:"end"}),r.a.createElement(X.c,{stroke:"#ccc",strokeDasharray:"3 3"}),r.a.createElement(X.e,{isAnimationActive:!1,formatter:function(e){return[A(Number(e)),""]},separator:""}))))}(_,J)),r.a.createElement(k,{title:"Gameweek Points",loading:le,cloaked:!ce},_&&J&&function(e,t){var a=e.current.map((function(e){var a=t.events.find((function(t){return t.id===e.event}));return{name:"GW ".concat(a?F(a):e.event),points:e.points,bench:e.points_on_bench}}));return r.a.createElement("div",{className:"chart"},r.a.createElement(X.d,{height:300,width:"100%"},r.a.createElement(X.b,{data:a,margin:{bottom:45,left:15,right:15}},r.a.createElement(X.a,{type:"monotone",dataKey:"points",stroke:"#177B47",fill:"#177B47"}),r.a.createElement(X.a,{type:"monotone",dataKey:"bench",stroke:"#00FF87",fill:"#00FF87"}),r.a.createElement(X.g,null),r.a.createElement(X.f,{dataKey:"name",angle:-90,textAnchor:"end"}),r.a.createElement(X.c,{stroke:"#ccc",strokeDasharray:"3 3"}),r.a.createElement(X.e,{isAnimationActive:!1,formatter:function(e,t){return[e,t.charAt(0).toUpperCase()+t.slice(1)]},separator:": "}))))}(_,J)),r.a.createElement(k,{title:"Team Value Evolution",loading:le,cloaked:!ce},_&&J&&function(e,t){var a=e.current.map((function(e){var a=t.events.find((function(t){return t.id===e.event}));return{name:"GW ".concat(a?F(a):e.event),value:e.value+e.bank}}));return r.a.createElement("div",{className:"chart"},r.a.createElement(X.d,{height:300,width:"100%"},r.a.createElement(X.b,{data:a,margin:{bottom:45,left:15,right:15}},r.a.createElement(X.a,{type:"monotone",dataKey:"value",stroke:"#177B47",fill:"#177B47"}),r.a.createElement(X.g,{tickFormatter:function(e){return"\xa3".concat(e/10)},domain:["auto","auto"]}),r.a.createElement(X.f,{dataKey:"name",angle:-90,textAnchor:"end"}),r.a.createElement(X.c,{stroke:"#ccc",strokeDasharray:"3 3"}),r.a.createElement(X.e,{isAnimationActive:!1,formatter:function(e,t){return["\xa3".concat(Number(e)/10),t.charAt(0).toUpperCase()+t.slice(1)]},separator:": "}))))}(_,J))),r.a.createElement("div",{className:"app__legal"},r.a.createElement("p",null,"FPL Stats uses data from the official Premier League Fantasy API. This site is not affiliated with the Premier League."))),void 0!==ce&&r.a.createElement("div",{className:"app__footer"},r.a.createElement("div",{className:"app__footer__content"},r.a.createElement(K,{onClick:function(){return L(!0)},label:"Change Team"}))))},ie=a(12),le=Object(ie.c)({bootstrap:g,stats:J,settings:I,history:Q});a(391);i.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(d.a,{store:Object(_.a)({reducer:le,middleware:Object(u.a)(Object(_.c)())})},r.a.createElement(ce,null))),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[184,1,2]]]);
//# sourceMappingURL=main.93dd9709.chunk.js.map