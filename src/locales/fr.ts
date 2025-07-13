export default {
  header: {
    gmDashboard: 'Tableau de bord MJ',
    playerDashboard: 'Tableau de bord Joueur',
    login: 'Connexion',
    signUp: 'Inscription',
    toggleLanguage: 'Changer de langue',
  },
  home: {
    title: 'KOTU: Boîte à outils JDR',
    subtitle: 'Votre compagnon numérique pour créer et vous lancer dans des aventures de jeu de rôle épiques. Créez des systèmes de jeu sur mesure en tant que Maître de Jeu, ou donnez vie à vos héros en tant que Joueur.',
    gmCard: {
      title: 'Pour les Maîtres de Jeu',
      description: "L'Atelier de l'Architecte",
      body: 'Fondez des mondes uniques avec des règles personnalisées. Définissez les attributs, compétences, dons et sauvegardes pour construire l\'épine dorsale de votre prochaine campagne. Nos outils alimentés par l\'IA vous aident à générer dynamiquement des fiches de personnage et des formulaires.',
      button: 'Aller au tableau de bord MJ',
    },
    playerCard: {
      title: 'Pour les Joueurs',
      description: 'La Forge du Héros',
      body: 'Entrez dans un monde d\'aventure. Créez des personnages détaillés en utilisant le système personnalisé de votre MJ. Allouez des points, choisissez votre voie et regardez votre fiche de personnage se mettre à jour en temps réel. Votre légende commence ici.',
      button: 'Aller au tableau de bord Joueur',
    },
    features: {
      title: 'Fonctionnalités Clés',
      systemBuilder: {
        title: 'Constructeur de Système Personnalisé',
        description: 'Concevez des systèmes de JDR avec des attributs, compétences et dons uniques.',
      },
      formGeneration: {
        title: 'Génération Intelligente de Formulaires',
        description: 'Créez automatiquement des formulaires de création de personnage à partir de vos règles de système.',
      },
      liveSheets: {
        title: 'Fiches de Personnage en Direct',
        description: 'Des fiches de personnage interactives et en temps réel, faciles à consulter et à exporter.',
      },
    },
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
    createSystemPrompt: 'Créer un système',
  },
  playerDashboard: {
    title: 'Tableau de bord du joueur',
    newCharacterButton: 'Créer un nouveau personnage',
    description: 'Gérez vos héros et lancez-vous dans de nouvelles aventures.',
    viewSheetButton: 'Voir la fiche de personnage',
    createCharacterPrompt: 'Créer un personnage',
  }
} as const;
