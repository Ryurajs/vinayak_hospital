import React, { useEffect, useMemo, useState } from 'react';
import drDemoImage from '../../image/dr_demo.webp';

const fallbackDoctorImage = drDemoImage;

const formatDoctorName = (name) => {
  const raw = (name || '').toString().trim();
  if (!raw) return '';

  const normalized = raw.replace(/\s+/g, ' ').trim();

  if (/^prof\.?\s*dr\.?\s+/i.test(normalized)) {
    return normalized.replace(/^prof\.?\s*/i, 'Prof. ').replace(/\s+/g, ' ').trim();
  }

  if (/^dr\.?\s+/i.test(normalized)) {
    return normalized.replace(/^dr\.?\s+/i, 'Dr. ');
  }

  if (/^yam\s+psd\.?\s+dwa$/i.test(normalized)) {
    return 'Prof. Dr. Yam PSD. Dwa';
  }

  const withoutPrefix = normalized.replace(/^dr\.?\s+/i, '');
  const titleCase = withoutPrefix.replace(/\b\w/g, (char) => char.toUpperCase());
  return `Dr. ${titleCase}`;
};

function DoctorsPage({ language = 'en', doctors = [], onBack, onSelectDoctor }) {
  const isEnglish = language === 'en';
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState('all');

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  // derive departments from doctors list
  const departments = useMemo(() => {
    const set = new Set();
    doctors.forEach((d) => {
      const dep = d.department || d.specialty || d.specialities || d.speciality;
      if (dep) set.add(dep);
    });
    return Array.from(set).sort();
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    const q = (query || '').trim().toLowerCase();
    const seenNames = new Set();
    const seenImages = new Set();
    
    return doctors.filter((d) => {
      // Check for duplicate doctor names
      const doctorName = (d.name || '').toString().toLowerCase();
      if (seenNames.has(doctorName)) return false;
      seenNames.add(doctorName);

      // Check for duplicate images
      const imageUrl = (d.image || '').toString();
      if (imageUrl && seenImages.has(imageUrl)) return false;
      if (imageUrl) seenImages.add(imageUrl);

      // department filter
      const dep = (d.department || d.specialty || d.specialities || d.speciality || '').toString().toLowerCase();
      if (department !== 'all' && dep !== department.toLowerCase()) return false;

      // search across name, specialty/department, and diseases/conditions
      if (!q) return true;
      const name = (d.name || '').toString().toLowerCase();
      const specialty = dep;
      const diseases = ((d.diseases || d.conditions || d.specializations || []) || [])
        .join(' ')
        .toString()
        .toLowerCase();

      return name.includes(q) || specialty.includes(q) || diseases.includes(q);
    });
  }, [doctors, query, department]);


  return (
    <section className="section doctors-page">
      <div className="container">
        <div className="section-head doctors-header-centered">
          <div>
            <p className="eyebrow">{isEnglish ? 'Our doctors' : 'हाम्रो डाक्टरहरू'}</p>
            <h2>{isEnglish ? 'Our doctors' : 'हाम्रो डाक्टरहरू'}</h2>
          </div>
        </div>

        <div className="doctor-controls" style={{ marginBottom: '1rem' }}>
          <div className="doctor-filter-row">
            <div className="doctor-filter-button-group">
              <button type="button" className={`doctor-filter-btn ${department === 'all' ? 'active' : ''}`} onClick={() => setDepartment('all')}>{isEnglish ? 'All' : 'सबै'}</button>
              <button type="button" className={`doctor-filter-btn ${department === 'Obstetrics & Gynaecology' ? 'active' : ''}`} onClick={() => setDepartment('Obstetrics & Gynaecology')}>{isEnglish ? 'Obstetrics & Gynaecology' : 'प्रसूति र स्त्रीरोग'}</button>
            </div>

            <div className="doctor-filter-input-row">
              <select className="doctor-select department-dropdown" value={department} onChange={(e) => setDepartment(e.target.value)} aria-label={isEnglish ? 'Select department' : 'विभाग छनौट गर्नुहोस्'}>
                <option value="all">{isEnglish ? 'All Departments' : 'सबै विभाग'}</option>
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              <input
                aria-label={isEnglish ? 'Search doctors' : 'डाक्टर खोज्नुहोस्'}
                className="doctor-search"
                placeholder={isEnglish ? 'Search by name, department, disease...' : 'नाम, विभाग, रोगले खोज्नुहोस्...'}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="doctor-grid">
          {filteredDoctors.map((doctor) => (
            <article key={doctor.name} className="doctor-card reveal doctor-card-feature" role="button" tabIndex={0} onClick={() => onSelectDoctor && onSelectDoctor(doctor)} onKeyDown={(e) => { if (e.key === 'Enter') onSelectDoctor && onSelectDoctor(doctor); }}>
              <div className="doctor-card-demo-visual">
                <img
                  src={doctor.image || fallbackDoctorImage}
                  alt={doctor.name}
                  className="doctor-card-demo-image"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = fallbackDoctorImage;
                  }}
                />
                <div className="doctor-card-demo-overlay">
                  <div className="doctor-card-demo-badge">
                    <span className="doctor-card-demo-dot" aria-hidden="true" />
                    <span className="specialty">{doctor.department || doctor.specialty}</span>
                  </div>
                  <h3 className="doctor-card-demo-name">{formatDoctorName(doctor.name)}</h3>
                  <span>{doctor.specialty || doctor.department}{doctor.experience ? ` • ${doctor.experience}` : ''}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DoctorsPage;
