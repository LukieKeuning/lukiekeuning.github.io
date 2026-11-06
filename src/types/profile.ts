export type Language = "nl" | "en";
export interface Education {
  id: string;
  institution: string;
  degree: string;
  start: string;
  end: string;
  expectedEnd: string;
  ongoing: boolean;
  description: string;
  specializations: string[];
}
export interface Experience {
  id: string;
  company: string;
  role: string;
  type: string;
  start: string;
  end: string | null;
  location: string;
  workMode: string;
  description: string;
  skills: string[];
  propertyRelated: boolean;
}
export interface Project {
  id: string;
  title: string;
  description: string;
  year: string;
  category: string;
  cover: string;
  images: { src: string; alt: string }[];
  tools: string[];
  url: string;
}
export interface Profile {
  personal: {
    name: string;
    initials: string;
    title: string;
    location: string;
    introduction: string;
    availability: string;
  };
  about: { biography: string; motivation: string };
  education: Education[];
  qualifications: { id: string; name: string; date: string }[];
  experience: Experience[];
  skills: { id: string; name: string; items: string[] }[];
  projects: Project[];
  interests: string[];
  contact: { email: string; phone: string; linkedin: string };
  assets: {
    profileImage: string;
    profileImageAlt: string;
    cvFile: string;
  };
}
