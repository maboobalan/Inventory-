import React from 'react';
import "../Styles/ContactUs.css";

const Contact = () => {
  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <p>
        We'd love to hear from you! Whether you have questions about our products, need support, or just want to provide feedback, feel free to reach out to us. Our dedicated team is here to assist you.
      </p>
      <form className="contact-form">
        <label htmlFor="name"><strong>Name:</strong></label>
        <input type="text" id="name" name="name" required />

        <label htmlFor="email"><strong>Email:</strong></label>
        <input type="email" id="email" name="email" required />

        <label htmlFor="message"><strong>Message:</strong></label>
        <textarea id="message" name="message" rows="4" required></textarea>

        <button type="submit" className="btn btn-outline-primary"><strong>Send Message:</strong></button>
      </form>
    </div>
  );
};

export default Contact;