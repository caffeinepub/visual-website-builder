import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Element, Page, Project } from "../backend.d";
import { DEFAULT_PROPS } from "../components/editor/elementDefaults";
import { useActor } from "../hooks/useActor";

type EditorContextType = {
  project: Project | null;
  pages: Page[];
  currentPageId: string | null;
  elements: Element[];
  selectedElementId: string | null;
  isLoading: boolean;
  setCurrentPageId: (id: string) => void;
  setSelectedElementId: (id: string | null) => void;
  addElement: (elementType: string) => Promise<void>;
  updateElementProps: (id: string, props: Record<string, unknown>) => void;
  deleteElement: (id: string) => Promise<void>;
  reorderElements: (ids: string[]) => Promise<void>;
  addPage: (name: string) => Promise<void>;
  deletePage: (id: string) => Promise<void>;
  updatePageName: (id: string, name: string) => Promise<void>;
  updateProjectName: (name: string) => Promise<void>;
};

const EditorContext = createContext<EditorContextType | null>(null);

export function EditorProvider({
  projectId,
  initialProjectName,
  children,
}: {
  projectId: string;
  initialProjectName: string;
  children: ReactNode;
}) {
  const { actor } = useActor();
  const [project, setProject] = useState<Project | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const saveTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );
  // Use refs to avoid stale closure issues in effects
  const initialProjectNameRef = useRef(initialProjectName);
  const hasInitializedPageRef = useRef(false);

  // Load project and pages (run once per actor + projectId)
  useEffect(() => {
    if (!actor) return;
    hasInitializedPageRef.current = false;
    const load = async () => {
      setIsLoading(true);
      try {
        const [projects, pagesData] = await Promise.all([
          actor.getMyProjects(),
          actor.getPages(projectId),
        ]);
        const proj = projects.find((p) => p.id === projectId) || null;
        if (proj) {
          setProject(proj);
        } else {
          setProject({
            id: projectId,
            name: initialProjectNameRef.current,
            ownerId: null as any,
            createdAt: BigInt(0),
            updatedAt: BigInt(0),
          });
        }
        const sorted = [...pagesData].sort((a, b) =>
          a.order < b.order ? -1 : 1,
        );
        setPages(sorted);
        if (sorted.length > 0 && !hasInitializedPageRef.current) {
          hasInitializedPageRef.current = true;
          setCurrentPageId(sorted[0].id);
        }
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [actor, projectId]);

  // Load elements when page changes
  useEffect(() => {
    if (!actor || !currentPageId) return;
    const load = async () => {
      const els = await actor.getElements(currentPageId);
      const sorted = [...els].sort((a, b) => (a.order < b.order ? -1 : 1));
      setElements(sorted);
      setSelectedElementId(null);
    };
    load();
  }, [actor, currentPageId]);

  const addElement = async (elementType: string) => {
    if (!actor || !currentPageId) return;
    const defaultProps = DEFAULT_PROPS[elementType] || {};
    const order = BigInt(elements.length);
    const el = await actor.createElement(
      currentPageId,
      elementType,
      JSON.stringify(defaultProps),
      order,
    );
    setElements((prev) => [...prev, el]);
    setSelectedElementId(el.id);
  };

  const updateElementProps = (id: string, props: Record<string, unknown>) => {
    const propsJson = JSON.stringify(props);
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, propsJson } : el)),
    );
    const existing = saveTimers.current.get(id);
    if (existing) clearTimeout(existing);
    const timer = setTimeout(async () => {
      await actor?.updateElement(id, propsJson);
      saveTimers.current.delete(id);
    }, 500);
    saveTimers.current.set(id, timer);
  };

  const deleteElement = async (id: string) => {
    if (!actor) return;
    setElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedElementId === id) setSelectedElementId(null);
    await actor.deleteElement(id);
  };

  const reorderElements = async (ids: string[]) => {
    if (!actor || !currentPageId) return;
    setElements((prev) => {
      const map = new Map(prev.map((el) => [el.id, el]));
      return ids.map((id, i) => ({ ...map.get(id)!, order: BigInt(i) }));
    });
    await actor.reorderElements(currentPageId, ids);
  };

  const addPage = async (name: string) => {
    if (!actor) return;
    const page = await actor.createPage(projectId, name);
    setPages((prev) => [...prev, page]);
    setCurrentPageId(page.id);
  };

  const deletePage = async (id: string) => {
    if (!actor) return;
    await actor.deletePage(id);
    setPages((prev) => prev.filter((p) => p.id !== id));
    if (currentPageId === id) {
      const remaining = pages.filter((p) => p.id !== id);
      setCurrentPageId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const updatePageName = async (id: string, name: string) => {
    if (!actor) return;
    setPages((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
    await actor.updatePage(id, name);
  };

  const updateProjectName = async (name: string) => {
    if (!actor) return;
    setProject((prev) => (prev ? { ...prev, name } : null));
    await actor.updateProjectName(projectId, name);
  };

  return (
    <EditorContext.Provider
      value={{
        project,
        pages,
        currentPageId,
        elements,
        selectedElementId,
        isLoading,
        setCurrentPageId,
        setSelectedElementId,
        addElement,
        updateElementProps,
        deleteElement,
        reorderElements,
        addPage,
        deletePage,
        updatePageName,
        updateProjectName,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used within EditorProvider");
  return ctx;
}
