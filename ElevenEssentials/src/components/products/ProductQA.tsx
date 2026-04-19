import { MessageSquare, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProductQA() {
  return (
    <div className="mt-8 bg-navy-50/50 rounded-3xl p-6 sm:p-10 border border-navy-100">
      <div className="flex justify-between items-end border-b border-navy-100 pb-4 mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900">Questions & Answers</h2>
        <Button variant="outline" className="font-bold text-navy-600 rounded-xl border-navy-200 hover:bg-white hover:text-navy-900">
          Ask a Question
        </Button>
      </div>

      <div className="space-y-6">
        {/* Q&A Item 1 */}
        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-navy-100">
          <div className="flex gap-4">
             <div className="shrink-0 flex flex-col items-center gap-1 text-navy-400">
                <button className="p-1 hover:text-navy-900 hover:bg-navy-50 rounded"><ThumbsUp className="w-4 h-4" /></button>
                <span className="text-xs font-bold">24</span>
             </div>
             <div>
               <div className="flex gap-2">
                 <span className="font-black text-navy-900 shrink-0">Q:</span>
                 <p className="font-bold text-navy-900 mb-3">Is the strap adjustable for smaller wrists?</p>
               </div>
               <div className="flex gap-2">
                 <span className="font-black text-saffron shrink-0">A:</span>
                 <div>
                   <p className="text-navy-600 text-sm leading-relaxed mb-2">Yes! The strap comes with an included micro-adjustment tool that allows you to remove up to 4 links for a perfect fit on any wrist size.</p>
                   <p className="text-[10px] font-bold uppercase tracking-wider text-navy-400">Answered by Eleven Essentials</p>
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Q&A Item 2 */}
        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-navy-100">
          <div className="flex gap-4">
             <div className="shrink-0 flex flex-col items-center gap-1 text-navy-400">
                <button className="p-1 hover:text-navy-900 hover:bg-navy-50 rounded"><ThumbsUp className="w-4 h-4" /></button>
                <span className="text-xs font-bold">8</span>
             </div>
             <div>
               <div className="flex gap-2">
                 <span className="font-black text-navy-900 shrink-0">Q:</span>
                 <p className="font-bold text-navy-900 mb-3">Does it require batteries?</p>
               </div>
               <div className="flex gap-2">
                 <span className="font-black text-saffron shrink-0">A:</span>
                 <div>
                   <p className="text-navy-600 text-sm leading-relaxed mb-2">No, this features an automatic mechanical movement that self-winds while you wear it.</p>
                   <p className="text-[10px] font-bold uppercase tracking-wider text-navy-400">Answered by Seller</p>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
