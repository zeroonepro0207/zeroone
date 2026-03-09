import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("database.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS portfolios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    thumbnail TEXT,
    video_url TEXT,
    category TEXT,
    is_featured INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    author TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Add is_featured column if it doesn't exist
try {
  db.exec("ALTER TABLE portfolios ADD COLUMN is_featured INTEGER DEFAULT 0");
} catch (e) {
  // Column already exists
}

// Seed initial data if empty
const settingsCount = db.prepare("SELECT COUNT(*) as count FROM settings").get() as { count: number };
if (settingsCount.count === 0) {
  const insertSetting = db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)");
  insertSetting.run("site_name", "제로원프로덕션");
  insertSetting.run("hero_title", "세상을 바꾸는 단 하나의 영상\n제로원프로덕션");
  insertSetting.run("hero_subtitle", "최고의 퀄리티로 당신의 브랜드 가치를 높여드립니다.");
  insertSetting.run("primary_color", "#0A5C36");
  insertSetting.run("bg_color", "#000000");
  insertSetting.run("contact_email", "contact@zeroone.pro");
  insertSetting.run("contact_phone", "010-7788-9757");
  insertSetting.run("contact_address", "서울특별시 마포구 월드컵북로 179, 208호");
  insertSetting.run("youtube_url", "https://youtube.com/@zeroone");
  insertSetting.run("instagram_url", "https://instagram.com/zeroone");
  insertSetting.run("categories", "브이로그,정보전달,토크,강의");

  const insertPortfolio = db.prepare("INSERT INTO portfolios (title, description, thumbnail, video_url, category) VALUES (?, ?, ?, ?, ?)");
  insertPortfolio.run("성형외과 전문의 인터뷰 영상", "의료진의 신뢰도를 높이는 전문 인터뷰 및 병원 소개 영상", "https://picsum.photos/seed/hospital-1/800/450", "https://youtube.com", "Hospital YouTube");
  insertPortfolio.run("IT 기업 브랜드 필름", "혁신적인 기업 이미지를 강조한 시네마틱 홍보 영상", "https://picsum.photos/seed/corporate/800/450", "https://youtube.com", "Promotion Video");
  insertPortfolio.run("공인중개사 자격증 핵심 강의", "전달력을 극대화한 깔끔한 자막과 모션 그래픽 강의 영상", "https://picsum.photos/seed/lecture/800/450", "https://youtube.com", "Lecture Video");
  insertPortfolio.run("치과 임플란트 시술 안내", "환자들의 이해를 돕는 친절한 시술 과정 안내 영상", "https://picsum.photos/seed/hospital-2/800/450", "https://youtube.com", "Hospital YouTube");
  insertPortfolio.run("글로벌 제조 기업 공장 스케치", "웅장한 스케일의 기업 시설 및 공정 홍보 영상", "https://picsum.photos/seed/factory/800/450", "https://youtube.com", "Promotion Video");
  insertPortfolio.run("마케팅 실무 마스터 클래스", "실제 사례 중심의 몰입감 넘치는 온라인 강의 콘텐츠", "https://picsum.photos/seed/marketing/800/450", "https://youtube.com", "Lecture Video");

  const insertPost = db.prepare("INSERT INTO posts (title, content, author) VALUES (?, ?, ?)");
  insertPost.run("2024년 영상 트렌드 분석", "올해 가장 주목받는 영상 편집 기법과 스타일을 소개합니다.", "관리자");
  insertPost.run("제로원프로덕션 신규 장비 도입 안내", "더 나은 퀄리티를 위해 최신 8K 카메라를 도입했습니다.", "관리자");
}

// Ensure the new contact_phone and address are set to the requested values
db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").run("contact_phone", "010-7788-9757");
db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").run("contact_address", "서울특별시 마포구 월드컵북로 179, 208호");
db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").run("hero_title", "세상을 바꾸는 단 하나의 영상\n제로원프로덕션");

// Ensure categories exist
const categoriesCheck = db.prepare("SELECT value FROM settings WHERE key = 'categories'").get() as { value: string } | undefined;
if (!categoriesCheck) {
  db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run("categories", "브이로그,정보전달,토크,강의");
}

// Ensure at least 6 portfolios exist for demonstration
const portfolioCount = db.prepare("SELECT COUNT(*) as count FROM portfolios").get() as { count: number };
if (portfolioCount.count < 6) {
  const insertPortfolio = db.prepare("INSERT INTO portfolios (title, description, thumbnail, video_url, category) VALUES (?, ?, ?, ?, ?)");
  const needed = 6 - portfolioCount.count;
  for (let i = 0; i < needed; i++) {
    insertPortfolio.run(
      `추가 포트폴리오 ${i + 1}`,
      "추가된 샘플 포트폴리오 설명입니다.",
      `https://picsum.photos/seed/extra-${i}/800/450`,
      "https://youtube.com",
      "Hospital YouTube"
    );
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/settings", (req, res) => {
    const settings = db.prepare("SELECT * FROM settings").all() as { key: string, value: string }[];
    const settingsObj = settings.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
    res.json(settingsObj);
  });

  app.post("/api/settings", (req, res) => {
    const updates = req.body;
    const updateStmt = db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
    const transaction = db.transaction((data) => {
      for (const [key, value] of Object.entries(data)) {
        updateStmt.run(key, value);
      }
    });
    transaction(updates);
    res.json({ success: true });
  });

  app.get("/api/portfolios", (req, res) => {
    const portfolios = db.prepare("SELECT * FROM portfolios ORDER BY created_at DESC").all();
    res.json(portfolios);
  });

  app.post("/api/portfolios", (req, res) => {
    const { title, description, thumbnail, video_url, category, is_featured } = req.body;
    const stmt = db.prepare("INSERT INTO portfolios (title, description, thumbnail, video_url, category, is_featured) VALUES (?, ?, ?, ?, ?, ?)");
    const info = stmt.run(
      title || "새로운 프로젝트", 
      description || "", 
      thumbnail || "https://picsum.photos/seed/new/800/450", 
      video_url || "", 
      category || "",
      is_featured || 0
    );
    res.json({ id: info.lastInsertRowid });
  });

  app.delete("/api/portfolios/:id", (req, res) => {
    db.prepare("DELETE FROM portfolios WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.put("/api/portfolios/:id", (req, res) => {
    const updates = req.body;
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(", ");
    const values = Object.values(updates);
    
    if (fields.length > 0) {
      db.prepare(`UPDATE portfolios SET ${fields} WHERE id = ?`)
        .run(...values, req.params.id);
    }
    res.json({ success: true });
  });

  app.get("/api/posts", (req, res) => {
    const posts = db.prepare("SELECT * FROM posts ORDER BY created_at DESC").all();
    res.json(posts);
  });

  app.post("/api/posts", (req, res) => {
    const { title, content, author } = req.body;
    const stmt = db.prepare("INSERT INTO posts (title, content, author) VALUES (?, ?, ?)");
    const info = stmt.run(title, content, author || "관리자");
    res.json({ id: info.lastInsertRowid });
  });

  app.delete("/api/posts/:id", (req, res) => {
    db.prepare("DELETE FROM posts WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Vite middleware for development
  const isProd = process.env.NODE_ENV === "production" || fs.existsSync(path.join(__dirname, "dist"));

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
