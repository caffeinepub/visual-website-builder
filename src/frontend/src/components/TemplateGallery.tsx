import { cn } from "@/lib/utils";
import {
  Briefcase,
  FileText,
  Rocket,
  ShoppingBag,
  Square,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Template } from "../data/templates";

const ICON_MAP: Record<string, LucideIcon> = {
  Square,
  Rocket,
  Briefcase,
  FileText,
  User,
  ShoppingBag,
};

const ICON_COLORS: Record<string, { bg: string; text: string }> = {
  blank: { bg: "bg-muted", text: "text-muted-foreground" },
  "landing-page": {
    bg: "bg-blue-100 dark:bg-blue-950",
    text: "text-blue-600 dark:text-blue-400",
  },
  portfolio: {
    bg: "bg-violet-100 dark:bg-violet-950",
    text: "text-violet-600 dark:text-violet-400",
  },
  "blog-post": {
    bg: "bg-amber-100 dark:bg-amber-950",
    text: "text-amber-600 dark:text-amber-400",
  },
  "about-me": {
    bg: "bg-emerald-100 dark:bg-emerald-950",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  "product-page": {
    bg: "bg-rose-100 dark:bg-rose-950",
    text: "text-rose-600 dark:text-rose-400",
  },
};

interface TemplateGalleryProps {
  templates: Template[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function TemplateGallery({
  templates,
  selectedId,
  onSelect,
}: TemplateGalleryProps) {
  return (
    <div data-ocid="template.gallery" className="grid grid-cols-2 gap-3">
      {templates.map((template, idx) => {
        const IconComponent = ICON_MAP[template.icon] ?? Square;
        const colors = ICON_COLORS[template.id] ?? ICON_COLORS.blank;
        const isSelected = template.id === selectedId;

        return (
          <button
            key={template.id}
            type="button"
            data-ocid={`template.item.${idx + 1}`}
            onClick={() => onSelect(template.id)}
            className={cn(
              "group relative flex flex-col gap-3 rounded-xl border-2 p-4 text-left transition-all duration-150 hover:border-primary/60 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isSelected
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border bg-card hover:bg-accent/30",
            )}
          >
            {/* Icon area */}
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                colors.bg,
              )}
            >
              <IconComponent size={18} className={cn(colors.text)} />
            </div>

            {/* Text */}
            <div className="space-y-0.5 min-w-0">
              <p className="text-sm font-semibold text-foreground leading-tight">
                {template.name}
              </p>
              <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
                {template.description}
              </p>
            </div>

            {/* Selected indicator */}
            {isSelected && (
              <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-primary" />
            )}
          </button>
        );
      })}
    </div>
  );
}
