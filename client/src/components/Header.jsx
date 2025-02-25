import React, { useState, useEffect } from "react";
import icon from "../assets/bb.jpg";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import api from "./axiosConfig";
import { logout } from "../redux/authSlice";
import { useDispatch } from "react-redux";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const items = ["Home", "My Profile", "Market News", "Support"];
  const navigate = useNavigate();
  const dispatch = useDispatch(); 

  const [scrollPosition, setScrollPosition] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleScroll = () => {
    const currentScrollPosition = window.pageYOffset;

    if (currentScrollPosition > scrollPosition) {
      setIsVisible(false); // Scrolling down
    } else {
      setIsVisible(true); // Scrolling up
    }

    setScrollPosition(currentScrollPosition);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }

  const handleClick = (item) => {
    if(item === selectedItem){
      setSelectedItem("");
    }else{
      setSelectedItem(item);
      navigate(`/${item}`);
    } 
  }

  const handleLogout = async () => {
    await api.post('/api/user/logout').then(() => {
      dispatch(logout());
    }).catch((err) => {
      console.log(err)
      alert('an erroe occured')
    })
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollPosition]);

  return (
    <div className="bg-gray-950">
      <header className={`bg-gray-950 text-white shadow-lg fixed w-full transition-transform ${isVisible ? "translate-y-0" : "-translate-y-full"} `}>
      <div className="flex items-center gap-3 justify-between mx-3 mr-20">
        {/* Branding */}
        <div className="flex items-center space-x-2 p-2">
          <img src={icon} alt="Logo" className="h-[40px] md:h-[70px]" />
          <h1 className="text-4xl font-bold">BullBear</h1>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-2">
          {items.map((item) => (
            <button
              key={item}
              onClick={() => handleClick(item)}
              className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-transform duration-300 hover:scale-105 ${
                selectedItem === item
                  ? "bg-indigo-700 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Search */}
        <form action="search" className="hidden md:flex bg-white p-1 items-center rounded-md text-black border-2 hover:border-purple-500">
          <input type="text" placeholder="Search Company." className="rounded-md p-1"/>
          <div className="p-2 cursor-pointer text-lg hover:bg-red-70 ">
          <CiSearch/>
          </div>
        </form>

        <button className="bg-red-700 hidden md:flex rounded-lg hover:bg-red-500 p-2"
        onClick={() => handleLogout()}>
          Logout
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-white focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-8 w-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <nav className="flex flex-col items-center space-y-4 py-4">
            {items.map((item) => (
              <button
                key={item}
                onClick={() => handleClick(item)}
                className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-transform duration-300 hover:scale-105 ${
                selectedItem === item
                  ? "bg-indigo-700 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
              >
                {item}
              </button>
            ))}
            <button className="bg-red-700 p-2 rounded-lg hover:bg-red-500" onClick={() => handleLogout()}>
              Logout</button>
          </nav>
          <form action="search" className="flex justify-center bg-white p-1 items-center rounded-md text-black border-2 border-orange-500">
          <input type="text" placeholder="Search Company." className="rounded-md p-1"/>
          <div className="p-2 cursor-pointer text-xl hover:bg-red-70 ">
          <CiSearch/>
          </div>
        </form>
        </div>
      )}
    </header>
    </div>
  );
};

export default Header;
