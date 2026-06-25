import { BrowserRouter, Route, Routes } from "react-router";
import { useContext } from "react";
import { AuthContext, AuthProvider, ProtectedRoute, PublicRoute } from "./contexts/AuthContext";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import Header from "./components/Header/Header";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import ShowList from "./pages/ShowList/ShowList";

function AppRoutes() {
  const { ready } = useContext(AuthContext);

  // While auth context didn't load
  if (!ready) return null;

  return (
    <>
      <Header />

      <main>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/list/:id" element={<ShowList />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
