import React from 'react';
import { motion } from 'motion/react';
import { Home, ShoppingBag, Radio, PawPrint, User, ShieldAlert } from 'lucide-react';

export type NavTab = 'home' | 'orders' | 'sos' | 'pets' | 'profile';

interface BottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  activeOrdersCount?: number;
  activeSosCount?: number;
  isEmergencyMode?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  activeOrdersCount = 1,
  activeSosCount = 2,
  isEmergencyMode = false,
}) => {
  const tabs = [
    {
      id: 'home' as NavTab,
      label: 'Início',
      icon: Home,
    },
    {
      id: 'orders' as NavTab,
      label: 'Pedidos',
      icon: ShoppingBag,
      badge: activeOrdersCount > 0 ? activeOrdersCount : undefined,
    },
    {
      id: 'sos' as NavTab,
      label: 'iPet SOS',
      icon: isEmergencyMode ? ShieldAlert : Radio,
      badge: activeSosCount > 0 ? `${activeSosCount}` : undefined,
      isDanger: true,
    },
    {
      id: 'pets' as NavTab,
      label: 'iPet ID',
      icon: PawPrint,
    },
    {
      id: 'profile' as NavTab,
      label: 'Perfil',
      icon: User,
    },
  ];

  return (
    <nav
      aria-label="Navegação Principal do iPet"
      className={`fixed bottom-0 left-0 right-0 z-40 border-t pb-safe pt-1.5 transition-colors duration-300 ${
        isEmergencyMode
          ? 'bg-[#15262C]/95 border-amber-500/20 text-[#E8F1F2]'
          : 'bg-white/95 backdrop-blur-md border-stone-200/80 text-[#22333B]'
      } shadow-[0_-4px_20px_rgba(0,0,0,0.06)]`}
    >
      <div className="max-w-lg mx-auto px-2 flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center justify-center flex-1 h-full min-w-[56px] py-1 cursor-pointer select-none group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A896]"
            >
              <div className="relative">
                {/* Active Indicator Backdrop */}
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className={`absolute -inset-2 rounded-2xl ${
                      tab.isDanger
                        ? 'bg-[#FDE8E9]'
                        : isEmergencyMode
                        ? 'bg-[#00A896]/20'
                        : 'bg-[#E4F6F3]'
                    }`}
                    transition={{
                      type: 'spring',
                      stiffness: 450,
                      damping: 32,
                    }}
                  />
                )}

                {/* Icon */}
                <motion.div
                  animate={{
                    scale: isActive ? 1.12 : 1,
                    y: isActive ? -1 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="relative z-10"
                >
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      isActive
                        ? tab.isDanger
                          ? 'text-[#E63946]'
                          : isEmergencyMode
                          ? 'text-[#3AD6C0]'
                          : 'text-[#00A896]'
                        : isEmergencyMode
                        ? 'text-stone-400 group-hover:text-stone-200'
                        : 'text-[#6B7A83] group-hover:text-[#22333B]'
                    }`}
                  />
                </motion.div>

                {/* Badge (ex: tracking de pedido ou alertas de desaparecidos) */}
                {tab.badge && (
                  <span
                    className={`absolute -top-1.5 -right-3 px-1.5 py-0.5 text-[10px] font-bold rounded-full border border-white z-20 ${
                      tab.isDanger
                        ? 'bg-[#E63946] text-white animate-pulse'
                        : 'bg-[#FF9F1C] text-white'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[11px] font-semibold mt-1 transition-all z-10 ${
                  isActive
                    ? tab.isDanger
                      ? 'text-[#E63946] font-bold'
                      : isEmergencyMode
                      ? 'text-[#3AD6C0] font-bold'
                      : 'text-[#00A896] font-bold'
                    : isEmergencyMode
                    ? 'text-stone-400'
                    : 'text-[#6B7A83]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
