import { useState } from "react";
import Hero from "@/components/Hero";
import BentoGrid from "@/components/BentoGrid";
import LiveFeed from "@/components/LiveFeed";
import Footer from "@/components/Footer";
import SearchResults from "@/components/SearchResults";
import LoadingOverlay from "@/components/LoadingOverlay";

type ViewState = "landing" | "results";

const Index = () => {
  const [view, setView] = useState<ViewState>("landing");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsLoading(true);
    
    // Simulate the "hacking" delay
    setTimeout(() => {
      setIsLoading(false);
      setView("results");
    }, 2000);
  };

  const handleBack = () => {
    setView("landing");
    setSearchQuery("");
  };

  return (
    <>
      {/* Loading Overlay */}
      <LoadingOverlay isLoading={isLoading} />

      {/* Main Content */}
      {view === "landing" ? (
        <main className="bg-background overflow-x-hidden">
          <Hero onSearch={handleSearch} />
          <BentoGrid />
          <LiveFeed />
          <Footer />
        </main>
      ) : (
        <SearchResults 
          searchQuery={searchQuery} 
          onBack={handleBack} 
        />
      )}
    </>
  );
};

export default Index;
