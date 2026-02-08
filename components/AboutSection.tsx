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
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  if (!visible) return null;

  return (
    <>
      <div 
        ref={sectionRef}
        id="about"
        className="pt-4 pb-12 px-6"
      >
        <div className="max-w-7xl w-full mx-auto">
          {/* Accordion Header */}
          <button
            type="button"
            onClick={() => setIsOpen(prev => !prev)}
            className="w-full px-6 py-5 bg-[rgba(255,255,255,0.7)] rounded-2xl border border-[rgba(28,28,28,0.08)] cursor-pointer flex items-center justify-between shadow-[0_2px_12px_rgba(28,28,28,0.04)] hover:bg-[rgba(255,255,255,0.85)] transition-colors"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">👥</span>
              <div className="text-left">
                <h2 className="text-xl md:text-2xl font-semibold text-mk-text">
                  About Us
                </h2>
                <p className="text-sm text-mk-text-secondary mt-0.5">
                  Learn more about multikunst and our team
                </p>
              </div>
            </div>
            <span 
              className={`text-[rgba(28,28,28,0.5)] text-lg transition-transform duration-300 ${
                isOpen ? 'rotate-180' : 'rotate-0'
              }`}
            >
              ▼
            </span>
          </button>

          {/* Accordion Content with smooth CSS Grid animation */}
          <div 
            className="grid transition-all duration-300 ease-out"
            style={{ 
              gridTemplateRows: isOpen ? '1fr' : '0fr',
              marginTop: isOpen ? 16 : 0,
            }}
          >
            <div className="overflow-hidden">
              <motion.div
                initial={false}
                animate={{ 
                  opacity: isOpen ? 1 : 0,
                  scale: isOpen ? 1 : 0.98,
                }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <GlassPanel variant="heavy" padding="lg" className="relative overflow-hidden">
                  {/* Decorative accent blob */}
                  <div 
                    className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(20, 184, 166, 0.3) 0%, transparent 70%)' }}
                  />
                  
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="mb-10">
                      <h3 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4 text-mk-text">
                        We are multikunst
                      </h3>
                      <p className="text-lg text-mk-text-secondary leading-relaxed max-w-3xl">
                        A creative collective dedicated to exploring the boundaries of art, design, and technology. 
                        We bring together diverse talents to create experiences that inspire, challenge, and connect.
                      </p>
                    </div>

                    {/* Philosophy */}
                    <div className="grid md:grid-cols-2 gap-6 mb-10">
                      <div className="p-5 rounded-xl bg-[rgba(28,28,28,0.02)] border border-[rgba(28,28,28,0.06)]">
                        <h4 className="text-lg font-medium text-mk-text mb-2 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-accent-violet" />
                          Our Philosophy
                        </h4>
                        <p className="text-mk-text-secondary text-sm leading-relaxed">
                          We believe in the power of collaboration and the magic that happens when different perspectives converge. 
                          Every project is an opportunity to push creative boundaries.
                        </p>
                      </div>
                      <div className="p-5 rounded-xl bg-[rgba(28,28,28,0.02)] border border-[rgba(28,28,28,0.06)]">
                        <h4 className="text-lg font-medium text-mk-text mb-2 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-accent-coral" />
                          What We Do
                        </h4>
                        <p className="text-mk-text-secondary text-sm leading-relaxed">
                          From interactive installations and digital experiences to brand identities and motion design, 
                          we work across mediums to bring ideas to life.
                        </p>
                      </div>
                    </div>

                    {/* Members */}
                    <div>
                      <h4 className="text-lg font-medium text-mk-text mb-4">The Collective</h4>
                      <div className="flex flex-wrap gap-3">
                        {members.map((member) => (
                          <button
                            key={member.id}
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
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </GlassPanel>
              </motion.div>
            </div>
          </div>
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
            className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center rounded-full hover:bg-[rgba(28,28,28,0.08)] transition-colors"
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
