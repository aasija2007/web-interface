import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { LinkedinIcon, GithubIcon } from './SocialIcons';
import { personalInfo } from '../data/portfolioData';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${personalInfo.contact.email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          _subject: formData.subject || `Portfolio Message from ${formData.name}`,
          message: formData.message,
          _template: 'table'
        })
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSubmitSuccess(false), 6000);
      } else {
        setErrors({ form: `Failed to submit form. Please try emailing directly to ${personalInfo.contact.email}.` });
      }
    } catch (err) {
      setErrors({ form: `Network error. Please try emailing directly to ${personalInfo.contact.email}.` });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="reveal-on-scroll">
      <div className="section-container">
        <div className="section-header">
          <p className="section-subtitle">Get In Touch</p>
          <h2 className="section-title">Contact Me</h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.3fr',
            gap: '40px',
            alignItems: 'start'
          }}
          className="contact-grid"
        >
          {/* Left Column: Direct Contact Info Cards */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
          >
            <div className="glass-card" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Let's connect</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '28px', fontSize: '0.95rem' }}>
                Feel free to reach out for potential software opportunities, project collaborations, technical discussions, or just a friendly hello!
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Mail size={20} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block' }}>Email</span>
                    <a
                      href={`mailto:${personalInfo.contact.email}`}
                      style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)' }}
                    >
                      {personalInfo.contact.email}
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'var(--primary-light)',
                      color: 'var(--accent-pink)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Phone size={20} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block' }}>Phone</span>
                    <a
                      href={`tel:${personalInfo.contact.phone}`}
                      style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)' }}
                    >
                      {personalInfo.contact.phone}
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'var(--primary-light)',
                      color: 'var(--accent-blue)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <MapPin size={20} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block' }}>Location</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)' }}>
                      {personalInfo.contact.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Social Links Row */}
              <div
                style={{
                  borderTop: '1px solid var(--border-color)',
                  marginTop: '28px',
                  paddingTop: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-light)' }}>
                  CONNECT:
                </span>
                <a
                  href={personalInfo.contact.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'var(--bg-color)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)'
                  }}
                >
                  <LinkedinIcon size={18} />
                </a>

                <a
                  href={personalInfo.contact.github}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'var(--bg-color)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-main)'
                  }}
                >
                  <GithubIcon size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Validated Contact Form */}
          <div className="glass-card" style={{ padding: '36px' }}>
            <form onSubmit={handleSubmit} noValidate>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Send a Message</h3>

              {submitSuccess && (
                <div
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'rgba(34, 197, 94, 0.15)',
                    border: '1px solid rgba(34, 197, 94, 0.4)',
                    color: '#15803d',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}
                >
                  <CheckCircle2 size={18} /> Thank you! Your message has been sent successfully.
                </div>
              )}

              {errors.form && (
                <div
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#ef4444',
                    marginBottom: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}
                >
                  {errors.form}
                </div>
              )}

              {/* Name & Email Inputs */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  marginBottom: '16px'
                }}
                className="form-row"
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      marginBottom: '6px'
                    }}
                  >
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: errors.name ? '1px solid #ef4444' : '1px solid var(--border-color)',
                      color: 'var(--text-main)',
                      outline: 'none',
                      fontSize: '0.95rem'
                    }}
                  />
                  {errors.name && (
                    <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
                      {errors.name}
                    </span>
                  )}
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      marginBottom: '6px'
                    }}
                  >
                    Your Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: errors.email ? '1px solid #ef4444' : '1px solid var(--border-color)',
                      color: 'var(--text-main)',
                      outline: 'none',
                      fontSize: '0.95rem'
                    }}
                  />
                  {errors.email && (
                    <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
                      {errors.email}
                    </span>
                  )}
                </div>
              </div>

              {/* Subject Input */}
              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    marginBottom: '6px'
                  }}
                >
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Software Developer Opportunity"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: errors.subject ? '1px solid #ef4444' : '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    outline: 'none',
                    fontSize: '0.95rem'
                  }}
                />
                {errors.subject && (
                  <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
                    {errors.subject}
                  </span>
                )}
              </div>

              {/* Message Input */}
              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    marginBottom: '6px'
                  }}
                >
                  Message *
                </label>
                <textarea
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: errors.message ? '1px solid #ef4444' : '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    outline: 'none',
                    fontSize: '0.95rem',
                    resize: 'vertical'
                  }}
                />
                {errors.message && (
                  <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>
                    {errors.message}
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '14px',
                  opacity: isSubmitting ? 0.7 : 1
                }}
              >
                {isSubmitting ? (
                  'Sending...'
                ) : (
                  <>
                    <Send size={18} /> Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 576px) {
          .form-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default ContactSection;
