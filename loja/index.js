import amqplib from 'amqplib';

const connection = await amqplib.connect('amqp://alura:alura123@localhost:5672');

const producerChannel = await connection.createChannel();

const pedido = {
    cliente: {
        nome: 'Ash',
        cpf: '813.334.479-49',
        email: 'thiago_elias_lopes@jci.com',
        endereco: 'Rua Palmitos, n 513',
        cep: '89222-520'
    },
    itens: [
        {
            descricao: 'Yakimeshi',
            quantidade: 1,
            valorUnitario: 21.9
        },
        {
            descricao: 'Coca-cola Zero Lata 310 ML',
            quantidade: 2,
            valorUnitario: 5.9
        }
    ]
}

producerChannel.publish('pedidosPagos', '', Buffer.from(JSON.stringify(pedido)));
await producerChannel.close();
connection.close();
