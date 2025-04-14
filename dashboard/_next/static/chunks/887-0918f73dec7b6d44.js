"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[887],{8887:function(e,t,n){let a,i,r,o,s,l;n.d(t,{IH:function(){return getAnalytics},Gb:function(){return isSupported}});var c,u=n(5816),d=n(3333),p=n(4444),f=n(8463);let instanceOfAny=(e,t)=>t.some(t=>e instanceof t),g=new WeakMap,h=new WeakMap,m=new WeakMap,w=new WeakMap,y=new WeakMap,v={get(e,t,n){if(e instanceof IDBTransaction){if("done"===t)return h.get(e);if("objectStoreNames"===t)return e.objectStoreNames||m.get(e);if("store"===t)return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return wrap_idb_value_wrap(e[t])},set:(e,t,n)=>(e[t]=n,!0),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function wrap_idb_value_wrap(e){var t;if(e instanceof IDBRequest)return function(e){let t=new Promise((t,n)=>{let unlisten=()=>{e.removeEventListener("success",success),e.removeEventListener("error",error)},success=()=>{t(wrap_idb_value_wrap(e.result)),unlisten()},error=()=>{n(e.error),unlisten()};e.addEventListener("success",success),e.addEventListener("error",error)});return t.then(t=>{t instanceof IDBCursor&&g.set(t,e)}).catch(()=>{}),y.set(t,e),t}(e);if(w.has(e))return w.get(e);let n="function"==typeof(t=e)?t!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?(i||(i=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(t)?function(...e){return t.apply(unwrap(this),e),wrap_idb_value_wrap(g.get(this))}:function(...e){return wrap_idb_value_wrap(t.apply(unwrap(this),e))}:function(e,...n){let a=t.call(unwrap(this),e,...n);return m.set(a,e.sort?e.sort():[e]),wrap_idb_value_wrap(a)}:(t instanceof IDBTransaction&&function(e){if(h.has(e))return;let t=new Promise((t,n)=>{let unlisten=()=>{e.removeEventListener("complete",complete),e.removeEventListener("error",error),e.removeEventListener("abort",error)},complete=()=>{t(),unlisten()},error=()=>{n(e.error||new DOMException("AbortError","AbortError")),unlisten()};e.addEventListener("complete",complete),e.addEventListener("error",error),e.addEventListener("abort",error)});h.set(e,t)}(t),instanceOfAny(t,a||(a=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])))?new Proxy(t,v):t;return n!==e&&(w.set(e,n),y.set(n,e)),n}let unwrap=e=>y.get(e),I=["get","getKey","getAll","getAllKeys","count"],b=["put","add","delete","clear"],T=new Map;function getMethod(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&"string"==typeof t))return;if(T.get(t))return T.get(t);let n=t.replace(/FromIndex$/,""),a=t!==n,i=b.includes(n);if(!(n in(a?IDBIndex:IDBObjectStore).prototype)||!(i||I.includes(n)))return;let method=async function(e,...t){let r=this.transaction(e,i?"readwrite":"readonly"),o=r.store;return a&&(o=o.index(t.shift())),(await Promise.all([o[n](...t),i&&r.done]))[0]};return T.set(t,method),method}v={...c=v,get:(e,t,n)=>getMethod(e,t)||c.get(e,t,n),has:(e,t)=>!!getMethod(e,t)||c.has(e,t)};let k="@firebase/installations",A="0.6.4",D=`w:${A}`,S="FIS_v2",C=new p.LL("installations","Installations",{"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."});function isServerError(e){return e instanceof p.ZR&&e.code.includes("request-failed")}/**
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
 */function getInstallationsEndpoint({projectId:e}){return`https://firebaseinstallations.googleapis.com/v1/projects/${e}/installations`}function extractAuthTokenInfoFromResponse(e){return{token:e.token,requestStatus:2,expiresIn:Number(e.expiresIn.replace("s","000")),creationTime:Date.now()}}async function getErrorFromResponse(e,t){let n=await t.json(),a=n.error;return C.create("request-failed",{requestName:e,serverCode:a.code,serverMessage:a.message,serverStatus:a.status})}function getHeaders({apiKey:e}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":e})}async function retryIfServerError(e){let t=await e();return t.status>=500&&t.status<600?e():t}/**
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
 */async function createInstallationRequest({appConfig:e,heartbeatServiceProvider:t},{fid:n}){let a=getInstallationsEndpoint(e),i=getHeaders(e),r=t.getImmediate({optional:!0});if(r){let e=await r.getHeartbeatsHeader();e&&i.append("x-firebase-client",e)}let o={fid:n,authVersion:S,appId:e.appId,sdkVersion:D},s={method:"POST",headers:i,body:JSON.stringify(o)},l=await retryIfServerError(()=>fetch(a,s));if(l.ok){let e=await l.json(),t={fid:e.fid||n,registrationStatus:2,refreshToken:e.refreshToken,authToken:extractAuthTokenInfoFromResponse(e.authToken)};return t}throw await getErrorFromResponse("Create Installation",l)}/**
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
 */function sleep(e){return new Promise(t=>{setTimeout(t,e)})}/**
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
 */let E=/^[cdef][\w-]{21}$/;/**
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
 */function getKey(e){return`${e.appName}!${e.appId}`}/**
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
 */let R=new Map;function fidChanged(e,t){let n=getKey(e);callFidChangeCallbacks(n,t),function(e,t){let n=(!F&&"BroadcastChannel"in self&&((F=new BroadcastChannel("[Firebase] FID Change")).onmessage=e=>{callFidChangeCallbacks(e.data.key,e.data.fid)}),F);n&&n.postMessage({key:e,fid:t}),0===R.size&&F&&(F.close(),F=null)}(n,t)}function callFidChangeCallbacks(e,t){let n=R.get(e);if(n)for(let e of n)e(t)}let F=null,q="firebase-installations-store",j=null;function getDbPromise(){return j||(j=function(e,t,{blocked:n,upgrade:a,blocking:i,terminated:r}={}){let o=indexedDB.open(e,1),s=wrap_idb_value_wrap(o);return a&&o.addEventListener("upgradeneeded",e=>{a(wrap_idb_value_wrap(o.result),e.oldVersion,e.newVersion,wrap_idb_value_wrap(o.transaction))}),n&&o.addEventListener("blocked",()=>n()),s.then(e=>{r&&e.addEventListener("close",()=>r()),i&&e.addEventListener("versionchange",()=>i())}).catch(()=>{}),s}("firebase-installations-database",0,{upgrade:(e,t)=>{0===t&&e.createObjectStore(q)}})),j}async function set(e,t){let n=getKey(e),a=await getDbPromise(),i=a.transaction(q,"readwrite"),r=i.objectStore(q),o=await r.get(n);return await r.put(t,n),await i.done,o&&o.fid===t.fid||fidChanged(e,t.fid),t}async function remove(e){let t=getKey(e),n=await getDbPromise(),a=n.transaction(q,"readwrite");await a.objectStore(q).delete(t),await a.done}async function update(e,t){let n=getKey(e),a=await getDbPromise(),i=a.transaction(q,"readwrite"),r=i.objectStore(q),o=await r.get(n),s=t(o);return void 0===s?await r.delete(n):await r.put(s,n),await i.done,s&&(!o||o.fid!==s.fid)&&fidChanged(e,s.fid),s}/**
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
 */async function getInstallationEntry(e){let t;let n=await update(e.appConfig,n=>{let a=function(e){let t=e||{fid:function(){try{let e=new Uint8Array(17),t=self.crypto||self.msCrypto;t.getRandomValues(e),e[0]=112+e[0]%16;let n=function(e){let t=/**
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
 */function(e){let t=btoa(String.fromCharCode(...e));return t.replace(/\+/g,"-").replace(/\//g,"_")}(e);return t.substr(0,22)}(e);return E.test(n)?n:""}catch(e){return""}}(),registrationStatus:0};return clearTimedOutRequest(t)}(n),i=function(e,t){if(0===t.registrationStatus){if(!navigator.onLine){let e=Promise.reject(C.create("app-offline"));return{installationEntry:t,registrationPromise:e}}let n={fid:t.fid,registrationStatus:1,registrationTime:Date.now()},a=registerInstallation(e,n);return{installationEntry:n,registrationPromise:a}}return 1===t.registrationStatus?{installationEntry:t,registrationPromise:waitUntilFidRegistration(e)}:{installationEntry:t}}(e,a);return t=i.registrationPromise,i.installationEntry});return""===n.fid?{installationEntry:await t}:{installationEntry:n,registrationPromise:t}}async function registerInstallation(e,t){try{let n=await createInstallationRequest(e,t);return set(e.appConfig,n)}catch(n){throw isServerError(n)&&409===n.customData.serverCode?await remove(e.appConfig):await set(e.appConfig,{fid:t.fid,registrationStatus:0}),n}}async function waitUntilFidRegistration(e){let t=await updateInstallationRequest(e.appConfig);for(;1===t.registrationStatus;)await sleep(100),t=await updateInstallationRequest(e.appConfig);if(0===t.registrationStatus){let{installationEntry:t,registrationPromise:n}=await getInstallationEntry(e);return n||t}return t}function updateInstallationRequest(e){return update(e,e=>{if(!e)throw C.create("installation-not-found");return clearTimedOutRequest(e)})}function clearTimedOutRequest(e){return 1===e.registrationStatus&&e.registrationTime+1e4<Date.now()?{fid:e.fid,registrationStatus:0}:e}/**
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
 */async function generateAuthTokenRequest({appConfig:e,heartbeatServiceProvider:t},n){let a=function(e,{fid:t}){return`${getInstallationsEndpoint(e)}/${t}/authTokens:generate`}(e,n),i=function(e,{refreshToken:t}){let n=getHeaders(e);return n.append("Authorization",`${S} ${t}`),n}(e,n),r=t.getImmediate({optional:!0});if(r){let e=await r.getHeartbeatsHeader();e&&i.append("x-firebase-client",e)}let o={installation:{sdkVersion:D,appId:e.appId}},s={method:"POST",headers:i,body:JSON.stringify(o)},l=await retryIfServerError(()=>fetch(a,s));if(l.ok){let e=await l.json(),t=extractAuthTokenInfoFromResponse(e);return t}throw await getErrorFromResponse("Generate Auth Token",l)}/**
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
 */async function refreshAuthToken(e,t=!1){let n;let a=await update(e.appConfig,a=>{var i;if(!isEntryRegistered(a))throw C.create("not-registered");let r=a.authToken;if(!t&&2===(i=r).requestStatus&&!function(e){let t=Date.now();return t<e.creationTime||e.creationTime+e.expiresIn<t+36e5}(i))return a;if(1===r.requestStatus)return n=waitUntilAuthTokenRequest(e,t),a;{if(!navigator.onLine)throw C.create("app-offline");let t=function(e){let t={requestStatus:1,requestTime:Date.now()};return Object.assign(Object.assign({},e),{authToken:t})}(a);return n=fetchAuthTokenFromServer(e,t),t}}),i=n?await n:a.authToken;return i}async function waitUntilAuthTokenRequest(e,t){let n=await updateAuthTokenRequest(e.appConfig);for(;1===n.authToken.requestStatus;)await sleep(100),n=await updateAuthTokenRequest(e.appConfig);let a=n.authToken;return 0===a.requestStatus?refreshAuthToken(e,t):a}function updateAuthTokenRequest(e){return update(e,e=>{if(!isEntryRegistered(e))throw C.create("not-registered");let t=e.authToken;return 1===t.requestStatus&&t.requestTime+1e4<Date.now()?Object.assign(Object.assign({},e),{authToken:{requestStatus:0}}):e})}async function fetchAuthTokenFromServer(e,t){try{let n=await generateAuthTokenRequest(e,t),a=Object.assign(Object.assign({},t),{authToken:n});return await set(e.appConfig,a),n}catch(n){if(isServerError(n)&&(401===n.customData.serverCode||404===n.customData.serverCode))await remove(e.appConfig);else{let n=Object.assign(Object.assign({},t),{authToken:{requestStatus:0}});await set(e.appConfig,n)}throw n}}function isEntryRegistered(e){return void 0!==e&&2===e.registrationStatus}/**
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
 */async function getId(e){let{installationEntry:t,registrationPromise:n}=await getInstallationEntry(e);return n?n.catch(console.error):refreshAuthToken(e).catch(console.error),t.fid}/**
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
 */async function getToken(e,t=!1){await completeInstallationRegistration(e);let n=await refreshAuthToken(e,t);return n.token}async function completeInstallationRegistration(e){let{registrationPromise:t}=await getInstallationEntry(e);t&&await t}function getMissingValueError(e){return C.create("missing-app-config-values",{valueName:e})}/**
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
 */let _="installations";(0,u.Xd)(new f.wA(_,e=>{let t=e.getProvider("app").getImmediate(),n=/**
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
 */function(e){if(!e||!e.options)throw getMissingValueError("App Configuration");if(!e.name)throw getMissingValueError("App Name");for(let t of["projectId","apiKey","appId"])if(!e.options[t])throw getMissingValueError(t);return{appName:e.name,projectId:e.options.projectId,apiKey:e.options.apiKey,appId:e.options.appId}}(t),a=(0,u.qX)(t,"heartbeat");return{app:t,appConfig:n,heartbeatServiceProvider:a,_delete:()=>Promise.resolve()}},"PUBLIC")),(0,u.Xd)(new f.wA("installations-internal",e=>{let t=e.getProvider("app").getImmediate(),n=(0,u.qX)(t,_).getImmediate();return{getId:()=>getId(n),getToken:e=>getToken(n,e)}},"PRIVATE")),(0,u.KN)(k,A),(0,u.KN)(k,A,"esm2017");/**
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
 */let M="analytics",$="https://www.googletagmanager.com/gtag/js",x=new d.Yd("@firebase/analytics"),P=new p.LL("analytics","Analytics",{"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-intialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."});/**
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
 */function createGtagTrustedTypesScriptURL(e){if(!e.startsWith($)){let t=P.create("invalid-gtag-resource",{gtagURL:e});return x.warn(t.message),""}return e}function promiseAllSettled(e){return Promise.all(e.map(e=>e.catch(e=>e)))}async function gtagOnConfig(e,t,n,a,i,r){let o=a[i];try{if(o)await t[o];else{let e=await promiseAllSettled(n),a=e.find(e=>e.measurementId===i);a&&await t[a.appId]}}catch(e){x.error(e)}e("config",i,r)}async function gtagOnEvent(e,t,n,a,i){try{let r=[];if(i&&i.send_to){let e=i.send_to;Array.isArray(e)||(e=[e]);let a=await promiseAllSettled(n);for(let n of e){let e=a.find(e=>e.measurementId===n),i=e&&t[e.appId];if(i)r.push(i);else{r=[];break}}}0===r.length&&(r=Object.values(t)),await Promise.all(r),e("event",a,i||{})}catch(e){x.error(e)}}let L=new class{constructor(e={},t=1e3){this.throttleMetadata=e,this.intervalMillis=t}getThrottleMetadata(e){return this.throttleMetadata[e]}setThrottleMetadata(e,t){this.throttleMetadata[e]=t}deleteThrottleMetadata(e){delete this.throttleMetadata[e]}};async function fetchDynamicConfig(e){var t;let{appId:n,apiKey:a}=e,i={method:"GET",headers:new Headers({Accept:"application/json","x-goog-api-key":a})},r="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig".replace("{app-id}",n),o=await fetch(r,i);if(200!==o.status&&304!==o.status){let e="";try{let n=await o.json();(null===(t=n.error)||void 0===t?void 0:t.message)&&(e=n.error.message)}catch(e){}throw P.create("config-fetch-failed",{httpStatus:o.status,responseMessage:e})}return o.json()}async function fetchDynamicConfigWithRetry(e,t=L,n){let{appId:a,apiKey:i,measurementId:r}=e.options;if(!a)throw P.create("no-app-id");if(!i){if(r)return{measurementId:r,appId:a};throw P.create("no-api-key")}let o=t.getThrottleMetadata(a)||{backoffCount:0,throttleEndTimeMillis:Date.now()},s=new AnalyticsAbortSignal;return setTimeout(async()=>{s.abort()},void 0!==n?n:6e4),attemptFetchDynamicConfigWithRetry({appId:a,apiKey:i,measurementId:r},o,s,t)}async function attemptFetchDynamicConfigWithRetry(e,{throttleEndTimeMillis:t,backoffCount:n},a,i=L){var r;let{appId:o,measurementId:s}=e;try{await new Promise((e,n)=>{let i=Math.max(t-Date.now(),0),r=setTimeout(e,i);a.addEventListener(()=>{clearTimeout(r),n(P.create("fetch-throttle",{throttleEndTimeMillis:t}))})})}catch(e){if(s)return x.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${s} provided in the "measurementId" field in the local Firebase config. [${null==e?void 0:e.message}]`),{appId:o,measurementId:s};throw e}try{let t=await fetchDynamicConfig(e);return i.deleteThrottleMetadata(o),t}catch(c){if(!function(e){if(!(e instanceof p.ZR)||!e.customData)return!1;let t=Number(e.customData.httpStatus);return 429===t||500===t||503===t||504===t}(c)){if(i.deleteThrottleMetadata(o),s)return x.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${s} provided in the "measurementId" field in the local Firebase config. [${null==c?void 0:c.message}]`),{appId:o,measurementId:s};throw c}let t=503===Number(null===(r=null==c?void 0:c.customData)||void 0===r?void 0:r.httpStatus)?(0,p.$s)(n,i.intervalMillis,30):(0,p.$s)(n,i.intervalMillis),l={throttleEndTimeMillis:Date.now()+t,backoffCount:n+1};return i.setThrottleMetadata(o,l),x.debug(`Calling attemptFetch again in ${t} millis`),attemptFetchDynamicConfigWithRetry(e,l,a,i)}}let AnalyticsAbortSignal=class AnalyticsAbortSignal{constructor(){this.listeners=[]}addEventListener(e){this.listeners.push(e)}abort(){this.listeners.forEach(e=>e())}};async function logEvent$1(e,t,n,a,i){if(i&&i.global){e("event",n,a);return}{let i=await t,r=Object.assign(Object.assign({},a),{send_to:i});e("event",n,r)}}/**
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
 */async function validateIndexedDB(){if(!(0,p.hl)())return x.warn(P.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;try{await (0,p.eu)()}catch(e){return x.warn(P.create("indexeddb-unavailable",{errorInfo:null==e?void 0:e.toString()}).message),!1}return!0}async function _initializeAnalytics(e,t,n,a,i,s,l){var c;let u=fetchDynamicConfigWithRetry(e);u.then(t=>{n[t.measurementId]=t.appId,e.options.measurementId&&t.measurementId!==e.options.measurementId&&x.warn(`The measurement ID in the local Firebase config (${e.options.measurementId}) does not match the measurement ID fetched from the server (${t.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(e=>x.error(e)),t.push(u);let d=validateIndexedDB().then(e=>e?a.getId():void 0),[p,f]=await Promise.all([u,d]);!function(e){let t=window.document.getElementsByTagName("script");for(let n of Object.values(t))if(n.src&&n.src.includes($)&&n.src.includes(e))return n;return null}(s)&&function(e,t){let n;let a=(window.trustedTypes&&(n=window.trustedTypes.createPolicy("firebase-js-sdk-policy",{createScriptURL:createGtagTrustedTypesScriptURL})),n),i=document.createElement("script"),r=`${$}?l=${e}&id=${t}`;i.src=a?null==a?void 0:a.createScriptURL(r):r,i.async=!0,document.head.appendChild(i)}(s,p.measurementId),o&&(i("consent","default",o),o=void 0),i("js",new Date);let g=null!==(c=null==l?void 0:l.config)&&void 0!==c?c:{};return g.origin="firebase",g.update=!0,null!=f&&(g.firebase_id=f),i("config",p.measurementId,g),r&&(i("set",r),r=void 0),p.measurementId}/**
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
 */let AnalyticsService=class AnalyticsService{constructor(e){this.app=e}_delete(){return delete O[this.app.options.appId],Promise.resolve()}};let O={},B=[],N={},z="dataLayer",K=!1;function getAnalytics(e=(0,u.Mq)()){e=(0,p.m9)(e);let t=(0,u.qX)(e,M);return t.isInitialized()?t.getImmediate():function(e,t={}){let n=(0,u.qX)(e,M);if(n.isInitialized()){let e=n.getImmediate();if((0,p.vZ)(t,n.getOptions()))return e;throw P.create("already-initialized")}let a=n.initialize({options:t});return a}(e)}async function isSupported(){if((0,p.ru)()||!(0,p.zI)()||!(0,p.hl)())return!1;try{let e=await (0,p.eu)();return e}catch(e){return!1}}let U="@firebase/analytics",W="0.10.0";(0,u.Xd)(new f.wA(M,(e,{options:t})=>{let n=e.getProvider("app").getImmediate(),a=e.getProvider("installations-internal").getImmediate();return function(e,t,n){!function(){let e=[];if((0,p.ru)()&&e.push("This is a browser extension environment."),(0,p.zI)()||e.push("Cookies are not available."),e.length>0){let t=e.map((e,t)=>`(${t+1}) ${e}`).join(" "),n=P.create("invalid-analytics-context",{errorInfo:t});x.warn(n.message)}}();let a=e.options.appId;if(!a)throw P.create("no-app-id");if(!e.options.apiKey){if(e.options.measurementId)x.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${e.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw P.create("no-api-key")}if(null!=O[a])throw P.create("already-exists",{id:a});if(!K){var i,r;let e,t;e=[],Array.isArray(window[z])?e=window[z]:window[z]=e;let{wrappedGtag:n,gtagCore:a}=(i="gtag",t=function(...e){window[z].push(arguments)},window[i]&&"function"==typeof window[i]&&(t=window[i]),window[i]=(r=t,async function(e,...t){try{if("event"===e){let[e,n]=t;await gtagOnEvent(r,O,B,e,n)}else if("config"===e){let[e,n]=t;await gtagOnConfig(r,O,B,N,e,n)}else if("consent"===e){let[e]=t;r("consent","update",e)}else if("get"===e){let[e,n,a]=t;r("get",e,n,a)}else if("set"===e){let[e]=t;r("set",e)}else r(e,...t)}catch(e){x.error(e)}}),{gtagCore:t,wrappedGtag:window[i]});l=n,s=a,K=!0}O[a]=_initializeAnalytics(e,B,N,t,s,z,n);let o=new AnalyticsService(e);return o}(n,a,t)},"PUBLIC")),(0,u.Xd)(new f.wA("analytics-internal",function(e){try{let t=e.getProvider(M).getImmediate();return{logEvent:(e,n,a)=>{var i;return i=t,void(i=(0,p.m9)(i),logEvent$1(l,O[i.app.options.appId],e,n,a).catch(e=>x.error(e)))}}}catch(e){throw P.create("interop-component-reg-failed",{reason:e})}},"PRIVATE")),(0,u.KN)(U,W),(0,u.KN)(U,W,"esm2017")}}]);