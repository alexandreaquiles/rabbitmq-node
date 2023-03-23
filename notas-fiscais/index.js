import amqplib from 'amqplib';

const connection = await amqplib.connect('amqp://alura:alura123@localhost:5672');
const consumerChannel = await connection.createChannel();

await consumerChannel.bindQueue('notas', 'pedidosPagos', '');

await consumerChannel.consume('notas', message => {
    const messageContent = message.content.toString();

    const pedido = JSON.parse(messageContent);
    const valorTotal = pedido.itens
        .map(item => item.quantidade * item.valorUnitario)
        .reduce((acc, valorItem) => acc + valorItem);

    const xmlNotaFiscal = `
    <xml>
        <loja>314276853</loja>
        <nat_operacao>Almoços, Jantares, Refeições e Pizzas</nat_operacao>
        <vlr_total>${valorTotal}</vlr_total>
        <pedido>
            <itens>
                ${ pedido.itens.map(item => `
                        <item>
                            <descricao>${item.descricao}</descricao>
                            <qtde>${item.quantidade}</qtde>
                            <vlr_unit>${item.valorUnitario}</vlr_unit>
                        </item>
                    `).join('') }
            </itens>
        </pedido>
        <cliente>
            <nome>${pedido.cliente.nome}</nome>
            <tipoPessoa>F</tipoPessoa>
            <contribuinte>9</contribuinte>
            <cpf_cnpj>${pedido.cliente.cpf}</cpf_cnpj>
            <email>${pedido.cliente.email}</email>
            <endereco>${pedido.cliente.endereco}</endereco>
            <complemento>-</numero>
            <cep>${pedido.cliente.cep}</cep>
        </cliente>
    </xml>`;

    console.log('Enviando nota para SEFAZ', xmlNotaFiscal);

}, {noAck: true});