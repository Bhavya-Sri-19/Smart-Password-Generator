import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const PasswordGenerator = () => {
  const [length, setLength] = useState(12);
  const [options, setOptions] = useState({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [label, setLabel] = useState('');
  const [useLabelMode, setUseLabelMode] = useState(false);

  const charset = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+{}[]<>?,.',
  };

  const generatePassword = () => {
    if (useLabelMode && label.trim()) {
      const formattedLabel = label.trim().charAt(0).toUpperCase() + label.trim().slice(1).toLowerCase();
      const prefixes = ['$', '@', '#', '*'];
      const suffixWords = ['Secure', 'Lock', 'Vault', 'Pro', 'Access'];
      const randomSuffix = suffixWords[Math.floor(Math.random() * suffixWords.length)];
      const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const randomNum = Math.floor(1000 + Math.random() * 9000);

      const contextPassword = `${randomPrefix}${formattedLabel}${randomSuffix}${randomNum}`;
      setPassword(contextPassword);
      evaluateStrength(contextPassword);
      return;
    }

    let chars = '';
    Object.entries(options).forEach(([key, isChecked]) => {
      if (isChecked) chars += charset[key];
    });

    if (!chars) {
      setPassword('');
      setStrength('');
      setSuggestion('⚠️ Select at least one character type.');
      return;
    }

    let pass = '';
    for (let i = 0; i < length; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setPassword(pass);
    evaluateStrength(pass);
  };

  const evaluateStrength = (pass) => {
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSymbol = /[!@#$%^&*()_+{}[\]<>?,.]/.test(pass);

    const lengthScore = pass.length >= 12 ? 1 : 0;
    const varietyScore = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;

    const totalScore = lengthScore + varietyScore;

    if (totalScore <= 2) {
      setStrength('Weak');
      setSuggestion('Try adding uppercase, symbols, and increase the length.');
    } else if (totalScore === 3) {
      setStrength('Medium');
      setSuggestion('Try increasing the length or adding more character types.');
    } else {
      setStrength('Strong');
      setSuggestion('✅ Great! Your password is strong.');
    }
  };

  useEffect(() => {
    generatePassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length, options, label, useLabelMode]);

  const handleCheckboxChange = (e) => {
    setOptions({ ...options, [e.target.name]: e.target.checked });
  };

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    alert('✅ Password copied to clipboard!');
  };

  return (
    <div
      className={`card shadow p-4 mx-auto ${darkMode ? 'bg-dark text-white' : 'bg-white text-dark'}`}
      style={{ maxWidth: '500px' }}
    >
      <div className="text-end mb-2">
        <button
          className={`btn btn-sm ${darkMode ? 'btn-light' : 'btn-dark'}`}
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      <h4 className="mb-3 text-center">🔐 Password Generator</h4>

      <div className="form-check form-switch mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="labelModeSwitch"
          checked={useLabelMode}
          onChange={() => {
            setUseLabelMode(!useLabelMode);
            setLabel('');
          }}
        />
        <label className="form-check-label" htmlFor="labelModeSwitch">
          Use meaningful password (based on label)
        </label>
      </div>

      <div className="mb-3">
        <label className="form-label">Purpose / Label (e.g. bank, email, github)</label>
        <input
          type="text"
          className={`form-control ${darkMode ? 'bg-secondary text-white' : ''}`}
          placeholder="Enter purpose"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          disabled={!useLabelMode}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Password Length: {length}</label>
        <input
          type="range"
          className="form-range"
          min="8"
          max="32"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          disabled={useLabelMode}
        />
      </div>

      {['lowercase', 'uppercase', 'numbers', 'symbols'].map((type) => (
        <div className="form-check" key={type}>
          <input
            className="form-check-input"
            type="checkbox"
            name={type}
            checked={options[type]}
            onChange={handleCheckboxChange}
            id={type}
            disabled={useLabelMode}
          />
          <label className="form-check-label text-capitalize" htmlFor={type}>
            {type}
          </label>
        </div>
      ))}

      <div className="mt-4">
        <label className="form-label">Generated Password:</label>
        <div className="input-group">
          <input
            type={showPassword ? 'text' : 'password'}
            className={`form-control ${darkMode ? 'bg-secondary text-white' : ''}`}
            value={password}
            readOnly
          />
          <button
            className="btn btn-outline-secondary"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          <button className="btn btn-outline-primary" onClick={copyToClipboard}>
            Copy
          </button>
        </div>

        {strength && (
          <div className="mt-2">
            <span
              className={`badge ${
                strength === 'Strong'
                  ? 'bg-success'
                  : strength === 'Medium'
                  ? 'bg-warning text-dark'
                  : 'bg-danger'
              }`}
            >
              Strength: {strength}
            </span>
            <div className="text-muted mt-1">{suggestion}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordGenerator;
