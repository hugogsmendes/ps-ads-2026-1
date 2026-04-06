import { prisma } from '../database/client.js'
import argon2 from 'argon2';


const ARGON2_CONFIG = {
 type: argon2.argon2id,  // variante recomendada do algoritmo
 memoryCost: 65536,      // 64 KB de memória máxima utilizada
 timeCost: 3,            // número de iterações
 parallelism: 4          // número de threads simultâneas
}

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
        if (req.body.password){
            req.body.password = await argon2.hash(req.body.password, ARGON2_CONFIG)
        }
        await prisma.user.create({data: req.body})

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
        
        const result = await prisma.user.findMany({
            omit: {password: true},
            orderBy: [ {fullname: 'asc'} ]
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

        const result = await prisma.user.findUnique({
            omit: {password: true},
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

        if(req.body.password) {
            req.body.password = await argon2.hash(req.body.password, ARGON2_CONFIG)
        }
        const result = await prisma.user.update({
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
        const result = await prisma.user.delete({
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

controller.login = async function(req, res) {
 try {
   // Busca o usuário no BD por meio dos campos
   // "username" ou "email"
   const user = await prisma.user.findUnique({
     where: {
       OR: [
         { username: req.body?.username },
         { email: req.body?.email }
       ]
     }
   })


   // Se o usuário não for encontrado, retorna
   // HTTP 401: Unauthorized
   if(! user) {
     console.error(`ERRO DE LOGIN: usuário "${req.body?.username}" ou e-mail "${req.body?.email}" não encontrado`)
     return res.send(401).end()
   }


 }
 catch(error) {
   console.error(error)
   // HTTP 500: Internal Server Error
   res.status(500).end()
 }
}


export default controller