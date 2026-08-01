import { type CreateTaskFormValues } from "../schemas/tasks.schema";
import { Member } from "./TaskBoard.types";

export interface TaskFormProps {
  defaultValues?: Partial<CreateTaskFormValues>;
  onSubmit: (data: CreateTaskFormValues) => void;
  isPending: boolean;
  onCancel: () => void;
  title: string;
  members?: Member[];
}
