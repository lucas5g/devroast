# Spec: Direct OG Image Link Sharing for DevRoast

## 1. Overview
Esta especificação descreve a mudança na funcionalidade de compartilhamento do DevRoast. Ao clicar em "share_roast", o link gerado e compartilhado agora apontará diretamente para a imagem OpenGraph (OG) gerada dinamicamente, em vez da página de visualização do roast.

## 2. Technical Scope
- **Componente:** `src/components/share-button.tsx`
- **Contexto:** Botão de compartilhamento na página `src/app/roast/[id]/page.tsx`.
- **Destino:** Endpoint da imagem OG: `/roast/[id]/opengraph-image`.

## 3. Implementation Details
O componente `ShareButton` deve ser atualizado para refletir as seguintes mudanças na função `handleShare`:

- **URL de Compartilhamento:** A constante `shareUrl` deixará de ser `${window.location.origin}/roast/${roastId}` e passará a ser `${window.location.origin}/roast/${roastId}/opengraph-image`.
- **Clipboard:** O texto copiado para a área de transferência será a nova `shareUrl` (link direto da imagem).
- **Native Sharing:** Ao usar `navigator.share`, a `url` enviada será a `shareUrl` atualizada.
- **Fallback:** O comportamento de fallback (cópia manual) deve usar a nova URL.

## 4. Why This Approach?
O usuário solicitou explicitamente que ao clicar no botão, o link gerado aponte para a imagem OG. Isso permite que o usuário receba diretamente o link do arquivo gerado, o que é útil para compartilhamento rápido em plataformas onde o preview automático pode falhar ou onde o usuário deseja apenas o asset visual.

## 5. Verification
- Clicar no botão e verificar se o link copiado para o clipboard termina em `/opengraph-image`.
- Testar o compartilhamento nativo em dispositivos móveis (se disponível) para garantir que a URL enviada é a correta.
- Verificar se a imagem continua sendo anexada corretamente como arquivo (se suportado pelo navegador).
