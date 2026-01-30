'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassPanel } from './GlassPanel';

interface Member {
  id: string;
  name: string;
  role: string;
  bio: string;
}

const members: Member[] = [
  { id: '1', name: 'Elena Vasquez', role: 'Creative Director', bio: 'Elena brings 15 years of experience in visual arts and brand strategy. Her work explores the intersection of traditional craftsmanship and digital innovation.' },
  { id: '2', name: 'Marcus Chen', role: 'Technical Lead', bio: 'A creative technologist who bridges art and code. Marcus specializes in generative systems, WebGL, and interactive installations.' },
  { id: '3', name: 'Sofia Andersson', role: 'Sound Designer', bio: 'Sofia crafts sonic landscapes that evoke emotion and space. Her compositions blend field recordings, synthesis, and acoustic instrumentation.' },
  { id: '4', name: 'James Okonkwo', role: 'Motion Designer', bio: 'James brings static concepts to life through movement. His motion work has been featured in campaigns for Nike, Spotify, and MoMA.' },
  { id: '5', name: 'Yuki Tanaka', role: 'Installation Artist', bio: 'Yuki creates large-scale installations that transform spaces and invite participation. Her work examines human presence and environmental response.' },
  { id: '6', name: 'Alex Rivera', role: 'UX Designer', bio: 'Alex designs digital experiences with empathy and precision. With a background in psychology, they create interfaces that feel intuitive.' },
  { id: '7', name: 'Luna Park', role: 'Photographer', bio: 'Luna captures moments that tell stories. Her documentary and conceptual photography explores themes of identity, place, and memory.' },
];

interface AboutSectionProps {
  visible: boolean;
}

export function AboutSection({ visible }: AboutSectionProps) {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true);
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <>
      <div 
        ref={sectionRef}
        id="about"
        className="min-h-screen flex items-center justify-center py-24 px-6"
      >
        <div className="max-w-6xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <GlassPanel variant="heavy" padding="lg" className="relative overflow-hidden">
              {/* Decorative accent blob */}
              <div 
                className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(20, 184, 166, 0.3) 0%, transparent 70%)' }}
              />
              
              <div className="relative z-10">
                {/* Header */}
                <div className="mb-12">
                  <span className="text-accent-cyan text-sm font-medium tracking-wider uppercase mb-4 block">
                    About Us
                  </span>
                  <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6 text-mk-text">
                    We are multikunst
                  </h2>
                  <p className="text-lg md:text-xl text-mk-text-secondary leading-relaxed max-w-3xl">
                    A creative collective dedicated to exploring the boundaries of art, design, and technology. 
                    We bring together diverse talents to create experiences that inspire, challenge, and connect.
                  </p>
                </div>

                {/* Philosophy */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                  <div>
                    <h3 className="text-xl font-medium text-mk-text mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-accent-violet" />
                      Our Philosophy
                    </h3>
                    <p className="text-mk-text-secondary leading-relaxed">
                      We believe in the power of collaboration and the magic that happens when different perspectives converge. 
                      Every project is an opportunity to push creative boundaries.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-mk-text mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-accent-coral" />
                      What We Do
                    </h3>
                    <p className="text-mk-text-secondary leading-relaxed">
                      From interactive installations and digital experiences to brand identities and motion design, 
                      we work across mediums to bring ideas to life.
                    </p>
                  </div>
                </div>

                {/* Members */}
                <div>
                  <h3 className="text-lg font-medium text-mk-text mb-4">The Collective</h3>
                  <div className="flex flex-wrap gap-3">
                    {members.map((member, index) => (
                      <motion.button
                        key={member.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ 
                          duration: 0.4, 
                          delay: 0.4 + index * 0.05,
                          ease: [0.25, 0.1, 0.25, 1] 
                        }}
                        onClick={() => setSelectedMember(member)}
                        className="glass-button group flex items-center gap-3"
                      >
                            <div className="w-8 h-8 rounded-full bg-[rgba(28,28,28,0.08)] flex items-center justify-center text-xs font-medium">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-medium text-mk-text group-hover:text-accent-cyan transition-colors">
                            {member.name}
                          </div>
                          <div className="text-xs text-mk-text-muted">
                            {member.role}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      </div>

      {/* Member Modal */}
      <AnimatePresence>
        {selectedMember && (
          <MemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

function MemberModal({ member, onClose }: { member: Member; onClose: () => void }) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-backdrop"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
      >
        <GlassPanel 
          variant="heavy" 
          padding="lg" 
          className="max-w-md w-full pointer-events-auto relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[rgba(28,28,28,0.08)] transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="w-14 h-14 rounded-full bg-[rgba(28,28,28,0.08)] flex items-center justify-center text-lg font-medium mb-5">
            {member.name.split(' ').map(n => n[0]).join('')}
          </div>
          
          <h2 className="text-2xl font-semibold mb-1">{member.name}</h2>
          <p className="text-accent-cyan font-medium mb-4">{member.role}</p>
          <p className="text-mk-text-secondary leading-relaxed">{member.bio}</p>
        </GlassPanel>
      </motion.div>
    </>
  );
}
