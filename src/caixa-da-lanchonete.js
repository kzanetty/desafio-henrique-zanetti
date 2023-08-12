import itens from "./data/itens.js";
import mensagens from "./data/mensagens.js";
import metodosDePagamento from "./data/pagamentos.js";

class CaixaDaLanchonete {
  calcularValorDaCompra(metodoDePagamento, itens) {
    const validacaoInicial = validacoesIniciais(metodoDePagamento, itens);
    if (validacaoInicial.error) return validacaoInicial.mensagem;

    const resultadoFinal = calcularCompra(metodoDePagamento, itens);

    if (resultadoFinal.error) {
      return resultadoFinal.mensagem;
    }
    return `R$ ${resultadoFinal.valor.toFixed(2).replace(".", ",")}`;
  }
}

function calcularCompra(metodoDePagamento, arrayDeItens) {
  let somaDoValorDosItens = 0;
  let error = false;
  let mensagem = "";

  const formaDePagamento = GetFormaDePagamento(metodoDePagamento);

  for (let i = 0; i < arrayDeItens.length; i++) {
    const codigoItem = arrayDeItens[i].split(",")[0];
    const quantidade = arrayDeItens[i].split(",")[1];
    ("");

    const item = GetItem(codigoItem);
    let itemValido = ValidarAcompanhamento(arrayDeItens, item);
    if (!itemValido) {
      error = true;
      mensagem = mensagens.EXTRA_SEM_PRINCIPAL;
    }

    somaDoValorDosItens += item.valor * quantidade;
  }

  if (error) return { error, mensagem };

  return { error: false, valor: formaDePagamento.valor(somaDoValorDosItens) };
}

function ValidarAcompanhamento(itensNoCarrinho, itemAcompanhamento) {
  if (!itemAcompanhamento.acompanhamento) return true;
  if (itemAcompanhamento.acompanhamento) {
    return itensNoCarrinho.some((itemDoCarrinho) => {
      const codigoItem = itemDoCarrinho.split(",")[0];
      return itens.some((item) => {
        if (item.codigo === codigoItem) {
          return item.extras.includes(itemAcompanhamento.codigo);
        }
      });
    });
  }

  return false;
}

function GetItem(codigoItem) {
  return itens.find((item) => {
    return item.codigo === codigoItem;
  });
}

function GetFormaDePagamento(metodoDePagamento) {
  return metodosDePagamento.pagamentos.find(
    (pagamento) => pagamento.tipo === metodoDePagamento
  );
}

function validacoesIniciais(metodoDePagamento, itens) {
  if (ChecarSeCarinhoEstaVazio(itens)) {
    return {
      error: true,
      mensagem: mensagens.CARRINHO_VAZIO,
    };
  }

  if (!ChecarSeMetodoDePagamentoExiste(metodoDePagamento)) {
    return {
      error: true,
      mensagem: mensagens.TIPO_PAGAMENTO_INVALIDO,
    };
  }

  if (!ChecarSeTodoItensTemPeloMenosQuantiaMinima(itens)) {
    return {
      error: true,
      mensagem: mensagens.QUANTIA_INVALIDA,
    };
  }

  if (!ChecarSeTodosItensExistem(itens)) {
    return {
      error: true,
      mensagem: mensagens.ITEM_INVALIDO,
    };
  }

  return { error: false };
}

function ChecarSeCarinhoEstaVazio(itensDoCarrinho) {
  return itensDoCarrinho.length < 1;
}

function ChecarSeMetodoDePagamentoExiste(metodoDePagamento) {
  return metodosDePagamento.pagamentos.find(
    (pagamento) => pagamento.tipo === metodoDePagamento
  );
}

function ChecarSeTodoItensTemPeloMenosQuantiaMinima(itensDoCarrinho) {
  const QUANTIA_MINIMA_DE_ITENS = 1;
  for (let i = 0; i < itensDoCarrinho.length; i++) {
    const quantidade = itensDoCarrinho[i].split(",")[1];
    if (quantidade < QUANTIA_MINIMA_DE_ITENS) return false;
  }
  return true;
}

function ChecarSeTodosItensExistem(itensDoCarrinho) {
  for (let i = 0; i < itensDoCarrinho.length; i++) {
    const itemSelecionado = itensDoCarrinho[i].split(",")[0];
    const resultado = itens.some((item) => item.codigo === itemSelecionado);
    if (!resultado) return false;
  }
  return true;
}

export { CaixaDaLanchonete };
