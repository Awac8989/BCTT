import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  Utensils,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Printer,
  FileText,
  DollarSign,
  UserCheck,
  Building2,
} from "lucide-react";
import { appStore, useAppState } from "@/services/app-state";
import {
  type CoSoYTeDuocTuNhan,
  type CoSoAttpVaThucAnDuongPho,
} from "@/data/domain-mock";
import { toast } from "sonner";

interface ModalKiemTraAttpYTeProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: "Y_TE" | "ATTP";
  itemYTe?: CoSoYTeDuocTuNhan | null;
  itemAttp?: CoSoAttpVaThucAnDuongPho | null;
}

export const ModalKiemTraAttpYTe: React.FC<ModalKiemTraAttpYTeProps> = ({
  isOpen,
  onClose,
  targetType,
  itemYTe,
  itemAttp,
}) => {
  const { currentUser } = useAppState();

  const [ketQua, setKetQua] = useState<string>("DAT_CHUAN");
  const [noiDungKiemTra, setNoiDungKiemTra] = useState(
    targetType === "Y_TE"
      ? "Kiểm tra giấy phép hoạt động, chứng chỉ hành nghề bác sĩ, điều kiện bảo quản thuốc và hóa đơn chứng từ liên thông dữ liệu Dược quốc gia."
      : "Kiểm tra giấy chứng nhận cơ sở đủ điều kiện ATTP, giấy khám sức khỏe nhân viên, quy trình bếp 1 chiều và test nhanh hàn the thực phẩm."
  );
  const [truongDoan, setTruongDoan] = useState(
    "BS. Nguyễn Văn Hào (Trạm trưởng Trạm Y tế kiêm Công chức Y tế phường)"
  );
  const [thanhVienDoan, setThanhVienDoan] = useState(
    "ThS. Trần Thị Kim Oanh (Công chức GD-Y tế), Đ/c Vũ Đình Cường (Công an phường)"
  );
  const [tienPhat, setTienPhat] = useState<number>(0);
  const [bienPhapKhacPhuc, setBienPhapKhacPhuc] = useState("");
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  if (!isOpen) return null;

  const tenCoSo = targetType === "Y_TE" ? itemYTe?.tenCoSo : itemAttp?.tenCoSo;
  const diaChi = targetType === "Y_TE" ? itemYTe?.diaChi : itemAttp?.diaChi;
  const khuPho = targetType === "Y_TE" ? itemYTe?.khuPho : itemAttp?.khuPho;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (targetType === "Y_TE" && itemYTe) {
      appStore.kiemTraCoSoYTe(
        itemYTe.id,
        ketQua as CoSoYTeDuocTuNhan["ketQuaKiemTraGanNhat"],
        noiDungKiemTra + (bienPhapKhacPhuc ? ` | Biện pháp: ${bienPhapKhacPhuc}` : "")
      );
      toast.success(`Đã lưu biên bản kiểm tra cơ sở y tế: ${tenCoSo}!`);
    } else if (targetType === "ATTP" && itemAttp) {
      appStore.kiemTraAttp(
        itemAttp.id,
        ketQua as CoSoAttpVaThucAnDuongPho["ketQuaKiemTra"],
        noiDungKiemTra + (bienPhapKhacPhuc ? ` | Yêu cầu: ${bienPhapKhacPhuc}` : ""),
        tienPhat > 0 ? tienPhat : undefined
      );
      toast.success(`Đã lưu biên bản kiểm tra liên ngành ATTP: ${tenCoSo}!`);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl rounded-xl bg-white shadow-2xl overflow-hidden border border-gray-200">
        {/* Header Modal */}
        <div className="flex items-center justify-between bg-gradient-to-r from-[#222d32] to-[#1e282c] border-b-2 border-[#dd4b39] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            {targetType === "Y_TE" ? (
              <Stethoscope className="size-6 text-[#dd4b39]" />
            ) : (
              <Utensils className="size-6 text-[#dd4b39]" />
            )}
            <div>
              <h3 className="text-base font-bold text-white">
                {targetType === "Y_TE"
                  ? "Biên bản Hậu kiểm Cơ sở Y tế / Dược tư nhân"
                  : "Biên bản Kiểm tra Liên ngành An toàn thực phẩm"}
              </h3>
              <p className="text-xs text-gray-300">
                Thực hiện theo Khoản 9 Điều 3 QĐ 2698/QĐ-UBND &amp; Nghị định số 148/2025/NĐ-CP
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[82vh] overflow-y-auto text-xs">
          {/* Thông tin đối tượng kiểm tra */}
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-4">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
              <span className="font-bold text-emerald-900 uppercase">Đối tượng kiểm tra</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-200 text-emerald-900">
                {khuPho} · P. Thủ Dầu Một
              </span>
            </div>
            <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Tên cơ sở:</span>{" "}
                <strong className="text-gray-900">{tenCoSo}</strong>
              </div>
              <div>
                <span className="text-gray-500">Địa chỉ:</span>{" "}
                <span className="text-gray-800 font-medium">{diaChi}</span>
              </div>
              {targetType === "Y_TE" && itemYTe && (
                <>
                  <div>
                    <span className="text-gray-500">Người chịu trách nhiệm:</span>{" "}
                    <span className="text-gray-800 font-bold">{itemYTe.nguoiChiuTrachNhiemChuyenMon}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Số CCHN / Giấy phép:</span>{" "}
                    <span className="font-mono text-gray-800 font-bold">
                      {itemYTe.soChungChiHanhNghe} / {itemYTe.soGiayPhepHoatDong}
                    </span>
                  </div>
                </>
              )}
              {targetType === "ATTP" && itemAttp && (
                <>
                  <div>
                    <span className="text-gray-500">Chủ cơ sở:</span>{" "}
                    <span className="text-gray-800 font-bold">{itemAttp.chuCoSo}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Giấy CN ATTP / Cam kết:</span>{" "}
                    <span className="font-mono text-gray-800 font-bold">
                      {itemAttp.soGiayChungNhanAttp} (Hạn: {itemAttp.hanSuDungAttp})
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Thành phần đoàn kiểm tra */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Trưởng đoàn kiểm tra</label>
              <input
                type="text"
                value={truongDoan}
                onChange={(e) => setTruongDoan(e.target.value)}
                className="w-full rounded border border-gray-300 p-2 text-xs outline-none focus:border-emerald-600 font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Thành viên phối hợp (Liên ngành)</label>
              <input
                type="text"
                value={thanhVienDoan}
                onChange={(e) => setThanhVienDoan(e.target.value)}
                className="w-full rounded border border-gray-300 p-2 text-xs outline-none focus:border-emerald-600 font-medium"
              />
            </div>
          </div>

          {/* Nội dung ghi nhận thực địa */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Ghi nhận kiểm tra thực địa &amp; Đánh giá điều kiện chuyên môn
            </label>
            <textarea
              rows={3}
              value={noiDungKiemTra}
              onChange={(e) => setNoiDungKiemTra(e.target.value)}
              className="w-full rounded border border-gray-300 p-2 text-xs outline-none focus:border-emerald-600 leading-relaxed"
            />
          </div>

          {/* Đánh giá kết luận */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Kết luận kiểm tra</label>
              <select
                value={ketQua}
                onChange={(e) => setKetQua(e.target.value)}
                className="w-full rounded border border-gray-300 p-2 text-xs outline-none focus:border-emerald-600 font-bold"
              >
                <option value="DAT_CHUAN">✓ Đạt chuẩn điều kiện quy định</option>
                <option value="NHAC_NHO">⚠ Nhắc nhở, yêu cầu khắc phục</option>
                <option value={targetType === "Y_TE" ? "XU_PHAT_HANH_CHINH" : "XU_PHAT"}>
                  ⛔ Xử phạt vi phạm hành chính
                </option>
              </select>
            </div>

            {(ketQua === "XU_PHAT_HANH_CHINH" || ketQua === "XU_PHAT") && (
              <div>
                <label className="block font-bold text-red-700 mb-1">Số tiền phạt vi phạm (VNĐ)</label>
                <div className="relative">
                  <input
                    type="number"
                    step={500000}
                    value={tienPhat}
                    onChange={(e) => setTienPhat(Number(e.target.value))}
                    className="w-full rounded border border-red-300 p-2 pl-7 text-xs font-mono font-bold text-red-700 outline-none focus:border-red-600"
                  />
                  <DollarSign className="size-3.5 absolute left-2 top-2.5 text-red-500" />
                </div>
              </div>
            )}
          </div>

          {/* Biện pháp khắc phục / thời hạn */}
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Biện pháp xử lý / Thời hạn hoàn thành khắc phục (nếu có)
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Khắc phục nhãn mác lưu mẫu trong vòng 05 ngày làm việc..."
              value={bienPhapKhacPhuc}
              onChange={(e) => setBienPhapKhacPhuc(e.target.value)}
              className="w-full rounded border border-gray-300 p-2 text-xs outline-none focus:border-emerald-600"
            />
          </div>

          {/* Preview Biên bản A4 */}
          {showPrintPreview && (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-4 bg-gray-50 text-[11px] leading-relaxed text-gray-800 space-y-2">
              <div className="text-center font-bold">
                <div>ỦY BAN NHÂN DÂN PHƯỜNG THỦ DẦU MỘT</div>
                <div className="uppercase underline text-xs">
                  {targetType === "Y_TE"
                    ? "BIÊN BẢN HẬU KIỂM CƠ SỞ Y TẾ - DƯỢC TƯ NHÂN"
                    : "BIÊN BẢN KIỂM TRA LIÊN NGÀNH AN TOÀN THỰC PHẨM"}
                </div>
                <div className="font-normal italic text-[10px]">
                  (Ban hành theo QĐ 2698/QĐ-UBND và Nghị định số 148/2025/NĐ-CP)
                </div>
              </div>
              <div className="pt-2">
                Hôm nay, ngày {new Date().toLocaleDateString("vi-VN")}, Đoàn kiểm tra liên ngành tiến hành kiểm tra tại:
                <br />- Tên cơ sở: <strong>{tenCoSo}</strong>
                <br />- Địa chỉ: {diaChi}
                <br />- Trưởng đoàn: {truongDoan}
                <br />- Thành viên: {thanhVienDoan}
                <br />- Nội dung kiểm tra: {noiDungKiemTra}
                <br />- Kết luận: <strong>{ketQua === "DAT_CHUAN" ? "ĐẠT CHUẨN" : "CẦN KHẮC PHỤC / XỬ PHẠT"}</strong>
                {tienPhat > 0 && <span> (Phạt tiền: {tienPhat.toLocaleString("vi-VN")} đồng)</span>}
              </div>
              <div className="pt-2 grid grid-cols-2 text-center text-[10px] font-bold">
                <div>ĐẠI DIỆN CƠ SỞ<br /><br /><br />(Ký, ghi rõ họ tên)</div>
                <div>TRƯỞNG ĐOÀN KIỂM TRA<br /><br /><br />{truongDoan.split("(")[0]}</div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowPrintPreview(!showPrintPreview)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-300 bg-white hover:bg-gray-50 font-bold text-gray-700 transition-colors"
            >
              <Printer className="size-3.5 text-gray-600" />
              {showPrintPreview ? "Ẩn mẫu in A4" : "Xem trước mẫu in Biên bản A4"}
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded bg-[#dd4b39] hover:bg-[#c23321] text-white font-bold shadow-xs transition-colors cursor-pointer"
              >
                <CheckCircle2 className="size-3.5" />
                Lưu Biên Bản &amp; Đồng Bộ Hệ Thống
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

