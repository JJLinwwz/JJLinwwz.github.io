// 扩展模块：学情报告、自定义公式、备份、计时器、教学模板、手机导航
const QUESTION_TYPES = ['选择','填空','判断','解答'];
let students = load('math-students', []);
let sessions = load('math-sessions', []);
let customFormulas = load('math-custom-formulas', []);
let lastBackup = load('math-last-backup', '');
let mobileTab = '';

const TEACH_TEMPLATES = [
{id:'error-review',name:'错题讲评课',icon:'📕',desc:'针对典型错题专项讲解',
body:`【错题讲评课教案】
日期：____　班级/学生：____　课时：____

一、教学目标
1. 梳理本次错题涉及的核心知识点：____
2. 纠正学生的思维误区与习惯性问题
3. 同类变式巩固，确保举一反三

二、错题回顾（逐题讲解）
| 题号 | 知识点 | 错因分类 | 正确思路 |
| 1 |  | □概念 □计算 □审题 |  |
| 2 |  | □概念 □计算 □审题 |  |

三、讲评流程
1. 学生自述错因（5 min）
2. 教师点拨 + 规范书写（20 min）
3. 变式练习（15 min）
4. 小结归纳（5 min）

四、课后巩固
布置同类题 ____ 道，要求写出完整步骤

五、教学反思
____`},
{id:'knowledge-summary',name:'知识点总结课',icon:'📋',desc:'章节复习与知识框架梳理',
body:`【知识点总结课教案】
章节：____　日期：____

一、知识框架图
（建议画思维导图，核心模块：____）

二、核心公式/定理清单
1. ____
2. ____
3. ____

三、易错点提醒
① ____  ② ____  ③ ____

四、典型题型归纳
| 题型 | 解题策略 | 关键步骤 |
|  |  |  |

五、课堂练习（分层）
基础题：____  提高题：____  拓展题：____

六、作业布置
____`},
{id:'new-lesson',name:'新授课模板',icon:'📖',desc:'常规新授课结构',
body:`【新授课教案】
课题：____　课型：新授　日期：____

一、教学目标（三维）
知识与技能：____
过程与方法：____
情感态度：____

二、教学重难点
重点：____
难点：____

三、教学过程
1. 情境导入（5 min）：____
2. 探究新知（25 min）：____
3. 例题精讲（10 min）：____
4. 课堂练习（8 min）：____
5. 小结作业（2 min）：____

四、板书设计
____

五、教学反思
____`},
{id:'parent-feedback',name:'家长反馈模板',icon:'💬',desc:'课后给家长的文字反馈',
body:`【学习情况反馈】
家长您好！我是数学老师，现就孩子近期学习情况向您反馈：

学生姓名：____
反馈周期：____ 至 ____

一、近期学习内容
____

二、课堂表现
出勤：____　参与度：____　作业完成：____

三、掌握情况
✅ 掌握较好：____
⚠️ 需要加强：____

四、建议与计划
1. 在家复习重点：____
2. 推荐练习：____
3. 下次课重点：____

如有疑问欢迎随时沟通，感谢配合！`}
];

// ── 学情报告生成 ──
function getStudentData(sid) {
  const s = students.find(x => x.id === sid);
  if (!s) return null;
  const name = s.name;
  const sm = mistakes.filter(m => m.studentId === sid || m.student === name);
  const sn = notes.filter(n => (n.studentId === sid) || (n.content && n.content.includes(name)));
  const ss = sessions.filter(x => x.studentId === sid);
  return { student: s, mistakes: sm, notes: sn, sessions: ss };
}

function analyzeWeakTopics(sm) {
  const map = {};
  sm.filter(m => !m.mastered).forEach(m => {
    const t = topicName(m.topic);
    map[t] = (map[t] || 0) + 1;
  });
  return Object.entries(map).sort((a,b) => b[1]-a[1]).map(([t,c]) => ({topic:t,count:c}));
}

function generateReport(sid, days=7) {
  const d = getStudentData(sid);
  if (!d) return '';
  const { student, mistakes: sm, sessions: ss } = d;
  const since = new Date(); since.setDate(since.getDate() - days);
  const recentM = sm.filter(m => new Date(m.date) >= since);
  const recentS = ss.filter(s => new Date(s.date) >= since);
  const weak = analyzeWeakTopics(sm);
  const mastered = sm.filter(m => m.mastered).length;
  const total = sm.length;
  const rate = recentS.length ? Math.round(recentS.reduce((a,s)=>a+(s.correct||0),0) / Math.max(1,recentS.reduce((a,s)=>a+(s.correct||0)+(s.wrong||0),0)) * 100) : null;

  let r = `📊 ${student.name} 学习报告\n`;
  r += `周期：近 ${days} 天（${fmtDate(since.toISOString().slice(0,10))} 至今）\n`;
  r += `生成时间：${fmtDate(today())}\n`;
  r += `${'─'.repeat(28)}\n\n`;
  r += `【总体概况】\n`;
  r += `· 上课/辅导 ${recentS.length} 次\n`;
  if (rate !== null) r += `· 近期答题正确率约 ${rate}%\n`;
  r += `· 错题累计 ${total} 道，已掌握 ${mastered} 道\n\n`;
  if (recentS.length) {
    r += `【近期上课记录】\n`;
    recentS.slice(0,5).forEach(s => {
      r += `· ${fmtDate(s.date)} ${(s.topics||[]).join('、')||'—'}`;
      if (s.correct||s.wrong) r += ` （对${s.correct||0}/错${s.wrong||0}）`;
      r += ` ${s.performance||''}\n`;
    });
    r += '\n';
  }
  if (weak.length) {
    r += `【薄弱知识点】\n`;
    weak.slice(0,5).forEach((w,i) => r += `${i+1}. ${w.topic}（待巩固 ${w.count} 处）\n`);
    r += '\n';
  }
  if (recentM.length) {
    r += `【近期典型错题】\n`;
    recentM.slice(0,3).forEach((m,i) => r += `${i+1}. [${topicName(m.topic)}] ${m.problem.slice(0,40)}…\n`);
    r += '\n';
  }
  r += generatePracticePlan(sid, false);
  return r;
}

