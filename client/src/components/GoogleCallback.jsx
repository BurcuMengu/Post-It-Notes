import React, { useEffect } from 'react';

const GoogleCallback = () => {
  useEffect(() => {
    // Redirect can be done after the Google OAuth callback.
    window.location.href = 'http://localhost:3000/notes'; // Redirect after successful login
  }, []);

  return <div>Redirecting...</div>;
};

export default GoogleCallback;
