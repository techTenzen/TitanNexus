import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ForumPage from "@/pages/forum-page";
import DiscussionDetailPage from "@/pages/discussion-detail-page";
import ProfilePage from '@/pages/profile-page';
import ProjectsPage from "@/pages/projects-page";
import DocumentationPage from "@/pages/documentation-page";
import { ProtectedRoute } from "./lib/protected-route";
import ProjectDetailPage from "@/pages/project-detail-page";

function Router() {
    return (
        <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/auth" component={AuthPage} />
            <Route path="/forum" component={ForumPage} />
            <Route path="/forum/:id" component={DiscussionDetailPage} />
            <Route path="/projects" component={ProjectsPage} />
            <Route path="/documentation" component={DocumentationPage} />
            <Route path="/projects/:id" component={ProjectDetailPage} />
            <Route path="/profile/:username" component={ProfilePage} />
            <Route component={NotFound} />
        </Switch>
    );
}

function App() {
    return (
        <>
            <Router />
            <Toaster />
        </>
    );
}

export default App;