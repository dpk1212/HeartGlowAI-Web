exports.id=339,exports.ids=[339],exports.modules={9406:(e,t,r)=>{"use strict";r.a(e,async(e,a)=>{try{r.d(t,{Z:()=>c});var o=r(997),s=r(6689),n=r(1163),l=r(1503),i=e([l]);l=(i.then?(await i)():i)[0];let c=({children:e})=>{let{currentUser:t,loading:r}=(0,l.a)(),a=(0,n.useRouter)();return((0,s.useEffect)(()=>{r||t||a.push("/login")},[t,r,a]),r)?o.jsx("div",{className:"flex items-center justify-center min-h-screen",children:o.jsx("div",{className:"animate-pulse",children:o.jsx("h2",{className:"text-2xl font-medium text-heartglow-charcoal dark:text-heartglow-offwhite",children:"Verifying your identity..."})})}):t?o.jsx(o.Fragment,{children:e}):null};a()}catch(e){a(e)}})},3475:(e,t,r)=>{"use strict";r.a(e,async(e,a)=>{try{r.d(t,{Z:()=>d});var o=r(997);r(6689);var s=r(1503),n=r(1664),l=r.n(n),i=e([s]);s=(i.then?(await i)():i)[0];let c=e=>`/dashboard${e}`,d=({children:e})=>{let{currentUser:t,logout:r}=(0,s.a)(),a=async()=>{try{await r()}catch(e){console.error("Error signing out:",e)}};return(0,o.jsxs)("div",{className:"min-h-screen flex flex-col bg-heartglow-offwhite dark:bg-heartglow-charcoal",children:[o.jsx("header",{className:"bg-heartglow-charcoal text-white py-4 px-6 shadow-md",children:(0,o.jsxs)("div",{className:"container mx-auto flex justify-between items-center",children:[o.jsx(l(),{href:c("/dashboard"),className:"text-xl font-bold text-heartglow-pink",children:"HeartGlow"}),o.jsx("div",{className:"flex items-center gap-4",children:t&&(0,o.jsxs)(o.Fragment,{children:[o.jsx("span",{className:"text-sm text-gray-300",children:t.email}),o.jsx("button",{onClick:a,className:"bg-heartglow-deepgray hover:bg-heartglow-indigo px-3 py-1 rounded-md text-sm transition-colors duration-200",children:"Sign Out"})]})})]})}),o.jsx("main",{className:"flex-grow",children:o.jsx("div",{className:"container mx-auto py-8 px-4",children:e})}),o.jsx("footer",{className:"bg-heartglow-charcoal text-white py-4 mt-auto",children:(0,o.jsxs)("div",{className:"container mx-auto px-4 text-center text-sm text-gray-400",children:["\xa9 ",new Date().getFullYear()," HeartGlow AI. All rights reserved."]})})]})};a()}catch(e){a(e)}})},145:(e,t,r)=>{"use strict";r.d(t,{Z:()=>o});var a=r(997);r(6689);let o=()=>(0,a.jsxs)("div",{className:"bg-heartglow-charcoal text-white p-8 rounded-lg shadow-lg mb-8",children:[a.jsx("h2",{className:"text-2xl font-bold mb-4",children:'Coming Soon: "Feel This For Me"'}),a.jsx("p",{className:"text-gray-300 mb-6",children:"Send anonymous emotional requests to your connections, letting them respond with heartfelt messages when you need them most."}),a.jsx("div",{className:"text-sm text-gray-400 bg-heartglow-deepgray px-4 py-2 inline-block rounded-md",children:"Available in Premium Plan"})]})},8632:(e,t,r)=>{"use strict";r.d(t,{Z:()=>o});var a=r(997);r(6689);let o=()=>(0,a.jsxs)("div",{className:"mb-12",children:[a.jsx("h2",{className:"text-xl font-bold mb-4 text-heartglow-charcoal dark:text-heartglow-offwhite",children:"Your Connections"}),(0,a.jsxs)("div",{className:"bg-white dark:bg-heartglow-deepgray p-6 rounded-lg shadow-md",children:[a.jsx("p",{className:"text-gray-600 dark:text-gray-400 mb-6",children:"This component is coming soon in the next implementation phase."}),a.jsx("div",{className:"text-center text-sm text-gray-500 dark:text-gray-400",children:"Component placeholder"})]})]})},1211:(e,t,r)=>{"use strict";r.d(t,{Z:()=>l});var a=r(997);r(6689);var o=r(1664),s=r.n(o);let n=e=>`/dashboard${e}`,l=()=>a.jsx("div",{className:"bg-white dark:bg-heartglow-deepgray rounded-lg shadow-md p-8 mb-8",children:(0,a.jsxs)("div",{className:"max-w-2xl mx-auto text-center",children:[a.jsx("h1",{className:"text-3xl md:text-4xl font-bold mb-4 text-heartglow-charcoal dark:text-heartglow-offwhite",children:"Say what matters. Gently."}),a.jsx("p",{className:"text-gray-600 dark:text-gray-300 mb-6",children:"Craft AI-powered messages for tough conversations. Reconnect, apologize, or open up — without overthinking it."}),a.jsx(s(),{href:n("/create"),className:"inline-block bg-gradient-to-r from-heartglow-pink to-heartglow-violet hover:from-heartglow-violet hover:to-heartglow-indigo text-white font-medium rounded-full px-8 py-3 shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 animate-pulse-subtle",children:"Start a New Message"})]})})},7596:(e,t,r)=>{"use strict";r.d(t,{Z:()=>c});var a=r(997);r(6689);var o=r(1664),s=r.n(o);let n=e=>`/dashboard${e}`,l=[{id:"reconnect",title:"Reconnect",description:"Ready-made template to help you reconnect with care.",intent:"reconnect",tone:"sincere"},{id:"thank-you",title:"Thank You",description:"Ready-made template to help you thank you with care.",intent:"gratitude",tone:"warm"},{id:"apologize",title:"Apologize",description:"Ready-made template to help you apologize with care.",intent:"apology",tone:"sincere"},{id:"support",title:"Support",description:"Ready-made template to help you support with care.",intent:"support",tone:"empathetic"},{id:"celebrate",title:"Celebrate",description:"Ready-made template to help you celebrate with care.",intent:"celebration",tone:"excited"},{id:"request",title:"Request",description:"Ready-made template to help you request with care.",intent:"request",tone:"respectful"}],i=({template:e})=>(0,a.jsxs)(s(),{href:n(`/create?intent=${e.intent}&tone=${e.tone}`),className:"bg-white dark:bg-heartglow-deepgray p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-800",children:[a.jsx("h3",{className:"text-lg font-bold mb-2 text-heartglow-charcoal dark:text-heartglow-offwhite",children:e.title}),a.jsx("p",{className:"text-gray-600 dark:text-gray-400 text-sm",children:e.description})]}),c=()=>(0,a.jsxs)("div",{className:"mb-12",children:[a.jsx("h2",{className:"text-xl font-bold mb-4 text-heartglow-charcoal dark:text-heartglow-offwhite",children:"Quick Templates"}),a.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",children:l.map(e=>a.jsx(i,{template:e},e.id))})]})},2415:(e,t,r)=>{"use strict";r.d(t,{Z:()=>o});var a=r(997);r(6689);let o=()=>(0,a.jsxs)("div",{className:"mb-12",children:[a.jsx("h2",{className:"text-xl font-bold mb-4 text-heartglow-charcoal dark:text-heartglow-offwhite",children:"Recent Messages"}),(0,a.jsxs)("div",{className:"bg-white dark:bg-heartglow-deepgray p-6 rounded-lg shadow-md",children:[a.jsx("p",{className:"text-gray-600 dark:text-gray-400 mb-6",children:"This component is coming soon in the next implementation phase."}),a.jsx("div",{className:"text-center text-sm text-gray-500 dark:text-gray-400",children:"Component placeholder"})]})]})},1503:(e,t,r)=>{"use strict";r.a(e,async(e,a)=>{try{r.d(t,{H:()=>d,a:()=>c});var o=r(997),s=r(6689),n=r(34),l=e([n]);n=(l.then?(await l)():l)[0];let i=(0,s.createContext)(null),c=()=>{let e=(0,s.useContext)(i);if(!e)throw Error("useAuth must be used within an AuthProvider");return e},d=({children:e})=>{let[t,r]=(0,s.useState)(null),[a,l]=(0,s.useState)(!0);(0,s.useEffect)(()=>{let e=(0,n.V3)(e=>{r(e),l(!1)});return e},[]);let c=async(e,t)=>(0,n.zB)(e,t),d=async()=>(0,n.qj)(),h=async(e,t)=>(0,n.ub)(e,t),g=async()=>(0,n.ni)();return o.jsx(i.Provider,{value:{currentUser:t,loading:a,login:c,loginWithGoogle:d,signup:h,logout:g},children:e})};a()}catch(e){a(e)}})},34:(e,t,r)=>{"use strict";r.a(e,async(e,a)=>{try{r.d(t,{V3:()=>m,ni:()=>g,qj:()=>h,ub:()=>d,zB:()=>c});var o=r(401),s=r(4417),n=e([o,s]);[o,s]=n.then?(await n)():n;let l=(0,o.getAuth)(s.l),i=new o.GoogleAuthProvider,c=async(e,t)=>{try{return await (0,o.signInWithEmailAndPassword)(l,e,t)}catch(e){throw console.error("Error signing in:",e),e}},d=async(e,t)=>{try{return await (0,o.createUserWithEmailAndPassword)(l,e,t)}catch(e){throw console.error("Error signing up:",e),e}},h=async()=>{try{return await (0,o.signInWithPopup)(l,i)}catch(e){throw console.error("Error signing in with Google:",e),e}},g=async()=>{try{return await (0,o.signOut)(l)}catch(e){throw console.error("Error signing out:",e),e}},m=e=>(0,o.onAuthStateChanged)(l,e);a()}catch(e){a(e)}})},4417:(e,t,r)=>{"use strict";r.a(e,async(e,a)=>{try{r.d(t,{l:()=>l});var o=r(3745),s=r(1492),n=e([o,s]);[o,s]=n.then?(await n)():n;let l=(0,o.initializeApp)({apiKey:"AIzaSyBZiJPTs7dMccVgFV-YoTejnhy1bZNFEQY",authDomain:"heartglowai.firebaseapp.com",projectId:"heartglowai",storageBucket:"heartglowai.firebasestorage.app",messagingSenderId:"196565711798",appId:"1:196565711798:web:79e2b0320fd8e74ab0df17"});(0,s.getFirestore)(l),a()}catch(e){a(e)}})},4807:(e,t,r)=>{"use strict";r.a(e,async(e,a)=>{try{r.r(t),r.d(t,{default:()=>i,getRouteWithBasePath:()=>l});var o=r(997);r(6689);var s=r(1503);r(108);var n=e([s]);function l(e){return`/dashboard${e}`}s=(n.then?(await n)():n)[0];let i=function({Component:e,pageProps:t}){return o.jsx(s.H,{children:o.jsx(e,{...t})})};a()}catch(e){a(e)}})},5211:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>l});var a=r(997),o=r(6859),s=r.n(o);class n extends s(){static async getInitialProps(e){let t=await s().getInitialProps(e);return{...t}}render(){return(0,a.jsxs)(o.Html,{lang:"en",children:[(0,a.jsxs)(o.Head,{children:[a.jsx("link",{rel:"preconnect",href:"https://fonts.googleapis.com"}),a.jsx("link",{rel:"preconnect",href:"https://fonts.gstatic.com",crossOrigin:"anonymous"}),a.jsx("link",{href:"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",rel:"stylesheet"}),a.jsx("style",{dangerouslySetInnerHTML:{__html:`
            :root {
              --foreground-rgb: 0, 0, 0;
              --background-start-rgb: 249, 249, 249;
              --background-end-rgb: 255, 255, 255;
            }
            
            @media (prefers-color-scheme: dark) {
              :root {
                --foreground-rgb: 255, 255, 255;
                --background-start-rgb: 28, 28, 30;
                --background-end-rgb: 46, 46, 50;
              }
            }
            
            body {
              color: rgb(var(--foreground-rgb));
              background: linear-gradient(
                to bottom,
                transparent,
                rgb(var(--background-end-rgb))
              ) rgb(var(--background-start-rgb));
              font-family: 'Inter', sans-serif;
            }

            /* HeartGlow specific colors - fallback for tailwind */
            .bg-heartglow-offwhite { background-color: #F9F9F9; }
            .bg-heartglow-charcoal { background-color: #1C1C1E; }
            .bg-heartglow-deepgray { background-color: #2E2E32; }
            .text-heartglow-pink { color: #FF4F81; }
            .text-heartglow-violet { color: #8C30F5; }
            .text-heartglow-indigo { color: #5B37EB; }
            .text-heartglow-offwhite { color: #F9F9F9; }
            .text-heartglow-charcoal { color: #1C1C1E; }

            /* Dark mode overrides */
            .dark .bg-heartglow-offwhite { background-color: #1C1C1E; }
            .dark .bg-heartglow-charcoal { background-color: #1C1C1E; }
            .dark .text-heartglow-charcoal { color: #F9F9F9; }
            .dark .text-heartglow-offwhite { color: #F9F9F9; }
            
            /* Form elements and buttons */
            input, button, select, textarea {
              font-family: 'Inter', sans-serif;
            }
            
            /* Button gradient fallbacks */
            .btn-gradient {
              background: linear-gradient(135deg, #FF4F81, #8C30F5);
            }
            
            /* Ensure login form styling */
            .login-form {
              background-color: white;
              border-radius: 0.5rem;
              padding: 2rem;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            
            .dark .login-form {
              background-color: #2E2E32;
              color: #F9F9F9;
            }
          `}})]}),(0,a.jsxs)("body",{className:"bg-heartglow-offwhite dark:bg-heartglow-charcoal",children:[a.jsx(o.Main,{}),a.jsx(o.NextScript,{})]})]})}}let l=n},108:()=>{}};