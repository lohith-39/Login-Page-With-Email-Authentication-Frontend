import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleSendCode = async () => {
    try {
      const res = await fetch('http://localhost:8080/user/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!res.ok) throw new Error('Failed to send verification code');

      setMessage('Verification code sent to email.');
      setMessageType('success');
      setStep(2);
    } catch (err) {
      setMessage(err.message);
      setMessageType('error');
    }
  };

  const handleVerifyCode = async () => {
    try {
      const res = await fetch('http://localhost:8080/user/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });

      if (!res.ok) throw new Error('Invalid verification code');

      setMessage('Code verified. You may now reset your password.');
      setMessageType('success');
      setStep(3);
    } catch (err) {
      setMessage(err.message);
      setMessageType('error');
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== retypePassword) {
      setMessage("Passwords do not match!");
      setMessageType("error");
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/user/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword })
      });

      if (!res.ok) throw new Error('Failed to reset password');

      setMessage('Password reset successful. Redirecting to login...');
      setMessageType('success');

      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setMessage(err.message);
      setMessageType('error');
    }
  };

  return (
    <div className="forgot-container">
      <h2>Forgot Password</h2>
      {message && (
        <p style={{ color: messageType === 'error' ? 'red' : 'green' }}>{message}</p>
      )}

    {step === 1 && (
    <div className="input-button-group">
        <input
        type="email"
        placeholder="Enter your registered email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />
        <button className="button" onClick={handleSendCode}>
            <span>Send Verification Code</span></button>
    </div>
    )}

      {step === 2 && (
        <div className="input-button-group">
          <input
            type="text"
            placeholder="Enter verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button className='button' onClick={handleVerifyCode}>
            <span>Verify Code</span></button>
        </div>
      )}

      {step === 3 && (
        <div className="input-button-group">
          <div style={{ position: 'relative', marginBottom: '10px' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <i
              className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: '#888',
              }}
              aria-label={showPassword ? "Hide password" : "Show password"}
            ></i>
          </div>

          <div style={{ position: 'relative', marginBottom: '10px'}}>
            <input
              type={showRetypePassword ? 'text' : 'password'}
              placeholder="Retype new password"
              value={retypePassword}
              onChange={(e) => setRetypePassword(e.target.value)}
            />
            <i
              className={`fas ${showRetypePassword ? 'fa-eye-slash' : 'fa-eye'}`}
              onClick={() => setShowRetypePassword(!showRetypePassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: '#888',
              }}
              aria-label={showRetypePassword ? "Hide password" : "Show password"}
            ></i>
          </div>

          <button className="button" onClick={handleResetPassword}>
            <span>Reset Password</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;