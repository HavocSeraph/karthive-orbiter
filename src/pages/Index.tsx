import Hero from "@/components/Hero";
import BentoGrid from "@/components/BentoGrid";
import LiveFeed from "@/components/LiveFeed";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="bg-background overflow-x-hidden">
      <Hero />
      <BentoGrid />
      <LiveFeed />
      <Footer />
    </main>
  );
};

export default Index;
