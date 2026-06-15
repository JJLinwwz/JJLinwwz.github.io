const DATA = [
{id:"sets",name:"集合与逻辑",icon:"⊂",desc:"集合运算、充要条件、量词",keywords:["集合","交集","并集","补集","子集","命题","充分","必要"],
points:[{t:"集合表示",c:"列举法、描述法、Venn 图"},{t:"充要条件",c:"p⇒q 充分；q⇒p 必要；p⇔q 充要"},{t:"量词否定",c:"∀变∃，∃变∀，再否定命题"}],
formulas:[{n:"交集",f:"A∩B={x|x∈A且x∈B}"},{n:"并集",f:"A∪B={x|x∈A或x∈B}"},{n:"补集",f:"∁<sub>U</sub>A={x|x∈U且x∉A}"},{n:"子集个数",f:"n元集合子集2<sup>n</sup>个",note:"空集是任何集合的子集"},{n:"德摩根律",f:"∁(A∩B)=∁A∪∁B"}]},
{id:"func",name:"函数",icon:"ƒ",desc:"定义域、单调性、奇偶性、指对幂",keywords:["函数","定义域","指数","对数","幂函数","二次"],
points:[{t:"三要素",c:"定义域、值域、对应法则"},{t:"单调性",c:"x₁<x₂时f(x₁)<f(x₂)为增函数"},{t:"奇偶性",c:"f(−x)=f(x)偶；f(−x)=−f(x)奇"}],
formulas:[{n:"指数法则",f:"a<sup>m</sup>·a<sup>n</sup>=a<sup>m+n</sup>"},{n:"对数法则",f:"log<sub>a</sub>(MN)=log<sub>a</sub>M+log<sub>a</sub>N"},{n:"换底",f:"log<sub>a</sub>b=<span class='frac'><span class='num'>lnb</span><span class='den'>lna</span></span>"},{n:"二次函数",f:"对称轴x=−<span class='frac'><span class='num'>b</span><span class='den'>2a</span></span>"}]},
{id:"trig",name:"三角函数",icon:"θ",desc:"诱导公式、和差、解三角形",keywords:["正弦","余弦","正切","诱导","二倍角","解三角形"],
points:[{t:"象限符号",c:"一全正二正弦三正切四余弦"},{t:"正弦定理",c:"a/sinA=b/sinB=c/sinC=2R"},{t:"余弦定理",c:"a²=b²+c²−2bc·cosA"}],
formulas:[{n:"基本关系",f:"sin²α+cos²α=1"},{n:"二倍角",f:"sin2α=2sinαcosα；cos2α=cos²α−sin²α"},{n:"辅助角",f:"a sinx+b cosx=√(a²+b²)sin(x+φ)"},{n:"面积",f:"S=<span class='frac'><span class='num'>1</span><span class='den'>2</span></span>ab·sinC"}]},
{id:"vector",name:"平面向量",icon:"→",desc:"线性运算、数量积",keywords:["向量","数量积","坐标","平行","垂直"],
points:[{t:"平行",c:"x₁y₂−x₂y₁=0"},{t:"垂直",c:"a⃗·b⃗=0"}],
formulas:[{n:"数量积",f:"a⃗·b⃗=x₁x₂+y₁y₂=|a⃗||b⃗|cosθ"},{n:"模长",f:"|a⃗|=√(x²+y²)"}]},
{id:"sequence",name:"数列",icon:"Σ",desc:"等差、等比、求和",keywords:["等差","等比","求和","通项"],
points:[{t:"等差",c:"aₙ=a₁+(n−1)d"},{t:"等比",c:"aₙ=a₁·q<sup>n−1</sup>，注意q=1"}],
formulas:[{n:"等差求和",f:"Sₙ=<span class='frac'><span class='num'>n(a₁+aₙ)</span><span class='den'>2</span></span>"},{n:"等比求和",f:"Sₙ=<span class='frac'><span class='num'>a₁(1−qⁿ)</span><span class='den'>1−q</span></span> (q≠1)"},{n:"裂项",f:"<span class='frac'><span class='num'>1</span><span class='den'>n(n+1)</span></span>=<span class='frac'><span class='num'>1</span><span class='den'>n</span></span>−<span class='frac'><span class='num'>1</span><span class='den'>n+1</span></span>"}]},
{id:"ineq",name:"不等式",icon:"≤",desc:"基本不等式、二次不等式",keywords:["基本不等式","均值","二次不等式"],
points:[{t:"二次不等式",c:"a>0时，大于取两边，小于取中间"},{t:"基本不等式",c:"a,b>0时，<span class='frac'><span class='num'>a+b</span><span class='den'>2</span></span>≥√(ab)"}],
formulas:[{n:"基本不等式",f:"a+b≥2√(ab)"},{n:"柯西",f:"(a²+b²)(c²+d²)≥(ac+bd)²"}]},
{id:"solid",name:"立体几何",icon:"◇",desc:"体积、表面积、空间向量",keywords:["体积","表面积","线面","二面角"],
points:[{t:"线面垂直",c:"线垂直面内两相交线"},{t:"向量法",c:"建系→法向量→求角距"}],
formulas:[{n:"锥体",f:"V=<span class='frac'><span class='num'>1</span><span class='den'>3</span></span>Sh"},{n:"球",f:"V=<span class='frac'><span class='num'>4</span><span class='den'>3</span></span>πR³；S=4πR²"}]},
{id:"analytic",name:"解析几何",icon:"◎",desc:"直线、圆、圆锥曲线",keywords:["直线","圆","椭圆","双曲线","抛物线"],
points:[{t:"椭圆",c:"|PF₁|+|PF₂|=2a，a²=b²+c²"},{t:"韦达",c:"x₁+x₂=−b/a；x₁x₂=c/a"}],
formulas:[{n:"点线距",f:"d=<span class='frac'><span class='num'>|Ax₀+By₀+C|</span><span class='den'>√(A²+B²)</span></span>"},{n:"椭圆",f:"<span class='frac'><span class='num'>x²</span><span class='den'>a²</span></span>+<span class='frac'><span class='num'>y²</span><span class='den'>b²</span></span>=1"}]},
{id:"prob",name:"概率统计",icon:"P",desc:"排列组合、期望方差",keywords:["排列","组合","概率","期望","方差"],
points:[{t:"独立",c:"P(AB)=P(A)P(B)"},{t:"条件概率",c:"P(B|A)=P(AB)/P(A)"}],
formulas:[{n:"排列",f:"A<sub>n</sub><sup>m</sup>=<span class='frac'><span class='num'>n!</span><span class='den'>(n−m)!</span></span>"},{n:"组合",f:"C<sub>n</sub><sup>m</sup>=<span class='frac'><span class='num'>n!</span><span class='den'>m!(n−m)!</span></span>"},{n:"期望",f:"E(X)=Σxᵢpᵢ"}]},
{id:"derivative",name:"导数",icon:"d",desc:"求导、单调极值、积分",keywords:["导数","切线","单调","极值"],
points:[{t:"几何意义",c:"f'(x₀)为切线斜率"},{t:"单调",c:"f'>0增，f'<0减"}],
formulas:[{n:"基本求导",f:"(xⁿ)'=nxⁿ⁻¹；(eˣ)'=eˣ；(lnx)'=1/x"},{n:"乘法法则",f:"(uv)'=u'v+uv'"}]},
{id:"complex",name:"复数",icon:"i",desc:"运算、模、共轭",keywords:["复数","虚数","共轭","模"],
points:[{t:"定义",c:"z=a+bi，i²=−1"},{t:"模",c:"|z|=√(a²+b²)"}],
formulas:[{n:"乘法",f:"(a+bi)(c+di)=(ac−bd)+(ad+bc)i"},{n:"模",f:"|z|²=a²+b²"}]},
{id:"counting",name:"计数原理",icon:"#",desc:"捆绑、插空、隔板",keywords:["捆绑","插空","隔板","二项式"],
points:[{t:"隔板法",c:"n同物分m人每人≥1：C<sub>n−1</sub><sup>m−1</sup>"},{t:"相邻",c:"捆绑法；不相邻用插空法"}],
formulas:[{n:"二项式",f:"(a+b)<sup>n</sup>=ΣC<sub>n</sub><sup>k</sup>a<sup>n−k</sup>b<sup>k</sup>"}]}
];

const TOPICS = DATA.map(d=>({id:d.id,name:d.name}));
const SOURCES = ['家教','校内上课','作业','考试','其他'];
const NOTE_TYPES = ['家教授课','校内上课','备课','教研','其他'];

// ═══════════════════════════════════════
//  工具函数
// ═══════════════════════════════════════
const $ = s => document.querySelector(s);
const ri = (a,b) => Math.floor(Math.random()*(b-a+1))+a;
const pick = a => a[ri(0,a.length-1)];
const shuffle = a => { const b=[...a]; for(let i=b.length-1;i>0;i--){const j=ri(0,i);[b[i],b[j]]=[b[j],b[i]];} return b; };
const uid = () => Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const today = () => new Date().toISOString().slice(0,10);
const fmtDate = d => { const x=new Date(d+'T00:00:00'); return `${x.getFullYear()}年${x.getMonth()+1}月${x.getDate()}日`; };
const topicName = id => (DATA.find(d=>d.id===id)||{}).name || id;
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const gcd = (a,b) => { a=Math.abs(a);b=Math.abs(b); while(b){[a,b]=[b,a%b];} return a; };

