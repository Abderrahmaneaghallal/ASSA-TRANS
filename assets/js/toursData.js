/* ── Tours included / excluded data ── */
const toursData = {
  "cheval-palmeraie": {
    included: [
      "Transfert aller-retour depuis votre hôtel (Marrakech centre)",
      "Balade d'une heure avec guide professionnel",
      "Équipement complet (casque, selle)",
      "Pause thé à la menthe traditionnel",
      "Assurance responsabilité civile"
    ],
    excluded: [
      "Dépenses personnelles",
      "Pourboires pour le guide/chauffeur",
      "Transferts hors zone (avec supplément)"
    ]
  },
  "dromadaire-palmeraie": {
    included: [
      "Transport privé aller-retour",
      "Balade supervisée d'une heure",
      "Prêt du chèche et de la tenue traditionnelle",
      "Thé à la menthe offert",
      "Service de photos souvenir (avec votre téléphone)"
    ],
    excluded: [
      "Repas et boissons non mentionnés",
      "Pourboires"
    ]
  },
  "buggy-palmeraie": {
    included: [
      "Transfert depuis votre hébergement",
      "Buggy sécurisé (biplace ou monoplace)",
      "Guide professionnel et briefing de sécurité",
      "Casque, lunettes de protection et charlotte",
      "Thé chez l'habitant inclus",
      "Carburant et entretien"
    ],
    excluded: [
      "Dégât sur le véhicule par faute de pilotage",
      "Dépenses personnelles",
      "Pourboires"
    ]
  },
  "Sortie en Mer à agadir": {
    included: [
      "Navigation d'une demi-journée",
      "Déjeuner à bord",
      "Temps de baignade et détente",
      "Transferts aller-retour"
    ],
    excluded: [
      "Dépenses personnelles",
      "Pourboires"
    ]
  },
  "Hammam & massage à agadir": {
    included: [
      "Séance de Hammam traditionnel (1h)",
      "Gommage corporel authentique",
      "Massage relaxant à l'huile d'argane (1h)",
      "Serviettes et équipement de base"
    ],
    excluded: [
      "Soins esthétiques supplémentaires",
      "Dépenses personnelles",
      "Pourboires"
    ]
  },
  "agafay-desert": {
    included: [
      "Transfert privatisé en 4x4",
      "Accès au camp au cœur du désert",
      "Thé de bienvenue à la menthe",
      "Coucher de soleil panoramique",
      "Assurance transport"
    ],
    excluded: [
      "Activités Quad ou Buggy (en option)",
      "Balade en dromadaire",
      "Dîner spectacle (sauf si option pré-réservée)",
      "Boissons supplémentaires"
    ]
  },
  "ourika-atlas": {
    included: [
      "Chauffeur privé parlant français",
      "Véhicule climatisé tout confort",
      "Visite d'une coopérative d'huile d'Argan",
      "Arrêts photos panoramiques",
      "Assistance durant toute la journée"
    ],
    excluded: [
      "Déjeuner (environ 10–15€ pers)",
      "Guide local pour les cascades (environ 5€)",
      "Entrées optionnelles dans les jardins"
    ]
  },
  "ouzoud-cascades": {
    included: [
      "Transport privatisé climatisé",
      "Chauffeur professionnel francophone",
      "Assurance transport passager",
      "Qualité de service VIP",
      "Arrêts photos sur la route"
    ],
    excluded: [
      "Déjeuner et boissons",
      "Guide local sur place (+10€ environ)",
      "Balade en barque au pied des chutes",
      "Dépenses personnelles"
    ]
  },
  "oasiria": {
    included: [
      "Billet d'entrée coupe-file",
      "Accès à toutes les attractions et toboggans",
      "Accès aux jardins et transats",
      "Navette gratuite (selon horaires Oasiria)"
    ],
    excluded: [
      "Dépenses de restauration",
      "Location de serviettes",
      "Consignes payantes"
    ]
  },
  "wakeboard": {
    included: [
      "Accès au ponton du téléski",
      "Matériel de base (planche, gilet)",
      "Briefing technique pour débutants",
      "Accès aux vestiaires et douches",
      "Cadre exceptionnel au pied de l'Atlas"
    ],
    excluded: [
      "Transport (navette optionnelle)",
      "Matériel Pro (planches spécifiques)",
      "Location de combinaison",
      "Boissons au club house"
    ]
  },
  "poterie": {
    included: [
      "Cours avec un maître céramiste",
      "Toute la matière première (argile, outils)",
      "Équipement complet (tablier, etc.)",
      "Livraison de votre pièce à votre hôtel à Marrakech",
      "Pause thé ou café avec gâteaux marocains",
      "Photos et vidéos souvenir de votre séance"
    ],
    excluded: [
      "Expédition internationale des pièces",
      "Articles en vente dans la boutique"
    ]
  },
  "shooting-poterie": {
    included: [
      "Séance photo professionnelle avec photographe",
      "Accès exclusif à l'atelier traditionnel",
      "Accessoires et mise en scène",
      "Remise des photos retouchées (format numérique)",
      "Thé de bienvenue offert"
    ],
    excluded: [
      "Tenues spécifiques (venir avec les vôtres)",
      "Maquillage et coiffure",
      "Impressions physiques"
    ]
  },
  "bled-ouladi": {
    included: [
      "Accès à la ferme",
      "Visite guidée des jardins",
      "Rencontre avec les animaux",
      "Atelier pain traditionnel",
      "Thé de bienvenue"
    ],
    excluded: [
      "Déjeuner (optionnel)",
      "Activités poney",
      "Transport"
    ]
  },
  "oatlas-piscine": {
    included: [
      "Accès piscine",
      "Transat et serviette",
      "Accès aux jardins",
      "Animation DJ (week-end)"
    ],
    excluded: [
      "Déjeuner",
      "Consommations au bar",
      "Transport"
    ]
  },
  "hammam-spa": {
    included: [
      "Hammam traditionnel",
      "Gommage au savon noir",
      "Enveloppement au Ghassoul",
      "Massage relaxant 30 min",
      "Thé à la menthe"
    ],
    excluded: [
      "Produits de beauté en boutique",
      "Pourboires"
    ]
  },
  "montgolfiere": {
    included: [
      "Transfert A/R en 4x4 (hôtel centre-ville)",
      "Thé de bienvenue traditionnel",
      "Vol de 40 à 60 minutes selon météo",
      "Petit-déjeuner berbère sous tente caïdale",
      "Certificat de vol personnalisé"
    ],
    excluded: [
      "Vidéos du vol (en option)",
      "Photos souvenirs",
      "Pourboires pour l'équipe",
      "Supplément hors zone (Marrakech centre +10km)"
    ]
  },
  "parapente": {
    included: [
      "Transport vers le site",
      "Équipement de sécurité",
      "Vol en tandem 20 min",
      "Moniteur certifié",
      "Photos/Vidéos du vol"
    ],
    excluded: [
      "Boissons",
      "Pourboires"
    ]
  },
  "tyrolienne": {
    included: [
      "Accès au parcours",
      "Équipement complet",
      "Briefing sécurité",
      "Encadrement technique"
    ],
    excluded: [
      "Transport",
      "Déjeuner"
    ]
  },
  "dinner-sky": {
    included: [
      "Menu gastronomique",
      "Boissons soft",
      "Survol en table suspendue",
      "Service premium",
      "Assurance"
    ],
    excluded: [
      "Boissons alcoolisées",
      "Transport"
    ]
  },
  "quad-agafay": {
    included: [
      "Transfert aller-retour",
      "Location Quad",
      "Guide",
      "Équipement",
      "Thé au camp"
    ],
    excluded: [
      "Assurance casse",
      "Photos"
    ]
  },
  "quad-palmeraie": {
    included: [
      "Location Quad",
      "Guide",
      "Casque",
      "Thé chez l'habitant"
    ],
    excluded: [
      "Transport (optionnel)",
      "Photos"
    ]
  },
  "buggy-agafay": {
    included: [
      "Location Buggy",
      "Guide",
      "Briefing",
      "Équipement",
      "Thé"
    ],
    excluded: [
      "Transport",
      "Assurance dégâts"
    ]
  },
  "cheval-ecuries": {
    included: [
      "Balade accompagnée",
      "Harnachement complet",
      "Casque",
      "Thé"
    ],
    excluded: [
      "Transport",
      "Bottines de marche"
    ]
  },
  "dromadaire-agafay": {
    included: [
      "Balade guidée",
      "Vêtement traditionnel",
      "Pause thé au camp",
      "Assistance"
    ],
    excluded: [
      "Transport",
      "Dîner"
    ]
  },
  "jump-park": {
    included: [
      "Accès aux trampolines",
      "Chaussettes antidérapantes",
      "Espace lounge"
    ],
    excluded: [
      "Boissons",
      "Anniversaires groupés"
    ]
  },
  "atelier-peinture": {
    included: [
      "Matériel (toile, couleurs)",
      "Pinceaux",
      "Cours guidé",
      "Thé"
    ],
    excluded: [
      "Encadrement professionnel du tableau",
      "Expédition"
    ]
  },
  "atelier-broderie": {
    included: [
      "Panier en paille",
      "Fils de broderie",
      "Apprentissage technique",
      "Thé"
    ],
    excluded: [
      "Articles supplémentaires"
    ]
  },
  "atelier-parfum": {
    included: [
      "Flacon de 50ml",
      "Essences",
      "Cours olfactif",
      "Étiquette personnalisée"
    ],
    excluded: [
      "Recharges",
      "Coffret luxe"
    ]
  },
  "legzira-plage": {
    included: [
      "Le Transport",
      "Le Conducteur / Guide"
    ],
    excluded: [
      "Les Boissons",
      "Le Repas de Midi"
    ]
  },
  "tafraout-tiznit": {
    included: [
      "Le Transport",
      "Le Conducteur / Guide"
    ],
    excluded: [
      "Les Boissons",
      "Le Repas de Midi"
    ]
  },
  "agadir-ville-demi-jour": {
    included: [
      "Transport",
      "Conducteur / Guide"
    ],
    excluded: [
      "Entrée Médina d'Agadir",
      "Prise en Charge (A/R) Taghazout"
    ]
  },
  "taghazout-ocean-dunes": {
    included: [
      "Le Transport",
      "Le Conducteur / Guide"
    ],
    excluded: [
      "Les Boissons",
      "Le Repas de Midi",
      "Sandboarding"
    ]
  }
};
