import mongoose from "mongoose";

async function connect() {

    try {
        const dbConnect = await mongoose.connect(process.env.MONGODB_URI);
        
        console.log(`Conectado ao banco de dados: ${dbConnect.connection.name}`)

    } catch (error) {

        console.log("Erro de conexão: " + error);

    }

}

export default connect;