function load(key, def) { try { return JSON.parse(localStorage.getItem(key)) ?? def; } catch { return def; } }
function save(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

let view = 'home'; // home | section | quiz | mistakes | notes | fav
let sectionId = 'home';
let showFav = false;
const favs = load('math-favs', []);
let formulaFavs = load('math-formula-favs', []);
let quizFavs = load('math-quiz-favs', []);
let mistakes = load('math-mistakes', []);
let notes = load('math-notes', []);
let quizState = { topics: DATA.map(d=>d.id), types: ['选择','填空','判断','解答'], diff: 'medium', count: 5, problems: [], showAll: false };
let theme = load('math-theme', 'cute');
let fontScale = load('math-font-scale', 1);
let formulaTab = 'editor';
let graphState = { type:'quadratic', a:1, b:0, c:-4, A:1, B:0, w:1, phi:0 };

// 迁移旧数据
if (mistakes.some(m => m.source === '达拉特旗一中')) {
  mistakes = mistakes.map(m => m.source === '达拉特旗一中' ? {...m, source:'校内上课'} : m);
  save('math-mistakes', mistakes);
}

function applyTheme(t) {
  theme = t; document.body.dataset.theme = t; save('math-theme', t);
}
function applyFontScale(s) {
  fontScale = +s || 1;
  document.documentElement.style.setProperty('--font-scale', fontScale);
  save('math-font-scale', fontScale);
}
applyFontScale(fontScale);
function ffKey(mid, name) { return mid + ':' + name; }
function ffCustomKey(id) { return 'custom:' + id; }
function isFfav(key) { return formulaFavs.some(f => f.key === key); }
function toggleFfav(item) {
  const i = formulaFavs.findIndex(f => f.key === item.key);
  if (i >= 0) { formulaFavs.splice(i, 1); toast('已取消收藏'); }
  else { formulaFavs.unshift(item); toast('已加入公式收藏夹 ⭐'); }
  save('math-formula-favs', formulaFavs); render();
}
function isQuizFav(id) { return quizFavs.includes(id); }
function toggleQuizFav(bankId) {
  const i = quizFavs.indexOf(bankId);
  if (i >= 0) { quizFavs.splice(i, 1); toast('已取消收藏'); }
  else { quizFavs.push(bankId); toast('已收藏到真题夹 ⭐'); }
  save('math-quiz-favs', quizFavs); render();
}
window.toggleQuizFav = toggleQuizFav;
function showFormulaFavModal(key) {
  const f = formulaFavs.find(x => x.key === key);
  if (!f) return;
  $('#modalTitle').textContent = f.name;
  $('#modalBody').innerHTML = `<div style="font-size:.75rem;color:var(--text2);margin-bottom:8px">${esc(f.moduleName || topicName(f.moduleId))}</div><div class="formula-expr">${f.expr}</div>${f.note ? `<div class="formula-note">${esc(f.note)}</div>` : ''}`;
  $('#modalFooter').innerHTML = `<button class="btn" onclick="closeModal();view='section';sectionId='${f.moduleId}';render();">查看章节</button><button class="btn btn-primary" onclick="closeModal()">好</button>`;
  $('#modal').classList.add('show');
}
window.showFormulaFavModal = showFormulaFavModal;

function getGreeting() {
  const full = typeof TEACHER_FULL !== 'undefined' ? TEACHER_FULL : '蔺婉宁';
  const nick = typeof TEACHER_NICK !== 'undefined' ? TEACHER_NICK : '婉儿';
  const h = new Date().getHours();
  if (h >= 0 && h < 5) return { title:`${nick}小朋友辛苦啦 🌙`, sub:'已经凌晨了，记得早点休息哦～明天还要元气满满地教书呢', heart:'太晚了，快去睡觉，注意身体 💕' };
  if (h >= 5 && h < 9) return { title:`早上好，${full} ☀️`, sub:'新的一天开始啦，今天也一定是最温柔、最棒的老师！', heart:'早餐记得吃，别空着肚子上课哦～' };
  if (h >= 9 && h < 12) return { title:`上午好，${full} 🌸`, sub:'上午辛苦了，你认真教书的样子真的很好看', heart:'累了就喝口温水，休息一下再加油 💗' };
  if (h >= 12 && h < 14) return { title:`中午好，${full} 🍱`, sub:'中午要好好吃饭、眯一会儿，下午才有力气呀', heart:'午休一下，下午继续闪闪发光 ✨' };
  if (h >= 14 && h < 18) return { title:`下午好，${full} 🌷`, sub:'下午的工作快接近尾声啦，坚持住，你超棒的！', heart:'你的专属数学小屋，今天也为你亮着灯~' };
  if (h >= 18 && h < 22) return { title:`晚上好，${full}小朋友 ✨`, sub:'辛苦一天啦，今晚也要好好照顾自己哦', heart:'忙完了早点休息，别熬太晚 🌙' };
  return { title:`${nick}小朋友辛苦啦 🌙`, sub:'夜深了，不要太操劳，记得早点休息', heart:'明天见，做个甜甜的梦 💕' };
}

let _toastTimer = null;
function toast(msg, ms) {
  const t = $('#toast');
  if (!t) return;
  if (_toastTimer) { clearTimeout(_toastTimer); _toastTimer = null; }
  t.textContent = msg;
  t.classList.remove('show');
  void t.offsetWidth;
  t.classList.add('show');
  _toastTimer = setTimeout(() => {
    t.classList.remove('show');
    _toastTimer = null;
  }, ms || 2600);
}
function hideToast() {
  const t = $('#toast');
  if (_toastTimer) { clearTimeout(_toastTimer); _toastTimer = null; }
  t?.classList.remove('show');
}

// ═══════════════════════════════════════
//  高考真题库出题
// ═══════════════════════════════════════
const DIFF_MAP = { easy:['基础'], medium:['基础','中等'], hard:['基础','中等','提高'] };
function bankToProblem(q) {
  return { q:q.q, a:q.a, steps:q.steps, topic:q.topic, diff:q.diff, year:q.year, type:q.type, bankId:q.id };
}
function buildQuizPool() {
  if (typeof GAOKAO_BANK === 'undefined') return [];
  let pool = GAOKAO_BANK.filter(q => quizState.topics.includes(q.cat));
  if (quizState.types?.length) pool = pool.filter(q => quizState.types.includes(q.type));
  const diffs = DIFF_MAP[quizState.diff] || DIFF_MAP.medium;
  const filtered = pool.filter(q => diffs.includes(q.diff));
  return filtered.length ? filtered : pool;
}
function pickUniqueFromPool(pool, used, preferType) {
  const avail = pool.filter(q => !used.has(q.id));
  if (!avail.length) return null;
  if (preferType) {
    const typed = shuffle(avail.filter(q => q.type !== preferType));
    if (typed.length) return typed[0];
  }
  return pick(shuffle(avail));
}
function genProblems() {
  const pool = buildQuizPool();
  if (!pool.length) return [];
  const want = quizState.count;
  const cap = Math.min(want, pool.length);
  const used = new Set();
  const out = [];
  const types = quizState.types?.length ? [...quizState.types] : [...new Set(pool.map(q => q.type))];
  if (types.length > 1) {
    shuffle(types).forEach(t => {
      if (out.length >= cap) return;
      const cand = shuffle(pool.filter(q => q.type === t && !used.has(q.id)));
      if (cand.length) { used.add(cand[0].id); out.push(bankToProblem(cand[0])); }
    });
  }
  while (out.length < cap) {
    const lastType = out.length ? out[out.length - 1].type : null;
    const avoidSame = types.length > 1 ? lastType : null;
    const q = pickUniqueFromPool(pool, used, avoidSame);
    if (!q) break;
    used.add(q.id);
    out.push(bankToProblem(q));
  }
  if (cap < want) {
    setTimeout(() => toast(`题库匹配 ${pool.length} 道，已去重生成 ${out.length} 道`), 80);
  }
  return shuffle(out);
}
function pickOneProblem(excludeIds=[]) {
  const pool = buildQuizPool().filter(q => !excludeIds.includes(q.id));
  if (!pool.length) return null;
  const q = pick(pool);
  return bankToProblem(q);
}

// ═══════════════════════════════════════
//  渲染
// ═══════════════════════════════════════
function renderNav() {
  const todayM = mistakes.filter(m=>m.date===today()).length;
  const todayN = notes.filter(n=>n.date===today()).length;
  let h = `<button class="nav-item${view==='home'?' active':''}" data-v="home">🏠 工作台</button>`;
  h += `<div class="nav-group">教学工具</div>`;
  h += `<button class="nav-item${view==='quiz'?' active':''}" data-v="quiz">📝 高考真题</button>`;
  h += `<button class="nav-item${view==='formula'?' active':''}" data-v="formula">✏️ 公式编辑</button>`;
  h += `<button class="nav-item${view==='draw'?' active':''}" data-v="draw">🖊️ 手写画板</button>`;
  h += `<button class="nav-item${view==='graph'?' active':''}" data-v="graph">📈 图形绘制</button>`;
  h += `<button class="nav-item${view==='mistakes'?' active':''}" data-v="mistakes">📕 错题本${mistakes.length?`<span class="nav-badge">${mistakes.length}</span>`:''}</button>`;
  h += `<button class="nav-item${view==='notes'?' active':''}" data-v="notes">📓 教学笔记${todayN?`<span class="nav-badge">${todayN}</span>`:''}</button>`;
  h += `<button class="nav-item${view==='feedback'?' active':''}" data-v="feedback">💌 家教反馈</button>`;
  h += `<button class="nav-item${view==='weakness'?' active':''}" data-v="weakness">📊 薄弱分析</button>`;
  h += `<div class="nav-group">公式速查</div>`;
  DATA.forEach(d => {
    h += `<button class="nav-item${view==='section'&&sectionId===d.id?' active':''}" data-v="section" data-id="${d.id}">${d.icon} ${d.name}</button>`;
  });
  $('#nav').innerHTML = h;
}

function renderTopbar() {
  const isRef = view === 'home' || view === 'section' || showFav || view === 'refhub';
  const mob = window.innerWidth <= 768;
  $('#searchWrap').style.display = (isRef || (mob && view === 'refhub')) ? '' : 'none';
  if (mob) {
    const si = document.getElementById('searchInput');
    if (si) si.placeholder = '搜索公式、知识点…';
  }
  let h = '';
  let mh = '';
  const addMob = (html, id, cls) => { mh += html.replace('class="btn', `class="mact${cls?' '+cls:''}`).replace(/id="([^"]+)"/, `id="m_$1"`); };
  if (view === 'quiz') {
    h += `<button class="btn btn-primary" id="btnGenQuiz">生成题目</button>`;
    h += `<button class="btn" id="btnShowAns">${quizState.showAll?'隐藏':'显示'}全部答案</button>`;
    mh += `<button class="mact mact-text btn-primary" id="m_btnGenQuiz">✨ 生成</button>`;
    mh += `<button class="mact mact-text" id="m_btnShowAns">${quizState.showAll?'隐藏':'显示'}答案</button>`;
  }
  if (view === 'mistakes') {
    h += `<button class="btn btn-primary" id="btnAddMistake">+ 记录错题</button>`;
    h += `<button class="btn" id="btnGoWeak">📊 薄弱点</button>`;
    h += `<button class="btn" id="btnExportMistakes">导出</button>`;
    mh += `<button class="mact mact-text btn-primary" id="m_btnAddMistake">+ 错题</button>`;
    mh += `<button class="mact mact-text" id="m_btnGoWeak">📊 薄弱点</button>`;
  }
  if (view === 'notes') {
    h += `<button class="btn" id="btnVoiceNoteQuick">🎤 语音笔记</button>`;
    h += `<button class="btn btn-primary" id="btnAddNote">+ 今日笔记</button>`;
    h += `<button class="btn" id="btnExportNotes">导出</button>`;
    mh += `<button class="mact" id="m_btnVoiceNoteQuick">🎤</button>`;
    mh += `<button class="mact mact-text btn-primary" id="m_btnAddNote">+ 笔记</button>`;
  }
  if (view === 'feedback') {
    h += `<button class="btn btn-primary" id="btnGenFeedback">✨ 生成</button>`;
    h += `<button class="btn" id="btnExportFeedback">📷 导出图片</button>`;
    h += `<button class="btn" id="btnPrintFeedback">🖨 打印</button>`;
    mh += `<button class="mact mact-text btn-primary" id="m_btnGenFeedback">✨ 生成</button>`;
    mh += `<button class="mact mact-text" id="m_btnExportFeedback">📷 导出</button>`;
  }
  if (view === 'quiz' || view === 'quizfavs') {
    h += `<button class="btn${view==='quizfavs'?' on':''}" id="btnQuizFavs">⭐ 收藏 (${quizFavs.length})</button>`;
    mh += `<button class="mact mact-text${view==='quizfavs'?' on':''}" id="m_btnQuizFavs">⭐ ${quizFavs.length}</button>`;
  }
  if (isRef) {
    h += `<button class="btn${showFav?' on':''}" id="btnFav">★ 收藏</button>`;
    h += `<button class="btn" id="btnPrint">打印</button>`;
    mh += `<button class="mact${showFav?' on':''}" id="m_btnFav">★</button>`;
  }
  h += `<button class="btn${theme==='cute'?' on':''}" id="btnThemeCute" title="可爱模式">🎀</button>`;
  h += `<button class="btn${theme==='eye'?' on':''}" id="btnThemeEye" title="护眼模式">👁</button>`;
  h += `<button class="btn${theme==='dark'?' on':''}" id="btnThemeDark" title="夜间模式">🌙</button>`;
  h += `<button class="btn" id="btnBackup" title="下载备份">备份</button>`;
  h += `<button class="btn" id="btnRestore" title="从备份恢复">恢复</button>`;
  mh += `<button class="mact${theme==='cute'?' on':''}" id="m_btnThemeCute">🎀</button>`;
  mh += `<button class="mact${theme==='eye'?' on':''}" id="m_btnThemeEye">👁</button>`;
  mh += `<button class="mact${theme==='dark'?' on':''}" id="m_btnThemeDark">🌙</button>`;
  mh += `<button class="mact" id="m_btnBackup">💾</button>`;
  mh += `<button class="mact" id="m_btnRestore">📂</button>`;
  h += `<input type="file" id="restoreFile" accept=".json" style="display:none">`;
  $('#topbarActions').innerHTML = h;
  const mur = document.getElementById('mobileUtilRow');
  if (mur) mur.innerHTML = mh;
  bindTopbar();
  bindMobileTopbar();
}

function bindMobileTopbar() {
  const link = (mid, did) => {
    const m = document.getElementById(mid), d = document.getElementById(did);
    if (m && d) m.onclick = () => d.click();
    else if (m && !d) {
      const orig = document.getElementById(did.replace('m_', ''));
      if (orig) m.onclick = () => orig.click();
    }
  };
  ['btnGenQuiz','btnShowAns','btnAddMistake','btnGoWeak','btnExportMistakes','btnVoiceNoteQuick','btnAddNote','btnExportNotes','btnQuizFavs','btnFav','btnPrint','btnThemeCute','btnThemeEye','btnThemeDark','btnBackup','btnRestore','btnGenFeedback','btnExportFeedback','btnPrintFeedback'].forEach(id => link('m_'+id, id));
}

function bindTopbar() {
  const b = id => document.getElementById(id);
  if (b('btnGenQuiz')) b('btnGenQuiz').onclick = () => {
    quizState.problems = genProblems();
    quizState.showAll = false;
    render();
    if (quizState.problems.length) toast('已生成 '+quizState.problems.length+' 道不重复题目');
    else toast('当前条件下没有匹配题目，请调整章节或题型');
  };
  if (b('btnShowAns')) b('btnShowAns').onclick = () => { quizState.showAll = !quizState.showAll; render(); };
  if (b('btnPrintQuiz')) b('btnPrintQuiz').onclick = () => window.print();
  if (b('btnAddMistake')) b('btnAddMistake').onclick = () => openMistakeForm();
  if (b('btnAddNote')) b('btnAddNote').onclick = () => openNoteForm();
  if (b('btnVoiceNoteQuick')) b('btnVoiceNoteQuick').onclick = () => openNoteForm(null, true);
  if (b('btnQuizFavs')) b('btnQuizFavs').onclick = () => { view = view === 'quizfavs' ? 'quiz' : 'quizfavs'; render(); };
  if (b('btnExportMistakes')) b('btnExportMistakes').onclick = () => exportData('mistakes');
  if (b('btnExportNotes')) b('btnExportNotes').onclick = () => exportData('notes');
  if (b('btnFav')) b('btnFav').onclick = () => { showFav = !showFav; render(); };
  if (b('btnPrint')) b('btnPrint').onclick = () => window.print();
  if (b('btnThemeCute')) b('btnThemeCute').onclick = () => { applyTheme('cute'); render(); };
  if (b('btnThemeEye')) b('btnThemeEye').onclick = () => { applyTheme('eye'); render(); };
  if (b('btnThemeDark')) b('btnThemeDark').onclick = () => { applyTheme('dark'); render(); };
  if (b('btnBackup')) b('btnBackup').onclick = exportAll;
  if (b('btnRestore')) b('btnRestore').onclick = () => { view='backup'; render(); };
  if (b('btnGoWeak')) b('btnGoWeak').onclick = () => { view='weakness'; render(); };
}

function renderHome() {
  const tf = DATA.reduce((s,d)=>s+d.formulas.length,0);
  const tm = mistakes.length, tn = notes.length;
  const todayM = mistakes.filter(m=>m.date===today()).length;
  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate()-7);
  const weekM = mistakes.filter(m=>new Date(m.date)>=weekAgo).length;
  const g = getGreeting();
  const bankN = typeof GAOKAO_BANK !== 'undefined' ? GAOKAO_BANK.length : 0;
  const studentN = typeof students !== 'undefined' ? students.length : 0;
  const favFormulaBlock = formulaFavs.length ? `<div class="home-fav-formulas">
    <div class="hff-head"><span>⭐ 常用公式收藏</span><button class="btn" data-go="refhub" style="padding:4px 10px;font-size:.75rem">全部 →</button></div>
    <div class="fav-formula-grid">${formulaFavs.slice(0, 8).map(f => `<div class="fav-formula-chip" data-ffkey="${esc(f.key)}"><span class="ffc-mod">${esc(f.moduleName || topicName(f.moduleId))}</span><span class="ffc-name">${esc(f.name)}</span></div>`).join('')}</div>
  </div>` : '';
  const kittySvg = `<svg class="home-deco-mascot home-deco-kitty" viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="44" r="26" fill="#fff" stroke="#e8b4bc" stroke-width="2"/><ellipse cx="40" cy="18" rx="10" ry="6" fill="#f5a8b8"/><path d="M18 30 L12 12 L28 24" fill="#fff" stroke="#e8b4bc" stroke-width="2"/><path d="M62 30 L68 12 L52 24" fill="#fff" stroke="#e8b4bc" stroke-width="2"/><circle cx="32" cy="42" r="2.5" fill="#666"/><circle cx="48" cy="42" r="2.5" fill="#666"/><ellipse cx="40" cy="50" rx="3" ry="2" fill="#f5a8b8"/><path d="M36 54 Q40 58 44 54" fill="none" stroke="#c9a0a8" stroke-width="1.5"/></svg>`;
  const luluSvg = `<svg class="home-deco-mascot home-deco-lulu" viewBox="0 0 80 80" aria-hidden="true"><ellipse cx="40" cy="48" rx="28" ry="24" fill="#ffd93d" stroke="#f0b429" stroke-width="2"/><ellipse cx="40" cy="38" rx="18" ry="14" fill="#ff9f43"/><circle cx="34" cy="36" r="2" fill="#4a6fa5"/><circle cx="46" cy="36" r="2" fill="#4a6fa5"/><ellipse cx="40" cy="42" rx="4" ry="2" fill="#e85d5d"/><ellipse cx="40" cy="14" rx="5" ry="3" fill="#7ed957"/></svg>`;
  return `<div class="content-inner">
    <div class="home-hero">
      ${kittySvg}${luluSvg}
      <div class="hero-top">
        <img src="lwl.jpg" class="hero-avatar" alt="蔺婉宁">
        <div>
          <h2>${g.title}</h2>
          <p class="greet-sub">${g.sub}</p>
        </div>
      </div>
      <p class="greet-heart">${g.heart}</p>
      <p style="font-size:.75rem;color:var(--text2);margin-top:10px">今天是 ${fmtDate(today())} · 陪你备课的一天 🎀</p>
    </div>
    ${favFormulaBlock}
    <div class="home-quick">
      <div class="quick-btn" data-go="feedback"><div class="icon">💌</div><div class="label">家教反馈单</div><div class="sub">学习目标 · 课后反馈</div></div>
      <div class="quick-btn" data-go="weakness"><div class="icon">📊</div><div class="label">薄弱点分析</div><div class="sub">自动归类错题</div></div>
      <div class="quick-btn" data-go="quiz"><div class="icon">📝</div><div class="label">高考真题</div><div class="sub">题库 ${bankN} 道 · 课前小测</div></div>
      <div class="quick-btn" data-go="reports"><div class="icon">📈</div><div class="label">学情报告</div><div class="sub">${studentN} 位学生</div></div>
      <div class="quick-btn" data-go="draw"><div class="icon">💕</div><div class="label">双人画板</div><div class="sub" data-sync-home-status="draw">同屏画画 · 语音 · 回忆相册</div></div>
      <div class="quick-btn" data-go="photos"><div class="icon">📷</div><div class="label">暖光相簿</div><div class="sub" data-sync-home-status="photos">我们的专属小相馆</div></div>
      <div class="quick-btn" data-go="chat"><div class="icon">💬</div><div class="label">悄悄话</div><div class="sub" data-sync-home-status="chat">文字 · 语音 · 图片</div></div>
      <div class="quick-btn" data-go="timer"><div class="icon">⏱</div><div class="label">课堂计时</div><div class="sub">横屏倒计时</div></div>
      <div class="quick-btn" data-go="mistakes"><div class="icon">📕</div><div class="label">记录错题</div><div class="sub">已收录 ${tm} 道</div></div>
      <div class="quick-btn" data-go="notes"><div class="icon">📓</div><div class="label">教学笔记</div><div class="sub">今日 ${notes.filter(n=>n.date===today()).length} 篇</div></div>
      <div class="quick-btn" data-go="section" data-id="func"><div class="icon">📐</div><div class="label">公式速查</div><div class="sub">${DATA.length} 模块 · ${tf} 条</div></div>
    </div>
    <div class="home-stats">
      <div><div class="stat-num">${tm}</div><div class="stat-label">错题累计</div></div>
      <div><div class="stat-num">${weekM}</div><div class="stat-label">近7日新增错题</div></div>
      <div><div class="stat-num">${tn}</div><div class="stat-label">教学笔记</div></div>
      <div><div class="stat-num">${DATA.length}</div><div class="stat-label">知识模块</div></div>
    </div>
    <p class="home-tip-kbd" style="font-size:.8rem;color:var(--text2);margin-bottom:10px">使用提示：<kbd>Ctrl</kbd>+<kbd>K</kbd> 搜索公式 · 数据保存在本机浏览器 · 建议定期点「备份」</p>
    <div class="home-grid">${DATA.map(d=>`<div class="home-card" data-go="section" data-id="${d.id}"><h3>${d.icon} ${d.name}</h3><p>${d.desc}</p></div>`).join('')}</div>
  </div>`;
}

