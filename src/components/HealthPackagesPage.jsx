import { Check, Crown, ShieldCheck, Sparkles, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

function HealthPackagesPage({ language, onBack }) {
  const isEnglish = language === 'en';
  const [activeBookingPlan, setActiveBookingPlan] = useState(null);
  const [bookingForm, setBookingForm] = useState({});
  const [content, setContent] = useState(
    isEnglish
      ? {
          title: 'Health packages',
          subtitle: 'Choose A Preventive Care Plan For Your Family’s Wellness.',
          packages: [],
        }
      : {
          title: 'स्वास्थ्य प्याकेज',
          subtitle: 'तपाईंको परिवारको स्वास्थ्य र आरामका लागि डिजाईन गरिएको रोकथाम हेरचाह योजनाहरू छनोट गर्नुहोस्।',
          packages: [],
        }
  );
  const hospitalPhone = '01-4981071';

  const fallbackContent = isEnglish
    ? {
        title: 'Health packages',
        subtitle: 'Choose A Preventive Care Plan For Your Family’s Wellness.',
        packages: [
          {
            name: 'Basic Plan',
            price: 'Rs. 3,800/-',
            tests: [
              'WHOLE BODY CHECKUP PLAN (A)',
              'CXR-PA',
              'USG ABDOMEN AND PELVIS',
              'BLOOD GROUP',
              'CBC',
              'LFT (BIL-T, BIL-D, GPT, GOT, ALP, G-GT, ALB, PROT)',
              'RBS',
              'RFT (UREA, CRET, NA, K)',
              'URIC ACID',
              'STOOL RE/ME',
              'URINE RE/ME',
            ],
          },
          {
            name: 'Standard Plan',
            price: 'Rs. 7,100/-',
            tests: [
              'WHOLE BODY CHECKUP PLAN (B)',
              'USG ABDOMEN AND PELVIS',
              'ECG',
              'CXR-PA',
              'BLOOD GROUP',
              'CBC',
              'FASTING (SUGAR)',
              'LFT (BIL-T, BIL-D, GPT, GOT, ALP, G-GT, ALB, PROT)',
              'LIPID PROFILE',
              'RFT (UREA, CRET, NA, K)',
              'TFT',
              'URIC ACID',
              'ANTI HCV (IMMUNOCHROMATOGRAPHY)',
              'HBSAG IMMUNOCHROMATOGRAPHY',
              'HIV (IMMUNOCHROMATOGRAPHY)',
              'VDRL',
              'STOOL RE/ME',
              'URINE RE/ME',
              'TPHA',
            ],
          },
          {
            name: 'Premium Plan',
            price: 'Rs. 9,700/-',
            tests: [
              'WHOLE BODY CHECKUP PLAN (C)',
              'USG ABDOMEN AND PELVIS',
              'CXR-PA',
              'ECG',
              'ECHO',
              'BLOOD GROUP',
              'CBC',
              'FASTING (SUGAR)',
              'HbA1c',
              'LFT (BIL-T, BIL-D, GPT, GOT, ALP, G-GT, ALB, PROT)',
              'LIPID PROFILE',
              'RFT (UREA, CRET, NA, K)',
              'TFT',
              'URIC ACID',
              'ANTI HCV (IMMUNOCHROMATOGRAPHY)',
              'HBSAG IMMUNOCHROMATOGRAPHY',
              'HIV (IMMUNOCHROMATOGRAPHY)',
              'TPHA',
              'VDRL',
              'STOOL RE/ME',
              'URINE RE/ME',
            ],
          },
        ],
      }
    : {
        title: 'स्वास्थ्य प्याकेज',
        subtitle: 'तपाईंको परिवारको स्वास्थ्य र आरामका लागि डिजाईन गरिएको रोकथाम हेरचाह योजनाहरू छनोट गर्नुहोस्।',
        packages: [
          {
            name: 'बेसिक योजना',
            price: 'रु. ३,८००/-',
            tests: [
              'WHOLE BODY CHECKUP PLAN (A)',
              'CXR-PA',
              'USG ABDOMEN AND PELVIS',
              'BLOOD GROUP',
              'CBC',
              'LFT (BIL-T, BIL-D, GPT, GOT, ALP, G-GT, ALB, PROT)',
              'RBS',
              'RFT (UREA, CRET, NA, K)',
              'URIC ACID',
              'STOOL RE/ME',
              'URINE RE/ME',
            ],
          },
          {
            name: 'स्ट्यान्डर्ड योजना',
            price: 'रु. ७,१००/-',
            tests: [
              'WHOLE BODY CHECKUP PLAN (B)',
              'USG ABDOMEN AND PELVIS',
              'ECG',
              'CXR-PA',
              'BLOOD GROUP',
              'CBC',
              'FASTING (SUGAR)',
              'LFT (BIL-T, BIL-D, GPT, GOT, ALP, G-GT, ALB, PROT)',
              'LIPID PROFILE',
              'RFT (UREA, CRET, NA, K)',
              'TFT',
              'URIC ACID',
              'ANTI HCV (IMMUNOCHROMATOGRAPHY)',
              'HBSAG IMMUNOCHROMATOGRAPHY',
              'HIV (IMMUNOCHROMATOGRAPHY)',
              'VDRL',
              'STOOL RE/ME',
              'URINE RE/ME',
              'TPHA',
            ],
          },
          {
            name: 'प्रीमियम योजना',
            price: 'रु. ९,७००/-',
            tests: [
              'WHOLE BODY CHECKUP PLAN (C)',
              'USG ABDOMEN AND PELVIS',
              'CXR-PA',
              'ECG',
              'ECHO',
              'BLOOD GROUP',
              'CBC',
              'FASTING (SUGAR)',
              'HbA1c',
              'LFT (BIL-T, BIL-D, GPT, GOT, ALP, G-GT, ALB, PROT)',
              'LIPID PROFILE',
              'RFT (UREA, CRET, NA, K)',
              'TFT',
              'URIC ACID',
              'ANTI HCV (IMMUNOCHROMATOGRAPHY)',
              'HBSAG IMMUNOCHROMATOGRAPHY',
              'HIV (IMMUNOCHROMATOGRAPHY)',
              'TPHA',
              'VDRL',
              'STOOL RE/ME',
              'URINE RE/ME',
            ],
          },
        ],
      };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const loadPackages = async () => {
      try {
        const response = await fetch('/api/health-packages');
        if (!response.ok) throw new Error('Health packages API unavailable');

        const payload = await response.json();
        const packages = payload.packages || [];

        if (packages.length > 0) {
          setContent((current) => ({
            ...current,
            packages: packages.map((pkg) => ({
              name: pkg.name,
              price: pkg.price,
              tests: Array.isArray(pkg.tests) ? pkg.tests : [],
            })),
          }));
        } else {
          setContent(fallbackContent);
        }
      } catch (error) {
        setContent(fallbackContent);
      }
    };

    loadPackages();
  }, [isEnglish]);

  const openBookingDialog = (pkgName) => {
    setActiveBookingPlan(pkgName);
  };

  const closeBookingDialog = () => {
    setActiveBookingPlan(null);
  };

  const handleBookingChange = (pkgName, field, value) => {
    setBookingForm((prev) => ({
      ...prev,
      [pkgName]: {
        ...(prev[pkgName] || {}),
        [field]: value,
      },
    }));
  };

  const handleBookingSubmit = (pkgName, event) => {
    event.preventDefault();
    const formData = bookingForm[pkgName] || {};

    if (!formData.name || !formData.phone) {
      Swal.fire({
        icon: 'warning',
        title: isEnglish ? 'Incomplete details' : 'पूर्ण जानकारी छैन',
        text: isEnglish
          ? 'Please enter your name and phone number so we can contact you.'
          : 'हामीले तपाईंलाई सम्पर्क गर्नका लागि कृपया नाम र फोन नम्बर लेख्नुहोस्।',
        confirmButtonColor: '#151e5a',
      });
      return;
    }

    Swal.fire({
      icon: 'success',
      title: isEnglish ? 'Plan request received' : 'योजना अनुरोध प्राप्त भयो',
      text: isEnglish
        ? `Thank you, ${formData.name}. Our team will contact you shortly about the ${pkgName}.`
        : `धन्यवाद, ${formData.name}। हाम्रो टोलीले ${pkgName} बारे तपाईंलाई चाँडै सम्पर्क गर्नेछ।`,
      confirmButtonColor: '#151e5a',
    });

    setActiveBookingPlan(null);
    setBookingForm((prev) => ({ ...prev, [pkgName]: { name: '', phone: '', email: '' } }));
  };

  return (
    <section className="section suggestion-page">
      <div className="container suggestion-shell">
        <div className="suggestion-card reveal">
          <div className="suggestion-intro">
            <h1>{content.title}</h1>
            <p className="health-packages-subtitle">{content.subtitle}</p>
          </div>

          <div className="suggestion-content-grid">
            <div className="health-packages-grid">
              {content.packages.map((pkg, index) => {
                const isPopular = index === 1;
                const isFeatured = index === 2;

                const badgeClass = index === 0 ? 'basic' : index === 1 ? 'standard' : 'premium';
                const badgeIcon = index === 0 ? <ShieldCheck size={16} /> : index === 1 ? <Sparkles size={16} /> : <Crown size={16} />;
                const badgeLabel = index === 0
                  ? (isEnglish ? 'Basic Plan' : 'बेसिक योजना')
                  : index === 1
                    ? (isEnglish ? 'Standard Plan' : 'स्ट्यान्डर्ड योजना')
                    : (isEnglish ? 'Premium Plan' : 'प्रीमियम योजना');
                return (
                  <article
                    key={pkg.name}
                    className={`health-package-card health-package-card--${badgeClass}${isPopular ? ' health-package-card--popular' : ''}${isFeatured ? ' health-package-card--featured' : ''}`}
                  >
                    <div className="health-package-card-top">
                      <span className={`health-package-plan-badge ${badgeClass}`} aria-label={badgeLabel}>
                        {badgeIcon}
                        <span className="health-package-plan-badge-text">{badgeLabel}</span>
                      </span>
                    </div>

                    <div className="health-package-card-header">
                      <div className="price-container">
                        <span className="price-label">{isEnglish ? 'Total' : 'कुल'}</span>
                        <span className="price-val">{pkg.price}</span>
                      </div>
                    </div>

                    <div className="package-divider" />

                    <div className="package-body">
                      <div className="category-group">
                        <ul>
                          {pkg.tests.map((item) => (
                            <li key={item}>
                              <Check className="check-icon" size={14} />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="health-package-card-footer">
                      <button
                        type="button"
                        className="health-package-choose-btn"
                        onClick={() => openBookingDialog(pkg.name)}
                      >
                        {isEnglish ? 'Choose your plan' : 'तपाईंको योजना छनोट गर्नुहोस्'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {activeBookingPlan && (
        <div className="health-package-dialog-backdrop" onClick={closeBookingDialog}>
          <div className="health-package-dialog" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="health-package-dialog-close" onClick={closeBookingDialog} aria-label={isEnglish ? 'Close dialog' : 'संवाद बन्द गर्नुहोस्'}>
              <X size={18} />
            </button>
            <h3>{isEnglish ? 'Book this plan' : 'यो योजना बुक गर्नुहोस्'}</h3>
            <p>{isEnglish ? 'Share your details and we will contact you soon.' : 'आफ्नो विवरण साझा गर्नुहोस् र हामी चाँडै सम्पर्क गर्नेछौं।'}</p>
            <form className="health-package-booking-form" onSubmit={(event) => handleBookingSubmit(activeBookingPlan, event)}>
              <label>
                <span>{isEnglish ? 'Your name' : 'तपाईंको नाम'}</span>
                <input
                  type="text"
                  value={bookingForm[activeBookingPlan]?.name || ''}
                  onChange={(event) => handleBookingChange(activeBookingPlan, 'name', event.target.value)}
                  placeholder={isEnglish ? 'Enter your name' : 'तपाईंको नाम लेख्नुहोस्'}
                />
              </label>
              <label>
                <span>{isEnglish ? 'Phone number' : 'फोन नम्बर'}</span>
                <input
                  type="tel"
                  value={bookingForm[activeBookingPlan]?.phone || ''}
                  onChange={(event) => handleBookingChange(activeBookingPlan, 'phone', event.target.value)}
                  placeholder={isEnglish ? 'Enter phone number' : 'फोन नम्बर लेख्नुहोस्'}
                />
              </label>
              <label>
                <span>{isEnglish ? 'Email (optional)' : 'इमेल (वैकल्पिक)'}</span>
                <input
                  type="email"
                  value={bookingForm[activeBookingPlan]?.email || ''}
                  onChange={(event) => handleBookingChange(activeBookingPlan, 'email', event.target.value)}
                  placeholder={isEnglish ? 'Enter email' : 'इमेल लेख्नुहोस्'}
                />
              </label>

              <div className="health-package-booking-actions">
                <button type="submit" className="health-package-submit-btn">
                  {isEnglish ? 'Submit request' : 'अनुरोध पठाउनुहोस्'}
                </button>
                <a className="health-package-call-link" href={`tel:${hospitalPhone.replace(/\D/g, '')}`}>
                  {isEnglish ? 'Need it quickly? Call hospital' : 'छिटो चाहियो? अस्पताललाई कल गर्नुहोस्'}
                </a>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default HealthPackagesPage;
