import { CreateProjectFormValues } from "../schemas/projects.schema";

export interface ProjectFormProps {
  defaultValues?: CreateProjectFormValues;
  onSubmit: (data: CreateProjectFormValues) => void;
  isPending: boolean;
  onCancel: () => void;
  title: string;
}