function generatePracticePlan(sid, header=true) {
  const d = getStudentData(sid);
  if (!d) return '';
  const weak = analyzeWeakTopics(d.mistakes);
  const weakCats = d.mistakes.filter(m=>!m.mastered).map(m=>m.topic);
  const uniqueCats = [...new Set(weakCats)];
  let p = header ? `【个性化复习计划】\n` : '';
  p += `学生：${d.student.name}\n\n`;
  if (!weak.length) {
    p += '目前暂无明显薄弱点，建议：\n① 每周做 1 套综合卷保持手感\n② 回顾错题本已掌握题目\n';
    return p;
  }
  p += '一、优先攻克（按薄弱程度排序）\n';
  weak.slice(0,4).forEach((w,i) => {
    p += `${i+1}. ${w.topic}：复习公式速查 + 错题重做 ${Math.min(w.count,3)} 道\n`;
  });
  p += '\n二、推荐练习\n';
  if (typeof GAOKAO_BANK !== 'undefined' && uniqueCats.length) {
    const rec = GAOKAO_BANK.filter(q => uniqueCats.includes(q.cat)).slice(0,5);
    rec.forEach((q,i) => p += `· ${q.type}题 [${q.topic}] ${q.q.slice(0,35)}…\n`);
  }
  p += '\n三、每日建议\n';
  p += '· 当天错题当天清，标注错因\n';
  p += '· 薄弱章节公式每天过 1 遍\n';
  p += '· 每周末 15 分钟回顾本周笔记\n';
  return p;
}

// ── 备份 ──
function getAllData() {
  return { version:'2.1', exportDate:today(), exportTime:new Date().toISOString(),
    mistakes, notes, favs, formulaFavs, quizFavs, students, sessions, customFormulas,
    theme, fontScale, lastBackup: today() };
}

function doExportAll() {
  const data = getAllData();
  downloadJSON(data, `婉宁老师教学小助手_备份_${today()}.json`);
  lastBackup = today(); save('math-last-backup', lastBackup);
  toast('完整备份已下载 🎀');
}

function doImportAll(file, merge=false) {
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const d = JSON.parse(ev.target.result);
      const apply = (key, target, storeKey) => {
        if (!d[key]) return;
        if (merge && Array.isArray(target)) {
          const ids = new Set(target.map(x=>x.id));
          d[key].forEach(x => { if (!ids.has(x.id)) target.push(x); });
        } else if (Array.isArray(d[key])) { target.length=0; d[key].forEach(x=>target.push(x)); }
        save(storeKey, target);
      };
      apply('mistakes', mistakes, 'math-mistakes');
      apply('notes', notes, 'math-notes');
      apply('students', students, 'math-students');
      apply('sessions', sessions, 'math-sessions');
      apply('customFormulas', customFormulas, 'math-custom-formulas');
      if (d.favs) { favs.length=0; d.favs.forEach(f=>favs.push(f)); save('math-favs',favs); }
      if (d.formulaFavs) { formulaFavs.length=0; d.formulaFavs.forEach(f=>formulaFavs.push(f)); save('math-formula-favs',formulaFavs); }
      if (d.quizFavs) { quizFavs.length=0; d.quizFavs.forEach(f=>quizFavs.push(f)); save('math-quiz-favs',quizFavs); }
      if (d.fontScale) { applyFontScale(d.fontScale); }
      lastBackup = today(); save('math-last-backup', lastBackup);
      render(); toast(merge ? '数据已合并导入' : '数据已恢复');
    } catch { toast('文件格式有误'); }
  };
  reader.readAsText(file);
}

function backupStatusText() {
  if (!lastBackup) return '尚未备份，建议立即备份';
  const days = Math.floor((Date.now() - new Date(lastBackup+'T00:00:00')) / 86400000);
  if (days > 7) return `上次备份 ${days} 天前，建议更新`;
  return `上次备份：${fmtDate(lastBackup)} ✓`;
}

// ── 渲染：学情 ──
function renderReports() {
  const sel = window._reportStudent || (students[0]?.id || '');
  const report = sel ? generateReport(sel, window._reportDays || 7) : '';
  const plan = sel ? generatePracticePlan(sel) : '';
  return `<div class="content-inner">
    <h2 class="section-title">学情报告 📊</h2>
    <p class="section-desc">根据错题、上课记录自动生成，可一键复制发给家长</p>
    <div class="card"><div class="card-body">
      <div class="form-row-2">
        <div class="form-row"><label>选择学生</label>
          <select id="reportStudent" onchange="window._reportStudent=this.value;render()">
            <option value="">请选择学生</option>
            ${students.map(s=>`<option value="${s.id}"${sel===s.id?' selected':''}>${esc(s.name)}</option>`).join('')}
          </select>
        </div>
        <div class="form-row"><label>报告周期</label>
          <select id="reportDays" onchange="window._reportDays=+this.value;render()">
            ${[7,14,30].map(d=>`<option value="${d}"${(window._reportDays||7)===d?' selected':''}>近 ${d} 天</option>`).join('')}
          </select>
        </div>
      </div>
      <button class="btn btn-primary" style="width:100%;margin-top:8px;padding:12px" onclick="openStudentForm()">+ 添加学生</button>
    </div></div>
    ${students.length ? `<div class="note-toolbar">
      <button class="btn btn-primary" id="btnLogSession">+ 记录本次课</button>
      <button class="btn" id="btnCopyReport">复制报告</button>
      <button class="btn" id="btnCopyPlan">复制计划</button>
      <button class="btn" id="btnExportReport">📷 导出长图</button>
    </div>` : ''}
    <div id="reportExportArea">
    ${report ? `<div class="card"><div class="card-header">阶段性学习报告</div><div class="card-body"><pre class="report-pre" id="reportText">${esc(report)}</pre></div></div>` : ''}
    ${plan && sel ? `<div class="card"><div class="card-header">个性化复习计划</div><div class="card-body"><pre class="report-pre">${esc(plan)}</pre></div></div>` : ''}
    </div>
    ${!students.length ? '<div class="note-empty"><p>先添加学生，上完课记录学情，即可自动生成报告</p></div>' : ''}
  </div>`;
}

