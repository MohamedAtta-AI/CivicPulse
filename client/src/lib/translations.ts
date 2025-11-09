export const translations = {
  nl: {
    // Header
    dashboardTitle: "Rijswijk - CivicPulse",
    dashboardSubtitle: "Burgersentiment Analyse",
    myAccount: "Mijn Account",
    profile: "Profiel",
    settings: "Instellingen",
    logout: "Uitloggen",
    
    // Roles
    admin: "Beheerder",
    editor: "Redacteur",
    reader: "Lezer",
    
    // Navigation
    overview: "Overzicht",
    topics: "Onderwerpen",
    sources: "Bronnen",
    insights: "AI Inzichten",
    
    // Page Title
    pageTitle: "Overzicht",
    pageSubtitle: "Realtime inzichten in burger sentiment en online discussies",
    
    // Metrics
    totalMentions: "Totaal Vermeldingen",
    activeCitizens: "Actieve Burgers",
    positiveSentiment: "Positief Sentiment",
    engagementRate: "Engagement Rate",
    vsPreviousWeek: "vs vorige week",
    citizenSatisfaction: "Burgersatisfactie",
    emergingIssues: "Opkomende Kwesties",
    publicResponseImpact: "Impact Openbare Reactie",
    civicEngagement: "Burgerparticipatie",
    
    // Sentiment
    sentimentAnalysis: "Sentiment Analyse",
    sentimentDescription: "Dagelijkse sentiment trends over de afgelopen week",
    positive: "Positief",
    neutral: "Neutraal",
    negative: "Negatief",
    
    // Days
    monday: "Ma",
    tuesday: "Di",
    wednesday: "Wo",
    thursday: "Do",
    friday: "Vr",
    saturday: "Za",
    sunday: "Zo",
    
    // Topics
    topicsTitle: "Meest Besproken Onderwerpen",
    topicsDescription: "Gebaseerd op 12.847 vermeldingen deze week",
    
    // Sources
    sourcesTitle: "Bronnen Verdeling",
    sourcesDescription: "Distributie van vermeldingen per platform",
    
    // AI Insights
    aiInsightsTitle: "AI Inzichten & Advies",
    aiInsightsDescription: "Automatisch gegenereerde analyse en aanbevelingen",
    exportFullReport: "Volledig Rapport Exporteren",
    highPriority: "Hoge Prioriteit",
    mediumPriority: "Gemiddelde Prioriteit",
    recommendation: "Aanbeveling",
    
    // AI Insight Topics
    trafficIssue: "Verkeersproblematiek",
    trafficDescription: "Groeiende zorgen over verkeersdrukte in het centrum. 245 vermeldingen met overwegend negatief sentiment.",
    trafficAdvice: "Overweeg communicatie over lopende verkeersprojecten en organiseer een focusgroep met lokale ondernemers.",
    
    positiveDevelopment: "Positieve Ontwikkeling",
    positiveDescription: "Enthousiasme over nieuwe groenvoorzieningen groeit. 189 vermeldingen met positief sentiment.",
    positiveAdvice: "Versterk deze positieve trend door vooruitgang te delen op social media en bewoners uit te nodigen voor opening.",
    
    youthEngagement: "Betrokkenheid Jongeren",
    youthDescription: "Toenemende interesse van jongeren in lokale evenementen en jeugdvoorzieningen.",
    youthAdvice: "Creëer specifieke communicatiekanalen voor jongeren en betrek hen bij toekomstige plannen.",
    
    // Recent Mentions
    recentMentions: "Recente Vermeldingen",
    recentMentionsDescription: "Live feed van burger interacties",
  },
  en: {
    // Header
    dashboardTitle: "Rijswijk - CivicPulse",
    dashboardSubtitle: "Citizen Sentiment Analysis",
    myAccount: "My Account",
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",
    
    // Roles
    admin: "Administrator",
    editor: "Editor",
    reader: "Reader",
    
    // Navigation
    overview: "Overview",
    topics: "Topics",
    sources: "Sources",
    insights: "AI Insights",
    
    // Page Title
    pageTitle: "Overview",
    pageSubtitle: "Real-time insights into citizen sentiment and online discussions",
    
    // Metrics
    totalMentions: "Total Mentions",
    activeCitizens: "Active Citizens",
    positiveSentiment: "Positive Sentiment",
    engagementRate: "Engagement Rate",
    vsPreviousWeek: "vs previous week",
    citizenSatisfaction: "Citizen Satisfaction",
    emergingIssues: "Emerging Issues",
    publicResponseImpact: "Public Response Impact",
    civicEngagement: "Civic Engagement",
    
    // Sentiment
    sentimentAnalysis: "Sentiment Analysis",
    sentimentDescription: "Daily sentiment trends over the past week",
    positive: "Positive",
    neutral: "Neutral",
    negative: "Negative",
    
    // Days
    monday: "Mon",
    tuesday: "Tue",
    wednesday: "Wed",
    thursday: "Thu",
    friday: "Fri",
    saturday: "Sat",
    sunday: "Sun",
    
    // Topics
    topicsTitle: "Most Discussed Topics",
    topicsDescription: "Based on 12,847 mentions this week",
    
    // Sources
    sourcesTitle: "Source Distribution",
    sourcesDescription: "Distribution of mentions per platform",
    
    // AI Insights
    aiInsightsTitle: "AI Insights & Recommendations",
    aiInsightsDescription: "Automatically generated analysis and recommendations",
    exportFullReport: "Export Full Report",
    highPriority: "High Priority",
    mediumPriority: "Medium Priority",
    recommendation: "Recommendation",
    
    // AI Insight Topics
    trafficIssue: "Traffic Issues",
    trafficDescription: "Growing concerns about traffic congestion in the city center. 245 mentions with predominantly negative sentiment.",
    trafficAdvice: "Consider communication about ongoing traffic projects and organize a focus group with local businesses.",
    
    positiveDevelopment: "Positive Development",
    positiveDescription: "Enthusiasm about new green spaces is growing. 189 mentions with positive sentiment.",
    positiveAdvice: "Strengthen this positive trend by sharing progress on social media and inviting residents to the opening.",
    
    youthEngagement: "Youth Engagement",
    youthDescription: "Increasing interest from young people in local events and youth facilities.",
    youthAdvice: "Create specific communication channels for youth and involve them in future plans.",
    
    // Recent Mentions
    recentMentions: "Recent Mentions",
    recentMentionsDescription: "Live feed of citizen interactions",
  },
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.nl;
