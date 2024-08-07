import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap"; // Import Alert component from react-bootstrap
import styles from "../Singup/styles.module.css";

const Signup = () => {
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState(""); // State for success message
    const navigate = useNavigate();

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = "http://localhost:3200/api/register";
            const { data: res } = await axios.post(url, data);
            console.log(res.message);
            // Set success message
            setSuccessMessage("User account created successfully!");
            setTimeout(() => setSuccessMessage(''), 3000);
            // Reset form fields
            setData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
            });
            setError(""); // Clear any existing errors
            setTimeout(() => {
                navigate("/login");
            }, 2000); // Redirect after 2 seconds to allow the message to be seen
        } catch (error) {
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500
            ) {
                if (error.response.data.message === "User already exists") {
                    setError("User already exists. Please use a different email.");
                    setTimeout(() => setError(''), 3000);
                } else {
                    setError(error.response.data.message);
                }
            }
        }
    };

    return (
        <div className={styles.signup_container}>
            <div className={styles.signup_form_container}>
                {successMessage && (
                    <Alert variant="success" className={styles.success_message}>
                        {successMessage}
                    </Alert>
                )}
                {error && (
                    <Alert variant="danger" className={styles.error_message}>
                        {error}
                    </Alert>
                )}
                <div className={styles.left}>
                    <h1>Welcome Back</h1>
                    <Link to="/login">
                        <button type="button" className={styles.white_btn}>
                            Sign in
                        </button>
                    </Link>
                </div>
                <div className={styles.right}>
                    <form className={styles.form_container} onSubmit={handleSubmit}>
                        <h1>Create Account</h1>
                        <input
                            type="text"
                            placeholder="First Name"
                            name="firstName"
                            onChange={handleChange}
                            value={data.firstName}
                            required
                            className={styles.input}
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            name="lastName"
                            onChange={handleChange}
                            value={data.lastName}
                            required
                            className={styles.input}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            onChange={handleChange}
                            value={data.email}
                            required
                            className={styles.input}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={handleChange}
                            value={data.password}
                            required
                            className={styles.input}
                        />
                        <button type="submit" className={styles.green_btn}>
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;