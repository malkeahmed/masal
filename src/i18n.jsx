import { createContext, useContext, useEffect, useMemo, useState } from 'react'

/* ============ القاموس: عربي / English ============ */
const mk = (a, e) => ({ ar: a, en: e })

const D = {
  'meta.title': mk('ماسال | الوكيل الرئيسي لآسياسيل – الكروت الإلكترونية', 'Masal | Asiacell Main Agent – E-Cards in Iraq'),
  'meta.desc': mk(
    'ماسال – وجهتكم الموثوقة لشراء الكروت الإلكترونية: شحن رصيد، هدايا، ألعاب وترفيه رقمي بأفضل الأسعار.',
    'Masal – your trusted source for e-cards in Iraq: mobile top-ups, gift cards, gaming and digital entertainment at the best prices.',
  ),

  /* التنقل */
  'brand': mk('ماسال', 'Masal'),
  'nav.about': mk('من نحن', 'About'),
  'nav.services': mk('خدماتنا', 'Services'),
  'nav.gallery': mk('المعرض', 'Gallery'),
  'nav.brands': mk('التشكيلة', 'Brands'),
  'nav.join': mk('انضم كموزّع', 'Become a distributor'),
  'nav.login': mk('دخول', 'Sign in'),
  'nav.theme': mk('تبديل الوضع', 'Toggle theme'),
  'nav.menu': mk('القائمة', 'Menu'),
  'nav.lang': mk('English', 'العربية'),
  'nav.langShort': mk('EN', 'ع'),
  'nav.langAria': mk('Switch to English', 'التبديل إلى العربية'),

  /* الهيرو */
  'hero.badge': mk('الوكيل الرئيسي لآسياسيل', 'Asiacell Main Agent'),
  'hero.h1a': mk('منصة معتمدة', 'An authorised platform'),
  'hero.h1b': mk('لبيع الكروت', 'for selling cards'),
  'hero.h1c': mk('والخدمات الإلكترونية', 'and e-services'),
  'hero.sub': mk(
    'بأفضل الأسعار وأعلى معايير الخدمة',
    'at the best prices and the highest service standards.',
  ),
  'hero.t1': mk('خبرة منذ', 'Experience since'),
  'hero.t2': mk('نقطة بيع', 'Points of sale'),
  'hero.t3': mk('كروت أصلية', 'Genuine cards'),

  /* الشريط المتقاطع */
  'mx': mk(
    ['آسياسيل', 'شحن رصيد', 'بطاقات الألعاب', 'كروت الهدايا', 'ترفيه رقمي', 'تسوق إلكتروني', 'أسعار تنافسية', 'جودة أصلية'],
    ['Asiacell', 'Top-ups', 'Game cards', 'Gift cards', 'Digital entertainment', 'Online shopping', 'Competitive prices', 'Genuine quality'],
  ),

  /* من نحن */
  'about.kicker': mk('من نحن', 'About us'),
  'about.t1': mk('بسم الله نبدأ،', 'In God’s name we begin,'),
  'about.t2': mk('وعلى الثقة نبني…', 'and on trust we build…'),
  'about.sub': mk('وكيل آسياسيل الرئيسي في العراق منذ', 'Asiacell’s main agent in Iraq since'),
  'about.p1': mk('قصتنا', 'Our story'),
  'about.p2': mk('رؤيتنا', 'Our vision'),
  'about.p3': mk('رسالتنا', 'Our mission'),
  'about.lead': mk(
    (m) => <>انطلقت شركة ماسال منذ تاريخ {m('2012')} لتكون وكيل رئيسي لشركة {m('آسياسيل')} للاتصالات واسماً رائداً في عالم البطاقات الإلكترونية، واضعةً الجودة والسرعة والأمان أساساً لكل خدمة نقدمها.</>,
    (m) => <>Masal launched in {m('2012')} to become the main agent of {m('Asiacell')} Telecom and a leading name in electronic cards — putting quality, speed and security at the heart of every service we offer.</>,
  ),
  'about.cover': mk(
    'تغطي شركة ماسال اغلب محافظات الوسط والجنوب ، بغداد ، بابل ، القادسية ،كربلاء المقدسة ، النجف الاشرف ، ذي قار ، ميسان ، البصرة موزعة حسب الاتي',
    'Masal covers most of the central and southern provinces — Baghdad, Babil, Qadisiyah, holy Karbala, Najaf Al-Ashraf, Dhi Qar, Maysan and Basra — distributed as follows:',
  ),
  'about.s1t': mk('محافظات جنوب العراق', 'Southern Iraq provinces'),
  'about.s1': mk('فرع موزع على', 'branches across'),
  'about.s2': mk('فرع موزع على جانبي الكرخ والرصافه', 'branches across both the Karkh and Rusafa sides'),
  'about.c1': mk(
    'حيث نعمل بروح الاحتراف لنوفّر لعملائنا أفضل البطاقات الرقمية بكل سهولة ومصداقية، لنمنحهم تجربة شراء مريحة وموثوقة في كل وقت.',
    'Where we work with a professional spirit to give our customers the best digital cards with ease and credibility — a comfortable, reliable buying experience every time.',
  ),
  'about.c2': mk(
    'نؤمن أن النجاح الحقيقي يبدأ من رضا العميل، لذلك نسعى دائماً لتقديم أحدث المنتجات بأسعار منافسة ودعم متواصل، لنكون الشريك الذي يعتمد عليه الجميع في عالم الخدمات الإلكترونية.',
    'We believe real success starts with customer satisfaction, so we always strive to offer the latest products at competitive prices with continuous support — becoming the partner everyone relies on in electronic services.',
  ),
  'about.vision': mk(
    (h) => <>أن تصبح شركة ماسال {h('الخيار الأول')} في السوق.</>,
    (h) => <>For Masal to become the {h('first choice')} in the market.</>,
  ),
  'about.mission': mk(
    (h) => <>بناء علاقة طويلة الأمد مع عملائنا قائمة على {h('الثقة والالتزام والتميز')}.</>,
    (h) => <>Building long-term relationships with our customers based on {h('trust, commitment and excellence')}.</>,
  ),
  'about.provs': mk(
    ['بغداد', 'كربلاء', 'بابل', 'النجف', 'القادسية', 'ميسان', 'ذي قار', 'البصرة'],
    ['Baghdad', 'Karbala', 'Babil', 'Najaf', 'Qadisiyah', 'Maysan', 'Dhi Qar', 'Basra'],
  ),
  'about.provLabel': mk('محافظات نغطيها', 'provinces we cover'),
  'about.provAria': mk('المحافظات التي نغطيها', 'Provinces we cover'),
  'about.q1': mk('معكم نبدأ…', 'With you we begin…'),
  'about.q2': mk('وبثقتكم نكبر', 'and with your trust we grow'),

  'stats': mk(['نقطة بيع وجهاز POS', 'فرع في العراق', 'موظف متخصص', 'مندوب ميداني', 'سنة التأسيس'], ['Points of sale & POS devices', 'Branches in Iraq', 'Specialised staff', 'Field representatives', 'Year founded']),

  /* ملف الشركة */
  'pf.h2': mk('مرحبا بكم في ماسال', 'Welcome to Masal'),
  'pf.sub': mk('وجهتكم الموثوقة لشراء الكروت الإلكترونية بأفضل الأسعار والخدمات', 'Your trusted destination for buying e-cards at the best prices and services'),
  'pf.intro': mk(
    'ماسال شركة متخصصة في بيع وتوزيع الكروت الإلكترونية لمجموعة متنوعة من الاستخدامات، تشمل شحن الرصيد، التسوق الإلكتروني، بطاقات الألعاب، وخدمات الترفيه الرقمي. نحرص في ماسال على توفير أحدث العروض وأوسع تشكيلة من الكروت الإلكترونية، بما يمنح عملاءنا سهولة في الاستخدام، وأمانًا في التعامل، ومرونة كاملة في اختيار ما يلبي احتياجاتهم المختلفة. كما نلتزم بتقديم أسعار تنافسية وخدمة عالية الجودة تضمن تجربة شراء سلسة وموثوقة.',
    'Masal is a specialised company in selling and distributing electronic cards for a wide range of uses, including mobile top-ups, online shopping, gaming cards and digital entertainment services. At Masal we strive to offer the latest deals and the widest selection of electronic cards, giving our customers ease of use, safety in dealing and complete flexibility in choosing what meets their different needs. We are also committed to competitive prices and high-quality service that ensures a smooth, reliable buying experience.',
  ),
  'pf.orgTitle': mk('الهيكل التنظيمي للشركة', 'Company organisational structure'),
  'pf.orgText': mk(
    'تعتمد ماسال على هيكل تنظيمي متكامل يضمن كفاءة الأداء وجودة الخدمة، ويتكون من الإدارات التالية:',
    'Masal relies on an integrated organisational structure that ensures performance efficiency and service quality, made up of the following departments:',
  ),
  'pf.depts': mk(
    [
      { t: 'إدارة الشركة', d: 'تتولى وضع الاستراتيجيات العامة، والإشراف على سير العمل، وضمان تحقيق أهداف الشركة وفق أعلى معايير الاحترافية والحوكمة.' },
      { t: 'إدارة المبيعات', d: 'مسؤولة عن تطوير قنوات البيع، وبناء العلاقات مع العملاء والشركاء، وتحقيق النمو المستدام في حجم المبيعات.' },
      { t: 'إدارة العمليات', d: 'تشرف على تنظيم وتنسيق العمليات اليومية، وضمان سرعة تنفيذ الطلبات ودقة توزيع الكروت الإلكترونية بكفاءة عالية.' },
      { t: 'إدارة الحسابات', d: 'تتولى إدارة الشؤون المالية، ومتابعة العمليات المحاسبية، وإعداد التقارير المالية بما يعزز الشفافية والاستقرار المالي.' },
      { t: 'إدارة الموارد البشرية', d: 'مسؤولة عن استقطاب الكفاءات، وتطوير بيئة العمل، وتنمية مهارات الموظفين بما يحقق التميز المؤسسي.' },
      { t: 'مركز الدعم والاتصالات', d: 'يقدم الدعم الفني وخدمة العملاء، ويعمل على الاستجابة السريعة للاستفسارات والملاحظات لضمان رضا العملاء الكامل.' },
    ],
    [
      { t: 'Company management', d: 'Sets the general strategies, oversees the workflow and ensures the company’s goals are achieved to the highest standards of professionalism and governance.' },
      { t: 'Sales management', d: 'Responsible for developing sales channels, building relationships with customers and partners, and achieving sustainable growth in sales volume.' },
      { t: 'Operations management', d: 'Oversees the organisation and coordination of daily operations, ensuring fast order fulfilment and accurate distribution of electronic cards with high efficiency.' },
      { t: 'Accounts management', d: 'Manages financial affairs, follows up accounting operations and prepares financial reports, enhancing transparency and financial stability.' },
      { t: 'Human resources', d: 'Responsible for attracting talent, developing the work environment and building employees’ skills to achieve institutional excellence.' },
      { t: 'Support & communications centre', d: 'Provides technical support and customer service and responds quickly to enquiries and feedback to ensure full customer satisfaction.' },
    ],
  ),
  'pf.facts': mk(
    [
      'نمتلك شبكة واسعة تضم أكثر من 10,000 نقطة بيع وجهاز pos موزعة في مختلف المحافظات، مما يعزز قدرتنا على الوصول إلى عملائنا بكفاءة وسرعة..',
      'نوفر خدمات البيع للموزعين ولعملاء التجزئة وفق آلية مرنة تلبي احتياجات مختلف شرائح السوق.',
      'نتعامل مع كبرى الشركات العالمية في مجال الكروت الإلكترونية والخدمات الرقمية، بما يعزز ثقة عملائنا ويرسخ مكانتنا في السوق.',
      'نعتمد على كوادر متخصصة تضم أكثر من 150 موظفًا إلى جانب 220 مندوبًا ميدانيًا، بما يعزز انتشارنا وسرعة استجابتنا في مختلف المحافظات.',
      'نعزز حضورنا في العاصمة من خلال مراكز بيع منتشرة في الكرخ والرصافة، لتقديم خدماتنا بالقرب من عملائنا أينما كانوا.',
    ],
    [
      'We own a wide network of more than 10,000 points of sale and POS devices distributed across the provinces, strengthening our ability to reach our customers efficiently and quickly..',
      'We offer sales services to distributors and retail customers through a flexible model that meets the needs of different market segments.',
      'We deal with major global companies in electronic cards and digital services, reinforcing our customers’ trust and consolidating our position in the market.',
      'We rely on specialised staff of more than 150 employees alongside 220 field representatives, strengthening our reach and response speed across the provinces.',
      'We strengthen our presence in the capital through sales centres spread across Karkh and Rusafa, delivering our services close to our customers wherever they are.',
    ],
  ),
  'pf.values': mk(
    [
      { t: 'الابتكار', d: 'نوفر حلولًا حديثة تواكب التطورات في عالم الخدمات الإلكترونية.' },
      { t: 'الجودة', d: 'نضمن أن كل الكروت التي نقدمها هي أصلية ومعتمدة.' },
      { t: 'العملاء أولاً', d: 'نحرص دائمًا على تقديم أفضل دعم وخدمات عملاء لضمان رضاكم التام.' },
      { t: 'السرعة', d: 'خدماتنا الرقمية سريعة وآمنة لضمان تلبية احتياجاتك في الوقت الفعلي.' },
    ],
    [
      { t: 'Innovation', d: 'We provide modern solutions that keep pace with developments in the world of electronic services.' },
      { t: 'Quality', d: 'We guarantee that all the cards we offer are genuine and certified.' },
      { t: 'Customers first', d: 'We always strive to provide the best support and customer service to ensure your complete satisfaction.' },
      { t: 'Speed', d: 'Our digital services are fast and secure to ensure your needs are met in real time.' },
    ],
  ),

  /* الخدمات */
  'svc.kicker': mk('خدماتنا', 'Our services'),
  'svc.title': mk('كل ما تحتاجه من الكروت الإلكترونية', 'Every e-card you need'),
  'svc.text': mk(
    'كروت شحن، هدايا وألعاب – بسرعة وأمان! التميز في الجودة وسهولة الاستخدام هو هدفنا لضمان أفضل تجربة لك.',
    'Top-up, gift and gaming cards — fast and secure! Outstanding quality and ease of use are our goal, to guarantee you the best experience.',
  ),
  'svc.list': mk(
    [
      { title: 'كروت شحن الرصيد', text: 'شحن فوري وآمن لآسياسيل وأكثر، بأسعار تنافسية وبدون انتظار.' },
      { title: 'بطاقات الألعاب', text: 'أحدث بطاقات الألعاب العالمية جاهزة بين يديك خلال ثوانٍ.' },
      { title: 'كروت الهدايا', text: 'هدايا رقمية لكل مناسبة، أصلية ومعتمدة من كبرى الشركات.' },
      { title: 'التسوق الإلكتروني', text: 'كروت للتسوق عبر الإنترنت بمرونة كاملة وأمان في التعامل.' },
      { title: 'الترفيه الرقمي', text: 'اشتراكات المنصات والترفيه الرقمي بكبسة زر.' },
      { title: 'للموزعين والتجزئة', text: 'آلية بيع مرنة تناسب الموزعين وعملاء التجزئة على حد سواء.' },
    ],
    [
      { title: 'Top-up cards', text: 'Instant, secure recharge for Asiacell and more — competitive prices, zero waiting.' },
      { title: 'Gaming cards', text: 'The latest global game cards, ready in your hands within seconds.' },
      { title: 'Gift cards', text: 'Digital gifts for every occasion — genuine and certified by major brands.' },
      { title: 'Online shopping', text: 'Cards for shopping online with full flexibility and safe transactions.' },
      { title: 'Digital entertainment', text: 'Platform subscriptions and digital entertainment at the click of a button.' },
      { title: 'Distributors & retail', text: 'A flexible selling model for distributors and retail customers alike.' },
    ],
  ),
  'svc.badges': mk(
    ['فوري', 'تسليم خلال ثوانٍ', 'لكل مناسبة', 'دفع آمن', 'بكبسة زر', 'أسعار الجملة'],
    ['Instant', 'Delivered in seconds', 'For any occasion', 'Secure payment', 'One click', 'Wholesale prices'],
  ),
  'svc.amt': mk([null, '10$ · 25$ · 50$', 'لكل مناسبة', 'تسوق عالمي', 'اشتراكات', 'أسعار الجملة'], [null, '$10 · $25 · $50', 'Any occasion', 'Global shopping', 'Subscriptions', 'Wholesale'] ),
  'svc.genuine': mk('أصلي 100%', '100% genuine'),

  /* حائط الشعارات */
  'bw.pill': mk('عالم من الكروت الإلكترونية بانتظارك!', 'A world of e-cards awaits you!'),
  'bw.h1': mk('تشكيلة متنوعة من الكروت', 'A diverse range of cards'),
  'bw.h2': mk('الإلكترونية لتلبية كل احتياجاتك!', 'to meet all your needs!'),
  'values': mk(
    [
      { title: 'الابتكار', text: 'نوفر حلولًا حديثة تواكب التطورات في عالم الخدمات الإلكترونية.' },
      { title: 'الجودة', text: 'نضمن أن كل الكروت التي نقدمها أصلية ومعتمدة.' },
      { title: 'السرعة', text: 'خدماتنا الرقمية سريعة وآمنة لتلبية احتياجك في الوقت الفعلي.' },
      { title: 'العملاء أولاً', text: 'نحرص دائمًا على أفضل دعم وخدمة لضمان رضاكم التام.' },
    ],
    [
      { title: 'Innovation', text: 'Modern solutions that keep pace with the world of electronic services.' },
      { title: 'Quality', text: 'We guarantee every card we offer is genuine and certified.' },
      { title: 'Speed', text: 'Fast, secure digital services that meet your needs in real time.' },
      { title: 'Customers first', text: 'We always provide the best support and service for your full satisfaction.' },
    ],
  ),

  /* المعرض */
  'gal.kicker': mk('معرض الصور', 'Photo gallery'),
  'gal.h2a': mk('ماسال', 'Masal'),
  'gal.h2b': mk('بالصورة', 'in pictures'),
  'gal.text': mk('لمحات من فروعنا وفعالياتنا وفريقنا في أنحاء العراق.', 'Glimpses of our branches, events and team across Iraq.'),
  'gal.items': mk(
    [
      ['واجهة الفرع', 'هوية آسياسيل الحمراء'],
      ['مدخل الفرع', 'ساعات العمل ٩ صباحًا – ٩ مساءً'],
      ['فعالية وتكريم 2024', 'مسابقة وجوائز للشركاء'],
      ['تسليم الجوائز', 'لحظة تسليم المفتاح للفائز'],
      ['ركن الخدمة', 'أجهزة ونقاط بيع جاهزة'],
      ['داخل الفرع', 'مساحة استقبال مريحة'],
      ['منطقة الاستقبال', 'خدمة سريعة ومنظمة'],
    ],
    [
      ['Branch façade', 'Asiacell’s signature red identity'],
      ['Branch entrance', 'Open 9 AM – 9 PM'],
      ['2024 event & awards', 'A contest with prizes for partners'],
      ['Prize handover', 'The moment the key is handed to the winner'],
      ['Service corner', 'Devices and points of sale, ready to go'],
      ['Inside the branch', 'A comfortable reception area'],
      ['Reception', 'Fast, organised service'],
    ],
  ),
  'gal.close': mk('إغلاق', 'Close'),
  'gal.prev': mk('السابق', 'Previous'),
  'gal.next': mk('التالي', 'Next'),

  /* الخاتمة */
  'fin.pill': mk('ماسال معك في كل خطوة', 'Masal is with you every step'),
  'fin.h2a': mk('جاهز تبدأ؟', 'Ready to start?'),
  'fin.h2b': mk('ماسال معك', 'Masal is with you'),
  'fin.h2c': mk('دائمًا.', 'always.'),
  'fin.p': mk('انضم إلى آلاف الموزعين والعملاء الذين يثقون بنا كل يوم.', 'Join thousands of distributors and customers who trust us every day.'),
  'fin.contact': mk('تواصل معنا', 'Contact us'),
  'fin.browse': mk('استعرض خدماتنا', 'Browse our services'),
  'fin.tag': mk('معكم نبدأ… وبثقتكم نكبر', 'With you we begin… and with your trust we grow'),
  'fin.copy': mk('جميع الحقوق محفوظة لشركة دجلة.', 'All rights reserved to Dijla Company.'),
  'fin.top': mk('العودة للأعلى', 'Back to top'),
}

/* ============ السياق ============ */
const LangCtx = createContext({ lang: 'ar', t: (k) => k, setLang: () => {}, arrow: '←' })
export const useLang = () => useContext(LangCtx)

const initial = () => {
  try { const s = localStorage.getItem('lang'); if (s === 'ar' || s === 'en') return s } catch { /* ignore */ }
  return 'ar'
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState(initial)
  useEffect(() => {
    const root = document.documentElement
    root.lang = lang
    root.dir = lang === 'ar' ? 'rtl' : 'ltr'
    root.dataset.lang = lang
    document.title = D['meta.title'][lang]
    const m = document.querySelector('meta[name="description"]')
    if (m) m.setAttribute('content', D['meta.desc'][lang])
    try { localStorage.setItem('lang', lang) } catch { /* ignore */ }
  }, [lang])
  const value = useMemo(() => ({
    lang,
    setLang,
    arrow: lang === 'ar' ? '←' : '→',
    t: (k) => (D[k] ? D[k][lang] : k),
  }), [lang])
  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>
}
