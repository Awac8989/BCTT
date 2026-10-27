import { useState } from "react";
import { toast } from "sonner";
import {
  FileText,
  Send,
  Inbox,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  Search,
  Filter,
  Eye,
  PenTool,
  Printer,
  Download,
  Share2,
  FileCheck,
  UserCheck,
  Building,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Hash,
  HelpCircle,
  X,
  FileSignature,
} from "lucide-react";
import { appStore, useAppState } from "@/services/app-state";
import { type VanBanDenItem, type VanBanDiItem, type TiepCongDanItem } from "@/data/domain-mock";

export function VanBanDieuHanh() {
  const { vanBanDenList, vanBanDiList, tiepCongDanList, currentUser } = useAppState();
  const [activeTab, setActiveTab] = useState<"VAN_BAN_DEN" | "VAN_BAN_DI" | "TRUC_VDXP" | "TIEP_CONG_DAN">("VAN_BAN_DEN");

  // State tìm kiếm & bộ lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDoKhan, setFilterDoKhan] = useState<string>("ALL");
  const [filterTrangThai, setFilterTrangThai] = useState<string>("ALL");

  // State Modal Bút phê Văn bản đến
  const [selectedVbdForButPhe, setSelectedVbdForButPhe] = useState<VanBanDenItem | null>(null);
  const [canBoChuTri, setCanBoChuTri] = useState({ id: "cb_van_hoa", name: "Nguyễn Thanh Tùng" });
  const [butPheText, setButPheText] = useState("");
  const [hanXuLyInput, setHanXuLyInput] = useState("30/10/2026");

  // State Modal Soạn thảo Văn bản đi
  const [modalSoanVbDi, setModalSoanVbDi] = useState(false);
  const [newVbDiTrichYeu, setNewVbDiTrichYeu] = useState("");
  const [newVbDiLoai, setNewVbDiLoai] = useState<VanBanDiItem["loaiVanBan"]>("BAO_CAO");
  const [newVbDiNoiNhan, setNewVbDiNoiNhan] = useState("UBND Thành phố Thủ Dầu Một; Phòng VHTT TP; Lưu: VT");
  const [newVbDiTep, setNewVbDiTep] = useState("Du_thao_Bao_cao_UBND.pdf");

  // Thống kê nhanh Văn bản Đến
  const vbdStats = {
    total: vanBanDenList.length,
    hoaToc: vanBanDenList.filter((v) => v.doKhan === "HOA_TOC" || v.doKhan === "THUONG_KHAN").length,
    choPhanCong: vanBanDenList.filter((v) => v.trangThai === "CHO_PHAN_CONG").length,
    dangXuLy: vanBanDenList.filter((v) => v.trangThai === "DANG_XU_LY").length,
    daHoanThanh: vanBanDenList.filter((v) => v.trangThai === "DA_HOAN_THANH").length,
  };

  // Lọc danh sách Văn bản đến
  const filteredVbd = vanBanDenList.filter((v) => {
    const matchSearch =
      v.trichYeu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.soKyHieu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.coQuanBanHanh.toLowerCase().includes(searchTerm.toLowerCase());
    const matchKhan = filterDoKhan === "ALL" || v.doKhan === filterDoKhan;
    const matchStatus = filterTrangThai === "ALL" || v.trangThai === filterTrangThai;
    return matchSearch && matchKhan && matchStatus;
  });

  // Xử lý lưu bút phê
  const handleLuuButPhe = () => {
    if (!selectedVbdForButPhe) return;
    if (!butPheText.trim()) {
      toast.error("Vui lòng nhập ý kiến chỉ đạo / bút phê của Lãnh đạo!");
      return;
    }

    appStore.butPheVanBanDen(
      selectedVbdForButPhe.id,
      canBoChuTri.id,
      canBoChuTri.name,
      butPheText.trim(),
      hanXuLyInput
    );

    toast.success(
      `Đã lưu bút phê chỉ đạo và giao nhiệm vụ cho đ/c ${canBoChuTri.name}. Thông báo đã được gửi sang Kênh chỉ đạo nội bộ!`
    );
    setSelectedVbdForButPhe(null);
    setButPheText("");
  };

  // Mẫu gợi ý bút phê nhanh
  const quickButPheSamples = [
    `Giao Đ/c ${canBoChuTri.name} chủ trì phối hợp các đơn vị liên quan tham mưu xử lý, báo cáo trước ${hanXuLyInput}.`,
    `Đề nghị Đ/c ${canBoChuTri.name} khẩn trương rà soát thực địa, lập tờ trình trình Chủ tịch UBND Phường ký duyệt.`,
    `Chuyển Bộ phận chuyên môn thực hiện nghiêm túc tinh thần chỉ đạo của UBND Thành phố, không để quá hạn.`,
  ];

  // Xử lý tạo văn bản đi mới
  const handleTaoVbDi = () => {
    if (!newVbDiTrichYeu.trim()) {
      toast.error("Vui lòng nhập trích yếu văn bản đi!");
      return;
    }

    const noiNhanList = newVbDiNoiNhan
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean);

    appStore.trinhKyVanBanDi({
      trichYeu: newVbDiTrichYeu.trim(),
      loaiVanBan: newVbDiLoai,
      nguoiSoan: currentUser.fullName,
      boPhanSoan: currentUser.department || "Văn phòng UBND Phường",
      noiNhan: noiNhanList.length > 0 ? noiNhanList : ["Lưu: VT"],
      tepDinhKem: newVbDiTep,
    });

    toast.success("Đã nộp dự thảo Văn bản đi và chuyển Văn phòng thẩm tra thể thức (NĐ 30/2020)!");
    setModalSoanVbDi(false);
    setNewVbDiTrichYeu("");
  };

  // Xử lý ký số SmartCA phát hành văn bản đi
  const handleKySoPhatHanh = (vbDi: VanBanDiItem) => {
    appStore.kySoPhatHanhVanBanDi(vbDi.id, currentUser.fullName, currentUser.roleTitle || "Lãnh đạo UBND");
    toast.success(
      `Ký số SmartCA & Phát hành văn bản số ${vbDi.soKyHieu} thành công! Sản phẩm đã được đồng bộ vào sổ Check-in KPI.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner giới thiệu quy trình e-Office */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <Layers className="w-80 h-80" />
        </div>
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold uppercase tracking-wider">
            <FileSignature className="w-3.5 h-3.5 text-blue-300" />
            Hệ thống Quản lý Văn bản & Điều hành Công việc (e-Office)
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            Văn phòng Điện tử & Trục Liên thông Văn bản Quốc gia VDXP
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Chu trình hành chính khép kín theo <strong>Nghị định 30/2020/NĐ-CP</strong> và <strong>Đề án 06</strong>: Tiếp nhận Văn bản đến $\rightarrow$ Lãnh đạo Bút phê chỉ đạo $\rightarrow$ Tự động giao việc & đẩy Chat nội bộ $\rightarrow$ Cán bộ lập dự thảo Văn bản đi $\rightarrow$ Ký số SmartCA $\rightarrow$ Nghiệm thu Check-in KPI và phát hành VDXP.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-2">
        <button
          onClick={() => setActiveTab("VAN_BAN_DEN")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "VAN_BAN_DEN"
              ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20"
              : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Sổ Văn bản Đến & Bút phê Sếp</span>
          <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold">
            {vbdStats.total}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("VAN_BAN_DI")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "VAN_BAN_DI"
              ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20"
              : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Sổ Văn bản Đi & Trình ký SmartCA</span>
          <span className="px-2 py-0.5 text-xs rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold">
            {vanBanDiList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("TRUC_VDXP")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "TRUC_VDXP"
              ? "border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20"
              : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Trục Liên thông Quốc gia (VDXP)</span>
          <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold">
            Online
          </span>
        </button>

        <button
          onClick={() => setActiveTab("TIEP_CONG_DAN")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "TIEP_CONG_DAN"
              ? "border-amber-600 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20"
              : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Sổ Tiếp Công Dân Thứ 5 & Đơn Thư</span>
          <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-bold">
            {tiepCongDanList.length}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: SỔ VĂN BẢN ĐẾN & BÚT PHÊ LÃNH ĐẠO */}
      {/* ========================================================================= */}
      {activeTab === "VAN_BAN_DEN" && (
        <div className="space-y-6">
          {/* 4 Cards Thống kê trạng thái văn bản đến */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Tổng số văn bản đến</p>
                <h4 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{vbdStats.total}</h4>
                <p className="text-[11px] text-blue-600 mt-1">100% số hóa tệp PDF</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600">
                <Inbox className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Hỏa tốc / Thượng khẩn</p>
                <h4 className="text-2xl font-bold text-rose-600 mt-1">{vbdStats.hoaToc}</h4>
                <p className="text-[11px] text-rose-600 mt-1">Cần xử lý trong 24h-48h</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600">
                <Flame className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Chờ Lãnh đạo bút phê</p>
                <h4 className="text-2xl font-bold text-amber-600 mt-1">{vbdStats.choPhanCong}</h4>
                <p className="text-[11px] text-amber-600 mt-1">Chưa phân công cán bộ</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Đang xử lý đúng hạn</p>
                <h4 className="text-2xl font-bold text-emerald-600 mt-1">{vbdStats.dangXuLy}</h4>
                <p className="text-[11px] text-emerald-600 mt-1">Tiến độ công việc ổn định</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Thanh công cụ tìm kiếm và bộ lọc */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[280px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo số đến, ký hiệu, cơ quan ban hành hoặc trích yếu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterDoKhan}
                onChange={(e) => setFilterDoKhan(e.target.value)}
                className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="ALL">-- Tất cả độ khẩn --</option>
                <option value="HOA_TOC">Hỏa tốc</option>
                <option value="THUONG_KHAN">Thượng khẩn</option>
                <option value="KHAN">Khẩn</option>
                <option value="THUONG">Thường</option>
              </select>

              <select
                value={filterTrangThai}
                onChange={(e) => setFilterTrangThai(e.target.value)}
                className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="ALL">-- Tất cả trạng thái --</option>
                <option value="CHO_PHAN_CONG">Chờ phân công</option>
                <option value="DANG_XU_LY">Đang xử lý</option>
                <option value="DA_HOAN_THANH">Đã hoàn thành</option>
              </select>
            </div>
          </div>

          {/* Bảng danh sách văn bản đến */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-center">Số đến</th>
                    <th className="px-4 py-3">Số / Ký hiệu & Ngày</th>
                    <th className="px-4 py-3">Cơ quan ban hành</th>
                    <th className="px-4 py-3">Trích yếu nội dung</th>
                    <th className="px-4 py-3 text-center">Độ khẩn</th>
                    <th className="px-4 py-3">Cán bộ xử lý & Bút phê</th>
                    <th className="px-4 py-3 text-center">Hạn xử lý</th>
                    <th className="px-4 py-3 text-center">Trạng thái</th>
                    <th className="px-4 py-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredVbd.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                      <td className="px-4 py-3 text-center font-bold text-blue-600">
                        #{v.soDen}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{v.soKyHieu}</div>
                        <div className="text-[11px] text-slate-400">Đến: {v.ngayDen}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800 dark:text-slate-200">{v.coQuanBanHanh}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{v.maVdxp}</div>
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <p className="line-clamp-2 text-slate-700 dark:text-slate-300 font-normal">{v.trichYeu}</p>
                        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-blue-600 hover:underline cursor-pointer">
                          <FileText className="w-3 h-3" />
                          <span>{v.tepDinhKem}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {v.doKhan === "HOA_TOC" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-300">
                            <Flame className="w-3 h-3 text-rose-600" />
                            HỎA TỐC
                          </span>
                        ) : v.doKhan === "THUONG_KHAN" ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 border border-amber-300">
                            Thượng khẩn
                          </span>
                        ) : v.doKhan === "KHAN" ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-700">
                            Khẩn
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] text-slate-600 bg-slate-100">
                            Thường
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 max-w-[200px]">
                        {v.canBoChuTriName ? (
                          <div className="space-y-1">
                            <div className="font-semibold text-slate-900 dark:text-slate-100 text-[11px]">
                              {v.canBoChuTriName}
                            </div>
                            {v.butPheLanhDao && (
                              <p className="text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-1.5 rounded border border-amber-200/60 line-clamp-2">
                                &quot;{v.butPheLanhDao}&quot;
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Chưa phân công</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {v.hanXuLy}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {v.trangThai === "DA_HOAN_THANH" ? (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                            Đã hoàn thành
                          </span>
                        ) : v.trangThai === "DANG_XU_LY" ? (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800">
                            Đang xử lý
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
                            Chờ bút phê
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedVbdForButPhe(v);
                            setButPheText(v.butPheLanhDao || "");
                            setHanXuLyInput(v.hanXuLy || "30/10/2026");
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm transition cursor-pointer"
                        >
                          <PenTool className="w-3.5 h-3.5" />
                          <span>Bút phê & Giao việc</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SỔ VĂN BẢN ĐI & QUY TRÌNH TRÌNH KÝ SMARTCA */}
      {/* ========================================================================= */}
      {activeTab === "VAN_BAN_DI" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Sổ Văn bản Đi, Phiếu Trình ký & Ký số SmartCA
              </h3>
              <p className="text-xs text-slate-500">
                Thẩm tra thể thức văn bản theo Nghị định 30/2020/NĐ-CP và cấp số phát hành điện tử
              </p>
            </div>
            <button
              type="button"
              onClick={() => setModalSoanVbDi(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Soạn Dự thảo Văn bản Đi Mới</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-center">Số đi</th>
                    <th className="px-4 py-3">Số / Ký hiệu & Ngày</th>
                    <th className="px-4 py-3">Trích yếu nội dung</th>
                    <th className="px-4 py-3">Người soạn & Đơn vị</th>
                    <th className="px-4 py-3 text-center">Thể thức (NĐ 30)</th>
                    <th className="px-4 py-3">Nơi nhận</th>
                    <th className="px-4 py-3 text-center">Trạng thái</th>
                    <th className="px-4 py-3 text-right">Ký số & Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {vanBanDiList.map((vb) => (
                    <tr key={vb.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                      <td className="px-4 py-3 text-center font-bold text-indigo-600">
                        {vb.soDi ? `#${vb.soDi}` : <span className="text-slate-400 italic">Chờ cấp</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{vb.soKyHieu}</div>
                        <div className="text-[11px] text-slate-400">Soạn: {vb.ngaySoan}</div>
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <p className="line-clamp-2 text-slate-700 dark:text-slate-300 font-medium">{vb.trichYeu}</p>
                        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-indigo-600 hover:underline cursor-pointer">
                          <FileText className="w-3 h-3" />
                          <span>{vb.tepDinhKem}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{vb.nguoiSoan}</div>
                        <div className="text-[11px] text-slate-400">{vb.boPhanSoan}</div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {vb.theThucHopLe ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Hợp lệ
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            Cần thẩm tra
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 max-w-[180px]">
                        <p className="line-clamp-2 text-slate-600 dark:text-slate-400 text-[11px]">
                          {vb.noiNhan.join(", ")}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {vb.trangThai === "DA_PHAT_HANH" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            Đã phát hành
                          </span>
                        ) : vb.trangThai === "CHO_KY_SO" ? (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
                            Chờ Sếp ký số
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-800">
                            Dự thảo
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {vb.trangThai === "CHO_KY_SO" ? (
                          <button
                            type="button"
                            onClick={() => handleKySoPhatHanh(vb)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm transition cursor-pointer"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Ký số SmartCA</span>
                          </button>
                        ) : vb.trangThai === "DA_PHAT_HANH" ? (
                          <div className="text-right">
                            <span className="text-[10px] text-emerald-600 font-mono block">
                              {vb.maKySoSmartCA?.slice(0, 15)}...
                            </span>
                            <span className="text-[10px] text-slate-400 block">{vb.ngayKy}</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              appStore.thamTraTheThuc(vb.id, true, "Văn phòng HĐND-UBND Phường")
                            }
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-xs text-slate-700 dark:text-slate-300 transition cursor-pointer"
                          >
                            <FileCheck className="w-3.5 h-3.5" />
                            <span>Thẩm tra thể thức</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: TRỤC LIÊN THÔNG VĂN BẢN QUỐC GIA (VDXP) */}
      {/* ========================================================================= */}
      {activeTab === "TRUC_VDXP" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-emerald-600" />
                  Trục Liên thông Văn bản Quốc gia (VDXP) & Nền tảng Tích hợp Dữ liệu Tỉnh (LGSP)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Mã định danh cơ quan UBND Phường Phú Cường: <strong>000.00.24.H50</strong> · Trạng thái kết nối: Hoạt động ổn định 24/7
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-emerald-600">ĐÃ KẾT NỐI VDXP</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20">
                <p className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold">UBND Thành phố Thủ Dầu Một</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">Gửi/Nhận: 342 văn bản điện tử</p>
                <div className="flex items-center justify-between text-[11px] text-emerald-700 font-bold mt-2">
                  <span>Trễ gói tin: 12ms</span>
                  <span>100% Ký số</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
                <p className="text-xs text-blue-800 dark:text-blue-300 font-semibold">UBND Tỉnh Bình Dương & Các Sở</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">Trực tiếp qua Trục LGSP Tỉnh</p>
                <div className="flex items-center justify-between text-[11px] text-blue-700 font-bold mt-2">
                  <span>Mã hóa AES-256</span>
                  <span>Chứng thư Ban Cơ yếu</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/20">
                <p className="text-xs text-indigo-800 dark:text-indigo-300 font-semibold">Hệ thống Một Cửa Quốc Gia</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">Đồng bộ trạng thái hồ sơ TTHC</p>
                <div className="flex items-center justify-between text-[11px] text-indigo-700 font-bold mt-2">
                  <span>Đề án 06 / VNeID</span>
                  <span>API Sync 15 phút/lần</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SỔ TIẾP CÔNG DÂN THỨ 5 ĐỊNH KỲ & XỬ LÝ ĐƠN THƯ */}
      {/* ========================================================================= */}
      {activeTab === "TIEP_CONG_DAN" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Sổ Tiếp Công Dân Định Kỳ Thứ 5 Hàng Tuần của Lãnh đạo UBND Phường
              </h3>
              <p className="text-xs text-slate-500">
                Căn cứ Luật Tiếp công dân 2013 và Quy chế tiếp công dân, giải quyết khiếu nại, tố cáo
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-4 py-3">Mã số đơn</th>
                    <th className="px-4 py-3">Ngày tiếp & Người tiếp</th>
                    <th className="px-4 py-3">Công dân / CCCD / Địa chỉ</th>
                    <th className="px-4 py-3">Phân loại & Lĩnh vực</th>
                    <th className="px-4 py-3">Nội dung phản ánh</th>
                    <th className="px-4 py-3">Ý kiến kết luận & Cán bộ thụ lý</th>
                    <th className="px-4 py-3 text-center">Hạn giải quyết</th>
                    <th className="px-4 py-3 text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {tiepCongDanList.map((tcd) => (
                    <tr key={tcd.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                      <td className="px-4 py-3 font-mono font-bold text-amber-600">
                        {tcd.maSoDon}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{tcd.ngayTiep}</div>
                        <div className="text-[11px] text-slate-500">{tcd.nguoiTiep}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{tcd.hoTenCongDan}</div>
                        <div className="text-[11px] text-slate-500">CCCD: {tcd.cccd} · SĐT: {tcd.soDienThoai}</div>
                        <div className="text-[10px] text-slate-400">{tcd.diaChi}, {tcd.khuPho}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800 mb-1">
                          {tcd.phanLoai === "KIEN_NGHI_PHAN_ANH"
                            ? "Kiến nghị, Phản ánh"
                            : tcd.phanLoai === "KHIEU_NAI"
                              ? "Khiếu nại"
                              : "Tố cáo"}
                        </span>
                        <div className="text-[11px] text-slate-500 font-medium">Lĩnh vực: {tcd.linhVuc}</div>
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <p className="line-clamp-2 text-slate-700 dark:text-slate-300">{tcd.noiDung}</p>
                      </td>
                      <td className="px-4 py-3 max-w-[220px]">
                        <p className="text-[11px] text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-1.5 rounded border border-amber-200/60 line-clamp-2">
                          {tcd.yKienKetLuan}
                        </p>
                        <div className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold mt-1">
                          Cán bộ: {tcd.canBoThuLy}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center font-mono font-medium text-slate-700 dark:text-slate-300">
                        {tcd.hanGiaiQuyet}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {tcd.trangThai === "DA_BAN_HANH_TRA_LOI" ? (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                            Đã ban hành trả lời
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
                            Đang xác minh
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL BÚT PHÊ VĂN BẢN ĐẾN & PHÂN CÔNG GIAO VIỆC */}
      {/* ========================================================================= */}
      {selectedVbdForButPhe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <PenTool className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Bút phê Chỉ đạo & Phân công Văn bản đến số {selectedVbdForButPhe.soDen}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVbdForButPhe(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Số / Ký hiệu:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedVbdForButPhe.soKyHieu}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Cơ quan ban hành:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedVbdForButPhe.coQuanBanHanh}
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block mb-1">Trích yếu:</span>
                <p className="text-slate-800 dark:text-slate-200 font-normal leading-relaxed">
                  {selectedVbdForButPhe.trichYeu}
                </p>
              </div>
            </div>

            {/* Chọn cán bộ chủ trì */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Cán bộ chủ trì tham mưu xử lý:
              </label>
              <select
                value={canBoChuTri.id}
                onChange={(e) => {
                  const id = e.target.value;
                  const name =
                    id === "cb_van_hoa"
                      ? "Nguyễn Thanh Tùng"
                      : id === "cb_giao_duc"
                        ? "ThS. Trần Thị Kim Oanh"
                        : id === "cb_chinh_sach"
                          ? "Lê Hoàng Nam"
                          : "Vũ Đình Cường";
                  setCanBoChuTri({ id, name });
                }}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="cb_van_hoa">Nguyễn Thanh Tùng - Công chức Văn hóa - Xã hội</option>
                <option value="cb_giao_duc">ThS. Trần Thị Kim Oanh - Chuyên viên Giáo dục & Đào tạo</option>
                <option value="cb_chinh_sach">Lê Hoàng Nam - Cán bộ Chính sách - BTXH</option>
                <option value="cb_thong_tin">Vũ Đình Cường - Cán bộ CNTT & Tiếp nhận Một cửa</option>
              </select>
            </div>

            {/* Hạn xử lý */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Hạn hoàn thành xử lý:
              </label>
              <input
                type="text"
                value={hanXuLyInput}
                onChange={(e) => setHanXuLyInput(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Ý kiến bút phê */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Ý kiến chỉ đạo / Bút phê của Lãnh đạo:
                </label>
                <span className="text-[11px] text-blue-600 font-medium">Bút phê điện tử</span>
              </div>
              <textarea
                rows={3}
                value={butPheText}
                onChange={(e) => setButPheText(e.target.value)}
                placeholder="Nhập ý kiến chỉ đạo cụ thể..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {quickButPheSamples.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setButPheText(sample)}
                    className="text-[10px] px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 transition cursor-pointer text-left"
                  >
                    + Mẫu {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedVbdForButPhe(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleLuuButPhe}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md transition cursor-pointer inline-flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Lưu Bút phê & Phát lệnh Giao việc</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL SOẠN DỰ THẢO VĂN BẢN ĐI MỚI */}
      {/* ========================================================================= */}
      {modalSoanVbDi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Lập Dự thảo Văn bản Đi & Phiếu Trình ký
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalSoanVbDi(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Loại văn bản:</label>
                <select
                  value={newVbDiLoai}
                  onChange={(e) => setNewVbDiLoai(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option value="BAO_CAO">Báo cáo (BC)</option>
                  <option value="TO_TRINH">Tờ trình (TTr)</option>
                  <option value="QUYET_DINH">Quyết định (QĐ)</option>
                  <option value="KE_HOACH">Kế hoạch (KH)</option>
                  <option value="CONG_VAN">Công văn hành chính (CV)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Trích yếu nội dung văn bản:</label>
                <textarea
                  rows={3}
                  value={newVbDiTrichYeu}
                  onChange={(e) => setNewVbDiTrichYeu(e.target.value)}
                  placeholder="Ví dụ: Báo cáo kết quả kiểm tra công tác PCCC tại các di tích lịch sử..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Nơi nhận (phân cách bằng dấu chấm phẩy ;):</label>
                <input
                  type="text"
                  value={newVbDiNoiNhan}
                  onChange={(e) => setNewVbDiNoiNhan(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Tệp văn bản đính kèm:</label>
                <input
                  type="text"
                  value={newVbDiTep}
                  onChange={(e) => setNewVbDiTep(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setModalSoanVbDi(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleTaoVbDi}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md transition cursor-pointer inline-flex items-center gap-1.5"
              >
                <FileSignature className="w-3.5 h-3.5" />
                <span>Nộp Trình Ký Lãnh đạo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
