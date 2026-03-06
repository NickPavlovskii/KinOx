import pkg from 'pg'
const { Pool } = pkg

export const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'your_password',
    database: 'your_database',
})
