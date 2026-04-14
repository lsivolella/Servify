# 3.3.3 Processo 3 – GESTÃO DE AGENDAMENTO

O processo de **Gestão de Agendamento** tem como objetivo permitir que o usuário visualize agendamentos com base no seu perfil de acesso, permitindo que clientes e colaboradores se organizem para seus atendimentos e que o gestor possa ter uma visão global dos serviços sendo prestados.

Usuários definidos com perfil de **Cliente** podem ver e alterar os seus próprios agendamentos. Usuários com perfil de **Colaborador** podem ver e alterar os agendamentos em que são os responsáveis pelo serviço. Usuários com o perfil de **Admin** podem ver e alterar todos os agendamentos existentes.

## Oportunidades de melhoria

A informatização do processo de Gestão de Agendamento traz as seguintes oportunidades de melhoria:

- Previne que colaboradores agendem **serviços concomintantes**.
- Melhor **organização** para colaboradores.
- Melhora a **experiência do cliente**.
- Facilita a **gestão de recursos** do estabelicimento.

## Modelagem

Em seguida, apresenta-se o modelo do processo de Gestão de Agendamento, descritos no padrão BPMN:

O processo de **Gestão de Agendamento** tem como objetivo permitir que um administrador visualize, crie, edite e exclua agendamentos de todos os clientes e colaboradores do sistema, permitir que o colaborador visualize, edite e exclua apenas os agendamentos vinculados a ele e permitir que o cliente visualize, crie, edite e exclua apenas os seus próprios agendamentos. O processo se inicia com o usuário acessando a página de Gerenciamento de Agendamentos, onde é exibido um calendário semanal com todos os agendamentos cadastrados e as seguintes opções: navegar entre semanas, buscar agendamentos, visualizar detalhes de um agendamento ou criar um novo agendamento.
- Caso o usuário queira navegar entre semanas, ele pressiona os botões de seta para a esquerda ou para a direita, alterando a semana exibida no calendário.
- Caso o usuário queira buscar um agendamento, ele digita na barra de pesquisa o serviço e a listagem é filtrada por uma tabela com os resultados encontrados, exibindo serviço, cliente, prestador, data, horário, duração, valor e ações (no caso de administrador ou colaborador). O usuário pode apagar a digitação para retornar ao calendário semanal. Na listagem de resultados, ele pode clicar no ícone de lápis para editar ou no ícone de lixeira para excluir o agendamento diretamente.
- Caso o usuário queira visualizar os detalhes de um agendamento, ele clica sobre o card do agendamento no calendário e um modal é aberto exibindo as informações completas: serviço, cliente, prestador, data, horário, duração, valor e status. A partir desse modal, o usuário pode clicar em "Editar" para editar o agendamento, "Excluir" para excluí-lo, ou "X" para fechar o modal.
- Caso o usuário queira criar um novo agendamento, ele pressiona o botão "+ Adicionar" e um modal é aberto com campos para preencher: nome do serviço, cliente, prestador, data, horário de início, duração e valor. Após preencher os campos, o usuário clica em "Adicionar" para confirmar o cadastro ou em "Cancelar" para fechar o modal sem salvar.
- Caso o usuário queira editar um agendamento, ele pode acessar o modal de edição a partir dos detalhes do agendamento ou da listagem de busca. O modal exibe os campos do agendamento preenchidos com os dados atuais: nome do serviço, cliente, prestador, data, horário de início, duração e valor. O usuário pode alterar os campos desejados e clicar em "Salvar" para confirmar as alterações, em "Excluir" para excluir o agendamento, ou em "Cancelar" ou "X" para fechar o modal sem salvar.
- Caso o usuário queira excluir um agendamento, ele pode acionar o botão "Excluir" no modal de edição ou no modal de detalhes. Um modal de confirmação é exibido perguntando se deseja confirmar a exclusão. O usuário pode clicar em "Excluir" para confirmar ou em "Cancelar" para cancelar a operação.

