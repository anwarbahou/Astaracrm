
import { Dispatch, SetStateAction } from "react";
import { ClientFormData } from "@/components/clients/AddClientForm";

export type ContactFormData = Omit<ClientFormData, "name" | "industry" | "stage" | "owner"> & {
  firstName: string;
  lastName: string;
  role: string;
  company: string;
  status: string;
};

export interface SectionProps {
  formData: ContactFormData;
  setFormData: Dispatch<SetStateAction<ContactFormData>>;
}

export { ProfileSection } from './ProfileSection';
export { BasicInfoSection } from './BasicInfoSection';
export { ProfessionalInfoSection } from './ProfessionalInfoSection';
export { LocationStatusSection } from './LocationStatusSection';
export { TagsSection } from './TagsSection';
export { NotesSection } from './NotesSection';
