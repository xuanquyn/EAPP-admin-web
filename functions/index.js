require('dotenv').config(); // Cho local dev
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { Pool } = require("pg");

// Dùng biến môi trường trực tiếp
const connectionString = process.env.NEON_CONNECTION_STRING;

if (!connectionString) {
  console.error("⚠️ NEON_CONNECTION_STRING chưa được set!");
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }, // Bắt buộc với Neon
});

// Export Cloud Function
exports.getDataFromNeon = onCall(async (request) => {
  console.log("✅ Function getDataFromNeon được gọi");
  
  let client;
  try {
    // Kết nối database
    client = await pool.connect();
    console.log("✅ Kết nối Neon thành công");
    
    // Query dữ liệu
    const result = await client.query('SELECT * FROM user LIMIT 5');
    console.log(`✅ Query thành công: ${result.rows.length} rows`);
    
    // Trả về kết quả
    return { 
      success: true, 
      data: result.rows 
    };
    
  } catch (error) {
    console.error("❌ Lỗi Database:", error.message);
    
    // Throw error cho client
    throw new HttpsError(
      'internal', 
      'Không thể kết nối Database', 
      error.message
    );
    
  } finally {
    // Luôn giải phóng connection
    if (client) {
      client.release();
      console.log("✅ Đã release connection");
    }
  }
});