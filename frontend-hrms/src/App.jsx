import { AppRouter } from "./routes/AppRouter";
import { useEffect } from "react";
import { AttendanceProvider } from "./contexts/AttendanceProvider";
import { initializeMockDatabase } from "./common/utils/mockAuth";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "sonner"

function App() {

  useEffect(() => {
    initializeMockDatabase();
  }, []);

  return (
    <AuthProvider>
      <AttendanceProvider>
        <AppRouter />
        <Toaster />
      </AttendanceProvider>
    </AuthProvider>
    
  );
}

export default App;
