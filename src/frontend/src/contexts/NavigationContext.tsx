import { type ReactNode, createContext, useContext, useState } from "react";

export type Route =
  | { type: "dashboard" }
  | { type: "editor"; projectId: string; projectName: string };

type NavigationContextType = {
  route: Route;
  navigate: (route: Route) => void;
};

const NavigationContext = createContext<NavigationContextType | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>({ type: "dashboard" });

  return (
    <NavigationContext.Provider value={{ route, navigate: setRoute }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx)
    throw new Error("useNavigation must be used within NavigationProvider");
  return ctx;
}
