import { motion, AnimatePresence } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { Search, MapPin, Clock, Calendar as CalendarIcon, Navigation, ChevronRight, X } from 'lucide-react';
import { format, addDays, isSameDay } from "date-fns";
import { it } from "date-fns/locale";

import { cn } from "./ui/utils";
import { Button } from "./ui/button";

const cinemas = [
  { name: 'Nazionale', city: 'Milano', region: 'Lombardia', times: ['14:30', '18:20', '21:15'] },
  { name: 'Eliseo Multisala', city: 'Milano', region: 'Lombardia', times: ['17:00', '21:00'] },
  { name: 'Anteo', city: 'Milano', region: 'Lombardia', times: ['15:45', '17:40', '20:40'] },
  { name: 'Orfeo', city: 'Milano', region: 'Lombardia', times: ['16:10', '19:10', '22:00'] },
  { name: 'Ducale', city: 'Milano', region: 'Lombardia', times: ['14:30', '16:10', '18:00'] },
  { name: 'Multisala Giussano', city: 'Giussano', region: 'Lombardia', times: ['14:15', '18:10', '20:55'] },
  { name: 'Nuovo Olimpia', city: 'Milano', region: 'Lombardia', times: ['19:30'] },
  { name: 'Mediolanum Multisala', city: 'Milano', region: 'Lombardia', times: ['16:00', '18:00'] },
  { name: 'Capitol Anteo', city: 'Sesto San Giovanni', region: 'Lombardia', times: ['14:30', '20:45'] },
  { name: 'Arcadia Melzo', city: 'Melzo', region: 'Lombardia', times: ['21:00'] },
  { name: 'Teatro Evaristo', city: 'Milano', region: 'Lombardia', times: ['20:20'] },
  { name: 'Mediolanum Lux Arena', city: 'Milano', region: 'Lombardia', times: ['15:40', '18:50'] },
  { name: 'Quattro Fontane', city: 'Milano', region: 'Lombardia', times: ['16:30', '19:15', '21:15'] },
  { name: 'Adriano', city: 'Roma', region: 'Lazio', times: ['16:00', '19:30', '22:00'] },
  { name: 'Barberini', city: 'Roma', region: 'Lazio', times: ['17:15', '20:45'] },
];

