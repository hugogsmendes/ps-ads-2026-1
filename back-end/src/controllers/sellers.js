import { prisma } from '../database/client.js'

const controller = {}

// Todas as funções de controller têm, pelo menos, 
// dois parâmetros:
// req -> representa a requisição (request)
// res -> representa a resposta (response)

controller.create = async function (req, res){
    try{
        // Para a inserção no BD, os dados são enviados
        // dentro de um objeto chamado "body" que vem
        // dentro da requisição ("req")
        await prisma.seller.create({data: req.body})

        // Se tudo der certo, enviamos o código HTTP
        // apropriado, no caso
        // HTTP 201: created
        res.status(201).end()
    }
    catch(error){
        // Se algo de errado ocorrer, cairemos aqui
        console.log(error) // Exibe o erro no terminal

        // Enviamos como resposta o código HTTP relativo
        // a erro interno do servidor
        // HTTP 500: Internal Server Error
        res.status(500).end()
    }
}

controller.retrieveAll = async function (req, res) {
    try{
        
        const result = await prisma.seller.findMany({
            orderBy: [ { fullname: 'asc' }]
        })

        // HTTP 200: 0k (implícito)
        res.send(result)
    }

    catch(error){
        // Se algo de errado ocorrer, cairemos aqui
        console.log(error) // Exibe o erro no terminal

        // Enviamos como resposta o código HTTP relativo
        // a erro interno do servidor
        // HTTP 500: Internal Server Error
        res.status(500).end()
    }
    
}

controller.retrieveOne = async function (req, res){
    try{

        const result = await prisma.seller.findUnique({
            where: { id: Number(req.params.id) }
        })

        // HTTP 200: 0k (implícito)
        if (result) res.send(result)
        // HTTP 404: Not Found (não encontrado)
        else res.status(404).send()
    }
    catch(error){
        // Se algo de errado ocorrer, cairemos aqui
        console.log(error) // Exibe o erro no terminal

        // Enviamos como resposta o código HTTP relativo
        // a erro interno do servidor
        // HTTP 500: Internal Server Error
        res.status(500).end()
    }
}

controller.update = async function (req, res){

    try{
        const result = await prisma.seller.update({
            where: { id: Number(req.params.id) },
            data: req.body
        })

        // HTTP 204: No Content 
        res.status(204).end()
    }
    catch(error){

        console.log(error)

        // No caso da biblioteca Prisma, é gerado um erro com
        // código 'P2025' caso o registro com o id especificado
        // não exista. Aqui, estamos detectando se é o caso e
        // retornando HTTP 404: Not Found para indicar essa
        // situação
        if(error?.code === 'P2025') res.status(404).end()


        // Se o erro for de outro tipo, retornamos o código de erro
        // padrão
        // HTTP 500: Internal Server Error
        else res.status(500).end()
    }
}

controller.delete = async function (req, res){

    try{
        const result = await prisma.seller.delete({
            where: {id: Number(req.params.id)}
        })

        res.status(204).end()
    }
    
    catch(error){

        console.log(error)

        // No caso da biblioteca Prisma, é gerado um erro com
        // código 'P2025' caso o registro com o id especificado
        // não exista. Aqui, estamos detectando se é o caso e
        // retornando HTTP 404: Not Found para indicar essa
        // situação
        if(error?.code === 'P2025') res.status(404).end()


        // Se o erro for de outro tipo, retornamos o código de erro
        // padrão
        // HTTP 500: Internal Server Error
        else res.status(500).end()
    }
}

export default controller