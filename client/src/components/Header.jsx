import React, { useState, useEffect } from "react";
import icon from "../assets/bb.jpg";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import api from "./axiosConfig";
import { logout } from "../redux/authSlice";
import { useDispatch } from "react-redux";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Home");
  const [searchQuery, setSearchQuery] = useState("");
  const items = ["Home", "My Profile", "Market News", "Support"];
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [scrollPosition, setScrollPosition] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleScroll = () => {
    const currentScrollPosition = window.pageYOffset;
    setIsVisible(currentScrollPosition < scrollPosition);
    setScrollPosition(currentScrollPosition);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleClick = (item) => {
    if (item === selectedItem) {
      setSelectedItem("");
    } else {
      setSelectedItem(item);
      navigate(`/${item}`);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/api/user/logout");
      dispatch(logout());
    } catch (err) {
      console.log(err);
      alert("An error occurred during logout");
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(""); // Clear search after navigating
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      handleSearch();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollPosition]);

  return (
    <div className="bg-gray-950">
      <header
        className={`bg-gray-950 text-white shadow-lg fixed w-full transition-transform z-50 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
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

          {/* Search (Desktop) */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="hidden md:flex bg-white p-1 items-center rounded-md text-black border-2 hover:border-purple-500"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search Company."
              className="rounded-md p-1 outline-none"
            />
            <div
              className="p-2 cursor-pointer text-lg text-black"
              onClick={handleSearch}
            >
              <CiSearch />
            </div>
          </form>

          {/* Logout */}
          <button
            className="bg-red-700 hidden md:flex rounded-lg hover:bg-red-500 p-2"
            onClick={handleLogout}
          >
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
              <button
                className="bg-red-700 p-2 rounded-lg hover:bg-red-500"
                onClick={handleLogout}
              >
                Logout
              </button>
            </nav>

            {/* Mobile Search */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="flex justify-center bg-white p-1 items-center rounded-md text-black border-2 border-orange-500 mx-2"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search Company."
                className="rounded-md p-1 outline-none flex-grow"
              />
              <div
                className="p-2 cursor-pointer text-xl"
                onClick={handleSearch}
              >
                <CiSearch />
              </div>
            </form>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;
