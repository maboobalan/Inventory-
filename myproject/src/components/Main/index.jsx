import React from "react";
import { Link } from "react-router-dom";
import { FaProductHunt, FaPlusCircle, FaInfoCircle, FaPhone, FaGlobeAfrica, FaGalacticRepublic, FaGlobeAsia, FaGlobeEurope, FaGlobe, FaEnvelope } from "react-icons/fa";

const Main = () => {
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    return (
        <header>
            <div className="main-container">
                <nav className="navbar">
                    <h1>Product Sales</h1>
                    <div className="container">
                        <ul className="nav-list">
                            <li className="nav-item">
                                <Link to="/ProList">
                                    <FaProductHunt /> Product
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/Add-Product">
                                    <FaPlusCircle /> Add Product
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/About">
                                    <FaGlobe/> About
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/Contact-Us">
                                    <FaEnvelope /> Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <button className="white_btn" onClick={handleLogout}>
                        Logout
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Main;