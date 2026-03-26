import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  ExternalLink,
  Globe,
  Layers,
  LogOut,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { TemplateGallery } from "../components/TemplateGallery";
import { useNavigation } from "../contexts/NavigationContext";
import { TEMPLATES } from "../data/templates";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateProject,
  useDeleteProject,
  useGetMyProjects,
} from "../hooks/useQueries";

function formatDate(ts: bigint) {
  const ms = Number(ts) / 1_000_000;
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return "Recently";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function Dashboard() {
  const { navigate } = useNavigation();
  const { data: projects, isLoading } = useGetMyProjects();
  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();
  const { clear, identity } = useInternetIdentity();
  const { actor } = useActor();

  const [createOpen, setCreateOpen] = useState(false);
  const [createStep, setCreateStep] = useState<1 | 2>(1);
  const [newProjectName, setNewProjectName] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("blank");
  const [isCreating, setIsCreating] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const resetDialog = () => {
    setNewProjectName("");
    setCreateStep(1);
    setSelectedTemplateId("blank");
  };

  const handleCreate = async () => {
    if (!newProjectName.trim() || !actor) return;
    setIsCreating(true);
    try {
      const project = await createProject.mutateAsync(newProjectName.trim());

      // Get or create the default page
      const pages = await actor.getPages(project.id);
      let pageId: string;
      if (pages.length > 0) {
        pageId = pages[0].id;
      } else {
        const page = await actor.createPage(project.id, "Home");
        pageId = page.id;
      }

      // Seed template elements
      const template = TEMPLATES.find((t) => t.id === selectedTemplateId);
      if (template && template.elements.length > 0) {
        await Promise.all(
          template.elements.map((el, index) =>
            actor.createElement(
              pageId,
              el.elementType,
              JSON.stringify(el.propsJson),
              BigInt(index),
            ),
          ),
        );
      }

      resetDialog();
      setCreateOpen(false);
      toast.success(`"${project.name}" created!`);
      navigate({
        type: "editor",
        projectId: project.id,
        projectName: project.name,
      });
    } catch {
      toast.error("Failed to create project");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProject.mutateAsync(deleteTarget.id);
      toast.success(`"${deleteTarget.name}" deleted`);
    } catch {
      toast.error("Failed to delete project");
    } finally {
      setDeleteTarget(null);
    }
  };

  const principal = identity?.getPrincipal().toString();
  const shortPrincipal = principal
    ? `${principal.slice(0, 5)}...${principal.slice(-4)}`
    : "";

  return (
    <div
      data-ocid="dashboard.page"
      className="min-h-screen flex flex-col bg-background"
    >
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Layers size={16} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground tracking-tight">
                WebCraft
              </h1>
              <p className="text-[10px] text-muted-foreground">
                Visual Builder
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {shortPrincipal && (
              <span className="text-xs text-muted-foreground font-mono bg-muted px-2.5 py-1 rounded-full">
                {shortPrincipal}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground hover:text-foreground h-8"
              onClick={() => clear()}
            >
              <LogOut size={13} />
              <span className="text-xs">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
        <div className="flex items-end justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold font-display tracking-tight">
              Your Projects
            </h2>
            <p className="text-muted-foreground text-sm">
              {projects?.length
                ? `${projects.length} project${
                    projects.length === 1 ? "" : "s"
                  }`
                : "No projects yet"}
            </p>
          </div>
          <Button
            data-ocid="project.add_button"
            onClick={() => {
              resetDialog();
              setCreateOpen(true);
            }}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus size={15} />
            New Project
          </Button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-card p-6 space-y-3"
              >
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && (!projects || projects.length === 0) && (
          <div
            data-ocid="project.empty_state"
            className="flex flex-col items-center justify-center py-24 space-y-5"
          >
            <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center">
              <Globe size={32} className="text-muted-foreground" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-xl font-semibold">No projects yet</p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Create your first website and start building something amazing.
              </p>
            </div>
            <Button
              onClick={() => {
                resetDialog();
                setCreateOpen(true);
              }}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus size={15} />
              Create your first website
            </Button>
          </div>
        )}

        {/* Projects grid */}
        {!isLoading && projects && projects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project, idx) => (
              <button
                type="button"
                key={project.id}
                data-ocid={`project.item.${idx + 1}`}
                className="group relative rounded-xl border border-border bg-card p-6 flex flex-col gap-4 hover:border-primary/40 hover:shadow-lg hover:shadow-black/10 transition-all duration-200 cursor-pointer text-left w-full"
                onClick={() =>
                  navigate({
                    type: "editor",
                    projectId: project.id,
                    projectName: project.name,
                  })
                }
              >
                {/* Card header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Globe size={18} className="text-primary" />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      data-ocid={`project.delete_button.${idx + 1}`}
                      className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget({ id: project.id, name: project.name });
                      }}
                      title="Delete project"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="p-2 rounded-lg text-muted-foreground">
                      <ExternalLink size={14} />
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate text-base leading-tight">
                    {project.name}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock size={11} />
                  <span>Updated {formatDate(project.updatedAt)}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="max-w-6xl mx-auto px-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.hostname : "",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors underline underline-offset-2"
          >
            caffeine.ai
          </a>
        </div>
      </footer>

      {/* Create Project Dialog */}
      <Dialog
        open={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open);
          if (!open) resetDialog();
        }}
      >
        <DialogContent
          data-ocid="project.dialog"
          className={createStep === 2 ? "sm:max-w-2xl" : "sm:max-w-sm"}
        >
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>
                {createStep === 1 ? "New Project" : "Choose a Template"}
              </DialogTitle>
              {/* Step indicator */}
              <div className="flex items-center gap-1.5 mr-6">
                <div
                  className={`h-2 w-2 rounded-full transition-colors ${
                    createStep === 1 ? "bg-primary" : "bg-muted-foreground/40"
                  }`}
                />
                <div
                  className={`h-2 w-2 rounded-full transition-colors ${
                    createStep === 2 ? "bg-primary" : "bg-muted-foreground/40"
                  }`}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Step {createStep} of 2
            </p>
          </DialogHeader>

          {/* Step 1: Name */}
          {createStep === 1 && (
            <div className="py-2">
              <Input
                data-ocid="project.input"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && newProjectName.trim() && setCreateStep(2)
                }
                placeholder="My Awesome Website"
                autoFocus
              />
            </div>
          )}

          {/* Step 2: Template */}
          {createStep === 2 && (
            <div className="py-2">
              <TemplateGallery
                templates={TEMPLATES}
                selectedId={selectedTemplateId}
                onSelect={setSelectedTemplateId}
              />
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-2">
            {createStep === 1 ? (
              <>
                <Button
                  data-ocid="project.cancel_button"
                  variant="ghost"
                  onClick={() => {
                    setCreateOpen(false);
                    resetDialog();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  data-ocid="template.next_button"
                  onClick={() => setCreateStep(2)}
                  disabled={!newProjectName.trim()}
                  className="gap-1.5"
                >
                  Next
                  <ArrowRight size={14} />
                </Button>
              </>
            ) : (
              <>
                <Button
                  data-ocid="template.back_button"
                  variant="ghost"
                  onClick={() => setCreateStep(1)}
                  className="gap-1.5"
                >
                  <ArrowLeft size={14} />
                  Back
                </Button>
                <Button
                  data-ocid="project.submit_button"
                  onClick={handleCreate}
                  disabled={isCreating}
                  className="gap-1.5"
                >
                  {isCreating ? "Creating..." : "Create Project"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent data-ocid="project.delete_modal">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{deleteTarget?.name}&quot; and
              all its pages and elements. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="project.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="project.confirm_button"
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