function renderSection(id) {
  const d = DATA.find(x=>x.id===id);
  if (!d) return '';
  const isFav = favs.includes(id);
  return `<div class="content-inner">
    <h2 class="section-title">${d.icon} ${d.name}</h2>
    <p class="section-desc">${d.desc}</p>
    <div class="card"><div class="card-header">核心要点</div><div class="card-body">
      ${d.points.map(p=>`<div class="point-item"><div class="point-title">${p.t}</div><div class="point-text">${p.c}</div></div>`).join('')}
    </div></div>
    <div class="card"><div class="card-header"><span>公式速查</span><button class="star-btn${isFav?' on':''}" data-fav="${id}">${isFav?'★':'☆'}</button></div><div class="card-body">
      ${d.formulas.map((f,fi)=>{const k=ffKey(id,f.n),on=isFfav(k);return`<div class="formula-item"><div class="formula-item-head"><div class="formula-name">${f.n}</div><button type="button" class="formula-star${on?' on':''}" data-ff-builtin="${id}" data-ff-idx="${fi}">${on?'★':'☆'}</button></div><div class="formula-expr">${f.f}</div>${f.note?`<div class="formula-note">${f.note}</div>`:''}</div>`;}).join('')}
    </div></div>
    ${(customFormulas||[]).filter(f=>f.topic===id).length?`<div class="card"><div class="card-header">✨ 我的公式</div><div class="card-body">${customFormulas.filter(f=>f.topic===id).map(f=>{const on=isFfav(ffCustomKey(f.id));return`<div class="formula-item"><div class="formula-item-head"><div class="formula-name">${esc(f.name)}</div><button type="button" class="formula-star${on?' on':''}" data-ff-custom="${f.id}">${on?'★':'☆'}</button></div><div class="formula-expr">${f.content}</div>${f.note?`<div class="formula-note">${esc(f.note)}</div>`:''}</div>`;}).join('')}</div></div>`:''}
    <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-primary" data-go-quiz="${id}">针对「${d.name}」出题 →</button><button class="btn" data-go="custom">+ 添加自定义</button></div>
  </div>`;
}

function renderFavs() {
  const items = DATA.filter(d=>favs.includes(d.id));
  if (!items.length) return `<div class="content-inner note-empty"><h2>暂无收藏</h2><p>在公式卡片右上角点 ☆ 收藏常用模块</p></div>`;
  return `<div class="content-inner"><h2 class="section-title">我的收藏</h2>${items.map(d=>renderSection(d.id).replace('content-inner','')).join('')}</div>`;
}

function renderQuizFavs() {
  const items = quizFavs.map(id => (typeof GAOKAO_BANK !== 'undefined' ? GAOKAO_BANK.find(q => q.id === id) : null)).filter(Boolean);
  if (!items.length) return `<div class="content-inner note-empty"><h2>还没有收藏真题</h2><p>在出题器里点 ⭐ 收藏常用题目</p><button class="btn btn-primary" style="margin-top:12px" onclick="view='quiz';render()">去出题 →</button></div>`;
  const list = items.map((p, i) => `
    <div class="quiz-item" id="qfav-${i}">
      <div class="quiz-q"><div class="quiz-num">${i + 1}</div><div>
        <div class="quiz-text">${esc(p.q)}</div>
        <div class="quiz-meta"><span class="tag-type-q">${p.type || ''}</span>${p.topic} · ${p.diff || ''}<span class="quiz-year">${p.year || ''}</span></div>
      </div></div>
      <div class="quiz-actions">
        <button onclick="document.getElementById('ans-qfav-${i}')?.classList.toggle('show')">查看答案</button>
        <button class="formula-star on" onclick="toggleQuizFav('${p.id}')">取消收藏</button>
      </div>
      <div class="quiz-ans" id="ans-qfav-${i}">
        <div class="quiz-ans-label">答案</div><div>${esc(p.a)}</div>
        <div class="quiz-steps"><b>解析</b>\n${esc(p.steps)}</div>
      </div>
    </div>`).join('');
  return `<div class="content-inner">
    <h2 class="section-title">⭐ 真题收藏夹</h2>
    <p class="section-desc">共 ${items.length} 道收藏 · 上课前快速调出</p>
    ${list}
  </div>`;
}

function renderQuiz() {
  const chips = DATA.map(d=>`<span class="chip${quizState.topics.includes(d.id)?' on':''}" data-topic="${d.id}">${d.name}</span>`).join('');
  let problems = '';
  if (quizState.problems.length) {
    problems = quizState.problems.map((p,i)=>`
      <div class="quiz-item" id="quiz-${i}">
        <div class="quiz-q"><div class="quiz-num">${i+1}</div><div>
          <div class="quiz-text">${esc(p.q)}</div>
          <div class="quiz-meta"><span class="tag-type-q">${p.type||''}</span>${p.topic} · ${p.diff||''}<span class="quiz-year">${p.year||''}</span></div>
        </div></div>
        <div class="quiz-actions">
          <button onclick="toggleAns(${i})">${$('#quiz-'+i)?.querySelector('.quiz-ans')?.classList.contains('show')?'隐藏':'查看'}答案</button>
          <button onclick="regenOne(${i})">换一题</button>
          <button class="formula-star${isQuizFav(p.bankId)?' on':''}" onclick="toggleQuizFav('${p.bankId||''}')">${isQuizFav(p.bankId)?'★ 已藏':'☆ 收藏'}</button>
        </div>
        <div class="quiz-ans${quizState.showAll?' show':''}" id="ans-${i}">
          <div class="quiz-ans-label">答案</div>
          <div>${esc(p.a)}</div>
          <div class="quiz-steps"><b>解析</b>\n${esc(p.steps)}</div>
        </div>
      </div>`).join('');
  } else {
    problems = `<div class="note-empty"><p>选择章节和难度，点击「生成题目」</p><p style="margin-top:8px;font-size:.82rem">快捷：课前小测 5 题 · 课后巩固 3 题</p></div>`;
  }
  return `<div class="content-inner">
    <h2 class="section-title">高考真题出题器 🎀</h2>
    <p class="section-desc">精选 2019—2024 年全国卷/新高考典型真题风格题目，含完整答案与解析 · 适合课前小测、家教、课后巩固</p>
    <div class="quiz-toolbar">
      <div class="field" style="flex:1;min-width:200px"><label>选择章节（可多选）</label><div class="chip-group" id="topicChips">${chips}</div></div>
      <div class="field" style="flex:1;min-width:180px"><label>题型（可多选）</label><div class="chip-group" id="typeChips">${QUESTION_TYPES.map(t=>`<span class="chip${quizState.types.includes(t)?' on':''}" data-qtype="${t}">${t}</span>`).join('')}</div></div>
      <div class="field"><label>难度</label><select id="quizDiff"><option value="easy"${quizState.diff==='easy'?' selected':''}>基础</option><option value="medium"${quizState.diff==='medium'?' selected':''}>中等</option><option value="hard"${quizState.diff==='hard'?' selected':''}>提高</option></select></div>
      <div class="field"><label>题数</label><select id="quizCount">${[3,5,8,10].map(n=>`<option value="${n}"${quizState.count===n?' selected':''}>${n} 题</option>`).join('')}</select></div>
      <div class="field"><label>快捷</label><div style="display:flex;gap:6px;flex-wrap:wrap"><button class="btn" id="preset5">课前5题</button><button class="btn" id="preset3">巩固3题</button><button class="btn" id="presetMix">模拟卷6题</button></div></div>
    </div>
    <div id="quizExportArea">${problems}</div>
    ${quizState.problems.length ? `<div class="export-bar quiz-export-bar">
      <button class="btn" id="btnExportQuizImg">📷 导出题目长图</button>
      <button class="btn" id="btnExportQuizAns">📷 导出含答案长图</button>
    </div>` : ''}
  </div>`;
}

function renderMistakes() {
  const filterTopic = window._mfTopic || '';
  const filterSource = window._mfSource || '';
  const search = window._mfSearch || '';
  let list = [...mistakes].sort((a,b)=>b.date.localeCompare(a.date)||b.createdAt.localeCompare(a.createdAt));
  if (filterTopic) list = list.filter(m=>m.topic===filterTopic);
  if (filterSource) list = list.filter(m=>m.source===filterSource);
  if (search) list = list.filter(m=>[m.problem,m.wrongReason,m.correctSolution,m.student,m.note].join(' ').toLowerCase().includes(search.toLowerCase()));
  const unmastered = list.filter(m=>!m.mastered).length;
  let weakBanner = '';
  if (mistakes.filter(m => !m.mastered).length) {
    const map = {};
    mistakes.filter(m => !m.mastered).forEach(m => { map[m.topic] = (map[m.topic] || 0) + 1; });
    const top = Object.entries(map).sort((a, b) => b[1] - a[1])[0];
    if (top) weakBanner = `<div class="card" style="margin-bottom:14px;background:var(--accent-bg);border-color:#f0d4dc"><div class="card-body" style="font-size:.84rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px"><span>📊 薄弱最多：<b>${topicName(top[0])}</b>（${top[1]} 道待巩固）</span><button class="btn btn-primary" style="padding:8px 14px" onclick="view='weakness';render()">详细分析 →</button></div></div>`;
  }
  let body = '';
  if (!list.length) {
    body = `<div class="note-empty"><h2>还没有错题记录</h2><p>上课时遇到学生典型错误，点右上角「+ 记录错题」即可归档</p><p style="margin-top:8px;font-size:.82rem">支持标注来源：家教 / 校内上课 / 作业 / 考试</p></div>`;
  } else {
    let lastDate = '';
    body = '<div class="note-list">';
    list.forEach(m => {
      if (m.date !== lastDate) { body += `<div class="date-divider">${fmtDate(m.date)}</div>`; lastDate = m.date; }
      body += `<div class="note-card">
        <div class="note-actions">
          ${m.mastered?'':'<button onclick="toggleMastered(\''+m.id+'\')">✓ 已掌握</button>'}
          <button onclick="openMistakeForm('${m.id}')">编辑</button>
          <button class="btn-danger" onclick="delMistake('${m.id}')">删除</button>
        </div>
        <div class="note-head">
          <span class="tag tag-topic">${esc(topicName(m.topic))}</span>
          <span class="tag tag-source">${esc(m.source)}</span>
          ${m.student?`<span class="tag tag-type">${esc(m.student)}</span>`:''}
          ${m.mastered?'<span class="tag tag-mastered">已掌握</span>':''}
        </div>
        <div class="note-block"><b>题目 / 错误表现</b>${esc(m.problem)}</div>
        ${m.wrongReason?`<div class="note-block"><b>错因分析</b>${esc(m.wrongReason)}</div>`:''}
        ${m.correctSolution?`<div class="note-block"><b>正确解法</b>${esc(m.correctSolution)}</div>`:''}
        ${m.note?`<div class="note-block"><b>备注</b>${esc(m.note)}</div>`:''}
      </div>`;
    });
    body += '</div>';
  }
  return `<div class="content-inner">
    <h2 class="section-title">错题本</h2>
    <p class="section-desc">记录学生典型错误，按日期归档 · 共 ${mistakes.length} 条，待巩固 ${unmastered} 条</p>
    <div class="note-toolbar">
      <input type="search" placeholder="搜索错题内容…" value="${esc(search)}" oninput="window._mfSearch=this.value;render()" style="flex:1;min-width:160px">
      <select onchange="window._mfTopic=this.value;render()"><option value="">全部章节</option>${TOPICS.map(t=>`<option value="${t.id}"${filterTopic===t.id?' selected':''}>${t.name}</option>`).join('')}</select>
      <select onchange="window._mfSource=this.value;render()"><option value="">全部来源</option>${SOURCES.map(s=>`<option${filterSource===s?' selected':''}>${s}</option>`).join('')}</select>
    </div>
    ${weakBanner}
    ${body}
  </div>`;
}

