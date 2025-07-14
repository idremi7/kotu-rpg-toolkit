export default {
  header: {
    gmDashboard: 'GM Dashboard',
    playerDashboard: 'Player Dashboard',
    login: 'Login',
    signUp: 'Sign Up',
    toggleLanguage: 'Toggle language',
  },
  home: {
    title: 'KOTU: RPG Toolkit',
    subtitle: 'Your digital companion for crafting and embarking on epic tabletop adventures. Create bespoke game systems as a Game Master, or bring your heroes to life as a Player.',
    gmCard: {
      button: 'Start as GM',
    },
    playerCard: {
      button: 'Start as Player',
    },
    howItWorks: {
      title: 'How It Works',
      gm: {
        title: '1. The GM Crafts a World',
        description: 'As a Game Master, you define the rules of your universe. Create custom attributes, skills, and feats to build a unique system for your campaign. Use AI to get suggestions and speed up your creative process.',
      },
      form: {
        title: '2. A Dynamic Form is Ready',
        description: 'The system provides a standardized character sheet form that adapts to the rules you created, ready for players to use.',
      },
      player: {
        title: '3. Players Create Their Heroes',
        description: 'Players can then use the generated form to create their characters, fill out their stats, and choose their abilities, ready to jump into the adventure.',
      },
    },
    finalCta: {
      title: "Ready to Start Your Adventure?",
      subtitle: "Create an account for free and begin building your worlds or your next great hero.",
      button: "Sign Up Now"
    }
  },
  login: {
    title: 'Welcome Back',
    description: 'Enter your credentials to access your dashboards.',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    button: 'Login',
    signupPrompt: "Don't have an account?",
    signupLink: 'Sign up',
  },
  signup: {
    title: 'Create an Account',
    description: 'Join KOTU to start your next adventure.',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    roleLabel: 'I am a...',
    rolePlayer: 'Player',
    roleGM: 'Game Master',
    button: 'Sign Up',
    loginPrompt: 'Already have an account?',
    loginLink: 'Login',
  },
  gmDashboard: {
    title: 'GM Dashboard',
    newSystemButton: 'Create New System',
    description: 'Manage your game systems and campaigns.',
    manageButton: 'Manage System',
    noSystemsTitle: 'No Systems Found',
    noSystemsDescription: 'It looks like you haven\'t created any game systems yet.',
    createFirstSystemButton: 'Create Your First System',
  },
  playerDashboard: {
    title: 'Player Dashboard',
    newCharacterButton: 'Create New Character',
    description: 'Manage your heroes and embark on new adventures.',
    viewSheetButton: 'View Character Sheet',
    noCharactersTitle: 'No Characters Found',
    noCharactersDescription: "It looks like you haven't created any characters yet.",
    createFirstCharacterButton: 'Create Your First Character',
  },
  createSystem: {
    title: 'System Architect',
    description: 'Define the rules of your world. Add attributes, skills, and feats to create a unique game system.',
    suggestSkills: 'Suggest with AI',
    suggestOneSkill: 'Suggest 1 Skill',
    suggestTenSkills: 'Suggest 10 Skills',
    suggestTwentySkills: 'Suggest 20 Skills',
    skillsDescription: 'Define character abilities. You can add them manually or use AI to get suggestions based on your attributes.',
    skillsSuggestedTitle: 'Skills Suggested',
    skillsSuggestedDescription: 'AI has added a list of suggested skills.',
    suggestionFailedTitle: 'Suggestion Failed',
    suggestionFailedDescription: 'Could not get suggestions from AI.',
  },
  systemDetails: {
    title: 'System Details',
    description: 'Configuration for the {systemName} system.',
    attributes: 'Attributes',
    saves: 'Saves',
    skills: 'Skills',
    feats: 'Feats',
  }
} as const;
