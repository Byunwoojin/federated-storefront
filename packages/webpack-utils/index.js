const fs = require("fs");
const path = require("path");

function discoverPageFiles(pagesDir) {
  return fs.readdirSync(pagesDir).filter((f) => /\.(tsx|jsx)$/.test(f) 
  && !/\.(test|spec)\.(tsx|jsx)$/.test(f),)
}

function buildPageExposes(pagesDir) {
  return discoverPageFiles(pagesDir).reduce((exposes, file) => {
    const name = file.replace(/\.(tsx|jsx)$/, "");
    exposes[`./${name}`] = `./src/pages/${file}`;
    return exposes;
  }, {});
}

// 페이지 컴포넌트 옆의 `<Name>.meta.js`에서 라우팅 메타(path/label/nav)를 읽어
// remote가 스스로 자신의 페이지 목록을 선언하게 한다. host는 이 값을 빌드 시점에
// 알 필요 없이, 배포된 remote가 내려주는 pages-manifest.json을 런타임에 읽는다.
function buildPagesManifest(pagesDir, remoteName) {
  const pages = discoverPageFiles(pagesDir).map((file) => {
    const name = file.replace(/\.(tsx|jsx)$/, "");
    const metaPath = path.join(pagesDir, `${name}.meta.js`);
    if (!fs.existsSync(metaPath)) {
      throw new Error(
        `${remoteName}: ${name} 페이지에 라우팅 메타(${name}.meta.js)가 없습니다.`,
      );
    }
    const meta = require(metaPath);
    return {
      exposedModule: name,
      path: meta.path,
      label: meta.label,
      nav: meta.nav ?? true,
    };
  });
  return { remote: remoteName, pages };
}

// webpack 5의 asset API로 dist/pages-manifest.json을 정적 파일로 함께 배포한다.
// remoteEntry.js와 같은 origin에서 서빙되므로 host는 별도 서버 없이 fetch로 읽을 수 있다.
class PagesManifestPlugin {
  constructor(manifest) {
    this.manifest = manifest;
  }

  apply(compiler) {
    const { RawSource } = compiler.webpack.sources;
    compiler.hooks.thisCompilation.tap("PagesManifestPlugin", (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: "PagesManifestPlugin",
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        () => {
          compilation.emitAsset(
            "pages-manifest.json",
            new RawSource(JSON.stringify(this.manifest, null, 2)),
          );
        },
      );
    });
  }
}

module.exports = { buildPageExposes, buildPagesManifest, PagesManifestPlugin };
