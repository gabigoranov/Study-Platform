import { useState } from "react";
import { useTranslation } from "react-i18next";
import { keys } from "@/types/keys";
import { useAuth } from "@/hooks/useAuth";
import HomeDashboardHeader from "@/components/Home/HomeDashboardHeader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useVariableContext } from "@/context/VariableContext";
import { Subject } from "@/data/Subject";
import { SubjectDTO } from "@/data/DTOs/SubjectDTO";
import { MaterialSubGroupDTO } from "@/data/DTOs/MaterialSubGroupDTO";
import { MaterialSubGroup } from "@/data/MaterialSubGroup";
import { apiService } from "@/services/apiService";
import SubjectForm from "@/components/Home/SubjectForm";
import MaterialSubGroupForm from "@/components/Home/MaterialSubGroupForm";
import { materialSubGroupsService } from "@/services/materialSubGroupsService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  BookOpen,
  Folder,
  GraduationCap,
  FileText,
  FileAudio,
  GitBranch,
} from "lucide-react";
import { queryClient } from "@/main";

type View =
  | "list"
  | "create"
  | "edit"
  | "view"
  | "createMaterialGroup"
  | "editMaterialGroup";
type SubjectView = "subjects" | "materialGroups";

export const subjectService = apiService<Subject, SubjectDTO, SubjectDTO>(
  "subjects"
);

