import { ArrowRight, Award, HeartHandshake, Layers, Sparkles, Users } from 'lucide-react';
import whyToChooseUsImage from '../../image/whytochooseus.jpg';
import whyToChooseUsImage1 from '../../image/whytochooseus1.jpg';
import whyToChooseUsImage2 from '../../image/whytochooseus2.jpg';

function AboutPage({ language, onBack }) {
  const isEnglish = language === 'en';

  const getYearsOfService = () => {
    const startDate = new Date('1995-08-11T00:00:00');
    const now = new Date();
    let years = now.getFullYear() - startDate.getFullYear();
    const anniversaryThisYear = new Date(now.getFullYear(), startDate.getMonth(), startDate.getDate());

    if (now < anniversaryThisYear) {
      years -= 1;
    }

    return Math.max(30, years);
  };

  const content = {
    heroEyebrow: isEnglish ? 'About Vinayak Hospital' : 'विनायक अस्पतालको बारेमा',
    heroTitle: isEnglish
      ? 'Care that combines clinical excellence with a compassionate, family-first approach.'
      : 'नैतिक हेरचाह जसले कानूनी उत्कृष्टता र परिवार-केंद्रित संवेदनशीलतालाई एकसाथ ल्याउँछ।',
    heroText: isEnglish
      ? 'Vinayak Hospital is a trusted local healthcare partner, delivering maternity, emergency, diagnostics, and wellness care with warmth, clarity, and reliability.'
      : 'विनायक अस्पताल एक विश्वसनीय स्वास्थ्य साझेदार हो, जुन मातृत्व, आपतकालीन, निदान र स्वास्थ्य सेवामा न्यानोपन, स्पष्टता र भरोसेमंदतालाई प्राथमिकतामा राख्छ।',
    highlights: isEnglish
      ? [
          {
            icon: Award,
            title: 'Trusted care',
            text: 'Years of experience supporting families through every stage of care.',
          },
          {
            icon: Users,
            title: 'Patient-centered',
            text: 'Respectful communication, clear guidance, and attention to personal needs.',
          },
          {
            icon: Sparkles,
            title: 'Modern facilities',
            text: 'Advanced diagnostics, comfortable treatment spaces, and rapid response services.',
          },
        ]
      : [
          {
            icon: Award,
            title: 'विश्वसनीय सेवा',
            text: 'हरेक रोगी र परिवारलाई अनुभव र भरोसा सहित सहयोग।',
          },
          {
            icon: Users,
            title: 'रोगी-केंद्रित',
            text: 'सम्मानजनक संवाद, स्पष्ट मार्गदर्शन र व्यक्तिगत आवश्यकताको ध्यान।',
          },
          {
            icon: Sparkles,
            title: 'आधुनिक सुविधा',
            text: 'उन्नत निदान, आरामदायी उपचार स्थान र छिटो प्रतिक्रिया सेवा।',
          },
        ],
    values: isEnglish
      ? [
          { title: 'Compassion', description: 'We treat every family with empathy and care.' },
          { title: 'Safety', description: 'Clinical standards that protect patients at every step.' },
          { title: 'Clarity', description: 'Honest communication and transparent care guidance.' },
        ]
      : [
          { title: 'सहानुभूति', description: 'हामी प्रत्येक परिवारलाई संवेदना र आत्मीयतासाथ हेर्छौं।' },
          { title: 'सुरक्षा', description: 'हरेक कदममा बिरामीलाई सुरक्षित राख्ने क्लिनिकल मापदण्डहरू।' },
          { title: 'स्पष्टता', description: 'ईमानदार संवाद र पारदर्शी हेरचाह निर्देशन।' },
        ],
    storyTitle: isEnglish
      ? 'A family of care built for your peace of mind.'
      : 'तपाईंको मनको शान्तिका लागि निर्माण गरिएको हेरचाह परिवार।',
    storyText: isEnglish
      ? 'At Vinayak, our team brings together specialists from maternity, pediatrics, general medicine, and emergency care to provide coordinated support, clear decisions, and compassionate follow-up for every patient.'
      : 'विनायकमा हाम्रो टीमले मातृत्व, बालचिकित्सा, सामान्य चिकित्सा र आपतकालीन हेरचाहका विशेषज्ञहरूलाई सँगै ल्याएर समन्वित सहयोग, स्पष्ट निर्णय र प्रत्येक बिरामीको लागि संवेदनशील पछिल्लो ध्यान प्रदान गर्छ।',
    stats: isEnglish
      ? [
          { value: '24/7', label: 'Emergency support' },
          { value: `${getYearsOfService()}+`, label: 'Years of service' },
          { value: '50,000+', label: 'Families cared for' },
        ]
      : [
          { value: '२४/७', label: 'आपतकालीन सहयोग' },
          { value: `${getYearsOfService()}+`, label: 'सेवाको वर्ष' },
          { value: '५०,०००+', label: 'संरक्षण गरिएका परिवार' },
        ],
    backLabel: isEnglish ? 'Back to Home' : 'घरमा फर्कनुहोस्',
  };

  return (
    <section className="section about-page">
      <div className="container about-hero-grid">
        <div className="about-hero-copy reveal">
          <p className="eyebrow">{content.heroEyebrow}</p>
          <h1>{content.heroTitle}</h1>
          <p className="about-hero-text">{content.heroText}</p>
          <div className="about-hero-actions" />
        </div>

        <div className="about-hero-visual reveal">
          <div className="about-hero-photo-shell">
            <img src={whyToChooseUsImage} alt="About Vinayak Hospital" />
          </div>
        </div>
      </div>

      <div className="container about-focus-grid reveal">
        {content.highlights.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="about-focus-card">
              <div className="about-focus-icon">
                <Icon size={24} />
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          );
        })}
      </div>

      <div className="container about-story-grid reveal">
        <div className="about-story-copy">
          <p className="eyebrow">{isEnglish ? 'Our story' : 'हाम्रो कथा'}</p>
          <h2>{content.storyTitle}</h2>
          <p>{content.storyText}</p>
        </div>
        <div className="about-story-images">
          <div className="about-story-image-large">
            <img src={whyToChooseUsImage1} alt="Hospital care team" />
          </div>
        </div>
      </div>

      <div className="container about-values-grid reveal">
        {content.values.map((value) => (
          <article key={value.title} className="about-value-card">
            <strong>{value.title}</strong>
            <p>{value.description}</p>
          </article>
        ))}
      </div>

      <div className="container about-stats-grid reveal">
        {content.stats.map((stat) => (
          <div key={stat.label} className="about-stat-card">
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AboutPage;
