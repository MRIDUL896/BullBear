import React, { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaQuestionCircle, FaHeadset, FaChevronDown, FaChevronUp } from "react-icons/fa";

const Support = () => {
  const [selectedOption, setSelectedOption] = useState("faq");
  const [expandedFaqs, setExpandedFaqs] = useState([]);

  const faqItems = [
    {
      question: "How do I reset my password?",
      answer: "You can reset your password by clicking on the 'Forgot Password' link on the login page."
    },
    {
      question: "How do I contact support?",
      answer: "You can contact support via the 'Contact Us' section or by using the live chat option."
    },
    {
      question: "Where can I see my staocks of interest?",
      answer: "Your interested stacks are available in the 'My Profile' section."
    },
  ];

  const toggleFaq = (index) => {
    if (expandedFaqs.includes(index)) {
      setExpandedFaqs(expandedFaqs.filter((i) => i !== index));
    } else {
      setExpandedFaqs([...expandedFaqs, index]);
    }
  };

  const renderSupportContent = () => {
    switch (selectedOption) {
      case "faq":
        return (
          <div className="">
            <h2 className="text-2xl font-bold mb-4 text-blue-300">Frequently Asked Questions</h2>
            <ul className="space-y-3">
              {faqItems.map((faq, index) => (
                <li key={index} className="bg-gray-950 hover:bg-slate-600 rounded-lg p-4">
                  <div 
                    onClick={() => toggleFaq(index)} 
                    className="flex justify-between items-center cursor-pointer"
                  >
                    <h3 className="text-lg text-blue-200">{faq.question}</h3>
                    {expandedFaqs.includes(index) ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                  {expandedFaqs.includes(index) && (
                    <p className="mt-3 text-gray-300">{faq.answer}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      case "contact":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-blue-300">Contact Support</h2>
            <p className="mb-2"><FaEnvelope className="inline-block mr-2 text-yellow-400" /> Email: support@bullbear.com</p>
            <p className="mb-2"><FaPhoneAlt className="inline-block mr-2 text-green-400" /> Phone: +91 xxxxxxxxxx</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 mb-5 w-[95%] mx-auto bg-gray-800 text-gray-100 font-sans rounded-lg">
      <h2 className="text-3xl font-bold mb-4 text-center text-blue-300">Support</h2>
      <div className="flex justify-around mb-5">
        <button
          className={`px-4 py-2 hover:bg-green-500 rounded ${selectedOption === "faq" ? "bg-blue-500 text-white" : "bg-gray-600 text-gray-300"}`}
          onClick={() => setSelectedOption("faq")}
        >
          <FaQuestionCircle className="inline-block mr-2" /> FAQ
        </button>
        <button
          className={`px-4 py-2 hover:bg-green-500 rounded ${selectedOption === "contact" ? "bg-blue-500 text-white" : "bg-gray-600 text-gray-300"}`}
          onClick={() => setSelectedOption("contact")}
        >
          <FaEnvelope className="inline-block mr-2" /> Contact
        </button>
      </div>
      <div className="support-content">
        {renderSupportContent()}
      </div>
    </div>
  );
};

export default Support;