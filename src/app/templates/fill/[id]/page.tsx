"use client";

import { useEffect, useState, use } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { 
  FileDown, 
  ChevronLeft, 
  Loader2, 
  Printer, 
  CheckCircle, 
  HelpCircle, 
  Info, 
  Database,
  Cpu,
  Layout,
  Type
} from "lucide-react";
import Swal from "sweetalert2";
import Link from "next/link";

interface DocumentField {
  tag: string;
  label: string;
  context?: string;
  isDotLine?: boolean;
}

interface DocumentTemplate {
  id: string;
  name: string;
  fields: string;
  filePath: string;
}

export default function FillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [template, setTemplate] = useState<DocumentTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [fields, setFields] = useState<DocumentField[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await axios.get(`/api/templates/${id}`);
        setTemplate(res.data);
        
        let parsedFields = JSON.parse(res.data.fields);
        // Migration check
        if (parsedFields.length > 0 && typeof parsedFields[0] === "string") {
            parsedFields = parsedFields.map((f: string) => ({ tag: f, label: f }));
        }
        
        setFields(parsedFields);
        
        const initialData: Record<string, string> = {};
        parsedFields.forEach((f: DocumentField) => {
          initialData[f.tag] = "";
        });
        setFormData(initialData);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Template not found", "error");
        router.push("/dashboard");
      }
    };

    fetchTemplate();
  }, [id, router]);

  const handleInputChange = (tag: string, value: string) => {
    setFormData((prev) => ({ ...prev, [tag]: value }));
  };

  const handleExport = async () => {
    if (!template) return;
    setIsGenerating(true);
    try {
      const response = await axios.post(
        "/api/templates/generate",
        { templateId: id, data: formData },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${template.name}_generated.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      Swal.fire("Success!", "PDF generated with original Word layout.", "success");
    } catch (err: unknown) {
      console.error(err);
      Swal.fire("Engine Error", "Ensure LibreOffice is running correctly on the server.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!template) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-slate-50 gap-6">
        <div className="relative">
           <Cpu className="animate-pulse text-indigo-200" size={80} />
           <Loader2 className="animate-spin text-indigo-600 absolute inset-0 m-auto" size={40} />
        </div>
        <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Booting Document Engine</p>
      </div>
    );
  }

  // Group fields for better UX
  const taggedFields = fields.filter(f => !f.isDotLine);
  const dotFields = fields.filter(f => f.isDotLine);

  return (
    <div className="bg-white min-h-screen pb-20 selection:bg-indigo-100 selection:text-indigo-700">
      <div className="container fade-in">
        <header className="flex justify-between items-center py-10 mb-8">
          <Link href="/dashboard" className="btn btn-outline text-xs font-black uppercase tracking-widest border-slate-200">
            <ChevronLeft size={16} /> Dashboard
          </Link>
          <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Template</p>
                <h2 className="font-bold text-slate-900 text-lg">{template.name}</h2>
             </div>
             <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
                <Layout size={24} className="text-slate-300" />
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8">
            <div className="mb-12">
               <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tighter leading-none">Generate <span className="text-indigo-600">Document</span></h1>
               <div className="flex gap-4">
                  <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> High-Fidelity Engine Active (LO)
                  </div>
                  <div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                     <Type size={12} /> {fields.length} Fields Detected
                  </div>
               </div>
            </div>

            <div className="space-y-12">
              {/* Primary Fields ({tags}) */}
              {taggedFields.length > 0 && (
                <div className="card bg-white border-none p-10 ring-1 ring-slate-100 shadow-xl shadow-slate-100/50">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-10 pb-4 border-b border-slate-50 flex items-center gap-2">
                     <Database size={16} className="text-indigo-600" /> Core Variables
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                    {taggedFields.map((f) => (
                      <div key={f.tag} className="form-group group">
                        <label className="label text-[10px] font-black uppercase tracking-widest text-slate-400 group-focus-within:text-indigo-600 mb-3 block">
                          {f.label}
                        </label>
                        <input
                          type="text"
                          value={formData[f.tag]}
                          onChange={(e) => handleInputChange(f.tag, e.target.value)}
                          className="input h-12 bg-slate-50/50 border-transparent focus:bg-white focus:border-indigo-100 transition-all text-base font-medium rounded-xl"
                          placeholder={`${f.tag}...`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dotted Line Fields */}
              {dotFields.length > 0 && (
                <div className="card bg-white border-none p-10 ring-1 ring-slate-100 shadow-xl shadow-slate-100/50">
                   <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 pb-4 border-b border-slate-50 flex items-center gap-2">
                     <Type size={16} className="text-amber-500" /> Dotted Line Mapping
                  </h3>
                  <p className="text-xs text-slate-400 mb-8 italic">These fields were automatically identified from dotted lines (..........) in your document.</p>
                  <div className="space-y-6">
                    {dotFields.map((f) => (
                      <div key={f.tag} className="form-group flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                        <label className="text-sm font-bold text-slate-700 md:w-1/3 truncate">
                          {f.label}
                        </label>
                        <input
                          type="text"
                          value={formData[f.tag]}
                          onChange={(e) => handleInputChange(f.tag, e.target.value)}
                          className="input h-10 bg-white border-slate-200 focus:border-indigo-400 flex-1 rounded-lg"
                          placeholder="Fill dotted line..."
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-16 flex flex-col items-center gap-8">
               <button
                  onClick={handleExport}
                  disabled={isGenerating}
                  className="btn btn-primary w-full max-w-md py-5 text-xl shadow-2xl shadow-indigo-200 group rounded-2xl"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="animate-spin" size={24} />
                      Rendering Original PDF Layout...
                    </>
                  ) : (
                    <>
                      <Printer size={24} className="group-hover:scale-110 transition-transform" />
                      Export High-Fidelity PDF
                    </>
                  )}
                </button>
                <div className="flex items-center gap-8 text-[10px] font-black text-slate-300 tracking-[0.2em] uppercase">
                   <span>Layout: Protected</span>
                   <span>•</span>
                   <span>Engine: LibreOffice</span>
                </div>
            </div>
          </div>

          <div className="lg:col-span-4">
             <div className="sticky top-32 space-y-8">
                <div className="card bg-slate-900 text-white border-none p-10 shadow-2xl rounded-[32px] overflow-hidden relative">
                   <div className="absolute top-0 right-0 p-8 opacity-20 rotate-12">
                      <Cpu size={120} />
                   </div>
                   <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                      Generation Meta
                   </h2>
                   <div className="space-y-6 text-sm opacity-80 leading-relaxed font-medium">
                      <p>Our system is now utilizing the **LibreOffice Engine** directly to ensure your PDF matches the Word template bit-for-bit.</p>
                      <ul className="space-y-3">
                         <li className="flex gap-3">
                            <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                            <span>Preserves all Tables & Borders</span>
                         </li>
                         <li className="flex gap-3">
                            <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                            <span>Original Fonts & Spacing</span>
                         </li>
                         <li className="flex gap-3">
                            <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                            <span>Page Break Protection</span>
                         </li>
                      </ul>
                   </div>
                </div>

                <div className="card bg-amber-50 border-none p-8 rounded-[32px]">
                   <h3 className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Info size={14} /> Smart Note
                   </h3>
                   <p className="text-amber-900/70 text-xs leading-relaxed">
                     The **Dotted Line Detection** is experimental. It finds any sequences of dots or underscores and allows you to fill them as if they were variables.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
