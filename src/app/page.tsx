import Link from "next/link";
import { FilePlus, LayoutDashboard, Settings, ShieldCheck, ArrowRight, Zap, Database, Download } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[700px] bg-gradient-to-b from-indigo-50/50 via-white to-transparent -z-10 rounded-full blur-3xl opacity-50" />
      
      {/* Hero Section */}
      <section className="container text-center pt-32 pb-20 fade-in flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-sm font-bold mb-8 shadow-sm shadow-indigo-100 border border-indigo-100/50">
          <ShieldCheck size={16} />
          SSKRU Evaluation System Ready
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9]">
          Gen<span className="text-indigo-600">E</span>Doc
        </h1>
        <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
          The ultimate engine to transform Word templates into 
          <span className="text-indigo-600 font-bold"> high-fidelity digital forms </span>
          with automated PDF delivery.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
          <Link href="/dashboard" className="btn btn-primary px-10 py-5 text-xl shadow-xl shadow-indigo-200">
            Go to Dashboard <ArrowRight size={22} />
          </Link>
          <Link href="/templates/upload" className="btn btn-outline px-10 py-5 text-xl bg-white">
             Quick Upload
          </Link>
        </div>
      </section>

      {/* Experimental Features Section */}
      <section className="py-24 relative">
        <div className="container">
          <div className="flex items-center gap-4 mb-16">
             <div className="h-px bg-slate-200 flex-1" />
             <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 px-4">Experimental System Capabilities</h2>
             <div className="h-px bg-slate-200 flex-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-10 border-none ring-1 ring-slate-100 shadow-sm hover:shadow-2xl hover:ring-indigo-200 transition-all group bg-white">
              <div className="bg-amber-100 text-amber-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all transform duration-300">
                <Zap size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Dynamic Extraction</h3>
              <p className="text-slate-500 leading-relaxed">
                Automatically scans Word XML for curly bracket placeholders without manual mapping or coding. Just upload and go.
              </p>
            </div>

            <Link href="/dashboard" className="card p-10 border-none ring-1 ring-slate-100 shadow-sm hover:shadow-2xl hover:ring-indigo-200 transition-all group bg-white">
              <div className="bg-indigo-100 text-indigo-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all transform duration-300">
                <LayoutDashboard size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Centralized Hub</h3>
              <p className="text-slate-500 leading-relaxed">
                Keep track of all active templates and submission history in a unified, premium dashboard designed for professionals.
              </p>
            </Link>

            <div className="card p-10 border-none ring-1 ring-slate-100 shadow-sm hover:shadow-2xl hover:ring-indigo-200 transition-all group bg-white">
              <div className="bg-emerald-100 text-emerald-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all transform duration-300">
                <Database size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">JSON Efficiency</h3>
              <p className="text-slate-500 leading-relaxed">
                Response data is stored as flexible JSON structures in SQLite, enabling powerful data exports and analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-100 mt-20 bg-slate-50/50">
        <div className="container flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-6 max-w-sm">
            <div className="text-3xl font-black text-slate-900 tracking-tighter">
              Gen<span className="text-indigo-600">E</span>Doc
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              An experimental document generation platform designed for rapid deployment and high-performance output at SSKRU.
            </p>
            <div className="flex gap-4">
               <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-slate-500"><Settings size={16} /></div>
               <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-slate-500"><Download size={16} /></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-20 text-sm">
             <div className="space-y-6">
                <h4 className="font-bold text-slate-900 uppercase tracking-widest text-[10px]">Platform</h4>
                <div className="space-y-4 text-slate-500">
                  <Link href="/dashboard" className="block hover:text-indigo-600 transition-colors">Workspace</Link>
                  <Link href="/templates/upload" className="block hover:text-indigo-600 transition-colors">New Blueprint</Link>
                  <Link href="/submissions" className="block hover:text-indigo-600 transition-colors">History</Link>
                </div>
             </div>
             <div className="space-y-6">
                <h4 className="font-bold text-slate-900 uppercase tracking-widest text-[10px]">Powered by</h4>
                <div className="space-y-4 text-slate-500">
                  <span className="block border-b border-dotted border-slate-300 w-fit">LO Engine</span>
                  <span className="block border-b border-dotted border-slate-300 w-fit">Prisma Client</span>
                  <span className="block border-b border-dotted border-slate-300 w-fit">Next.js 16</span>
                </div>
             </div>
          </div>
        </div>
        <div className="container mt-24 text-center text-[10px] text-slate-400 uppercase tracking-[0.4em] font-black opacity-50">
           © 2026 SSKRU Computer Project Tracking System.
        </div>
      </footer>
    </div>
  );
}
