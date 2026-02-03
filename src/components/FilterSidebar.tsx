import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { ChevronDown, Terminal } from "lucide-react";

// ============================================
// PERFORMANCE: All variants defined OUTSIDE components
// ============================================

const sidebarVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, delay: 0.2 }
  }
};

const dropdownVariants: Variants = {
  hidden: { opacity: 0, y: -10, height: 0 },
  visible: { 
    opacity: 1, 
    y: 0, 
    height: "auto",
    transition: { duration: 0.2 }
  }
};

// ============================================
// Store Options
// ============================================

const storeOptions = [
  { id: "amazon", name: "Amazon", color: "#FF9900" },
  { id: "flipkart", name: "Flipkart", color: "#2874F0" },
  { id: "croma", name: "Croma", color: "#0DB14B" },
  { id: "apple", name: "Apple Store", color: "#FFFFFF" },
  { id: "reliance", name: "Reliance Digital", color: "#E42529" },
] as const;

const sortOptions = [
  { value: "relevance", label: "SORT_BY_RELEVANCE" },
  { value: "price_low", label: "SORT_BY_PRICE_ASC" },
  { value: "price_high", label: "SORT_BY_PRICE_DESC" },
  { value: "rating", label: "SORT_BY_RATING" },
  { value: "discount", label: "SORT_BY_DISCOUNT" },
] as const;

// ============================================
// Custom Dual-Thumb Slider Component
// ============================================

interface DualSliderProps {
  min: number;
  max: number;
  minValue: number;
  maxValue: number;
  onChange: (min: number, max: number) => void;
}

const DualSlider = ({ min, max, minValue, maxValue, onChange }: DualSliderProps) => {
  const [dragging, setDragging] = useState<"min" | "max" | null>(null);

  const minPercent = ((minValue - min) / (max - min)) * 100;
  const maxPercent = ((maxValue - min) / (max - min)) * 100;

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    const value = Math.round((percent / 100) * (max - min) + min);
    
    // Determine which thumb to move
    const distToMin = Math.abs(value - minValue);
    const distToMax = Math.abs(value - maxValue);
    
    if (distToMin < distToMax) {
      onChange(Math.min(value, maxValue - 1000), maxValue);
    } else {
      onChange(minValue, Math.max(value, minValue + 1000));
    }
  };

  const handleDrag = (e: React.MouseEvent<HTMLDivElement>, thumb: "min" | "max") => {
    e.preventDefault();
    setDragging(thumb);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const track = document.getElementById("price-track");
      if (!track) return;
      
      const rect = track.getBoundingClientRect();
      const percent = Math.max(0, Math.min(100, ((moveEvent.clientX - rect.left) / rect.width) * 100));
      const value = Math.round((percent / 100) * (max - min) + min);

      if (thumb === "min") {
        onChange(Math.min(value, maxValue - 1000), maxValue);
      } else {
        onChange(minValue, Math.max(value, minValue + 1000));
      }
    };

    const handleMouseUp = () => {
      setDragging(null);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="relative py-4">
      {/* Track */}
      <div 
        id="price-track"
        className="relative h-1 bg-white/10 rounded-full cursor-pointer"
        onClick={handleTrackClick}
      >
        {/* Active track */}
        <div
          className="absolute h-full bg-cyber-lime rounded-full"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />
      </div>

      {/* Min Thumb */}
      <motion.div
        className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-cyber-lime cursor-grab border-2 border-background ${dragging === "min" ? "cursor-grabbing" : ""}`}
        style={{ left: `calc(${minPercent}% - 10px)` }}
        onMouseDown={(e) => handleDrag(e, "min")}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: dragging === "min" 
            ? "0 0 20px 5px hsla(75, 100%, 50%, 0.5)"
            : "0 0 10px 2px hsla(75, 100%, 50%, 0.3)"
        }}
      />

      {/* Max Thumb */}
      <motion.div
        className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-cyber-lime cursor-grab border-2 border-background ${dragging === "max" ? "cursor-grabbing" : ""}`}
        style={{ left: `calc(${maxPercent}% - 10px)` }}
        onMouseDown={(e) => handleDrag(e, "max")}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: dragging === "max" 
            ? "0 0 20px 5px hsla(75, 100%, 50%, 0.5)"
            : "0 0 10px 2px hsla(75, 100%, 50%, 0.3)"
        }}
      />

      {/* Labels */}
      <div className="flex justify-between mt-3 text-xs text-muted-foreground font-mono">
        <span>₹{minValue.toLocaleString()}</span>
        <span>₹{maxValue.toLocaleString()}</span>
      </div>
    </div>
  );
};

// ============================================
// Custom Toggle Switch Component
// ============================================

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
  color?: string;
}

