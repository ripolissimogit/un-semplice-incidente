import { Hero } from './components/Hero';
import { About } from './components/About';
import { CinemaFinder } from './components/CinemaFinder';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <About />
      <CinemaFinder />
      <Footer />
    </div>
  );
}
