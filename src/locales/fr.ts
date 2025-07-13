export default {
  header: {
    gmDashboard: 'Tableau de bord MJ',
    playerDashboard: 'Tableau de bord Joueur',
    login: 'Connexion',
    signUp: 'Inscription',
    toggleLanguage: 'Changer de langue',
  },
  home: {
    title: 'KOTU : Boîte à outils JDR',
    subtitle: 'Votre compagnon numérique pour créer et vous lancer dans des aventures de jeu de rôle épiques. Créez des systèmes de jeu sur mesure en tant que Maître de Jeu, ou donnez vie à vos héros en tant que Joueur.',
    gmCard: {
      button: 'Commencer comme MJ',
    },
    playerCard: {
      button: 'Commencer comme Joueur',
    },
    howItWorks: {
      title: 'Comment ça marche ?',
      gm: {
        title: '1. Le MJ Crée un Monde',
        description: 'En tant que Maître de Jeu, vous définissez les règles de votre univers. Créez des attributs, compétences et dons personnalisés pour construire un système unique pour votre campagne.',
      },
      form: {
        title: '2. Un Formulaire Dynamique est Prêt',
        description: "Le système fournit une fiche de personnage standardisée qui s'adapte aux règles que vous avez créées, prête à être utilisée par les joueurs.",
      },
      player: {
        title: '3. Les Joueurs Créent Leurs Héros',
        description: "Les joueurs peuvent ensuite utiliser le formulaire généré pour créer leurs personnages, remplir leurs statistiques et choisir leurs capacités, prêts à se lancer dans l'aventure.",
      },
    },
    finalCta: {
      title: "Prêt à commencer l'aventure ?",
      subtitle: "Créez un compte gratuitement et commencez à bâtir vos mondes ou votre prochain grand héros.",
      button: "Inscrivez-vous maintenant"
    }
  },
  login: {
    title: 'Content de vous revoir',
    description: 'Entrez vos identifiants pour accéder à vos tableaux de bord.',
    emailLabel: 'Email',
    passwordLabel: 'Mot de passe',
    button: 'Connexion',
    signupPrompt: "Vous n'avez pas de compte ?",
    signupLink: 'Inscrivez-vous',
  },
  signup: {
    title: 'Créer un compte',
    description: 'Rejoignez KOTU pour commencer votre prochaine aventure.',
    emailLabel: 'Email',
    passwordLabel: 'Mot de passe',
    roleLabel: 'Je suis un...',
    rolePlayer: 'Joueur',
    roleGM: 'Maître de Jeu',
    button: 'Inscription',
    loginPrompt: 'Vous avez déjà un compte ?',
    loginLink: 'Connectez-vous',
  },
  gmDashboard: {
    title: 'Tableau de bord MJ',
    newSystemButton: 'Créer un nouveau système',
    description: 'Gérez vos systèmes de jeu et vos campagnes.',
    manageButton: 'Gérer le système',
    noSystemsTitle: 'Aucun système trouvé',
    noSystemsDescription: 'Il semble que vous n\'ayez encore créé aucun système de jeu.',
    createFirstSystemButton: 'Créez votre premier système',
  },
  playerDashboard: {
    title: 'Tableau de bord du joueur',
    newCharacterButton: 'Créer un nouveau personnage',
    description: 'Gérez vos héros et lancez-vous dans de nouvelles aventures.',
    viewSheetButton: 'Voir la fiche de personnage',
    createCharacterPrompt: 'Créer un personnage',
  },
  createSystem: {
    title: 'Architecte de Système',
    description: 'Définissez les règles de votre monde. Ajoutez des attributs, des compétences et des dons pour créer un système de jeu unique.',
  },
  systemDetails: {
    title: 'Détails du Système',
    description: 'Configuration pour le système {systemName}.',
    attributes: 'Attributs',
    skills: 'Compétences',
    feats: 'Dons',
    schemas: 'Schémas Générés',
    formSchema: 'Schéma de Formulaire',
    uiSchema: 'Schéma d\'Interface',
  }
} as const;
