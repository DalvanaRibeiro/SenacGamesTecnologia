# Senac Tech Games — São Leopoldo | Tecnologia

Plataforma React + TypeScript + Vite com dois jogos. Node.js 20.19+ ou 22.12+ recomendado.

## Executar

```sh
npm install
npm run dev
```

## Deploy Vercel

Envie esta pasta para um repositório GitHub e importe na Vercel. Framework Vite, build `npm run build`, saída `dist`. Não há variáveis de ambiente. A câmera exige HTTPS ou localhost. Os modelos MediaPipe e WASM são carregados de CDN, portanto exigem internet.

## Jogos

- Tech Mario: levante a mão direita acima do ombro e abaixe antes de repetir. Modo teclado (espaço/seta para cima) ou botão Saltar. Três vidas, moedas, obstáculos, velocidade crescente e recorde local ao finalizar. Arte desenhada no Canvas, sem sprites oficiais.
- Tech Vision: 39 acessórios SVG, cinco categorias, gesto de pinça para arrastar até o rosto, ajuste por categoria de 50–200%, fotografia PNG, seleção alternativa por mouse.
- Voltar ao menu encerra a câmera e libera os modelos. A câmera é processada localmente.

## Organização

`src/main.tsx`: menu e navegação; `TechMario.tsx`: jogo e pose; `TechVision.tsx`: realidade aumentada; `vision.ts`: modelos faciais e mãos; `accessories.ts`: catálogo SVG; `style.css` e `games.css`: estilos.

O arquivo `public/senac.svg` é uma representação provisória; substitua pelo logotipo institucional oficial. Teste ambos os jogos com a webcam e conexão do evento antes de publicar. O jogo Mario foi reconstruído, não recuperado do ZIP antigo.

## Atualização 1.1 — Tech Mario
- Rastreamento em cada novo frame de vídeo, sem intervalo artificial de 65 ms.
- GPU quando disponível, com fallback CPU; modelo Pose Lite.
- Webcam espelhada com esqueleto, mão direita destacada e linha de salto.
- Limiar de gesto reduzido, histerese e buffer de salto de 160 ms.
- O Tech Vision permanece inalterado. A inferência ainda roda na thread principal; desempenho depende do equipamento.

## Versão 1.2 — Tech Robot
Personagem robótico próprio. Modelo Pose Lite em Web Worker, CPU, com fallback para inferência na thread principal (GPU/CPU). Apenas um frame em trânsito, redimensionado para 320×240. Esqueleto verde sobre webcam atualizada independentemente; pontos podem atrasar em relação ao vídeo. Indicador de tempo de inferência (não latência ponta a ponta). Gesto com limiar proporcional à largura dos ombros e histerese. Tech Vision preservado. Testar câmera e build antes da exposição. Modelos externos requerem internet.

## Versão 1.3
- Corrige envio de init ao worker de pose; tenta GPU e recorre à CPU.
- Captura 320×240, gesto com histerese e buffer de 220 ms.
- Tech Vision: selecione e vista um item; faça duas pinças, aproxime ou afaste as mãos, solte ambas para confirmar. Escala 50–200%.
- Requer teste real de câmera e build após npm install.

## Atualização 1.4 — Tech Robot por punho
O Tech Robot usa Hand Landmarker (uma mão) em vez de Pose Landmarker. Abra a mão (até um dedo dobrado) para armar; feche pelo menos três dos quatro dedos longos para saltar. O polegar não interfere. O gesto dispara uma única vez e exige reabertura. O painel exibe os 21 pontos e conexões verdes. O Tech Vision permanece inalterado. As dependências e modelos precisam de internet na primeira execução. Teste com webcam antes do evento.
