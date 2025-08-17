// Configurações do site - Sistema de persistência com localStorage
class SiteSettings {
    constructor() {
        this.settings = {
            theme: 'default',
            fontSize: 'medium',
            layout: 'default',
            customColors: {
                primary: '#000000',
                secondary: '#ffffff',
                accent: '#cccccc',
                background: '#999999'
            }
        };
        
        this.init();
    }
    
    init() {
        this.loadSettings();
        this.applySettings();
        this.setupEventListeners();
        this.setupCookieNotice();
    }
    
    // Carrega as configurações salvas do localStorage
    loadSettings() {
        const savedSettings = localStorage.getItem('siteSettings');
        if (savedSettings) {
            try {
                this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
            } catch (e) {
                console.warn('Erro ao carregar configurações:', e);
            }
        }
    }
    
    // Salva as configurações no localStorage
    saveSettings() {
        try {
            localStorage.setItem('siteSettings', JSON.stringify(this.settings));
            this.showSaveNotification();
        } catch (e) {
            console.error('Erro ao salvar configurações:', e);
        }
    } 






    
    applySettings() {
        document.documentElement.setAttribute('data-theme', this.settings.theme);
        document.documentElement.setAttribute('data-font-size', this.settings.fontSize);
        document.documentElement.setAttribute('data-layout', this.settings.layout);

        const root = document.documentElement;
        if (this.settings.theme === 'custom') {
            this.applyCustomColors();
        } else {
            // Limpa variáveis customizadas para evitar conflitos
            root.style.removeProperty('--primary-color');
            root.style.removeProperty('--secondary-color');
            root.style.removeProperty('--accent-color');
            root.style.removeProperty('--background-color');
            root.style.removeProperty('--primary-color-rgb');
        }

        this.updateVisualSelections();
        // Ocultar bloco de cores personalizadas se não for custom
        const customColors = document.getElementById('custom-colors');
        if (customColors) {
            customColors.style.display = (this.settings.theme === 'custom') ? 'block' : 'none';
        }
    }
    // Aplica cores personalizadas
    applyCustomColors() {
        const root = document.documentElement;
        root.style.setProperty('--primary-color', this.settings.customColors.primary);
        root.style.setProperty('--secondary-color', this.settings.customColors.secondary);
        root.style.setProperty('--accent-color', this.settings.customColors.accent);
        root.style.setProperty('--background-color', this.settings.customColors.background);

        // Adiciona a variável --primary-color-rgb para temas personalizados
        const hex = this.settings.customColors.primary.replace('#', '');
        let r = 0, g = 0, b = 0;
        if (hex.length === 6) {
            r = parseInt(hex.substring(0,2), 16);
            g = parseInt(hex.substring(2,4), 16);
            b = parseInt(hex.substring(4,6), 16);
        }
        root.style.setProperty('--primary-color-rgb', `${r},${g},${b}`);
    }
    
    // Atualiza as seleções visuais na página de configurações
    updateVisualSelections() {
        // Atualizar paleta selecionada
        const paletteOptions = document.querySelectorAll('.palette-option');
        paletteOptions.forEach(option => {
            option.classList.remove('selected');
            if (option.dataset.palette === this.settings.theme) {
                option.classList.add('selected');
            }
        });
        
        // Atualizar tamanho da fonte selecionado
        const fontOptions = document.querySelectorAll('.font-option');
        fontOptions.forEach(option => {
            option.classList.remove('selected');
            if (option.dataset.size === this.settings.fontSize) {
                option.classList.add('selected');
            }
        });
        
        // Atualizar layout selecionado
        const layoutOptions = document.querySelectorAll('.layout-option');
        layoutOptions.forEach(option => {
            option.classList.remove('selected');
            if (option.dataset.layout === this.settings.layout) {
                option.classList.add('selected');
            }
        });
        
        // Atualizar cores personalizadas se aplicável
        if (this.settings.theme === 'custom') {
            document.getElementById('custom-primary').value = this.settings.customColors.primary;
            document.getElementById('custom-secondary').value = this.settings.customColors.secondary;
            document.getElementById('custom-accent').value = this.settings.customColors.accent;
            document.getElementById('custom-background').value = this.settings.customColors.background;
            document.getElementById('custom-colors').style.display = 'block';
        }
    }
    
