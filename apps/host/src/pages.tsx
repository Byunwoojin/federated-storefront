import { loadRemote } from "@module-federation/enhanced/runtime";
import { lazy, ComponentType } from "react";

import { remotes } from "./remotes.config";

export interface PageConfig {
  path: string;
  label: string;
  component: ComponentType;
  nav: boolean;
}

interface RemotePageEntry {
  path: string;
  label: string;
  exposedModule: string;
  nav?: boolean;
}

interface RemotePagesManifest {
  remote: string;
  pages: RemotePageEntry[];
}

function isRemotePagesManifest(value: unknown): value is RemotePagesManifest {
  if (!value || typeof value !== "object") return false;
  const m = value as RemotePagesManifest;
  return (
    typeof m.remote === "string" &&
    Array.isArray(m.pages) &&
    m.pages.every(
      (p) =>
        typeof p?.path === "string" &&
        typeof p?.label === "string" &&
        typeof p?.exposedModule === "string",
    )
  );
}

function loadRemotePage(remoteName: string, exposedModule: string, label: string) {
  const message = `${label}을 불러올 수 없습니다. 잠시 후 다시 시도해주세요.`;

  return lazy(
    () =>
      loadRemote<{ default: ComponentType }>(`${remoteName}/${exposedModule}`)
        .then((mod) => {
          if (!mod) throw new Error(`remote module not found: ${remoteName}/${exposedModule}`);
          return mod;
        })
        .catch(() => ({
          default: () => (
            <div style={{ padding: 24 }}>
              <p>{message}</p>
            </div>
          ),
        })) as Promise<{ default: ComponentType }>,
  );
}

async function fetchManifest(remote: {
  name: string;
  devUrl: string;
  prodUrl: string;
}): Promise<RemotePagesManifest | null> {
  const entryUrl = process.env.NODE_ENV === "production" ? remote.prodUrl : remote.devUrl;

  try {
    const origin = new URL(entryUrl).origin;
    const res = await fetch(`${origin}/pages-manifest.json`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!isRemotePagesManifest(data)) {
      console.error(`${remote.name}의 pages-manifest.json 형식이 올바르지 않습니다.`, data);
      return null;
    }
    return data;
  } catch (err) {
    console.error(`${remote.name}의 페이지 목록을 불러오지 못했습니다.`, err);
    return null;
  }
}

export async function loadPages(): Promise<PageConfig[]> {
  const manifests = await Promise.all(remotes.map(fetchManifest));

  return manifests
    .filter((m): m is RemotePagesManifest => m !== null)
    .flatMap((m) =>
      m.pages.map((page) => ({
        path: page.path,
        label: page.label,
        nav: page.nav ?? true,
        component: loadRemotePage(m.remote, page.exposedModule, page.label),
      })),
    );
}