![Modelo BPMN do Processo 3](images/bpmn/bpmn-gestao-de-agendamento.png "Modelo BPMN do Processo 3.")

### Detalhamento das atividades
 
#### Acessar a lista de agendamentos (calendário semanal)
 
| **Campo**               | **Tipo**  | **Restrições**  | **Valor padrão**                  |
| ----------------------- | --------- | --------------- | --------------------------------- |
| Calendário semanal      | Exibição  | somente leitura | semana atual                      |
| Agendamento (card)      | Exibição  | somente leitura | dados do agendamento preenchidos  |
 
| **Comandos**            | **Destino**                                      | **Tipo** |
| ----------------------- | ------------------------------------------------ | -------- |
| Semana anterior (<)     | Atividade "Acessar a lista de agendamentos"      | padrão   |
| Próxima semana (>)      | Atividade "Acessar a lista de agendamentos"      | padrão   |
| Clicar em agendamento   | Atividade "Visualizar detalhes do agendamento"   | padrão   |
| + Adicionar             | Atividade "Criar agendamento"                    | padrão   |
 
| **Resultado**           | **Destino**                                      |
| ----------------------- | ------------------------------------------------ |
| Semana alterada         | Calendário atualizado para a semana selecionada  |
| Agendamento selecionado | Atividade "Visualizar detalhes do agendamento"   |
| Novo agendamento        | Atividade "Criar agendamento"                    |
 
---
 
#### Buscar e filtrar agendamentos
 
| **Campo**               | **Tipo**       | **Restrições** | **Valor padrão** |
| ----------------------- | -------------- | -------------- | ---------------- |
| Buscar agendamentos     | Caixa de texto | vazio          | vazio            |
 
| **Comandos**            | **Destino**                                         | **Tipo** |
| ----------------------- | --------------------------------------------------- | -------- |
| Digitar termo de busca  | Atividade "Buscar e filtrar agendamentos"            | padrão   |
| Editar (lápis)          | Atividade "Editar agendamento"                      | padrão   |
| Excluir (lixeira)       | Atividade "Excluir agendamento"                     | padrão   |
 
| **Resultado**           | **Destino**                                         |
| ----------------------- | --------------------------------------------------- |
| Agendamentos encontrados | Listagem filtrada pelo termo digitado              |
| Nenhum resultado        | Listagem vazia                                      |
| Busca apagada           | Retorno ao calendário semanal padrão                |
 
---
 
#### Criar agendamento
 
| **Campo**               | **Tipo**       | **Restrições**             | **Valor padrão** |
| ----------------------- | -------------- | -------------------------- | ---------------- |
| Nome do serviço         | Caixa de texto | obrigatório                | vazio            |
| Cliente                 | Seleção única  | obrigatório                | vazio            |
| Prestador               | Seleção única  | obrigatório                | vazio            |
| Data                    | Data           | obrigatório; formato válido | vazio           |
| Horário de início       | Hora           | obrigatório; formato válido | vazio           |
| Duração                 | Caixa de texto | obrigatório                | 1 hora           |
| Valor                   | Numérico       | obrigatório; valor ≥ 0     | R$ 0,00          |
 
| **Comandos**  | **Destino**                                           | **Tipo** |
| ------------- | ----------------------------------------------------- | -------- |
| Adicionar     | Atividade "Acessar a lista de agendamentos"           | padrão   |
| Cancelar      | Atividade "Acessar a lista de agendamentos"           | cancelar |
 
| **Resultado**           | **Destino**                                           |
| ----------------------- | ----------------------------------------------------- |
| Agendamento criado      | Toast de sucesso e Atividade "Acessar a lista de agendamentos" |
| Prompt de erro          | "Campo inválido."                                     |
| Operação cancelada      | Atividade "Acessar a lista de agendamentos"           |
 
---
 
#### Visualizar detalhes do agendamento
 
