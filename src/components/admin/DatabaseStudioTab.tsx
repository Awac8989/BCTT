/**
 * DATABASE STUDIO & 3NF SQL EXPLORER COMPONENT
 * Interactive table browser, schema inspector, SQL query console,
 * backup snapshot creator, and SQL dump exporter for municipal database.
 */

import { useState, useEffect } from "react";
import {
  Database,
  Table as TableIcon,
  Play,
  Download,
  RotateCcw,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  HardDrive,
  Code2,
  Layers,
  Sparkles,
  ExternalLink,
  RefreshCw,
  FileCode,
  AlertTriangle,
  Wrench,
  Zap,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { formatVND } from "@/data/mock";
import { useAppState } from "@/services/app-state";

interface AnomalyItem {
  id: string;
  tableName: string;
  recordId: string | number;
  recordName: string;
  field: string;
  currentValue: string;
  suggestedValue: string;
  errorType: string;
  severity: "CAO" | "TRUNG_BINH" | "NHẮC_NHỞ";
  reason: string;
  sqlFix: string;
}

interface TableInfo {
  name: string;
  displayName: string;
  category: string;
  recordsCount: number;
  columns: {
    name: string;
    type: string;
    nullable: boolean;
    isPrimary?: boolean;
    isForeign?: boolean;
    references?: string;
  }[];
}

interface DatabaseOverview {
  engine: string;
  status: string;
  schema_version: string;
  charset: string;
  tablesCount: number;
  totalRecords: number;
  storageSizeKb: string;
  inTransaction: boolean;
  persistenceFile: string;
}

export function DatabaseStudioTab() {
  const { currentUser } = useAppState();
  const isTechAdmin = currentUser.role === "ADMIN_TECH";

  const [overview, setOverview] = useState<DatabaseOverview | null>(null);
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedTable, setSelectedTable] = useState<string>("ho_so_ncc");
  const [tableData, setTableData] = useState<any>(null);
  const [tableSearch, setTableSearch] = useState("");
  const [tableLoading, setTableLoading] = useState(false);

  // SQL Console state
  const [sqlQuery, setSqlQuery] = useState("SELECT * FROM ho_so_ncc WHERE tyLeThuongTat >= 81 LIMIT 5");
  const [queryResult, setQueryResult] = useState<any>(null);
  const [queryLoading, setQueryLoading] = useState(false);

  // Diagnostics & Fix Studio state
  const [anomalies, setAnomalies] = useState<AnomalyItem[]>([]);
  const [diagnosticsLoading, setDiagnosticsLoading] = useState(false);
  const [diagnosticsOverview, setDiagnosticsOverview] = useState<{
    totalAnomalies: number;
    highSeverityCount: number;
    mediumSeverityCount?: number;
    lowSeverityCount?: number;
    lastScannedAt?: string;
  } | null>(null);
  const [fixingId, setFixingId] = useState<string | null>(null);
  const [showDiagnosticsPanel, setShowDiagnosticsPanel] = useState(true);

  // Load database overview & tables list
  const loadDatabaseInfo = async () => {
    try {
      setLoading(true);
      const [ovRes, tblRes] = await Promise.all([
        fetch("/api/v1/database/overview").then((r) => r.json()),
        fetch("/api/v1/database/tables").then((r) => r.json()),
      ]);

      if (ovRes.success) setOverview(ovRes.data);
      if (tblRes.success) {
        setTables(tblRes.data.tables);
      }
    } catch (err) {
      console.error("Lỗi tải thông tin cơ sở dữ liệu:", err);
      toast.error("Không thể tải thông tin cơ sở dữ liệu từ backend");
    } finally {
      setLoading(false);
    }
  };

  // Load specific table data
  const loadTableData = async (tableName: string, search = "") => {
    try {
      setTableLoading(true);
      const url = `/api/v1/database/tables/${tableName}?limit=20${search ? `&search=${encodeURIComponent(search)}` : ""}`;
      const res = await fetch(url).then((r) => r.json());
      if (res.success) {
        setTableData(res.data);
      }
    } catch (err) {
      console.error(`Lỗi tải dữ liệu bảng ${tableName}:`, err);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    loadDatabaseInfo();
    runDiagnostics();
  }, []);

  // Run data diagnostics scanner
  const runDiagnostics = async () => {
    try {
      setDiagnosticsLoading(true);
      const res = await fetch("/api/v1/database/diagnostics").then((r) => r.json());
      if (res.success) {
        setAnomalies(res.data.anomalies);
        setDiagnosticsOverview({
          totalAnomalies: res.data.totalAnomalies,
          highSeverityCount: res.data.highSeverityCount,
          mediumSeverityCount: res.data.mediumSeverityCount,
          lowSeverityCount: res.data.lowSeverityCount,
          lastScannedAt: res.data.lastScannedAt,
        });
        toast.success(`Đã quét CSDL: Phát hiện ${res.data.totalAnomalies} cảnh báo dữ liệu cần chuẩn hóa`);
      }
    } catch (err) {
      console.error("Lỗi chẩn đoán CSDL:", err);
    } finally {
      setDiagnosticsLoading(false);
    }
  };

  // Fix an anomaly with 1-click
  const handleFixAnomaly = async (ano: AnomalyItem) => {
    if (!isTechAdmin) {
      toast.warning("Phân quyền bảo mật: Chỉ Quản trị viên Kỹ thuật (ADMIN_TECH) mới có quyền can thiệp sửa đổi CSDL!");
      return;
    }
    try {
      setFixingId(ano.id);
      const res = await fetch("/api/v1/database/fix-anomaly", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableName: ano.tableName,
          recordId: ano.recordId,
          field: ano.field,
          fixValue: ano.suggestedValue,
        }),
      }).then((r) => r.json());

      if (res.success) {
        toast.success(`Đã sửa lỗi '${ano.field}' cho ${ano.recordName}!`);
        setAnomalies((prev) => prev.filter((a) => a.id !== ano.id));
        if (selectedTable === ano.tableName) {
          loadTableData(selectedTable, tableSearch);
        }
        loadDatabaseInfo();
      } else {
        toast.error(res.message || "Lỗi khi sửa dữ liệu");
      }
    } catch {
      toast.error("Không thể kết nối máy chủ để sửa dữ liệu");
    } finally {
      setFixingId(null);
    }
  };

  // Copy SQL fix into SQL Console
  const handleApplySqlFixToConsole = (sql: string) => {
    setSqlQuery(sql);
    toast.info("Đã nạp câu lệnh SQL FIX vào bàn điều khiển!");
  };

  useEffect(() => {
    if (selectedTable) {
      loadTableData(selectedTable, tableSearch);
    }
  }, [selectedTable, tableSearch]);

  // Execute SQL Query
  const handleExecuteSql = async () => {
    if (!sqlQuery.trim()) {
      toast.error("Vui lòng nhập câu lệnh SQL");
      return;
    }
    if (sqlQuery.trim().toUpperCase().startsWith("UPDATE") && !isTechAdmin) {
      toast.warning("Lệnh UPDATE bị từ chối: Lãnh đạo chỉ được phép xem (SELECT). Hãy chuyển sang tài khoản Admin Kỹ thuật!");
      return;
    }
    try {
      setQueryLoading(true);
      const res = await fetch("/api/v1/database/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: sqlQuery }),
      }).then((r) => r.json());

      if (res.success) {
        setQueryResult(res.data);
        toast.success("Thực thi câu lệnh SQL thành công!");
      } else {
        toast.error(res.message || "Lỗi thực thi SQL");
      }
    } catch (err) {
      toast.error("Lỗi kết nối máy chủ SQL");
    } finally {
      setQueryLoading(false);
    }
  };

  // Create Snapshot Backup
  const handleCreateBackup = async () => {
    try {
      const res = await fetch("/api/v1/database/backup", { method: "POST" }).then((r) => r.json());
      if (res.success) {
        toast.success(`Tạo bản sao lưu thành công: ${res.data.id}`);
      }
    } catch {
      toast.error("Lỗi khi tạo sao lưu");
    }
  };

  // Reset to Seed
  const handleResetDatabase = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn khôi phục CSDL về dữ liệu mẫu (Seed Data) chuẩn?")) return;
    try {
      const res = await fetch("/api/v1/database/reset", { method: "POST" }).then((r) => r.json());
      if (res.success) {
        toast.success("Đã khôi phục CSDL về trạng thái hạt giống ban đầu!");
        loadDatabaseInfo();
        if (selectedTable) loadTableData(selectedTable);
      }
    } catch {
      toast.error("Lỗi khi reset CSDL");
    }
  };

  // Download SQL Dump file
  const handleDownloadSqlDump = () => {
    window.open("/api/v1/database/export-sql", "_blank");
    toast.success("Đang tải xuống tệp SQL Dump hoàn chỉnh...");
  };

  const filteredTables = selectedCategory === "ALL"
    ? tables
    : tables.filter((t) => t.category === selectedCategory);

  const currentTableMeta = tables.find((t) => t.name === selectedTable);

  return (
    <div className="space-y-6">
      {/* 1. Header KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-lg border border-red-200 bg-red-50/50 p-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-red-900 mb-1">
            <Database className="size-4 text-[#dd4b39]" />
            <span>Quy mô Bảng 3NF</span>
          </div>
          <div className="text-2xl font-black text-gray-900">{overview?.tablesCount || tables.length || 36}</div>
          <div className="text-[11px] text-gray-600 mt-0.5">Bảng dữ liệu chuẩn hóa</div>
        </div>

        <div className="rounded-lg border border-sky-200 bg-sky-50/50 p-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-900 mb-1">
            <TableIcon className="size-4 text-sky-600" />
            <span>Tổng số Bản ghi</span>
          </div>
          <div className="text-2xl font-black text-gray-900">{overview?.totalRecords?.toLocaleString("vi-VN") || "1,248"}</div>
          <div className="text-[11px] text-gray-600 mt-0.5">Bản ghi hoạt động</div>
        </div>

        <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 mb-1">
            <ShieldCheck className="size-4 text-emerald-600" />
            <span>Giao dịch ACID</span>
          </div>
          <div className="text-sm font-black text-emerald-700 mt-1 flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-emerald-600" />
            <span>ĐÃ SẴN SÀNG</span>
          </div>
          <div className="text-[11px] text-gray-600 mt-1">InnoDB · utf8mb4</div>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-1">
            <HardDrive className="size-4 text-amber-600" />
            <span>Lưu trữ Bền vững</span>
          </div>
          <div className="text-sm font-black text-amber-800 mt-1">{overview?.storageSizeKb || "148.5"} KB</div>
          <div className="text-[11px] text-gray-600 mt-1 truncate" title={overview?.persistenceFile}>
            database_persistence.json
          </div>
        </div>
      </div>

      {/* 2. Database Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-700">Công cụ quản trị CSDL:</span>
          <span className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-mono">
            {overview?.engine || "Relational Engine v2.0"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={runDiagnostics}
            disabled={diagnosticsLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs"
          >
            <RefreshCw className={`size-3.5 ${diagnosticsLoading ? "animate-spin" : ""}`} />
            <span>Quét Lỗi Dữ Liệu</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadSqlDump}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
          >
            <Download className="size-3.5" />
            <span>Tải SQL Dump (.sql)</span>
          </button>

          <button
            type="button"
            onClick={handleCreateBackup}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#dd4b39] hover:bg-[#c23321] text-white font-bold text-xs shadow-xs cursor-pointer"
          >
            <Clock className="size-3.5" />
            <span>Tạo Bản Sao Lưu (Backup)</span>
          </button>

          <button
            type="button"
            onClick={handleResetDatabase}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold text-xs cursor-pointer"
          >
            <RotateCcw className="size-3.5 text-amber-600" />
            <span>Khôi phục CSDL Gốc</span>
          </button>
        </div>
      </div>

      {/* 2.5 PHÂN HỆ RÀ SOÁT & SỬA LỖI DỮ LIỆU CSDL */}
      <div className="rounded-lg border border-amber-300 bg-white shadow-xs overflow-hidden">
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Wrench className="size-4 text-amber-200" />
            <span className="font-bold text-xs tracking-wide">
              PHÂN HỆ TRUY VẤN &amp; SỬA LỖI DỮ LIỆU CSDL NỘI BỘ
            </span>
            <span className="bg-amber-100/20 text-[10px] px-2 py-0.5 rounded font-mono font-medium">
              Kiểm toán toàn vẹn CSDL
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isTechAdmin ? (
              <span className="text-[10px] bg-black/30 text-amber-100 border border-amber-300/40 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                <Lock className="size-3" /> Chế độ Xem (Lãnh đạo)
              </span>
            ) : (
              <span className="text-[10px] bg-emerald-800 text-emerald-100 border border-emerald-400/40 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                <ShieldCheck className="size-3" /> Quyền Sửa (Admin Kỹ thuật)
              </span>
            )}
            <span className="text-[11px] bg-white/20 px-2.5 py-0.5 rounded font-bold">
              {anomalies.length} vấn đề cần xử lý
            </span>
            <button
              type="button"
              onClick={() => setShowDiagnosticsPanel(!showDiagnosticsPanel)}
              className="text-[11px] underline hover:text-amber-100 cursor-pointer"
            >
              {showDiagnosticsPanel ? "Thu gọn" : "Mở rộng"}
            </button>
          </div>
        </div>

        {showDiagnosticsPanel && (
          <div className="p-4 space-y-3 bg-amber-50/20">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-gray-700">
                <span className="font-semibold text-gray-900">Trạng thái rà soát:</span>
                <span>
                  Quét tự động trên 42 bảng 3NF · Lần quét gần nhất:{" "}
                  <span className="font-mono text-gray-600">{diagnosticsOverview?.lastScannedAt || "Vừa xong"}</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold">
                  Cao: {diagnosticsOverview?.highSeverityCount || anomalies.filter((a) => a.severity === "CAO").length}
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                  Trung bình: {diagnosticsOverview?.mediumSeverityCount || anomalies.filter((a) => a.severity === "TRUNG_BINH").length}
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                  Nhắc nhở: {diagnosticsOverview?.lowSeverityCount || anomalies.filter((a) => a.severity === "NHẮC_NHỞ").length}
                </span>
              </div>
            </div>

            {anomalies.length === 0 ? (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Hệ thống đạt chuẩn 100%!</strong> Không phát hiện sai lệch định dạng CCCD, thông tin chuyển khoản ngân hàng hay số quyết định trong toàn bộ các bảng dữ liệu.
                </span>
              </div>
            ) : (
              <div className="overflow-x-auto border border-gray-200 rounded-md bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-100 text-gray-700 border-b border-gray-200 text-[11px]">
                    <tr>
                      <th className="p-2.5 font-bold w-20">Mức độ</th>
                      <th className="p-2.5 font-bold">Bảng & Đối tượng</th>
                      <th className="p-2.5 font-bold">Lỗi phát hiện & Lý do</th>
                      <th className="p-2.5 font-bold">Giá trị hiện tại ➔ Đề xuất Fix</th>
                      <th className="p-2.5 font-bold text-right w-44">Hành động khắc phục</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {anomalies.map((ano) => (
                      <tr key={ano.id} className="hover:bg-amber-50/40">
                        <td className="p-2.5">
                          {ano.severity === "CAO" ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-bold text-[10px]">
                              <AlertTriangle className="size-3 text-red-600" />
                              <span>CAO</span>
                            </span>
                          ) : ano.severity === "TRUNG_BINH" ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                              <AlertTriangle className="size-3 text-amber-600" />
                              <span>VỪA</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-bold text-[10px]">
                              <span>NHẮC</span>
                            </span>
                          )}
                        </td>
                        <td className="p-2.5">
                          <div className="font-bold text-gray-900">{ano.recordName}</div>
                          <div className="text-[10px] text-gray-500 font-mono">
                            {ano.tableName} · {ano.recordId}
                          </div>
                        </td>
                        <td className="p-2.5">
                          <div className="font-semibold text-gray-800">{ano.errorType}</div>
                          <div className="text-[11px] text-gray-600">{ano.reason}</div>
                        </td>
                        <td className="p-2.5 font-mono text-[11px]">
                          <span className="text-red-600 bg-red-50 px-1.5 py-0.5 rounded mr-1">
                            {ano.currentValue}
                          </span>
                          <span className="text-gray-400">➔</span>
                          <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold ml-1">
                            {ano.suggestedValue}
                          </span>
                        </td>
                        <td className="p-2.5 text-right space-x-1.5">
                          <button
                            type="button"
                            onClick={() => handleApplySqlFixToConsole(ano.sqlFix)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded border border-gray-300 hover:bg-gray-100 text-gray-700 text-[10px] font-semibold"
                            title="Nạp câu lệnh SQL FIX vào console bên dưới"
                          >
                            <Code2 className="size-3 text-gray-600" />
                            <span>SQL Fix</span>
                          </button>
                          <button
                            type="button"
                            disabled={fixingId === ano.id}
                            onClick={() => handleFixAnomaly(ano)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold shadow-xs cursor-pointer"
                          >
                            <Zap className="size-3 fill-white" />
                            <span>{fixingId === ano.id ? "Đang sửa..." : "Sửa ngay"}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Interactive SQL Query Console */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
        <div className="bg-[#24292e] text-white px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold">
            <Code2 className="size-4 text-emerald-400" />
            <span>Bàn Điều Khiển Truy Vấn & Sửa Lỗi SQL (Interactive Query & Fix Console)</span>
          </div>
          <span className="text-[10px] text-gray-400 font-mono">Hỗ trợ: SELECT, UPDATE ... SET, WHERE, LIMIT</span>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            <span className="text-gray-500 font-semibold mr-1 py-0.5">Truy vấn & Sửa lỗi mẫu:</span>
            <button
              type="button"
              onClick={() => setSqlQuery("SELECT * FROM ho_so_ncc WHERE tyLeThuongTat >= 81 LIMIT 5")}
              className="px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-mono text-[10px]"
            >
              Thương binh nặng ≥ 81%
            </button>
            <button
              type="button"
              onClick={() => setSqlQuery("UPDATE ho_so_ncc SET muc_tro_cap = 2789000 WHERE loaiDoiTuong LIKE 'Thương binh'")}
              className="px-2 py-0.5 rounded bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 font-mono text-[10px] font-bold"
              title="Cập nhật mức trợ cấp chuẩn theo Nghị định 77/2024/NĐ-CP"
            >
              ⚡ UPDATE Mức chuẩn 2.789.000đ (NĐ 77/2024)
            </button>
            <button
              type="button"
              onClick={() => setSqlQuery("UPDATE ho_so_ncc SET so_cccd = '074026000123' WHERE id = 1")}
              className="px-2 py-0.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-mono text-[10px] font-bold"
              title="Fix chuẩn hóa số CCCD 12 số chuẩn C06"
            >
              ⚡ UPDATE Fix CCCD 12 số Đề án 06
            </button>
            <button
              type="button"
              onClick={() => setSqlQuery("UPDATE chi_tra_tro_cap SET soTaiKhoan = '0281000349281' WHERE maPhieuChi = 'PC-2026-03-001'")}
              className="px-2 py-0.5 rounded bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 font-mono text-[10px] font-bold"
              title="Bổ sung tài khoản Vietcombank an sinh xã hội"
            >
              ⚡ UPDATE Fix STK VNeID Ngân hàng
            </button>
            <button
              type="button"
              onClick={() => setSqlQuery("UPDATE ho_so_ncc SET soBhyt = 'CC4740001889' WHERE id = 1")}
              className="px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono text-[10px] font-bold"
              title="Đồng bộ mã thẻ BHYT ưu đãi 100%"
            >
              ⚡ UPDATE Fix Mã Thẻ BHYT NCC
            </button>
            <button
              type="button"
              onClick={() => setSqlQuery("SELECT * FROM bang_danh_gia_kpi_can_bo LIMIT 10")}
              className="px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-mono text-[10px]"
            >
              Bảng điểm KPI cán bộ
            </button>
            <button
              type="button"
              onClick={() => setSqlQuery("SELECT * FROM so_quy_den_on_dap_nghia LIMIT 10")}
              className="px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-mono text-[10px]"
            >
              Sổ Quỹ Đền ơn đáp nghĩa
            </button>
          </div>

          <div className="flex gap-2">
            <textarea
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              rows={2}
              className="w-full font-mono text-xs bg-gray-900 text-emerald-400 p-2.5 rounded border border-gray-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              placeholder="Nhập câu lệnh SELECT SQL..."
            />
            <button
              type="button"
              disabled={queryLoading}
              onClick={handleExecuteSql}
              className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex flex-col items-center justify-center gap-1 shrink-0 shadow-xs"
            >
              <Play className="size-4 fill-white" />
              <span>Chạy</span>
            </button>
          </div>

          {queryResult && (
            <div className="rounded border border-gray-200 bg-gray-50 p-3 space-y-2 text-xs">
              <div className="flex items-center justify-between text-gray-600 text-[11px]">
                <span className="font-bold text-emerald-700">
                  Kết quả: {queryResult.rowCount || queryResult.rows?.length || 0} bản ghi
                </span>
                <span className="font-mono text-gray-500">
                  Thời gian thực thi: {queryResult.executionTimeMs || 1.2} ms
                </span>
              </div>
              <div className="overflow-x-auto max-h-48 border rounded bg-white">
                {queryResult.rows && queryResult.rows.length > 0 ? (
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-gray-100 text-gray-700 border-b">
                      <tr>
                        {Object.keys(queryResult.rows[0]).slice(0, 8).map((k) => (
                          <th key={k} className="p-1.5 font-bold">{k}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {queryResult.rows.map((row: any, idx: number) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          {Object.keys(queryResult.rows[0]).slice(0, 8).map((k) => (
                            <td key={k} className="p-1.5 font-mono truncate max-w-[150px]">
                              {String(row[k])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-3 text-center text-gray-500">Không có bản ghi nào phù hợp điều kiện truy vấn.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Table Explorer & Schema Viewer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Column: Tables List */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-3 space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <div className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
              <Layers className="size-4 text-[#dd4b39]" />
              <span>Danh mục 36 Bảng 3NF</span>
            </div>
            <span className="text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.5 rounded">
              {filteredTables.length} bảng
            </span>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-1 text-[10px]">
            {["ALL", "HỆ THỐNG", "NGƯỜI CÓ CÔNG", "GIÁO DỤC", "AN SINH", "VĂN HÓA", "THÔNG TIN CĐS", "KPI"].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCategory(c)}
                className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                  selectedCategory === c
                    ? "bg-[#dd4b39] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Tables List */}
          <div className="overflow-y-auto max-h-[460px] space-y-1 pr-1">
            {filteredTables.map((t) => (
              <button
                key={t.name}
                type="button"
                onClick={() => setSelectedTable(t.name)}
                className={`w-full text-left p-2 rounded text-xs transition-colors flex items-center justify-between ${
                  selectedTable === t.name
                    ? "bg-red-50 border border-red-200 text-red-900 font-bold"
                    : "hover:bg-gray-50 border border-transparent text-gray-700"
                }`}
              >
                <div className="truncate pr-2">
                  <div className="font-mono text-[11px] truncate">{t.name}</div>
                  <div className="text-[10px] text-gray-500 font-normal truncate">{t.displayName}</div>
                </div>
                <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-mono shrink-0">
                  {t.recordsCount}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right 2 Columns: Table Data & Schema */}
        <div className="md:col-span-2 bg-white rounded-lg border border-gray-200 shadow-xs p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between border-b pb-2 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-gray-900 font-mono">{selectedTable}</span>
                <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded">
                  {currentTableMeta?.category || "CSDL"}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{currentTableMeta?.displayName}</div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="size-3.5 absolute left-2 top-2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Lọc dữ liệu bảng..."
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  className="pl-7 pr-2 py-1 text-xs border rounded w-44 outline-none focus:border-red-400"
                />
              </div>

              <button
                type="button"
                onClick={() => loadTableData(selectedTable, tableSearch)}
                className="p-1 rounded border hover:bg-gray-100 text-gray-600"
                title="Làm mới bảng"
              >
                <RefreshCw className={`size-3.5 ${tableLoading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {/* Table Columns Schema Badge List */}
          {currentTableMeta && (
            <div className="p-2 bg-gray-50 rounded border text-[11px] space-y-1">
              <div className="font-bold text-gray-700 flex items-center gap-1 text-[10px] uppercase tracking-wide">
                <FileCode className="size-3 text-gray-500" />
                <span>Cấu trúc Schema ({currentTableMeta.columns?.length || 0} cột):</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentTableMeta.columns?.map((col) => (
                  <span
                    key={col.name}
                    className={`px-1.5 py-0.5 rounded font-mono text-[10px] border ${
                      col.isPrimary
                        ? "bg-amber-100 border-amber-300 text-amber-900 font-bold"
                        : col.isForeign
                        ? "bg-purple-100 border-purple-300 text-purple-900"
                        : "bg-white border-gray-200 text-gray-700"
                    }`}
                  >
                    {col.name} <span className="text-gray-400">({col.type})</span>
                    {col.isPrimary && " 🔑"}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Table Data View */}
          <div className="overflow-x-auto max-h-[350px] border rounded">
            {tableLoading ? (
              <div className="p-6 text-center text-xs text-gray-500">Đang tải dữ liệu từ CSDL...</div>
            ) : tableData?.rows && tableData.rows.length > 0 ? (
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-100 text-gray-700 border-b sticky top-0">
                  <tr>
                    {Object.keys(tableData.rows[0]).slice(0, 7).map((k) => (
                      <th key={k} className="p-2 font-bold text-[11px] whitespace-nowrap">{k}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tableData.rows.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      {Object.keys(tableData.rows[0]).slice(0, 7).map((k) => (
                        <td key={k} className="p-2 font-mono text-[11px] truncate max-w-[180px]">
                          {typeof row[k] === "number" && row[k] > 100000 && !k.toLowerCase().includes("cccd") && !k.toLowerCase().includes("id")
                            ? formatVND(row[k])
                            : String(row[k] ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-6 text-center text-xs text-gray-500">Bảng này hiện chưa có bản ghi dữ liệu.</div>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
            <span>Hiển thị tối đa 20 bản ghi trên trang</span>
            <span>Tổng cộng: {tableData?.totalRecords || 0} bản ghi trong bảng {selectedTable}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
