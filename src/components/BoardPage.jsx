import React, { useEffect } from 'react';
import bodBgImage from '../../image/bod_bg.png';

function BoardPage({ language = 'en', members = [], onBack }) {
  const isEnglish = language === 'en';

  useEffect(() => {
    // dev debug: log member image sources to help diagnose identical-image issue
    try {
      // eslint-disable-next-line no-console
      console.log('BoardPage members images:', members.map((m) => m.image));
    } catch (e) {
      // ignore
    }
  }, [members]);

  return (
    <section className="bod-page">
      <div
        className="bod-hero"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(10, 16, 42, 0.72), rgba(15, 32, 60, 0.45)), url(${bodBgImage})`,
        }}
      >
        <div className="container bod-hero-inner">
          <p className="eyebrow">{isEnglish ? 'Board of Director (BOD)' : 'बोर्ड अफ डाइरेक्टर (BOD)'}</p>
          <h1>{isEnglish ? 'Leadership that shapes our care.' : 'हाम्रो सेवा निर्माण गर्ने नेतृत्व।'}</h1>
          <p>
            {isEnglish
              ? 'The Board of Directors guides our mission, strengthens our standards, and keeps our hospital rooted in trust, quality, and community care.'
              : 'बोर्ड अफ डाइरेक्टरहरूले हाम्रो मिशनलाई निर्देशित गर्दै, मानकहरू सुदृढ गर्दै, र अस्पताललाई विश्वस्तता, गुणस्तर र समुदाय सेवा संग जोड्छन्।'}
          </p>
        </div>
      </div>

      <div className="container bod-content-wrap">
        <div className="section-head reveal bod-page-head">
          <p className="eyebrow">{isEnglish ? 'Board of Director (BOD)' : 'बोर्ड अफ डाइरेक्टर (BOD)'}</p>
          <h2>
            <span className="board-heading-line">{isEnglish ? 'THE LEADERSHIP TEAM' : 'नेतृत्व टोली'}</span>
            <span className="board-heading-callout">{isEnglish ? 'BEHIND OUR HOSPITAL VISION.' : 'हाम्रो अस्पतालको विजन पछाडि।'}</span>
          </h2>
        </div>

        <div className="doctor-grid">
          {members.map((member) => (
            <article key={member.name} className="doctor-card reveal doctor-card-feature board-doctor-card" role="button" tabIndex={0} onClick={() => onBack && onBack()} onKeyDown={(e) => { if (e.key === 'Enter') onBack && onBack(); }}>
              <div className="doctor-card-demo-visual board-media">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="doctor-card-demo-image"
                    style={{ objectFit: 'contain', objectPosition: 'center', width: 'auto', height: '100%' }}
                  />
                ) : (
                  <div className="doctor-card-demo-image" style={{ display: 'grid', placeItems: 'center' }}>
                    <svg className="board-profile-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <path d="M12 12.2a4.15 4.15 0 1 0-4.15-4.15A4.15 4.15 0 0 0 12 12.2Zm0 2.1c-4.36 0-7.9 2.31-7.9 5.16v.94h15.8v-.94c0-2.85-3.54-5.16-7.9-5.16Z" fill="currentColor" />
                    </svg>
                  </div>
                )}
                <div className="doctor-card-demo-overlay">
                  <div className="doctor-card-demo-badge">
                    <span className="doctor-card-demo-dot" aria-hidden="true" />
                    <span className="specialty">{member.role}</span>
                  </div>
                  <h3 className="doctor-card-demo-name">{member.name}</h3>
                  <span>{member.description}</span>
                  <div className="debug-image-name" aria-hidden="true">{member.image ? member.image.toString().split('/').pop() : 'no-image'}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BoardPage;
