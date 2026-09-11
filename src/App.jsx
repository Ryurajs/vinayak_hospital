import { useEffect, useRef, useState, Fragment } from 'react';
import gsap from 'gsap';
import DoctorProfile from './components/DoctorProfile';
import DoctorsPage from './components/DoctorsPage';
import HealthPackagesPage from './components/HealthPackagesPage';
import NewsEventsPage from './components/NewsEventsPage';
import SuggestionPage from './components/SuggestionPage';
import BoardPage from './components/BoardPage';
import AboutPage from './components/AboutPage';
import { initAppSetup } from './libs/appSetup';
import {
  Activity,
  Ambulance,
  ArrowRight,
  Baby,
  BriefcaseMedical,
  ChevronDown,
  Clock3,
  Check,
  HeartPulse,
  Mail,
  MapPin,
  Phone,
  QrCode,
  Search,
  ShieldPlus,
  Stethoscope,
  Copy,
  MessageCircle,
  ArrowUp,
  X,
} from 'lucide-react';
import footerLogo from '../image/footer_logo.svg';
import footerOverlay from '../image/footer_overlay.jpg';
import bannerImage from '../image/Banner.png';
import bannerMobileImage from '../image/banner_mobile.png';
import bannerImage2 from '../image/Banner_1.png';
import banner1Mobile from '../image/banner_1_mobile.png';
import headerLogo from '../image/header_logo.svg';
import logoAnimation from '../image/logo_animation.gif';
import boardMember1 from '../image/bod1.png';
import boardMember2 from '../image/bod2.png';
import boardMember3 from '../image/bod3.png';
import boardMember4 from '../image/bod4.png';
import boardMember5 from '../image/bod5.png';
import doctorImage from '../image/dr4.png';
// doctorFallback removed; use existing `doctor1Image` as fallback
import doctor1Image from '../image/dr1.png';
import doctor2Image from '../image/dr2.png';
import doctor3Image from '../image/dr3.png';
import doctor4Image from '../image/dr4.png';
import doctor5Image from '../image/dr5.png';
import doctor6Image from '../image/dr6.png';
import doctor7Image from '../image/dr7.png';
import doctor8Image from '../image/dr8.png';
import doctor9Image from '../image/dr9.png';
import doctor10Image from '../image/dr10.png';
import doctor11Image from '../image/dr11.png';
import doctor12Image from '../image/dr12.png';
import doctor13Image from '../image/dr13.png';
import doctor14Image from '../image/dr14.png';
import doctor15Image from '../image/dr15.png';
import doctor16Image from '../image/dr16.png';
import doctor17Image from '../image/dr17.png';
import doctor18Image from '../image/dr18.png';
import whyToChooseUsImage1 from '../image/whytochooseus1.jpg';
import whyToChooseUsImage from '../image/whytochooseus.jpg';
import whyToChooseUsImage2 from '../image/whytochooseus2.jpg';
import whatsappQrImage from '../image/whatsapp_qr.jpg';
import ourService1Image from '../image/ourservice1.jpg';
import ourService2Image from '../image/ourservice2.jpg';
import ourService3Image from '../image/ourservice3.jpg';
import ourService4Image from '../image/ourservice4.png';
import ourService5Image from '../image/ourservice5.png';
import ourService6Image from '../image/ourservice6.png';
import galleryImage1 from '../image/Interior Exploration (10).png';
import whatsappProfile from '../image/whatsapp_profile.jpg';
import englishFlagImg from '../image/english_flag.jpg';
import nepaliFlagImg from '../image/nepali_flag.png';

const englishFlag = englishFlagImg;
const nepaliFlag = nepaliFlagImg;

const getYearsServingBadge = () => {
  const startDate = new Date('1995-08-11T00:00:00');
  const now = new Date();
  let years = now.getFullYear() - startDate.getFullYear();
  const anniversaryThisYear = new Date(now.getFullYear(), startDate.getMonth(), startDate.getDate());

  if (now < anniversaryThisYear) {
    years -= 1;
  }

  return Math.max(30, years);
};

const realDoctors = [
  { name: 'USHA SHRESTHA', specialty: 'Obstetrics & Gynaecology', experience: 'Obstetrics & Gynaecology', department: 'Obstetrics & Gynaecology', image: doctor18Image },
  { name: 'Heempali Dutta', specialty: 'Ear, Nose & Throat Disorders and Surgery', experience: 'ENT Surgery', department: 'ENT Surgery', image: doctor1Image },
  { name: 'Shiva Kumar Shrestha', specialty: 'Child & Adolescent Healthcare', experience: 'Pediatrics', department: 'Pediatrics', image: doctor2Image },
  { name: 'Rajesh Chaudhary', specialty: 'Bone, Joint & Muscle Disorders', experience: 'Orthopaedic Surgery', department: 'Orthopaedic Surgery', image: doctor3Image },
  { name: 'Yam PSD. Dwa', specialty: "Women's Reproductive Health, Pregnancy & Childbirth", experience: 'Obstetrics & Gynaecology', department: 'Obstetrics & Gynaecology', image: doctor4Image },
  { name: 'Manoj Kumar Sah', specialty: 'Emergency & Acute Care', experience: 'Emergency', department: 'Emergency', image: doctor5Image },
  { name: 'Prof. Dr. Bidhan Nidhi Poudel', specialty: 'Gastrointestinal & Liver Disorders', experience: 'Gastro Medicine', department: 'Gastro Medicine', image: doctor6Image },
  { name: 'Darshan Kumar Gurung', specialty: 'Senior Cardiology & Internal Medicine', experience: 'Cardiology', department: 'Cardiology', image: doctor7Image },
  { name: 'Ram Krishna Rajbhandari', specialty: 'Skin, Hair, Nail & Related Disorders', experience: 'Dermatology & Venereology', department: 'Dermatology & Venereology', image: doctor8Image },
  { name: 'Shuvash Acharya', specialty: 'Ear, Nose & Throat Disorders and Surgery', experience: 'ENT Surgery', department: 'ENT Surgery', image: doctor9Image },
  { name: 'Prabha Gyawali', specialty: 'Oral Health & Dental Care', experience: 'Dental', department: 'Dental Department', image: doctor10Image },
  { name: 'Pralhad Chalise', specialty: 'Bone, Joint & Muscle Disorders', experience: 'Orthopaedic Surgery', department: 'Orthopaedic Surgery', image: doctor11Image },
  { name: 'Shamrant B. Baniya', specialty: 'Emergency & Trauma Care', experience: 'Emergency', department: 'Emergency', image: doctor12Image },
  { name: 'Parmeshwar Sah.', specialty: 'Urinary Tract & Male Reproductive Disorders', experience: 'Uro Surgery', department: 'Urosurgery', image: doctor13Image },
  { name: 'Manoranjan Dwa', specialty: 'General Surgical Conditions & Procedures', experience: 'General Surgery', department: 'General Surgery', image: doctor14Image },
  { name: 'MANOJ KHATRI', specialty: 'Physiotherapy', experience: 'Physiotherapist', department: 'Physiotherapy', image: doctor15Image },
  { name: 'NARAYAN BIKRAM THAPA', specialty: 'Radiology', experience: 'Radiologist', department: 'Radiology', image: doctor16Image },
  { name: 'DEEPAK SHARMA', specialty: 'Gastro Surgery', experience: 'Gastro Surgery', department: 'Gastro Surgery', image: doctor17Image },
];

