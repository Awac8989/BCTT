import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Ellipse, FancyBboxPatch

os.makedirs('docs/diagrams', exist_ok=True)

# Cấu hình phông chữ thẩm mỹ cao hỗ trợ Unicode tiếng Việt
plt.rcParams['font.sans-serif'] = ['Segoe UI', 'Arial', 'DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False

def draw_uml_actor(ax, x, y, label, role_desc="", color="#0f172a"):
    """Vẽ tác nhân (Actor) đúng chuẩn UML truyền thống (Stick Figure) như vẽ tay trong StarUML/Draw.io"""
    r_head = 0.23
    # Đầu (Circle)
    head = plt.Circle((x, y + 0.65), r_head, edgecolor=color, facecolor="#ffffff", lw=1.8, zorder=10)
    ax.add_patch(head)
    # Thân (Torso)
    ax.plot([x, x], [y + 0.42, y - 0.18], color=color, lw=1.8, zorder=10)
    # Tay (Arms)
    ax.plot([x - 0.38, x + 0.38], [y + 0.22, y + 0.22], color=color, lw=1.8, zorder=10)
    # Chân (Legs)
    ax.plot([x, x - 0.30], [y - 0.18, y - 0.72], color=color, lw=1.8, zorder=10)
    ax.plot([x, x + 0.30], [y - 0.18, y - 0.72], color=color, lw=1.8, zorder=10)
    
    # Nhãn tên Tác nhân
    ax.text(x, y - 0.95, label, fontsize=9.5, weight="bold", color=color, ha="center", va="top", zorder=11)
    if role_desc:
        ax.text(x, y - 1.30, role_desc, fontsize=7.8, style="italic", color="#475569", ha="center", va="top", zorder=11)

def draw_uml_usecase(ax, x, y, width, height, title, code="", ec="#1e3a8a", fc="#ffffff", text_color="#0f172a", fontsize=8.4):
    """Vẽ Use Case hình Oval chuẩn UML không màu mè phức tạp"""
    ellipse = Ellipse((x, y), width, height, edgecolor=ec, facecolor=fc, lw=1.4, zorder=5)
    ax.add_patch(ellipse)
    full_text = f"<{code}>\n{title}" if code else title
    ax.text(x, y, full_text, fontsize=fontsize, weight="bold", color=text_color,
            ha="center", va="center", multialignment="center", zorder=6)

def draw_assoc(ax, p1, p2, color="#334155", lw=1.2):
    """Đường kết hợp (Association) giữa Tác nhân và Use Case"""
    ax.plot([p1[0], p2[0]], [p1[1], p2[1]], color=color, lw=lw, ls="-", zorder=3)

def draw_dep(ax, p1, p2, text="<<include>>", text_offset=(0, 0.14), color="#0284c7"):
    """Vẽ quan hệ phụ thuộc <<include>> hoặc <<extend>> nét đứt với mũi tên mở"""
    ax.annotate('', xy=p2, xytext=p1,
                arrowprops=dict(facecolor=color, edgecolor=color, arrowstyle='->', lw=1.3, ls='--', shrinkA=2, shrinkB=2),
                zorder=4)
    mid_x = (p1[0] + p2[0]) / 2 + text_offset[0]
    mid_y = (p1[1] + p2[1]) / 2 + text_offset[1]
    ax.text(mid_x, mid_y, text, fontsize=7.2, weight="bold", color=color,
            ha="center", va="center",
            bbox=dict(boxstyle="round,pad=0.15", fc="#ffffff", ec=color, lw=0.6, alpha=0.98), zorder=7)

def generate_simple_diagram():
    fig, ax = plt.subplots(figsize=(16.0, 11.5), dpi=300)
    ax.set_xlim(-0.8, 16.8)
    ax.set_ylim(-0.8, 12.0)
    ax.axis('off')

    # 1. HỘP RANH GIỚI HỆ THỐNG DUY NHẤT (SINGLE SYSTEM BOUNDARY - CHUẨN DRAW.IO / STARUML)
    # Khung viền đơn giản, thanh mảnh, nguyên khối thống nhất
    sys_box = FancyBboxPatch((2.4, 0.2), 11.2, 11.3, boxstyle="square,pad=0.0",
                             ec="#1e293b", fc="#ffffff", lw=1.8, zorder=1)
    ax.add_patch(sys_box)

    # Tiêu đề ranh giới hệ thống góc trên bên trái theo chuẩn UML
    ax.text(2.6, 11.25, "System: Quản lý Hồ sơ Người có công & Đánh giá Dịch vụ công (TP. Thủ Dầu Một)",
            color="#0f172a", weight="bold", fontsize=11, ha="left", va="top", zorder=3)
    ax.plot([2.4, 13.6], [10.95, 10.95], color="#cbd5e1", lw=1.0, ls="-", zorder=2)

    # 2. BỐ TRÍ CÁC USE CASE LIÊN KẾT CHẶT CHẼ THEO LUỒNG NGHIỆP VỤ XUYÊN SUỐT
    # -------------------------------------------------------------------------
    # CỘT TRÁI (XỬ LÝ MỘT CỬA & NGHIỆP VỤ LIÊN THÔNG):
    # -------------------------------------------------------------------------
    # UC-01: Tiếp nhận hồ sơ & Cấp mã định danh
    draw_uml_usecase(ax, 4.3, 9.8, 2.5, 0.82, "Tiếp nhận hồ sơ mới\n& Cấp mã định danh", "UC-01", ec="#1e40af", fc="#ffffff")
    # UC-01a: In Giấy hẹn Mẫu 01 (kèm QR Code tra cứu)
    draw_uml_usecase(ax, 7.4, 9.8, 2.2, 0.80, "In Giấy hẹn Mẫu 01\n(Mã QR Code tra cứu)", "UC-01a", ec="#1e40af", fc="#ffffff")
    # UC-02: Số hóa tài liệu cũ (AI OCR)
    draw_uml_usecase(ax, 4.3, 8.4, 2.5, 0.78, "Số hóa tài liệu cũ\n(AI OCR Scan bóc tách)", "UC-02", ec="#1e40af", fc="#ffffff")

    # UC-03: Thẩm định hồ sơ y khoa 5 bước
    draw_uml_usecase(ax, 4.3, 6.8, 2.5, 0.82, "Thẩm định hồ sơ 5 bước\n(Kiểm tra y khoa & pháp lý)", "UC-03", ec="#0f766e", fc="#ffffff")
    # UC-03a: Tự động tính trợ cấp ưu đãi (NĐ 75/2021)
    draw_uml_usecase(ax, 7.4, 6.8, 2.2, 0.80, "Tự động tính trợ cấp\n(Nghị định 75/2021)", "UC-03a", ec="#0f766e", fc="#ffffff")

    # UC-05: Lập danh sách & Chi trả trợ cấp (Mẫu C70a-HD)
    draw_uml_usecase(ax, 4.3, 4.8, 2.5, 0.82, "Lập danh sách chi trả &\nIn Phiếu chi Mẫu C70a-HD", "UC-05", ec="#b45309", fc="#ffffff")
    # UC-05a: Đối soát tự động sao kê ngân hàng
    draw_uml_usecase(ax, 7.4, 4.8, 2.2, 0.80, "Đối soát tự động\nsao kê Ngân hàng", "UC-05a", ec="#b45309", fc="#ffffff")

    # UC-06: Tiếp nhận báo giảm từ trần & Cấp Mai táng phí Mẫu 02
    draw_uml_usecase(ax, 4.3, 3.1, 2.5, 0.82, "Tiếp nhận báo giảm từ trần\n(Thu hồi & Cắt chế độ)", "UC-06", ec="#b45309", fc="#ffffff")
    draw_uml_usecase(ax, 7.4, 3.1, 2.2, 0.80, "Ban hành Quyết định\nMai táng phí Mẫu 02", "UC-06a", ec="#b45309", fc="#ffffff")

    # UC-07: Quản lý điều dưỡng & Dụng cụ chỉnh hình
    draw_uml_usecase(ax, 4.3, 1.4, 2.5, 0.82, "Quản lý điều dưỡng &\nCấp dụng cụ chỉnh hình", "UC-07", ec="#0f766e", fc="#ffffff")

    # -------------------------------------------------------------------------
    # CỘT PHẢI (PHÊ DUYỆT LÃNH ĐẠO, DỊCH VỤ CÔNG & GIÁM SÁT):
    # -------------------------------------------------------------------------
    # UC-04: Ký số điện tử PKI SmartCA (Lãnh đạo)
    draw_uml_usecase(ax, 11.2, 9.8, 2.5, 0.82, "Ký số điện tử PKI SmartCA\nphê duyệt Quyết định", "UC-04", ec="#be123c", fc="#ffffff")

    # UC-10: Dashboard điều hành & Giám sát Radar SIPAS
    draw_uml_usecase(ax, 11.2, 8.4, 2.5, 0.82, "Dashboard điều hành &\nGiám sát Radar SIPAS", "UC-10", ec="#be123c", fc="#ffffff")

    # UC-09: Đánh giá chất lượng dịch vụ Kiosk Một cửa (1-5 sao)
    draw_uml_usecase(ax, 11.2, 6.8, 2.5, 0.82, "Đánh giá dịch vụ Kiosk\n(1-5 sao, 4 tiêu chí SIPAS)", "UC-09", ec="#6d28d9", fc="#ffffff")
    # UC-09a: Góp ý nhận xét tự do (AI Sentiment)
    draw_uml_usecase(ax, 8.4, 6.8, 2.05, 0.78, "Góp ý nhận xét tự do\n(AI phân tích cảm xúc)", "UC-09a", ec="#6d28d9", fc="#ffffff")

    # UC-08: Tra cứu tiến độ hồ sơ & Lịch phát tiền qua CCCD
    draw_uml_usecase(ax, 11.2, 5.0, 2.5, 0.82, "Tra cứu tiến độ hồ sơ &\nLịch nhận tiền qua CCCD", "UC-08", ec="#6d28d9", fc="#ffffff")

    # UC-11: Bản đồ số GIS & Tra cứu bia mộ Liệt sĩ trực tuyến
    draw_uml_usecase(ax, 11.2, 3.1, 2.5, 0.82, "Bản đồ số không gian GIS\n& Định vị mộ Liệt sĩ", "UC-11", ec="#0369a1", fc="#ffffff")

    # UC-12: Quản trị định mức tham số & Phân quyền RBAC
    draw_uml_usecase(ax, 11.2, 1.4, 2.5, 0.82, "Quản trị định mức trợ cấp\n& Phân quyền RBAC", "UC-12", ec="#334155", fc="#ffffff")

    # 3. QUAN HỆ PHỤ THUỘC <<include>> VÀ <<extend>> NỐI KẾT LIÊN HOÀN (FLOW)
    # ----------------------------------------------------------------------
    # UC-01 include UC-01a (Tiếp nhận -> bắt buộc in Giấy hẹn Mẫu 01)
    draw_dep(ax, (5.55, 9.8), (6.3, 9.8), text="<<include>>", text_offset=(0, 0.16), color="#1e40af")
    # UC-02 extend UC-01 (Quét OCR mở rộng cho khâu Tiếp nhận)
    draw_dep(ax, (4.3, 8.79), (4.3, 9.39), text="<<extend>>", text_offset=(0.38, 0), color="#1e40af")

    # UC-03 include UC-03a (Thẩm định -> bắt buộc gọi Engine tính tiền NĐ 75/2021)
    draw_dep(ax, (5.55, 6.8), (6.3, 6.8), text="<<include>>", text_offset=(0, 0.16), color="#0f766e")

    # UC-03 nối sang UC-04 (Hồ sơ thẩm định hoàn tất -> chuyển Lãnh đạo ký duyệt)
    # Đây là luồng nghiệp vụ liên thông khép kín giữa Thẩm định và Phê duyệt!
    draw_dep(ax, (5.55, 7.1), (9.95, 9.5), text="<<include>>\n(Trình phê duyệt)", text_offset=(-0.1, 0.24), color="#be123c")

    # UC-05 extend UC-05a (Đối soát ngân hàng mở rộng cho khâu Chi trả)
    draw_dep(ax, (6.3, 4.8), (5.55, 4.8), text="<<extend>>", text_offset=(0, 0.16), color="#b45309")

    # UC-06 include UC-06a (Báo giảm tử tuất -> bắt buộc sinh QĐ Mai táng phí Mẫu 02)
    draw_dep(ax, (5.55, 3.1), (6.3, 3.1), text="<<include>>", text_offset=(0, 0.16), color="#b45309")

    # UC-09 extend UC-09a (Góp ý nhận xét tự do mở rộng cho việc chấm sao Kiosk)
    draw_dep(ax, (9.42, 6.8), (9.95, 6.8), text="<<extend>>", text_offset=(0, 0.16), color="#6d28d9")

    # UC-09 nạp dữ liệu trực tiếp sang UC-10 (Đánh giá Kiosk công dân -> cập nhật tức thì vào Radar SIPAS của Lãnh đạo)
    draw_dep(ax, (11.2, 7.21), (11.2, 7.99), text="<<include>>\n(Dữ liệu thời gian thực)", text_offset=(0.75, 0), color="#be123c")

    # 4. CÁC TÁC NHÂN (ACTORS) VÀ ĐƯỜNG LIÊN KẾT (ASSOCIATIONS)
    # ==========================
    # PHÍA BÊN TRÁI (LEFT ACTORS)
    # ==========================
    x_act_l = 1.05

    # Tác nhân 1: Cán bộ Tiếp nhận Một cửa (y = 9.3)
    draw_uml_actor(ax, x_act_l, 9.3, "Cán bộ Một cửa", "(Tiếp nhận & Cấp mã)", color="#0f172a")
    draw_assoc(ax, (x_act_l + 0.35, 9.4), (3.05, 9.8), color="#334155", lw=1.3) # UC-01
    draw_assoc(ax, (x_act_l + 0.35, 9.1), (3.05, 8.4), color="#334155", lw=1.3) # UC-02
    draw_assoc(ax, (x_act_l + 0.35, 8.8), (3.05, 3.3), color="#334155", lw=1.1) # UC-06 Báo giảm

    # Tác nhân 2: Chuyên viên Thẩm định (y = 5.8)
    draw_uml_actor(ax, x_act_l, 5.8, "Chuyên viên Thẩm định", "(Rà soát y khoa & Lập QĐ)", color="#0f172a")
    draw_assoc(ax, (x_act_l + 0.35, 6.0), (3.05, 6.8), color="#334155", lw=1.3) # UC-03
    draw_assoc(ax, (x_act_l + 0.35, 5.6), (3.05, 1.4), color="#334155", lw=1.2) # UC-07 Điều dưỡng/chỉnh hình

    # Tác nhân 3: Cán bộ Kế toán / Chi trả (y = 2.4)
    draw_uml_actor(ax, x_act_l, 2.4, "Cán bộ Kế toán / Chi trả", "(Lập C70a-HD & Đối soát)", color="#0f172a")
    draw_assoc(ax, (x_act_l + 0.35, 2.7), (3.05, 4.8), color="#334155", lw=1.3) # UC-05 Chi trả
    draw_assoc(ax, (x_act_l + 0.35, 2.3), (6.3, 3.1), color="#334155", lw=1.2) # UC-06a Mai táng phí

    # ==========================
    # PHÍA BÊN PHẢI (RIGHT ACTORS)
    # ==========================
    x_act_r = 15.0

    # Tác nhân 4: Lãnh đạo Phê duyệt (y = 9.3)
    draw_uml_actor(ax, x_act_r, 9.3, "Lãnh đạo Phê duyệt", "(Ký số PKI SmartCA & Giám sát)", color="#0f172a")
    draw_assoc(ax, (x_act_r - 0.35, 9.4), (12.45, 9.8), color="#334155", lw=1.3) # UC-04 Ký số
    draw_assoc(ax, (x_act_r - 0.35, 9.1), (12.45, 8.4), color="#334155", lw=1.3) # UC-10 Dashboard & Radar

    # Tác nhân 5: Công dân & Thân nhân (y = 5.8)
    draw_uml_actor(ax, x_act_r, 5.8, "Công dân / Thân nhân", "(Tra cứu CCCD & Kiosk CSAT)", color="#0f172a")
    draw_assoc(ax, (x_act_r - 0.35, 6.1), (12.45, 6.8), color="#334155", lw=1.3) # UC-09 Kiosk CSAT
    draw_assoc(ax, (x_act_r - 0.35, 5.8), (12.45, 5.0), color="#334155", lw=1.3) # UC-08 Tra cứu CCCD
    draw_assoc(ax, (x_act_r - 0.35, 5.5), (12.45, 3.1), color="#334155", lw=1.2) # UC-11 Bản đồ GIS

    # Tác nhân 6: Quản trị viên Hệ thống (y = 2.0)
    draw_uml_actor(ax, x_act_r, 2.0, "Quản trị viên Hệ thống", "(Phân quyền RBAC & Tham số)", color="#0f172a")
    draw_assoc(ax, (x_act_r - 0.35, 2.2), (12.45, 1.4), color="#334155", lw=1.3) # UC-12 RBAC & Tham số
    draw_assoc(ax, (x_act_r - 0.35, 2.5), (12.45, 3.0), color="#334155", lw=1.2) # UC-11 CSDL GIS

    # 5. CHÚ THÍCH (LEGEND) PHÍA DƯỚI GÓC HỆ THỐNG
    legend_y = -0.42
    ax.plot([3.8, 4.6], [legend_y, legend_y], color="#334155", lw=1.4, ls="-")
    ax.text(4.75, legend_y, "Đường liên kết (Association)", fontsize=8.5, color="#1e293b", va="center")

    ax.annotate('', xy=(8.7, legend_y), xytext=(7.7, legend_y),
                arrowprops=dict(facecolor="#0284c7", edgecolor="#0284c7", arrowstyle='->', lw=1.3, ls='--'))
    ax.text(8.85, legend_y, "Quan hệ Bao hàm <<include>>", fontsize=8.5, color="#0284c7", weight="bold", va="center")

    ax.annotate('', xy=(12.8, legend_y), xytext=(11.8, legend_y),
                arrowprops=dict(facecolor="#b45309", edgecolor="#b45309", arrowstyle='->', lw=1.3, ls='--'))
    ax.text(12.95, legend_y, "Quan hệ Mở rộng <<extend>>", fontsize=8.5, color="#b45309", weight="bold", va="center")

    output_path = "docs/diagrams/hinh_3_1_use_case_tong_quat.png"
    plt.tight_layout()
    plt.savefig(output_path, dpi=300, facecolor="#ffffff", edgecolor="none")
    plt.close()
    print(f"Sơ đồ Use Case tổng quát phong cách tự vẽ đã được cập nhật thành công tại: {output_path}")

if __name__ == "__main__":
    generate_simple_diagram()
