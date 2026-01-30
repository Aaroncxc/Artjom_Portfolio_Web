'use client';

import { GlassPanel } from './GlassPanel';
import { ProjectType } from '@/lib/types';

interface FiltersBarProps {
  types: { value: ProjectType | 'all'; label: string }[];
  tags: string[];
  selectedType: ProjectType | 'all';
  selectedTag: string;
  onTypeChange: (type: ProjectType | 'all') => void;
  onTagChange: (tag: string) => void;
  projectCount: number;
  currentIndex: number;
}

export function FiltersBar({
  types,
  tags,
  selectedType,
  selectedTag,
  onTypeChange,
  onTagChange,
  projectCount,
  currentIndex,
}: FiltersBarProps) {
  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-40 max-w-4xl w-full px-4">
      <GlassPanel variant="default" padding="none" className="p-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Type filters */}
          <div className="flex flex-wrap gap-2">
            {types.map((type) => (
              <button
                key={type.value}
                onClick={() => onTypeChange(type.value)}
                className={`px-3 py-1.5 text-sm rounded-full transition-all duration-175 ${
                  selectedType === type.value
                    ? 'bg-[rgba(20,184,166,0.15)] text-accent-cyan border border-[rgba(20,184,166,0.3)]'
                    : 'text-mk-text-secondary hover:text-mk-text hover:bg-[rgba(28,28,28,0.06)] border border-transparent'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Project counter */}
          <div className="flex items-center gap-4">
            {/* Tag dropdown or chips */}
            {tags.length > 0 && (
              <select
                value={selectedTag}
                onChange={(e) => onTagChange(e.target.value)}
                className="bg-[rgba(255,255,255,0.7)] border border-[rgba(28,28,28,0.1)] rounded-full px-3 py-1.5 text-sm text-mk-text-secondary focus:outline-none focus:border-accent-cyan appearance-none cursor-pointer"
                style={{ backgroundImage: 'none' }}
              >
                <option value="all" className="bg-white">All Tags</option>
                {tags.map((tag) => (
                  <option key={tag} value={tag} className="bg-white">{tag}</option>
                ))}
              </select>
            )}
            
            {/* Index indicator */}
            <div className="text-sm font-mono text-mk-text-muted">
              <span className="text-accent-violet">{String(currentIndex + 1).padStart(2, '0')}</span>
              <span className="mx-1">/</span>
              <span>{String(projectCount).padStart(2, '0')}</span>
            </div>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
