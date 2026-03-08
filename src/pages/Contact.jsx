import React from "react";
import logo from "../assets/images/logoo.jpeg";
import { useNavigate } from "react-router-dom";

const Contact = () => {
    const navigate = useNavigate();

    return (
        <div className="contact-page">
            <div style={{ padding: '20px' }}>
                <button className="button" onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    ← Go Back
                </button>
            </div>

            <div className="form-container">
                <div className="inner-container" style={{ textAlign: 'center' }}>
                    <div className="form-header" style={{ justifyContent: 'center' }}>
                        <img src={logo} alt="Logo" className="form-logo" />
                        <div className="header-text">
                            <h1 className="brand">BløckMate</h1>
                        </div>
                    </div>

                    <h2 className="form-title" style={{ marginTop: '10px' }}>Contact Us</h2>
                    <p style={{ color: 'rgb(15, 22, 45)', fontSize: '1.2rem', marginBottom: '30px' }}>
                        Have questions or need assistance? We're here to help!
                    </p>

                    <div className="contact-details" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
                        <div className="contact-item" style={{
                            background: 'rgba(255,255,255,0.03)',
                            padding: '5px',
                            borderRadius: '15px',
                            border: '1px solid rgba(255,255,255,0.05)',
                            transition: 'transform 0.3s ease'
                        }}>
                            <h3 style={{ color: '#00d2ff', marginBottom: '0px', fontSize: '1.7rem' }}>📧 Email</h3>
                            <p style={{ color: 'black', fontSize: '1.1rem',fontWeight: '1000', wordBreak: 'break-all' }}>manojkumark3377@gmail.com</p>
                        </div>

                        <div className="contact-item" style={{
                            background: 'rgba(255,255,255,0.03)',
                            padding: '5px',
                            borderRadius: '15px',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <h3 style={{ color: '#25D366', marginBottom: '0px', fontSize: '1.7rem' }}>💬 WhatsApp</h3>
                            <p style={{ color: 'black', fontSize: '1.1rem',fontWeight: '1000' }}></p>
                            <a href="https://wa.me/919704341511" target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', fontSize: '1rem', textDecoration: 'none' }}>Chat Now →</a>
                        </div>

                        <div className="contact-item" style={{
                            background: 'rgba(255,255,255,0.03)',
                            padding: '5px',
                            borderRadius: '15px',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <h3 style={{ color: '#bb314bff', marginBottom: '0px', fontSize: '1.7rem' }}>📸 Instagram</h3>
                            <a href="https://www.instagram.com/venzenith_official?igsh=MWtxZ2doeXFtbmg1Zg==" target="_blank" rel="noopener noreferrer" style={{ color: '#bb314bff', fontSize: '1.1rem', textDecoration: 'none' }}>@venzenith_official </a>
                        </div>

                        <div className="contact-item" style={{
                            background: 'rgba(255,255,255,0.03)',
                            padding: '5px',
                            borderRadius: '15px',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <h3 style={{ color: '#0077B5', marginBottom: '0px', fontSize: '1.7rem' }}>🔗 LinkedIn</h3>
                            <a href="https://www.linkedin.com/in/manoj-kumar-k-201155341/" target="_blank" rel="noopener noreferrer" style={{ color: '#0077B5', fontSize: '1.2rem', textDecoration: 'none' }}>View Profile </a>
                        </div>
                    </div>

                    <div style={{ marginTop: '40px' }}>
                        <button className="button" style={{ width: '100%' }} onClick={() => window.location.href = 'mailto:manojkumark3377@gmail.com'}>
                            Send an Email
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