const translations = {
  en: {
    languageLabel: 'English',
    languageFlag: '🇬🇧',
    nav: ['HOSPITAL OVERVIEW', 'OUR SERVICES', 'FIND A DOCTOR', 'DEPARTMENT', 'LAB REPORT', 'HEALTH PACKAGES', 'SUGGESTION', 'NEWS AND EVENTS'],
    navItems: [
      {
        label: 'HOSPITAL OVERVIEW',
        href: '#about',
        menu: [
          { title: 'ABOUT US', text: "Learn more about the hospital's mission, values, and vision." },
          { title: 'OUR DOCTORS', text: 'Meet the medical specialists behind our trusted care.' },
          { title: 'OUR SERVICES', text: 'Explore the full range of hospital care and support.' },
          { title: 'SPECIALITIES', text: 'Discover the clinical departments and focused care areas.' },
          { title: 'MEDICAL TECHNOLOGY', text: 'See the diagnostic and treatment technologies supporting care.' },
          { title: 'NEWS AND EVENTS', text: 'Stay informed about hospital milestones and upcoming programs.' },
          { title: 'BLOGS', text: 'Read helpful articles, updates, and care insights.' },
          { title: 'CAREER', text: 'Explore career opportunities and join our care team.' },
          { title: 'CONTACT US', text: 'Reach out for appointments, support, or hospital information.' },
          { title: 'ACADEMIC', text: 'View academic initiatives and learning opportunities.' },
          { title: 'Board Member', text: "Meet the leadership team guiding the hospital's vision." },
        ],
      },
      {
        label: 'OUR SERVICES',
        href: '#services',
        menu: [
          { title: 'Emergency Services', text: 'Immediate crisis support, ambulance coordination, and rapid assessment.' },
          { title: 'Pharmacy', text: 'Reliable medicines and patient guidance from experienced care staff.' },
          { title: 'Fast Ambulance', text: 'Rapid transport with on-route medical support; 24/7 ambulance service.' },
          { title: 'OPD Services', text: 'Outpatient Department services for routine consultations, follow-ups and minor procedures.' },
          { title: 'Rooms', text: 'Comfort-focused inpatient care and monitored recovery spaces.' },
          { title: 'Diagnostic Services', text: 'Accurate testing and imaging to guide faster, clearer treatment decisions.' },
        ],
      },
      {
        label: 'FIND A DOCTOR',
        href: '#doctors',
      },
      {
        label: 'DEPARTMENT',
        href: '#departments',
        menu: [
          { title: 'Obstetrics & Gynaecology', text: "Specialized care for women's health and maternity services." },
          { title: 'ENT Surgery', text: 'Specialized treatment for ear, nose, and throat conditions.' },
          { title: 'Orthopaedic Surgery', text: 'Expert care for bones, joints, and musculoskeletal conditions.' },
          { title: 'Pediatrics', text: 'Dedicated care for infants, children, and adolescents.' },
          { title: 'Gastro Medicine', text: 'Specialized care for digestive and gastrointestinal conditions.' },
          { title: 'Dental Department', text: 'General and specialized dental care services.' },
          { title: 'Dermatology & Venereology', text: 'Care for skin, hair, and sexually transmitted conditions.' },
          { title: 'Dietitian', text: 'Personalized nutrition and diet planning support.' },
          { title: 'Cardiovascular Surgery', text: 'Advanced surgical care for heart and vascular conditions.' },
          { title: 'Emergency', text: 'Immediate response for urgent medical needs.' },
          { title: 'Endocrinology', text: 'Treatment for hormone and metabolic disorders.' },
          { title: 'Gastro Surgery', text: 'Surgical care for gastrointestinal disorders.' },
          { title: 'General Medicine', text: 'Primary care for common illnesses and long-term wellness.' },
          { title: 'Maxillofacial Surgery', text: 'Specialized surgical care for jaw, face, and oral conditions.' },
          { title: 'Nephrology', text: 'Care for kidney and related renal conditions.' },
          { title: 'Neuropsychiatry', text: 'Integrated care for neurological and psychiatric needs.' },
          { title: 'Neurosurgery', text: 'Specialized surgical care for the brain and nervous system.' },
          { title: 'Ophthalmology', text: 'Eye care, vision correction, and retinal services.' },
          { title: 'Pain Physician', text: 'Treatment for chronic and acute pain conditions.' },
          { title: 'Physician Gastroenterology', text: 'Medical management for digestive and liver disorders.' },
          { title: 'Physician Department', text: 'Comprehensive physician-led clinical care services.' },
          { title: 'Psychiatry', text: 'Mental health assessment and treatment services.' },
          { title: 'Radiology', text: 'Advanced imaging and diagnostic radiology services.' },
          { title: 'General Surgery', text: 'Comprehensive surgical care across general conditions.' },
          { title: 'Urosurgery', text: 'Specialized surgical care for urinary and reproductive tract conditions.' },
        ],
      },
      { label: 'LAB REPORT', href: 'https://labreport.merodoctor.com/212' },
      {
        label: 'HEALTH PACKAGES',
        href: '#health-packages',
        menu: [
          { title: 'WHOLE BODY CHECKUP PLAN (A)', text: 'Total: Rs. 3,800/-', href: '#health-packages' },
          { title: 'WHOLE BODY CHECKUP PLAN (B)', text: 'Total: Rs. 7,100/-', href: '#health-packages' },
          { title: 'WHOLE BODY CHECKUP PLAN (C)', text: 'Total: Rs. 9,700/-', href: '#health-packages' },
        ],
      },
      { label: 'SUGGESTION', href: '#suggestion' },
      { label: 'NEWS AND EVENTS', href: '#testimonials' },
    ],
    topbar: {
      website: 'Website',
      email: 'Email',
      location: 'Location',
      search: 'Search',
      phoneLabel: 'Phone:',
      phoneNumbers: ['977-14983152', '01-4981071', '9851013439'],
    },
    hero: {
      eyebrow: 'Compassionate care, every step of the way',
      title: 'Trusted maternity, family, and emergency care for every stage of life.',
      text: '',
      titleAlt: 'Modern support for every family journey and birth experience.',
      textAlt: '',
      contact: 'Contact Us',
      services: 'View Services',
      emergency: 'Emergency',
      emergencyText: '24/7 Support',
      whatsapp: 'WhatsApp',
      whatsappText: 'Quick response',
      open: 'Open',
      openText: 'Mon-Sat',
      cardBadge: 'Emergency Assistance',
      panelBadge: 'Care you can trust',
      panelItems: ['Safe maternity care', 'Modern diagnostic support', 'Family-first consultations'],
      marqueeItems: [
        'Safe maternity care',
        'Modern diagnostic support',
        'Family-first consultations',
        'Emergency care 24/7',
        'Prenatal and newborn support',
        'Advanced diagnostics',
        'Personalized treatment plans',
        'Experienced specialist team',
        'Patient-centered healing',
        'Rapid appointment booking',
        'Modern surgical suites',
        'Specialist-led consultations',
        'Compassionate family care',
      ],
    },
    boardSection: {
      eyebrow: 'Board of Director (BOD)',
      title: 'The leadership team behind our hospital vision.',
    },
    boardMembers: [
      { name: 'Rajesh Sharma', role: 'Chairperson', description: 'Guiding strategic growth, trust, and community-centered healthcare leadership.', image: boardMember2 },
      { name: 'Dr. Meera Joshi', role: 'Medical Director', description: 'Leading clinical quality, care standards, and compassionate service delivery.', image: boardMember3 },
      { name: 'Krishna Prasad Lamichhane (KP)', role: 'Manager Director (MD)', description: 'Steering hospital leadership, operational excellence, and strategic care delivery.', image: boardMember1 },
      { name: 'Sita Rai', role: 'Community Outreach', description: 'Building neighborhood trust, healthcare access, and long-term patient support.', image: boardMember4 },
      { name: 'Nabin Adhikari', role: 'Governance Advisor', description: 'Helping shape transparent leadership, policy direction, and institutional progress.', image: boardMember5 },
    ],
    stats: [
      { value: '24/7', label: 'Emergency support' },
      { value: `${(() => {
        const startDate = new Date('1995-08-11T00:00:00');
        const now = new Date();
        let years = now.getFullYear() - startDate.getFullYear();
        const anniversaryThisYear = new Date(now.getFullYear(), startDate.getMonth(), startDate.getDate());

        if (now < anniversaryThisYear) {
          years -= 1;
        }

        return Math.max(30, years - 1) + '+';
      })()}`, label: 'Years of compassionate service' },
      { value: '50000+', label: 'Families cared for' },
      { value: '98%', label: 'Patient satisfaction' },
    ],
    about: {
      eyebrow: 'About our hospital',
      title: 'Modern clinical excellence with a deeply human approach.',
      text1: 'We are dedicated to providing reliable, compassionate, and patient-first healthcare for women, children, and families. Our hospital blends clinical expertise with warm personal attention to create a safer and more reassuring care experience.',
      text2: 'From maternity and emergency support to preventive health guidance, we focus on clear communication, timely care, and respectful treatment for every patient who walks through our doors.',
    },
    aboutCards: [
      { title: 'Our Mission', text: 'To deliver accessible, ethical, and compassionate healthcare that improves lives with dignity.' },
      { title: 'Our Vision', text: 'To become a trusted community healthcare destination for confident, family-centered care.' },
      { title: 'Our Values', text: 'Safety, empathy, clarity, and timely expert support remain at the center of everything we do.' },
    ],
    servicesSection: {
      eyebrow: 'Our services',
      title: 'Complete care for women, children, and families.',
    },
    servicesMiddleHeading: {
      title: 'Your journey',
      subtitle: 'Better Health Starts Here',
    },
    servicesCardHeading: 'Explore Our Key Service Areas',
    servicesCardSubheading: 'These trusted care services support maternity, family health, pediatrics, diagnostics, emergency response and more.',
    services: [
      { icon: 'maternity', title: 'Maternity Services', description: 'Compassionate antenatal, delivery, and postnatal support in a reassuring environment.', link: 'Learn more' },
      { icon: 'medicine', title: 'General Medicine', description: 'Preventive consultations and routine care for long-term health.', link: 'Learn more' },
      { icon: 'pediatrics', title: 'Pediatrics', description: 'Gentle, specialist care for infants, children, and growing families.', link: 'Learn more' },
      { icon: 'diagnostics', title: 'Diagnostics', description: 'Accurate lab testing and imaging to support clear treatment decisions.', link: 'Learn more' },
      { icon: 'emergency', title: 'Emergency Services', description: 'Rapid response and coordinated clinical care when every minute matters.', link: 'Learn more' },
      { icon: 'opd', title: 'OPD Services', description: 'Outpatient consultations, follow-ups, and minor procedures.', link: 'Learn more' },
      { icon: 'rooms', title: 'Rooms & Inpatient Care', description: 'Comfort-focused inpatient rooms with monitored recovery spaces.', link: 'Learn more' },
      { icon: 'specialist', title: 'Specialist Support', description: 'Integrated surgical and specialist pathways for complex care journeys.', link: 'Learn more' },
      { icon: 'pharmacy', title: 'Pharmacy Services', description: 'Easy access to trusted medicines and friendly prescription support.', link: 'Learn more' },
      { icon: 'preventive', title: 'Preventive Health', description: 'Routine wellness checks and plans to keep families healthy and ahead of risk.', link: 'Learn more' },
      { icon: 'medicine', title: 'Women’s Wellness', description: 'Personalized care plans and preventive checkups for everyday health and confidence.', link: 'Learn more' },
      { icon: 'emergency', title: 'Fast Ambulance', description: 'Rapid transport with on-route medical support; 24/7 emergency ambulance service.', link: 'Learn more' },
    ],
    whyChoose: {
      eyebrow: 'Why choose us',
      pillars: ['QUALITY', 'RELIABILITY', 'TRUST'],
      benefits: [
        'Advance emergency care',
        '24 hours service every day',
        'On call support',
        'Rapid response team',
        'Trusted medical transport',
      ],
      caption: 'A trained team ready to respond quickly and provide timely care during',
      captionHighlight: 'critical situations.',
      supportLines: ['Quality', 'Certified', 'Professional', 'Doctors'],
    },
    doctorsSection: {
      eyebrow: 'Our doctors',
      title: '',
    },
    doctors: [
      ...realDoctors.map((doctor) => ({
        ...doctor,
        experience: doctor.experience,
      })),
      { action: 'see-more', label: 'See more doctors', href: '/doctors' },
    ],
    testimonials: {
      eyebrow: 'Patient trust',
      title: 'Families value our warmth, professionalism, and care.',
    },
    testimonialsList: [
      {
        label: 'Life-Changing Care and Support',
        quote: 'The team made our delivery process calm, respectful, and truly reassuring. We felt supported every step of the way.',
        name: 'Sita Gautam',
        role: 'Mother & Patient',
        rating: 5,
        color: '#fde5e5',
      },
      {
        label: 'Professional Medical Expertise',
        quote: 'The doctors explained everything clearly, and the staff were kind, efficient, and attentive throughout my care.',
        name: 'Priya Shrestha',
        role: 'Patient - Maternity Care',
        rating: 5,
        color: '#e8d5f2',
      },
      {
        label: 'Compassionate Family Support',
        quote: 'From first consultation to follow-up, the experience was warm, organized, and deeply professional.',
        name: 'Ravi Koirala',
        role: 'Family - Pediatrics',
        rating: 5,
        color: '#c8f7a8',
      },
      {
        label: 'Exceptional Care & Attention',
        quote: 'The entire team went above and beyond to ensure our comfort. Their dedication to patient care is truly commendable.',
        name: 'Maya Adhikari',
        role: 'Patient - General Medicine',
        rating: 5,
        color: '#fde5e5',
      },
      {
        label: 'Trusted Medical Team',
        quote: 'Professional, caring, and always available. This hospital sets the standard for excellent healthcare.',
        name: 'Vikram Gurung',
        role: 'Patient & Family Member',
        rating: 5,
        color: '#e8d5f2',
      },
      {
        label: 'Outstanding Experience',
        quote: 'From admission to discharge, every step was smooth and well-coordinated. Highly recommended!',
        name: 'Laxmi Thapa',
        role: 'Mother - Maternity Care',
        rating: 5,
        color: '#c8f7a8',
      },
    ],
    gallery: {
      eyebrow: 'News & Events',
      title: 'Comfortable spaces designed for care and reassurance.',
      button: 'Explore News & Events',
    },
    videoGallery: {
      eyebrow: 'Video Gallery',
      button: 'Explore Video Gallery',
    },
    galleryItems: [
      'Nursing care and comfort',
      'Modern maternity facilities',
      'Family-centered consultation rooms',
      'Diagnostic and observation support',
    ],
    contact: {
      eyebrow: 'Contact us',
      title: 'Speak with our care team today.',
      formTitle: 'Request an appointment',
      name: 'Full name',
      phone: 'Phone number',
      department: 'Department',
      message: 'Message',
      submit: 'Submit Request',
      placeholderName: 'Your full name',
      placeholderPhone: 'Your contact number',
      placeholderMessage: 'Tell us how we can help',
      departmentOptions: ['Maternity Care', 'General Medicine', 'Pediatrics', 'Diagnostics', 'Emergency Care', 'Specialist Support'],
      contactItems: [
        { label: 'Phone', value: '+91 99999 99999' },
        { label: 'WhatsApp', value: '+91 99999 99999' },
        { label: 'Email', value: 'vinayakhospital052@gmail.com' },
        { label: 'Address', value: 'City Road, Near Main Square, Your City' },
        { label: 'Hours', value: 'Mon-Sat, 9:00 AM - 8:00 PM' },
      ],
    },
    footer: {
      quickLinks: 'Quick links',
      hours: 'Service hour',
      ourServices: 'Our Services',
      contact: 'Contact',
      links: [
        { label: 'About Us', href: '#about' },
        { label: 'Our Doctors', href: '#doctors' },
        { label: 'Our Services', href: '#services' },
        { label: 'Specialities', href: '#departments' },
        { label: 'Medical Technology', href: '#services' },
        { label: 'News and Events', href: '#testimonials' },
        { label: 'Blogs', href: '#about' },
        { label: 'Career', href: '#contact' },
        { label: 'Contact Us', href: '#contact' },
        { label: 'Academic', href: '#about' },
        { label: 'Board Member', href: '#about' },
      ],
      hoursList: ['Service Hours: 24x7 Open', 'OPD: Sun – Fri'],
      ourServicesList: ['Emergency Services', 'Pharmacy', 'OPD Services', 'Rooms', 'Diagnostic Services'],
      contactItems: ['977-14983152', '01-4981071', '9851013439', 'vinayakhospital052@gmail.com', 'Gongabu, Kathmandu, Nepal'],
    },
    chat: {
      title: 'Care Assistant',
      status: 'Online',
      placeholder: 'Ask about care services',
      send: 'Send',
      welcome: 'Hello! I can help with appointments, departments, and urgent care guidance.',
    },
  },
  ne: {
    languageLabel: 'नेपाली',
    languageFlag: '🇳🇵',
    nav: ['अस्पताल अवलोकन', 'हाम्रा सेवाहरू', 'डाक्टर खोज्नुहोस्', 'विभाग', 'ल्याब रिपोर्ट', 'स्वास्थ्य प्याकेज', 'सुझाव', 'समाचार र घटना'],
    navItems: [
      {
        label: 'अस्पताल अवलोकन',
        href: '#about',
        menu: [
          { title: 'हाम्रोबारे', text: 'अस्पतालको मिशन, मूल्यहरू र दृष्टिकोणबारे थप जान्नुहोस्।' },
          { title: 'हाम्रा डाक्टरहरू', text: 'हाम्रो भरोसेमय सेवाका पछाडिका चिकित्सा विशेषज्ञहरूलाई भेट्नुहोस्।' },
          { title: 'हाम्रा सेवाहरू', text: 'अस्पताल सेवा र सहयोगको पूर्ण दायरा अन्वेषण गर्नुहोस्।' },
          { title: 'विशेषताहरू', text: 'क्लिनिकल विभाग र केन्द्रित सेवा क्षेत्रहरू पत्ता लगाउनुहोस्।' },
          { title: 'चिकित्सा प्रविधि', text: 'सेवालाई सहयोग गर्ने निदान र उपचार प्रविधिहरू हेर्नुहोस्।' },
          { title: 'समाचार र कार्यक्रमहरू', text: 'अस्पतालका उपलब्धिहरू र आगामी कार्यक्रमबारे जानकारी राख्नुहोस्।' },
          { title: 'ब्लगहरू', text: 'उपयोगी लेखहरू, अपडेटहरू र हेरचाहका अन्तर्दृष्टिहरू पढ्नुहोस्।' },
          { title: 'क्यारियर', text: 'क्यारियरका अवसरहरू अन्वेषण गर्नुहोस् र हाम्रो टिममा सामेल हुनुहोस्।' },
          { title: 'सम्पर्क गर्नुहोस्', text: 'अपोइन्टमेन्ट, सहयोग वा अस्पतालको जानकारीका लागि सम्पर्क गर्नुहोस्।' },
          { title: 'शैक्षिक', text: 'शैक्षिक पहलहरू र सिकाइका अवसरहरू हेर्नुहोस्।' },
          { title: 'बोर्ड सदस्य', text: 'अस्पतालको दृष्टि निर्देशित गर्ने नेतृत्व टिमलाई भेट्नुहोस्।' },
        ],
      },
      {
        label: 'हाम्रा सेवाहरू',
        href: '#services',
        menu: [
          { title: 'आपतकालीन सेवाहरू', text: 'तत्काल आपतकालीन सहयोग, एम्बुलेन्स समन्वय र छिटो मूल्याङ्कन।' },
          { title: 'छिटो एम्बुलेन्स', text: 'मार्गमा चिकित्सकीय सहयोगसहित छिटो यातायात; २४/७ एम्बुलेन्स सेवा।' },
          { title: 'फार्मेसी', text: 'अनुभवी सेवा कर्मचारीहरूबाट विश्वसनीय औषधि र बिरामी मार्गदर्शन।' },
          { title: 'OPD सेवाहरू', text: 'नियमित परामर्श, फलो-अप र सानो प्रक्रियाहरूका लागि बाह्य रोगी विभाग सेवाहरू।' },
          { title: 'कमरा', text: 'आराममैत्री आन्तरिक सेवा र निगरानी गरेका रिकभरी ठाउँहरू।' },
          { title: 'निदान सेवाहरू', text: 'छिटो र स्पष्ट उपचार निर्णयका लागि सही परीक्षण र इमेजिङ।' },
        ],
      },
      {
        label: 'डाक्टर खोज्नुहोस्',
        href: '#doctors',
      },
      {
        label: 'विभाग',
        href: '#departments',
        menu: [
          { title: 'प्रसूति र स्त्रीरोग', text: 'महिला स्वास्थ्य र मातृत्व सेवाहरूका लागि विशेषज्ञ हेरचाह।' },
          { title: 'ईएनटी सर्जरी', text: 'कान, नाक र घाँटीका अवस्थाहरूका लागि विशेषज्ञ उपचार।' },
          { title: 'ऑर्थोपेडिक सर्जरी', text: 'हड्डी, जोड़ र मस्कुलोस्केलेटल अवस्थाहरूका लागि विशेषज्ञ हेरचाह।' },
          { title: 'बालचिकित्सा', text: 'नवजात, बालबालिका र किशोरका लागि समर्पित हेरचाह।' },
          { title: 'दन्त विभाग', text: 'सामान्य र विशेषज्ञ दन्त सेवा।' },
          { title: 'डर्मेटोलोजी र वेनेरोलोजी', text: 'छाला, केश र यौन रोगका अवस्थाहरूका लागि सेवा।' },
          { title: 'डाइटिशियन', text: 'व्यक्तिगत पोषण र आहार योजना सहयोग।' },
          { title: 'कार्डियोवास्कुलर सर्जरी', text: 'हृदय र शिरा अवस्थाहरूका लागि उन्नत शल्यक्रिया सेवा।' },
          { title: 'आपतकालीन', text: 'आकस्मिक चिकित्सा आवश्यकताहरूका लागि तुरुन्त प्रतिक्रिया।' },
          { title: 'एन्डोक्रिनोलोजी', text: 'हार्मोन र मेटाबोलिक disorders को उपचार।' },
          { title: 'ईएनटी सर्जरी', text: 'कान, नाक र घाँटीका अवस्थाहरूका लागि विशेषज्ञ उपचार।' },
          { title: 'ग्यास्ट्रो मेडिसिन', text: 'पाचन र gastrointestinal अवस्थाहरूका लागि विशेषज्ञ हेरचाह।' },
          { title: 'ग्यास्ट्रो सर्जरी', text: 'ग्यास्ट्रोइंटेस्टाइनल disorders का लागि शल्यक्रिया सेवा।' },
          { title: 'सामान्य चिकित्सा', text: 'सामान्य बिरामी र दीर्घकालीन स्वास्थ्यका लागि प्राथमिक हेरचाह।' },
          { title: 'म्याकिल्लोफेशियल सर्जरी', text: 'जुँगा, अनुहार र मुखका अवस्थाहरूका लागि विशेषज्ञ शल्यक्रिया।' },
          { title: 'नेफ्रोलोजी', text: 'गुर्दा र सम्बन्धित रेनल अवस्थाहरूका लागि हेरचाह।' },
          { title: 'न्यूरोसाय्कियाट्री', text: 'न्यूरोलॉजिकल र मानसिक स्वास्थ्य आवश्यकताहरूका लागि समन्वित सेवा।' },
          { title: 'न्यूरोसर्जरी', text: 'मस्तिष्क र स्नायुसिस्टमका लागि विशेषज्ञ शल्यक्रिया सेवा।' },
          { title: 'ऑफ्थल्मोलोजी', text: 'आँखा, दृष्टि सुधार र रेटिना सेवाहरू।' },
          { title: 'ऑर्थोपेडिक सर्जरी', text: 'हड्डी, जोड़ र मस्कुलोस्केलेटल अवस्थाहरूका लागि विशेषज्ञ हेरचाह।' },
          { title: 'पेन फिजिशियन', text: 'दीर्घकालीन र तीव्र दुखका अवस्थाहरूका लागि उपचार।' },
          { title: 'बालचिकित्सा', text: 'नवजात, बालबालिका र किशोरका लागि समर्पित हेरचाह।' },
          { title: 'फिजिशियन ग्यास्ट्रोएन्टरोलोजी', text: 'पाचन र यकृत disorders को चिकित्सा व्यवस्थापन।' },
          { title: 'फिजिशियन विभाग', text: 'व्यापक चिकित्सक-नेतृत्व क्लिनिकल हेरचाह सेवा।' },
          { title: 'मानसिक स्वास्थ्य', text: 'मानसिक स्वास्थ्य मूल्याङ्कन र उपचार सेवा।' },
          { title: 'रेडियोलोजी', text: 'उन्नत इमेजिङ र निदान रेडियोलोजी सेवा।' },
          { title: 'सामान्य शल्यचिकित्सा', text: 'सामान्य अवस्थाहरूका लागि व्यापक शल्य चिकित्सा सेवा।' },
          { title: 'युरोसर्जरी', text: 'मूत्र र प्रजनन पथका अवस्थाहरूका लागि विशेषज्ञ शल्यक्रिया सेवा।' },
        ],
      },
      { label: 'ल्याब रिपोर्ट', href: 'https://labreport.merodoctor.com/212' },
      {
        label: 'स्वास्थ्य प्याकेज',
        href: '#services',
        menu: [
          { title: 'सम्पूर्ण शरीर जाँच योजना (A)', text: 'कुल रकम: रु. 3,800/-' },
          { title: 'सम्पूर्ण शरीर जाँच योजना (B)', text: 'कुल रकम: रु. 7,100/-' },
          { title: 'सम्पूर्ण शरीर जाँच योजना (C)', text: 'कुल रकम: रु. 9,700/-' },
        ],
      },
      { label: 'सुझाव', href: '#suggestion' },
      { label: 'समाचार र घटना', href: '#testimonials' },
    ],
    topbar: {
      website: 'वेबसाइट',
      email: 'इमेल',
      location: 'स्थान',
      search: 'खोज',
      phoneLabel: 'फोन:',
      phoneNumbers: ['९७७-१४९८३१५२', '०१-४९८१०७१', '९८५१०१३४३९'],
    },
    hero: {
      eyebrow: 'हर कदममा सहानुभूतिपूर्ण सेवा',
      title: 'हर जीवनचक्रमा भरोसेमय मातृत्व, परिवार र आपतकालीन सेवा।',
      text: 'Vinayak Hospital & Maternity Home ले सीपयुक्त चिकित्सकीय सहयोग, परिवारकेन्द्रित विधि र आधुनिक निदान मार्फत बिरामी र परिवारहरूका लागि आत्मविश्वासपूर्ण र भरोसेमय सेवा उपलब्ध गराउँछ।',
      titleAlt: 'आधुनिक समर्थन हरेक परिवारको यात्रा र जन्म अनुभवका लागि।',
      textAlt: 'व्यक्तिगत मातृत्व र परिवारकेन्द्रित हेरचाह आराम, सुरक्षा र विश्वासका लागि डिजाइन गरिएको।',
      contact: 'सम्पर्क गर्नुहोस्',
      services: 'सेवाहरू हेर्नुहोस्',
      emergency: 'आपतकालीन',
      emergencyText: '२४/७ सहयोग',
      whatsapp: 'व्हाट्सएप',
      whatsappText: 'तुरुन्त जवाफ',
      open: 'खुला',
      openText: 'सोम-शनि',
      cardBadge: 'आपतकालीन सहायता',
      panelBadge: 'तपाईंले भरिपूर्ण विश्वास गर्न सक्ने సేవ',
      panelItems: ['सुरक्षित मातृत्व सेवा', 'आधुनिक निदान सहयोग', 'परिवारमैत्री परामर्श'],
      marqueeItems: [
        'सुरक्षित मातृत्व सेवा',
        'आधुनिक निदान सहयोग',
        'परिवारमैत्री परामर्श',
        '२४/७ आपतकालीन सेवा',
        'नवजात र गर्भवती हेरचाह',
        'आधुनिक निदान सुविधाहरू',
        'व्यक्तिगत उपचार योजनाहरू',
        'अनुभवी विशेषज्ञ समूह',
        'रोगी केन्द्रित उपचार',
        'छिटो अपोइन्टमेन्ट बुकिंग',
        'विशेषज्ञ सल्लाह',
        'हृदय र ठूलो शल्य उपचार',
      ],
    },
    boardSection: {
      eyebrow: 'बोर्ड सदस्यहरू',
      title: 'हाम्रो अस्पतालको परिकल्पनालाई साकार पार्ने नेतृत्व टोली।',
    },
    boardMembers: [
      { name: 'राजेश शर्मा', role: 'अध्यक्ष', description: 'रणनीतिक विकास, विश्वास र समुदायकेन्द्रित स्वास्थ्य सेवा नेतृत्वलाई निर्देशित गर्ने।', image: boardMember2 },
      { name: 'डा. मीरा जोशी', role: 'चिकित्सा director', description: 'क्लिनिकल गुणस्तर, सेवा मानक र सहानुभूतिपूर्ण सेवा वितरणलाई नेतृत्व गर्ने।', image: boardMember3 },
      { name: 'कृष्ण प्रसाद लमिछाने (के.पी.)', role: 'म्यानेजर डायरेक्टर (एमडी)', description: 'अस्पतालको नेतृत्व, परिचालन उत्कृष्टता र रणनीतिक सेवा वितरणलाई निर्देशित गर्ने।', image: boardMember1 },
      { name: 'सीता राई', role: 'समुदाय पहुँच', description: 'Neighbourhood विश्वास, स्वास्थ्य पहुँच र दीर्घकालीन बिरामी सहयोग निर्माण गर्ने।', image: boardMember4 },
      { name: 'नबिन अधिकारी', role: 'शासन सलाहकार', description: 'पारदर्शी नेतृत्व, नीति दिशा र संस्थागत प्रगतिको लागि सहयोग गर्ने।', image: boardMember5 },
    ],
    stats: [
      { value: '२४/७', label: 'आपतकालीन सहयोग' },
      { value: '२२+', label: 'सहानुभूतिपूर्वक सेवा गरिएको वर्ष' },
      { value: '५०,०००+', label: 'परिवारलाई सेवा गरिएको' },
      { value: '९८%', label: 'बिरामी सन्तुष्टि' },
    ],
    about: {
      eyebrow: 'हाम्रो अस्पतालको बारेमा',
      title: 'मानवप्रेम र आधुनिक चिकित्सकीय उत्कृष्टता।',
      text1: 'हामी महिलाहरू, बच्चाहरू र परिवारहरूको लागि विश्वसनीय, सहानुभूतिपूर्ण र बिरामीमुखी स्वास्थ्य सेवा प्रदान गर्न कटिबद्ध छौं। हाम्रो अस्पतालले चिकित्सकीय विशेषज्ञता र न्यानो व्यक्तिगत ध्यानलाई मिलाएर सुरक्षित र भरोसेमय उपचार अनुभव प्रदान गर्छ।',
      text2: 'मातृत्व र आपतकालीन सहयोगदेखि रोकथाम स्वास्थ्य मार्गदर्शनसम्म, हामी स्पष्ट संवाद, समयमै सेवा र सम्मानपूर्ण उपचारमा जोड दिन्छौं।',
    },
    aboutCards: [
      { title: 'हाम्रो उद्देश्य', text: 'गरिमा संग जीवन सुधार गर्ने पहुँचयोग्य, नैतिक र सहानुभूतिपूर्ण स्वास्थ्य सेवा प्रदान गर्नुहोस्।' },
      { title: 'हाम्रो दृष्टि', text: 'आत्मविश्वासपूर्ण, परिवारकेन्द्रित सेवा प्रदान गर्ने विश्वसनीय समुदाय स्वास्थ्य गन्तव्य बन्नुहोस्।' },
      { title: 'हाम्रो मूल्य', text: 'सुरक्षा, सहानुभूति, स्पष्टता र समयमै विशेषज्ञ सहयोग हाम्रो सबै कामको केन्द्रमा रहन्छ।' },
    ],
    servicesSection: {
      eyebrow: 'हाम्रा सेवाहरू',
      title: 'महिलाहरू, बच्चाहरू र परिवारहरूको लागि पूर्ण सेवा।',
    },
    servicesMiddleHeading: {
      title: 'तपाईंको स्वास्थ्य यात्रा',
      subtitle: 'उत्तम स्वास्थ्यको सुरुवात यहीँबाट हुन्छ।',
    },
    servicesCardHeading: 'हाम्रा प्रमुख सेवा क्षेत्रहरू भेट्नुहोस्',
    servicesCardSubheading: 'यी विश्वसनीय सेवा क्षेत्रहरूले मातृत्व, परिवारको स्वास्थ्य, बालचिकित्सा, निदान र आपतकालीन सहायता समावेश गर्दछन्।',
    services: [
      { icon: 'maternity', title: 'मातृत्व सेवा', description: 'सहानुभूतिपूर्ण वातावरणमा व्यापक प्रसवपूर्व, प्रसव र प्रसवपछिको सहयोग।', link: 'थप जान्नुहोस्' },
      { icon: 'medicine', title: 'सामान्य चिकित्सा', description: 'रोजमर्रा स्वास्थ्य समस्या र दीर्घकालीन स्वास्थ्यका लागि रोकथाम सेवा र निदान।', link: 'थप जान्नुहोस्' },
      { icon: 'pediatrics', title: 'बालचिकित्सा', description: 'बालस्वास्थ्य, खोप, वृद्धि अनुगमन र विश्वासका लागि मृदु सेवा।', link: 'थप जान्नुहोस्' },
      { icon: 'diagnostics', title: 'निदान सेवाहरू', description: 'क्लिनिशियनहरूलाई आत्मविश्वासका साथ कार्य गर्न मद्दत गर्ने सही प्रयोगशाला र इमेजिङ सेवा।', link: 'थप जान्नुहोस्' },
      { icon: 'opd', title: 'OPD सेवाहरू', description: 'नियमित परामर्श, फलो-अप र साना प्रक्रियाहरूका लागि बाह्य रोगी विभाग।', link: 'थप जान्नुहोस्' },
      { icon: 'rooms', title: 'कक्ष र भर्ना सेवा', description: 'आरामदायी भर्ना कक्षहरू र निगरानी गरिएको रिकभरी ठाउँहरू।', link: 'थप जान्नुहोस्' },
      { icon: 'emergency', title: 'आपतकालीन सेवा', description: 'तत्काल चिकित्सा आवश्यकताहरूका लागि प्रतिक्रियाशील क्लिनिकल सहयोग।', link: 'थप जान्नुहोस्' },
      { icon: 'specialist', title: 'विशेषज्ञ सहयोग', description: 'जटिल उपचार यात्रा लागि समन्वित शल्यचिकित्सा र विशेषज्ञ मार्गदर्शन।', link: 'थप जान्नुहोस्' },
      { icon: 'pharmacy', title: 'फार्मेसी सेवा', description: 'विश्वसनीय औषधि र सजिलो प्रिस्क्रिप्शन सहायता।', link: 'थप जान्नुहोस्' },
      { icon: 'preventive', title: 'रोकथाम स्वास्थ्य', description: 'परिवारलाई स्वस्थ र जोखिमभन्दा अगाडि राख्ने नियमित वेलनेस जाँच।', link: 'थप जान्नुहोस्' },
      { icon: 'emergency', title: 'छिटो एम्बुलेन्स', description: 'रुटमा चिकित्सकीय सहयोगसहित छिटो यातायात; २४/७ आपतकालीन एम्बुलेन्स सेवा।', link: 'थप जान्नुहोस्' },
      { icon: 'preventive', title: 'महिला स्वास्थ्य', description: 'दैनिक स्वास्थ्य र आत्मविश्वासको लागि व्यक्तिगत रोकथाम जाँच र सेवा योजना।', link: 'थप जान्नुहोस्' },
    ],
    whyChoose: {
      eyebrow: 'किन हामी रोज्ने',
      pillars: ['गुणस्तर', 'विश्वसनीयता', 'विश्वास'],
      benefits: [
        'उन्नत आपतकालीन सेवा',
        'हरेक दिन २४ घण्टा सेवा',
        'कॉलमा सहयोग',
        'छिटो प्रतिक्रिया टोली',
        'विश्वस्त चिकित्सा यातायात',
      ],
      caption: 'आवश्यक अवस्थामा छिटो प्रतिक्रिया दिन र समयमै उपचार प्रदान गर्न प्रशिक्षित टोली।',
      captionHighlight: '',
      supportLines: ['गुणस्तर', 'प्रमाणित', 'व्यावसायिक', 'चिकित्सक'],
    },
    doctorsSection: {
      eyebrow: 'सेवाको टोली',
      title: '',
    },
    doctors: [
      ...realDoctors.map((doctor) => ({
        ...doctor,
        experience: doctor.experience,
      })),
      { action: 'see-more', label: 'थप डाक्टरहरू हेर्नुहोस्', href: '/doctors' },
    ],
    appointment: {
      eyebrow: 'सुलह गर्नुहोस्',
      title: 'तुरुन्त सहयोग चाहियो? हामी तपाईंको अर्को कदममा मार्गदर्शन गर्छौं।',
      button: 'सम्पर्क गर्नुहोस्',
    },
    testimonials: {
      eyebrow: 'रोगी विश्वास',
      title: 'परिवारहरूले हाम्रो नरमता, व्यावसायिकता र सेवा मन पराउँछन्।',
    },
    testimonialsList: [
      {
        label: 'जीवन-परिवर्तनकारी सेवा र समर्थन',
        quote: 'टोलीले हाम्रो प्रसव प्रक्रिया शान्त, सम्मानित र वास्तवमै आरामदायी बनाए। हामीलाई हरेक चरणमा समर्थन महसूस भयो।',
        name: 'कमला राई',
        role: 'माता र रोगी',
        rating: 5,
        color: '#fde5e5',
      },
      {
        label: 'व्यावसायिक चिकित्सा विशेषज्ञता',
        quote: 'डाक्टरहरूले सबै कुरा स्पष्ट रूपमा समझाए, र स्टाफ नरम, कुशल र ध्यानपूर्ण थियो।',
        name: 'प्रिया शर्मा',
        role: 'रोगी - प्रसूति सेवा',
        rating: 5,
        color: '#e8d5f2',
      },
      {
        label: 'सहानुभूतिपूर्ण परिवार समर्थन',
        quote: 'पहिलो परामर्शदेखि पछिल्लो अनुगमनसम्म, अनुभव न्यानो, सुव्यवस्थित र धेरै व्यावसायिक थियो।',
        name: 'राज र परिवार',
        role: 'परिवार - बालचिकित्सा',
        rating: 5,
        color: '#c8f7a8',
      },
      {
        label: 'असाधारण सेवा र ध्यान',
        quote: 'पूरो टोलीले हाम्रो आराम सुनिश्चित गरन अतिरिक्त प्रयास गरे। उनीहरूको रोगी सेवाप्रति समर्पण साँच्चै सराहनीय छ।',
        name: 'अनीता भट्टराई',
        role: 'रोगी - सामान्य चिकित्सा',
        rating: 5,
        color: '#fde5e5',
      },
      {
        label: 'विश्वस्त चिकित्सा दल',
        quote: 'व्यावसायिक, दयालु र सधैं उपलब्ध। यो अस्पताल उत्कृष्ट स्वास्थ्यसेवाको मानक निर्धारण गर्छ।',
        name: 'सुरेश खनाल',
        role: 'रोगी र परिवार सदस्य',
        rating: 5,
        color: '#e8d5f2',
      },
      {
        label: 'असामान्य अनुभव',
        quote: 'भर्तीदेखि डिस्चार्जसम्म, हरेक पदक्षेप सुगम र राम्रोसँग संयोजित थियो। अत्यधिक सुझाव दिन्छु!',
        name: 'संजना भट्टाचार्य',
        role: 'माता - प्रसूति सेवा',
        rating: 5,
        color: '#c8f7a8',
      },
    ],
    gallery: {
      eyebrow: 'छवि ग्यालरी',
      title: 'सहज र भरोसेमय सेवाका लागि सहज स्थानहरू।',
      button: 'तस्वीरहरू हेर्नुहोस्',
    },
    videoGallery: {
      eyebrow: 'Video Gallery',
      button: 'Explore Video Gallery',
    },
    galleryItems: [
      'नर्सिङ सेवा र आराम',
      'आधुनिक मातृत्व सुविधाहरू',
      'परिवारकेन्द्रित परामर्श कोठाहरू',
      'निदान र अवलोकन सहयोग',
    ],
    contact: {
      eyebrow: 'हामीलाई सम्पर्क गर्नुहोस्',
      title: 'आजै हाम्रा सेवा टोलीसँग कुरा गर्नुहोस्।',
      formTitle: 'समीपता अनुरोध गर्नुहोस्',
      name: 'पुरा नाम',
      phone: 'फोन नम्बर',
      department: 'विभाग',
      message: 'सन्देश',
      submit: 'अनुरोध पेश गर्नुहोस्',
      placeholderName: 'तपाईंको पूरा नाम',
      placeholderPhone: 'तपाईंको सम्पर्क नम्बर',
      placeholderMessage: 'हामीले कसरी सहयोग गर्न सक्छौं भने',
      departmentOptions: ['मातृत्व सेवा', 'सामान्य चिकित्सा', 'बालचिकित्सा', 'निदान सेवाहरू', 'आपतकालीन सेवा', 'विशेषज्ञ सहयोग'],
      contactItems: [
        { label: 'फोन', value: '+९१ ९९९९९ ९९९९९' },
        { label: 'व्हाट्सएप', value: '+९१ ९९९९९ ९९९९९' },
        { label: 'इमेल', value: 'vinayakhospital052@gmail.com' },
        { label: 'ठेगाना', value: 'सिटी रोड, मुख्य चौरसँग नजिकै, तपाईंको शहर' },
        { label: 'समय', value: 'सोम-शनि, ९:०० बजे देखि ८:०० बजे' },
      ],
    },
    footer: {
      quickLinks: 'छिटो लिङ्कहरू',
      hours: 'व्यवसाय समय',
      ourServices: 'हाम्रा सेवाहरू',
      contact: 'सम्पर्क',
      links: [
        { label: 'हाम्रो बारेमा', href: '#about' },
        { label: 'हाम्रा डाक्टरहरू', href: '#doctors' },
        { label: 'हाम्रा सेवाहरू', href: '#services' },
        { label: 'विशेषज्ञताहरू', href: '#departments' },
        { label: 'चिकित्सा प्रविधि', href: '#services' },
        { label: 'समाचार र कार्यक्रम', href: '#testimonials' },
        { label: 'ब्लग', href: '#about' },
        { label: 'क्यारियर', href: '#contact' },
        { label: 'सम्पर्क गर्नुहोस्', href: '#contact' },
        { label: 'शैक्षिक', href: '#about' },
        { label: 'बोर्ड सदस्य', href: '#about' },
      ],
      hoursList: ['सेवा समय: २४x७ खुला', 'ओपीडी: आइतबार – फ्राइ'],
      ourServicesList: ['आपतकालीन सेवाहरू', 'फार्मेसी', 'OPD सेवाहरू', 'कमरा', 'निदान सेवाहरू'],
      contactItems: ['९७७-१४९८३१५२', '०१-४९८१०७१', '९८५१०१३४३९', 'vinayakhospital052@gmail.com', 'गोंगबु, काठमाण्डौ, नेपाल'],
    },
    chat: {
      title: 'सेवा सहायक',
      status: 'अनलाइन',
      placeholder: 'सेवाहरूको बारेमा सोध्नुहोस्',
      send: 'पठाउनुहोस्',
      welcome: 'नमस्ते! म अपॉइंटमेन्ट, विभाग र आपतकालीन मार्गदर्शनमा सहायता गर्न सक्छु।',
    },
  },
};

