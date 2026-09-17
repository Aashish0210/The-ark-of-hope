import { PrismaClient } from '@prisma/client';
import { createClient } from '@libsql/client';
import path from 'path';
import bcrypt from 'bcryptjs';

const hasDatabaseUrl = Boolean(process.env.POSTGRES_URL);

// SQLite Local Persistent Fallback
function createSqlitePrisma() {
  const dbPath = path.join(process.cwd(), 'dev.db');
  const client = createClient({ url: `file:${dbPath}` });

  let isInitialized = false;

  async function ensureTablesAndSeed() {
    if (isInitialized) return;
    try {
      await client.execute(`
        CREATE TABLE IF NOT EXISTS SiteSettings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          raised REAL DEFAULT 0,
          goal REAL DEFAULT 7000000,
          heroTitle TEXT DEFAULT 'Ark of Hope Project',
          heroSubtitle TEXT DEFAULT 'A story of faith in Nepal',
          heroText TEXT DEFAULT 'Every great journey begins with a single plank. Once gifted for the Ark, see the work, and please be ready—one donation at a time.',
          maintenanceMode INTEGER DEFAULT 0,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      try {
        await client.execute(`ALTER TABLE SiteSettings ADD COLUMN maintenanceMode INTEGER DEFAULT 0;`);
      } catch (_) {}

      await client.execute(`
        CREATE TABLE IF NOT EXISTS DonationTier (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          icon TEXT,
          name TEXT,
          price REAL,
          available INTEGER,
          description TEXT,
          features TEXT,
          image TEXT,
          isPopular INTEGER DEFAULT 0,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await client.execute(`
        CREATE TABLE IF NOT EXISTS Stat (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          value TEXT,
          label TEXT,
          "order" INTEGER DEFAULT 0,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await client.execute(`
        CREATE TABLE IF NOT EXISTS TrendPoint (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          type TEXT,
          label TEXT,
          value1 REAL,
          value2 REAL,
          "order" INTEGER DEFAULT 0,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await client.execute(`
        CREATE TABLE IF NOT EXISTS Donation (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          amount REAL,
          name TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await client.execute(`
        CREATE TABLE IF NOT EXISTS User (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE,
          password TEXT,
          image TEXT
        );
      `);

      // Seed admin user if not exists
      const userRes = await client.execute({
        sql: `SELECT * FROM User WHERE email = ?`,
        args: ['admin@ark.com']
      });

      if (userRes.rows.length === 0) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await client.execute({
          sql: `INSERT INTO User (email, password) VALUES (?, ?)`,
          args: ['admin@ark.com', hashedPassword]
        });
      }

      // Seed SiteSettings if not exists
      const settingsRes = await client.execute(`SELECT * FROM SiteSettings LIMIT 1`);
      if (settingsRes.rows.length === 0) {
        await client.execute({
          sql: `INSERT INTO SiteSettings (id, raised, goal, heroTitle, heroSubtitle, heroText, maintenanceMode, updatedAt)
                VALUES (1, 0, 7000000, 'Ark of Hope Project', 'A story of faith in Nepal', 'Every great journey begins with a single plank. Once gifted for the Ark, see the work, and please be ready—one donation at a time.', 0, CURRENT_TIMESTAMP)`
        });
      }

      // Seed Tiers if not exists
      const tiersRes = await client.execute(`SELECT * FROM DonationTier LIMIT 1`);
      if (tiersRes.rows.length === 0) {
        const tiers = [
          {
            icon: "🪨",
            name: "Foundation",
            price: 25,
            available: 1000,
            description: '"Every great structure begins where the earth meets stone."',
            image: "/images/tiers/foundation.png",
            features: JSON.stringify([
              "Digital certificate of contribution",
              "Monthly prayer & progress updates",
              "Name in the Builder's Registry"
            ]),
            isPopular: 0
          },
          {
            icon: "🪵",
            name: "Timber",
            price: 75,
            available: 500,
            description: '"Cut and shaped — your gift frames what will stand for generations."',
            image: "/images/tiers/timber.png",
            features: JSON.stringify([
              "Everything in Foundation",
              "Handwritten thank-you from the team",
              "Quarterly photo updates from the site"
            ]),
            isPopular: 0
          },
          {
            icon: "🛖",
            name: "Deck",
            price: 150,
            available: 250,
            description: '"Step aboard — your place is secured on the deck of something eternal."',
            image: "/images/tiers/deck.png",
            features: JSON.stringify([
              "Everything in Timber",
              "Name on the physical Wall of Honor",
              "Guided video tour of construction",
              "Priority invitations to launch events"
            ]),
            isPopular: 1
          },
          {
            icon: "🕊️",
            name: "Covenant",
            price: 500,
            available: 100,
            description: '"A covenant is more than a gift — it is a promise written into the walls."',
            image: "/images/tiers/covenant.png",
            features: JSON.stringify([
              "Everything in Deck",
              "VIP access to annual gathering",
              "Personal call with project leadership",
              "Named dedication plaque at the site",
              "Annual recognition dinner with founders"
            ]),
            isPopular: 0
          }
        ];

        for (const t of tiers) {
          await client.execute({
            sql: `INSERT INTO DonationTier (icon, name, price, available, description, features, image, isPopular, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            args: [t.icon, t.name, t.price, t.available, t.description, t.features, t.image, t.isPopular]
          });
        }
      }

      // Seed Stats if not exists
      const statsRes = await client.execute(`SELECT * FROM Stat LIMIT 1`);
      if (statsRes.rows.length === 0) {
        const stats = [
          { value: "Faith-Based & Historical Learning", label: "", order: 1 },
          { value: "Biblical Hospitality & Destination", label: "", order: 2 },
          { value: "Local Economic Growth", label: "", order: 3 },
          { value: "Sustainable Job Creation", label: "", order: 4 },
        ];
        for (const s of stats) {
          await client.execute({
            sql: `INSERT INTO Stat (value, label, "order", createdAt, updatedAt) VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            args: [s.value, s.label, s.order]
          });
        }
      }

      isInitialized = true;
    } catch (err) {
      console.error('SQLite ensureTables error:', err);
    }
  }

  function formatRow(row: any) {
    if (!row) return null;
    const obj: any = {};
    for (const [k, v] of Object.entries(row)) {
      if (k === 'maintenanceMode' || k === 'isPopular') {
        obj[k] = Boolean(v);
      } else {
        obj[k] = v;
      }
    }
    return obj;
  }

  return {
    user: {
      async findUnique({ where }: any) {
        await ensureTablesAndSeed();
        let res;
        if (where.id) {
          res = await client.execute({ sql: `SELECT * FROM User WHERE id = ?`, args: [where.id] });
        } else if (where.email) {
          res = await client.execute({ sql: `SELECT * FROM User WHERE email = ?`, args: [where.email] });
        }
        return res?.rows.length ? formatRow(res.rows[0]) : null;
      },
      async update({ where, data }: any) {
        await ensureTablesAndSeed();
        const sets: string[] = [];
        const args: any[] = [];
        for (const [k, v] of Object.entries(data)) {
          if (v !== undefined) {
            sets.push(`${k} = ?`);
            args.push(v);
          }
        }
        args.push(where.id);
        await client.execute({
          sql: `UPDATE User SET ${sets.join(', ')} WHERE id = ?`,
          args
        });
        const res = await client.execute({ sql: `SELECT * FROM User WHERE id = ?`, args: [where.id] });
        return formatRow(res.rows[0]);
      },
      async upsert({ where, update, create }: any) {
        await ensureTablesAndSeed();
        const existing = await this.findUnique({ where });
        if (existing) {
          return this.update({ where: { id: existing.id }, data: update });
        }
        const res = await client.execute({
          sql: `INSERT INTO User (email, password, image) VALUES (?, ?, ?)`,
          args: [create.email, create.password, create.image ?? null]
        });
        return { id: Number(res.lastInsertRowid), ...create };
      }
    },
    siteSettings: {
      async findFirst() {
        await ensureTablesAndSeed();
        const res = await client.execute(`SELECT * FROM SiteSettings ORDER BY id ASC LIMIT 1`);
        return res.rows.length ? formatRow(res.rows[0]) : null;
      },
      async findUnique({ where }: any) {
        await ensureTablesAndSeed();
        const res = await client.execute({ sql: `SELECT * FROM SiteSettings WHERE id = ?`, args: [where.id] });
        return res.rows.length ? formatRow(res.rows[0]) : null;
      },
      async update({ where, data }: any) {
        await ensureTablesAndSeed();
        const existing = await this.findUnique({ where }) || await this.findFirst();
        if (!existing) {
          return this.create({ data: { id: where?.id || 1, ...data } });
        }
        const sets: string[] = [];
        const args: any[] = [];
        for (const [k, v] of Object.entries(data)) {
          if (v !== undefined) {
            if (typeof v === 'object' && v !== null && 'increment' in v) {
              sets.push(`${k} = ${k} + ?`);
              args.push((v as any).increment);
            } else if (k === 'maintenanceMode') {
              sets.push(`${k} = ?`);
              args.push(v ? 1 : 0);
            } else {
              sets.push(`${k} = ?`);
              args.push(v);
            }
          }
        }
        sets.push(`updatedAt = CURRENT_TIMESTAMP`);
        args.push(existing.id);
        await client.execute({
          sql: `UPDATE SiteSettings SET ${sets.join(', ')} WHERE id = ?`,
          args
        });
        const res = await client.execute({ sql: `SELECT * FROM SiteSettings WHERE id = ?`, args: [existing.id] });
        return formatRow(res.rows[0]);
      },
      async upsert({ where, update, create }: any) {
        await ensureTablesAndSeed();
        const existing = await this.findUnique({ where });
        if (existing) {
          return this.update({ where, data: update });
        }
        return this.create({ data: create });
      },
      async create({ data }: any) {
        await ensureTablesAndSeed();
        const id = data.id || 1;
        await client.execute({
          sql: `INSERT OR REPLACE INTO SiteSettings (id, raised, goal, heroTitle, heroSubtitle, heroText, maintenanceMode, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
          args: [
            id,
            data.raised ?? 0,
            data.goal ?? 7000000,
            data.heroTitle ?? 'Ark of Hope Project',
            data.heroSubtitle ?? 'A story of faith in Nepal',
            data.heroText ?? '',
            data.maintenanceMode ? 1 : 0
          ]
        });
        const res = await client.execute({ sql: `SELECT * FROM SiteSettings WHERE id = ?`, args: [id] });
        return formatRow(res.rows[0]);
      },
      async deleteMany() {
        await ensureTablesAndSeed();
        await client.execute(`DELETE FROM SiteSettings`);
        return { count: 0 };
      }
    },
    donationTier: {
      async findMany({ orderBy }: any = {}) {
        await ensureTablesAndSeed();
        let sql = `SELECT * FROM DonationTier`;
        if (orderBy?.price === 'asc') sql += ` ORDER BY price ASC`;
        else if (orderBy?.price === 'desc') sql += ` ORDER BY price DESC`;
        const res = await client.execute(sql);
        return res.rows.map(formatRow);
      },
      async update({ where, data }: any) {
        await ensureTablesAndSeed();
        const sets: string[] = [];
        const args: any[] = [];
        for (const [k, v] of Object.entries(data)) {
          if (v !== undefined) {
            if (k === 'isPopular') {
              sets.push(`${k} = ?`);
              args.push(v ? 1 : 0);
            } else {
              sets.push(`${k} = ?`);
              args.push(v);
            }
          }
        }
        sets.push(`updatedAt = CURRENT_TIMESTAMP`);
        args.push(where.id);
        await client.execute({
          sql: `UPDATE DonationTier SET ${sets.join(', ')} WHERE id = ?`,
          args
        });
        const res = await client.execute({ sql: `SELECT * FROM DonationTier WHERE id = ?`, args: [where.id] });
        return formatRow(res.rows[0]);
      },
      async createMany({ data }: any) {
        await ensureTablesAndSeed();
        for (const t of data) {
          await client.execute({
            sql: `INSERT INTO DonationTier (icon, name, price, available, description, features, image, isPopular, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            args: [t.icon, t.name, t.price, t.available, t.description, t.features, t.image ?? null, t.isPopular ? 1 : 0]
          });
        }
        return { count: data.length };
      },
      async deleteMany() {
        await ensureTablesAndSeed();
        await client.execute(`DELETE FROM DonationTier`);
        return { count: 0 };
      }
    },
    stat: {
      async findMany({ orderBy }: any = {}) {
        await ensureTablesAndSeed();
        let sql = `SELECT * FROM Stat`;
        if (orderBy?.order === 'asc') sql += ` ORDER BY "order" ASC`;
        const res = await client.execute(sql);
        return res.rows.map(formatRow);
      },
      async count() {
        await ensureTablesAndSeed();
        const res = await client.execute(`SELECT COUNT(*) as count FROM Stat`);
        return Number(res.rows[0]?.count || 0);
      },
      async create({ data }: any) {
        await ensureTablesAndSeed();
        const res = await client.execute({
          sql: `INSERT INTO Stat (value, label, "order", createdAt, updatedAt) VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
          args: [data.value, data.label ?? '', data.order ?? 0]
        });
        const id = Number(res.lastInsertRowid);
        return { id, ...data };
      },
      async update({ where, data }: any) {
        await ensureTablesAndSeed();
        const sets: string[] = [];
        const args: any[] = [];
        for (const [k, v] of Object.entries(data)) {
          if (v !== undefined) {
            sets.push(`"${k}" = ?`);
            args.push(v);
          }
        }
        sets.push(`updatedAt = CURRENT_TIMESTAMP`);
        args.push(where.id);
        await client.execute({
          sql: `UPDATE Stat SET ${sets.join(', ')} WHERE id = ?`,
          args
        });
        const res = await client.execute({ sql: `SELECT * FROM Stat WHERE id = ?`, args: [where.id] });
        return formatRow(res.rows[0]);
      },
      async delete({ where }: any) {
        await ensureTablesAndSeed();
        await client.execute({ sql: `DELETE FROM Stat WHERE id = ?`, args: [where.id] });
        return { id: where.id };
      },
      async deleteMany() {
        await ensureTablesAndSeed();
        await client.execute(`DELETE FROM Stat`);
        return { count: 0 };
      }
    },
    trendPoint: {
      async findMany({ orderBy }: any = {}) {
        await ensureTablesAndSeed();
        let sql = `SELECT * FROM TrendPoint`;
        if (orderBy?.order === 'asc') sql += ` ORDER BY "order" ASC`;
        const res = await client.execute(sql);
        return res.rows.map(formatRow);
      },
      async create({ data }: any) {
        await ensureTablesAndSeed();
        const res = await client.execute({
          sql: `INSERT INTO TrendPoint (type, label, value1, value2, "order", createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
          args: [data.type, data.label, data.value1, data.value2 ?? null, data.order ?? 0]
        });
        return { id: Number(res.lastInsertRowid), ...data };
      },
      async createMany({ data }: any) {
        await ensureTablesAndSeed();
        for (const p of data) {
          await client.execute({
            sql: `INSERT INTO TrendPoint (type, label, value1, value2, "order", createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            args: [p.type, p.label, p.value1, p.value2 ?? null, p.order ?? 0]
          });
        }
        return { count: data.length };
      },
      async deleteMany() {
        await ensureTablesAndSeed();
        await client.execute(`DELETE FROM TrendPoint`);
        return { count: 0 };
      }
    },
    donation: {
      async findFirst({ orderBy }: any = {}) {
        await ensureTablesAndSeed();
        let sql = `SELECT * FROM Donation`;
        if (orderBy?.createdAt === 'desc') sql += ` ORDER BY createdAt DESC`;
        sql += ` LIMIT 1`;
        const res = await client.execute(sql);
        return res.rows.length ? formatRow(res.rows[0]) : null;
      },
      async findMany({ orderBy, take }: any = {}) {
        await ensureTablesAndSeed();
        let sql = `SELECT * FROM Donation`;
        if (orderBy?.createdAt === 'desc') sql += ` ORDER BY createdAt DESC`;
        if (take) sql += ` LIMIT ${take}`;
        const res = await client.execute(sql);
        return res.rows.map(formatRow);
      },
      async create({ data }: any) {
        await ensureTablesAndSeed();
        const res = await client.execute({
          sql: `INSERT INTO Donation (amount, name, createdAt) VALUES (?, ?, CURRENT_TIMESTAMP)`,
          args: [data.amount, data.name ?? 'A generous donor']
        });
        return { id: Number(res.lastInsertRowid), ...data, createdAt: new Date() };
      }
    }
  };
}

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient | any;
};

export const prisma: any = hasDatabaseUrl
  ? (globalForPrisma.prisma ?? new PrismaClient())
  : (globalForPrisma.prisma ?? createSqlitePrisma());

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
