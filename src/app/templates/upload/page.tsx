"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Upload, FileText, CheckCircle2, ChevronLeft, Loader2, Info, Sparkles, Zap } from "lucide-react";
import Swal from "sweetalert2";
import Link from "next/link";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      Swal.fire("Error", "Please select a file first", "error");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    try {
      const res = await axios.post("/api/templates/upload", formData);
      Swal.fire({
        icon: "success",
        title: "Analysis Complete",
        text: "We've identified the fields and mapped their labels automatically.",
        confirmButtonColor: "#4f46e5",
      });
      router.push(`/templates/fill/${res.data.id}`);
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err) ? err.response?.data?.error : "Upload failed";
      Swal.fire("Process Failed", errorMessage || "An error occurred", "error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 selection:bg-indigo-100 selection:text-indigo-700">
      <div className="container fade-in">
        <header className="flex justify-between items-center py-10 mb-12">
          <Link href="/dashboard" className="btn btn-outline bg-white text-sm shadow-sm">
            <ChevronLeft size={18} /> Dashboard
          </Link>
          <div className="text-right">
             <div className="bg-white px-3 py-1 rounded-full border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 shadow-sm">
                Next-Gen Sync
             </div>
             <p className="text-xs font-bold text-slate-600">Step 1: Intelligence Analysis</p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter leading-none">
              Import Your <span className="text-indigo-600">Template</span>
            </h1>
            <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Upload a Word (.docx) document. Our engine will use context-aware analysis 
              to detect placeholders and generate smart labels automatically.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2">
              <div className="card shadow-2xl border-none p-12 bg-white relative overflow-hidden group ring-1 ring-slate-100">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <Upload size={120} />
                </div>
                
                <label className="upload-zone group block mb-10 border-indigo-100 hover:border-indigo-400 bg-slate-50/50 cursor-pointer p-12 rounded-3xl transition-all h-80 flex flex-col items-center justify-center border-2 border-dashed">
                  <input type="file" className="hidden" accept=".docx" onChange={handleFileChange} />
                  <div className="flex flex-col items-center justify-center h-full">
                    {file ? (
                      <div className="animate-fade-in text-center">
                        <div className="bg-indigo-600 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 text-white shadow-xl shadow-indigo-200 transform scale-110 transition-transform">
                          <FileText size={48} />
                        </div>
                        <p className="text-2xl font-black text-slate-900 mb-2">{file.name}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ready for analysis • {(file.size / 1024).toFixed(2)} KB</p>
                        <div className="mt-8 text-indigo-500 text-sm font-black underline underline-offset-4 cursor-pointer">Change file</div>
                      </div>
                    ) : (
                      <>
                        <div className="bg-white w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300 shadow-sm border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-all duration-300">
                          <Upload size={48} />
                        </div>
                        <p className="text-2xl font-black text-slate-800 mb-2">Drop your .docx here</p>
                        <p className="text-slate-400 font-medium">Auto-detection active for curly bracket variables</p>
                      </>
                    )}
                  </div>
                </label>

                <div className="bg-indigo-50/50 rounded-2xl p-6 flex gap-4 text-indigo-900 text-sm mb-10 border border-indigo-100/50">
                  <Sparkles className="shrink-0 text-indigo-500" size={24} />
                  <p className="leading-relaxed font-medium">
                    <strong>Smart Hint:</strong> We look for text preceding your tags (e.g., <code>Name: {`{id}`}</code>) to create human-readable labels automatically.
                  </p>
                </div>

                <button
                  onClick={handleUpload}
                  disabled={!file || isUploading}
                  className={`btn btn-primary w-full py-5 text-xl shadow-xl shadow-indigo-100 group rounded-2xl ${(!file || isUploading) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.01] active:scale-[0.99] transition-all'}`}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="animate-spin" size={28} />
                      Analyzing Document Intelligence...
                    </>
                  ) : (
                    <>
                      <Zap size={24} className="group-hover:text-amber-300 transition-colors" />
                      Begin Dynamic Extraction
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-8">
               <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 pl-2">The Workflow</h3>
               <div className="space-y-6">
                  <div className="flex gap-5 group">
                     <div className="shrink-0 w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all transform duration-300">
                        <CheckCircle2 size={24} />
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-900">Context Search</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">Identifies keys and nearby textual labels in Word XML structures.</p>
                     </div>
                  </div>
                  <div className="flex gap-5 group">
                     <div className="shrink-0 w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all transform duration-300">
                        <CheckCircle2 size={24} />
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-900">Form Mapping</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">Generates a high-fidelity web form for instant data entry.</p>
                     </div>
                  </div>
                  <div className="flex gap-5 group">
                     <div className="shrink-0 w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all transform duration-300">
                        <CheckCircle2 size={24} />
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-900">PDF Rendering</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">Exports industrial-grade PDF documents using our LibreOffice Core.</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
