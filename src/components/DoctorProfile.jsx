import React, { useEffect, useState } from 'react';
import drDemoImage from '../../image/dr_demo.png';

const fallbackDoctorImage = drDemoImage;

function DoctorProfile({ doctor, language = 'en', onBack }) {
  const [offsetTop, setOffsetTop] = useState(0);
  const isEnglish = language === 'en';

  useEffect(() => {
    if (!doctor) return undefined;
    const calc = () => {
      const topbar = document.querySelector('.topbar');
      const offset = topbar ? topbar.offsetHeight : 0;
      setOffsetTop(offset + 8);
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, [doctor]);

  if (!doctor) return null;

  return (
    <section className="section doctor-profile" style={{ paddingTop: offsetTop }}>
      <div className="container">
        {/* Back button intentionally removed per UX requirement */}

        <div className="doctor-profile-grid">
          <div className="doctor-profile-media">
            <img
              src={doctor.image || fallbackDoctorImage}
              alt={doctor.name}
              className="doctor-profile-img"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = fallbackDoctorImage;
              }}
            />
          </div>
          <div className="doctor-profile-info">
            <h1>{doctor.name}</h1>
            <p className="doctor-profile-specialty">{doctor.specialty || doctor.department}</p>
            <p className="doctor-profile-experience">{doctor.experience}</p>
            {doctor.bio && <div className="doctor-profile-bio"><h3>{isEnglish ? 'About' : 'बारे'}</h3><p>{doctor.bio}</p></div>}

            <div className="doctor-profile-contact">
              {doctor.phone && (<p><strong>{isEnglish ? 'Phone' : 'फोन'}:</strong> <a href={`tel:${doctor.phone}`}>{doctor.phone}</a></p>)}
              {doctor.email && (<p><strong>{isEnglish ? 'Email' : 'इमेल'}:</strong> <a href={`mailto:${doctor.email}`}>{doctor.email}</a></p>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DoctorProfile;
