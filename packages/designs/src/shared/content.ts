// Coming-soon copy, as written in Figma (file xWvpSkQe0eZdZ27A78wtKc).
// Shared by every design; designs may differ where Figma differs (noted inline).

export interface CategoryCopy {
  key: string;
  title: string;
  examples: string;
}

export const interestCategories: CategoryCopy[] = [
  { key: "physical", title: "Physical & Athletic Development", examples: "Swimming, Gymnastics, Martial Arts, Team Sports" },
  { key: "creative", title: "Creative & Expressive Arts", examples: "Music, Dance, Drama & Theatre, Drawing" },
  { key: "cognitive", title: "Cognitive & Academic Enrichment", examples: "Tutoring, Languages, Chess & Board Games" },
  // Design "clean" appends " (STEM)" to this title.
  { key: "stem", title: "Science, Technology, Engineering & Math", examples: "Coding, Robotics, Game Design, Building" },
  { key: "life-skills", title: "Life Skills & Practical Development", examples: "Cooking & Baking, Gardening, Financial Literacy" },
  { key: "social-emotional", title: "Social & Emotional Development", examples: "Emotional Regulation, Communication, Teamwork" },
  { key: "spiritual", title: "Spiritual & Soulical Development", examples: "Volunteering, Mindfulness, Values & Ethics" },
  { key: "socio-cultural", title: "Socio-Cultural Development", examples: "Community Engagement, Cultural Awareness, Global Citizenship" },
];

export const specialNeedsCategories: Record<"physical" | "sensory" | "cognitive" | "seb", CategoryCopy> = {
  physical: {
    key: "physical",
    title: "Physical Needs",
    examples: "Cerebral palsy, muscular dystrophy, spina bifida, epilepsy, chronic asthma, juvenile arthritis",
  },
  sensory: {
    key: "sensory",
    title: "Sensory Needs",
    examples: "Visual impairment or blindness, hearing impairment or deafness, deaf-blindness, sensory processing disorders",
  },
  cognitive: {
    key: "cognitive",
    title: "Cognitive & Learning Needs",
    examples: "Dyslexia, dyscalculia, dysgraphia, Down syndrome and other intellectual disabilities",
  },
  seb: {
    key: "seb",
    title: "Social, Emotional & Behavioural Needs",
    examples: "Autism spectrum disorder (ASD), ADHD, anxiety disorders, depression, oppositional defiant disorder (ODD)",
  },
};

// Hero supporting copy, the same in every design.
export const heroLead =
  "Explore how children grow and learn. Choose an area to find programmes, providers, and available dates for your family.";

// "contact" links get their address at render time (ComingSoonProps.contactEmail).
// The rest are plain text until their pages exist.
export interface FooterLink {
  label: string;
  to?: "contact";
}

export const footerColumns: { heading: string; links: FooterLink[] }[] = [
  { heading: "TRUST", links: [{ label: "Privacy" }, { label: "Safeguarding" }, { label: "Disclaimer" }] },
  {
    heading: "PROVIDERS",
    links: [{ label: "List your programme" }, { label: "How it works" }, { label: "Contact us", to: "contact" }],
  },
];

export const footerTagline = ["Helping parents in Nigeria find", "the right opportunities for their children."];

export function copyright(now = new Date()): string {
  return `© ${now.getUTCFullYear()} Learn Space Limited. Bloom is a Learnspace product.`;
}
