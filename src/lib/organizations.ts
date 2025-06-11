// src/lib/organizations.ts

export interface OrganizationCategory {
  name: string;
  slug: string;
  wikipediaLink: string;
}

export const allOrganizationCategories: OrganizationCategory[] = [
  { 
    name: "Federacja Młodzieży Walczącej", 
    slug: "federacja-mlodziezy-walczacej",
    wikipediaLink: "https://pl.wikipedia.org/wiki/Federacja_M%C5%82odzie%C5%BCy_Walcz%C4%85cej" 
  },
  { 
    name: "Konfederacja Polski Niepodległej", 
    slug: "konfederacja-polski-niepodleglej",
    wikipediaLink: "https://pl.wikipedia.org/wiki/Konfederacja_Polski_Niepodleg%C5%82ej" 
  },
  { 
    name: "Niezależne Zrzeszenie Studentów", 
    slug: "niezalezne-zrzeszenie-studentow",
    wikipediaLink: "https://pl.wikipedia.org/wiki/Niezale%C5%BCne_Zrzeszenie_Student%C3%B3w" 
  },
  { 
    name: "Solidarność Walcząca", 
    slug: "solidarnosc-walczaca",
    wikipediaLink: "https://pl.wikipedia.org/wiki/Solidarno%C5%9B%C4%87_Walcz%C4%85ca" 
  }
];  