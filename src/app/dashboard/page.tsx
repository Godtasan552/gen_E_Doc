"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { 
  FileText, 
  Plus, 
  History, 
  FileDown, 
  ChevronRight, 
  Settings, 
  Trash2, 
  Loader2,
  ExternalLink,
  Search,
  Users,
  Target,
  Bell,
  Layers
} from "lucide-react";
import Swal from "sweetalert2";

interface Project {
  id: string;
  nameTh: string;
  status: string;
  createdAt: string;
}

interface Template {
  id: string;
  name: string;
  createdAt: string;
}

interface Submission {
  id: string;
  template: { name: string };
  createdAt: string;
}

export default function Dashboard() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("edocs"); // edocs, tracking, settings

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [templatesRes, submissionsRes] = await Promise.all([
          axios.get("/api/templates"),
          axios.get("/api/submissions")
        ]);
        setTemplates(templatesRes.data);
        setSubmissions(submissionsRes.data);
        // Mocking projects for now since we haven't built the create-project API yet
        setProjects([
           { id: "1", nameTh: "โครงงานพัฒนาเว็บสำหรับการจัดการเอกสาร", status: "ONGOING", createdAt: new Date().toISOString() }
        ]);
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-slate-100 gap-6">
        <div className="relative">
          <Loader2 className="animate-spin text-indigo-600" size={64} />
          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-indigo-600 uppercase">Sync</div>
        </div>
        <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-xs">Synchronizing Workspace</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 pb-20 selection:bg-indigo-100 selection:text-indigo-700">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="container py-4 flex justify-between items-center">
          <div className="flex items-center gap-10">
            <Link href="/" className="text-2xl font-black text-indigo-600 tracking-tighter">
              Gen<span className="text-slate-900">E</span>Doc <span className="text-[10px] bg-indigo-50 px-2 py-0.5 rounded text-indigo-500 ml-2">CSPTS V.1</span>
            </Link>
            <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-400">
               <button onClick={() => setActiveTab("edocs")} className={`hover:text-indigo-600 transition-colors ${activeTab === 'edocs' ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1' : ''}`}>E-Documents</button>
               <button onClick={() => setActiveTab("tracking")} className={`hover:text-indigo-600 transition-colors ${activeTab === 'tracking' ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1' : ''}`}>Project Tracking</button>
               <button className="hover:text-indigo-600 transition-colors opacity-50 cursor-not-allowed">Admin Center</button>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-slate-400 hover:text-indigo-600"><Bell size={20} /></button>
            <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200">
               <Users size={20} className="text-slate-400" />
            </div>
          </div>
        </div>
      </nav>

      <main className="container py-12 space-y-16 fade-in">
        {/* Header Section */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 pb-12">
           <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-4">
                 <Target size={12} /> System Dashboard
              </div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
                 {activeTab === 'edocs' ? 'Unified E-Docs' : 'Project Management'}
              </h1>
              <p className="text-slate-500 text-lg mt-2">Manage your SSKRU digital workflow efficiently.</p>
           </div>
           <div className="flex gap-4">
              <Link href="/templates/upload" className="btn btn-primary px-8 py-4 shadow-xl shadow-indigo-100 group">
                 <Plus size={20} className="group-hover:rotate-90 transition-transform" /> 
                 {activeTab === 'edocs' ? 'New Template' : 'Start Project'}
              </Link>
           </div>
        </section>

        {activeTab === 'edocs' && (
          <div className="space-y-16">
            {/* Templates Section */}
            <section>
              <div className="flex justify-between items-end mb-8">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                   <Layers size={24} className="text-indigo-600" /> Active Templates
                </h2>
                <div className="relative group hidden md:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" placeholder="Filter blueprints..." className="input pl-10 h-10 w-64 bg-slate-50 border-transparent focus:bg-white focus:border-indigo-100 transition-all text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {templates.map((template) => (
                  <div key={template.id} className="card bg-white hover:shadow-2xl group transition-all border-none ring-1 ring-slate-100 p-8">
                    <div className="bg-indigo-50 text-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all transform duration-300">
                      <FileText size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 truncate">{template.name}</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6 border-l-2 border-slate-100 pl-3">Created {new Date(template.createdAt).toLocaleDateString()}</p>
                    <Link href={`/templates/fill/${template.id}`} className="btn btn-outline w-full py-3 text-sm font-black uppercase tracking-widest bg-slate-50 border-none group-hover:bg-indigo-50 group-hover:text-indigo-600">
                      Fill Document <ChevronRight size={16} />
                    </Link>
                  </div>
                ))}
                
                <Link href="/templates/upload" className="card border-dashed border-2 border-slate-100 bg-slate-50/20 flex flex-col items-center justify-center p-12 text-slate-400 hover:border-indigo-200 hover:text-indigo-500 transition-all cursor-pointer shadow-none group">
                   <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center mb-4 group-hover:border-indigo-200 transition-colors">
                      <Plus size={32} />
                   </div>
                   <p className="font-black uppercase tracking-[0.2em] text-[10px]">Add New Blueprint</p>
                </Link>
              </div>
            </section>

            {/* Submissions Section */}
            <section>
              <div className="mb-8">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                   <History size={24} className="text-indigo-600" /> Recent History
                </h2>
              </div>

              <div className="card p-0 overflow-hidden border-none shadow-xl ring-1 ring-slate-100">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Target Document</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Timestamp</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Options</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {submissions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-indigo-50/30 transition-colors group">
                          <td className="px-8 py-6">
                            <span className="font-bold text-slate-700">{sub.template.name}</span>
                          </td>
                          <td className="px-8 py-6 text-sm text-slate-400 font-mono italic">
                            {new Date(sub.createdAt).toLocaleString()}
                          </td>
                          <td className="px-8 py-6 text-right">
                             <Link href={`/submissions/${sub.id}`} className="inline-flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:underline">
                                View Data <ChevronRight size={14} />
                             </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'tracking' && (
          <div className="space-y-12">
             <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="card bg-white ring-1 ring-slate-100 p-8 shadow-sm">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Projects</p>
                   <p className="text-4xl font-black text-indigo-600">{projects.length}</p>
                </div>
                <div className="card bg-white ring-1 ring-slate-100 p-8 shadow-sm opacity-50">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pending Approval</p>
                   <p className="text-4xl font-black text-slate-600">0</p>
                </div>
                <div className="card bg-white ring-1 ring-slate-100 p-8 shadow-sm opacity-50">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Completed</p>
                   <p className="text-4xl font-black text-slate-600">0</p>
                </div>
             </section>

             <section>
                <div className="card bg-white ring-1 ring-slate-100 p-12 text-center">
                   <Target size={48} className="mx-auto text-indigo-100 mb-6" />
                   <h3 className="text-xl font-bold text-slate-900 mb-2">Initialize Project Tracking</h3>
                   <p className="text-slate-500 max-w-md mx-auto mb-8">ตาม Roadmap ใน Blueprint ส่วนนี้จะใช้สำหรับการติดตามสถานะโครงงาน วท.1 - วท.14 ของนักศึกษาแต่ละกลุ่ม</p>
                   <button className="btn btn-outline px-8 uppercase text-[10px] font-black tracking-widest">Register New Project</button>
                </div>
             </section>
          </div>
        )}
      </main>

      {/* Footer Meta */}
      <footer className="container mt-32 pt-12 border-t border-slate-100">
         <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
               Architecture based on CSPTS Blueprint • Next.js 16 Framework
            </div>
            <div className="flex gap-10">
               <span className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><Settings size={14} className="animate-spin-slow" /> SQLite Sync</span>
               <span className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest"><Layers size={14} /> Intelligence Core</span>
            </div>
         </div>
      </footer>
    </div>
  );
}
