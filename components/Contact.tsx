
import React, { forwardRef, useRef, useState } from 'react';
import useInView from '../hooks/useInView';
import { InstagramIcon, LinkedinIcon, GithubIcon, MailIcon, TiktokIcon } from './Icons';
import { supabase } from '../lib/supabase';

const socialLinks = [
    { href: "https://www.instagram.com/kemett._", label: "Instagram", icon: <InstagramIcon />, color: "#E4405F" },
    { href: "https://www.linkedin.com/in/achmad-maulana-a85a681b3", label: "LinkedIn", icon: <LinkedinIcon />, color: "#0077B5" },
    { href: "https://github.com/Maul-Goat", label: "GitHub", icon: <GithubIcon />, color: "#333333" },
    { href: "mailto:achmadmaulanaxx@gmail.com", label: "Email", icon: <MailIcon />, color: "#D44638" },
    { href: "https://www.tiktok.com/@kaycee.onw", label: "TikTok", icon: <TiktokIcon />, color: "#000000" }
];

const Contact = forwardRef<HTMLElement>((props, ref) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    try {
        const { error } = await supabase
            .from('messages')
            .insert([{ name, email, message }]);

        if (error) throw error;
        
        alert('Thank you! Your message has been sent.');
        form.reset();

    } catch (error) {
        console.error('Error sending message:', error);
        alert('Sorry, there was an error sending your message. Please try again.');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <section ref={ref} id="contact" className="py-32 relative z-10">
      <div ref={sectionRef} className={`container w-[90%] max-w-4xl mx-auto text-center px-5 slide-in-bottom ${isInView ? 'in-view' : ''}`}>
        <h2 className="mb-12 text-5xl font-bold relative text-[#5c3d2e] after:content-[''] after:h-[5px] after:w-[80px] after:bg-gradient-to-r after:from-[#FFB6D9] after:to-[#FF85B5] after:absolute after:bottom-[-15px] after:left-1/2 after:-translate-x-1/2 after:rounded-md animate-expandWidth">
          Let's Create Together
        </h2>
        <p className="text-xl mb-8 text-[#555] leading-loose">
          Have a project in mind? Let's collaborate and bring your vision to life.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-7 max-w-2xl mx-auto my-12 p-10 bg-white/10 rounded-3xl backdrop-blur-md border border-white/20 transition-opacity duration-300" style={{ opacity: isSubmitting ? 0.5 : 1 }}>
          <input type="text" name="name" className="p-5 border-2 border-white/25 rounded-xl bg-white/5 text-[#333] font-sans text-base transition-all duration-300 focus:outline-none focus:border-[#FFB6D9] focus:bg-white/10 focus:shadow-[0_0_25px_rgba(255,181,217,0.3)]" placeholder="Your Name" required />
          <input type="email" name="email" className="p-5 border-2 border-white/25 rounded-xl bg-white/5 text-[#333] font-sans text-base transition-all duration-300 focus:outline-none focus:border-[#FFB6D9] focus:bg-white/10 focus:shadow-[0_0_25px_rgba(255,181,217,0.3)]" placeholder="Your Email" required />
          <textarea name="message" className="p-5 border-2 border-white/25 rounded-xl bg-white/5 text-[#333] font-sans text-base transition-all duration-300 focus:outline-none focus:border-[#FFB6D9] focus:bg-white/10 focus:shadow-[0_0_25px_rgba(255,181,217,0.3)]" placeholder="Your Message" rows={5} required></textarea>
          <button type="submit" disabled={isSubmitting} className="mt-2 w-full justify-center inline-flex items-center gap-3 bg-gradient-to-br from-[#FFB6D9] to-[#FF85B5] text-white py-4 px-10 rounded-full no-underline font-semibold transition-all duration-300 shadow-[0_8px_20px_rgba(255,133,181,0.3)] relative overflow-hidden border-none cursor-pointer hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(255,133,181,0.5)] disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
        
        <div className="flex justify-center gap-8 mt-12 flex-wrap">
          {socialLinks.map((link, index) => (
            <a 
              key={link.href}
              href={link.href} 
              className="w-12 h-12 flex items-center justify-center rounded-full text-white no-underline transition-all duration-300 shadow-md animate-socialFloat hover:-translate-y-3 hover:scale-110 hover:shadow-lg" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label={link.label} 
              style={{ backgroundColor: link.color, animationDelay: `${index * 0.2}s` }}
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
});

export default Contact;