export default function HomeDashboard() {
  const { t } = useTranslation();
  const [view, setView] = useState<View>("list");
  const [subjectView, setSubjectView] = useState<SubjectView>("subjects"); // Whether to show subjects or material groups
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingMaterialSubGroupId, setEditingMaterialSubGroupId] = useState<
    string | null
  >(null);
  const { token } = useAuth();
  const { selectedSubjectId, setSelectedSubjectId } = useVariableContext();

  // Query: load all subjects
  const {
    data: subjects,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["subjects", selectedSubjectId],
    queryFn: () =>
      subjectService.getAll(token!, null, { includeGroupsSummary: true }),
    staleTime: 1000 * 60 * 5,
  });

  // Query: load material sub groups for the selected subject
  const { data: materialSubGroups, isLoading: materialSubGroupsLoading } =
    useQuery({
      queryKey: ["materialSubGroups", selectedSubjectId],
      queryFn: () =>
        selectedSubjectId
          ? materialSubGroupsService.getAll(
              token!,
              `subject/${selectedSubjectId}`
            )
          : Promise.resolve([]),
      enabled: !!selectedSubjectId,
      staleTime: 1000 * 60 * 5,
    });

  // Mutation: create
  const createMutation = useMutation({
    mutationFn: (dto: SubjectDTO) => subjectService.create(dto, token!),
    onSuccess: (newSubject) => {
      queryClient.setQueryData<Subject[]>(
        ["subjects", selectedSubjectId],
        (old) => (old ? [...old, newSubject] : [newSubject])
      );
      setSelectedSubjectId(newSubject.id); // Select the newly created subject
      setView("list");
      setSubjectView("materialGroups"); // Switch to material groups view
    },
  });

  // Mutation: create material sub group
  const createMaterialSubGroupMutation = useMutation({
    mutationFn: (dto: MaterialSubGroupDTO) =>
      materialSubGroupsService.create(dto, token!),
    onSuccess: (newMaterialSubGroup) => {
      queryClient.invalidateQueries({
        queryKey: ["materialSubGroups", selectedSubjectId],
      });
      setView("list");
      queryClient.invalidateQueries({
        queryKey: ["subjects", selectedSubjectId],
      });
    },
  });

  // Mutation: update
  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: SubjectDTO }) =>
      subjectService.update(id, dto, token!),
    onSuccess: (updated) => {
      queryClient.setQueryData<Subject[]>(
        ["subjects", selectedSubjectId],
        (old) =>
          old ? old.map((s) => (s.id === updated.id ? updated : s)) : []
      );
      setEditingId(null);
      setView("list");
    },
  });

  // Mutation: delete
  const deleteMutation = useMutation({
    mutationFn: (id: string) => subjectService.deleteSingle(token!, id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<Subject[]>(
        ["subjects", selectedSubjectId],
        (old) => (old ? old.filter((s) => s.id !== id) : [])
      );
      // If the deleted subject was the selected one, reset selection
      if (selectedSubjectId === id) {
        setSelectedSubjectId(null);
      }
    },
  });

  // Mutation: update material sub group
  const updateMaterialSubGroupMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: MaterialSubGroupDTO }) =>
      materialSubGroupsService.update(id, dto, token!),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({
        queryKey: ["materialSubGroups", selectedSubjectId],
      });
      setView("list");
      setEditingMaterialSubGroupId(null);
    },
  });

  // Mutation: delete material sub group
  const deleteMaterialSubGroupMutation = useMutation({
    mutationFn: (id: string) =>
      materialSubGroupsService.delete(token!, { ids: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["materialSubGroups", selectedSubjectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["subjects", selectedSubjectId],
      });
    },
  });

  // Handlers
  const handleCreate = (data: SubjectDTO) => {
    createMutation.mutate(data);
  };

  const handleCreateMaterialSubGroup = (data: MaterialSubGroupDTO) => {
    createMaterialSubGroupMutation.mutate(data);
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

  const handleDeleteMaterialSubGroup = (id: string) => {
    if (window.confirm(t(keys.confirmDeleteMessage))) {
      deleteMaterialSubGroupMutation.mutate(id);
    }
  };

  const handleUpdateMaterialSubGroup = (data: MaterialSubGroupDTO) => {
    if (!editingMaterialSubGroupId) return;
    updateMaterialSubGroupMutation.mutate({
      id: editingMaterialSubGroupId,
      dto: data,
    });
  };

  const startEditMaterialSubGroup = (id: string) => {
    setEditingMaterialSubGroupId(id);
    setView("editMaterialGroup");
  };

  const selectSubject = (id: string) => {
    setSelectedSubjectId(id);
    setSubjectView("materialGroups"); // Show material groups for selected subject
    setView("list");
  };

  const startEdit = (id: string) => {
    setEditingId(id);
    setView("edit");
  };

  const renderContent = () => {
    switch (view) {
      case "list":
        if (isLoading) return <p>{t(keys.loadingText)}</p>;
        if (error) return <p>{t(keys.errorLoadingSubjects)}</p>;

        // Show getting started screen if there are no subjects
        if (subjects && subjects.length === 0) {
          return (
            <div className="w-full max-w-4xl ">
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-8 md:p-12 border border-border">
                <div className="text-center mb-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                    <GraduationCap className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    {t(keys.welcomeDashboard)}
                  </h2>
                  <p className="text-lg text-text-muted max-w-2xl mx-auto">
                    {t(keys.gettingStartedSubject)}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                  <Card className="bg-card border border-border hover:shadow-lg transition-shadow">
                    <CardHeader className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                        <BookOpen className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">
                        {t(keys.createSubjectTitle)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-text-muted mb-4 text-center">
                        {t(keys.subjectIsCategory)}
                      </p>
                      <Button
                        onClick={() => setView("create")}
                        className="w-full"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        {t(keys.createSubjectButton)}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border border-border hover:shadow-lg transition-shadow">
                    <CardHeader className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                        <GitBranch className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">
                        {t(keys.organizeMaterials)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-text-muted mb-4 text-center">
                        {t(keys.groupMaterials)}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-muted-foreground mr-2" />
                          <span className="text-sm">
                            {t(keys.lectureNotes)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <FileAudio className="h-4 w-4 text-muted-foreground mr-2" />
                          <span className="text-sm">
                            {t(keys.studyRecordings)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Folder className="h-4 w-4 text-muted-foreground mr-2" />
                          <span className="text-sm">{t(keys.assignments)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          );
        }

        // If a subject is selected, show material groups for that subject
        if (selectedSubjectId) {
          const currentSubject = subjects?.find(
            (s) => s.id === selectedSubjectId
          );
          if (!currentSubject) return <p>Subject not found</p>;

          return (
            <div className="w-full mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {currentSubject.title}
                  </h2>
                  <p className="text-text-muted">
                    {(materialSubGroups?.length || 0) + " " + t(keys.groups)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={subjectView === "subjects" ? "default" : "outline"}
                    onClick={() => setSubjectView("subjects")}
                    size="sm"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    {t(keys.subjectsText)}
                  </Button>
                  <Button
                    variant={
                      subjectView === "materialGroups" ? "default" : "outline"
                    }
                    onClick={() => setSubjectView("materialGroups")}
                    size="sm"
                  >
                    <Folder className="mr-2 h-4 w-4" />
                    {t(keys.groups)}
                  </Button>
                  <Button
                    onClick={() => setView("createMaterialGroup")}
                    size="sm"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {t(keys.addGroup)}
                  </Button>
                </div>
              </div>

              {subjectView === "materialGroups" && (
                <div className="space-y-6">
                  {materialSubGroupsLoading && (
                    <div className="text-center py-8">
                      <p>{t(keys.loadingMaterialSubGroups)}</p>
                    </div>
                  )}

                  {!materialSubGroupsLoading &&
                    materialSubGroups &&
                    materialSubGroups.length === 0 && (
                      <div className="text-center py-12">
                        <Folder className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                          {t(keys.noMaterialGroupsYet)}
                        </h3>
                        <p className="text-text-muted mb-4">
                          {t(keys.createFirstMaterialSubGroup)}
                        </p>
                        <Button onClick={() => setView("createMaterialGroup")}>
                          <Plus className="mr-2 h-4 w-4" />
                          {t(keys.createMaterialGroup)}
                        </Button>
                      </div>
                    )}

                  {!materialSubGroupsLoading &&
                    materialSubGroups &&
                    materialSubGroups.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {materialSubGroups.map((group) => (
                          <Card
                            key={group.id}
                            className="hover:shadow-md transition-shadow cursor-pointer border-border"
                          >
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">
                                  {group.title}
                                </CardTitle>
                              </div>
                            </CardHeader>
                            <CardContent className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startEditMaterialSubGroup(group.id);
                                }}
                              >
                                {t(keys.edit)}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteMaterialSubGroup(group.id);
                                }}
                              >
                                {t(keys.delete)}
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                </div>
              )}

              {subjectView === "subjects" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subjects?.map((subject) => (
                    <Card
                      key={subject.id}
                      className={`cursor-pointer border-2 ${selectedSubjectId === subject.id ? "border-primary" : "border-border"}`}
                      onClick={() => selectSubject(subject.id)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">
                            {subject.title}
                          </CardTitle>
                          <Badge variant="secondary" className="text-xs">
                            {(subject.materialSubGroupsLength || 0) +
                              " " +
                              t(keys.groups)}
                          </Badge>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                  <Card
                    className="border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 cursor-pointer flex items-center justify-center"
                    onClick={() => setView("create")}
                  >
                    <CardContent className="flex flex-col items-center justify-center py-10">
                      <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                      <h3 className="font-medium">{t(keys.addSubject)}</h3>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          );
        }

        // If no subject is selected, show all subjects
        return (
          <div className="w-full mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Your Subjects
              </h2>
              <Button onClick={() => setView("create")}>
                <Plus className="mr-2 h-4 w-4" />
                Create Subject
              </Button>
            </div>

            {subjects && subjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjects?.map((subject) => (
                  <Card
                    key={subject.id}
                    className="hover:shadow-md transition-shadow cursor-pointer border-border"
                    onClick={() => selectSubject(subject.id)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {subject.title}
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {(subject.materialSubGroups?.length || 0) +
                            t(keys.groups)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          selectSubject(subject.id);
                        }}
                      >
                        View Groups
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {t(keys.noSubjectsYet)}
                </h3>
                <p className="text-text-muted mb-4">
                  {t(keys.gettingStartedFirstSubject)}
                </p>
                <Button onClick={() => setView("create")}>
                  <Plus className="mr-2 h-4 w-4" />
                  {t(keys.createSubjectButton)}
                </Button>
              </div>
            )}
          </div>
        );

      case "create":
        return (
          <div className="max-w-md mx-auto w-full">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">
                {t(keys.createSubjectTitle)}
              </h2>
              <p className="text-text-muted">
                Create a new subject to organize your learning materials
              </p>
            </div>
            <Card>
              <CardContent className="pt-6">
                <SubjectForm
                  onSubmit={handleCreate}
                  submitLabel={t(keys.createSubjectButton)}
                />
              </CardContent>
            </Card>
          </div>
        );

      case "createMaterialGroup":
        return (
          <div className="max-w-md mx-auto w-full">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">
                {t(keys.createMaterialGroup)}
              </h2>
              <p className="text-text-muted">
                {t(keys.createFirstMaterialSubGroup)}
              </p>
            </div>
            <Card>
              <CardContent className="pt-6">
                <MaterialSubGroupForm
                  onSubmit={handleCreateMaterialSubGroup}
                  submitLabel={t(keys.createMaterialGroup)}
                  subjectId={selectedSubjectId!}
                />
              </CardContent>
            </Card>
          </div>
        );

      case "editMaterialGroup":
        if (!editingMaterialSubGroupId || !materialSubGroups) {
          return <p>Material sub group not found</p>;
        }

        const materialSubGroupToEdit = materialSubGroups.find(
          (m) => m.id === editingMaterialSubGroupId
        );
        if (!materialSubGroupToEdit) {
          return <p>Material sub group not found</p>;
        }

        return (
          <div className="max-w-md mx-auto w-full">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">
                {t(keys.editMaterialSubGroup)}
              </h2>
              <p className="text-text-muted">
                {t(keys.updateMaterialGroupDetails)}
              </p>
            </div>
            <Card>
              <CardContent className="pt-6">
                <MaterialSubGroupForm
                  onSubmit={handleUpdateMaterialSubGroup}
                  submitLabel={t(keys.updateMaterialGroup)}
                  model={materialSubGroupToEdit}
                  subjectId={materialSubGroupToEdit.subjectId}
                />
              </CardContent>
            </Card>
          </div>
        );

      case "edit":
        const subjectToEdit = subjects?.find((s) => s.id === selectedSubjectId);
        if (!subjectToEdit)
          return <p className="text-center p-4">{t(keys.subjectNotFound)}</p>;

        return (
          <div className="max-w-md mx-auto w-full">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">{t(keys.editSubjectTitle)}</h2>
              <p className="text-text-muted">Edit your subject details</p>
            </div>
            <Card>
              <CardContent className="pt-6">
                <SubjectForm
                  onSubmit={handleUpdate}
                  submitLabel={t(keys.updateSubjectButton)}
                  model={{
                    title: subjectToEdit.title,
                  }}
                />
              </CardContent>
            </Card>
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
        handleDelete={
          selectedSubjectId ? () => handleDelete(selectedSubjectId) : () => {}
        }
        selectedId={selectedSubjectId}
      />
      <div className="flex-1 overflow-auto p-4">{renderContent()}</div>
    </div>
  );
}
