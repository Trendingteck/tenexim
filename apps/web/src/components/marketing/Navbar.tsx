"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Menu, 
  X, 
  Globe, 
  ChevronRight, 
  Moon, 
  Sun,
  Search,
  Database,
  Layers,
  Building2,
  Sparkles,
  FileBarChart,
  ShieldCheck,
  Mail,
  ChevronDown,
  Cpu
} from 'lucide-react';
import { Button } from '@tenexim/ui';

interface DropdownItem {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavLinkConfig {
  label: string;
  href?: string;
  dropdownItems?: DropdownItem[];
}

export const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isLanding = pathname === '/';

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Stripe Dropdown State Tracking
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownCoords, setDropdownCoords] = useState<{ left: number; width: number; height: number } | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [expandedMobileMenus, setExpandedMobileMenus] = useState<Record<string, boolean>>({});

  // Dynamic Refs Mapping
  const navRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Theme sync
    if (
      localStorage.getItem('color-theme') === 'dark' ||
      (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('color-theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('color-theme', 'dark');
    }
    setIsDarkMode(!isDarkMode);
  };

  const navLinks: NavLinkConfig[] = [
    {
      label: 'Data Hub',
      dropdownItems: [
        {
          title: 'Global Trade Search',
          description: 'Advanced search engine for shippers, consignees, HS codes, and countries.',
          href: '/dashboard/search',
          icon: Search,
          badge: 'New'
        },
        {
          title: 'Shipment Records',
          description: 'Granular customs manifests, Bills of Lading, and route history data.',
          href: '/dashboard/shipments',
          icon: Database
        },
        {
          title: 'Products & Commodities',
          description: 'Analyze cargo flow, pricing trends, and HS-code master databases.',
          href: '/dashboard/search',
          icon: Layers
        }
      ]
    },
    {
      label: 'Solutions',
      dropdownItems: [
        {
          title: 'Company Intelligence',
          description: 'Examine buyers, suppliers, and competitor trade networks.',
          href: '/dashboard/companies',
          icon: Building2
        },
        {
          title: 'AI Trade Copilot',
          description: 'Run deep AI-powered risk assessment and cargo summaries.',
          href: '/dashboard/copilot',
          icon: Sparkles,
          badge: 'Beta'
        },
        {
          title: 'Reports & Analytics',
          description: 'Download custom analytical trade reports and visualization graphics.',
          href: '/dashboard/reports',
          icon: FileBarChart
        }
      ]
    },
    {
      label: 'Pricing',
      href: '#pricing'
    },
    {
      label: 'Enterprise',
      dropdownItems: [
        {
          title: 'Secure API Access',
          description: 'Integrate real-time global trade feeds into CRM or ERP systems.',
          href: '#architecture',
          icon: Cpu
        },
        {
          title: 'Global Compliance',
          description: 'Screen entities for sanction lists, dual-use regulations and export bans.',
          href: '#sandbox',
          icon: ShieldCheck
        },
        {
          title: 'Custom Consulting',
          description: 'Request dedicated trade analysts to compile bespoke briefings.',
          href: '#pricing',
          icon: Mail
        }
      ]
    }
  ];

  const handleMouseEnter = (label: string) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setActiveDropdown(label);

    const buttonElement = navRefs.current[label];
    if (buttonElement && containerRef.current) {
      const buttonRect = buttonElement.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      
      const left = buttonRect.left - containerRect.left + buttonRect.width / 2;

      let width = 400;
      let height = 310;
      if (label === 'Data Hub') {
        width = 440;
        height = 320;
      } else if (label === 'Solutions') {
        width = 450;
        height = 320;
      } else if (label === 'Enterprise') {
        width = 420;
        height = 320;
      }

      setDropdownCoords({ left, width, height });
    }
  };

  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setActiveDropdown(null);
      setDropdownCoords(null);
    }, 180);
    setTimeoutId(id);
  };

  const handleNavigation = (href: string, isDropdownClick?: boolean) => {
    if (href.startsWith('#')) {
      const targetId = href.replace('#', '');
      if (isLanding) {
        const element = document.getElementById(targetId);
        element?.scrollIntoView({ behavior: 'smooth' });
      } else {
        router.push('/');
        setTimeout(() => {
          const element = document.getElementById(targetId);
          element?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    } else {
      router.push(href);
    }
    
    if (isDropdownClick || !href.startsWith('#')) {
      setIsMobileMenuOpen(false);
      setActiveDropdown(null);
      setDropdownCoords(null);
    }
  };

  const toggleMobileMenu = (label: string) => {
    setExpandedMobileMenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  return (
    <nav
      ref={containerRef}
      onMouseLeave={handleMouseLeave}
      className={`fixed left-0 right-0 z-50 mx-auto transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
        isScrolled || isMobileMenuOpen
          ? 'top-4 w-[96%] max-w-7xl rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shadow-2xl py-3.5' 
          : 'top-0 w-full rounded-none py-6 bg-transparent border-b border-transparent'
      }`}
    >
      <div className="flex flex-col w-full max-w-7xl mx-auto">
        <div className="px-6 flex items-center justify-between w-full relative">
          
          {/* Logo & Brand Identity */}
          <Link 
            href="/" 
            className="flex items-center gap-2.5 group cursor-pointer"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="w-9 h-9 bg-slate-900 dark:bg-amber-500 rounded-lg flex items-center justify-center text-white dark:text-slate-950 shadow-lg shadow-amber-500/10 group-hover:shadow-amber-500/30 transition-all duration-300 group-hover:rotate-3">
              <Globe className="w-5 h-5" />
            </div>
            <span className="font-display font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white uppercase">
              TENEX<span className="text-amber-500 dark:text-amber-400">IM</span>
            </span>
          </Link>

          {/* Desktop Navigation Anchors */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const hasDropdown = !!link.dropdownItems;
              const isSelected = activeDropdown === link.label;

              return (
                <div key={link.label} className="relative">
                  {hasDropdown ? (
                    <button
                      ref={(el) => { navRefs.current[link.label] = el; }}
                      onMouseEnter={() => handleMouseEnter(link.label)}
                      className={`flex items-center gap-1 text-xs font-black uppercase tracking-widest transition-colors py-2 focus:outline-none cursor-pointer ${
                        isSelected ? 'text-amber-500 dark:text-amber-400' : 'text-slate-500 dark:text-slate-300 hover:text-amber-500 dark:hover:text-white'
                      }`}
                    >
                      {link.label}
                      <ChevronDown 
                        size={12} 
                        className={`transition-transform duration-300 ${isSelected ? 'rotate-180 text-amber-500' : ''}`} 
                      />
                    </button>
                  ) : (
                    <button
                      ref={(el) => { navRefs.current[link.label] = el; }}
                      onMouseEnter={() => handleMouseEnter(link.label)}
                      onClick={() => link.href && handleNavigation(link.href)}
                      className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-300 hover:text-amber-500 dark:hover:text-white transition-colors py-2 focus:outline-none cursor-pointer"
                    >
                      {link.label}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Systems */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Button 
              variant="ghost" 
              onClick={() => router.push('/login')}
              className="text-slate-600 dark:text-slate-300 hover:text-amber-500 font-extrabold uppercase tracking-wider text-[10px]"
            >
              Log In
            </Button>
            <Button 
              className="group rounded-full font-black uppercase tracking-widest text-[10px] h-9 px-5 bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950 hover:bg-slate-800" 
              onClick={() => router.push('/register')}
            >
              Get Started
              <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Mobile Navigation Interface */}
          <div className="flex items-center gap-3 md:hidden">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 cursor-pointer"
              aria-label="Toggle theme"
            >
               {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button 
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* STRIPE-STYLE DROPDOWN */}
          {activeDropdown && dropdownCoords && (
            <div
              className="absolute top-full -translate-x-1/2 mt-4 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] z-50 overflow-hidden pointer-events-auto text-left"
              style={{
                left: `${dropdownCoords.left}px`,
                width: `${dropdownCoords.width}px`,
                height: `${dropdownCoords.height}px`,
              }}
              onMouseEnter={() => {
                if (timeoutId) clearTimeout(timeoutId);
              }}
            >
              <div className="p-5 w-full h-full relative">
                
                {activeDropdown === 'Data Hub' && (
                  <div className="grid gap-1 animate-fade-in select-none">
                    <div className="text-[9px] font-black uppercase text-amber-500 tracking-widest px-2 mb-2">Bilateral Cargo Data</div>
                    {navLinks[0].dropdownItems?.map((item) => {
                      const IconComp = item.icon;
                      return (
                        <button
                          key={item.title}
                          onClick={() => handleNavigation(item.href, true)}
                          className="group flex items-start gap-3.5 p-2.5 rounded-xl hover:bg-slate-100/60 dark:hover:bg-slate-900/40 text-left transition-all duration-205 focus:outline-none w-full cursor-pointer"
                        >
                          <div className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-amber-500/10 dark:group-hover:bg-amber-500/20 group-hover:text-amber-500 dark:group-hover:text-amber-400 group-hover:border-amber-500/25 transition-colors shrink-0">
                            <IconComp className="w-4.5 h-4.5" />
                          </div>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                                {item.title}
                              </span>
                              {item.badge && (
                                <span className="text-[8px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/25">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal font-medium">
                              {item.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {activeDropdown === 'Solutions' && (
                  <div className="grid gap-1 animate-fade-in select-none">
                    <div className="text-[9px] font-black uppercase text-amber-500 tracking-widest px-2 mb-2">Institutional Vectors</div>
                    {navLinks[1].dropdownItems?.map((item) => {
                      const IconComp = item.icon;
                      return (
                        <button
                          key={item.title}
                          onClick={() => handleNavigation(item.href, true)}
                          className="group flex items-start gap-3.5 p-2.5 rounded-xl hover:bg-slate-100/60 dark:hover:bg-slate-900/40 text-left transition-all duration-205 focus:outline-none w-full cursor-pointer"
                        >
                          <div className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-amber-500/10 dark:group-hover:bg-amber-500/20 group-hover:text-amber-500 dark:group-hover:text-amber-400 group-hover:border-amber-500/25 transition-colors shrink-0">
                            <IconComp className="w-4.5 h-4.5" />
                          </div>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                                {item.title}
                              </span>
                              {item.badge && (
                                <span className="text-[8px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/25">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal font-medium">
                              {item.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {activeDropdown === 'Enterprise' && (
                  <div className="grid gap-1 animate-fade-in select-none">
                    <div className="text-[9px] font-black uppercase text-amber-500 tracking-widest px-2 mb-2">Corporate Systems</div>
                    {navLinks[3].dropdownItems?.map((item) => {
                      const IconComp = item.icon;
                      return (
                        <button
                          key={item.title}
                          onClick={() => handleNavigation(item.href, true)}
                          className="group flex items-start gap-3.5 p-2.5 rounded-xl hover:bg-slate-100/60 dark:hover:bg-slate-900/40 text-left transition-all duration-205 focus:outline-none w-full cursor-pointer"
                        >
                          <div className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-amber-500/10 dark:group-hover:bg-amber-500/20 group-hover:text-amber-500 dark:group-hover:text-amber-400 group-hover:border-amber-500/25 transition-colors shrink-0">
                            <IconComp className="w-4.5 h-4.5" />
                          </div>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                                {item.title}
                              </span>
                              {item.badge && (
                                <span className="text-[8px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/25">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal font-medium">
                              {item.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

              </div>
            </div>
          )}
        </div>

        {/* Mobile Accordion Drawer */}
        <div 
          className={`md:hidden overflow-hidden border-slate-200/60 dark:border-slate-800/60 transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-[800px] border-t mt-4 opacity-100' : 'max-h-0 border-t-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex flex-col p-6 gap-4">
            {navLinks.map((link) => {
              const hasDropdown = !!link.dropdownItems;
              const isExpanded = !!expandedMobileMenus[link.label];

              return (
                <div key={link.label} className="flex flex-col">
                  {hasDropdown ? (
                    <>
                      <button
                        onClick={() => toggleMobileMenu(link.label)}
                        className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 hover:text-amber-500 dark:hover:text-white py-2 w-full text-left focus:outline-none cursor-pointer"
                      >
                        <span>{link.label}</span>
                        <ChevronDown 
                          size={16} 
                          className={`transition-transform duration-300 text-slate-500 dark:text-slate-400 ${isExpanded ? 'rotate-180 text-amber-500' : ''}`} 
                        />
                      </button>
                      
                      <div
                        className={`overflow-hidden pl-4 border-l border-slate-200 dark:border-slate-800 space-y-2 transition-all duration-200 ${
                          isExpanded ? 'max-h-[500px] mt-1 mb-2 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                        }`}
                      >
                        {link.dropdownItems?.map((item) => {
                          const IconComp = item.icon;
                          return (
                            <button
                              key={item.title}
                              onClick={() => handleNavigation(item.href, true)}
                              className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/30 text-left w-full focus:outline-none cursor-pointer"
                            >
                              <IconComp className="w-4.5 h-4.5 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                                    {item.title}
                                  </span>
                                  {item.badge && (
                                    <span className="text-[8px] font-black px-1.5 py-0.5 bg-amber-500/15 text-amber-700 dark:text-amber-400 rounded shrink-0">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal font-medium">
                                  {item.description}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={() => link.href && handleNavigation(link.href)}
                      className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 hover:text-amber-500 dark:hover:text-white py-2 w-full text-left focus:outline-none cursor-pointer"
                    >
                      {link.label}
                    </button>
                  )}
                </div>
              );
            })}
            <hr className="border-slate-200/60 dark:border-slate-800/60" />
            <div className="flex flex-col gap-3 pt-2">
              <Button 
                variant="ghost" 
                className="w-full justify-center font-extrabold text-[10px] uppercase tracking-wider h-10 border border-slate-200 dark:border-slate-800" 
                onClick={() => {
                  router.push('/login');
                  setIsMobileMenuOpen(false);
                }}
              >
                Log In
              </Button>
              <Button 
                className="w-full justify-center rounded-full font-black text-[10px] uppercase tracking-widest h-10 bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950" 
                onClick={() => {
                  router.push('/register');
                  setIsMobileMenuOpen(false);
                }}
              >
                Get Started Free
              </Button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </nav>
  );
};