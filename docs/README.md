# TITULO DO PROJETO

**Arthur Henrique Figueiredo Cayres Burdignon, 1402037@sga.pucminas.br**

**Arthur Jansen Oliveira, 1380769@sga.pucminas.br**

**Bruna Pedrosa Nunes, 1118017@sga.pucminas.br**

**Lucas Gonçalves Sivolella, 685776@sga.pucminas.br**

**Vinicius Ramos Sales, 1221046@sga.pucminas.br**

---

Professores:

** Prof. Cleia Marcia Gomes Amaral **

** Prof. Joana Gabriela Ribeiro de Souza **

---

_Curso de Engenharia de Software_

_Instituto de Informática e Ciências Exatas – Pontifícia Universidade Católica de Minas Gerais (PUC MINAS), Belo Horizonte – MG – Brasil_

---

_**Resumo**. Escrever aqui o resumo. O resumo deve contextualizar rapidamente o trabalho, descrever seu objetivo e, ao final,
mostrar algum resultado relevante do trabalho (até 10 linhas)._

---

## 1. Introdução

Este trabalho apresenta a proposta de desenvolvimento de uma solução Web chamada Servify voltada à automação da gestão operacional e financeira de negócios do setor de serviços, com foco em empresas que trabalham com comissionamento por serviço prestado, como barbearias, salões de beleza e estúdios de estética.

### 1.1 Contextualização

O setor de serviços representa uma das principais forças da economia brasileira. Segundo dados do IBGE (2023), o setor de serviços corresponde a mais de 70% do PIB nacional, sendo responsável por grande parte da geração de empregos formais e informais no país. Dentro desse contexto, micro e pequenas empresas possuem papel fundamental, representando aproximadamente 99% dos negócios ativos no Brasil (SEBRAE, 2023).

Entre esses negócios estão barbearias, salões de beleza, estúdios de manicure e outros estabelecimentos que operam com prestação de serviços personalizados e remuneração baseada em comissão por serviço realizado. Apesar do crescimento desse segmento, muitos desses empreendedores ainda utilizam ferramentas não especializadas para controle do negócio, como planilhas eletrônicas (ex.: Microsoft Excel) ou anotações manuais.

Embora essas ferramentas atendam necessidades básicas, elas apresentam limitações relacionadas à escalabilidade, controle de acesso, automação de cálculos, geração de relatórios e segurança das informações. Além disso, a falta de sistemas integrados dificulta o acompanhamento em tempo real do faturamento, da produtividade dos colaboradores e do cálculo correto das comissões.

Diante desse cenário, observa-se uma oportunidade para o desenvolvimento de uma solução Web especializada, que automatize processos operacionais e financeiros de empresas do setor de serviços baseadas em comissionamento.

Durante o processo de pesquisa de mercado para este projeto, foi realizada uma entrevista com o proprietário de uma barbearia denominada Baixinho Hair. Durante a conversa, foi identificado que grande parte do controle operacional e financeiro do estabelecimento é realizado por meio de planilhas do Microsoft Excel. Segundo o proprietário, esse modelo de gestão apresenta limitações relacionadas à organização das informações, controle de faturamento e acompanhamento das comissões dos colaboradores.

O proprietário relatou ainda que a utilização de um sistema específico para gestão da barbearia poderia aumentar significativamente a eficiência operacional, facilitar o controle financeiro e melhorar o acompanhamento da produtividade dos profissionais.

Diante desse cenário, identificou-se uma oportunidade para o desenvolvimento de uma solução tecnológica que auxilie esse tipo de negócio na organização e automação de seus processos.

### 1.2 Problema

Empresas do setor de serviços que trabalham com comissão por atendimento enfrentam dificuldades na gestão e no controle das operações mensais. O cálculo manual das comissões pode gerar erros, retrabalho, conflitos internos e falta de transparência entre colaboradores e gestores.

Além disso, o uso de planilhas não estruturadas dificulta:
● O controle preciso dos serviços prestados por colaborador;
● A organização da agenda de atendimentos;
● A visualização consolidada do faturamento;
● A separação de permissões de acesso entre gestores e funcionários;
● A geração automatizada de relatórios mensais.

Essa realidade impacta diretamente na eficiência operacional, na tomada de decisão e na escalabilidade do negócio.

Portanto, o problema central tratado neste trabalho é:

