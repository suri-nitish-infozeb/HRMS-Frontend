export interface ResumeBoardFilterOption {
  id: string;
  label: string;
}

export interface ResumeBoardColumn {
  id: string;
  title: string;
}

export interface ResumeBoardResume {
  id: string;
  candidateName: string;
  initials: string;
  affiliation: string;
  date: string;
  columnId: string;
  actions: string[];
}

export interface ResumeBoardData {
  filters: {
    projects: ResumeBoardFilterOption[];
    suppliers: ResumeBoardFilterOption[];
  };
  columns: ResumeBoardColumn[];
  resumes: ResumeBoardResume[];
}
