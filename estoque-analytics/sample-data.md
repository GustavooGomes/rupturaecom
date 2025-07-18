# Dados de Exemplo para Teste

Para testar a aplicação, você pode criar um arquivo Excel (.xlsx) com as seguintes colunas e dados de exemplo:

## Estrutura de Colunas

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R | S | T | U | V | W | X | Y |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ID VTEX | Produto | Derivação | Produto-Derivação | Nome Produto | Tipo. Produto | Tamanho | Descrição | Compl. | Estoque | Pronta Entrega | Regulador | Pedidos em Aberto | Preço | Venda 30d | Multiplo | Linha Comercial | Descrição Linha Comercial | Coleção Atual | Início Coleção | Fim Coleção | Fora de linha | Agrupamento de Custos | Usu.Alteração | Nome Usuário Alteração |

## Dados de Exemplo

### Travesseiros
```
12345,TRAV001,Base,TRAV001-Base,Travesseiro Memory Foam King,Travesseiro,King,Travesseiro em memory foam,Conforto premium,25,50,Normal,10,189.90,8,1,Premium,Linha Premium,Coleção 2024,01/01/2024,31/12/2024,FALSE,Travesseiros,admin,Administrador
12346,TRAV002,Base,TRAV002-Base,Travesseiro Pluma Queen,Travesseiro,Queen,Travesseiro em pluma de ganso,Leveza total,0,20,Normal,5,159.90,12,1,Premium,Linha Premium,Coleção 2024,01/01/2024,31/12/2024,FALSE,Travesseiros,admin,Administrador
12347,PROT001,Base,PROT001-Base,Protetor de Travesseiro King,Protetor de Travesseiro,King,Protetor impermeável,Proteção máxima,15,30,Normal,8,49.90,20,2,Básico,Linha Básica,Coleção 2024,01/01/2024,31/12/2024,FALSE,Protetores,admin,Administrador
```

### Linha Branca
```
12348,LENC001,Base,LENC001-Base,Lençol Percal King,Lençol,King,Lençol 100% algodão percal,Qualidade superior,40,25,Normal,15,129.90,25,1,Básico,Linha Branca,Coleção 2024,01/01/2024,31/12/2024,FALSE,Lençóis,admin,Administrador
12349,LENC002,Base,LENC002-Base,Lençol Percal Queen,Lençol,Queen,Lençol 100% algodão percal,Qualidade superior,0,10,Normal,20,99.90,30,1,Básico,Linha Branca,Coleção 2024,01/01/2024,31/12/2024,FALSE,Lençóis,admin,Administrador
12350,TOAL001,Base,TOAL001-Base,Toalha de Banho Premium,Toalha,70x140,Toalha 100% algodão,Extra absorvente,60,40,Normal,5,89.90,18,2,Premium,Linha Branca,Coleção 2024,01/01/2024,31/12/2024,FALSE,Toalhas,admin,Administrador
```

### Outros Produtos
```
12351,COLC001,Base,COLC001-Base,Colchão Molas King,Colchão,King,Colchão molas ensacadas,Conforto ortopédico,5,2,Normal,3,1299.90,4,1,Premium,Linha Premium,Coleção 2024,01/01/2024,31/12/2024,FALSE,Colchões,admin,Administrador
12352,COBR001,Base,COBR001-Base,Cobertor Microfibra Queen,Cobertor,Queen,Cobertor em microfibra,Aquecimento ideal,35,20,Normal,12,79.90,22,1,Básico,Linha Básica,Coleção 2023,01/01/2023,31/12/2023,TRUE,Cobertores,admin,Administrador
```

## Como Usar

1. Abra o Excel ou Google Sheets
2. Crie uma nova planilha
3. Cole os cabeçalhos na primeira linha
4. Cole os dados de exemplo nas linhas seguintes
5. Salve como arquivo .xlsx
6. Carregue na aplicação

## Resultados Esperados

Com esses dados de exemplo, você verá:

### Dashboard Geral
- **Total de SKUs**: 8 produtos
- **Itens em Ruptura**: 2 produtos (Travesseiro Pluma Queen e Lençol Percal Queen)
- **Pedidos Abertos**: 78 unidades total
- **Unidades em Estoque**: 180 unidades total
- **Vendas 30d**: 139 unidades total

### Área de Travesseiros
- 3 produtos exibidos (2 travesseiros + 1 protetor)
- 1 produto em ruptura (Travesseiro Pluma Queen)

### Área de Linha Branca
- 3 produtos exibidos (todos com "Linha Branca" na descrição)
- 1 produto em ruptura (Lençol Percal Queen)
- Interface com tema visual mais claro