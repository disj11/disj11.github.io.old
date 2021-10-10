/*! For license information please see cd7d5f864fc9e15ed8adef086269b0aeff617554-1c0296fc321c875787c2.js.LICENSE.txt */
(self.webpackChunkblog=self.webpackChunkblog||[]).push([[84],{7214:function(t,e,o){var n,r;r=void 0!==o.g?o.g:"undefined"!=typeof window?window:this,n=function(){return function(t){"use strict";var e={ignore:"[data-scroll-ignore]",header:null,topOnEmptyHash:!0,speed:500,speedAsDuration:!1,durationMax:null,durationMin:null,clip:!0,offset:0,easing:"easeInOutCubic",customEasing:null,updateURL:!0,popstate:!0,emitEvents:!0},o=function(){var t={};return Array.prototype.forEach.call(arguments,(function(e){for(var o in e){if(!e.hasOwnProperty(o))return;t[o]=e[o]}})),t},n=function(t){"#"===t.charAt(0)&&(t=t.substr(1));for(var e,o=String(t),n=o.length,r=-1,a="",l=o.charCodeAt(0);++r<n;){if(0===(e=o.charCodeAt(r)))throw new InvalidCharacterError("Invalid character: the input contains U+0000.");a+=1<=e&&e<=31||127==e||0===r&&48<=e&&e<=57||1===r&&48<=e&&e<=57&&45===l?"\\"+e.toString(16)+" ":128<=e||45===e||95===e||48<=e&&e<=57||65<=e&&e<=90||97<=e&&e<=122?o.charAt(r):"\\"+o.charAt(r)}return"#"+a},r=function(){return Math.max(document.body.scrollHeight,document.documentElement.scrollHeight,document.body.offsetHeight,document.documentElement.offsetHeight,document.body.clientHeight,document.documentElement.clientHeight)},a=function(e){return e?(o=e,parseInt(t.getComputedStyle(o).height,10)+e.offsetTop):0;var o},l=function(e,o,n){0===e&&document.body.focus(),n||(e.focus(),document.activeElement!==e&&(e.setAttribute("tabindex","-1"),e.focus(),e.style.outline="none"),t.scrollTo(0,o))},i=function(e,o,n,r){if(o.emitEvents&&"function"==typeof t.CustomEvent){var a=new CustomEvent(e,{bubbles:!0,detail:{anchor:n,toggle:r}});document.dispatchEvent(a)}};return function(c,s){var u,f,d,h,m={cancelScroll:function(t){cancelAnimationFrame(h),h=null,t||i("scrollCancel",u)},animateScroll:function(n,c,s){m.cancelScroll();var f=o(u||e,s||{}),p="[object Number]"===Object.prototype.toString.call(n),v=p||!n.tagName?null:n;if(p||v){var g=t.pageYOffset;f.header&&!d&&(d=document.querySelector(f.header));var y,b,E,S,w,O,I,T,L=a(d),M=p?n:function(e,o,n,a){var l=0;if(e.offsetParent)for(;l+=e.offsetTop,e=e.offsetParent;);return l=Math.max(l-o-n,0),a&&(l=Math.min(l,r()-t.innerHeight)),l}(v,L,parseInt("function"==typeof f.offset?f.offset(n,c):f.offset,10),f.clip),C=M-g,N=r(),Y=0,A=(y=C,E=(b=f).speedAsDuration?b.speed:Math.abs(y/1e3*b.speed),b.durationMax&&E>b.durationMax?b.durationMax:b.durationMin&&E<b.durationMin?b.durationMin:parseInt(E,10)),x=function e(o){var r,a,s;S||(S=o),Y+=o-S,O=g+C*(a=w=1<(w=0===A?0:Y/A)?1:w,"easeInQuad"===(r=f).easing&&(s=a*a),"easeOutQuad"===r.easing&&(s=a*(2-a)),"easeInOutQuad"===r.easing&&(s=a<.5?2*a*a:(4-2*a)*a-1),"easeInCubic"===r.easing&&(s=a*a*a),"easeOutCubic"===r.easing&&(s=--a*a*a+1),"easeInOutCubic"===r.easing&&(s=a<.5?4*a*a*a:(a-1)*(2*a-2)*(2*a-2)+1),"easeInQuart"===r.easing&&(s=a*a*a*a),"easeOutQuart"===r.easing&&(s=1- --a*a*a*a),"easeInOutQuart"===r.easing&&(s=a<.5?8*a*a*a*a:1-8*--a*a*a*a),"easeInQuint"===r.easing&&(s=a*a*a*a*a),"easeOutQuint"===r.easing&&(s=1+--a*a*a*a*a),"easeInOutQuint"===r.easing&&(s=a<.5?16*a*a*a*a*a:1+16*--a*a*a*a*a),r.customEasing&&(s=r.customEasing(a)),s||a),t.scrollTo(0,Math.floor(O)),function(e,o){var r=t.pageYOffset;if(e==o||r==o||(g<o&&t.innerHeight+r)>=N)return m.cancelScroll(!0),l(n,o,p),i("scrollStop",f,n,c),!(h=S=null)}(O,M)||(h=t.requestAnimationFrame(e),S=o)};0===t.pageYOffset&&t.scrollTo(0,0),I=n,T=f,p||history.pushState&&T.updateURL&&history.pushState({smoothScroll:JSON.stringify(T),anchor:I.id},document.title,I===document.documentElement?"#top":"#"+I.id),"matchMedia"in t&&t.matchMedia("(prefers-reduced-motion)").matches?l(n,Math.floor(M),!1):(i("scrollStart",f,n,c),m.cancelScroll(!0),t.requestAnimationFrame(x))}}},p=function(e){if(!e.defaultPrevented&&!(0!==e.button||e.metaKey||e.ctrlKey||e.shiftKey)&&"closest"in e.target&&(f=e.target.closest(c))&&"a"===f.tagName.toLowerCase()&&!e.target.closest(u.ignore)&&f.hostname===t.location.hostname&&f.pathname===t.location.pathname&&/#/.test(f.href)){var o,r;try{o=n(decodeURIComponent(f.hash))}catch(e){o=n(f.hash)}if("#"===o){if(!u.topOnEmptyHash)return;r=document.documentElement}else r=document.querySelector(o);(r=r||"#top"!==o?r:document.documentElement)&&(e.preventDefault(),function(e){if(history.replaceState&&e.updateURL&&!history.state){var o=t.location.hash;o=o||"",history.replaceState({smoothScroll:JSON.stringify(e),anchor:o||t.pageYOffset},document.title,o||t.location.href)}}(u),m.animateScroll(r,f))}},v=function(t){if(null!==history.state&&history.state.smoothScroll&&history.state.smoothScroll===JSON.stringify(u)){var e=history.state.anchor;"string"==typeof e&&e&&!(e=document.querySelector(n(history.state.anchor)))||m.animateScroll(e,null,{updateURL:!1})}};return m.destroy=function(){u&&(document.removeEventListener("click",p,!1),t.removeEventListener("popstate",v,!1),m.cancelScroll(),h=d=f=u=null)},function(){if(!("querySelector"in document&&"addEventListener"in t&&"requestAnimationFrame"in t&&"closest"in t.Element.prototype))throw"Smooth Scroll: This browser does not support the required JavaScript methods and browser APIs.";m.destroy(),u=o(e,s||{}),d=u.header?document.querySelector(u.header):null,document.addEventListener("click",p,!1),u.updateURL&&u.popstate&&t.addEventListener("popstate",v,!1)}(),m}}(r)}.apply(e,[]),void 0===n||(t.exports=n)},9634:function(t){!function(){"use strict";t.exports={polyfill:function(){var t=window,e=document;if(!("scrollBehavior"in e.documentElement.style)||!0===t.__forceSmoothScrollPolyfill__){var o,n=t.HTMLElement||t.Element,r={scroll:t.scroll||t.scrollTo,scrollBy:t.scrollBy,elementScroll:n.prototype.scroll||i,scrollIntoView:n.prototype.scrollIntoView},a=t.performance&&t.performance.now?t.performance.now.bind(t.performance):Date.now,l=(o=t.navigator.userAgent,new RegExp(["MSIE ","Trident/","Edge/"].join("|")).test(o)?1:0);t.scroll=t.scrollTo=function(){void 0!==arguments[0]&&(!0!==c(arguments[0])?m.call(t,e.body,void 0!==arguments[0].left?~~arguments[0].left:t.scrollX||t.pageXOffset,void 0!==arguments[0].top?~~arguments[0].top:t.scrollY||t.pageYOffset):r.scroll.call(t,void 0!==arguments[0].left?arguments[0].left:"object"!=typeof arguments[0]?arguments[0]:t.scrollX||t.pageXOffset,void 0!==arguments[0].top?arguments[0].top:void 0!==arguments[1]?arguments[1]:t.scrollY||t.pageYOffset))},t.scrollBy=function(){void 0!==arguments[0]&&(c(arguments[0])?r.scrollBy.call(t,void 0!==arguments[0].left?arguments[0].left:"object"!=typeof arguments[0]?arguments[0]:0,void 0!==arguments[0].top?arguments[0].top:void 0!==arguments[1]?arguments[1]:0):m.call(t,e.body,~~arguments[0].left+(t.scrollX||t.pageXOffset),~~arguments[0].top+(t.scrollY||t.pageYOffset)))},n.prototype.scroll=n.prototype.scrollTo=function(){if(void 0!==arguments[0])if(!0!==c(arguments[0])){var t=arguments[0].left,e=arguments[0].top;m.call(this,this,void 0===t?this.scrollLeft:~~t,void 0===e?this.scrollTop:~~e)}else{if("number"==typeof arguments[0]&&void 0===arguments[1])throw new SyntaxError("Value could not be converted");r.elementScroll.call(this,void 0!==arguments[0].left?~~arguments[0].left:"object"!=typeof arguments[0]?~~arguments[0]:this.scrollLeft,void 0!==arguments[0].top?~~arguments[0].top:void 0!==arguments[1]?~~arguments[1]:this.scrollTop)}},n.prototype.scrollBy=function(){void 0!==arguments[0]&&(!0!==c(arguments[0])?this.scroll({left:~~arguments[0].left+this.scrollLeft,top:~~arguments[0].top+this.scrollTop,behavior:arguments[0].behavior}):r.elementScroll.call(this,void 0!==arguments[0].left?~~arguments[0].left+this.scrollLeft:~~arguments[0]+this.scrollLeft,void 0!==arguments[0].top?~~arguments[0].top+this.scrollTop:~~arguments[1]+this.scrollTop))},n.prototype.scrollIntoView=function(){if(!0!==c(arguments[0])){var o=d(this),n=o.getBoundingClientRect(),a=this.getBoundingClientRect();o!==e.body?(m.call(this,o,o.scrollLeft+a.left-n.left,o.scrollTop+a.top-n.top),"fixed"!==t.getComputedStyle(o).position&&t.scrollBy({left:n.left,top:n.top,behavior:"smooth"})):t.scrollBy({left:a.left,top:a.top,behavior:"smooth"})}else r.scrollIntoView.call(this,void 0===arguments[0]||arguments[0])}}function i(t,e){this.scrollLeft=t,this.scrollTop=e}function c(t){if(null===t||"object"!=typeof t||void 0===t.behavior||"auto"===t.behavior||"instant"===t.behavior)return!0;if("object"==typeof t&&"smooth"===t.behavior)return!1;throw new TypeError("behavior member of ScrollOptions "+t.behavior+" is not a valid value for enumeration ScrollBehavior.")}function s(t,e){return"Y"===e?t.clientHeight+l<t.scrollHeight:"X"===e?t.clientWidth+l<t.scrollWidth:void 0}function u(e,o){var n=t.getComputedStyle(e,null)["overflow"+o];return"auto"===n||"scroll"===n}function f(t){var e=s(t,"Y")&&u(t,"Y"),o=s(t,"X")&&u(t,"X");return e||o}function d(t){for(;t!==e.body&&!1===f(t);)t=t.parentNode||t.host;return t}function h(e){var o,n,r,l,i=(a()-e.startTime)/468;l=i=i>1?1:i,o=.5*(1-Math.cos(Math.PI*l)),n=e.startX+(e.x-e.startX)*o,r=e.startY+(e.y-e.startY)*o,e.method.call(e.scrollable,n,r),n===e.x&&r===e.y||t.requestAnimationFrame(h.bind(t,e))}function m(o,n,l){var c,s,u,f,d=a();o===e.body?(c=t,s=t.scrollX||t.pageXOffset,u=t.scrollY||t.pageYOffset,f=r.scroll):(c=o,s=o.scrollLeft,u=o.scrollTop,f=i),h({scrollable:c,method:f,startTime:d,startX:s,startY:u,x:n,y:l})}}}}()},6726:function(t,e,o){"use strict";o.d(e,{w:function(){return l}});var n=o(7294),r=o(5444),a=o(2359),l=function(){return n.createElement(r.StaticQuery,{query:i,render:function(t){var e=t.site.siteMetadata,o=e.author,l=e.social,i=e.introduction;return n.createElement("div",{className:"bio"},n.createElement("div",{className:"author"},n.createElement("div",{className:"author-description"},n.createElement(a.G,{image:t.avatar.childImageSharp.gatsbyImageData,className:"author-image",alt:o,style:{borderRadius:"100%"}}),n.createElement("div",{className:"author-name"},n.createElement("span",{className:"author-name-prefix"},"Written by"),n.createElement(r.Link,{to:"/about",className:"author-name-content"},n.createElement("span",null,"@",o)),n.createElement("div",{className:"author-introduction"},i),n.createElement("p",{className:"author-socials"},l.instagram&&n.createElement("a",{href:"https://www.instagram.com/"+l.instagram},"Instagram"),l.github&&n.createElement("a",{href:"https://github.com/"+l.github},"GitHub"),l.medium&&n.createElement("a",{href:"https://medium.com/"+l.medium},"Medium"),l.twitter&&n.createElement("a",{href:"https://twitter.com/"+l.twitter},"Twitter"),l.facebook&&n.createElement("a",{href:"https://www.facebook.com/"+l.facebook},"Facebook"),l.linkedin&&n.createElement("a",{href:"https://www.linkedin.com/in/"+l.linkedin+"/"},"LinkedIn"))))))}})},i="3078735561"},1198:function(t,e,o){"use strict";o.d(e,{S:function(){return c},o:function(){return s},go:function(){return u}});var n,r=o(7214),a=o.n(r),l=o(9634),i=o.n(l);function c(){return i().polyfill(),n=new(a())('a[href*="#"]',{speed:500,speedAsDuration:!0})}function s(){if(!n)throw Error("Not founded SmoothScroll instance");return n.destroy(),n=null}function u(t){if(!n)throw Error("Not founded SmoothScroll instance");return n.animateScroll(t),n}}}]);
//# sourceMappingURL=cd7d5f864fc9e15ed8adef086269b0aeff617554-1c0296fc321c875787c2.js.map