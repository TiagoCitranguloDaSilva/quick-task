import { BrowserRouter, Route, Routes } from "react-router";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