const initialChat = [];
const fallbackContactSettings = {
  phone: '977-14983152, 01-4981071, 9851013439',
  email: 'vinayakhospital052@gmail.com',
  location: 'Gongabu, Kathmandu, Nepal',
};
const emailAddress = fallbackContactSettings.email;
const heroBanners = [
  { desktop: bannerImage, mobile: bannerMobileImage },
  { desktop: bannerImage2, mobile: banner1Mobile },
];
const serviceImageSets = [
  [ourService1Image, ourService2Image, ourService3Image],
  [ourService4Image, ourService5Image, ourService6Image],
];
const fallbackServiceImage = ourService1Image;
const serviceIconMap = {
  maternity: Baby,
  medicine: Stethoscope,
  pediatrics: HeartPulse,
  diagnostics: Activity,
  emergency: Ambulance,
  specialist: BriefcaseMedical,
  pharmacy: Stethoscope,
  preventive: ShieldPlus,
};

const defaultGalleryAllImages = [
  { src: boardMember3, alt: 'Patient care space', header: 'Patient care space' },
  { src: boardMember2, alt: 'Hospital facilities', header: 'Hospital facilities' },
  { src: boardMember4, alt: 'Modern treatment rooms', header: 'Modern treatment rooms' },
  { src: boardMember5, alt: 'Hospital reception', header: 'Hospital reception' },
  { src: galleryImage1, alt: 'Hospital interior', header: 'Hospital interior' },
];
const galleryVideos = [
  {
    title: 'Hospital overview',
    href: 'https://www.facebook.com/reel/694074612985442/?s=fb_shorts_profile&stack_idx=0',
    embedUrl: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F694074612985442%2F%3Fs%3Dfb_shorts_profile%26stack_idx%3D0&show_text=false&width=560',
    fallbackText: 'Hospital overview video',
  },
  {
    title: 'Patient care',
    href: 'https://www.facebook.com/reel/2658723724543366/?s=fb_shorts_profile&stack_idx=0',
    embedUrl: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F2658723724543366%2F%3Fs%3Dfb_shorts_profile%26stack_idx%3D0&show_text=false&width=560',
    fallbackText: 'Patient care video',
  },
  {
    title: 'Maternity care',
    href: 'https://www.facebook.com/reel/855728020513358/?s=fb_shorts_profile&stack_idx=0',
    embedUrl: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F855728020513358%2F%3Fs%3Dfb_shorts_profile%26stack_idx%3D0&show_text=false&width=560',
    fallbackText: 'Maternity care video',
  },
  {
    title: 'Modern facilities',
    href: 'https://www.facebook.com/reel/1395354859357441/?s=fb_shorts_profile&stack_idx=0',
    embedUrl: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1395354859357441%2F%3Fs%3Dfb_shorts_profile%26stack_idx%3D0&show_text=false&width=560',
    fallbackText: 'Modern facilities video',
  },
];

