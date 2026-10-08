// Internationalization (i18n) Engine for znY Track
import React, { createContext, useContext, useState, useEffect } from 'react';

export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'ar' | 'hi' | 'pt' | 'zh';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  dir?: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', dir: 'ltr' },
  { code: 'zh', name: 'Chinese', nativeName: '简体中文', flag: '🇨🇳', dir: 'ltr' },
];

export const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Navigation
    'nav.workout': 'Workout',
    'nav.plan': 'Plan',
    'nav.dietary': 'Dietary',
    'nav.progress': 'Progress',
    'nav.chat': 'Community',
    'nav.coach': 'AI Coach',

    // App Branding
    'app.name': 'znY Track',
    'app.subtitle': 'Tactile Workout Logger & Sports Nutrition',

    // Auth & Profile
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Create Account',
    'auth.signOut': 'Sign Out',
    'auth.profile': 'Athlete Profile',
    'auth.guest': 'Guest Lifter',
    'auth.streak': 'Day Streak',
    'auth.level': 'Fitness Level',
    'auth.memberSince': 'Member Since',
    'auth.quickAthletes': 'Instant Demo Athletes',
    'auth.syncNotice': 'Sync Workouts, Macros & Community Chat',

    // Language
    'lang.select': 'Select Language',
    'lang.current': 'Language',

    // Workout Logger
    'workout.startSet': 'Log Set',
    'workout.finishSet': 'Complete Set',
    'workout.restTimer': 'Rest Timer',
    'workout.reps': 'Reps',
    'workout.rom': 'Range of Motion',
    'workout.formScore': 'Form Score',
    'workout.goodDepth': 'Optimal Depth Reached',
    'workout.keepForm': 'Maintain Spine & Joint Stack',
    'workout.cvActive': 'Workout Logger Active',
    'workout.cameraFeed': 'Set Logger',

    // Plan & Training
    'plan.weeklySplit': 'Weekly Kinetic Split',
    'plan.aiAnalyze': 'AI Analyze Split',
    'plan.customize': 'Customize Day',
    'plan.targetReps': 'Target Reps',

    // Dietary
    'dietary.calorieTarget': 'Daily Calorie Target',
    'dietary.burned': 'Workout Burned',
    'dietary.netBalance': 'Net Remaining',
    'dietary.protein': 'Protein',
    'dietary.carbs': 'Carbs',
    'dietary.fats': 'Fats',
    'dietary.water': 'Hydration',
    'dietary.logMeal': 'Log Meal',
    'dietary.aiScan': 'AI Scan Meal',

    // Community Chat
    'chat.title': 'znY Track Lifters Lounge',
    'chat.subtitle': 'Chat with fellow athletes & share logged sets',
    'chat.typePlaceholder': 'Message the lifters (type @coach to ask AI)...',
    'chat.send': 'Send',
    'chat.onlineAthletes': 'Online in the Gym',
    'chat.channels': 'Channels',
    'chat.attachSet': 'Attach Set',
    'chat.latestSetAttached': 'Attached Set',
    'chat.noMessages': 'No messages yet in this channel. Break the ice!',
  },
  es: {
    // Navigation
    'nav.workout': 'Entreno',
    'nav.plan': 'Plan',
    'nav.dietary': 'Nutrición',
    'nav.progress': 'Progreso',
    'nav.chat': 'Comunidad',
    'nav.coach': 'Coach IA',

    // App Branding
    'app.name': 'znY Track',
    'app.subtitle': 'Registro Táctil de Entrenamientos y Nutrición',

    // Auth & Profile
    'auth.signIn': 'Iniciar Sesión',
    'auth.signUp': 'Crear Cuenta',
    'auth.signOut': 'Cerrar Sesión',
    'auth.profile': 'Perfil de Atleta',
    'auth.guest': 'Atleta Invitado',
    'auth.streak': 'Días de Racha',
    'auth.level': 'Nivel Físico',
    'auth.memberSince': 'Miembro Desde',
    'auth.quickAthletes': 'Atletas Demo Rápidos',
    'auth.syncNotice': 'Sincroniza Entrenamientos, Macros y Chat',

    // Language
    'lang.select': 'Seleccionar Idioma',
    'lang.current': 'Idioma',

    // Workout Logger
    'workout.startSet': 'Registrar Serie',
    'workout.finishSet': 'Completar Serie',
    'workout.restTimer': 'Descanso',
    'workout.reps': 'Reps',
    'workout.rom': 'Rango de Movimiento',
    'workout.formScore': 'Puntaje de Técnica',
    'workout.goodDepth': 'Profundidad Óptima Alcanzada',
    'workout.keepForm': 'Mantén la Alineación Espinal',
    'workout.cvActive': 'Registro de Entrenamiento Activo',
    'workout.cameraFeed': 'Registro de Series',

    // Plan & Training
    'plan.weeklySplit': 'Rutina Semanal Cinética',
    'plan.aiAnalyze': 'Analizar Rutina con IA',
    'plan.customize': 'Personalizar Día',
    'plan.targetReps': 'Reps Objetivo',

    // Dietary
    'dietary.calorieTarget': 'Objetivo Calórico Diario',
    'dietary.burned': 'Calorías Quemadas',
    'dietary.netBalance': 'Restante Neto',
    'dietary.protein': 'Proteína',
    'dietary.carbs': 'Carbohidratos',
    'dietary.fats': 'Grasas',
    'dietary.water': 'Hidratación',
    'dietary.logMeal': 'Registrar Comida',
    'dietary.aiScan': 'Escanear con IA',

    // Community Chat
    'chat.title': 'Salón de Atletas znY Track',
    'chat.subtitle': 'Chatea con otros atletas y comparte tus series',
    'chat.typePlaceholder': 'Escribe un mensaje (@coach para preguntar a la IA)...',
    'chat.send': 'Enviar',
    'chat.onlineAthletes': 'Atletas en el Gimnasio',
    'chat.channels': 'Canales',
    'chat.attachSet': 'Adjuntar Serie',
    'chat.latestSetAttached': 'Serie Adjunta',
    'chat.noMessages': 'No hay mensajes aún. ¡Sé el primero en escribir!',
  },
  fr: {
    // Navigation
    'nav.workout': 'Séance',
    'nav.plan': 'Programme',
    'nav.dietary': 'Nutrition',
    'nav.progress': 'Progrès',
    'nav.chat': 'Communauté',
    'nav.coach': 'Coach IA',

    // App Branding
    'app.name': 'znY Track',
    'app.subtitle': 'Enregistreur de Séances & Nutrition Sportive',

    // Auth & Profile
    'auth.signIn': 'Connexion',
    'auth.signUp': 'Créer un Compte',
    'auth.signOut': 'Déconnexion',
    'auth.profile': 'Profil Athlète',
    'auth.guest': 'Athlète Invité',
    'auth.streak': 'Jours Consécutifs',
    'auth.level': 'Niveau Physique',
    'auth.memberSince': 'Membre Depuis',
    'auth.quickAthletes': 'Athlètes Démo Rapides',
    'auth.syncNotice': 'Synchronisez Séances, Macros et Chat',

    // Language
    'lang.select': 'Choisir la Langue',
    'lang.current': 'Langue',

    // Workout Logger
    'workout.startSet': 'Enregistrer Série',
    'workout.finishSet': 'Terminer la Série',
    'workout.restTimer': 'Repos',
    'workout.reps': 'Reps',
    'workout.rom': 'Amplitude de Mouvement',
    'workout.formScore': 'Score Postural',
    'workout.goodDepth': 'Profondeur Optimale Atteinte',
    'workout.keepForm': 'Maintenez l’Alignement Articulaire',
    'workout.cvActive': 'Enregistreur Actif',
    'workout.cameraFeed': 'Enregistreur de Séries',

    // Plan & Training
    'plan.weeklySplit': 'Programme Hebdomadaire',
    'plan.aiAnalyze': 'Analyser avec l’IA',
    'plan.customize': 'Personnaliser le Jour',
    'plan.targetReps': 'Répétitions Cibles',

    // Dietary
    'dietary.calorieTarget': 'Objectif Calorique Quotidien',
    'dietary.burned': 'Calories Brûlées',
    'dietary.netBalance': 'Solde Net Restant',
    'dietary.protein': 'Protéines',
    'dietary.carbs': 'Glucides',
    'dietary.fats': 'Lipides',
    'dietary.water': 'Hydratation',
    'dietary.logMeal': 'Ajouter un Repas',
    'dietary.aiScan': 'Scanner avec l’IA',

    // Community Chat
    'chat.title': 'Salon des Athlètes znY Track',
    'chat.subtitle': 'Échangez avec d’autres sportifs et partagez vos séries',
    'chat.typePlaceholder': 'Écrivez un message (tapez @coach pour l’IA)...',
    'chat.send': 'Envoyer',
    'chat.onlineAthletes': 'En Direct à la Salle',
    'chat.channels': 'Salons',
    'chat.attachSet': 'Joindre une Série',
    'chat.latestSetAttached': 'Série Jointe',
    'chat.noMessages': 'Aucun message pour l’instant. Lancez la discussion !',
  },
  de: {
    // Navigation
    'nav.workout': 'Training',
    'nav.plan': 'Trainingsplan',
    'nav.dietary': 'Ernährung',
    'nav.progress': 'Fortschritt',
    'nav.chat': 'Community',
    'nav.coach': 'KI-Coach',

    // App Branding
    'app.name': 'znY Track',
    'app.subtitle': 'Workout-Logger & Sporternährung',

    // Auth & Profile
    'auth.signIn': 'Anmelden',
    'auth.signUp': 'Registrieren',
    'auth.signOut': 'Abmelden',
    'auth.profile': 'Athleten-Profil',
    'auth.guest': 'Gast-Athlet',
    'auth.streak': 'Tage-Streak',
    'auth.level': 'Fitness-Level',
    'auth.memberSince': 'Mitglied seit',
    'auth.quickAthletes': 'Schnell-Demo-Athleten',
    'auth.syncNotice': 'Workouts, Makros & Chat synchronisieren',

    // Language
    'lang.select': 'Sprache auswählen',
    'lang.current': 'Sprache',

    // Workout Logger
    'workout.startSet': 'Satz Aufzeichnen',
    'workout.finishSet': 'Satz Beenden',
    'workout.restTimer': 'Pause',
    'workout.reps': 'Wdh.',
    'workout.rom': 'Bewegungsradius (ROM)',
    'workout.formScore': 'Form-Bewertung',
    'workout.goodDepth': 'Optimale Tiefe erreicht',
    'workout.keepForm': 'Haltung stabil halten',
    'workout.cvActive': 'Workout-Logger Aktiv',
    'workout.cameraFeed': 'Satz-Logger',

    // Plan & Training
    'plan.weeklySplit': 'Wöchentlicher Split',
    'plan.aiAnalyze': 'Mit KI analysieren',
    'plan.customize': 'Tag anpassen',
    'plan.targetReps': 'Ziel-Wdh.',

    // Dietary
    'dietary.calorieTarget': 'Tages-Kalorienziel',
    'dietary.burned': 'Verbrannte Kalorien',
    'dietary.netBalance': 'Netto verbleibend',
    'dietary.protein': 'Protein',
    'dietary.carbs': 'Kohlenhydrate',
    'dietary.fats': 'Fette',
    'dietary.water': 'Wasserzufuhr',
    'dietary.logMeal': 'Mahlzeit erfassen',
    'dietary.aiScan': 'Mit KI scannen',

    // Community Chat
    'chat.title': 'znY Track Lifters Lounge',
    'chat.subtitle': 'Chatte mit Athleten & teile deine Sätze',
    'chat.typePlaceholder': 'Nachricht schreiben (@coach für KI)...',
    'chat.send': 'Senden',
    'chat.onlineAthletes': 'Gerade im Gym aktiv',
    'chat.channels': 'Kanäle',
    'chat.attachSet': 'Satz anhängen',
    'chat.latestSetAttached': 'Angehängter Satz',
    'chat.noMessages': 'Noch keine Nachrichten in diesem Kanal.',
  },
  ja: {
    // Navigation
    'nav.workout': 'ワークアウト',
    'nav.plan': 'プラン',
    'nav.dietary': '食事管理',
    'nav.progress': '進捗状況',
    'nav.chat': 'コミュニティ',
    'nav.coach': 'AIコーチ',

    // App Branding
    'app.name': 'znY Track',
    'app.subtitle': 'ワークアウト記録＆スポーツ栄養学',

    // Auth & Profile
    'auth.signIn': 'ログイン',
    'auth.signUp': '新規登録',
    'auth.signOut': 'ログアウト',
    'auth.profile': 'アスリート情報',
    'auth.guest': 'ゲスト選手',
    'auth.streak': '連続記録',
    'auth.level': 'フィットネスレベル',
    'auth.memberSince': '登録年月',
    'auth.quickAthletes': 'デモ選手で簡単ログイン',
    'auth.syncNotice': '記録・PFCマクロ・チャットを同期',

    // Language
    'lang.select': '言語を選択',
    'lang.current': '言語',

    // Workout Logger
    'workout.startSet': 'セット記録開始',
    'workout.finishSet': 'セット完了',
    'workout.restTimer': 'インターバル',
    'workout.reps': '回数 (Reps)',
    'workout.rom': '可動域 (ROM)',
    'workout.formScore': 'フォーム正確度',
    'workout.goodDepth': '十分な深さに到達',
    'workout.keepForm': '体幹と関節軸をキープ',
    'workout.cvActive': 'ワークアウト記録中',
    'workout.cameraFeed': 'セットロガー',

    // Plan & Training
    'plan.weeklySplit': '週間スプリットルーティン',
    'plan.aiAnalyze': 'AIでメニューを分析',
    'plan.customize': '日別メニュー編集',
    'plan.targetReps': '目標回数',

    // Dietary
    'dietary.calorieTarget': '1日のカロリー目標',
    'dietary.burned': '消費カロリー',
    'dietary.netBalance': '残カロリー目安',
    'dietary.protein': 'タンパク質',
    'dietary.carbs': '炭水化物',
    'dietary.fats': '脂質',
    'dietary.water': '水分補給',
    'dietary.logMeal': '食事を記録',
    'dietary.aiScan': 'AI写真スキャン',

    // Community Chat
    'chat.title': 'znY Track リフターズ・ラウンジ',
    'chat.subtitle': '仲間とチャットし、トレーニングセットを共有しよう',
    'chat.typePlaceholder': 'メッセージを入力 (@coach でAIに質問)...',
    'chat.send': '送信',
    'chat.onlineAthletes': '現在ジムでトレーニング中',
    'chat.channels': 'チャンネル',
    'chat.attachSet': '直近セットを添付',
    'chat.latestSetAttached': '添付されたセット',
    'chat.noMessages': 'このチャンネルにはまだメッセージがありません。',
  },
  ar: {
    // Navigation
    'nav.workout': 'التمرين',
    'nav.plan': 'الجدول',
    'nav.dietary': 'التغذية',
    'nav.progress': 'التقدم',
    'nav.chat': 'المجتمع',
    'nav.coach': 'مدرب الذكاء الاصطناعي',

    // App Branding
    'app.name': 'znY Track',
    'app.subtitle': 'تسجيل التمارين والتغذية الرياضية',

    // Auth & Profile
    'auth.signIn': 'تسجيل الدخول',
    'auth.signUp': 'إنشاء حساب',
    'auth.signOut': 'تسجيل الخروج',
    'auth.profile': 'ملف الرياضي',
    'auth.guest': 'رياضي زائر',
    'auth.streak': 'سلسلة الأيام',
    'auth.level': 'مستوى اللياقة',
    'auth.memberSince': 'عضو منذ',
    'auth.quickAthletes': 'دخول سريع كرياضي تجريبي',
    'auth.syncNotice': 'مزامنة التمارين والمغذيات والمحادثة',

    // Language
    'lang.select': 'اختيار اللغة',
    'lang.current': 'اللغة',

    // Workout Logger
    'workout.startSet': 'تسجيل الجولة',
    'workout.finishSet': 'إنهاء الجولة',
    'workout.restTimer': 'مؤقت الراحة',
    'workout.reps': 'التكرارات',
    'workout.rom': 'المدى الحركي',
    'workout.formScore': 'درجة دقة الحركة',
    'workout.goodDepth': 'تم الوصول للعمق المثالي',
    'workout.keepForm': 'حافظ على استقامة العمود الفقري',
    'workout.cvActive': 'مسجل التمرين نشط',
    'workout.cameraFeed': 'سجل الجولات',

    // Plan & Training
    'plan.weeklySplit': 'الجدول التدريبي الأسبوعي',
    'plan.aiAnalyze': 'تحليل الجدول بالذكاء الاصطناعي',
    'plan.customize': 'تخصيص اليوم',
    'plan.targetReps': 'التكرارات المستهدفة',

    // Dietary
    'dietary.calorieTarget': 'الهدف اليومي للسعرات',
    'dietary.burned': 'السعرات المحروقة',
    'dietary.netBalance': 'الصافي المتبقي',
    'dietary.protein': 'بروتين',
    'dietary.carbs': 'كربوهيدرات',
    'dietary.fats': 'دهون',
    'dietary.water': 'شرب الماء',
    'dietary.logMeal': 'تسجيل وجبة',
    'dietary.aiScan': 'مسح الوجبة بالذكاء الاصطناعي',

    // Community Chat
    'chat.title': 'صالة رياضيي znY Track',
    'chat.subtitle': 'تحدث مع الرياضيين وشارك جولاتك التدريبية',
    'chat.typePlaceholder': 'اكتب رسالة (اكتب @coach لسؤال المدرب)...',
    'chat.send': 'إرسال',
    'chat.onlineAthletes': 'متدربون حالياً في الصالة',
    'chat.channels': 'القنوات',
    'chat.attachSet': 'إرفاق جولة',
    'chat.latestSetAttached': 'الجولة المرفقة',
    'chat.noMessages': 'لا توجد رسائل بعد في هذه القناة. ابدأ الحديث!',
  },
  hi: {
    // Navigation
    'nav.workout': 'व्यायाम (Workout)',
    'nav.plan': 'ट्रेनिंग प्लान',
    'nav.dietary': 'डाइट व पोषण',
    'nav.progress': 'प्रगति',
    'nav.chat': 'कम्युनिटी चैट',
    'nav.coach': 'AI कोच',

    // App Branding
    'app.name': 'znY Track',
    'app.subtitle': 'वर्कआउट लॉगर व पोषण कोच',

    // Auth & Profile
    'auth.signIn': 'लॉग इन करें',
    'auth.signUp': 'खाता बनाएं',
    'auth.signOut': 'लॉग आउट',
    'auth.profile': 'एथलीट प्रोफ़ाइल',
    'auth.guest': 'गेस्ट एथलीट',
    'auth.streak': 'दिनों की स्ट्रीक',
    'auth.level': 'फिटनेस स्तर',
    'auth.memberSince': 'सदस्य बने',
    'auth.quickAthletes': 'डेमो एथलीट लॉग इन',
    'auth.syncNotice': 'वर्कआउट, मैक्रोज़ और चैट सिंक करें',

    // Language
    'lang.select': 'भाषा चुनें',
    'lang.current': 'भाषा',

    // Workout Logger
    'workout.startSet': 'सेट दर्ज करें',
    'workout.finishSet': 'सेट पूरा करें',
    'workout.restTimer': 'आराम का समय',
    'workout.reps': 'रेप्स (Reps)',
    'workout.rom': 'गति सीमा (ROM)',
    'workout.formScore': 'फॉर्म स्कोर',
    'workout.goodDepth': 'उत्कृष्ट गहराई प्राप्त की',
    'workout.keepForm': 'सही मुद्रा बनाए रखें',
    'workout.cvActive': 'वर्कआउट ट्रैकर सक्रिय',
    'workout.cameraFeed': 'सेट लॉगर',

    // Plan & Training
    'plan.weeklySplit': 'साप्ताहिक वर्कआउट स्प्लिट',
    'plan.aiAnalyze': 'AI से प्लान की समीक्षा',
    'plan.customize': 'दिन कस्टमाइज़ करें',
    'plan.targetReps': 'लक्षित रेप्स',

    // Dietary
    'dietary.calorieTarget': 'दैनिक कैलोरी लक्ष्य',
    'dietary.burned': 'बर्न कैलोरी',
    'dietary.netBalance': 'शेष कैलोरी',
    'dietary.protein': 'प्रोटीन',
    'dietary.carbs': 'कार्ब्स',
    'dietary.fats': 'फैट्स',
    'dietary.water': 'पानी का सेवन',
    'dietary.logMeal': 'भोजन जोड़ें',
    'dietary.aiScan': 'AI से स्कैन करें',

    // Community Chat
    'chat.title': 'znY Track लिफ्टर्स लाउंज',
    'chat.subtitle': 'साथी एथलीट्स से बात करें और अपने सेट्स शेयर करें',
    'chat.typePlaceholder': 'संदेश लिखें (AI से पूछने के लिए @coach लिखें)...',
    'chat.send': 'भेजें',
    'chat.onlineAthletes': 'जिम में अभी ऑनलाइन',
    'chat.channels': 'चैनल्स',
    'chat.attachSet': 'सेट जोड़ें',
    'chat.latestSetAttached': 'संलग्न सेट',
    'chat.noMessages': 'इस चैनल में अभी कोई संदेश नहीं है।',
  },
  pt: {
    // Navigation
    'nav.workout': 'Treino',
    'nav.plan': 'Plano',
    'nav.dietary': 'Dieta',
    'nav.progress': 'Evolução',
    'nav.chat': 'Comunidade',
    'nav.coach': 'Treinador IA',

    // App Branding
    'app.name': 'znY Track',
    'app.subtitle': 'Registro Tátil de Treinos e Nutrição',

    // Auth & Profile
    'auth.signIn': 'Entrar',
    'auth.signUp': 'Criar Conta',
    'auth.signOut': 'Sair',
    'auth.profile': 'Perfil do Atleta',
    'auth.guest': 'Atleta Convidado',
    'auth.streak': 'Dias Seguidos',
    'auth.level': 'Nível de Treino',
    'auth.memberSince': 'Membro Desde',
    'auth.quickAthletes': 'Atletas Demo Rápidos',
    'auth.syncNotice': 'Sincronize Treinos, Macros e Chat',

    // Language
    'lang.select': 'Selecionar Idioma',
    'lang.current': 'Idioma',

    // Workout Logger
    'workout.startSet': 'Registrar Série',
    'workout.finishSet': 'Concluir Série',
    'workout.restTimer': 'Descanso',
    'workout.reps': 'Reps',
    'workout.rom': 'Amplitude de Movimento',
    'workout.formScore': 'Pontuação de Postura',
    'workout.goodDepth': 'Profundidade Ótima Atingida',
    'workout.keepForm': 'Mantenha o Alinhamento da Coluna',
    'workout.cvActive': 'Registro de Treino Ativo',
    'workout.cameraFeed': 'Registro de Séries',

    // Plan & Training
    'plan.weeklySplit': 'Divisão Semanal',
    'plan.aiAnalyze': 'Analisar com IA',
    'plan.customize': 'Personalizar Dia',
    'plan.targetReps': 'Repetições Alvo',

    // Dietary
    'dietary.calorieTarget': 'Meta Diária de Calorias',
    'dietary.burned': 'Calorias Queimadas',
    'dietary.netBalance': 'Saldo Restante',
    'dietary.protein': 'Proteína',
    'dietary.carbs': 'Carboidratos',
    'dietary.fats': 'Gorduras',
    'dietary.water': 'Hidratação',
    'dietary.logMeal': 'Registrar Refeição',
    'dietary.aiScan': 'Escanear com IA',

    // Community Chat
    'chat.title': 'Lounge dos Atletas znY Track',
    'chat.subtitle': 'Converse com outros atletas e compartilhe séries',
    'chat.typePlaceholder': 'Digite uma mensagem (@coach para falar com a IA)...',
    'chat.send': 'Enviar',
    'chat.onlineAthletes': 'Atletas Online na Academia',
    'chat.channels': 'Canais',
    'chat.attachSet': 'Anexar Série',
    'chat.latestSetAttached': 'Série Anexada',
    'chat.noMessages': 'Nenhuma mensagem ainda neste canal.',
  },
  zh: {
    // Navigation
    'nav.workout': '训练',
    'nav.plan': '计划',
    'nav.dietary': '饮食',
    'nav.progress': '进度',
    'nav.chat': '社区',
    'nav.coach': 'AI教练',

    // App Branding
    'app.name': 'znY Track',
    'app.subtitle': '力量训练记录与运动营养',

    // Auth & Profile
    'auth.signIn': '登录',
    'auth.signUp': '创建账号',
    'auth.signOut': '退出登录',
    'auth.profile': '健美档案',
    'auth.guest': '访客训练者',
    'auth.streak': '连续天数',
    'auth.level': '训练水平',
    'auth.memberSince': '加入时间',
    'auth.quickAthletes': '一键体验演示运动员',
    'auth.syncNotice': '同步训练记录、营养宏量和社区聊天',

    // Language
    'lang.select': '选择语言',
    'lang.current': '语言',

    // Workout Logger
    'workout.startSet': '记录动作组',
    'workout.finishSet': '完成本组',
    'workout.restTimer': '组间休息',
    'workout.reps': '动作次数',
    'workout.rom': '动作幅度 (ROM)',
    'workout.formScore': '动作标准分',
    'workout.goodDepth': '达到标准动作深度',
    'workout.keepForm': '保持脊柱中立与核心稳定',
    'workout.cvActive': '训练记录中',
    'workout.cameraFeed': '动作组记录器',

    // Plan & Training
    'plan.weeklySplit': '周度训练分化',
    'plan.aiAnalyze': 'AI评估分化方案',
    'plan.customize': '自定义单日计划',
    'plan.targetReps': '目标次数',

    // Dietary
    'dietary.calorieTarget': '每日摄入热量目标',
    'dietary.burned': '训练消耗热量',
    'dietary.netBalance': '剩余可用净额',
    'dietary.protein': '蛋白质',
    'dietary.carbs': '碳水化合物',
    'dietary.fats': '脂肪',
    'dietary.water': '水分补给',
    'dietary.logMeal': '记录餐食',
    'dietary.aiScan': 'AI拍照辨识',

    // Community Chat
    'chat.title': 'znY Track 健身者交流大厅',
    'chat.subtitle': '与其他运动员在线交流，分享训练记录组',
    'chat.typePlaceholder': '输入消息 (输入 @coach 向AI提问)...',
    'chat.send': '发送',
    'chat.onlineAthletes': '当前健身房在线',
    'chat.channels': '交流频道',
    'chat.attachSet': '附上动作组',
    'chat.latestSetAttached': '已附上最新动作组',
    'chat.noMessages': '该频道暂无消息，快来抢沙发吧！',
  },
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
  currentOption: LanguageOption;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key, fallback) => fallback || key,
  currentOption: SUPPORTED_LANGUAGES[0],
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('znjy_track_lang');
      if (saved && saved in translations) {
        return saved as LanguageCode;
      }
    } catch {
      // ignore
    }
    return 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('znjy_track_lang', lang);
    } catch {
      // ignore
    }
  };

  const currentOption =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  const t = (key: string, fallback?: string): string => {
    const dict = translations[language] || translations.en;
    if (dict[key]) return dict[key];
    if (translations.en[key]) return translations.en[key];
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, currentOption }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => useContext(LanguageContext);
