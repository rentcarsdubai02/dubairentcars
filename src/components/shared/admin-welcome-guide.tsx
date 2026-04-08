'use client'

import { motion } from 'framer-motion'
import { useLocale } from 'next-intl'
import {
  BarChart3,
  Car,
  MapPin,
  Ticket,
  Users,
  Mail,
  PanelBottom,
  Info
} from 'lucide-react'

export function AdminWelcomeGuide() {
  const locale = useLocale()
  const isFr = locale === 'fr'

  const content = {
    title: isFr ? "Espace Administrateur" : "Administrator Space",
    subtitle: isFr 
      ? "Bienvenue dans votre interface de gestion. Cette page vous résume l'ensemble des outils mis à votre disposition dans la barre de navigation latérale pour piloter votre plateforme RentCar de manière optimale."
      : "Welcome to your management interface. This page summarizes all the tools available in your sidebar navigation to optimally drive your RentCar platform.",
    sections: [
      {
        title: isFr ? "Statistiques" : "Statistics",
        icon: BarChart3,
        description: isFr ? "Votre tableau de bord central." : "Your central dashboard.",
        details: isFr 
          ? "Surveillez les réservations récentes, le chiffre d'affaires, et analysez la croissance de l'agence. Visualisez d'un simple coup d'œil les paiements confirmés ou en attente."
          : "Monitor recent bookings, revenue, and analyze agency growth. Visualize confirmed or pending payments at a glance.",
        color: "text-blue-500",
        bg: "bg-blue-500/10"
      },
      {
        title: isFr ? "Gestion de Flotte" : "Fleet Management",
        icon: Car,
        description: isFr ? "Catalogue numérique des véhicules." : "Digital vehicle catalog.",
        details: isFr 
          ? "Ajoutez, modifiez ou retirez des véhicules de la plateforme. Gérez les statuts (actif, maintenance) pour contrôler ce qui est visible ou réservable par les clients sur le site."
          : "Add, edit, or remove vehicles from the platform. Manage statuses (active, maintenance) to control what is visible or bookable by clients on the site.",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10"
      },
      {
        title: isFr ? "Nos Agences" : "Locations",
        icon: MapPin,
        description: isFr ? "Gestion des points relais." : "Management of relay points.",
        details: isFr 
          ? "Définissez les adresses de retrait et de retour. Ces lieux apparaîtront automatiquement dans les menus déroulants de réservation pour les clients."
          : "Define pickup and drop-off addresses. These locations will automatically appear in the booking dropdowns for clients.",
        color: "text-amber-500",
        bg: "bg-amber-500/10"
      },
      {
        title: isFr ? "Promotions" : "Promotions",
        icon: Ticket,
        description: isFr ? "Codes promo et réductions." : "Promo codes and discounts.",
        details: isFr 
          ? "Créez des codes de réduction (ex: SUMMER-2026), définissez le pourcentage de rabais et la cible (Tous, Silver, Elite). Ces codes sont calculés automatiquement dans le panier."
          : "Create discount codes (e.g. SUMMER-2026), define the discount percentage and the target (All, Silver, Elite). These codes are automatically calculated in the cart.",
        color: "text-purple-500",
        bg: "bg-purple-500/10"
      },
      {
        title: isFr ? "Utilisateurs" : "Users",
        icon: Users,
        description: isFr ? "Annuaire des clients et staff." : "Directory of clients and staff.",
        details: isFr 
          ? "Consultez les profils inscrits. Gérez les rôles, analysez le statut des clients ou élevez des membres de votre équipe aux droits d'administration."
          : "Consult registered profiles. Manage roles, analyze client status, or promote team members to administrative rights.",
        color: "text-rose-500",
        bg: "bg-rose-500/10"
      },
      {
        title: isFr ? "Boîte de Contact" : "Contact Inbox",
        icon: Mail,
        description: isFr ? "Réception des requêtes clients." : "Reception of client requests.",
        details: isFr 
          ? "Lisez et gérez les messages envoyés depuis le formulaire de contact du site. L'interface centralise toutes les requêtes du service client."
          : "Read and manage messages sent from the site's contact form. The interface centralizes all customer service requests.",
        color: "text-cyan-500",
        bg: "bg-cyan-500/10"
      },
      {
        title: isFr ? "Pied de page (Footer)" : "Footer configuration",
        icon: PanelBottom,
        description: isFr ? "Design et liens du bas de page." : "Design and footer links.",
        details: isFr 
          ? "Modifiez l'apparence, les informations de contact, et les liens des réseaux sociaux affichés en bas du site public d'un simple clic."
          : "Modify the appearance, contact information, and social media links displayed at the bottom of the public site with a single click.",
        color: "text-zinc-500",
        bg: "bg-zinc-500/10"
      }
    ]
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
          <Info className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{content.title}</h2>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            {content.subtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {content.sections.map((section, idx) => {
          const Icon = section.icon
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-lg flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${section.bg}`}>
                    <Icon className={`w-6 h-6 ${section.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{section.title}</h3>
                    <p className="text-sm font-medium text-primary/80">{section.description}</p>
                  </div>
                </div>
                
                <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
                  {section.details}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
