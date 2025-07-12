import { useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Header from "./components/Header";
import Support from "./components/Support";
import News from "./components/News";
import Login from "./components/Login";
import Company from './components/Company';
import MyProfile from './components/MyProfile';
import SearchResults from './components/SearchResults';

function App() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  return (
    <div className="bg-gray-950 px-4 pb-4 h-full">
      <BrowserRouter basename="/">
        <Header />
        {!isLoggedIn && <Login />}
        <div className="p-20 bg-gray-950"></div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/company/:ticker" element={<Company />} />
          <Route path="/support" element={<Support />} />
          <Route path="/market news" element={<News />} />
          <Route path="/my profile" element={<MyProfile />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
