import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

function SuggestionPage({ language, onBack }) {
  const isEnglish = language === 'en';
  const content = isEnglish
    ? {
        title: 'Share your suggestion',
        subtitle: 'We value your feedback, ideas, and concerns. Let us know how we can make your experience even better.',
        intro: 'Your suggestions help us improve care, communication, and comfort for every patient and visitor.',
        name: 'Full name',
        email: 'Email address',
        phone: 'Phone number',
        category: 'Suggestion topic',
        message: 'Your suggestion',
        categories: ['General feedback', 'Service improvement', 'Facility experience', 'Other'],
        placeholderName: 'Enter your full name',
        placeholderEmail: 'Enter your email',
        placeholderPhone: 'Enter your phone number',
        placeholderMessage: 'Share your idea or concern',
        button: 'Send suggestion',
        back: 'Back to home',
        successTitle: 'Suggestion received',
        successText: 'Thank you for helping us improve our services.',
      }
    : {
        title: 'आफ्नो सुझाव साझा गर्नुहोस्',
        subtitle: 'हामी तपाईंको प्रतिक्रिया, विचार र चिन्ता मानेका छौं। तपाईंको अनुभव अझ राम्रो बनाउन हामीलाई कस्तो सहयोग चाहियो भन्ने बताउनुहोस्।',
        intro: 'तपाईंका सुझावहरूले हरेक बिरामी र आगन्तुकका लागि सेवा, सञ्चार र आराम सुधार गर्न मद्दत गर्छ।',
        name: 'पुरा नाम',
        email: 'इमेल ठेगाना',
        phone: 'फोन नम्बर',
        category: 'सुझावको विषय',
        message: 'तपाईंको सुझाव',
        categories: ['साधारण प्रतिक्रिया', 'सेवा सुधार', 'सुविधा अनुभव', 'अन्य'],
        placeholderName: 'आफ्नो पूरा नाम लेख्नुहोस्',
        placeholderEmail: 'आफ्नो इमेल लेख्नुहोस्',
        placeholderPhone: 'आफ्नो फोन नम्बर लेख्नुहोस्',
        placeholderMessage: 'आफ्नो विचार वा चिन्ता साझा गर्नुहोस्',
        button: 'सुझाव पठाउनुहोस्',
        back: 'घर फर्कनुहोस्',
        successTitle: 'सुझाव प्राप्त भयो',
        successText: 'हाम्रो सेवाहरू सुधार गर्न सहयोग गर्नुभएकोमा धन्यवाद।',
      };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: content.categories[0],
    message: '',
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name || !formData.phone || !formData.message) {
      Swal.fire({
        icon: 'warning',
        title: isEnglish ? 'Incomplete details' : 'थप विवरण चाहिन्छ',
        text: isEnglish
          ? 'Please provide your name, phone number, and suggestion before sending.'
          : 'कृपया सुझाव पठाउनु अघि आफ्नो नाम, फोन नम्बर र सुझाव दिनुहोस्।',
        confirmButtonColor: '#e03328',
      });
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          category: formData.category,
          source_url: window.location.href,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Unable to save suggestion.');
      }

      Swal.fire({
        icon: 'success',
        title: content.successTitle,
        text: content.successText,
        confirmButtonColor: '#151e5a',
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        category: content.categories[0],
        message: '',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: isEnglish ? 'Could not send suggestion' : 'सुझाव पठाउन सकिएन',
        text: error.message || 'Please try again in a moment.',
        confirmButtonColor: '#151e5a',
      });
    }
  };

  return (
    <section className="section suggestion-page">
      <div className="container suggestion-shell">
        <div className="suggestion-card reveal">
          {/* Back button intentionally removed per UX requirement */}

          <div className="suggestion-intro">
            <h1>{content.title}</h1>
            <p>{content.subtitle}</p>
            <p className="suggestion-intro-note">{content.intro}</p>
          </div>

          <div className="suggestion-content-grid">
            <form className="suggestion-form" onSubmit={handleSubmit}>
              <div className="suggestion-form-columns">
                <div className="suggestion-form-column">
                  <label>
                    <span>{content.name}</span>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder={content.placeholderName} />
                  </label>

                  <label>
                    <span>{content.email}</span>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder={content.placeholderEmail} />
                  </label>

                  <label>
                    <span>{content.phone}</span>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder={content.placeholderPhone} />
                  </label>

                  <label>
                    <span>{content.category}</span>
                    <select name="category" value={formData.category} onChange={handleChange}>
                      {content.categories.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="suggestion-form-column suggestion-form-column-right">
                  <label className="suggestion-message-field">
                    <span>{content.message}</span>
                    <textarea name="message" value={formData.message} onChange={handleChange} placeholder={content.placeholderMessage} rows="8" />
                  </label>

                  <button type="submit" className="btn btn-primary full-width">
                    {content.button}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SuggestionPage;
