"use client";

import { useEffect, useState, use } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FileDown, ChevronLeft, Loader2, Printer, CheckCircle, HelpCircle } from "lucide-react";
import Swal from "sweetalert2";
import Link from "next/link";

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
  const [fields, setFields] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await axios.get(`/api/templates/${id}`);
        setTemplate(res.data);
        const parsedFields = JSON.parse(res.data.fields);
        setFields(parsedFields);
        
        const initialData: Record<string, string> = {};
        parsedFields.forEach((field: string) => {
          initialData[field] = "";
        });
        setFormData(initialData);
      } catch (err) {
        Swal.fire("ข้อผิดพลาด", "ไม่พบข้อมูลแม่แบบ", "error");
        router.push("/templates/upload");
      }
    };

    fetchTemplate();
  }, [id, router]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
      link.setAttribute("download", `${template.name}_filled.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      Swal.fire("สำเร็จ!", "ดาวน์โหลดไฟล์ PDF เรียบร้อยแล้ว", "success");
    } catch (err: unknown) {
      console.error(err);
      Swal.fire("ล้มเหลว", "ไม่สามารถสร้างไฟล์ PDF ได้ ตรวจสอบว่าได้ติดตั้ง LibreOffice แล้ว", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!template) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <p className="text-slate-500 font-medium">กำลังเตรียมแบบฟอร์มของคุณ...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="container fade-in">
        <header className="flex justify-between items-center py-8 mb-8 border-b border-slate-200">
          <Link href="/templates/upload" className="btn btn-outline text-sm">
            <ChevronLeft size={18} /> เลือกไฟล์ใหม่
          </Link>
          <div className="text-right">
             <h2 className="font-bold text-slate-900 uppercase tracking-wider text-sm">{template.name}</h2>
             <p className="text-xs text-slate-400">Step 2 of 2: Fill & Export</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Input Form */}
          <div className="lg:col-span-8">
            <div className="mb-8">
               <h1 className="text-3xl font-extrabold text-slate-900 mb-2">กรอกข้อมูลลงแบบฟอร์ม</h1>
               <p className="text-slate-500">ใส่ข้อมูลลงในช่องว่างด้านล่าง ระบบจะไปเติมลงในเอกสาร Word ของคุณโดยอัตโนมัติ</p>
            </div>

            <div className="card shadow-md border-none">
              {fields.length === 0 ? (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center text-amber-800">
                  <HelpCircle size={48} className="mx-auto mb-4 opacity-40" />
                  <p className="font-bold mb-1">ไม่พบตัวแปรในเอกสาร</p>
                  <p className="text-sm opacity-80">กรุณากลับไปเช็คตัวแปรใน Word ให้ใช้รูปแบบ &quot;{`{tag}`}&quot; เช่น &quot;{`{name}`}&quot;</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  {fields.map((field) => (
                      <div key={field} className="form-group">
                          <label className="label capitalize flex items-center gap-2">
                              {field.replace(/_/g, " ")}
                              {formData[field] && <CheckCircle size={14} className="text-emerald-500" />}
                          </label>
                          <input
                              type="text"
                              value={formData[field]}
                              onChange={(e) => handleInputChange(field, e.target.value)}
                              className="input"
                              placeholder={`ระบุข้อมูลสำหรับ ${field}...`}
                          />
                      </div>
                  ))}
                </div>
              )}

              <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                 <div className="text-slate-400 text-sm">
                    {fields.length} placeholders detected in template
                 </div>
                 <button
                    onClick={handleExport}
                    disabled={isGenerating || fields.length === 0}
                    className="btn btn-primary px-10 py-4 shadow-lg shadow-indigo-100"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        กำลังเรนเดอร์ PDF...
                      </>
                    ) : (
                      <>
                        <Printer size={20} />
                        สร้างเอกสาร PDF
                      </>
                    )}
                  </button>
              </div>
            </div>
          </div>

          {/* Right: Sidebar Helper */}
          <div className="lg:col-span-4">
             <div className="sticky top-28 space-y-6">
                <div className="card border-none bg-indigo-600 text-white shadow-xl">
                   <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <FileDown size={22} /> วิธีการใช้งาน
                   </h2>
                   <div className="space-y-4 opacity-90 text-sm">
                      <div className="flex gap-3">
                         <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">1</div>
                         <p>กรอกข้อมูลลงในช่องที่มีตัวแปรจากไฟล์ต้นฉบับ</p>
                      </div>
                      <div className="flex gap-3">
                         <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">2</div>
                         <p>ตรวจสอบความถูกต้องของชื่อและวันที่</p>
                      </div>
                      <div className="flex gap-3">
                         <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">3</div>
                         <p>กดปุ่ม <strong>&quot;สร้างเอกสาร PDF&quot;</strong> เพื่อรับไฟล์</p>
                      </div>
                   </div>
                </div>

                <div className="card border-slate-200 bg-white shadow-sm p-6">
                   <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Template Info</h3>
                   <div className="space-y-4">
                      <div>
                         <p className="text-xs text-slate-400 mb-1">Internal Reference</p>
                         <p className="text-sm text-slate-700 font-mono truncate">{id}</p>
                      </div>
                      <div>
                         <p className="text-xs text-slate-400 mb-1">Source File</p>
                         <p className="text-sm text-slate-700 font-medium truncate">{template?.filePath}</p>
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
