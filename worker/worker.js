// Server-side API: keeps all data-store credentials out of the browser.
const URL_ = (typeof DB_URL !== "undefined" && DB_URL) || "https://dmnwmlyfodzlfhpntjnl.supabase.co";
const KEY = (typeof DB_KEY !== "undefined" && DB_KEY) || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtbndtbHlmb2R6bGZocG50am5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzMDc2NDcsImV4cCI6MjEwNjg4MzY0N30.Mm4d_LIEg9JMjMA_P8pe-sRMiJ-FMYACgItW5PNTwsI";
const P = "https://kidsbestie.com/products/";
const GIFTS = {
  bird: P + "voice-controlled-talking-bird-interactive-repeating-pet-toy",
  art: P + "168-piece-art-set-drawing-and-painting-set-for-kids",
  speaker: P + "wireless-mini-vocal-bluetooth-speaker-with-mic-rgb-lights-10-w-bluetooth-speaker",
  foam: P + "foam-mat-alphabet-number-kids",
  piano: P + "2-in-1-piano-xylophone-for-toddlers",
  tictactoe: P + "ai-intelligence-tic-tac-toe-9-game-modes-brain-boosting-strategy-fun",
  B0FN3GLZ6X: "https://www.amazon.in/dp/B0FN3GLZ6X",
  B0HF42GBCQ: "https://www.amazon.in/dp/B0HF42GBCQ",
  B0DX2B9P66: "https://www.amazon.in/dp/B0DX2B9P66",
  B0FBM2TBG6: "https://www.amazon.in/dp/B0FBM2TBG6",
  9389053137: "https://www.amazon.in/dp/9389053137",
  B0HBQW29Y4: "https://www.amazon.in/dp/B0HBQW29Y4",
  B0DFMFYZYS: "https://www.amazon.in/dp/B0DFMFYZYS",
  B09NSSYTN6: "https://www.amazon.in/dp/B09NSSYTN6",
  B0CCYH843S: "https://www.amazon.in/dp/B0CCYH843S",
  B0DCBC28SG: "https://www.amazon.in/dp/B0DCBC28SG",
  B0GX24MZKZ: "https://www.amazon.in/dp/B0GX24MZKZ",
  B0FP4SBVDS: "https://www.amazon.in/dp/B0FP4SBVDS",
  B08D9JNTZ3: "https://www.amazon.in/dp/B08D9JNTZ3",
};
const FALLBACK = {
  tictactoe: "https://kidsbestie.com/cdn/shop/files/1_91c15440-7219-4181-953c-bc17debb5266.png?v=1758895280",
  art: "https://kidsbestie.com/cdn/shop/files/1_b1e9df78-a3b1-4eec-880d-84e5ab6757a5.png?v=1736512106",
  speaker: "https://kidsbestie.com/cdn/shop/files/Mini__Vocal__Bluetooth__Speaker__Mic.png?v=1786526852",
};
const imgCache = {}, priceCache = {};
const H = { apikey: KEY, Authorization: "Bearer " + KEY, "Content-Type": "application/json" };
const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET,POST,OPTIONS", "Access-Control-Allow-Headers": "Content-Type" };
const json = (c, o) => new Response(JSON.stringify(o), { status: c, headers: { ...CORS, "Content-Type": "application/json", "Cache-Control": "no-store" } });
const clean = (s, n) => String(s || "").replace(/[<>]/g, "").trim().slice(0, n);

const metaCache = {};
async function meta(id) {
  if (metaCache[id]) return metaCache[id];
  const o = {};
  try {
    const r = await fetch(GIFTS[id], { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36", "Accept-Language": "en-IN,en;q=0.9", Accept: "text/html" } });
    const t = await r.text();
    const g = (re) => { const m = t.match(re); return m && m[1]; };
    const dec = (s) => s && s.replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"');
    const title = dec(g(/id="productTitle"[^>]*>\s*([^<]+?)\s*</) || g(/property="og:title" content="([^"]+)"/));
    if (title) o.t = title.slice(0, 80);
    const pr = g(/property="og:price:amount" content="([\d.,]+)"/) || g(/class="a-price-whole">\s*([\d,]+)/) || g(/a-offscreen">\s*₹\s*([\d,]+)/);
    if (pr) o.p = Math.round(parseFloat(pr.replace(/,/g, "")));
    const im = g(/property="og:image:secure_url" content="([^"]+)"/) || g(/property="og:image" content="([^"]+)"/) || g(/id="landingImage"[^>]*data-old-hires="([^"]+)"/) || g(/id="landingImage"[^>]*src="([^"]+)"/);
    if (im) o.i = dec(im).replace(/^http:/, "https:");
  } catch (e) {}
  if (o.t || o.p || o.i) metaCache[id] = o;
  return o;
}
const productImage = async (id) => (await meta(id)).i || FALLBACK[id] || null;
const productPrice = async (id) => (await meta(id)).p || null;

export default {
  async fetch(req) {
    const u = new URL(req.url);
    const path = u.pathname.replace(/^.*\/api\/?/, "").replace(/^\//, "");
    const m = req.method;
    if (m === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
    try {
      if (m === "GET" && path === "state") {
        const [b, w] = await Promise.all([
          fetch(`${URL_}/rest/v1/gifts_bought?select=gift_id,buyer_name`, { headers: H }).then((r) => r.json()),
          fetch(`${URL_}/rest/v1/wishes?select=id,name,message,emoji,created_at&order=created_at.desc&limit=200`, { headers: H }).then((r) => r.json()),
        ]);
        return json(200, { bought: Array.isArray(b) ? b : [], wishes: Array.isArray(w) ? w : [] });
      }
      if (m === "GET" && path === "info") {
        const ids = Object.keys(GIFTS), r = await Promise.all(ids.map(meta));
        const o = {}; ids.forEach((k, i) => (o[k] = r[i]));
        return json(200, o);
      }
      if (m === "GET" && path === "img") {
        const id = u.searchParams.get("id");
        const img = GIFTS[id] && (await productImage(id));
        return img ? new Response(null, { status: 302, headers: { ...CORS, Location: img, "Cache-Control": "public, max-age=86400" } }) : new Response(null, { status: 404, headers: CORS });
      }
      if (m === "POST" && path === "buy") {
        const d = await req.json().catch(() => ({}));
        if (!GIFTS[d.giftId]) return json(400, { error: "Unknown gift" });
        const r = await fetch(`${URL_}/rest/v1/gifts_bought`, { method: "POST", headers: { ...H, Prefer: "return=minimal" }, body: JSON.stringify({ gift_id: d.giftId, buyer_name: clean(d.name, 60) || null }) });
        if (r.status === 409) return json(409, { error: "Already bought" });
        return r.ok ? json(200, { ok: true }) : json(500, { error: "Could not save" });
      }
      if (m === "POST" && path === "wish") {
        const d = await req.json().catch(() => ({}));
        const name = clean(d.name, 60), message = clean(d.message, 500);
        if (!name || !message) return json(400, { error: "Name and message required" });
        const r = await fetch(`${URL_}/rest/v1/wishes`, { method: "POST", headers: { ...H, Prefer: "return=minimal" }, body: JSON.stringify({ name, message, emoji: clean(d.emoji, 4) || "🎈" }) });
        return r.ok ? json(200, { ok: true }) : json(500, { error: "Could not save" });
      }
      return json(404, { error: "Not found" });
    } catch (e) {
      return json(500, { error: "Server error" });
    }
  },
};
