import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthenticatedRoute from "./utils/AuthenticatedRoute";
import { useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Home from "./pages/Home.tsx";
import UploadImage from "./pages/UploadImage.tsx";
import Image from "./pages/Image.tsx";

function App() {
  const { user, getUser } = useAuth();

  useEffect(() => {
    if (user === undefined) {
      getUser();
    }
  }, [getUser, user]);

  return (
    <Router>
      <Routes>
        <Route element={<AuthenticatedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<UploadImage />} />
          <Route path="/image/:imageId" element={<Image />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
