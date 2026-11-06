import React, { useState } from "react";
import { AlertOctagon, X, Download, Printer, Send } from "lucide-react";
import { toast } from "sonner";
import { type HoSoTTHCGiaoDuc } from "@/data/domain-mock";
import { appStore } from "@/services/app-state";
import { DigitalSignatureBadge } from "@/components/DigitalSignatureBadge";
import { exportDocAsWord } from "../utils";

interface ModalPhieuXinLoiProps {
  hoSo: HoSoTTHCGiaoDuc | null;
  onClose: () => void;
}

export const ModalPhieuXinLoi: React.FC<ModalPhieuXinLoiProps> = ({
  hoSo,
  onClose,
}) => {
  const [inputLyDoXinLoi, setInputLyDoXinLoi] = useState("");
  const [inputNgayHenMoi, setInputNgayHenMoi] = useState("");

  if (!hoSo) return null;

  const handlePhatHanhPhieuXinLoi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputLyDoXinLoi.trim()) {
      toast.error("Vui lòng ghi rõ lý do chậm trễ giải quyết hồ sơ!");
      return;
    }
    if (!inputNgayHenMoi.trim()) {
      toast.error("Vui lòng ấn định ngày hẹn trả kết quả mới!");
      return;
    }

    const res = appStore.phatHanhPhieuXinLoi(
      hoSo.id,
      inputLyDoXinLoi.trim(),
      inputNgayHenMoi.trim()
    );
    toast.warning(
      "Đã phát hành Phiếu xin lỗi và hẹn lại ngày trả kết quả (Mẫu số 04)!",
      {
        description: `Số phiếu: ${res.soPhieu} · Ngày hẹn trả mới: ${res.ngayHenMoi}`,
      }
    );
    setInputLyDoXinLoi("");
    setInputNgayHenMoi("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white text-gray-900 rounded-xl shadow-2xl max-w-3xl w-full border border-gray-200 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Topbar No-print */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b bg-amber-600 text-white rounded-t-xl no-print shrink-0 shadow-xs">
          <div className="flex items-center gap-2">
            <AlertOctagon className="size-5" />
            <h3 className="font-bold text-sm sm:text-base">
              Phiếu xin lỗi và Hẹn lại ngày trả kết quả (Mẫu số 04 - Nghị định 61/2018/NĐ-CP)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {hoSo.phieuXinLoi && (
              <>
                <button
                  onClick={() =>
                    exportDocAsWord(
                      `Phieu_xin_loi_${hoSo.maHoSo}`,
                      "phieu-xin-loi-content"
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer transition-colors"
                  title="Xuất văn bản Mẫu 04 sang tệp Word (.doc) chuẩn thể thức NĐ 30/2020"
                >
                  <Download className="size-4" />
                  Xuất Word (.doc)
                </button>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer transition-colors"
                >
                  <Printer className="size-4" />
                  In Phiếu (Ctrl+P)
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 cursor-pointer transition-colors"
              title="Đóng"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Chưa có Phiếu xin lỗi -> Hiển thị form lập */}
        {!hoSo.phieuXinLoi ? (
          <form
            onSubmit={handlePhatHanhPhieuXinLoi}
            className="p-6 space-y-4 text-xs overflow-y-auto font-sans flex-1"
          >
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-red-900 leading-relaxed text-[11px]">
              <strong>Trách nhiệm công vụ (Khoản 3 Điều 17 Nghị định 61/2018/NĐ-CP):</strong>{" "}
              Trường hợp hồ sơ giải quyết quá thời hạn so với Giấy tiếp nhận hồ
              sơ và hẹn trả kết quả, cơ quan có thẩm quyền phải phát hành{" "}
              <strong>Phiếu xin lỗi và hẹn lại ngày trả kết quả (Mẫu số 04)</strong>{" "}
              cho tổ chức, công dân, nêu rõ lý do quá hạn và thời gian hẹn trả
              kết quả mới.
            </div>

            <div className="border border-gray-200 rounded-lg p-3.5 bg-gray-50/70 space-y-1.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-gray-500">Mã hồ sơ quá hạn:</span>{" "}
                  <strong className="font-mono text-red-700">{hoSo.maHoSo}</strong>
                </div>
                <div>
                  <span className="text-gray-500">Hẹn trả ban đầu:</span>{" "}
                  <strong className="font-mono text-red-600">
                    {hoSo.ngayHenTra}
                  </strong>
                </div>
              </div>
              <div>
                <span className="text-gray-500">Người nộp hồ sơ:</span>{" "}
                <strong className="text-gray-900 uppercase">
                  {hoSo.nguoiNop}
                </strong>{" "}
                ({hoSo.soDienThoai})
              </div>
              <div>
                <span className="text-gray-500">Thủ tục hành chính:</span>{" "}
                <strong className="text-gray-900">{hoSo.tenThuTuc}</strong>
              </div>
              <div>
                <span className="text-gray-500">Cơ sở đề nghị:</span>{" "}
                <strong className="text-emerald-800">
                  {hoSo.tenCoSoDeNghi}
                </strong>{" "}
                ({hoSo.diaDiemCoSo})
              </div>
            </div>

            {/* Form nhập lý do và ngày hẹn mới */}
            <div className="space-y-2">
              <label className="block font-bold text-gray-800">
                Lý do chậm trễ giải quyết hồ sơ <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={inputLyDoXinLoi}
                onChange={(e) => setInputLyDoXinLoi(e.target.value)}
                placeholder="Ghi rõ lý do khách quan/chủ quan dẫn đến quá hạn giải quyết hồ sơ..."
                className="w-full rounded-lg border border-gray-300 p-2.5 text-xs outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 font-sans"
              />
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-gray-600">
                <span className="text-gray-400">Gợi ý lý do chuẩn công vụ:</span>
                <button
                  type="button"
                  onClick={() =>
                    setInputLyDoXinLoi(
                      "Do quy trình thẩm định thực địa liên ngành cần phối hợp nhiều đơn vị (Phòng GD-ĐT, Trạm Y tế, Công an PCCC) và chờ kết quả kiểm định an toàn kỹ thuật"
                    )
                  }
                  className="px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer text-[10px] transition-colors"
                >
                  Thực địa liên ngành phối hợp
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setInputLyDoXinLoi(
                      "Do cơ sở cần bổ sung hồ sơ điều kiện an toàn phòng cháy chữa cháy và xác minh thêm chứng chỉ sư phạm mầm non của nhân sự phụ trách"
                    )
                  }
                  className="px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer text-[10px] transition-colors"
                >
                  Bổ sung điều kiện PCCC &amp; bằng cấp
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setInputLyDoXinLoi(
                      "Do khối lượng hồ sơ xét duyệt chính sách đầu năm học tăng cao và hệ thống đối soát dữ liệu dân cư đang đồng bộ dữ liệu"
                    )
                  }
                  className="px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer text-[10px] transition-colors"
                >
                  Đồng bộ CSDL Dân cư
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Thời gian hẹn trả kết quả mới <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={inputNgayHenMoi}
                  onChange={(e) => setInputNgayHenMoi(e.target.value)}
                  placeholder="VD: 28/10/2026"
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs font-mono font-bold outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Thẩm quyền ký phát hành
                </label>
                <input
                  type="text"
                  readOnly
                  value="TS. Nguyễn Văn Hùng - Chủ tịch UBND Phường Thủ Dầu Một"
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs bg-gray-100 font-semibold text-gray-700"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200 flex justify-end gap-2">
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
                <span>Ký số &amp; Phát hành Phiếu xin lỗi (Mẫu số 04)</span>
              </button>
            </div>
          </form>
        ) : (
          /* Đã phát hành Phiếu xin lỗi -> Hiển thị văn bản A4 chuẩn thể thức */
          <>
            <div
              className="p-8 overflow-y-auto font-serif text-[13px] leading-relaxed select-text flex-1"
              id="phieu-xin-loi-content"
            >
              {/* Quốc hiệu & Tiêu ngữ */}
              <div className="grid grid-cols-2 text-center pb-4 border-b border-gray-400">
                <div>
                  <div className="font-bold uppercase text-[12px]">
                    UBND THÀNH PHỐ THỦ DẦU MỘT
                  </div>
                  <div className="font-bold uppercase text-[13px] text-[#b91c1c]">
                    ỦY BAN NHÂN DÂN PHƯỜNG PHÚ CƯỜNG
                  </div>
                  <div className="text-[11px] font-sans font-medium text-gray-700">
                    Bộ phận Tiếp nhận và Trả kết quả (Một cửa)
                  </div>
                  <div className="text-[11px] font-sans italic mt-1">
                    Số:{" "}
                    <strong className="font-mono text-black">
                      {hoSo.phieuXinLoi.soPhieu}
                    </strong>
                  </div>
                </div>
                <div>
                  <div className="font-bold uppercase text-[12px]">
                    CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                  </div>
                  <div className="font-bold text-[13px]">
                    Độc lập - Tự do - Hạnh phúc
                  </div>
                  <div className="text-[11px] italic font-sans mt-2">
                    Thủ Dầu Một, ngày {hoSo.phieuXinLoi.ngayLap}
                  </div>
                </div>
              </div>

              {/* Tiêu đề */}
              <div className="text-center my-6">
                <h2 className="text-lg font-bold uppercase tracking-wide text-gray-900">
                  PHIẾU XIN LỖI VÀ HẸN LẠI NGÀY TRẢ KẾT QUẢ
                </h2>
                <div className="text-xs italic text-gray-600 font-sans mt-0.5">
                  (Mẫu số 04 - Ban hành kèm theo Nghị định số 61/2018/NĐ-CP ngày
                  23/4/2018 của Chính phủ)
                </div>
              </div>

              {/* Kính gửi */}
              <div className="space-y-3 mb-6 text-[13px]">
                <div className="font-medium">
                  Kính gửi: Ông/Bà{" "}
                  <strong className="uppercase text-gray-900">
                    {hoSo.nguoiNop}
                  </strong>
                </div>
                <div>
                  Đại diện cho: <strong>{hoSo.tenCoSoDeNghi}</strong>
                </div>
                <div>
                  Địa chỉ liên hệ:{" "}
                  {hoSo.diaChiLienHe || hoSo.diaDiemCoSo}
                </div>
                <div>
                  Số điện thoại:{" "}
                  <strong className="font-mono">{hoSo.soDienThoai}</strong> · Số
                  CCCD: <strong className="font-mono">{hoSo.cccd}</strong>
                </div>
              </div>

              {/* Nội dung trình bày xin lỗi */}
              <div className="space-y-3 text-[13px] text-justify leading-relaxed">
                <p>
                  Ngày {hoSo.ngayTiepNhan}, Ủy ban nhân dân Phường Thủ Dầu Một đã
                  tiếp nhận giải quyết hồ sơ đề nghị{" "}
                  <strong>{hoSo.tenThuTuc}</strong> của Ông/Bà; Mã số hồ sơ
                  điện tử:{" "}
                  <strong className="font-mono">{hoSo.maHoSo}</strong>.
                </p>
                <p>
                  Thời gian hẹn trả kết quả giải quyết hồ sơ theo Giấy hẹn Mẫu số
                  01: <strong>{hoSo.ngayHenTra}</strong>.
                </p>
                <p>
                  Tuy nhiên, đến nay hồ sơ chưa thể hoàn thành giải quyết và trả
                  kết quả cho Ông/Bà theo đúng thời hạn đã hẹn.
                </p>
                <div className="p-3 bg-amber-50/80 border-l-4 border-amber-600 rounded-r text-gray-800">
                  <strong>Lý do chậm trễ giải quyết:</strong>{" "}
                  {hoSo.phieuXinLoi.lyDo}.
                </div>
                <p>
                  Sự chậm trễ này đã làm ảnh hưởng đến thời gian, công việc và
                  hoạt động của Ông/Bà, Ủy ban nhân dân Phường Thủ Dầu Một thành
                  thật xin lỗi và xin hẹn lại ngày trả kết quả giải quyết hồ sơ
                  như sau:
                </p>
                <div className="border border-dashed border-gray-400 p-3 rounded-lg bg-gray-50 text-center font-sans">
                  <div className="text-xs text-gray-600">
                    Thời gian hẹn trả kết quả giải quyết hồ sơ lần này:
                  </div>
                  <div className="text-base font-extrabold text-[#b91c1c] mt-0.5">
                    Ngày {hoSo.phieuXinLoi.ngayHenMoi} (Trước 17 giờ 00)
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Địa điểm nhận kết quả: Bộ phận Tiếp nhận và Trả kết quả (Một
                    cửa) - UBND Phường Thủ Dầu Một (Số 01 đường Quang Trung, Phường
                    Phú Cường, TP. Thủ Dầu Một).
                  </div>
                </div>
                <p>Rất mong nhận được sự thông cảm và chia sẻ của Ông/Bà./.</p>
              </div>

              {/* Chữ ký & Con dấu */}
              <div className="grid grid-cols-2 text-center pt-8 font-sans">
                <div className="text-left text-[11px] text-gray-600 space-y-0.5">
                  <div className="font-bold uppercase text-gray-800">
                    Nơi nhận:
                  </div>
                  <div>- Như trên;</div>
                  <div>- Lãnh đạo UBND Phường;</div>
                  <div>- Cán bộ thụ lý hồ sơ;</div>
                  <div>- Lưu: VT, Một cửa.</div>
                </div>

                <div className="text-center">
                  <div className="font-bold text-xs uppercase text-gray-900">
                    TM. ỦY BAN NHÂN DÂN
                  </div>
                  <div className="font-bold text-xs uppercase text-[#b91c1c]">
                    CHỦ TỊCH
                  </div>

                  {/* Tem ký số SmartCA */}
                  <div className="py-2 flex justify-center">
                    <DigitalSignatureBadge
                      nguoiKy={hoSo.phieuXinLoi.nguoiKy}
                      chucVu="Chủ tịch UBND Phường Thủ Dầu Một"
                      ngayKy={hoSo.phieuXinLoi.ngayLap}
                      maXacThuc={`CA-PXL-${hoSo.id}-2026`}
                    />
                  </div>

                  <div className="font-bold text-xs text-gray-900 mt-1">
                    {hoSo.phieuXinLoi.nguoiKy}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Modal Document */}
            <div className="flex items-center justify-between px-6 py-3 border-t bg-gray-50 rounded-b-xl no-print">
              <span className="text-xs text-gray-500 font-sans">
                Mẫu số 04/NĐ-61 · Bộ phận Tiếp nhận &amp; Trả kết quả UBND
                Phường Thủ Dầu Một
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    exportDocAsWord(
                      `Phieu_xin_loi_${hoSo.maHoSo}`,
                      "phieu-xin-loi-content"
                    )
                  }
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="size-4" />
                  Tải file Word (.doc)
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="size-4" />
                  In Phiếu xin lỗi
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
