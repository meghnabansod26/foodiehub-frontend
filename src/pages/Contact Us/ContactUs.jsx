
import React, { useState } from 'react';
import './ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSubmitted(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setSubmitted(true);

    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      message: '',
    });
  };

  return (
    <main className="contact-page">
      <div className="contact-container">
        <div className="contact-breadcrumb">
          <span>Home</span>
          <i className="bi bi-chevron-right" />
          <span>Contact Us</span>
        </div>

        <section className="contact-layout">
          <aside className="contact-info">
            <span className="contact-eyebrow">
              WE'RE HERE FOR YOU
            </span>

            <h1>
              Let's talk about <span>food.</span>
            </h1>

            <p className="contact-info-description">
              Have a question about your order, need some help,
              or want to share your feedback? We'd love to hear from you.
            </p>

            <div className="contact-info-list">
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <i className="bi bi-chat-dots" />
                </div>

                <div>
                  <h3>Customer Support</h3>
                  <p>We're happy to help with your questions.</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <i className="bi bi-clock" />
                </div>

                <div>
                  <h3>Quick Assistance</h3>
                  <p>Send us a message and tell us how we can help.</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <i className="bi bi-heart" />
                </div>

                <div>
                  <h3>Your Feedback Matters</h3>
                  <p>Help us make your food experience even better.</p>
                </div>
              </div>
            </div>

            <div className="contact-decoration">
              <i className="bi bi-emoji-smile" />
              <span>Good food. Great mood.</span>
            </div>
          </aside>

          <div className="contact-form-panel">
            <div className="contact-form-heading">
              <span>GET IN TOUCH</span>
              <h2>Send us a message</h2>
              <p>Fill in the details below and let us know what's on your mind.</p>
            </div>

            {submitted && (
              <div className="contact-success" role="status">
                <i className="bi bi-check-circle-fill" />
                Thank you! Your message has been submitted.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="contact-field-row">
                <div className="contact-field">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="contact-field">
                <label htmlFor="email">Email Address</label>

                <div className="contact-input-wrapper">
                  <i className="bi bi-envelope" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="contact-field">
                <label htmlFor="message">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  placeholder="Tell us how we can help..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button className="contact-submit-button" type="submit">
                <span>Send Message</span>
                <i className="bi bi-arrow-right" />
              </button>

              <p className="contact-privacy-note">
                <i className="bi bi-shield-check" />
                Your information is used only to respond to your message.
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ContactUs;
