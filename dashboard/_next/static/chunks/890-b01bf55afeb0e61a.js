(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[890],{1163:function(e,t,n){e.exports=n(9974)},7004:function(e,t,n){"use strict";n.d(t,{$C:function(){return getFunctions},V1:function(){return httpsCallable}});var r,i=n(5816),s=n(4444),o=n(8463);function mapValues(e,t){let n={};for(let r in e)e.hasOwnProperty(r)&&(n[r]=t(e[r]));return n}function decode(e){if(null==e)return e;if(e["@type"])switch(e["@type"]){case"type.googleapis.com/google.protobuf.Int64Value":case"type.googleapis.com/google.protobuf.UInt64Value":{let t=Number(e.value);if(isNaN(t))throw Error("Data cannot be decoded from JSON: "+e);return t}default:throw Error("Data cannot be decoded from JSON: "+e)}return Array.isArray(e)?e.map(e=>decode(e)):"function"==typeof e||"object"==typeof e?mapValues(e,e=>decode(e)):e}/**
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
 */let a="functions",u={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};let FunctionsError=class FunctionsError extends s.ZR{constructor(e,t,n){super(`${a}/${e}`,t||""),this.details=n}};/**
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
 */let ContextProvider=class ContextProvider{constructor(e,t,n){this.auth=null,this.messaging=null,this.appCheck=null,this.auth=e.getImmediate({optional:!0}),this.messaging=t.getImmediate({optional:!0}),this.auth||e.get().then(e=>this.auth=e,()=>{}),this.messaging||t.get().then(e=>this.messaging=e,()=>{}),this.appCheck||n.get().then(e=>this.appCheck=e,()=>{})}async getAuthToken(){if(this.auth)try{let e=await this.auth.getToken();return null==e?void 0:e.accessToken}catch(e){return}}async getMessagingToken(){if(this.messaging&&"Notification"in self&&"granted"===Notification.permission)try{return await this.messaging.getToken()}catch(e){return}}async getAppCheckToken(e){if(this.appCheck){let t=e?await this.appCheck.getLimitedUseToken():await this.appCheck.getToken();return t.error?null:t.token}return null}async getContext(e){let t=await this.getAuthToken(),n=await this.getMessagingToken(),r=await this.getAppCheckToken(e);return{authToken:t,messagingToken:n,appCheckToken:r}}};/**
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
 */let l="us-central1";let FunctionsService=class FunctionsService{constructor(e,t,n,r,i=l,s){this.app=e,this.fetchImpl=s,this.emulatorOrigin=null,this.contextProvider=new ContextProvider(t,n,r),this.cancelAllRequests=new Promise(e=>{this.deleteService=()=>Promise.resolve(e())});try{let e=new URL(i);this.customDomain=e.origin,this.region=l}catch(e){this.customDomain=null,this.region=i}}_delete(){return this.deleteService()}_url(e){let t=this.app.options.projectId;if(null!==this.emulatorOrigin){let n=this.emulatorOrigin;return`${n}/${t}/${this.region}/${e}`}return null!==this.customDomain?`${this.customDomain}/${e}`:`https://${this.region}-${t}.cloudfunctions.net/${e}`}};async function postJSON(e,t,n,r){let i;n["Content-Type"]="application/json";try{i=await r(e,{method:"POST",body:JSON.stringify(t),headers:n})}catch(e){return{status:0,json:null}}let s=null;try{s=await i.json()}catch(e){}return{status:i.status,json:s}}async function callAtURL(e,t,n,r){let i;n=function encode(e){if(null==e)return null;if(e instanceof Number&&(e=e.valueOf()),"number"==typeof e&&isFinite(e)||!0===e||!1===e||"[object String]"===Object.prototype.toString.call(e))return e;if(e instanceof Date)return e.toISOString();if(Array.isArray(e))return e.map(e=>encode(e));if("function"==typeof e||"object"==typeof e)return mapValues(e,e=>encode(e));throw Error("Data cannot be encoded in JSON: "+e)}(n);let s={data:n},o={},a=await e.contextProvider.getContext(r.limitedUseAppCheckTokens);a.authToken&&(o.Authorization="Bearer "+a.authToken),a.messagingToken&&(o["Firebase-Instance-ID-Token"]=a.messagingToken),null!==a.appCheckToken&&(o["X-Firebase-AppCheck"]=a.appCheckToken);let l=r.timeout||7e4,c=(i=null,{promise:new Promise((e,t)=>{i=setTimeout(()=>{t(new FunctionsError("deadline-exceeded","deadline-exceeded"))},l)}),cancel:()=>{i&&clearTimeout(i)}}),d=await Promise.race([postJSON(t,s,o,e.fetchImpl),c.promise,e.cancelAllRequests]);if(c.cancel(),!d)throw new FunctionsError("cancelled","Firebase Functions instance was deleted.");let h=function(e,t){let n,r=function(e){if(e>=200&&e<300)return"ok";switch(e){case 0:case 500:return"internal";case 400:return"invalid-argument";case 401:return"unauthenticated";case 403:return"permission-denied";case 404:return"not-found";case 409:return"aborted";case 429:return"resource-exhausted";case 499:return"cancelled";case 501:return"unimplemented";case 503:return"unavailable";case 504:return"deadline-exceeded"}return"unknown"}(e),i=r;try{let e=t&&t.error;if(e){let t=e.status;if("string"==typeof t){if(!u[t])return new FunctionsError("internal","internal");r=u[t],i=t}let s=e.message;"string"==typeof s&&(i=s),n=e.details,void 0!==n&&(n=decode(n))}}catch(e){}return"ok"===r?null:new FunctionsError(r,i,n)}(d.status,d.json);if(h)throw h;if(!d.json)throw new FunctionsError("internal","Response is not valid JSON object.");let p=d.json.data;if(void 0===p&&(p=d.json.result),void 0===p)throw new FunctionsError("internal","Response is missing data field.");let f=decode(p);return{data:f}}let c="@firebase/functions",d="0.10.0";/**
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
 */function getFunctions(e=(0,i.Mq)(),t=l){let n=(0,i.qX)((0,s.m9)(e),a),r=n.getImmediate({identifier:t}),o=(0,s.P0)("functions");return o&&function(e,t,n){(0,s.m9)(e).emulatorOrigin=`http://${t}:${n}`}(r,...o),r}function httpsCallable(e,t,n){var r;return r=(0,s.m9)(e),e=>(function(e,t,n,r){let i=e._url(t);return callAtURL(e,i,n,r)})(r,t,e,n||{})}r=fetch.bind(self),(0,i.Xd)(new o.wA(a,(e,{instanceIdentifier:t})=>{let n=e.getProvider("app").getImmediate(),i=e.getProvider("auth-internal"),s=e.getProvider("messaging-internal"),o=e.getProvider("app-check-internal");return new FunctionsService(n,i,s,o,t,r)},"PUBLIC").setMultipleInstances(!0)),(0,i.KN)(c,d,void 0),(0,i.KN)(c,d,"esm2017")},1526:function(e,t,n){"use strict";n.d(t,{M:function(){return AnimatePresence}});var r=n(7294),i=n(8868);function useIsMounted(){let e=(0,r.useRef)(!1);return(0,i.L)(()=>(e.current=!0,()=>{e.current=!1}),[]),e}var s=n(2074),o=n(240),a=n(6681);let PopChildMeasure=class PopChildMeasure extends r.Component{getSnapshotBeforeUpdate(e){let t=this.props.childRef.current;if(t&&e.isPresent&&!this.props.isPresent){let e=this.props.sizeRef.current;e.height=t.offsetHeight||0,e.width=t.offsetWidth||0,e.top=t.offsetTop,e.left=t.offsetLeft}return null}componentDidUpdate(){}render(){return this.props.children}};function PopChild({children:e,isPresent:t}){let n=(0,r.useId)(),i=(0,r.useRef)(null),s=(0,r.useRef)({width:0,height:0,top:0,left:0});return(0,r.useInsertionEffect)(()=>{let{width:e,height:r,top:o,left:a}=s.current;if(t||!i.current||!e||!r)return;i.current.dataset.motionPopId=n;let u=document.createElement("style");return document.head.appendChild(u),u.sheet&&u.sheet.insertRule(`
          [data-motion-pop-id="${n}"] {
            position: absolute !important;
            width: ${e}px !important;
            height: ${r}px !important;
            top: ${o}px !important;
            left: ${a}px !important;
          }
        `),()=>{document.head.removeChild(u)}},[t]),r.createElement(PopChildMeasure,{isPresent:t,childRef:i,sizeRef:s},r.cloneElement(e,{ref:i}))}let PresenceChild=({children:e,initial:t,isPresent:n,onExitComplete:i,custom:s,presenceAffectsLayout:u,mode:l})=>{let c=(0,a.h)(newChildrenMap),d=(0,r.useId)(),h=(0,r.useMemo)(()=>({id:d,initial:t,isPresent:n,custom:s,onExitComplete:e=>{for(let t of(c.set(e,!0),c.values()))if(!t)return;i&&i()},register:e=>(c.set(e,!1),()=>c.delete(e))}),u?void 0:[n]);return(0,r.useMemo)(()=>{c.forEach((e,t)=>c.set(t,!1))},[n]),r.useEffect(()=>{n||c.size||!i||i()},[n]),"popLayout"===l&&(e=r.createElement(PopChild,{isPresent:n},e)),r.createElement(o.O.Provider,{value:h},e)};function newChildrenMap(){return new Map}var u=n(5364),l=n(5487);let getChildKey=e=>e.key||"",AnimatePresence=({children:e,custom:t,initial:n=!0,onExitComplete:o,exitBeforeEnter:a,presenceAffectsLayout:c=!0,mode:d="sync"})=>{var h;(0,l.k)(!a,"Replace exitBeforeEnter with mode='wait'");let p=(0,r.useContext)(u.p).forceRender||function(){let e=useIsMounted(),[t,n]=(0,r.useState)(0),i=(0,r.useCallback)(()=>{e.current&&n(t+1)},[t]),o=(0,r.useCallback)(()=>s.Wi.postRender(i),[i]);return[o,t]}()[0],f=useIsMounted(),m=function(e){let t=[];return r.Children.forEach(e,e=>{(0,r.isValidElement)(e)&&t.push(e)}),t}(e),g=m,E=(0,r.useRef)(new Map).current,C=(0,r.useRef)(g),y=(0,r.useRef)(new Map).current,k=(0,r.useRef)(!0);if((0,i.L)(()=>{k.current=!1,function(e,t){e.forEach(e=>{let n=getChildKey(e);t.set(n,e)})}(m,y),C.current=g}),h=()=>{k.current=!0,y.clear(),E.clear()},(0,r.useEffect)(()=>()=>h(),[]),k.current)return r.createElement(r.Fragment,null,g.map(e=>r.createElement(PresenceChild,{key:getChildKey(e),isPresent:!0,initial:!!n&&void 0,presenceAffectsLayout:c,mode:d},e)));g=[...g];let w=C.current.map(getChildKey),A=m.map(getChildKey),v=w.length;for(let e=0;e<v;e++){let t=w[e];-1!==A.indexOf(t)||E.has(t)||E.set(t,void 0)}return"wait"===d&&E.size&&(g=[]),E.forEach((e,n)=>{if(-1!==A.indexOf(n))return;let i=y.get(n);if(!i)return;let s=w.indexOf(n),a=e;a||(a=r.createElement(PresenceChild,{key:getChildKey(i),isPresent:!1,onExitComplete:()=>{E.delete(n);let e=Array.from(y.keys()).filter(e=>!A.includes(e));if(e.forEach(e=>y.delete(e)),C.current=m.filter(t=>{let r=getChildKey(t);return r===n||e.includes(r)}),!E.size){if(!1===f.current)return;p(),o&&o()}},custom:t,presenceAffectsLayout:c,mode:d},i),E.set(n,a)),g.splice(s,0,a)}),g=g.map(e=>{let t=e.key;return E.has(t)?e:r.createElement(PresenceChild,{key:getChildKey(e),isPresent:!0,presenceAffectsLayout:c,mode:d},e)}),r.createElement(r.Fragment,null,E.size?g:g.map(e=>(0,r.cloneElement)(e)))}}}]);