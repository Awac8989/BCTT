import React, { useState } from "react";
import { X, ShieldCheck, Utensils, Thermometer, CheckCircle2, AlertTriangle, FileText } from "lucide-react";
import { appStore } from "@/services/app-state";
import { type KiemThuc3BuocItem } from "@/data/domain-mock";
import { toast } from "sonner";

interface ModalThemKiemThuc3BuocProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ModalThemKiemThuc3Buoc: React.FC<ModalThemKiemThuc3BuocProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [tenCoSo, setTenCoSo] = useState("Trường Mầm non Tuổi Thơ (Khu phố 1)");
  const [loaiCoSo, setLoaiCoSo] = useState<KiemThuc3BuocItem["loaiCoSo"]>("MAM_NON_TU_THUC");
  const [khuPho, setKhuPho] = useState("Khu phố 1");
  const [soSuatAn, setSoSuatAn] = useState(210);
  const [nguonGocThucPham, setNguonGocThucPham] = useState("Thịt heo CP, Rau sạch Hợp tác xã Phú Hòa có hóa đơn và giấy ATTP");
  const [donViCungCap, setDonViCungCap] = useState("Công ty Cổ phần Thực phẩm Sạch Bình Dương");
  const [hoaDonGiayAttp, setHoaDonGiayAttp] = useState(true);
  const [tinhTrangBaoGoi, setTinhTrangBaoGoi] = useState(true);

  // Bước 2
  const [quyTrinhBep1Chieu, setQuyTrinhBep1Chieu] = useState(true);
  const [trangPhucTapDe, setTrangPhucTapDe] = useState(true);
  const [nguonNuocSach, setNguonNuocSach] = useState(true);
  const [nhietDoCheBien, setNhietDoCheBien] = useState(true);

  // Bước 3
  const [camQuanMuiVi, setCamQuanMuiVi] = useState("Mùi vị đặc trưng, thức ăn chín kỹ trên 100°C, không ôi thiu");
  const [tuLanhLuuMauRieng, setTuLanhLuuMauRieng] = useState(true);
  const [nhietDoTuLanh, setNhietDoTuLanh] = useState(3.5);
  const [niemPhongHopMau24h, setNiemPhongHopMau24h] = useState(true);

  const [ketLuanChung, setKetLuanChung] = useState<KiemThuc3BuocItem["ketLuanChung"]>("DU_DIEU_KIEN_AN_TOAN");
  const [canBoYTePhuTrach, setCanBoYTePhuTrach] = useState("BS. Nguyễn Văn Hào (Trạm Y tế Phường)");
  const [bienPhapXuLy, setBienPhapXuLy] = useState("Đạt chuẩn 3 bước kiểm thực ATTP theo QĐ 1246/QĐ-BYT. Cho phép phục vụ bán trú.");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenCoSo || soSuatAn <= 0) {
      toast.error("Vui lòng điền tên cơ sở và số suất ăn hợp lệ");
      return;
    }

    appStore.themKiemThuc3Buoc({
      tenCoSo,
      loaiCoSo,
      khuPho,
      ngayKiemTra: new Date().toLocaleDateString("vi-VN"),
      soSuatAn: Number(soSuatAn),
      buoc1_NhapNguyenLieu: {
        nguonGocThucPham,
        donViCungCap,
        hoaDonGiayAttp,
        tinhTrangBaoGoiTemMac: tinhTrangBaoGoi,
        danhGia: hoaDonGiayAttp && tinhTrangBaoGoi ? "DAT" : "KHONG_DAT",
      },
      buoc2_CheBien: {
        quyTrinhBep1Chieu,
        trangPhucTapDeBaoHo: trangPhucTapDe,
        nguonNuocSachDatChuan: nguonNuocSach,
        nhietDoCheBienDamBao: nhietDoCheBien,
        danhGia: quyTrinhBep1Chieu && trangPhucTapDe && nguonNuocSach ? "DAT" : "KHONG_DAT",
      },
      buoc3_TruocKhiAnVaLuuMau: {
        camQuanMuiViDoChuc: camQuanMuiVi,
        tuLanhLuuMauRieng,
        nhietDoTuLanhLuuDoC: Number(nhietDoTuLanh),
        niemPhongHopMau24h,
        danhGia: tuLanhLuuMauRieng && niemPhongHopMau24h ? "DAT" : "KHONG_DAT",
      },
      ketLuanChung,
      truongDoanKiemTra: "Ban Giám hiệu trường & Đoàn kiểm tra liên ngành ATTP Phường",
      canBoYTePhuTrach,
      bienPhapXuLy,
    });

    toast.success("Đã ghi sổ kiểm thực 3 bước ATTP bán trú thành công (QĐ 1246/QĐ-BYT)", {
      description: `Cơ sở: ${tenCoSo} · ${soSuatAn} suất ăn bán trú.`,
    });
    onSuccess?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-emerald-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-xs">
              <Utensils className="size-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-base font-bold">Lập Sổ Kiểm Thực 3 Bước ATTP Bếp Ăn Bán Trú</h3>
              <p className="text-xs text-emerald-200">
                Thực hiện nghiêm Quyết định số 1246/QĐ-BYT của Bộ Y tế · Lưu mẫu ≥ 24 giờ
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-white/80 hover:text-white"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Thông tin chung */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-600" />
              1. Thông Tin Cơ Sở Giáo Dục & Bếp Ăn
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tên Cơ sở / Trường học *</label>
                <input
                  type="text"
                  required
                  value={tenCoSo}
                  onChange={(e) => setTenCoSo(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Loại hình</label>
                <select
                  value={loaiCoSo}
                  onChange={(e) => setLoaiCoSo(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  <option value="MAM_NON_TU_THUC">Mầm non tư thục / Nhóm trẻ</option>
                  <option value="MAM_NON_CONG_LAP">Mầm non công lập</option>
                  <option value="TIEU_HOC_BAN_TRU">Tiểu học bán trú</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Khu phố</label>
                <input
                  type="text"
                  value={khuPho}
                  onChange={(e) => setKhuPho(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-medium"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Số suất ăn bán trú thực tế *</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={soSuatAn}
                  onChange={(e) => setSoSuatAn(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-bold text-emerald-800"
                />
              </div>
            </div>
          </div>

          {/* BƯỚC 1: KIỂM TRA KHI NHẬP NGUYÊN LIỆU */}
          <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/50 space-y-3">
            <h4 className="text-xs font-bold text-sky-900 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px] font-bold">1</span>
                Bước 1: Kiểm Tra Nhập Nguyên Liệu Thực Phẩm (Sáng sớm)
              </span>
              <span className="text-[11px] font-semibold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md border border-sky-300">
                Lúc 06:00 - 06:45
              </span>
            </h4>
            <div className="space-y-2 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nguồn gốc & chủng loại nguyên liệu</label>
                <input
                  type="text"
                  value={nguonGocThucPham}
                  onChange={(e) => setNguonGocThucPham(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-medium"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Đơn vị cung ứng / Hợp đồng chuỗi</label>
                <input
                  type="text"
                  value={donViCungCap}
                  onChange={(e) => setDonViCungCap(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-medium"
                />
              </div>
              <div className="flex flex-wrap gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={hoaDonGiayAttp}
                    onChange={(e) => setHoaDonGiayAttp(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  Có hóa đơn/chứng từ kiểm dịch thú y &amp; ATTP
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={tinhTrangBaoGoi}
                    onChange={(e) => setTinhTrangBaoGoi(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  Bao gói nguyên vẹn, tem nhãn hạn dùng rõ ràng
                </label>
              </div>
            </div>
          </div>

          {/* BƯỚC 2: KIỂM TRA QUÁ TRÌNH CHẾ BIẾN */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-3">
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold">2</span>
                Bước 2: Kiểm Tra Quy Trình Sơ Chế &amp; Chế Biến (Khu Bếp)
              </span>
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                Lúc 09:00 - 10:15
              </span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
                <input
                  type="checkbox"
                  checked={quyTrinhBep1Chieu}
                  onChange={(e) => setQuyTrinhBep1Chieu(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded"
                />
                Quy trình bếp 1 chiều (Sống - Chín riêng biệt)
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
                <input
                  type="checkbox"
                  checked={trangPhucTapDe}
                  onChange={(e) => setTrangPhucTapDe(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded"
                />
                Găng tay, tạp dề, khẩu trang, mũ bảo hộ đủ
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
                <input
                  type="checkbox"
                  checked={nguonNuocSach}
                  onChange={(e) => setNguonNuocSach(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded"
                />
                Nguồn nước sạch đạt quy chuẩn QCVN 01-1:2018/BYT
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
                <input
                  type="checkbox"
                  checked={nhietDoCheBien}
                  onChange={(e) => setNhietDoCheBien(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded"
                />
                Thức ăn nấu chín kỹ, dụng cụ chứa đựng inox 304
              </label>
            </div>
          </div>

          {/* BƯỚC 3: KIỂM TRA TRƯỚC KHI ĂN & LƯU MẪU 24H */}
          <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/60 space-y-3">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">3</span>
                Bước 3: Kiểm Tra Trước Khi Ăn &amp; Lưu Mẫu Tủ Lạnh 24 Giờ
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300">
                Bắt buộc theo QĐ 1246/QĐ-BYT
              </span>
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Cảm quan mùi vị &amp; trạng thái món ăn</label>
                <input
                  type="text"
                  value={camQuanMuiVi}
                  onChange={(e) => setCamQuanMuiVi(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-medium"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-2.5 bg-white rounded-lg border border-emerald-200 flex flex-col justify-between">
                  <span className="font-semibold text-slate-700">Tủ lạnh lưu mẫu</span>
                  <label className="flex items-center gap-2 mt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tuLanhLuuMauRieng}
                      onChange={(e) => setTuLanhLuuMauRieng(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    Tủ lạnh lưu mẫu riêng biệt
                  </label>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-emerald-200 flex flex-col justify-between">
                  <span className="font-semibold text-slate-700">Nhiệt độ tủ lưu mẫu (°C)</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Thermometer className="size-4 text-emerald-600" />
                    <input
                      type="number"
                      step="0.1"
                      value={nhietDoTuLanh}
                      onChange={(e) => setNhietDoTuLanh(Number(e.target.value))}
                      className="w-20 px-2 py-1 bg-slate-50 border border-slate-300 rounded font-bold text-emerald-800"
                    />
                    <span className="text-[11px] text-slate-500">(Chuẩn 2°C - 8°C)</span>
                  </div>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-emerald-200 flex flex-col justify-between">
                  <span className="font-semibold text-slate-700">Niêm phong mẫu lưu</span>
                  <label className="flex items-center gap-2 mt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={niemPhongHopMau24h}
                      onChange={(e) => setNiemPhongHopMau24h(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    Dán nhãn niêm phong 24h
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* KẾT LUẬN & CHỮ KÝ */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <FileText className="size-4 text-slate-600" />
              4. Kết Luận Giám Sát &amp; Biện Pháp Xử Lý
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Kết luận kiểm thực 3 bước</label>
                <select
                  value={ketLuanChung}
                  onChange={(e) => setKetLuanChung(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-bold"
                >
                  <option value="DU_DIEU_KIEN_AN_TOAN">✅ ĐỦ ĐIỀU KIỆN AN TOÀN THỰC PHẨM</option>
                  <option value="YEU_CAU_KHAC_PHUC">⚠️ YÊU CẦU KHẮC PHỤC TRONG 03 NGÀY</option>
                  <option value="DINH_CHI_BEP_AN">⛔ TẠM ĐÌNH CHỈ BẾP ĂN BÁN TRÚ</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Cán bộ Y tế học đường / Phụ trách</label>
                <input
                  type="text"
                  value={canBoYTePhuTrach}
                  onChange={(e) => setCanBoYTePhuTrach(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-medium"
                />
              </div>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Biện pháp xử lý &amp; Ghi chú biên bản</label>
              <textarea
                rows={2}
                value={bienPhapXuLy}
                onChange={(e) => setBienPhapXuLy(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-medium"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="size-4" />
              Lưu Sổ Kiểm Thực 3 Bước &amp; Ký Biên Bản
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
