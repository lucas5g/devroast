# Padrões Components

## Estrutura

```
src/components/
├── ui/                 # Componentes genéricos reutilizáveis
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
├── code-editor/        # Feature de code editor
│   ├── CodeEditor.tsx
│   ├── hooks/
│   └── utils/
├── home-content.tsx    # Componentes específicos de páginas
└── metrics.tsx
```

## UI Components

Use os padrões documentados em `ui/AGENTS.md`:

- tv() + twMerge para estilos
- forwardRef para refs
- Named exports
- Props estendem atributos nativos
- @radix-ui/react-* para componentes com estado

## Feature Components

Componentes específicos de features podem ter sua própria estrutura:

- `code-editor/`: Estrutura com hooks, utils separados
- Cada feature em subdiretório próprio