function renderNotes() {
  const search = window._nfSearch || '';
  let list = [...notes].sort((a,b)=>b.date.localeCompare(a.date)||b.createdAt.localeCompare(a.createdAt));
  if (search) list = list.filter(n=>[n.content,n.homework,n.reflection,n.topics?.join('')].join(' ').toLowerCase().includes(search.toLowerCase()));
  let body = '';
  if (!list.length) {
    body = `<div class="note-empty"><h2>还没有教学笔记</h2><p>每上完一节家教或校内课，花 1 分钟记下要点和作业</p><p style="margin-top:8px;font-size:.82rem">日后备课、复习、写教案都能快速回顾</p></div>`;
  } else {
    let lastDate = '';
    body = '<div class="note-list">';
    list.forEach(n => {
      if (n.date !== lastDate) { body += `<div class="date-divider">${fmtDate(n.date)}</div>`; lastDate = n.date; }
      body += `<div class="note-card">
        <div class="note-actions">
          <button onclick="openNoteForm('${n.id}')">编辑</button>
          <button class="btn-danger" onclick="delNote('${n.id}')">删除</button>
        </div>
        <div class="note-head">
          <span class="tag tag-source">${esc(n.type)}</span>
          ${(n.topics||[]).map(t=>`<span class="tag tag-topic">${esc(t)}</span>`).join('')}
        </div>
        <div class="note-block"><b>教学内容</b>${esc(n.content)}</div>
        ${n.homework?`<div class="note-block"><b>布置作业</b>${esc(n.homework)}</div>`:''}
        ${n.reflection?`<div class="note-block"><b>教学反思</b>${esc(n.reflection)}</div>`:''}
      </div>`;
    });
    body += '</div>';
  }
  return `<div class="content-inner">
    <h2 class="section-title">教学笔记</h2>
    <p class="section-desc">记录每天的教学内容、作业与反思 · 支持 🎤 语音转文字 · 共 ${notes.length} 篇</p>
    <div class="note-toolbar">
      <input type="search" placeholder="搜索笔记…" value="${esc(search)}" oninput="window._nfSearch=this.value;render()" style="flex:1;min-width:160px">
    </div>
    ${body}
  </div>`;
}

function doSearch(q) {
  q = q.trim().toLowerCase();
  if (!q) { render(); return; }
  const results = [];
  DATA.forEach(d => {
    const match = t => t.toLowerCase().includes(q);
    if (match(d.name) || d.keywords.some(k=>match(k))) results.push({cat:d.name,title:d.name,snippet:d.desc,id:d.id});
    d.formulas.forEach(f=>{ if(match(f.n)||match(f.f.replace(/<[^>]+>/g,''))) results.push({cat:d.name,title:f.n,snippet:f.f.replace(/<[^>]+>/g,'').slice(0,60),id:d.id}); });
    d.points.forEach(p=>{ if(match(p.t)||match(p.c.replace(/<[^>]+>/g,''))) results.push({cat:d.name,title:p.t,snippet:p.c.replace(/<[^>]+>/g,'').slice(0,60),id:d.id}); });
  });
  if (typeof customFormulas !== 'undefined') customFormulas.forEach(f=>{
    if(match(f.name)||match(f.content.replace(/<[^>]+>/g,''))) results.push({cat:topicName(f.topic),title:'✨'+f.name,snippet:f.content.replace(/<[^>]+>/g,'').slice(0,60),id:f.topic,custom:true});
  });
  const c = $('#content');
  if (!results.length) { c.innerHTML = `<div class="content-inner note-empty"><h2>未找到</h2><p>试试"椭圆""导数""等差"</p></div>`; return; }
  c.innerHTML = `<div class="content-inner"><h2 class="section-title">搜索「${esc(q)}」</h2><p class="section-desc">找到 ${results.length} 条</p><div class="search-results">
    ${results.slice(0,40).map(r=>`<div class="result-item" data-id="${r.id}"><div class="result-cat">${r.cat}</div><div class="result-title">${r.title}</div><div class="result-snippet">${r.snippet}</div></div>`).join('')}
  </div></div>`;
  c.querySelectorAll('.result-item').forEach(el=>{ el.onclick=()=>{ view='section'; sectionId=el.dataset.id; $('#searchInput').value=''; render(); }; });
}

// ═══════════════════════════════════════
//  错题本 / 笔记 CRUD
// ═══════════════════════════════════════
function closeModal() { if (typeof stopVoiceInput === 'function') stopVoiceInput(); $('#modal').classList.remove('show'); }

function openMistakeForm(id) {
  const m = id ? mistakes.find(x=>x.id===id) : null;
  const stuList = typeof students !== 'undefined' ? students : [];
  $('#modalTitle').textContent = m ? '编辑错题' : '记录错题';
  $('#modalBody').innerHTML = `
    <div class="form-row-2">
      <div class="form-row"><label>日期</label><input type="date" id="fDate" value="${m?.date||today()}"></div>
      <div class="form-row"><label>来源</label><select id="fSource">${SOURCES.map(s=>`<option${(m?.source||'家教')===s?' selected':''}>${s}</option>`).join('')}</select></div>
    </div>
    <div class="form-row-2">
      <div class="form-row"><label>章节</label><select id="fTopic">${TOPICS.map(t=>`<option value="${t.id}"${(m?.topic||'func')===t.id?' selected':''}>${t.name}</option>`).join('')}</select></div>
      <div class="form-row"><label>学生</label><select id="fStudentId"><option value="">不指定</option>${stuList.map(s=>`<option value="${s.id}"${m?.studentId===s.id?' selected':''}>${esc(s.name)}</option>`).join('')}</select></div>
    </div>
    <div class="form-row"><label>题目 / 错误表现 *</label><textarea id="fProblem" placeholder="写下题目或学生错在哪里">${esc(m?.problem||'')}</textarea></div>
    <div class="form-row"><label>错因分析</label><textarea id="fWrong" placeholder="概念混淆？计算失误？审题不清？">${esc(m?.wrongReason||'')}</textarea></div>
    <div class="form-row"><label>正确解法</label><textarea id="fCorrect" placeholder="写出正确思路和答案">${esc(m?.correctSolution||'')}</textarea></div>
    <div class="form-row"><label>备注</label><input id="fNote" value="${esc(m?.note||'')}" placeholder="课后需巩固、下次重点讲…"></div>`;
  $('#modalFooter').innerHTML = `<button class="btn" onclick="closeModal()">取消</button><button class="btn btn-primary" id="fSave">保存</button>`;
  $('#modal').classList.add('show');
  $('#fSave').onclick = () => {
    const problem = $('#fProblem').value.trim();
    if (!problem) { toast('请填写题目或错误表现'); return; }
    const sid = $('#fStudentId').value;
    const stu = stuList.find(s=>s.id===sid);
    const item = {
      id: m?.id||uid(), date: $('#fDate').value, topic: $('#fTopic').value,
      source: $('#fSource').value, studentId:sid, student: stu?.name||'',
      problem, wrongReason: $('#fWrong').value.trim(), correctSolution: $('#fCorrect').value.trim(),
      note: $('#fNote').value.trim(), mastered: m?.mastered||false,
      createdAt: m?.createdAt||new Date().toISOString()
    };
    if (m) mistakes = mistakes.map(x=>x.id===id?item:x); else mistakes.unshift(item);
    save('math-mistakes', mistakes); closeModal(); render(); toast('错题已保存');
  };
}

function openNoteForm(id, autoVoice) {
  const n = id ? notes.find(x=>x.id===id) : null;
  $('#modalTitle').textContent = n ? '编辑笔记' : '今日教学笔记';
  const selected = n?.topics || [];
  $('#modalBody').innerHTML = `
    <div class="form-row-2">
      <div class="form-row"><label>日期</label><input type="date" id="nDate" value="${n?.date||today()}"></div>
      <div class="form-row"><label>类型</label><select id="nType">${NOTE_TYPES.map(t=>`<option${(n?.type||'家教授课')===t?' selected':''}>${t}</option>`).join('')}</select></div>
    </div>
    <div class="form-row"><label>涉及章节（可多选，逗号分隔）</label>
      <input id="nTopics" value="${esc(selected.join('、'))}" placeholder="如：函数、导数、数列">
      <div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:4px">${TOPICS.map(t=>`<span class="chip" onclick="addTopicChip('${t.name}')">${t.name}</span>`).join('')}</div>
    </div>
    <div class="voice-bar">
      <button type="button" class="btn" id="btnVoiceStart">🎤 语音记重点</button>
      <button type="button" class="btn" id="btnVoiceStop">⏹ 停止</button>
      <span class="voice-status" id="voiceStatus"></span>
    </div>
    <div class="form-row"><label>教学内容 *</label><textarea id="nContent" placeholder="今天讲了什么？也可点上方麦克风语音输入～">${esc(n?.content||'')}</textarea></div>
    <div class="form-row"><label>布置作业</label><input id="nHomework" value="${esc(n?.homework||'')}" placeholder="练习册页码、题目编号"></div>
    <div class="form-row"><label>教学反思</label><textarea id="nReflection" placeholder="下次改进点、需要补讲的内容">${esc(n?.reflection||'')}</textarea></div>`;
  $('#modalFooter').innerHTML = `<button class="btn" onclick="closeModal()">取消</button><button class="btn btn-primary" id="nSave">保存</button>`;
  $('#modal').classList.add('show');
  const vs = document.getElementById('btnVoiceStart');
  const ve = document.getElementById('btnVoiceStop');
  if (vs) vs.onclick = () => { if (typeof startVoiceToText === 'function') startVoiceToText('#nContent', '#voiceStatus'); };
  if (ve) ve.onclick = () => { if (typeof stopVoiceInput === 'function') stopVoiceInput(true); };
  if (autoVoice) {
    const st = document.getElementById('voiceStatus');
    if (st) st.textContent = '点「语音记重点」开始说话～';
  }
  $('#nSave').onclick = () => {
    if (typeof stopVoiceInput === 'function') stopVoiceInput();
    const content = $('#nContent').value.trim();
    if (!content) { toast('请填写教学内容'); return; }
    const topics = $('#nTopics').value.split(/[,，、]/).map(s=>s.trim()).filter(Boolean);
    const item = {
      id: n?.id||uid(), date: $('#nDate').value, type: $('#nType').value,
      topics, content, homework: $('#nHomework').value.trim(),
      reflection: $('#nReflection').value.trim(), createdAt: n?.createdAt||new Date().toISOString()
    };
    if (n) notes = notes.map(x=>x.id===id?item:x); else notes.unshift(item);
    save('math-notes', notes); closeModal(); render(); toast('笔记已保存');
  };
}

window.addTopicChip = name => {
  const inp = $('#nTopics');
  const cur = inp.value.trim();
  if (!cur.split(/[,，、]/).map(s=>s.trim()).includes(name)) inp.value = cur ? cur+'、'+name : name;
};

function delMistake(id) { if(confirm('确定删除这条错题？')) { mistakes=mistakes.filter(m=>m.id!==id); save('math-mistakes',mistakes); render(); toast('已删除'); } }
function delNote(id) { if(confirm('确定删除这篇笔记？')) { notes=notes.filter(n=>n.id!==id); save('math-notes',notes); render(); toast('已删除'); } }
function toggleMastered(id) { mistakes=mistakes.map(m=>m.id===id?{...m,mastered:true}:m); save('math-mistakes',mistakes); render(); toast('已标记掌握'); }

window.toggleAns = i => { document.getElementById('ans-'+i)?.classList.toggle('show'); };
window.regenOne = i => {
  const ids = quizState.problems.map(p=>p.bankId).filter(Boolean);
  const next = pickOneProblem(ids);
  if (!next) { toast('没有更多不重复题目可换'); return; }
  quizState.problems[i] = {...next, idx:i+1};
  render();
};

function exportData(type) {
  const data = type==='mistakes' ? mistakes : notes;
  const name = type==='mistakes' ? '错题本' : '教学笔记';
  downloadJSON(data, `高中数学${name}_${today()}.json`);
  toast('已导出 '+name);
}

function exportAll() { if (typeof doExportAll === 'function') doExportAll(); else { downloadJSON({mistakes,notes,favs,formulaFavs,quizFavs,exportDate:today()}, `备份_${today()}.json`); toast('已备份'); } }

function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; a.click();
}

// ═══════════════════════════════════════
//  公式编辑 / 手写 / 图形
// ═══════════════════════════════════════
const LATEX_SNIPPETS = [
  {l:'\\frac{a}{b}',d:'分数'},{l:'\\sqrt{x}',d:'根号'},{l:'x^{2}',d:'上标'},{l:'x_{n}',d:'下标'},
  {l:'\\sum_{i=1}^{n}',d:'求和'},{l:'\\int_{a}^{b}',d:'积分'},{l:'\\lim_{x\\to 0}',d:'极限'},
  {l:'\\sin\\theta',d:'sin'},{l:'\\cos\\theta',d:'cos'},{l:'\\tan\\theta',d:'tan'},
  {l:'\\alpha,\\beta,\\gamma',d:'希腊字母'},{l:'\\Delta,\\pi',d:'Δπ'},
  {l:'\\begin{cases} x \\\\ y \\end{cases}',d:'方程组'},{l:'\\vec{a}',d:'向量'},
  {l:'\\overrightarrow{AB}',d:'有向线段'},{l:'\\angle ABC',d:'角'},
  {l:'\\triangle ABC',d:'三角形'},{l:'\\perp',d:'垂直'},{l:'\\parallel',d:'平行'},
  {l:'\\leq,\\geq,\\neq',d:'不等号'},{l:'\\in,\\subset',d:'集合'},
  {l:'\\log_a b',d:'对数'},{l:'\\binom{n}{k}',d:'组合数'}
];

function renderLatex(tex) {
  const el = document.getElementById('latexPreview');
  if (!el) return;
  try {
    if (typeof katex !== 'undefined') katex.render(tex||'\\text{输入 LaTeX 预览公式}', el, {throwOnError:false,displayMode:true});
    else el.textContent = tex || '加载 KaTeX 中…';
  } catch(e) { el.textContent = tex; }
}

