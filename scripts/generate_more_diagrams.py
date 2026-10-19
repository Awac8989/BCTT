import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches

os.makedirs('docs/diagrams', exist_ok=True)
plt.rcParams['font.sans-serif'] = ['DejaVu Sans', 'Arial', 'Segoe UI']

def create_erd_diagram():
    fig, ax = plt.subplots(figsize=(12, 8), dpi=300)
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 8.5)
    ax.axis('off')

    # Trung tâm: ho_so_ncc
    center_box = patches.FancyBboxPatch((4.5, 3.8), 3.0, 1.6, boxstyle="round,pad=0.1", ec="#b91c1c", fc="#b91c1c")
    ax.add_patch(center_box)
    ax.text(6.0, 4.8, "ho_so_ncc (Bảng Trung Tâm)", color="#fef08a", weight="bold", ha="center", va="center", fontsize=9.5)
    ax.text(6.0, 4.2, "PK: ho_so_id | so_cccd (UNIQUE)\nho_ten, ngay_sinh, ty_le_thuong_tat\nFK: ward_id, ma_loai_dt, user_id", color="white", ha="center", va="center", fontsize=7.5)

    # Các bảng vệ tinh
    tables = [
        ((0.5, 6.5), 2.6, 1.3, "dm_phuong", "PK: ward_id\nward_name, district_name", "#1e3a8a"),
        ((4.7, 6.8), 2.6, 1.3, "dm_loai_doi_tuong", "PK: ma_loai_dt\nten_loai_dt, nhom_uu_dai", "#1e3a8a"),
        ((8.9, 6.5), 2.6, 1.3, "sys_users / sys_roles", "PK: user_id | role_id\nusername, full_name, role_name", "#1e3a8a"),
        ((0.5, 3.8), 2.6, 1.4, "ho_so_liet_sy", "PK: liet_sy_id | FK: ho_so_id\nso_bang_to_quoc, ngay_hy_sinh", "#0f766e"),
        ((0.5, 1.5), 2.6, 1.3, "than_nhan_liet_si", "PK: than_nhan_id\nFK: liet_sy_id, ho_ten, tho_cung", "#0f766e"),
        ((8.9, 3.8), 2.6, 1.4, "quyet_dinh_huong", "PK: quyet_dinh_id | FK: ho_so_id\nso_quyet_dinh, so_tien_thang", "#b45309"),
        ((8.9, 1.5), 2.6, 1.3, "lich_su_chi_tra", "PK: chi_tra_id | FK: quyet_dinh_id\nthang, nam, so_tien, trang_thai", "#b45309"),
        ((3.5, 1.2), 2.3, 1.3, "khao_sat_danh_gia", "PK: khao_sat_id | FK: ho_so_id\ndiem_csat, sentiment_tag", "#7c3aed"),
        ((6.2, 1.2), 2.3, 1.3, "ho_so_bao_giam_mai_tang", "PK: bao_giam_id | FK: ho_so_id\nngay_tu_tran, so_tien_mai_tang", "#4338ca"),
    ]

    for (xy, w, h, title, cols, c) in tables:
        p = patches.FancyBboxPatch(xy, w, h, boxstyle="round,pad=0.08", ec=c, fc=c)
        ax.add_patch(p)
        ax.text(xy[0] + w/2, xy[1] + h - 0.3, title, color="#fef08a", weight="bold", ha="center", va="center", fontsize=8.5)
        ax.text(xy[0] + w/2, xy[1] + 0.45, cols, color="white", ha="center", va="center", fontsize=7)

    # Vẽ đường nối giữa các bảng quan hệ
    connections = [
        ((3.1, 7.0), (4.5, 5.0)),   # dm_phuong -> ho_so_ncc
        ((6.0, 6.8), (6.0, 5.4)),   # dm_loai_dt -> ho_so_ncc
        ((8.9, 7.0), (7.5, 5.0)),   # sys_users -> ho_so_ncc
        ((3.1, 4.5), (4.5, 4.5)),   # ho_so_liet_sy -> ho_so_ncc
        ((1.8, 2.8), (1.8, 3.8)),   # than_nhan -> ho_so_liet_sy
        ((7.5, 4.5), (8.9, 4.5)),   # ho_so_ncc -> quyet_dinh_huong
        ((10.2, 2.8), (10.2, 3.8)), # lich_su_chi_tra -> quyet_dinh_huong
        ((5.0, 2.5), (5.5, 3.8)),   # khao_sat -> ho_so_ncc
        ((7.0, 2.5), (6.5, 3.8)),   # bao_giam -> ho_so_ncc
    ]

    for (p1, p2) in connections:
        ax.annotate('', xy=p2, xytext=p1,
                    arrowprops=dict(facecolor='#64748b', edgecolor='#64748b', arrowstyle='<->', lw=1.5, ls='--'))

    plt.tight_layout()
    plt.savefig("docs/diagrams/hinh_2_3_so_do_erd.png", dpi=300)
    plt.close()
    print("Done ERD diagram")

