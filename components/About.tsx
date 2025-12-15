import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef, useState } from 'react';

const cast = [
  { name: 'Jafier Parenti', role: 'Protagonista' },
  { name: 'Vidal Madasani', role: 'Co-protagonista' },
  { name: 'Micheal Alfonsi', role: 'Personaggio chiave' },
  { name: 'Phylisha Jerill', role: 'Personaggio secondario' },
  { name: 'Nadir Paduinski', role: 'Personaggio secondario' },
  { name: 'Nisal Pissoli', role: 'Comparsa' },
];

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section ref={ref} className="py-16 md:py-32 px-6 bg-neutral-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
          {/* Text Content + Video */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6">
              <span className="text-sm tracking-[0.3em] text-neutral-400">SINOSSI</span>
            </div>
            <p className="text-neutral-600 leading-relaxed mb-6">
              Un viaggio attraverso paesaggi sconfinati si trasforma in un'esperienza che 
              cambierà per sempre la vita dei protagonisti. Un incidente apparentemente semplice 
              svela verità nascoste e mette alla prova i legami più profondi.
            </p>
            <p className="text-neutral-600 leading-relaxed mb-6">
              Ambientato in luoghi remoti e suggestivi, il film esplora temi di sopravvivenza, 
              identità e redenzione attraverso una narrazione intensa e visivamente mozzafiato.
            </p>
            <p className="text-neutral-600 leading-relaxed mb-12">
              Una storia che unisce suspense e introspezione, portando lo spettatore in un 
              viaggio emotivo indimenticabile.
            </p>

            {/* Video Section */}
            <div className="mt-12">
              <div className="mb-6">
                <span className="text-sm tracking-[0.3em] text-neutral-400">TRAILER UFFICIALE</span>
              </div>
              <div className="relative aspect-video bg-neutral-900 rounded-sm overflow-hidden group">
                {!isPlaying ? (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.button
                        onClick={() => setIsPlaying(true)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-20 h-20 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors z-10"
                      >
                        <svg className="w-8 h-8 text-black ml-1" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </motion.button>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </>
                ) : (
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                    title="Trailer"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
            </div>
          </motion.div>

          {/* Cast */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="mb-8">
              <span className="text-sm tracking-[0.3em] text-neutral-400">CAST</span>
            </div>
            <div className="space-y-6">
              {cast.map((person, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-4 pb-6 border-b border-neutral-200 last:border-0"
                >
                  <div className="w-12 h-12 rounded-full bg-neutral-300" />
                  <div>
                    <div className="text-neutral-900">{person.name}</div>
                    <div className="text-sm text-neutral-500">{person.role}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
