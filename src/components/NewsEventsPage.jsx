import { CalendarDays, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import nepaliDates from '../../data/nepali_dates.json';

function parseDateToBs(dateString) {
  if (!dateString) {
    return 'Date unavailable';
  }

  const raw = String(dateString).trim();
  if (!raw) {
    return 'Date unavailable';
  }

  const iso = raw.length === 10 && raw[4] === '-' && raw[7] === '-'
    ? raw
    : raw;

  return nepaliDates[iso] || iso || 'Date unavailable';
}

function NewsEventsPage({ language = 'en', galleryImages = [], galleryVideos = [] }) {
  const isEnglish = language === 'en';

  const content = isEnglish
    ? {
        title: 'News & Events',
        subtitle: 'Hospital updates, wellness drives, and community care moments.',
        items: [
          {
            type: 'News',
            title: 'Vinayak Hospital launches free maternal health awareness camp',
            date: '12 August 2026',
            location: 'Main Hospital Hall',
            text: 'A community-focused health camp was organized to support pregnant mothers with screening, consultations, and awareness on safe delivery practices.',
            accent: 'blue',
          },
          {
            type: 'Event',
            title: 'Annual blood donation drive for emergency preparedness',
            date: '24 August 2026',
            location: 'Hospital Campus',
            text: 'Our team is organizing a city-wide blood donation campaign to strengthen emergency medical support and strengthen community care.',
            accent: 'red',
          },
          {
            type: 'News',
            title: 'New pediatric consultation services now available',
            date: '05 September 2026',
            location: 'Pediatrics Wing',
            text: 'Parents can now access extended pediatric consultation hours for routine checkups, immunization guidance, and newborn care counselling.',
            accent: 'green',
          },
          {
            type: 'Event',
            title: 'Free community wellness screening drive',
            date: '18 September 2026',
            location: 'Outpatient Plaza',
            text: 'A dedicated screening camp is being arranged to support early diagnosis, preventive care education, and community wellness outreach.',
            accent: 'red',
          },
          {
            type: 'News',
            title: 'New physiotherapy and rehab consultations open this month',
            date: '28 September 2026',
            location: 'Rehabilitation Unit',
            text: 'Patients can now access streamlined therapy sessions for post-surgery recovery, mobility support, and guided rehabilitation planning.',
            accent: 'blue',
          },
        ],
        mediaHeading: 'Gallery',
        videoHeading: 'Videos',
      }
    : {
        title: 'समाचार र कार्यक्रम',
        subtitle: 'अस्पताल समाचार, स्वास्थ्य अभियान, र समुदाय सेवा सम्बन्धी गतिविधिहरू।',
        items: [
          {
            type: 'समाचार',
            title: 'विनायक अस्पतालले निःशुल्क मातृत्व स्वास्थ्य जागरूकता शिविर प्रारम्भ गर्यो',
            date: '१२ अगस्त २०८३',
            location: 'मुख्य अस्पताल हल',
            text: 'गर्भवती mothers लाई परीक्षण, सल्लाह, र सुरक्षित प्रसूति अभ्यासबारे जानकारीका लागि समुदायमै आधारित शिविर आयोजना गरिएको थियो।',
            accent: 'blue',
          },
          {
            type: 'कार्यक्रम',
            title: 'आपतकालीन तयारीका लागि वार्षिक रगत दान अभियान',
            date: '२४ अगस्त २०८३',
            location: 'अस्पताल परिसर',
            text: 'हामीले आपतकालीन स्वास्थ्य सेवा सहयोगलाई सुदृढ गर्न शहरव्यापी रगत दान अभियान आयोजना गर्दैछौं।',
            accent: 'red',
          },
          {
            type: 'समाचार',
            title: 'नयाँ बाल रोग सल्लाह सेवा उपलब्ध',
            date: '०५ सेप्टेम्बर २०८३',
            location: 'बाल रोग शाखा',
            text: 'अभिभावकहरूले नियमित जाँच, खोपबारे सल्लाह, र नवजात बच्चाको हेरचाहका लागि विस्तारित सेवा अब लिन सक्नेछन्।',
            accent: 'green',
          },
          {
            type: 'कार्यक्रम',
            title: 'स्वास्थ्य-जागरूकता निःशुल्क परामर्श शिविर',
            date: '१८ सेप्टेम्बर २०८३',
            location: 'बहिरंग पंजीकरण क्षेत्र',
            text: 'सक्रिय परीक्षण, रोकथाम सेवा शिक्षा, र सामुदायिक स्वास्थ्यमै केन्द्रित अर्को शिविर आयोजना गरिनेछ।',
            accent: 'red',
          },
          {
            type: 'समाचार',
            title: 'नयाँ फिजियोथेरेपी र पुनर्वास परामर्श सेवा सुरु',
            date: '२८ सेप्टेम्बर २०८३',
            location: 'पुनर्वास इकाई',
            text: 'सर्जरी पछि पुनर्प्राप्ति, गतिशीलता सहयोग, र निर्देशनात्मक पुनर्वास योजनाका लागि अब सहज थेरापी सेवा उपलब्ध छ।',
            accent: 'blue',
          },
        ],
        mediaHeading: 'ग्यालरी',
        videoHeading: 'भिडियोहरू',
      };

  const [cards, setCards] = useState(content.items);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    fetch('/api/news-events')
      .then((response) => response.ok ? response.json() : { news_events: [] })
      .then((data) => {
        const apiEvents = (data.news_events || []).map((item) => ({
          type: item.event_type || 'News',
          title: item.title || 'News & Event',
          date: parseDateToBs(item.event_date),
          location: item.location || 'Hospital',
          text: item.description || '',
          image: item.image_url || '',
          accent: item.event_type === 'Event' ? 'red' : item.event_type === 'News' ? 'blue' : 'green',
        }));

        if (apiEvents.length > 0) {
          setCards(apiEvents);
        }
      })
      .catch(() => {
        setCards(content.items);
      });
  }, [content.items]);

  return (
    <section className="section suggestion-page news-events-page">
      <div className="container suggestion-shell">
        <div className="suggestion-card reveal">
          <div className="suggestion-intro">
            <h1>{content.title}</h1>
            <p>{content.subtitle}</p>
          </div>

          <div className="news-events-grid">
            {cards.map((item, index) => (
              <article key={`${item.title}-${item.date}-${index}`} className={`news-event-card news-event-card--${item.accent}`}>
                <div className="news-event-type">{item.type}</div>
                <h2>{item.title}</h2>
                <div className="news-event-meta">
                  <span>
                    <CalendarDays size={15} />
                    {item.date}
                  </span>
                  <span>
                    <MapPin size={15} />
                    {item.location}
                  </span>
                </div>
                {item.image && (
                  <div className="news-event-image-wrap">
                    <img className="news-event-image" src={item.image} alt={item.title} />
                  </div>
                )}
                <p>{item.text}</p>
              </article>
            ))}
          </div>

          {galleryImages.length > 0 && (
            <div className="news-events-media-block">
              <h2>{content.mediaHeading}</h2>
              <div className="news-events-media-grid">
                {galleryImages.slice(0, 6).map((image, index) => (
                  <div key={`${image.src}-${index}`} className="news-events-media-card">
                    <img src={image.src} alt={image.alt || 'Hospital gallery image'} />
                    {(image.header || image.alt) && (
                      <div className="news-events-media-card-header">{image.header || image.alt}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {galleryVideos.length > 0 && (
            <div className="news-events-media-block">
              <h2>{content.videoHeading}</h2>
              <div className="news-events-video-grid">
                {galleryVideos.slice(0, 4).map((video, index) => (
                  <div key={`${video.title || 'video'}-${index}`} className="news-events-video-card">
                    {video.embedUrl ? (
                      /\.(mp4|webm|ogg|ogv|mov|m4v|avi|mkv)(\?.*)?$/i.test(video.embedUrl) ? (
                        <video src={video.embedUrl} controls playsInline preload="metadata" style={{ width: '100%', height: '100%', display: 'block', background: '#000' }} />
                      ) : (
                        <iframe
                          title={video.title || `Hospital video ${index + 1}`}
                          src={video.embedUrl}
                          width="100%"
                          height="100%"
                          style={{ border: 'none', overflow: 'hidden' }}
                          scrolling="no"
                          frameBorder="0"
                          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="strict-origin-when-cross-origin"
                        />
                      )
                    ) : (
                      <div className="news-events-video-fallback">
                        <p>{video.fallbackText || 'Hospital video'}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default NewsEventsPage;