    // Configura os event listeners para as configurações
    setupEventListeners() {
        // Event listeners para paletas de cores
        const paletteOptions = document.querySelectorAll('.palette-option');
        paletteOptions.forEach(option => {
            option.addEventListener('click', () => {
                this.changeTheme(option.dataset.palette);
            });
        });
        
        // Event listeners para tamanhos de fonte
        const fontOptions = document.querySelectorAll('.font-option');
        fontOptions.forEach(option => {
            option.addEventListener('click', () => {
                this.changeFontSize(option.dataset.size);
            });
        });
        
        // Event listeners para layouts
        const layoutOptions = document.querySelectorAll('.layout-option');
        layoutOptions.forEach(option => {
            option.addEventListener('click', () => {
                this.changeLayout(option.dataset.layout);
            });
        });
        
        // Event listeners para cores personalizadas
        const customColorInputs = document.querySelectorAll('input[type="color"]');
        customColorInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                this.updateCustomColor(e.target.id, e.target.value);
            });
        });
        
        // Event listener para botão de reset
        const resetButton = document.getElementById('reset-settings');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                this.resetSettings();
            });
        }
    }
    
    // Altera o tema do site
    changeTheme(theme) {
        this.settings.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        
        // Mostrar/ocultar seletor de cores personalizadas
        const customColors = document.getElementById('custom-colors');
        if (customColors) {
            customColors.style.display = theme === 'custom' ? 'block' : 'none';
        }
        
        // Aplicar cores personalizadas se necessário
        if (theme === 'custom') {
            this.applyCustomColors();
        }
        
        this.saveSettings();
        this.updateVisualSelections();
    }
    
    // Altera o tamanho da fonte
    changeFontSize(size) {
        this.settings.fontSize = size;
        document.documentElement.setAttribute('data-font-size', size);
        this.saveSettings();
        this.updateVisualSelections();
    }
    
    // Altera o layout
    changeLayout(layout) {
        this.settings.layout = layout;
        document.documentElement.setAttribute('data-layout', layout);
        this.saveSettings();
        this.updateVisualSelections();
    }
    
    // Atualiza uma cor personalizada
    updateCustomColor(inputId, color) {
        const colorType = inputId.replace('custom-', '');
        this.settings.customColors[colorType] = color;
        this.applyCustomColors();
        this.saveSettings();
    }
    
    // Reseta as configurações para os valores padrão
    resetSettings() {
        if (confirm('Tem certeza que deseja restaurar todas as configurações para os valores padrão?')) {
            this.settings = {
                theme: 'default',
                fontSize: 'medium',
                layout: 'default',
                customColors: {
                    primary: '#000000',
                    secondary: '#ffffff',
                    accent: '#cccccc',
                    background: '#999999'
                }
            };
            
            this.applySettings();
            this.saveSettings();
            
            // Mostrar notificação de reset
            this.showNotification('Configurações restauradas para os valores padrão!', 'success');
        }
    }
    
    // Mostra notificação de configuração salva
    showSaveNotification() {
        this.showNotification('Configurações salvas com sucesso!', 'success');
    }
    
    // Sistema de notificações
    showNotification(message, type = 'info') {
        if (!message) return;
        
        // Remover notificação existente se houver
        const existingNotification = document.querySelector('.alert');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show`;
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
    
    // Configura a notificação sobre cookies
    setupCookieNotice() {
        const cookieNotice = document.getElementById('cookie-notice');
        const acceptButton = document.getElementById('accept-cookies');
        
        if (!cookieNotice || !acceptButton) return;
        
        // Verificar se o usuário já aceitou os cookies
        const cookiesAccepted = localStorage.getItem('cookiesAccepted');
        
        if (!cookiesAccepted) {
            cookieNotice.classList.add('show');
        }
        
        // Event listener para aceitar cookies
        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieNotice.classList.remove('show');
            
            // Mostrar notificação de aceitação
            this.showNotification('Cookies aceitos. Obrigado por aceitar nossa política de cookies!', 'success');
        });
    }
}

// Sistema de gerenciamento de cookies para LGPD
class CookieManager {
    constructor() {
        this.cookiePolicy = {
            necessary: true, // Cookies essenciais sempre ativos
            analytics: false, // Cookies de análise (opcional)
            marketing: false, // Cookies de marketing (opcional)
            preferences: true // Cookies de preferências (para configurações)
        };
        
        this.init();
    }
    
    init() {
        this.loadCookiePreferences();
        this.setupCookieBanner();
    }
    
    // Carrega preferências de cookies
    loadCookiePreferences() {
        const savedPreferences = localStorage.getItem('cookiePreferences');
        if (savedPreferences) {
            try {
                this.cookiePolicy = { ...this.cookiePolicy, ...JSON.parse(savedPreferences) };
            } catch (e) {
                console.warn('Erro ao carregar preferências de cookies:', e);
            }
        }
    }
    
    // Salva preferências de cookies
    saveCookiePreferences() {
        try {
            localStorage.setItem('cookiePreferences', JSON.stringify(this.cookiePolicy));
            this.showNotification('Preferências de cookies salvas!', 'success');
        } catch (e) {
            console.error('Erro ao salvar preferências de cookies:', e);
        }
    }
    
    // Configura o banner de cookies
    setupCookieBanner() {
        const cookieBanner = document.getElementById('cookie-notice');
        if (!cookieBanner) return;
        
        // Adicionar botão de configurações avançadas
        const advancedButton = document.createElement('button');
        advancedButton.className = 'btn btn-outline-secondary btn-sm ms-2';
        advancedButton.textContent = 'Configurações';
        advancedButton.addEventListener('click', () => {
            this.showCookieSettings();
        });
        
        // Adicionar ao banner existente
        const container = cookieBanner.querySelector('.container');
        if (container) {
            container.appendChild(advancedButton);
        }
    }
    
    // Mostra configurações avançadas de cookies
    showCookieSettings() {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'cookieSettingsModal';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Configurações de Cookies</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p>Este site utiliza cookies para melhorar sua experiência. Você pode escolher quais tipos de cookies aceitar:</p>
                        
                        <div class="cookie-category mb-3">
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="necessaryCookies" checked disabled>
                                <label class="form-check-label" for="necessaryCookies">
                                    <strong>Cookies Necessários</strong>
                                    <small class="text-muted d-block">Essenciais para o funcionamento do site</small>
                                </label>
                            </div>
                        </div>
                        
                        <div class="cookie-category mb-3">
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="preferencesCookies">
                                <label class="form-check-label" for="preferencesCookies">
                                    <strong>Cookies de Preferências</strong>
                                    <small class="text-muted d-block">Salvam suas configurações e preferências</small>
                                </label>
                            </div>
                        </div>
                        
                        <div class="cookie-category mb-3">
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="analyticsCookies">
                                <label class="form-check-label" for="analyticsCookies">
                                    <strong>Cookies de Análise</strong>
                                    <small class="text-muted d-block">Nos ajudam a entender como você usa o site</small>
                                </label>
                            </div>
                        </div>
                        
                        <div class="cookie-category mb-3">
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="marketingCookies">
                                <label class="form-check-label" for="marketingCookies">
                                    <strong>Cookies de Marketing</strong>
                                    <small class="text-muted d-block">Usados para mostrar anúncios relevantes</small>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" id="saveCookieSettings">Salvar Preferências</button>
                    </div>
                </div>
            </div>
        `;
        
        // Adicionar ao body
        document.body.appendChild(modal);
        
        // Configurar valores iniciais
        document.getElementById('preferencesCookies').checked = this.cookiePolicy.preferences;
        document.getElementById('analyticsCookies').checked = this.cookiePolicy.analytics;
        document.getElementById('marketingCookies').checked = this.cookiePolicy.marketing;
        
        // Event listeners
        document.getElementById('saveCookieSettings').addEventListener('click', () => {
            this.saveCookieSettings();
            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) {
                modalInstance.hide();
            }
        });
        
        // Mostrar modal
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
        
        // Limpar modal após fechar
        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }
    
    // Salva configurações de cookies
    saveCookieSettings() {
        this.cookiePolicy.preferences = document.getElementById('preferencesCookies').checked;
        this.cookiePolicy.analytics = document.getElementById('analyticsCookies').checked;
        this.cookiePolicy.marketing = document.getElementById('marketingCookies').checked;
        
        this.saveCookiePreferences();
        
        // Aceitar cookies se pelo menos as preferências estiverem ativas
        if (this.cookiePolicy.preferences) {
            localStorage.setItem('cookiesAccepted', 'true');
            const cookieNotice = document.getElementById('cookie-notice');
            if (cookieNotice) {
                cookieNotice.classList.remove('show');
            }
        }
    }
    
    // Mostra notificação
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show`;
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar sistema de configurações
    window.siteSettings = new SiteSettings();
    
    // Inicializar gerenciador de cookies
    window.cookieManager = new CookieManager();
    
    // Inicializar sistema de avaliações
    window.reviewSystem = new ReviewSystem();
    
    // Inicializar sistema de imóveis
    window.propertySystem = new PropertySystem();
    
    // Adicionar estilos para notificações
    const style = document.createElement('style');
    style.textContent = `
        .settings-notification {
            animation: slideInRight 0.3s ease-out;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .palette-option.selected,
        .font-option.selected,
        .layout-option.selected {
            border-color: var(--primary-color) !important;
            background-color: rgba(var(--primary-color-rgb), 0.1) !important;
        }
        
        .cookie-category {
            padding: 15px;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            background-color: #f8f9fa;
        }
    `;
    document.head.appendChild(style);
});

// Função global para acessar configurações de outras páginas
window.getSiteSettings = () => {
    return window.siteSettings ? window.siteSettings.settings : null;
};

// Função global para aplicar configurações de outras páginas
window.applySiteSettings = () => {
    if (window.siteSettings) {
        window.siteSettings.applySettings();
    }
};

// Sistema de Avaliações de Serviços
class ReviewSystem {
    constructor() {
        this.reviews = [];
        this.reviewResponses = {}; // Respostas da imobiliária
        this.filters = {
            serviceType: '',
            rating: '',
            dateRange: ''
        };
        this.init();
    }
    
    init() {
        this.loadReviews();
        this.loadReviewResponses();
        this.setupEventListeners();
        this.renderReviews();
        this.renderStats();
        this.setupAdvancedFeatures();
    }
    
    // Carrega avaliações do localStorage
    loadReviews() {
        const savedReviews = localStorage.getItem('siteReviews');
        if (savedReviews) {
            try {
                this.reviews = JSON.parse(savedReviews);
            } catch (e) {
                console.warn('Erro ao carregar avaliações:', e);
                this.reviews = [];
            }
        }
        
        // Se não houver avaliações, criar algumas de exemplo
        if (this.reviews.length === 0) {
            this.createSampleReviews();
        }
    }
    
    // Carrega avaliações pendentes
    loadPendingReviews() {
        const savedPending = localStorage.getItem('pendingReviews');
        if (savedPending) {
            try {
                this.pendingReviews = JSON.parse(savedPending);
            } catch (e) {
                console.warn('Erro ao carregar avaliações pendentes:', e);
                this.pendingReviews = [];
            }
        }
    }
    
    // Carrega respostas às avaliações
    loadReviewResponses() {
        const savedResponses = localStorage.getItem('reviewResponses');
        if (savedResponses) {
            try {
                this.reviewResponses = JSON.parse(savedResponses);
            } catch (e) {
                console.warn('Erro ao carregar respostas:', e);
                this.reviewResponses = {};
            }
        }
        
        // Adicionar resposta específica para avaliação ID 5
        if (!this.reviewResponses[5]) {
            this.reviewResponses[5] = {
                id: Date.now(),
                reviewId: 5,
                text: "Bom dia. Não.",
                date: new Date().toISOString(),
                author: 'Imobiliária Fachada'
            };
            this.saveReviewResponses();
        }
    }
    
    // Cria avaliações de exemplo para demonstração
    createSampleReviews() {
        const sampleReviews = [
            {
                id: 1,
                name: 'Milo Castello',
                email: 'milo@email.com',
                serviceType: 'compra',
                rating: 5,
                qualityRating: 5,
                communicationRating: 5,
                comment: 'Muito bom! Sequestraram meu irmão.',
                date: '2024-01-15',
                anonymous: false,
                status: 'approved',
                helpful: 3,
                reported: false
            },
            {
                id: 2,
                name: 'Daniel Hartmann',
                email: 'daniel@email.com',
                serviceType: 'venda',
                rating: 4,
                qualityRating: 4,
                communicationRating: 5,
                comment: 'Tinha um cachorro estranho todo vermelho sangue na porta.',
                date: '2024-01-10',
                anonymous: false,
                status: 'approved',
                helpful: 2,
                reported: false
            },
            {
                id: 3,
                name: 'Elizabeth Webber',
                email: 'elizabeth@email.com',
                serviceType: 'aluguel',
                rating: 5,
                qualityRating: 5,
                communicationRating: 4,
                comment: 'Processo de aluguel muito simples e rápido. A imobiliária cuidou de tudo, desde a documentação até a entrega das chaves.',
                date: '2024-01-05',
                anonymous: false,
                status: 'approved',
                helpful: 1,
                reported: false
            },
            {
                id: 4,
                name: 'Arthur Cervero',
                email: 'arthur@email.com',
                serviceType: 'consultoria',
                rating: 3,
                qualityRating: 3,
                communicationRating: 2,
                comment: 'O serviço foi bom, mas a comunicação poderia ter sido melhor. Algumas informações demoraram para chegar.',
                date: '2024-01-20',
                anonymous: false,
                status: 'approved',
                helpful: 0,
                reported: false
            },
            {
                id: 5,
                name: 'Amelie Florence',
                email: 'amelie@email.com',
                serviceType: 'compra',
                rating: 5,
                qualityRating: 5,
                communicationRating: 5,
                comment: 'Quero o número daquele loiro 🤤🤤',
                date: '2024-01-25',
                anonymous: false,
                status: 'approved',
                helpful: 4,
                reported: false
            },
            {
                id: 6,
                name: 'Cristopher Cohen',
                email: 'cristopher@email.com',
                serviceType: 'venda',
                rating: 4,
                qualityRating: 4,
                communicationRating: 5,
                comment: 'Vendi meu apartamento em um tempo recorde e com um preço acima do esperado. Recomendo a todos!',
                date: '2024-01-28',
                anonymous: false,
                status: 'approved',
                helpful: 2,
                reported: false
            },
            {
                id: 7,
                name: 'Beatrice Portinari',
                email: 'beatrice@email.com',
                serviceType: 'aluguel',
                rating: 5,
                qualityRating: 5,
                communicationRating: 4,
                comment: 'Encontrei o apartamento perfeito para mim. A imobiliária facilitou todo o processo de aluguel e exorcisou o lugar.',
                date: '2024-01-30',
                anonymous: false,
                status: 'approved',
                helpful: 1,
                reported: false
            },
            {
                id: 8,
                name: 'Lucciano Carvalho',
                email: 'luciano@email.com',
                serviceType: 'consultoria',
                rating: 4,
                qualityRating: 4,
                communicationRating: 4,
                comment: 'Excelente consultoria para investimento imobiliário. A equipe tem muito conhecimento do mercado. E de outras coisas aparentemente.',
                date: '2024-02-01',
                anonymous: false,
                status: 'approved',
                helpful: 3,
                reported: false
            }
        ];
        
        this.reviews = sampleReviews;
        this.saveReviews();
    }
    
    // Salva avaliações no localStorage
    saveReviews() {
        try {
            localStorage.setItem('siteReviews', JSON.stringify(this.reviews));
        } catch (e) {
            console.error('Erro ao salvar avaliações:', e);
        }
    }
    
    // Salva avaliações pendentes
    savePendingReviews() {
        try {
            localStorage.setItem('pendingReviews', JSON.stringify(this.pendingReviews));
        } catch (e) {
            console.error('Erro ao salvar avaliações pendentes:', e);
        }
    }
    
    // Salva respostas às avaliações
    saveReviewResponses() {
        try {
            localStorage.setItem('reviewResponses', JSON.stringify(this.reviewResponses));
        } catch (e) {
            console.error('Erro ao salvar respostas:', e);
        }
    }
    
    // Configura funcionalidades avançadas
    setupAdvancedFeatures() {
        this.setupReviewFilters();
        this.setupModerationPanel();
        this.setupResponseSystem();
        this.setupHelpfulSystem();
    }
    
    // Configura sistema de útil
    setupHelpfulSystem() {
        // Sistema de útil já está implementado em addResponseButtons
        // Esta função pode ser expandida no futuro para funcionalidades adicionais
    }
    
    // Configura filtros de avaliações
    setupReviewFilters() {
        const filterContainer = document.querySelector('.reviews-filters');
        if (!filterContainer) return;
        
        filterContainer.innerHTML = `
            <div class="row g-3 mb-4">
                <div class="col-md-3">
                    <select class="form-select" id="filterServiceType">
                        <option value="">Todos os Serviços</option>
                        <option value="compra">Compra</option>
                        <option value="venda">Venda</option>
                        <option value="aluguel">Aluguel</option>
                        <option value="consultoria">Consultoria</option>
                        <option value="outro">Outro</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <select class="form-select" id="filterRating">
                        <option value="">Todas as Avaliações</option>
                        <option value="5">5 Estrelas</option>
                        <option value="4">4+ Estrelas</option>
                        <option value="3">3+ Estrelas</option>
                        <option value="2">2+ Estrelas</option>
                        <option value="1">1+ Estrelas</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <select class="form-select" id="filterDateRange">
                        <option value="">Todas as Datas</option>
                        <option value="7">Últimos 7 dias</option>
                        <option value="30">Últimos 30 dias</option>
                        <option value="90">Últimos 3 meses</option>
                        <option value="365">Último ano</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <select class="form-select" id="filterStatus">
                        <option value="approved">Aprovadas</option>
                        <option value="pending">Pendentes</option>
                        <option value="rejected">Rejeitadas</option>
                    </select>
                </div>
            </div>
        `;
        
        // Event listeners para filtros com verificações de segurança
        const filterElements = {
            serviceType: document.getElementById('filterServiceType'),
            rating: document.getElementById('filterRating'),
            dateRange: document.getElementById('filterDateRange'),
            status: document.getElementById('filterStatus')
        };
        
        Object.values(filterElements).forEach(element => {
            if (element) {
                element.addEventListener('change', () => this.applyFilters());
            }
        });
    }
    
    // Aplica filtros às avaliações
    applyFilters() {
        const filterElements = {
            serviceType: document.getElementById('filterServiceType'),
            rating: document.getElementById('filterRating'),
            dateRange: document.getElementById('filterDateRange'),
            status: document.getElementById('filterStatus')
        };
        
        this.filters.serviceType = filterElements.serviceType?.value || '';
        this.filters.rating = filterElements.rating?.value || '';
        this.filters.dateRange = filterElements.dateRange?.value || '';
        this.filters.status = filterElements.status?.value || 'approved';
        
        this.renderReviews();
        this.renderStats();
    }
    
    // Filtra avaliações baseado nos critérios
    getFilteredReviews() {
        let filtered = [...this.reviews];
        
        // Filtrar por tipo de serviço
        if (this.filters.serviceType) {
            filtered = filtered.filter(review => review.serviceType === this.filters.serviceType);
        }
        
        // Filtrar por avaliação
        if (this.filters.rating) {
            const minRating = parseInt(this.filters.rating);
            filtered = filtered.filter(review => review.rating >= minRating);
        }
        
        // Filtrar por data
        if (this.filters.dateRange) {
            const days = parseInt(this.filters.dateRange);
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);
            filtered = filtered.filter(review => new Date(review.date) >= cutoffDate);
        }
        
        // Filtrar por status
        if (this.filters.status) {
            filtered = filtered.filter(review => review.status === this.filters.status);
        }
        
        return filtered;
    }
    
    // Configura painel de moderação
    setupModerationPanel() {
        const moderationContainer = document.querySelector('.moderation-panel');
        if (!moderationContainer) return;
        
        moderationContainer.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h5><i class="fas fa-shield-alt"></i> Painel de Moderação</h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="moderation-stat">
                                <h6>Avaliações Pendentes</h6>
                                <span class="badge bg-warning">${this.pendingReviews.length}</span>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="moderation-stat">
                                <h6>Avaliações Aprovadas</h6>
                                <span class="badge bg-success">${this.reviews.filter(r => r.status === 'approved').length}</span>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="moderation-stat">
                                <h6>Total de Avaliações</h6>
                                <span class="badge bg-info">${this.reviews.length + this.pendingReviews.length}</span>
                            </div>
                        </div>
                    </div>
                    
                    ${this.pendingReviews.length > 0 ? `
                        <div class="mt-3">
                            <h6>Avaliações Pendentes de Moderação:</h6>
                            <div class="pending-reviews-list">
                                ${this.pendingReviews.map(review => this.renderPendingReview(review)).join('')}
                            </div>
                        </div>
                    ` : '<p class="text-muted mt-3">Nenhuma avaliação pendente de moderação.</p>'}
                </div>
            </div>
        `;
    }
    
    // Renderiza avaliação pendente para moderação
    renderPendingReview(review) {
        return `
            <div class="pending-review-item border rounded p-3 mb-2">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <strong>${review.name}</strong> - ${this.getServiceTypeLabel(review.serviceType)}
                        <div class="star-rating-display">${this.generateStars(review.rating)}</div>
                        <p class="mb-1">${review.comment}</p>
                        <small class="text-muted">${this.formatDate(review.date)}</small>
                    </div>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-success btn-sm" onclick="window.reviewSystem.approveReview(${review.id})">
                            <i class="fas fa-check"></i> Aprovar
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="window.reviewSystem.rejectReview(${review.id})">
                            <i class="fas fa-times"></i> Rejeitar
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Aprova uma avaliação
    approveReview(reviewId) {
        if (!reviewId) return;
        
        const pendingIndex = this.pendingReviews.findIndex(r => r.id === reviewId);
        if (pendingIndex === -1) return;
        
        const review = this.pendingReviews.splice(pendingIndex, 1)[0];
        if (review) {
            review.status = 'approved';
            this.reviews.unshift(review);
            
            this.saveReviews();
            this.savePendingReviews();
            this.setupModerationPanel();
            this.renderReviews();
            this.renderStats();
            
            this.showNotification('Avaliação aprovada com sucesso!', 'success');
        }
    }
    
    // Rejeita uma avaliação
    rejectReview(reviewId) {
        if (!reviewId) return;
        
        const pendingIndex = this.pendingReviews.findIndex(r => r.id === reviewId);
        if (pendingIndex === -1) return;
        
        this.pendingReviews.splice(pendingIndex, 1);
        this.savePendingReviews();
        this.setupModerationPanel();
        
        this.showNotification('Avaliação rejeitada.', 'info');
    }
    
    // Configura sistema de resposta
    setupResponseSystem() {
        // Adicionar botões de resposta às avaliações existentes
        this.addResponseButtons();
    }
    
    // Adiciona botões de resposta às avaliações
    addResponseButtons() {
        const reviewCards = document.querySelectorAll('.review-card');
        if (!reviewCards || reviewCards.length === 0) return;
        
        reviewCards.forEach(card => {
            if (!card.querySelector('.response-section')) {
                const responseSection = document.createElement('div');
                responseSection.className = 'response-section mt-3';
                responseSection.innerHTML = `
                    <div class="d-flex justify-content-between align-items-center">
                        <button class="btn btn-outline-primary btn-sm" onclick="window.reviewSystem.showResponseForm(this)">
                            <i class="fas fa-reply"></i> Responder
                        </button>
                        <button class="btn btn-outline-secondary btn-sm" onclick="window.reviewSystem.markHelpful(this)">
                            <i class="fas fa-thumbs-up"></i> Útil (0)
                        </button>
                    </div>
                `;
                card.appendChild(responseSection);
            }
        });
    }
    
    // Mostra formulário de resposta
    showResponseForm(button) {
        if (!button) return;
        
        const reviewCard = button.closest('.review-card');
        if (!reviewCard) return;
        
        const reviewId = reviewCard.dataset.reviewId;
        if (!reviewId) return;
        
        const responseForm = document.createElement('div');
        responseForm.className = 'response-form mt-3';
        responseForm.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h6><i class="fas fa-reply"></i> Responder à Avaliação</h6>
                    <textarea class="form-control mb-2" rows="3" placeholder="Digite sua resposta..."></textarea>
                    <div class="d-flex gap-2">
                        <button class="btn btn-primary btn-sm" onclick="window.reviewSystem.submitResponse(${reviewId}, this)">
                            <i class="fas fa-paper-plane"></i> Enviar Resposta
                        </button>
                        <button class="btn btn-secondary btn-sm" onclick="this.closest('.response-form').remove()">
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Remover formulário existente se houver
        const existingForm = reviewCard.querySelector('.response-form');
        if (existingForm) {
            existingForm.remove();
        }
        
        reviewCard.appendChild(responseForm);
    }
    
    // Submete resposta à avaliação
    submitResponse(reviewId, button) {
        if (!button) return;
        
        const responseForm = button.closest('.response-form');
        if (!responseForm) return;
        
        const textarea = responseForm.querySelector('textarea');
        if (!textarea) return;
        
        const responseText = textarea.value.trim();
        
        if (!responseText) {
            this.showNotification('Por favor, digite uma resposta.', 'warning');
            return;
        }
        
        const response = {
            id: Date.now(),
            reviewId: reviewId,
            text: responseText,
            date: new Date().toISOString(),
            author: 'Imobiliária Fachada'
        };
        
        this.reviewResponses[reviewId] = response;
        this.saveReviewResponses();
        
        // Mostrar resposta na interface
        this.showResponse(reviewId, response);
        responseForm.remove();
        
        this.showNotification('Resposta enviada com sucesso!', 'success');
    }
    
    // Mostra resposta na interface
    showResponse(reviewId, response) {
        if (!reviewId || !response) return;
        
        const reviewCard = document.querySelector(`[data-review-id="${reviewId}"]`);
        if (!reviewCard) return;
        
        const responseSection = reviewCard.querySelector('.response-section');
        if (responseSection) {
            responseSection.innerHTML = `
                <div class="response-display border-start border-primary ps-3">
                    <div class="response-header">
                        <strong>${response.author}</strong>
                        <small class="text-muted">${this.formatDate(response.date)}</small>
                    </div>
                    <div class="response-text">${response.text}</div>
                </div>
                <div class="mt-2">
                    <button class="btn btn-outline-secondary btn-sm" onclick="window.reviewSystem.markHelpful(this)">
                        <i class="fas fa-thumbs-up"></i> Útil (${this.reviews.find(r => r.id === parseInt(reviewId))?.helpful || 0})
                    </button>
                </div>
            `;
        }
    }
    
    // Marca avaliação como útil
    markHelpful(button) {
        if (!button) return;
        
        const reviewCard = button.closest('.review-card');
        if (!reviewCard) return;
        
        const reviewId = reviewCard.dataset.reviewId;
        if (!reviewId) return;
        
        const review = this.reviews.find(r => r.id === parseInt(reviewId));
        if (review) {
            review.helpful = (review.helpful || 0) + 1;
            this.saveReviews();
            
            const helpfulText = button.querySelector('i').nextSibling;
            if (helpfulText) {
                helpfulText.textContent = ` Útil (${review.helpful})`;
            }
            
            button.disabled = true;
            button.classList.add('btn-success');
            button.classList.remove('btn-outline-secondary');
        }
    }
    
    // Configura event listeners
    setupEventListeners() {
        const reviewForm = document.getElementById('reviewForm');
        if (reviewForm) {
            reviewForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitReview();
            });
        }
        
        // Event listeners para estrelas
        const starInputs = document.querySelectorAll('.star-rating input[type="radio"]');
        if (starInputs && starInputs.length > 0) {
            starInputs.forEach(input => {
                input.addEventListener('change', () => {
                    this.updateStarDisplay(input.value);
                });
            });
        }
    }
    
    // Atualiza a exibição das estrelas
    updateStarDisplay(rating) {
        const starLabels = document.querySelectorAll('.star-label');
        if (!starLabels || starLabels.length === 0) return;
        
        starLabels.forEach((label, index) => {
            if (index < rating) {
                label.style.color = '#ffc107';
            } else {
                label.style.color = '#ddd';
            }
        });
    }
    
    // Submete uma nova avaliação
    submitReview() {
        const form = document.getElementById('reviewForm');
        if (!form) {
            console.error('Formulário de avaliação não encontrado');
            return;
        }
        
        const formData = new FormData(form);
        const name = document.getElementById('reviewerName')?.value || '';
        const email = document.getElementById('reviewerEmail')?.value || '';
        const serviceType = document.getElementById('serviceType')?.value || '';
        const rating = document.querySelector('input[name="rating"]:checked')?.value;
        const qualityRating = document.getElementById('qualityRating')?.value || '';
        const communicationRating = document.getElementById('communicationRating')?.value || '';
        const comment = document.getElementById('reviewComment')?.value || '';
        const anonymous = document.getElementById('anonymousReview')?.checked || false;
        
        // Validações
        if (!name || !serviceType || !rating) {
            this.showNotification('Por favor, preencha todos os campos obrigatórios.', 'warning');
            return;
        }
        
        // Criar nova avaliação
        const newReview = {
            id: Date.now(),
            name: anonymous ? 'Cliente Anônimo' : name,
            email: anonymous ? '' : email,
            serviceType: serviceType,
            rating: parseInt(rating),
            qualityRating: qualityRating ? parseInt(qualityRating) : null,
            communicationRating: communicationRating ? parseInt(communicationRating) : null,
            comment: comment,
            date: new Date().toISOString().split('T')[0],
            anonymous: anonymous,
            status: 'approved', // Avaliação aprovada automaticamente
            helpful: 0,
            reported: false
        };
        
        // Adicionar diretamente à lista de avaliações aprovadas
        this.reviews.unshift(newReview);
        this.saveReviews();
        
        // Atualizar interface
        this.renderReviews();
        this.renderStats();
        
        // Fechar modal e mostrar notificação
        const modalElement = document.getElementById('reviewModal');
        if (modalElement) {
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();
        }
        
        this.showNotification('Avaliação enviada com sucesso!', 'success');
        
        // Limpar formulário
        form.reset();
        this.updateStarDisplay(0);
    }
    
    // Renderiza as avaliações no carrossel
    renderReviews() {
        // Detectar em qual página estamos e renderizar adequadamente
        const currentPage = this.getCurrentPage();
        
        if (currentPage === 'index') {
            this.renderReviewsForPage('reviews-carousel-inner');
        } else if (currentPage === 'imoveis') {
            this.renderReviewsForPage('reviews-carousel-inner-imoveis');
        }
    }
    
    // Renderiza avaliações para uma página específica
    renderReviewsForPage(carouselId) {
        const carouselInner = document.getElementById(carouselId);
        if (!carouselInner) return;
        
        carouselInner.innerHTML = '';
        
        const filteredReviews = this.getFilteredReviews();
        
        if (!filteredReviews || filteredReviews.length === 0) {
            carouselInner.innerHTML = `
                <div class="carousel-item active">
                    <div class="review-card">
                        <p>Nenhuma avaliação encontrada com os filtros aplicados.</p>
                    </div>
                </div>
            `;
            return;
        }
        
        filteredReviews.forEach((review, index) => {
            if (!review || typeof review !== 'object') return;
            
            const carouselItem = document.createElement('div');
            carouselItem.className = `carousel-item ${index === 0 ? 'active' : ''}`;
            
            carouselItem.innerHTML = `
                <div class="review-card" data-review-id="${review.id || ''}">
                    <div class="review-header">
                        <div class="reviewer-name">${review.name || 'Anônimo'}</div>
                        <div class="reviewer-service">${this.getServiceTypeLabel(review.serviceType || '')}</div>
                    </div>
                    
                    <div class="review-rating">
                        <div class="star-rating-display">${this.generateStars(review.rating || 0)}</div>
                        <div class="rating-details">
                            ${review.qualityRating ? `<small>Qualidade: ${this.getRatingLabel(review.qualityRating)}</small><br>` : ''}
                            ${review.communicationRating ? `<small>Comunicação: ${this.getRatingLabel(review.communicationRating)}</small>` : ''}
                        </div>
                    </div>
                    
                    ${review.comment ? `<div class="review-comment">"${review.comment}"</div>` : ''}
                    
                    <div class="review-date">
                        ${this.formatDate(review.date || '')}
                    </div>
                    
                    ${this.reviewResponses[review.id] ? this.renderResponse(this.reviewResponses[review.id]) : ''}
                    
                    <div class="response-section mt-3">
                        <div class="d-flex justify-content-between align-items-center">
                            <button class="btn btn-outline-primary btn-sm" onclick="window.reviewSystem.showResponseForm(this)">
                                <i class="fas fa-reply"></i> Responder
                            </button>
                            <button class="btn btn-outline-secondary btn-sm" onclick="window.reviewSystem.markHelpful(this)">
                                <i class="fas fa-thumbs-up"></i> Útil (${review.helpful || 0})
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            carouselInner.appendChild(carouselItem);
        });
    }
    
    // Renderiza resposta à avaliação
    renderResponse(response) {
        return `
            <div class="response-display border-start border-primary ps-3 mt-3">
                <div class="response-header">
                    <strong>${response.author}</strong>
                    <small class="text-muted">${this.formatDate(response.date)}</small>
                </div>
                <div class="response-text">${response.text}</div>
            </div>
        `;
    }
    
    // Detecta em qual página estamos
    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('imoveis')) return 'imoveis';
        if (path.includes('sobre')) return 'sobre';
        if (path.includes('configuracoes')) return 'configuracoes';
        return 'index';
    }
    
    // Renderiza estatísticas das avaliações
    renderStats() {
        if (this.reviews.length === 0) return;
        
        const statsContainer = document.querySelector('.reviews-stats');
        if (!statsContainer) return;
        
        const filteredReviews = this.getFilteredReviews();
        if (!filteredReviews || filteredReviews.length === 0) return;
        
        const averageRating = this.calculateAverageRating(filteredReviews);
        const ratingDistribution = this.calculateRatingDistribution(filteredReviews);
        const serviceTypeStats = this.calculateServiceTypeStats(filteredReviews);
        const trendAnalysis = this.calculateTrendAnalysis(filteredReviews);
        const recentReviews = this.getRecentReviews(filteredReviews, 5);
        
        statsContainer.innerHTML = `
            <div class="row">
                <div class="col-md-4">
                    <div class="rating-summary">
                        <div class="average-rating text-center">
                            <div class="average-score">${averageRating.toFixed(1)}</div>
                            <div class="star-rating-display">${this.generateStars(Math.round(averageRating))}</div>
                            <small>${filteredReviews.length} avaliações</small>
                        </div>
                        
                        <div class="rating-bars mt-3">
                            ${this.generateRatingBars(ratingDistribution)}
                        </div>
                    </div>
                </div>
                
                <div class="col-md-4">
                    <div class="service-type-analysis">
                        <h6>Análise por Tipo de Serviço</h6>
                        ${this.generateServiceTypeStats(serviceTypeStats)}
                    </div>
                </div>
                
                <div class="col-md-4">
                    <div class="trend-analysis">
                        <h6>Tendências Temporais</h6>
                        ${this.generateTrendAnalysis(trendAnalysis)}
                    </div>
                </div>
            </div>
            
            <div class="recent-reviews mt-4">
                <h6>Avaliações Recentes</h6>
                <div class="row">
                    ${recentReviews.map(review => this.renderRecentReviewCard(review)).join('')}
                </div>
            </div>
        `;
    }
    
    // Obtém avaliações recentes
    getRecentReviews(reviews, limit = 5) {
        return reviews
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);
    }
    
    // Renderiza card de avaliação recente
    renderRecentReviewCard(review) {
        return `
            <div class="col-md-6 col-lg-4 mb-3">
                <div class="recent-review-card">
                    <div class="review-header">
                        <div class="reviewer-info">
                            <strong>${review.name}</strong>
                            <small class="text-muted">${this.getServiceTypeLabel(review.serviceType)}</small>
                        </div>
                        <div class="review-rating">
                            ${this.generateStars(review.rating)}
                        </div>
                    </div>
                    <div class="review-content">
                        <p class="review-text">"${review.comment.substring(0, 100)}${review.comment.length > 100 ? '...' : ''}"</p>
                        <small class="text-muted">${this.formatDate(review.date)}</small>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Calcula a média das avaliações
    calculateAverageRating(reviews = this.reviews) {
        if (reviews.length === 0) return 0;
        const total = reviews.reduce((sum, review) => sum + review.rating, 0);
        return total / reviews.length;
    }
    
    // Calcula a distribuição das avaliações
    calculateRatingDistribution(reviews = this.reviews) {
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(review => {
            distribution[review.rating]++;
        });
        return distribution;
    }
    
    // Calcula estatísticas por tipo de serviço
    calculateServiceTypeStats(reviews = this.reviews) {
        const stats = {};
        reviews.forEach(review => {
            if (!stats[review.serviceType]) {
                stats[review.serviceType] = { count: 0, totalRating: 0, avgRating: 0 };
            }
            stats[review.serviceType].count++;
            stats[review.serviceType].totalRating += review.rating;
        });
        
        // Calcular média para cada tipo
        Object.keys(stats).forEach(type => {
            stats[type].avgRating = stats[type].totalRating / stats[type].count;
        });
        
        return stats;
    }
    
    // Calcula análise de tendências
    calculateTrendAnalysis(reviews = this.reviews) {
        const monthlyStats = {};
        reviews.forEach(review => {
            const month = review.date.substring(0, 7); // YYYY-MM
            if (!monthlyStats[month]) {
                monthlyStats[month] = { count: 0, totalRating: 0 };
            }
            monthlyStats[month].count++;
            monthlyStats[month].totalRating += review.rating;
        });
        
        return monthlyStats;
    }
    
    // Gera estatísticas por tipo de serviço
    generateServiceTypeStats(stats) {
        if (!stats || typeof stats !== 'object') return '';
        
        let html = '';
        Object.keys(stats).forEach(type => {
            const stat = stats[type];
            if (stat && typeof stat === 'object') {
                html += `
                    <div class="service-stat mb-2">
                        <div class="d-flex justify-content-between">
                            <span>${this.getServiceTypeLabel(type)}</span>
                            <span class="badge bg-primary">${stat.count || 0}</span>
                        </div>
                        <div class="progress" style="height: 8px;">
                            <div class="progress-bar" style="width: ${((stat.avgRating || 0) / 5) * 100}%"></div>
                        </div>
                        <small class="text-muted">Média: ${(stat.avgRating || 0).toFixed(1)}/5</small>
                    </div>
                `;
            }
        });
        return html;
    }
    
    // Gera análise de tendências
    generateTrendAnalysis(trends) {
        if (!trends || typeof trends !== 'object') return '';
        
        let html = '';
        const sortedMonths = Object.keys(trends).sort();
        
        sortedMonths.slice(-6).forEach(month => { // Últimos 6 meses
            const trend = trends[month];
            if (trend && typeof trend === 'object') {
                const avgRating = trend.totalRating && trend.count ? trend.totalRating / trend.count : 0;
                html += `
                    <div class="trend-item mb-2">
                        <div class="d-flex justify-content-between">
                            <span>${this.formatMonth(month)}</span>
                            <span>${trend.count || 0} avaliações</span>
                        </div>
                        <div class="progress" style="height: 6px;">
                            <div class="progress-bar bg-success" style="width: ${(avgRating / 5) * 100}%"></div>
                        </div>
                        <small class="text-muted">Média: ${avgRating.toFixed(1)}/5</small>
                    </div>
                `;
            }
        });
        return html;
    }
    
    // Formata mês para exibição
    formatMonth(monthString) {
        if (!monthString || typeof monthString !== 'string') return '';
        
        try {
            const [year, month] = monthString.split('-');
            if (!year || !month) return monthString;
            
            const date = new Date(parseInt(year), parseInt(month) - 1);
            if (isNaN(date.getTime())) return monthString;
            
            return date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
        } catch (error) {
            console.warn('Erro ao formatar mês:', error);
            return monthString;
        }
    }
    
    // Gera barras de distribuição das avaliações
    generateRatingBars(distribution) {
        if (!distribution || typeof distribution !== 'object') return '';
        
        const total = Object.values(distribution).reduce((sum, count) => sum + (count || 0), 0);
        let html = '';
        
        for (let i = 5; i >= 1; i--) {
            const count = distribution[i] || 0;
            const percentage = total > 0 ? (count / total) * 100 : 0;
            html += `
                <div class="rating-bar">
                    <div class="rating-label">${i}★</div>
                    <div class="rating-progress">
                        <div class="rating-fill" style="width: ${percentage}%"></div>
                    </div>
                    <small>${count}</small>
                </div>
            `;
        }
        
        return html;
    }
    
    // HTML
    generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fas fa-star"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    }
    
    // Obtém o label do tipo de serviço
    getServiceTypeLabel(serviceType) {
        const labels = {
            'compra': 'Compra de Imóvel',
            'venda': 'Venda de Imóvel',
            'aluguel': 'Aluguel',
            'consultoria': 'Consultoria',
            'outro': 'Outro Serviço'
        };
        return labels[serviceType] || serviceType;
    }
    
    // Obtém o label da avaliação
    getRatingLabel(rating) {
        const labels = {
            5: 'Excelente',
            4: 'Muito Bom',
            3: 'Bom',
            2: 'Regular',
            1: 'Ruim'
        };
        return labels[rating] || rating;
    }
    
    // Formata a data
    formatDate(dateString) {
        if (!dateString) return '';
        
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            
            return date.toLocaleDateString('pt-BR');
        } catch (error) {
            console.warn('Erro ao formatar data:', error);
            return dateString;
        }
    }
    
    // Mostra notificação
    showNotification(message, type = 'info') {
        if (!message) return;
        
        // Remover notificação existente se houver
        const existingNotification = document.querySelector('.alert');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show`;
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
}

