import puppeteer from "puppeteer-core";
import path from "node:path";
import fs from "node:fs";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUTPUT_DIR = path.resolve("docs/screenshots/giao_duc");
const BASE_URL = "http://localhost:8081";

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Helper click theo text content cực kỳ tin cậy
async function clickBtn(page, text) {
  const clicked = await page.evaluate((t) => {
    const btns = Array.from(document.querySelectorAll("button"));
    const btn = btns.find((b) => b.innerText && b.innerText.includes(t));
    if (btn) {
      btn.scrollIntoView({ block: "center" });
      btn.click();
      return true;
    }
    return false;
  }, text);
  return clicked;
}

// Helper đóng modal
async function closeModal(page) {
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    // Ưu tiên nút có chữ Đóng hoặc Hủy
    const closeBtn = btns.find(
      (b) =>
        b.innerText &&
        (b.innerText.trim() === "Đóng" ||
          b.innerText.trim() === "Hủy" ||
          b.innerText.trim() === "Hủy tiếp nhận")
    );
    if (closeBtn) {
      closeBtn.click();
      return true;
    }
    // Nếu không thấy, tìm nút có svg dấu X
    const xBtn = btns.find((b) => b.querySelector("svg.lucide-x") || b.innerHTML.includes("lucide-x"));
    if (xBtn) {
      xBtn.click();
      return true;
    }
    return false;
  });
  await sleep(600);
}

