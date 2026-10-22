# AGENTS.md — Regras de Desenvolvimento & Governança

Este documento estabelece as diretrizes estritas, padrões de código e governança para o desenvolvimento do portfólio criativo de **Thalita de Oliveira Terrazan**.

---

## 1. Princípios Fundamentais

1. **Stack Tecnológica Base:**
   - O projeto é construído prioritariamente com **HTML5 semântico, CSS3 moderno e JavaScript puro (ES6+)**.
   - Bibliotecas visuais e 3D (como Three.js) são utilizadas estritamente para propósitos de alto impacto visual (WebGL, shaders, matemática 3D), mantendo o código desacoplado, limpo e sem frameworks desnecessários.

2. **Leitura Obrigatória Pré-Etapa:**
   - Antes de iniciar qualquer modificação ou nova etapa, é mandatória a leitura e consulta aos arquivos:
     - `referencias.md`: Diretrizes estéticas derivadas das análises de estúdios reais.
     - `identidade.md`: Informações pessoais oficiais, paleta de cores, tipografia e tom de voz.
     - `funcionalidades.md`: Estado atual e prioridades das funcionalidades.

3. **Veracidade e Integridade dos Dados:**
   - **Nenhum dado pessoal, projeto, certificado ou cargo profissional pode ser inventado.**
   - Todos os dados devem refletir com precisão a realidade de Thalita: 17 anos, estudante técnica de Informática, com projetos reais e escolares hospedados no GitHub oficial (`https://github.com/Thalita04`).
   - Se faltar qualquer informação, um espaço provisório claramente identificado (`[PLACEHOLDER]`) deve ser inserido ou a informação solicitada.

4. **Direção de Arte Anticlichê:**
   - Rejeição absoluta de layouts genéricos baseados em cartões pré-fabricados, gradientes roxos onipresentes e sem contraste, botões com sombras comuns ou efeitos de fade-in triviais.
   - A experiência deve evocar estúdios de vanguarda (ex.: Unseen Studio, Dennis Snellenberg, Lusion): tipografia monumental, movimento intencional, assimetria sofisticada, profundidade real e iluminação roxa pontual e calibrada.

5. **Desenvolvimento Estritamente por Etapas:**
   - Cada etapa do roadmap deve ser executada isoladamente.
   - Nenhuma etapa subsequente pode ser implementada sem a autorização explícita da usuária.

6. **Testes e Validação Contínua:**
   - Cada funcionalidade deve ser testada localmente antes de ser marcada como concluída em `funcionalidades.md`.
   - Registrar testes executados com honestidade técnica.

7. **Acessibilidade, Performance e Responsividade:**
   - Respeitar rigorosamente `prefers-reduced-motion` no CSS e JS (desativando animações contínuas ou intensas caso o usuário prefira movimento reduzido).
   - Manter taxa de quadros alvo de 60fps no desktop e mobile, adaptando a complexidade do WebGL para telas menores.
   - Navegação por teclado clara com estados `:focus-visible` evidentes e contraste adequado (WCAG AA).
   - O cursor customizado não pode esconder o cursor nativo em caso de erro e deve ser desabilitado em dispositivos de toque (`@media (pointer: coarse)`).

8. **Preservação de Código:**
   - Não remover funcionalidades existentes sem justificativa técnica documentada.
   - Manter arquivos bem comentados e estruturados modularmente.

9. **Registro de Dependências e Limitações:**
   - Todas as bibliotecas externas (CDNs, fontes) e eventuais limitações de rede ou hardware devem ser devidamente registradas em `README.md` e `referencias.md`.