// ── 渲染：自定义公式 ──
function renderCustomFormula() {
  return `<div class="content-inner">
    <h2 class="section-title">我的公式库 ✨</h2>
    <p class="section-desc">添加你自己的解题技巧、口诀、结论，和系统公式一起速查</p>
    <button class="btn btn-primary" style="width:100%;padding:12px;margin-bottom:14px" onclick="openCustomFormulaForm()">+ 添加自定义公式</button>
    ${customFormulas.length ? customFormulas.map(f=>{
      const on = typeof isFfav === 'function' && isFfav(ffCustomKey(f.id));
      return `
      <div class="note-card">
        <div class="note-actions">
          <button class="formula-star${on?' on':''}" data-ff-custom="${f.id}" title="收藏到首页">${on?'★':'☆'}</button>
          <button onclick="openCustomFormulaForm('${f.id}')">编辑</button>
          <button class="btn-danger" onclick="delCustomFormula('${f.id}')">删</button>
        </div>
        <span class="tag tag-topic">${esc(topicName(f.topic))}</span>
        <div class="note-title">${esc(f.name)}</div>
        <div class="formula-expr" style="margin:8px 0">${f.content}</div>
        ${f.note?`<div class="formula-note">${esc(f.note)}</div>`:''}
      </div>`;
    }).join('') : '<div class="note-empty"><p>还没有自定义内容，把你常讲的技巧记下来吧</p></div>'}
  </div>`;
}

// ── 渲染：备份中心 ──
function renderBackup() {
  return `<div class="content-inner">
    <h2 class="section-title">数据备份 💾</h2>
    <p class="section-desc">所有数据存在本机浏览器，定期备份不怕丢失</p>
    <div class="card backup-card">
      <div class="card-body" style="text-align:center;padding:24px">
        <div style="font-size:2.5rem;margin-bottom:8px">🎀</div>
        <div style="font-size:.9rem;margin-bottom:16px;color:var(--text2)">${backupStatusText()}</div>
        <button class="btn btn-primary" style="width:100%;padding:14px;font-size:.95rem;margin-bottom:10px" id="btnFullExport">下载完整备份</button>
        <button class="btn" style="width:100%;padding:12px;margin-bottom:10px" id="btnFullImport">从备份恢复（覆盖）</button>
        <button class="btn" style="width:100%;padding:12px" id="btnMergeImport">从备份合并导入</button>
        <input type="file" id="importFile" accept=".json" style="display:none">
      </div>
    </div>
    <div class="card"><div class="card-header">备份包含</div><div class="card-body" style="font-size:.84rem;color:var(--text2)">
      <p>✓ 错题本（${mistakes.length} 条）</p>
      <p>✓ 教学笔记（${notes.length} 篇）</p>
      <p>✓ 学生档案（${students.length} 人）</p>
      <p>✓ 上课记录（${sessions.length} 条）</p>
      <p>✓ 自定义公式（${customFormulas.length} 条）</p>
      <p>✓ 公式收藏（${formulaFavs.length} 条）· 真题收藏（${quizFavs.length} 道）</p>
      <p>✓ 模块收藏与设置</p>
      <p style="margin-top:10px;color:var(--accent)">建议每周备份一次，换手机时先恢复备份</p>
    </div></div>
  </div>`;
}

// ── 渲染：计时器 ──
let timerState = load('math-timer', {mode:'countdown',scene:'quiz',minutes:5,seconds:0,running:false,left:300,landscape:false});
let timerInterval = null;

function renderTimer() {
  const t = timerState;
  const disp = formatTimer(t.left);
  return `<div class="content-inner timer-page ${t.landscape?'timer-landscape-active':''}" id="timerRoot">
    <h2 class="section-title">课堂计时 ⏱</h2>
    <p class="section-desc">小测倒计时 / 课堂正计时 · 支持横屏大数字</p>
    <div class="timer-scene-presets">
      <button class="chip${t.scene==='quiz'?' on':''}" data-scene="quiz">📝 小测倒计时</button>
      <button class="chip${t.scene==='class'?' on':''}" data-scene="class">📖 课堂正计时</button>
    </div>
    <div class="timer-display" id="timerDisplay">${disp}</div>
    ${t.mode==='countdown' ? `<div class="timer-presets">
      ${[3,5,10,15,20,45].map(m=>`<button class="chip${t.minutes===m?' on':''}" data-tmin="${m}">${m} 分钟</button>`).join('')}
    </div>` : ''}
    <div class="timer-btns">
      <button class="btn btn-primary timer-big" id="timerStart">${t.running?'暂停':'开始'}</button>
      <button class="btn timer-big" id="timerReset">重置</button>
      <button class="btn timer-big" id="timerLandscape">${t.landscape?'退出横屏':'📱 横屏全屏'}</button>
    </div>
  </div>`;
}

