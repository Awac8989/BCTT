import { useState, useMemo } from "react";
import { Plus, X, Calculator, ShieldCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { HUYEN_LIST, HUYEN_PHUONG_MAP, PHUONG_LIST } from "@/data/mock";
import { calculateAllowance } from "@/services/calculator.service";
import { appStore, useAppState } from "@/services/app-state";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateProfileModal({ isOpen, onClose }: Props) {
  const { hoSoList } = useAppState();

  const [hoTen, setHoTen] = useState("");
  const [soCccd, setSoCccd] = useState("");
  const [ngaySinh, setNgaySinh] = useState("1955-07-27");
  const [gioiTinh, setGioiTinh] = useState<"NAM" | "NU">("NAM");
  const [huyen, setHuyen] = useState("TP. Thủ Dầu Một");
  const [wardId, setWardId] = useState(1);
  const [diaChi, setDiaChi] = useState("Số 12 đường CMT8, Khu phố 1");
  const [soHoSoTinh, setSoHoSoTinh] = useState("");
  const [soBhyt, setSoBhyt] = useState("");
  const [danToc, setDanToc] = useState("Kinh");
  const [banSaoGoc, setBanSaoGoc] = useState<"Bản gốc" | "Bản sao">("Bản gốc");
  const [maLoaiDt, setMaLoaiDt] = useState("THUONG_BINH");
  const [tyLe, setTyLe] = useState(61);
  const [coNguoiChamSoc, setCoNguoiChamSoc] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Phường liên động theo Huyện
  const availablePhuongs = useMemo(() => {
    return HUYEN_PHUONG_MAP[huyen] || PHUONG_LIST;
  }, [huyen]);

  // Live calculation preview
  const previewCalc = calculateAllowance({
    maLoaiDt,
    tyLeThuongTat: tyLe,
    coNguoiChamSoc,
  });

  // Kiểm tra trùng CCCD trực tiếp
  const isDuplicateCccd = hoSoList.some((h) => h.cccd === soCccd.trim());

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const result = appStore.createProfile({
      so_cccd: soCccd.trim(),
      ho_ten: hoTen.trim(),
      ngay_sinh: ngaySinh,
      gioi_tinh: gioiTinh,
      huyen,
      dia_chi_thuong_tru: diaChi.trim(),
      ward_id: wardId,
      so_ho_so_tinh: soHoSoTinh.trim() || undefined,
      so_bhyt: soBhyt.trim() || undefined,
      dan_toc: danToc,
      ban_sao_ban_goc: banSaoGoc,
      ma_loai_dt: maLoaiDt,
      ty_le_thuong_tat: Number(tyLe),
      co_nguoi_cham_soc: coNguoiChamSoc,
    });

    if (!result.success) {
      setErrorMsg(result.message);
      toast.error(result.message);
      return;
    }

    toast.success(`Tạo hồ sơ thành công: ${result.hoSo?.id}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[4px] border border-[#d2d6de] bg-white p-6 shadow-xl text-[#333333]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded p-1 text-[#777777] hover:bg-gray-100 hover:text-[#333333]"
        >
          <X className="size-5" />
        </button>

        <div className="flex items-center gap-2.5 border-b border-[#e5e7eb] pb-3">
          <div className="grid size-9 place-items-center rounded bg-[#dd4b39]/10 text-[#dd4b39]">
            <Plus className="size-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#333333]">Tiếp nhận &amp; Thêm mới hồ sơ Người có công</h2>
            <p className="text-xs text-[#777777]">
              SLĐTBXH Bình Dương · Zod validation &amp; Nghị định 75/2021/NĐ-CP
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-3 flex items-center gap-2 rounded border border-red-300 bg-red-50 p-2.5 text-xs text-red-600">
            <AlertCircle className="size-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          {/* Hàng 1: Họ tên & CCCD */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-medium text-[#444444]">Họ và tên (*)</label>
              <input
                required
                value={hoTen}
                onChange={(e) => setHoTen(e.target.value.toUpperCase())}
                placeholder="NGUYỄN VĂN A"
                className="w-full rounded-[3px] border border-[#d2d6de] bg-white px-3 py-1.5 text-xs text-[#333333] outline-none focus:border-[#3c8dbc] uppercase font-medium"
              />
            </div>

            <div>
              <label className="mb-1 block font-medium text-[#444444]">
                Số CCCD (12 chữ số) (*)
                {isDuplicateCccd && <span className="ml-1 text-red-600 text-[11px] font-bold">(Đã tồn tại)</span>}
              </label>
              <input
                required
                maxLength={12}
                value={soCccd}
                onChange={(e) => setSoCccd(e.target.value.replace(/\D/g, ""))}
                placeholder="079096001234"
                className={`w-full rounded-[3px] border bg-white px-3 py-1.5 font-mono text-xs text-[#333333] outline-none focus:border-[#3c8dbc] ${
                  isDuplicateCccd ? "border-red-500 ring-1 ring-red-500" : "border-[#d2d6de]"
                }`}
              />
            </div>
          </div>

          {/* Hàng 2: Số hồ sơ Tỉnh quản lý & Số BHYT */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-medium text-[#444444]">Số hồ sơ Tỉnh quản lý</label>
              <input
                value={soHoSoTinh}
                onChange={(e) => setSoHoSoTinh(e.target.value)}
                placeholder="VD: BD/16720-1 (Tự động nếu để trống)"
                className="w-full rounded-[3px] border border-[#d2d6de] bg-white px-3 py-1.5 font-mono text-xs text-[#333333] outline-none focus:border-[#3c8dbc]"
              />
            </div>

            <div>
              <label className="mb-1 block font-medium text-[#444444]">Số thẻ BHYT</label>
              <input
                value={soBhyt}
                onChange={(e) => setSoBhyt(e.target.value.toUpperCase())}
                placeholder="VD: HT2747420185921"
                className="w-full rounded-[3px] border border-[#d2d6de] bg-white px-3 py-1.5 font-mono text-xs text-[#333333] outline-none focus:border-[#3c8dbc]"
              />
            </div>
          </div>

          {/* Hàng 3: Ngày sinh, Giới tính, Dân tộc, Bản sao/gốc */}
          <div className="grid gap-3 sm:grid-cols-4">
            <div>
              <label className="mb-1 block font-medium text-[#444444]">Ngày sinh (*)</label>
              <input
                required
                type="date"
                value={ngaySinh}
                onChange={(e) => setNgaySinh(e.target.value)}
                className="w-full rounded-[3px] border border-[#d2d6de] bg-white px-2.5 py-1.5 text-xs text-[#333333] outline-none focus:border-[#3c8dbc]"
              />
            </div>

            <div>
              <label className="mb-1 block font-medium text-[#444444]">Giới tính</label>
              <select
                value={gioiTinh}
                onChange={(e) => setGioiTinh(e.target.value as any)}
                className="w-full rounded-[3px] border border-[#d2d6de] bg-white px-2.5 py-1.5 text-xs text-[#333333] outline-none focus:border-[#3c8dbc]"
              >
                <option value="NAM">Nam</option>
                <option value="NU">Nữ</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block font-medium text-[#444444]">Dân tộc</label>
              <select
                value={danToc}
                onChange={(e) => setDanToc(e.target.value)}
                className="w-full rounded-[3px] border border-[#d2d6de] bg-white px-2.5 py-1.5 text-xs text-[#333333] outline-none focus:border-[#3c8dbc]"
              >
                <option value="Kinh">Kinh</option>
                <option value="Hoa">Hoa</option>
                <option value="Chăm">Chăm</option>
                <option value="Tày">Tày</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block font-medium text-[#444444]">Bản sao/gốc</label>
              <select
                value={banSaoGoc}
                onChange={(e) => setBanSaoGoc(e.target.value as any)}
                className="w-full rounded-[3px] border border-[#d2d6de] bg-white px-2.5 py-1.5 text-xs text-[#333333] outline-none focus:border-[#3c8dbc]"
              >
                <option value="Bản gốc">Bản gốc</option>
                <option value="Bản sao">Bản sao</option>
              </select>
            </div>
          </div>

          {/* Hàng 4: Địa bàn hành chính (Huyện & Phường/Xã) */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-medium text-[#444444]">Thành phố / Huyện (*)</label>
              <select
                value={huyen}
                onChange={(e) => {
                  setHuyen(e.target.value);
                  setWardId(1);
                }}
                className="w-full rounded-[3px] border border-[#d2d6de] bg-white px-3 py-1.5 text-xs text-[#333333] outline-none focus:border-[#3c8dbc]"
              >
                {HUYEN_LIST.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block font-medium text-[#444444]">Xã / Phường (*)</label>
              <select
                value={wardId}
                onChange={(e) => setWardId(Number(e.target.value))}
                className="w-full rounded-[3px] border border-[#d2d6de] bg-white px-3 py-1.5 text-xs text-[#333333] outline-none focus:border-[#3c8dbc]"
              >
                {availablePhuongs.map((p, idx) => (
                  <option key={p} value={idx + 1}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block font-medium text-[#444444]">Địa chỉ thường trú (*)</label>
            <input
              required
              value={diaChi}
              onChange={(e) => setDiaChi(e.target.value)}
              placeholder="Số nhà, tên đường, ấp/khu phố"
              className="w-full rounded-[3px] border border-[#d2d6de] bg-white px-3 py-1.5 text-xs text-[#333333] outline-none focus:border-[#3c8dbc]"
            />
          </div>

          {/* Chính sách & Mức trợ cấp */}
          <div className="border-t border-[#e5e7eb] pt-3">
            <div className="text-xs text-[#dd4b39] mb-2 font-bold uppercase">Chế độ chính sách &amp; Mức trợ cấp</div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1 block font-medium text-[#444444]">Loại đối tượng</label>
                <select
                  value={maLoaiDt}
                  onChange={(e) => setMaLoaiDt(e.target.value)}
                  className="w-full rounded-[3px] border border-[#d2d6de] bg-white px-2.5 py-1.5 text-xs text-[#333333] outline-none focus:border-[#3c8dbc]"
                >
                  <option value="LIET_SI">Hồ sơ liệt sĩ / Thân nhân</option>
                  <option value="THUONG_BINH">Thương binh</option>
                  <option value="BENH_BINH">Bệnh binh</option>
                  <option value="ME_VNAH">Mẹ Việt Nam Anh hùng</option>
                  <option value="CHAT_DOC_HOA_HOC">Nhiễm chất độc hóa học</option>
                  <option value="TIEN_KHOI_NGHIA">Cán bộ tiền khởi nghĩa</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block font-medium text-[#444444]">Tỷ lệ thương tật (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={tyLe}
                  onChange={(e) => setTyLe(Number(e.target.value))}
                  className="w-full rounded-[3px] border border-[#d2d6de] bg-white px-2.5 py-1.5 text-xs text-[#333333] outline-none focus:border-[#3c8dbc]"
                />
              </div>

              <div className="flex items-center pt-4">
                <label className="flex cursor-pointer items-center gap-2 text-xs text-[#333333]">
                  <input
                    type="checkbox"
                    checked={coNguoiChamSoc}
                    onChange={(e) => setCoNguoiChamSoc(e.target.checked)}
                    className="size-4 rounded border-[#d2d6de]"
                  />
                  <span>Có người chăm sóc</span>
                </label>
              </div>
            </div>
          </div>

          {/* Hộp xem trước số tiền từ Spring Boot Engine */}
          <div className="rounded-[4px] border border-[#dd4b39]/30 bg-[#dd4b39]/5 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-bold text-[#dd4b39]">
                <Calculator className="size-3.5" />
                Mức tiền tự động (NĐ 75/2021)
              </span>
              <span className="font-mono text-[11px] text-[#666666]">Hệ số: ×{previewCalc.heSo}</span>
            </div>
            <div className="mt-1.5 flex items-baseline justify-between">
              <div className="text-[11px] text-[#666666]">
                <div>Trợ cấp hàng tháng: {previewCalc.troCapHangThang.toLocaleString("vi-VN")}đ</div>
                {previewCalc.phuCapChamSoc > 0 && (
                  <div>Phụ cấp chăm sóc: +{previewCalc.phuCapChamSoc.toLocaleString("vi-VN")}đ</div>
                )}
              </div>
              <div className="text-xl text-[#dd4b39] font-bold">
                {previewCalc.tongTienThucNhan.toLocaleString("vi-VN")}
                <span className="text-xs font-normal text-[#666666]"> đ/tháng</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#e5e7eb]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-[3px] border border-[#d2d6de] bg-white px-4 py-1.5 text-xs text-[#555555] hover:bg-gray-50"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isDuplicateCccd}
              className="flex items-center gap-1.5 rounded-[3px] bg-[#dd4b39] hover:bg-[#c82333] px-5 py-1.5 text-xs font-bold text-white transition-colors disabled:opacity-50 shadow-xs cursor-pointer"
            >
              <ShieldCheck className="size-4" />
              Lưu hồ sơ vào CSDL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
