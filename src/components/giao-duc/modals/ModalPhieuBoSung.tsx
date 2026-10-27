import React, { useState, useEffect } from "react";
import { AlertCircle, X, Download, Printer, Send } from "lucide-react";
import { toast } from "sonner";
import { type HoSoTTHCGiaoDuc } from "@/data/domain-mock";
import { appStore } from "@/services/app-state";
import { exportDocAsWord } from "../utils";

interface ModalPhieuBoSungProps {
  hoSo: HoSoTTHCGiaoDuc | null;
  onClose: () => void;
}

export const ModalPhieuBoSung: React.FC<ModalPhieuBoSungProps> = ({
  hoSo,
  onClose,
}) => {
  const [inputLyDoBoSung, setInputLyDoBoSung] = useState("");
  const [inputHanBoSung, setInputHanBoSung] = useState("");

  useEffect(() => {
    if (hoSo) {
      setInputLyDoBoSung(hoSo.lyDoBoSung || "");
      setInputHanBoSung(hoSo.hanBoSung || "");
    }
  }, [hoSo]);

  if (!hoSo) return null;

  const handlePhatHanhPhieuBoSung = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputLyDoBoSung.trim()) {
      toast.error("Vui lòng ghi rõ nội dung giấy tờ công dân cần bổ sung!");
      return;
    }

    const hanDate = inputHanBoSung || "7 ngày sau ngày phát hành";
    appStore.phatHanhYeuCauBoSung(hoSo.id, inputLyDoBoSung.trim(), hanDate);
    toast.success(
      "Đã phát hành Phiếu yêu cầu bổ sung, hoàn thiện hồ sơ (Mẫu số 02)!",
      {
        description: `Gửi thông báo SMS/Zalo tới công dân ${hoSo.nguoiNop} (${hoSo.soDienThoai})`,
      }
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white text-gray-900 rounded-xl shadow-2xl max-w-2xl w-full border border-gray-200 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-amber-600 text-white px-5 py-3.5 flex items-center justify-between shrink-0 shadow-xs rounded-t-xl">
          <div className="flex items-center gap-2.5">
            <div className="p-1 rounded-md bg-white/10">
              <AlertCircle className="size-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">
                Phiếu yêu cầu bổ sung, hoàn thiện hồ sơ (Mẫu số 02)
              </h3>
              <p className="text-[11px] text-white/80 font-normal">
                Theo Thông tư số 01/2018/TT-VPCP &amp; Nghị định 61/2018/NĐ-CP
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 cursor-pointer transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <form
          onSubmit={handlePhatHanhPhieuBoSung}
          className="p-6 space-y-4 text-xs overflow-y-auto font-sans flex-1"
          id="phieu-bo-sung-content"
        >
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px] leading-relaxed">
            <strong>Nguyên tắc công vụ (Khoản 2 Điều 17 Nghị định 61/2018/NĐ-CP):</strong>{" "}
            Cơ quan giải quyết TTHC chỉ được yêu cầu bổ sung, hoàn thiện hồ sơ{" "}
            <strong>một lần duy nhất</strong> bằng Phiếu yêu cầu Mẫu số 02. Nội
            dung hướng dẫn phải cụ thể, rõ ràng, nêu rõ căn cứ pháp lý.
          </div>

          <div className="border border-gray-200 rounded-lg p-3.5 bg-gray-50/60 space-y-1.5 text-xs">
            <div>
              <span className="text-gray-500">Mã hồ sơ:</span>{" "}
              <strong className="font-mono text-gray-900">{hoSo.maHoSo}</strong>
            </div>
            <div>
              <span className="text-gray-500">Họ và tên người nộp:</span>{" "}
              <strong className="text-gray-900 uppercase">{hoSo.nguoiNop}</strong>{" "}
              ({hoSo.soDienThoai})
            </div>
            <div>
              <span className="text-gray-500">Thủ tục:</span>{" "}
              <strong className="text-gray-900">{hoSo.tenThuTuc}</strong>
            </div>
            <div>
              <span className="text-gray-500">Cơ sở đề nghị:</span>{" "}
              <strong className="text-emerald-800">
                {hoSo.tenCoSoDeNghi}
              </strong>
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-1">
              Nội dung chi tiết yêu cầu bổ sung, hoàn thiện{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={inputLyDoBoSung}
              onChange={(e) => setInputLyDoBoSung(e.target.value)}
              placeholder="Ghi rõ từng văn bản, giấy tờ còn thiếu hoặc chưa đúng quy định (VD: Hợp đồng thuê địa điểm chưa đủ 3 năm; Bổ sung chứng nhận tập huấn VSATTP của cấp dưỡng...)"
              className="w-full rounded-lg border border-gray-300 p-2.5 text-xs outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-800 mb-1">
                Thời hạn người dân hoàn thiện bổ sung
              </label>
              <input
                type="text"
                value={inputHanBoSung}
                onChange={(e) => setInputHanBoSung(e.target.value)}
                placeholder="VD: 25/10/2026 (Trong vòng 07 ngày)"
                className="w-full rounded-lg border border-gray-300 p-2 text-xs outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-800 mb-1">
                Cán bộ hướng dẫn
              </label>
              <input
                type="text"
                readOnly
                value="ThS. Trần Thị Kim Oanh (Công chức GD-ĐT)"
                className="w-full rounded-lg border border-gray-300 p-2 text-xs bg-gray-100 text-gray-600"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() =>
                  exportDocAsWord(
                    `Phieu_yeu_cau_bo_sung_${hoSo.maHoSo}`,
                    "phieu-bo-sung-content"
                  )
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
                In Phiếu Mẫu 02
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
                className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Send className="size-3.5" />
                <span>Phát hành Phiếu yêu cầu bổ sung</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
