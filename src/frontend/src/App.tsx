import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { LoginPage } from "./components/LoginPage";
import {
  NavigationProvider,
  useNavigation,
} from "./contexts/NavigationContext";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { Dashboard } from "./pages/Dashboard";
import { Editor } from "./pages/Editor";

function AppRouter() {
  const { route } = useNavigation();
  const { identity, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="space-y-3 w-64">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  if (!identity) {
    return <LoginPage />;
  }

  if (route.type === "editor") {
    return (
      <Editor projectId={route.projectId} projectName={route.projectName} />
    );
  }

  return <Dashboard />;
}

export default function App() {
  return (
    <NavigationProvider>
      <AppRouter />
      <Toaster richColors position="bottom-right" />
    </NavigationProvider>
  );
}
