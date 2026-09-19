function SimpleInfoPage({ language = 'en', pageKey = 'blogs' }) {
  const isEnglish = language === 'en';

  const pages = {
    blogs: {
      eyebrow: isEnglish ? 'Blogs' : 'ब्लग',
      title: isEnglish ? 'Hospital stories and care insights' : 'अस्पतालका कथा र हेरचाह सम्बन्धी जानकारी',
      text: isEnglish
        ? 'Articles and updates from Vinayak Hospital will appear here. Check News & Events for current hospital announcements.'
        : 'विनायक अस्पतालका लेख र अपडेटहरू यहाँ प्रकाशित हुनेछन्। हालका सूचनाका लागि समाचार र कार्यक्रम हेर्नुहोस्।',
    },
    career: {
      eyebrow: isEnglish ? 'Career' : 'क्यारियर',
      title: isEnglish ? 'Join the Vinayak Hospital care team' : 'विनायक अस्पतालको सेवा टोलीमा सामेल हुनुहोस्',
      text: isEnglish
        ? 'We welcome clinicians, nurses, and support staff who want to deliver compassionate care. Send your interest to vinayakhospital052@gmail.com or call the hospital numbers listed in the footer.'
        : 'हामी चिकित्सक, नर्स र सहयोगी कर्मचारीलाई स्वागत गर्छौं। रुचि व्यक्त गर्न vinayakhospital052@gmail.com मा इमेल गर्नुहोस् वा फुटरमा रहेका नम्बरमा सम्पर्क गर्नुहोस्।',
    },
    academic: {
      eyebrow: isEnglish ? 'Academic' : 'शैक्षिक',
      title: isEnglish ? 'Learning and clinical education' : 'सिकाइ र क्लिनिकल शिक्षा',
      text: isEnglish
        ? 'Vinayak Hospital supports clinical learning, internships, and continuing education for healthcare professionals. Contact the hospital administration for current academic opportunities.'
        : 'विनायक अस्पतालले क्लिनिकल सिकाइ, इन्टर्नशिप र निरन्तर शिक्षामा सहयोग गर्छ। हालका शैक्षिक अवसरका लागि अस्पताल प्रशासनलाई सम्पर्क गर्नुहोस्।',
    },
    'medical-technology': {
      eyebrow: isEnglish ? 'Medical Technology' : 'चिकित्सा प्रविधि',
      title: isEnglish ? 'Diagnostics and treatment technology' : 'निदान र उपचार प्रविधि',
      text: isEnglish
        ? 'Our diagnostic and treatment services are supported by imaging, laboratory testing, emergency response, and monitored inpatient care. Explore Our Services for the current clinical offering.'
        : 'हाम्रा निदान र उपचार सेवा इमेजिङ, प्रयोगशाला परीक्षण, आपतकालीन प्रतिक्रिया र निगरानीयुक्त आन्तरिक सेवाले सहयोग गर्छन्। हालको सेवा सूचीका लागि हाम्रा सेवाहरू हेर्नुहोस्।',
    },
    'opd-services': {
      eyebrow: isEnglish ? 'OPD' : 'OPD',
      title: isEnglish ? 'Outpatient Department services' : 'बाह्य रोगी विभाग सेवाहरू',
      text: isEnglish
        ? 'OPD is open Sunday to Friday for routine consultations, follow-ups, and minor procedures. Phone the hospital to book a visit, or use Find a Doctor to choose a specialist.'
        : 'OPD आइतबारदेखि शुक्रबारसम्म नियमित परामर्श, फलो-अप र साना प्रक्रियाका लागि खुला छ। भेटघाटका लागि अस्पताललाई फोन गर्नुहोस् वा डाक्टर खोज्नुहोस् प्रयोग गर्नुहोस्।',
    },
  };

  const content = pages[pageKey] || pages.blogs;

  return (
    <section className="section about-page simple-info-page">
      <div className="container about-hero-grid">
        <div className="about-hero-copy">
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>{content.title}</h1>
          <p className="about-hero-text">{content.text}</p>
        </div>
      </div>
    </section>
  );
}

export default SimpleInfoPage;
