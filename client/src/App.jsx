// src/App.js
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Company from "./components/company";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Header from "./components/Header";
import Support from "./components/Support";
import News from "./components/News";
import Login from "./components/Login";

function App() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  return (
    <div className="bg-gray-950 px-4 pb-4 h-full">
      <Router>
        <Header />
        {!isLoggedIn && <Login />}  {/* Show login only if not logged in */}
        <div className="p-20 bg-gray-950"></div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/company/:ticker" element={<Company />} />
          <Route path="/support" element={<Support />} />
          <Route path="/market news" element={<News />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
