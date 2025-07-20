# OTP Project - Geração e Validação de Códigos OTP (TOTP/HOTP)

Este é um projeto desenvolvido em **NestJS** com suporte a **Docker**, utilizando **AWS Lambda + API Gateway** para deploy em serverless. Ele fornece uma API REST para **geração e validação de tokens OTP**, nos formatos **TOTP** e **HOTP**.

---

## Tecnologias e bibliotecas utilizadas

- **Framework:** [NestJS](https://nestjs.com/)
- **Autenticação JWT:** `@nestjs/passport`, `@nestjs/jwt`, `passport-jwt`
- **Geração e validação de OTP:** [otplib](https://github.com/yeojz/otplib)
- **Persistência:** AWS **DynamoDB**
- **Documentação da API:** Swagger com `@nestjs/swagger`
- **Pino**: Utilizado para logging estruturado da aplicação.
- **Jest**: Framework utilizado para testes unitários.
- **Ambiente local:** Docker com `docker-compose` e suporte a multiplataforma (`buildx`)
- **Deploy Serverless:** AWS Lambda com **imagem container** hospedada no **Amazon ECR** e logs no **Cloudwatch**

---

### Autenticação

A aplicação utiliza autenticação via **Bearer Token** de forma simplificada. A validação é feita com base em um `SECRET` armazenado nas variáveis de ambiente, sem uso de banco de dados, refresh tokens ou controle de sessões. 

Essa implementação foi feita apenas para fins de demonstração, sem uma estrutura de autenticação robusta.

---

## Funcionalidades

- Gerar código TOTP (Time-based One-Time Password)
- Validar código TOTP
- Gerar código HOTP (HMAC-based One-Time Password)
- Validar código HOTP

Os dados dos usuários e contadores são armazenados no **DynamoDB**.

---

## Requisitos

- [Node.js](https://nodejs.org/) v20+
- [NPM](https://www.npmjs.com/)
- [NestJS CLI](https://docs.nestjs.com/cli/overview)
- [Docker](https://www.docker.com/) e Docker Compose (para execução local opcional)

---

## Clone

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/otp-project.git
cd otp-project
```

---

## Execução Local 

```bash
# Instala as dependências
npm install
```

Crie um arquivo `.env` com as credenciais AWS (para rodar com DynamoDB) e um secret JWT (para autenticação das funcionalidades de Auth):

```env
NODE_ENV=development
AWS_ACCESS_KEY_ID=<access-key-id>
AWS_SECRET_ACCESS_KEY=<secret-access-key>
AWS_REGION=us-east-1
DYNAMO_TABLE_NAME=<nome-tabela-dynamo>
JWT_SECRET=<jwt-secret>
```
Substitua os valores dentro de <> por valores reais. 
As especificações de cada valor está descrita mais abaixo neste README.

```bash
# Compile os arquivos TypeScript
npm run build
```

```bash
# Rode a aplicação
npm run start:dev
```

A aplicação estará acessível em `http://localhost:3000`.

---

## Execução via Docker Compose

```bash
# Build e execução local utilizando o docker-compose
docker-compose up --build
```

A aplicação estará acessível em `http://localhost:3000`.

---

## Build para AWS (ECR + Lambda)

```bash
# Tag para o ECR e validação de credenciais
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <id-repositorio-ecr>.dkr.ecr.us-east-1.amazonaws.com

# Build da imagem multi-arquitetura para o ECR
docker buildx build --platform linux/amd64 -t <id-repositorio-ecr>.dkr.ecr.us-east-1.amazonaws.com/otp-project:latest --load .

# Push da imagem para o ECR
docker push <id-repositorio-ecr>.dkr.ecr.us-east-1.amazonaws.com/otp-project:latest
```

OBS: o valor de **id-repositorio-ecr** deve ser subistituído pelo ID do repositório no AWS ECR.

Deverá acessar o Lambda através do AWS Console e selecionar manualmente a nova imagem.

---

## Variáveis de Ambiente

| Variável                | Descrição                  | Obrigatória         |
| ----------------------- | -------------------------- | ------------------- |
| `NODE_ENV`              | Definição do ambiente      | Sim         (local) |
| `AWS_REGION`            | Região da AWS              | Sim                 |
| `AWS_ACCESS_KEY_ID`     | Chave de acesso AWS        | Sim         (local) |
| `AWS_SECRET_ACCESS_KEY` | Segredo de acesso AWS      | Sim         (local) |
| `DYNAMO_TABLE_NAME`     | Nome da tabela do DynamoDB | Sim                 |
| `JWT_SECRET`            | Secret para autenticação   | Sim                 |

> No **Lambda**, algumas credenciais são providas de forma automática e/ou não são necessárias, portanto não é preciso defini-las manualmente nas Configurações do Lambda. Apenas localmente conforme descrito acima.

---

### Execução dos Testes

```bash
# Executar os testes unitários
npm run test
```

---

## Endpoints

Acesse a documentação Swagger:

```
GET /api-docs
```

Exemplos de endpoints:

### Autenticação

```
POST /auth/login
Body: { secret: "123124" }
```

### Gerar TOTP

```
POST /otp/totp
Headers:
Authorization: Bearer {token}
Body: 
{ userId: "new@email.com" }
```

### Validar TOTP

```
POST /otp/totp/validate
Headers:
Authorization: Bearer {token}
Body: 
{ userId: "new@email.com", token: "XXXXX" }
```

### Gerar HOTP

```
POST /otp/hotp
Headers:
Authorization: Bearer {token}
Body: 
{ userId: "new@email.com" }
```

### Validar HOTP

```
POST /otp/hotp/validate
Headers:
Authorization: Bearer {token}
Body: 
{ userId: "new@email.com", token: "XXXXX" }
```

---

## Observações finais

- A aplicação está pronta para funcionar em ambientes **serverless** e **containerizados**.
- As roles e permissões IAM precisam estar corretamente configuradas na **função Lambda**.
- As variáveis de ambiente **sensíveis** não foram commitadas e não foram disponibilizadas via Git por questões de segurança.

---


