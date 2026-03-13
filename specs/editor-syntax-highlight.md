# Especificação: Editor de Código com Syntax Highlight

## 1. Visão Geral do Problema

O objetivo é implementar um editor de código na homepage que permita aos usuários colar trechos de código e visualizar com syntax highlight automático baseado na linguagem detectada. O sistema deve oferecer detecção automática de linguagem com opção de seleção manual pelo usuário.

## 2. Análise de Referência: Ray-So

### 2.1 Stack Utilizado
O Ray-So (github.com/raycast/ray-so) utiliza:

- **highlight.js** (v11.7.0): Para detecção automática de linguagem
- **shiki** (v1.0.0): Para renderização de alta qualidade do syntax highlight
- **React 19** + **Next.js 16**

### 2.2 Abordagem do Ray-So
- Usa highlight.js para detectar automaticamente a linguagem quando o usuário cola o código
- Usa shiki para renderizar o código com cores de alta qualidade (mesmo mecanismo do VS Code)
- Separa a detecção (highlight.js) da renderização (shiki) para melhor precisão

## 3. Opções de Bibliotecas Analisadas

### 3.1 Syntax Highlight (apenas renderização)

| Biblioteca | Tamanho (min+gzip) | Qualidade | Performance | Detecção Auto |
|------------|-------------------|-----------|--------------|---------------|
| **Shiki** | ~280KB | Excelente (VS Code) | 3.5-5ms/bloco | Não |
| **Highlight.js** | ~16KB | Boa | 1.1-1.4ms/bloco | Sim |
| **Prism.js** | ~12KB | Boa | 0.5-0.7ms/bloco | Não |

### 3.2 Editores Completos (com input)

| Biblioteca | Tamanho | Uso typical | Mobile | Extensibilidade |
|------------|---------|-------------|--------|----------------|
| **Monaco Editor** | 2-6MB | IDE web | Não | Média |
| **CodeMirror 6** | 150KB-1MB | Editor leve | Sim | Alta |
| **react-simple-code-editor** | ~10KB | Snippets | Sim | Baixa |

### 3.3 Detecção Automática de Linguagem

| Método | Precisão | Tamanho | Notas |
|--------|----------|---------|-------|
| **highlight.js.highlightAuto()** | ~72% | Incluído | Requer +300 chars |
| **guesslang (TensorFlow.js)** | ~90% | ~2MB | ML-based, heavier |
| **highlight.js com languages reduzidas** | ~80% | Variável | Melhor custo-benefício |

## 4. Recomendação de Arquitetura

### 4.1 Abordagem Híbrida (Recomendada)
Inspirada no Ray-So:

1. **Detecção**: Usar `highlight.js` com `highlightAuto()` para detectar a linguagem
2. **Renderização**: Usar `shiki` (já incluso no projeto) para renderizar com alta qualidade
3. **Input**: Usar `react-simple-code-editor` ou textarea simples para input

### 4.2 Alternativa Simplificada
Se o foco é apenas exibir código com highlight (sem necessidade de edição complexa):

- Usar `react-syntax-highlighter` que combina Prism/Highlight.js
- Detecção automática via `highlight.js`

### 4.3 Alternativa Completa (IDE-like)
Se o usuário precisar de edição avançada:

- Usar `@monaco-editor/react` (Monaco Editor wrapper)
- Detecção automática via highlight.js antes de passar para o Monaco

## 5. Especificação Funcional

### 5.1 Requisitos do Componente

#### 5.1.1 Área de Input
- Textarea ou editor simples para o usuário colar código
- Suporte a paste de código de qualquer fonte
- Mantém formatação original (indentação, tabs)

#### 5.1.2 Detecção Automática
- Ao colar código, detectar automaticamente a linguagem
- Usar `highlight.js.highlightAuto()` com subset de linguagens comuns
- Exibir linguagem detectada para confirmação do usuário

#### 5.1.3 Seleção Manual
- Dropdown para selecionar linguagem manualmente
- Sobrescrever detecção automática quando selecionado
- Lista de linguagens populares: JavaScript, TypeScript, Python, Rust, Go, Java, C++, HTML, CSS, JSON, SQL, Shell/Bash, Markdown

#### 5.1.4 Renderização
- Usar shiki para renderizar com cores de temas VS Code
- Suporte a temas dark/light (seguir preferência do sistema)
- Exibir código com linha de números opcional

### 5.2 Fluxo de Uso

```
1. Usuário cola código na área de input
2. Sistema detecta linguagem automaticamente via highlight.js
3. Código é renderizado via shiki com tema apropiado
4. Usuário pode alterar linguagem manualmente via dropdown
5. Código final pode ser copiado/exportado
```

### 5.3 Estados do Componente

| Estado | Descrição |
|--------|-----------|
| `empty` | Nenhum código inserido |
| `loading` | Detectando linguagem |
| `detected` | Código com detecção automática |
| `manual` | Código com linguagem selecionada manualmente |
| `error` | Erro na detecção (fallback para plaintext) |

## 6. Dependências Necessárias

### 6.1 Instalação Adicional
```bash
npm install highlight.js react-simple-code-editor
# ou
npm install @monaco-editor/react  # se preferir Monaco
```

### 6.2 Dependências Existentes (já no projeto)
- `shiki` (já instalado)
- `react`, `next` (já instalados)

## 7. Estrutura de Componentes Proposta

```
src/
└── components/
    └── code-editor/
        ├── CodeEditor.tsx       # Componente principal
        ├── LanguageSelector.tsx # Dropdown de seleção
        ├── CodeDisplay.tsx      # Renderização com shiki
        ├── hooks/
        │   ├── useLanguageDetection.ts
        │   └── useCodeHighlight.ts
        └── utils/
            └── languageMap.ts    # Mapeamento de linguagens
```

## 8. Interface Proposta

```typescript
interface CodeEditorProps {
  initialCode?: string;
  onCodeChange?: (code: string, language: string) => void;
  showLanguageSelector?: boolean; // default: true
  showLineNumbers?: boolean;       // default: false
  defaultLanguage?: string;        // força linguagem inicial
  theme?: 'dark' | 'light' | 'system';
  placeholder?: string;
}
```

## 9. Considerações de Performance

- **SSR**: Shiki funciona bem com Next.js (pode ser usado em server components)
- **Client-side**: Carregar linguagens sob demanda
- **Cache**: Criar highlighter único e reutilizá-lo
- **Worker**: Para detecção em código grande, considerar Web Worker

## 10. Próximos Passos para Implementação

1. Instalar dependências (`highlight.js`)
2. Criar hook `useLanguageDetection` com highlight.js
3. Criar componente `CodeEditor` com input e visualização
4. Integrar shiki para renderização
5. Adicionar seletor de linguagem
6. Testar com diversas linguagens

## 11. Perguntas em Aberto

- O editor será apenas para visualização ou o usuário precisará editar o código?
- Qual o tamanho máximo esperado de código (para performance)?
- Precisa de suporte a mobile?
- O tema deve ser fixo ou seguir preferência do usuário?
