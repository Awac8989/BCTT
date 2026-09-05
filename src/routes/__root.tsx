import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { Toaster } from "../components/ui/sonner";
import { reportAppError } from "../lib/error-logger";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportAppError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center bg-white p-6 rounded border border-[#d2d6de] shadow-sm">
        <h1 className="text-lg font-bold text-[#dd4b39]">
          Sự cố xử lý dữ liệu hệ thống
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Đã xảy ra lỗi trong quá trình tải dữ liệu. Cán bộ vui lòng tải lại trang hoặc quay lại Bảng điều khiển.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded bg-[#dd4b39] px-4 py-2 text-sm font-medium text-white hover:bg-[#c23321]"
          >
            Tải lại trang
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded border border-[#d2d6de] bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Về Bảng điều khiển
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SLĐTBXH Bình Dương · Quản lý hồ sơ Người có công" },
      {
        name: "description",
        content:
          "Cổng Thông tin & Quản lý CSDL Người có công tỉnh Bình Dương: tiếp nhận, thẩm định, chi trả trợ cấp và tìm kiếm hồ sơ.",
      },
      { name: "author", content: "Sở Lao động - Thương binh và Xã hội tỉnh Bình Dương" },
      { property: "og:title", content: "SLĐTBXH Bình Dương · Quản lý hồ sơ Người có công" },
      {
        property: "og:description",
        content:
          "Hệ thống Quản lý hồ sơ Người có công & Đánh giá Dịch vụ công tỉnh Bình Dương.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "apple-touch-icon", href: "/favicon.svg" },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  // Đảm bảo không có các phần tử overlay lạ xuất hiện trên trang
  useEffect(() => {
    const sanitizeDOM = () => {
      const selectors = [
        "[data-watermark]",
        ".third-party-overlay",
        "#unauthorized-badge",
      ];
      selectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((el) => {
          el.remove();
        });
      });
    };

    sanitizeDOM();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