// Sistema de Gerenciamento de Imóveis
class PropertySystem {
    constructor() {
        this.properties = [];
        this.filters = {
            tipo: '',
            operacao: '',
            bairro: '',
            precoMin: '',
            precoMax: '',
            quartos: '',
            banheiros: ''
        };
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.init();
    }
    
    init() {
        this.loadProperties();
        this.setupEventListeners();
        this.renderProperties();
        this.setupPagination();
        this.renderFeaturedProperties();
    }
    
    // Carrega imóveis do localStorage
    loadProperties() {
        const savedProperties = localStorage.getItem('siteProperties');
        if (savedProperties) {
            try {
                this.properties = JSON.parse(savedProperties);
            } catch (e) {
                console.warn('Erro ao carregar imóveis:', e);
                this.properties = [];
            }
        }
        
        // Se não houver imóveis, criar alguns de exemplo
        if (this.properties.length === 0) {
            this.createSampleProperties();
        }
    }
    
    // Cria imóveis de exemplo
    createSampleProperties() {
        const sampleProperties = [
            {
                id: 1,
                titulo: 'Casa Moderna no Jardim',
                tipo: 'casa',
                operacao: 'venda',
                preco: 850000,
                endereco: 'Rua das Flores, 123',
                bairro: 'jardim',
                quartos: 4,
                banheiros: 3,
                area: 280,
                descricao: 'Linda casa moderna com acabamento de luxo, ampla sala de estar, cozinha gourmet e quintal espaçoso.',
                caracteristicas: ['Garagem para 2 carros', 'Piscina', 'Churrasqueira', 'Jardim', 'Sala de jantar'],
                imagens: ['./Images/casa_1.png'],
                destaque: true,
                dataCadastro: '2024-01-15',
                status: 'disponivel'
            },
            {
                id: 2,
                titulo: 'Apartamento no Centro',
                tipo: 'apartamento',
                operacao: 'aluguel',
                preco: 2500,
                endereco: 'Av. Principal, 456',
                bairro: 'centro',
                quartos: 2,
                banheiros: 1,
                area: 65,
                descricao: 'Apartamento bem localizado no centro da cidade, próximo a comércio e transporte público.',
                caracteristicas: ['Portaria 24h', 'Elevador', 'Área de lazer', 'Vagas de estacionamento'],
                imagens: ['Images/b0e55b404173666e6c8ea5222eba852c.png'],
                destaque: false,
                dataCadastro: '2024-01-10',
                status: 'disponivel'
            },
            {
                id: 3,
                titulo: 'Casa em Condomínio Fechado',
                tipo: 'casa',
                operacao: 'venda',
                preco: 1200000,
                endereco: 'Rua dos Ipês, 789',
                bairro: 'bairro-novo',
                quartos: 5,
                banheiros: 4,
                area: 350,
                descricao: 'Casa em condomínio fechado com segurança 24h, ampla área de lazer e muito conforto.',
                caracteristicas: ['Condomínio fechado', 'Segurança 24h', 'Piscina', 'Quadra de tênis', 'Playground'],
                imagens: ['Images/casa-de-condominio-com-3-quartos-a-venda-212m-no-jardins-versalhes-aparecida-de-goiania.png'],
                destaque: true,
                dataCadastro: '2024-01-05',
                status: 'disponivel'
            },
            {
                id: 4,
                titulo: 'Loft Industrial',
                tipo: 'comercial',
                operacao: 'aluguel',
                preco: 3500,
                endereco: 'Rua Comercial, 321',
                bairro: 'centro',
                quartos: 1,
                banheiros: 1,
                area: 120,
                descricao: 'Loft industrial com design moderno, ideal para escritório ou moradia.',
                caracteristicas: ['Design industrial', 'Alto pé direito', 'Cozinha integrada', 'Área de trabalho'],
                imagens: ['Images/casa-de-condominio-com-3-quartos-a-venda-270m-no-vila-nova-joinville.png'],
                destaque: false,
                dataCadastro: '2024-01-20',
                status: 'disponivel'
            },
            {
                id: 5,
                titulo: 'Terreno Residencial',
                tipo: 'terreno',
                operacao: 'venda',
                preco: 450000,
                endereco: 'Rua das Palmeiras, 654',
                bairro: 'vila',
                quartos: 0,
                banheiros: 0,
                area: 500,
                descricao: 'Terreno plano e regular, ideal para construção de casa própria.',
                caracteristicas: ['Terreno plano', 'Documentação em dia', 'Água e luz na rua', 'Fácil acesso'],
                imagens: ['Images/Terreno-em-condominio-fechado-ou-bairro-aberto.jpg'],
                destaque: false,
                dataCadastro: '2024-01-12',
                status: 'disponivel'
            },
            {
                id: 6,
                titulo: 'Cobertura Duplex',
                tipo: 'apartamento',
                operacao: 'venda',
                preco: 1800000,
                endereco: 'Av. Beira Mar, 987',
                bairro: 'jardim',
                quartos: 3,
                banheiros: 3,
                area: 200,
                descricao: 'Cobertura duplex com vista para o mar, acabamento de luxo e ampla varanda.',
                caracteristicas: ['Vista para o mar', 'Varanda ampla', 'Acabamento de luxo', 'Elevador privativo'],
                imagens: ['Images/size_800_como-tirar-fotos-dos-imoveis-de-temporada-para-anuncia-los-na-internet-84c8d51e.png'],
                destaque: true,
                dataCadastro: '2024-01-08',
                status: 'disponivel'
            },
            {
                id: 7,
                titulo: 'Studio Mobiliado',
                tipo: 'apartamento',
                operacao: 'aluguel',
                preco: 1800,
                endereco: 'Rua das Acácias, 234',
                bairro: 'centro',
                quartos: 1,
                banheiros: 1,
                area: 45,
                descricao: 'Studio mobiliado e decorado, ideal para estudantes ou profissionais que buscam praticidade.',
                caracteristicas: ['Mobiliado', 'Cozinha americana', 'Área de trabalho', 'Wi-Fi incluído'],
                imagens: ['Images/UgZnGk7yMNh-iXDujQj1F35aWLyq_sWzJutjDjZB6TDY7-q85SxtiDHe2Vlk1lPh5zs8uggsU2xi23Mm2EP22okVs8IuSr8vFRR3PE9rgzLowNgw1024-h768.png'],
                destaque: false,
                dataCadastro: '2024-01-18',
                status: 'disponivel'
            },
            {
                id: 8,
                titulo: 'Casa Colonial Reformada',
                tipo: 'casa',
                operacao: 'venda',
                preco: 950000,
                endereco: 'Rua Histórica, 567',
                bairro: 'vila',
                quartos: 3,
                banheiros: 2,
                area: 180,
                descricao: 'Casa colonial totalmente reformada, mantendo o charme original com modernidade.',
                caracteristicas: ['Reformada', 'Jardim histórico', 'Lareira', 'Garagem'],
                imagens: ['Images/casa_1.png'],
                destaque: false,
                dataCadastro: '2024-01-14',
                status: 'disponivel'
            },
            {
                id: 9,
                titulo: 'Sala Comercial',
                tipo: 'comercial',
                operacao: 'aluguel',
                preco: 4200,
                endereco: 'Av. Comercial, 789',
                bairro: 'centro',
                quartos: 0,
                banheiros: 1,
                area: 80,
                descricao: 'Sala comercial em localização privilegiada, ideal para escritórios ou pequenos negócios.',
                caracteristicas: ['Localização privilegiada', 'Recepção', 'Banheiro', 'Ar condicionado'],
                imagens: ['Images/b0e55b404173666e6c8ea5222eba852c.png'],
                destaque: false,
                dataCadastro: '2024-01-16',
                status: 'disponivel'
            },
            {
                id: 10,
                titulo: 'Terreno Comercial',
                tipo: 'terreno',
                operacao: 'venda',
                preco: 800000,
                endereco: 'Av. Industrial, 321',
                bairro: 'bairro-novo',
                quartos: 0,
                banheiros: 0,
                area: 800,
                descricao: 'Terreno comercial com excelente localização para construção de galpão ou prédio comercial.',
                caracteristicas: ['Zona comercial', 'Acesso fácil', 'Documentação em dia', 'Água e luz'],
                imagens: ['Images/casa-de-condominio-com-3-quartos-a-venda-212m-no-jardins-versalhes-aparecida-de-goiania.png'],
                destaque: false,
                dataCadastro: '2024-01-22',
                status: 'disponivel'
            }
        ];
        
        this.properties = sampleProperties;
        this.saveProperties();
    }
    
