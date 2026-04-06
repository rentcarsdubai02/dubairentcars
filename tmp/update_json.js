const fs = require('fs');
const path = require('path');

const locales = ['en', 'fr', 'ar'];

const translations = {
  en: {
    navAdminFooter: "Footer Management",
    adminFooter: {
      "badge": "Admin — Footer Manager",
      "title1": "Footer",
      "title2": "Manager",
      "subtitle": "Manage footer content displayed on the site.",
      "managerTitle": "Footer Manager",
      "managerSubtitle": "Manage footer content",
      "save": "Save",
      "saving": "Saving...",
      "saved": "Saved!",
      "tabLogo": "Logo",
      "tabDesc": "Description",
      "tabSocial": "Social Networks",
      "tabLinks": "Quick Links",
      "tabContact": "Contact",
      "logoHelp": "Upload your agency logo. It will be displayed at the top of the footer.",
      "logoLabel": "Agency Logo",
      "altText": "Alternative Text (alt)",
      "descLabel": "Site Description",
      "descPlaceholder": "Describe your agency in a few words...",
      "noLinks": "No quick links — click Add to start.",
      "addLink": "Add link",
      "formLabel": "Label (e.g., Home)",
      "formUrl": "URL (e.g., /services)",
      "contactAddress": "Physical Address",
      "contactMap": "Google Maps Link",
      "contactEmail": "Email",
      "contactPhone": "Phone",
      "uploadFile": "Upload a file",
      "maxSize": "PNG, JPG, WEBP — MAX 2MB",
      "removeLogo": "Remove logo",
      "note": "Only filled fields are displayed in the site footer."
    }
  },
  fr: {
    navAdminFooter: "Gestion de Footer",
    adminFooter: {
      "badge": "Admin — Gestion de Footer",
      "title1": "Gestion de",
      "title2": "Footer",
      "subtitle": "Personnalisez le contenu du pied de page affiché sur le site.",
      "managerTitle": "Gestion de Footer",
      "managerSubtitle": "Gérer le contenu du pied de page",
      "save": "Sauvegarder",
      "saving": "Enregistrement…",
      "saved": "Enregistré !",
      "tabLogo": "Logo",
      "tabDesc": "Description",
      "tabSocial": "Réseaux Sociaux",
      "tabLinks": "Liens Rapides",
      "tabContact": "Contact",
      "logoHelp": "Importez le logo de votre agence. Il sera affiché en haut du footer.",
      "logoLabel": "Logo de l'agence",
      "altText": "Texte Alternatif (alt)",
      "descLabel": "Description du site",
      "descPlaceholder": "Décrivez votre agence en quelques mots…",
      "noLinks": "Aucun lien rapide — cliquez sur Ajouter pour commencer.",
      "addLink": "Ajouter un lien",
      "formLabel": "Libellé (ex: Accueil)",
      "formUrl": "URL (ex: /services)",
      "contactAddress": "Adresse physique",
      "contactMap": "Lien Google Maps",
      "contactEmail": "Email",
      "contactPhone": "Téléphone",
      "uploadFile": "Importer un fichier",
      "maxSize": "PNG, JPG, WEBP — MAX 2MB",
      "removeLogo": "Supprimer le logo",
      "note": "Seuls les champs remplis s'affichent dans le footer du site."
    }
  },
  ar: {
    navAdminFooter: "إدارة التذييل",
    adminFooter: {
      "badge": "المشرف — إدارة التذييل",
      "title1": "إدارة",
      "title2": "التذييل",
      "subtitle": "تخصيص محتوى التذييل المعروض على الموقع.",
      "managerTitle": "إدارة التذييل",
      "managerSubtitle": "إدارة محتوى التذييل",
      "save": "حفظ",
      "saving": "جاري الحفظ...",
      "saved": "تم الحفظ!",
      "tabLogo": "الشعار",
      "tabDesc": "الوصف",
      "tabSocial": "الشبكات الاجتماعية",
      "tabLinks": "روابط سريعة",
      "tabContact": "اتصل بنا",
      "logoHelp": "قم بتحميل شعار وكالتك. سيتم عرضه في الجزء العلوي من التذييل.",
      "logoLabel": "شعار الوكالة",
      "altText": "نص بديل (alt)",
      "descLabel": "وصف الموقع",
      "descPlaceholder": "صف وكالتك في بضع كلمات...",
      "noLinks": "لا توجد روابط سريعة — انقر على إضافة للبدء.",
      "addLink": "إضافة رابط",
      "formLabel": "التسمية (مثال: الرئيسية)",
      "formUrl": "الرابط (مثال: /services)",
      "contactAddress": "العنوان الفعلي",
      "contactMap": "رابط خرائط جوجل",
      "contactEmail": "البريد الإلكتروني",
      "contactPhone": "الهاتف",
      "uploadFile": "تحميل ملف",
      "maxSize": "PNG, JPG, WEBP — MAX 2MB",
      "removeLogo": "إزالة الشعار",
      "note": "يتم عرض الحقول المعبأة فقط في تذييل الموقع."
    }
  }
};

for (const loc of locales) {
  const filePath = path.join('d:', 'travail', 'rent_car', 'src', 'messages', `${loc}.json`);
  const rawData = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(rawData);

  // Update navAdminFooter
  if (data.Navigation) {
    data.Navigation.adminFooter = translations[loc].navAdminFooter;
  }

  // Add AdminFooter object
  data.AdminFooter = translations[loc].adminFooter;

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`Updated ${loc}.json`);
}
