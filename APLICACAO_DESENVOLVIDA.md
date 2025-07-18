# Sistema de Controle de Estoque e Análise de Ruptura - Estoque Analytics

## 🎯 Visão Geral

Foi desenvolvida uma aplicação web moderna, escalável e visualmente intuitiva para controle de estoque e análise de ruptura de produtos, baseada na leitura de arquivos Excel (.xlsx) carregados pelo usuário. A aplicação atende completamente aos requisitos solicitados, oferecendo três áreas principais de análise: Dashboard Geral, Travesseiros e Linha Branca.

## 🏗️ Arquitetura Técnica

### Stack Tecnológica
- **Frontend**: Next.js 14 com App Router
- **Linguagem**: TypeScript para tipagem robusta
- **Estilização**: Tailwind CSS para design responsivo e moderno
- **Parsing Excel**: SheetJS (xlsx) para leitura eficiente de planilhas
- **Gráficos**: Recharts para visualizações analíticas
- **Componentes**: Lucide React para ícones consistentes
- **Upload**: React Dropzone para experiência fluida de upload

### Características Arquiteturais
- **Component-based**: Arquitetura modular com componentes reutilizáveis
- **Type-safe**: TypeScript em toda a aplicação para prevenção de erros
- **Performance**: Otimizado para arquivos com até 5.000 linhas
- **Responsivo**: Interface adaptável para desktop, tablet e mobile
- **Client-side**: Processamento local dos dados sem envio para servidores

## 📋 Funcionalidades Implementadas

### 1. Dashboard Geral
**Métricas Principais:**
- Total de SKUs ativos
- Número de itens com estoque zerado (ruptura)
- Total de pedidos em aberto
- Somatório de unidades em estoque
- Total de vendas dos últimos 30 dias

**Visualizações Analíticas:**
- Gráfico de barras: Estoque por tipo de produto
- Gráfico de barras: Estoque vs vendas por coleção
- Gráfico de pizza: Distribuição de ruptura (com estoque, estoque baixo, sem estoque)

**Filtros Dinâmicos:**
- Por tipo de produto
- Por tamanho
- Por coleção
- Por linha comercial

### 2. Área de Travesseiros
**Filtros Automáticos:**
- Produtos com "Tipo. Produto" = "Travesseiro"
- Produtos com "Tipo. Produto" = "Protetor de Travesseiro"

**Tabela Interativa:**
- Nome do produto e tamanho
- Estoque disponível e pronta entrega
- Múltiplo de venda
- Status de ruptura (visual com ícones)
- Vendas dos últimos 30 dias
- Barra de progresso de cobertura (relação estoque/vendas)

**Funcionalidades:**
- Ordenação por qualquer coluna
- Busca por nome do produto ou tamanho
- Identificação visual de rupturas

### 3. Área de Linha Branca
**Filtro Específico:**
- Produtos onde "Descrição Linha Comercial" = "Linha Branca"

**Interface Diferenciada:**
- Tema visual mais claro com cores suaves
- Mesma estrutura funcional da área de travesseiros
- Design específico para destacar a segmentação

**Funcionalidades Idênticas:**
- Tabela interativa com ordenação
- Busca e filtros
- Indicadores de cobertura e ruptura

## 🔧 Componentes Desenvolvidos

### 1. `useExcelData` (Hook Personalizado)
- Gerenciamento centralizado do estado dos dados
- Parsing robusto de arquivos Excel
- Validação de estrutura e colunas obrigatórias
- Cálculo de métricas em tempo real
- Filtros pré-processados para travesseiros e linha branca

### 2. `FileUpload` (Component)
- Drag & drop para arquivos Excel
- Validação de formato (.xlsx, .xls)
- Estados de loading e error
- Feedback visual interativo
- Instruções claras de uso

### 3. `Navigation` (Component)
- Navegação entre as três áreas
- Contadores dinâmicos por categoria
- Design responsivo
- Estado ativo visual

### 4. `MetricCard` (Component)
- Cards informativos para métricas
- Suporte a diferentes cores temáticas
- Formatação numérica brasileira
- Ícones contextuais