let _latexCaret = { s: 0, e: 0 };
function syncLatexCaret(ta) {
  if (!ta) return;
  _latexCaret = { s: ta.selectionStart, e: ta.selectionEnd };
}
function insertLatexAtCursor(textarea, text) {
  if (!textarea) return;
  const s = _latexCaret.s ?? textarea.selectionStart;
  const e = _latexCaret.e ?? textarea.selectionEnd;
  const before = textarea.value.slice(0, s);
  const after = textarea.value.slice(e);
  const gap = (before && !before.endsWith(' ') && !text.startsWith(' ')) ? ' ' : '';
  const gap2 = (after && !after.startsWith(' ') && !text.endsWith(' ')) ? ' ' : '';
  const ins = gap + text + gap2;
  textarea.value = before + ins + after;
  const pos = before.length + ins.length;
  textarea.selectionStart = textarea.selectionEnd = pos;
  _latexCaret = { s: pos, e: pos };
  textarea.focus();
}

function renderFormula() {
  const saved = load('math-latex', 'f(x) = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}');
  return `<div class="content-inner">
    <h2 class="section-title">公式编辑器 ✏️</h2>
    <p class="section-desc">点符号插入 · 实时预览 · 保存图片发微信（手机推荐）</p>
    <div class="card"><div class="card-body">
      <div class="latex-btns">${LATEX_SNIPPETS.map((s,i)=>`<button type="button" class="latex-snippet-btn" data-ltx="${i}" title="${esc(s.d)}">${s.d}</button>`).join('')}</div>
      <textarea class="latex-input" id="latexInput" placeholder="输入 LaTeX" rows="3" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">${esc(saved)}</textarea>
      <div class="formula-export-box" id="formulaExportArea">
        <div class="latex-preview" id="latexPreview" style="border:none;background:transparent;margin:0;padding:8px"></div>
      </div>
      <div class="formula-action-bar">
        <button class="btn btn-primary" id="btnCopyLatex">📋 复制 LaTeX 代码</button>
        <button class="btn" id="btnSaveImg">💾 保存为图片</button>
        <button class="btn" id="btnShareImg">📤 分享图片</button>
        <button class="btn" id="btnSaveLatex">保存草稿</button>
      </div>
    </div></div>
    <div class="card"><div class="card-header">常用模板</div><div class="card-body" style="font-size:.84rem;color:var(--text2)">
      <p>二次求根、椭圆、双曲线等 — 点上方按钮快速插入</p>
    </div></div>
  </div>`;
}

function renderChat() {
  return `<div class="content-inner chat-page">
    <h2 class="section-title">悄悄话 💬</h2>
    <p class="section-desc">专属两人的聊天，文字语音图片都会永久保存</p>
    <div class="love-sync-panel sync-panel-mini">
      <div class="love-sync-head">
        <span class="sync-dot off" id="syncDot"></span>
        <span class="love-sync-title">💕 在线状态</span>
        <span class="love-sync-status" id="syncStatus">连接中…</span>
      </div>
      <div class="sync-panel-body">
        <div class="chat-presence-bar love-sync-presence" id="syncPresence">等待 TA 上线…</div>
      </div>
    </div>
    <div class="chat-messages" id="chatMessages"><p class="chat-empty">加载中…</p></div>
    <div class="chat-input-bar">
      <textarea id="chatInput" placeholder="说点什么…" rows="1" maxlength="800"></textarea>
      <div class="chat-input-actions">
        <button type="button" id="chatPickImg" title="图片">🖼</button>
        <button type="button" id="chatPickVideo" title="视频">🎬</button>
        <button type="button" id="chatVoiceBtn" title="语音">🎤</button>
        <button type="button" class="btn btn-primary" id="chatSendBtn" style="min-height:44px;padding:0 16px">发送</button>
      </div>
      <input type="file" id="chatImgInput" accept="image/*" hidden>
      <input type="file" id="chatVideoInput" accept="video/*" hidden>
    </div>
  </div>`;
}

function renderPhotos() {
  return `<div class="content-inner photo-share-page">
    <h2 class="section-title">暖光相簿</h2>
    <p class="section-desc">我们的专属小相馆，存放照片和留言</p>
    <div class="love-sync-panel">
      <div class="love-sync-head">
        <span class="sync-dot off" id="syncDot"></span>
        <span class="love-sync-title">暖光相簿</span>
        <span class="love-sync-status" id="syncStatus">连接中…</span>
      </div>
      <div class="sync-panel-body">
        <div class="love-sync-presence" id="syncPresence">已连接云端，照片实时同步</div>
        <button type="button" class="btn" data-go="chat" style="margin-top:8px;width:100%">💬 去悄悄话</button>
      </div>
    </div>
    <div class="photo-upload-card">
      <p>选照片，可加留言，发给 TA</p>
      <input type="text" class="photo-caption-input" id="photoCaption" placeholder="留言（可选）" maxlength="120">
      <input type="file" id="photoFileInput" accept="image/*" hidden>
      <div class="photo-upload-btns">
        <button type="button" class="btn btn-primary" id="btnPickPhoto">🖼 从相册选</button>
        <button type="button" class="btn" id="btnTakePhoto">📸 拍一张</button>
      </div>
    </div>
    <div class="sync-history-title">我们的相册</div>
    <div class="photo-gallery" id="photoGallery"></div>
  </div>`;
}

const PAINT_PALETTE = ['#000000','#545454','#8b4513','#e60012','#f97316','#f5e617','#22c55e','#06b6d4','#3b82f6','#a855f7','#ffffff','#c0c0c0','#e8b4bc','#fda4af','#fde047','#fef3c7','#86efac','#7dd3fc','#93c5fd','#d8b4fe'];

function renderDraw() {
  const mob = typeof window !== 'undefined' && window.matchMedia('(max-width:768px)').matches;
  const penDef = load('math-pen-size', mob ? 8 : 4);
  const penMax = mob ? 22 : 14;
  const toolsCollapsed = mob ? (window._drawToolsCollapsed !== false) : false;
  const syncPanelMini = !mob;
  const palBtns = PAINT_PALETTE.map(c => `<button type="button" class="paint-pal" data-color="${c}" style="background:${c}" title="${c}"></button>`).join('');
  return `<div class="content-inner draw-page">
    <h2 class="section-title">双人画板 💕</h2>
    <p class="section-desc">${mob ? '和 TA 实时同屏 · 大画布手写 · 云端永久保存' : '专属双人小屋 · 画笔/形状/填色 · 你画她看见 · 还可存入回忆相册'}</p>
    <div class="love-sync-panel${syncPanelMini ? ' sync-panel-mini' : ''}${syncPanelMini && window._syncPanelExpanded ? ' expanded' : ''}" id="loveSyncPanel">
      <div class="love-sync-head">
        <span class="sync-dot off" id="syncDot"></span>
        <span class="love-sync-title">🎀 双人小屋</span>
        <span class="love-sync-status" id="syncStatus">连接中…</span>
        ${mob ? '<button type="button" class="draw-head-btn" id="syncPanelToggle" style="margin-left:auto;min-width:44px;min-height:36px;padding:0 10px;font-size:.8rem">📡 同步</button>' : ''}
      </div>
      <div class="sync-panel-body">
        <div class="love-sync-presence" id="syncPresence">两台手机打开同一链接，选好人设即可实时同步</div>
        <div class="love-sync-actions">
          <button type="button" class="btn btn-primary" id="syncSetupBtn">☁️ 连接云端</button>
          <button type="button" class="btn btn-primary" id="syncSaveHistory">📷 存入回忆</button>
          <button type="button" class="btn" data-go="photos">🖼 暖光相簿</button>
          <button type="button" class="btn" data-go="chat">💬 悄悄话</button>
          <button type="button" class="btn" id="syncHelpBtn">💡 说明</button>
        </div>
        <div class="sync-history-wrap">
          <div class="sync-history-title">我们的回忆相册</div>
          <div class="sync-history-scroll" id="syncHistory"></div>
        </div>
      </div>
    </div>
    <div class="draw-mobile-head">
      <span class="draw-mobile-title">🖊️ 画板<span class="sync-dot-mobile off" id="syncDotMobile"></span></span>
      <div class="draw-head-actions">
        <button type="button" class="draw-head-btn" id="syncSheetBtn" title="同步/回忆">📡</button>
        <button type="button" class="draw-head-btn" id="drawVoiceBtn">🎤</button>
        <button type="button" class="draw-head-btn" id="drawToggleTools">${toolsCollapsed ? '工具' : '收起'}</button>
      </div>
    </div>
    <p class="draw-voice-hint" id="drawVoiceStatus">正在听…</p>
    <div class="draw-canvas-area">
      <div class="canvas-wrap draw-canvas-wrap" id="drawCanvasWrap"><canvas id="drawCanvas"></canvas></div>
    </div>
    <div class="draw-quick-bar" id="drawQuickBar">
      <button type="button" class="dq-btn on" data-qtool="pen" title="画笔">✏️</button>
      <button type="button" class="dq-btn" data-qtool="eraser" title="橡皮">🧹</button>
      <button type="button" class="dq-btn" id="dqUndo" title="撤销">↩</button>
      <button type="button" class="dq-swatch" id="dqColor" title="颜色"></button>
      <button type="button" class="dq-btn" id="dqClear" title="清空">🗑</button>
    </div>
    <div class="draw-tools-panel${toolsCollapsed ? ' collapsed' : ''}" id="drawToolsPanel">
      <div class="paint-bar">
        <div class="paint-group">
          <span class="paint-group-label">工具</span>
          <div class="paint-tools">
            <button type="button" class="paint-btn on" data-tool="pen" title="画笔">✏️</button>
            <button type="button" class="paint-btn" data-tool="fill" title="油漆桶">🪣</button>
            <button type="button" class="paint-btn" data-tool="text" title="文字">A</button>
            <button type="button" class="paint-btn" data-tool="eraser" title="橡皮">🧹</button>
            <button type="button" class="paint-btn" data-tool="picker" title="吸管">💧</button>
          </div>
        </div>
        <div class="paint-group">
          <span class="paint-group-label">形状</span>
          <div class="paint-tools">
            <button type="button" class="paint-shape-btn" data-shape="line" title="直线">╱</button>
            <button type="button" class="paint-shape-btn" data-shape="rect" title="矩形">▭</button>
            <button type="button" class="paint-shape-btn" data-shape="ellipse" title="椭圆">◯</button>
            <button type="button" class="paint-shape-btn" data-shape="arrow" title="箭头">➜</button>
            <button type="button" class="paint-shape-btn" data-shape="heart" title="爱心">♥</button>
          </div>
          <div class="paint-fill-toggle">
            <button type="button" id="shapeStroke" class="on">轮廓</button>
            <button type="button" id="shapeFillBtn">填充</button>
          </div>
        </div>
      </div>
      <div class="paint-colors">
        <div class="paint-color-pair">
          <button type="button" class="paint-swatch primary" id="colorPrimary" style="background:#45403c"></button>
          <button type="button" class="paint-swap" id="colorSwap" title="交换颜色">⇄</button>
          <button type="button" class="paint-swatch secondary" id="colorSecondary" style="background:#ffffff"></button>
          <input type="color" id="penColor" value="#45403c" hidden>
        </div>
        <div class="paint-palette" id="paintPalette">${palBtns}</div>
      </div>
      <div class="draw-pen-row">
        <span class="draw-pen-label">粗细</span>
        <input type="range" id="penSize" min="2" max="${penMax}" value="${penDef}">
        <span class="draw-pen-val" id="penSizeVal">${penDef}</span>
      </div>
      <div class="paint-extra-row">
        <button type="button" class="btn" id="undoCanvas">↩ 撤销</button>
        <button type="button" class="btn" id="drawVoiceBtn2">🎤 语音</button>
      </div>
      <div class="draw-actions">
        <button type="button" class="btn" id="clearCanvas">🗑 清空</button>
        <button type="button" class="btn btn-primary" id="saveCanvas">💾 保存</button>
        <button type="button" class="btn" id="shareCanvas">📤 分享</button>
      </div>
    </div>
  </div>`;
}

function renderGraph() {
  const g = graphState;
  return `<div class="content-inner">
    <h2 class="section-title">图形绘制 📈</h2>
    <p class="section-desc">快速绘制函数图像，拖动参数实时预览 · 适合课堂演示</p>
    <div class="graph-panel">
      <div>
        <canvas id="graphCanvas" class="graph-canvas" width="560" height="400"></canvas>
        <div style="margin-top:8px;display:flex;gap:8px">
          <button class="btn btn-primary" id="saveGraph">保存图像</button>
          <button class="btn" id="resetGraph">重置参数</button>
        </div>
      </div>
      <div class="graph-controls">
        <div class="form-row"><label>函数类型</label>
          <select id="graphType">
            <option value="quadratic"${g.type==='quadratic'?' selected':''}>二次函数 y=ax²+bx+c</option>
            <option value="linear"${g.type==='linear'?' selected':''}>一次函数 y=kx+b</option>
            <option value="sin"${g.type==='sin'?' selected':''}>正弦 y=A·sin(ωx+φ)</option>
            <option value="cos"${g.type==='cos'?' selected':''}>余弦 y=A·cos(ωx+φ)</option>
            <option value="ellipse"${g.type==='ellipse'?' selected':''}>椭圆 x²/a²+y²/b²=1</option>
            <option value="hyperbola"${g.type==='hyperbola'?' selected':''}>双曲线 x²/a²−y²/b²=1</option>
            <option value="parabola"${g.type==='parabola'?' selected':''}>抛物线 y²=2px</option>
          </select>
        </div>
        <div id="graphSliders"></div>
        <div style="font-size:.78rem;color:var(--text2);margin-top:8px" id="graphEq"></div>
      </div>
    </div>
  </div>`;
}

function initFormula() {
  const inp = document.getElementById('latexInput');
  if (!inp) return;
  syncLatexCaret(inp);
  renderLatex(inp.value);
  inp.oninput = () => { syncLatexCaret(inp); renderLatex(inp.value); };
  inp.onkeyup = inp.onmouseup = inp.onselect = () => syncLatexCaret(inp);
  inp.onblur = () => syncLatexCaret(inp);
  document.querySelectorAll('.latex-snippet-btn').forEach(btn => {
    const idx = +btn.dataset.ltx;
    const insert = () => {
      const raw = LATEX_SNIPPETS[idx]?.l;
      if (!raw) return;
      insertLatexAtCursor(inp, raw);
      renderLatex(inp.value);
      btn.classList.add('ltx-flash');
      setTimeout(() => btn.classList.remove('ltx-flash'), 280);
    };
    btn.onmousedown = e => e.preventDefault();
    btn.onclick = insert;
  });
  const copyBtn = document.getElementById('btnCopyLatex');
  if (copyBtn) copyBtn.onclick = () => {
    const raw = inp.value;
    if (typeof copyLatexRaw === 'function') copyLatexRaw(raw);
    else if (typeof copyText === 'function') copyText(raw);
    else navigator.clipboard?.writeText(raw);
  };
  const saveBtn = document.getElementById('btnSaveLatex');
  if (saveBtn) saveBtn.onclick = () => { save('math-latex', inp.value); toast('草稿已保存'); };
  $('#btnSaveImg')?.addEventListener('click', () => exportElementImage('#formulaExportArea', `公式_${today()}.png`));
  $('#btnShareImg')?.addEventListener('click', () => exportElementImage('#formulaExportArea', `公式_${today()}.png`));
}

