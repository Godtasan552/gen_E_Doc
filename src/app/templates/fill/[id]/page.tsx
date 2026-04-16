"use client";

import { useEffect, useState, use } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FileDown, ChevronLeft, Loader2, Printer } from "lucide-react";
import Swal from "sweetalert2";

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
    // Fetch template details to get fields
    const fetchTemplate = async () => {
      try {
        const res = await axios.get(`/api/templates/${id}`);
        setTemplate(res.data);
        const parsedFields = JSON.parse(res.data.fields);
        setFields(parsedFields);
        
        // Initialize form data
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

      // Create download link
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
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600 w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="container animate-fade-in pb-20">
      <button 
        onClick={() => router.push("/templates/upload")}
        className="btn btn-outline mb-8 text-sm"
      >
        <ChevronLeft className="w-4 h-4" /> ย้อนกลับ
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Form */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">กรอกข้อมูลสำหรับ {template?.name}</h1>
          <p className="text-slate-500 mb-8">ข้อมูลที่กรอกจะถูกนำไปวางแทนที่ตัวแปรในเอกสาร</p>

          <div className="card">
            {fields.length === 0 ? (
              <p className="text-amber-600 bg-amber-50 p-4 rounded-lg">
                ไม่พบตัวแปรในไฟล์ Word นี้ กรุณาใช้รูปแบบ &quot;{`{tag}`}&quot; ในเอกสาร
              </p>
            ) : (
              <div className="space-y-2">
                {fields.map((field) => (
                    <div key={field}>
                        <label className="block text-sm font-medium text-slate-700 capitalize">
                            {field.replace(/_/g, " ")}
                        </label>
                        <input
                            type="text"
                            value={formData[field]}
                            onChange={(e) => handleInputChange(field, e.target.value)}
                            className="input-field"
                            placeholder={`ระบุ ${field}...`}
                        />
                    </div>
                ))}
              </div>
            )}

            <div className="mt-8">
              <button
                onClick={handleExport}
                disabled={isGenerating || fields.length === 0}
                className="btn btn-primary w-full py-4 text-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" />
                    กำลังประมวลผล PDF (LibreOffice)...
                  </>
                ) : (
                  <>
                    <Printer className="w-5 h-5" />
                    สร้างไฟล์ PDF และดาวน์โหลด
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Preview Info */}
        <div className="hidden lg:block">
           <div className="card bg-slate-50 border-dashed sticky top-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                 <FileDown className="text-indigo-600" /> คำแนะนำการใช้งาน
              </h2>
              <ul className="space-y-4 text-slate-600">
                 <li className="flex gap-3">
                    <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 mt-1">1</span>
                    <span>กรอกข้อมูลในช่องว่างตามตัวแปรที่ระบบสแกนพบ</span>
                 </li>
                 <li className="flex gap-3">
                    <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 mt-1">2</span>
                    <span>กดปุ่ม &quot;สร้างไฟล์ PDF&quot; ระบบจะใช้ **LibreOffice** ในการ Render เอกสาร</span>
                 </li>
                 <li className="flex gap-3">
                    <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 mt-1">3</span>
                    <span>ตรวจสอบข้อมูลในไฟล์ PDF ที่โหลดมา หากต้องการแก้ไข สามารถแก้ที่ฟอร์มแล้วกดสร้างใหม่ได้ทันที</span>
                 </li>
              </ul>
              
              <div className="mt-10 p-4 bg-white rounded-lg border border-slate-200">
                 <p className="text-xs text-slate-400 mb-1 uppercase font-bold tracking-wider">Template Path</p>
                 <p className="text-xs font-mono text-slate-600 truncate">{template?.filePath}</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
