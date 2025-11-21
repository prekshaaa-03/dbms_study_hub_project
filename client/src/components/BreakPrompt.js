import React, { useState } from 'react';
import './BreakPrompt.css';

const breakPrompts = [
  {
    prompt: "Take a 5-minute stretch!",
    url: "https://www.everydayhealth.com/fitness/quickstretches-for-stress-relief/"
  },
  {
    prompt: "Listen to a relaxing song!",
    url: "https://open.spotify.com/playlist/37i9dQZF1DX3Ogo9pFvBkY?si=d5a9da4ec4234cc2"
  },
  {
    prompt: "Go for a quick walk!",
    url: "https://www.walksforhealth.org.uk/"
  },
  {
    prompt: "Drink some water!",
    url: "https://www.medicalnewstoday.com/articles/322228"
  },
  {
    prompt: "Meditate for 5 minutes!",
    url: "https://www.headspace.com/meditation/5-minute-meditation"
  }
];

const BreakPrompt = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const updateFlashcard = () => {
    const currentPrompt = breakPrompts[currentIndex];
    return {
      text: currentPrompt.prompt,
      url: currentPrompt.url
    };
  };

  const handleForward = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % breakPrompts.length);
  };

  const handleBackward = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + breakPrompts.length) % breakPrompts.length);
  };

  const { text, url } = updateFlashcard();

  const handleLogout = () => {

    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');

    window.location.href = '/login';
  };

  return (
    <div>

      <header className="dashboard-header">
        <div className="logo">Lock In.</div>
        <nav className="nav-links">
          <div className="profile">
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </nav>
      </header>

      <h1>Take a break!</h1>

      <div className="flashcard-container">

        <button className="arrow" onClick={handleBackward}>&#8592;</button>

        <div className="flashcard" onClick={() => window.open(url, '_blank')}>
          {text}
        </div>

        <button className="arrow" onClick={handleForward}>&#8594;</button>
      </div>
    </div>
  );
};

export default BreakPrompt;
