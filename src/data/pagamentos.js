const DINHEIRO = 0.05;
const CREDITO = 0.03;

const pagamento = {
  pagamentos: [
    {
      tipo: "dinheiro",
      valor: function (valor) {
        return valor - valor * DINHEIRO;
      },
    },
    {
      tipo: "debito",
      valor: function (valor) {
        return valor;
      },
    },
    {
      tipo: "credito",
      valor: function (valor) {
        return valor + valor * CREDITO;
      },
    },
  ],
};

export default pagamento;
