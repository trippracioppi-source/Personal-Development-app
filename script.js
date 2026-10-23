const STATS = ["Discipline", "Business", "Health", "Mind"];
const XP_PER_LOG = 10;
const XP_PER_LEVEL = 100;
const STORAGE_KEY = "dev-tracker";

const STAT_ICONS = {
  Discipline: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M12 2c1.2 3-2.7 4.3-2.7 8.1a2.7 2.7 0 0 0 5.4 0c0-.9-.5-1.6-.9-2.5 1.9 1 3.2 2.9 3.2 5.1A5 5 0 0 1 7 12.7C7 7.3 11 6.1 12 2z"></path></svg>',
  Business: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><rect x="3" y="7.5" width="18" height="11.5" rx="2"></rect><path d="M8 7.5v-2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><path d="M3 12.5h18"></path></svg>',
  Health: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M3 12.5h4l1.8-4 2.6 7 1.8-5 1.3 2h6.5"></path></svg>',
  Mind: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M9.5 3.5a2.8 2.8 0 0 0-2.8 2.8 2.9 2.9 0 0 0-1.7 5 2.9 2.9 0 0 0 1.7 5h1a2.8 2.8 0 0 0 2.8-2.8V6.3a2.8 2.8 0 0 0-1-2.8z"></path><path d="M14.5 3.5a2.8 2.8 0 0 1 2.8 2.8 2.9 2.9 0 0 1 1.7 5 2.9 2.9 0 0 1-1.7 5h-1a2.8 2.8 0 0 1-2.8-2.8V6.3a2.8 2.8 0 0 1 1-2.8z"></path></svg>'
};

const BUTTON_ANGLES = { Discipline: '135deg', Business: '45deg', Health: '90deg', Mind: '180deg' };

let logs = loadLogs();

function loadLogs() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveLogs() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

function xpFor(stat) {
  return logs.filter((l) => l.stat === stat).length * XP_PER_LOG;
}

function levelFor(xp) {
  return Math.floor(xp / XP_PER_LEVEL);
}

function logStat(stat, action) {
  logs.push({ stat, action, time: Date.now() });
  saveLogs();
  render();
}

function render() {
  const statsEl = document.getElementById("stats");
  statsEl.innerHTML = "";

  STATS.forEach((stat) => {
    const xp = xpFor(stat);
    const card = document.createElement("div");
    card.className = "stat";
    card.innerHTML = `
      <div class="stat-header">
        <div class="badge">${STAT_ICONS[stat]}</div>
        <div class="stat-info">
          <h3>${stat}</h3>
          <div class="meta">Level ${levelFor(xp)} &middot; ${xp} XP</div>
        </div>
      </div>
      <div class="bar"><div class="bar-fill" style="width:${xp % XP_PER_LEVEL}%"></div></div>
      <input type="text" placeholder="What did you do?">
      <button type="button" style="background: linear-gradient(${BUTTON_ANGLES[stat]}, #4ca589, var(--accent));">Log +${XP_PER_LOG} XP</button>
    `;
    const input = card.querySelector("input");
    input.addEventListener("input", () => input.classList.remove("invalid"));
    card.querySelector("button").addEventListener("click", () => {
      const action = input.value.trim();
      if (!action) {
        input.classList.add("invalid");
        input.focus();
        return;
      }
      logStat(stat, action);
    });
    statsEl.appendChild(card);
  });

  const totalXp = logs.length * XP_PER_LOG;
  const xpIntoLevel = totalXp % XP_PER_LEVEL;
  document.getElementById("total-level-display").textContent = `Level ${levelFor(totalXp)}`;
  document.getElementById("total-xp-display").textContent = `${xpIntoLevel} / ${XP_PER_LEVEL} XP`;
  document.getElementById("overall-bar-fill").style.width = xpIntoLevel + "%";

  const list = document.getElementById("history-list");
  list.innerHTML = "";
  [...logs].reverse().forEach((l) => {
    const li = document.createElement("li");
    const text = document.createElement("span");
    text.textContent = l.action
      ? `${l.stat} - ${l.action} +${XP_PER_LOG} XP`
      : `${l.stat} +${XP_PER_LOG} XP`;
    const time = document.createElement("span");
    time.className = "time";
    time.textContent = new Date(l.time).toLocaleString();
    li.append(text, time);
    list.appendChild(li);
  });
}

render();
