# federated-storefront

Webpack5 Module Federation으로 구성한 마이크로 프론트엔드(MFE) 튜토리얼 저장소.
Turborepo 기반 모노레포로, host 셸이 여러 remote 앱을 런타임에 조합한다.

## 구조

```
apps/
  host/             셸 앱 — catalog-remote/cart-remote를 탭으로 전환하며 소비 (:3000)
  remote/            Button/Card/Modal 컴포넌트 실험용 원본 (참고용 보존, :3001)
  catalog-remote/    상품 목록 화면 (TypeScript, :3003)
  cart-remote/       장바구니 화면 (TypeScript, :3004)
packages/
  design-system/     공용 컴포넌트(@mfe/design-system) — Button/Card/Modal, Tailwind 기반
```

- `apps/remote`는 초기 Module Federation 실습 단계에서 만든 앱으로, 컴포넌트는 이후
  `packages/design-system`으로 옮겨졌다. 더 이상 host가 소비하지 않으며 참고용으로만 남아 있다.
- 디자인 토큰은 Primitive(색상/폰트 원자값) → Semantic(용도별 별칭) 2단계 구조로
  `tailwind.config.js`에 정의되어 있다.

## 시작하기

```bash
npm install
npm run dev     # turbo run dev — 모든 앱을 동시에 실행
```

앱별로 개별 실행하려면:

```bash
npm run dev --workspace=host
npm run dev --workspace=catalog-remote
npm run dev --workspace=cart-remote
```

| 앱               | 포트 | 역할                              |
| ---------------- | ---- | --------------------------------- |
| host              | 3000 | 라우팅 셸, remote 조합             |
| remote            | 3001 | (참고용) 컴포넌트 실험 원본        |
| catalog-remote    | 3003 | 상품 목록                          |
| cart-remote       | 3004 | 장바구니                           |

host를 열기 전에 catalog-remote, cart-remote가 먼저 떠 있어야
`remoteEntry.js`를 정상적으로 불러올 수 있다.

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
