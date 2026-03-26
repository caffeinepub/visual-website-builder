import { cn } from "@/lib/utils";
import {
  AlignLeft,
  Box,
  Columns2,
  CreditCard,
  Heading,
  Image,
  LayoutTemplate,
  Minus,
  MousePointerClick,
  Sparkles,
} from "lucide-react";
import { useEditor } from "../../contexts/EditorContext";

const PALETTE_GROUPS = [
  {
    label: "Layout",
    items: [
      { type: "hero", label: "Hero Section", icon: Sparkles },
      { type: "two-columns", label: "Two Columns", icon: Columns2 },
      { type: "section", label: "Section Container", icon: Box },
    ],
  },
  {
    label: "Content",
    items: [
      { type: "heading", label: "Heading", icon: Heading },
      { type: "paragraph", label: "Paragraph", icon: AlignLeft },
      { type: "image", label: "Image", icon: Image },
      { type: "button", label: "Button", icon: MousePointerClick },
      { type: "divider", label: "Divider", icon: Minus },
      { type: "card", label: "Card", icon: CreditCard },
    ],
  },
];

export function ComponentPalette() {
  const { addElement, currentPageId } = useEditor();

  return (
    <aside
      data-ocid="palette.panel"
      className="flex flex-col h-full bg-sidebar border-r border-border overflow-hidden"
      style={{ width: 220 }}
    >
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <LayoutTemplate size={14} className="text-primary" />
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Components
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-5">
        {PALETTE_GROUPS.map((group, gi) => (
          <div key={group.label}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-1 mb-2">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item, ii) => {
                const Icon = item.icon;
                const ocid = `palette.item.${gi * 10 + ii + 1}`;
                return (
                  <button
                    type="button"
                    key={item.type}
                    data-ocid={ocid}
                    disabled={!currentPageId}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-100 text-left",
                      "text-foreground/80 hover:text-foreground hover:bg-accent",
                      "disabled:opacity-40 disabled:cursor-not-allowed",
                      "active:scale-95",
                    )}
                    onClick={() => addElement(item.type)}
                  >
                    <Icon size={14} className="text-primary flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!currentPageId && (
        <div className="px-4 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Create a page to start adding components
          </p>
        </div>
      )}
    </aside>
  );
}
