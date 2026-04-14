import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Podcast from "./pages/Podcast";
import News from "./pages/News";
import Article from "./pages/Article";
import ThemesIndex from "./pages/ThemesIndex";
import ThemeHub from "./pages/ThemeHub";
import Themes from "./pages/Themes"; // Current episode browser, now at /episodes
import Partnerships from "./pages/Partnerships";
import EntityPage from "./pages/EntityPage";
import Products from "./pages/Products";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Podcast homepage */}
          <Route path="/" element={<Podcast />} />

          {/* Publication hub */}
          <Route path="/hub" element={<Home />} />
          <Route path="/podcast" element={<Navigate to="/" replace />} />

          {/* News — editorial articles */}
          <Route path="/news" element={<News />} />
          <Route path="/news/format/:format" element={<News />} />
          <Route path="/news/:slug" element={<Article />} />

          {/* Themes */}
          <Route path="/themes" element={<ThemesIndex />} />
          <Route path="/themes/:slug" element={<ThemeHub />} />

          {/* Episodes — current episode browser */}
          <Route path="/episodes" element={<Themes />} />

          {/* Partnerships */}
          <Route path="/partnerships" element={<Partnerships />} />

          {/* Entity pages */}
          <Route path="/concepts/:slug" element={<EntityPage entityType="concept" />} />
          <Route path="/people/:slug" element={<EntityPage entityType="person" />} />
          <Route path="/organizations/:slug" element={<EntityPage entityType="organization" />} />
          <Route path="/products/:slug" element={<EntityPage entityType="product" />} />
          <Route path="/frameworks/:slug" element={<EntityPage entityType="framework" />} />
          <Route path="/sources/:slug" element={<EntityPage entityType="source" />} />

          {/* Products table page (AI products list) */}
          <Route path="/products" element={<Products />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
