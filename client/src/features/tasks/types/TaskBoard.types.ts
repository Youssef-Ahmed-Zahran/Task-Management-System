export interface Member {
  user: { id: string; name: string; email: string; role: string };
  joinedAt: string;
}

export interface TaskBoardProps {
  projectId: string;
  members: Member[];
}
