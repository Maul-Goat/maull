
import React, { useRef, useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Portfolio from './components/Portfolio';
import TopEdits from './components/TopEdits';
import Contact from './components/Contact';
import Footer from './components/Footer';
import TopoCanvas from './components/TopoCanvas';
import Admin from './components/admin/Admin';
import { supabase } from './lib/supabase';
import { Skill, PortfolioItem, TopEdit, HeroContent } from './types';

interface PortfolioSiteProps {
  skills: Skill[];
  portfolioItems: PortfolioItem[];
  topEdits: TopEdit[];
  heroContent: HeroContent | null;
}

const PortfolioSite: React.FC<PortfolioSiteProps> = ({ skills, portfolioItems, topEdits, heroContent }) => {
  const homeRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLElement>(null);
  const portfolioRef = useRef<HTMLElement>(null);
  const topEditsRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  const sections: { [key: string]: React.RefObject<HTMLElement> } = {
    home: homeRef,
    about: aboutRef,
    skills: skillsRef,
    portfolio: portfolioRef,
    'top-edits': topEditsRef,
    contact: contactRef,
  };

  return (
    <>
      <TopoCanvas />
      <Header sections={sections} />
      <main>
        <Hero ref={homeRef} data={heroContent} />
        <About ref={aboutRef} />
        <Skills ref={skillsRef} skills={skills} />
        <Portfolio ref={portfolioRef} portfolioItems={portfolioItems} />
        <TopEdits ref={topEditsRef} edits={topEdits} />
        <Contact ref={contactRef} />
      </main>
      <Footer />
    </>
  );
};


const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [topEdits, setTopEdits] = useState<TopEdit[]>([]);
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);

    const fetchData = async () => {
      try {
        const { data: skillsData, error: skillsError } = await supabase.from('skills').select('*').order('id');
        if (skillsError) throw skillsError;
        setSkills(skillsData || []);

        const { data: portfolioData, error: portfolioError } = await supabase.from('portfolio_items').select('*').order('id');
        if (portfolioError) throw portfolioError;
        setPortfolioItems(portfolioData || []);

        const { data: editsData, error: editsError } = await supabase.from('top_edits').select('*').order('id');
        if (editsError) throw editsError;
        setTopEdits(editsData || []);

        const { data: heroData, error: heroError } = await supabase.from('hero_content').select('*').single();
        if (heroError) throw heroError;
        setHeroContent(heroData);


      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (route === '#admin') {
    return <Admin />;
  }

  return <PortfolioSite skills={skills} portfolioItems={portfolioItems} topEdits={topEdits} heroContent={heroContent} />;
};

export default App;
