const fs = require('fs');
const path = require('path');

const locales = ['en', 'fr', 'ar'];

const translations = {
  en: {
    navAdminLocations: "Our Agencies",
    adminLocations: {
      badge: "Admin — Agencies",
      title1: "Our",
      title2: "Agencies",
      subtitle: "Manage your physical access points across Dubai. Configure pickup and return locations for real-time customer deployment.",
      activeHubs: "Active Agencies",
      registerTitle: "Register New Agency",
      pointNameLabel: "Agency Name",
      pointNamePlaceholder: "Dubai Agency Center (Main)",
      addressLabel: "Physical Address",
      addressPlaceholder: "Sector 01, Cannes France Tower, UAE",
      submitBtn: "Add Agency",
      emptyList: "No agencies detected in current sectors.",
      footerNote1: "Multi-Agency Architecture Active",
      footerNote2: "Integrated Physical Nodes"
    }
  },
  fr: {
    navAdminLocations: "Nos Agences",
    adminLocations: {
      badge: "Admin — Agences",
      title1: "Nos",
      title2: "Agences",
      subtitle: "Gérez vos points d'accès physiques à travers Dubaï. Configurez les lieux de prise en charge et de retour.",
      activeHubs: "Agences Actives",
      registerTitle: "Enregistrer une Nouvelle Agence",
      pointNameLabel: "Nom de l'Agence",
      pointNamePlaceholder: "Centre Agence Dubaï (Principal)",
      addressLabel: "Adresse Physique",
      addressPlaceholder: "Secteur 01, Cannes France Tower, UAE",
      submitBtn: "Ajouter l'Agence",
      emptyList: "Aucune agence détectée dans vos secteurs.",
      footerNote1: "Architecture Multi-Agences Active",
      footerNote2: "Nœuds Physiques Intégrés"
    }
  },
  ar: {
    navAdminLocations: "وكالاتنا",
    adminLocations: {
      badge: "المشرف — الوكالات",
      title1: "إدارة",
      title2: "الوكالات",
      subtitle: "إدارة نقاط الوصول الفعلية الخاصة بك عبر دبي. تكوين مواقع الاستلام والإرجاع.",
      activeHubs: "الوكالات النشطة",
      registerTitle: "تسجيل وكالة جديدة",
      pointNameLabel: "اسم الوكالة",
      pointNamePlaceholder: "مركز وكالة دبي (الرئيسي)",
      addressLabel: "العنوان الفعلي",
      addressPlaceholder: "القطاع 01، برج سماء دبي، الإمارات",
      submitBtn: "إضافة وكالة",
      emptyList: "لم يتم اكتشاف أي وكالات في القطاعات الحالية.",
      footerNote1: "معمارية متعددة الوكالات نشطة",
      footerNote2: "عقد فعلية متكاملة"
    }
  }
};

for (const loc of locales) {
  const filePath = path.join('d:', 'travail', 'rent_car', 'src', 'messages', `${loc}.json`);
  const rawData = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(rawData);

  // Update navAdminLocations
  if (data.Navigation) {
    data.Navigation.adminLocations = translations[loc].navAdminLocations;
  }

  // Add AdminLocations object
  data.AdminLocations = translations[loc].adminLocations;

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`Updated ${loc}.json`);
}
