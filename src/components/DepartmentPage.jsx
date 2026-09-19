import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import doctor1Image from '../../image/dr1.webp';
import doctor2Image from '../../image/dr2.webp';
import doctor3Image from '../../image/dr3.webp';
import doctor4Image from '../../image/dr4.webp';
import doctor5Image from '../../image/dr5.webp';
import service1Image from '../../image/ourservice1.webp';
import service2Image from '../../image/ourservice2.webp';
import service3Image from '../../image/ourservice3.webp';
import service4Image from '../../image/ourservice4.webp';
import service5Image from '../../image/ourservice5.webp';
import service6Image from '../../image/ourservice6.webp';
import interior10Image from '../../image/Interior Exploration (10).webp';
import interior15Image from '../../image/Interior Exploration (15).webp';
import interior2Image from '../../image/Interior Exploration (2).webp';
import interior20Image from '../../image/Interior Exploration (20).webp';
import interior25Image from '../../image/Interior Exploration (25).webp';
import interior30Image from '../../image/Interior Exploration (30).webp';
import bannerImage from '../../image/Banner.webp';
import bannerImage2 from '../../image/Banner_1.webp';
import bannerMobile from '../../image/banner_mobile.webp';
import banner1Mobile from '../../image/banner_1_mobile.webp';
import whyImage from '../../image/whytochooseus.webp';
import whyImage1 from '../../image/whytochooseus1.webp';
import whyImage2 from '../../image/whytochooseus2.webp';
import overlay0Image from '../../image/overlay_bg.webp';
import overlay1Image from '../../image/overlay_bg0.webp';
import overlay2Image from '../../image/overlay_bg1.webp';
import overlay3Image from '../../image/overlay_bg2.webp';
import overlay4Image from '../../image/overlay_bg3.webp';
import footerOverlayImage from '../../image/footer_overlay.webp';
import whatsappProfileImage from '../../image/whatsapp_profile.webp';
import heroVisualImage from '../../image/emergency_dep.webp';

