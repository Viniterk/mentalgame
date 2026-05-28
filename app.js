const {useState,useEffect,useRef,useCallback} = React;
const DEFAULT_PROFILE = {
  name: "Aluno",
  xp: 0,
  avatar: "⚔️",
  grade: "ef6"
};

/* ══ RESPONSIVE HOOK ══ */
function useIsMobile(){
  const [m,setM]=useState(()=>window.innerWidth<768);
  useEffect(()=>{
    const h=()=>setM(window.innerWidth<768);
    window.addEventListener("resize",h,{passive:true});
    return()=>window.removeEventListener("resize",h);
  },[]);
  return m;
}

/* ══════════════════════════════════════════════════════
   STORAGE  (defined first — everything uses ls)
══════════════════════════════════════════════════════ */
const SK_P="mg:p:v1",SK_A="mg:a:v1",SK_G="mg:g:v1",SK_TC="mg:tc:v1",SK_DAILY="mg:d:v1";
const ls={
  get:(k)=>{try{const r=localStorage.getItem(k);return r?JSON.parse(r):null;}catch{return null;}},
  set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}},
  str:(k)=>localStorage.getItem(k)||"",
  setStr:(k,v)=>localStorage.setItem(k,v),
};

/* ══════════════════════════════════════════════════════
   THEME
══════════════════════════════════════════════════════ */
const G={
  bg:"linear-gradient(135deg,#12003a 0%,#0a1d5c 45%,#001a2e 100%)",
  rainbow:"linear-gradient(135deg,#f472b6,#a855f7,#6366f1,#06b6d4,#34d399)",
  pink:"linear-gradient(135deg,#ec4899,#a855f7)",
  cyan:"linear-gradient(135deg,#06b6d4,#6366f1)",
  green:"linear-gradient(135deg,#34d399,#06b6d4)",
  yellow:"linear-gradient(135deg,#fbbf24,#f97316)",
  red:"linear-gradient(135deg,#ef4444,#f43f5e)",
  orange:"linear-gradient(135deg,#fb923c,#ef4444)",
};
const GP={
  ef1:{g:"linear-gradient(135deg,#34d399,#06b6d4)",c:"#34d399"},
  ef2:{g:"linear-gradient(135deg,#4ade80,#34d399)",c:"#4ade80"},
  ef3:{g:"linear-gradient(135deg,#06b6d4,#6366f1)",c:"#06b6d4"},
  ef4:{g:"linear-gradient(135deg,#6366f1,#8b5cf6)",c:"#6366f1"},
  ef5:{g:"linear-gradient(135deg,#8b5cf6,#a855f7)",c:"#8b5cf6"},
  ef6:{g:"linear-gradient(135deg,#a855f7,#d946ef)",c:"#a855f7"},
  ef7:{g:"linear-gradient(135deg,#d946ef,#f472b6)",c:"#d946ef"},
  ef8:{g:"linear-gradient(135deg,#f472b6,#fb923c)",c:"#f472b6"},
  ef9:{g:"linear-gradient(135deg,#fbbf24,#f97316)",c:"#fbbf24"},
  em1:{g:"linear-gradient(135deg,#f97316,#ef4444)",c:"#f97316"},
  em2:{g:"linear-gradient(135deg,#ef4444,#f472b6)",c:"#ef4444"},
  em3:{g:"linear-gradient(135deg,#fbbf24,#a855f7)",c:"#fbbf24"},
};

/* ══════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════ */
const GRADES=[
  {id:"ef1",label:"1º Ano",full:"1º Ano – Fund.",group:"EF",emoji:"🌱"},
  {id:"ef2",label:"2º Ano",full:"2º Ano – Fund.",group:"EF",emoji:"🌿"},
  {id:"ef3",label:"3º Ano",full:"3º Ano – Fund.",group:"EF",emoji:"🍀"},
  {id:"ef4",label:"4º Ano",full:"4º Ano – Fund.",group:"EF",emoji:"⭐"},
  {id:"ef5",label:"5º Ano",full:"5º Ano – Fund.",group:"EF",emoji:"🌟"},
  {id:"ef6",label:"6º Ano",full:"6º Ano – Fund.",group:"EF",emoji:"💫"},
  {id:"ef7",label:"7º Ano",full:"7º Ano – Fund.",group:"EF",emoji:"🚀"},
  {id:"ef8",label:"8º Ano",full:"8º Ano – Fund.",group:"EF",emoji:"🔥"},
  {id:"ef9",label:"9º Ano",full:"9º Ano – Fund.",group:"EF",emoji:"⚡"},
  {id:"em1",label:"1º EM",full:"1º Ano – Médio",group:"EM",emoji:"🎯"},
  {id:"em2",label:"2º EM",full:"2º Ano – Médio",group:"EM",emoji:"🏆"},
  {id:"em3",label:"3º EM",full:"3º Ano – Médio",group:"EM",emoji:"🎓"},
];
const TOPICS={
  ef1:[{id:"alphabet",label:"The Alphabet",emoji:"🔤"},{id:"colors",label:"Colors & Shapes",emoji:"🎨"},{id:"numbers",label:"Numbers 1–10",emoji:"🔢"},{id:"animals",label:"Animals",emoji:"🐾"},{id:"greetings",label:"Hello & Goodbye",emoji:"👋"}],
  ef2:[{id:"family",label:"My Family",emoji:"👨‍👩‍👧"},{id:"school",label:"School Objects",emoji:"✏️"},{id:"body",label:"Body Parts",emoji:"🦷"},{id:"numbers2",label:"Numbers 11–20",emoji:"🔢"},{id:"feelings",label:"Feelings",emoji:"😊"}],
  ef3:[{id:"days",label:"Days & Months",emoji:"📅"},{id:"weather",label:"Weather",emoji:"☀️"},{id:"food",label:"Food & Drinks",emoji:"🍎"},{id:"clothes",label:"Clothes",emoji:"👕"},{id:"sentences",label:"Simple Sentences",emoji:"💬"}],
  ef4:[{id:"house",label:"My House",emoji:"🏠"},{id:"city",label:"My City",emoji:"🏙️"},{id:"hobbies",label:"Hobbies",emoji:"🎮"},{id:"tobe",label:"Verb To Be",emoji:"📝"},{id:"questions",label:"Basic Questions",emoji:"❓"}],
  ef5:[{id:"present",label:"Simple Present",emoji:"⏱️"},{id:"verbs",label:"Common Verbs",emoji:"🔧"},{id:"time",label:"Telling Time",emoji:"🕐"},{id:"sports",label:"Sports & Games",emoji:"⚽"},{id:"adjectives",label:"Adjectives",emoji:"✨"}],
  ef6:[{id:"progressive",label:"Present Progressive",emoji:"🔄"},{id:"prepositions",label:"Prepositions",emoji:"📍"},{id:"places",label:"Places in Town",emoji:"🗺️"},{id:"transport",label:"Transportation",emoji:"🚌"},{id:"plurals",label:"Singular & Plural",emoji:"📚"}],
  ef7:[{id:"past",label:"Simple Past",emoji:"📅"},{id:"pastbe",label:"Past of To Be",emoji:"⏪"},{id:"irregular",label:"Irregular Verbs",emoji:"⚡"},{id:"comparative",label:"Comparatives",emoji:"📊"},{id:"superlative",label:"Superlatives",emoji:"🏆"}],
  ef8:[{id:"future",label:"Future (will/going to)",emoji:"🚀"},{id:"modals",label:"Modal Verbs",emoji:"🔑"},{id:"conjunctions",label:"Conjunctions",emoji:"🔗"},{id:"reading",label:"Reading Skills",emoji:"📖"},{id:"writing",label:"Writing Skills",emoji:"✍️"}],
  ef9:[{id:"perfect",label:"Present Perfect",emoji:"✅"},{id:"passivei",label:"Passive Voice",emoji:"🔄"},{id:"cond",label:"Conditionals",emoji:"🔀"},{id:"reportedi",label:"Reported Speech",emoji:"💬"},{id:"vocab9",label:"Advanced Vocabulary",emoji:"📚"}],
  em1:[{id:"conditionals",label:"All Conditionals",emoji:"🔀"},{id:"passive",label:"Passive Voice",emoji:"🔄"},{id:"relative",label:"Relative Clauses",emoji:"🔗"},{id:"advvocab",label:"Advanced Vocabulary",emoji:"📖"},{id:"readcomp",label:"Reading Comprehension",emoji:"🔍"}],
  em2:[{id:"reported",label:"Reported Speech",emoji:"💬"},{id:"perfect",label:"Perfect Tenses",emoji:"✅"},{id:"inversions",label:"Inversions",emoji:"🔃"},{id:"formalwrit",label:"Formal Writing",emoji:"✍️"},{id:"idioms",label:"Idioms & Expressions",emoji:"💡"}],
  em3:[{id:"gramrev",label:"Grammar Review",emoji:"📚"},{id:"enem",label:"ENEM Preparation",emoji:"🎯"},{id:"academ",label:"Academic Vocabulary",emoji:"🎓"},{id:"essay",label:"Essay Writing",emoji:"📝"},{id:"lit",label:"English Literature",emoji:"📖"}],
};
const SKINS=[
  {id:"s1",base:"#FCECD6",sh:"#F5C9A0",dp:"#E8A96E"},
  {id:"s2",base:"#F2C48D",sh:"#D9A46A",dp:"#C07840"},
  {id:"s3",base:"#C8856A",sh:"#A86448",dp:"#864030"},
  {id:"s4",base:"#8B5E45",sh:"#6B3E28",dp:"#4A2518"},
  {id:"s5",base:"#4A2810",sh:"#2E1608",dp:"#1A0A04"},
];
const HAIR_STYLES=[{id:"hs1",label:"Curto"},{id:"hs2",label:"Longo"},{id:"hs3",label:"Cacheado"},{id:"hs4",label:"Coque"},{id:"hs5",label:"Moicano"}];
const HAIR_COLORS=[{id:"hc1",c:"#1a1008"},{id:"hc2",c:"#3D1F0A"},{id:"hc3",c:"#8B6914"},{id:"hc4",c:"#8B1A1A"},{id:"hc5",c:"#5B21B6"},{id:"hc6",c:"#1045A0"},{id:"hc7",c:"#E8E8E8"}];
const EYE_COLORS=[{id:"ec1",c:"#3B2008"},{id:"ec2",c:"#1045A0"},{id:"ec3",c:"#0F6B36"},{id:"ec4",c:"#5B7A8A"},{id:"ec5",c:"#6B35A0"}];
const OUTFITS=[{id:"oc1",c1:"#6366f1",c2:"#4F46E5"},{id:"oc2",c1:"#0EA5E9",c2:"#0284C7"},{id:"oc3",c1:"#22C55E",c2:"#16A34A"},{id:"oc4",c1:"#F43F5E",c2:"#E11D48"},{id:"oc5",c1:"#F59E0B",c2:"#D97706"},{id:"oc6",c1:"#F97316",c2:"#EA580C"},{id:"oc7",c1:"#EC4899",c2:"#DB2777"},{id:"oc8",c1:"#14B8A6",c2:"#0D9488"}];
const ACCESSORIES=[{id:"ac0",emoji:"✖",label:"Nenhum"},{id:"ac1",emoji:"👓",label:"Óculos"},{id:"ac2",emoji:"👑",label:"Coroa"},{id:"ac3",emoji:"🧢",label:"Boné"},{id:"ac4",emoji:"🎧",label:"Fone"},{id:"ac5",emoji:"🌸",label:"Flor"}];
const DEF_AV={name:"",age:12,skinId:"s2",hairStyleId:"hs1",hairColorId:"hc1",eyeColorId:"ec1",outfitId:"oc1",accessoryId:"ac0"};

const DAILY_TASKS=[
  {id:"login",icon:"🌅",label:"Login diário",xp:20,auto:true},
  {id:"chat",icon:"🤖",label:"Conversar com o tutor",xp:15},
  {id:"quiz",icon:"🎯",label:"Completar um quiz",xp:25},
  {id:"summary",icon:"📝",label:"Gerar um resumo",xp:15},
  {id:"speech",icon:"🎙️",label:"Praticar pronúncia",xp:20},
  {id:"exercise",icon:"✏️",label:"Fazer exercícios",xp:15},
];

const AVATAR_PHRASES={
  greet:["Olá! Que bom te ver! 👋","Vamos aprender jogando hoje! 🎮","Pronto para mais conhecimento? 🧠"],
  correct:["Arrasou! 🎉","Perfeito! +10 XP! ⚡","Show! Continue assim! 💪"],
  wrong:["Não desista! 💪","Boa tentativa! 🔄","Aprende-se errando! 📚"],
  weak:["Vamos estudar um pouco? 📚","Estou aqui para ajudar! 🤖"],
  tired:["Você está progredindo! 🔋","Mais um pouco! 🌱"],
  strong:["Você está arrasando! 🔥","Nível subindo! ⭐"],
  legendary:["LENDÁRIO! Incrível! 🏆","100% de poder! 🌟"],
  topics:{
    alphabet:["26 letras formam o inglês! 🔤","A=ay, B=bee, C=see... 🎵"],
    present:["Simple Present: I eat, he EATS! 🍎","Hábitos usam Simple Present! 📅"],
    past:["Verbos regulares terminam em -ED! 📅","go→went, eat→ate! ⚡"],
    animals:["Cat=gato, Dog=cachorro! 🐾","'Animal' é igual em inglês! 🐘"],
    colors:["Red=vermelho, Blue=azul! 🎨","Cores não mudam no plural! ✨"],
    modals:["Can=conseguir, Must=dever! 🔑","Should=deveria! 💡"],
    future:["Will: decisões na hora! 🚀","Going to: planos! 📋"],
  },
};

/* ══════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════ */
function genCode(){return Math.random().toString(36).slice(2,7).toUpperCase();}
function genUID(){return "MG-"+Math.random().toString(36).slice(2,6).toUpperCase()+"-"+Math.random().toString(36).slice(2,6).toUpperCase();}
function getPower(xp){return Math.min(100,Math.max(0,Math.round((xp||0)/10)));}
function getLevel(xp){return Math.floor(Math.max(0,xp||0)/80)+1;}
function getPowerInfo(xp){
  const p=getPower(xp);
  if(p>=80)return{state:"legendary",label:"Lendário! 🌟",g:G.yellow,c:"#FBBF24",glow:"#FDE68A"};
  if(p>=60)return{state:"strong",label:"Forte! 💪",g:G.green,c:"#34D399",glow:"#6EE7B7"};
  if(p>=40)return{state:"normal",label:"Normal 😊",g:G.cyan,c:"#06B6D4",glow:"#67E8F9"};
  if(p>=20)return{state:"tired",label:"Cansado 😓",g:G.orange,c:"#FB923C",glow:"#FDBA74"};
  return{state:"weak",label:"Fraco 😢",g:G.red,c:"#EF4444",glow:"#FCA5A5"};
}
function getTeacherData(){
  let d=ls.get(SK_TC);
  if(!d){d={code:genCode(),name:"Professor(a)",students:[]};ls.set(SK_TC,d);}
  return d;
}
function saveTeacherData(d){ls.set(SK_TC,d);}
function getLinkedStudents(){
  const td=getTeacherData();
  return(td.students||[]).map(sid=>{const p=ls.get("mg:stu:"+sid);return p?{...p,sid}:null;}).filter(Boolean);
}
function getDailyData(){
  const today=new Date().toDateString();
  const d=ls.get(SK_DAILY);
  if(!d||d.date!==today)return{date:today,done:[]};
  return d;
}
function markDailyTask(id){
  const d=getDailyData();
  if(!d.done.includes(id)){d.done=[...d.done,id];ls.set(SK_DAILY,d);return true;}
  return false;
}
function speak(text,rate=0.88,onEnd){
  if(!window.speechSynthesis)return;
  window.speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.lang="en-US";u.rate=rate;u.pitch=1.05;
  const voices=window.speechSynthesis.getVoices();
  const eng=voices.find(v=>v.lang.startsWith("en")&&v.name.includes("Female"))||voices.find(v=>v.lang.startsWith("en"))||voices[0];
  if(eng)u.voice=eng;
  if(onEnd)u.onend=onEnd;
  window.speechSynthesis.speak(u);
}
function levenshtein(a,b){
  const dp=Array.from({length:a.length+1},(_,i)=>Array.from({length:b.length+1},(_,j)=>i||j));
  for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)
    dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]:1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);
  return dp[a.length][b.length];
}
function pronScore(spoken,target){
  const s=spoken.toLowerCase().trim(),t=target.toLowerCase().trim();
  if(!s)return 0;
  return Math.max(0,Math.round((1-levenshtein(s,t)/Math.max(s.length,t.length))*100));
}
function buildSys(grade,lang){
  const g=GRADES.find(x=>x.id===grade)||GRADES[8];
  const lvl=grade.startsWith("ef")?parseInt(grade.replace("ef","")):9+parseInt(grade.replace("em",""));
  const hint=lvl<=3?"MUITO JOVEM (6-8 anos). Frases curtíssimas, emojis!":lvl<=6?"(9-11 anos). Linguagem simples e divertida.":lvl<=9?"(12-14 anos). Regras claras com exemplos.":"(15-17 anos). Avançado, nível ENEM.";
  const langRule=lang==="en"?"RESPOND ENTIRELY IN ENGLISH.":lang==="pt"?"Responda TODO em português brasileiro.":"Responda em português mas inclua exemplos em inglês.";
  return `Você é o MentalGame, professor para ${g.full} ${hint}. IDIOMA: ${langRule}. Responda sobre a matéria solicitada.`;
}

/* System prompt for JSON-only responses — no language mixing that breaks parsing */
function buildJSONSys(grade){
  const g=GRADES.find(x=>x.id===grade)||GRADES[8];
  const lvl=grade.startsWith("ef")?parseInt(grade.replace("ef","")):9+parseInt(grade.replace("em",""));
  const hint=lvl<=3?"very simple vocabulary for 6-8 year olds":lvl<=6?"simple vocabulary for 9-11 year olds":lvl<=9?"intermediate vocabulary for 12-14 year olds":"advanced vocabulary for 15-17 year olds, ENEM level";
  return `You are an English teacher for ${g.full} (${hint}). IMPORTANT: Your response must be ONLY valid JSON. Do NOT include any text, explanation, markdown, or code fences before or after the JSON. Output raw JSON only.`;
}

/* Robust JSON extractor — handles text before/after JSON, markdown fences, etc. */
function extractJSON(raw){
  if(!raw) throw new Error("Resposta vazia da API");
  // 1. Try direct parse
  try{return JSON.parse(raw.trim());}catch{}
  // 2. Remove markdown fences
  let c=raw.replace(/```json\s*/gi,"").replace(/```\s*/gi,"").trim();
  try{return JSON.parse(c);}catch{}
  // 3. Find first { ... } block
  const obj = raw.match(/\{[\s\S]*\}\s*$/);
  if(obj){try{return JSON.parse(obj[0]);}catch{}}
  // 4. Find first [ ... ] block
  const arr=raw.match(/\[[\s\S]*\]/);
  if(arr){try{return JSON.parse(arr[0]);}catch{}}
  // 5. Try to fix common issues: trailing commas, missing quotes
  const fixed =
  raw.replace(/,\s*([}\]])/g,"$1");
  try{return JSON.parse(fixed);}catch{}
  throw new Error("Formato de resposta inválido. Tente novamente.");
}

async function callAI(api,grade,lang){

  const lastMessage =
    api[api.length - 1]?.content || "";

  console.log("1 - CALL AI INICIO");
  console.log("Mensagem:", lastMessage);

  const r = await fetch(
    "https://mentalgame-backend-biah.onrender.com/chat",
    {
      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify({

        system: buildSys(grade,lang),

        max_tokens:2000,

        messages:[
          {
            role:"user",
            content:lastMessage
          }
        ]

      })
    }
  );

  console.log("2 - FETCH TERMINOU");
  console.log("STATUS:", r.status);

  if(!r.ok){

    const txt = await r.text();

    console.log("3 - ERRO BACKEND:");
    console.log(txt);

    throw new Error("Erro IA");
  }

  const data = await r.json();

  console.log("4 - JSON RECEBIDO:");
  console.log(data);

  return data.reply;
}
function startVoice(setValue){

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if(!SpeechRecognition){
    alert("Seu navegador não suporta voz.");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang =
  navigator.language || "pt-BR";

  recognition.interimResults = false;

  recognition.maxAlternatives = 1;

  recognition.onresult = (event)=>{

    const text =
      event.results[0][0].transcript;

    setValue(prev =>
      prev
        ? prev + " " + text
        : text
    );
  };

  recognition.onerror = (e)=>{
    console.log(e);
    alert("Erro no microfone");
  };

  recognition.start();
}

/* Dedicated JSON call — uses JSON-only system prompt and higher token limit */
async function callJSON(userPrompt,grade){

  const r = await fetch(
    "https://mentalgame-backend-biah.onrender.com/chat",
    {
      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify({

        system: buildJSONSys(grade),

        max_tokens:3000,

        messages:[
          {
            role:"user",
            content:userPrompt
          }
        ]

      })
    }
  );

  if(!r.ok){
    throw new Error("Erro IA JSON");
  }

  const data = await r.json();

  return extractJSON(data.reply);
}

/* Send image + text to Claude Vision */
async function callAIWithImage(
  imgBase64,
  imgMime,
  textPrompt,
  grade,
  lang
){

  const r = await fetch(
    "https://mentalgame-backend-biah.onrender.com/chat",
    {
      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify({

        system: buildSys(grade,lang),

        max_tokens:4000,

        messages:[
          {
            role:"user",
            content:[
              {
                type:"image",
                source:{
                  type:"base64",
                  media_type:imgMime,
                  data:imgBase64
                }
              },
              {
                type:"text",
                text:textPrompt
              }
            ]
          }
        ]

      })
    }
  );

  if(!r.ok){
    throw new Error("Erro IA imagem");
  }

  const data = await r.json();

  return data.reply;
}

/* Analyze image → returns structured JSON with summary + exercises */
async function analyzeImageJSON(
  imgBase64,
  imgMime,
  grade,
  customInstruction = ""   // ← novo parâmetro opcional
) {

  // Instrução padrão caso o aluno não escreva nada
  const fallbackInstruction =
    "Analyze this study material and generate summaries and exercises.";

  // Monta o prompt combinando instrução + série escolar
  const userInstruction = customInstruction.trim()
    ? customInstruction.trim()
    : fallbackInstruction;

const fullPrompt = `
Student grade: ${grade}

Student request:
"${userInstruction}"

Analyze the uploaded study material image.

You MUST generate:

1. topic
2. summaryPT
3. summaryEN
4. exercises

IMPORTANT:

- exercises MUST ALWAYS exist
- exercises MUST ALWAYS be an ARRAY
- create at least 2 exercises
- NEVER leave exercises empty
- NEVER use placeholders
- NEVER write:
  "Question"
  "Answer"
  "Explanation"

Each exercise MUST contain REAL content.

VALID JSON FORMAT:

{
  "topic":"Present Perfect",

  "summaryPT":"texto...",

  "summaryEN":"text...",

  "exercises":[
    {
      "questionPT":"Complete: I ___ seen this movie.",

      "questionEN":"Complete: I ___ seen this movie.",

      "answerPT":"have",

      "answerEN":"have",

      "explanationPT":"Present Perfect usa have/has.",

      "explanationEN":"Present Perfect uses have/has."
    }
  ]
}

Return ONLY VALID JSON.
`;

  const r = await fetch(
    "https://mentalgame-backend-biah.onrender.com/chat",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({

    system: `
You are an advanced educational OCR and tutoring AI.

Your job is to:
- analyze study material images
- identify topics from the image
- explain content
- generate REAL exercises
- generate REAL answers
- generate REAL explanations

NEVER generate placeholders.

NEVER write:
- "Question"
- "Answer"
- "Explanation"
without actual content.

All exercises must be complete and educational.

If the student asks for exercises about a specific topic from the image,
identify that topic and focus ONLY on it.

Carefully read ALL text visible in the image before answering.

Do not ignore handwritten or partially visible text.

If multiple topics exist, identify them in order.

Return ONLY VALID JSON.
No markdown.
No comments.
No extra text.
`,

        max_tokens: 7000,

        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: imgMime,
                  data: imgBase64
                }
              },
              {
                type: "text",
                text: fullPrompt
              }
            ]
          }
        ]

      })
    }
  );

  if(!r.ok){

  const errText = await r.text();

  console.error("ERRO OCR:", errText);

  throw new Error(errText);
}

  const data = await r.json();
  console.log("JSON BRUTO CLAUDE:");
  console.log(JSON.stringify(data,null,2));

  const parsed = extractJSON(data.reply);

  console.log("JSON EXTRAIDO:");
  console.log(JSON.stringify(parsed,null,2));