Como automatizar o controle de serviços prestados, cálculo de comissões e gestão de agenda em empresas do setor de serviços com modelo de remuneração por comissão, garantindo segurança, organização e eficiência?

### 1.3 Objetivo geral

Desenvolver uma solução Web para automação da gestão operacional e financeira de empresas do setor de serviços que utilizam modelo de remuneração por comissão, permitindo controle de serviços, cálculo automático de comissões, gerenciamento de agenda e definição de níveis de acesso de usuários.

#### 1.3.1 Objetivos específicos

● Modelar os processos operacionais de empresas do setor de serviços comissionados, identificando suas principais necessidades de gestão;
● Desenvolver funcionalidades para cadastro de serviços, colaboradores e parametrização de percentuais de comissão;
● Implementar sistema de agendamento integrado ao controle financeiro;
● Criar mecanismo de cálculo automático de comissões mensais por colaborador;
● Definir níveis de acesso diferenciados (Administrador e Colaborador), garantindo segurança das informações;
● Desenvolver relatórios gerenciais que apoiem a tomada de decisão.
● Desenvolver uma tela de Dúvidas com um chat interativo integrado a uma IA, permitindo que o usuário converse de forma natural e receba respostas baseadas na base de dados do sistema.

---

### 1.4 Justificativas

A proposta se justifica pela relevância econômica do setor de serviços e pela alta incidência de micro e pequenas empresas que ainda operam com processos pouco automatizados.

O desenvolvimento da solução contribui para:
● Redução de erros no cálculo de comissões;
● Aumento da transparência entre gestores e colaboradores;
● Organização da agenda e dos atendimentos;
● Melhoria na gestão financeira do negócio;
● Apoio à tomada de decisão baseada em dados.

Além disso, o projeto possui caráter interdisciplinar, integrando conhecimentos de Engenharia de Software, modelagem de sistemas, banco de dados, experiência do usuário e arquitetura Web.

Como contribuição prática, a solução pode evoluir futuramente para um modelo SaaS (Software as a Service), ampliando sua aplicabilidade para diversos segmentos do mercado de serviços.

O diferencial da proposta está na criação de uma solução mais ampla, que não se restrinja exclusivamente a barbearias, mas que atenda qualquer empresa baseada em:
● Prestação de serviços;
● Remuneração por comissão;
● Gestão de agenda e equipe.

Essa abordagem amplia o potencial de mercado e torna o produto escalável.

## 2. Participantes do processo

A seguir, são apresentados os perfis dos usuários-chave do sistema:

◘ Administrador (Dono ou Gestor do Negócio)
Perfil:
● Idade média: 25 a 50 anos
● Nível de escolaridade: Ensino médio completo ou superior
● Conhecimento tecnológico: Básico a intermediário
● Perfil empreendedor, foco em gestão e crescimento

Responsabilidades no sistema:
● Cadastro de serviços e definição de valores;
● Cadastro e gestão de colaboradores;
● Parametrização de percentuais de comissão;
● Visualização de faturamento geral;
● Geração de relatórios financeiros;
● Controle de permissões de acesso;
● Acompanhamento da produtividade da equipe.

---

◘ Colaborador (Barbeiro, Manicure, Esteticista, etc.)
Perfil:
● Idade média: 18 a 45 anos
● Conhecimento tecnológico: Básico
● Foco principal na execução do serviço

Responsabilidades no sistema:
● Visualizar sua agenda de atendimentos;
● Registrar serviços realizados (quando aplicável);
● Consultar relatório individual de comissões;
● Acompanhar histórico de atendimentos.

Restrições:
● Não possui acesso ao faturamento global da empresa;
● Não visualiza dados salariais de outros colaboradores;
● Não altera parâmetros financeiros do sistema.

---

◘ Atendente/Recepcionista (Opcional)
Perfil:
● Responsável pelo agendamento e organização da agenda

Responsabilidades no sistema:
● Realizar agendamento de clientes;
● Alterar horários e reagendar serviços;
● Confirmar atendimentos;
● Consultar disponibilidade de colaboradores.

Restrições:
● Não possui acesso a relatórios financeiros detalhados;
● Não visualiza valores de comissão individual.

---

◘ Cliente (Opcional)
Perfil:
● Usuário final que utiliza os serviços oferecidos pelo estabelecimento;
● Pode acessar o sistema para agendar serviços ou acompanhar seus atendimentos.

