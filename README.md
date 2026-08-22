# federated-storefront

Webpack5 Module Federation으로 여러 독립 배포 앱이 하나의 디자인 시스템을 공유하는
마이크로 프론트엔드(MFE) 프로젝트. Turborepo 기반 모노레포로, host 셸이 catalog-remote·
cart-remote·order-remote를 런타임에 조합하며, 각 앱은 서로 재빌드 없이 독립적으로 배포된다.

## 구조

```
apps/
  host/             셸 앱 — remote들을 라우팅으로 소비 (:3000)
  catalog-remote/   상품 목록 화면 (TypeScript, :3003)
  cart-remote/      장바구니 화면 (TypeScript, :3004)
  order-remote/     주문서 화면 (TypeScript, :3005)
packages/
  design-system/    공용 컴포넌트(@mfe/design-system) — Button/Card/Modal, Tailwind 기반
```

- `packages/design-system`이 유일한 컴포넌트 소스다. 각 앱은 이를 npm 워크스페이스
  의존성으로 설치해 일반 import로 사용하며(MF로 컴포넌트를 공유하지 않음), CSS는 사전
  빌드된 `dist/style.css`를 배포 시 함께 번들링한다.
- 디자인 토큰은 Primitive(색상/폰트 원자값) → Semantic(용도별 별칭) 2단계 구조로
  `packages/design-system/tailwind.config.js`에 정의되어 있고, 각 앱은 이를 프리셋으로 상속한다.

## 시작하기

저장소 **루트에서 한 번만** 설치한다. npm 워크스페이스 구조라 앱 폴더 안에서 개별
설치하면 안 되며(워크스페이스 링크가 깨짐), `package-lock.json`도 루트에 하나만
존재해야 한다.

```bash
npm install
npm run dev     # turbo run dev — 모든 앱을 동시에 실행
```

앱별로 개별 실행하려면:

```bash
npm run dev --workspace=host
npm run dev --workspace=catalog-remote
npm run dev --workspace=cart-remote
npm run dev --workspace=order-remote
```

| 앱             | 포트 | 역할                   |
| -------------- | ---- | ---------------------- |
| host           | 3000 | 라우팅 셸, remote 조합 |
| catalog-remote | 3003 | 상품 목록              |
| cart-remote    | 3004 | 장바구니               |
| order-remote   | 3005 | 주문서                 |

host를 열기 전에 remote들이 먼저 떠 있어야 `remoteEntry.js`를 정상적으로 불러올 수
있다(단, host는 각 remote의 `pages-manifest.json`을 런타임에 fetch하는 구조라, remote
하나가 안 떠 있어도 그 remote의 페이지만 nav/라우트에서 빠질 뿐 host 자체는 정상 동작한다).

## 배포

각 앱은 독립된 Vercel 프로젝트로 배포된다(저장소는 하나, Vercel 프로젝트는 앱 수만큼).
GitHub 저장소를 Vercel과 연결하고, 프로젝트별로 **Root Directory**를 아래처럼 지정한다.

| Vercel 프로젝트 | Root Directory        | Output Directory |
| --------------- | --------------------- | ---------------- |
| catalog-remote  | `apps/catalog-remote` | `dist`           |
| cart-remote     | `apps/cart-remote`    | `dist`           |
| order-remote    | `apps/order-remote`   | `dist`           |
| host            | `apps/host`           | `dist`           |

Vercel은 저장소 **루트에서 `npm install`**을 실행한 뒤(워크스페이스 링크가 정상 인식됨),
Root Directory로 지정된 앱만 빌드한다. 각 앱의 `build` 스크립트는 design-system을 먼저
빌드하고 나서 자신을 빌드하도록 구성되어 있다.

```json
"build": "npm run build --workspace=@mfe/design-system && webpack --mode production"
```

`catalog-remote`나 `cart-remote`만 재배포해도 `host`는 그대로 두면 되며(재배포 불필요),
런타임에 `remoteEntry.js`를 통해 변경 사항이 즉시 반영된다.

## 새 Remote 추가하기

