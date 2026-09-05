const destinations = {
  sanguo: {
    title: "下一站：三国赤壁古战场",
    body: "听完赤壁之战，沿江去古战场。看一场小剧场，登一回古战船，把“知道那一战”变成“走进那一战”。"
  },
  tea: {
    title: "下一站：羊楼洞古镇",
    body: "茶道讲完，就去羊楼洞。喝一杯青砖茶，亲手压一块茶砖，选一份能带走的礼物。"
  }
};

const plans = {
  "1-history-sanguo": {
    title: "一日线：读懂赤壁，走进赤壁",
    steps: ["上午 · 赤壁市博物馆：把这座城和那场仗先听清楚", "中午 · 城里吃饭，换乘文旅专线", "下午 · 三国赤壁古战场：江岸、剧场、登船或闯关", "傍晚 · 打开一码，看当天还有什么可玩"]
  },
  "1-history-tea": {
    title: "一日线：读懂赤壁，品味赤壁",
    steps: ["上午 · 赤壁市博物馆：文物、三国和茶道怎么长在一起", "中午 · 专车去羊楼洞，路上听万里茶道", "下午 · 喝茶、压茶、选礼物", "傍晚 · 带走一块铭文茶砖或一份茶礼"]
  },
  "1-sanguo-tea": {
    title: "一日线：游三国，品青砖茶",
    steps: ["上午 · 三国赤壁古战场：上场演一回", "中午 · 专线转往羊楼洞", "下午 · 青砖茶和伴手礼", "晚上 · 打卡，把这一天收进一码"]
  },
  "1-full": {
    title: "一日畅游：三站快览",
    steps: ["上午 · 博物馆九十分钟，先读懂", "午后 · 古战场上场", "傍晚 · 羊楼洞喝一杯、带一份", "全天 · 专线连起来，少走回头路"]
  },
  "2-full": {
    title: "两日沉浸：读懂、走进、带走",
    steps: ["D1 上午 · 博物馆慢慢看", "D1 下午到夜里 · 古战场剧场和江岸", "D2 上午 · 羊楼洞制茶", "D2 下午 · 选礼物、吃饭住宿、返程"]
  },
  "2-family": {
    title: "两日亲子线：可听、可玩、可做",
    steps: ["D1 · 博物馆互动讲解 + 古战场闯关", "D1 夜 · 住在城里，一码看明天的车", "D2 · 羊楼洞亲手压茶、画包装", "返程 · 带走三国人物茶礼盒"]
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
    <p>博物馆先读懂，古战场再上场，羊楼洞把东西带走。</p>
    <ol>${plan.steps.map((step) => `<li>${step}</li>`).join("")}</ol>
    <p>一票能通，一码能查车，专线把路跑完。</p>
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

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCap = document.getElementById("lightbox-cap");
const lightboxClose = document.getElementById("lightbox-close");

document.querySelectorAll(".shot").forEach((button) => {
  button.addEventListener("click", () => {
    lightboxImg.src = button.dataset.full;
    lightboxImg.alt = button.querySelector("img").alt;
    lightboxCap.textContent = button.dataset.caption || "";
    lightbox.showModal();
  });
});

lightboxClose.addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});

setKiosk("sanguo");
renderPlan(plans["1-history-sanguo"]);
