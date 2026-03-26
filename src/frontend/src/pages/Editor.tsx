import { useState } from "react";
import { Canvas } from "../components/editor/Canvas";
import { ComponentPalette } from "../components/editor/ComponentPalette";
import { PropertiesPanel } from "../components/editor/PropertiesPanel";
import { Toolbar } from "../components/editor/Toolbar";
import { EditorProvider } from "../contexts/EditorContext";
import { Preview } from "./Preview";

interface EditorProps {
  projectId: string;
  projectName: string;
}

export function Editor({ projectId, projectName }: EditorProps) {
  const [isPreview, setIsPreview] = useState(false);

  return (
    <EditorProvider projectId={projectId} initialProjectName={projectName}>
      <div className="h-screen flex flex-col overflow-hidden bg-background">
        {!isPreview && <Toolbar onPreview={() => setIsPreview(true)} />}

        {isPreview ? (
          <Preview onClose={() => setIsPreview(false)} />
        ) : (
          <div className="flex flex-1 min-h-0 overflow-hidden">
            <ComponentPalette />
            <Canvas />
            <PropertiesPanel />
          </div>
        )}
      </div>
    </EditorProvider>
  );
}
