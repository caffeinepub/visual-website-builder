import { X } from "lucide-react";
import type { Element } from "../backend.d";
import { ElementRenderer } from "../components/editor/ElementRenderer";
import { useEditor } from "../contexts/EditorContext";

export function Preview({ onClose }: { onClose: () => void }) {
  const { elements } = useEditor();
  const sorted = [...elements].sort((a, b) =>
    a.order < b.order ? -1 : a.order > b.order ? 1 : 0,
  );

  return (
    <div
      data-ocid="preview.panel"
      className="flex-1 relative overflow-y-auto bg-white"
    >
      <button
        type="button"
        data-ocid="preview.close_button"
        className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-gray-900/80 backdrop-blur-sm text-white text-xs font-semibold px-4 py-2 rounded-full shadow-xl hover:bg-gray-900 transition-colors"
        onClick={onClose}
      >
        <X size={13} />
        Exit Preview
      </button>

      <div className="w-full">
        {sorted.map((element: Element) => (
          <ElementRenderer
            key={element.id}
            element={element}
            index={0}
            isSelected={false}
            isEditing={false}
          />
        ))}
      </div>
    </div>
  );
}
