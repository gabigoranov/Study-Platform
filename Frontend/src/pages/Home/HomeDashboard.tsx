import { useState } from "react";
import { useTranslation } from "react-i18next";
import { keys } from "@/types/keys";
import { useAuth } from "@/hooks/useAuth";
import HomeDashboardHeader from "@/components/Home/HomeDashboardHeader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useVariableContext } from "@/context/VariableContext";
import { Subject } from "@/data/Subject";
import { SubjectDTO } from "@/data/DTOs/SubjectDTO";
import { apiService } from "@/services/apiService";
import SubjectForm from "@/components/Home/SubjectForm";

type View = "list" | "create" | "edit" | "view";
export const subjectService = apiService<Subject, SubjectDTO, SubjectDTO>("subjects");

export default function HomeDashboard() {
    const { t } = useTranslation();
    const [view, setView] = useState<View>("list");
    const [editingId, setEditingId] = useState<string | null>(null);
    const { token } = useAuth();
    const queryClient = useQueryClient();
    const { selectedSubjectId, setSelectedSubjectId } = useVariableContext();

    // Query: load all subjects
    const { data: subjects, isLoading, error } = useQuery({
        queryKey: ["subjects"],
        queryFn: () => subjectService.getAll(token!),
        staleTime: 1000 * 60 * 5,
    });

    // Mutation: create
    const createMutation = useMutation({
        mutationFn: (dto: SubjectDTO) => subjectService.create(dto, token!),
        onSuccess: (newSubject) => {
            queryClient.setQueryData<Subject[]>(["subjects"], (old) =>
                old ? [...old, newSubject] : [newSubject]
            );
            setView("list");
        },
    });

    // Mutation: update
    const updateMutation = useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: SubjectDTO }) =>
            subjectService.update(id, dto, token!),
        onSuccess: (updated) => {
            queryClient.setQueryData<Subject[]>(["subjects"], (old) =>
                old ? old.map((s) => (s.id === updated.id ? updated : s)) : []
            );
            setEditingId(null);
            setView("list");
        },
    });

    // Mutation: delete
    const deleteMutation = useMutation({
        mutationFn: (id: string) => subjectService.delete(token!, {
            ids: id
        }),
        onSuccess: (_, id) => {
            queryClient.setQueryData<Subject[]>(["subjects"], (old) =>
                old ? old.filter((s) => s.id !== id) : []
            );
        },
    });

    // Handlers
    const handleCreate = (data: SubjectDTO) => {
        createMutation.mutate(data);
    };

    const handleUpdate = (data: SubjectDTO) => {
        if (!selectedSubjectId) return;
        updateMutation.mutate({ id: selectedSubjectId, dto: data });
    };

    const handleDelete = (id: string) => {
        if (window.confirm(t(keys.confirmDeleteMessage))) {
            deleteMutation.mutate(id);
        }
    };

    const selectSubject = (id: string) => {
        setSelectedSubjectId(id);
    };

    const startEdit = (id: string) => {
        setEditingId(id);
        setView("edit");
    };

    const renderContent = () => {
        switch (view) {
            case "list":
                if (isLoading) return <p>Loading...</p>;
                if (error) return <p>Error loading subjects</p>;
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {subjects?.map((subject) => (
                            <div 
                                key={subject.id}
                                className="p-4 border rounded-lg hover:bg-accent cursor-pointer"
                                onClick={() => selectSubject(subject.id)}
                            >
                                <h3 className="font-bold">{subject.title}</h3>
                            </div>
                        ))}
                    </div>
                );

            case "create":
                return (
                    <div className="max-w-md mx-auto">
                        <h2 className="text-xl font-bold mb-4">{t(keys.createSubjectTitle)}</h2>
                        <SubjectForm
                            onSubmit={handleCreate}
                            submitLabel={t(keys.createSubjectButton)}
                        />
                    </div>
                );

            case "edit":
                const subjectToEdit = subjects?.find((s) => s.id === selectedSubjectId);
                if (!subjectToEdit) return <p className="text-center p-4">{t(keys.subjectNotFound)}</p>;
                return (
                    <div className="max-w-md mx-auto">
                        <h2 className="text-xl font-bold mb-4">{t(keys.editSubjectTitle)}</h2>
                        <SubjectForm
                            onSubmit={handleUpdate}
                            submitLabel={t(keys.updateSubjectButton)}
                            model={{
                                title: subjectToEdit.title,
                            }}
                        />
                    </div>
                );

            case "view":
                const subjectToView = subjects?.find((s) => s.id === selectedSubjectId);
                if (!subjectToView) return <p className="text-center p-4">{t(keys.subjectNotFound)}</p>;
                return (
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold mb-4">{subjectToView.title}</h2>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="w-full flex flex-col gap-4 h-full">
            <HomeDashboardHeader
                setView={setView}
                handleDelete={handleDelete}
                selectedId={selectedSubjectId}
            />
            <div className="flex items-center justify-center w-full h-full flex-1 relative">
                {renderContent()}
            </div>
        </div>
    );
}