| **Campo**               | **Tipo**  | **Restrições**  | **Valor padrão**                  |
| ----------------------- | --------- | --------------- | --------------------------------- |
| Serviço                 | Exibição  | somente leitura | dado do agendamento               |
| Cliente                 | Exibição  | somente leitura | dado do agendamento               |
| Prestador               | Exibição  | somente leitura | dado do agendamento               |
| Data                    | Exibição  | somente leitura | dado do agendamento               |
| Horário                 | Exibição  | somente leitura | dado do agendamento               |
| Duração                 | Exibição  | somente leitura | dado do agendamento               |
| Valor                   | Exibição  | somente leitura | dado do agendamento               |
| Status                  | Exibição  | somente leitura | dado do agendamento               |
 
| **Comandos**  | **Destino**                                           | **Tipo** |
| ------------- | ----------------------------------------------------- | -------- |
| Editar        | Atividade "Editar agendamento"                        | padrão   |
| Excluir       | Atividade "Excluir agendamento"                       | padrão   |
| X (fechar)    | Atividade "Acessar a lista de agendamentos"           | cancelar |
 
| **Resultado**           | **Destino**                                           |
| ----------------------- | ----------------------------------------------------- |
| Modal de edição aberto  | Atividade "Editar agendamento"                        |
| Modal de exclusão aberto | Atividade "Excluir agendamento"                      |
| Modal fechado           | Atividade "Acessar a lista de agendamentos"           |
 
---
 
#### Editar agendamento
 
| **Campo**               | **Tipo**       | **Restrições**             | **Valor padrão**        |
| ----------------------- | -------------- | -------------------------- | ----------------------- |
| Nome do serviço         | Caixa de texto | obrigatório                | atual preenchido        |
| Cliente                 | Caixa de texto | obrigatório                | atual preenchido        |
| Prestador               | Caixa de texto | obrigatório                | atual preenchido        |
| Data                    | Data           | obrigatório; formato válido | atual preenchido       |
| Horário de início       | Hora           | obrigatório; formato válido | atual preenchido       |
| Duração                 | Caixa de texto | obrigatório                | atual preenchido        |
| Valor                   | Numérico       | obrigatório; valor ≥ 0     | atual preenchido        |
 
| **Comandos**  | **Destino**                                           | **Tipo** |
| ------------- | ----------------------------------------------------- | -------- |
| Salvar        | Atividade "Acessar a lista de agendamentos"           | padrão   |
| Excluir       | Atividade "Excluir agendamento"                       | padrão   |
| Cancelar      | Atividade "Acessar a lista de agendamentos"           | cancelar |
| X (fechar)    | Atividade "Acessar a lista de agendamentos"           | cancelar |
 
| **Resultado**           | **Destino**                                           |
| ----------------------- | ----------------------------------------------------- |
| Agendamento alterado    | Toast de sucesso e Atividade "Acessar a lista de agendamentos" |
| Prompt de erro          | "Não foi possível salvar alteração. Tente novamente." |
| Operação cancelada      | Atividade "Acessar a lista de agendamentos"           |
 
---

#### Excluir / cancelar agendamento
 
| **Campo**               | **Tipo**  | **Restrições**  | **Valor padrão**             |
| ----------------------- | --------- | --------------- | ---------------------------- |
| Prompt de confirmação   | Exibição  | somente leitura | mensagem de confirmação      |
 
| **Comandos**  | **Destino**                                           | **Tipo** |
| ------------- | ----------------------------------------------------- | -------- |
| Excluir       | Atividade "Acessar a lista de agendamentos"           | padrão   |
| Cancelar      | Atividade "Acessar a lista de agendamentos"           | cancelar |
| X (fechar)    | Atividade "Acessar a lista de agendamentos"           | cancelar |
 
| **Resultado**           | **Destino**                                           |
| ----------------------- | ----------------------------------------------------- |
| Agendamento excluído    | Toast de sucesso e Atividade "Acessar a lista de agendamentos" |
| Operação cancelada      | Atividade "Acessar a lista de agendamentos"           |

### Wireframes

Os wireframes abaixo estão agrupados por perfil de acesso (**administrador**, **prestador/colaborador** e **cliente**), na ordem sugerida da jornada na interface.

