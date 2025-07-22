import{o as Vl,_ as ko}from"./vendor-CrhDUPGb.js";const Np=()=>{};var Hc={};/**
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
 */const Ol=function(n){const e=[];let t=0;for(let r=0;r<n.length;r++){let i=n.charCodeAt(r);i<128?e[t++]=i:i<2048?(e[t++]=i>>6|192,e[t++]=i&63|128):(i&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(n.charCodeAt(++r)&1023),e[t++]=i>>18|240,e[t++]=i>>12&63|128,e[t++]=i>>6&63|128,e[t++]=i&63|128):(e[t++]=i>>12|224,e[t++]=i>>6&63|128,e[t++]=i&63|128)}return e},Dp=function(n){const e=[];let t=0,r=0;for(;t<n.length;){const i=n[t++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=n[t++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=n[t++],a=n[t++],c=n[t++],l=((i&7)<<18|(s&63)<<12|(a&63)<<6|c&63)-65536;e[r++]=String.fromCharCode(55296+(l>>10)),e[r++]=String.fromCharCode(56320+(l&1023))}else{const s=n[t++],a=n[t++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|a&63)}}return e.join("")},Ll={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<n.length;i+=3){const s=n[i],a=i+1<n.length,c=a?n[i+1]:0,l=i+2<n.length,d=l?n[i+2]:0,f=s>>2,m=(s&3)<<4|c>>4;let _=(c&15)<<2|d>>6,R=d&63;l||(R=64,a||(_=64)),r.push(t[f],t[m],t[_],t[R])}return r.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(Ol(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):Dp(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<n.length;){const s=t[n.charAt(i++)],c=i<n.length?t[n.charAt(i)]:0;++i;const d=i<n.length?t[n.charAt(i)]:64;++i;const m=i<n.length?t[n.charAt(i)]:64;if(++i,s==null||c==null||d==null||m==null)throw new Vp;const _=s<<2|c>>4;if(r.push(_),d!==64){const R=c<<4&240|d>>2;if(r.push(R),m!==64){const C=d<<6&192|m;r.push(C)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class Vp extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Op=function(n){const e=Ol(n);return Ll.encodeByteArray(e,!0)},Ti=function(n){return Op(n).replace(/\./g,"")},Ml=function(n){try{return Ll.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function Lp(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const Mp=()=>Lp().__FIREBASE_DEFAULTS__,xp=()=>{if(typeof process>"u"||typeof Hc>"u")return;const n=Hc.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},Up=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&Ml(n[1]);return e&&JSON.parse(e)},$i=()=>{try{return Np()||Mp()||xp()||Up()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},xl=n=>{var e,t;return(t=(e=$i())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[n]},No=n=>{const e=xl(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),r]:[e.substring(0,t),r]},Ul=()=>{var n;return(n=$i())===null||n===void 0?void 0:n.config},Fl=n=>{var e;return(e=$i())===null||e===void 0?void 0:e[`_${n}`]};/**
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
 */class Fp{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,r))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Tt(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function qi(n){return(await fetch(n,{credentials:"include"})).ok}/**
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
 */function Bl(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},r=e||"demo-project",i=n.iat||0,s=n.sub||n.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const a=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:i,exp:i+3600,auth_time:i,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}}},n);return[Ti(JSON.stringify(t)),Ti(JSON.stringify(a)),""].join(".")}const cr={};function Bp(){const n={prod:[],emulator:[]};for(const e of Object.keys(cr))cr[e]?n.emulator.push(e):n.prod.push(e);return n}function jp(n){let e=document.getElementById(n),t=!1;return e||(e=document.createElement("div"),e.setAttribute("id",n),t=!0),{created:t,element:e}}let Gc=!1;function zi(n,e){if(typeof window>"u"||typeof document>"u"||!Tt(window.location.host)||cr[n]===e||cr[n]||Gc)return;cr[n]=e;function t(_){return`__firebase__banner__${_}`}const r="__firebase__banner",s=Bp().prod.length>0;function a(){const _=document.getElementById(r);_&&_.remove()}function c(_){_.style.display="flex",_.style.background="#7faaf0",_.style.position="fixed",_.style.bottom="5px",_.style.left="5px",_.style.padding=".5em",_.style.borderRadius="5px",_.style.alignItems="center"}function l(_,R){_.setAttribute("width","24"),_.setAttribute("id",R),_.setAttribute("height","24"),_.setAttribute("viewBox","0 0 24 24"),_.setAttribute("fill","none"),_.style.marginLeft="-6px"}function d(){const _=document.createElement("span");return _.style.cursor="pointer",_.style.marginLeft="16px",_.style.fontSize="24px",_.innerHTML=" &times;",_.onclick=()=>{Gc=!0,a()},_}function f(_,R){_.setAttribute("id",R),_.innerText="Learn more",_.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",_.setAttribute("target","__blank"),_.style.paddingLeft="5px",_.style.textDecoration="underline"}function m(){const _=jp(r),R=t("text"),C=document.getElementById(R)||document.createElement("span"),D=t("learnmore"),k=document.getElementById(D)||document.createElement("a"),$=t("preprendIcon"),x=document.getElementById($)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(_.created){const U=_.element;c(U),f(k,D);const z=d();l(x,$),U.append(x,C,k,z),document.body.appendChild(U)}s?(C.innerText="Preview backend disconnected.",x.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(x.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,C.innerText="Preview backend running in this workspace."),C.setAttribute("id",R)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",m):m()}/**
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
 */function be(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function $p(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(be())}function qp(){var n;const e=(n=$i())===null||n===void 0?void 0:n.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function zp(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Do(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function Hp(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Gp(){const n=be();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function Wp(){return!qp()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Vo(){try{return typeof indexedDB=="object"}catch{return!1}}function Oo(){return new Promise((n,e)=>{try{let t=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),t||self.indexedDB.deleteDatabase(r),n(!0)},i.onupgradeneeded=()=>{t=!1},i.onerror=()=>{var s;e(((s=i.error)===null||s===void 0?void 0:s.message)||"")}}catch(t){e(t)}})}function jl(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
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
 */const Kp="FirebaseError";class je extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name=Kp,Object.setPrototypeOf(this,je.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,an.prototype.create)}}class an{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){const r=t[0]||{},i=`${this.service}/${e}`,s=this.errors[e],a=s?Qp(s,r):"Error",c=`${this.serviceName}: ${a} (${i}).`;return new je(i,c,r)}}function Qp(n,e){return n.replace(Jp,(t,r)=>{const i=e[r];return i!=null?String(i):`<${r}?>`})}const Jp=/\{\$([^}]+)}/g;function Xp(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function pt(n,e){if(n===e)return!0;const t=Object.keys(n),r=Object.keys(e);for(const i of t){if(!r.includes(i))return!1;const s=n[i],a=e[i];if(Wc(s)&&Wc(a)){if(!pt(s,a))return!1}else if(s!==a)return!1}for(const i of r)if(!t.includes(i))return!1;return!0}function Wc(n){return n!==null&&typeof n=="object"}/**
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
 */function Sr(n){const e=[];for(const[t,r]of Object.entries(n))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function Yp(n,e){const t=new Zp(n,e);return t.subscribe.bind(t)}class Zp{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,r){let i;if(e===void 0&&t===void 0&&r===void 0)throw new Error("Missing Observer.");em(e,["next","error","complete"])?i=e:i={next:e,error:t,complete:r},i.next===void 0&&(i.next=qs),i.error===void 0&&(i.error=qs),i.complete===void 0&&(i.complete=qs);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function em(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function qs(){}/**
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
 */const tm=1e3,nm=2,rm=4*60*60*1e3,im=.5;function Kc(n,e=tm,t=nm){const r=e*Math.pow(t,n),i=Math.round(im*r*(Math.random()-.5)*2);return Math.min(rm,r+i)}/**
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
 */function X(n){return n&&n._delegate?n._delegate:n}class Be{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const Kt="[DEFAULT]";/**
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
 */class sm{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const r=new Fp;if(this.instancesDeferred.set(t,r),this.isInitialized(t)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:t});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const r=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),i=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(s){if(i)return null;throw s}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(am(e))try{this.getOrInitializeService({instanceIdentifier:Kt})}catch{}for(const[t,r]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(t);try{const s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(e=Kt){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Kt){return this.instances.has(e)}getOptions(e=Kt){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:r,options:t});for(const[s,a]of this.instancesDeferred.entries()){const c=this.normalizeInstanceIdentifier(s);r===c&&a.resolve(i)}return i}onInit(e,t){var r;const i=this.normalizeInstanceIdentifier(t),s=(r=this.onInitCallbacks.get(i))!==null&&r!==void 0?r:new Set;s.add(e),this.onInitCallbacks.set(i,s);const a=this.instances.get(i);return a&&e(a,i),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){const r=this.onInitCallbacks.get(t);if(r)for(const i of r)try{i(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:om(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=Kt){return this.component?this.component.multipleInstances?e:Kt:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function om(n){return n===Kt?void 0:n}function am(n){return n.instantiationMode==="EAGER"}/**
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
 */class cm{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new sm(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var H;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(H||(H={}));const um={debug:H.DEBUG,verbose:H.VERBOSE,info:H.INFO,warn:H.WARN,error:H.ERROR,silent:H.SILENT},lm=H.INFO,hm={[H.DEBUG]:"log",[H.VERBOSE]:"log",[H.INFO]:"info",[H.WARN]:"warn",[H.ERROR]:"error"},dm=(n,e,...t)=>{if(e<n.logLevel)return;const r=new Date().toISOString(),i=hm[e];if(i)console[i](`[${r}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Hi{constructor(e){this.name=e,this._logLevel=lm,this._logHandler=dm,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in H))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?um[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,H.DEBUG,...e),this._logHandler(this,H.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,H.VERBOSE,...e),this._logHandler(this,H.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,H.INFO,...e),this._logHandler(this,H.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,H.WARN,...e),this._logHandler(this,H.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,H.ERROR,...e),this._logHandler(this,H.ERROR,...e)}}/**
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
 */class fm{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(pm(t)){const r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}}function pm(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const no="@firebase/app",Qc="0.13.2";/**
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
 */const mt=new Hi("@firebase/app"),mm="@firebase/app-compat",gm="@firebase/analytics-compat",_m="@firebase/analytics",ym="@firebase/app-check-compat",vm="@firebase/app-check",Tm="@firebase/auth",Em="@firebase/auth-compat",Im="@firebase/database",wm="@firebase/data-connect",Am="@firebase/database-compat",Rm="@firebase/functions",bm="@firebase/functions-compat",Sm="@firebase/installations",Pm="@firebase/installations-compat",Cm="@firebase/messaging",km="@firebase/messaging-compat",Nm="@firebase/performance",Dm="@firebase/performance-compat",Vm="@firebase/remote-config",Om="@firebase/remote-config-compat",Lm="@firebase/storage",Mm="@firebase/storage-compat",xm="@firebase/firestore",Um="@firebase/ai",Fm="@firebase/firestore-compat",Bm="firebase",jm="11.10.0";/**
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
 */const ro="[DEFAULT]",$m={[no]:"fire-core",[mm]:"fire-core-compat",[_m]:"fire-analytics",[gm]:"fire-analytics-compat",[vm]:"fire-app-check",[ym]:"fire-app-check-compat",[Tm]:"fire-auth",[Em]:"fire-auth-compat",[Im]:"fire-rtdb",[wm]:"fire-data-connect",[Am]:"fire-rtdb-compat",[Rm]:"fire-fn",[bm]:"fire-fn-compat",[Sm]:"fire-iid",[Pm]:"fire-iid-compat",[Cm]:"fire-fcm",[km]:"fire-fcm-compat",[Nm]:"fire-perf",[Dm]:"fire-perf-compat",[Vm]:"fire-rc",[Om]:"fire-rc-compat",[Lm]:"fire-gcs",[Mm]:"fire-gcs-compat",[xm]:"fire-fst",[Fm]:"fire-fst-compat",[Um]:"fire-vertex","fire-js":"fire-js",[Bm]:"fire-js-all"};/**
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
 */const gr=new Map,qm=new Map,io=new Map;function Jc(n,e){try{n.container.addComponent(e)}catch(t){mt.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function ze(n){const e=n.name;if(io.has(e))return mt.debug(`There were multiple attempts to register component ${e}.`),!1;io.set(e,n);for(const t of gr.values())Jc(t,n);for(const t of qm.values())Jc(t,n);return!0}function Et(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function Ne(n){return n==null?!1:n.settings!==void 0}/**
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
 */const zm={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},kt=new an("app","Firebase",zm);/**
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
 */class Hm{constructor(e,t,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new Be("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw kt.create("app-deleted",{appName:this._name})}}/**
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
 */const cn=jm;function Gm(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const r=Object.assign({name:ro,automaticDataCollectionEnabled:!0},e),i=r.name;if(typeof i!="string"||!i)throw kt.create("bad-app-name",{appName:String(i)});if(t||(t=Ul()),!t)throw kt.create("no-options");const s=gr.get(i);if(s){if(pt(t,s.options)&&pt(r,s.config))return s;throw kt.create("duplicate-app",{appName:i})}const a=new cm(i);for(const l of io.values())a.addComponent(l);const c=new Hm(t,r,a);return gr.set(i,c),c}function Pr(n=ro){const e=gr.get(n);if(!e&&n===ro&&Ul())return Gm();if(!e)throw kt.create("no-app",{appName:n});return e}function Xw(){return Array.from(gr.values())}function Re(n,e,t){var r;let i=(r=$m[n])!==null&&r!==void 0?r:n;t&&(i+=`-${t}`);const s=i.match(/\s|\//),a=e.match(/\s|\//);if(s||a){const c=[`Unable to register library "${i}" with version "${e}":`];s&&c.push(`library name "${i}" contains illegal characters (whitespace or "/")`),s&&a&&c.push("and"),a&&c.push(`version name "${e}" contains illegal characters (whitespace or "/")`),mt.warn(c.join(" "));return}ze(new Be(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}/**
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
 */const Wm="firebase-heartbeat-database",Km=1,_r="firebase-heartbeat-store";let zs=null;function $l(){return zs||(zs=Vl(Wm,Km,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(_r)}catch(t){console.warn(t)}}}}).catch(n=>{throw kt.create("idb-open",{originalErrorMessage:n.message})})),zs}async function Qm(n){try{const t=(await $l()).transaction(_r),r=await t.objectStore(_r).get(ql(n));return await t.done,r}catch(e){if(e instanceof je)mt.warn(e.message);else{const t=kt.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});mt.warn(t.message)}}}async function Xc(n,e){try{const r=(await $l()).transaction(_r,"readwrite");await r.objectStore(_r).put(e,ql(n)),await r.done}catch(t){if(t instanceof je)mt.warn(t.message);else{const r=kt.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});mt.warn(r.message)}}}function ql(n){return`${n.name}!${n.options.appId}`}/**
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
 */const Jm=1024,Xm=30;class Ym{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new eg(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,t;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=Yc();if(((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(a=>a.date===s))return;if(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats.length>Xm){const a=tg(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){mt.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=Yc(),{heartbeatsToSend:r,unsentEntries:i}=Zm(this._heartbeatsCache.heartbeats),s=Ti(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=t,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(t){return mt.warn(t),""}}}function Yc(){return new Date().toISOString().substring(0,10)}function Zm(n,e=Jm){const t=[];let r=n.slice();for(const i of n){const s=t.find(a=>a.agent===i.agent);if(s){if(s.dates.push(i.date),Zc(t)>e){s.dates.pop();break}}else if(t.push({agent:i.agent,dates:[i.date]}),Zc(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}class eg{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Vo()?Oo().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await Qm(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const i=await this.read();return Xc(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const i=await this.read();return Xc(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}}function Zc(n){return Ti(JSON.stringify({version:2,heartbeats:n})).length}function tg(n){if(n.length===0)return-1;let e=0,t=n[0].date;for(let r=1;r<n.length;r++)n[r].date<t&&(t=n[r].date,e=r);return e}/**
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
 */function ng(n){ze(new Be("platform-logger",e=>new fm(e),"PRIVATE")),ze(new Be("heartbeat",e=>new Ym(e),"PRIVATE")),Re(no,Qc,n),Re(no,Qc,"esm2017"),Re("fire-js","")}ng("");function zl(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Hl=zl,Gl=new an("auth","Firebase",zl());/**
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
 */const Ei=new Hi("@firebase/auth");function rg(n,...e){Ei.logLevel<=H.WARN&&Ei.warn(`Auth (${cn}): ${n}`,...e)}function li(n,...e){Ei.logLevel<=H.ERROR&&Ei.error(`Auth (${cn}): ${n}`,...e)}/**
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
 */function nt(n,...e){throw Mo(n,...e)}function We(n,...e){return Mo(n,...e)}function Lo(n,e,t){const r=Object.assign(Object.assign({},Hl()),{[e]:t});return new an("auth","Firebase",r).create(e,{appName:n.name})}function Nt(n){return Lo(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Wl(n,e,t){const r=t;if(!(e instanceof r))throw r.name!==e.constructor.name&&nt(n,"argument-error"),Lo(n,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Mo(n,...e){if(typeof n!="string"){const t=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=n.name),n._errorFactory.create(t,...r)}return Gl.create(n,...e)}function F(n,e,...t){if(!n)throw Mo(e,...t)}function ht(n){const e="INTERNAL ASSERTION FAILED: "+n;throw li(e),new Error(e)}function gt(n,e){n||ht(e)}/**
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
 */function so(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.href)||""}function ig(){return eu()==="http:"||eu()==="https:"}function eu(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.protocol)||null}/**
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
 */function sg(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(ig()||Do()||"connection"in navigator)?navigator.onLine:!0}function og(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
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
 */class Cr{constructor(e,t){this.shortDelay=e,this.longDelay=t,gt(t>e,"Short delay should be less than long delay!"),this.isMobile=$p()||Hp()}get(){return sg()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
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
 */function xo(n,e){gt(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
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
 */class Kl{static initialize(e,t,r){this.fetchImpl=e,t&&(this.headersImpl=t),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;ht("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;ht("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;ht("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
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
 */const ag={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
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
 */const cg=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],ug=new Cr(3e4,6e4);function Uo(n,e){return n.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:n.tenantId}):e}async function Nn(n,e,t,r,i={}){return Ql(n,i,async()=>{let s={},a={};r&&(e==="GET"?a=r:s={body:JSON.stringify(r)});const c=Sr(Object.assign({key:n.config.apiKey},a)).slice(1),l=await n._getAdditionalHeaders();l["Content-Type"]="application/json",n.languageCode&&(l["X-Firebase-Locale"]=n.languageCode);const d=Object.assign({method:e,headers:l},s);return zp()||(d.referrerPolicy="no-referrer"),n.emulatorConfig&&Tt(n.emulatorConfig.host)&&(d.credentials="include"),Kl.fetch()(await Jl(n,n.config.apiHost,t,c),d)})}async function Ql(n,e,t){n._canInitEmulator=!1;const r=Object.assign(Object.assign({},ag),e);try{const i=new hg(n),s=await Promise.race([t(),i.promise]);i.clearNetworkTimeout();const a=await s.json();if("needConfirmation"in a)throw ni(n,"account-exists-with-different-credential",a);if(s.ok&&!("errorMessage"in a))return a;{const c=s.ok?a.errorMessage:a.error.message,[l,d]=c.split(" : ");if(l==="FEDERATED_USER_ID_ALREADY_LINKED")throw ni(n,"credential-already-in-use",a);if(l==="EMAIL_EXISTS")throw ni(n,"email-already-in-use",a);if(l==="USER_DISABLED")throw ni(n,"user-disabled",a);const f=r[l]||l.toLowerCase().replace(/[_\s]+/g,"-");if(d)throw Lo(n,f,d);nt(n,f)}}catch(i){if(i instanceof je)throw i;nt(n,"network-request-failed",{message:String(i)})}}async function lg(n,e,t,r,i={}){const s=await Nn(n,e,t,r,i);return"mfaPendingCredential"in s&&nt(n,"multi-factor-auth-required",{_serverResponse:s}),s}async function Jl(n,e,t,r){const i=`${e}${t}?${r}`,s=n,a=s.config.emulator?xo(n.config,i):`${n.config.apiScheme}://${i}`;return cg.includes(t)&&(await s._persistenceManagerAvailable,s._getPersistenceType()==="COOKIE")?s._getPersistence()._getFinalTarget(a).toString():a}class hg{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,r)=>{this.timer=setTimeout(()=>r(We(this.auth,"network-request-failed")),ug.get())})}}function ni(n,e,t){const r={appName:n.name};t.email&&(r.email=t.email),t.phoneNumber&&(r.phoneNumber=t.phoneNumber);const i=We(n,e,r);return i.customData._tokenResponse=t,i}/**
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
 */async function dg(n,e){return Nn(n,"POST","/v1/accounts:delete",e)}async function Ii(n,e){return Nn(n,"POST","/v1/accounts:lookup",e)}/**
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
 */function ur(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Xl(n,e=!1){const t=X(n),r=await t.getIdToken(e),i=Fo(r);F(i&&i.exp&&i.auth_time&&i.iat,t.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,a=s==null?void 0:s.sign_in_provider;return{claims:i,token:r,authTime:ur(Hs(i.auth_time)),issuedAtTime:ur(Hs(i.iat)),expirationTime:ur(Hs(i.exp)),signInProvider:a||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function Hs(n){return Number(n)*1e3}function Fo(n){const[e,t,r]=n.split(".");if(e===void 0||t===void 0||r===void 0)return li("JWT malformed, contained fewer than 3 sections"),null;try{const i=Ml(t);return i?JSON.parse(i):(li("Failed to decode base64 JWT payload"),null)}catch(i){return li("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function tu(n){const e=Fo(n);return F(e,"internal-error"),F(typeof e.exp<"u","internal-error"),F(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
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
 */async function yr(n,e,t=!1){if(t)return e;try{return await e}catch(r){throw r instanceof je&&fg(r)&&n.auth.currentUser===n&&await n.auth.signOut(),r}}function fg({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
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
 */class pg{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const r=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),r}else{this.errorBackoff=3e4;const i=((t=this.user.stsTokenManager.expirationTime)!==null&&t!==void 0?t:0)-Date.now()-3e5;return Math.max(0,i)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
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
 */class oo{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=ur(this.lastLoginAt),this.creationTime=ur(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
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
 */async function wi(n){var e;const t=n.auth,r=await n.getIdToken(),i=await yr(n,Ii(t,{idToken:r}));F(i==null?void 0:i.users.length,t,"internal-error");const s=i.users[0];n._notifyReloadListener(s);const a=!((e=s.providerUserInfo)===null||e===void 0)&&e.length?Zl(s.providerUserInfo):[],c=mg(n.providerData,a),l=n.isAnonymous,d=!(n.email&&s.passwordHash)&&!(c!=null&&c.length),f=l?d:!1,m={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:c,metadata:new oo(s.createdAt,s.lastLoginAt),isAnonymous:f};Object.assign(n,m)}async function Yl(n){const e=X(n);await wi(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function mg(n,e){return[...n.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function Zl(n){return n.map(e=>{var{providerId:t}=e,r=ko(e,["providerId"]);return{providerId:t,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}})}/**
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
 */async function gg(n,e){const t=await Ql(n,{},async()=>{const r=Sr({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=n.config,a=await Jl(n,i,"/v1/token",`key=${s}`),c=await n._getAdditionalHeaders();c["Content-Type"]="application/x-www-form-urlencoded";const l={method:"POST",headers:c,body:r};return n.emulatorConfig&&Tt(n.emulatorConfig.host)&&(l.credentials="include"),Kl.fetch()(a,l)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function _g(n,e){return Nn(n,"POST","/v2/accounts:revokeToken",Uo(n,e))}/**
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
 */class vn{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){F(e.idToken,"internal-error"),F(typeof e.idToken<"u","internal-error"),F(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):tu(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){F(e.length!==0,"internal-error");const t=tu(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(F(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:r,refreshToken:i,expiresIn:s}=await gg(e,t);this.updateTokensAndExpiration(r,i,Number(s))}updateTokensAndExpiration(e,t,r){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,t){const{refreshToken:r,accessToken:i,expirationTime:s}=t,a=new vn;return r&&(F(typeof r=="string","internal-error",{appName:e}),a.refreshToken=r),i&&(F(typeof i=="string","internal-error",{appName:e}),a.accessToken=i),s&&(F(typeof s=="number","internal-error",{appName:e}),a.expirationTime=s),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new vn,this.toJSON())}_performRefresh(){return ht("not implemented")}}/**
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
 */function St(n,e){F(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class Ge{constructor(e){var{uid:t,auth:r,stsTokenManager:i}=e,s=ko(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new pg(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=r,this.stsTokenManager=i,this.accessToken=i.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new oo(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const t=await yr(this,this.stsTokenManager.getToken(this.auth,e));return F(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return Xl(this,e)}reload(){return Yl(this)}_assign(e){this!==e&&(F(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Ge(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){F(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),t&&await wi(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Ne(this.auth.app))return Promise.reject(Nt(this.auth));const e=await this.getIdToken();return await yr(this,dg(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var r,i,s,a,c,l,d,f;const m=(r=t.displayName)!==null&&r!==void 0?r:void 0,_=(i=t.email)!==null&&i!==void 0?i:void 0,R=(s=t.phoneNumber)!==null&&s!==void 0?s:void 0,C=(a=t.photoURL)!==null&&a!==void 0?a:void 0,D=(c=t.tenantId)!==null&&c!==void 0?c:void 0,k=(l=t._redirectEventId)!==null&&l!==void 0?l:void 0,$=(d=t.createdAt)!==null&&d!==void 0?d:void 0,x=(f=t.lastLoginAt)!==null&&f!==void 0?f:void 0,{uid:U,emailVerified:z,isAnonymous:fe,providerData:Z,stsTokenManager:E}=t;F(U&&E,e,"internal-error");const g=vn.fromJSON(this.name,E);F(typeof U=="string",e,"internal-error"),St(m,e.name),St(_,e.name),F(typeof z=="boolean",e,"internal-error"),F(typeof fe=="boolean",e,"internal-error"),St(R,e.name),St(C,e.name),St(D,e.name),St(k,e.name),St($,e.name),St(x,e.name);const v=new Ge({uid:U,auth:e,email:_,emailVerified:z,displayName:m,isAnonymous:fe,photoURL:C,phoneNumber:R,tenantId:D,stsTokenManager:g,createdAt:$,lastLoginAt:x});return Z&&Array.isArray(Z)&&(v.providerData=Z.map(T=>Object.assign({},T))),k&&(v._redirectEventId=k),v}static async _fromIdTokenResponse(e,t,r=!1){const i=new vn;i.updateFromServerResponse(t);const s=new Ge({uid:t.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await wi(s),s}static async _fromGetAccountInfoResponse(e,t,r){const i=t.users[0];F(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?Zl(i.providerUserInfo):[],a=!(i.email&&i.passwordHash)&&!(s!=null&&s.length),c=new vn;c.updateFromIdToken(r);const l=new Ge({uid:i.localId,auth:e,stsTokenManager:c,isAnonymous:a}),d={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new oo(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(s!=null&&s.length)};return Object.assign(l,d),l}}/**
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
 */const nu=new Map;function dt(n){gt(n instanceof Function,"Expected a class definition");let e=nu.get(n);return e?(gt(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,nu.set(n,e),e)}/**
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
 */class eh{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}eh.type="NONE";const ao=eh;/**
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
 */function hi(n,e,t){return`firebase:${n}:${e}:${t}`}class Tn{constructor(e,t,r){this.persistence=e,this.auth=t,this.userKey=r;const{config:i,name:s}=this.auth;this.fullUserKey=hi(this.userKey,i.apiKey,s),this.fullPersistenceKey=hi("persistence",i.apiKey,s),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await Ii(this.auth,{idToken:e}).catch(()=>{});return t?Ge._fromGetAccountInfoResponse(this.auth,t,e):null}return Ge._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,r="authUser"){if(!t.length)return new Tn(dt(ao),e,r);const i=(await Promise.all(t.map(async d=>{if(await d._isAvailable())return d}))).filter(d=>d);let s=i[0]||dt(ao);const a=hi(r,e.config.apiKey,e.name);let c=null;for(const d of t)try{const f=await d._get(a);if(f){let m;if(typeof f=="string"){const _=await Ii(e,{idToken:f}).catch(()=>{});if(!_)break;m=await Ge._fromGetAccountInfoResponse(e,_,f)}else m=Ge._fromJSON(e,f);d!==s&&(c=m),s=d;break}}catch{}const l=i.filter(d=>d._shouldAllowMigration);return!s._shouldAllowMigration||!l.length?new Tn(s,e,r):(s=l[0],c&&await s._set(a,c.toJSON()),await Promise.all(t.map(async d=>{if(d!==s)try{await d._remove(a)}catch{}})),new Tn(s,e,r))}}/**
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
 */function ru(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(ih(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(th(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(oh(e))return"Blackberry";if(ah(e))return"Webos";if(nh(e))return"Safari";if((e.includes("chrome/")||rh(e))&&!e.includes("edge/"))return"Chrome";if(sh(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=n.match(t);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function th(n=be()){return/firefox\//i.test(n)}function nh(n=be()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function rh(n=be()){return/crios\//i.test(n)}function ih(n=be()){return/iemobile/i.test(n)}function sh(n=be()){return/android/i.test(n)}function oh(n=be()){return/blackberry/i.test(n)}function ah(n=be()){return/webos/i.test(n)}function Bo(n=be()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function yg(n=be()){var e;return Bo(n)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function vg(){return Gp()&&document.documentMode===10}function ch(n=be()){return Bo(n)||sh(n)||ah(n)||oh(n)||/windows phone/i.test(n)||ih(n)}/**
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
 */function uh(n,e=[]){let t;switch(n){case"Browser":t=ru(be());break;case"Worker":t=`${ru(be())}-${n}`;break;default:t=n}const r=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${cn}/${r}`}/**
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
 */class Tg{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const r=s=>new Promise((a,c)=>{try{const l=e(s);a(l)}catch(l){c(l)}});r.onAbort=t,this.queue.push(r);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const r of this.queue)await r(e),r.onAbort&&t.push(r.onAbort)}catch(r){t.reverse();for(const i of t)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
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
 */async function Eg(n,e={}){return Nn(n,"GET","/v2/passwordPolicy",Uo(n,e))}/**
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
 */const Ig=6;class wg{constructor(e){var t,r,i,s;const a=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=a.minPasswordLength)!==null&&t!==void 0?t:Ig,a.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=a.maxPasswordLength),a.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=a.containsLowercaseCharacter),a.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=a.containsUppercaseCharacter),a.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=a.containsNumericCharacter),a.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=a.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(i=(r=e.allowedNonAlphanumericCharacters)===null||r===void 0?void 0:r.join(""))!==null&&i!==void 0?i:"",this.forceUpgradeOnSignin=(s=e.forceUpgradeOnSignin)!==null&&s!==void 0?s:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,r,i,s,a,c;const l={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,l),this.validatePasswordCharacterOptions(e,l),l.isValid&&(l.isValid=(t=l.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),l.isValid&&(l.isValid=(r=l.meetsMaxPasswordLength)!==null&&r!==void 0?r:!0),l.isValid&&(l.isValid=(i=l.containsLowercaseLetter)!==null&&i!==void 0?i:!0),l.isValid&&(l.isValid=(s=l.containsUppercaseLetter)!==null&&s!==void 0?s:!0),l.isValid&&(l.isValid=(a=l.containsNumericCharacter)!==null&&a!==void 0?a:!0),l.isValid&&(l.isValid=(c=l.containsNonAlphanumericCharacter)!==null&&c!==void 0?c:!0),l}validatePasswordLengthOptions(e,t){const r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(t.meetsMinPasswordLength=e.length>=r),i&&(t.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(t,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,t,r,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
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
 */class Ag{constructor(e,t,r,i){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new iu(this),this.idTokenSubscription=new iu(this),this.beforeStateQueue=new Tg(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Gl,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion,this._persistenceManagerAvailable=new Promise(s=>this._resolvePersistenceManagerAvailable=s)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=dt(t)),this._initializationPromise=this.queue(async()=>{var r,i,s;if(!this._deleted&&(this.persistenceManager=await Tn.create(this,e),(r=this._resolvePersistenceManagerAvailable)===null||r===void 0||r.call(this),!this._deleted)){if(!((i=this._popupRedirectResolver)===null||i===void 0)&&i._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((s=this.currentUser)===null||s===void 0?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await Ii(this,{idToken:e}),r=await Ge._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(r)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(Ne(this.app)){const a=this.app.settings.authIdToken;return a?new Promise(c=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(a).then(c,c))}):this.directlySetCurrentUser(null)}const r=await this.assertedPersistence.getCurrentUser();let i=r,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const a=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,c=i==null?void 0:i._redirectEventId,l=await this.tryRedirectSignIn(e);(!a||a===c)&&(l!=null&&l.user)&&(i=l.user,s=!0)}if(!i)return this.directlySetCurrentUser(null);if(!i._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(i)}catch(a){i=r,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(a))}return i?this.reloadAndSetCurrentUserOrClear(i):this.directlySetCurrentUser(null)}return F(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===i._redirectEventId?this.directlySetCurrentUser(i):this.reloadAndSetCurrentUserOrClear(i)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await wi(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=og()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Ne(this.app))return Promise.reject(Nt(this));const t=e?X(e):null;return t&&F(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&F(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Ne(this.app)?Promise.reject(Nt(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Ne(this.app)?Promise.reject(Nt(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(dt(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await Eg(this),t=new wg(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new an("auth","Firebase",e())}onAuthStateChanged(e,t,r){return this.registerStateListener(this.authStateSubscription,e,t,r)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,r){return this.registerStateListener(this.idTokenSubscription,e,t,r)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(r.tenantId=this.tenantId),await _g(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const r=await this.getOrInitRedirectPersistenceManager(t);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&dt(e)||this._popupRedirectResolver;F(t,this,"argument-error"),this.redirectPersistenceManager=await Tn.create(this,[dt(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,r;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const r=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==r&&(this.lastNotifiedUid=r,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,r,i){if(this._deleted)return()=>{};const s=typeof t=="function"?t:t.next.bind(t);let a=!1;const c=this._isInitialized?Promise.resolve():this._initializationPromise;if(F(c,this,"internal-error"),c.then(()=>{a||s(this.currentUser)}),typeof t=="function"){const l=e.addObserver(t,r,i);return()=>{a=!0,l()}}else{const l=e.addObserver(t);return()=>{a=!0,l()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return F(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=uh(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const r=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());r&&(t["X-Firebase-Client"]=r);const i=await this._getAppCheckToken();return i&&(t["X-Firebase-AppCheck"]=i),t}async _getAppCheckToken(){var e;if(Ne(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t!=null&&t.error&&rg(`Error while retrieving App Check token: ${t.error}`),t==null?void 0:t.token}}function Dn(n){return X(n)}class iu{constructor(e){this.auth=e,this.observer=null,this.addObserver=Yp(t=>this.observer=t)}get next(){return F(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
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
 */let jo={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Rg(n){jo=n}function bg(n){return jo.loadJS(n)}function Sg(){return jo.gapiScript}function Pg(n){return`__${n}${Math.floor(Math.random()*1e6)}`}/**
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
 */function lh(n,e){const t=Et(n,"auth");if(t.isInitialized()){const i=t.getImmediate(),s=t.getOptions();if(pt(s,e??{}))return i;nt(i,"already-initialized")}return t.initialize({options:e})}function Cg(n,e){const t=(e==null?void 0:e.persistence)||[],r=(Array.isArray(t)?t:[t]).map(dt);e!=null&&e.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function hh(n,e,t){const r=Dn(n);F(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const i=!1,s=dh(e),{host:a,port:c}=kg(e),l=c===null?"":`:${c}`,d={url:`${s}//${a}${l}/`},f=Object.freeze({host:a,port:c,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})});if(!r._canInitEmulator){F(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),F(pt(d,r.config.emulator)&&pt(f,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=d,r.emulatorConfig=f,r.settings.appVerificationDisabledForTesting=!0,Tt(a)?(qi(`${s}//${a}${l}`),zi("Auth",!0)):Ng()}function dh(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function kg(n){const e=dh(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const r=t[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const s=i[1];return{host:s,port:su(r.substr(s.length+1))}}else{const[s,a]=r.split(":");return{host:s,port:su(a)}}}function su(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function Ng(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
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
 */class $o{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return ht("not implemented")}_getIdTokenResponse(e){return ht("not implemented")}_linkToIdToken(e,t){return ht("not implemented")}_getReauthenticationResolver(e){return ht("not implemented")}}/**
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
 */async function En(n,e){return lg(n,"POST","/v1/accounts:signInWithIdp",Uo(n,e))}/**
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
 */const Dg="http://localhost";class Ot extends $o{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new Ot(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):nt("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i}=t,s=ko(t,["providerId","signInMethod"]);if(!r||!i)return null;const a=new Ot(r,i);return a.idToken=s.idToken||void 0,a.accessToken=s.accessToken||void 0,a.secret=s.secret,a.nonce=s.nonce,a.pendingToken=s.pendingToken||null,a}_getIdTokenResponse(e){const t=this.buildRequest();return En(e,t)}_linkToIdToken(e,t){const r=this.buildRequest();return r.idToken=t,En(e,r)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,En(e,t)}buildRequest(){const e={requestUri:Dg,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=Sr(t)}return e}}/**
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
 */class Gi{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
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
 */class kr extends Gi{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
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
 */class at extends kr{constructor(){super("facebook.com")}static credential(e){return Ot._fromParams({providerId:at.PROVIDER_ID,signInMethod:at.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return at.credentialFromTaggedObject(e)}static credentialFromError(e){return at.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return at.credential(e.oauthAccessToken)}catch{return null}}}at.FACEBOOK_SIGN_IN_METHOD="facebook.com";at.PROVIDER_ID="facebook.com";/**
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
 */class ct extends kr{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return Ot._fromParams({providerId:ct.PROVIDER_ID,signInMethod:ct.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return ct.credentialFromTaggedObject(e)}static credentialFromError(e){return ct.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:r}=e;if(!t&&!r)return null;try{return ct.credential(t,r)}catch{return null}}}ct.GOOGLE_SIGN_IN_METHOD="google.com";ct.PROVIDER_ID="google.com";/**
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
 */class ut extends kr{constructor(){super("github.com")}static credential(e){return Ot._fromParams({providerId:ut.PROVIDER_ID,signInMethod:ut.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return ut.credentialFromTaggedObject(e)}static credentialFromError(e){return ut.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return ut.credential(e.oauthAccessToken)}catch{return null}}}ut.GITHUB_SIGN_IN_METHOD="github.com";ut.PROVIDER_ID="github.com";/**
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
 */class lt extends kr{constructor(){super("twitter.com")}static credential(e,t){return Ot._fromParams({providerId:lt.PROVIDER_ID,signInMethod:lt.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return lt.credentialFromTaggedObject(e)}static credentialFromError(e){return lt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:r}=e;if(!t||!r)return null;try{return lt.credential(t,r)}catch{return null}}}lt.TWITTER_SIGN_IN_METHOD="twitter.com";lt.PROVIDER_ID="twitter.com";/**
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
 */class wn{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,r,i=!1){const s=await Ge._fromIdTokenResponse(e,r,i),a=ou(r);return new wn({user:s,providerId:a,_tokenResponse:r,operationType:t})}static async _forOperation(e,t,r){await e._updateTokensIfNecessary(r,!0);const i=ou(r);return new wn({user:e,providerId:i,_tokenResponse:r,operationType:t})}}function ou(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
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
 */class Ai extends je{constructor(e,t,r,i){var s;super(t.code,t.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,Ai.prototype),this.customData={appName:e.name,tenantId:(s=e.tenantId)!==null&&s!==void 0?s:void 0,_serverResponse:t.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,t,r,i){return new Ai(e,t,r,i)}}function fh(n,e,t,r){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?Ai._fromErrorAndOperation(n,s,e,r):s})}async function Vg(n,e,t=!1){const r=await yr(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return wn._forOperation(n,"link",r)}/**
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
 */async function Og(n,e,t=!1){const{auth:r}=n;if(Ne(r.app))return Promise.reject(Nt(r));const i="reauthenticate";try{const s=await yr(n,fh(r,i,e,n),t);F(s.idToken,r,"internal-error");const a=Fo(s.idToken);F(a,r,"internal-error");const{sub:c}=a;return F(n.uid===c,r,"user-mismatch"),wn._forOperation(n,i,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&nt(r,"user-mismatch"),s}}/**
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
 */async function Lg(n,e,t=!1){if(Ne(n.app))return Promise.reject(Nt(n));const r="signIn",i=await fh(n,r,e),s=await wn._fromIdTokenResponse(n,r,i);return t||await n._updateCurrentUser(s.user),s}function ph(n,e,t,r){return X(n).onIdTokenChanged(e,t,r)}function mh(n,e,t){return X(n).beforeAuthStateChanged(e,t)}function Mg(n,e,t,r){return X(n).onAuthStateChanged(e,t,r)}function xg(n){return X(n).signOut()}const Ri="__sak";/**
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
 */class gh{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Ri,"1"),this.storage.removeItem(Ri),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
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
 */const Ug=1e3,Fg=10;class _h extends gh{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=ch(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const r=this.storage.getItem(t),i=this.localCache[t];r!==i&&e(t,i,r)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((a,c,l)=>{this.notifyListeners(a,l)});return}const r=e.key;t?this.detachListener():this.stopPolling();const i=()=>{const a=this.storage.getItem(r);!t&&this.localCache[r]===a||this.notifyListeners(r,a)},s=this.storage.getItem(r);vg()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,Fg):i()}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:r}),!0)})},Ug)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}_h.type="LOCAL";const yh=_h;/**
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
 */class vh extends gh{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}vh.type="SESSION";const qo=vh;/**
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
 */function Bg(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
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
 */class Wi{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(i=>i.isListeningto(e));if(t)return t;const r=new Wi(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:r,eventType:i,data:s}=t.data,a=this.handlersMap[i];if(!(a!=null&&a.size))return;t.ports[0].postMessage({status:"ack",eventId:r,eventType:i});const c=Array.from(a).map(async d=>d(t.origin,s)),l=await Bg(c);t.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:l})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Wi.receivers=[];/**
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
 */function zo(n="",e=10){let t="";for(let r=0;r<e;r++)t+=Math.floor(Math.random()*10);return n+t}/**
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
 */class jg{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,r=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,a;return new Promise((c,l)=>{const d=zo("",20);i.port1.start();const f=setTimeout(()=>{l(new Error("unsupported_event"))},r);a={messageChannel:i,onMessage(m){const _=m;if(_.data.eventId===d)switch(_.data.status){case"ack":clearTimeout(f),s=setTimeout(()=>{l(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),c(_.data.response);break;default:clearTimeout(f),clearTimeout(s),l(new Error("invalid_response"));break}}},this.handlers.add(a),i.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:d,data:t},[i.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
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
 */function Xe(){return window}function $g(n){Xe().location.href=n}/**
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
 */function Th(){return typeof Xe().WorkerGlobalScope<"u"&&typeof Xe().importScripts=="function"}async function qg(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function zg(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)===null||n===void 0?void 0:n.controller)||null}function Hg(){return Th()?self:null}/**
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
 */const Eh="firebaseLocalStorageDb",Gg=1,bi="firebaseLocalStorage",Ih="fbase_key";class Nr{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function Ki(n,e){return n.transaction([bi],e?"readwrite":"readonly").objectStore(bi)}function Wg(){const n=indexedDB.deleteDatabase(Eh);return new Nr(n).toPromise()}function co(){const n=indexedDB.open(Eh,Gg);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const r=n.result;try{r.createObjectStore(bi,{keyPath:Ih})}catch(i){t(i)}}),n.addEventListener("success",async()=>{const r=n.result;r.objectStoreNames.contains(bi)?e(r):(r.close(),await Wg(),e(await co()))})})}async function au(n,e,t){const r=Ki(n,!0).put({[Ih]:e,value:t});return new Nr(r).toPromise()}async function Kg(n,e){const t=Ki(n,!1).get(e),r=await new Nr(t).toPromise();return r===void 0?null:r.value}function cu(n,e){const t=Ki(n,!0).delete(e);return new Nr(t).toPromise()}const Qg=800,Jg=3;class wh{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await co(),this.db)}async _withRetries(e){let t=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(t++>Jg)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Th()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Wi._getInstance(Hg()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await qg(),!this.activeServiceWorker)return;this.sender=new jg(this.activeServiceWorker);const r=await this.sender._send("ping",{},800);r&&!((e=r[0])===null||e===void 0)&&e.fulfilled&&!((t=r[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||zg()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await co();return await au(e,Ri,"1"),await cu(e,Ri),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(r=>au(r,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(r=>Kg(r,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>cu(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(i=>{const s=Ki(i,!1).getAll();return new Nr(s).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],r=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),t.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),t.push(i));return t}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),Qg)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}wh.type="LOCAL";const Ah=wh;new Cr(3e4,6e4);/**
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
 */function Ho(n,e){return e?dt(e):(F(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
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
 */class Go extends $o{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return En(e,this._buildIdpRequest())}_linkToIdToken(e,t){return En(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return En(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function Xg(n){return Lg(n.auth,new Go(n),n.bypassAuthState)}function Yg(n){const{auth:e,user:t}=n;return F(t,e,"internal-error"),Og(t,new Go(n),n.bypassAuthState)}async function Zg(n){const{auth:e,user:t}=n;return F(t,e,"internal-error"),Vg(t,new Go(n),n.bypassAuthState)}/**
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
 */class Rh{constructor(e,t,r,i,s=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:r,postBody:i,tenantId:s,error:a,type:c}=e;if(a){this.reject(a);return}const l={auth:this.auth,requestUri:t,sessionId:r,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(c)(l))}catch(d){this.reject(d)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Xg;case"linkViaPopup":case"linkViaRedirect":return Zg;case"reauthViaPopup":case"reauthViaRedirect":return Yg;default:nt(this.auth,"internal-error")}}resolve(e){gt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){gt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
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
 */const e_=new Cr(2e3,1e4);async function t_(n,e,t){if(Ne(n.app))return Promise.reject(We(n,"operation-not-supported-in-this-environment"));const r=Dn(n);Wl(n,e,Gi);const i=Ho(r,t);return new Qt(r,"signInViaPopup",e,i).executeNotNull()}class Qt extends Rh{constructor(e,t,r,i,s){super(e,t,i,s),this.provider=r,this.authWindow=null,this.pollId=null,Qt.currentPopupAction&&Qt.currentPopupAction.cancel(),Qt.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return F(e,this.auth,"internal-error"),e}async onExecution(){gt(this.filter.length===1,"Popup operations only handle one event");const e=zo();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(We(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(We(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Qt.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,r;if(!((r=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||r===void 0)&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(We(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,e_.get())};e()}}Qt.currentPopupAction=null;/**
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
 */const n_="pendingRedirect",di=new Map;class r_ extends Rh{constructor(e,t,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,r),this.eventId=null}async execute(){let e=di.get(this.auth._key());if(!e){try{const r=await i_(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(t){e=()=>Promise.reject(t)}di.set(this.auth._key(),e)}return this.bypassAuthState||di.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function i_(n,e){const t=Sh(e),r=bh(n);if(!await r._isAvailable())return!1;const i=await r._get(t)==="true";return await r._remove(t),i}async function s_(n,e){return bh(n)._set(Sh(e),"true")}function o_(n,e){di.set(n._key(),e)}function bh(n){return dt(n._redirectPersistence)}function Sh(n){return hi(n_,n.config.apiKey,n.name)}/**
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
 */function a_(n,e,t){return c_(n,e,t)}async function c_(n,e,t){if(Ne(n.app))return Promise.reject(Nt(n));const r=Dn(n);Wl(n,e,Gi),await r._initializationPromise;const i=Ho(r,t);return await s_(i,r),i._openRedirect(r,e,"signInViaRedirect")}async function u_(n,e){return await Dn(n)._initializationPromise,Ph(n,e,!1)}async function Ph(n,e,t=!1){if(Ne(n.app))return Promise.reject(Nt(n));const r=Dn(n),i=Ho(r,e),a=await new r_(r,i,t).execute();return a&&!t&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,e)),a}/**
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
 */const l_=10*60*1e3;class h_{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(t=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!d_(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var r;if(e.error&&!Ch(e)){const i=((r=e.error.code)===null||r===void 0?void 0:r.split("auth/")[1])||"internal-error";t.onError(We(this.auth,i))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const r=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=l_&&this.cachedEventUids.clear(),this.cachedEventUids.has(uu(e))}saveEventToCache(e){this.cachedEventUids.add(uu(e)),this.lastProcessedEventTime=Date.now()}}function uu(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function Ch({type:n,error:e}){return n==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function d_(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Ch(n);default:return!1}}/**
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
 */async function f_(n,e={}){return Nn(n,"GET","/v1/projects",e)}/**
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
 */const p_=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,m_=/^https?/;async function g_(n){if(n.config.emulator)return;const{authorizedDomains:e}=await f_(n);for(const t of e)try{if(__(t))return}catch{}nt(n,"unauthorized-domain")}function __(n){const e=so(),{protocol:t,hostname:r}=new URL(e);if(n.startsWith("chrome-extension://")){const a=new URL(n);return a.hostname===""&&r===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&a.hostname===r}if(!m_.test(t))return!1;if(p_.test(n))return r===n;const i=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}/**
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
 */const y_=new Cr(3e4,6e4);function lu(){const n=Xe().___jsl;if(n!=null&&n.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function v_(n){return new Promise((e,t)=>{var r,i,s;function a(){lu(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{lu(),t(We(n,"network-request-failed"))},timeout:y_.get()})}if(!((i=(r=Xe().gapi)===null||r===void 0?void 0:r.iframes)===null||i===void 0)&&i.Iframe)e(gapi.iframes.getContext());else if(!((s=Xe().gapi)===null||s===void 0)&&s.load)a();else{const c=Pg("iframefcb");return Xe()[c]=()=>{gapi.load?a():t(We(n,"network-request-failed"))},bg(`${Sg()}?onload=${c}`).catch(l=>t(l))}}).catch(e=>{throw fi=null,e})}let fi=null;function T_(n){return fi=fi||v_(n),fi}/**
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
 */const E_=new Cr(5e3,15e3),I_="__/auth/iframe",w_="emulator/auth/iframe",A_={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},R_=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function b_(n){const e=n.config;F(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?xo(e,w_):`https://${n.config.authDomain}/${I_}`,r={apiKey:e.apiKey,appName:n.name,v:cn},i=R_.get(n.config.apiHost);i&&(r.eid=i);const s=n._getFrameworks();return s.length&&(r.fw=s.join(",")),`${t}?${Sr(r).slice(1)}`}async function S_(n){const e=await T_(n),t=Xe().gapi;return F(t,n,"internal-error"),e.open({where:document.body,url:b_(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:A_,dontclear:!0},r=>new Promise(async(i,s)=>{await r.restyle({setHideOnLeave:!1});const a=We(n,"network-request-failed"),c=Xe().setTimeout(()=>{s(a)},E_.get());function l(){Xe().clearTimeout(c),i(r)}r.ping(l).then(l,()=>{s(a)})}))}/**
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
 */const P_={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},C_=500,k_=600,N_="_blank",D_="http://localhost";class hu{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function V_(n,e,t,r=C_,i=k_){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString();let c="";const l=Object.assign(Object.assign({},P_),{width:r.toString(),height:i.toString(),top:s,left:a}),d=be().toLowerCase();t&&(c=rh(d)?N_:t),th(d)&&(e=e||D_,l.scrollbars="yes");const f=Object.entries(l).reduce((_,[R,C])=>`${_}${R}=${C},`,"");if(yg(d)&&c!=="_self")return O_(e||"",c),new hu(null);const m=window.open(e||"",c,f);F(m,n,"popup-blocked");try{m.focus()}catch{}return new hu(m)}function O_(n,e){const t=document.createElement("a");t.href=n,t.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(r)}/**
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
 */const L_="__/auth/handler",M_="emulator/auth/handler",x_=encodeURIComponent("fac");async function du(n,e,t,r,i,s){F(n.config.authDomain,n,"auth-domain-config-required"),F(n.config.apiKey,n,"invalid-api-key");const a={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:r,v:cn,eventId:i};if(e instanceof Gi){e.setDefaultLanguage(n.languageCode),a.providerId=e.providerId||"",Xp(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[f,m]of Object.entries({}))a[f]=m}if(e instanceof kr){const f=e.getScopes().filter(m=>m!=="");f.length>0&&(a.scopes=f.join(","))}n.tenantId&&(a.tid=n.tenantId);const c=a;for(const f of Object.keys(c))c[f]===void 0&&delete c[f];const l=await n._getAppCheckToken(),d=l?`#${x_}=${encodeURIComponent(l)}`:"";return`${U_(n)}?${Sr(c).slice(1)}${d}`}function U_({config:n}){return n.emulator?xo(n,M_):`https://${n.authDomain}/${L_}`}/**
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
 */const Gs="webStorageSupport";class F_{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=qo,this._completeRedirectFn=Ph,this._overrideRedirectResult=o_}async _openPopup(e,t,r,i){var s;gt((s=this.eventManagers[e._key()])===null||s===void 0?void 0:s.manager,"_initialize() not called before _openPopup()");const a=await du(e,t,r,so(),i);return V_(e,a,zo())}async _openRedirect(e,t,r,i){await this._originValidation(e);const s=await du(e,t,r,so(),i);return $g(s),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:i,promise:s}=this.eventManagers[t];return i?Promise.resolve(i):(gt(s,"If manager is not set, promise should be"),s)}const r=this.initAndGetManager(e);return this.eventManagers[t]={promise:r},r.catch(()=>{delete this.eventManagers[t]}),r}async initAndGetManager(e){const t=await S_(e),r=new h_(e);return t.register("authEvent",i=>(F(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=t,r}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Gs,{type:Gs},i=>{var s;const a=(s=i==null?void 0:i[0])===null||s===void 0?void 0:s[Gs];a!==void 0&&t(!!a),nt(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=g_(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return ch()||nh()||Bo()}}const kh=F_;var fu="@firebase/auth",pu="1.10.8";/**
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
 */class B_{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){F(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
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
 */function j_(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function $_(n){ze(new Be("auth",(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:a,authDomain:c}=r.options;F(a&&!a.includes(":"),"invalid-api-key",{appName:r.name});const l={apiKey:a,authDomain:c,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:uh(n)},d=new Ag(r,i,s,l);return Cg(d,t),d},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{e.getProvider("auth-internal").initialize()})),ze(new Be("auth-internal",e=>{const t=Dn(e.getProvider("auth").getImmediate());return(r=>new B_(r))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),Re(fu,pu,j_(n)),Re(fu,pu,"esm2017")}/**
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
 */const q_=5*60,z_=Fl("authIdTokenMaxAge")||q_;let mu=null;const H_=n=>async e=>{const t=e&&await e.getIdTokenResult(),r=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(r&&r>z_)return;const i=t==null?void 0:t.token;mu!==i&&(mu=i,await fetch(n,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function G_(n=Pr()){const e=Et(n,"auth");if(e.isInitialized())return e.getImmediate();const t=lh(n,{popupRedirectResolver:kh,persistence:[Ah,yh,qo]}),r=Fl("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(r,location.origin);if(location.origin===s.origin){const a=H_(s.toString());mh(t,a,()=>a(t.currentUser)),ph(t,c=>a(c))}}const i=xl("auth");return i&&hh(t,`http://${i}`),t}function W_(){var n,e;return(e=(n=document.getElementsByTagName("head"))===null||n===void 0?void 0:n[0])!==null&&e!==void 0?e:document}Rg({loadJS(n){return new Promise((e,t)=>{const r=document.createElement("script");r.setAttribute("src",n),r.onload=e,r.onerror=i=>{const s=We("internal-error");s.customData=i,t(s)},r.type="text/javascript",r.charset="UTF-8",W_().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});$_("Browser");const Yw=Object.freeze(Object.defineProperty({__proto__:null,AuthCredential:$o,FacebookAuthProvider:at,GithubAuthProvider:ut,GoogleAuthProvider:ct,OAuthCredential:Ot,TwitterAuthProvider:lt,beforeAuthStateChanged:mh,browserLocalPersistence:yh,browserPopupRedirectResolver:kh,browserSessionPersistence:qo,connectAuthEmulator:hh,getAuth:G_,getIdTokenResult:Xl,getRedirectResult:u_,inMemoryPersistence:ao,indexedDBLocalPersistence:Ah,initializeAuth:lh,onAuthStateChanged:Mg,onIdTokenChanged:ph,prodErrorMap:Hl,reload:Yl,signInWithPopup:t_,signInWithRedirect:a_,signOut:xg},Symbol.toStringTag,{value:"Module"}));var K_="firebase",Q_="11.10.0";/**
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
 */Re(K_,Q_,"app");var gu=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Dt,Nh;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(E,g){function v(){}v.prototype=g.prototype,E.D=g.prototype,E.prototype=new v,E.prototype.constructor=E,E.C=function(T,I,A){for(var y=Array(arguments.length-2),it=2;it<arguments.length;it++)y[it-2]=arguments[it];return g.prototype[I].apply(T,y)}}function t(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(r,t),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function i(E,g,v){v||(v=0);var T=Array(16);if(typeof g=="string")for(var I=0;16>I;++I)T[I]=g.charCodeAt(v++)|g.charCodeAt(v++)<<8|g.charCodeAt(v++)<<16|g.charCodeAt(v++)<<24;else for(I=0;16>I;++I)T[I]=g[v++]|g[v++]<<8|g[v++]<<16|g[v++]<<24;g=E.g[0],v=E.g[1],I=E.g[2];var A=E.g[3],y=g+(A^v&(I^A))+T[0]+3614090360&4294967295;g=v+(y<<7&4294967295|y>>>25),y=A+(I^g&(v^I))+T[1]+3905402710&4294967295,A=g+(y<<12&4294967295|y>>>20),y=I+(v^A&(g^v))+T[2]+606105819&4294967295,I=A+(y<<17&4294967295|y>>>15),y=v+(g^I&(A^g))+T[3]+3250441966&4294967295,v=I+(y<<22&4294967295|y>>>10),y=g+(A^v&(I^A))+T[4]+4118548399&4294967295,g=v+(y<<7&4294967295|y>>>25),y=A+(I^g&(v^I))+T[5]+1200080426&4294967295,A=g+(y<<12&4294967295|y>>>20),y=I+(v^A&(g^v))+T[6]+2821735955&4294967295,I=A+(y<<17&4294967295|y>>>15),y=v+(g^I&(A^g))+T[7]+4249261313&4294967295,v=I+(y<<22&4294967295|y>>>10),y=g+(A^v&(I^A))+T[8]+1770035416&4294967295,g=v+(y<<7&4294967295|y>>>25),y=A+(I^g&(v^I))+T[9]+2336552879&4294967295,A=g+(y<<12&4294967295|y>>>20),y=I+(v^A&(g^v))+T[10]+4294925233&4294967295,I=A+(y<<17&4294967295|y>>>15),y=v+(g^I&(A^g))+T[11]+2304563134&4294967295,v=I+(y<<22&4294967295|y>>>10),y=g+(A^v&(I^A))+T[12]+1804603682&4294967295,g=v+(y<<7&4294967295|y>>>25),y=A+(I^g&(v^I))+T[13]+4254626195&4294967295,A=g+(y<<12&4294967295|y>>>20),y=I+(v^A&(g^v))+T[14]+2792965006&4294967295,I=A+(y<<17&4294967295|y>>>15),y=v+(g^I&(A^g))+T[15]+1236535329&4294967295,v=I+(y<<22&4294967295|y>>>10),y=g+(I^A&(v^I))+T[1]+4129170786&4294967295,g=v+(y<<5&4294967295|y>>>27),y=A+(v^I&(g^v))+T[6]+3225465664&4294967295,A=g+(y<<9&4294967295|y>>>23),y=I+(g^v&(A^g))+T[11]+643717713&4294967295,I=A+(y<<14&4294967295|y>>>18),y=v+(A^g&(I^A))+T[0]+3921069994&4294967295,v=I+(y<<20&4294967295|y>>>12),y=g+(I^A&(v^I))+T[5]+3593408605&4294967295,g=v+(y<<5&4294967295|y>>>27),y=A+(v^I&(g^v))+T[10]+38016083&4294967295,A=g+(y<<9&4294967295|y>>>23),y=I+(g^v&(A^g))+T[15]+3634488961&4294967295,I=A+(y<<14&4294967295|y>>>18),y=v+(A^g&(I^A))+T[4]+3889429448&4294967295,v=I+(y<<20&4294967295|y>>>12),y=g+(I^A&(v^I))+T[9]+568446438&4294967295,g=v+(y<<5&4294967295|y>>>27),y=A+(v^I&(g^v))+T[14]+3275163606&4294967295,A=g+(y<<9&4294967295|y>>>23),y=I+(g^v&(A^g))+T[3]+4107603335&4294967295,I=A+(y<<14&4294967295|y>>>18),y=v+(A^g&(I^A))+T[8]+1163531501&4294967295,v=I+(y<<20&4294967295|y>>>12),y=g+(I^A&(v^I))+T[13]+2850285829&4294967295,g=v+(y<<5&4294967295|y>>>27),y=A+(v^I&(g^v))+T[2]+4243563512&4294967295,A=g+(y<<9&4294967295|y>>>23),y=I+(g^v&(A^g))+T[7]+1735328473&4294967295,I=A+(y<<14&4294967295|y>>>18),y=v+(A^g&(I^A))+T[12]+2368359562&4294967295,v=I+(y<<20&4294967295|y>>>12),y=g+(v^I^A)+T[5]+4294588738&4294967295,g=v+(y<<4&4294967295|y>>>28),y=A+(g^v^I)+T[8]+2272392833&4294967295,A=g+(y<<11&4294967295|y>>>21),y=I+(A^g^v)+T[11]+1839030562&4294967295,I=A+(y<<16&4294967295|y>>>16),y=v+(I^A^g)+T[14]+4259657740&4294967295,v=I+(y<<23&4294967295|y>>>9),y=g+(v^I^A)+T[1]+2763975236&4294967295,g=v+(y<<4&4294967295|y>>>28),y=A+(g^v^I)+T[4]+1272893353&4294967295,A=g+(y<<11&4294967295|y>>>21),y=I+(A^g^v)+T[7]+4139469664&4294967295,I=A+(y<<16&4294967295|y>>>16),y=v+(I^A^g)+T[10]+3200236656&4294967295,v=I+(y<<23&4294967295|y>>>9),y=g+(v^I^A)+T[13]+681279174&4294967295,g=v+(y<<4&4294967295|y>>>28),y=A+(g^v^I)+T[0]+3936430074&4294967295,A=g+(y<<11&4294967295|y>>>21),y=I+(A^g^v)+T[3]+3572445317&4294967295,I=A+(y<<16&4294967295|y>>>16),y=v+(I^A^g)+T[6]+76029189&4294967295,v=I+(y<<23&4294967295|y>>>9),y=g+(v^I^A)+T[9]+3654602809&4294967295,g=v+(y<<4&4294967295|y>>>28),y=A+(g^v^I)+T[12]+3873151461&4294967295,A=g+(y<<11&4294967295|y>>>21),y=I+(A^g^v)+T[15]+530742520&4294967295,I=A+(y<<16&4294967295|y>>>16),y=v+(I^A^g)+T[2]+3299628645&4294967295,v=I+(y<<23&4294967295|y>>>9),y=g+(I^(v|~A))+T[0]+4096336452&4294967295,g=v+(y<<6&4294967295|y>>>26),y=A+(v^(g|~I))+T[7]+1126891415&4294967295,A=g+(y<<10&4294967295|y>>>22),y=I+(g^(A|~v))+T[14]+2878612391&4294967295,I=A+(y<<15&4294967295|y>>>17),y=v+(A^(I|~g))+T[5]+4237533241&4294967295,v=I+(y<<21&4294967295|y>>>11),y=g+(I^(v|~A))+T[12]+1700485571&4294967295,g=v+(y<<6&4294967295|y>>>26),y=A+(v^(g|~I))+T[3]+2399980690&4294967295,A=g+(y<<10&4294967295|y>>>22),y=I+(g^(A|~v))+T[10]+4293915773&4294967295,I=A+(y<<15&4294967295|y>>>17),y=v+(A^(I|~g))+T[1]+2240044497&4294967295,v=I+(y<<21&4294967295|y>>>11),y=g+(I^(v|~A))+T[8]+1873313359&4294967295,g=v+(y<<6&4294967295|y>>>26),y=A+(v^(g|~I))+T[15]+4264355552&4294967295,A=g+(y<<10&4294967295|y>>>22),y=I+(g^(A|~v))+T[6]+2734768916&4294967295,I=A+(y<<15&4294967295|y>>>17),y=v+(A^(I|~g))+T[13]+1309151649&4294967295,v=I+(y<<21&4294967295|y>>>11),y=g+(I^(v|~A))+T[4]+4149444226&4294967295,g=v+(y<<6&4294967295|y>>>26),y=A+(v^(g|~I))+T[11]+3174756917&4294967295,A=g+(y<<10&4294967295|y>>>22),y=I+(g^(A|~v))+T[2]+718787259&4294967295,I=A+(y<<15&4294967295|y>>>17),y=v+(A^(I|~g))+T[9]+3951481745&4294967295,E.g[0]=E.g[0]+g&4294967295,E.g[1]=E.g[1]+(I+(y<<21&4294967295|y>>>11))&4294967295,E.g[2]=E.g[2]+I&4294967295,E.g[3]=E.g[3]+A&4294967295}r.prototype.u=function(E,g){g===void 0&&(g=E.length);for(var v=g-this.blockSize,T=this.B,I=this.h,A=0;A<g;){if(I==0)for(;A<=v;)i(this,E,A),A+=this.blockSize;if(typeof E=="string"){for(;A<g;)if(T[I++]=E.charCodeAt(A++),I==this.blockSize){i(this,T),I=0;break}}else for(;A<g;)if(T[I++]=E[A++],I==this.blockSize){i(this,T),I=0;break}}this.h=I,this.o+=g},r.prototype.v=function(){var E=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);E[0]=128;for(var g=1;g<E.length-8;++g)E[g]=0;var v=8*this.o;for(g=E.length-8;g<E.length;++g)E[g]=v&255,v/=256;for(this.u(E),E=Array(16),g=v=0;4>g;++g)for(var T=0;32>T;T+=8)E[v++]=this.g[g]>>>T&255;return E};function s(E,g){var v=c;return Object.prototype.hasOwnProperty.call(v,E)?v[E]:v[E]=g(E)}function a(E,g){this.h=g;for(var v=[],T=!0,I=E.length-1;0<=I;I--){var A=E[I]|0;T&&A==g||(v[I]=A,T=!1)}this.g=v}var c={};function l(E){return-128<=E&&128>E?s(E,function(g){return new a([g|0],0>g?-1:0)}):new a([E|0],0>E?-1:0)}function d(E){if(isNaN(E)||!isFinite(E))return m;if(0>E)return k(d(-E));for(var g=[],v=1,T=0;E>=v;T++)g[T]=E/v|0,v*=4294967296;return new a(g,0)}function f(E,g){if(E.length==0)throw Error("number format error: empty string");if(g=g||10,2>g||36<g)throw Error("radix out of range: "+g);if(E.charAt(0)=="-")return k(f(E.substring(1),g));if(0<=E.indexOf("-"))throw Error('number format error: interior "-" character');for(var v=d(Math.pow(g,8)),T=m,I=0;I<E.length;I+=8){var A=Math.min(8,E.length-I),y=parseInt(E.substring(I,I+A),g);8>A?(A=d(Math.pow(g,A)),T=T.j(A).add(d(y))):(T=T.j(v),T=T.add(d(y)))}return T}var m=l(0),_=l(1),R=l(16777216);n=a.prototype,n.m=function(){if(D(this))return-k(this).m();for(var E=0,g=1,v=0;v<this.g.length;v++){var T=this.i(v);E+=(0<=T?T:4294967296+T)*g,g*=4294967296}return E},n.toString=function(E){if(E=E||10,2>E||36<E)throw Error("radix out of range: "+E);if(C(this))return"0";if(D(this))return"-"+k(this).toString(E);for(var g=d(Math.pow(E,6)),v=this,T="";;){var I=z(v,g).g;v=$(v,I.j(g));var A=((0<v.g.length?v.g[0]:v.h)>>>0).toString(E);if(v=I,C(v))return A+T;for(;6>A.length;)A="0"+A;T=A+T}},n.i=function(E){return 0>E?0:E<this.g.length?this.g[E]:this.h};function C(E){if(E.h!=0)return!1;for(var g=0;g<E.g.length;g++)if(E.g[g]!=0)return!1;return!0}function D(E){return E.h==-1}n.l=function(E){return E=$(this,E),D(E)?-1:C(E)?0:1};function k(E){for(var g=E.g.length,v=[],T=0;T<g;T++)v[T]=~E.g[T];return new a(v,~E.h).add(_)}n.abs=function(){return D(this)?k(this):this},n.add=function(E){for(var g=Math.max(this.g.length,E.g.length),v=[],T=0,I=0;I<=g;I++){var A=T+(this.i(I)&65535)+(E.i(I)&65535),y=(A>>>16)+(this.i(I)>>>16)+(E.i(I)>>>16);T=y>>>16,A&=65535,y&=65535,v[I]=y<<16|A}return new a(v,v[v.length-1]&-2147483648?-1:0)};function $(E,g){return E.add(k(g))}n.j=function(E){if(C(this)||C(E))return m;if(D(this))return D(E)?k(this).j(k(E)):k(k(this).j(E));if(D(E))return k(this.j(k(E)));if(0>this.l(R)&&0>E.l(R))return d(this.m()*E.m());for(var g=this.g.length+E.g.length,v=[],T=0;T<2*g;T++)v[T]=0;for(T=0;T<this.g.length;T++)for(var I=0;I<E.g.length;I++){var A=this.i(T)>>>16,y=this.i(T)&65535,it=E.i(I)>>>16,Bn=E.i(I)&65535;v[2*T+2*I]+=y*Bn,x(v,2*T+2*I),v[2*T+2*I+1]+=A*Bn,x(v,2*T+2*I+1),v[2*T+2*I+1]+=y*it,x(v,2*T+2*I+1),v[2*T+2*I+2]+=A*it,x(v,2*T+2*I+2)}for(T=0;T<g;T++)v[T]=v[2*T+1]<<16|v[2*T];for(T=g;T<2*g;T++)v[T]=0;return new a(v,0)};function x(E,g){for(;(E[g]&65535)!=E[g];)E[g+1]+=E[g]>>>16,E[g]&=65535,g++}function U(E,g){this.g=E,this.h=g}function z(E,g){if(C(g))throw Error("division by zero");if(C(E))return new U(m,m);if(D(E))return g=z(k(E),g),new U(k(g.g),k(g.h));if(D(g))return g=z(E,k(g)),new U(k(g.g),g.h);if(30<E.g.length){if(D(E)||D(g))throw Error("slowDivide_ only works with positive integers.");for(var v=_,T=g;0>=T.l(E);)v=fe(v),T=fe(T);var I=Z(v,1),A=Z(T,1);for(T=Z(T,2),v=Z(v,2);!C(T);){var y=A.add(T);0>=y.l(E)&&(I=I.add(v),A=y),T=Z(T,1),v=Z(v,1)}return g=$(E,I.j(g)),new U(I,g)}for(I=m;0<=E.l(g);){for(v=Math.max(1,Math.floor(E.m()/g.m())),T=Math.ceil(Math.log(v)/Math.LN2),T=48>=T?1:Math.pow(2,T-48),A=d(v),y=A.j(g);D(y)||0<y.l(E);)v-=T,A=d(v),y=A.j(g);C(A)&&(A=_),I=I.add(A),E=$(E,y)}return new U(I,E)}n.A=function(E){return z(this,E).h},n.and=function(E){for(var g=Math.max(this.g.length,E.g.length),v=[],T=0;T<g;T++)v[T]=this.i(T)&E.i(T);return new a(v,this.h&E.h)},n.or=function(E){for(var g=Math.max(this.g.length,E.g.length),v=[],T=0;T<g;T++)v[T]=this.i(T)|E.i(T);return new a(v,this.h|E.h)},n.xor=function(E){for(var g=Math.max(this.g.length,E.g.length),v=[],T=0;T<g;T++)v[T]=this.i(T)^E.i(T);return new a(v,this.h^E.h)};function fe(E){for(var g=E.g.length+1,v=[],T=0;T<g;T++)v[T]=E.i(T)<<1|E.i(T-1)>>>31;return new a(v,E.h)}function Z(E,g){var v=g>>5;g%=32;for(var T=E.g.length-v,I=[],A=0;A<T;A++)I[A]=0<g?E.i(A+v)>>>g|E.i(A+v+1)<<32-g:E.i(A+v);return new a(I,E.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,Nh=r,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.A,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=d,a.fromString=f,Dt=a}).apply(typeof gu<"u"?gu:typeof self<"u"?self:typeof window<"u"?window:{});var ri=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Dh,ir,Vh,pi,uo,Oh,Lh,Mh;(function(){var n,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(o,u,h){return o==Array.prototype||o==Object.prototype||(o[u]=h.value),o};function t(o){o=[typeof globalThis=="object"&&globalThis,o,typeof window=="object"&&window,typeof self=="object"&&self,typeof ri=="object"&&ri];for(var u=0;u<o.length;++u){var h=o[u];if(h&&h.Math==Math)return h}throw Error("Cannot find global object")}var r=t(this);function i(o,u){if(u)e:{var h=r;o=o.split(".");for(var p=0;p<o.length-1;p++){var w=o[p];if(!(w in h))break e;h=h[w]}o=o[o.length-1],p=h[o],u=u(p),u!=p&&u!=null&&e(h,o,{configurable:!0,writable:!0,value:u})}}function s(o,u){o instanceof String&&(o+="");var h=0,p=!1,w={next:function(){if(!p&&h<o.length){var b=h++;return{value:u(b,o[b]),done:!1}}return p=!0,{done:!0,value:void 0}}};return w[Symbol.iterator]=function(){return w},w}i("Array.prototype.values",function(o){return o||function(){return s(this,function(u,h){return h})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var a=a||{},c=this||self;function l(o){var u=typeof o;return u=u!="object"?u:o?Array.isArray(o)?"array":u:"null",u=="array"||u=="object"&&typeof o.length=="number"}function d(o){var u=typeof o;return u=="object"&&o!=null||u=="function"}function f(o,u,h){return o.call.apply(o.bind,arguments)}function m(o,u,h){if(!o)throw Error();if(2<arguments.length){var p=Array.prototype.slice.call(arguments,2);return function(){var w=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(w,p),o.apply(u,w)}}return function(){return o.apply(u,arguments)}}function _(o,u,h){return _=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?f:m,_.apply(null,arguments)}function R(o,u){var h=Array.prototype.slice.call(arguments,1);return function(){var p=h.slice();return p.push.apply(p,arguments),o.apply(this,p)}}function C(o,u){function h(){}h.prototype=u.prototype,o.aa=u.prototype,o.prototype=new h,o.prototype.constructor=o,o.Qb=function(p,w,b){for(var N=Array(arguments.length-2),J=2;J<arguments.length;J++)N[J-2]=arguments[J];return u.prototype[w].apply(p,N)}}function D(o){const u=o.length;if(0<u){const h=Array(u);for(let p=0;p<u;p++)h[p]=o[p];return h}return[]}function k(o,u){for(let h=1;h<arguments.length;h++){const p=arguments[h];if(l(p)){const w=o.length||0,b=p.length||0;o.length=w+b;for(let N=0;N<b;N++)o[w+N]=p[N]}else o.push(p)}}class ${constructor(u,h){this.i=u,this.j=h,this.h=0,this.g=null}get(){let u;return 0<this.h?(this.h--,u=this.g,this.g=u.next,u.next=null):u=this.i(),u}}function x(o){return/^[\s\xa0]*$/.test(o)}function U(){var o=c.navigator;return o&&(o=o.userAgent)?o:""}function z(o){return z[" "](o),o}z[" "]=function(){};var fe=U().indexOf("Gecko")!=-1&&!(U().toLowerCase().indexOf("webkit")!=-1&&U().indexOf("Edge")==-1)&&!(U().indexOf("Trident")!=-1||U().indexOf("MSIE")!=-1)&&U().indexOf("Edge")==-1;function Z(o,u,h){for(const p in o)u.call(h,o[p],p,o)}function E(o,u){for(const h in o)u.call(void 0,o[h],h,o)}function g(o){const u={};for(const h in o)u[h]=o[h];return u}const v="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function T(o,u){let h,p;for(let w=1;w<arguments.length;w++){p=arguments[w];for(h in p)o[h]=p[h];for(let b=0;b<v.length;b++)h=v[b],Object.prototype.hasOwnProperty.call(p,h)&&(o[h]=p[h])}}function I(o){var u=1;o=o.split(":");const h=[];for(;0<u&&o.length;)h.push(o.shift()),u--;return o.length&&h.push(o.join(":")),h}function A(o){c.setTimeout(()=>{throw o},0)}function y(){var o=vs;let u=null;return o.g&&(u=o.g,o.g=o.g.next,o.g||(o.h=null),u.next=null),u}class it{constructor(){this.h=this.g=null}add(u,h){const p=Bn.get();p.set(u,h),this.h?this.h.next=p:this.g=p,this.h=p}}var Bn=new $(()=>new Jf,o=>o.reset());class Jf{constructor(){this.next=this.g=this.h=null}set(u,h){this.h=u,this.g=h,this.next=null}reset(){this.next=this.g=this.h=null}}let jn,$n=!1,vs=new it,Ha=()=>{const o=c.Promise.resolve(void 0);jn=()=>{o.then(Xf)}};var Xf=()=>{for(var o;o=y();){try{o.h.call(o.g)}catch(h){A(h)}var u=Bn;u.j(o),100>u.h&&(u.h++,o.next=u.g,u.g=o)}$n=!1};function wt(){this.s=this.s,this.C=this.C}wt.prototype.s=!1,wt.prototype.ma=function(){this.s||(this.s=!0,this.N())},wt.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function ye(o,u){this.type=o,this.g=this.target=u,this.defaultPrevented=!1}ye.prototype.h=function(){this.defaultPrevented=!0};var Yf=function(){if(!c.addEventListener||!Object.defineProperty)return!1;var o=!1,u=Object.defineProperty({},"passive",{get:function(){o=!0}});try{const h=()=>{};c.addEventListener("test",h,u),c.removeEventListener("test",h,u)}catch{}return o}();function qn(o,u){if(ye.call(this,o?o.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,o){var h=this.type=o.type,p=o.changedTouches&&o.changedTouches.length?o.changedTouches[0]:null;if(this.target=o.target||o.srcElement,this.g=u,u=o.relatedTarget){if(fe){e:{try{z(u.nodeName);var w=!0;break e}catch{}w=!1}w||(u=null)}}else h=="mouseover"?u=o.fromElement:h=="mouseout"&&(u=o.toElement);this.relatedTarget=u,p?(this.clientX=p.clientX!==void 0?p.clientX:p.pageX,this.clientY=p.clientY!==void 0?p.clientY:p.pageY,this.screenX=p.screenX||0,this.screenY=p.screenY||0):(this.clientX=o.clientX!==void 0?o.clientX:o.pageX,this.clientY=o.clientY!==void 0?o.clientY:o.pageY,this.screenX=o.screenX||0,this.screenY=o.screenY||0),this.button=o.button,this.key=o.key||"",this.ctrlKey=o.ctrlKey,this.altKey=o.altKey,this.shiftKey=o.shiftKey,this.metaKey=o.metaKey,this.pointerId=o.pointerId||0,this.pointerType=typeof o.pointerType=="string"?o.pointerType:Zf[o.pointerType]||"",this.state=o.state,this.i=o,o.defaultPrevented&&qn.aa.h.call(this)}}C(qn,ye);var Zf={2:"touch",3:"pen",4:"mouse"};qn.prototype.h=function(){qn.aa.h.call(this);var o=this.i;o.preventDefault?o.preventDefault():o.returnValue=!1};var xr="closure_listenable_"+(1e6*Math.random()|0),ep=0;function tp(o,u,h,p,w){this.listener=o,this.proxy=null,this.src=u,this.type=h,this.capture=!!p,this.ha=w,this.key=++ep,this.da=this.fa=!1}function Ur(o){o.da=!0,o.listener=null,o.proxy=null,o.src=null,o.ha=null}function Fr(o){this.src=o,this.g={},this.h=0}Fr.prototype.add=function(o,u,h,p,w){var b=o.toString();o=this.g[b],o||(o=this.g[b]=[],this.h++);var N=Es(o,u,p,w);return-1<N?(u=o[N],h||(u.fa=!1)):(u=new tp(u,this.src,b,!!p,w),u.fa=h,o.push(u)),u};function Ts(o,u){var h=u.type;if(h in o.g){var p=o.g[h],w=Array.prototype.indexOf.call(p,u,void 0),b;(b=0<=w)&&Array.prototype.splice.call(p,w,1),b&&(Ur(u),o.g[h].length==0&&(delete o.g[h],o.h--))}}function Es(o,u,h,p){for(var w=0;w<o.length;++w){var b=o[w];if(!b.da&&b.listener==u&&b.capture==!!h&&b.ha==p)return w}return-1}var Is="closure_lm_"+(1e6*Math.random()|0),ws={};function Ga(o,u,h,p,w){if(Array.isArray(u)){for(var b=0;b<u.length;b++)Ga(o,u[b],h,p,w);return null}return h=Qa(h),o&&o[xr]?o.K(u,h,d(p)?!!p.capture:!1,w):np(o,u,h,!1,p,w)}function np(o,u,h,p,w,b){if(!u)throw Error("Invalid event type");var N=d(w)?!!w.capture:!!w,J=Rs(o);if(J||(o[Is]=J=new Fr(o)),h=J.add(u,h,p,N,b),h.proxy)return h;if(p=rp(),h.proxy=p,p.src=o,p.listener=h,o.addEventListener)Yf||(w=N),w===void 0&&(w=!1),o.addEventListener(u.toString(),p,w);else if(o.attachEvent)o.attachEvent(Ka(u.toString()),p);else if(o.addListener&&o.removeListener)o.addListener(p);else throw Error("addEventListener and attachEvent are unavailable.");return h}function rp(){function o(h){return u.call(o.src,o.listener,h)}const u=ip;return o}function Wa(o,u,h,p,w){if(Array.isArray(u))for(var b=0;b<u.length;b++)Wa(o,u[b],h,p,w);else p=d(p)?!!p.capture:!!p,h=Qa(h),o&&o[xr]?(o=o.i,u=String(u).toString(),u in o.g&&(b=o.g[u],h=Es(b,h,p,w),-1<h&&(Ur(b[h]),Array.prototype.splice.call(b,h,1),b.length==0&&(delete o.g[u],o.h--)))):o&&(o=Rs(o))&&(u=o.g[u.toString()],o=-1,u&&(o=Es(u,h,p,w)),(h=-1<o?u[o]:null)&&As(h))}function As(o){if(typeof o!="number"&&o&&!o.da){var u=o.src;if(u&&u[xr])Ts(u.i,o);else{var h=o.type,p=o.proxy;u.removeEventListener?u.removeEventListener(h,p,o.capture):u.detachEvent?u.detachEvent(Ka(h),p):u.addListener&&u.removeListener&&u.removeListener(p),(h=Rs(u))?(Ts(h,o),h.h==0&&(h.src=null,u[Is]=null)):Ur(o)}}}function Ka(o){return o in ws?ws[o]:ws[o]="on"+o}function ip(o,u){if(o.da)o=!0;else{u=new qn(u,this);var h=o.listener,p=o.ha||o.src;o.fa&&As(o),o=h.call(p,u)}return o}function Rs(o){return o=o[Is],o instanceof Fr?o:null}var bs="__closure_events_fn_"+(1e9*Math.random()>>>0);function Qa(o){return typeof o=="function"?o:(o[bs]||(o[bs]=function(u){return o.handleEvent(u)}),o[bs])}function ve(){wt.call(this),this.i=new Fr(this),this.M=this,this.F=null}C(ve,wt),ve.prototype[xr]=!0,ve.prototype.removeEventListener=function(o,u,h,p){Wa(this,o,u,h,p)};function Se(o,u){var h,p=o.F;if(p)for(h=[];p;p=p.F)h.push(p);if(o=o.M,p=u.type||u,typeof u=="string")u=new ye(u,o);else if(u instanceof ye)u.target=u.target||o;else{var w=u;u=new ye(p,o),T(u,w)}if(w=!0,h)for(var b=h.length-1;0<=b;b--){var N=u.g=h[b];w=Br(N,p,!0,u)&&w}if(N=u.g=o,w=Br(N,p,!0,u)&&w,w=Br(N,p,!1,u)&&w,h)for(b=0;b<h.length;b++)N=u.g=h[b],w=Br(N,p,!1,u)&&w}ve.prototype.N=function(){if(ve.aa.N.call(this),this.i){var o=this.i,u;for(u in o.g){for(var h=o.g[u],p=0;p<h.length;p++)Ur(h[p]);delete o.g[u],o.h--}}this.F=null},ve.prototype.K=function(o,u,h,p){return this.i.add(String(o),u,!1,h,p)},ve.prototype.L=function(o,u,h,p){return this.i.add(String(o),u,!0,h,p)};function Br(o,u,h,p){if(u=o.i.g[String(u)],!u)return!0;u=u.concat();for(var w=!0,b=0;b<u.length;++b){var N=u[b];if(N&&!N.da&&N.capture==h){var J=N.listener,pe=N.ha||N.src;N.fa&&Ts(o.i,N),w=J.call(pe,p)!==!1&&w}}return w&&!p.defaultPrevented}function Ja(o,u,h){if(typeof o=="function")h&&(o=_(o,h));else if(o&&typeof o.handleEvent=="function")o=_(o.handleEvent,o);else throw Error("Invalid listener argument");return 2147483647<Number(u)?-1:c.setTimeout(o,u||0)}function Xa(o){o.g=Ja(()=>{o.g=null,o.i&&(o.i=!1,Xa(o))},o.l);const u=o.h;o.h=null,o.m.apply(null,u)}class sp extends wt{constructor(u,h){super(),this.m=u,this.l=h,this.h=null,this.i=!1,this.g=null}j(u){this.h=arguments,this.g?this.i=!0:Xa(this)}N(){super.N(),this.g&&(c.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function zn(o){wt.call(this),this.h=o,this.g={}}C(zn,wt);var Ya=[];function Za(o){Z(o.g,function(u,h){this.g.hasOwnProperty(h)&&As(u)},o),o.g={}}zn.prototype.N=function(){zn.aa.N.call(this),Za(this)},zn.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Ss=c.JSON.stringify,op=c.JSON.parse,ap=class{stringify(o){return c.JSON.stringify(o,void 0)}parse(o){return c.JSON.parse(o,void 0)}};function Ps(){}Ps.prototype.h=null;function ec(o){return o.h||(o.h=o.i())}function tc(){}var Hn={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function Cs(){ye.call(this,"d")}C(Cs,ye);function ks(){ye.call(this,"c")}C(ks,ye);var zt={},nc=null;function jr(){return nc=nc||new ve}zt.La="serverreachability";function rc(o){ye.call(this,zt.La,o)}C(rc,ye);function Gn(o){const u=jr();Se(u,new rc(u))}zt.STAT_EVENT="statevent";function ic(o,u){ye.call(this,zt.STAT_EVENT,o),this.stat=u}C(ic,ye);function Pe(o){const u=jr();Se(u,new ic(u,o))}zt.Ma="timingevent";function sc(o,u){ye.call(this,zt.Ma,o),this.size=u}C(sc,ye);function Wn(o,u){if(typeof o!="function")throw Error("Fn must not be null and must be a function");return c.setTimeout(function(){o()},u)}function Kn(){this.g=!0}Kn.prototype.xa=function(){this.g=!1};function cp(o,u,h,p,w,b){o.info(function(){if(o.g)if(b)for(var N="",J=b.split("&"),pe=0;pe<J.length;pe++){var K=J[pe].split("=");if(1<K.length){var Te=K[0];K=K[1];var Ee=Te.split("_");N=2<=Ee.length&&Ee[1]=="type"?N+(Te+"="+K+"&"):N+(Te+"=redacted&")}}else N=null;else N=b;return"XMLHTTP REQ ("+p+") [attempt "+w+"]: "+u+`
`+h+`
`+N})}function up(o,u,h,p,w,b,N){o.info(function(){return"XMLHTTP RESP ("+p+") [ attempt "+w+"]: "+u+`
`+h+`
`+b+" "+N})}function hn(o,u,h,p){o.info(function(){return"XMLHTTP TEXT ("+u+"): "+hp(o,h)+(p?" "+p:"")})}function lp(o,u){o.info(function(){return"TIMEOUT: "+u})}Kn.prototype.info=function(){};function hp(o,u){if(!o.g)return u;if(!u)return null;try{var h=JSON.parse(u);if(h){for(o=0;o<h.length;o++)if(Array.isArray(h[o])){var p=h[o];if(!(2>p.length)){var w=p[1];if(Array.isArray(w)&&!(1>w.length)){var b=w[0];if(b!="noop"&&b!="stop"&&b!="close")for(var N=1;N<w.length;N++)w[N]=""}}}}return Ss(h)}catch{return u}}var $r={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},oc={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},Ns;function qr(){}C(qr,Ps),qr.prototype.g=function(){return new XMLHttpRequest},qr.prototype.i=function(){return{}},Ns=new qr;function At(o,u,h,p){this.j=o,this.i=u,this.l=h,this.R=p||1,this.U=new zn(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new ac}function ac(){this.i=null,this.g="",this.h=!1}var cc={},Ds={};function Vs(o,u,h){o.L=1,o.v=Wr(st(u)),o.m=h,o.P=!0,uc(o,null)}function uc(o,u){o.F=Date.now(),zr(o),o.A=st(o.v);var h=o.A,p=o.R;Array.isArray(p)||(p=[String(p)]),wc(h.i,"t",p),o.C=0,h=o.j.J,o.h=new ac,o.g=jc(o.j,h?u:null,!o.m),0<o.O&&(o.M=new sp(_(o.Y,o,o.g),o.O)),u=o.U,h=o.g,p=o.ca;var w="readystatechange";Array.isArray(w)||(w&&(Ya[0]=w.toString()),w=Ya);for(var b=0;b<w.length;b++){var N=Ga(h,w[b],p||u.handleEvent,!1,u.h||u);if(!N)break;u.g[N.key]=N}u=o.H?g(o.H):{},o.m?(o.u||(o.u="POST"),u["Content-Type"]="application/x-www-form-urlencoded",o.g.ea(o.A,o.u,o.m,u)):(o.u="GET",o.g.ea(o.A,o.u,null,u)),Gn(),cp(o.i,o.u,o.A,o.l,o.R,o.m)}At.prototype.ca=function(o){o=o.target;const u=this.M;u&&ot(o)==3?u.j():this.Y(o)},At.prototype.Y=function(o){try{if(o==this.g)e:{const Ee=ot(this.g);var u=this.g.Ba();const pn=this.g.Z();if(!(3>Ee)&&(Ee!=3||this.g&&(this.h.h||this.g.oa()||kc(this.g)))){this.J||Ee!=4||u==7||(u==8||0>=pn?Gn(3):Gn(2)),Os(this);var h=this.g.Z();this.X=h;t:if(lc(this)){var p=kc(this.g);o="";var w=p.length,b=ot(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Ht(this),Qn(this);var N="";break t}this.h.i=new c.TextDecoder}for(u=0;u<w;u++)this.h.h=!0,o+=this.h.i.decode(p[u],{stream:!(b&&u==w-1)});p.length=0,this.h.g+=o,this.C=0,N=this.h.g}else N=this.g.oa();if(this.o=h==200,up(this.i,this.u,this.A,this.l,this.R,Ee,h),this.o){if(this.T&&!this.K){t:{if(this.g){var J,pe=this.g;if((J=pe.g?pe.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!x(J)){var K=J;break t}}K=null}if(h=K)hn(this.i,this.l,h,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Ls(this,h);else{this.o=!1,this.s=3,Pe(12),Ht(this),Qn(this);break e}}if(this.P){h=!0;let He;for(;!this.J&&this.C<N.length;)if(He=dp(this,N),He==Ds){Ee==4&&(this.s=4,Pe(14),h=!1),hn(this.i,this.l,null,"[Incomplete Response]");break}else if(He==cc){this.s=4,Pe(15),hn(this.i,this.l,N,"[Invalid Chunk]"),h=!1;break}else hn(this.i,this.l,He,null),Ls(this,He);if(lc(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Ee!=4||N.length!=0||this.h.h||(this.s=1,Pe(16),h=!1),this.o=this.o&&h,!h)hn(this.i,this.l,N,"[Invalid Chunked Response]"),Ht(this),Qn(this);else if(0<N.length&&!this.W){this.W=!0;var Te=this.j;Te.g==this&&Te.ba&&!Te.M&&(Te.j.info("Great, no buffering proxy detected. Bytes received: "+N.length),js(Te),Te.M=!0,Pe(11))}}else hn(this.i,this.l,N,null),Ls(this,N);Ee==4&&Ht(this),this.o&&!this.J&&(Ee==4?xc(this.j,this):(this.o=!1,zr(this)))}else Cp(this.g),h==400&&0<N.indexOf("Unknown SID")?(this.s=3,Pe(12)):(this.s=0,Pe(13)),Ht(this),Qn(this)}}}catch{}finally{}};function lc(o){return o.g?o.u=="GET"&&o.L!=2&&o.j.Ca:!1}function dp(o,u){var h=o.C,p=u.indexOf(`
`,h);return p==-1?Ds:(h=Number(u.substring(h,p)),isNaN(h)?cc:(p+=1,p+h>u.length?Ds:(u=u.slice(p,p+h),o.C=p+h,u)))}At.prototype.cancel=function(){this.J=!0,Ht(this)};function zr(o){o.S=Date.now()+o.I,hc(o,o.I)}function hc(o,u){if(o.B!=null)throw Error("WatchDog timer not null");o.B=Wn(_(o.ba,o),u)}function Os(o){o.B&&(c.clearTimeout(o.B),o.B=null)}At.prototype.ba=function(){this.B=null;const o=Date.now();0<=o-this.S?(lp(this.i,this.A),this.L!=2&&(Gn(),Pe(17)),Ht(this),this.s=2,Qn(this)):hc(this,this.S-o)};function Qn(o){o.j.G==0||o.J||xc(o.j,o)}function Ht(o){Os(o);var u=o.M;u&&typeof u.ma=="function"&&u.ma(),o.M=null,Za(o.U),o.g&&(u=o.g,o.g=null,u.abort(),u.ma())}function Ls(o,u){try{var h=o.j;if(h.G!=0&&(h.g==o||Ms(h.h,o))){if(!o.K&&Ms(h.h,o)&&h.G==3){try{var p=h.Da.g.parse(u)}catch{p=null}if(Array.isArray(p)&&p.length==3){var w=p;if(w[0]==0){e:if(!h.u){if(h.g)if(h.g.F+3e3<o.F)Zr(h),Xr(h);else break e;Bs(h),Pe(18)}}else h.za=w[1],0<h.za-h.T&&37500>w[2]&&h.F&&h.v==0&&!h.C&&(h.C=Wn(_(h.Za,h),6e3));if(1>=pc(h.h)&&h.ca){try{h.ca()}catch{}h.ca=void 0}}else Wt(h,11)}else if((o.K||h.g==o)&&Zr(h),!x(u))for(w=h.Da.g.parse(u),u=0;u<w.length;u++){let K=w[u];if(h.T=K[0],K=K[1],h.G==2)if(K[0]=="c"){h.K=K[1],h.ia=K[2];const Te=K[3];Te!=null&&(h.la=Te,h.j.info("VER="+h.la));const Ee=K[4];Ee!=null&&(h.Aa=Ee,h.j.info("SVER="+h.Aa));const pn=K[5];pn!=null&&typeof pn=="number"&&0<pn&&(p=1.5*pn,h.L=p,h.j.info("backChannelRequestTimeoutMs_="+p)),p=h;const He=o.g;if(He){const ti=He.g?He.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(ti){var b=p.h;b.g||ti.indexOf("spdy")==-1&&ti.indexOf("quic")==-1&&ti.indexOf("h2")==-1||(b.j=b.l,b.g=new Set,b.h&&(xs(b,b.h),b.h=null))}if(p.D){const $s=He.g?He.g.getResponseHeader("X-HTTP-Session-Id"):null;$s&&(p.ya=$s,ee(p.I,p.D,$s))}}h.G=3,h.l&&h.l.ua(),h.ba&&(h.R=Date.now()-o.F,h.j.info("Handshake RTT: "+h.R+"ms")),p=h;var N=o;if(p.qa=Bc(p,p.J?p.ia:null,p.W),N.K){mc(p.h,N);var J=N,pe=p.L;pe&&(J.I=pe),J.B&&(Os(J),zr(J)),p.g=N}else Lc(p);0<h.i.length&&Yr(h)}else K[0]!="stop"&&K[0]!="close"||Wt(h,7);else h.G==3&&(K[0]=="stop"||K[0]=="close"?K[0]=="stop"?Wt(h,7):Fs(h):K[0]!="noop"&&h.l&&h.l.ta(K),h.v=0)}}Gn(4)}catch{}}var fp=class{constructor(o,u){this.g=o,this.map=u}};function dc(o){this.l=o||10,c.PerformanceNavigationTiming?(o=c.performance.getEntriesByType("navigation"),o=0<o.length&&(o[0].nextHopProtocol=="hq"||o[0].nextHopProtocol=="h2")):o=!!(c.chrome&&c.chrome.loadTimes&&c.chrome.loadTimes()&&c.chrome.loadTimes().wasFetchedViaSpdy),this.j=o?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function fc(o){return o.h?!0:o.g?o.g.size>=o.j:!1}function pc(o){return o.h?1:o.g?o.g.size:0}function Ms(o,u){return o.h?o.h==u:o.g?o.g.has(u):!1}function xs(o,u){o.g?o.g.add(u):o.h=u}function mc(o,u){o.h&&o.h==u?o.h=null:o.g&&o.g.has(u)&&o.g.delete(u)}dc.prototype.cancel=function(){if(this.i=gc(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const o of this.g.values())o.cancel();this.g.clear()}};function gc(o){if(o.h!=null)return o.i.concat(o.h.D);if(o.g!=null&&o.g.size!==0){let u=o.i;for(const h of o.g.values())u=u.concat(h.D);return u}return D(o.i)}function pp(o){if(o.V&&typeof o.V=="function")return o.V();if(typeof Map<"u"&&o instanceof Map||typeof Set<"u"&&o instanceof Set)return Array.from(o.values());if(typeof o=="string")return o.split("");if(l(o)){for(var u=[],h=o.length,p=0;p<h;p++)u.push(o[p]);return u}u=[],h=0;for(p in o)u[h++]=o[p];return u}function mp(o){if(o.na&&typeof o.na=="function")return o.na();if(!o.V||typeof o.V!="function"){if(typeof Map<"u"&&o instanceof Map)return Array.from(o.keys());if(!(typeof Set<"u"&&o instanceof Set)){if(l(o)||typeof o=="string"){var u=[];o=o.length;for(var h=0;h<o;h++)u.push(h);return u}u=[],h=0;for(const p in o)u[h++]=p;return u}}}function _c(o,u){if(o.forEach&&typeof o.forEach=="function")o.forEach(u,void 0);else if(l(o)||typeof o=="string")Array.prototype.forEach.call(o,u,void 0);else for(var h=mp(o),p=pp(o),w=p.length,b=0;b<w;b++)u.call(void 0,p[b],h&&h[b],o)}var yc=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function gp(o,u){if(o){o=o.split("&");for(var h=0;h<o.length;h++){var p=o[h].indexOf("="),w=null;if(0<=p){var b=o[h].substring(0,p);w=o[h].substring(p+1)}else b=o[h];u(b,w?decodeURIComponent(w.replace(/\+/g," ")):"")}}}function Gt(o){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,o instanceof Gt){this.h=o.h,Hr(this,o.j),this.o=o.o,this.g=o.g,Gr(this,o.s),this.l=o.l;var u=o.i,h=new Yn;h.i=u.i,u.g&&(h.g=new Map(u.g),h.h=u.h),vc(this,h),this.m=o.m}else o&&(u=String(o).match(yc))?(this.h=!1,Hr(this,u[1]||"",!0),this.o=Jn(u[2]||""),this.g=Jn(u[3]||"",!0),Gr(this,u[4]),this.l=Jn(u[5]||"",!0),vc(this,u[6]||"",!0),this.m=Jn(u[7]||"")):(this.h=!1,this.i=new Yn(null,this.h))}Gt.prototype.toString=function(){var o=[],u=this.j;u&&o.push(Xn(u,Tc,!0),":");var h=this.g;return(h||u=="file")&&(o.push("//"),(u=this.o)&&o.push(Xn(u,Tc,!0),"@"),o.push(encodeURIComponent(String(h)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),h=this.s,h!=null&&o.push(":",String(h))),(h=this.l)&&(this.g&&h.charAt(0)!="/"&&o.push("/"),o.push(Xn(h,h.charAt(0)=="/"?vp:yp,!0))),(h=this.i.toString())&&o.push("?",h),(h=this.m)&&o.push("#",Xn(h,Ep)),o.join("")};function st(o){return new Gt(o)}function Hr(o,u,h){o.j=h?Jn(u,!0):u,o.j&&(o.j=o.j.replace(/:$/,""))}function Gr(o,u){if(u){if(u=Number(u),isNaN(u)||0>u)throw Error("Bad port number "+u);o.s=u}else o.s=null}function vc(o,u,h){u instanceof Yn?(o.i=u,Ip(o.i,o.h)):(h||(u=Xn(u,Tp)),o.i=new Yn(u,o.h))}function ee(o,u,h){o.i.set(u,h)}function Wr(o){return ee(o,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),o}function Jn(o,u){return o?u?decodeURI(o.replace(/%25/g,"%2525")):decodeURIComponent(o):""}function Xn(o,u,h){return typeof o=="string"?(o=encodeURI(o).replace(u,_p),h&&(o=o.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),o):null}function _p(o){return o=o.charCodeAt(0),"%"+(o>>4&15).toString(16)+(o&15).toString(16)}var Tc=/[#\/\?@]/g,yp=/[#\?:]/g,vp=/[#\?]/g,Tp=/[#\?@]/g,Ep=/#/g;function Yn(o,u){this.h=this.g=null,this.i=o||null,this.j=!!u}function Rt(o){o.g||(o.g=new Map,o.h=0,o.i&&gp(o.i,function(u,h){o.add(decodeURIComponent(u.replace(/\+/g," ")),h)}))}n=Yn.prototype,n.add=function(o,u){Rt(this),this.i=null,o=dn(this,o);var h=this.g.get(o);return h||this.g.set(o,h=[]),h.push(u),this.h+=1,this};function Ec(o,u){Rt(o),u=dn(o,u),o.g.has(u)&&(o.i=null,o.h-=o.g.get(u).length,o.g.delete(u))}function Ic(o,u){return Rt(o),u=dn(o,u),o.g.has(u)}n.forEach=function(o,u){Rt(this),this.g.forEach(function(h,p){h.forEach(function(w){o.call(u,w,p,this)},this)},this)},n.na=function(){Rt(this);const o=Array.from(this.g.values()),u=Array.from(this.g.keys()),h=[];for(let p=0;p<u.length;p++){const w=o[p];for(let b=0;b<w.length;b++)h.push(u[p])}return h},n.V=function(o){Rt(this);let u=[];if(typeof o=="string")Ic(this,o)&&(u=u.concat(this.g.get(dn(this,o))));else{o=Array.from(this.g.values());for(let h=0;h<o.length;h++)u=u.concat(o[h])}return u},n.set=function(o,u){return Rt(this),this.i=null,o=dn(this,o),Ic(this,o)&&(this.h-=this.g.get(o).length),this.g.set(o,[u]),this.h+=1,this},n.get=function(o,u){return o?(o=this.V(o),0<o.length?String(o[0]):u):u};function wc(o,u,h){Ec(o,u),0<h.length&&(o.i=null,o.g.set(dn(o,u),D(h)),o.h+=h.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const o=[],u=Array.from(this.g.keys());for(var h=0;h<u.length;h++){var p=u[h];const b=encodeURIComponent(String(p)),N=this.V(p);for(p=0;p<N.length;p++){var w=b;N[p]!==""&&(w+="="+encodeURIComponent(String(N[p]))),o.push(w)}}return this.i=o.join("&")};function dn(o,u){return u=String(u),o.j&&(u=u.toLowerCase()),u}function Ip(o,u){u&&!o.j&&(Rt(o),o.i=null,o.g.forEach(function(h,p){var w=p.toLowerCase();p!=w&&(Ec(this,p),wc(this,w,h))},o)),o.j=u}function wp(o,u){const h=new Kn;if(c.Image){const p=new Image;p.onload=R(bt,h,"TestLoadImage: loaded",!0,u,p),p.onerror=R(bt,h,"TestLoadImage: error",!1,u,p),p.onabort=R(bt,h,"TestLoadImage: abort",!1,u,p),p.ontimeout=R(bt,h,"TestLoadImage: timeout",!1,u,p),c.setTimeout(function(){p.ontimeout&&p.ontimeout()},1e4),p.src=o}else u(!1)}function Ap(o,u){const h=new Kn,p=new AbortController,w=setTimeout(()=>{p.abort(),bt(h,"TestPingServer: timeout",!1,u)},1e4);fetch(o,{signal:p.signal}).then(b=>{clearTimeout(w),b.ok?bt(h,"TestPingServer: ok",!0,u):bt(h,"TestPingServer: server error",!1,u)}).catch(()=>{clearTimeout(w),bt(h,"TestPingServer: error",!1,u)})}function bt(o,u,h,p,w){try{w&&(w.onload=null,w.onerror=null,w.onabort=null,w.ontimeout=null),p(h)}catch{}}function Rp(){this.g=new ap}function bp(o,u,h){const p=h||"";try{_c(o,function(w,b){let N=w;d(w)&&(N=Ss(w)),u.push(p+b+"="+encodeURIComponent(N))})}catch(w){throw u.push(p+"type="+encodeURIComponent("_badmap")),w}}function Kr(o){this.l=o.Ub||null,this.j=o.eb||!1}C(Kr,Ps),Kr.prototype.g=function(){return new Qr(this.l,this.j)},Kr.prototype.i=function(o){return function(){return o}}({});function Qr(o,u){ve.call(this),this.D=o,this.o=u,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}C(Qr,ve),n=Qr.prototype,n.open=function(o,u){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=o,this.A=u,this.readyState=1,er(this)},n.send=function(o){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const u={headers:this.u,method:this.B,credentials:this.m,cache:void 0};o&&(u.body=o),(this.D||c).fetch(new Request(this.A,u)).then(this.Sa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,Zn(this)),this.readyState=0},n.Sa=function(o){if(this.g&&(this.l=o,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=o.headers,this.readyState=2,er(this)),this.g&&(this.readyState=3,er(this),this.g)))if(this.responseType==="arraybuffer")o.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof c.ReadableStream<"u"&&"body"in o){if(this.j=o.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Ac(this)}else o.text().then(this.Ra.bind(this),this.ga.bind(this))};function Ac(o){o.j.read().then(o.Pa.bind(o)).catch(o.ga.bind(o))}n.Pa=function(o){if(this.g){if(this.o&&o.value)this.response.push(o.value);else if(!this.o){var u=o.value?o.value:new Uint8Array(0);(u=this.v.decode(u,{stream:!o.done}))&&(this.response=this.responseText+=u)}o.done?Zn(this):er(this),this.readyState==3&&Ac(this)}},n.Ra=function(o){this.g&&(this.response=this.responseText=o,Zn(this))},n.Qa=function(o){this.g&&(this.response=o,Zn(this))},n.ga=function(){this.g&&Zn(this)};function Zn(o){o.readyState=4,o.l=null,o.j=null,o.v=null,er(o)}n.setRequestHeader=function(o,u){this.u.append(o,u)},n.getResponseHeader=function(o){return this.h&&this.h.get(o.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const o=[],u=this.h.entries();for(var h=u.next();!h.done;)h=h.value,o.push(h[0]+": "+h[1]),h=u.next();return o.join(`\r
`)};function er(o){o.onreadystatechange&&o.onreadystatechange.call(o)}Object.defineProperty(Qr.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(o){this.m=o?"include":"same-origin"}});function Rc(o){let u="";return Z(o,function(h,p){u+=p,u+=":",u+=h,u+=`\r
`}),u}function Us(o,u,h){e:{for(p in h){var p=!1;break e}p=!0}p||(h=Rc(h),typeof o=="string"?h!=null&&encodeURIComponent(String(h)):ee(o,u,h))}function re(o){ve.call(this),this.headers=new Map,this.o=o||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}C(re,ve);var Sp=/^https?$/i,Pp=["POST","PUT"];n=re.prototype,n.Ha=function(o){this.J=o},n.ea=function(o,u,h,p){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+o);u=u?u.toUpperCase():"GET",this.D=o,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Ns.g(),this.v=this.o?ec(this.o):ec(Ns),this.g.onreadystatechange=_(this.Ea,this);try{this.B=!0,this.g.open(u,String(o),!0),this.B=!1}catch(b){bc(this,b);return}if(o=h||"",h=new Map(this.headers),p)if(Object.getPrototypeOf(p)===Object.prototype)for(var w in p)h.set(w,p[w]);else if(typeof p.keys=="function"&&typeof p.get=="function")for(const b of p.keys())h.set(b,p.get(b));else throw Error("Unknown input type for opt_headers: "+String(p));p=Array.from(h.keys()).find(b=>b.toLowerCase()=="content-type"),w=c.FormData&&o instanceof c.FormData,!(0<=Array.prototype.indexOf.call(Pp,u,void 0))||p||w||h.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[b,N]of h)this.g.setRequestHeader(b,N);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Cc(this),this.u=!0,this.g.send(o),this.u=!1}catch(b){bc(this,b)}};function bc(o,u){o.h=!1,o.g&&(o.j=!0,o.g.abort(),o.j=!1),o.l=u,o.m=5,Sc(o),Jr(o)}function Sc(o){o.A||(o.A=!0,Se(o,"complete"),Se(o,"error"))}n.abort=function(o){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=o||7,Se(this,"complete"),Se(this,"abort"),Jr(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Jr(this,!0)),re.aa.N.call(this)},n.Ea=function(){this.s||(this.B||this.u||this.j?Pc(this):this.bb())},n.bb=function(){Pc(this)};function Pc(o){if(o.h&&typeof a<"u"&&(!o.v[1]||ot(o)!=4||o.Z()!=2)){if(o.u&&ot(o)==4)Ja(o.Ea,0,o);else if(Se(o,"readystatechange"),ot(o)==4){o.h=!1;try{const N=o.Z();e:switch(N){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var u=!0;break e;default:u=!1}var h;if(!(h=u)){var p;if(p=N===0){var w=String(o.D).match(yc)[1]||null;!w&&c.self&&c.self.location&&(w=c.self.location.protocol.slice(0,-1)),p=!Sp.test(w?w.toLowerCase():"")}h=p}if(h)Se(o,"complete"),Se(o,"success");else{o.m=6;try{var b=2<ot(o)?o.g.statusText:""}catch{b=""}o.l=b+" ["+o.Z()+"]",Sc(o)}}finally{Jr(o)}}}}function Jr(o,u){if(o.g){Cc(o);const h=o.g,p=o.v[0]?()=>{}:null;o.g=null,o.v=null,u||Se(o,"ready");try{h.onreadystatechange=p}catch{}}}function Cc(o){o.I&&(c.clearTimeout(o.I),o.I=null)}n.isActive=function(){return!!this.g};function ot(o){return o.g?o.g.readyState:0}n.Z=function(){try{return 2<ot(this)?this.g.status:-1}catch{return-1}},n.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.Oa=function(o){if(this.g){var u=this.g.responseText;return o&&u.indexOf(o)==0&&(u=u.substring(o.length)),op(u)}};function kc(o){try{if(!o.g)return null;if("response"in o.g)return o.g.response;switch(o.H){case"":case"text":return o.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in o.g)return o.g.mozResponseArrayBuffer}return null}catch{return null}}function Cp(o){const u={};o=(o.g&&2<=ot(o)&&o.g.getAllResponseHeaders()||"").split(`\r
`);for(let p=0;p<o.length;p++){if(x(o[p]))continue;var h=I(o[p]);const w=h[0];if(h=h[1],typeof h!="string")continue;h=h.trim();const b=u[w]||[];u[w]=b,b.push(h)}E(u,function(p){return p.join(", ")})}n.Ba=function(){return this.m},n.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function tr(o,u,h){return h&&h.internalChannelParams&&h.internalChannelParams[o]||u}function Nc(o){this.Aa=0,this.i=[],this.j=new Kn,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=tr("failFast",!1,o),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=tr("baseRetryDelayMs",5e3,o),this.cb=tr("retryDelaySeedMs",1e4,o),this.Wa=tr("forwardChannelMaxRetries",2,o),this.wa=tr("forwardChannelRequestTimeoutMs",2e4,o),this.pa=o&&o.xmlHttpFactory||void 0,this.Xa=o&&o.Tb||void 0,this.Ca=o&&o.useFetchStreams||!1,this.L=void 0,this.J=o&&o.supportsCrossDomainXhr||!1,this.K="",this.h=new dc(o&&o.concurrentRequestLimit),this.Da=new Rp,this.P=o&&o.fastHandshake||!1,this.O=o&&o.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=o&&o.Rb||!1,o&&o.xa&&this.j.xa(),o&&o.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&o&&o.detectBufferingProxy||!1,this.ja=void 0,o&&o.longPollingTimeout&&0<o.longPollingTimeout&&(this.ja=o.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}n=Nc.prototype,n.la=8,n.G=1,n.connect=function(o,u,h,p){Pe(0),this.W=o,this.H=u||{},h&&p!==void 0&&(this.H.OSID=h,this.H.OAID=p),this.F=this.X,this.I=Bc(this,null,this.W),Yr(this)};function Fs(o){if(Dc(o),o.G==3){var u=o.U++,h=st(o.I);if(ee(h,"SID",o.K),ee(h,"RID",u),ee(h,"TYPE","terminate"),nr(o,h),u=new At(o,o.j,u),u.L=2,u.v=Wr(st(h)),h=!1,c.navigator&&c.navigator.sendBeacon)try{h=c.navigator.sendBeacon(u.v.toString(),"")}catch{}!h&&c.Image&&(new Image().src=u.v,h=!0),h||(u.g=jc(u.j,null),u.g.ea(u.v)),u.F=Date.now(),zr(u)}Fc(o)}function Xr(o){o.g&&(js(o),o.g.cancel(),o.g=null)}function Dc(o){Xr(o),o.u&&(c.clearTimeout(o.u),o.u=null),Zr(o),o.h.cancel(),o.s&&(typeof o.s=="number"&&c.clearTimeout(o.s),o.s=null)}function Yr(o){if(!fc(o.h)&&!o.s){o.s=!0;var u=o.Ga;jn||Ha(),$n||(jn(),$n=!0),vs.add(u,o),o.B=0}}function kp(o,u){return pc(o.h)>=o.h.j-(o.s?1:0)?!1:o.s?(o.i=u.D.concat(o.i),!0):o.G==1||o.G==2||o.B>=(o.Va?0:o.Wa)?!1:(o.s=Wn(_(o.Ga,o,u),Uc(o,o.B)),o.B++,!0)}n.Ga=function(o){if(this.s)if(this.s=null,this.G==1){if(!o){this.U=Math.floor(1e5*Math.random()),o=this.U++;const w=new At(this,this.j,o);let b=this.o;if(this.S&&(b?(b=g(b),T(b,this.S)):b=this.S),this.m!==null||this.O||(w.H=b,b=null),this.P)e:{for(var u=0,h=0;h<this.i.length;h++){t:{var p=this.i[h];if("__data__"in p.map&&(p=p.map.__data__,typeof p=="string")){p=p.length;break t}p=void 0}if(p===void 0)break;if(u+=p,4096<u){u=h;break e}if(u===4096||h===this.i.length-1){u=h+1;break e}}u=1e3}else u=1e3;u=Oc(this,w,u),h=st(this.I),ee(h,"RID",o),ee(h,"CVER",22),this.D&&ee(h,"X-HTTP-Session-Id",this.D),nr(this,h),b&&(this.O?u="headers="+encodeURIComponent(String(Rc(b)))+"&"+u:this.m&&Us(h,this.m,b)),xs(this.h,w),this.Ua&&ee(h,"TYPE","init"),this.P?(ee(h,"$req",u),ee(h,"SID","null"),w.T=!0,Vs(w,h,null)):Vs(w,h,u),this.G=2}}else this.G==3&&(o?Vc(this,o):this.i.length==0||fc(this.h)||Vc(this))};function Vc(o,u){var h;u?h=u.l:h=o.U++;const p=st(o.I);ee(p,"SID",o.K),ee(p,"RID",h),ee(p,"AID",o.T),nr(o,p),o.m&&o.o&&Us(p,o.m,o.o),h=new At(o,o.j,h,o.B+1),o.m===null&&(h.H=o.o),u&&(o.i=u.D.concat(o.i)),u=Oc(o,h,1e3),h.I=Math.round(.5*o.wa)+Math.round(.5*o.wa*Math.random()),xs(o.h,h),Vs(h,p,u)}function nr(o,u){o.H&&Z(o.H,function(h,p){ee(u,p,h)}),o.l&&_c({},function(h,p){ee(u,p,h)})}function Oc(o,u,h){h=Math.min(o.i.length,h);var p=o.l?_(o.l.Na,o.l,o):null;e:{var w=o.i;let b=-1;for(;;){const N=["count="+h];b==-1?0<h?(b=w[0].g,N.push("ofs="+b)):b=0:N.push("ofs="+b);let J=!0;for(let pe=0;pe<h;pe++){let K=w[pe].g;const Te=w[pe].map;if(K-=b,0>K)b=Math.max(0,w[pe].g-100),J=!1;else try{bp(Te,N,"req"+K+"_")}catch{p&&p(Te)}}if(J){p=N.join("&");break e}}}return o=o.i.splice(0,h),u.D=o,p}function Lc(o){if(!o.g&&!o.u){o.Y=1;var u=o.Fa;jn||Ha(),$n||(jn(),$n=!0),vs.add(u,o),o.v=0}}function Bs(o){return o.g||o.u||3<=o.v?!1:(o.Y++,o.u=Wn(_(o.Fa,o),Uc(o,o.v)),o.v++,!0)}n.Fa=function(){if(this.u=null,Mc(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var o=2*this.R;this.j.info("BP detection timer enabled: "+o),this.A=Wn(_(this.ab,this),o)}},n.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,Pe(10),Xr(this),Mc(this))};function js(o){o.A!=null&&(c.clearTimeout(o.A),o.A=null)}function Mc(o){o.g=new At(o,o.j,"rpc",o.Y),o.m===null&&(o.g.H=o.o),o.g.O=0;var u=st(o.qa);ee(u,"RID","rpc"),ee(u,"SID",o.K),ee(u,"AID",o.T),ee(u,"CI",o.F?"0":"1"),!o.F&&o.ja&&ee(u,"TO",o.ja),ee(u,"TYPE","xmlhttp"),nr(o,u),o.m&&o.o&&Us(u,o.m,o.o),o.L&&(o.g.I=o.L);var h=o.g;o=o.ia,h.L=1,h.v=Wr(st(u)),h.m=null,h.P=!0,uc(h,o)}n.Za=function(){this.C!=null&&(this.C=null,Xr(this),Bs(this),Pe(19))};function Zr(o){o.C!=null&&(c.clearTimeout(o.C),o.C=null)}function xc(o,u){var h=null;if(o.g==u){Zr(o),js(o),o.g=null;var p=2}else if(Ms(o.h,u))h=u.D,mc(o.h,u),p=1;else return;if(o.G!=0){if(u.o)if(p==1){h=u.m?u.m.length:0,u=Date.now()-u.F;var w=o.B;p=jr(),Se(p,new sc(p,h)),Yr(o)}else Lc(o);else if(w=u.s,w==3||w==0&&0<u.X||!(p==1&&kp(o,u)||p==2&&Bs(o)))switch(h&&0<h.length&&(u=o.h,u.i=u.i.concat(h)),w){case 1:Wt(o,5);break;case 4:Wt(o,10);break;case 3:Wt(o,6);break;default:Wt(o,2)}}}function Uc(o,u){let h=o.Ta+Math.floor(Math.random()*o.cb);return o.isActive()||(h*=2),h*u}function Wt(o,u){if(o.j.info("Error code "+u),u==2){var h=_(o.fb,o),p=o.Xa;const w=!p;p=new Gt(p||"//www.google.com/images/cleardot.gif"),c.location&&c.location.protocol=="http"||Hr(p,"https"),Wr(p),w?wp(p.toString(),h):Ap(p.toString(),h)}else Pe(2);o.G=0,o.l&&o.l.sa(u),Fc(o),Dc(o)}n.fb=function(o){o?(this.j.info("Successfully pinged google.com"),Pe(2)):(this.j.info("Failed to ping google.com"),Pe(1))};function Fc(o){if(o.G=0,o.ka=[],o.l){const u=gc(o.h);(u.length!=0||o.i.length!=0)&&(k(o.ka,u),k(o.ka,o.i),o.h.i.length=0,D(o.i),o.i.length=0),o.l.ra()}}function Bc(o,u,h){var p=h instanceof Gt?st(h):new Gt(h);if(p.g!="")u&&(p.g=u+"."+p.g),Gr(p,p.s);else{var w=c.location;p=w.protocol,u=u?u+"."+w.hostname:w.hostname,w=+w.port;var b=new Gt(null);p&&Hr(b,p),u&&(b.g=u),w&&Gr(b,w),h&&(b.l=h),p=b}return h=o.D,u=o.ya,h&&u&&ee(p,h,u),ee(p,"VER",o.la),nr(o,p),p}function jc(o,u,h){if(u&&!o.J)throw Error("Can't create secondary domain capable XhrIo object.");return u=o.Ca&&!o.pa?new re(new Kr({eb:h})):new re(o.pa),u.Ha(o.J),u}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function $c(){}n=$c.prototype,n.ua=function(){},n.ta=function(){},n.sa=function(){},n.ra=function(){},n.isActive=function(){return!0},n.Na=function(){};function ei(){}ei.prototype.g=function(o,u){return new Me(o,u)};function Me(o,u){ve.call(this),this.g=new Nc(u),this.l=o,this.h=u&&u.messageUrlParams||null,o=u&&u.messageHeaders||null,u&&u.clientProtocolHeaderRequired&&(o?o["X-Client-Protocol"]="webchannel":o={"X-Client-Protocol":"webchannel"}),this.g.o=o,o=u&&u.initMessageHeaders||null,u&&u.messageContentType&&(o?o["X-WebChannel-Content-Type"]=u.messageContentType:o={"X-WebChannel-Content-Type":u.messageContentType}),u&&u.va&&(o?o["X-WebChannel-Client-Profile"]=u.va:o={"X-WebChannel-Client-Profile":u.va}),this.g.S=o,(o=u&&u.Sb)&&!x(o)&&(this.g.m=o),this.v=u&&u.supportsCrossDomainXhr||!1,this.u=u&&u.sendRawJson||!1,(u=u&&u.httpSessionIdParam)&&!x(u)&&(this.g.D=u,o=this.h,o!==null&&u in o&&(o=this.h,u in o&&delete o[u])),this.j=new fn(this)}C(Me,ve),Me.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},Me.prototype.close=function(){Fs(this.g)},Me.prototype.o=function(o){var u=this.g;if(typeof o=="string"){var h={};h.__data__=o,o=h}else this.u&&(h={},h.__data__=Ss(o),o=h);u.i.push(new fp(u.Ya++,o)),u.G==3&&Yr(u)},Me.prototype.N=function(){this.g.l=null,delete this.j,Fs(this.g),delete this.g,Me.aa.N.call(this)};function qc(o){Cs.call(this),o.__headers__&&(this.headers=o.__headers__,this.statusCode=o.__status__,delete o.__headers__,delete o.__status__);var u=o.__sm__;if(u){e:{for(const h in u){o=h;break e}o=void 0}(this.i=o)&&(o=this.i,u=u!==null&&o in u?u[o]:void 0),this.data=u}else this.data=o}C(qc,Cs);function zc(){ks.call(this),this.status=1}C(zc,ks);function fn(o){this.g=o}C(fn,$c),fn.prototype.ua=function(){Se(this.g,"a")},fn.prototype.ta=function(o){Se(this.g,new qc(o))},fn.prototype.sa=function(o){Se(this.g,new zc)},fn.prototype.ra=function(){Se(this.g,"b")},ei.prototype.createWebChannel=ei.prototype.g,Me.prototype.send=Me.prototype.o,Me.prototype.open=Me.prototype.m,Me.prototype.close=Me.prototype.close,Mh=function(){return new ei},Lh=function(){return jr()},Oh=zt,uo={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},$r.NO_ERROR=0,$r.TIMEOUT=8,$r.HTTP_ERROR=6,pi=$r,oc.COMPLETE="complete",Vh=oc,tc.EventType=Hn,Hn.OPEN="a",Hn.CLOSE="b",Hn.ERROR="c",Hn.MESSAGE="d",ve.prototype.listen=ve.prototype.K,ir=tc,re.prototype.listenOnce=re.prototype.L,re.prototype.getLastError=re.prototype.Ka,re.prototype.getLastErrorCode=re.prototype.Ba,re.prototype.getStatus=re.prototype.Z,re.prototype.getResponseJson=re.prototype.Oa,re.prototype.getResponseText=re.prototype.oa,re.prototype.send=re.prototype.ea,re.prototype.setWithCredentials=re.prototype.Ha,Dh=re}).apply(typeof ri<"u"?ri:typeof self<"u"?self:typeof window<"u"?window:{});const _u="@firebase/firestore",yu="4.8.0";/**
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
 */class we{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}we.UNAUTHENTICATED=new we(null),we.GOOGLE_CREDENTIALS=new we("google-credentials-uid"),we.FIRST_PARTY=new we("first-party-uid"),we.MOCK_USER=new we("mock-user");/**
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
 */let Vn="11.10.0";/**
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
 */const tn=new Hi("@firebase/firestore");function mn(){return tn.logLevel}function O(n,...e){if(tn.logLevel<=H.DEBUG){const t=e.map(Wo);tn.debug(`Firestore (${Vn}): ${n}`,...t)}}function _t(n,...e){if(tn.logLevel<=H.ERROR){const t=e.map(Wo);tn.error(`Firestore (${Vn}): ${n}`,...t)}}function Lt(n,...e){if(tn.logLevel<=H.WARN){const t=e.map(Wo);tn.warn(`Firestore (${Vn}): ${n}`,...t)}}function Wo(n){if(typeof n=="string")return n;try{/**
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
*/return function(t){return JSON.stringify(t)}(n)}catch{return n}}/**
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
 */function M(n,e,t){let r="Unexpected state";typeof e=="string"?r=e:t=e,xh(n,r,t)}function xh(n,e,t){let r=`FIRESTORE (${Vn}) INTERNAL ASSERTION FAILED: ${e} (ID: ${n.toString(16)})`;if(t!==void 0)try{r+=" CONTEXT: "+JSON.stringify(t)}catch{r+=" CONTEXT: "+t}throw _t(r),new Error(r)}function Q(n,e,t,r){let i="Unexpected state";typeof t=="string"?i=t:r=t,n||xh(e,i,r)}function j(n,e){return n}/**
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
 */const S={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class V extends je{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
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
 */class ft{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
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
 */class Uh{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class J_{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(we.UNAUTHENTICATED))}shutdown(){}}class X_{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class Y_{constructor(e){this.t=e,this.currentUser=we.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){Q(this.o===void 0,42304);let r=this.i;const i=l=>this.i!==r?(r=this.i,t(l)):Promise.resolve();let s=new ft;this.o=()=>{this.i++,this.currentUser=this.u(),s.resolve(),s=new ft,e.enqueueRetryable(()=>i(this.currentUser))};const a=()=>{const l=s;e.enqueueRetryable(async()=>{await l.promise,await i(this.currentUser)})},c=l=>{O("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=l,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit(l=>c(l)),setTimeout(()=>{if(!this.auth){const l=this.t.getImmediate({optional:!0});l?c(l):(O("FirebaseAuthCredentialsProvider","Auth not yet detected"),s.resolve(),s=new ft)}},0),a()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(r=>this.i!==e?(O("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(Q(typeof r.accessToken=="string",31837,{l:r}),new Uh(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Q(e===null||typeof e=="string",2055,{h:e}),new we(e)}}class Z_{constructor(e,t,r){this.P=e,this.T=t,this.I=r,this.type="FirstParty",this.user=we.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const e=this.R();return e&&this.A.set("Authorization",e),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class ey{constructor(e,t,r){this.P=e,this.T=t,this.I=r}getToken(){return Promise.resolve(new Z_(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable(()=>t(we.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class vu{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class ty{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,Ne(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){Q(this.o===void 0,3512);const r=s=>{s.error!=null&&O("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${s.error.message}`);const a=s.token!==this.m;return this.m=s.token,O("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?t(s.token):Promise.resolve()};this.o=s=>{e.enqueueRetryable(()=>r(s))};const i=s=>{O("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=s,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit(s=>i(s)),setTimeout(()=>{if(!this.appCheck){const s=this.V.getImmediate({optional:!0});s?i(s):O("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){if(this.p)return Promise.resolve(new vu(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(t=>t?(Q(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new vu(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
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
 */function ny(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let r=0;r<n;r++)t[r]=Math.floor(256*Math.random());return t}/**
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
 */function Fh(){return new TextEncoder}/**
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
 */class Ko{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let r="";for(;r.length<20;){const i=ny(40);for(let s=0;s<i.length;++s)r.length<20&&i[s]<t&&(r+=e.charAt(i[s]%62))}return r}}function q(n,e){return n<e?-1:n>e?1:0}function lo(n,e){let t=0;for(;t<n.length&&t<e.length;){const r=n.codePointAt(t),i=e.codePointAt(t);if(r!==i){if(r<128&&i<128)return q(r,i);{const s=Fh(),a=ry(s.encode(Tu(n,t)),s.encode(Tu(e,t)));return a!==0?a:q(r,i)}}t+=r>65535?2:1}return q(n.length,e.length)}function Tu(n,e){return n.codePointAt(e)>65535?n.substring(e,e+2):n.substring(e,e+1)}function ry(n,e){for(let t=0;t<n.length&&t<e.length;++t)if(n[t]!==e[t])return q(n[t],e[t]);return q(n.length,e.length)}function An(n,e,t){return n.length===e.length&&n.every((r,i)=>t(r,e[i]))}/**
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
 */const Eu="__name__";class Qe{constructor(e,t,r){t===void 0?t=0:t>e.length&&M(637,{offset:t,range:e.length}),r===void 0?r=e.length-t:r>e.length-t&&M(1746,{length:r,range:e.length-t}),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return Qe.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof Qe?e.forEach(r=>{t.push(r)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const r=Math.min(e.length,t.length);for(let i=0;i<r;i++){const s=Qe.compareSegments(e.get(i),t.get(i));if(s!==0)return s}return q(e.length,t.length)}static compareSegments(e,t){const r=Qe.isNumericId(e),i=Qe.isNumericId(t);return r&&!i?-1:!r&&i?1:r&&i?Qe.extractNumericId(e).compare(Qe.extractNumericId(t)):lo(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return Dt.fromString(e.substring(4,e.length-2))}}class Y extends Qe{construct(e,t,r){return new Y(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const r of e){if(r.indexOf("//")>=0)throw new V(S.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter(i=>i.length>0))}return new Y(t)}static emptyPath(){return new Y([])}}const iy=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class ge extends Qe{construct(e,t,r){return new ge(e,t,r)}static isValidIdentifier(e){return iy.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),ge.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Eu}static keyField(){return new ge([Eu])}static fromServerFormat(e){const t=[];let r="",i=0;const s=()=>{if(r.length===0)throw new V(S.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""};let a=!1;for(;i<e.length;){const c=e[i];if(c==="\\"){if(i+1===e.length)throw new V(S.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const l=e[i+1];if(l!=="\\"&&l!=="."&&l!=="`")throw new V(S.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=l,i+=2}else c==="`"?(a=!a,i++):c!=="."||a?(r+=c,i++):(s(),i++)}if(s(),a)throw new V(S.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new ge(t)}static emptyPath(){return new ge([])}}/**
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
 */class L{constructor(e){this.path=e}static fromPath(e){return new L(Y.fromString(e))}static fromName(e){return new L(Y.fromString(e).popFirst(5))}static empty(){return new L(Y.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&Y.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return Y.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new L(new Y(e.slice()))}}/**
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
 */function Bh(n,e,t){if(!t)throw new V(S.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function sy(n,e,t,r){if(e===!0&&r===!0)throw new V(S.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function Iu(n){if(!L.isDocumentKey(n))throw new V(S.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function wu(n){if(L.isDocumentKey(n))throw new V(S.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function jh(n){return typeof n=="object"&&n!==null&&(Object.getPrototypeOf(n)===Object.prototype||Object.getPrototypeOf(n)===null)}function Qi(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=function(r){return r.constructor?r.constructor.name:null}(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":M(12329,{type:typeof n})}function Oe(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new V(S.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Qi(n);throw new V(S.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function le(n,e){const t={typeString:n};return e&&(t.value=e),t}function Dr(n,e){if(!jh(n))throw new V(S.INVALID_ARGUMENT,"JSON must be an object");let t;for(const r in e)if(e[r]){const i=e[r].typeString,s="value"in e[r]?{value:e[r].value}:void 0;if(!(r in n)){t=`JSON missing required field: '${r}'`;break}const a=n[r];if(i&&typeof a!==i){t=`JSON field '${r}' must be a ${i}.`;break}if(s!==void 0&&a!==s.value){t=`Expected '${r}' field to equal '${s.value}'`;break}}if(t)throw new V(S.INVALID_ARGUMENT,t);return!0}/**
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
 */const Au=-62135596800,Ru=1e6;class te{static now(){return te.fromMillis(Date.now())}static fromDate(e){return te.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),r=Math.floor((e-1e3*t)*Ru);return new te(t,r)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new V(S.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new V(S.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<Au)throw new V(S.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new V(S.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Ru}_compareTo(e){return this.seconds===e.seconds?q(this.nanoseconds,e.nanoseconds):q(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:te._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(Dr(e,te._jsonSchema))return new te(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-Au;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}te._jsonSchemaVersion="firestore/timestamp/1.0",te._jsonSchema={type:le("string",te._jsonSchemaVersion),seconds:le("number"),nanoseconds:le("number")};/**
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
 */class B{static fromTimestamp(e){return new B(e)}static min(){return new B(new te(0,0))}static max(){return new B(new te(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
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
 */const vr=-1;function oy(n,e){const t=n.toTimestamp().seconds,r=n.toTimestamp().nanoseconds+1,i=B.fromTimestamp(r===1e9?new te(t+1,0):new te(t,r));return new Mt(i,L.empty(),e)}function ay(n){return new Mt(n.readTime,n.key,vr)}class Mt{constructor(e,t,r){this.readTime=e,this.documentKey=t,this.largestBatchId=r}static min(){return new Mt(B.min(),L.empty(),vr)}static max(){return new Mt(B.max(),L.empty(),vr)}}function cy(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=L.comparator(n.documentKey,e.documentKey),t!==0?t:q(n.largestBatchId,e.largestBatchId))}/**
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
 */const uy="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class ly{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
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
 */async function On(n){if(n.code!==S.FAILED_PRECONDITION||n.message!==uy)throw n;O("LocalStore","Unexpectedly lost primary lease")}/**
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
 */class P{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)},t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&M(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new P((r,i)=>{this.nextCallback=s=>{this.wrapSuccess(e,s).next(r,i)},this.catchCallback=s=>{this.wrapFailure(t,s).next(r,i)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{const t=e();return t instanceof P?t:P.resolve(t)}catch(t){return P.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):P.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):P.reject(t)}static resolve(e){return new P((t,r)=>{t(e)})}static reject(e){return new P((t,r)=>{r(e)})}static waitFor(e){return new P((t,r)=>{let i=0,s=0,a=!1;e.forEach(c=>{++i,c.next(()=>{++s,a&&s===i&&t()},l=>r(l))}),a=!0,s===i&&t()})}static or(e){let t=P.resolve(!1);for(const r of e)t=t.next(i=>i?P.resolve(i):r());return t}static forEach(e,t){const r=[];return e.forEach((i,s)=>{r.push(t.call(this,i,s))}),this.waitFor(r)}static mapArray(e,t){return new P((r,i)=>{const s=e.length,a=new Array(s);let c=0;for(let l=0;l<s;l++){const d=l;t(e[d]).next(f=>{a[d]=f,++c,c===s&&r(a)},f=>i(f))}})}static doWhile(e,t){return new P((r,i)=>{const s=()=>{e()===!0?t().next(()=>{s()},i):r()};s()})}}function hy(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function Ln(n){return n.name==="IndexedDbTransactionError"}/**
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
 */class Ji{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=r=>this._e(r),this.ae=r=>t.writeSequenceNumber(r))}_e(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ae&&this.ae(e),e}}Ji.ue=-1;/**
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
 */const Qo=-1;function Xi(n){return n==null}function Si(n){return n===0&&1/n==-1/0}function dy(n){return typeof n=="number"&&Number.isInteger(n)&&!Si(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
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
 */const $h="";function fy(n){let e="";for(let t=0;t<n.length;t++)e.length>0&&(e=bu(e)),e=py(n.get(t),e);return bu(e)}function py(n,e){let t=e;const r=n.length;for(let i=0;i<r;i++){const s=n.charAt(i);switch(s){case"\0":t+="";break;case $h:t+="";break;default:t+=s}}return t}function bu(n){return n+$h+""}/**
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
 */function Su(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function $t(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function qh(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
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
 */class ne{constructor(e,t){this.comparator=e,this.root=t||me.EMPTY}insert(e,t){return new ne(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,me.BLACK,null,null))}remove(e){return new ne(this.comparator,this.root.remove(e,this.comparator).copy(null,null,me.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const r=this.comparator(e,t.key);if(r===0)return t.value;r<0?t=t.left:r>0&&(t=t.right)}return null}indexOf(e){let t=0,r=this.root;for(;!r.isEmpty();){const i=this.comparator(e,r.key);if(i===0)return t+r.left.size;i<0?r=r.left:(t+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,r)=>(e(t,r),!1))}toString(){const e=[];return this.inorderTraversal((t,r)=>(e.push(`${t}:${r}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new ii(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new ii(this.root,e,this.comparator,!1)}getReverseIterator(){return new ii(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new ii(this.root,e,this.comparator,!0)}}class ii{constructor(e,t,r,i){this.isReverse=i,this.nodeStack=[];let s=1;for(;!e.isEmpty();)if(s=t?r(e.key,t):1,t&&i&&(s*=-1),s<0)e=this.isReverse?e.left:e.right;else{if(s===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class me{constructor(e,t,r,i,s){this.key=e,this.value=t,this.color=r??me.RED,this.left=i??me.EMPTY,this.right=s??me.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,r,i,s){return new me(e??this.key,t??this.value,r??this.color,i??this.left,s??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,r){let i=this;const s=r(e,i.key);return i=s<0?i.copy(null,null,null,i.left.insert(e,t,r),null):s===0?i.copy(null,t,null,null,null):i.copy(null,null,null,null,i.right.insert(e,t,r)),i.fixUp()}removeMin(){if(this.left.isEmpty())return me.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let r,i=this;if(t(e,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(e,t),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),t(e,i.key)===0){if(i.right.isEmpty())return me.EMPTY;r=i.right.min(),i=i.copy(r.key,r.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(e,t))}return i.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,me.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,me.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw M(43730,{key:this.key,value:this.value});if(this.right.isRed())throw M(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw M(27949);return e+(this.isRed()?0:1)}}me.EMPTY=null,me.RED=!0,me.BLACK=!1;me.EMPTY=new class{constructor(){this.size=0}get key(){throw M(57766)}get value(){throw M(16141)}get color(){throw M(16727)}get left(){throw M(29726)}get right(){throw M(36894)}copy(e,t,r,i,s){return this}insert(e,t,r){return new me(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
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
 */class he{constructor(e){this.comparator=e,this.data=new ne(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,r)=>(e(t),!1))}forEachInRange(e,t){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const i=r.getNext();if(this.comparator(i.key,e[1])>=0)return;t(i.key)}}forEachWhile(e,t){let r;for(r=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Pu(this.data.getIterator())}getIteratorFrom(e){return new Pu(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(r=>{t=t.add(r)}),t}isEqual(e){if(!(e instanceof he)||this.size!==e.size)return!1;const t=this.data.getIterator(),r=e.data.getIterator();for(;t.hasNext();){const i=t.getNext().key,s=r.getNext().key;if(this.comparator(i,s)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(t=>{e.push(t)}),e}toString(){const e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){const t=new he(this.comparator);return t.data=e,t}}class Pu{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
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
 */class xe{constructor(e){this.fields=e,e.sort(ge.comparator)}static empty(){return new xe([])}unionWith(e){let t=new he(ge.comparator);for(const r of this.fields)t=t.add(r);for(const r of e)t=t.add(r);return new xe(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return An(this.fields,e.fields,(t,r)=>t.isEqual(r))}}/**
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
 */class zh extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
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
 */class _e{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(i){try{return atob(i)}catch(s){throw typeof DOMException<"u"&&s instanceof DOMException?new zh("Invalid base64 string: "+s):s}}(e);return new _e(t)}static fromUint8Array(e){const t=function(i){let s="";for(let a=0;a<i.length;++a)s+=String.fromCharCode(i[a]);return s}(e);return new _e(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(t){return btoa(t)}(this.binaryString)}toUint8Array(){return function(t){const r=new Uint8Array(t.length);for(let i=0;i<t.length;i++)r[i]=t.charCodeAt(i);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return q(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}_e.EMPTY_BYTE_STRING=new _e("");const my=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function xt(n){if(Q(!!n,39018),typeof n=="string"){let e=0;const t=my.exec(n);if(Q(!!t,46558,{timestamp:n}),t[1]){let i=t[1];i=(i+"000000000").substr(0,9),e=Number(i)}const r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:ae(n.seconds),nanos:ae(n.nanos)}}function ae(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function Ut(n){return typeof n=="string"?_e.fromBase64String(n):_e.fromUint8Array(n)}/**
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
 */const Hh="server_timestamp",Gh="__type__",Wh="__previous_value__",Kh="__local_write_time__";function Jo(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{})[Gh])===null||t===void 0?void 0:t.stringValue)===Hh}function Yi(n){const e=n.mapValue.fields[Wh];return Jo(e)?Yi(e):e}function Tr(n){const e=xt(n.mapValue.fields[Kh].timestampValue);return new te(e.seconds,e.nanos)}/**
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
 */class gy{constructor(e,t,r,i,s,a,c,l,d,f){this.databaseId=e,this.appId=t,this.persistenceKey=r,this.host=i,this.ssl=s,this.forceLongPolling=a,this.autoDetectLongPolling=c,this.longPollingOptions=l,this.useFetchStreams=d,this.isUsingEmulator=f}}const Pi="(default)";class Er{constructor(e,t){this.projectId=e,this.database=t||Pi}static empty(){return new Er("","")}get isDefaultDatabase(){return this.database===Pi}isEqual(e){return e instanceof Er&&e.projectId===this.projectId&&e.database===this.database}}/**
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
 */const Qh="__type__",_y="__max__",si={mapValue:{}},Jh="__vector__",Ci="value";function Ft(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?Jo(n)?4:vy(n)?9007199254740991:yy(n)?10:11:M(28295,{value:n})}function rt(n,e){if(n===e)return!0;const t=Ft(n);if(t!==Ft(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return Tr(n).isEqual(Tr(e));case 3:return function(i,s){if(typeof i.timestampValue=="string"&&typeof s.timestampValue=="string"&&i.timestampValue.length===s.timestampValue.length)return i.timestampValue===s.timestampValue;const a=xt(i.timestampValue),c=xt(s.timestampValue);return a.seconds===c.seconds&&a.nanos===c.nanos}(n,e);case 5:return n.stringValue===e.stringValue;case 6:return function(i,s){return Ut(i.bytesValue).isEqual(Ut(s.bytesValue))}(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return function(i,s){return ae(i.geoPointValue.latitude)===ae(s.geoPointValue.latitude)&&ae(i.geoPointValue.longitude)===ae(s.geoPointValue.longitude)}(n,e);case 2:return function(i,s){if("integerValue"in i&&"integerValue"in s)return ae(i.integerValue)===ae(s.integerValue);if("doubleValue"in i&&"doubleValue"in s){const a=ae(i.doubleValue),c=ae(s.doubleValue);return a===c?Si(a)===Si(c):isNaN(a)&&isNaN(c)}return!1}(n,e);case 9:return An(n.arrayValue.values||[],e.arrayValue.values||[],rt);case 10:case 11:return function(i,s){const a=i.mapValue.fields||{},c=s.mapValue.fields||{};if(Su(a)!==Su(c))return!1;for(const l in a)if(a.hasOwnProperty(l)&&(c[l]===void 0||!rt(a[l],c[l])))return!1;return!0}(n,e);default:return M(52216,{left:n})}}function Ir(n,e){return(n.values||[]).find(t=>rt(t,e))!==void 0}function Rn(n,e){if(n===e)return 0;const t=Ft(n),r=Ft(e);if(t!==r)return q(t,r);switch(t){case 0:case 9007199254740991:return 0;case 1:return q(n.booleanValue,e.booleanValue);case 2:return function(s,a){const c=ae(s.integerValue||s.doubleValue),l=ae(a.integerValue||a.doubleValue);return c<l?-1:c>l?1:c===l?0:isNaN(c)?isNaN(l)?0:-1:1}(n,e);case 3:return Cu(n.timestampValue,e.timestampValue);case 4:return Cu(Tr(n),Tr(e));case 5:return lo(n.stringValue,e.stringValue);case 6:return function(s,a){const c=Ut(s),l=Ut(a);return c.compareTo(l)}(n.bytesValue,e.bytesValue);case 7:return function(s,a){const c=s.split("/"),l=a.split("/");for(let d=0;d<c.length&&d<l.length;d++){const f=q(c[d],l[d]);if(f!==0)return f}return q(c.length,l.length)}(n.referenceValue,e.referenceValue);case 8:return function(s,a){const c=q(ae(s.latitude),ae(a.latitude));return c!==0?c:q(ae(s.longitude),ae(a.longitude))}(n.geoPointValue,e.geoPointValue);case 9:return ku(n.arrayValue,e.arrayValue);case 10:return function(s,a){var c,l,d,f;const m=s.fields||{},_=a.fields||{},R=(c=m[Ci])===null||c===void 0?void 0:c.arrayValue,C=(l=_[Ci])===null||l===void 0?void 0:l.arrayValue,D=q(((d=R==null?void 0:R.values)===null||d===void 0?void 0:d.length)||0,((f=C==null?void 0:C.values)===null||f===void 0?void 0:f.length)||0);return D!==0?D:ku(R,C)}(n.mapValue,e.mapValue);case 11:return function(s,a){if(s===si.mapValue&&a===si.mapValue)return 0;if(s===si.mapValue)return 1;if(a===si.mapValue)return-1;const c=s.fields||{},l=Object.keys(c),d=a.fields||{},f=Object.keys(d);l.sort(),f.sort();for(let m=0;m<l.length&&m<f.length;++m){const _=lo(l[m],f[m]);if(_!==0)return _;const R=Rn(c[l[m]],d[f[m]]);if(R!==0)return R}return q(l.length,f.length)}(n.mapValue,e.mapValue);default:throw M(23264,{le:t})}}function Cu(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return q(n,e);const t=xt(n),r=xt(e),i=q(t.seconds,r.seconds);return i!==0?i:q(t.nanos,r.nanos)}function ku(n,e){const t=n.values||[],r=e.values||[];for(let i=0;i<t.length&&i<r.length;++i){const s=Rn(t[i],r[i]);if(s)return s}return q(t.length,r.length)}function bn(n){return ho(n)}function ho(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?function(t){const r=xt(t);return`time(${r.seconds},${r.nanos})`}(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?function(t){return Ut(t).toBase64()}(n.bytesValue):"referenceValue"in n?function(t){return L.fromName(t).toString()}(n.referenceValue):"geoPointValue"in n?function(t){return`geo(${t.latitude},${t.longitude})`}(n.geoPointValue):"arrayValue"in n?function(t){let r="[",i=!0;for(const s of t.values||[])i?i=!1:r+=",",r+=ho(s);return r+"]"}(n.arrayValue):"mapValue"in n?function(t){const r=Object.keys(t.fields||{}).sort();let i="{",s=!0;for(const a of r)s?s=!1:i+=",",i+=`${a}:${ho(t.fields[a])}`;return i+"}"}(n.mapValue):M(61005,{value:n})}function mi(n){switch(Ft(n)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=Yi(n);return e?16+mi(e):16;case 5:return 2*n.stringValue.length;case 6:return Ut(n.bytesValue).approximateByteSize();case 7:return n.referenceValue.length;case 9:return function(r){return(r.values||[]).reduce((i,s)=>i+mi(s),0)}(n.arrayValue);case 10:case 11:return function(r){let i=0;return $t(r.fields,(s,a)=>{i+=s.length+mi(a)}),i}(n.mapValue);default:throw M(13486,{value:n})}}function Nu(n,e){return{referenceValue:`projects/${n.projectId}/databases/${n.database}/documents/${e.path.canonicalString()}`}}function fo(n){return!!n&&"integerValue"in n}function Xo(n){return!!n&&"arrayValue"in n}function Du(n){return!!n&&"nullValue"in n}function Vu(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function gi(n){return!!n&&"mapValue"in n}function yy(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{})[Qh])===null||t===void 0?void 0:t.stringValue)===Jh}function lr(n){if(n.geoPointValue)return{geoPointValue:Object.assign({},n.geoPointValue)};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:Object.assign({},n.timestampValue)};if(n.mapValue){const e={mapValue:{fields:{}}};return $t(n.mapValue.fields,(t,r)=>e.mapValue.fields[t]=lr(r)),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=lr(n.arrayValue.values[t]);return e}return Object.assign({},n)}function vy(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue===_y}/**
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
 */class De{constructor(e){this.value=e}static empty(){return new De({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let r=0;r<e.length-1;++r)if(t=(t.mapValue.fields||{})[e.get(r)],!gi(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=lr(t)}setAll(e){let t=ge.emptyPath(),r={},i=[];e.forEach((a,c)=>{if(!t.isImmediateParentOf(c)){const l=this.getFieldsMap(t);this.applyChanges(l,r,i),r={},i=[],t=c.popLast()}a?r[c.lastSegment()]=lr(a):i.push(c.lastSegment())});const s=this.getFieldsMap(t);this.applyChanges(s,r,i)}delete(e){const t=this.field(e.popLast());gi(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return rt(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let r=0;r<e.length;++r){let i=t.mapValue.fields[e.get(r)];gi(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},t.mapValue.fields[e.get(r)]=i),t=i}return t.mapValue.fields}applyChanges(e,t,r){$t(t,(i,s)=>e[i]=s);for(const i of r)delete e[i]}clone(){return new De(lr(this.value))}}function Xh(n){const e=[];return $t(n.fields,(t,r)=>{const i=new ge([t]);if(gi(r)){const s=Xh(r.mapValue).fields;if(s.length===0)e.push(i);else for(const a of s)e.push(i.child(a))}else e.push(i)}),new xe(e)}/**
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
 */class Ae{constructor(e,t,r,i,s,a,c){this.key=e,this.documentType=t,this.version=r,this.readTime=i,this.createTime=s,this.data=a,this.documentState=c}static newInvalidDocument(e){return new Ae(e,0,B.min(),B.min(),B.min(),De.empty(),0)}static newFoundDocument(e,t,r,i){return new Ae(e,1,t,B.min(),r,i,0)}static newNoDocument(e,t){return new Ae(e,2,t,B.min(),B.min(),De.empty(),0)}static newUnknownDocument(e,t){return new Ae(e,3,t,B.min(),B.min(),De.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(B.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=De.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=De.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=B.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Ae&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Ae(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class ki{constructor(e,t){this.position=e,this.inclusive=t}}function Ou(n,e,t){let r=0;for(let i=0;i<n.position.length;i++){const s=e[i],a=n.position[i];if(s.field.isKeyField()?r=L.comparator(L.fromName(a.referenceValue),t.key):r=Rn(a,t.data.field(s.field)),s.dir==="desc"&&(r*=-1),r!==0)break}return r}function Lu(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!rt(n.position[t],e.position[t]))return!1;return!0}/**
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
 */class wr{constructor(e,t="asc"){this.field=e,this.dir=t}}function Ty(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
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
 */class Yh{}class ue extends Yh{constructor(e,t,r){super(),this.field=e,this.op=t,this.value=r}static create(e,t,r){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,r):new Iy(e,t,r):t==="array-contains"?new Ry(e,r):t==="in"?new by(e,r):t==="not-in"?new Sy(e,r):t==="array-contains-any"?new Py(e,r):new ue(e,t,r)}static createKeyFieldInFilter(e,t,r){return t==="in"?new wy(e,r):new Ay(e,r)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(Rn(t,this.value)):t!==null&&Ft(this.value)===Ft(t)&&this.matchesComparison(Rn(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return M(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Ke extends Yh{constructor(e,t){super(),this.filters=e,this.op=t,this.he=null}static create(e,t){return new Ke(e,t)}matches(e){return Zh(this)?this.filters.find(t=>!t.matches(e))===void 0:this.filters.find(t=>t.matches(e))!==void 0}getFlattenedFilters(){return this.he!==null||(this.he=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.he}getFilters(){return Object.assign([],this.filters)}}function Zh(n){return n.op==="and"}function ed(n){return Ey(n)&&Zh(n)}function Ey(n){for(const e of n.filters)if(e instanceof Ke)return!1;return!0}function po(n){if(n instanceof ue)return n.field.canonicalString()+n.op.toString()+bn(n.value);if(ed(n))return n.filters.map(e=>po(e)).join(",");{const e=n.filters.map(t=>po(t)).join(",");return`${n.op}(${e})`}}function td(n,e){return n instanceof ue?function(r,i){return i instanceof ue&&r.op===i.op&&r.field.isEqual(i.field)&&rt(r.value,i.value)}(n,e):n instanceof Ke?function(r,i){return i instanceof Ke&&r.op===i.op&&r.filters.length===i.filters.length?r.filters.reduce((s,a,c)=>s&&td(a,i.filters[c]),!0):!1}(n,e):void M(19439)}function nd(n){return n instanceof ue?function(t){return`${t.field.canonicalString()} ${t.op} ${bn(t.value)}`}(n):n instanceof Ke?function(t){return t.op.toString()+" {"+t.getFilters().map(nd).join(" ,")+"}"}(n):"Filter"}class Iy extends ue{constructor(e,t,r){super(e,t,r),this.key=L.fromName(r.referenceValue)}matches(e){const t=L.comparator(e.key,this.key);return this.matchesComparison(t)}}class wy extends ue{constructor(e,t){super(e,"in",t),this.keys=rd("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class Ay extends ue{constructor(e,t){super(e,"not-in",t),this.keys=rd("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function rd(n,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map(r=>L.fromName(r.referenceValue))}class Ry extends ue{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return Xo(t)&&Ir(t.arrayValue,this.value)}}class by extends ue{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&Ir(this.value.arrayValue,t)}}class Sy extends ue{constructor(e,t){super(e,"not-in",t)}matches(e){if(Ir(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!Ir(this.value.arrayValue,t)}}class Py extends ue{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!Xo(t)||!t.arrayValue.values)&&t.arrayValue.values.some(r=>Ir(this.value.arrayValue,r))}}/**
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
 */class Cy{constructor(e,t=null,r=[],i=[],s=null,a=null,c=null){this.path=e,this.collectionGroup=t,this.orderBy=r,this.filters=i,this.limit=s,this.startAt=a,this.endAt=c,this.Pe=null}}function Mu(n,e=null,t=[],r=[],i=null,s=null,a=null){return new Cy(n,e,t,r,i,s,a)}function Yo(n){const e=j(n);if(e.Pe===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map(r=>po(r)).join(","),t+="|ob:",t+=e.orderBy.map(r=>function(s){return s.field.canonicalString()+s.dir}(r)).join(","),Xi(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(r=>bn(r)).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(r=>bn(r)).join(",")),e.Pe=t}return e.Pe}function Zo(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!Ty(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!td(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!Lu(n.startAt,e.startAt)&&Lu(n.endAt,e.endAt)}function mo(n){return L.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
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
 */class Mn{constructor(e,t=null,r=[],i=[],s=null,a="F",c=null,l=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=i,this.limit=s,this.limitType=a,this.startAt=c,this.endAt=l,this.Te=null,this.Ie=null,this.de=null,this.startAt,this.endAt}}function ky(n,e,t,r,i,s,a,c){return new Mn(n,e,t,r,i,s,a,c)}function Zi(n){return new Mn(n)}function xu(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function id(n){return n.collectionGroup!==null}function hr(n){const e=j(n);if(e.Te===null){e.Te=[];const t=new Set;for(const s of e.explicitOrderBy)e.Te.push(s),t.add(s.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(a){let c=new he(ge.comparator);return a.filters.forEach(l=>{l.getFlattenedFilters().forEach(d=>{d.isInequality()&&(c=c.add(d.field))})}),c})(e).forEach(s=>{t.has(s.canonicalString())||s.isKeyField()||e.Te.push(new wr(s,r))}),t.has(ge.keyField().canonicalString())||e.Te.push(new wr(ge.keyField(),r))}return e.Te}function Ye(n){const e=j(n);return e.Ie||(e.Ie=Ny(e,hr(n))),e.Ie}function Ny(n,e){if(n.limitType==="F")return Mu(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map(i=>{const s=i.dir==="desc"?"asc":"desc";return new wr(i.field,s)});const t=n.endAt?new ki(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new ki(n.startAt.position,n.startAt.inclusive):null;return Mu(n.path,n.collectionGroup,e,n.filters,n.limit,t,r)}}function go(n,e){const t=n.filters.concat([e]);return new Mn(n.path,n.collectionGroup,n.explicitOrderBy.slice(),t,n.limit,n.limitType,n.startAt,n.endAt)}function Ni(n,e,t){return new Mn(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function es(n,e){return Zo(Ye(n),Ye(e))&&n.limitType===e.limitType}function sd(n){return`${Yo(Ye(n))}|lt:${n.limitType}`}function gn(n){return`Query(target=${function(t){let r=t.path.canonicalString();return t.collectionGroup!==null&&(r+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(r+=`, filters: [${t.filters.map(i=>nd(i)).join(", ")}]`),Xi(t.limit)||(r+=", limit: "+t.limit),t.orderBy.length>0&&(r+=`, orderBy: [${t.orderBy.map(i=>function(a){return`${a.field.canonicalString()} (${a.dir})`}(i)).join(", ")}]`),t.startAt&&(r+=", startAt: ",r+=t.startAt.inclusive?"b:":"a:",r+=t.startAt.position.map(i=>bn(i)).join(",")),t.endAt&&(r+=", endAt: ",r+=t.endAt.inclusive?"a:":"b:",r+=t.endAt.position.map(i=>bn(i)).join(",")),`Target(${r})`}(Ye(n))}; limitType=${n.limitType})`}function ts(n,e){return e.isFoundDocument()&&function(r,i){const s=i.key.path;return r.collectionGroup!==null?i.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(s):L.isDocumentKey(r.path)?r.path.isEqual(s):r.path.isImmediateParentOf(s)}(n,e)&&function(r,i){for(const s of hr(r))if(!s.field.isKeyField()&&i.data.field(s.field)===null)return!1;return!0}(n,e)&&function(r,i){for(const s of r.filters)if(!s.matches(i))return!1;return!0}(n,e)&&function(r,i){return!(r.startAt&&!function(a,c,l){const d=Ou(a,c,l);return a.inclusive?d<=0:d<0}(r.startAt,hr(r),i)||r.endAt&&!function(a,c,l){const d=Ou(a,c,l);return a.inclusive?d>=0:d>0}(r.endAt,hr(r),i))}(n,e)}function Dy(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function od(n){return(e,t)=>{let r=!1;for(const i of hr(n)){const s=Vy(i,e,t);if(s!==0)return s;r=r||i.field.isKeyField()}return 0}}function Vy(n,e,t){const r=n.field.isKeyField()?L.comparator(e.key,t.key):function(s,a,c){const l=a.data.field(s),d=c.data.field(s);return l!==null&&d!==null?Rn(l,d):M(42886)}(n.field,e,t);switch(n.dir){case"asc":return r;case"desc":return-1*r;default:return M(19790,{direction:n.dir})}}/**
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
 */class un{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r!==void 0){for(const[i,s]of r)if(this.equalsFn(i,e))return s}}has(e){return this.get(e)!==void 0}set(e,t){const r=this.mapKeyFn(e),i=this.inner[r];if(i===void 0)return this.inner[r]=[[e,t]],void this.innerSize++;for(let s=0;s<i.length;s++)if(this.equalsFn(i[s][0],e))return void(i[s]=[e,t]);i.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r===void 0)return!1;for(let i=0;i<r.length;i++)if(this.equalsFn(r[i][0],e))return r.length===1?delete this.inner[t]:r.splice(i,1),this.innerSize--,!0;return!1}forEach(e){$t(this.inner,(t,r)=>{for(const[i,s]of r)e(i,s)})}isEmpty(){return qh(this.inner)}size(){return this.innerSize}}/**
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
 */const Oy=new ne(L.comparator);function yt(){return Oy}const ad=new ne(L.comparator);function sr(...n){let e=ad;for(const t of n)e=e.insert(t.key,t);return e}function cd(n){let e=ad;return n.forEach((t,r)=>e=e.insert(t,r.overlayedDocument)),e}function Jt(){return dr()}function ud(){return dr()}function dr(){return new un(n=>n.toString(),(n,e)=>n.isEqual(e))}const Ly=new ne(L.comparator),My=new he(L.comparator);function G(...n){let e=My;for(const t of n)e=e.add(t);return e}const xy=new he(q);function Uy(){return xy}/**
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
 */function ea(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Si(e)?"-0":e}}function ld(n){return{integerValue:""+n}}function hd(n,e){return dy(e)?ld(e):ea(n,e)}/**
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
 */class ns{constructor(){this._=void 0}}function Fy(n,e,t){return n instanceof Ar?function(i,s){const a={fields:{[Gh]:{stringValue:Hh},[Kh]:{timestampValue:{seconds:i.seconds,nanos:i.nanoseconds}}}};return s&&Jo(s)&&(s=Yi(s)),s&&(a.fields[Wh]=s),{mapValue:a}}(t,e):n instanceof Sn?fd(n,e):n instanceof Rr?pd(n,e):function(i,s){const a=dd(i,s),c=Uu(a)+Uu(i.Ee);return fo(a)&&fo(i.Ee)?ld(c):ea(i.serializer,c)}(n,e)}function By(n,e,t){return n instanceof Sn?fd(n,e):n instanceof Rr?pd(n,e):t}function dd(n,e){return n instanceof br?function(r){return fo(r)||function(s){return!!s&&"doubleValue"in s}(r)}(e)?e:{integerValue:0}:null}class Ar extends ns{}class Sn extends ns{constructor(e){super(),this.elements=e}}function fd(n,e){const t=md(e);for(const r of n.elements)t.some(i=>rt(i,r))||t.push(r);return{arrayValue:{values:t}}}class Rr extends ns{constructor(e){super(),this.elements=e}}function pd(n,e){let t=md(e);for(const r of n.elements)t=t.filter(i=>!rt(i,r));return{arrayValue:{values:t}}}class br extends ns{constructor(e,t){super(),this.serializer=e,this.Ee=t}}function Uu(n){return ae(n.integerValue||n.doubleValue)}function md(n){return Xo(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}/**
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
 */class ta{constructor(e,t){this.field=e,this.transform=t}}function jy(n,e){return n.field.isEqual(e.field)&&function(r,i){return r instanceof Sn&&i instanceof Sn||r instanceof Rr&&i instanceof Rr?An(r.elements,i.elements,rt):r instanceof br&&i instanceof br?rt(r.Ee,i.Ee):r instanceof Ar&&i instanceof Ar}(n.transform,e.transform)}class $y{constructor(e,t){this.version=e,this.transformResults=t}}class qe{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new qe}static exists(e){return new qe(void 0,e)}static updateTime(e){return new qe(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function _i(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class rs{}function gd(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new na(n.key,qe.none()):new Vr(n.key,n.data,qe.none());{const t=n.data,r=De.empty();let i=new he(ge.comparator);for(let s of e.fields)if(!i.has(s)){let a=t.field(s);a===null&&s.length>1&&(s=s.popLast(),a=t.field(s)),a===null?r.delete(s):r.set(s,a),i=i.add(s)}return new qt(n.key,r,new xe(i.toArray()),qe.none())}}function qy(n,e,t){n instanceof Vr?function(i,s,a){const c=i.value.clone(),l=Bu(i.fieldTransforms,s,a.transformResults);c.setAll(l),s.convertToFoundDocument(a.version,c).setHasCommittedMutations()}(n,e,t):n instanceof qt?function(i,s,a){if(!_i(i.precondition,s))return void s.convertToUnknownDocument(a.version);const c=Bu(i.fieldTransforms,s,a.transformResults),l=s.data;l.setAll(_d(i)),l.setAll(c),s.convertToFoundDocument(a.version,l).setHasCommittedMutations()}(n,e,t):function(i,s,a){s.convertToNoDocument(a.version).setHasCommittedMutations()}(0,e,t)}function fr(n,e,t,r){return n instanceof Vr?function(s,a,c,l){if(!_i(s.precondition,a))return c;const d=s.value.clone(),f=ju(s.fieldTransforms,l,a);return d.setAll(f),a.convertToFoundDocument(a.version,d).setHasLocalMutations(),null}(n,e,t,r):n instanceof qt?function(s,a,c,l){if(!_i(s.precondition,a))return c;const d=ju(s.fieldTransforms,l,a),f=a.data;return f.setAll(_d(s)),f.setAll(d),a.convertToFoundDocument(a.version,f).setHasLocalMutations(),c===null?null:c.unionWith(s.fieldMask.fields).unionWith(s.fieldTransforms.map(m=>m.field))}(n,e,t,r):function(s,a,c){return _i(s.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):c}(n,e,t)}function zy(n,e){let t=null;for(const r of n.fieldTransforms){const i=e.data.field(r.field),s=dd(r.transform,i||null);s!=null&&(t===null&&(t=De.empty()),t.set(r.field,s))}return t||null}function Fu(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!function(r,i){return r===void 0&&i===void 0||!(!r||!i)&&An(r,i,(s,a)=>jy(s,a))}(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class Vr extends rs{constructor(e,t,r,i=[]){super(),this.key=e,this.value=t,this.precondition=r,this.fieldTransforms=i,this.type=0}getFieldMask(){return null}}class qt extends rs{constructor(e,t,r,i,s=[]){super(),this.key=e,this.data=t,this.fieldMask=r,this.precondition=i,this.fieldTransforms=s,this.type=1}getFieldMask(){return this.fieldMask}}function _d(n){const e=new Map;return n.fieldMask.fields.forEach(t=>{if(!t.isEmpty()){const r=n.data.field(t);e.set(t,r)}}),e}function Bu(n,e,t){const r=new Map;Q(n.length===t.length,32656,{Ae:t.length,Re:n.length});for(let i=0;i<t.length;i++){const s=n[i],a=s.transform,c=e.data.field(s.field);r.set(s.field,By(a,c,t[i]))}return r}function ju(n,e,t){const r=new Map;for(const i of n){const s=i.transform,a=t.data.field(i.field);r.set(i.field,Fy(s,a,e))}return r}class na extends rs{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class Hy extends rs{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
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
 */class Gy{constructor(e,t,r,i){this.batchId=e,this.localWriteTime=t,this.baseMutations=r,this.mutations=i}applyToRemoteDocument(e,t){const r=t.mutationResults;for(let i=0;i<this.mutations.length;i++){const s=this.mutations[i];s.key.isEqual(e.key)&&qy(s,e,r[i])}}applyToLocalView(e,t){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(t=fr(r,e,t,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(t=fr(r,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const r=ud();return this.mutations.forEach(i=>{const s=e.get(i.key),a=s.overlayedDocument;let c=this.applyToLocalView(a,s.mutatedFields);c=t.has(i.key)?null:c;const l=gd(a,c);l!==null&&r.set(i.key,l),a.isValidDocument()||a.convertToNoDocument(B.min())}),r}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),G())}isEqual(e){return this.batchId===e.batchId&&An(this.mutations,e.mutations,(t,r)=>Fu(t,r))&&An(this.baseMutations,e.baseMutations,(t,r)=>Fu(t,r))}}class ra{constructor(e,t,r,i){this.batch=e,this.commitVersion=t,this.mutationResults=r,this.docVersions=i}static from(e,t,r){Q(e.mutations.length===r.length,58842,{Ve:e.mutations.length,me:r.length});let i=function(){return Ly}();const s=e.mutations;for(let a=0;a<s.length;a++)i=i.insert(s[a].key,r[a].version);return new ra(e,t,r,i)}}/**
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
 */class Wy{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
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
 */class Ky{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
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
 */var ce,W;function Qy(n){switch(n){case S.OK:return M(64938);case S.CANCELLED:case S.UNKNOWN:case S.DEADLINE_EXCEEDED:case S.RESOURCE_EXHAUSTED:case S.INTERNAL:case S.UNAVAILABLE:case S.UNAUTHENTICATED:return!1;case S.INVALID_ARGUMENT:case S.NOT_FOUND:case S.ALREADY_EXISTS:case S.PERMISSION_DENIED:case S.FAILED_PRECONDITION:case S.ABORTED:case S.OUT_OF_RANGE:case S.UNIMPLEMENTED:case S.DATA_LOSS:return!0;default:return M(15467,{code:n})}}function yd(n){if(n===void 0)return _t("GRPC error has no .code"),S.UNKNOWN;switch(n){case ce.OK:return S.OK;case ce.CANCELLED:return S.CANCELLED;case ce.UNKNOWN:return S.UNKNOWN;case ce.DEADLINE_EXCEEDED:return S.DEADLINE_EXCEEDED;case ce.RESOURCE_EXHAUSTED:return S.RESOURCE_EXHAUSTED;case ce.INTERNAL:return S.INTERNAL;case ce.UNAVAILABLE:return S.UNAVAILABLE;case ce.UNAUTHENTICATED:return S.UNAUTHENTICATED;case ce.INVALID_ARGUMENT:return S.INVALID_ARGUMENT;case ce.NOT_FOUND:return S.NOT_FOUND;case ce.ALREADY_EXISTS:return S.ALREADY_EXISTS;case ce.PERMISSION_DENIED:return S.PERMISSION_DENIED;case ce.FAILED_PRECONDITION:return S.FAILED_PRECONDITION;case ce.ABORTED:return S.ABORTED;case ce.OUT_OF_RANGE:return S.OUT_OF_RANGE;case ce.UNIMPLEMENTED:return S.UNIMPLEMENTED;case ce.DATA_LOSS:return S.DATA_LOSS;default:return M(39323,{code:n})}}(W=ce||(ce={}))[W.OK=0]="OK",W[W.CANCELLED=1]="CANCELLED",W[W.UNKNOWN=2]="UNKNOWN",W[W.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",W[W.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",W[W.NOT_FOUND=5]="NOT_FOUND",W[W.ALREADY_EXISTS=6]="ALREADY_EXISTS",W[W.PERMISSION_DENIED=7]="PERMISSION_DENIED",W[W.UNAUTHENTICATED=16]="UNAUTHENTICATED",W[W.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",W[W.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",W[W.ABORTED=10]="ABORTED",W[W.OUT_OF_RANGE=11]="OUT_OF_RANGE",W[W.UNIMPLEMENTED=12]="UNIMPLEMENTED",W[W.INTERNAL=13]="INTERNAL",W[W.UNAVAILABLE=14]="UNAVAILABLE",W[W.DATA_LOSS=15]="DATA_LOSS";/**
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
 */const Jy=new Dt([4294967295,4294967295],0);function $u(n){const e=Fh().encode(n),t=new Nh;return t.update(e),new Uint8Array(t.digest())}function qu(n){const e=new DataView(n.buffer),t=e.getUint32(0,!0),r=e.getUint32(4,!0),i=e.getUint32(8,!0),s=e.getUint32(12,!0);return[new Dt([t,r],0),new Dt([i,s],0)]}class ia{constructor(e,t,r){if(this.bitmap=e,this.padding=t,this.hashCount=r,t<0||t>=8)throw new or(`Invalid padding: ${t}`);if(r<0)throw new or(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new or(`Invalid hash count: ${r}`);if(e.length===0&&t!==0)throw new or(`Invalid padding when bitmap length is 0: ${t}`);this.fe=8*e.length-t,this.ge=Dt.fromNumber(this.fe)}pe(e,t,r){let i=e.add(t.multiply(Dt.fromNumber(r)));return i.compare(Jy)===1&&(i=new Dt([i.getBits(0),i.getBits(1)],0)),i.modulo(this.ge).toNumber()}ye(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.fe===0)return!1;const t=$u(e),[r,i]=qu(t);for(let s=0;s<this.hashCount;s++){const a=this.pe(r,i,s);if(!this.ye(a))return!1}return!0}static create(e,t,r){const i=e%8==0?0:8-e%8,s=new Uint8Array(Math.ceil(e/8)),a=new ia(s,i,t);return r.forEach(c=>a.insert(c)),a}insert(e){if(this.fe===0)return;const t=$u(e),[r,i]=qu(t);for(let s=0;s<this.hashCount;s++){const a=this.pe(r,i,s);this.we(a)}}we(e){const t=Math.floor(e/8),r=e%8;this.bitmap[t]|=1<<r}}class or extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
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
 */class is{constructor(e,t,r,i,s){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=r,this.documentUpdates=i,this.resolvedLimboDocuments=s}static createSynthesizedRemoteEventForCurrentChange(e,t,r){const i=new Map;return i.set(e,Or.createSynthesizedTargetChangeForCurrentChange(e,t,r)),new is(B.min(),i,new ne(q),yt(),G())}}class Or{constructor(e,t,r,i,s){this.resumeToken=e,this.current=t,this.addedDocuments=r,this.modifiedDocuments=i,this.removedDocuments=s}static createSynthesizedTargetChangeForCurrentChange(e,t,r){return new Or(r,t,G(),G(),G())}}/**
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
 */class yi{constructor(e,t,r,i){this.Se=e,this.removedTargetIds=t,this.key=r,this.be=i}}class vd{constructor(e,t){this.targetId=e,this.De=t}}class Td{constructor(e,t,r=_e.EMPTY_BYTE_STRING,i=null){this.state=e,this.targetIds=t,this.resumeToken=r,this.cause=i}}class zu{constructor(){this.ve=0,this.Ce=Hu(),this.Fe=_e.EMPTY_BYTE_STRING,this.Me=!1,this.xe=!0}get current(){return this.Me}get resumeToken(){return this.Fe}get Oe(){return this.ve!==0}get Ne(){return this.xe}Be(e){e.approximateByteSize()>0&&(this.xe=!0,this.Fe=e)}Le(){let e=G(),t=G(),r=G();return this.Ce.forEach((i,s)=>{switch(s){case 0:e=e.add(i);break;case 2:t=t.add(i);break;case 1:r=r.add(i);break;default:M(38017,{changeType:s})}}),new Or(this.Fe,this.Me,e,t,r)}ke(){this.xe=!1,this.Ce=Hu()}qe(e,t){this.xe=!0,this.Ce=this.Ce.insert(e,t)}Qe(e){this.xe=!0,this.Ce=this.Ce.remove(e)}$e(){this.ve+=1}Ue(){this.ve-=1,Q(this.ve>=0,3241,{ve:this.ve})}Ke(){this.xe=!0,this.Me=!0}}class Xy{constructor(e){this.We=e,this.Ge=new Map,this.ze=yt(),this.je=oi(),this.Je=oi(),this.He=new ne(q)}Ye(e){for(const t of e.Se)e.be&&e.be.isFoundDocument()?this.Ze(t,e.be):this.Xe(t,e.key,e.be);for(const t of e.removedTargetIds)this.Xe(t,e.key,e.be)}et(e){this.forEachTarget(e,t=>{const r=this.tt(t);switch(e.state){case 0:this.nt(t)&&r.Be(e.resumeToken);break;case 1:r.Ue(),r.Oe||r.ke(),r.Be(e.resumeToken);break;case 2:r.Ue(),r.Oe||this.removeTarget(t);break;case 3:this.nt(t)&&(r.Ke(),r.Be(e.resumeToken));break;case 4:this.nt(t)&&(this.rt(t),r.Be(e.resumeToken));break;default:M(56790,{state:e.state})}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Ge.forEach((r,i)=>{this.nt(i)&&t(i)})}it(e){const t=e.targetId,r=e.De.count,i=this.st(t);if(i){const s=i.target;if(mo(s))if(r===0){const a=new L(s.path);this.Xe(t,a,Ae.newNoDocument(a,B.min()))}else Q(r===1,20013,{expectedCount:r});else{const a=this.ot(t);if(a!==r){const c=this._t(e),l=c?this.ut(c,e,a):1;if(l!==0){this.rt(t);const d=l===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.He=this.He.insert(t,d)}}}}}_t(e){const t=e.De.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:r="",padding:i=0},hashCount:s=0}=t;let a,c;try{a=Ut(r).toUint8Array()}catch(l){if(l instanceof zh)return Lt("Decoding the base64 bloom filter in existence filter failed ("+l.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw l}try{c=new ia(a,i,s)}catch(l){return Lt(l instanceof or?"BloomFilter error: ":"Applying bloom filter failed: ",l),null}return c.fe===0?null:c}ut(e,t,r){return t.De.count===r-this.ht(e,t.targetId)?0:2}ht(e,t){const r=this.We.getRemoteKeysForTarget(t);let i=0;return r.forEach(s=>{const a=this.We.lt(),c=`projects/${a.projectId}/databases/${a.database}/documents/${s.path.canonicalString()}`;e.mightContain(c)||(this.Xe(t,s,null),i++)}),i}Pt(e){const t=new Map;this.Ge.forEach((s,a)=>{const c=this.st(a);if(c){if(s.current&&mo(c.target)){const l=new L(c.target.path);this.Tt(l).has(a)||this.It(a,l)||this.Xe(a,l,Ae.newNoDocument(l,e))}s.Ne&&(t.set(a,s.Le()),s.ke())}});let r=G();this.Je.forEach((s,a)=>{let c=!0;a.forEachWhile(l=>{const d=this.st(l);return!d||d.purpose==="TargetPurposeLimboResolution"||(c=!1,!1)}),c&&(r=r.add(s))}),this.ze.forEach((s,a)=>a.setReadTime(e));const i=new is(e,t,this.He,this.ze,r);return this.ze=yt(),this.je=oi(),this.Je=oi(),this.He=new ne(q),i}Ze(e,t){if(!this.nt(e))return;const r=this.It(e,t.key)?2:0;this.tt(e).qe(t.key,r),this.ze=this.ze.insert(t.key,t),this.je=this.je.insert(t.key,this.Tt(t.key).add(e)),this.Je=this.Je.insert(t.key,this.dt(t.key).add(e))}Xe(e,t,r){if(!this.nt(e))return;const i=this.tt(e);this.It(e,t)?i.qe(t,1):i.Qe(t),this.Je=this.Je.insert(t,this.dt(t).delete(e)),this.Je=this.Je.insert(t,this.dt(t).add(e)),r&&(this.ze=this.ze.insert(t,r))}removeTarget(e){this.Ge.delete(e)}ot(e){const t=this.tt(e).Le();return this.We.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}$e(e){this.tt(e).$e()}tt(e){let t=this.Ge.get(e);return t||(t=new zu,this.Ge.set(e,t)),t}dt(e){let t=this.Je.get(e);return t||(t=new he(q),this.Je=this.Je.insert(e,t)),t}Tt(e){let t=this.je.get(e);return t||(t=new he(q),this.je=this.je.insert(e,t)),t}nt(e){const t=this.st(e)!==null;return t||O("WatchChangeAggregator","Detected inactive target",e),t}st(e){const t=this.Ge.get(e);return t&&t.Oe?null:this.We.Et(e)}rt(e){this.Ge.set(e,new zu),this.We.getRemoteKeysForTarget(e).forEach(t=>{this.Xe(e,t,null)})}It(e,t){return this.We.getRemoteKeysForTarget(e).has(t)}}function oi(){return new ne(L.comparator)}function Hu(){return new ne(L.comparator)}const Yy={asc:"ASCENDING",desc:"DESCENDING"},Zy={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},ev={and:"AND",or:"OR"};class tv{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function _o(n,e){return n.useProto3Json||Xi(e)?e:{value:e}}function Di(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Ed(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function nv(n,e){return Di(n,e.toTimestamp())}function Ze(n){return Q(!!n,49232),B.fromTimestamp(function(t){const r=xt(t);return new te(r.seconds,r.nanos)}(n))}function sa(n,e){return yo(n,e).canonicalString()}function yo(n,e){const t=function(i){return new Y(["projects",i.projectId,"databases",i.database])}(n).child("documents");return e===void 0?t:t.child(e)}function Id(n){const e=Y.fromString(n);return Q(Sd(e),10190,{key:e.toString()}),e}function vo(n,e){return sa(n.databaseId,e.path)}function Ws(n,e){const t=Id(e);if(t.get(1)!==n.databaseId.projectId)throw new V(S.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new V(S.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new L(Ad(t))}function wd(n,e){return sa(n.databaseId,e)}function rv(n){const e=Id(n);return e.length===4?Y.emptyPath():Ad(e)}function To(n){return new Y(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function Ad(n){return Q(n.length>4&&n.get(4)==="documents",29091,{key:n.toString()}),n.popFirst(5)}function Gu(n,e,t){return{name:vo(n,e),fields:t.value.mapValue.fields}}function iv(n,e){let t;if("targetChange"in e){e.targetChange;const r=function(d){return d==="NO_CHANGE"?0:d==="ADD"?1:d==="REMOVE"?2:d==="CURRENT"?3:d==="RESET"?4:M(39313,{state:d})}(e.targetChange.targetChangeType||"NO_CHANGE"),i=e.targetChange.targetIds||[],s=function(d,f){return d.useProto3Json?(Q(f===void 0||typeof f=="string",58123),_e.fromBase64String(f||"")):(Q(f===void 0||f instanceof Buffer||f instanceof Uint8Array,16193),_e.fromUint8Array(f||new Uint8Array))}(n,e.targetChange.resumeToken),a=e.targetChange.cause,c=a&&function(d){const f=d.code===void 0?S.UNKNOWN:yd(d.code);return new V(f,d.message||"")}(a);t=new Td(r,i,s,c||null)}else if("documentChange"in e){e.documentChange;const r=e.documentChange;r.document,r.document.name,r.document.updateTime;const i=Ws(n,r.document.name),s=Ze(r.document.updateTime),a=r.document.createTime?Ze(r.document.createTime):B.min(),c=new De({mapValue:{fields:r.document.fields}}),l=Ae.newFoundDocument(i,s,a,c),d=r.targetIds||[],f=r.removedTargetIds||[];t=new yi(d,f,l.key,l)}else if("documentDelete"in e){e.documentDelete;const r=e.documentDelete;r.document;const i=Ws(n,r.document),s=r.readTime?Ze(r.readTime):B.min(),a=Ae.newNoDocument(i,s),c=r.removedTargetIds||[];t=new yi([],c,a.key,a)}else if("documentRemove"in e){e.documentRemove;const r=e.documentRemove;r.document;const i=Ws(n,r.document),s=r.removedTargetIds||[];t=new yi([],s,i,null)}else{if(!("filter"in e))return M(11601,{At:e});{e.filter;const r=e.filter;r.targetId;const{count:i=0,unchangedNames:s}=r,a=new Ky(i,s),c=r.targetId;t=new vd(c,a)}}return t}function sv(n,e){let t;if(e instanceof Vr)t={update:Gu(n,e.key,e.value)};else if(e instanceof na)t={delete:vo(n,e.key)};else if(e instanceof qt)t={update:Gu(n,e.key,e.data),updateMask:pv(e.fieldMask)};else{if(!(e instanceof Hy))return M(16599,{Rt:e.type});t={verify:vo(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map(r=>function(s,a){const c=a.transform;if(c instanceof Ar)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(c instanceof Sn)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:c.elements}};if(c instanceof Rr)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:c.elements}};if(c instanceof br)return{fieldPath:a.field.canonicalString(),increment:c.Ee};throw M(20930,{transform:a.transform})}(0,r))),e.precondition.isNone||(t.currentDocument=function(i,s){return s.updateTime!==void 0?{updateTime:nv(i,s.updateTime)}:s.exists!==void 0?{exists:s.exists}:M(27497)}(n,e.precondition)),t}function ov(n,e){return n&&n.length>0?(Q(e!==void 0,14353),n.map(t=>function(i,s){let a=i.updateTime?Ze(i.updateTime):Ze(s);return a.isEqual(B.min())&&(a=Ze(s)),new $y(a,i.transformResults||[])}(t,e))):[]}function av(n,e){return{documents:[wd(n,e.path)]}}function cv(n,e){const t={structuredQuery:{}},r=e.path;let i;e.collectionGroup!==null?(i=r,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(i=r.popLast(),t.structuredQuery.from=[{collectionId:r.lastSegment()}]),t.parent=wd(n,i);const s=function(d){if(d.length!==0)return bd(Ke.create(d,"and"))}(e.filters);s&&(t.structuredQuery.where=s);const a=function(d){if(d.length!==0)return d.map(f=>function(_){return{field:_n(_.field),direction:hv(_.dir)}}(f))}(e.orderBy);a&&(t.structuredQuery.orderBy=a);const c=_o(n,e.limit);return c!==null&&(t.structuredQuery.limit=c),e.startAt&&(t.structuredQuery.startAt=function(d){return{before:d.inclusive,values:d.position}}(e.startAt)),e.endAt&&(t.structuredQuery.endAt=function(d){return{before:!d.inclusive,values:d.position}}(e.endAt)),{Vt:t,parent:i}}function uv(n){let e=rv(n.parent);const t=n.structuredQuery,r=t.from?t.from.length:0;let i=null;if(r>0){Q(r===1,65062);const f=t.from[0];f.allDescendants?i=f.collectionId:e=e.child(f.collectionId)}let s=[];t.where&&(s=function(m){const _=Rd(m);return _ instanceof Ke&&ed(_)?_.getFilters():[_]}(t.where));let a=[];t.orderBy&&(a=function(m){return m.map(_=>function(C){return new wr(yn(C.field),function(k){switch(k){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(C.direction))}(_))}(t.orderBy));let c=null;t.limit&&(c=function(m){let _;return _=typeof m=="object"?m.value:m,Xi(_)?null:_}(t.limit));let l=null;t.startAt&&(l=function(m){const _=!!m.before,R=m.values||[];return new ki(R,_)}(t.startAt));let d=null;return t.endAt&&(d=function(m){const _=!m.before,R=m.values||[];return new ki(R,_)}(t.endAt)),ky(e,i,a,s,c,"F",l,d)}function lv(n,e){const t=function(i){switch(i){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return M(28987,{purpose:i})}}(e.purpose);return t==null?null:{"goog-listen-tags":t}}function Rd(n){return n.unaryFilter!==void 0?function(t){switch(t.unaryFilter.op){case"IS_NAN":const r=yn(t.unaryFilter.field);return ue.create(r,"==",{doubleValue:NaN});case"IS_NULL":const i=yn(t.unaryFilter.field);return ue.create(i,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const s=yn(t.unaryFilter.field);return ue.create(s,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=yn(t.unaryFilter.field);return ue.create(a,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return M(61313);default:return M(60726)}}(n):n.fieldFilter!==void 0?function(t){return ue.create(yn(t.fieldFilter.field),function(i){switch(i){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return M(58110);default:return M(50506)}}(t.fieldFilter.op),t.fieldFilter.value)}(n):n.compositeFilter!==void 0?function(t){return Ke.create(t.compositeFilter.filters.map(r=>Rd(r)),function(i){switch(i){case"AND":return"and";case"OR":return"or";default:return M(1026)}}(t.compositeFilter.op))}(n):M(30097,{filter:n})}function hv(n){return Yy[n]}function dv(n){return Zy[n]}function fv(n){return ev[n]}function _n(n){return{fieldPath:n.canonicalString()}}function yn(n){return ge.fromServerFormat(n.fieldPath)}function bd(n){return n instanceof ue?function(t){if(t.op==="=="){if(Vu(t.value))return{unaryFilter:{field:_n(t.field),op:"IS_NAN"}};if(Du(t.value))return{unaryFilter:{field:_n(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(Vu(t.value))return{unaryFilter:{field:_n(t.field),op:"IS_NOT_NAN"}};if(Du(t.value))return{unaryFilter:{field:_n(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:_n(t.field),op:dv(t.op),value:t.value}}}(n):n instanceof Ke?function(t){const r=t.getFilters().map(i=>bd(i));return r.length===1?r[0]:{compositeFilter:{op:fv(t.op),filters:r}}}(n):M(54877,{filter:n})}function pv(n){const e=[];return n.fields.forEach(t=>e.push(t.canonicalString())),{fieldPaths:e}}function Sd(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
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
 */class Ct{constructor(e,t,r,i,s=B.min(),a=B.min(),c=_e.EMPTY_BYTE_STRING,l=null){this.target=e,this.targetId=t,this.purpose=r,this.sequenceNumber=i,this.snapshotVersion=s,this.lastLimboFreeSnapshotVersion=a,this.resumeToken=c,this.expectedCount=l}withSequenceNumber(e){return new Ct(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new Ct(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Ct(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Ct(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
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
 */class mv{constructor(e){this.gt=e}}function gv(n){const e=uv({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?Ni(e,e.limit,"L"):e}/**
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
 */class _v{constructor(){this.Dn=new yv}addToCollectionParentIndex(e,t){return this.Dn.add(t),P.resolve()}getCollectionParents(e,t){return P.resolve(this.Dn.getEntries(t))}addFieldIndex(e,t){return P.resolve()}deleteFieldIndex(e,t){return P.resolve()}deleteAllFieldIndexes(e){return P.resolve()}createTargetIndexes(e,t){return P.resolve()}getDocumentsMatchingTarget(e,t){return P.resolve(null)}getIndexType(e,t){return P.resolve(0)}getFieldIndexes(e,t){return P.resolve([])}getNextCollectionGroupToUpdate(e){return P.resolve(null)}getMinOffset(e,t){return P.resolve(Mt.min())}getMinOffsetFromCollectionGroup(e,t){return P.resolve(Mt.min())}updateCollectionGroup(e,t,r){return P.resolve()}updateIndexEntries(e,t){return P.resolve()}}class yv{constructor(){this.index={}}add(e){const t=e.lastSegment(),r=e.popLast(),i=this.index[t]||new he(Y.comparator),s=!i.has(r);return this.index[t]=i.add(r),s}has(e){const t=e.lastSegment(),r=e.popLast(),i=this.index[t];return i&&i.has(r)}getEntries(e){return(this.index[e]||new he(Y.comparator)).toArray()}}/**
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
 */const Wu={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},Pd=41943040;class ke{static withCacheSize(e){return new ke(e,ke.DEFAULT_COLLECTION_PERCENTILE,ke.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,r){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=r}}/**
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
 */ke.DEFAULT_COLLECTION_PERCENTILE=10,ke.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,ke.DEFAULT=new ke(Pd,ke.DEFAULT_COLLECTION_PERCENTILE,ke.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),ke.DISABLED=new ke(-1,0,0);/**
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
 */class Pn{constructor(e){this._r=e}next(){return this._r+=2,this._r}static ar(){return new Pn(0)}static ur(){return new Pn(-1)}}/**
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
 */const Ku="LruGarbageCollector",vv=1048576;function Qu([n,e],[t,r]){const i=q(n,t);return i===0?q(e,r):i}class Tv{constructor(e){this.Tr=e,this.buffer=new he(Qu),this.Ir=0}dr(){return++this.Ir}Er(e){const t=[e,this.dr()];if(this.buffer.size<this.Tr)this.buffer=this.buffer.add(t);else{const r=this.buffer.last();Qu(t,r)<0&&(this.buffer=this.buffer.delete(r).add(t))}}get maxValue(){return this.buffer.last()[0]}}class Ev{constructor(e,t,r){this.garbageCollector=e,this.asyncQueue=t,this.localStore=r,this.Ar=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Rr(6e4)}stop(){this.Ar&&(this.Ar.cancel(),this.Ar=null)}get started(){return this.Ar!==null}Rr(e){O(Ku,`Garbage collection scheduled in ${e}ms`),this.Ar=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,async()=>{this.Ar=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){Ln(t)?O(Ku,"Ignoring IndexedDB error during garbage collection: ",t):await On(t)}await this.Rr(3e5)})}}class Iv{constructor(e,t){this.Vr=e,this.params=t}calculateTargetCount(e,t){return this.Vr.mr(e).next(r=>Math.floor(t/100*r))}nthSequenceNumber(e,t){if(t===0)return P.resolve(Ji.ue);const r=new Tv(t);return this.Vr.forEachTarget(e,i=>r.Er(i.sequenceNumber)).next(()=>this.Vr.gr(e,i=>r.Er(i))).next(()=>r.maxValue)}removeTargets(e,t,r){return this.Vr.removeTargets(e,t,r)}removeOrphanedDocuments(e,t){return this.Vr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(O("LruGarbageCollector","Garbage collection skipped; disabled"),P.resolve(Wu)):this.getCacheSize(e).next(r=>r<this.params.cacheSizeCollectionThreshold?(O("LruGarbageCollector",`Garbage collection skipped; Cache size ${r} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),Wu):this.pr(e,t))}getCacheSize(e){return this.Vr.getCacheSize(e)}pr(e,t){let r,i,s,a,c,l,d;const f=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next(m=>(m>this.params.maximumSequenceNumbersToCollect?(O("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${m}`),i=this.params.maximumSequenceNumbersToCollect):i=m,a=Date.now(),this.nthSequenceNumber(e,i))).next(m=>(r=m,c=Date.now(),this.removeTargets(e,r,t))).next(m=>(s=m,l=Date.now(),this.removeOrphanedDocuments(e,r))).next(m=>(d=Date.now(),mn()<=H.DEBUG&&O("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${a-f}ms
	Determined least recently used ${i} in `+(c-a)+`ms
	Removed ${s} targets in `+(l-c)+`ms
	Removed ${m} documents in `+(d-l)+`ms
Total Duration: ${d-f}ms`),P.resolve({didRun:!0,sequenceNumbersCollected:i,targetsRemoved:s,documentsRemoved:m})))}}function wv(n,e){return new Iv(n,e)}/**
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
 */class Av{constructor(){this.changes=new un(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Ae.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const r=this.changes.get(t);return r!==void 0?P.resolve(r):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
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
 */class Rv{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
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
 */class bv{constructor(e,t,r,i){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=r,this.indexManager=i}getDocument(e,t){let r=null;return this.documentOverlayCache.getOverlay(e,t).next(i=>(r=i,this.remoteDocumentCache.getEntry(e,t))).next(i=>(r!==null&&fr(r.mutation,i,xe.empty(),te.now()),i))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(r=>this.getLocalViewOfDocuments(e,r,G()).next(()=>r))}getLocalViewOfDocuments(e,t,r=G()){const i=Jt();return this.populateOverlays(e,i,t).next(()=>this.computeViews(e,t,i,r).next(s=>{let a=sr();return s.forEach((c,l)=>{a=a.insert(c,l.overlayedDocument)}),a}))}getOverlayedDocuments(e,t){const r=Jt();return this.populateOverlays(e,r,t).next(()=>this.computeViews(e,t,r,G()))}populateOverlays(e,t,r){const i=[];return r.forEach(s=>{t.has(s)||i.push(s)}),this.documentOverlayCache.getOverlays(e,i).next(s=>{s.forEach((a,c)=>{t.set(a,c)})})}computeViews(e,t,r,i){let s=yt();const a=dr(),c=function(){return dr()}();return t.forEach((l,d)=>{const f=r.get(d.key);i.has(d.key)&&(f===void 0||f.mutation instanceof qt)?s=s.insert(d.key,d):f!==void 0?(a.set(d.key,f.mutation.getFieldMask()),fr(f.mutation,d,f.mutation.getFieldMask(),te.now())):a.set(d.key,xe.empty())}),this.recalculateAndSaveOverlays(e,s).next(l=>(l.forEach((d,f)=>a.set(d,f)),t.forEach((d,f)=>{var m;return c.set(d,new Rv(f,(m=a.get(d))!==null&&m!==void 0?m:null))}),c))}recalculateAndSaveOverlays(e,t){const r=dr();let i=new ne((a,c)=>a-c),s=G();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(a=>{for(const c of a)c.keys().forEach(l=>{const d=t.get(l);if(d===null)return;let f=r.get(l)||xe.empty();f=c.applyToLocalView(d,f),r.set(l,f);const m=(i.get(c.batchId)||G()).add(l);i=i.insert(c.batchId,m)})}).next(()=>{const a=[],c=i.getReverseIterator();for(;c.hasNext();){const l=c.getNext(),d=l.key,f=l.value,m=ud();f.forEach(_=>{if(!s.has(_)){const R=gd(t.get(_),r.get(_));R!==null&&m.set(_,R),s=s.add(_)}}),a.push(this.documentOverlayCache.saveOverlays(e,d,m))}return P.waitFor(a)}).next(()=>r)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(r=>this.recalculateAndSaveOverlays(e,r))}getDocumentsMatchingQuery(e,t,r,i){return function(a){return L.isDocumentKey(a.path)&&a.collectionGroup===null&&a.filters.length===0}(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):id(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,r,i):this.getDocumentsMatchingCollectionQuery(e,t,r,i)}getNextDocuments(e,t,r,i){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,r,i).next(s=>{const a=i-s.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,r.largestBatchId,i-s.size):P.resolve(Jt());let c=vr,l=s;return a.next(d=>P.forEach(d,(f,m)=>(c<m.largestBatchId&&(c=m.largestBatchId),s.get(f)?P.resolve():this.remoteDocumentCache.getEntry(e,f).next(_=>{l=l.insert(f,_)}))).next(()=>this.populateOverlays(e,d,s)).next(()=>this.computeViews(e,l,d,G())).next(f=>({batchId:c,changes:cd(f)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new L(t)).next(r=>{let i=sr();return r.isFoundDocument()&&(i=i.insert(r.key,r)),i})}getDocumentsMatchingCollectionGroupQuery(e,t,r,i){const s=t.collectionGroup;let a=sr();return this.indexManager.getCollectionParents(e,s).next(c=>P.forEach(c,l=>{const d=function(m,_){return new Mn(_,null,m.explicitOrderBy.slice(),m.filters.slice(),m.limit,m.limitType,m.startAt,m.endAt)}(t,l.child(s));return this.getDocumentsMatchingCollectionQuery(e,d,r,i).next(f=>{f.forEach((m,_)=>{a=a.insert(m,_)})})}).next(()=>a))}getDocumentsMatchingCollectionQuery(e,t,r,i){let s;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,r.largestBatchId).next(a=>(s=a,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,s,i))).next(a=>{s.forEach((l,d)=>{const f=d.getKey();a.get(f)===null&&(a=a.insert(f,Ae.newInvalidDocument(f)))});let c=sr();return a.forEach((l,d)=>{const f=s.get(l);f!==void 0&&fr(f.mutation,d,xe.empty(),te.now()),ts(t,d)&&(c=c.insert(l,d))}),c})}}/**
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
 */class Sv{constructor(e){this.serializer=e,this.Br=new Map,this.Lr=new Map}getBundleMetadata(e,t){return P.resolve(this.Br.get(t))}saveBundleMetadata(e,t){return this.Br.set(t.id,function(i){return{id:i.id,version:i.version,createTime:Ze(i.createTime)}}(t)),P.resolve()}getNamedQuery(e,t){return P.resolve(this.Lr.get(t))}saveNamedQuery(e,t){return this.Lr.set(t.name,function(i){return{name:i.name,query:gv(i.bundledQuery),readTime:Ze(i.readTime)}}(t)),P.resolve()}}/**
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
 */class Pv{constructor(){this.overlays=new ne(L.comparator),this.kr=new Map}getOverlay(e,t){return P.resolve(this.overlays.get(t))}getOverlays(e,t){const r=Jt();return P.forEach(t,i=>this.getOverlay(e,i).next(s=>{s!==null&&r.set(i,s)})).next(()=>r)}saveOverlays(e,t,r){return r.forEach((i,s)=>{this.wt(e,t,s)}),P.resolve()}removeOverlaysForBatchId(e,t,r){const i=this.kr.get(r);return i!==void 0&&(i.forEach(s=>this.overlays=this.overlays.remove(s)),this.kr.delete(r)),P.resolve()}getOverlaysForCollection(e,t,r){const i=Jt(),s=t.length+1,a=new L(t.child("")),c=this.overlays.getIteratorFrom(a);for(;c.hasNext();){const l=c.getNext().value,d=l.getKey();if(!t.isPrefixOf(d.path))break;d.path.length===s&&l.largestBatchId>r&&i.set(l.getKey(),l)}return P.resolve(i)}getOverlaysForCollectionGroup(e,t,r,i){let s=new ne((d,f)=>d-f);const a=this.overlays.getIterator();for(;a.hasNext();){const d=a.getNext().value;if(d.getKey().getCollectionGroup()===t&&d.largestBatchId>r){let f=s.get(d.largestBatchId);f===null&&(f=Jt(),s=s.insert(d.largestBatchId,f)),f.set(d.getKey(),d)}}const c=Jt(),l=s.getIterator();for(;l.hasNext()&&(l.getNext().value.forEach((d,f)=>c.set(d,f)),!(c.size()>=i)););return P.resolve(c)}wt(e,t,r){const i=this.overlays.get(r.key);if(i!==null){const a=this.kr.get(i.largestBatchId).delete(r.key);this.kr.set(i.largestBatchId,a)}this.overlays=this.overlays.insert(r.key,new Wy(t,r));let s=this.kr.get(t);s===void 0&&(s=G(),this.kr.set(t,s)),this.kr.set(t,s.add(r.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cv{constructor(){this.sessionToken=_e.EMPTY_BYTE_STRING}getSessionToken(e){return P.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,P.resolve()}}/**
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
 */class oa{constructor(){this.qr=new he(de.Qr),this.$r=new he(de.Ur)}isEmpty(){return this.qr.isEmpty()}addReference(e,t){const r=new de(e,t);this.qr=this.qr.add(r),this.$r=this.$r.add(r)}Kr(e,t){e.forEach(r=>this.addReference(r,t))}removeReference(e,t){this.Wr(new de(e,t))}Gr(e,t){e.forEach(r=>this.removeReference(r,t))}zr(e){const t=new L(new Y([])),r=new de(t,e),i=new de(t,e+1),s=[];return this.$r.forEachInRange([r,i],a=>{this.Wr(a),s.push(a.key)}),s}jr(){this.qr.forEach(e=>this.Wr(e))}Wr(e){this.qr=this.qr.delete(e),this.$r=this.$r.delete(e)}Jr(e){const t=new L(new Y([])),r=new de(t,e),i=new de(t,e+1);let s=G();return this.$r.forEachInRange([r,i],a=>{s=s.add(a.key)}),s}containsKey(e){const t=new de(e,0),r=this.qr.firstAfterOrEqual(t);return r!==null&&e.isEqual(r.key)}}class de{constructor(e,t){this.key=e,this.Hr=t}static Qr(e,t){return L.comparator(e.key,t.key)||q(e.Hr,t.Hr)}static Ur(e,t){return q(e.Hr,t.Hr)||L.comparator(e.key,t.key)}}/**
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
 */class kv{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.er=1,this.Yr=new he(de.Qr)}checkEmpty(e){return P.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,r,i){const s=this.er;this.er++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new Gy(s,t,r,i);this.mutationQueue.push(a);for(const c of i)this.Yr=this.Yr.add(new de(c.key,s)),this.indexManager.addToCollectionParentIndex(e,c.key.path.popLast());return P.resolve(a)}lookupMutationBatch(e,t){return P.resolve(this.Zr(t))}getNextMutationBatchAfterBatchId(e,t){const r=t+1,i=this.Xr(r),s=i<0?0:i;return P.resolve(this.mutationQueue.length>s?this.mutationQueue[s]:null)}getHighestUnacknowledgedBatchId(){return P.resolve(this.mutationQueue.length===0?Qo:this.er-1)}getAllMutationBatches(e){return P.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const r=new de(t,0),i=new de(t,Number.POSITIVE_INFINITY),s=[];return this.Yr.forEachInRange([r,i],a=>{const c=this.Zr(a.Hr);s.push(c)}),P.resolve(s)}getAllMutationBatchesAffectingDocumentKeys(e,t){let r=new he(q);return t.forEach(i=>{const s=new de(i,0),a=new de(i,Number.POSITIVE_INFINITY);this.Yr.forEachInRange([s,a],c=>{r=r.add(c.Hr)})}),P.resolve(this.ei(r))}getAllMutationBatchesAffectingQuery(e,t){const r=t.path,i=r.length+1;let s=r;L.isDocumentKey(s)||(s=s.child(""));const a=new de(new L(s),0);let c=new he(q);return this.Yr.forEachWhile(l=>{const d=l.key.path;return!!r.isPrefixOf(d)&&(d.length===i&&(c=c.add(l.Hr)),!0)},a),P.resolve(this.ei(c))}ei(e){const t=[];return e.forEach(r=>{const i=this.Zr(r);i!==null&&t.push(i)}),t}removeMutationBatch(e,t){Q(this.ti(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let r=this.Yr;return P.forEach(t.mutations,i=>{const s=new de(i.key,t.batchId);return r=r.delete(s),this.referenceDelegate.markPotentiallyOrphaned(e,i.key)}).next(()=>{this.Yr=r})}rr(e){}containsKey(e,t){const r=new de(t,0),i=this.Yr.firstAfterOrEqual(r);return P.resolve(t.isEqual(i&&i.key))}performConsistencyCheck(e){return this.mutationQueue.length,P.resolve()}ti(e,t){return this.Xr(e)}Xr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Zr(e){const t=this.Xr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
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
 */class Nv{constructor(e){this.ni=e,this.docs=function(){return new ne(L.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const r=t.key,i=this.docs.get(r),s=i?i.size:0,a=this.ni(t);return this.docs=this.docs.insert(r,{document:t.mutableCopy(),size:a}),this.size+=a-s,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const r=this.docs.get(t);return P.resolve(r?r.document.mutableCopy():Ae.newInvalidDocument(t))}getEntries(e,t){let r=yt();return t.forEach(i=>{const s=this.docs.get(i);r=r.insert(i,s?s.document.mutableCopy():Ae.newInvalidDocument(i))}),P.resolve(r)}getDocumentsMatchingQuery(e,t,r,i){let s=yt();const a=t.path,c=new L(a.child("__id-9223372036854775808__")),l=this.docs.getIteratorFrom(c);for(;l.hasNext();){const{key:d,value:{document:f}}=l.getNext();if(!a.isPrefixOf(d.path))break;d.path.length>a.length+1||cy(ay(f),r)<=0||(i.has(f.key)||ts(t,f))&&(s=s.insert(f.key,f.mutableCopy()))}return P.resolve(s)}getAllFromCollectionGroup(e,t,r,i){M(9500)}ri(e,t){return P.forEach(this.docs,r=>t(r))}newChangeBuffer(e){return new Dv(this)}getSize(e){return P.resolve(this.size)}}class Dv extends Av{constructor(e){super(),this.Or=e}applyChanges(e){const t=[];return this.changes.forEach((r,i)=>{i.isValidDocument()?t.push(this.Or.addEntry(e,i)):this.Or.removeEntry(r)}),P.waitFor(t)}getFromCache(e,t){return this.Or.getEntry(e,t)}getAllFromCache(e,t){return this.Or.getEntries(e,t)}}/**
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
 */class Vv{constructor(e){this.persistence=e,this.ii=new un(t=>Yo(t),Zo),this.lastRemoteSnapshotVersion=B.min(),this.highestTargetId=0,this.si=0,this.oi=new oa,this.targetCount=0,this._i=Pn.ar()}forEachTarget(e,t){return this.ii.forEach((r,i)=>t(i)),P.resolve()}getLastRemoteSnapshotVersion(e){return P.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return P.resolve(this.si)}allocateTargetId(e){return this.highestTargetId=this._i.next(),P.resolve(this.highestTargetId)}setTargetsMetadata(e,t,r){return r&&(this.lastRemoteSnapshotVersion=r),t>this.si&&(this.si=t),P.resolve()}hr(e){this.ii.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this._i=new Pn(t),this.highestTargetId=t),e.sequenceNumber>this.si&&(this.si=e.sequenceNumber)}addTargetData(e,t){return this.hr(t),this.targetCount+=1,P.resolve()}updateTargetData(e,t){return this.hr(t),P.resolve()}removeTargetData(e,t){return this.ii.delete(t.target),this.oi.zr(t.targetId),this.targetCount-=1,P.resolve()}removeTargets(e,t,r){let i=0;const s=[];return this.ii.forEach((a,c)=>{c.sequenceNumber<=t&&r.get(c.targetId)===null&&(this.ii.delete(a),s.push(this.removeMatchingKeysForTargetId(e,c.targetId)),i++)}),P.waitFor(s).next(()=>i)}getTargetCount(e){return P.resolve(this.targetCount)}getTargetData(e,t){const r=this.ii.get(t)||null;return P.resolve(r)}addMatchingKeys(e,t,r){return this.oi.Kr(t,r),P.resolve()}removeMatchingKeys(e,t,r){this.oi.Gr(t,r);const i=this.persistence.referenceDelegate,s=[];return i&&t.forEach(a=>{s.push(i.markPotentiallyOrphaned(e,a))}),P.waitFor(s)}removeMatchingKeysForTargetId(e,t){return this.oi.zr(t),P.resolve()}getMatchingKeysForTargetId(e,t){const r=this.oi.Jr(t);return P.resolve(r)}containsKey(e,t){return P.resolve(this.oi.containsKey(t))}}/**
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
 */class Cd{constructor(e,t){this.ai={},this.overlays={},this.ui=new Ji(0),this.ci=!1,this.ci=!0,this.li=new Cv,this.referenceDelegate=e(this),this.hi=new Vv(this),this.indexManager=new _v,this.remoteDocumentCache=function(i){return new Nv(i)}(r=>this.referenceDelegate.Pi(r)),this.serializer=new mv(t),this.Ti=new Sv(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ci=!1,Promise.resolve()}get started(){return this.ci}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new Pv,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let r=this.ai[e.toKey()];return r||(r=new kv(t,this.referenceDelegate),this.ai[e.toKey()]=r),r}getGlobalsCache(){return this.li}getTargetCache(){return this.hi}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ti}runTransaction(e,t,r){O("MemoryPersistence","Starting transaction:",e);const i=new Ov(this.ui.next());return this.referenceDelegate.Ii(),r(i).next(s=>this.referenceDelegate.di(i).next(()=>s)).toPromise().then(s=>(i.raiseOnCommittedEvent(),s))}Ei(e,t){return P.or(Object.values(this.ai).map(r=>()=>r.containsKey(e,t)))}}class Ov extends ly{constructor(e){super(),this.currentSequenceNumber=e}}class aa{constructor(e){this.persistence=e,this.Ai=new oa,this.Ri=null}static Vi(e){return new aa(e)}get mi(){if(this.Ri)return this.Ri;throw M(60996)}addReference(e,t,r){return this.Ai.addReference(r,t),this.mi.delete(r.toString()),P.resolve()}removeReference(e,t,r){return this.Ai.removeReference(r,t),this.mi.add(r.toString()),P.resolve()}markPotentiallyOrphaned(e,t){return this.mi.add(t.toString()),P.resolve()}removeTarget(e,t){this.Ai.zr(t.targetId).forEach(i=>this.mi.add(i.toString()));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,t.targetId).next(i=>{i.forEach(s=>this.mi.add(s.toString()))}).next(()=>r.removeTargetData(e,t))}Ii(){this.Ri=new Set}di(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return P.forEach(this.mi,r=>{const i=L.fromPath(r);return this.fi(e,i).next(s=>{s||t.removeEntry(i,B.min())})}).next(()=>(this.Ri=null,t.apply(e)))}updateLimboDocument(e,t){return this.fi(e,t).next(r=>{r?this.mi.delete(t.toString()):this.mi.add(t.toString())})}Pi(e){return 0}fi(e,t){return P.or([()=>P.resolve(this.Ai.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ei(e,t)])}}class Vi{constructor(e,t){this.persistence=e,this.gi=new un(r=>fy(r.path),(r,i)=>r.isEqual(i)),this.garbageCollector=wv(this,t)}static Vi(e,t){return new Vi(e,t)}Ii(){}di(e){return P.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}mr(e){const t=this.yr(e);return this.persistence.getTargetCache().getTargetCount(e).next(r=>t.next(i=>r+i))}yr(e){let t=0;return this.gr(e,r=>{t++}).next(()=>t)}gr(e,t){return P.forEach(this.gi,(r,i)=>this.Sr(e,r,i).next(s=>s?P.resolve():t(i)))}removeTargets(e,t,r){return this.persistence.getTargetCache().removeTargets(e,t,r)}removeOrphanedDocuments(e,t){let r=0;const i=this.persistence.getRemoteDocumentCache(),s=i.newChangeBuffer();return i.ri(e,a=>this.Sr(e,a,t).next(c=>{c||(r++,s.removeEntry(a,B.min()))})).next(()=>s.apply(e)).next(()=>r)}markPotentiallyOrphaned(e,t){return this.gi.set(t,e.currentSequenceNumber),P.resolve()}removeTarget(e,t){const r=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,r)}addReference(e,t,r){return this.gi.set(r,e.currentSequenceNumber),P.resolve()}removeReference(e,t,r){return this.gi.set(r,e.currentSequenceNumber),P.resolve()}updateLimboDocument(e,t){return this.gi.set(t,e.currentSequenceNumber),P.resolve()}Pi(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=mi(e.data.value)),t}Sr(e,t,r){return P.or([()=>this.persistence.Ei(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const i=this.gi.get(t);return P.resolve(i!==void 0&&i>r)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
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
 */class ca{constructor(e,t,r,i){this.targetId=e,this.fromCache=t,this.Is=r,this.ds=i}static Es(e,t){let r=G(),i=G();for(const s of t.docChanges)switch(s.type){case 0:r=r.add(s.doc.key);break;case 1:i=i.add(s.doc.key)}return new ca(e,t.fromCache,r,i)}}/**
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
 */class Lv{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
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
 */class Mv{constructor(){this.As=!1,this.Rs=!1,this.Vs=100,this.fs=function(){return Wp()?8:hy(be())>0?6:4}()}initialize(e,t){this.gs=e,this.indexManager=t,this.As=!0}getDocumentsMatchingQuery(e,t,r,i){const s={result:null};return this.ps(e,t).next(a=>{s.result=a}).next(()=>{if(!s.result)return this.ys(e,t,i,r).next(a=>{s.result=a})}).next(()=>{if(s.result)return;const a=new Lv;return this.ws(e,t,a).next(c=>{if(s.result=c,this.Rs)return this.Ss(e,t,a,c.size)})}).next(()=>s.result)}Ss(e,t,r,i){return r.documentReadCount<this.Vs?(mn()<=H.DEBUG&&O("QueryEngine","SDK will not create cache indexes for query:",gn(t),"since it only creates cache indexes for collection contains","more than or equal to",this.Vs,"documents"),P.resolve()):(mn()<=H.DEBUG&&O("QueryEngine","Query:",gn(t),"scans",r.documentReadCount,"local documents and returns",i,"documents as results."),r.documentReadCount>this.fs*i?(mn()<=H.DEBUG&&O("QueryEngine","The SDK decides to create cache indexes for query:",gn(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Ye(t))):P.resolve())}ps(e,t){if(xu(t))return P.resolve(null);let r=Ye(t);return this.indexManager.getIndexType(e,r).next(i=>i===0?null:(t.limit!==null&&i===1&&(t=Ni(t,null,"F"),r=Ye(t)),this.indexManager.getDocumentsMatchingTarget(e,r).next(s=>{const a=G(...s);return this.gs.getDocuments(e,a).next(c=>this.indexManager.getMinOffset(e,r).next(l=>{const d=this.bs(t,c);return this.Ds(t,d,a,l.readTime)?this.ps(e,Ni(t,null,"F")):this.vs(e,d,t,l)}))})))}ys(e,t,r,i){return xu(t)||i.isEqual(B.min())?P.resolve(null):this.gs.getDocuments(e,r).next(s=>{const a=this.bs(t,s);return this.Ds(t,a,r,i)?P.resolve(null):(mn()<=H.DEBUG&&O("QueryEngine","Re-using previous result from %s to execute query: %s",i.toString(),gn(t)),this.vs(e,a,t,oy(i,vr)).next(c=>c))})}bs(e,t){let r=new he(od(e));return t.forEach((i,s)=>{ts(e,s)&&(r=r.add(s))}),r}Ds(e,t,r,i){if(e.limit===null)return!1;if(r.size!==t.size)return!0;const s=e.limitType==="F"?t.last():t.first();return!!s&&(s.hasPendingWrites||s.version.compareTo(i)>0)}ws(e,t,r){return mn()<=H.DEBUG&&O("QueryEngine","Using full collection scan to execute query:",gn(t)),this.gs.getDocumentsMatchingQuery(e,t,Mt.min(),r)}vs(e,t,r,i){return this.gs.getDocumentsMatchingQuery(e,r,i).next(s=>(t.forEach(a=>{s=s.insert(a.key,a)}),s))}}/**
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
 */const ua="LocalStore",xv=3e8;class Uv{constructor(e,t,r,i){this.persistence=e,this.Cs=t,this.serializer=i,this.Fs=new ne(q),this.Ms=new un(s=>Yo(s),Zo),this.xs=new Map,this.Os=e.getRemoteDocumentCache(),this.hi=e.getTargetCache(),this.Ti=e.getBundleCache(),this.Ns(r)}Ns(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new bv(this.Os,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Os.setIndexManager(this.indexManager),this.Cs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.Fs))}}function Fv(n,e,t,r){return new Uv(n,e,t,r)}async function kd(n,e){const t=j(n);return await t.persistence.runTransaction("Handle user change","readonly",r=>{let i;return t.mutationQueue.getAllMutationBatches(r).next(s=>(i=s,t.Ns(e),t.mutationQueue.getAllMutationBatches(r))).next(s=>{const a=[],c=[];let l=G();for(const d of i){a.push(d.batchId);for(const f of d.mutations)l=l.add(f.key)}for(const d of s){c.push(d.batchId);for(const f of d.mutations)l=l.add(f.key)}return t.localDocuments.getDocuments(r,l).next(d=>({Bs:d,removedBatchIds:a,addedBatchIds:c}))})})}function Bv(n,e){const t=j(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",r=>{const i=e.batch.keys(),s=t.Os.newChangeBuffer({trackRemovals:!0});return function(c,l,d,f){const m=d.batch,_=m.keys();let R=P.resolve();return _.forEach(C=>{R=R.next(()=>f.getEntry(l,C)).next(D=>{const k=d.docVersions.get(C);Q(k!==null,48541),D.version.compareTo(k)<0&&(m.applyToRemoteDocument(D,d),D.isValidDocument()&&(D.setReadTime(d.commitVersion),f.addEntry(D)))})}),R.next(()=>c.mutationQueue.removeMutationBatch(l,m))}(t,r,e,s).next(()=>s.apply(r)).next(()=>t.mutationQueue.performConsistencyCheck(r)).next(()=>t.documentOverlayCache.removeOverlaysForBatchId(r,i,e.batch.batchId)).next(()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,function(c){let l=G();for(let d=0;d<c.mutationResults.length;++d)c.mutationResults[d].transformResults.length>0&&(l=l.add(c.batch.mutations[d].key));return l}(e))).next(()=>t.localDocuments.getDocuments(r,i))})}function Nd(n){const e=j(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.hi.getLastRemoteSnapshotVersion(t))}function jv(n,e){const t=j(n),r=e.snapshotVersion;let i=t.Fs;return t.persistence.runTransaction("Apply remote event","readwrite-primary",s=>{const a=t.Os.newChangeBuffer({trackRemovals:!0});i=t.Fs;const c=[];e.targetChanges.forEach((f,m)=>{const _=i.get(m);if(!_)return;c.push(t.hi.removeMatchingKeys(s,f.removedDocuments,m).next(()=>t.hi.addMatchingKeys(s,f.addedDocuments,m)));let R=_.withSequenceNumber(s.currentSequenceNumber);e.targetMismatches.get(m)!==null?R=R.withResumeToken(_e.EMPTY_BYTE_STRING,B.min()).withLastLimboFreeSnapshotVersion(B.min()):f.resumeToken.approximateByteSize()>0&&(R=R.withResumeToken(f.resumeToken,r)),i=i.insert(m,R),function(D,k,$){return D.resumeToken.approximateByteSize()===0||k.snapshotVersion.toMicroseconds()-D.snapshotVersion.toMicroseconds()>=xv?!0:$.addedDocuments.size+$.modifiedDocuments.size+$.removedDocuments.size>0}(_,R,f)&&c.push(t.hi.updateTargetData(s,R))});let l=yt(),d=G();if(e.documentUpdates.forEach(f=>{e.resolvedLimboDocuments.has(f)&&c.push(t.persistence.referenceDelegate.updateLimboDocument(s,f))}),c.push($v(s,a,e.documentUpdates).next(f=>{l=f.Ls,d=f.ks})),!r.isEqual(B.min())){const f=t.hi.getLastRemoteSnapshotVersion(s).next(m=>t.hi.setTargetsMetadata(s,s.currentSequenceNumber,r));c.push(f)}return P.waitFor(c).next(()=>a.apply(s)).next(()=>t.localDocuments.getLocalViewOfDocuments(s,l,d)).next(()=>l)}).then(s=>(t.Fs=i,s))}function $v(n,e,t){let r=G(),i=G();return t.forEach(s=>r=r.add(s)),e.getEntries(n,r).next(s=>{let a=yt();return t.forEach((c,l)=>{const d=s.get(c);l.isFoundDocument()!==d.isFoundDocument()&&(i=i.add(c)),l.isNoDocument()&&l.version.isEqual(B.min())?(e.removeEntry(c,l.readTime),a=a.insert(c,l)):!d.isValidDocument()||l.version.compareTo(d.version)>0||l.version.compareTo(d.version)===0&&d.hasPendingWrites?(e.addEntry(l),a=a.insert(c,l)):O(ua,"Ignoring outdated watch update for ",c,". Current version:",d.version," Watch version:",l.version)}),{Ls:a,ks:i}})}function qv(n,e){const t=j(n);return t.persistence.runTransaction("Get next mutation batch","readonly",r=>(e===void 0&&(e=Qo),t.mutationQueue.getNextMutationBatchAfterBatchId(r,e)))}function zv(n,e){const t=j(n);return t.persistence.runTransaction("Allocate target","readwrite",r=>{let i;return t.hi.getTargetData(r,e).next(s=>s?(i=s,P.resolve(i)):t.hi.allocateTargetId(r).next(a=>(i=new Ct(e,a,"TargetPurposeListen",r.currentSequenceNumber),t.hi.addTargetData(r,i).next(()=>i))))}).then(r=>{const i=t.Fs.get(r.targetId);return(i===null||r.snapshotVersion.compareTo(i.snapshotVersion)>0)&&(t.Fs=t.Fs.insert(r.targetId,r),t.Ms.set(e,r.targetId)),r})}async function Eo(n,e,t){const r=j(n),i=r.Fs.get(e),s=t?"readwrite":"readwrite-primary";try{t||await r.persistence.runTransaction("Release target",s,a=>r.persistence.referenceDelegate.removeTarget(a,i))}catch(a){if(!Ln(a))throw a;O(ua,`Failed to update sequence numbers for target ${e}: ${a}`)}r.Fs=r.Fs.remove(e),r.Ms.delete(i.target)}function Ju(n,e,t){const r=j(n);let i=B.min(),s=G();return r.persistence.runTransaction("Execute query","readwrite",a=>function(l,d,f){const m=j(l),_=m.Ms.get(f);return _!==void 0?P.resolve(m.Fs.get(_)):m.hi.getTargetData(d,f)}(r,a,Ye(e)).next(c=>{if(c)return i=c.lastLimboFreeSnapshotVersion,r.hi.getMatchingKeysForTargetId(a,c.targetId).next(l=>{s=l})}).next(()=>r.Cs.getDocumentsMatchingQuery(a,e,t?i:B.min(),t?s:G())).next(c=>(Hv(r,Dy(e),c),{documents:c,qs:s})))}function Hv(n,e,t){let r=n.xs.get(e)||B.min();t.forEach((i,s)=>{s.readTime.compareTo(r)>0&&(r=s.readTime)}),n.xs.set(e,r)}class Xu{constructor(){this.activeTargetIds=Uy()}Gs(e){this.activeTargetIds=this.activeTargetIds.add(e)}zs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Ws(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class Gv{constructor(){this.Fo=new Xu,this.Mo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,r){}addLocalQueryTarget(e,t=!0){return t&&this.Fo.Gs(e),this.Mo[e]||"not-current"}updateQueryState(e,t,r){this.Mo[e]=t}removeLocalQueryTarget(e){this.Fo.zs(e)}isLocalQueryTarget(e){return this.Fo.activeTargetIds.has(e)}clearQueryState(e){delete this.Mo[e]}getAllActiveQueryTargets(){return this.Fo.activeTargetIds}isActiveQueryTarget(e){return this.Fo.activeTargetIds.has(e)}start(){return this.Fo=new Xu,Promise.resolve()}handleUserChange(e,t,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
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
 */class Wv{xo(e){}shutdown(){}}/**
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
 */const Yu="ConnectivityMonitor";class Zu{constructor(){this.Oo=()=>this.No(),this.Bo=()=>this.Lo(),this.ko=[],this.qo()}xo(e){this.ko.push(e)}shutdown(){window.removeEventListener("online",this.Oo),window.removeEventListener("offline",this.Bo)}qo(){window.addEventListener("online",this.Oo),window.addEventListener("offline",this.Bo)}No(){O(Yu,"Network connectivity changed: AVAILABLE");for(const e of this.ko)e(0)}Lo(){O(Yu,"Network connectivity changed: UNAVAILABLE");for(const e of this.ko)e(1)}static C(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let ai=null;function Io(){return ai===null?ai=function(){return 268435456+Math.round(2147483648*Math.random())}():ai++,"0x"+ai.toString(16)}/**
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
 */const Ks="RestConnection",Kv={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class Qv{get Qo(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.$o=t+"://"+e.host,this.Uo=`projects/${r}/databases/${i}`,this.Ko=this.databaseId.database===Pi?`project_id=${r}`:`project_id=${r}&database_id=${i}`}Wo(e,t,r,i,s){const a=Io(),c=this.Go(e,t.toUriEncodedString());O(Ks,`Sending RPC '${e}' ${a}:`,c,r);const l={"google-cloud-resource-prefix":this.Uo,"x-goog-request-params":this.Ko};this.zo(l,i,s);const{host:d}=new URL(c),f=Tt(d);return this.jo(e,c,l,r,f).then(m=>(O(Ks,`Received RPC '${e}' ${a}: `,m),m),m=>{throw Lt(Ks,`RPC '${e}' ${a} failed with error: `,m,"url: ",c,"request:",r),m})}Jo(e,t,r,i,s,a){return this.Wo(e,t,r,i,s)}zo(e,t,r){e["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+Vn}(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach((i,s)=>e[s]=i),r&&r.headers.forEach((i,s)=>e[s]=i)}Go(e,t){const r=Kv[e];return`${this.$o}/v1/${t}:${r}`}terminate(){}}/**
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
 */class Jv{constructor(e){this.Ho=e.Ho,this.Yo=e.Yo}Zo(e){this.Xo=e}e_(e){this.t_=e}n_(e){this.r_=e}onMessage(e){this.i_=e}close(){this.Yo()}send(e){this.Ho(e)}s_(){this.Xo()}o_(){this.t_()}__(e){this.r_(e)}a_(e){this.i_(e)}}/**
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
 */const Ie="WebChannelConnection";class Xv extends Qv{constructor(e){super(e),this.u_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}jo(e,t,r,i,s){const a=Io();return new Promise((c,l)=>{const d=new Dh;d.setWithCredentials(!0),d.listenOnce(Vh.COMPLETE,()=>{try{switch(d.getLastErrorCode()){case pi.NO_ERROR:const m=d.getResponseJson();O(Ie,`XHR for RPC '${e}' ${a} received:`,JSON.stringify(m)),c(m);break;case pi.TIMEOUT:O(Ie,`RPC '${e}' ${a} timed out`),l(new V(S.DEADLINE_EXCEEDED,"Request time out"));break;case pi.HTTP_ERROR:const _=d.getStatus();if(O(Ie,`RPC '${e}' ${a} failed with status:`,_,"response text:",d.getResponseText()),_>0){let R=d.getResponseJson();Array.isArray(R)&&(R=R[0]);const C=R==null?void 0:R.error;if(C&&C.status&&C.message){const D=function($){const x=$.toLowerCase().replace(/_/g,"-");return Object.values(S).indexOf(x)>=0?x:S.UNKNOWN}(C.status);l(new V(D,C.message))}else l(new V(S.UNKNOWN,"Server responded with status "+d.getStatus()))}else l(new V(S.UNAVAILABLE,"Connection failed."));break;default:M(9055,{c_:e,streamId:a,l_:d.getLastErrorCode(),h_:d.getLastError()})}}finally{O(Ie,`RPC '${e}' ${a} completed.`)}});const f=JSON.stringify(i);O(Ie,`RPC '${e}' ${a} sending request:`,i),d.send(t,"POST",f,r,15)})}P_(e,t,r){const i=Io(),s=[this.$o,"/","google.firestore.v1.Firestore","/",e,"/channel"],a=Mh(),c=Lh(),l={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},d=this.longPollingOptions.timeoutSeconds;d!==void 0&&(l.longPollingTimeout=Math.round(1e3*d)),this.useFetchStreams&&(l.useFetchStreams=!0),this.zo(l.initMessageHeaders,t,r),l.encodeInitMessageHeaders=!0;const f=s.join("");O(Ie,`Creating RPC '${e}' stream ${i}: ${f}`,l);const m=a.createWebChannel(f,l);this.T_(m);let _=!1,R=!1;const C=new Jv({Ho:k=>{R?O(Ie,`Not sending because RPC '${e}' stream ${i} is closed:`,k):(_||(O(Ie,`Opening RPC '${e}' stream ${i} transport.`),m.open(),_=!0),O(Ie,`RPC '${e}' stream ${i} sending:`,k),m.send(k))},Yo:()=>m.close()}),D=(k,$,x)=>{k.listen($,U=>{try{x(U)}catch(z){setTimeout(()=>{throw z},0)}})};return D(m,ir.EventType.OPEN,()=>{R||(O(Ie,`RPC '${e}' stream ${i} transport opened.`),C.s_())}),D(m,ir.EventType.CLOSE,()=>{R||(R=!0,O(Ie,`RPC '${e}' stream ${i} transport closed`),C.__(),this.I_(m))}),D(m,ir.EventType.ERROR,k=>{R||(R=!0,Lt(Ie,`RPC '${e}' stream ${i} transport errored. Name:`,k.name,"Message:",k.message),C.__(new V(S.UNAVAILABLE,"The operation could not be completed")))}),D(m,ir.EventType.MESSAGE,k=>{var $;if(!R){const x=k.data[0];Q(!!x,16349);const U=x,z=(U==null?void 0:U.error)||(($=U[0])===null||$===void 0?void 0:$.error);if(z){O(Ie,`RPC '${e}' stream ${i} received error:`,z);const fe=z.status;let Z=function(v){const T=ce[v];if(T!==void 0)return yd(T)}(fe),E=z.message;Z===void 0&&(Z=S.INTERNAL,E="Unknown error status: "+fe+" with message "+z.message),R=!0,C.__(new V(Z,E)),m.close()}else O(Ie,`RPC '${e}' stream ${i} received:`,x),C.a_(x)}}),D(c,Oh.STAT_EVENT,k=>{k.stat===uo.PROXY?O(Ie,`RPC '${e}' stream ${i} detected buffering proxy`):k.stat===uo.NOPROXY&&O(Ie,`RPC '${e}' stream ${i} detected no buffering proxy`)}),setTimeout(()=>{C.o_()},0),C}terminate(){this.u_.forEach(e=>e.close()),this.u_=[]}T_(e){this.u_.push(e)}I_(e){this.u_=this.u_.filter(t=>t===e)}}function Qs(){return typeof document<"u"?document:null}/**
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
 */function ss(n){return new tv(n,!0)}/**
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
 */class Dd{constructor(e,t,r=1e3,i=1.5,s=6e4){this.Fi=e,this.timerId=t,this.d_=r,this.E_=i,this.A_=s,this.R_=0,this.V_=null,this.m_=Date.now(),this.reset()}reset(){this.R_=0}f_(){this.R_=this.A_}g_(e){this.cancel();const t=Math.floor(this.R_+this.p_()),r=Math.max(0,Date.now()-this.m_),i=Math.max(0,t-r);i>0&&O("ExponentialBackoff",`Backing off for ${i} ms (base delay: ${this.R_} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`),this.V_=this.Fi.enqueueAfterDelay(this.timerId,i,()=>(this.m_=Date.now(),e())),this.R_*=this.E_,this.R_<this.d_&&(this.R_=this.d_),this.R_>this.A_&&(this.R_=this.A_)}y_(){this.V_!==null&&(this.V_.skipDelay(),this.V_=null)}cancel(){this.V_!==null&&(this.V_.cancel(),this.V_=null)}p_(){return(Math.random()-.5)*this.R_}}/**
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
 */const el="PersistentStream";class Vd{constructor(e,t,r,i,s,a,c,l){this.Fi=e,this.w_=r,this.S_=i,this.connection=s,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=c,this.listener=l,this.state=0,this.b_=0,this.D_=null,this.v_=null,this.stream=null,this.C_=0,this.F_=new Dd(e,t)}M_(){return this.state===1||this.state===5||this.x_()}x_(){return this.state===2||this.state===3}start(){this.C_=0,this.state!==4?this.auth():this.O_()}async stop(){this.M_()&&await this.close(0)}N_(){this.state=0,this.F_.reset()}B_(){this.x_()&&this.D_===null&&(this.D_=this.Fi.enqueueAfterDelay(this.w_,6e4,()=>this.L_()))}k_(e){this.q_(),this.stream.send(e)}async L_(){if(this.x_())return this.close(0)}q_(){this.D_&&(this.D_.cancel(),this.D_=null)}Q_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,t){this.q_(),this.Q_(),this.F_.cancel(),this.b_++,e!==4?this.F_.reset():t&&t.code===S.RESOURCE_EXHAUSTED?(_t(t.toString()),_t("Using maximum backoff delay to prevent overloading the backend."),this.F_.f_()):t&&t.code===S.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.U_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.n_(t)}U_(){}auth(){this.state=1;const e=this.K_(this.b_),t=this.b_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([r,i])=>{this.b_===t&&this.W_(r,i)},r=>{e(()=>{const i=new V(S.UNKNOWN,"Fetching auth token failed: "+r.message);return this.G_(i)})})}W_(e,t){const r=this.K_(this.b_);this.stream=this.z_(e,t),this.stream.Zo(()=>{r(()=>this.listener.Zo())}),this.stream.e_(()=>{r(()=>(this.state=2,this.v_=this.Fi.enqueueAfterDelay(this.S_,1e4,()=>(this.x_()&&(this.state=3),Promise.resolve())),this.listener.e_()))}),this.stream.n_(i=>{r(()=>this.G_(i))}),this.stream.onMessage(i=>{r(()=>++this.C_==1?this.j_(i):this.onNext(i))})}O_(){this.state=5,this.F_.g_(async()=>{this.state=0,this.start()})}G_(e){return O(el,`close with error: ${e}`),this.stream=null,this.close(4,e)}K_(e){return t=>{this.Fi.enqueueAndForget(()=>this.b_===e?t():(O(el,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class Yv extends Vd{constructor(e,t,r,i,s,a){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,r,i,a),this.serializer=s}z_(e,t){return this.connection.P_("Listen",e,t)}j_(e){return this.onNext(e)}onNext(e){this.F_.reset();const t=iv(this.serializer,e),r=function(s){if(!("targetChange"in s))return B.min();const a=s.targetChange;return a.targetIds&&a.targetIds.length?B.min():a.readTime?Ze(a.readTime):B.min()}(e);return this.listener.J_(t,r)}H_(e){const t={};t.database=To(this.serializer),t.addTarget=function(s,a){let c;const l=a.target;if(c=mo(l)?{documents:av(s,l)}:{query:cv(s,l).Vt},c.targetId=a.targetId,a.resumeToken.approximateByteSize()>0){c.resumeToken=Ed(s,a.resumeToken);const d=_o(s,a.expectedCount);d!==null&&(c.expectedCount=d)}else if(a.snapshotVersion.compareTo(B.min())>0){c.readTime=Di(s,a.snapshotVersion.toTimestamp());const d=_o(s,a.expectedCount);d!==null&&(c.expectedCount=d)}return c}(this.serializer,e);const r=lv(this.serializer,e);r&&(t.labels=r),this.k_(t)}Y_(e){const t={};t.database=To(this.serializer),t.removeTarget=e,this.k_(t)}}class Zv extends Vd{constructor(e,t,r,i,s,a){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,r,i,a),this.serializer=s}get Z_(){return this.C_>0}start(){this.lastStreamToken=void 0,super.start()}U_(){this.Z_&&this.X_([])}z_(e,t){return this.connection.P_("Write",e,t)}j_(e){return Q(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,Q(!e.writeResults||e.writeResults.length===0,55816),this.listener.ea()}onNext(e){Q(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.F_.reset();const t=ov(e.writeResults,e.commitTime),r=Ze(e.commitTime);return this.listener.ta(r,t)}na(){const e={};e.database=To(this.serializer),this.k_(e)}X_(e){const t={streamToken:this.lastStreamToken,writes:e.map(r=>sv(this.serializer,r))};this.k_(t)}}/**
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
 */class eT{}class tT extends eT{constructor(e,t,r,i){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=r,this.serializer=i,this.ra=!1}ia(){if(this.ra)throw new V(S.FAILED_PRECONDITION,"The client has already been terminated.")}Wo(e,t,r,i){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,a])=>this.connection.Wo(e,yo(t,r),i,s,a)).catch(s=>{throw s.name==="FirebaseError"?(s.code===S.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),s):new V(S.UNKNOWN,s.toString())})}Jo(e,t,r,i,s){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([a,c])=>this.connection.Jo(e,yo(t,r),i,a,c,s)).catch(a=>{throw a.name==="FirebaseError"?(a.code===S.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new V(S.UNKNOWN,a.toString())})}terminate(){this.ra=!0,this.connection.terminate()}}class nT{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.sa=0,this.oa=null,this._a=!0}aa(){this.sa===0&&(this.ua("Unknown"),this.oa=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.oa=null,this.ca("Backend didn't respond within 10 seconds."),this.ua("Offline"),Promise.resolve())))}la(e){this.state==="Online"?this.ua("Unknown"):(this.sa++,this.sa>=1&&(this.ha(),this.ca(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ua("Offline")))}set(e){this.ha(),this.sa=0,e==="Online"&&(this._a=!1),this.ua(e)}ua(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}ca(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this._a?(_t(t),this._a=!1):O("OnlineStateTracker",t)}ha(){this.oa!==null&&(this.oa.cancel(),this.oa=null)}}/**
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
 */const nn="RemoteStore";class rT{constructor(e,t,r,i,s){this.localStore=e,this.datastore=t,this.asyncQueue=r,this.remoteSyncer={},this.Pa=[],this.Ta=new Map,this.Ia=new Set,this.da=[],this.Ea=s,this.Ea.xo(a=>{r.enqueueAndForget(async()=>{ln(this)&&(O(nn,"Restarting streams for network reachability change."),await async function(l){const d=j(l);d.Ia.add(4),await Lr(d),d.Aa.set("Unknown"),d.Ia.delete(4),await os(d)}(this))})}),this.Aa=new nT(r,i)}}async function os(n){if(ln(n))for(const e of n.da)await e(!0)}async function Lr(n){for(const e of n.da)await e(!1)}function Od(n,e){const t=j(n);t.Ta.has(e.targetId)||(t.Ta.set(e.targetId,e),fa(t)?da(t):xn(t).x_()&&ha(t,e))}function la(n,e){const t=j(n),r=xn(t);t.Ta.delete(e),r.x_()&&Ld(t,e),t.Ta.size===0&&(r.x_()?r.B_():ln(t)&&t.Aa.set("Unknown"))}function ha(n,e){if(n.Ra.$e(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(B.min())>0){const t=n.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}xn(n).H_(e)}function Ld(n,e){n.Ra.$e(e),xn(n).Y_(e)}function da(n){n.Ra=new Xy({getRemoteKeysForTarget:e=>n.remoteSyncer.getRemoteKeysForTarget(e),Et:e=>n.Ta.get(e)||null,lt:()=>n.datastore.serializer.databaseId}),xn(n).start(),n.Aa.aa()}function fa(n){return ln(n)&&!xn(n).M_()&&n.Ta.size>0}function ln(n){return j(n).Ia.size===0}function Md(n){n.Ra=void 0}async function iT(n){n.Aa.set("Online")}async function sT(n){n.Ta.forEach((e,t)=>{ha(n,e)})}async function oT(n,e){Md(n),fa(n)?(n.Aa.la(e),da(n)):n.Aa.set("Unknown")}async function aT(n,e,t){if(n.Aa.set("Online"),e instanceof Td&&e.state===2&&e.cause)try{await async function(i,s){const a=s.cause;for(const c of s.targetIds)i.Ta.has(c)&&(await i.remoteSyncer.rejectListen(c,a),i.Ta.delete(c),i.Ra.removeTarget(c))}(n,e)}catch(r){O(nn,"Failed to remove targets %s: %s ",e.targetIds.join(","),r),await Oi(n,r)}else if(e instanceof yi?n.Ra.Ye(e):e instanceof vd?n.Ra.it(e):n.Ra.et(e),!t.isEqual(B.min()))try{const r=await Nd(n.localStore);t.compareTo(r)>=0&&await function(s,a){const c=s.Ra.Pt(a);return c.targetChanges.forEach((l,d)=>{if(l.resumeToken.approximateByteSize()>0){const f=s.Ta.get(d);f&&s.Ta.set(d,f.withResumeToken(l.resumeToken,a))}}),c.targetMismatches.forEach((l,d)=>{const f=s.Ta.get(l);if(!f)return;s.Ta.set(l,f.withResumeToken(_e.EMPTY_BYTE_STRING,f.snapshotVersion)),Ld(s,l);const m=new Ct(f.target,l,d,f.sequenceNumber);ha(s,m)}),s.remoteSyncer.applyRemoteEvent(c)}(n,t)}catch(r){O(nn,"Failed to raise snapshot:",r),await Oi(n,r)}}async function Oi(n,e,t){if(!Ln(e))throw e;n.Ia.add(1),await Lr(n),n.Aa.set("Offline"),t||(t=()=>Nd(n.localStore)),n.asyncQueue.enqueueRetryable(async()=>{O(nn,"Retrying IndexedDB access"),await t(),n.Ia.delete(1),await os(n)})}function xd(n,e){return e().catch(t=>Oi(n,t,e))}async function as(n){const e=j(n),t=Bt(e);let r=e.Pa.length>0?e.Pa[e.Pa.length-1].batchId:Qo;for(;cT(e);)try{const i=await qv(e.localStore,r);if(i===null){e.Pa.length===0&&t.B_();break}r=i.batchId,uT(e,i)}catch(i){await Oi(e,i)}Ud(e)&&Fd(e)}function cT(n){return ln(n)&&n.Pa.length<10}function uT(n,e){n.Pa.push(e);const t=Bt(n);t.x_()&&t.Z_&&t.X_(e.mutations)}function Ud(n){return ln(n)&&!Bt(n).M_()&&n.Pa.length>0}function Fd(n){Bt(n).start()}async function lT(n){Bt(n).na()}async function hT(n){const e=Bt(n);for(const t of n.Pa)e.X_(t.mutations)}async function dT(n,e,t){const r=n.Pa.shift(),i=ra.from(r,e,t);await xd(n,()=>n.remoteSyncer.applySuccessfulWrite(i)),await as(n)}async function fT(n,e){e&&Bt(n).Z_&&await async function(r,i){if(function(a){return Qy(a)&&a!==S.ABORTED}(i.code)){const s=r.Pa.shift();Bt(r).N_(),await xd(r,()=>r.remoteSyncer.rejectFailedWrite(s.batchId,i)),await as(r)}}(n,e),Ud(n)&&Fd(n)}async function tl(n,e){const t=j(n);t.asyncQueue.verifyOperationInProgress(),O(nn,"RemoteStore received new credentials");const r=ln(t);t.Ia.add(3),await Lr(t),r&&t.Aa.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.Ia.delete(3),await os(t)}async function pT(n,e){const t=j(n);e?(t.Ia.delete(2),await os(t)):e||(t.Ia.add(2),await Lr(t),t.Aa.set("Unknown"))}function xn(n){return n.Va||(n.Va=function(t,r,i){const s=j(t);return s.ia(),new Yv(r,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)}(n.datastore,n.asyncQueue,{Zo:iT.bind(null,n),e_:sT.bind(null,n),n_:oT.bind(null,n),J_:aT.bind(null,n)}),n.da.push(async e=>{e?(n.Va.N_(),fa(n)?da(n):n.Aa.set("Unknown")):(await n.Va.stop(),Md(n))})),n.Va}function Bt(n){return n.ma||(n.ma=function(t,r,i){const s=j(t);return s.ia(),new Zv(r,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)}(n.datastore,n.asyncQueue,{Zo:()=>Promise.resolve(),e_:lT.bind(null,n),n_:fT.bind(null,n),ea:hT.bind(null,n),ta:dT.bind(null,n)}),n.da.push(async e=>{e?(n.ma.N_(),await as(n)):(await n.ma.stop(),n.Pa.length>0&&(O(nn,`Stopping write stream with ${n.Pa.length} pending writes`),n.Pa=[]))})),n.ma}/**
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
 */class pa{constructor(e,t,r,i,s){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=i,this.removalCallback=s,this.deferred=new ft,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(a=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,i,s){const a=Date.now()+r,c=new pa(e,t,a,i,s);return c.start(r),c}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new V(S.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function ma(n,e){if(_t("AsyncQueue",`${e}: ${n}`),Ln(n))return new V(S.UNAVAILABLE,`${e}: ${n}`);throw n}/**
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
 */class In{static emptySet(e){return new In(e.comparator)}constructor(e){this.comparator=e?(t,r)=>e(t,r)||L.comparator(t.key,r.key):(t,r)=>L.comparator(t.key,r.key),this.keyedMap=sr(),this.sortedSet=new ne(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,r)=>(e(t),!1))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof In)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;t.hasNext();){const i=t.getNext().key,s=r.getNext().key;if(!i.isEqual(s))return!1}return!0}toString(){const e=[];return this.forEach(t=>{e.push(t.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const r=new In;return r.comparator=this.comparator,r.keyedMap=e,r.sortedSet=t,r}}/**
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
 */class nl{constructor(){this.fa=new ne(L.comparator)}track(e){const t=e.doc.key,r=this.fa.get(t);r?e.type!==0&&r.type===3?this.fa=this.fa.insert(t,e):e.type===3&&r.type!==1?this.fa=this.fa.insert(t,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.fa=this.fa.insert(t,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.fa=this.fa.insert(t,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.fa=this.fa.remove(t):e.type===1&&r.type===2?this.fa=this.fa.insert(t,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.fa=this.fa.insert(t,{type:2,doc:e.doc}):M(63341,{At:e,ga:r}):this.fa=this.fa.insert(t,e)}pa(){const e=[];return this.fa.inorderTraversal((t,r)=>{e.push(r)}),e}}class Cn{constructor(e,t,r,i,s,a,c,l,d){this.query=e,this.docs=t,this.oldDocs=r,this.docChanges=i,this.mutatedKeys=s,this.fromCache=a,this.syncStateChanged=c,this.excludesMetadataChanges=l,this.hasCachedResults=d}static fromInitialDocuments(e,t,r,i,s){const a=[];return t.forEach(c=>{a.push({type:0,doc:c})}),new Cn(e,t,In.emptySet(t),a,r,i,!0,!1,s)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&es(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,r=e.docChanges;if(t.length!==r.length)return!1;for(let i=0;i<t.length;i++)if(t[i].type!==r[i].type||!t[i].doc.isEqual(r[i].doc))return!1;return!0}}/**
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
 */class mT{constructor(){this.ya=void 0,this.wa=[]}Sa(){return this.wa.some(e=>e.ba())}}class gT{constructor(){this.queries=rl(),this.onlineState="Unknown",this.Da=new Set}terminate(){(function(t,r){const i=j(t),s=i.queries;i.queries=rl(),s.forEach((a,c)=>{for(const l of c.wa)l.onError(r)})})(this,new V(S.ABORTED,"Firestore shutting down"))}}function rl(){return new un(n=>sd(n),es)}async function ga(n,e){const t=j(n);let r=3;const i=e.query;let s=t.queries.get(i);s?!s.Sa()&&e.ba()&&(r=2):(s=new mT,r=e.ba()?0:1);try{switch(r){case 0:s.ya=await t.onListen(i,!0);break;case 1:s.ya=await t.onListen(i,!1);break;case 2:await t.onFirstRemoteStoreListen(i)}}catch(a){const c=ma(a,`Initialization of query '${gn(e.query)}' failed`);return void e.onError(c)}t.queries.set(i,s),s.wa.push(e),e.va(t.onlineState),s.ya&&e.Ca(s.ya)&&ya(t)}async function _a(n,e){const t=j(n),r=e.query;let i=3;const s=t.queries.get(r);if(s){const a=s.wa.indexOf(e);a>=0&&(s.wa.splice(a,1),s.wa.length===0?i=e.ba()?0:1:!s.Sa()&&e.ba()&&(i=2))}switch(i){case 0:return t.queries.delete(r),t.onUnlisten(r,!0);case 1:return t.queries.delete(r),t.onUnlisten(r,!1);case 2:return t.onLastRemoteStoreUnlisten(r);default:return}}function _T(n,e){const t=j(n);let r=!1;for(const i of e){const s=i.query,a=t.queries.get(s);if(a){for(const c of a.wa)c.Ca(i)&&(r=!0);a.ya=i}}r&&ya(t)}function yT(n,e,t){const r=j(n),i=r.queries.get(e);if(i)for(const s of i.wa)s.onError(t);r.queries.delete(e)}function ya(n){n.Da.forEach(e=>{e.next()})}var wo,il;(il=wo||(wo={})).Fa="default",il.Cache="cache";class va{constructor(e,t,r){this.query=e,this.Ma=t,this.xa=!1,this.Oa=null,this.onlineState="Unknown",this.options=r||{}}Ca(e){if(!this.options.includeMetadataChanges){const r=[];for(const i of e.docChanges)i.type!==3&&r.push(i);e=new Cn(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.xa?this.Na(e)&&(this.Ma.next(e),t=!0):this.Ba(e,this.onlineState)&&(this.La(e),t=!0),this.Oa=e,t}onError(e){this.Ma.error(e)}va(e){this.onlineState=e;let t=!1;return this.Oa&&!this.xa&&this.Ba(this.Oa,e)&&(this.La(this.Oa),t=!0),t}Ba(e,t){if(!e.fromCache||!this.ba())return!0;const r=t!=="Offline";return(!this.options.ka||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}Na(e){if(e.docChanges.length>0)return!0;const t=this.Oa&&this.Oa.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}La(e){e=Cn.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.xa=!0,this.Ma.next(e)}ba(){return this.options.source!==wo.Cache}}/**
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
 */class Bd{constructor(e){this.key=e}}class jd{constructor(e){this.key=e}}class vT{constructor(e,t){this.query=e,this.Ha=t,this.Ya=null,this.hasCachedResults=!1,this.current=!1,this.Za=G(),this.mutatedKeys=G(),this.Xa=od(e),this.eu=new In(this.Xa)}get tu(){return this.Ha}nu(e,t){const r=t?t.ru:new nl,i=t?t.eu:this.eu;let s=t?t.mutatedKeys:this.mutatedKeys,a=i,c=!1;const l=this.query.limitType==="F"&&i.size===this.query.limit?i.last():null,d=this.query.limitType==="L"&&i.size===this.query.limit?i.first():null;if(e.inorderTraversal((f,m)=>{const _=i.get(f),R=ts(this.query,m)?m:null,C=!!_&&this.mutatedKeys.has(_.key),D=!!R&&(R.hasLocalMutations||this.mutatedKeys.has(R.key)&&R.hasCommittedMutations);let k=!1;_&&R?_.data.isEqual(R.data)?C!==D&&(r.track({type:3,doc:R}),k=!0):this.iu(_,R)||(r.track({type:2,doc:R}),k=!0,(l&&this.Xa(R,l)>0||d&&this.Xa(R,d)<0)&&(c=!0)):!_&&R?(r.track({type:0,doc:R}),k=!0):_&&!R&&(r.track({type:1,doc:_}),k=!0,(l||d)&&(c=!0)),k&&(R?(a=a.add(R),s=D?s.add(f):s.delete(f)):(a=a.delete(f),s=s.delete(f)))}),this.query.limit!==null)for(;a.size>this.query.limit;){const f=this.query.limitType==="F"?a.last():a.first();a=a.delete(f.key),s=s.delete(f.key),r.track({type:1,doc:f})}return{eu:a,ru:r,Ds:c,mutatedKeys:s}}iu(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,r,i){const s=this.eu;this.eu=e.eu,this.mutatedKeys=e.mutatedKeys;const a=e.ru.pa();a.sort((f,m)=>function(R,C){const D=k=>{switch(k){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return M(20277,{At:k})}};return D(R)-D(C)}(f.type,m.type)||this.Xa(f.doc,m.doc)),this.su(r),i=i!=null&&i;const c=t&&!i?this.ou():[],l=this.Za.size===0&&this.current&&!i?1:0,d=l!==this.Ya;return this.Ya=l,a.length!==0||d?{snapshot:new Cn(this.query,e.eu,s,a,e.mutatedKeys,l===0,d,!1,!!r&&r.resumeToken.approximateByteSize()>0),_u:c}:{_u:c}}va(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({eu:this.eu,ru:new nl,mutatedKeys:this.mutatedKeys,Ds:!1},!1)):{_u:[]}}au(e){return!this.Ha.has(e)&&!!this.eu.has(e)&&!this.eu.get(e).hasLocalMutations}su(e){e&&(e.addedDocuments.forEach(t=>this.Ha=this.Ha.add(t)),e.modifiedDocuments.forEach(t=>{}),e.removedDocuments.forEach(t=>this.Ha=this.Ha.delete(t)),this.current=e.current)}ou(){if(!this.current)return[];const e=this.Za;this.Za=G(),this.eu.forEach(r=>{this.au(r.key)&&(this.Za=this.Za.add(r.key))});const t=[];return e.forEach(r=>{this.Za.has(r)||t.push(new jd(r))}),this.Za.forEach(r=>{e.has(r)||t.push(new Bd(r))}),t}uu(e){this.Ha=e.qs,this.Za=G();const t=this.nu(e.documents);return this.applyChanges(t,!0)}cu(){return Cn.fromInitialDocuments(this.query,this.eu,this.mutatedKeys,this.Ya===0,this.hasCachedResults)}}const Ta="SyncEngine";class TT{constructor(e,t,r){this.query=e,this.targetId=t,this.view=r}}class ET{constructor(e){this.key=e,this.lu=!1}}class IT{constructor(e,t,r,i,s,a){this.localStore=e,this.remoteStore=t,this.eventManager=r,this.sharedClientState=i,this.currentUser=s,this.maxConcurrentLimboResolutions=a,this.hu={},this.Pu=new un(c=>sd(c),es),this.Tu=new Map,this.Iu=new Set,this.du=new ne(L.comparator),this.Eu=new Map,this.Au=new oa,this.Ru={},this.Vu=new Map,this.mu=Pn.ur(),this.onlineState="Unknown",this.fu=void 0}get isPrimaryClient(){return this.fu===!0}}async function wT(n,e,t=!0){const r=Wd(n);let i;const s=r.Pu.get(e);return s?(r.sharedClientState.addLocalQueryTarget(s.targetId),i=s.view.cu()):i=await $d(r,e,t,!0),i}async function AT(n,e){const t=Wd(n);await $d(t,e,!0,!1)}async function $d(n,e,t,r){const i=await zv(n.localStore,Ye(e)),s=i.targetId,a=n.sharedClientState.addLocalQueryTarget(s,t);let c;return r&&(c=await RT(n,e,s,a==="current",i.resumeToken)),n.isPrimaryClient&&t&&Od(n.remoteStore,i),c}async function RT(n,e,t,r,i){n.gu=(m,_,R)=>async function(D,k,$,x){let U=k.view.nu($);U.Ds&&(U=await Ju(D.localStore,k.query,!1).then(({documents:E})=>k.view.nu(E,U)));const z=x&&x.targetChanges.get(k.targetId),fe=x&&x.targetMismatches.get(k.targetId)!=null,Z=k.view.applyChanges(U,D.isPrimaryClient,z,fe);return ol(D,k.targetId,Z._u),Z.snapshot}(n,m,_,R);const s=await Ju(n.localStore,e,!0),a=new vT(e,s.qs),c=a.nu(s.documents),l=Or.createSynthesizedTargetChangeForCurrentChange(t,r&&n.onlineState!=="Offline",i),d=a.applyChanges(c,n.isPrimaryClient,l);ol(n,t,d._u);const f=new TT(e,t,a);return n.Pu.set(e,f),n.Tu.has(t)?n.Tu.get(t).push(e):n.Tu.set(t,[e]),d.snapshot}async function bT(n,e,t){const r=j(n),i=r.Pu.get(e),s=r.Tu.get(i.targetId);if(s.length>1)return r.Tu.set(i.targetId,s.filter(a=>!es(a,e))),void r.Pu.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(i.targetId),r.sharedClientState.isActiveQueryTarget(i.targetId)||await Eo(r.localStore,i.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(i.targetId),t&&la(r.remoteStore,i.targetId),Ao(r,i.targetId)}).catch(On)):(Ao(r,i.targetId),await Eo(r.localStore,i.targetId,!0))}async function ST(n,e){const t=j(n),r=t.Pu.get(e),i=t.Tu.get(r.targetId);t.isPrimaryClient&&i.length===1&&(t.sharedClientState.removeLocalQueryTarget(r.targetId),la(t.remoteStore,r.targetId))}async function PT(n,e,t){const r=LT(n);try{const i=await function(a,c){const l=j(a),d=te.now(),f=c.reduce((R,C)=>R.add(C.key),G());let m,_;return l.persistence.runTransaction("Locally write mutations","readwrite",R=>{let C=yt(),D=G();return l.Os.getEntries(R,f).next(k=>{C=k,C.forEach(($,x)=>{x.isValidDocument()||(D=D.add($))})}).next(()=>l.localDocuments.getOverlayedDocuments(R,C)).next(k=>{m=k;const $=[];for(const x of c){const U=zy(x,m.get(x.key).overlayedDocument);U!=null&&$.push(new qt(x.key,U,Xh(U.value.mapValue),qe.exists(!0)))}return l.mutationQueue.addMutationBatch(R,d,$,c)}).next(k=>{_=k;const $=k.applyToLocalDocumentSet(m,D);return l.documentOverlayCache.saveOverlays(R,k.batchId,$)})}).then(()=>({batchId:_.batchId,changes:cd(m)}))}(r.localStore,e);r.sharedClientState.addPendingMutation(i.batchId),function(a,c,l){let d=a.Ru[a.currentUser.toKey()];d||(d=new ne(q)),d=d.insert(c,l),a.Ru[a.currentUser.toKey()]=d}(r,i.batchId,t),await Mr(r,i.changes),await as(r.remoteStore)}catch(i){const s=ma(i,"Failed to persist write");t.reject(s)}}async function qd(n,e){const t=j(n);try{const r=await jv(t.localStore,e);e.targetChanges.forEach((i,s)=>{const a=t.Eu.get(s);a&&(Q(i.addedDocuments.size+i.modifiedDocuments.size+i.removedDocuments.size<=1,22616),i.addedDocuments.size>0?a.lu=!0:i.modifiedDocuments.size>0?Q(a.lu,14607):i.removedDocuments.size>0&&(Q(a.lu,42227),a.lu=!1))}),await Mr(t,r,e)}catch(r){await On(r)}}function sl(n,e,t){const r=j(n);if(r.isPrimaryClient&&t===0||!r.isPrimaryClient&&t===1){const i=[];r.Pu.forEach((s,a)=>{const c=a.view.va(e);c.snapshot&&i.push(c.snapshot)}),function(a,c){const l=j(a);l.onlineState=c;let d=!1;l.queries.forEach((f,m)=>{for(const _ of m.wa)_.va(c)&&(d=!0)}),d&&ya(l)}(r.eventManager,e),i.length&&r.hu.J_(i),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function CT(n,e,t){const r=j(n);r.sharedClientState.updateQueryState(e,"rejected",t);const i=r.Eu.get(e),s=i&&i.key;if(s){let a=new ne(L.comparator);a=a.insert(s,Ae.newNoDocument(s,B.min()));const c=G().add(s),l=new is(B.min(),new Map,new ne(q),a,c);await qd(r,l),r.du=r.du.remove(s),r.Eu.delete(e),Ea(r)}else await Eo(r.localStore,e,!1).then(()=>Ao(r,e,t)).catch(On)}async function kT(n,e){const t=j(n),r=e.batch.batchId;try{const i=await Bv(t.localStore,e);Hd(t,r,null),zd(t,r),t.sharedClientState.updateMutationState(r,"acknowledged"),await Mr(t,i)}catch(i){await On(i)}}async function NT(n,e,t){const r=j(n);try{const i=await function(a,c){const l=j(a);return l.persistence.runTransaction("Reject batch","readwrite-primary",d=>{let f;return l.mutationQueue.lookupMutationBatch(d,c).next(m=>(Q(m!==null,37113),f=m.keys(),l.mutationQueue.removeMutationBatch(d,m))).next(()=>l.mutationQueue.performConsistencyCheck(d)).next(()=>l.documentOverlayCache.removeOverlaysForBatchId(d,f,c)).next(()=>l.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(d,f)).next(()=>l.localDocuments.getDocuments(d,f))})}(r.localStore,e);Hd(r,e,t),zd(r,e),r.sharedClientState.updateMutationState(e,"rejected",t),await Mr(r,i)}catch(i){await On(i)}}function zd(n,e){(n.Vu.get(e)||[]).forEach(t=>{t.resolve()}),n.Vu.delete(e)}function Hd(n,e,t){const r=j(n);let i=r.Ru[r.currentUser.toKey()];if(i){const s=i.get(e);s&&(t?s.reject(t):s.resolve(),i=i.remove(e)),r.Ru[r.currentUser.toKey()]=i}}function Ao(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(const r of n.Tu.get(e))n.Pu.delete(r),t&&n.hu.pu(r,t);n.Tu.delete(e),n.isPrimaryClient&&n.Au.zr(e).forEach(r=>{n.Au.containsKey(r)||Gd(n,r)})}function Gd(n,e){n.Iu.delete(e.path.canonicalString());const t=n.du.get(e);t!==null&&(la(n.remoteStore,t),n.du=n.du.remove(e),n.Eu.delete(t),Ea(n))}function ol(n,e,t){for(const r of t)r instanceof Bd?(n.Au.addReference(r.key,e),DT(n,r)):r instanceof jd?(O(Ta,"Document no longer in limbo: "+r.key),n.Au.removeReference(r.key,e),n.Au.containsKey(r.key)||Gd(n,r.key)):M(19791,{yu:r})}function DT(n,e){const t=e.key,r=t.path.canonicalString();n.du.get(t)||n.Iu.has(r)||(O(Ta,"New document in limbo: "+t),n.Iu.add(r),Ea(n))}function Ea(n){for(;n.Iu.size>0&&n.du.size<n.maxConcurrentLimboResolutions;){const e=n.Iu.values().next().value;n.Iu.delete(e);const t=new L(Y.fromString(e)),r=n.mu.next();n.Eu.set(r,new ET(t)),n.du=n.du.insert(t,r),Od(n.remoteStore,new Ct(Ye(Zi(t.path)),r,"TargetPurposeLimboResolution",Ji.ue))}}async function Mr(n,e,t){const r=j(n),i=[],s=[],a=[];r.Pu.isEmpty()||(r.Pu.forEach((c,l)=>{a.push(r.gu(l,e,t).then(d=>{var f;if((d||t)&&r.isPrimaryClient){const m=d?!d.fromCache:(f=t==null?void 0:t.targetChanges.get(l.targetId))===null||f===void 0?void 0:f.current;r.sharedClientState.updateQueryState(l.targetId,m?"current":"not-current")}if(d){i.push(d);const m=ca.Es(l.targetId,d);s.push(m)}}))}),await Promise.all(a),r.hu.J_(i),await async function(l,d){const f=j(l);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",m=>P.forEach(d,_=>P.forEach(_.Is,R=>f.persistence.referenceDelegate.addReference(m,_.targetId,R)).next(()=>P.forEach(_.ds,R=>f.persistence.referenceDelegate.removeReference(m,_.targetId,R)))))}catch(m){if(!Ln(m))throw m;O(ua,"Failed to update sequence numbers: "+m)}for(const m of d){const _=m.targetId;if(!m.fromCache){const R=f.Fs.get(_),C=R.snapshotVersion,D=R.withLastLimboFreeSnapshotVersion(C);f.Fs=f.Fs.insert(_,D)}}}(r.localStore,s))}async function VT(n,e){const t=j(n);if(!t.currentUser.isEqual(e)){O(Ta,"User change. New user:",e.toKey());const r=await kd(t.localStore,e);t.currentUser=e,function(s,a){s.Vu.forEach(c=>{c.forEach(l=>{l.reject(new V(S.CANCELLED,a))})}),s.Vu.clear()}(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await Mr(t,r.Bs)}}function OT(n,e){const t=j(n),r=t.Eu.get(e);if(r&&r.lu)return G().add(r.key);{let i=G();const s=t.Tu.get(e);if(!s)return i;for(const a of s){const c=t.Pu.get(a);i=i.unionWith(c.view.tu)}return i}}function Wd(n){const e=j(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=qd.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=OT.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=CT.bind(null,e),e.hu.J_=_T.bind(null,e.eventManager),e.hu.pu=yT.bind(null,e.eventManager),e}function LT(n){const e=j(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=kT.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=NT.bind(null,e),e}class Li{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=ss(e.databaseInfo.databaseId),this.sharedClientState=this.bu(e),this.persistence=this.Du(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Cu(e,this.localStore),this.indexBackfillerScheduler=this.Fu(e,this.localStore)}Cu(e,t){return null}Fu(e,t){return null}vu(e){return Fv(this.persistence,new Mv,e.initialUser,this.serializer)}Du(e){return new Cd(aa.Vi,this.serializer)}bu(e){return new Gv}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Li.provider={build:()=>new Li};class MT extends Li{constructor(e){super(),this.cacheSizeBytes=e}Cu(e,t){Q(this.persistence.referenceDelegate instanceof Vi,46915);const r=this.persistence.referenceDelegate.garbageCollector;return new Ev(r,e.asyncQueue,t)}Du(e){const t=this.cacheSizeBytes!==void 0?ke.withCacheSize(this.cacheSizeBytes):ke.DEFAULT;return new Cd(r=>Vi.Vi(r,t),this.serializer)}}class Ro{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>sl(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=VT.bind(null,this.syncEngine),await pT(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new gT}()}createDatastore(e){const t=ss(e.databaseInfo.databaseId),r=function(s){return new Xv(s)}(e.databaseInfo);return function(s,a,c,l){return new tT(s,a,c,l)}(e.authCredentials,e.appCheckCredentials,r,t)}createRemoteStore(e){return function(r,i,s,a,c){return new rT(r,i,s,a,c)}(this.localStore,this.datastore,e.asyncQueue,t=>sl(this.syncEngine,t,0),function(){return Zu.C()?new Zu:new Wv}())}createSyncEngine(e,t){return function(i,s,a,c,l,d,f){const m=new IT(i,s,a,c,l,d);return f&&(m.fu=!0),m}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await async function(i){const s=j(i);O(nn,"RemoteStore shutting down."),s.Ia.add(5),await Lr(s),s.Ea.shutdown(),s.Aa.set("Unknown")}(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}Ro.provider={build:()=>new Ro};/**
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
 */class Ia{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.xu(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.xu(this.observer.error,e):_t("Uncaught Error in snapshot listener:",e.toString()))}Ou(){this.muted=!0}xu(e,t){setTimeout(()=>{this.muted||e(t)},0)}}/**
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
 */const jt="FirestoreClient";class xT{constructor(e,t,r,i,s){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=r,this.databaseInfo=i,this.user=we.UNAUTHENTICATED,this.clientId=Ko.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=s,this.authCredentials.start(r,async a=>{O(jt,"Received user=",a.uid),await this.authCredentialListener(a),this.user=a}),this.appCheckCredentials.start(r,a=>(O(jt,"Received new app check token=",a),this.appCheckCredentialListener(a,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new ft;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const r=ma(t,"Failed to shutdown persistence");e.reject(r)}}),e.promise}}async function Js(n,e){n.asyncQueue.verifyOperationInProgress(),O(jt,"Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let r=t.initialUser;n.setCredentialChangeListener(async i=>{r.isEqual(i)||(await kd(e.localStore,i),r=i)}),e.persistence.setDatabaseDeletedListener(()=>{Lt("Terminating Firestore due to IndexedDb database deletion"),n.terminate().then(()=>{O("Terminating Firestore due to IndexedDb database deletion completed successfully")}).catch(i=>{Lt("Terminating Firestore due to IndexedDb database deletion failed",i)})}),n._offlineComponents=e}async function al(n,e){n.asyncQueue.verifyOperationInProgress();const t=await UT(n);O(jt,"Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener(r=>tl(e.remoteStore,r)),n.setAppCheckTokenChangeListener((r,i)=>tl(e.remoteStore,i)),n._onlineComponents=e}async function UT(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){O(jt,"Using user provided OfflineComponentProvider");try{await Js(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!function(i){return i.name==="FirebaseError"?i.code===S.FAILED_PRECONDITION||i.code===S.UNIMPLEMENTED:!(typeof DOMException<"u"&&i instanceof DOMException)||i.code===22||i.code===20||i.code===11}(t))throw t;Lt("Error using user provided cache. Falling back to memory cache: "+t),await Js(n,new Li)}}else O(jt,"Using default OfflineComponentProvider"),await Js(n,new MT(void 0));return n._offlineComponents}async function Kd(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(O(jt,"Using user provided OnlineComponentProvider"),await al(n,n._uninitializedComponentsProvider._online)):(O(jt,"Using default OnlineComponentProvider"),await al(n,new Ro))),n._onlineComponents}function FT(n){return Kd(n).then(e=>e.syncEngine)}async function Mi(n){const e=await Kd(n),t=e.eventManager;return t.onListen=wT.bind(null,e.syncEngine),t.onUnlisten=bT.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=AT.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=ST.bind(null,e.syncEngine),t}function BT(n,e,t={}){const r=new ft;return n.asyncQueue.enqueueAndForget(async()=>function(s,a,c,l,d){const f=new Ia({next:_=>{f.Ou(),a.enqueueAndForget(()=>_a(s,m));const R=_.docs.has(c);!R&&_.fromCache?d.reject(new V(S.UNAVAILABLE,"Failed to get document because the client is offline.")):R&&_.fromCache&&l&&l.source==="server"?d.reject(new V(S.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):d.resolve(_)},error:_=>d.reject(_)}),m=new va(Zi(c.path),f,{includeMetadataChanges:!0,ka:!0});return ga(s,m)}(await Mi(n),n.asyncQueue,e,t,r)),r.promise}function jT(n,e,t={}){const r=new ft;return n.asyncQueue.enqueueAndForget(async()=>function(s,a,c,l,d){const f=new Ia({next:_=>{f.Ou(),a.enqueueAndForget(()=>_a(s,m)),_.fromCache&&l.source==="server"?d.reject(new V(S.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):d.resolve(_)},error:_=>d.reject(_)}),m=new va(c,f,{includeMetadataChanges:!0,ka:!0});return ga(s,m)}(await Mi(n),n.asyncQueue,e,t,r)),r.promise}/**
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
 */function Qd(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
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
 */const cl=new Map;/**
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
 */const Jd="firestore.googleapis.com",ul=!0;class ll{constructor(e){var t,r;if(e.host===void 0){if(e.ssl!==void 0)throw new V(S.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=Jd,this.ssl=ul}else this.host=e.host,this.ssl=(t=e.ssl)!==null&&t!==void 0?t:ul;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=Pd;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<vv)throw new V(S.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}sy("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Qd((r=e.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),function(s){if(s.timeoutSeconds!==void 0){if(isNaN(s.timeoutSeconds))throw new V(S.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`);if(s.timeoutSeconds<5)throw new V(S.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`);if(s.timeoutSeconds>30)throw new V(S.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,i){return r.timeoutSeconds===i.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class cs{constructor(e,t,r,i){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new ll({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new V(S.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new V(S.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new ll(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new J_;switch(r.type){case"firstParty":return new ey(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new V(S.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){const r=cl.get(t);r&&(O("ComponentProvider","Removing Datastore"),cl.delete(t),r.terminate())}(this),Promise.resolve()}}function $T(n,e,t,r={}){var i;n=Oe(n,cs);const s=Tt(e),a=n._getSettings(),c=Object.assign(Object.assign({},a),{emulatorOptions:n._getEmulatorOptions()}),l=`${e}:${t}`;s&&(qi(`https://${l}`),zi("Firestore",!0)),a.host!==Jd&&a.host!==l&&Lt("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const d=Object.assign(Object.assign({},a),{host:l,ssl:s,emulatorOptions:r});if(!pt(d,c)&&(n._setSettings(d),r.mockUserToken)){let f,m;if(typeof r.mockUserToken=="string")f=r.mockUserToken,m=we.MOCK_USER;else{f=Bl(r.mockUserToken,(i=n._app)===null||i===void 0?void 0:i.options.projectId);const _=r.mockUserToken.sub||r.mockUserToken.user_id;if(!_)throw new V(S.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");m=new we(_)}n._authCredentials=new X_(new Uh(f,m))}}/**
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
 */class It{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new It(this.firestore,e,this._query)}}class ie{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Vt(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new ie(this.firestore,e,this._key)}toJSON(){return{type:ie._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,r){if(Dr(t,ie._jsonSchema))return new ie(e,r||null,new L(Y.fromString(t.referencePath)))}}ie._jsonSchemaVersion="firestore/documentReference/1.0",ie._jsonSchema={type:le("string",ie._jsonSchemaVersion),referencePath:le("string")};class Vt extends It{constructor(e,t,r){super(e,t,Zi(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new ie(this.firestore,null,new L(e))}withConverter(e){return new Vt(this.firestore,e,this._path)}}function eA(n,e,...t){if(n=X(n),Bh("collection","path",e),n instanceof cs){const r=Y.fromString(e,...t);return wu(r),new Vt(n,null,r)}{if(!(n instanceof ie||n instanceof Vt))throw new V(S.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(Y.fromString(e,...t));return wu(r),new Vt(n.firestore,null,r)}}function qT(n,e,...t){if(n=X(n),arguments.length===1&&(e=Ko.newId()),Bh("doc","path",e),n instanceof cs){const r=Y.fromString(e,...t);return Iu(r),new ie(n,null,new L(r))}{if(!(n instanceof ie||n instanceof Vt))throw new V(S.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(Y.fromString(e,...t));return Iu(r),new ie(n.firestore,n instanceof Vt?n.converter:null,new L(r))}}/**
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
 */const hl="AsyncQueue";class dl{constructor(e=Promise.resolve()){this.Zu=[],this.Xu=!1,this.ec=[],this.tc=null,this.nc=!1,this.rc=!1,this.sc=[],this.F_=new Dd(this,"async_queue_retry"),this.oc=()=>{const r=Qs();r&&O(hl,"Visibility state changed to "+r.visibilityState),this.F_.y_()},this._c=e;const t=Qs();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.oc)}get isShuttingDown(){return this.Xu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.ac(),this.uc(e)}enterRestrictedMode(e){if(!this.Xu){this.Xu=!0,this.rc=e||!1;const t=Qs();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.oc)}}enqueue(e){if(this.ac(),this.Xu)return new Promise(()=>{});const t=new ft;return this.uc(()=>this.Xu&&this.rc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Zu.push(e),this.cc()))}async cc(){if(this.Zu.length!==0){try{await this.Zu[0](),this.Zu.shift(),this.F_.reset()}catch(e){if(!Ln(e))throw e;O(hl,"Operation failed with retryable error: "+e)}this.Zu.length>0&&this.F_.g_(()=>this.cc())}}uc(e){const t=this._c.then(()=>(this.nc=!0,e().catch(r=>{throw this.tc=r,this.nc=!1,_t("INTERNAL UNHANDLED ERROR: ",fl(r)),r}).then(r=>(this.nc=!1,r))));return this._c=t,t}enqueueAfterDelay(e,t,r){this.ac(),this.sc.indexOf(e)>-1&&(t=0);const i=pa.createAndSchedule(this,e,t,r,s=>this.lc(s));return this.ec.push(i),i}ac(){this.tc&&M(47125,{hc:fl(this.tc)})}verifyOperationInProgress(){}async Pc(){let e;do e=this._c,await e;while(e!==this._c)}Tc(e){for(const t of this.ec)if(t.timerId===e)return!0;return!1}Ic(e){return this.Pc().then(()=>{this.ec.sort((t,r)=>t.targetTimeMs-r.targetTimeMs);for(const t of this.ec)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Pc()})}dc(e){this.sc.push(e)}lc(e){const t=this.ec.indexOf(e);this.ec.splice(t,1)}}function fl(n){let e=n.message||"";return n.stack&&(e=n.stack.includes(n.message)?n.stack:n.message+`
`+n.stack),e}/**
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
 */function pl(n){return function(t,r){if(typeof t!="object"||t===null)return!1;const i=t;for(const s of r)if(s in i&&typeof i[s]=="function")return!0;return!1}(n,["next","error","complete"])}class vt extends cs{constructor(e,t,r,i){super(e,t,r,i),this.type="firestore",this._queue=new dl,this._persistenceKey=(i==null?void 0:i.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new dl(e),this._firestoreClient=void 0,await e}}}function tA(n,e){const t=typeof n=="object"?n:Pr(),r=typeof n=="string"?n:Pi,i=Et(t,"firestore").getImmediate({identifier:r});if(!i._initialized){const s=No("firestore");s&&$T(i,...s)}return i}function us(n){if(n._terminated)throw new V(S.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||zT(n),n._firestoreClient}function zT(n){var e,t,r;const i=n._freezeSettings(),s=function(c,l,d,f){return new gy(c,l,d,f.host,f.ssl,f.experimentalForceLongPolling,f.experimentalAutoDetectLongPolling,Qd(f.experimentalLongPollingOptions),f.useFetchStreams,f.isUsingEmulator)}(n._databaseId,((e=n._app)===null||e===void 0?void 0:e.options.appId)||"",n._persistenceKey,i);n._componentsProvider||!((t=i.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((r=i.localCache)===null||r===void 0)&&r._onlineComponentProvider)&&(n._componentsProvider={_offline:i.localCache._offlineComponentProvider,_online:i.localCache._onlineComponentProvider}),n._firestoreClient=new xT(n._authCredentials,n._appCheckCredentials,n._queue,s,n._componentsProvider&&function(c){const l=c==null?void 0:c._online.build();return{_offline:c==null?void 0:c._offline.build(l),_online:l}}(n._componentsProvider))}/**
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
 */class $e{constructor(e){this._byteString=e}static fromBase64String(e){try{return new $e(_e.fromBase64String(e))}catch(t){throw new V(S.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new $e(_e.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:$e._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(Dr(e,$e._jsonSchema))return $e.fromBase64String(e.bytes)}}$e._jsonSchemaVersion="firestore/bytes/1.0",$e._jsonSchema={type:le("string",$e._jsonSchemaVersion),bytes:le("string")};/**
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
 */class ls{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new V(S.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new ge(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
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
 */class Un{constructor(e){this._methodName=e}}/**
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
 */class et{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new V(S.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new V(S.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return q(this._lat,e._lat)||q(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:et._jsonSchemaVersion}}static fromJSON(e){if(Dr(e,et._jsonSchema))return new et(e.latitude,e.longitude)}}et._jsonSchemaVersion="firestore/geoPoint/1.0",et._jsonSchema={type:le("string",et._jsonSchemaVersion),latitude:le("number"),longitude:le("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tt{constructor(e){this._values=(e||[]).map(t=>t)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(r,i){if(r.length!==i.length)return!1;for(let s=0;s<r.length;++s)if(r[s]!==i[s])return!1;return!0}(this._values,e._values)}toJSON(){return{type:tt._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(Dr(e,tt._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every(t=>typeof t=="number"))return new tt(e.vectorValues);throw new V(S.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}tt._jsonSchemaVersion="firestore/vectorValue/1.0",tt._jsonSchema={type:le("string",tt._jsonSchemaVersion),vectorValues:le("object")};/**
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
 */const HT=/^__.*__$/;class GT{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return this.fieldMask!==null?new qt(e,this.data,this.fieldMask,t,this.fieldTransforms):new Vr(e,this.data,t,this.fieldTransforms)}}class Xd{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return new qt(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function Yd(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw M(40011,{Ec:n})}}class hs{constructor(e,t,r,i,s,a){this.settings=e,this.databaseId=t,this.serializer=r,this.ignoreUndefinedProperties=i,s===void 0&&this.Ac(),this.fieldTransforms=s||[],this.fieldMask=a||[]}get path(){return this.settings.path}get Ec(){return this.settings.Ec}Rc(e){return new hs(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Vc(e){var t;const r=(t=this.path)===null||t===void 0?void 0:t.child(e),i=this.Rc({path:r,mc:!1});return i.fc(e),i}gc(e){var t;const r=(t=this.path)===null||t===void 0?void 0:t.child(e),i=this.Rc({path:r,mc:!1});return i.Ac(),i}yc(e){return this.Rc({path:void 0,mc:!0})}wc(e){return xi(e,this.settings.methodName,this.settings.Sc||!1,this.path,this.settings.bc)}contains(e){return this.fieldMask.find(t=>e.isPrefixOf(t))!==void 0||this.fieldTransforms.find(t=>e.isPrefixOf(t.field))!==void 0}Ac(){if(this.path)for(let e=0;e<this.path.length;e++)this.fc(this.path.get(e))}fc(e){if(e.length===0)throw this.wc("Document fields must not be empty");if(Yd(this.Ec)&&HT.test(e))throw this.wc('Document fields cannot begin and end with "__"')}}class WT{constructor(e,t,r){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=r||ss(e)}Dc(e,t,r,i=!1){return new hs({Ec:e,methodName:t,bc:r,path:ge.emptyPath(),mc:!1,Sc:i},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function ds(n){const e=n._freezeSettings(),t=ss(n._databaseId);return new WT(n._databaseId,!!e.ignoreUndefinedProperties,t)}function Zd(n,e,t,r,i,s={}){const a=n.Dc(s.merge||s.mergeFields?2:0,e,t,i);ba("Data must be an object, but it was:",a,r);const c=ef(r,a);let l,d;if(s.merge)l=new xe(a.fieldMask),d=a.fieldTransforms;else if(s.mergeFields){const f=[];for(const m of s.mergeFields){const _=bo(e,m,t);if(!a.contains(_))throw new V(S.INVALID_ARGUMENT,`Field '${_}' is specified in your field mask but missing from your input data.`);nf(f,_)||f.push(_)}l=new xe(f),d=a.fieldTransforms.filter(m=>l.covers(m.field))}else l=null,d=a.fieldTransforms;return new GT(new De(c),l,d)}class fs extends Un{_toFieldTransform(e){if(e.Ec!==2)throw e.Ec===1?e.wc(`${this._methodName}() can only appear at the top level of your update data`):e.wc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof fs}}function KT(n,e,t){return new hs({Ec:3,bc:e.settings.bc,methodName:n._methodName,mc:t},e.databaseId,e.serializer,e.ignoreUndefinedProperties)}class wa extends Un{_toFieldTransform(e){return new ta(e.path,new Ar)}isEqual(e){return e instanceof wa}}class Aa extends Un{constructor(e,t){super(e),this.vc=t}_toFieldTransform(e){const t=KT(this,e,!0),r=this.vc.map(s=>Fn(s,t)),i=new Sn(r);return new ta(e.path,i)}isEqual(e){return e instanceof Aa&&pt(this.vc,e.vc)}}class Ra extends Un{constructor(e,t){super(e),this.Cc=t}_toFieldTransform(e){const t=new br(e.serializer,hd(e.serializer,this.Cc));return new ta(e.path,t)}isEqual(e){return e instanceof Ra&&this.Cc===e.Cc}}function QT(n,e,t,r){const i=n.Dc(1,e,t);ba("Data must be an object, but it was:",i,r);const s=[],a=De.empty();$t(r,(l,d)=>{const f=Sa(e,l,t);d=X(d);const m=i.gc(f);if(d instanceof fs)s.push(f);else{const _=Fn(d,m);_!=null&&(s.push(f),a.set(f,_))}});const c=new xe(s);return new Xd(a,c,i.fieldTransforms)}function JT(n,e,t,r,i,s){const a=n.Dc(1,e,t),c=[bo(e,r,t)],l=[i];if(s.length%2!=0)throw new V(S.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let _=0;_<s.length;_+=2)c.push(bo(e,s[_])),l.push(s[_+1]);const d=[],f=De.empty();for(let _=c.length-1;_>=0;--_)if(!nf(d,c[_])){const R=c[_];let C=l[_];C=X(C);const D=a.gc(R);if(C instanceof fs)d.push(R);else{const k=Fn(C,D);k!=null&&(d.push(R),f.set(R,k))}}const m=new xe(d);return new Xd(f,m,a.fieldTransforms)}function XT(n,e,t,r=!1){return Fn(t,n.Dc(r?4:3,e))}function Fn(n,e){if(tf(n=X(n)))return ba("Unsupported field value:",e,n),ef(n,e);if(n instanceof Un)return function(r,i){if(!Yd(i.Ec))throw i.wc(`${r._methodName}() can only be used with update() and set()`);if(!i.path)throw i.wc(`${r._methodName}() is not currently supported inside arrays`);const s=r._toFieldTransform(i);s&&i.fieldTransforms.push(s)}(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.mc&&e.Ec!==4)throw e.wc("Nested arrays are not supported");return function(r,i){const s=[];let a=0;for(const c of r){let l=Fn(c,i.yc(a));l==null&&(l={nullValue:"NULL_VALUE"}),s.push(l),a++}return{arrayValue:{values:s}}}(n,e)}return function(r,i){if((r=X(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return hd(i.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const s=te.fromDate(r);return{timestampValue:Di(i.serializer,s)}}if(r instanceof te){const s=new te(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:Di(i.serializer,s)}}if(r instanceof et)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof $e)return{bytesValue:Ed(i.serializer,r._byteString)};if(r instanceof ie){const s=i.databaseId,a=r.firestore._databaseId;if(!a.isEqual(s))throw i.wc(`Document reference is for database ${a.projectId}/${a.database} but should be for database ${s.projectId}/${s.database}`);return{referenceValue:sa(r.firestore._databaseId||i.databaseId,r._key.path)}}if(r instanceof tt)return function(a,c){return{mapValue:{fields:{[Qh]:{stringValue:Jh},[Ci]:{arrayValue:{values:a.toArray().map(d=>{if(typeof d!="number")throw c.wc("VectorValues must only contain numeric values.");return ea(c.serializer,d)})}}}}}}(r,i);throw i.wc(`Unsupported field value: ${Qi(r)}`)}(n,e)}function ef(n,e){const t={};return qh(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):$t(n,(r,i)=>{const s=Fn(i,e.Vc(r));s!=null&&(t[r]=s)}),{mapValue:{fields:t}}}function tf(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof te||n instanceof et||n instanceof $e||n instanceof ie||n instanceof Un||n instanceof tt)}function ba(n,e,t){if(!tf(t)||!jh(t)){const r=Qi(t);throw r==="an object"?e.wc(n+" a custom object"):e.wc(n+" "+r)}}function bo(n,e,t){if((e=X(e))instanceof ls)return e._internalPath;if(typeof e=="string")return Sa(n,e);throw xi("Field path arguments must be of type string or ",n,!1,void 0,t)}const YT=new RegExp("[~\\*/\\[\\]]");function Sa(n,e,t){if(e.search(YT)>=0)throw xi(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new ls(...e.split("."))._internalPath}catch{throw xi(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function xi(n,e,t,r,i){const s=r&&!r.isEmpty(),a=i!==void 0;let c=`Function ${e}() called with invalid data`;t&&(c+=" (via `toFirestore()`)"),c+=". ";let l="";return(s||a)&&(l+=" (found",s&&(l+=` in field ${r}`),a&&(l+=` in document ${i}`),l+=")"),new V(S.INVALID_ARGUMENT,c+n+l)}function nf(n,e){return n.some(t=>t.isEqual(e))}/**
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
 */class rf{constructor(e,t,r,i,s){this._firestore=e,this._userDataWriter=t,this._key=r,this._document=i,this._converter=s}get id(){return this._key.path.lastSegment()}get ref(){return new ie(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new ZT(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(ps("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class ZT extends rf{data(){return super.data()}}function ps(n,e){return typeof e=="string"?Sa(n,e):e instanceof ls?e._internalPath:e._delegate._internalPath}/**
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
 */function sf(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new V(S.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Pa{}class Ca extends Pa{}function nA(n,e,...t){let r=[];e instanceof Pa&&r.push(e),r=r.concat(t),function(s){const a=s.filter(l=>l instanceof ka).length,c=s.filter(l=>l instanceof ms).length;if(a>1||a>0&&c>0)throw new V(S.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(r);for(const i of r)n=i._apply(n);return n}class ms extends Ca{constructor(e,t,r){super(),this._field=e,this._op=t,this._value=r,this.type="where"}static _create(e,t,r){return new ms(e,t,r)}_apply(e){const t=this._parse(e);return of(e._query,t),new It(e.firestore,e.converter,go(e._query,t))}_parse(e){const t=ds(e.firestore);return function(s,a,c,l,d,f,m){let _;if(d.isKeyField()){if(f==="array-contains"||f==="array-contains-any")throw new V(S.INVALID_ARGUMENT,`Invalid Query. You can't perform '${f}' queries on documentId().`);if(f==="in"||f==="not-in"){gl(m,f);const C=[];for(const D of m)C.push(ml(l,s,D));_={arrayValue:{values:C}}}else _=ml(l,s,m)}else f!=="in"&&f!=="not-in"&&f!=="array-contains-any"||gl(m,f),_=XT(c,a,m,f==="in"||f==="not-in");return ue.create(d,f,_)}(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function rA(n,e,t){const r=e,i=ps("where",n);return ms._create(i,r,t)}class ka extends Pa{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new ka(e,t)}_parse(e){const t=this._queryConstraints.map(r=>r._parse(e)).filter(r=>r.getFilters().length>0);return t.length===1?t[0]:Ke.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:(function(i,s){let a=i;const c=s.getFlattenedFilters();for(const l of c)of(a,l),a=go(a,l)}(e._query,t),new It(e.firestore,e.converter,go(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class Na extends Ca{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new Na(e,t)}_apply(e){const t=function(i,s,a){if(i.startAt!==null)throw new V(S.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(i.endAt!==null)throw new V(S.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new wr(s,a)}(e._query,this._field,this._direction);return new It(e.firestore,e.converter,function(i,s){const a=i.explicitOrderBy.concat([s]);return new Mn(i.path,i.collectionGroup,a,i.filters.slice(),i.limit,i.limitType,i.startAt,i.endAt)}(e._query,t))}}function iA(n,e="asc"){const t=e,r=ps("orderBy",n);return Na._create(r,t)}class Da extends Ca{constructor(e,t,r){super(),this.type=e,this._limit=t,this._limitType=r}static _create(e,t,r){return new Da(e,t,r)}_apply(e){return new It(e.firestore,e.converter,Ni(e._query,this._limit,this._limitType))}}function sA(n){return Da._create("limit",n,"F")}function ml(n,e,t){if(typeof(t=X(t))=="string"){if(t==="")throw new V(S.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!id(e)&&t.indexOf("/")!==-1)throw new V(S.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const r=e.path.child(Y.fromString(t));if(!L.isDocumentKey(r))throw new V(S.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return Nu(n,new L(r))}if(t instanceof ie)return Nu(n,t._key);throw new V(S.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Qi(t)}.`)}function gl(n,e){if(!Array.isArray(n)||n.length===0)throw new V(S.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function of(n,e){const t=function(i,s){for(const a of i)for(const c of a.getFlattenedFilters())if(s.indexOf(c.op)>=0)return c.op;return null}(n.filters,function(i){switch(i){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(e.op));if(t!==null)throw t===e.op?new V(S.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new V(S.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}class eE{convertValue(e,t="none"){switch(Ft(e)){case 0:return null;case 1:return e.booleanValue;case 2:return ae(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(Ut(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw M(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const r={};return $t(e,(i,s)=>{r[i]=this.convertValue(s,t)}),r}convertVectorValue(e){var t,r,i;const s=(i=(r=(t=e.fields)===null||t===void 0?void 0:t[Ci].arrayValue)===null||r===void 0?void 0:r.values)===null||i===void 0?void 0:i.map(a=>ae(a.doubleValue));return new tt(s)}convertGeoPoint(e){return new et(ae(e.latitude),ae(e.longitude))}convertArray(e,t){return(e.values||[]).map(r=>this.convertValue(r,t))}convertServerTimestamp(e,t){switch(t){case"previous":const r=Yi(e);return r==null?null:this.convertValue(r,t);case"estimate":return this.convertTimestamp(Tr(e));default:return null}}convertTimestamp(e){const t=xt(e);return new te(t.seconds,t.nanos)}convertDocumentKey(e,t){const r=Y.fromString(e);Q(Sd(r),9688,{name:e});const i=new Er(r.get(1),r.get(3)),s=new L(r.popFirst(5));return i.isEqual(t)||_t(`Document ${s} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),s}}/**
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
 */function af(n,e,t){let r;return r=n?n.toFirestore(e):e,r}class ar{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class Yt extends rf{constructor(e,t,r,i,s,a){super(e,t,r,i,a),this._firestore=e,this._firestoreImpl=e,this.metadata=s}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new vi(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const r=this._document.data.field(ps("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new V(S.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=Yt._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}Yt._jsonSchemaVersion="firestore/documentSnapshot/1.0",Yt._jsonSchema={type:le("string",Yt._jsonSchemaVersion),bundleSource:le("string","DocumentSnapshot"),bundleName:le("string"),bundle:le("string")};class vi extends Yt{data(e={}){return super.data(e)}}class Zt{constructor(e,t,r,i){this._firestore=e,this._userDataWriter=t,this._snapshot=i,this.metadata=new ar(i.hasPendingWrites,i.fromCache),this.query=r}get docs(){const e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach(r=>{e.call(t,new vi(this._firestore,this._userDataWriter,r.key,r,new ar(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new V(S.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(i,s){if(i._snapshot.oldDocs.isEmpty()){let a=0;return i._snapshot.docChanges.map(c=>{const l=new vi(i._firestore,i._userDataWriter,c.doc.key,c.doc,new ar(i._snapshot.mutatedKeys.has(c.doc.key),i._snapshot.fromCache),i.query.converter);return c.doc,{type:"added",doc:l,oldIndex:-1,newIndex:a++}})}{let a=i._snapshot.oldDocs;return i._snapshot.docChanges.filter(c=>s||c.type!==3).map(c=>{const l=new vi(i._firestore,i._userDataWriter,c.doc.key,c.doc,new ar(i._snapshot.mutatedKeys.has(c.doc.key),i._snapshot.fromCache),i.query.converter);let d=-1,f=-1;return c.type!==0&&(d=a.indexOf(c.doc.key),a=a.delete(c.doc.key)),c.type!==1&&(a=a.add(c.doc),f=a.indexOf(c.doc.key)),{type:tE(c.type),doc:l,oldIndex:d,newIndex:f}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new V(S.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=Zt._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=Ko.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],r=[],i=[];return this.docs.forEach(s=>{s._document!==null&&(t.push(s._document),r.push(this._userDataWriter.convertObjectMap(s._document.data.value.mapValue.fields,"previous")),i.push(s.ref.path))}),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function tE(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return M(61501,{type:n})}}/**
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
 */function oA(n){n=Oe(n,ie);const e=Oe(n.firestore,vt);return BT(us(e),n._key).then(t=>cf(e,n,t))}Zt._jsonSchemaVersion="firestore/querySnapshot/1.0",Zt._jsonSchema={type:le("string",Zt._jsonSchemaVersion),bundleSource:le("string","QuerySnapshot"),bundleName:le("string"),bundle:le("string")};class Va extends eE{constructor(e){super(),this.firestore=e}convertBytes(e){return new $e(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new ie(this.firestore,null,t)}}function aA(n){n=Oe(n,It);const e=Oe(n.firestore,vt),t=us(e),r=new Va(e);return sf(n._query),jT(t,n._query).then(i=>new Zt(e,r,n,i))}function cA(n,e,t){n=Oe(n,ie);const r=Oe(n.firestore,vt),i=af(n.converter,e);return gs(r,[Zd(ds(r),"setDoc",n._key,i,n.converter!==null,t).toMutation(n._key,qe.none())])}function uA(n,e,t,...r){n=Oe(n,ie);const i=Oe(n.firestore,vt),s=ds(i);let a;return a=typeof(e=X(e))=="string"||e instanceof ls?JT(s,"updateDoc",n._key,e,t,r):QT(s,"updateDoc",n._key,e),gs(i,[a.toMutation(n._key,qe.exists(!0))])}function lA(n){return gs(Oe(n.firestore,vt),[new na(n._key,qe.none())])}function hA(n,e){const t=Oe(n.firestore,vt),r=qT(n),i=af(n.converter,e);return gs(t,[Zd(ds(n.firestore),"addDoc",r._key,i,n.converter!==null,{}).toMutation(r._key,qe.exists(!1))]).then(()=>r)}function dA(n,...e){var t,r,i;n=X(n);let s={includeMetadataChanges:!1,source:"default"},a=0;typeof e[a]!="object"||pl(e[a])||(s=e[a++]);const c={includeMetadataChanges:s.includeMetadataChanges,source:s.source};if(pl(e[a])){const m=e[a];e[a]=(t=m.next)===null||t===void 0?void 0:t.bind(m),e[a+1]=(r=m.error)===null||r===void 0?void 0:r.bind(m),e[a+2]=(i=m.complete)===null||i===void 0?void 0:i.bind(m)}let l,d,f;if(n instanceof ie)d=Oe(n.firestore,vt),f=Zi(n._key.path),l={next:m=>{e[a]&&e[a](cf(d,n,m))},error:e[a+1],complete:e[a+2]};else{const m=Oe(n,It);d=Oe(m.firestore,vt),f=m._query;const _=new Va(d);l={next:R=>{e[a]&&e[a](new Zt(d,_,m,R))},error:e[a+1],complete:e[a+2]},sf(n._query)}return function(_,R,C,D){const k=new Ia(D),$=new va(R,k,C);return _.asyncQueue.enqueueAndForget(async()=>ga(await Mi(_),$)),()=>{k.Ou(),_.asyncQueue.enqueueAndForget(async()=>_a(await Mi(_),$))}}(us(d),f,c,l)}function gs(n,e){return function(r,i){const s=new ft;return r.asyncQueue.enqueueAndForget(async()=>PT(await FT(r),i,s)),s.promise}(us(n),e)}function cf(n,e,t){const r=t.docs.get(e._key),i=new Va(n);return new Yt(n,i,e._key,r,new ar(t.hasPendingWrites,t.fromCache),e.converter)}function fA(){return new wa("serverTimestamp")}function pA(...n){return new Aa("arrayUnion",n)}function mA(n){return new Ra("increment",n)}(function(e,t=!0){(function(i){Vn=i})(cn),ze(new Be("firestore",(r,{instanceIdentifier:i,options:s})=>{const a=r.getProvider("app").getImmediate(),c=new vt(new Y_(r.getProvider("auth-internal")),new ty(a,r.getProvider("app-check-internal")),function(d,f){if(!Object.prototype.hasOwnProperty.apply(d.options,["projectId"]))throw new V(S.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Er(d.options.projectId,f)}(a,i),a);return s=Object.assign({useFetchStreams:t},s),c._setSettings(s),c},"PUBLIC").setMultipleInstances(!0)),Re(_u,yu,e),Re(_u,yu,"esm2017")})();/**
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
 */const uf="firebasestorage.googleapis.com",lf="storageBucket",nE=2*60*1e3,rE=10*60*1e3;/**
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
 */class oe extends je{constructor(e,t,r=0){super(Xs(e),`Firebase Storage: ${t} (${Xs(e)})`),this.status_=r,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,oe.prototype)}get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return Xs(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var se;(function(n){n.UNKNOWN="unknown",n.OBJECT_NOT_FOUND="object-not-found",n.BUCKET_NOT_FOUND="bucket-not-found",n.PROJECT_NOT_FOUND="project-not-found",n.QUOTA_EXCEEDED="quota-exceeded",n.UNAUTHENTICATED="unauthenticated",n.UNAUTHORIZED="unauthorized",n.UNAUTHORIZED_APP="unauthorized-app",n.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",n.INVALID_CHECKSUM="invalid-checksum",n.CANCELED="canceled",n.INVALID_EVENT_NAME="invalid-event-name",n.INVALID_URL="invalid-url",n.INVALID_DEFAULT_BUCKET="invalid-default-bucket",n.NO_DEFAULT_BUCKET="no-default-bucket",n.CANNOT_SLICE_BLOB="cannot-slice-blob",n.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",n.NO_DOWNLOAD_URL="no-download-url",n.INVALID_ARGUMENT="invalid-argument",n.INVALID_ARGUMENT_COUNT="invalid-argument-count",n.APP_DELETED="app-deleted",n.INVALID_ROOT_OPERATION="invalid-root-operation",n.INVALID_FORMAT="invalid-format",n.INTERNAL_ERROR="internal-error",n.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(se||(se={}));function Xs(n){return"storage/"+n}function Oa(){const n="An unknown error occurred, please check the error payload for server response.";return new oe(se.UNKNOWN,n)}function iE(n){return new oe(se.OBJECT_NOT_FOUND,"Object '"+n+"' does not exist.")}function sE(n){return new oe(se.QUOTA_EXCEEDED,"Quota for bucket '"+n+"' exceeded, please view quota on https://firebase.google.com/pricing/.")}function oE(){const n="User is not authenticated, please authenticate using Firebase Authentication and try again.";return new oe(se.UNAUTHENTICATED,n)}function aE(){return new oe(se.UNAUTHORIZED_APP,"This app does not have permission to access Firebase Storage on this project.")}function cE(n){return new oe(se.UNAUTHORIZED,"User does not have permission to access '"+n+"'.")}function uE(){return new oe(se.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function lE(){return new oe(se.CANCELED,"User canceled the upload/download.")}function hE(n){return new oe(se.INVALID_URL,"Invalid URL '"+n+"'.")}function dE(n){return new oe(se.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+n+"'.")}function fE(){return new oe(se.NO_DEFAULT_BUCKET,"No default bucket found. Did you set the '"+lf+"' property when initializing the app?")}function pE(){return new oe(se.CANNOT_SLICE_BLOB,"Cannot slice blob for upload. Please retry the upload.")}function mE(){return new oe(se.NO_DOWNLOAD_URL,"The given file does not have any download URLs.")}function gE(n){return new oe(se.UNSUPPORTED_ENVIRONMENT,`${n} is missing. Make sure to install the required polyfills. See https://firebase.google.com/docs/web/environments-js-sdk#polyfills for more information.`)}function So(n){return new oe(se.INVALID_ARGUMENT,n)}function hf(){return new oe(se.APP_DELETED,"The Firebase app was deleted.")}function _E(n){return new oe(se.INVALID_ROOT_OPERATION,"The operation '"+n+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}function pr(n,e){return new oe(se.INVALID_FORMAT,"String does not match format '"+n+"': "+e)}function rr(n){throw new oe(se.INTERNAL_ERROR,"Internal error: "+n)}/**
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
 */class Ue{constructor(e,t){this.bucket=e,this.path_=t}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(e,t){let r;try{r=Ue.makeFromUrl(e,t)}catch{return new Ue(e,"")}if(r.path==="")return r;throw dE(e)}static makeFromUrl(e,t){let r=null;const i="([A-Za-z0-9.\\-_]+)";function s(z){z.path.charAt(z.path.length-1)==="/"&&(z.path_=z.path_.slice(0,-1))}const a="(/(.*))?$",c=new RegExp("^gs://"+i+a,"i"),l={bucket:1,path:3};function d(z){z.path_=decodeURIComponent(z.path)}const f="v[A-Za-z0-9_]+",m=t.replace(/[.]/g,"\\."),_="(/([^?#]*).*)?$",R=new RegExp(`^https?://${m}/${f}/b/${i}/o${_}`,"i"),C={bucket:1,path:3},D=t===uf?"(?:storage.googleapis.com|storage.cloud.google.com)":t,k="([^?#]*)",$=new RegExp(`^https?://${D}/${i}/${k}`,"i"),U=[{regex:c,indices:l,postModify:s},{regex:R,indices:C,postModify:d},{regex:$,indices:{bucket:1,path:2},postModify:d}];for(let z=0;z<U.length;z++){const fe=U[z],Z=fe.regex.exec(e);if(Z){const E=Z[fe.indices.bucket];let g=Z[fe.indices.path];g||(g=""),r=new Ue(E,g),fe.postModify(r);break}}if(r==null)throw hE(e);return r}}class yE{constructor(e){this.promise_=Promise.reject(e)}getPromise(){return this.promise_}cancel(e=!1){}}/**
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
 */function vE(n,e,t){let r=1,i=null,s=null,a=!1,c=0;function l(){return c===2}let d=!1;function f(...k){d||(d=!0,e.apply(null,k))}function m(k){i=setTimeout(()=>{i=null,n(R,l())},k)}function _(){s&&clearTimeout(s)}function R(k,...$){if(d){_();return}if(k){_(),f.call(null,k,...$);return}if(l()||a){_(),f.call(null,k,...$);return}r<64&&(r*=2);let U;c===1?(c=2,U=0):U=(r+Math.random())*1e3,m(U)}let C=!1;function D(k){C||(C=!0,_(),!d&&(i!==null?(k||(c=2),clearTimeout(i),m(0)):k||(c=1)))}return m(0),s=setTimeout(()=>{a=!0,D(!0)},t),D}function TE(n){n(!1)}/**
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
 */function EE(n){return n!==void 0}function IE(n){return typeof n=="object"&&!Array.isArray(n)}function La(n){return typeof n=="string"||n instanceof String}function _l(n){return Ma()&&n instanceof Blob}function Ma(){return typeof Blob<"u"}function yl(n,e,t,r){if(r<e)throw So(`Invalid value for '${n}'. Expected ${e} or greater.`);if(r>t)throw So(`Invalid value for '${n}'. Expected ${t} or less.`)}/**
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
 */function xa(n,e,t){let r=e;return t==null&&(r=`https://${e}`),`${t}://${r}/v0${n}`}function df(n){const e=encodeURIComponent;let t="?";for(const r in n)if(n.hasOwnProperty(r)){const i=e(r)+"="+e(n[r]);t=t+i+"&"}return t=t.slice(0,-1),t}var en;(function(n){n[n.NO_ERROR=0]="NO_ERROR",n[n.NETWORK_ERROR=1]="NETWORK_ERROR",n[n.ABORT=2]="ABORT"})(en||(en={}));/**
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
 */function wE(n,e){const t=n>=500&&n<600,i=[408,429].indexOf(n)!==-1,s=e.indexOf(n)!==-1;return t||i||s}/**
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
 */class AE{constructor(e,t,r,i,s,a,c,l,d,f,m,_=!0,R=!1){this.url_=e,this.method_=t,this.headers_=r,this.body_=i,this.successCodes_=s,this.additionalRetryCodes_=a,this.callback_=c,this.errorCallback_=l,this.timeout_=d,this.progressCallback_=f,this.connectionFactory_=m,this.retry=_,this.isUsingEmulator=R,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((C,D)=>{this.resolve_=C,this.reject_=D,this.start_()})}start_(){const e=(r,i)=>{if(i){r(!1,new ci(!1,null,!0));return}const s=this.connectionFactory_();this.pendingConnection_=s;const a=c=>{const l=c.loaded,d=c.lengthComputable?c.total:-1;this.progressCallback_!==null&&this.progressCallback_(l,d)};this.progressCallback_!==null&&s.addUploadProgressListener(a),s.send(this.url_,this.method_,this.isUsingEmulator,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&s.removeUploadProgressListener(a),this.pendingConnection_=null;const c=s.getErrorCode()===en.NO_ERROR,l=s.getStatus();if(!c||wE(l,this.additionalRetryCodes_)&&this.retry){const f=s.getErrorCode()===en.ABORT;r(!1,new ci(!1,null,f));return}const d=this.successCodes_.indexOf(l)!==-1;r(!0,new ci(d,s))})},t=(r,i)=>{const s=this.resolve_,a=this.reject_,c=i.connection;if(i.wasSuccessCode)try{const l=this.callback_(c,c.getResponse());EE(l)?s(l):s()}catch(l){a(l)}else if(c!==null){const l=Oa();l.serverResponse=c.getErrorText(),this.errorCallback_?a(this.errorCallback_(c,l)):a(l)}else if(i.canceled){const l=this.appDelete_?hf():lE();a(l)}else{const l=uE();a(l)}};this.canceled_?t(!1,new ci(!1,null,!0)):this.backoffId_=vE(e,t,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,this.backoffId_!==null&&TE(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class ci{constructor(e,t,r){this.wasSuccessCode=e,this.connection=t,this.canceled=!!r}}function RE(n,e){e!==null&&e.length>0&&(n.Authorization="Firebase "+e)}function bE(n,e){n["X-Firebase-Storage-Version"]="webjs/"+(e??"AppManager")}function SE(n,e){e&&(n["X-Firebase-GMPID"]=e)}function PE(n,e){e!==null&&(n["X-Firebase-AppCheck"]=e)}function CE(n,e,t,r,i,s,a=!0,c=!1){const l=df(n.urlParams),d=n.url+l,f=Object.assign({},n.headers);return SE(f,e),RE(f,t),bE(f,s),PE(f,r),new AE(d,n.method,f,n.body,n.successCodes,n.additionalRetryCodes,n.handler,n.errorHandler,n.timeout,n.progressCallback,i,a,c)}/**
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
 */function kE(){return typeof BlobBuilder<"u"?BlobBuilder:typeof WebKitBlobBuilder<"u"?WebKitBlobBuilder:void 0}function NE(...n){const e=kE();if(e!==void 0){const t=new e;for(let r=0;r<n.length;r++)t.append(n[r]);return t.getBlob()}else{if(Ma())return new Blob(n);throw new oe(se.UNSUPPORTED_ENVIRONMENT,"This browser doesn't seem to support creating Blobs")}}function DE(n,e,t){return n.webkitSlice?n.webkitSlice(e,t):n.mozSlice?n.mozSlice(e,t):n.slice?n.slice(e,t):null}/**
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
 */function VE(n){if(typeof atob>"u")throw gE("base-64");return atob(n)}/**
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
 */const Je={RAW:"raw",BASE64:"base64",BASE64URL:"base64url",DATA_URL:"data_url"};class Ys{constructor(e,t){this.data=e,this.contentType=t||null}}function OE(n,e){switch(n){case Je.RAW:return new Ys(ff(e));case Je.BASE64:case Je.BASE64URL:return new Ys(pf(n,e));case Je.DATA_URL:return new Ys(ME(e),xE(e))}throw Oa()}function ff(n){const e=[];for(let t=0;t<n.length;t++){let r=n.charCodeAt(t);if(r<=127)e.push(r);else if(r<=2047)e.push(192|r>>6,128|r&63);else if((r&64512)===55296)if(!(t<n.length-1&&(n.charCodeAt(t+1)&64512)===56320))e.push(239,191,189);else{const s=r,a=n.charCodeAt(++t);r=65536|(s&1023)<<10|a&1023,e.push(240|r>>18,128|r>>12&63,128|r>>6&63,128|r&63)}else(r&64512)===56320?e.push(239,191,189):e.push(224|r>>12,128|r>>6&63,128|r&63)}return new Uint8Array(e)}function LE(n){let e;try{e=decodeURIComponent(n)}catch{throw pr(Je.DATA_URL,"Malformed data URL.")}return ff(e)}function pf(n,e){switch(n){case Je.BASE64:{const i=e.indexOf("-")!==-1,s=e.indexOf("_")!==-1;if(i||s)throw pr(n,"Invalid character '"+(i?"-":"_")+"' found: is it base64url encoded?");break}case Je.BASE64URL:{const i=e.indexOf("+")!==-1,s=e.indexOf("/")!==-1;if(i||s)throw pr(n,"Invalid character '"+(i?"+":"/")+"' found: is it base64 encoded?");e=e.replace(/-/g,"+").replace(/_/g,"/");break}}let t;try{t=VE(e)}catch(i){throw i.message.includes("polyfill")?i:pr(n,"Invalid character found")}const r=new Uint8Array(t.length);for(let i=0;i<t.length;i++)r[i]=t.charCodeAt(i);return r}class mf{constructor(e){this.base64=!1,this.contentType=null;const t=e.match(/^data:([^,]+)?,/);if(t===null)throw pr(Je.DATA_URL,"Must be formatted 'data:[<mediatype>][;base64],<data>");const r=t[1]||null;r!=null&&(this.base64=UE(r,";base64"),this.contentType=this.base64?r.substring(0,r.length-7):r),this.rest=e.substring(e.indexOf(",")+1)}}function ME(n){const e=new mf(n);return e.base64?pf(Je.BASE64,e.rest):LE(e.rest)}function xE(n){return new mf(n).contentType}function UE(n,e){return n.length>=e.length?n.substring(n.length-e.length)===e:!1}/**
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
 */class Pt{constructor(e,t){let r=0,i="";_l(e)?(this.data_=e,r=e.size,i=e.type):e instanceof ArrayBuffer?(t?this.data_=new Uint8Array(e):(this.data_=new Uint8Array(e.byteLength),this.data_.set(new Uint8Array(e))),r=this.data_.length):e instanceof Uint8Array&&(t?this.data_=e:(this.data_=new Uint8Array(e.length),this.data_.set(e)),r=e.length),this.size_=r,this.type_=i}size(){return this.size_}type(){return this.type_}slice(e,t){if(_l(this.data_)){const r=this.data_,i=DE(r,e,t);return i===null?null:new Pt(i)}else{const r=new Uint8Array(this.data_.buffer,e,t-e);return new Pt(r,!0)}}static getBlob(...e){if(Ma()){const t=e.map(r=>r instanceof Pt?r.data_:r);return new Pt(NE.apply(null,t))}else{const t=e.map(a=>La(a)?OE(Je.RAW,a).data:a.data_);let r=0;t.forEach(a=>{r+=a.byteLength});const i=new Uint8Array(r);let s=0;return t.forEach(a=>{for(let c=0;c<a.length;c++)i[s++]=a[c]}),new Pt(i,!0)}}uploadData(){return this.data_}}/**
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
 */function gf(n){let e;try{e=JSON.parse(n)}catch{return null}return IE(e)?e:null}/**
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
 */function FE(n){if(n.length===0)return null;const e=n.lastIndexOf("/");return e===-1?"":n.slice(0,e)}function BE(n,e){const t=e.split("/").filter(r=>r.length>0).join("/");return n.length===0?t:n+"/"+t}function _f(n){const e=n.lastIndexOf("/",n.length-2);return e===-1?n:n.slice(e+1)}/**
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
 */function jE(n,e){return e}class Ce{constructor(e,t,r,i){this.server=e,this.local=t||e,this.writable=!!r,this.xform=i||jE}}let ui=null;function $E(n){return!La(n)||n.length<2?n:_f(n)}function yf(){if(ui)return ui;const n=[];n.push(new Ce("bucket")),n.push(new Ce("generation")),n.push(new Ce("metageneration")),n.push(new Ce("name","fullPath",!0));function e(s,a){return $E(a)}const t=new Ce("name");t.xform=e,n.push(t);function r(s,a){return a!==void 0?Number(a):a}const i=new Ce("size");return i.xform=r,n.push(i),n.push(new Ce("timeCreated")),n.push(new Ce("updated")),n.push(new Ce("md5Hash",null,!0)),n.push(new Ce("cacheControl",null,!0)),n.push(new Ce("contentDisposition",null,!0)),n.push(new Ce("contentEncoding",null,!0)),n.push(new Ce("contentLanguage",null,!0)),n.push(new Ce("contentType",null,!0)),n.push(new Ce("metadata","customMetadata",!0)),ui=n,ui}function qE(n,e){function t(){const r=n.bucket,i=n.fullPath,s=new Ue(r,i);return e._makeStorageReference(s)}Object.defineProperty(n,"ref",{get:t})}function zE(n,e,t){const r={};r.type="file";const i=t.length;for(let s=0;s<i;s++){const a=t[s];r[a.local]=a.xform(r,e[a.server])}return qE(r,n),r}function vf(n,e,t){const r=gf(e);return r===null?null:zE(n,r,t)}function HE(n,e,t,r){const i=gf(e);if(i===null||!La(i.downloadTokens))return null;const s=i.downloadTokens;if(s.length===0)return null;const a=encodeURIComponent;return s.split(",").map(d=>{const f=n.bucket,m=n.fullPath,_="/b/"+a(f)+"/o/"+a(m),R=xa(_,t,r),C=df({alt:"media",token:d});return R+C})[0]}function GE(n,e){const t={},r=e.length;for(let i=0;i<r;i++){const s=e[i];s.writable&&(t[s.server]=n[s.local])}return JSON.stringify(t)}class Tf{constructor(e,t,r,i){this.url=e,this.method=t,this.handler=r,this.timeout=i,this.urlParams={},this.headers={},this.body=null,this.errorHandler=null,this.progressCallback=null,this.successCodes=[200],this.additionalRetryCodes=[]}}/**
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
 */function Ef(n){if(!n)throw Oa()}function WE(n,e){function t(r,i){const s=vf(n,i,e);return Ef(s!==null),s}return t}function KE(n,e){function t(r,i){const s=vf(n,i,e);return Ef(s!==null),HE(s,i,n.host,n._protocol)}return t}function If(n){function e(t,r){let i;return t.getStatus()===401?t.getErrorText().includes("Firebase App Check token is invalid")?i=aE():i=oE():t.getStatus()===402?i=sE(n.bucket):t.getStatus()===403?i=cE(n.path):i=r,i.status=t.getStatus(),i.serverResponse=r.serverResponse,i}return e}function QE(n){const e=If(n);function t(r,i){let s=e(r,i);return r.getStatus()===404&&(s=iE(n.path)),s.serverResponse=i.serverResponse,s}return t}function JE(n,e,t){const r=e.fullServerUrl(),i=xa(r,n.host,n._protocol),s="GET",a=n.maxOperationRetryTime,c=new Tf(i,s,KE(n,t),a);return c.errorHandler=QE(e),c}function XE(n,e){return n&&n.contentType||e&&e.type()||"application/octet-stream"}function YE(n,e,t){const r=Object.assign({},t);return r.fullPath=n.path,r.size=e.size(),r.contentType||(r.contentType=XE(null,e)),r}function ZE(n,e,t,r,i){const s=e.bucketOnlyServerUrl(),a={"X-Goog-Upload-Protocol":"multipart"};function c(){let U="";for(let z=0;z<2;z++)U=U+Math.random().toString().slice(2);return U}const l=c();a["Content-Type"]="multipart/related; boundary="+l;const d=YE(e,r,i),f=GE(d,t),m="--"+l+`\r
Content-Type: application/json; charset=utf-8\r
\r
`+f+`\r
--`+l+`\r
Content-Type: `+d.contentType+`\r
\r
`,_=`\r
--`+l+"--",R=Pt.getBlob(m,r,_);if(R===null)throw pE();const C={name:d.fullPath},D=xa(s,n.host,n._protocol),k="POST",$=n.maxUploadRetryTime,x=new Tf(D,k,WE(n,t),$);return x.urlParams=C,x.headers=a,x.body=R.uploadData(),x.errorHandler=If(e),x}class eI{constructor(){this.sent_=!1,this.xhr_=new XMLHttpRequest,this.initXhr(),this.errorCode_=en.NO_ERROR,this.sendPromise_=new Promise(e=>{this.xhr_.addEventListener("abort",()=>{this.errorCode_=en.ABORT,e()}),this.xhr_.addEventListener("error",()=>{this.errorCode_=en.NETWORK_ERROR,e()}),this.xhr_.addEventListener("load",()=>{e()})})}send(e,t,r,i,s){if(this.sent_)throw rr("cannot .send() more than once");if(Tt(e)&&r&&(this.xhr_.withCredentials=!0),this.sent_=!0,this.xhr_.open(t,e,!0),s!==void 0)for(const a in s)s.hasOwnProperty(a)&&this.xhr_.setRequestHeader(a,s[a].toString());return i!==void 0?this.xhr_.send(i):this.xhr_.send(),this.sendPromise_}getErrorCode(){if(!this.sent_)throw rr("cannot .getErrorCode() before sending");return this.errorCode_}getStatus(){if(!this.sent_)throw rr("cannot .getStatus() before sending");try{return this.xhr_.status}catch{return-1}}getResponse(){if(!this.sent_)throw rr("cannot .getResponse() before sending");return this.xhr_.response}getErrorText(){if(!this.sent_)throw rr("cannot .getErrorText() before sending");return this.xhr_.statusText}abort(){this.xhr_.abort()}getResponseHeader(e){return this.xhr_.getResponseHeader(e)}addUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.addEventListener("progress",e)}removeUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.removeEventListener("progress",e)}}class tI extends eI{initXhr(){this.xhr_.responseType="text"}}function wf(){return new tI}/**
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
 */class rn{constructor(e,t){this._service=e,t instanceof Ue?this._location=t:this._location=Ue.makeFromUrl(t,e.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,t){return new rn(e,t)}get root(){const e=new Ue(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return _f(this._location.path)}get storage(){return this._service}get parent(){const e=FE(this._location.path);if(e===null)return null;const t=new Ue(this._location.bucket,e);return new rn(this._service,t)}_throwIfRoot(e){if(this._location.path==="")throw _E(e)}}function nI(n,e,t){n._throwIfRoot("uploadBytes");const r=ZE(n.storage,n._location,yf(),new Pt(e,!0),t);return n.storage.makeRequestWithTokens(r,wf).then(i=>({metadata:i,ref:n}))}function rI(n){n._throwIfRoot("getDownloadURL");const e=JE(n.storage,n._location,yf());return n.storage.makeRequestWithTokens(e,wf).then(t=>{if(t===null)throw mE();return t})}function iI(n,e){const t=BE(n._location.path,e),r=new Ue(n._location.bucket,t);return new rn(n.storage,r)}/**
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
 */function sI(n){return/^[A-Za-z]+:\/\//.test(n)}function oI(n,e){return new rn(n,e)}function Af(n,e){if(n instanceof Ua){const t=n;if(t._bucket==null)throw fE();const r=new rn(t,t._bucket);return e!=null?Af(r,e):r}else return e!==void 0?iI(n,e):n}function aI(n,e){if(e&&sI(e)){if(n instanceof Ua)return oI(n,e);throw So("To use ref(service, url), the first argument must be a Storage instance.")}else return Af(n,e)}function vl(n,e){const t=e==null?void 0:e[lf];return t==null?null:Ue.makeFromBucketSpec(t,n)}function cI(n,e,t,r={}){n.host=`${e}:${t}`;const i=Tt(e);i&&(qi(`https://${n.host}/b`),zi("Storage",!0)),n._isUsingEmulator=!0,n._protocol=i?"https":"http";const{mockUserToken:s}=r;s&&(n._overrideAuthToken=typeof s=="string"?s:Bl(s,n.app.options.projectId))}class Ua{constructor(e,t,r,i,s,a=!1){this.app=e,this._authProvider=t,this._appCheckProvider=r,this._url=i,this._firebaseVersion=s,this._isUsingEmulator=a,this._bucket=null,this._host=uf,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=nE,this._maxUploadRetryTime=rE,this._requests=new Set,i!=null?this._bucket=Ue.makeFromBucketSpec(i,this._host):this._bucket=vl(this._host,this.app.options)}get host(){return this._host}set host(e){this._host=e,this._url!=null?this._bucket=Ue.makeFromBucketSpec(this._url,e):this._bucket=vl(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){yl("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){yl("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const e=this._authProvider.getImmediate({optional:!0});if(e){const t=await e.getToken();if(t!==null)return t.accessToken}return null}async _getAppCheckToken(){if(Ne(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=this._appCheckProvider.getImmediate({optional:!0});return e?(await e.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(e=>e.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new rn(this,e)}_makeRequest(e,t,r,i,s=!0){if(this._deleted)return new yE(hf());{const a=CE(e,this._appId,r,i,t,this._firebaseVersion,s,this._isUsingEmulator);return this._requests.add(a),a.getPromise().then(()=>this._requests.delete(a),()=>this._requests.delete(a)),a}}async makeRequestWithTokens(e,t){const[r,i]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,t,r,i).getPromise()}}const Tl="@firebase/storage",El="0.13.14";/**
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
 */const Rf="storage";function gA(n,e,t){return n=X(n),nI(n,e,t)}function _A(n){return n=X(n),rI(n)}function yA(n,e){return n=X(n),aI(n,e)}function vA(n=Pr(),e){n=X(n);const r=Et(n,Rf).getImmediate({identifier:e}),i=No("storage");return i&&uI(r,...i),r}function uI(n,e,t,r={}){cI(n,e,t,r)}function lI(n,{instanceIdentifier:e}){const t=n.getProvider("app").getImmediate(),r=n.getProvider("auth-internal"),i=n.getProvider("app-check-internal");return new Ua(t,r,i,e,cn)}function hI(){ze(new Be(Rf,lI,"PUBLIC").setMultipleInstances(!0)),Re(Tl,El,""),Re(Tl,El,"esm2017")}hI();const bf="@firebase/installations",Fa="0.6.18";/**
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
 */const Sf=1e4,Pf=`w:${Fa}`,Cf="FIS_v2",dI="https://firebaseinstallations.googleapis.com/v1",fI=60*60*1e3,pI="installations",mI="Installations";/**
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
 */const gI={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},sn=new an(pI,mI,gI);function kf(n){return n instanceof je&&n.code.includes("request-failed")}/**
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
 */function Nf({projectId:n}){return`${dI}/projects/${n}/installations`}function Df(n){return{token:n.token,requestStatus:2,expiresIn:yI(n.expiresIn),creationTime:Date.now()}}async function Vf(n,e){const r=(await e.json()).error;return sn.create("request-failed",{requestName:n,serverCode:r.code,serverMessage:r.message,serverStatus:r.status})}function Of({apiKey:n}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":n})}function _I(n,{refreshToken:e}){const t=Of(n);return t.append("Authorization",vI(e)),t}async function Lf(n){const e=await n();return e.status>=500&&e.status<600?n():e}function yI(n){return Number(n.replace("s","000"))}function vI(n){return`${Cf} ${n}`}/**
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
 */async function TI({appConfig:n,heartbeatServiceProvider:e},{fid:t}){const r=Nf(n),i=Of(n),s=e.getImmediate({optional:!0});if(s){const d=await s.getHeartbeatsHeader();d&&i.append("x-firebase-client",d)}const a={fid:t,authVersion:Cf,appId:n.appId,sdkVersion:Pf},c={method:"POST",headers:i,body:JSON.stringify(a)},l=await Lf(()=>fetch(r,c));if(l.ok){const d=await l.json();return{fid:d.fid||t,registrationStatus:2,refreshToken:d.refreshToken,authToken:Df(d.authToken)}}else throw await Vf("Create Installation",l)}/**
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
 */function Mf(n){return new Promise(e=>{setTimeout(e,n)})}/**
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
 */function EI(n){return btoa(String.fromCharCode(...n)).replace(/\+/g,"-").replace(/\//g,"_")}/**
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
 */const II=/^[cdef][\w-]{21}$/,Po="";function wI(){try{const n=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(n),n[0]=112+n[0]%16;const t=AI(n);return II.test(t)?t:Po}catch{return Po}}function AI(n){return EI(n).substr(0,22)}/**
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
 */function _s(n){return`${n.appName}!${n.appId}`}/**
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
 */const xf=new Map;function Uf(n,e){const t=_s(n);Ff(t,e),RI(t,e)}function Ff(n,e){const t=xf.get(n);if(t)for(const r of t)r(e)}function RI(n,e){const t=bI();t&&t.postMessage({key:n,fid:e}),SI()}let Xt=null;function bI(){return!Xt&&"BroadcastChannel"in self&&(Xt=new BroadcastChannel("[Firebase] FID Change"),Xt.onmessage=n=>{Ff(n.data.key,n.data.fid)}),Xt}function SI(){xf.size===0&&Xt&&(Xt.close(),Xt=null)}/**
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
 */const PI="firebase-installations-database",CI=1,on="firebase-installations-store";let Zs=null;function Ba(){return Zs||(Zs=Vl(PI,CI,{upgrade:(n,e)=>{switch(e){case 0:n.createObjectStore(on)}}})),Zs}async function Ui(n,e){const t=_s(n),i=(await Ba()).transaction(on,"readwrite"),s=i.objectStore(on),a=await s.get(t);return await s.put(e,t),await i.done,(!a||a.fid!==e.fid)&&Uf(n,e.fid),e}async function Bf(n){const e=_s(n),r=(await Ba()).transaction(on,"readwrite");await r.objectStore(on).delete(e),await r.done}async function ys(n,e){const t=_s(n),i=(await Ba()).transaction(on,"readwrite"),s=i.objectStore(on),a=await s.get(t),c=e(a);return c===void 0?await s.delete(t):await s.put(c,t),await i.done,c&&(!a||a.fid!==c.fid)&&Uf(n,c.fid),c}/**
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
 */async function ja(n){let e;const t=await ys(n.appConfig,r=>{const i=kI(r),s=NI(n,i);return e=s.registrationPromise,s.installationEntry});return t.fid===Po?{installationEntry:await e}:{installationEntry:t,registrationPromise:e}}function kI(n){const e=n||{fid:wI(),registrationStatus:0};return jf(e)}function NI(n,e){if(e.registrationStatus===0){if(!navigator.onLine){const i=Promise.reject(sn.create("app-offline"));return{installationEntry:e,registrationPromise:i}}const t={fid:e.fid,registrationStatus:1,registrationTime:Date.now()},r=DI(n,t);return{installationEntry:t,registrationPromise:r}}else return e.registrationStatus===1?{installationEntry:e,registrationPromise:VI(n)}:{installationEntry:e}}async function DI(n,e){try{const t=await TI(n,e);return Ui(n.appConfig,t)}catch(t){throw kf(t)&&t.customData.serverCode===409?await Bf(n.appConfig):await Ui(n.appConfig,{fid:e.fid,registrationStatus:0}),t}}async function VI(n){let e=await Il(n.appConfig);for(;e.registrationStatus===1;)await Mf(100),e=await Il(n.appConfig);if(e.registrationStatus===0){const{installationEntry:t,registrationPromise:r}=await ja(n);return r||t}return e}function Il(n){return ys(n,e=>{if(!e)throw sn.create("installation-not-found");return jf(e)})}function jf(n){return OI(n)?{fid:n.fid,registrationStatus:0}:n}function OI(n){return n.registrationStatus===1&&n.registrationTime+Sf<Date.now()}/**
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
 */async function LI({appConfig:n,heartbeatServiceProvider:e},t){const r=MI(n,t),i=_I(n,t),s=e.getImmediate({optional:!0});if(s){const d=await s.getHeartbeatsHeader();d&&i.append("x-firebase-client",d)}const a={installation:{sdkVersion:Pf,appId:n.appId}},c={method:"POST",headers:i,body:JSON.stringify(a)},l=await Lf(()=>fetch(r,c));if(l.ok){const d=await l.json();return Df(d)}else throw await Vf("Generate Auth Token",l)}function MI(n,{fid:e}){return`${Nf(n)}/${e}/authTokens:generate`}/**
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
 */async function $a(n,e=!1){let t;const r=await ys(n.appConfig,s=>{if(!$f(s))throw sn.create("not-registered");const a=s.authToken;if(!e&&FI(a))return s;if(a.requestStatus===1)return t=xI(n,e),s;{if(!navigator.onLine)throw sn.create("app-offline");const c=jI(s);return t=UI(n,c),c}});return t?await t:r.authToken}async function xI(n,e){let t=await wl(n.appConfig);for(;t.authToken.requestStatus===1;)await Mf(100),t=await wl(n.appConfig);const r=t.authToken;return r.requestStatus===0?$a(n,e):r}function wl(n){return ys(n,e=>{if(!$f(e))throw sn.create("not-registered");const t=e.authToken;return $I(t)?Object.assign(Object.assign({},e),{authToken:{requestStatus:0}}):e})}async function UI(n,e){try{const t=await LI(n,e),r=Object.assign(Object.assign({},e),{authToken:t});return await Ui(n.appConfig,r),t}catch(t){if(kf(t)&&(t.customData.serverCode===401||t.customData.serverCode===404))await Bf(n.appConfig);else{const r=Object.assign(Object.assign({},e),{authToken:{requestStatus:0}});await Ui(n.appConfig,r)}throw t}}function $f(n){return n!==void 0&&n.registrationStatus===2}function FI(n){return n.requestStatus===2&&!BI(n)}function BI(n){const e=Date.now();return e<n.creationTime||n.creationTime+n.expiresIn<e+fI}function jI(n){const e={requestStatus:1,requestTime:Date.now()};return Object.assign(Object.assign({},n),{authToken:e})}function $I(n){return n.requestStatus===1&&n.requestTime+Sf<Date.now()}/**
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
 */async function qI(n){const e=n,{installationEntry:t,registrationPromise:r}=await ja(e);return r?r.catch(console.error):$a(e).catch(console.error),t.fid}/**
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
 */async function zI(n,e=!1){const t=n;return await HI(t),(await $a(t,e)).token}async function HI(n){const{registrationPromise:e}=await ja(n);e&&await e}/**
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
 */function GI(n){if(!n||!n.options)throw eo("App Configuration");if(!n.name)throw eo("App Name");const e=["projectId","apiKey","appId"];for(const t of e)if(!n.options[t])throw eo(t);return{appName:n.name,projectId:n.options.projectId,apiKey:n.options.apiKey,appId:n.options.appId}}function eo(n){return sn.create("missing-app-config-values",{valueName:n})}/**
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
 */const qf="installations",WI="installations-internal",KI=n=>{const e=n.getProvider("app").getImmediate(),t=GI(e),r=Et(e,"heartbeat");return{app:e,appConfig:t,heartbeatServiceProvider:r,_delete:()=>Promise.resolve()}},QI=n=>{const e=n.getProvider("app").getImmediate(),t=Et(e,qf).getImmediate();return{getId:()=>qI(t),getToken:i=>zI(t,i)}};function JI(){ze(new Be(qf,KI,"PUBLIC")),ze(new Be(WI,QI,"PRIVATE"))}JI();Re(bf,Fa);Re(bf,Fa,"esm2017");/**
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
 */const Fi="analytics",XI="firebase_id",YI="origin",ZI=60*1e3,ew="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",qa="https://www.googletagmanager.com/gtag/js";/**
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
 */const Le=new Hi("@firebase/analytics");/**
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
 */const tw={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},Fe=new an("analytics","Analytics",tw);/**
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
 */function nw(n){if(!n.startsWith(qa)){const e=Fe.create("invalid-gtag-resource",{gtagURL:n});return Le.warn(e.message),""}return n}function zf(n){return Promise.all(n.map(e=>e.catch(t=>t)))}function rw(n,e){let t;return window.trustedTypes&&(t=window.trustedTypes.createPolicy(n,e)),t}function iw(n,e){const t=rw("firebase-js-sdk-policy",{createScriptURL:nw}),r=document.createElement("script"),i=`${qa}?l=${n}&id=${e}`;r.src=t?t==null?void 0:t.createScriptURL(i):i,r.async=!0,document.head.appendChild(r)}function sw(n){let e=[];return Array.isArray(window[n])?e=window[n]:window[n]=e,e}async function ow(n,e,t,r,i,s){const a=r[i];try{if(a)await e[a];else{const l=(await zf(t)).find(d=>d.measurementId===i);l&&await e[l.appId]}}catch(c){Le.error(c)}n("config",i,s)}async function aw(n,e,t,r,i){try{let s=[];if(i&&i.send_to){let a=i.send_to;Array.isArray(a)||(a=[a]);const c=await zf(t);for(const l of a){const d=c.find(m=>m.measurementId===l),f=d&&e[d.appId];if(f)s.push(f);else{s=[];break}}}s.length===0&&(s=Object.values(e)),await Promise.all(s),n("event",r,i||{})}catch(s){Le.error(s)}}function cw(n,e,t,r){async function i(s,...a){try{if(s==="event"){const[c,l]=a;await aw(n,e,t,c,l)}else if(s==="config"){const[c,l]=a;await ow(n,e,t,r,c,l)}else if(s==="consent"){const[c,l]=a;n("consent",c,l)}else if(s==="get"){const[c,l,d]=a;n("get",c,l,d)}else if(s==="set"){const[c]=a;n("set",c)}else n(s,...a)}catch(c){Le.error(c)}}return i}function uw(n,e,t,r,i){let s=function(...a){window[r].push(arguments)};return window[i]&&typeof window[i]=="function"&&(s=window[i]),window[i]=cw(s,n,e,t),{gtagCore:s,wrappedGtag:window[i]}}function lw(n){const e=window.document.getElementsByTagName("script");for(const t of Object.values(e))if(t.src&&t.src.includes(qa)&&t.src.includes(n))return t;return null}/**
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
 */const hw=30,dw=1e3;class fw{constructor(e={},t=dw){this.throttleMetadata=e,this.intervalMillis=t}getThrottleMetadata(e){return this.throttleMetadata[e]}setThrottleMetadata(e,t){this.throttleMetadata[e]=t}deleteThrottleMetadata(e){delete this.throttleMetadata[e]}}const Hf=new fw;function pw(n){return new Headers({Accept:"application/json","x-goog-api-key":n})}async function mw(n){var e;const{appId:t,apiKey:r}=n,i={method:"GET",headers:pw(r)},s=ew.replace("{app-id}",t),a=await fetch(s,i);if(a.status!==200&&a.status!==304){let c="";try{const l=await a.json();!((e=l.error)===null||e===void 0)&&e.message&&(c=l.error.message)}catch{}throw Fe.create("config-fetch-failed",{httpStatus:a.status,responseMessage:c})}return a.json()}async function gw(n,e=Hf,t){const{appId:r,apiKey:i,measurementId:s}=n.options;if(!r)throw Fe.create("no-app-id");if(!i){if(s)return{measurementId:s,appId:r};throw Fe.create("no-api-key")}const a=e.getThrottleMetadata(r)||{backoffCount:0,throttleEndTimeMillis:Date.now()},c=new vw;return setTimeout(async()=>{c.abort()},ZI),Gf({appId:r,apiKey:i,measurementId:s},a,c,e)}async function Gf(n,{throttleEndTimeMillis:e,backoffCount:t},r,i=Hf){var s;const{appId:a,measurementId:c}=n;try{await _w(r,e)}catch(l){if(c)return Le.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${c} provided in the "measurementId" field in the local Firebase config. [${l==null?void 0:l.message}]`),{appId:a,measurementId:c};throw l}try{const l=await mw(n);return i.deleteThrottleMetadata(a),l}catch(l){const d=l;if(!yw(d)){if(i.deleteThrottleMetadata(a),c)return Le.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${c} provided in the "measurementId" field in the local Firebase config. [${d==null?void 0:d.message}]`),{appId:a,measurementId:c};throw l}const f=Number((s=d==null?void 0:d.customData)===null||s===void 0?void 0:s.httpStatus)===503?Kc(t,i.intervalMillis,hw):Kc(t,i.intervalMillis),m={throttleEndTimeMillis:Date.now()+f,backoffCount:t+1};return i.setThrottleMetadata(a,m),Le.debug(`Calling attemptFetch again in ${f} millis`),Gf(n,m,r,i)}}function _w(n,e){return new Promise((t,r)=>{const i=Math.max(e-Date.now(),0),s=setTimeout(t,i);n.addEventListener(()=>{clearTimeout(s),r(Fe.create("fetch-throttle",{throttleEndTimeMillis:e}))})})}function yw(n){if(!(n instanceof je)||!n.customData)return!1;const e=Number(n.customData.httpStatus);return e===429||e===500||e===503||e===504}class vw{constructor(){this.listeners=[]}addEventListener(e){this.listeners.push(e)}abort(){this.listeners.forEach(e=>e())}}async function Tw(n,e,t,r,i){if(i&&i.global){n("event",t,r);return}else{const s=await e,a=Object.assign(Object.assign({},r),{send_to:s});n("event",t,a)}}/**
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
 */async function Ew(){if(Vo())try{await Oo()}catch(n){return Le.warn(Fe.create("indexeddb-unavailable",{errorInfo:n==null?void 0:n.toString()}).message),!1}else return Le.warn(Fe.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function Iw(n,e,t,r,i,s,a){var c;const l=gw(n);l.then(R=>{t[R.measurementId]=R.appId,n.options.measurementId&&R.measurementId!==n.options.measurementId&&Le.warn(`The measurement ID in the local Firebase config (${n.options.measurementId}) does not match the measurement ID fetched from the server (${R.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(R=>Le.error(R)),e.push(l);const d=Ew().then(R=>{if(R)return r.getId()}),[f,m]=await Promise.all([l,d]);lw(s)||iw(s,f.measurementId),i("js",new Date);const _=(c=a==null?void 0:a.config)!==null&&c!==void 0?c:{};return _[YI]="firebase",_.update=!0,m!=null&&(_[XI]=m),i("config",f.measurementId,_),f.measurementId}/**
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
 */class ww{constructor(e){this.app=e}_delete(){return delete mr[this.app.options.appId],Promise.resolve()}}let mr={},Al=[];const Rl={};let to="dataLayer",Aw="gtag",bl,Wf,Sl=!1;function Rw(){const n=[];if(Do()&&n.push("This is a browser extension environment."),jl()||n.push("Cookies are not available."),n.length>0){const e=n.map((r,i)=>`(${i+1}) ${r}`).join(" "),t=Fe.create("invalid-analytics-context",{errorInfo:e});Le.warn(t.message)}}function bw(n,e,t){Rw();const r=n.options.appId;if(!r)throw Fe.create("no-app-id");if(!n.options.apiKey)if(n.options.measurementId)Le.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${n.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw Fe.create("no-api-key");if(mr[r]!=null)throw Fe.create("already-exists",{id:r});if(!Sl){sw(to);const{wrappedGtag:s,gtagCore:a}=uw(mr,Al,Rl,to,Aw);Wf=s,bl=a,Sl=!0}return mr[r]=Iw(n,Al,Rl,e,bl,to,t),new ww(n)}function TA(n=Pr()){n=X(n);const e=Et(n,Fi);return e.isInitialized()?e.getImmediate():Sw(n)}function Sw(n,e={}){const t=Et(n,Fi);if(t.isInitialized()){const i=t.getImmediate();if(pt(e,t.getOptions()))return i;throw Fe.create("already-initialized")}return t.initialize({options:e})}async function EA(){if(Do()||!jl()||!Vo())return!1;try{return await Oo()}catch{return!1}}function Pw(n,e,t,r){n=X(n),Tw(Wf,mr[n.app.options.appId],e,t,r).catch(i=>Le.error(i))}const Pl="@firebase/analytics",Cl="0.10.17";function Cw(){ze(new Be(Fi,(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("installations-internal").getImmediate();return bw(r,i,t)},"PUBLIC")),ze(new Be("analytics-internal",n,"PRIVATE")),Re(Pl,Cl),Re(Pl,Cl,"esm2017");function n(e){try{const t=e.getProvider(Fi).getImmediate();return{logEvent:(r,i,s)=>Pw(t,r,i,s)}}catch(t){throw Fe.create("interop-component-reg-failed",{reason:t})}}}Cw();/**
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
 */const kw="type.googleapis.com/google.protobuf.Int64Value",Nw="type.googleapis.com/google.protobuf.UInt64Value";function Kf(n,e){const t={};for(const r in n)n.hasOwnProperty(r)&&(t[r]=e(n[r]));return t}function Bi(n){if(n==null)return null;if(n instanceof Number&&(n=n.valueOf()),typeof n=="number"&&isFinite(n)||n===!0||n===!1||Object.prototype.toString.call(n)==="[object String]")return n;if(n instanceof Date)return n.toISOString();if(Array.isArray(n))return n.map(e=>Bi(e));if(typeof n=="function"||typeof n=="object")return Kf(n,e=>Bi(e));throw new Error("Data cannot be encoded in JSON: "+n)}function kn(n){if(n==null)return n;if(n["@type"])switch(n["@type"]){case kw:case Nw:{const e=Number(n.value);if(isNaN(e))throw new Error("Data cannot be decoded from JSON: "+n);return e}default:throw new Error("Data cannot be decoded from JSON: "+n)}return Array.isArray(n)?n.map(e=>kn(e)):typeof n=="function"||typeof n=="object"?Kf(n,e=>kn(e)):n}/**
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
 */const za="functions";/**
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
 */const kl={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class Ve extends je{constructor(e,t,r){super(`${za}/${e}`,t||""),this.details=r,Object.setPrototypeOf(this,Ve.prototype)}}function Dw(n){if(n>=200&&n<300)return"ok";switch(n){case 0:return"internal";case 400:return"invalid-argument";case 401:return"unauthenticated";case 403:return"permission-denied";case 404:return"not-found";case 409:return"aborted";case 429:return"resource-exhausted";case 499:return"cancelled";case 500:return"internal";case 501:return"unimplemented";case 503:return"unavailable";case 504:return"deadline-exceeded"}return"unknown"}function ji(n,e){let t=Dw(n),r=t,i;try{const s=e&&e.error;if(s){const a=s.status;if(typeof a=="string"){if(!kl[a])return new Ve("internal","internal");t=kl[a],r=a}const c=s.message;typeof c=="string"&&(r=c),i=s.details,i!==void 0&&(i=kn(i))}}catch{}return t==="ok"?null:new Ve(t,r,i)}/**
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
 */class Vw{constructor(e,t,r,i){this.app=e,this.auth=null,this.messaging=null,this.appCheck=null,this.serverAppAppCheckToken=null,Ne(e)&&e.settings.appCheckToken&&(this.serverAppAppCheckToken=e.settings.appCheckToken),this.auth=t.getImmediate({optional:!0}),this.messaging=r.getImmediate({optional:!0}),this.auth||t.get().then(s=>this.auth=s,()=>{}),this.messaging||r.get().then(s=>this.messaging=s,()=>{}),this.appCheck||i==null||i.get().then(s=>this.appCheck=s,()=>{})}async getAuthToken(){if(this.auth)try{const e=await this.auth.getToken();return e==null?void 0:e.accessToken}catch{return}}async getMessagingToken(){if(!(!this.messaging||!("Notification"in self)||Notification.permission!=="granted"))try{return await this.messaging.getToken()}catch{return}}async getAppCheckToken(e){if(this.serverAppAppCheckToken)return this.serverAppAppCheckToken;if(this.appCheck){const t=e?await this.appCheck.getLimitedUseToken():await this.appCheck.getToken();return t.error?null:t.token}return null}async getContext(e){const t=await this.getAuthToken(),r=await this.getMessagingToken(),i=await this.getAppCheckToken(e);return{authToken:t,messagingToken:r,appCheckToken:i}}}/**
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
 */const Co="us-central1",Ow=/^data: (.*?)(?:\n|$)/;function Lw(n){let e=null;return{promise:new Promise((t,r)=>{e=setTimeout(()=>{r(new Ve("deadline-exceeded","deadline-exceeded"))},n)}),cancel:()=>{e&&clearTimeout(e)}}}class Mw{constructor(e,t,r,i,s=Co,a=(...c)=>fetch(...c)){this.app=e,this.fetchImpl=a,this.emulatorOrigin=null,this.contextProvider=new Vw(e,t,r,i),this.cancelAllRequests=new Promise(c=>{this.deleteService=()=>Promise.resolve(c())});try{const c=new URL(s);this.customDomain=c.origin+(c.pathname==="/"?"":c.pathname),this.region=Co}catch{this.customDomain=null,this.region=s}}_delete(){return this.deleteService()}_url(e){const t=this.app.options.projectId;return this.emulatorOrigin!==null?`${this.emulatorOrigin}/${t}/${this.region}/${e}`:this.customDomain!==null?`${this.customDomain}/${e}`:`https://${this.region}-${t}.cloudfunctions.net/${e}`}}function xw(n,e,t){const r=Tt(e);n.emulatorOrigin=`http${r?"s":""}://${e}:${t}`,r&&(qi(n.emulatorOrigin),zi("Functions",!0))}function Uw(n,e,t){const r=i=>Bw(n,e,i,{});return r.stream=(i,s)=>$w(n,e,i,s),r}async function Fw(n,e,t,r){t["Content-Type"]="application/json";let i;try{i=await r(n,{method:"POST",body:JSON.stringify(e),headers:t})}catch{return{status:0,json:null}}let s=null;try{s=await i.json()}catch{}return{status:i.status,json:s}}async function Qf(n,e){const t={},r=await n.contextProvider.getContext(e.limitedUseAppCheckTokens);return r.authToken&&(t.Authorization="Bearer "+r.authToken),r.messagingToken&&(t["Firebase-Instance-ID-Token"]=r.messagingToken),r.appCheckToken!==null&&(t["X-Firebase-AppCheck"]=r.appCheckToken),t}function Bw(n,e,t,r){const i=n._url(e);return jw(n,i,t,r)}async function jw(n,e,t,r){t=Bi(t);const i={data:t},s=await Qf(n,r),a=r.timeout||7e4,c=Lw(a),l=await Promise.race([Fw(e,i,s,n.fetchImpl),c.promise,n.cancelAllRequests]);if(c.cancel(),!l)throw new Ve("cancelled","Firebase Functions instance was deleted.");const d=ji(l.status,l.json);if(d)throw d;if(!l.json)throw new Ve("internal","Response is not valid JSON object.");let f=l.json.data;if(typeof f>"u"&&(f=l.json.result),typeof f>"u")throw new Ve("internal","Response is missing data field.");return{data:kn(f)}}function $w(n,e,t,r){const i=n._url(e);return qw(n,i,t,r||{})}async function qw(n,e,t,r){var i;t=Bi(t);const s={data:t},a=await Qf(n,r);a["Content-Type"]="application/json",a.Accept="text/event-stream";let c;try{c=await n.fetchImpl(e,{method:"POST",body:JSON.stringify(s),headers:a,signal:r==null?void 0:r.signal})}catch(R){if(R instanceof Error&&R.name==="AbortError"){const D=new Ve("cancelled","Request was cancelled.");return{data:Promise.reject(D),stream:{[Symbol.asyncIterator](){return{next(){return Promise.reject(D)}}}}}}const C=ji(0,null);return{data:Promise.reject(C),stream:{[Symbol.asyncIterator](){return{next(){return Promise.reject(C)}}}}}}let l,d;const f=new Promise((R,C)=>{l=R,d=C});(i=r==null?void 0:r.signal)===null||i===void 0||i.addEventListener("abort",()=>{const R=new Ve("cancelled","Request was cancelled.");d(R)});const m=c.body.getReader(),_=zw(m,l,d,r==null?void 0:r.signal);return{stream:{[Symbol.asyncIterator](){const R=_.getReader();return{async next(){const{value:C,done:D}=await R.read();return{value:C,done:D}},async return(){return await R.cancel(),{done:!0,value:void 0}}}}},data:f}}function zw(n,e,t,r){const i=(a,c)=>{const l=a.match(Ow);if(!l)return;const d=l[1];try{const f=JSON.parse(d);if("result"in f){e(kn(f.result));return}if("message"in f){c.enqueue(kn(f.message));return}if("error"in f){const m=ji(0,f);c.error(m),t(m);return}}catch(f){if(f instanceof Ve){c.error(f),t(f);return}}},s=new TextDecoder;return new ReadableStream({start(a){let c="";return l();async function l(){if(r!=null&&r.aborted){const d=new Ve("cancelled","Request was cancelled");return a.error(d),t(d),Promise.resolve()}try{const{value:d,done:f}=await n.read();if(f){c.trim()&&i(c.trim(),a),a.close();return}if(r!=null&&r.aborted){const _=new Ve("cancelled","Request was cancelled");a.error(_),t(_),await n.cancel();return}c+=s.decode(d,{stream:!0});const m=c.split(`
`);c=m.pop()||"";for(const _ of m)_.trim()&&i(_.trim(),a);return l()}catch(d){const f=d instanceof Ve?d:ji(0,null);a.error(f),t(f)}}},cancel(){return n.cancel()}})}const Nl="@firebase/functions",Dl="0.12.9";/**
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
 */const Hw="auth-internal",Gw="app-check-internal",Ww="messaging-internal";function Kw(n){const e=(t,{instanceIdentifier:r})=>{const i=t.getProvider("app").getImmediate(),s=t.getProvider(Hw),a=t.getProvider(Ww),c=t.getProvider(Gw);return new Mw(i,s,a,c,r)};ze(new Be(za,e,"PUBLIC").setMultipleInstances(!0)),Re(Nl,Dl,n),Re(Nl,Dl,"esm2017")}/**
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
 */function IA(n=Pr(),e=Co){const r=Et(X(n),za).getImmediate({identifier:e}),i=No("functions");return i&&Qw(r,...i),r}function Qw(n,e,t){xw(X(n),e,t)}function wA(n,e,t){return Uw(X(n),e)}Kw();export{pA as A,u_ as B,a_ as C,iA as D,sA as E,hA as F,ct as G,Yw as H,G_ as a,tA as b,vA as c,EA as d,TA as e,aA as f,Xw as g,eA as h,Gm as i,oA as j,qT as k,lA as l,dA as m,IA as n,Mg as o,wA as p,nA as q,cA as r,xg as s,fA as t,uA as u,yA as v,rA as w,gA as x,_A as y,mA as z};
