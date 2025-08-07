# Use a imagem oficial do Node.js como base
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o resto do código da aplicação
COPY . .

# Cria o diretório uploads se não existir
RUN mkdir -p uploads

# Expõe a porta que a aplicação usa
EXPOSE 3004

# Define o comando para iniciar a aplicação
CMD ["node", "index.js"]
