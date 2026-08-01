import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useProject, useAddMember, useRemoveMember } from "../api/projects.api";
import { useUsers } from "@/features/users/api/users.api";

export const useProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const { data: project, isLoading, isError } = useProject(id!);
  const { data: allUsers, isLoading: isLoadingUsers } = useUsers();
  const { mutate: addMember, isPending: isAdding } = useAddMember(id!);
  const { mutate: removeMember } = useRemoveMember(id!);

  const [addEmail, setAddEmail] = useState("");
  const [showAddMember, setShowAddMember] = useState(false);

  const isOwner = user?.id === project?.ownerId;

  const handleAddMember = (email?: string) => {
    const targetEmail = email || addEmail.trim();
    if (!targetEmail) return;
    addMember(targetEmail, {
      onSuccess: () => {
        setAddEmail("");
        setShowAddMember(false);
      },
    });
  };

  return {
    state: {
      id,
      addEmail,
      setAddEmail,
      showAddMember,
      setShowAddMember,
      isOwner,
    },
    query: {
      user,
      project,
      allUsers,
      isLoadingUsers,
      isLoading,
      isError,
    },
    actions: {
      handleAddMember,
      removeMember,
      isAdding,
    },
  };
};
