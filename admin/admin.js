const tokenKey = "7ya-admin-token";
const userKey = "7ya-admin-user";
const $ = (id) => document.getElementById(id);

function setNote(message, isError = false) {
  $("formNote").textContent = message;
  $("formNote").classList.toggle("error", isError);
}

async function api(path, options = {}) {
  const token = localStorage.getItem(tokenKey);
  const headers = { "content-type": "application/json", ...(options.headers || {}) };
  if (token) headers.authorization = `Bearer ${token}`;
  const response = await fetch(path, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok === false) throw new Error(data.error || data.message || `HTTP ${response.status}`);
  return data;
}

function renderSession() {
  const user = JSON.parse(localStorage.getItem(userKey) || "null");
  $("sessionStatus").textContent = user ? user.email : "לא מחובר";
  $("roleStatus").textContent = user?.role || "—";
  $("dashboard").hidden = !user;
  $("loginForm").hidden = Boolean(user);
}

async function checkHealth() {
  try {
    const result = await fetch("/api/health");
    $("apiStatus").textContent = result.ok ? "פעיל" : "שגיאה";
  } catch {
    $("apiStatus").textContent = "לא זמין";
  }
}

async function loadDashboard() {
  if (!localStorage.getItem(tokenKey)) return;
  try {
    const [stats, posts, payments] = await Promise.all([
      api("/api/admin-stats"),
      api("/api/posts"),
      api("/api/payments")
    ]);

    $("usersMetric").textContent = stats.stats.users;
    $("postsMetric").textContent = stats.stats.posts;
    $("paymentsMetric").textContent = stats.stats.payments;
    $("revenueMetric").textContent = `$${Number(stats.stats.capturedRevenue || 0).toLocaleString()}`;

    $("postsList").innerHTML = posts.posts.map((post) => `
      <article><strong>${escapeHtml(post.title)}</strong><span>${new Date(post.created_at).toLocaleString("he-IL")}</span><p>${escapeHtml(post.content).slice(0, 180)}</p></article>
    `).join("") || "<p class='empty'>אין פוסטים עדיין.</p>";

    $("paymentsList").innerHTML = payments.payments.map((payment) => `
      <article><strong>${escapeHtml(payment.status)}</strong><span>${escapeHtml(payment.currency)} ${Number(payment.amount).toLocaleString()}</span><p>${new Date(payment.created_at).toLocaleString("he-IL")}</p></article>
    `).join("") || "<p class='empty'>אין תשלומים עדיין.</p>";
  } catch (error) {
    setNote(`לא ניתן לטעון ניהול: ${error.message}`, true);
  }
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}

$("loginForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  setNote("מתחבר…");
  try {
    const data = await api("/api/login", {
      method: "POST",
      body: JSON.stringify({ email: $("email").value, password: $("password").value })
    });
    localStorage.setItem(tokenKey, data.token);
    localStorage.setItem(userKey, JSON.stringify(data.user));
    setNote("מחובר בהצלחה.");
    renderSession();
    await loadDashboard();
  } catch (error) {
    setNote(`כניסה נכשלה: ${error.message}`, true);
  }
});

$("postForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  $("postNote").textContent = "שומר…";
  try {
    await api("/api/posts", {
      method: "POST",
      body: JSON.stringify({ title: $("postTitle").value, content: $("postContent").value })
    });
    event.currentTarget.reset();
    $("postNote").textContent = "הפוסט נשמר.";
    await loadDashboard();
  } catch (error) {
    $("postNote").textContent = `שגיאה: ${error.message}`;
  }
});

$("logoutButton").addEventListener("click", () => {
  localStorage.removeItem(tokenKey);
  localStorage.removeItem(userKey);
  renderSession();
  setNote("התנתקת מהניהול.");
});

renderSession();
checkHealth();
loadDashboard();
