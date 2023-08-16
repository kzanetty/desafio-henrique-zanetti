export const itensPrincipais = [
  {
    codigo: "cafe",
    descricao: "Café",
    valor: 3,
  },

  {
    codigo: "suco",
    descricao: "Suco Natural",
    valor: 6.2,
  },
  {
    codigo: "sanduiche",
    descricao: "Sanduíche",
    valor: 6.5,
  },

  {
    codigo: "salgado",
    descricao: "Salgado",
    valor: 7.25,
  },
];

export const itensExtra = [
  {
    codigo: "queijo",
    descricao: "Queijo (extra do Sanduíche)",
    valor: 2,
    combinaCom: ["sanduiche"],
  },
  {
    codigo: "chantily",
    descricao: "Chantily (extra do Café)",
    valor: 1.5,
    combinaCom: ["cafe"],
  },
];

export const itensCombos = [
  {
    codigo: "combo1",
    descricao: "1 Suco e 1 Sanduíche",
    valor: 9.5,
    acompanhamento: false,
    extras: [],
    principal: [],
    combo: true,
    itens: [
      itensPrincipais.find((item) => item.codigo === "suco"),
      itensPrincipais.find((item) => item.codigo === "sanduiche"),
    ],
  },
  {
    codigo: "combo2",
    descricao: "1 Café e 1 Sanduíche",
    valor: 7.5,
    acompanhamento: false,
    extras: [],
    principal: [],
    combo: true,
    itens: [
      itensPrincipais.find((item) => item.codigo === "cafe"),
      itensPrincipais.find((item) => item.codigo === "sanduiche"),
    ],
  },
];
