### 3.3.1 Processo 1 – GESTÃO DE USUÁRIO

O processo de **Gestão de Usuário** tem como objetivo permitir o cadastro e manutenção das informações dos colaboradores e clientes da empresa, garantindo maior organização dos dados, rastreabilidade e apoio aos demais processos do sistema, como agendamento, prestação de serviços e cálculo de comissão.

Atualmente, em muitos pequenos negócios, o controle de colaboradores é feito de maneira informal ou por meio de planilhas, o que pode gerar inconsistências cadastrais, retrabalho e dificuldade de integração com outros processos da operação. Com a informatização desse processo, será possível centralizar as informações dos profissionais, melhorar a confiabilidade dos dados e aumentar a eficiência administrativa do negócio.

#### Oportunidades de melhoria

A informatização do processo de Gestão de Colaborador traz as seguintes oportunidades de melhoria:

• centralização das informações cadastrais em um único sistema;

• redução de erros decorrentes de controles manuais;

• facilidade para localizar e atualizar dados dos profissionais;

• integração com processos de agendamento, serviços e comissão;

• maior segurança no acesso às informações;

• melhor rastreabilidade das alterações realizadas no cadastro.

---

Em seguida, apresenta-se os modelos do processo de Gestão de Colaborador, descritos no padrão BPMN:

### Autenticação e Registro de Cliente
![Autenticação e Registro de Cliente](images/bpmn-gestao-de-usuario-p1.png "Modelo BPMN do Processo 1 - Autenticação e Registro de Cliente.")

### Subprocesso - Registro de Cliente
![Subprocesso - Registro de Cliente](images/bpmn-gestao-de-usuario-p2.png "Modelo BPMN do Processo 1 - Subprocesso - Registro de Cliente.")

### Criação de Convite para Admin e Colaborador
![Criação de Convite para Admin e Colaborador](images/bpmn-gestao-de-usuario-p3.png "Modelo BPMN do Processo 1 - Criação de Convite para Admin e Colaborador")

### Registro de Usuário Convidado
![Registro de Usuário Convidado](images/bpmn-gestao-de-usuario-p4.png "Modelo BPMN do Processo 1 -Registro de Usuário Convidado.")

---
## Detalhamento das atividades

---
 
### Acessar módulo de colaboradores
 
Atividade inicial do processo. O usuário acessa o módulo de gerenciamento de colaboradores a partir do menu principal do sistema. Ponto de entrada que dispara a navegação para a tela de listagem.
 
| **Comandos**              | **Destino**                            | **Tipo** |
| ------------------------- | -------------------------------------- | -------- |
| acessar módulo            | Atividade "Exibir tela de colaboradores" | padrão   |
 
---

### Exibir tela de colaboradores

Tela principal do módulo. Apresenta a lista de colaboradores cadastrados no sistema, com suporte a busca por nome e filtragem por status. A partir desta tela, o usuário pode iniciar o cadastro de um novo colaborador ou selecionar um colaborador existente para alterar ou excluir.

| **Campo**                  | **Tipo**           | **Restrições**             | **Valor padrão**           |
| ---------------------- | -------------- | ---------------------- | ---------------------- |
| lista de colaboradores | Tabela         | somente leitura        | carregada pelo sistema |
| campo de busca         | Caixa de texto | preenchimento opcional | vazio                  |
| filtro de status       | Seleção única  | ativo / inativo / todos| todos                  |

| **Comandos**           | **Destino**                          | **Tipo**     |
| --------------------- | --------------------------------- | -------- |
| cadastrar colaborador | Atividade "Selecionar Cadastrar colaborador" | padrão   |
| selecionar colaborador   | Atividade "Selecionar um colaborador já cadastrado"   | padrão   |
| voltar                | Fim do processo                   | cancelar |

---

### Selecionar "Cadastrar colaborador"

O usuário aciona a opção de cadastro de novo colaborador. O sistema redireciona para o formulário de cadastro. Ação de navegação.

| **Comandos**          | **Destino**                         | **Tipo** |
| --------------------- | ----------------------------------- | -------- |
| cadastrar colaborador | Atividade "Exibir formulário de cadastro" | padrão   |
| cancelar              | Atividade "Exibir tela de colaboradores" | cancelar |
 
