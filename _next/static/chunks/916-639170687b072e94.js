(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[916],{1163:function(e,t,n){e.exports=n(9974)},7004:function(e,t,n){"use strict";n.d(t,{$C:function(){return getFunctions},V1:function(){return httpsCallable}});var i,r=n(5816),o=n(4444),a=n(8463);function mapValues(e,t){let n={};for(let i in e)e.hasOwnProperty(i)&&(n[i]=t(e[i]));return n}function decode(e){if(null==e)return e;if(e["@type"])switch(e["@type"]){case"type.googleapis.com/google.protobuf.Int64Value":case"type.googleapis.com/google.protobuf.UInt64Value":{let t=Number(e.value);if(isNaN(t))throw Error("Data cannot be decoded from JSON: "+e);return t}default:throw Error("Data cannot be decoded from JSON: "+e)}return Array.isArray(e)?e.map(e=>decode(e)):"function"==typeof e||"object"==typeof e?mapValues(e,e=>decode(e)):e}/**
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
 */let s="functions",u={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};let FunctionsError=class FunctionsError extends o.ZR{constructor(e,t,n){super(`${s}/${e}`,t||""),this.details=n}};/**
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
 */let ContextProvider=class ContextProvider{constructor(e,t,n){this.auth=null,this.messaging=null,this.appCheck=null,this.auth=e.getImmediate({optional:!0}),this.messaging=t.getImmediate({optional:!0}),this.auth||e.get().then(e=>this.auth=e,()=>{}),this.messaging||t.get().then(e=>this.messaging=e,()=>{}),this.appCheck||n.get().then(e=>this.appCheck=e,()=>{})}async getAuthToken(){if(this.auth)try{let e=await this.auth.getToken();return null==e?void 0:e.accessToken}catch(e){return}}async getMessagingToken(){if(this.messaging&&"Notification"in self&&"granted"===Notification.permission)try{return await this.messaging.getToken()}catch(e){return}}async getAppCheckToken(e){if(this.appCheck){let t=e?await this.appCheck.getLimitedUseToken():await this.appCheck.getToken();return t.error?null:t.token}return null}async getContext(e){let t=await this.getAuthToken(),n=await this.getMessagingToken(),i=await this.getAppCheckToken(e);return{authToken:t,messagingToken:n,appCheckToken:i}}};/**
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
 */let c="us-central1";let FunctionsService=class FunctionsService{constructor(e,t,n,i,r=c,o){this.app=e,this.fetchImpl=o,this.emulatorOrigin=null,this.contextProvider=new ContextProvider(t,n,i),this.cancelAllRequests=new Promise(e=>{this.deleteService=()=>Promise.resolve(e())});try{let e=new URL(r);this.customDomain=e.origin,this.region=c}catch(e){this.customDomain=null,this.region=r}}_delete(){return this.deleteService()}_url(e){let t=this.app.options.projectId;if(null!==this.emulatorOrigin){let n=this.emulatorOrigin;return`${n}/${t}/${this.region}/${e}`}return null!==this.customDomain?`${this.customDomain}/${e}`:`https://${this.region}-${t}.cloudfunctions.net/${e}`}};async function postJSON(e,t,n,i){let r;n["Content-Type"]="application/json";try{r=await i(e,{method:"POST",body:JSON.stringify(t),headers:n})}catch(e){return{status:0,json:null}}let o=null;try{o=await r.json()}catch(e){}return{status:r.status,json:o}}async function callAtURL(e,t,n,i){let r;n=function encode(e){if(null==e)return null;if(e instanceof Number&&(e=e.valueOf()),"number"==typeof e&&isFinite(e)||!0===e||!1===e||"[object String]"===Object.prototype.toString.call(e))return e;if(e instanceof Date)return e.toISOString();if(Array.isArray(e))return e.map(e=>encode(e));if("function"==typeof e||"object"==typeof e)return mapValues(e,e=>encode(e));throw Error("Data cannot be encoded in JSON: "+e)}(n);let o={data:n},a={},s=await e.contextProvider.getContext(i.limitedUseAppCheckTokens);s.authToken&&(a.Authorization="Bearer "+s.authToken),s.messagingToken&&(a["Firebase-Instance-ID-Token"]=s.messagingToken),null!==s.appCheckToken&&(a["X-Firebase-AppCheck"]=s.appCheckToken);let c=i.timeout||7e4,l=(r=null,{promise:new Promise((e,t)=>{r=setTimeout(()=>{t(new FunctionsError("deadline-exceeded","deadline-exceeded"))},c)}),cancel:()=>{r&&clearTimeout(r)}}),d=await Promise.race([postJSON(t,o,a,e.fetchImpl),l.promise,e.cancelAllRequests]);if(l.cancel(),!d)throw new FunctionsError("cancelled","Firebase Functions instance was deleted.");let h=function(e,t){let n,i=function(e){if(e>=200&&e<300)return"ok";switch(e){case 0:case 500:return"internal";case 400:return"invalid-argument";case 401:return"unauthenticated";case 403:return"permission-denied";case 404:return"not-found";case 409:return"aborted";case 429:return"resource-exhausted";case 499:return"cancelled";case 501:return"unimplemented";case 503:return"unavailable";case 504:return"deadline-exceeded"}return"unknown"}(e),r=i;try{let e=t&&t.error;if(e){let t=e.status;if("string"==typeof t){if(!u[t])return new FunctionsError("internal","internal");i=u[t],r=t}let o=e.message;"string"==typeof o&&(r=o),n=e.details,void 0!==n&&(n=decode(n))}}catch(e){}return"ok"===i?null:new FunctionsError(i,r,n)}(d.status,d.json);if(h)throw h;if(!d.json)throw new FunctionsError("internal","Response is not valid JSON object.");let p=d.json.data;if(void 0===p&&(p=d.json.result),void 0===p)throw new FunctionsError("internal","Response is missing data field.");let g=decode(p);return{data:g}}let l="@firebase/functions",d="0.10.0";/**
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
 */function getFunctions(e=(0,r.Mq)(),t=c){let n=(0,r.qX)((0,o.m9)(e),s),i=n.getImmediate({identifier:t}),a=(0,o.P0)("functions");return a&&function(e,t,n){(0,o.m9)(e).emulatorOrigin=`http://${t}:${n}`}(i,...a),i}function httpsCallable(e,t,n){var i;return i=(0,o.m9)(e),e=>(function(e,t,n,i){let r=e._url(t);return callAtURL(e,r,n,i)})(i,t,e,n||{})}i=fetch.bind(self),(0,r.Xd)(new a.wA(s,(e,{instanceIdentifier:t})=>{let n=e.getProvider("app").getImmediate(),r=e.getProvider("auth-internal"),o=e.getProvider("messaging-internal"),a=e.getProvider("app-check-internal");return new FunctionsService(n,r,o,a,t,i)},"PUBLIC").setMultipleInstances(!0)),(0,r.KN)(l,d,void 0),(0,r.KN)(l,d,"esm2017")}}]);