function ServiceIcon({ type }) {
  const iconMap = {
    maternity: Baby,
    medicine: Stethoscope,
    pediatrics: HeartPulse,
    diagnostics: Activity,
    emergency: Ambulance,
    specialist: BriefcaseMedical,
  };

  const Icon = iconMap[type] || ShieldPlus;
  return <Icon size={22} strokeWidth={1.8} aria-hidden="true" />;
}

function MegaEntryIcon({ title }) {
  const iconMap = {
    'Care Philosophy': ShieldPlus,
    Mission: HeartPulse,
    Facilities: MapPin,
    'Emergency Services': Ambulance,
    Pharmacy: Stethoscope,
    'OPD Services': Stethoscope,
    Rooms: Baby,
    'Diagnostic Services': Activity,
  };

  const Icon = iconMap[title] || ShieldPlus;
  return <Icon size={16} strokeWidth={2} aria-hidden="true" />;
}

function AnimatedServiceCardImage({ currentSrc, alt }) {
  const [displaySrc, setDisplaySrc] = useState(currentSrc);

  useEffect(() => {
    setDisplaySrc(currentSrc);
  }, [currentSrc]);

  return (
    <div className="service-card-image-stack" aria-hidden="true">
      <img
        key={`${displaySrc}-main`}
        src={displaySrc || fallbackServiceImage}
        alt={alt}
        className="service-card-image-layer service-card-image-layer--fade-in"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = fallbackServiceImage;
        }}
      />
    </div>
  );
}

function AnimatedStatValue({ value }) {
  return <strong>{value}</strong>;
}

