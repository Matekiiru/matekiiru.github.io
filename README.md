# Imobiliária Fachada - Site Institucional Completo

## 🏠 Visão Geral do Projeto

Este é o site institucional completo da **Imobiliária Fachada**, uma empresa do setor imobiliário que oferece serviços de compra, venda e aluguel de imóveis. O projeto foi desenvolvido como uma solução web moderna e responsiva, focada na experiência do usuário e na acessibilidade.

## 🎯 Propósito Principal

O site da Imobiliária Fachada tem como objetivo principal:

- **Apresentar a empresa** de forma profissional e atrativa
- **Exibir o portfólio de imóveis** disponíveis para compra, venda e aluguel
- **Facilitar o contato** entre clientes e a empresa
- **Fornecer informações institucionais** sobre história, valores e equipe
- **Oferecer uma experiência personalizada** através de sistema de configurações avançado
- **Garantir conformidade legal** com a LGPD através de sistema de cookies

## 🚀 Funcionalidades Principais

### 1. **Página Inicial (index.html)**
- **Hero Section**: Apresentação impactante com chamada para ação
- **Seção de Diferenciais**: Destaca os principais benefícios da empresa
- **Navegação intuitiva**: Menu responsivo com acesso a todas as seções
- **Notificação de Cookies**: Banner informativo sobre uso de cookies

### 2. **Catálogo de Imóveis (imoveis.html)**
- **Sistema de Filtros**: Busca por tipo de imóvel, operação, bairro, preço
- **Exibição em Grid**: Layout organizado e visualmente atrativo
- **Informações Detalhadas**: Dados completos de cada imóvel
- **Sistema de Paginação**: Navegação entre páginas de resultados

### 3. **Página Institucional (sobre.html)**
- **História da Empresa**: Trajetória desde 2008 até os dias atuais
- **Valores e Missão**: Princípios que norteiam a empresa
- **Equipe**: Apresentação dos profissionais
- **Estatísticas**: Números que demonstram o crescimento

### 4. **Sistema de Configurações (configuracoes.html)**
- **Personalização de Temas**: 6 paletas de cores pré-definidas + opção customizada
- **Controle de Tipografia**: 4 tamanhos de fonte ajustáveis
- **Layouts Alternativos**: 3 estilos de espaçamento diferentes
- **Cores Personalizadas**: Seletor de cores para tema totalmente customizado

### 5. **Sistema de Avaliações e Reviews**
- **Sistema de Estrelas**: Avaliação de 1 a 5 estrelas
- **Comentários dos Clientes**: Reviews detalhados sobre serviços
- **Moderação de Conteúdo**: Painel para aprovação/rejeição de reviews
- **Sistema de Respostas**: Equipe pode responder aos comentários
- **Estatísticas Avançadas**: Análise de tendências e distribuição de avaliações

## 🛠️ Como o Sistema Funciona

### **Arquitetura Técnica**

O site utiliza uma arquitetura **front-end completa** com as seguintes tecnologias:

- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Estilos responsivos com variáveis CSS para temas
- **JavaScript ES6+**: Lógica de negócio e interatividade
- **Bootstrap 5**: Framework CSS para componentes responsivos
- **Pure CSS**: Sistema de grid adicional para layouts
- **Font Awesome**: Biblioteca de ícones

### **Sistema de Configurações**

```javascript
class SiteSettings {
    // Gerencia todas as configurações do usuário
    // Salva automaticamente no localStorage
    // Aplica mudanças em tempo real
}
```

**Funcionamento:**
1. **Carregamento**: Ao abrir qualquer página, o sistema carrega as configurações salvas
2. **Aplicação**: As configurações são aplicadas via atributos `data-*` no elemento `<html>`
3. **Persistência**: Todas as mudanças são salvas automaticamente no localStorage
4. **Sincronização**: As configurações se aplicam a todas as páginas do site

### **Sistema de Cookies (LGPD)**

```javascript
class CookieManager {
    // Gerencia notificações sobre cookies
    // Implementa conformidade com a LGPD
    // Permite configurações granulares
}
```

