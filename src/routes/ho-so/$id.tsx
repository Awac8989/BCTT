import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Save,
  Printer,
  ChevronRight,
  Home,
  CheckCircle2,
  FileText,
  Users,
  Award,
  Paperclip,
  ArrowLeft,
  Calendar,
  UserMinus,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { GiayHenModal } from "@/components/GiayHenModal";
import { BaoGiamModal } from "@/components/BaoGiamModal";
import { DigitalSignatureBadge } from "@/components/DigitalSignatureBadge";
import { useAppState, appStore } from "@/services/app-state";
import { calculateAllowance } from "@/services/calculator.service";
import { formatVND, HUYEN_LIST, HUYEN_PHUONG_MAP } from "@/data/mock";

export const Route = createFileRoute("/ho-so/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Thông tin hồ sơ liệt sĩ ${params.id} · SLĐTBXH Bình Dương` },
      {
        name: "description",
        content: "Cổng thông tin hồ sơ liệt sĩ và người có công tỉnh Bình Dương - HSThongTinHoSoLietSy.",
      },
    ],
  }),
  component: HoSoLietSiDetail,
});

function HoSoLietSiDetail() {
  const { id } = Route.useParams();
  const { hoSoList } = useAppState();

  const hoSo = hoSoList.find((h) => h.id === id) ?? hoSoList[0]!;

  // 4 Tabs chuẩn ảnh chụp màn hình CSDL Người có công Bình Dương
  const [activeTab, setActiveTab] = useState<"THONG_TIN" | "THAN_NHAN" | "UU_DAI" | "DINH_KEM">("THONG_TIN");

  // Form State các trường thông tin hồ sơ & liệt sĩ
  const [loaiHoSo, setLoaiHoSo] = useState("Hồ sơ liệt sỹ");
  const [banSaoGoc, setBanSaoGoc] = useState(hoSo.banSaoBanGoc || "Bản gốc");
  const [soHoSoTinh, setSoHoSoTinh] = useState(hoSo.soHoSoTinh || "04878");
  const [soHoSoBo, setSoHoSoBo] = useState(hoSo.soHoSoBo || "BD/LS-07956");
  const [huyen, setHuyen] = useState(hoSo.huyen || "Thủ Dầu Một");
  const [phuong, setPhuong] = useState(hoSo.phuong || "Chánh Nghĩa");
  const [chuyenDenTu, setChuyenDenTu] = useState(hoSo.hoSoChuyenDenTu || "-- Chọn --");
  const [chuyenDi, setChuyenDi] = useState(hoSo.hoSoChuyenDi || "-- Chọn --");

  // Form State thông tin cơ bản liệt sĩ
  const [hoTen, setHoTen] = useState(hoSo.hoTen || "Hồ Văn Lên");
  const [biDanh, setBiDanh] = useState(hoSo.biDanh || "");
  const [namSinh, setNamSinh] = useState(String(hoSo.namSinh || "1926"));
  const [gioiTinh, setGioiTinh] = useState(hoSo.gioiTinh || "Nam");
  const [danToc, setDanToc] = useState(hoSo.danToc || "Kinh");
  const [queQuan, setQueQuan] = useState(
    hoSo.queQuan || "Xã Chánh Hiệp, Châu Thành, Thị xã Thủ Dầu Một, tỉnh Sông Bé",
  );
  const [truQuan, setTruQuan] = useState(hoSo.truQuan || "Chánh Nghĩa, Thủ Dầu Một");
  const [nhapNguThang, setNhapNguThang] = useState(hoSo.ngayNhapNguChiTiet?.thang || "08");
  const [nhapNguNam, setNhapNguNam] = useState(hoSo.ngayNhapNguChiTiet?.nam || "1945");
  const [capBac, setCapBac] = useState(hoSo.capBac || "");
  const [chucVu, setChucVu] = useState(hoSo.chucVu || "Ủy viên Ban tuyên huấn tỉnh");
  const [coQuanHySinh, setCoQuanHySinh] = useState(hoSo.coQuanDonViKhiHySinh || "Ban Tuyên giáo tỉnh Sông Bé");
  const [hySinhThang, setHySinhThang] = useState(hoSo.hySinhNgayChiTiet?.thang || "07");
  const [hySinhNam, setHySinhNam] = useState(hoSo.hySinhNgayChiTiet?.nam || "1949");
  const [thoiKy, setThoiKy] = useState(hoSo.thoiKy || "Kháng Pháp (từ 19/08/1945 - 20/07/1954)");
  const [truongHopHySinh, setTruongHopHySinh] = useState(
    hoSo.truongHopHySinh || "Trên đường đi công tác về đơn vị bị địch càn quét bắn đồng chí hy sinh",
  );
  const [noiHySinh, setNoiHySinh] = useState(hoSo.noiHySinh || "An Mỹ, Châu Thành");
  const [noiMaiTang, setNoiMaiTang] = useState(hoSo.noiMaiTang || "An Mỹ, Châu Thành");
  const [giayBaoTu, setGiayBaoTu] = useState(hoSo.giayBaoTu || "239/07");
  const [baoTuNgay, setBaoTuNgay] = useState(hoSo.baoTuNgayChiTiet?.ngay || "13");
  const [baoTuThang, setBaoTuThang] = useState(hoSo.baoTuNgayChiTiet?.thang || "06");
  const [baoTuNam, setBaoTuNam] = useState(hoSo.baoTuNgayChiTiet?.nam || "1977");
  const [donViBaoTu, setDonViBaoTu] = useState(hoSo.donViCapGiayBaoTu || "Ban Tuyên giáo tỉnh Sông Bé");
  const [soBang, setSoBang] = useState(hoSo.soBangToQuocGhiCong || "GC887K");
  const [qdCapBang, setQdCapBang] = useState(hoSo.qdCapBangSo || "1312TTga");
  const [qdNgay, setQdNgay] = useState(hoSo.qdCapBangNgayChiTiet?.ngay || "26");
  const [qdThang, setQdThang] = useState(hoSo.qdCapBangNgayChiTiet?.thang || "10");
  const [qdNam, setQdNam] = useState(hoSo.qdCapBangNgayChiTiet?.nam || "1977");
  const [thuocDoiTuong, setThuocDoiTuong] = useState(hoSo.thuocDoiTuong || "Dân Chính");
  const [viTriLuu, setViTriLuu] = useState(
    hoSo.viTriLuuHoSo || "Kho lưu trữ Sở LĐTBXH Bình Dương - Kệ A3, Hộp 12",
  );
  const [isAnhHung, setIsAnhHung] = useState(hoSo.isAnhHung || false);

  // Tính trợ cấp
  const calc = calculateAllowance({
    maLoaiDt: hoSo.loaiDoiTuong,
    tyLeThuongTat: hoSo.tyLeTonThuong,
  });

  const [showGiayHen, setShowGiayHen] = useState(false);
  const [showBaoGiam, setShowBaoGiam] = useState(false);

  const handleSave = () => {
    toast.success(`Đã cập nhật thông tin hồ sơ liệt sĩ ${hoTen} (Số tỉnh: ${soHoSoTinh})`);
  };

  const handleKySo = () => {
    appStore.kySoHoSo(hoSo.id);
    toast.success("Lãnh đạo đã ký số điện tử SmartCA phê duyệt hồ sơ thành công!");
  };

  return (
    <AppShell>
      {/* 1. Tiêu đề chuẩn ảnh chụp màn hình */}
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-xl font-bold text-[#333333] flex items-baseline">
          Quản lý hồ sơ
          <span className="text-sm font-normal text-[#777777] ml-2">Hồ sơ liệt sĩ</span>
        </h1>

        <div className="flex items-center gap-2 text-xs flex-wrap">
          <Link
            to="/ho-so"
            className="flex items-center gap-1 rounded-[3px] border border-[#d2d6de] bg-white px-3 py-1 text-[#555555] hover:bg-gray-50"
          >
            <ArrowLeft className="size-3.5" />
            Về danh sách hồ sơ
          </Link>
          <button
            type="button"
            onClick={() => setShowGiayHen(true)}
            className="flex items-center gap-1 rounded-[3px] bg-[#00c0ef] hover:bg-[#00a7d0] px-3.5 py-1 font-bold text-white shadow-xs cursor-pointer"
          >
            <Printer className="size-3.5" />
            In Giấy hẹn Một cửa (Kèm QR)
          </button>
          {!hoSo.isTuTran && (
            <button
              type="button"
              onClick={() => setShowBaoGiam(true)}
              className="flex items-center gap-1 rounded-[3px] bg-[#dd4b39] hover:bg-[#c82333] px-3.5 py-1 font-bold text-white shadow-xs cursor-pointer"
            >
              <UserMinus className="size-3.5" />
              Báo giảm từ trần
            </button>
          )}
          <button
            type="button"
            onClick={handleKySo}
            className="flex items-center gap-1 rounded-[3px] bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 px-3.5 py-1 font-bold text-white shadow-xs cursor-pointer"
          >
            <ShieldCheck className="size-3.5 text-amber-200" />
            Ký số SmartCA
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1 rounded-[3px] bg-[#00a65a] hover:bg-[#008d4c] px-3.5 py-1 font-bold text-white shadow-xs cursor-pointer"
          >
            <Save className="size-3.5" />
            Lưu thay đổi
          </button>
        </div>
      </div>

      {/* Banner cảnh báo nếu đối tượng đã từ trần */}
      {hoSo.isTuTran && (
        <div className="mb-3 p-3 bg-red-50 border border-red-300 rounded text-red-900 text-xs flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-red-600 shrink-0" />
            <div>
              <strong>HỒ SƠ ĐÃ BÁO GIẢM TỪ TRẦN:</strong> Ngày mất:{" "}
              <strong>{hoSo.ngayTuTran}</strong>. Trích lục khai tử số:{" "}
              <strong className="font-mono">{hoSo.soTrichLucKhaiTu}</strong>. Quyết định mai táng
              phí: <strong>{hoSo.ngayQuyetDinhMaiTang || "Đã ban hành"}</strong> ({formatVND(hoSo.soTienMaiTangPhi || 20550000)}).
            </div>
          </div>
          <span className="px-2.5 py-0.5 bg-red-600 text-white text-[10px] font-black rounded uppercase shrink-0">
            ĐÃ NGỪNG TRỢ CẤP
          </span>
        </div>
      )}

      {/* Con dấu ký số nếu đã ký */}
      {hoSo.kySoLanhDao && (
        <div className="mb-3">
          <DigitalSignatureBadge
            nguoiKy={hoSo.kySoLanhDao.nguoiKy}
            chucVu={hoSo.kySoLanhDao.chucVu}
            ngayKy={hoSo.kySoLanhDao.ngayKy}
            maXacThuc={hoSo.kySoLanhDao.maXacThuc}
          />
        </div>
      )}

      {/* 2. Thanh Tabs chuẩn mẫu ảnh */}
      <div className="flex border-b border-[#d2d6de] text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab("THONG_TIN")}
          className={`px-4 py-2 border-t-2 transition-all cursor-pointer ${
            activeTab === "THONG_TIN"
              ? "border-t-[#dd4b39] border-x border-b-0 border-[#d2d6de] bg-white font-bold text-[#dd4b39] -mb-[1px]"
              : "border-t-transparent text-[#555555] hover:text-[#dd4b39] hover:bg-white/50"
          }`}
        >
          Thông tin hồ sơ &amp; liệt sỹ
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("THAN_NHAN")}
          className={`px-4 py-2 border-t-2 transition-all cursor-pointer ${
            activeTab === "THAN_NHAN"
              ? "border-t-[#dd4b39] border-x border-b-0 border-[#d2d6de] bg-white font-bold text-[#dd4b39] -mb-[1px]"
              : "border-t-transparent text-[#555555] hover:text-[#dd4b39] hover:bg-white/50"
          }`}
        >
          Thân nhân liệt sỹ
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("UU_DAI")}
          className={`px-4 py-2 border-t-2 transition-all cursor-pointer ${
            activeTab === "UU_DAI"
              ? "border-t-[#dd4b39] border-x border-b-0 border-[#d2d6de] bg-white font-bold text-[#dd4b39] -mb-[1px]"
              : "border-t-transparent text-[#555555] hover:text-[#dd4b39] hover:bg-white/50"
          }`}
        >
          Thông tin ưu đãi
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("DINH_KEM")}
          className={`px-4 py-2 border-t-2 transition-all cursor-pointer ${
            activeTab === "DINH_KEM"
              ? "border-t-[#dd4b39] border-x border-b-0 border-[#d2d6de] bg-white font-bold text-[#dd4b39] -mb-[1px]"
              : "border-t-transparent text-[#555555] hover:text-[#dd4b39] hover:bg-white/50"
          }`}
        >
          Hồ sơ đính kèm
        </button>
      </div>

      {/* 3. Nội dung TAB 1: THÔNG TIN HỒ SƠ & LIỆT SỸ (CHÍNH THỨC KHỚP 100% ẢNH CHỤP) */}
      {activeTab === "THONG_TIN" && (
        <div className="border border-t-0 border-[#d2d6de] bg-white p-5 shadow-xs text-xs text-[#333333]">
          {/* KHỐI 1: THÔNG TIN HỒ SƠ */}
          <div className="mb-4">
            <h2 className="text-xs font-bold text-[#dd4b39] mb-3">Thông tin hồ sơ</h2>

            <div className="space-y-2.5">
              {/* Hàng 1 */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <label className="w-36 text-right text-[#333333] shrink-0">Loại hồ sơ:</label>
                  <select
                    value={loaiHoSo}
                    onChange={(e) => setLoaiHoSo(e.target.value)}
                    className="w-full rounded-[2px] border border-[#d2d6de] bg-white px-2 py-1 text-xs outline-none"
                  >
                    <option value="Hồ sơ liệt sỹ">Hồ sơ liệt sỹ</option>
                    <option value="Hồ sơ thương binh">Hồ sơ thương binh</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-36 text-right text-[#333333] shrink-0">Bản sao/ bản gốc:</label>
                  <select
                    value={banSaoGoc}
                    onChange={(e) => setBanSaoGoc(e.target.value as any)}
                    className="w-full rounded-[2px] border border-[#d2d6de] bg-white px-2 py-1 text-xs outline-none"
                  >
                    <option value="Bản gốc">Bản gốc</option>
                    <option value="Bản sao">Bản sao</option>
                  </select>
                </div>
              </div>

              {/* Hàng 2 */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <label className="w-36 text-right text-[#333333] shrink-0">Số hồ sơ Tỉnh quản lý:</label>
                  <input
                    value={soHoSoTinh}
                    onChange={(e) => setSoHoSoTinh(e.target.value)}
                    className="w-full rounded-[2px] border border-[#d2d6de] bg-white px-2 py-1 text-xs outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-36 text-right text-[#333333] shrink-0">Số hồ sơ Bộ quản lý:</label>
                  <input
                    value={soHoSoBo}
                    onChange={(e) => setSoHoSoBo(e.target.value)}
                    className="w-full rounded-[2px] border border-[#d2d6de] bg-white px-2 py-1 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Hàng 3 */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <label className="w-36 text-right text-[#333333] shrink-0 font-medium">* Quận / Huyện tiếp nhận:</label>
                  <input
                    value={huyen}
                    onChange={(e) => setHuyen(e.target.value)}
                    className="w-full rounded-[2px] border border-[#d2d6de] bg-white px-2 py-1 text-xs outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-36 text-right text-[#333333] shrink-0 font-medium">* Phường / Xã tiếp nhận:</label>
                  <input
                    value={phuong}
                    onChange={(e) => setPhuong(e.target.value)}
                    className="w-full rounded-[2px] border border-[#d2d6de] bg-white px-2 py-1 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Hàng 4: Chuyển đến từ */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <label className="w-36 text-right text-[#333333] shrink-0">Hồ sơ chuyển đến từ:</label>
                  <select
                    value={chuyenDenTu}
                    onChange={(e) => setChuyenDenTu(e.target.value)}
                    className="w-full rounded-[2px] border border-[#d2d6de] bg-white px-2 py-1 text-xs outline-none"
                  >
                    <option value="-- Chọn --">-- Chọn --</option>
                    <option value="Quân khu 7">Quân khu 7</option>
                    <option value="Bộ chỉ huy quân sự tỉnh">Bộ chỉ huy quân sự tỉnh</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-right w-16 text-[#555555]">Ngày</span>
                  <input className="w-12 rounded-[2px] border border-[#d2d6de] bg-white px-1 py-1 text-center text-xs outline-none" />
                  <span className="text-[#555555]">Tháng</span>
                  <input className="w-12 rounded-[2px] border border-[#d2d6de] bg-white px-1 py-1 text-center text-xs outline-none" />
                  <span className="text-[#555555]">Năm</span>
                  <input className="w-16 rounded-[2px] border border-[#d2d6de] bg-white px-1 py-1 text-center text-xs outline-none" />
                </div>
              </div>

              {/* Hàng 5: Chuyển đi */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <label className="w-36 text-right text-[#333333] shrink-0">Hồ sơ chuyển đi:</label>
                  <select
                    value={chuyenDi}
                    onChange={(e) => setChuyenDi(e.target.value)}
                    className="w-full rounded-[2px] border border-[#d2d6de] bg-white px-2 py-1 text-xs outline-none"
                  >
                    <option value="-- Chọn --">-- Chọn --</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-right w-16 text-[#555555]">Ngày</span>
                  <input className="w-12 rounded-[2px] border border-[#d2d6de] bg-white px-1 py-1 text-center text-xs outline-none" />
                  <span className="text-[#555555]">Tháng</span>
                  <input className="w-12 rounded-[2px] border border-[#d2d6de] bg-white px-1 py-1 text-center text-xs outline-none" />
                  <span className="text-[#555555]">Năm</span>
                  <input className="w-16 rounded-[2px] border border-[#d2d6de] bg-white px-1 py-1 text-center text-xs outline-none" />
                </div>
              </div>
            </div>
          </div>

          <hr className="border-[#e5e7eb] my-4" />

          {/* KHỐI 2: THÔNG TIN CƠ BẢN */}
          <div>
            <h2 className="text-xs font-bold text-[#dd4b39] mb-3">Thông tin cơ bản</h2>

            <div className="space-y-2.5">
              {/* Họ tên & Bí danh */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <label className="w-36 text-right text-[#333333] shrink-0 font-medium">* Họ và tên:</label>
                  <input
                    value={hoTen}
                    onChange={(e) => setHoTen(e.target.value)}
                    className="w-full rounded-[2px] border border-[#d2d6de] bg-white px-2 py-1 text-xs font-medium outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-36 text-right text-[#333333] shrink-0">Bí danh:</label>
                  <input
                    value={biDanh}
                    onChange={(e) => setBiDanh(e.target.value)}
                    className="w-full rounded-[2px] border border-[#d2d6de] bg-white px-2 py-1 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Sinh ngày & Giới tính & Dân tộc */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex items-center gap-1.5 sm:col-span-1">
                  <label className="w-36 text-right text-[#333333] shrink-0">Sinh ngày:</label>
                  <input className="w-10 rounded-[2px] border border-[#d2d6de] bg-white px-1 py-1 text-center text-xs outline-none" placeholder="Ngày" />
                  <input className="w-10 rounded-[2px] border border-[#d2d6de] bg-white px-1 py-1 text-center text-xs outline-none" placeholder="Tháng" />
                  <input
                    value={namSinh}
                    onChange={(e) => setNamSinh(e.target.value)}
                    className="w-16 rounded-[2px] border border-[#d2d6de] bg-white px-1 py-1 text-center text-xs outline-none"
                    placeholder="1926"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-20 text-right text-[#333333] shrink-0 font-medium">* Giới tính:</label>
                  <select
                    value={gioiTinh}
                    onChange={(e) => setGioiTinh(e.target.value as any)}
                    className="w-full rounded-[2px] border border-[#d2d6de] bg-white px-2 py-1 text-xs outline-none"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-20 text-right text-[#333333] shrink-0 font-medium">* Dân tộc:</label>
                  <select
                    value={danToc}
                    onChange={(e) => setDanToc(e.target.value)}
                    className="w-full rounded-[2px] border border-[#d2d6de] bg-white px-2 py-1 text-xs outline-none"
                  >
                    <option value="Kinh">Kinh</option>
                    <option value="Hoa">Hoa</option>
                    <option value="Chăm">Chăm</option>
                  </select>
                </div>
              </div>

              {/* Quê quán */}
              <div className="flex items-center gap-2">
                <label className="w-36 text-right text-[#333333] shrink-0 font-medium">Quê quán:</label>
                <input
                  value={queQuan}
                  onChange={(e) => setQueQuan(e.target.value)}
                  className="w-full rounded-[2px] border border-[#d2d6de] bg-white px-2 py-1 text-xs outline-none"
                />
              </div>

              {/* Trú quán & Ngày nhập ngũ */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <label className="w-36 text-right text-[#333333] shrink-0">Trú quán:</label>
                  <input
                    value={truQuan}
                    onChange={(e) => setTruQuan(e.target.value)}
                    className="w-full rounded-[2px] border border-[#d2d6de] bg-white px-2 py-1 text-xs outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-36 text-right text-[#333333] shrink-0">Ngày nhập ngũ:</label>
                  <span className="text-[#555555]">Ngày</span>
                  <input className="w-10 rounded-[2px] border border-[#d2d6de] bg-white px-1 py-1 text-center text-xs outline-none" />
                  <span className="text-[#555555]">Tháng</span>
                  <input
                    value={nhapNguThang}
                    onChange={(e) => setNhapNguThang(e.target.value)}
                    className="w-10 rounded-[2px] border border-[#d2d6de] bg-white px-1 py-1 text-center text-xs outline-none"
                  />
                  <span className="text-[#555555]">Năm</span>
                  <input
                    value={nhapNguNam}
                    onChange={(e) => setNhapNguNam(e.target.value)}
                    className="w-16 rounded-[2px] border border-[#d2d6de] bg-white px-1 py-1 text-center text-xs outline-none"
                  />
                </div>
              </div>

              {/* Cấp bậc & Chức vụ */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <label className="w-36 text-right text-[#333333] shrink-0">Cấp bậc:</label>
                  <input
                    value={capBac}
                    onChange={(e) => setCapBac(e.target.value)}
                    className="w-full rounded-[2px] border border-[#d2d6de] bg-white px-2 py-1 text-xs outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-36 text-right text-[#333333] shrink-0 font-medium">Chức vụ:</label>
                  <input
                    value={chucVu}
                    onChange={(e) => setChucVu(e.target.value)}
                    className="w-full rounded-[2px] border border-[#d2d6de] bg-white px-2 py-1 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Cơ quan khi hy sinh & Hy sinh ngày */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <label className="w-36 text-right text-[#333333] shrink-0">Cơ quan, đơn vị khi hy sinh:</label>
                  <input
                    value={coQuanHySinh}
                    onChange={(e) => setCoQuanHySinh(e.target.value)}
                    className="w-full rounded-[2px] border border-[#d2d6de] bg-white px-2 py-1 text-xs outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-36 text-right text-[#333333] shrink-0 font-medium">Hy sinh ngày:</label>
                  <span className="text-[#555555]">Ngày</span>
                  <input className="w-10 rounded-[2px] border border-[#d2d6de] bg-white px-1 py-1 text-center text-xs outline-none" />
                  <span className="text-[#555555]">Tháng</span>
                  <input
                    value={hySinhThang}
                    onChange={(e) => setHySinhThang(e.target.value)}
                    className="w-10 rounded-[2px] border border-[#d2d6de] bg-white px-1 py-1 text-center text-xs outline-none"
                  />
                  <span className="text-[#555555]">Năm</span>
                  <input
                    value={hySinhNam}
                    onChange={(e) => setHySinhNam(e.target.value)}
                    className="w-16 rounded-[2px] border border-[#d2d6de] bg-white px-1 py-1 text-center text-xs outline-none"
                  />
                </div>
              </div>

              {/* Thời kỳ & Trường hợp hy sinh */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <label className="w-36 text-right text-[#333333] shrink-0 font-medium">Thời kỳ:</label>
                  <select
                    value={thoiKy}
                    onChange={(e) => setThoiKy(e.target.value)}
                    className="w-full rounded-[2px] border border-[#d2d6de] bg-white px-2 py-1 text-xs outline-none"
                  >
                    <option value="Kháng Pháp (từ 19/08/1945 - 20/07/1954)">Kháng Pháp (từ 19/08/1945 - 20/07/1954)</option>
                    <option value="Kháng Mỹ (từ 20/07/1954 - 30/04/1975)">Kháng Mỹ (từ 20/07/1954 - 30/04/1975)</option>
                    <option value="Chiến tranh bảo vệ Tổ quốc">Chiến tranh bảo vệ Tổ quốc</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-36 text-right text-[#333333] shrink-0 font-medium">Trường hợp hy sinh:</label>
                  <input
                    value={truongHopHySinh}
                    onChange={(e) => setTruongHopHySinh(e.target.value)}
                    className="w-full rounded-[2px] border border-[#d2d6de] bg-white px-2 py-1 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Nơi hy sinh & Nơi mai táng */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <label className="w-36 text-right text-[#333333] shrink-0">Nơi hy sinh:</label>
                  <input
                    value={noiHySinh}
                    onChange={(e) => setNoiHySinh(e.target.value)}
                    className="w-full rounded-[2px] border border-[#d2d6de] bg-white px-2 py-1 text-xs outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-36 text-right text-[#333333] shrink-0">Nơi mai táng:</label>
                  <input
                    value={noiMaiTang}
                    onChange={(e) => setNoiMaiTang(e.target.value)}
                    className="w-full rounded-[2px] border border-[#d2d6de] bg-white px-2 py-1 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Giấy báo tử & Báo tử ngày */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <label className="w-36 text-right text-[#333333] shrink-0 font-medium">Giấy báo tử:</label>
                  <input
                    value={giayBaoTu}
                    onChange={(e) => setGiayBaoTu(e.target.value)}
                    className="w-full rounded-[2px] border border-[#d2d6de] bg-white px-2 py-1 text-xs outline-none font-mono"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-36 text-right text-[#333333] shrink-0 font-medium">Báo tử ngày:</label>
                  <input
                    value={baoTuNgay}
                    onChange={(e) => setBaoTuNgay(e.target.value)}
                    className="w-10 rounded-[2px] border border-[#d2d6de] bg-white px-1 py-1 text-center text-xs outline-none"
                  />
                  <span className="text-[#555555]">Tháng</span>
                  <input
                    value={baoTuThang}
                    onChange={(e) => setBaoTuThang(e.target.value)}
                    className="w-10 rounded-[2px] border border-[#d2d6de] bg-white px-1 py-1 text-center text-xs outline-none"
                  />
                  <span className="text-[#555555]">Năm</span>
                  <input
                    value={baoTuNam}
                    onChange={(e) => setBaoTuNam(e.target.value)}
                    className="w-16 rounded-[2px] border border-[#d2d6de] bg-white px-1 py-1 text-center text-xs outline-none"
                  />
                </div>
              </div>

              {/* Đơn vị cấp giấy báo tử & Số Bằng TQGC */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <label className="w-36 text-right text-[#333333] shrink-0">Đơn vị cấp giấy báo tử:</label>
                  <input
                    value={donViBaoTu}
                    onChange={(e) => setDonViBaoTu(e.target.value)}
                    className="w-full rounded-[2px] border border-[#d2d6de] bg-white px-2 py-1 text-xs outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-36 text-right text-[#333333] shrink-0 font-medium">Số Bằng tổ quốc ghi công:</label>
                  <input
                    value={soBang}
                    onChange={(e) => setSoBang(e.target.value)}
                    className="w-full rounded-[2px] border border-[#d2d6de] bg-white px-2 py-1 text-xs outline-none font-mono"
                  />
                </div>
              </div>

              {/* QĐ cấp bằng & Ngày cấp */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <label className="w-36 text-right text-[#333333] shrink-0 font-medium">QĐ cấp bằng số:</label>
                  <input
                    value={qdCapBang}
                    onChange={(e) => setQdCapBang(e.target.value)}
                    className="w-full rounded-[2px] border border-[#d2d6de] bg-white px-2 py-1 text-xs outline-none font-mono"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-36 text-right text-[#333333] shrink-0 font-medium">Ngày:</label>
                  <input
                    value={qdNgay}
                    onChange={(e) => setQdNgay(e.target.value)}
                    className="w-10 rounded-[2px] border border-[#d2d6de] bg-white px-1 py-1 text-center text-xs outline-none"
                  />
                  <span className="text-[#555555]">Tháng</span>
                  <input
                    value={qdThang}
                    onChange={(e) => setQdThang(e.target.value)}
                    className="w-10 rounded-[2px] border border-[#d2d6de] bg-white px-1 py-1 text-center text-xs outline-none"
                  />
                  <span className="text-[#555555]">Năm</span>
                  <input
                    value={qdNam}
                    onChange={(e) => setQdNam(e.target.value)}
                    className="w-16 rounded-[2px] border border-[#d2d6de] bg-white px-1 py-1 text-center text-xs outline-none"
                  />
                </div>
              </div>

              {/* Thuộc đối tượng & Vị trí lưu hồ sơ */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <label className="w-36 text-right text-[#333333] shrink-0 font-medium">Thuộc đối tượng:</label>
                  <select
                    value={thuocDoiTuong}
                    onChange={(e) => setThuocDoiTuong(e.target.value)}
                    className="w-full rounded-[2px] border border-[#d2d6de] bg-white px-2 py-1 text-xs outline-none"
                  >
                    <option value="Dân Chính">Dân Chính</option>
                    <option value="Quân đội">Quân đội</option>
                    <option value="Công an">Công an</option>
                    <option value="Dân quân du kích">Dân quân du kích</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-36 text-right text-[#333333] shrink-0">Vị trí lưu hồ sơ:</label>
                  <input
                    value={viTriLuu}
                    onChange={(e) => setViTriLuu(e.target.value)}
                    className="w-full rounded-[2px] border border-[#d2d6de] bg-white px-2 py-1 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Liệt sĩ là anh hùng */}
              <div className="flex items-center gap-2 pt-1">
                <label className="w-36 text-right text-[#333333] shrink-0">Liệt sỹ là anh hùng:</label>
                <input
                  type="checkbox"
                  checked={isAnhHung}
                  onChange={(e) => setIsAnhHung(e.target.checked)}
                  className="size-4 rounded border-[#d2d6de]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Nội dung TAB 2: THÂN NHÂN LIỆT SỸ */}
      {activeTab === "THAN_NHAN" && (
        <div className="border border-t-0 border-[#d2d6de] bg-white p-5 shadow-xs text-xs text-[#333333]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-[#dd4b39]">Danh sách thân nhân hưởng chế độ tuất &amp; thờ cúng</h2>
            <button
              type="button"
              onClick={() => toast.info("Mở biểu mẫu thêm thân nhân liệt sĩ")}
              className="rounded-[3px] bg-[#dd4b39] text-white px-3 py-1 font-bold shadow-xs hover:bg-[#c82333]"
            >
              + Thêm thân nhân
            </button>
          </div>

          <table className="w-full border-collapse border border-[#d2d6de] text-left">
            <thead>
              <tr className="bg-[#f9fafb] border-b border-[#d2d6de] font-bold">
                <th className="p-2 border-r border-[#d2d6de] w-12 text-center">STT</th>
                <th className="p-2 border-r border-[#d2d6de]">Họ và tên thân nhân</th>
                <th className="p-2 border-r border-[#d2d6de]">Mối quan hệ</th>
                <th className="p-2 border-r border-[#d2d6de]">Năm sinh</th>
                <th className="p-2 border-r border-[#d2d6de]">Địa chỉ cư trú</th>
                <th className="p-2 border-r border-[#d2d6de]">Chế độ trợ cấp</th>
                <th className="p-2 text-right">Mức tiền hưởng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e7eb]">
              {hoSo.thanNhanLietSi && hoSo.thanNhanLietSi.length > 0 ? (
                hoSo.thanNhanLietSi.map((tn, idx) => (
                  <tr key={tn.hoTen}>
                    <td className="p-2 text-center border-r border-[#d2d6de]">{idx + 1}</td>
                    <td className="p-2 font-medium border-r border-[#d2d6de]">{tn.hoTen}</td>
                    <td className="p-2 border-r border-[#d2d6de]">{tn.quanHe}</td>
                    <td className="p-2 border-r border-[#d2d6de]">{tn.namSinh}</td>
                    <td className="p-2 border-r border-[#d2d6de]">{tn.diaChi}</td>
                    <td className="p-2 border-r border-[#d2d6de] font-semibold text-[#00a65a]">{tn.cheDoHuong}</td>
                    <td className="p-2 text-right font-mono font-bold text-[#dd4b39]">
                      {tn.soTien.toLocaleString("vi-VN")} đ
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-2 text-center border-r border-[#d2d6de]">1</td>
                  <td className="p-2 font-medium border-r border-[#d2d6de]">Hồ Thị Mai</td>
                  <td className="p-2 border-r border-[#d2d6de]">Con đẻ</td>
                  <td className="p-2 border-r border-[#d2d6de]">1948</td>
                  <td className="p-2 border-r border-[#d2d6de]">Phường Chánh Nghĩa, TP. Thủ Dầu Một</td>
                  <td className="p-2 border-r border-[#d2d6de] font-semibold text-[#00a65a]">Người thờ cúng liệt sĩ</td>
                  <td className="p-2 text-right font-mono font-bold text-[#dd4b39]">1.400.000 đ/năm</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 5. Nội dung TAB 3: THÔNG TIN ƯU ĐÃI */}
      {activeTab === "UU_DAI" && (
        <div className="border border-t-0 border-[#d2d6de] bg-white p-5 shadow-xs text-xs text-[#333333]">
          <h2 className="text-xs font-bold text-[#dd4b39] mb-3">Chính sách trợ cấp ưu đãi theo Nghị định 75/2021/NĐ-CP</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded border border-[#d2d6de] p-3 bg-[#f9fafb]">
              <div className="text-[#666666] font-medium">Trợ cấp tiền tuất hàng tháng:</div>
              <div className="font-mono text-lg font-bold text-[#dd4b39] mt-1">2.055.000 đ/tháng</div>
              <div className="text-[11px] text-[#777777] mt-0.5">1.0 lần mức chuẩn theo quy định</div>
            </div>

            <div className="rounded border border-[#d2d6de] p-3 bg-[#f9fafb]">
              <div className="text-[#666666] font-medium">Trợ cấp thờ cúng liệt sĩ hàng năm:</div>
              <div className="font-mono text-lg font-bold text-[#dd4b39] mt-1">1.400.000 đ/năm</div>
              <div className="text-[11px] text-[#777777] mt-0.5">Phát 1 lần vào dịp kỷ niệm 27/7</div>
            </div>

            <div className="rounded border border-[#d2d6de] p-3 bg-[#f9fafb]">
              <div className="text-[#666666] font-medium">Chế độ Bảo hiểm Y tế (BHYT):</div>
              <div className="font-bold text-[#00a65a] text-sm mt-1">Miễn phí 100% (Mã HT2)</div>
              <div className="text-[11px] text-[#777777] mt-0.5">Số thẻ: {hoSo.soBhyt || "HT2747420120291"}</div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Nội dung TAB 4: HỒ SƠ ĐÍNH KÈM */}
      {activeTab === "DINH_KEM" && (
        <div className="border border-t-0 border-[#d2d6de] bg-white p-5 shadow-xs text-xs text-[#333333]">
          <h2 className="text-xs font-bold text-[#dd4b39] mb-3">Tài liệu hồ sơ số hóa lưu trữ</h2>
          <div className="space-y-2">
            {[
              { name: "Bằng Tổ quốc ghi công số GC887K (Bản gốc scan)", dungLuong: "3.2 MB", ngay: "26/10/1977" },
              { name: "Giấy báo tử số 239/07 do Ban Tuyên giáo Sông Bé cấp", dungLuong: "1.8 MB", ngay: "13/06/1977" },
              { name: "Trích lục hồ sơ liệt sĩ lưu trữ tại Sở LĐTBXH Bình Dương", dungLuong: "2.4 MB", ngay: "10/05/2018" },
              { name: "Bản khai thân nhân liệt sĩ hưởng chế độ thờ cúng", dungLuong: "1.1 MB", ngay: "15/06/2021" },
            ].map((file) => (
              <div key={file.name} className="flex items-center justify-between border border-[#e5e7eb] rounded p-2.5 bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <Paperclip className="size-4 text-[#00c0ef]" />
                  <span className="font-medium text-[#333333]">{file.name}</span>
                </div>
                <div className="flex items-center gap-3 text-[#666666]">
                  <span>{file.dungLuong}</span>
                  <span className="font-mono text-[11px]">{file.ngay}</span>
                  <button
                    type="button"
                    onClick={() => toast.info(`Tải xuống tệp: ${file.name}`)}
                    className="text-[#00c0ef] hover:underline font-semibold"
                  >
                    Xem tệp
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Giấy tiếp nhận hồ sơ và Hẹn trả kết quả (kèm mã QR) */}
      {showGiayHen && <GiayHenModal hoSo={hoSo} onClose={() => setShowGiayHen(false)} />}

      {/* Modal Báo giảm đối tượng từ trần & Mai táng phí */}
      {showBaoGiam && (
        <BaoGiamModal
          hoSo={hoSo}
          isOpen={showBaoGiam}
          onClose={() => setShowBaoGiam(false)}
        />
      )}
    </AppShell>
  );
}