async function run() {
  console.log("=== BẮT ĐẦU KIỂM THỬ VÀ CHỤP TOÀN BỘ 23 GIAO DIỆN & VĂN BẢN HÀNH CHÍNH ===");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--window-size=1440,960",
    ],
    defaultViewport: { width: 1440, height: 960, deviceScaleFactor: 2 },
  });

  const page = await browser.newPage();

  async function take(filename, description) {
    const dest = path.join(OUTPUT_DIR, filename);
    await page.screenshot({ path: dest });
    console.log(`[OK] Đã chụp: ${filename} - ${description}`);
  }

  // 1. Đăng nhập hệ thống
  console.log("\n1. Đăng nhập hệ thống...");
  await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle2" });
  await sleep(1000);
  await clickBtn(page, "ADMIN CẤP SỞ");
  await sleep(400);
  await clickBtn(page, "1-Click Đăng nhập ngay");
  await page.waitForNavigation({ waitUntil: "networkidle2" }).catch(() => {});
  await sleep(1500);

  // 2. Chuyển đến trang Giáo dục & Đào tạo
  console.log("\n2. Truy cập /giao-duc-dao-tao...");
  await page.goto(`${BASE_URL}/giao-duc-dao-tao`, { waitUntil: "networkidle2" });
  await sleep(1500);

  // ==========================================
  // TAB 4: MỘT CỬA TTHC GIÁO DỤC (Active mặc định)
  // ==========================================
  console.log("\n--- KIỂM THỬ TAB 4: MỘT CỬA TTHC GIÁO DỤC ---");
  await take("01_tab4_tthc_mot_cua_tong_quan.png", "Tab 4: Một cửa TTHC Giáo dục - Banner SLA & Danh sách hồ sơ");

  // Modal 1: Tiếp nhận hồ sơ mới
  console.log("Mở Modal Tiếp nhận hồ sơ mới...");
  if (await clickBtn(page, "Tiếp nhận Hồ sơ TTHC Mới")) {
    await sleep(1000);
    await take("02_modal_tiep_nhan_ho_so_moi.png", "Modal 1: Tiếp nhận hồ sơ TTHC Giáo dục mới & Checklist thành phần");
    await closeModal(page);
  }

  // Modal 8: Giấy tiếp nhận hồ sơ và hẹn trả (Mẫu số 01/NĐ-61)
  console.log("Mở Modal Giấy tiếp nhận Mẫu 01...");
  if (await clickBtn(page, "Giấy hẹn (Mẫu 01)")) {
    await sleep(1000);
    await take("03_modal_giay_tiep_nhan_mau01.png", "Modal 8: Giấy tiếp nhận hồ sơ và hẹn trả kết quả (Mẫu 01/NĐ-61)");
    await closeModal(page);
  }

  // Modal 9: Phiếu yêu cầu bổ sung hồ sơ (Mẫu số 02/NĐ-61)
  console.log("Mở Modal Phiếu bổ sung Mẫu 02...");
  if (await clickBtn(page, "Phiếu bổ sung (Mẫu 02)")) {
    await sleep(1000);
    await take("04_modal_phieu_yeu_cau_bo_sung_mau02.png", "Modal 9: Phiếu yêu cầu bổ sung hồ sơ (Mẫu 02/NĐ-61)");
    await closeModal(page);
  }

  // Modal 10: Biên bản kiểm tra thẩm định thực địa liên ngành
  console.log("Mở Modal Biên bản thẩm định thực địa...");
  if (await clickBtn(page, "Biên bản thực địa")) {
    await sleep(1000);
    await take("05_modal_bien_ban_tham_dinh_thuc_dia.png", "Modal 10: Biên bản kiểm tra thẩm định thực địa liên ngành");
    await closeModal(page);
  }

  // Modal 11: Tờ trình đề nghị ban hành Quyết định
  console.log("Mở Modal Tờ trình đề nghị phê duyệt...");
  if (await clickBtn(page, "Tờ trình UBND")) {
    await sleep(1000);
    await take("06_modal_to_trinh_de_nghi_phe_duyet.png", "Modal 11: Tờ trình đề nghị ban hành Quyết định thành lập");
    await closeModal(page);
  }

  // Modal 12: Quyết định thành lập có ký số SmartCA
  console.log("Mở Modal Quyết định phê duyệt ký số...");
  if (await clickBtn(page, "Xem QĐ đã Ký số") || await clickBtn(page, "Ký số Quyết định")) {
    await sleep(1000);
    await take("07_modal_quyet_dinh_ky_so_smartca.png", "Modal 12: Quyết định cho phép thành lập có ký số SmartCA & Mộc đỏ");
    await closeModal(page);
  }

  // Modal 13: Phiếu kiểm soát luân chuyển (Mẫu 05/NĐ-61)
  console.log("Mở Modal Phiếu kiểm soát Mẫu 05...");
  if (await clickBtn(page, "Kiểm soát (Mẫu 05)")) {
    await sleep(1000);
    await take("08_modal_phieu_kiem_soat_luan_chuyen_mau05.png", "Modal 13: Phiếu kiểm soát luân chuyển hồ sơ (Mẫu 05/NĐ-61)");
    await closeModal(page);
  }

  // Modal 20: Phiếu xin lỗi và hẹn lại ngày trả kết quả (Mẫu số 04/NĐ-61)
  console.log("Mở Modal Phiếu xin lỗi Mẫu 04...");
  if (await clickBtn(page, "Phiếu xin lỗi (Mẫu 04)") || await clickBtn(page, "Lập Phiếu xin lỗi (Mẫu 04)") || await clickBtn(page, "Xem Mẫu 04")) {
    await sleep(1000);
    await take("09_modal_phieu_xin_loi_mau04.png", "Modal 20: Phiếu xin lỗi và hẹn lại ngày trả kết quả (Mẫu 04/NĐ-61)");
    await closeModal(page);
  }

  // ==========================================
  // TAB 1: MẦM NON NGOÀI CÔNG LẬP
  // ==========================================
  console.log("\n--- KIỂM THỬ TAB 1: MẦM NON NGOÀI CÔNG LẬP ---");
  await clickBtn(page, "1. Quản lý Mầm non ngoài công lập");
  await sleep(1000);
  await take("10_tab1_mam_non_tu_thuc_tong_quan.png", "Tab 1: Sổ quản lý cơ sở mầm non ngoài công lập & Định mức an toàn");

  // Modal 16: Báo cáo 32/BC-UBND
  console.log("Mở Báo cáo số 32/BC-UBND gửi Phòng GD&ĐT...");
  if (await clickBtn(page, "BC-32")) {
    await sleep(1000);
    await take("11_modal_bao_cao_32_quan_ly_mam_non.png", "Modal 16: Báo cáo số 32/BC-UBND gửi Phòng GD&ĐT TP. Thủ Dầu Một");
    await closeModal(page);
  }

  // Modal 3: Xem hồ sơ & Quyết định thành lập mầm non
  console.log("Mở Hồ sơ & QĐ thành lập mầm non...");
  if (await clickBtn(page, "Hồ sơ & QĐ")) {
    await sleep(1000);
    await take("12_modal_ho_so_quyet_dinh_thanh_lap_mn.png", "Modal 3: Hồ sơ pháp lý & Quyết định thành lập cơ sở mầm non");
    await closeModal(page);
  }

  // Modal 5: Ghi biên bản kiểm tra liên ngành
  console.log("Mở Ghi biên bản kiểm tra liên ngành...");
  if (await clickBtn(page, "Ghi biên bản")) {
    await sleep(1000);
    await take("13_modal_ghi_bien_ban_kiem_tra_mn.png", "Modal 5: Biên bản kiểm tra liên ngành an toàn mầm non (5 tiêu chuẩn)");
    await closeModal(page);
  }

  // Modal 14: Quyết định Tạm đình chỉ Điều 11 Thông tư 49
  console.log("Mở Quyết định Tạm đình chỉ Điều 11 TT 49...");
  if (await clickBtn(page, "QĐ Đình chỉ") || await clickBtn(page, "Tạm đình chỉ")) {
    await sleep(1000);
    await take("14_modal_quyet_dinh_tam_dinh_chi_mn.png", "Modal 14: Quyết định số 89/QĐ-UBND Tạm đình chỉ hoạt động GD mầm non (Điều 11 TT 49)");
    await closeModal(page);
  }

  // Modal 15: Quyết định Cho phép Hoạt động trở lại Điều 11 TT 49
  console.log("Mở Quyết định Phục hồi hoạt động Điều 11 TT 49...");
  if (await clickBtn(page, "Phục hồi")) {
    await sleep(1000);
    await take("15_modal_quyet_dinh_phuc_hoi_hoat_dong_mn.png", "Modal 15: Quyết định số 122/QĐ-UBND Cho phép hoạt động giáo dục trở lại");
    await closeModal(page);
  }

  // ==========================================
  // TAB 2: TRƯỜNG HỌC & TUYỂN SINH ĐẦU CẤP
  // ==========================================
  console.log("\n--- KIỂM THỬ TAB 2: TRƯỜNG CÔNG LẬP & TUYỂN SINH ĐẦU CẤP ---");
  await clickBtn(page, "2. Phối hợp Trường học");
  await sleep(1000);
  await take("16_tab2_truong_cong_lap_tuyen_sinh.png", "Tab 2: Mạng lưới trường học công lập & Tuyển sinh VNeID Đề án 06");

  // Modal 17: Kế hoạch tuyển sinh số 104/QĐ-UBND
  console.log("Mở Kế hoạch tuyển sinh đầu cấp số 104/QĐ-UBND...");
  if (await clickBtn(page, "Số 104")) {
    await sleep(1000);
    await take("17_modal_ke_hoach_tuyen_sinh_dau_cap_qd104.png", "Modal 17: Quyết định số 104/QĐ-UBND Phân tuyến tuyển sinh 9 khu phố qua VNeID");
    await closeModal(page);
  }

  // Modal 21: Kế hoạch liên ngành ATGT Cổng trường (Chỉ thị 31/CT-TTg)
  console.log("Mở Kế hoạch ATGT Cổng trường Chỉ thị 31...");
  if (await clickBtn(page, "Chỉ thị 31")) {
    await sleep(1000);
    await take("18_modal_ke_hoach_atgt_cong_truong_chi_thi_31.png", "Modal 21: Kế hoạch số 45/KH-UBND Bảo đảm trật tự ATGT cổng trường học (Chỉ thị 31/CT-TTg)");
    await closeModal(page);
  }

  // Modal 7: Điều phối ATGT Cổng trường
  console.log("Mở Điều phối ATGT trường học...");
  if (await clickBtn(page, "Điều phối ATGT")) {
    await sleep(1000);
    await take("19_modal_dieu_phoi_atgt_cong_truong.png", "Modal 7: Điều phối phương án phân luồng ATGT cổng trường học");
    await closeModal(page);
  }

  // ==========================================
  // TAB 3: PHỔ CẬP GIÁO DỤC, XÓA MÙ CHỮ & KHUYẾN HỌC
  // ==========================================
  console.log("\n--- KIỂM THỬ TAB 3: PHỔ CẬP & KHUYẾN HỌC ---");
  await clickBtn(page, "3. Phổ cập giáo dục");
  await sleep(1000);
  await take("20_tab3_pho_cap_khuyen_hoc_tong_quan.png", "Tab 3: Chỉ số PCGD-XMC & 4 Mô hình Học tập (Thông tư 22/2020)");

  // Modal 4: Báo cáo tự kiểm tra đạt chuẩn PCGD-XMC số 18/BC-BCĐPC
  console.log("Mở Báo cáo số 18/BC-BCĐPC PCGD-XMC...");
  if (await clickBtn(page, "Tự kiểm tra PCGD-XMC")) {
    await sleep(1000);
    await take("21_modal_bao_cao_18_tu_kiem_tra_pcgd.png", "Modal 4: Báo cáo số 18/BC-BCĐPC Tự kiểm tra kết quả PCGD-XMC năm 2026");
    await closeModal(page);
  }

  // Modal 18: Quyết định & Bằng khen Gia đình học tập tiêu biểu
  console.log("Mở Bằng khen Gia đình học tập...");
  if (await clickBtn(page, "Bằng Khen Gia đình học tập")) {
    await sleep(1000);
    await take("22_modal_giay_cong_nhan_gia_dinh_hoc_tap.png", "Modal 18: Giấy công nhận & Quyết định 142/QĐ-UBND Gia đình học tập tiêu biểu");
    await closeModal(page);
  }

  // Modal 19: Trao học bổng Thắp sáng ước mơ
  console.log("Mở Trao học bổng Thắp sáng ước mơ...");
  if (await clickBtn(page, "Trao học bổng")) {
    await sleep(1000);
    await take("23_modal_trao_hoc_bong_thap_sang_uoc_mo.png", "Modal 19: Trao học bổng Khuyến học Thắp sáng ước mơ cho học sinh nghèo");
    await closeModal(page);
  }

  await browser.close();
  console.log("\n🎉 HOÀN THÀNH TOÀN BỘ 23 BẢN CHỤP KIỂM THỬ GIAO DIỆN & VĂN BẢN HÀNH CHÍNH!");
}

run().catch((err) => {
  console.error("Lỗi quá trình chụp màn hình:", err);
  process.exit(1);
});
