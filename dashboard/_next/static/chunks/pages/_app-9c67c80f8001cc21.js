(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[888],{3454:function(e,t,i){"use strict";var l,h;e.exports=(null==(l=i.g.process)?void 0:l.env)&&"object"==typeof(null==(h=i.g.process)?void 0:h.env)?i.g.process:i(7663)},6840:function(e,t,i){(window.__NEXT_P=window.__NEXT_P||[]).push(["/_app",function(){return i(4807)}])},866:function(e,t,i){"use strict";let l,h;i.d(t,{H:function(){return AuthProvider},a:function(){return useAuth}});var u,d,f,g,m,_,b=i(5893),E=i(7294),k=i(3454);/**
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
 */let stringToByteArray$1=function(e){let t=[],i=0;for(let l=0;l<e.length;l++){let h=e.charCodeAt(l);h<128?t[i++]=h:(h<2048?t[i++]=h>>6|192:((64512&h)==55296&&l+1<e.length&&(64512&e.charCodeAt(l+1))==56320?(h=65536+((1023&h)<<10)+(1023&e.charCodeAt(++l)),t[i++]=h>>18|240,t[i++]=h>>12&63|128):t[i++]=h>>12|224,t[i++]=h>>6&63|128),t[i++]=63&h|128)}return t},byteArrayToString=function(e){let t=[],i=0,l=0;for(;i<e.length;){let h=e[i++];if(h<128)t[l++]=String.fromCharCode(h);else if(h>191&&h<224){let u=e[i++];t[l++]=String.fromCharCode((31&h)<<6|63&u)}else if(h>239&&h<365){let u=e[i++],d=e[i++],f=e[i++],g=((7&h)<<18|(63&u)<<12|(63&d)<<6|63&f)-65536;t[l++]=String.fromCharCode(55296+(g>>10)),t[l++]=String.fromCharCode(56320+(1023&g))}else{let u=e[i++],d=e[i++];t[l++]=String.fromCharCode((15&h)<<12|(63&u)<<6|63&d)}}return t.join("")},L={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:"function"==typeof atob,encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();let i=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,l=[];for(let t=0;t<e.length;t+=3){let h=e[t],u=t+1<e.length,d=u?e[t+1]:0,f=t+2<e.length,g=f?e[t+2]:0,m=h>>2,_=(3&h)<<4|d>>4,b=(15&d)<<2|g>>6,E=63&g;f||(E=64,u||(b=64)),l.push(i[m],i[_],i[b],i[E])}return l.join("")},encodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(e):this.encodeByteArray(stringToByteArray$1(e),t)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):byteArrayToString(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();let i=t?this.charToByteMapWebSafe_:this.charToByteMap_,l=[];for(let t=0;t<e.length;){let h=i[e.charAt(t++)],u=t<e.length,d=u?i[e.charAt(t)]:0;++t;let f=t<e.length,g=f?i[e.charAt(t)]:64;++t;let m=t<e.length,_=m?i[e.charAt(t)]:64;if(++t,null==h||null==d||null==g||null==_)throw new DecodeBase64StringError;let b=h<<2|d>>4;if(l.push(b),64!==g){let e=d<<4&240|g>>2;if(l.push(e),64!==_){let e=g<<6&192|_;l.push(e)}}}return l},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}};let DecodeBase64StringError=class DecodeBase64StringError extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}};let base64Encode=function(e){let t=stringToByteArray$1(e);return L.encodeByteArray(t,!0)},base64urlEncodeWithoutPadding=function(e){return base64Encode(e).replace(/\./g,"")},base64Decode=function(e){try{return L.decodeString(e,!0)}catch(e){console.error("base64Decode failed: ",e)}return null},getDefaultsFromGlobal=()=>/**
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
 */(function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if(void 0!==i.g)return i.g;throw Error("Unable to locate global object.")})().__FIREBASE_DEFAULTS__,getDefaultsFromEnvVariable=()=>{if(void 0===k||void 0===k.env)return;let e=k.env.__FIREBASE_DEFAULTS__;if(e)return JSON.parse(e)},getDefaultsFromCookie=()=>{let e;if("undefined"==typeof document)return;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch(e){return}let t=e&&base64Decode(e[1]);return t&&JSON.parse(t)},getDefaults=()=>{try{return getDefaultsFromGlobal()||getDefaultsFromEnvVariable()||getDefaultsFromCookie()}catch(e){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);return}},getDefaultEmulatorHost=e=>{var t,i;return null===(i=null===(t=getDefaults())||void 0===t?void 0:t.emulatorHosts)||void 0===i?void 0:i[e]},getDefaultEmulatorHostnameAndPort=e=>{let t=getDefaultEmulatorHost(e);if(!t)return;let i=t.lastIndexOf(":");if(i<=0||i+1===t.length)throw Error(`Invalid host ${t} with no separate hostname and port!`);let l=parseInt(t.substring(i+1),10);return"["===t[0]?[t.substring(1,i-1),l]:[t.substring(0,i),l]},getDefaultAppConfig=()=>{var e;return null===(e=getDefaults())||void 0===e?void 0:e.config},getExperimentalSetting=e=>{var t;return null===(t=getDefaults())||void 0===t?void 0:t[`_${e}`]};/**
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
 */let Deferred=class Deferred{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,i)=>{t?this.reject(t):this.resolve(i),"function"==typeof e&&(this.promise.catch(()=>{}),1===e.length?e(t):e(t,i))}}};/**
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
 */function index_esm2017_getUA(){return"undefined"!=typeof navigator&&"string"==typeof navigator.userAgent?navigator.userAgent:""}let FirebaseError=class FirebaseError extends Error{constructor(e,t,i){super(t),this.code=e,this.customData=i,this.name="FirebaseError",Object.setPrototypeOf(this,FirebaseError.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,ErrorFactory.prototype.create)}};let ErrorFactory=class ErrorFactory{constructor(e,t,i){this.service=e,this.serviceName=t,this.errors=i}create(e,...t){let i=t[0]||{},l=`${this.service}/${e}`,h=this.errors[e],u=h?h.replace(V,(e,t)=>{let l=i[t];return null!=l?String(l):`<${t}?>`}):"Error",d=`${this.serviceName}: ${u} (${l}).`,f=new FirebaseError(l,d,i);return f}};let V=/\{\$([^}]+)}/g;function index_esm2017_deepEqual(e,t){if(e===t)return!0;let i=Object.keys(e),l=Object.keys(t);for(let h of i){if(!l.includes(h))return!1;let i=e[h],u=t[h];if(isObject(i)&&isObject(u)){if(!index_esm2017_deepEqual(i,u))return!1}else if(i!==u)return!1}for(let e of l)if(!i.includes(e))return!1;return!0}function isObject(e){return null!==e&&"object"==typeof e}/**
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
 */function index_esm2017_querystring(e){let t=[];for(let[i,l]of Object.entries(e))Array.isArray(l)?l.forEach(e=>{t.push(encodeURIComponent(i)+"="+encodeURIComponent(e))}):t.push(encodeURIComponent(i)+"="+encodeURIComponent(l));return t.length?"&"+t.join("&"):""}function querystringDecode(e){let t={},i=e.replace(/^\?/,"").split("&");return i.forEach(e=>{if(e){let[i,l]=e.split("=");t[decodeURIComponent(i)]=decodeURIComponent(l)}}),t}function extractQuerystring(e){let t=e.indexOf("?");if(!t)return"";let i=e.indexOf("#",t);return e.substring(t,i>0?i:void 0)}let ObserverProxy=class ObserverProxy{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(e=>{this.error(e)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,i){let l;if(void 0===e&&void 0===t&&void 0===i)throw Error("Missing Observer.");void 0===(l=!function(e,t){if("object"!=typeof e||null===e)return!1;for(let i of t)if(i in e&&"function"==typeof e[i])return!0;return!1}(e,["next","error","complete"])?{next:e,error:t,complete:i}:e).next&&(l.next=noop),void 0===l.error&&(l.error=noop),void 0===l.complete&&(l.complete=noop);let h=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?l.error(this.finalError):l.complete()}catch(e){}}),this.observers.push(l),h}unsubscribeOne(e){void 0!==this.observers&&void 0!==this.observers[e]&&(delete this.observers[e],this.observerCount-=1,0===this.observerCount&&void 0!==this.onNoObservers&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(void 0!==this.observers&&void 0!==this.observers[e])try{t(this.observers[e])}catch(e){"undefined"!=typeof console&&console.error&&console.error(e)}})}close(e){this.finalized||(this.finalized=!0,void 0!==e&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}};function noop(){}/**
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
 */function index_esm2017_getModularInstance(e){return e&&e._delegate?e._delegate:e}let Component=class Component{constructor(e,t,i){this.name=e,this.instanceFactory=t,this.type=i,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}};/**
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
 */let z="[DEFAULT]";/**
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
 */let Provider=class Provider{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){let t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){let e=new Deferred;if(this.instancesDeferred.set(t,e),this.isInitialized(t)||this.shouldAutoInitialize())try{let i=this.getOrInitializeService({instanceIdentifier:t});i&&e.resolve(i)}catch(e){}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;let i=this.normalizeInstanceIdentifier(null==e?void 0:e.identifier),l=null!==(t=null==e?void 0:e.optional)&&void 0!==t&&t;if(this.isInitialized(i)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:i})}catch(e){if(l)return null;throw e}else{if(l)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,this.shouldAutoInitialize()){if("EAGER"===e.instantiationMode)try{this.getOrInitializeService({instanceIdentifier:z})}catch(e){}for(let[e,t]of this.instancesDeferred.entries()){let i=this.normalizeInstanceIdentifier(e);try{let e=this.getOrInitializeService({instanceIdentifier:i});t.resolve(e)}catch(e){}}}}clearInstance(e=z){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){let e=Array.from(this.instances.values());await Promise.all([...e.filter(e=>"INTERNAL"in e).map(e=>e.INTERNAL.delete()),...e.filter(e=>"_delete"in e).map(e=>e._delete())])}isComponentSet(){return null!=this.component}isInitialized(e=z){return this.instances.has(e)}getOptions(e=z){return this.instancesOptions.get(e)||{}}initialize(e={}){let{options:t={}}=e,i=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(i))throw Error(`${this.name}(${i}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);let l=this.getOrInitializeService({instanceIdentifier:i,options:t});for(let[e,t]of this.instancesDeferred.entries()){let h=this.normalizeInstanceIdentifier(e);i===h&&t.resolve(l)}return l}onInit(e,t){var i;let l=this.normalizeInstanceIdentifier(t),h=null!==(i=this.onInitCallbacks.get(l))&&void 0!==i?i:new Set;h.add(e),this.onInitCallbacks.set(l,h);let u=this.instances.get(l);return u&&e(u,l),()=>{h.delete(e)}}invokeOnInitCallbacks(e,t){let i=this.onInitCallbacks.get(t);if(i)for(let l of i)try{l(e,t)}catch(e){}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let i=this.instances.get(e);if(!i&&this.component&&(i=this.component.instanceFactory(this.container,{instanceIdentifier:e===z?void 0:e,options:t}),this.instances.set(e,i),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(i,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,i)}catch(e){}return i||null}normalizeInstanceIdentifier(e=z){return this.component?this.component.multipleInstances?e:z:e}shouldAutoInitialize(){return!!this.component&&"EXPLICIT"!==this.component.instantiationMode}};/**
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
 */let ComponentContainer=class ComponentContainer{constructor(e){this.name=e,this.providers=new Map}addComponent(e){let t=this.getProvider(e.name);if(t.isComponentSet())throw Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){let t=this.getProvider(e.name);t.isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);let t=new Provider(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}};/**
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
 */let ee=[];(e2=e4||(e4={}))[e2.DEBUG=0]="DEBUG",e2[e2.VERBOSE=1]="VERBOSE",e2[e2.INFO=2]="INFO",e2[e2.WARN=3]="WARN",e2[e2.ERROR=4]="ERROR",e2[e2.SILENT=5]="SILENT";let ei={debug:e4.DEBUG,verbose:e4.VERBOSE,info:e4.INFO,warn:e4.WARN,error:e4.ERROR,silent:e4.SILENT},er=e4.INFO,en={[e4.DEBUG]:"log",[e4.VERBOSE]:"log",[e4.INFO]:"info",[e4.WARN]:"warn",[e4.ERROR]:"error"},defaultLogHandler=(e,t,...i)=>{if(t<e.logLevel)return;let l=new Date().toISOString(),h=en[t];if(h)console[h](`[${l}]  ${e.name}:`,...i);else throw Error(`Attempted to log a message with an invalid logType (value: ${t})`)};let Logger=class Logger{constructor(e){this.name=e,this._logLevel=er,this._logHandler=defaultLogHandler,this._userLogHandler=null,ee.push(this)}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in e4))throw TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel="string"==typeof e?ei[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if("function"!=typeof e)throw TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,e4.DEBUG,...e),this._logHandler(this,e4.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,e4.VERBOSE,...e),this._logHandler(this,e4.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,e4.INFO,...e),this._logHandler(this,e4.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,e4.WARN,...e),this._logHandler(this,e4.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,e4.ERROR,...e),this._logHandler(this,e4.ERROR,...e)}};let instanceOfAny=(e,t)=>t.some(t=>e instanceof t),es=new WeakMap,eo=new WeakMap,el=new WeakMap,eh=new WeakMap,ec=new WeakMap,eu={get(e,t,i){if(e instanceof IDBTransaction){if("done"===t)return eo.get(e);if("objectStoreNames"===t)return e.objectStoreNames||el.get(e);if("store"===t)return i.objectStoreNames[1]?void 0:i.objectStore(i.objectStoreNames[0])}return wrap_idb_value_wrap(e[t])},set:(e,t,i)=>(e[t]=i,!0),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function wrap_idb_value_wrap(e){var t;if(e instanceof IDBRequest)return function(e){let t=new Promise((t,i)=>{let unlisten=()=>{e.removeEventListener("success",success),e.removeEventListener("error",error)},success=()=>{t(wrap_idb_value_wrap(e.result)),unlisten()},error=()=>{i(e.error),unlisten()};e.addEventListener("success",success),e.addEventListener("error",error)});return t.then(t=>{t instanceof IDBCursor&&es.set(t,e)}).catch(()=>{}),ec.set(t,e),t}(e);if(eh.has(e))return eh.get(e);let i="function"==typeof(t=e)?t!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?(h||(h=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(t)?function(...e){return t.apply(unwrap(this),e),wrap_idb_value_wrap(es.get(this))}:function(...e){return wrap_idb_value_wrap(t.apply(unwrap(this),e))}:function(e,...i){let l=t.call(unwrap(this),e,...i);return el.set(l,e.sort?e.sort():[e]),wrap_idb_value_wrap(l)}:(t instanceof IDBTransaction&&function(e){if(eo.has(e))return;let t=new Promise((t,i)=>{let unlisten=()=>{e.removeEventListener("complete",complete),e.removeEventListener("error",error),e.removeEventListener("abort",error)},complete=()=>{t(),unlisten()},error=()=>{i(e.error||new DOMException("AbortError","AbortError")),unlisten()};e.addEventListener("complete",complete),e.addEventListener("error",error),e.addEventListener("abort",error)});eo.set(e,t)}(t),instanceOfAny(t,l||(l=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])))?new Proxy(t,eu):t;return i!==e&&(eh.set(e,i),ec.set(i,e)),i}let unwrap=e=>ec.get(e),ep=["get","getKey","getAll","getAllKeys","count"],ef=["put","add","delete","clear"],eg=new Map;function getMethod(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&"string"==typeof t))return;if(eg.get(t))return eg.get(t);let i=t.replace(/FromIndex$/,""),l=t!==i,h=ef.includes(i);if(!(i in(l?IDBIndex:IDBObjectStore).prototype)||!(h||ep.includes(i)))return;let method=async function(e,...t){let u=this.transaction(e,h?"readwrite":"readonly"),d=u.store;return l&&(d=d.index(t.shift())),(await Promise.all([d[i](...t),h&&u.done]))[0]};return eg.set(t,method),method}eu={...e1=eu,get:(e,t,i)=>getMethod(e,t)||e1.get(e,t,i),has:(e,t)=>!!getMethod(e,t)||e1.has(e,t)};/**
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
 */let PlatformLoggerServiceImpl=class PlatformLoggerServiceImpl{constructor(e){this.container=e}getPlatformInfoString(){let e=this.container.getProviders();return e.map(e=>{if(!function(e){let t=e.getComponent();return(null==t?void 0:t.type)==="VERSION"}(e))return null;{let t=e.getImmediate();return`${t.library}/${t.version}`}}).filter(e=>e).join(" ")}};let em="@firebase/app",e_="0.9.13",ev=new Logger("@firebase/app"),ey="[DEFAULT]",eI={[em]:"fire-core","@firebase/app-compat":"fire-core-compat","@firebase/analytics":"fire-analytics","@firebase/analytics-compat":"fire-analytics-compat","@firebase/app-check":"fire-app-check","@firebase/app-check-compat":"fire-app-check-compat","@firebase/auth":"fire-auth","@firebase/auth-compat":"fire-auth-compat","@firebase/database":"fire-rtdb","@firebase/database-compat":"fire-rtdb-compat","@firebase/functions":"fire-fn","@firebase/functions-compat":"fire-fn-compat","@firebase/installations":"fire-iid","@firebase/installations-compat":"fire-iid-compat","@firebase/messaging":"fire-fcm","@firebase/messaging-compat":"fire-fcm-compat","@firebase/performance":"fire-perf","@firebase/performance-compat":"fire-perf-compat","@firebase/remote-config":"fire-rc","@firebase/remote-config-compat":"fire-rc-compat","@firebase/storage":"fire-gcs","@firebase/storage-compat":"fire-gcs-compat","@firebase/firestore":"fire-fst","@firebase/firestore-compat":"fire-fst-compat","fire-js":"fire-js",firebase:"fire-js-all"},ew=new Map,eE=new Map;function _registerComponent(e){let t=e.name;if(eE.has(t))return ev.debug(`There were multiple attempts to register component ${t}.`),!1;for(let i of(eE.set(t,e),ew.values()))!function(e,t){try{e.container.addComponent(t)}catch(i){ev.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,i)}}(i,e);return!0}function index_esm2017_getProvider(e,t){let i=e.container.getProvider("heartbeat").getImmediate({optional:!0});return i&&i.triggerHeartbeat(),e.container.getProvider(t)}let eT=new ErrorFactory("app","Firebase",{"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}."});/**
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
 */let FirebaseAppImpl=class FirebaseAppImpl{constructor(e,t,i){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=i,this.container.addComponent(new Component("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw eT.create("app-deleted",{appName:this._name})}};/**
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
 */let eS="9.23.0";function initializeApp(e,t={}){let i=e;if("object"!=typeof t){let e=t;t={name:e}}let l=Object.assign({name:ey,automaticDataCollectionEnabled:!1},t),h=l.name;if("string"!=typeof h||!h)throw eT.create("bad-app-name",{appName:String(h)});if(i||(i=getDefaultAppConfig()),!i)throw eT.create("no-options");let u=ew.get(h);if(u){if(index_esm2017_deepEqual(i,u.options)&&index_esm2017_deepEqual(l,u.config))return u;throw eT.create("duplicate-app",{appName:h})}let d=new ComponentContainer(h);for(let e of eE.values())d.addComponent(e);let f=new FirebaseAppImpl(i,l,d);return ew.set(h,f),f}function getApp(e=ey){let t=ew.get(e);if(!t&&e===ey&&getDefaultAppConfig())return initializeApp();if(!t)throw eT.create("no-app",{appName:e});return t}function registerVersion(e,t,i){var l;let h=null!==(l=eI[e])&&void 0!==l?l:e;i&&(h+=`-${i}`);let u=h.match(/\s|\//),d=t.match(/\s|\//);if(u||d){let e=[`Unable to register library "${h}" with version "${t}":`];u&&e.push(`library name "${h}" contains illegal characters (whitespace or "/")`),u&&d&&e.push("and"),d&&e.push(`version name "${t}" contains illegal characters (whitespace or "/")`),ev.warn(e.join(" "));return}_registerComponent(new Component(`${h}-version`,()=>({library:h,version:t}),"VERSION"))}let eA="firebase-heartbeat-store",eC=null;function getDbPromise(){return eC||(eC=(function(e,t,{blocked:i,upgrade:l,blocking:h,terminated:u}={}){let d=indexedDB.open(e,1),f=wrap_idb_value_wrap(d);return l&&d.addEventListener("upgradeneeded",e=>{l(wrap_idb_value_wrap(d.result),e.oldVersion,e.newVersion,wrap_idb_value_wrap(d.transaction),e)}),i&&d.addEventListener("blocked",e=>i(e.oldVersion,e.newVersion,e)),f.then(e=>{u&&e.addEventListener("close",()=>u()),h&&e.addEventListener("versionchange",e=>h(e.oldVersion,e.newVersion,e))}).catch(()=>{}),f})("firebase-heartbeat-database",0,{upgrade:(e,t)=>{0===t&&e.createObjectStore(eA)}}).catch(e=>{throw eT.create("idb-open",{originalErrorMessage:e.message})})),eC}async function readHeartbeatsFromIndexedDB(e){try{let t=await getDbPromise(),i=await t.transaction(eA).objectStore(eA).get(computeKey(e));return i}catch(e){if(e instanceof FirebaseError)ev.warn(e.message);else{let t=eT.create("idb-get",{originalErrorMessage:null==e?void 0:e.message});ev.warn(t.message)}}}async function writeHeartbeatsToIndexedDB(e,t){try{let i=await getDbPromise(),l=i.transaction(eA,"readwrite"),h=l.objectStore(eA);await h.put(t,computeKey(e)),await l.done}catch(e){if(e instanceof FirebaseError)ev.warn(e.message);else{let t=eT.create("idb-set",{originalErrorMessage:null==e?void 0:e.message});ev.warn(t.message)}}}function computeKey(e){return`${e.name}!${e.options.appId}`}let HeartbeatServiceImpl=class HeartbeatServiceImpl{constructor(e){this.container=e,this._heartbeatsCache=null;let t=this.container.getProvider("app").getImmediate();this._storage=new HeartbeatStorageImpl(t),this._heartbeatsCachePromise=this._storage.read().then(e=>(this._heartbeatsCache=e,e))}async triggerHeartbeat(){let e=this.container.getProvider("platform-logger").getImmediate(),t=e.getPlatformInfoString(),i=getUTCDateString();return(null===this._heartbeatsCache&&(this._heartbeatsCache=await this._heartbeatsCachePromise),this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(e=>e.date===i))?void 0:(this._heartbeatsCache.heartbeats.push({date:i,agent:t}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(e=>{let t=new Date(e.date).valueOf(),i=Date.now();return i-t<=2592e6}),this._storage.overwrite(this._heartbeatsCache))}async getHeartbeatsHeader(){if(null===this._heartbeatsCache&&await this._heartbeatsCachePromise,null===this._heartbeatsCache||0===this._heartbeatsCache.heartbeats.length)return"";let e=getUTCDateString(),{heartbeatsToSend:t,unsentEntries:i}=function(e,t=1024){let i=[],l=e.slice();for(let h of e){let e=i.find(e=>e.agent===h.agent);if(e){if(e.dates.push(h.date),countBytes(i)>t){e.dates.pop();break}}else if(i.push({agent:h.agent,dates:[h.date]}),countBytes(i)>t){i.pop();break}l=l.slice(1)}return{heartbeatsToSend:i,unsentEntries:l}}(this._heartbeatsCache.heartbeats),l=base64urlEncodeWithoutPadding(JSON.stringify({version:2,heartbeats:t}));return this._heartbeatsCache.lastSentHeartbeatDate=e,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),l}};function getUTCDateString(){let e=new Date;return e.toISOString().substring(0,10)}let HeartbeatStorageImpl=class HeartbeatStorageImpl{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return!!function(){try{return"object"==typeof indexedDB}catch(e){return!1}}()&&new Promise((e,t)=>{try{let i=!0,l="validate-browser-context-for-indexeddb-analytics-module",h=self.indexedDB.open(l);h.onsuccess=()=>{h.result.close(),i||self.indexedDB.deleteDatabase(l),e(!0)},h.onupgradeneeded=()=>{i=!1},h.onerror=()=>{var e;t((null===(e=h.error)||void 0===e?void 0:e.message)||"")}}catch(e){t(e)}}).then(()=>!0).catch(()=>!1)}async read(){let e=await this._canUseIndexedDBPromise;if(!e)return{heartbeats:[]};{let e=await readHeartbeatsFromIndexedDB(this.app);return e||{heartbeats:[]}}}async overwrite(e){var t;let i=await this._canUseIndexedDBPromise;if(i){let i=await this.read();return writeHeartbeatsToIndexedDB(this.app,{lastSentHeartbeatDate:null!==(t=e.lastSentHeartbeatDate)&&void 0!==t?t:i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}}async add(e){var t;let i=await this._canUseIndexedDBPromise;if(i){let i=await this.read();return writeHeartbeatsToIndexedDB(this.app,{lastSentHeartbeatDate:null!==(t=e.lastSentHeartbeatDate)&&void 0!==t?t:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}}};function countBytes(e){return base64urlEncodeWithoutPadding(JSON.stringify({version:2,heartbeats:e})).length}function __rest(e,t){var i={};for(var l in e)Object.prototype.hasOwnProperty.call(e,l)&&0>t.indexOf(l)&&(i[l]=e[l]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var h=0,l=Object.getOwnPropertySymbols(e);h<l.length;h++)0>t.indexOf(l[h])&&Object.prototype.propertyIsEnumerable.call(e,l[h])&&(i[l[h]]=e[l[h]]);return i}function _prodErrorMap(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}_registerComponent(new Component("platform-logger",e=>new PlatformLoggerServiceImpl(e),"PRIVATE")),_registerComponent(new Component("heartbeat",e=>new HeartbeatServiceImpl(e),"PRIVATE")),registerVersion(em,e_,""),registerVersion(em,e_,"esm2017"),registerVersion("fire-js",""),"function"==typeof SuppressedError&&SuppressedError;let ek=new ErrorFactory("auth","Firebase",_prodErrorMap()),eP=new Logger("@firebase/auth");function _logError(e,...t){eP.logLevel<=e4.ERROR&&eP.error(`Auth (${eS}): ${e}`,...t)}/**
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
 */function _fail(e,...t){throw createErrorInternal(e,...t)}function _createError(e,...t){return createErrorInternal(e,...t)}function _errorWithCustomMessage(e,t,i){let l=Object.assign(Object.assign({},_prodErrorMap()),{[t]:i}),h=new ErrorFactory("auth","Firebase",l);return h.create(t,{appName:e.name})}function createErrorInternal(e,...t){if("string"!=typeof e){let i=t[0],l=[...t.slice(1)];return l[0]&&(l[0].appName=e.name),e._errorFactory.create(i,...l)}return ek.create(e,...t)}function _assert(e,t,...i){if(!e)throw createErrorInternal(t,...i)}function debugFail(e){let t="INTERNAL ASSERTION FAILED: "+e;throw _logError(t),Error(t)}/**
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
 */let Delay=class Delay{constructor(e,t){this.shortDelay=e,this.longDelay=t,t>e||debugFail("Short delay should be less than long delay!"),this.isMobile="undefined"!=typeof window&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(index_esm2017_getUA())||"object"==typeof navigator&&"ReactNative"===navigator.product}get(){return!("undefined"!=typeof navigator&&navigator&&"onLine"in navigator&&"boolean"==typeof navigator.onLine&&("http:"===_getCurrentScheme()||"https:"===_getCurrentScheme()||function(){let e="object"==typeof chrome?chrome.runtime:"object"==typeof browser?browser.runtime:void 0;return"object"==typeof e&&void 0!==e.id}()||"connection"in navigator))||navigator.onLine?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}};/**
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
 */function _emulatorUrl(e,t){e.emulator||debugFail("Emulator should always be set here");let{url:i}=e.emulator;return t?`${i}${t.startsWith("/")?t.slice(1):t}`:i}/**
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
 */let FetchProvider=class FetchProvider{static initialize(e,t,i){this.fetchImpl=e,t&&(this.headersImpl=t),i&&(this.responseImpl=i)}static fetch(){return this.fetchImpl?this.fetchImpl:"undefined"!=typeof self&&"fetch"in self?self.fetch:void debugFail("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){return this.headersImpl?this.headersImpl:"undefined"!=typeof self&&"Headers"in self?self.Headers:void debugFail("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){return this.responseImpl?this.responseImpl:"undefined"!=typeof self&&"Response"in self?self.Response:void debugFail("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}};/**
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
 */let eR={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"},eO=new Delay(3e4,6e4);function _addTidIfNecessary(e,t){return e.tenantId&&!t.tenantId?Object.assign(Object.assign({},t),{tenantId:e.tenantId}):t}async function _performApiRequest(e,t,i,l,h={}){return _performFetchWithErrorHandling(e,h,async()=>{let h={},u={};l&&("GET"===t?u=l:h={body:JSON.stringify(l)});let d=index_esm2017_querystring(Object.assign({key:e.config.apiKey},u)).slice(1),f=await e._getAdditionalHeaders();return f["Content-Type"]="application/json",e.languageCode&&(f["X-Firebase-Locale"]=e.languageCode),FetchProvider.fetch()(_getFinalTarget(e,e.config.apiHost,i,d),Object.assign({method:t,headers:f,referrerPolicy:"no-referrer"},h))})}async function _performFetchWithErrorHandling(e,t,i){e._canInitEmulator=!1;let l=Object.assign(Object.assign({},eR),t);try{let t=new NetworkTimeout(e),h=await Promise.race([i(),t.promise]);t.clearNetworkTimeout();let u=await h.json();if("needConfirmation"in u)throw _makeTaggedError(e,"account-exists-with-different-credential",u);if(h.ok&&!("errorMessage"in u))return u;{let t=h.ok?u.errorMessage:u.error.message,[i,d]=t.split(" : ");if("FEDERATED_USER_ID_ALREADY_LINKED"===i)throw _makeTaggedError(e,"credential-already-in-use",u);if("EMAIL_EXISTS"===i)throw _makeTaggedError(e,"email-already-in-use",u);if("USER_DISABLED"===i)throw _makeTaggedError(e,"user-disabled",u);let f=l[i]||i.toLowerCase().replace(/[_\s]+/g,"-");if(d)throw _errorWithCustomMessage(e,f,d);_fail(e,f)}}catch(t){if(t instanceof FirebaseError)throw t;_fail(e,"network-request-failed",{message:String(t)})}}async function _performSignInRequest(e,t,i,l,h={}){let u=await _performApiRequest(e,t,i,l,h);return"mfaPendingCredential"in u&&_fail(e,"multi-factor-auth-required",{_serverResponse:u}),u}function _getFinalTarget(e,t,i,l){let h=`${t}${i}?${l}`;return e.config.emulator?_emulatorUrl(e.config,h):`${e.config.apiScheme}://${h}`}let NetworkTimeout=class NetworkTimeout{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((e,t)=>{this.timer=setTimeout(()=>t(_createError(this.auth,"network-request-failed")),eO.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}};function _makeTaggedError(e,t,i){let l={appName:e.name};i.email&&(l.email=i.email),i.phoneNumber&&(l.phoneNumber=i.phoneNumber);let h=_createError(e,t,l);return h.customData._tokenResponse=i,h}/**
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
 */function utcTimestampToDateString(e){if(e)try{let t=new Date(Number(e));if(!isNaN(t.getTime()))return t.toUTCString()}catch(e){}}async function getIdTokenResult(e,t=!1){let i=index_esm2017_getModularInstance(e),l=await i.getIdToken(t),h=_parseToken(l);_assert(h&&h.exp&&h.auth_time&&h.iat,i.auth,"internal-error");let u="object"==typeof h.firebase?h.firebase:void 0,d=null==u?void 0:u.sign_in_provider;return{claims:h,token:l,authTime:utcTimestampToDateString(secondsStringToMilliseconds(h.auth_time)),issuedAtTime:utcTimestampToDateString(secondsStringToMilliseconds(h.iat)),expirationTime:utcTimestampToDateString(secondsStringToMilliseconds(h.exp)),signInProvider:d||null,signInSecondFactor:(null==u?void 0:u.sign_in_second_factor)||null}}function secondsStringToMilliseconds(e){return 1e3*Number(e)}function _parseToken(e){let[t,i,l]=e.split(".");if(void 0===t||void 0===i||void 0===l)return _logError("JWT malformed, contained fewer than 3 sections"),null;try{let e=base64Decode(i);if(!e)return _logError("Failed to decode base64 JWT payload"),null;return JSON.parse(e)}catch(e){return _logError("Caught error parsing JWT payload as JSON",null==e?void 0:e.toString()),null}}/**
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
 */async function _logoutIfInvalidated(e,t,i=!1){if(i)return t;try{return await t}catch(t){throw t instanceof FirebaseError&&function({code:e}){return"auth/user-disabled"===e||"auth/user-token-expired"===e}(t)&&e.auth.currentUser===e&&await e.auth.signOut(),t}}/**
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
 */let ProactiveRefresh=class ProactiveRefresh{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,null!==this.timerId&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){let e=this.errorBackoff;return this.errorBackoff=Math.min(2*this.errorBackoff,96e4),e}{this.errorBackoff=3e4;let e=null!==(t=this.user.stsTokenManager.expirationTime)&&void 0!==t?t:0,i=e-Date.now()-3e5;return Math.max(0,i)}}schedule(e=!1){if(!this.isRunning)return;let t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(null==e?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}};/**
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
 */async function _reloadWithoutSaving(e){var t;let i=e.auth,l=await e.getIdToken(),h=await _logoutIfInvalidated(e,getAccountInfo(i,{idToken:l}));_assert(null==h?void 0:h.users.length,i,"internal-error");let u=h.users[0];e._notifyReloadListener(u);let d=(null===(t=u.providerUserInfo)||void 0===t?void 0:t.length)?u.providerUserInfo.map(e=>{var{providerId:t}=e,i=__rest(e,["providerId"]);return{providerId:t,uid:i.rawId||"",displayName:i.displayName||null,email:i.email||null,phoneNumber:i.phoneNumber||null,photoURL:i.photoUrl||null}}):[],f=function(e,t){let i=e.filter(e=>!t.some(t=>t.providerId===e.providerId));return[...i,...t]}(e.providerData,d),g=e.isAnonymous,m=!(e.email&&u.passwordHash)&&!(null==f?void 0:f.length),_={uid:u.localId,displayName:u.displayName||null,photoURL:u.photoUrl||null,email:u.email||null,emailVerified:u.emailVerified||!1,phoneNumber:u.phoneNumber||null,tenantId:u.tenantId||null,providerData:f,metadata:new UserMetadata(u.createdAt,u.lastLoginAt),isAnonymous:!!g&&m};Object.assign(e,_)}async function reload(e){let t=index_esm2017_getModularInstance(e);await _reloadWithoutSaving(t),await t.auth._persistUserIfCurrent(t),t.auth._notifyListenersIfCurrent(t)}/**
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
 */async function requestStsToken(e,t){let i=await _performFetchWithErrorHandling(e,{},async()=>{let i=index_esm2017_querystring({grant_type:"refresh_token",refresh_token:t}).slice(1),{tokenApiHost:l,apiKey:h}=e.config,u=_getFinalTarget(e,l,"/v1/token",`key=${h}`),d=await e._getAdditionalHeaders();return d["Content-Type"]="application/x-www-form-urlencoded",FetchProvider.fetch()(u,{method:"POST",headers:d,body:i})});return{accessToken:i.access_token,expiresIn:i.expires_in,refreshToken:i.refresh_token}}/**
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
 */let StsTokenManager=class StsTokenManager{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){_assert(e.idToken,"internal-error"),_assert(void 0!==e.idToken,"internal-error"),_assert(void 0!==e.refreshToken,"internal-error");let t="expiresIn"in e&&void 0!==e.expiresIn?Number(e.expiresIn):function(e){let t=_parseToken(e);return _assert(t,"internal-error"),_assert(void 0!==t.exp,"internal-error"),_assert(void 0!==t.iat,"internal-error"),Number(t.exp)-Number(t.iat)}(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}async getToken(e,t=!1){return(_assert(!this.accessToken||this.refreshToken,e,"user-token-expired"),t||!this.accessToken||this.isExpired)?this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null:this.accessToken}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){let{accessToken:i,refreshToken:l,expiresIn:h}=await requestStsToken(e,t);this.updateTokensAndExpiration(i,l,Number(h))}updateTokensAndExpiration(e,t,i){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+1e3*i}static fromJSON(e,t){let{refreshToken:i,accessToken:l,expirationTime:h}=t,u=new StsTokenManager;return i&&(_assert("string"==typeof i,"internal-error",{appName:e}),u.refreshToken=i),l&&(_assert("string"==typeof l,"internal-error",{appName:e}),u.accessToken=l),h&&(_assert("number"==typeof h,"internal-error",{appName:e}),u.expirationTime=h),u}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new StsTokenManager,this.toJSON())}_performRefresh(){return debugFail("not implemented")}};/**
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
 */function assertStringOrUndefined(e,t){_assert("string"==typeof e||void 0===e,"internal-error",{appName:t})}let UserImpl=class UserImpl{constructor(e){var{uid:t,auth:i,stsTokenManager:l}=e,h=__rest(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new ProactiveRefresh(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=i,this.stsTokenManager=l,this.accessToken=l.accessToken,this.displayName=h.displayName||null,this.email=h.email||null,this.emailVerified=h.emailVerified||!1,this.phoneNumber=h.phoneNumber||null,this.photoURL=h.photoURL||null,this.isAnonymous=h.isAnonymous||!1,this.tenantId=h.tenantId||null,this.providerData=h.providerData?[...h.providerData]:[],this.metadata=new UserMetadata(h.createdAt||void 0,h.lastLoginAt||void 0)}async getIdToken(e){let t=await _logoutIfInvalidated(this,this.stsTokenManager.getToken(this.auth,e));return _assert(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return getIdTokenResult(this,e)}reload(){return reload(this)}_assign(e){this!==e&&(_assert(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(e=>Object.assign({},e)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){let t=new UserImpl(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){_assert(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let i=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),i=!0),t&&await _reloadWithoutSaving(this),await this.auth._persistUserIfCurrent(this),i&&this.auth._notifyListenersIfCurrent(this)}async delete(){let e=await this.getIdToken();return await _logoutIfInvalidated(this,deleteAccount(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var i,l,h,u,d,f,g,m;let _=null!==(i=t.displayName)&&void 0!==i?i:void 0,b=null!==(l=t.email)&&void 0!==l?l:void 0,E=null!==(h=t.phoneNumber)&&void 0!==h?h:void 0,k=null!==(u=t.photoURL)&&void 0!==u?u:void 0,L=null!==(d=t.tenantId)&&void 0!==d?d:void 0,V=null!==(f=t._redirectEventId)&&void 0!==f?f:void 0,z=null!==(g=t.createdAt)&&void 0!==g?g:void 0,ee=null!==(m=t.lastLoginAt)&&void 0!==m?m:void 0,{uid:ei,emailVerified:er,isAnonymous:en,providerData:es,stsTokenManager:eo}=t;_assert(ei&&eo,e,"internal-error");let el=StsTokenManager.fromJSON(this.name,eo);_assert("string"==typeof ei,e,"internal-error"),assertStringOrUndefined(_,e.name),assertStringOrUndefined(b,e.name),_assert("boolean"==typeof er,e,"internal-error"),_assert("boolean"==typeof en,e,"internal-error"),assertStringOrUndefined(E,e.name),assertStringOrUndefined(k,e.name),assertStringOrUndefined(L,e.name),assertStringOrUndefined(V,e.name),assertStringOrUndefined(z,e.name),assertStringOrUndefined(ee,e.name);let eh=new UserImpl({uid:ei,auth:e,email:b,emailVerified:er,displayName:_,isAnonymous:en,photoURL:k,phoneNumber:E,tenantId:L,stsTokenManager:el,createdAt:z,lastLoginAt:ee});return es&&Array.isArray(es)&&(eh.providerData=es.map(e=>Object.assign({},e))),V&&(eh._redirectEventId=V),eh}static async _fromIdTokenResponse(e,t,i=!1){let l=new StsTokenManager;l.updateFromServerResponse(t);let h=new UserImpl({uid:t.localId,auth:e,stsTokenManager:l,isAnonymous:i});return await _reloadWithoutSaving(h),h}};/**
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
 */let eN=new Map;function _getInstance(e){e instanceof Function||debugFail("Expected a class definition");let t=eN.get(e);return t?t instanceof e||debugFail("Instance stored in cache mismatched with class"):(t=new e,eN.set(e,t)),t}/**
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
 */function _persistenceKeyName(e,t,i){return`firebase:${e}:${t}:${i}`}InMemoryPersistence.type="NONE";let PersistenceUserManager=class PersistenceUserManager{constructor(e,t,i){this.persistence=e,this.auth=t,this.userKey=i;let{config:l,name:h}=this.auth;this.fullUserKey=_persistenceKeyName(this.userKey,l.apiKey,h),this.fullPersistenceKey=_persistenceKeyName("persistence",l.apiKey,h),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){let e=await this.persistence._get(this.fullUserKey);return e?UserImpl._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;let t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,i="authUser"){if(!t.length)return new PersistenceUserManager(_getInstance(InMemoryPersistence),e,i);let l=(await Promise.all(t.map(async e=>{if(await e._isAvailable())return e}))).filter(e=>e),h=l[0]||_getInstance(InMemoryPersistence),u=_persistenceKeyName(i,e.config.apiKey,e.name),d=null;for(let i of t)try{let t=await i._get(u);if(t){let l=UserImpl._fromJSON(e,t);i!==h&&(d=l),h=i;break}}catch(e){}let f=l.filter(e=>e._shouldAllowMigration);return h._shouldAllowMigration&&f.length&&(h=f[0],d&&await h._set(u,d.toJSON()),await Promise.all(t.map(async e=>{if(e!==h)try{await e._remove(u)}catch(e){}}))),new PersistenceUserManager(h,e,i)}};/**
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
 */function _getBrowserName(e){let t=e.toLowerCase();if(t.includes("opera/")||t.includes("opr/")||t.includes("opios/"))return"Opera";if(_isIEMobile(t))return"IEMobile";if(t.includes("msie")||t.includes("trident/"))return"IE";{if(t.includes("edge/"))return"Edge";if(_isFirefox(t))return"Firefox";if(t.includes("silk/"))return"Silk";if(_isBlackBerry(t))return"Blackberry";if(_isWebOS(t))return"Webos";if(_isSafari(t))return"Safari";if((t.includes("chrome/")||_isChromeIOS(t))&&!t.includes("edge/"))return"Chrome";if(_isAndroid(t))return"Android";let i=e.match(/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/);if((null==i?void 0:i.length)===2)return i[1]}return"Other"}function _isFirefox(e=index_esm2017_getUA()){return/firefox\//i.test(e)}function _isSafari(e=index_esm2017_getUA()){let t=e.toLowerCase();return t.includes("safari/")&&!t.includes("chrome/")&&!t.includes("crios/")&&!t.includes("android")}function _isChromeIOS(e=index_esm2017_getUA()){return/crios\//i.test(e)}function _isIEMobile(e=index_esm2017_getUA()){return/iemobile/i.test(e)}function _isAndroid(e=index_esm2017_getUA()){return/android/i.test(e)}function _isBlackBerry(e=index_esm2017_getUA()){return/blackberry/i.test(e)}function _isWebOS(e=index_esm2017_getUA()){return/webos/i.test(e)}function _isIOS(e=index_esm2017_getUA()){return/iphone|ipad|ipod/i.test(e)||/macintosh/i.test(e)&&/mobile/i.test(e)}function _isMobileBrowser(e=index_esm2017_getUA()){return _isIOS(e)||_isAndroid(e)||_isWebOS(e)||_isBlackBerry(e)||/windows phone/i.test(e)||_isIEMobile(e)}/**
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
 */function _getClientVersion(e,t=[]){let i;switch(e){case"Browser":i=_getBrowserName(index_esm2017_getUA());break;case"Worker":i=`${_getBrowserName(index_esm2017_getUA())}-${e}`;break;default:i=e}let l=t.length?t.join(","):"FirebaseCore-web";return`${i}/JsCore/${eS}/${l}`}async function getRecaptchaConfig(e,t){return _performApiRequest(e,"GET","/v2/recaptchaConfig",_addTidIfNecessary(e,t))}function isEnterprise(e){return void 0!==e&&void 0!==e.enterprise}let RecaptchaConfig=class RecaptchaConfig{constructor(e){if(this.siteKey="",this.emailPasswordEnabled=!1,void 0===e.recaptchaKey)throw Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.emailPasswordEnabled=e.recaptchaEnforcementState.some(e=>"EMAIL_PASSWORD_PROVIDER"===e.provider&&"OFF"!==e.enforcementState)}};function _loadJS(e){return new Promise((t,i)=>{var l,h;let u=document.createElement("script");u.setAttribute("src",e),u.onload=t,u.onerror=e=>{let t=_createError("internal-error");t.customData=e,i(t)},u.type="text/javascript",u.charset="UTF-8",(null!==(h=null===(l=document.getElementsByTagName("head"))||void 0===l?void 0:l[0])&&void 0!==h?h:document).appendChild(u)})}function _generateCallbackName(e){return`__${e}${Math.floor(1e6*Math.random())}`}let RecaptchaEnterpriseVerifier=class RecaptchaEnterpriseVerifier{constructor(e){this.type="recaptcha-enterprise",this.auth=index_esm2017_getModularInstance(e)}async verify(e="verify",t=!1){async function retrieveSiteKey(e){if(!t){if(null==e.tenantId&&null!=e._agentRecaptchaConfig)return e._agentRecaptchaConfig.siteKey;if(null!=e.tenantId&&void 0!==e._tenantRecaptchaConfigs[e.tenantId])return e._tenantRecaptchaConfigs[e.tenantId].siteKey}return new Promise(async(t,i)=>{getRecaptchaConfig(e,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(l=>{if(void 0===l.recaptchaKey)i(Error("recaptcha Enterprise site key undefined"));else{let i=new RecaptchaConfig(l);return null==e.tenantId?e._agentRecaptchaConfig=i:e._tenantRecaptchaConfigs[e.tenantId]=i,t(i.siteKey)}}).catch(e=>{i(e)})})}function retrieveRecaptchaToken(t,i,l){let h=window.grecaptcha;isEnterprise(h)?h.enterprise.ready(()=>{h.enterprise.execute(t,{action:e}).then(e=>{i(e)}).catch(()=>{i("NO_RECAPTCHA")})}):l(Error("No reCAPTCHA enterprise script loaded."))}return new Promise((e,i)=>{retrieveSiteKey(this.auth).then(l=>{if(!t&&isEnterprise(window.grecaptcha))retrieveRecaptchaToken(l,e,i);else{if("undefined"==typeof window){i(Error("RecaptchaVerifier is only supported in browser"));return}_loadJS("https://www.google.com/recaptcha/enterprise.js?render="+l).then(()=>{retrieveRecaptchaToken(l,e,i)}).catch(e=>{i(e)})}}).catch(e=>{i(e)})})}};async function injectRecaptchaFields(e,t,i,l=!1){let h;let u=new RecaptchaEnterpriseVerifier(e);try{h=await u.verify(i)}catch(e){h=await u.verify(i,!0)}let d=Object.assign({},t);return l?Object.assign(d,{captchaResp:h}):Object.assign(d,{captchaResponse:h}),Object.assign(d,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(d,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),d}/**
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
 */let AuthMiddlewareQueue=class AuthMiddlewareQueue{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){let wrappedCallback=t=>new Promise((i,l)=>{try{let l=e(t);i(l)}catch(e){l(e)}});wrappedCallback.onAbort=t,this.queue.push(wrappedCallback);let i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;let t=[];try{for(let i of this.queue)await i(e),i.onAbort&&t.push(i.onAbort)}catch(e){for(let e of(t.reverse(),t))try{e()}catch(e){}throw this.auth._errorFactory.create("login-blocked",{originalMessage:null==e?void 0:e.message})}}};/**
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
 */let AuthImpl=class AuthImpl{constructor(e,t,i,l){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=i,this.config=l,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Subscription(this),this.idTokenSubscription=new Subscription(this),this.beforeStateQueue=new AuthMiddlewareQueue(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=ek,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=l.sdkClientVersion}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=_getInstance(t)),this._initializationPromise=this.queue(async()=>{var i,l;if(!this._deleted&&(this.persistenceManager=await PersistenceUserManager.create(this,e),!this._deleted)){if(null===(i=this._popupRedirectResolver)||void 0===i?void 0:i._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch(e){}await this.initializeCurrentUser(t),this.lastNotifiedUid=(null===(l=this.currentUser)||void 0===l?void 0:l.uid)||null,this._deleted||(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;let e=await this.assertedPersistence.getCurrentUser();if(this.currentUser||e){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUser(e){var t;let i=await this.assertedPersistence.getCurrentUser(),l=i,h=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();let i=null===(t=this.redirectUser)||void 0===t?void 0:t._redirectEventId,u=null==l?void 0:l._redirectEventId,d=await this.tryRedirectSignIn(e);(!i||i===u)&&(null==d?void 0:d.user)&&(l=d.user,h=!0)}if(!l)return this.directlySetCurrentUser(null);if(!l._redirectEventId){if(h)try{await this.beforeStateQueue.runMiddleware(l)}catch(e){l=i,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(e))}return l?this.reloadAndSetCurrentUserOrClear(l):this.directlySetCurrentUser(null)}return(_assert(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===l._redirectEventId)?this.directlySetCurrentUser(l):this.reloadAndSetCurrentUserOrClear(l)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch(e){await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await _reloadWithoutSaving(e)}catch(e){if((null==e?void 0:e.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=function(){if("undefined"==typeof navigator)return null;let e=navigator;return e.languages&&e.languages[0]||e.language||null}()}async _delete(){this._deleted=!0}async updateCurrentUser(e){let t=e?index_esm2017_getModularInstance(e):null;return t&&_assert(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&_assert(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0)}setPersistence(e){return this.queue(async()=>{await this.assertedPersistence.setPersistence(_getInstance(e))})}async initializeRecaptchaConfig(){let e=await getRecaptchaConfig(this,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}),t=new RecaptchaConfig(e);if(null==this.tenantId?this._agentRecaptchaConfig=t:this._tenantRecaptchaConfigs[this.tenantId]=t,t.emailPasswordEnabled){let e=new RecaptchaEnterpriseVerifier(this);e.verify()}}_getRecaptchaConfig(){return null==this.tenantId?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new ErrorFactory("auth","Firebase",e())}onAuthStateChanged(e,t,i){return this.registerStateListener(this.authStateSubscription,e,t,i)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,i){return this.registerStateListener(this.idTokenSubscription,e,t,i)}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:null===(e=this._currentUser)||void 0===e?void 0:e.toJSON()}}async _setRedirectUser(e,t){let i=await this.getOrInitRedirectPersistenceManager(t);return null===e?i.removeCurrentUser():i.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){let t=e&&_getInstance(e)||this._popupRedirectResolver;_assert(t,this,"argument-error"),this.redirectPersistenceManager=await PersistenceUserManager.create(this,[_getInstance(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,i;return(this._isInitialized&&await this.queue(async()=>{}),(null===(t=this._currentUser)||void 0===t?void 0:t._redirectEventId)===e)?this._currentUser:(null===(i=this.redirectUser)||void 0===i?void 0:i._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);let i=null!==(t=null===(e=this.currentUser)||void 0===e?void 0:e.uid)&&void 0!==t?t:null;this.lastNotifiedUid!==i&&(this.lastNotifiedUid=i,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,i,l){if(this._deleted)return()=>{};let h="function"==typeof t?t:t.next.bind(t),u=this._isInitialized?Promise.resolve():this._initializationPromise;return(_assert(u,this,"internal-error"),u.then(()=>h(this.currentUser)),"function"==typeof t)?e.addObserver(t,i,l):e.addObserver(t)}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return _assert(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=_getClientVersion(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;let t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);let i=await (null===(e=this.heartbeatServiceProvider.getImmediate({optional:!0}))||void 0===e?void 0:e.getHeartbeatsHeader());i&&(t["X-Firebase-Client"]=i);let l=await this._getAppCheckToken();return l&&(t["X-Firebase-AppCheck"]=l),t}async _getAppCheckToken(){var e;let t=await (null===(e=this.appCheckServiceProvider.getImmediate({optional:!0}))||void 0===e?void 0:e.getToken());return(null==t?void 0:t.error)&&function(e,...t){eP.logLevel<=e4.WARN&&eP.warn(`Auth (${eS}): ${e}`,...t)}(`Error while retrieving App Check token: ${t.error}`),null==t?void 0:t.token}};let Subscription=class Subscription{constructor(e){this.auth=e,this.observer=null,this.addObserver=function(e,t){let i=new ObserverProxy(e,void 0);return i.subscribe.bind(i)}(e=>this.observer=e)}get next(){return _assert(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}};function extractProtocol(e){let t=e.indexOf(":");return t<0?"":e.substr(0,t+1)}function parsePort(e){if(!e)return null;let t=Number(e);return isNaN(t)?null:t}/**
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
 */let EmailAuthCredential=class EmailAuthCredential extends AuthCredential{constructor(e,t,i,l=null){super("password",i),this._email=e,this._password=t,this._tenantId=l}static _fromEmailAndPassword(e,t){return new EmailAuthCredential(e,t,"password")}static _fromEmailAndCode(e,t,i=null){return new EmailAuthCredential(e,t,"emailLink",i)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){let t="string"==typeof e?JSON.parse(e):e;if((null==t?void 0:t.email)&&(null==t?void 0:t.password)){if("password"===t.signInMethod)return this._fromEmailAndPassword(t.email,t.password);if("emailLink"===t.signInMethod)return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){var t;switch(this.signInMethod){case"password":let i={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};if(null===(t=e._getRecaptchaConfig())||void 0===t||!t.emailPasswordEnabled)return signInWithPassword(e,i).catch(async t=>{if("auth/missing-recaptcha-token"!==t.code)return Promise.reject(t);{console.log("Sign-in with email address and password is protected by reCAPTCHA for this project. Automatically triggering the reCAPTCHA flow and restarting the sign-in flow.");let t=await injectRecaptchaFields(e,i,"signInWithPassword");return signInWithPassword(e,t)}});{let t=await injectRecaptchaFields(e,i,"signInWithPassword");return signInWithPassword(e,t)}case"emailLink":return signInWithEmailLink$1(e,{email:this._email,oobCode:this._password});default:_fail(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":return updateEmailPassword(e,{idToken:t,returnSecureToken:!0,email:this._email,password:this._password});case"emailLink":return signInWithEmailLinkForLinking(e,{idToken:t,email:this._email,oobCode:this._password});default:_fail(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}};/**
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
 */async function signInWithIdp(e,t){return _performSignInRequest(e,"POST","/v1/accounts:signInWithIdp",_addTidIfNecessary(e,t))}let OAuthCredential=class OAuthCredential extends AuthCredential{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){let t=new OAuthCredential(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):_fail("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){let t="string"==typeof e?JSON.parse(e):e,{providerId:i,signInMethod:l}=t,h=__rest(t,["providerId","signInMethod"]);if(!i||!l)return null;let u=new OAuthCredential(i,l);return u.idToken=h.idToken||void 0,u.accessToken=h.accessToken||void 0,u.secret=h.secret,u.nonce=h.nonce,u.pendingToken=h.pendingToken||null,u}_getIdTokenResponse(e){let t=this.buildRequest();return signInWithIdp(e,t)}_linkToIdToken(e,t){let i=this.buildRequest();return i.idToken=t,signInWithIdp(e,i)}_getReauthenticationResolver(e){let t=this.buildRequest();return t.autoCreate=!1,signInWithIdp(e,t)}buildRequest(){let e={requestUri:"http://localhost",returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{let t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=index_esm2017_querystring(t)}return e}};/**
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
 */async function sendPhoneVerificationCode(e,t){return _performApiRequest(e,"POST","/v1/accounts:sendVerificationCode",_addTidIfNecessary(e,t))}async function signInWithPhoneNumber$1(e,t){return _performSignInRequest(e,"POST","/v1/accounts:signInWithPhoneNumber",_addTidIfNecessary(e,t))}async function linkWithPhoneNumber$1(e,t){let i=await _performSignInRequest(e,"POST","/v1/accounts:signInWithPhoneNumber",_addTidIfNecessary(e,t));if(i.temporaryProof)throw _makeTaggedError(e,"account-exists-with-different-credential",i);return i}let eD={USER_NOT_FOUND:"user-not-found"};async function verifyPhoneNumberForExisting(e,t){let i=Object.assign(Object.assign({},t),{operation:"REAUTH"});return _performSignInRequest(e,"POST","/v1/accounts:signInWithPhoneNumber",_addTidIfNecessary(e,i),eD)}/**
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
 */let PhoneAuthCredential=class PhoneAuthCredential extends AuthCredential{constructor(e){super("phone","phone"),this.params=e}static _fromVerification(e,t){return new PhoneAuthCredential({verificationId:e,verificationCode:t})}static _fromTokenResponse(e,t){return new PhoneAuthCredential({phoneNumber:e,temporaryProof:t})}_getIdTokenResponse(e){return signInWithPhoneNumber$1(e,this._makeVerificationRequest())}_linkToIdToken(e,t){return linkWithPhoneNumber$1(e,Object.assign({idToken:t},this._makeVerificationRequest()))}_getReauthenticationResolver(e){return verifyPhoneNumberForExisting(e,this._makeVerificationRequest())}_makeVerificationRequest(){let{temporaryProof:e,phoneNumber:t,verificationId:i,verificationCode:l}=this.params;return e&&t?{temporaryProof:e,phoneNumber:t}:{sessionInfo:i,code:l}}toJSON(){let e={providerId:this.providerId};return this.params.phoneNumber&&(e.phoneNumber=this.params.phoneNumber),this.params.temporaryProof&&(e.temporaryProof=this.params.temporaryProof),this.params.verificationCode&&(e.verificationCode=this.params.verificationCode),this.params.verificationId&&(e.verificationId=this.params.verificationId),e}static fromJSON(e){"string"==typeof e&&(e=JSON.parse(e));let{verificationId:t,verificationCode:i,phoneNumber:l,temporaryProof:h}=e;return i||t||l||h?new PhoneAuthCredential({verificationId:t,verificationCode:i,phoneNumber:l,temporaryProof:h}):null}};let ActionCodeURL=class ActionCodeURL{constructor(e){var t,i,l,h,u,d;let f=querystringDecode(extractQuerystring(e)),g=null!==(t=f.apiKey)&&void 0!==t?t:null,m=null!==(i=f.oobCode)&&void 0!==i?i:null,_=/**
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
 */function(e){switch(e){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}(null!==(l=f.mode)&&void 0!==l?l:null);_assert(g&&m&&_,"argument-error"),this.apiKey=g,this.operation=_,this.code=m,this.continueUrl=null!==(h=f.continueUrl)&&void 0!==h?h:null,this.languageCode=null!==(u=f.languageCode)&&void 0!==u?u:null,this.tenantId=null!==(d=f.tenantId)&&void 0!==d?d:null}static parseLink(e){let t=function(e){let t=querystringDecode(extractQuerystring(e)).link,i=t?querystringDecode(extractQuerystring(t)).deep_link_id:null,l=querystringDecode(extractQuerystring(e)).deep_link_id,h=l?querystringDecode(extractQuerystring(l)).link:null;return h||l||i||t||e}(e);try{return new ActionCodeURL(t)}catch(e){return null}}};/**
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
 */let EmailAuthProvider=class EmailAuthProvider{constructor(){this.providerId=EmailAuthProvider.PROVIDER_ID}static credential(e,t){return EmailAuthCredential._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){let i=ActionCodeURL.parseLink(t);return _assert(i,"argument-error"),EmailAuthCredential._fromEmailAndCode(e,i.code,i.tenantId)}};EmailAuthProvider.PROVIDER_ID="password",EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD="password",EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
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
 */let GoogleAuthProvider=class GoogleAuthProvider extends BaseOAuthProvider{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return OAuthCredential._fromParams({providerId:GoogleAuthProvider.PROVIDER_ID,signInMethod:GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return GoogleAuthProvider.credentialFromTaggedObject(e)}static credentialFromError(e){return GoogleAuthProvider.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{oauthIdToken:t,oauthAccessToken:i}=e;if(!t&&!i)return null;try{return GoogleAuthProvider.credential(t,i)}catch(e){return null}}};GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD="google.com",GoogleAuthProvider.PROVIDER_ID="google.com";/**
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
 */let TwitterAuthProvider=class TwitterAuthProvider extends BaseOAuthProvider{constructor(){super("twitter.com")}static credential(e,t){return OAuthCredential._fromParams({providerId:TwitterAuthProvider.PROVIDER_ID,signInMethod:TwitterAuthProvider.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return TwitterAuthProvider.credentialFromTaggedObject(e)}static credentialFromError(e){return TwitterAuthProvider.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{oauthAccessToken:t,oauthTokenSecret:i}=e;if(!t||!i)return null;try{return TwitterAuthProvider.credential(t,i)}catch(e){return null}}};/**
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
 */let UserCredentialImpl=class UserCredentialImpl{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,i,l=!1){let h=await UserImpl._fromIdTokenResponse(e,i,l),u=providerIdForResponse(i),d=new UserCredentialImpl({user:h,providerId:u,_tokenResponse:i,operationType:t});return d}static async _forOperation(e,t,i){await e._updateTokensIfNecessary(i,!0);let l=providerIdForResponse(i);return new UserCredentialImpl({user:e,providerId:l,_tokenResponse:i,operationType:t})}};function providerIdForResponse(e){return e.providerId?e.providerId:"phoneNumber"in e?"phone":null}/**
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
 */let MultiFactorError=class MultiFactorError extends FirebaseError{constructor(e,t,i,l){var h;super(t.code,t.message),this.operationType=i,this.user=l,Object.setPrototypeOf(this,MultiFactorError.prototype),this.customData={appName:e.name,tenantId:null!==(h=e.tenantId)&&void 0!==h?h:void 0,_serverResponse:t.customData._serverResponse,operationType:i}}static _fromErrorAndOperation(e,t,i,l){return new MultiFactorError(e,t,i,l)}};function _processCredentialSavingMfaContextIfNecessary(e,t,i,l){let h="reauthenticate"===t?i._getReauthenticationResolver(e):i._getIdTokenResponse(e);return h.catch(i=>{if("auth/multi-factor-auth-required"===i.code)throw MultiFactorError._fromErrorAndOperation(e,i,t,l);throw i})}async function _link$1(e,t,i=!1){let l=await _logoutIfInvalidated(e,t._linkToIdToken(e.auth,await e.getIdToken()),i);return UserCredentialImpl._forOperation(e,"link",l)}/**
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
 */async function _reauthenticate(e,t,i=!1){let{auth:l}=e,h="reauthenticate";try{let u=await _logoutIfInvalidated(e,_processCredentialSavingMfaContextIfNecessary(l,h,t,e),i);_assert(u.idToken,l,"internal-error");let d=_parseToken(u.idToken);_assert(d,l,"internal-error");let{sub:f}=d;return _assert(e.uid===f,l,"user-mismatch"),UserCredentialImpl._forOperation(e,h,u)}catch(e){throw(null==e?void 0:e.code)==="auth/user-not-found"&&_fail(l,"user-mismatch"),e}}/**
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
 */async function _signInWithCredential(e,t,i=!1){let l="signIn",h=await _processCredentialSavingMfaContextIfNecessary(e,l,t),u=await UserCredentialImpl._fromIdTokenResponse(e,l,h);return i||await e._updateCurrentUser(u.user),u}async function signInWithCredential(e,t){return _signInWithCredential(index_esm2017_getModularInstance(e),t)}async function createUserWithEmailAndPassword(e,t,i){var l;let h;let u=index_esm2017_getModularInstance(e),d={returnSecureToken:!0,email:t,password:i,clientType:"CLIENT_TYPE_WEB"};if(null===(l=u._getRecaptchaConfig())||void 0===l?void 0:l.emailPasswordEnabled){let e=await injectRecaptchaFields(u,d,"signUpPassword");h=signUp(u,e)}else h=signUp(u,d).catch(async e=>{if("auth/missing-recaptcha-token"!==e.code)return Promise.reject(e);{console.log("Sign-up is protected by reCAPTCHA for this project. Automatically triggering the reCAPTCHA flow and restarting the sign-up flow.");let e=await injectRecaptchaFields(u,d,"signUpPassword");return signUp(u,e)}});let f=await h.catch(e=>Promise.reject(e)),g=await UserCredentialImpl._fromIdTokenResponse(u,"signIn",f);return await u._updateCurrentUser(g.user),g}new WeakMap;let ex="__sak";/**
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
 */let BrowserPersistenceClass=class BrowserPersistenceClass{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{if(!this.storage)return Promise.resolve(!1);return this.storage.setItem(ex,"1"),this.storage.removeItem(ex),Promise.resolve(!0)}catch(e){return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){let t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}};let BrowserLocalPersistence=class BrowserLocalPersistence extends BrowserPersistenceClass{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.safariLocalStorageNotSynced=/**
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
 */function(){let e=index_esm2017_getUA();return _isSafari(e)||_isIOS(e)}()&&function(){try{return!!(window&&window!==window.top)}catch(e){return!1}}(),this.fallbackToPolling=_isMobileBrowser(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(let t of Object.keys(this.listeners)){let i=this.storage.getItem(t),l=this.localCache[t];i!==l&&e(t,l,i)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((e,t,i)=>{this.notifyListeners(e,i)});return}let i=e.key;if(t?this.detachListener():this.stopPolling(),this.safariLocalStorageNotSynced){let l=this.storage.getItem(i);if(e.newValue!==l)null!==e.newValue?this.storage.setItem(i,e.newValue):this.storage.removeItem(i);else if(this.localCache[i]===e.newValue&&!t)return}let triggerListeners=()=>{let e=this.storage.getItem(i);(t||this.localCache[i]!==e)&&this.notifyListeners(i,e)},l=this.storage.getItem(i);(function(){let e=index_esm2017_getUA();return e.indexOf("MSIE ")>=0||e.indexOf("Trident/")>=0})()&&10===document.documentMode&&l!==e.newValue&&e.newValue!==e.oldValue?setTimeout(triggerListeners,10):triggerListeners()}notifyListeners(e,t){this.localCache[e]=t;let i=this.listeners[e];if(i)for(let e of Array.from(i))e(t?JSON.parse(t):t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,i)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:i}),!0)})},1e3)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){0===Object.keys(this.listeners).length&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),0===this.listeners[e].size&&delete this.listeners[e]),0===Object.keys(this.listeners).length&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){let t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}};BrowserLocalPersistence.type="LOCAL";/**
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
 */let Receiver=class Receiver{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){let t=this.receivers.find(t=>t.isListeningto(e));if(t)return t;let i=new Receiver(e);return this.receivers.push(i),i}isListeningto(e){return this.eventTarget===e}async handleEvent(e){let{eventId:t,eventType:i,data:l}=e.data,h=this.handlersMap[i];if(!(null==h?void 0:h.size))return;e.ports[0].postMessage({status:"ack",eventId:t,eventType:i});let u=Array.from(h).map(async t=>t(e.origin,l)),d=await Promise.all(u.map(async e=>{try{let t=await e;return{fulfilled:!0,value:t}}catch(e){return{fulfilled:!1,reason:e}}}));e.ports[0].postMessage({status:"done",eventId:t,eventType:i,response:d})}_subscribe(e,t){0===Object.keys(this.handlersMap).length&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),t&&0!==this.handlersMap[e].size||delete this.handlersMap[e],0===Object.keys(this.handlersMap).length&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}};/**
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
 */function _generateEventId(e="",t=10){let i="";for(let e=0;e<t;e++)i+=Math.floor(10*Math.random());return e+i}Receiver.receivers=[];/**
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
 */let Sender=class Sender{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,i=50){let l,h;let u="undefined"!=typeof MessageChannel?new MessageChannel:null;if(!u)throw Error("connection_unavailable");return new Promise((d,f)=>{let g=_generateEventId("",20);u.port1.start();let m=setTimeout(()=>{f(Error("unsupported_event"))},i);h={messageChannel:u,onMessage(e){if(e.data.eventId===g)switch(e.data.status){case"ack":clearTimeout(m),l=setTimeout(()=>{f(Error("timeout"))},3e3);break;case"done":clearTimeout(l),d(e.data.response);break;default:clearTimeout(m),clearTimeout(l),f(Error("invalid_response"))}}},this.handlers.add(h),u.port1.addEventListener("message",h.onMessage),this.target.postMessage({eventType:e,eventId:g,data:t},[u.port2])}).finally(()=>{h&&this.removeMessageHandler(h)})}};/**
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
 */let eL="firebaseLocalStorageDb",eM="firebaseLocalStorage",eU="fbase_key";let DBPromise=class DBPromise{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}};function getObjectStore(e,t){return e.transaction([eM],t?"readwrite":"readonly").objectStore(eM)}function _openDatabase(){let e=indexedDB.open(eL,1);return new Promise((t,i)=>{e.addEventListener("error",()=>{i(e.error)}),e.addEventListener("upgradeneeded",()=>{let t=e.result;try{t.createObjectStore(eM,{keyPath:eU})}catch(e){i(e)}}),e.addEventListener("success",async()=>{let i=e.result;i.objectStoreNames.contains(eM)?t(i):(i.close(),await function(){let e=indexedDB.deleteDatabase(eL);return new DBPromise(e).toPromise()}(),t(await _openDatabase()))})})}async function _putObject(e,t,i){let l=getObjectStore(e,!0).put({[eU]:t,value:i});return new DBPromise(l).toPromise()}async function getObject(e,t){let i=getObjectStore(e,!1).get(t),l=await new DBPromise(i).toPromise();return void 0===l?null:l.value}function _deleteObject(e,t){let i=getObjectStore(e,!0).delete(t);return new DBPromise(i).toPromise()}let IndexedDBLocalPersistence=class IndexedDBLocalPersistence{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db||(this.db=await _openDatabase()),this.db}async _withRetries(e){let t=0;for(;;)try{let t=await this._openDb();return await e(t)}catch(e){if(t++>3)throw e;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return _isWorker()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Receiver._getInstance(_isWorker()?self:null),this.receiver._subscribe("keyChanged",async(e,t)=>{let i=await this._poll();return{keyProcessed:i.includes(t.key)}}),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await _getActiveServiceWorker(),!this.activeServiceWorker)return;this.sender=new Sender(this.activeServiceWorker);let i=await this.sender._send("ping",{},800);i&&(null===(e=i[0])||void 0===e?void 0:e.fulfilled)&&(null===(t=i[0])||void 0===t?void 0:t.value.includes("keyChanged"))&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){var t;if(this.sender&&this.activeServiceWorker&&((null===(t=null==navigator?void 0:navigator.serviceWorker)||void 0===t?void 0:t.controller)||null)===this.activeServiceWorker)try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch(e){}}async _isAvailable(){try{if(!indexedDB)return!1;let e=await _openDatabase();return await _putObject(e,ex,"1"),await _deleteObject(e,ex),!0}catch(e){}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(i=>_putObject(i,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){let t=await this._withRetries(t=>getObject(t,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>_deleteObject(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){let e=await this._withRetries(e=>{let t=getObjectStore(e,!1).getAll();return new DBPromise(t).toPromise()});if(!e||0!==this.pendingWrites)return[];let t=[],i=new Set;for(let{fbase_key:l,value:h}of e)i.add(l),JSON.stringify(this.localCache[l])!==JSON.stringify(h)&&(this.notifyListeners(l,h),t.push(l));for(let e of Object.keys(this.localCache))this.localCache[e]&&!i.has(e)&&(this.notifyListeners(e,null),t.push(e));return t}notifyListeners(e,t){this.localCache[e]=t;let i=this.listeners[e];if(i)for(let e of Array.from(i))e(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),800)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){0===Object.keys(this.listeners).length&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),0===this.listeners[e].size&&delete this.listeners[e]),0===Object.keys(this.listeners).length&&this.stopPolling()}};async function _verifyPhoneNumber(e,t,i){var l,h,u;let d=await i.verify();try{let f;if(_assert("string"==typeof d,e,"argument-error"),_assert("recaptcha"===i.type,e,"argument-error"),f="string"==typeof t?{phoneNumber:t}:t,"session"in f){let t=f.session;if("phoneNumber"in f){_assert("enroll"===t.type,e,"internal-error");let i=await (h={idToken:t.credential,phoneEnrollmentInfo:{phoneNumber:f.phoneNumber,recaptchaToken:d}},_performApiRequest(e,"POST","/v2/accounts/mfaEnrollment:start",_addTidIfNecessary(e,h)));return i.phoneSessionInfo.sessionInfo}{_assert("signin"===t.type,e,"internal-error");let i=(null===(l=f.multiFactorHint)||void 0===l?void 0:l.uid)||f.multiFactorUid;_assert(i,e,"missing-multi-factor-info");let h=await (u={mfaPendingCredential:t.credential,mfaEnrollmentId:i,phoneSignInInfo:{recaptchaToken:d}},_performApiRequest(e,"POST","/v2/accounts/mfaSignIn:start",_addTidIfNecessary(e,u)));return h.phoneResponseInfo.sessionInfo}}{let{sessionInfo:t}=await sendPhoneVerificationCode(e,{phoneNumber:f.phoneNumber,recaptchaToken:d});return t}}finally{i._reset()}}IndexedDBLocalPersistence.type="LOCAL",_generateCallbackName("rcb"),new Delay(3e4,6e4);/**
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
 */let PhoneAuthProvider=class PhoneAuthProvider{constructor(e){this.providerId=PhoneAuthProvider.PROVIDER_ID,this.auth=index_esm2017_getModularInstance(e)}verifyPhoneNumber(e,t){return _verifyPhoneNumber(this.auth,e,index_esm2017_getModularInstance(t))}static credential(e,t){return PhoneAuthCredential._fromVerification(e,t)}static credentialFromResult(e){return PhoneAuthProvider.credentialFromTaggedObject(e)}static credentialFromError(e){return PhoneAuthProvider.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{phoneNumber:t,temporaryProof:i}=e;return t&&i?PhoneAuthCredential._fromTokenResponse(t,i):null}};/**
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
 */let IdpCredential=class IdpCredential extends AuthCredential{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return signInWithIdp(e,this._buildIdpRequest())}_linkToIdToken(e,t){return signInWithIdp(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return signInWithIdp(e,this._buildIdpRequest())}_buildIdpRequest(e){let t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}};function _signIn(e){return _signInWithCredential(e.auth,new IdpCredential(e),e.bypassAuthState)}function _reauth(e){let{auth:t,user:i}=e;return _assert(i,t,"internal-error"),_reauthenticate(i,new IdpCredential(e),e.bypassAuthState)}async function _link(e){let{auth:t,user:i}=e;return _assert(i,t,"internal-error"),_link$1(i,new IdpCredential(e),e.bypassAuthState)}/**
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
 */let AbstractPopupRedirectOperation=class AbstractPopupRedirectOperation{constructor(e,t,i,l,h=!1){this.auth=e,this.resolver=i,this.user=l,this.bypassAuthState=h,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(e){this.reject(e)}})}async onAuthEvent(e){let{urlResponse:t,sessionId:i,postBody:l,tenantId:h,error:u,type:d}=e;if(u){this.reject(u);return}let f={auth:this.auth,requestUri:t,sessionId:i,tenantId:h||void 0,postBody:l||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(d)(f))}catch(e){this.reject(e)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return _signIn;case"linkViaPopup":case"linkViaRedirect":return _link;case"reauthViaPopup":case"reauthViaRedirect":return _reauth;default:_fail(this.auth,"internal-error")}}resolve(e){this.pendingPromise||debugFail("Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){this.pendingPromise||debugFail("Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}};/**
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
 */let eF=new Delay(2e3,1e4);async function signInWithPopup(e,t,i){let l=index_esm2017_getModularInstance(e);!function(e,t,i){if(!(t instanceof i))throw i.name!==t.constructor.name&&_fail(e,"argument-error"),_errorWithCustomMessage(e,"argument-error",`Type of ${t.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}(e,t,FederatedAuthProvider);let h=_withDefaultResolver(l,i),u=new PopupOperation(l,"signInViaPopup",t,h);return u.executeNotNull()}let PopupOperation=class PopupOperation extends AbstractPopupRedirectOperation{constructor(e,t,i,l,h){super(e,t,l,h),this.provider=i,this.authWindow=null,this.pollId=null,PopupOperation.currentPopupAction&&PopupOperation.currentPopupAction.cancel(),PopupOperation.currentPopupAction=this}async executeNotNull(){let e=await this.execute();return _assert(e,this.auth,"internal-error"),e}async onExecution(){1===this.filter.length||debugFail("Popup operations only handle one event");let e=_generateEventId();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(e=>{this.reject(e)}),this.resolver._isIframeWebStorageSupported(this.auth,e=>{e||this.reject(_createError(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return(null===(e=this.authWindow)||void 0===e?void 0:e.associatedEvent)||null}cancel(){this.reject(_createError(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,PopupOperation.currentPopupAction=null}pollUserCancellation(){let poll=()=>{var e,t;if(null===(t=null===(e=this.authWindow)||void 0===e?void 0:e.window)||void 0===t?void 0:t.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(_createError(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(poll,eF.get())};poll()}};PopupOperation.currentPopupAction=null;let ej=new Map;let RedirectAction=class RedirectAction extends AbstractPopupRedirectOperation{constructor(e,t,i=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,i),this.eventId=null}async execute(){let e=ej.get(this.auth._key());if(!e){try{let t=await _getAndClearPendingRedirectStatus(this.resolver,this.auth),i=t?await super.execute():null;e=()=>Promise.resolve(i)}catch(t){e=()=>Promise.reject(t)}ej.set(this.auth._key(),e)}return this.bypassAuthState||ej.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if("signInViaRedirect"===e.type)return super.onAuthEvent(e);if("unknown"===e.type){this.resolve(null);return}if(e.eventId){let t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}};async function _getAndClearPendingRedirectStatus(e,t){let i=_persistenceKeyName("pendingRedirect",t.config.apiKey,t.name),l=_getInstance(e._redirectPersistence);if(!await l._isAvailable())return!1;let h=await l._get(i)==="true";return await l._remove(i),h}function _overrideRedirectResult(e,t){ej.set(e._key(),t)}async function _getRedirectResult(e,t,i=!1){let l=index_esm2017_getModularInstance(e),h=_withDefaultResolver(l,t),u=new RedirectAction(l,h,i),d=await u.execute();return d&&!i&&(delete d.user._redirectEventId,await l._persistUserIfCurrent(d.user),await l._setRedirectUser(null,t)),d}let AuthEventManager=class AuthEventManager{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(i=>{this.isEventForConsumer(e,i)&&(t=!0,this.sendToConsumer(e,i),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!function(e){switch(e.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return isNullRedirectEvent(e);default:return!1}}(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var i;if(e.error&&!isNullRedirectEvent(e)){let l=(null===(i=e.error.code)||void 0===i?void 0:i.split("auth/")[1])||"internal-error";t.onError(_createError(this.auth,l))}else t.onAuthEvent(e)}isEventForConsumer(e,t){let i=null===t.eventId||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&i}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=6e5&&this.cachedEventUids.clear(),this.cachedEventUids.has(eventUid(e))}saveEventToCache(e){this.cachedEventUids.add(eventUid(e)),this.lastProcessedEventTime=Date.now()}};function eventUid(e){return[e.type,e.eventId,e.sessionId,e.tenantId].filter(e=>e).join("-")}function isNullRedirectEvent({type:e,error:t}){return"unknown"===e&&(null==t?void 0:t.code)==="auth/no-auth-event"}/**
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
 */let eB=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,eV=/^https?/;async function _validateOrigin(e){if(e.config.emulator)return;let{authorizedDomains:t}=await _getProjectConfig(e);for(let e of t)try{if(function(e){let t=_getCurrentUrl(),{protocol:i,hostname:l}=new URL(t);if(e.startsWith("chrome-extension://")){let h=new URL(e);return""===h.hostname&&""===l?"chrome-extension:"===i&&e.replace("chrome-extension://","")===t.replace("chrome-extension://",""):"chrome-extension:"===i&&h.hostname===l}if(!eV.test(i))return!1;if(eB.test(e))return l===e;let h=e.replace(/\./g,"\\."),u=RegExp("^(.+\\."+h+"|"+h+")$","i");return u.test(l)}(e))return}catch(e){}_fail(e,"unauthorized-domain")}/**
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
 */let eH=new Delay(3e4,6e4);function resetUnloadedGapiModules(){let e=_window().___jsl;if(null==e?void 0:e.H){for(let t of Object.keys(e.H))if(e.H[t].r=e.H[t].r||[],e.H[t].L=e.H[t].L||[],e.H[t].r=[...e.H[t].L],e.CP)for(let t=0;t<e.CP.length;t++)e.CP[t]=null}}let eW=null,ez=new Delay(5e3,15e3),e$={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},eq=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);async function _openIframe(e){let t=await (eW=eW||new Promise((t,i)=>{var l,h,u;function loadGapiIframe(){resetUnloadedGapiModules(),gapi.load("gapi.iframes",{callback:()=>{t(gapi.iframes.getContext())},ontimeout:()=>{resetUnloadedGapiModules(),i(_createError(e,"network-request-failed"))},timeout:eH.get()})}if(null===(h=null===(l=_window().gapi)||void 0===l?void 0:l.iframes)||void 0===h?void 0:h.Iframe)t(gapi.iframes.getContext());else if(null===(u=_window().gapi)||void 0===u?void 0:u.load)loadGapiIframe();else{let t=_generateCallbackName("iframefcb");return _window()[t]=()=>{gapi.load?loadGapiIframe():i(_createError(e,"network-request-failed"))},_loadJS(`https://apis.google.com/js/api.js?onload=${t}`).catch(e=>i(e))}}).catch(e=>{throw eW=null,e})),i=_window().gapi;return _assert(i,e,"internal-error"),t.open({where:document.body,url:function(e){let t=e.config;_assert(t.authDomain,e,"auth-domain-config-required");let i=t.emulator?_emulatorUrl(t,"emulator/auth/iframe"):`https://${e.config.authDomain}/__/auth/iframe`,l={apiKey:t.apiKey,appName:e.name,v:eS},h=eq.get(e.config.apiHost);h&&(l.eid=h);let u=e._getFrameworks();return u.length&&(l.fw=u.join(",")),`${i}?${index_esm2017_querystring(l).slice(1)}`}(e),messageHandlersFilter:i.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:e$,dontclear:!0},t=>new Promise(async(i,l)=>{await t.restyle({setHideOnLeave:!1});let h=_createError(e,"network-request-failed"),u=_window().setTimeout(()=>{l(h)},ez.get());function clearTimerAndResolve(){_window().clearTimeout(u),i(t)}t.ping(clearTimerAndResolve).then(clearTimerAndResolve,()=>{l(h)})}))}/**
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
 */let eK={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"};let AuthPopup=class AuthPopup{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch(e){}}};let eG=encodeURIComponent("fac");async function _getRedirectUrl(e,t,i,l,h,u){_assert(e.config.authDomain,e,"auth-domain-config-required"),_assert(e.config.apiKey,e,"invalid-api-key");let d={apiKey:e.config.apiKey,appName:e.name,authType:i,redirectUrl:l,v:eS,eventId:h};if(t instanceof FederatedAuthProvider)for(let[i,l]of(t.setDefaultLanguage(e.languageCode),d.providerId=t.providerId||"",!function(e){for(let t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}(t.getCustomParameters())&&(d.customParameters=JSON.stringify(t.getCustomParameters())),Object.entries(u||{})))d[i]=l;if(t instanceof BaseOAuthProvider){let e=t.getScopes().filter(e=>""!==e);e.length>0&&(d.scopes=e.join(","))}for(let t of(e.tenantId&&(d.tid=e.tenantId),Object.keys(d)))void 0===d[t]&&delete d[t];let f=await e._getAppCheckToken(),g=f?`#${eG}=${encodeURIComponent(f)}`:"";return`${function({config:e}){return e.emulator?_emulatorUrl(e,"emulator/auth/handler"):`https://${e.authDomain}/__/auth/handler`}(e)}?${index_esm2017_querystring(d).slice(1)}${g}`}/**
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
 */let eJ="webStorageSupport",eX=class{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=BrowserSessionPersistence,this._completeRedirectFn=_getRedirectResult,this._overrideRedirectResult=_overrideRedirectResult}async _openPopup(e,t,i,l){var h;(null===(h=this.eventManagers[e._key()])||void 0===h?void 0:h.manager)||debugFail("_initialize() not called before _openPopup()");let u=await _getRedirectUrl(e,t,i,_getCurrentUrl(),l);return function(e,t,i,l=500,h=600){let u=Math.max((window.screen.availHeight-h)/2,0).toString(),d=Math.max((window.screen.availWidth-l)/2,0).toString(),f="",g=Object.assign(Object.assign({},eK),{width:l.toString(),height:h.toString(),top:u,left:d}),m=index_esm2017_getUA().toLowerCase();i&&(f=_isChromeIOS(m)?"_blank":i),_isFirefox(m)&&(t=t||"http://localhost",g.scrollbars="yes");let _=Object.entries(g).reduce((e,[t,i])=>`${e}${t}=${i},`,"");if(function(e=index_esm2017_getUA()){var t;return _isIOS(e)&&!!(null===(t=window.navigator)||void 0===t?void 0:t.standalone)}(m)&&"_self"!==f)return function(e,t){let i=document.createElement("a");i.href=e,i.target=t;let l=document.createEvent("MouseEvent");l.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),i.dispatchEvent(l)}(t||"",f),new AuthPopup(null);let b=window.open(t||"",f,_);_assert(b,e,"popup-blocked");try{b.focus()}catch(e){}return new AuthPopup(b)}(e,u,_generateEventId())}async _openRedirect(e,t,i,l){await this._originValidation(e);let h=await _getRedirectUrl(e,t,i,_getCurrentUrl(),l);return _window().location.href=h,new Promise(()=>{})}_initialize(e){let t=e._key();if(this.eventManagers[t]){let{manager:e,promise:i}=this.eventManagers[t];return e?Promise.resolve(e):(i||debugFail("If manager is not set, promise should be"),i)}let i=this.initAndGetManager(e);return this.eventManagers[t]={promise:i},i.catch(()=>{delete this.eventManagers[t]}),i}async initAndGetManager(e){let t=await _openIframe(e),i=new AuthEventManager(e);return t.register("authEvent",t=>{_assert(null==t?void 0:t.authEvent,e,"invalid-auth-event");let l=i.onEvent(t.authEvent);return{status:l?"ACK":"ERROR"}},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:i},this.iframes[e._key()]=t,i}_isIframeWebStorageSupported(e,t){let i=this.iframes[e._key()];i.send(eJ,{type:eJ},i=>{var l;let h=null===(l=null==i?void 0:i[0])||void 0===l?void 0:l[eJ];void 0!==h&&t(!!h),_fail(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){let t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=_validateOrigin(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return _isMobileBrowser()||_isSafari()||_isIOS()}};let MultiFactorAssertionImpl=class MultiFactorAssertionImpl{constructor(e){this.factorId=e}_process(e,t,i){switch(t.type){case"enroll":return this._finalizeEnroll(e,t.credential,i);case"signin":return this._finalizeSignIn(e,t.credential);default:return debugFail("unexpected MultiFactorSessionType")}}};let PhoneMultiFactorAssertionImpl=class PhoneMultiFactorAssertionImpl extends MultiFactorAssertionImpl{constructor(e){super("phone"),this.credential=e}static _fromCredential(e){return new PhoneMultiFactorAssertionImpl(e)}_finalizeEnroll(e,t,i){return _performApiRequest(e,"POST","/v2/accounts/mfaEnrollment:finalize",_addTidIfNecessary(e,{idToken:t,displayName:i,phoneVerificationInfo:this.credential._makeVerificationRequest()}))}_finalizeSignIn(e,t){return _performApiRequest(e,"POST","/v2/accounts/mfaSignIn:finalize",_addTidIfNecessary(e,{mfaPendingCredential:t,phoneVerificationInfo:this.credential._makeVerificationRequest()}))}};let TotpMultiFactorAssertionImpl=class TotpMultiFactorAssertionImpl extends MultiFactorAssertionImpl{constructor(e,t,i){super("totp"),this.otp=e,this.enrollmentId=t,this.secret=i}static _fromSecret(e,t){return new TotpMultiFactorAssertionImpl(t,void 0,e)}static _fromEnrollmentId(e,t){return new TotpMultiFactorAssertionImpl(t,e)}async _finalizeEnroll(e,t,i){return _assert(void 0!==this.secret,e,"argument-error"),_performApiRequest(e,"POST","/v2/accounts/mfaEnrollment:finalize",_addTidIfNecessary(e,{idToken:t,displayName:i,totpVerificationInfo:this.secret._makeTotpVerificationInfo(this.otp)}))}async _finalizeSignIn(e,t){_assert(void 0!==this.enrollmentId&&void 0!==this.otp,e,"argument-error");let i={verificationCode:this.otp};return _performApiRequest(e,"POST","/v2/accounts/mfaSignIn:finalize",_addTidIfNecessary(e,{mfaPendingCredential:t,mfaEnrollmentId:this.enrollmentId,totpVerificationInfo:i}))}};let TotpSecret=class TotpSecret{constructor(e,t,i,l,h,u,d){this.sessionInfo=u,this.auth=d,this.secretKey=e,this.hashingAlgorithm=t,this.codeLength=i,this.codeIntervalSeconds=l,this.enrollmentCompletionDeadline=h}static _fromStartTotpMfaEnrollmentResponse(e,t){return new TotpSecret(e.totpSessionInfo.sharedSecretKey,e.totpSessionInfo.hashingAlgorithm,e.totpSessionInfo.verificationCodeLength,e.totpSessionInfo.periodSec,new Date(e.totpSessionInfo.finalizeEnrollmentTime).toUTCString(),e.totpSessionInfo.sessionInfo,t)}_makeTotpVerificationInfo(e){return{sessionInfo:this.sessionInfo,verificationCode:e}}generateQrCodeUrl(e,t){var i;let l=!1;return(_isEmptyString(e)||_isEmptyString(t))&&(l=!0),l&&(_isEmptyString(e)&&(e=(null===(i=this.auth.currentUser)||void 0===i?void 0:i.email)||"unknownuser"),_isEmptyString(t)&&(t=this.auth.name)),`otpauth://totp/${t}:${e}?secret=${this.secretKey}&issuer=${t}&algorithm=${this.hashingAlgorithm}&digits=${this.codeLength}`}};function _isEmptyString(e){return void 0===e||(null==e?void 0:e.length)===0}var eY="@firebase/auth",eQ="0.23.2";/**
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
 */let AuthInterop=class AuthInterop{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),(null===(e=this.auth.currentUser)||void 0===e?void 0:e.uid)||null}async getToken(e){if(this.assertAuthConfigured(),await this.auth._initializationPromise,!this.auth.currentUser)return null;let t=await this.auth.currentUser.getIdToken(e);return{accessToken:t}}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;let t=this.auth.onIdTokenChanged(t=>{e((null==t?void 0:t.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();let t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){_assert(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}};let eZ=getExperimentalSetting("authIdTokenMaxAge")||300,e0=null,mintCookieFactory=e=>async t=>{let i=t&&await t.getIdTokenResult(),l=i&&(new Date().getTime()-Date.parse(i.issuedAtTime))/1e3;if(l&&l>eZ)return;let h=null==i?void 0:i.token;e0!==h&&(e0=h,await fetch(e,{method:h?"POST":"DELETE",headers:h?{Authorization:`Bearer ${h}`}:{}}))};e9="Browser",_registerComponent(new Component("auth",(e,{options:t})=>{let i=e.getProvider("app").getImmediate(),l=e.getProvider("heartbeat"),h=e.getProvider("app-check-internal"),{apiKey:u,authDomain:d}=i.options;_assert(u&&!u.includes(":"),"invalid-api-key",{appName:i.name});let f={apiKey:u,authDomain:d,clientPlatform:e9,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:_getClientVersion(e9)},g=new AuthImpl(i,l,h,f);return function(e,t){let i=(null==t?void 0:t.persistence)||[],l=(Array.isArray(i)?i:[i]).map(_getInstance);(null==t?void 0:t.errorMap)&&e._updateErrorMap(t.errorMap),e._initializeWithPersistence(l,null==t?void 0:t.popupRedirectResolver)}(g,t),g},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,i)=>{let l=e.getProvider("auth-internal");l.initialize()})),_registerComponent(new Component("auth-internal",e=>{let t=index_esm2017_getModularInstance(e.getProvider("auth").getImmediate());return new AuthInterop(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),registerVersion(eY,eQ,/**
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
 */function(e){switch(e){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";default:return}}(e9)),registerVersion(eY,eQ,"esm2017"),/**
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
 */registerVersion("firebase","9.23.0","app");var e1,e2,e9,e4,e7,e6="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},e5={},e3=e3||{},e8=e6||self;function aa(e){var t=typeof e;return"array"==(t="object"!=t?t:e?Array.isArray(e)?"array":t:"null")||"object"==t&&"number"==typeof e.length}function p(e){var t=typeof e;return"object"==t&&null!=e||"function"==t}function ea(e,t,i){return e.call.apply(e.bind,arguments)}function fa(e,t,i){if(!e)throw Error();if(2<arguments.length){var l=Array.prototype.slice.call(arguments,2);return function(){var i=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(i,l),e.apply(t,i)}}return function(){return e.apply(t,arguments)}}function q(e,t,i){return(q=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ea:fa).apply(null,arguments)}function ha(e,t){var i=Array.prototype.slice.call(arguments,1);return function(){var t=i.slice();return t.push.apply(t,arguments),e.apply(this,t)}}function r(e,t){function c(){}c.prototype=t.prototype,e.$=t.prototype,e.prototype=new c,e.prototype.constructor=e,e.ac=function(e,i,l){for(var h=Array(arguments.length-2),u=2;u<arguments.length;u++)h[u-2]=arguments[u];return t.prototype[i].apply(e,h)}}function v(){this.s=this.s,this.o=this.o}v.prototype.s=!1,v.prototype.sa=function(){this.s||(this.s=!0,this.N())},v.prototype.N=function(){if(this.o)for(;this.o.length;)this.o.shift()()};let te=Array.prototype.indexOf?function(e,t){return Array.prototype.indexOf.call(e,t,void 0)}:function(e,t){if("string"==typeof e)return"string"!=typeof t||1!=t.length?-1:e.indexOf(t,0);for(let i=0;i<e.length;i++)if(i in e&&e[i]===t)return i;return -1};function ma(e){let t=e.length;if(0<t){let i=Array(t);for(let l=0;l<t;l++)i[l]=e[l];return i}return[]}function na(e,t){for(let t=1;t<arguments.length;t++){let i=arguments[t];if(aa(i)){let t=e.length||0,l=i.length||0;e.length=t+l;for(let h=0;h<l;h++)e[t+h]=i[h]}else e.push(i)}}function w(e,t){this.type=e,this.g=this.target=t,this.defaultPrevented=!1}w.prototype.h=function(){this.defaultPrevented=!0};var ti=function(){if(!e8.addEventListener||!Object.defineProperty)return!1;var e=!1,t=Object.defineProperty({},"passive",{get:function(){e=!0}});try{e8.addEventListener("test",()=>{},t),e8.removeEventListener("test",()=>{},t)}catch(e){}return e}();function x(e){return/^[\s\xa0]*$/.test(e)}function pa(){var e=e8.navigator;return e&&(e=e.userAgent)?e:""}function y(e){return -1!=pa().indexOf(e)}function qa(e){return qa[" "](e),e}qa[" "]=function(){};var tr=y("Opera"),tn=y("Trident")||y("MSIE"),ts=y("Edge"),to=ts||tn,ta=y("Gecko")&&!(-1!=pa().toLowerCase().indexOf("webkit")&&!y("Edge"))&&!(y("Trident")||y("MSIE"))&&!y("Edge"),tl=-1!=pa().toLowerCase().indexOf("webkit")&&!y("Edge");function ya(){var e=e8.document;return e?e.documentMode:void 0}e:{var tc,tu="",td=(tc=pa(),ta?/rv:([^\);]+)(\)|;)/.exec(tc):ts?/Edge\/([\d\.]+)/.exec(tc):tn?/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(tc):tl?/WebKit\/(\S+)/.exec(tc):tr?/(?:Version)[ \/]?(\S+)/.exec(tc):void 0);if(td&&(tu=td?td[1]:""),tn){var tp=ya();if(null!=tp&&tp>parseFloat(tu)){d=String(tp);break e}}d=tu}var tf=e8.document&&tn&&(ya()||parseInt(d,10))||void 0;function A(e,t){if(w.call(this,e?e.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,e){var i=this.type=e.type,l=e.changedTouches&&e.changedTouches.length?e.changedTouches[0]:null;if(this.target=e.target||e.srcElement,this.g=t,t=e.relatedTarget){if(ta){e:{try{qa(t.nodeName);var h=!0;break e}catch(e){}h=!1}h||(t=null)}}else"mouseover"==i?t=e.fromElement:"mouseout"==i&&(t=e.toElement);this.relatedTarget=t,l?(this.clientX=void 0!==l.clientX?l.clientX:l.pageX,this.clientY=void 0!==l.clientY?l.clientY:l.pageY,this.screenX=l.screenX||0,this.screenY=l.screenY||0):(this.clientX=void 0!==e.clientX?e.clientX:e.pageX,this.clientY=void 0!==e.clientY?e.clientY:e.pageY,this.screenX=e.screenX||0,this.screenY=e.screenY||0),this.button=e.button,this.key=e.key||"",this.ctrlKey=e.ctrlKey,this.altKey=e.altKey,this.shiftKey=e.shiftKey,this.metaKey=e.metaKey,this.pointerId=e.pointerId||0,this.pointerType="string"==typeof e.pointerType?e.pointerType:tg[e.pointerType]||"",this.state=e.state,this.i=e,e.defaultPrevented&&A.$.h.call(this)}}r(A,w);var tg={2:"touch",3:"pen",4:"mouse"};A.prototype.h=function(){A.$.h.call(this);var e=this.i;e.preventDefault?e.preventDefault():e.returnValue=!1};var tm="closure_listenable_"+(1e6*Math.random()|0),t_=0;function Ja(e,t,i,l,h){this.listener=e,this.proxy=null,this.src=t,this.type=i,this.capture=!!l,this.la=h,this.key=++t_,this.fa=this.ia=!1}function Ka(e){e.fa=!0,e.listener=null,e.proxy=null,e.src=null,e.la=null}function Na(e,t,i){for(let l in e)t.call(i,e[l],l,e)}function Pa(e){let t={};for(let i in e)t[i]=e[i];return t}let tv="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function Ra(e,t){let i,l;for(let t=1;t<arguments.length;t++){for(i in l=arguments[t])e[i]=l[i];for(let t=0;t<tv.length;t++)i=tv[t],Object.prototype.hasOwnProperty.call(l,i)&&(e[i]=l[i])}}function Sa(e){this.src=e,this.g={},this.h=0}function Ua(e,t){var i=t.type;if(i in e.g){var l,h=e.g[i],u=te(h,t);(l=0<=u)&&Array.prototype.splice.call(h,u,1),l&&(Ka(t),0==e.g[i].length&&(delete e.g[i],e.h--))}}function Ta(e,t,i,l){for(var h=0;h<e.length;++h){var u=e[h];if(!u.fa&&u.listener==t&&!!i==u.capture&&u.la==l)return h}return -1}Sa.prototype.add=function(e,t,i,l,h){var u=e.toString();(e=this.g[u])||(e=this.g[u]=[],this.h++);var d=Ta(e,t,l,h);return -1<d?(t=e[d],i||(t.ia=!1)):((t=new Ja(t,this.src,u,!!l,h)).ia=i,e.push(t)),t};var ty="closure_lm_"+(1e6*Math.random()|0),tb={};function ab(e,t,i,l,h,u){if(!t)throw Error("Invalid event type");var d=p(h)?!!h.capture:!!h,f=bb(e);if(f||(e[ty]=f=new Sa(e)),(i=f.add(t,i,l,d,u)).proxy)return i;if(l=function a(e){return eb.call(a.src,a.listener,e)},i.proxy=l,l.src=e,l.listener=i,e.addEventListener)ti||(h=d),void 0===h&&(h=!1),e.addEventListener(t.toString(),l,h);else if(e.attachEvent)e.attachEvent(db(t.toString()),l);else if(e.addListener&&e.removeListener)e.addListener(l);else throw Error("addEventListener and attachEvent are unavailable.");return i}function gb(e){if("number"!=typeof e&&e&&!e.fa){var t=e.src;if(t&&t[tm])Ua(t.i,e);else{var i=e.type,l=e.proxy;t.removeEventListener?t.removeEventListener(i,l,e.capture):t.detachEvent?t.detachEvent(db(i),l):t.addListener&&t.removeListener&&t.removeListener(l),(i=bb(t))?(Ua(i,e),0==i.h&&(i.src=null,t[ty]=null)):Ka(e)}}}function db(e){return e in tb?tb[e]:tb[e]="on"+e}function eb(e,t){if(e.fa)e=!0;else{t=new A(t,this);var i=e.listener,l=e.la||e.src;e.ia&&gb(e),e=i.call(l,t)}return e}function bb(e){return(e=e[ty])instanceof Sa?e:null}var tI="__closure_events_fn_"+(1e9*Math.random()>>>0);function $a(e){return"function"==typeof e?e:(e[tI]||(e[tI]=function(t){return e.handleEvent(t)}),e[tI])}function B(){v.call(this),this.i=new Sa(this),this.S=this,this.J=null}function C(e,t){var i,l=e.J;if(l)for(i=[];l;l=l.J)i.push(l);if(e=e.S,l=t.type||t,"string"==typeof t)t=new w(t,e);else if(t instanceof w)t.target=t.target||e;else{var h=t;Ra(t=new w(l,e),h)}if(h=!0,i)for(var u=i.length-1;0<=u;u--){var d=t.g=i[u];h=ib(d,l,!0,t)&&h}if(h=ib(d=t.g=e,l,!0,t)&&h,h=ib(d,l,!1,t)&&h,i)for(u=0;u<i.length;u++)h=ib(d=t.g=i[u],l,!1,t)&&h}function ib(e,t,i,l){if(!(t=e.i.g[String(t)]))return!0;t=t.concat();for(var h=!0,u=0;u<t.length;++u){var d=t[u];if(d&&!d.fa&&d.capture==i){var f=d.listener,g=d.la||d.src;d.ia&&Ua(e.i,d),h=!1!==f.call(g,l)&&h}}return h&&!l.defaultPrevented}r(B,v),B.prototype[tm]=!0,B.prototype.removeEventListener=function(e,t,i,l){!function fb(e,t,i,l,h){if(Array.isArray(t))for(var u=0;u<t.length;u++)fb(e,t[u],i,l,h);else(l=p(l)?!!l.capture:!!l,i=$a(i),e&&e[tm])?(e=e.i,(t=String(t).toString())in e.g&&-1<(i=Ta(u=e.g[t],i,l,h))&&(Ka(u[i]),Array.prototype.splice.call(u,i,1),0==u.length&&(delete e.g[t],e.h--))):e&&(e=bb(e))&&(t=e.g[t.toString()],e=-1,t&&(e=Ta(t,i,l,h)),(i=-1<e?t[e]:null)&&gb(i))}(this,e,t,i,l)},B.prototype.N=function(){if(B.$.N.call(this),this.i){var e,t=this.i;for(e in t.g){for(var i=t.g[e],l=0;l<i.length;l++)Ka(i[l]);delete t.g[e],t.h--}}this.J=null},B.prototype.O=function(e,t,i,l){return this.i.add(String(e),t,!1,i,l)},B.prototype.P=function(e,t,i,l){return this.i.add(String(e),t,!0,i,l)};var tw=e8.JSON.stringify,tE=new class{constructor(e,t){this.i=e,this.j=t,this.h=0,this.g=null}get(){let e;return 0<this.h?(this.h--,e=this.g,this.g=e.next,e.next=null):e=this.i(),e}}(()=>new pb,e=>e.reset());let pb=class pb{constructor(){this.next=this.g=this.h=null}set(e,t){this.h=e,this.g=t,this.next=null}reset(){this.next=this.g=this.h=null}};let tT,tS=!1,tA=new class{constructor(){this.h=this.g=null}add(e,t){let i=tE.get();i.set(e,t),this.h?this.h.next=i:this.g=i,this.h=i}},vb=()=>{let e=e8.Promise.resolve(void 0);tT=()=>{e.then(ub)}};var ub=()=>{let e;for(var t;e=null,tA.g&&(e=tA.g,tA.g=tA.g.next,tA.g||(tA.h=null),e.next=null),t=e;){try{t.h.call(t.g)}catch(e){!function(e){e8.setTimeout(()=>{throw e},0)}(e)}tE.j(t),100>tE.h&&(tE.h++,t.next=tE.g,tE.g=t)}tS=!1};function wb(e,t){B.call(this),this.h=e||1,this.g=t||e8,this.j=q(this.qb,this),this.l=Date.now()}function xb(e){e.ga=!1,e.T&&(e.g.clearTimeout(e.T),e.T=null)}function yb(e,t,i){if("function"==typeof e)i&&(e=q(e,i));else if(e&&"function"==typeof e.handleEvent)e=q(e.handleEvent,e);else throw Error("Invalid listener argument");return 2147483647<Number(t)?-1:e8.setTimeout(e,t||0)}r(wb,B),(e7=wb.prototype).ga=!1,e7.T=null,e7.qb=function(){if(this.ga){var e=Date.now()-this.l;0<e&&e<.8*this.h?this.T=this.g.setTimeout(this.j,this.h-e):(this.T&&(this.g.clearTimeout(this.T),this.T=null),C(this,"tick"),this.ga&&(xb(this),this.start()))}},e7.start=function(){this.ga=!0,this.T||(this.T=this.g.setTimeout(this.j,this.h),this.l=Date.now())},e7.N=function(){wb.$.N.call(this),xb(this),delete this.g};let Ab=class Ab extends v{constructor(e,t){super(),this.m=e,this.j=t,this.h=null,this.i=!1,this.g=null}l(e){this.h=arguments,this.g?this.i=!0:function zb(e){e.g=yb(()=>{e.g=null,e.i&&(e.i=!1,zb(e))},e.j);let t=e.h;e.h=null,e.m.apply(null,t)}(this)}N(){super.N(),this.g&&(e8.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}};function Bb(e){v.call(this),this.h=e,this.g={}}r(Bb,v);var tC=[];function Db(e,t,i,l){Array.isArray(i)||(i&&(tC[0]=i.toString()),i=tC);for(var h=0;h<i.length;h++){var u=function Ya(e,t,i,l,h){if(l&&l.once)return function Za(e,t,i,l,h){if(Array.isArray(t)){for(var u=0;u<t.length;u++)Za(e,t[u],i,l,h);return null}return i=$a(i),e&&e[tm]?e.P(t,i,p(l)?!!l.capture:!!l,h):ab(e,t,i,!0,l,h)}(e,t,i,l,h);if(Array.isArray(t)){for(var u=0;u<t.length;u++)Ya(e,t[u],i,l,h);return null}return i=$a(i),e&&e[tm]?e.O(t,i,p(l)?!!l.capture:!!l,h):ab(e,t,i,!1,l,h)}(t,i[h],l||e.handleEvent,!1,e.h||e);if(!u)break;e.g[u.key]=u}}function Fb(e){Na(e.g,function(e,t){this.g.hasOwnProperty(t)&&gb(e)},e),e.g={}}function Gb(){this.g=!0}function D(e,t,i,l){e.info(function(){return"XMLHTTP TEXT ("+t+"): "+function(e,t){if(!e.g)return t;if(!t)return null;try{var i=JSON.parse(t);if(i){for(e=0;e<i.length;e++)if(Array.isArray(i[e])){var l=i[e];if(!(2>l.length)){var h=l[1];if(Array.isArray(h)&&!(1>h.length)){var u=h[0];if("noop"!=u&&"stop"!=u&&"close"!=u)for(var d=1;d<h.length;d++)h[d]=""}}}}return tw(i)}catch(e){return t}}(e,i)+(l?" "+l:"")})}Bb.prototype.N=function(){Bb.$.N.call(this),Fb(this)},Bb.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")},Gb.prototype.Ea=function(){this.g=!1},Gb.prototype.info=function(){};var tk={},tP=null;function Mb(){return tP=tP||new B}function Nb(e){w.call(this,tk.Ta,e)}function Ob(e){let t=Mb();C(t,new Nb(t))}function Pb(e,t){w.call(this,tk.STAT_EVENT,e),this.stat=t}function F(e){let t=Mb();C(t,new Pb(t,e))}function Qb(e,t){w.call(this,tk.Ua,e),this.size=t}function Rb(e,t){if("function"!=typeof e)throw Error("Fn must not be null and must be a function");return e8.setTimeout(function(){e()},t)}tk.Ta="serverreachability",r(Nb,w),tk.STAT_EVENT="statevent",r(Pb,w),tk.Ua="timingevent",r(Qb,w);var tR={NO_ERROR:0,rb:1,Eb:2,Db:3,yb:4,Cb:5,Fb:6,Qa:7,TIMEOUT:8,Ib:9},tO={wb:"complete",Sb:"success",Ra:"error",Qa:"abort",Kb:"ready",Lb:"readystatechange",TIMEOUT:"timeout",Gb:"incrementaldata",Jb:"progress",zb:"downloadprogress",$b:"uploadprogress"};function Ub(){}function Vb(e){return e.h||(e.h=e.i())}function Wb(){}Ub.prototype.h=null;var tN={OPEN:"a",vb:"b",Ra:"c",Hb:"d"};function Yb(){w.call(this,"d")}function Zb(){w.call(this,"c")}function ac(){}function bc(e,t,i,l){this.l=e,this.j=t,this.m=i,this.W=l||1,this.U=new Bb(this),this.P=tD,e=to?125:void 0,this.V=new wb(e),this.I=null,this.i=!1,this.s=this.A=this.v=this.L=this.G=this.Y=this.B=null,this.F=[],this.g=null,this.C=0,this.o=this.u=null,this.ca=-1,this.J=!1,this.O=0,this.M=null,this.ba=this.K=this.aa=this.S=!1,this.h=new dc}function dc(){this.i=null,this.g="",this.h=!1}r(Yb,w),r(Zb,w),r(ac,Ub),ac.prototype.g=function(){return new XMLHttpRequest},ac.prototype.i=function(){return{}},g=new ac;var tD=45e3,tx={},tL={};function gc(e,t,i){e.L=1,e.v=hc(G(t)),e.s=i,e.S=!0,ic(e,null)}function ic(e,t){e.G=Date.now(),jc(e),e.A=G(e.v);var i=e.A,l=e.W;Array.isArray(l)||(l=[String(l)]),kc(i.i,"t",l),e.C=0,i=e.l.J,e.h=new dc,e.g=lc(e.l,i?t:null,!e.s),0<e.O&&(e.M=new Ab(q(e.Pa,e,e.g),e.O)),Db(e.U,e.g,"readystatechange",e.nb),t=e.I?Pa(e.I):{},e.s?(e.u||(e.u="POST"),t["Content-Type"]="application/x-www-form-urlencoded",e.g.ha(e.A,e.u,e.s,t)):(e.u="GET",e.g.ha(e.A,e.u,null,t)),Ob(),function(e,t,i,l,h,u){e.info(function(){if(e.g){if(u)for(var d="",f=u.split("&"),g=0;g<f.length;g++){var m=f[g].split("=");if(1<m.length){var _=m[0];m=m[1];var b=_.split("_");d=2<=b.length&&"type"==b[1]?d+(_+"=")+m+"&":d+(_+"=redacted&")}}else d=null}else d=u;return"XMLHTTP REQ ("+l+") [attempt "+h+"]: "+t+"\n"+i+"\n"+d})}(e.j,e.u,e.A,e.m,e.W,e.s)}function oc(e){return!!e.g&&"GET"==e.u&&2!=e.L&&e.l.Ha}function rc(e,t,i){let l=!0,h;for(;!e.J&&e.C<i.length;)if((h=function(e,t){var i=e.C,l=t.indexOf("\n",i);return -1==l?tL:isNaN(i=Number(t.substring(i,l)))?tx:(l+=1)+i>t.length?tL:(t=t.slice(l,l+i),e.C=l+i,t)}(e,i))==tL){4==t&&(e.o=4,F(14),l=!1),D(e.j,e.m,null,"[Incomplete Response]");break}else if(h==tx){e.o=4,F(15),D(e.j,e.m,i,"[Invalid Chunk]"),l=!1;break}else D(e.j,e.m,h,null),qc(e,h);oc(e)&&h!=tL&&h!=tx&&(e.h.g="",e.C=0),4!=t||0!=i.length||e.h.h||(e.o=1,F(16),l=!1),e.i=e.i&&l,l?0<i.length&&!e.ba&&(e.ba=!0,(t=e.l).g==e&&t.ca&&!t.M&&(t.l.info("Great, no buffering proxy detected. Bytes received: "+i.length),vc(t),t.M=!0,F(11))):(D(e.j,e.m,i,"[Invalid Chunked Response]"),I(e),pc(e))}function jc(e){e.Y=Date.now()+e.P,wc(e,e.P)}function wc(e,t){if(null!=e.B)throw Error("WatchDog timer not null");e.B=Rb(q(e.lb,e),t)}function nc(e){e.B&&(e8.clearTimeout(e.B),e.B=null)}function pc(e){0==e.l.H||e.J||sc(e.l,e)}function I(e){nc(e);var t=e.M;t&&"function"==typeof t.sa&&t.sa(),e.M=null,xb(e.V),Fb(e.U),e.g&&(t=e.g,e.g=null,t.abort(),t.sa())}function qc(e,t){try{var i=e.l;if(0!=i.H&&(i.g==e||xc(i.i,e))){if(!e.K&&xc(i.i,e)&&3==i.H){try{var l=i.Ja.g.parse(t)}catch(e){l=null}if(Array.isArray(l)&&3==l.length){var h=l;if(0==h[0]){e:if(!i.u){if(i.g){if(i.g.G+3e3<e.G)yc(i),zc(i);else break e}Ac(i),F(18)}}else i.Fa=h[1],0<i.Fa-i.V&&37500>h[2]&&i.G&&0==i.A&&!i.v&&(i.v=Rb(q(i.ib,i),6e3));if(1>=Bc(i.i)&&i.oa){try{i.oa()}catch(e){}i.oa=void 0}}else J(i,11)}else if((e.K||i.g==e)&&yc(i),!x(t))for(h=i.Ja.g.parse(t),t=0;t<h.length;t++){let f=h[t];if(i.V=f[0],f=f[1],2==i.H){if("c"==f[0]){i.K=f[1],i.pa=f[2];let t=f[3];null!=t&&(i.ra=t,i.l.info("VER="+i.ra));let h=f[4];null!=h&&(i.Ga=h,i.l.info("SVER="+i.Ga));let g=f[5];null!=g&&"number"==typeof g&&0<g&&(l=1.5*g,i.L=l,i.l.info("backChannelRequestTimeoutMs_="+l)),l=i;let m=e.g;if(m){let e=m.g?m.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(e){var u=l.i;u.g||-1==e.indexOf("spdy")&&-1==e.indexOf("quic")&&-1==e.indexOf("h2")||(u.j=u.l,u.g=new Set,u.h&&(Cc(u,u.h),u.h=null))}if(l.F){let e=m.g?m.g.getResponseHeader("X-HTTP-Session-Id"):null;e&&(l.Da=e,K(l.I,l.F,e))}}if(i.H=3,i.h&&i.h.Ba(),i.ca&&(i.S=Date.now()-e.G,i.l.info("Handshake RTT: "+i.S+"ms")),(l=i).wa=Dc(l,l.J?l.pa:null,l.Y),e.K){Ec(l.i,e);var d=l.L;d&&e.setTimeout(d),e.B&&(nc(e),jc(e)),l.g=e}else Fc(l);0<i.j.length&&Gc(i)}else"stop"!=f[0]&&"close"!=f[0]||J(i,7)}else 3==i.H&&("stop"==f[0]||"close"==f[0]?"stop"==f[0]?J(i,7):Hc(i):"noop"!=f[0]&&i.h&&i.h.Aa(f),i.A=0)}}Ob(4)}catch(e){}}function Kc(e,t){if(e.forEach&&"function"==typeof e.forEach)e.forEach(t,void 0);else if(aa(e)||"string"==typeof e)Array.prototype.forEach.call(e,t,void 0);else for(var i=function(e){if(e.ta&&"function"==typeof e.ta)return e.ta();if(!e.Z||"function"!=typeof e.Z){if("undefined"!=typeof Map&&e instanceof Map)return Array.from(e.keys());if(!("undefined"!=typeof Set&&e instanceof Set)){if(aa(e)||"string"==typeof e){var t=[];e=e.length;for(var i=0;i<e;i++)t.push(i);return t}for(let l in t=[],i=0,e)t[i++]=l;return t}}}(e),l=function(e){if(e.Z&&"function"==typeof e.Z)return e.Z();if("undefined"!=typeof Map&&e instanceof Map||"undefined"!=typeof Set&&e instanceof Set)return Array.from(e.values());if("string"==typeof e)return e.split("");if(aa(e)){for(var t=[],i=e.length,l=0;l<i;l++)t.push(e[l]);return t}for(l in t=[],i=0,e)t[i++]=e[l];return t}(e),h=l.length,u=0;u<h;u++)t.call(void 0,l[u],i&&i[u],e)}(e7=bc.prototype).setTimeout=function(e){this.P=e},e7.nb=function(e){e=e.target;let t=this.M;t&&3==H(e)?t.l():this.Pa(e)},e7.Pa=function(e){try{if(e==this.g)e:{let _=H(this.g);var t=this.g.Ia();let b=this.g.da();if(!(3>_)&&(3!=_||to||this.g&&(this.h.h||this.g.ja()||mc(this.g)))){this.J||4!=_||7==t||(8==t||0>=b?Ob(3):Ob(2)),nc(this);var i=this.g.da();this.ca=i;t:if(oc(this)){var l=mc(this.g);e="";var h=l.length,u=4==H(this.g);if(!this.h.i){if("undefined"==typeof TextDecoder){I(this),pc(this);var d="";break t}this.h.i=new e8.TextDecoder}for(t=0;t<h;t++)this.h.h=!0,e+=this.h.i.decode(l[t],{stream:u&&t==h-1});l.splice(0,h),this.h.g+=e,this.C=0,d=this.h.g}else d=this.g.ja();if(this.i=200==i,function(e,t,i,l,h,u,d){e.info(function(){return"XMLHTTP RESP ("+l+") [ attempt "+h+"]: "+t+"\n"+i+"\n"+u+" "+d})}(this.j,this.u,this.A,this.m,this.W,_,i),this.i){if(this.aa&&!this.K){t:{if(this.g){var f,g=this.g;if((f=g.g?g.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!x(f)){var m=f;break t}}m=null}if(i=m)D(this.j,this.m,i,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,qc(this,i);else{this.i=!1,this.o=3,F(12),I(this),pc(this);break e}}this.S?(rc(this,_,d),to&&this.i&&3==_&&(Db(this.U,this.V,"tick",this.mb),this.V.start())):(D(this.j,this.m,d,null),qc(this,d)),4==_&&I(this),this.i&&!this.J&&(4==_?sc(this.l,this):(this.i=!1,jc(this)))}else(function(e){let t={};e=(e.g&&2<=H(e)&&e.g.getAllResponseHeaders()||"").split("\r\n");for(let l=0;l<e.length;l++){if(x(e[l]))continue;var i=function(e){var t=1;e=e.split(":");let i=[];for(;0<t&&e.length;)i.push(e.shift()),t--;return e.length&&i.push(e.join(":")),i}(e[l]);let h=i[0];if("string"!=typeof(i=i[1]))continue;i=i.trim();let u=t[h]||[];t[h]=u,u.push(i)}!function(e,t){for(let i in e)t.call(void 0,e[i],i,e)}(t,function(e){return e.join(", ")})})(this.g),400==i&&0<d.indexOf("Unknown SID")?(this.o=3,F(12)):(this.o=0,F(13)),I(this),pc(this)}}}catch(e){}finally{}},e7.mb=function(){if(this.g){var e=H(this.g),t=this.g.ja();this.C<t.length&&(nc(this),rc(this,e,t),this.i&&4!=e&&jc(this))}},e7.cancel=function(){this.J=!0,I(this)},e7.lb=function(){this.B=null;let e=Date.now();0<=e-this.Y?(function(e,t){e.info(function(){return"TIMEOUT: "+t})}(this.j,this.A),2!=this.L&&(Ob(),F(17)),I(this),this.o=2,pc(this)):wc(this,this.Y-e)};var tM=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function M(e){if(this.g=this.s=this.j="",this.m=null,this.o=this.l="",this.h=!1,e instanceof M){this.h=e.h,Nc(this,e.j),this.s=e.s,this.g=e.g,Oc(this,e.m),this.l=e.l;var t=e.i,i=new Pc;i.i=t.i,t.g&&(i.g=new Map(t.g),i.h=t.h),Qc(this,i),this.o=e.o}else e&&(t=String(e).match(tM))?(this.h=!1,Nc(this,t[1]||"",!0),this.s=Rc(t[2]||""),this.g=Rc(t[3]||"",!0),Oc(this,t[4]),this.l=Rc(t[5]||"",!0),Qc(this,t[6]||"",!0),this.o=Rc(t[7]||"")):(this.h=!1,this.i=new Pc(null,this.h))}function G(e){return new M(e)}function Nc(e,t,i){e.j=i?Rc(t,!0):t,e.j&&(e.j=e.j.replace(/:$/,""))}function Oc(e,t){if(t){if(isNaN(t=Number(t))||0>t)throw Error("Bad port number "+t);e.m=t}else e.m=null}function Qc(e,t,i){var l,h;t instanceof Pc?(e.i=t,l=e.i,(h=e.h)&&!l.j&&(N(l),l.i=null,l.g.forEach(function(e,t){var i=t.toLowerCase();t!=i&&($c(this,t),kc(this,i,e))},l)),l.j=h):(i||(t=Sc(t,tB)),e.i=new Pc(t,e.h))}function K(e,t,i){e.i.set(t,i)}function hc(e){return K(e,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),e}function Rc(e,t){return e?t?decodeURI(e.replace(/%25/g,"%2525")):decodeURIComponent(e):""}function Sc(e,t,i){return"string"==typeof e?(e=encodeURI(e).replace(t,Zc),i&&(e=e.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),e):null}function Zc(e){return"%"+((e=e.charCodeAt(0))>>4&15).toString(16)+(15&e).toString(16)}M.prototype.toString=function(){var e=[],t=this.j;t&&e.push(Sc(t,tU,!0),":");var i=this.g;return(i||"file"==t)&&(e.push("//"),(t=this.s)&&e.push(Sc(t,tU,!0),"@"),e.push(encodeURIComponent(String(i)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),null!=(i=this.m)&&e.push(":",String(i))),(i=this.l)&&(this.g&&"/"!=i.charAt(0)&&e.push("/"),e.push(Sc(i,"/"==i.charAt(0)?tj:tF,!0))),(i=this.i.toString())&&e.push("?",i),(i=this.o)&&e.push("#",Sc(i,tV)),e.join("")};var tU=/[#\/\?@]/g,tF=/[#\?:]/g,tj=/[#\?]/g,tB=/[#\?@]/g,tV=/#/g;function Pc(e,t){this.h=this.g=null,this.i=e||null,this.j=!!t}function N(e){e.g||(e.g=new Map,e.h=0,e.i&&function(e,t){if(e){e=e.split("&");for(var i=0;i<e.length;i++){var l=e[i].indexOf("="),h=null;if(0<=l){var u=e[i].substring(0,l);h=e[i].substring(l+1)}else u=e[i];t(u,h?decodeURIComponent(h.replace(/\+/g," ")):"")}}}(e.i,function(t,i){e.add(decodeURIComponent(t.replace(/\+/g," ")),i)}))}function $c(e,t){N(e),t=O(e,t),e.g.has(t)&&(e.i=null,e.h-=e.g.get(t).length,e.g.delete(t))}function ad(e,t){return N(e),t=O(e,t),e.g.has(t)}function kc(e,t,i){$c(e,t),0<i.length&&(e.i=null,e.g.set(O(e,t),ma(i)),e.h+=i.length)}function O(e,t){return t=String(t),e.j&&(t=t.toLowerCase()),t}(e7=Pc.prototype).add=function(e,t){N(this),this.i=null,e=O(this,e);var i=this.g.get(e);return i||this.g.set(e,i=[]),i.push(t),this.h+=1,this},e7.forEach=function(e,t){N(this),this.g.forEach(function(i,l){i.forEach(function(i){e.call(t,i,l,this)},this)},this)},e7.ta=function(){N(this);let e=Array.from(this.g.values()),t=Array.from(this.g.keys()),i=[];for(let l=0;l<t.length;l++){let h=e[l];for(let e=0;e<h.length;e++)i.push(t[l])}return i},e7.Z=function(e){N(this);let t=[];if("string"==typeof e)ad(this,e)&&(t=t.concat(this.g.get(O(this,e))));else{e=Array.from(this.g.values());for(let i=0;i<e.length;i++)t=t.concat(e[i])}return t},e7.set=function(e,t){return N(this),this.i=null,ad(this,e=O(this,e))&&(this.h-=this.g.get(e).length),this.g.set(e,[t]),this.h+=1,this},e7.get=function(e,t){return e&&0<(e=this.Z(e)).length?String(e[0]):t},e7.toString=function(){if(this.i)return this.i;if(!this.g)return"";let e=[],t=Array.from(this.g.keys());for(var i=0;i<t.length;i++){var l=t[i];let u=encodeURIComponent(String(l)),d=this.Z(l);for(l=0;l<d.length;l++){var h=u;""!==d[l]&&(h+="="+encodeURIComponent(String(d[l]))),e.push(h)}}return this.i=e.join("&")};var tH=class{constructor(e,t){this.g=e,this.map=t}};function cd(e){this.l=e||tW,e=e8.PerformanceNavigationTiming?0<(e=e8.performance.getEntriesByType("navigation")).length&&("hq"==e[0].nextHopProtocol||"h2"==e[0].nextHopProtocol):!!(e8.g&&e8.g.Ka&&e8.g.Ka()&&e8.g.Ka().ec),this.j=e?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}var tW=10;function ed(e){return!!e.h||!!e.g&&e.g.size>=e.j}function Bc(e){return e.h?1:e.g?e.g.size:0}function xc(e,t){return e.h?e.h==t:!!e.g&&e.g.has(t)}function Cc(e,t){e.g?e.g.add(t):e.h=t}function Ec(e,t){e.h&&e.h==t?e.h=null:e.g&&e.g.has(t)&&e.g.delete(t)}function fd(e){if(null!=e.h)return e.i.concat(e.h.F);if(null!=e.g&&0!==e.g.size){let t=e.i;for(let i of e.g.values())t=t.concat(i.F);return t}return ma(e.i)}cd.prototype.cancel=function(){if(this.i=fd(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&0!==this.g.size){for(let e of this.g.values())e.cancel();this.g.clear()}};var tz=class{stringify(e){return e8.JSON.stringify(e,void 0)}parse(e){return e8.JSON.parse(e,void 0)}};function hd(){this.g=new tz}function kd(e,t,i,l,h){try{t.onload=null,t.onerror=null,t.onabort=null,t.ontimeout=null,h(l)}catch(e){}}function ld(e){this.l=e.fc||null,this.j=e.ob||!1}function md(e,t){B.call(this),this.F=e,this.u=t,this.m=void 0,this.readyState=t$,this.status=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.v=new Headers,this.h=null,this.C="GET",this.B="",this.g=!1,this.A=this.j=this.l=null}r(ld,Ub),ld.prototype.g=function(){return new md(this.l,this.j)},ld.prototype.i=(u={},function(){return u}),r(md,B);var t$=0;function qd(e){e.j.read().then(e.Xa.bind(e)).catch(e.ka.bind(e))}function pd(e){e.readyState=4,e.l=null,e.j=null,e.A=null,od(e)}function od(e){e.onreadystatechange&&e.onreadystatechange.call(e)}(e7=md.prototype).open=function(e,t){if(this.readyState!=t$)throw this.abort(),Error("Error reopening a connection");this.C=e,this.B=t,this.readyState=1,od(this)},e7.send=function(e){if(1!=this.readyState)throw this.abort(),Error("need to call open() first. ");this.g=!0;let t={headers:this.v,method:this.C,credentials:this.m,cache:void 0};e&&(t.body=e),(this.F||e8).fetch(new Request(this.B,t)).then(this.$a.bind(this),this.ka.bind(this))},e7.abort=function(){this.response=this.responseText="",this.v=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&4!=this.readyState&&(this.g=!1,pd(this)),this.readyState=t$},e7.$a=function(e){if(this.g&&(this.l=e,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=e.headers,this.readyState=2,od(this)),this.g&&(this.readyState=3,od(this),this.g))){if("arraybuffer"===this.responseType)e.arrayBuffer().then(this.Ya.bind(this),this.ka.bind(this));else if(void 0!==e8.ReadableStream&&"body"in e){if(this.j=e.body.getReader(),this.u){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.A=new TextDecoder;qd(this)}else e.text().then(this.Za.bind(this),this.ka.bind(this))}},e7.Xa=function(e){if(this.g){if(this.u&&e.value)this.response.push(e.value);else if(!this.u){var t=e.value?e.value:new Uint8Array(0);(t=this.A.decode(t,{stream:!e.done}))&&(this.response=this.responseText+=t)}e.done?pd(this):od(this),3==this.readyState&&qd(this)}},e7.Za=function(e){this.g&&(this.response=this.responseText=e,pd(this))},e7.Ya=function(e){this.g&&(this.response=e,pd(this))},e7.ka=function(){this.g&&pd(this)},e7.setRequestHeader=function(e,t){this.v.append(e,t)},e7.getResponseHeader=function(e){return this.h&&this.h.get(e.toLowerCase())||""},e7.getAllResponseHeaders=function(){if(!this.h)return"";let e=[],t=this.h.entries();for(var i=t.next();!i.done;)e.push((i=i.value)[0]+": "+i[1]),i=t.next();return e.join("\r\n")},Object.defineProperty(md.prototype,"withCredentials",{get:function(){return"include"===this.m},set:function(e){this.m=e?"include":"same-origin"}});var tq=e8.JSON.parse;function P(e){B.call(this),this.headers=new Map,this.u=e||null,this.h=!1,this.C=this.g=null,this.I="",this.m=0,this.j="",this.l=this.G=this.v=this.F=!1,this.B=0,this.A=null,this.K=tK,this.L=this.M=!1}r(P,B);var tK="",tG=/^https?$/i,tJ=["POST","PUT"];function vd(e,t){e.h=!1,e.g&&(e.l=!0,e.g.abort(),e.l=!1),e.j=t,e.m=5,yd(e),zd(e)}function yd(e){e.F||(e.F=!0,C(e,"complete"),C(e,"error"))}function Ad(e){if(e.h&&void 0!==e3&&(!e.C[1]||4!=H(e)||2!=e.da())){if(e.v&&4==H(e))yb(e.La,0,e);else if(C(e,"readystatechange"),4==H(e)){e.h=!1;try{let d=e.da();switch(d){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var t,i,l=!0;break;default:l=!1}if(!(t=l)){if(i=0===d){var h=String(e.I).match(tM)[1]||null;!h&&e8.self&&e8.self.location&&(h=e8.self.location.protocol.slice(0,-1)),i=!tG.test(h?h.toLowerCase():"")}t=i}if(t)C(e,"complete"),C(e,"success");else{e.m=6;try{var u=2<H(e)?e.g.statusText:""}catch(e){u=""}e.j=u+" ["+e.da()+"]",yd(e)}}finally{zd(e)}}}}function zd(e,t){if(e.g){wd(e);let i=e.g,l=e.C[0]?()=>{}:null;e.g=null,e.C=null,t||C(e,"ready");try{i.onreadystatechange=l}catch(e){}}}function wd(e){e.g&&e.L&&(e.g.ontimeout=null),e.A&&(e8.clearTimeout(e.A),e.A=null)}function H(e){return e.g?e.g.readyState:0}function mc(e){try{if(!e.g)return null;if("response"in e.g)return e.g.response;switch(e.K){case tK:case"text":return e.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in e.g)return e.g.mozResponseArrayBuffer}return null}catch(e){return null}}function Bd(e){let t="";return Na(e,function(e,i){t+=i+":"+e+"\r\n"}),t}function Cd(e,t,i){e:{for(l in i){var l=!1;break e}l=!0}l||(i=Bd(i),"string"==typeof e?null!=i&&encodeURIComponent(String(i)):K(e,t,i))}function Dd(e,t,i){return i&&i.internalChannelParams&&i.internalChannelParams[e]||t}function Ed(e){this.Ga=0,this.j=[],this.l=new Gb,this.pa=this.wa=this.I=this.Y=this.g=this.Da=this.F=this.na=this.o=this.U=this.s=null,this.fb=this.W=0,this.cb=Dd("failFast",!1,e),this.G=this.v=this.u=this.m=this.h=null,this.aa=!0,this.Fa=this.V=-1,this.ba=this.A=this.C=0,this.ab=Dd("baseRetryDelayMs",5e3,e),this.hb=Dd("retryDelaySeedMs",1e4,e),this.eb=Dd("forwardChannelMaxRetries",2,e),this.xa=Dd("forwardChannelRequestTimeoutMs",2e4,e),this.va=e&&e.xmlHttpFactory||void 0,this.Ha=e&&e.dc||!1,this.L=void 0,this.J=e&&e.supportsCrossDomainXhr||!1,this.K="",this.i=new cd(e&&e.concurrentRequestLimit),this.Ja=new hd,this.P=e&&e.fastHandshake||!1,this.O=e&&e.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.bb=e&&e.bc||!1,e&&e.Ea&&this.l.Ea(),e&&e.forceLongPolling&&(this.aa=!1),this.ca=!this.P&&this.aa&&e&&e.detectBufferingProxy||!1,this.qa=void 0,e&&e.longPollingTimeout&&0<e.longPollingTimeout&&(this.qa=e.longPollingTimeout),this.oa=void 0,this.S=0,this.M=!1,this.ma=this.B=null}function Hc(e){if(Fd(e),3==e.H){var t=e.W++,i=G(e.I);if(K(i,"SID",e.K),K(i,"RID",t),K(i,"TYPE","terminate"),Gd(e,i),(t=new bc(e,e.l,t)).L=2,t.v=hc(G(i)),i=!1,e8.navigator&&e8.navigator.sendBeacon)try{i=e8.navigator.sendBeacon(t.v.toString(),"")}catch(e){}!i&&e8.Image&&((new Image).src=t.v,i=!0),i||(t.g=lc(t.l,null),t.g.ha(t.v)),t.G=Date.now(),jc(t)}Hd(e)}function zc(e){e.g&&(vc(e),e.g.cancel(),e.g=null)}function Fd(e){zc(e),e.u&&(e8.clearTimeout(e.u),e.u=null),yc(e),e.i.cancel(),e.m&&("number"==typeof e.m&&e8.clearTimeout(e.m),e.m=null)}function Gc(e){if(!ed(e.i)&&!e.m){e.m=!0;var t=e.Na;tT||vb(),tS||(tT(),tS=!0),tA.add(t,e),e.C=0}}function Ld(e,t){var i;i=t?t.m:e.W++;let l=G(e.I);K(l,"SID",e.K),K(l,"RID",i),K(l,"AID",e.V),Gd(e,l),e.o&&e.s&&Cd(l,e.o,e.s),i=new bc(e,e.l,i,e.C+1),null===e.o&&(i.I=e.s),t&&(e.j=t.F.concat(e.j)),t=Kd(e,i,1e3),i.setTimeout(Math.round(.5*e.xa)+Math.round(.5*e.xa*Math.random())),Cc(e.i,i),gc(i,l,t)}function Gd(e,t){e.na&&Na(e.na,function(e,i){K(t,i,e)}),e.h&&Kc({},function(e,i){K(t,i,e)})}function Kd(e,t,i){i=Math.min(e.j.length,i);var l=e.h?q(e.h.Va,e.h,e):null;e:{var h=e.j;let t=-1;for(;;){let e=["count="+i];-1==t?0<i?(t=h[0].g,e.push("ofs="+t)):t=0:e.push("ofs="+t);let u=!0;for(let d=0;d<i;d++){let i=h[d].g,f=h[d].map;if(0>(i-=t))t=Math.max(0,h[d].g-100),u=!1;else try{!function(e,t,i){let l=i||"";try{Kc(e,function(e,i){let h=e;p(e)&&(h=tw(e)),t.push(l+i+"="+encodeURIComponent(h))})}catch(e){throw t.push(l+"type="+encodeURIComponent("_badmap")),e}}(f,e,"req"+i+"_")}catch(e){l&&l(f)}}if(u){l=e.join("&");break e}}}return e=e.j.splice(0,i),t.F=e,l}function Fc(e){if(!e.g&&!e.u){e.ba=1;var t=e.Ma;tT||vb(),tS||(tT(),tS=!0),tA.add(t,e),e.A=0}}function Ac(e){return!e.g&&!e.u&&!(3<=e.A)&&(e.ba++,e.u=Rb(q(e.Ma,e),Jd(e,e.A)),e.A++,!0)}function vc(e){null!=e.B&&(e8.clearTimeout(e.B),e.B=null)}function Md(e){e.g=new bc(e,e.l,"rpc",e.ba),null===e.o&&(e.g.I=e.s),e.g.O=0;var t=G(e.wa);K(t,"RID","rpc"),K(t,"SID",e.K),K(t,"AID",e.V),K(t,"CI",e.G?"0":"1"),!e.G&&e.qa&&K(t,"TO",e.qa),K(t,"TYPE","xmlhttp"),Gd(e,t),e.o&&e.s&&Cd(t,e.o,e.s),e.L&&e.g.setTimeout(e.L);var i=e.g;e=e.pa,i.L=1,i.v=hc(G(t)),i.s=null,i.S=!0,ic(i,e)}function yc(e){null!=e.v&&(e8.clearTimeout(e.v),e.v=null)}function sc(e,t){var i=null;if(e.g==t){yc(e),vc(e),e.g=null;var l=2}else{if(!xc(e.i,t))return;i=t.F,Ec(e.i,t),l=1}if(0!=e.H){if(t.i){if(1==l){i=t.s?t.s.length:0,t=Date.now()-t.G;var h,u=e.C;C(l=Mb(),new Qb(l,i)),Gc(e)}else Fc(e)}else if(3==(u=t.o)||0==u&&0<t.ca||!(1==l&&(h=t,!(Bc(e.i)>=e.i.j-(e.m?1:0))&&(e.m?(e.j=h.F.concat(e.j),!0):1!=e.H&&2!=e.H&&!(e.C>=(e.cb?0:e.eb))&&(e.m=Rb(q(e.Na,e,h),Jd(e,e.C)),e.C++,!0)))||2==l&&Ac(e)))switch(i&&0<i.length&&((t=e.i).i=t.i.concat(i)),u){case 1:J(e,5);break;case 4:J(e,10);break;case 3:J(e,6);break;default:J(e,2)}}}function Jd(e,t){let i=e.ab+Math.floor(Math.random()*e.hb);return e.isActive()||(i*=2),i*t}function J(e,t){if(e.l.info("Error code "+t),2==t){var i=null;e.h&&(i=null);var l=q(e.pb,e);i||(i=new M("//www.google.com/images/cleardot.gif"),e8.location&&"http"==e8.location.protocol||Nc(i,"https"),hc(i)),function(e,t){let i=new Gb;if(e8.Image){let l=new Image;l.onload=ha(kd,i,l,"TestLoadImage: loaded",!0,t),l.onerror=ha(kd,i,l,"TestLoadImage: error",!1,t),l.onabort=ha(kd,i,l,"TestLoadImage: abort",!1,t),l.ontimeout=ha(kd,i,l,"TestLoadImage: timeout",!1,t),e8.setTimeout(function(){l.ontimeout&&l.ontimeout()},1e4),l.src=e}else t(!1)}(i.toString(),l)}else F(2);e.H=0,e.h&&e.h.za(t),Hd(e),Fd(e)}function Hd(e){if(e.H=0,e.ma=[],e.h){let t=fd(e.i);(0!=t.length||0!=e.j.length)&&(na(e.ma,t),na(e.ma,e.j),e.i.i.length=0,ma(e.j),e.j.length=0),e.h.ya()}}function Dc(e,t,i){var l=i instanceof M?G(i):new M(i);if(""!=l.g)t&&(l.g=t+"."+l.g),Oc(l,l.m);else{var h=e8.location;l=h.protocol,t=t?t+"."+h.hostname:h.hostname,h=+h.port;var u=new M(null);l&&Nc(u,l),t&&(u.g=t),h&&Oc(u,h),i&&(u.l=i),l=u}return i=e.F,t=e.Da,i&&t&&K(l,i,t),K(l,"VER",e.ra),Gd(e,l),l}function lc(e,t,i){if(t&&!e.J)throw Error("Can't create secondary domain capable XhrIo object.");return(t=new P(i&&e.Ha&&!e.va?new ld({ob:!0}):e.va)).Oa(e.J),t}function Nd(){}function Od(){if(tn&&!(10<=Number(tf)))throw Error("Environmental error: no available transport.")}function Q(e,t){B.call(this),this.g=new Ed(t),this.l=e,this.h=t&&t.messageUrlParams||null,e=t&&t.messageHeaders||null,t&&t.clientProtocolHeaderRequired&&(e?e["X-Client-Protocol"]="webchannel":e={"X-Client-Protocol":"webchannel"}),this.g.s=e,e=t&&t.initMessageHeaders||null,t&&t.messageContentType&&(e?e["X-WebChannel-Content-Type"]=t.messageContentType:e={"X-WebChannel-Content-Type":t.messageContentType}),t&&t.Ca&&(e?e["X-WebChannel-Client-Profile"]=t.Ca:e={"X-WebChannel-Client-Profile":t.Ca}),this.g.U=e,(e=t&&t.cc)&&!x(e)&&(this.g.o=e),this.A=t&&t.supportsCrossDomainXhr||!1,this.v=t&&t.sendRawJson||!1,(t=t&&t.httpSessionIdParam)&&!x(t)&&(this.g.F=t,null!==(e=this.h)&&t in e&&t in(e=this.h)&&delete e[t]),this.j=new R(this)}function Pd(e){Yb.call(this),e.__headers__&&(this.headers=e.__headers__,this.statusCode=e.__status__,delete e.__headers__,delete e.__status__);var t=e.__sm__;if(t){e:{for(let i in t){e=i;break e}e=void 0}(this.i=e)&&(e=this.i,t=null!==t&&e in t?t[e]:void 0),this.data=t}else this.data=e}function Qd(){Zb.call(this),this.status=1}function R(e){this.g=e}function S(){this.blockSize=-1,this.blockSize=64,this.g=[,,,,],this.m=Array(this.blockSize),this.i=this.h=0,this.reset()}function Sd(e,t,i){i||(i=0);var l=Array(16);if("string"==typeof t)for(var h=0;16>h;++h)l[h]=t.charCodeAt(i++)|t.charCodeAt(i++)<<8|t.charCodeAt(i++)<<16|t.charCodeAt(i++)<<24;else for(h=0;16>h;++h)l[h]=t[i++]|t[i++]<<8|t[i++]<<16|t[i++]<<24;t=e.g[0],i=e.g[1],h=e.g[2];var u=e.g[3],d=t+(u^i&(h^u))+l[0]+3614090360&4294967295;d=u+(h^(t=i+(d<<7&4294967295|d>>>25))&(i^h))+l[1]+3905402710&4294967295,d=h+(i^(u=t+(d<<12&4294967295|d>>>20))&(t^i))+l[2]+606105819&4294967295,d=i+(t^(h=u+(d<<17&4294967295|d>>>15))&(u^t))+l[3]+3250441966&4294967295,d=t+(u^(i=h+(d<<22&4294967295|d>>>10))&(h^u))+l[4]+4118548399&4294967295,d=u+(h^(t=i+(d<<7&4294967295|d>>>25))&(i^h))+l[5]+1200080426&4294967295,d=h+(i^(u=t+(d<<12&4294967295|d>>>20))&(t^i))+l[6]+2821735955&4294967295,d=i+(t^(h=u+(d<<17&4294967295|d>>>15))&(u^t))+l[7]+4249261313&4294967295,d=t+(u^(i=h+(d<<22&4294967295|d>>>10))&(h^u))+l[8]+1770035416&4294967295,d=u+(h^(t=i+(d<<7&4294967295|d>>>25))&(i^h))+l[9]+2336552879&4294967295,d=h+(i^(u=t+(d<<12&4294967295|d>>>20))&(t^i))+l[10]+4294925233&4294967295,d=i+(t^(h=u+(d<<17&4294967295|d>>>15))&(u^t))+l[11]+2304563134&4294967295,d=t+(u^(i=h+(d<<22&4294967295|d>>>10))&(h^u))+l[12]+1804603682&4294967295,d=u+(h^(t=i+(d<<7&4294967295|d>>>25))&(i^h))+l[13]+4254626195&4294967295,d=h+(i^(u=t+(d<<12&4294967295|d>>>20))&(t^i))+l[14]+2792965006&4294967295,d=i+(t^(h=u+(d<<17&4294967295|d>>>15))&(u^t))+l[15]+1236535329&4294967295,i=h+(d<<22&4294967295|d>>>10),d=t+(h^u&(i^h))+l[1]+4129170786&4294967295,t=i+(d<<5&4294967295|d>>>27),d=u+(i^h&(t^i))+l[6]+3225465664&4294967295,u=t+(d<<9&4294967295|d>>>23),d=h+(t^i&(u^t))+l[11]+643717713&4294967295,h=u+(d<<14&4294967295|d>>>18),d=i+(u^t&(h^u))+l[0]+3921069994&4294967295,i=h+(d<<20&4294967295|d>>>12),d=t+(h^u&(i^h))+l[5]+3593408605&4294967295,t=i+(d<<5&4294967295|d>>>27),d=u+(i^h&(t^i))+l[10]+38016083&4294967295,u=t+(d<<9&4294967295|d>>>23),d=h+(t^i&(u^t))+l[15]+3634488961&4294967295,h=u+(d<<14&4294967295|d>>>18),d=i+(u^t&(h^u))+l[4]+3889429448&4294967295,i=h+(d<<20&4294967295|d>>>12),d=t+(h^u&(i^h))+l[9]+568446438&4294967295,t=i+(d<<5&4294967295|d>>>27),d=u+(i^h&(t^i))+l[14]+3275163606&4294967295,u=t+(d<<9&4294967295|d>>>23),d=h+(t^i&(u^t))+l[3]+4107603335&4294967295,h=u+(d<<14&4294967295|d>>>18),d=i+(u^t&(h^u))+l[8]+1163531501&4294967295,i=h+(d<<20&4294967295|d>>>12),d=t+(h^u&(i^h))+l[13]+2850285829&4294967295,t=i+(d<<5&4294967295|d>>>27),d=u+(i^h&(t^i))+l[2]+4243563512&4294967295,u=t+(d<<9&4294967295|d>>>23),d=h+(t^i&(u^t))+l[7]+1735328473&4294967295,h=u+(d<<14&4294967295|d>>>18),d=i+(u^t&(h^u))+l[12]+2368359562&4294967295,d=t+((i=h+(d<<20&4294967295|d>>>12))^h^u)+l[5]+4294588738&4294967295,d=u+((t=i+(d<<4&4294967295|d>>>28))^i^h)+l[8]+2272392833&4294967295,d=h+((u=t+(d<<11&4294967295|d>>>21))^t^i)+l[11]+1839030562&4294967295,d=i+((h=u+(d<<16&4294967295|d>>>16))^u^t)+l[14]+4259657740&4294967295,d=t+((i=h+(d<<23&4294967295|d>>>9))^h^u)+l[1]+2763975236&4294967295,d=u+((t=i+(d<<4&4294967295|d>>>28))^i^h)+l[4]+1272893353&4294967295,d=h+((u=t+(d<<11&4294967295|d>>>21))^t^i)+l[7]+4139469664&4294967295,d=i+((h=u+(d<<16&4294967295|d>>>16))^u^t)+l[10]+3200236656&4294967295,d=t+((i=h+(d<<23&4294967295|d>>>9))^h^u)+l[13]+681279174&4294967295,d=u+((t=i+(d<<4&4294967295|d>>>28))^i^h)+l[0]+3936430074&4294967295,d=h+((u=t+(d<<11&4294967295|d>>>21))^t^i)+l[3]+3572445317&4294967295,d=i+((h=u+(d<<16&4294967295|d>>>16))^u^t)+l[6]+76029189&4294967295,d=t+((i=h+(d<<23&4294967295|d>>>9))^h^u)+l[9]+3654602809&4294967295,d=u+((t=i+(d<<4&4294967295|d>>>28))^i^h)+l[12]+3873151461&4294967295,d=h+((u=t+(d<<11&4294967295|d>>>21))^t^i)+l[15]+530742520&4294967295,d=i+((h=u+(d<<16&4294967295|d>>>16))^u^t)+l[2]+3299628645&4294967295,i=h+(d<<23&4294967295|d>>>9),d=t+(h^(i|~u))+l[0]+4096336452&4294967295,t=i+(d<<6&4294967295|d>>>26),d=u+(i^(t|~h))+l[7]+1126891415&4294967295,u=t+(d<<10&4294967295|d>>>22),d=h+(t^(u|~i))+l[14]+2878612391&4294967295,h=u+(d<<15&4294967295|d>>>17),d=i+(u^(h|~t))+l[5]+4237533241&4294967295,i=h+(d<<21&4294967295|d>>>11),d=t+(h^(i|~u))+l[12]+1700485571&4294967295,t=i+(d<<6&4294967295|d>>>26),d=u+(i^(t|~h))+l[3]+2399980690&4294967295,u=t+(d<<10&4294967295|d>>>22),d=h+(t^(u|~i))+l[10]+4293915773&4294967295,h=u+(d<<15&4294967295|d>>>17),d=i+(u^(h|~t))+l[1]+2240044497&4294967295,i=h+(d<<21&4294967295|d>>>11),d=t+(h^(i|~u))+l[8]+1873313359&4294967295,t=i+(d<<6&4294967295|d>>>26),d=u+(i^(t|~h))+l[15]+4264355552&4294967295,u=t+(d<<10&4294967295|d>>>22),d=h+(t^(u|~i))+l[6]+2734768916&4294967295,h=u+(d<<15&4294967295|d>>>17),d=i+(u^(h|~t))+l[13]+1309151649&4294967295,i=h+(d<<21&4294967295|d>>>11),d=t+(h^(i|~u))+l[4]+4149444226&4294967295,t=i+(d<<6&4294967295|d>>>26),d=u+(i^(t|~h))+l[11]+3174756917&4294967295,u=t+(d<<10&4294967295|d>>>22),d=h+(t^(u|~i))+l[2]+718787259&4294967295,h=u+(d<<15&4294967295|d>>>17),d=i+(u^(h|~t))+l[9]+3951481745&4294967295,e.g[0]=e.g[0]+t&4294967295,e.g[1]=e.g[1]+(h+(d<<21&4294967295|d>>>11))&4294967295,e.g[2]=e.g[2]+h&4294967295,e.g[3]=e.g[3]+u&4294967295}function T(e,t){this.h=t;for(var i=[],l=!0,h=e.length-1;0<=h;h--){var u=0|e[h];l&&u==t||(i[h]=u,l=!1)}this.g=i}(e7=P.prototype).Oa=function(e){this.M=e},e7.ha=function(e,t,i,l){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.I+"; newUri="+e);t=t?t.toUpperCase():"GET",this.I=e,this.j="",this.m=0,this.F=!1,this.h=!0,this.g=this.u?this.u.g():g.g(),this.C=this.u?Vb(this.u):Vb(g),this.g.onreadystatechange=q(this.La,this);try{this.G=!0,this.g.open(t,String(e),!0),this.G=!1}catch(e){vd(this,e);return}if(e=i||"",i=new Map(this.headers),l){if(Object.getPrototypeOf(l)===Object.prototype)for(var h in l)i.set(h,l[h]);else if("function"==typeof l.keys&&"function"==typeof l.get)for(let e of l.keys())i.set(e,l.get(e));else throw Error("Unknown input type for opt_headers: "+String(l))}for(let[u,d]of(l=Array.from(i.keys()).find(e=>"content-type"==e.toLowerCase()),h=e8.FormData&&e instanceof e8.FormData,!(0<=te(tJ,t))||l||h||i.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8"),i))this.g.setRequestHeader(u,d);this.K&&(this.g.responseType=this.K),"withCredentials"in this.g&&this.g.withCredentials!==this.M&&(this.g.withCredentials=this.M);try{var u;wd(this),0<this.B&&((this.L=(u=this.g,tn&&"number"==typeof u.timeout&&void 0!==u.ontimeout))?(this.g.timeout=this.B,this.g.ontimeout=q(this.ua,this)):this.A=yb(this.ua,this.B,this)),this.v=!0,this.g.send(e),this.v=!1}catch(e){vd(this,e)}},e7.ua=function(){void 0!==e3&&this.g&&(this.j="Timed out after "+this.B+"ms, aborting",this.m=8,C(this,"timeout"),this.abort(8))},e7.abort=function(e){this.g&&this.h&&(this.h=!1,this.l=!0,this.g.abort(),this.l=!1,this.m=e||7,C(this,"complete"),C(this,"abort"),zd(this))},e7.N=function(){this.g&&(this.h&&(this.h=!1,this.l=!0,this.g.abort(),this.l=!1),zd(this,!0)),P.$.N.call(this)},e7.La=function(){this.s||(this.G||this.v||this.l?Ad(this):this.kb())},e7.kb=function(){Ad(this)},e7.isActive=function(){return!!this.g},e7.da=function(){try{return 2<H(this)?this.g.status:-1}catch(e){return -1}},e7.ja=function(){try{return this.g?this.g.responseText:""}catch(e){return""}},e7.Wa=function(e){if(this.g){var t=this.g.responseText;return e&&0==t.indexOf(e)&&(t=t.substring(e.length)),tq(t)}},e7.Ia=function(){return this.m},e7.Sa=function(){return"string"==typeof this.j?this.j:String(this.j)},(e7=Ed.prototype).ra=8,e7.H=1,e7.Na=function(e){if(this.m){if(this.m=null,1==this.H){if(!e){this.W=Math.floor(1e5*Math.random()),e=this.W++;let h=new bc(this,this.l,e),u=this.s;if(this.U&&(u?Ra(u=Pa(u),this.U):u=this.U),null!==this.o||this.O||(h.I=u,u=null),this.P)e:{for(var t=0,i=0;i<this.j.length;i++){t:{var l=this.j[i];if("__data__"in l.map&&"string"==typeof(l=l.map.__data__)){l=l.length;break t}l=void 0}if(void 0===l)break;if(4096<(t+=l)){t=i;break e}if(4096===t||i===this.j.length-1){t=i+1;break e}}t=1e3}else t=1e3;t=Kd(this,h,t),K(i=G(this.I),"RID",e),K(i,"CVER",22),this.F&&K(i,"X-HTTP-Session-Id",this.F),Gd(this,i),u&&(this.O?t="headers="+encodeURIComponent(String(Bd(u)))+"&"+t:this.o&&Cd(i,this.o,u)),Cc(this.i,h),this.bb&&K(i,"TYPE","init"),this.P?(K(i,"$req",t),K(i,"SID","null"),h.aa=!0,gc(h,i,null)):gc(h,i,t),this.H=2}}else 3==this.H&&(e?Ld(this,e):0==this.j.length||ed(this.i)||Ld(this))}},e7.Ma=function(){if(this.u=null,Md(this),this.ca&&!(this.M||null==this.g||0>=this.S)){var e=2*this.S;this.l.info("BP detection timer enabled: "+e),this.B=Rb(q(this.jb,this),e)}},e7.jb=function(){this.B&&(this.B=null,this.l.info("BP detection timeout reached."),this.l.info("Buffering proxy detected and switch to long-polling!"),this.G=!1,this.M=!0,F(10),zc(this),Md(this))},e7.ib=function(){null!=this.v&&(this.v=null,zc(this),Ac(this),F(19))},e7.pb=function(e){e?(this.l.info("Successfully pinged google.com"),F(2)):(this.l.info("Failed to ping google.com"),F(1))},e7.isActive=function(){return!!this.h&&this.h.isActive(this)},(e7=Nd.prototype).Ba=function(){},e7.Aa=function(){},e7.za=function(){},e7.ya=function(){},e7.isActive=function(){return!0},e7.Va=function(){},Od.prototype.g=function(e,t){return new Q(e,t)},r(Q,B),Q.prototype.m=function(){this.g.h=this.j,this.A&&(this.g.J=!0);var e=this.g,t=this.l,i=this.h||void 0;F(0),e.Y=t,e.na=i||{},e.G=e.aa,e.I=Dc(e,null,e.Y),Gc(e)},Q.prototype.close=function(){Hc(this.g)},Q.prototype.u=function(e){var t=this.g;if("string"==typeof e){var i={};i.__data__=e,e=i}else this.v&&((i={}).__data__=tw(e),e=i);t.j.push(new tH(t.fb++,e)),3==t.H&&Gc(t)},Q.prototype.N=function(){this.g.h=null,delete this.j,Hc(this.g),delete this.g,Q.$.N.call(this)},r(Pd,Yb),r(Qd,Zb),r(R,Nd),R.prototype.Ba=function(){C(this.g,"a")},R.prototype.Aa=function(e){C(this.g,new Pd(e))},R.prototype.za=function(e){C(this.g,new Qd)},R.prototype.ya=function(){C(this.g,"b")},r(S,function(){this.blockSize=-1}),S.prototype.reset=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.i=this.h=0},S.prototype.j=function(e,t){void 0===t&&(t=e.length);for(var i=t-this.blockSize,l=this.m,h=this.h,u=0;u<t;){if(0==h)for(;u<=i;)Sd(this,e,u),u+=this.blockSize;if("string"==typeof e){for(;u<t;)if(l[h++]=e.charCodeAt(u++),h==this.blockSize){Sd(this,l),h=0;break}}else for(;u<t;)if(l[h++]=e[u++],h==this.blockSize){Sd(this,l),h=0;break}}this.h=h,this.i+=t},S.prototype.l=function(){var e=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);e[0]=128;for(var t=1;t<e.length-8;++t)e[t]=0;var i=8*this.i;for(t=e.length-8;t<e.length;++t)e[t]=255&i,i/=256;for(this.j(e),e=Array(16),t=i=0;4>t;++t)for(var l=0;32>l;l+=8)e[i++]=this.g[t]>>>l&255;return e};var tX={};function Td(e){return -128<=e&&128>e?Object.prototype.hasOwnProperty.call(tX,e)?tX[e]:tX[e]=new T([0|e],0>e?-1:0):new T([0|e],0>e?-1:0)}function U(e){if(isNaN(e)||!isFinite(e))return tQ;if(0>e)return W(U(-e));for(var t=[],i=1,l=0;e>=i;l++)t[l]=e/i|0,i*=tY;return new T(t,0)}var tY=4294967296,tQ=Td(0),tZ=Td(1),t0=Td(16777216);function Y(e){if(0!=e.h)return!1;for(var t=0;t<e.g.length;t++)if(0!=e.g[t])return!1;return!0}function X(e){return -1==e.h}function W(e){for(var t=e.g.length,i=[],l=0;l<t;l++)i[l]=~e.g[l];return new T(i,~e.h).add(tZ)}function Zd(e,t){return e.add(W(t))}function $d(e,t){for(;(65535&e[t])!=e[t];)e[t+1]+=e[t]>>>16,e[t]&=65535,t++}function ae(e,t){this.g=e,this.h=t}function Yd(e,t){if(Y(t))throw Error("division by zero");if(Y(e))return new ae(tQ,tQ);if(X(e))return t=Yd(W(e),t),new ae(W(t.g),W(t.h));if(X(t))return t=Yd(e,W(t)),new ae(W(t.g),t.h);if(30<e.g.length){if(X(e)||X(t))throw Error("slowDivide_ only works with positive integers.");for(var i=tZ,l=t;0>=l.X(e);)i=be(i),l=be(l);var h=Z(i,1),u=Z(l,1);for(l=Z(l,2),i=Z(i,2);!Y(l);){var d=u.add(l);0>=d.X(e)&&(h=h.add(i),u=d),l=Z(l,1),i=Z(i,1)}return t=Zd(e,h.R(t)),new ae(h,t)}for(h=tQ;0<=e.X(t);){for(l=48>=(l=Math.ceil(Math.log(i=Math.max(1,Math.floor(e.ea()/t.ea())))/Math.LN2))?1:Math.pow(2,l-48),d=(u=U(i)).R(t);X(d)||0<d.X(e);)i-=l,d=(u=U(i)).R(t);Y(u)&&(u=tZ),h=h.add(u),e=Zd(e,d)}return new ae(h,e)}function be(e){for(var t=e.g.length+1,i=[],l=0;l<t;l++)i[l]=e.D(l)<<1|e.D(l-1)>>>31;return new T(i,e.h)}function Z(e,t){var i=t>>5;t%=32;for(var l=e.g.length-i,h=[],u=0;u<l;u++)h[u]=0<t?e.D(u+i)>>>t|e.D(u+i+1)<<32-t:e.D(u+i);return new T(h,e.h)}(e7=T.prototype).ea=function(){if(X(this))return-W(this).ea();for(var e=0,t=1,i=0;i<this.g.length;i++){var l=this.D(i);e+=(0<=l?l:tY+l)*t,t*=tY}return e},e7.toString=function(e){if(2>(e=e||10)||36<e)throw Error("radix out of range: "+e);if(Y(this))return"0";if(X(this))return"-"+W(this).toString(e);for(var t=U(Math.pow(e,6)),i=this,l="";;){var h=Yd(i,t).g,u=((0<(i=Zd(i,h.R(t))).g.length?i.g[0]:i.h)>>>0).toString(e);if(Y(i=h))return u+l;for(;6>u.length;)u="0"+u;l=u+l}},e7.D=function(e){return 0>e?0:e<this.g.length?this.g[e]:this.h},e7.X=function(e){return X(e=Zd(this,e))?-1:Y(e)?0:1},e7.abs=function(){return X(this)?W(this):this},e7.add=function(e){for(var t=Math.max(this.g.length,e.g.length),i=[],l=0,h=0;h<=t;h++){var u=l+(65535&this.D(h))+(65535&e.D(h)),d=(u>>>16)+(this.D(h)>>>16)+(e.D(h)>>>16);l=d>>>16,u&=65535,d&=65535,i[h]=d<<16|u}return new T(i,-2147483648&i[i.length-1]?-1:0)},e7.R=function(e){if(Y(this)||Y(e))return tQ;if(X(this))return X(e)?W(this).R(W(e)):W(W(this).R(e));if(X(e))return W(this.R(W(e)));if(0>this.X(t0)&&0>e.X(t0))return U(this.ea()*e.ea());for(var t=this.g.length+e.g.length,i=[],l=0;l<2*t;l++)i[l]=0;for(l=0;l<this.g.length;l++)for(var h=0;h<e.g.length;h++){var u=this.D(l)>>>16,d=65535&this.D(l),f=e.D(h)>>>16,g=65535&e.D(h);i[2*l+2*h]+=d*g,$d(i,2*l+2*h),i[2*l+2*h+1]+=u*g,$d(i,2*l+2*h+1),i[2*l+2*h+1]+=d*f,$d(i,2*l+2*h+1),i[2*l+2*h+2]+=u*f,$d(i,2*l+2*h+2)}for(l=0;l<t;l++)i[l]=i[2*l+1]<<16|i[2*l];for(l=t;l<2*t;l++)i[l]=0;return new T(i,0)},e7.gb=function(e){return Yd(this,e).h},e7.and=function(e){for(var t=Math.max(this.g.length,e.g.length),i=[],l=0;l<t;l++)i[l]=this.D(l)&e.D(l);return new T(i,this.h&e.h)},e7.or=function(e){for(var t=Math.max(this.g.length,e.g.length),i=[],l=0;l<t;l++)i[l]=this.D(l)|e.D(l);return new T(i,this.h|e.h)},e7.xor=function(e){for(var t=Math.max(this.g.length,e.g.length),i=[],l=0;l<t;l++)i[l]=this.D(l)^e.D(l);return new T(i,this.h^e.h)},Od.prototype.createWebChannel=Od.prototype.g,Q.prototype.send=Q.prototype.u,Q.prototype.open=Q.prototype.m,Q.prototype.close=Q.prototype.close,tR.NO_ERROR=0,tR.TIMEOUT=8,tR.HTTP_ERROR=6,tO.COMPLETE="complete",Wb.EventType=tN,tN.OPEN="a",tN.CLOSE="b",tN.ERROR="c",tN.MESSAGE="d",B.prototype.listen=B.prototype.O,P.prototype.listenOnce=P.prototype.P,P.prototype.getLastError=P.prototype.Sa,P.prototype.getLastErrorCode=P.prototype.Ia,P.prototype.getStatus=P.prototype.da,P.prototype.getResponseJson=P.prototype.Wa,P.prototype.getResponseText=P.prototype.ja,P.prototype.send=P.prototype.ha,P.prototype.setWithCredentials=P.prototype.Oa,S.prototype.digest=S.prototype.l,S.prototype.reset=S.prototype.reset,S.prototype.update=S.prototype.j,T.prototype.add=T.prototype.add,T.prototype.multiply=T.prototype.R,T.prototype.modulo=T.prototype.gb,T.prototype.compare=T.prototype.X,T.prototype.toNumber=T.prototype.ea,T.prototype.toString=T.prototype.toString,T.prototype.getBits=T.prototype.D,T.fromNumber=U,T.fromString=function Vd(e,t){if(0==e.length)throw Error("number format error: empty string");if(2>(t=t||10)||36<t)throw Error("radix out of range: "+t);if("-"==e.charAt(0))return W(Vd(e.substring(1),t));if(0<=e.indexOf("-"))throw Error('number format error: interior "-" character');for(var i=U(Math.pow(t,8)),l=tQ,h=0;h<e.length;h+=8){var u=Math.min(8,e.length-h),d=parseInt(e.substring(h,h+u),t);8>u?(u=U(Math.pow(t,u)),l=l.R(u).add(U(d))):l=(l=l.R(i)).add(U(d))}return l},e5.createWebChannelTransport=function(){return new Od},e5.getStatEventTarget=function(){return Mb()},e5.ErrorCode=tR,e5.EventType=tO,e5.Event=tk,e5.Stat={xb:0,Ab:1,Bb:2,Ub:3,Zb:4,Wb:5,Xb:6,Vb:7,Tb:8,Yb:9,PROXY:10,NOPROXY:11,Rb:12,Nb:13,Ob:14,Mb:15,Pb:16,Qb:17,tb:18,sb:19,ub:20},e5.FetchXmlHttpFactory=ld,e5.WebChannel=Wb,e5.XhrIo=P,e5.Md5=S;var t1=e5.Integer=T;i(3454);let t2="@firebase/firestore";/**
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
 */let t9="9.23.0",t4=new Logger("@firebase/firestore");function index_esm2017_N(e,...t){if(t4.logLevel<=e4.DEBUG){let i=t.map($);t4.debug(`Firestore (${t9}): ${e}`,...i)}}function index_esm2017_k(e,...t){if(t4.logLevel<=e4.ERROR){let i=t.map($);t4.error(`Firestore (${t9}): ${e}`,...i)}}function $(e){if("string"==typeof e)return e;try{return JSON.stringify(e)}catch(t){return e}}/**
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
 */function index_esm2017_O(e="Unexpected state"){let t=`FIRESTORE (${t9}) INTERNAL ASSERTION FAILED: `+e;throw index_esm2017_k(t),Error(t)}/**
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
 */let t7={CANCELLED:"cancelled",INVALID_ARGUMENT:"invalid-argument",FAILED_PRECONDITION:"failed-precondition",UNAVAILABLE:"unavailable"};let index_esm2017_U=class index_esm2017_U extends FirebaseError{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}};/**
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
 */let index_esm2017_G=class index_esm2017_G{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}};let index_esm2017_Q=class index_esm2017_Q{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(index_esm2017_V.UNAUTHENTICATED))}shutdown(){}};let j=class j{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}};let index_esm2017_z=class index_esm2017_z{constructor(e){this.t=e,this.currentUser=index_esm2017_V.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){let i=this.i,s=e=>this.i!==i?(i=this.i,t(e)):Promise.resolve(),l=new index_esm2017_K;this.o=()=>{this.i++,this.currentUser=this.u(),l.resolve(),l=new index_esm2017_K,e.enqueueRetryable(()=>s(this.currentUser))};let r=()=>{let t=l;e.enqueueRetryable(async()=>{await t.promise,await s(this.currentUser)})},o=e=>{index_esm2017_N("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=e,this.auth.addAuthTokenListener(this.o),r()};this.t.onInit(e=>o(e)),setTimeout(()=>{if(!this.auth){let e=this.t.getImmediate({optional:!0});e?o(e):(index_esm2017_N("FirebaseAuthCredentialsProvider","Auth not yet detected"),l.resolve(),l=new index_esm2017_K)}},0),r()}getToken(){let e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(t=>this.i!==e?(index_esm2017_N("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):t?("string"==typeof t.accessToken||index_esm2017_O(),new index_esm2017_G(t.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.auth.removeAuthTokenListener(this.o)}u(){let e=this.auth&&this.auth.getUid();return null===e||"string"==typeof e||index_esm2017_O(),new index_esm2017_V(e)}};let index_esm2017_W=class index_esm2017_W{constructor(e,t,i){this.h=e,this.l=t,this.m=i,this.type="FirstParty",this.user=index_esm2017_V.FIRST_PARTY,this.g=new Map}p(){return this.m?this.m():null}get headers(){this.g.set("X-Goog-AuthUser",this.h);let e=this.p();return e&&this.g.set("Authorization",e),this.l&&this.g.set("X-Goog-Iam-Authorization-Token",this.l),this.g}};let index_esm2017_H=class index_esm2017_H{constructor(e,t,i){this.h=e,this.l=t,this.m=i}getToken(){return Promise.resolve(new index_esm2017_W(this.h,this.l,this.m))}start(e,t){e.enqueueRetryable(()=>t(index_esm2017_V.FIRST_PARTY))}shutdown(){}invalidateToken(){}};let index_esm2017_J=class index_esm2017_J{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}};let index_esm2017_Y=class index_esm2017_Y{constructor(e){this.I=e,this.forceRefresh=!1,this.appCheck=null,this.T=null}start(e,t){let n=e=>{null!=e.error&&index_esm2017_N("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${e.error.message}`);let i=e.token!==this.T;return this.T=e.token,index_esm2017_N("FirebaseAppCheckTokenProvider",`Received ${i?"new":"existing"} token.`),i?t(e.token):Promise.resolve()};this.o=t=>{e.enqueueRetryable(()=>n(t))};let s=e=>{index_esm2017_N("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=e,this.appCheck.addTokenListener(this.o)};this.I.onInit(e=>s(e)),setTimeout(()=>{if(!this.appCheck){let e=this.I.getImmediate({optional:!0});e?s(e):index_esm2017_N("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){let e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(e=>e?("string"==typeof e.token||index_esm2017_O(),this.T=e.token,new index_esm2017_J(e.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.appCheck.removeTokenListener(this.o)}};/**
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
 */let tt=class tt{static A(){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=Math.floor(256/e.length)*e.length,i="";for(;i.length<20;){let l=/**
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
 */function(e){let t="undefined"!=typeof self&&(self.crypto||self.msCrypto),i=new Uint8Array(e);if(t&&"function"==typeof t.getRandomValues)t.getRandomValues(i);else for(let t=0;t<e;t++)i[t]=Math.floor(256*Math.random());return i}(40);for(let h=0;h<l.length;++h)i.length<20&&l[h]<t&&(i+=e.charAt(l[h]%e.length))}return i}};function et(e,t){return e<t?-1:e>t?1:0}/**
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
 */let ot=class ot{constructor(e,t,i){void 0===t?t=0:t>e.length&&index_esm2017_O(),void 0===i?i=e.length-t:i>e.length-t&&index_esm2017_O(),this.segments=e,this.offset=t,this.len=i}get length(){return this.len}isEqual(e){return 0===ot.comparator(this,e)}child(e){let t=this.segments.slice(this.offset,this.limit());return e instanceof ot?e.forEach(e=>{t.push(e)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=void 0===e?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return 0===this.length}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,i=this.limit();t<i;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){let i=Math.min(e.length,t.length);for(let l=0;l<i;l++){let i=e.get(l),h=t.get(l);if(i<h)return -1;if(i>h)return 1}return e.length<t.length?-1:e.length>t.length?1:0}};let ut=class ut extends ot{construct(e,t,i){return new ut(e,t,i)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}static fromString(...e){let t=[];for(let i of e){if(i.indexOf("//")>=0)throw new index_esm2017_U(t7.INVALID_ARGUMENT,`Invalid segment (${i}). Paths must not contain // in them.`);t.push(...i.split("/").filter(e=>e.length>0))}return new ut(t)}static emptyPath(){return new ut([])}};/**
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
 */let ht=class ht{constructor(e){this.path=e}static fromPath(e){return new ht(ut.fromString(e))}static fromName(e){return new ht(ut.fromString(e).popFirst(5))}static empty(){return new ht(ut.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return null!==e&&0===ut.comparator(this.path,e.path)}toString(){return this.path.toString()}static comparator(e,t){return ut.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new ht(new ut(e.slice()))}};function Dt(e){return"IndexedDbTransactionError"===e.name}/**
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
 */let pe=class pe{constructor(e,t){this.comparator=e,this.root=t||Te.EMPTY}insert(e,t){return new pe(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,Te.BLACK,null,null))}remove(e){return new pe(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Te.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){let i=this.comparator(e,t.key);if(0===i)return t.value;i<0?t=t.left:i>0&&(t=t.right)}return null}indexOf(e){let t=0,i=this.root;for(;!i.isEmpty();){let l=this.comparator(e,i.key);if(0===l)return t+i.left.size;l<0?i=i.left:(t+=i.left.size+1,i=i.right)}return -1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,i)=>(e(t,i),!1))}toString(){let e=[];return this.inorderTraversal((t,i)=>(e.push(`${t}:${i}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Ie(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Ie(this.root,e,this.comparator,!1)}getReverseIterator(){return new Ie(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Ie(this.root,e,this.comparator,!0)}};let Ie=class Ie{constructor(e,t,i,l){this.isReverse=l,this.nodeStack=[];let h=1;for(;!e.isEmpty();)if(h=t?i(e.key,t):1,t&&l&&(h*=-1),h<0)e=this.isReverse?e.left:e.right;else{if(0===h){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop(),t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(0===this.nodeStack.length)return null;let e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}};let Te=class Te{constructor(e,t,i,l,h){this.key=e,this.value=t,this.color=null!=i?i:Te.RED,this.left=null!=l?l:Te.EMPTY,this.right=null!=h?h:Te.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,i,l,h){return new Te(null!=e?e:this.key,null!=t?t:this.value,null!=i?i:this.color,null!=l?l:this.left,null!=h?h:this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,i){let l=this,h=i(e,l.key);return(l=h<0?l.copy(null,null,null,l.left.insert(e,t,i),null):0===h?l.copy(null,t,null,null,null):l.copy(null,null,null,null,l.right.insert(e,t,i))).fixUp()}removeMin(){if(this.left.isEmpty())return Te.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),(e=e.copy(null,null,null,e.left.removeMin(),null)).fixUp()}remove(e,t){let i,l=this;if(0>t(e,l.key))l.left.isEmpty()||l.left.isRed()||l.left.left.isRed()||(l=l.moveRedLeft()),l=l.copy(null,null,null,l.left.remove(e,t),null);else{if(l.left.isRed()&&(l=l.rotateRight()),l.right.isEmpty()||l.right.isRed()||l.right.left.isRed()||(l=l.moveRedRight()),0===t(e,l.key)){if(l.right.isEmpty())return Te.EMPTY;i=l.right.min(),l=l.copy(i.key,i.value,null,null,l.right.removeMin())}l=l.copy(null,null,null,null,l.right.remove(e,t))}return l.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=(e=(e=e.copy(null,null,null,null,e.right.rotateRight())).rotateLeft()).colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=(e=e.rotateRight()).colorFlip()),e}rotateLeft(){let e=this.copy(null,null,Te.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){let e=this.copy(null,null,Te.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){let e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){let e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw index_esm2017_O();let e=this.left.check();if(e!==this.right.check())throw index_esm2017_O();return e+(this.isRed()?0:1)}};Te.EMPTY=null,Te.RED=!0,Te.BLACK=!1,Te.EMPTY=new class{constructor(){this.size=0}get key(){throw index_esm2017_O()}get value(){throw index_esm2017_O()}get color(){throw index_esm2017_O()}get left(){throw index_esm2017_O()}get right(){throw index_esm2017_O()}copy(e,t,i,l,h){return this}insert(e,t,i){return new Te(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
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
 */let Ee=class Ee{constructor(e){this.comparator=e,this.data=new pe(this.comparator)}has(e){return null!==this.data.get(e)}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,i)=>(e(t),!1))}forEachInRange(e,t){let i=this.data.getIteratorFrom(e[0]);for(;i.hasNext();){let l=i.getNext();if(this.comparator(l.key,e[1])>=0)return;t(l.key)}}forEachWhile(e,t){let i;for(i=void 0!==t?this.data.getIteratorFrom(t):this.data.getIterator();i.hasNext();)if(!e(i.getNext().key))return}firstAfterOrEqual(e){let t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Ae(this.data.getIterator())}getIteratorFrom(e){return new Ae(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(e=>{t=t.add(e)}),t}isEqual(e){if(!(e instanceof Ee)||this.size!==e.size)return!1;let t=this.data.getIterator(),i=e.data.getIterator();for(;t.hasNext();){let e=t.getNext().key,l=i.getNext().key;if(0!==this.comparator(e,l))return!1}return!0}toArray(){let e=[];return this.forEach(t=>{e.push(t)}),e}toString(){let e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){let t=new Ee(this.comparator);return t.data=e,t}};let Ae=class Ae{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}};/**
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
 */let Ve=class Ve{constructor(e){this.binaryString=e}static fromBase64String(e){let t=function(e){try{return atob(e)}catch(e){throw"undefined"!=typeof DOMException&&e instanceof DOMException?new Pe("Invalid base64 string: "+e):e}}(e);return new Ve(t)}static fromUint8Array(e){let t=function(e){let t="";for(let i=0;i<e.length;++i)t+=String.fromCharCode(e[i]);return t}(e);return new Ve(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return btoa(this.binaryString)}toUint8Array(){return function(e){let t=new Uint8Array(e.length);for(let i=0;i<e.length;i++)t[i]=e.charCodeAt(i);return t}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return et(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}};function Ce(e){return"number"==typeof e?e:"string"==typeof e?Number(e):0}Ve.EMPTY_BYTE_STRING=new Ve("");/**
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
 */let $e=class $e{constructor(e,t,i,l,h,u,d,f,g){this.databaseId=e,this.appId=t,this.persistenceKey=i,this.host=l,this.ssl=h,this.forceLongPolling=u,this.autoDetectLongPolling=d,this.longPollingOptions=f,this.useFetchStreams=g}};let Oe=class Oe{constructor(e,t){this.projectId=e,this.database=t||"(default)"}static empty(){return new Oe("","")}get isDefaultDatabase(){return"(default)"===this.database}isEqual(e){return e instanceof Oe&&e.projectId===this.projectId&&e.database===this.database}};new pe(ht.comparator),new pe(ht.comparator),new pe(ht.comparator),new Ee(ht.comparator),new Ee(et),(_=m||(m={}))[_.OK=0]="OK",_[_.CANCELLED=1]="CANCELLED",_[_.UNKNOWN=2]="UNKNOWN",_[_.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",_[_.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",_[_.NOT_FOUND=5]="NOT_FOUND",_[_.ALREADY_EXISTS=6]="ALREADY_EXISTS",_[_.PERMISSION_DENIED=7]="PERMISSION_DENIED",_[_.UNAUTHENTICATED=16]="UNAUTHENTICATED",_[_.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",_[_.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",_[_.ABORTED=10]="ABORTED",_[_.OUT_OF_RANGE=11]="OUT_OF_RANGE",_[_.UNIMPLEMENTED=12]="UNIMPLEMENTED",_[_.INTERNAL=13]="INTERNAL",_[_.UNAVAILABLE=14]="UNAVAILABLE",_[_.DATA_LOSS=15]="DATA_LOSS",new t1([4294967295,4294967295],0);/**
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
 */let br=class br{constructor(){}_e(e,t){this.me(e,t),t.ge()}me(e,t){var i;if("nullValue"in e)this.ye(t,5);else if("booleanValue"in e)this.ye(t,10),t.pe(e.booleanValue?1:0);else if("integerValue"in e)this.ye(t,15),t.pe(Ce(e.integerValue));else if("doubleValue"in e){let i=Ce(e.doubleValue);isNaN(i)?this.ye(t,13):(this.ye(t,15),0===i&&1/i==-1/0?t.pe(0):t.pe(i))}else if("timestampValue"in e){let i=e.timestampValue;this.ye(t,20),"string"==typeof i?t.Ie(i):(t.Ie(`${i.seconds||""}`),t.pe(i.nanos||0))}else if("stringValue"in e)this.Te(e.stringValue,t),this.Ee(t);else if("bytesValue"in e)this.ye(t,30),t.Ae("string"==typeof(i=e.bytesValue)?Ve.fromBase64String(i):Ve.fromUint8Array(i)),this.Ee(t);else if("referenceValue"in e)this.ve(e.referenceValue,t);else if("geoPointValue"in e){let i=e.geoPointValue;this.ye(t,45),t.pe(i.latitude||0),t.pe(i.longitude||0)}else"mapValue"in e?"__max__"===(((e.mapValue||{}).fields||{}).__type__||{}).stringValue?this.ye(t,Number.MAX_SAFE_INTEGER):(this.Re(e.mapValue,t),this.Ee(t)):"arrayValue"in e?(this.Pe(e.arrayValue,t),this.Ee(t)):index_esm2017_O()}Te(e,t){this.ye(t,25),this.be(e,t)}be(e,t){t.Ie(e)}Re(e,t){let i=e.fields||{};for(let e of(this.ye(t,55),Object.keys(i)))this.Te(e,t),this.me(i[e],t)}Pe(e,t){let i=e.values||[];for(let e of(this.ye(t,50),i))this.me(e,t)}ve(e,t){this.ye(t,37),ht.fromName(e).path.forEach(e=>{this.ye(t,60),this.be(e,t)})}ye(e,t){e.pe(t)}Ee(e){e.pe(2)}};br.Ve=new br,new Uint8Array(0);let so=class so{constructor(e,t,i){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=i}static withCacheSize(e){return new so(e,so.DEFAULT_COLLECTION_PERCENTILE,so.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}};function Ou(){return"undefined"!=typeof document?document:null}/**
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
 */let Bu=class Bu{constructor(e,t,i=1e3,l=1.5,h=6e4){this.ii=e,this.timerId=t,this.Po=i,this.bo=l,this.Vo=h,this.So=0,this.Do=null,this.Co=Date.now(),this.reset()}reset(){this.So=0}xo(){this.So=this.Vo}No(e){this.cancel();let t=Math.floor(this.So+this.ko()),i=Math.max(0,Date.now()-this.Co),l=Math.max(0,t-i);l>0&&index_esm2017_N("ExponentialBackoff",`Backing off for ${l} ms (base delay: ${this.So} ms, delay with jitter: ${t} ms, last attempt: ${i} ms ago)`),this.Do=this.ii.enqueueAfterDelay(this.timerId,l,()=>(this.Co=Date.now(),e())),this.So*=this.bo,this.So<this.Po&&(this.So=this.Po),this.So>this.Vo&&(this.So=this.Vo)}Mo(){null!==this.Do&&(this.Do.skipDelay(),this.Do=null)}cancel(){null!==this.Do&&(this.Do.cancel(),this.Do=null)}ko(){return(Math.random()-.5)*this.So}};/**
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
 */let index_esm2017_Tc=class index_esm2017_Tc{constructor(e,t,i,l,h){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=i,this.op=l,this.removalCallback=h,this.deferred=new index_esm2017_K,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(e=>{})}static createAndSchedule(e,t,i,l,h){let u=Date.now()+i,d=new index_esm2017_Tc(e,t,u,l,h);return d.start(i),d}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){null!==this.timerHandle&&(this.clearTimeout(),this.deferred.reject(new index_esm2017_U(t7.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>null!==this.timerHandle?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){null!==this.timerHandle&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}};/**
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
 */let index_esm2017_xa=class index_esm2017_xa{constructor(e,t,i,l){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=i,this.databaseInfo=l,this.user=index_esm2017_V.UNAUTHENTICATED,this.clientId=tt.A(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this.authCredentials.start(i,async e=>{index_esm2017_N("FirestoreClient","Received user=",e.uid),await this.authCredentialListener(e),this.user=e}),this.appCheckCredentials.start(i,e=>(index_esm2017_N("FirestoreClient","Received new app check token=",e),this.appCheckCredentialListener(e,this.user)))}async getConfiguration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}verifyNotTerminated(){if(this.asyncQueue.isShuttingDown)throw new index_esm2017_U(t7.FAILED_PRECONDITION,"The client has already been terminated.")}terminate(){this.asyncQueue.enterRestrictedMode();let e=new index_esm2017_K;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(i){let t=function(e,t){if(index_esm2017_k("AsyncQueue",`${t}: ${e}`),Dt(e))return new index_esm2017_U(t7.UNAVAILABLE,`${t}: ${e}`);throw e}(i,"Failed to shutdown persistence");e.reject(t)}}),e.promise}};/**
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
 */let t6=new Map;/**
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
 */let ah=class ah{constructor(e){var t,i;if(void 0===e.host){if(void 0!==e.ssl)throw new index_esm2017_U(t7.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=null===(t=e.ssl)||void 0===t||t;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.cache=e.localCache,void 0===e.cacheSizeBytes)this.cacheSizeBytes=41943040;else{if(-1!==e.cacheSizeBytes&&e.cacheSizeBytes<1048576)throw new index_esm2017_U(t7.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}(function(e,t,i,l){if(!0===t&&!0===l)throw new index_esm2017_U(t7.INVALID_ARGUMENT,`${e} and ${i} cannot be used together.`)})("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:void 0===e.experimentalAutoDetectLongPolling?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=th(null!==(i=e.experimentalLongPollingOptions)&&void 0!==i?i:{}),function(e){if(void 0!==e.timeoutSeconds){if(isNaN(e.timeoutSeconds))throw new index_esm2017_U(t7.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (must not be NaN)`);if(e.timeoutSeconds<5)throw new index_esm2017_U(t7.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (minimum allowed value is 5)`);if(e.timeoutSeconds>30)throw new index_esm2017_U(t7.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){var t,i;return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(t=this.experimentalLongPollingOptions,i=e.experimentalLongPollingOptions,t.timeoutSeconds===i.timeoutSeconds)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}};let hh=class hh{constructor(e,t,i,l){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=i,this._app=l,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new ah({}),this._settingsFrozen=!1}get app(){if(!this._app)throw new index_esm2017_U(t7.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return void 0!==this._terminateTask}_setSettings(e){if(this._settingsFrozen)throw new index_esm2017_U(t7.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new ah(e),void 0!==e.credentials&&(this._authCredentials=function(e){if(!e)return new index_esm2017_Q;switch(e.type){case"firstParty":return new index_esm2017_H(e.sessionIndex||"0",e.iamToken||null,e.authTokenFactory||null);case"provider":return e.client;default:throw new index_esm2017_U(t7.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask||(this._terminateTask=this._terminate()),this._terminateTask}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(e){let t=t6.get(e);t&&(index_esm2017_N("ComponentProvider","Removing Datastore"),t6.delete(e),t.terminate())}(this),Promise.resolve()}};/**
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
 */let Ih=class Ih{constructor(){this.Gc=Promise.resolve(),this.Qc=[],this.jc=!1,this.zc=[],this.Wc=null,this.Hc=!1,this.Jc=!1,this.Yc=[],this.qo=new Bu(this,"async_queue_retry"),this.Xc=()=>{let e=Ou();e&&index_esm2017_N("AsyncQueue","Visibility state changed to "+e.visibilityState),this.qo.Mo()};let e=Ou();e&&"function"==typeof e.addEventListener&&e.addEventListener("visibilitychange",this.Xc)}get isShuttingDown(){return this.jc}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.Zc(),this.ta(e)}enterRestrictedMode(e){if(!this.jc){this.jc=!0,this.Jc=e||!1;let t=Ou();t&&"function"==typeof t.removeEventListener&&t.removeEventListener("visibilitychange",this.Xc)}}enqueue(e){if(this.Zc(),this.jc)return new Promise(()=>{});let t=new index_esm2017_K;return this.ta(()=>this.jc&&this.Jc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Qc.push(e),this.ea()))}async ea(){if(0!==this.Qc.length){try{await this.Qc[0](),this.Qc.shift(),this.qo.reset()}catch(e){if(!Dt(e))throw e;index_esm2017_N("AsyncQueue","Operation failed with retryable error: "+e)}this.Qc.length>0&&this.qo.No(()=>this.ea())}}ta(e){let t=this.Gc.then(()=>(this.Hc=!0,e().catch(e=>{let t;this.Wc=e,this.Hc=!1;let i=(t=e.message||"",e.stack&&(t=e.stack.includes(e.message)?e.stack:e.message+"\n"+e.stack),t);throw index_esm2017_k("INTERNAL UNHANDLED ERROR: ",i),e}).then(e=>(this.Hc=!1,e))));return this.Gc=t,t}enqueueAfterDelay(e,t,i){this.Zc(),this.Yc.indexOf(e)>-1&&(t=0);let l=index_esm2017_Tc.createAndSchedule(this,e,t,i,e=>this.na(e));return this.zc.push(l),l}Zc(){this.Wc&&index_esm2017_O()}verifyOperationInProgress(){}async sa(){let e;do e=this.Gc,await e;while(e!==this.Gc)}ia(e){for(let t of this.zc)if(t.timerId===e)return!0;return!1}ra(e){return this.sa().then(()=>{for(let t of(this.zc.sort((e,t)=>e.targetTimeMs-t.targetTimeMs),this.zc))if(t.skipDelay(),"all"!==e&&t.timerId===e)break;return this.sa()})}oa(e){this.Yc.push(e)}na(e){let t=this.zc.indexOf(e);this.zc.splice(t,1)}};let vh=class vh extends hh{constructor(e,t,i,l){super(e,t,i,l),this.type="firestore",this._queue=new Ih,this._persistenceKey=(null==l?void 0:l.name)||"[DEFAULT]"}_terminate(){return this._firestoreClient||function(e){var t,i,l,h,u,d;let f=e._freezeSettings(),g=(h=e._databaseId,u=(null===(t=e._app)||void 0===t?void 0:t.options.appId)||"",d=e._persistenceKey,new $e(h,u,d,f.host,f.ssl,f.experimentalForceLongPolling,f.experimentalAutoDetectLongPolling,th(f.experimentalLongPollingOptions),f.useFetchStreams));e._firestoreClient=new index_esm2017_xa(e._authCredentials,e._appCheckCredentials,e._queue,g),(null===(i=f.cache)||void 0===i?void 0:i._offlineComponentProvider)&&(null===(l=f.cache)||void 0===l?void 0:l._onlineComponentProvider)&&(e._firestoreClient._uninitializedComponentsProvider={_offlineKind:f.cache.kind,_offline:f.cache._offlineComponentProvider,_online:f.cache._onlineComponentProvider})}(this),this._firestoreClient.terminate()}};!function(e,t=!0){t9=eS,_registerComponent(new Component("firestore",(e,{instanceIdentifier:i,options:l})=>{let h=e.getProvider("app").getImmediate(),u=new vh(new index_esm2017_z(e.getProvider("auth-internal")),new index_esm2017_Y(e.getProvider("app-check-internal")),function(e,t){if(!Object.prototype.hasOwnProperty.apply(e.options,["projectId"]))throw new index_esm2017_U(t7.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Oe(e.options.projectId,t)}(h,i),h);return l=Object.assign({useFetchStreams:t},l),u._setSettings(l),u},"PUBLIC").setMultipleInstances(!0)),registerVersion(t2,"3.13.0",void 0),registerVersion(t2,"3.13.0","esm2017")}();let t5=initializeApp({apiKey:"AIzaSyBZiJPTs7dMccVgFV-YoTejnhy1bZNFEQY",authDomain:"heartglowai.firebaseapp.com",projectId:"heartglowai",storageBucket:"heartglowai.firebasestorage.app",messagingSenderId:"196565711798",appId:"1:196565711798:web:79e2b0320fd8e74ab0df17"});!function(e,t){let i="object"==typeof e?e:getApp(),l=index_esm2017_getProvider(i,"firestore").getImmediate({identifier:"string"==typeof e?e:"(default)"});if(!l._initialized){let e=getDefaultEmulatorHostnameAndPort("firestore");e&&function(e,t,i,l={}){var h;let u=(e=function(e,t){if("_delegate"in e&&(e=e._delegate),!(e instanceof t)){if(t.name===e.constructor.name)throw new index_esm2017_U(t7.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{let i=function(e){if(void 0===e)return"undefined";if(null===e)return"null";if("string"==typeof e)return e.length>20&&(e=`${e.substring(0,20)}...`),JSON.stringify(e);if("number"==typeof e||"boolean"==typeof e)return""+e;if("object"==typeof e){if(e instanceof Array)return"an array";{var t;let i=(t=e).constructor?t.constructor.name:null;return i?`a custom ${i} object`:"an object"}}return"function"==typeof e?"a function":index_esm2017_O()}(e);throw new index_esm2017_U(t7.INVALID_ARGUMENT,`Expected type '${t.name}', but it was: ${i}`)}}return e}(e,hh))._getSettings(),d=`${t}:${i}`;if("firestore.googleapis.com"!==u.host&&u.host!==d&&function(e){if(t4.logLevel<=e4.WARN){let t=[].map($);t4.warn(`Firestore (${t9}): ${e}`,...t)}}("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),e._setSettings(Object.assign(Object.assign({},u),{host:d,ssl:!1})),l.mockUserToken){let t,i;if("string"==typeof l.mockUserToken)t=l.mockUserToken,i=index_esm2017_V.MOCK_USER;else{t=/**
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
 */function(e,t){if(e.uid)throw Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');let i=t||"demo-project",l=e.iat||0,h=e.sub||e.user_id;if(!h)throw Error("mockUserToken must contain 'sub' or 'user_id' field!");let u=Object.assign({iss:`https://securetoken.google.com/${i}`,aud:i,iat:l,exp:l+3600,auth_time:l,sub:h,user_id:h,firebase:{sign_in_provider:"custom",identities:{}}},e);return[base64urlEncodeWithoutPadding(JSON.stringify({alg:"none",type:"JWT"})),base64urlEncodeWithoutPadding(JSON.stringify(u)),""].join(".")}(l.mockUserToken,null===(h=e._app)||void 0===h?void 0:h.options.projectId);let u=l.mockUserToken.sub||l.mockUserToken.user_id;if(!u)throw new index_esm2017_U(t7.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");i=new index_esm2017_V(u)}e._authCredentials=new j(new index_esm2017_G(t,i))}}(l,...e)}}(t5);let t3=function(e=getApp()){let t=index_esm2017_getProvider(e,"auth");if(t.isInitialized())return t.getImmediate();let i=/**
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
 */function(e,t){let i=index_esm2017_getProvider(e,"auth");if(i.isInitialized()){let e=i.getImmediate(),l=i.getOptions();if(index_esm2017_deepEqual(l,null!=t?t:{}))return e;_fail(e,"already-initialized")}let l=i.initialize({options:t});return l}(e,{popupRedirectResolver:eX,persistence:[IndexedDBLocalPersistence,BrowserLocalPersistence,BrowserSessionPersistence]}),l=getExperimentalSetting("authTokenSyncURL");if(l){let e=mintCookieFactory(l);index_esm2017_getModularInstance(i).beforeAuthStateChanged(e,()=>e(i.currentUser)),index_esm2017_getModularInstance(i).onIdTokenChanged(t=>e(t),void 0,void 0)}let h=getDefaultEmulatorHost("auth");return h&&function(e,t,i){let l=index_esm2017_getModularInstance(e);_assert(l._canInitEmulator,l,"emulator-config-failed"),_assert(/^https?:\/\//.test(t),l,"invalid-emulator-scheme");let h=!!(null==i?void 0:i.disableWarnings),u=extractProtocol(t),{host:d,port:f}=function(e){let t=extractProtocol(e),i=/(\/\/)?([^?#/]+)/.exec(e.substr(t.length));if(!i)return{host:"",port:null};let l=i[2].split("@").pop()||"",h=/^(\[[^\]]+\])(:|$)/.exec(l);if(h){let e=h[1];return{host:e,port:parsePort(l.substr(e.length+1))}}{let[e,t]=l.split(":");return{host:e,port:parsePort(t)}}}(t),g=null===f?"":`:${f}`;l.config.emulator={url:`${u}//${d}${g}/`},l.settings.appVerificationDisabledForTesting=!0,l.emulatorConfig=Object.freeze({host:d,port:f,protocol:u.replace(":",""),options:Object.freeze({disableWarnings:h})}),h||function(){function attachBanner(){let e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}"undefined"!=typeof console&&"function"==typeof console.info&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),"undefined"!=typeof window&&"undefined"!=typeof document&&("loading"===document.readyState?window.addEventListener("DOMContentLoaded",attachBanner):attachBanner())}()}(i,`http://${h}`),i}(t5),t8=new GoogleAuthProvider,signIn=async(e,t)=>{try{return await signInWithCredential(index_esm2017_getModularInstance(t3),EmailAuthProvider.credential(e,t))}catch(e){throw console.error("Error signing in:",e),e}},auth_signUp=async(e,t)=>{try{return await createUserWithEmailAndPassword(t3,e,t)}catch(e){throw console.error("Error signing up:",e),e}},signInWithGoogle=async()=>{try{return await signInWithPopup(t3,t8)}catch(e){throw console.error("Error signing in with Google:",e),e}},logOut=async()=>{try{return await index_esm2017_getModularInstance(t3).signOut()}catch(e){throw console.error("Error signing out:",e),e}},onAuthStateChangedListener=e=>index_esm2017_getModularInstance(t3).onAuthStateChanged(e,void 0,void 0),ie=(0,E.createContext)(null),useAuth=()=>{let e=(0,E.useContext)(ie);if(!e)throw Error("useAuth must be used within an AuthProvider");return e},AuthProvider=e=>{let{children:t}=e,[i,l]=(0,E.useState)(null),[h,u]=(0,E.useState)(!0);(0,E.useEffect)(()=>{let e=onAuthStateChangedListener(e=>{l(e),u(!1)});return e},[]);let login=async(e,t)=>signIn(e,t),loginWithGoogle=async()=>signInWithGoogle(),signup=async(e,t)=>auth_signUp(e,t),logout=async()=>logOut();return(0,b.jsx)(ie.Provider,{value:{currentUser:i,loading:h,login,loginWithGoogle,signup,logout},children:t})}},4807:function(e,t,i){"use strict";i.r(t),i.d(t,{default:function(){return App},getRouteWithBasePath:function(){return getRouteWithBasePath}});var l=i(5893);i(2352);var h=i(7294),u=i(9008),d=i.n(u),f=i(866);function getRouteWithBasePath(e){return"".concat("/dashboard").concat(e)}function App(e){let{Component:t,pageProps:i}=e;return(0,h.useEffect)(()=>{let e="1744312528446";window.localStorage.setItem("HeartGlowVersion",e);let t=window.localStorage.getItem("HeartGlowLastVersion");t&&t!==e?(window.localStorage.setItem("HeartGlowLastVersion",e),window.location.reload()):window.localStorage.setItem("HeartGlowLastVersion",e)},[]),(0,l.jsxs)(l.Fragment,{children:[(0,l.jsxs)(d(),{children:[(0,l.jsx)("meta",{name:"viewport",content:"width=device-width, initial-scale=1.0"}),(0,l.jsx)("meta",{httpEquiv:"Cache-Control",content:"no-cache, no-store, must-revalidate"}),(0,l.jsx)("meta",{httpEquiv:"Pragma",content:"no-cache"}),(0,l.jsx)("meta",{httpEquiv:"Expires",content:"0"})]}),(0,l.jsx)(f.H,{children:(0,l.jsx)(t,{...i})})]})}},2352:function(){},7663:function(e){!function(){var t={229:function(e){var t,i,l,h=e.exports={};function defaultSetTimout(){throw Error("setTimeout has not been defined")}function defaultClearTimeout(){throw Error("clearTimeout has not been defined")}function runTimeout(e){if(t===setTimeout)return setTimeout(e,0);if((t===defaultSetTimout||!t)&&setTimeout)return t=setTimeout,setTimeout(e,0);try{return t(e,0)}catch(i){try{return t.call(null,e,0)}catch(i){return t.call(this,e,0)}}}!function(){try{t="function"==typeof setTimeout?setTimeout:defaultSetTimout}catch(e){t=defaultSetTimout}try{i="function"==typeof clearTimeout?clearTimeout:defaultClearTimeout}catch(e){i=defaultClearTimeout}}();var u=[],d=!1,f=-1;function cleanUpNextTick(){d&&l&&(d=!1,l.length?u=l.concat(u):f=-1,u.length&&drainQueue())}function drainQueue(){if(!d){var e=runTimeout(cleanUpNextTick);d=!0;for(var t=u.length;t;){for(l=u,u=[];++f<t;)l&&l[f].run();f=-1,t=u.length}l=null,d=!1,function(e){if(i===clearTimeout)return clearTimeout(e);if((i===defaultClearTimeout||!i)&&clearTimeout)return i=clearTimeout,clearTimeout(e);try{i(e)}catch(t){try{return i.call(null,e)}catch(t){return i.call(this,e)}}}(e)}}function Item(e,t){this.fun=e,this.array=t}function noop(){}h.nextTick=function(e){var t=Array(arguments.length-1);if(arguments.length>1)for(var i=1;i<arguments.length;i++)t[i-1]=arguments[i];u.push(new Item(e,t)),1!==u.length||d||runTimeout(drainQueue)},Item.prototype.run=function(){this.fun.apply(null,this.array)},h.title="browser",h.browser=!0,h.env={},h.argv=[],h.version="",h.versions={},h.on=noop,h.addListener=noop,h.once=noop,h.off=noop,h.removeListener=noop,h.removeAllListeners=noop,h.emit=noop,h.prependListener=noop,h.prependOnceListener=noop,h.listeners=function(e){return[]},h.binding=function(e){throw Error("process.binding is not supported")},h.cwd=function(){return"/"},h.chdir=function(e){throw Error("process.chdir is not supported")},h.umask=function(){return 0}}},i={};function __nccwpck_require__(e){var l=i[e];if(void 0!==l)return l.exports;var h=i[e]={exports:{}},u=!0;try{t[e](h,h.exports,__nccwpck_require__),u=!1}finally{u&&delete i[e]}return h.exports}__nccwpck_require__.ab="//";var l=__nccwpck_require__(229);e.exports=l}()},9008:function(e,t,i){e.exports=i(9201)}},function(e){var __webpack_exec__=function(t){return e(e.s=t)};e.O(0,[774,179],function(){return __webpack_exec__(6840),__webpack_exec__(9974)}),_N_E=e.O()}]);