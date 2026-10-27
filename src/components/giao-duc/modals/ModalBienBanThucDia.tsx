import React, { useState, useEffect } from "react";
import { ShieldCheck, X, Download, Printer, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { type HoSoTTHCGiaoDuc } from "@/data/domain-mock";
import { appStore } from "@/services/app-state";
import { exportDocAsWord } from "../utils";

interface ModalBienBanThucDiaProps {
  hoSo: HoSoTTHCGiaoDuc | null;
  onClose: () => void;
}

export const ModalBienBanThucDia: React.FC<ModalBienBanThucDiaProps> = ({
  hoSo,
  onClose,
}) => {
  const [inputThucDiaTruongDoan, setInputThucDiaTruongDoan] = useState(
    "ThS. Trần Thị Kim Oanh (Công chức GD-ĐT)"
  );
  const [inputThucDiaYTe, setInputThucDiaYTe] = useState(
    "BS. Nguyễn Văn Hào (Trạm Y tế)"
  );
  const [inputThucDiaPCCC, setInputThucDiaPCCC] = useState(
    "Đại úy Phạm Quốc Tuấn (Công an phường)"
  );
  const [inputThucDiaKetLuan, setInputThucDiaKetLuan] = useState<
    "DAT_YEU_CAU" | "CHUA_DAT_YEU_CAU"
  >("DAT_YEU_CAU");
  const [inputThucDiaNoiDung, setInputThucDiaNoiDung] = useState("");

  useEffect(() => {
    if (hoSo?.bienBanThucDia) {
      setInputThucDiaTruongDoan(hoSo.bienBanThucDia.truongDoan);
      setInputThucDiaYTe(hoSo.bienBanThucDia.daiDienYTe);
      setInputThucDiaPCCC(hoSo.bienBanThucDia.daiDienCongAnPCCC);
      setInputThucDiaKetLuan(hoSo.bienBanThucDia.ketLuan);
      setInputThucDiaNoiDung(hoSo.bienBanThucDia.noiDungKiemTra);
    } else {
      setInputThucDiaNoiDung("");
      setInputThucDiaKetLuan("DAT_YEU_CAU");
    }
  }, [hoSo]);

  if (!hoSo) return null;

  const handleSaveThucDia = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      ngayKiemTra: new Date().toLocaleDateString("vi-VN"),
      truongDoan: inputThucDiaTruongDoan,
      daiDienYTe: inputThucDiaYTe,
      daiDienCongAnPCCC: inputThucDiaPCCC,
      ketLuan: inputThucDiaKetLuan,
      bienBanSo: `${Math.floor(10 + Math.random() * 90)}/BB-LN/2026`,
      noiDungKiemTra:
        inputThucDiaNoiDung.trim() ||
        (inputThucDiaKetLuan === "DAT_YEU_CAU"
          ? "Đoàn kiểm tra liên ngành kết luận cơ sở đủ điều kiện về phòng học, thiết bị đồ chơi mầm non, bình chữa cháy PCCC và bếp ăn bán trú theo Thông tư 49/2021/TT-BGDĐT."
          : "Cơ sở chưa bảo đảm khoảng cách an toàn cầu thang và chưa đủ bình cứu hỏa MFZ4. Yêu cầu khắc phục trong 07 ngày."),
    };

    appStore.luuBienBanThucDia(hoSo.id, data);
    toast.success("Đã lưu Biên bản kiểm tra thẩm định thực địa liên ngành!", {
      description: `Biên bản số: ${data.bienBanSo} · Kết luận: ${
        data.ketLuan === "DAT_YEU_CAU" ? "ĐẠT YÊU CẦU" : "CHƯA ĐẠT"
      }`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white text-gray-900 rounded-xl shadow-2xl max-w-3xl w-full border border-gray-200 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-teal-700 text-white px-5 py-3.5 flex items-center justify-between shrink-0 shadow-xs rounded-t-xl">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5" />
            <h3 className="font-bold text-sm sm:text-base">
              {hoSo.maThuTuc === "TTHC-GD-BGD/04"
                ? "Biên bản Họp Thẩm định Hồ sơ Xét duyệt Hỗ trợ Chi phí Học tập & Tiền ăn trưa (NĐ 105 & 81)"
                : "Biên bản Kiểm tra Thẩm định Thực địa Liên ngành (Thông tư 49/2021)"}
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
          onSubmit={handleSaveThucDia}
          className="p-6 space-y-4 text-xs overflow-y-auto font-sans flex-1"
          id="bien-ban-thuc-dia-content"
        >
          <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-lg text-teal-900 text-xs leading-relaxed">
            {hoSo.maThuTuc === "TTHC-GD-BGD/04" ? (
              <div>
                <strong>
                  Hội đồng xét duyệt chính sách cấp xã/phường (theo Nghị định
                  81/2021/NĐ-CP &amp; 105/2020/NĐ-CP):
                </strong>{" "}
                Thẩm tra danh sách học sinh, đối chiếu Sổ hộ nghèo/cận nghèo và
                thông tin thường trú/tạm trú trên Hệ thống VNeID/Đề án 06 trước
                khi trình Chủ tịch UBND Phường ban hành Quyết định phê duyệt kinh
                phí.
              </div>
            ) : (
              <div>
                <strong>Thành phần Đoàn kiểm tra liên ngành:</strong> UBND
                Phường (Trưởng đoàn), Trạm Y tế (Phụ trách VSATTP &amp; y tế học
                đường), Công an Phường (Phụ trách PCCC), Ban điều hành Khu phố sở
                tại.
              </div>
            )}
          </div>

          {/* Thông tin hồ sơ & cơ sở */}
          <div className="grid grid-cols-2 gap-3 border border-gray-200 rounded-lg p-3.5 bg-gray-50/60">
            <div>
              <span className="text-gray-500">Mã hồ sơ:</span>{" "}
              <strong className="font-mono text-gray-900">{hoSo.maHoSo}</strong>
            </div>
            <div>
              <span className="text-gray-500">Người nộp / Đại diện:</span>{" "}
              <strong className="text-gray-900 uppercase">{hoSo.nguoiNop}</strong>
            </div>
            <div>
              <span className="text-gray-500">
                {hoSo.maThuTuc === "TTHC-GD-BGD/04"
                  ? "Đơn vị trường học đề nghị:"
                  : "Tên nhóm lớp đề nghị:"}
              </span>{" "}
              <strong className="text-emerald-800">{hoSo.tenCoSoDeNghi}</strong>
            </div>
            <div>
              <span className="text-gray-500">
                {hoSo.maThuTuc === "TTHC-GD-BGD/04"
                  ? "Địa chỉ trường:"
                  : "Địa chỉ thực địa:"}
              </span>{" "}
              <span className="text-gray-800 font-medium">
                {hoSo.diaDiemCoSo}
              </span>
            </div>
          </div>

          {/* Thành phần đoàn / Hội đồng */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                {hoSo.maThuTuc === "TTHC-GD-BGD/04"
                  ? "Chủ tịch Hội đồng xét duyệt"
                  : "Trưởng đoàn (UBND Phường)"}
              </label>
              <input
                type="text"
                value={inputThucDiaTruongDoan}
                onChange={(e) => setInputThucDiaTruongDoan(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2 text-xs outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                {hoSo.maThuTuc === "TTHC-GD-BGD/04"
                  ? "Thư ký (Công chức GD-ĐT)"
                  : "Đại diện Trạm Y tế"}
              </label>
              <input
                type="text"
                value={inputThucDiaYTe}
                onChange={(e) => setInputThucDiaYTe(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2 text-xs outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                {hoSo.maThuTuc === "TTHC-GD-BGD/04"
                  ? "Đại diện UBMTTQ / Cán bộ Giảm nghèo"
                  : "Đại diện Công an PCCC"}
              </label>
              <input
                type="text"
                value={inputThucDiaPCCC}
                onChange={(e) => setInputThucDiaPCCC(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2 text-xs outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700"
              />
            </div>
          </div>

          {/* Nội dung kiểm tra thực tế / Thẩm định hồ sơ */}
          <div>
            <label className="block font-bold text-gray-800 mb-1">
              {hoSo.maThuTuc === "TTHC-GD-BGD/04"
                ? "Nội dung họp Hội đồng thẩm tra danh sách đối tượng được hưởng chính sách"
                : "Nội dung kiểm tra thực tế điều kiện cơ sở mầm non"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={inputThucDiaNoiDung}
              onChange={(e) => setInputThucDiaNoiDung(e.target.value)}
              placeholder={
                hoSo.maThuTuc === "TTHC-GD-BGD/04"
                  ? "Hội đồng tiến hành rà soát 12 hồ sơ của học sinh xin trợ cấp ăn trưa và chi phí học tập học kỳ I năm học 2026-2027. Đối chiếu thông tin thường trú, sổ hộ nghèo, cận nghèo trên cơ sở dữ liệu VNeID. Tất cả 12 học sinh đều đúng đối tượng, đủ điều kiện hưởng trợ cấp tổng số tiền 18.600.000 đ..."
                  : "Ghi nhận diện tích phòng nuôi dưỡng, hệ thống camera, bình chữa cháy, lối thoát nạn phụ, tủ thuốc sơ cấp cứu, bếp ăn bán trú và điều kiện vệ sinh môi trường..."
              }
              className="w-full rounded-lg border border-gray-300 p-2.5 text-xs font-sans outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700"
            />
          </div>

          {/* Kết luận của đoàn */}
          <div>
            <label className="block font-bold text-gray-800 mb-1">
              Kết luận của{" "}
              {hoSo.maThuTuc === "TTHC-GD-BGD/04"
                ? "Hội đồng xét duyệt"
                : "Đoàn kiểm tra liên ngành"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-3 rounded-lg border flex items-center gap-2 cursor-pointer transition-colors ${
                  inputThucDiaKetLuan === "DAT_YEU_CAU"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold"
                    : "bg-gray-50 border-gray-300 text-gray-700"
                }`}
              >
                <input
                  type="radio"
                  name="ketLuan"
                  checked={inputThucDiaKetLuan === "DAT_YEU_CAU"}
                  onChange={() => setInputThucDiaKetLuan("DAT_YEU_CAU")}
                />
                <span>
                  {hoSo.maThuTuc === "TTHC-GD-BGD/04"
                    ? "ĐỦ ĐIỀU KIỆN (100% nhất trí đề nghị ban hành Quyết định phê duyệt)"
                    : "ĐẠT YÊU CẦU (Đủ điều kiện ban hành Quyết định thành lập)"}
                </span>
              </label>

              <label
                className={`p-3 rounded-lg border flex items-center gap-2 cursor-pointer transition-colors ${
                  inputThucDiaKetLuan === "CHUA_DAT_YEU_CAU"
                    ? "bg-red-50 border-red-500 text-red-900 font-bold"
                    : "bg-gray-50 border-gray-300 text-gray-700"
                }`}
              >
                <input
                  type="radio"
                  name="ketLuan"
                  checked={inputThucDiaKetLuan === "CHUA_DAT_YEU_CAU"}
                  onChange={() => setInputThucDiaKetLuan("CHUA_DAT_YEU_CAU")}
                />
                <span>
                  {hoSo.maThuTuc === "TTHC-GD-BGD/04"
                    ? "CHƯA ĐỦ ĐIỀU KIỆN (Yêu cầu xác minh lại đối tượng)"
                    : "CHƯA ĐẠT (Yêu cầu khắc phục / Bổ sung)"}
                </span>
              </label>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() =>
                  exportDocAsWord(
                    `Bien_ban_thuc_dia_${hoSo.maHoSo}`,
                    "bien-ban-thuc-dia-content"
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
                In Biên bản liên ngành
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
                className="px-4 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <CheckCircle2 className="size-3.5" />
                <span>Lưu Biên bản &amp; Cập nhật tiến độ</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
