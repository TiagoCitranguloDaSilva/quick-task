import { BrowserRouter, Route, Routes } from "react-router";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes></Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
