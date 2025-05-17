import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import CampaignsPage from "@/pages/campaigns-page";
import CampaignDetailsPage from "@/pages/campaign-details-page";
import DonationPage from "@/pages/donation-page";
import VolunteerPage from "@/pages/volunteer-page";
import AboutPage from "@/pages/about-page";
import ContactPage from "@/pages/contact-page";
import AuthPage from "@/pages/auth-page";
import ProfilePage from "@/pages/profile-page";
import { queryClient } from "./lib/queryClient";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";
import { ThemeProvider } from 'next-themes';
import { HelmetProvider } from 'react-helmet-async';

// Import halaman transparansi
import TransparencyPage from "@/pages/transparency-page";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/campaigns" component={CampaignsPage} />
      <Route path="/campaign/:id" component={CampaignDetailsPage} />
      <Route path="/donate/:id?" component={DonationPage} />
      <Route path="/volunteer" component={VolunteerPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/transparency" component={TransparencyPage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
