import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";

const callFunction = async (functionName, data = {}) => {
  try {
    // ⚠️ FIX: Dùng dấu ngoặc đơn (), KHÔNG dùng backticks ``
    console.log(`📡 Đang gọi function: ${functionName}`);
    
    const func = httpsCallable(functions, functionName);
    const result = await func(data);
    
    console.log(`✅ Kết quả từ ${functionName}:`, result.data);
    return result.data;
    
  } catch (error) {
    // ⚠️ FIX: Dùng dấu ngoặc đơn ()
    console.error(`❌ Lỗi khi gọi function ${functionName}:`, error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    
    if (error.details) {
      console.error("Error details:", error.details);
    }
    
    throw error;
  }
};

export const getAllUsers = async () => {
  return await callFunction('getDataFromNeon');
};

export const addUser = async (userData) => {
  return await callFunction('addUserToNeon', userData);
};