import React, { useState, useMemo } from "react";
import {
  Smartphone,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  MapPin,
  Camera,
  UserCheck,
  Send,
  MessageSquare,
  ShieldCheck,
  Flame,
  Volume2,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { useAppState, appStore } from "@/services/app-state";
import { type PhanAnh1022Item } from "@/data/domain-mock";
import { toast } from "sonner";

export const PhanAnh1022Section: React.FC = () => {
  const { phanAnh1022List } = useAppState();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterLinhVuc, setFilterLinhVuc] = useState("ALL");
  const [filterTrangThai, setFilterTrangThai] = useState("ALL");

  // State Modal Tiếp nhận Phản ánh mới
  const [showAddModal, setShowAddModal] = useState(false);
  const [tieuDe, setTieuDe] = useState("");
  const [noiDung, setNoiDung] = useState("");
  const [diaDiem, setDiaDiem] = useState("");
  const [linhVuc, setLinhVuc] = useState<PhanAnh1022Item["linhVuc"]>("TRAT_TU_DO_THI");
  const [nguoiPhanAnh, setNguoiPhanAnh] = useState("Lê Hoàng Phúc");
  const [soDienThoai, setSoDienThoai] = useState("0909.112.233");
  const [mucDoKhan, setMucDoKhan] = useState<PhanAnh1022Item["mucDoKhan"]>("CAO");

  // State Modal Xử lý phản ánh
  const [resolvingItem, setResolvingItem] = useState<PhanAnh1022Item | null>(null);
  const [ketQuaXuLy, setKetQuaXuLy] = useState("");
  const [canBoXuLy, setCanBoXuLy] = useState("Tổ Quản lý Trật tự Đô thị & Công an Phường");
  const [anhSauXuLy, setAnhSauXuLy] = useState("https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=400&q=80");

  const items = phanAnh1022List || [];

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        item.tieuDe.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.noiDung.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.diaDiem || (item as any).diaChiSuCo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.maPhanAnh.toLowerCase().includes(searchTerm.toLowerCase());
      const matchLv = filterLinhVuc === "ALL" || item.linhVuc === filterLinhVuc;
      const matchTt = filterTrangThai === "ALL" || item.trangThai === filterTrangThai;
      return matchSearch && matchLv && matchTt;
    });
  }, [items, searchTerm, filterLinhVuc, filterTrangThai]);

  const daXuLyCount = items.filter((i) => i.trangThai === "DA_XU_LY").length;
  const dangXuLyCount = items.filter((i) => i.trangThai === "DANG_XU_LY").length;
  const tiepNhanCount = items.filter((i) => i.trangThai === "TIEP_NHAN").length;

  const handleCreatePhanAnh = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tieuDe.trim() || !noiDung.trim() || !diaDiem.trim()) {
      toast.error("Vui lòng điền đầy đủ tiêu đề, nội dung và địa điểm phản ánh");
      return;
    }

    appStore.tiepNhanPhanAnh1022({
      nguoiPhanAnh,
      soDienThoai,
      diaDiem,
      diaChiSuCo: diaDiem,
      linhVuc,
      tieuDe,
      noiDung,
      thoiGianGui: new Date().toLocaleString("vi-VN"),
      thoiHanXuLySLA: "Trong 24 giờ làm việc",
      hanXuLy: "24h",
      mucDoKhan,
      anhHienTruong: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=400&q=80",
    } as any);

    toast.success("Đã tiếp nhận phản ánh hiện trường qua Cổng 1022/IOC thành công!", {
      description: `Mã phiếu tự động sinh, đã kích hoạt bộ đếm thời gian SLA 24h.`,
    });

    setTieuDe("");
    setNoiDung("");
    setDiaDiem("");
    setShowAddModal(false);
  };

  const handleResolvePhanAnh = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingItem || !ketQuaXuLy.trim()) {
      toast.error("Vui lòng nhập kết quả xử lý thực địa");
      return;
    }

    appStore.xuLyPhanAnh1022(resolvingItem.id, {
      ketQuaXuLy,
      canBoXuLy,
      anhSauXuLy,
      trangThai: "DA_XU_LY",
    });

    toast.success(`Đã hoàn tất xử lý và phản hồi cho công dân phản ánh ${resolvingItem.maPhanAnh}`, {
      description: `Nội dung: ${ketQuaXuLy}`,
    });

    setResolvingItem(null);
    setKetQuaXuLy("");
  };

  return (
    <div className="space-y-6">
      {/* Banner 1022 / IOC */}
      <div className="bg-gradient-to-r from-cyan-950 via-sky-950 to-slate-950 text-white rounded-2xl p-6 shadow-md border border-cyan-900/40 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 backdrop-blur-xs rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <Smartphone className="size-3.5" />
            Hệ Thống Phản Ánh Hiện Trường IOC &amp; Tổng Đài 1022 Tỉnh Bình Dương
          </div>
          <h3 className="text-2xl font-bold mb-2">
            Tiếp Nhận &amp; Điều Hành Xử Lý Phản Ánh Hiện Trường Cấp Phường
          </h3>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed mb-4">
            Đường dây nóng 1022 tiếp nhận 24/7 phản ánh của nhân dân về trật tự đô thị, ô nhiễm môi trường, tiếng ồn karaoke, rác thải và lấn chiếm lòng lề đường. Cam kết xử lý thực địa và phản hồi kết quả bằng hình ảnh trong 24 giờ.
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="bg-cyan-900/60 border border-cyan-700/60 px-3 py-1 rounded-lg flex items-center gap-1.5 font-medium">
              <Clock className="size-3.5 text-cyan-300" />
              Cam kết SLA: Xử lý thực địa &le; 24 giờ
            </span>
            <span className="bg-cyan-900/60 border border-cyan-700/60 px-3 py-1 rounded-lg flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="size-3.5 text-emerald-300" />
              Tỷ lệ đúng hạn SLA: 96.5%
            </span>
            <span className="bg-cyan-900/60 border border-cyan-700/60 px-3 py-1 rounded-lg flex items-center gap-1.5 font-medium">
              <Camera className="size-3.5 text-purple-300" />
              Minh chứng ảnh hiện trường Trước / Sau
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Tổng phản ánh tiếp nhận</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{items.length}</span>
            <span className="text-xs font-semibold text-sky-600">vụ việc</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Từ ứng dụng Bình Dương Số &amp; 1022</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Đã xử lý &amp; Trả lời dân</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-700">{daXuLyCount}</span>
            <span className="text-xs font-semibold text-emerald-600">
              ({items.length ? ((daXuLyCount / items.length) * 100).toFixed(1) : 0}%)
            </span>
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 block">Có ảnh đối chứng thực địa</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Đang xử lý trong SLA</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-600">{dangXuLyCount}</span>
            <span className="text-xs font-semibold text-amber-700">đang phân công</span>
          </div>
          <span className="text-[11px] text-amber-600 mt-1 block">Tổ trật tự đô thị &amp; Công an</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Mới tiếp nhận (Chờ duyệt)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-rose-600">{tiepNhanCount}</span>
            <span className="text-xs font-semibold text-rose-700">chờ xử lý</span>
          </div>
          <span className="text-[11px] text-rose-600 mt-1 block">Chuyển cơ sở trong 15 phút</span>
        </div>
      </div>

      {/* Filter and Action Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[220px] max-w-sm flex-1">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tiêu đề, nội dung, địa điểm, mã số..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <select
            value={filterLinhVuc}
            onChange={(e) => setFilterLinhVuc(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700"
          >
            <option value="ALL">Tất cả lĩnh vực</option>
            <option value="TRAT_TU_DO_THI">Trật tự đô thị / Lấn chiếm</option>
            <option value="MOI_TRUONG_RAC_THAI">Môi trường / Rác thải</option>
            <option value="TIENG_ON_KARAOKE">Tiếng ồn loa kéo / Âm thanh</option>
            <option value="QUANG_CAO_RAO_VAT">Quảng cáo rao vặt sai phép</option>
          </select>

          <select
            value={filterTrangThai}
            onChange={(e) => setFilterTrangThai(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="TIEP_NHAN">Mới tiếp nhận</option>
            <option value="DANG_XU_LY">Đang xử lý thực địa</option>
            <option value="DA_XU_LY">Đã xử lý xong</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="size-4" />
          Tiếp Nhận Phản Ánh Hiện Trường Mới
        </button>
      </div>

      {/* Incident Cards */}
      <div className="space-y-4">
        {filteredItems.map((item) => {
          const diaDiemStr = item.diaDiem || (item as any).diaChiSuCo || "Địa bàn Phường Phú Cường";
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all space-y-4"
            >
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                      {item.maPhanAnh}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{item.tieuDe}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {item.linhVuc}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5 text-rose-500" />
                      Địa điểm: <strong className="text-slate-800">{diaDiemStr}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5 text-slate-400" />
                      Gửi lúc: <strong className="text-slate-700">{item.thoiGianGui}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="size-3.5 text-cyan-600" />
                      SLA: <strong className="text-cyan-700">{item.thoiHanXuLySLA || item.hanXuLy || "24 giờ"}</strong>
                    </span>
                  </div>
                </div>

                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                      item.trangThai === "DA_XU_LY"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : item.trangThai === "DANG_XU_LY"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                  >
                    {item.trangThai === "DA_XU_LY" ? (
                      <>
                        <CheckCircle2 className="size-3.5 text-emerald-600" />
                        Đã Xử Lý Xong
                      </>
                    ) : item.trangThai === "DANG_XU_LY" ? (
                      <>
                        <Clock className="size-3.5 text-amber-600" />
                        Đang Xử Lý Thực Địa
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="size-3.5 text-rose-600" />
                        Mới Tiếp Nhận 1022
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Nội dung phản ánh & Ảnh hiện trường */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="md:col-span-2 space-y-2">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 space-y-1">
                    <span className="font-bold text-slate-900 block">Nội dung phản ánh từ người dân:</span>
                    <p className="leading-relaxed">{item.noiDung}</p>
                    <div className="text-[11px] text-slate-500 pt-1">
                      Người phản ánh: <strong>{item.nguoiPhanAnh}</strong> ({item.soDienThoai})
                    </div>
                  </div>

                  {item.ketQuaXuLy && (
                    <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-emerald-950 space-y-1">
                      <span className="font-bold block flex items-center gap-1.5 text-emerald-900">
                        <CheckCircle2 className="size-3.5 text-emerald-600" />
                        Kết quả xử lý &amp; Phản hồi công dân:
                      </span>
                      <p className="leading-relaxed">{item.ketQuaXuLy}</p>
                      {item.canBoXuLy && (
                        <span className="text-[11px] text-emerald-700 block">
                          Cán bộ thụ lý: <strong>{item.canBoXuLy}</strong>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Cột ảnh trước/sau */}
                <div className="space-y-2">
                  {item.anhHienTruong && (
                    <div>
                      <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                        Ảnh hiện trường vi phạm:
                      </span>
                      <img
                        src={item.anhHienTruong}
                        alt="Ảnh hiện trường"
                        className="w-full h-24 object-cover rounded-xl border border-slate-200 shadow-2xs"
                      />
                    </div>
                  )}

                  {item.anhSauXuLy && (
                    <div>
                      <span className="text-[11px] font-semibold text-emerald-700 block mb-1 flex items-center gap-1">
                        <CheckCircle2 className="size-3 text-emerald-600" />
                        Ảnh sau khi xử lý sạch sẽ:
                      </span>
                      <img
                        src={item.anhSauXuLy}
                        alt="Ảnh sau xử lý"
                        className="w-full h-24 object-cover rounded-xl border border-emerald-300 shadow-2xs"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Mức độ khẩn: <strong className={item.mucDoKhan === "KHAN_CAP" ? "text-rose-600" : "text-amber-600"}>{item.mucDoKhan || "TRUNG_BINH"}</strong>
                </span>

                {item.trangThai !== "DA_XU_LY" ? (
                  <button
                    type="button"
                    onClick={() => {
                      setResolvingItem(item);
                      setKetQuaXuLy("Đã ra quân xử lý thực địa, lập biên bản chấn chỉnh và trả lại nguyên trạng trật tự đô thị.");
                    }}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <UserCheck className="size-3.5" />
                    Cập Nhật Kết Quả Xử Lý &amp; Trả Lời Dân
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="size-4" />
                    Phiếu phản ánh đã đóng (Đúng hạn SLA)
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL 1: TIẾP NHẬN PHẢN ÁNH */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-800 to-sky-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Smartphone className="size-5" />
                Tiếp Nhận Phản Ánh Hiện Trường 1022 / IOC Mới
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreatePhanAnh} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tiêu đề phản ánh *</label>
                <input
                  type="text"
                  required
                  value={tieuDe}
                  onChange={(e) => setTieuDe(e.target.value)}
                  placeholder="Ví dụ: Lấn chiếm vỉa hè buôn bán tại ngã tư..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Lĩnh vực phản ánh</label>
                  <select
                    value={linhVuc}
                    onChange={(e) => setLinhVuc(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                  >
                    <option value="TRAT_TU_DO_THI">Trật tự đô thị / Vỉa hè</option>
                    <option value="MOI_TRUONG_RAC_THAI">Môi trường / Rác thải</option>
                    <option value="TIENG_ON_KARAOKE">Tiếng ồn loa kéo</option>
                    <option value="QUANG_CAO_RAO_VAT">Quảng cáo rao vặt sai phép</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mức độ khẩn</label>
                  <select
                    value={mucDoKhan}
                    onChange={(e) => setMucDoKhan(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                  >
                    <option value="TRUNG_BINH">Trung bình (SLA 24h)</option>
                    <option value="CAO">Cao (SLA 12h)</option>
                    <option value="KHAN_CAP">Khẩn cấp (SLA 4h)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Địa điểm xảy ra sự việc *</label>
                <input
                  type="text"
                  required
                  value={diaDiem}
                  onChange={(e) => setDiaDiem(e.target.value)}
                  placeholder="Số nhà, tên đường, khu phố..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nội dung phản ánh chi tiết *</label>
                <textarea
                  rows={3}
                  required
                  value={noiDung}
                  onChange={(e) => setNoiDung(e.target.value)}
                  placeholder="Mô tả cụ thể hành vi, thời điểm và hiện trạng..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Người phản ánh</label>
                  <input
                    type="text"
                    value={nguoiPhanAnh}
                    onChange={(e) => setNguoiPhanAnh(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    value={soDienThoai}
                    onChange={(e) => setSoDienThoai(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg font-bold shadow-xs cursor-pointer"
                >
                  Tiếp Nhận &amp; Kích Hoạt SLA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: XỬ LÝ PHẢN ÁNH */}
      {resolvingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Xử Lý &amp; Trả Lời Phản Ánh Hiện Trường</h3>
                <p className="text-xs text-emerald-200">{resolvingItem.maPhanAnh} · {resolvingItem.tieuDe}</p>
              </div>
              <button
                type="button"
                onClick={() => setResolvingItem(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleResolvePhanAnh} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Kết quả xử lý thực địa *</label>
                <textarea
                  rows={3}
                  required
                  value={ketQuaXuLy}
                  onChange={(e) => setKetQuaXuLy(e.target.value)}
                  placeholder="Ghi rõ biện pháp đã thực hiện, nhắc nhở hoặc lập biên bản xử phạt..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Cán bộ / Đơn vị thực hiện</label>
                <input
                  type="text"
                  value={canBoXuLy}
                  onChange={(e) => setCanBoXuLy(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Đường dẫn ảnh minh chứng sau xử lý</label>
                <input
                  type="text"
                  value={anhSauXuLy}
                  onChange={(e) => setAnhSauXuLy(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setResolvingItem(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs cursor-pointer"
                >
                  Hoàn Tất &amp; Đóng Phiếu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
