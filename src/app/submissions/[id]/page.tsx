"use client";

import { useEffect, useState, use } from "react";
import axios from "axios";
import Link from "next/link";
import { ChevronLeft, Database, Code, Calendar, FileText, Download } from "lucide-react";
import { useRouter } from "next/navigation";

interface Submission {
  id: string;
  template: { name: string };
  data: string;
  createdAt: string;
}

export default function SubmissionDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const res = await axios.get("/api/submissions");
        const found = res.data.find((s: Submission) => s.id === id);
        if (found) {
          setSubmission(found);
        } else {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmission();
  }, [id, router]);

  if (loading) return null;
  if (!submission) return null;

  const jsonData = JSON.parse(submission.data);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="container py-12 max-w-4xl mx-auto fade-in">
        <Link href="/dashboard" className="btn btn-outline text-sm mb-12">
          <ChevronLeft size={18} /> Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 text-indigo-600 font-bold text-sm mb-2 uppercase tracking-widest">
              <Database size={16} /> Submission Entry
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 leading-none">{submission.template.name}</h1>
          </div>
          <div className="text-right">
             <div className="flex items-center justify-end gap-2 text-slate-400 text-sm mb-1">
                <Calendar size={14} /> Created on {new Date(submission.createdAt).toLocaleDateString()}
             </div>
             <div className="text-slate-400 text-xs font-mono">{submission.id}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
           <div className="card bg-white shadow-sm border-none p-8">
              <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                 <FileText size={18} className="text-indigo-500" /> Form Answers
              </h3>
              <div className="space-y-6">
                 {Object.entries(jsonData).map(([key, value]) => (
                   <div key={key} className="border-b border-slate-50 pb-4 last:border-0">
                      <p className="text-xs text-slate-400 uppercase font-black tracking-widest mb-1">{key.replace(/_/g, ' ')}</p>
                      <p className="text-slate-700 font-medium">{String(value) || <span className="text-slate-300 italic">Empty</span>}</p>
                   </div>
                 ))}
              </div>
           </div>

           <div className="card bg-slate-900 text-indigo-300 shadow-xl border-none p-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Code size={120} />
              </div>
              <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                 <Code size={18} className="text-indigo-400" /> Raw JSON Data
              </h3>
              <pre className="text-xs font-mono leading-relaxed bg-black/30 p-4 rounded-xl border border-white/5 overflow-x-auto max-h-[400px]">
                 {JSON.stringify(jsonData, null, 4)}
              </pre>
           </div>
        </div>

        <div className="flex justify-center">
            <button className="btn btn-primary px-12 py-4 shadow-xl shadow-indigo-100">
               <Download size={20} /> Re-generate and Download PDF
            </button>
        </div>
      </div>
    </div>
  );
}
