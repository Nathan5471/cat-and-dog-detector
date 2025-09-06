import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthenticatedRoute from "./utils/AuthenticatedRoute";
import { useAuth } from "./contexts/AuthContext";

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
          <Route path="/" element={<div>Home Page</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
