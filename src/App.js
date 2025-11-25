import './assets/css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import RTLLayout from './layouts/rtl';
import {
  ChakraProvider,
  useToast, 
} from '@chakra-ui/react';
import initialTheme from './theme/theme'; 
import { useState, useEffect } from 'react';

import { getAllUsers } from './services/db'; 

export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  
  const toast = useToast(); 

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log("⏳ Đang thử kết nối tới Neon Postgres...");
        const response = await getAllUsers();
        console.log("✅ KẾT QUẢ TỪ NEON:", response);
        toast({
          title: "Kết nối Database thành công!",
          description: `Đã lấy được ${response.data ? response.data.length : 0} dòng dữ liệu. Xem Console (F12).`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right"
        });

      } catch (error) {
        console.error("❌ Lỗi kết nối:", error);
        
        toast({
          title: "Lỗi kết nối Neon Database",
          description: error.message,
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top-right"
        });
      }
    };
    testConnection();
  }, [toast]);

  return (
    <ChakraProvider theme={currentTheme}>
      <Routes>
        <Route path="auth/*" element={<AuthLayout />} />
        <Route
          path="admin/*"
          element={
            <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
          }
        />
        <Route
          path="rtl/*"
          element={
            <RTLLayout theme={currentTheme} setTheme={setCurrentTheme} />
          }
        />
        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
    </ChakraProvider>
  );
}