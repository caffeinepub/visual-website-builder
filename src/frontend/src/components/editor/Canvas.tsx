import { MousePointerClick } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Element } from "../../backend.d";
import { useEditor } from "../../contexts/EditorContext";
import { ElementRenderer } from "./ElementRenderer";

export function Canvas() {
  const {
    elements,
    currentPageId,
    selectedElementId,
    setSelectedElementId,
    deleteElement,
    reorderElements,
  } = useEditor();

  const sortedElements = [...elements].sort((a, b) =>
    a.order < b.order ? -1 : a.order > b.order ? 1 : 0,
  );

  const elementRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [dragState, setDragState] = useState<{
    dragId: string;
    dropIndex: number;
  } | null>(null);

  const getDropIndex = useCallback(
    (mouseY: number): number => {
      for (let i = 0; i < sortedElements.length; i++) {
        const el = elementRefs.current.get(sortedElements[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (mouseY < rect.top + rect.height / 2) return i;
        }
      }
      return sortedElements.length;
    },
    [sortedElements],
  );

  useEffect(() => {
    if (!dragState) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newIndex = getDropIndex(e.clientY);
      setDragState((prev) => (prev ? { ...prev, dropIndex: newIndex } : null));
    };

    const handleMouseUp = () => {
      if (dragState) {
        const fromIndex = sortedElements.findIndex(
          (el) => el.id === dragState.dragId,
        );
        const toIndex = dragState.dropIndex;
        if (fromIndex !== -1 && fromIndex !== toIndex) {
          const newOrder = [...sortedElements];
          const [moved] = newOrder.splice(fromIndex, 1);
          const insertAt = toIndex > fromIndex ? toIndex - 1 : toIndex;
          newOrder.splice(insertAt, 0, moved);
          reorderElements(newOrder.map((el) => el.id));
        }
      }
      setDragState(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragState, sortedElements, getDropIndex, reorderElements]);

  const handleDragStart = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const fromIndex = sortedElements.findIndex((el) => el.id === id);
    setDragState({ dragId: id, dropIndex: fromIndex });
  };

  const handleCanvasKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setSelectedElementId(null);
  };

  const handleCanvasClick = () => setSelectedElementId(null);

  if (!currentPageId) {
    return (
      <main
        data-ocid="canvas.panel"
        className="flex-1 flex items-center justify-center bg-white"
      >
        <div className="text-center space-y-3">
          <MousePointerClick size={32} className="text-gray-300 mx-auto" />
          <p className="text-gray-400 text-sm">
            Select or create a page to start editing
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      data-ocid="canvas.panel"
      className="flex-1 overflow-y-auto bg-white"
      style={{
        backgroundImage:
          "radial-gradient(circle, #e2e8f0 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
      onClick={handleCanvasClick}
      onKeyDown={handleCanvasKeyDown}
    >
      <div
        className="min-h-full mx-auto shadow-2xl"
        style={{
          maxWidth: 900,
          minHeight: "100%",
          background: "#ffffff",
          backgroundImage: "none",
        }}
      >
        {sortedElements.length === 0 ? (
          <div
            data-ocid="canvas.empty_state"
            className="flex flex-col items-center justify-center min-h-[500px] space-y-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center">
              <MousePointerClick size={24} className="text-gray-300" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-gray-500 font-medium">
                Drag components here to start building
              </p>
              <p className="text-gray-400 text-sm">
                Or click any component in the left panel
              </p>
            </div>
          </div>
        ) : (
          <div className="relative">
            {dragState && dragState.dropIndex === 0 && (
              <div className="drop-indicator mx-4 mt-1" />
            )}

            {sortedElements.map((element: Element, index: number) => (
              <div
                key={element.id}
                ref={(el) => {
                  if (el) elementRefs.current.set(element.id, el);
                  else elementRefs.current.delete(element.id);
                }}
                style={{
                  opacity: dragState?.dragId === element.id ? 0.4 : 1,
                  transition: "opacity 0.15s",
                }}
              >
                <ElementRenderer
                  element={element}
                  index={index}
                  isSelected={selectedElementId === element.id}
                  isEditing={true}
                  onSelect={() => setSelectedElementId(element.id)}
                  onDelete={() => deleteElement(element.id)}
                  onDragStart={(e) => handleDragStart(e, element.id)}
                />
                {dragState && dragState.dropIndex === index + 1 && (
                  <div className="drop-indicator mx-4 my-1" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
