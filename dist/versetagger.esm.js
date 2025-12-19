var oe=Object.defineProperty,ae=Object.defineProperties;var se=Object.getOwnPropertyDescriptors;var P=Object.getOwnPropertySymbols;var le=Object.prototype.hasOwnProperty,de=Object.prototype.propertyIsEnumerable;var O=(i,e,t)=>e in i?oe(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,m=(i,e)=>{for(var t in e||(e={}))le.call(e,t)&&O(i,t,e[t]);if(P)for(var t of P(e))de.call(e,t)&&O(i,t,e[t]);return i},C=(i,e)=>ae(i,se(e));var J={proxyUrl:"https://versetagger.alextran.org",hoverDelay:500,autoScan:!0,excludeSelectors:"code, pre, script, style, head, meta, title, link, noscript, svg, canvas, iframe, video, select, option, button, a, .no-verse-tagging",defaultVersion:"NIV",colorScheme:"auto",theme:"default",accessibility:{keyboardNav:!0,announceToScreenReaders:!0},referenceClass:"verse-reference",openLinksInNewTab:!0,debug:!1};function V(i){return C(m(m({},J),i),{accessibility:m(m({},J.accessibility),i.accessibility||{})})}function ce(i){if(i.proxyUrl)try{new URL(i.proxyUrl)}catch(e){throw new Error(`VerseTagger: Invalid proxyUrl "${i.proxyUrl}". Must be a valid URL.`)}if(i.colorScheme&&!["light","dark","auto"].includes(i.colorScheme))throw new Error(`VerseTagger: Invalid colorScheme "${i.colorScheme}". Must be "light", "dark", or "auto".`);if(i.hoverDelay!==void 0&&(i.hoverDelay<0||i.hoverDelay>5e3))throw new Error(`VerseTagger: Invalid hoverDelay "${i.hoverDelay}". Must be between 0 and 5000ms.`)}function F(i){return ce(i),V(i)}var z=[{name:"Genesis",code:"GEN",testament:"OT",abbreviations:["Gen"],alternateNames:[]},{name:"Exodus",code:"EXO",testament:"OT",abbreviations:["Ex"],alternateNames:[]},{name:"Leviticus",code:"LEV",testament:"OT",abbreviations:["Lev"],alternateNames:[]},{name:"Numbers",code:"NUM",testament:"OT",abbreviations:["Num"],alternateNames:[]},{name:"Deuteronomy",code:"DEU",testament:"OT",abbreviations:["Deut"],alternateNames:[]},{name:"Joshua",code:"JOS",testament:"OT",abbreviations:["Josh"],alternateNames:[]},{name:"Judges",code:"JDG",testament:"OT",abbreviations:["Judg"],alternateNames:[]},{name:"Ruth",code:"RUT",testament:"OT",abbreviations:[],alternateNames:[]},{name:"1 Samuel",code:"1SA",testament:"OT",abbreviations:["1 Sam"],alternateNames:[]},{name:"2 Samuel",code:"2SA",testament:"OT",abbreviations:["2 Sam"],alternateNames:[]},{name:"1 Kings",code:"1KI",testament:"OT",abbreviations:[],alternateNames:[]},{name:"2 Kings",code:"2KI",testament:"OT",abbreviations:[],alternateNames:[]},{name:"1 Chronicles",code:"1CH",testament:"OT",abbreviations:["1 Chron"],alternateNames:[]},{name:"2 Chronicles",code:"2CH",testament:"OT",abbreviations:["2 Chron"],alternateNames:[]},{name:"Ezra",code:"EZR",testament:"OT",abbreviations:[],alternateNames:[]},{name:"Nehemiah",code:"NEH",testament:"OT",abbreviations:["Neh"],alternateNames:[]},{name:"Esther",code:"EST",testament:"OT",abbreviations:["Est"],alternateNames:[]},{name:"Job",code:"JOB",testament:"OT",abbreviations:[],alternateNames:[]},{name:"Psalm",code:"PSA",testament:"OT",abbreviations:["Ps"],alternateNames:[]},{name:"Proverbs",code:"PRO",testament:"OT",abbreviations:["Prov"],alternateNames:[]},{name:"Ecclesiastes",code:"ECC",testament:"OT",abbreviations:["Eccles"],alternateNames:[]},{name:"Song of Solomon",code:"SNG",testament:"OT",abbreviations:["Song"],alternateNames:[]},{name:"Isaiah",code:"ISA",testament:"OT",abbreviations:["Isa"],alternateNames:[]},{name:"Jeremiah",code:"JER",testament:"OT",abbreviations:["Jer"],alternateNames:[]},{name:"Lamentations",code:"LAM",testament:"OT",abbreviations:["Lam"],alternateNames:[]},{name:"Ezekiel",code:"EZK",testament:"OT",abbreviations:["Ezek"],alternateNames:[]},{name:"Daniel",code:"DAN",testament:"OT",abbreviations:["Dan"],alternateNames:[]},{name:"Hosea",code:"HOS",testament:"OT",abbreviations:["Hos"],alternateNames:[]},{name:"Joel",code:"JOL",testament:"OT",abbreviations:[],alternateNames:[]},{name:"Amos",code:"AMO",testament:"OT",abbreviations:[],alternateNames:[]},{name:"Obadiah",code:"OBA",testament:"OT",abbreviations:["Obad"],alternateNames:[]},{name:"Jonah",code:"JON",testament:"OT",abbreviations:[],alternateNames:[]},{name:"Micah",code:"MIC",testament:"OT",abbreviations:["Mic"],alternateNames:[]},{name:"Nahum",code:"NAM",testament:"OT",abbreviations:["Nah"],alternateNames:[]},{name:"Habakkuk",code:"HAB",testament:"OT",abbreviations:["Hab"],alternateNames:[]},{name:"Zephaniah",code:"ZEP",testament:"OT",abbreviations:["Zeph"],alternateNames:[]},{name:"Haggai",code:"HAG",testament:"OT",abbreviations:["Hag"],alternateNames:[]},{name:"Zechariah",code:"ZEC",testament:"OT",abbreviations:["Zech"],alternateNames:[]},{name:"Malachi",code:"MAL",testament:"OT",abbreviations:["Mal"],alternateNames:[]},{name:"Matthew",code:"MAT",testament:"NT",abbreviations:["Matt"],alternateNames:[]},{name:"Mark",code:"MRK",testament:"NT",abbreviations:[],alternateNames:[]},{name:"Luke",code:"LUK",testament:"NT",abbreviations:[],alternateNames:[]},{name:"John",code:"JHN",testament:"NT",abbreviations:[],alternateNames:[]},{name:"Acts",code:"ACT",testament:"NT",abbreviations:[],alternateNames:[]},{name:"Romans",code:"ROM",testament:"NT",abbreviations:["Rom"],alternateNames:[]},{name:"1 Corinthians",code:"1CO",testament:"NT",abbreviations:["1 Cor"],alternateNames:[]},{name:"2 Corinthians",code:"2CO",testament:"NT",abbreviations:["2 Cor"],alternateNames:[]},{name:"Galatians",code:"GAL",testament:"NT",abbreviations:["Gal"],alternateNames:[]},{name:"Ephesians",code:"EPH",testament:"NT",abbreviations:["Eph"],alternateNames:[]},{name:"Philippians",code:"PHP",testament:"NT",abbreviations:["Phil"],alternateNames:[]},{name:"Colossians",code:"COL",testament:"NT",abbreviations:["Col"],alternateNames:[]},{name:"1 Thessalonians",code:"1TH",testament:"NT",abbreviations:["1 Thess"],alternateNames:[]},{name:"2 Thessalonians",code:"2TH",testament:"NT",abbreviations:["2 Thess"],alternateNames:[]},{name:"1 Timothy",code:"1TI",testament:"NT",abbreviations:["1 Tim"],alternateNames:[]},{name:"2 Timothy",code:"2TI",testament:"NT",abbreviations:["2 Tim"],alternateNames:[]},{name:"Titus",code:"TIT",testament:"NT",abbreviations:[],alternateNames:[]},{name:"Philemon",code:"PHM",testament:"NT",abbreviations:["Philem"],alternateNames:[]},{name:"Hebrews",code:"HEB",testament:"NT",abbreviations:["Heb"],alternateNames:[]},{name:"James",code:"JAS",testament:"NT",abbreviations:[],alternateNames:[]},{name:"1 Peter",code:"1PE",testament:"NT",abbreviations:["1 Pet"],alternateNames:[]},{name:"2 Peter",code:"2PE",testament:"NT",abbreviations:["2 Pet"],alternateNames:[]},{name:"1 John",code:"1JN",testament:"NT",abbreviations:[],alternateNames:[]},{name:"2 John",code:"2JN",testament:"NT",abbreviations:[],alternateNames:[]},{name:"3 John",code:"3JN",testament:"NT",abbreviations:[],alternateNames:[]},{name:"Jude",code:"JUD",testament:"NT",abbreviations:[],alternateNames:[]},{name:"Revelation",code:"REV",testament:"NT",abbreviations:["Rev"],alternateNames:[]}];function me(){let i=new Map;for(let e of z){i.set(y(e.name),e),i.set(y(e.code),e);for(let t of e.abbreviations)i.set(y(t),e);for(let t of e.alternateNames)i.set(y(t),e)}return i}function y(i){return i.toLowerCase().replace(/\./g,"").replace(/\s+/g," ").trim()}var ge=me();function v(i){return ge.get(y(i))}function he(){let i=[];for(let e of z)i.push(e.name),i.push(...e.abbreviations),i.push(...e.alternateNames);return i}function D(){let i=he();return i.sort((e,t)=>t.length-e.length),i.map(e=>e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("|")}var W=[{id:4253,abbreviation:"AFV",title:"A Faithful Version",licensed:!1},{id:1588,abbreviation:"AMP",title:"Amplified Bible",licensed:!0},{id:8,abbreviation:"AMPC",title:"Amplified Bible, Classic Edition",licensed:!1},{id:12,abbreviation:"ASV",title:"American Standard Version",licensed:!0},{id:31,abbreviation:"BOOKS",title:"The Books of the Bible NT",licensed:!1},{id:3034,abbreviation:"BSB",title:"English: Berean Standard Bible",licensed:!0},{id:37,abbreviation:"CEB",title:"Common English Bible",licensed:!1},{id:392,abbreviation:"CEV",title:"Contemporary English Version",licensed:!1},{id:303,abbreviation:"CEVDCI",title:"Contemporary English Version Interconfessional Edition",licensed:!1},{id:294,abbreviation:"CEVUK",title:"Contemporary English Version (Anglicised) 2012",licensed:!1},{id:1275,abbreviation:"CJB",title:"Complete Jewish Bible",licensed:!1},{id:42,abbreviation:"CPDV",title:"Catholic Public Domain Version",licensed:!0},{id:1713,abbreviation:"CSB",title:"Christian Standard Bible",licensed:!1},{id:4124,abbreviation:"CSBA",title:"Christian Standard Bible Anglicised",licensed:!1},{id:478,abbreviation:"DARBY",title:"Darby's Translation 1890",licensed:!1},{id:55,abbreviation:"DRC1752",title:"Douay-Rheims Challoner Revision 1752",licensed:!1},{id:2079,abbreviation:"EASY",title:"EasyEnglish Bible 2024",licensed:!0},{id:4224,abbreviation:"EHV",title:"Evangelical Heritage Version - 2021",licensed:!1},{id:406,abbreviation:"ERV",title:"Holy Bible: Easy-to-Read Version",licensed:!1},{id:59,abbreviation:"ESV",title:"English Standard Version 2025",licensed:!1},{id:1932,abbreviation:"FBV",title:"Free Bible Version",licensed:!0},{id:3633,abbreviation:"FNVNT",title:"First Nations Version",licensed:!1},{id:416,abbreviation:"GNBDC",title:"Good News Bible (British) with DC section 2017",licensed:!1},{id:431,abbreviation:"GNBDK",title:"Good News Bible (British) Catholic Edition 2017",licensed:!1},{id:296,abbreviation:"GNBUK",title:"Good News Bible (British Version) 2017",licensed:!1},{id:68,abbreviation:"GNT",title:"Good News Translation",licensed:!1},{id:69,abbreviation:"GNTD",title:"Good News Translation (US Version)",licensed:!1},{id:2163,abbreviation:"GNV",title:"Geneva Bible",licensed:!0},{id:70,abbreviation:"GW",title:"GOD'S WORD",licensed:!1},{id:1047,abbreviation:"GWC",title:"St Paul from the Trenches 1916",licensed:!1},{id:72,abbreviation:"HCSB",title:"Holman Christian Standard Bible",licensed:!1},{id:1359,abbreviation:"ICB",title:"International Children's Bible",licensed:!1},{id:1077,abbreviation:"JUB",title:"Jubilee Bible",licensed:!1},{id:1,abbreviation:"KJV",title:"King James Version",licensed:!1},{id:546,abbreviation:"KJVAAE",title:"King James Version with Apocrypha, American Edition",licensed:!1},{id:547,abbreviation:"KJVAE",title:"King James Version, American Edition",licensed:!1},{id:90,abbreviation:"LEB",title:"Lexham English Bible",licensed:!1},{id:3345,abbreviation:"LSB",title:"Legacy Standard Bible",licensed:!1},{id:2660,abbreviation:"LSV",title:"Literal Standard Version",licensed:!0},{id:1171,abbreviation:"MEV",title:"Modern English Version",licensed:!1},{id:4540,abbreviation:"MP1562",title:"Metrical Psalms and Scripture Selections 1562 (Sternhold and Hopkins)",licensed:!1},{id:1365,abbreviation:"MP1650",title:"Psalms of David in Metre 1650 (Scottish Psalter)",licensed:!1},{id:2593,abbreviation:"MP1696",title:"Metrical Psalms and Scripture Selections 1696 (Brady &amp; Tate)",licensed:!1},{id:3051,abbreviation:"MP1781",title:"Scottish Metrical Paraphrases 1781",licensed:!1},{id:97,abbreviation:"MSG",title:"The Message",licensed:!1},{id:463,abbreviation:"NABRE",title:"New American Bible, revised edition",licensed:!1},{id:100,abbreviation:"NASB",title:"New American Standard Bible - NASB 1995",licensed:!0},{id:2692,abbreviation:"NASB2020",title:"New American Standard Bible - NASB",licensed:!0},{id:105,abbreviation:"NCV",title:"New Century Version",licensed:!1},{id:107,abbreviation:"NET",title:"New English Translation",licensed:!1},{id:110,abbreviation:"NIRV",title:"New International Reader's Version",licensed:!0},{id:111,abbreviation:"NIV",title:"New International Version",licensed:!0},{id:113,abbreviation:"NIVUK",title:"New International Version (Anglicised)",licensed:!0},{id:114,abbreviation:"NKJV",title:"New King James Version",licensed:!1},{id:116,abbreviation:"NLT",title:"New Living Translation",licensed:!1},{id:4249,abbreviation:"NLTCE",title:"New Living Translation Catholic Edition",licensed:!1},{id:2135,abbreviation:"NMV",title:"New Messianic Version Bible",licensed:!1},{id:2015,abbreviation:"NRSV-CI",title:"New Revised Standard Version Catholic Interconfessional",licensed:!1},{id:3523,abbreviation:"NRSVUE",title:"New Revised Standard Version Updated Edition 2021",licensed:!1},{id:4455,abbreviation:"NTBNBL2025",title:"Benamanga",licensed:!0},{id:3915,abbreviation:"OYBCENGL",title:"The third line (in English) translating the meaning of each word in the Orthodox Yiddish Brit Chadashah (New Testament)",licensed:!1},{id:4557,abbreviation:"OYTNKHEG",title:"English word for word translation of Orthodox Yiddish Tanakh (OYTANAKH)",licensed:!1},{id:4070,abbreviation:"OYTORHEG",title:"Translation into English of Orthodox Yiddish Torah (OYTORAH)",licensed:!1},{id:2530,abbreviation:"PEV",title:"Plain English Version",licensed:!0},{id:2753,abbreviation:"RAD",title:"Radiate New Testament",licensed:!1},{id:2020,abbreviation:"RSV",title:"Revised Standard Version",licensed:!1},{id:2017,abbreviation:"RSV-C",title:"Revised Standard Version Old Tradition 1952",licensed:!1},{id:3548,abbreviation:"RSVCI",title:"Revised Standard Version",licensed:!1},{id:477,abbreviation:"RV1885",title:"Revised Version 1885",licensed:!1},{id:1922,abbreviation:"RV1895",title:"Revised Version with Apocrypha 1885, 1895",licensed:!1},{id:3427,abbreviation:"TCENT",title:"The Text-Critical English New Testament",licensed:!0},{id:3010,abbreviation:"TEG",title:"Isaiah 1830, 1842 (John Jones alias Ioan Tegid)",licensed:!1},{id:314,abbreviation:"TLV",title:"Tree of Life Version",licensed:!1},{id:130,abbreviation:"TOJB2011",title:"The Orthodox Jewish Bible",licensed:!0},{id:1849,abbreviation:"TPT",title:"The Passion Translation",licensed:!0},{id:316,abbreviation:"TS2009",title:"The Scriptures 2009",licensed:!1},{id:2407,abbreviation:"WBMS",title:"Wycliffe's Bible with Modern Spelling",licensed:!1},{id:4533,abbreviation:"WBTP",title:"Af\u0101 Wany\u025Bny\u025B wu Nug\xE9 W\xE0py\xF3\xF2",licensed:!0},{id:1204,abbreviation:"WEBBE",title:"World English Bible British Edition",licensed:!0},{id:206,abbreviation:"WEBUS",title:"World English Bible, American English Edition, without Strong's Numbers",licensed:!0},{id:1209,abbreviation:"WMB",title:"World Messianic Bible",licensed:!0},{id:1207,abbreviation:"WMBBE",title:"World Messianic Bible British Edition",licensed:!0},{id:4108,abbreviation:"YALL",title:"Y'all Version Bible",licensed:!1},{id:821,abbreviation:"YLT98",title:"Young's Literal Translation 1898",licensed:!1}];function ue(){let i=new Map;for(let e of W)i.set(e.abbreviation.toUpperCase(),e);return i}var fe=ue();function N(i){return fe.get(i.toUpperCase())}function U(){let i=W.map(e=>e.abbreviation);return i.sort((e,t)=>t.length-e.length),i.map(e=>e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("|")}var S=null;function be(){if(S)return S;let i=D(),e=U();return S=new RegExp(`\\b(${i})\\s+(\\d{1,3}):(\\d{1,3}(?:[\u2013\u2014-]\\d{1,3})?)(?:\\s+(${e}))?\\b`,"gi"),S}function Y(i){let e=be(),t=[],n;for(e.lastIndex=0;(n=e.exec(i))!==null;){let[r,o,a,s,c]=n,d=v(o);if(!d)continue;let l=parseInt(a,10);isNaN(l)||l<=0||t.push({text:r,book:d.code,chapter:l,verses:s,version:c?c.toUpperCase():void 0,startIndex:n.index,endIndex:n.index+r.length})}return t}var w=class{constructor(e){this.config=e,this.scannedNodes=new WeakSet;let{tags:t,classes:n,ids:r,complex:o}=this.parseExcludeSelectors(e.excludeSelectors);this.excludedTags=t,this.excludedClasses=n,this.excludedIds=r,this.complexExcludeSelectors=o}parseExcludeSelectors(e){let t=new Set,n=new Set,r=new Set,o=[],a=e.split(",").map(s=>s.trim()).filter(s=>s);for(let s of a)/^[a-z][a-z0-9]*$/i.test(s)?t.add(s.toUpperCase()):/^\.[a-z_-][a-z0-9_-]*$/i.test(s)?n.add(s.substring(1)):/^#[a-z_-][a-z0-9_-]*$/i.test(s)?r.add(s.substring(1)):o.push(s);return{tags:t,classes:n,ids:r,complex:o.length>0?o.join(", "):null}}scan(e=document){var s;let t=[],n=e===document?document.body:e;if(!n)return this.config.debug&&console.warn("VerseTagger: No root element found for scanning"),t;let r=document.createTreeWalker(n,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT,{acceptNode:c=>this.shouldScanNode(c)}),o=[],a;for(;a=r.nextNode();)if(a.nodeType===Node.TEXT_NODE&&(o.push(a),this.config.debug)){let c=(a.textContent||"").substring(0,50).replace(/\n/g," "),d=(((s=a.parentElement)==null?void 0:s.tagName)||"none").toLowerCase();console.log(`VerseTagger: [TreeWalker] Found text node in <${d}>: "${c}${c.length>=50?"...":""}"`)}this.config.debug&&console.log(`VerseTagger: [TreeWalker] Collected ${o.length} text nodes to process`);for(let c of o){let d=this.processTextNode(c);t.push(...d)}return this.config.debug&&console.log(`VerseTagger: Found ${t.length} references`),t}shouldScanNode(e){let t="VerseTagger: [shouldScanNode]";if(e.nodeType===Node.ELEMENT_NODE){let r=e;if(this.excludedTags.has(r.tagName))return this.config.debug&&console.log(`${t} REJECT - Element tag excluded: <${r.tagName.toLowerCase()}>`),NodeFilter.FILTER_REJECT;if(r.id&&this.excludedIds.has(r.id))return this.config.debug&&console.log(`${t} REJECT - Element ID excluded: #${r.id}`),NodeFilter.FILTER_REJECT;if(r.classList.length>0){for(let o of r.classList)if(this.excludedClasses.has(o))return this.config.debug&&console.log(`${t} REJECT - Element class excluded: .${o}`),NodeFilter.FILTER_REJECT}if(this.complexExcludeSelectors)try{if(r.matches(this.complexExcludeSelectors))return this.config.debug&&console.log(`${t} REJECT - Element matches complex excludeSelectors: <${r.tagName.toLowerCase()}>`),NodeFilter.FILTER_REJECT}catch(o){this.config.debug&&console.warn("VerseTagger: Invalid excludeSelectors",o)}if(r.classList.contains(this.config.referenceClass))return this.config.debug&&console.log(`${t} REJECT - Element is existing verse reference`),NodeFilter.FILTER_REJECT;if(r instanceof HTMLElement){let o=window.getComputedStyle(r);if(o.display==="none")return this.config.debug&&console.log(`${t} REJECT - Element has display:none: <${r.tagName.toLowerCase()}>`),NodeFilter.FILTER_REJECT;if(o.visibility==="hidden")return this.config.debug&&console.log(`${t} REJECT - Element has visibility:hidden: <${r.tagName.toLowerCase()}>`),NodeFilter.FILTER_REJECT;if(r.getAttribute("contenteditable")==="true")return this.config.debug&&console.log(`${t} REJECT - Element has contenteditable="true": <${r.tagName.toLowerCase()}>`),NodeFilter.FILTER_REJECT;if(r.getAttribute("aria-hidden")==="true")return this.config.debug&&console.log(`${t} REJECT - Element has aria-hidden="true": <${r.tagName.toLowerCase()}>`),NodeFilter.FILTER_REJECT}return NodeFilter.FILTER_SKIP}return this.scannedNodes.has(e)?(this.config.debug&&console.log(`${t} REJECT - Already scanned`),NodeFilter.FILTER_REJECT):!e.textContent||e.textContent.trim().length===0?(this.config.debug&&console.log(`${t} REJECT - Empty or whitespace only`),NodeFilter.FILTER_REJECT):e.parentElement?(this.config.debug&&console.log(`${t} ACCEPT`),NodeFilter.FILTER_ACCEPT):(this.config.debug&&console.log(`${t} REJECT - No parent element`),NodeFilter.FILTER_REJECT)}processTextNode(e){let t=e.textContent||"";if(this.config.debug){let d=t.substring(0,100).replace(/\n/g," ");console.log(`VerseTagger: [ProcessNode] Text: "${d}${t.length>100?"...":""}"`)}let n=Y(t);if(this.config.debug&&(console.log(`VerseTagger: [Regex] Found ${n.length} match(es)`),n.forEach((d,l)=>{console.log(`VerseTagger: [Match ${l+1}] "${d.text}" -> ${d.book} ${d.chapter}:${d.verses}${d.version?" "+d.version:""}`)})),n.length===0)return this.scannedNodes.add(e),[];let r=[],o=e.parentNode;if(!o)return[];let a=[...n].sort((d,l)=>l.startIndex-d.startIndex);this.config.debug&&console.log(`VerseTagger: [ProcessNode] Processing ${a.length} references in reverse order`);let s=e,c=t;for(let d=0;d<a.length;d++){let l=a[d];this.config.debug&&console.log(`VerseTagger: [ProcessNode] Processing reference ${d+1}/${a.length}: "${l.text}" at index ${l.startIndex}-${l.endIndex}`);let g=c.substring(0,l.startIndex),b=c.substring(l.startIndex,l.endIndex),p=c.substring(l.endIndex),f=this.createReferenceElement(l);if(l.startIndex===0){let h=document.createTextNode(p);o.insertBefore(f,s),o.insertBefore(h,s),o.removeChild(s),this.scannedNodes.add(h),s=h,c=p}else if(l.endIndex===c.length){let h=document.createTextNode(g);o.insertBefore(h,s),o.insertBefore(f,s),o.removeChild(s),this.scannedNodes.add(h),s=h,c=g}else{let h=document.createTextNode(g),x=document.createTextNode(p);o.insertBefore(h,s),o.insertBefore(f,s),o.insertBefore(x,s),o.removeChild(s),this.scannedNodes.add(h),this.scannedNodes.add(x),s=h,c=g}r.push(C(m({},l),{element:f}))}return r.forEach(d=>this.scannedNodes.add(d.element)),r}createReferenceElement(e){let t=document.createElement("a");return t.textContent=e.text,t.className=this.config.referenceClass,t.dataset.book=e.book,t.dataset.chapter=e.chapter.toString(),t.dataset.verses=e.verses,e.version&&(t.dataset.version=e.version),t.href=this.buildReferenceUrl(e),this.config.openLinksInNewTab&&(t.target="_blank",t.rel="noopener noreferrer"),t.setAttribute("role","button"),t.setAttribute("tabindex","0"),t.setAttribute("aria-label",`Show verse: ${e.text}`),this.config.accessibility.keyboardNav&&t.setAttribute("aria-haspopup","dialog"),t.dataset.hasModal="true",t}buildReferenceUrl(e){let t=e.version||this.config.defaultVersion,n=e.verses||"",r=N(t);return`https://www.bible.com/bible/${r?r.id.toString():"111"}/${e.book}.${e.chapter}.${n}`}clearCache(){this.scannedNodes=new WeakSet}};var u=class extends Error{constructor(t,n,r){super(t);this.statusCode=n;this.cause=r;this.name="ApiError"}};function pe(i){var e;try{if(i!=null&&i.message)return i.message;if((e=i==null?void 0:i.fault)!=null&&e.faultstring)return i.fault.faultstring}catch(t){}return null}var M=class{constructor(e){this.config=m({timeout:1e4,debug:!1},e)}async fetchVerse(e){let t=e.version||this.config.defaultVersion,n={book:e.book,chapter:e.chapter.toString(),verses:e.verses||void 0,version:t};this.config.debug&&console.log("[YouVersionClient] Fetching verse:",n);try{let r=await this.makeRequest(n);return this.parseResponse(r,e,t)}catch(r){throw r instanceof u?r:new u(`Failed to fetch verse: ${r instanceof Error?r.message:"Unknown error"}`,void 0,r)}}async makeRequest(e){let t=new URLSearchParams;for(let[a,s]of Object.entries(e))s!==void 0&&t.append(a,s);let n=`${this.config.proxyUrl}?${t.toString()}`;this.config.debug&&(console.log("[YouVersionClient] Request URL:",n),console.log("[YouVersionClient] Request params:",e));let r=new AbortController,o=setTimeout(()=>r.abort(),this.config.timeout);try{let a=await fetch(n,{method:"GET",headers:{Accept:"application/json"},signal:r.signal});if(console.log(a),clearTimeout(o),!a.ok){let c=null;try{let d=await a.json();c=pe(d)}catch(d){try{let l=await a.text();l&&l!=="No error details"&&(c=l)}catch(l){}}throw a.status===404?new u(c||"Verse not found. The reference may be invalid or not available in this version.",404):a.status===429?new u(c||"Rate limit exceeded. Please try again later.",429):new u(c||`API request failed: ${a.status} ${a.statusText}`,a.status)}return await a.json()}catch(a){throw clearTimeout(o),a instanceof Error&&a.name==="AbortError"?new u("Request timed out. Try again in a few seconds.",void 0,a):a instanceof TypeError&&a.message.includes("fetch")?new u(`Network error: Unable to connect to proxy server at ${this.config.proxyUrl}`,void 0,a):a}}parseResponse(e,t,n){var o;if(!e||typeof e!="object")throw new u("Invalid API response: Expected JSON object");if(this.config.debug&&(console.log("[YouVersionClient] Proxy response:",JSON.stringify(e,null,2)),console.log("[YouVersionClient] Requested version:",n),console.log("[YouVersionClient] Content preview:",(o=e.content)==null?void 0:o.substring(0,100))),!e.content||typeof e.content!="string")throw new u(`Invalid API response: Expected 'content' field with verse text. Got: ${JSON.stringify(e)}`);let r;if(e.reference){let a=v(t.book);a?r=e.reference.replace(new RegExp(`^${t.book}\\b`),a.name):r=e.reference}else r=this.formatReference(t,n);return{book:t.book,chapter:t.chapter,content:e.content,verses:t.verses,version:n,reference:r}}formatReference(e,t){let n=v(e.book),o=`${n?n.name:e.book} ${e.chapter}`;return e.verses&&(o+=`:${e.verses}`),o+=` ${t}`,o}updateConfig(e){this.config=m(m({},this.config),e)}};var B=`
/* Modal Container */
.versetagger-modal {
  position: absolute;
  z-index: 999999;
  background: var(--vt-modalBackground);
  border: 1px solid var(--vt-modalBorder);
  border-radius: var(--vt-modalBorderRadius);
  box-shadow: 0 4px 6px -1px var(--vt-modalShadow), 0 2px 4px -1px var(--vt-modalShadow);
  max-width: var(--vt-modalMaxWidth);
  min-width: 280px;
  width: 90vw;
  /* Constrain to 80vh or full viewport minus padding, whichever is smaller (JS+CSS dual constraint) */
  max-height: min(30vh, calc(100vh - 32px));
  overflow-y: auto;
  overflow-x: visible; /* Allow bridge to extend outside */
  opacity: 0;
  transform: translateY(-8px);
  transition: opacity 0.2s ease, transform 0.2s ease;
  font-family: var(--vt-fontFamily);
  font-size: var(--vt-fontSize);
  line-height: var(--vt-lineHeight);
  color: var(--vt-textPrimary);
  padding: var(--vt-modalPadding);
}

/* Modal visible state */
.versetagger-modal-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Modal placement variants */
.versetagger-modal[data-placement="below"] {
  transform-origin: top center;
}

.versetagger-modal[data-placement="above"] {
  transform-origin: bottom center;
}

/* Invisible bridge that connects trigger to modal */
.versetagger-modal-bridge {
  position: absolute;
  pointer-events: auto;
  z-index: 999998; /* Just below modal (999999) but above page content */
  /* Dimensions set via JS based on modal position */
}

/* Close Button */
.versetagger-modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--vt-closeButtonBackground);
  border: none;
  font-size: 28px;
  line-height: 1;
  color: var(--vt-closeButtonColor);
  cursor: pointer;
  padding: 4px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s ease, color 0.2s ease;
  z-index: 10;
}

.versetagger-modal-close:hover {
  background-color: var(--vt-closeButtonHoverBackground);
  color: var(--vt-closeButtonHoverColor);
}

.versetagger-modal-close:focus {
  outline: 2px solid var(--vt-linkColor);
  outline-offset: 2px;
}

/* Header */
.versetagger-modal-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-right: 32px; /* Make room for close button */
  flex-wrap: nowrap;
}

.versetagger-modal-reference {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--vt-textPrimary);
  flex-shrink: 1;
  min-width: 0;
}

.versetagger-modal-version {
  display: inline-block;
  padding: 4px 10px;
  background: var(--vt-modalBorder);
  color: var(--vt-textMuted);
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}

/* Verses Container */
.versetagger-modal-verses {
  margin-bottom: 16px;
}

.versetagger-modal-verse {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  align-items: flex-start;
}

.versetagger-modal-verse:last-child {
  margin-bottom: 0;
}

.versetagger-verse-number {
  flex-shrink: 0;
  font-weight: 700;
  color: var(--vt-verseNumberColor);
  font-size: var(--vt-verseNumberSize);
  min-width: 24px;
  text-align: right;
  line-height: inherit;
}

.versetagger-verse-text {
  flex: 1;
  color: var(--vt-textSecondary);
}

/* Content Text (for plain text display) */
.versetagger-content-text {
  margin: 0 0 16px 0;
  color: var(--vt-textSecondary);
  font-size: 14px;
  line-height: 1.6;
}

/* Content Text (error state) */
.versetagger-content-text.versetagger-content-error {
  color: var(--vt-errorText);
}

/* Footer */
.versetagger-modal-footer {
  padding-top: 12px;
  border-top: 1px solid var(--vt-modalBorder);
  display: flex;
  justify-content: flex-end;
}

.versetagger-youversion-link {
  display: inline-flex;
  align-items: center;
  color: var(--vt-linkColor);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s ease;
}

.versetagger-youversion-link:hover {
  color: var(--vt-linkHoverColor);
}

.versetagger-youversion-link:focus {
  outline: 2px solid var(--vt-linkColor);
  outline-offset: 2px;
  border-radius: 2px;
}

.versetagger-external-icon {
  font-size: 12px;
  opacity: 0.7;
}

/* Loading State */
.versetagger-modal-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  gap: 12px;
}