function formatTimer(sec) {
  const m = Math.floor(sec/60), s = sec%60;
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function initTimer() {
  if (timerInterval) clearInterval(timerInterval);
  document.body.classList.toggle('timer-landscape', !!timerState.landscape);
  document.querySelectorAll('[data-scene]').forEach(b => {
    b.onclick = () => {
      const s = b.dataset.scene;
      timerState.scene = s;
      if (s === 'quiz') { timerState.mode = 'countdown'; timerState.minutes = 5; timerState.left = 300; }
      else { timerState.mode = 'stopwatch'; timerState.left = 0; }
      timerState.running = false;
      save('math-timer', timerState); render(); setTimeout(initTimer, 30);
    };
  });
  document.querySelectorAll('[data-tmin]').forEach(b => {
    b.onclick = () => { timerState.minutes=+b.dataset.tmin; timerState.left=timerState.minutes*60; timerState.running=false; save('math-timer',timerState); render(); setTimeout(initTimer,30); };
  });
  $('#timerLandscape')?.addEventListener('click', () => {
    timerState.landscape = !timerState.landscape;
    document.body.classList.toggle('timer-landscape', timerState.landscape);
    save('math-timer', timerState); render(); setTimeout(initTimer, 30);
    if (timerState.landscape && screen.orientation?.lock) {
      try { screen.orientation.lock('landscape').catch(()=>{}); } catch {}
    }
  });
  const startBtn = $('#timerStart');
  startBtn?.addEventListener('click', () => {
    timerState.running = !timerState.running;
    startBtn.textContent = timerState.running ? '暂停' : '开始';
    if (timerState.running) {
      timerInterval = setInterval(() => {
        if (timerState.mode==='countdown') {
          timerState.left--; if (timerState.left<=0) { timerState.left=0; timerState.running=false; clearInterval(timerInterval); timerInterval=null; startBtn.textContent='开始'; toast('时间到 ⏰'); }
        } else timerState.left++;
        const el=$('#timerDisplay'); if(el) el.textContent=formatTimer(timerState.left);
        save('math-timer',timerState);
      }, 1000);
    } else if (timerInterval) { clearInterval(timerInterval); timerInterval=null; }
  });
  $('#timerReset')?.addEventListener('click', () => {
    timerState.running=false; timerState.left=timerState.mode==='countdown'?timerState.minutes*60:0;
    if(timerInterval) clearInterval(timerInterval); timerInterval=null;
    save('math-timer',timerState);
    const el=$('#timerDisplay'); if(el) el.textContent=formatTimer(timerState.left);
    if(startBtn) startBtn.textContent='开始';
  });
}

// ── 渲染：教学模板 ──
function renderTemplates() {
  return `<div class="content-inner">
    <h2 class="section-title">教学模板 📝</h2>
    <p class="section-desc">一键生成教案框架，填入内容即可用</p>
    ${TEACH_TEMPLATES.map(t=>`
      <div class="note-card" style="cursor:pointer" data-template="${t.id}">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:1.5rem">${t.icon}</span>
          <div><div class="note-title">${t.name}</div><div style="font-size:.78rem;color:var(--text2)">${t.desc}</div></div>
        </div>
      </div>`).join('')}
    <div class="card" id="templatePreview" style="display:none;margin-top:14px">
      <div class="card-header"><span id="templateName"></span><button class="btn btn-primary" id="btnCopyTemplate">复制模板</button></div>
      <div class="card-body"><pre class="report-pre" id="templateBody" style="white-space:pre-wrap"></pre></div>
    </div>
  </div>`;
}

function initTemplates() {
  let currentBody = '';
  document.querySelectorAll('[data-template]').forEach(el => {
    el.onclick = () => {
      const t = TEACH_TEMPLATES.find(x=>x.id===el.dataset.template);
      if (!t) return;
      currentBody = t.body;
      $('#templatePreview').style.display = '';
      $('#templateName').textContent = t.name;
      $('#templateBody').textContent = t.body;
    };
  });
  $('#btnCopyTemplate')?.addEventListener('click', () => {
    const text = $('#templateBody')?.textContent || currentBody;
    navigator.clipboard.writeText(text).then(()=>toast('模板已复制，可粘贴到备忘录'));
  });
}

// ── 薄弱点深度分析 ──
function analyzeStudentWeakness(sid) {
  const d = getStudentData(sid);
  if (!d) return null;
  const active = d.mistakes.filter(m => !m.mastered);
  const total = active.length;
  const allTotal = d.mistakes.length;
  const mastered = d.mistakes.filter(m => m.mastered).length;
  const map = {};
  active.forEach(m => {
    const t = m.topic;
    if (!map[t]) map[t] = { id: t, name: topicName(t), count: 0, samples: [] };
    map[t].count++;
    if (map[t].samples.length < 3) map[t].samples.push(m);
  });
  const topics = Object.values(map).sort((a, b) => b.count - a.count)
    .map(x => ({ ...x, rate: total ? Math.round(x.count / total * 100) : 0 }));
  const topWeak = topics[0];
  let insight = '暂无待巩固错题，继续保持～';
  if (topWeak) {
    insight = `${d.student.name} 在「${topWeak.name}」部分错误最集中（占待巩固 ${topWeak.rate}%），建议优先专项突破。`;
  }
  return { student: d.student, total, allTotal, mastered, topics, insight };
}

function renderWeakness() {
  const sid = window._weakStudent || students[0]?.id || '';
  const data = sid ? analyzeStudentWeakness(sid) : null;
  const bars = data?.topics.length ? data.topics.map(t => `
    <div class="weak-bar-row">
      <span class="weak-bar-name">${esc(t.name)}</span>
      <div class="weak-bar-track"><div class="weak-bar-fill" style="width:${Math.max(t.rate, 8)}%"></div></div>
      <span class="weak-bar-num">${t.count}处</span>
    </div>`).join('') : '<p class="note-empty" style="padding:20px">还没有错题数据，先去「错题本」记录几道吧</p>';
  const samples = data?.topics.length ? data.topics.slice(0, 3).map(t => `
    <div class="card" style="margin-bottom:10px"><div class="card-header">${esc(t.name)} · ${t.count} 处薄弱</div><div class="card-body" style="font-size:.84rem">
      ${t.samples.map(m => `<p style="margin-bottom:6px">· ${esc(m.problem.slice(0, 60))}${m.problem.length > 60 ? '…' : ''}</p>`).join('')}
      <button class="btn" style="margin-top:6px" onclick="view='quiz';quizState.topics=['${t.id}'];quizState.problems=genProblems();render()">针对此章节出题 →</button>
    </div></div>`).join('') : '';
  return `<div class="content-inner">
    <h2 class="section-title">薄弱点分析 📊</h2>
    <p class="section-desc">根据错题本自动按知识点归类，帮婉儿一眼看出每个学生哪里最薄弱</p>
    <div class="card"><div class="card-body">
      <div class="form-row"><label>选择学生</label>
        <select id="weakStudent" onchange="window._weakStudent=this.value;render()">
          <option value="">请选择学生</option>
          ${students.map(s => `<option value="${s.id}"${sid === s.id ? ' selected' : ''}>${esc(s.name)}</option>`).join('')}
        </select>
      </div>
      ${!students.length ? '<button class="btn btn-primary" style="width:100%;padding:12px;margin-top:8px" onclick="openStudentForm()">+ 先添加学生</button>' : ''}
    </div></div>
    ${data ? `<div class="weak-summary">
      <div class="weak-stat"><div class="weak-stat-num">${data.allTotal}</div><div class="weak-stat-label">错题累计</div></div>
      <div class="weak-stat"><div class="weak-stat-num">${data.total}</div><div class="weak-stat-label">待巩固</div></div>
      <div class="weak-stat"><div class="weak-stat-num">${data.mastered}</div><div class="weak-stat-label">已掌握</div></div>
    </div>
    <div class="card"><div class="card-header">📌 分析结论</div><div class="card-body" style="font-size:.88rem;line-height:1.7;color:var(--accent)">${esc(data.insight)}</div></div>
    <div class="card"><div class="card-header">知识点薄弱分布</div><div class="card-body"><div class="weak-bar-wrap">${bars}</div></div></div>
    ${samples ? `<h3 style="font-size:.95rem;margin:16px 0 10px">典型错题 & 出题建议</h3>${samples}` : ''}
    <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn btn-primary" id="btnExportWeak">📷 导出分析报告</button>
      <button class="btn" onclick="view='mistakes';render()">查看全部错题 →</button>
    </div>
    <div id="weakExportArea" style="display:none"></div>` : (!students.length ? '' : '<div class="note-empty"><p>请选择学生查看分析</p></div>')}
  </div>`;
}

// ── 家教反馈单 / 学习目标单 ──
function buildFeedbackDoc() {
  const type = window._fbType || 'goal';
  const name = ($('#fbName')?.value || '').trim() || '同学';
  const topics = ($('#fbTopics')?.value || '').trim();
  const content = ($('#fbContent')?.value || '').trim();
  const homework = ($('#fbHomework')?.value || '').trim();
  const perf = ($('#fbPerf')?.value || '').trim();
  const nextPlan = ($('#fbNext')?.value || '').trim();
  const date = $('#fbDate')?.value || today();
  const isGoal = type === 'goal';
  const title = isGoal ? '本次学习目标单' : '课后学习反馈单';
  const sub = isGoal ? '课前发放 · 明确目标' : '课后发送 · 家长可见';
  let body = '';
  if (isGoal) {
    body += `<div class="fd-row"><div class="fd-label">学生</div><div class="fd-val">${esc(name)}</div></div>`;
    body += `<div class="fd-row"><div class="fd-label">日期</div><div class="fd-val">${fmtDate(date)}</div></div>`;
    body += `<div class="fd-row"><div class="fd-label">本次知识点</div><div class="fd-val">${esc(topics) || '—'}</div></div>`;
    body += `<div class="fd-row"><div class="fd-label">学习目标</div><div class="fd-val">${esc(content) || '掌握本节核心公式与典型题型'}</div></div>`;
    if (homework) body += `<div class="fd-row"><div class="fd-label">课前/课中练习</div><div class="fd-val">${esc(homework)}</div></div>`;
  } else {
    body += `<div class="fd-row"><div class="fd-label">学生</div><div class="fd-val">${esc(name)}</div></div>`;
    body += `<div class="fd-row"><div class="fd-label">上课日期</div><div class="fd-val">${fmtDate(date)}</div></div>`;
    body += `<div class="fd-row"><div class="fd-label">本次内容</div><div class="fd-val">${esc(topics) || '—'}</div></div>`;
    body += `<div class="fd-row"><div class="fd-label">课堂表现</div><div class="fd-val">${esc(perf) || '认真听讲，积极思考'}</div></div>`;
    body += `<div class="fd-row"><div class="fd-label">掌握情况</div><div class="fd-val">${esc(content) || '—'}</div></div>`;
    if (homework) body += `<div class="fd-row"><div class="fd-label">布置作业</div><div class="fd-val">${esc(homework)}</div></div>`;
    if (nextPlan) body += `<div class="fd-row"><div class="fd-label">下次重点</div><div class="fd-val">${esc(nextPlan)}</div></div>`;
  }
  return `<div class="feedback-doc" id="feedbackDoc">
    <div class="fd-header">
      <div class="fd-logo">🎀 婉宁老师 · 高中数学</div>
      <div class="fd-sub">${title}</div>
      <div style="font-size:.72rem;color:var(--text2);margin-top:6px">${sub}</div>
    </div>
    <div class="fd-body">${body}</div>
    <div class="fd-footer">蔺婉宁老师 · 专属家教数学辅导 · ${fmtDate(today())}</div>
  </div>`;
}

function renderFeedback() {
  const type = window._fbType || 'goal';
  const stuOpts = students.map(s => `<option value="${esc(s.name)}">${esc(s.name)}</option>`).join('');
  return `<div class="content-inner">
    <h2 class="section-title">家教反馈单 💌</h2>
    <p class="section-desc">一键生成带「婉宁老师专属页眉」的学习目标单 / 课后反馈单，导出图片发家长</p>
    <div class="fb-type-tabs">
      <div class="fb-type-tab${type === 'goal' ? ' on' : ''}" onclick="window._fbType='goal';render()">📋 学习目标单</div>
      <div class="fb-type-tab${type === 'report' ? ' on' : ''}" onclick="window._fbType='report';render()">💬 课后反馈单</div>
    </div>
    <div class="card"><div class="card-body">
      <div class="form-row-2">
        <div class="form-row"><label>学生姓名</label>
          <input id="fbName" list="fbNameList" placeholder="输入或选择学生" value="${esc(window._fbName || '')}">
          <datalist id="fbNameList">${stuOpts}</datalist>
        </div>
        <div class="form-row"><label>日期</label><input type="date" id="fbDate" value="${today()}"></div>
      </div>
      <div class="form-row"><label>知识点 / 本次内容</label>
        <input id="fbTopics" placeholder="如：圆锥曲线、导数应用" value="${esc(window._fbTopics || '')}">
        <div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:4px">${TOPICS.slice(0, 8).map(t => `<span class="chip" onclick="document.getElementById('fbTopics').value='${t.name}'">${t.name}</span>`).join('')}</div>
      </div>
      ${type === 'goal' ? `
      <div class="form-row"><label>学习目标</label><textarea id="fbContent" placeholder="如：掌握椭圆标准方程与离心率求法">${esc(window._fbGoal || '')}</textarea></div>
      <div class="form-row"><label>练习安排（可选）</label><input id="fbHomework" placeholder="课中练习 P23 1-5"></div>
      ` : `
      <div class="form-row"><label>课堂表现</label><select id="fbPerf"><option>优秀</option><option>良好</option><option>一般</option><option>需加强</option></select></div>
      <div class="form-row"><label>掌握情况 / 反馈内容</label><textarea id="fbContent" placeholder="本节掌握较好，需加强计算准确度…"></textarea></div>
      <div class="form-row"><label>布置作业</label><input id="fbHomework" placeholder="练习册页码"></div>
      <div class="form-row"><label>下次重点（可选）</label><input id="fbNext" placeholder="巩固圆锥曲线大题"></div>
      `}
      <button class="btn btn-primary" id="btnGenFeedback" style="width:100%;padding:14px;margin-top:8px;font-size:.95rem">✨ 生成预览</button>
    </div></div>
    <div id="feedbackPreview">${window._fbPreview || ''}</div>
  </div>`;
}

function initFeedback() {
  $('#btnGenFeedback')?.addEventListener('click', () => {
    window._fbPreview = buildFeedbackDoc();
    const el = document.getElementById('feedbackPreview');
    if (el) { el.innerHTML = window._fbPreview; toast('已生成，可导出图片发给家长'); }
    else render();
  });
  $('#btnExportFeedback')?.addEventListener('click', () => {
    if (!document.getElementById('feedbackDoc')) { $('#btnGenFeedback')?.click(); setTimeout(() => exportLongImage('#feedbackDoc', `反馈单_${today()}.png`), 300); }
    else exportLongImage('#feedbackDoc', `反馈单_${today()}.png`);
  });
  $('#btnPrintFeedback')?.addEventListener('click', () => {
    if (!document.getElementById('feedbackDoc')) $('#btnGenFeedback')?.click();
    setTimeout(() => window.print(), 200);
  });
}

function initWeakness() {
  $('#btnExportWeak')?.addEventListener('click', () => {
    const sid = window._weakStudent || students[0]?.id;
    if (!sid) { toast('请先选择学生'); return; }
    const data = analyzeStudentWeakness(sid);
    const area = document.getElementById('weakExportArea');
    if (!area || !data) return;
    area.style.display = 'block';
    area.innerHTML = `<div class="feedback-doc" id="weakDoc"><div class="fd-header"><div class="fd-logo">🎀 婉宁老师 · 薄弱点分析</div><div class="fd-sub">${esc(data.student.name)}</div></div><div class="fd-body">
      <p>错题累计 ${data.allTotal} · 待巩固 ${data.total} · 已掌握 ${data.mastered}</p>
      <p style="margin-top:10px">${esc(data.insight)}</p>
      ${data.topics.map(t => `<p>· ${esc(t.name)}：${t.count} 处（${t.rate}%）</p>`).join('')}
    </div><div class="fd-footer">${fmtDate(today())}</div></div>`;
    setTimeout(() => exportLongImage('#weakDoc', `薄弱点_${data.student.name}_${today()}.png`), 100);
  });
}

// ── 渲染：更多（手机） ──
function renderMore() {
  const st = typeof getCoupleHomeStats === 'function' ? getCoupleHomeStats() : { hundredDone: 0, hundredTotal: 0 };
  const items = [
    {go:'wishes',icon:'🌟',label:'共同心愿',sub:'旅行·美食·小事'},
    {go:'hundred',icon:'💫',label:'一百件小事',sub:`${st.hundredDone}/${st.hundredTotal || 0} 完成`},
    {go:'growth',icon:'🌱',label:'成长记录',sub:'随笔与留言'},
    {go:'draw',icon:'🎨',label:'涂鸦小窝',sub:'同屏画画',homeStatus:'draw'},
    {go:'photos',icon:'📷',label:'回忆相册',sub:'合照与碎片',homeStatus:'photos'},
    {go:'chat',icon:'💬',label:'私密树洞',sub:'碎碎念与情话',homeStatus:'chat'},
    {go:'backup',icon:'💾',label:'数据备份',sub:backupStatusText().slice(0,12)},
  ];
  return `<div class="content-inner">
    <h2 class="section-title">更多</h2>
    <div class="more-grid">${items.map(i=>`
      <div class="quick-btn" data-go="${i.go}"><div class="icon">${i.icon}</div><div class="label">${i.label}</div><div class="sub"${i.homeStatus ? ` data-sync-home-status="${i.homeStatus}"` : ''}>${i.sub}</div></div>`).join('')}
    </div>
    <div class="card" style="margin-top:16px"><div class="card-body">
      <div style="font-size:.84rem;margin-bottom:10px">显示模式</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn${theme==='cute'?' on':''}" onclick="applyTheme('cute');render()">🎀 柔和</button>
        <button class="btn${theme==='eye'?' on':''}" onclick="applyTheme('eye');render()">👁 护眼</button>
        <button class="btn${theme==='dark'?' on':''}" onclick="applyTheme('dark');render()">🌙 夜间</button>
      </div>
    </div></div>
  </div>`;
}

// ── 渲染：速查入口（手机） ──
function renderRefHub() {
  const favBlock = formulaFavs.length ? `<div class="home-fav-formulas" style="margin-bottom:14px">
    <div class="hff-head"><span>⭐ 公式收藏夹</span><span style="font-size:.75rem;font-weight:400;color:var(--text2)">${formulaFavs.length} 条</span></div>
    <div class="fav-formula-grid">${formulaFavs.map(f => `<div class="fav-formula-chip" data-ffkey="${esc(f.key)}"><span class="ffc-mod">${esc(f.moduleName || topicName(f.moduleId))}</span><span class="ffc-name">${esc(f.name)}</span></div>`).join('')}</div>
  </div>` : '';
  return `<div class="content-inner">
    <h2 class="section-title">公式速查</h2>
    <div class="search-wrap" style="max-width:100%;margin-bottom:14px">
      <input type="search" id="mobileSearch" placeholder="搜索公式、知识点…" style="width:100%;padding:12px 14px;border:1px solid var(--border);border-radius:12px;background:var(--surface)">
    </div>
    ${favBlock}
    <button class="btn" style="width:100%;margin-bottom:12px;padding:10px" onclick="view='custom';render()">✨ 我的自定义公式（${customFormulas.length}）</button>
    <div class="home-grid">${DATA.map(d=>`
      <div class="home-card" data-go="section" data-id="${d.id}"><h3>${d.icon} ${d.name}</h3><p>${d.desc}</p></div>`).join('')}
    </div>
  </div>`;
}

// ── 表单 ──
function openStudentForm(id) {
  const s = id ? students.find(x=>x.id===id) : null;
  $('#modalTitle').textContent = s ? '编辑学生' : '添加学生';
  $('#modalBody').innerHTML = `
    <div class="form-row"><label>姓名 *</label><input id="sName" value="${esc(s?.name||'')}" placeholder="学生姓名"></div>
    <div class="form-row-2">
      <div class="form-row"><label>年级</label><input id="sGrade" value="${esc(s?.grade||'')}" placeholder="高一/高二/高三"></div>
      <div class="form-row"><label>家长称呼</label><input id="sParent" value="${esc(s?.parent||'')}" placeholder="张同学家长"></div>
    </div>
    <div class="form-row"><label>备注</label><input id="sNote" value="${esc(s?.note||'')}" placeholder="薄弱章节、学习目标…"></div>`;
  $('#modalFooter').innerHTML = `<button class="btn" onclick="closeModal()">取消</button><button class="btn btn-primary" id="sSave">保存</button>`;
  $('#modal').classList.add('show');
  $('#sSave').onclick = () => {
    const name = $('#sName').value.trim();
    if (!name) { toast('请填写姓名'); return; }
    const item = { id:s?.id||uid(), name, grade:$('#sGrade').value.trim(), parent:$('#sParent').value.trim(), note:$('#sNote').value.trim() };
    if (s) students = students.map(x=>x.id===id?item:x); else students.push(item);
    save('math-students', students); closeModal(); render(); toast('已保存');
  };
}

function openSessionForm() {
  const sel = window._reportStudent || students[0]?.id || '';
  $('#modalTitle').textContent = '记录本次课';
  $('#modalBody').innerHTML = `
    <div class="form-row-2">
      <div class="form-row"><label>学生</label><select id="sessStudent">${students.map(s=>`<option value="${s.id}"${sel===s.id?' selected':''}>${esc(s.name)}</option>`).join('')}</select></div>
      <div class="form-row"><label>日期</label><input type="date" id="sessDate" value="${today()}"></div>
    </div>
    <div class="form-row"><label>教学内容</label><input id="sessTopics" placeholder="函数、导数（逗号分隔）"></div>
    <div class="form-row-2">
      <div class="form-row"><label>做对题数</label><input type="number" id="sessCorrect" min="0" value="0"></div>
      <div class="form-row"><label>做错题数</label><input type="number" id="sessWrong" min="0" value="0"></div>
    </div>
    <div class="form-row"><label>课堂表现</label><select id="sessPerf"><option>优秀</option><option>良好</option><option>一般</option><option>需加强</option></select></div>
    <div class="form-row"><label>作业布置</label><input id="sessHw" placeholder="练习册 P23 1-5"></div>
    <div class="form-row"><label>备注</label><textarea id="sessNote" placeholder="家长需知、下次重点…"></textarea></div>`;
  $('#modalFooter').innerHTML = `<button class="btn" onclick="closeModal()">取消</button><button class="btn btn-primary" id="sessSave">保存并更新报告</button>`;
  $('#modal').classList.add('show');
  $('#sessSave').onclick = () => {
    const topics = $('#sessTopics').value.split(/[,，、]/).map(s=>s.trim()).filter(Boolean);
    sessions.unshift({ id:uid(), studentId:$('#sessStudent').value, date:$('#sessDate').value,
      topics, correct:+$('#sessCorrect').value, wrong:+$('#sessWrong').value,
      performance:$('#sessPerf').value, homework:$('#sessHw').value.trim(), note:$('#sessNote').value.trim() });
    save('math-sessions', sessions); closeModal(); render(); toast('上课记录已保存');
  };
}

function openCustomFormulaForm(id) {
  const f = id ? customFormulas.find(x=>x.id===id) : null;
  $('#modalTitle').textContent = f ? '编辑公式' : '添加自定义公式';
  $('#modalBody').innerHTML = `
    <div class="form-row"><label>名称 *</label><input id="cfName" value="${esc(f?.name||'')}" placeholder="如：韦达定理快记"></div>
    <div class="form-row"><label>章节</label><select id="cfTopic">${TOPICS.map(t=>`<option value="${t.id}"${(f?.topic||'func')===t.id?' selected':''}>${t.name}</option>`).join('')}</select></div>
    <div class="form-row"><label>公式 / 技巧内容 *</label><textarea id="cfContent" style="min-height:90px" placeholder="支持 HTML：x=(-b±√Δ)/2a">${esc(f?.content||'')}</textarea></div>
    <div class="form-row"><label>备注</label><input id="cfNote" value="${esc(f?.note||'')}" placeholder="使用场景、注意事项"></div>`;
  $('#modalFooter').innerHTML = `<button class="btn" onclick="closeModal()">取消</button><button class="btn btn-primary" id="cfSave">保存</button>`;
  $('#modal').classList.add('show');
  $('#cfSave').onclick = () => {
    const name=$('#cfName').value.trim(), content=$('#cfContent').value.trim();
    if(!name||!content){toast('请填写名称和内容');return;}
    const item={id:f?.id||uid(),name,topic:$('#cfTopic').value,content,note:$('#cfNote').value.trim(),createdAt:f?.createdAt||new Date().toISOString()};
    if(f) customFormulas=customFormulas.map(x=>x.id===id?item:x); else customFormulas.unshift(item);
    save('math-custom-formulas',customFormulas); closeModal(); render(); toast('已保存到公式库');
  };
}

window.openStudentForm = openStudentForm;
window.openCustomFormulaForm = openCustomFormulaForm;
window.delCustomFormula = id => { if(confirm('删除？')){customFormulas=customFormulas.filter(f=>f.id!==id);save('math-custom-formulas',customFormulas);if(typeof formulaFavs!=='undefined'){const k=typeof ffCustomKey==='function'?ffCustomKey(id):'custom:'+id;formulaFavs=formulaFavs.filter(f=>f.key!==k);save('math-formula-favs',formulaFavs);}render();}};

function initReports() {
  $('#btnLogSession')?.addEventListener('click', openSessionForm);
  $('#btnCopyReport')?.addEventListener('click', () => {
    const t=$('#reportText')?.textContent; if(t && typeof copyText==='function') copyText(t);
  });
  $('#btnCopyPlan')?.addEventListener('click', () => {
    const sel=window._reportStudent; if(sel && typeof copyText==='function') copyText(generatePracticePlan(sel));
  });
  $('#btnExportReport')?.addEventListener('click', () => exportLongImage('#reportExportArea', `学情报告_${today()}.png`));
}

function initBackup() {
  $('#btnFullExport')?.addEventListener('click', doExportAll);
  $('#btnFullImport')?.addEventListener('click', () => { window._importMerge=false; $('#importFile').click(); });
  $('#btnMergeImport')?.addEventListener('click', () => { window._importMerge=true; $('#importFile').click(); });
  $('#importFile')?.addEventListener('change', e => { const f=e.target.files[0]; if(f) doImportAll(f, window._importMerge); e.target.value=''; });
}

function initBnavAutoHide() { /* 手机底栏保持常显，避免误藏导致无法切换模块 */ }

function renderBottomNav() {
  const el = document.getElementById('bottomNav');
  if (!el) return;
  el.classList.remove('bnav-hidden');
  document.body.classList.remove('bnav-auto-hidden');
  el.style.pointerEvents = 'auto';
  const tabs = [
    {v:'home',icon:'🏠',label:'小窝'},
    {v:'draw',icon:'🎨',label:'涂鸦'},
    {v:'photos',icon:'📷',label:'相册'},
    {v:'chat',icon:'💬',label:'树洞'},
    {v:'more',icon:'⚙️',label:'更多'}
  ];
  const drawViews = ['draw'];
  const moreViews = ['more','wishes','hundred','growth','backup'];
  let cur = 'home';
  if (view === 'home') cur = 'home';
  else if (drawViews.includes(view)) cur = 'draw';
  else if (view === 'photos') cur = 'photos';
  else if (view === 'chat') cur = 'chat';
  else if (moreViews.includes(view)) cur = 'more';
  el.innerHTML = tabs.map(t=>`<button type="button" class="bnav-item${cur===t.v?' active':''}" data-bnav="${t.v}"><span class="bnav-icon">${t.icon}</span><span class="bnav-label">${t.label}</span></button>`).join('');
}

function bindMobileSearch() {
  const ms = document.getElementById('mobileSearch');
  if (ms) ms.oninput = e => { $('#searchInput').value=e.target.value; doSearch(e.target.value); };
}

function patchQuizGen() {
  if (typeof quizState.types === 'undefined') quizState.types = [...QUESTION_TYPES];
}

function initExtView() {
  if (view==='backup') setTimeout(initBackup,30);
  if (typeof initCoupleView === 'function') initCoupleView(view);
  renderBottomNav();
  if ((view === 'home' || view === 'more') && typeof window.syncRefreshHomePresence === 'function') {
    window.syncRefreshHomePresence();
  }
}