let drawCtx, drawing=false, drawMode='pen', lastPt=null, drawHistory=[], voiceDrawY=40, _drawActivePointer=null;
let shapeType='line', shapeFilled=false, shapeStart=null, shapeSnapshot=null;
let paintPrimary='#45403c', paintSecondary='#ffffff';

function getDrawColor() {
  const el = document.getElementById('penColor');
  return el?.value || paintPrimary;
}
function getPenSize() {
  return +($('#penSize')?.value || 6);
}
function syncPaintSwatches() {
  const p = document.getElementById('colorPrimary');
  const s = document.getElementById('colorSecondary');
  const h = document.getElementById('penColor');
  const dq = document.getElementById('dqColor');
  if (p) p.style.background = paintPrimary;
  if (s) s.style.background = paintSecondary;
  if (h) h.value = paintPrimary;
  if (dq) dq.style.background = paintPrimary;
}
function setPaintPrimary(c) {
  paintPrimary = c;
  syncPaintSwatches();
  document.querySelectorAll('.paint-pal').forEach(b => b.classList.toggle('on', b.dataset.color === c));
}
function getCanvasSnap() {
  const c = document.getElementById('drawCanvas');
  if (!c || !drawCtx) return null;
  drawCtx.save();
  drawCtx.setTransform(1, 0, 0, 1, 0, 0);
  const img = drawCtx.getImageData(0, 0, c.width, c.height);
  drawCtx.restore();
  const dpr = window.devicePixelRatio || 1;
  drawCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return img;
}
function putCanvasSnap(img) {
  const c = document.getElementById('drawCanvas');
  if (!c || !img) return;
  const dpr = window.devicePixelRatio || 1;
  drawCtx.save();
  drawCtx.setTransform(1, 0, 0, 1, 0, 0);
  drawCtx.putImageData(img, 0, 0);
  drawCtx.restore();
  drawCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
function floodFillAt(cx, cy) {
  const canvas = document.getElementById('drawCanvas');
  if (!canvas || !drawCtx) return;
  const dpr = window.devicePixelRatio || 1;
  const x = Math.floor(cx * dpr), y = Math.floor(cy * dpr);
  drawCtx.save();
  drawCtx.setTransform(1, 0, 0, 1, 0, 0);
  const img = drawCtx.getImageData(0, 0, canvas.width, canvas.height);
  const d = img.data, w = img.width, h = img.height;
  if (x < 0 || y < 0 || x >= w || y >= h) { drawCtx.restore(); drawCtx.setTransform(dpr,0,0,dpr,0,0); return; }
  const i0 = (y * w + x) * 4;
  const tr = d[i0], tg = d[i0+1], tb = d[i0+2], ta = d[i0+3];
  const fill = hexToRgba(getDrawColor());
  if (tr === fill.r && tg === fill.g && tb === fill.b && ta === fill.a) { drawCtx.restore(); drawCtx.setTransform(dpr,0,0,dpr,0,0); return; }
  const stack = [[x, y]];
  const match = (i) => d[i] === tr && d[i+1] === tg && d[i+2] === tb && d[i+3] === ta;
  while (stack.length) {
    const [px, py] = stack.pop();
    const idx = (py * w + px) * 4;
    if (!match(idx)) continue;
    d[idx] = fill.r; d[idx+1] = fill.g; d[idx+2] = fill.b; d[idx+3] = fill.a;
    if (px > 0) stack.push([px-1, py]);
    if (px < w-1) stack.push([px+1, py]);
    if (py > 0) stack.push([px, py-1]);
    if (py < h-1) stack.push([px, py+1]);
  }
  drawCtx.putImageData(img, 0, 0);
  drawCtx.restore();
  drawCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
function hexToRgba(hex) {
  const h = (hex || '#000').replace('#', '');
  const n = h.length === 3 ? h.split('').map(c => c+c).join('') : h;
  return { r: parseInt(n.slice(0,2),16), g: parseInt(n.slice(2,4),16), b: parseInt(n.slice(4,6),16), a: 255 };
}
function pickColorAt(p) {
  const canvas = document.getElementById('drawCanvas');
  if (!canvas || !drawCtx) return;
  const dpr = window.devicePixelRatio || 1;
  const x = Math.floor(p.x * dpr), y = Math.floor(p.y * dpr);
  drawCtx.save();
  drawCtx.setTransform(1, 0, 0, 1, 0, 0);
  const px = drawCtx.getImageData(x, y, 1, 1).data;
  drawCtx.restore();
  drawCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const hex = '#' + [px[0],px[1],px[2]].map(v => v.toString(16).padStart(2,'0')).join('');
  setPaintPrimary(hex);
  toast('已吸取颜色 ' + hex);
}
function drawShapeOnCtx(ctx, type, x1, y1, x2, y2, opts) {
  const color = opts.color || '#000';
  const lw = opts.lineWidth || 3;
  const fill = opts.filled;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lw;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const minX = Math.min(x1, x2), maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2), maxY = Math.max(y1, y2);
  const w = maxX - minX, h = maxY - minY;
  if (type === 'line' || type === 'arrow') {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    if (type === 'arrow') {
      const ang = Math.atan2(y2 - y1, x2 - x1);
      const len = Math.max(10, lw * 3);
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - len * Math.cos(ang - 0.4), y2 - len * Math.sin(ang - 0.4));
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - len * Math.cos(ang + 0.4), y2 - len * Math.sin(ang + 0.4));
      ctx.stroke();
    }
    return;
  }
  if (type === 'rect') {
    if (fill) ctx.fillRect(minX, minY, w, h);
    else ctx.strokeRect(minX, minY, w, h);
    return;
  }
  if (type === 'ellipse') {
    ctx.beginPath();
    ctx.ellipse(minX + w/2, minY + h/2, Math.max(w/2, 1), Math.max(h/2, 1), 0, 0, Math.PI * 2);
    fill ? ctx.fill() : ctx.stroke();
    return;
  }
  if (type === 'heart') {
    const cx = minX + w/2, cy = minY + h/2, sc = Math.max(w, h) / 30;
    ctx.beginPath();
    ctx.moveTo(cx, cy + 8 * sc);
    ctx.bezierCurveTo(cx - 15*sc, cy + 2*sc, cx - 15*sc, cy - 10*sc, cx, cy - 4*sc);
    ctx.bezierCurveTo(cx + 15*sc, cy - 10*sc, cx + 15*sc, cy + 2*sc, cx, cy + 8*sc);
    fill ? ctx.fill() : ctx.stroke();
  }
}
function placeDrawText(p, text) {
  if (!text) return;
  const sz = Math.max(16, getPenSize() * 3.2);
  drawCtx.font = `${sz}px "PingFang SC","Microsoft YaHei",sans-serif`;
  drawCtx.fillStyle = getDrawColor();
  drawCtx.fillText(text, p.x, p.y);
  pushDrawHistory();
  if (typeof window.syncPushCanvas === 'function') window.syncPushCanvas();
}
function getDrawLogicalPt(canvas, e) {
  const r = canvas.getBoundingClientRect();
  const cx = e.clientX ?? (e.touches?.[0]?.clientX ?? 0);
  const cy = e.clientY ?? (e.touches?.[0]?.clientY ?? 0);
  const dpr = window.devicePixelRatio || 1;
  const lw = canvas.width / dpr || r.width || 1;
  const lh = canvas.height / dpr || r.height || 1;
  const sx = lw / (r.width || lw);
  const sy = lh / (r.height || lh);
  return { x: (cx - r.left) * sx, y: (cy - r.top) * sy };
}
function getDrawLogicalSize(canvas) {
  const dpr = window.devicePixelRatio || 1;
  return { w: canvas.width / dpr || 1, h: canvas.height / dpr || 1 };
}
window.getDrawLogicalSize = getDrawLogicalSize;
function getDrawCanvasHeight(wrap) {
  const mob = window.matchMedia('(max-width:768px)').matches;
  if (!mob) return Math.max(280, Math.min(420, window.innerHeight * 0.42));
  const area = document.querySelector('.draw-canvas-area');
  const h = area?.clientHeight || wrap?.clientHeight || 0;
  if (h > 80) return Math.floor(h);
  const vh = window.visualViewport?.height || window.innerHeight;
  return Math.max(220, vh - (window.matchMedia('(orientation:landscape)').matches ? 100 : 168));
}
function resizeDrawCanvas(keepImage) {
  const canvas = document.getElementById('drawCanvas');
  if (!canvas || !drawCtx) return;
  const wrap = canvas.parentElement;
  const dpr = window.devicePixelRatio || 1;
  const w = Math.max(10, Math.floor(wrap?.clientWidth || 300));
  const h = Math.max(10, Math.floor(getDrawCanvasHeight(wrap)));
  let snapshotUrl = null;
  if (keepImage && canvas.width > 0 && canvas.height > 0) {
    try { snapshotUrl = canvas.toDataURL('image/jpeg', 0.9); } catch {}
  }
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  drawCtx.setTransform(1, 0, 0, 1, 0, 0);
  drawCtx.fillStyle = '#fff';
  drawCtx.fillRect(0, 0, canvas.width, canvas.height);
  if (snapshotUrl) {
    const img = new Image();
    img.onload = () => {
      drawCtx.drawImage(img, 0, 0, canvas.width, canvas.height);
      drawCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (typeof pushDrawHistory === 'function') pushDrawHistory();
    };
    img.src = snapshotUrl;
  }
  drawCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
function pushDrawHistory() {
  const c = document.getElementById('drawCanvas');
  if (!c || !drawCtx) return;
  try {
    drawCtx.save();
    drawCtx.setTransform(1, 0, 0, 1, 0, 0);
    drawHistory.push(drawCtx.getImageData(0, 0, c.width, c.height));
    drawCtx.restore();
    if (drawHistory.length > 20) drawHistory.shift();
  } catch {}
}
function clearDrawCanvas() {
  const c = document.getElementById('drawCanvas');
  if (!c || !drawCtx) return;
  if (typeof syncOnClear === 'function') syncOnClear();
  const dpr = window.devicePixelRatio || 1;
  drawCtx.save();
  drawCtx.setTransform(1, 0, 0, 1, 0, 0);
  drawCtx.fillStyle = '#fff';
  drawCtx.fillRect(0, 0, c.width, c.height);
  drawCtx.restore();
  drawCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawHistory = [];
  voiceDrawY = 40;
  pushDrawHistory();
  toast('画板已清空 ✓');
}
function undoDrawCanvas() {
  const c = document.getElementById('drawCanvas');
  if (!c || !drawCtx) return;
  if (drawHistory.length <= 1) { toast('没有可撤销的内容了'); return; }
  drawHistory.pop();
  const prev = drawHistory[drawHistory.length - 1];
  const dpr = window.devicePixelRatio || 1;
  drawCtx.save();
  drawCtx.setTransform(1, 0, 0, 1, 0, 0);
  drawCtx.putImageData(prev, 0, 0);
  drawCtx.restore();
  drawCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (typeof window.syncPushCanvas === 'function') window.syncPushCanvas();
  toast('已撤销一步');
}
function initDraw() {
  const canvas = document.getElementById('drawCanvas');
  const wrap = document.getElementById('drawCanvasWrap');
  if (!canvas) return;
  drawCtx = canvas.getContext('2d');
  if (!window._drawHistoryKeep) drawHistory = [];
  resizeDrawCanvas(!!window._drawHistoryKeep);
  window._drawHistoryKeep = false;
  if (!drawHistory.length) pushDrawHistory();
  voiceDrawY = 40;
  const toggleTools = () => {
    if (typeof syncPauseCanvas === 'function') syncPauseCanvas(5000);
    window._drawToolsCollapsed = !window._drawToolsCollapsed;
    const panel = document.getElementById('drawToolsPanel');
    const btn = document.getElementById('drawToggleTools');
    if (panel) panel.classList.toggle('collapsed', !!window._drawToolsCollapsed);
    if (btn) btn.textContent = window._drawToolsCollapsed ? '工具' : '收起';
    requestAnimationFrame(() => requestAnimationFrame(() => resizeDrawCanvas(true)));
  };
  const toggleBtn = document.getElementById('drawToggleTools');
  if (toggleBtn) toggleBtn.onclick = toggleTools;
  const bindVoice = e => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (typeof toggleVoiceOnCanvas === 'function') toggleVoiceOnCanvas('#drawVoiceStatus');
  };
  const wireVoiceBtn = el => {
    if (!el) return;
    el.onclick = bindVoice;
  };
  wireVoiceBtn(document.getElementById('drawVoiceBtn'));
  wireVoiceBtn(document.getElementById('drawVoiceBtn2'));
  const penSlider = document.getElementById('penSize');
  const penVal = document.getElementById('penSizeVal');
  if (penSlider) {
    penSlider.oninput = () => {
      if (penVal) penVal.textContent = penSlider.value;
      save('math-pen-size', +penSlider.value);
    };
  }
  canvas.style.touchAction = 'none';
  if (wrap) wrap.style.touchAction = 'none';
  const blockScroll = e => { if (drawing || e.target === canvas || wrap?.contains(e.target)) e.preventDefault(); };
  if (wrap) {
    if (wrap._blockScroll) wrap.removeEventListener('touchmove', wrap._blockScroll);
    wrap._blockScroll = blockScroll;
    wrap.addEventListener('touchmove', blockScroll, { passive: false });
  }
  const getPt = e => getDrawLogicalPt(canvas, e);
  const start = e => {
    const p = getPt(e);
    if (drawMode === 'fill') {
      floodFillAt(p.x, p.y);
      pushDrawHistory();
      if (typeof syncPushFill === 'function') syncPushFill();
      else if (typeof window.syncPushCanvas === 'function') window.syncPushCanvas();
      e.preventDefault();
      return;
    }
    if (drawMode === 'picker') {
      pickColorAt(p);
      e.preventDefault();
      return;
    }
    if (drawMode === 'text') {
      const t = prompt('输入文字：');
      if (t) {
        placeDrawText(p, t);
        if (typeof window.syncPushCanvas === 'function') window.syncPushCanvas();
      }
      e.preventDefault();
      return;
    }
    if (drawMode === 'shape') {
      drawing = true;
      window._isDrawing = true;
      shapeStart = p;
      lastPt = p;
      shapeSnapshot = getCanvasSnap();
      e.preventDefault();
      return;
    }
    if (drawMode !== 'pen' && drawMode !== 'eraser') return;
    drawing = true;
    window._isDrawing = true;
    lastPt = p;
    if (typeof syncOnDrawStart === 'function') syncOnDrawStart(lastPt, drawMode);
    e.preventDefault();
  };
  const move = e => {
    if (!drawing) return;
    const p = getPt(e);
    if (drawMode === 'shape' && shapeStart && shapeSnapshot) {
      lastPt = p;
      putCanvasSnap(shapeSnapshot);
      drawShapeOnCtx(drawCtx, shapeType, shapeStart.x, shapeStart.y, p.x, p.y, {
        color: getDrawColor(), lineWidth: getPenSize(), filled: shapeFilled,
      });
      e.preventDefault();
      return;
    }
    if (drawMode !== 'pen' && drawMode !== 'eraser') return;
    drawCtx.lineCap = 'round';
    drawCtx.lineJoin = 'round';
    const psz = getPenSize();
    drawCtx.lineWidth = drawMode === 'eraser' ? psz * 3.5 : psz;
    drawCtx.strokeStyle = drawMode === 'eraser' ? '#fff' : getDrawColor();
    drawCtx.beginPath();
    drawCtx.moveTo(lastPt.x, lastPt.y);
    drawCtx.lineTo(p.x, p.y);
    drawCtx.stroke();
    if (typeof syncOnDrawMove === 'function') syncOnDrawMove(p);
    lastPt = p;
    e.preventDefault();
  };
  const end = () => {
    if (!drawing) return;
    if (drawMode === 'shape' && shapeStart) {
      const p = lastPt || shapeStart;
      drawShapeOnCtx(drawCtx, shapeType, shapeStart.x, shapeStart.y, p.x, p.y, {
        color: getDrawColor(), lineWidth: getPenSize(), filled: shapeFilled,
      });
      if (typeof syncOnShapeEnd === 'function') {
        syncOnShapeEnd(shapeType, shapeStart.x, shapeStart.y, p.x, p.y, {
          color: getDrawColor(), w: getPenSize(), filled: shapeFilled,
        });
      }
      shapeSnapshot = null;
      shapeStart = null;
      pushDrawHistory();
      if (typeof window.syncPushCanvas === 'function') window.syncPushCanvas();
    } else if (drawMode === 'pen' || drawMode === 'eraser') {
      if (typeof syncOnDrawEnd === 'function') syncOnDrawEnd();
      pushDrawHistory();
      if (typeof window.syncScheduleSnapshot === 'function') window.syncScheduleSnapshot();
    }
    drawing = false;
    window._isDrawing = false;
    window._lastDrawEndTs = Date.now();
    lastPt = null;
  };
  const ptrDown = e => {
    if (e.pointerType === 'touch') e.preventDefault();
    _drawActivePointer = e.pointerId;
    try { canvas.setPointerCapture(e.pointerId); } catch {}
    start(e);
  };
  const ptrMove = e => {
    if (_drawActivePointer !== null && e.pointerId !== _drawActivePointer) return;
    if (drawing) e.preventDefault();
    move(e);
  };
  const ptrUp = e => {
    if (_drawActivePointer !== null && e.pointerId !== _drawActivePointer) return;
    _drawActivePointer = null;
    try { canvas.releasePointerCapture(e.pointerId); } catch {}
    end();
  };
  canvas.onpointerdown = ptrDown;
  canvas.onpointermove = ptrMove;
  canvas.onpointerup = ptrUp;
  canvas.onpointercancel = ptrUp;
  canvas.onpointerleave = e => { if (drawing && _drawActivePointer === e.pointerId) ptrUp(e); };
  window._drawResize = () => resizeDrawCanvas(true);
  window.removeEventListener('orientationchange', _drawOrientationHandler);
  window.addEventListener('orientationchange', _drawOrientationHandler);
  if (window.visualViewport) {
    window.visualViewport.removeEventListener('resize', _drawViewportHandler);
    window.visualViewport.addEventListener('resize', _drawViewportHandler);
  }
  const setTool = tool => {
    drawMode = tool;
    document.querySelectorAll('.paint-btn').forEach(b => b.classList.toggle('on', b.dataset.tool === tool));
    if (tool !== 'shape') document.querySelectorAll('.paint-shape-btn').forEach(b => b.classList.remove('on'));
  };
  const setShape = shape => {
    drawMode = 'shape';
    shapeType = shape;
    document.querySelectorAll('.paint-btn').forEach(b => b.classList.remove('on'));
    document.querySelectorAll('.paint-shape-btn').forEach(b => b.classList.toggle('on', b.dataset.shape === shape));
  };
  document.querySelectorAll('.paint-btn[data-tool]').forEach(btn => {
    btn.onclick = () => setTool(btn.dataset.tool);
  });
  document.querySelectorAll('.paint-shape-btn').forEach(btn => {
    btn.onclick = () => setShape(btn.dataset.shape);
  });
  const strokeBtn = document.getElementById('shapeStroke');
  const fillBtn = document.getElementById('shapeFillBtn');
  if (strokeBtn) strokeBtn.onclick = () => {
    shapeFilled = false;
    strokeBtn.classList.add('on');
    fillBtn?.classList.remove('on');
  };
  if (fillBtn) fillBtn.onclick = () => {
    shapeFilled = true;
    fillBtn.classList.add('on');
    strokeBtn?.classList.remove('on');
  };
  paintPrimary = load('paint-primary', '#45403c');
  paintSecondary = load('paint-secondary', '#ffffff');
  syncPaintSwatches();
  document.getElementById('colorPrimary')?.addEventListener('click', () => {
    document.getElementById('penColor')?.click();
  });
  document.getElementById('penColor')?.addEventListener('input', e => {
    setPaintPrimary(e.target.value);
    save('paint-primary', paintPrimary);
  });
  document.getElementById('colorSecondary')?.addEventListener('click', () => {
    const inp = document.createElement('input');
    inp.type = 'color';
    inp.value = paintSecondary;
    inp.onchange = () => {
      paintSecondary = inp.value;
      syncPaintSwatches();
      save('paint-secondary', paintSecondary);
    };
    inp.click();
  });
  document.getElementById('colorSwap')?.addEventListener('click', () => {
    [paintPrimary, paintSecondary] = [paintSecondary, paintPrimary];
    syncPaintSwatches();
    save('paint-primary', paintPrimary);
    save('paint-secondary', paintSecondary);
  });
  document.querySelectorAll('.paint-pal').forEach(btn => {
    btn.onclick = () => {
      setPaintPrimary(btn.dataset.color);
      save('paint-primary', paintPrimary);
      const dq = document.getElementById('dqColor');
      if (dq) dq.style.background = paintPrimary;
    };
  });
  const syncDqColor = () => {
    const dq = document.getElementById('dqColor');
    if (dq) dq.style.background = getDrawColor();
  };
  syncDqColor();
  document.querySelectorAll('.dq-btn[data-qtool]').forEach(btn => {
    btn.onclick = () => {
      setTool(btn.dataset.qtool);
      document.querySelectorAll('.dq-btn[data-qtool]').forEach(b => b.classList.toggle('on', b === btn));
    };
  });
  document.getElementById('dqUndo')?.addEventListener('click', e => { e.preventDefault(); undoDrawCanvas(); });
  document.getElementById('dqClear')?.addEventListener('click', e => { e.preventDefault(); clearDrawCanvas(); });
  document.getElementById('dqColor')?.addEventListener('click', () => document.getElementById('penColor')?.click());
  const undoBtn = document.getElementById('undoCanvas');
  const clearBtn = document.getElementById('clearCanvas');
  if (undoBtn) undoBtn.onclick = e => { e.preventDefault(); undoDrawCanvas(); };
  if (clearBtn) clearBtn.onclick = e => { e.preventDefault(); clearDrawCanvas(); };
  const saveDraw = () => {
    const a = document.createElement('a'); a.download = `手写_${today()}.png`;
    a.href = canvas.toDataURL('image/png'); a.click(); toast('图片已保存到相册/下载');
  };
  $('#saveCanvas')?.addEventListener('click', saveDraw);
  $('#shareCanvas')?.addEventListener('click', async () => {
    canvas.toBlob(async blob => {
      if (!blob) return;
      const file = new File([blob], `手写_${today()}.png`, {type:'image/png'});
      if (navigator.canShare?.({files:[file]})) { try { await navigator.share({files:[file]}); return; } catch{} }
      saveDraw();
    }, 'image/png');
  });
  if (window.matchMedia('(max-width:768px)').matches) {
    setTimeout(() => {
      resizeDrawCanvas(true);
      if (typeof window._applyCachedDraw === 'function') window._applyCachedDraw();
    }, 150);
  }
}

