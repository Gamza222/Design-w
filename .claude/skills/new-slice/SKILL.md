---
name: new-slice
description: Скаффолд нового FSD-слайса (widgets / features / entities) — UI-компонент, SCSS-модуль и public API через index.ts. Используй, когда нужно создать новый слой/слайс по правилам Feature-Sliced Design.
---

# new-slice — новый FSD-слайс

Создаёт слайс в одном из слоёв `widgets | features | entities` с public API через `index.ts`.
`pages` и `shared/ui` имеют свою специфику — для них этот скил не используется.

## Параметры (спроси, если не заданы)
- **layer**: `widgets` | `features` | `entities`
- **slice**: kebab-case имя слайса (напр. `testimonials`, `cookie-banner`, `review`)
- **Component**: PascalCase имя компонента (напр. `Testimonials`)

## Шаги
1. Создай файлы:
   - `src/<layer>/<slice>/ui/<Component>/<Component>.tsx`
   - `src/<layer>/<slice>/ui/<Component>/<Component>.module.scss`
   - `src/<layer>/<slice>/index.ts` — **public API** (единственная точка входа в слайс)
   - для `entities` дополнительно `model/types.ts` (и при необходимости `api/<slice>s.ts`)
2. Импорты — только через alias и public API нижних слоёв (`@shared`, `@entities`, `@widgets`),
   без deep-путей. Направление импортов строго вниз (см. CLAUDE.md → FSD).
3. Прогони `npm run lint:fsd` — Steiger не должен ругаться на границы.

## Шаблоны

`index.ts`:
```ts
export { <Component> } from './ui/<Component>/<Component>';
```

`ui/<Component>/<Component>.tsx`:
```tsx
import styles from './<Component>.module.scss';

interface <Component>Props {
  className?: string;
}

export function <Component>({ className }: <Component>Props) {
  return <div className={className}>…</div>;
}
```

`ui/<Component>/<Component>.module.scss`:
```scss
.root {
  // используйте семантические токены: var(--color-text), var(--space-4) и т.д.
}
```

`model/types.ts` (только для entities):
```ts
export interface <Component> {
  id: string;
}
```

## Проверка
- Файл подключается через `import { <Component> } from '@<layer>/<slice>'`.
- `npm run lint:fsd && npm run typecheck` — зелёные.
