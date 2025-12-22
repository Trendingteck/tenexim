import * as React from 'react';
import {
  ShieldCheck,
  BarChart2,
  Settings,
  Database,
  Bell,
  User,
  LayoutDashboard,
  Users2,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';
import "./globals.css";

export const metadata = {
  title: 'Tenexim Admin',
  description: 'Admin panel for Tenexim platform',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans">
          {/* Sidebar */}
          <aside className="w-80 bg-slate-900 border-r border-slate-800 p-8 flex flex-col fixed inset-y-0 z-50">
            <div className="flex items-center space-x-3 mb-16">
              <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
                <ShieldCheck className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight font-display">TENEXIM <span className="text-brand-500 font-bold text-xs uppercase ml-1">Admin</span></span>
            </div>

            <nav className="flex-1 space-y-2">
              <AdminNavLink href="/dashboard" icon={<LayoutDashboard />} label="Overview & Data" active />
              <AdminNavLink href="/governance" icon={<Database />} label="Data Governance" />
              <AdminNavLink href="/users" icon={<Users2 />} label="User Management" />
              <AdminNavLink href="/revenue" icon={<DollarSign />} label="Revenue & Billing" />
              <AdminNavLink href="/settings" icon={<Settings />} label="System Settings" />
            </nav>

            <div className="mt-auto p-6 bg-slate-800/50 rounded-3xl border border-slate-700/50">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center">
                  <User className="text-white w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Super Admin</p>
                  <p className="text-[10px] text-slate-400 font-black uppercase">Level 10 Access</p>
                </div>
              </div>
              <button className="w-full py-3 bg-red-500/10 text-red-500 rounded-xl text-sm font-bold hover:bg-red-500/20 transition-all border border-red-500/20">
                Sign Out Securely
              </button>
            </div>
          </aside>

          {/* Main Area */}
          <main className="flex-1 ml-80 p-12">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

function AdminNavLink({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link href={href} className={`flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all font-bold ${active ? 'bg-brand-500 text-white shadow-xl shadow-brand-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
      {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-5 h-5' })}
      <span>{label}</span>
    </Link>
  )
}
