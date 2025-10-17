import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserRoutes from "./routes/userRoutes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/user/*" element={<UserRoutes />} />

        <Route path="/*" element={<UserRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
