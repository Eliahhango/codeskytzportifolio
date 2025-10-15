import { Pool } from 'pg'

// Database connection configuration
const dbConfig = {
  connectionString: process.env.DATABASE_URL || 'postgresql://disihub:D0Ms2nsdRt0hJ7svfocoQ2BwP1kX8qUt@dpg-d3l1hpt6ubrc738vjn8g-a.oregon-postgres.render.com/disihub',
  ssl: { rejectUnauthorized: false },
}

// Create connection pool
const pool = new Pool(dbConfig)

// Test database connection
export async function testConnection() {
  try {
    const client = await pool.connect()
    await client.query('SELECT 1')
    client.release()
    console.log('✅ PostgreSQL connected successfully')
    return true
  } catch (error) {
    console.error('❌ Database connection error:', error)
    return false
  }
}

// Query helper function
export async function query(text, params) {
  const start = Date.now()
  try {
    const result = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('Executed query', { text, duration, rows: result.rowCount })
    return result
  } catch (error) {
    const duration = Date.now() - start
    console.error('Query error', { text, duration, error: error.message })
    throw error
  }
}

// Transaction helper
export async function transaction(callback) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export default pool