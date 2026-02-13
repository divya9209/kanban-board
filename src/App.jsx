import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Board from "./pages/Board";

function App() {
  const isLoggedIn = !!localStorage.getItem("user");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/board" replace /> : <Login />
          }
        />
        <Route
          path="/board"
          element={
            isLoggedIn ? <Board /> : <Navigate to="/" replace />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
