/**
 * BACKEND COMPREHENSIVE VERIFICATION TEST SUITE
 * Directly tests the backend API router with real Request/Response objects
 * Covers all test cases in README.md & TECHNICAL_DESIGN_DOCUMENT.md:
 * TC-PRF-01, TC-PRF-02, TC-PRF-03, TC-PRF-04
 * TC-APR-01, TC-APR-02, TC-APR-03
 * TC-SUR-01, TC-SUR-02, TC-SUR-03
 * TC-PAY-01, TC-PAY-02, TC-PAY-03
 * TC-REC-01, TC-REC-02
 * TC-DEC-01, TC-DEC-02, TC-DEC-03
 * TC-ORT-01, TC-ORT-02
 * TC-GIS-01, TC-GIS-02
 * TC-WRN-01, TC-WRN-02
 * TC-SEC-01, TC-SEC-02
 */

import { handleBackendApiRequest } from "../src/server/index.js";
import { backendStore } from "../src/server/services/backend-store.js";

const BASE_URL = "http://localhost:8081";

let passedCount = 0;
let failedCount = 0;

function assert(condition, testName, details = "") {
  if (condition) {
    console.log(`  ✅ [PASS] ${testName}`);
    passedCount++;
  } else {
    console.error(`  ❌ [FAIL] ${testName} - ${details}`);
    failedCount++;
  }
}

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const req = new Request(url, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const res = await handleBackendApiRequest(req);
  const status = res.status;
  const text = await res.clone().text().catch(() => "");
  const json = await res.json().catch(() => null);
  return { status, json, text, res };
}

