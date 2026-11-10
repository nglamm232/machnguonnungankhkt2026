const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const data = window.SITE_CONTENT;
let currentLesson = 0;
let currentActivity = "vocab";
let flashDeck = [];
let flashIndex = 0;
let audioCtx;
let showVietnamese = false;
const activityOrder=["vocab","dialogue","truefalse","quiz","matching","arrange","writing"];
const activityNames={vocab:"Từ vựng",dialogue:"Đọc hội thoại",truefalse:"Đúng / Sai",quiz:"Trắc nghiệm",matching:"Ghép nối từ",arrange:"Sắp xếp câu",writing:"Viết lại câu"};
function nextActivityButton(){const i=activityOrder.indexOf(currentActivity);if(i<activityOrder.length-1)return `<button type="button" class="button button-dark next-activity" id="nextActivity">Hoàn thành · Sang ${activityNames[activityOrder[i+1]]} →</button>`;return `<button type="button" class="button button-dark next-activity" id="nextLesson">Hoàn thành bài học · Sang bài tiếp theo →</button>`;}
function bindNextButton(){const n=$("#nextActivity");if(n)n.addEventListener("click",()=>{currentActivity=activityOrder[activityOrder.indexOf(currentActivity)+1];renderActivity();tone("next");});const l=$("#nextLesson");if(l)l.addEventListener("click",()=>{selectLesson((currentLesson+1)%data.lessons.length);tone("next");});}

