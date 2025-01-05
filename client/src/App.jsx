import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Company from "./components/company"
import Footer from "./components/Footer"
import Home from "./components/Home"
import Header from "./components/Header";
import Support from "./components/Support"
import News from "./components/News";

function App() {
  return (
    <div className="bg-gray-950 px-4 pb-4 h-full">
      <Router>
        <Header />
        <div className="p-20 bg-gray-950"></div>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/company/:ticker" element={<Company />} />
          <Route path="/support" element={<Support/>} />
          <Route path="/market news" element={<News/>} />
        </Routes>
        <Footer />
      </Router>
    </div>
  )
}

export default App