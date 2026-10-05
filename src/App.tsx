import { useState, useEffect, FormEvent, useCallback } from 'react';
import { getSupabase, isSupabaseConfigured, QUERIES_TABLE } from './lib/supabase';
import { AdManager, AdInContent } from './components/AdManager';

type Language = 'hi' | 'en';

interface QueryEntry {
  id: string;
  name: string;
  mobile: string;
  district: string;
  query: string;
  timestamp: string;
}

const ADMIN_PASSWORD = 'admin2026';
const STORAGE_KEY = 'ladlibehna_queries';
const USE_SUPABASE = isSupabaseConfigured();

const translations = {
  hi: {
    nav: {
      home: 'होम',
      benefits: 'लाभ',
      eligibility: 'पात्रता',
      procedure: 'आवेदन प्रक्रिया',
      contact: 'संपर्क करें',
    },
    hero: {
      title: 'मध्य प्रदेश लाड़ली बहना योजना',
      subtitle: 'मध्य प्रदेश शासन द्वारा महिला सशक्तिकरण की दिशा में एक ऐतिहासिक कदम',
      description: 'मुख्यमंत्री लाड़ली बहना योजना के अंतर्गत पात्र महिलाओं को प्रति माह ₹1,250 का वित्तीय सहायता सीधे उनके बैंक खाते में DBT के माध्यम से प्रदान किया जाता है।',
      checkEligibility: 'पात्रता जांचें',
      applicationProcedure: 'आवेदन प्रक्रिया',
    },
    updates: {
      title: 'नवीनतम अपडेट एवं तिथियाँ',
      subtitle: 'योजना से संबंधित महत्वपूर्ण तिथियाँ एवं सूचनाएँ',
      items: [
        { date: 'प्रत्येक माह की 10 तारीख', title: 'मासिक किस्त वितरण', desc: 'DBT के माध्यम से सीधे बैंक खाते में ₹1,250 का अंतरण' },
        { date: '15 जुलाई 2026', title: 'अगली किस्त तिथि', desc: 'जुलाई 2026 की किस्त का वितरण' },
        { date: '01 अगस्त - 31 अगस्त 2026', title: 'नवीन पंजीकरण विंडो', desc: 'नए आवेदनों के लिए पंजीकरण अवधि' },
        { date: '01 जून 2026', title: 'e-KYC अपडेट अंतिम तिथि', desc: 'समग्र ID से आधार लिंक हेतु अंतिम तिथि' },
      ],
    },
    benefits: {
      title: 'योजना के प्रमुख लाभ',
      subtitle: 'महिला सशक्तिकरण एवं आर्थिक स्वतंत्रता के लिए',
      items: [
        { title: '₹1,250 प्रति माह', desc: 'सीधे बैंक खाते में DBT के माध्यम से वित्तीय सहायता', icon: '💰' },
        { title: 'आर्थिक स्वतंत्रता', desc: 'महिलाओं को आर्थिक रूप से आत्मनिर्भर बनाना', icon: '🌟' },
        { title: 'सम्मानजनक जीवन', desc: 'महिलाओं के सम्मानजनक जीवन यापन में सहायता', icon: '👩' },
        { title: 'समावेशी विकास', desc: 'समाज के सभी वर्गों की महिलाओं का समावेशी विकास', icon: '🤝' },
      ],
    },
    eligibility: {
      title: 'पात्रता मानदंड',
      subtitle: 'योजना के लिए आवेदन हेतु निम्नलिखित शर्तें पूर्ण होना आवश्यक है',
      criteria: [
        'आवेदक मध्य प्रदेश की स्थायी निवासी (Domicile) हो',
        'आयु सीमा: 21 वर्ष से 60 वर्ष के मध्य',
        'विवाहित महिला / विधवा / तलाकशुदा / परित्यक्ता',
        'परिवार की वार्षिक आय ₹2,50,000 से अधिक न हो',
        'परिवार में कोई आयकर दाता न हो',
        'परिवार में कोई सरकारी सेवक (केंद्र/राज्य) न हो',
      ],
      exclusions: 'अपात्र श्रेणियाँ:',
      exclusionsList: [
        'केंद्र/राज्य सरकार के कर्मचारी',
        'आयकर दाता परिवार',
        '₹2,50,000 से अधिक वार्षिक आय वाले परिवार',
      ],
    },
    checker: {
      title: 'इंटरैक्टिव पात्रता जाँच',
      subtitle: 'नीचे दिए गए विकल्पों को भरकर अपनी पात्रता तुरंत जांचें',
      age: 'आयु (वर्ष)',
      agePlaceholder: 'अपनी आयु दर्ज करें',
      domicile: 'मध्य प्रदेश निवासी?',
      married: 'विवाहित महिला?',
      incomeTax: 'क्या परिवार में आयकर दाता है?',
      yes: 'हाँ',
      no: 'नहीं',
      verify: 'पात्रता सत्यापित करें',
      eligible: '✅ बधाई हो! आप इस योजना के लिए पात्र हैं।',
      notEligible: '⚠️ क्षमा करें, आप इस योजना के लिए पात्र नहीं हैं। कृपया ऊपर दिए गए मानदंडों की जांच करें।',
      ageError: 'कृपया वैध आयु दर्ज करें (21-60 वर्ष)',
    },
    procedure: {
      title: 'आवेदन प्रक्रिया',
      subtitle: 'नीचे दिए गए चरणों का पालन करके आवेदन करें',
      steps: [
        { title: 'चरण 1: दस्तावेज़ तैयार करें', desc: 'समग्र ID को आधार से e-KYC के माध्यम से लिंक करें। आधार कार्ड, समग्र ID, बैंक पासबुक एवं पासपोर्ट साइज फोटो तैयार रखें।' },
        { title: 'चरण 2: निकटतम केंद्र पर जाएँ', desc: 'अपने नज़दीकी ग्राम पंचायत / वार्ड कार्यालय / विशेष शिविर में जाएँ।' },
        { title: 'चरण 3: फॉर्म जमा करें', desc: 'अधिकारी द्वारा बायोमेट्रिक/फोटो सत्यापन के साथ फॉर्म भरा जाएगा एवं जमा किया जाएगा।' },
        { title: 'चरण 4: स्थिति ट्रैक करें', desc: 'आवेदन संख्या का उपयोग करके पोर्टल पर आवेदन की स्थिति ट्रैक करें।' },
      ],
    },
    contact: {
      title: 'संपर्क एवं शिकायत फॉर्म',
      subtitle: 'अपना प्रश्न या शिकायत यहाँ दर्ज करें',
      name: 'पूरा नाम',
      namePlaceholder: 'अपना पूरा नाम दर्ज करें',
      mobile: 'मोबाइल नंबर',
      mobilePlaceholder: '10 अंकों का मोबाइल नंबर',
      district: 'जिला',
      districtPlaceholder: 'अपना जिला चुनें',
      query: 'प्रश्न / शिकायत',
      queryPlaceholder: 'अपना प्रश्न या शिकायत विस्तार से लिखें...',
      submit: 'शिकायत दर्ज करें',
      nameError: 'कृपया अपना नाम दर्ज करें',
      mobileError: 'कृपया वैध 10 अंकों का मोबाइल नंबर दर्ज करें',
      districtError: 'कृपया जिला चुनें',
      queryError: 'कृपया अपना प्रश्न/शिकायत दर्ज करें',
      successTitle: 'धन्यवाद!',
      successMessage: 'आपकी प्रतिक्रिया सफलतापूर्वक दर्ज की गई है।',
      closeModal: 'बंद करें',
    },
    footer: {
      officialWebsite: 'आधिकारिक वेबसाइट',
      helpdesk: 'हेल्पडेस्क नंबर',
      email: 'ईमेल',
      disclaimer: 'अस्वीकरण: यह एक सिम्युलेटेड टेम्पलेट है जो संरचनात्मक मार्गदर्शन के लिए निर्मित किया गया है। यह मध्य प्रदेश सरकार की आधिकारिक वेबसाइट नहीं है।',
      rights: '© 2026 मध्य प्रदेश लाड़ली बहना योजना | सभी अधिकार सुरक्षित',
      designedFor: 'संरचनात्मक मार्गदर्शन हेतु डिज़ाइन किया गया',
    },
    admin: {
      title: '🔐 एडमिन पैनल - सभी शिकायतें',
      subtitle: 'यहाँ सभी सबमिट की गई शिकायतें/प्रश्न दिखाई देते हैं',
      password: 'पासवर्ड दर्ज करें',
      passwordPlaceholder: 'एडमिन पासवर्ड...',
      login: 'लॉगिन',
      logout: 'लॉगआउट',
      wrongPassword: 'गलत पासवर्ड!',
      noQueries: 'कोई शिकायत अभी तक प्राप्त नहीं हुई।',
      totalQueries: 'कुल शिकायतें',
      deleteAll: 'सब हटाएँ',
      deleteOne: 'हटाएँ',
      confirmDelete: 'क्या आप वाकई सभी शिकायतें हटाना चाहते हैं?',
      name: 'नाम',
      mobile: 'मोबाइल',
      district: 'जिला',
      query: 'शिकायत',
      date: 'तिथि',
      close: 'पैनल बंद करें',
      exportData: 'डेटा निर्यात करें (JSON)',
    },
    districts: [
      'जबलपुर', 'भोपाल', 'इंदौर', 'ग्वालियर', 'उज्जैन', 'सागर',
      'रीवा', 'शहडोल', 'सतना', 'छतरपुर', 'दमोह', 'पन्ना',
      'टीकमगढ़', 'दतिया', 'भिंड', 'मुरैना', 'मंदसौर', 'नीमच',
      'रतलाम', 'झाबुआ', 'धर', 'बड़वानी', 'खरगोन', 'खंडवा',
      'हरदा', 'होशंगाबाद', 'बेतूल', 'छिंदवाड़ा', 'सिवनी', 'बालाघाट',
      'मंडला', 'दिंडोरी', 'अनूपपुर', 'कटनी', 'नरसिंहपुर', 'विदिशा',
      'रायसेन', 'राजगढ़', 'शाजापुर', 'आगर-मालवा', 'देवास', 'सीहोर',
      'अशोकनगर', 'गुना', 'शिवपुरी', 'अलीराजपुर', 'बैतूल', 'बुरहानपुर',
    ],
  },
  en: {
    nav: {
      home: 'Home',
      benefits: 'Benefits',
      eligibility: 'Eligibility',
      procedure: 'Procedure',
      contact: 'Contact',
    },
    hero: {
      title: 'Madhya Pradesh Ladli Behna Yojana',
      subtitle: 'A historic step towards women empowerment by the Government of Madhya Pradesh',
      description: 'Under the Mukhyamantri Ladli Behna Yojana, eligible women receive financial assistance of ₹1,250 per month directly transferred to their bank accounts via DBT.',
      checkEligibility: 'Check Eligibility',
      applicationProcedure: 'Application Procedure',
    },
    updates: {
      title: 'Latest Updates & Dates',
      subtitle: 'Important dates and information related to the scheme',
      items: [
        { date: '10th of every month', title: 'Monthly Installment Disbursement', desc: '₹1,250 transferred directly to bank account via DBT' },
        { date: '15th July 2026', title: 'Next Installment Date', desc: 'Disbursement of July 2026 installment' },
        { date: '01 Aug - 31 Aug 2026', title: 'New Registration Window', desc: 'Registration period for new applications' },
        { date: '01 June 2026', title: 'e-KYC Update Deadline', desc: 'Last date for linking Samagra ID with Aadhaar' },
      ],
    },
    benefits: {
      title: 'Key Benefits of the Scheme',
      subtitle: 'For women empowerment and financial independence',
      items: [
        { title: '₹1,250 Per Month', desc: 'Financial assistance directly to bank account via DBT', icon: '💰' },
        { title: 'Financial Independence', desc: 'Making women economically self-reliant', icon: '🌟' },
        { title: 'Dignified Life', desc: 'Supporting women in leading a dignified life', icon: '👩' },
        { title: 'Inclusive Development', desc: 'Inclusive development of women from all sections of society', icon: '🤝' },
      ],
    },
    eligibility: {
      title: 'Eligibility Criteria',
      subtitle: 'The following conditions must be fulfilled to apply for the scheme',
      criteria: [
        'Applicant must be a permanent resident (Domicile) of Madhya Pradesh',
        'Age limit: Between 21 to 60 years',
        'Married women / Widows / Divorced / Abandoned women',
        'Family annual income should not exceed ₹2,50,000',
        'No income tax payer in the family',
        'No government servant (Central/State) in the family',
      ],
      exclusions: 'Excluded Categories:',
      exclusionsList: [
        'Central/State government employees',
        'Income tax paying families',
        'Families with annual income above ₹2,50,000',
      ],
    },
    checker: {
      title: 'Interactive Eligibility Check',
      subtitle: 'Check your eligibility instantly by filling the options below',
      age: 'Age (Years)',
      agePlaceholder: 'Enter your age',
      domicile: 'MP Resident?',
      married: 'Married Woman?',
      incomeTax: 'Any income tax payer in family?',
      yes: 'Yes',
      no: 'No',
      verify: 'Verify Eligibility',
      eligible: '✅ Congratulations! You are eligible for this scheme.',
      notEligible: '⚠️ Sorry, you are not eligible for this scheme. Please check the criteria above.',
      ageError: 'Please enter a valid age (21-60 years)',
    },
    procedure: {
      title: 'Application Procedure',
      subtitle: 'Apply by following the steps below',
      steps: [
        { title: 'Step 1: Prepare Documents', desc: 'Link Samagra ID with Aadhaar through e-KYC. Keep Aadhaar card, Samagra ID, bank passbook, and passport-size photo ready.' },
        { title: 'Step 2: Visit Nearest Center', desc: 'Go to your nearest Gram Panchayat / Ward Office / Special Camp.' },
        { title: 'Step 3: Submit Form', desc: 'The form will be filled and submitted by the officer with biometric/photo verification.' },
        { title: 'Step 4: Track Status', desc: 'Track your application status on the portal using the application number.' },
      ],
    },
    contact: {
      title: 'Contact & Grievance Form',
      subtitle: 'Submit your query or grievance here',
      name: 'Full Name',
      namePlaceholder: 'Enter your full name',
      mobile: 'Mobile Number',
      mobilePlaceholder: '10-digit mobile number',
      district: 'District',
      districtPlaceholder: 'Select your district',
      query: 'Query / Grievance',
      queryPlaceholder: 'Write your query or grievance in detail...',
      submit: 'Submit Grievance',
      nameError: 'Please enter your name',
      mobileError: 'Please enter a valid 10-digit mobile number',
      districtError: 'Please select a district',
      queryError: 'Please enter your query/grievance',
      successTitle: 'Thank You!',
      successMessage: 'Your feedback has been simulated successfully.',
      closeModal: 'Close',
    },
    footer: {
      officialWebsite: 'Official Website',
      helpdesk: 'Helpdesk Number',
      email: 'Email',
      disclaimer: 'Disclaimer: This is a simulated template built for structural guidance. This is not the official website of the Government of Madhya Pradesh.',
      rights: '© 2026 Madhya Pradesh Ladli Behna Yojana | All Rights Reserved',
      designedFor: 'Designed for structural guidance',
    },
    admin: {
      title: '🔐 Admin Panel - All Queries',
      subtitle: 'All submitted grievances/queries are displayed here',
      password: 'Enter Password',
      passwordPlaceholder: 'Admin password...',
      login: 'Login',
      logout: 'Logout',
      wrongPassword: 'Wrong password!',
      noQueries: 'No queries received yet.',
      totalQueries: 'Total Queries',
      deleteAll: 'Delete All',
      deleteOne: 'Delete',
      confirmDelete: 'Are you sure you want to delete all queries?',
      name: 'Name',
      mobile: 'Mobile',
      district: 'District',
      query: 'Query',
      date: 'Date',
      close: 'Close Panel',
      exportData: 'Export Data (JSON)',
    },
    districts: [
      'Jabalpur', 'Bhopal', 'Indore', 'Gwalior', 'Ujjain', 'Sagar',
      'Rewa', 'Shahdol', 'Satna', 'Chhatarpur', 'Damoh', 'Panna',
      'Tikamgarh', 'Datia', 'Bhind', 'Morena', 'Mandsaur', 'Neemuch',
      'Ratlam', 'Jhabua', 'Dhar', 'Barwani', 'Khargone', 'Khandwa',
      'Harda', 'Hoshangabad', 'Betul', 'Chhindwara', 'Seoni', 'Balaghat',
      'Mandla', 'Dindori', 'Anuppur', 'Katni', 'Narsinghpur', 'Vidisha',
      'Raisen', 'Rajgarh', 'Shajapur', 'Agar-Malwa', 'Devas', 'Sehore',
      'Ashoknagar', 'Guna', 'Shivpuri', 'Alirajpur', 'Burhanpur', 'Betul',
    ],
  },
};

