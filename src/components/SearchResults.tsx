import { motion, Variants } from "framer-motion";
import { ArrowLeft, Grid3X3, List } from "lucide-react";
import FilterSidebar from "./FilterSidebar";
import ProductCard, { Product } from "./ProductCard";
import EmptyState from "./EmptyState";
import TextReveal from "./TextReveal";

// ============================================
// PERFORMANCE: All variants defined OUTSIDE components
// ============================================

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 100 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring",
      damping: 25,
      stiffness: 100,
      staggerChildren: 0.1
    }
  }
};

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};

const gridContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// ============================================
// Mock Products Data
// ============================================

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Apple iPhone 15 Pro Max 256GB Natural Titanium",
    image: "/placeholder.svg",
    price: 156900,
    originalPrice: 179900,
    store: "amazon",
    rating: 4.8,
    isLowestPrice: true,
  },
  {
    id: "2",
    name: "Apple iPhone 15 Pro 128GB Blue Titanium",
    image: "/placeholder.svg",
    price: 134900,
    originalPrice: 149900,
    store: "flipkart",
    rating: 4.7,
  },
  {
    id: "3",
    name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    image: "/placeholder.svg",
    price: 24990,
    originalPrice: 34990,
    store: "croma",
    rating: 4.9,
    isLowestPrice: true,
  },
  {
    id: "4",
    name: "Apple MacBook Air M3 13-inch 8GB 256GB SSD",
    image: "/placeholder.svg",
    price: 99900,
    originalPrice: 114900,
    store: "apple",
    rating: 4.8,
  },
  {
    id: "5",
    name: "Samsung Galaxy S24 Ultra 256GB Titanium Black",
    image: "/placeholder.svg",
    price: 124999,
    originalPrice: 134999,
    store: "amazon",
    rating: 4.6,
  },
  {
    id: "6",
    name: "Apple AirPods Pro 2nd Gen with MagSafe Case",
    image: "/placeholder.svg",
    price: 21900,
    originalPrice: 26900,
    store: "flipkart",
    rating: 4.7,
    isLowestPrice: true,
  },
  {
    id: "7",
    name: "Dell XPS 15 Core i7 13th Gen 16GB 512GB SSD",
    image: "/placeholder.svg",
    price: 149990,
    originalPrice: 179990,
    store: "reliance",
    rating: 4.5,
  },
  {
    id: "8",
    name: "Bose QuietComfort Ultra Headphones Sandstone",
    image: "/placeholder.svg",
    price: 32900,
    originalPrice: 37900,
    store: "croma",
    rating: 4.6,
  },
];

// ============================================
// SearchResults Component
// ============================================

interface SearchResultsProps {
  searchQuery: string;
  onBack: () => void;
}

const SearchResults = ({ searchQuery, onBack }: SearchResultsProps) => {
  // For demo, show results if query exists, empty if "notfound"
  const showEmpty = searchQuery.toLowerCase() === "notfound";
  const results = showEmpty ? [] : mockProducts;

  return (
    <motion.div
      className="min-h-screen bg-background"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.header 
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/10"
        variants={headerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Back button and logo */}
            <div className="flex items-center gap-4">
              <motion.button
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={onBack}
                whileHover={{ x: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-mono hidden md:inline">BACK</span>
              </motion.button>
              
              <div className="flex items-center gap-2">
                <span className="font-clash font-bold text-2xl text-cyber-lime">K</span>
                <span className="font-clash font-bold text-xl text-foreground">KartHive</span>
              </div>
            </div>

            {/* Search info */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-xs text-muted-foreground font-mono">SEARCH_QUERY:</p>
                <p className="text-sm text-foreground font-inter">"{searchQuery}"</p>
              </div>
              
              {/* View toggles */}
              <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg">
                <button className="p-2 rounded bg-cyber-lime/20 text-cyber-lime">
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button className="p-2 rounded text-muted-foreground hover:text-foreground transition-colors">
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Results Header */}
        <motion.div 
          className="mb-8"
          variants={headerVariants}
        >
          <h1 className="font-clash text-3xl md:text-4xl font-bold text-foreground mb-2">
            <TextReveal text={`Results for "${searchQuery}"`} />
          </h1>
          <p className="text-muted-foreground font-mono text-sm">
            {results.length} products found across {new Set(results.map(p => p.store)).size} stores
          </p>
        </motion.div>

        {/* Split Layout */}
        <div className="flex gap-8">
          {/* Filter Sidebar (25%) */}
          <div className="hidden lg:block w-1/4 flex-shrink-0">
            <FilterSidebar />
          </div>

          {/* Product Grid (75%) */}
          <div className="flex-1">
            {results.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                variants={gridContainerVariants}
                initial="hidden"
                animate="visible"
              >
                {results.map((product, index) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    index={index}
                  />
                ))}
              </motion.div>
            ) : (
              <EmptyState 
                onRetry={onBack} 
                searchQuery={searchQuery}
              />
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filter Button */}
      <motion.button
        className="lg:hidden fixed bottom-6 right-6 z-50 px-6 py-3 bg-cyber-lime text-background font-mono text-sm rounded-full shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          boxShadow: "0 0 30px 5px hsla(75, 100%, 50%, 0.3)"
        }}
      >
        FILTERS
      </motion.button>
    </motion.div>
  );
};

export default SearchResults;
