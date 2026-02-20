// src/config/db.js
// MySQL connection pool — production grade
// Pool use karo — connection baar baar open/close nahi hoga
// Multi-user ke liye pool best hai



import mysql2 from "mysql2/promise"
import env from "./env.js";

export const pool = mysql2.createPool({
  host              : env.db.host,
  port              : env.db.port,
  database          : env.db.name,
  user              : env.db.user,
  password          : env.db.password || "",
  waitForConnections: true,
  connectionLimit   : env.db.poolMax,   // max 50 concurrent connections
  queueLimit        : 0,               // unlimited queue
  enableKeepAlive   : true,
  keepAliveInitialDelay: 0,
  timezone          : 'Z',             // UTC
  decimalNumbers    : true,
  charset           : 'utf8mb4',       // emoji + special chars support
});

// Startup pe connection test karo
const testConnection = async () => {
  try {
    const conn = await pool.getConnection();
    console.log('MySQL connected successfully');
    conn.release();
  } catch (err) {
    console.error('MySQL connection failed:', err.message);
    process.exit(1); // DB connect nahi hua toh app band karo
  }
};



export default testConnection;
