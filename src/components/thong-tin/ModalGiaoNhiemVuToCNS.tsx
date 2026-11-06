import React, { useState } from "react";
import {
  Radio,
  Zap,
  Users,
  CheckCircle2,
  Calendar,
  Sparkles,
  ShieldCheck,
  Building2,
  Target,
  FileSignature,
  Printer,
  FileCheck,
} from "lucide-react";
import { useAppState, appStore } from "@/services/app-state";
import { type ToCongNgheSoCongDong } from "@/data/domain-mock";
import { toast } from "sonner";

interface ModalGiaoNhiemVuToCNSProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTo?: ToCongNgheSoCongDong | null;
}

export const ModalGiaoNhiemVuToCNS: React.FC<ModalGiaoNhiemVuToCNSProps> = ({
  isOpen,
  onClose,
  selectedTo,
}) => {
  const { toCNSList, currentUser } = useAppState();

  const [tenChienDich, setTenChienDich] = useState(
    "Chiến dịch 30 ngày đêm hỗ trợ đối tượng Người có công nhận trợ cấp không dùng tiền mặt & kích hoạt VNeID Mức 2"
  );
  const [selectedToId, setSelectedToId] = useState(selectedTo?.id || toCNSList[0]?.id || "ALL");
  const [chiTieuHoDan, setChiTieuHoDan] = useState(120);
  const [soBuoiRaQuan, setSoBuoiRaQuan] = useState(4);
  const [mucTieuVNeID, setMucTieuVNeID] = useState(95);
  const [thoiHanHoanThanh, setThoiHanHoanThanh] = useState("30/11/2026");
  const [noiDungChiDao, setNoiDungChiDao] = useState(
    "- Đi từng ngõ, gõ từng nhà hỗ trợ công dân, thân nhân NCC mở tài khoản ngân hàng miễn phí hoặc liên kết ví điện tử công vụ.\n- Hướng dẫn trực tiếp cài đặt ứng dụng VNeID, kích hoạt định danh mức 2 và tích hợp sổ sức khỏe điện tử.\n- Tuyên truyền công dân đánh giá hài lòng CSAT tại Kiosk Một cửa phường."
  );
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedToId === "ALL") {
      toCNSList.forEach((to) => {
        appStore.giaoNhiemVuChienDichToCNS(to.id, Number(soBuoiRaQuan), 2.5, 3.0);
      });
      toast.success(
        "Đã phát động chiến dịch số hóa cho toàn bộ 14 Tổ Công nghệ số cộng đồng phường Thủ Dầu Một!",
        {
          description: `Chỉ tiêu: Hỗ trợ ${chiTieuHoDan} hộ/tổ, thời hạn đến ${thoiHanHoanThanh}`,
        }
      );
    } else {
      const targetTo = toCNSList.find((t) => t.id === selectedToId);
      appStore.giaoNhiemVuChienDichToCNS(selectedToId, Number(soBuoiRaQuan), 3.0, 4.0);
      toast.success(
        `Đã giao nhiệm vụ chiến dịch số cho ${targetTo?.tenTo || "Tổ CNSCĐ"}!`,
        {
          description: `Ghi nhận thêm ${soBuoiRaQuan} buổi ra quân cao điểm`,
        }
      );
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in duration-200 max-h-[90vh] flex flex-col">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#222d32] to-[#1e282c] border-b-2 border-[#dd4b39] p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="size-5 text-[#dd4b39]" />
              <h3 className="font-bold text-base text-white">
                {showPrintPreview
                  ? "Kế Hoạch Ra Quân Chiến Dịch Số Hóa (Mẫu In A4)"
                  : "Giao Nhiệm Vụ Chiến Dịch Số Cho Tổ Công Nghệ Số Cộng Đồng"}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-white/80 hover:bg-white/10 cursor-pointer"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-gray-300 mt-1">
            Căn cứ Khoản 14 Điều 3 Quy định ban hành kèm Quyết định số 2698/QĐ-UBND của UBND phường Thủ Dầu Một
          </p>
        </div>

        {/* BODY */}
        <div className="overflow-y-auto p-5 flex-1">
          {showPrintPreview ? (
            /* PRINT PREVIEW */
            <div className="space-y-4 font-serif text-gray-900 border border-gray-300 p-6 rounded bg-amber-50/20 text-xs shadow-inner">
              <div className="flex justify-between items-start border-b border-gray-400 pb-3 text-center">
                <div>
                  <p className="font-bold uppercase text-[11px]">ỦY BAN NHÂN DÂN PHƯỜNG THỦ DẦU MỘT</p>
                  <p className="font-bold text-purple-900 text-[10px]">PHÒNG VĂN HÓA – XÃ HỘI</p>
                  <p className="text-[10px] italic">Số: 142/KH-VHXH</p>
                </div>
                <div>
                  <p className="font-bold uppercase text-[11px]">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                  <p className="font-bold text-[10px]">Độc lập – Tự do – Hạnh phúc</p>
                  <p className="text-[10px] italic">Thủ Dầu Một, ngày {new Date().toLocaleDateString("vi-VN")}</p>
                </div>
              </div>

              <div className="text-center pt-2">
                <h4 className="font-bold text-sm uppercase">KẾ HOẠCH RA QUÂN CAO ĐIỂM</h4>
                <p className="font-semibold text-xs text-purple-950 mt-1">{tenChienDich}</p>
              </div>

              <div className="space-y-2 text-justify">
                <p>
                  <strong>1. Mục đích - Yêu cầu:</strong> Triển khai hiệu quả Khoản 14 Điều 3 Quyết định số 2698/QĐ-UBND
                  ngày 03/11/2025; phát huy tối đa vai trò của Tổ công nghệ số cộng đồng tại các khu phố; phấn đấu 100% đối tượng chính sách người có công và an sinh xã hội trên địa bàn phường được tiếp cận phương thức chi trả qua tài khoản ngân hàng và định danh VNeID Mức 2.
                </p>
                <p>
                  <strong>2. Đơn vị thực hiện:</strong>{" "}
                  {selectedToId === "ALL"
                    ? "Toàn bộ 14 Tổ Công nghệ số cộng đồng trực thuộc 14 Khu phố phường Thủ Dầu Một."
                    : toCNSList.find((t) => t.id === selectedToId)?.tenTo}
                </p>
                <p>
                  <strong>3. Chỉ tiêu giao ước thi đua:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Tỷ lệ người dân kích hoạt VNeID Mức 2: Đạt tối thiểu <strong>{mucTieuVNeID}%</strong>.</li>
                  <li>Số lượng hộ dân/đối tượng được hỗ trợ trực tiếp: <strong>{chiTieuHoDan} hộ</strong>.</li>
                  <li>Số buổi ra quân thực địa tại nhà văn hóa khu phố: <strong>{soBuoiRaQuan} buổi/tuần</strong>.</li>
                  <li>Thời hạn hoàn thành toàn bộ chỉ tiêu: Trước ngày <strong>{thoiHanHoanThanh}</strong>.</li>
                </ul>
                <p>
                  <strong>4. Nội dung trọng tâm:</strong>
                </p>
                <div className="whitespace-pre-line bg-gray-50 p-2.5 rounded border border-gray-200 font-sans text-[11px]">
                  {noiDungChiDao}
                </div>
              </div>

              <div className="flex justify-between items-end pt-6">
                <div className="text-[10px]">
                  <p className="font-bold">Nơi nhận:</p>
                  <p>- TT Đảng ủy, TT HĐND phường (b/c);</p>
                  <p>- Chủ tịch, các PCT UBND phường;</p>
                  <p>- Ban Điều hành 14 Khu phố;</p>
                  <p>- 14 Tổ CNSCĐ (thực hiện);</p>
                  <p>- Lưu: VT, VHXH.</p>
                </div>
                <div className="text-center font-sans">
                  <p className="text-[10px] font-bold uppercase">TRƯỞNG PHÒNG VĂN HÓA – XÃ HỘI</p>
                  <div className="my-2 inline-flex items-center gap-1 rounded bg-emerald-50 border border-emerald-300 px-2 py-1 text-[10px] font-bold text-emerald-800">
                    <ShieldCheck className="size-3 text-emerald-600" />
                    <span>ĐÃ KÝ SỐ SMARTCA CHUYÊN DÙNG</span>
                  </div>
                  <p className="font-bold text-xs mt-1 text-gray-900">{currentUser?.fullName || "Nguyễn Văn Hùng"}</p>
                </div>
              </div>
            </div>
          ) : (
            /* FORM GIAO NHIỆM VỤ */
            <form id="giao-nhiem-vu-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Tên chiến dịch chuyển đổi số:
                </label>
                <input
                  type="text"
                  required
                  value={tenChienDich}
                  onChange={(e) => setTenChienDich(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2.5 text-xs font-medium focus:border-purple-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Tổ CNS cộng đồng tiếp nhận:
                  </label>
                  <select
                    value={selectedToId}
                    onChange={(e) => setSelectedToId(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium focus:border-purple-500 focus:outline-hidden"
                  >
                    <option value="ALL">★ Tất cả 14 Tổ CNSCĐ (Đợt ra quân toàn phường)</option>
                    {toCNSList.map((to) => (
                      <option key={to.id} value={to.id}>
                        {to.tenTo} ({to.khuPho} - {to.toTruong})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Thời hạn hoàn thành:
                  </label>
                  <input
                    type="text"
                    value={thoiHanHoanThanh}
                    onChange={(e) => setThoiHanHoanThanh(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2 text-xs font-mono focus:border-purple-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Chỉ tiêu hỗ trợ (Hộ):
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={1000}
                    value={chiTieuHoDan}
                    onChange={(e) => setChiTieuHoDan(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 p-2 text-xs font-mono focus:border-purple-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Số buổi ra quân:
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={soBuoiRaQuan}
                    onChange={(e) => setSoBuoiRaQuan(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 p-2 text-xs font-mono focus:border-purple-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Mục tiêu VNeID Mức 2:
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={70}
                      max={100}
                      value={mucTieuVNeID}
                      onChange={(e) => setMucTieuVNeID(Number(e.target.value))}
                      className="w-full rounded-lg border border-gray-300 p-2 text-xs font-mono focus:border-purple-500 focus:outline-hidden"
                    />
                    <span className="text-xs font-bold text-gray-600">%</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nội dung trọng tâm & Hướng dẫn tác nghiệp:
                </label>
                <textarea
                  rows={3}
                  value={noiDungChiDao}
                  onChange={(e) => setNoiDungChiDao(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2.5 text-xs focus:border-purple-500 focus:outline-hidden"
                />
              </div>

              <div className="rounded-lg bg-purple-50 border border-purple-200 p-3 text-xs text-purple-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="size-4 text-purple-600" />
                  Quy chế Đánh giá & Thi đua Khen thưởng:
                </div>
                <p className="text-[11px] text-purple-800">
                  Tổ CNSCĐ hoàn thành vượt chỉ tiêu sớm sẽ được Phòng Văn hóa – Xã hội tham mưu UBND phường Thủ Dầu Một khen thưởng đột xuất và cộng điểm thi đua Khu phố văn hóa năm 2026.
                </p>
              </div>
            </form>
          )}
        </div>

        {/* FOOTER */}
        <div className="bg-gray-50 border-t border-gray-200 px-5 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowPrintPreview(!showPrintPreview)}
            className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100"
          >
            <Printer className="size-3.5" />
            <span>{showPrintPreview ? "Quay lại Form" : "Xem Bản In Kế Hoạch A4"}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100"
            >
              Đóng
            </button>
            {!showPrintPreview && (
              <button
                type="submit"
                form="giao-nhiem-vu-form"
                className="flex items-center gap-1.5 rounded-lg bg-[#dd4b39] hover:bg-[#c23321] px-4 py-1.5 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
              >
                <FileSignature className="size-3.5" />
                <span>Ký Phê Duyệt &amp; Giao Việc</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

