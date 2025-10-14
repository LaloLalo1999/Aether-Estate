import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, Home, DollarSign, FileText, Building2, KanbanSquare } from 'lucide-react';
const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/pipeline', label: 'Sales Pipeline', icon: KanbanSquare },
  { href: '/properties', label: 'Properties', icon: Home },
  { href: '/accounting', label: 'Accounting', icon: DollarSign },
  { href: '/contracts', label: 'Contracts', icon: FileText },
];
export function Sidebar() {
  return (
    <aside className="w-64 flex-shrink-0 border-r bg-background flex flex-col">
      <div className="h-16 flex items-center justify-center border-b">
        <Building2 className="h-7 w-7 text-gold" />
        <h1 className="ml-3 text-2xl font-bold font-display text-charcoal dark:text-white">
          Aether Estate
        </h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-charcoal text-white dark:bg-white dark:text-charcoal shadow-md'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 mt-auto border-t">
        <p className="text-xs text-center text-muted-foreground">
          Built with ❤️ at Cloudflare
        </p>
      </div>
    </aside>
  );
}