function graphSlidersHTML() {
  const g=graphState, t=g.type;
  const sl = (k,label,min,max,step,val) => `<div class="form-row"><label>${label} = <b id="gv_${k}">${val}</b></label><input type="range" id="gs_${k}" min="${min}" max="${max}" step="${step}" value="${val}"></div>`;
  if (t==='quadratic') return sl('a','a',-3,3,0.1,g.a)+sl('b','b',-6,6,0.1,g.b)+sl('c','c',-6,6,0.1,g.c);
  if (t==='linear') return sl('a','k',-5,5,0.1,g.a)+sl('b','b',-6,6,0.1,g.b);
  if (t==='sin'||t==='cos') return sl('A','A',0.5,3,0.1,g.A)+sl('w','ω',0.5,3,0.1,g.w)+sl('phi','φ',-3.14,3.14,0.1,g.phi);
  if (t==='ellipse'||t==='hyperbola') return sl('a','a',1,5,0.1,g.a)+sl('b','b',1,5,0.1,g.b);
  if (t==='parabola') return sl('a','p',0.5,4,0.1,g.a);
  return '';
}

function graphEquation() {
  const g=graphState;
  if (g.type==='quadratic') return `y = ${g.a}x² ${g.b>=0?'+':''}${g.b}x ${g.c>=0?'+':''}${g.c}`;
  if (g.type==='linear') return `y = ${g.a}x ${g.b>=0?'+':''}${g.b}`;
  if (g.type==='sin') return `y = ${g.A}·sin(${g.w}x ${g.phi>=0?'+':''}${g.phi})`;
  if (g.type==='cos') return `y = ${g.A}·cos(${g.w}x ${g.phi>=0?'+':''}${g.phi})`;
  if (g.type==='ellipse') return `x²/${g.a}² + y²/${g.b}² = 1`;
  if (g.type==='hyperbola') return `x²/${g.a}² − y²/${g.b}² = 1`;
  if (g.type==='parabola') return `y² = ${2*g.a}x`;
  return '';
}

function drawGraph() {
  const canvas = document.getElementById('graphCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W=canvas.width, H=canvas.height, cx=W/2, cy=H/2, scale=40;
  ctx.fillStyle='#fff'; ctx.fillRect(0,0,W,H);
  // grid
  ctx.strokeStyle='#f0e0e8'; ctx.lineWidth=1;
  for(let i=0;i<W;i+=scale){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,H);ctx.stroke();}
  for(let j=0;j<H;j+=scale){ctx.beginPath();ctx.moveTo(0,j);ctx.lineTo(W,j);ctx.stroke();}
  // axes
  ctx.strokeStyle='#ccc'; ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(0,cy);ctx.lineTo(W,cy);ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx,0);ctx.lineTo(cx,H);ctx.stroke();
  const g=graphState, toX=x=>cx+x*scale, toY=y=>cy-y*scale;
  ctx.strokeStyle='#ff6b9d'; ctx.lineWidth=2.5;
  const t=g.type;
  if (t==='quadratic'||t==='linear'||t==='sin'||t==='cos') {
    ctx.beginPath();
    for(let px=0;px<=W;px++){
      const x=(px-cx)/scale; let y;
      if(t==='quadratic') y=g.a*x*x+g.b*x+g.c;
      else if(t==='linear') y=g.a*x+g.b;
      else if(t==='sin') y=g.A*Math.sin(g.w*x+g.phi);
      else y=g.A*Math.cos(g.w*x+g.phi);
      const py=toY(y);
      if(px===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
    }
    ctx.stroke();
  } else if (t==='ellipse') {
    ctx.beginPath();
    for(let a=0;a<=Math.PI*2;a+=0.02){ctx.lineTo(toX(g.a*Math.cos(a)),toY(g.b*Math.sin(a)));}
    ctx.stroke();
  } else if (t==='hyperbola') {
    [-1,1].forEach(s=>{ctx.beginPath();for(let x=0.3;x<=5;x+=0.05){const y=s*g.b*Math.sqrt(x*x/(g.a*g.a)-1);if(isFinite(y))ctx.lineTo(toX(s*x),toY(y));}ctx.stroke();});
  } else if (t==='parabola') {
    ctx.beginPath();for(let y=-6;y<=6;y+=0.1){const x=y*y/(2*g.a);ctx.lineTo(toX(x),toY(y));}ctx.stroke();
  }
  const eq=document.getElementById('graphEq'); if(eq) eq.textContent=graphEquation();
}

function initGraph() {
  const sliders = document.getElementById('graphSliders');
  if (sliders) sliders.innerHTML = graphSlidersHTML();
  document.getElementById('graphType')?.addEventListener('change', e => {
    graphState.type=e.target.value;
    if(graphState.type==='quadratic'){graphState.a=1;graphState.b=0;graphState.c=-4;}
    render(); setTimeout(initGraph,50);
  });
  ['a','b','c','A','w','phi'].forEach(k=>{
    const el=document.getElementById('gs_'+k);
    if(el) el.oninput=()=>{graphState[k]=+el.value; document.getElementById('gv_'+k).textContent=el.value; drawGraph();};
  });
  document.getElementById('saveGraph')?.addEventListener('click', ()=>{
    const c=document.getElementById('graphCanvas');
    const a=document.createElement('a'); a.download='函数图_'+today()+'.png'; a.href=c.toDataURL(); a.click(); toast('图像已保存');
  });
  document.getElementById('resetGraph')?.addEventListener('click', ()=>{
    graphState={type:'quadratic',a:1,b:0,c:-4,A:1,B:0,w:1,phi:0}; render(); setTimeout(initGraph,50);
  });
  drawGraph();
}

// ═══════════════════════════════════════
//  主渲染
// ═══════════════════════════════════════
function _drawOrientationHandler() {
  if (view === 'draw') setTimeout(() => resizeDrawCanvas(true), 200);
}
function _drawViewportHandler() {
  if (view === 'draw') setTimeout(() => resizeDrawCanvas(true), 100);
}

function cleanupDrawPage() {
  const canvas = document.getElementById('drawCanvas');
  if (canvas) {
    if (_drawActivePointer != null) {
      try { canvas.releasePointerCapture(_drawActivePointer); } catch {}
      _drawActivePointer = null;
    }
    canvas.onpointerdown = canvas.onpointermove = canvas.onpointerup = null;
    canvas.onpointercancel = canvas.onpointerleave = null;
  }
  const wrap = document.getElementById('drawCanvasWrap');
  if (wrap?._blockScroll) {
    wrap.removeEventListener('touchmove', wrap._blockScroll);
    wrap._blockScroll = null;
  }
  window.removeEventListener('orientationchange', _drawOrientationHandler);
  if (window.visualViewport) window.visualViewport.removeEventListener('resize', _drawViewportHandler);
  if (window._drawInitTimer) { clearTimeout(window._drawInitTimer); window._drawInitTimer = null; }
  window._isDrawing = false;
  drawing = false;
  window.onresize = null;
}