// Utility functions - Supabase or localStorage
async function getStoredQueries(): Promise<QueryEntry[]> {
  if (USE_SUPABASE) {
    const client = getSupabase();
    if (!client) return [];
    const { data, error } = await client
      .from(QUERIES_TABLE)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching queries:', error);
      return [];
    }
    
    return (data || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      mobile: item.mobile,
      district: item.district,
      query: item.query,
      timestamp: item.created_at,
    }));
  } else {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
}

async function saveQuery(entry: Omit<QueryEntry, 'id' | 'timestamp'>): Promise<void> {
  if (USE_SUPABASE) {
    const client = getSupabase();
    if (!client) return;
    const { error } = await client
      .from(QUERIES_TABLE)
      .insert({
        name: entry.name,
        mobile: entry.mobile,
        district: entry.district,
        query: entry.query,
      });
    
    if (error) {
      console.error('Error saving query:', error);
    }
  } else {
    const queries = await getStoredQueries();
    const newEntry = {
      ...entry,
      id: generateId(),
      timestamp: new Date().toISOString(),
    };
    queries.unshift(newEntry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queries));
  }
}

async function deleteAllQueries(): Promise<void> {
  if (USE_SUPABASE) {
    const client = getSupabase();
    if (!client) return;
    const { error } = await client
      .from(QUERIES_TABLE)
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    
    if (error) {
      console.error('Error deleting all queries:', error);
    }
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

async function deleteOneQuery(id: string): Promise<void> {
  if (USE_SUPABASE) {
    const client = getSupabase();
    if (!client) return;
    const { error } = await client
      .from(QUERIES_TABLE)
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting query:', error);
    }
  } else {
    const queries = await getStoredQueries();
    const filtered = queries.filter(q => q.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export default function App() {
  const [lang, setLang] = useState<Language>('hi');
  const [showModal, setShowModal] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [storedQueries, setStoredQueries] = useState<QueryEntry[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    district: '',
    query: '',
  });
  const [checkerData, setCheckerData] = useState({
    age: '',
    domicile: '',
    married: '',
    incomeTax: '',
  });

  const t = translations[lang];

  // Load stored queries when admin panel opens
  const refreshQueries = useCallback(async () => {
    const queries = await getStoredQueries();
    setStoredQueries(queries);
  }, []);

  // Check for #admin in URL on load
  useEffect(() => {
    if (window.location.hash === '#admin') {
      setShowAdmin(true);
    }
  }, []);

  // Keyboard shortcut: Ctrl+Shift+A to open admin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setShowAdmin(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Refresh queries when admin panel is shown
  useEffect(() => {
    if (showAdmin && adminAuthenticated) {
      refreshQueries();
    }
  }, [showAdmin, adminAuthenticated, refreshQueries]);

  const toggleLanguage = () => {
    setLang(lang === 'hi' ? 'en' : 'hi');
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEligibilityCheck = () => {
    const age = parseInt(checkerData.age);
    if (!checkerData.age || isNaN(age) || age < 1 || age > 120) {
      setEligibilityResult(t.checker.ageError);
      return;
    }

    const isEligible =
      age >= 21 &&
      age <= 60 &&
      checkerData.domicile === 'yes' &&
      checkerData.married === 'yes' &&
      checkerData.incomeTax === 'no';

    setEligibilityResult(isEligible ? t.checker.eligible : t.checker.notEligible);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = t.contact.nameError;
    if (!/^\d{10}$/.test(formData.mobile)) errors.mobile = t.contact.mobileError;
    if (!formData.district) errors.district = t.contact.districtError;
    if (!formData.query.trim()) errors.query = t.contact.queryError;
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Save to Supabase or localStorage
      await saveQuery({
        name: formData.name,
        mobile: formData.mobile,
        district: formData.district,
        query: formData.query,
      });

      setShowModal(true);
      setFormData({ name: '', mobile: '', district: '', query: '' });
      setFormErrors({});
    }
  };

  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setAdminAuthenticated(true);
      setAdminError('');
      refreshQueries();
    } else {
      setAdminError(t.admin.wrongPassword);
    }
  };

  const handleAdminLogout = () => {
    setAdminAuthenticated(false);
    setAdminPassword('');
    setShowAdmin(false);
    window.location.hash = '';
  };

  const handleDeleteAll = async () => {
    if (confirm(t.admin.confirmDelete)) {
      await deleteAllQueries();
      await refreshQueries();
    }
  };

  const handleDeleteOne = async (id: string) => {
    await deleteOneQuery(id);
    await refreshQueries();
  };

  const handleExportData = () => {
    const data = JSON.stringify(storedQueries, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ladlibehna_queries_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    setEligibilityResult(null);
    setFormErrors({});
  }, [lang]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-16 md:pb-0">
      {/* Ad Manager - Global ads + banners */}
      <AdManager />
      
      {/* Header / Navigation */}
      <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                <span className="text-2xl">🏛️</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold leading-tight">
                  {lang === 'hi' ? 'मध्य प्रदेश शासन' : 'Government of MP'}
                </h1>
                <p className="text-xs text-blue-200">
                  {lang === 'hi' ? 'महिला एवं बाल विकास विभाग' : 'Dept. of Women & Child Development'}
                </p>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
              <button onClick={() => scrollToSection('hero')} className="hover:text-orange-300 transition-colors">{t.nav.home}</button>
              <button onClick={() => scrollToSection('benefits')} className="hover:text-orange-300 transition-colors">{t.nav.benefits}</button>
              <button onClick={() => scrollToSection('eligibility')} className="hover:text-orange-300 transition-colors">{t.nav.eligibility}</button>
              <button onClick={() => scrollToSection('procedure')} className="hover:text-orange-300 transition-colors">{t.nav.procedure}</button>
              <button onClick={() => scrollToSection('contact')} className="hover:text-orange-300 transition-colors">{t.nav.contact}</button>
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={() => { setShowAdmin(true); window.location.hash = '#admin'; }}
                className="hidden md:flex items-center gap-1 bg-blue-700/50 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs transition-all"
                title="Admin Panel (Ctrl+Shift+A)"
              >
                🔐
              </button>
              <button
                onClick={toggleLanguage}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 shadow-md hover:shadow-lg"
              >
                {lang === 'hi' ? 'English' : 'हिंदी'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-orange-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <span className="text-orange-400">★</span>
            <span className="text-sm font-medium">{lang === 'hi' ? 'मुख्यमंत्री योजना' : 'Chief Minister Scheme'}</span>
            <span className="text-orange-400">★</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            {t.hero.title}
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-3 max-w-3xl mx-auto">
            {t.hero.subtitle}
          </p>
          <p className="text-base md:text-lg text-blue-200 mb-8 max-w-2xl mx-auto">
            {t.hero.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => scrollToSection('checker')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              {t.hero.checkEligibility}
            </button>
            <button
              onClick={() => scrollToSection('procedure')}
              className="bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300"
            >
              {t.hero.applicationProcedure}
            </button>
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-3">{t.updates.title}</h2>
            <p className="text-gray-600 text-lg">{t.updates.subtitle}</p>
            <div className="w-24 h-1 bg-orange-500 mx-auto mt-4 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.updates.items.map((item, index) => (
              <div key={index} className="relative bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-t-2xl"></div>
                <div className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
                  {item.date}
                </div>
                <h3 className="text-lg font-bold text-blue-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-3">{t.benefits.title}</h2>
            <p className="text-gray-600 text-lg">{t.benefits.subtitle}</p>
            <div className="w-24 h-1 bg-orange-500 mx-auto mt-4 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.benefits.items.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 text-center border border-gray-100 hover:-translate-y-2">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-blue-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility Criteria Section */}
      <section id="eligibility" className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-3">{t.eligibility.title}</h2>
            <p className="text-gray-600 text-lg">{t.eligibility.subtitle}</p>
            <div className="w-24 h-1 bg-orange-500 mx-auto mt-4 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-green-800 mb-6 flex items-center gap-2">
                <span className="text-2xl">✅</span>
                {lang === 'hi' ? 'पात्रता शर्तें' : 'Eligibility Conditions'}
              </h3>
              <ul className="space-y-4">
                {t.eligibility.criteria.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1 w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-white border border-red-100 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-red-800 mb-6 flex items-center gap-2">
                <span className="text-2xl">❌</span>
                {t.eligibility.exclusions}
              </h3>
              <ul className="space-y-4">
                {t.eligibility.exclusionsList.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1 w-6 h-6 bg-red-100 text-red-700 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      ✕
                    </span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Eligibility Checker */}
      <section id="checker" className="py-16 md:py-20 bg-gradient-to-br from-blue-900 to-indigo-900">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">{t.checker.title}</h2>
            <p className="text-blue-200 text-lg">{t.checker.subtitle}</p>
            <div className="w-24 h-1 bg-orange-500 mx-auto mt-4 rounded-full"></div>
          </div>
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">{t.checker.age}</label>
                <input
                  type="number"
                  value={checkerData.age}
                  onChange={(e) => setCheckerData({ ...checkerData, age: e.target.value })}
                  placeholder={t.checker.agePlaceholder}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t.checker.domicile}</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setCheckerData({ ...checkerData, domicile: 'yes' })}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${checkerData.domicile === 'yes' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {t.checker.yes}
                  </button>
                  <button
                    onClick={() => setCheckerData({ ...checkerData, domicile: 'no' })}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${checkerData.domicile === 'no' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {t.checker.no}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t.checker.married}</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setCheckerData({ ...checkerData, married: 'yes' })}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${checkerData.married === 'yes' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {t.checker.yes}
                  </button>
                  <button
                    onClick={() => setCheckerData({ ...checkerData, married: 'no' })}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${checkerData.married === 'no' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {t.checker.no}
                  </button>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">{t.checker.incomeTax}</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setCheckerData({ ...checkerData, incomeTax: 'yes' })}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${checkerData.incomeTax === 'yes' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {t.checker.yes}
                  </button>
                  <button
                    onClick={() => setCheckerData({ ...checkerData, incomeTax: 'no' })}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${checkerData.incomeTax === 'no' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {t.checker.no}
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={handleEligibilityCheck}
              className="w-full mt-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {t.checker.verify}
            </button>
            {eligibilityResult && (
              <div className={`mt-6 p-4 rounded-xl text-center font-medium text-lg ${eligibilityResult.includes('✅') || eligibilityResult.includes('Congratulations') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {eligibilityResult}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* In-Content Ad (Desktop) */}
      <AdInContent />

      {/* Application Procedure */}
      <section id="procedure" className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-3">{t.procedure.title}</h2>
            <p className="text-gray-600 text-lg">{t.procedure.subtitle}</p>
            <div className="w-24 h-1 bg-orange-500 mx-auto mt-4 rounded-full"></div>
          </div>
          <div className="relative">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-400 to-blue-600 hidden md:block"></div>
            <div className="space-y-8">
              {t.procedure.steps.map((step, index) => (
                <div key={index} className={`flex flex-col md:flex-row items-center gap-6 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                      <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-sm font-bold px-3 py-1 rounded-full mb-3">
                        {step.title}
                      </div>
                      <p className="text-gray-600">{step.desc}</p>
                    </div>
                  </div>
                  <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 hidden md:block"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Grievance Form */}
      <section id="contact" className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-3">{t.contact.title}</h2>
            <p className="text-gray-600 text-lg">{t.contact.subtitle}</p>
            <div className="w-24 h-1 bg-orange-500 mx-auto mt-4 rounded-full"></div>
          </div>
          <form onSubmit={handleFormSubmit} className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t.contact.name}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t.contact.namePlaceholder}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${formErrors.name ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'}`}
                />
                {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t.contact.mobile}</label>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder={t.contact.mobilePlaceholder}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${formErrors.mobile ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'}`}
                />
                {formErrors.mobile && <p className="text-red-500 text-sm mt-1">{formErrors.mobile}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t.contact.district}</label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${formErrors.district ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'}`}
                >
                  <option value="">{t.contact.districtPlaceholder}</option>
                  {t.districts.map((d, i) => (
                    <option key={i} value={d}>{d}</option>
                  ))}
                </select>
                {formErrors.district && <p className="text-red-500 text-sm mt-1">{formErrors.district}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">{t.contact.query}</label>
                <textarea
                  value={formData.query}
                  onChange={(e) => setFormData({ ...formData, query: e.target.value })}
                  placeholder={t.contact.queryPlaceholder}
                  rows={4}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors resize-none ${formErrors.query ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'}`}
                ></textarea>
                {formErrors.query && <p className="text-red-500 text-sm mt-1">{formErrors.query}</p>}
              </div>
            </div>
            <button
              type="submit"
              className="w-full mt-8 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {t.contact.submit}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-bold mb-3 text-orange-300">{t.footer.officialWebsite}</h3>
              <a
                href="https://cmladlibahna.mp.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-200 hover:text-white transition-colors underline break-all"
              >
                https://cmladlibahna.mp.gov.in/
              </a>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold mb-3 text-orange-300">{t.footer.helpdesk}</h3>
              <p className="text-blue-200 text-lg font-mono">0755-2700800</p>
            </div>
            <div className="text-center md:text-right">
              <h3 className="text-lg font-bold mb-3 text-orange-300">{t.footer.email}</h3>
              <a
                href="mailto:ladlibahna.wcd@mp.gov.in"
                className="text-blue-200 hover:text-white transition-colors underline break-all"
              >
                ladlibahna.wcd@mp.gov.in
              </a>
            </div>
          </div>
          <div className="border-t border-blue-700 pt-8">
            <div className="bg-blue-800/50 rounded-xl p-4 mb-6">
              <p className="text-blue-200 text-sm text-center">
                ⚠️ {t.footer.disclaimer}
              </p>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-blue-300 text-sm text-center md:text-left">
                {t.footer.rights}
              </p>
              <p className="text-blue-400 text-xs">
                {t.footer.designedFor}
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 md:p-10 max-w-md w-full shadow-2xl text-center animate-bounce-in">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">✅</span>
            </div>
            <h3 className="text-2xl font-bold text-green-800 mb-3">{t.contact.successTitle}</h3>
            <p className="text-gray-600 mb-6">{t.contact.successMessage}</p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300"
            >
              {t.contact.closeModal}
            </button>
          </div>
        </div>
      )}

      {/* Admin Panel */}
      {showAdmin && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl my-8">
            {/* Admin Header */}
            <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 rounded-t-3xl z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{t.admin.title}</h2>
                  <p className="text-gray-300 text-sm mt-1">{t.admin.subtitle}</p>
                </div>
                <div className="flex items-center gap-3">
                  {adminAuthenticated && (
                    <>
                      <button
                        onClick={handleExportData}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                      >
                        📥 {t.admin.exportData}
                      </button>
                      <button
                        onClick={handleAdminLogout}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                      >
                        {t.admin.logout}
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => { setShowAdmin(false); window.location.hash = ''; }}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              {/* Configuration Status Banner */}
              {!USE_SUPABASE && (
                <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <h4 className="font-bold text-yellow-800 mb-1">
                        {lang === 'hi' ? 'Supabase कॉन्फ़िगर नहीं है' : 'Supabase Not Configured'}
                      </h4>
                      <p className="text-yellow-700 text-sm mb-2">
                        {lang === 'hi' 
                          ? 'आप केवल अपने डिवाइस पर सबमिट की गई क्वेरी देख रहे हैं। अन्य उपयोगकर्ताओं की क्वेरी देखने के लिए, कृपया Supabase सेटअप करें।'
                          : 'You are only viewing queries submitted on YOUR device. To see queries from ALL users, please set up Supabase.'}
                      </p>
                      <details className="mt-2">
                        <summary className="cursor-pointer text-yellow-800 font-medium text-sm hover:underline">
                          {lang === 'hi' ? 'सेटअप निर्देश देखें' : 'View Setup Instructions'}
                        </summary>
                        <div className="mt-2 text-xs text-yellow-700 space-y-1">
                          <p>1. {lang === 'hi' ? 'Supabase अकाउंट बनाएं:' : 'Create Supabase account:'} <a href="https://supabase.com" target="_blank" rel="noopener" className="underline">supabase.com</a></p>
                          <p>2. {lang === 'hi' ? 'नया प्रोजेक्ट बनाएं और SQL Editor में setup.sql चलाएं' : 'Create project & run setup.sql in SQL Editor'}</p>
                          <p>3. .env.example को .env.local में कॉपी करें और अपनी keys डालें</p>
                          <p>4. {lang === 'hi' ? 'ऐप पुनः लोड करें' : 'Reload the app'}</p>
                        </div>
                      </details>
                    </div>
                  </div>
                </div>
              )}

              {USE_SUPABASE && (
                <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✅</span>
                    <p className="text-green-700 text-sm font-medium">
                      {lang === 'hi' 
                        ? 'Supabase कनेक्टेड — सभी उपयोगकर्ताओं की क्वेरी यहाँ दिख रही हैं'
                        : 'Supabase Connected — Viewing queries from ALL users'}
                    </p>
                  </div>
                </div>
              )}

              {!adminAuthenticated ? (
                /* Login Form */
                <div className="max-w-sm mx-auto py-12">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">🔐</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{t.admin.password}</h3>
                  </div>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => { setAdminPassword(e.target.value); setAdminError(''); }}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                    placeholder={t.admin.passwordPlaceholder}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors mb-4"
                  />
                  {adminError && <p className="text-red-500 text-sm mb-4">{adminError}</p>}
                  <button
                    onClick={handleAdminLogin}
                    className="w-full bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white py-3 rounded-xl font-bold transition-all"
                  >
                    {t.admin.login}
                  </button>
                  <p className="text-center text-gray-400 text-xs mt-4">
                    {lang === 'hi' ? 'संकेत: पासवर्ड "admin2026" है' : 'Hint: Password is "admin2026"'}
                  </p>
                </div>
              ) : (
                /* Queries Dashboard */
                <div>
                  {/* Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                      <p className="text-3xl font-bold text-blue-800">{storedQueries.length}</p>
                      <p className="text-sm text-blue-600">{t.admin.totalQueries}</p>
                    </div>
                    <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
                      <p className="text-3xl font-bold text-green-800">
                        {storedQueries.filter(q => {
                          const today = new Date().toDateString();
                          return new Date(q.timestamp).toDateString() === today;
                        }).length}
                      </p>
                      <p className="text-sm text-green-600">{lang === 'hi' ? 'आज' : 'Today'}</p>
                    </div>
                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-center">
                      <button
                        onClick={handleDeleteAll}
                        className="text-orange-700 font-bold hover:text-orange-900 transition-colors"
                      >
                        🗑️ {t.admin.deleteAll}
                      </button>
                    </div>
                  </div>

                  {/* Queries List */}
                  {storedQueries.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                      <span className="text-5xl block mb-4">📭</span>
                      <p className="text-lg">{t.admin.noQueries}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {storedQueries.map((entry) => (
                        <div key={entry.id} className="bg-gray-50 border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                              <div>
                                <p className="text-xs text-gray-500 font-medium uppercase">{t.admin.name}</p>
                                <p className="font-semibold text-gray-800">{entry.name}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium uppercase">{t.admin.mobile}</p>
                                <p className="font-semibold text-gray-800 font-mono">{entry.mobile}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium uppercase">{t.admin.district}</p>
                                <p className="font-semibold text-gray-800">{entry.district}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium uppercase">{t.admin.date}</p>
                                <p className="font-semibold text-gray-800 text-sm">
                                  {new Date(entry.timestamp).toLocaleString(lang === 'hi' ? 'hi-IN' : 'en-IN')}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteOne(entry.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all flex-shrink-0"
                              title={t.admin.deleteOne}
                            >
                              🗑️
                            </button>
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs text-gray-500 font-medium uppercase mb-1">{t.admin.query}</p>
                            <p className="text-gray-700">{entry.query}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
