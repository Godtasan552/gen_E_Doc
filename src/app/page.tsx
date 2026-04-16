import Link from "next/link";
import { FilePlus, FileText, Settings, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="container animate-fade-in">
      <div className="text-center mt-20 mb-16">
        <h1 className="text-5xl font-extrabold text-slate-900 mb-6">
          Gen<span className="text-indigo-600">E</span>Doc
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          เปลี่ยนไฟล์ Word ของคุณให้เป็นจุดกรอกข้อมูลดิจิทัล และส่งออกเป็น PDF คุณภาพสูงด้วยพลังของ LibreOffice
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Link href="/templates/upload" className="card hover:border-indigo-500 transition-all group">
          <div className="bg-indigo-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
            <FilePlus className="text-indigo-600 group-hover:text-white w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">สร้างแม่แบบใหม่</h2>
          <p className="text-slate-500">อัปโหลดไฟล์ Word เพื่อให้ระบบวิเคราะห์หาช่องกรอกข้อมูลอัตโนมัติ</p>
        </Link>

        <Link href="/templates/upload" className="card hover:border-emerald-500 transition-all group">
          <div className="bg-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors">
            <FileText className="text-emerald-600 group-hover:text-white w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">เรียกดูเอกสาร</h2>
          <p className="text-slate-500">ค้นหาและจัดการเอกสารที่เคยสร้างไว้ในระบบ (Coming Soon)</p>
        </Link>
      </div>

      <div className="mt-24 pt-12 border-t border-slate-200">
        <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
           <div className="flex items-center gap-2 font-bold text-slate-600">
              <ShieldCheck /> SSKRU Evaluation System
           </div>
           <div className="flex items-center gap-2 font-bold text-slate-600">
              <Settings /> Powered by LibreOffice
           </div>
        </div>
      </div>
    </div>
  );
}