export function CinemaFinder() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashStep, setSlashStep] = useState<'region' | 'city'>('region');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  
  // Date Picker Logic
  const [isDateOpen, setIsDateOpen] = useState(false);
  const nextDays = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  // Derive unique regions and cities
  const regions = Array.from(new Set(cinemas.map(c => c.region))).sort();
  const getCitiesByRegion = (region: string) => 
    Array.from(new Set(cinemas.filter(c => c.region === region).map(c => c.city))).sort();

  // Handle Input Change for Slash Command
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.endsWith('/')) {
      setShowSlashMenu(true);
      setSlashStep('region');
      setSelectedRegion(null);
    } else if (value === '') {
      setShowSlashMenu(false);
      setSelectedRegion(null);
    }
  };

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
    setSearchQuery(`${region} / `);
    setSlashStep('city');
    // Keep menu open for city selection
  };

  const handleCitySelect = (city: string) => {
    setSearchQuery(`${selectedRegion} / ${city}`);
    setShowSlashMenu(false);
  };

  const handleGeoLocation = () => {
    if ("geolocation" in navigator) {
      // Mocking a location finding for demo purposes
      // In a real app, we would use the coordinates to sort/filter
      setSearchQuery("Milano");
      setShowSlashMenu(false);
    }
  };

  const filteredCinemas = cinemas.filter(cinema => {
    const query = searchQuery.toLowerCase();
    
    // Parse "Region / City" format
    if (query.includes('/')) {
      const parts = query.split('/').map(s => s.trim());
      const regionFilter = parts[0]?.toLowerCase();
      const cityFilter = parts[1]?.toLowerCase();

      if (cityFilter) {
        return cinema.city.toLowerCase() === cityFilter;
      }
      if (regionFilter) {
        return cinema.region.toLowerCase() === regionFilter;
      }
    }

    return (
      cinema.name.toLowerCase().includes(query) ||
      cinema.city.toLowerCase().includes(query) ||
      cinema.region.toLowerCase().includes(query)
    );
  });

  return (
    <section id="cinema-finder" ref={ref} className="py-16 md:py-32 px-6 bg-white relative z-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-sm tracking-[0.3em] text-neutral-400 mb-4 block">
            ORA AL CINEMA
          </span>
          <h2 className="text-4xl md:text-5xl text-neutral-900 mb-8">
            Trova la tua sala
          </h2>
          
          {/* Enhanced Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative flex items-center bg-white border border-neutral-200 focus-within:border-neutral-900 focus-within:ring-1 focus-within:ring-neutral-900 transition-all shadow-sm group">
              <Search className="absolute left-4 w-5 h-5 text-neutral-400 group-focus-within:text-neutral-900 transition-colors" />
              
              <input
                type="text"
                placeholder="Cerca città, cinema o digita '/' per filtrare..."
                value={searchQuery}
                onChange={handleInputChange}
                className="w-full pl-12 pr-32 py-4 bg-transparent border-none focus:outline-none text-neutral-900 placeholder:text-neutral-400"
              />

              <div className="absolute right-2 flex items-center gap-1">
                {/* Date Picker Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsDateOpen(!isDateOpen)}
                  className={cn(
                    "h-10 w-10 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50 transition-colors",
                    (isDateOpen || date) && "text-neutral-900 bg-neutral-50"
                  )}
                >
                  <CalendarIcon className="w-5 h-5" />
                </Button>

                {/* Geolocation */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleGeoLocation}
                  className="h-10 w-10 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50"
                  title="Usa la mia posizione"
                >
                  <Navigation className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Date Selection Strip */}
            <AnimatePresence>
              {isDateOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-7 gap-2">
                    {nextDays.map((d, i) => {
                      const isSelected = date && isSameDay(date, d);
                      return (
                        <motion.button
                          key={i}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => {
                            if (isSelected) {
                              setDate(undefined);
                            } else {
                              setDate(d);
                            }
                          }}
                          className={cn(
                            "flex flex-col items-center justify-center py-3 rounded-sm transition-all border",
                            isSelected 
                              ? "bg-neutral-900 text-white border-neutral-900" 
                              : "bg-white text-neutral-500 border-neutral-100 hover:border-neutral-300 hover:text-neutral-900"
                          )}
                        >
                          <span className="text-[10px] uppercase tracking-wider mb-1">
                            {format(d, "EEE", { locale: it })}
                          </span>
                          <span className="text-lg font-medium">
                            {format(d, "d")}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Display Selected Date Indicator (only when strip is closed) */}
            <AnimatePresence>
              {date && !isDateOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute -top-10 right-0 text-sm text-neutral-500 flex items-center gap-2"
                >
                  <span className="font-medium text-neutral-900">Data selezionata:</span>
                  {format(date, "d MMMM yyyy", { locale: it })}
                  <button 
                    onClick={() => setDate(undefined)}
                    className="ml-2 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Slash Command Menu */}
            <AnimatePresence>
              {showSlashMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200 shadow-xl rounded-sm overflow-hidden z-50"
                >
                  <div className="bg-neutral-50 px-4 py-2 border-b border-neutral-100 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    {slashStep === 'region' ? 'Seleziona Regione' : `Città in ${selectedRegion}`}
                  </div>
                  <div className="max-h-60 overflow-y-auto p-1">
                    {slashStep === 'region' ? (
                      regions.map(region => (
                        <button
                          key={region}
                          onClick={() => handleRegionSelect(region)}
                          className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-neutral-50 rounded-sm group transition-colors"
                        >
                          <span className="text-neutral-700 group-hover:text-black">{region}</span>
                          <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500" />
                        </button>
                      ))
                    ) : (
                      getCitiesByRegion(selectedRegion!).map(city => (
                        <button
                          key={city}
                          onClick={() => handleCitySelect(city)}
                          className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-neutral-50 rounded-sm group transition-colors"
                        >
                          <span className="text-neutral-700 group-hover:text-black">{city}</span>
                          <MapPin className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500" />
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Cinema List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-1"
        >
          {filteredCinemas.length > 0 ? (
            filteredCinemas.map((cinema, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.03 }}
                className="group"
              >
                <div className="border-b border-neutral-100 py-6 hover:bg-neutral-50 transition-colors px-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <MapPin className="w-4 h-4 text-neutral-400" />
                        <h3 className="text-neutral-900">{cinema.name}</h3>
                        {/* Region Badge */}
                        <span className="text-xs px-2 py-0.5 bg-neutral-100 text-neutral-500 rounded-full">
                          {cinema.region}
                        </span>
                      </div>
                      <div className="text-sm text-neutral-500 ml-7">{cinema.city}</div>
                    </div>
                    
                    <div className="flex items-center gap-3 ml-7 md:ml-0">
                      <Clock className="w-4 h-4 text-neutral-400 shrink-0" />
                      <div className="flex flex-wrap gap-3">
                        {cinema.times.map((time, timeIndex) => (
                          <motion.button
                            key={timeIndex}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white transition-all text-sm"
                          >
                            {time}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 text-neutral-400"
            >
              Nessun cinema trovato
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
