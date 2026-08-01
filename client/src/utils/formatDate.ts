export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

export const formatDateTime = (date: string | Date | null | undefined): string => {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

export const isOverdue = (dueDate: string | Date | null | undefined): boolean => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
};
