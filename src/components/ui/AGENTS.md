# Padrões de Componentes UI

## Estrutura de Arquivos

- Componentes genéricos ficam em `src/components/ui/`
- Cada componente tem seu próprio arquivo: `src/components/ui/component-name.tsx`

## Padrões de Implementação

### 1. Use Tailwind Variants

```tsx
import { tv, type VariantProps } from "tailwind-variants";

const componentName = tv({
  base: "classes base sempre aplicadas",
  variants: {
    variant: {
      default: "classes para variante default",
      secondary: "classes para variante secondary",
    },
    size: {
      sm: "classes para tamanho small",
      md: "classes para tamanho medium",
      lg: "classes para tamanho large",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});
```

### 2. Use twMerge para estilos em objetos

Quando usar objetos de estilos (não tv), use `twMerge` para mesclar classes:

```tsx
import { twMerge } from "tailwind-merge";

const styles = {
  base: "flex items-center gap-2",
};

export const Component = forwardRef<HTMLDivElement, Props>(
  ({ className, ...props }, ref) => {
    return (
      <div className={twMerge(styles.base, className)} ref={ref} {...props} />
    );
  },
);
```

### 3. Use tv() para variantes

O `tailwind-variants` já faz o merge automaticamente. Passe `className` diretamente:

```tsx
export const ComponentName = forwardRef<HTMLButtonElement, ComponentNameProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <element
        className={componentName({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  },
);
```

### 4. Estenda propriedades nativas

```tsx
import { type ElementHTMLAttributes, forwardRef } from "react";

export interface ComponentNameProps
  extends ElementHTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentName> {}
```

### 5. Use named exports

```tsx
// ✅ Correto
export const Button = forwardRef<...>(...)

// ❌ Errado
export default Button
```

### 6. forwardRef para refs

Sempre use `forwardRef` para permitir ref forwarding:

```tsx
export const ComponentName = forwardRef<HTMLElementType, ComponentNameProps>(
  ({ className, ...props }, ref) => {
    return <element ref={ref} className={...} {...props} />;
  },
);

ComponentName.displayName = "ComponentName";
```

### 7. Biome/Lint

- Use `npm run lint:biome` para verificar erros
- Se o Biome mostrar warning `suggestCanonicalClasses`, use a classe simplificada:
  - ❌ `text-(--color-white)` ou `text-[var(--color-white)]`
  - ✅ `text-white`

### 8. Fontes

- Texto sem serifa: use a fonte padrão do sistema (não precisa de classe)
- Texto monospaced: use `font-[family-name:var(--font-jetbrains-mono)]` (defina a fonte em `layout.tsx` com `next/font/google`)

### 9. Bibliotecas Externas

- Componentes com comportamento (Toggle, etc): use `@radix-ui/react-*`
- Syntax highlighting: use `shiki` com tema `vesper` (componente de servidor)