---

### Exibir formulário de cadastro

O sistema apresenta o formulário em branco para preenchimento dos dados do novo colaborador. Todos os campos são exibidos vazios aguardando a entrada do usuário.

| **Campo**                  | **Tipo**           | **Restrições**             | **Valor padrão**           |
| ------------------- | -------------- | ------------------- | ------------ |
| nome completo       | Caixa de texto | obrigatório         | vazio        |
| CPF                 | Caixa de texto | obrigatório e único | vazio        |
| endereço            | Área de texto  | obrigatório         | vazio        |
| data de nascimento  | Data           | obrigatório         | vazio        |
| telefone            | Caixa de texto | obrigatório         | vazio        |
| e-mail              | Caixa de texto | obrigatório         | vazio        |
| data de contratação | Data           | obrigatório         | data atual   |

| **Comandos**           | **Destino**                          | **Tipo**     |
| -------- | -------------------------------- | -------- |
| salvar   | Atividade "Preencher dados do colaborador" | padrão   |
| cancelar | Atividade "Exibir tela de colaboradores" | cancelar |

---
 
### Preencher dados do colaborador
 
O usuário insere as informações do colaborador nos campos do formulário. Esta atividade ocorre tanto no fluxo de cadastro quanto no fluxo de alteração, a diferença é de que, na alteração, os campos são preenchidos previamente com os dados existentes.
 
| **Campo**           | **Tipo**       | **Restrições**       | **Valor padrão**               |
| ------------------- | -------------- | -------------------- | ------------------------------ |
| nome completo       | Caixa de texto | obrigatório          | vazio (cadastro) / valor atual (alteração) |
| CPF                 | Caixa de texto | obrigatório e único  | vazio (cadastro) / valor atual (alteração) |
| endereço            | Área de texto  | obrigatório          | vazio (cadastro) / valor atual (alteração) |
| data de nascimento  | Data           | obrigatório          | vazio (cadastro) / valor atual (alteração) |
| telefone            | Caixa de texto | obrigatório          | vazio (cadastro) / valor atual (alteração) |
| e-mail              | Caixa de texto | obrigatório          | vazio (cadastro) / valor atual (alteração) |
| data de contratação | Data           | obrigatório          | data atual (cadastro) / valor atual (alteração) |
 
| **Comandos** | **Destino**                      | **Tipo** |
| ------------ | -------------------------------- | -------- |
| confirmar    | Atividade "Confirmar cadastro"   | padrão   |
| cancelar     | Atividade "Exibir tela de colaboradores" | cancelar |
 
---

### Confirmar cadastro
 
O usuário revisa os dados preenchidos e confirma o envio do formulário. O sistema encaminha as informações para a etapa de validação.
 
| **Campo**                    | **Tipo** | **Restrições**  | **Valor padrão**              |
| ---------------------------- | -------- | --------------- | ----------------------------- |
| resumo dos dados preenchidos | Exibição | somente leitura | dados inseridos pelo usuário  |
 
| **Comandos**      | **Destino**                  | **Tipo** |
| ----------------- | ---------------------------- | -------- |
| confirmar         | Atividade "Validar dados"    | padrão   |
| cancelar          | Atividade "Exibir tela de colaboradores" | cancelar |
 
---
### Validar dados
 
Atividade executada pelo sistema. Os dados informados pelo usuário são verificados quanto ao cumprimento das restrições definidas (campos obrigatórios, CPF único, formato de e-mail e data válida). Não há interação direta do usuário nesta etapa.
 
| **Campo**             | **Tipo** | **Restrições**                                      | **Valor padrão** |
| --------------------- | -------- | --------------------------------------------------- | ---------------- |
| nome completo         | Interno  | não pode ser vazio                                  | —                |
| CPF                   | Interno  | não pode ser vazio; deve ser único no sistema       | —                |
| endereço              | Interno  | não pode ser vazio                                  | —                |
| data de nascimento    | Interno  | não pode ser vazia; deve ser uma data válida        | —                |
| telefone              | Interno  | não pode ser vazio                                  | —                |
| e-mail                | Interno  | não pode ser vazio; deve ter formato válido         | —                |
| data de contratação   | Interno  | não pode ser vazia; deve ser uma data válida        | —                |
 
