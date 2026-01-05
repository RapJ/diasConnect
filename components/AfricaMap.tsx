
import React, { useState, useMemo, useEffect } from 'react';
import { Tour, Investment } from '../types';
import { MapPin, Info, ZoomIn, ZoomOut, Search, Globe, Crosshair, Navigation } from 'lucide-react';

interface AfricaMapProps {
  projects: (Tour | Investment)[];
}

const AfricaMap: React.FC<AfricaMapProps> = ({ projects }) => {
  const [hoveredProject, setHoveredProject] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [zoom, setZoom] = useState(1);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: 100, h: 100 });

  // Simplified Africa projection logic for SVG
  const getXY = (lat: number, lng: number) => {
    // lat -40 to 40, lng -20 to 55
    const x = ((lng + 20) / 75) * 100;
    const y = ((40 - lat) / 80) * 100;
    return { x, y };
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const typeMatch = selectedType === 'All' || 
        (selectedType === 'Investment' && ['Agriculture', 'Tech', 'Real Estate', 'Infrastructure'].includes((p as any).type)) ||
        (selectedType === 'Missions' && ['Evangelism', 'Tourism', 'Business'].includes((p as any).type));
      
      const searchMatch = searchQuery === '' || 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase());

      return typeMatch && searchMatch;
    });
  }, [projects, selectedType, searchQuery]);

  const handleZoom = (delta: number) => {
    setZoom(prev => {
      const next = Math.max(1, Math.min(prev + delta, 4));
      return next;
    });
  };

  const resetView = () => {
    setZoom(1);
    setSearchQuery('');
    setSelectedType('All');
  };

  return (
    <div className="relative w-full h-[600px] bg-[#EEF2FF] rounded-[3rem] overflow-hidden shadow-inner border border-indigo-100 group">
      {/* Map Search Overlay */}
      <div className="absolute top-6 left-6 z-20 flex flex-col gap-4 w-64">
        <div className="bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-xl border flex items-center gap-2">
          <Search size={16} className="text-gray-400 ml-2" />
          <input 
            type="text" 
            placeholder="Search pins..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-xs font-bold focus:ring-0 w-full placeholder:text-gray-300"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="p-1 hover:bg-gray-100 rounded-full">
              <Navigation size={12} className="text-gray-400" />
            </button>
          )}
        </div>
        
        <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-2xl shadow-xl border flex flex-col gap-1">
          {['All', 'Investment', 'Missions'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all text-left flex justify-between items-center ${selectedType === type ? 'bg-[#2E7D32] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              {type}
              <span className={`w-1.5 h-1.5 rounded-full ${selectedType === type ? 'bg-white' : 'bg-gray-200'}`}></span>
            </button>
          ))}
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-6 right-6 flex flex-col gap-3 z-10">
        <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-2xl shadow-xl border flex flex-col gap-1">
          <button 
            onClick={() => handleZoom(0.5)}
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-[#2E7D32] hover:bg-gray-50 rounded-xl transition-all"
          >
            <ZoomIn size={20} />
          </button>
          <button 
            onClick={() => handleZoom(-0.5)}
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-[#2E7D32] hover:bg-gray-50 rounded-xl transition-all"
          >
            <ZoomOut size={20} />
          </button>
          <button 
            onClick={resetView}
            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
          >
            <Crosshair size={20} />
          </button>
        </div>
      </div>

      <div className="w-full h-full overflow-hidden flex items-center justify-center">
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full transition-transform duration-700 ease-in-out cursor-grab active:cursor-grabbing"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* Detailed Africa Outline */}
          <path
            d="M35,15 C45,10 55,12 60,15 C65,18 70,25 75,35 C80,45 78,55 72,65 C68,75 62,85 55,92 C48,95 42,92 38,88 C32,82 28,72 25,60 C22,50 20,35 25,25 C28,18 32,16 35,15 Z"
            fill="#D1D5DB"
            className="transition-colors duration-500"
            stroke="#9CA3AF"
            strokeWidth="0.2"
          />
          
          {/* Pins */}
          {filteredProjects.map((p, idx) => {
            const coords = (p as Tour).coordinates || [9.0820, 8.6753];
            const { x, y } = getXY(coords[0], coords[1]);
            const isInvestment = ['Agriculture', 'Tech', 'Real Estate', 'Infrastructure'].includes((p as any).type);
            
            return (
              <g 
                key={idx} 
                className="cursor-pointer group/pin"
                onMouseEnter={() => setHoveredProject(p)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <circle cx={x} cy={y} r="3" fill={isInvestment ? '#2E7D32' : '#FFD700'} opacity="0.1" className="animate-ping" />
                <circle 
                  cx={x} cy={y} 
                  r={hoveredProject?.id === p.id ? 2 : 1.2} 
                  fill={isInvestment ? '#2E7D32' : '#FFD700'} 
                  className="transition-all duration-300 shadow-xl" 
                />
                <circle cx={x} cy={y} r="0.4" fill="#fff" />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="absolute bottom-8 right-8 bg-white/80 backdrop-blur-sm px-6 py-4 rounded-[2rem] shadow-lg border text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-8">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-[#2E7D32] shadow-sm"></span>
          <span>Capital Assets</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-[#FFD700] shadow-sm"></span>
          <span>Spiritual Missions</span>
        </div>
      </div>

      {/* Project Detail Card */}
      {hoveredProject && (
        <div className="absolute bottom-8 left-8 p-6 bg-white rounded-[2.5rem] shadow-2xl border w-80 animate-in fade-in slide-in-from-bottom-6 duration-300">
          <div className="relative h-40 mb-5 rounded-3xl overflow-hidden shadow-inner">
            <img src={hoveredProject.image} className="w-full h-full object-cover" alt="" />
            <div className="absolute top-3 left-3">
              <span className="bg-[#2E7D32] text-white text-[8px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">{(hoveredProject as any).type}</span>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <h4 className="font-black text-gray-900 text-base leading-tight">{hoveredProject.title}</h4>
            <p className="text-xs text-gray-400 font-bold flex items-center gap-2"><MapPin size={12} className="text-[#2E7D32]" /> {hoveredProject.location}</p>
          </div>
          <div className="pt-4 border-t flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Economic Influence</p>
              <p className="text-[10px] font-black text-[#2E7D32] uppercase">Verified Tier 1</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-[#2E7D32] hover:text-white text-gray-600 rounded-xl transition-all text-[10px] font-black uppercase">
              Details <Info size={12} />
            </button>
          </div>
        </div>
      )}
      
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/90 backdrop-blur-md px-6 py-2.5 rounded-full shadow-xl border">
        <Globe className="text-[#2E7D32]" size={16} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900">Interactive Atlas</span>
      </div>
    </div>
  );
};

export default AfricaMap;
