import { CaixaDaLanchonete } from "./caixa-da-lanchonete.js";

describe("CaixaDaLanchonete", () => {
  const validaTeste = (formaDePagamento, resultadoEsperado, itens) => {
    const resultado = new CaixaDaLanchonete().calcularValorDaCompra(
      formaDePagamento,
      itens
    );

    expect(resultado.replace("\xa0", " ")).toEqual(resultadoEsperado);
  };

  test.each([
    [
      "com carrinho vazio",
      "dinheiro",
      "Não há itens no carrinho de compra!",
      [],
    ],
    [
      "com carrinho vazio",
      "credito",
      "Não há itens no carrinho de compra!",
      [],
    ],
    ["com carrinho vazio", "debito", "Não há itens no carrinho de compra!", []],
  ])(
    "compra %p em %p deve resultar em %p",
    (_, formaDePagamento, resultadoEsperado, itens) =>
      validaTeste(formaDePagamento, resultadoEsperado, itens)
  );

  test.each([
    ["dinheiro", "R$ 2,85", ["cafe,1"]],
    ["credito", "R$ 3,09", ["cafe,1"]],
    ["debito", "R$ 3,00", ["cafe,1"]],
  ])("compra simples em %p deve resultar em %p", validaTeste);

  test.each([
    ["credito", "R$ 11,85", ["cafe,1", "sanduiche,1", "queijo,1"]],
    ["debito", "R$ 11,50", ["cafe,1", "sanduiche,1", "queijo,1"]],
  ])("compra de 3 itens em %p deve resultar em %p", validaTeste);

  test.each([
    ["dinheiro", "R$ 33,73", ["cafe,4", "sanduiche,3", "queijo,2"]],
    ["credito", "R$ 36,56", ["cafe,4", "sanduiche,3", "queijo,2"]],
    ["debito", "R$ 35,50", ["cafe,4", "sanduiche,3", "queijo,2"]],
  ])("compra de múltiplas quantidades em %p deve resultar em %p", validaTeste);

  test.each([
    ["com quantidade zero", "dinheiro", "Quantidade inválida!", ["cafe,0"]],
    ["com um valor", "credito", "Item inválido!", ["1"]],
    ["com código inexistente", "debito", "Item inválido!", ["pizza, 1"]],
    [
      "com forma de pagamento inválida",
      "especie",
      "Forma de pagamento inválida!",
      ["cafe, 1"],
    ],
  ])(
    "compra %p em %p deve resultar em %p",
    (_, formaDePagamento, resultadoEsperado, itens) =>
      validaTeste(formaDePagamento, resultadoEsperado, itens)
  );

  test.each([
    [
      "chantily",
      "dinheiro",
      "Item extra não pode ser pedido sem o principal",
      ["chantily,1"],
    ],
    [
      "queijo",
      "credito",
      "Item extra não pode ser pedido sem o principal",
      ["queijo,1"],
    ],
    [
      "chantily com outro item",
      "credito",
      "Item extra não pode ser pedido sem o principal",
      ["chantily,1", "sanduiche,1"],
    ],
    [
      "queijo com outro item",
      "debito",
      "Item extra não pode ser pedido sem o principal",
      ["cafe,1", "queijo,1"],
    ],
  ])(
    "compra %p em %p deve resultar em %p",
    (_, formaDePagamento, resultadoEsperado, itens) =>
      validaTeste(formaDePagamento, resultadoEsperado, itens)
  );

  // Testes extras - Testando combos

  test.each([
    ["credito", "R$ 15,96", ["combo1,1", "cafe,2"]],
    ["debito", "R$ 15,50", ["combo1,1", "cafe,2"]],
    ["dinheiro", "R$ 14,72", ["combo1,1", "cafe,2"]],
  ])("compra de 1 combo1 e 2 cafes em %p deve resultar em %p", validaTeste);

  // Os seguintes valores foram arredondados para cima a fim de evitar possíveis erros futuros, mantendo a função de validação do teste inalterada (conforme descrito no README):
  // R$ 9,78, R$ 9,02 e R$ 7,12 foram arredondados uma casa decimal para cima.
  test.each([
    ["debito", "R$ 9,50", ["combo1,1"]],
    ["credito", "R$ 9,79", ["combo1,1"]],
    ["dinheiro", "R$ 9,03", ["combo1,1"]],
    ["debito", "R$ 7,50", ["combo2,1"]],
    ["credito", "R$ 7,72", ["combo2,1"]],
    ["dinheiro", "R$ 7,13", ["combo2,1"]],
  ])("compra de 1 combo em %p deve resultar em %p", validaTeste);

  test.each([
    ["debito", "R$ 14,00", ["combo1,1", "cafe,1", "chantily,1"]],
    ["credito", "R$ 18,54", ["combo1,1", "sanduiche,1", "queijo,1"]],
    ["dinheiro", "R$ 13,30", ["combo1,1", "cafe,1", "chantily,1"]],
    ["debito", "R$ 16,00", ["combo2,1", "sanduiche,1", "queijo,1"]],
    ["credito", "R$ 12,36", ["combo2,1", "cafe,1", "chantily,1"]],
    ["dinheiro", "R$ 15,20", ["combo2,1", "sanduiche,1", "queijo,1"]],
  ])(
    "compra de 1 combo, um item principal e um extra em %p deve resultar em %p",
    validaTeste
  );

  test.each([
    [
      "chantily",
      "dinheiro",
      "Item extra não pode ser pedido sem o principal",
      ["combo1,1", "chantily,1"],
    ],
    [
      "queijo",
      "credito",
      "Item extra não pode ser pedido sem o principal",
      ["combo2,5", "queijo,1"],
    ],
    [
      "queijo e chantily",
      "credito",
      "Item extra não pode ser pedido sem o principal",
      ["combo2,5", "combo1,3", "queijo,1", "chantily,1"],
    ],
  ])(
    "compra de item extra %p em %p, quando o principal existe apenas no combo, deve resultar em %p",
    (_, formaDePagamento, resultadoEsperado, itens) =>
      validaTeste(formaDePagamento, resultadoEsperado, itens)
  );
});