const normalizeDepartmentSlug = (value = '') =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const departmentData = [
  {
    id: 'department-01',
    number: '01',
    title: 'Emergency Department',
    specialty: '24/7 Emergency Services',
    description: 'Round-the-clock emergency medical services for acute illness, trauma, and urgent stabilization.',
    highlights: ['Continuous Monitoring', 'Acute Care Support', 'Rapid Diagnostics'],
    image: interior15Image,
    imageAlt: 'Emergency department providing round-the-clock medical services',
  },
  {
    id: 'department-29',
    number: '29',
    title: 'Obstetrics & Gynaecology',
    specialty: "Women's Health & Maternity",
    description: 'Specialized care for women, maternity, and gynecological services.',
    highlights: ['Antenatal Care', 'Delivery Services', 'Postnatal Support'],
    image: doctor4Image,
    imageAlt: 'Obstetrics and gynaecology services',
  },
  {
    id: 'department-02',
    number: '02',
    title: 'Burn & Plastic Surgery',
    specialty: 'Burn Care & Reconstruction',
    description: 'Specialized care for burn treatment and reconstructive surgery with advanced wound rehabilitation and scar management.',
    highlights: ['Burn Treatment', 'Reconstructive Surgery', 'Wound Care'],
    image: service1Image,
    imageAlt: 'Burn care and reconstructive surgery environment',
  },
  {
    id: 'department-03',
    number: '03',
    title: 'Cardiology',
    specialty: 'Heart & Cardiovascular Care',
    description: 'Comprehensive heart care and cardiac treatment services for rhythm, artery, and heart failure conditions.',
    highlights: ['Cardiac Consultation', 'Heart Diagnostics', 'Cardiac Care'],
    image: service2Image,
    imageAlt: 'Cardiology consultation with patient and diagnostic equipment',
  },
  {
    id: 'department-04',
    number: '04',
    title: 'Chest Physician',
    specialty: 'Respiratory & Chest Care',
    description: 'Expert care for chest and respiratory conditions, from asthma to chronic lung disease.',
    highlights: ['Respiratory Consultation', 'Chest Evaluation', 'Respiratory Care'],
    image: service3Image,
    imageAlt: 'Respiratory specialist conducting a chest examination',
  },
  {
    id: 'department-05',
    number: '05',
    title: 'Dental Department',
    specialty: 'Dental & Oral Care',
    description: 'General and specialized dental care services for preventive, restorative, and cosmetic oral health.',
    highlights: ['Dental Consultation', 'Preventive Dental Care', 'Specialized Dental Treatment'],
    image: service4Image,
    imageAlt: 'Dental professional reviewing oral health with a patient',
  },
  {
    id: 'department-06',
    number: '06',
    title: 'Dermatology & Venereology',
    specialty: 'Skin & Related Conditions',
    description: 'Care for skin, hair, and sexually transmitted conditions using evidence-based dermatological treatment.',
    highlights: ['Skin Consultation', 'Dermatological Treatment', 'Venereology Care'],
    image: service5Image,
    imageAlt: 'Dermatologist examining a patient’s skin condition',
  },
  {
    id: 'department-07',
    number: '07',
    title: 'Dietitian',
    specialty: 'Nutrition & Wellness',
    description: 'Personalized nutrition and diet planning support for recovery, disease management, and healthy living.',
    highlights: ['Nutrition Consultation', 'Personalized Diet Planning', 'Wellness Guidance'],
    image: service6Image,
    imageAlt: 'Dietitian consulting on nutrition and wellness planning',
  },
  {
    id: 'department-08',
    number: '08',
    title: 'Cardiovascular Surgery',
    specialty: 'Heart & Vascular Surgery',
    description: 'Advanced surgical care for heart and vascular conditions, including bypass and arterial repair.',
    highlights: ['Surgical Planning', 'Vascular Repair', 'Postoperative Care'],
    image: interior30Image,
    imageAlt: 'Cardiovascular surgical environment and specialist team',
  },
  {
    id: 'department-09',
    number: '09',
    title: 'Emergency',
    specialty: 'Urgent Response Care',
    description: 'Immediate response for urgent medical needs with rapid triage and stabilization.',
    highlights: ['Rapid Triage', 'Critical Stabilization', 'Emergency Monitoring'],
    image: interior25Image,
    imageAlt: 'Emergency medical team ready for urgent response care',
  },
  {
    id: 'department-10',
    number: '10',
    title: 'Endocrinology',
    specialty: 'Hormonal & Metabolic Care',
    description: 'Treatment for hormone and metabolic disorders, including diabetes and thyroid care.',
    highlights: ['Hormone Evaluation', 'Metabolic Assessment', 'Chronic Condition Support'],
    image: interior10Image,
    imageAlt: 'Endocrinology consultation focused on metabolic and hormonal health',
  },
  {
    id: 'department-11',
    number: '11',
    title: 'ENT Surgery',
    specialty: 'Ear, Nose & Throat Care',
    description: 'Specialized treatment for ear, nose, and throat conditions with surgical and medical options.',
    highlights: ['ENT Evaluation', 'Surgical Consultation', 'Reconstructive Care'],
    image: interior20Image,
    imageAlt: 'ENT specialist evaluating ear, nose, and throat health',
  },
    {
    id: 'department-12',
    number: '12',
    title: 'Gastro Medicine',
    specialty: 'Digestive & GI Care',
    description: 'Specialized care for digestive and gastrointestinal conditions, including reflux and IBS.',
    highlights: ['GI Consultation', 'Digestive Diagnostics', 'Treatment Planning'],
    image: { desktop: bannerImage, mobile: bannerMobile },
    imageAlt: 'Gastrointestinal consultation in a clinical setting',
  },
  {
    id: 'department-13',
    number: '13',
    title: 'Gastro Surgery',
    specialty: 'Surgical Digestive Care',
    description: 'Surgical care for gastrointestinal disorders with advanced perioperative support.',
    highlights: ['Preoperative Assessment', 'GI Surgery', 'Postoperative Recovery'],
    image: whyImage,
    imageAlt: 'Surgical team preparing for gastrointestinal surgery',
  },
  {
    id: 'department-14',
    number: '14',
    title: 'General Medicine',
    specialty: 'Primary Care Medicine',
    description: 'Primary care for common illnesses and long-term wellness, including early diagnosis and prevention.',
    highlights: ['Routine Consultation', 'Chronic Disease Management', 'Preventive Care'],
    image: whyImage1,
    imageAlt: 'General medicine consultation with a physician and patient',
  },
  {
    id: 'department-15',
    number: '15',
    title: 'Maxillofacial Surgery',
    specialty: 'Jaw & Facial Surgery',
    description: 'Specialized surgical care for jaw, face, and oral conditions, including trauma and reconstruction.',
    highlights: ['Facial Reconstruction', 'Oral Surgery', 'Trauma Care'],
    image: whyImage2,
    imageAlt: 'Maxillofacial surgical consultation in a clinical environment',
  },
  {
    id: 'department-16',
    number: '16',
    title: 'Nephrology',
    specialty: 'Kidney & Renal Care',
    description: 'Care for kidney and related renal conditions, including dialysis planning and chronic kidney disease.',
    highlights: ['Kidney Evaluation', 'Renal Monitoring', 'Fluid Balance Management'],
    image: doctor1Image,
    imageAlt: 'Nephrology consultation focused on kidney health',
  },
  {
    id: 'department-17',
    number: '17',
    title: 'Neuropsychiatry',
    specialty: 'Neurological & Psychiatric Care',
    description: 'Integrated care for neurological and psychiatric needs with coordinated diagnosis and treatment.',
    highlights: ['Behavioral Assessment', 'Neurological Evaluation', 'Care Coordination'],
    image: doctor2Image,
    imageAlt: 'Integrated neuropsychiatry consultation for brain and mental health',
  },
  {
    id: 'department-18',
    number: '18',
    title: 'Neurosurgery',
    specialty: 'Brain & Spine Surgery',
    description: 'Specialized surgical care for the brain and nervous system, including spine and trauma procedures.',
    highlights: ['Neurosurgical Planning', 'Spinal Surgery', 'Postoperative Support'],
    image: doctor3Image,
    imageAlt: 'Neurosurgical environment with a specialist team',
  },
  {
    id: 'department-19',
    number: '19',
    title: 'Ophthalmology',
    specialty: 'Eye & Vision Care',
    description: 'Eye care, vision correction, and retinal services for clear, healthy sight.',
    highlights: ['Vision Assessment', 'Retinal Diagnostics', 'Sight Correction'],
    image: doctor4Image,
    imageAlt: 'Ophthalmology examination for eye and vision health',
  },
  {
    id: 'department-20',
    number: '20',
    title: 'Orthopaedic Surgery',
    specialty: 'Musculoskeletal Care',
    description: 'Expert care for bones, joints, and musculoskeletal conditions with surgical and rehabilitative support.',
    highlights: ['Orthopaedic Assessment', 'Joint Treatment', 'Rehabilitation Support'],
    image: doctor5Image,
    imageAlt: 'Orthopaedic consultation for joint and bone care',
  },
  {
    id: 'department-21',
    number: '21',
    title: 'Pain Physician',
    specialty: 'Pain Management',
    description: 'Treatment for chronic and acute pain conditions with tailored intervention and recovery planning.',
    highlights: ['Pain Evaluation', 'Interventional Support', 'Recovery Planning'],
    image: overlay0Image,
    imageAlt: 'Pain management consultation in a calm clinical setting',
  },
  {
    id: 'department-22',
    number: '22',
    title: 'Pediatrics',
    specialty: 'Child & Family Care',
    description: 'Dedicated care for infants, children, and adolescents with compassionate family-centered treatment.',
    highlights: ['Pediatric Consultation', 'Child Wellness', 'Family Guidance'],
    image: overlay1Image,
    imageAlt: 'Pediatric consultation featuring child-focused care',
  },
  {
    id: 'department-23',
    number: '23',
    title: 'Physician Gastroenterology',
    specialty: 'Digestive & Liver Medicine',
    description: 'Medical management for digestive and liver disorders with specialist-led follow-up care.',
    highlights: ['GI Evaluation', 'Liver Assessment', 'Medical Treatment'],
    image: overlay2Image,
    imageAlt: 'Gastroenterology consultation for digestive health',
  },
  {
    id: 'department-24',
    number: '24',
    title: 'Physician Department',
    specialty: 'Comprehensive Clinical Care',
    description: 'Comprehensive physician-led clinical care services for ongoing wellness and coordinated treatment.',
    highlights: ['Primary Consultation', 'Ongoing Care', 'Specialist Referral'],
    image: overlay3Image,
    imageAlt: 'Physician-led clinical consultation for comprehensive care',
  },
  {
    id: 'department-25',
    number: '25',
    title: 'Psychiatry',
    specialty: 'Mental Health Care',
    description: 'Mental health assessment and treatment services for emotional well-being and recovery.',
    highlights: ['Psychiatric Evaluation', 'Therapeutic Support', 'Care Planning'],
    image: footerOverlayImage,
    imageAlt: 'Psychiatry consultation in a calm healthcare environment',
  },
  {
    id: 'department-26',
    number: '26',
    title: 'Radiology',
    specialty: 'Imaging & Diagnostic Care',
    description: 'Advanced imaging and diagnostic radiology services for fast, accurate clinical insight.',
    highlights: ['Imaging Diagnostics', 'Radiology Review', 'Diagnostic Support'],
    image: whatsappProfileImage,
    imageAlt: 'Radiology imaging equipment in a clinical environment',
  },
  {
    id: 'department-27',
    number: '27',
    title: 'General Surgery',
    specialty: 'Comprehensive Surgical Care',
    description: 'Comprehensive surgical care across general conditions with expert operative and recovery support.',
    highlights: ['Surgical Evaluation', 'Operative Care', 'Recovery Support'],
    image: { desktop: bannerImage2, mobile: banner1Mobile },
    imageAlt: 'General surgery consultation and operating environment',
  },
  {
    id: 'department-28',
    number: '28',
    title: 'Urosurgery',
    specialty: 'Urological Surgical Care',
    description: 'Specialized surgical care for urinary and reproductive tract conditions with advanced minimally invasive treatment.',
    highlights: ['Urological Evaluation', 'Surgical Planning', 'Postoperative Care'],
    image: heroVisualImage,
    imageAlt: 'Urosurgery consultation in a surgical healthcare setting',
  },
];

