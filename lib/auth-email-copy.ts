import type { Locale } from '@/lib/i18n/config'

export type AuthEmailKind = 'confirm' | 'recovery' | 'signin' | 'emailChange' | 'notice'
export type AuthEmailCopy = {
  subject: string
  preheader: string
  title: string
  body: string
  action: string
  footer: string
}

const copy: Record<Locale, Record<AuthEmailKind, AuthEmailCopy>> = {
  en: {
    confirm: {
      subject: 'Confirm your Provenic email',
      preheader: 'Finish creating your Provenic account.',
      title: 'Confirm your email',
      body: 'Use the secure link below to confirm this email address and finish creating your Provenic account.',
      action: 'Confirm email',
      footer: 'If you did not request this, you can ignore this email.',
    },
    recovery: {
      subject: 'Reset your Provenic password',
      preheader: 'A secure password reset link was requested.',
      title: 'Choose a new password',
      body: 'Use the secure link below to choose a new password for your Provenic account.',
      action: 'Reset password',
      footer: 'If you did not request a reset, you can ignore this email. Your current password will remain unchanged.',
    },
    signin: {
      subject: 'Your secure Provenic sign-in link',
      preheader: 'Use this link to continue to Provenic.',
      title: 'Sign in to Provenic',
      body: 'Use the secure link below to continue signing in to your Provenic account.',
      action: 'Continue to Provenic',
      footer: 'If you did not request this link, you can ignore this email.',
    },
    emailChange: {
      subject: 'Confirm your Provenic email change',
      preheader: 'Confirm the requested change to your account email.',
      title: 'Confirm this email change',
      body: 'A request was made to change an email address on a Provenic account. Use the secure link below to confirm this step.',
      action: 'Confirm email change',
      footer: 'If you did not request this change, secure your account and contact Provenic support.',
    },
    notice: {
      subject: 'A Provenic account security update',
      preheader: 'A security-related change was made to your account.',
      title: 'Account security update',
      body: 'A security-related change was made to your Provenic account. If you do not recognize this activity, secure your account and contact us.',
      action: '',
      footer: 'This is an account security message from Provenic.',
    },
  },
  ur: {
    confirm: {
      subject: 'Provenic ای میل کی تصدیق کریں',
      preheader: 'اپنا Provenic اکاؤنٹ بنانے کا عمل مکمل کریں۔',
      title: 'اپنی ای میل کی تصدیق کریں',
      body: 'اس محفوظ لنک سے ای میل پتے کی تصدیق کریں اور اپنا Provenic اکاؤنٹ مکمل کریں۔',
      action: 'ای میل کی تصدیق کریں',
      footer: 'اگر آپ نے یہ درخواست نہیں کی تو اس ای میل کو نظر انداز کر دیں۔',
    },
    recovery: {
      subject: 'Provenic پاس ورڈ ری سیٹ کریں',
      preheader: 'محفوظ پاس ورڈ ری سیٹ لنک کی درخواست موصول ہوئی۔',
      title: 'نیا پاس ورڈ منتخب کریں',
      body: 'اپنے Provenic اکاؤنٹ کے لیے نیا پاس ورڈ منتخب کرنے کے لیے نیچے دیا گیا محفوظ لنک استعمال کریں۔',
      action: 'پاس ورڈ ری سیٹ کریں',
      footer: 'اگر آپ نے ری سیٹ کی درخواست نہیں کی تو اس ای میل کو نظر انداز کریں۔ آپ کا موجودہ پاس ورڈ تبدیل نہیں ہوگا۔',
    },
    signin: {
      subject: 'آپ کا محفوظ Provenic سائن اِن لنک',
      preheader: 'Provenic پر جاری رکھنے کے لیے یہ لنک استعمال کریں۔',
      title: 'Provenic میں سائن اِن کریں',
      body: 'اپنے Provenic اکاؤنٹ میں سائن اِن جاری رکھنے کے لیے نیچے دیا گیا محفوظ لنک استعمال کریں۔',
      action: 'Provenic پر جاری رکھیں',
      footer: 'اگر آپ نے یہ لنک نہیں مانگا تو اسے نظر انداز کر دیں۔',
    },
    emailChange: {
      subject: 'Provenic ای میل تبدیلی کی تصدیق کریں',
      preheader: 'اپنے اکاؤنٹ کے ای میل پتے کی تبدیلی کی تصدیق کریں۔',
      title: 'ای میل کی تبدیلی کی تصدیق کریں',
      body: 'Provenic اکاؤنٹ کا ای میل پتہ تبدیل کرنے کی درخواست کی گئی ہے۔ اس مرحلے کی تصدیق کے لیے نیچے محفوظ لنک استعمال کریں۔',
      action: 'ای میل تبدیلی کی تصدیق کریں',
      footer: 'اگر یہ تبدیلی آپ نے نہیں کی تو اکاؤنٹ محفوظ کریں اور Provenic سپورٹ سے رابطہ کریں۔',
    },
    notice: {
      subject: 'Provenic اکاؤنٹ کی سیکیورٹی اپڈیٹ',
      preheader: 'آپ کے اکاؤنٹ میں سیکیورٹی سے متعلق تبدیلی ہوئی ہے۔',
      title: 'اکاؤنٹ سیکیورٹی اپڈیٹ',
      body: 'آپ کے Provenic اکاؤنٹ میں سیکیورٹی سے متعلق تبدیلی ہوئی ہے۔ اگر یہ سرگرمی آپ کی نہیں تو اکاؤنٹ محفوظ کریں اور ہم سے رابطہ کریں۔',
      action: '',
      footer: 'یہ Provenic کی اکاؤنٹ سیکیورٹی ای میل ہے۔',
    },
  },
  ar: {
    confirm: {
      subject: 'تأكيد بريدك الإلكتروني في Provenic',
      preheader: 'أكمل إنشاء حسابك في Provenic.',
      title: 'أكد بريدك الإلكتروني',
      body: 'استخدم الرابط الآمن أدناه لتأكيد هذا البريد الإلكتروني وإكمال إنشاء حسابك في Provenic.',
      action: 'تأكيد البريد الإلكتروني',
      footer: 'إذا لم تطلب ذلك، يمكنك تجاهل هذه الرسالة.',
    },
    recovery: {
      subject: 'إعادة تعيين كلمة مرور Provenic',
      preheader: 'تم طلب رابط آمن لإعادة تعيين كلمة المرور.',
      title: 'اختر كلمة مرور جديدة',
      body: 'استخدم الرابط الآمن أدناه لاختيار كلمة مرور جديدة لحسابك في Provenic.',
      action: 'إعادة تعيين كلمة المرور',
      footer: 'إذا لم تطلب إعادة التعيين، يمكنك تجاهل الرسالة. ستبقى كلمة مرورك الحالية كما هي.',
    },
    signin: {
      subject: 'رابط تسجيل الدخول الآمن إلى Provenic',
      preheader: 'استخدم هذا الرابط للمتابعة إلى Provenic.',
      title: 'سجّل الدخول إلى Provenic',
      body: 'استخدم الرابط الآمن أدناه لمتابعة تسجيل الدخول إلى حسابك في Provenic.',
      action: 'المتابعة إلى Provenic',
      footer: 'إذا لم تطلب هذا الرابط، يمكنك تجاهل الرسالة.',
    },
    emailChange: {
      subject: 'تأكيد تغيير بريدك الإلكتروني في Provenic',
      preheader: 'أكد طلب تغيير البريد الإلكتروني لحسابك.',
      title: 'أكد تغيير البريد الإلكتروني',
      body: 'تم طلب تغيير عنوان البريد الإلكتروني لحساب Provenic. استخدم الرابط الآمن أدناه لتأكيد هذه الخطوة.',
      action: 'تأكيد تغيير البريد',
      footer: 'إذا لم تطلب هذا التغيير، فأمّن حسابك وتواصل مع دعم Provenic.',
    },
    notice: {
      subject: 'تحديث أمان حساب Provenic',
      preheader: 'حدث تغيير متعلق بالأمان في حسابك.',
      title: 'تحديث أمان الحساب',
      body: 'حدث تغيير متعلق بالأمان في حسابك على Provenic. إذا لم تتعرف على هذا النشاط، فأمّن حسابك وتواصل معنا.',
      action: '',
      footer: 'هذه رسالة أمان للحساب من Provenic.',
    },
  },
  zh: {
    confirm: {
      subject: '确认你的 Provenic 邮箱',
      preheader: '完成 Provenic 账户创建。',
      title: '确认你的邮箱',
      body: '请使用下方安全链接确认此邮箱地址，并完成 Provenic 账户创建。',
      action: '确认邮箱',
      footer: '如果这不是你发起的请求，可以忽略此邮件。',
    },
    recovery: {
      subject: '重置 Provenic 密码',
      preheader: '有人申请了安全密码重置链接。',
      title: '设置新密码',
      body: '请使用下方安全链接为你的 Provenic 账户设置新密码。',
      action: '重置密码',
      footer: '如果不是你申请的重置，请忽略此邮件；当前密码不会改变。',
    },
    signin: {
      subject: '你的 Provenic 安全登录链接',
      preheader: '使用此链接继续访问 Provenic。',
      title: '登录 Provenic',
      body: '请使用下方安全链接继续登录你的 Provenic 账户。',
      action: '继续访问 Provenic',
      footer: '如果不是你申请的链接，可以忽略此邮件。',
    },
    emailChange: {
      subject: '确认更改 Provenic 邮箱',
      preheader: '确认账户邮箱变更请求。',
      title: '确认邮箱变更',
      body: '有人请求更改 Provenic 账户的邮箱地址。请使用下方安全链接确认此步骤。',
      action: '确认邮箱变更',
      footer: '如果不是你发起的变更，请保护账户并联系 Provenic 支持。',
    },
    notice: {
      subject: 'Provenic 账户安全更新',
      preheader: '你的账户发生了一项安全相关变更。',
      title: '账户安全更新',
      body: '你的 Provenic 账户发生了一项安全相关变更。如果你不认识此活动，请保护账户并联系我们。',
      action: '',
      footer: '这是一封来自 Provenic 的账户安全邮件。',
    },
  },
}

export function getAuthEmailCopy(locale: Locale, kind: AuthEmailKind) {
  return copy[locale][kind]
}
