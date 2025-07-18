# Estoque Analytics

Sistema moderno de controle de estoque e análise de ruptura baseado em planilhas Excel. Desenvolvido com Next.js, TypeScript e Tailwind CSS.

## 🚀 Funcionalidades

### Dashboard Geral
- **Métricas Principais**: Total de SKUs, itens em ruptura, pedidos abertos, unidades em estoque e vendas dos últimos 30 dias
- **Visualizações Analíticas**: Gráficos de barras e pizza para análise de estoque por tipo de produto e coleção
- **Análise de Ruptura**: Distribuição visual dos níveis de estoque

### Área de Travesseiros
- Filtro automático para produtos dos tipos "Travesseiro" e "Protetor de Travesseiro"
- Tabela interativa com ordenação e busca
- Indicador de status de ruptura
- Barra de progresso de cobertura (relação estoque/vendas)

### Área de Linha Branca
- Produtos filtrados por "Descrição Linha Comercial" = "Linha Branca"
- Interface com tema visual claro diferenciado
- Mesmas funcionalidades da área de travesseiros

## 📋 Estrutura do Excel Requerida

O arquivo Excel deve conter as seguintes colunas:

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| ID VTEX | Texto | Identificador único do produto |
| Produto | Texto | Nome do produto |
| Derivação | Texto | Variação do produto |
| Produto-Derivação | Texto | Combinação produto-derivação |
| Nome Produto | Texto | Nome completo do produto |
| Tipo. Produto | Texto | Categoria do produto |
| Tamanho | Texto | Tamanho do produto |
| Descrição | Texto | Descrição detalhada |
| Compl. | Texto | Complemento da descrição |
| Estoque | Número | Quantidade em estoque |
| Pronta Entrega | Número | Quantidade pronta para entrega |
| Regulador | Texto | Status do regulador |
| Pedidos em Aberto | Número | Quantidade de pedidos pendentes |
| Preço | Número | Preço do produto |
| Venda 30d | Número | Vendas dos últimos 30 dias |
| Multiplo | Número | Múltiplo de venda |
| Linha Comercial | Texto | Linha comercial do produto |
| Descrição Linha Comercial | Texto | Descrição da linha comercial |
| Coleção Atual | Texto | Coleção atual do produto |
| Início Coleção | Texto | Data de início da coleção |
| Fim Coleção | Texto | Data de fim da coleção |
| Fora de linha | Boolean | Produto fora de linha |
| Agrupamento de Custos | Texto | Grupo de custos |
| Usu.Alteração | Texto | Usuário que fez alteração |
| Nome Usuário Alteração | Texto | Nome do usuário |

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Estilização**: Tailwind CSS
- **Gráficos**: Recharts
- **Icons**: Lucide React
- **Excel Parsing**: SheetJS (xlsx)
- **Upload**: React Dropzone

## 🚀 Como Usar

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd estoque-analytics
```

2. Instale as dependências:
```bash
npm install
```

3. Execute a aplicação:
```bash
npm run dev
```

4. Acesse `http://localhost:3000` no seu navegador

### Uso da Aplicação

1. **Upload do Excel**: Na tela inicial, arraste e solte seu arquivo .xlsx ou clique para selecionar
2. **Navegação**: Use as abas para alternar entre Dashboard, Travesseiros e Linha Branca
3. **Análise**: Explore as métricas, gráficos e tabelas interativas
4. **Filtros**: Use a busca nas tabelas para encontrar produtos específicos
5. **Ordenação**: Clique nos cabeçalhos das colunas para ordenar os dados
6. **Atualização**: Clique em "Carregar Novo Arquivo" para substituir os dados

## 📊 Métricas e Indicadores

### Cobertura de Estoque
- **Verde (100%)**: Estoque adequado
- **Azul (30-99%)**: Estoque normal
- **Amarelo (15-29%)**: Estoque baixo
- **Vermelho (0-14%)**: Ruptura ou estoque crítico

### Status de Produtos
- **Disponível**: Estoque > 0
- **Ruptura**: Estoque = 0

## 🔧 Estrutura do Projeto

```
estoque-analytics/
├── app/
│   └── page.tsx              # Página principal
├── components/
│   ├── Charts.tsx            # Componentes de gráficos
│   ├── FileUpload.tsx        # Upload de arquivos
│   ├── MetricCard.tsx        # Cards de métricas
│   ├── Navigation.tsx        # Navegação entre abas
│   └── ProductTable.tsx      # Tabela de produtos
├── hooks/
│   └── useExcelData.ts       # Hook para gerenciar dados
├── types/
│   └── product.ts            # Definições de tipos
└── ...
```

## 🎨 Características da Interface

- **Design Responsivo**: Adaptável a desktop, tablet e mobile
- **Performance Otimizada**: Suporte para até 5.000 linhas
- **Interatividade**: Ordenação, filtros e busca em tempo real
- **Feedback Visual**: Loading states e mensagens de erro claras
- **Acessibilidade**: Componentes acessíveis e navegação por teclado

## 🚨 Tratamento de Erros

A aplicação possui validação robusta que verifica:
- Formato correto do arquivo Excel
- Presença de todas as colunas obrigatórias
- Tipos de dados apropriados
- Estrutura válida da planilha

## 📈 Performance

- **Parsing Otimizado**: Processamento eficiente de arquivos grandes
- **Renderização Inteligente**: Virtualização para tabelas extensas
- **Memoização**: Cálculos de métricas otimizados
- **Lazy Loading**: Carregamento sob demanda dos componentes

## 🔄 Atualizações

Para carregar um novo arquivo Excel:
1. Clique no botão "Carregar Novo Arquivo" no header
2. Selecione o novo arquivo
3. Os dados serão automaticamente atualizados sem refresh da página

## 📝 Notas Importantes

- Máximo de 5.000 linhas por arquivo para performance otimizada
- Formatos suportados: .xlsx e .xls
- Dados são processados localmente (não enviados para servidores)
- Interface adaptada para análises rápidas e tomada de decisões

---

Desenvolvido para otimizar o controle de estoque e facilitar a identificação de rupturas em tempo real.