    // Salva imóveis no localStorage
    saveProperties() {
        try {
            localStorage.setItem('siteProperties', JSON.stringify(this.properties));
        } catch (e) {
            console.error('Erro ao salvar imóveis:', e);
        }
    }
    
    // Configura event listeners
    setupEventListeners() {
        // Filtros
        const filterElements = {
            tipo: document.getElementById('tipo-imovel'),
            operacao: document.getElementById('operacao'),
            bairro: document.getElementById('bairro'),
            aplicarFiltros: document.getElementById('aplicar-filtros')
        };
        
        Object.values(filterElements).forEach(element => {
            if (element) {
                element.addEventListener('change', () => this.applyFilters());
            }
        });
        
        if (filterElements.aplicarFiltros) {
            filterElements.aplicarFiltros.addEventListener('click', () => this.applyFilters());
        }
    }
    
    // Aplica filtros
    applyFilters() {
        this.filters.tipo = document.getElementById('tipo-imovel')?.value || '';
        this.filters.operacao = document.getElementById('operacao')?.value || '';
        this.filters.bairro = document.getElementById('bairro')?.value || '';
        
        this.currentPage = 1;
        this.renderProperties();
        this.setupPagination();
    }
    
    // Filtra imóveis baseado nos critérios
    getFilteredProperties() {
        let filtered = [...this.properties];
        
        if (this.filters.tipo) {
            filtered = filtered.filter(property => property.tipo === this.filters.tipo);
        }
        
        if (this.filters.operacao) {
            filtered = filtered.filter(property => property.operacao === this.filters.operacao);
        }
        
        if (this.filters.bairro) {
            filtered = filtered.filter(property => property.bairro === this.filters.bairro);
        }
        
        return filtered;
    }
    
