import { query } from './db.js'
import fs from 'fs'
import path from 'path'

export async function initializeDatabase() {
  try {
    console.log('🚀 Initializing database...')

    // Execute table creation statements first
    await query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL DEFAULT 'Untitled',
        summary TEXT DEFAULT '',
        category VARCHAR(100) DEFAULT 'web',
        tags TEXT[] DEFAULT '{}',
        live_url TEXT DEFAULT '',
        github_url TEXT DEFAULT '',
        front_image TEXT DEFAULT '',
        gallery TEXT[] DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT NOT NULL,
        date DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS founders (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        position VARCHAR(255) NOT NULL,
        story TEXT DEFAULT '',
        image TEXT DEFAULT '',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS ads (
        id SERIAL PRIMARY KEY,
        url TEXT NOT NULL,
        alt TEXT DEFAULT '',
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await query(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255) DEFAULT '',
        message TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'new'
      )
    `)

    // Create indexes
    await query(`CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC)`)
    await query(`CREATE INDEX IF NOT EXISTS idx_comments_date ON comments(date DESC)`)
    await query(`CREATE INDEX IF NOT EXISTS idx_founders_name ON founders(name)`)
    await query(`CREATE INDEX IF NOT EXISTS idx_ads_active ON ads(active)`)
    await query(`CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_submissions(status)`)

    // Create trigger function and triggers
    await query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql'
    `)

    await query(`CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`)
    await query(`CREATE TRIGGER update_founders_updated_at BEFORE UPDATE ON founders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`)

    console.log('✅ Database schema created successfully')
    return true
  } catch (error) {
    console.error('❌ Failed to initialize database:', error)
    return false
  }
}

export async function seedDatabase() {
  try {
    console.log('🌱 Seeding database with initial data...')

    // Seed founders data
    const foundersData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'data', 'founders.json'), 'utf8')
    )

    for (const founder of foundersData) {
      // Use a simple sequential ID instead of the large number
      const id = founder.id === 'f1758841995779' ? 1 : 2

      await query(
        `INSERT INTO founders (id, name, position, story, image, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO NOTHING`,
        [
          id,
          founder.name,
          founder.position,
          founder.story,
          founder.image,
          new Date()
        ]
      )
    }

    // Seed comments data
    const commentsData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'data', 'comments.json'), 'utf8')
    )

    for (const comment of commentsData) {
      await query(
        `INSERT INTO comments (id, name, rating, comment, date, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO NOTHING`,
        [
          1, // Simple ID for comments
          comment.name,
          comment.rating,
          comment.comment,
          comment.date,
          new Date()
        ]
      )
    }

    // Seed ads data
    const adsData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'data', 'ads.json'), 'utf8')
    )

    for (const ad of adsData) {
      await query(
        `INSERT INTO ads (url, alt, active, created_at)
         VALUES ($1, $2, $3, $4)`,
        [ad.url, ad.alt || '', true, new Date()]
      )
    }

    console.log('✅ Database seeded successfully')
    return true
  } catch (error) {
    console.error('❌ Failed to seed database:', error)
    return false
  }
}

// Run initialization if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase()
    .then(() => seedDatabase())
    .then(() => {
      console.log('🎉 Database initialization complete!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Database initialization failed:', error)
      process.exit(1)
    })
}