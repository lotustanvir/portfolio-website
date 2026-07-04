import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import * as projectsService from "./projects.service";
import ProjectsToolbar from "./components/ProjectsToolbar";
import ProjectsTable from "./components/ProjectsTable";
import ProjectFormDialog from "./components/ProjectFormDialog";
import ProjectDeleteDialog from "./components/ProjectDeleteDialog";
import ProjectsSkeleton from "./components/ProjectsSkeleton";
import Pagination from "@/components/common/Pagination";
import type { Project, CreateProjectInput, ProjectStatus } from "@/types/project";

export default function ProjectsPage() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [formOpen, setFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  const queryParams: import("@/types/project").ProjectQueryParams = {
    page,
    limit: 10,
    ...(search ? { search } : {}),
    ...(statusFilter !== "all" ? { status: statusFilter as ProjectStatus } : {}),
    ...(categoryFilter !== "all" ? { category: categoryFilter } : {}),
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["projects", queryParams],
    queryFn: () => projectsService.getProjects(queryParams),
  });

  const createMutation = useMutation({
    mutationFn: (input: CreateProjectInput) => projectsService.createProject(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setFormOpen(false);
      toast.success("Project created successfully");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: CreateProjectInput }) =>
      projectsService.updateProject(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setFormOpen(false);
      setEditingProject(null);
      toast.success("Project updated successfully");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => projectsService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setDeleteTarget(null);
      toast.success("Project deleted successfully");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const handleCreate = useCallback(() => {
    setEditingProject(null);
    setFormOpen(true);
  }, []);

  const handleEdit = useCallback((project: Project) => {
    setEditingProject(project);
    setFormOpen(true);
  }, []);

  const handleFormSubmit = useCallback(
    async (data: CreateProjectInput) => {
      if (editingProject) {
        await updateMutation.mutateAsync({ id: editingProject.id, input: data });
      } else {
        await createMutation.mutateAsync(data);
      }
    },
    [editingProject, createMutation, updateMutation]
  );

  const handleDelete = useCallback(
    async () => {
      if (!deleteTarget) return;
      await deleteMutation.mutateAsync(deleteTarget.id);
    },
    [deleteTarget, deleteMutation]
  );

  const handleClearFilters = useCallback(() => {
    setSearch("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setPage(1);
  }, []);

  const hasFilters = search !== "" || statusFilter !== "all" || categoryFilter !== "all";

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-medium text-destructive">Failed to load projects</p>
        <p className="text-sm text-muted-foreground mt-1">
          {error instanceof Error ? error.message : "An unexpected error occurred"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your portfolio projects
        </p>
      </div>

      {isLoading ? (
        <ProjectsSkeleton />
      ) : (
        <>
          <ProjectsToolbar
            search={search}
            onSearchChange={(value) => { setSearch(value); setPage(1); }}
            statusFilter={statusFilter}
            onStatusFilterChange={(value) => { setStatusFilter(value); setPage(1); }}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={(value) => { setCategoryFilter(value); setPage(1); }}
            onCreateClick={handleCreate}
            hasFilters={hasFilters}
            onClearFilters={handleClearFilters}
          />

          <ProjectsTable
            projects={data?.projects ?? []}
            onEdit={handleEdit}
            onDelete={setDeleteTarget}
          />

          {data?.pagination && (
            <Pagination
              page={data.pagination.page}
              totalPages={data.pagination.totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      <ProjectFormDialog
        open={formOpen}
        onOpenChange={(open) => { setFormOpen(open); if (!open) setEditingProject(null); }}
        onSubmit={handleFormSubmit}
        project={editingProject}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <ProjectDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        onConfirm={handleDelete}
        projectTitle={deleteTarget?.title ?? ""}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