#### Visualização do administrador

**Lista de agendamentos**

![Lista de agendamentos — administrador](images/wireframe/gestao-de-agendamento/wireframe_gestao-de-agendamento_admin-agendamentos.jpeg "Wireframe: lista de agendamentos (administrador)")

**Busca e filtros**

![Busca e filtros — administrador](images/wireframe/gestao-de-agendamento/wireframe_gestao-de-agendamento_admin-busca.jpeg "Wireframe: busca e filtros (administrador)")

**Criação de agendamento**

![Criação de agendamento — administrador](images/wireframe/gestao-de-agendamento/wireframe_gestao-de-agendamento_admin-criacao.jpeg "Wireframe: criação de agendamento (administrador)")

**Detalhes do agendamento**

![Detalhes do agendamento — administrador](images/wireframe/gestao-de-agendamento/wireframe_gestao-de-agendamento_admin-detalhes.jpeg "Wireframe: detalhes do agendamento (administrador)")

**Edição do agendamento**

![Edição do agendamento — administrador](images/wireframe/gestao-de-agendamento/wireframe_gestao-de-agendamento_admin-edicao.jpeg "Wireframe: edição do agendamento (administrador)")

#### Visualização do prestador (colaborador)

**Lista de agendamentos**

![Lista de agendamentos — prestador](images/wireframe/gestao-de-agendamento/wireframe_gestao-de-agendamento_prestador-agendamentos.jpeg "Wireframe: lista de agendamentos (prestador)")

**Busca e filtros**

![Busca e filtros — prestador](images/wireframe/gestao-de-agendamento/wireframe_gestao-de-agendamento_prestador-busca.jpeg "Wireframe: busca e filtros (prestador)")

**Detalhes do agendamento**

![Detalhes do agendamento — prestador](images/wireframe/gestao-de-agendamento/wireframe_gestao-de-agendamento_prestador-detalhes.jpeg "Wireframe: detalhes do agendamento (prestador)")

**Edição do agendamento**

![Edição do agendamento — prestador](images/wireframe/gestao-de-agendamento/wireframe_gestao-de-agendamento_prestador-edicao.jpeg "Wireframe: edição do agendamento (prestador)")

**Exclusão / cancelamento**

![Exclusão ou cancelamento — prestador](images/wireframe/gestao-de-agendamento/wireframe_gestao-de-agendamento_prestador-exclusao.jpeg "Wireframe: exclusão ou cancelamento (prestador)")

#### Visualização do cliente

**Lista de agendamentos**

![Lista de agendamentos — cliente](images/wireframe/gestao-de-agendamento/wireframe_gestao-de-agendamento_cliente-agendamentos.jpeg "Wireframe: lista de agendamentos (cliente)")

**Busca e filtros**

![Busca e filtros — cliente](images/wireframe/gestao-de-agendamento/wireframe_gestao-de-agendamento_cliente-busca.jpeg "Wireframe: busca e filtros (cliente)")

**Criação de agendamento**

![Criação de agendamento — cliente](images/wireframe/gestao-de-agendamento/wireframe_gestao-de-agendamento_cliente-criacao.jpeg "Wireframe: criação de agendamento (cliente)")

**Detalhes do agendamento**

![Detalhes do agendamento — cliente](images/wireframe/gestao-de-agendamento/wireframe_gestao-de-agendamento_cliente-detalhes.jpeg "Wireframe: detalhes do agendamento (cliente)")

**Edição do agendamento**

![Edição do agendamento — cliente](images/wireframe/gestao-de-agendamento/wireframe_gestao-de-agendamento_cliente-edicao.jpeg "Wireframe: edição do agendamento (cliente)")

**Exclusão / cancelamento**

![Exclusão ou cancelamento — cliente](images/wireframe/gestao-de-agendamento/wireframe_gestao-de-agendamento_cliente-exclusao.jpeg "Wireframe: exclusão ou cancelamento (cliente)")