function DepartmentPage({ language = 'en', selectedDepartmentSlug = '' }) {
  const departmentNavRef = useRef(null);
  const sectionRefs = useRef([]);
  const [activeSection, setActiveSection] = useState(departmentData[0].id);
  const [visibleSections, setVisibleSections] = useState([departmentData[0].id, departmentData[1]?.id].filter(Boolean));
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 640 : false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleScrollToNavigation = () => {
    departmentNavRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleNavClick = (id) => {
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((entry) => entry.isIntersecting);
        if (!intersecting.length) return;

        const nearest = intersecting.reduce((current, next) =>
          Math.abs(current.boundingClientRect.top) < Math.abs(next.boundingClientRect.top) ? current : next
        );

        const visibleId = nearest.target.dataset.id;
        setActiveSection(visibleId);
        setVisibleSections((previous) => (previous.includes(visibleId) ? previous : [...previous, visibleId]));
      },
      {
        rootMargin: '-40% 0px -55% 0px',
        threshold: 0.2,
      }
    );

    sectionRefs.current.forEach((section) => section && observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!selectedDepartmentSlug) return;

    const matchingDepartment = departmentData.find(
      (department) => normalizeDepartmentSlug(department.title) === selectedDepartmentSlug
    );

    if (!matchingDepartment) return;

    const section = document.getElementById(matchingDepartment.id);
    if (!section) return;

    const offset = 120;
    const top = section.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
    setActiveSection(matchingDepartment.id);
  }, [selectedDepartmentSlug]);

  const departmentNavigation = useMemo(
    () => departmentData.map((department) => ({ id: department.id, title: department.title })),
    []
  );

  return (
    <article className="department-page">
      <section className="department-hero section">
        <div className="department-hero-image-frame">
          <img src={heroVisualImage} alt="Healthcare specialist in a premium consultation environment" loading="eager" />
          <div className="department-hero-overlay">
            <div className="container department-hero-content">
              <span className="eyebrow department-hero-eyebrow">OUR DEPARTMENTS</span>
              <h1>Expert Care Across Every Specialty</h1>
              <p>
                Explore our specialized medical departments and discover comprehensive care delivered by experienced
                healthcare professionals.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="department-list section" aria-label="Hospital department sections">
        {departmentData.map((department, index) => {
          const reverse = index % 2 === 1;
          const isVisible = visibleSections.includes(department.id);
          const imgSrc = typeof department.image === 'object' ? (isMobile ? department.image.mobile : department.image.desktop) : department.image;
          return (
              <section
                key={department.id}
                id={department.id}
                data-id={department.id}
                ref={(el) => {
                  sectionRefs.current[index] = el;
                }}
                className={`department-section ${reverse ? 'reverse' : ''} ${isVisible ? 'is-visible' : ''}`}
              >
                <div className="department-section-copy">
                  <div className="department-number-label">
                    <span className="department-number">{department.number}</span>
                    <span className="department-label">Department {department.number}</span>
                  </div>
                  <h2>{department.title}</h2>
                  <p className="department-specialty">{department.specialty}</p>
                  <p className="department-description">{department.description}</p>
                  <ul className="department-highlights" aria-label={`Key services in ${department.title}`}>
                    {department.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </div>
                <div className="department-section-image">
                  <div className="department-image-frame">
                    <img src={imgSrc} alt={department.imageAlt} loading="lazy" />
                  </div>
                </div>
              </section>
            );
          })}
      </section>

      <section className="department-cta section" aria-labelledby="department-cta-heading">
        <div className="container department-cta-panel">
          <div>
            <p className="eyebrow">Need guidance?</p>
            <h2 id="department-cta-heading">Not Sure Which Department You Need?</h2>
            <p>
              Our healthcare team can help guide you to the right department and specialist for your needs.
            </p>
          </div>
          <div className="department-cta-actions">
            <a className="primary-button" href="#doctors">
              Find a Doctor <ArrowRight size={16} />
            </a>
            <a className="secondary-button" href="#contact">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </article>
  );
}

export default DepartmentPage;
