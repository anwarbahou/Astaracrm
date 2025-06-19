import { Dispatch, SetStateAction } from "react";

export type ContactFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  company: string;
  country: string;
  status: string;
  notes: string;
  tags: string[];
};

export interface SectionProps {
  formData: ContactFormData;
  setFormData: Dispatch<SetStateAction<ContactFormData>>;
}

export { BasicInfoSection } from './BasicInfoSection';
export { ProfessionalInfoSection } from './ProfessionalInfoSection';
export { LocationStatusSection } from './LocationStatusSection';
export { TagsSection } from './TagsSection';
export { NotesSection } from './NotesSection';