function App() {
  const [resolvedHeroBanners, setResolvedHeroBanners] = useState(() => {
    try {
      return (typeof window !== 'undefined' && window.innerWidth <= 640)
        ? heroBanners.map((b) => b.mobile)
        : heroBanners.map((b) => b.desktop);
    } catch (e) {
      return heroBanners.map((b) => b.desktop);
    }
  });

  useEffect(() => {
    const onResize = () => {
      setResolvedHeroBanners(window.innerWidth <= 640 ? heroBanners.map((b) => b.mobile) : heroBanners.map((b) => b.desktop));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // JS fallback: toggle a dedicated class to fully hide `.nav-wrap` on mobile when header is scrolled
  useEffect(() => {
    const getNav = () => document.querySelector('.nav-wrap');
    const getTopbar = () => document.querySelector('header.topbar');
    const getToggle = () => document.getElementById('mobile-menu-toggle');

    const applyNavHide = () => {
      try {
        const nav = getNav();
        const topbarEl = getTopbar();
        const menuToggle = getToggle();
        if (!nav || !topbarEl) return;

        const isMobile = typeof window !== 'undefined' ? window.matchMedia('(max-width: 992px)').matches : false;
        const scrolled = topbarEl.classList.contains('scrolled');
        const menuOpen = menuToggle && menuToggle.checked;

        if (isMobile && scrolled && !menuOpen) {
          nav.classList.add('nav-wrap-hidden-js');
          try {
            nav.style.setProperty('display', 'none', 'important');
            nav.setAttribute('aria-hidden', 'true');
          } catch (e) {
            nav.style.display = 'none';
            nav.setAttribute('aria-hidden', 'true');
          }
        } else {
          nav.classList.remove('nav-wrap-hidden-js');
          try {
            nav.style.removeProperty('display');
            nav.removeAttribute('aria-hidden');
          } catch (e) {
            nav.style.display = '';
            nav.removeAttribute('aria-hidden');
          }
        }
      } catch (e) {
        // ignore
      }
    };

    applyNavHide();

    const onScroll = () => applyNavHide();
    const onResize = () => applyNavHide();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    const topbarEl = getTopbar();
    const mo = topbarEl ? new MutationObserver(applyNavHide) : null;
    if (mo && topbarEl) mo.observe(topbarEl, { attributes: true, attributeFilter: ['class'] });

    const menuToggle = getToggle();
    if (menuToggle) menuToggle.addEventListener('change', applyNavHide);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (mo) mo.disconnect();
      if (menuToggle) menuToggle.removeEventListener('change', applyNavHide);
    };
  }, []);
  const [language, setLanguage] = useState('en');
  const [transitioning, setTransitioning] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [isReloadingLanguage, setIsReloadingLanguage] = useState(false);
  const [isTopbarScrolled, setIsTopbarScrolled] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    department: 'Maternity Care',
    message: '',
  });
  const [activeMegaIndex, setActiveMegaIndex] = useState(null);
  const [megaBoxSize, setMegaBoxSize] = useState({ width: 0, height: 0 });
  const [megaContentPhase, setMegaContentPhase] = useState('idle');
  const [megaContentIndex, setMegaContentIndex] = useState(null);
  const [megaTransitionDirection, setMegaTransitionDirection] = useState('next');
  const [megaContentRenderKey, setMegaContentRenderKey] = useState(0);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [contentVisible, setContentVisible] = useState(false);
  const [titleAnimate, setTitleAnimate] = useState(false);
  const [serviceImageSetIndex, setServiceImageSetIndex] = useState(0);
  const [newsEventImages, setNewsEventImages] = useState([]);
  const [newsEventVideos, setNewsEventVideos] = useState([]);
  const [portalServices, setPortalServices] = useState([]);
  const [siteNotes, setSiteNotes] = useState([]);
  const [contactSettings, setContactSettings] = useState(fallbackContactSettings);
  const [showSiteNotePopup, setShowSiteNotePopup] = useState(false);
  const [galleryMainIndex, setGalleryMainIndex] = useState(0);
  const [galleryTransitionDirection, setGalleryTransitionDirection] = useState('next');
  const [galleryMainImageLoaded, setGalleryMainImageLoaded] = useState(true);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [qrAnimating, setQrAnimating] = useState(false);
  const [chatCopied, setChatCopied] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const chatWidgetRef = useRef(null);
  const galleryVideoRef = useRef(null);
  const scrollLockTimeoutRef = useRef(null);

  const chatPhone = '+977 9802853066';
  const chatAgentName = 'Emma Gurung';
  const chatAgentSecondary = '+977 9802853066';

  const handleChatToggle = () => {
    setIsChatOpen((prev) => !prev);
  };

  const contactPhoneNumbers = (contactSettings.phone || fallbackContactSettings.phone)
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
  const [openMobileMegaIndex, setOpenMobileMegaIndex] = useState(null);
  const activeContactEmail = contactSettings.email || fallbackContactSettings.email;
  const activeContactLocation = contactSettings.location || fallbackContactSettings.location;

  const activeGalleryAllImages = [
    ...defaultGalleryAllImages,
    ...newsEventImages,
  ];
  const galleryImages = activeGalleryAllImages.map((item, index) => ({ ...item, id: index + 1 }));
  const combinedGalleryVideos = [...newsEventVideos, ...galleryVideos].reduce((result, video) => {
    const href = (video?.href || video?.embedUrl || '').trim();
    if (!href) return result;
    const normalized = href.toLowerCase();
    if (result.seen.has(normalized)) return result;
    result.seen.add(normalized);
    result.list.push(video);
    return result;
  }, { seen: new Set(), list: [] }).list;

  const handleGalleryPrev = () => {
    setGalleryTransitionDirection('prev');
    setGalleryMainIndex((current) => (current - 1 + activeGalleryAllImages.length) % activeGalleryAllImages.length);
  };

  const handleGalleryNext = () => {
    setGalleryTransitionDirection('next');
    setGalleryMainIndex((current) => (current + 1) % activeGalleryAllImages.length);
  };

  const handleGallerySelect = (nextIndex) => {
    setGalleryTransitionDirection(nextIndex >= galleryMainIndex ? 'next' : 'prev');
    setGalleryMainIndex(nextIndex);
  };

  const lockScrollTemporarily = () => {
    document.body.style.overflow = 'hidden';
    if (scrollLockTimeoutRef.current) {
      window.clearTimeout(scrollLockTimeoutRef.current);
    }
    scrollLockTimeoutRef.current = window.setTimeout(() => {
      document.body.style.overflow = '';
      scrollLockTimeoutRef.current = null;
    }, 1000);
  };

  const handleVideoSelect = (index) => {
    setSelectedVideoIndex(index);
  };

  const selectedVideo = selectedVideoIndex !== null ? combinedGalleryVideos[selectedVideoIndex] : null;

  useEffect(() => {
    fetch('/api/site-settings')
      .then((response) => response.ok ? response.json() : fallbackContactSettings)
      .then((data) => {
        const nextSettings = {
          phone: data?.phone || fallbackContactSettings.phone,
          email: data?.email || fallbackContactSettings.email,
          location: data?.location || fallbackContactSettings.location,
        };
        setContactSettings(nextSettings);
      })
      .catch(() => {
        setContactSettings(fallbackContactSettings);
      });

    fetch('/api/services')
      .then((response) => response.ok ? response.json() : { services: [] })
      .then((data) => {
        const orderedServices = Array.isArray(data.services) ? data.services : [];
        setPortalServices(orderedServices);
      })
      .catch(() => {
        setPortalServices([]);
      });

    fetch('/api/news-events')
      .then((response) => response.ok ? response.json() : { news_events: [] })
      .then((data) => {
        const uploadedImages = (data.news_events || [])
          .filter((item) => item.image_url)
          .map((item) => ({
            src: item.image_url,
            alt: item.gallery_header || item.title || 'News and event image',
            header: item.gallery_header || item.title || 'News and event image',
          }));

        const uploadedVideos = (data.news_events || [])
          .filter((item) => item.video_url)
          .map((item) => ({
            title: item.title || 'News and event video',
            href: item.video_url,
            embedUrl: item.video_url,
            fallbackText: item.title || 'News and event video',
          }));

        setNewsEventImages(uploadedImages);
        setNewsEventVideos(uploadedVideos);
      })
      .catch(() => {
        setNewsEventImages([]);
        setNewsEventVideos([]);
      });

    fetch('/api/site-notes')
      .then((response) => response.ok ? response.json() : { notes: [] })
      .then((data) => {
        const notes = Array.isArray(data.notes) ? data.notes : [];
        setSiteNotes(notes);
        setShowSiteNotePopup(notes.length > 0);
      })
      .catch(() => {
        setSiteNotes([]);
        setShowSiteNotePopup(false);
      });
  }, []);

  useEffect(() => {
    if (galleryMainIndex >= activeGalleryAllImages.length && activeGalleryAllImages.length > 0) {
      setGalleryMainIndex(0);
    }
  }, [activeGalleryAllImages.length, galleryMainIndex]);

  useEffect(() => {
    return () => {
      if (scrollLockTimeoutRef.current) {
        window.clearTimeout(scrollLockTimeoutRef.current);
        scrollLockTimeoutRef.current = null;
        document.body.style.overflow = '';
      }
    };
  }, []);

  useEffect(() => {
    if (!isChatOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (chatWidgetRef.current && !chatWidgetRef.current.contains(event.target)) {
        setIsChatOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isChatOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleQrOpen = () => {
    setShowQr(true);
    setQrAnimating(false);
    window.requestAnimationFrame(() => {
      setQrAnimating(true);
    });
  };

  const handleQrClose = () => {
    setQrAnimating(false);
    window.setTimeout(() => {
      setShowQr(false);
    }, 180);
  };

  const handleCopyNumber = async () => {
    setChatCopied(true);
    try {
      await navigator.clipboard.writeText(chatPhone);
    } catch (error) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = chatPhone;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch (fallbackError) {
        // ignore fallback errors, state still shows copied feedback
      }
    }
    window.setTimeout(() => setChatCopied(false), 1800);
  };
  const [showSuggestionPage, setShowSuggestionPage] = useState(false);
  const [showHealthPackagesPage, setShowHealthPackagesPage] = useState(false);
  const [showNewsEventsPage, setShowNewsEventsPage] = useState(false);
  const [showDoctorsPage, setShowDoctorsPage] = useState(false);
  const [showDepartmentPage, setShowDepartmentPage] = useState(false);
  const [showBoardPage, setShowBoardPage] = useState(false);
  const [showOpdPage, setShowOpdPage] = useState(false);
  const [showAboutPage, setShowAboutPage] = useState(false);
  const [showDoctorProfile, setShowDoctorProfile] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [activeDepartment, setActiveDepartment] = useState('All');
  const [doctorSearch, setDoctorSearch] = useState('');
  const [labReportOpen, setLabReportOpen] = useState(false);
  const [labReportUrl, setLabReportUrl] = useState('');
  const [selectedDepartmentSlug, setSelectedDepartmentSlug] = useState('');
  const [isMobileViewport, setIsMobileViewport] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 760;
  });
  const [visibleServiceCards, setVisibleServiceCards] = useState(5);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateViewport = () => setIsMobileViewport(window.innerWidth <= 760);
    updateViewport();
    window.addEventListener('resize', updateViewport);

    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  useEffect(() => {
    const updateFromPath = () => {
      if (typeof window === 'undefined') return;
      const path = window.location.pathname || '';
      const normalized = path.toLowerCase();
      const isBodRoute = normalized === '/portal/add-bod' || normalized === '/portal/bod' || normalized === '/bod';
      if (isBodRoute) {
        setShowBoardPage(true);
        setShowSuggestionPage(false);
        setShowHealthPackagesPage(false);
        setShowNewsEventsPage(false);
        setShowDoctorsPage(false);
        setShowDepartmentPage(false);
        setShowAboutPage(false);
        setShowDoctorProfile(false);
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    };

    updateFromPath();
    window.addEventListener('popstate', updateFromPath);
    return () => window.removeEventListener('popstate', updateFromPath);
  }, []);

  useEffect(() => {
    const updateBodyClasses = () => {
      const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
      const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '192.168.18.223';
      const rawHash = typeof window !== 'undefined' ? window.location.hash.toLowerCase() : '';
      const hash = rawHash.replace(/^#/, '');
      const isAtTop = typeof window !== 'undefined' ? window.scrollY <= 40 : true;
      const isHomeRoot = hash === '' || hash === 'home';
      const isAboutAtTop = hash === 'about' && isAtTop;
      const isDepartmentHeroActive = showDepartmentPage && isAtTop;
      const isDoctorsHeroActive = showDoctorsPage && isAtTop;

      if (isLocalHost) {
        document.body.classList.add('local-origin');
      } else {
        document.body.classList.remove('local-origin');
      }

      if (isLocalHost && isHomeRoot) {
        document.body.classList.add('home-nav-white');
      } else {
        document.body.classList.remove('home-nav-white');
      }

      if (isAboutAtTop) {
        document.body.classList.add('about-nav-black');
      } else {
        document.body.classList.remove('about-nav-black');
      }

      if (isDepartmentHeroActive) {
        document.body.classList.add('department-page-hero-active');
      } else {
        document.body.classList.remove('department-page-hero-active');
      }

      if (isDoctorsHeroActive) {
        document.body.classList.add('doctors-page-hero-active');
      } else {
        document.body.classList.remove('doctors-page-hero-active');
      }
      // Topbar page-specific highlight classes (used to change nav color when at top)
      const topbarEl = document.querySelector('.topbar');
      if (topbarEl) {
        if (hash === 'health-packages' && isAtTop) {
          topbarEl.classList.add('health-packages-active');
        } else {
          topbarEl.classList.remove('health-packages-active');
        }

        if (hash === 'news-events' && isAtTop) {
          topbarEl.classList.add('news-events-active');
        } else {
          topbarEl.classList.remove('news-events-active');
        }
      }

      // Add a body-level class to ensure higher-specificity styling when at top
      if (hash === 'health-packages' && isAtTop) {
        document.body.classList.add('health-packages-active-top');
      } else {
        document.body.classList.remove('health-packages-active-top');
      }

      if (hash === 'news-events' && isAtTop) {
        document.body.classList.add('news-events-active-top');
      } else {
        document.body.classList.remove('news-events-active-top');
      }

      // Force inline color on nav links to override conflicting CSS when needed
      const navLinks = Array.from(document.querySelectorAll('.main-nav .nav-item > a'));
      if ((hash === 'health-packages' || hash === 'news-events') && isAtTop) {
        navLinks.forEach((link) => link.style.setProperty('color', '#000000', 'important'));
      } else {
        navLinks.forEach((link) => link.style.removeProperty('color'));
      }
    };

    updateBodyClasses();
    window.addEventListener('hashchange', updateBodyClasses);
    window.addEventListener('scroll', updateBodyClasses, { passive: true });
    return () => {
      window.removeEventListener('hashchange', updateBodyClasses);
      window.removeEventListener('scroll', updateBodyClasses);
      document.body.classList.remove('local-origin', 'home-nav-white', 'about-nav-black', 'department-page-hero-active', 'doctors-page-hero-active');
    };
  }, [showDepartmentPage, showDoctorsPage, showNewsEventsPage]);

  useEffect(() => {
    const overflowValue = labReportOpen ? 'hidden' : 'auto';
    document.body.style.overflow = overflowValue;
    document.documentElement.style.overflow = overflowValue;

    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, [labReportOpen]);

  useEffect(() => {
    if (!showDoctorProfile) return;
    window.setTimeout(() => {
      const el = document.querySelector('.doctor-profile');
      if (el && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        const topbar = document.querySelector('.topbar');
        const offset = topbar ? topbar.offsetHeight : 0;
        window.scrollTo({ top: offset + 8, behavior: 'smooth' });
      }
    }, 120);
  }, [showDoctorProfile, selectedDoctor]);

  

  useEffect(() => {
    const syncPageFromHash = () => {
      const rawHash = window.location.hash.replace('#', '').toLowerCase();
      const pathname = window.location.pathname.toLowerCase();
      const hash = rawHash || (pathname.endsWith('/bod') ? 'bod' : '');
      const isBoardRoute = hash === 'bod' || pathname.endsWith('/bod');
      setShowAboutPage(hash === 'about');
      setShowSuggestionPage(hash === 'suggestion' || hash === 'suggestion-page');
      setShowHealthPackagesPage(hash === 'health-packages' || hash === 'health-packages-page');
      setShowNewsEventsPage(hash === 'news' || hash === 'news-events' || hash === 'events' || hash === 'news-and-events' || hash === 'news-and-event');
      setShowDepartmentPage(hash === 'departments' || hash === 'department');
      setShowBoardPage(isBoardRoute);
      setShowOpdPage(hash === 'opd-services');

      if (isBoardRoute) {
        setShowDoctorsPage(false);
        setShowDepartmentPage(false);
        setShowSuggestionPage(false);
        setShowHealthPackagesPage(false);
        setShowNewsEventsPage(false);
        setShowAboutPage(false);
        setShowDoctorProfile(false);
        return;
      }

      if (hash === 'about') {
        setShowDoctorsPage(false);
        setShowDepartmentPage(false);
        setShowSuggestionPage(false);
        setShowHealthPackagesPage(false);
        setShowNewsEventsPage(false);
        setShowDoctorProfile(false);
        return;
      }

      // Deep-linking: doctor profile format is '#doctor-<slug>'
      if (hash && hash.startsWith('doctor-')) {
        const slug = hash.replace(/^doctor-/, '');
        const allDoctors = (t.doctors || []).filter((d) => d.action !== 'see-more');
        const match = allDoctors.map((d) => ({
          ...d,
          slug: (d.name || '').toString().trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        })).find((d) => d.slug === slug);
        if (match) {
          setSelectedDoctor(match);
          setShowDoctorProfile(true);
          setShowDoctorsPage(false);
          return;
        }
      }

      setShowDoctorsPage(hash === 'doctors' || hash === 'doctors-page');
      if (hash === 'departments' || hash === 'department') {
        setShowDoctorsPage(false);
      }
    };

    syncPageFromHash();
    window.addEventListener('hashchange', syncPageFromHash);

    return () => window.removeEventListener('hashchange', syncPageFromHash);
  }, []);

  const [tabIndicatorStyle, setTabIndicatorStyle] = useState({ left: 0, width: 0 });
  const [bootLogoCycle, setBootLogoCycle] = useState(Date.now());
  const [reloadLogoCycle, setReloadLogoCycle] = useState(0);
  const bannerTimerRef = useRef(null);
  const transitionTimeoutRef = useRef(null);
  const revealTimeoutRef = useRef(null);
  const serviceRotateTimerRef = useRef(null);
  const tabListRef = useRef(null);
  const bannerPausedRef = useRef(false);
  const languageSwitchTimerRef = useRef(null);
  const megaMenuRef = useRef(null);

  const rotateBanner = () => {
    if (bannerPausedRef.current) {
      return;
    }

    setContentVisible(false);
    transitionTimeoutRef.current = window.setTimeout(() => {
      setBannerIndex((current) => (current + 1) % heroSlides.length);
      transitionTimeoutRef.current = window.setTimeout(() => {
        setContentVisible(true);
      }, 600);
    }, 600);
  };

  const startBannerRotation = () => {
    if (bannerTimerRef.current) {
      return;
    }

    bannerPausedRef.current = false;
    bannerTimerRef.current = window.setInterval(rotateBanner, 7000);
  };

  const stopBannerRotation = () => {
    bannerPausedRef.current = true;
    if (bannerTimerRef.current) {
      window.clearInterval(bannerTimerRef.current);
      bannerTimerRef.current = null;
    }
    if (transitionTimeoutRef.current) {
      window.clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }
  };
  const megaMenuCloseTimerRef = useRef(null);
  const t = translations[language] || translations.en;
  const visibleServices = isMobileViewport
    ? (t.services || []).slice(0, visibleServiceCards)
    : (t.services || []);
  const shouldShowServiceMoreButton = isMobileViewport && (t.services || []).length > visibleServiceCards;
  const doctorMenuEntries = realDoctors.map((doctor) => ({
    title: doctor.name,
    text: `${doctor.specialty} • ${doctor.experience}`,
    badge: doctor.experience,
    image: doctor.image,
    href: '#doctors',
  }));
  const resolvedNavItems = (t.navItems || []).map((item) => {
    if (item.label === 'OUR SERVICES' || item.label === 'हाम्रा सेवाहरू') {
      const orderedMenu = portalServices.length > 0
        ? portalServices.map((service) => ({
            title: service.name,
            text: service.description || 'Hospital service',
            href: '#services',
          }))
        : item.menu || [];
      return { ...item, menu: orderedMenu };
    }
    if (item.label === 'FIND A DOCTOR' || item.label === 'डाक्टर खोज्नुहोस्') {
      return { ...item, menu: doctorMenuEntries };
    }
    return item;
  });

  const footerOurServicesList = portalServices.length > 0
    ? portalServices.map((service) => service.name)
    : t.footer.ourServicesList || [];
  const nextLanguageLabel = language === 'en' ? translations.ne.languageLabel : translations.en.languageLabel;
  const nextLanguageFlag = language === 'en' ? nepaliFlag : englishFlag;
  const heroBadgeText = language === 'en' ? '31+ Years Of Servicing' : `${getYearsServingBadge()}+ ${language === 'en' ? 'Years of Compassionate Care' : 'सहानुभूतिपूर्ण सेवा वर्ष'}`;
  const heroButtonText = language === 'en' ? 'Find a Doctor' : 'डाक्टर खोज्नुहोस्';

  useEffect(() => {
    // set document language for CSS :lang(ne) selectors and accessibility
    try {
      if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.lang = language === 'ne' ? 'ne' : 'en';
      }
    } catch (e) {
      // ignore server/non-browser environments
    }

    const departmentMenu = t.navItems.find((item) => item.label === 'DEPARTMENT' || item.label === 'विभाग')?.menu;
    if (departmentMenu?.length) {
      setActiveDepartment((current) => (current === 'All' || departmentMenu.some((entry) => entry.title === current) ? current : 'All'));
    }
  }, [language]);

  const departmentMenu = t.navItems.find((item) => item.label === 'DEPARTMENT' || item.label === 'विभाग')?.menu ?? [];
  const departmentTabs = [{ title: 'All' }, ...departmentMenu.slice(0, 5)];
  const doctorCatalog = (t.doctors || []).filter((doctor) => doctor.action !== 'see-more');
  const uniqueDoctorCatalog = doctorCatalog.filter((doctor, index, list) => {
    const normalizedName = (doctor.name || '').toString().trim().toLowerCase();
    const imageUrl = (doctor.image || '').toString();

    const nameAlreadySeen = list.slice(0, index).some((item) => ((item.name || '').toString().trim().toLowerCase()) === normalizedName);
    if (nameAlreadySeen) return false;

    const imageAlreadySeen = imageUrl && list.slice(0, index).some((item) => (item.image || '').toString() === imageUrl);
    if (imageAlreadySeen) return false;

    return true;
  });

  // Add slugs for deep-linking
  const doctorCatalogWithSlug = uniqueDoctorCatalog.map((d) => ({
    ...d,
    slug: (d.name || '').toString().trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  }));

  const filteredDoctorList = doctorCatalogWithSlug.filter((doctor) => {
    const query = doctorSearch.toLowerCase();
    return (
      (doctor.name || '').toLowerCase().includes(query) ||
      (doctor.specialty || '').toLowerCase().includes(query) ||
      (doctor.department || '').toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    if (!tabListRef.current) return;
    const activeButton = tabListRef.current.querySelector('button.active');
    if (!activeButton) return;

    const containerRect = tabListRef.current.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();

    setTabIndicatorStyle({
      left: buttonRect.left - containerRect.left,
      width: buttonRect.width,
    });
  }, [activeDepartment, language]);

  useEffect(() => {
    const cards = document.querySelectorAll('.doctors .doctor-grid .doctor-card');
    if (!cards.length) return;

    gsap.killTweensOf(cards);
    gsap.set(cards, { opacity: 0, y: 18 });
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      duration: 0.35,
      ease: 'power2.out',
      stagger: 0.04,
      overwrite: true,
    });
  }, [activeDepartment]);

  

  const filteredDoctors = (() => {
    const prioritizeName = 'USHA SHRESTHA';
    const list = activeDepartment === 'All'
      ? uniqueDoctorCatalog
      : uniqueDoctorCatalog.filter((doctor) => doctor.department === activeDepartment);

    const targetDoctor = list.find((doctor) => (doctor.name || '').trim() === prioritizeName);
    const withoutTarget = list.filter((doctor) => (doctor.name || '').trim() !== prioritizeName);
    return targetDoctor ? [targetDoctor, ...withoutTarget] : withoutTarget;
  })();

  const heroSlides = [
    {
      image: resolvedHeroBanners[0],
      eyebrow: t.hero.eyebrow,
      title: t.hero.title,
      text: t.hero.text,
    },
    {
      image: resolvedHeroBanners[1],
      eyebrow: t.hero.eyebrow,
      title: t.hero.titleAlt,
      text: t.hero.textAlt,
    },
  ];

  const changeBanner = (nextIndex) => {
    stopBannerRotation();
    setContentVisible(false);
    transitionTimeoutRef.current = window.setTimeout(() => {
      setBannerIndex(nextIndex);
      transitionTimeoutRef.current = window.setTimeout(() => {
        setContentVisible(true);
      }, 600);
    }, 600);
  };

  const handlePrevBanner = () => {
    const prevIndex = (bannerIndex - 1 + heroSlides.length) % heroSlides.length;
    changeBanner(prevIndex);
  };

  const handleNextBanner = () => {
    const nextIndex = (bannerIndex + 1) % heroSlides.length;
    changeBanner(nextIndex);
  };


  useEffect(() => {
    // Temporarily disable smooth-scroll setup while debugging scroll issues.
    // initAppSetup();

    const navEntries = performance.getEntriesByType?.('navigation') || [];
    const navigationType = navEntries[0]?.type || (performance?.navigation?.type === 1 ? 'reload' : 'other');
    console.log(`App load navigation type: ${navigationType}`);
    console.log(`Boot logo src: ${logoAnimation}?v=${bootLogoCycle}`);

    setBootLogoCycle(Date.now());
    const introTimer = window.setTimeout(() => setIsBooting(false), 1400);
    return () => window.clearTimeout(introTimer);
  }, []);

  useEffect(() => {
    console.log('Overlay state update:', { isBooting, isReloadingLanguage, bootLogoCycle, reloadLogoCycle });
  }, [isBooting, isReloadingLanguage, bootLogoCycle, reloadLogoCycle]);

  useEffect(() => {

    const revealEls = document.querySelectorAll('.reveal');
    revealEls.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          },
        }
      );
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsTopbarScrolled(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    revealTimeoutRef.current = window.setTimeout(() => {
      setContentVisible(true);
    }, 900);

    return () => {
      window.removeEventListener('scroll', handleScroll);

      if (languageSwitchTimerRef.current) {
        window.clearTimeout(languageSwitchTimerRef.current);
      }
      window.clearTimeout(revealTimeoutRef.current);
      window.clearTimeout(transitionTimeoutRef.current);
    };
  }, []);

  // More robust detection of whether the page has been scrolled past the top.
  // Some overlays or layout can prevent `window.scrollY` changes from firing
  // reliably in all environments, so use an IntersectionObserver sentinel
  // placed just after the header to toggle `isTopbarScrolled`.
  useEffect(() => {
    const topbar = document.querySelector('.topbar');
    if (!topbar || typeof IntersectionObserver === 'undefined') return undefined;

    const sentinel = document.createElement('div');
    sentinel.className = 'topbar-sentinel';
    // keep sentinel in normal flow so it scrolls out of view
    sentinel.style.position = 'relative';
    sentinel.style.width = '100%';
    sentinel.style.height = '1px';
    sentinel.style.visibility = 'hidden';
    sentinel.style.pointerEvents = 'none';

    topbar.insertAdjacentElement('afterend', sentinel);

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      // when sentinel is not intersecting the viewport, page has been scrolled
      setIsTopbarScrolled(!entry.isIntersecting);
    }, { root: null, threshold: 0 });

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      if (sentinel && sentinel.parentNode) sentinel.parentNode.removeChild(sentinel);
    };
  }, []);

  useEffect(() => {
    startBannerRotation();

    return () => {
      stopBannerRotation();
    };
  }, []);

  useEffect(() => {
    if (serviceRotateTimerRef.current) {
      window.clearInterval(serviceRotateTimerRef.current);
    }

    serviceRotateTimerRef.current = window.setInterval(() => {
      setServiceImageSetIndex((current) => (current + 1) % serviceImageSets.length);
    }, 7000);

    return () => {
      if (serviceRotateTimerRef.current) {
        window.clearInterval(serviceRotateTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!contentVisible) {
      setTitleAnimate(false);
      return undefined;
    }

    const animateTimer = window.setTimeout(() => {
      setTitleAnimate(true);
    }, 180);

    return () => {
      window.clearTimeout(animateTimer);
    };
  }, [contentVisible]);

  useEffect(() => {
    if (megaContentPhase !== 'entering') {
      return undefined;
    }

    const frame = window.requestAnimationFrame(() => {
      setMegaContentPhase('sliding');
    });

    return () => window.cancelAnimationFrame(frame);
  }, [megaContentPhase]);

  useEffect(() => {
    if (activeMegaIndex === null) return;

    const frame = window.requestAnimationFrame(() => {
      const node = megaMenuRef.current;
      const content = node?.querySelector('.mega-menu-content');

      if (!node || !content) return;

      const nextHeight = Math.ceil(content.scrollHeight);
      setMegaBoxSize((prev) => (prev.height === nextHeight ? prev : { ...prev, height: nextHeight }));
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeMegaIndex, megaContentIndex, megaContentPhase, language]);

  useEffect(() => {
    const pageIsActive = showSuggestionPage || showHealthPackagesPage || showNewsEventsPage || showAboutPage || showDoctorsPage || showDepartmentPage || showBoardPage || showDoctorProfile;

    if (!pageIsActive || typeof window === 'undefined') {
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [showSuggestionPage, showHealthPackagesPage, showNewsEventsPage, showAboutPage, showDoctorsPage, showDepartmentPage, showBoardPage, showDoctorProfile]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const pageIsHome = !showSuggestionPage && !showHealthPackagesPage && !showNewsEventsPage && !showAboutPage && !showDoctorsPage && !showDepartmentPage && !showBoardPage && !showDoctorProfile && !labReportOpen;
    const hasHash = Boolean(window.location.hash && window.location.hash !== '#');

    if (pageIsHome && hasHash) {
      window.history.replaceState({}, '', '/');
    }
  }, [showSuggestionPage, showHealthPackagesPage, showNewsEventsPage, showAboutPage, showDoctorsPage, showDepartmentPage, showBoardPage, showDoctorProfile, labReportOpen]);

  const handleLanguageToggle = () => {
    if (isBooting || isReloadingLanguage) {
      return;
    }

    console.log('Language switch triggered: reload overlay active');
    const nextLanguage = language === 'en' ? 'ne' : 'en';
    setTransitioning(true);
    setIsReloadingLanguage(true);
    setReloadLogoCycle(Date.now());

    if (languageSwitchTimerRef.current) {
      window.clearTimeout(languageSwitchTimerRef.current);
    }

    languageSwitchTimerRef.current = window.setTimeout(() => {
      console.log('Language switch complete: hiding reload overlay');
      setLanguage(nextLanguage);
      setTransitioning(false);
      setIsReloadingLanguage(false);
      languageSwitchTimerRef.current = null;
    }, 1200);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSuggestionOpen = () => {
    setShowSuggestionPage(true);
    setShowHealthPackagesPage(false);
    setShowNewsEventsPage(false);
    if (window.location.hash !== '#suggestion') {
      window.history.pushState({}, '', '#suggestion');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSuggestionClose = () => {
    setShowSuggestionPage(false);
    if (window.location.hash === '#suggestion') {
      window.history.pushState({}, '', '#home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHealthPackagesOpen = () => {
    setShowSuggestionPage(false);
    setShowHealthPackagesPage(true);
    setShowNewsEventsPage(false);
    if (window.location.hash !== '#health-packages') {
      window.history.pushState({}, '', '#health-packages');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsEventsOpen = () => {
    setShowSuggestionPage(false);
    setShowHealthPackagesPage(false);
    setShowNewsEventsPage(true);
    if (window.location.hash !== '#news-events') {
      window.history.pushState({}, '', '#news-events');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsEventsClose = () => {
    setShowNewsEventsPage(false);
    if (window.location.hash === '#news-events' || window.location.hash === '#news' || window.location.hash === '#events') {
      window.history.pushState({}, '', '#home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHomeNavigation = () => {
    setShowSuggestionPage(false);
    setShowHealthPackagesPage(false);
    setShowNewsEventsPage(false);
    setShowAboutPage(false);
    setShowDoctorsPage(false);
    setShowDepartmentPage(false);
    setShowBoardPage(false);
    setShowDoctorProfile(false);
    // Navigate to the site root so logos always take the user to the home page
    const originRoot = `${window.location.origin}/`;
    if (window.location.href !== originRoot) {
      window.history.pushState({}, '', '/');
      window.location.href = originRoot;
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavItemInteraction = (event, item) => {
    if (!item) return;

    if (item.label === 'OUR SERVICES' || item.label === 'हाम्रा सेवाहरू') {
      event.preventDefault();
      handleMegaOpen(resolvedNavItems.findIndex((entry) => entry.label === item.label));
      return;
    }
    if (item.label === 'HOSPITAL OVERVIEW' || item.label === 'अस्पताल अवलोकन') {
      event.preventDefault();
      handleAboutOpen();
      return;
    }
    if (item.label === 'SUGGESTION' || item.label === 'सुझाव') {
      event.preventDefault();
      handleSuggestionOpen();
      return;
    }
    if (item.label === 'HEALTH PACKAGES' || item.label === 'स्वास्थ्य प्याकेज') {
      event.preventDefault();
      handleHealthPackagesOpen();
      return;
    }
    if (/news and event(?:s)?(?:['’]s)?/i.test(item.label) || /समाचार|कार्यक्रम/i.test(item.label)) {
      event.preventDefault();
      handleNewsEventsOpen();
      return;
    }
    if (item.label === 'FIND A DOCTOR' || item.label === 'डाक्टर खोज्नुहोस्') {
      if (isMobileViewport) {
        event.preventDefault();
        setShowDoctorsPage(true);
        setShowSuggestionPage(false);
        setShowHealthPackagesPage(false);
        setShowDepartmentPage(false);
        setShowNewsEventsPage(false);
        if (window.location.hash !== '#doctors') {
          window.history.pushState({}, '', '#doctors');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      event.preventDefault();
      handleMegaOpen(resolvedNavItems.findIndex((entry) => entry.label === item.label));
      return;
    }
    if (item.label === 'DEPARTMENT' || item.label === 'विभाग') {
      event.preventDefault();
      setSelectedDepartmentSlug('');
      setShowDepartmentPage(true);
      setShowDoctorsPage(false);
      setShowSuggestionPage(false);
      setShowHealthPackagesPage(false);
      return;
    }
    if (item.href?.startsWith('http') && item.href.includes('labreport')) {
      event.preventDefault();
      setLabReportUrl(item.href);
      setLabReportOpen(true);
    }
  };

  const handleBoardOpen = () => {
    setShowSuggestionPage(false);
    setShowHealthPackagesPage(false);
    setShowNewsEventsPage(false);
    setShowAboutPage(false);
    setShowDoctorsPage(false);
    setShowDepartmentPage(false);
    setShowBoardPage(true);
    setShowDoctorProfile(false);
    window.history.pushState({}, '', '/portal/add-bod');
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleBoardClose = () => {
    setShowBoardPage(false);
    window.history.pushState({}, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAboutOpen = () => {
    setShowAboutPage(true);
    setShowSuggestionPage(false);
    setShowHealthPackagesPage(false);
    setShowDoctorsPage(false);
    setShowDepartmentPage(false);
    setShowDoctorProfile(false);
    window.history.pushState({}, '', '#about');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAboutClose = () => {
    setShowAboutPage(false);
    window.history.pushState({}, '', '#home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openDoctorProfile = (doctor) => {
    const slug = doctor.slug || (doctor.name || '').toString().trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setSelectedDoctor({ ...doctor, slug });
    setShowDoctorProfile(true);
    setShowDoctorsPage(false);
    // set deep-link to this profile so reloads restore the view
    window.location.hash = `doctor-${slug}`;

    // After the DOM updates, scroll the profile section into view (paddingTop in the section keeps it below the navbar)
    window.setTimeout(() => {
      const el = document.querySelector('.doctor-profile');
      if (el && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        const topbar = document.querySelector('.topbar');
        const offset = topbar ? topbar.offsetHeight : 0;
        window.scrollTo({ top: offset + 8, behavior: 'smooth' });
      }
    }, 90);
  };

  const closeDoctorProfile = () => {
    setSelectedDoctor(null);
    setShowDoctorProfile(false);
    // Return to doctors list and update hash so reload stays on doctors page
    window.location.hash = '#doctors';
    window.setTimeout(() => {
      const topbar = document.querySelector('.topbar');
      const offset = topbar ? topbar.offsetHeight : 0;
      window.scrollTo({ top: offset + 8, behavior: 'smooth' });
    }, 50);
  };

  const clearMegaCloseTimer = () => {
    if (megaMenuCloseTimerRef.current) {
      window.clearTimeout(megaMenuCloseTimerRef.current);
      megaMenuCloseTimerRef.current = null;
    }
  };

  const handleMegaOpen = (index) => {
    clearMegaCloseTimer();

    const isFirstOpen = activeMegaIndex === null;
    const isSwitch = activeMegaIndex !== null && activeMegaIndex !== index;

    if (isSwitch) {
      setMegaTransitionDirection(index > activeMegaIndex ? 'next' : 'prev');
      setMegaContentPhase('entering');
      setMegaContentRenderKey((prev) => prev + 1);
      setActiveMegaIndex(index);
      setMegaContentIndex(index);
      return;
    }

    setActiveMegaIndex(index);
    setMegaContentIndex(index);

    if (!isFirstOpen) {
      setMegaTransitionDirection('next');
      setMegaContentPhase('entering');
    } else {
      setMegaContentPhase('idle');
    }
  };

  const handleMegaClose = () => {
    // clear any existing close timer
    clearMegaCloseTimer();

    // start exit animation phase on the content
    setMegaContentPhase('exiting');

    // remove the menu after the CSS exit duration (260ms)
    megaMenuCloseTimerRef.current = window.setTimeout(() => {
      setActiveMegaIndex(null);
      setMegaContentPhase('idle');
      megaMenuCloseTimerRef.current = null;
    }, 260);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.message) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete details',
        text: 'Please fill in your name, phone number, and reason for consultation.',
        confirmButtonColor: '#e03328',
      });
      return;
    }

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Unable to submit appointment request.');
      }

      Swal.fire({
        icon: 'success',
        title: 'Appointment request sent',
        text: 'Our care team will contact you shortly to confirm your visit.',
        confirmButtonColor: '#151e5a',
      });

      setFormData({
        name: '',
        phone: '',
        department: 'Maternity Care',
        message: '',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Submission failed',
        text: error.message || 'Please try again in a moment.',
        confirmButtonColor: '#e03328',
      });
    }
  };

  return (
    <>
      <div className={`page-intro-overlay${isBooting ? ' active' : ' complete'}`} aria-hidden={!isBooting}>
        <div className="page-intro-card">
          <img className="page-intro-logo" src={`${logoAnimation}?v=${bootLogoCycle}`} alt="Vinayak Hospital & Maternity Home animated logo" />
        </div>
      </div>
      <div className={`page-reload-overlay${isReloadingLanguage ? ' active' : ''}`} aria-hidden={!isReloadingLanguage}>
        <div className="page-reload-card">
          <img className="page-intro-logo" src={`${logoAnimation}?v=${reloadLogoCycle}`} alt="Vinayak Hospital & Maternity Home animated logo" />
        </div>
      </div>
      {showSiteNotePopup && siteNotes.length > 0 && (
        <div className="site-note-popup-overlay" onClick={() => setShowSiteNotePopup(false)}>
          <div className="site-note-popup" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="site-note-close" onClick={() => setShowSiteNotePopup(false)} aria-label="Close note">×</button>
            <img src={siteNotes[0].image_url} alt="Site note" className="site-note-image" />
          </div>
        </div>
      )}
      <div className={`page-shell${transitioning ? ' language-transitioning' : ''}${isBooting ? ' booting' : ''}`}>
        <header className={`topbar${isTopbarScrolled ? ' scrolled' : ''}${showSuggestionPage ? ' suggestion-active' : ''}${showNewsEventsPage ? ' news-events-active' : ''}${showHealthPackagesPage ? ' health-packages-active' : ''}${showDoctorsPage ? ' doctors-active' : ''}`}>
          <div className="top-contact-bar">
            <div className="container top-contact-wrap">
              <a
                className="top-contact-logo-link"
                href="#home"
                onClick={(event) => {
                  event.preventDefault();
                  handleHomeNavigation();
                }}
                aria-label="Go to home page"
              >
                <img
                  className="top-contact-logo"
                  src={headerLogo}
                  alt="Vinayak Hospital logo"
                />
              </a>
              <div className="mobile-nav-toggle">
                <input id="mobile-menu-toggle" className="mobile-menu-toggle" type="checkbox" aria-label="Toggle navigation menu" />
                <label htmlFor="mobile-menu-toggle" className="hamburger" aria-label="Open navigation menu">
                  <svg viewBox="0 0 32 32" aria-hidden="true">
                    <path className="line line-top-bottom" d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22" />
                    <path className="line" d="M7 16 27 16" />
                  </svg>
                </label>
                <nav className="mobile-menu-panel" aria-label="Mobile navigation">
                  <a
                    className="mobile-menu-phone"
                    href={`tel:${contactPhoneNumbers[0].replace(/\D/g, '')}`}
                    onClick={() => {
                      const menuToggle = document.getElementById('mobile-menu-toggle');
                      if (menuToggle) menuToggle.checked = false;
                    }}
                    aria-label={`Call ${contactPhoneNumbers.join(', ')}`}
                  >
                    <Phone size={16} strokeWidth={2} />
                    <span className="mobile-menu-phone-text">{contactPhoneNumbers.join(', ')}</span>
                  </a>
                  <div className="mobile-menu-contact-utility">
                    <button
                      type="button"
                      className="mobile-menu-action language-switcher"
                      onClick={() => {
                        // Toggle language but keep mobile menu open so image buttons remain visible
                        handleLanguageToggle();
                      }}
                      aria-label={`Switch language`}
                    >
                      <img
                        className="language-flag"
                        src={nextLanguageFlag}
                        alt="नेपाली flag"
                      />
                      <span>नेपाली</span>
                    </button>
                  </div>

                  {resolvedNavItems.map((item, index) => (
                      <div key={`mobile-${item.label}`} style={{ width: '100%' }}>
                        {item.menu && item.menu.length > 0 && !['HEALTH PACKAGES', 'हाम्रा सेवाहरू', 'FIND A DOCTOR', 'डाक्टर खोज्नुहोस्'].includes(item.label) ? (
                          <button
                            type="button"
                            className={`mobile-nav-item has-mega${openMobileMegaIndex === index ? ' open' : ''}`}
                            aria-expanded={openMobileMegaIndex === index}
                            onClick={(event) => {
                              // toggle accordion for mobile mega menus when anywhere on the row is clicked
                              event.preventDefault();
                              setOpenMobileMegaIndex(openMobileMegaIndex === index ? null : index);
                            }}
                          >
                            {item.label}
                          </button>
                        ) : (
                          <a
                            href={item.href || '#'}
                            className={`mobile-nav-item${openMobileMegaIndex === index ? ' open' : ''}`}
                            target={item.href?.startsWith('http') ? '_blank' : undefined}
                            rel={item.href?.startsWith('http') ? 'noreferrer' : undefined}
                            onClick={(event) => {
                              if (item.label === 'FIND A DOCTOR' || item.label === 'डाक्टर खोज्नुहोस्') {
                                event.preventDefault();
                                setShowDoctorsPage(true);
                                setShowSuggestionPage(false);
                                setShowHealthPackagesPage(false);
                                setShowDepartmentPage(false);
                                setShowNewsEventsPage(false);
                                if (window.location.hash !== '#doctors') {
                                  window.history.pushState({}, '', '#doctors');
                                }
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              } else {
                                handleNavItemInteraction(event, item);
                              }
                              const menuToggle = document.getElementById('mobile-menu-toggle');
                              if (menuToggle) {
                                menuToggle.checked = false;
                              }
                            }}
                          >
                            {item.label}
                          </a>
                        )}

                        <div className={`mobile-submenu ${openMobileMegaIndex === index ? 'open' : ''}`}>
                          {item.menu && item.menu.map((m, mi) => {
                            const normalizedSubItem = {
                              ...m,
                              label: m.title || item.label,
                              href: m.href || (m.title && /news and (event|events)|समाचार|program/i.test(m.title) ? '#news-events' : item.href || '#'),
                            };

                            return (
                              <a
                                key={`${item.label}-sub-${mi}`}
                                href={normalizedSubItem.href}
                                className="mobile-submenu-item"
                                onClick={(e) => {
                                  const titleLower = (m.title || '').toString().toLowerCase();
                                  if (/news and event(?:s)?(?:['’]s)?/i.test(titleLower) || /समाचार|कार्यक्रम/i.test(titleLower)) {
                                    e.preventDefault();
                                    handleNewsEventsOpen();
                                  } else {
                                    handleNavItemInteraction(e, normalizedSubItem);
                                  }

                                  const menuToggle = document.getElementById('mobile-menu-toggle');
                                  if (menuToggle) menuToggle.checked = false;
                                }}
                              >
                                {m.title}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                  
                </nav>
              </div>
              <div className="contact-line">
                <Phone size={14} strokeWidth={2} />
                <span className="contact-label">{t.topbar.phoneLabel}</span>
                {contactPhoneNumbers.map((number, index) => (
                  <span key={`${number}-${index}`}>
                    {index > 0 && <span className="contact-separator">,</span>}
                    <a
                      className="contact-number-text"
                      href={`tel:${number.replace(/\D/g, '')}`}
                      aria-label={`Call phone number ${number}`}
                    >
                      {number}
                    </a>
                  </span>
                ))}
              </div>
              <div className="social-strip">
                <button
                  type="button"
                  className="social-item language-switcher"
                  onClick={handleLanguageToggle}
                  aria-label={`Switch to ${nextLanguageLabel}`}
                >
                  <img
                    className="language-flag"
                    src={nextLanguageFlag}
                    alt={nextLanguageLabel === 'नेपाली' ? 'Nepali flag' : 'English flag'}
                  />
                  <span>{nextLanguageLabel}</span>
                </button>
                <a
                  className="social-item"
                  href={`mailto:${activeContactEmail}`}
                  aria-label="Email"
                >
                  <Mail size={14} strokeWidth={2} />
                  <span>{t.topbar.email}</span>
                </a>
                <a className="social-item" href="https://maps.google.com/?q=Vinayak+Hospital" target="_blank" rel="noreferrer" aria-label="Location">
                  <MapPin size={14} strokeWidth={2} />
                  <span>{activeContactLocation}</span>
                </a>
                <a className="social-item search-pill" href="#contact" aria-label="Search">
                  <Search size={14} strokeWidth={2} />
                  <span>{t.topbar.search}</span>
                </a>
              </div>
            </div>
          </div>

          <div className="container nav-wrap">
            <a className="brand brand-mark" href="#home" aria-label="Vinayak Hospital home" onClick={(event) => {
              event.preventDefault();
              handleHomeNavigation();
            }}>
              <img src={headerLogo} alt="Vinayak Hospital & Maternity Home logo" />
            </a>

            <nav className="main-nav" aria-label="Main navigation" onMouseLeave={handleMegaClose}>
              {resolvedNavItems.map((item, index) => (
                <div
                  key={item.label}
                  className={`nav-item${item.menu ? ' has-mega' : ''}${activeMegaIndex === index ? ' is-active' : ''}`}
                  onMouseEnter={() => {
                    if (item.menu) {
                      handleMegaOpen(index);
                    } else {
                      handleMegaClose();
                    }
                  }}
                  onFocus={() => {
                    if (item.menu) {
                      handleMegaOpen(index);
                    } else {
                      handleMegaClose();
                    }
                  }}
                >
                  <a
                    href={item.href}
                    target={item.href?.startsWith('http') ? '_blank' : undefined}
                    rel={item.href?.startsWith('http') ? 'noreferrer' : undefined}
                    onClick={(event) => {
                      if (item.label === 'OUR SERVICES' || item.label === 'हाम्रा सेवाहरू') {
                        event.preventDefault();
                        if (activeMegaIndex === index) {
                          handleMegaClose();
                        } else {
                          handleMegaOpen(index);
                        }
                        return;
                      }
                      handleNavItemInteraction(event, item);
                    }}
                  >
                    <span>{item.label}</span>
                    {item.menu && <ChevronDown size={12} strokeWidth={2.2} className="nav-caret" aria-hidden="true" />}
                  </a>
                </div>
              ))}

              {activeMegaIndex !== null && resolvedNavItems[activeMegaIndex]?.menu && (
                <div
                  ref={megaMenuRef}
                  className="mega-menu active"
                  aria-label={`${resolvedNavItems[activeMegaIndex].label} menu`}
                  onMouseEnter={clearMegaCloseTimer}
                  onMouseLeave={handleMegaClose}
                  style={{ height: `${megaBoxSize.height}px` }}
                >
                  <div
                    key={megaContentRenderKey}
                    className={`mega-menu-content${megaContentPhase === 'entering' ? ' entering' : megaContentPhase === 'sliding' ? ' sliding' : ''}${megaTransitionDirection === 'prev' ? ' direction-prev' : ' direction-next'}`}
                  >
                    {(() => {
                      const activeMenu = resolvedNavItems[activeMegaIndex];
                      const isOverviewMenu = activeMenu.label === 'HOSPITAL OVERVIEW' || activeMenu.label === 'अस्पताल अवलोकन';
                      const isDepartmentMenu = activeMenu.label === 'DEPARTMENT' || activeMenu.label === 'विभाग';
                      const isHealthPackagesMenu = activeMenu.label === 'HEALTH PACKAGES' || activeMenu.label === 'स्वास्थ्य प्याकेज';
                      const isServicesMenu = activeMenu.label === 'OUR SERVICES' || activeMenu.label === 'हाम्रा सेवाहरू';
                      const columnLabels = isOverviewMenu
                        ? ['ABOUT', 'TEAM', 'SERVICE', 'MORE']
                        : activeMenu.label === 'FIND A DOCTOR' || activeMenu.label === 'डाक्टर खोज्नुहोस्'
                          ? ['TOP DOCTORS', 'AVAILABLE NOW', 'BOOK APPOINTMENT', 'MORE']
                          : isDepartmentMenu
                            ? Array(4).fill(language === 'en' ? 'DEPARTMENTS' : 'विभाग')
                            : isHealthPackagesMenu
                              ? language === 'en'
                                ? ['PLAN A', 'PLAN B', 'PLAN C']
                                : ['योजना A', 'योजना B', 'योजना C']
                              : isServicesMenu
                                ? (language === 'en'
                                  ? ['EMERGENCY CARE', 'MATERNITY & FAMILY', 'DIAGNOSTICS', 'SUPPORT SERVICES']
                                  : ['आपतकालीन सेवा', 'मातृत्व र परिवार', 'निदान सेवा', 'सहायता सेवा'])
                                : ['FEATURES', 'MORE', 'OPTIONS', 'DETAILS'];

                      const activeMenuEntries = activeMenu.label === 'FIND A DOCTOR' || activeMenu.label === 'डाक्टर खोज्नुहोस्'
                        ? doctorMenuEntries
                        : activeMenu.menu;

                      const totalColumns = isHealthPackagesMenu ? 3 : 4;
                      const itemsPerColumn = Math.ceil(activeMenuEntries.length / totalColumns);
                      const menuGroups = Array.from({ length: totalColumns }, (_, groupIndex) =>
                        activeMenuEntries.slice(groupIndex * itemsPerColumn, (groupIndex + 1) * itemsPerColumn)
                      );

                      return menuGroups.map((group, groupIndex) => {
                        const isLastColumn = groupIndex === menuGroups.length - 1;
                        return (
                          <div key={`${activeMenu.label}-${columnLabels[groupIndex]}-${groupIndex}`} className="mega-column">
                            <div className="mega-column-title">{columnLabels[groupIndex] || activeMenu.label}</div>
                            {group.map((entry) => {
                              const isOurDoctorsEntry = entry.title === 'OUR DOCTORS' || entry.title === 'हाम्रा डाक्टरहरू' || entry.title === 'OUR DOCTORS';
                              const entryHref = entry.href || (isOurDoctorsEntry ? '#doctors' : activeMenu.href || '#');
                              return (
                                <a
                                  href={entryHref}
                                  className="mega-entry"
                                  key={entry.title}
                                  onClick={(e) => {
                                    const titleLower = (entry.title || '').toString().toLowerCase();
                                    if (titleLower.includes('opd')) {
                                      e.preventDefault();
                                      setShowOpdPage(true);
                                      setShowDoctorsPage(false);
                                      setShowDepartmentPage(false);
                                      setShowSuggestionPage(false);
                                      setShowHealthPackagesPage(false);
                                      window.location.hash = '#opd-services';
                                      handleMegaClose();
                                      return;
                                    }
                                    if (titleLower.includes('board member') || titleLower.includes('board of director') || titleLower.includes('बोर्ड सदस्य') || titleLower.includes('बोर्ड अफ डाइरेक्टर')) {
                                      e.preventDefault();
                                      handleBoardOpen();
                                      handleMegaClose();
                                      return;
                                    }
                                    if (titleLower.includes('news and event') || titleLower.includes('news and events') || titleLower.includes('समाचार र घटना') || titleLower.includes('समाचार र कार्यक्रम')) {
                                      e.preventDefault();
                                      handleNewsEventsOpen();
                                      handleMegaClose();
                                      return;
                                    }

                                    if (isOurDoctorsEntry) {
                                      e.preventDefault();
                                      window.location.hash = '#doctors';
                                      setShowDoctorsPage(true);
                                      setShowSuggestionPage(false);
                                      setShowHealthPackagesPage(false);
                                    }

                                    if (isDepartmentMenu && entry.title) {
                                      e.preventDefault();
                                      const departmentSlug = (entry.title || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                                      setSelectedDepartmentSlug(departmentSlug);
                                      setActiveDepartment(entry.title);
                                      setShowDepartmentPage(true);
                                      setShowDoctorsPage(false);
                                      setShowSuggestionPage(false);
                                      setShowHealthPackagesPage(false);
                                      window.location.hash = '#department';
                                      handleMegaClose();
                                    }
                                  }}
                                >
                                  <div className="mega-entry-icon" aria-hidden="true">
                                  {entry.image ? (
                                    <img src={entry.image} alt={entry.title} className="mega-entry-avatar" />
                                  ) : entry.badge ? (
                                    <span className="mega-badge">{entry.badge}</span>
                                  ) : (
                                    <MegaEntryIcon title={entry.title} />
                                  )}
                                </div>
                                <div className="mega-entry-copy">
                                  <strong>{entry.title}</strong>
                                  <span>{entry.text}</span>
                                </div>
                                </a>
                              );
                            })}
                            {isDepartmentMenu && isLastColumn && (
                              <div
                                style={{ padding: 12, width: '100%' }}
                                onMouseEnter={clearMegaCloseTimer}
                                onMouseLeave={clearMegaCloseTimer}
                              >
                                <a
                                  href="#department"
                                  className="mega-entry see-more-entry"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedDepartmentSlug('');
                                    setShowDepartmentPage(true);
                                    setShowDoctorsPage(false);
                                    setShowSuggestionPage(false);
                                    setShowHealthPackagesPage(false);
                                    window.location.hash = '#department';
                                    handleMegaClose();
                                  }}
                                >
                                  <div className="mega-entry-icon" aria-hidden="true">➕</div>
                                  <div className="mega-entry-copy">
                                    <strong>{language === 'en' ? 'See more' : 'थप हेर्नुहोस्'}</strong>
                                    <span>{language === 'en' ? 'View the full department list' : 'पूरा विभाग सूची हेर्नुहोस्'}</span>
                                  </div>
                                </a>
                              </div>
                            )}
                          </div>
                        );
                      });
                    })()}
                    {(resolvedNavItems[activeMegaIndex]?.label === 'FIND A DOCTOR' || resolvedNavItems[activeMegaIndex]?.label === 'डाक्टर खोज्नुहोस्') && (
                      <div style={{ padding: 12, width: '100%' }}>
                        <a
                          href="#doctors"
                          className="mega-entry see-more-entry"
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.hash = '#doctors';
                            setShowDoctorsPage(true);
                            setShowSuggestionPage(false);
                            setShowHealthPackagesPage(false);
                          }}
                        >
                          <div className="mega-entry-icon" aria-hidden="true">➕</div>
                          <div className="mega-entry-copy">
                            <strong>{language === 'en' ? 'See more doctors' : 'थप डाक्टरहरू'}</strong>
                            <span>{language === 'en' ? 'View full list of doctors' : ''}</span>
                          </div>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            
            {labReportOpen && (
              <div className="lab-report-fullpage" role="dialog" aria-modal="true" onClick={() => setLabReportOpen(false)}>
                <div className="lab-report-fullpage-header" onClick={(event) => event.stopPropagation()}>
                  <div>
                    <p className="eyebrow">{language === 'en' ? 'Lab Report' : 'ल्याब रिपोर्ट'}</p>
                    <h2>{language === 'en' ? 'Lab Report' : 'ल्याब रिपोर्ट'}</h2>
                  </div>
                  <button type="button" className="dialog-close-button" onClick={() => setLabReportOpen(false)} aria-label={language === 'en' ? 'Close dialog' : 'संवाद बन्द गर्नुहोस्'}>
                    ×
                  </button>
                </div>

                <div className="lab-report-fullpage-iframe-wrap" onClick={(event) => event.stopPropagation()}>
                  <iframe
                    src={labReportUrl}
                    title="Lab Report"
                    scrolling="no"
                    style={{ width: '100%', height: '100%', border: '0', overflow: 'hidden', maxWidth: '100%' }}
                  />
                </div>
              </div>
            )}
            </nav>
          </div>
        </header>

        <main>
          {showSuggestionPage ? (
            <SuggestionPage language={language} onBack={handleSuggestionClose} />
          ) : showHealthPackagesPage ? (
            <HealthPackagesPage language={language} onBack={handleHomeNavigation} />
          ) : showNewsEventsPage ? (
            <NewsEventsPage
              language={language}
              onBack={handleNewsEventsClose}
              galleryImages={activeGalleryAllImages}
              galleryVideos={combinedGalleryVideos}
            />
          ) : showDoctorProfile ? (
            <DoctorProfile doctor={selectedDoctor} language={language} onBack={() => { closeDoctorProfile(); setShowDoctorsPage(true); }} />
          ) : showBoardPage ? (
            <BoardPage language={language} members={t.boardMembers} onBack={handleBoardClose} />
          ) : showDepartmentPage ? (
            <DepartmentPage
              language={language}
              departments={t.navItems.find((item) => item.label === 'DEPARTMENT' || item.label === 'विभाग')?.menu || []}
              selectedDepartmentSlug={selectedDepartmentSlug}
            />
          ) : showDoctorsPage ? (
            <DoctorsPage language={language} doctors={doctorCatalogWithSlug} onBack={handleHomeNavigation} onSelectDoctor={openDoctorProfile} />
          ) : showAboutPage ? (
            <AboutPage language={language} onBack={handleAboutClose} />
          ) : (
            <>
          <section id="home" className="hero section min-h-screen flex items-center justify-center" style={{ minHeight: '1000px', height: '1000px' }}>
            <div className="hero-background">
                {resolvedHeroBanners.map((src, idx) => (
                  <div
                    key={`${src}-${idx}`}
                    className={`hero-background-layer ${bannerIndex === idx ? 'active' : ''}`}
                    style={{ backgroundImage: `url(${src})` }}
                  />
                ))}
              </div>
            <div className="container hero-grid mx-auto max-w-6xl">
              <div
                className={`hero-copy reveal transition-opacity transition-transform duration-500 ${contentVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}`}
              >
                <p className="eyebrow">{heroSlides[bannerIndex].eyebrow}</p>
                <h1 className={`hero-title hero-title-animated ${titleAnimate ? 'hero-title-active' : ''} ${language === 'en' ? '' : 'hero-title--nepali'}`}>{heroSlides[bannerIndex].title}</h1>
                <p className={`hero-text ${language === 'en' ? '' : 'hero-text--nepali'}`}>{heroSlides[bannerIndex].text}</p>
                <div className="hero-cta">
                  <div className="hero-service-badge">
                    {heroBadgeText}
                  </div>
                  <a
                    href="#doctors"
                    className="uiverse-button"
                    onMouseEnter={stopBannerRotation}
                    onMouseLeave={startBannerRotation}
                  >
                    {heroButtonText}
                    <svg
                      className="uiverse-icon"
                      viewBox="0 0 16 19"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                        className="uiverse-icon-path"
                      ></path>
                    </svg>
                  </a>
                  <div className="hero-nav-buttons">
                    <button
                      type="button"
                      className="nav-icon-button"
                      aria-label="Previous"
                      onClick={handlePrevBanner}
                      onMouseEnter={stopBannerRotation}
                      onMouseLeave={startBannerRotation}
                    >
                      <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M10 3L5 8L10 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="nav-icon-text">Prev</span>
                    </button>
                    <button
                      type="button"
                      className="nav-icon-button"
                      aria-label="Next"
                      onClick={handleNextBanner}
                      onMouseEnter={stopBannerRotation}
                      onMouseLeave={startBannerRotation}
                    >
                      <span className="nav-icon-text">Next</span>
                      <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M6 3L11 8L6 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="hero-visual reveal" />
            </div>

            <div className="hero-marquee" aria-hidden="true">
              <div className="hero-marquee-track">
                {t.hero.marqueeItems.concat(t.hero.marqueeItems).map((item, index) => (
                  <span key={`${item}-${index}`} className="hero-marquee-item">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="section board-section">
            <div className="container">
              <div className="section-head reveal">
                <p className="eyebrow">{t.boardSection.eyebrow}</p>
                {language === 'en' ? (
                  <h2>
                    <span className="board-heading-line">THE LEADERSHIP TEAM</span>
                    <span className="board-heading-callout">BEHIND OUR HOSPITAL VISION.</span>
                  </h2>
                ) : (
                  <h2><span className="board-heading-callout">{t.boardSection.title}</span></h2>
                )}
              </div>

              <div className="board-grid">
                {t.boardMembers.map((member) => {
                  const dashNamesEn = new Set(['Rajesh Sharma', 'Dr. Meera Joshi', 'Sita Rai', 'Nabin Adhikari']);
                  const dashNamesNp = new Set(['राजेश शर्मा', 'डा. मीरा जोशी', 'सीता राई', 'नबिन अधिकारी']);
                  const isDashed = dashNamesEn.has(member.name) || dashNamesNp.has(member.name);
                  return (
                    <article key={member.name} className="board-card reveal">
                      <div className={`board-media${!member.image ? ' board-media-placeholder' : ''}`}>
                        {member.image ? (
                          <img src={member.image} alt={member.name} />
                        ) : (
                          <svg className="board-profile-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                            <path d="M12 12.2a4.15 4.15 0 1 0-4.15-4.15A4.15 4.15 0 0 0 12 12.2Zm0 2.1c-4.36 0-7.9 2.31-7.9 5.16v.94h15.8v-.94c0-2.85-3.54-5.16-7.9-5.16Z" fill="currentColor" />
                          </svg>
                        )}
                      </div>
                      <div className="board-content">
                        {isDashed ? (
                          <>
                            <div className="board-dash">---------------</div>
                          </>
                        ) : (
                          <> 
                            <h3>{member.name}</h3>
                            <span className="board-role">{member.role}</span>
                          </>
                        )}
                        <p>{member.description}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          
          <section id="about" className="section doctors">
            <div className="container">
              <div className="section-head reveal doctors-header-row">
                <div className="doctors-heading-copy">
                  <p className="eyebrow">{t.doctorsSection.eyebrow}</p>
                  <h2>{t.doctorsSection.title}</h2>
                </div>

                <div className="departments-tab">
                  <ul ref={tabListRef}>
                    <div className="tab-indicator" style={tabIndicatorStyle} />
                    {departmentTabs.map((tab) => (
                      <li key={tab.title}>
                        <button
                          type="button"
                          className={tab.title === activeDepartment ? 'active' : ''}
                          onClick={() => setActiveDepartment(tab.title)}
                        >
                          {tab.title}
                        </button>
                      </li>
                    ))}
                    {/* More button: navigates to doctors page */}
                    <li className="departments-dropdown">
                      <button
                        type="button"
                        onClick={() => {
                          window.location.hash = 'doctors';
                          setShowDoctorsPage(true);
                          setShowSuggestionPage(false);
                          setShowHealthPackagesPage(false);
                        }}
                      >
                        more
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="doctor-grid">
                <article className={`doctor-card reveal doctor-card-message ${language === 'en' ? '' : 'nepali'}`}>
                  {language === 'en' ? (
                    <>
                      <h3>Experienced<br />Professionals<br />Doctors</h3>
                      <p>Delivering compassionate care through trusted expertise and personalized attention for every patient.</p>
                    </>
                  ) : (
                    <>
                      <h3>अनुभवी तथा दक्ष चिकित्सकहरू</h3>
                      <p>विश्वसनीय विशेषज्ञता र प्रत्येक बिरामीप्रति व्यक्तिगत ध्यानका साथ करुणामय स्वास्थ्य सेवा प्रदान गर्दै।</p>
                    </>
                  )}
                </article>

                {(isMobileViewport ? filteredDoctors.slice(0, 7) : filteredDoctors).map((doctor) => (
                  <article key={doctor.name} className="doctor-card reveal doctor-card-feature" role="button" tabIndex={0} onClick={() => openDoctorProfile(doctor)} onKeyDown={(e) => { if (e.key === 'Enter') openDoctorProfile(doctor); }}>
                    <div className="doctor-card-demo-visual">
                      <img
                        src={doctor.image || doctorImage}
                        alt={doctor.name}
                        className="doctor-card-demo-image"
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = doctor1Image; }}
                      />
                      <div className="doctor-card-demo-overlay">
                        <div className="doctor-card-demo-badge">
                          <span className="doctor-card-demo-dot" aria-hidden="true" />
                          <span className="specialty">{doctor.department || doctor.specialty}</span>
                        </div>
                        <h3 className="doctor-card-demo-name">{doctor.name}</h3>
                        <span>{doctor.specialty || doctor.department}{doctor.experience ? ` • ${doctor.experience}` : ''}</span>
                      </div>
                    </div>
                  </article>
                ))}

                {isMobileViewport
                  ? filteredDoctors.length > 7 && (
                    <article className="doctor-card reveal doctor-card-see-more">
                      <a
                        href="#doctors"
                        className="uiverse-button doctor-see-more-button"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.hash = '#doctors';
                          setShowDoctorsPage(true);
                          setShowSuggestionPage(false);
                          setShowHealthPackagesPage(false);
                        }}
                      >
                        {language === 'en' ? 'See more doctors' : 'थप डाक्टरहरू हेर्नुहोस्'}
                        <svg
                          className="uiverse-icon"
                          viewBox="0 0 16 19"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                            className="uiverse-icon-path"
                          ></path>
                        </svg>
                      </a>
                    </article>
                  )
                  : t.doctors.filter((doctor) => doctor.action === 'see-more').map((doctor) => (
                    <article key={doctor.label} className="doctor-card reveal doctor-card-see-more">
                      <a
                        href="#doctors"
                        className="uiverse-button doctor-see-more-button"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.hash = '#doctors';
                          setShowDoctorsPage(true);
                          setShowSuggestionPage(false);
                          setShowHealthPackagesPage(false);
                        }}
                      >
                        {doctor.label}
                        <svg
                          className="uiverse-icon"
                          viewBox="0 0 16 19"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                            className="uiverse-icon-path"
                          ></path>
                        </svg>
                      </a>
                    </article>
                  ))}
              </div>
            </div>

            {/* Department dialog removed — replaced with a More dropdown in the tabs */}
          </section>

          <section id="services" className="section services services-section">
            <div className="container">
              <div className="services-grid">
                <div className="left-content reveal">
                  <div className="section-head">
                    <p className="eyebrow">{t.servicesSection.eyebrow}</p>
                    <h2>{t.servicesSection.title}</h2>
                  </div>
                  <p className="services-copy">
                    {language === 'en'
                      ? 'We provide compassionate care across maternity, family medicine, pediatrics, diagnostics, and emergency support—designed to make every visit feel clear, calm, and reassuring.'
                      : 'हामी प्रसवपूर्व, परिवार चिकित्सा, बालचिकित्सा, निदान र आपतकालीन सहयोगमा सहानुभूतिपूर्ण सेवा प्रदान गर्छौं—प्रत्येक भ्रमणलाई स्पष्ट, शान्त र भरोसेमय बनाउने लागि।'}
                  </p>
                </div>

                <div className="middle-column reveal">
                  <div className="section-head middle-heading">
                    <h3>{t.servicesMiddleHeading.title}</h3>
                    <p className="middle-heading-sub">{language === 'ne' ? <strong>{t.servicesMiddleHeading.subtitle}</strong> : t.servicesMiddleHeading.subtitle}</p>
                  </div>
                  <article className="large-card first-service-card">
                    <AnimatedServiceCardImage
                      currentSrc={serviceImageSets[serviceImageSetIndex][0]}
                      alt="Maternity care"
                    />
                    <span className="service-card-icon" aria-hidden="true">
                      <ArrowRight size={18} />
                    </span>
                  </article>
                </div>

                <div className="right-column reveal">
                  <article className="small-card tall-service-card">
                    <AnimatedServiceCardImage
                      currentSrc={serviceImageSets[serviceImageSetIndex][1]}
                      alt="General medicine"
                    />
                    <span className="service-card-icon" aria-hidden="true">
                      <ArrowRight size={18} />
                    </span>
                  </article>

                  <article className="small-card">
                    <AnimatedServiceCardImage
                      currentSrc={serviceImageSets[serviceImageSetIndex][2]}
                      alt="Pediatric care"
                    />
                    <span className="service-card-icon" aria-hidden="true">
                      <ArrowRight size={18} />
                    </span>
                  </article>

                  <div className="review-card-shell">
                    <div className="review-box">
                      <div className="service-info-rating">★★★★★</div>
                      <p>
                        {language === 'en'
                          ? 'Trusted care with warmth, precision, and dignity.'
                          : 'विश्वसनीय सेवा, न्यानो समर्थन र गरिमा।'}
                      </p>
                      <a href="#contact">Explore more</a>
                    </div>
                  </div>
                </div>
              </div>
              {/* services cards moved to their own full-width section for background image */}
            </div>
          </section>

          <section className="service-areas-section">
            <div className="container">
              <div className="services-card-heading reveal">
                <h3>{t.servicesCardHeading}</h3>
                <p className="services-card-sub">{t.servicesCardSubheading}</p>
              </div>
              <div className="services-card-grid reveal">
                {visibleServices.map((service) => {
                  const Icon = serviceIconMap[service.icon] || Stethoscope;
                  return (
                    <article key={service.title} className="service-summary-card">
                      <div className="service-summary-card-shape">
                        <div className="service-summary-card-icon">
                          <Icon size={28} />
                        </div>
                        <div className="service-summary-card-content">
                          <h3>{service.title}</h3>
                          <p>{service.description}</p>
                        </div>
                      </div>
                      <span className="service-summary-card-arrow" aria-hidden="true">
                        <ArrowRight size={18} />
                      </span>
                    </article>
                  );
                })}

                {shouldShowServiceMoreButton && (
                  <article className="service-summary-card service-summary-card-more">
                    <button
                      type="button"
                      className="service-summary-card-more-button"
                      onClick={() => setVisibleServiceCards((current) => Math.min(current + 5, (t.services || []).length))}
                    >
                      {language === 'en' ? 'See more' : 'थप हेर्नुहोस्'}
                    </button>
                  </article>
                )}
              </div>
            </div>
          </section>


          <section className="stats-wrap">
            <div className="container stats-grid reveal">
              {t.stats.map((stat) => (
                <div key={stat.label} className="stat-card">
                  <AnimatedStatValue value={stat.value} />
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </section>

          

          <section className="section why-choose-section">
            <div className="container why-choose-shell reveal">
              <div className="why-choose-column why-choose-column--benefits">
                <div className="why-choose-card why-choose-card--single why-choose-card--image why-choose-card--image-with-caption">
                  <div className="why-choose-image-caption">
                    {t.whyChoose.benefits.map((b) => (
                      <div key={b} className="why-choose-image-list-item"><span className="why-choose-image-check" aria-hidden="true">✓</span>{b}</div>
                    ))}
                    </div>
                  <img src={whyToChooseUsImage1} alt="Why choose us" />
                  <div className="why-choose-image-footer">{t.whyChoose.caption} {t.whyChoose.captionHighlight ? <span className="why-choose-image-highlight">{t.whyChoose.captionHighlight}</span> : ''}</div>
                </div>
              </div>

              <div className="why-choose-column why-choose-column--copy">
                <div className="why-choose-copy">
                  <p className="why-choose-eyebrow">{t.whyChoose.eyebrow}</p>
                  <h2>
                    {t.whyChoose.pillars.map((p) => (
                      <span key={p}>{p}</span>
                    ))}
                  </h2>
                  <div className="why-choose-info-card why-choose-info-card--image">
                    <img src={whyToChooseUsImage} alt="Why choose us" />
                  </div>
                </div>
              </div>

              <div className="why-choose-column why-choose-column--visual" aria-hidden="true">
                <div className="why-choose-visual-card">
                  <img src={whyToChooseUsImage2} alt="" />
                </div>
                <div className="why-choose-card why-choose-card--single why-choose-card--support-card">
                    <div className="why-choose-support-card-lines">
                      {t.whyChoose.supportLines.map((s) => (
                        <span key={s}>{s}</span>
                      ))}
                    </div>
                </div>
              </div>
            </div>
          </section>

          <section id="testimonials" className="section testimonials">
            <div className="container">
              <div className="section-head reveal">
                <p className="eyebrow">{t.testimonials.eyebrow}</p>
                <h2>{t.testimonials.title}</h2>
              </div>

              <div className="testimonial-grid testimonial-scroll">
                <div className="testimonial-track">
                  {t.testimonialsList.concat(t.testimonialsList).map((item, index) => (
                    <div key={`${item.name}-${index}`} className="testimonial-card reveal">
                      <div className="testimonial-card-header" style={{ backgroundColor: item.color }}>
                        <p className="testimonial-card-label">{item.label}</p>
                      </div>
                      <div className="testimonial-card-content">
                        <p className="testimonial-card-quote">"{item.quote}"</p>
                        <div className="testimonial-card-rating">
                          {[...Array(item.rating)].map((_, i) => (
                            <span key={i} className="star">★</span>
                          ))}
                        </div>
                        <div className="testimonial-card-profile">
                          <div className="testimonial-card-info">
                            <p className="testimonial-card-name">{item.name}</p>
                            <p className="testimonial-card-role">{item.role}</p>
                          </div>
                          <div className="testimonial-card-dots">
                            <span>●</span><span>●</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="section gallery-section">
            <div className="container">
              <div className="section-head reveal">
                <p className="eyebrow">{t.gallery.eyebrow}</p>
                <h2><span>{t.gallery.title}</span></h2>
              </div>

              <div className="gallery-split">
                <div className="gallery-panel gallery-panel--image">
                  <div className="gallery-main-image reveal">
                    <img
                      key={`gallery-img-${galleryMainIndex}`}
                      className={`gallery-main-image-img gallery-slide-${galleryTransitionDirection} loaded`}
                      src={activeGalleryAllImages[galleryMainIndex]?.src || defaultGalleryAllImages[0].src}
                      alt={activeGalleryAllImages[galleryMainIndex]?.alt || defaultGalleryAllImages[0].alt}
                      onLoad={() => setGalleryMainImageLoaded(true)}
                    />
                    <button type="button" className="gallery-image-nav gallery-image-prev" onClick={handleGalleryPrev} aria-label="Previous gallery image">
                      <ArrowRight size={20} />
                    </button>
                    <button type="button" className="gallery-image-nav gallery-image-next" onClick={handleGalleryNext} aria-label="Next gallery image">
                      <ArrowRight size={20} />
                    </button>
                  </div>
                  <div className="gallery-thumbnails">
                    {(isMobileViewport ? galleryImages.slice(0, 3) : galleryImages.slice(0, 4)).map((item, index) => (
                      <button
                        key={item.id || `${item.src}-${index}`}
                        type="button"
                        className="gallery-thumb reveal"
                        onClick={() => handleGallerySelect(index)}
                      >
                        <img src={item.src} alt={item.alt} />
                      </button>
                    ))}
                    <button type="button" className="gallery-thumb gallery-thumb--see-more reveal">
                      <div className="see-more-card">
                        <span>{language === 'en' ? 'See more' : 'थप हेर्नुहोस्'}</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="gallery-panel gallery-panel--video" ref={galleryVideoRef}>
                  {selectedVideoIndex === null ? (
                    <div className="video-grid">
                      {galleryVideos.slice(0, 4).map((video, index) => (
                        <div key={video.title || `${video.fallbackText}-${index}`} className="video-card reveal">
                          <div
                            className="video-card-hover-layer"
                            aria-hidden="true"
                            onClick={() => handleVideoSelect(index)}
                          />
                          {video.embedUrl ? (
                            <iframe
                              title={video.title}
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
                          ) : (
                            <div className="video-card-fallback">
                              <p>{video.fallbackText}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="video-selected-layout">
                      <div className="video-selected-main reveal">
                        <div className="video-card video-card--featured">
                          <div className="video-card-hover-layer video-card-hover-layer--disabled" aria-hidden="true" />
                          {selectedVideo.embedUrl ? (
                            <iframe
                              title={selectedVideo.title}
                              src={selectedVideo.embedUrl}
                              width="100%"
                              height="100%"
                              style={{ border: 'none', overflow: 'hidden' }}
                              scrolling="no"
                              frameBorder="0"
                              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                              allowFullScreen
                              loading="lazy"
                              referrerPolicy="strict-origin-when-cross-origin"
                              onMouseDown={lockScrollTemporarily}
                            />
                          ) : (
                            <div className="video-card-fallback video-card-fallback--featured">
                              <p>{selectedVideo.fallbackText}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="video-selected-list">
                        {combinedGalleryVideos.map((video, index) =>
                          index !== selectedVideoIndex ? (
                            <button
                              key={video.title || `${video.fallbackText}-${index}`}
                              type="button"
                              className="video-side-card reveal"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => handleVideoSelect(index)}
                            >
                              <div className="video-side-card-frame">
                                {video.embedUrl ? (
                                  <iframe
                                    title={video.title}
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
                                ) : (
                                  <div className="video-card-fallback video-card-fallback--side">
                                    <p>{video.fallbackText}</p>
                                  </div>
                                )}
                                <span className="video-side-card-icon">▶</span>
                              </div>
                            </button>
                          ) : null
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
            </>
          )}
        </main>

        <footer className="site-footer">
          <div className="container footer-grid">
            <div className="footer-brand-block">
              <a className="footer-logo-link" href="/" aria-label="Go to home page" onClick={(e) => { e.preventDefault(); handleHomeNavigation(); }}>
                <img src={footerLogo} alt="Vinayak Hospital logo" className="footer-logo" />
              </a>
              <p className="footer-tagline">
                {language === 'ne' ? (
                  <>
                    <strong>‘विनायक’ शब्दले संस्कृतमा उत्तम स्वास्थ्यको अर्थ बोकेको छ!</strong>
                    <br />
                    <strong>हामी विश्वास गर्छौं कि प्रत्येक मानव स्वस्थ र निरोगी जीवन बिताउन सक्षम हुनुपर्छ।</strong>
                  </>
                ) : (
                  'Vinayak means possessing good health in Sanskrit! We believe every human being must have good health.'
                )}
              </p>
            </div>

            <div>
              <h4>{t.footer.quickLinks}</h4>
              <ul>
                {t.footer.links.map((link, index) => (
                  <li key={`${link.href || 'link'}-${link.label || index}`}><a href={link.href}>{link.label}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4>{t.footer.hours}</h4>
              <ul>
                {t.footer.hoursList.map((item, index) => (
                  <li key={`${item}-${index}`}>{item}</li>
                ))}
              </ul>
              <h4 className="footer-services-heading">{t.footer.ourServices}</h4>
              <ul>
                {footerOurServicesList.map((item, index) => (
                  <li key={`${item}-${index}`}><a href="#services">{item}</a></li>
                ))}
              </ul>
            </div>

            <div className="footer-right-column">
              <div className="footer-contact-panel">
                <h4>{t.footer.contact}</h4>
                <ul>
                  {[...contactPhoneNumbers, activeContactEmail, activeContactLocation].map((item, index) => {
                    const value = String(item);
                    const isEmail = value.includes('@');
                    const isPhone = /^\+?[\d\s()-]+$/.test(value);
                    return (
                      <li key={`${value}-${index}`}>
                        {isEmail ? (
                          <a href={`mailto:${value}`} className="contact-link">{item}</a>
                        ) : isPhone ? (
                          <a href={`tel:${value.replace(/[^\d+]/g, '')}`} className="contact-link">{item}</a>
                        ) : (
                          item
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="footer-location-block">
                <h4>{language === 'en' ? 'Location' : 'स्थान'}</h4>
                <p className="footer-location-text">{activeContactLocation}</p>
                <div className="footer-map-frame">
                  <iframe
                    title="Vinayak Hospital Location"
                    src="https://www.google.com/maps?q=Gongabu%20Kathmandu%20Nepal&z=14&output=embed"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <p>© {new Date().getFullYear()} Vinayak Hospital & Maternity Home | All Rights Reserved</p>
          </div>
        </footer>
      </div>

      <div ref={chatWidgetRef} className={`chat-widget${isChatOpen ? ' open' : ''}`}>
        <div className="chat-header">
          <div className="chat-header-title">
            <div>
              <span className="chat-header-label">Vinayak Hospital</span>
              <h4>We're here to help you</h4>
            </div>
          </div>
        </div>

        <div className={`chat-card${showQr ? ' chat-card--compact' : ''}`}>
          {!showQr ? (
            <>
              <div className="chat-agent-card">
                <div className="chat-agent-avatar-shell">
                  <img src={whatsappProfile} alt="Emma Gurung" className="chat-agent-avatar" />
                  <span className="chat-agent-status" aria-label="Online"></span>
                </div>
                <div className="chat-agent-info">
                  <strong>{chatAgentName}</strong>
                  <span>{chatAgentSecondary}</span>
                </div>
              </div>

              <div className="chat-whatsapp-actions">
                <button type="button" className="chat-whatsapp-btn" onClick={handleQrOpen}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.149-.672.15-.198.297-.768.967-.942 1.165-.173.198-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.52-.075-.149-.672-1.617-.922-2.214-.242-.579-.487-.5-.672-.51l-.573-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.077 4.487.71.306 1.262.489 1.693.626.71.227 1.355.195 1.866.118.57-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.174-1.414-.074-.124-.272-.198-.57-.347z" fill="#ffffff" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M12.004 2C6.486 2 2 6.485 2 12.002c0 2.115.631 4.077 1.709 5.738L2 22l4.385-1.152A9.938 9.938 0 0 0 12.005 22C17.523 22 22 17.515 22 12.002 22 6.485 17.523 2 12.004 2zm0 18.23a8.24 8.24 0 0 1-4.393-1.23l-.314-.187-2.603.683.7-2.551-.204-.33A8.193 8.193 0 0 1 3.77 12.002c0-4.54 3.692-8.232 8.235-8.232 4.543 0 8.235 3.692 8.235 8.232 0 4.54-3.692 8.232-8.236 8.232z" fill="#ffffff" />
                  </svg>
                  <span>Chat on WhatsApp</span>
                </button>
                <button
                  type="button"
                  className={showQr ? 'chat-qr-btn active' : 'chat-qr-btn'}
                  aria-expanded={showQr}
                  aria-label="Open QR code"
                  onClick={handleQrOpen}
                >
                  <QrCode size={16} />
                </button>
              </div>
            </>
          ) : (
            <div className={`chat-qr-panel chat-qr-panel--compact${qrAnimating ? ' chat-qr-panel--entering' : ''}`}>
              <div className="chat-qr-header-row">
                <div className="chat-qr-header">
                  <div className="chat-agent-avatar-shell chat-agent-avatar-shell--centered">
                    <img src={whatsappProfile} alt="Emma Gurung" className="chat-agent-avatar chat-agent-avatar--large" />
                  </div>
                  <div className="chat-agent-info chat-agent-info--centered">
                    <strong>{chatAgentName}</strong>
                    <span>{chatAgentSecondary}</span>
                  </div>
                </div>
                <button type="button" className="chat-qr-close-btn" onClick={handleQrClose} aria-label="Close QR panel">
                  <X size={16} />
                </button>
              </div>
              <div className="chat-qr-image-block">
                <img
                  src={whatsappQrImage}
                  alt="WhatsApp QR code"
                  className="chat-qr-code chat-qr-code--compact"
                  aria-label="WhatsApp QR code"
                />
                <p className="chat-qr-note chat-qr-note--compact">Scan to chat on WhatsApp</p>
              </div>
            </div>
          )}
        </div>

        <div className="chat-support-section">
          <p className="chat-support-label">Additional support</p>
          <div className="chat-support-card">
            <div className="chat-support-text-block">
              <p className="chat-support-name">Binita Gurung</p>
              <p className="chat-support-phone">{chatAgentSecondary}</p>
            </div>
            <button
              type="button"
              className={`chat-copy-btn${chatCopied ? ' copied' : ''}`}
              onClick={handleCopyNumber}
            >
              {chatCopied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
              <span>{chatCopied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <div className="chat-feedback-section">
          <p className="chat-support-label">Feedback & Support</p>
          <div className="chat-feedback-buttons">
            <button type="button">Give feedback</button>
            <button type="button">Rate Us</button>
          </div>
        </div>
      </div>

      {!isChatOpen && (
        <div className="floating-actions-stack" aria-label="Quick actions">
          {showScrollTop && (
            <button
              type="button"
              className="scroll-top-btn"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Scroll to top"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: 18, height: 18 }}>
                <path d="M12 19V5" />
                <path d="m5 12 7-7 7 7" />
              </svg>
            </button>
          )}
          <button
            type="button"
            className="chat-launcher-btn"
            onClick={() => setIsChatOpen(true)}
            aria-label="Open chat widget"
          >
            <MessageCircle size={20} />
          </button>
        </div>
      )}
    </>
  );
}

export default App;
