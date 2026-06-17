export type PptSlide = {
  page: number;
  title: string;
  coreContent: string[];
  visualSuggestion: string;
  speakerNotes: string;
};

export type PptOutline = {
  projectName: string;
  teamName: string;
  year: string;
  slideCount: number;
  slides: PptSlide[];
};