def create_sequence_diagram():
    fig, ax = plt.subplots(figsize=(11, 7), dpi=300)
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 9)
    ax.axis('off')

    lifelines = [
        (1.5, "Cán bộ Thẩm định\n(Client Web)", "#2563eb"),
        (4.2, "Node.js API\nGateway", "#0284c7"),
        (6.8, "Spring Boot\nCore Engine", "#b45309"),
        (9.5, "MySQL 8.0\nDatabase", "#047857"),
    ]

    for (x, name, col) in lifelines:
        box = patches.FancyBboxPatch((x - 1.0, 7.8), 2.0, 0.9, boxstyle="round,pad=0.08", ec=col, fc=col)
        ax.add_patch(box)
        ax.text(x, 8.25, name, color="white", weight="bold", ha="center", va="center", fontsize=8.5)
        ax.plot([x, x], [1.0, 7.8], color="#94a3b8", lw=1.5, ls=":")

    messages = [
        (1.5, 4.2, 7.2, "1. Gửi yêu cầu thẩm định (ho_so_id, ty_le, ma_loai_dt)", "#1e3a8a", False),
        (4.2, 6.8, 6.5, "2. POST /api/v1/calculator (Ủy thác tính toán)", "#0284c7", False),
        (6.8, 9.5, 5.8, "3. Query định mức chuẩn (MUC_CHUAN = 2.055.000đ)", "#b45309", False),
        (9.5, 6.8, 5.1, "4. Trả về bảng hệ số & công thức pháp lý", "#047857", True),
        (6.8, 4.2, 4.4, "5. Trả kết quả trợ cấp (BigDecimal, làm tròn HALF_UP)", "#b45309", True),
        (4.2, 9.5, 3.7, "6. BEGIN TRANSACTION -> INSERT quyet_dinh_huong", "#0284c7", False),
        (4.2, 9.5, 3.0, "7. UPDATE ho_so_ncc (trang_thai = 'DA_DUYET') -> COMMIT", "#0284c7", False),
        (9.5, 4.2, 2.3, "8. Xác nhận giao dịch thành công (ACID Committed)", "#047857", True),
        (4.2, 1.5, 1.6, "9. Phản hồi thông báo: Duyệt & Ban hành Quyết định OK", "#1e3a8a", True),
    ]

    for (x1, x2, y, text, col, is_dash) in messages:
        ls = '--' if is_dash else '-'
        ax.annotate('', xy=(x2, y), xytext=(x1, y),
                    arrowprops=dict(facecolor=col, edgecolor=col, arrowstyle='->', lw=1.5, ls=ls))
        mid_x = (x1 + x2) / 2
        ax.text(mid_x, y + 0.18, text, color="#0f172a", fontsize=7.5, weight="bold", ha="center", va="bottom",
                bbox=dict(boxstyle="round,pad=0.2", fc="#f8fafc", ec="#e2e8f0", lw=0.5))

    plt.tight_layout()
    plt.savefig("docs/diagrams/hinh_3_1_sequence_tham_dinh.png", dpi=300)
    plt.close()
    print("Done sequence diagram")

create_erd_diagram()
create_sequence_diagram()
