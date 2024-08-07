import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Main from "./components/Main";
import Signup from "./components/Singup";
import Login from "./components/Login";
import ProList from "./components/ProList";
import AddProduct from "./components/AddProduct";
import About from "./components/About";
import ContactUs  from "./components/ContactUs"

const App = () => {
    const user = localStorage.getItem("token");

    return (
        <Router>
            <AppContent user={user} />
        </Router>
    );
};

const AppContent = ({ user }) => {
    return (
        <Routes>
            {user && <Route path="/" exact element={<Main />} />}
            <Route path="/register" exact element={<Signup />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/" element={<Navigate replace to="/login" />} />
            <Route path="/ProList" element={<ProList />} />
            <Route path="/about" element={<About />} />
            {<Route path="/add-product" exact element={<AddProduct />} /> }
            {<Route path="/contact-us" exact element={<ContactUs />} /> }
        </Routes>
    );
};

export default App;