Responsabilidades no sistema:
● Realizar agendamento de serviços;
● Consultar horários disponíveis;
● Visualizar histórico de atendimentos;
● Participar de programas de fidelidade ou bonificação.

Restrições:
● Não possui acesso a informações internas da empresa;
● Não visualiza dados de faturamento ou comissão;

## 3. Modelagem do processo de negócio

### 3.1. Análise da situação atual

_Apresente uma descrição textual de como os sistemas atuais resolvem o problema que seu projeto se propõe a resolver. Caso sua proposta seja inovadora e não existam processos claramente definidos, **apresente como as tarefas que o seu sistema pretende implementar são executadas atualmente**, mesmo que não se utilize tecnologia computacional._

### 3.2. Descrição geral da proposta de solução

_Apresente aqui uma descrição da sua proposta abordando seus limites e suas ligações com as estratégias do negócio e os objetivos geral e específicos do projeto. Apresente aqui as oportunidades de melhorias._

### 3.3. Modelagem dos processos

[PROCESSO 1 - Gestão de Comissão](processo-1-gestao-comissao.md "Detalhamento do Processo 1.")

[PROCESSO 2 - Gestão de Colaborador](processo-2-gestao-de-colaborador.md "Detalhamento do Processo 2.")

[PROCESSO 3 - Gestão de Agendamento](processo-3-gestao-de-agendamento.md "Detalhamento do Processo 3.")

[PROCESSO 4 - Gestão de Cliente](processo-4-gestao-de-cliente.md "Detalhamento do Processo 4.")

## 4. Projeto da solução

_O documento a seguir apresenta o detalhamento do projeto da solução. São apresentadas duas seções que descrevem, respectivamente: modelo relacional e tecnologias._

[Projeto da solução](solution-design.md "Detalhamento do projeto da solução: modelo relacional e tecnologias.")

## 5. Indicadores de desempenho

_O documento a seguir apresenta os indicadores de desempenho dos processos._

[Indicadores de desempenho dos processos](performance-indicators.md)

## 6. Interface do sistema

_A sessão a seguir apresenta a descrição do produto de software desenvolvido._

[Documentação da interface do sistema](interface.md)

## 7. Conclusão

_Apresente aqui a conclusão do seu trabalho. Deve ser apresentada aqui uma discussão dos resultados obtidos no trabalho, local em que se verifica as observações pessoais de cada aluno. Essa seção poderá também apresentar sugestões de novas linhas de estudo._

# REFERÊNCIAS

_Como um projeto de software não requer revisão bibliográfica, a inclusão das referências não é obrigatória. No entanto, caso você deseje incluir referências relacionadas às tecnologias, padrões, ou metodologias que serão usadas no seu trabalho, relacione-as de acordo com a ABNT._

_Verifique no link abaixo como devem ser as referências no padrão ABNT:_

http://portal.pucminas.br/imagedb/documento/DOC_DSC_NOME_ARQUI20160217102425.pdf

**[1.1]** - _ELMASRI, Ramez; NAVATHE, Sham. **Sistemas de banco de dados**. 7. ed. São Paulo: Pearson, c2019. E-book. ISBN 9788543025001._

**[1.2]** - _COPPIN, Ben. **Inteligência artificial**. Rio de Janeiro, RJ: LTC, c2010. E-book. ISBN 978-85-216-2936-8._

**[1.3]** - _CORMEN, Thomas H. et al. **Algoritmos: teoria e prática**. Rio de Janeiro, RJ: Elsevier, Campus, c2012. xvi, 926 p. ISBN 9788535236996._

**[1.4]** - _SUTHERLAND, Jeffrey Victor. **Scrum: a arte de fazer o dobro do trabalho na metade do tempo**. 2. ed. rev. São Paulo, SP: Leya, 2016. 236, [4] p. ISBN 9788544104514._

**[1.5]** - _RUSSELL, Stuart J.; NORVIG, Peter. **Inteligência artificial**. Rio de Janeiro: Elsevier, c2013. xxi, 988 p. ISBN 9788535237016._

# APÊNDICES

_Atualizar os links e adicionar novos links para que a estrutura do código esteja corretamente documentada._

## Apêndice A - Código fonte

[Código do front-end](../src/front) -- repositório do código do front-end

[Código do back-end](../src/back) -- repositório do código do back-end

## Apêndice B - Apresentação final

[Slides da apresentação final](presentations/)

[Vídeo da apresentação final](video/)
