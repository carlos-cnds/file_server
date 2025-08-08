# File Server

Uma aplicação simples feita com Node.js para upload, download, listagem e exclusão de arquivos com suporte a organização por pastas personalizadas.

## 🚀 Funcionalidades

- ✅ Upload de arquivos até 500MB
- ✅ Download de arquivos
- ✅ Exclusão de arquivos
- ✅ Listagem de arquivos por pasta
- ✅ Organização automática em pastas personalizadas
- ✅ Suporte completo ao Docker
- ✅ Timeouts configurados para uploads grandes

## 📋 Requisitos

- Node.js 18+
- Docker (opcional)

## 🛠️ Instalação

### Local
```bash
npm install
npm start
```

### Docker
```bash
# Build e execução
docker-compose up --build

# Ou usando Docker diretamente
docker build -t file-server .
docker run -p 3004:3004 -v ./uploads:/app/uploads file-server
```

## 📚 API Endpoints

### 1. Upload de Arquivo
**POST** `/upload`

**Headers:**
- `folder` (opcional): Nome da pasta onde salvar o arquivo. Se não informado, usa "uploads"
- `Content-Type`: `multipart/form-data`

**Body:**
- `file`: O arquivo a ser enviado

**Exemplo com curl:**
```bash
curl -X POST http://localhost:3004/upload \
  -H "folder: documentos" \
  -F "file=@meuarquivo.pdf"
```

**Resposta de sucesso:**
```json
{
  "message": "File uploaded successfully",
  "filename": "uuid-gerado.pdf",
  "folder": "documentos",
  "path": "uploads/documentos/uuid-gerado.pdf"
}
```

---

### 2. Download de Arquivo
**GET** `/file/:filename`

**Headers:**
- `folder` (opcional): Nome da pasta onde está o arquivo. Se não informado, usa "uploads"

**Exemplo com curl:**
```bash
curl -X GET http://localhost:3004/file/uuid-gerado.pdf \
  -H "folder: documentos" \
  --output arquivo-baixado.pdf
```

**Resposta:**
- Sucesso: O arquivo é retornado como stream
- Erro 404: `{"error": "File not found"}`

---

### 3. Listar Arquivos
**GET** `/files`

**Headers:**
- `folder` (opcional): Nome da pasta para listar os arquivos. Se não informado, usa "uploads"

**Exemplo com curl:**
```bash
curl -X GET http://localhost:3004/files \
  -H "folder: documentos"
```

**Resposta de sucesso:**
```json
{
  "files": ["arquivo1.pdf", "arquivo2.jpg", "arquivo3.txt"],
  "folder": "documentos",
  "count": 3
}
```

---

### 4. Deletar Arquivo
**DELETE** `/delete/:filename`

**Headers:**
- `folder` (opcional): Nome da pasta onde está o arquivo. Se não informado, usa "uploads"

**Exemplo com curl:**
```bash
curl -X DELETE http://localhost:3004/delete/uuid-gerado.pdf \
  -H "folder: documentos"
```

**Resposta de sucesso:**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

**Resposta de erro:**
```json
{
  "success": false,
  "error": "File not found"
}
```

## 📁 Estrutura de Pastas

O sistema organiza automaticamente os arquivos em pastas:

```
uploads/
├── uploads/           (pasta padrão)
├── documentos/        (pasta personalizada)
├── imagens/          (pasta personalizada)
└── videos/           (pasta personalizada)
```

## ⚙️ Configurações

### Limites de Upload
- **Tamanho máximo do arquivo:** 500MB
- **Timeout para upload:** 10 minutos
- **Memória máxima do Node.js:** 4GB (no Docker)

### Portas
- **Porta padrão:** 3004

## 🐳 Docker

### docker-compose.yml
```yaml
version: '3.8'
services:
  file-server:
    build: .
    ports:
      - "3004:3004"
    volumes:
      - ./uploads:/app/uploads
    environment:
      - NODE_OPTIONS=--max-old-space-size=4096
```

### Comandos Docker
```bash
# Build da imagem
docker build -t file-server .

# Executar container
docker run -p 3004:3004 -v ./uploads:/app/uploads file-server

# Usar docker-compose
docker-compose up --build
```

## 📝 Notas Importantes

1. **Nomes únicos:** Todos os arquivos recebem nomes únicos (UUID) para evitar conflitos
2. **Criação automática:** Pastas são criadas automaticamente se não existirem
3. **Persistência:** Use volumes Docker para manter os arquivos após restart do container
4. **Segurança:** A aplicação não valida tipos de arquivo - implemente validação conforme necessário

## 🔧 Desenvolvimento

### Estrutura do projeto
```
file_server/
├── index.js              # Aplicação principal
├── package.json          # Dependências
├── Dockerfile            # Configuração Docker
├── docker-compose.yml    # Orquestração Docker
├── .dockerignore         # Arquivos ignorados no build
└── README.md            # Esta documentação
```

### Dependências principais
- **express:** Framework web
- **multer:** Middleware para upload de arquivos
- **uuid:** Geração de IDs únicos
- **fs/path:** Manipulação de arquivos e caminhos