.versetagger-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--vt-modalBorder);
  border-top-color: var(--vt-loadingColor);
  border-radius: 50%;
  animation: versetagger-spin 0.8s linear infinite;
}

@keyframes versetagger-spin {
  to {
    transform: rotate(360deg);
  }
}

/* Error State */
.versetagger-modal-error {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
}

.versetagger-error-icon {
  font-size: 20px;
  flex-shrink: 0;
  color: var(--vt-errorText);
}

.versetagger-error-message {
  margin: 0;
  color: var(--vt-errorText);
  font-size: 14px;
  line-height: 1.5;
}

/* Screen Reader Only */
.versetagger-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Mobile Responsiveness */
@media (max-width: 640px) {
  .versetagger-modal {
    max-width: calc(100vw - 32px);
    width: calc(100vw - 32px);
    max-height: 85vh;
    font-size: 15px;
  }

  .versetagger-modal-content {
    padding: 16px;
  }

  .versetagger-modal-close {
    top: 8px;
    right: 8px;
    font-size: 24px;
    width: 28px;
    height: 28px;
  }

  .versetagger-modal-header {
    padding-right: 28px;
    margin-bottom: 12px;
  }

  .versetagger-modal-reference {
    font-size: 16px;
  }

  .versetagger-modal-version {
    font-size: 12px;
    padding: 3px 8px;
  }

  .versetagger-verse-number {
    font-size: 13px;
    min-width: 20px;
  }

  .versetagger-modal-verse {
    gap: 6px;
    margin-bottom: 10px;
  }
}

