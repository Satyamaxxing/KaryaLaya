const bcrypt = require("bcryptjs");

module.exports.attachRoutes = function (app, pool) {
  
  // 🔥 HEALTH CHECK
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // 🔥 PROJECTS
  app.get("/api/projects", async (_req, res) => {
    try {
      const r = await pool.query("SELECT * FROM projects ORDER BY id");
      res.json(r.rows.map(normalizeProject));
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "DB error" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const r = await pool.query(
        "SELECT * FROM projects WHERE id=$1",
        [req.params.id]
      );
      if (r.rowCount === 0) {
        return res.status(404).json({ error: "Not found" });
      }
      res.json(normalizeProject(r.rows[0]));
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "DB error" });
    }
  });

  // 🔥 TASKS
  app.get("/api/tasks", async (_req, res) => {
    try {
      const r = await pool.query("SELECT * FROM tasks ORDER BY id");
      res.json(r.rows);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "DB error" });
    }
  });

  // 🔥 MESSAGES
  app.get("/api/messages", async (_req, res) => {
    try {
      const r = await pool.query(
        "SELECT * FROM messages ORDER BY created_at DESC"
      );
      res.json(r.rows);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "DB error" });
    }
  });

  // 🔥 NOTIFICATIONS
  app.get("/api/notifications", async (_req, res) => {
    try {
      const r = await pool.query(
        "SELECT * FROM notifications ORDER BY created_at DESC"
      );
      res.json(r.rows);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "DB error" });
    }
  });

  // 🔥 USERS
  app.get("/api/users", async (_req, res) => {
    try {
      const r = await pool.query(
        "SELECT id, name, email, role FROM users ORDER BY id"
      );
      res.json(r.rows);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "DB error" });
    }
  });

  // ================= AUTH =================

  // 🔐 SIGNUP
  app.post("/api/auth/signup", async (req, res) => {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    try {
      const hashed = await bcrypt.hash(password, 10);

      const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

      const result = await pool.query(
        `INSERT INTO users (name, initials, role, avatar, email, password)
         VALUES ($1,$2,$3,$4,$5,$6)
         ON CONFLICT (email) DO NOTHING
         RETURNING id, name, email`,
        [name, initials, "User", null, email, hashed]
      );

      if (result.rowCount === 0) {
        const existing = await pool.query(
          "SELECT id, name, email FROM users WHERE email=$1",
          [email]
        );
        return res.json(existing.rows[0]);
      }

      res.json(result.rows[0]);
    } catch (e) {
      console.error("❌ Signup error:", e);
      res.status(500).json({ error: "Signup failed" });
    }
  });

  // 🔐 SIGNIN
  app.post("/api/auth/signin", async (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password required" });
    }

    try {
      const r = await pool.query(
        "SELECT * FROM users WHERE email=$1",
        [email]
      );

      if (r.rowCount === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const user = r.rows[0];

      const ok = await bcrypt.compare(password, user.password || "");
      if (!ok) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url || null,
      });
    } catch (e) {
      console.error("❌ Signin error:", e);
      res.status(500).json({ error: "Signin failed" });
    }
  });

  // 🔐 UPDATE AVATAR
  app.post("/api/auth/update-avatar", async (req, res) => {
    const { email, avatar_url } = req.body || {};

    if (!email || !avatar_url) {
      return res
        .status(400)
        .json({ error: "Email and avatar_url required" });
    }

    try {
      await pool.query(
        "UPDATE users SET avatar_url=$1 WHERE email=$2",
        [avatar_url, email]
      );

      res.json({ success: true, avatar_url });
    } catch (e) {
      console.error("❌ Avatar update error:", e);
      res.status(500).json({ error: "Avatar update failed" });
    }
  });

  // ================= HELPERS =================

  function normalizeProject(row) {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      progress: row.progress,
      members: row.members,
      tasks_summary: row.tasks_summary,
      due_date: row.due_date || null,
      status: row.status,
      priority: row.priority,
      created_at: row.created_at || null,
    };
  }
};