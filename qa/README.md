# Verificação do portfólio

O site público é estático e não depende de bibliotecas JavaScript, fontes externas ou rastreadores. As dependências desta pasta são usadas apenas para testes; não são carregadas pelo site.

## Executar

Com Node.js instalado, nesta pasta:

```sh
npm install --ignore-scripts
npm test
```

## Cobertura

- Estrutura do HTML, IDs únicos, referências ARIA, âncoras e nomes de botões.
- Foto incorporada e referências aos arquivos publicados.
- WhatsApp, e-mail, LinkedIn e proteção dos links em nova aba.
- Sintaxe do CSS, tamanhos mínimos de texto e regras de adaptação e movimento reduzido.
- Cálculos dos gráficos e os 21 estados de cenário/mês.
- Filtros, detalhes de soluções, contatos e restauração do foco ao fechar.
- Menu móvel, Escape e mudanças de largura simuladas.
- Pausa e retomada das animações, preferência do dispositivo e armazenamento indisponível.
- Interrupção do desenho fora da tela ou com a página oculta.
- Interações de toque e ponteiro fino, ausência de canvas e recursos opcionais.

## Limites

Os testes usam uma simulação de DOM com LinkeDOM. Não renderizam o layout nem substituem testes visuais, de zoom, leitor de tela ou dispositivos reais em Chrome, Safari e Firefox. As dimensões informadas no teste validam as decisões de código, não o posicionamento visual dos elementos.

Os gráficos e as prévias do portfólio usam dados fictícios. Seus valores não representam resultados de clientes ou relatórios Power BI entregues.
