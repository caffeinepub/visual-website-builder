import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ArrowLeft, Check, Eye, Pencil, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useEditor } from "../../contexts/EditorContext";
import { useNavigation } from "../../contexts/NavigationContext";

export function Toolbar({ onPreview }: { onPreview: () => void }) {
  const { navigate } = useNavigation();
  const {
    project,
    pages,
    currentPageId,
    setCurrentPageId,
    addPage,
    deletePage,
    updatePageName,
    updateProjectName,
  } = useEditor();

  const [editingProjectName, setEditingProjectName] = useState(false);
  const [projectNameValue, setProjectNameValue] = useState("");
  const [addPageOpen, setAddPageOpen] = useState(false);
  const [newPageName, setNewPageName] = useState("");
  const [renamingPageId, setRenamingPageId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const projectNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingProjectName && projectNameRef.current) {
      projectNameRef.current.focus();
      projectNameRef.current.select();
    }
  }, [editingProjectName]);

  const handleProjectNameEdit = () => {
    setProjectNameValue(project?.name || "");
    setEditingProjectName(true);
  };

  const handleProjectNameSave = () => {
    if (projectNameValue.trim()) {
      updateProjectName(projectNameValue.trim());
    }
    setEditingProjectName(false);
  };

  const handleAddPage = async () => {
    if (!newPageName.trim()) return;
    await addPage(newPageName.trim());
    setNewPageName("");
    setAddPageOpen(false);
  };

  const handleRenameStart = (pageId: string, name: string) => {
    setRenamingPageId(pageId);
    setRenameValue(name);
  };

  const handleRenameCommit = (pageId: string) => {
    if (renameValue.trim()) {
      updatePageName(pageId, renameValue.trim());
    }
    setRenamingPageId(null);
  };

  return (
    <>
      <header className="flex items-center gap-3 px-4 h-12 border-b border-border bg-card flex-shrink-0 z-10">
        {/* Back */}
        <Button
          data-ocid="toolbar.link"
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground hover:text-foreground h-8 px-2"
          onClick={() => navigate({ type: "dashboard" })}
        >
          <ArrowLeft size={14} />
          <span className="text-xs">Dashboard</span>
        </Button>

        <div className="w-px h-5 bg-border" />

        {/* Project name */}
        <div className="flex items-center gap-1.5 min-w-0">
          {editingProjectName ? (
            <div className="flex items-center gap-1">
              <Input
                ref={projectNameRef}
                value={projectNameValue}
                onChange={(e) => setProjectNameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleProjectNameSave();
                  if (e.key === "Escape") setEditingProjectName(false);
                }}
                onBlur={handleProjectNameSave}
                className="h-7 text-sm font-semibold w-40"
              />
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0"
                onClick={handleProjectNameSave}
              >
                <Check size={12} />
              </Button>
            </div>
          ) : (
            <button
              type="button"
              className="flex items-center gap-1.5 text-sm font-semibold hover:text-primary transition-colors group"
              onClick={handleProjectNameEdit}
            >
              <span className="truncate max-w-32">
                {project?.name || "Untitled"}
              </span>
              <Pencil
                size={11}
                className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
              />
            </button>
          )}
        </div>

        <div className="w-px h-5 bg-border" />

        {/* Page tabs */}
        <div className="flex items-center gap-1 flex-1 min-w-0 overflow-x-auto">
          {pages.map((page) => (
            <div key={page.id} className="flex items-center flex-shrink-0">
              {renamingPageId === page.id ? (
                <div className="flex items-center gap-0.5">
                  <Input
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRenameCommit(page.id);
                      if (e.key === "Escape") setRenamingPageId(null);
                    }}
                    onBlur={() => handleRenameCommit(page.id)}
                    className="h-7 text-xs w-28"
                    autoFocus
                  />
                </div>
              ) : (
                <button
                  type="button"
                  data-ocid="toolbar.tab"
                  className={cn(
                    "flex items-center gap-1.5 px-3 h-8 text-xs rounded-md transition-all group",
                    currentPageId === page.id
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  )}
                  onClick={() => setCurrentPageId(page.id)}
                  onDoubleClick={() => handleRenameStart(page.id, page.name)}
                  title="Double-click to rename"
                >
                  <span>{page.name}</span>
                  <X
                    size={10}
                    className="opacity-0 group-hover:opacity-60 hover:opacity-100 transition-opacity ml-0.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (pages.length > 1) deletePage(page.id);
                    }}
                  />
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className="flex items-center gap-1 px-2 h-7 text-xs text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-all"
            onClick={() => setAddPageOpen(true)}
            title="Add page"
          >
            <Plus size={13} />
          </button>
        </div>

        {/* Preview */}
        <Button
          data-ocid="toolbar.primary_button"
          size="sm"
          className="gap-1.5 h-8 bg-primary text-primary-foreground hover:bg-primary/90 flex-shrink-0"
          onClick={onPreview}
        >
          <Eye size={13} />
          <span className="text-xs font-semibold">Preview</span>
        </Button>
      </header>

      {/* Add page dialog */}
      <Dialog open={addPageOpen} onOpenChange={setAddPageOpen}>
        <DialogContent data-ocid="page.dialog" className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add New Page</DialogTitle>
          </DialogHeader>
          <Input
            data-ocid="page.input"
            value={newPageName}
            onChange={(e) => setNewPageName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddPage()}
            placeholder="Page name"
            autoFocus
          />
          <DialogFooter>
            <Button
              data-ocid="page.cancel_button"
              variant="ghost"
              onClick={() => setAddPageOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="page.submit_button"
              onClick={handleAddPage}
              disabled={!newPageName.trim()}
            >
              Create Page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