function leaveHeavyPage() {
  cleanupDrawPage();
  if (typeof resetPageUI === 'function') resetPageUI();
  else if (typeof cleanupSyncUI === 'function') cleanupSyncUI();
  if (typeof stopSyncHub === 'function') stopSyncHub();
  if (typeof stopPhotoShare === 'function') stopPhotoShare();
  window._drawHistoryKeep = false;
}

function navigateTo(nextView, opts) {
  if (!nextView) return;
  if (typeof window.forceUnlockUI === 'function') window.forceUnlockUI();
  opts = opts || {};
  const from = view;
  if (from !== nextView) {
    if ((from === 'draw' || from === 'photos' || from === 'chat') && (nextView === 'draw' || nextView === 'photos' || nextView === 'chat')) {
      cleanupDrawPage();
      if (from !== nextView && typeof window.syncLeaveModule === 'function') window.syncLeaveModule(from);
      if (typeof window.syncSetPage === 'function') window.syncSetPage(nextView);
      if (typeof window.syncPingPresence === 'function') window.syncPingPresence();
      if (typeof window.syncRestartPresenceFastPoll === 'function') window.syncRestartPresenceFastPoll();
    } else if (from === 'draw' || from === 'photos' || from === 'chat') {
      if (typeof window.syncLeaveModule === 'function') window.syncLeaveModule(from);
      leaveHeavyPage();
    }
  }
  if (opts.id) sectionId = opts.id;
  if (opts.showFav !== undefined) showFav = opts.showFav;
  else if (nextView !== from) showFav = false;
  view = nextView;
  const content = document.getElementById('content');
  if (content) content.scrollTop = 0;
  render();
}

function navigateGo(el) {
  if (!el?.dataset?.go) return;
  const go = el.dataset.go;
  const nextView = go === 'section' ? 'section' : go;
  const opts = {};
  if (el.dataset.id) opts.id = el.dataset.id;
  opts.showFav = false;
  if (go === 'quiz' && el.classList.contains('quick-btn')) {
    quizState.count = 5; quizState.topics = DATA.map(d=>d.id); quizState.problems = genProblems();
  } else if (go === 'quiz') { quizState.problems = []; }
  navigateTo(nextView, opts);
  if (el.classList.contains('quick-btn') && go === 'mistakes') setTimeout(openMistakeForm, 80);
  if (el.classList.contains('quick-btn') && go === 'notes') setTimeout(openNoteForm, 80);
}

function ensurePageClickable() {
  if (view !== 'draw' && view !== 'photos') {
    document.querySelectorAll('.sync-mobile-sheet, .sync-role-overlay, .photo-lightbox').forEach(el => el.remove());
  }
  document.body.style.pointerEvents = '';
  document.documentElement.style.pointerEvents = '';
  const app = document.querySelector('.app');
  const main = document.querySelector('.main');
  const content = document.getElementById('content');
  const bn = document.getElementById('bottomNav');
  if (app) app.style.pointerEvents = '';
  if (main) main.style.pointerEvents = '';
  if (content) content.style.pointerEvents = '';
  if (bn) { bn.style.pointerEvents = 'auto'; bn.classList.remove('bnav-hidden'); }
  if (view !== 'draw' && view !== 'photos') {
    document.body.classList.remove('view-draw', 'view-photos');
    document.body.style.overflow = '';
    if (content) content.style.overflow = '';
  }
  if (typeof window.cancelRolePicker === 'function') window.cancelRolePicker();
}

function bindUniversalNavigation() {
  const bnav = document.getElementById('bottomNav');
  if (bnav && !bnav._navClickBound) {
    bnav._navClickBound = true;
    const onBnav = e => {
      const btn = e.target.closest('[data-bnav]');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      navigateTo(btn.dataset.bnav);
    };
    bnav.addEventListener('click', onBnav);
    bnav.addEventListener('touchend', onBnav, { passive: false });
  }
  const nav = document.getElementById('nav');
  if (nav && !nav._navClickBound) {
    nav._navClickBound = true;
    nav.addEventListener('click', e => {
      const btn = e.target.closest('.nav-item[data-v]');
      if (!btn) return;
      e.preventDefault();
      navigateTo(btn.dataset.v, { id: btn.dataset.id || undefined, showFav: false });
    });
  }
  const content = document.getElementById('content');
  if (content && !content._navClickBound) {
    content._navClickBound = true;
    content.addEventListener('click', e => {
      if (e.defaultPrevented) return;
      const goEl = e.target.closest('[data-go]');
      if (goEl) {
        e.preventDefault();
        e.stopPropagation();
        navigateGo(goEl);
        return;
      }
      const quizEl = e.target.closest('[data-go-quiz]');
      if (quizEl) {
        e.preventDefault();
        navigateTo('quiz');
        quizState.topics = [quizEl.dataset.goQuiz];
        quizState.problems = genProblems();
      }
    });
  }
}

window.goView = function (v) { navigateTo(v); };

function render() {
  if (view !== 'draw' && view !== 'photos') cleanupDrawPage();
  renderNav();
  renderTopbar();
  const c = $('#content');
  const extViews = ['reports','custom','backup','timer','templates','more','refhub','feedback','weakness'];
  if (extViews.includes(view) && typeof renderMore !== 'function') {
    c.innerHTML = '<div class="content-inner"><p style="text-align:center;padding:48px 16px;color:var(--text2)">模块加载中，请稍候…</p></div>';
    if (typeof loadHeavyModules === 'function') loadHeavyModules(() => render());
    document.body.classList.toggle('view-draw', view === 'draw');
    document.body.classList.toggle('view-photos', view === 'photos');
    ensurePageClickable();
    return;
  }
  if (showFav) c.innerHTML = renderFavs();
  else if (view === 'home') c.innerHTML = renderHome();
  else if (view === 'section') c.innerHTML = renderSection(sectionId);
  else if (view === 'quizfavs') c.innerHTML = renderQuizFavs();
  else if (view === 'quiz') c.innerHTML = renderQuiz();
  else if (view === 'formula') c.innerHTML = renderFormula();
  else if (view === 'draw') c.innerHTML = renderDraw();
  else if (view === 'photos') c.innerHTML = renderPhotos();
  else if (view === 'chat') c.innerHTML = renderChat();
  else if (view === 'graph') c.innerHTML = renderGraph();
  else if (view === 'mistakes') c.innerHTML = renderMistakes();
  else if (view === 'notes') c.innerHTML = renderNotes();
  else if (view === 'reports' && typeof renderReports === 'function') c.innerHTML = renderReports();
  else if (view === 'custom' && typeof renderCustomFormula === 'function') c.innerHTML = renderCustomFormula();
  else if (view === 'backup' && typeof renderBackup === 'function') c.innerHTML = renderBackup();
  else if (view === 'timer' && typeof renderTimer === 'function') c.innerHTML = renderTimer();
  else if (view === 'templates' && typeof renderTemplates === 'function') c.innerHTML = renderTemplates();
  else if (view === 'more' && typeof renderMore === 'function') c.innerHTML = renderMore();
  else if (view === 'refhub' && typeof renderRefHub === 'function') c.innerHTML = renderRefHub();
  else if (view === 'ref') { view='refhub'; c.innerHTML = typeof renderRefHub==='function'?renderRefHub():''; }
  else if (view === 'feedback' && typeof renderFeedback === 'function') c.innerHTML = renderFeedback();
  else if (view === 'weakness' && typeof renderWeakness === 'function') c.innerHTML = renderWeakness();

  document.body.classList.toggle('view-draw', view === 'draw');
  document.body.classList.toggle('view-photos', view === 'photos');

  if (typeof initExtView === 'function') initExtView();
  if (view === 'home' || view === 'more') {
    setTimeout(() => {
      if (typeof window.syncRefreshHomePresence === 'function') window.syncRefreshHomePresence();
    }, 80);
  }
  if (view !== 'draw' && view !== 'photos' && view !== 'chat' && typeof window.syncSetPage === 'function') {
    window.syncSetPage('lobby');
  }
  if (view === 'formula') setTimeout(initFormula, 30);
  if (view === 'draw') window._drawHistoryKeep = true;
  if (view === 'draw') {
    const head = () => document.querySelector('.draw-mobile-head');
    if (head()) head().style.display = 'flex';
    requestAnimationFrame(() => {
      if (view !== 'draw') return;
      if (head()) head().style.display = 'flex';
      if (typeof window._drawResize === 'function') window._drawResize();
    });
    if (window._drawInitTimer) clearTimeout(window._drawInitTimer);
    window._drawInitTimer = setTimeout(() => {
      window._drawInitTimer = null;
      if (view !== 'draw') return;
      initDraw();
      if (head()) head().style.display = 'flex';
      window.onresize = () => { if (view === 'draw' && window._drawResize) window._drawResize(); };
      if (typeof window.ensureHeavyModule === 'function') {
        window.ensureHeavyModule('draw', () => { if (typeof startDrawSync === 'function') startDrawSync(); });
      } else if (typeof startDrawSync === 'function') startDrawSync();
    }, 30);
  }
  if (view === 'photos') {
    if (window._photoInitTimer) clearTimeout(window._photoInitTimer);
    window._photoInitTimer = setTimeout(() => {
      window._photoInitTimer = null;
      if (view !== 'photos') return;
      if (typeof window.ensureHeavyModule === 'function') {
        window.ensureHeavyModule('photos', () => { if (typeof startPhotoShare === 'function') startPhotoShare(); });
      } else if (typeof startPhotoShare === 'function') startPhotoShare();
    }, 50);
  }
  if (view === 'chat') {
    if (window._chatInitTimer) clearTimeout(window._chatInitTimer);
    window._chatInitTimer = setTimeout(() => {
      window._chatInitTimer = null;
      if (view !== 'chat') return;
      if (typeof window.ensureHeavyModule === 'function') {
        window.ensureHeavyModule('chat', () => { if (typeof startChatSync === 'function') startChatSync(); });
      } else if (typeof startChatSync === 'function') startChatSync();
    }, 50);
  }
  if (view === 'graph') setTimeout(initGraph, 30);

  ensurePageClickable();
  c.querySelectorAll('.star-btn').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.fav, i = favs.indexOf(id);
      if (i>=0) favs.splice(i,1); else favs.push(id);
      save('math-favs', favs); render();
    };
  });
  c.querySelectorAll('[data-ffkey]').forEach(el => { el.onclick = () => showFormulaFavModal(el.dataset.ffkey); });
  c.querySelectorAll('.formula-star[data-ff-builtin]').forEach(btn => {
    btn.onclick = e => {
      e.stopPropagation();
      const d = DATA.find(x => x.id === btn.dataset.ffBuiltin);
      const f = d?.formulas[+btn.dataset.ffIdx];
      if (!f) return;
      toggleFfav({ key: ffKey(d.id, f.n), moduleId: d.id, name: f.n, expr: f.f, note: f.note || '', moduleName: d.name });
    };
  });
  c.querySelectorAll('.formula-star[data-ff-custom]').forEach(btn => {
    btn.onclick = e => {
      e.stopPropagation();
      const f = (customFormulas || []).find(x => x.id === btn.dataset.ffCustom);
      if (!f) return;
      toggleFfav({ key: ffCustomKey(f.id), moduleId: f.topic, name: f.name, expr: f.content, note: f.note || '', moduleName: topicName(f.topic) });
    };
  });
  c.querySelectorAll('#topicChips .chip').forEach(chip => {
    chip.onclick = () => {
      const t = chip.dataset.topic, i = quizState.topics.indexOf(t);
      if (i>=0) { if(quizState.topics.length>1) quizState.topics.splice(i,1); }
      else quizState.topics.push(t);
      render();
    };
  });
  c.querySelectorAll('#typeChips .chip').forEach(chip => {
    chip.onclick = () => {
      const t = chip.dataset.qtype, i = quizState.types.indexOf(t);
      if (i>=0) { if(quizState.types.length>1) quizState.types.splice(i,1); }
      else quizState.types.push(t);
      render();
    };
  });
  c.querySelectorAll('[data-go="custom"]').forEach(el => { el.onclick = () => { view='custom'; render(); setTimeout(()=>typeof openCustomFormulaForm==='function'&&openCustomFormulaForm(),80); }; });
  const qd = document.getElementById('quizDiff');
  if (qd) qd.onchange = () => { quizState.diff = qd.value; };
  const qc = document.getElementById('quizCount');
  if (qc) qc.onchange = () => { quizState.count = +qc.value; };
  const p5 = document.getElementById('preset5');
  if (p5) p5.onclick = () => { quizState.count=5; quizState.topics=DATA.map(d=>d.id); quizState.problems=genProblems(); render(); toast('已生成课前小测 5 题'); };
  const p3 = document.getElementById('preset3');
  if (p3) p3.onclick = () => { quizState.count=3; quizState.problems=genProblems(); render(); toast('已生成课后巩固 3 题'); };
  $('#btnExportQuizImg')?.addEventListener('click', () => {
    document.querySelectorAll('.quiz-ans').forEach(el => el.classList.remove('show'));
    exportLongImage('#quizExportArea', `题目_${today()}.png`);
  });
  $('#btnExportQuizAns')?.addEventListener('click', () => {
    document.querySelectorAll('.quiz-ans').forEach(el => el.classList.add('show'));
    setTimeout(() => exportLongImage('#quizExportArea', `题目含答案_${today()}.png`), 200);
  });
  const pm = document.getElementById('presetMix');
  if (pm) pm.onclick = () => {
    quizState.types=['选择','填空','判断','解答'];
    const types=['选择','选择','填空','填空','判断','解答'];
    const used = new Set();
    quizState.problems = types.map(t => {
      const pool = buildQuizPool().filter(q => q.type === t && !used.has(q.id));
      const q = pool.length ? pick(pool) : pickUniqueFromPool(buildQuizPool(), used, null);
      if (!q) return null;
      used.add(q.id);
      return bankToProblem(q);
    }).filter(Boolean);
    render(); toast('已生成模拟卷 '+quizState.problems.length+' 题（题型不重复）');
  };
}

$('#searchInput').addEventListener('input', e => doSearch(e.target.value));
$('#modal').addEventListener('click', e => { if(e.target===$('#modal')) closeModal(); });
document.addEventListener('keydown', e => {
  if ((e.ctrlKey||e.metaKey) && e.key==='k') { e.preventDefault(); $('#searchInput').focus(); }
  if (e.key==='Escape') closeModal();
});

applyTheme(theme);
