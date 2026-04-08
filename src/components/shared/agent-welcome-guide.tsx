'use client'

import { motion } from 'framer-motion'
import { useLocale } from 'next-intl'
import {
  Car,
  MapPin,
  Mail,
  ShieldCheck,
  CalendarCheck,
  Users,
  LayoutTemplate
} from 'lucide-react'

export function AgentWelcomeGuide() {
  const locale = useLocale()
  const isFr = locale === 'fr'

  const content = {
    title: isFr ? "Espace Agent" : "Agent Space",
    subtitle: isFr 
      ? "Bienvenue dans votre interface de gestion opérationnelle. Ce panneau regroupe tous les outils dont vous avez besoin pour traiter les réservations et gérer le parc automobile au quotidien."
      : "Welcome to your operational management interface. This panel groups all the tools you need to process bookings and manage the vehicle fleet on a daily basis.",
    sections: [
      {
        title: isFr ? "Gestion des Réservations" : "Booking Management",
        icon: CalendarCheck,
        description: isFr ? "Traitement des commandes clients." : "Processing client orders.",
        details: isFr 
          ? "Consultez les nouvelles demandes de réservation dans l'onglet Statistiques. Vous pouvez changer leur statut (Approuvé, Refusé, Terminé) et vérifier les paiements."
          : "Check new booking requests in the Statistics tab. You can change their status (Approved, Refused, Completed) and verify payments.",
        color: "text-blue-500",
        bg: "bg-blue-500/10"
      },
      {
        title: isFr ? "Gestion de Flotte" : "Fleet Management",
        icon: Car,
        description: isFr ? "Disponibilité des véhicules." : "Vehicle availability.",
        details: isFr 
          ? "Assurez-vous que les véhicules sont marqués avec le bon statut. Passez-les en 'Maintenance' ou 'Inactif' s'ils ne sont pas en état de rouler."
          : "Ensure vehicles are marked with the correct status. Change them to 'Maintenance' or 'Inactive' if they are not roadworthy.",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10"
      },
      {
        title: isFr ? "Nos Agences" : "Locations",
        icon: MapPin,
        description: isFr ? "Informations logistiques." : "Logistical information.",
        details: isFr 
          ? "Vérifiez les points de retrait et de retour prévus pour chaque client afin d'organiser les remises de clés (ex: Hub de l'Aéroport vs Agence Centre-ville)."
          : "Check the planned pickup and drop-off points for each client to organize key handovers (e.g. Airport Hub vs City Center Agency).",
        color: "text-amber-500",
        bg: "bg-amber-500/10"
      },
      {
        title: isFr ? "Boîte de Contact" : "Contact Inbox",
        icon: Mail,
        description: isFr ? "Support client." : "Customer support.",
        details: isFr 
          ? "Traitez les messages entrants du formulaire de contact public. Répondez rapidement aux questions des clients pour améliorer la conversion."
          : "Process incoming messages from the public contact form. Respond quickly to client questions to improve conversion.",
        color: "text-cyan-500",
        bg: "bg-cyan-500/10"
      },
      {
        title: isFr ? "Base de Données Clients" : "Clients Database",
        icon: Users,
        description: isFr ? "Modération et accès." : "Moderation and access.",
        details: isFr 
          ? "Bannissez les utilisateurs non conformes ou supprimez définitivement les comptes des clients problématiques."
          : "Ban non-compliant users or permanently delete the accounts of problematic clients.",
        color: "text-purple-500",
        bg: "bg-purple-500/10"
      },
      {
        title: isFr ? "Gestion du Footer" : "Footer Management",
        icon: LayoutTemplate,
        description: isFr ? "Réseaux sociaux et numéros." : "Social media and numbers.",
        details: isFr 
          ? "Gérez les informations publiques de pied de page telles que l'adresse, l'email officiel ou les numéros de téléphone de la plateforme."
          : "Manage public footer information such as the address, official email, or the platform's phone numbers.",
        color: "text-orange-500",
        bg: "bg-orange-500/10"
      }
    ]
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
          <ShieldCheck className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{content.title}</h2>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            {content.subtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
