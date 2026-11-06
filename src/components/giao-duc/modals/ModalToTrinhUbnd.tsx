import React, { useState, useEffect } from "react";
import { Send, X, Download, Printer } from "lucide-react";
import { toast } from "sonner";
import { type HoSoTTHCGiaoDuc } from "@/data/domain-mock";
import { appStore } from "@/services/app-state";
import { exportDocAsWord } from "../utils";

interface ModalToTrinhUbndProps {
  hoSo: HoSoTTHCGiaoDuc | null;
  onClose: () => void;
}

export const ModalToTrinhUbnd: React.FC<ModalToTrinhUbndProps> = ({
  hoSo,
  onClose,
}) => {
  const [inputSoToTrinh, setInputSoToTrinh] = useState("");
  const [inputNoiDungToTrinh, setInputNoiDungToTrinh] = useState("");

  useEffect(() => {
    if (hoSo?.toTrinhUbnd) {
      setInputSoToTrinh(hoSo.toTrinhUbnd.soToTrinh);
      setInputNoiDungToTrinh(hoSo.toTrinhUbnd.noiDungTrinh);
    } else if (hoSo) {
      setInputSoToTrinh(`${Math.floor(10 + Math.random() * 90)}/TTr-VHXH`);
      setInputNoiDungToTrinh(
        `Kính trình Chủ tịch UBND Phường xem xét, ký ban hành Quyết định cho phép thành lập đối với ${hoSo.tenCoSoDeNghi}. Cơ sở đã được đoàn liên ngành thẩm định đủ điều kiện theo quy định.`
      );
    }
  }, [hoSo]);

  if (!hoSo) return null;

  const handleSaveToTrinh = (e: React.FormEvent) => {
    e.preventDefault();

    const soToTrinh =
      inputSoToTrinh.trim() || `${Math.floor(10 + Math.random() * 90)}/TTr-VHXH`;
    const data = {
      soToTrinh,
      ngayTrinh: new Date().toLocaleDateString("vi-VN"),
      nguoiTrinh: "ThS. Trần Thị Kim Oanh",
      chucVu: "Công chức Văn hóa - Xã hội phụ trách Giáo dục",
      noiDungTrinh:
        inputNoiDungToTrinh.trim() ||
        `Kính trình Chủ tịch UBND Phường xem xét, ký ban hành Quyết định cho phép thành lập đối với ${hoSo.tenCoSoDeNghi}. Cơ sở đã được đoàn liên ngành thẩm định đủ điều kiện.`,
    };

    appStore.soanToTrinhPheDuyet(hoSo.id, data);
    toast.success(
      "Đã hoàn tất Tờ trình và chuyển Lãnh đạo UBND Phường phê duyệt!",
      {
        description: `Tờ trình số: ${soToTrinh} · Hồ sơ chuyển trạng thái 'Chờ Lãnh đạo ký số'`,
      }
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white text-gray-900 rounded-xl shadow-2xl max-w-3xl w-full border border-gray-200 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-sky-700 text-white px-5 py-3.5 flex items-center justify-between shrink-0 shadow-xs rounded-t-xl">
          <div className="flex items-center gap-2">
            <Send className="size-5" />
            <h3 className="font-bold text-sm sm:text-base">
              Tờ trình Đề nghị ban hành Quyết định cho phép thành lập cơ sở
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 cursor-pointer transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <form
          onSubmit={handleSaveToTrinh}
          className="p-6 space-y-4 text-xs overflow-y-auto font-sans flex-1"
          id="to-trinh-content"
        >
          <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-lg text-sky-900 text-xs leading-relaxed">
            <strong>Thể thức Tờ trình hành chính (Nghị định 30/2020/NĐ-CP):</strong>{" "}
            Công chức chuyên môn tham mưu lập Tờ trình trình Lãnh đạo Ủy ban nhân
            dân Phường xem xét, phê duyệt và ký số ban hành Quyết định thành lập.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Số Tờ trình
              </label>
              <input
                type="text"
                value={inputSoToTrinh}
                onChange={(e) => setInputSoToTrinh(e.target.value)}
                placeholder="VD: 21/TTr-VHXH"
                className="w-full rounded-lg border border-gray-300 p-2 text-xs font-mono font-bold outline-none focus:border-sky-700 focus:ring-1 focus:ring-sky-700"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Cơ quan nhận tờ trình
              </label>
              <input
                type="text"
                readOnly
                value="Kính trình: Chủ tịch UBND Phường Thủ Dầu Một"
                className="w-full rounded-lg border border-gray-300 p-2 text-xs bg-gray-100 font-semibold text-gray-700"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Nội dung Tờ trình tham mưu <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={5}
              required
              value={inputNoiDungToTrinh}
              onChange={(e) => setInputNoiDungToTrinh(e.target.value)}
              placeholder="Kính trình Chủ tịch UBND Phường xem xét ban hành Quyết định cho phép thành lập... Hồ sơ đã được thẩm định đúng theo Thông tư 49/2021/TT-BGDĐT..."
              className="w-full rounded-lg border border-gray-300 p-2.5 text-xs font-serif leading-relaxed outline-none focus:border-sky-700 focus:ring-1 focus:ring-sky-700"
            />
          </div>

          <div className="border border-gray-200 rounded-lg p-3.5 bg-gray-50/70 space-y-1 text-[11px]">
            <div className="font-bold text-gray-700">
              Tài liệu kèm theo Tờ trình:
            </div>
            <div>1. Đơn đề nghị của chủ cơ sở {hoSo.nguoiNop}</div>
            <div>2. Đề án thành lập và hồ sơ bằng cấp chuyên môn giáo viên</div>
            <div>
              3. Biên bản kiểm tra thẩm định thực tế liên ngành (Kết luận ĐẠT YÊU
              CẦU)
            </div>
            <div>4. Dự thảo Quyết định cho phép thành lập nhóm trẻ</div>
          </div>

          <div className="pt-3 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() =>
                  exportDocAsWord(`To_trinh_${hoSo.maHoSo}`, "to-trinh-content")
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-blue-700 font-bold cursor-pointer transition-colors"
              >
                <Download className="size-3.5" />
                Xuất Word (.doc)
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 font-bold cursor-pointer transition-colors"
              >
                <Printer className="size-3.5" />
                In Tờ trình
              </button>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold cursor-pointer transition-colors"
              >
                Đóng
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-sky-700 hover:bg-sky-800 text-white font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Send className="size-3.5" />
                <span>Lưu Tờ trình &amp; Chuyển Lãnh đạo ký số</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
