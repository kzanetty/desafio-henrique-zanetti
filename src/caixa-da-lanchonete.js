import mensagens from "./data/mensagens.js";
import metodosDePagamento from "./data/pagamentos.js";
import { itensPrincipais, itensExtra, itensCombos } from "./data/cardapio.js";

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

  const formaDePagamento = getFormaDePagamento(metodoDePagamento);

  for (let i = 0; i < arrayDeItens.length; i++) {
    const codigoItem = arrayDeItens[i].split(",")[0];
    const quantidade = arrayDeItens[i].split(",")[1];
    ("");

    const item = getItem(codigoItem);
    let itemValido = validarAcompanhamento(arrayDeItens, item);
    if (!itemValido) {
      error = true;
      mensagem = mensagens.EXTRA_SEM_PRINCIPAL;
    }

    somaDoValorDosItens += item.valor * quantidade;
  }

  if (error) return { error, mensagem };

  return { error: false, valor: formaDePagamento.valor(somaDoValorDosItens) };
}

function getItem(codigoItem) {
  const principal = itensPrincipais.find((item) => item.codigo === codigoItem);
  if (principal) return principal;

  const extra = itensExtra.find((item) => item.codigo === codigoItem);
  if (extra) return extra;

  const combo = itensCombos.find((item) => item.codigo === codigoItem);
  if (combo) return combo;

  return null;
}

function validarAcompanhamento(itensNoCarrinho, itemAcompanhamento) {
  if (
    !itensExtra.some(
      (itemExtra) => itemExtra.codigo === itemAcompanhamento.codigo
    )
  ) {
    return true;
  }

  let itemPrincipalDoExtraFoiPedido = false;

  for (const itemDoCarrinho of itensNoCarrinho) {
    const codigoItem = itemDoCarrinho.split(",")[0];

    const itemPrincipal = itensPrincipais.find(
      (item) => item.codigo === codigoItem
    );

    if (itemPrincipal) {
      itemPrincipalDoExtraFoiPedido = itemAcompanhamento.combinaCom.includes(
        itemPrincipal.codigo
      );
      if (itemPrincipalDoExtraFoiPedido) {
        break;
      }
    }
  }

  return itemPrincipalDoExtraFoiPedido;
}

function getFormaDePagamento(metodoDePagamento) {
  return metodosDePagamento.pagamentos.find(
    (pagamento) => pagamento.tipo === metodoDePagamento
  );
}

function validacoesIniciais(metodoDePagamento, itens) {
  if (checarSeCarinhoEstaVazio(itens)) {
    return {
      error: true,
      mensagem: mensagens.CARRINHO_VAZIO,
    };
  }

  if (!checarSeMetodoDePagamentoExiste(metodoDePagamento)) {
    return {
      error: true,
      mensagem: mensagens.TIPO_PAGAMENTO_INVALIDO,
    };
  }

  if (!checarSeTodoItensTemPeloMenosQuantiaMinima(itens)) {
    return {
      error: true,
      mensagem: mensagens.QUANTIA_INVALIDA,
    };
  }

  if (!checarSeTodosItensExistem(itens)) {
    return {
      error: true,
      mensagem: mensagens.ITEM_INVALIDO,
    };
  }

  return { error: false };
}

function checarSeCarinhoEstaVazio(itensDoCarrinho) {
  return itensDoCarrinho.length < 1;
}

function checarSeMetodoDePagamentoExiste(metodoDePagamento) {
  return metodosDePagamento.pagamentos.find(
    (pagamento) => pagamento.tipo === metodoDePagamento
  );
}

function checarSeTodoItensTemPeloMenosQuantiaMinima(itensDoCarrinho) {
  const QUANTIA_MINIMA_DE_ITENS = 1;
  for (let i = 0; i < itensDoCarrinho.length; i++) {
    const quantidade = itensDoCarrinho[i].split(",")[1];
    if (quantidade < QUANTIA_MINIMA_DE_ITENS) return false;
  }
  return true;
}

function checarSeTodosItensExistem(itensDoCarrinho) {
  const todosItens = [...itensPrincipais, ...itensExtra, ...itensCombos];

  for (let i = 0; i < itensDoCarrinho.length; i++) {
    const itemSelecionado = itensDoCarrinho[i].split(",")[0];
    const resultado = todosItens.some(
      (item) => item.codigo === itemSelecionado
    );
    if (!resultado) return false;
  }
  return true;
}

export { CaixaDaLanchonete };