커스텀 제너레이터로 remote 하나를 통째로 생성한다. 이름/포트/첫 페이지 정보를 물어보고
`apps/<name>-remote`를 완성된 상태로 만들고, `apps/host/src/remotes.config.js`에도
자동으로 등록한다.

```bash
npx turbo gen remote
```

생성 후 사람이 직접 할 일은 이 두 가지뿐이다:

- `npm install` (저장소 루트에서, 새 워크스페이스 링크를 인식시키기 위해)
- `apps/host/src/remotes.config.js`에 자동으로 채워진 `prodUrl` 플레이스홀더를
  Vercel 배포 후 실제 URL로 교체

첫 프롬프트(이름)에는 `remote` 접미사를 빼고 입력한다(예: `order`, `wishlist`). 폴더명
(`apps/order-remote`)과 Module Federation 컨테이너 이름(`order_remote`)에 `-remote`/
`_remote`가 자동으로 붙기 때문에, `order-remote`처럼 이미 접미사가 붙은 값을 입력하면
컨테이너 이름이 `order_remote_remote`처럼 중복된다 — 이 경우 제너레이터가 바로 막아준다.

`webpack.config.js`의 `devServer.port`/`ModuleFederationPlugin` `name`, 첫 페이지
컴포넌트와 그 옆의 `<PageName>.meta.js`(라우팅 메타: `path`/`label`/`nav`)까지 전부
프롬프트 답변으로 채워진 채 생성된다. 포트는 이미 쓰이고 있는 포트와 겹치면 제너레이터가
바로 알려준다. 제너레이터 정의는 `turbo/generators/config.ts`, 템플릿은
`turbo/generators/templates/remote/`에 있다.

새 remote에 페이지를 더 추가하고 싶으면(2번째 페이지부터), `src/pages/`에 컴포넌트와
`<PageName>.meta.js`(`module.exports = { path: "/wishlist", label: "위시리스트", nav: true }`
형태, `nav` 생략 시 기본값 `true`)를 직접 추가하면 된다 — exposes는 `src/pages/` 폴더를
스캔해 자동 생성되므로(`packages/webpack-utils`의 `buildPageExposes` 참고) 별도 등록이
필요 없다.

**host의 `webpack.config.js`, `pages.tsx`, `bootstrap.tsx`는 건드릴 필요가 없다.**
빌드 시 각 remote는 `src/pages/`를 스캔해 `dist/pages-manifest.json`을 함께
배포하고(`packages/webpack-utils`의 `buildPagesManifest`/`PagesManifestPlugin`
참고), host는 접속 시점에 `remotes.config.js`에 등록된 remote들의
`pages-manifest.json`을 fetch해서 라우트/네비게이션을 그때그때 조립한다. 그래서
새 remote의 페이지 추가·변경은 host 재배포 없이 즉시 반영되고, remote 하나가
응답하지 않아도(배포 중이거나 장애 상황) 그 remote의 페이지만 빠질 뿐 host
전체가 죽지 않는다. 그 대신 host는 remote가 실제로 내려주는 컴포넌트의 타입을
컴파일 타임에 검증하지 않으므로, 페이지가 실제로 뜨는지는 배포 후 눈으로
확인하거나 별도 스모크 테스트로 확인해야 한다.

공유 설정(Tailwind 토큰 등)은 `packages/design-system`의 프리셋을 그대로 상속받으므로
별도 작업이 필요 없다.

## 커밋 메시지 규칙

```
<타입>: <제목> (50자 이내, 마침표 없이)

본문(선택) — 무엇을·왜 바꿨는지. '어떻게'는 diff가 설명하니 생략.
```

타입: `feat` `fix` `refactor` `test` `docs` `chore` `style` `perf` `asset`

## 스크립트

```bash
npm run build    # turbo run build
npm run test      # turbo run test
npm run lint      # turbo run lint
```

## 기술 스택

- Webpack 5 Module Federation
- React 19
- TypeScript
- Tailwind CSS
- Jest + React Testing Library
- Turborepo (npm workspaces)
- Vercel (앱별 독립 배포)