**Funcionamento:**
1. **Detecção**: Verifica se o usuário já aceitou os cookies
2. **Notificação**: Mostra banner informativo se necessário
3. **Configuração**: Permite controle granular sobre tipos de cookies
4. **Armazenamento**: Salva preferências do usuário

### **Sistema de Avaliações**

```javascript
class ReviewSystem {
    // Gerencia todo o sistema de reviews
    // Inclui moderação e respostas
    // Gera estatísticas e análises
}
```

**Funcionamento:**
1. **Submissão**: Usuários podem enviar reviews com avaliações
2. **Moderação**: Equipe pode aprovar ou rejeitar reviews
3. **Respostas**: Funcionários podem responder aos comentários
4. **Estatísticas**: Sistema gera análises automáticas dos dados

## 🎨 Sistema de Temas e Personalização

### **Paletas de Cores Disponíveis**
- **Padrão**: Azul (#007bff) - Tema corporativo
- **Oceano**: Azul escuro (#0056b3) - Elegante e profissional
- **Floresta**: Verde (#28a745) - Natural e confiável
- **Pôr do Sol**: Laranja (#fd7e14) - Quente e acolhedor
- **Roxo**: Roxo (#6f42c1) - Criativo e único
- **Cinza**: Cinza (#6c757d) - Neutro e sofisticado
- **Personalizado**: Cores escolhidas pelo usuário

### **Tamanhos de Fonte**
- **Pequeno**: 0.875rem (14px) - Para telas pequenas
- **Médio**: 1rem (16px) - Padrão recomendado
- **Grande**: 1.125rem (18px) - Para melhor legibilidade
- **Extra Grande**: 1.25rem (20px) - Para acessibilidade

### **Layouts Disponíveis**
- **Padrão**: Espaçamento normal entre elementos
- **Compacto**: Menos espaço para telas menores
- **Espaçoso**: Mais espaço para melhor respiração visual

## 📱 Responsividade e Acessibilidade

### **Design Responsivo**
- **Mobile First**: Desenvolvido pensando primeiro em dispositivos móveis
- **Breakpoints**: Adaptação automática para diferentes tamanhos de tela
- **Grid System**: Layout flexível que se adapta ao conteúdo
- **Touch Friendly**: Interface otimizada para dispositivos touch

### **Acessibilidade**
- **Semântica HTML**: Estrutura clara e navegável por leitores de tela
- **Contraste**: Cores com contraste adequado para leitura
- **Navegação por Teclado**: Funcionalidade completa via teclado
- **Tamanhos de Fonte**: Opções para melhorar a legibilidade

## 🔒 Conformidade Legal (LGPD)

### **Sistema de Cookies**
- ✅ **Notificação obrigatória** sobre uso de cookies
- ✅ **Consentimento explícito** do usuário
- ✅ **Controle granular** sobre tipos de cookies
- ✅ **Armazenamento local** das preferências
- ✅ **Transparência** sobre uso de dados

### **Tipos de Cookies Gerenciados**
- **Necessários**: Sempre ativos (funcionamento básico do site)
- **Preferências**: Para salvar configurações do usuário
- **Análise**: Para estatísticas de uso (opcional)
- **Marketing**: Para publicidade (opcional)

## 📊 Funcionalidades Avançadas

### **Sistema de Filtros de Imóveis**
- Filtro por tipo (casa, apartamento, comercial, terreno)
- Filtro por operação (venda ou aluguel)
- Filtro por localização (bairro)
- Filtro por faixa de preço
- Busca por texto livre

### **Sistema de Reviews com Moderação**
- Avaliação por estrelas (1-5)
- Comentários detalhados
- Sistema de aprovação/rejeição
- Respostas da equipe
- Estatísticas e análises

### **Persistência de Dados**
- **localStorage**: Configurações salvas localmente
- **Sincronização**: Mudanças aplicadas em todas as páginas
- **Backup**: Recuperação automática de configurações
- **Reset**: Opção para restaurar configurações padrão

## 🚀 Como Executar o Projeto

### **Requisitos**
- Navegador web moderno (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)
- Servidor web local ou hospedagem

### **Instalação**
1. Clone ou baixe os arquivos do projeto
2. Abra o arquivo `index.html` em um navegador
3. Ou configure um servidor web local para melhor experiência

### **Estrutura de Arquivos**
```
trabalho/
├── index.html          # Página inicial
├── imoveis.html        # Catálogo de imóveis
├── sobre.html          # Página institucional
├── configuracoes.html  # Sistema de configurações
├── styles.css          # Estilos CSS com variáveis
├── script.js           # JavaScript principal
└── README.md           # Documentação
```

## 🎯 Casos de Uso

### **Para Clientes**
1. **Navegar pelo site** e conhecer a empresa
2. **Buscar imóveis** usando filtros avançados
3. **Personalizar a experiência** através das configurações
4. **Deixar avaliações** sobre serviços recebidos
5. **Entrar em contato** com a empresa

### **Para Funcionários**
1. **Gerenciar reviews** através do painel de moderação
2. **Responder comentários** dos clientes
3. **Acompanhar estatísticas** de satisfação
4. **Manter informações atualizadas** sobre imóveis

### **Para Desenvolvedores**
1. **Estender funcionalidades** adicionando novos temas
2. **Modificar layouts** através das variáveis CSS
3. **Adicionar novas configurações** ao sistema
4. **Integrar com APIs** externas se necessário

## 🔧 Manutenção e Extensibilidade

### **Adicionar Nova Configuração**
1. Adicione a opção no HTML da página de configurações
2. Crie as variáveis CSS correspondentes
3. Implemente a lógica no JavaScript
4. Atualize o sistema de persistência

### **Modificar Temas Existentes**
1. Edite as variáveis CSS em `styles.css`
2. Atualize as paletas visuais no HTML
3. Teste a aplicação em diferentes páginas
4. Verifique a responsividade

### **Adicionar Novos Tipos de Imóveis**
1. Inclua a opção nos filtros HTML
2. Atualize a lógica de filtros no JavaScript
3. Adicione estilos específicos se necessário
4. Teste a funcionalidade completa

## 📈 Performance e Otimização

### **Estratégias Implementadas**
- **localStorage**: Armazenamento local rápido
- **CSS Variables**: Aplicação instantânea de temas
- **Lazy Loading**: Configurações carregadas sob demanda
- **Minimal DOM**: Manipulação eficiente do DOM
- **CDN**: Bibliotecas externas carregadas via CDN

### **Métricas de Performance**
- **Tempo de Carregamento**: < 2 segundos
- **Tamanho Total**: < 500KB (sem imagens)
- **Responsividade**: Funciona em todas as resoluções
- **Compatibilidade**: Suporte a navegadores antigos

## 🐛 Solução de Problemas

### **Problemas Comuns**
1. **Configurações não salvam**: Verificar se localStorage está habilitado
2. **Temas não aplicam**: Verificar console para erros JavaScript
3. **Layout quebrado**: Verificar compatibilidade do navegador
4. **Cookies não funcionam**: Verificar configurações de privacidade

### **Debug e Logs**
- Console do navegador para erros JavaScript
- DevTools para inspeção de elementos
- Verificação de localStorage no DevTools
- Teste em diferentes navegadores

## 📚 Recursos e Referências

### **Tecnologias Utilizadas**
- **HTML5**: [MDN Web Docs](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
- **CSS3**: [MDN Web Docs](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
- **JavaScript**: [MDN Web Docs](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
- **Bootstrap 5**: [Documentação Oficial](https://getbootstrap.com/docs/5.3/)
- **Pure CSS**: [Documentação Oficial](https://purecss.io/)

### **Padrões e Boas Práticas**
- **LGPD**: Lei Geral de Proteção de Dados
- **WCAG**: Diretrizes de Acessibilidade para Conteúdo Web
- **Responsive Design**: Design responsivo para múltiplos dispositivos
- **Progressive Enhancement**: Melhoria progressiva da experiência

## 📄 Licença e Direitos Autorais

Este projeto é parte do site institucional da **Imobiliária Fachada** e está sujeito aos direitos autorais da empresa. O código foi desenvolvido para uso exclusivo da empresa e não pode ser reproduzido ou distribuído sem autorização.

---

**Desenvolvido com ❤️ para a Imobiliária Fachada**