const ToggleSwitch = ({ enabled, onChange, label, color }: ToggleSwitchProps) => {
  return (
    <button
      className="flex items-center justify-between w-full py-2 group"
      onClick={() => onChange(!enabled)}
    >
      <div className="flex items-center gap-2">
        <div 
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: color || "hsl(var(--muted-foreground))" }}
        />
        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
          {label}
        </span>
      </div>
      
      <div className={`relative w-10 h-5 rounded-full transition-colors ${enabled ? "bg-cyber-lime/20" : "bg-white/10"}`}>
        <motion.div
          className="absolute top-0.5 w-4 h-4 rounded-full"
          animate={{
            left: enabled ? "calc(100% - 18px)" : "2px",
            backgroundColor: enabled ? "hsl(var(--cyber-lime))" : "hsl(var(--muted-foreground))",
            boxShadow: enabled 
              ? "0 0 12px 2px hsla(75, 100%, 50%, 0.6)"
              : "none"
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
    </button>
  );
};

// ============================================
// Terminal Dropdown Component
// ============================================

interface TerminalDropdownProps {
  value: string;
  options: readonly { value: string; label: string }[];
  onChange: (value: string) => void;
}

const TerminalDropdown = ({ value, options, onChange }: TerminalDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(o => o.value === value);

  return (
    <div className="relative">
      <button
        className="w-full flex items-center justify-between p-3 bg-black/40 border border-white/10 rounded-lg font-mono text-sm text-left hover:border-cyber-lime/30 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyber-lime" />
          <span className="text-muted-foreground">$</span>
          <span className="text-foreground">{selectedOption?.label}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </motion.div>
      </button>

      <motion.div
        className="absolute top-full left-0 right-0 mt-1 z-50 overflow-hidden"
        variants={dropdownVariants}
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
      >
        <div className="bg-black/95 border border-white/10 rounded-lg overflow-hidden backdrop-blur-xl">
          {options.map((option) => (
            <button
              key={option.value}
              className={`w-full flex items-center gap-2 p-3 text-left font-mono text-sm hover:bg-cyber-lime/10 transition-colors ${option.value === value ? "text-cyber-lime bg-cyber-lime/5" : "text-muted-foreground"}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              <span className="text-muted-foreground/50">{">"}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// ============================================
// Main FilterSidebar Component
// ============================================

interface FilterSidebarProps {
  onFilterChange?: (filters: FilterState) => void;
}

interface FilterState {
  priceRange: [number, number];
  stores: string[];
  sortBy: string;
}

const FilterSidebar = ({ onFilterChange }: FilterSidebarProps) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [enabledStores, setEnabledStores] = useState<Record<string, boolean>>({
    amazon: true,
    flipkart: true,
    croma: true,
    apple: true,
    reliance: true,
  });
  const [sortBy, setSortBy] = useState("relevance");

  const handleStoreToggle = (storeId: string, enabled: boolean) => {
    const newStores = { ...enabledStores, [storeId]: enabled };
    setEnabledStores(newStores);
    onFilterChange?.({
      priceRange,
      stores: Object.keys(newStores).filter(k => newStores[k]),
      sortBy,
    });
  };

  const handlePriceChange = (min: number, max: number) => {
    setPriceRange([min, max]);
    onFilterChange?.({
      priceRange: [min, max],
      stores: Object.keys(enabledStores).filter(k => enabledStores[k]),
      sortBy,
    });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    onFilterChange?.({
      priceRange,
      stores: Object.keys(enabledStores).filter(k => enabledStores[k]),
      sortBy: value,
    });
  };

  return (
    <motion.aside
      className="sticky top-20 w-full"
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-2 pb-4 border-b border-white/10">
          <Terminal className="w-5 h-5 text-cyber-lime" />
          <h3 className="font-clash font-bold text-foreground">Filters</h3>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-3 font-inter">
            Sort By
          </label>
          <TerminalDropdown
            value={sortBy}
            options={sortOptions}
            onChange={handleSortChange}
          />
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-3 font-inter">
            Price Range
          </label>
          <DualSlider
            min={0}
            max={200000}
            minValue={priceRange[0]}
            maxValue={priceRange[1]}
            onChange={handlePriceChange}
          />
        </div>

        {/* Stores */}
        <div>
          <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-3 font-inter">
            Stores
          </label>
          <div className="space-y-1">
            {storeOptions.map((store) => (
              <ToggleSwitch
                key={store.id}
                enabled={enabledStores[store.id]}
                onChange={(enabled) => handleStoreToggle(store.id, enabled)}
                label={store.name}
                color={store.color}
              />
            ))}
          </div>
        </div>

        {/* Reset Button */}
        <button
          className="w-full py-3 text-sm font-mono text-muted-foreground border border-white/10 rounded-lg hover:border-cyber-lime/30 hover:text-foreground transition-colors"
          onClick={() => {
            setPriceRange([0, 200000]);
            setEnabledStores({
              amazon: true,
              flipkart: true,
              croma: true,
              apple: true,
              reliance: true,
            });
            setSortBy("relevance");
          }}
        >
          {">"} RESET_FILTERS
        </button>
      </div>
    </motion.aside>
  );
};

export default FilterSidebar;