return parsed;
}
function AvatarSVG({av,xp,age=12,size=160}){
  const sk=SKINS.find(s=>s.id===av.skinId)||SKINS[1];
  const hc=(HAIR_COLORS.find(h=>h.id===av.hairColorId)||HAIR_COLORS[0]).c;
  const ec=(EYE_COLORS.find(e=>e.id===av.eyeColorId)||EYE_COLORS[0]).c;
  const ot=OUTFITS.find(o=>o.id===av.outfitId)||OUTFITS[0];
  const hs=av.hairStyleId||"hs1",ac=av.accessoryId||"ac0";
  const {state,glow}=getPowerInfo(xp);
  const a=Math.max(6,Math.min(17,age||12));
  const t=(a-6)/11;
  const hRX=Math.round(60-t*5),hRY=Math.round(63-t*6);
  const eRX=14.5-t*2,eRY=13.5-t*2,irisR=8.5-t*1.5,pupilR=5-t;
  const blushOp=0.6-t*0.35;
  const browW=3+t;
  const showNose=a>=9;
  const mouths={legendary:"M76 122 Q100 142 124 122",strong:"M78 120 Q100 136 122 120",normal:"M79 121 Q100 132 121 121",tired:"M79 124 Q100 117 121 124",weak:"M76 128 Q100 113 124 128"};
  const browLift={legendary:-6,strong:-4,normal:-2,tired:0,weak:3};
  const eyeOpen={legendary:1,strong:1,normal:1,tired:0.72,weak:0.5};
  const bl=browLift[state]||0;
  const eo=eyeOpen[state]||1;
  const mc=(state==="legendary"||state==="strong")?"#c0392b":"#888";
  const uid=`av${size}${av.skinId||"s"}`;
  const H={
    hs1:<path d={`M44 90 Q44 ${48-t*4} 100 ${42-t*4} Q156 ${48-t*4} 156 90 Q140 68 100 65 Q60 68 44 90Z`} fill={`url(#${uid}hair)`}/>,
    hs2:<g><path d={`M44 90 Q44 ${48} 100 ${42} Q156 ${48} 156 90 Q140 68 100 65 Q60 68 44 90Z`} fill={`url(#${uid}hair)`}/><rect x="44" y="72" width="16" height="90" rx="8" fill={hc}/><rect x="140" y="72" width="16" height="90" rx="8" fill={hc}/></g>,
    hs3:<g><path d={`M44 90 Q44 48 100 42 Q156 48 156 90 Q140 68 100 65 Q60 68 44 90Z`} fill={`url(#${uid}hair)`}/>{[[52,58,18],[70,46,20],[100,40,22],[130,46,20],[148,58,18],[48,80,14],[152,80,14]].map(([x,y,r],i)=><circle key={i} cx={x} cy={y} r={r} fill={hc} opacity="0.95"/>)}</g>,
    hs4:<g><path d="M46 95 Q46 52 100 46 Q154 52 154 95 Q144 74 100 72 Q56 74 46 95Z" fill={`url(#${uid}hair)`}/><circle cx="100" cy="44" r="21" fill={hc}/></g>,
    hs5:<path d="M82 95 Q82 85 100 40 Q118 85 118 95 Q110 78 100 55 Q90 78 82 95Z" fill={`url(#${uid}hair)`}/>,
  };
  const ACCS={
    ac0:null,
    ac1:<g><ellipse cx="76" cy="103" rx="15" ry="14" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="3"/><ellipse cx="124" cy="103" rx="15" ry="14" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="3"/><line x1="91" y1="103" x2="109" y2="103" stroke="rgba(255,255,255,0.55)" strokeWidth="3"/><line x1="61" y1="103" x2="53" y2="100" stroke="rgba(255,255,255,0.55)" strokeWidth="2.5"/><line x1="139" y1="103" x2="147" y2="100" stroke="rgba(255,255,255,0.55)" strokeWidth="2.5"/></g>,
    ac2:<g><path d="M60 72 L68 50 L82 64 L100 46 L118 64 L132 50 L140 72Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5"/><circle cx="68" cy="55" r="5" fill="#EF4444"/><circle cx="100" cy="50" r="6" fill="#A855F7"/><circle cx="132" cy="55" r="5" fill="#06B6D4"/><rect x="58" y="70" width="84" height="14" rx="7" fill="#FBBF24"/></g>,
    ac3:<g><path d={`M46 90 Q50 62 100 58 Q150 62 154 90 Q130 78 100 76 Q70 78 46 90Z`} fill={ot.c1}/><ellipse cx="100" cy="90" rx="58" ry="12" fill={ot.c1}/><path d="M40 92 Q30 92 28 88 Q40 84 46 90Z" fill={ot.c2}/></g>,
    ac4:<g><path d="M44 100 Q44 56 100 52 Q156 56 156 100" fill="none" stroke="#334155" strokeWidth="7" strokeLinecap="round"/><rect x="36" y="92" width="18" height="26" rx="9" fill="#1E293B"/><rect x="38" y="94" width="14" height="22" rx="7" fill="#475569"/><rect x="146" y="92" width="18" height="26" rx="9" fill="#1E293B"/><rect x="148" y="94" width="14" height="22" rx="7" fill="#475569"/></g>,
    ac5:<g>{[0,60,120,180,240,300].map((ang,i)=><ellipse key={i} cx={136+14*Math.cos(ang*Math.PI/180)} cy={58+14*Math.sin(ang*Math.PI/180)} rx="7" ry="7" fill={["#F472B6","#FCA5A5","#FDA4AF","#FBCFE8","#F9A8D4","#F472B6"][i]}/>)}<circle cx="136" cy="58" r="8" fill="#FDE68A"/></g>,
  };
  return(
    <svg viewBox="0 0 200 265" width={size} height={size*1.32} style={{display:"block",filter:`drop-shadow(0 6px 20px ${glow}88)`,transition:"filter .6s"}}>
      <defs>
        <radialGradient id={`${uid}skin`} cx="45%" cy="35%" r="65%"><stop offset="0%" stopColor={sk.base}/><stop offset="60%" stopColor={sk.sh}/><stop offset="100%" stopColor={sk.dp}/></radialGradient>
        <radialGradient id={`${uid}skinb`} cx="50%" cy="30%" r="70%"><stop offset="0%" stopColor={sk.base}/><stop offset="100%" stopColor={sk.sh}/></radialGradient>
        <linearGradient id={`${uid}shirt`} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={ot.c1}/><stop offset="100%" stopColor={ot.c2}/></linearGradient>
        <linearGradient id={`${uid}hair`} x1="0%" y1="0%" x2="50%" y2="100%"><stop offset="0%" stopColor={hc} stopOpacity="0.9"/><stop offset="100%" stopColor={hc}/></linearGradient>
        <radialGradient id={`${uid}eye`} cx="38%" cy="35%" r="60%"><stop offset="0%" stopColor={ec} stopOpacity="0.7"/><stop offset="100%" stopColor={ec}/></radialGradient>
        <radialGradient id={`${uid}aura`} cx="50%" cy="90%" r="50%"><stop offset="0%" stopColor={glow} stopOpacity="0.55"/><stop offset="100%" stopColor={glow} stopOpacity="0"/></radialGradient>
        <radialGradient id={`${uid}blush`} cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#FF8FA3" stopOpacity="0.55"/><stop offset="100%" stopColor="#FF8FA3" stopOpacity="0"/></radialGradient>
        <filter id={`${uid}soft`}><feGaussianBlur stdDeviation="1.5"/></filter>
      </defs>
      <ellipse cx="100" cy="255" rx="65" ry="12" fill={`url(#${uid}aura)`}/>
      <g transform={`translate(0,${state==="weak"?6:0})`}>
        {/* Body */}
        <path d="M42 190 Q36 182 32 175 L52 165 Q60 160 68 158 L100 155 L132 158 Q140 160 148 165 L168 175 Q164 182 158 190 Q150 210 148 242 L52 242 Q50 210 42 190Z" fill={`url(#${uid}shirt)`}/>
        <path d="M100 155 L100 242" stroke={ot.c2} strokeWidth="1.5" strokeOpacity="0.3"/>
        {/* Collar */}
        <path d="M84 157 L100 173 L116 157 Q108 153 100 153 Q92 153 84 157Z" fill={sk.base} opacity="0.9"/>
        {/* Arms */}
        <path d="M52 165 Q40 168 32 175 Q24 185 26 202 Q28 214 36 219 Q44 223 52 218 Q60 213 60 200 L60 175Z" fill={`url(#${uid}shirt)`}/>
        <ellipse cx="38" cy="225" rx="12" ry="10" fill={`url(#${uid}skinb)`}/>
        <path d="M148 165 Q160 168 168 175 Q176 185 174 202 Q172 214 164 219 Q156 223 148 218 Q140 213 140 200 L140 175Z" fill={`url(#${uid}shirt)`}/>
        <ellipse cx="162" cy="225" rx="12" ry="10" fill={`url(#${uid}skinb)`}/>
        {/* Neck */}
        <path d="M88 148 Q90 140 100 138 Q110 140 112 148 L112 162 Q106 166 100 166 Q94 166 88 162Z" fill={`url(#${uid}skin)`}/>
        <ellipse cx="100" cy="163" rx="12" ry="4" fill={sk.dp} opacity="0.28"/>
        {/* Long hair behind head */}
        {hs==="hs2"&&H.hs2}
        {/* Ears */}
        <ellipse cx="43" cy="102" rx="9" ry={hRY*0.2} fill={`url(#${uid}skinb)`}/>
        <ellipse cx="44" cy="102" rx="5" ry={hRY*0.13} fill={sk.sh} opacity="0.5"/>
        <ellipse cx="157" cy="102" rx="9" ry={hRY*0.2} fill={`url(#${uid}skinb)`}/>
        <ellipse cx="156" cy="102" rx="5" ry={hRY*0.13} fill={sk.sh} opacity="0.5"/>
        {/* Head */}
        <ellipse cx="100" cy="100" rx={hRX} ry={hRY} fill={`url(#${uid}skin)`}/>
        {/* Cheek blush */}
        <ellipse cx="64" cy="118" rx={14-t*2} ry={9-t*2} fill={`url(#${uid}blush)`} opacity={blushOp}/>
        <ellipse cx="136" cy="118" rx={14-t*2} ry={9-t*2} fill={`url(#${uid}blush)`} opacity={blushOp}/>
        {/* Hair front */}
        {hs!=="hs2"&&H[hs]}
        {/* Eye sockets */}
        <ellipse cx="76" cy="104" rx={eRX+2} ry={(eRY+2)*eo} fill={sk.dp} opacity="0.1" filter={`url(#${uid}soft)`}/>
        <ellipse cx="124" cy="104" rx={eRX+2} ry={(eRY+2)*eo} fill={sk.dp} opacity="0.1" filter={`url(#${uid}soft)`}/>
        {/* Eye whites */}
        <ellipse cx="76" cy="103" rx={eRX} ry={eRY*eo} fill="white"/>
        <ellipse cx="124" cy="103" rx={eRX} ry={eRY*eo} fill="white"/>
        {/* Iris */}
        <circle cx="76" cy="103" r={irisR} fill={`url(#${uid}eye)`}/>
        <circle cx="124" cy="103" r={irisR} fill={`url(#${uid}eye)`}/>
        {/* Pupil */}
        <circle cx="77" cy="104" r={pupilR} fill="#111"/>
        <circle cx="125" cy="104" r={pupilR} fill="#111"/>
        {/* Specular */}
        <circle cx="79" cy="100" r={Math.max(1.5,2.5-t)} fill="white" opacity="0.9"/>
        <circle cx="127" cy="100" r={Math.max(1.5,2.5-t)} fill="white" opacity="0.9"/>
        {/* Lashes */}
        <path d={`M${76-eRX} ${103-eRY*eo} Q76 ${103-eRY*eo*1.6} ${76+eRX} ${103-eRY*eo}`} fill="none" stroke={hc} strokeWidth={1.8*eo} strokeOpacity="0.8" strokeLinecap="round"/>
        <path d={`M${124-eRX} ${103-eRY*eo} Q124 ${103-eRY*eo*1.6} ${124+eRX} ${103-eRY*eo}`} fill="none" stroke={hc} strokeWidth={1.8*eo} strokeOpacity="0.8" strokeLinecap="round"/>
        {/* Brows */}
        <path d={`M63 ${89+bl} Q74 ${83+bl} 84 ${88+bl}`} stroke={hc} strokeWidth={browW} strokeLinecap="round" fill="none" opacity="0.9"/>
        <path d={`M116 ${88+bl} Q126 ${83+bl} 137 ${89+bl}`} stroke={hc} strokeWidth={browW} strokeLinecap="round" fill="none" opacity="0.9"/>
        {/* Nose */}
        {showNose?(<g><path d="M97 112 Q100 118 103 112" stroke={sk.dp} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6"/><ellipse cx="95" cy="120" rx="4" ry="2.8" fill={sk.dp} opacity="0.18"/><ellipse cx="105" cy="120" rx="4" ry="2.8" fill={sk.dp} opacity="0.18"/></g>):(<circle cx="100" cy="117" r="3.5" fill={sk.sh} opacity="0.3"/>)}
        {/* Mouth */}
        <path d={mouths[state]} stroke={mc} strokeWidth="2.8" strokeLinecap="round" fill="none" opacity="0.7"/>
        <path d="M83 120 Q91 117 100 119 Q109 117 117 120" stroke={sk.dp} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.3"/>
        {/* Accessory */}
        {ACCS[ac]}
      </g>
      {state==="legendary"&&<text x="100" y="258" textAnchor="middle" fontSize="14">⭐⭐⭐</text>}
      {state==="strong"&&<text x="100" y="258" textAnchor="middle" fontSize="14">⭐⭐</text>}
    </svg>
  );
}

/* ══════════════════════════════════════════════════════
   REUSABLE UI COMPONENTS
══════════════════════════════════════════════════════ */
function Btn({children,onClick,grad,style={},disabled,sm}){
  return(
    <button onClick={onClick} disabled={disabled} className="cta"
      style={{background:disabled?"rgba(255,255,255,0.1)":grad||G.pink,
        color:"white",padding:sm?"7px 16px":"13px 28px",fontSize:sm?12:15,
        boxShadow:disabled?"none":"0 5px 18px rgba(0,0,0,0.3)",...style}}>
      {children}
    </button>
  );
}
function Spinner({label}){
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:16}}>
      <div style={{width:46,height:46,borderRadius:"50%",background:G.rainbow,animation:"spin .9s linear infinite",opacity:.85}}/>
      <p style={{fontWeight:800,fontSize:14,color:"rgba(255,255,255,0.55)"}}>{label}</p>
    </div>
  );
}
function ErrBox({msg,onRetry}){
  return(
    <div style={{padding:28}}>
      <div style={{padding:"14px 18px",background:"rgba(239,68,68,0.12)",border:"1.5px solid rgba(239,68,68,0.3)",borderRadius:16,color:"#FCA5A5",fontSize:13,fontWeight:700,marginBottom:14,lineHeight:1.6}}>{msg}</div>
      {onRetry&&<Btn onClick={onRetry} grad={G.red} sm>🔄 Tentar novamente</Btn>}
    </div>
  );
}
function EmptyStart({icon,title,desc,btnLabel,onClick,pInfo}){
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:18,padding:44,textAlign:"center"}}>
      <div style={{fontSize:58,animation:"float 2.5s ease-in-out infinite"}}>{icon}</div>
      <h3 style={{color:"white",fontSize:22,fontWeight:900,margin:0}}>{title}</h3>
      <p style={{color:"rgba(255,255,255,0.5)",maxWidth:320,fontSize:14,lineHeight:1.7,fontWeight:600,margin:0}}>{desc}</p>
      {btnLabel&&<Btn onClick={onClick} grad={pInfo?.g||G.pink}>{btnLabel}</Btn>}
    </div>
  );
}
function MD({text}){
  return(text||"").split(/(\*\*[^*]+\*\*|`[^`]+`|\n)/g).map((p,i)=>{
    if(p==="\n")return<br key={i}/>;
    if(p.startsWith("**")&&p.endsWith("**"))return<strong key={i} style={{color:"#FBBF24"}}>{p.slice(2,-2)}</strong>;
    if(p.startsWith("`")&&p.endsWith("`"))return<code key={i} style={{background:"rgba(6,182,212,0.2)",padding:"2px 7px",borderRadius:6,color:"#67E8F9",fontSize:13}}>{p.slice(1,-1)}</code>;
    return<span key={i}>{p}</span>;
  });
}
function BackBtn({onClick,label="Voltar"}){
  return(
    <button onClick={onClick} style={{position:"fixed",top:16,left:16,zIndex:999,display:"flex",alignItems:"center",gap:7,
      background:"rgba(255,255,255,0.08)",backdropFilter:"blur(14px)",border:"1.5px solid rgba(255,255,255,0.15)",
      borderRadius:999,padding:"8px 16px 8px 12px",cursor:"pointer",color:"rgba(255,255,255,0.8)",fontFamily:"'Nunito',sans-serif",
      fontWeight:800,fontSize:13,boxShadow:"0 4px 16px rgba(0,0,0,0.3)"}}>
      ‹ {label}
    </button>
  );
}
function LangToggle({lang,setLang,pInfo}){
  const opts=[{id:"pt",flag:"🇧🇷",label:"PT"},{id:"mix",flag:"🌐",label:"Mix"},{id:"en",flag:"🇬🇧",label:"EN"}];
  return(
    <div style={{display:"flex",gap:4,background:"rgba(0,0,0,0.3)",borderRadius:999,padding:"3px"}}>
      {opts.map(o=>(
        <button key={o.id} onClick={()=>setLang(o.id)}
          style={{padding:"4px 10px",borderRadius:999,border:"none",cursor:"pointer",fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:11,
            background:lang===o.id?pInfo.g:"transparent",color:lang===o.id?"white":"rgba(255,255,255,0.4)",transition:"all .2s"}}>
          {o.flag} {o.label}
        </button>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   ISOLATED INPUTS  (prevent focus loss on re-render)
══════════════════════════════════════════════════════ */
const IsoNameInput=React.memo(function IsoNameInput({init,accentC,onCommit}){
  const ref=useRef(null);
  return(
    <input ref={ref} defaultValue={init} placeholder="Como quer ser chamado?" maxLength={24} autoComplete="off" spellCheck={false}
      onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.12)";onCommit(e.target.value);}}
      onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();onCommit(e.target.value);e.target.blur();} }}
      onFocus={e=>e.target.style.borderColor=accentC}
      style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"2px solid rgba(255,255,255,0.12)",borderRadius:14,
        padding:"12px 15px",color:"white",fontSize:15,outline:"none",fontWeight:700,boxSizing:"border-box"}}/>
  );
},()=>true);
const IsoAgeInput=React.memo(function IsoAgeInput({init,accentC,accentG,onCommit}){
  const [age,setAge]=useState(init||12);
  const lb=age<=8?"Criança 🧒":age<=11?"Pré-adolescente 🙂":age<=14?"Adolescente 😎":"Jovem adulto 🎓";
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <span style={{color:"rgba(255,255,255,0.5)",fontSize:13,fontWeight:700}}>{lb}</span>
        <span style={{fontWeight:900,fontSize:20,background:accentG,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{age} anos</span>
      </div>
      <input type="range" min={6} max={17} step={1} value={age} onChange={e=>{const v=parseInt(e.target.value);setAge(v);onCommit(v);}}
        style={{width:"100%",height:6,borderRadius:99,appearance:"none",outline:"none",cursor:"pointer",
          background:`linear-gradient(to right,${accentC} 0%,${accentC} ${((age-6)/11)*100}%,rgba(255,255,255,0.15) ${((age-6)/11)*100}%,rgba(255,255,255,0.15) 100%)`}}/>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
        {[6,8,10,12,14,17].map(v=><span key={v} style={{fontSize:10,color:"rgba(255,255,255,0.25)",fontWeight:700}}>{v}</span>)}
      </div>
    </div>
  );
},()=>true);

/* ══════════════════════════════════════════════════════
   SCREENS
══════════════════════════════════════════════════════ */

/* USER TYPE */
const USER_TYPES=[
  {id:"student",emoji:"🎒",label:"Aluno",desc:"Aprendo jogando e evoluo meu avatar!",g:"linear-gradient(135deg,#6366f1,#a855f7)",c:"#8b5cf6"},
  {id:"guardian",emoji:"👨‍👩‍👧",label:"Responsável",desc:"Acompanho o progresso do meu filho(a).",g:"linear-gradient(135deg,#f59e0b,#f97316)",c:"#f59e0b"},
  {id:"teacher",emoji:"🏫",label:"Professor / Escola",desc:"Gestiono turmas e acompanho alunos.",g:"linear-gradient(135deg,#06b6d4,#34d399)",c:"#06b6d4"},
];
function UserTypeSelect({onSelect}){
  const [hov,setHov]=useState(null);
  return(
    <div style={{minHeight:"100vh",background:G.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 24px"}}>
      {["🎓","⭐","🎮","🧠","🌈"].map((e,i)=>(
        <div key={i} style={{position:"fixed",fontSize:22,opacity:0.1,userSelect:"none",pointerEvents:"none",animation:`float ${3+i*.3}s ease-in-out infinite`,animationDelay:`${i*.4}s`,top:`${12+i*15}%`,left:i%2===0?`${3+i*4}%`:`${90-i*3}%`}}>{e}</div>
      ))}
      <div style={{maxWidth:520,width:"100%",position:"relative",zIndex:1}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{fontSize:48,marginBottom:8,animation:"wiggle 3s ease-in-out infinite"}}>🎮</div>
          <h1 style={{fontSize:34,fontWeight:900,margin:0,background:G.rainbow,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundSize:"300%",animation:"rainbow 4s linear infinite"}}>MentalGame</h1>
          <p style={{color:"rgba(255,255,255,0.45)",fontSize:15,marginTop:10,fontWeight:700}}>Quem é você? Escolha seu perfil 👇</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {USER_TYPES.map(t=>{
            const h=hov===t.id;
            return(
              <button key={t.id} onClick={()=>onSelect(t.id)} onMouseEnter={()=>setHov(t.id)} onMouseLeave={()=>setHov(null)}
                style={{display:"flex",alignItems:"center",gap:20,padding:"22px 26px",borderRadius:22,cursor:"pointer",transition:"all .22s",textAlign:"left",fontFamily:"'Nunito',sans-serif",
                  background:h?t.g:"rgba(255,255,255,0.05)",border:`2px solid ${h?"transparent":"rgba(255,255,255,0.1)"}`,
                  transform:h?"translateX(6px) scale(1.02)":"none",boxShadow:h?`0 12px 32px ${t.c}44`:"none"}}>
                <div style={{fontSize:40,flexShrink:0}}>{t.emoji}</div>
                <div>
                  <div style={{color:"white",fontWeight:900,fontSize:18,marginBottom:4}}>{t.label}</div>
                  <div style={{color:h?"rgba(255,255,255,0.8)":"rgba(255,255,255,0.4)",fontSize:13,fontWeight:600}}>{t.desc}</div>
                </div>
                <div style={{marginLeft:"auto",fontSize:22,opacity:h?1:0.3,transition:"opacity .2s"}}>›</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* GRADE SELECT */
function GradeSelect({onSelect,onBack}){
  const [hov,setHov]=useState(null);
  const isMobile=useIsMobile();
  const ef=GRADES.filter(g=>g.group==="EF"),em=GRADES.filter(g=>g.group==="EM");
  const Card=({g})=>{
    const p=GP[g.id],h=hov===g.id;
    return(
      <button onClick={()=>onSelect(g)} onMouseEnter={()=>setHov(g.id)} onMouseLeave={()=>setHov(null)}
        style={{padding:isMobile?"12px 6px":"15px 8px",borderRadius:18,background:h?p.g:"rgba(255,255,255,0.05)",border:`2px solid ${h?"transparent":"rgba(255,255,255,0.09)"}`,cursor:"pointer",transition:"all .22s",textAlign:"center",fontFamily:"'Nunito',sans-serif",transform:h?"translateY(-5px) scale(1.06)":"none",boxShadow:h?`0 12px 28px ${p.c}55`:"none"}}>
        <div style={{fontSize:isMobile?20:24,marginBottom:4}}>{g.emoji}</div>
        <div style={{color:"white",fontWeight:800,fontSize:isMobile?10:12}}>{g.label}</div>
      </button>
    );
  };
  return(
    <div style={{minHeight:"100vh",background:G.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:isMobile?"20px 12px":"30px 20px",overflowY:"auto"}}>
      {onBack&&<BackBtn onClick={onBack} label="Perfis"/>}
      <div style={{maxWidth:680,width:"100%",position:"relative",zIndex:1}}>
        <div style={{textAlign:"center",marginBottom:isMobile?24:40}}>
          <div style={{fontSize:isMobile?38:50,marginBottom:8,animation:"wiggle 3s ease-in-out infinite"}}>🎮</div>
          <h1 style={{fontSize:isMobile?28:38,fontWeight:900,margin:0,letterSpacing:"-1.5px",background:G.rainbow,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundSize:"300%",animation:"rainbow 4s linear infinite"}}>MentalGame</h1>
          <p style={{color:"rgba(255,255,255,0.45)",fontSize:isMobile?13:15,marginTop:10,fontWeight:700}}>Escolha sua série para começar! 🎉</p>
        </div>
        <div className="glass" style={{marginBottom:14,padding:isMobile?"14px 12px":"20px 18px"}}>
          <div style={{fontSize:10,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:12,background:"linear-gradient(135deg,#34d399,#06b6d4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>🏫 Ensino Fundamental</div>
          <div className="grade-grid-ef" style={{display:"grid",gridTemplateColumns:isMobile?"repeat(3,1fr)":"repeat(9,1fr)",gap:isMobile?8:7}}>{ef.map(g=><Card key={g.id} g={g}/>)}</div>
        </div>
        <div className="glass" style={{padding:isMobile?"14px 12px":"20px 18px"}}>
          <div style={{fontSize:10,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:12,background:"linear-gradient(135deg,#f472b6,#a855f7)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>🏛 Ensino Médio</div>
          <div className="grade-grid-em" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:isMobile?8:7}}>{em.map(g=><Card key={g.id} g={g}/>)}</div>
        </div>
      </div>
    </div>
  );
}

/* AVATAR CREATE */
function AvSec({label,grad,children}){
  return(
    <div style={{marginBottom:18}}>
      <div style={{fontSize:10,fontWeight:800,letterSpacing:1.5,textTransform:"uppercase",marginBottom:8,background:grad,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{label}</div>
      {children}
    </div>
  );
}
function ColorRow({items,selId,accentC,onSel}){
  return(
    <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
      {items.map(it=>(
        <button key={it.id} onClick={()=>onSel(it.id)}
          style={{width:34,height:34,borderRadius:"50%",background:it.c,cursor:"pointer",flexShrink:0,border:`3px solid ${selId===it.id?accentC:"transparent"}`,
            boxShadow:selId===it.id?`0 0 0 3px ${accentC}55,0 0 14px ${accentC}44`:"none",transition:"all .18s",transform:selId===it.id?"scale(1.2)":"scale(1)"}}>
        </button>
      ))}
    </div>
  );
}
function ChipRow({items,selId,accentG,accentC,onSel}){
  return(
    <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
      {items.map(it=>(
        <button key={it.id} onClick={()=>onSel(it.id)}
          style={{padding:"6px 14px",borderRadius:999,fontFamily:"'Nunito',sans-serif",fontWeight:700,fontSize:12,cursor:"pointer",
            background:selId===it.id?accentG:"rgba(255,255,255,0.06)",border:`2px solid ${selId===it.id?"transparent":"rgba(255,255,255,0.12)"}`,
            color:"white",transition:"all .18s",boxShadow:selId===it.id?`0 4px 14px ${accentC}44`:"none"}}>
          {it.emoji||it.label}
        </button>
      ))}
    </div>
  );
}
function AvatarCreate({grade,initial,onSave,onBack}){
  const [av,setAv]=useState(()=>initial||DEF_AV);
  const [name,setName]=useState(initial?.name||"");
  const [age,setAge]=useState(initial?.age||12);
  const isMobile=useIsMobile();
  const gObj=GRADES.find(x=>x.id===grade);
  const p=GP[grade]||GP.ef6;
  const setF=useCallback((k,v)=>setAv(prev=>({...prev,[k]:v})),[]);
  const doSave=()=>{ const uid=initial?.uid||genUID(); onSave({...av,name:name.trim()||"Aluno",age,uid}); };
  return(
    <div style={{minHeight:"100vh",background:G.bg,display:"flex",alignItems:isMobile?"flex-start":"center",justifyContent:"center",padding:isMobile?0:24,overflowY:"auto"}}>
      {onBack&&<BackBtn onClick={onBack} label="Séries"/>}
      <div style={{maxWidth:820,width:"100%",borderRadius:isMobile?0:28,overflow:"hidden",display:"flex",flexDirection:isMobile?"column":"row",boxShadow:isMobile?"none":"0 32px 80px rgba(0,0,0,0.5)",border:isMobile?"none":"2px solid rgba(255,255,255,0.1)"}}>
        {/* Preview */}
        <div style={{width:isMobile?"100%":260,background:`linear-gradient(180deg,${p.c}28,${p.c}08)`,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",display:"flex",flexDirection:isMobile?"row":"column",alignItems:"center",justifyContent:"center",padding:isMobile?"16px 20px":"36px 18px",gap:isMobile?16:14,flexShrink:0,borderRight:isMobile?"none":"1px solid rgba(255,255,255,0.08)",borderBottom:isMobile?"1px solid rgba(255,255,255,0.08)":"none"}}>
          <div className="avatar-sway"><AvatarSVG av={av} age={age} xp={initial?.xp||50} size={isMobile?86:148}/></div>
          <div style={{textAlign:isMobile?"left":"center"}}>
            <div style={{color:"white",fontWeight:900,fontSize:isMobile?15:17}}>{name||"Seu Avatar"}</div>
            <div style={{fontSize:11,fontWeight:700,marginTop:2,color:"rgba(255,255,255,0.45)"}}>{age} anos • {gObj?.full}</div>
            {initial?.uid&&<div style={{fontSize:9,fontWeight:700,marginTop:4,color:"rgba(255,255,255,0.3)",letterSpacing:1}}>{initial.uid}</div>}
          </div>
        </div>
        {/* Controls */}
        <div style={{flex:1,padding:isMobile?"20px 18px 32px":"28px 26px",overflowY:"auto",maxHeight:isMobile?"none":"90vh",background:"rgba(8,5,22,0.75)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)"}}>
          <h2 style={{fontWeight:900,fontSize:isMobile?18:22,margin:"0 0 18px",background:G.rainbow,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundSize:"300%",animation:"rainbow 4s linear infinite"}}>🎨 Crie seu Avatar</h2>
          <AvSec label="Seu nome" grad={p.g}><IsoNameInput init={initial?.name||""} accentC={p.c} onCommit={v=>setName(v)}/>{name&&<div style={{marginTop:6,fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.4)"}}>👋 Olá, <span style={{color:"white"}}>{name}</span>!</div>}</AvSec>
          <AvSec label="Sua idade (6–17 anos)" grad={p.g}><IsoAgeInput init={initial?.age||12} accentC={p.c} accentG={p.g} onCommit={v=>setAge(v)}/></AvSec>
          <AvSec label="Tom de pele" grad={p.g}><ColorRow items={SKINS.map(s=>({id:s.id,c:s.base}))} selId={av.skinId} accentC={p.c} onSel={v=>setF("skinId",v)}/></AvSec>
          <AvSec label="Estilo do cabelo" grad={p.g}><ChipRow items={HAIR_STYLES} selId={av.hairStyleId} accentG={p.g} accentC={p.c} onSel={v=>setF("hairStyleId",v)}/></AvSec>
          <AvSec label="Cor do cabelo" grad={p.g}><ColorRow items={HAIR_COLORS.map(h=>({id:h.id,c:h.c}))} selId={av.hairColorId} accentC={p.c} onSel={v=>setF("hairColorId",v)}/></AvSec>
          <AvSec label="Cor dos olhos" grad={p.g}><ColorRow items={EYE_COLORS.map(e=>({id:e.id,c:e.c}))} selId={av.eyeColorId} accentC={p.c} onSel={v=>setF("eyeColorId",v)}/></AvSec>
          <AvSec label="Roupa" grad={p.g}><ColorRow items={OUTFITS.map(o=>({id:o.id,c:o.c1}))} selId={av.outfitId} accentC={p.c} onSel={v=>setF("outfitId",v)}/></AvSec>
          <AvSec label="Acessório" grad={p.g}><ChipRow items={ACCESSORIES} selId={av.accessoryId} accentG={p.g} accentC={p.c} onSel={v=>setF("accessoryId",v)}/></AvSec>
          <Btn onClick={doSave} disabled={!name.trim()} grad={p.g} style={{width:"100%",fontSize:16,padding:"14px",marginTop:6,boxShadow:name.trim()?`0 8px 24px ${p.c}44`:"none"}}>
            {initial?"💾 Salvar Avatar":"🚀 Começar a Aprender!"}
          </Btn>
          {!name.trim()&&<p style={{textAlign:"center",color:"rgba(255,255,255,0.3)",fontSize:12,marginTop:10,fontWeight:700}}>☝️ Digite seu nome para continuar</p>}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MODALS
══════════════════════════════════════════════════════ */
function AvatarSpeechBubble({message,pInfo,onDismiss}){
  useEffect(()=>{const t=setTimeout(onDismiss,5000);return()=>clearTimeout(t);},[message]);
  return(
    <div style={{marginBottom:6,animation:"bubble-in .3s ease"}}>
      <div style={{background:"rgba(255,255,255,0.95)",borderRadius:"14px 14px 14px 4px",padding:"9px 28px 9px 13px",maxWidth:185,position:"relative",boxShadow:`0 6px 20px rgba(0,0,0,0.4),0 0 0 2px ${pInfo.c}44`}}>
        <p style={{color:"#1a1a2e",fontSize:12,fontWeight:800,margin:0,lineHeight:1.4}}>{message}</p>
        <button onClick={onDismiss} style={{position:"absolute",top:4,right:6,background:"none",border:"none",color:"#64748b",fontSize:12,cursor:"pointer",lineHeight:1,padding:0}}>✕</button>
      </div>
      <div style={{width:0,height:0,borderLeft:"8px solid transparent",borderRight:"8px solid transparent",borderTop:"8px solid rgba(255,255,255,0.95)",marginLeft:16}}/>
    </div>
  );
}
function AvatarHelpModal({pwInfo,power,level,onClose}){
  const tips=[{icon:"🎯",xp:"+10 XP",act:"Acertar uma questão do Quiz"},{icon:"📝",xp:"+5 XP",act:"Gerar um Resumo"},{icon:"👁",xp:"+3 XP",act:"Ver resposta de Exercício"},{icon:"✅",xp:"+5 XP",act:"Revelar gabarito completo"},{icon:"🎙️",xp:"+20 XP",act:"Praticar pronúncia"},{icon:"🌅",xp:"+20 XP",act:"Login diário"},{icon:"❌",xp:"−3 XP",act:"Errar uma questão do Quiz"}];
  const states=[{s:"weak",r:"0–19%",lb:"Fraco 😢",c:"#ef4444"},{s:"tired",r:"20–39%",lb:"Cansado 😓",c:"#fb923c"},{s:"normal",r:"40–59%",lb:"Normal 😊",c:"#06b6d4"},{s:"strong",r:"60–79%",lb:"Forte 💪",c:"#34d399"},{s:"legendary",r:"80–100%",lb:"Lendário 🌟",c:"#fbbf24"}];
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:16}}>
      <div onClick={e=>e.stopPropagation()} className="glass" style={{maxWidth:400,width:"100%",padding:"26px 22px",background:"linear-gradient(160deg,#0f0928,#071a3e)",boxShadow:"0 24px 64px rgba(0,0,0,0.6)",animation:"fadeUp .25s ease",overflowY:"auto",maxHeight:"85vh"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <h3 style={{color:"white",fontWeight:900,fontSize:17,margin:0}}>❓ Como Evoluir seu Avatar</h3>
          <button onClick={onClose} style={{background:"none",border:"none",color:"rgba(255,255,255,0.5)",fontSize:20,cursor:"pointer"}}>✕</button>
        </div>
        <div style={{padding:"10px 14px",borderRadius:14,background:"rgba(255,255,255,0.06)",border:"1.5px solid rgba(255,255,255,0.1)",marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Seu status</div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{color:"white",fontWeight:800}}>{pwInfo.label}</span><span style={{color:pwInfo.c,fontWeight:900}}>{power}% • Nível {level}</span></div>
          <div style={{height:7,background:"rgba(255,255,255,0.08)",borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",width:`${power}%`,background:pwInfo.g,borderRadius:99,boxShadow:`0 0 10px ${pwInfo.c}88`}}/></div>
          <div style={{color:"rgba(255,255,255,0.3)",fontSize:10,fontWeight:700,marginTop:5}}>10 XP = 1% poder • 80 XP = +1 nível</div>
        </div>
        <div style={{marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Como ganhar XP</div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>{tips.map((t,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:"rgba(255,255,255,0.05)",borderRadius:11}}>
              <span style={{fontSize:16}}>{t.icon}</span><span style={{color:"rgba(255,255,255,0.75)",fontSize:12,fontWeight:600,flex:1}}>{t.act}</span>
              <span style={{fontWeight:900,fontSize:12,color:t.xp.startsWith("+")?"#34d399":"#f472b6"}}>{t.xp}</span>
            </div>
          ))}</div>
        </div>
        <div>
          <div style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Estados</div>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>{states.map(s=>(
            <div key={s.s} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 11px",background:s.s===pwInfo.state?"rgba(255,255,255,0.08)":"rgba(255,255,255,0.03)",borderRadius:9,border:`1px solid ${s.s===pwInfo.state?s.c+"44":"transparent"}`}}>
              <div style={{width:9,height:9,borderRadius:"50%",background:s.c,flexShrink:0,boxShadow:s.s===pwInfo.state?`0 0 8px ${s.c}`:"none"}}/>
              <span style={{color:s.s===pwInfo.state?"white":"rgba(255,255,255,0.5)",fontWeight:700,fontSize:12,flex:1}}>{s.lb}</span>
              <span style={{color:"rgba(255,255,255,0.3)",fontSize:11,fontWeight:600}}>{s.r}</span>
            </div>
          ))}</div>
        </div>
      </div>
    </div>
  );
}
function DailyTasksModal({profile,onClose,onXP,onTaskDone}){
  const [daily,setDaily]=useState(()=>getDailyData());
  const [claimed,setClaimed]=useState({});
  const done=id=>daily.done.includes(id)||claimed[id];
  const total=DAILY_TASKS.reduce((a,t)=>a+t.xp,0);
  const earned=DAILY_TASKS.filter(t=>done(t.id)).reduce((a,t)=>a+t.xp,0);
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(10px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:20}}>
      <div onClick={e=>e.stopPropagation()} style={{maxWidth:420,width:"100%",borderRadius:26,overflow:"hidden",background:"linear-gradient(160deg,#0f0928,#071a3e,#00141a)",border:"2px solid rgba(255,255,255,0.12)",boxShadow:"0 30px 80px rgba(0,0,0,0.7)",animation:"fadeUp .3s ease"}}>
        <div style={{padding:"20px 22px 14px",background:"linear-gradient(135deg,rgba(251,191,36,0.15),rgba(249,115,22,0.1))",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:11,fontWeight:800,color:"rgba(251,191,36,0.8)",letterSpacing:1.5,textTransform:"uppercase",marginBottom:4}}>🌅 Tarefas Diárias</div>
              <h3 style={{color:"white",fontWeight:900,fontSize:18,margin:0}}>Bom dia, {profile.name}! 😊</h3>
            </div>
            <button onClick={onClose} style={{background:"rgba(255,255,255,0.1)",border:"none",color:"rgba(255,255,255,0.6)",width:32,height:32,borderRadius:"50%",cursor:"pointer",fontSize:16,flexShrink:0}}>✕</button>
          </div>
          <div style={{marginTop:12}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{color:"rgba(255,255,255,0.5)",fontSize:11,fontWeight:700}}>Progresso</span><span style={{color:"#FBBF24",fontWeight:800,fontSize:11}}>{earned}/{total} XP</span></div>
            <div style={{height:8,background:"rgba(255,255,255,0.08)",borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",width:`${total>0?(earned/total)*100:0}%`,background:G.yellow,borderRadius:99,boxShadow:"0 0 12px #FBBF2488",transition:"width .6s"}}/></div>
          </div>
        </div>
        <div style={{padding:"14px 18px",display:"flex",flexDirection:"column",gap:9}}>
          {DAILY_TASKS.map(task=>(
            <div key={task.id} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 13px",borderRadius:13,background:done(task.id)?"rgba(52,211,153,0.1)":"rgba(255,255,255,0.04)",border:`1.5px solid ${done(task.id)?"rgba(52,211,153,0.3)":"rgba(255,255,255,0.08)"}`}}>
              <span style={{fontSize:20,flexShrink:0}}>{task.icon}</span>
              <div style={{flex:1}}>
                <div style={{color:done(task.id)?"#34D399":"white",fontWeight:700,fontSize:13}}>{task.label}</div>
                <div style={{color:"rgba(255,255,255,0.4)",fontSize:11,fontWeight:700}}>+{task.xp} XP</div>
              </div>
              <div style={{width:26,height:26,borderRadius:"50%",flexShrink:0,background:done(task.id)?"#34D399":"rgba(255,255,255,0.08)",border:`2px solid ${done(task.id)?"#34D399":"rgba(255,255,255,0.15)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,boxShadow:done(task.id)?"0 0 12px #34D39966":"none"}}>
                {done(task.id)?"✓":""}
              </div>
            </div>
          ))}
        </div>
        <div style={{padding:"0 18px 20px"}}><Btn onClick={onClose} grad={G.yellow} style={{width:"100%"}}>📚 Completar tarefas!</Btn></div>
      </div>
    </div>
  );
}
function GuardianPortal({profile,onClose}){
  const gd=ls.get(SK_G)||{pin:"",reward:"",rewardTarget:200};
  const [step,setStep]=useState(gd.pin?"login":"setup");
  const [pinIn,setPinIn]=useState("");
  const [newPin,setNewPin]=useState("");
  const [reward,setReward]=useState(gd.reward||"");
  const [target,setTarget]=useState(gd.rewardTarget||200);
  const [saved,setSaved]=useState(false);
  const [err,setErr]=useState("");
  const pw=getPowerInfo(profile.xp||0);
  const power=getPower(profile.xp||0);
  const level=getLevel(profile.xp||0);
  const xp=profile.xp||0;
  const pct=Math.min(100,Math.round((xp/Math.max(target,1))*100));
  const reached=xp>=target;
  const ov={position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:24};
  const bx={maxWidth:520,width:"100%",padding:"34px 30px",borderRadius:24,background:"linear-gradient(160deg,#0f0928,#071a3e,#051a10)",border:"2px solid rgba(255,255,255,0.12)",boxShadow:"0 32px 80px rgba(0,0,0,0.7)",overflowY:"auto",maxHeight:"88vh"};
  if(step==="login"||step==="setup"){
    const isSu=step==="setup";
    const curIn=isSu?newPin:pinIn;
    const setIn=isSu?setNewPin:setPinIn;
    const doAct=()=>{if(isSu){if(curIn.length<4){setErr("PIN deve ter 4+ dígitos");return;}ls.set(SK_G,{...gd,pin:curIn,reward,rewardTarget:target});setStep("dashboard");setErr("");}else{if(curIn===gd.pin){setStep("dashboard");setErr("");}else setErr("PIN incorreto.");}};
    return(
      <div style={ov} onClick={onClose}>
        <div style={bx} onClick={e=>e.stopPropagation()}>
          <div style={{textAlign:"center",marginBottom:24}}><div style={{fontSize:42,marginBottom:8}}>🔐</div><h2 style={{color:"white",fontWeight:900,fontSize:20,margin:0}}>Portal do Responsável</h2><p style={{color:"rgba(255,255,255,0.4)",fontSize:13,marginTop:6,fontWeight:600}}>{isSu?"Crie um PIN de 4+ dígitos":"Digite seu PIN"}</p></div>
          <div style={{display:"flex",justifyContent:"center",gap:10,marginBottom:18}}>{[0,1,2,3].map(i=><div key={i} style={{width:13,height:13,borderRadius:"50%",background:curIn.length>i?"#a855f7":"rgba(255,255,255,0.15)",transition:"background .2s"}}/>)}</div>
          <input type="password" value={curIn} onChange={e=>setIn(e.target.value.replace(/\D/g,""))} placeholder="PIN numérico..." maxLength={8} onKeyDown={e=>e.key==="Enter"&&doAct()}
            style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"2px solid rgba(255,255,255,0.12)",borderRadius:13,padding:"12px 16px",color:"white",fontSize:20,outline:"none",letterSpacing:8,textAlign:"center",fontWeight:900,marginBottom:10}}/>
          {err&&<p style={{color:"#FCA5A5",fontSize:13,fontWeight:700,marginBottom:10,textAlign:"center"}}>{err}</p>}
          <div style={{display:"flex",gap:10}}><Btn onClick={onClose} grad="linear-gradient(135deg,#475569,#334155)" style={{flex:1}}>✕ Fechar</Btn><Btn onClick={doAct} grad={G.pink} style={{flex:1}} disabled={curIn.length<4}>{isSu?"Criar PIN 🔑":"Entrar 🚀"}</Btn></div>
        </div>
      </div>
    );
  }
  return(
    <div style={ov} onClick={onClose}>
      <div style={bx} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><div><h2 style={{color:"white",fontWeight:900,fontSize:18,margin:0}}>🔐 Portal do Responsável</h2><p style={{color:"rgba(255,255,255,0.4)",fontSize:12,margin:"4px 0 0",fontWeight:700}}>Progresso de {profile.name}</p></div><button onClick={onClose} style={{background:"rgba(255,255,255,0.08)",border:"none",color:"rgba(255,255,255,0.6)",width:34,height:34,borderRadius:"50%",cursor:"pointer",fontSize:16}}>✕</button></div>
        <div style={{display:"flex",gap:14,marginBottom:18,padding:"16px 18px",borderRadius:16,background:"rgba(255,255,255,0.05)",border:"1.5px solid rgba(255,255,255,0.08)"}}>
          <AvatarSVG av={profile} xp={xp} age={profile.age||12} size={70}/>
          <div style={{flex:1}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><span style={{color:"white",fontWeight:900,fontSize:15}}>{profile.name}</span><span style={{padding:"2px 10px",borderRadius:999,background:pw.g,color:"white",fontSize:10,fontWeight:900}}>⭐ Nível {level}</span></div>
            <div style={{color:"rgba(255,255,255,0.5)",fontSize:12,fontWeight:600,marginBottom:6}}>Estado: <span style={{fontWeight:800,background:pw.g,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{pw.label}</span></div>
            <div style={{height:8,background:"rgba(255,255,255,0.08)",borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",width:`${power}%`,background:pw.g,borderRadius:99,boxShadow:`0 0 10px ${pw.c}88`}}/></div>
            <div style={{color:"rgba(255,255,255,0.35)",fontSize:10,marginTop:3,fontWeight:700}}>{xp} XP • {power}% poder</div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>{[["📚 Série",GRADES.find(g=>g.id===profile.grade)?.full||"—"],["⚡ XP",`${xp} pts`],["🏆 Nível",`${level}`],["💪 Poder",`${power}%`]].map(([l,v])=>(
          <div key={l} style={{background:"rgba(255,255,255,0.06)",borderRadius:12,padding:"11px 13px"}}><div style={{color:"rgba(255,255,255,0.4)",fontSize:10,fontWeight:700,marginBottom:4}}>{l}</div><div style={{color:"white",fontWeight:800,fontSize:15}}>{v}</div></div>
        ))}</div>
        <div style={{padding:"16px 18px",borderRadius:16,background:"rgba(251,191,36,0.08)",border:"1.5px solid rgba(251,191,36,0.2)",marginBottom:14}}>
          <div style={{fontWeight:800,fontSize:13,color:"#FBBF24",marginBottom:12}}>🎁 Recompensas</div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{color:"rgba(255,255,255,0.6)",fontSize:12,fontWeight:700}}>Progresso</span><span style={{color:"#FBBF24",fontWeight:800,fontSize:12}}>{xp}/{target} XP ({pct}%)</span></div>
          <div style={{height:12,background:"rgba(255,255,255,0.08)",borderRadius:99,overflow:"hidden",marginBottom:10}}><div style={{height:"100%",width:`${pct}%`,background:G.yellow,borderRadius:99,boxShadow:"0 0 14px #FBBF2488",transition:"width .6s"}}/></div>
          {reached&&<div style={{marginBottom:10,padding:"9px 13px",background:"rgba(251,191,36,0.15)",border:"1.5px solid rgba(251,191,36,0.4)",borderRadius:11,textAlign:"center"}}><span style={{fontWeight:900,color:"#FBBF24",fontSize:13}}>🎉 META ATINGIDA! {profile.name} merece a recompensa!</span></div>}
          <label style={{color:"rgba(255,255,255,0.6)",fontSize:11,fontWeight:800,display:"block",marginBottom:5,letterSpacing:1,textTransform:"uppercase"}}>Recompensa prometida</label>
          <input value={reward} onChange={e=>setReward(e.target.value)} placeholder="Ex: Pizza, passeio, filme..." style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"2px solid rgba(251,191,36,0.2)",borderRadius:11,padding:"9px 13px",color:"white",fontSize:13,outline:"none",fontWeight:700,marginBottom:10}}/>
          <label style={{color:"rgba(255,255,255,0.6)",fontSize:11,fontWeight:800,display:"block",marginBottom:5,letterSpacing:1,textTransform:"uppercase"}}>Meta de XP</label>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <input type="number" value={target} onChange={e=>setTarget(e.target.value)} min={50} max={9999} style={{width:100,background:"rgba(255,255,255,0.07)",border:"2px solid rgba(251,191,36,0.2)",borderRadius:11,padding:"8px 12px",color:"white",fontSize:14,outline:"none",fontWeight:800}}/>
            <span style={{color:"rgba(255,255,255,0.4)",fontSize:13,fontWeight:700}}>XP</span>
            <Btn onClick={()=>{ls.set(SK_G,{...gd,reward,rewardTarget:parseInt(target)||200});setSaved(true);setTimeout(()=>setSaved(false),2500);}} grad={G.yellow} sm style={{marginLeft:"auto"}}>{saved?"✅ Salvo!":"💾 Salvar"}</Btn>
          </div>
        </div>
        <div style={{display:"flex",justifyContent:"flex-end"}}>
          <button onClick={()=>{ls.set(SK_G,{...ls.get(SK_G)||{},pin:""});onClose();}} style={{background:"none",border:"none",color:"rgba(255,255,255,0.25)",fontSize:11,cursor:"pointer",fontFamily:"'Nunito',sans-serif",fontWeight:700,padding:"6px 10px"}}>🔑 Redefinir PIN</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   IMAGE ANALYSIS PANEL  (used inside free chat)
══════════════════════════════════════════════════════ */
function ImageAnalysisPanel({pInfo,grade,onClose}){
  const [img,setImg]=useState(null);       // {base64, mime, url}
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState(null); // parsed JSON
  const [err,setErr]=useState("");
  const [tab,setTab]=useState("summary"); // summary | exercises
  const [revEx,setRevEx]=useState({});
  const [customInstruction,setCustomInstruction]=useState("");
  const fileRef=useRef(null);

  const onFile=async(e)=>{
    const file=e.target.files?.[0];
    if(!file)return;
    if(!file.type.startsWith("image/")){setErr("Por favor selecione uma imagem (JPG, PNG, etc)");return;}
    if(file.size>4*1024*1024){setErr("Imagem muito grande. Máximo 4 MB.");return;}
    setErr("");setResult(null);
    const reader=new FileReader();
    reader.onload=ev=>{
      const dataUrl=ev.target.result;
      const base64=dataUrl.split(",")[1];
      setImg({base64,mime:file.type,url:dataUrl,name:file.name});
    };
    reader.readAsDataURL(file);
  };

  const analyze=async()=>{
    if(!img)return;
    setLoading(true);setErr("");setResult(null);setRevEx({});
    try{
     const data = await analyzeImageJSON(
  img.base64,
  img.mime,
  grade,
  customInstruction
);

console.log("RESULTADO OCR COMPLETO:");
console.log(JSON.stringify(data,null,2));

setResult(data);setTab("summary");
    }catch(e){

  console.error(e);

  setErr("❌ "+e.message);

}finally{

  setLoading(false);

}
  };

  const scoreC=(c)=>c==="#34d399"?c:pInfo.c;

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
      {/* Header */}
      <div style={{padding:"12px 18px",borderBottom:"1px solid rgba(255,255,255,0.08)",
        background:`linear-gradient(90deg,${pInfo.c}22,rgba(6,182,212,0.1))`,
        display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
        <span style={{fontSize:20}}>🖼️</span>
        <div style={{flex:1}}>
          <div style={{color:"white",fontWeight:900,fontSize:14}}>Analisar Matéria por Imagem</div>
          <div style={{color:"rgba(255,255,255,0.45)",fontSize:11,fontWeight:700}}>Foto do caderno, livro ou prova → resumo + exercícios</div>
        </div>
        <button onClick={onClose} style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:8,padding:"5px 10px",color:"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"'Nunito',sans-serif"}}>✕ Fechar</button>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"18px 20px",display:"flex",flexDirection:"column",gap:14}}>

        {/* Upload area */}
        {!img?(
          <div onClick={()=>fileRef.current?.click()}
            style={{border:`2px dashed ${pInfo.c}66`,borderRadius:20,padding:"40px 30px",
              textAlign:"center",cursor:"pointer",background:`${pInfo.c}08`,transition:"all .2s"}}
            onMouseEnter={e=>{e.currentTarget.style.background=`${pInfo.c}15`;e.currentTarget.style.borderColor=pInfo.c;}}
            onMouseLeave={e=>{e.currentTarget.style.background=`${pInfo.c}08`;e.currentTarget.style.borderColor=`${pInfo.c}66`;}}>
            <div style={{fontSize:52,marginBottom:12,animation:"float 2.5s ease-in-out infinite"}}>📸</div>
            <div style={{color:"white",fontWeight:900,fontSize:17,marginBottom:6}}>Clique para anexar imagem</div>
            <div style={{color:"rgba(255,255,255,0.45)",fontSize:13,fontWeight:600,lineHeight:1.6}}>
              Foto do caderno, livro didático, slide da aula ou prova<br/>
              <span style={{fontSize:11,opacity:0.7}}>JPG · PNG · WEBP · até 4 MB</span>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{display:"none"}}/>
          </div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {/* Image preview */}
            <div className="glass" style={{padding:"14px",position:"relative"}}>
              <img src={img.url} alt="matéria" style={{width:"100%",maxHeight:280,objectFit:"contain",borderRadius:12,display:"block"}}/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}>
                <span style={{color:"rgba(255,255,255,0.5)",fontSize:12,fontWeight:700}}>📄 {img?.name}</span>
                <button onClick={()=>{setImg(null);setResult(null);setErr("");}}
                  style={{background:"rgba(239,68,68,0.15)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:8,padding:"4px 10px",color:"#FCA5A5",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"'Nunito',sans-serif"}}>
                  🗑 Remover
                </button>
              </div>
            </div>
            {/* Analyze button */}
            <textarea
              placeholder='Ex: "faça um resumo fácil", "crie questões difíceis", "explique como professor"...'
              value={customInstruction}
              onChange={(e)=>setCustomInstruction(e.target.value)}
              rows={3}
              style={{
                width:"100%",
                padding:"14px",
                borderRadius:"16px",
                border:"1px solid rgba(255,255,255,0.1)",
                background:"rgba(255,255,255,0.05)",
                color:"white",
                fontSize:"14px",
                resize:"none",
                outline:"none",
                marginBottom:"14px",
                fontFamily:"Nunito"
              }}
            />
            {!result&&!loading&&(
              
              <Btn onClick={analyze} grad={G.rainbow} style={{backgroundSize:"300%",animation:"rainbow 4s linear infinite",fontSize:15,padding:"14px",boxShadow:"0 8px 28px rgba(168,85,247,0.4)"}}>
                🔍 Analisar Matéria com IA
              </Btn>
            )}
            {loading&&(
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,padding:"24px"}}>
                <div style={{width:44,height:44,borderRadius:"50%",background:G.rainbow,animation:"spin .9s linear infinite",opacity:.85}}/>
                <div style={{color:"rgba(255,255,255,0.6)",fontWeight:800,fontSize:14}}>Analisando imagem...</div>
                <div style={{color:"rgba(255,255,255,0.35)",fontSize:12,fontWeight:600,textAlign:"center"}}>
                  Identificando tópico · Gerando resumo · Criando exercícios
                </div>
              </div>
            )}
            {err&&<div style={{padding:"12px 16px",background:"rgba(239,68,68,0.12)",border:"1.5px solid rgba(239,68,68,0.3)",borderRadius:14,color:"#FCA5A5",fontSize:13,fontWeight:700,lineHeight:1.5}}>{err}<br/><button onClick={analyze} style={{marginTop:8,background:"rgba(239,68,68,0.2)",border:"none",borderRadius:8,padding:"5px 12px",color:"#FCA5A5",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"'Nunito',sans-serif"}}>🔄 Tentar Novamente</button></div>}
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{display:"none"}}/>

        {/* Results */}
        {result&&(
          <div style={{display:"flex",flexDirection:"column",gap:14,animation:"fadeUp .35s ease"}}>
            {/* Topic badge */}
            <div style={{padding:"12px 18px",borderRadius:14,background:`linear-gradient(135deg,${pInfo.c}22,${pInfo.c}08)`,border:`1.5px solid ${pInfo.c}44`,display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:22}}>📚</span>
              <div>
                <div style={{color:"rgba(255,255,255,0.45)",fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:1}}>Tópico identificado</div>
                <div style={{color:"white",fontWeight:900,fontSize:16}}>{result?.topic || "Tópico não identificado"}</div>
              </div>
            </div>

            {/* Tabs */}
            <div style={{display:"flex",gap:4,background:"rgba(0,0,0,0.3)",borderRadius:12,padding:4}}>
              {[{id:"summary",icon:"📋",label:"Resumo"},{id:"exercises",icon:"✏️",label:"Exercícios"}].map(t=>(
                <button key={t.id} onClick={()=>setTab(t.id)}
                  style={{flex:1,padding:"9px 12px",borderRadius:9,border:"none",cursor:"pointer",fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:13,
                    background:tab===t.id?pInfo.g:"transparent",color:"white",opacity:tab===t.id?1:0.45,transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                  <span>{t.icon}</span><span>{t.label}</span>
                </button>
              ))}
            </div>

            {/* SUMMARY TAB */}
            {tab==="summary"&&(
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {/* PT Summary */}
                <div className="glass" style={{padding:"18px 20px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                    <span style={{fontSize:20}}>🇧🇷</span>
                    <span style={{color:"rgba(255,255,255,0.5)",fontSize:11,fontWeight:800,textTransform:"uppercase",letterSpacing:1}}>Resumo em Português</span>
                  </div>
                  <div style={{color:"rgba(255,255,255,0.85)",fontSize:14,lineHeight:1.8,fontWeight:600}}>
                    {(result?.summaryPT || "Resumo não encontrado").split("\n").map((p,i)=>p.trim()&&<p key={i} style={{margin:"0 0 8px"}}>{p}</p>)}
                  </div>
                </div>
                {/* EN Summary */}
                <div className="glass" style={{padding:"18px 20px",background:"rgba(6,182,212,0.06)",border:"1.5px solid rgba(6,182,212,0.15)"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                    <span style={{fontSize:20}}>🇬🇧</span>
                    <span style={{color:"rgba(103,232,249,0.7)",fontSize:11,fontWeight:800,textTransform:"uppercase",letterSpacing:1}}>Summary in English</span>
                  </div>
                  <div style={{color:"rgba(255,255,255,0.85)",fontSize:14,lineHeight:1.8,fontWeight:600}}>
                    {(result?.summaryEN || "Summary not found").split("\n").map((p,i)=>p.trim()&&<p key={i} style={{margin:"0 0 8px"}}>{p}</p>)}
                  </div>
                </div>
                <Btn onClick={()=>setTab("exercises")} grad={pInfo.g} style={{alignSelf:"flex-end"}}>Ver Exercícios ✏️</Btn>
              </div>
            )}

            {/* EXERCISES TAB */}
            {tab==="exercises"&&(
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{color:"rgba(255,255,255,0.5)",fontSize:12,fontWeight:700}}>{(result.exercises||[]).length} exercícios baseados na imagem</span>
                  <button onClick={()=>setRevEx(Object.fromEntries((result?.exercises || []).map((_,i)=>[i,true])))}
                    style={{background:G.green,border:"none",borderRadius:8,padding:"5px 12px",color:"white",cursor:"pointer",fontSize:11,fontWeight:800,fontFamily:"'Nunito',sans-serif"}}>
                    ✅ Ver todos
                  </button>
                </div>
                {console.log("EXERCISES:", result.exercises)}
                {(result.exercises||[]).map((ex,i)=>(
                  <div key={i} className="glass" style={{padding:"16px 18px",borderLeft:`3px solid ${pInfo.c}`}}>
                    {/* Question number */}
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                      <div style={{width:26,height:26,borderRadius:"50%",background:pInfo.g,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:12,color:"white",flexShrink:0}}>{i+1}</div>
                      <span style={{color:"rgba(255,255,255,0.4)",fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:1}}>Exercício {i+1}</span>
                    </div>
                    {/* Questions side by side */}
                    <div
  style={{
    background:"rgba(255,255,255,0.05)",
    border:"1px solid rgba(255,255,255,0.08)",
    borderRadius:"16px",
    padding:"18px",
    marginBottom:"16px"
  }}
>
  <div
    style={{
      color:"#a78bfa",
      fontWeight:900,
      marginBottom:"12px",
      fontSize:"16px"
    }}
  >
    Exercício {i+1}
  </div>

  <p
    style={{
      color:"white",
      fontWeight:800,
      marginBottom:"10px",
      lineHeight:1.7
    }}
  >
    🇧🇷 {ex.questionPT}
  </p>

  <p
    style={{
      color:"rgba(255,255,255,0.7)",
      marginBottom:"14px",
      lineHeight:1.7
    }}
  >
    🇬🇧 {ex.questionEN}
  </p>

  <button
    onClick={()=>
      setRevEx(p=>({
        ...p,
        [i]:!p[i]
      }))
    }

    style={{
      padding:"10px 16px",
      borderRadius:"12px",
      border:"none",
      cursor:"pointer",
      background:pInfo.g,
      color:"white",
      fontWeight:800
    }}
  >
    {revEx[i]
      ? "🙈 Ocultar resposta"
      : "👁 Ver resposta"}
  </button>

  {revEx[i] && (
    <div
      style={{
        marginTop:"14px",
        background:"rgba(52,211,153,0.08)",
        border:"1px solid rgba(52,211,153,0.25)",
        borderRadius:"14px",
        padding:"16px"
      }}
    >
      <p
        style={{
          color:"#34d399",
          fontWeight:900,
          marginBottom:"10px"
        }}
      >
        🇧🇷 {ex.answerPT}
      </p>

      <p
        style={{
          color:"#86efac",
          marginBottom:"14px"
        }}
      >
        🇬🇧 {ex.answerEN}
      </p>

      <p
        style={{
          color:"rgba(255,255,255,0.7)",
          lineHeight:1.7
        }}
      >
        💡 {ex.explanationPT}
      </p>
    </div>
  )}
</div>
                    {/* Reveal button */}
                    {!revEx[i]?(
                      <button onClick={()=>setRevEx(p=>({...p,[i]:true}))}
                        style={{width:"100%",padding:"9px",background:pInfo.g,border:"none",borderRadius:11,color:"white",fontWeight:800,fontSize:13,cursor:"pointer",fontFamily:"'Nunito',sans-serif",boxShadow:`0 4px 14px ${pInfo.c}44`}}>
                        👁 Ver Resposta e Explicação
                      </button>
                    ):(
                      <div style={{display:"flex",flexDirection:"column",gap:9,animation:"fadeUp .2s ease"}}>
                        {/* Answers */}
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                          <div style={{padding:"10px 13px",background:"rgba(52,211,153,0.08)",borderRadius:11,border:"1.5px solid rgba(52,211,153,0.25)"}}>
                            <div style={{fontSize:10,fontWeight:800,color:"#34D399",textTransform:"uppercase",marginBottom:5}}>🇧🇷 ✅ Resposta</div>
                            <p style={{color:"white",fontSize:13,fontWeight:700,margin:0,lineHeight:1.5}}>{ex.answer_pt}</p>
                          </div>
                          <div style={{padding:"10px 13px",background:"rgba(52,211,153,0.08)",borderRadius:11,border:"1.5px solid rgba(52,211,153,0.25)"}}>
                            <div style={{fontSize:10,fontWeight:800,color:"#34D399",textTransform:"uppercase",marginBottom:5}}>🇬🇧 ✅ Answer</div>
                            <p style={{color:"white",fontSize:13,fontWeight:700,margin:0,lineHeight:1.5}}>{ex.answer_en}</p>
                          </div>
                        </div>
                        {/* Explanations */}
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                          <div style={{padding:"10px 13px",background:"rgba(168,85,247,0.08)",borderRadius:11,border:"1px solid rgba(168,85,247,0.2)"}}>
                            <div style={{fontSize:10,fontWeight:800,color:"rgba(196,167,255,0.7)",textTransform:"uppercase",marginBottom:5}}>🇧🇷 💡 Explicação</div>
                            <p style={{color:"rgba(255,255,255,0.75)",fontSize:12,fontWeight:600,margin:0,lineHeight:1.6}}>{ex.explanation_pt}</p>
                          </div>
                          <div style={{padding:"10px 13px",background:"rgba(168,85,247,0.08)",borderRadius:11,border:"1px solid rgba(168,85,247,0.2)"}}>
                            <div style={{fontSize:10,fontWeight:800,color:"rgba(196,167,255,0.7)",textTransform:"uppercase",marginBottom:5}}>🇬🇧 💡 Explanation</div>
                            <p style={{color:"rgba(255,255,255,0.75)",fontSize:12,fontWeight:600,margin:0,lineHeight:1.6}}>{ex.explanation_en}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* New analysis button */}
            <div style={{display:"flex",gap:10,paddingTop:4}}>
              <Btn onClick={()=>{setImg(null);setResult(null);setErr("");}} grad="linear-gradient(135deg,#475569,#334155)" sm>📸 Nova Imagem</Btn>
              <Btn onClick={analyze} grad={pInfo.g} sm>🔄 Reanalisar</Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   CHAT MODE
══════════════════════════════════════════════════════ */
function ChatMode({topic,grade,pInfo,lang,isFree}){
  const gObj=GRADES.find(x=>x.id===grade);
  const intro=isFree?"Olá! 🌟 Qualquer dúvida de qualquer matéria — gramática, vocabulário, exercícios... Estou aqui! 😊\n\nDica: clique em **📸 Analisar Imagem** para enviar uma foto da matéria e receber resumo + exercícios!":`Olá! 👋 Vamos aprender **${topic?.label}**? Me faça qualquer pergunta! 🎉`;
  const [msgs,setMsgs]=useState([{role:"assistant",content:intro}]);
  const [input,setInput]=useState("");
  const [img,setImg]=useState(null);
  const [loading,setLoading]=useState(false);
  const [translating,setTranslating]=useState(false);
  const [err,setErr]=useState("");
  const [showImgPanel,setShowImgPanel]=useState(false);
  const endRef=useRef(null);
  const inputRef=useRef(null);
  const prevLang=useRef(lang);
  const recognitionRef = useRef(null);

  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[msgs]);
  useEffect(()=>{
    if(prevLang.current===lang)return;
    prevLang.current=lang;
    const lastAi=[...msgs].reverse().findIndex(m=>m.role==="assistant");
    if(lastAi<0)return;
    const idx=msgs.length-1-lastAi;
    setTranslating(true);
    callAI([{role:"user",content:`Retranslate/rewrite the following according to: ${lang==="en"?"Respond ENTIRELY IN ENGLISH":lang==="pt"?"Respond ENTIRELY IN Brazilian Portuguese":"Use Portuguese with English examples"}.\nText:\n${msgs[idx].content}`}],grade,lang)
      .then(t=>setMsgs(p=>p.map((m,i)=>i===idx?{...m,content:t}:m))).catch(()=>{}).finally(()=>setTranslating(false));
  },[lang]);

  const startVoice=()=>{

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if(!SpeechRecognition){
    alert("Seu navegador não suporta microfone");
    return;
  }

  const recog = new SpeechRecognition();

  recognitionRef.current = recog;

  recog.lang = "pt-BR";

  recog.onresult = (e)=>{

    const txt =
      e.results[0][0].transcript;

    setInput(p=>p+" "+txt);
  };

  recog.start();
};

  const send=async()=>{
    console.log("=== SEND INICIO ===");
    console.log("msgs:", msgs);
    console.log("input:", input);
    console.log("showImgPanel:", showImgPanel);
    if(loading) return;
    const hist=[...msgs,{role:"user",content:input}];
    setMsgs(hist);setInput("");setLoading(true);setErr("");
    try{
      const api=hist.filter((m,i)=>!(i===0&&m.role==="assistant")).map(m=>({role:m.role,content:m.content}));
      if(!isFree&&topic&&api[0]?.role==="user") api[0]={...api[0],content:`[Tópico: "${topic.label}" – ${gObj?.full}]\n${api[0].content}`};
      console.log("API:", api);
      const rep=await callAI(api,grade,lang);
      setMsgs(p=>[...p,{role:"assistant",content:rep}]);
    }catch(e){setErr("❌ "+e.message);}
    setLoading(false);setTimeout(()=>inputRef.current?.focus(),100);
  };

  const langNames={pt:"🇧🇷 Português",mix:"🌐 Misto",en:"🇬🇧 English"};

  /* If image panel is open, show it full-screen in place of chat */
  if(isFree&&showImgPanel){
    return <ImageAnalysisPanel pInfo={pInfo} grade={grade} onClose={()=>setShowImgPanel(false)}/>;
  }

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      {/* Header bar */}
      <div style={{padding:"7px 18px",background:`linear-gradient(90deg,${pInfo.c}22,transparent)`,borderBottom:"1px solid rgba(255,255,255,0.07)",display:"flex",alignItems:"center",gap:10,flexShrink:0,flexWrap:"wrap"}}>
        <span style={{fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.45)",flex:1}}>{isFree?"💬 Pergunta Livre":"🤖 Tutor MentalGame"}</span>
        {/* Image analysis button — only in free mode */}
        {isFree&&(
          <button onClick={()=>setShowImgPanel(true)}
            style={{display:"flex",alignItems:"center",gap:6,padding:"5px 13px",borderRadius:999,cursor:"pointer",fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:12,
              background:"linear-gradient(135deg,rgba(168,85,247,0.25),rgba(6,182,212,0.2))",border:"1.5px solid rgba(168,85,247,0.4)",color:"white",transition:"all .2s",boxShadow:"0 2px 10px rgba(168,85,247,0.3)"}}
            onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 16px rgba(168,85,247,0.5)"}
            onMouseLeave={e=>e.currentTarget.style.boxShadow="0 2px 10px rgba(168,85,247,0.3)"}>
            <span style={{fontSize:15}}>📸</span>
            <span>Analisar Imagem</span>
          </button>
        )}
        <span style={{fontSize:11,fontWeight:700,background:pInfo.g,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{langNames[lang]}</span>
        {translating&&<span style={{fontSize:11,color:"rgba(255,255,255,0.35)",fontWeight:700,animation:"pulse 1s infinite"}}>🔄 traduzindo...</span>}
      </div>

      {/* Messages */}
      <div style={{flex:1,overflowY:"auto",padding:"16px 18px",display:"flex",flexDirection:"column",gap:13}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",gap:10,alignItems:"flex-end",animation:"fadeUp .2s ease"}}>
            {m.role==="assistant"&&<div style={{width:32,height:32,borderRadius:"50%",background:pInfo.g,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0,boxShadow:`0 4px 14px ${pInfo.c}55`}}>🤖</div>}
            <div style={{maxWidth:"76%",padding:"11px 15px",borderRadius:m.role==="user"?"20px 20px 5px 20px":"20px 20px 20px 5px",background:m.role==="user"?pInfo.g:"rgba(255,255,255,0.07)",border:m.role==="assistant"?"1px solid rgba(255,255,255,0.1)":"none",color:"white",fontSize:14,lineHeight:1.7,fontWeight:600,boxShadow:m.role==="user"?`0 5px 18px ${pInfo.c}44`:"none"}}>
              <MD text={m.content}/>
            </div>
          </div>
        ))}
        {loading&&(
          <div style={{display:"flex",gap:10,alignItems:"flex-end"}}>
            <div style={{width:32,height:32,borderRadius:"50%",background:pInfo.g,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>🤖</div>
            <div style={{padding:"11px 17px",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"20px 20px 20px 5px",display:"flex",gap:5,alignItems:"center"}}>
              {[0,1,2].map(j=><div key={j} style={{width:7,height:7,borderRadius:"50%",background:pInfo.c,animation:"bop 1.2s infinite",animationDelay:`${j*.2}s`}}/>)}
            </div>
          </div>
        )}
        {err&&<div style={{padding:"10px 14px",background:"rgba(239,68,68,0.15)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:13,color:"#FCA5A5",fontSize:13,fontWeight:600}}>{err}</div>}
        <div ref={endRef}/>
      </div>

      {/* Input area */}
      <div style={{padding:"12px 16px",borderTop:"1px solid rgba(255,255,255,0.07)",display:"flex",gap:9,background:"rgba(0,0,0,0.25)"}}>
        <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()} placeholder={isFree?"Digite sua dúvida de qualquer matéria ou clique em 📸 Analisar Imagem...":"Digite sua dúvida..."}
          style={{flex:1,background:"rgba(255,255,255,0.07)",border:"2px solid rgba(255,255,255,0.1)",borderRadius:999,padding:"10px 16px",color:"white",fontSize:14,outline:"none",fontWeight:600,transition:"border .2s"}}
          onFocus={e=>e.target.style.borderColor=pInfo.c} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"}/>
        <button
  onClick={startVoice}
  style={{
    width:44,
    height:44,
    borderRadius:"50%",
    border:"none",
    cursor:"pointer",
    fontSize:18,
    background:"rgba(255,255,255,0.08)",
    color:"white"
  }}
>
🎤
</button>
      </div>
    </div>
  );
}
function QuizMode({topic,grade,pInfo,lang,onXP}){
  const gObj=GRADES.find(x=>x.id===grade);
  const [quiz,setQuiz]=useState(null);
  const [cur,setCur]=useState(0);
  const [sel,setSel]=useState(null);
  const [score,setScore]=useState(0);
  const [done,setDone]=useState(false);
  const [loading,setLoading]=useState(false);
  const [log,setLog]=useState([]);
  const [err,setErr]=useState("");
  const start=async()=>{
    setLoading(true);setQuiz(null);setCur(0);setSel(null);setScore(0);setDone(false);setLog([]);setErr("");
    try{
      const d=await callJSON(
        `Create a 5-question multiple choice quiz about "${topic?.label}" for ${gObj?.full} students.
Return ONLY this JSON structure (no extra text):
{"questions":[{"question":"...","options":["A) ...","B) ...","C) ...","D) ..."],"correct":0,"explanation":"brief explanation in Portuguese"}]}
Rules: "correct" is the index (0-3) of the right answer. Make options clearly different. Explanations in Portuguese.`,
        grade
      );
      setQuiz(d);
    }catch(e){setErr("❌ "+e.message);}
    setLoading(false);
  };
  const pick=(idx)=>{
    if(sel!==null)return;setSel(idx);const ok=quiz.questions[cur].correct===idx;
    if(ok){setScore(s=>s+1);}onXP(ok?10:-3);setLog(p=>[...p,{correct:quiz.questions[cur].correct,sel:idx,ok}]);
  };
  const next=()=>{if(cur+1>=quiz.questions.length)setDone(true);else{setCur(c=>c+1);setSel(null);}};
  if(!quiz&&!loading&&!err)return<EmptyStart icon="🎯" title={`Quiz: ${topic?.label}`} desc="5 perguntas. Acerto=+10 XP ✅  Erro=−3 XP ❌" btnLabel="🎯 Iniciar Quiz!" onClick={start} pInfo={pInfo}/>;
  if(err)return<ErrBox msg={err} onRetry={start}/>;
  if(loading)return<Spinner label="Gerando quiz..."/>;
  if(done){
    const grd=score>=4?G.green:score>=3?G.yellow:G.red;
    return(
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:18,padding:36,overflowY:"auto",animation:"fadeUp .3s ease"}}>
        <div style={{fontSize:64}}>{score===5?"🏆":score>=4?"🎉":score>=3?"👍":"📚"}</div>
        <h3 style={{color:"white",margin:0,fontSize:24,fontWeight:900}}>Resultado!</h3>
        <div style={{fontSize:50,fontWeight:900,background:grd,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{score}/{quiz.questions.length}</div>
        <div style={{width:"100%",maxWidth:420,display:"flex",flexDirection:"column",gap:7}}>
          {quiz.questions.map((q,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 13px",background:log[i]?.ok?"rgba(52,211,153,0.1)":"rgba(244,114,182,0.1)",border:`1.5px solid ${log[i]?.ok?"rgba(52,211,153,0.3)":"rgba(244,114,182,0.3)"}`,borderRadius:13}}>
              <span>{log[i]?.ok?"✅":"❌"}</span><span style={{color:"rgba(255,255,255,0.75)",fontSize:13,flex:1,fontWeight:600,lineHeight:1.4}}>{q.question}</span>
            </div>
          ))}
        </div>
        <Btn onClick={start} grad={pInfo.g}>Tentar Novamente 🔄</Btn>
      </div>
    );
  }
  const q=quiz?.questions?.[cur];if(!q)return null;
  return(
    <div style={{padding:"22px 26px",display:"flex",flexDirection:"column",gap:16,height:"100%",overflowY:"auto",animation:"fadeUp .2s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontWeight:800,fontSize:13,background:pInfo.g,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Pergunta {cur+1}/{quiz.questions.length}</span>
        <div style={{display:"flex",gap:6}}>{quiz.questions.map((_,i)=><div key={i} style={{width:9,height:9,borderRadius:"50%",background:i<cur?(log[i]?.ok?"#34D399":"#F472B6"):i===cur?pInfo.c:"rgba(255,255,255,0.15)",transform:i===cur?"scale(1.3)":"scale(1)",boxShadow:i===cur?`0 0 8px ${pInfo.c}`:"none"}}/>)}</div>
      </div>
      <div style={{height:5,background:"rgba(255,255,255,0.07)",borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",width:`${(cur/quiz.questions.length)*100}%`,background:pInfo.g,borderRadius:99,transition:"width .5s"}}/></div>
      <div className="glass" style={{padding:"18px 22px"}}><p style={{color:"white",fontSize:17,fontWeight:700,margin:0,lineHeight:1.5}}>{q.question}</p></div>
      <div style={{display:"flex",flexDirection:"column",gap:9}}>
        {q.options.map((opt,i)=>{
          let bg="rgba(255,255,255,0.05)",bdr="1.5px solid rgba(255,255,255,0.09)";
          if(sel!==null){if(i===q.correct){bg="rgba(52,211,153,0.18)";bdr="1.5px solid #34D399";}else if(i===sel&&i!==q.correct){bg="rgba(244,114,182,0.18)";bdr="1.5px solid #F472B6";}}
          return(<button key={i} onClick={()=>pick(i)} style={{padding:"12px 17px",background:bg,border:bdr,borderRadius:13,color:"white",fontSize:14,textAlign:"left",cursor:sel!==null?"default":"pointer",fontFamily:"'Nunito',sans-serif",fontWeight:700,transition:"all .2s"}}><span style={{marginRight:8,opacity:0.5,fontSize:12}}>{"ABCD"[i]}</span>{opt}</button>);
        })}
      </div>
      {sel!==null&&<div className="glass" style={{padding:"13px 17px",background:"rgba(168,85,247,0.12)"}}><p style={{fontWeight:800,margin:"0 0 5px",fontSize:12,background:G.pink,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>💡 Explicação</p><p style={{color:"rgba(255,255,255,0.75)",margin:0,fontSize:13,lineHeight:1.65,fontWeight:600}}><MD text={q.explanation}/></p></div>}
      {sel!==null&&<Btn onClick={next} grad={pInfo.g} style={{alignSelf:"flex-end"}}>{cur+1>=quiz.questions.length?"Ver Resultado 🏆":"Próxima ➜"}</Btn>}
    </div>
  );
}
function SummaryMode({topic,grade,pInfo,lang,onXP}){

  const gObj = GRADES.find(x=>x.id===grade);
  const [customTopic,setCustomTopic] = useState("");
  const [text,setText] = useState("");
  const [loading,setLoading] = useState(false);
  const [err,setErr] = useState("");
  const currentTopic = customTopic || topic?.label;
  const printRef = useRef(null);
  const gen = async()=>{
  setLoading(true);
  setText("");
  setErr("");

  try{

    const rep = await callAI(
      [
        {
          role:"user",
          content:`Crie um resumo MUITO didático sobre "${
            currentTopic
          }" para alunos do ${
            gObj?.full
          }.
Explique regras, exemplos, dicas e erros comuns.`
        }
      ],
      grade,
      lang
    );

    setText(rep.reply || rep);

  }catch(e){

    setErr("❌ " + e.message);

  }

  setLoading(false);
};
  const renderFull=txt=>txt.split("\n").map((line,i)=>{
    if(/^# /.test(line))return<h2 key={i} style={{fontSize:19,fontWeight:900,margin:"16px 0 5px",background:pInfo.g,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{line.slice(2)}</h2>;
    if(/^#{2,3} /.test(line))return<h3 key={i} style={{fontSize:15,fontWeight:800,margin:"13px 0 4px",color:"#67E8F9"}}>{line.replace(/^#{2,3} /,"")}</h3>;
    if(/^- /.test(line))return<li key={i} style={{color:"rgba(255,255,255,0.8)",lineHeight:1.75,marginLeft:18,marginBottom:3,fontWeight:600}}><MD text={line.slice(2)}/></li>;
    if(!line.trim())return<div key={i} style={{height:5}}/>;
    return<p key={i} style={{color:"rgba(255,255,255,0.75)",lineHeight:1.75,margin:"3px 0",fontWeight:600}}><MD text={line}/></p>;
  });
 
 if(!text&&!loading&&!err)
return(
  <div style={{padding:20}}>

    <div style={{marginBottom:16}}>

      <input
        value={customTopic}
        onChange={e=>setCustomTopic(e.target.value)}
        placeholder={`Tema padrão: ${topic?.label} | ou escreva outro tema`}
        style={{
          width:"100%",
          padding:"12px 16px",
          borderRadius:14,
          border:"2px solid rgba(255,255,255,0.1)",
          background:"rgba(255,255,255,0.06)",
          color:"white",
          outline:"none",
          fontSize:14,
          fontWeight:600
        }}
      />

    </div>

    <EmptyStart
      icon="📝"
      title={`Resumo: ${currentTopic}`}
      desc="Resumo completo com regras, exemplos e dicas."
      btnLabel="📝 Gerar Resumo"
      onClick={gen}
      pInfo={pInfo}
    />

  </div>
);
  if(err)return<ErrBox msg={err} onRetry={gen}/>;
  if(loading)return<Spinner label="Criando resumo..."/>;
  return(
  <div style={{
    padding:"20px 24px",
    overflowY:"auto",
    height:"100%",
    animation:"fadeUp .25s ease"
  }}>
<div style={{
  marginBottom:16,
  display:"flex",
  gap:10,
  alignItems:"center"
}}>

  <input
    value={customTopic}
    onChange={e=>setCustomTopic(e.target.value)}
    placeholder="Digite qualquer tema..."
    style={{
      flex:1,
      padding:"12px 16px",
      borderRadius:14,
      border:"2px solid rgba(255,255,255,0.1)",
      background:"rgba(255,255,255,0.06)",
      color:"white",
      outline:"none",
      fontSize:14,
      fontWeight:600
    }}
  />

  <button
    onClick={()=>
      startVoice(setCustomTopic)
    }
    style={{
      width:50,
      height:50,
      borderRadius:"50%",
      border:"none",
      cursor:"pointer",
      fontSize:22,
      background:pInfo.g,
      color:"white",
      fontWeight:900
    }}
  >
    🎤
  </button>

</div>
    <div style={{
      display:"flex",
      justifyContent:"space-between",
      alignItems:"center",
      marginBottom:16
    }}>

      <h3 style={{
        fontWeight:900,
        fontSize:17,
        margin:0,
        background:pInfo.g,
        WebkitBackgroundClip:"text",
        WebkitTextFillColor:"transparent"
      }}>
        📝 {currentTopic}
      </h3>

      <div style={{display:"flex",gap:8}}>

        <Btn
          onClick={()=>{
            const w = window.open("");

            w.document.write(`
              <html>
                <head>
                  <title>${currentTopic}</title>
                </head>
                <body style="font-family:Arial;padding:30px;">
                  ${text.replace(/\n/g,"<br/>")}
                </body>
              </html>
            `);

            w.document.close();
            w.print();
          }}
          grad={G.green}
          sm
        >
          🖨 Imprimir
        </Btn>

        <Btn onClick={gen} grad={pInfo.g} sm>
          🔄 Novo
        </Btn>

      </div>
    </div>

    <div className="glass" style={{padding:"22px 26px"}}>
      {renderFull(text)}
    </div>

  </div>
);
}
function renderQuestion(
  text,
  value,
  onChange
){

  const parts = text.split("___");

  return(

    <div style={{
      display:"flex",
      flexWrap:"wrap",
      alignItems:"center",
      gap:8,
      lineHeight:2
    }}>

      {parts.map((part,index)=>(

        <React.Fragment key={index}>

          <span>{part}</span>

          {index < parts.length - 1 && (

            <input
              value={value || ""}
              onChange={e=>
                onChange(e.target.value)
              }
              placeholder="Resposta"
              style={{
                minWidth:140,
                padding:"8px 12px",
                borderRadius:10,
                border:"2px solid rgba(255,255,255,0.1)",
                background:"rgba(255,255,255,0.08)",
                color:"white",
                outline:"none",
                fontWeight:700
              }}
            />

          )}

        </React.Fragment>

      ))}

    </div>

  );
}
function ExerciseMode({topic,grade,pInfo,lang,onXP}){
  const gObj=GRADES.find(x=>x.id===grade);
  const [exs,setExs]=useState(null);
  const [ans,setAns]=useState({});
  const [rev,setRev]=useState({});
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");
  const gen=async()=>{
    setLoading(true);setExs(null);setAns({});setRev({});setErr("");
    try{
      const d=await callJSON(
`Create 5 English exercises about "${topic?.label}" for ${gObj?.full} students.

IMPORTANT:
For ALL fill-in-the-blank exercises, ALWAYS use ___ inside the sentence where the student should type the answer.

Example:
"She ___ to school every day."

Mix exercise types:
- fill-in-the-blank
- rewrite
- translate

Return ONLY this JSON (no extra text):

{
  "exercises":[
    {
      "type":"fill-in",
      "instruction":"Complete the sentence:",
      "question":"She ___ to school every day.",
      "answer":"goes",
      "explanation":"explanation in Portuguese"
    },
    {
      "type":"rewrite",
      "instruction":"Rewrite using Simple Past:",
      "question":"I eat pizza.",
      "answer":"I ate pizza.",
      "explanation":"..."
    },
    {
      "type":"translate",
      "instruction":"Translate to English:",
      "question":"Eu gosto de música.",
      "answer":"I like music.",
      "explanation":"..."
    }
  ]
}

Use all three types.
Explanations must be in Portuguese.`,
grade
);
      setExs(d);
    }catch(e){setErr("❌ "+e.message);}
    setLoading(false);
  };
  const revAll=()=>{const a={};exs?.exercises?.forEach((_,i)=>{a[i]=true;});setRev(a);onXP(5);};
  if(!exs&&!loading&&!err)return<EmptyStart icon="✏️" title={`Exercícios: ${topic?.label}`} desc="5 exercícios variados com gabarito explicado." btnLabel="✏️ Gerar Exercícios" onClick={gen} pInfo={pInfo}/>;
  if(err)return<ErrBox msg={err} onRetry={gen}/>;
  if(loading)return<Spinner label="Criando exercícios..."/>;
  return(
    <div style={{padding:"20px 24px",overflowY:"auto",height:"100%",animation:"fadeUp .25s ease"}}>
      <div style={{
  display:"flex",
  justifyContent:"space-between",
  alignItems:"center",
  marginBottom:16
}}>
  
  <h3 style={{
    fontWeight:900,
    fontSize:17,
    margin:0,
    background:pInfo.g,
    WebkitBackgroundClip:"text",
    WebkitTextFillColor:"transparent"
  }}>
    ✏️ {topic?.label}
  </h3>

  <div style={{display:"flex",gap:8}}>

    <Btn
      onClick={() => window.print()}
      grad={G.cyan}
      sm
    >
      🖨 Imprimir
    </Btn>

    <Btn onClick={revAll} grad={G.green} sm>
      ✅ Gabarito
    </Btn>

    <Btn onClick={gen} grad={pInfo.g} sm>
      🔄 Novo
    </Btn>

  </div>
</div>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {exs?.exercises?.map((ex,i)=>{
          const tg=ex.type==="fill-in"?G.cyan:ex.type==="rewrite"?G.pink:G.green;
          return(
            <div key={i} className="glass" style={{padding:"18px 20px"}}>
              <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:9}}>
                <div style={{width:26,height:26,borderRadius:"50%",background:tg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:"white",flexShrink:0}}>{i+1}</div>
                <span style={{fontSize:11,fontWeight:800,letterSpacing:.8,textTransform:"uppercase",background:tg,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{ex.type==="fill-in"?"Preencha":ex.type==="rewrite"?"Reescreva":"Traduza"}</span>
              </div>
              <p style={{color:"rgba(255,255,255,0.5)",fontSize:12,margin:"0 0 5px",fontWeight:600}}>{ex.instruction}</p>
{
  ex.type === "fill-in"

    ? renderQuestion(
        ex.question,
        ans[i],
        val=>
          setAns(p=>({
            ...p,
            [i]:val
          }))
      )

    : (

      <p style={{
        color:"white",
        fontSize:15,
        margin:"0 0 12px",
        fontStyle:"italic",
        lineHeight:1.5,
        fontWeight:700
      }}>
        {ex.question}
      </p>

    )
}   
<div style={{marginTop:10}}>
  <Btn
    onClick={()=>{
      setRev(p=>({...p,[i]:!p[i]}));

      if(!rev[i]) onXP(3);
    }}

    grad={rev[i]?G.green:pInfo.g}

    sm

    style={{
      borderRadius:999,
      whiteSpace:"nowrap"
    }}
  >
    {rev[i]?"🙈 Ocultar":"👁 Ver"}
  </Btn>
</div>           
              {rev[i]&&<div style={{marginTop:11,padding:"12px 15px",background:"rgba(52,211,153,0.08)",border:"1.5px solid rgba(52,211,153,0.25)",borderRadius:13}}><p style={{fontWeight:800,margin:"0 0 3px",fontSize:13,color:"#34D399"}}>✅ {ex.answer}</p>{ex.explanation&&<p style={{color:"rgba(255,255,255,0.55)",margin:0,fontSize:12,lineHeight:1.6,fontWeight:600}}>💡 <MD text={ex.explanation}/></p>}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
function SpeechMode({grade,pInfo,lang}){
  const gObj=GRADES.find(x=>x.id===grade);
  const [sents,setSents]=useState([]);const [cur,setCur]=useState(0);const [loading,setLoading]=useState(false);
  const [speaking,setSpeaking]=useState(false);const [recording,setRecording]=useState(false);
  const [transcript,setTranscript]=useState("");const [score,setScore]=useState(null);const [scores,setScores]=useState([]);const [err,setErr]=useState("");
  const recRef=useRef(null);
  const hasTTS=()=>"speechSynthesis" in window;const hasRec=()=>"SpeechRecognition" in window||"webkitSpeechRecognition" in window;
  const load=async()=>{
    setLoading(true);setErr("");
    try{
      const d=await callJSON(
        `Create 8 English sentences for pronunciation practice, suitable for ${gObj?.full} students.
Return ONLY this JSON (no extra text):
{"sentences":[{"en":"The dog runs fast.","hint":"dhi dog ronz faest","pt":"O cachorro corre rápido."}]}
Rules: sentences 4-8 words long, hint uses simplified Portuguese phonetics, pt is Portuguese translation.`,
        grade
      );
      setSents(d.sentences||[]);setCur(0);setScores([]);setTranscript("");setScore(null);
    }catch(e){setErr("❌ "+e.message);}
    setLoading(false);
  };
  const speakIt=(text,slow=false)=>{if(!hasTTS()){setErr("TTS não disponível.");return;}setSpeaking(true);speak(text,slow?0.6:0.85,()=>setSpeaking(false));};
  const startRec=()=>{
    if(!hasRec()){setErr("Reconhecimento de voz não disponível. Use Chrome/Edge.");return;}
    const Rec=window.SpeechRecognition||window.webkitSpeechRecognition;const rec=new Rec();
    rec.lang="en-US";rec.continuous=false;rec.interimResults=false;
    rec.onresult=(e)=>{const t=e.results[0][0].transcript;setTranscript(t);const s=pronScore(t,sents[cur].en);setScore(s);setScores(p=>[...p,{idx:cur,score:s,spoken:t}]);};
    rec.onerror=(e)=>{setErr("Erro: "+e.error);setRecording(false);};rec.onend=()=>setRecording(false);
    recRef.current=rec;rec.start();setRecording(true);setTranscript("");setScore(null);
  };
  const sc=s=>s>=80?"#34D399":s>=60?"#FBBF24":s>=40?"#FB923C":"#F472B6";
  const sl=s=>s>=80?"Excelente! 🌟":s>=60?"Bom! 👍":s>=40?"Quase! 💪":"Tente novamente 🔄";
  if(!sents.length&&!loading)return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:18,padding:40,textAlign:"center"}}>
      <div style={{fontSize:58,animation:"float 2.5s ease-in-out infinite"}}>🎙️</div>
      <h3 style={{color:"white",fontSize:22,fontWeight:900,margin:0}}>Treino de Pronúncia</h3>
      <p style={{color:"rgba(255,255,255,0.5)",maxWidth:340,fontSize:14,lineHeight:1.7,fontWeight:600,margin:0}}>Ouça o tutor falar, grave sua voz e veja sua pontuação!</p>
      <div style={{display:"flex",gap:10,fontSize:13,color:"rgba(255,255,255,0.35)",fontWeight:700}}><span>{hasTTS()?"✅ TTS":"❌ TTS"}</span><span>{hasRec()?"✅ Mic":"❌ Mic"}</span></div>
      {err&&<div style={{color:"#FCA5A5",fontSize:13,fontWeight:700}}>{err}</div>}
      <Btn onClick={load} grad={pInfo.g}>🎲 Gerar Frases com IA</Btn>
    </div>
  );
  if(loading)return<Spinner label="Gerando frases..."/>;
  if(cur>=sents.length){
    const avg=scores.length?Math.round(scores.reduce((a,s)=>a+s.score,0)/scores.length):0;
    return(
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:16,padding:36,overflowY:"auto",animation:"fadeUp .3s ease"}}>
        <div style={{fontSize:58}}>{avg>=80?"🌟":avg>=60?"🎉":"💪"}</div>
        <h3 style={{color:"white",fontWeight:900,fontSize:22,margin:0}}>Sessão Concluída!</h3>
        <div style={{fontWeight:900,fontSize:48,color:sc(avg)}}>{avg}%</div>
        <p style={{color:"rgba(255,255,255,0.55)",fontWeight:700,textAlign:"center"}}>Pontuação média de pronúncia</p>
        <div style={{width:"100%",maxWidth:420,display:"flex",flexDirection:"column",gap:7}}>
          {scores.map((s,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"9px 13px",background:"rgba(255,255,255,0.05)",border:"1.5px solid rgba(255,255,255,0.08)",borderRadius:13}}>
              <div style={{width:38,height:38,borderRadius:"50%",background:`conic-gradient(${sc(s.score)} ${s.score}%,rgba(255,255,255,0.08) 0%)`,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:30,height:30,borderRadius:"50%",background:"#0f0928",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:11,color:sc(s.score)}}>{s.score}%</div></div>
              <div style={{flex:1}}><div style={{color:"rgba(255,255,255,0.5)",fontSize:11,fontWeight:700}}>{sents[s.idx]?.en}</div><div style={{color:"rgba(255,255,255,0.35)",fontSize:11,fontWeight:600,fontStyle:"italic"}}>"{s.spoken}"</div></div>
            </div>
          ))}
        </div>
        <Btn onClick={load} grad={pInfo.g}>🔄 Novas Frases</Btn>
      </div>
    );
  }
  const s=sents[cur];
  return(
    <div style={{padding:"22px 26px",display:"flex",flexDirection:"column",gap:16,height:"100%",overflowY:"auto",animation:"fadeUp .25s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontWeight:800,fontSize:13,background:pInfo.g,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Frase {cur+1}/{sents.length}</span>
        <div style={{display:"flex",gap:5}}>{sents.map((_,i)=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:i<cur?"#34D399":i===cur?pInfo.c:"rgba(255,255,255,0.15)"}}/>)}</div>
      </div>
      <div className="glass" style={{padding:"22px 24px",textAlign:"center"}}>
        <div style={{color:"white",fontWeight:900,fontSize:20,marginBottom:10,lineHeight:1.4}}>{s.en}</div>
        <div style={{color:"rgba(255,255,255,0.5)",fontSize:13,fontWeight:700,marginBottom:4}}>🇧🇷 {s.pt}</div>
        <div style={{color:"rgba(255,255,255,0.35)",fontSize:12,fontWeight:600,fontStyle:"italic"}}>📣 {s.hint}</div>
      </div>
      <div style={{display:"flex",gap:10,justifyContent:"center"}}>
        <button onClick={()=>speakIt(s.en)} disabled={speaking||recording} className="cta" style={{padding:"11px 18px",background:speaking?pInfo.g:"rgba(255,255,255,0.08)",border:`2px solid ${speaking?pInfo.c:"rgba(255,255,255,0.15)"}`,borderRadius:13,color:"white",fontSize:14,fontWeight:800,display:"flex",alignItems:"center",gap:7}}>
          <span style={{fontSize:18}}>{speaking?"🔊":"▶️"}</span> Ouvir
        </button>
        <button onClick={()=>speakIt(s.en,true)} disabled={speaking||recording} className="cta" style={{padding:"11px 18px",background:"rgba(255,255,255,0.06)",border:"2px solid rgba(255,255,255,0.12)",borderRadius:13,color:"rgba(255,255,255,0.7)",fontSize:14,fontWeight:800,display:"flex",alignItems:"center",gap:7}}>
          <span style={{fontSize:18}}>🐢</span> Devagar
        </button>
      </div>
      <div style={{display:"flex",justifyContent:"center"}}>
        <button onClick={startRec} disabled={speaking||recording} className="cta" style={{width:90,height:90,borderRadius:"50%",background:recording?"linear-gradient(135deg,#ef4444,#f43f5e)":pInfo.g,border:`4px solid ${recording?"#ef4444":pInfo.c}`,boxShadow:recording?"0 0 30px #ef444488":`0 0 20px ${pInfo.c}88`,fontSize:34,color:"white",display:"flex",alignItems:"center",justifyContent:"center",animation:recording?"heartbeat .5s ease-in-out infinite":"none"}}>
          {recording?"⏹":"🎤"}
        </button>
      </div>
      {recording&&<p style={{textAlign:"center",color:"#EF4444",fontWeight:800,fontSize:13,animation:"pulse 1s infinite"}}>🔴 Gravando... Fale a frase!</p>}
      {transcript&&(
        <div style={{padding:"14px 18px",borderRadius:14,background:score!==null?`rgba(${score>=60?"52,211,153":"244,114,182"},0.1)`:"rgba(255,255,255,0.05)",border:`1.5px solid rgba(${score!==null?(score>=60?"52,211,153":"244,114,182"):"255,255,255"},0.25)`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
            <span style={{color:"rgba(255,255,255,0.6)",fontSize:12,fontWeight:700}}>Você disse:</span>
            {score!==null&&<div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:44,height:44,borderRadius:"50%",background:`conic-gradient(${sc(score)} ${score}%,rgba(255,255,255,0.08) 0%)`,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:34,height:34,borderRadius:"50%",background:"#0f0928",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:12,color:sc(score)}}>{score}%</div></div>
              <span style={{color:sc(score),fontWeight:800,fontSize:13}}>{sl(score)}</span>
            </div>}
          </div>
          <p style={{color:"white",fontWeight:700,fontSize:14,margin:0,fontStyle:"italic"}}>"{transcript}"</p>
        </div>
      )}
      <div style={{display:"flex",gap:10,marginTop:"auto"}}>
        <Btn onClick={load} grad="linear-gradient(135deg,#475569,#334155)" sm>🔄 Novas</Btn>
        {cur<sents.length-1?<Btn onClick={()=>{setCur(c=>c+1);setTranscript("");setScore(null);}} grad={pInfo.g} style={{flex:1}}>Próxima Frase ➜</Btn>:<Btn onClick={()=>setCur(sents.length)} grad={G.green} style={{flex:1}}>Ver Resultado 🏆</Btn>}
      </div>
      {err&&<div style={{color:"#FCA5A5",fontSize:12,fontWeight:700,textAlign:"center"}}>{err}</div>}
    </div>
  );
}
function ChallengeMode({topic,grade,pInfo,lang,profile}){
  const gObj=GRADES.find(x=>x.id===grade);
  const [tab,setTab]=useState("menu");
  const [questions,setQuestions]=useState([]);
  const [code,setCode]=useState("");
  const [joinCode,setJoinCode]=useState("");
  const [cur,setCur]=useState(0);const [score,setScore]=useState(0);const [sel,setSel]=useState(null);const [done,setDone]=useState(false);const [loading,setLoading]=useState(false);const [log,setLog]=useState([]);const [copied,setCopied]=useState(false);
  const enc=(qs)=>{try{return btoa(unescape(encodeURIComponent(JSON.stringify({q:qs,g:grade,t:topic?.label||"English"}))));}catch{return btoa(JSON.stringify({q:qs}));}};
  const dec=(c)=>{try{return JSON.parse(decodeURIComponent(escape(atob(c.trim()))));}catch{try{return JSON.parse(atob(c.trim()));}catch{return null;}}};
  const create=async()=>{
    setLoading(true);
    try{
      const d=await callJSON(
        `Create 8 multiple choice questions about "${topic?.label||"English"}" for ${gObj?.full} students.
Return ONLY this JSON:
{"questions":[{"question":"...","options":["A) ...","B) ...","C) ...","D) ..."],"correct":0}]}
"correct" is the index (0-3) of the right answer.`,
        grade
      );
      const qs=d.questions||[];setQuestions(qs);setCode(enc(qs));setTab("created");
    }catch(e){alert("Erro: "+e.message);}
    setLoading(false);
  };
  const join=()=>{const data=dec(joinCode);if(!data?.q){alert("Código inválido!");return;}setQuestions(data.q);setCur(0);setScore(0);setDone(false);setLog([]);setSel(null);setTab("play");};
  const startOwn=()=>{setCur(0);setScore(0);setDone(false);setLog([]);setSel(null);setTab("play");};
  const pick=(idx)=>{
    if(sel!==null)return;setSel(idx);const ok=idx===questions[cur].correct;
    if(ok)setScore(s=>s+10);setLog(l=>[...l,{ok}]);
    setTimeout(()=>{setSel(null);if(cur+1>=questions.length)setDone(true);else setCur(c=>c+1);},1100);
  };
  const copyCode=()=>{navigator.clipboard.writeText(code).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2500);});};
  if(tab==="menu")return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:20,padding:36,textAlign:"center"}}>
      <div style={{fontSize:56,animation:"float 2.5s ease-in-out infinite"}}>⚔️</div>
      <h3 style={{color:"white",fontSize:22,fontWeight:900,margin:0}}>Desafio Aluno × Aluno</h3>
      {profile?.uid&&<div style={{padding:"7px 16px",borderRadius:999,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)"}}><span style={{color:"rgba(255,255,255,0.5)",fontSize:11,fontWeight:700}}>Seu ID: </span><span style={{color:"white",fontWeight:900,fontSize:13,letterSpacing:1}}>{profile.uid}</span></div>}
      <p style={{color:"rgba(255,255,255,0.5)",maxWidth:340,fontSize:14,lineHeight:1.7,fontWeight:600,margin:0}}>Crie um desafio, copie o código e envie para um amigo em qualquer dispositivo!</p>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center"}}>
        <Btn onClick={create} disabled={loading} grad={pInfo.g}>{loading?"⚙️ Gerando...":"⚔️ Criar Desafio"}</Btn>
        <Btn onClick={()=>setTab("join")} grad="linear-gradient(135deg,#475569,#334155)">📥 Aceitar Desafio</Btn>
      </div>
    </div>
  );
  if(tab==="created")return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:16,padding:32,textAlign:"center"}}>
      <div style={{fontSize:48}}>⚔️</div>
      <h3 style={{color:"white",fontWeight:900,fontSize:20,margin:0}}>Desafio Criado!</h3>
      <p style={{color:"rgba(255,255,255,0.5)",fontSize:13,fontWeight:600,maxWidth:320,margin:0}}>Copie o código e envie para o seu oponente (WhatsApp, e-mail, etc.).</p>
      <div style={{width:"100%",maxWidth:440,background:"rgba(255,255,255,0.06)",border:"1.5px solid rgba(255,255,255,0.12)",borderRadius:16,padding:"14px 16px"}}>
        <div style={{color:"rgba(255,255,255,0.4)",fontSize:11,fontWeight:800,letterSpacing:1.2,textTransform:"uppercase",marginBottom:8}}>Código ({questions.length} perguntas)</div>
        <div style={{wordBreak:"break-all",fontFamily:"monospace",fontSize:11,color:"#67E8F9",lineHeight:1.6,maxHeight:72,overflowY:"auto",background:"rgba(0,0,0,0.3)",borderRadius:9,padding:"9px 11px",marginBottom:11}}>{code}</div>
        <button onClick={copyCode} style={{width:"100%",padding:"10px",background:copied?"rgba(52,211,153,0.15)":"rgba(255,255,255,0.08)",border:`1.5px solid ${copied?"rgba(52,211,153,0.4)":"rgba(255,255,255,0.15)"}`,borderRadius:11,color:copied?"#34D399":"rgba(255,255,255,0.7)",fontWeight:800,fontSize:13,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>{copied?"✅ Copiado!":"📋 Copiar Código"}</button>
      </div>
      <div style={{display:"flex",gap:10}}><Btn onClick={()=>setTab("menu")} grad="linear-gradient(135deg,#475569,#334155)" sm>← Novo</Btn><Btn onClick={startOwn} grad={pInfo.g}>▶ Jogar Agora!</Btn></div>
    </div>
  );
  if(tab==="join")return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:16,padding:36}}>
      <div style={{fontSize:48}}>📥</div><h3 style={{color:"white",fontWeight:900,fontSize:20,margin:0}}>Aceitar Desafio</h3>
      <p style={{color:"rgba(255,255,255,0.5)",fontSize:13,fontWeight:600,textAlign:"center",maxWidth:320,margin:0}}>Cole o código recebido do seu amigo</p>
      <textarea value={joinCode} onChange={e=>setJoinCode(e.target.value)} rows={4} placeholder="Cole o código do desafio aqui..."
        style={{width:"100%",maxWidth:420,background:"rgba(255,255,255,0.07)",border:"2px solid rgba(255,255,255,0.12)",borderRadius:13,padding:"11px 13px",color:"white",fontSize:13,outline:"none",fontWeight:600,resize:"vertical"}}/>
      <div style={{display:"flex",gap:10}}><Btn onClick={()=>setTab("menu")} grad="linear-gradient(135deg,#475569,#334155)" sm>← Voltar</Btn><Btn onClick={join} disabled={!joinCode.trim()} grad={pInfo.g}>⚔️ Entrar no Desafio!</Btn></div>
    </div>
  );
  if(done){
    const pct=Math.round((score/(questions.length*10))*100);const col=pct>=80?"#34D399":pct>=60?"#FBBF24":"#F472B6";
    return(
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:16,padding:36,overflowY:"auto",animation:"fadeUp .3s ease"}}>
        <div style={{fontSize:58}}>{pct>=80?"🏆":pct>=60?"🎉":"💪"}</div>
        <h3 style={{color:"white",fontWeight:900,fontSize:22,margin:0}}>Resultado!</h3>
        <div style={{fontWeight:900,fontSize:48,color:col}}>{score}/{questions.length*10}</div>
        <div style={{padding:"10px 22px",borderRadius:999,background:`${col}22`,border:`2px solid ${col}44`}}><span style={{color:col,fontWeight:900,fontSize:15}}>{pct}% de acertos</span></div>
        <p style={{color:"rgba(255,255,255,0.45)",fontSize:13,fontWeight:700,textAlign:"center",maxWidth:280,margin:0}}>Compartilhe sua pontuação com o oponente! 😄</p>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center"}}><Btn onClick={startOwn} grad={pInfo.g}>🔄 Jogar de Novo</Btn><Btn onClick={()=>setTab("menu")} grad="linear-gradient(135deg,#475569,#334155)">← Menu</Btn></div>
      </div>
    );
  }
  if(tab==="play"&&questions.length){
    const q=questions[cur];
    return(
      <div style={{padding:"20px 24px",display:"flex",flexDirection:"column",gap:14,height:"100%",overflowY:"auto",animation:"fadeUp .2s ease"}}>
        <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:800,fontSize:13,background:pInfo.g,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Pergunta {cur+1}/{questions.length}</span><span style={{fontWeight:900,fontSize:13,color:"#FBBF24"}}>⭐ {score} pts</span></div>
        <div style={{height:5,background:"rgba(255,255,255,0.07)",borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",width:`${(cur/questions.length)*100}%`,background:pInfo.g,borderRadius:99,transition:"width .4s"}}/></div>
        <div className="glass" style={{padding:"16px 20px"}}><p style={{color:"white",fontSize:16,fontWeight:700,margin:0,lineHeight:1.5}}>{q.question}</p></div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {q.options.map((opt,i)=>{
            let bg="rgba(255,255,255,0.05)",bdr="1.5px solid rgba(255,255,255,0.09)";
            if(sel!==null){if(i===q.correct){bg="rgba(52,211,153,0.18)";bdr="1.5px solid #34D399";}else if(i===sel&&i!==q.correct){bg="rgba(244,114,182,0.18)";bdr="1.5px solid #F472B6";}}
            return(<button key={i} onClick={()=>pick(i)} style={{padding:"12px 16px",background:bg,border:bdr,borderRadius:13,color:"white",fontSize:14,textAlign:"left",cursor:sel!==null?"default":"pointer",fontFamily:"'Nunito',sans-serif",fontWeight:700,transition:"all .2s"}}><span style={{marginRight:8,opacity:0.5,fontSize:12}}>{"ABCD"[i]}</span>{opt}</button>);
          })}
        </div>
        {sel!==null&&<div style={{padding:"10px 14px",borderRadius:12,background:sel===q.correct?"rgba(52,211,153,0.1)":"rgba(244,114,182,0.1)",border:`1px solid ${sel===q.correct?"rgba(52,211,153,0.3)":"rgba(244,114,182,0.3)"}`,textAlign:"center"}}><span style={{color:sel===q.correct?"#34D399":"#F472B6",fontWeight:800,fontSize:14}}>{sel===q.correct?"✅ Correto! +10 pts":"❌ Errou!"}</span></div>}
      </div>
    );
  }
  return null;
}

/* ══════════════════════════════════════════════════════
   TEACHER PORTAL
══════════════════════════════════════════════════════ */
function MiniGameTeacher(){
  const [phase,setPhase]=useState("setup");const [topicTxt,setTopicTxt]=useState("");const [grade,setGrade]=useState("ef7");
  const [questions,setQuestions]=useState([]);const [roomCode,setRoomCode]=useState(()=>genCode());const [players,setPlayers]=useState([]);
  const [cur,setCur]=useState(0);const [timer,setTimer]=useState(20);const [loading,setLoading]=useState(false);const [answers,setAnswers]=useState({});const [showAns,setShowAns]=useState(false);
  const chRef=useRef(null);const timerRef=useRef(null);
  useEffect(()=>{
    const ch=new BroadcastChannel("eu_game_"+roomCode);chRef.current=ch;
    ch.onmessage=(e)=>{const {type,data}=e.data;if(type==="join")setPlayers(p=>p.find(x=>x.name===data.name)?p:[...p,{name:data.name,score:0}]);if(type==="answer")setAnswers(a=>({...a,[data.name]:data.ans}));};
    return ()=>ch.close();
  },[roomCode]);
  const bc=(msg)=>chRef.current?.postMessage(msg);
  const genQ=async()=>{
    if(!topicTxt.trim())return;setLoading(true);
    try{
      const d=await callJSON(
        `Create 10 multiple choice questions about "${topicTxt}" for ${GRADES.find(g=>g.id===grade)?.full} students.
Return ONLY this JSON:
{"questions":[{"q":"...","options":["A) ...","B) ...","C) ...","D) ..."],"correct":0}]}
"correct" is the index (0-3) of the right answer. Make questions fun and engaging.`,
        grade
      );
      setQuestions(d.questions||[]);setPhase("lobby");
    }catch(e){alert("Erro: "+e.message);}
    setLoading(false);
  };
  const startGame=()=>{setCur(0);setAnswers({});setShowAns(false);setPhase("playing");bc({type:"game_start",data:{questions}});startTimer();};
  const startTimer=()=>{setTimer(20);setShowAns(false);setAnswers({});clearInterval(timerRef.current);timerRef.current=setInterval(()=>setTimer(t=>{if(t<=1){clearInterval(timerRef.current);setShowAns(true);return 0;}return t-1;}),1000);};
  const nextQ=()=>{
    const q=questions[cur];setPlayers(prev=>prev.map(pl=>{const ans=answers[pl.name];return{...pl,score:pl.score+(ans===q.correct?10:0)};}));
    if(cur+1>=questions.length){setPhase("podium");bc({type:"game_end"});}else{setCur(c=>c+1);bc({type:"next_question",data:{qIdx:cur+1}});setTimeout(()=>startTimer(),300);}
  };
  useEffect(()=>{if(phase==="playing"&&questions[cur])bc({type:"question",data:{q:questions[cur],qIdx:cur,total:questions.length}});},[cur,phase]);
  const sorted=[...players].sort((a,b)=>b.score-a.score);
  if(phase==="setup")return(
    <div style={{padding:"28px 26px",maxWidth:520,margin:"0 auto"}}>
      <h3 style={{color:"white",fontWeight:900,fontSize:19,margin:"0 0 22px"}}>🎮 Criar Mini-jogo para a Turma</h3>
      <div style={{marginBottom:14}}><label style={{color:"rgba(255,255,255,0.5)",fontSize:11,fontWeight:800,letterSpacing:1.2,textTransform:"uppercase",display:"block",marginBottom:7}}>Série dos alunos</label>
        <select value={grade} onChange={e=>setGrade(e.target.value)} style={{width:"100%",background:"rgba(255,255,255,0.08)",border:"2px solid rgba(255,255,255,0.12)",borderRadius:12,padding:"10px 13px",color:"white",fontSize:14,outline:"none",fontWeight:700}}>
          {GRADES.map(g=><option key={g.id} value={g.id} style={{background:"#1a1a2e"}}>{g.emoji} {g.full}</option>)}
        </select>
      </div>
      <div style={{marginBottom:18}}><label style={{color:"rgba(255,255,255,0.5)",fontSize:11,fontWeight:800,letterSpacing:1.2,textTransform:"uppercase",display:"block",marginBottom:7}}>Tópico do jogo</label>
        <input value={topicTxt} onChange={e=>setTopicTxt(e.target.value)} placeholder="Ex: Simple Past, Animals, Colors..." style={{width:"100%",background:"rgba(255,255,255,0.08)",border:"2px solid rgba(255,255,255,0.12)",borderRadius:12,padding:"11px 13px",color:"white",fontSize:14,outline:"none",fontWeight:700}}/>
      </div>
      <Btn onClick={genQ} disabled={!topicTxt.trim()||loading} grad={G.cyan} style={{width:"100%"}}>{loading?"⚙️ Gerando...":"🎲 Criar Jogo com IA"}</Btn>
    </div>
  );
  if(phase==="lobby")return(
    <div style={{padding:"26px",maxWidth:520,margin:"0 auto",textAlign:"center"}}>
      <h3 style={{color:"white",fontWeight:900,fontSize:19,margin:"0 0 6px"}}>🎮 Sala de Espera</h3>
      <p style={{color:"rgba(255,255,255,0.45)",fontSize:13,fontWeight:700,marginBottom:22}}>Código para os alunos entrarem:</p>
      <div style={{padding:"24px 20px",borderRadius:22,marginBottom:18,background:"linear-gradient(135deg,#06b6d4,#6366f1)",boxShadow:"0 12px 40px rgba(6,182,212,0.4)"}}>
        <div style={{color:"rgba(255,255,255,0.7)",fontSize:12,fontWeight:800,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>Código da Sala</div>
        <div style={{color:"white",fontWeight:900,fontSize:52,letterSpacing:8}}>{roomCode}</div>
      </div>
      <div style={{textAlign:"left",marginBottom:18}}>
        <div style={{color:"rgba(255,255,255,0.4)",fontSize:11,fontWeight:800,textTransform:"uppercase",marginBottom:9}}>Alunos ({players.length})</div>
        {players.length===0&&<p style={{color:"rgba(255,255,255,0.25)",fontSize:13,fontWeight:700,textAlign:"center"}}>Aguardando...</p>}
        <div style={{display:"flex",flexWrap:"wrap",gap:7}}>{players.map((p,i)=><div key={i} style={{padding:"6px 14px",borderRadius:999,background:"rgba(6,182,212,0.15)",border:"1.5px solid rgba(6,182,212,0.35)",color:"#67E8F9",fontWeight:800,fontSize:13}}>{p.name}</div>)}</div>
      </div>
      <div style={{display:"flex",gap:10}}><Btn onClick={()=>{setPhase("setup");setPlayers([]);}} grad="linear-gradient(135deg,#475569,#334155)" style={{flex:1}}>← Voltar</Btn><Btn onClick={startGame} disabled={players.length===0} grad={G.green} style={{flex:1}}>▶ Iniciar</Btn></div>
    </div>
  );
  if(phase==="playing"){
    const q=questions[cur];const timerPct=(timer/20)*100;const tc=timer>10?"#34d399":timer>5?"#fbbf24":"#ef4444";
    return(
      <div style={{padding:"22px 26px",display:"flex",flexDirection:"column",gap:16,height:"100%",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontWeight:800,fontSize:13,background:G.cyan,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Pergunta {cur+1}/{questions.length}</span>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:46,height:46,borderRadius:"50%",background:"rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
              <svg viewBox="0 0 36 36" style={{position:"absolute",inset:0,width:"100%",height:"100%",transform:"rotate(-90deg)"}}><circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4"/><circle cx="18" cy="18" r="15" fill="none" stroke={tc} strokeWidth="4" strokeDasharray={`${2*Math.PI*15}`} strokeDashoffset={`${2*Math.PI*15*(1-timerPct/100)}`} strokeLinecap="round" style={{transition:"stroke-dashoffset .9s linear"}}/></svg>
              <span style={{color:tc,fontWeight:900,fontSize:15,position:"relative",zIndex:1}}>{timer}</span>
            </div>
            <span style={{color:"rgba(255,255,255,0.5)",fontSize:12,fontWeight:700}}>{Object.keys(answers).length}/{players.length} responderam</span>
          </div>
        </div>
        <div className="glass" style={{padding:"20px 24px"}}><p style={{color:"white",fontSize:17,fontWeight:800,margin:0,lineHeight:1.5}}>{q.q}</p></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
          {q.options.map((opt,i)=>{const oc=["rgba(244,114,182,0.25)","rgba(6,182,212,0.25)","rgba(251,191,36,0.25)","rgba(52,211,153,0.25)"];const ob=["#F472B6","#06B6D4","#FBBF24","#34D399"];const isC=showAns&&i===q.correct;return(<div key={i} style={{padding:"13px 15px",borderRadius:13,background:isC?"rgba(52,211,153,0.2)":oc[i],border:`2px solid ${isC?"#34D399":ob[i]}44`,color:"white",fontWeight:700,fontSize:13,boxShadow:isC?"0 0 20px #34D39944":"none"}}><span style={{opacity:0.5,fontSize:11,marginRight:7}}>{"ABCD"[i]}</span>{opt}</div>);})}
        </div>
        {Object.keys(answers).length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:6}}>{Object.entries(answers).map(([name,ans])=><div key={name} style={{padding:"4px 11px",borderRadius:999,fontSize:12,fontWeight:700,background:showAns?(ans===q.correct?"rgba(52,211,153,0.15)":"rgba(244,114,182,0.15)"):"rgba(255,255,255,0.08)",border:`1px solid ${showAns?(ans===q.correct?"#34D399":"#F472B6"):"rgba(255,255,255,0.15)"}`,color:showAns?(ans===q.correct?"#34D399":"#F472B6"):"rgba(255,255,255,0.6)"}}>  {showAns?(ans===q.correct?"✅":"❌"):""} {name}</div>)}</div>}
        <div style={{display:"flex",gap:10,marginTop:"auto"}}>{!showAns?<Btn onClick={()=>{clearInterval(timerRef.current);setShowAns(true);}} grad={G.yellow} style={{flex:1}}>⏩ Revelar</Btn>:<Btn onClick={nextQ} grad={G.green} style={{flex:1}}>{cur+1>=questions.length?"🏆 Ver Pódio":"Próxima ➜"}</Btn>}</div>
        <div style={{display:"flex",gap:7,padding:"10px 13px",background:"rgba(255,255,255,0.04)",borderRadius:13}}>{[...players].sort((a,b)=>b.score-a.score).slice(0,5).map((p,i)=><div key={i} style={{flex:1,textAlign:"center"}}><div style={{color:"rgba(255,255,255,0.4)",fontSize:9,fontWeight:700,marginBottom:2}}>#{i+1}</div><div style={{color:"white",fontWeight:800,fontSize:12}}>{p.name.split(" ")[0]}</div><div style={{fontWeight:900,fontSize:12,color:"#FBBF24"}}>{p.score}</div></div>)}</div>
      </div>
    );
  }
  if(phase==="podium"){
    const pc=["#FBBF24","#94A3B8","#C97B3F"];
    return(
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:16,padding:32,overflowY:"auto"}}>
        <h3 style={{color:"white",fontWeight:900,fontSize:22,margin:0}}>🏆 Resultado Final!</h3>
        <div style={{display:"flex",alignItems:"flex-end",gap:10,width:"100%",maxWidth:400,justifyContent:"center",marginBottom:8}}>
          {[1,0,2].map(rank=>{const p=sorted[rank];if(!p)return<div key={rank} style={{flex:1}}/>;const h=[150,195,120];const m=["🥈","🥇","🥉"];return(<div key={rank} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:7}}><div style={{fontSize:28,animation:rank===0?"heartbeat 1s ease-in-out infinite":"none"}}>{m[rank]}</div><div style={{color:"white",fontWeight:900,fontSize:13,textAlign:"center"}}>{p.name.split(" ")[0]}</div><div style={{fontWeight:900,fontSize:16,background:G.yellow,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{p.score} pts</div><div style={{width:"100%",height:h[rank],borderRadius:"13px 13px 0 0",background:`linear-gradient(180deg,${pc[rank]}88,${pc[rank]}44)`,border:`2px solid ${pc[rank]}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:pc[rank],fontWeight:900}}>{rank===0?"2º":rank===1?"1º":"3º"}</div></div>);})}
        </div>
        {sorted.slice(3).map((p,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"9px 14px",background:"rgba(255,255,255,0.05)",border:"1.5px solid rgba(255,255,255,0.08)",borderRadius:13,width:"100%",maxWidth:400}}><span style={{color:"rgba(255,255,255,0.4)",fontWeight:800,fontSize:13,width:22}}>#{i+4}</span><span style={{color:"white",fontWeight:700,fontSize:13,flex:1}}>{p.name}</span><span style={{fontWeight:900,fontSize:13,color:"#94A3B8"}}>{p.score} pts</span></div>)}
        <Btn onClick={()=>{setPhase("setup");setPlayers([]);setAnswers({});setCur(0);setRoomCode(genCode());}} grad={G.cyan}>🔄 Novo Jogo</Btn>
      </div>
    );
  }
  return null;
}
function MiniGameStudent({playerName,pInfo}){
  const [ph,setPh]=useState("join");const [code,setCode]=useState("");const [question,setQuestion]=useState(null);const [qIdx,setQIdx]=useState(0);const [total,setTotal]=useState(0);const [sel,setSel]=useState(null);const [score,setScore]=useState(0);const [results,setResults]=useState([]);
  const chRef=useRef(null);
  const joinRoom=()=>{
    const ch=new BroadcastChannel("eu_game_"+code.trim().toUpperCase());chRef.current=ch;
    ch.postMessage({type:"join",data:{name:playerName}});
    ch.onmessage=(e)=>{const {type,data}=e.data;
      if(type==="game_start"){setQuestion(data.questions[0]);setQIdx(0);setTotal(data.questions.length);setSel(null);setPh("playing");}
      if(type==="question"){setQuestion(data.q);setQIdx(data.qIdx);setTotal(data.total);setSel(null);setPh("playing");}
      if(type==="game_end")setPh("done");};
    setPh("waiting");
  };
  const answer=(idx)=>{if(sel!==null)return;setSel(idx);chRef.current?.postMessage({type:"answer",data:{name:playerName,ans:idx}});if(question&&idx===question.correct){setScore(s=>s+10);setResults(r=>[...r,true]);}else setResults(r=>[...r,false]);};
  useEffect(()=>()=>chRef.current?.close(),[]);
  if(ph==="join")return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:18,padding:40}}>
      <div style={{fontSize:54}}>🎮</div><h3 style={{color:"white",fontWeight:900,fontSize:20,margin:0}}>Entrar em Mini-jogo</h3>
      <p style={{color:"rgba(255,255,255,0.45)",textAlign:"center",fontSize:13,fontWeight:600,maxWidth:300,margin:0}}>Digite o código do professor</p>
      <input value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="Ex: AB3X7" maxLength={6}
        style={{background:"rgba(255,255,255,0.08)",border:"2px solid rgba(255,255,255,0.15)",borderRadius:13,padding:"13px 18px",color:"white",fontSize:26,outline:"none",fontWeight:900,textAlign:"center",letterSpacing:7,width:210,fontFamily:"'Nunito',sans-serif"}}/>
      <Btn onClick={joinRoom} disabled={code.length<4} grad={pInfo.g}>🚀 Entrar na Sala!</Btn>
    </div>
  );
  if(ph==="waiting")return<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:14}}><div style={{fontSize:46,animation:"wiggle 2s ease-in-out infinite"}}>⏳</div><h3 style={{color:"white",fontWeight:900,fontSize:18,margin:0}}>Aguardando o professor...</h3><p style={{color:"rgba(255,255,255,0.45)",fontWeight:700,fontSize:14}}>Sala: <strong style={{color:pInfo.c}}>{code}</strong></p></div>;
  if(ph==="done")return<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:16,padding:36}}><div style={{fontSize:60}}>{score>=(results.length*7)?"🏆":"📚"}</div><h3 style={{color:"white",fontWeight:900,fontSize:22,margin:0}}>Fim do Jogo!</h3><div style={{fontWeight:900,fontSize:46,background:G.yellow,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{score} pts</div><div style={{display:"flex",gap:7}}>{results.map((r,i)=><span key={i} style={{fontSize:18}}>{r?"✅":"❌"}</span>)}</div><Btn onClick={()=>{setPh("join");setScore(0);setResults([]);setCode("");}} grad={pInfo.g}>Jogar Novamente</Btn></div>;
  if(!question)return null;
  const oc=["rgba(244,114,182,0.2)","rgba(6,182,212,0.2)","rgba(251,191,36,0.2)","rgba(52,211,153,0.2)"];const ob=["#F472B6","#06B6D4","#FBBF24","#34D399"];
  return(
    <div style={{padding:"22px 26px",display:"flex",flexDirection:"column",gap:15,height:"100%",overflowY:"auto",animation:"fadeUp .2s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:800,fontSize:13,background:pInfo.g,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Pergunta {qIdx+1}/{total||"?"}</span><span style={{fontWeight:900,fontSize:13,color:"#FBBF24"}}>⭐ {score} pts</span></div>
      <div className="glass" style={{padding:"18px 22px"}}><p style={{color:"white",fontSize:16,fontWeight:800,margin:0,lineHeight:1.5}}>{question.q}</p></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
        {question.options.map((opt,i)=>{let bg=oc[i],bdr=ob[i]+"44";if(sel!==null){if(i===question.correct){bg="rgba(52,211,153,0.25)";bdr="#34D399";}else if(i===sel&&i!==question.correct){bg="rgba(244,114,182,0.25)";bdr="#F472B6";}else{bg="rgba(255,255,255,0.03)";bdr="rgba(255,255,255,0.06)";}}return(<button key={i} onClick={()=>answer(i)} style={{padding:"15px 13px",background:bg,border:`2px solid ${bdr}`,borderRadius:13,color:"white",fontSize:13,textAlign:"left",cursor:sel!==null?"default":"pointer",fontFamily:"'Nunito',sans-serif",fontWeight:700,transition:"all .2s"}}><span style={{marginRight:7,opacity:0.5,fontSize:11}}>{"ABCD"[i]}</span>{opt}</button>);})}
      </div>
      {sel!==null&&<div style={{padding:"11px 15px",background:sel===question.correct?"rgba(52,211,153,0.12)":"rgba(244,114,182,0.12)",border:`1.5px solid ${sel===question.correct?"rgba(52,211,153,0.3)":"rgba(244,114,182,0.3)"}`,borderRadius:13,textAlign:"center"}}><span style={{color:sel===question.correct?"#34D399":"#F472B6",fontWeight:800,fontSize:15}}>{sel===question.correct?"✅ Correto! +10 pts":"❌ Errou! Aguarde..."}</span></div>}
    </div>
  );
}
function PerformanceTab(){
  const students=getLinkedStudents();
  if(!students.length)return<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:14,padding:40,textAlign:"center"}}><div style={{fontSize:50}}>📊</div><h3 style={{color:"white",fontWeight:900,fontSize:18,margin:0}}>Nenhum aluno vinculado</h3><p style={{color:"rgba(255,255,255,0.4)",fontSize:13,fontWeight:600,maxWidth:300,margin:0}}>Peça aos alunos para digitarem o código da turma na barra lateral.</p></div>;
  const sorted=[...students].sort((a,b)=>(b.xp||0)-(a.xp||0));
  return(
    <div style={{padding:"22px 26px",overflowY:"auto",height:"100%"}}>
      <h3 style={{color:"white",fontWeight:900,fontSize:17,margin:"0 0 16px"}}>📊 Desempenho Individual ({students.length} alunos)</h3>
      <div style={{display:"flex",flexDirection:"column",gap:11}}>
        {sorted.map((st,i)=>{const pw=getPowerInfo(st.xp||0);const lvl=getLevel(st.xp||0);const pwr=getPower(st.xp||0);const gp=GP[st.grade]||GP.ef6;const gr=GRADES.find(g=>g.id===st.grade)||GRADES[6];return(
          <div key={st.sid} className="glass" style={{padding:"14px 18px"}}>
            <div style={{display:"flex",alignItems:"center",gap:13}}>
              <div style={{width:34,height:34,borderRadius:"50%",background:gp.g,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:14,color:"white",flexShrink:0}}>{i+1}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}><div><span style={{color:"white",fontWeight:800,fontSize:14}}>{st.name}</span><span style={{color:"rgba(255,255,255,0.4)",fontSize:11,fontWeight:700,marginLeft:9}}>{gr.emoji} {gr.full} • {st.age||"?"} anos</span></div><div style={{display:"flex",gap:7}}><span style={{padding:"2px 9px",borderRadius:999,background:gp.g,color:"white",fontSize:10,fontWeight:900}}>Nv{lvl}</span><span style={{fontSize:11,fontWeight:700,background:pw.g,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{pw.label}</span></div></div>
                <div style={{display:"flex",alignItems:"center",gap:9}}><div style={{flex:1,height:7,background:"rgba(255,255,255,0.07)",borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",width:`${pwr}%`,background:pw.g,borderRadius:99,boxShadow:`0 0 8px ${pw.c}88`}}/></div><span style={{color:"rgba(255,255,255,0.4)",fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>{st.xp||0} XP</span></div>
              </div>
            </div>
          </div>
        );})}
      </div>
    </div>
  );
}
function TurmaTab(){
  const [td,setTd]=useState(()=>getTeacherData());const [nameEdit,setNameEdit]=useState(td.name||"");const students=getLinkedStudents();
  const save=()=>{const nd={...td,name:nameEdit};saveTeacherData(nd);setTd(nd);};
  return(
    <div style={{padding:"22px 26px",overflowY:"auto",height:"100%"}}>
      <h3 style={{color:"white",fontWeight:900,fontSize:17,margin:"0 0 18px"}}>🔗 Minha Turma</h3>
      <div className="glass" style={{padding:"16px 18px",marginBottom:14}}>
        <div style={{color:"rgba(255,255,255,0.4)",fontSize:11,fontWeight:800,textTransform:"uppercase",letterSpacing:1,marginBottom:7}}>Seu nome</div>
        <div style={{display:"flex",gap:9}}><input defaultValue={td.name} onBlur={e=>setNameEdit(e.target.value)} style={{flex:1,background:"rgba(255,255,255,0.07)",border:"2px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"8px 12px",color:"white",fontSize:14,outline:"none",fontWeight:700}}/><Btn onClick={save} grad={G.cyan} sm>Salvar</Btn></div>
      </div>
      <div className="glass" style={{padding:"18px 20px",marginBottom:18,background:"linear-gradient(135deg,rgba(6,182,212,0.1),rgba(99,102,241,0.1))"}}>
        <div style={{color:"rgba(255,255,255,0.4)",fontSize:11,fontWeight:800,textTransform:"uppercase",letterSpacing:1,marginBottom:9}}>Código da Turma</div>
        <div style={{display:"flex",alignItems:"center",gap:14}}><div style={{fontWeight:900,fontSize:34,letterSpacing:6,color:"white"}}>{td.code}</div><p style={{color:"rgba(255,255,255,0.45)",fontSize:13,fontWeight:600,margin:0,lineHeight:1.5}}>Alunos digitam este código em <strong style={{color:"#67E8F9"}}>Sidebar → Vincular à Turma</strong></p></div>
      </div>
      <div style={{color:"rgba(255,255,255,0.4)",fontSize:11,fontWeight:800,textTransform:"uppercase",marginBottom:11}}>Alunos ({students.length})</div>
      {students.length===0&&<p style={{color:"rgba(255,255,255,0.2)",fontSize:14,fontWeight:700,textAlign:"center"}}>Nenhum aluno vinculado ainda</p>}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {students.map((st,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:11,padding:"10px 13px",background:"rgba(255,255,255,0.04)",border:"1.5px solid rgba(255,255,255,0.07)",borderRadius:13}}>
            <span style={{fontSize:18}}>{GRADES.find(g=>g.id===st.grade)?.emoji||"🎓"}</span>
            <div style={{flex:1}}><div style={{color:"white",fontWeight:700,fontSize:13}}>{st.name}</div><div style={{color:"rgba(255,255,255,0.4)",fontSize:11,fontWeight:600}}>{st.grade} • {st.xp||0} XP</div></div>
            <button onClick={()=>{const nd={...td,students:td.students.filter(s=>s!==st.sid)};saveTeacherData(nd);setTd(nd);}} style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:8,padding:"4px 9px",color:"#FCA5A5",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"'Nunito',sans-serif"}}>Remover</button>
          </div>
        ))}
      </div>
    </div>
  );
}
function TeacherPortal({onBack}){
  const [tab,setTab]=useState("games");
  const tabs=[{id:"games",icon:"🎮",label:"Mini-jogos"},{id:"perf",icon:"📊",label:"Desempenho"},{id:"turma",icon:"🔗",label:"Turma"}];
  return(
    <div style={{height:"100vh",background:G.bg,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <BackBtn onClick={onBack} label="Perfis"/>
      <div style={{padding:"18px 22px 0",borderBottom:"1px solid rgba(255,255,255,0.07)",background:"rgba(0,0,0,0.3)",backdropFilter:"blur(20px)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14,paddingLeft:80}}>
          <span style={{fontSize:24}}>🏫</span>
          <div><h2 style={{color:"white",fontWeight:900,fontSize:18,margin:0}}>Portal Professor / Escola</h2><p style={{color:"rgba(255,255,255,0.4)",fontSize:11,margin:0,fontWeight:700}}>MentalGame — Painel do Educador</p></div>
        </div>
        <div style={{display:"flex",gap:4}}>
          {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"8px 18px",borderRadius:"11px 11px 0 0",fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:12,cursor:"pointer",background:tab===t.id?"rgba(255,255,255,0.08)":"transparent",border:`1.5px solid ${tab===t.id?"rgba(255,255,255,0.15)":"transparent"}`,color:tab===t.id?"white":"rgba(255,255,255,0.4)",display:"flex",alignItems:"center",gap:5}}><span>{t.icon}</span><span>{t.label}</span></button>)}
        </div>
      </div>
      <div style={{flex:1,overflow:"hidden"}}>
        {tab==="games"&&<MiniGameTeacher/>}
        {tab==="perf"&&<PerformanceTab/>}
        {tab==="turma"&&<TurmaTab/>}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   LINK TO TEACHER  (student sidebar)
══════════════════════════════════════════════════════ */
function LinkToTeacher({profile,onProfileUpdate}){
  const [code,setCode]=useState("");const [linked,setLinked]=useState(!!profile.teacherCode);
  const doLink=()=>{
    const tc=code.trim().toUpperCase();const td=ls.get(SK_TC);
    if(!td||td.code!==tc){alert("Código inválido! Verifique se o professor está usando este mesmo dispositivo/navegador ou se o código foi digitado corretamente.");return;}
    const sid="stu_"+(profile.name||"a").replace(/\s/g,"").slice(0,8)+"_"+Date.now().toString(36);
    ls.set("mg:stu:"+sid,{name:profile.name,grade:profile.grade,age:profile.age,xp:profile.xp||0,uid:profile.uid});
    td.students=[...(td.students||[]),sid];saveTeacherData(td);
    const np={...profile,teacherCode:tc,studentSid:sid};onProfileUpdate(np);setLinked(true);
  };
  if(linked)return<div style={{padding:"9px 11px",background:"rgba(52,211,153,0.08)",border:"1px solid rgba(52,211,153,0.25)",borderRadius:11,margin:"8px 10px"}}><p style={{color:"#34D399",fontSize:11,fontWeight:700,margin:0}}>✅ Vinculado à turma {profile.teacherCode}</p></div>;
  return(
    <div style={{padding:"9px 11px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:11,margin:"8px 10px"}}>
      <p style={{color:"rgba(255,255,255,0.4)",fontSize:10,fontWeight:800,margin:"0 0 6px",letterSpacing:1,textTransform:"uppercase"}}>🔗 Vincular à Turma</p>
      <div style={{display:"flex",gap:5}}><input value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="Código do Prof" maxLength={8} style={{flex:1,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:8,padding:"5px 8px",color:"white",fontSize:12,outline:"none",fontWeight:700,letterSpacing:2}}/><button onClick={doLink} disabled={code.length<4} style={{padding:"5px 10px",background:G.cyan,border:"none",borderRadius:8,color:"white",fontSize:11,fontWeight:800,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>OK</button></div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN APP  (student)
══════════════════════════════════════════════════════ */
const MODES=[{id:"chat",label:"Tutor",icon:"🤖"},{id:"quiz",label:"Quiz",icon:"🎯"},{id:"summary",label:"Resumo",icon:"📝"},{id:"exercise",label:"Exercícios",icon:"✏️"},{id:"speech",label:"Pronúncia",icon:"🎙️"},{id:"challenge",label:"Desafio",icon:"⚔️"},{id:"game",label:"Mini-jogo",icon:"🕹️"},{id:"free",label:"Livre",icon:"💬"}];

/* Bottom nav modes for mobile (most used) */
const BOTTOM_MODES=[{id:"chat",icon:"🤖"},{id:"quiz",icon:"🎯"},{id:"speech",icon:"🎙️"},{id:"challenge",icon:"⚔️"},{id:"free",icon:"💬"}];

function MainApp({profile,onProfileUpdate,onEditAvatar,onChangeGrade,onLogout,showGuardianNow}){
  const isMobile=useIsMobile();
  const [mode,setMode]=useState("chat");const [topic,setTopic]=useState(null);const [mk,setMk]=useState(0);const [lang,setLang]=useState("mix");
  const [customInstruction,setCustomInstruction]=useState("");
  const [showGuardian,setShowGuardian]=useState(!!showGuardianNow);const [showHelp,setShowHelp]=useState(false);const [showDaily,setShowDaily]=useState(false);
  const [bubble,setBubble]=useState(null);const [waving,setWaving]=useState(false);const [dailyDone,setDailyDone]=useState(()=>getDailyData().done);
  const [sideOpen,setSideOpen]=useState(false); // mobile sidebar toggle
  const grade=profile.grade;const gObj=GRADES.find(g=>g.id===grade);const pInfo=GP[grade]||GP.ef6;const topics=TOPICS[grade]||[];
  const pwInfo=getPowerInfo(profile.xp||0);const power=getPower(profile.xp||0);const level=getLevel(profile.xp||0);
  const guardian=ls.get(SK_G)||{};const rewardReached=(profile.xp||0)>=(guardian.rewardTarget||200)&&guardian.reward;
  useEffect(()=>{if(!topic&&topics.length)setTopic(topics[0]);},[grade]);
  useEffect(()=>{
    const d=getDailyData();
    if(!d.done.includes("login")){markDailyTask("login");onProfileUpdate({...profile,xp:(profile.xp||0)+20});setTimeout(()=>{setShowDaily(true);setBubble("Bom dia! 🌅 +20 XP de login diário!");setWaving(true);setTimeout(()=>setWaving(false),2000);},800);}
  },[]);
  useEffect(()=>{if(!topic)return;const phrases=AVATAR_PHRASES.topics[topic.id]||AVATAR_PHRASES.greet;setTimeout(()=>setBubble(phrases[Math.floor(Math.random()*phrases.length)]),500);},[topic?.id]);
  const handleXP=useCallback((delta)=>{
    const n=Math.max(0,(profile.xp||0)+delta);onProfileUpdate({...profile,xp:n});
    if(delta>0){setBubble(AVATAR_PHRASES.correct[Math.floor(Math.random()*AVATAR_PHRASES.correct.length)]);setWaving(true);setTimeout(()=>setWaving(false),2000);}
    else if(delta<0)setBubble(AVATAR_PHRASES.wrong[Math.floor(Math.random()*AVATAR_PHRASES.wrong.length)]);
  },[profile,onProfileUpdate]);
  const handleDailyTask=(id)=>setDailyDone(d=>d.includes(id)?d:[...d,id]);
  const selTopic=(t)=>{setTopic(t);if(mode!=="free")setMk(k=>k+1);if(isMobile)setSideOpen(false);};
  const selMode=(m)=>{setMode(m);setMk(k=>k+1);const map={chat:"chat",quiz:"quiz",summary:"summary",exercise:"exercise",speech:"speech"};if(map[m]){markDailyTask(map[m]);handleDailyTask(map[m]);}};
  const avatarClick=()=>{const s=pwInfo.state;const pool=AVATAR_PHRASES[s]||AVATAR_PHRASES.greet;setBubble(pool[Math.floor(Math.random()*pool.length)]);setWaving(true);setTimeout(()=>setWaving(false),2000);};

  /* Sidebar content — shared between desktop and mobile drawer */
  const SidebarContent=()=>(
    <div style={{display:"flex",flexDirection:"column",height:"100%",overflowY:"auto"}}>
      {/* Brand */}
      <div style={{padding:"14px 13px 11px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:20,animation:"wiggle 3.5s ease-in-out infinite"}}>🎮</span>
          <div>
            <div style={{fontWeight:900,fontSize:14,background:G.rainbow,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundSize:"300%",animation:"rainbow 4s linear infinite"}}>MentalGame</div>
            <div style={{fontSize:10,fontWeight:800,background:pInfo.g,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{gObj?.full}</div>
          </div>
        </div>
        {isMobile&&<button onClick={()=>setSideOpen(false)} style={{background:"rgba(255,255,255,0.08)",border:"none",color:"rgba(255,255,255,0.6)",width:32,height:32,borderRadius:"50%",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>}
      </div>
      {/* Avatar */}
      <div style={{padding:"12px 10px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",flexDirection:"column",alignItems:"center",gap:6,background:`linear-gradient(180deg,${pInfo.c}18,transparent)`}}>
        {bubble&&<AvatarSpeechBubble message={bubble} pInfo={pInfo} onDismiss={()=>setBubble(null)}/>}
        <div className="avatar-sway" style={{position:"relative",cursor:"pointer"}} onClick={avatarClick} title="Clique para o avatar falar!">
          {waving&&<div style={{position:"absolute",top:"45%",right:"-12px",fontSize:20,animation:"armwave .4s ease-in-out 4",transformOrigin:"bottom center",zIndex:10}}>👋</div>}
          <AvatarSVG av={profile} xp={profile.xp||0} age={profile.age||12} size={isMobile?90:108}/>
          {(pwInfo.state==="weak"||pwInfo.state==="tired")&&<div style={{position:"absolute",top:4,right:4,width:17,height:17,background:"#EF4444",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,animation:"pulse 1.2s infinite",color:"white",fontWeight:900}}>!</div>}
          {rewardReached&&<div style={{position:"absolute",top:4,left:4,fontSize:17,animation:"heartbeat 1s ease-in-out infinite"}}>🎁</div>}
        </div>
        <div style={{textAlign:"center"}}>
          <div style={{color:"white",fontWeight:900,fontSize:14}}>{profile.name}</div>
          {profile.uid&&<div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.3)",marginTop:2}}>{profile.uid}</div>}
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:5,marginTop:3}}>
            <div style={{fontSize:10,fontWeight:800,background:pwInfo.g,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{pwInfo.label}</div>
            <button onClick={()=>setShowHelp(true)} style={{width:16,height:16,borderRadius:"50%",border:"1.5px solid rgba(255,255,255,0.25)",background:"rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.7)",fontSize:9,fontWeight:900,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,padding:0,fontFamily:"'Nunito',sans-serif"}}>?</button>
          </div>
        </div>
        <button onClick={()=>setShowDaily(true)} style={{width:"100%",padding:"6px 9px",borderRadius:11,cursor:"pointer",background:"linear-gradient(90deg,rgba(251,191,36,0.12),rgba(249,115,22,0.08))",border:"1.5px solid rgba(251,191,36,0.25)",color:"#FBBF24",fontSize:10,fontWeight:800,fontFamily:"'Nunito',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
          <span>🌅</span><span>Tarefas do Dia</span>{dailyDone.length>0&&<span style={{padding:"1px 6px",borderRadius:999,background:"rgba(251,191,36,0.25)",fontSize:9}}>{dailyDone.length}/{DAILY_TASKS.length}</span>}
        </button>
        <div style={{padding:"2px 12px",borderRadius:999,background:pInfo.g,boxShadow:`0 4px 14px ${pInfo.c}44`}}><span style={{color:"white",fontSize:10,fontWeight:900}}>⭐ Nível {level}</span></div>
        <div style={{width:"90%"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{color:"rgba(255,255,255,0.35)",fontSize:9,fontWeight:700}}>PODER</span><span style={{fontSize:9,fontWeight:800,background:pwInfo.g,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{power}%</span></div>
          <div style={{height:6,background:"rgba(255,255,255,0.07)",borderRadius:99,overflow:"hidden"}}><div style={{height:"100%",width:`${power}%`,background:pwInfo.g,borderRadius:99,transition:"width .6s",boxShadow:`0 0 10px ${pwInfo.c}88`}}/></div>
        </div>
        <div style={{color:"rgba(255,255,255,0.2)",fontSize:9,fontWeight:700}}>{profile.xp||0} XP total</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4,width:"100%"}}>
          {[["✏️ Avatar",onEditAvatar,pInfo.g],["🎓 Série",onChangeGrade,G.cyan],["👨‍👩‍👧 Resp.",()=>setShowGuardian(true),G.yellow],["🚪 Sair",onLogout,"linear-gradient(135deg,#374151,#1f2937)"]].map(([lb,fn,bg])=>(
            <button key={lb} onClick={fn} style={{padding:"5px 3px",background:"rgba(255,255,255,0.05)",border:"1.5px solid rgba(255,255,255,0.09)",borderRadius:9,color:"rgba(255,255,255,0.5)",fontSize:9,cursor:"pointer",fontFamily:"'Nunito',sans-serif",fontWeight:700,transition:"all .2s",minHeight:36}}
              onMouseEnter={e=>{e.currentTarget.style.background=bg;e.currentTarget.style.color="white";e.currentTarget.style.borderColor="transparent";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.05)";e.currentTarget.style.color="rgba(255,255,255,0.5)";e.currentTarget.style.borderColor="rgba(255,255,255,0.09)";}}>
              {lb}
            </button>
          ))}
        </div>
      </div>
      {/* Alerts */}
      {rewardReached&&<div style={{margin:"8px 10px",padding:"9px 11px",background:"rgba(251,191,36,0.1)",border:"1.5px solid rgba(251,191,36,0.3)",borderRadius:13,animation:"pulse 2s ease-in-out infinite"}}><p style={{color:"#FBBF24",fontSize:11,margin:0,lineHeight:1.5,fontWeight:800}}>🎁 {profile.name} ganhou: {guardian.reward}!</p></div>}
      {/* Modes — full list in sidebar */}
      <div style={{padding:"9px 7px 5px"}}>
        <div style={{fontSize:9,fontWeight:800,letterSpacing:1.5,textTransform:"uppercase",margin:"0 5px 7px",background:pInfo.g,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Modos</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,marginBottom:10}}>
          {MODES.map(m=>{const active=mode===m.id;return(
            <button key={m.id} onClick={()=>{selMode(m.id);if(isMobile)setSideOpen(false);}}
              style={{padding:"7px 6px",borderRadius:10,background:active?pInfo.g:"rgba(255,255,255,0.05)",border:`1.5px solid ${active?"transparent":"rgba(255,255,255,0.08)"}`,color:"white",fontSize:11,fontFamily:"'Nunito',sans-serif",fontWeight:active?800:600,cursor:"pointer",display:"flex",alignItems:"center",gap:5,transition:"all .15s",minHeight:36}}>
              <span>{m.icon}</span><span style={{fontSize:10}}>{m.label}</span>
            </button>
          );})}
        </div>
      </div>
      {/* Topics */}
      <div style={{padding:"0 7px 14px",flex:1}}>
        <div style={{fontSize:9,fontWeight:800,letterSpacing:1.5,textTransform:"uppercase",margin:"0 5px 7px",background:pInfo.g,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Tópicos</div>
        {topics.map(t=>{
          const active=topic?.id===t.id;
          return(<button key={t.id} onClick={()=>selTopic(t)} style={{width:"100%",padding:"7px 9px",borderRadius:10,cursor:"pointer",marginBottom:2,background:active?`${pInfo.c}22`:"transparent",border:`1.5px solid ${active?pInfo.c:"transparent"}`,color:active?"white":"rgba(255,255,255,0.45)",fontSize:12,textAlign:"left",display:"flex",alignItems:"center",gap:7,fontFamily:"'Nunito',sans-serif",fontWeight:active?800:600,transition:"all .15s",minHeight:40}}
            onMouseEnter={e=>{if(!active){e.currentTarget.style.background="rgba(255,255,255,0.05)";e.currentTarget.style.color="white";}}}
            onMouseLeave={e=>{if(!active){e.currentTarget.style.background="transparent";e.currentTarget.style.color="rgba(255,255,255,0.45)";}}}
          ><span>{t.emoji}</span><span style={{lineHeight:1.3,fontSize:isMobile?13:12}}>{t.label}</span></button>);
        })}
      </div>
      <LinkToTeacher profile={profile} onProfileUpdate={onProfileUpdate}/>
    </div>
  );

  return(
    <div style={{height:"100dvh",display:"flex",flexDirection:"column",overflow:"hidden",background:G.bg}}>
      {showGuardian&&<GuardianPortal profile={profile} onClose={()=>setShowGuardian(false)}/>}
      {showHelp&&<AvatarHelpModal pwInfo={pwInfo} power={power} level={level} onClose={()=>setShowHelp(false)}/>}
      {showDaily&&<DailyTasksModal profile={profile} onClose={()=>setShowDaily(false)} onXP={handleXP} onTaskDone={handleDailyTask}/>}

      {/* Mobile sidebar overlay */}
      {isMobile&&(
        <>
          <div className={`sidebar-overlay${sideOpen?" show":""}`} onClick={()=>setSideOpen(false)}/>
          <div style={{position:"fixed",top:0,left:0,bottom:0,width:280,zIndex:200,
            background:"rgba(8,4,24,0.98)",backdropFilter:"blur(22px)",WebkitBackdropFilter:"blur(22px)",
            borderRight:"1px solid rgba(255,255,255,0.1)",
            transform:sideOpen?"translateX(0)":"translateX(-100%)",transition:"transform .28s ease",overflowY:"auto"}}>
            <SidebarContent/>
          </div>
        </>
      )}

      {/* Main layout row */}
      <div style={{flex:1,display:"flex",overflow:"hidden"}}>
        {/* Desktop sidebar */}
        {!isMobile&&(
          <div style={{width:228,display:"flex",flexDirection:"column",flexShrink:0,overflowY:"auto",background:"rgba(8,4,24,0.65)",backdropFilter:"blur(22px)",WebkitBackdropFilter:"blur(22px)",borderRight:"1px solid rgba(255,255,255,0.07)"}}>
            <SidebarContent/>
          </div>
        )}

        {/* Content area */}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>
          {/* Top bar */}
          <div style={{padding:isMobile?"8px 12px":"10px 20px",borderBottom:"1px solid rgba(255,255,255,0.07)",display:"flex",alignItems:"center",gap:isMobile?8:12,background:"rgba(0,0,0,0.3)",backdropFilter:"blur(22px)",WebkitBackdropFilter:"blur(22px)",flexShrink:0}}>
            {/* Hamburger on mobile */}
            {isMobile&&(
              <button onClick={()=>setSideOpen(true)} style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,width:38,height:38,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,cursor:"pointer",flexShrink:0}}>
                {[0,1,2].map(i=><div key={i} style={{width:16,height:2,background:"white",borderRadius:99}}/>)}
              </button>
            )}
            <div style={{minWidth:0,flex:1}}>
              <div style={{fontWeight:800,fontSize:isMobile?12:13,color:"white",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                {mode==="free"?"💬 Livre":`${topic?.emoji||""} ${topic?.label||"Tópico"}`}
              </div>
              {!isMobile&&<div style={{fontSize:10,fontWeight:700,background:pInfo.g,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{gObj?.full}</div>}
            </div>
            <LangToggle lang={lang} setLang={setLang} pInfo={pInfo}/>
            {/* Mode tabs — desktop only in top bar, mobile uses bottom nav */}
            {!isMobile&&(
              <div className="mode-tabs" style={{marginLeft:"auto"}}>
                {MODES.map(m=>{const active=mode===m.id;return(
                  <button key={m.id} onClick={()=>selMode(m.id)} style={{padding:"5px 11px",borderRadius:999,fontFamily:"'Nunito',sans-serif",fontWeight:800,fontSize:11,cursor:"pointer",background:active?pInfo.g:"rgba(255,255,255,0.05)",border:`1.5px solid ${active?"transparent":"rgba(255,255,255,0.09)"}`,color:"white",transition:"all .15s",display:"flex",alignItems:"center",gap:4,whiteSpace:"nowrap",minHeight:32}}>
                    <span>{m.icon}</span><span>{m.label}</span>
                  </button>
                );})}
              </div>
            )}
          </div>

          {/* Main content */}
          <div style={{flex:1,overflow:"hidden",paddingBottom:isMobile?56:0}}>
            {mode==="free"?<ChatMode key={`free-${grade}-${mk}`} topic={null} grade={grade} pInfo={pInfo} lang={lang} isFree/>:
            mode==="speech"?<SpeechMode key={`sp-${grade}-${mk}`} grade={grade} pInfo={pInfo} lang={lang}/>:
            mode==="challenge"?<ChallengeMode key={`ch-${grade}-${topic?.id||""}-${mk}`} topic={topic} grade={grade} pInfo={pInfo} lang={lang} profile={profile}/>:
            mode==="game"?<MiniGameStudent key={`gm-${mk}`} playerName={profile.name} pInfo={pInfo}/>:
            !topic?<EmptyStart icon="👈" title="Escolha um tópico!" desc="Abra o menu lateral e selecione um tópico." pInfo={pInfo}/>:
            mode==="chat"?<ChatMode key={`c-${grade}-${topic.id}-${mk}`} topic={topic} grade={grade} pInfo={pInfo} lang={lang}/>:
            mode==="quiz"?<QuizMode key={`q-${grade}-${topic.id}-${mk}`} topic={topic} grade={grade} pInfo={pInfo} lang={lang} onXP={handleXP}/>:
            mode==="summary"?<SummaryMode key={`s-${grade}-${topic.id}-${mk}`} topic={topic} grade={grade} pInfo={pInfo} lang={lang} onXP={handleXP}/>:
            <ExerciseMode key={`e-${grade}-${topic.id}-${mk}`} topic={topic} grade={grade} pInfo={pInfo} lang={lang} onXP={handleXP}/>}
          </div>

          {/* Mobile bottom navigation */}
          {isMobile&&(
            <div style={{position:"fixed",bottom:0,left:0,right:0,height:56,background:"rgba(8,4,24,0.97)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderTop:"1px solid rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"space-around",zIndex:100,paddingBottom:"env(safe-area-inset-bottom,0px)"}}>
              {/* Menu button */}
              <button onClick={()=>setSideOpen(true)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,background:"none",border:"none",cursor:"pointer",padding:"6px 8px",borderRadius:10,flex:1,minHeight:44}}>
                <span style={{fontSize:18}}>☰</span>
                <span style={{fontSize:9,color:"rgba(255,255,255,0.5)",fontWeight:700,fontFamily:"'Nunito',sans-serif"}}>Menu</span>
              </button>
              {/* Quick mode buttons */}
              {BOTTOM_MODES.map(m=>{const active=mode===m.id;return(
                <button key={m.id} onClick={()=>selMode(m.id)}
                  style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,background:active?`${pInfo.c}22`:"none",border:"none",cursor:"pointer",padding:"6px 8px",borderRadius:10,flex:1,minHeight:44,transition:"background .2s"}}>
                  <span style={{fontSize:18}}>{m.icon}</span>
                  <span style={{fontSize:9,color:active?pInfo.c:"rgba(255,255,255,0.45)",fontWeight:active?800:600,fontFamily:"'Nunito',sans-serif"}}>{MODES.find(x=>x.id===m.id)?.label}</span>
                </button>
              );})}
              {/* XP badge */}
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"6px 8px",flex:1}}>
                <span style={{fontSize:14,fontWeight:900,background:pInfo.g,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>⭐{level}</span>
                <span style={{fontSize:9,color:"rgba(255,255,255,0.4)",fontWeight:600,fontFamily:"'Nunito',sans-serif"}}>{profile.xp||0}xp</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   ERROR BOUNDARY
══════════════════════════════════════════════════════ */
class ErrorBoundary extends React.Component{
  constructor(p){super(p);this.state={err:null};}
  static getDerivedStateFromError(e){return{err:e};}
  render(){
    if(this.state.err)return(
      <div style={{height:"100vh",background:"#0a0020",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14,padding:32,fontFamily:"'Nunito',sans-serif"}}>
        <div style={{fontSize:46}}>⚠️</div>
        <h2 style={{color:"white",fontWeight:900,fontSize:18,margin:0}}>Algo deu errado</h2>
        <p style={{color:"rgba(255,255,255,0.5)",fontSize:13,textAlign:"center",maxWidth:400,lineHeight:1.6}}>{String(this.state.err?.message||this.state.err)}</p>
        <button onClick={()=>{localStorage.clear();window.location.reload();}} style={{padding:"11px 26px",background:"linear-gradient(135deg,#6366f1,#a855f7)",border:"none",borderRadius:12,color:"white",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>🔄 Limpar e Recarregar</button>
        <button onClick={()=>window.location.reload()} style={{padding:"7px 18px",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:12,color:"rgba(255,255,255,0.6)",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Nunito',sans-serif"}}>↺ Recarregar</button>
      </div>
    );
    return this.props.children;
  }
}

/* ══════════════════════════════════════════════════════
   ROOT APP
══════════════════════════════════════════════════════ */
function App(){
  useEffect(()=>{

  const style = document.createElement("style");

  style.innerHTML = `

  @keyframes floatingIcons {

    0%{
      transform:translateY(0px) rotate(0deg);
    }

    50%{
      transform:translateY(-18px) rotate(8deg);
    }

    100%{
      transform:translateY(0px) rotate(0deg);
    }

  }
   @keyframes floatX{
0%{
transform:translateX(0px) translateY(0px) rotate(0deg);
}
25%{
transform:translateX(12px) translateY(-10px) rotate(6deg);
}
50%{
transform:translateX(-8px) translateY(-20px) rotate(-6deg);
}
75%{
transform:translateX(10px) translateY(-8px) rotate(4deg);
}
100%{
transform:translateX(0px) translateY(0px) rotate(0deg);
}
}

@keyframes floatY{
0%{
transform:translateY(0px) translateX(0px) scale(1);
}
25%{
transform:translateY(-12px) translateX(8px) scale(1.08);
}
50%{
transform:translateY(-22px) translateX(-10px) scale(1);
}
75%{
transform:translateY(-10px) translateX(6px) scale(1.06);
}
100%{
transform:translateY(0px) translateX(0px) scale(1);
}
} 

  `;

  document.head.appendChild(style);

},[]);
  const [screen,setScreen]=useState("loading");
  const [history,setHistory]=useState([]);
  const [profile,setProfile]=useState(null);
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [showPassword,setShowPassword]=useState(false);
  const [userType,setUserType]=useState(null);
  const [pendingGrade,setPendingGrade]=useState(null);
  const [editing,setEditing]=useState(false);
  const registerUser = async () => {

    if(!email.includes("@")){
  alert("Digite um email válido!");
  return;
}

if(password.length < 6){
  alert("A senha precisa ter pelo menos 6 caracteres!");
  return;
}

  try {
    

    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    const user = userCredential.user;

    const starterProfile = {
      name: "Aluno",
      xp: 0,
      avatar: "⚔️",
      grade: "ef6",
      userType: "student"
    };

    await setDoc(
      doc(db, "users", user.uid),
      starterProfile
    );

    setProfile(starterProfile);

    alert("Conta criada com sucesso!");

    setScreen("grade-select");

  } catch (error) {

    console.error(error);

    alert(error.message);
  }
};
const loginUser = async () => {
  try {

    const userCredential =
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

    const user = userCredential.user;

    const docRef = doc(db, "users", user.uid);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {

        console.log("USER DATA:", docSnap.data());

      const userData = docSnap.data();

      setProfile(userData);

      setUserType(userData.userType || "student");

      setScreen("main");

    }

  } catch (error) {

    console.error(error);

    alert(error.message);
  }
};
  const go=(s)=>{setHistory(h=>[...h,screen]);setScreen(s);};
  const goBack=()=>{setHistory(h=>{if(!h.length)return h;const prev=h[h.length-1];setScreen(prev);return h.slice(0,-1);});};
  useEffect(()=>{
    setTimeout(()=>{
  setScreen("auth");
},500);
  },[]);
  const onUserType=(t)=>{setUserType(t);if(t==="teacher"){go("teacher");return;}if(t==="guardian"){const p=ls.get(SK_P);if(p?.grade&&p?.name){setProfile(p);setScreen("main");}else go("grade-select");return;}go("grade-select");
return;const prof=ls.get(SK_P);if(prof?.grade&&prof?.name){setProfile(prof);setScreen("main");setHistory([]);}else go("grade-select");};
  const onGrade=(g)=>{setPendingGrade(g.id);go("avatar-create");};
  const onAvSave=(av)=>{const base=profile||{};const np={...base,...av,grade:pendingGrade||base.grade,xp:base.xp||0,userType};setProfile(np);ls.set(SK_P,np);setEditing(false);setScreen("main");setHistory([]);};
  const onUpdate=(p)=>{setProfile(p);ls.set(SK_P,p);};
  const onEditAv=()=>{setPendingGrade(profile.grade);setEditing(true);go("avatar-create");};
  if(screen==="auth")return(
<div style={{
height:"100vh",
display:"flex",
flexDirection:"column",
justifyContent:"center",
alignItems:"center",
gap:12,
background:"linear-gradient(135deg,#0f172a,#111827,#1e293b)",
padding:20,
overflow:"hidden",
position:"isolate"
}}>

{/* Background floating icons */}

<div style={{
position:"absolute",
top:"6%",
left:"30%",
fontSize:36,
opacity:1,
animation:"floatX 5s ease-in-out infinite"
}}>
🎧
</div>

<div style={{
position:"absolute",
top:"12%",
right:"30%",
fontSize:34,
opacity:1,
animation:"floatY 6s ease-in-out infinite"
}}>
🧪
</div>

<div style={{
position:"absolute",
top:"32%",
left:"18%",
fontSize:40,
opacity:1,
animation:"floatX 7s ease-in-out infinite"
}}>
🎯
</div>

<div style={{
position:"absolute",
top:"38%",
right:"20%",
fontSize:42,
opacity:1,
animation:"floatY 8s ease-in-out infinite"
}}>
🚀
</div>

<div style={{
position:"absolute",
bottom:"30%",
left:"8%",
fontSize:38,
opacity:1,
animation:"floatX 6s ease-in-out infinite"
}}>
🧩
</div>

<div style={{
position:"absolute",
bottom:"26%",
right:"10%",
fontSize:36,
opacity:1,
animation:"floatY 7s ease-in-out infinite"
}}>
🎲
</div>

<div style={{
position:"absolute",
top:"70%",
left:"35%",
fontSize:34,
opacity:1,
animation:"floatX 8s ease-in-out infinite"
}}>
📖
</div>

<div style={{
position:"absolute",
top:"75%",
right:"32%",
fontSize:40,
opacity:1,
animation:"floatY 5s ease-in-out infinite"
}}>
🏆
</div>

<div style={{
position:"absolute",
top:"80%",
left:"47%",
fontSize:30,
opacity:1,
animation:"floatX 4s ease-in-out infinite"
}}>
⭐
</div>

<div style={{
position:"absolute",
top:"25%",
left:"50%",
fontSize:32,
opacity:1,
animation:"floatY 9s ease-in-out infinite"
}}>
🎨
</div>

<div style={{
position:"absolute",
top:"8%",
left:"10%",
fontSize:42,
opacity:1,
animation:"float 6s ease-in-out infinite",
animationDelay:"0s"
}}>
📚
</div>

<div style={{
position:"absolute",
top:"20%",
right:"12%",
fontSize:38,
opacity:1,
animation:"float 7s ease-in-out infinite",
animationDelay:"1s"
}}>
🎮
</div>

<div style={{
position:"absolute",
bottom:"18%",
left:"15%",
fontSize:40,
opacity:1,
animation:"float 8s ease-in-out infinite",
animationDelay:"2s"
}}>
🧠
</div>

<div style={{
position:"absolute",
bottom:"12%",
right:"18%",
fontSize:36,
opacity:1,
animation:"float 9s ease-in-out infinite",
animationDelay:"3s"
}}>
✏️
</div>

<div style={{
position:"absolute",
top:"45%",
left:"5%",
fontSize:34,
opacity:1,
animation:"float 10s ease-in-out infinite",
animationDelay:"4s"
}}>
💡
</div>

<div style={{
position:"absolute",
top:"55%",
right:"6%",
fontSize:32,
opacity:1,
animation:"float 11s ease-in-out infinite",
animationDelay:"5s"
}}>
🕹️
</div>

<h1 style={{
fontSize:46,
fontWeight:"900",
background:"linear-gradient(135deg,#8b5cf6,#06b6d4)",
WebkitBackgroundClip:"text",
WebkitTextFillColor:"transparent",
marginBottom:6,
textShadow:"0 0 30px rgba(139,92,246,0.35)"
}}>
MentalGame
</h1>


<div style={{display:"flex",flexDirection:"column",gap:6}}>
<label style={{color:"white",fontWeight:"700"}}>
Email
</label>

<input
type="email"
value={email}
onChange={e=>setEmail(e.target.value)}
style={{
padding:14,
width:320,
borderRadius:16,
border:"1px solid rgba(255,255,255,0.1)",
outline:"none",
fontSize:16,
background:"rgba(255,255,255,0.08)",
backdropFilter:"blur(8px)",
color:"white",
transition:"all .25s ease",
boxShadow:"0 0 0 rgba(139,92,246,0)"
}}

onMouseEnter={e=>{
e.target.style.transform="translateY(-3px) scale(1.02)";
e.target.style.border="1px solid rgba(139,92,246,0.8)";
e.target.style.boxShadow="0 0 25px rgba(139,92,246,0.45)";
e.target.style.background="rgba(255,255,255,0.12)";
}}

onMouseLeave={e=>{
e.target.style.transform="translateY(0px) scale(1)";
e.target.style.border="1px solid rgba(255,255,255,0.1)";
e.target.style.boxShadow="0 0 0 rgba(139,92,246,0)";
e.target.style.background="rgba(255,255,255,0.08)";
}}

onFocus={e=>{
e.target.style.transform="translateY(-3px) scale(1.02)";
e.target.style.border="1px solid #8b5cf6";
e.target.style.boxShadow="0 0 30px rgba(139,92,246,0.55)";
}}

onBlur={e=>{
e.target.style.transform="translateY(0px) scale(1)";
e.target.style.border="1px solid rgba(255,255,255,0.1)";
e.target.style.boxShadow="0 0 0 rgba(139,92,246,0)";
}}
/>
</div>

<div style={{display:"flex",flexDirection:"column",gap:6}}>

  <label style={{color:"white",fontWeight:"700"}}>
    Senha
  </label>

  <div style={{position:"relative"}}>

    <input
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={e=>setPassword(e.target.value)}
      minLength={6}
      style={{
padding:14,
width:320,
borderRadius:16,
border:"1px solid rgba(255,255,255,0.1)",
outline:"none",
fontSize:16,
background:"rgba(255,255,255,0.08)",
backdropFilter:"blur(8px)",
color:"white",
transition:"all .25s ease",
boxShadow:"0 0 0 rgba(139,92,246,0)"
}}

onMouseEnter={e=>{
e.target.style.transform="translateY(-3px) scale(1.02)";
e.target.style.border="1px solid rgba(139,92,246,0.8)";
e.target.style.boxShadow="0 0 25px rgba(139,92,246,0.45)";
e.target.style.background="rgba(255,255,255,0.12)";
}}

onMouseLeave={e=>{
e.target.style.transform="translateY(0px) scale(1)";
e.target.style.border="1px solid rgba(255,255,255,0.1)";
e.target.style.boxShadow="0 0 0 rgba(139,92,246,0)";
e.target.style.background="rgba(255,255,255,0.08)";
}}

onFocus={e=>{
e.target.style.transform="translateY(-3px) scale(1.02)";
e.target.style.border="1px solid #8b5cf6";
e.target.style.boxShadow="0 0 30px rgba(139,92,246,0.55)";
}}

onBlur={e=>{
e.target.style.transform="translateY(0px) scale(1)";
e.target.style.border="1px solid rgba(255,255,255,0.1)";
e.target.style.boxShadow="0 0 0 rgba(139,92,246,0)";
}}
    />

    <button
      type="button"
      onClick={()=>setShowPassword(s=>!s)}
      style={{
        position:"absolute",
        right:12,
        top:"50%",
        transform:"translateY(-50%)",
        background:"transparent",
        border:"none",
        cursor:"pointer",
        fontSize:18
      }}
    >
      {showPassword ? "🙈" : "👁️"}
    </button>

  </div>

</div>

<button
onClick={registerUser}

style={{
padding:14,
width:320,
borderRadius:16,
border:"none",
fontWeight:"900",
cursor:"pointer",
fontSize:16,
background:"linear-gradient(135deg,#8b5cf6,#06b6d4)",
color:"white",
transition:"all .25s ease",
boxShadow:"0 10px 25px rgba(139,92,246,0.35)"
}}

onMouseEnter={e=>{
e.currentTarget.style.transform="translateY(-4px) scale(1.03)";
e.currentTarget.style.boxShadow="0 18px 35px rgba(139,92,246,0.55)";
e.currentTarget.style.filter="brightness(1.08)";
}}

onMouseLeave={e=>{
e.currentTarget.style.transform="translateY(0px) scale(1)";
e.currentTarget.style.boxShadow="0 10px 25px rgba(139,92,246,0.35)";
e.currentTarget.style.filter="brightness(1)";
}}

onMouseDown={e=>{
e.currentTarget.style.transform="scale(0.97)";
}}

onMouseUp={e=>{
e.currentTarget.style.transform="translateY(-4px) scale(1.03)";
}}
>
✨ Criar Conta
</button>

<button
onClick={loginUser}

style={{
padding:14,
width:320,
borderRadius:16,
border:"none",
fontWeight:"900",
cursor:"pointer",
fontSize:16,
background:"linear-gradient(135deg,#22c55e,#06b6d4)",
color:"white",
transition:"all .25s ease",
boxShadow:"0 10px 25px rgba(34,197,94,0.35)"
}}

onMouseEnter={e=>{
e.currentTarget.style.transform="translateY(-4px) scale(1.03)";
e.currentTarget.style.boxShadow="0 18px 35px rgba(34,197,94,0.55)";
e.currentTarget.style.filter="brightness(1.08)";
}}

onMouseLeave={e=>{
e.currentTarget.style.transform="translateY(0px) scale(1)";
e.currentTarget.style.boxShadow="0 10px 25px rgba(34,197,94,0.35)";
e.currentTarget.style.filter="brightness(1)";
}}

onMouseDown={e=>{
e.currentTarget.style.transform="scale(0.97)";
}}

onMouseUp={e=>{
e.currentTarget.style.transform="translateY(-4px) scale(1.03)";
}}
>
🚀 Entrar
</button>


</div>
);

  if(screen==="loading")return<div style={{height:"100vh",background:G.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14}}><div style={{fontSize:44,animation:"wiggle 1s ease-in-out infinite"}}>🎮</div><div style={{width:40,height:40,borderRadius:"50%",background:G.rainbow,animation:"spin .9s linear infinite",opacity:.85}}/><p style={{color:"rgba(255,255,255,0.35)",fontSize:13,fontWeight:700,fontFamily:"'Nunito',sans-serif"}}>Carregando MentalGame...</p></div>;
  if(screen==="user-type")return<UserTypeSelect onSelect={onUserType}/>;
  if(screen==="teacher")return<TeacherPortal onBack={goBack}/>;
  if(screen==="grade-select")return<GradeSelect onSelect={onGrade} onBack={goBack}/>;
  if(screen==="avatar-create")return<AvatarCreate grade={pendingGrade||profile?.grade} initial={editing?profile:null} onSave={onAvSave} onBack={goBack}/>;
  if(screen==="main")return<MainApp profile={profile} onProfileUpdate={onUpdate} onEditAvatar={onEditAv} onChangeGrade={()=>go("grade-select")} onLogout={()=>{setScreen("user-type");setHistory([]);}} showGuardianNow={userType==="guardian"}/>;  return<UserTypeSelect onSelect={onUserType}/>;
}

ReactDOM.createRoot(document.getElementById("root")).render(<ErrorBoundary><App/></ErrorBoundary>);