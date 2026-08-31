import "@mfe/design-system/dist/style.css";
import { Button, NavBar } from "@mfe/design-system";
import { loadRemote, preloadRemote } from "@module-federation/enhanced/runtime";
import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";

import { loadPages, PageConfig } from "./pages";
import { remotes } from "./remotes.config";

async function loadRemoteStyles() {
  await Promise.allSettled(remotes.map((r) => loadRemote(`${r.name}/styles`)));
}

function App({ pages }: { pages: PageConfig[] }) {
  if (pages.length === 0) {
    return (
      <p style={{ padding: 24 }}>
        불러올 수 있는 페이지가 없습니다. remote 서버가 떠 있는지 확인해주세요.
      </p>
    );
  }

  const defaultPath = pages.find((page) => page.nav)?.path ?? pages[0].path;

  return (
    <BrowserRouter>
      <NavBar>
        {pages
          .filter((page) => page.nav)
          .map((page) => (
            <Link
              key={page.path}
              to={page.path}
              onMouseEnter={() =>
                preloadRemote([
                  { nameOrAlias: page.remote, resourceCategory: "sync" },
                ]).catch(() => {})
              }
            >
              <Button>{page.label}</Button>
            </Link>
          ))}
      </NavBar>

      <Suspense fallback={<p style={{ padding: 24 }}>불러오는 중...</p>}>
        <Routes>
          <Route path="/" element={<Navigate to={defaultPath} replace />} />
          {pages.map((page) => (
            <Route
              key={page.path}
              path={page.path}
              element={<page.component />}
            />
          ))}
          <Route
            path="*"
            element={
              <div style={{ padding: 24 }}>
                <p>페이지를 찾을 수 없습니다.</p>
                <Link to={defaultPath}>홈으로</Link>
              </div>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

async function main() {
  const [, pages] = await Promise.all([loadRemoteStyles(), loadPages()]);
  const container = document.getElementById("root");
  if (container) {
    createRoot(container).render(<App pages={pages} />);
  }
}
main();