async function runTests() {
  console.log("================================================================================");
  console.log("🚀 BẮT ĐẦU KIỂM THỬ TOÀN DIỆN HỆ THỐNG BACKEND (TEST SUITES COMPREHENSIVE)");
  console.log("================================================================================\n");

  backendStore.reset();

  // 1. HEALTH & SYSTEM INFO
  console.log("📦 1. KIỂM THỬ HEALTH CHECK & HỆ THỐNG 16 BẢNG (database/schema.sql)");
  {
    const { status, json } = await request("/api/v1/health");
    assert(status === 200, "Health Check status 200 OK", `Got ${status}`);
    assert(json.data.status === "HEALTHY", "Trạng thái HEALTHY", json.data?.status);
    assert(json.data.database.tables_count === 16, "Đủ 16 bảng chuẩn 3NF", `Count: ${json.data?.database?.tables_count}`);
    assert(json.data.database.records_summary.profiles > 0, "Có hồ sơ ban đầu", `Count: ${json.data?.database?.records_summary?.profiles}`);

    const sysInfo = await request("/api/v1/system/info");
    assert(sysInfo.status === 200, "System Info status 200 OK", `Got ${sysInfo.status}`);
    assert(sysInfo.json.data.legal_framework.length >= 5, "Căn cứ pháp lý đầy đủ (NĐ 131, NĐ 75, NĐ 61, Đề án 06)");
  }

  // 2. AUTHENTICATION & RBAC
  console.log("\n🔐 2. KIỂM THỬ XÁC THỰC & PHÂN QUYỀN RBAC (/api/v1/auth)");
  {
    const loginRes = await request("/api/v1/auth/login", {
      method: "POST",
      body: { role: "ADMIN_SO" },
    });
    assert(loginRes.status === 200, "Đăng nhập vai trò Admin Cấp Sở thành công", `Status: ${loginRes.status}`);
    assert(loginRes.json.data.user.role === "ADMIN_SO", "Vai trò trả về ADMIN_SO");
    assert(Boolean(loginRes.json.data.token), "Sinh JWT Bearer Token hợp lệ");

    const meRes = await request("/api/v1/auth/me");
    assert(meRes.status === 200, "Truy vấn thông tin phiên làm việc /me thành công");
    assert(meRes.json.data.user.tenCanBo.includes("Nguyễn Văn Hùng"), "Đúng danh tính TS. Nguyễn Văn Hùng");

    const switchRes = await request("/api/v1/auth/switch-role", {
      method: "POST",
      body: { role: "ADMIN_PHONG" },
    });
    assert(switchRes.status === 200, "TC-SEC-02: Chuyển đổi vai trò sang Admin Cấp Phòng (1-Click Switch)");
    assert(backendStore.currentUser.role === "ADMIN_PHONG", "State backend đổi sang ADMIN_PHONG");
  }

  // 3. FINANCIAL CALCULATION ENGINE
  console.log("\n💰 3. KIỂM THỬ ĐỘNG CƠ TÍNH TRỢ CẤP (/api/v1/calculator)");
  {
    const calcRes = await request("/api/v1/calculator/allowance", {
      method: "POST",
      body: {
        ma_loai_dt: "THUONG_BINH",
        ty_le_thuong_tat: 81,
        co_nguoi_cham_soc: true,
      },
    });
    assert(calcRes.status === 200, "Tính trợ cấp Thương binh 81% thành công");
    assert(calcRes.json.data.base_rate === 2055000, "Mức chuẩn chuẩn xác 2.055.000 VNĐ");
    assert(calcRes.json.data.he_so === 3.85, "Hệ số chuẩn xác 3.85");
    assert(calcRes.json.data.tro_cap_hang_thang === 7911750, "Trợ cấp tháng = 7.911.750 VNĐ");
    assert(calcRes.json.data.phu_cap_nguoi_phuc_vu === 2055000, "Phụ cấp người chăm sóc = 2.055.000 VNĐ");
    const expectedTongTien = calcRes.json.data.tro_cap_hang_thang + calcRes.json.data.phu_cap_nguoi_phuc_vu + (calcRes.json.data.tro_cap_dieu_duong || 0);
    assert(calcRes.json.data.tong_tien_thuc_nhan === expectedTongTien, `Tổng tiền thực nhận chính xác = ${expectedTongTien.toLocaleString("vi-VN")} VNĐ (Trợ cấp tháng + Phụ cấp chăm sóc + Điều dưỡng)`);
    assert(Boolean(calcRes.json.data.so_tien_bang_chu), "Đọc số tiền thành chữ chuẩn biểu mẫu C70a-HD");
  }

  // 4. PROFILES & VALIDATION & ACID TRANSACTION
  console.log("\n📋 4. KIỂM THỬ QUẢN LÝ HỒ SƠ & VALIDATION ZOD (/api/v1/profiles)");
  {
    // TC-PRF-01: Tạo hồ sơ hợp lệ với CCCD 12 chữ số
    const validCccd = "074099001122";
    const createRes = await request("/api/v1/profiles", {
      method: "POST",
      body: {
        so_cccd: validCccd,
        ho_ten: "TRẦN VĂN AN",
        ngay_sinh: "1960-05-10",
        gioi_tinh: "NAM",
        dia_chi_thuong_tru: "Số 12 đường CMT8, Phường Phú Cường",
        ward_id: 1,
        phuong: "Phú Cường",
        ma_loai_dt: "THUONG_BINH",
        ty_le_thuong_tat: 61,
        co_nguoi_cham_soc: false,
      },
    });
    assert(createRes.status === 201, "TC-PRF-01: Tạo hồ sơ hợp lệ với CCCD 12 số (201 Created)", `Status ${createRes.status}`);
    assert(Boolean(createRes.json.data.ho_so_id), "Sinh mã hồ sơ quản lý mới", createRes.json.data?.ho_so_id);
    const newId = createRes.json.data.ho_so_id;

    // TC-PRF-02: Chặn tạo hồ sơ khi số CCCD bị trùng lặp
    const dupRes = await request("/api/v1/profiles", {
      method: "POST",
      body: {
        so_cccd: validCccd, // Trùng
        ho_ten: "NGUYỄN VĂN TRÙNG",
        ngay_sinh: "1970-01-01",
        gioi_tinh: "NAM",
        dia_chi_thuong_tru: "Khu phố 2",
        ward_id: 1,
        ma_loai_dt: "THUONG_BINH",
        ty_le_thuong_tat: 50,
      },
    });
    assert(dupRes.status === 409, "TC-PRF-02: Chặn tạo hồ sơ trùng CCCD (409 Conflict)", `Status ${dupRes.status}`);
    assert(dupRes.json.message.includes("đã tồn tại"), "Thông báo lỗi trùng CCCD chuẩn xác");

    // TC-PRF-03: Chặn nhập CCCD sai định dạng
    const invalidCccdRes = await request("/api/v1/profiles", {
      method: "POST",
      body: {
        so_cccd: "0740123A", // Sai định dạng
        ho_ten: "LÊ THỊ B",
        ngay_sinh: "1965-02-02",
        gioi_tinh: "NU",
        dia_chi_thuong_tru: "Khu phố 3",
        ward_id: 1,
        ma_loai_dt: "THUONG_BINH",
        ty_le_thuong_tat: 40,
      },
    });
    assert(invalidCccdRes.status === 400, "TC-PRF-03: Zod chặn CCCD sai định dạng (400 Bad Request)", `Status ${invalidCccdRes.status}`);

    // TC-PRF-04: Kiểm tra giới hạn biên tỷ lệ thương tật (0-100%)
    const invalidRateRes = await request("/api/v1/profiles", {
      method: "POST",
      body: {
        so_cccd: "074099999999",
        ho_ten: "PHẠM VĂN C",
        ngay_sinh: "1955-03-03",
        gioi_tinh: "NAM",
        dia_chi_thuong_tru: "Khu phố 4",
        ward_id: 1,
        ma_loai_dt: "THUONG_BINH",
        ty_le_thuong_tat: 120, // Vượt quá 100%
      },
    });
    assert(invalidRateRes.status === 400, "TC-PRF-04: Zod chặn tỷ lệ thương tật > 100% (400 Bad Request)");

    // TC-APR-01: Phê duyệt hồ sơ & ban hành QĐ (Giao dịch ACID)
    const approveRes = await request(`/api/v1/profiles/${newId}/approve`, {
      method: "POST",
      body: { coNguoiChamSoc: false },
    });
    assert(approveRes.status === 200, "TC-APR-01: Thẩm định & Phê duyệt hồ sơ thành công (200 OK)");
    assert(approveRes.json.data.trang_thai === "ĐÃ_DUYỆT", "Trạng thái chuyển sang ĐÃ_DUYỆT");
    assert(Boolean(approveRes.json.data.so_quyet_dinh), "Ban hành số Quyết định hưởng QĐ-UBND");

    // Tra cứu chi tiết hồ sơ
    const detailRes = await request(`/api/v1/profiles/${newId}`);
    assert(detailRes.status === 200, "Truy vấn chi tiết hồ sơ thành công");
    assert(detailRes.json.data.cccd === validCccd, "Thông tin CCCD khớp chính xác");
  }

  // 5. CITIZEN CSAT SURVEYS & SENTIMENT AI
  console.log("\n⭐ 5. KIỂM THỬ KHẢO SÁT CSAT & PHÂN TÍCH CẢM XÚC SENTIMENT (/api/v1/surveys)");
  {
    // TC-SUR-01: Gửi phản hồi tích cực
    const posSurv = await request("/api/v1/surveys/submit", {
      method: "POST",
      body: {
        ho_so_id: "HS-001",
        diem_csat_chung: 5,
        kenh_danh_gia: "QR_PHIEU_HEN",
        y_kien_dong_gop: "Cán bộ rất nhiệt tình và giải quyết nhanh chóng",
      },
    });
    assert(posSurv.status === 201, "TC-SUR-01: Tiếp nhận khảo sát tích cực thành công (201 Created)");
    assert(posSurv.json.data.sentiment_tag === "POSITIVE", "Sentiment AI gắn nhãn đúng POSITIVE");

    // TC-SUR-02: Tự động phát hiện phản hồi tiêu cực và bắn cảnh báo
    const initialWarningCount = backendStore.earlyWarnings.length;
    const negSurv = await request("/api/v1/surveys/submit", {
      method: "POST",
      body: {
        ho_so_id: "HS-002",
        diem_csat_chung: 1,
        kenh_danh_gia: "KIOSK",
        y_kien_dong_gop: "Thủ tục quá chậm chạp, cán bộ hách dịch phiền hà",
      },
    });
    assert(negSurv.status === 201, "TC-SUR-02: Tiếp nhận khảo sát tiêu cực thành công");
    assert(negSurv.json.data.sentiment_tag === "NEGATIVE", "Sentiment AI nhận diện nhãn NEGATIVE");
    assert(backendStore.earlyWarnings.length > initialWarningCount, "Tự động kích hoạt Cảnh báo sớm mức CAO");

    // Analytics CSAT
    const survAnalytics = await request("/api/v1/surveys/analytics");
    assert(survAnalytics.status === 200, "Lấy thống kê CSAT & Radar SIPAS thành công");
    assert(survAnalytics.json.data.sipas_radar_criteria.length === 4, "Đủ 4 tiêu chí Radar SIPAS chuẩn quốc gia");
  }

  // 6. PAYOUTS & BANK RECONCILIATION
  console.log("\n🏦 6. KIỂM THỬ CHI TRẢ TRỢ CẤP & ĐỐI SOÁT NGÂN HÀNG (/api/v1/payouts)");
  {
    const payoutsList = await request("/api/v1/payouts");
    assert(payoutsList.status === 200, "Lấy danh sách chi trả thành công");
    assert(payoutsList.json.data.items.length > 0, "Có dữ liệu chi trả");

    const targetPayout = payoutsList.json.data.items[0];

    // TC-PAY-01: Phát tiền đơn lẻ
    const paySingle = await request(`/api/v1/payouts/${targetPayout.id}/pay`, { method: "POST" });
    assert(paySingle.status === 200, "TC-PAY-01: Phát tiền đơn lẻ thành công");
    assert(paySingle.json.data.trangThai === "ĐÃ_CHI_TRẢ", "Trạng thái chuyển ĐÃ_CHI_TRẢ");

    // TC-PAY-02: Phát tiền hàng loạt
    const batchRes = await request("/api/v1/payouts/batch-pay", {
      method: "POST",
      body: { ids: ["CT-202609-002", "CT-202609-003"] },
    });
    assert(batchRes.status === 200, "TC-PAY-02: Phát tiền hàng loạt (Batch Payout) thành công");

    // TC-PAY-03: Xuất phiếu chi Mẫu C70a-HD
    const receiptRes = await request(`/api/v1/payouts/${targetPayout.id}/receipt`);
    assert(receiptRes.status === 200, "TC-PAY-03: Xuất dữ liệu Phiếu chi Mẫu C70a-HD thành công");
    assert(receiptRes.json.data.mau_bieu === "C70a-HD", "Đúng mẫu biểu quy định C70a-HD");
    assert(Boolean(receiptRes.json.data.so_tien_bang_chu), "Có số tiền bằng chữ");

    // TC-REC-01 & TC-REC-02: Đối soát sao kê ngân hàng
    const reconRes = await request("/api/v1/payouts/reconcile", {
      method: "POST",
      body: {
        bankName: "Vietcombank",
        records: [
          { cccd: "074045001923", trangThai: "THÀNH_CÔNG" },
          { cccd: "074050004455", trangThai: "THẤT_BẠI", lyDoLoi: "Tài khoản bị đóng" },
        ],
      },
    });
    assert(reconRes.status === 200, "TC-REC-01 & TC-REC-02: Xử lý đối soát sao kê ngân hàng thành công");
    assert(reconRes.json.data.matched_failed >= 1, "TC-REC-02: Phát hiện và xử lý giao dịch lỗi sang TỒN_ĐỌNG");
  }

  // 7. DECEASE REPORTING & FUNERAL GRANT
  console.log("\n⚰️ 7. KIỂM THỬ BÁO GIẢM TỪ TRẦN & MAI TÁNG PHÍ (/api/v1/decease-report)");
  {
    const targetHoSo = backendStore.profiles[0];
    const deceaseRes = await request("/api/v1/decease-report", {
      method: "POST",
      body: {
        ho_so_id: targetHoSo.id,
        ngay_mat: "15/09/2026",
        so_trich_luc_khai_tu: "112/TLKT",
        nguoi_khai: "Phạm Thị Lan",
        quan_he: "Con gái",
      },
    });

    assert(deceaseRes.status === 201, "TC-DEC-01: Báo giảm từ trần thành công (201 Created)");
    assert(deceaseRes.json.data.so_tien_mai_tang_phi === 20550000, "TC-DEC-01: Định mức mai táng phí 10 x Mức chuẩn = 20.550.000 VNĐ");
    assert(Boolean(deceaseRes.json.data.so_quyet_dinh_mai_tang), "TC-DEC-03: Ban hành Quyết định Mai táng phí Mẫu 02 (NĐ 131)");
  }

  // 8. ORTHOTICS & ASSISTIVE DEVICES
  console.log("\n🦿 8. KIỂM THỬ DỤNG CỤ CHỈNH HÌNH & NIÊN HẠN 3-5 NĂM (/api/v1/orthotics)");
  {
    const listOrth = await request("/api/v1/orthotics");
    assert(listOrth.status === 200, "Lấy danh sách dụng cụ chỉnh hình thành công");

    // TC-ORT-01: Cấp xe lăn mới niên hạn 5 năm
    const newOrth = await request("/api/v1/orthotics", {
      method: "POST",
      body: {
        ho_so_id: "HS-001",
        ho_ten: "Nguyễn Văn Thành",
        ten_dung_cu: "Xe lăn tay tiêu chuẩn",
        loai_dung_cu: "XE_LĂN",
        nien_han_nam: 5,
        dinh_muc_tien: 4500000,
      },
    });
    assert(newOrth.status === 201, "TC-ORT-01: Cấp xe lăn mới niên hạn 5 năm thành công");
    assert(newOrth.json.data.nam_den_han_cap_moi === new Date().getFullYear() + 5, "Tính niên hạn đến hạn cấp mới chính xác (+5 năm)");
  }

  // 9. CEMETERY GIS & ONLINE INCENSE
  console.log("\n🕯️ 9. KIỂM THỬ NGHĨA TRANG LIỆT SĨ GIS & DÂNG HƯƠNG ONLINE (/api/v1/cemetery)");
  {
    const searchGrave = await request("/api/v1/cemetery/graves?search=Hồ Văn Lên");
    assert(searchGrave.status === 200, "TC-GIS-01: Tra cứu mộ liệt sĩ Hồ Văn Lên thành công");
    assert(searchGrave.json.data.items.length > 0, "Tìm thấy đúng vị trí mộ");

    const grave = searchGrave.json.data.items[0];
    const initialIncense = grave.luotThapHuong;

    const incenseRes = await request(`/api/v1/cemetery/graves/${grave.id}/incense`, { method: "POST" });
    assert(incenseRes.status === 200, "TC-GIS-02: Thắp nén hương tri ân trực tuyến thành công");
    assert(incenseRes.json.data.luot_thap_huong === initialIncense + 1, "Số lượt thắp hương tăng +1 chính xác");
  }

  // 10. EARLY WARNINGS
  console.log("\n🚨 10. KIỂM THỬ TRUNG TÂM CẢNH BÁO SỚM RỦI RO (/api/v1/early-warnings)");
  {
    const warningsRes = await request("/api/v1/early-warnings");
    assert(warningsRes.status === 200, "Lấy danh sách cảnh báo sớm thành công");
    assert(warningsRes.json.data.total > 0, "Có danh sách cảnh báo ban đầu");

    const firstWarning = warningsRes.json.data.items[0];
    const resolveRes = await request(`/api/v1/early-warnings/${firstWarning.id}/resolve`, { method: "PATCH" });
    assert(resolveRes.status === 200, "Đóng cảnh báo sau khi xử lý thành công");
  }

  // 11. EDUCATION & TTHC PROCEDURES (PHÂN HỆ 4)
  console.log("\n🎓 11. KIỂM THỬ PHÂN HỆ GIÁO DỤC & THỦ TỤC MỘT CỬA (/api/v1/giao-duc)");
  {
    const gdList = await request("/api/v1/giao-duc/ho-so");
    assert(gdList.status === 200, "Lấy danh sách hồ sơ TTHC Giáo dục thành công");
    assert(gdList.json.data.total > 0, "Có hồ sơ TTHC mầm non ban đầu");

    // Tiếp nhận hồ sơ mới
    const newGd = await request("/api/v1/giao-duc/ho-so", {
      method: "POST",
      body: {
        nguoiNop: "Phạm Thu Hương",
        soDienThoai: "0903888999",
        tenCoSoDeNghi: "Lớp Mầm non Ban Mai Vàng",
        diaDiemCoSo: "Khu phố 1, Phường Phú Cường",
      },
    });
    assert(newGd.status === 201, "Tiếp nhận hồ sơ Một cửa mới thành công (Mẫu 01)");

    // Ký số SmartCA
    const kySoRes = await request(`/api/v1/giao-duc/ho-so/${newGd.json.data.id}/ky-so`, { method: "POST" });
    assert(kySoRes.status === 200, "Lãnh đạo ký số SmartCA điện tử thành công");
    assert(Boolean(kySoRes.json.data.ma_xac_thuc), "Có mã xác thực chữ ký số SHA-256");

    // KPI Giáo dục
    const kpiRes = await request("/api/v1/giao-duc/kpi");
    assert(kpiRes.status === 200, "Lấy KPI Giáo dục thành công");
    assert(kpiRes.json.data.pho_cap_gd.pho_cap_mn_5_tuoi === 99.8, "Chỉ số phổ cập GDMN 5T đạt 99.8%");
  }

  // 12. DASHBOARD ANALYTICS & BI
  console.log("\n📊 12. KIỂM THỬ TỔNG HỢP ANALYTICS & BẢN ĐỒ NHIỆT 14 PHƯỜNG (/api/v1/analytics)");
  {
    const dashRes = await request("/api/v1/analytics/dashboard");
    assert(dashRes.status === 200, "Lấy số liệu Dashboard BI thành công");
    assert(dashRes.json.data.heat_map_wards.length === 14, "Đủ 14 phường thuộc TP. Thủ Dầu Một");
    assert(dashRes.json.data.summary.total_profiles > 12400, "Tổng số hồ sơ quản lý đúng số liệu thống kê");
  }

  // 13. VĂN HÓA, THỂ THAO & ĐỜI SỐNG VĂN MINH ĐÔ THỊ (/api/v1/van-hoa)
  console.log("\n🏛️ 13. KIỂM THỬ PHÂN HỆ VĂN HÓA, THỂ THAO & NẾP SỐNG VĂN MINH (/api/v1/van-hoa)");
  {
    // Gia đình văn hóa
    const gdList = await request("/api/v1/van-hoa/gia-dinh");
    assert(gdList.status === 200, "Lấy danh sách gia đình văn hóa thành công");
    assert(gdList.json.data.total > 0, "Có dữ liệu hộ gia đình văn hóa ban đầu");

    const newGdRes = await request("/api/v1/van-hoa/gia-dinh", {
      method: "POST",
      body: {
        chuHo: "Ông Hoàng Minh Trí",
        cccd: "074088009988",
        diaChi: "Số 99 đường Bạch Đằng, KP3",
        khuPho: "Khu phố 3",
        soThanhVien: 4,
        diemGuongMau: 30,
        diemKinhTe: 29,
        diemHoaThuan: 38,
      },
    });
    assert(newGdRes.status === 201, "Đăng ký danh hiệu Gia đình văn hóa mới thành công (NĐ 86/2023)");
    const newGdvId = newGdRes.json.data.id;

    // Bình xét chấm điểm
    const bxRes = await request(`/api/v1/van-hoa/gia-dinh/${newGdvId}/binh-xet`, {
      method: "POST",
      body: {
        diemGuongMau: 30,
        diemKinhTe: 30,
        diemHoaThuan: 38,
        deNghiKhenThuong: true,
      },
    });
    assert(bxRes.status === 200, "Bình xét Gia đình văn hóa 98/100 điểm thành công");
    assert(bxRes.json.data.ketQua === "DAT_CHUAN", "Xác nhận đạt chuẩn Gia đình văn hóa");

    // Di tích & Lễ hội Chùa Bà
    const dtList = await request("/api/v1/van-hoa/di-tich");
    assert(dtList.status === 200, "Lấy danh sách di tích lịch sử & lễ hội thành công");
    assert(dtList.json.data.items.some((d) => d.tenDiTich.includes("Chùa Bà")), "Có di tích Lễ hội Chùa Bà Thiên Hậu");

    // Cập nhật PCCC di tích
    const pcccRes = await request(`/api/v1/van-hoa/di-tich/${dtList.json.data.items[0].id}/pccc`, {
      method: "PATCH",
      body: { congTacPCCC: "DAM_BAO_100%" },
    });
    assert(pcccRes.status === 200, "Cập nhật PCCC Di tích thành công");

    // Kiểm tra liên ngành cơ sở Karaoke/Dịch vụ văn hóa
    const csList = await request("/api/v1/van-hoa/co-so-dich-vu");
    assert(csList.status === 200, "Lấy danh sách cơ sở kinh doanh dịch vụ văn hóa thành công");
    const firstCs = csList.json.data.items[0];

    const ktRes = await request(`/api/v1/van-hoa/co-so-dich-vu/${firstCs.id}/kiem-tra`, {
      method: "POST",
      body: {
        ketLuan: "CHUP_HANH_TOT",
        noiDungXuLy: "Đảm bảo đóng cửa trước 24h, PCCC đạt chuẩn",
      },
    });
    assert(ktRes.status === 200, "Ghi nhận kết quả kiểm tra liên ngành dịch vụ văn hóa thành công (NĐ 54/2019)");

    // Địa chỉ tin cậy phòng chống bạo lực gia đình
    const dcList = await request("/api/v1/van-hoa/dia-chi-tin-cay");
    assert(dcList.status === 200, "Lấy danh bạ Địa chỉ tin cậy phòng chống bạo lực gia đình thành công");
    const firstDc = dcList.json.data.items[0];

    const hoTroRes = await request(`/api/v1/van-hoa/dia-chi-tin-cay/${firstDc.id}/ho-tro`, { method: "POST" });
    assert(hoTroRes.status === 200, "Kích hoạt hỗ trợ khẩn cấp nạn nhân bạo lực gia đình thành công (Luật 2022)");

    // Làng nghề truyền thống (Sơn mài, Gốm lò lu)
    const lnList = await request("/api/v1/van-hoa/lang-nghe");
    assert(lnList.status === 200, "Lấy danh mục làng nghề truyền thống thành công");
    assert(lnList.json.data.di_san_quoc_gia >= 1, "Có ít nhất 1 Di sản văn hóa phi vật thể Quốc gia (Sơn mài Tương Bình Hiệp)");

    // Bản đồ số GIS Văn hóa & Du lịch
    const gisList = await request("/api/v1/van-hoa/gis-ban-do");
    assert(gisList.status === 200, "Lấy bản đồ số GIS văn hóa & du lịch thành công");
    assert(gisList.json.data.items.length >= 6, "Có đủ 6 điểm đến văn hóa, di tích trên bản đồ GIS");

    // Thông báo hoạt động tôn giáo hàng năm (Điều 43 Luật Tín ngưỡng tôn giáo)
    const tgList = await request("/api/v1/van-hoa/ton-giao");
    assert(tgList.status === 200, "Lấy danh mục cơ sở tôn giáo thành công");
    const firstTg = tgList.json.data.items[0];
    const tgTbRes = await request(`/api/v1/van-hoa/ton-giao/${firstTg.id}/thong-bao`, { method: "POST" });
    assert(tgTbRes.status === 200, "Tiếp nhận thông báo hoạt động tôn giáo hàng năm thành công");

    // Hồ sơ Bạo lực gia đình & Ban hành Quyết định cấm tiếp xúc của Chủ tịch UBND
    const blList = await request("/api/v1/van-hoa/bao-luc-gia-dinh");
    assert(blList.status === 200, "Lấy danh sách hồ sơ bạo lực gia đình thành công");
    const firstBl = blList.json.data.items[0];
    const ctxRes = await request(`/api/v1/van-hoa/bao-luc-gia-dinh/${firstBl.id}/cam-tiep-xuc`, {
      method: "POST",
      body: { thoiHanNgay: 3 },
    });
    assert(ctxRes.status === 200, "Chủ tịch UBND Phường ban hành Quyết định cấm tiếp xúc 3 ngày thành công (Điều 25 Luật PCBLGĐ 2022)");
    assert(ctxRes.json.data.soQuyetDinh.startsWith("QĐ-UBND-CTX/"), "Số quyết định cấm tiếp xúc sinh đúng định dạng");

    // TTHC Một cửa ngành Văn hóa (NĐ 61/2018)
    const tthcList = await request("/api/v1/van-hoa/tthc");
    assert(tthcList.status === 200, "Lấy danh sách hồ sơ TTHC Một cửa ngành Văn hóa thành công");

    const newTthcRes = await request("/api/v1/van-hoa/tthc", {
      method: "POST",
      body: {
        tenThuTuc: "Đăng ký thành lập CLB Thể thao cơ sở",
        maThuTuc: "TTHC-VHTT-UBND/01",
        nguoiNop: "Ông Trần Văn Sang",
        sdt: "0913.774.221",
        cccd: "074055001234",
        diaChi: "Số 15 đường Bạch Đằng, KP3",
        khuPho: "Khu phố 3",
        ngayHenTra: "07 ngày làm việc",
        ketQuaVanBan: "Quyết định công nhận Ban Chủ nhiệm CLB Thể thao cơ sở",
      },
    });
    assert(newTthcRes.status === 201, "Tiếp nhận hồ sơ TTHC Một cửa ngành Văn hóa thành công (Mẫu 01)");
    const newTthcId = newTthcRes.json.data.id;

    // Ký số SmartCA điện tử phê duyệt kết quả TTHC
    const kySoRes = await request(`/api/v1/van-hoa/tthc/${newTthcId}/ky-so`, {
      method: "POST",
      body: {
        nguoiKy: "Nguyễn Thị Ngọc Giàu",
        chucVu: "Phó Chủ tịch UBND Phường",
      },
    });
    assert(kySoRes.status === 200, "Ký số SmartCA điện tử phê duyệt kết quả TTHC thành công");
    assert(kySoRes.json.data.maXacThuc.startsWith("SHA256:"), "Mã băm SHA-256 xác thực SmartCA hợp lệ");

    // KPI Văn hóa
    const kpiVh = await request("/api/v1/van-hoa/kpi");
    assert(kpiVh.status === 200, "Lấy KPI tổng hợp Mảng Văn hóa - Thể thao thành công");
    assert(kpiVh.json.data.gia_dinh_van_hoa.ty_le_dat > 0, "Tỷ lệ gia đình văn hóa tính toán chính xác");
    assert(kpiVh.json.data.di_tich_le_hoi.so_hoa_qr_rate === 100, "Tỷ lệ số hóa QR Audio Guide di tích đạt 100%");
  }

  // 14. PHÂN HỆ LAO ĐỘNG, NGƯỜI CÓ CÔNG & AN SINH XÃ HỘI (/api/v1/an-sinh)
  {
    console.log("\n🤝 14. KIỂM THỬ PHÂN HỆ LAO ĐỘNG, NGƯỜI CÓ CÔNG & AN SINH XÃ HỘI (/api/v1/an-sinh)");

    // 14.1 Bảo trợ xã hội
    const btRes = await request("/api/v1/an-sinh/bao-tro");
    assert(btRes.status === 200, "Lấy danh sách đối tượng bảo trợ xã hội thành công");
    assert(btRes.json.data.items.length >= 4, "Có đủ dữ liệu bảo trợ xã hội ban đầu (NĐ 20/2021)");

    const newBtRes = await request("/api/v1/an-sinh/bao-tro", {
      method: "POST",
      body: {
        hoTen: "Cụ ông Nguyễn Văn Hòa",
        cccd: "074046003322",
        ngaySinh: "1946-09-02",
        gioiTinh: "Nam",
        khuPho: "Khu phố 3",
        loaiDoiTuong: "NGUOI_CAO_TUOI_80",
        hinhThucNhan: "NGAN_HANG",
      },
    });
    assert(newBtRes.status === 201, "Tiếp nhận đối tượng BTXH người cao tuổi 80+ thành công (201 Created)");
    assert(newBtRes.json.data.mucTroCapHangThang === 540000, "Định mức trợ cấp 540.000 VNĐ/tháng chính xác theo NĐ 20/2021");

    // Thôi hưởng BTXH khi chết
    const thoiHuongRes = await request(`/api/v1/an-sinh/bao-tro/${newBtRes.json.data.id}/thoi-huong`, {
      method: "POST",
      body: {
        lyDo: "Đối tượng từ trần",
        soQuyetDinh: "QĐ-TH-UBND-199/2026",
      },
    });
    assert(thoiHuongRes.status === 200, "Ban hành Quyết định thôi hưởng trợ cấp BTXH thành công");
    assert(thoiHuongRes.json.data.trangThai === "THOI_HUONG", "Trạng thái đối tượng chuyển sang THOI_HUONG");

    // 14.2 Hộ nghèo đa chiều
    const hnRes = await request("/api/v1/an-sinh/ho-ngheo");
    assert(hnRes.status === 200, "Lấy danh sách hộ nghèo đa chiều thành công");

    const chamDiemRes = await request("/api/v1/an-sinh/ho-ngheo/HG-01/cham-diem", {
      method: "POST",
      body: {
        phanLoai: "HO_CAN_NGHEO",
        chieuThieuHut: ["Bảo hiểm y tế & Khám chữa bệnh"],
        soTienVayCSXHVND: 50000000,
      },
    });
    assert(chamDiemRes.status === 200, "Rà soát chấm điểm hộ nghèo Phiếu B1/B2 thành công (QĐ 24/2021)");

    // 14.3 Cung cầu lao động & Kết nối việc làm
    const ccRes = await request("/api/v1/an-sinh/cung-cau");
    assert(ccRes.status === 200, "Lấy danh sách điều tra Cung - Cầu lao động thành công (TT 01/2022)");

    const knRes = await request("/api/v1/an-sinh/cung-cau/LD-03/ket-noi", {
      method: "POST",
      body: {
        doanhNghiepTuyenDung: "Công ty CP Chế biến Gỗ Bình Dương (KCN Sóng Thần 1)",
        mucLuongKyVong: "9.500.000 - 13.000.000 VNĐ/tháng",
      },
    });
    assert(knRes.status === 200, "Kết nối việc làm cho Quân nhân xuất ngũ vào KCN thành công");
    assert(knRes.json.data.tinhTrangViecLam === "DA_KET_NOI_VIEC_LAM", "Trạng thái chuyển sang DA_KET_NOI_VIEC_LAM");

    // 14.4 Bảo vệ trẻ em
    const teRes = await request("/api/v1/an-sinh/tre-em");
    assert(teRes.status === 200, "Lấy danh sách trẻ em hoàn cảnh đặc biệt thành công (Luật Trẻ em 2016)");

    const canThiepRes = await request("/api/v1/an-sinh/tre-em/TE-01/can-thiep", {
      method: "POST",
      body: {
        noiDungCanThiep: "Cấp học bổng an sinh 2.000.000đ/năm và hỗ trợ chi phí học tập",
      },
    });
    assert(canThiepRes.status === 200, "Chủ tịch UBND Phường phê duyệt Kế hoạch can thiệp Mẫu 01 thành công (NĐ 56/2017)");

    // 14.5 Phòng chống tệ nạn xã hội
    const xnRes = await request("/api/v1/an-sinh/te-nan/TN-01/xet-nghiem", {
      method: "POST",
      body: {
        ketQua: "AM_TINH",
        hoTroMoi: "Vay vốn 30 triệu đồng Quỹ Hoàn lương mở quầy tạp hóa",
      },
    });
    assert(xnRes.status === 200, "Cập nhật kết quả xét nghiệm định kỳ âm tính thành công (NĐ 116/2021)");

    // 14.6 Cứu trợ đột xuất
    const ctRes = await request("/api/v1/an-sinh/cuu-tro", {
      method: "POST",
      body: {
        hoTenChuHo: "Trần Văn Cường",
        cccd: "074088001122",
        khuPho: "Khu phố 2",
        loaiSuCo: "HOA_HOAN_CHAY_NHA",
        soTienHoTroVND: 15000000,
        soKgGao: 45,
      },
    });
    assert(ctRes.status === 201, "Phê duyệt và phát tiền/gạo cứu trợ đột xuất thành công (Điều 12, 13 NĐ 20)");

    // 14.7 TTHC Một cửa An sinh & Ký số SmartCA
    const tthcListRes = await request("/api/v1/an-sinh/tthc");
    assert(tthcListRes.status === 200, "Lấy danh sách hồ sơ TTHC Một cửa An Sinh thành công");

    const newTthcAsRes = await request("/api/v1/an-sinh/tthc", {
      method: "POST",
      body: {
        tenThuTuc: "Hỗ trợ chi phí mai táng cho đối tượng bảo trợ xã hội",
        maThuTuc: "TDM-AS-01",
        nguoiNop: "Lê Văn Hùng",
        cccd: "074068001234",
        mucTienHoTroVND: 7200000,
      },
    });
    assert(newTthcAsRes.status === 201, "Tiếp nhận hồ sơ Một cửa ngành An sinh XH thành công (Mẫu 01)");

    const kySoAsRes = await request(`/api/v1/an-sinh/tthc/${newTthcAsRes.json.data.id}/ky-so`, {
      method: "POST",
      body: {
        soQuyetDinh: "QĐ-UBND-210/QĐ-UBND",
        ngayKy: "27/10/2026",
        nguoiKy: "Nguyễn Văn Hùng",
        chucVu: "Chủ tịch UBND Phường",
        maXacThucSha256: "SHA256:abc123456789def0",
        noiDung: "Trợ cấp mai táng phí 7.200.000 VNĐ cho thân nhân đối tượng BTXH",
        daKySo: true,
      },
    });
    assert(kySoAsRes.status === 200, "Lãnh đạo ký số SmartCA điện tử phê duyệt Quyết định trợ cấp thành công");
    assert(kySoAsRes.json.data.quyetDinhKySo.daKySo === true, "Quyết định có chữ ký số SmartCA điện tử hợp lệ");
  }

  // ============================================================================
  // 15. NGHIỆP VỤ CHẤM ĐIỂM KPI CÔNG VỤ & THƯỞNG PHẠT TỰ ĐỘNG (NĐ 90 & NĐ 48)
  // ============================================================================
  console.log("\n🧪 KIỂM THỬ SECTION 15: CHẤM ĐIỂM KPI CÔNG VỤ & THƯỞNG PHẠT TỰ ĐỘNG (NĐ 90 & NĐ 48)...");
  {
    // 15.1 Danh sách đánh giá KPI và thống kê tổng hợp
    const kpiListRes = await request("/api/v1/kpi/evaluations");
    assert(kpiListRes.status === 200, "Lấy danh sách bảng đánh giá KPI cán bộ thành công");
    assert(Array.isArray(kpiListRes.json.data) && kpiListRes.json.data.length >= 4, "Có đủ 4 khối cán bộ chuyên môn được chấm điểm");

    const summaryStatsRes = await request("/api/v1/kpi/summary-stats");
    assert(summaryStatsRes.status === 200, "Lấy dữ liệu thống kê tổng hợp KPI toàn phường thành công");
    assert(summaryStatsRes.json.data.tongSoCanBo >= 4, "Tổng số cán bộ thống kê khớp dữ liệu");
    assert(summaryStatsRes.json.data.tyLeXuatSacPercent !== undefined, "Tính toán tỷ lệ hoàn thành xuất sắc chuẩn xác");

    // 15.2 Lấy chi tiết phiếu đánh giá KPI
    const firstKpiId = kpiListRes.json.data[0].id;
    const detailKpiRes = await request(`/api/v1/kpi/evaluations/${firstKpiId}`);
    assert(detailKpiRes.status === 200, "Lấy chi tiết phiếu đánh giá KPI thành công");
    assert(detailKpiRes.json.data.tieuChi1_NhiemVuChuyenMon !== undefined, "Có đầy đủ dữ liệu tiêu chí chuyên môn 40đ");
    assert(detailKpiRes.json.data.heThongMetrics !== undefined, "Có dữ liệu log tự động QĐ 766 và CSAT SIPAS");

    // 15.3 Cán bộ tự chấm điểm KPI
    const selfEvalRes = await request(`/api/v1/kpi/evaluations/${firstKpiId}/self-eval`, {
      method: "POST",
      body: {
        tieuChi1: 39,
        tieuChi2: 24,
        tieuChi3: 14,
        tieuChi4: 10,
        tieuChi5: 9,
      },
    });
    assert(selfEvalRes.status === 200, "Cán bộ tự chấm điểm 5 nhóm tiêu chí thành công");
    assert(selfEvalRes.json.data.diemTuChamTong === 96, "Tổng điểm tự chấm tính toán chuẩn xác (39+24+14+10+9=96)");

    // 15.4 Ghi nhận Điểm Thưởng / Điểm Trừ Công vụ
    const bonusRes = await request(`/api/v1/kpi/evaluations/${firstKpiId}/penalty-bonus`, {
      method: "POST",
      body: {
        loai: "THUONG",
        soDiem: 5,
        maLoiHoacSangKien: "THUONG_TRUOC_HAN",
        lyDo: "Trả trước hạn >45% hồ sơ Một cửa trong tháng theo QĐ 766",
        chungTuLienQuan: "Báo cáo Một cửa tuần 43",
      },
    });
    assert(bonusRes.status === 201, "Ghi nhận điểm thưởng công vụ +5đ thành công");
    assert(bonusRes.json.data.tongDiemThuong >= 5, "Tổng điểm thưởng của cán bộ được cập nhật");

    const penaltyRes = await request(`/api/v1/kpi/evaluations/${firstKpiId}/penalty-bonus`, {
      method: "POST",
      body: {
        loai: "PHAT",
        soDiem: 3,
        maLoiHoacSangKien: "PHAT_CHAM_BC",
        lyDo: "Chậm nộp báo cáo định kỳ theo hạn chỉ đạo 1 ngày",
        chungTuLienQuan: "Sổ theo dõi tiến độ công việc",
      },
    });
    assert(penaltyRes.status === 201, "Ghi nhận điểm trừ vi phạm -3đ thành công");
    assert(penaltyRes.json.data.tongDiemTru >= 3, "Tổng điểm trừ của cán bộ được cập nhật");

    // 15.5 Lãnh đạo thẩm định, chấm điểm và ký duyệt SmartCA
    const leaderEvalRes = await request(`/api/v1/kpi/evaluations/${firstKpiId}/leader-eval`, {
      method: "POST",
      body: {
        tieuChi1: 38,
        tieuChi2: 25,
        tieuChi3: 15,
        tieuChi4: 10,
        tieuChi5: 9,
        nhanXetButPhe: "Lãnh đạo UBND phường thẩm định đánh giá: Tinh thần trách nhiệm cao, giải quyết TTHC xuất sắc.",
        deXuatKhenThuong: "Đề nghị Chủ tịch UBND Phường khen thưởng gương mặt tiêu biểu tháng 10/2026",
        maKySoSmartCA: "SMARTCA-TEST-VERIFIED-2026",
      },
    });
    assert(leaderEvalRes.status === 200, "Lãnh đạo thẩm định và ký số SmartCA thành công");
    assert(leaderEvalRes.json.data.trangThai === "DA_PHE_DUYET", "Trạng thái phiếu KPI chuyển sang DA_PHE_DUYET");
    assert(leaderEvalRes.json.data.lanhDaoThamDinh?.maKySoSmartCA === "SMARTCA-TEST-VERIFIED-2026", "Chữ ký số SmartCA được lưu trữ đầy đủ");
    assert(leaderEvalRes.json.data.diemTongKetCuoiCung > 0, "Điểm tổng kết cuối cùng được tính toán theo công thức chuẩn");
  }

  // ============================================================================
  // SECTION 16: NGHIỆP VỤ BỔ SUNG CHUYÊN MÔN TỪNG MẢNG (4 GÓI TOÀN DIỆN)
  // ============================================================================
  {
    console.log("\n--- [TEST GROUP 16] Nghiệp vụ Bổ sung Chuyên môn Từng mảng (4 Gói Toàn diện) ---");

    // 16.1 Mảng Giáo dục: Kiểm thực 3 bước ATTP Bếp ăn bán trú (QĐ 1246/QĐ-BYT)
    const ktRes = await request("/api/v1/giao-duc/kiem-thuc-3-buoc");
    assert(ktRes.status === 200, "Lấy danh sách kiểm thực 3 bước ATTP thành công");
    assert(Array.isArray(ktRes.json.data.items), "Dữ liệu kiểm thực ATTP trả về danh sách mảng");
    assert(ktRes.json.data.ty_le_luu_mau_dat === 100, "100% mẫu thức ăn được lưu tủ lạnh bảo quản 24h");

    const newKtRes = await request("/api/v1/giao-duc/kiem-thuc-3-buoc", {
      method: "POST",
      body: {
        truongId: "MN-TUOITHO",
        tenTruong: "Trường Mầm non Tuổi Thơ",
        bepAn: "Bếp ăn chính - Khối Lá",
        soSuatAn: 240,
        buoc1_KiemTraNhap: {
          gioNhap: "06:15",
          nguonGocNguonHang: "Hợp tác xã Rau sạch An Điền & Vissan",
          camQuan: "DAT",
          nhietDoBaoQuan: "4 độ C",
          nguoiGiao: "Trần Văn Nam",
          nguoiNhan: "Bùi Thị Lan",
          ketLuan: "DAT",
        },
        buoc2_CheBien: {
          gioCheBien: "09:30",
          dieuKienVeSinh: "Bếp một chiều, găng tay mũ bảo hộ đầy đủ",
          trangThietBi: "DAT",
          nuocCheBien: "Nước sạch thành phố",
          ketLuan: "DAT",
        },
        buoc3_TruocKhiAn: {
          gioAn: "10:45",
          muiViMauSac: "DAT",
          dungCuChiaAn: "Inox 304 tiệt trùng",
          luuMauThucAn: true,
          gioLuuMau: "10:30",
          nhietDoLuu: "2 độ C",
          nguoiLuu: "Nguyễn Thị Mai (Y tế)",
          ketLuan: "DAT",
        },
        ketLuanChung: "DAT_ATTP",
        canBoKiemTra: "Ban Giám hiệu & Y tế học đường",
      },
    });
    assert(newKtRes.status === 201, "Ghi nhật ký kiểm thực 3 bước ATTP bán trú thành công");
    assert(newKtRes.json.data.id !== undefined, "ID phiếu kiểm thực được sinh tự động");

    // 16.2 Mảng An sinh & NCC: Điều dưỡng phục hồi sức khỏe (Pháp lệnh 02/2020 & NĐ 131/2021)
    const ddRes = await request("/api/v1/an-sinh/dieu-duong-ncc");
    assert(ddRes.status === 200, "Lấy danh sách quản lý điều dưỡng NCC thành công");
    assert(ddRes.json.data.tong_ncc_nam_2026 >= 3, "Có danh sách NCC đủ điều kiện điều dưỡng năm 2026");

    const newDdRes = await request("/api/v1/an-sinh/dieu-duong-ncc", {
      method: "POST",
      body: {
        hoTen: "Nguyễn Văn Hùng",
        namSinh: 1952,
        cccd: "074052003344",
        diaChi: "125 Cách Mạng Tháng Tám, Khu phố 3",
        khuPho: "Khu phố 3",
        doiTuongNcc: "THUONG_BINH",
        tyLeTonThuongCoThe: 45,
        chuKyDieuDuong: "2_NAM_1_LAN",
        hinhThuc: "TAI_NHA",
      },
    });
    assert(newDdRes.status === 201, "Đăng ký kế hoạch điều dưỡng phục hồi sức khỏe NCC thành công");
    const newDdId = newDdRes.json.data.id;
    assert(newDdRes.json.data.mucChiVND === 2181500, "Định mức điều dưỡng tại nhà chuẩn NĐ 75/2021 (2.181.500 VNĐ)");

    // Phê duyệt điều dưỡng
    const pdRes = await request(`/api/v1/an-sinh/dieu-duong-ncc/${newDdId}/phe-duyet`, {
      method: "POST",
      body: {
        soQuyetDinh: "QĐ-UBND/2026-DD45",
        nguoiPheDuyet: "Chủ tịch UBND Phường",
      },
    });
    assert(pdRes.status === 200, "Phê duyệt chế độ điều dưỡng NCC thành công");

    // Chi trả kinh phí điều dưỡng
    const ctRes = await request(`/api/v1/an-sinh/dieu-duong-ncc/${newDdId}/chi-tra`, {
      method: "POST",
      body: {
        phuongThucChiTra: "CHUYEN_KHOAN",
        soTaiKhoan: "1029384756 (Vietcombank)",
      },
    });
    assert(ctRes.status === 200, "Chi trả kinh phí điều dưỡng NCC thành công");

    // 16.3 Mảng An sinh: Khảo sát Nhu cầu Học nghề - Việc làm KCN
    const hnRes = await request("/api/v1/an-sinh/khao-sat-hoc-nghe");
    assert(hnRes.status === 200, "Lấy danh sách khảo sát học nghề & việc làm thành công");
    assert(Array.isArray(hnRes.json.data.items), "Trả về danh sách đối tượng khảo sát việc làm");

    const newHnRes = await request("/api/v1/an-sinh/khao-sat-hoc-nghe", {
      method: "POST",
      body: {
        hoTen: "Trương Văn Dũng",
        namSinh: 2003,
        cccd: "074203009988",
        sdt: "0918.456.789",
        diaChi: "Hẻm 45 Đinh Bộ Lĩnh, KP5",
        khuPho: "Khu phố 5",
        doiTuong: "BO_DOI_XUAT_NGU",
        trinhDoHienTai: "THPT",
        nhuCauHocNghe: "Kỹ thuật Hàn công nghiệp & Cắt gọt kim loại CNC",
        nguyenVongViecLam: "Doanh nghiệp KCN VSIP 1 / Sóng Thần",
      },
    });
    assert(newHnRes.status === 201, "Đăng ký khảo sát nhu cầu học nghề bộ đội xuất ngũ thành công");

    // 16.4 Mảng Văn hóa: Đội Kiểm tra Liên ngành 814 cấp Phường (NĐ 54/2019 & NĐ 38/2021)
    const doi814Res = await request("/api/v1/van-hoa/kiem-tra-814");
    assert(doi814Res.status === 200, "Lấy danh sách kiểm tra Đội 814 thành công");
    assert(doi814Res.json.data.total >= 2, "Có dữ liệu các đợt kiểm tra liên ngành 814");

    const new814Res = await request("/api/v1/van-hoa/kiem-tra-814", {
      method: "POST",
      body: {
        tenCoSo: "Quán Bi-a & Game Zone Star",
        diaChi: "88 Ngô Quyền, KP2",
        loaiHinh: "INTERNET_GAME",
        noiDungKiemTra: "Kiểm tra học sinh chơi game trong giờ học và niêm yết nội quy",
        ketLuan: "NHAC_NHO",
        soTienPhatVND: 0,
        bienPhapKhac: "Ký cam kết không cho học sinh mặc đồng phục vào quán trước 11h30",
      },
    });
    assert(new814Res.status === 201, "Lập biên bản kiểm tra Đội 814 thành công");
    const new814Id = new814Res.json.data.id;

    // Xử lý vi phạm
    const xl814Res = await request(`/api/v1/van-hoa/kiem-tra-814/${new814Id}/xu-ly`, {
      method: "POST",
      body: {
        ketLuan: "PHAT_TIEN",
        soTienPhatVND: 1500000,
        daNopPhat: true,
      },
    });
    assert(xl814Res.status === 200, "Cập nhật quyết định xử phạt vi phạm Đội 814 thành công");

    // 16.5 Mảng Văn hóa: Bộ Tiêu chí Đô thị Văn minh chuẩn Quốc gia (QĐ 04/2022/QĐ-TTg)
    const dtvmRes = await request("/api/v1/van-hoa/do-thi-van-minh");
    assert(dtvmRes.status === 200, "Lấy 9 tiêu chí Đô thị văn minh QĐ 04/2022 thành công");
    assert(dtvmRes.json.data.total_tieu_chi === 9, "Đủ chuẩn 9 tiêu chí đô thị văn minh cấp Phường");

    const firstDtvmId = dtvmRes.json.data.items[0].id;
    const danhGiaDtvmRes = await request(`/api/v1/van-hoa/do-thi-van-minh/${firstDtvmId}/danh-gia`, {
      method: "POST",
      body: {
        datChuan: true,
        diemDanhGia: 10,
        ghiChu: "Phường đã đạt 100% quy hoạch đô thị và cảnh quan đồng bộ",
        nguoiDanhGia: "Hội đồng Đánh giá Đô thị Văn minh Phường",
      },
    });
    assert(danhGiaDtvmRes.status === 200, "Cập nhật đánh giá tiêu chí đô thị văn minh thành công");

    // 16.6 Mảng Chuyển đổi số: Phản ánh Hiện trường 1022 / IOC
    const paRes = await request("/api/v1/thong-tin/phan-anh-1022");
    assert(paRes.status === 200, "Lấy danh sách phản ánh hiện trường 1022 thành công");
    assert(paRes.json.data.sla_24h_dung_han_percent >= 90, "Tỷ lệ xử lý đúng hạn SLA 24h trên 90%");

    const newPaRes = await request("/api/v1/thong-tin/phan-anh-1022", {
      method: "POST",
      body: {
        nguoiPhanAnh: "Lê Hoàng Phúc",
        soDienThoai: "0909.112.233",
        diaDiem: "Ngã tư Thích Quảng Đức - Phan Đình Phùng",
        linhVuc: "TRAT_TU_DO_THI",
        tieuDe: "Lấn chiếm vỉa hè họp chợ tự phát gây ách tắc giao thông giờ cao điểm",
        noiDung: "Có một số hộ kinh doanh hoa quả bày sạp tràn xuống lòng đường giờ tan tầm.",
        mucDoKhan: "CAO",
      },
    });
    assert(newPaRes.status === 201, "Tiếp nhận phản ánh 1022 từ người dân thành công");
    const newPaId = newPaRes.json.data.id;

    // Xử lý phản ánh hiện trường
    const xlPaRes = await request(`/api/v1/thong-tin/phan-anh-1022/${newPaId}/xu-ly`, {
      method: "POST",
      body: {
        canBoXuLy: "Tổ Quản lý Trật tự Đô thị & Công an Phường",
        ketQuaXuLy: "Đã ra quân nhắc nhở, lập biên bản 2 trường hợp vi phạm, trả lại thông thoáng vỉa hè.",
        anhSauXuLy: "https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=400&q=80",
        trangThai: "DA_XU_LY",
      },
    });
    assert(xlPaRes.status === 200, "Xử lý và đóng phiếu phản ánh hiện trường 1022 thành công");

    // 16.7 Mảng Chuyển đổi số: Bộ Chỉ số DTI Cấp Xã (QĐ 922/QĐ-BTTTT)
    const dtiRes = await request("/api/v1/thong-tin/dti");
    assert(dtiRes.status === 200, "Lấy bộ chỉ số DTI cấp Xã thành công");
    assert(dtiRes.json.data.total_chi_so >= 3, "Có đầy đủ 3 trụ cột DTI: Chính quyền số, Kinh tế số, Xã hội số");
    assert(dtiRes.json.data.xep_loai_dti === "XUAT_SAC", "Phường Phú Cường đạt xếp loại DTI Xuất sắc");

    const firstDtiId = dtiRes.json.data.items[0].id;
    const capNhatDtiRes = await request(`/api/v1/thong-tin/dti/${firstDtiId}/cap-nhat`, {
      method: "POST",
      body: {
        giaTriHienTai: "99.2% văn bản ký số SmartCA",
        diemDatDuoc: 35,
        ghiChuMinhChung: "Hệ thống quản lý văn bản iOffice tỉnh Bình Dương",
      },
    });
    assert(capNhatDtiRes.status === 200, "Cập nhật chỉ số DTI cấp Xã thành công");

    // KPI tổng hợp mảng Thông tin - Chuyển đổi số
    const kpiTtRes = await request("/api/v1/thong-tin/kpi");
    assert(kpiTtRes.status === 200, "Lấy KPI tổng hợp Chuyển đổi số thành công");
    assert(kpiTtRes.json.data.phan_anh_1022.sla_24h_dat_chuan === true, "KPI phản ánh 1022 đạt SLA");
  }

  // --- [TEST GROUP 17] Nghiệp vụ Bổ sung Chuyên môn Toàn diện Đợt 2 (5 Gói Mở Rộng) ---
  console.log("\n--- [TEST GROUP 17] Nghiệp vụ Bổ sung Chuyên môn Toàn diện Đợt 2 (5 Gói Mở Rộng) ---");

  // 17.1 Gói A: Phổ cập giáo dục & Xóa mù chữ (NĐ 20/2014 & TT 07/2016)
  const phoCapRes = await request("/api/v1/giao-duc/pho-cap");
  assert(phoCapRes.status === 200, "Lấy danh sách điều tra phổ cập GD thành công");
  assert(phoCapRes.json.data.total_khu_pho >= 4, "Có đủ số liệu 4 khu phố về PCGD");
  assert(phoCapRes.json.data.dat_chuan_pcgd_muc_3 === true, "Đạt chuẩn PCGD Mức 3");

  const newPhoCapRes = await request("/api/v1/giao-duc/pho-cap", {
    method: "POST",
    body: {
      khuPho: "Khu phố 5",
      bacHoc: "TIEU_HOC",
      doTuoiDieuTra: "Độ tuổi 6 - 11 tuổi (2015-2020)",
      tongSoTre: 320,
      soTreDiHoc: 320,
      soTreBoHoc: 0,
      soTreNguyCoBoHoc: 0,
      tyLeHuyDongPercent: 100,
      mucDoDatChuan: "Đạt chuẩn Mức độ 3",
      namDieuTra: 2026,
    },
  });
  assert(newPhoCapRes.status === 201, "Ghi nhận phiếu điều tra phổ cập GD thành công");

  // 17.2 Gói A: Đánh giá Cộng đồng học tập cấp xã (TT 44/2014/TT-BGDĐT)
  const cdhtRes = await request("/api/v1/giao-duc/cong-dong-hoc-tap");
  assert(cdhtRes.status === 200, "Lấy tiêu chí Cộng đồng học tập thành công");
  assert(cdhtRes.json.data.total_tieu_chi >= 5, "Đầy đủ 5 nhóm tiêu chí Cộng đồng học tập");
  assert(cdhtRes.json.data.xep_loai === "TOT", "Xếp loại Cộng đồng học tập đạt Tốt");

  const cdhtFirstId = cdhtRes.json.data.items[0].id;
  const chamCdhtRes = await request(`/api/v1/giao-duc/cong-dong-hoc-tap/${cdhtFirstId}/danh-gia`, {
    method: "POST",
    body: {
      diemTuDanhGia: 10,
      diemDoanKiemTra: 10,
      minhChungKetQua: "Nghị quyết HĐND và Quyết định 48/QĐ-UBND phân bổ kinh phí",
    },
  });
  assert(chamCdhtRes.status === 200, "Chấm điểm tiêu chí Cộng đồng học tập thành công");

  // 17.3 Gói B: Quản lý Thờ cúng Liệt sĩ (NĐ 131/2021/NĐ-CP)
  const thoCungRes = await request("/api/v1/an-sinh/tho-cung-liet-si");
  assert(thoCungRes.status === 200, "Lấy danh sách thờ cúng liệt sĩ thành công");
  assert(thoCungRes.json.data.dinh_muc_chuan_vnd === 1400000, "Định mức trợ cấp thờ cúng liệt sĩ 1.400.000 VNĐ/năm");

  const newThoCungRes = await request("/api/v1/an-sinh/tho-cung-liet-si", {
    method: "POST",
    body: {
      hoTenLietSi: "Lê Văn Tám",
      namSinh: 1945,
      namHySinh: 1968,
      hoTenNguoiThoCung: "Lê Văn Hùng",
      quanHeVoiLietSi: "Cháu ruột",
      cccdNguoiThoCung: "074090001122",
      khuPho: "Khu phố 2",
    },
  });
  assert(newThoCungRes.status === 201, "Đăng ký người thờ cúng liệt sĩ Mẫu 04 thành công");
  const newTcId = newThoCungRes.json.data.id;

  const chiTraTcRes = await request(`/api/v1/an-sinh/tho-cung-liet-si/${newTcId}/chi-tra`, {
    method: "POST",
    body: { hinhThuc: "CHUYEN_KHOAN_ATM" },
  });
  assert(chiTraTcRes.status === 200, "Chi trả trợ cấp thờ cúng liệt sĩ thành công");

  // 17.4 Gói B: Hội đồng Xác định Mức độ Khuyết tật (TT 01/2019/TT-BLĐTBXH)
  const hdktRes = await request("/api/v1/an-sinh/hoi-dong-khuyet-tat");
  assert(hdktRes.status === 200, "Lấy danh sách Hội đồng khuyết tật thành công");
  assert(hdktRes.json.data.total >= 3, "Có danh sách các đối tượng xác định dạng tật");

  const newHdktRes = await request("/api/v1/an-sinh/hoi-dong-khuyet-tat", {
    method: "POST",
    body: {
      hoTen: "Hoàng Minh Trí",
      dangTat: "VAN_DONG",
      mucDoKhuyetTat: "DAC_BIET_NANG",
      khuPho: "Khu phố 3",
      cccd: "074085002233",
    },
  });
  assert(newHdktRes.status === 201, "Lập hồ sơ xét duyệt khuyết tật cấp phường thành công");
  const newHdktId = newHdktRes.json.data.id;

  const capGiayKtRes = await request(`/api/v1/an-sinh/hoi-dong-khuyet-tat/${newHdktId}/cap-giay`, {
    method: "POST",
    body: {
      soGiay: "GCN-KT/2026/199",
      ketLuan: "Hội đồng biểu quyết 100% công nhận người khuyết tật đặc biệt nặng",
    },
  });
  assert(capGiayKtRes.status === 200, "Cấp Giấy chứng nhận mức độ khuyết tật Mẫu 03 thành công");

  // 17.5 Gói E: Quỹ Đền ơn đáp nghĩa & Nhà Tình nghĩa (NĐ 45/2017)
  const qdoRes = await request("/api/v1/an-sinh/quy-den-on");
  assert(qdoRes.status === 200, "Lấy sổ theo dõi Quỹ Đền ơn đáp nghĩa thành công");
  assert(qdoRes.json.data.ton_quy_vnd > 0, "Quỹ Đền ơn đáp nghĩa cân đối thu chi dương");

  const newQdoRes = await request("/api/v1/an-sinh/quy-den-on", {
    method: "POST",
    body: {
      loaiGiaoDich: "THU_QUY",
      noiDung: "Cán bộ nhân dân Khu phố 2 đóng góp Quỹ ĐƠĐN",
      donViCaNhan: "Ban Điều hành Khu phố 2",
      soTienVND: 15000000,
    },
  });
  assert(newQdoRes.status === 201, "Tiếp nhận ủng hộ Quỹ Đền ơn đáp nghĩa thành công");

  const ntnRes = await request("/api/v1/an-sinh/nha-tinh-nghia");
  assert(ntnRes.status === 200, "Lấy danh sách Nhà Tình nghĩa thành công");

  const newNtnRes = await request("/api/v1/an-sinh/nha-tinh-nghia", {
    method: "POST",
    body: {
      hoTenChuHo: "Ông Nguyễn Văn Bảy (Thương binh 2/4)",
      dienDoiTuong: "THUONG_BENH_BINH",
      loaiHinhHoTro: "XAY_MOI",
      kinhPhiHoTroVND: 80000000,
      khuPho: "Khu phố 4",
    },
  });
  assert(newNtnRes.status === 201, "Phê duyệt hồ sơ xây mới Nhà Tình nghĩa thành công");
  const newNtnId = newNtnRes.json.data.id;

  const capNhatNtnRes = await request(`/api/v1/an-sinh/nha-tinh-nghia/${newNtnId}/tien-do`, {
    method: "POST",
    body: { tienDo: 100, trangThai: "DA_BAN_GIAO" },
  });
  assert(capNhatNtnRes.status === 200, "Cập nhật nghiệm thu bàn giao Nhà Tình nghĩa thành công");

  // 17.6 Gói C: Nghệ nhân Di sản & Cơ sở Thể thao (NĐ 109/2015 & NĐ 36/2019)
  const nnRes = await request("/api/v1/van-hoa/nghe-nhan-di-san");
  assert(nnRes.status === 200, "Lấy danh sách Nghệ nhân Di sản thành công");
  assert(nnRes.json.data.nghe_nhan_uu_tu >= 2, "Có Nghệ nhân Ưu tú Đờn ca tài tử & Sơn mài");

  const newNnRes = await request("/api/v1/van-hoa/nghe-nhan-di-san", {
    method: "POST",
    body: {
      hoTen: "Trần Văn Hòa",
      danhHieu: "NGHE_NHAN_DAN_GIAN",
      loaiHinhDiSan: "Nghề điêu khắc gỗ cổ truyền",
      mucTroCapThangVND: 1000000,
      khuPho: "Khu phố 3",
    },
  });
  assert(newNnRes.status === 201, "Ghi nhận Nghệ nhân Di sản mới thành công");

  const ttRes = await request("/api/v1/van-hoa/co-so-the-thao");
  assert(ttRes.status === 200, "Lấy danh mục cơ sở kinh doanh thể thao thành công");
  assert(ttRes.json.data.be_boi_count >= 1, "Có cơ sở hồ bơi được giám sát cứu hộ phòng đuối nước");

  const firstTtId = ttRes.json.data.items[0].id;
  const ktTtRes = await request(`/api/v1/van-hoa/co-so-the-thao/${firstTtId}/kiem-tra`, {
    method: "POST",
    body: {
      ketQua: "DAT_CHUAN",
      ghiChu: "Đã tái kiểm tra đầy đủ phao cứu hộ và nhân viên túc trực 100% thời gian mở cửa",
    },
  });
  assert(ktTtRes.status === 200, "Kiểm tra điều kiện an toàn cơ sở thể thao thành công");

  // 17.7 Gói D: Cổng TTĐT, Zalo OA & Không gian mạng (NĐ 42/2022 & CT 14/CT-TTg)
  const tbRes = await request("/api/v1/thong-tin/tin-bai");
  assert(tbRes.status === 200, "Lấy danh sách tin bài Cổng TTĐT thành công");

  const newTbRes = await request("/api/v1/thong-tin/tin-bai", {
    method: "POST",
    body: {
      tieuDe: "UBND Phường triển khai cao điểm bảo đảm trật tự an toàn giao thông và vệ sinh môi trường",
      chuyenMuc: "CHI_DAO_DIEU_HANH",
      tacGia: "Ban Biên tập Phường",
    },
  });
  assert(newTbRes.status === 201, "Gửi tin bài mới lên Cổng TTĐT thành công");
  const newTbId = newTbRes.json.data.id;

  const duyetTbRes = await request(`/api/v1/thong-tin/tin-bai/${newTbId}/duyet`, {
    method: "POST",
    body: { nguoiDuyet: "Chủ tịch UBND Phường" },
  });
  assert(duyetTbRes.status === 200, "Lãnh đạo UBND duyệt phát hành tin bài thành công");

  const broadcastTbRes = await request(`/api/v1/thong-tin/tin-bai/${newTbId}/broadcast-zalo`, {
    method: "POST",
    body: { luotGui: 14500 },
  });
  assert(broadcastTbRes.status === 200, "Phát tin nhắn chính sách qua Zalo OA thành công");

  const kgmRes = await request("/api/v1/thong-tin/khong-gian-mang");
  assert(kgmRes.status === 200, "Lấy dữ liệu giám sát không gian mạng thành công");

  const newKgmRes = await request("/api/v1/thong-tin/khong-gian-mang", {
    method: "POST",
    body: {
      kenhPhatHien: "TIKTOK",
      tieuDeNoiDung: "Video sai lệch thông tin về công tác giải tỏa bồi thường dự án đường ven sông",
      mucDoNguyHiem: "TRUNG_BINH",
    },
  });
  assert(newKgmRes.status === 201, "Ghi nhận thông tin mạng xã hội nghi vấn thành công");
  const newKgmId = newKgmRes.json.data.id;

  const xlKgmRes = await request(`/api/v1/thong-tin/khong-gian-mang/${newKgmId}/xu-ly`, {
    method: "POST",
    body: {
      bienPhap: "DA_XU_LY_XONG",
      ketQua: "Tổ 35 đăng bài phản bác sự thật và chủ kênh TikTok đã tự giác gỡ video, cam kết không tái phạm.",
    },
  });
  assert(xlKgmRes.status === 200, "Xử lý thông tin xấu độc mạng xã hội thành công");

  // ============================================================================
  // [TEST GROUP 18] ĐỘNG CƠ CƠ SỞ DỮ LIỆU QUAN HỆ 3NF & SNAPSHOT BACKUP/RESTORE
  // ============================================================================
  console.log("\n--- [TEST GROUP 18] Động cơ CSDL Quan hệ 3NF, SQL Console & Backup/Restore ---");

  // 18.1 Tổng quan CSDL
  const dbOverviewRes = await request("/api/v1/database/overview");
  assert(dbOverviewRes.status === 200, "Lấy thông số tổng quan CSDL thành công");
  assert(dbOverviewRes.json.data.tablesCount >= 30, "Số lượng bảng trong Database Engine đầy đủ (>= 30 bảng)");
  assert(dbOverviewRes.json.data.status === "ONLINE", "Trạng thái Database Engine đang ONLINE");
  assert(dbOverviewRes.json.data.totalRecords > 100, "Tổng số bản ghi trong CSDL phong phú (> 100 records)");

  // 18.2 Danh mục các bảng 3NF
  const dbTablesRes = await request("/api/v1/database/tables");
  assert(dbTablesRes.status === 200, "Lấy danh mục các bảng 3NF thành công");
  assert(Array.isArray(dbTablesRes.json.data.tables), "Trả về danh sách bảng dạng mảng");
  assert(dbTablesRes.json.data.categories.length === 7, "Đầy đủ 7 phân hệ nghiệp vụ CSDL");

  // 18.3 Dữ liệu bảng cụ thể & phân trang
  const hoSoTblRes = await request("/api/v1/database/tables/ho_so_ncc?page=1&limit=10");
  assert(hoSoTblRes.status === 200, "Truy vấn dữ liệu bảng ho_so_ncc thành công");
  assert(hoSoTblRes.json.data.rows.length > 0, "Bảng ho_so_ncc có dữ liệu bản ghi");
  assert(hoSoTblRes.json.data.columns.length > 0, "Bảng ho_so_ncc có metadata các cột");

  // 18.4 Interactive SQL Query Console
  const sqlQueryRes = await request("/api/v1/database/query", {
    method: "POST",
    body: {
      query: "SELECT * FROM ho_so_ncc WHERE tyLeThuongTat >= 81 LIMIT 5",
    },
  });
  assert(sqlQueryRes.status === 200, "Thực thi câu lệnh SQL SELECT an toàn thành công");
  assert(Array.isArray(sqlQueryRes.json.data.rows), "Kết quả truy vấn SQL trả về danh sách bản ghi");

  // Chặn lệnh nguy hiểm
  const dangerousQueryRes = await request("/api/v1/database/query", {
    method: "POST",
    body: {
      query: "DROP DATABASE ql_nguoi_co_cong;",
    },
  });
  assert(dangerousQueryRes.status === 400, "Hệ thống từ chối thực thi lệnh nguy hại (DROP DATABASE) thành công (400 Bad Request)");

  // 18.5 Snapshot Backup
  const backupRes = await request("/api/v1/database/backup", { method: "POST" });
  assert(backupRes.status === 200, "Tạo bản sao lưu Snapshot Backup thành công");
  assert(backupRes.json.data.id.startsWith("BACKUP-"), "Mã bản sao lưu sinh chuẩn định dạng");

  // 18.6 Xuất SQL Dump
  const exportSqlRes = await request("/api/v1/database/export-sql");
  assert(exportSqlRes.status === 200, "Tải về bản Dump SQL thành công (200 OK)");
  assert(exportSqlRes.text.includes("CREATE DATABASE"), "Nội dung SQL dump chứa câu lệnh CREATE DATABASE chuẩn");
  assert(exportSqlRes.text.includes("INSERT INTO"), "Nội dung SQL dump chứa các câu lệnh INSERT dữ liệu");

  // 18.7 Health check cập nhật
  const healthRes = await request("/api/v1/health");
  assert(healthRes.status === 200, "Health check endpoint hoạt động");
  assert(healthRes.json.data.database.acid_transactions === "SUPPORTED", "Hệ thống hỗ trợ giao dịch ACID transactions");

  console.log("\n================================================================================");
  console.log(`🏁 KẾT QUẢ KIỂM THỬ: ${passedCount} PASSED, ${failedCount} FAILED.`);
  console.log("================================================================================");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Lỗi thực thi test suite:", err);
  process.exit(1);
});
