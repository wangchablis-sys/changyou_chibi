const destinations = {
  sanguo: {
    title: "下一站：三国赤壁古战场",
    body: "博物馆讲完赤壁之战的来龙去脉后，沿江前往古战场。在那里看沉浸小剧场、登古战船、参与历史闯关，把“知道赤壁之战”变成“走进赤壁之战”。"
  },
  tea: {
    title: "下一站：羊楼洞古镇",
    body: "如果被万里茶道与青砖茶吸引，就去羊楼洞。喝一杯青砖茶，亲手压制茶砖，选一份可以带走的文创，让赤壁从知识变成生活。"
  }
};

const plans = {
  "1-history-sanguo": {
    title: "一日线：读懂赤壁，走进赤壁",
    steps: ["上午 · 赤壁市博物馆：建立城市与三国的整体认知", "中午 · 城区简餐，换乘文旅专线", "下午 · 三国赤壁古战场：沉浸体验与江边步道", "傍晚 · 一码查看活动与打卡"]
  },
  "1-history-tea": {
    title: "一日线：读懂赤壁，品味赤壁",
    steps: ["上午 · 赤壁市博物馆：文物、三国与茶道脉络", "中午 · 文旅巴士前往羊楼洞，途中听万里茶道", "下午 · 制茶、茶饮与文创购买", "傍晚 · 带走博物馆铭文茶砖或茶礼盒"]
  },
  "1-sanguo-tea": {
    title: "一日线：游三国，品青砖茶",
    steps: ["上午 · 三国赤壁古战场核心体验", "中午 · 专线转往羊楼洞", "下午 · 青砖茶体验与伴手礼", "晚上 · 分享打卡，完成一码记录"]
  },
  "1-full": {
    title: "一日畅游：三站快览",
    steps: ["上午 · 博物馆 90 分钟“前导课程”", "午后 · 古战场核心 IP 体验", "傍晚 · 羊楼洞一盏茶与文创", "全天 · 文旅专线串联，减少折返"]
  },
  "2-full": {
    title: "两日沉浸：认识、走进、带走",
    steps: ["D1 上午 · 博物馆深度导览", "D1 下午至夜 · 古战场沉浸剧场与江岸", "D2 上午 · 羊楼洞制茶与茶道", "D2 下午 · 文创选购、美食住宿与返程"]
  },
  "2-family": {
    title: "两日亲子线：可听、可玩、可做",
    steps: ["D1 · 博物馆互动讲解 + 古战场任务闯关", "D1 夜 · 城区住宿，一码查看次日专线", "D2 · 羊楼洞亲手压茶、设计包装", "返程 · 带走三国人物茶礼盒"]
  }
};

const header = document.getElementById("site-header");
const toggle = document.getElementById("nav-toggle");
const nav = document.getElementById("site-nav");
const panel = document.getElementById("kiosk-panel");
const form = document.getElementById("planner-form");
const card = document.getElementById("plan-card");

function setKiosk(key) {
  const item = destinations[key];
  panel.innerHTML = `<strong>${item.title}</strong><br>${item.body}`;
}

function buildPlan(interests, days) {
  const hasHistory = interests.includes("history");
  const hasSanguo = interests.includes("sanguo");
  const hasTea = interests.includes("tea");
  const family = interests.includes("family");

  if (days === "2" && family) return plans["2-family"];
  if (days === "2") return plans["2-full"];
  if (hasHistory && hasSanguo && hasTea) return plans["1-full"];
  if (hasHistory && hasTea && !hasSanguo) return plans["1-history-tea"];
  if (hasSanguo && hasTea && !hasHistory) return plans["1-sanguo-tea"];
  return plans["1-history-sanguo"];
}

function renderPlan(plan) {
  card.innerHTML = `
    <h3>${plan.title}</h3>
    <p>对应体系功能：博物馆导入，古战场体验，羊楼洞转化。</p>
    <ol>${plan.steps.map((step) => `<li>${step}</li>`).join("")}</ol>
    <p>一票进入组合权益，一码查询专线，一线把最后一公里走完。</p>
  `;
}

window.addEventListener("scroll", () => {
  header.classList.toggle("is-scrolled", window.scrollY > 8);
}, { passive: true });

toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(open));
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll(".kiosk-choice").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".kiosk-choice").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    setKiosk(button.dataset.next);
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const interests = data.getAll("interest");
  const days = data.get("days");
  if (!interests.length) {
    card.innerHTML = "<h3>请先选择至少一个兴趣</h3><p>读历史、游三国或品青砖茶，至少选一项，才能生成线路。</p>";
    return;
  }
  renderPlan(buildPlan(interests, days));
});

setKiosk("sanguo");
renderPlan(plans["1-history-sanguo"]);
