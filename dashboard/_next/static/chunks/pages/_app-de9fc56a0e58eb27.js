(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[888],{4444:function(e,t,l){"use strict";l.d(t,{BH:function(){return Deferred},L:function(){return base64urlEncodeWithoutPadding},LL:function(){return ErrorFactory},P0:function(){return getDefaultEmulatorHostnameAndPort},Pz:function(){return getExperimentalSetting},Sg:function(){return createMockUserToken},ZR:function(){return FirebaseError},aH:function(){return getDefaultAppConfig},b$:function(){return isReactNative},eu:function(){return validateIndexedDBOpenable},hl:function(){return isIndexedDBAvailable},m9:function(){return getModularInstance},ne:function(){return createSubscribe},pd:function(){return extractQuerystring},q4:function(){return getDefaultEmulatorHost},ru:function(){return isBrowserExtension},tV:function(){return base64Decode},uI:function(){return isMobileCordova},vZ:function(){return function deepEqual(e,t){if(e===t)return!0;let l=Object.keys(e),u=Object.keys(t);for(let h of l){if(!u.includes(h))return!1;let l=e[h],d=t[h];if(isObject(l)&&isObject(d)){if(!deepEqual(l,d))return!1}else if(l!==d)return!1}for(let e of u)if(!l.includes(e))return!1;return!0}},w1:function(){return isIE},xO:function(){return querystring},xb:function(){return isEmpty},z$:function(){return getUA},zd:function(){return querystringDecode}});var u=l(3454);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let stringToByteArray$1=function(e){let t=[],l=0;for(let u=0;u<e.length;u++){let h=e.charCodeAt(u);h<128?t[l++]=h:(h<2048?t[l++]=h>>6|192:((64512&h)==55296&&u+1<e.length&&(64512&e.charCodeAt(u+1))==56320?(h=65536+((1023&h)<<10)+(1023&e.charCodeAt(++u)),t[l++]=h>>18|240,t[l++]=h>>12&63|128):t[l++]=h>>12|224,t[l++]=h>>6&63|128),t[l++]=63&h|128)}return t},byteArrayToString=function(e){let t=[],l=0,u=0;for(;l<e.length;){let h=e[l++];if(h<128)t[u++]=String.fromCharCode(h);else if(h>191&&h<224){let d=e[l++];t[u++]=String.fromCharCode((31&h)<<6|63&d)}else if(h>239&&h<365){let d=e[l++],f=e[l++],m=e[l++],g=((7&h)<<18|(63&d)<<12|(63&f)<<6|63&m)-65536;t[u++]=String.fromCharCode(55296+(g>>10)),t[u++]=String.fromCharCode(56320+(1023&g))}else{let d=e[l++],f=e[l++];t[u++]=String.fromCharCode((15&h)<<12|(63&d)<<6|63&f)}}return t.join("")},h={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:"function"==typeof atob,encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();let l=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,u=[];for(let t=0;t<e.length;t+=3){let h=e[t],d=t+1<e.length,f=d?e[t+1]:0,m=t+2<e.length,g=m?e[t+2]:0,_=h>>2,b=(3&h)<<4|f>>4,E=(15&f)<<2|g>>6,k=63&g;m||(k=64,d||(E=64)),u.push(l[_],l[b],l[E],l[k])}return u.join("")},encodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(e):this.encodeByteArray(stringToByteArray$1(e),t)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):byteArrayToString(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();let l=t?this.charToByteMapWebSafe_:this.charToByteMap_,u=[];for(let t=0;t<e.length;){let h=l[e.charAt(t++)],d=t<e.length,f=d?l[e.charAt(t)]:0;++t;let m=t<e.length,g=m?l[e.charAt(t)]:64;++t;let _=t<e.length,b=_?l[e.charAt(t)]:64;if(++t,null==h||null==f||null==g||null==b)throw new DecodeBase64StringError;let E=h<<2|f>>4;if(u.push(E),64!==g){let e=f<<4&240|g>>2;if(u.push(e),64!==b){let e=g<<6&192|b;u.push(e)}}}return u},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}};let DecodeBase64StringError=class DecodeBase64StringError extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}};let base64Encode=function(e){let t=stringToByteArray$1(e);return h.encodeByteArray(t,!0)},base64urlEncodeWithoutPadding=function(e){return base64Encode(e).replace(/\./g,"")},base64Decode=function(e){try{return h.decodeString(e,!0)}catch(e){console.error("base64Decode failed: ",e)}return null},getDefaultsFromGlobal=()=>/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if(void 0!==l.g)return l.g;throw Error("Unable to locate global object.")})().__FIREBASE_DEFAULTS__,getDefaultsFromEnvVariable=()=>{if(void 0===u||void 0===u.env)return;let e=u.env.__FIREBASE_DEFAULTS__;if(e)return JSON.parse(e)},getDefaultsFromCookie=()=>{let e;if("undefined"==typeof document)return;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch(e){return}let t=e&&base64Decode(e[1]);return t&&JSON.parse(t)},getDefaults=()=>{try{return getDefaultsFromGlobal()||getDefaultsFromEnvVariable()||getDefaultsFromCookie()}catch(e){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);return}},getDefaultEmulatorHost=e=>{var t,l;return null===(l=null===(t=getDefaults())||void 0===t?void 0:t.emulatorHosts)||void 0===l?void 0:l[e]},getDefaultEmulatorHostnameAndPort=e=>{let t=getDefaultEmulatorHost(e);if(!t)return;let l=t.lastIndexOf(":");if(l<=0||l+1===t.length)throw Error(`Invalid host ${t} with no separate hostname and port!`);let u=parseInt(t.substring(l+1),10);return"["===t[0]?[t.substring(1,l-1),u]:[t.substring(0,l),u]},getDefaultAppConfig=()=>{var e;return null===(e=getDefaults())||void 0===e?void 0:e.config},getExperimentalSetting=e=>{var t;return null===(t=getDefaults())||void 0===t?void 0:t[`_${e}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Deferred=class Deferred{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,l)=>{t?this.reject(t):this.resolve(l),"function"==typeof e&&(this.promise.catch(()=>{}),1===e.length?e(t):e(t,l))}}};/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function createMockUserToken(e,t){if(e.uid)throw Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');let l=t||"demo-project",u=e.iat||0,h=e.sub||e.user_id;if(!h)throw Error("mockUserToken must contain 'sub' or 'user_id' field!");let d=Object.assign({iss:`https://securetoken.google.com/${l}`,aud:l,iat:u,exp:u+3600,auth_time:u,sub:h,user_id:h,firebase:{sign_in_provider:"custom",identities:{}}},e);return[base64urlEncodeWithoutPadding(JSON.stringify({alg:"none",type:"JWT"})),base64urlEncodeWithoutPadding(JSON.stringify(d)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function getUA(){return"undefined"!=typeof navigator&&"string"==typeof navigator.userAgent?navigator.userAgent:""}function isMobileCordova(){return"undefined"!=typeof window&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(getUA())}function isBrowserExtension(){let e="object"==typeof chrome?chrome.runtime:"object"==typeof browser?browser.runtime:void 0;return"object"==typeof e&&void 0!==e.id}function isReactNative(){return"object"==typeof navigator&&"ReactNative"===navigator.product}function isIE(){let e=getUA();return e.indexOf("MSIE ")>=0||e.indexOf("Trident/")>=0}function isIndexedDBAvailable(){try{return"object"==typeof indexedDB}catch(e){return!1}}function validateIndexedDBOpenable(){return new Promise((e,t)=>{try{let l=!0,u="validate-browser-context-for-indexeddb-analytics-module",h=self.indexedDB.open(u);h.onsuccess=()=>{h.result.close(),l||self.indexedDB.deleteDatabase(u),e(!0)},h.onupgradeneeded=()=>{l=!1},h.onerror=()=>{var e;t((null===(e=h.error)||void 0===e?void 0:e.message)||"")}}catch(e){t(e)}})}let FirebaseError=class FirebaseError extends Error{constructor(e,t,l){super(t),this.code=e,this.customData=l,this.name="FirebaseError",Object.setPrototypeOf(this,FirebaseError.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,ErrorFactory.prototype.create)}};let ErrorFactory=class ErrorFactory{constructor(e,t,l){this.service=e,this.serviceName=t,this.errors=l}create(e,...t){let l=t[0]||{},u=`${this.service}/${e}`,h=this.errors[e],f=h?h.replace(d,(e,t)=>{let u=l[t];return null!=u?String(u):`<${t}?>`}):"Error",m=`${this.serviceName}: ${f} (${u}).`,g=new FirebaseError(u,m,l);return g}};let d=/\{\$([^}]+)}/g;function isEmpty(e){for(let t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}function isObject(e){return null!==e&&"object"==typeof e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function querystring(e){let t=[];for(let[l,u]of Object.entries(e))Array.isArray(u)?u.forEach(e=>{t.push(encodeURIComponent(l)+"="+encodeURIComponent(e))}):t.push(encodeURIComponent(l)+"="+encodeURIComponent(u));return t.length?"&"+t.join("&"):""}function querystringDecode(e){let t={},l=e.replace(/^\?/,"").split("&");return l.forEach(e=>{if(e){let[l,u]=e.split("=");t[decodeURIComponent(l)]=decodeURIComponent(u)}}),t}function extractQuerystring(e){let t=e.indexOf("?");if(!t)return"";let l=e.indexOf("#",t);return e.substring(t,l>0?l:void 0)}function createSubscribe(e,t){let l=new ObserverProxy(e,t);return l.subscribe.bind(l)}let ObserverProxy=class ObserverProxy{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(e=>{this.error(e)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,l){let u;if(void 0===e&&void 0===t&&void 0===l)throw Error("Missing Observer.");void 0===(u=!function(e,t){if("object"!=typeof e||null===e)return!1;for(let l of t)if(l in e&&"function"==typeof e[l])return!0;return!1}(e,["next","error","complete"])?{next:e,error:t,complete:l}:e).next&&(u.next=noop),void 0===u.error&&(u.error=noop),void 0===u.complete&&(u.complete=noop);let h=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?u.error(this.finalError):u.complete()}catch(e){}}),this.observers.push(u),h}unsubscribeOne(e){void 0!==this.observers&&void 0!==this.observers[e]&&(delete this.observers[e],this.observerCount-=1,0===this.observerCount&&void 0!==this.onNoObservers&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(void 0!==this.observers&&void 0!==this.observers[e])try{t(this.observers[e])}catch(e){"undefined"!=typeof console&&console.error&&console.error(e)}})}close(e){this.finalized||(this.finalized=!0,void 0!==e&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}};function noop(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function getModularInstance(e){return e&&e._delegate?e._delegate:e}},3454:function(e,t,l){"use strict";var u,h;e.exports=(null==(u=l.g.process)?void 0:u.env)&&"object"==typeof(null==(h=l.g.process)?void 0:h.env)?l.g.process:l(7663)},6840:function(e,t,l){(window.__NEXT_P=window.__NEXT_P||[]).push(["/_app",function(){return l(4807)}])},8549:function(e,t,l){"use strict";l.d(t,{H:function(){return AuthProvider},a:function(){return useAuth}});var u=l(5893),h=l(7294),d=l(9451),f=l(4417);let m=(0,d.v0)(f.l),g=new d.hJ,signIn=async(e,t)=>{try{return await (0,d.e5)(m,e,t)}catch(e){throw console.error("Error signing in:",e),e}},auth_signUp=async(e,t)=>{try{return await (0,d.Xb)(m,e,t)}catch(e){throw console.error("Error signing up:",e),e}},signInWithGoogle=async()=>{try{return await (0,d.rh)(m,g)}catch(e){throw console.error("Error signing in with Google:",e),e}},logOut=async()=>{try{return await (0,d.w7)(m)}catch(e){throw console.error("Error signing out:",e),e}},onAuthStateChangedListener=e=>{try{return console.log("Setting up auth state listener"),(0,d.Aj)(m,e,t=>{console.error("Auth state change error:",t),e(null)})}catch(t){return console.error("Failed to set up auth state listener:",t),setTimeout(()=>e(null),100),()=>{}}};var _=l(6100);let b=(0,h.createContext)(null),useAuth=()=>{let e=(0,h.useContext)(b);if(!e)throw Error("useAuth must be used within an AuthProvider");return e},AuthProvider=e=>{let{children:t}=e,[l,d]=(0,h.useState)(null),[m,g]=(0,h.useState)(!0);(0,h.useEffect)(()=>{console.log("Setting up auth state listener");let e=setTimeout(()=>{m&&(console.warn("Auth state timeout - forcing load complete"),g(!1))},1e4),t=onAuthStateChangedListener(async t=>{if(console.log("Auth state changed:",t?"User logged in":"No user"),d(t),g(!1),clearTimeout(e),t){let e=(0,_.JU)(f.db,"users",t.uid);try{var l;await (0,_.pl)(e,{email:t.email,uid:t.uid,lastLogin:(0,_.Bt)(),displayName:t.displayName,photoURL:t.photoURL},{merge:!0});let u=await (0,_.QT)(e);u.exists()&&(null===(l=u.data())||void 0===l?void 0:l.totalMessageCount)!==void 0||await (0,_.r7)(e,{totalMessageCount:0}),console.log("User document created/updated in Firestore for:",t.uid)}catch(e){console.error("Error creating/updating user document:",e)}}});return()=>{t(),clearTimeout(e)}},[]);let login=async(e,t)=>signIn(e,t),loginWithGoogle=async()=>signInWithGoogle(),signup=async(e,t)=>auth_signUp(e,t),logout=async()=>logOut();return(0,u.jsx)(b.Provider,{value:{currentUser:l,loading:m,login,loginWithGoogle,signup,logout},children:t})}},4417:function(e,t,l){"use strict";l.d(t,{db:function(){return f},l:function(){return d}});var u=l(3977),h=l(6100);let d=(0,u.ZF)({apiKey:"AIzaSyBZiJPTs7dMccVgFV-YoTejnhy1bZNFEQY",authDomain:"heartglowai.firebaseapp.com",projectId:"heartglowai",storageBucket:"heartglowai.firebasestorage.app",messagingSenderId:"196565711798",appId:"1:196565711798:web:79e2b0320fd8e74ab0df17"}),f=(0,h.ad)(d)},4807:function(e,t,l){"use strict";l.r(t),l.d(t,{default:function(){return App},getRouteWithBasePath:function(){return getRouteWithBasePath}});var u=l(5893);l(2352);var h=l(7294),d=l(9008),f=l.n(d),m=l(8549);function getRouteWithBasePath(e){return"".concat("/dashboard").concat(e)}function App(e){let{Component:t,pageProps:l}=e;return(0,h.useEffect)(()=>{let e=localStorage.getItem("theme");"dark"===e||!e&&window.matchMedia("(prefers-color-scheme: dark)").matches?(document.documentElement.classList.add("dark"),localStorage.setItem("theme","dark")):(document.documentElement.classList.remove("dark"),localStorage.setItem("theme","light"))},[]),(0,h.useEffect)(()=>{let e="1744645590424",t=window.localStorage.getItem("HeartGlowVersion"),l=window.localStorage.getItem("HeartGlowLastVersion");(t!==e||l!==e)&&(window.localStorage.setItem("HeartGlowVersion",e),window.localStorage.setItem("HeartGlowLastVersion",e),console.log("New version detected, consider refreshing for latest updates."))},[]),(0,u.jsxs)(u.Fragment,{children:[(0,u.jsxs)(f(),{children:[(0,u.jsx)("meta",{name:"viewport",content:"width=device-width, initial-scale=1.0"}),(0,u.jsx)("meta",{httpEquiv:"Cache-Control",content:"no-cache, no-store, must-revalidate"}),(0,u.jsx)("meta",{httpEquiv:"Pragma",content:"no-cache"}),(0,u.jsx)("meta",{httpEquiv:"Expires",content:"0"}),(0,u.jsx)("title",{children:"HeartGlow AI"}),(0,u.jsx)("meta",{property:"og:title",content:"HeartGlow AI: Communicate Authentically, Connect Deeply"}),(0,u.jsx)("meta",{property:"og:description",content:"Struggling to express yourself? HeartGlow AI uses emotional intelligence to help you craft authentic messages, navigate tough conversations, and build stronger bonds. Say what matters, gently."}),(0,u.jsx)("meta",{property:"og:image",content:"https://heartglowai.com/assets/og-image.png"}),(0,u.jsx)("meta",{property:"og:url",content:"https://heartglowai.com/"}),(0,u.jsx)("meta",{property:"og:type",content:"website"}),(0,u.jsx)("meta",{name:"twitter:card",content:"summary_large_image"})]}),(0,u.jsx)(m.H,{children:(0,u.jsx)(t,{...l})})]})}},2352:function(){},7663:function(e){!function(){var t={229:function(e){var t,l,u,h=e.exports={};function defaultSetTimout(){throw Error("setTimeout has not been defined")}function defaultClearTimeout(){throw Error("clearTimeout has not been defined")}function runTimeout(e){if(t===setTimeout)return setTimeout(e,0);if((t===defaultSetTimout||!t)&&setTimeout)return t=setTimeout,setTimeout(e,0);try{return t(e,0)}catch(l){try{return t.call(null,e,0)}catch(l){return t.call(this,e,0)}}}!function(){try{t="function"==typeof setTimeout?setTimeout:defaultSetTimout}catch(e){t=defaultSetTimout}try{l="function"==typeof clearTimeout?clearTimeout:defaultClearTimeout}catch(e){l=defaultClearTimeout}}();var d=[],f=!1,m=-1;function cleanUpNextTick(){f&&u&&(f=!1,u.length?d=u.concat(d):m=-1,d.length&&drainQueue())}function drainQueue(){if(!f){var e=runTimeout(cleanUpNextTick);f=!0;for(var t=d.length;t;){for(u=d,d=[];++m<t;)u&&u[m].run();m=-1,t=d.length}u=null,f=!1,function(e){if(l===clearTimeout)return clearTimeout(e);if((l===defaultClearTimeout||!l)&&clearTimeout)return l=clearTimeout,clearTimeout(e);try{l(e)}catch(t){try{return l.call(null,e)}catch(t){return l.call(this,e)}}}(e)}}function Item(e,t){this.fun=e,this.array=t}function noop(){}h.nextTick=function(e){var t=Array(arguments.length-1);if(arguments.length>1)for(var l=1;l<arguments.length;l++)t[l-1]=arguments[l];d.push(new Item(e,t)),1!==d.length||f||runTimeout(drainQueue)},Item.prototype.run=function(){this.fun.apply(null,this.array)},h.title="browser",h.browser=!0,h.env={},h.argv=[],h.version="",h.versions={},h.on=noop,h.addListener=noop,h.once=noop,h.off=noop,h.removeListener=noop,h.removeAllListeners=noop,h.emit=noop,h.prependListener=noop,h.prependOnceListener=noop,h.listeners=function(e){return[]},h.binding=function(e){throw Error("process.binding is not supported")},h.cwd=function(){return"/"},h.chdir=function(e){throw Error("process.chdir is not supported")},h.umask=function(){return 0}}},l={};function __nccwpck_require__(e){var u=l[e];if(void 0!==u)return u.exports;var h=l[e]={exports:{}},d=!0;try{t[e](h,h.exports,__nccwpck_require__),d=!1}finally{d&&delete l[e]}return h.exports}__nccwpck_require__.ab="//";var u=__nccwpck_require__(229);e.exports=u}()},9008:function(e,t,l){e.exports=l(9201)},5816:function(e,t,l){"use strict";let u,h;l.d(t,{Jn:function(){return ey},qX:function(){return _getProvider},Xd:function(){return _registerComponent},Mq:function(){return getApp},C6:function(){return getApps},ZF:function(){return initializeApp},KN:function(){return registerVersion}});var d,f=l(8463),m=l(3333),g=l(4444);let instanceOfAny=(e,t)=>t.some(t=>e instanceof t),_=new WeakMap,b=new WeakMap,E=new WeakMap,k=new WeakMap,L=new WeakMap,V={get(e,t,l){if(e instanceof IDBTransaction){if("done"===t)return b.get(e);if("objectStoreNames"===t)return e.objectStoreNames||E.get(e);if("store"===t)return l.objectStoreNames[1]?void 0:l.objectStore(l.objectStoreNames[0])}return wrap_idb_value_wrap(e[t])},set:(e,t,l)=>(e[t]=l,!0),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function wrap_idb_value_wrap(e){var t;if(e instanceof IDBRequest)return function(e){let t=new Promise((t,l)=>{let unlisten=()=>{e.removeEventListener("success",success),e.removeEventListener("error",error)},success=()=>{t(wrap_idb_value_wrap(e.result)),unlisten()},error=()=>{l(e.error),unlisten()};e.addEventListener("success",success),e.addEventListener("error",error)});return t.then(t=>{t instanceof IDBCursor&&_.set(t,e)}).catch(()=>{}),L.set(t,e),t}(e);if(k.has(e))return k.get(e);let l="function"==typeof(t=e)?t!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?(h||(h=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(t)?function(...e){return t.apply(unwrap(this),e),wrap_idb_value_wrap(_.get(this))}:function(...e){return wrap_idb_value_wrap(t.apply(unwrap(this),e))}:function(e,...l){let u=t.call(unwrap(this),e,...l);return E.set(u,e.sort?e.sort():[e]),wrap_idb_value_wrap(u)}:(t instanceof IDBTransaction&&function(e){if(b.has(e))return;let t=new Promise((t,l)=>{let unlisten=()=>{e.removeEventListener("complete",complete),e.removeEventListener("error",error),e.removeEventListener("abort",error)},complete=()=>{t(),unlisten()},error=()=>{l(e.error||new DOMException("AbortError","AbortError")),unlisten()};e.addEventListener("complete",complete),e.addEventListener("error",error),e.addEventListener("abort",error)});b.set(e,t)}(t),instanceOfAny(t,u||(u=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])))?new Proxy(t,V):t;return l!==e&&(k.set(e,l),L.set(l,e)),l}let unwrap=e=>L.get(e),z=["get","getKey","getAll","getAllKeys","count"],ee=["put","add","delete","clear"],er=new Map;function getMethod(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&"string"==typeof t))return;if(er.get(t))return er.get(t);let l=t.replace(/FromIndex$/,""),u=t!==l,h=ee.includes(l);if(!(l in(u?IDBIndex:IDBObjectStore).prototype)||!(h||z.includes(l)))return;let method=async function(e,...t){let d=this.transaction(e,h?"readwrite":"readonly"),f=d.store;return u&&(f=f.index(t.shift())),(await Promise.all([f[l](...t),h&&d.done]))[0]};return er.set(t,method),method}V={...d=V,get:(e,t,l)=>getMethod(e,t)||d.get(e,t,l),has:(e,t)=>!!getMethod(e,t)||d.has(e,t)};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let PlatformLoggerServiceImpl=class PlatformLoggerServiceImpl{constructor(e){this.container=e}getPlatformInfoString(){let e=this.container.getProviders();return e.map(e=>{if(!function(e){let t=e.getComponent();return(null==t?void 0:t.type)==="VERSION"}(e))return null;{let t=e.getImmediate();return`${t.library}/${t.version}`}}).filter(e=>e).join(" ")}};let eo="@firebase/app",eh="0.9.13",ec=new m.Yd("@firebase/app"),ef="[DEFAULT]",em={[eo]:"fire-core","@firebase/app-compat":"fire-core-compat","@firebase/analytics":"fire-analytics","@firebase/analytics-compat":"fire-analytics-compat","@firebase/app-check":"fire-app-check","@firebase/app-check-compat":"fire-app-check-compat","@firebase/auth":"fire-auth","@firebase/auth-compat":"fire-auth-compat","@firebase/database":"fire-rtdb","@firebase/database-compat":"fire-rtdb-compat","@firebase/functions":"fire-fn","@firebase/functions-compat":"fire-fn-compat","@firebase/installations":"fire-iid","@firebase/installations-compat":"fire-iid-compat","@firebase/messaging":"fire-fcm","@firebase/messaging-compat":"fire-fcm-compat","@firebase/performance":"fire-perf","@firebase/performance-compat":"fire-perf-compat","@firebase/remote-config":"fire-rc","@firebase/remote-config-compat":"fire-rc-compat","@firebase/storage":"fire-gcs","@firebase/storage-compat":"fire-gcs-compat","@firebase/firestore":"fire-fst","@firebase/firestore-compat":"fire-fst-compat","fire-js":"fire-js",firebase:"fire-js-all"},ep=new Map,eg=new Map;function _registerComponent(e){let t=e.name;if(eg.has(t))return ec.debug(`There were multiple attempts to register component ${t}.`),!1;for(let l of(eg.set(t,e),ep.values()))!function(e,t){try{e.container.addComponent(t)}catch(l){ec.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,l)}}(l,e);return!0}function _getProvider(e,t){let l=e.container.getProvider("heartbeat").getImmediate({optional:!0});return l&&l.triggerHeartbeat(),e.container.getProvider(t)}let e_=new g.LL("app","Firebase",{"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}."});/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let FirebaseAppImpl=class FirebaseAppImpl{constructor(e,t,l){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=l,this.container.addComponent(new f.wA("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw e_.create("app-deleted",{appName:this._name})}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ey="9.23.0";function initializeApp(e,t={}){let l=e;if("object"!=typeof t){let e=t;t={name:e}}let u=Object.assign({name:ef,automaticDataCollectionEnabled:!1},t),h=u.name;if("string"!=typeof h||!h)throw e_.create("bad-app-name",{appName:String(h)});if(l||(l=(0,g.aH)()),!l)throw e_.create("no-options");let d=ep.get(h);if(d){if((0,g.vZ)(l,d.options)&&(0,g.vZ)(u,d.config))return d;throw e_.create("duplicate-app",{appName:h})}let m=new f.H0(h);for(let e of eg.values())m.addComponent(e);let _=new FirebaseAppImpl(l,u,m);return ep.set(h,_),_}function getApp(e=ef){let t=ep.get(e);if(!t&&e===ef&&(0,g.aH)())return initializeApp();if(!t)throw e_.create("no-app",{appName:e});return t}function getApps(){return Array.from(ep.values())}function registerVersion(e,t,l){var u;let h=null!==(u=em[e])&&void 0!==u?u:e;l&&(h+=`-${l}`);let d=h.match(/\s|\//),m=t.match(/\s|\//);if(d||m){let e=[`Unable to register library "${h}" with version "${t}":`];d&&e.push(`library name "${h}" contains illegal characters (whitespace or "/")`),d&&m&&e.push("and"),m&&e.push(`version name "${t}" contains illegal characters (whitespace or "/")`),ec.warn(e.join(" "));return}_registerComponent(new f.wA(`${h}-version`,()=>({library:h,version:t}),"VERSION"))}let ev="firebase-heartbeat-store",ew=null;function getDbPromise(){return ew||(ew=(function(e,t,{blocked:l,upgrade:u,blocking:h,terminated:d}={}){let f=indexedDB.open(e,1),m=wrap_idb_value_wrap(f);return u&&f.addEventListener("upgradeneeded",e=>{u(wrap_idb_value_wrap(f.result),e.oldVersion,e.newVersion,wrap_idb_value_wrap(f.transaction),e)}),l&&f.addEventListener("blocked",e=>l(e.oldVersion,e.newVersion,e)),m.then(e=>{d&&e.addEventListener("close",()=>d()),h&&e.addEventListener("versionchange",e=>h(e.oldVersion,e.newVersion,e))}).catch(()=>{}),m})("firebase-heartbeat-database",0,{upgrade:(e,t)=>{0===t&&e.createObjectStore(ev)}}).catch(e=>{throw e_.create("idb-open",{originalErrorMessage:e.message})})),ew}async function readHeartbeatsFromIndexedDB(e){try{let t=await getDbPromise(),l=await t.transaction(ev).objectStore(ev).get(computeKey(e));return l}catch(e){if(e instanceof g.ZR)ec.warn(e.message);else{let t=e_.create("idb-get",{originalErrorMessage:null==e?void 0:e.message});ec.warn(t.message)}}}async function writeHeartbeatsToIndexedDB(e,t){try{let l=await getDbPromise(),u=l.transaction(ev,"readwrite"),h=u.objectStore(ev);await h.put(t,computeKey(e)),await u.done}catch(e){if(e instanceof g.ZR)ec.warn(e.message);else{let t=e_.create("idb-set",{originalErrorMessage:null==e?void 0:e.message});ec.warn(t.message)}}}function computeKey(e){return`${e.name}!${e.options.appId}`}let HeartbeatServiceImpl=class HeartbeatServiceImpl{constructor(e){this.container=e,this._heartbeatsCache=null;let t=this.container.getProvider("app").getImmediate();this._storage=new HeartbeatStorageImpl(t),this._heartbeatsCachePromise=this._storage.read().then(e=>(this._heartbeatsCache=e,e))}async triggerHeartbeat(){let e=this.container.getProvider("platform-logger").getImmediate(),t=e.getPlatformInfoString(),l=getUTCDateString();return(null===this._heartbeatsCache&&(this._heartbeatsCache=await this._heartbeatsCachePromise),this._heartbeatsCache.lastSentHeartbeatDate===l||this._heartbeatsCache.heartbeats.some(e=>e.date===l))?void 0:(this._heartbeatsCache.heartbeats.push({date:l,agent:t}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(e=>{let t=new Date(e.date).valueOf(),l=Date.now();return l-t<=2592e6}),this._storage.overwrite(this._heartbeatsCache))}async getHeartbeatsHeader(){if(null===this._heartbeatsCache&&await this._heartbeatsCachePromise,null===this._heartbeatsCache||0===this._heartbeatsCache.heartbeats.length)return"";let e=getUTCDateString(),{heartbeatsToSend:t,unsentEntries:l}=function(e,t=1024){let l=[],u=e.slice();for(let h of e){let e=l.find(e=>e.agent===h.agent);if(e){if(e.dates.push(h.date),countBytes(l)>t){e.dates.pop();break}}else if(l.push({agent:h.agent,dates:[h.date]}),countBytes(l)>t){l.pop();break}u=u.slice(1)}return{heartbeatsToSend:l,unsentEntries:u}}(this._heartbeatsCache.heartbeats),u=(0,g.L)(JSON.stringify({version:2,heartbeats:t}));return this._heartbeatsCache.lastSentHeartbeatDate=e,l.length>0?(this._heartbeatsCache.heartbeats=l,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),u}};function getUTCDateString(){let e=new Date;return e.toISOString().substring(0,10)}let HeartbeatStorageImpl=class HeartbeatStorageImpl{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return!!(0,g.hl)()&&(0,g.eu)().then(()=>!0).catch(()=>!1)}async read(){let e=await this._canUseIndexedDBPromise;if(!e)return{heartbeats:[]};{let e=await readHeartbeatsFromIndexedDB(this.app);return e||{heartbeats:[]}}}async overwrite(e){var t;let l=await this._canUseIndexedDBPromise;if(l){let l=await this.read();return writeHeartbeatsToIndexedDB(this.app,{lastSentHeartbeatDate:null!==(t=e.lastSentHeartbeatDate)&&void 0!==t?t:l.lastSentHeartbeatDate,heartbeats:e.heartbeats})}}async add(e){var t;let l=await this._canUseIndexedDBPromise;if(l){let l=await this.read();return writeHeartbeatsToIndexedDB(this.app,{lastSentHeartbeatDate:null!==(t=e.lastSentHeartbeatDate)&&void 0!==t?t:l.lastSentHeartbeatDate,heartbeats:[...l.heartbeats,...e.heartbeats]})}}};function countBytes(e){return(0,g.L)(JSON.stringify({version:2,heartbeats:e})).length}_registerComponent(new f.wA("platform-logger",e=>new PlatformLoggerServiceImpl(e),"PRIVATE")),_registerComponent(new f.wA("heartbeat",e=>new HeartbeatServiceImpl(e),"PRIVATE")),registerVersion(eo,eh,""),registerVersion(eo,eh,"esm2017"),registerVersion("fire-js","")},8463:function(e,t,l){"use strict";l.d(t,{H0:function(){return ComponentContainer},wA:function(){return Component}});var u=l(4444);let Component=class Component{constructor(e,t,l){this.name=e,this.instanceFactory=t,this.type=l,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let h="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Provider=class Provider{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){let t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){let e=new u.BH;if(this.instancesDeferred.set(t,e),this.isInitialized(t)||this.shouldAutoInitialize())try{let l=this.getOrInitializeService({instanceIdentifier:t});l&&e.resolve(l)}catch(e){}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;let l=this.normalizeInstanceIdentifier(null==e?void 0:e.identifier),u=null!==(t=null==e?void 0:e.optional)&&void 0!==t&&t;if(this.isInitialized(l)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:l})}catch(e){if(u)return null;throw e}else{if(u)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,this.shouldAutoInitialize()){if("EAGER"===e.instantiationMode)try{this.getOrInitializeService({instanceIdentifier:h})}catch(e){}for(let[e,t]of this.instancesDeferred.entries()){let l=this.normalizeInstanceIdentifier(e);try{let e=this.getOrInitializeService({instanceIdentifier:l});t.resolve(e)}catch(e){}}}}clearInstance(e=h){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){let e=Array.from(this.instances.values());await Promise.all([...e.filter(e=>"INTERNAL"in e).map(e=>e.INTERNAL.delete()),...e.filter(e=>"_delete"in e).map(e=>e._delete())])}isComponentSet(){return null!=this.component}isInitialized(e=h){return this.instances.has(e)}getOptions(e=h){return this.instancesOptions.get(e)||{}}initialize(e={}){let{options:t={}}=e,l=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(l))throw Error(`${this.name}(${l}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);let u=this.getOrInitializeService({instanceIdentifier:l,options:t});for(let[e,t]of this.instancesDeferred.entries()){let h=this.normalizeInstanceIdentifier(e);l===h&&t.resolve(u)}return u}onInit(e,t){var l;let u=this.normalizeInstanceIdentifier(t),h=null!==(l=this.onInitCallbacks.get(u))&&void 0!==l?l:new Set;h.add(e),this.onInitCallbacks.set(u,h);let d=this.instances.get(u);return d&&e(d,u),()=>{h.delete(e)}}invokeOnInitCallbacks(e,t){let l=this.onInitCallbacks.get(t);if(l)for(let u of l)try{u(e,t)}catch(e){}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let l=this.instances.get(e);if(!l&&this.component&&(l=this.component.instanceFactory(this.container,{instanceIdentifier:e===h?void 0:e,options:t}),this.instances.set(e,l),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(l,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,l)}catch(e){}return l||null}normalizeInstanceIdentifier(e=h){return this.component?this.component.multipleInstances?e:h:e}shouldAutoInitialize(){return!!this.component&&"EXPLICIT"!==this.component.instantiationMode}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ComponentContainer=class ComponentContainer{constructor(e){this.name=e,this.providers=new Map}addComponent(e){let t=this.getProvider(e.name);if(t.isComponentSet())throw Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){let t=this.getProvider(e.name);t.isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);let t=new Provider(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}},3333:function(e,t,l){"use strict";var u,h;l.d(t,{Yd:function(){return Logger},in:function(){return u}});/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let d=[];(h=u||(u={}))[h.DEBUG=0]="DEBUG",h[h.VERBOSE=1]="VERBOSE",h[h.INFO=2]="INFO",h[h.WARN=3]="WARN",h[h.ERROR=4]="ERROR",h[h.SILENT=5]="SILENT";let f={debug:u.DEBUG,verbose:u.VERBOSE,info:u.INFO,warn:u.WARN,error:u.ERROR,silent:u.SILENT},m=u.INFO,g={[u.DEBUG]:"log",[u.VERBOSE]:"log",[u.INFO]:"info",[u.WARN]:"warn",[u.ERROR]:"error"},defaultLogHandler=(e,t,...l)=>{if(t<e.logLevel)return;let u=new Date().toISOString(),h=g[t];if(h)console[h](`[${u}]  ${e.name}:`,...l);else throw Error(`Attempted to log a message with an invalid logType (value: ${t})`)};let Logger=class Logger{constructor(e){this.name=e,this._logLevel=m,this._logHandler=defaultLogHandler,this._userLogHandler=null,d.push(this)}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in u))throw TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel="string"==typeof e?f[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if("function"!=typeof e)throw TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,u.DEBUG,...e),this._logHandler(this,u.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,u.VERBOSE,...e),this._logHandler(this,u.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,u.INFO,...e),this._logHandler(this,u.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,u.WARN,...e),this._logHandler(this,u.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,u.ERROR,...e),this._logHandler(this,u.ERROR,...e)}}},3977:function(e,t,l){"use strict";l.d(t,{C6:function(){return u.C6},ZF:function(){return u.ZF}});var u=l(5816);/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(0,u.KN)("firebase","9.23.0","app")},9451:function(e,t,l){"use strict";l.d(t,{hJ:function(){return GoogleAuthProvider},Xb:function(){return createUserWithEmailAndPassword},v0:function(){return getAuth},Aj:function(){return onAuthStateChanged},e5:function(){return signInWithEmailAndPassword},rh:function(){return signInWithPopup},w7:function(){return signOut}});var u,h=l(4444),d=l(5816);function __rest(e,t){var l={};for(var u in e)Object.prototype.hasOwnProperty.call(e,u)&&0>t.indexOf(u)&&(l[u]=e[u]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var h=0,u=Object.getOwnPropertySymbols(e);h<u.length;h++)0>t.indexOf(u[h])&&Object.prototype.propertyIsEnumerable.call(e,u[h])&&(l[u[h]]=e[u[h]]);return l}"function"==typeof SuppressedError&&SuppressedError;var f=l(3333),m=l(8463);function _prodErrorMap(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}let g=new h.LL("auth","Firebase",_prodErrorMap()),_=new f.Yd("@firebase/auth");function _logError(e,...t){_.logLevel<=f.in.ERROR&&_.error(`Auth (${d.Jn}): ${e}`,...t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _fail(e,...t){throw createErrorInternal(e,...t)}function _createError(e,...t){return createErrorInternal(e,...t)}function _errorWithCustomMessage(e,t,l){let u=Object.assign(Object.assign({},_prodErrorMap()),{[t]:l}),d=new h.LL("auth","Firebase",u);return d.create(t,{appName:e.name})}function createErrorInternal(e,...t){if("string"!=typeof e){let l=t[0],u=[...t.slice(1)];return u[0]&&(u[0].appName=e.name),e._errorFactory.create(l,...u)}return g.create(e,...t)}function _assert(e,t,...l){if(!e)throw createErrorInternal(t,...l)}function debugFail(e){let t="INTERNAL ASSERTION FAILED: "+e;throw _logError(t),Error(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _getCurrentUrl(){var e;return"undefined"!=typeof self&&(null===(e=self.location)||void 0===e?void 0:e.href)||""}function _getCurrentScheme(){var e;return"undefined"!=typeof self&&(null===(e=self.location)||void 0===e?void 0:e.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Delay=class Delay{constructor(e,t){this.shortDelay=e,this.longDelay=t,t>e||debugFail("Short delay should be less than long delay!"),this.isMobile=(0,h.uI)()||(0,h.b$)()}get(){return!("undefined"!=typeof navigator&&navigator&&"onLine"in navigator&&"boolean"==typeof navigator.onLine&&("http:"===_getCurrentScheme()||"https:"===_getCurrentScheme()||(0,h.ru)()||"connection"in navigator))||navigator.onLine?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _emulatorUrl(e,t){e.emulator||debugFail("Emulator should always be set here");let{url:l}=e.emulator;return t?`${l}${t.startsWith("/")?t.slice(1):t}`:l}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let FetchProvider=class FetchProvider{static initialize(e,t,l){this.fetchImpl=e,t&&(this.headersImpl=t),l&&(this.responseImpl=l)}static fetch(){return this.fetchImpl?this.fetchImpl:"undefined"!=typeof self&&"fetch"in self?self.fetch:void debugFail("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){return this.headersImpl?this.headersImpl:"undefined"!=typeof self&&"Headers"in self?self.Headers:void debugFail("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){return this.responseImpl?this.responseImpl:"undefined"!=typeof self&&"Response"in self?self.Response:void debugFail("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let b={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"},E=new Delay(3e4,6e4);function _addTidIfNecessary(e,t){return e.tenantId&&!t.tenantId?Object.assign(Object.assign({},t),{tenantId:e.tenantId}):t}async function _performApiRequest(e,t,l,u,d={}){return _performFetchWithErrorHandling(e,d,async()=>{let d={},f={};u&&("GET"===t?f=u:d={body:JSON.stringify(u)});let m=(0,h.xO)(Object.assign({key:e.config.apiKey},f)).slice(1),g=await e._getAdditionalHeaders();return g["Content-Type"]="application/json",e.languageCode&&(g["X-Firebase-Locale"]=e.languageCode),FetchProvider.fetch()(_getFinalTarget(e,e.config.apiHost,l,m),Object.assign({method:t,headers:g,referrerPolicy:"no-referrer"},d))})}async function _performFetchWithErrorHandling(e,t,l){e._canInitEmulator=!1;let u=Object.assign(Object.assign({},b),t);try{let t=new NetworkTimeout(e),h=await Promise.race([l(),t.promise]);t.clearNetworkTimeout();let d=await h.json();if("needConfirmation"in d)throw _makeTaggedError(e,"account-exists-with-different-credential",d);if(h.ok&&!("errorMessage"in d))return d;{let t=h.ok?d.errorMessage:d.error.message,[l,f]=t.split(" : ");if("FEDERATED_USER_ID_ALREADY_LINKED"===l)throw _makeTaggedError(e,"credential-already-in-use",d);if("EMAIL_EXISTS"===l)throw _makeTaggedError(e,"email-already-in-use",d);if("USER_DISABLED"===l)throw _makeTaggedError(e,"user-disabled",d);let m=u[l]||l.toLowerCase().replace(/[_\s]+/g,"-");if(f)throw _errorWithCustomMessage(e,m,f);_fail(e,m)}}catch(t){if(t instanceof h.ZR)throw t;_fail(e,"network-request-failed",{message:String(t)})}}async function _performSignInRequest(e,t,l,u,h={}){let d=await _performApiRequest(e,t,l,u,h);return"mfaPendingCredential"in d&&_fail(e,"multi-factor-auth-required",{_serverResponse:d}),d}function _getFinalTarget(e,t,l,u){let h=`${t}${l}?${u}`;return e.config.emulator?_emulatorUrl(e.config,h):`${e.config.apiScheme}://${h}`}let NetworkTimeout=class NetworkTimeout{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((e,t)=>{this.timer=setTimeout(()=>t(_createError(this.auth,"network-request-failed")),E.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}};function _makeTaggedError(e,t,l){let u={appName:e.name};l.email&&(u.email=l.email),l.phoneNumber&&(u.phoneNumber=l.phoneNumber);let h=_createError(e,t,u);return h.customData._tokenResponse=l,h}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function deleteAccount(e,t){return _performApiRequest(e,"POST","/v1/accounts:delete",t)}async function getAccountInfo(e,t){return _performApiRequest(e,"POST","/v1/accounts:lookup",t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function utcTimestampToDateString(e){if(e)try{let t=new Date(Number(e));if(!isNaN(t.getTime()))return t.toUTCString()}catch(e){}}async function getIdTokenResult(e,t=!1){let l=(0,h.m9)(e),u=await l.getIdToken(t),d=_parseToken(u);_assert(d&&d.exp&&d.auth_time&&d.iat,l.auth,"internal-error");let f="object"==typeof d.firebase?d.firebase:void 0,m=null==f?void 0:f.sign_in_provider;return{claims:d,token:u,authTime:utcTimestampToDateString(secondsStringToMilliseconds(d.auth_time)),issuedAtTime:utcTimestampToDateString(secondsStringToMilliseconds(d.iat)),expirationTime:utcTimestampToDateString(secondsStringToMilliseconds(d.exp)),signInProvider:m||null,signInSecondFactor:(null==f?void 0:f.sign_in_second_factor)||null}}function secondsStringToMilliseconds(e){return 1e3*Number(e)}function _parseToken(e){let[t,l,u]=e.split(".");if(void 0===t||void 0===l||void 0===u)return _logError("JWT malformed, contained fewer than 3 sections"),null;try{let e=(0,h.tV)(l);if(!e)return _logError("Failed to decode base64 JWT payload"),null;return JSON.parse(e)}catch(e){return _logError("Caught error parsing JWT payload as JSON",null==e?void 0:e.toString()),null}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _logoutIfInvalidated(e,t,l=!1){if(l)return t;try{return await t}catch(t){throw t instanceof h.ZR&&function({code:e}){return"auth/user-disabled"===e||"auth/user-token-expired"===e}(t)&&e.auth.currentUser===e&&await e.auth.signOut(),t}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ProactiveRefresh=class ProactiveRefresh{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,null!==this.timerId&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){let e=this.errorBackoff;return this.errorBackoff=Math.min(2*this.errorBackoff,96e4),e}{this.errorBackoff=3e4;let e=null!==(t=this.user.stsTokenManager.expirationTime)&&void 0!==t?t:0,l=e-Date.now()-3e5;return Math.max(0,l)}}schedule(e=!1){if(!this.isRunning)return;let t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(null==e?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let UserMetadata=class UserMetadata{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=utcTimestampToDateString(this.lastLoginAt),this.creationTime=utcTimestampToDateString(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _reloadWithoutSaving(e){var t;let l=e.auth,u=await e.getIdToken(),h=await _logoutIfInvalidated(e,getAccountInfo(l,{idToken:u}));_assert(null==h?void 0:h.users.length,l,"internal-error");let d=h.users[0];e._notifyReloadListener(d);let f=(null===(t=d.providerUserInfo)||void 0===t?void 0:t.length)?d.providerUserInfo.map(e=>{var{providerId:t}=e,l=__rest(e,["providerId"]);return{providerId:t,uid:l.rawId||"",displayName:l.displayName||null,email:l.email||null,phoneNumber:l.phoneNumber||null,photoURL:l.photoUrl||null}}):[],m=function(e,t){let l=e.filter(e=>!t.some(t=>t.providerId===e.providerId));return[...l,...t]}(e.providerData,f),g=e.isAnonymous,_=!(e.email&&d.passwordHash)&&!(null==m?void 0:m.length),b={uid:d.localId,displayName:d.displayName||null,photoURL:d.photoUrl||null,email:d.email||null,emailVerified:d.emailVerified||!1,phoneNumber:d.phoneNumber||null,tenantId:d.tenantId||null,providerData:m,metadata:new UserMetadata(d.createdAt,d.lastLoginAt),isAnonymous:!!g&&_};Object.assign(e,b)}async function reload(e){let t=(0,h.m9)(e);await _reloadWithoutSaving(t),await t.auth._persistUserIfCurrent(t),t.auth._notifyListenersIfCurrent(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function requestStsToken(e,t){let l=await _performFetchWithErrorHandling(e,{},async()=>{let l=(0,h.xO)({grant_type:"refresh_token",refresh_token:t}).slice(1),{tokenApiHost:u,apiKey:d}=e.config,f=_getFinalTarget(e,u,"/v1/token",`key=${d}`),m=await e._getAdditionalHeaders();return m["Content-Type"]="application/x-www-form-urlencoded",FetchProvider.fetch()(f,{method:"POST",headers:m,body:l})});return{accessToken:l.access_token,expiresIn:l.expires_in,refreshToken:l.refresh_token}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let StsTokenManager=class StsTokenManager{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){_assert(e.idToken,"internal-error"),_assert(void 0!==e.idToken,"internal-error"),_assert(void 0!==e.refreshToken,"internal-error");let t="expiresIn"in e&&void 0!==e.expiresIn?Number(e.expiresIn):function(e){let t=_parseToken(e);return _assert(t,"internal-error"),_assert(void 0!==t.exp,"internal-error"),_assert(void 0!==t.iat,"internal-error"),Number(t.exp)-Number(t.iat)}(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}async getToken(e,t=!1){return(_assert(!this.accessToken||this.refreshToken,e,"user-token-expired"),t||!this.accessToken||this.isExpired)?this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null:this.accessToken}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){let{accessToken:l,refreshToken:u,expiresIn:h}=await requestStsToken(e,t);this.updateTokensAndExpiration(l,u,Number(h))}updateTokensAndExpiration(e,t,l){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+1e3*l}static fromJSON(e,t){let{refreshToken:l,accessToken:u,expirationTime:h}=t,d=new StsTokenManager;return l&&(_assert("string"==typeof l,"internal-error",{appName:e}),d.refreshToken=l),u&&(_assert("string"==typeof u,"internal-error",{appName:e}),d.accessToken=u),h&&(_assert("number"==typeof h,"internal-error",{appName:e}),d.expirationTime=h),d}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new StsTokenManager,this.toJSON())}_performRefresh(){return debugFail("not implemented")}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function assertStringOrUndefined(e,t){_assert("string"==typeof e||void 0===e,"internal-error",{appName:t})}let UserImpl=class UserImpl{constructor(e){var{uid:t,auth:l,stsTokenManager:u}=e,h=__rest(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new ProactiveRefresh(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=l,this.stsTokenManager=u,this.accessToken=u.accessToken,this.displayName=h.displayName||null,this.email=h.email||null,this.emailVerified=h.emailVerified||!1,this.phoneNumber=h.phoneNumber||null,this.photoURL=h.photoURL||null,this.isAnonymous=h.isAnonymous||!1,this.tenantId=h.tenantId||null,this.providerData=h.providerData?[...h.providerData]:[],this.metadata=new UserMetadata(h.createdAt||void 0,h.lastLoginAt||void 0)}async getIdToken(e){let t=await _logoutIfInvalidated(this,this.stsTokenManager.getToken(this.auth,e));return _assert(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return getIdTokenResult(this,e)}reload(){return reload(this)}_assign(e){this!==e&&(_assert(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(e=>Object.assign({},e)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){let t=new UserImpl(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){_assert(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let l=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),l=!0),t&&await _reloadWithoutSaving(this),await this.auth._persistUserIfCurrent(this),l&&this.auth._notifyListenersIfCurrent(this)}async delete(){let e=await this.getIdToken();return await _logoutIfInvalidated(this,deleteAccount(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var l,u,h,d,f,m,g,_;let b=null!==(l=t.displayName)&&void 0!==l?l:void 0,E=null!==(u=t.email)&&void 0!==u?u:void 0,k=null!==(h=t.phoneNumber)&&void 0!==h?h:void 0,L=null!==(d=t.photoURL)&&void 0!==d?d:void 0,V=null!==(f=t.tenantId)&&void 0!==f?f:void 0,z=null!==(m=t._redirectEventId)&&void 0!==m?m:void 0,ee=null!==(g=t.createdAt)&&void 0!==g?g:void 0,er=null!==(_=t.lastLoginAt)&&void 0!==_?_:void 0,{uid:eo,emailVerified:eh,isAnonymous:ec,providerData:ef,stsTokenManager:em}=t;_assert(eo&&em,e,"internal-error");let ep=StsTokenManager.fromJSON(this.name,em);_assert("string"==typeof eo,e,"internal-error"),assertStringOrUndefined(b,e.name),assertStringOrUndefined(E,e.name),_assert("boolean"==typeof eh,e,"internal-error"),_assert("boolean"==typeof ec,e,"internal-error"),assertStringOrUndefined(k,e.name),assertStringOrUndefined(L,e.name),assertStringOrUndefined(V,e.name),assertStringOrUndefined(z,e.name),assertStringOrUndefined(ee,e.name),assertStringOrUndefined(er,e.name);let eg=new UserImpl({uid:eo,auth:e,email:E,emailVerified:eh,displayName:b,isAnonymous:ec,photoURL:L,phoneNumber:k,tenantId:V,stsTokenManager:ep,createdAt:ee,lastLoginAt:er});return ef&&Array.isArray(ef)&&(eg.providerData=ef.map(e=>Object.assign({},e))),z&&(eg._redirectEventId=z),eg}static async _fromIdTokenResponse(e,t,l=!1){let u=new StsTokenManager;u.updateFromServerResponse(t);let h=new UserImpl({uid:t.localId,auth:e,stsTokenManager:u,isAnonymous:l});return await _reloadWithoutSaving(h),h}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let k=new Map;function _getInstance(e){e instanceof Function||debugFail("Expected a class definition");let t=k.get(e);return t?t instanceof e||debugFail("Instance stored in cache mismatched with class"):(t=new e,k.set(e,t)),t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let InMemoryPersistence=class InMemoryPersistence{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){let t=this.storage[e];return void 0===t?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _persistenceKeyName(e,t,l){return`firebase:${e}:${t}:${l}`}InMemoryPersistence.type="NONE";let PersistenceUserManager=class PersistenceUserManager{constructor(e,t,l){this.persistence=e,this.auth=t,this.userKey=l;let{config:u,name:h}=this.auth;this.fullUserKey=_persistenceKeyName(this.userKey,u.apiKey,h),this.fullPersistenceKey=_persistenceKeyName("persistence",u.apiKey,h),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){let e=await this.persistence._get(this.fullUserKey);return e?UserImpl._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;let t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,l="authUser"){if(!t.length)return new PersistenceUserManager(_getInstance(InMemoryPersistence),e,l);let u=(await Promise.all(t.map(async e=>{if(await e._isAvailable())return e}))).filter(e=>e),h=u[0]||_getInstance(InMemoryPersistence),d=_persistenceKeyName(l,e.config.apiKey,e.name),f=null;for(let l of t)try{let t=await l._get(d);if(t){let u=UserImpl._fromJSON(e,t);l!==h&&(f=u),h=l;break}}catch(e){}let m=u.filter(e=>e._shouldAllowMigration);return h._shouldAllowMigration&&m.length&&(h=m[0],f&&await h._set(d,f.toJSON()),await Promise.all(t.map(async e=>{if(e!==h)try{await e._remove(d)}catch(e){}}))),new PersistenceUserManager(h,e,l)}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _getBrowserName(e){let t=e.toLowerCase();if(t.includes("opera/")||t.includes("opr/")||t.includes("opios/"))return"Opera";if(_isIEMobile(t))return"IEMobile";if(t.includes("msie")||t.includes("trident/"))return"IE";{if(t.includes("edge/"))return"Edge";if(_isFirefox(t))return"Firefox";if(t.includes("silk/"))return"Silk";if(_isBlackBerry(t))return"Blackberry";if(_isWebOS(t))return"Webos";if(_isSafari(t))return"Safari";if((t.includes("chrome/")||_isChromeIOS(t))&&!t.includes("edge/"))return"Chrome";if(_isAndroid(t))return"Android";let l=e.match(/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/);if((null==l?void 0:l.length)===2)return l[1]}return"Other"}function _isFirefox(e=(0,h.z$)()){return/firefox\//i.test(e)}function _isSafari(e=(0,h.z$)()){let t=e.toLowerCase();return t.includes("safari/")&&!t.includes("chrome/")&&!t.includes("crios/")&&!t.includes("android")}function _isChromeIOS(e=(0,h.z$)()){return/crios\//i.test(e)}function _isIEMobile(e=(0,h.z$)()){return/iemobile/i.test(e)}function _isAndroid(e=(0,h.z$)()){return/android/i.test(e)}function _isBlackBerry(e=(0,h.z$)()){return/blackberry/i.test(e)}function _isWebOS(e=(0,h.z$)()){return/webos/i.test(e)}function _isIOS(e=(0,h.z$)()){return/iphone|ipad|ipod/i.test(e)||/macintosh/i.test(e)&&/mobile/i.test(e)}function _isMobileBrowser(e=(0,h.z$)()){return _isIOS(e)||_isAndroid(e)||_isWebOS(e)||_isBlackBerry(e)||/windows phone/i.test(e)||_isIEMobile(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _getClientVersion(e,t=[]){let l;switch(e){case"Browser":l=_getBrowserName((0,h.z$)());break;case"Worker":l=`${_getBrowserName((0,h.z$)())}-${e}`;break;default:l=e}let u=t.length?t.join(","):"FirebaseCore-web";return`${l}/JsCore/${d.Jn}/${u}`}async function getRecaptchaConfig(e,t){return _performApiRequest(e,"GET","/v2/recaptchaConfig",_addTidIfNecessary(e,t))}function isEnterprise(e){return void 0!==e&&void 0!==e.enterprise}let RecaptchaConfig=class RecaptchaConfig{constructor(e){if(this.siteKey="",this.emailPasswordEnabled=!1,void 0===e.recaptchaKey)throw Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.emailPasswordEnabled=e.recaptchaEnforcementState.some(e=>"EMAIL_PASSWORD_PROVIDER"===e.provider&&"OFF"!==e.enforcementState)}};function _loadJS(e){return new Promise((t,l)=>{var u,h;let d=document.createElement("script");d.setAttribute("src",e),d.onload=t,d.onerror=e=>{let t=_createError("internal-error");t.customData=e,l(t)},d.type="text/javascript",d.charset="UTF-8",(null!==(h=null===(u=document.getElementsByTagName("head"))||void 0===u?void 0:u[0])&&void 0!==h?h:document).appendChild(d)})}function _generateCallbackName(e){return`__${e}${Math.floor(1e6*Math.random())}`}let RecaptchaEnterpriseVerifier=class RecaptchaEnterpriseVerifier{constructor(e){this.type="recaptcha-enterprise",this.auth=_castAuth(e)}async verify(e="verify",t=!1){async function retrieveSiteKey(e){if(!t){if(null==e.tenantId&&null!=e._agentRecaptchaConfig)return e._agentRecaptchaConfig.siteKey;if(null!=e.tenantId&&void 0!==e._tenantRecaptchaConfigs[e.tenantId])return e._tenantRecaptchaConfigs[e.tenantId].siteKey}return new Promise(async(t,l)=>{getRecaptchaConfig(e,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(u=>{if(void 0===u.recaptchaKey)l(Error("recaptcha Enterprise site key undefined"));else{let l=new RecaptchaConfig(u);return null==e.tenantId?e._agentRecaptchaConfig=l:e._tenantRecaptchaConfigs[e.tenantId]=l,t(l.siteKey)}}).catch(e=>{l(e)})})}function retrieveRecaptchaToken(t,l,u){let h=window.grecaptcha;isEnterprise(h)?h.enterprise.ready(()=>{h.enterprise.execute(t,{action:e}).then(e=>{l(e)}).catch(()=>{l("NO_RECAPTCHA")})}):u(Error("No reCAPTCHA enterprise script loaded."))}return new Promise((e,l)=>{retrieveSiteKey(this.auth).then(u=>{if(!t&&isEnterprise(window.grecaptcha))retrieveRecaptchaToken(u,e,l);else{if("undefined"==typeof window){l(Error("RecaptchaVerifier is only supported in browser"));return}_loadJS("https://www.google.com/recaptcha/enterprise.js?render="+u).then(()=>{retrieveRecaptchaToken(u,e,l)}).catch(e=>{l(e)})}}).catch(e=>{l(e)})})}};async function injectRecaptchaFields(e,t,l,u=!1){let h;let d=new RecaptchaEnterpriseVerifier(e);try{h=await d.verify(l)}catch(e){h=await d.verify(l,!0)}let f=Object.assign({},t);return u?Object.assign(f,{captchaResp:h}):Object.assign(f,{captchaResponse:h}),Object.assign(f,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(f,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),f}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let AuthMiddlewareQueue=class AuthMiddlewareQueue{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){let wrappedCallback=t=>new Promise((l,u)=>{try{let u=e(t);l(u)}catch(e){u(e)}});wrappedCallback.onAbort=t,this.queue.push(wrappedCallback);let l=this.queue.length-1;return()=>{this.queue[l]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;let t=[];try{for(let l of this.queue)await l(e),l.onAbort&&t.push(l.onAbort)}catch(e){for(let e of(t.reverse(),t))try{e()}catch(e){}throw this.auth._errorFactory.create("login-blocked",{originalMessage:null==e?void 0:e.message})}}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let AuthImpl=class AuthImpl{constructor(e,t,l,u){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=l,this.config=u,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Subscription(this),this.idTokenSubscription=new Subscription(this),this.beforeStateQueue=new AuthMiddlewareQueue(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=g,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=u.sdkClientVersion}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=_getInstance(t)),this._initializationPromise=this.queue(async()=>{var l,u;if(!this._deleted&&(this.persistenceManager=await PersistenceUserManager.create(this,e),!this._deleted)){if(null===(l=this._popupRedirectResolver)||void 0===l?void 0:l._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch(e){}await this.initializeCurrentUser(t),this.lastNotifiedUid=(null===(u=this.currentUser)||void 0===u?void 0:u.uid)||null,this._deleted||(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;let e=await this.assertedPersistence.getCurrentUser();if(this.currentUser||e){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUser(e){var t;let l=await this.assertedPersistence.getCurrentUser(),u=l,h=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();let l=null===(t=this.redirectUser)||void 0===t?void 0:t._redirectEventId,d=null==u?void 0:u._redirectEventId,f=await this.tryRedirectSignIn(e);(!l||l===d)&&(null==f?void 0:f.user)&&(u=f.user,h=!0)}if(!u)return this.directlySetCurrentUser(null);if(!u._redirectEventId){if(h)try{await this.beforeStateQueue.runMiddleware(u)}catch(e){u=l,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(e))}return u?this.reloadAndSetCurrentUserOrClear(u):this.directlySetCurrentUser(null)}return(_assert(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===u._redirectEventId)?this.directlySetCurrentUser(u):this.reloadAndSetCurrentUserOrClear(u)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch(e){await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await _reloadWithoutSaving(e)}catch(e){if((null==e?void 0:e.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=function(){if("undefined"==typeof navigator)return null;let e=navigator;return e.languages&&e.languages[0]||e.language||null}()}async _delete(){this._deleted=!0}async updateCurrentUser(e){let t=e?(0,h.m9)(e):null;return t&&_assert(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&_assert(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0)}setPersistence(e){return this.queue(async()=>{await this.assertedPersistence.setPersistence(_getInstance(e))})}async initializeRecaptchaConfig(){let e=await getRecaptchaConfig(this,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}),t=new RecaptchaConfig(e);if(null==this.tenantId?this._agentRecaptchaConfig=t:this._tenantRecaptchaConfigs[this.tenantId]=t,t.emailPasswordEnabled){let e=new RecaptchaEnterpriseVerifier(this);e.verify()}}_getRecaptchaConfig(){return null==this.tenantId?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new h.LL("auth","Firebase",e())}onAuthStateChanged(e,t,l){return this.registerStateListener(this.authStateSubscription,e,t,l)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,l){return this.registerStateListener(this.idTokenSubscription,e,t,l)}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:null===(e=this._currentUser)||void 0===e?void 0:e.toJSON()}}async _setRedirectUser(e,t){let l=await this.getOrInitRedirectPersistenceManager(t);return null===e?l.removeCurrentUser():l.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){let t=e&&_getInstance(e)||this._popupRedirectResolver;_assert(t,this,"argument-error"),this.redirectPersistenceManager=await PersistenceUserManager.create(this,[_getInstance(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,l;return(this._isInitialized&&await this.queue(async()=>{}),(null===(t=this._currentUser)||void 0===t?void 0:t._redirectEventId)===e)?this._currentUser:(null===(l=this.redirectUser)||void 0===l?void 0:l._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);let l=null!==(t=null===(e=this.currentUser)||void 0===e?void 0:e.uid)&&void 0!==t?t:null;this.lastNotifiedUid!==l&&(this.lastNotifiedUid=l,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,l,u){if(this._deleted)return()=>{};let h="function"==typeof t?t:t.next.bind(t),d=this._isInitialized?Promise.resolve():this._initializationPromise;return(_assert(d,this,"internal-error"),d.then(()=>h(this.currentUser)),"function"==typeof t)?e.addObserver(t,l,u):e.addObserver(t)}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return _assert(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=_getClientVersion(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;let t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);let l=await (null===(e=this.heartbeatServiceProvider.getImmediate({optional:!0}))||void 0===e?void 0:e.getHeartbeatsHeader());l&&(t["X-Firebase-Client"]=l);let u=await this._getAppCheckToken();return u&&(t["X-Firebase-AppCheck"]=u),t}async _getAppCheckToken(){var e;let t=await (null===(e=this.appCheckServiceProvider.getImmediate({optional:!0}))||void 0===e?void 0:e.getToken());return(null==t?void 0:t.error)&&function(e,...t){_.logLevel<=f.in.WARN&&_.warn(`Auth (${d.Jn}): ${e}`,...t)}(`Error while retrieving App Check token: ${t.error}`),null==t?void 0:t.token}};function _castAuth(e){return(0,h.m9)(e)}let Subscription=class Subscription{constructor(e){this.auth=e,this.observer=null,this.addObserver=(0,h.ne)(e=>this.observer=e)}get next(){return _assert(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}};function extractProtocol(e){let t=e.indexOf(":");return t<0?"":e.substr(0,t+1)}function parsePort(e){if(!e)return null;let t=Number(e);return isNaN(t)?null:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let AuthCredential=class AuthCredential{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return debugFail("not implemented")}_getIdTokenResponse(e){return debugFail("not implemented")}_linkToIdToken(e,t){return debugFail("not implemented")}_getReauthenticationResolver(e){return debugFail("not implemented")}};async function updateEmailPassword(e,t){return _performApiRequest(e,"POST","/v1/accounts:update",t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function signInWithPassword(e,t){return _performSignInRequest(e,"POST","/v1/accounts:signInWithPassword",_addTidIfNecessary(e,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function signInWithEmailLink$1(e,t){return _performSignInRequest(e,"POST","/v1/accounts:signInWithEmailLink",_addTidIfNecessary(e,t))}async function signInWithEmailLinkForLinking(e,t){return _performSignInRequest(e,"POST","/v1/accounts:signInWithEmailLink",_addTidIfNecessary(e,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let EmailAuthCredential=class EmailAuthCredential extends AuthCredential{constructor(e,t,l,u=null){super("password",l),this._email=e,this._password=t,this._tenantId=u}static _fromEmailAndPassword(e,t){return new EmailAuthCredential(e,t,"password")}static _fromEmailAndCode(e,t,l=null){return new EmailAuthCredential(e,t,"emailLink",l)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){let t="string"==typeof e?JSON.parse(e):e;if((null==t?void 0:t.email)&&(null==t?void 0:t.password)){if("password"===t.signInMethod)return this._fromEmailAndPassword(t.email,t.password);if("emailLink"===t.signInMethod)return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){var t;switch(this.signInMethod){case"password":let l={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};if(null===(t=e._getRecaptchaConfig())||void 0===t||!t.emailPasswordEnabled)return signInWithPassword(e,l).catch(async t=>{if("auth/missing-recaptcha-token"!==t.code)return Promise.reject(t);{console.log("Sign-in with email address and password is protected by reCAPTCHA for this project. Automatically triggering the reCAPTCHA flow and restarting the sign-in flow.");let t=await injectRecaptchaFields(e,l,"signInWithPassword");return signInWithPassword(e,t)}});{let t=await injectRecaptchaFields(e,l,"signInWithPassword");return signInWithPassword(e,t)}case"emailLink":return signInWithEmailLink$1(e,{email:this._email,oobCode:this._password});default:_fail(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":return updateEmailPassword(e,{idToken:t,returnSecureToken:!0,email:this._email,password:this._password});case"emailLink":return signInWithEmailLinkForLinking(e,{idToken:t,email:this._email,oobCode:this._password});default:_fail(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function signInWithIdp(e,t){return _performSignInRequest(e,"POST","/v1/accounts:signInWithIdp",_addTidIfNecessary(e,t))}let OAuthCredential=class OAuthCredential extends AuthCredential{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){let t=new OAuthCredential(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):_fail("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){let t="string"==typeof e?JSON.parse(e):e,{providerId:l,signInMethod:u}=t,h=__rest(t,["providerId","signInMethod"]);if(!l||!u)return null;let d=new OAuthCredential(l,u);return d.idToken=h.idToken||void 0,d.accessToken=h.accessToken||void 0,d.secret=h.secret,d.nonce=h.nonce,d.pendingToken=h.pendingToken||null,d}_getIdTokenResponse(e){let t=this.buildRequest();return signInWithIdp(e,t)}_linkToIdToken(e,t){let l=this.buildRequest();return l.idToken=t,signInWithIdp(e,l)}_getReauthenticationResolver(e){let t=this.buildRequest();return t.autoCreate=!1,signInWithIdp(e,t)}buildRequest(){let e={requestUri:"http://localhost",returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{let t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=(0,h.xO)(t)}return e}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function sendPhoneVerificationCode(e,t){return _performApiRequest(e,"POST","/v1/accounts:sendVerificationCode",_addTidIfNecessary(e,t))}async function signInWithPhoneNumber$1(e,t){return _performSignInRequest(e,"POST","/v1/accounts:signInWithPhoneNumber",_addTidIfNecessary(e,t))}async function linkWithPhoneNumber$1(e,t){let l=await _performSignInRequest(e,"POST","/v1/accounts:signInWithPhoneNumber",_addTidIfNecessary(e,t));if(l.temporaryProof)throw _makeTaggedError(e,"account-exists-with-different-credential",l);return l}let L={USER_NOT_FOUND:"user-not-found"};async function verifyPhoneNumberForExisting(e,t){let l=Object.assign(Object.assign({},t),{operation:"REAUTH"});return _performSignInRequest(e,"POST","/v1/accounts:signInWithPhoneNumber",_addTidIfNecessary(e,l),L)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let PhoneAuthCredential=class PhoneAuthCredential extends AuthCredential{constructor(e){super("phone","phone"),this.params=e}static _fromVerification(e,t){return new PhoneAuthCredential({verificationId:e,verificationCode:t})}static _fromTokenResponse(e,t){return new PhoneAuthCredential({phoneNumber:e,temporaryProof:t})}_getIdTokenResponse(e){return signInWithPhoneNumber$1(e,this._makeVerificationRequest())}_linkToIdToken(e,t){return linkWithPhoneNumber$1(e,Object.assign({idToken:t},this._makeVerificationRequest()))}_getReauthenticationResolver(e){return verifyPhoneNumberForExisting(e,this._makeVerificationRequest())}_makeVerificationRequest(){let{temporaryProof:e,phoneNumber:t,verificationId:l,verificationCode:u}=this.params;return e&&t?{temporaryProof:e,phoneNumber:t}:{sessionInfo:l,code:u}}toJSON(){let e={providerId:this.providerId};return this.params.phoneNumber&&(e.phoneNumber=this.params.phoneNumber),this.params.temporaryProof&&(e.temporaryProof=this.params.temporaryProof),this.params.verificationCode&&(e.verificationCode=this.params.verificationCode),this.params.verificationId&&(e.verificationId=this.params.verificationId),e}static fromJSON(e){"string"==typeof e&&(e=JSON.parse(e));let{verificationId:t,verificationCode:l,phoneNumber:u,temporaryProof:h}=e;return l||t||u||h?new PhoneAuthCredential({verificationId:t,verificationCode:l,phoneNumber:u,temporaryProof:h}):null}};let ActionCodeURL=class ActionCodeURL{constructor(e){var t,l,u,d,f,m;let g=(0,h.zd)((0,h.pd)(e)),_=null!==(t=g.apiKey)&&void 0!==t?t:null,b=null!==(l=g.oobCode)&&void 0!==l?l:null,E=/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function(e){switch(e){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}(null!==(u=g.mode)&&void 0!==u?u:null);_assert(_&&b&&E,"argument-error"),this.apiKey=_,this.operation=E,this.code=b,this.continueUrl=null!==(d=g.continueUrl)&&void 0!==d?d:null,this.languageCode=null!==(f=g.languageCode)&&void 0!==f?f:null,this.tenantId=null!==(m=g.tenantId)&&void 0!==m?m:null}static parseLink(e){let t=function(e){let t=(0,h.zd)((0,h.pd)(e)).link,l=t?(0,h.zd)((0,h.pd)(t)).deep_link_id:null,u=(0,h.zd)((0,h.pd)(e)).deep_link_id,d=u?(0,h.zd)((0,h.pd)(u)).link:null;return d||u||l||t||e}(e);try{return new ActionCodeURL(t)}catch(e){return null}}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let EmailAuthProvider=class EmailAuthProvider{constructor(){this.providerId=EmailAuthProvider.PROVIDER_ID}static credential(e,t){return EmailAuthCredential._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){let l=ActionCodeURL.parseLink(t);return _assert(l,"argument-error"),EmailAuthCredential._fromEmailAndCode(e,l.code,l.tenantId)}};EmailAuthProvider.PROVIDER_ID="password",EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD="password",EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let FederatedAuthProvider=class FederatedAuthProvider{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let BaseOAuthProvider=class BaseOAuthProvider extends FederatedAuthProvider{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let FacebookAuthProvider=class FacebookAuthProvider extends BaseOAuthProvider{constructor(){super("facebook.com")}static credential(e){return OAuthCredential._fromParams({providerId:FacebookAuthProvider.PROVIDER_ID,signInMethod:FacebookAuthProvider.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return FacebookAuthProvider.credentialFromTaggedObject(e)}static credentialFromError(e){return FacebookAuthProvider.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return FacebookAuthProvider.credential(e.oauthAccessToken)}catch(e){return null}}};FacebookAuthProvider.FACEBOOK_SIGN_IN_METHOD="facebook.com",FacebookAuthProvider.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let GoogleAuthProvider=class GoogleAuthProvider extends BaseOAuthProvider{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return OAuthCredential._fromParams({providerId:GoogleAuthProvider.PROVIDER_ID,signInMethod:GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return GoogleAuthProvider.credentialFromTaggedObject(e)}static credentialFromError(e){return GoogleAuthProvider.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{oauthIdToken:t,oauthAccessToken:l}=e;if(!t&&!l)return null;try{return GoogleAuthProvider.credential(t,l)}catch(e){return null}}};GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD="google.com",GoogleAuthProvider.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let GithubAuthProvider=class GithubAuthProvider extends BaseOAuthProvider{constructor(){super("github.com")}static credential(e){return OAuthCredential._fromParams({providerId:GithubAuthProvider.PROVIDER_ID,signInMethod:GithubAuthProvider.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return GithubAuthProvider.credentialFromTaggedObject(e)}static credentialFromError(e){return GithubAuthProvider.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return GithubAuthProvider.credential(e.oauthAccessToken)}catch(e){return null}}};GithubAuthProvider.GITHUB_SIGN_IN_METHOD="github.com",GithubAuthProvider.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let TwitterAuthProvider=class TwitterAuthProvider extends BaseOAuthProvider{constructor(){super("twitter.com")}static credential(e,t){return OAuthCredential._fromParams({providerId:TwitterAuthProvider.PROVIDER_ID,signInMethod:TwitterAuthProvider.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return TwitterAuthProvider.credentialFromTaggedObject(e)}static credentialFromError(e){return TwitterAuthProvider.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{oauthAccessToken:t,oauthTokenSecret:l}=e;if(!t||!l)return null;try{return TwitterAuthProvider.credential(t,l)}catch(e){return null}}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function signUp(e,t){return _performSignInRequest(e,"POST","/v1/accounts:signUp",_addTidIfNecessary(e,t))}TwitterAuthProvider.TWITTER_SIGN_IN_METHOD="twitter.com",TwitterAuthProvider.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let UserCredentialImpl=class UserCredentialImpl{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,l,u=!1){let h=await UserImpl._fromIdTokenResponse(e,l,u),d=providerIdForResponse(l),f=new UserCredentialImpl({user:h,providerId:d,_tokenResponse:l,operationType:t});return f}static async _forOperation(e,t,l){await e._updateTokensIfNecessary(l,!0);let u=providerIdForResponse(l);return new UserCredentialImpl({user:e,providerId:u,_tokenResponse:l,operationType:t})}};function providerIdForResponse(e){return e.providerId?e.providerId:"phoneNumber"in e?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let MultiFactorError=class MultiFactorError extends h.ZR{constructor(e,t,l,u){var h;super(t.code,t.message),this.operationType=l,this.user=u,Object.setPrototypeOf(this,MultiFactorError.prototype),this.customData={appName:e.name,tenantId:null!==(h=e.tenantId)&&void 0!==h?h:void 0,_serverResponse:t.customData._serverResponse,operationType:l}}static _fromErrorAndOperation(e,t,l,u){return new MultiFactorError(e,t,l,u)}};function _processCredentialSavingMfaContextIfNecessary(e,t,l,u){let h="reauthenticate"===t?l._getReauthenticationResolver(e):l._getIdTokenResponse(e);return h.catch(l=>{if("auth/multi-factor-auth-required"===l.code)throw MultiFactorError._fromErrorAndOperation(e,l,t,u);throw l})}async function _link$1(e,t,l=!1){let u=await _logoutIfInvalidated(e,t._linkToIdToken(e.auth,await e.getIdToken()),l);return UserCredentialImpl._forOperation(e,"link",u)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _reauthenticate(e,t,l=!1){let{auth:u}=e,h="reauthenticate";try{let d=await _logoutIfInvalidated(e,_processCredentialSavingMfaContextIfNecessary(u,h,t,e),l);_assert(d.idToken,u,"internal-error");let f=_parseToken(d.idToken);_assert(f,u,"internal-error");let{sub:m}=f;return _assert(e.uid===m,u,"user-mismatch"),UserCredentialImpl._forOperation(e,h,d)}catch(e){throw(null==e?void 0:e.code)==="auth/user-not-found"&&_fail(u,"user-mismatch"),e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _signInWithCredential(e,t,l=!1){let u="signIn",h=await _processCredentialSavingMfaContextIfNecessary(e,u,t),d=await UserCredentialImpl._fromIdTokenResponse(e,u,h);return l||await e._updateCurrentUser(d.user),d}async function signInWithCredential(e,t){return _signInWithCredential(_castAuth(e),t)}async function createUserWithEmailAndPassword(e,t,l){var u;let h;let d=_castAuth(e),f={returnSecureToken:!0,email:t,password:l,clientType:"CLIENT_TYPE_WEB"};if(null===(u=d._getRecaptchaConfig())||void 0===u?void 0:u.emailPasswordEnabled){let e=await injectRecaptchaFields(d,f,"signUpPassword");h=signUp(d,e)}else h=signUp(d,f).catch(async e=>{if("auth/missing-recaptcha-token"!==e.code)return Promise.reject(e);{console.log("Sign-up is protected by reCAPTCHA for this project. Automatically triggering the reCAPTCHA flow and restarting the sign-up flow.");let e=await injectRecaptchaFields(d,f,"signUpPassword");return signUp(d,e)}});let m=await h.catch(e=>Promise.reject(e)),g=await UserCredentialImpl._fromIdTokenResponse(d,"signIn",m);return await d._updateCurrentUser(g.user),g}function signInWithEmailAndPassword(e,t,l){return signInWithCredential((0,h.m9)(e),EmailAuthProvider.credential(t,l))}function onAuthStateChanged(e,t,l,u){return(0,h.m9)(e).onAuthStateChanged(t,l,u)}function signOut(e){return(0,h.m9)(e).signOut()}new WeakMap;let V="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let BrowserPersistenceClass=class BrowserPersistenceClass{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{if(!this.storage)return Promise.resolve(!1);return this.storage.setItem(V,"1"),this.storage.removeItem(V),Promise.resolve(!0)}catch(e){return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){let t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}};let BrowserLocalPersistence=class BrowserLocalPersistence extends BrowserPersistenceClass{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.safariLocalStorageNotSynced=/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function(){let e=(0,h.z$)();return _isSafari(e)||_isIOS(e)}()&&function(){try{return!!(window&&window!==window.top)}catch(e){return!1}}(),this.fallbackToPolling=_isMobileBrowser(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(let t of Object.keys(this.listeners)){let l=this.storage.getItem(t),u=this.localCache[t];l!==u&&e(t,u,l)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((e,t,l)=>{this.notifyListeners(e,l)});return}let l=e.key;if(t?this.detachListener():this.stopPolling(),this.safariLocalStorageNotSynced){let u=this.storage.getItem(l);if(e.newValue!==u)null!==e.newValue?this.storage.setItem(l,e.newValue):this.storage.removeItem(l);else if(this.localCache[l]===e.newValue&&!t)return}let triggerListeners=()=>{let e=this.storage.getItem(l);(t||this.localCache[l]!==e)&&this.notifyListeners(l,e)},u=this.storage.getItem(l);(0,h.w1)()&&10===document.documentMode&&u!==e.newValue&&e.newValue!==e.oldValue?setTimeout(triggerListeners,10):triggerListeners()}notifyListeners(e,t){this.localCache[e]=t;let l=this.listeners[e];if(l)for(let e of Array.from(l))e(t?JSON.parse(t):t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,l)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:l}),!0)})},1e3)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){0===Object.keys(this.listeners).length&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),0===this.listeners[e].size&&delete this.listeners[e]),0===Object.keys(this.listeners).length&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){let t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}};BrowserLocalPersistence.type="LOCAL";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let BrowserSessionPersistence=class BrowserSessionPersistence extends BrowserPersistenceClass{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}};BrowserSessionPersistence.type="SESSION";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Receiver=class Receiver{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){let t=this.receivers.find(t=>t.isListeningto(e));if(t)return t;let l=new Receiver(e);return this.receivers.push(l),l}isListeningto(e){return this.eventTarget===e}async handleEvent(e){let{eventId:t,eventType:l,data:u}=e.data,h=this.handlersMap[l];if(!(null==h?void 0:h.size))return;e.ports[0].postMessage({status:"ack",eventId:t,eventType:l});let d=Array.from(h).map(async t=>t(e.origin,u)),f=await Promise.all(d.map(async e=>{try{let t=await e;return{fulfilled:!0,value:t}}catch(e){return{fulfilled:!1,reason:e}}}));e.ports[0].postMessage({status:"done",eventId:t,eventType:l,response:f})}_subscribe(e,t){0===Object.keys(this.handlersMap).length&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),t&&0!==this.handlersMap[e].size||delete this.handlersMap[e],0===Object.keys(this.handlersMap).length&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _generateEventId(e="",t=10){let l="";for(let e=0;e<t;e++)l+=Math.floor(10*Math.random());return e+l}Receiver.receivers=[];/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Sender=class Sender{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,l=50){let u,h;let d="undefined"!=typeof MessageChannel?new MessageChannel:null;if(!d)throw Error("connection_unavailable");return new Promise((f,m)=>{let g=_generateEventId("",20);d.port1.start();let _=setTimeout(()=>{m(Error("unsupported_event"))},l);h={messageChannel:d,onMessage(e){if(e.data.eventId===g)switch(e.data.status){case"ack":clearTimeout(_),u=setTimeout(()=>{m(Error("timeout"))},3e3);break;case"done":clearTimeout(u),f(e.data.response);break;default:clearTimeout(_),clearTimeout(u),m(Error("invalid_response"))}}},this.handlers.add(h),d.port1.addEventListener("message",h.onMessage),this.target.postMessage({eventType:e,eventId:g,data:t},[d.port2])}).finally(()=>{h&&this.removeMessageHandler(h)})}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _window(){return window}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _isWorker(){return void 0!==_window().WorkerGlobalScope&&"function"==typeof _window().importScripts}async function _getActiveServiceWorker(){if(!(null==navigator?void 0:navigator.serviceWorker))return null;try{let e=await navigator.serviceWorker.ready;return e.active}catch(e){return null}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let z="firebaseLocalStorageDb",ee="firebaseLocalStorage",er="fbase_key";let DBPromise=class DBPromise{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}};function getObjectStore(e,t){return e.transaction([ee],t?"readwrite":"readonly").objectStore(ee)}function _openDatabase(){let e=indexedDB.open(z,1);return new Promise((t,l)=>{e.addEventListener("error",()=>{l(e.error)}),e.addEventListener("upgradeneeded",()=>{let t=e.result;try{t.createObjectStore(ee,{keyPath:er})}catch(e){l(e)}}),e.addEventListener("success",async()=>{let l=e.result;l.objectStoreNames.contains(ee)?t(l):(l.close(),await function(){let e=indexedDB.deleteDatabase(z);return new DBPromise(e).toPromise()}(),t(await _openDatabase()))})})}async function _putObject(e,t,l){let u=getObjectStore(e,!0).put({[er]:t,value:l});return new DBPromise(u).toPromise()}async function getObject(e,t){let l=getObjectStore(e,!1).get(t),u=await new DBPromise(l).toPromise();return void 0===u?null:u.value}function _deleteObject(e,t){let l=getObjectStore(e,!0).delete(t);return new DBPromise(l).toPromise()}let IndexedDBLocalPersistence=class IndexedDBLocalPersistence{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db||(this.db=await _openDatabase()),this.db}async _withRetries(e){let t=0;for(;;)try{let t=await this._openDb();return await e(t)}catch(e){if(t++>3)throw e;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return _isWorker()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Receiver._getInstance(_isWorker()?self:null),this.receiver._subscribe("keyChanged",async(e,t)=>{let l=await this._poll();return{keyProcessed:l.includes(t.key)}}),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await _getActiveServiceWorker(),!this.activeServiceWorker)return;this.sender=new Sender(this.activeServiceWorker);let l=await this.sender._send("ping",{},800);l&&(null===(e=l[0])||void 0===e?void 0:e.fulfilled)&&(null===(t=l[0])||void 0===t?void 0:t.value.includes("keyChanged"))&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){var t;if(this.sender&&this.activeServiceWorker&&((null===(t=null==navigator?void 0:navigator.serviceWorker)||void 0===t?void 0:t.controller)||null)===this.activeServiceWorker)try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch(e){}}async _isAvailable(){try{if(!indexedDB)return!1;let e=await _openDatabase();return await _putObject(e,V,"1"),await _deleteObject(e,V),!0}catch(e){}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(l=>_putObject(l,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){let t=await this._withRetries(t=>getObject(t,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>_deleteObject(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){let e=await this._withRetries(e=>{let t=getObjectStore(e,!1).getAll();return new DBPromise(t).toPromise()});if(!e||0!==this.pendingWrites)return[];let t=[],l=new Set;for(let{fbase_key:u,value:h}of e)l.add(u),JSON.stringify(this.localCache[u])!==JSON.stringify(h)&&(this.notifyListeners(u,h),t.push(u));for(let e of Object.keys(this.localCache))this.localCache[e]&&!l.has(e)&&(this.notifyListeners(e,null),t.push(e));return t}notifyListeners(e,t){this.localCache[e]=t;let l=this.listeners[e];if(l)for(let e of Array.from(l))e(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),800)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){0===Object.keys(this.listeners).length&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),0===this.listeners[e].size&&delete this.listeners[e]),0===Object.keys(this.listeners).length&&this.stopPolling()}};async function _verifyPhoneNumber(e,t,l){var u,h,d;let f=await l.verify();try{let m;if(_assert("string"==typeof f,e,"argument-error"),_assert("recaptcha"===l.type,e,"argument-error"),m="string"==typeof t?{phoneNumber:t}:t,"session"in m){let t=m.session;if("phoneNumber"in m){_assert("enroll"===t.type,e,"internal-error");let l=await (h={idToken:t.credential,phoneEnrollmentInfo:{phoneNumber:m.phoneNumber,recaptchaToken:f}},_performApiRequest(e,"POST","/v2/accounts/mfaEnrollment:start",_addTidIfNecessary(e,h)));return l.phoneSessionInfo.sessionInfo}{_assert("signin"===t.type,e,"internal-error");let l=(null===(u=m.multiFactorHint)||void 0===u?void 0:u.uid)||m.multiFactorUid;_assert(l,e,"missing-multi-factor-info");let h=await (d={mfaPendingCredential:t.credential,mfaEnrollmentId:l,phoneSignInInfo:{recaptchaToken:f}},_performApiRequest(e,"POST","/v2/accounts/mfaSignIn:start",_addTidIfNecessary(e,d)));return h.phoneResponseInfo.sessionInfo}}{let{sessionInfo:t}=await sendPhoneVerificationCode(e,{phoneNumber:m.phoneNumber,recaptchaToken:f});return t}}finally{l._reset()}}IndexedDBLocalPersistence.type="LOCAL",_generateCallbackName("rcb"),new Delay(3e4,6e4);/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let PhoneAuthProvider=class PhoneAuthProvider{constructor(e){this.providerId=PhoneAuthProvider.PROVIDER_ID,this.auth=_castAuth(e)}verifyPhoneNumber(e,t){return _verifyPhoneNumber(this.auth,e,(0,h.m9)(t))}static credential(e,t){return PhoneAuthCredential._fromVerification(e,t)}static credentialFromResult(e){return PhoneAuthProvider.credentialFromTaggedObject(e)}static credentialFromError(e){return PhoneAuthProvider.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{phoneNumber:t,temporaryProof:l}=e;return t&&l?PhoneAuthCredential._fromTokenResponse(t,l):null}};/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _withDefaultResolver(e,t){return t?_getInstance(t):(_assert(e._popupRedirectResolver,e,"argument-error"),e._popupRedirectResolver)}PhoneAuthProvider.PROVIDER_ID="phone",PhoneAuthProvider.PHONE_SIGN_IN_METHOD="phone";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let IdpCredential=class IdpCredential extends AuthCredential{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return signInWithIdp(e,this._buildIdpRequest())}_linkToIdToken(e,t){return signInWithIdp(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return signInWithIdp(e,this._buildIdpRequest())}_buildIdpRequest(e){let t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}};function _signIn(e){return _signInWithCredential(e.auth,new IdpCredential(e),e.bypassAuthState)}function _reauth(e){let{auth:t,user:l}=e;return _assert(l,t,"internal-error"),_reauthenticate(l,new IdpCredential(e),e.bypassAuthState)}async function _link(e){let{auth:t,user:l}=e;return _assert(l,t,"internal-error"),_link$1(l,new IdpCredential(e),e.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let AbstractPopupRedirectOperation=class AbstractPopupRedirectOperation{constructor(e,t,l,u,h=!1){this.auth=e,this.resolver=l,this.user=u,this.bypassAuthState=h,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(e){this.reject(e)}})}async onAuthEvent(e){let{urlResponse:t,sessionId:l,postBody:u,tenantId:h,error:d,type:f}=e;if(d){this.reject(d);return}let m={auth:this.auth,requestUri:t,sessionId:l,tenantId:h||void 0,postBody:u||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(f)(m))}catch(e){this.reject(e)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return _signIn;case"linkViaPopup":case"linkViaRedirect":return _link;case"reauthViaPopup":case"reauthViaRedirect":return _reauth;default:_fail(this.auth,"internal-error")}}resolve(e){this.pendingPromise||debugFail("Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){this.pendingPromise||debugFail("Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let eo=new Delay(2e3,1e4);async function signInWithPopup(e,t,l){let u=_castAuth(e);!function(e,t,l){if(!(t instanceof l))throw l.name!==t.constructor.name&&_fail(e,"argument-error"),_errorWithCustomMessage(e,"argument-error",`Type of ${t.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}(e,t,FederatedAuthProvider);let h=_withDefaultResolver(u,l),d=new PopupOperation(u,"signInViaPopup",t,h);return d.executeNotNull()}let PopupOperation=class PopupOperation extends AbstractPopupRedirectOperation{constructor(e,t,l,u,h){super(e,t,u,h),this.provider=l,this.authWindow=null,this.pollId=null,PopupOperation.currentPopupAction&&PopupOperation.currentPopupAction.cancel(),PopupOperation.currentPopupAction=this}async executeNotNull(){let e=await this.execute();return _assert(e,this.auth,"internal-error"),e}async onExecution(){1===this.filter.length||debugFail("Popup operations only handle one event");let e=_generateEventId();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(e=>{this.reject(e)}),this.resolver._isIframeWebStorageSupported(this.auth,e=>{e||this.reject(_createError(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return(null===(e=this.authWindow)||void 0===e?void 0:e.associatedEvent)||null}cancel(){this.reject(_createError(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,PopupOperation.currentPopupAction=null}pollUserCancellation(){let poll=()=>{var e,t;if(null===(t=null===(e=this.authWindow)||void 0===e?void 0:e.window)||void 0===t?void 0:t.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(_createError(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(poll,eo.get())};poll()}};PopupOperation.currentPopupAction=null;let eh=new Map;let RedirectAction=class RedirectAction extends AbstractPopupRedirectOperation{constructor(e,t,l=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,l),this.eventId=null}async execute(){let e=eh.get(this.auth._key());if(!e){try{let t=await _getAndClearPendingRedirectStatus(this.resolver,this.auth),l=t?await super.execute():null;e=()=>Promise.resolve(l)}catch(t){e=()=>Promise.reject(t)}eh.set(this.auth._key(),e)}return this.bypassAuthState||eh.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if("signInViaRedirect"===e.type)return super.onAuthEvent(e);if("unknown"===e.type){this.resolve(null);return}if(e.eventId){let t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}};async function _getAndClearPendingRedirectStatus(e,t){let l=_persistenceKeyName("pendingRedirect",t.config.apiKey,t.name),u=_getInstance(e._redirectPersistence);if(!await u._isAvailable())return!1;let h=await u._get(l)==="true";return await u._remove(l),h}function _overrideRedirectResult(e,t){eh.set(e._key(),t)}async function _getRedirectResult(e,t,l=!1){let u=_castAuth(e),h=_withDefaultResolver(u,t),d=new RedirectAction(u,h,l),f=await d.execute();return f&&!l&&(delete f.user._redirectEventId,await u._persistUserIfCurrent(f.user),await u._setRedirectUser(null,t)),f}let AuthEventManager=class AuthEventManager{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(l=>{this.isEventForConsumer(e,l)&&(t=!0,this.sendToConsumer(e,l),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!function(e){switch(e.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return isNullRedirectEvent(e);default:return!1}}(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var l;if(e.error&&!isNullRedirectEvent(e)){let u=(null===(l=e.error.code)||void 0===l?void 0:l.split("auth/")[1])||"internal-error";t.onError(_createError(this.auth,u))}else t.onAuthEvent(e)}isEventForConsumer(e,t){let l=null===t.eventId||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&l}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=6e5&&this.cachedEventUids.clear(),this.cachedEventUids.has(eventUid(e))}saveEventToCache(e){this.cachedEventUids.add(eventUid(e)),this.lastProcessedEventTime=Date.now()}};function eventUid(e){return[e.type,e.eventId,e.sessionId,e.tenantId].filter(e=>e).join("-")}function isNullRedirectEvent({type:e,error:t}){return"unknown"===e&&(null==t?void 0:t.code)==="auth/no-auth-event"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _getProjectConfig(e,t={}){return _performApiRequest(e,"GET","/v1/projects",t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ec=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,ef=/^https?/;async function _validateOrigin(e){if(e.config.emulator)return;let{authorizedDomains:t}=await _getProjectConfig(e);for(let e of t)try{if(function(e){let t=_getCurrentUrl(),{protocol:l,hostname:u}=new URL(t);if(e.startsWith("chrome-extension://")){let h=new URL(e);return""===h.hostname&&""===u?"chrome-extension:"===l&&e.replace("chrome-extension://","")===t.replace("chrome-extension://",""):"chrome-extension:"===l&&h.hostname===u}if(!ef.test(l))return!1;if(ec.test(e))return u===e;let h=e.replace(/\./g,"\\."),d=RegExp("^(.+\\."+h+"|"+h+")$","i");return d.test(u)}(e))return}catch(e){}_fail(e,"unauthorized-domain")}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let em=new Delay(3e4,6e4);function resetUnloadedGapiModules(){let e=_window().___jsl;if(null==e?void 0:e.H){for(let t of Object.keys(e.H))if(e.H[t].r=e.H[t].r||[],e.H[t].L=e.H[t].L||[],e.H[t].r=[...e.H[t].L],e.CP)for(let t=0;t<e.CP.length;t++)e.CP[t]=null}}let ep=null,eg=new Delay(5e3,15e3),e_={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},ey=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);async function _openIframe(e){let t=await (ep=ep||new Promise((t,l)=>{var u,h,d;function loadGapiIframe(){resetUnloadedGapiModules(),gapi.load("gapi.iframes",{callback:()=>{t(gapi.iframes.getContext())},ontimeout:()=>{resetUnloadedGapiModules(),l(_createError(e,"network-request-failed"))},timeout:em.get()})}if(null===(h=null===(u=_window().gapi)||void 0===u?void 0:u.iframes)||void 0===h?void 0:h.Iframe)t(gapi.iframes.getContext());else if(null===(d=_window().gapi)||void 0===d?void 0:d.load)loadGapiIframe();else{let t=_generateCallbackName("iframefcb");return _window()[t]=()=>{gapi.load?loadGapiIframe():l(_createError(e,"network-request-failed"))},_loadJS(`https://apis.google.com/js/api.js?onload=${t}`).catch(e=>l(e))}}).catch(e=>{throw ep=null,e})),l=_window().gapi;return _assert(l,e,"internal-error"),t.open({where:document.body,url:function(e){let t=e.config;_assert(t.authDomain,e,"auth-domain-config-required");let l=t.emulator?_emulatorUrl(t,"emulator/auth/iframe"):`https://${e.config.authDomain}/__/auth/iframe`,u={apiKey:t.apiKey,appName:e.name,v:d.Jn},f=ey.get(e.config.apiHost);f&&(u.eid=f);let m=e._getFrameworks();return m.length&&(u.fw=m.join(",")),`${l}?${(0,h.xO)(u).slice(1)}`}(e),messageHandlersFilter:l.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:e_,dontclear:!0},t=>new Promise(async(l,u)=>{await t.restyle({setHideOnLeave:!1});let h=_createError(e,"network-request-failed"),d=_window().setTimeout(()=>{u(h)},eg.get());function clearTimerAndResolve(){_window().clearTimeout(d),l(t)}t.ping(clearTimerAndResolve).then(clearTimerAndResolve,()=>{u(h)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ev={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"};let AuthPopup=class AuthPopup{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch(e){}}};let ew=encodeURIComponent("fac");async function _getRedirectUrl(e,t,l,u,f,m){_assert(e.config.authDomain,e,"auth-domain-config-required"),_assert(e.config.apiKey,e,"invalid-api-key");let g={apiKey:e.config.apiKey,appName:e.name,authType:l,redirectUrl:u,v:d.Jn,eventId:f};if(t instanceof FederatedAuthProvider)for(let[l,u]of(t.setDefaultLanguage(e.languageCode),g.providerId=t.providerId||"",(0,h.xb)(t.getCustomParameters())||(g.customParameters=JSON.stringify(t.getCustomParameters())),Object.entries(m||{})))g[l]=u;if(t instanceof BaseOAuthProvider){let e=t.getScopes().filter(e=>""!==e);e.length>0&&(g.scopes=e.join(","))}for(let t of(e.tenantId&&(g.tid=e.tenantId),Object.keys(g)))void 0===g[t]&&delete g[t];let _=await e._getAppCheckToken(),b=_?`#${ew}=${encodeURIComponent(_)}`:"";return`${function({config:e}){return e.emulator?_emulatorUrl(e,"emulator/auth/handler"):`https://${e.authDomain}/__/auth/handler`}(e)}?${(0,h.xO)(g).slice(1)}${b}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let eI="webStorageSupport",eE=class{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=BrowserSessionPersistence,this._completeRedirectFn=_getRedirectResult,this._overrideRedirectResult=_overrideRedirectResult}async _openPopup(e,t,l,u){var d;(null===(d=this.eventManagers[e._key()])||void 0===d?void 0:d.manager)||debugFail("_initialize() not called before _openPopup()");let f=await _getRedirectUrl(e,t,l,_getCurrentUrl(),u);return function(e,t,l,u=500,d=600){let f=Math.max((window.screen.availHeight-d)/2,0).toString(),m=Math.max((window.screen.availWidth-u)/2,0).toString(),g="",_=Object.assign(Object.assign({},ev),{width:u.toString(),height:d.toString(),top:f,left:m}),b=(0,h.z$)().toLowerCase();l&&(g=_isChromeIOS(b)?"_blank":l),_isFirefox(b)&&(t=t||"http://localhost",_.scrollbars="yes");let E=Object.entries(_).reduce((e,[t,l])=>`${e}${t}=${l},`,"");if(function(e=(0,h.z$)()){var t;return _isIOS(e)&&!!(null===(t=window.navigator)||void 0===t?void 0:t.standalone)}(b)&&"_self"!==g)return function(e,t){let l=document.createElement("a");l.href=e,l.target=t;let u=document.createEvent("MouseEvent");u.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),l.dispatchEvent(u)}(t||"",g),new AuthPopup(null);let k=window.open(t||"",g,E);_assert(k,e,"popup-blocked");try{k.focus()}catch(e){}return new AuthPopup(k)}(e,f,_generateEventId())}async _openRedirect(e,t,l,u){await this._originValidation(e);let h=await _getRedirectUrl(e,t,l,_getCurrentUrl(),u);return _window().location.href=h,new Promise(()=>{})}_initialize(e){let t=e._key();if(this.eventManagers[t]){let{manager:e,promise:l}=this.eventManagers[t];return e?Promise.resolve(e):(l||debugFail("If manager is not set, promise should be"),l)}let l=this.initAndGetManager(e);return this.eventManagers[t]={promise:l},l.catch(()=>{delete this.eventManagers[t]}),l}async initAndGetManager(e){let t=await _openIframe(e),l=new AuthEventManager(e);return t.register("authEvent",t=>{_assert(null==t?void 0:t.authEvent,e,"invalid-auth-event");let u=l.onEvent(t.authEvent);return{status:u?"ACK":"ERROR"}},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:l},this.iframes[e._key()]=t,l}_isIframeWebStorageSupported(e,t){let l=this.iframes[e._key()];l.send(eI,{type:eI},l=>{var u;let h=null===(u=null==l?void 0:l[0])||void 0===u?void 0:u[eI];void 0!==h&&t(!!h),_fail(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){let t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=_validateOrigin(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return _isMobileBrowser()||_isSafari()||_isIOS()}};let MultiFactorAssertionImpl=class MultiFactorAssertionImpl{constructor(e){this.factorId=e}_process(e,t,l){switch(t.type){case"enroll":return this._finalizeEnroll(e,t.credential,l);case"signin":return this._finalizeSignIn(e,t.credential);default:return debugFail("unexpected MultiFactorSessionType")}}};let PhoneMultiFactorAssertionImpl=class PhoneMultiFactorAssertionImpl extends MultiFactorAssertionImpl{constructor(e){super("phone"),this.credential=e}static _fromCredential(e){return new PhoneMultiFactorAssertionImpl(e)}_finalizeEnroll(e,t,l){return _performApiRequest(e,"POST","/v2/accounts/mfaEnrollment:finalize",_addTidIfNecessary(e,{idToken:t,displayName:l,phoneVerificationInfo:this.credential._makeVerificationRequest()}))}_finalizeSignIn(e,t){return _performApiRequest(e,"POST","/v2/accounts/mfaSignIn:finalize",_addTidIfNecessary(e,{mfaPendingCredential:t,phoneVerificationInfo:this.credential._makeVerificationRequest()}))}};let TotpMultiFactorAssertionImpl=class TotpMultiFactorAssertionImpl extends MultiFactorAssertionImpl{constructor(e,t,l){super("totp"),this.otp=e,this.enrollmentId=t,this.secret=l}static _fromSecret(e,t){return new TotpMultiFactorAssertionImpl(t,void 0,e)}static _fromEnrollmentId(e,t){return new TotpMultiFactorAssertionImpl(t,e)}async _finalizeEnroll(e,t,l){return _assert(void 0!==this.secret,e,"argument-error"),_performApiRequest(e,"POST","/v2/accounts/mfaEnrollment:finalize",_addTidIfNecessary(e,{idToken:t,displayName:l,totpVerificationInfo:this.secret._makeTotpVerificationInfo(this.otp)}))}async _finalizeSignIn(e,t){_assert(void 0!==this.enrollmentId&&void 0!==this.otp,e,"argument-error");let l={verificationCode:this.otp};return _performApiRequest(e,"POST","/v2/accounts/mfaSignIn:finalize",_addTidIfNecessary(e,{mfaPendingCredential:t,mfaEnrollmentId:this.enrollmentId,totpVerificationInfo:l}))}};let TotpSecret=class TotpSecret{constructor(e,t,l,u,h,d,f){this.sessionInfo=d,this.auth=f,this.secretKey=e,this.hashingAlgorithm=t,this.codeLength=l,this.codeIntervalSeconds=u,this.enrollmentCompletionDeadline=h}static _fromStartTotpMfaEnrollmentResponse(e,t){return new TotpSecret(e.totpSessionInfo.sharedSecretKey,e.totpSessionInfo.hashingAlgorithm,e.totpSessionInfo.verificationCodeLength,e.totpSessionInfo.periodSec,new Date(e.totpSessionInfo.finalizeEnrollmentTime).toUTCString(),e.totpSessionInfo.sessionInfo,t)}_makeTotpVerificationInfo(e){return{sessionInfo:this.sessionInfo,verificationCode:e}}generateQrCodeUrl(e,t){var l;let u=!1;return(_isEmptyString(e)||_isEmptyString(t))&&(u=!0),u&&(_isEmptyString(e)&&(e=(null===(l=this.auth.currentUser)||void 0===l?void 0:l.email)||"unknownuser"),_isEmptyString(t)&&(t=this.auth.name)),`otpauth://totp/${t}:${e}?secret=${this.secretKey}&issuer=${t}&algorithm=${this.hashingAlgorithm}&digits=${this.codeLength}`}};function _isEmptyString(e){return void 0===e||(null==e?void 0:e.length)===0}var eT="@firebase/auth",eS="0.23.2";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let AuthInterop=class AuthInterop{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),(null===(e=this.auth.currentUser)||void 0===e?void 0:e.uid)||null}async getToken(e){if(this.assertAuthConfigured(),await this.auth._initializationPromise,!this.auth.currentUser)return null;let t=await this.auth.currentUser.getIdToken(e);return{accessToken:t}}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;let t=this.auth.onIdTokenChanged(t=>{e((null==t?void 0:t.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();let t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){_assert(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}};let eA=(0,h.Pz)("authIdTokenMaxAge")||300,eC=null,mintCookieFactory=e=>async t=>{let l=t&&await t.getIdTokenResult(),u=l&&(new Date().getTime()-Date.parse(l.issuedAtTime))/1e3;if(u&&u>eA)return;let h=null==l?void 0:l.token;eC!==h&&(eC=h,await fetch(e,{method:h?"POST":"DELETE",headers:h?{Authorization:`Bearer ${h}`}:{}}))};function getAuth(e=(0,d.Mq)()){let t=(0,d.qX)(e,"auth");if(t.isInitialized())return t.getImmediate();let l=/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function(e,t){let l=(0,d.qX)(e,"auth");if(l.isInitialized()){let e=l.getImmediate(),u=l.getOptions();if((0,h.vZ)(u,null!=t?t:{}))return e;_fail(e,"already-initialized")}let u=l.initialize({options:t});return u}(e,{popupRedirectResolver:eE,persistence:[IndexedDBLocalPersistence,BrowserLocalPersistence,BrowserSessionPersistence]}),u=(0,h.Pz)("authTokenSyncURL");if(u){let e=mintCookieFactory(u);(0,h.m9)(l).beforeAuthStateChanged(e,()=>e(l.currentUser)),(0,h.m9)(l).onIdTokenChanged(t=>e(t),void 0,void 0)}let f=(0,h.q4)("auth");return f&&function(e,t,l){let u=_castAuth(e);_assert(u._canInitEmulator,u,"emulator-config-failed"),_assert(/^https?:\/\//.test(t),u,"invalid-emulator-scheme");let h=!!(null==l?void 0:l.disableWarnings),d=extractProtocol(t),{host:f,port:m}=function(e){let t=extractProtocol(e),l=/(\/\/)?([^?#/]+)/.exec(e.substr(t.length));if(!l)return{host:"",port:null};let u=l[2].split("@").pop()||"",h=/^(\[[^\]]+\])(:|$)/.exec(u);if(h){let e=h[1];return{host:e,port:parsePort(u.substr(e.length+1))}}{let[e,t]=u.split(":");return{host:e,port:parsePort(t)}}}(t),g=null===m?"":`:${m}`;u.config.emulator={url:`${d}//${f}${g}/`},u.settings.appVerificationDisabledForTesting=!0,u.emulatorConfig=Object.freeze({host:f,port:m,protocol:d.replace(":",""),options:Object.freeze({disableWarnings:h})}),h||function(){function attachBanner(){let e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}"undefined"!=typeof console&&"function"==typeof console.info&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),"undefined"!=typeof window&&"undefined"!=typeof document&&("loading"===document.readyState?window.addEventListener("DOMContentLoaded",attachBanner):attachBanner())}()}(l,`http://${f}`),l}u="Browser",(0,d.Xd)(new m.wA("auth",(e,{options:t})=>{let l=e.getProvider("app").getImmediate(),h=e.getProvider("heartbeat"),d=e.getProvider("app-check-internal"),{apiKey:f,authDomain:m}=l.options;_assert(f&&!f.includes(":"),"invalid-api-key",{appName:l.name});let g={apiKey:f,authDomain:m,clientPlatform:u,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:_getClientVersion(u)},_=new AuthImpl(l,h,d,g);return function(e,t){let l=(null==t?void 0:t.persistence)||[],u=(Array.isArray(l)?l:[l]).map(_getInstance);(null==t?void 0:t.errorMap)&&e._updateErrorMap(t.errorMap),e._initializeWithPersistence(u,null==t?void 0:t.popupRedirectResolver)}(_,t),_},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,l)=>{let u=e.getProvider("auth-internal");u.initialize()})),(0,d.Xd)(new m.wA("auth-internal",e=>{let t=_castAuth(e.getProvider("auth").getImmediate());return new AuthInterop(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),(0,d.KN)(eT,eS,/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function(e){switch(e){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";default:return}}(u)),(0,d.KN)(eT,eS,"esm2017")},6100:function(e,t,l){"use strict";l.d(t,{EK:function(){return it},ET:function(){return pf},hJ:function(){return _h},oe:function(){return yf},JU:function(){return gh},QT:function(){return af},PL:function(){return df},ad:function(){return Ph},nP:function(){return zf},b9:function(){return kl},cf:function(){return If},Xo:function(){return xl},IO:function(){return Rl},Bt:function(){return Gf},pl:function(){return mf},r7:function(){return gf},ar:function(){return bl}});var u,h,d,f,m,g,_,b=l(5816),E=l(8463),k=l(3333),L=l(4444),V="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},z={},ee=ee||{},er=V||self;function aa(e){var t=typeof e;return"array"==(t="object"!=t?t:e?Array.isArray(e)?"array":t:"null")||"object"==t&&"number"==typeof e.length}function p(e){var t=typeof e;return"object"==t&&null!=e||"function"==t}function ea(e,t,l){return e.call.apply(e.bind,arguments)}function fa(e,t,l){if(!e)throw Error();if(2<arguments.length){var u=Array.prototype.slice.call(arguments,2);return function(){var l=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(l,u),e.apply(t,l)}}return function(){return e.apply(t,arguments)}}function q(e,t,l){return(q=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ea:fa).apply(null,arguments)}function ha(e,t){var l=Array.prototype.slice.call(arguments,1);return function(){var t=l.slice();return t.push.apply(t,arguments),e.apply(this,t)}}function r(e,t){function c(){}c.prototype=t.prototype,e.$=t.prototype,e.prototype=new c,e.prototype.constructor=e,e.ac=function(e,l,u){for(var h=Array(arguments.length-2),d=2;d<arguments.length;d++)h[d-2]=arguments[d];return t.prototype[l].apply(e,h)}}function v(){this.s=this.s,this.o=this.o}v.prototype.s=!1,v.prototype.sa=function(){this.s||(this.s=!0,this.N())},v.prototype.N=function(){if(this.o)for(;this.o.length;)this.o.shift()()};let eo=Array.prototype.indexOf?function(e,t){return Array.prototype.indexOf.call(e,t,void 0)}:function(e,t){if("string"==typeof e)return"string"!=typeof t||1!=t.length?-1:e.indexOf(t,0);for(let l=0;l<e.length;l++)if(l in e&&e[l]===t)return l;return -1};function ma(e){let t=e.length;if(0<t){let l=Array(t);for(let u=0;u<t;u++)l[u]=e[u];return l}return[]}function na(e,t){for(let t=1;t<arguments.length;t++){let l=arguments[t];if(aa(l)){let t=e.length||0,u=l.length||0;e.length=t+u;for(let h=0;h<u;h++)e[t+h]=l[h]}else e.push(l)}}function w(e,t){this.type=e,this.g=this.target=t,this.defaultPrevented=!1}w.prototype.h=function(){this.defaultPrevented=!0};var eh=function(){if(!er.addEventListener||!Object.defineProperty)return!1;var e=!1,t=Object.defineProperty({},"passive",{get:function(){e=!0}});try{er.addEventListener("test",()=>{},t),er.removeEventListener("test",()=>{},t)}catch(e){}return e}();function x(e){return/^[\s\xa0]*$/.test(e)}function pa(){var e=er.navigator;return e&&(e=e.userAgent)?e:""}function y(e){return -1!=pa().indexOf(e)}function qa(e){return qa[" "](e),e}qa[" "]=function(){};var ec=y("Opera"),ef=y("Trident")||y("MSIE"),em=y("Edge"),ep=em||ef,eg=y("Gecko")&&!(-1!=pa().toLowerCase().indexOf("webkit")&&!y("Edge"))&&!(y("Trident")||y("MSIE"))&&!y("Edge"),e_=-1!=pa().toLowerCase().indexOf("webkit")&&!y("Edge");function ya(){var e=er.document;return e?e.documentMode:void 0}e:{var ey,ev="",ew=(ey=pa(),eg?/rv:([^\);]+)(\)|;)/.exec(ey):em?/Edge\/([\d\.]+)/.exec(ey):ef?/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(ey):e_?/WebKit\/(\S+)/.exec(ey):ec?/(?:Version)[ \/]?(\S+)/.exec(ey):void 0);if(ew&&(ev=ew?ew[1]:""),ef){var eI=ya();if(null!=eI&&eI>parseFloat(ev)){h=String(eI);break e}}h=ev}var eE=er.document&&ef&&(ya()||parseInt(h,10))||void 0;function A(e,t){if(w.call(this,e?e.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,e){var l=this.type=e.type,u=e.changedTouches&&e.changedTouches.length?e.changedTouches[0]:null;if(this.target=e.target||e.srcElement,this.g=t,t=e.relatedTarget){if(eg){e:{try{qa(t.nodeName);var h=!0;break e}catch(e){}h=!1}h||(t=null)}}else"mouseover"==l?t=e.fromElement:"mouseout"==l&&(t=e.toElement);this.relatedTarget=t,u?(this.clientX=void 0!==u.clientX?u.clientX:u.pageX,this.clientY=void 0!==u.clientY?u.clientY:u.pageY,this.screenX=u.screenX||0,this.screenY=u.screenY||0):(this.clientX=void 0!==e.clientX?e.clientX:e.pageX,this.clientY=void 0!==e.clientY?e.clientY:e.pageY,this.screenX=e.screenX||0,this.screenY=e.screenY||0),this.button=e.button,this.key=e.key||"",this.ctrlKey=e.ctrlKey,this.altKey=e.altKey,this.shiftKey=e.shiftKey,this.metaKey=e.metaKey,this.pointerId=e.pointerId||0,this.pointerType="string"==typeof e.pointerType?e.pointerType:eT[e.pointerType]||"",this.state=e.state,this.i=e,e.defaultPrevented&&A.$.h.call(this)}}r(A,w);var eT={2:"touch",3:"pen",4:"mouse"};A.prototype.h=function(){A.$.h.call(this);var e=this.i;e.preventDefault?e.preventDefault():e.returnValue=!1};var eS="closure_listenable_"+(1e6*Math.random()|0),eA=0;function Ja(e,t,l,u,h){this.listener=e,this.proxy=null,this.src=t,this.type=l,this.capture=!!u,this.la=h,this.key=++eA,this.fa=this.ia=!1}function Ka(e){e.fa=!0,e.listener=null,e.proxy=null,e.src=null,e.la=null}function Na(e,t,l){for(let u in e)t.call(l,e[u],u,e)}function Pa(e){let t={};for(let l in e)t[l]=e[l];return t}let eC="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function Ra(e,t){let l,u;for(let t=1;t<arguments.length;t++){for(l in u=arguments[t])e[l]=u[l];for(let t=0;t<eC.length;t++)l=eC[t],Object.prototype.hasOwnProperty.call(u,l)&&(e[l]=u[l])}}function Sa(e){this.src=e,this.g={},this.h=0}function Ua(e,t){var l=t.type;if(l in e.g){var u,h=e.g[l],d=eo(h,t);(u=0<=d)&&Array.prototype.splice.call(h,d,1),u&&(Ka(t),0==e.g[l].length&&(delete e.g[l],e.h--))}}function Ta(e,t,l,u){for(var h=0;h<e.length;++h){var d=e[h];if(!d.fa&&d.listener==t&&!!l==d.capture&&d.la==u)return h}return -1}Sa.prototype.add=function(e,t,l,u,h){var d=e.toString();(e=this.g[d])||(e=this.g[d]=[],this.h++);var f=Ta(e,t,u,h);return -1<f?(t=e[f],l||(t.ia=!1)):((t=new Ja(t,this.src,d,!!u,h)).ia=l,e.push(t)),t};var ex="closure_lm_"+(1e6*Math.random()|0),ek={};function ab(e,t,l,u,h,d){if(!t)throw Error("Invalid event type");var f=p(h)?!!h.capture:!!h,m=bb(e);if(m||(e[ex]=m=new Sa(e)),(l=m.add(t,l,u,f,d)).proxy)return l;if(u=function a(e){return eb.call(a.src,a.listener,e)},l.proxy=u,u.src=e,u.listener=l,e.addEventListener)eh||(h=f),void 0===h&&(h=!1),e.addEventListener(t.toString(),u,h);else if(e.attachEvent)e.attachEvent(db(t.toString()),u);else if(e.addListener&&e.removeListener)e.addListener(u);else throw Error("addEventListener and attachEvent are unavailable.");return l}function gb(e){if("number"!=typeof e&&e&&!e.fa){var t=e.src;if(t&&t[eS])Ua(t.i,e);else{var l=e.type,u=e.proxy;t.removeEventListener?t.removeEventListener(l,u,e.capture):t.detachEvent?t.detachEvent(db(l),u):t.addListener&&t.removeListener&&t.removeListener(u),(l=bb(t))?(Ua(l,e),0==l.h&&(l.src=null,t[ex]=null)):Ka(e)}}}function db(e){return e in ek?ek[e]:ek[e]="on"+e}function eb(e,t){if(e.fa)e=!0;else{t=new A(t,this);var l=e.listener,u=e.la||e.src;e.ia&&gb(e),e=l.call(u,t)}return e}function bb(e){return(e=e[ex])instanceof Sa?e:null}var eR="__closure_events_fn_"+(1e9*Math.random()>>>0);function $a(e){return"function"==typeof e?e:(e[eR]||(e[eR]=function(t){return e.handleEvent(t)}),e[eR])}function B(){v.call(this),this.i=new Sa(this),this.S=this,this.J=null}function C(e,t){var l,u=e.J;if(u)for(l=[];u;u=u.J)l.push(u);if(e=e.S,u=t.type||t,"string"==typeof t)t=new w(t,e);else if(t instanceof w)t.target=t.target||e;else{var h=t;Ra(t=new w(u,e),h)}if(h=!0,l)for(var d=l.length-1;0<=d;d--){var f=t.g=l[d];h=ib(f,u,!0,t)&&h}if(h=ib(f=t.g=e,u,!0,t)&&h,h=ib(f,u,!1,t)&&h,l)for(d=0;d<l.length;d++)h=ib(f=t.g=l[d],u,!1,t)&&h}function ib(e,t,l,u){if(!(t=e.i.g[String(t)]))return!0;t=t.concat();for(var h=!0,d=0;d<t.length;++d){var f=t[d];if(f&&!f.fa&&f.capture==l){var m=f.listener,g=f.la||f.src;f.ia&&Ua(e.i,f),h=!1!==m.call(g,u)&&h}}return h&&!u.defaultPrevented}r(B,v),B.prototype[eS]=!0,B.prototype.removeEventListener=function(e,t,l,u){!function fb(e,t,l,u,h){if(Array.isArray(t))for(var d=0;d<t.length;d++)fb(e,t[d],l,u,h);else(u=p(u)?!!u.capture:!!u,l=$a(l),e&&e[eS])?(e=e.i,(t=String(t).toString())in e.g&&-1<(l=Ta(d=e.g[t],l,u,h))&&(Ka(d[l]),Array.prototype.splice.call(d,l,1),0==d.length&&(delete e.g[t],e.h--))):e&&(e=bb(e))&&(t=e.g[t.toString()],e=-1,t&&(e=Ta(t,l,u,h)),(l=-1<e?t[e]:null)&&gb(l))}(this,e,t,l,u)},B.prototype.N=function(){if(B.$.N.call(this),this.i){var e,t=this.i;for(e in t.g){for(var l=t.g[e],u=0;u<l.length;u++)Ka(l[u]);delete t.g[e],t.h--}}this.J=null},B.prototype.O=function(e,t,l,u){return this.i.add(String(e),t,!1,l,u)},B.prototype.P=function(e,t,l,u){return this.i.add(String(e),t,!0,l,u)};var eN=er.JSON.stringify,eO=new class{constructor(e,t){this.i=e,this.j=t,this.h=0,this.g=null}get(){let e;return 0<this.h?(this.h--,e=this.g,this.g=e.next,e.next=null):e=this.i(),e}}(()=>new pb,e=>e.reset());let pb=class pb{constructor(){this.next=this.g=this.h=null}set(e,t){this.h=e,this.g=t,this.next=null}reset(){this.next=this.g=this.h=null}};let eD,eP=!1,eM=new class{constructor(){this.h=this.g=null}add(e,t){let l=eO.get();l.set(e,t),this.h?this.h.next=l:this.g=l,this.h=l}},vb=()=>{let e=er.Promise.resolve(void 0);eD=()=>{e.then(ub)}};var ub=()=>{let e;for(var t;e=null,eM.g&&(e=eM.g,eM.g=eM.g.next,eM.g||(eM.h=null),e.next=null),t=e;){try{t.h.call(t.g)}catch(e){!function(e){er.setTimeout(()=>{throw e},0)}(e)}eO.j(t),100>eO.h&&(eO.h++,t.next=eO.g,eO.g=t)}eP=!1};function wb(e,t){B.call(this),this.h=e||1,this.g=t||er,this.j=q(this.qb,this),this.l=Date.now()}function xb(e){e.ga=!1,e.T&&(e.g.clearTimeout(e.T),e.T=null)}function yb(e,t,l){if("function"==typeof e)l&&(e=q(e,l));else if(e&&"function"==typeof e.handleEvent)e=q(e.handleEvent,e);else throw Error("Invalid listener argument");return 2147483647<Number(t)?-1:er.setTimeout(e,t||0)}r(wb,B),(_=wb.prototype).ga=!1,_.T=null,_.qb=function(){if(this.ga){var e=Date.now()-this.l;0<e&&e<.8*this.h?this.T=this.g.setTimeout(this.j,this.h-e):(this.T&&(this.g.clearTimeout(this.T),this.T=null),C(this,"tick"),this.ga&&(xb(this),this.start()))}},_.start=function(){this.ga=!0,this.T||(this.T=this.g.setTimeout(this.j,this.h),this.l=Date.now())},_.N=function(){wb.$.N.call(this),xb(this),delete this.g};let Ab=class Ab extends v{constructor(e,t){super(),this.m=e,this.j=t,this.h=null,this.i=!1,this.g=null}l(e){this.h=arguments,this.g?this.i=!0:function zb(e){e.g=yb(()=>{e.g=null,e.i&&(e.i=!1,zb(e))},e.j);let t=e.h;e.h=null,e.m.apply(null,t)}(this)}N(){super.N(),this.g&&(er.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}};function Bb(e){v.call(this),this.h=e,this.g={}}r(Bb,v);var eL=[];function Db(e,t,l,u){Array.isArray(l)||(l&&(eL[0]=l.toString()),l=eL);for(var h=0;h<l.length;h++){var d=function Ya(e,t,l,u,h){if(u&&u.once)return function Za(e,t,l,u,h){if(Array.isArray(t)){for(var d=0;d<t.length;d++)Za(e,t[d],l,u,h);return null}return l=$a(l),e&&e[eS]?e.P(t,l,p(u)?!!u.capture:!!u,h):ab(e,t,l,!0,u,h)}(e,t,l,u,h);if(Array.isArray(t)){for(var d=0;d<t.length;d++)Ya(e,t[d],l,u,h);return null}return l=$a(l),e&&e[eS]?e.O(t,l,p(u)?!!u.capture:!!u,h):ab(e,t,l,!1,u,h)}(t,l[h],u||e.handleEvent,!1,e.h||e);if(!d)break;e.g[d.key]=d}}function Fb(e){Na(e.g,function(e,t){this.g.hasOwnProperty(t)&&gb(e)},e),e.g={}}function Gb(){this.g=!0}function D(e,t,l,u){e.info(function(){return"XMLHTTP TEXT ("+t+"): "+function(e,t){if(!e.g)return t;if(!t)return null;try{var l=JSON.parse(t);if(l){for(e=0;e<l.length;e++)if(Array.isArray(l[e])){var u=l[e];if(!(2>u.length)){var h=u[1];if(Array.isArray(h)&&!(1>h.length)){var d=h[0];if("noop"!=d&&"stop"!=d&&"close"!=d)for(var f=1;f<h.length;f++)h[f]=""}}}}return eN(l)}catch(e){return t}}(e,l)+(u?" "+u:"")})}Bb.prototype.N=function(){Bb.$.N.call(this),Fb(this)},Bb.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")},Gb.prototype.Ea=function(){this.g=!1},Gb.prototype.info=function(){};var eU={},eF=null;function Mb(){return eF=eF||new B}function Nb(e){w.call(this,eU.Ta,e)}function Ob(e){let t=Mb();C(t,new Nb(t))}function Pb(e,t){w.call(this,eU.STAT_EVENT,e),this.stat=t}function F(e){let t=Mb();C(t,new Pb(t,e))}function Qb(e,t){w.call(this,eU.Ua,e),this.size=t}function Rb(e,t){if("function"!=typeof e)throw Error("Fn must not be null and must be a function");return er.setTimeout(function(){e()},t)}eU.Ta="serverreachability",r(Nb,w),eU.STAT_EVENT="statevent",r(Pb,w),eU.Ua="timingevent",r(Qb,w);var eV={NO_ERROR:0,rb:1,Eb:2,Db:3,yb:4,Cb:5,Fb:6,Qa:7,TIMEOUT:8,Ib:9},eB={wb:"complete",Sb:"success",Ra:"error",Qa:"abort",Kb:"ready",Lb:"readystatechange",TIMEOUT:"timeout",Gb:"incrementaldata",Jb:"progress",zb:"downloadprogress",$b:"uploadprogress"};function Ub(){}function Vb(e){return e.h||(e.h=e.i())}function Wb(){}Ub.prototype.h=null;var ej={OPEN:"a",vb:"b",Ra:"c",Hb:"d"};function Yb(){w.call(this,"d")}function Zb(){w.call(this,"c")}function ac(){}function bc(e,t,l,u){this.l=e,this.j=t,this.m=l,this.W=u||1,this.U=new Bb(this),this.P=eq,e=ep?125:void 0,this.V=new wb(e),this.I=null,this.i=!1,this.s=this.A=this.v=this.L=this.G=this.Y=this.B=null,this.F=[],this.g=null,this.C=0,this.o=this.u=null,this.ca=-1,this.J=!1,this.O=0,this.M=null,this.ba=this.K=this.aa=this.S=!1,this.h=new dc}function dc(){this.i=null,this.g="",this.h=!1}r(Yb,w),r(Zb,w),r(ac,Ub),ac.prototype.g=function(){return new XMLHttpRequest},ac.prototype.i=function(){return{}},f=new ac;var eq=45e3,ez={},e$={};function gc(e,t,l){e.L=1,e.v=hc(G(t)),e.s=l,e.S=!0,ic(e,null)}function ic(e,t){e.G=Date.now(),jc(e),e.A=G(e.v);var l=e.A,u=e.W;Array.isArray(u)||(u=[String(u)]),kc(l.i,"t",u),e.C=0,l=e.l.J,e.h=new dc,e.g=lc(e.l,l?t:null,!e.s),0<e.O&&(e.M=new Ab(q(e.Pa,e,e.g),e.O)),Db(e.U,e.g,"readystatechange",e.nb),t=e.I?Pa(e.I):{},e.s?(e.u||(e.u="POST"),t["Content-Type"]="application/x-www-form-urlencoded",e.g.ha(e.A,e.u,e.s,t)):(e.u="GET",e.g.ha(e.A,e.u,null,t)),Ob(),function(e,t,l,u,h,d){e.info(function(){if(e.g){if(d)for(var f="",m=d.split("&"),g=0;g<m.length;g++){var _=m[g].split("=");if(1<_.length){var b=_[0];_=_[1];var E=b.split("_");f=2<=E.length&&"type"==E[1]?f+(b+"=")+_+"&":f+(b+"=redacted&")}}else f=null}else f=d;return"XMLHTTP REQ ("+u+") [attempt "+h+"]: "+t+"\n"+l+"\n"+f})}(e.j,e.u,e.A,e.m,e.W,e.s)}function oc(e){return!!e.g&&"GET"==e.u&&2!=e.L&&e.l.Ha}function rc(e,t,l){let u=!0,h;for(;!e.J&&e.C<l.length;)if((h=function(e,t){var l=e.C,u=t.indexOf("\n",l);return -1==u?e$:isNaN(l=Number(t.substring(l,u)))?ez:(u+=1)+l>t.length?e$:(t=t.slice(u,u+l),e.C=u+l,t)}(e,l))==e$){4==t&&(e.o=4,F(14),u=!1),D(e.j,e.m,null,"[Incomplete Response]");break}else if(h==ez){e.o=4,F(15),D(e.j,e.m,l,"[Invalid Chunk]"),u=!1;break}else D(e.j,e.m,h,null),qc(e,h);oc(e)&&h!=e$&&h!=ez&&(e.h.g="",e.C=0),4!=t||0!=l.length||e.h.h||(e.o=1,F(16),u=!1),e.i=e.i&&u,u?0<l.length&&!e.ba&&(e.ba=!0,(t=e.l).g==e&&t.ca&&!t.M&&(t.l.info("Great, no buffering proxy detected. Bytes received: "+l.length),vc(t),t.M=!0,F(11))):(D(e.j,e.m,l,"[Invalid Chunked Response]"),I(e),pc(e))}function jc(e){e.Y=Date.now()+e.P,wc(e,e.P)}function wc(e,t){if(null!=e.B)throw Error("WatchDog timer not null");e.B=Rb(q(e.lb,e),t)}function nc(e){e.B&&(er.clearTimeout(e.B),e.B=null)}function pc(e){0==e.l.H||e.J||sc(e.l,e)}function I(e){nc(e);var t=e.M;t&&"function"==typeof t.sa&&t.sa(),e.M=null,xb(e.V),Fb(e.U),e.g&&(t=e.g,e.g=null,t.abort(),t.sa())}function qc(e,t){try{var l=e.l;if(0!=l.H&&(l.g==e||xc(l.i,e))){if(!e.K&&xc(l.i,e)&&3==l.H){try{var u=l.Ja.g.parse(t)}catch(e){u=null}if(Array.isArray(u)&&3==u.length){var h=u;if(0==h[0]){e:if(!l.u){if(l.g){if(l.g.G+3e3<e.G)yc(l),zc(l);else break e}Ac(l),F(18)}}else l.Fa=h[1],0<l.Fa-l.V&&37500>h[2]&&l.G&&0==l.A&&!l.v&&(l.v=Rb(q(l.ib,l),6e3));if(1>=Bc(l.i)&&l.oa){try{l.oa()}catch(e){}l.oa=void 0}}else J(l,11)}else if((e.K||l.g==e)&&yc(l),!x(t))for(h=l.Ja.g.parse(t),t=0;t<h.length;t++){let m=h[t];if(l.V=m[0],m=m[1],2==l.H){if("c"==m[0]){l.K=m[1],l.pa=m[2];let t=m[3];null!=t&&(l.ra=t,l.l.info("VER="+l.ra));let h=m[4];null!=h&&(l.Ga=h,l.l.info("SVER="+l.Ga));let g=m[5];null!=g&&"number"==typeof g&&0<g&&(u=1.5*g,l.L=u,l.l.info("backChannelRequestTimeoutMs_="+u)),u=l;let _=e.g;if(_){let e=_.g?_.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(e){var d=u.i;d.g||-1==e.indexOf("spdy")&&-1==e.indexOf("quic")&&-1==e.indexOf("h2")||(d.j=d.l,d.g=new Set,d.h&&(Cc(d,d.h),d.h=null))}if(u.F){let e=_.g?_.g.getResponseHeader("X-HTTP-Session-Id"):null;e&&(u.Da=e,K(u.I,u.F,e))}}if(l.H=3,l.h&&l.h.Ba(),l.ca&&(l.S=Date.now()-e.G,l.l.info("Handshake RTT: "+l.S+"ms")),(u=l).wa=Dc(u,u.J?u.pa:null,u.Y),e.K){Ec(u.i,e);var f=u.L;f&&e.setTimeout(f),e.B&&(nc(e),jc(e)),u.g=e}else Fc(u);0<l.j.length&&Gc(l)}else"stop"!=m[0]&&"close"!=m[0]||J(l,7)}else 3==l.H&&("stop"==m[0]||"close"==m[0]?"stop"==m[0]?J(l,7):Hc(l):"noop"!=m[0]&&l.h&&l.h.Aa(m),l.A=0)}}Ob(4)}catch(e){}}function Kc(e,t){if(e.forEach&&"function"==typeof e.forEach)e.forEach(t,void 0);else if(aa(e)||"string"==typeof e)Array.prototype.forEach.call(e,t,void 0);else for(var l=function(e){if(e.ta&&"function"==typeof e.ta)return e.ta();if(!e.Z||"function"!=typeof e.Z){if("undefined"!=typeof Map&&e instanceof Map)return Array.from(e.keys());if(!("undefined"!=typeof Set&&e instanceof Set)){if(aa(e)||"string"==typeof e){var t=[];e=e.length;for(var l=0;l<e;l++)t.push(l);return t}for(let u in t=[],l=0,e)t[l++]=u;return t}}}(e),u=function(e){if(e.Z&&"function"==typeof e.Z)return e.Z();if("undefined"!=typeof Map&&e instanceof Map||"undefined"!=typeof Set&&e instanceof Set)return Array.from(e.values());if("string"==typeof e)return e.split("");if(aa(e)){for(var t=[],l=e.length,u=0;u<l;u++)t.push(e[u]);return t}for(u in t=[],l=0,e)t[l++]=e[u];return t}(e),h=u.length,d=0;d<h;d++)t.call(void 0,u[d],l&&l[d],e)}(_=bc.prototype).setTimeout=function(e){this.P=e},_.nb=function(e){e=e.target;let t=this.M;t&&3==H(e)?t.l():this.Pa(e)},_.Pa=function(e){try{if(e==this.g)e:{let b=H(this.g);var t=this.g.Ia();let E=this.g.da();if(!(3>b)&&(3!=b||ep||this.g&&(this.h.h||this.g.ja()||mc(this.g)))){this.J||4!=b||7==t||(8==t||0>=E?Ob(3):Ob(2)),nc(this);var l=this.g.da();this.ca=l;t:if(oc(this)){var u=mc(this.g);e="";var h=u.length,d=4==H(this.g);if(!this.h.i){if("undefined"==typeof TextDecoder){I(this),pc(this);var f="";break t}this.h.i=new er.TextDecoder}for(t=0;t<h;t++)this.h.h=!0,e+=this.h.i.decode(u[t],{stream:d&&t==h-1});u.splice(0,h),this.h.g+=e,this.C=0,f=this.h.g}else f=this.g.ja();if(this.i=200==l,function(e,t,l,u,h,d,f){e.info(function(){return"XMLHTTP RESP ("+u+") [ attempt "+h+"]: "+t+"\n"+l+"\n"+d+" "+f})}(this.j,this.u,this.A,this.m,this.W,b,l),this.i){if(this.aa&&!this.K){t:{if(this.g){var m,g=this.g;if((m=g.g?g.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!x(m)){var _=m;break t}}_=null}if(l=_)D(this.j,this.m,l,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,qc(this,l);else{this.i=!1,this.o=3,F(12),I(this),pc(this);break e}}this.S?(rc(this,b,f),ep&&this.i&&3==b&&(Db(this.U,this.V,"tick",this.mb),this.V.start())):(D(this.j,this.m,f,null),qc(this,f)),4==b&&I(this),this.i&&!this.J&&(4==b?sc(this.l,this):(this.i=!1,jc(this)))}else(function(e){let t={};e=(e.g&&2<=H(e)&&e.g.getAllResponseHeaders()||"").split("\r\n");for(let u=0;u<e.length;u++){if(x(e[u]))continue;var l=function(e){var t=1;e=e.split(":");let l=[];for(;0<t&&e.length;)l.push(e.shift()),t--;return e.length&&l.push(e.join(":")),l}(e[u]);let h=l[0];if("string"!=typeof(l=l[1]))continue;l=l.trim();let d=t[h]||[];t[h]=d,d.push(l)}!function(e,t){for(let l in e)t.call(void 0,e[l],l,e)}(t,function(e){return e.join(", ")})})(this.g),400==l&&0<f.indexOf("Unknown SID")?(this.o=3,F(12)):(this.o=0,F(13)),I(this),pc(this)}}}catch(e){}finally{}},_.mb=function(){if(this.g){var e=H(this.g),t=this.g.ja();this.C<t.length&&(nc(this),rc(this,e,t),this.i&&4!=e&&jc(this))}},_.cancel=function(){this.J=!0,I(this)},_.lb=function(){this.B=null;let e=Date.now();0<=e-this.Y?(function(e,t){e.info(function(){return"TIMEOUT: "+t})}(this.j,this.A),2!=this.L&&(Ob(),F(17)),I(this),this.o=2,pc(this)):wc(this,this.Y-e)};var eK=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function M(e){if(this.g=this.s=this.j="",this.m=null,this.o=this.l="",this.h=!1,e instanceof M){this.h=e.h,Nc(this,e.j),this.s=e.s,this.g=e.g,Oc(this,e.m),this.l=e.l;var t=e.i,l=new Pc;l.i=t.i,t.g&&(l.g=new Map(t.g),l.h=t.h),Qc(this,l),this.o=e.o}else e&&(t=String(e).match(eK))?(this.h=!1,Nc(this,t[1]||"",!0),this.s=Rc(t[2]||""),this.g=Rc(t[3]||"",!0),Oc(this,t[4]),this.l=Rc(t[5]||"",!0),Qc(this,t[6]||"",!0),this.o=Rc(t[7]||"")):(this.h=!1,this.i=new Pc(null,this.h))}function G(e){return new M(e)}function Nc(e,t,l){e.j=l?Rc(t,!0):t,e.j&&(e.j=e.j.replace(/:$/,""))}function Oc(e,t){if(t){if(isNaN(t=Number(t))||0>t)throw Error("Bad port number "+t);e.m=t}else e.m=null}function Qc(e,t,l){var u,h;t instanceof Pc?(e.i=t,u=e.i,(h=e.h)&&!u.j&&(N(u),u.i=null,u.g.forEach(function(e,t){var l=t.toLowerCase();t!=l&&($c(this,t),kc(this,l,e))},u)),u.j=h):(l||(t=Sc(t,eQ)),e.i=new Pc(t,e.h))}function K(e,t,l){e.i.set(t,l)}function hc(e){return K(e,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),e}function Rc(e,t){return e?t?decodeURI(e.replace(/%25/g,"%2525")):decodeURIComponent(e):""}function Sc(e,t,l){return"string"==typeof e?(e=encodeURI(e).replace(t,Zc),l&&(e=e.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),e):null}function Zc(e){return"%"+((e=e.charCodeAt(0))>>4&15).toString(16)+(15&e).toString(16)}M.prototype.toString=function(){var e=[],t=this.j;t&&e.push(Sc(t,eH,!0),":");var l=this.g;return(l||"file"==t)&&(e.push("//"),(t=this.s)&&e.push(Sc(t,eH,!0),"@"),e.push(encodeURIComponent(String(l)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),null!=(l=this.m)&&e.push(":",String(l))),(l=this.l)&&(this.g&&"/"!=l.charAt(0)&&e.push("/"),e.push(Sc(l,"/"==l.charAt(0)?eW:eG,!0))),(l=this.i.toString())&&e.push("?",l),(l=this.o)&&e.push("#",Sc(l,eJ)),e.join("")};var eH=/[#\/\?@]/g,eG=/[#\?:]/g,eW=/[#\?]/g,eQ=/[#\?@]/g,eJ=/#/g;function Pc(e,t){this.h=this.g=null,this.i=e||null,this.j=!!t}function N(e){e.g||(e.g=new Map,e.h=0,e.i&&function(e,t){if(e){e=e.split("&");for(var l=0;l<e.length;l++){var u=e[l].indexOf("="),h=null;if(0<=u){var d=e[l].substring(0,u);h=e[l].substring(u+1)}else d=e[l];t(d,h?decodeURIComponent(h.replace(/\+/g," ")):"")}}}(e.i,function(t,l){e.add(decodeURIComponent(t.replace(/\+/g," ")),l)}))}function $c(e,t){N(e),t=O(e,t),e.g.has(t)&&(e.i=null,e.h-=e.g.get(t).length,e.g.delete(t))}function ad(e,t){return N(e),t=O(e,t),e.g.has(t)}function kc(e,t,l){$c(e,t),0<l.length&&(e.i=null,e.g.set(O(e,t),ma(l)),e.h+=l.length)}function O(e,t){return t=String(t),e.j&&(t=t.toLowerCase()),t}(_=Pc.prototype).add=function(e,t){N(this),this.i=null,e=O(this,e);var l=this.g.get(e);return l||this.g.set(e,l=[]),l.push(t),this.h+=1,this},_.forEach=function(e,t){N(this),this.g.forEach(function(l,u){l.forEach(function(l){e.call(t,l,u,this)},this)},this)},_.ta=function(){N(this);let e=Array.from(this.g.values()),t=Array.from(this.g.keys()),l=[];for(let u=0;u<t.length;u++){let h=e[u];for(let e=0;e<h.length;e++)l.push(t[u])}return l},_.Z=function(e){N(this);let t=[];if("string"==typeof e)ad(this,e)&&(t=t.concat(this.g.get(O(this,e))));else{e=Array.from(this.g.values());for(let l=0;l<e.length;l++)t=t.concat(e[l])}return t},_.set=function(e,t){return N(this),this.i=null,ad(this,e=O(this,e))&&(this.h-=this.g.get(e).length),this.g.set(e,[t]),this.h+=1,this},_.get=function(e,t){return e&&0<(e=this.Z(e)).length?String(e[0]):t},_.toString=function(){if(this.i)return this.i;if(!this.g)return"";let e=[],t=Array.from(this.g.keys());for(var l=0;l<t.length;l++){var u=t[l];let d=encodeURIComponent(String(u)),f=this.Z(u);for(u=0;u<f.length;u++){var h=d;""!==f[u]&&(h+="="+encodeURIComponent(String(f[u]))),e.push(h)}}return this.i=e.join("&")};var eY=class{constructor(e,t){this.g=e,this.map=t}};function cd(e){this.l=e||eX,e=er.PerformanceNavigationTiming?0<(e=er.performance.getEntriesByType("navigation")).length&&("hq"==e[0].nextHopProtocol||"h2"==e[0].nextHopProtocol):!!(er.g&&er.g.Ka&&er.g.Ka()&&er.g.Ka().ec),this.j=e?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}var eX=10;function ed(e){return!!e.h||!!e.g&&e.g.size>=e.j}function Bc(e){return e.h?1:e.g?e.g.size:0}function xc(e,t){return e.h?e.h==t:!!e.g&&e.g.has(t)}function Cc(e,t){e.g?e.g.add(t):e.h=t}function Ec(e,t){e.h&&e.h==t?e.h=null:e.g&&e.g.has(t)&&e.g.delete(t)}function fd(e){if(null!=e.h)return e.i.concat(e.h.F);if(null!=e.g&&0!==e.g.size){let t=e.i;for(let l of e.g.values())t=t.concat(l.F);return t}return ma(e.i)}cd.prototype.cancel=function(){if(this.i=fd(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&0!==this.g.size){for(let e of this.g.values())e.cancel();this.g.clear()}};var eZ=class{stringify(e){return er.JSON.stringify(e,void 0)}parse(e){return er.JSON.parse(e,void 0)}};function hd(){this.g=new eZ}function kd(e,t,l,u,h){try{t.onload=null,t.onerror=null,t.onabort=null,t.ontimeout=null,h(u)}catch(e){}}function ld(e){this.l=e.fc||null,this.j=e.ob||!1}function md(e,t){B.call(this),this.F=e,this.u=t,this.m=void 0,this.readyState=e0,this.status=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.v=new Headers,this.h=null,this.C="GET",this.B="",this.g=!1,this.A=this.j=this.l=null}r(ld,Ub),ld.prototype.g=function(){return new md(this.l,this.j)},ld.prototype.i=(u={},function(){return u}),r(md,B);var e0=0;function qd(e){e.j.read().then(e.Xa.bind(e)).catch(e.ka.bind(e))}function pd(e){e.readyState=4,e.l=null,e.j=null,e.A=null,od(e)}function od(e){e.onreadystatechange&&e.onreadystatechange.call(e)}(_=md.prototype).open=function(e,t){if(this.readyState!=e0)throw this.abort(),Error("Error reopening a connection");this.C=e,this.B=t,this.readyState=1,od(this)},_.send=function(e){if(1!=this.readyState)throw this.abort(),Error("need to call open() first. ");this.g=!0;let t={headers:this.v,method:this.C,credentials:this.m,cache:void 0};e&&(t.body=e),(this.F||er).fetch(new Request(this.B,t)).then(this.$a.bind(this),this.ka.bind(this))},_.abort=function(){this.response=this.responseText="",this.v=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&4!=this.readyState&&(this.g=!1,pd(this)),this.readyState=e0},_.$a=function(e){if(this.g&&(this.l=e,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=e.headers,this.readyState=2,od(this)),this.g&&(this.readyState=3,od(this),this.g))){if("arraybuffer"===this.responseType)e.arrayBuffer().then(this.Ya.bind(this),this.ka.bind(this));else if(void 0!==er.ReadableStream&&"body"in e){if(this.j=e.body.getReader(),this.u){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.A=new TextDecoder;qd(this)}else e.text().then(this.Za.bind(this),this.ka.bind(this))}},_.Xa=function(e){if(this.g){if(this.u&&e.value)this.response.push(e.value);else if(!this.u){var t=e.value?e.value:new Uint8Array(0);(t=this.A.decode(t,{stream:!e.done}))&&(this.response=this.responseText+=t)}e.done?pd(this):od(this),3==this.readyState&&qd(this)}},_.Za=function(e){this.g&&(this.response=this.responseText=e,pd(this))},_.Ya=function(e){this.g&&(this.response=e,pd(this))},_.ka=function(){this.g&&pd(this)},_.setRequestHeader=function(e,t){this.v.append(e,t)},_.getResponseHeader=function(e){return this.h&&this.h.get(e.toLowerCase())||""},_.getAllResponseHeaders=function(){if(!this.h)return"";let e=[],t=this.h.entries();for(var l=t.next();!l.done;)e.push((l=l.value)[0]+": "+l[1]),l=t.next();return e.join("\r\n")},Object.defineProperty(md.prototype,"withCredentials",{get:function(){return"include"===this.m},set:function(e){this.m=e?"include":"same-origin"}});var e1=er.JSON.parse;function P(e){B.call(this),this.headers=new Map,this.u=e||null,this.h=!1,this.C=this.g=null,this.I="",this.m=0,this.j="",this.l=this.G=this.v=this.F=!1,this.B=0,this.A=null,this.K=e2,this.L=this.M=!1}r(P,B);var e2="",e7=/^https?$/i,e9=["POST","PUT"];function vd(e,t){e.h=!1,e.g&&(e.l=!0,e.g.abort(),e.l=!1),e.j=t,e.m=5,yd(e),zd(e)}function yd(e){e.F||(e.F=!0,C(e,"complete"),C(e,"error"))}function Ad(e){if(e.h&&void 0!==ee&&(!e.C[1]||4!=H(e)||2!=e.da())){if(e.v&&4==H(e))yb(e.La,0,e);else if(C(e,"readystatechange"),4==H(e)){e.h=!1;try{let f=e.da();switch(f){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var t,l,u=!0;break;default:u=!1}if(!(t=u)){if(l=0===f){var h=String(e.I).match(eK)[1]||null;!h&&er.self&&er.self.location&&(h=er.self.location.protocol.slice(0,-1)),l=!e7.test(h?h.toLowerCase():"")}t=l}if(t)C(e,"complete"),C(e,"success");else{e.m=6;try{var d=2<H(e)?e.g.statusText:""}catch(e){d=""}e.j=d+" ["+e.da()+"]",yd(e)}}finally{zd(e)}}}}function zd(e,t){if(e.g){wd(e);let l=e.g,u=e.C[0]?()=>{}:null;e.g=null,e.C=null,t||C(e,"ready");try{l.onreadystatechange=u}catch(e){}}}function wd(e){e.g&&e.L&&(e.g.ontimeout=null),e.A&&(er.clearTimeout(e.A),e.A=null)}function H(e){return e.g?e.g.readyState:0}function mc(e){try{if(!e.g)return null;if("response"in e.g)return e.g.response;switch(e.K){case e2:case"text":return e.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in e.g)return e.g.mozResponseArrayBuffer}return null}catch(e){return null}}function Bd(e){let t="";return Na(e,function(e,l){t+=l+":"+e+"\r\n"}),t}function Cd(e,t,l){e:{for(u in l){var u=!1;break e}u=!0}u||(l=Bd(l),"string"==typeof e?null!=l&&encodeURIComponent(String(l)):K(e,t,l))}function Dd(e,t,l){return l&&l.internalChannelParams&&l.internalChannelParams[e]||t}function Ed(e){this.Ga=0,this.j=[],this.l=new Gb,this.pa=this.wa=this.I=this.Y=this.g=this.Da=this.F=this.na=this.o=this.U=this.s=null,this.fb=this.W=0,this.cb=Dd("failFast",!1,e),this.G=this.v=this.u=this.m=this.h=null,this.aa=!0,this.Fa=this.V=-1,this.ba=this.A=this.C=0,this.ab=Dd("baseRetryDelayMs",5e3,e),this.hb=Dd("retryDelaySeedMs",1e4,e),this.eb=Dd("forwardChannelMaxRetries",2,e),this.xa=Dd("forwardChannelRequestTimeoutMs",2e4,e),this.va=e&&e.xmlHttpFactory||void 0,this.Ha=e&&e.dc||!1,this.L=void 0,this.J=e&&e.supportsCrossDomainXhr||!1,this.K="",this.i=new cd(e&&e.concurrentRequestLimit),this.Ja=new hd,this.P=e&&e.fastHandshake||!1,this.O=e&&e.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.bb=e&&e.bc||!1,e&&e.Ea&&this.l.Ea(),e&&e.forceLongPolling&&(this.aa=!1),this.ca=!this.P&&this.aa&&e&&e.detectBufferingProxy||!1,this.qa=void 0,e&&e.longPollingTimeout&&0<e.longPollingTimeout&&(this.qa=e.longPollingTimeout),this.oa=void 0,this.S=0,this.M=!1,this.ma=this.B=null}function Hc(e){if(Fd(e),3==e.H){var t=e.W++,l=G(e.I);if(K(l,"SID",e.K),K(l,"RID",t),K(l,"TYPE","terminate"),Gd(e,l),(t=new bc(e,e.l,t)).L=2,t.v=hc(G(l)),l=!1,er.navigator&&er.navigator.sendBeacon)try{l=er.navigator.sendBeacon(t.v.toString(),"")}catch(e){}!l&&er.Image&&((new Image).src=t.v,l=!0),l||(t.g=lc(t.l,null),t.g.ha(t.v)),t.G=Date.now(),jc(t)}Hd(e)}function zc(e){e.g&&(vc(e),e.g.cancel(),e.g=null)}function Fd(e){zc(e),e.u&&(er.clearTimeout(e.u),e.u=null),yc(e),e.i.cancel(),e.m&&("number"==typeof e.m&&er.clearTimeout(e.m),e.m=null)}function Gc(e){if(!ed(e.i)&&!e.m){e.m=!0;var t=e.Na;eD||vb(),eP||(eD(),eP=!0),eM.add(t,e),e.C=0}}function Ld(e,t){var l;l=t?t.m:e.W++;let u=G(e.I);K(u,"SID",e.K),K(u,"RID",l),K(u,"AID",e.V),Gd(e,u),e.o&&e.s&&Cd(u,e.o,e.s),l=new bc(e,e.l,l,e.C+1),null===e.o&&(l.I=e.s),t&&(e.j=t.F.concat(e.j)),t=Kd(e,l,1e3),l.setTimeout(Math.round(.5*e.xa)+Math.round(.5*e.xa*Math.random())),Cc(e.i,l),gc(l,u,t)}function Gd(e,t){e.na&&Na(e.na,function(e,l){K(t,l,e)}),e.h&&Kc({},function(e,l){K(t,l,e)})}function Kd(e,t,l){l=Math.min(e.j.length,l);var u=e.h?q(e.h.Va,e.h,e):null;e:{var h=e.j;let t=-1;for(;;){let e=["count="+l];-1==t?0<l?(t=h[0].g,e.push("ofs="+t)):t=0:e.push("ofs="+t);let d=!0;for(let f=0;f<l;f++){let l=h[f].g,m=h[f].map;if(0>(l-=t))t=Math.max(0,h[f].g-100),d=!1;else try{!function(e,t,l){let u=l||"";try{Kc(e,function(e,l){let h=e;p(e)&&(h=eN(e)),t.push(u+l+"="+encodeURIComponent(h))})}catch(e){throw t.push(u+"type="+encodeURIComponent("_badmap")),e}}(m,e,"req"+l+"_")}catch(e){u&&u(m)}}if(d){u=e.join("&");break e}}}return e=e.j.splice(0,l),t.F=e,u}function Fc(e){if(!e.g&&!e.u){e.ba=1;var t=e.Ma;eD||vb(),eP||(eD(),eP=!0),eM.add(t,e),e.A=0}}function Ac(e){return!e.g&&!e.u&&!(3<=e.A)&&(e.ba++,e.u=Rb(q(e.Ma,e),Jd(e,e.A)),e.A++,!0)}function vc(e){null!=e.B&&(er.clearTimeout(e.B),e.B=null)}function Md(e){e.g=new bc(e,e.l,"rpc",e.ba),null===e.o&&(e.g.I=e.s),e.g.O=0;var t=G(e.wa);K(t,"RID","rpc"),K(t,"SID",e.K),K(t,"AID",e.V),K(t,"CI",e.G?"0":"1"),!e.G&&e.qa&&K(t,"TO",e.qa),K(t,"TYPE","xmlhttp"),Gd(e,t),e.o&&e.s&&Cd(t,e.o,e.s),e.L&&e.g.setTimeout(e.L);var l=e.g;e=e.pa,l.L=1,l.v=hc(G(t)),l.s=null,l.S=!0,ic(l,e)}function yc(e){null!=e.v&&(er.clearTimeout(e.v),e.v=null)}function sc(e,t){var l=null;if(e.g==t){yc(e),vc(e),e.g=null;var u=2}else{if(!xc(e.i,t))return;l=t.F,Ec(e.i,t),u=1}if(0!=e.H){if(t.i){if(1==u){l=t.s?t.s.length:0,t=Date.now()-t.G;var h,d=e.C;C(u=Mb(),new Qb(u,l)),Gc(e)}else Fc(e)}else if(3==(d=t.o)||0==d&&0<t.ca||!(1==u&&(h=t,!(Bc(e.i)>=e.i.j-(e.m?1:0))&&(e.m?(e.j=h.F.concat(e.j),!0):1!=e.H&&2!=e.H&&!(e.C>=(e.cb?0:e.eb))&&(e.m=Rb(q(e.Na,e,h),Jd(e,e.C)),e.C++,!0)))||2==u&&Ac(e)))switch(l&&0<l.length&&((t=e.i).i=t.i.concat(l)),d){case 1:J(e,5);break;case 4:J(e,10);break;case 3:J(e,6);break;default:J(e,2)}}}function Jd(e,t){let l=e.ab+Math.floor(Math.random()*e.hb);return e.isActive()||(l*=2),l*t}function J(e,t){if(e.l.info("Error code "+t),2==t){var l=null;e.h&&(l=null);var u=q(e.pb,e);l||(l=new M("//www.google.com/images/cleardot.gif"),er.location&&"http"==er.location.protocol||Nc(l,"https"),hc(l)),function(e,t){let l=new Gb;if(er.Image){let u=new Image;u.onload=ha(kd,l,u,"TestLoadImage: loaded",!0,t),u.onerror=ha(kd,l,u,"TestLoadImage: error",!1,t),u.onabort=ha(kd,l,u,"TestLoadImage: abort",!1,t),u.ontimeout=ha(kd,l,u,"TestLoadImage: timeout",!1,t),er.setTimeout(function(){u.ontimeout&&u.ontimeout()},1e4),u.src=e}else t(!1)}(l.toString(),u)}else F(2);e.H=0,e.h&&e.h.za(t),Hd(e),Fd(e)}function Hd(e){if(e.H=0,e.ma=[],e.h){let t=fd(e.i);(0!=t.length||0!=e.j.length)&&(na(e.ma,t),na(e.ma,e.j),e.i.i.length=0,ma(e.j),e.j.length=0),e.h.ya()}}function Dc(e,t,l){var u=l instanceof M?G(l):new M(l);if(""!=u.g)t&&(u.g=t+"."+u.g),Oc(u,u.m);else{var h=er.location;u=h.protocol,t=t?t+"."+h.hostname:h.hostname,h=+h.port;var d=new M(null);u&&Nc(d,u),t&&(d.g=t),h&&Oc(d,h),l&&(d.l=l),u=d}return l=e.F,t=e.Da,l&&t&&K(u,l,t),K(u,"VER",e.ra),Gd(e,u),u}function lc(e,t,l){if(t&&!e.J)throw Error("Can't create secondary domain capable XhrIo object.");return(t=new P(l&&e.Ha&&!e.va?new ld({ob:!0}):e.va)).Oa(e.J),t}function Nd(){}function Od(){if(ef&&!(10<=Number(eE)))throw Error("Environmental error: no available transport.")}function Q(e,t){B.call(this),this.g=new Ed(t),this.l=e,this.h=t&&t.messageUrlParams||null,e=t&&t.messageHeaders||null,t&&t.clientProtocolHeaderRequired&&(e?e["X-Client-Protocol"]="webchannel":e={"X-Client-Protocol":"webchannel"}),this.g.s=e,e=t&&t.initMessageHeaders||null,t&&t.messageContentType&&(e?e["X-WebChannel-Content-Type"]=t.messageContentType:e={"X-WebChannel-Content-Type":t.messageContentType}),t&&t.Ca&&(e?e["X-WebChannel-Client-Profile"]=t.Ca:e={"X-WebChannel-Client-Profile":t.Ca}),this.g.U=e,(e=t&&t.cc)&&!x(e)&&(this.g.o=e),this.A=t&&t.supportsCrossDomainXhr||!1,this.v=t&&t.sendRawJson||!1,(t=t&&t.httpSessionIdParam)&&!x(t)&&(this.g.F=t,null!==(e=this.h)&&t in e&&t in(e=this.h)&&delete e[t]),this.j=new R(this)}function Pd(e){Yb.call(this),e.__headers__&&(this.headers=e.__headers__,this.statusCode=e.__status__,delete e.__headers__,delete e.__status__);var t=e.__sm__;if(t){e:{for(let l in t){e=l;break e}e=void 0}(this.i=e)&&(e=this.i,t=null!==t&&e in t?t[e]:void 0),this.data=t}else this.data=e}function Qd(){Zb.call(this),this.status=1}function R(e){this.g=e}function S(){this.blockSize=-1,this.blockSize=64,this.g=[,,,,],this.m=Array(this.blockSize),this.i=this.h=0,this.reset()}function Sd(e,t,l){l||(l=0);var u=Array(16);if("string"==typeof t)for(var h=0;16>h;++h)u[h]=t.charCodeAt(l++)|t.charCodeAt(l++)<<8|t.charCodeAt(l++)<<16|t.charCodeAt(l++)<<24;else for(h=0;16>h;++h)u[h]=t[l++]|t[l++]<<8|t[l++]<<16|t[l++]<<24;t=e.g[0],l=e.g[1],h=e.g[2];var d=e.g[3],f=t+(d^l&(h^d))+u[0]+3614090360&4294967295;f=d+(h^(t=l+(f<<7&4294967295|f>>>25))&(l^h))+u[1]+3905402710&4294967295,f=h+(l^(d=t+(f<<12&4294967295|f>>>20))&(t^l))+u[2]+606105819&4294967295,f=l+(t^(h=d+(f<<17&4294967295|f>>>15))&(d^t))+u[3]+3250441966&4294967295,f=t+(d^(l=h+(f<<22&4294967295|f>>>10))&(h^d))+u[4]+4118548399&4294967295,f=d+(h^(t=l+(f<<7&4294967295|f>>>25))&(l^h))+u[5]+1200080426&4294967295,f=h+(l^(d=t+(f<<12&4294967295|f>>>20))&(t^l))+u[6]+2821735955&4294967295,f=l+(t^(h=d+(f<<17&4294967295|f>>>15))&(d^t))+u[7]+4249261313&4294967295,f=t+(d^(l=h+(f<<22&4294967295|f>>>10))&(h^d))+u[8]+1770035416&4294967295,f=d+(h^(t=l+(f<<7&4294967295|f>>>25))&(l^h))+u[9]+2336552879&4294967295,f=h+(l^(d=t+(f<<12&4294967295|f>>>20))&(t^l))+u[10]+4294925233&4294967295,f=l+(t^(h=d+(f<<17&4294967295|f>>>15))&(d^t))+u[11]+2304563134&4294967295,f=t+(d^(l=h+(f<<22&4294967295|f>>>10))&(h^d))+u[12]+1804603682&4294967295,f=d+(h^(t=l+(f<<7&4294967295|f>>>25))&(l^h))+u[13]+4254626195&4294967295,f=h+(l^(d=t+(f<<12&4294967295|f>>>20))&(t^l))+u[14]+2792965006&4294967295,f=l+(t^(h=d+(f<<17&4294967295|f>>>15))&(d^t))+u[15]+1236535329&4294967295,l=h+(f<<22&4294967295|f>>>10),f=t+(h^d&(l^h))+u[1]+4129170786&4294967295,t=l+(f<<5&4294967295|f>>>27),f=d+(l^h&(t^l))+u[6]+3225465664&4294967295,d=t+(f<<9&4294967295|f>>>23),f=h+(t^l&(d^t))+u[11]+643717713&4294967295,h=d+(f<<14&4294967295|f>>>18),f=l+(d^t&(h^d))+u[0]+3921069994&4294967295,l=h+(f<<20&4294967295|f>>>12),f=t+(h^d&(l^h))+u[5]+3593408605&4294967295,t=l+(f<<5&4294967295|f>>>27),f=d+(l^h&(t^l))+u[10]+38016083&4294967295,d=t+(f<<9&4294967295|f>>>23),f=h+(t^l&(d^t))+u[15]+3634488961&4294967295,h=d+(f<<14&4294967295|f>>>18),f=l+(d^t&(h^d))+u[4]+3889429448&4294967295,l=h+(f<<20&4294967295|f>>>12),f=t+(h^d&(l^h))+u[9]+568446438&4294967295,t=l+(f<<5&4294967295|f>>>27),f=d+(l^h&(t^l))+u[14]+3275163606&4294967295,d=t+(f<<9&4294967295|f>>>23),f=h+(t^l&(d^t))+u[3]+4107603335&4294967295,h=d+(f<<14&4294967295|f>>>18),f=l+(d^t&(h^d))+u[8]+1163531501&4294967295,l=h+(f<<20&4294967295|f>>>12),f=t+(h^d&(l^h))+u[13]+2850285829&4294967295,t=l+(f<<5&4294967295|f>>>27),f=d+(l^h&(t^l))+u[2]+4243563512&4294967295,d=t+(f<<9&4294967295|f>>>23),f=h+(t^l&(d^t))+u[7]+1735328473&4294967295,h=d+(f<<14&4294967295|f>>>18),f=l+(d^t&(h^d))+u[12]+2368359562&4294967295,f=t+((l=h+(f<<20&4294967295|f>>>12))^h^d)+u[5]+4294588738&4294967295,f=d+((t=l+(f<<4&4294967295|f>>>28))^l^h)+u[8]+2272392833&4294967295,f=h+((d=t+(f<<11&4294967295|f>>>21))^t^l)+u[11]+1839030562&4294967295,f=l+((h=d+(f<<16&4294967295|f>>>16))^d^t)+u[14]+4259657740&4294967295,f=t+((l=h+(f<<23&4294967295|f>>>9))^h^d)+u[1]+2763975236&4294967295,f=d+((t=l+(f<<4&4294967295|f>>>28))^l^h)+u[4]+1272893353&4294967295,f=h+((d=t+(f<<11&4294967295|f>>>21))^t^l)+u[7]+4139469664&4294967295,f=l+((h=d+(f<<16&4294967295|f>>>16))^d^t)+u[10]+3200236656&4294967295,f=t+((l=h+(f<<23&4294967295|f>>>9))^h^d)+u[13]+681279174&4294967295,f=d+((t=l+(f<<4&4294967295|f>>>28))^l^h)+u[0]+3936430074&4294967295,f=h+((d=t+(f<<11&4294967295|f>>>21))^t^l)+u[3]+3572445317&4294967295,f=l+((h=d+(f<<16&4294967295|f>>>16))^d^t)+u[6]+76029189&4294967295,f=t+((l=h+(f<<23&4294967295|f>>>9))^h^d)+u[9]+3654602809&4294967295,f=d+((t=l+(f<<4&4294967295|f>>>28))^l^h)+u[12]+3873151461&4294967295,f=h+((d=t+(f<<11&4294967295|f>>>21))^t^l)+u[15]+530742520&4294967295,f=l+((h=d+(f<<16&4294967295|f>>>16))^d^t)+u[2]+3299628645&4294967295,l=h+(f<<23&4294967295|f>>>9),f=t+(h^(l|~d))+u[0]+4096336452&4294967295,t=l+(f<<6&4294967295|f>>>26),f=d+(l^(t|~h))+u[7]+1126891415&4294967295,d=t+(f<<10&4294967295|f>>>22),f=h+(t^(d|~l))+u[14]+2878612391&4294967295,h=d+(f<<15&4294967295|f>>>17),f=l+(d^(h|~t))+u[5]+4237533241&4294967295,l=h+(f<<21&4294967295|f>>>11),f=t+(h^(l|~d))+u[12]+1700485571&4294967295,t=l+(f<<6&4294967295|f>>>26),f=d+(l^(t|~h))+u[3]+2399980690&4294967295,d=t+(f<<10&4294967295|f>>>22),f=h+(t^(d|~l))+u[10]+4293915773&4294967295,h=d+(f<<15&4294967295|f>>>17),f=l+(d^(h|~t))+u[1]+2240044497&4294967295,l=h+(f<<21&4294967295|f>>>11),f=t+(h^(l|~d))+u[8]+1873313359&4294967295,t=l+(f<<6&4294967295|f>>>26),f=d+(l^(t|~h))+u[15]+4264355552&4294967295,d=t+(f<<10&4294967295|f>>>22),f=h+(t^(d|~l))+u[6]+2734768916&4294967295,h=d+(f<<15&4294967295|f>>>17),f=l+(d^(h|~t))+u[13]+1309151649&4294967295,l=h+(f<<21&4294967295|f>>>11),f=t+(h^(l|~d))+u[4]+4149444226&4294967295,t=l+(f<<6&4294967295|f>>>26),f=d+(l^(t|~h))+u[11]+3174756917&4294967295,d=t+(f<<10&4294967295|f>>>22),f=h+(t^(d|~l))+u[2]+718787259&4294967295,h=d+(f<<15&4294967295|f>>>17),f=l+(d^(h|~t))+u[9]+3951481745&4294967295,e.g[0]=e.g[0]+t&4294967295,e.g[1]=e.g[1]+(h+(f<<21&4294967295|f>>>11))&4294967295,e.g[2]=e.g[2]+h&4294967295,e.g[3]=e.g[3]+d&4294967295}function T(e,t){this.h=t;for(var l=[],u=!0,h=e.length-1;0<=h;h--){var d=0|e[h];u&&d==t||(l[h]=d,u=!1)}this.g=l}(_=P.prototype).Oa=function(e){this.M=e},_.ha=function(e,t,l,u){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.I+"; newUri="+e);t=t?t.toUpperCase():"GET",this.I=e,this.j="",this.m=0,this.F=!1,this.h=!0,this.g=this.u?this.u.g():f.g(),this.C=this.u?Vb(this.u):Vb(f),this.g.onreadystatechange=q(this.La,this);try{this.G=!0,this.g.open(t,String(e),!0),this.G=!1}catch(e){vd(this,e);return}if(e=l||"",l=new Map(this.headers),u){if(Object.getPrototypeOf(u)===Object.prototype)for(var h in u)l.set(h,u[h]);else if("function"==typeof u.keys&&"function"==typeof u.get)for(let e of u.keys())l.set(e,u.get(e));else throw Error("Unknown input type for opt_headers: "+String(u))}for(let[d,f]of(u=Array.from(l.keys()).find(e=>"content-type"==e.toLowerCase()),h=er.FormData&&e instanceof er.FormData,!(0<=eo(e9,t))||u||h||l.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8"),l))this.g.setRequestHeader(d,f);this.K&&(this.g.responseType=this.K),"withCredentials"in this.g&&this.g.withCredentials!==this.M&&(this.g.withCredentials=this.M);try{var d;wd(this),0<this.B&&((this.L=(d=this.g,ef&&"number"==typeof d.timeout&&void 0!==d.ontimeout))?(this.g.timeout=this.B,this.g.ontimeout=q(this.ua,this)):this.A=yb(this.ua,this.B,this)),this.v=!0,this.g.send(e),this.v=!1}catch(e){vd(this,e)}},_.ua=function(){void 0!==ee&&this.g&&(this.j="Timed out after "+this.B+"ms, aborting",this.m=8,C(this,"timeout"),this.abort(8))},_.abort=function(e){this.g&&this.h&&(this.h=!1,this.l=!0,this.g.abort(),this.l=!1,this.m=e||7,C(this,"complete"),C(this,"abort"),zd(this))},_.N=function(){this.g&&(this.h&&(this.h=!1,this.l=!0,this.g.abort(),this.l=!1),zd(this,!0)),P.$.N.call(this)},_.La=function(){this.s||(this.G||this.v||this.l?Ad(this):this.kb())},_.kb=function(){Ad(this)},_.isActive=function(){return!!this.g},_.da=function(){try{return 2<H(this)?this.g.status:-1}catch(e){return -1}},_.ja=function(){try{return this.g?this.g.responseText:""}catch(e){return""}},_.Wa=function(e){if(this.g){var t=this.g.responseText;return e&&0==t.indexOf(e)&&(t=t.substring(e.length)),e1(t)}},_.Ia=function(){return this.m},_.Sa=function(){return"string"==typeof this.j?this.j:String(this.j)},(_=Ed.prototype).ra=8,_.H=1,_.Na=function(e){if(this.m){if(this.m=null,1==this.H){if(!e){this.W=Math.floor(1e5*Math.random()),e=this.W++;let h=new bc(this,this.l,e),d=this.s;if(this.U&&(d?Ra(d=Pa(d),this.U):d=this.U),null!==this.o||this.O||(h.I=d,d=null),this.P)e:{for(var t=0,l=0;l<this.j.length;l++){t:{var u=this.j[l];if("__data__"in u.map&&"string"==typeof(u=u.map.__data__)){u=u.length;break t}u=void 0}if(void 0===u)break;if(4096<(t+=u)){t=l;break e}if(4096===t||l===this.j.length-1){t=l+1;break e}}t=1e3}else t=1e3;t=Kd(this,h,t),K(l=G(this.I),"RID",e),K(l,"CVER",22),this.F&&K(l,"X-HTTP-Session-Id",this.F),Gd(this,l),d&&(this.O?t="headers="+encodeURIComponent(String(Bd(d)))+"&"+t:this.o&&Cd(l,this.o,d)),Cc(this.i,h),this.bb&&K(l,"TYPE","init"),this.P?(K(l,"$req",t),K(l,"SID","null"),h.aa=!0,gc(h,l,null)):gc(h,l,t),this.H=2}}else 3==this.H&&(e?Ld(this,e):0==this.j.length||ed(this.i)||Ld(this))}},_.Ma=function(){if(this.u=null,Md(this),this.ca&&!(this.M||null==this.g||0>=this.S)){var e=2*this.S;this.l.info("BP detection timer enabled: "+e),this.B=Rb(q(this.jb,this),e)}},_.jb=function(){this.B&&(this.B=null,this.l.info("BP detection timeout reached."),this.l.info("Buffering proxy detected and switch to long-polling!"),this.G=!1,this.M=!0,F(10),zc(this),Md(this))},_.ib=function(){null!=this.v&&(this.v=null,zc(this),Ac(this),F(19))},_.pb=function(e){e?(this.l.info("Successfully pinged google.com"),F(2)):(this.l.info("Failed to ping google.com"),F(1))},_.isActive=function(){return!!this.h&&this.h.isActive(this)},(_=Nd.prototype).Ba=function(){},_.Aa=function(){},_.za=function(){},_.ya=function(){},_.isActive=function(){return!0},_.Va=function(){},Od.prototype.g=function(e,t){return new Q(e,t)},r(Q,B),Q.prototype.m=function(){this.g.h=this.j,this.A&&(this.g.J=!0);var e=this.g,t=this.l,l=this.h||void 0;F(0),e.Y=t,e.na=l||{},e.G=e.aa,e.I=Dc(e,null,e.Y),Gc(e)},Q.prototype.close=function(){Hc(this.g)},Q.prototype.u=function(e){var t=this.g;if("string"==typeof e){var l={};l.__data__=e,e=l}else this.v&&((l={}).__data__=eN(e),e=l);t.j.push(new eY(t.fb++,e)),3==t.H&&Gc(t)},Q.prototype.N=function(){this.g.h=null,delete this.j,Hc(this.g),delete this.g,Q.$.N.call(this)},r(Pd,Yb),r(Qd,Zb),r(R,Nd),R.prototype.Ba=function(){C(this.g,"a")},R.prototype.Aa=function(e){C(this.g,new Pd(e))},R.prototype.za=function(e){C(this.g,new Qd)},R.prototype.ya=function(){C(this.g,"b")},r(S,function(){this.blockSize=-1}),S.prototype.reset=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.i=this.h=0},S.prototype.j=function(e,t){void 0===t&&(t=e.length);for(var l=t-this.blockSize,u=this.m,h=this.h,d=0;d<t;){if(0==h)for(;d<=l;)Sd(this,e,d),d+=this.blockSize;if("string"==typeof e){for(;d<t;)if(u[h++]=e.charCodeAt(d++),h==this.blockSize){Sd(this,u),h=0;break}}else for(;d<t;)if(u[h++]=e[d++],h==this.blockSize){Sd(this,u),h=0;break}}this.h=h,this.i+=t},S.prototype.l=function(){var e=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);e[0]=128;for(var t=1;t<e.length-8;++t)e[t]=0;var l=8*this.i;for(t=e.length-8;t<e.length;++t)e[t]=255&l,l/=256;for(this.j(e),e=Array(16),t=l=0;4>t;++t)for(var u=0;32>u;u+=8)e[l++]=this.g[t]>>>u&255;return e};var e4={};function Td(e){return -128<=e&&128>e?Object.prototype.hasOwnProperty.call(e4,e)?e4[e]:e4[e]=new T([0|e],0>e?-1:0):new T([0|e],0>e?-1:0)}function U(e){if(isNaN(e)||!isFinite(e))return e5;if(0>e)return W(U(-e));for(var t=[],l=1,u=0;e>=l;u++)t[u]=e/l|0,l*=e6;return new T(t,0)}var e6=4294967296,e5=Td(0),e3=Td(1),e8=Td(16777216);function Y(e){if(0!=e.h)return!1;for(var t=0;t<e.g.length;t++)if(0!=e.g[t])return!1;return!0}function X(e){return -1==e.h}function W(e){for(var t=e.g.length,l=[],u=0;u<t;u++)l[u]=~e.g[u];return new T(l,~e.h).add(e3)}function Zd(e,t){return e.add(W(t))}function $d(e,t){for(;(65535&e[t])!=e[t];)e[t+1]+=e[t]>>>16,e[t]&=65535,t++}function ae(e,t){this.g=e,this.h=t}function Yd(e,t){if(Y(t))throw Error("division by zero");if(Y(e))return new ae(e5,e5);if(X(e))return t=Yd(W(e),t),new ae(W(t.g),W(t.h));if(X(t))return t=Yd(e,W(t)),new ae(W(t.g),t.h);if(30<e.g.length){if(X(e)||X(t))throw Error("slowDivide_ only works with positive integers.");for(var l=e3,u=t;0>=u.X(e);)l=be(l),u=be(u);var h=Z(l,1),d=Z(u,1);for(u=Z(u,2),l=Z(l,2);!Y(u);){var f=d.add(u);0>=f.X(e)&&(h=h.add(l),d=f),u=Z(u,1),l=Z(l,1)}return t=Zd(e,h.R(t)),new ae(h,t)}for(h=e5;0<=e.X(t);){for(u=48>=(u=Math.ceil(Math.log(l=Math.max(1,Math.floor(e.ea()/t.ea())))/Math.LN2))?1:Math.pow(2,u-48),f=(d=U(l)).R(t);X(f)||0<f.X(e);)l-=u,f=(d=U(l)).R(t);Y(d)&&(d=e3),h=h.add(d),e=Zd(e,f)}return new ae(h,e)}function be(e){for(var t=e.g.length+1,l=[],u=0;u<t;u++)l[u]=e.D(u)<<1|e.D(u-1)>>>31;return new T(l,e.h)}function Z(e,t){var l=t>>5;t%=32;for(var u=e.g.length-l,h=[],d=0;d<u;d++)h[d]=0<t?e.D(d+l)>>>t|e.D(d+l+1)<<32-t:e.D(d+l);return new T(h,e.h)}(_=T.prototype).ea=function(){if(X(this))return-W(this).ea();for(var e=0,t=1,l=0;l<this.g.length;l++){var u=this.D(l);e+=(0<=u?u:e6+u)*t,t*=e6}return e},_.toString=function(e){if(2>(e=e||10)||36<e)throw Error("radix out of range: "+e);if(Y(this))return"0";if(X(this))return"-"+W(this).toString(e);for(var t=U(Math.pow(e,6)),l=this,u="";;){var h=Yd(l,t).g,d=((0<(l=Zd(l,h.R(t))).g.length?l.g[0]:l.h)>>>0).toString(e);if(Y(l=h))return d+u;for(;6>d.length;)d="0"+d;u=d+u}},_.D=function(e){return 0>e?0:e<this.g.length?this.g[e]:this.h},_.X=function(e){return X(e=Zd(this,e))?-1:Y(e)?0:1},_.abs=function(){return X(this)?W(this):this},_.add=function(e){for(var t=Math.max(this.g.length,e.g.length),l=[],u=0,h=0;h<=t;h++){var d=u+(65535&this.D(h))+(65535&e.D(h)),f=(d>>>16)+(this.D(h)>>>16)+(e.D(h)>>>16);u=f>>>16,d&=65535,f&=65535,l[h]=f<<16|d}return new T(l,-2147483648&l[l.length-1]?-1:0)},_.R=function(e){if(Y(this)||Y(e))return e5;if(X(this))return X(e)?W(this).R(W(e)):W(W(this).R(e));if(X(e))return W(this.R(W(e)));if(0>this.X(e8)&&0>e.X(e8))return U(this.ea()*e.ea());for(var t=this.g.length+e.g.length,l=[],u=0;u<2*t;u++)l[u]=0;for(u=0;u<this.g.length;u++)for(var h=0;h<e.g.length;h++){var d=this.D(u)>>>16,f=65535&this.D(u),m=e.D(h)>>>16,g=65535&e.D(h);l[2*u+2*h]+=f*g,$d(l,2*u+2*h),l[2*u+2*h+1]+=d*g,$d(l,2*u+2*h+1),l[2*u+2*h+1]+=f*m,$d(l,2*u+2*h+1),l[2*u+2*h+2]+=d*m,$d(l,2*u+2*h+2)}for(u=0;u<t;u++)l[u]=l[2*u+1]<<16|l[2*u];for(u=t;u<2*t;u++)l[u]=0;return new T(l,0)},_.gb=function(e){return Yd(this,e).h},_.and=function(e){for(var t=Math.max(this.g.length,e.g.length),l=[],u=0;u<t;u++)l[u]=this.D(u)&e.D(u);return new T(l,this.h&e.h)},_.or=function(e){for(var t=Math.max(this.g.length,e.g.length),l=[],u=0;u<t;u++)l[u]=this.D(u)|e.D(u);return new T(l,this.h|e.h)},_.xor=function(e){for(var t=Math.max(this.g.length,e.g.length),l=[],u=0;u<t;u++)l[u]=this.D(u)^e.D(u);return new T(l,this.h^e.h)},Od.prototype.createWebChannel=Od.prototype.g,Q.prototype.send=Q.prototype.u,Q.prototype.open=Q.prototype.m,Q.prototype.close=Q.prototype.close,eV.NO_ERROR=0,eV.TIMEOUT=8,eV.HTTP_ERROR=6,eB.COMPLETE="complete",Wb.EventType=ej,ej.OPEN="a",ej.CLOSE="b",ej.ERROR="c",ej.MESSAGE="d",B.prototype.listen=B.prototype.O,P.prototype.listenOnce=P.prototype.P,P.prototype.getLastError=P.prototype.Sa,P.prototype.getLastErrorCode=P.prototype.Ia,P.prototype.getStatus=P.prototype.da,P.prototype.getResponseJson=P.prototype.Wa,P.prototype.getResponseText=P.prototype.ja,P.prototype.send=P.prototype.ha,P.prototype.setWithCredentials=P.prototype.Oa,S.prototype.digest=S.prototype.l,S.prototype.reset=S.prototype.reset,S.prototype.update=S.prototype.j,T.prototype.add=T.prototype.add,T.prototype.multiply=T.prototype.R,T.prototype.modulo=T.prototype.gb,T.prototype.compare=T.prototype.X,T.prototype.toNumber=T.prototype.ea,T.prototype.toString=T.prototype.toString,T.prototype.getBits=T.prototype.D,T.fromNumber=U,T.fromString=function Vd(e,t){if(0==e.length)throw Error("number format error: empty string");if(2>(t=t||10)||36<t)throw Error("radix out of range: "+t);if("-"==e.charAt(0))return W(Vd(e.substring(1),t));if(0<=e.indexOf("-"))throw Error('number format error: interior "-" character');for(var l=U(Math.pow(t,8)),u=e5,h=0;h<e.length;h+=8){var d=Math.min(8,e.length-h),f=parseInt(e.substring(h,h+d),t);8>d?(d=U(Math.pow(t,d)),u=u.R(d).add(U(f))):u=(u=u.R(l)).add(U(f))}return u};var te=z.createWebChannelTransport=function(){return new Od},tr=z.getStatEventTarget=function(){return Mb()},ta=z.ErrorCode=eV,to=z.EventType=eB,tc=z.Event=eU,td=z.Stat={xb:0,Ab:1,Bb:2,Ub:3,Zb:4,Wb:5,Xb:6,Vb:7,Tb:8,Yb:9,PROXY:10,NOPROXY:11,Rb:12,Nb:13,Ob:14,Mb:15,Pb:16,Qb:17,tb:18,sb:19,ub:20},tf=z.FetchXmlHttpFactory=ld,tm=z.WebChannel=Wb,tp=z.XhrIo=P,tg=z.Md5=S,t_=z.Integer=T;l(3454);let ty="@firebase/firestore";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let index_esm2017_V=class index_esm2017_V{constructor(e){this.uid=e}isAuthenticated(){return null!=this.uid}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}};index_esm2017_V.UNAUTHENTICATED=new index_esm2017_V(null),index_esm2017_V.GOOGLE_CREDENTIALS=new index_esm2017_V("google-credentials-uid"),index_esm2017_V.FIRST_PARTY=new index_esm2017_V("first-party-uid"),index_esm2017_V.MOCK_USER=new index_esm2017_V("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let tv="9.23.0",tw=new k.Yd("@firebase/firestore");function index_esm2017_C(){return tw.logLevel}function index_esm2017_N(e,...t){if(tw.logLevel<=k.in.DEBUG){let l=t.map($);tw.debug(`Firestore (${tv}): ${e}`,...l)}}function index_esm2017_k(e,...t){if(tw.logLevel<=k.in.ERROR){let l=t.map($);tw.error(`Firestore (${tv}): ${e}`,...l)}}function index_esm2017_M(e,...t){if(tw.logLevel<=k.in.WARN){let l=t.map($);tw.warn(`Firestore (${tv}): ${e}`,...l)}}function $(e){if("string"==typeof e)return e;try{return JSON.stringify(e)}catch(t){return e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function index_esm2017_O(e="Unexpected state"){let t=`FIRESTORE (${tv}) INTERNAL ASSERTION FAILED: `+e;throw index_esm2017_k(t),Error(t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let tb={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};let index_esm2017_U=class index_esm2017_U extends L.ZR{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let index_esm2017_K=class index_esm2017_K{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let index_esm2017_G=class index_esm2017_G{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}};let index_esm2017_Q=class index_esm2017_Q{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(index_esm2017_V.UNAUTHENTICATED))}shutdown(){}};let j=class j{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}};let index_esm2017_z=class index_esm2017_z{constructor(e){this.t=e,this.currentUser=index_esm2017_V.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){let l=this.i,s=e=>this.i!==l?(l=this.i,t(e)):Promise.resolve(),u=new index_esm2017_K;this.o=()=>{this.i++,this.currentUser=this.u(),u.resolve(),u=new index_esm2017_K,e.enqueueRetryable(()=>s(this.currentUser))};let r=()=>{let t=u;e.enqueueRetryable(async()=>{await t.promise,await s(this.currentUser)})},o=e=>{index_esm2017_N("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=e,this.auth.addAuthTokenListener(this.o),r()};this.t.onInit(e=>o(e)),setTimeout(()=>{if(!this.auth){let e=this.t.getImmediate({optional:!0});e?o(e):(index_esm2017_N("FirebaseAuthCredentialsProvider","Auth not yet detected"),u.resolve(),u=new index_esm2017_K)}},0),r()}getToken(){let e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(t=>this.i!==e?(index_esm2017_N("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):t?("string"==typeof t.accessToken||index_esm2017_O(),new index_esm2017_G(t.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.auth.removeAuthTokenListener(this.o)}u(){let e=this.auth&&this.auth.getUid();return null===e||"string"==typeof e||index_esm2017_O(),new index_esm2017_V(e)}};let index_esm2017_W=class index_esm2017_W{constructor(e,t,l){this.h=e,this.l=t,this.m=l,this.type="FirstParty",this.user=index_esm2017_V.FIRST_PARTY,this.g=new Map}p(){return this.m?this.m():null}get headers(){this.g.set("X-Goog-AuthUser",this.h);let e=this.p();return e&&this.g.set("Authorization",e),this.l&&this.g.set("X-Goog-Iam-Authorization-Token",this.l),this.g}};let index_esm2017_H=class index_esm2017_H{constructor(e,t,l){this.h=e,this.l=t,this.m=l}getToken(){return Promise.resolve(new index_esm2017_W(this.h,this.l,this.m))}start(e,t){e.enqueueRetryable(()=>t(index_esm2017_V.FIRST_PARTY))}shutdown(){}invalidateToken(){}};let index_esm2017_J=class index_esm2017_J{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}};let index_esm2017_Y=class index_esm2017_Y{constructor(e){this.I=e,this.forceRefresh=!1,this.appCheck=null,this.T=null}start(e,t){let n=e=>{null!=e.error&&index_esm2017_N("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${e.error.message}`);let l=e.token!==this.T;return this.T=e.token,index_esm2017_N("FirebaseAppCheckTokenProvider",`Received ${l?"new":"existing"} token.`),l?t(e.token):Promise.resolve()};this.o=t=>{e.enqueueRetryable(()=>n(t))};let s=e=>{index_esm2017_N("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=e,this.appCheck.addTokenListener(this.o)};this.I.onInit(e=>s(e)),setTimeout(()=>{if(!this.appCheck){let e=this.I.getImmediate({optional:!0});e?s(e):index_esm2017_N("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){let e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(e=>e?("string"==typeof e.token||index_esm2017_O(),this.T=e.token,new index_esm2017_J(e.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.appCheck.removeTokenListener(this.o)}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let tt=class tt{static A(){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=Math.floor(256/e.length)*e.length,l="";for(;l.length<20;){let u=/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function(e){let t="undefined"!=typeof self&&(self.crypto||self.msCrypto),l=new Uint8Array(e);if(t&&"function"==typeof t.getRandomValues)t.getRandomValues(l);else for(let t=0;t<e;t++)l[t]=Math.floor(256*Math.random());return l}(40);for(let h=0;h<u.length;++h)l.length<20&&u[h]<t&&(l+=e.charAt(u[h]%e.length))}return l}};function et(e,t){return e<t?-1:e>t?1:0}function nt(e,t,l){return e.length===t.length&&e.every((e,u)=>l(e,t[u]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let it=class it{constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0||t>=1e9)throw new index_esm2017_U(tb.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<-62135596800||e>=253402300800)throw new index_esm2017_U(tb.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return it.fromMillis(Date.now())}static fromDate(e){return it.fromMillis(e.getTime())}static fromMillis(e){let t=Math.floor(e/1e3),l=Math.floor(1e6*(e-1e3*t));return new it(t,l)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?et(this.nanoseconds,e.nanoseconds):et(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){let e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let rt=class rt{constructor(e){this.timestamp=e}static fromTimestamp(e){return new rt(e)}static min(){return new rt(new it(0,0))}static max(){return new rt(new it(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ot=class ot{constructor(e,t,l){void 0===t?t=0:t>e.length&&index_esm2017_O(),void 0===l?l=e.length-t:l>e.length-t&&index_esm2017_O(),this.segments=e,this.offset=t,this.len=l}get length(){return this.len}isEqual(e){return 0===ot.comparator(this,e)}child(e){let t=this.segments.slice(this.offset,this.limit());return e instanceof ot?e.forEach(e=>{t.push(e)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=void 0===e?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return 0===this.length}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,l=this.limit();t<l;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){let l=Math.min(e.length,t.length);for(let u=0;u<l;u++){let l=e.get(u),h=t.get(u);if(l<h)return -1;if(l>h)return 1}return e.length<t.length?-1:e.length>t.length?1:0}};let ut=class ut extends ot{construct(e,t,l){return new ut(e,t,l)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}static fromString(...e){let t=[];for(let l of e){if(l.indexOf("//")>=0)throw new index_esm2017_U(tb.INVALID_ARGUMENT,`Invalid segment (${l}). Paths must not contain // in them.`);t.push(...l.split("/").filter(e=>e.length>0))}return new ut(t)}static emptyPath(){return new ut([])}};let tI=/^[_a-zA-Z][_a-zA-Z0-9]*$/;let at=class at extends ot{construct(e,t,l){return new at(e,t,l)}static isValidIdentifier(e){return tI.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),at.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return 1===this.length&&"__name__"===this.get(0)}static keyField(){return new at(["__name__"])}static fromServerFormat(e){let t=[],l="",u=0,i=()=>{if(0===l.length)throw new index_esm2017_U(tb.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(l),l=""},h=!1;for(;u<e.length;){let t=e[u];if("\\"===t){if(u+1===e.length)throw new index_esm2017_U(tb.INVALID_ARGUMENT,"Path has trailing escape character: "+e);let t=e[u+1];if("\\"!==t&&"."!==t&&"`"!==t)throw new index_esm2017_U(tb.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);l+=t,u+=2}else"`"===t?h=!h:"."!==t||h?l+=t:i(),u++}if(i(),h)throw new index_esm2017_U(tb.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new at(t)}static emptyPath(){return new at([])}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ht=class ht{constructor(e){this.path=e}static fromPath(e){return new ht(ut.fromString(e))}static fromName(e){return new ht(ut.fromString(e).popFirst(5))}static empty(){return new ht(ut.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return null!==e&&0===ut.comparator(this.path,e.path)}toString(){return this.path.toString()}static comparator(e,t){return ut.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new ht(new ut(e.slice()))}};let It=class It{constructor(e,t,l){this.readTime=e,this.documentKey=t,this.largestBatchId=l}static min(){return new It(rt.min(),ht.empty(),-1)}static max(){return new It(rt.max(),ht.empty(),-1)}};let At=class At{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function vt(e){if(e.code!==tb.FAILED_PRECONDITION||"The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab."!==e.message)throw e;index_esm2017_N("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Rt=class Rt{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(e=>{this.isDone=!0,this.result=e,this.nextCallback&&this.nextCallback(e)},e=>{this.isDone=!0,this.error=e,this.catchCallback&&this.catchCallback(e)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&index_esm2017_O(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new Rt((l,u)=>{this.nextCallback=t=>{this.wrapSuccess(e,t).next(l,u)},this.catchCallback=e=>{this.wrapFailure(t,e).next(l,u)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{let t=e();return t instanceof Rt?t:Rt.resolve(t)}catch(e){return Rt.reject(e)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):Rt.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):Rt.reject(t)}static resolve(e){return new Rt((t,l)=>{t(e)})}static reject(e){return new Rt((t,l)=>{l(e)})}static waitFor(e){return new Rt((t,l)=>{let u=0,h=0,d=!1;e.forEach(e=>{++u,e.next(()=>{++h,d&&h===u&&t()},e=>l(e))}),d=!0,h===u&&t()})}static or(e){let t=Rt.resolve(!1);for(let l of e)t=t.next(e=>e?Rt.resolve(e):l());return t}static forEach(e,t){let l=[];return e.forEach((e,u)=>{l.push(t.call(this,e,u))}),this.waitFor(l)}static mapArray(e,t){return new Rt((l,u)=>{let h=e.length,d=Array(h),f=0;for(let m=0;m<h;m++){let g=m;t(e[g]).next(e=>{d[g]=e,++f===h&&l(d)},e=>u(e))}})}static doWhile(e,t){return new Rt((l,u)=>{let i=()=>{!0===e()?t().next(()=>{i()},u):l()};i()})}};function Dt(e){return"IndexedDbTransactionError"===e.name}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ot=class Ot{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=e=>this.ot(e),this.ut=e=>t.writeSequenceNumber(e))}ot(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){let e=++this.previousValue;return this.ut&&this.ut(e),e}};function Bt(e){return 0===e&&1/e==-1/0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function me(e){let t=0;for(let l in e)Object.prototype.hasOwnProperty.call(e,l)&&t++;return t}function ge(e,t){for(let l in e)Object.prototype.hasOwnProperty.call(e,l)&&t(l,e[l])}function ye(e){for(let t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}Ot.ct=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let pe=class pe{constructor(e,t){this.comparator=e,this.root=t||Te.EMPTY}insert(e,t){return new pe(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,Te.BLACK,null,null))}remove(e){return new pe(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Te.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){let l=this.comparator(e,t.key);if(0===l)return t.value;l<0?t=t.left:l>0&&(t=t.right)}return null}indexOf(e){let t=0,l=this.root;for(;!l.isEmpty();){let u=this.comparator(e,l.key);if(0===u)return t+l.left.size;u<0?l=l.left:(t+=l.left.size+1,l=l.right)}return -1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,l)=>(e(t,l),!1))}toString(){let e=[];return this.inorderTraversal((t,l)=>(e.push(`${t}:${l}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Ie(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Ie(this.root,e,this.comparator,!1)}getReverseIterator(){return new Ie(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Ie(this.root,e,this.comparator,!0)}};let Ie=class Ie{constructor(e,t,l,u){this.isReverse=u,this.nodeStack=[];let h=1;for(;!e.isEmpty();)if(h=t?l(e.key,t):1,t&&u&&(h*=-1),h<0)e=this.isReverse?e.left:e.right;else{if(0===h){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop(),t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(0===this.nodeStack.length)return null;let e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}};let Te=class Te{constructor(e,t,l,u,h){this.key=e,this.value=t,this.color=null!=l?l:Te.RED,this.left=null!=u?u:Te.EMPTY,this.right=null!=h?h:Te.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,l,u,h){return new Te(null!=e?e:this.key,null!=t?t:this.value,null!=l?l:this.color,null!=u?u:this.left,null!=h?h:this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,l){let u=this,h=l(e,u.key);return(u=h<0?u.copy(null,null,null,u.left.insert(e,t,l),null):0===h?u.copy(null,t,null,null,null):u.copy(null,null,null,null,u.right.insert(e,t,l))).fixUp()}removeMin(){if(this.left.isEmpty())return Te.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),(e=e.copy(null,null,null,e.left.removeMin(),null)).fixUp()}remove(e,t){let l,u=this;if(0>t(e,u.key))u.left.isEmpty()||u.left.isRed()||u.left.left.isRed()||(u=u.moveRedLeft()),u=u.copy(null,null,null,u.left.remove(e,t),null);else{if(u.left.isRed()&&(u=u.rotateRight()),u.right.isEmpty()||u.right.isRed()||u.right.left.isRed()||(u=u.moveRedRight()),0===t(e,u.key)){if(u.right.isEmpty())return Te.EMPTY;l=u.right.min(),u=u.copy(l.key,l.value,null,null,u.right.removeMin())}u=u.copy(null,null,null,null,u.right.remove(e,t))}return u.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=(e=(e=e.copy(null,null,null,null,e.right.rotateRight())).rotateLeft()).colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=(e=e.rotateRight()).colorFlip()),e}rotateLeft(){let e=this.copy(null,null,Te.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){let e=this.copy(null,null,Te.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){let e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){let e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw index_esm2017_O();let e=this.left.check();if(e!==this.right.check())throw index_esm2017_O();return e+(this.isRed()?0:1)}};Te.EMPTY=null,Te.RED=!0,Te.BLACK=!1,Te.EMPTY=new class{constructor(){this.size=0}get key(){throw index_esm2017_O()}get value(){throw index_esm2017_O()}get color(){throw index_esm2017_O()}get left(){throw index_esm2017_O()}get right(){throw index_esm2017_O()}copy(e,t,l,u,h){return this}insert(e,t,l){return new Te(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ee=class Ee{constructor(e){this.comparator=e,this.data=new pe(this.comparator)}has(e){return null!==this.data.get(e)}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,l)=>(e(t),!1))}forEachInRange(e,t){let l=this.data.getIteratorFrom(e[0]);for(;l.hasNext();){let u=l.getNext();if(this.comparator(u.key,e[1])>=0)return;t(u.key)}}forEachWhile(e,t){let l;for(l=void 0!==t?this.data.getIteratorFrom(t):this.data.getIterator();l.hasNext();)if(!e(l.getNext().key))return}firstAfterOrEqual(e){let t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Ae(this.data.getIterator())}getIteratorFrom(e){return new Ae(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(e=>{t=t.add(e)}),t}isEqual(e){if(!(e instanceof Ee)||this.size!==e.size)return!1;let t=this.data.getIterator(),l=e.data.getIterator();for(;t.hasNext();){let e=t.getNext().key,u=l.getNext().key;if(0!==this.comparator(e,u))return!1}return!0}toArray(){let e=[];return this.forEach(t=>{e.push(t)}),e}toString(){let e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){let t=new Ee(this.comparator);return t.data=e,t}};let Ae=class Ae{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Re=class Re{constructor(e){this.fields=e,e.sort(at.comparator)}static empty(){return new Re([])}unionWith(e){let t=new Ee(at.comparator);for(let e of this.fields)t=t.add(e);for(let l of e)t=t.add(l);return new Re(t.toArray())}covers(e){for(let t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return nt(this.fields,e.fields,(e,t)=>e.isEqual(t))}};/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Pe=class Pe extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ve=class Ve{constructor(e){this.binaryString=e}static fromBase64String(e){let t=function(e){try{return atob(e)}catch(e){throw"undefined"!=typeof DOMException&&e instanceof DOMException?new Pe("Invalid base64 string: "+e):e}}(e);return new Ve(t)}static fromUint8Array(e){let t=function(e){let t="";for(let l=0;l<e.length;++l)t+=String.fromCharCode(e[l]);return t}(e);return new Ve(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return btoa(this.binaryString)}toUint8Array(){return function(e){let t=new Uint8Array(e.length);for(let l=0;l<e.length;l++)t[l]=e.charCodeAt(l);return t}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return et(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}};Ve.EMPTY_BYTE_STRING=new Ve("");let tE=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function De(e){if(e||index_esm2017_O(),"string"==typeof e){let t=0,l=tE.exec(e);if(l||index_esm2017_O(),l[1]){let e=l[1];t=Number(e=(e+"000000000").substr(0,9))}let u=new Date(e);return{seconds:Math.floor(u.getTime()/1e3),nanos:t}}return{seconds:Ce(e.seconds),nanos:Ce(e.nanos)}}function Ce(e){return"number"==typeof e?e:"string"==typeof e?Number(e):0}function xe(e){return"string"==typeof e?Ve.fromBase64String(e):Ve.fromUint8Array(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ne(e){var t,l;return"server_timestamp"===(null===(l=((null===(t=null==e?void 0:e.mapValue)||void 0===t?void 0:t.fields)||{}).__type__)||void 0===l?void 0:l.stringValue)}function ke(e){let t=e.mapValue.fields.__previous_value__;return Ne(t)?ke(t):t}function Me(e){let t=De(e.mapValue.fields.__local_write_time__.timestampValue);return new it(t.seconds,t.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let $e=class $e{constructor(e,t,l,u,h,d,f,m,g){this.databaseId=e,this.appId=t,this.persistenceKey=l,this.host=u,this.ssl=h,this.forceLongPolling=d,this.autoDetectLongPolling=f,this.longPollingOptions=m,this.useFetchStreams=g}};let Oe=class Oe{constructor(e,t){this.projectId=e,this.database=t||"(default)"}static empty(){return new Oe("","")}get isDefaultDatabase(){return"(default)"===this.database}isEqual(e){return e instanceof Oe&&e.projectId===this.projectId&&e.database===this.database}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let tT={mapValue:{fields:{__type__:{stringValue:"__max__"}}}};function Le(e){return"nullValue"in e?0:"booleanValue"in e?1:"integerValue"in e||"doubleValue"in e?2:"timestampValue"in e?3:"stringValue"in e?5:"bytesValue"in e?6:"referenceValue"in e?7:"geoPointValue"in e?8:"arrayValue"in e?9:"mapValue"in e?Ne(e)?4:en(e)?9007199254740991:10:index_esm2017_O()}function qe(e,t){if(e===t)return!0;let l=Le(e);if(l!==Le(t))return!1;switch(l){case 0:case 9007199254740991:return!0;case 1:return e.booleanValue===t.booleanValue;case 4:return Me(e).isEqual(Me(t));case 3:return function(e,t){if("string"==typeof e.timestampValue&&"string"==typeof t.timestampValue&&e.timestampValue.length===t.timestampValue.length)return e.timestampValue===t.timestampValue;let l=De(e.timestampValue),u=De(t.timestampValue);return l.seconds===u.seconds&&l.nanos===u.nanos}(e,t);case 5:return e.stringValue===t.stringValue;case 6:return xe(e.bytesValue).isEqual(xe(t.bytesValue));case 7:return e.referenceValue===t.referenceValue;case 8:return Ce(e.geoPointValue.latitude)===Ce(t.geoPointValue.latitude)&&Ce(e.geoPointValue.longitude)===Ce(t.geoPointValue.longitude);case 2:return function(e,t){if("integerValue"in e&&"integerValue"in t)return Ce(e.integerValue)===Ce(t.integerValue);if("doubleValue"in e&&"doubleValue"in t){let l=Ce(e.doubleValue),u=Ce(t.doubleValue);return l===u?Bt(l)===Bt(u):isNaN(l)&&isNaN(u)}return!1}(e,t);case 9:return nt(e.arrayValue.values||[],t.arrayValue.values||[],qe);case 10:return function(e,t){let l=e.mapValue.fields||{},u=t.mapValue.fields||{};if(me(l)!==me(u))return!1;for(let e in l)if(l.hasOwnProperty(e)&&(void 0===u[e]||!qe(l[e],u[e])))return!1;return!0}(e,t);default:return index_esm2017_O()}}function Ue(e,t){return void 0!==(e.values||[]).find(e=>qe(e,t))}function Ke(e,t){if(e===t)return 0;let l=Le(e),u=Le(t);if(l!==u)return et(l,u);switch(l){case 0:case 9007199254740991:return 0;case 1:return et(e.booleanValue,t.booleanValue);case 2:return function(e,t){let l=Ce(e.integerValue||e.doubleValue),u=Ce(t.integerValue||t.doubleValue);return l<u?-1:l>u?1:l===u?0:isNaN(l)?isNaN(u)?0:-1:1}(e,t);case 3:return Ge(e.timestampValue,t.timestampValue);case 4:return Ge(Me(e),Me(t));case 5:return et(e.stringValue,t.stringValue);case 6:return function(e,t){let l=xe(e),u=xe(t);return l.compareTo(u)}(e.bytesValue,t.bytesValue);case 7:return function(e,t){let l=e.split("/"),u=t.split("/");for(let e=0;e<l.length&&e<u.length;e++){let t=et(l[e],u[e]);if(0!==t)return t}return et(l.length,u.length)}(e.referenceValue,t.referenceValue);case 8:return function(e,t){let l=et(Ce(e.latitude),Ce(t.latitude));return 0!==l?l:et(Ce(e.longitude),Ce(t.longitude))}(e.geoPointValue,t.geoPointValue);case 9:return function(e,t){let l=e.values||[],u=t.values||[];for(let e=0;e<l.length&&e<u.length;++e){let t=Ke(l[e],u[e]);if(t)return t}return et(l.length,u.length)}(e.arrayValue,t.arrayValue);case 10:return function(e,t){if(e===tT.mapValue&&t===tT.mapValue)return 0;if(e===tT.mapValue)return 1;if(t===tT.mapValue)return -1;let l=e.fields||{},u=Object.keys(l),h=t.fields||{},d=Object.keys(h);u.sort(),d.sort();for(let e=0;e<u.length&&e<d.length;++e){let t=et(u[e],d[e]);if(0!==t)return t;let f=Ke(l[u[e]],h[d[e]]);if(0!==f)return f}return et(u.length,d.length)}(e.mapValue,t.mapValue);default:throw index_esm2017_O()}}function Ge(e,t){if("string"==typeof e&&"string"==typeof t&&e.length===t.length)return et(e,t);let l=De(e),u=De(t),h=et(l.seconds,u.seconds);return 0!==h?h:et(l.nanos,u.nanos)}function je(e){var t,l;return"nullValue"in e?"null":"booleanValue"in e?""+e.booleanValue:"integerValue"in e?""+e.integerValue:"doubleValue"in e?""+e.doubleValue:"timestampValue"in e?function(e){let t=De(e);return`time(${t.seconds},${t.nanos})`}(e.timestampValue):"stringValue"in e?e.stringValue:"bytesValue"in e?xe(e.bytesValue).toBase64():"referenceValue"in e?(l=e.referenceValue,ht.fromName(l).toString()):"geoPointValue"in e?`geo(${(t=e.geoPointValue).latitude},${t.longitude})`:"arrayValue"in e?function(e){let t="[",l=!0;for(let u of e.values||[])l?l=!1:t+=",",t+=je(u);return t+"]"}(e.arrayValue):"mapValue"in e?function(e){let t=Object.keys(e.fields||{}).sort(),l="{",u=!0;for(let h of t)u?u=!1:l+=",",l+=`${h}:${je(e.fields[h])}`;return l+"}"}(e.mapValue):index_esm2017_O()}function We(e,t){return{referenceValue:`projects/${e.projectId}/databases/${e.database}/documents/${t.path.canonicalString()}`}}function He(e){return!!e&&"integerValue"in e}function Je(e){return!!e&&"arrayValue"in e}function Ye(e){return!!e&&"nullValue"in e}function Xe(e){return!!e&&"doubleValue"in e&&isNaN(Number(e.doubleValue))}function Ze(e){return!!e&&"mapValue"in e}function tn(e){if(e.geoPointValue)return{geoPointValue:Object.assign({},e.geoPointValue)};if(e.timestampValue&&"object"==typeof e.timestampValue)return{timestampValue:Object.assign({},e.timestampValue)};if(e.mapValue){let t={mapValue:{fields:{}}};return ge(e.mapValue.fields,(e,l)=>t.mapValue.fields[e]=tn(l)),t}if(e.arrayValue){let t={arrayValue:{values:[]}};for(let l=0;l<(e.arrayValue.values||[]).length;++l)t.arrayValue.values[l]=tn(e.arrayValue.values[l]);return t}return Object.assign({},e)}function en(e){return"__max__"===(((e.mapValue||{}).fields||{}).__type__||{}).stringValue}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let un=class un{constructor(e){this.value=e}static empty(){return new un({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let l=0;l<e.length-1;++l)if(!Ze(t=(t.mapValue.fields||{})[e.get(l)]))return null;return(t=(t.mapValue.fields||{})[e.lastSegment()])||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=tn(t)}setAll(e){let t=at.emptyPath(),l={},u=[];e.forEach((e,h)=>{if(!t.isImmediateParentOf(h)){let e=this.getFieldsMap(t);this.applyChanges(e,l,u),l={},u=[],t=h.popLast()}e?l[h.lastSegment()]=tn(e):u.push(h.lastSegment())});let h=this.getFieldsMap(t);this.applyChanges(h,l,u)}delete(e){let t=this.field(e.popLast());Ze(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return qe(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let l=0;l<e.length;++l){let u=t.mapValue.fields[e.get(l)];Ze(u)&&u.mapValue.fields||(u={mapValue:{fields:{}}},t.mapValue.fields[e.get(l)]=u),t=u}return t.mapValue.fields}applyChanges(e,t,l){for(let u of(ge(t,(t,l)=>e[t]=l),l))delete e[u]}clone(){return new un(tn(this.value))}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let an=class an{constructor(e,t,l,u,h,d,f){this.key=e,this.documentType=t,this.version=l,this.readTime=u,this.createTime=h,this.data=d,this.documentState=f}static newInvalidDocument(e){return new an(e,0,rt.min(),rt.min(),rt.min(),un.empty(),0)}static newFoundDocument(e,t,l,u){return new an(e,1,t,rt.min(),l,u,0)}static newNoDocument(e,t){return new an(e,2,t,rt.min(),rt.min(),un.empty(),0)}static newUnknownDocument(e,t){return new an(e,3,t,rt.min(),rt.min(),un.empty(),2)}convertToFoundDocument(e,t){return this.createTime.isEqual(rt.min())&&(2===this.documentType||0===this.documentType)&&(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=un.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=un.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=rt.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return 1===this.documentState}get hasCommittedMutations(){return 2===this.documentState}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return 0!==this.documentType}isFoundDocument(){return 1===this.documentType}isNoDocument(){return 2===this.documentType}isUnknownDocument(){return 3===this.documentType}isEqual(e){return e instanceof an&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new an(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let hn=class hn{constructor(e,t){this.position=e,this.inclusive=t}};function ln(e,t,l){let u=0;for(let h=0;h<e.position.length;h++){let d=t[h],f=e.position[h];if(u=d.field.isKeyField()?ht.comparator(ht.fromName(f.referenceValue),l.key):Ke(f,l.data.field(d.field)),"desc"===d.dir&&(u*=-1),0!==u)break}return u}function fn(e,t){if(null===e)return null===t;if(null===t||e.inclusive!==t.inclusive||e.position.length!==t.position.length)return!1;for(let l=0;l<e.position.length;l++)if(!qe(e.position[l],t.position[l]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let dn=class dn{constructor(e,t="asc"){this.field=e,this.dir=t}};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let _n=class _n{};let mn=class mn extends _n{constructor(e,t,l){super(),this.field=e,this.op=t,this.value=l}static create(e,t,l){return e.isKeyField()?"in"===t||"not-in"===t?this.createKeyFieldInFilter(e,t,l):new Pn(e,t,l):"array-contains"===t?new Dn(e,l):"in"===t?new Cn(e,l):"not-in"===t?new xn(e,l):"array-contains-any"===t?new Nn(e,l):new mn(e,t,l)}static createKeyFieldInFilter(e,t,l){return"in"===t?new bn(e,l):new Vn(e,l)}matches(e){let t=e.data.field(this.field);return"!="===this.op?null!==t&&this.matchesComparison(Ke(t,this.value)):null!==t&&Le(this.value)===Le(t)&&this.matchesComparison(Ke(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return 0===e;case"!=":return 0!==e;case">":return e>0;case">=":return e>=0;default:return index_esm2017_O()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}getFirstInequalityField(){return this.isInequality()?this.field:null}};let gn=class gn extends _n{constructor(e,t){super(),this.filters=e,this.op=t,this.lt=null}static create(e,t){return new gn(e,t)}matches(e){return yn(this)?void 0===this.filters.find(t=>!t.matches(e)):void 0!==this.filters.find(t=>t.matches(e))}getFlattenedFilters(){return null!==this.lt||(this.lt=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.lt}getFilters(){return Object.assign([],this.filters)}getFirstInequalityField(){let e=this.ft(e=>e.isInequality());return null!==e?e.field:null}ft(e){for(let t of this.getFlattenedFilters())if(e(t))return t;return null}};function yn(e){return"and"===e.op}function Tn(e){for(let t of e.filters)if(t instanceof gn)return!1;return!0}let Pn=class Pn extends mn{constructor(e,t,l){super(e,t,l),this.key=ht.fromName(l.referenceValue)}matches(e){let t=ht.comparator(e.key,this.key);return this.matchesComparison(t)}};let bn=class bn extends mn{constructor(e,t){super(e,"in",t),this.keys=Sn("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}};let Vn=class Vn extends mn{constructor(e,t){super(e,"not-in",t),this.keys=Sn("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}};function Sn(e,t){var l;return((null===(l=t.arrayValue)||void 0===l?void 0:l.values)||[]).map(e=>ht.fromName(e.referenceValue))}let Dn=class Dn extends mn{constructor(e,t){super(e,"array-contains",t)}matches(e){let t=e.data.field(this.field);return Je(t)&&Ue(t.arrayValue,this.value)}};let Cn=class Cn extends mn{constructor(e,t){super(e,"in",t)}matches(e){let t=e.data.field(this.field);return null!==t&&Ue(this.value.arrayValue,t)}};let xn=class xn extends mn{constructor(e,t){super(e,"not-in",t)}matches(e){if(Ue(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;let t=e.data.field(this.field);return null!==t&&!Ue(this.value.arrayValue,t)}};let Nn=class Nn extends mn{constructor(e,t){super(e,"array-contains-any",t)}matches(e){let t=e.data.field(this.field);return!(!Je(t)||!t.arrayValue.values)&&t.arrayValue.values.some(e=>Ue(this.value.arrayValue,e))}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let kn=class kn{constructor(e,t=null,l=[],u=[],h=null,d=null,f=null){this.path=e,this.collectionGroup=t,this.orderBy=l,this.filters=u,this.limit=h,this.startAt=d,this.endAt=f,this.dt=null}};function Mn(e,t=null,l=[],u=[],h=null,d=null,f=null){return new kn(e,t,l,u,h,d,f)}function $n(e){if(null===e.dt){let t=e.path.canonicalString();null!==e.collectionGroup&&(t+="|cg:"+e.collectionGroup),t+="|f:"+e.filters.map(e=>(function En(e){if(e instanceof mn)return e.field.canonicalString()+e.op.toString()+je(e.value);if(Tn(e)&&yn(e))return e.filters.map(e=>En(e)).join(",");{let t=e.filters.map(e=>En(e)).join(",");return`${e.op}(${t})`}})(e)).join(",")+"|ob:"+e.orderBy.map(e=>e.field.canonicalString()+e.dir).join(","),null==e.limit||(t+="|l:"+e.limit),e.startAt&&(t+="|lb:"+(e.startAt.inclusive?"b:":"a:")+e.startAt.position.map(e=>je(e)).join(",")),e.endAt&&(t+="|ub:"+(e.endAt.inclusive?"a:":"b:")+e.endAt.position.map(e=>je(e)).join(",")),e.dt=t}return e.dt}function On(e,t){if(e.limit!==t.limit||e.orderBy.length!==t.orderBy.length)return!1;for(let h=0;h<e.orderBy.length;h++){var l,u;if(l=e.orderBy[h],u=t.orderBy[h],!(l.dir===u.dir&&l.field.isEqual(u.field)))return!1}if(e.filters.length!==t.filters.length)return!1;for(let l=0;l<e.filters.length;l++)if(!function An(e,t){return e instanceof mn?t instanceof mn&&e.op===t.op&&e.field.isEqual(t.field)&&qe(e.value,t.value):e instanceof gn?t instanceof gn&&e.op===t.op&&e.filters.length===t.filters.length&&e.filters.reduce((e,l,u)=>e&&An(l,t.filters[u]),!0):void index_esm2017_O()}(e.filters[l],t.filters[l]))return!1;return e.collectionGroup===t.collectionGroup&&!!e.path.isEqual(t.path)&&!!fn(e.startAt,t.startAt)&&fn(e.endAt,t.endAt)}function Fn(e){return ht.isDocumentKey(e.path)&&null===e.collectionGroup&&0===e.filters.length}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Un=class Un{constructor(e,t=null,l=[],u=[],h=null,d="F",f=null,m=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=l,this.filters=u,this.limit=h,this.limitType=d,this.startAt=f,this.endAt=m,this.wt=null,this._t=null,this.startAt,this.endAt}};function Gn(e){return new Un(e)}function Qn(e){return 0===e.filters.length&&null===e.limit&&null==e.startAt&&null==e.endAt&&(0===e.explicitOrderBy.length||1===e.explicitOrderBy.length&&e.explicitOrderBy[0].field.isKeyField())}function jn(e){return e.explicitOrderBy.length>0?e.explicitOrderBy[0].field:null}function zn(e){for(let t of e.filters){let e=t.getFirstInequalityField();if(null!==e)return e}return null}function Wn(e){return null!==e.collectionGroup}function Hn(e){if(null===e.wt){e.wt=[];let t=zn(e),l=jn(e);if(null!==t&&null===l)t.isKeyField()||e.wt.push(new dn(t)),e.wt.push(new dn(at.keyField(),"asc"));else{let t=!1;for(let l of e.explicitOrderBy)e.wt.push(l),l.field.isKeyField()&&(t=!0);if(!t){let t=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";e.wt.push(new dn(at.keyField(),t))}}}return e.wt}function Jn(e){if(!e._t){if("F"===e.limitType)e._t=Mn(e.path,e.collectionGroup,Hn(e),e.filters,e.limit,e.startAt,e.endAt);else{let t=[];for(let l of Hn(e)){let e="desc"===l.dir?"asc":"desc";t.push(new dn(l.field,e))}let l=e.endAt?new hn(e.endAt.position,e.endAt.inclusive):null,u=e.startAt?new hn(e.startAt.position,e.startAt.inclusive):null;e._t=Mn(e.path,e.collectionGroup,t,e.filters,e.limit,l,u)}}return e._t}function Yn(e,t){t.getFirstInequalityField(),zn(e);let l=e.filters.concat([t]);return new Un(e.path,e.collectionGroup,e.explicitOrderBy.slice(),l,e.limit,e.limitType,e.startAt,e.endAt)}function Xn(e,t,l){return new Un(e.path,e.collectionGroup,e.explicitOrderBy.slice(),e.filters.slice(),t,l,e.startAt,e.endAt)}function Zn(e,t){return On(Jn(e),Jn(t))&&e.limitType===t.limitType}function ts(e){return`${$n(Jn(e))}|lt:${e.limitType}`}function es(e){var t;let l;return`Query(target=${l=(t=Jn(e)).path.canonicalString(),null!==t.collectionGroup&&(l+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(l+=`, filters: [${t.filters.map(e=>(function Rn(e){return e instanceof mn?`${e.field.canonicalString()} ${e.op} ${je(e.value)}`:e instanceof gn?e.op.toString()+" {"+e.getFilters().map(Rn).join(" ,")+"}":"Filter"})(e)).join(", ")}]`),null==t.limit||(l+=", limit: "+t.limit),t.orderBy.length>0&&(l+=`, orderBy: [${t.orderBy.map(e=>`${e.field.canonicalString()} (${e.dir})`).join(", ")}]`),t.startAt&&(l+=", startAt: "+(t.startAt.inclusive?"b:":"a:")+t.startAt.position.map(e=>je(e)).join(",")),t.endAt&&(l+=", endAt: "+(t.endAt.inclusive?"a:":"b:")+t.endAt.position.map(e=>je(e)).join(",")),`Target(${l})`}; limitType=${e.limitType})`}function ns(e,t){return t.isFoundDocument()&&function(e,t){let l=t.key.path;return null!==e.collectionGroup?t.key.hasCollectionId(e.collectionGroup)&&e.path.isPrefixOf(l):ht.isDocumentKey(e.path)?e.path.isEqual(l):e.path.isImmediateParentOf(l)}(e,t)&&function(e,t){for(let l of Hn(e))if(!l.field.isKeyField()&&null===t.data.field(l.field))return!1;return!0}(e,t)&&function(e,t){for(let l of e.filters)if(!l.matches(t))return!1;return!0}(e,t)&&(!e.startAt||!!function(e,t,l){let u=ln(e,t,l);return e.inclusive?u<=0:u<0}(e.startAt,Hn(e),t))&&(!e.endAt||!!function(e,t,l){let u=ln(e,t,l);return e.inclusive?u>=0:u>0}(e.endAt,Hn(e),t))}function is(e){return(t,l)=>{let u=!1;for(let h of Hn(e)){let e=function(e,t,l){let u=e.field.isKeyField()?ht.comparator(t.key,l.key):function(e,t,l){let u=t.data.field(e),h=l.data.field(e);return null!==u&&null!==h?Ke(u,h):index_esm2017_O()}(e.field,t,l);switch(e.dir){case"asc":return u;case"desc":return -1*u;default:return index_esm2017_O()}}(h,t,l);if(0!==e)return e;u=u||h.field.isKeyField()}return 0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let os=class os{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){let t=this.mapKeyFn(e),l=this.inner[t];if(void 0!==l){for(let[t,u]of l)if(this.equalsFn(t,e))return u}}has(e){return void 0!==this.get(e)}set(e,t){let l=this.mapKeyFn(e),u=this.inner[l];if(void 0===u)return this.inner[l]=[[e,t]],void this.innerSize++;for(let l=0;l<u.length;l++)if(this.equalsFn(u[l][0],e))return void(u[l]=[e,t]);u.push([e,t]),this.innerSize++}delete(e){let t=this.mapKeyFn(e),l=this.inner[t];if(void 0===l)return!1;for(let u=0;u<l.length;u++)if(this.equalsFn(l[u][0],e))return 1===l.length?delete this.inner[t]:l.splice(u,1),this.innerSize--,!0;return!1}forEach(e){ge(this.inner,(t,l)=>{for(let[t,u]of l)e(t,u)})}isEmpty(){return ye(this.inner)}size(){return this.innerSize}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let tS=new pe(ht.comparator),tA=new pe(ht.comparator);function hs(...e){let t=tA;for(let l of e)t=t.insert(l.key,l);return t}function ls(e){let t=tA;return e.forEach((e,l)=>t=t.insert(e,l.overlayedDocument)),t}function ws(){return new os(e=>e.toString(),(e,t)=>e.isEqual(t))}let tC=new pe(ht.comparator),tx=new Ee(ht.comparator);function gs(...e){let t=tx;for(let l of e)t=t.add(l);return t}let tk=new Ee(et);/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Is(e,t){if(e.useProto3Json){if(isNaN(t))return{doubleValue:"NaN"};if(t===1/0)return{doubleValue:"Infinity"};if(t===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Bt(t)?"-0":t}}function Ts(e){return{integerValue:""+e}}function Es(e,t){return"number"==typeof t&&Number.isInteger(t)&&!Bt(t)&&t<=Number.MAX_SAFE_INTEGER&&t>=Number.MIN_SAFE_INTEGER?Ts(t):Is(e,t)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let As=class As{constructor(){this._=void 0}};function Ps(e,t){return e instanceof xs?He(t)||t&&"doubleValue"in t?t:{integerValue:0}:null}let bs=class bs extends As{};let Vs=class Vs extends As{constructor(e){super(),this.elements=e}};function Ss(e,t){let l=ks(t);for(let t of e.elements)l.some(e=>qe(e,t))||l.push(t);return{arrayValue:{values:l}}}let Ds=class Ds extends As{constructor(e){super(),this.elements=e}};function Cs(e,t){let l=ks(t);for(let t of e.elements)l=l.filter(e=>!qe(e,t));return{arrayValue:{values:l}}}let xs=class xs extends As{constructor(e,t){super(),this.serializer=e,this.gt=t}};function Ns(e){return Ce(e.integerValue||e.doubleValue)}function ks(e){return Je(e)&&e.arrayValue.values?e.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ms=class Ms{constructor(e,t){this.field=e,this.transform=t}};let Os=class Os{constructor(e,t){this.version=e,this.transformResults=t}};let Fs=class Fs{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new Fs}static exists(e){return new Fs(void 0,e)}static updateTime(e){return new Fs(e)}get isNone(){return void 0===this.updateTime&&void 0===this.exists}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}};function Bs(e,t){return void 0!==e.updateTime?t.isFoundDocument()&&t.version.isEqual(e.updateTime):void 0===e.exists||e.exists===t.isFoundDocument()}let Ls=class Ls{};function qs(e,t){if(!e.hasLocalMutations||t&&0===t.fields.length)return null;if(null===t)return e.isNoDocument()?new Ys(e.key,Fs.none()):new js(e.key,e.data,Fs.none());{let l=e.data,u=un.empty(),h=new Ee(at.comparator);for(let e of t.fields)if(!h.has(e)){let t=l.field(e);null===t&&e.length>1&&(e=e.popLast(),t=l.field(e)),null===t?u.delete(e):u.set(e,t),h=h.add(e)}return new zs(e.key,u,new Re(h.toArray()),Fs.none())}}function Ks(e,t,l,u){return e instanceof js?function(e,t,l,u){if(!Bs(e.precondition,t))return l;let h=e.value.clone(),d=Js(e.fieldTransforms,u,t);return h.setAll(d),t.convertToFoundDocument(t.version,h).setHasLocalMutations(),null}(e,t,l,u):e instanceof zs?function(e,t,l,u){if(!Bs(e.precondition,t))return l;let h=Js(e.fieldTransforms,u,t),d=t.data;return(d.setAll(Ws(e)),d.setAll(h),t.convertToFoundDocument(t.version,d).setHasLocalMutations(),null===l)?null:l.unionWith(e.fieldMask.fields).unionWith(e.fieldTransforms.map(e=>e.field))}(e,t,l,u):Bs(e.precondition,t)?(t.convertToNoDocument(t.version).setHasLocalMutations(),null):l}function Qs(e,t){var l,u;return e.type===t.type&&!!e.key.isEqual(t.key)&&!!e.precondition.isEqual(t.precondition)&&(l=e.fieldTransforms,u=t.fieldTransforms,!!(void 0===l&&void 0===u||!(!l||!u)&&nt(l,u,(e,t)=>{var l,u;return e.field.isEqual(t.field)&&(l=e.transform,u=t.transform,l instanceof Vs&&u instanceof Vs||l instanceof Ds&&u instanceof Ds?nt(l.elements,u.elements,qe):l instanceof xs&&u instanceof xs?qe(l.gt,u.gt):l instanceof bs&&u instanceof bs)})))&&(0===e.type?e.value.isEqual(t.value):1!==e.type||e.data.isEqual(t.data)&&e.fieldMask.isEqual(t.fieldMask))}let js=class js extends Ls{constructor(e,t,l,u=[]){super(),this.key=e,this.value=t,this.precondition=l,this.fieldTransforms=u,this.type=0}getFieldMask(){return null}};let zs=class zs extends Ls{constructor(e,t,l,u,h=[]){super(),this.key=e,this.data=t,this.fieldMask=l,this.precondition=u,this.fieldTransforms=h,this.type=1}getFieldMask(){return this.fieldMask}};function Ws(e){let t=new Map;return e.fieldMask.fields.forEach(l=>{if(!l.isEmpty()){let u=e.data.field(l);t.set(l,u)}}),t}function Hs(e,t,l){var u;let h=new Map;e.length===l.length||index_esm2017_O();for(let d=0;d<l.length;d++){let f=e[d],m=f.transform,g=t.data.field(f.field);h.set(f.field,(u=l[d],m instanceof Vs?Ss(m,g):m instanceof Ds?Cs(m,g):u))}return h}function Js(e,t,l){let u=new Map;for(let h of e){let e=h.transform,d=l.data.field(h.field);u.set(h.field,e instanceof bs?function(e,t){let l={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:e.seconds,nanos:e.nanoseconds}}}};return t&&Ne(t)&&(t=ke(t)),t&&(l.fields.__previous_value__=t),{mapValue:l}}(t,d):e instanceof Vs?Ss(e,d):e instanceof Ds?Cs(e,d):function(e,t){let l=Ps(e,t),u=Ns(l)+Ns(e.gt);return He(l)&&He(e.gt)?Ts(u):Is(e.serializer,u)}(e,d))}return u}let Ys=class Ys extends Ls{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}};let Xs=class Xs extends Ls{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Zs=class Zs{constructor(e,t,l,u){this.batchId=e,this.localWriteTime=t,this.baseMutations=l,this.mutations=u}applyToRemoteDocument(e,t){let l=t.mutationResults;for(let t=0;t<this.mutations.length;t++){let h=this.mutations[t];if(h.key.isEqual(e.key)){var u;u=l[t],h instanceof js?function(e,t,l){let u=e.value.clone(),h=Hs(e.fieldTransforms,t,l.transformResults);u.setAll(h),t.convertToFoundDocument(l.version,u).setHasCommittedMutations()}(h,e,u):h instanceof zs?function(e,t,l){if(!Bs(e.precondition,t))return void t.convertToUnknownDocument(l.version);let u=Hs(e.fieldTransforms,t,l.transformResults),h=t.data;h.setAll(Ws(e)),h.setAll(u),t.convertToFoundDocument(l.version,h).setHasCommittedMutations()}(h,e,u):function(e,t,l){t.convertToNoDocument(l.version).setHasCommittedMutations()}(0,e,u)}}}applyToLocalView(e,t){for(let l of this.baseMutations)l.key.isEqual(e.key)&&(t=Ks(l,e,t,this.localWriteTime));for(let l of this.mutations)l.key.isEqual(e.key)&&(t=Ks(l,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){let l=ws();return this.mutations.forEach(u=>{let h=e.get(u.key),d=h.overlayedDocument,f=this.applyToLocalView(d,h.mutatedFields);f=t.has(u.key)?null:f;let m=qs(d,f);null!==m&&l.set(u.key,m),d.isValidDocument()||d.convertToNoDocument(rt.min())}),l}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),gs())}isEqual(e){return this.batchId===e.batchId&&nt(this.mutations,e.mutations,(e,t)=>Qs(e,t))&&nt(this.baseMutations,e.baseMutations,(e,t)=>Qs(e,t))}};let ti=class ti{constructor(e,t,l,u){this.batch=e,this.commitVersion=t,this.mutationResults=l,this.docVersions=u}static from(e,t,l){e.mutations.length===l.length||index_esm2017_O();let u=tC,h=e.mutations;for(let e=0;e<h.length;e++)u=u.insert(h[e].key,l[e].version);return new ti(e,t,l,u)}};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ei=class ei{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return null!==e&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let si=class si{constructor(e,t){this.count=e,this.unchangedNames=t}};function ui(e){if(void 0===e)return index_esm2017_k("GRPC error has no .code"),tb.UNKNOWN;switch(e){case m.OK:return tb.OK;case m.CANCELLED:return tb.CANCELLED;case m.UNKNOWN:return tb.UNKNOWN;case m.DEADLINE_EXCEEDED:return tb.DEADLINE_EXCEEDED;case m.RESOURCE_EXHAUSTED:return tb.RESOURCE_EXHAUSTED;case m.INTERNAL:return tb.INTERNAL;case m.UNAVAILABLE:return tb.UNAVAILABLE;case m.UNAUTHENTICATED:return tb.UNAUTHENTICATED;case m.INVALID_ARGUMENT:return tb.INVALID_ARGUMENT;case m.NOT_FOUND:return tb.NOT_FOUND;case m.ALREADY_EXISTS:return tb.ALREADY_EXISTS;case m.PERMISSION_DENIED:return tb.PERMISSION_DENIED;case m.FAILED_PRECONDITION:return tb.FAILED_PRECONDITION;case m.ABORTED:return tb.ABORTED;case m.OUT_OF_RANGE:return tb.OUT_OF_RANGE;case m.UNIMPLEMENTED:return tb.UNIMPLEMENTED;case m.DATA_LOSS:return tb.DATA_LOSS;default:return index_esm2017_O()}}(g=m||(m={}))[g.OK=0]="OK",g[g.CANCELLED=1]="CANCELLED",g[g.UNKNOWN=2]="UNKNOWN",g[g.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",g[g.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",g[g.NOT_FOUND=5]="NOT_FOUND",g[g.ALREADY_EXISTS=6]="ALREADY_EXISTS",g[g.PERMISSION_DENIED=7]="PERMISSION_DENIED",g[g.UNAUTHENTICATED=16]="UNAUTHENTICATED",g[g.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",g[g.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",g[g.ABORTED=10]="ABORTED",g[g.OUT_OF_RANGE=11]="OUT_OF_RANGE",g[g.UNIMPLEMENTED=12]="UNIMPLEMENTED",g[g.INTERNAL=13]="INTERNAL",g[g.UNAVAILABLE=14]="UNAVAILABLE",g[g.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ci=class ci{constructor(){this.onExistenceFilterMismatchCallbacks=new Map}static get instance(){return tR}static getOrCreateInstance(){return null===tR&&(tR=new ci),tR}onExistenceFilterMismatch(e){let t=Symbol();return this.onExistenceFilterMismatchCallbacks.set(t,e),()=>this.onExistenceFilterMismatchCallbacks.delete(t)}notifyOnExistenceFilterMismatch(e){this.onExistenceFilterMismatchCallbacks.forEach(t=>t(e))}};let tR=null,tN=new t_([4294967295,4294967295],0);function fi(e){let t=(new TextEncoder).encode(e),l=new tg;return l.update(t),new Uint8Array(l.digest())}function di(e){let t=new DataView(e.buffer),l=t.getUint32(0,!0),u=t.getUint32(4,!0),h=t.getUint32(8,!0),d=t.getUint32(12,!0);return[new t_([l,u],0),new t_([h,d],0)]}let wi=class wi{constructor(e,t,l){if(this.bitmap=e,this.padding=t,this.hashCount=l,t<0||t>=8)throw new _i(`Invalid padding: ${t}`);if(l<0||e.length>0&&0===this.hashCount)throw new _i(`Invalid hash count: ${l}`);if(0===e.length&&0!==t)throw new _i(`Invalid padding when bitmap length is 0: ${t}`);this.It=8*e.length-t,this.Tt=t_.fromNumber(this.It)}Et(e,t,l){let u=e.add(t.multiply(t_.fromNumber(l)));return 1===u.compare(tN)&&(u=new t_([u.getBits(0),u.getBits(1)],0)),u.modulo(this.Tt).toNumber()}At(e){return 0!=(this.bitmap[Math.floor(e/8)]&1<<e%8)}vt(e){if(0===this.It)return!1;let t=fi(e),[l,u]=di(t);for(let e=0;e<this.hashCount;e++){let t=this.Et(l,u,e);if(!this.At(t))return!1}return!0}static create(e,t,l){let u=new Uint8Array(Math.ceil(e/8)),h=new wi(u,e%8==0?0:8-e%8,t);return l.forEach(e=>h.insert(e)),h}insert(e){if(0===this.It)return;let t=fi(e),[l,u]=di(t);for(let e=0;e<this.hashCount;e++){let t=this.Et(l,u,e);this.Rt(t)}}Rt(e){this.bitmap[Math.floor(e/8)]|=1<<e%8}};let _i=class _i extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let mi=class mi{constructor(e,t,l,u,h){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=l,this.documentUpdates=u,this.resolvedLimboDocuments=h}static createSynthesizedRemoteEventForCurrentChange(e,t,l){let u=new Map;return u.set(e,gi.createSynthesizedTargetChangeForCurrentChange(e,t,l)),new mi(rt.min(),u,new pe(et),tS,gs())}};let gi=class gi{constructor(e,t,l,u,h){this.resumeToken=e,this.current=t,this.addedDocuments=l,this.modifiedDocuments=u,this.removedDocuments=h}static createSynthesizedTargetChangeForCurrentChange(e,t,l){return new gi(l,t,gs(),gs(),gs())}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let yi=class yi{constructor(e,t,l,u){this.Pt=e,this.removedTargetIds=t,this.key=l,this.bt=u}};let pi=class pi{constructor(e,t){this.targetId=e,this.Vt=t}};let Ii=class Ii{constructor(e,t,l=Ve.EMPTY_BYTE_STRING,u=null){this.state=e,this.targetIds=t,this.resumeToken=l,this.cause=u}};let Ti=class Ti{constructor(){this.St=0,this.Dt=vi(),this.Ct=Ve.EMPTY_BYTE_STRING,this.xt=!1,this.Nt=!0}get current(){return this.xt}get resumeToken(){return this.Ct}get kt(){return 0!==this.St}get Mt(){return this.Nt}$t(e){e.approximateByteSize()>0&&(this.Nt=!0,this.Ct=e)}Ot(){let e=gs(),t=gs(),l=gs();return this.Dt.forEach((u,h)=>{switch(h){case 0:e=e.add(u);break;case 2:t=t.add(u);break;case 1:l=l.add(u);break;default:index_esm2017_O()}}),new gi(this.Ct,this.xt,e,t,l)}Ft(){this.Nt=!1,this.Dt=vi()}Bt(e,t){this.Nt=!0,this.Dt=this.Dt.insert(e,t)}Lt(e){this.Nt=!0,this.Dt=this.Dt.remove(e)}qt(){this.St+=1}Ut(){this.St-=1}Kt(){this.Nt=!0,this.xt=!0}};let Ei=class Ei{constructor(e){this.Gt=e,this.Qt=new Map,this.jt=tS,this.zt=Ai(),this.Wt=new pe(et)}Ht(e){for(let t of e.Pt)e.bt&&e.bt.isFoundDocument()?this.Jt(t,e.bt):this.Yt(t,e.key,e.bt);for(let t of e.removedTargetIds)this.Yt(t,e.key,e.bt)}Xt(e){this.forEachTarget(e,t=>{let l=this.Zt(t);switch(e.state){case 0:this.te(t)&&l.$t(e.resumeToken);break;case 1:l.Ut(),l.kt||l.Ft(),l.$t(e.resumeToken);break;case 2:l.Ut(),l.kt||this.removeTarget(t);break;case 3:this.te(t)&&(l.Kt(),l.$t(e.resumeToken));break;case 4:this.te(t)&&(this.ee(t),l.$t(e.resumeToken));break;default:index_esm2017_O()}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Qt.forEach((e,l)=>{this.te(l)&&t(l)})}ne(e){var t;let l=e.targetId,u=e.Vt.count,h=this.se(l);if(h){let d=h.target;if(Fn(d)){if(0===u){let e=new ht(d.path);this.Yt(l,e,an.newNoDocument(e,rt.min()))}else 1===u||index_esm2017_O()}else{let h=this.ie(l);if(h!==u){let u=this.re(e,h);if(0!==u){this.ee(l);let e=2===u?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Wt=this.Wt.insert(l,e)}null===(t=ci.instance)||void 0===t||t.notifyOnExistenceFilterMismatch(function(e,t,l){var u,h,d,f,m,g;let _={localCacheCount:t,existenceFilterCount:l.count},b=l.unchangedNames;return b&&(_.bloomFilter={applied:0===e,hashCount:null!==(u=null==b?void 0:b.hashCount)&&void 0!==u?u:0,bitmapLength:null!==(f=null===(d=null===(h=null==b?void 0:b.bits)||void 0===h?void 0:h.bitmap)||void 0===d?void 0:d.length)&&void 0!==f?f:0,padding:null!==(g=null===(m=null==b?void 0:b.bits)||void 0===m?void 0:m.padding)&&void 0!==g?g:0}),_}(u,h,e.Vt))}}}}re(e,t){let l,u;let{unchangedNames:h,count:d}=e.Vt;if(!h||!h.bits)return 1;let{bits:{bitmap:f="",padding:m=0},hashCount:g=0}=h;try{l=xe(f).toUint8Array()}catch(e){if(e instanceof Pe)return index_esm2017_M("Decoding the base64 bloom filter in existence filter failed ("+e.message+"); ignoring the bloom filter and falling back to full re-query."),1;throw e}try{u=new wi(l,m,g)}catch(e){return index_esm2017_M(e instanceof _i?"BloomFilter error: ":"Applying bloom filter failed: ",e),1}return 0===u.It?1:d!==t-this.oe(e.targetId,u)?2:0}oe(e,t){let l=this.Gt.getRemoteKeysForTarget(e),u=0;return l.forEach(l=>{let h=this.Gt.ue(),d=`projects/${h.projectId}/databases/${h.database}/documents/${l.path.canonicalString()}`;t.vt(d)||(this.Yt(e,l,null),u++)}),u}ce(e){let t=new Map;this.Qt.forEach((l,u)=>{let h=this.se(u);if(h){if(l.current&&Fn(h.target)){let t=new ht(h.target.path);null!==this.jt.get(t)||this.ae(u,t)||this.Yt(u,t,an.newNoDocument(t,e))}l.Mt&&(t.set(u,l.Ot()),l.Ft())}});let l=gs();this.zt.forEach((e,t)=>{let u=!0;t.forEachWhile(e=>{let t=this.se(e);return!t||"TargetPurposeLimboResolution"===t.purpose||(u=!1,!1)}),u&&(l=l.add(e))}),this.jt.forEach((t,l)=>l.setReadTime(e));let u=new mi(e,t,this.Wt,this.jt,l);return this.jt=tS,this.zt=Ai(),this.Wt=new pe(et),u}Jt(e,t){if(!this.te(e))return;let l=this.ae(e,t.key)?2:0;this.Zt(e).Bt(t.key,l),this.jt=this.jt.insert(t.key,t),this.zt=this.zt.insert(t.key,this.he(t.key).add(e))}Yt(e,t,l){if(!this.te(e))return;let u=this.Zt(e);this.ae(e,t)?u.Bt(t,1):u.Lt(t),this.zt=this.zt.insert(t,this.he(t).delete(e)),l&&(this.jt=this.jt.insert(t,l))}removeTarget(e){this.Qt.delete(e)}ie(e){let t=this.Zt(e).Ot();return this.Gt.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}qt(e){this.Zt(e).qt()}Zt(e){let t=this.Qt.get(e);return t||(t=new Ti,this.Qt.set(e,t)),t}he(e){let t=this.zt.get(e);return t||(t=new Ee(et),this.zt=this.zt.insert(e,t)),t}te(e){let t=null!==this.se(e);return t||index_esm2017_N("WatchChangeAggregator","Detected inactive target",e),t}se(e){let t=this.Qt.get(e);return t&&t.kt?null:this.Gt.le(e)}ee(e){this.Qt.set(e,new Ti),this.Gt.getRemoteKeysForTarget(e).forEach(t=>{this.Yt(e,t,null)})}ae(e,t){return this.Gt.getRemoteKeysForTarget(e).has(t)}};function Ai(){return new pe(ht.comparator)}function vi(){return new pe(ht.comparator)}let tO={asc:"ASCENDING",desc:"DESCENDING"},tD={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},tP={and:"AND",or:"OR"};let Vi=class Vi{constructor(e,t){this.databaseId=e,this.useProto3Json=t}};function Si(e,t){return e.useProto3Json||null==t?t:{value:t}}function Di(e,t){return e.useProto3Json?`${new Date(1e3*t.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+t.nanoseconds).slice(-9)}Z`:{seconds:""+t.seconds,nanos:t.nanoseconds}}function Ci(e,t){return e.useProto3Json?t.toBase64():t.toUint8Array()}function Ni(e){return e||index_esm2017_O(),rt.fromTimestamp(function(e){let t=De(e);return new it(t.seconds,t.nanos)}(e))}function ki(e,t){return new ut(["projects",e.projectId,"databases",e.database]).child("documents").child(t).canonicalString()}function Mi(e){let t=ut.fromString(e);return ur(t)||index_esm2017_O(),t}function $i(e,t){return ki(e.databaseId,t.path)}function Oi(e,t){let l=Mi(t);if(l.get(1)!==e.databaseId.projectId)throw new index_esm2017_U(tb.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+l.get(1)+" vs "+e.databaseId.projectId);if(l.get(3)!==e.databaseId.database)throw new index_esm2017_U(tb.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+l.get(3)+" vs "+e.databaseId.database);return new ht(qi(l))}function Fi(e,t){return ki(e.databaseId,t)}function Li(e){return new ut(["projects",e.databaseId.projectId,"databases",e.databaseId.database]).canonicalString()}function qi(e){return e.length>4&&"documents"===e.get(4)||index_esm2017_O(),e.popFirst(5)}function Ui(e,t,l){return{name:$i(e,t),fields:l.value.mapValue.fields}}function sr(e){return{fieldPath:e.canonicalString()}}function ir(e){return at.fromServerFormat(e.fieldPath)}function ur(e){return e.length>=4&&"projects"===e.get(0)&&"databases"===e.get(2)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let cr=class cr{constructor(e,t,l,u,h=rt.min(),d=rt.min(),f=Ve.EMPTY_BYTE_STRING,m=null){this.target=e,this.targetId=t,this.purpose=l,this.sequenceNumber=u,this.snapshotVersion=h,this.lastLimboFreeSnapshotVersion=d,this.resumeToken=f,this.expectedCount=m}withSequenceNumber(e){return new cr(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new cr(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new cr(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new cr(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ar=class ar{constructor(e){this.fe=e}};/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let br=class br{constructor(){}_e(e,t){this.me(e,t),t.ge()}me(e,t){if("nullValue"in e)this.ye(t,5);else if("booleanValue"in e)this.ye(t,10),t.pe(e.booleanValue?1:0);else if("integerValue"in e)this.ye(t,15),t.pe(Ce(e.integerValue));else if("doubleValue"in e){let l=Ce(e.doubleValue);isNaN(l)?this.ye(t,13):(this.ye(t,15),Bt(l)?t.pe(0):t.pe(l))}else if("timestampValue"in e){let l=e.timestampValue;this.ye(t,20),"string"==typeof l?t.Ie(l):(t.Ie(`${l.seconds||""}`),t.pe(l.nanos||0))}else if("stringValue"in e)this.Te(e.stringValue,t),this.Ee(t);else if("bytesValue"in e)this.ye(t,30),t.Ae(xe(e.bytesValue)),this.Ee(t);else if("referenceValue"in e)this.ve(e.referenceValue,t);else if("geoPointValue"in e){let l=e.geoPointValue;this.ye(t,45),t.pe(l.latitude||0),t.pe(l.longitude||0)}else"mapValue"in e?en(e)?this.ye(t,Number.MAX_SAFE_INTEGER):(this.Re(e.mapValue,t),this.Ee(t)):"arrayValue"in e?(this.Pe(e.arrayValue,t),this.Ee(t)):index_esm2017_O()}Te(e,t){this.ye(t,25),this.be(e,t)}be(e,t){t.Ie(e)}Re(e,t){let l=e.fields||{};for(let e of(this.ye(t,55),Object.keys(l)))this.Te(e,t),this.me(l[e],t)}Pe(e,t){let l=e.values||[];for(let e of(this.ye(t,50),l))this.me(e,t)}ve(e,t){this.ye(t,37),ht.fromName(e).path.forEach(e=>{this.ye(t,60),this.be(e,t)})}ye(e,t){e.pe(t)}Ee(e){e.pe(2)}};br.Ve=new br;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let zr=class zr{constructor(){this.rn=new Wr}addToCollectionParentIndex(e,t){return this.rn.add(t),Rt.resolve()}getCollectionParents(e,t){return Rt.resolve(this.rn.getEntries(t))}addFieldIndex(e,t){return Rt.resolve()}deleteFieldIndex(e,t){return Rt.resolve()}getDocumentsMatchingTarget(e,t){return Rt.resolve(null)}getIndexType(e,t){return Rt.resolve(0)}getFieldIndexes(e,t){return Rt.resolve([])}getNextCollectionGroupToUpdate(e){return Rt.resolve(null)}getMinOffset(e,t){return Rt.resolve(It.min())}getMinOffsetFromCollectionGroup(e,t){return Rt.resolve(It.min())}updateCollectionGroup(e,t,l){return Rt.resolve()}updateIndexEntries(e,t){return Rt.resolve()}};let Wr=class Wr{constructor(){this.index={}}add(e){let t=e.lastSegment(),l=e.popLast(),u=this.index[t]||new Ee(ut.comparator),h=!u.has(l);return this.index[t]=u.add(l),h}has(e){let t=e.lastSegment(),l=e.popLast(),u=this.index[t];return u&&u.has(l)}getEntries(e){return(this.index[e]||new Ee(ut.comparator)).toArray()}};new Uint8Array(0);let so=class so{constructor(e,t,l){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=l}static withCacheSize(e){return new so(e,so.DEFAULT_COLLECTION_PERCENTILE,so.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */so.DEFAULT_COLLECTION_PERCENTILE=10,so.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,so.DEFAULT=new so(41943040,so.DEFAULT_COLLECTION_PERCENTILE,so.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),so.DISABLED=new so(-1,0,0);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let lo=class lo{constructor(e){this.Nn=e}next(){return this.Nn+=2,this.Nn}static kn(){return new lo(0)}static Mn(){return new lo(-1)}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let vo=class vo{constructor(){this.changes=new os(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,an.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();let l=this.changes.get(t);return void 0!==l?Rt.resolve(l):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let No=class No{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ko=class ko{constructor(e,t,l,u){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=l,this.indexManager=u}getDocument(e,t){let l=null;return this.documentOverlayCache.getOverlay(e,t).next(u=>(l=u,this.remoteDocumentCache.getEntry(e,t))).next(e=>(null!==l&&Ks(l.mutation,e,Re.empty(),it.now()),e))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(t=>this.getLocalViewOfDocuments(e,t,gs()).next(()=>t))}getLocalViewOfDocuments(e,t,l=gs()){let u=ws();return this.populateOverlays(e,u,t).next(()=>this.computeViews(e,t,u,l).next(e=>{let t=hs();return e.forEach((e,l)=>{t=t.insert(e,l.overlayedDocument)}),t}))}getOverlayedDocuments(e,t){let l=ws();return this.populateOverlays(e,l,t).next(()=>this.computeViews(e,t,l,gs()))}populateOverlays(e,t,l){let u=[];return l.forEach(e=>{t.has(e)||u.push(e)}),this.documentOverlayCache.getOverlays(e,u).next(e=>{e.forEach((e,l)=>{t.set(e,l)})})}computeViews(e,t,l,u){let h=tS,d=ws(),f=ws();return t.forEach((e,t)=>{let f=l.get(t.key);u.has(t.key)&&(void 0===f||f.mutation instanceof zs)?h=h.insert(t.key,t):void 0!==f?(d.set(t.key,f.mutation.getFieldMask()),Ks(f.mutation,t,f.mutation.getFieldMask(),it.now())):d.set(t.key,Re.empty())}),this.recalculateAndSaveOverlays(e,h).next(e=>(e.forEach((e,t)=>d.set(e,t)),t.forEach((e,t)=>{var l;return f.set(e,new No(t,null!==(l=d.get(e))&&void 0!==l?l:null))}),f))}recalculateAndSaveOverlays(e,t){let l=ws(),u=new pe((e,t)=>e-t),h=gs();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(e=>{for(let h of e)h.keys().forEach(e=>{let d=t.get(e);if(null===d)return;let f=l.get(e)||Re.empty();f=h.applyToLocalView(d,f),l.set(e,f);let m=(u.get(h.batchId)||gs()).add(e);u=u.insert(h.batchId,m)})}).next(()=>{let d=[],f=u.getReverseIterator();for(;f.hasNext();){let u=f.getNext(),m=u.key,g=u.value,_=ws();g.forEach(e=>{if(!h.has(e)){let u=qs(t.get(e),l.get(e));null!==u&&_.set(e,u),h=h.add(e)}}),d.push(this.documentOverlayCache.saveOverlays(e,m,_))}return Rt.waitFor(d)}).next(()=>l)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(t=>this.recalculateAndSaveOverlays(e,t))}getDocumentsMatchingQuery(e,t,l){return ht.isDocumentKey(t.path)&&null===t.collectionGroup&&0===t.filters.length?this.getDocumentsMatchingDocumentQuery(e,t.path):Wn(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,l):this.getDocumentsMatchingCollectionQuery(e,t,l)}getNextDocuments(e,t,l,u){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,l,u).next(h=>{let d=u-h.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,l.largestBatchId,u-h.size):Rt.resolve(ws()),f=-1,m=h;return d.next(t=>Rt.forEach(t,(t,l)=>(f<l.largestBatchId&&(f=l.largestBatchId),h.get(t)?Rt.resolve():this.remoteDocumentCache.getEntry(e,t).next(e=>{m=m.insert(t,e)}))).next(()=>this.populateOverlays(e,t,h)).next(()=>this.computeViews(e,m,t,gs())).next(e=>({batchId:f,changes:ls(e)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new ht(t)).next(e=>{let t=hs();return e.isFoundDocument()&&(t=t.insert(e.key,e)),t})}getDocumentsMatchingCollectionGroupQuery(e,t,l){let u=t.collectionGroup,h=hs();return this.indexManager.getCollectionParents(e,u).next(d=>Rt.forEach(d,d=>{var f;let m=(f=d.child(u),new Un(f,null,t.explicitOrderBy.slice(),t.filters.slice(),t.limit,t.limitType,t.startAt,t.endAt));return this.getDocumentsMatchingCollectionQuery(e,m,l).next(e=>{e.forEach((e,t)=>{h=h.insert(e,t)})})}).next(()=>h))}getDocumentsMatchingCollectionQuery(e,t,l){let u;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,l.largestBatchId).next(h=>(u=h,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,l,u))).next(e=>{u.forEach((t,l)=>{let u=l.getKey();null===e.get(u)&&(e=e.insert(u,an.newInvalidDocument(u)))});let l=hs();return e.forEach((e,h)=>{let d=u.get(e);void 0!==d&&Ks(d.mutation,h,Re.empty(),it.now()),ns(t,h)&&(l=l.insert(e,h))}),l})}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Mo=class Mo{constructor(e){this.serializer=e,this.cs=new Map,this.hs=new Map}getBundleMetadata(e,t){return Rt.resolve(this.cs.get(t))}saveBundleMetadata(e,t){return this.cs.set(t.id,{id:t.id,version:t.version,createTime:Ni(t.createTime)}),Rt.resolve()}getNamedQuery(e,t){return Rt.resolve(this.hs.get(t))}saveNamedQuery(e,t){return this.hs.set(t.name,{name:t.name,query:function(e){let t=function(e){var t,l,u,h,d,f,m,g;let _,b=function(e){let t=Mi(e);return 4===t.length?ut.emptyPath():qi(t)}(e.parent),E=e.structuredQuery,k=E.from?E.from.length:0,L=null;if(k>0){1===k||index_esm2017_O();let e=E.from[0];e.allDescendants?L=e.collectionId:b=b.child(e.collectionId)}let V=[];E.where&&(V=function(e){var t;let l=function Zi(e){return void 0!==e.unaryFilter?function(e){switch(e.unaryFilter.op){case"IS_NAN":let t=ir(e.unaryFilter.field);return mn.create(t,"==",{doubleValue:NaN});case"IS_NULL":let l=ir(e.unaryFilter.field);return mn.create(l,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":let u=ir(e.unaryFilter.field);return mn.create(u,"!=",{doubleValue:NaN});case"IS_NOT_NULL":let h=ir(e.unaryFilter.field);return mn.create(h,"!=",{nullValue:"NULL_VALUE"});default:return index_esm2017_O()}}(e):void 0!==e.fieldFilter?mn.create(ir(e.fieldFilter.field),function(e){switch(e){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return index_esm2017_O()}}(e.fieldFilter.op),e.fieldFilter.value):void 0!==e.compositeFilter?gn.create(e.compositeFilter.filters.map(e=>Zi(e)),function(e){switch(e){case"AND":return"and";case"OR":return"or";default:return index_esm2017_O()}}(e.compositeFilter.op)):index_esm2017_O()}(e);return l instanceof gn&&Tn(t=l)&&yn(t)?l.getFilters():[l]}(E.where));let z=[];E.orderBy&&(z=E.orderBy.map(e=>new dn(ir(e.field),function(e){switch(e){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(e.direction))));let ee=null;E.limit&&(ee=null==(_="object"==typeof(t=E.limit)?t.value:t)?null:_);let er=null;E.startAt&&(er=function(e){let t=!!e.before,l=e.values||[];return new hn(l,t)}(E.startAt));let eo=null;return E.endAt&&(eo=function(e){let t=!e.before,l=e.values||[];return new hn(l,t)}(E.endAt)),l=b,u=L,h=z,d=V,f=ee,m=er,g=eo,new Un(l,u,h,d,f,"F",m,g)}({parent:e.parent,structuredQuery:e.structuredQuery});return"LAST"===e.limitType?Xn(t,t.limit,"L"):t}(t.bundledQuery),readTime:Ni(t.readTime)}),Rt.resolve()}};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let $o=class $o{constructor(){this.overlays=new pe(ht.comparator),this.ls=new Map}getOverlay(e,t){return Rt.resolve(this.overlays.get(t))}getOverlays(e,t){let l=ws();return Rt.forEach(t,t=>this.getOverlay(e,t).next(e=>{null!==e&&l.set(t,e)})).next(()=>l)}saveOverlays(e,t,l){return l.forEach((l,u)=>{this.we(e,t,u)}),Rt.resolve()}removeOverlaysForBatchId(e,t,l){let u=this.ls.get(l);return void 0!==u&&(u.forEach(e=>this.overlays=this.overlays.remove(e)),this.ls.delete(l)),Rt.resolve()}getOverlaysForCollection(e,t,l){let u=ws(),h=t.length+1,d=new ht(t.child("")),f=this.overlays.getIteratorFrom(d);for(;f.hasNext();){let e=f.getNext().value,d=e.getKey();if(!t.isPrefixOf(d.path))break;d.path.length===h&&e.largestBatchId>l&&u.set(e.getKey(),e)}return Rt.resolve(u)}getOverlaysForCollectionGroup(e,t,l,u){let h=new pe((e,t)=>e-t),d=this.overlays.getIterator();for(;d.hasNext();){let e=d.getNext().value;if(e.getKey().getCollectionGroup()===t&&e.largestBatchId>l){let t=h.get(e.largestBatchId);null===t&&(t=ws(),h=h.insert(e.largestBatchId,t)),t.set(e.getKey(),e)}}let f=ws(),m=h.getIterator();for(;m.hasNext()&&(m.getNext().value.forEach((e,t)=>f.set(e,t)),!(f.size()>=u)););return Rt.resolve(f)}we(e,t,l){let u=this.overlays.get(l.key);if(null!==u){let e=this.ls.get(u.largestBatchId).delete(l.key);this.ls.set(u.largestBatchId,e)}this.overlays=this.overlays.insert(l.key,new ei(t,l));let h=this.ls.get(t);void 0===h&&(h=gs(),this.ls.set(t,h)),this.ls.set(t,h.add(l.key))}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Oo=class Oo{constructor(){this.fs=new Ee(Fo.ds),this.ws=new Ee(Fo._s)}isEmpty(){return this.fs.isEmpty()}addReference(e,t){let l=new Fo(e,t);this.fs=this.fs.add(l),this.ws=this.ws.add(l)}gs(e,t){e.forEach(e=>this.addReference(e,t))}removeReference(e,t){this.ys(new Fo(e,t))}ps(e,t){e.forEach(e=>this.removeReference(e,t))}Is(e){let t=new ht(new ut([])),l=new Fo(t,e),u=new Fo(t,e+1),h=[];return this.ws.forEachInRange([l,u],e=>{this.ys(e),h.push(e.key)}),h}Ts(){this.fs.forEach(e=>this.ys(e))}ys(e){this.fs=this.fs.delete(e),this.ws=this.ws.delete(e)}Es(e){let t=new ht(new ut([])),l=new Fo(t,e),u=new Fo(t,e+1),h=gs();return this.ws.forEachInRange([l,u],e=>{h=h.add(e.key)}),h}containsKey(e){let t=new Fo(e,0),l=this.fs.firstAfterOrEqual(t);return null!==l&&e.isEqual(l.key)}};let Fo=class Fo{constructor(e,t){this.key=e,this.As=t}static ds(e,t){return ht.comparator(e.key,t.key)||et(e.As,t.As)}static _s(e,t){return et(e.As,t.As)||ht.comparator(e.key,t.key)}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Bo=class Bo{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.vs=1,this.Rs=new Ee(Fo.ds)}checkEmpty(e){return Rt.resolve(0===this.mutationQueue.length)}addMutationBatch(e,t,l,u){let h=this.vs;this.vs++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];let d=new Zs(h,t,l,u);for(let t of(this.mutationQueue.push(d),u))this.Rs=this.Rs.add(new Fo(t.key,h)),this.indexManager.addToCollectionParentIndex(e,t.key.path.popLast());return Rt.resolve(d)}lookupMutationBatch(e,t){return Rt.resolve(this.Ps(t))}getNextMutationBatchAfterBatchId(e,t){let l=this.bs(t+1),u=l<0?0:l;return Rt.resolve(this.mutationQueue.length>u?this.mutationQueue[u]:null)}getHighestUnacknowledgedBatchId(){return Rt.resolve(0===this.mutationQueue.length?-1:this.vs-1)}getAllMutationBatches(e){return Rt.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){let l=new Fo(t,0),u=new Fo(t,Number.POSITIVE_INFINITY),h=[];return this.Rs.forEachInRange([l,u],e=>{let t=this.Ps(e.As);h.push(t)}),Rt.resolve(h)}getAllMutationBatchesAffectingDocumentKeys(e,t){let l=new Ee(et);return t.forEach(e=>{let t=new Fo(e,0),u=new Fo(e,Number.POSITIVE_INFINITY);this.Rs.forEachInRange([t,u],e=>{l=l.add(e.As)})}),Rt.resolve(this.Vs(l))}getAllMutationBatchesAffectingQuery(e,t){let l=t.path,u=l.length+1,h=l;ht.isDocumentKey(h)||(h=h.child(""));let d=new Fo(new ht(h),0),f=new Ee(et);return this.Rs.forEachWhile(e=>{let t=e.key.path;return!!l.isPrefixOf(t)&&(t.length===u&&(f=f.add(e.As)),!0)},d),Rt.resolve(this.Vs(f))}Vs(e){let t=[];return e.forEach(e=>{let l=this.Ps(e);null!==l&&t.push(l)}),t}removeMutationBatch(e,t){0===this.Ss(t.batchId,"removed")||index_esm2017_O(),this.mutationQueue.shift();let l=this.Rs;return Rt.forEach(t.mutations,u=>{let h=new Fo(u.key,t.batchId);return l=l.delete(h),this.referenceDelegate.markPotentiallyOrphaned(e,u.key)}).next(()=>{this.Rs=l})}Cn(e){}containsKey(e,t){let l=new Fo(t,0),u=this.Rs.firstAfterOrEqual(l);return Rt.resolve(t.isEqual(u&&u.key))}performConsistencyCheck(e){return this.mutationQueue.length,Rt.resolve()}Ss(e,t){return this.bs(e)}bs(e){return 0===this.mutationQueue.length?0:e-this.mutationQueue[0].batchId}Ps(e){let t=this.bs(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Lo=class Lo{constructor(e){this.Ds=e,this.docs=new pe(ht.comparator),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){let l=t.key,u=this.docs.get(l),h=u?u.size:0,d=this.Ds(t);return this.docs=this.docs.insert(l,{document:t.mutableCopy(),size:d}),this.size+=d-h,this.indexManager.addToCollectionParentIndex(e,l.path.popLast())}removeEntry(e){let t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){let l=this.docs.get(t);return Rt.resolve(l?l.document.mutableCopy():an.newInvalidDocument(t))}getEntries(e,t){let l=tS;return t.forEach(e=>{let t=this.docs.get(e);l=l.insert(e,t?t.document.mutableCopy():an.newInvalidDocument(e))}),Rt.resolve(l)}getDocumentsMatchingQuery(e,t,l,u){let h=tS,d=t.path,f=new ht(d.child("")),m=this.docs.getIteratorFrom(f);for(;m.hasNext();){let{key:e,value:{document:f}}=m.getNext();if(!d.isPrefixOf(e.path))break;e.path.length>d.length+1||0>=function(e,t){let l=e.readTime.compareTo(t.readTime);return 0!==l?l:0!==(l=ht.comparator(e.documentKey,t.documentKey))?l:et(e.largestBatchId,t.largestBatchId)}(new It(f.readTime,f.key,-1),l)||(u.has(f.key)||ns(t,f))&&(h=h.insert(f.key,f.mutableCopy()))}return Rt.resolve(h)}getAllFromCollectionGroup(e,t,l,u){index_esm2017_O()}Cs(e,t){return Rt.forEach(this.docs,e=>t(e))}newChangeBuffer(e){return new qo(this)}getSize(e){return Rt.resolve(this.size)}};let qo=class qo extends vo{constructor(e){super(),this.os=e}applyChanges(e){let t=[];return this.changes.forEach((l,u)=>{u.isValidDocument()?t.push(this.os.addEntry(e,u)):this.os.removeEntry(l)}),Rt.waitFor(t)}getFromCache(e,t){return this.os.getEntry(e,t)}getAllFromCache(e,t){return this.os.getEntries(e,t)}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Uo=class Uo{constructor(e){this.persistence=e,this.xs=new os(e=>$n(e),On),this.lastRemoteSnapshotVersion=rt.min(),this.highestTargetId=0,this.Ns=0,this.ks=new Oo,this.targetCount=0,this.Ms=lo.kn()}forEachTarget(e,t){return this.xs.forEach((e,l)=>t(l)),Rt.resolve()}getLastRemoteSnapshotVersion(e){return Rt.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return Rt.resolve(this.Ns)}allocateTargetId(e){return this.highestTargetId=this.Ms.next(),Rt.resolve(this.highestTargetId)}setTargetsMetadata(e,t,l){return l&&(this.lastRemoteSnapshotVersion=l),t>this.Ns&&(this.Ns=t),Rt.resolve()}Fn(e){this.xs.set(e.target,e);let t=e.targetId;t>this.highestTargetId&&(this.Ms=new lo(t),this.highestTargetId=t),e.sequenceNumber>this.Ns&&(this.Ns=e.sequenceNumber)}addTargetData(e,t){return this.Fn(t),this.targetCount+=1,Rt.resolve()}updateTargetData(e,t){return this.Fn(t),Rt.resolve()}removeTargetData(e,t){return this.xs.delete(t.target),this.ks.Is(t.targetId),this.targetCount-=1,Rt.resolve()}removeTargets(e,t,l){let u=0,h=[];return this.xs.forEach((d,f)=>{f.sequenceNumber<=t&&null===l.get(f.targetId)&&(this.xs.delete(d),h.push(this.removeMatchingKeysForTargetId(e,f.targetId)),u++)}),Rt.waitFor(h).next(()=>u)}getTargetCount(e){return Rt.resolve(this.targetCount)}getTargetData(e,t){let l=this.xs.get(t)||null;return Rt.resolve(l)}addMatchingKeys(e,t,l){return this.ks.gs(t,l),Rt.resolve()}removeMatchingKeys(e,t,l){this.ks.ps(t,l);let u=this.persistence.referenceDelegate,h=[];return u&&t.forEach(t=>{h.push(u.markPotentiallyOrphaned(e,t))}),Rt.waitFor(h)}removeMatchingKeysForTargetId(e,t){return this.ks.Is(t),Rt.resolve()}getMatchingKeysForTargetId(e,t){let l=this.ks.Es(t);return Rt.resolve(l)}containsKey(e,t){return Rt.resolve(this.ks.containsKey(t))}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ko=class Ko{constructor(e,t){this.$s={},this.overlays={},this.Os=new Ot(0),this.Fs=!1,this.Fs=!0,this.referenceDelegate=e(this),this.Bs=new Uo(this),this.indexManager=new zr,this.remoteDocumentCache=new Lo(e=>this.referenceDelegate.Ls(e)),this.serializer=new ar(t),this.qs=new Mo(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Fs=!1,Promise.resolve()}get started(){return this.Fs}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new $o,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let l=this.$s[e.toKey()];return l||(l=new Bo(t,this.referenceDelegate),this.$s[e.toKey()]=l),l}getTargetCache(){return this.Bs}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.qs}runTransaction(e,t,l){index_esm2017_N("MemoryPersistence","Starting transaction:",e);let u=new Go(this.Os.next());return this.referenceDelegate.Us(),l(u).next(e=>this.referenceDelegate.Ks(u).next(()=>e)).toPromise().then(e=>(u.raiseOnCommittedEvent(),e))}Gs(e,t){return Rt.or(Object.values(this.$s).map(l=>()=>l.containsKey(e,t)))}};let Go=class Go extends At{constructor(e){super(),this.currentSequenceNumber=e}};let Qo=class Qo{constructor(e){this.persistence=e,this.Qs=new Oo,this.js=null}static zs(e){return new Qo(e)}get Ws(){if(this.js)return this.js;throw index_esm2017_O()}addReference(e,t,l){return this.Qs.addReference(l,t),this.Ws.delete(l.toString()),Rt.resolve()}removeReference(e,t,l){return this.Qs.removeReference(l,t),this.Ws.add(l.toString()),Rt.resolve()}markPotentiallyOrphaned(e,t){return this.Ws.add(t.toString()),Rt.resolve()}removeTarget(e,t){this.Qs.Is(t.targetId).forEach(e=>this.Ws.add(e.toString()));let l=this.persistence.getTargetCache();return l.getMatchingKeysForTargetId(e,t.targetId).next(e=>{e.forEach(e=>this.Ws.add(e.toString()))}).next(()=>l.removeTargetData(e,t))}Us(){this.js=new Set}Ks(e){let t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return Rt.forEach(this.Ws,l=>{let u=ht.fromPath(l);return this.Hs(e,u).next(e=>{e||t.removeEntry(u,rt.min())})}).next(()=>(this.js=null,t.apply(e)))}updateLimboDocument(e,t){return this.Hs(e,t).next(e=>{e?this.Ws.delete(t.toString()):this.Ws.add(t.toString())})}Ls(e){return 0}Hs(e,t){return Rt.or([()=>Rt.resolve(this.Qs.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Gs(e,t)])}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let tu=class tu{constructor(e,t,l,u){this.targetId=e,this.fromCache=t,this.Fi=l,this.Bi=u}static Li(e,t){let l=gs(),u=gs();for(let e of t.docChanges)switch(e.type){case 0:l=l.add(e.doc.key);break;case 1:u=u.add(e.doc.key)}return new tu(e,t.fromCache,l,u)}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let eu=class eu{constructor(){this.qi=!1}initialize(e,t){this.Ui=e,this.indexManager=t,this.qi=!0}getDocumentsMatchingQuery(e,t,l,u){return this.Ki(e,t).next(h=>h||this.Gi(e,t,u,l)).next(l=>l||this.Qi(e,t))}Ki(e,t){if(Qn(t))return Rt.resolve(null);let l=Jn(t);return this.indexManager.getIndexType(e,l).next(u=>0===u?null:(null!==t.limit&&1===u&&(l=Jn(t=Xn(t,null,"F"))),this.indexManager.getDocumentsMatchingTarget(e,l).next(u=>{let h=gs(...u);return this.Ui.getDocuments(e,h).next(u=>this.indexManager.getMinOffset(e,l).next(l=>{let d=this.ji(t,u);return this.zi(t,d,h,l.readTime)?this.Ki(e,Xn(t,null,"F")):this.Wi(e,d,t,l)}))})))}Gi(e,t,l,u){return Qn(t)||u.isEqual(rt.min())?this.Qi(e,t):this.Ui.getDocuments(e,l).next(h=>{let d=this.ji(t,h);return this.zi(t,d,l,u)?this.Qi(e,t):(index_esm2017_C()<=k.in.DEBUG&&index_esm2017_N("QueryEngine","Re-using previous result from %s to execute query: %s",u.toString(),es(t)),this.Wi(e,d,t,function(e,t){let l=e.toTimestamp().seconds,u=e.toTimestamp().nanoseconds+1,h=rt.fromTimestamp(1e9===u?new it(l+1,0):new it(l,u));return new It(h,ht.empty(),-1)}(u,0)))})}ji(e,t){let l=new Ee(is(e));return t.forEach((t,u)=>{ns(e,u)&&(l=l.add(u))}),l}zi(e,t,l,u){if(null===e.limit)return!1;if(l.size!==t.size)return!0;let h="F"===e.limitType?t.last():t.first();return!!h&&(h.hasPendingWrites||h.version.compareTo(u)>0)}Qi(e,t){return index_esm2017_C()<=k.in.DEBUG&&index_esm2017_N("QueryEngine","Using full collection scan to execute query:",es(t)),this.Ui.getDocumentsMatchingQuery(e,t,It.min())}Wi(e,t,l,u){return this.Ui.getDocumentsMatchingQuery(e,l,u).next(e=>(t.forEach(t=>{e=e.insert(t.key,t)}),e))}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let nu=class nu{constructor(e,t,l,u){this.persistence=e,this.Hi=t,this.serializer=u,this.Ji=new pe(et),this.Yi=new os(e=>$n(e),On),this.Xi=new Map,this.Zi=e.getRemoteDocumentCache(),this.Bs=e.getTargetCache(),this.qs=e.getBundleCache(),this.tr(l)}tr(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new ko(this.Zi,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Zi.setIndexManager(this.indexManager),this.Hi.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.Ji))}};async function iu(e,t){return await e.persistence.runTransaction("Handle user change","readonly",l=>{let u;return e.mutationQueue.getAllMutationBatches(l).next(h=>(u=h,e.tr(t),e.mutationQueue.getAllMutationBatches(l))).next(t=>{let h=[],d=[],f=gs();for(let e of u)for(let t of(h.push(e.batchId),e.mutations))f=f.add(t.key);for(let e of t)for(let t of(d.push(e.batchId),e.mutations))f=f.add(t.key);return e.localDocuments.getDocuments(l,f).next(e=>({er:e,removedBatchIds:h,addedBatchIds:d}))})})}function ou(e){return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.Bs.getLastRemoteSnapshotVersion(t))}async function lu(e,t,l){let u=e.Ji.get(t);try{l||await e.persistence.runTransaction("Release target",l?"readwrite":"readwrite-primary",t=>e.persistence.referenceDelegate.removeTarget(t,u))}catch(e){if(!Dt(e))throw e;index_esm2017_N("LocalStore",`Failed to update sequence numbers for target ${t}: ${e}`)}e.Ji=e.Ji.remove(t),e.Yi.delete(u.target)}function fu(e,t,l){let u=rt.min(),h=gs();return e.persistence.runTransaction("Execute query","readonly",d=>(function(e,t,l){let u=e.Yi.get(l);return void 0!==u?Rt.resolve(e.Ji.get(u)):e.Bs.getTargetData(t,l)})(e,d,Jn(t)).next(t=>{if(t)return u=t.lastLimboFreeSnapshotVersion,e.Bs.getMatchingKeysForTargetId(d,t.targetId).next(e=>{h=e})}).next(()=>e.Hi.getDocumentsMatchingQuery(d,t,l?u:rt.min(),l?h:gs())).next(l=>{var u;let d;return u=t.collectionGroup||(t.path.length%2==1?t.path.lastSegment():t.path.get(t.path.length-2)),d=e.Xi.get(u)||rt.min(),l.forEach((e,t)=>{t.readTime.compareTo(d)>0&&(d=t.readTime)}),e.Xi.set(u,d),{documents:l,ir:h}}))}let Ru=class Ru{constructor(){this.activeTargetIds=tk}lr(e){this.activeTargetIds=this.activeTargetIds.add(e)}dr(e){this.activeTargetIds=this.activeTargetIds.delete(e)}hr(){let e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}};let bu=class bu{constructor(){this.Hr=new Ru,this.Jr={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,l){}addLocalQueryTarget(e){return this.Hr.lr(e),this.Jr[e]||"not-current"}updateQueryState(e,t,l){this.Jr[e]=t}removeLocalQueryTarget(e){this.Hr.dr(e)}isLocalQueryTarget(e){return this.Hr.activeTargetIds.has(e)}clearQueryState(e){delete this.Jr[e]}getAllActiveQueryTargets(){return this.Hr.activeTargetIds}isActiveQueryTarget(e){return this.Hr.activeTargetIds.has(e)}start(){return this.Hr=new Ru,Promise.resolve()}handleUserChange(e,t,l){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Vu=class Vu{Yr(e){}shutdown(){}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Su=class Su{constructor(){this.Xr=()=>this.Zr(),this.eo=()=>this.no(),this.so=[],this.io()}Yr(e){this.so.push(e)}shutdown(){window.removeEventListener("online",this.Xr),window.removeEventListener("offline",this.eo)}io(){window.addEventListener("online",this.Xr),window.addEventListener("offline",this.eo)}Zr(){for(let e of(index_esm2017_N("ConnectivityMonitor","Network connectivity changed: AVAILABLE"),this.so))e(0)}no(){for(let e of(index_esm2017_N("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE"),this.so))e(1)}static D(){return"undefined"!=typeof window&&void 0!==window.addEventListener&&void 0!==window.removeEventListener}};/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let tM=null;function Cu(){return null===tM?tM=268435456+Math.round(2147483648*Math.random()):tM++,"0x"+tM.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let tL={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Nu=class Nu{constructor(e){this.ro=e.ro,this.oo=e.oo}uo(e){this.co=e}ao(e){this.ho=e}onMessage(e){this.lo=e}close(){this.oo()}send(e){this.ro(e)}fo(){this.co()}wo(e){this.ho(e)}_o(e){this.lo(e)}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let tU="WebChannelConnection";let Mu=class Mu extends class{constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;let t=e.ssl?"https":"http";this.mo=t+"://"+e.host,this.yo="projects/"+this.databaseId.projectId+"/databases/"+this.databaseId.database+"/documents"}get po(){return!1}Io(e,t,l,u,h){let d=Cu(),f=this.To(e,t);index_esm2017_N("RestConnection",`Sending RPC '${e}' ${d}:`,f,l);let m={};return this.Eo(m,u,h),this.Ao(e,f,m,l).then(t=>(index_esm2017_N("RestConnection",`Received RPC '${e}' ${d}: `,t),t),t=>{throw index_esm2017_M("RestConnection",`RPC '${e}' ${d} failed with error: `,t,"url: ",f,"request:",l),t})}vo(e,t,l,u,h,d){return this.Io(e,t,l,u,h)}Eo(e,t,l){e["X-Goog-Api-Client"]="gl-js/ fire/"+tv,e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach((t,l)=>e[l]=t),l&&l.headers.forEach((t,l)=>e[l]=t)}To(e,t){let l=tL[e];return`${this.mo}/v1/${t}:${l}`}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}Ao(e,t,l,u){let h=Cu();return new Promise((d,f)=>{let m=new tp;m.setWithCredentials(!0),m.listenOnce(to.COMPLETE,()=>{try{switch(m.getLastErrorCode()){case ta.NO_ERROR:let t=m.getResponseJson();index_esm2017_N(tU,`XHR for RPC '${e}' ${h} received:`,JSON.stringify(t)),d(t);break;case ta.TIMEOUT:index_esm2017_N(tU,`RPC '${e}' ${h} timed out`),f(new index_esm2017_U(tb.DEADLINE_EXCEEDED,"Request time out"));break;case ta.HTTP_ERROR:let l=m.getStatus();if(index_esm2017_N(tU,`RPC '${e}' ${h} failed with status:`,l,"response text:",m.getResponseText()),l>0){let e=m.getResponseJson();Array.isArray(e)&&(e=e[0]);let t=null==e?void 0:e.error;if(t&&t.status&&t.message){let e=function(e){let t=e.toLowerCase().replace(/_/g,"-");return Object.values(tb).indexOf(t)>=0?t:tb.UNKNOWN}(t.status);f(new index_esm2017_U(e,t.message))}else f(new index_esm2017_U(tb.UNKNOWN,"Server responded with status "+m.getStatus()))}else f(new index_esm2017_U(tb.UNAVAILABLE,"Connection failed."));break;default:index_esm2017_O()}}finally{index_esm2017_N(tU,`RPC '${e}' ${h} completed.`)}});let g=JSON.stringify(u);index_esm2017_N(tU,`RPC '${e}' ${h} sending request:`,u),m.send(t,"POST",g,l,15)})}Ro(e,t,l){let u=Cu(),h=[this.mo,"/","google.firestore.v1.Firestore","/",e,"/channel"],d=te(),f=tr(),g={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},_=this.longPollingOptions.timeoutSeconds;void 0!==_&&(g.longPollingTimeout=Math.round(1e3*_)),this.useFetchStreams&&(g.xmlHttpFactory=new tf({})),this.Eo(g.initMessageHeaders,t,l),g.encodeInitMessageHeaders=!0;let b=h.join("");index_esm2017_N(tU,`Creating RPC '${e}' stream ${u}: ${b}`,g);let E=d.createWebChannel(b,g),k=!1,L=!1,V=new Nu({ro:t=>{L?index_esm2017_N(tU,`Not sending because RPC '${e}' stream ${u} is closed:`,t):(k||(index_esm2017_N(tU,`Opening RPC '${e}' stream ${u} transport.`),E.open(),k=!0),index_esm2017_N(tU,`RPC '${e}' stream ${u} sending:`,t),E.send(t))},oo:()=>E.close()}),w=(e,t,l)=>{e.listen(t,e=>{try{l(e)}catch(e){setTimeout(()=>{throw e},0)}})};return w(E,tm.EventType.OPEN,()=>{L||index_esm2017_N(tU,`RPC '${e}' stream ${u} transport opened.`)}),w(E,tm.EventType.CLOSE,()=>{L||(L=!0,index_esm2017_N(tU,`RPC '${e}' stream ${u} transport closed`),V.wo())}),w(E,tm.EventType.ERROR,t=>{L||(L=!0,index_esm2017_M(tU,`RPC '${e}' stream ${u} transport errored:`,t),V.wo(new index_esm2017_U(tb.UNAVAILABLE,"The operation could not be completed")))}),w(E,tm.EventType.MESSAGE,t=>{var l;if(!L){let h=t.data[0];h||index_esm2017_O();let d=h.error||(null===(l=h[0])||void 0===l?void 0:l.error);if(d){index_esm2017_N(tU,`RPC '${e}' stream ${u} received error:`,d);let t=d.status,l=function(e){let t=m[e];if(void 0!==t)return ui(t)}(t),h=d.message;void 0===l&&(l=tb.INTERNAL,h="Unknown error status: "+t+" with message "+d.message),L=!0,V.wo(new index_esm2017_U(l,h)),E.close()}else index_esm2017_N(tU,`RPC '${e}' stream ${u} received:`,h),V._o(h)}}),w(f,tc.STAT_EVENT,t=>{t.stat===td.PROXY?index_esm2017_N(tU,`RPC '${e}' stream ${u} detected buffering proxy`):t.stat===td.NOPROXY&&index_esm2017_N(tU,`RPC '${e}' stream ${u} detected no buffering proxy`)}),setTimeout(()=>{V.fo()},0),V}};function Ou(){return"undefined"!=typeof document?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fu(e){return new Vi(e,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Bu=class Bu{constructor(e,t,l=1e3,u=1.5,h=6e4){this.ii=e,this.timerId=t,this.Po=l,this.bo=u,this.Vo=h,this.So=0,this.Do=null,this.Co=Date.now(),this.reset()}reset(){this.So=0}xo(){this.So=this.Vo}No(e){this.cancel();let t=Math.floor(this.So+this.ko()),l=Math.max(0,Date.now()-this.Co),u=Math.max(0,t-l);u>0&&index_esm2017_N("ExponentialBackoff",`Backing off for ${u} ms (base delay: ${this.So} ms, delay with jitter: ${t} ms, last attempt: ${l} ms ago)`),this.Do=this.ii.enqueueAfterDelay(this.timerId,u,()=>(this.Co=Date.now(),e())),this.So*=this.bo,this.So<this.Po&&(this.So=this.Po),this.So>this.Vo&&(this.So=this.Vo)}Mo(){null!==this.Do&&(this.Do.skipDelay(),this.Do=null)}cancel(){null!==this.Do&&(this.Do.cancel(),this.Do=null)}ko(){return(Math.random()-.5)*this.So}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Lu=class Lu{constructor(e,t,l,u,h,d,f,m){this.ii=e,this.$o=l,this.Oo=u,this.connection=h,this.authCredentialsProvider=d,this.appCheckCredentialsProvider=f,this.listener=m,this.state=0,this.Fo=0,this.Bo=null,this.Lo=null,this.stream=null,this.qo=new Bu(e,t)}Uo(){return 1===this.state||5===this.state||this.Ko()}Ko(){return 2===this.state||3===this.state}start(){4!==this.state?this.auth():this.Go()}async stop(){this.Uo()&&await this.close(0)}Qo(){this.state=0,this.qo.reset()}jo(){this.Ko()&&null===this.Bo&&(this.Bo=this.ii.enqueueAfterDelay(this.$o,6e4,()=>this.zo()))}Wo(e){this.Ho(),this.stream.send(e)}async zo(){if(this.Ko())return this.close(0)}Ho(){this.Bo&&(this.Bo.cancel(),this.Bo=null)}Jo(){this.Lo&&(this.Lo.cancel(),this.Lo=null)}async close(e,t){this.Ho(),this.Jo(),this.qo.cancel(),this.Fo++,4!==e?this.qo.reset():t&&t.code===tb.RESOURCE_EXHAUSTED?(index_esm2017_k(t.toString()),index_esm2017_k("Using maximum backoff delay to prevent overloading the backend."),this.qo.xo()):t&&t.code===tb.UNAUTHENTICATED&&3!==this.state&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),null!==this.stream&&(this.Yo(),this.stream.close(),this.stream=null),this.state=e,await this.listener.ao(t)}Yo(){}auth(){this.state=1;let e=this.Xo(this.Fo),t=this.Fo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([e,l])=>{this.Fo===t&&this.Zo(e,l)},t=>{e(()=>{let e=new index_esm2017_U(tb.UNKNOWN,"Fetching auth token failed: "+t.message);return this.tu(e)})})}Zo(e,t){let l=this.Xo(this.Fo);this.stream=this.eu(e,t),this.stream.uo(()=>{l(()=>(this.state=2,this.Lo=this.ii.enqueueAfterDelay(this.Oo,1e4,()=>(this.Ko()&&(this.state=3),Promise.resolve())),this.listener.uo()))}),this.stream.ao(e=>{l(()=>this.tu(e))}),this.stream.onMessage(e=>{l(()=>this.onMessage(e))})}Go(){this.state=5,this.qo.No(async()=>{this.state=0,this.start()})}tu(e){return index_esm2017_N("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}Xo(e){return t=>{this.ii.enqueueAndForget(()=>this.Fo===e?t():(index_esm2017_N("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}};let qu=class qu extends Lu{constructor(e,t,l,u,h,d){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,l,u,d),this.serializer=h}eu(e,t){return this.connection.Ro("Listen",e,t)}onMessage(e){this.qo.reset();let t=function(e,t){let l;if("targetChange"in t){var u,h;t.targetChange;let d="NO_CHANGE"===(u=t.targetChange.targetChangeType||"NO_CHANGE")?0:"ADD"===u?1:"REMOVE"===u?2:"CURRENT"===u?3:"RESET"===u?4:index_esm2017_O(),f=t.targetChange.targetIds||[],m=(h=t.targetChange.resumeToken,e.useProto3Json?(void 0===h||"string"==typeof h||index_esm2017_O(),Ve.fromBase64String(h||"")):(void 0===h||h instanceof Uint8Array||index_esm2017_O(),Ve.fromUint8Array(h||new Uint8Array))),g=t.targetChange.cause,_=g&&function(e){let t=void 0===e.code?tb.UNKNOWN:ui(e.code);return new index_esm2017_U(t,e.message||"")}(g);l=new Ii(d,f,m,_||null)}else if("documentChange"in t){t.documentChange;let u=t.documentChange;u.document,u.document.name,u.document.updateTime;let h=Oi(e,u.document.name),d=Ni(u.document.updateTime),f=u.document.createTime?Ni(u.document.createTime):rt.min(),m=new un({mapValue:{fields:u.document.fields}}),g=an.newFoundDocument(h,d,f,m),_=u.targetIds||[],b=u.removedTargetIds||[];l=new yi(_,b,g.key,g)}else if("documentDelete"in t){t.documentDelete;let u=t.documentDelete;u.document;let h=Oi(e,u.document),d=u.readTime?Ni(u.readTime):rt.min(),f=an.newNoDocument(h,d),m=u.removedTargetIds||[];l=new yi([],m,f.key,f)}else if("documentRemove"in t){t.documentRemove;let u=t.documentRemove;u.document;let h=Oi(e,u.document),d=u.removedTargetIds||[];l=new yi([],d,h,null)}else{if(!("filter"in t))return index_esm2017_O();{t.filter;let e=t.filter;e.targetId;let{count:u=0,unchangedNames:h}=e,d=new si(u,h),f=e.targetId;l=new pi(f,d)}}return l}(this.serializer,e),l=function(e){if(!("targetChange"in e))return rt.min();let t=e.targetChange;return t.targetIds&&t.targetIds.length?rt.min():t.readTime?Ni(t.readTime):rt.min()}(e);return this.listener.nu(t,l)}su(e){let t={};t.database=Li(this.serializer),t.addTarget=function(e,t){let l;let u=t.target;if((l=Fn(u)?{documents:{documents:[Fi(e,u.path)]}}:{query:function(e,t){var l,u;let h={structuredQuery:{}},d=t.path;null!==t.collectionGroup?(h.parent=Fi(e,d),h.structuredQuery.from=[{collectionId:t.collectionGroup,allDescendants:!0}]):(h.parent=Fi(e,d.popLast()),h.structuredQuery.from=[{collectionId:d.lastSegment()}]);let f=function(e){if(0!==e.length)return function rr(e){return e instanceof mn?function(e){if("=="===e.op){if(Xe(e.value))return{unaryFilter:{field:sr(e.field),op:"IS_NAN"}};if(Ye(e.value))return{unaryFilter:{field:sr(e.field),op:"IS_NULL"}}}else if("!="===e.op){if(Xe(e.value))return{unaryFilter:{field:sr(e.field),op:"IS_NOT_NAN"}};if(Ye(e.value))return{unaryFilter:{field:sr(e.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:sr(e.field),op:tD[e.op],value:e.value}}}(e):e instanceof gn?function(e){let t=e.getFilters().map(e=>rr(e));return 1===t.length?t[0]:{compositeFilter:{op:tP[e.op],filters:t}}}(e):index_esm2017_O()}(gn.create(e,"and"))}(t.filters);f&&(h.structuredQuery.where=f);let m=function(e){if(0!==e.length)return e.map(e=>({field:sr(e.field),direction:tO[e.dir]}))}(t.orderBy);m&&(h.structuredQuery.orderBy=m);let g=Si(e,t.limit);return null!==g&&(h.structuredQuery.limit=g),t.startAt&&(h.structuredQuery.startAt={before:(l=t.startAt).inclusive,values:l.position}),t.endAt&&(h.structuredQuery.endAt={before:!(u=t.endAt).inclusive,values:u.position}),h}(e,u)}).targetId=t.targetId,t.resumeToken.approximateByteSize()>0){l.resumeToken=Ci(e,t.resumeToken);let u=Si(e,t.expectedCount);null!==u&&(l.expectedCount=u)}else if(t.snapshotVersion.compareTo(rt.min())>0){l.readTime=Di(e,t.snapshotVersion.toTimestamp());let u=Si(e,t.expectedCount);null!==u&&(l.expectedCount=u)}return l}(this.serializer,e);let l=function(e,t){let l=function(e){switch(e){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return index_esm2017_O()}}(t.purpose);return null==l?null:{"goog-listen-tags":l}}(this.serializer,e);l&&(t.labels=l),this.Wo(t)}iu(e){let t={};t.database=Li(this.serializer),t.removeTarget=e,this.Wo(t)}};let Uu=class Uu extends Lu{constructor(e,t,l,u,h,d){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,l,u,d),this.serializer=h,this.ru=!1}get ou(){return this.ru}start(){this.ru=!1,this.lastStreamToken=void 0,super.start()}Yo(){this.ru&&this.uu([])}eu(e,t){return this.connection.Ro("Write",e,t)}onMessage(e){var t,l;if(e.streamToken||index_esm2017_O(),this.lastStreamToken=e.streamToken,this.ru){this.qo.reset();let u=(t=e.writeResults,l=e.commitTime,t&&t.length>0?(void 0!==l||index_esm2017_O(),t.map(e=>{let t;return(t=e.updateTime?Ni(e.updateTime):Ni(l)).isEqual(rt.min())&&(t=Ni(l)),new Os(t,e.transformResults||[])})):[]),h=Ni(e.commitTime);return this.listener.cu(h,u)}return e.writeResults&&0!==e.writeResults.length&&index_esm2017_O(),this.ru=!0,this.listener.au()}hu(){let e={};e.database=Li(this.serializer),this.Wo(e)}uu(e){let t={streamToken:this.lastStreamToken,writes:e.map(e=>(function(e,t){var l;let u;if(t instanceof js)u={update:Ui(e,t.key,t.value)};else if(t instanceof Ys)u={delete:$i(e,t.key)};else if(t instanceof zs)u={update:Ui(e,t.key,t.data),updateMask:function(e){let t=[];return e.fields.forEach(e=>t.push(e.canonicalString())),{fieldPaths:t}}(t.fieldMask)};else{if(!(t instanceof Xs))return index_esm2017_O();u={verify:$i(e,t.key)}}return t.fieldTransforms.length>0&&(u.updateTransforms=t.fieldTransforms.map(e=>(function(e,t){let l=t.transform;if(l instanceof bs)return{fieldPath:t.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof Vs)return{fieldPath:t.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof Ds)return{fieldPath:t.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof xs)return{fieldPath:t.field.canonicalString(),increment:l.gt};throw index_esm2017_O()})(0,e))),t.precondition.isNone||(u.currentDocument=void 0!==(l=t.precondition).updateTime?{updateTime:Di(e,l.updateTime.toTimestamp())}:void 0!==l.exists?{exists:l.exists}:index_esm2017_O()),u})(this.serializer,e))};this.Wo(t)}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ku=class Ku extends class{}{constructor(e,t,l,u){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=l,this.serializer=u,this.lu=!1}fu(){if(this.lu)throw new index_esm2017_U(tb.FAILED_PRECONDITION,"The client has already been terminated.")}Io(e,t,l){return this.fu(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([u,h])=>this.connection.Io(e,t,l,u,h)).catch(e=>{throw"FirebaseError"===e.name?(e.code===tb.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),e):new index_esm2017_U(tb.UNKNOWN,e.toString())})}vo(e,t,l,u){return this.fu(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([h,d])=>this.connection.vo(e,t,l,h,d,u)).catch(e=>{throw"FirebaseError"===e.name?(e.code===tb.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),e):new index_esm2017_U(tb.UNKNOWN,e.toString())})}terminate(){this.lu=!0}};let Qu=class Qu{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.wu=0,this._u=null,this.mu=!0}gu(){0===this.wu&&(this.yu("Unknown"),this._u=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this._u=null,this.pu("Backend didn't respond within 10 seconds."),this.yu("Offline"),Promise.resolve())))}Iu(e){"Online"===this.state?this.yu("Unknown"):(this.wu++,this.wu>=1&&(this.Tu(),this.pu(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.yu("Offline")))}set(e){this.Tu(),this.wu=0,"Online"===e&&(this.mu=!1),this.yu(e)}yu(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}pu(e){let t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.mu?(index_esm2017_k(t),this.mu=!1):index_esm2017_N("OnlineStateTracker",t)}Tu(){null!==this._u&&(this._u.cancel(),this._u=null)}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ju=class ju{constructor(e,t,l,u,h){this.localStore=e,this.datastore=t,this.asyncQueue=l,this.remoteSyncer={},this.Eu=[],this.Au=new Map,this.vu=new Set,this.Ru=[],this.Pu=h,this.Pu.Yr(e=>{l.enqueueAndForget(async()=>{index_esm2017_ec(this)&&(index_esm2017_N("RemoteStore","Restarting streams for network reachability change."),await async function(e){e.vu.add(4),await Wu(e),e.bu.set("Unknown"),e.vu.delete(4),await zu(e)}(this))})}),this.bu=new Qu(l,u)}};async function zu(e){if(index_esm2017_ec(e))for(let t of e.Ru)await t(!0)}async function Wu(e){for(let t of e.Ru)await t(!1)}function Hu(e,t){e.Au.has(t.targetId)||(e.Au.set(t.targetId,t),index_esm2017_tc(e)?Zu(e):index_esm2017_pc(e).Ko()&&Yu(e,t))}function Ju(e,t){let l=index_esm2017_pc(e);e.Au.delete(t),l.Ko()&&Xu(e,t),0===e.Au.size&&(l.Ko()?l.jo():index_esm2017_ec(e)&&e.bu.set("Unknown"))}function Yu(e,t){if(e.Vu.qt(t.targetId),t.resumeToken.approximateByteSize()>0||t.snapshotVersion.compareTo(rt.min())>0){let l=e.remoteSyncer.getRemoteKeysForTarget(t.targetId).size;t=t.withExpectedCount(l)}index_esm2017_pc(e).su(t)}function Xu(e,t){e.Vu.qt(t),index_esm2017_pc(e).iu(t)}function Zu(e){e.Vu=new Ei({getRemoteKeysForTarget:t=>e.remoteSyncer.getRemoteKeysForTarget(t),le:t=>e.Au.get(t)||null,ue:()=>e.datastore.serializer.databaseId}),index_esm2017_pc(e).start(),e.bu.gu()}function index_esm2017_tc(e){return index_esm2017_ec(e)&&!index_esm2017_pc(e).Uo()&&e.Au.size>0}function index_esm2017_ec(e){return 0===e.vu.size}async function index_esm2017_sc(e){e.Au.forEach((t,l)=>{Yu(e,t)})}async function index_esm2017_ic(e,t){e.Vu=void 0,index_esm2017_tc(e)?(e.bu.Iu(t),Zu(e)):e.bu.set("Unknown")}async function index_esm2017_rc(e,t,l){if(e.bu.set("Online"),t instanceof Ii&&2===t.state&&t.cause)try{await async function(e,t){let l=t.cause;for(let u of t.targetIds)e.Au.has(u)&&(await e.remoteSyncer.rejectListen(u,l),e.Au.delete(u),e.Vu.removeTarget(u))}(e,t)}catch(l){index_esm2017_N("RemoteStore","Failed to remove targets %s: %s ",t.targetIds.join(","),l),await index_esm2017_oc(e,l)}else if(t instanceof yi?e.Vu.Ht(t):t instanceof pi?e.Vu.ne(t):e.Vu.Xt(t),!l.isEqual(rt.min()))try{let t=await ou(e.localStore);l.compareTo(t)>=0&&await function(e,t){let l=e.Vu.ce(t);return l.targetChanges.forEach((l,u)=>{if(l.resumeToken.approximateByteSize()>0){let h=e.Au.get(u);h&&e.Au.set(u,h.withResumeToken(l.resumeToken,t))}}),l.targetMismatches.forEach((t,l)=>{let u=e.Au.get(t);if(!u)return;e.Au.set(t,u.withResumeToken(Ve.EMPTY_BYTE_STRING,u.snapshotVersion)),Xu(e,t);let h=new cr(u.target,t,l,u.sequenceNumber);Yu(e,h)}),e.remoteSyncer.applyRemoteEvent(l)}(e,l)}catch(t){index_esm2017_N("RemoteStore","Failed to raise snapshot:",t),await index_esm2017_oc(e,t)}}async function index_esm2017_oc(e,t,l){if(!Dt(t))throw t;e.vu.add(1),await Wu(e),e.bu.set("Offline"),l||(l=()=>ou(e.localStore)),e.asyncQueue.enqueueRetryable(async()=>{index_esm2017_N("RemoteStore","Retrying IndexedDB access"),await l(),e.vu.delete(1),await zu(e)})}function index_esm2017_uc(e,t){return t().catch(l=>index_esm2017_oc(e,l,t))}async function index_esm2017_cc(e){let t=index_esm2017_Ic(e),l=e.Eu.length>0?e.Eu[e.Eu.length-1].batchId:-1;for(;index_esm2017_ec(e)&&e.Eu.length<10;)try{let u=await function(e,t){return e.persistence.runTransaction("Get next mutation batch","readonly",l=>(void 0===t&&(t=-1),e.mutationQueue.getNextMutationBatchAfterBatchId(l,t)))}(e.localStore,l);if(null===u){0===e.Eu.length&&t.jo();break}l=u.batchId,function(e,t){e.Eu.push(t);let l=index_esm2017_Ic(e);l.Ko()&&l.ou&&l.uu(t.mutations)}(e,u)}catch(t){await index_esm2017_oc(e,t)}index_esm2017_lc(e)&&index_esm2017_fc(e)}function index_esm2017_lc(e){return index_esm2017_ec(e)&&!index_esm2017_Ic(e).Uo()&&e.Eu.length>0}function index_esm2017_fc(e){index_esm2017_Ic(e).start()}async function index_esm2017_dc(e){index_esm2017_Ic(e).hu()}async function index_esm2017_wc(e){let t=index_esm2017_Ic(e);for(let l of e.Eu)t.uu(l.mutations)}async function _c(e,t,l){let u=e.Eu.shift(),h=ti.from(u,t,l);await index_esm2017_uc(e,()=>e.remoteSyncer.applySuccessfulWrite(h)),await index_esm2017_cc(e)}async function index_esm2017_mc(e,t){t&&index_esm2017_Ic(e).ou&&await async function(e,t){var l;if(function(e){switch(e){default:return index_esm2017_O();case tb.CANCELLED:case tb.UNKNOWN:case tb.DEADLINE_EXCEEDED:case tb.RESOURCE_EXHAUSTED:case tb.INTERNAL:case tb.UNAVAILABLE:case tb.UNAUTHENTICATED:return!1;case tb.INVALID_ARGUMENT:case tb.NOT_FOUND:case tb.ALREADY_EXISTS:case tb.PERMISSION_DENIED:case tb.FAILED_PRECONDITION:case tb.ABORTED:case tb.OUT_OF_RANGE:case tb.UNIMPLEMENTED:case tb.DATA_LOSS:return!0}}(l=t.code)&&l!==tb.ABORTED){let l=e.Eu.shift();index_esm2017_Ic(e).Qo(),await index_esm2017_uc(e,()=>e.remoteSyncer.rejectFailedWrite(l.batchId,t)),await index_esm2017_cc(e)}}(e,t),index_esm2017_lc(e)&&index_esm2017_fc(e)}async function index_esm2017_gc(e,t){e.asyncQueue.verifyOperationInProgress(),index_esm2017_N("RemoteStore","RemoteStore received new credentials");let l=index_esm2017_ec(e);e.vu.add(3),await Wu(e),l&&e.bu.set("Unknown"),await e.remoteSyncer.handleCredentialChange(t),e.vu.delete(3),await zu(e)}async function index_esm2017_yc(e,t){t?(e.vu.delete(2),await zu(e)):t||(e.vu.add(2),await Wu(e),e.bu.set("Unknown"))}function index_esm2017_pc(e){var t,l,u;return e.Su||(e.Su=(t=e.datastore,l=e.asyncQueue,u={uo:index_esm2017_sc.bind(null,e),ao:index_esm2017_ic.bind(null,e),nu:index_esm2017_rc.bind(null,e)},t.fu(),new qu(l,t.connection,t.authCredentials,t.appCheckCredentials,t.serializer,u)),e.Ru.push(async t=>{t?(e.Su.Qo(),index_esm2017_tc(e)?Zu(e):e.bu.set("Unknown")):(await e.Su.stop(),e.Vu=void 0)})),e.Su}function index_esm2017_Ic(e){var t,l,u;return e.Du||(e.Du=(t=e.datastore,l=e.asyncQueue,u={uo:index_esm2017_dc.bind(null,e),ao:index_esm2017_mc.bind(null,e),au:index_esm2017_wc.bind(null,e),cu:_c.bind(null,e)},t.fu(),new Uu(l,t.connection,t.authCredentials,t.appCheckCredentials,t.serializer,u)),e.Ru.push(async t=>{t?(e.Du.Qo(),await index_esm2017_cc(e)):(await e.Du.stop(),e.Eu.length>0&&(index_esm2017_N("RemoteStore",`Stopping write stream with ${e.Eu.length} pending writes`),e.Eu=[]))})),e.Du}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let index_esm2017_Tc=class index_esm2017_Tc{constructor(e,t,l,u,h){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=l,this.op=u,this.removalCallback=h,this.deferred=new index_esm2017_K,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(e=>{})}static createAndSchedule(e,t,l,u,h){let d=Date.now()+l,f=new index_esm2017_Tc(e,t,d,u,h);return f.start(l),f}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){null!==this.timerHandle&&(this.clearTimeout(),this.deferred.reject(new index_esm2017_U(tb.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>null!==this.timerHandle?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){null!==this.timerHandle&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}};function index_esm2017_Ec(e,t){if(index_esm2017_k("AsyncQueue",`${t}: ${e}`),Dt(e))return new index_esm2017_U(tb.UNAVAILABLE,`${t}: ${e}`);throw e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let index_esm2017_Ac=class index_esm2017_Ac{constructor(e){this.comparator=e?(t,l)=>e(t,l)||ht.comparator(t.key,l.key):(e,t)=>ht.comparator(e.key,t.key),this.keyedMap=hs(),this.sortedSet=new pe(this.comparator)}static emptySet(e){return new index_esm2017_Ac(e.comparator)}has(e){return null!=this.keyedMap.get(e)}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){let t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,l)=>(e(t),!1))}add(e){let t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){let t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof index_esm2017_Ac)||this.size!==e.size)return!1;let t=this.sortedSet.getIterator(),l=e.sortedSet.getIterator();for(;t.hasNext();){let e=t.getNext().key,u=l.getNext().key;if(!e.isEqual(u))return!1}return!0}toString(){let e=[];return this.forEach(t=>{e.push(t.toString())}),0===e.length?"DocumentSet ()":"DocumentSet (\n  "+e.join("  \n")+"\n)"}copy(e,t){let l=new index_esm2017_Ac;return l.comparator=this.comparator,l.keyedMap=e,l.sortedSet=t,l}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let index_esm2017_vc=class index_esm2017_vc{constructor(){this.Cu=new pe(ht.comparator)}track(e){let t=e.doc.key,l=this.Cu.get(t);l?0!==e.type&&3===l.type?this.Cu=this.Cu.insert(t,e):3===e.type&&1!==l.type?this.Cu=this.Cu.insert(t,{type:l.type,doc:e.doc}):2===e.type&&2===l.type?this.Cu=this.Cu.insert(t,{type:2,doc:e.doc}):2===e.type&&0===l.type?this.Cu=this.Cu.insert(t,{type:0,doc:e.doc}):1===e.type&&0===l.type?this.Cu=this.Cu.remove(t):1===e.type&&2===l.type?this.Cu=this.Cu.insert(t,{type:1,doc:l.doc}):0===e.type&&1===l.type?this.Cu=this.Cu.insert(t,{type:2,doc:e.doc}):index_esm2017_O():this.Cu=this.Cu.insert(t,e)}xu(){let e=[];return this.Cu.inorderTraversal((t,l)=>{e.push(l)}),e}};let index_esm2017_Rc=class index_esm2017_Rc{constructor(e,t,l,u,h,d,f,m,g){this.query=e,this.docs=t,this.oldDocs=l,this.docChanges=u,this.mutatedKeys=h,this.fromCache=d,this.syncStateChanged=f,this.excludesMetadataChanges=m,this.hasCachedResults=g}static fromInitialDocuments(e,t,l,u,h){let d=[];return t.forEach(e=>{d.push({type:0,doc:e})}),new index_esm2017_Rc(e,t,index_esm2017_Ac.emptySet(t),d,l,u,!0,!1,h)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Zn(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;let t=this.docChanges,l=e.docChanges;if(t.length!==l.length)return!1;for(let e=0;e<t.length;e++)if(t[e].type!==l[e].type||!t[e].doc.isEqual(l[e].doc))return!1;return!0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let index_esm2017_Pc=class index_esm2017_Pc{constructor(){this.Nu=void 0,this.listeners=[]}};let index_esm2017_bc=class index_esm2017_bc{constructor(){this.queries=new os(e=>ts(e),Zn),this.onlineState="Unknown",this.ku=new Set}};async function index_esm2017_Vc(e,t){let l=t.query,u=!1,h=e.queries.get(l);if(h||(u=!0,h=new index_esm2017_Pc),u)try{h.Nu=await e.onListen(l)}catch(l){let e=index_esm2017_Ec(l,`Initialization of query '${es(t.query)}' failed`);return void t.onError(e)}e.queries.set(l,h),h.listeners.push(t),t.Mu(e.onlineState),h.Nu&&t.$u(h.Nu)&&index_esm2017_xc(e)}async function index_esm2017_Sc(e,t){let l=t.query,u=!1,h=e.queries.get(l);if(h){let e=h.listeners.indexOf(t);e>=0&&(h.listeners.splice(e,1),u=0===h.listeners.length)}if(u)return e.queries.delete(l),e.onUnlisten(l)}function index_esm2017_Dc(e,t){let l=!1;for(let u of t){let t=u.query,h=e.queries.get(t);if(h){for(let e of h.listeners)e.$u(u)&&(l=!0);h.Nu=u}}l&&index_esm2017_xc(e)}function index_esm2017_Cc(e,t,l){let u=e.queries.get(t);if(u)for(let e of u.listeners)e.onError(l);e.queries.delete(t)}function index_esm2017_xc(e){e.ku.forEach(e=>{e.next()})}let index_esm2017_Nc=class index_esm2017_Nc{constructor(e,t,l){this.query=e,this.Ou=t,this.Fu=!1,this.Bu=null,this.onlineState="Unknown",this.options=l||{}}$u(e){if(!this.options.includeMetadataChanges){let t=[];for(let l of e.docChanges)3!==l.type&&t.push(l);e=new index_esm2017_Rc(e.query,e.docs,e.oldDocs,t,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.Fu?this.Lu(e)&&(this.Ou.next(e),t=!0):this.qu(e,this.onlineState)&&(this.Uu(e),t=!0),this.Bu=e,t}onError(e){this.Ou.error(e)}Mu(e){this.onlineState=e;let t=!1;return this.Bu&&!this.Fu&&this.qu(this.Bu,e)&&(this.Uu(this.Bu),t=!0),t}qu(e,t){return!e.fromCache||(!this.options.Ku||!("Offline"!==t))&&(!e.docs.isEmpty()||e.hasCachedResults||"Offline"===t)}Lu(e){if(e.docChanges.length>0)return!0;let t=this.Bu&&this.Bu.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&!0===this.options.includeMetadataChanges}Uu(e){e=index_esm2017_Rc.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Fu=!0,this.Ou.next(e)}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let index_esm2017_Fc=class index_esm2017_Fc{constructor(e){this.key=e}};let index_esm2017_Bc=class index_esm2017_Bc{constructor(e){this.key=e}};let index_esm2017_Lc=class index_esm2017_Lc{constructor(e,t){this.query=e,this.Yu=t,this.Xu=null,this.hasCachedResults=!1,this.current=!1,this.Zu=gs(),this.mutatedKeys=gs(),this.tc=is(e),this.ec=new index_esm2017_Ac(this.tc)}get nc(){return this.Yu}sc(e,t){let l=t?t.ic:new index_esm2017_vc,u=t?t.ec:this.ec,h=t?t.mutatedKeys:this.mutatedKeys,d=u,f=!1,m="F"===this.query.limitType&&u.size===this.query.limit?u.last():null,g="L"===this.query.limitType&&u.size===this.query.limit?u.first():null;if(e.inorderTraversal((e,t)=>{let _=u.get(e),b=ns(this.query,t)?t:null,E=!!_&&this.mutatedKeys.has(_.key),k=!!b&&(b.hasLocalMutations||this.mutatedKeys.has(b.key)&&b.hasCommittedMutations),L=!1;_&&b?_.data.isEqual(b.data)?E!==k&&(l.track({type:3,doc:b}),L=!0):this.rc(_,b)||(l.track({type:2,doc:b}),L=!0,(m&&this.tc(b,m)>0||g&&0>this.tc(b,g))&&(f=!0)):!_&&b?(l.track({type:0,doc:b}),L=!0):_&&!b&&(l.track({type:1,doc:_}),L=!0,(m||g)&&(f=!0)),L&&(b?(d=d.add(b),h=k?h.add(e):h.delete(e)):(d=d.delete(e),h=h.delete(e)))}),null!==this.query.limit)for(;d.size>this.query.limit;){let e="F"===this.query.limitType?d.last():d.first();d=d.delete(e.key),h=h.delete(e.key),l.track({type:1,doc:e})}return{ec:d,ic:l,zi:f,mutatedKeys:h}}rc(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,l){let u=this.ec;this.ec=e.ec,this.mutatedKeys=e.mutatedKeys;let h=e.ic.xu();h.sort((e,t)=>(function(e,t){let n=e=>{switch(e){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return index_esm2017_O()}};return n(e)-n(t)})(e.type,t.type)||this.tc(e.doc,t.doc)),this.oc(l);let d=t?this.uc():[],f=0===this.Zu.size&&this.current?1:0,m=f!==this.Xu;return(this.Xu=f,0!==h.length||m)?{snapshot:new index_esm2017_Rc(this.query,e.ec,u,h,e.mutatedKeys,0===f,m,!1,!!l&&l.resumeToken.approximateByteSize()>0),cc:d}:{cc:d}}Mu(e){return this.current&&"Offline"===e?(this.current=!1,this.applyChanges({ec:this.ec,ic:new index_esm2017_vc,mutatedKeys:this.mutatedKeys,zi:!1},!1)):{cc:[]}}ac(e){return!this.Yu.has(e)&&!!this.ec.has(e)&&!this.ec.get(e).hasLocalMutations}oc(e){e&&(e.addedDocuments.forEach(e=>this.Yu=this.Yu.add(e)),e.modifiedDocuments.forEach(e=>{}),e.removedDocuments.forEach(e=>this.Yu=this.Yu.delete(e)),this.current=e.current)}uc(){if(!this.current)return[];let e=this.Zu;this.Zu=gs(),this.ec.forEach(e=>{this.ac(e.key)&&(this.Zu=this.Zu.add(e.key))});let t=[];return e.forEach(e=>{this.Zu.has(e)||t.push(new index_esm2017_Bc(e))}),this.Zu.forEach(l=>{e.has(l)||t.push(new index_esm2017_Fc(l))}),t}hc(e){this.Yu=e.ir,this.Zu=gs();let t=this.sc(e.documents);return this.applyChanges(t,!0)}lc(){return index_esm2017_Rc.fromInitialDocuments(this.query,this.ec,this.mutatedKeys,0===this.Xu,this.hasCachedResults)}};let index_esm2017_qc=class index_esm2017_qc{constructor(e,t,l){this.query=e,this.targetId=t,this.view=l}};let index_esm2017_Uc=class index_esm2017_Uc{constructor(e){this.key=e,this.fc=!1}};let index_esm2017_Kc=class index_esm2017_Kc{constructor(e,t,l,u,h,d){this.localStore=e,this.remoteStore=t,this.eventManager=l,this.sharedClientState=u,this.currentUser=h,this.maxConcurrentLimboResolutions=d,this.dc={},this.wc=new os(e=>ts(e),Zn),this._c=new Map,this.mc=new Set,this.gc=new pe(ht.comparator),this.yc=new Map,this.Ic=new Oo,this.Tc={},this.Ec=new Map,this.Ac=lo.Mn(),this.onlineState="Unknown",this.vc=void 0}get isPrimaryClient(){return!0===this.vc}};async function index_esm2017_Gc(e,t){var l,u;let h,d;let f=(e.remoteStore.remoteSyncer.applyRemoteEvent=index_esm2017_Wc.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=index_esm2017_aa.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=index_esm2017_Jc.bind(null,e),e.dc.nu=index_esm2017_Dc.bind(null,e.eventManager),e.dc.Pc=index_esm2017_Cc.bind(null,e.eventManager),e),m=f.wc.get(t);if(m)h=m.targetId,f.sharedClientState.addLocalQueryTarget(h),d=m.view.lc();else{let e=await (l=f.localStore,u=Jn(t),l.persistence.runTransaction("Allocate target","readwrite",e=>{let t;return l.Bs.getTargetData(e,u).next(h=>h?(t=h,Rt.resolve(t)):l.Bs.allocateTargetId(e).next(h=>(t=new cr(u,h,"TargetPurposeListen",e.currentSequenceNumber),l.Bs.addTargetData(e,t).next(()=>t))))}).then(e=>{let t=l.Ji.get(e.targetId);return(null===t||e.snapshotVersion.compareTo(t.snapshotVersion)>0)&&(l.Ji=l.Ji.insert(e.targetId,e),l.Yi.set(u,e.targetId)),e})),m=f.sharedClientState.addLocalQueryTarget(e.targetId);h=e.targetId,d=await index_esm2017_Qc(f,t,h,"current"===m,e.resumeToken),f.isPrimaryClient&&Hu(f.remoteStore,e)}return d}async function index_esm2017_Qc(e,t,l,u,h){e.Rc=(t,l,u)=>(async function(e,t,l,u){let h=t.view.sc(l);h.zi&&(h=await fu(e.localStore,t.query,!1).then(({documents:e})=>t.view.sc(e,h)));let d=u&&u.targetChanges.get(t.targetId),f=t.view.applyChanges(h,e.isPrimaryClient,d);return index_esm2017_ia(e,t.targetId,f.cc),f.snapshot})(e,t,l,u);let d=await fu(e.localStore,t,!0),f=new index_esm2017_Lc(t,d.ir),m=f.sc(d.documents),g=gi.createSynthesizedTargetChangeForCurrentChange(l,u&&"Offline"!==e.onlineState,h),_=f.applyChanges(m,e.isPrimaryClient,g);index_esm2017_ia(e,l,_.cc);let b=new index_esm2017_qc(t,l,f);return e.wc.set(t,b),e._c.has(l)?e._c.get(l).push(t):e._c.set(l,[t]),_.snapshot}async function index_esm2017_jc(e,t){let l=e.wc.get(t),u=e._c.get(l.targetId);if(u.length>1)return e._c.set(l.targetId,u.filter(e=>!Zn(e,t))),void e.wc.delete(t);e.isPrimaryClient?(e.sharedClientState.removeLocalQueryTarget(l.targetId),e.sharedClientState.isActiveQueryTarget(l.targetId)||await lu(e.localStore,l.targetId,!1).then(()=>{e.sharedClientState.clearQueryState(l.targetId),Ju(e.remoteStore,l.targetId),index_esm2017_na(e,l.targetId)}).catch(vt)):(index_esm2017_na(e,l.targetId),await lu(e.localStore,l.targetId,!0))}async function index_esm2017_zc(e,t,l){var u;let h=(e.remoteStore.remoteSyncer.applySuccessfulWrite=index_esm2017_Yc.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=index_esm2017_Xc.bind(null,e),e);try{let e;let d=await function(e,t){let l,u;let h=it.now(),d=t.reduce((e,t)=>e.add(t.key),gs());return e.persistence.runTransaction("Locally write mutations","readwrite",f=>{let m=tS,g=gs();return e.Zi.getEntries(f,d).next(e=>{(m=e).forEach((e,t)=>{t.isValidDocument()||(g=g.add(e))})}).next(()=>e.localDocuments.getOverlayedDocuments(f,m)).next(u=>{l=u;let d=[];for(let e of t){let t=function(e,t){let l=null;for(let u of e.fieldTransforms){let e=t.data.field(u.field),h=Ps(u.transform,e||null);null!=h&&(null===l&&(l=un.empty()),l.set(u.field,h))}return l||null}(e,l.get(e.key).overlayedDocument);null!=t&&d.push(new zs(e.key,t,function cn(e){let t=[];return ge(e.fields,(e,l)=>{let u=new at([e]);if(Ze(l)){let e=cn(l.mapValue).fields;if(0===e.length)t.push(u);else for(let l of e)t.push(u.child(l))}else t.push(u)}),new Re(t)}(t.value.mapValue),Fs.exists(!0)))}return e.mutationQueue.addMutationBatch(f,h,d,t)}).next(t=>{u=t;let h=t.applyToLocalDocumentSet(l,g);return e.documentOverlayCache.saveOverlays(f,t.batchId,h)})}).then(()=>({batchId:u.batchId,changes:ls(l)}))}(h.localStore,t);h.sharedClientState.addPendingMutation(d.batchId),u=d.batchId,(e=h.Tc[h.currentUser.toKey()])||(e=new pe(et)),e=e.insert(u,l),h.Tc[h.currentUser.toKey()]=e,await index_esm2017_ua(h,d.changes),await index_esm2017_cc(h.remoteStore)}catch(t){let e=index_esm2017_Ec(t,"Failed to persist write");l.reject(e)}}async function index_esm2017_Wc(e,t){try{let l=await function(e,t){let l=t.snapshotVersion,u=e.Ji;return e.persistence.runTransaction("Apply remote event","readwrite-primary",h=>{var d;let f,m;let g=e.Zi.newChangeBuffer({trackRemovals:!0});u=e.Ji;let _=[];t.targetChanges.forEach((d,f)=>{var m;let g=u.get(f);if(!g)return;_.push(e.Bs.removeMatchingKeys(h,d.removedDocuments,f).next(()=>e.Bs.addMatchingKeys(h,d.addedDocuments,f)));let b=g.withSequenceNumber(h.currentSequenceNumber);null!==t.targetMismatches.get(f)?b=b.withResumeToken(Ve.EMPTY_BYTE_STRING,rt.min()).withLastLimboFreeSnapshotVersion(rt.min()):d.resumeToken.approximateByteSize()>0&&(b=b.withResumeToken(d.resumeToken,l)),u=u.insert(f,b),m=b,(0===g.resumeToken.approximateByteSize()||m.snapshotVersion.toMicroseconds()-g.snapshotVersion.toMicroseconds()>=3e8||d.addedDocuments.size+d.modifiedDocuments.size+d.removedDocuments.size>0)&&_.push(e.Bs.updateTargetData(h,b))});let b=tS,E=gs();if(t.documentUpdates.forEach(l=>{t.resolvedLimboDocuments.has(l)&&_.push(e.persistence.referenceDelegate.updateLimboDocument(h,l))}),_.push((d=t.documentUpdates,f=gs(),m=gs(),d.forEach(e=>f=f.add(e)),g.getEntries(h,f).next(e=>{let t=tS;return d.forEach((l,u)=>{let h=e.get(l);u.isFoundDocument()!==h.isFoundDocument()&&(m=m.add(l)),u.isNoDocument()&&u.version.isEqual(rt.min())?(g.removeEntry(l,u.readTime),t=t.insert(l,u)):!h.isValidDocument()||u.version.compareTo(h.version)>0||0===u.version.compareTo(h.version)&&h.hasPendingWrites?(g.addEntry(u),t=t.insert(l,u)):index_esm2017_N("LocalStore","Ignoring outdated watch update for ",l,". Current version:",h.version," Watch version:",u.version)}),{nr:t,sr:m}})).next(e=>{b=e.nr,E=e.sr})),!l.isEqual(rt.min())){let t=e.Bs.getLastRemoteSnapshotVersion(h).next(t=>e.Bs.setTargetsMetadata(h,h.currentSequenceNumber,l));_.push(t)}return Rt.waitFor(_).next(()=>g.apply(h)).next(()=>e.localDocuments.getLocalViewOfDocuments(h,b,E)).next(()=>b)}).then(t=>(e.Ji=u,t))}(e.localStore,t);t.targetChanges.forEach((t,l)=>{let u=e.yc.get(l);u&&(t.addedDocuments.size+t.modifiedDocuments.size+t.removedDocuments.size<=1||index_esm2017_O(),t.addedDocuments.size>0?u.fc=!0:t.modifiedDocuments.size>0?u.fc||index_esm2017_O():t.removedDocuments.size>0&&(u.fc||index_esm2017_O(),u.fc=!1))}),await index_esm2017_ua(e,l,t)}catch(e){await vt(e)}}function index_esm2017_Hc(e,t,l){var u;if(e.isPrimaryClient&&0===l||!e.isPrimaryClient&&1===l){let l;let h=[];e.wc.forEach((e,l)=>{let u=l.view.Mu(t);u.snapshot&&h.push(u.snapshot)}),(u=e.eventManager).onlineState=t,l=!1,u.queries.forEach((e,u)=>{for(let e of u.listeners)e.Mu(t)&&(l=!0)}),l&&index_esm2017_xc(u),h.length&&e.dc.nu(h),e.onlineState=t,e.isPrimaryClient&&e.sharedClientState.setOnlineState(t)}}async function index_esm2017_Jc(e,t,l){e.sharedClientState.updateQueryState(t,"rejected",l);let u=e.yc.get(t),h=u&&u.key;if(h){let l=new pe(ht.comparator);l=l.insert(h,an.newNoDocument(h,rt.min()));let u=gs().add(h),d=new mi(rt.min(),new Map,new pe(et),l,u);await index_esm2017_Wc(e,d),e.gc=e.gc.remove(h),e.yc.delete(t),index_esm2017_oa(e)}else await lu(e.localStore,t,!1).then(()=>index_esm2017_na(e,t,l)).catch(vt)}async function index_esm2017_Yc(e,t){var l;let u=t.batch.batchId;try{let h=await (l=e.localStore).persistence.runTransaction("Acknowledge batch","readwrite-primary",e=>{let u=t.batch.keys(),h=l.Zi.newChangeBuffer({trackRemovals:!0});return(function(e,t,l,u){let h=l.batch,d=h.keys(),f=Rt.resolve();return d.forEach(e=>{f=f.next(()=>u.getEntry(t,e)).next(t=>{let d=l.docVersions.get(e);null!==d||index_esm2017_O(),0>t.version.compareTo(d)&&(h.applyToRemoteDocument(t,l),t.isValidDocument()&&(t.setReadTime(l.commitVersion),u.addEntry(t)))})}),f.next(()=>e.mutationQueue.removeMutationBatch(t,h))})(l,e,t,h).next(()=>h.apply(e)).next(()=>l.mutationQueue.performConsistencyCheck(e)).next(()=>l.documentOverlayCache.removeOverlaysForBatchId(e,u,t.batch.batchId)).next(()=>l.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e,function(e){let t=gs();for(let l=0;l<e.mutationResults.length;++l)e.mutationResults[l].transformResults.length>0&&(t=t.add(e.batch.mutations[l].key));return t}(t))).next(()=>l.localDocuments.getDocuments(e,u))});index_esm2017_ea(e,u,null),index_esm2017_ta(e,u),e.sharedClientState.updateMutationState(u,"acknowledged"),await index_esm2017_ua(e,h)}catch(e){await vt(e)}}async function index_esm2017_Xc(e,t,l){var u;try{let h=await (u=e.localStore).persistence.runTransaction("Reject batch","readwrite-primary",e=>{let l;return u.mutationQueue.lookupMutationBatch(e,t).next(t=>(null!==t||index_esm2017_O(),l=t.keys(),u.mutationQueue.removeMutationBatch(e,t))).next(()=>u.mutationQueue.performConsistencyCheck(e)).next(()=>u.documentOverlayCache.removeOverlaysForBatchId(e,l,t)).next(()=>u.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e,l)).next(()=>u.localDocuments.getDocuments(e,l))});index_esm2017_ea(e,t,l),index_esm2017_ta(e,t),e.sharedClientState.updateMutationState(t,"rejected",l),await index_esm2017_ua(e,h)}catch(e){await vt(e)}}function index_esm2017_ta(e,t){(e.Ec.get(t)||[]).forEach(e=>{e.resolve()}),e.Ec.delete(t)}function index_esm2017_ea(e,t,l){let u=e.Tc[e.currentUser.toKey()];if(u){let h=u.get(t);h&&(l?h.reject(l):h.resolve(),u=u.remove(t)),e.Tc[e.currentUser.toKey()]=u}}function index_esm2017_na(e,t,l=null){for(let u of(e.sharedClientState.removeLocalQueryTarget(t),e._c.get(t)))e.wc.delete(u),l&&e.dc.Pc(u,l);e._c.delete(t),e.isPrimaryClient&&e.Ic.Is(t).forEach(t=>{e.Ic.containsKey(t)||index_esm2017_sa(e,t)})}function index_esm2017_sa(e,t){e.mc.delete(t.path.canonicalString());let l=e.gc.get(t);null!==l&&(Ju(e.remoteStore,l),e.gc=e.gc.remove(t),e.yc.delete(l),index_esm2017_oa(e))}function index_esm2017_ia(e,t,l){for(let u of l)u instanceof index_esm2017_Fc?(e.Ic.addReference(u.key,t),function(e,t){let l=t.key,u=l.path.canonicalString();e.gc.get(l)||e.mc.has(u)||(index_esm2017_N("SyncEngine","New document in limbo: "+l),e.mc.add(u),index_esm2017_oa(e))}(e,u)):u instanceof index_esm2017_Bc?(index_esm2017_N("SyncEngine","Document no longer in limbo: "+u.key),e.Ic.removeReference(u.key,t),e.Ic.containsKey(u.key)||index_esm2017_sa(e,u.key)):index_esm2017_O()}function index_esm2017_oa(e){for(;e.mc.size>0&&e.gc.size<e.maxConcurrentLimboResolutions;){let t=e.mc.values().next().value;e.mc.delete(t);let l=new ht(ut.fromString(t)),u=e.Ac.next();e.yc.set(u,new index_esm2017_Uc(l)),e.gc=e.gc.insert(l,u),Hu(e.remoteStore,new cr(Jn(Gn(l.path)),u,"TargetPurposeLimboResolution",Ot.ct))}}async function index_esm2017_ua(e,t,l){let u=[],h=[],d=[];e.wc.isEmpty()||(e.wc.forEach((f,m)=>{d.push(e.Rc(m,t,l).then(t=>{if((t||l)&&e.isPrimaryClient&&e.sharedClientState.updateQueryState(m.targetId,(null==t?void 0:t.fromCache)?"not-current":"current"),t){u.push(t);let e=tu.Li(m.targetId,t);h.push(e)}}))}),await Promise.all(d),e.dc.nu(u),await async function(e,t){try{await e.persistence.runTransaction("notifyLocalViewChanges","readwrite",l=>Rt.forEach(t,t=>Rt.forEach(t.Fi,u=>e.persistence.referenceDelegate.addReference(l,t.targetId,u)).next(()=>Rt.forEach(t.Bi,u=>e.persistence.referenceDelegate.removeReference(l,t.targetId,u)))))}catch(e){if(!Dt(e))throw e;index_esm2017_N("LocalStore","Failed to update sequence numbers: "+e)}for(let l of t){let t=l.targetId;if(!l.fromCache){let l=e.Ji.get(t),u=l.snapshotVersion,h=l.withLastLimboFreeSnapshotVersion(u);e.Ji=e.Ji.insert(t,h)}}}(e.localStore,h))}async function index_esm2017_ca(e,t){if(!e.currentUser.isEqual(t)){index_esm2017_N("SyncEngine","User change. New user:",t.toKey());let l=await iu(e.localStore,t);e.currentUser=t,e.Ec.forEach(e=>{e.forEach(e=>{e.reject(new index_esm2017_U(tb.CANCELLED,"'waitForPendingWrites' promise is rejected due to a user change."))})}),e.Ec.clear(),e.sharedClientState.handleUserChange(t,l.removedBatchIds,l.addedBatchIds),await index_esm2017_ua(e,l.er)}}function index_esm2017_aa(e,t){let l=e.yc.get(t);if(l&&l.fc)return gs().add(l.key);{let l=gs(),u=e._c.get(t);if(!u)return l;for(let t of u){let u=e.wc.get(t);l=l.unionWith(u.view.nc)}return l}}let index_esm2017_Ea=class index_esm2017_Ea{constructor(){this.synchronizeTabs=!1}async initialize(e){this.serializer=Fu(e.databaseInfo.databaseId),this.sharedClientState=this.createSharedClientState(e),this.persistence=this.createPersistence(e),await this.persistence.start(),this.localStore=this.createLocalStore(e),this.gcScheduler=this.createGarbageCollectionScheduler(e,this.localStore),this.indexBackfillerScheduler=this.createIndexBackfillerScheduler(e,this.localStore)}createGarbageCollectionScheduler(e,t){return null}createIndexBackfillerScheduler(e,t){return null}createLocalStore(e){var t,l,u,h;return t=this.persistence,l=new eu,u=e.initialUser,h=this.serializer,new nu(t,l,u,h)}createPersistence(e){return new Ko(Qo.zs,this.serializer)}createSharedClientState(e){return new bu}async terminate(){this.gcScheduler&&this.gcScheduler.stop(),await this.sharedClientState.shutdown(),await this.persistence.shutdown()}};let index_esm2017_Pa=class index_esm2017_Pa{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=e=>index_esm2017_Hc(this.syncEngine,e,1),this.remoteStore.remoteSyncer.handleCredentialChange=index_esm2017_ca.bind(null,this.syncEngine),await index_esm2017_yc(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return new index_esm2017_bc}createDatastore(e){var t,l,u;let h=Fu(e.databaseInfo.databaseId),d=(t=e.databaseInfo,new Mu(t));return l=e.authCredentials,u=e.appCheckCredentials,new Ku(l,u,d,h)}createRemoteStore(e){var t,l,u,h;return t=this.localStore,l=this.datastore,u=e.asyncQueue,h=Su.D()?new Su:new Vu,new ju(t,l,u,e=>index_esm2017_Hc(this.syncEngine,e,0),h)}createSyncEngine(e,t){return function(e,t,l,u,h,d,f){let m=new index_esm2017_Kc(e,t,l,u,h,d);return f&&(m.vc=!0),m}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}terminate(){return async function(e){index_esm2017_N("RemoteStore","RemoteStore shutting down."),e.vu.add(5),await Wu(e),e.Pu.shutdown(),e.bu.set("Unknown")}(this.remoteStore)}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let index_esm2017_Va=class index_esm2017_Va{constructor(e){this.observer=e,this.muted=!1}next(e){this.observer.next&&this.Sc(this.observer.next,e)}error(e){this.observer.error?this.Sc(this.observer.error,e):index_esm2017_k("Uncaught Error in snapshot listener:",e.toString())}Dc(){this.muted=!0}Sc(e,t){this.muted||setTimeout(()=>{this.muted||e(t)},0)}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let index_esm2017_xa=class index_esm2017_xa{constructor(e,t,l,u){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=l,this.databaseInfo=u,this.user=index_esm2017_V.UNAUTHENTICATED,this.clientId=tt.A(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this.authCredentials.start(l,async e=>{index_esm2017_N("FirestoreClient","Received user=",e.uid),await this.authCredentialListener(e),this.user=e}),this.appCheckCredentials.start(l,e=>(index_esm2017_N("FirestoreClient","Received new app check token=",e),this.appCheckCredentialListener(e,this.user)))}async getConfiguration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}verifyNotTerminated(){if(this.asyncQueue.isShuttingDown)throw new index_esm2017_U(tb.FAILED_PRECONDITION,"The client has already been terminated.")}terminate(){this.asyncQueue.enterRestrictedMode();let e=new index_esm2017_K;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(l){let t=index_esm2017_Ec(l,"Failed to shutdown persistence");e.reject(t)}}),e.promise}};async function index_esm2017_Na(e,t){e.asyncQueue.verifyOperationInProgress(),index_esm2017_N("FirestoreClient","Initializing OfflineComponentProvider");let l=await e.getConfiguration();await t.initialize(l);let u=l.initialUser;e.setCredentialChangeListener(async e=>{u.isEqual(e)||(await iu(t.localStore,e),u=e)}),t.persistence.setDatabaseDeletedListener(()=>e.terminate()),e._offlineComponents=t}async function index_esm2017_ka(e,t){e.asyncQueue.verifyOperationInProgress();let l=await index_esm2017_$a(e);index_esm2017_N("FirestoreClient","Initializing OnlineComponentProvider");let u=await e.getConfiguration();await t.initialize(l,u),e.setCredentialChangeListener(e=>index_esm2017_gc(t.remoteStore,e)),e.setAppCheckTokenChangeListener((e,l)=>index_esm2017_gc(t.remoteStore,l)),e._onlineComponents=t}async function index_esm2017_$a(e){if(!e._offlineComponents){if(e._uninitializedComponentsProvider){index_esm2017_N("FirestoreClient","Using user provided OfflineComponentProvider");try{await index_esm2017_Na(e,e._uninitializedComponentsProvider._offline)}catch(t){if(!("FirebaseError"===t.name?t.code===tb.FAILED_PRECONDITION||t.code===tb.UNIMPLEMENTED:!("undefined"!=typeof DOMException&&t instanceof DOMException)||22===t.code||20===t.code||11===t.code))throw t;index_esm2017_M("Error using user provided cache. Falling back to memory cache: "+t),await index_esm2017_Na(e,new index_esm2017_Ea)}}else index_esm2017_N("FirestoreClient","Using default OfflineComponentProvider"),await index_esm2017_Na(e,new index_esm2017_Ea)}return e._offlineComponents}async function index_esm2017_Oa(e){return e._onlineComponents||(e._uninitializedComponentsProvider?(index_esm2017_N("FirestoreClient","Using user provided OnlineComponentProvider"),await index_esm2017_ka(e,e._uninitializedComponentsProvider._online)):(index_esm2017_N("FirestoreClient","Using default OnlineComponentProvider"),await index_esm2017_ka(e,new index_esm2017_Pa))),e._onlineComponents}async function index_esm2017_Ka(e){let t=await index_esm2017_Oa(e),l=t.eventManager;return l.onListen=index_esm2017_Gc.bind(null,t.syncEngine),l.onUnlisten=index_esm2017_jc.bind(null,t.syncEngine),l}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function th(e){let t={};return void 0!==e.timeoutSeconds&&(t.timeoutSeconds=e.timeoutSeconds),t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let tF=new Map;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nh(e,t,l){if(!l)throw new index_esm2017_U(tb.INVALID_ARGUMENT,`Function ${e}() cannot be called with an empty ${t}.`)}function ih(e){if(!ht.isDocumentKey(e))throw new index_esm2017_U(tb.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${e} has ${e.length}.`)}function rh(e){if(ht.isDocumentKey(e))throw new index_esm2017_U(tb.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${e} has ${e.length}.`)}function oh(e){if(void 0===e)return"undefined";if(null===e)return"null";if("string"==typeof e)return e.length>20&&(e=`${e.substring(0,20)}...`),JSON.stringify(e);if("number"==typeof e||"boolean"==typeof e)return""+e;if("object"==typeof e){if(e instanceof Array)return"an array";{var t;let l=(t=e).constructor?t.constructor.name:null;return l?`a custom ${l} object`:"an object"}}return"function"==typeof e?"a function":index_esm2017_O()}function uh(e,t){if("_delegate"in e&&(e=e._delegate),!(e instanceof t)){if(t.name===e.constructor.name)throw new index_esm2017_U(tb.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{let l=oh(e);throw new index_esm2017_U(tb.INVALID_ARGUMENT,`Expected type '${t.name}', but it was: ${l}`)}}return e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ah=class ah{constructor(e){var t,l;if(void 0===e.host){if(void 0!==e.ssl)throw new index_esm2017_U(tb.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=null===(t=e.ssl)||void 0===t||t;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.cache=e.localCache,void 0===e.cacheSizeBytes)this.cacheSizeBytes=41943040;else{if(-1!==e.cacheSizeBytes&&e.cacheSizeBytes<1048576)throw new index_esm2017_U(tb.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}(function(e,t,l,u){if(!0===t&&!0===u)throw new index_esm2017_U(tb.INVALID_ARGUMENT,`${e} and ${l} cannot be used together.`)})("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:void 0===e.experimentalAutoDetectLongPolling?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=th(null!==(l=e.experimentalLongPollingOptions)&&void 0!==l?l:{}),function(e){if(void 0!==e.timeoutSeconds){if(isNaN(e.timeoutSeconds))throw new index_esm2017_U(tb.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (must not be NaN)`);if(e.timeoutSeconds<5)throw new index_esm2017_U(tb.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (minimum allowed value is 5)`);if(e.timeoutSeconds>30)throw new index_esm2017_U(tb.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){var t,l;return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(t=this.experimentalLongPollingOptions,l=e.experimentalLongPollingOptions,t.timeoutSeconds===l.timeoutSeconds)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}};let hh=class hh{constructor(e,t,l,u){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=l,this._app=u,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new ah({}),this._settingsFrozen=!1}get app(){if(!this._app)throw new index_esm2017_U(tb.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return void 0!==this._terminateTask}_setSettings(e){if(this._settingsFrozen)throw new index_esm2017_U(tb.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new ah(e),void 0!==e.credentials&&(this._authCredentials=function(e){if(!e)return new index_esm2017_Q;switch(e.type){case"firstParty":return new index_esm2017_H(e.sessionIndex||"0",e.iamToken||null,e.authTokenFactory||null);case"provider":return e.client;default:throw new index_esm2017_U(tb.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask||(this._terminateTask=this._terminate()),this._terminateTask}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(e){let t=tF.get(e);t&&(index_esm2017_N("ComponentProvider","Removing Datastore"),tF.delete(e),t.terminate())}(this),Promise.resolve()}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let fh=class fh{constructor(e,t,l){this.converter=t,this._key=l,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new wh(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new fh(this.firestore,e,this._key)}};let dh=class dh{constructor(e,t,l){this.converter=t,this._query=l,this.type="query",this.firestore=e}withConverter(e){return new dh(this.firestore,e,this._query)}};let wh=class wh extends dh{constructor(e,t,l){super(e,t,Gn(l)),this._path=l,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){let e=this._path.popLast();return e.isEmpty()?null:new fh(this.firestore,null,new ht(e))}withConverter(e){return new wh(this.firestore,e,this._path)}};function _h(e,t,...l){if(e=(0,L.m9)(e),nh("collection","path",t),e instanceof hh){let u=ut.fromString(t,...l);return rh(u),new wh(e,null,u)}{if(!(e instanceof fh||e instanceof wh))throw new index_esm2017_U(tb.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");let u=e._path.child(ut.fromString(t,...l));return rh(u),new wh(e.firestore,null,u)}}function gh(e,t,...l){if(e=(0,L.m9)(e),1==arguments.length&&(t=tt.A()),nh("doc","path",t),e instanceof hh){let u=ut.fromString(t,...l);return ih(u),new fh(e,null,new ht(u))}{if(!(e instanceof fh||e instanceof wh))throw new index_esm2017_U(tb.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");let u=e._path.child(ut.fromString(t,...l));return ih(u),new fh(e.firestore,e instanceof wh?e.converter:null,new ht(u))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ih=class Ih{constructor(){this.Gc=Promise.resolve(),this.Qc=[],this.jc=!1,this.zc=[],this.Wc=null,this.Hc=!1,this.Jc=!1,this.Yc=[],this.qo=new Bu(this,"async_queue_retry"),this.Xc=()=>{let e=Ou();e&&index_esm2017_N("AsyncQueue","Visibility state changed to "+e.visibilityState),this.qo.Mo()};let e=Ou();e&&"function"==typeof e.addEventListener&&e.addEventListener("visibilitychange",this.Xc)}get isShuttingDown(){return this.jc}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.Zc(),this.ta(e)}enterRestrictedMode(e){if(!this.jc){this.jc=!0,this.Jc=e||!1;let t=Ou();t&&"function"==typeof t.removeEventListener&&t.removeEventListener("visibilitychange",this.Xc)}}enqueue(e){if(this.Zc(),this.jc)return new Promise(()=>{});let t=new index_esm2017_K;return this.ta(()=>this.jc&&this.Jc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Qc.push(e),this.ea()))}async ea(){if(0!==this.Qc.length){try{await this.Qc[0](),this.Qc.shift(),this.qo.reset()}catch(e){if(!Dt(e))throw e;index_esm2017_N("AsyncQueue","Operation failed with retryable error: "+e)}this.Qc.length>0&&this.qo.No(()=>this.ea())}}ta(e){let t=this.Gc.then(()=>(this.Hc=!0,e().catch(e=>{let t;this.Wc=e,this.Hc=!1;let l=(t=e.message||"",e.stack&&(t=e.stack.includes(e.message)?e.stack:e.message+"\n"+e.stack),t);throw index_esm2017_k("INTERNAL UNHANDLED ERROR: ",l),e}).then(e=>(this.Hc=!1,e))));return this.Gc=t,t}enqueueAfterDelay(e,t,l){this.Zc(),this.Yc.indexOf(e)>-1&&(t=0);let u=index_esm2017_Tc.createAndSchedule(this,e,t,l,e=>this.na(e));return this.zc.push(u),u}Zc(){this.Wc&&index_esm2017_O()}verifyOperationInProgress(){}async sa(){let e;do e=this.Gc,await e;while(e!==this.Gc)}ia(e){for(let t of this.zc)if(t.timerId===e)return!0;return!1}ra(e){return this.sa().then(()=>{for(let t of(this.zc.sort((e,t)=>e.targetTimeMs-t.targetTimeMs),this.zc))if(t.skipDelay(),"all"!==e&&t.timerId===e)break;return this.sa()})}oa(e){this.Yc.push(e)}na(e){let t=this.zc.indexOf(e);this.zc.splice(t,1)}};function Th(e){return function(e,t){if("object"!=typeof e||null===e)return!1;for(let l of t)if(l in e&&"function"==typeof e[l])return!0;return!1}(e,["next","error","complete"])}let vh=class vh extends hh{constructor(e,t,l,u){super(e,t,l,u),this.type="firestore",this._queue=new Ih,this._persistenceKey=(null==u?void 0:u.name)||"[DEFAULT]"}_terminate(){return this._firestoreClient||Vh(this),this._firestoreClient.terminate()}};function Ph(e,t){let l="object"==typeof e?e:(0,b.Mq)(),u=(0,b.qX)(l,"firestore").getImmediate({identifier:"string"==typeof e?e:t||"(default)"});if(!u._initialized){let e=(0,L.P0)("firestore");e&&function(e,t,l,u={}){var h;let d=(e=uh(e,hh))._getSettings(),f=`${t}:${l}`;if("firestore.googleapis.com"!==d.host&&d.host!==f&&index_esm2017_M("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),e._setSettings(Object.assign(Object.assign({},d),{host:f,ssl:!1})),u.mockUserToken){let t,l;if("string"==typeof u.mockUserToken)t=u.mockUserToken,l=index_esm2017_V.MOCK_USER;else{t=(0,L.Sg)(u.mockUserToken,null===(h=e._app)||void 0===h?void 0:h.options.projectId);let d=u.mockUserToken.sub||u.mockUserToken.user_id;if(!d)throw new index_esm2017_U(tb.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");l=new index_esm2017_V(d)}e._authCredentials=new j(new index_esm2017_G(t,l))}}(u,...e)}return u}function bh(e){return e._firestoreClient||Vh(e),e._firestoreClient.verifyNotTerminated(),e._firestoreClient}function Vh(e){var t,l,u,h,d,f;let m=e._freezeSettings(),g=(h=e._databaseId,d=(null===(t=e._app)||void 0===t?void 0:t.options.appId)||"",f=e._persistenceKey,new $e(h,d,f,m.host,m.ssl,m.experimentalForceLongPolling,m.experimentalAutoDetectLongPolling,th(m.experimentalLongPollingOptions),m.useFetchStreams));e._firestoreClient=new index_esm2017_xa(e._authCredentials,e._appCheckCredentials,e._queue,g),(null===(l=m.cache)||void 0===l?void 0:l._offlineComponentProvider)&&(null===(u=m.cache)||void 0===u?void 0:u._onlineComponentProvider)&&(e._firestoreClient._uninitializedComponentsProvider={_offlineKind:m.cache.kind,_offline:m.cache._offlineComponentProvider,_online:m.cache._onlineComponentProvider})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Uh=class Uh{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Uh(Ve.fromBase64String(e))}catch(e){throw new index_esm2017_U(tb.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+e)}}static fromUint8Array(e){return new Uh(Ve.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Kh=class Kh{constructor(...e){for(let t=0;t<e.length;++t)if(0===e[t].length)throw new index_esm2017_U(tb.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new at(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Qh=class Qh{constructor(e){this._methodName=e}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let jh=class jh{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new index_esm2017_U(tb.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new index_esm2017_U(tb.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return et(this._lat,e._lat)||et(this._long,e._long)}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let tV=/^__.*__$/;let Wh=class Wh{constructor(e,t,l){this.data=e,this.fieldMask=t,this.fieldTransforms=l}toMutation(e,t){return null!==this.fieldMask?new zs(e,this.data,this.fieldMask,t,this.fieldTransforms):new js(e,this.data,t,this.fieldTransforms)}};let Hh=class Hh{constructor(e,t,l){this.data=e,this.fieldMask=t,this.fieldTransforms=l}toMutation(e,t){return new zs(e,this.data,this.fieldMask,t,this.fieldTransforms)}};function Jh(e){switch(e){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw index_esm2017_O()}}let Yh=class Yh{constructor(e,t,l,u,h,d){this.settings=e,this.databaseId=t,this.serializer=l,this.ignoreUndefinedProperties=u,void 0===h&&this.ua(),this.fieldTransforms=h||[],this.fieldMask=d||[]}get path(){return this.settings.path}get ca(){return this.settings.ca}aa(e){return new Yh(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}ha(e){var t;let l=null===(t=this.path)||void 0===t?void 0:t.child(e),u=this.aa({path:l,la:!1});return u.fa(e),u}da(e){var t;let l=null===(t=this.path)||void 0===t?void 0:t.child(e),u=this.aa({path:l,la:!1});return u.ua(),u}wa(e){return this.aa({path:void 0,la:!0})}_a(e){return gl(e,this.settings.methodName,this.settings.ma||!1,this.path,this.settings.ga)}contains(e){return void 0!==this.fieldMask.find(t=>e.isPrefixOf(t))||void 0!==this.fieldTransforms.find(t=>e.isPrefixOf(t.field))}ua(){if(this.path)for(let e=0;e<this.path.length;e++)this.fa(this.path.get(e))}fa(e){if(0===e.length)throw this._a("Document fields must not be empty");if(Jh(this.ca)&&tV.test(e))throw this._a('Document fields cannot begin and end with "__"')}};let Xh=class Xh{constructor(e,t,l){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=l||Fu(e)}ya(e,t,l,u=!1){return new Yh({ca:e,methodName:t,ga:l,path:at.emptyPath(),la:!1,ma:u},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}};function Zh(e){let t=e._freezeSettings(),l=Fu(e._databaseId);return new Xh(e._databaseId,!!t.ignoreUndefinedProperties,l)}function tl(e,t,l,u,h,d={}){let f,m;let g=e.ya(d.merge||d.mergeFields?2:0,t,l,h);dl("Data must be an object, but it was:",g,u);let _=ll(u,g);if(d.merge)f=new Re(g.fieldMask),m=g.fieldTransforms;else if(d.mergeFields){let e=[];for(let u of d.mergeFields){let h=wl(t,u,l);if(!g.contains(h))throw new index_esm2017_U(tb.INVALID_ARGUMENT,`Field '${h}' is specified in your field mask but missing from your input data.`);yl(e,h)||e.push(h)}f=new Re(e),m=g.fieldTransforms.filter(e=>f.covers(e.field))}else f=null,m=g.fieldTransforms;return new Wh(new un(_),f,m)}let el=class el extends Qh{_toFieldTransform(e){if(2!==e.ca)throw 1===e.ca?e._a(`${this._methodName}() can only appear at the top level of your update data`):e._a(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof el}};let sl=class sl extends Qh{_toFieldTransform(e){return new Ms(e.path,new bs)}isEqual(e){return e instanceof sl}};let ol=class ol extends Qh{constructor(e,t){super(e),this.Ia=t}_toFieldTransform(e){let t=new xs(e.serializer,Es(e.serializer,this.Ia));return new Ms(e.path,t)}isEqual(e){return this===e}};function hl(e,t){if(fl(e=(0,L.m9)(e)))return dl("Unsupported field value:",t,e),ll(e,t);if(e instanceof Qh)return function(e,t){if(!Jh(t.ca))throw t._a(`${e._methodName}() can only be used with update() and set()`);if(!t.path)throw t._a(`${e._methodName}() is not currently supported inside arrays`);let l=e._toFieldTransform(t);l&&t.fieldTransforms.push(l)}(e,t),null;if(void 0===e&&t.ignoreUndefinedProperties)return null;if(t.path&&t.fieldMask.push(t.path),e instanceof Array){if(t.settings.la&&4!==t.ca)throw t._a("Nested arrays are not supported");return function(e,t){let l=[],u=0;for(let h of e){let e=hl(h,t.wa(u));null==e&&(e={nullValue:"NULL_VALUE"}),l.push(e),u++}return{arrayValue:{values:l}}}(e,t)}return function(e,t){if(null===(e=(0,L.m9)(e)))return{nullValue:"NULL_VALUE"};if("number"==typeof e)return Es(t.serializer,e);if("boolean"==typeof e)return{booleanValue:e};if("string"==typeof e)return{stringValue:e};if(e instanceof Date){let l=it.fromDate(e);return{timestampValue:Di(t.serializer,l)}}if(e instanceof it){let l=new it(e.seconds,1e3*Math.floor(e.nanoseconds/1e3));return{timestampValue:Di(t.serializer,l)}}if(e instanceof jh)return{geoPointValue:{latitude:e.latitude,longitude:e.longitude}};if(e instanceof Uh)return{bytesValue:Ci(t.serializer,e._byteString)};if(e instanceof fh){let l=t.databaseId,u=e.firestore._databaseId;if(!u.isEqual(l))throw t._a(`Document reference is for database ${u.projectId}/${u.database} but should be for database ${l.projectId}/${l.database}`);return{referenceValue:ki(e.firestore._databaseId||t.databaseId,e._key.path)}}throw t._a(`Unsupported field value: ${oh(e)}`)}(e,t)}function ll(e,t){let l={};return ye(e)?t.path&&t.path.length>0&&t.fieldMask.push(t.path):ge(e,(e,u)=>{let h=hl(u,t.ha(e));null!=h&&(l[e]=h)}),{mapValue:{fields:l}}}function fl(e){return!("object"!=typeof e||null===e||e instanceof Array||e instanceof Date||e instanceof it||e instanceof jh||e instanceof Uh||e instanceof fh||e instanceof Qh)}function dl(e,t,l){if(!fl(l)||!("object"==typeof l&&null!==l&&(Object.getPrototypeOf(l)===Object.prototype||null===Object.getPrototypeOf(l)))){let u=oh(l);throw"an object"===u?t._a(e+" a custom object"):t._a(e+" "+u)}}function wl(e,t,l){if((t=(0,L.m9)(t))instanceof Kh)return t._internalPath;if("string"==typeof t)return ml(e,t);throw gl("Field path arguments must be of type string or ",e,!1,void 0,l)}let tB=RegExp("[~\\*/\\[\\]]");function ml(e,t,l){if(t.search(tB)>=0)throw gl(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,e,!1,void 0,l);try{return new Kh(...t.split("."))._internalPath}catch(u){throw gl(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,e,!1,void 0,l)}}function gl(e,t,l,u,h){let d=u&&!u.isEmpty(),f=void 0!==h,m=`Function ${t}() called with invalid data`;l&&(m+=" (via `toFirestore()`)"),m+=". ";let g="";return(d||f)&&(g+=" (found",d&&(g+=` in field ${u}`),f&&(g+=` in document ${h}`),g+=")"),new index_esm2017_U(tb.INVALID_ARGUMENT,m+e+g)}function yl(e,t){return e.some(e=>e.isEqual(t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let pl=class pl{constructor(e,t,l,u,h){this._firestore=e,this._userDataWriter=t,this._key=l,this._document=u,this._converter=h}get id(){return this._key.path.lastSegment()}get ref(){return new fh(this._firestore,this._converter,this._key)}exists(){return null!==this._document}data(){if(this._document){if(this._converter){let e=new Il(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){let t=this._document.data.field(Tl("DocumentSnapshot.get",e));if(null!==t)return this._userDataWriter.convertValue(t)}}};let Il=class Il extends pl{data(){return super.data()}};function Tl(e,t){return"string"==typeof t?ml(e,t):t instanceof Kh?t._internalPath:t._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function El(e){if("L"===e.limitType&&0===e.explicitOrderBy.length)throw new index_esm2017_U(tb.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}let Al=class Al{};let vl=class vl extends Al{};function Rl(e,t,...l){let u=[];for(let h of(t instanceof Al&&u.push(t),function(e){let t=e.filter(e=>e instanceof Vl).length,l=e.filter(e=>e instanceof Pl).length;if(t>1||t>0&&l>0)throw new index_esm2017_U(tb.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(u=u.concat(l)),u))e=h._apply(e);return e}let Pl=class Pl extends vl{constructor(e,t,l){super(),this._field=e,this._op=t,this._value=l,this.type="where"}static _create(e,t,l){return new Pl(e,t,l)}_apply(e){let t=this._parse(e);return Ql(e._query,t),new dh(e.firestore,e.converter,Yn(e._query,t))}_parse(e){let t=Zh(e.firestore),l=function(e,t,l,u,h,d,f){let m;if(h.isKeyField()){if("array-contains"===d||"array-contains-any"===d)throw new index_esm2017_U(tb.INVALID_ARGUMENT,`Invalid Query. You can't perform '${d}' queries on documentId().`);if("in"===d||"not-in"===d){Gl(f,d);let t=[];for(let l of f)t.push(Kl(u,e,l));m={arrayValue:{values:t}}}else m=Kl(u,e,f)}else"in"!==d&&"not-in"!==d&&"array-contains-any"!==d||Gl(f,d),m=function(e,t,l,u=!1){return hl(l,e.ya(u?4:3,t))}(l,t,f,"in"===d||"not-in"===d);return mn.create(h,d,m)}(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value);return l}};function bl(e,t,l){let u=Tl("where",e);return Pl._create(u,t,l)}let Vl=class Vl extends Al{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new Vl(e,t)}_parse(e){let t=this._queryConstraints.map(t=>t._parse(e)).filter(e=>e.getFilters().length>0);return 1===t.length?t[0]:gn.create(t,this._getOperator())}_apply(e){let t=this._parse(e);return 0===t.getFilters().length?e:(function(e,t){let l=e,u=t.getFlattenedFilters();for(let e of u)Ql(l,e),l=Yn(l,e)}(e._query,t),new dh(e.firestore,e.converter,Yn(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return"and"===this.type?"and":"or"}};let Cl=class Cl extends vl{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new Cl(e,t)}_apply(e){let t=function(e,t,l){if(null!==e.startAt)throw new index_esm2017_U(tb.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(null!==e.endAt)throw new index_esm2017_U(tb.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");let u=new dn(t,l);return function(e,t){if(null===jn(e)){let l=zn(e);null!==l&&jl(e,l,t.field)}}(e,u),u}(e._query,this._field,this._direction);return new dh(e.firestore,e.converter,function(e,t){let l=e.explicitOrderBy.concat([t]);return new Un(e.path,e.collectionGroup,l,e.filters.slice(),e.limit,e.limitType,e.startAt,e.endAt)}(e._query,t))}};function xl(e,t="asc"){let l=Tl("orderBy",e);return Cl._create(l,t)}let Nl=class Nl extends vl{constructor(e,t,l){super(),this.type=e,this._limit=t,this._limitType=l}static _create(e,t,l){return new Nl(e,t,l)}_apply(e){return new dh(e.firestore,e.converter,Xn(e._query,this._limit,this._limitType))}};function kl(e){return function(e,t){if(t<=0)throw new index_esm2017_U(tb.INVALID_ARGUMENT,`Function ${e}() requires a positive number, but it was: ${t}.`)}("limit",e),Nl._create("limit",e,"F")}function Kl(e,t,l){if("string"==typeof(l=(0,L.m9)(l))){if(""===l)throw new index_esm2017_U(tb.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Wn(t)&&-1!==l.indexOf("/"))throw new index_esm2017_U(tb.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${l}' contains a '/' character.`);let u=t.path.child(ut.fromString(l));if(!ht.isDocumentKey(u))throw new index_esm2017_U(tb.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${u}' is not because it has an odd number of segments (${u.length}).`);return We(e,new ht(u))}if(l instanceof fh)return We(e,l._key);throw new index_esm2017_U(tb.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${oh(l)}.`)}function Gl(e,t){if(!Array.isArray(e)||0===e.length)throw new index_esm2017_U(tb.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${t.toString()}' filters.`)}function Ql(e,t){if(t.isInequality()){let l=zn(e),u=t.field;if(null!==l&&!l.isEqual(u))throw new index_esm2017_U(tb.INVALID_ARGUMENT,`Invalid query. All where filters with an inequality (<, <=, !=, not-in, >, or >=) must be on the same field. But you have inequality filters on '${l.toString()}' and '${u.toString()}'`);let h=jn(e);null!==h&&jl(e,u,h)}let l=function(e,t){for(let l of e)for(let e of l.getFlattenedFilters())if(t.indexOf(e.op)>=0)return e.op;return null}(e.filters,function(e){switch(e){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(t.op));if(null!==l)throw l===t.op?new index_esm2017_U(tb.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${t.op.toString()}' filter.`):new index_esm2017_U(tb.INVALID_ARGUMENT,`Invalid query. You cannot use '${t.op.toString()}' filters with '${l.toString()}' filters.`)}function jl(e,t,l){if(!l.isEqual(t))throw new index_esm2017_U(tb.INVALID_ARGUMENT,`Invalid query. You have a where filter with an inequality (<, <=, !=, not-in, >, or >=) on field '${t.toString()}' and so you must also use '${t.toString()}' as your first argument to orderBy(), but your first orderBy() is on field '${l.toString()}' instead.`)}let Wl=class Wl{convertValue(e,t="none"){switch(Le(e)){case 0:return null;case 1:return e.booleanValue;case 2:return Ce(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(xe(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 10:return this.convertObject(e.mapValue,t);default:throw index_esm2017_O()}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){let l={};return ge(e,(e,u)=>{l[e]=this.convertValue(u,t)}),l}convertGeoPoint(e){return new jh(Ce(e.latitude),Ce(e.longitude))}convertArray(e,t){return(e.values||[]).map(e=>this.convertValue(e,t))}convertServerTimestamp(e,t){switch(t){case"previous":let l=ke(e);return null==l?null:this.convertValue(l,t);case"estimate":return this.convertTimestamp(Me(e));default:return null}}convertTimestamp(e){let t=De(e);return new it(t.seconds,t.nanos)}convertDocumentKey(e,t){let l=ut.fromString(e);ur(l)||index_esm2017_O();let u=new Oe(l.get(1),l.get(3)),h=new ht(l.popFirst(5));return u.isEqual(t)||index_esm2017_k(`Document ${h} contains a document reference within a different database (${u.projectId}/${u.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),h}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hl(e,t,l){return e?l&&(l.merge||l.mergeFields)?e.toFirestore(t,l):e.toFirestore(t):t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let nf=class nf{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}};let sf=class sf extends pl{constructor(e,t,l,u,h,d){super(e,t,l,u,d),this._firestore=e,this._firestoreImpl=e,this.metadata=h}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){let t=new rf(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){let l=this._document.data.field(Tl("DocumentSnapshot.get",e));if(null!==l)return this._userDataWriter.convertValue(l,t.serverTimestamps)}}};let rf=class rf extends sf{data(e={}){return super.data(e)}};let of=class of{constructor(e,t,l,u){this._firestore=e,this._userDataWriter=t,this._snapshot=u,this.metadata=new nf(u.hasPendingWrites,u.fromCache),this.query=l}get docs(){let e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return 0===this.size}forEach(e,t){this._snapshot.docs.forEach(l=>{e.call(t,new rf(this._firestore,this._userDataWriter,l.key,l,new nf(this._snapshot.mutatedKeys.has(l.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){let t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new index_esm2017_U(tb.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(e,t){if(e._snapshot.oldDocs.isEmpty()){let t=0;return e._snapshot.docChanges.map(l=>{let u=new rf(e._firestore,e._userDataWriter,l.doc.key,l.doc,new nf(e._snapshot.mutatedKeys.has(l.doc.key),e._snapshot.fromCache),e.query.converter);return l.doc,{type:"added",doc:u,oldIndex:-1,newIndex:t++}})}{let l=e._snapshot.oldDocs;return e._snapshot.docChanges.filter(e=>t||3!==e.type).map(t=>{let u=new rf(e._firestore,e._userDataWriter,t.doc.key,t.doc,new nf(e._snapshot.mutatedKeys.has(t.doc.key),e._snapshot.fromCache),e.query.converter),h=-1,d=-1;return 0!==t.type&&(h=l.indexOf(t.doc.key),l=l.delete(t.doc.key)),1!==t.type&&(d=(l=l.add(t.doc)).indexOf(t.doc.key)),{type:function(e){switch(e){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return index_esm2017_O()}}(t.type),doc:u,oldIndex:h,newIndex:d}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function af(e){e=uh(e,fh);let t=uh(e.firestore,vh);return(function(e,t,l={}){let u=new index_esm2017_K;return e.asyncQueue.enqueueAndForget(async()=>(function(e,t,l,u,h){let d=new index_esm2017_Va({next:d=>{t.enqueueAndForget(()=>index_esm2017_Sc(e,f));let m=d.docs.has(l);!m&&d.fromCache?h.reject(new index_esm2017_U(tb.UNAVAILABLE,"Failed to get document because the client is offline.")):m&&d.fromCache&&u&&"server"===u.source?h.reject(new index_esm2017_U(tb.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):h.resolve(d)},error:e=>h.reject(e)}),f=new index_esm2017_Nc(Gn(l.path),d,{includeMetadataChanges:!0,Ku:!0});return index_esm2017_Vc(e,f)})(await index_esm2017_Ka(e),e.asyncQueue,t,l,u)),u.promise})(bh(t),e._key).then(l=>Af(t,e,l))}let hf=class hf extends Wl{constructor(e){super(),this.firestore=e}convertBytes(e){return new Uh(e)}convertReference(e){let t=this.convertDocumentKey(e,this.firestore._databaseId);return new fh(this.firestore,null,t)}};function df(e){e=uh(e,dh);let t=uh(e.firestore,vh),l=bh(t),u=new hf(t);return El(e._query),(function(e,t,l={}){let u=new index_esm2017_K;return e.asyncQueue.enqueueAndForget(async()=>(function(e,t,l,u,h){let d=new index_esm2017_Va({next:l=>{t.enqueueAndForget(()=>index_esm2017_Sc(e,f)),l.fromCache&&"server"===u.source?h.reject(new index_esm2017_U(tb.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):h.resolve(l)},error:e=>h.reject(e)}),f=new index_esm2017_Nc(l,d,{includeMetadataChanges:!0,Ku:!0});return index_esm2017_Vc(e,f)})(await index_esm2017_Ka(e),e.asyncQueue,t,l,u)),u.promise})(l,e._query).then(l=>new of(t,u,e,l))}function mf(e,t,l){e=uh(e,fh);let u=uh(e.firestore,vh),h=Hl(e.converter,t,l);return Ef(u,[tl(Zh(u),"setDoc",e._key,h,null!==e.converter,l).toMutation(e._key,Fs.none())])}function gf(e,t,l,...u){e=uh(e,fh);let h=uh(e.firestore,vh),d=Zh(h);return Ef(h,[("string"==typeof(t=(0,L.m9)(t))||t instanceof Kh?function(e,t,l,u,h,d){let f=e.ya(1,t,l),m=[wl(t,u,l)],g=[h];if(d.length%2!=0)throw new index_esm2017_U(tb.INVALID_ARGUMENT,`Function ${t}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let e=0;e<d.length;e+=2)m.push(wl(t,d[e])),g.push(d[e+1]);let _=[],b=un.empty();for(let e=m.length-1;e>=0;--e)if(!yl(_,m[e])){let t=m[e],l=g[e];l=(0,L.m9)(l);let u=f.da(t);if(l instanceof el)_.push(t);else{let e=hl(l,u);null!=e&&(_.push(t),b.set(t,e))}}let E=new Re(_);return new Hh(b,E,f.fieldTransforms)}(d,"updateDoc",e._key,t,l,u):function(e,t,l,u){let h=e.ya(1,t,l);dl("Data must be an object, but it was:",h,u);let d=[],f=un.empty();ge(u,(e,u)=>{let m=ml(t,e,l);u=(0,L.m9)(u);let g=h.da(m);if(u instanceof el)d.push(m);else{let e=hl(u,g);null!=e&&(d.push(m),f.set(m,e))}});let m=new Re(d);return new Hh(f,m,h.fieldTransforms)}(d,"updateDoc",e._key,t)).toMutation(e._key,Fs.exists(!0))])}function yf(e){return Ef(uh(e.firestore,vh),[new Ys(e._key,Fs.none())])}function pf(e,t){let l=uh(e.firestore,vh),u=gh(e),h=Hl(e.converter,t);return Ef(l,[tl(Zh(e.firestore),"addDoc",u._key,h,null!==e.converter,{}).toMutation(u._key,Fs.exists(!1))]).then(()=>u)}function If(e,...t){var l,u,h;let d,f,m;e=(0,L.m9)(e);let g={includeMetadataChanges:!1},_=0;"object"!=typeof t[0]||Th(t[_])||(g=t[_],_++);let b={includeMetadataChanges:g.includeMetadataChanges};if(Th(t[_])){let e=t[_];t[_]=null===(l=e.next)||void 0===l?void 0:l.bind(e),t[_+1]=null===(u=e.error)||void 0===u?void 0:u.bind(e),t[_+2]=null===(h=e.complete)||void 0===h?void 0:h.bind(e)}if(e instanceof fh)f=uh(e.firestore,vh),m=Gn(e._key.path),d={next:l=>{t[_]&&t[_](Af(f,e,l))},error:t[_+1],complete:t[_+2]};else{let l=uh(e,dh);f=uh(l.firestore,vh),m=l._query;let u=new hf(f);d={next:e=>{t[_]&&t[_](new of(f,u,l,e))},error:t[_+1],complete:t[_+2]},El(e._query)}return function(e,t,l,u){let h=new index_esm2017_Va(u),d=new index_esm2017_Nc(t,h,l);return e.asyncQueue.enqueueAndForget(async()=>index_esm2017_Vc(await index_esm2017_Ka(e),d)),()=>{h.Dc(),e.asyncQueue.enqueueAndForget(async()=>index_esm2017_Sc(await index_esm2017_Ka(e),d))}}(bh(f),m,b,d)}function Ef(e,t){return function(e,t){let l=new index_esm2017_K;return e.asyncQueue.enqueueAndForget(async()=>index_esm2017_zc(await index_esm2017_Oa(e).then(e=>e.syncEngine),t,l)),l.promise}(bh(e),t)}function Af(e,t,l){let u=l.docs.get(t._key),h=new hf(e);return new sf(e,h,t._key,u,new nf(l.hasPendingWrites,l.fromCache),t.converter)}function Gf(){return new sl("serverTimestamp")}function zf(e){return new ol("increment",e)}!function(e,t=!0){tv=b.Jn,(0,b.Xd)(new E.wA("firestore",(e,{instanceIdentifier:l,options:u})=>{let h=e.getProvider("app").getImmediate(),d=new vh(new index_esm2017_z(e.getProvider("auth-internal")),new index_esm2017_Y(e.getProvider("app-check-internal")),function(e,t){if(!Object.prototype.hasOwnProperty.apply(e.options,["projectId"]))throw new index_esm2017_U(tb.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Oe(e.options.projectId,t)}(h,l),h);return u=Object.assign({useFetchStreams:t},u),d._setSettings(u),d},"PUBLIC").setMultipleInstances(!0)),(0,b.KN)(ty,"3.13.0",void 0),(0,b.KN)(ty,"3.13.0","esm2017")}()}},function(e){var __webpack_exec__=function(t){return e(e.s=t)};e.O(0,[774,179],function(){return __webpack_exec__(6840),__webpack_exec__(9974)}),_N_E=e.O()}]);