/* Touch-friendly interactions on mobile */
@media (hover: none) and (pointer: coarse) {
  .versetagger-modal-close {
    min-width: 44px;
    min-height: 44px;
  }

  .versetagger-youversion-link {
    padding: 8px 0;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
  }
}

/* Modal open class - reserved for future use if needed */
body.versetagger-modal-open {
  /* No styles needed - modal scrolls naturally with page content */
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .versetagger-modal {
    border-width: 2px;
  }

  .versetagger-modal-close:focus,
  .versetagger-youversion-link:focus {
    outline-width: 3px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .versetagger-modal,
  .versetagger-modal-close,
  .versetagger-youversion-link {
    transition: none;
  }

  .versetagger-spinner {
    animation: none;
    border-top-color: var(--vt-modalBorder);
  }
}
`;function _(){if(document.getElementById("versetagger-modal-styles"))return;let i=document.createElement("style");i.id="versetagger-modal-styles",i.textContent=B,document.head.appendChild(i)}function G(){let i=document.getElementById("versetagger-modal-styles");i&&i.remove()}var k=class{constructor(e){this.modalElement=null;this.containerElement=null;this.bridgeElement=null;this.currentTarget=null;this.currentState="hidden";this.renderCallback=null;this.focusBeforeModal=null;this.config=e}initialize(e){this.renderCallback=e}ensureModalCreated(){if(this.modalElement)return;_(),this.modalElement=document.createElement("div"),this.modalElement.id="versetagger-modal",this.modalElement.className="versetagger-modal",this.modalElement.setAttribute("role","dialog"),this.modalElement.setAttribute("aria-modal","true"),this.modalElement.setAttribute("aria-label","Scripture verse content"),this.modalElement.style.display="none",this.containerElement=document.createElement("div"),this.containerElement.className="versetagger-modal-content",this.modalElement.appendChild(this.containerElement);let e=document.createElement("button");e.className="versetagger-modal-close",e.setAttribute("aria-label","Close modal"),e.innerHTML="&times;",e.addEventListener("click",()=>this.hide()),this.modalElement.appendChild(e),document.body.appendChild(this.modalElement),this.bridgeElement=document.createElement("div"),this.bridgeElement.className="versetagger-modal-bridge",this.bridgeElement.style.display="none",document.body.appendChild(this.bridgeElement),this.attachGlobalListeners()}attachGlobalListeners(){document.addEventListener("keydown",e=>{e.key==="Escape"&&this.currentState!=="hidden"&&this.hide()}),document.addEventListener("click",e=>{if(this.currentState!=="hidden"&&this.modalElement){let t=e.target;!this.modalElement.contains(t)&&this.currentTarget&&!this.currentTarget.contains(t)&&this.hide()}}),this.modalElement&&(this.modalElement.addEventListener("mouseenter",()=>{var e;(e=this.modalElement)==null||e.setAttribute("data-modal-hovered","true")}),this.modalElement.addEventListener("mouseleave",()=>{var e;(e=this.modalElement)==null||e.removeAttribute("data-modal-hovered"),setTimeout(()=>{var t,n;((t=this.modalElement)==null?void 0:t.getAttribute("data-modal-hovered"))!=="true"&&((n=this.bridgeElement)==null?void 0:n.getAttribute("data-bridge-hovered"))!=="true"&&this.currentTarget&&!this.currentTarget.matches(":hover")&&this.hide()},100)})),this.bridgeElement&&(this.bridgeElement.addEventListener("mouseenter",()=>{var e,t;(e=this.bridgeElement)==null||e.setAttribute("data-bridge-hovered","true"),(t=this.modalElement)==null||t.setAttribute("data-modal-hovered","true")}),this.bridgeElement.addEventListener("mouseleave",()=>{var e,t;(e=this.bridgeElement)==null||e.removeAttribute("data-bridge-hovered"),(t=this.modalElement)==null||t.removeAttribute("data-modal-hovered"),setTimeout(()=>{var n,r;((n=this.modalElement)==null?void 0:n.getAttribute("data-modal-hovered"))!=="true"&&((r=this.bridgeElement)==null?void 0:r.getAttribute("data-bridge-hovered"))!=="true"&&this.currentTarget&&!this.currentTarget.matches(":hover")&&this.hide()},100)})),window.addEventListener("resize",()=>{this.currentState!=="hidden"&&this.currentTarget&&this.position(this.currentTarget)}),window.addEventListener("scroll",()=>{this.currentState!=="hidden"&&this.currentTarget&&this.position(this.currentTarget)},{passive:!0})}showLoading(e){if(this.ensureModalCreated(),!this.modalElement||!this.containerElement)return;this.focusBeforeModal=document.activeElement,document.body.classList.add("versetagger-modal-open"),this.currentTarget=e,this.currentState="loading",this.containerElement.innerHTML="";let t=document.createElement("div");t.className="versetagger-modal-loading",t.setAttribute("role","status"),t.setAttribute("aria-live","polite"),t.innerHTML=`
      <div class="versetagger-spinner"></div>
      <span class="versetagger-sr-only">Loading verse content...</span>
    `,this.containerElement.appendChild(t),this.position(e),this.modalElement.style.display="block",this.modalElement.classList.add("versetagger-modal-visible"),this.bridgeElement&&(this.bridgeElement.style.display="block",this.positionBridge(e)),this.config.accessibility.announceToScreenReaders&&this.announce("Loading verse content")}showContent(e){!this.modalElement||!this.containerElement||!this.renderCallback||(this.currentState="loaded",this.containerElement.innerHTML="",this.renderCallback(this.containerElement,e),this.currentTarget&&(this.position(this.currentTarget),this.bridgeElement&&this.bridgeElement.style.display==="block"&&this.positionBridge(this.currentTarget)),this.config.accessibility.announceToScreenReaders&&this.announce(`Loaded ${e.reference}`))}showError(e){if(!this.modalElement||!this.containerElement)return;this.currentState="error",this.containerElement.innerHTML="";let t=document.createElement("div");t.className="versetagger-modal-error",t.setAttribute("role","alert"),t.innerHTML=`
      <p class="versetagger-error-message">${this.escapeHtml(e)}</p>
    `,this.containerElement.appendChild(t),this.currentTarget&&(this.position(this.currentTarget),this.bridgeElement&&this.bridgeElement.style.display==="block"&&this.positionBridge(this.currentTarget)),this.config.accessibility.announceToScreenReaders&&this.announce(`Error: ${e}`)}hide(){this.modalElement&&(this.currentState="hidden",this.modalElement.classList.remove("versetagger-modal-visible"),this.bridgeElement&&(this.bridgeElement.style.display="none"),document.body.classList.remove("versetagger-modal-open"),setTimeout(()=>{this.modalElement&&this.currentState==="hidden"&&(this.modalElement.style.display="none")},200),this.focusBeforeModal&&this.config.accessibility.keyboardNav&&(this.focusBeforeModal.focus(),this.focusBeforeModal=null),this.currentTarget=null)}position(e){if(!this.modalElement)return;let t=e.getBoundingClientRect(),n=this.modalElement.getBoundingClientRect(),r=window.innerWidth,o=window.innerHeight,a=8,s=16,c=16,d="below",l=0,g=0,b=o-t.bottom-c,p=t.top-c,f=n.height+a;b>=f?(d="below",l=t.bottom+a+window.scrollY):p>=f?(d="above",l=t.top-n.height-a+window.scrollY):b>p?(d="below",l=t.bottom+a+window.scrollY):(d="above",l=t.top-n.height-a+window.scrollY);let h=l-window.scrollY+n.height,x=o-c;if(h>x){let I=h-x;l-=I;let $=c+window.scrollY;l<$&&(l=$)}let ne=l-window.scrollY+n.height;d==="above"&&ne>t.top-a&&(l=t.top-a-n.height+window.scrollY);let ie=t.left+t.width/2,re=n.width/2;g=ie-re,g<s&&(g=s),g+n.width>r-s&&(g=r-n.width-s),this.modalElement.style.top=`${l}px`,this.modalElement.style.left=`${g+window.scrollX}px`,this.modalElement.setAttribute("data-placement",d),this.bridgeElement&&this.bridgeElement.style.display==="block"&&this.currentTarget&&this.positionBridge(this.currentTarget)}positionBridge(e){if(!this.bridgeElement||!this.modalElement)return;let t=e.getBoundingClientRect(),n=this.modalElement.getBoundingClientRect();if(this.modalElement.getAttribute("data-placement")==="below"){let o=t.bottom+window.scrollY,a=n.top+window.scrollY-o,s=Math.min(t.left,n.left),c=Math.max(t.right,n.right)-s;this.bridgeElement.style.top=`${o}px`,this.bridgeElement.style.left=`${s+window.scrollX}px`,this.bridgeElement.style.width=`${c}px`,this.bridgeElement.style.height=`${a}px`}else{let o=n.bottom+window.scrollY,a=t.top+window.scrollY-o,s=Math.min(t.left,n.left),c=Math.max(t.right,n.right)-s;this.bridgeElement.style.top=`${o}px`,this.bridgeElement.style.left=`${s+window.scrollX}px`,this.bridgeElement.style.width=`${c}px`,this.bridgeElement.style.height=`${a}px`}}getState(){return this.currentState}getCurrentTarget(){return this.currentTarget}isVisible(){return this.currentState!=="hidden"}announce(e){let t=document.createElement("div");t.className="versetagger-sr-only",t.setAttribute("role","status"),t.setAttribute("aria-live","polite"),t.textContent=e,document.body.appendChild(t),setTimeout(()=>{document.body.removeChild(t)},1e3)}escapeHtml(e){let t=document.createElement("div");return t.textContent=e,t.innerHTML}updateConfig(e){this.config=e}destroy(){this.modalElement&&(this.modalElement.remove(),this.modalElement=null,this.containerElement=null,this.bridgeElement=null),document.body.classList.remove("versetagger-modal-open"),G(),this.currentTarget=null,this.currentState="hidden",this.renderCallback=null}};function K(i,e){let t=null,n=function(...r){t!==null&&clearTimeout(t),t=setTimeout(()=>{i.apply(this,r),t=null},e)};return n.cancel=()=>{t!==null&&(clearTimeout(t),t=null)},n}var R=class{constructor(e,t,n){this.activeElement=null;this.mouseLeaveTimeout=null;this.config=e,this.onOpen=t,this.onClose=n,this.debouncedMouseEnter=K(this.handleDebouncedMouseEnter.bind(this),e.hoverDelay)}attach(e){e.dataset.hasModal==="true"&&(e.addEventListener("mouseenter",this.handleMouseEnter.bind(this)),e.addEventListener("mouseleave",this.handleMouseLeave.bind(this)),e.addEventListener("focus",this.handleFocus.bind(this)),e.addEventListener("blur",this.handleBlur.bind(this)),this.config.accessibility.keyboardNav&&e.addEventListener("keydown",this.handleKeyDown.bind(this)))}detach(e){e.dataset.hasModal==="true"&&(e.removeEventListener("mouseenter",this.handleMouseEnter.bind(this)),e.removeEventListener("mouseleave",this.handleMouseLeave.bind(this)),e.removeEventListener("focus",this.handleFocus.bind(this)),e.removeEventListener("blur",this.handleBlur.bind(this)),this.config.accessibility.keyboardNav&&e.removeEventListener("keydown",this.handleKeyDown.bind(this)))}handleMouseEnter(e){let t=e.currentTarget;this.mouseLeaveTimeout&&(clearTimeout(this.mouseLeaveTimeout),this.mouseLeaveTimeout=null),this.debouncedMouseEnter(t,e)}handleDebouncedMouseEnter(e,t){this.activeElement=e,this.onOpen(e,t)}handleMouseLeave(e){let t=e.currentTarget;this.debouncedMouseEnter.cancel(),this.activeElement===t&&(this.mouseLeaveTimeout=setTimeout(()=>{this.activeElement===t&&(this.onClose(t,e),this.activeElement=null)},200))}handleFocus(e){let t=e.currentTarget;this.activeElement=t,this.onOpen(t,e)}handleBlur(e){let t=e.currentTarget;this.activeElement===t&&setTimeout(()=>{this.activeElement===t&&(this.onClose(t,e),this.activeElement=null)},200)}handleKeyDown(e){let t=e,n=e.currentTarget;if(t.key==="Enter"||t.key===" "){if(t.key===" "&&t.preventDefault(),n instanceof HTMLAnchorElement&&t.key==="Enter"){this.activeElement=n,this.onOpen(n,e);return}this.activeElement===n?(this.onClose(n,e),this.activeElement=null):(this.activeElement=n,this.onOpen(n,e))}}getActiveElement(){return this.activeElement}clearActive(){this.activeElement=null,this.debouncedMouseEnter.cancel(),this.mouseLeaveTimeout&&(clearTimeout(this.mouseLeaveTimeout),this.mouseLeaveTimeout=null)}closeActive(){this.activeElement&&(this.onClose(this.activeElement,new Event("close")),this.activeElement=null)}};function ve(i){let e=i.trim().toLowerCase();return["javascript:","data:","vbscript:","file:"].some(n=>e.startsWith(n))?!1:!!(e.startsWith("http://")||e.startsWith("https://")||e.startsWith("mailto:")||e.startsWith("//")||e.startsWith("/")||e.startsWith("#")||!e.includes(":"))}function A(i){return document.createTextNode(i)}function Te(i){return ve(i)?i:"#"}function q(i,e,t){let n=document.createElement("a");return n.textContent=i,n.href=Te(e),t!=null&&t.className&&(n.className=t.className),t!=null&&t.target&&(n.target=t.target,t.target==="_blank"&&(n.rel="noopener noreferrer")),t!=null&&t.rel&&(n.rel=t.rel),n}function j(i,e,t){i.innerHTML="";let n=document.createElement("div");n.className="versetagger-modal-header";let r=document.createElement("h3");r.className="versetagger-modal-reference",r.appendChild(A(e.reference)),n.appendChild(r);let o=document.createElement("span");o.className="versetagger-modal-version",o.appendChild(A(e.version)),n.appendChild(o),i.appendChild(n);let a=document.createElement("div");a.className="versetagger-modal-content";let s=document.createElement("p");s.className="versetagger-content-text",e.isError&&s.classList.add("versetagger-content-error"),s.textContent=e.content,a.appendChild(s),i.appendChild(a);let c=document.createElement("div");c.className="versetagger-modal-footer";let d=Ee(e,t);c.appendChild(d),i.appendChild(c)}function Ee(i,e){let n=`https://www.bible.com/bible/${xe(i.version)}/${i.book}.${i.chapter}.${i.verses}`,r=q("Read on Bible.com",n,{className:"versetagger-youversion-link",target:e.openLinksInNewTab?"_blank":void 0,rel:"noopener noreferrer"}),o=document.createElement("span");return o.className="versetagger-external-icon",o.innerHTML="&nbsp;\u2197",r.appendChild(o),r}function xe(i){return{NIV:"111",ESV:"59",NLT:"116",KJV:"1",NKJV:"114",NASB:"100",CSB:"1713",AMP:"1588",MSG:"97",NRSV:"2016"}[i.toUpperCase()]||i}var ye={name:"light",colors:{modalBackground:"#ffffff",modalBorder:"#e5e7eb",modalShadow:"rgba(0, 0, 0, 0.1)",textPrimary:"#111827",textSecondary:"#374151",textMuted:"#6b7280",linkColor:"#2563eb",linkHoverColor:"#1d4ed8",verseNumberColor:"#9ca3af",loadingColor:"#6b7280",errorBackground:"#fef2f2",errorText:"#dc2626",closeButtonColor:"#6b7280",closeButtonHoverColor:"#111827",closeButtonBackground:"transparent",closeButtonHoverBackground:"#f3f4f6"},spacing:{modalPadding:"16px",modalBorderRadius:"8px",modalMaxWidth:"400px",versePadding:"8px 0",verseGap:"4px"},fonts:{fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',fontSize:"14px",lineHeight:"1.6",verseNumberSize:"12px"}},Ce={name:"dark",colors:{modalBackground:"#1f2937",modalBorder:"#374151",modalShadow:"rgba(0, 0, 0, 0.5)",textPrimary:"#f9fafb",textSecondary:"#e5e7eb",textMuted:"#9ca3af",linkColor:"#60a5fa",linkHoverColor:"#93c5fd",verseNumberColor:"#6b7280",loadingColor:"#9ca3af",errorBackground:"#7f1d1d",errorText:"#fca5a5",closeButtonColor:"#9ca3af",closeButtonHoverColor:"#f9fafb",closeButtonBackground:"transparent",closeButtonHoverBackground:"#374151"},spacing:{modalPadding:"16px",modalBorderRadius:"8px",modalMaxWidth:"400px",versePadding:"8px 0",verseGap:"4px"},fonts:{fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',fontSize:"14px",lineHeight:"1.6",verseNumberSize:"12px"}};function T(i){return i==="dark"?Ce:ye}var Z="versetagger-styles",Q=`${Z}-theme-vars`,H=`${Z}-base`;function X(i){let e=document.getElementById(Q);e||(e=document.createElement("style"),e.id=Q,document.head.appendChild(e));let t=Object.entries(i).map(([n,r])=>`  --vt-${n}: ${r};`).join(`
`);e.textContent=`:root {
${t}
}`}function ee(i){let e=document.getElementById(H);e||(e=document.createElement("style"),e.id=H,document.head.appendChild(e)),e.textContent=i}function te(){return document.getElementById(H)!==null}var L=class{constructor(e="auto",t){this.mediaQuery=null;this.mediaQueryListener=null;this.mode=e,t?this.currentTheme=this.validateAndMergeTheme(t):this.currentTheme=this.resolveTheme(e),e==="auto"&&this.setupAutoDetection()}init(){te()||ee(B),this.applyTheme(this.currentTheme)}setTheme(e){typeof e=="string"?(this.currentTheme=T(e),this.mode=e):(this.currentTheme=this.validateAndMergeTheme(e),this.mode="auto"),this.applyTheme(this.currentTheme)}getCurrentTheme(){return this.currentTheme}getMode(){return this.mode}destroy(){this.mediaQuery&&this.mediaQueryListener&&(this.mediaQuery.removeListener(this.mediaQueryListener),this.mediaQueryListener=null,this.mediaQuery=null)}resolveTheme(e){return e==="auto"?this.detectColorScheme()==="dark"?T("dark"):T("light"):T(e)}detectColorScheme(){return typeof window=="undefined"||!window.matchMedia?"light":window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}setupAutoDetection(){typeof window=="undefined"||!window.matchMedia||(this.mediaQuery=window.matchMedia("(prefers-color-scheme: dark)"),this.mediaQueryListener=e=>{let t=e.matches?T("dark"):T("light");this.currentTheme=t,this.applyTheme(t)},this.mediaQuery.addEventListener?this.mediaQuery.addEventListener("change",this.mediaQueryListener):this.mediaQuery.addListener(this.mediaQueryListener))}applyTheme(e){let t=this.themeToCSSVariables(e);X(t)}themeToCSSVariables(e){let t={};return Object.entries(e.colors).forEach(([n,r])=>{t[n]=r}),Object.entries(e.spacing).forEach(([n,r])=>{t[n]=r}),Object.entries(e.fonts).forEach(([n,r])=>{t[n]=r}),t}validateAndMergeTheme(e){let t=T("light"),n=m(m({},t.colors),e.colors||{}),r=m(m({},t.spacing),e.spacing||{}),o=m(m({},t.fonts),e.fonts||{});return{name:e.name||"custom",colors:n,spacing:r,fonts:o}}static isValidTheme(e){if(!e||typeof e!="object")return!1;let t=e;if(!t.colors||!t.spacing||!t.fonts)return!1;let n=["modalBackground","modalBorder","modalShadow","textPrimary","textSecondary","textMuted","linkColor","linkHoverColor","verseNumberColor","loadingColor","errorBackground","errorText","closeButtonColor","closeButtonHoverColor","closeButtonBackground","closeButtonHoverBackground"];for(let a of n)if(typeof t.colors[a]!="string")return!1;let r=["modalPadding","modalBorderRadius","modalMaxWidth","versePadding","verseGap"];for(let a of r)if(typeof t.spacing[a]!="string")return!1;let o=["fontFamily","fontSize","lineHeight","verseNumberSize"];for(let a of o)if(typeof t.fonts[a]!="string")return!1;return!0}};var E=class{constructor(e){this.scannedReferences=[];this.initialized=!1;this.cache=new Map;this.config=F(e),this.scanner=new w(this.config),this.apiClient=new M({proxyUrl:this.config.proxyUrl,defaultVersion:this.config.defaultVersion,debug:this.config.debug}),this.modalManager=new k(this.config),this.eventHandler=new R(this.config,this.handleReferenceOpen.bind(this),this.handleReferenceClose.bind(this));let t=this.config.colorScheme,n=typeof this.config.theme=="object"?this.config.theme:void 0;this.themeManager=new L(t,n),this.themeManager.init(),this.modalManager.initialize((r,o)=>{j(r,o,this.config)}),this.initialized=!0,this.config.debug&&console.log("[VerseTagger] Initialized with config:",this.config),this.config.autoScan&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>this.scan()):this.scan())}scan(e){if(!this.initialized)throw new Error("VerseTagger: Cannot scan before initialization is complete");let t=this.scanner.scan(e||document);return t.forEach(n=>{this.eventHandler.attach(n.element)}),this.scannedReferences.push(...t),this.config.debug&&console.log(`[VerseTagger] Scanned ${t.length} references`,t),t}rescan(){if(!this.initialized)throw new Error("VerseTagger: Cannot rescan before initialization is complete");return this.scanner.clearCache(),this.scannedReferences=[],this.scan()}updateConfig(e){if(!this.initialized)throw new Error("VerseTagger: Cannot update config before initialization is complete");if(this.config=V(m(m({},this.config),e)),this.apiClient.updateConfig({proxyUrl:this.config.proxyUrl,defaultVersion:this.config.defaultVersion,debug:this.config.debug}),this.modalManager.updateConfig(this.config),e.theme||e.colorScheme){let t=e.colorScheme||this.config.colorScheme,n=typeof e.theme=="object"?e.theme:void 0;typeof e.theme=="string"&&(e.theme==="light"||e.theme==="dark")?this.themeManager.setTheme(e.theme):n&&this.themeManager.setTheme(n)}this.config.debug&&console.log("[VerseTagger] Config updated:",this.config)}setTheme(e){if(!this.initialized)throw new Error("VerseTagger: Cannot set theme before initialization is complete");this.themeManager.setTheme(e),this.config.debug&&console.log("[VerseTagger] Theme updated:",e)}destroy(){this.initialized&&(this.scannedReferences.forEach(e=>{try{this.eventHandler.detach(e.element)}catch(t){this.config.debug&&console.warn("[VerseTagger] Error detaching event handler:",t)}}),this.scannedReferences=[],this.cache.clear(),this.modalManager.destroy(),this.themeManager.destroy(),this.initialized=!1,this.config.debug&&console.log("[VerseTagger] Destroyed"))}getConfig(){return m({},this.config)}getScannedReferences(){return[...this.scannedReferences]}getCacheStats(){return{size:this.cache.size,keys:Array.from(this.cache.keys())}}clearCache(){this.cache.clear(),this.config.debug&&console.log("[VerseTagger] Cache cleared")}async handleReferenceOpen(e,t){let n=e.dataset.book,r=e.dataset.chapter,o=e.dataset.verses,a=e.dataset.version;if(!n||!r){console.error("[VerseTagger] Missing reference data on element:",e);return}let s=a||this.config.defaultVersion,c=N(s);if(c&&!c.licensed){this.modalManager.showLoading(e);let l=v(n),g=l?l.name:n,b={book:n,chapter:parseInt(r),verses:o||"",reference:`${g} ${r}${o?":"+o:""}`,version:s,content:"This Bible version isn't available to view here due to licensing restrictions.",isError:!0};this.modalManager.showContent(b);return}let d=this.buildCacheKey(n,parseInt(r),o||"",s);this.modalManager.showLoading(e);try{let l;if(this.cache.has(d))l=this.cache.get(d),this.config.debug&&console.log("[VerseTagger] Cache hit:",d);else{this.config.debug&&console.log("[VerseTagger] Fetching verse:",{book:n,chapter:r,verses:o,version:a});let g={book:n,chapter:parseInt(r),verses:o||"",version:a||void 0,text:e.textContent||"",startIndex:0,endIndex:0};l=await this.apiClient.fetchVerse(g),this.cache.set(d,l)}this.modalManager.showContent(l)}catch(l){console.error("[VerseTagger] Error fetching verse:",l);let g="Failed to load verse content.";l instanceof Error&&(g=l.message);let b=v(n),p=b?b.name:n,f={book:n,chapter:parseInt(r),verses:o||"",reference:`${p} ${r}${o?":"+o:""}`,version:s,content:g,isError:!0};this.modalManager.showContent(f)}}handleReferenceClose(e,t){let n=document.getElementById("versetagger-modal");(n==null?void 0:n.getAttribute("data-modal-hovered"))!=="true"&&this.modalManager.hide()}buildCacheKey(e,t,n,r){return`${e}_${t}_${n}_${r}`.toLowerCase()}static get version(){return"0.1.0"}},Ne=E;var ft=E;export{E as VerseTagger,Ne as VersetaggerDefault,ft as default};
