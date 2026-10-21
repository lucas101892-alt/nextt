# TODO

- [x] **Página de pagamento da matrícula**
  - O site oferece uma página de checkout demonstrativo integrada à identidade visual existente da NEXT FIGHT.
  - O checkout permite selecionar um plano de matrícula entre Plano Básico, Plano Fighter e Plano Profissional.
  - O checkout coleta nome, e-mail, CPF e celular do aluno.
  - O checkout permite escolher Cartão ou Pix como método de pagamento demonstrativo.
  - Os campos de pagamento mudam conforme o método escolhido e não enviam dados a gateways nem realizam cobranças.
  - O checkout exibe o resumo do pedido com plano, valores e forma de pagamento antes da conclusão.
  - O navegador valida campos obrigatórios e dados inválidos com mensagens claras, incluindo máscaras para CPF, celular, cartão e validade.
  - Após um envio válido, a interface mostra uma confirmação visual de matrícula e deixa explícito que é uma demonstração.
  - A página é responsiva e preserva a identidade visual já existente.
  - Evidências: `node --check script.js`, manifesto de rotas entregue com HTTP 200, arquivos estáticos entregues com HTTP 200 e revisão visual desktop/mobile concluída.
