import type { Locale } from '@/lib/i18n/config'

export type LegalKind = 'privacy' | 'terms'
type LegalSection = { title: string; body: string }
export type LegalDocument = {
  title: string
  intro: string
  effective: string
  draftNotice: string
  contactHeading: string
  contactBody: string
  sections: LegalSection[]
}

const documents: Record<Locale, Record<LegalKind, LegalDocument>> = {
  en: {
    privacy: {
      title: 'Privacy Policy',
      intro: 'This policy describes how Provenic processes information when customers and businesses create, share and manage transaction and commitment records. It reflects the current product foundation and should be read with the Terms of Service.',
      effective: 'Effective November 14, 2026 · Version 2026-11-14-v1',
      draftNotice: 'Product-specific draft for review. Before public launch, the service operator’s legal identity, hosting regions, retention schedule and jurisdiction-specific rights must be confirmed with qualified counsel.',
      contactHeading: 'Privacy questions',
      contactBody: 'Contact the Provenic team about a privacy request or question at',
      sections: [
        { title: '1. Information we process', body: 'Account information includes your name, email address, preferred language and authentication/session information. Records may contain transaction type, participants, business name, descriptions, agreed terms, dates, optional amounts, status updates, reminders, issues, timeline comments and files you or an authorized business add. We also process security and service diagnostics, such as request and error information. We do not receive or store your account password in the Provenic application.' },
        { title: '2. How we use information', body: 'We use information to create and display records, verify accounts, share a record with its authorized participants, provide reminders and account emails, respond to requests, protect the service and understand reliability. We do not use private record content to create public ratings or to decide who is right in a disagreement. Provenic does not currently provide payments, escrow, or AI-based decisions.' },
        { title: '3. Who can see a record', body: 'Records are not publicly searchable. A business workspace’s authorized members can access records permitted by their role. A customer can access records shared with or linked to that customer. Internal business notes are intended for that business’s team, not the customer. A secure share link may provide access for a limited period; the issuing business can revoke an active link. Do not place information in a shared record unless you are authorized to do so.' },
        { title: '4. Service providers and transfers', body: 'Provenic uses Supabase for authentication, database and private file storage, and Vercel for application hosting and production analytics. Email confirmation and recovery messages are delivered through the configured authentication email provider. These providers process data to operate the service under their own terms. The precise hosting region and any cross-border transfer depend on project configuration and must be confirmed before public launch.' },
        { title: '5. Cookies, preferences and analytics', body: 'Essential session cookies support sign-in and account security. The interface may store your theme preference on this device; language preferences may be saved to your profile. Vercel Analytics is enabled in production to measure aggregate service usage and performance. We do not use the record content for advertising profiles.' },
        { title: '6. Imported content and AI', body: 'The current product does not automatically import conversations or documents from outside services, and AI extraction is not enabled as a production feature. If these capabilities are introduced, they must require an explicit user action, limit the information sent to a provider, identify extracted values as drafts and require a person to review and confirm them.' },
        { title: '7. Retention, export and deletion', body: 'We retain account information while needed to provide the service. Records and related history may remain available to other authorized participants or a business after an individual account is closed, and may be retained when required for security, dispute history or legal obligations. You can use the account settings to request an export or account deletion. Requests may require identity verification. A fixed retention schedule for records, files, logs and backups has not yet been published and must be finalized before public launch.' },
        { title: '8. Security and limits', body: 'The application uses authenticated access, role checks, row-level database policies and private file storage. No online service can promise absolute security. A timeline helps show submitted information and later changes; it does not independently authenticate documents, prove every statement is true or guarantee legal admissibility.' },
        { title: '9. Your choices and rights', body: 'Depending on where you live, you may have rights to access, correct, export, restrict or delete personal information, or to object to certain processing. You may also close your account and request deletion through settings. We will verify and respond to requests as required by applicable law; some business records may need to be retained for the other participants or lawful obligations.' },
        { title: '10. Children and policy changes', body: 'Provenic is a business and transaction-record service, not a service directed to children. Do not create an account if you are not legally able to accept the applicable terms. We may update this policy as the product changes; material changes will be reflected here with a revised effective date. The operator and applicable privacy jurisdiction must be identified before public launch.' },
      ],
    },
    terms: {
      title: 'Terms of Service',
      intro: 'These terms govern access to Provenic, a shared workspace for recording and tracking customer-business transactions and commitments. By creating an account or using the service, you agree to these terms and the Privacy Policy.',
      effective: 'Effective November 14, 2026 · Version 2026-11-14-v1',
      draftNotice: 'Product-specific draft for review, not legal advice. The operating entity, governing law, venue and any mandatory consumer terms must be confirmed with qualified counsel before public launch.',
      contactHeading: 'Questions about these terms',
      contactBody: 'Contact the Provenic team at',
      sections: [
        { title: '1. The service', body: 'Provenic helps customers and businesses create, share, organize and follow updates to transaction and commitment records. Features may include structured details, documents, timelines, reminders and issue tracking. Features can change as the product develops.' },
        { title: '2. Account eligibility and security', body: 'You must be legally able to enter an agreement where you live and provide accurate account information. Keep your password and sign-in links private, use your own account and promptly report suspected unauthorized access. You are responsible for activity through your account except where applicable law says otherwise.' },
        { title: '3. Business workspaces and roles', body: 'A business owner controls its workspace and is responsible for assigning appropriate roles and removing access when no longer needed. Members may use information only for legitimate work within their granted permissions. A business must not access another business’s private records or use a customer relationship to bypass access controls.' },
        { title: '4. Records, sharing and responsibility', body: 'The person or business creating a record is responsible for the accuracy, completeness and lawful sharing of its content. Customers and businesses should review a record and raise corrections through its permitted workflow. A record shows information submitted by participants and its subsequent history; Provenic does not independently verify the underlying transaction, document or statement.' },
        { title: '5. Your content', body: 'You retain rights in content you submit. You grant Provenic a limited permission to host, process, display and transmit that content only as needed to operate, secure and support the service for you and its authorized participants. You confirm that you have the rights and permissions needed to upload and share it, including any personal information or documents about another person.' },
        { title: '6. Acceptable use', body: 'Do not use Provenic to break the law, impersonate someone, access information without permission, upload harmful code, interfere with the service, harass another participant, or upload content you are not entitled to share. Do not treat the service as a public review, fraud-labeling or complaint forum.' },
        { title: '7. Service boundaries', body: 'Provenic is a record-keeping tool, not a bank, payment processor, escrow service, legal adviser, regulator or dispute-resolution authority. It does not hold funds, determine fault, guarantee performance, certify a document or make a record automatically legally binding. Participants remain responsible for their agreements and any independent advice they need.' },
        { title: '8. Privacy and account emails', body: 'The Privacy Policy explains how information is handled. You agree that essential account messages—including verification, security and password-recovery email—may be sent to the address on your account. Marketing messages, if introduced, require separate controls where applicable.' },
        { title: '9. Ownership and feedback', body: 'Provenic and its brand, software and service materials are owned by their respective rights holders. These terms do not transfer ownership to you. You may send feedback, and Provenic may use it to improve the service without an obligation to you, subject to applicable law.' },
        { title: '10. Availability, suspension and termination', body: 'We aim to keep the service available but do not promise uninterrupted operation. We may restrict or suspend access to protect users, investigate abuse, comply with law or address a material breach. You may stop using Provenic and request account deletion. Records visible to other authorized participants and information subject to retention obligations may remain after closure.' },
        { title: '11. Disclaimers, liability and changes', body: 'To the extent allowed by law, the service is provided as available, without a guarantee that every record is accurate, complete, authentic or suitable for a particular purpose. Nothing in these terms excludes a right or liability that cannot legally be excluded. Applicable law may limit liability; the governing law and venue are intentionally not specified until the operating entity and launch jurisdiction are confirmed. We may update these terms and will show the revised version and effective date here.' },
      ],
    },
  },
  ur: {
    privacy: {
      title: 'رازداری کی پالیسی',
      intro: 'یہ پالیسی بتاتی ہے کہ Provenic صارفین اور کاروباروں کے لین دین اور وعدوں کے ریکارڈ بناتے، شیئر کرتے اور سنبھالتے وقت معلومات کو کیسے استعمال کرتا ہے۔',
      effective: 'موثر تاریخ: 14 نومبر 2026 · ورژن 2026-11-14-v1',
      draftNotice: 'یہ پروڈکٹ کے لیے تیار کردہ ابتدائی مسودہ ہے، قانونی مشورہ نہیں۔ عوامی اجرا سے پہلے آپریٹر کی قانونی شناخت، ہوسٹنگ کے علاقے، ڈیٹا رکھنے کی مدت اور قابلِ اطلاق دائرۂ اختیار کی وکیل سے تصدیق ضروری ہے۔',
      contactHeading: 'رازداری سے متعلق سوالات',
      contactBody: 'رازداری کی درخواست یا سوال کے لیے Provenic ٹیم سے رابطہ کریں:',
      sections: [
        { title: '1۔ کون سی معلومات استعمال ہوتی ہیں', body: 'اکاؤنٹ میں آپ کا نام، ای میل، زبان کی ترجیح اور تصدیق یا سیشن کی معلومات شامل ہوتی ہیں۔ ریکارڈ میں لین دین کی قسم، فریقین، کاروبار کا نام، تفصیل، طے شدہ شرائط، تاریخیں، اختیاری قیمت، اسٹیٹس، یاد دہانیاں، مسائل، ٹائم لائن کے تبصرے اور منسلک فائلیں ہو سکتی ہیں۔ سروس کی حفاظت کے لیے درخواست اور خرابی کی تشخیصی معلومات بھی استعمال ہو سکتی ہیں۔ Provenic ایپ آپ کا پاس ورڈ وصول یا محفوظ نہیں کرتی۔' },
        { title: '2۔ معلومات کا استعمال', body: 'معلومات اکاؤنٹ کی تصدیق، ریکارڈ بنانے اور دکھانے، مجاز فریقین کے ساتھ شیئر کرنے، یاد دہانیوں اور ضروری اکاؤنٹ ای میلز، معاونت، سروس کی حفاظت اور قابلِ اعتماد کارکردگی کے لیے استعمال ہوتی ہیں۔ نجی ریکارڈ کو عوامی ریٹنگ بنانے یا اختلاف میں فیصلہ دینے کے لیے استعمال نہیں کیا جاتا۔ موجودہ Provenic ادائیگی، ایسکرو یا AI پر مبنی فیصلے فراہم نہیں کرتا۔' },
        { title: '3۔ ریکارڈ تک رسائی', body: 'ریکارڈ عوامی طور پر تلاش کے قابل نہیں۔ کاروباری ورک اسپیس کے مجاز اراکین اپنے کردار کے مطابق ریکارڈ دیکھ سکتے ہیں، اور صارف اپنے ساتھ شیئر کیے گئے یا اس سے منسلک ریکارڈ دیکھ سکتا ہے۔ اندرونی کاروباری نوٹس ٹیم کے لیے ہیں، صارف کے لیے نہیں۔ محفوظ شیئر لنک محدود مدت کے لیے رسائی دے سکتا ہے اور جاری کرنے والا کاروبار فعال لنک منسوخ کر سکتا ہے۔ صرف وہی معلومات شامل کریں جسے شیئر کرنے کا آپ کو اختیار ہو۔' },
        { title: '4۔ سروس فراہم کرنے والے اور منتقلی', body: 'Provenic تصدیق، ڈیٹابیس اور نجی فائل اسٹوریج کے لیے Supabase، اور ہوسٹنگ و پروڈکشن تجزیات کے لیے Vercel استعمال کرتا ہے۔ تصدیق اور پاس ورڈ بحالی کی ای میل موجودہ auth provider بھیجتا ہے۔ یہ فراہم کنندگان اپنی شرائط کے تحت سروس چلانے کے لیے معلومات پراسیس کرتے ہیں۔ ہوسٹنگ کا درست خطہ اور سرحد پار منتقلی پروجیکٹ کی ترتیبات پر منحصر ہیں، جن کی عوامی اجرا سے پہلے تصدیق ہونی چاہیے۔' },
        { title: '5۔ کوکیز، ترجیحات اور تجزیات', body: 'سائن اِن اور اکاؤنٹ کی حفاظت کے لیے ضروری سیشن کوکیز استعمال ہوتی ہیں۔ تھیم کی ترجیح اس ڈیوائس پر اور زبان کی ترجیح پروفائل میں محفوظ ہو سکتی ہے۔ پروڈکشن میں Vercel Analytics مجموعی استعمال اور کارکردگی ناپنے کے لیے فعال ہے۔ ریکارڈ کے مواد سے اشتہاری پروفائل نہیں بنائے جاتے۔' },
        { title: '6۔ بیرونی مواد اور AI', body: 'موجودہ پروڈکٹ خودکار طور پر دوسری سروسز سے گفتگو یا دستاویزات درآمد نہیں کرتا، اور AI استخراج ابھی پروڈکشن فیچر کے طور پر فعال نہیں۔ اگر یہ صلاحیتیں شامل ہوں تو واضح صارف کارروائی، فراہم کنندہ کو کم سے کم معلومات بھیجنا، نتائج کو مسودہ دکھانا اور انسان سے جائزہ و تصدیق لازمی ہوگی۔' },
        { title: '7۔ معلومات رکھنا، برآمد اور حذف', body: 'اکاؤنٹ کی معلومات سروس فراہم کرنے کے لیے ضروری وقت تک رکھی جاتی ہیں۔ اکاؤنٹ بند ہونے کے بعد بھی دوسرے مجاز فریقین کے ریکارڈ اور تاریخ رہ سکتی ہے یا قانونی اور حفاظتی ضرورت کے تحت محفوظ کی جا سکتی ہے۔ آپ ترتیبات سے ڈیٹا برآمد یا اکاؤنٹ حذف کرنے کی درخواست دے سکتے ہیں؛ شناخت کی تصدیق درکار ہو سکتی ہے۔ ریکارڈ، فائلوں، لاگز اور بیک اپ کے لیے مقررہ مدت ابھی شائع نہیں ہوئی اور عوامی اجرا سے پہلے طے ہونی چاہیے۔' },
        { title: '8۔ سیکیورٹی اور حدود', body: 'ایپ تصدیق شدہ رسائی، کردار کی جانچ، ڈیٹابیس کی قطار کی سطح کی پالیسیاں اور نجی فائل اسٹوریج استعمال کرتی ہے۔ کوئی آن لائن سروس مکمل سیکیورٹی کی ضمانت نہیں دے سکتی۔ ٹائم لائن جمع کردہ معلومات اور بعد کی تبدیلیاں دکھاتی ہے، مگر دستاویز کی اصلیت یا ہر بیان کی سچائی کی آزادانہ تصدیق یا قانونی قبولیت کی ضمانت نہیں دیتی۔' },
        { title: '9۔ آپ کے اختیارات اور حقوق', body: 'آپ کے مقام کے قانون کے مطابق آپ معلومات دیکھنے، درست کرنے، برآمد کرنے، محدود کرنے یا حذف کرنے، یا کچھ پراسیسنگ پر اعتراض کرنے کا حق رکھتے ہو سکتے ہیں۔ آپ اکاؤنٹ بند کر کے ترتیبات سے حذف کی درخواست دے سکتے ہیں۔ ہم قانونی تقاضوں کے مطابق تصدیق اور جواب دیں گے؛ دوسرے فریق یا کاروباری ذمہ داری کے لیے کچھ ریکارڈ محفوظ رہ سکتے ہیں۔' },
        { title: '10۔ بچوں اور پالیسی کی تبدیلیاں', body: 'Provenic کاروباری اور لین دین کے ریکارڈ کی سروس ہے، بچوں کے لیے نہیں۔ اگر آپ متعلقہ شرائط قبول کرنے کی قانونی اہلیت نہیں رکھتے تو اکاؤنٹ نہ بنائیں۔ پروڈکٹ بدلنے پر ہم پالیسی اپڈیٹ کر سکتے ہیں اور نئی موثر تاریخ یہاں دکھائیں گے۔ عوامی اجرا سے پہلے آپریٹر اور قابلِ اطلاق رازداری کا دائرۂ اختیار طے کرنا ضروری ہے۔' },
      ],
    },
    terms: {
      title: 'سروس کی شرائط',
      intro: 'یہ شرائط Provenic کے استعمال پر لاگو ہوتی ہیں، جو صارفین اور کاروباروں کے لین دین اور وعدوں کے ریکارڈ بنانے اور ٹریک کرنے کی مشترکہ جگہ ہے۔ اکاؤنٹ بنا کر یا سروس استعمال کر کے آپ ان شرائط اور رازداری کی پالیسی سے اتفاق کرتے ہیں۔',
      effective: 'موثر تاریخ: 14 نومبر 2026 · ورژن 2026-11-14-v1',
      draftNotice: 'یہ پروڈکٹ کے لیے تیار کردہ ابتدائی مسودہ ہے، قانونی مشورہ نہیں۔ عوامی اجرا سے پہلے کاروباری ادارے، قابلِ اطلاق قانون، عدالت اور لازمی صارف شرائط کی وکیل سے تصدیق ضروری ہے۔',
      contactHeading: 'شرائط کے بارے میں سوالات',
      contactBody: 'Provenic ٹیم سے رابطہ کریں:',
      sections: [
        { title: '1۔ سروس', body: 'Provenic صارفین اور کاروباروں کو لین دین اور وعدوں کے ریکارڈ بنانے، شیئر کرنے، ترتیب دینے اور اپڈیٹ کرنے میں مدد دیتا ہے۔ سہولتوں میں تفصیلات، دستاویزات، ٹائم لائن، یاد دہانیاں اور مسائل کی ٹریکنگ شامل ہو سکتی ہے۔ پروڈکٹ کی ترقی کے ساتھ سہولتیں بدل سکتی ہیں۔' },
        { title: '2۔ اہلیت اور اکاؤنٹ کی حفاظت', body: 'آپ کے مقام کے قانون کے مطابق معاہدہ کرنے کے قابل ہونا اور درست اکاؤنٹ معلومات دینا ضروری ہے۔ اپنا پاس ورڈ اور سائن اِن لنک نجی رکھیں، اپنا ہی اکاؤنٹ استعمال کریں اور غیر مجاز رسائی کا شبہ ہو تو فوراً اطلاع دیں۔ قابلِ اطلاق قانون کے تابع، اپنے اکاؤنٹ کے ذریعے ہونے والی سرگرمی کے آپ ذمہ دار ہیں۔' },
        { title: '3۔ کاروباری ورک اسپیس اور کردار', body: 'کاروباری مالک ورک اسپیس کے کردار مقرر کرنے اور غیر ضروری رسائی ختم کرنے کا ذمہ دار ہے۔ اراکین معلومات صرف جائز کام اور دی گئی اجازت کے مطابق استعمال کریں۔ کوئی کاروبار دوسرے کاروبار کے نجی ریکارڈ تک رسائی حاصل یا کنٹرول سے بچنے کے لیے صارف کے تعلق کا غلط استعمال نہیں کر سکتا۔' },
        { title: '4۔ ریکارڈ، شیئرنگ اور ذمہ داری', body: 'ریکارڈ بنانے والا شخص یا کاروبار اس کے درست، مکمل اور قانونی طور پر شیئر کیے جانے کا ذمہ دار ہے۔ صارف اور کاروبار ریکارڈ کا جائزہ لیں اور اجازت یافتہ طریقے سے اصلاح طلب کریں۔ ریکارڈ شرکاء کی فراہم کردہ معلومات اور اس کی تاریخ دکھاتا ہے؛ Provenic اصل لین دین، دستاویز یا بیان کی آزادانہ تصدیق نہیں کرتا۔' },
        { title: '5۔ آپ کا مواد', body: 'آپ کے جمع کردہ مواد کے حقوق آپ کے پاس رہتے ہیں۔ آپ Provenic کو سروس چلانے، محفوظ رکھنے اور آپ کے مجاز شرکاء کو فراہم کرنے کے لیے محدود اجازت دیتے ہیں کہ وہ مواد ہوسٹ، پراسیس، دکھائے اور منتقل کرے۔ آپ تصدیق کرتے ہیں کہ آپ کو مواد، دوسرے شخص کی ذاتی معلومات اور دستاویزات اپ لوڈ اور شیئر کرنے کا اختیار ہے۔' },
        { title: '6۔ قابلِ قبول استعمال', body: 'Provenic کو قانون شکنی، کسی کی نقالی، بلا اجازت معلومات تک رسائی، نقصان دہ کوڈ اپ لوڈ کرنے، سروس میں مداخلت، ہراسانی یا ایسے مواد کے لیے استعمال نہ کریں جسے شیئر کرنے کا اختیار آپ کے پاس نہیں۔ اسے عوامی ریویو، فراڈ لیبل یا شکایتی فورم نہ سمجھیں۔' },
        { title: '7۔ سروس کی حدود', body: 'Provenic ریکارڈ رکھنے کا آلہ ہے، بینک، ادائیگی پراسیسر، ایسکرو، قانونی مشیر، ریگولیٹر یا تنازعہ حل کرنے والا ادارہ نہیں۔ یہ رقم نہیں رکھتا، قصور طے نہیں کرتا، کارکردگی کی ضمانت نہیں دیتا، دستاویز کی توثیق نہیں کرتا اور ریکارڈ کو خود بخود قانونی طور پر پابند نہیں بناتا۔ فریق اپنے معاہدوں اور درکار آزاد مشورے کے ذمہ دار رہتے ہیں۔' },
        { title: '8۔ رازداری اور اکاؤنٹ ای میل', body: 'رازداری کی پالیسی معلومات کے استعمال کی وضاحت کرتی ہے۔ آپ اس بات سے اتفاق کرتے ہیں کہ اکاؤنٹ کی تصدیق، سیکیورٹی اور پاس ورڈ بحالی جیسی ضروری ای میلز آپ کے اکاؤنٹ پتے پر بھیجی جا سکتی ہیں۔ اگر مستقبل میں مارکیٹنگ پیغامات شروع ہوں تو قابلِ اطلاق قانون کے مطابق الگ اختیارات دیے جائیں گے۔' },
        { title: '9۔ ملکیت اور رائے', body: 'Provenic اور اس کا برانڈ، سافٹ ویئر اور سروس مواد متعلقہ حقوق رکھنے والوں کی ملکیت ہیں۔ یہ شرائط ملکیت آپ کو منتقل نہیں کرتیں۔ آپ کی رائے سروس بہتر بنانے کے لیے استعمال ہو سکتی ہے، قابلِ اطلاق قانون کے تابع۔' },
        { title: '10۔ دستیابی، معطلی اور اختتام', body: 'ہم سروس دستیاب رکھنے کی کوشش کرتے ہیں مگر بلا تعطل آپریشن کا وعدہ نہیں کرتے۔ صارفین کے تحفظ، بدسلوکی کی تحقیق، قانون کی پابندی یا اہم خلاف ورزی کے ازالے کے لیے رسائی محدود ہو سکتی ہے۔ آپ سروس چھوڑ کر اکاؤنٹ حذف کرنے کی درخواست دے سکتے ہیں۔ دوسرے مجاز فریقین کے ریکارڈ اور قانونی ضرورت کا ڈیٹا باقی رہ سکتا ہے۔' },
        { title: '11۔ ضمانت، ذمہ داری اور تبدیلیاں', body: 'قانون کی اجازت کی حد تک سروس دستیاب حالت میں فراہم کی جاتی ہے؛ ہر ریکارڈ کے درست، مکمل، اصلی یا کسی خاص مقصد کے لیے موزوں ہونے کی ضمانت نہیں۔ کوئی حق یا ذمہ داری خارج نہیں جو قانوناً خارج نہیں کی جا سکتی۔ آپریٹنگ ادارہ اور اجرا کا دائرۂ اختیار طے ہونے تک قابلِ اطلاق قانون اور عدالت درج نہیں کیے گئے۔ نئی شرائط اور ان کی موثر تاریخ اسی صفحے پر دکھائی جائے گی۔' },
      ],
    },
  },
  ar: {
    privacy: {
      title: 'سياسة الخصوصية',
      intro: 'توضح هذه السياسة كيفية معالجة Provenic للمعلومات عندما ينشئ العملاء والشركات سجلات المعاملات والالتزامات ويشاركونها ويديرونها.',
      effective: 'سارية من 14 نوفمبر 2026 · الإصدار 2026-11-14-v1',
      draftNotice: 'مسودة خاصة بالمنتج للمراجعة وليست استشارة قانونية. يجب تأكيد هوية المشغّل القانونية ومناطق الاستضافة ومدد الاحتفاظ والحقوق المحلية مع مستشار مؤهل قبل الإطلاق العام.',
      contactHeading: 'أسئلة الخصوصية',
      contactBody: 'لإرسال طلب أو سؤال متعلق بالخصوصية، تواصل مع فريق Provenic عبر',
      sections: [
        { title: '1. المعلومات التي نعالجها', body: 'تشمل معلومات الحساب اسمك وبريدك الإلكتروني ولغتك المفضلة ومعلومات المصادقة والجلسة. قد تتضمن السجلات نوع المعاملة والأطراف واسم الشركة والوصف والشروط المتفق عليها والتواريخ والمبالغ الاختيارية وتحديثات الحالة والتذكيرات والمشكلات والتعليقات والملفات. ونعالج أيضًا بيانات تشخيصية وأمنية مثل الطلبات والأخطاء. لا يستقبل تطبيق Provenic كلمة مرور حسابك ولا يخزنها.' },
        { title: '2. كيفية استخدام المعلومات', body: 'نستخدم المعلومات لإنشاء السجلات وعرضها، والتحقق من الحسابات، ومشاركة السجل مع المشاركين المصرح لهم، وإرسال التذكيرات ورسائل الحساب الضرورية، وتقديم الدعم وحماية الخدمة وفهم موثوقيتها. لا نستخدم محتوى السجلات الخاصة لإنشاء تقييمات عامة أو للفصل في الخلافات. لا يقدم Provenic حاليًا مدفوعات أو ضمانًا ماليًا أو قرارات قائمة على الذكاء الاصطناعي.' },
        { title: '3. من يمكنه الاطلاع على السجل', body: 'لا يمكن البحث عن السجلات علنًا. يمكن لأعضاء مساحة عمل الشركة المصرح لهم الاطلاع على السجلات وفق دورهم، ويمكن للعميل الاطلاع على السجلات التي تمت مشاركتها معه أو ربطها به. الملاحظات الداخلية مخصصة لفريق الشركة. قد يتيح رابط مشاركة آمن الوصول لفترة محدودة، ويمكن للشركة المصدرة إلغاؤه. لا تضف معلومات ما لم يكن لديك إذن بمشاركتها.' },
        { title: '4. مقدمو الخدمات ونقل البيانات', body: 'يستخدم Provenic خدمة Supabase للمصادقة وقاعدة البيانات وتخزين الملفات الخاص، وVercel لاستضافة التطبيق وتحليلات الإنتاج. يرسل مزود المصادقة رسائل تأكيد البريد واستعادة كلمة المرور. يعالج هؤلاء المزودون البيانات وفق شروطهم لتشغيل الخدمة. تعتمد منطقة الاستضافة وأي نقل عبر الحدود على إعدادات المشروع، ويجب تأكيدها قبل الإطلاق العام.' },
        { title: '5. ملفات الارتباط والتفضيلات والتحليلات', body: 'تدعم ملفات الجلسة الضرورية تسجيل الدخول وأمان الحساب. قد يُحفظ مظهر الواجهة على هذا الجهاز وقد تُحفظ اللغة في ملفك الشخصي. تُفعّل Vercel Analytics في الإنتاج لقياس الاستخدام والأداء بصورة إجمالية. لا ننشئ ملفات إعلانية من محتوى السجلات.' },
        { title: '6. المحتوى المستورد والذكاء الاصطناعي', body: 'لا يستورد المنتج الحالي تلقائيًا المحادثات أو المستندات من خدمات خارجية، كما أن استخراج المعلومات بالذكاء الاصطناعي غير مفعّل كميزة إنتاجية. إذا أُضيفت هذه القدرات، فستتطلب إجراءً صريحًا من المستخدم، وتقليل البيانات المرسلة، وإظهار النتائج كمسودات ومراجعتها وتأكيدها بشريًا.' },
        { title: '7. الاحتفاظ والتصدير والحذف', body: 'نحتفظ بمعلومات الحساب طالما لزم تقديم الخدمة. قد تبقى السجلات وسجلها متاحين للمشاركين المصرح لهم أو للشركة بعد إغلاق حساب فرد، وقد تُحتفظ بها لأسباب قانونية أو أمنية. يمكنك طلب تصدير البيانات أو حذف الحساب من الإعدادات، وقد نطلب التحقق من الهوية. لم تُنشر بعد مدد ثابتة للاحتفاظ بالسجلات والملفات والسجلات التقنية والنسخ الاحتياطية؛ ويجب تحديدها قبل الإطلاق العام.' },
        { title: '8. الأمان والحدود', body: 'يستخدم التطبيق وصولًا موثقًا وفحوصًا للأدوار وسياسات صفوف قاعدة البيانات وتخزينًا خاصًا للملفات. لا يمكن لأي خدمة عبر الإنترنت ضمان الأمان المطلق. يعرض الخط الزمني المعلومات المقدمة والتغييرات اللاحقة، لكنه لا يتحقق مستقلًا من أصالة المستندات أو صحة كل بيان ولا يضمن قبوله قانونيًا.' },
        { title: '9. خياراتك وحقوقك', body: 'قد يمنحك القانون المحلي حق الاطلاع على معلوماتك أو تصحيحها أو تصديرها أو تقييدها أو حذفها أو الاعتراض على بعض المعالجات. يمكنك إغلاق الحساب وطلب الحذف من الإعدادات. سنتحقق من الطلبات ونرد عليها وفق القانون؛ وقد يلزم الاحتفاظ ببعض سجلات الأعمال لمصلحة المشاركين الآخرين أو للالتزامات القانونية.' },
        { title: '10. الأطفال وتغييرات السياسة', body: 'Provenic خدمة لسجلات الأعمال والمعاملات وليست موجهة للأطفال. لا تنشئ حسابًا إذا لم تكن مؤهلًا قانونيًا لقبول الشروط. قد نحدّث السياسة مع تطور المنتج وسنعرض تاريخ السريان الجديد هنا. يجب تحديد المشغّل والاختصاص القانوني للخصوصية قبل الإطلاق العام.' },
      ],
    },
    terms: {
      title: 'شروط الخدمة',
      intro: 'تنظم هذه الشروط الوصول إلى Provenic، وهي مساحة مشتركة لتسجيل معاملات العملاء والشركات والتزاماتهم ومتابعتها. بإنشاء حساب أو استخدام الخدمة، توافق على هذه الشروط وسياسة الخصوصية.',
      effective: 'سارية من 14 نوفمبر 2026 · الإصدار 2026-11-14-v1',
      draftNotice: 'مسودة خاصة بالمنتج للمراجعة وليست استشارة قانونية. يجب تأكيد الكيان المشغّل والقانون والاختصاص وأي شروط إلزامية للمستهلك مع مستشار مؤهل قبل الإطلاق العام.',
      contactHeading: 'أسئلة حول الشروط',
      contactBody: 'تواصل مع فريق Provenic عبر',
      sections: [
        { title: '1. الخدمة', body: 'يساعد Provenic العملاء والشركات على إنشاء سجلات المعاملات والالتزامات ومشاركتها وتنظيمها ومتابعة تحديثاتها. قد تشمل الميزات تفاصيل منظمة ومستندات وخطًا زمنيًا وتذكيرات وتتبع المشكلات، وقد تتغير مع تطور المنتج.' },
        { title: '2. الأهلية وأمان الحساب', body: 'يجب أن تكون مؤهلًا قانونيًا لإبرام اتفاق في مكان إقامتك وأن تقدم معلومات حساب صحيحة. احتفظ بكلمة المرور وروابط الدخول سرية، واستخدم حسابك فقط، وأبلغنا فورًا عن أي دخول غير مصرح به. تتحمل مسؤولية النشاط عبر حسابك ما لم ينص القانون على خلاف ذلك.' },
        { title: '3. مساحات العمل والأدوار', body: 'يتولى مالك الشركة تحديد أدوار مساحة العمل وإزالة الوصول عند عدم الحاجة إليه. يستخدم الأعضاء المعلومات لأغراض العمل المشروعة وفي حدود صلاحياتهم. لا يجوز للشركة الوصول إلى سجلات شركة أخرى أو تجاوز الضوابط مستغلةً علاقتها بالعميل.' },
        { title: '4. السجلات والمشاركة والمسؤولية', body: 'يتحمل منشئ السجل، سواء كان شخصًا أو شركة، مسؤولية دقة المحتوى واكتماله ومشروعية مشاركته. ينبغي للأطراف مراجعة السجل وطلب التصحيح عبر المسار المسموح. يعرض السجل المعلومات التي قدمها المشاركون وتاريخها اللاحق؛ ولا يتحقق Provenic مستقلًا من المعاملة أو المستند أو البيان.' },
        { title: '5. المحتوى الخاص بك', body: 'تظل حقوق المحتوى الذي تقدمه لك. وتمنح Provenic إذنًا محدودًا باستضافته ومعالجته وعرضه ونقله بالقدر اللازم لتشغيل الخدمة وتأمينها وتقديمها لك وللمشاركين المصرح لهم. وتؤكد امتلاكك الأذونات اللازمة لرفع المحتوى ومشاركته، بما فيه معلومات الآخرين ومستنداتهم.' },
        { title: '6. الاستخدام المقبول', body: 'لا تستخدم Provenic لمخالفة القانون أو انتحال شخصية أو الوصول دون إذن أو رفع برمجيات ضارة أو تعطيل الخدمة أو مضايقة مشارك أو مشاركة محتوى لا تملك حق نشره. ولا تستخدمه كمنتدى تقييمات عامة أو تصنيف احتيال أو شكاوى مفتوحة.' },
        { title: '7. حدود الخدمة', body: 'Provenic أداة لحفظ السجلات وليس بنكًا أو معالج مدفوعات أو خدمة ضمان مالي أو مستشارًا قانونيًا أو جهة تنظيمية أو هيئة للفصل في النزاعات. لا يحتفظ بالأموال ولا يحدد المخطئ ولا يضمن الأداء ولا يصادق على المستندات ولا يجعل السجل ملزمًا قانونيًا تلقائيًا. يتحمل المشاركون مسؤولية اتفاقاتهم وطلب المشورة المستقلة.' },
        { title: '8. الخصوصية ورسائل الحساب', body: 'توضح سياسة الخصوصية كيفية التعامل مع المعلومات. توافق على تلقي رسائل الحساب الأساسية، ومنها التحقق والأمان واستعادة كلمة المرور، على بريدك المسجل. وإذا أُضيفت رسائل تسويقية فستتوفر الضوابط المنفصلة التي يتطلبها القانون.' },
        { title: '9. الملكية والملاحظات', body: 'يملك أصحاب الحقوق المعنيون Provenic وعلامته وبرمجياته ومواد الخدمة. لا تنقل هذه الشروط الملكية إليك. يمكن استخدام ملاحظاتك لتحسين الخدمة وفق القانون المعمول به.' },
        { title: '10. التوفر والتعليق والإنهاء', body: 'نسعى إلى إتاحة الخدمة لكننا لا نعد بتشغيل متواصل بلا انقطاع. قد نقيّد الوصول لحماية المستخدمين أو التحقيق في إساءة الاستخدام أو الامتثال للقانون أو معالجة مخالفة جوهرية. يمكنك التوقف عن الاستخدام وطلب حذف الحساب. قد تبقى السجلات المتاحة للمشاركين المصرح لهم والمعلومات اللازم الاحتفاظ بها.' },
        { title: '11. إخلاء المسؤولية والتغييرات', body: 'بالقدر الذي يسمح به القانون، تقدم الخدمة كما هي متاحة دون ضمان أن كل سجل دقيق أو كامل أو أصلي أو مناسب لغرض معين. لا تستبعد هذه الشروط حقًا أو مسؤولية لا يجوز استبعادها قانونًا. لم يُحدد القانون أو الاختصاص قبل تأكيد الكيان المشغّل ومكان الإطلاق. سنعرض أي نسخة جديدة وتاريخ سريانها على هذه الصفحة.' },
      ],
    },
  },
  zh: {
    privacy: {
      title: '隐私政策',
      intro: '本政策说明客户和商家在 Provenic 创建、共享和管理交易与承诺记录时，我们如何处理相关信息。',
      effective: '生效日期：2026 年 11 月 14 日 · 版本 2026-11-14-v1',
      draftNotice: '这是针对当前产品的审阅稿，不构成法律意见。公开发布前，须由专业法律顾问确认运营主体、托管地区、保留期限及适用司法辖区的权利要求。',
      contactHeading: '隐私相关问题',
      contactBody: '如有隐私请求或问题，请通过以下邮箱联系 Provenic 团队：',
      sections: [
        { title: '1. 我们处理的信息', body: '账户信息包括姓名、电子邮箱、语言偏好以及身份验证和会话信息。记录可能包含交易类型、参与方、商家名称、描述、约定条款、日期、可选金额、状态更新、提醒、问题、时间线评论以及你或获授权商家添加的文件。为保障服务，我们也会处理请求和错误等安全诊断信息。Provenic 应用不会接收或存储你的账户密码。' },
        { title: '2. 信息用途', body: '我们使用信息来创建和展示记录、验证账户、与获授权参与方共享记录、发送提醒和必要的账户邮件、响应请求、保护服务并了解运行可靠性。我们不会用私人记录内容生成公开评分或裁决争议。目前 Provenic 不提供支付、托管资金或 AI 决策功能。' },
        { title: '3. 谁可以查看记录', body: '记录不会被公开搜索。获授权的商家工作区成员可按其角色查看记录；客户可查看与其共享或关联的记录。商家内部备注仅供商家团队使用，不面向客户。安全共享链接可能在有限期限内提供访问权限，签发商家可撤销有效链接。请勿添加你无权共享的信息。' },
        { title: '4. 服务提供商与数据传输', body: 'Provenic 使用 Supabase 提供身份验证、数据库和私有文件存储，并使用 Vercel 托管应用和提供生产环境分析。账户确认与密码恢复邮件由所配置的身份验证邮件服务商发送。这些服务商依其条款为运行服务处理数据。托管地区及跨境传输取决于项目配置，须在公开发布前确认。' },
        { title: '5. Cookie、偏好与分析', body: '必要的会话 Cookie 用于登录和账户安全。界面主题偏好可能保存在本设备，语言偏好可能保存在个人资料中。生产环境启用 Vercel Analytics，以汇总方式衡量服务使用情况和性能。我们不会根据记录内容建立广告画像。' },
        { title: '6. 导入内容与 AI', body: '当前产品不会自动从外部服务导入对话或文件，AI 信息提取也尚未作为生产功能启用。如未来推出此类功能，必须由用户明确操作，尽量减少发送给服务商的信息，将提取结果标记为草稿，并由人工审核确认。' },
        { title: '7. 保留、导出与删除', body: '我们会在提供服务所需期间保留账户信息。个人账户关闭后，其他获授权参与方或商家可能仍需访问相关记录和历史；法律或安全要求也可能要求保留。你可以在设置中申请导出数据或删除账户，申请可能需要身份验证。目前尚未公布记录、文件、日志和备份的固定保留期限，公开发布前必须确定。' },
        { title: '8. 安全与限制', body: '应用采用经过身份验证的访问、角色检查、数据库行级策略和私有文件存储。任何在线服务都无法保证绝对安全。时间线有助于呈现提交的信息及后续变更，但不会独立验证文件真伪、每项陈述的真实性，也不保证法律上的可采性。' },
        { title: '9. 你的选择与权利', body: '根据你所在地的法律，你可能有权访问、更正、导出、限制或删除个人信息，或反对某些处理。你也可以关闭账户并通过设置提交删除请求。我们会依适用法律验证并回应请求；为其他参与方或法定义务保留部分商家记录可能是必要的。' },
        { title: '10. 儿童与政策变更', body: 'Provenic 面向商业和交易记录场景，并非为儿童设计。如果你不具备接受适用条款的法律能力，请勿创建账户。随着产品变化，我们可能更新本政策，并在此显示新的生效日期。公开发布前须确认运营方和适用的隐私司法辖区。' },
      ],
    },
    terms: {
      title: '服务条款',
      intro: '本条款适用于 Provenic——一个用于记录和跟踪客户与商家交易及承诺的共享空间。创建账户或使用服务，即表示你同意本条款和隐私政策。',
      effective: '生效日期：2026 年 11 月 14 日 · 版本 2026-11-14-v1',
      draftNotice: '这是针对当前产品的审阅稿，不构成法律意见。公开发布前，须由专业法律顾问确认运营主体、适用法律、管辖地点及强制性消费者条款。',
      contactHeading: '条款相关问题',
      contactBody: '请通过以下邮箱联系 Provenic 团队：',
      sections: [
        { title: '1. 服务内容', body: 'Provenic 帮助客户和商家创建、共享、整理交易与承诺记录，并跟踪更新。功能可能包括结构化详情、文件、时间线、提醒和问题跟踪。产品发展过程中，功能可能发生变化。' },
        { title: '2. 账户资格与安全', body: '你必须具备所在地法律要求的缔约能力，并提供准确的账户信息。请妥善保管密码和登录链接，仅使用自己的账户；如发现未授权访问，请及时报告。除适用法律另有规定外，你需对账户中的活动负责。' },
        { title: '3. 商家工作区与角色', body: '商家所有者负责分配合适的工作区角色，并在不再需要时撤销访问权限。成员只能在获授权的工作范围内合法使用信息。任何商家都不得访问其他商家的私人记录，也不得利用客户关系绕过访问控制。' },
        { title: '4. 记录、共享与责任', body: '创建记录的个人或商家负责内容准确、完整且共享合法。客户与商家应查看记录，并通过允许的流程提出更正。记录呈现参与方提交的信息及后续历史；Provenic 不会独立验证底层交易、文件或陈述。' },
        { title: '5. 你的内容', body: '你保留所提交内容的权利。你授予 Provenic 有限许可，仅在为你及获授权参与方运营、保护和提供服务所必需的范围内托管、处理、展示和传输内容。你确认自己有权上传和共享该内容，包括涉及他人的个人信息或文件。' },
        { title: '6. 可接受的使用方式', body: '不得利用 Provenic 违法、冒充他人、未经许可访问信息、上传恶意代码、干扰服务、骚扰参与方，或共享无权发布的内容。不得将其用作公开评价、欺诈标签或开放投诉平台。' },
        { title: '7. 服务边界', body: 'Provenic 是记录工具，不是银行、支付处理商、资金托管服务、法律顾问、监管机构或争议裁决方。它不持有资金、不认定责任、不保证履约、不认证文件，也不会自动使记录具有法律约束力。参与方仍须对其协议及所需的独立建议负责。' },
        { title: '8. 隐私与账户邮件', body: '隐私政策说明信息处理方式。你同意我们向账户邮箱发送必要邮件，包括验证、安全和密码恢复消息。如未来推出营销邮件，将依适用法律提供相应控制选项。' },
        { title: '9. 所有权与反馈', body: 'Provenic、其品牌、软件和服务材料归相应权利人所有。本条款不会将其所有权转让给你。你可以提供反馈；在适用法律允许的范围内，Provenic 可用其改进服务。' },
        { title: '10. 可用性、暂停与终止', body: '我们努力维持服务可用，但不保证服务不会中断。为保护用户、调查滥用、遵守法律或处理重大违约，我们可能限制或暂停访问。你可以停止使用并申请删除账户。其他获授权参与方可见的记录和依法须保留的信息可能继续保存。' },
        { title: '11. 免责声明、责任与变更', body: '在法律允许范围内，服务按可用状态提供，不保证每条记录都准确、完整、真实或适合特定用途。本条款不排除依法不得排除的权利或责任。在运营主体和发布司法辖区确定前，我们暂不指定适用法律与管辖地点。更新后的条款及生效日期会显示在本页。' },
      ],
    },
  },
}

export function getLegalDocument(locale: Locale, kind: LegalKind) {
  return documents[locale][kind]
}
