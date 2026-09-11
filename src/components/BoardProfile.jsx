import React, { useEffect, useState } from 'react';

function BoardProfile({ member, language = 'en', onBack }) {
  const [offsetTop, setOffsetTop] = useState(0);
  const isEnglish = language === 'en';

  useEffect(() => {
    if (!member) return undefined;
    const calc = () => {
      const topbar = document.querySelector('.topbar');
      const offset = topbar ? topbar.offsetHeight : 0;
      setOffsetTop(Math.max(offset + 18, 110));
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, [member]);

  if (!member) return null;

  return (
    <section className="section doctor-profile" style={{ paddingTop: offsetTop }}>
      <div className="container">
        <div className="doctor-profile-grid">
          <div className="doctor-profile-media">
            <img src={member.image || ''} alt={member.name} className="doctor-profile-img" />
          </div>
          <div className="doctor-profile-info">
            <h1>{member.name}</h1>
            <p className="doctor-profile-specialty">{member.role}</p>
            <p className="doctor-profile-experience">
              {isEnglish ? 'Board Member' : 'बोर्ड सदस्य'}
            </p>
            {member.description && (
              <div className="doctor-profile-bio">
                <h3>{isEnglish ? 'About' : 'बारे'}</h3>
                <p>{member.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default BoardProfile;
