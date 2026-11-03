import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  User,
  Eye,
  FileText,
  Filter,
  ArrowRight,
  Stethoscope,
  Award,
  Sparkles,
  ExternalLink,
  Lock,
  Send,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { useAppState, appStore } from "@/services/app-state";
import { type HoSo } from "@/data/mock";
import { QuyetDinhModal } from "@/components/QuyetDinhModal";
import { ToTrinhModal } from "@/components/ToTrinhModal";
import { BienBanGiamDinhModal } from "@/components/BienBanGiamDinhModal";
import { MauD03TsModal } from "@/components/MauD03TsModal";
import { BienBanNiemYetModal } from "@/components/BienBanNiemYetModal";
import { QuyetDinhMaiTangPhiModal } from "@/components/QuyetDinhMaiTangPhiModal";
import { BienBanXacMinhThucDiaModal } from "@/components/BienBanXacMinhThucDiaModal";
import { MapPin } from "lucide-react";
import { Calendar } from "lucide-react";

export const Route = createFileRoute("/tham-dinh")({
  head: () => ({
    meta: [
      { title: "Quy trình thẩm định hồ sơ Thương binh - Liệt sĩ · SLĐTBXH Bình Dương" },
      {
        name: "description",
        content:
          "Quy trình thẩm định 5 bước xét duyệt hồ sơ Người có công tỉnh Bình Dương: tiếp nhận, thẩm tra giám định y khoa, xác định mức trợ cấp và phê duyệt quyết định.",
      },
      { property: "og:title", content: "Thẩm định hồ sơ Thương binh - Liệt sĩ · SLĐTBXH Bình Dương" },
    ],
  }),
  component: ThamDinhPage,
});

const QUY_TRINH_BUOC = [
  {
    step: 1,
    id: "MỚI_TIẾP_NHẬN",
    title: "1. Tiếp nhận hồ sơ",
    desc: "Bộ phận Một cửa cấp Xã/Huyện chuyển lên",
    icon: FileText,
    color: "text-[#00c0ef]",
    bg: "bg-[#00c0ef]/10",
  },
  {
    step: 2,
    id: "ĐANG_THẨM_ĐỊNH",
    title: "2. Thẩm tra & Giám định",
    desc: "Giám định Y khoa / Thẩm tra hy sinh",
    icon: Stethoscope,
    color: "text-[#f39c12]",
    bg: "bg-[#f39c12]/10",
  },
  {
    step: 3,
    id: "THẨM_ĐỊNH_CHẾ_ĐỘ",
    title: "3. Xác định mức trợ cấp",
    desc: "Nghị định 75/2021 & Phụ lục tỷ lệ",
    icon: Award,
    color: "text-[#3c8dbc]",
    bg: "bg-[#3c8dbc]/10",
  },
  {
    step: 4,
    id: "CHỜ_PHÊ_DUYỆT",
    title: "4. Trình Lãnh đạo phê duyệt",
    desc: "Dự thảo Quyết định trợ cấp ưu đãi",
    icon: ShieldCheck,
    color: "text-[#dd4b39]",
    bg: "bg-[#dd4b39]/10",
  },
  {
    step: 5,
    id: "ĐÃ_DUYỆT",
    title: "5. Đã duyệt & Đưa vào chi trả",
    desc: "Ban hành Quyết định & cấp BHYT",
    icon: CheckCircle2,
    color: "text-[#00a65a]",
    bg: "bg-[#00a65a]/10",
  },
];

