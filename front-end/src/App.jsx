import { BrowserRouter, Route, Routes } from "react-router";
import { AuthProvider, ProtectedRoute, PublicRoute } from "./contexts/AuthContext";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import Header from "./components/Header/Header";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />

        <main>
          <Routes>
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />} />
            </Route>
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
