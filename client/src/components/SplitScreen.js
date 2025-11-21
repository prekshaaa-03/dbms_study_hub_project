import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SplitScreen.css';

const SplitScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialTime = parseInt(new URLSearchParams(location.search).get('time')) || 600; 
  const [remainingTime, setRemainingTime] = useState(initialTime);
  const [timerInterval, setTimerInterval] = useState(null);
  const [isSessionEnded, setIsSessionEnded] = useState(false);
  const [showCongratulationsModal, setShowCongratulationsModal] = useState(false);
  const [bellSound, setBellSound] = useState(null);
  const [taskName, setTaskName] = useState(new URLSearchParams(location.search).get('task') || '');
  const [timerDisplay, setTimerDisplay] = useState('');
  const [pdfSrc, setPdfSrc] = useState('');
  const [noteText, setNoteText] = useState(''); 
  const colors = {
    Planetary: '#334EAC',
    Venus: '#BAD6EB',
    Universe: '#7096D1',
    Meteor: '#F7F2EB',
    MilkyWay: '#FFF9F0',
    Galaxy: '#081F5C',
    Sky: '#D0E3FF'
  };
  useEffect(() => {
    const audio = new Audio('./bell.mp3');
    setBellSound(audio);
  }, []);

  const loadPDF = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPdfSrc(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    const updateTimer = () => {
      if (remainingTime > 0) {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        setTimerDisplay(`${minutes.toString().padStart(1, '0')}:${seconds.toString().padStart(2, '0')}`);
        setRemainingTime(prevTime => prevTime - 1);
      } else {
        clearInterval(timerInterval);
        setIsSessionEnded(true);

        if (bellSound) {
          bellSound.play();
        }

        setShowCongratulationsModal(true);
      }
    };

    const interval = setInterval(updateTimer, 1000);
    setTimerInterval(interval);

    return () => clearInterval(interval); 
  }, [remainingTime, bellSound]);

  const handleContinue = () => {
    
    setRemainingTime(initialTime);
    setIsSessionEnded(false);
    setShowCongratulationsModal(false);
  };

  const handleBreak = () => {
    
    navigate('/breakprompt');
  };

  
  const downloadNotes = () => {
    const blob = new Blob([noteText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'notes.txt';
    link.click();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen(); 
    } else {
      document.exitFullscreen(); 
    }
  };

  return (
    <div className="split-screen-container">
      <div id="timer">{isSessionEnded ? 'Session Ended' : `Time Left: ${timerDisplay}`}</div>

      <div id="pdf-viewer">
        <h3>PDF Viewer</h3>
        <div id="file-input-container">
          <label htmlFor="file-input">Upload a PDF</label>
          <input
            type="file"
            id="file-input"
            accept="application/pdf"
            onChange={loadPDF}
          />
        </div>
        <iframe
          id="pdf-iframe"
          src={pdfSrc}
          width="100%"
          height="90%"
          frameBorder="0"
        ></iframe>
      </div>

      <div id="notes-section">
        <h3>Notes for "{taskName}"</h3>
        <div id="notes-toolbar">
          <button onClick={() => document.execCommand('bold')}>Bold</button>
          <button onClick={() => document.execCommand('italic')}>Italic</button>
          <button onClick={() => document.execCommand('underline')}>Underline</button>
        </div>
        <div
          contentEditable="true"
          className="editable-content"
          id="notes-textarea"
          placeholder="Take your notes here..."
          onInput={(e) => setNoteText(e.target.innerText)}
        ></div>

        <button 
          onClick={downloadNotes} 
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: colors.Planetary,
            color: colors.Meteor,
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Download Notes
        </button>
      </div>

      {/* Fullscreen Button */}
      <button 
        onClick={toggleFullscreen} 
        style={{
          position: 'absolute',
          bottom: '10px',  // Adjusted from '20px' to place it slightly higher
          right: '50px', // Keep it on the top-right corner
          padding: '10px 20px',
          backgroundColor: colors.Galaxy,
          color: colors.Meteor,
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          zIndex: 100 // Make sure it's above other content
        }}
      >
        {document.fullscreenElement ? 'Exit Fullscreen' : 'Go Fullscreen'}
      </button>

      {/* Congratulations Modal */}
      {showCongratulationsModal && (
        <div 
          id="overlay" 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
        >
          <div 
            id="congratulations-modal"
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: colors.Meteor,
              padding: '30px',
              borderRadius: '8px',
              textAlign: 'center',
              zIndex: 1001,
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              width: '300px'
            }}
          >
            <h2 style={{ color: colors.Galaxy, marginBottom: '20px' }}>Congratulations!</h2>
            <p style={{ color: colors.Galaxy, marginBottom: '20px' }}>You've completed your study session!</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button 
                onClick={handleContinue}
                style={{
                  padding: '10px 20px',
                  backgroundColor: colors.Planetary,
                  color: colors.Meteor,
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Continue
              </button>
              <button 
                onClick={handleBreak}
                style={{
                  padding: '10px 20px',
                  backgroundColor: colors.Universe,
                  color: colors.Meteor,
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Time for a Break
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SplitScreen;