function ThamDinhPage() {
  const { hoSoList, currentUser } = useAppState();
  const [selectedHoSoForQd, setSelectedHoSoForQd] = useState<HoSo | null>(null);
  const [isQdModalOpen, setIsQdModalOpen] = useState(false);
  const [selectedHoSoForToTrinh, setSelectedHoSoForToTrinh] = useState<HoSo | null>(null);
  const [selectedHoSoForGdyk, setSelectedHoSoForGdyk] = useState<HoSo | null>(null);
  const [selectedHoSoForD03Ts, setSelectedHoSoForD03Ts] = useState<HoSo | null>(null);
  const [selectedHoSoForNiemYet, setSelectedHoSoForNiemYet] = useState<HoSo | null>(null);
  const [selectedHoSoForMaiTang, setSelectedHoSoForMaiTang] = useState<HoSo | null>(null);
  const [selectedHoSoForXacMinh, setSelectedHoSoForXacMinh] = useState<HoSo | null>(null);

  // Bộ lọc
  const [filterLoai, setFilterLoai] = useState("ALL");
  const [activeStep, setActiveStep] = useState<string>("ALL");

  const filteredHoSo = useMemo(() => {
    return hoSoList.filter((h) => {
      if (filterLoai !== "ALL") {
        if (!h.loaiDoiTuong.toLowerCase().includes(filterLoai.toLowerCase())) return false;
      }
      if (activeStep !== "ALL") {
        if (activeStep === "THẨM_ĐỊNH_CHẾ_ĐỘ") {
          if (h.trangThai !== "ĐANG_THẨM_ĐỊNH") return false;
        } else if (h.trangThai !== activeStep) {
          return false;
        }
      }
      return true;
    });
  }, [hoSoList, filterLoai, activeStep]);

  // Đếm số lượng theo trạng thái
  const countsByStatus = useMemo(() => {
    return {
      MỚI_TIẾP_NHẬN: hoSoList.filter((h) => h.trangThai === "MỚI_TIẾP_NHẬN").length,
      ĐANG_THẨM_ĐỊNH: hoSoList.filter((h) => h.trangThai === "ĐANG_THẨM_ĐỊNH").length,
      CHỜ_PHÊ_DUYỆT: hoSoList.filter((h) => h.trangThai === "CHỜ_PHÊ_DUYỆT").length,
      ĐÃ_DUYỆT: hoSoList.filter((h) => h.trangThai === "ĐÃ_DUYỆT").length,
      YÊU_CẦU_BỔ_SUNG: hoSoList.filter((h) => h.trangThai === "YÊU_CẦU_BỔ_SUNG").length,
    };
  }, [hoSoList]);

  // Chuyển bước theo đúng logic thẩm quyền công vụ
  const handleNextStep = (h: HoSo) => {
    if (h.trangThai === "MỚI_TIẾP_NHẬN") {
      appStore.updateProfileStatus(h.id, "ĐANG_THẨM_ĐỊNH", "Bộ phận Một cửa đã tiếp nhận hồ sơ, chuyển sang phòng chuyên môn thẩm tra & giới thiệu Hội đồng Giám định Y khoa.");
      toast.success(`Hồ sơ ${h.id} đã chuyển sang bước: Thẩm tra thực địa & Giám định Y khoa`);
    } else if (h.trangThai === "ĐANG_THẨM_ĐỊNH") {
      appStore.updateProfileStatus(h.id, "CHỜ_PHÊ_DUYỆT", "Chuyên viên đã hoàn tất thẩm định điều kiện, lập Tờ trình và dự thảo Quyết định trình Lãnh đạo Sở phê duyệt.");
      toast.success(`Đã lập Tờ trình cho hồ sơ ${h.id}! Đang trình Lãnh đạo Sở (TS. Nguyễn Văn Hùng) phê duyệt.`);
    } else if (h.trangThai === "CHỜ_PHÊ_DUYỆT") {
      // Mở modal để xem và ký số
      setSelectedHoSoForQd(h);
      setIsQdModalOpen(true);
    }
  };

  return (
    <AppShell>
      {/* 1. Tiêu đề chuẩn Cổng Sở LĐTBXH */}
      <div className="mb-3">
        <h1 className="text-xl font-bold text-[#333333] flex items-baseline">
          Quy trình thẩm định hồ sơ Thương binh &amp; Liệt sĩ
          <span className="text-sm font-normal text-[#777777] ml-2">
            Nghị định 131/2021/NĐ-CP &amp; Pháp lệnh Ưu đãi người có công
          </span>
        </h1>
      </div>

      {/* 2. Quy trình 5 bước trực quan (Interactive 5-Step Process Pipeline) */}
      <div className="mb-4 rounded-[4px] border border-[#d2d6de] bg-white p-3.5 shadow-xs">
        <div className="text-xs font-bold uppercase text-[#dd4b39] mb-3 flex items-center gap-1.5">
          <Sparkles className="size-4 text-[#dd4b39]" />
          Sơ đồ quy trình 5 bước giải quyết thủ tục hành chính
        </div>

        <div className="grid gap-2 sm:grid-cols-5 text-xs">
          {QUY_TRINH_BUOC.map((b) => {
            const Icon = b.icon;
            const count =
              b.id === "MỚI_TIẾP_NHẬN"
                ? countsByStatus.MỚI_TIẾP_NHẬN
                : b.id === "ĐANG_THẨM_ĐỊNH"
                  ? countsByStatus.ĐANG_THẨM_ĐỊNH
                  : b.id === "CHỜ_PHÊ_DUYỆT"
                    ? countsByStatus.CHỜ_PHÊ_DUYỆT
                    : b.id === "ĐÃ_DUYỆT"
                      ? countsByStatus.ĐÃ_DUYỆT
                      : 0;
            const isSelected = activeStep === b.id;

            return (
              <button
                key={b.step}
                type="button"
                onClick={() => setActiveStep(activeStep === b.id ? "ALL" : b.id)}
                className={`flex flex-col justify-between rounded-[3px] border p-2.5 text-left transition-all cursor-pointer ${
                  isSelected
                    ? "border-[#dd4b39] bg-red-50/50 shadow-xs ring-1 ring-[#dd4b39]"
                    : "border-[#e5e7eb] bg-[#fbfcfd] hover:border-[#00c0ef] hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`grid size-7 place-items-center rounded ${b.bg} ${b.color}`}>
                    <Icon className="size-4" />
                  </div>
                  <span className="font-mono text-xs font-bold text-[#dd4b39] bg-white px-1.5 py-0.5 rounded border border-[#e5e7eb]">
                    {count} hồ sơ
                  </span>
                </div>

                <div className="mt-2">
                  <div className="font-bold text-[#333333] text-[12px]">{b.title}</div>
                  <div className="text-[11px] text-[#777777] mt-0.5 leading-snug">{b.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Thanh tác vụ & Lọc danh mục */}
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-[#555555]">Lọc theo đối tượng:</span>
          <select
            value={filterLoai}
            onChange={(e) => setFilterLoai(e.target.value)}
            className="rounded-[3px] border border-[#d2d6de] bg-white px-2.5 py-1 text-xs text-[#333333] outline-none"
          >
            <option value="ALL">-- Tất cả đối tượng --</option>
            <option value="liệt sĩ">Hồ sơ Liệt sĩ / Thân nhân</option>
            <option value="thương binh">Hồ sơ Thương binh</option>
            <option value="bệnh binh">Hồ sơ Bệnh binh</option>
            <option value="Mẹ VNAH">Bà mẹ Việt Nam Anh Hùng</option>
          </select>

          {activeStep !== "ALL" && (
            <button
              type="button"
              onClick={() => setActiveStep("ALL")}
              className="flex items-center gap-1 rounded-[3px] border border-[#d2d6de] bg-white px-2.5 py-1 text-xs text-[#555555] hover:bg-gray-50"
            >
              Xem tất cả ({hoSoList.length})
            </button>
          )}
        </div>

        <div className="text-xs text-[#666666]">
          Hiển thị <strong>{filteredHoSo.length}</strong> hồ sơ đang trong quy trình
        </div>
      </div>

      {/* 4. Danh sách Hồ sơ đang xử lý trong quy trình */}
      <div className="rounded-[4px] border border-[#d2d6de] bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#d2d6de] bg-white text-[#333333] font-bold">
                <th className="w-12 py-2 text-center font-bold">STT</th>
                <th className="px-3 py-2 font-bold">Số hồ sơ</th>
                <th className="px-3 py-2 font-bold">Họ và tên đối tượng</th>
                <th className="px-3 py-2 font-bold">Loại hồ sơ</th>
                <th className="px-3 py-2 font-bold">Địa bàn hành chính</th>
                <th className="px-3 py-2 font-bold text-center">Tỷ lệ thương tật</th>
                <th className="px-3 py-2 font-bold text-right">Mức trợ cấp dự kiến</th>
                <th className="px-3 py-2 font-bold text-center">Trạng thái hiện tại</th>
                <th className="px-3 py-2 font-bold text-center">Tác vụ thẩm định</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f4f4] text-[#333333]">
              {filteredHoSo.map((h, idx) => {
                const isDaDuyet = h.trangThai === "ĐÃ_DUYỆT";
                return (
                  <tr key={h.id} className="hover:bg-[#f9fafb] transition-colors">
                    {/* STT */}
                    <td className="py-2.5 text-center text-[#666666] font-mono text-xs">{idx + 1}</td>

                    {/* Số hồ sơ */}
                    <td className="px-3 py-2.5 font-mono text-xs font-semibold text-[#dd4b39]">
                      <Link to="/ho-so/$id" params={{ id: h.id }} className="hover:underline">
                        {h.soHoSoTinh || h.id}
                      </Link>
                    </td>

                    {/* Họ và tên */}
                    <td className="px-3 py-2.5 font-medium">
                      <Link to="/ho-so/$id" params={{ id: h.id }} className="hover:text-[#dd4b39]">
                        {h.hoTen}
                      </Link>
                      <div className="text-[11px] text-[#777777] font-mono">CCCD: {h.cccd}</div>
                    </td>

                    {/* Loại hồ sơ */}
                    <td className="px-3 py-2.5">{h.loaiDoiTuong}</td>

                    {/* Địa bàn */}
                    <td className="px-3 py-2.5 text-xs text-[#555555]">
                      {h.diaChiTiepNhan || `${h.phuong} - ${h.huyen}`}
                    </td>

                    {/* Tỷ lệ thương tật */}
                    <td className="px-3 py-2.5 text-center font-mono font-medium">
                      {h.tyLeTonThuong > 0 ? (
                        <button
                          type="button"
                          onClick={() => setSelectedHoSoForGdyk(h)}
                          title="Bấm để xem Biên bản Giám định Y khoa của Hội đồng GĐYK"
                          className="rounded bg-amber-50 hover:bg-amber-100 px-2 py-0.5 text-amber-900 border border-amber-300 font-bold hover:underline cursor-pointer flex items-center gap-1 mx-auto shadow-2xs"
                        >
                          <Stethoscope className="size-3 text-emerald-700" />
                          <span>{h.tyLeTonThuong}%</span>
                        </button>
                      ) : (
                        <span className="text-[#888888]">—</span>
                      )}
                    </td>

                    {/* Mức trợ cấp */}
                    <td className="px-3 py-2.5 text-right font-mono font-bold text-[#dd4b39]">
                      {(h.mucTroCap + h.phuCapPhucVu).toLocaleString("vi-VN")}{" "}
                      <span className="text-[10px] text-[#777777]">đ/tháng</span>
                    </td>

                    {/* Trạng thái hiện tại */}
                    <td className="px-3 py-2.5 text-center">
                      <span
                        className={`inline-flex items-center rounded-[3px] px-2 py-0.5 text-xs font-semibold border ${
                          h.trangThai === "ĐÃ_DUYỆT"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : h.trangThai === "CHỜ_PHÊ_DUYỆT"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : h.trangThai === "ĐANG_THẨM_ĐỊNH"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-sky-50 text-sky-700 border-sky-200"
                        }`}
                      >
                        {h.trangThai === "ĐÃ_DUYỆT"
                          ? "Đã duyệt ban hành"
                          : h.trangThai === "CHỜ_PHÊ_DUYỆT"
                            ? "Chờ ký Quyết định"
                            : h.trangThai === "ĐANG_THẨM_ĐỊNH"
                              ? "Đang thẩm tra/GĐYK"
                              : "Mới tiếp nhận"}
                      </span>
                    </td>

                    {/* Tác vụ */}
                    <td className="px-3 py-2.5 text-center">
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        {h.trangThai === "CHỜ_PHÊ_DUYỆT" ? (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setSelectedHoSoForToTrinh(h)}
                              title="Xem Tờ trình của Phòng LĐ-TB&XH TP. Thủ Dầu Một"
                              className="flex items-center gap-1 rounded border border-blue-300 bg-blue-50 hover:bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-900 shadow-2xs transition-colors cursor-pointer"
                            >
                              <FileText className="size-3 text-blue-700" />
                              <span>Tờ trình</span>
                            </button>
                            {currentUser.role === "ADMIN_SO" ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedHoSoForQd(h);
                                  setIsQdModalOpen(true);
                                }}
                                title="Ký số điện tử SmartCA và ban hành Quyết định"
                                className="flex items-center gap-1 rounded bg-[#dd4b39] hover:bg-[#c23321] px-2.5 py-1 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer animate-pulse"
                              >
                                <ShieldCheck className="size-3.5" />
                                <span>Ký QĐ</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedHoSoForQd(h);
                                  setIsQdModalOpen(true);
                                }}
                                title="Xem dự thảo Quyết định trình Lãnh đạo"
                                className="flex items-center gap-1 rounded border border-amber-300 bg-amber-50 hover:bg-amber-100 px-2 py-1 text-xs font-medium text-amber-900 shadow-2xs transition-colors cursor-pointer"
                              >
                                <FileText className="size-3 text-amber-600" />
                                <span>Dự thảo QĐ</span>
                              </button>
                            )}
                          </div>
                        ) : h.trangThai === "ĐANG_THẨM_ĐỊNH" ? (
                          <button
                            type="button"
                            onClick={() => setSelectedHoSoForToTrinh(h)}
                            title="Lập Tờ trình đề nghị Giám đốc Sở phê duyệt trợ cấp"
                            className="flex items-center gap-1 rounded bg-[#0073b7] hover:bg-[#005f96] px-2.5 py-1 text-xs font-bold text-white shadow-2xs transition-colors cursor-pointer"
                          >
                            <Send className="size-3" />
                            <span>Lập Tờ trình</span>
                          </button>
                        ) : h.trangThai === "ĐÃ_DUYỆT" ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedHoSoForQd(h);
                                setIsQdModalOpen(true);
                              }}
                              title="Xem văn bản Quyết định chính thức đã ký số"
                              className="flex items-center gap-1 rounded border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-800 shadow-2xs transition-colors cursor-pointer"
                            >
                              <Award className="size-3.5 text-emerald-600" />
                              <span>Quyết định</span>
                            </button>
                            <Link
                              to="/chi-tra"
                              title="Xem kỳ chi trả trợ cấp hàng tháng"
                              className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-0.5"
                            >
                              <span>Chi trả</span>
                              <ExternalLink className="size-3" />
                            </Link>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleNextStep(h)}
                            title="Tiếp nhận hồ sơ & chuyển thẩm tra"
                            className="flex items-center gap-1 rounded bg-[#00a65a] hover:bg-[#008d4c] px-2.5 py-1 text-xs font-bold text-white shadow-2xs transition-colors cursor-pointer"
                          >
                            <span>Thụ lý hồ sơ</span>
                            <ArrowRight className="size-3" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setSelectedHoSoForXacMinh(h)}
                          title="Biên bản kiểm tra hiện trường & xác minh thực địa cấp cơ sở (Mẫu 02/XMTD)"
                          className="size-6 rounded bg-sky-700 hover:bg-sky-800 text-white flex items-center justify-center transition-colors shadow-2xs"
                        >
                          <MapPin className="size-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedHoSoForNiemYet(h)}
                          title="Xem Biên bản niêm yết công khai 15 ngày tại cấp Xã/Phường"
                          className="size-6 rounded bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center transition-colors shadow-2xs"
                        >
                          <Calendar className="size-3.5" />
                        </button>

                        {h.isTuTran && (
                          <button
                            type="button"
                            onClick={() => setSelectedHoSoForMaiTang(h)}
                            title="Quyết định hưởng trợ cấp Mai táng phí (23.4 triệu đ) & Trợ cấp một lần"
                            className="size-6 rounded bg-rose-700 hover:bg-rose-800 text-white flex items-center justify-center transition-colors shadow-2xs"
                          >
                            <CreditCard className="size-3.5" />
                          </button>
                        )}

                        {h.trangThai === "ĐÃ_DUYỆT" && (
                          <button
                            type="button"
                            onClick={() => setSelectedHoSoForD03Ts(h)}
                            title="Danh sách đề nghị cấp thẻ BHYT Người có công (Mẫu D03-TS)"
                            className="size-6 rounded bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center transition-colors shadow-2xs"
                          >
                            <CreditCard className="size-3.5" />
                          </button>
                        )}

                        <Link
                          to="/ho-so/$id"
                          params={{ id: h.id }}
                          title="Xem toàn bộ tài liệu hồ sơ"
                          className="size-6 rounded bg-[#00c0ef] hover:bg-[#00a7d0] text-white flex items-center justify-center transition-colors shadow-2xs"
                        >
                          <Eye className="size-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredHoSo.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-[#888888]">
                    Không có hồ sơ nào phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Căn cứ Pháp lý & Hồ sơ quy chuẩn theo Nghị định 131/2021/NĐ-CP */}
      <div className="mt-4 rounded-[4px] border border-[#d2d6de] bg-white p-4 text-xs text-[#333333]">
        <div className="font-bold text-[#dd4b39] uppercase text-xs mb-2">
          Căn cứ Pháp lý &amp; Thành phần hồ sơ bắt buộc (Nghị định 131/2021/NĐ-CP)
        </div>
        <div className="grid gap-4 sm:grid-cols-2 text-[12px] leading-relaxed">
          <div className="rounded border border-[#e5e7eb] p-3 bg-gray-50/50">
            <div className="font-bold text-[#333333] mb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-[#00c0ef]" />
              Hồ sơ đề nghị giải quyết chế độ Thương binh:
            </div>
            <ul className="list-disc pl-5 space-y-1 text-[#555555]">
              <li>Giấy chứng nhận bị thương do cơ quan, đơn vị có thẩm quyền cấp.</li>
              <li>Biên bản giám định y khoa kết luận tỷ lệ tổn thương cơ thể từ 21% trở lên.</li>
              <li>Đơn đề nghị giải quyết chế độ ưu đãi (Mẫu số 01).</li>
              <li>Giấy tờ chứng minh trường hợp bị thương (tham gia chiến trường, làm nhiệm vụ quốc tế, dũng cảm cứu người...).</li>
            </ul>
          </div>

          <div className="rounded border border-[#e5e7eb] p-3 bg-gray-50/50">
            <div className="font-bold text-[#333333] mb-1.5 flex items-center gap-1.5">
              <Award className="size-4 text-[#dd4b39]" />
              Hồ sơ đề nghị giải quyết chế độ Liệt sĩ &amp; Thân nhân:
            </div>
            <ul className="list-disc pl-5 space-y-1 text-[#555555]">
              <li>Bằng Tổ quốc ghi công hoặc Giấy báo tử của đơn vị quản lý liệt sĩ.</li>
              <li>Bản khai thân nhân liệt sĩ đề nghị hưởng trợ cấp tiền tuất (Mẫu số 02).</li>
              <li>Giấy tờ chứng minh mối quan hệ thân nhân (cha mẹ đẻ, vợ/chồng, con, người nuôi dưỡng).</li>
              <li>Biên bản ủy quyền thờ cúng liệt sĩ (nếu không còn thân nhân hưởng trợ cấp tuất hàng tháng).</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 6. Modal Văn bản Quyết định hưởng trợ cấp chuẩn Nghị định 30/2020 & NĐ 131/2021 */}
      <QuyetDinhModal
        isOpen={isQdModalOpen}
        onClose={() => setIsQdModalOpen(false)}
        hoSo={selectedHoSoForQd}
        onApproved={() => {
          setIsQdModalOpen(false);
        }}
      />

      {/* 7. Modal Tờ trình Cấp Phòng trình Giám đốc Sở (Mẫu NĐ 30/2020) */}
      <ToTrinhModal
        isOpen={!!selectedHoSoForToTrinh}
        onClose={() => setSelectedHoSoForToTrinh(null)}
        hoSo={selectedHoSoForToTrinh}
        onSubmitted={() => {
          setSelectedHoSoForToTrinh(null);
        }}
      />

      {/* 8. Modal Biên bản Giám định Y khoa của Hội đồng GĐYK tỉnh Bình Dương */}
      <BienBanGiamDinhModal
        isOpen={!!selectedHoSoForGdyk}
        onClose={() => setSelectedHoSoForGdyk(null)}
        hoSo={selectedHoSoForGdyk}
      />

      {/* 9. Modal Mẫu D03-TS cấp thẻ BHYT liên thông BHXH */}
      <MauD03TsModal
        isOpen={Boolean(selectedHoSoForD03Ts)}
        onClose={() => setSelectedHoSoForD03Ts(null)}
        hoSo={selectedHoSoForD03Ts}
        loaiNghiepVu={selectedHoSoForD03Ts?.isTuTran ? "BAO_GIAM" : "CAP_MOI"}
      />

      {/* 10. Modal Biên bản Niêm yết công khai 15 ngày tại cấp Xã/Phường */}
      <BienBanNiemYetModal
        isOpen={Boolean(selectedHoSoForNiemYet)}
        onClose={() => setSelectedHoSoForNiemYet(null)}
        hoSo={selectedHoSoForNiemYet}
      />

      {/* 11. Modal Quyết định hưởng trợ cấp Mai táng phí & Trợ cấp một lần */}
      <QuyetDinhMaiTangPhiModal
        isOpen={Boolean(selectedHoSoForMaiTang)}
        onClose={() => setSelectedHoSoForMaiTang(null)}
        hoSo={selectedHoSoForMaiTang}
      />

      {/* 12. Modal Biên bản kiểm tra hiện trường & xác minh thực địa */}
      <BienBanXacMinhThucDiaModal
        isOpen={Boolean(selectedHoSoForXacMinh)}
        onClose={() => setSelectedHoSoForXacMinh(null)}
        hoSo={selectedHoSoForXacMinh}
      />
    </AppShell>
  );
}