    // Renderiza imóveis
    renderProperties() {
        const propertiesGrid = document.getElementById('properties-grid');
        if (!propertiesGrid) return;
        
        const filteredProperties = this.getFilteredProperties();
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const propertiesToShow = filteredProperties.slice(startIndex, endIndex);
        
        if (propertiesToShow.length === 0) {
            propertiesGrid.innerHTML = `
                <div class="col-12 text-center">
                    <div class="no-properties">
                        <i class="fas fa-search fa-3x text-muted mb-3"></i>
                        <h4>Nenhum imóvel encontrado</h4>
                        <p>Tente ajustar os filtros ou entre em contato conosco.</p>
                    </div>
                </div>
            `;
            return;
        }
        
        propertiesGrid.innerHTML = propertiesToShow.map(property => this.renderPropertyCard(property)).join('');
    }
    
    // Renderiza imóveis em destaque na página inicial
    renderFeaturedProperties() {
        const featuredGrid = document.getElementById('featured-properties-grid');
        if (!featuredGrid) return;
        
        const featuredProperties = this.properties.filter(property => property.destaque).slice(0, 3);
        
        if (featuredProperties.length === 0) {
            featuredGrid.innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-muted">Nenhum imóvel em destaque no momento.</p>
                </div>
            `;
            return;
        }
        
        featuredGrid.innerHTML = featuredProperties.map(property => this.renderFeaturedPropertyCard(property)).join('');
    }
    
    // Renderiza card de imóvel em destaque
    renderFeaturedPropertyCard(property) {
        const precoFormatado = this.formatPrice(property.preco, property.operacao);
        const operacaoLabel = property.operacao === 'venda' ? 'Venda' : 'Aluguel';
        const tipoLabel = this.getTipoLabel(property.tipo);

        const imgSrc = property.imagens && property.imagens[0]
            ? property.imagens[0]
            : 'https://via.placeholder.com/400x300/007bff/ffffff?text=' + encodeURIComponent(property.titulo);

        return `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="property-card card h-100 featured-card">
                    <div class="destaque-badge">Destaque</div>
                    <div class="property-image">
                        <img src="${imgSrc}" class="card-img-top" alt="${property.titulo}">
                        <div class="property-overlay">
                            <div class="property-actions">
                                <button class="btn btn-light btn-sm" onclick="window.propertySystem.viewProperty(${property.id})">
                                    <i class="fas fa-eye"></i> Ver Detalhes
                                </button>
                                <button class="btn btn-primary btn-sm" onclick="window.propertySystem.contactProperty(${property.id})">
                                    <i class="fas fa-phone"></i> Contatar
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="property-header">
                            <h5 class="card-title">${property.titulo}</h5>
                            <div class="property-price">${precoFormatado}</div>
                        </div>
                        <div class="property-location">
                            <i class="fas fa-map-marker-alt"></i> ${property.endereco}
                        </div>
                        <div class="property-details">
                            <span class="badge bg-primary">${tipoLabel}</span>
                            <span class="badge bg-secondary">${operacaoLabel}</span>
                            ${property.quartos > 0 ? `<span class="badge bg-info"><i class="fas fa-bed"></i> ${property.quartos}</span>` : ''}
                            ${property.banheiros > 0 ? `<span class="badge bg-info"><i class="fas fa-bath"></i> ${property.banheiros}</span>` : ''}
                            <span class="badge bg-success">${property.area}m²</span>
                        </div>
                        <p class="card-text">${property.descricao.substring(0, 120)}${property.descricao.length > 120 ? '...' : ''}</p>
                        <div class="property-features">
                            ${property.caracteristicas.slice(0, 2).map(carac => `<small class="text-muted"><i class="fas fa-check"></i> ${carac}</small>`).join('')}
                        </div>
                    </div>
                    <div class="card-footer">
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">Cadastrado em ${this.formatDate(property.dataCadastro)}</small>
                            <div class="property-actions-footer">
                                <button class="btn btn-outline-primary btn-sm" onclick="window.propertySystem.viewProperty(${property.id})">
                                    Ver Detalhes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Renderiza card de imóvel
    renderPropertyCard(property) {
        const precoFormatado = this.formatPrice(property.preco, property.operacao);
        const operacaoLabel = property.operacao === 'venda' ? 'Venda' : 'Aluguel';
        const tipoLabel = this.getTipoLabel(property.tipo);

        // Usa a primeira imagem do array, se existir
        const imgSrc = property.imagens && property.imagens[0]
            ? property.imagens[0]
            : 'https://via.placeholder.com/400x300/007bff/ffffff?text=' + encodeURIComponent(property.titulo);

        return `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="property-card card h-100">
                    ${property.destaque ? '<div class="destaque-badge">Destaque</div>' : ''}
                    <div class="property-image">
                        <img src="${imgSrc}" class="card-img-top" alt="${property.titulo}">
                        <div class="property-overlay">
                            <div class="property-actions">
                                <button class="btn btn-light btn-sm" onclick="window.propertySystem.viewProperty(${property.id})">
                                    <i class="fas fa-eye"></i> Ver Detalhes
                                </button>
                                <button class="btn btn-primary btn-sm" onclick="window.propertySystem.contactProperty(${property.id})">
                                    <i class="fas fa-phone"></i> Contatar
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="property-header">
                            <h5 class="card-title">${property.titulo}</h5>
                            <div class="property-price">${precoFormatado}</div>
                        </div>
                        
                        <div class="property-location">
                            <i class="fas fa-map-marker-alt"></i> ${property.endereco}
                        </div>
                        
                        <div class="property-details">
                            <span class="badge bg-primary">${tipoLabel}</span>
                            <span class="badge bg-secondary">${operacaoLabel}</span>
                            ${property.quartos > 0 ? `<span class="badge bg-info"><i class="fas fa-bed"></i> ${property.quartos}</span>` : ''}
                            ${property.banheiros > 0 ? `<span class="badge bg-info"><i class="fas fa-bath"></i> ${property.banheiros}</span>` : ''}
                            <span class="badge bg-success">${property.area}m²</span>
                        </div>
                        
                        <p class="card-text">${property.descricao.substring(0, 100)}${property.descricao.length > 100 ? '...' : ''}</p>
                        
                        <div class="property-features">
                            ${property.caracteristicas.slice(0, 3).map(carac => `<small class="text-muted"><i class="fas fa-check"></i> ${carac}</small>`).join('')}
                        </div>
                    </div>
                    
                    <div class="card-footer">
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">Cadastrado em ${this.formatDate(property.dataCadastro)}</small>
                            <div class="property-actions-footer">
                                <button class="btn btn-outline-primary btn-sm" onclick="window.propertySystem.viewProperty(${property.id})">
                                    Ver Detalhes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Configura paginação
    setupPagination() {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;
        
        const filteredProperties = this.getFilteredProperties();
        const totalPages = Math.ceil(filteredProperties.length / this.itemsPerPage);
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }
        
        let paginationHTML = '';
        
        // Botão anterior
        paginationHTML += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="window.propertySystem.changePage(${this.currentPage - 1})">
                    <i class="fas fa-chevron-left"></i>
                </a>
            </li>
        `;
        
        // Páginas
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                paginationHTML += `
                    <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                        <a class="page-link" href="#" onclick="window.propertySystem.changePage(${i})">${i}</a>
                    </li>
                `;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                paginationHTML += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
        }
        
        // Botão próximo
        paginationHTML += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="window.propertySystem.changePage(${this.currentPage + 1})">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        `;
        
        pagination.innerHTML = paginationHTML;
    }
    
    // Muda página
    changePage(page) {
        const filteredProperties = this.getFilteredProperties();
        const totalPages = Math.ceil(filteredProperties.length / this.itemsPerPage);
        
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderProperties();
            this.setupPagination();
            
            // Scroll para o topo da seção
            const propertiesSection = document.querySelector('.properties');
            if (propertiesSection) {
                propertiesSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
    
    // Visualiza detalhes do imóvel
    viewProperty(propertyId) {
        const property = this.properties.find(p => p.id === propertyId);
        if (!property) return;
        
        this.showPropertyModal(property);
    }
    
    // Mostra modal de detalhes do imóvel
    showPropertyModal(property) {
        const imgSrc = property.imagens && property.imagens[0]
            ? property.imagens[0]
            : 'https://via.placeholder.com/400x300/007bff/ffffff?text=' + encodeURIComponent(property.titulo);

        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'propertyModal';
        modal.innerHTML = `
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${property.titulo}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-8">
                                <div class="property-gallery">
                                    <img src="${imgSrc}" class="card-img-top" alt="${property.titulo}">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="property-info">
                                    <h4 class="property-price">${this.formatPrice(property.preco, property.operacao)}</h4>
                                    <p class="property-location"><i class="fas fa-map-marker-alt"></i> ${property.endereco}</p>
                                    
                                    <div class="property-specs">
                                        <div class="spec-item">
                                            <i class="fas fa-home"></i>
                                            <span>${this.getTipoLabel(property.tipo)}</span>
                                        </div>
                                        <div class="spec-item">
                                            <i class="fas fa-tag"></i>
                                            <span>${property.operacao === 'venda' ? 'Venda' : 'Aluguel'}</span>
                                        </div>
                                        ${property.quartos > 0 ? `
                                            <div class="spec-item">
                                                <i class="fas fa-bed"></i>
                                                <span>${property.quartos} quartos</span>
                                            </div>
                                        ` : ''}
                                        ${property.banheiros > 0 ? `
                                            <div class="spec-item">
                                                <i class="fas fa-bath"></i>
                                                <span>${property.banheiros} banheiros</span>
                                            </div>
                                        ` : ''}
                                        <div class="spec-item">
                                            <i class="fas fa-ruler-combined"></i>
                                            <span>${property.area}m²</span>
                                        </div>
                                    </div>
                                    
                                    <div class="property-description">
                                        <h6>Descrição</h6>
                                        <p>${property.descricao}</p>
                                    </div>
                                    
                                    <div class="property-features">
                                        <h6>Características</h6>
                                        <ul>
                                            ${property.caracteristicas.map(carac => `<li><i class="fas fa-check"></i> ${carac}</li>`).join('')}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        <button type="button" class="btn btn-primary" onclick="window.propertySystem.contactProperty(${property.id})">
                            <i class="fas fa-phone"></i> Entrar em Contato
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);

        // Exibir o modal usando Bootstrap
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();

        // Remover o modal do DOM após fechar
        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }
    
