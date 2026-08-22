const fs = require("fs");
const path = require("path");

const APPS_DIR = path.join(__dirname, "..", "..", "apps");
const REMOTES_CONFIG_PATH = path.join(APPS_DIR, "host", "src", "remotes.config.js");

function usedPorts() {
  return fs
    .readdirSync(APPS_DIR)
    .map((app: string) => {
      const configPath = path.join(APPS_DIR, app, "webpack.config.js");
      if (!fs.existsSync(configPath)) return null;
      const content = fs.readFileSync(configPath, "utf-8");
      const match = content.match(/port:\s*(\d+)/);
      return match ? Number(match[1]) : null;
    })
    .filter((port: number | null) => port !== null);
}

module.exports = function (plop: any) {
  // 리모트 이름/페이지 이름은 파일 경로·MF 컨테이너 이름·표시 라벨 등 여러 형태로
  // 동시에 필요해서, 하나의 입력값으로부터 케이스만 바꿔 파생시킨다.
  plop.setHelper("pascalCase", (str: string) =>
    String(str)
      .replace(/[-_\s]+(.)?/g, (_: string, c: string) => (c ? c.toUpperCase() : ""))
      .replace(/^./, (c: string) => c.toUpperCase()),
  );
  plop.setHelper("kebabCase", (str: string) =>
    String(str).trim().replace(/[_\s]+/g, "-").toLowerCase(),
  );
  plop.setHelper("snakeCase", (str: string) =>
    String(str).trim().replace(/[-\s]+/g, "_").toLowerCase(),
  );

  plop.setGenerator("remote", {
    description: "새 MFE remote 앱을 생성하고 host에 등록합니다",
    prompts: [
      {
        type: "input",
        name: "name",
        message:
          "remote 이름 — 'remote' 접미사는 자동으로 붙으니 빼고 입력 (예: wishlist, order-history)",
        validate: (input: string) => {
          if (!/^[a-z][a-z0-9-]*$/.test(input)) {
            return "소문자, 숫자, 하이픈(-)만 사용하세요. 첫 글자는 영문자여야 합니다.";
          }
          if (/(^|-)remote$/i.test(input)) {
            const stripped = input.replace(/(^|-)remote$/i, "").replace(/-$/, "");
            return `'remote'는 자동으로 붙습니다. "${stripped}"처럼 빼고 입력하세요.`;
          }
          if (fs.existsSync(path.join(APPS_DIR, `${input}-remote`))) {
            return `apps/${input}-remote가 이미 존재합니다.`;
          }
          return true;
        },
      },
      {
        type: "input",
        name: "port",
        message: "dev 서버 포트 번호 (예: 3005)",
        validate: (input: string) => {
          if (!/^\d{4,5}$/.test(input)) return "4~5자리 숫자를 입력하세요.";
          const taken = usedPorts();
          if (taken.includes(Number(input))) {
            return `이미 사용 중인 포트입니다 (${taken.join(", ")}). 다른 번호를 입력하세요.`;
          }
          return true;
        },
      },
      {
        type: "input",
        name: "pageName",
        message: "첫 페이지 컴포넌트 이름 (PascalCase, 예: WishlistPage)",
        validate: (input: string) =>
          /^[A-Z][A-Za-z0-9]*$/.test(input) || "PascalCase로 입력하세요 (예: WishlistPage).",
      },
      {
        type: "input",
        name: "pagePath",
        message: "라우트 경로 (예: /wishlist)",
        validate: (input: string) => (input.startsWith("/") ? true : "/로 시작해야 합니다."),
      },
      {
        type: "input",
        name: "pageLabel",
        message: "nav에 표시할 라벨 (예: 위시리스트)",
        validate: (input: string) => (input.trim().length > 0 ? true : "라벨을 입력하세요."),
      },
    ],
    actions: [
      {
        type: "addMany",
        destination: `${APPS_DIR}/{{kebabCase name}}-remote`,
        base: "templates/remote",
        templateFiles: "templates/remote/**/*",
        globOptions: { dot: true },
      },
      {
        type: "modify",
        path: REMOTES_CONFIG_PATH,
        pattern: /\n\];/,
        template: `
  {
    name: "{{snakeCase name}}_remote",
    devUrl: "http://localhost:{{port}}/remoteEntry.js",
    prodUrl: "https://REPLACE_WITH_VERCEL_URL.vercel.app/remoteEntry.js", // TODO: Vercel 배포 후 실제 URL로 교체
  },
];`,
      },
      (answers: any) =>
        `\napps/${answers.name}-remote 생성 완료. 다음을 진행하세요:\n` +
        `  1) npm install (저장소 루트에서)\n` +
        `  2) npm run dev --workspace=${answers.name}-remote\n` +
        `  3) apps/host/src/remotes.config.js의 prodUrl을 Vercel 배포 후 실제 URL로 교체\n`,
    ],
  });
};