function tone(kind="good"){
  try{
    audioCtx ||= new (window.AudioContext||window.webkitAudioContext)();
    const osc=audioCtx.createOscillator(), gain=audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.type="sine"; osc.frequency.value=kind==="good"?660:kind==="bad"?190:kind==="flip"?480:kind==="next"?560:360;
    gain.gain.setValueAtTime(.0001,audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(.12,audioCtx.currentTime+.015);
    gain.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.19);
    osc.start(); osc.stop(audioCtx.currentTime+.2);
  }catch(e){}
}
function escapeHTML(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
const pageAliases={home:"home",introduction:"home",software:"software",flashcards:"flashcards", "book-learning":"library", "book-guide":"library", "book-culture":"library", folk:"folk", heritage:"heritage", museum:"museum"};
function showPage(page, updateHash=true){
  const valid=[...new Set($$(".page-section").map(s=>s.dataset.page))];
  if(!valid.includes(page)) page="home";
  $$(".page-section").forEach(section=>section.classList.toggle("page-hidden",section.dataset.page!==page));
  document.body.dataset.activePage=page;
  if(updateHash){const hash=page==="home"?"#home":({software:"#software",flashcards:"#flashcards",library:"#book-learning",folk:"#folk",heritage:"#heritage",museum:"#museum"}[page]||"#home");history.replaceState(null,"",hash);}
  window.scrollTo({top:0,behavior:"smooth"});
  $("#mainNav").classList.remove("open");
  $$(".nav-group").forEach(g=>{g.classList.remove("open");const b=$(".nav-trigger",g);if(b)b.setAttribute("aria-expanded","false");});
}
function setupNav(){
  $("#menuToggle").addEventListener("click",()=>{const open=$("#mainNav").classList.toggle("open");$("#menuToggle").setAttribute("aria-expanded",open);});
  $$(".nav-trigger").forEach(btn=>btn.addEventListener("click",()=>{const group=btn.closest(".nav-group");const open=group.classList.toggle("open");btn.setAttribute("aria-expanded",open);}));
  $$('a[href^="#"]').forEach(a=>a.addEventListener("click",e=>{
    const id=a.getAttribute("href").slice(1);if(!id)return;
    const bookKey=({"book-learning":"learning","book-guide":"guide","book-culture":"culture"})[id];
    if(bookKey && data.books?.[bookKey]){e.preventDefault();window.open(data.books[bookKey],"_blank","noopener,noreferrer");return;}
    const target=document.getElementById(id);if(!target)return;
    e.preventDefault();const section=target.matches(".page-section")?target:target.closest(".page-section");
    showPage(section?.dataset.page||pageAliases[id]||"home");
  }));
  const initial=(location.hash||"#home").slice(1);const target=document.getElementById(initial);const section=target?.matches(".page-section")?target:target?.closest(".page-section");
  showPage(section?.dataset.page||pageAliases[initial]||"home",false);
}
function renderLessons(){
  $("#lessonList").innerHTML=data.lessons.map((l,i)=>`<button class="lesson-choice ${i===0?"active":""}" data-index="${i}"><span>${String(i+1).padStart(2,"0")}</span>${escapeHTML(l.title)}</button>`).join("");
  $("#flashLesson").innerHTML='<option value="all">Trộn tất cả các bài</option>'+data.lessons.map((l,i)=>`<option value="${l.id}">${escapeHTML(l.title)}</option>`).join("");
  $$(".lesson-choice").forEach(b=>b.addEventListener("click",()=>selectLesson(Number(b.dataset.index))));
  selectLesson(0);
}
function selectLesson(index){
  currentLesson=index;const l=data.lessons[index];
  $$(".lesson-choice").forEach((b,i)=>b.classList.toggle("active",i===index));
  $("#lessonKicker").textContent=`BÀI HỌC ${String(l.id).padStart(2,"0")}`;
  $("#lessonTitle").textContent=l.title;$("#lessonDescription").textContent=l.description;
  currentActivity="vocab";$$(".activity-tab").forEach(b=>b.classList.toggle("active",b.dataset.activity==="vocab"));
  renderActivity();tone("next");
}
const knownAudioFiles = [
  "Ché.mp3",
  "Chào.mp3",
  "Cham ron.mp3",
  "Cậy tạo.mp3",
  "Cậư cáng.mp3",
  "Căn truyền thống.mp3",
  "cáng có.mp3",
  "càng có.mp3",
  "Cạm ơn.mp3",
  "Bợt giụ.mp3",
  "bạn bè.mp3",
  "Bám.mp3",
  "Ại.mp3",
  "Lán pòn.mp3",
  "Lan nọi.mp3",
  "làn điệu dân gian.mp3",
  "Kìu.mp3",
  "Hùn ràn.mp3",
  "Họ.mp3",
  "hẹn nhàng.mp3",
  "hắn nắng ngọ slắc.mp3",
  "Hai.mp3",
  "giữ gìn.mp3",
  "Giụ.mp3",
  "giạ.mp3",
  "Đưn.mp3",
  "Đò tén.mp3",
  "Đáy bấu.mp3",
  "Dậu lậự.mp3",
  "Cuối tuần.mp3",
  "Cúc quen.mp3",
  "Cúc quà.mp3",
  "Cúc bặng mầư.mp3",
  "Chợ thin quậy.mp3",
  "Pớc bợng slúi.mp3",
  "Phong tục.mp3",
  "Phăng đăm.mp3",
  "Phắc đong.mp3",
  "Pẹc phầy.mp3",
  "Pây.mp3",
  "Pây ron.mp3",
  "Pây dầu.mp3",
  "Pây cúc sằm.mp3",
  "Pan.mp3",
  "Pa khúi.mp3",
  "Núng slai.mp3",
  "Nòng.mp3",
  "Nó mâu bán.mp3",
  "Ngòn.mp3",
  "Ngòn slầy.mp3",
  "Món câu.mp3",
  "Mình.mp3",
  "Mạnh rềng.mp3",
  "Lớp tọoc slâư.mp3",
  "Lễ hội.mp3",
  "Lay.mp3",
  "Xe đạp.mp3",
  "văn hoá.mp3",
  "Tuần.mp3",
  "Tù sọi.mp3",
  "tù sày.mp3",
  "Truyền thống.mp3",
  "Trò chơi dân gian.mp3",
  "Ton hắn.mp3",
  "Tiếp hẹc.mp3",
  "Tê, kẹ.mp3",
  "Số kẹ.mp3",
  "Sinh hoạt.mp3",
  "sấư.mp3",
  "Rạng bếp.mp3",
  "Ràn2.mp3",
  "Ràn.mp3",
  "Ràn văn hoá.mp3",
  "Ràn tường.mp3",
  "Ràn rậu.mp3",
  "Ràn cạc.mp3",
  "Quê hương.mp3",
  "Pú vạ.mp3"
];
function normAudioName(value){
  return String(value||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[đĐ]/g,"d").toLowerCase().replace(/[^a-z0-9]+/g,"");
}
const audioAliases = {
  "lop hoc": "Lớp tọoc slâư.mp3",
  "odau": "Dậu lậự.mp3",
  "khoemanh": "Mạnh rềng.mp3",
  "lamquen": "Cúc quen.mp3",
  "camon": "Cạm ơn.mp3",
  "giupdo": "Tù sọi.mp3",
  "ongba": "Tê, kẹ.mp3",
  "ten": "Mình.mp3",
  "tuoi": "Pây.mp3",
  "nha": "Ràn.mp3",
  "giadinh": "Ràn rậu.mp3",
  "banbe": "bạn bè.mp3",
  "sothich": "Ại.mp3",
  "quehuong": "Bám.mp3",
  "truonghoc": "Ràn tường.mp3",
  "ong": "Tê, kẹ.mp3",
  "che": "Ché.mp3",
  "emtrai": "Núng slai.mp3",
  "nguoithan": "Hùn ràn.mp3",
  "chaunoi": "Lan nọi.mp3",
  "thehe": "Pan.mp3",
  "kyuc": "Cậy tạo.mp3",
  "giaotiep": "cáng có.mp3",
  "trochuyen": "càng có.mp3",
  "cuoituan": "Đáy bấu.mp3",
  "lehoi": "Lễ hội.mp3",
  "vanhoa": "văn hoá.mp3",
  "trochoidangian": "Pây cúc sằm.mp3",
  "trangphuc": "Đò tén.mp3",
  "hengap": "hẹn nhàng.mp3",
  "thoigian": "Ngòn slầy.mp3",
  "sodem": "Số kẹ.mp3",
  "ngay": "Ngòn.mp3",
  "tuan": "Tuần.mp3",
  "thang": "Đưn.mp3",
  "nam": "Pây.mp3",
  "chodquy": "Chợ thin quậy.mp3",
  "phattrien": "Lán pòn.mp3",
  "banhchungden": "Phăng đăm.mp3",
  "xoingusac": "hắn nắng ngọ slắc.mp3",
  "casuoi": "Pa khúi.mp3",
  "mang": "Nòng.mp3",
  "raurung": "Phắc đong.mp3",
  "thitlonban": "Nó mâu bán.mp3",
  "buacom": "Ton hắn.mp3",
  "monan": "Món câu.mp3",
  "khantruyenthong": "Căn truyền thống.mp3",
  "lamth ucong": "Cúc bặng mầư.mp3",
  "gia": "giạ.mp3",
  "mua": "sấư.mp3",
  "ban": "Hai.mp3",
  "botgia": "Bợt giụ.mp3",
  "goi": "Họ.mp3",
  "lamqua": "Cúc quà.mp3",
  "nhasan": "Ràn cạc.mp3",
  "cauthang": "Lay.mp3",
  "gianbep": "Rạng bếp.mp3",
  "beplua": "Pẹc phầy.mp3",
  "quayquan": "tù sày.mp3",
  "tiepkhach": "Tiếp hẹc.mp3",
  "hoiduong": "Cham ron.mp3",
  "dithang": "Pây dầu.mp3",
  "re trai": "Pớc bợng slúi.mp3",
  "caycau": "Kìu.mp3",
  "xedap": "Xe đạp.mp3",
  "duongdi": "Pây ron.mp3",
  "nhavanhoa": "Ràn văn hoá.mp3",
  "tiengnoi": "Cậư cáng.mp3",
  "landieudangian": "làn điệu dân gian.mp3",
  "phongtuc": "Phong tục.mp3",
  "gin giu": "giữ gìn.mp3"
};
// Chuẩn hóa cả khóa alias trước khi tra cứu: nhiều khóa được viết có khoảng trắng,
// dấu tiếng Việt hoặc dấu câu, trong khi normAudioName loại bỏ các ký tự đó.
const normalizedAudioAliases = Object.fromEntries(
  Object.entries(audioAliases).map(([key, filename]) => [normAudioName(key), filename])
);
function aliasAudioFor(term){
  const key=normAudioName(term);
  if(Object.prototype.hasOwnProperty.call(normalizedAudioAliases,key)) return normalizedAudioAliases[key] || null;
  return knownAudioFiles.find(file=>normAudioName(file.replace(/\.mp3$/i,""))===key)||null;
}
function findAudioFile(item){
  const explicit=item?.audio;
  if(explicit){
    const name=String(explicit).split('/').pop();
    const known=knownAudioFiles.find(file=>normAudioName(file.replace(/\.mp3$/i,""))===normAudioName(name.replace(/\.mp3$/i,"")));
    return known ? "assets/audio/"+known : (String(explicit).startsWith("assets/")?String(explicit):"assets/audio/"+name);
  }
  const terms=[item?.nung,item?.nungAn,item?.word,item?.meaning];
  for(const term of terms){const found=aliasAudioFor(term);if(found)return "assets/audio/"+found;}
  return null;
}
function encodedAudioPath(path){
  if(!path)return "";
  return path.split('/').map(part=>encodeURIComponent(part)).join('/');
}
function getNungAndVietnamese(item){
  // Dữ liệu từ vựng đã được chuẩn hóa: word luôn là tiếng Nùng An, meaning là tiếng Việt.
  return {nung:item?.word||item?.nung||item?.nungAn||"",vietnamese:item?.meaning||item?.vietnamese||""};
}
let currentAudio=null;
function playVocabularyAudio(button){
  const src=button.dataset.audio;
  // Không có tên tệp trong danh sách, hoặc tệp chưa được chép vào assets/audio/: im lặng, giữ nguyên nút loa.
  if(!src)return;
  if(currentAudio){currentAudio.pause();currentAudio=null;}
  const audio=new Audio(encodedAudioPath(src));currentAudio=audio;button.classList.add('is-playing');
  const finish=()=>{button.classList.remove('is-playing');if(currentAudio===audio)currentAudio=null;};
  audio.addEventListener('ended',finish,{once:true});audio.addEventListener('error',finish,{once:true});
  audio.play().catch(finish);
}
function bindTextCards(kind){
  const items=data.lessons[currentLesson][kind]||[];let checked=0,correct=0;
  $$(`[data-${kind}-hint]`).forEach(btn=>btn.addEventListener("click",()=>{const i=Number(btn.dataset[`${kind}Hint`]),item=items[i],hint=$(`[data-${kind}-hint-text="${i}"]`);hint.textContent=item.answer?"Gợi ý tham khảo: "+item.answer:"Chưa có gợi ý trong tài liệu.";hint.hidden=false;}));
  $$(`[data-${kind}-check]`).forEach(btn=>btn.addEventListener("click",()=>{const i=Number(btn.dataset[`${kind}Check`]),item=items[i],input=$(`[data-${kind}-input="${i}"]`),feedback=$(`[data-${kind}-feedback="${i}"]`);const clean=v=>String(v||"").trim().replace(/[.!?。]+$/g,"").replace(/\s+/g," ").toLocaleLowerCase("vi");const value=clean(input.value);const accepted=(item.acceptedAnswers||[item.answer]).filter(Boolean).map(clean);const ok=!!value&&accepted.includes(value);feedback.textContent=!value?"Bạn hãy nhập câu trả lời trước nhé.":ok?"✓ Chính xác!":"Chưa chính xác. Bấm Gợi ý để xem câu tham khảo.";feedback.classList.toggle("is-correct",ok);feedback.classList.toggle("is-wrong",!!value&&!ok);if(!btn.dataset.counted){checked++;if(ok)correct++;btn.dataset.counted="1";}else{if(ok&&!btn.dataset.wasCorrect){correct++;}if(!ok&&btn.dataset.wasCorrect){correct--;} }btn.dataset.wasCorrect=ok?"1":"0";const score=$("#"+kind+"Score");score.textContent=`Đã kiểm tra ${checked}/${items.length} câu · ${correct} câu chính xác.`;if(checked===items.length&&!$("#nextActivity")&&!$("#nextLesson")){score.insertAdjacentHTML("afterend",nextActivityButton());bindNextButton();}tone(ok?"good":"bad");}));
}

function viText(item, ...keys){
  for(const key of keys){const value=item?.[key];if(typeof value==="string"&&value.trim())return value.trim();}
  return "";
}
function viLine(value, className="vietnamese-exercise"){
  return value?`<p class="${className}" ${showVietnamese?"":"hidden"}>${escapeHTML(value)}</p>`:"";
}

function activityRows(items,type){
  if(!items?.length)return `<div class="empty-state"><span>✦</span><h4>Nội dung đang chờ cập nhật</h4><p>Dữ liệu của phần này sẽ được nhập theo tài liệu Word được cung cấp.</p></div>`;
  if(type==="vocab")return `<div class="vocab-grid">${items.map((x,i)=>{const audio=findAudioFile(x)||"";const terms=getNungAndVietnamese(x);return `<article class="vocab-card"><div class="vocab-card-top"><span class="vocab-index">TỪ ${String(i+1).padStart(2,"0")}</span><button class="audio-btn" data-audio="${escapeHTML(audio)}" aria-label="Nghe phát âm từ ${escapeHTML(terms.nung)}" title="Nghe phát âm"><span>🔊</span><span class="audio-btn-label">Nghe</span></button></div><h4 class="nung-word">${escapeHTML(terms.nung)}</h4><p class="vietnamese-word" ${showVietnamese?"":"hidden"}>${escapeHTML(terms.vietnamese)}</p></article>`;}).join("")}</div>`;
  if(type==="dialogue"){
    const nung=items[0]?.text||"";
    const vietnamese=items[1]?.text||"";
    return `<div class="dialogue-box"><article class="dialogue-part"><span class="dialogue-number">01</span><div><b>Hội thoại tiếng Nùng An</b><p class="dialogue-nung">${escapeHTML(nung)}</p></div></article><article class="dialogue-part vietnamese-dialogue" ${showVietnamese?"":"hidden"}><span class="dialogue-number">VI</span><div><b>Bản dịch tiếng Việt</b><p>${escapeHTML(vietnamese)}</p></div></article></div>`;
  }
  if(type==="truefalse")return `<form class="exercise-form" data-type="truefalse"><div class="exercise-intro"><span>LUYỆN TẬP</span><b>${items.length} nhận định</b></div><div class="question-grid">${items.map((x,i)=>`<fieldset class="question-card"><legend><span class="question-number">${String(i+1).padStart(2,"0")}</span>${escapeHTML(x.question)}</legend>${viLine(viText(x,"questionVi","vietnameseQuestion","translation"))}<div class="choice-grid"><label class="choice-card"><input type="radio" name="q${i}" value="true"><span>Đúng</span></label><label class="choice-card"><input type="radio" name="q${i}" value="false"><span>Sai</span></label></div><small class="answer-feedback" data-feedback="${i}"></small></fieldset>`).join("")}</div><button class="button button-dark" type="submit">Kiểm tra kết quả <span>→</span></button><p class="score-line" aria-live="polite"></p></form>`;
  if(type==="quiz")return `<form class="exercise-form" data-type="quiz"><div class="exercise-intro"><span>TRẮC NGHIỆM</span><b>${items.length} câu hỏi</b></div><div class="question-grid">${items.map((x,i)=>`<fieldset class="question-card"><legend><span class="question-number">${String(i+1).padStart(2,"0")}</span>${escapeHTML(x.question)}</legend>${viLine(viText(x,"questionVi","vietnameseQuestion","translation"))}<div class="choice-grid">${(x.options||[]).map((op,j)=>`<label class="choice-card"><input type="radio" name="q${i}" value="${j}"><span><b>${String.fromCharCode(65+j)}.</b> ${escapeHTML(op)}${(x.optionsVi?.[j]||x.optionTranslations?.[j])?`<small class="vietnamese-option" ${showVietnamese?"":"hidden"}>${escapeHTML(x.optionsVi?.[j]||x.optionTranslations?.[j])}</small>`:""}</span></label>`).join("")}</div><small class="answer-feedback" data-feedback="${i}"></small></fieldset>`).join("")}</div><button class="button button-dark" type="submit">Nộp bài <span>→</span></button><p class="score-line" aria-live="polite"></p></form>`;
  if(type==="matching"){const meanings=[...items.map(x=>x.meaning)].sort(()=>Math.random()-.5);return `<form class="exercise-form matching-form" data-type="matching"><div class="exercise-intro"><span>GHÉP ĐÚNG CẶP TỪ</span><b>${items.length} cặp</b></div><div class="matching-grid">${items.map((x,i)=>`<div class="match-row"><div class="match-word"><span>${String(i+1).padStart(2,"0")}</span><b>${escapeHTML(x.word)}</b>${viLine(viText(x,"wordVi","wordTranslation"),"vietnamese-match")}</div><select name="q${i}" aria-label="Chọn nghĩa cho ${escapeHTML(x.word)}"><option value="">Chọn nghĩa phù hợp…</option>${meanings.map(y=>`<option value="${items.findIndex(z=>z.meaning===y)}">${escapeHTML(y)}${items.find(z=>z.meaning===y)?.meaningVi?" — "+escapeHTML(items.find(z=>z.meaning===y).meaningVi):""}</option>`).join("")}</select><small class="answer-feedback" data-feedback="${i}"></small></div>`).join("")}</div><button class="button button-dark" type="submit">Kiểm tra ghép nối <span>→</span></button><p class="score-line" aria-live="polite"></p></form>`;}
  if(type==="arrange"||type==="writing"){const kind=type;const title=type==="arrange"?"Sắp xếp các từ thành câu đúng":"Viết lại câu bằng tiếng Nùng An";const placeholder=type==="arrange"?"Nhập câu đã sắp xếp…":"Nhập câu tiếng Nùng An…";return `<div class="writing-exercises"><p class="exercise-instruction">${title}</p>${items.map((x,i)=>`<article class="writing-card"><div class="writing-card-head"><span>CÂU ${String(i+1).padStart(2,"0")}</span><b>${escapeHTML(x.prompt)}</b>${viLine(viText(x,"promptVi","vietnamesePrompt","translation"),"vietnamese-prompt")}</div><div class="writing-answer-row"><input type="text" data-${kind}-input="${i}" placeholder="${placeholder}"><button type="button" class="hint-btn" data-${kind}-hint="${i}">Gợi ý</button><button type="button" class="check-btn" data-${kind}-check="${i}">Kiểm tra</button></div><p class="writing-hint" data-${kind}-hint-text="${i}" hidden></p><small class="answer-feedback" data-${kind}-feedback="${i}" aria-live="polite"></small></article>`).join("")}<p class="score-line" id="${kind}Score" aria-live="polite"></p></div>`;}
}
function renderActivity(){
  const l=data.lessons[currentLesson], key={vocab:"vocabulary",dialogue:"dialogue",truefalse:"trueFalse",quiz:"quiz",matching:"matching",arrange:"arrange",writing:"writing"}[currentActivity];
  $("#lessonProgress").textContent=`${Object.values({vocabulary:l.vocabulary,dialogue:l.dialogue,trueFalse:l.trueFalse,quiz:l.quiz,matching:l.matching,arrange:l.arrange,writing:l.writing}).filter(a=>a?.length).length}/7 hoạt động có dữ liệu`;
  $("#activityPanel").innerHTML=activityRows(l[key],currentActivity);
  $$(".activity-tab").forEach(b=>b.classList.toggle("active",b.dataset.activity===currentActivity));
  const langToggle=$("#showVietnamese"); if(langToggle)langToggle.checked=showVietnamese;
  applyVietnameseMode(showVietnamese);
  $$(".audio-btn").forEach(b=>b.addEventListener("click",()=>playVocabularyAudio(b)));
  const form=$(".exercise-form");if(form)form.addEventListener("submit",checkAnswers);
  if(currentActivity==="writing"||currentActivity==="arrange")bindTextCards(currentActivity);
  if(["vocab","dialogue"].includes(currentActivity))$("#activityPanel").insertAdjacentHTML("beforeend",nextActivityButton());
  bindNextButton();
}
function checkAnswers(e){
  e.preventDefault();const form=e.currentTarget,type=form.dataset.type,items=data.lessons[currentLesson][{truefalse:"trueFalse",quiz:"quiz",matching:"matching",writing:"writing"}[type]]||[];let score=0,attempted=0,verified=0;
  items.forEach((x,i)=>{const field=form.elements[`q${i}`];let value=type==="matching"?field?.value:type==="writing"?field?.value.trim():form.querySelector(`[name="q${i}"]:checked`)?.value;const feedback=$(`[data-feedback="${i}"]`,form);let correct=false;
    if(value!==undefined&&value!==null&&value!=="")attempted++;
    if(type==="truefalse"){verified++;correct=String(x.answer)===value;}
    if(type==="quiz"&&x.answer!==null&&x.answer!==undefined){verified++;correct=String(x.answer)===value;}
    if(type==="matching"){verified++;correct=String(x.answer)===value;}
    if(type==="writing"){verified++;correct=Array.isArray(x.acceptedAnswers)?x.acceptedAnswers.some(a=>a.trim().toLowerCase()===value.toLowerCase()):!!x.answer&&x.answer.trim().toLowerCase()===value.toLowerCase();}
    if(correct)score++;
    if(feedback){feedback.textContent=type==="quiz"&&(x.answer===null||x.answer===undefined)?"Đáp án đang chờ kiểm định theo tài liệu gốc.":(correct?"✓ Chính xác":(type==="writing"?"Đáp án tham khảo: "+(x.answer||"Chưa có đáp án"):("✗ Chưa đúng · Đáp án: "+(type==="truefalse"?(x.answer?"Đúng":"Sai"):type==="quiz"?x.options?.[Number(x.answer)]:type==="matching"?items[Number(x.answer)]?.meaning:""))));feedback.style.color=correct?"#28734f":"#a34f43";}
  });
  $(".score-line",form).textContent=`Kết quả: ${score}/${verified} câu đã có đáp án chuẩn · Đã trả lời ${attempted}/${items.length} câu.${verified<items.length?` ${items.length-verified} câu đang chờ kiểm định.`:""}`;
  form.insertAdjacentHTML("beforeend",nextActivityButton());bindNextButton();
  tone(score===verified?"good":"bad");
}
$$(".activity-tab").forEach(b=>b.addEventListener("click",()=>{currentActivity=b.dataset.activity;renderActivity();tone("next");}));

function applyVietnameseMode(show){showVietnamese=!!show;document.body.classList.toggle("show-vietnamese",showVietnamese);$$(".vietnamese-word,.vietnamese-dialogue,.vietnamese-label,.vietnamese-exercise,.vietnamese-option,.vietnamese-match,.vietnamese-prompt").forEach(el=>el.hidden=!showVietnamese);}
$("#showVietnamese")?.addEventListener("change",e=>{applyVietnameseMode(e.target.checked);tone("flip");});
function setFlashDeck(){
  const lesson=$("#flashLesson").value;
  flashDeck=data.flashcards.filter(c=>lesson==="all"||String(c.lesson)===lesson);
  flashIndex=0;renderFlash();
}
function renderFlash(){
  const card=flashDeck[flashIndex];$("#flashcard").classList.remove("flipped");
  if(!card){$("#flashLabel").textContent="THẺ TỪ VỰNG";$("#flashWord").textContent="Chưa có dữ liệu";$("#flashMeaning").textContent="Thẻ sẽ được cập nhật từ tài liệu Word.";$("#flashCount").textContent="0 thẻ";return;}
  $("#flashLabel").textContent=`TỪ VỰNG · BÀI ${String(card.lesson).padStart(2,"0")}`;
  $("#flashWord").textContent=card.word;$("#flashMeaning").textContent="Bấm để lật thẻ xem nghĩa";
  $("#flashCount").textContent=`Thẻ ${flashIndex+1} / ${flashDeck.length}`;
}
$("#flashcard").addEventListener("click",()=>{const c=flashDeck[flashIndex];if(!c)return;$("#flashcard").classList.toggle("flipped");$("#flashMeaning").textContent=$("#flashcard").classList.contains("flipped")?(c.meaning||"Chưa có nghĩa tiếng Việt"):"Bấm để lật thẻ xem nghĩa";tone("flip");});
$("#prevCard").addEventListener("click",()=>{if(flashDeck.length){flashIndex=(flashIndex-1+flashDeck.length)%flashDeck.length;renderFlash();tone("next");}});
$("#nextCard").addEventListener("click",()=>{if(flashDeck.length){flashIndex=(flashIndex+1)%flashDeck.length;renderFlash();tone("next");}});
$("#flashLesson").addEventListener("change",setFlashDeck);
$("#shuffleCards").addEventListener("click",()=>{for(let i=flashDeck.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[flashDeck[i],flashDeck[j]]=[flashDeck[j],flashDeck[i]];}flashIndex=0;renderFlash();tone("flip");});
function renderMedia(){
  const list=(arr,id)=>{
    const target=$(id); if(!target)return;
    target.innerHTML=(arr||[]).map(v=>`<div class="media-item"><span>${escapeHTML(v.title)}</span><button data-src="${escapeHTML(v.src)}" class="play-media" type="button">▶ Xem video</button></div>`).join("");
  };
  list(data.videos.stories,"#storyVideos");
  list(data.videos.folkSongs,"#folkSongVideos");
  $$(".play-media").forEach(b=>b.addEventListener("click",()=>openMedia(b.dataset.src)));
}
function openMedia(src){
  const safeSrc=encodedAudioPath(src);
  $("#dialogLabel").textContent="VIDEO VĂN HÓA DÂN GIAN";
  $("#dialogContent").innerHTML=`<video controls playsinline preload="metadata" style="width:100%;max-height:65vh;background:#101714;border-radius:12px" src="${escapeHTML(safeSrc)}"></video><p class="media-error" hidden>Không tìm thấy video. Hãy kiểm tra đúng tên tệp trong thư mục assets/video/.</p>`;
  const video=$("#dialogContent video");
  video.addEventListener("error",()=>{$(".media-error",$("#dialogContent")).hidden=false;});
  $("#contentDialog").showModal();
  video.play().catch(()=>{});
}
$$(".story-button").forEach(b=>b.addEventListener("click",()=>{const s=data.stories[b.dataset.story];$("#dialogLabel").textContent="TRUYỆN KỂ DÂN GIAN";$("#dialogContent").innerHTML=`<h2>${escapeHTML(s.title)}</h2>${s.paragraphs.map(p=>`<p>${escapeHTML(p)}</p>`).join("")}`;$("#contentDialog").showModal();}));
$$(".open-book").forEach(b=>b.addEventListener("click",()=>{const url=data.books[b.dataset.book];if(url)window.open(url,"_blank","noopener,noreferrer");}));
$("#openMuseum").addEventListener("click",()=>$("#museumDialog").showModal());
$("#confirmMuseum").addEventListener("click",()=>{window.open(data.museum,"_blank","noopener,noreferrer");$("#museumDialog").close();});
$("#nuanBubble").addEventListener("click",()=>{if(data.chatbot)window.open(data.chatbot,"_blank","noopener,noreferrer");});
$$("[data-close]").forEach(b=>b.addEventListener("click",()=>b.closest("dialog").close()));
$$("dialog").forEach(d=>d.addEventListener("click",e=>{if(e.target===d)d.close();}));
function revealOnScroll(){
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");observer.unobserve(e.target);}}),{threshold:.08});
  $$(".reveal").forEach(el=>observer.observe(el));
}
setupNav();renderLessons();setFlashDeck();renderMedia();revealOnScroll();