    // Contata sobre imóvel
    contactProperty(propertyId) {
        const property = this.properties.find(p => p.id === propertyId);
        if (!property) return;
        
        this.showContactModal(property);
    }
    
    // Mostra modal de contato
    showContactModal(property) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'contactModal';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Contatar sobre: ${property.titulo}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="contactForm">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="contactName" class="form-label">Nome *</label>
                                    <input type="text" class="form-control" id="contactName" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="contactEmail" class="form-label">Email *</label>
                                    <input type="email" class="form-control" id="contactEmail" required>
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="contactPhone" class="form-label">Telefone</label>
                                    <input type="tel" class="form-control" id="contactPhone">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="contactType" class="form-label">Tipo de Interesse</label>
                                    <select class="form-select" id="contactType">
                                        <option value="visita">Agendar Visita</option>
                                        <option value="informacoes">Mais Informações</option>
                                        <option value="negociacao">Negociação</option>
                                        <option value="outro">Outro</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <label for="contactMessage" class="form-label">Mensagem</label>
                                <textarea class="form-control" id="contactMessage" rows="4" 
                                          placeholder="Conte-nos sobre seu interesse neste imóvel..."></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="submit" form="contactForm" class="btn btn-primary">
                            <i class="fas fa-paper-plane"></i> Enviar Mensagem
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Event listener para o formulário
        const contactForm = modal.querySelector('#contactForm');
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitContact(property);
        });
        
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
        
        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }
    
    // Submete formulário de contato
    submitContact(property) {
        const name = document.getElementById('contactName')?.value || '';
        const email = document.getElementById('contactEmail')?.value || '';
        const phone = document.getElementById('contactPhone')?.value || '';
        const type = document.getElementById('contactType')?.value || '';
        const message = document.getElementById('contactMessage')?.value || '';
        
        if (!name || !email) {
            this.showNotification('Por favor, preencha os campos obrigatórios.', 'warning');
            return;
        }
        
        // Aqui você pode implementar o envio real do formulário
        // Por enquanto, apenas mostra uma notificação
        this.showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
        
        // Fechar modal
        const modalElement = document.getElementById('contactModal');
        if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
                modal.hide();
            }
        }
    }
    
    // Formata preço
    formatPrice(price, operation) {
        if (operation === 'aluguel') {
            return `R$ ${price.toLocaleString('pt-BR')}/mês`;
        } else {
            return `R$ ${price.toLocaleString('pt-BR')}`;
        }
    }
    
    // Obtém label do tipo
    getTipoLabel(tipo) {
        const labels = {
            'casa': 'Casa',
            'apartamento': 'Apartamento',
            'comercial': 'Comercial',
            'terreno': 'Terreno'
        };
        return labels[tipo] || tipo;
    }
    
    // Formata data
    formatDate(dateString) {
        if (!dateString) return '';
        
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            
            return date.toLocaleDateString('pt-BR');
        } catch (error) {
            console.warn('Erro ao formatar data:', error);
            return dateString;
        }
    }
    
    // Mostra notificação
    showNotification(message, type = 'info') {
        if (!message) return;
        
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show`;
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
}