### 5. `ProductTable` (Component)
- Tabela totalmente interativa
- Ordenação multi-coluna
- Busca em tempo real
- Indicadores visuais de status
- Barra de progresso de cobertura
- Temas diferenciados (normal/linha branca)

### 6. `Charts` (Components)
- `StockByTypeChart`: Análise por tipo de produto
- `StockByCollectionChart`: Comparativo estoque vs vendas
- `RuptureDistributionChart`: Distribuição visual de rupturas
- Responsivos e interativos

## 📊 Interpretação de Dados

### Estrutura do Excel Requerida
A aplicação valida automaticamente a presença de 25 colunas obrigatórias:
- Identificação: ID VTEX, Produto, Derivação, etc.
- Características: Tipo. Produto, Tamanho, Descrição, etc.
- Números: Estoque, Pronta Entrega, Pedidos em Aberto, Preço, etc.
- Classificação: Linha Comercial, Coleção Atual, etc.
- Controle: Usuário de alteração, etc.

### Cálculos Automáticos
- **Ruptura**: Estoque = 0
- **Cobertura**: (Estoque / Vendas 30d) × 30 dias
- **Métricas agregadas**: Somas e contagens dinâmicas
- **Filtros contextuais**: Baseados nos dados carregados

## 🎨 Design e UX

### Interface Moderna
- Design limpo e profissional
- Paleta de cores consistente
- Tipografia hierárquica
- Espaçamento harmônico

### Responsividade
- Layout grid adaptável
- Componentes flexíveis
- Navegação otimizada para mobile
- Tabelas com scroll horizontal

### Feedback Visual
- Estados de loading
- Mensagens de erro detalhadas
- Indicadores de progresso
- Animações suaves

### Acessibilidade
- Navegação por teclado
- Contraste adequado
- Textos alternativos
- Semântica HTML apropriada

## 🚀 Performance e Otimização

### Processamento Eficiente
- Parsing assíncrono de Excel
- Memoização de cálculos caros
- Renderização otimizada de listas
- Debounce em filtros de busca

### Gerenciamento de Estado
- Estado local otimizado
- Re-renders minimizados
- Cálculos derivados eficientes
- Limpeza automática de recursos

### Escalabilidade
- Suporte a até 5.000 linhas
- Componentização modular
- Código reutilizável
- Arquitetura extensível

## 🔄 Fluxo de Uso

1. **Carregamento**: Usuário arrasta/seleciona arquivo Excel
2. **Validação**: Sistema verifica estrutura e colunas
3. **Processamento**: Parsing e cálculo de métricas
4. **Visualização**: Dados exibidos no dashboard
5. **Navegação**: Acesso às áreas específicas
6. **Análise**: Uso de filtros, ordenação e busca
7. **Atualização**: Novo upload substitui dados anteriores

## 🎯 Benefícios Entregues

### Para Gestão de Estoque
- Identificação rápida de rupturas
- Análise de cobertura por produto
- Visão consolidada de pedidos abertos
- Comparativo vendas vs estoque

### Para Tomada de Decisão
- Métricas em tempo real
- Visualizações intuitivas
- Filtros dinâmicos
- Dados sempre atualizados

### Para Operação
- Interface intuitiva
- Processo simplificado
- Sem dependência de sistemas externos
- Análises instantâneas

## 📝 Status de Desenvolvimento

✅ **Concluído e Funcional:**
- Todas as funcionalidades solicitadas
- Interface responsiva e moderna
- Validação robusta de dados
- Performance otimizada
- Documentação completa

✅ **Pronto para Uso:**
- Aplicação compilada sem erros
- Servidor de desenvolvimento ativo
- Dados de exemplo fornecidos
- Instruções de uso detalhadas

## 🔮 Possíveis Extensões Futuras

- Export de relatórios em PDF
- Alertas automáticos de ruptura
- Integração com APIs externas
- Histórico de uploads
- Dashboards personalizáveis
- Análises preditivas

---

**A aplicação desenvolvida atende completamente aos requisitos solicitados, oferecendo uma solução moderna, escalável e intuitiva para controle de estoque e análise de ruptura, com foco na experiência do usuário e performance otimizada.**