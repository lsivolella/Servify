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

![Modelo BPMN do Processo 3](images/bpmn/bpmn-gestao-de-agendamento.png "Modelo BPMN do Processo 3.")

### Detalhamento das atividades

**Exibir Formulário de Agendamento**
| **Campo**       | **Tipo**         | **Restrições** | **Valor default** |
| ---             | ---              | ---            | ---               |
| calendario | Data  |                |                   |
| agendamento | Hora |                |                |
| serviço | Caixa de Texto   |                |           |
| profissional | Seleção única |                |                   |

| **Comandos**         |  **Destino**                   | **Tipo** |
| ---                  | ---                            | ---               |
| Confirmar |[sim] -> Realiza Agendamento/ [Não] -> Agenda  |               |


**Exibir Agendamentos**

| **Campo**       | **Tipo**         | **Restrições** | **Valor default** |
| ---             | ---              | ---            | ---               |
| calendario | Data  |                |                   |
| agendamento | Hora |                |                |
| serviço | Caixa de Texto   |                |           |
| novoAgendamento | Link   |                |           |

| **Comandos**         |  **Destino**                   | **Tipo** |
| ---                  | ---                            | ---               |
| seletor de data | Atividade "Exibir Agendamento" em novas datas  |               |
| agendamento               | Atividade "Exibir Detalhes do Agendamento" |            |
| cadastrar            | Início do proceso de cadastro  |                   |


**Exibir Detalhes do Agendamento**

| **Campo**       | **Tipo**         | **Restrições** | **Valor default** |
| ---             | ---              | ---            | ---               |
| serviço | Caixa de Texto |                |                   |
| data | Data |                |                   |
| horario | Hora |                |                   |
| profissional | Caixa de Texto |                |                   |
| valor | Número |                |                   |


**Exibir Cancelamento de Agendamento**

| **Campo**       | **Tipo**         | **Restrições** | **Valor default** |
| ---             | ---              | ---            | ---               |
| serviço | Caixa de Texto |                |                   |
| data | Data |                |                   |
| horario | Hora |                |                   |
| profissional | Caixa de Texto |                |                   |
| valor | Número |
| Cancelar Agendamento | Seleção única |                |                   |

| **Comandos**         |  **Destino**                   | **Tipo**          |
| ---                  | ---                            | ---               |
| Cancelar Agendamento  | [sim] -> Excluir/ [Não] ->Agenda|                   |
|                      |                                |                   |


**Exibir Confirmação de Agendamento**
| **Campo**       | **Tipo**         | **Restrições** | **Valor default** |
| ---             | ---              | ---            | ---               |
| Confirmação | Caixa de Texto |                |                   |


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