| **Resultado**   | **Destino**                                        |
| --------------- | -------------------------------------------------- |
| dados válidos   | Atividade "Salvar colaborador no sistema"          |
| dados inválidos | Atividade "Exibir erro para o usuário corrigir os dados" |
 
---
 
### Exibir erro para o usuário corrigir os dados
 
Caso a validação falhe, o sistema exibe uma mensagem de erro indicando quais campos precisam ser corrigidos. O usuário retorna ao formulário para efetuar os ajustes necessários.
 
| **Campo**          | **Tipo** | **Restrições**  | **Valor padrão**                        |
| ------------------ | -------- | --------------- | --------------------------------------- |
| mensagem de erro   | Exibição | somente leitura | descrição do(s) campo(s) com problema   |
 
| **Comandos**  | **Destino**                                  | **Tipo** |
| ------------- | -------------------------------------------- | -------- |
| corrigir      | Atividade "Preencher dados do colaborador"   | padrão   |
| cancelar      | Atividade "Exibir tela de colaboradores"     | cancelar |
 
---
 
### Salvar colaborador no sistema
 
Atividade executada pelo sistema após a validação bem-sucedida dos dados. O registro do colaborador é inserido no banco de dados e o sistema retorna para a tela de listagem, agora com o colaborador incluído ou atualizado.
 
| **Campo**               | **Tipo** | **Restrições**  | **Valor padrão**             |
| ----------------------- | -------- | --------------- | ---------------------------- |
| dados do colaborador    | Interno  | somente leitura | dados validados na etapa anterior |
 
| **Resultado**            | **Destino**                              |
| ------------------------ | ---------------------------------------- |
| salvo com sucesso        | Atividade "Exibir tela de colaboradores" |
 
---
 
### Selecionar um colaborador já cadastrado
 
O usuário escolhe um colaborador da lista exibida na tela principal. A partir desta seleção, o sistema oferece as opções de alterar ou excluir o registro.
 
| **Campo**               | **Tipo** | **Restrições**  | **Valor padrão**               |
| ----------------------- | -------- | --------------- | ------------------------------ |
| colaborador selecionado | Exibição | somente leitura | nome do colaborador escolhido  |
 
| **Comandos**             | **Destino**                                      | **Tipo** |
| ------------------------ | ------------------------------------------------ | -------- |
| alterar dados do colaborador | Atividade "Preencher dados do colaborador"   | padrão   |
| excluir colaborador      | Atividade "Excluir colaborador do sistema"       | padrão   |
| cancelar                 | Atividade "Exibir tela de colaboradores"         | cancelar |
 
---
 
### Excluir colaborador do sistema
 
O sistema solicita a confirmação do usuário antes de remover o registro do colaborador. Caso confirmado, o colaborador é excluído do banco de dados e o sistema retorna para a tela de listagem atualizada.

| **Campo**                  | **Tipo**           | **Restrições**             | **Valor padrão**           |
| ----------------------- | -------------- | --------------- | ------------------- |
| colaborador selecionado | Exibição | somente leitura | nome do colaborador |
| confirmação de exclusão | Seleção        | sim / não       | não                 |

| **Comandos**           | **Destino**                          | **Tipo**     |
| ------------------ | -------------------------------- | -------- |
| confirmar exclusão | Atividade "Exibir tela de colaboradores" | padrão   |
| cancelar           | Atividade "Exibir tela de colaboradores" | cancelar |


### Fluxo textual inicial para os clientes

O Cliente ao acessar a aplicação web. Decisão: Verifica se já possui conta ou se precisa de se registar.
Preenche os dados e o sistema grava o perfil automaticamente como 'CLIENTE'. Autenticação: Realiza o login [critério a definir]
Redirecionamento: O sistema valida o perfil e carrega a Visão do Cliente (Serviços e agendamentos).
