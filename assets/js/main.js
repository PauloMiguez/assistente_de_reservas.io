// Adicionado um listener para garantir que o DOM esteja carregado antes de executar o script
document.addEventListener('DOMContentLoaded', function() {

    // Configurações do hotel
    const HOTEL_CONFIG = {
        name: "Hotel Granja Brasil",
        whatsappNumber: "+5524998275427",
        emailCorporativo: "contato@reservasgranjabrasil.com.br",
        localizacao: "Condomínio das Residências do Pau Brasil - Estrada União e Indústria, 9153 - Itaipava - Petrópolis, RJ",
        politicas: {
            cancelamento: "Alterações ou cancelamentos sem custo até 48h antes do check-in",
            criancas: "Crianças até 6 anos não pagam, mas exigem suítes com sofás-camas",
            hospedeExtra: "Hóspedes extras: R$ 102/dia (sofás-camas)",
            animais: "Animais de estimação não são permitidos",
            fumante: "100% não fumante",
            atestatMedico: "Obrigatório para áreas externas (sauna, academia, piscinas) - válido por 6 meses"
        },
        servicos: [
            "Café da Manhã (Buffet) Incluso",
            "Internet Wifi Gratuita",
            "Piscinas",
            "Quadras Poliesportivas, Tênis e Vôlei de Areia",
            "Academia e Sauna a Vapor",
            "Trilha Ecológica",
            "Parquinho Infantil",
            "Estacionamento Gratuito (coberto/descoberto)",
            "Adega Quinta do Escanção",
            "Divino & Cucina (Culinária Italiana)",
            "Chez Bonbon (Chocolates Gourmet)"
        ],
        horarios: {
            checkin: "14h às 19h",
            checkout: "12h",
            governanca: "7h às 22h",
            recepcao: "7h às 19h",
            piscina: "Terça a domingo: 10:30h às 19h (Segunda: manutenção)"
        },
        acomodacoes: [
            {
                nome: "Apartamento Superior",
                descricao: "Camas separadas (padrão viúva) – ideal para solteiros - 26 m² - Ar-condicionado - Frigobar - Secador de Cabelos - Mesa de Trabalho",
                capacidade: 2
            },
            {
                nome: "Suíte Sênior",
                descricao: "Conforto ampliado com sofá-cama na sala - Cama de Casal King Size - 41 m² - Ar-condicionado - Frigobar - Microondas - Pia - Sacada - Secador de Cabelos - Mesa de Trabalho",
                capacidade: 3
            },
            {
                nome: "Suíte Master (Cobertura)",
                descricao: "Cama King Size, sofá-cama e vista privilegiada - 56 m² - Ar-condicionado - Frigobar - Microondas - Pia - Varanda - Acesso por escada (15 degraus) - Secador de Cabelos - Mesa de Trabalho",
                capacidade: 3
            }
        ]
    };

    // Dados de minlos (estadia mínima)
    const MINLOS_DATA = {
        "09/08/2025": 2, "16/08/2025": 2, "23/08/2025": 2, "30/08/2025": 2, "06/09/2025": 2,
        "13/09/2025": 2, "20/09/2025": 2, "27/09/2025": 2, "04/10/2025": 2, "10/10/2025": 3,
        "11/10/2025": 3, "12/10/2025": 3, "13/10/2025": 3, "18/10/2025": 2, "25/10/2025": 2,
        "30/10/2025": 3, "31/10/2025": 3, "01/11/2025": 3, "02/11/2025": 3, "03/11/2025": 3,
        "06/11/2025": 3, "07/11/2025": 3, "08/11/2025": 3, "09/11/2025": 3, "10/11/2025": 3,
        "14/11/2025": 2, "15/11/2025": 2, "16/11/2025": 2, "19/11/2025": 4, "20/11/2025": 4,
        "21/11/2025": 4, "22/11/2025": 4, "23/11/2025": 4, "29/11/2025": 2, "06/12/2025": 2,
        "13/12/2025": 2, "20/12/2025": 2, "27/12/2025": 2, "28/12/2025": 4, "29/12/2025": 4,
        "30/12/2025": 4, "31/12/2025": 4, "01/01/2026": 4, "03/01/2026": 2, "10/01/2026": 2,
        "17/01/2026": 2, "24/01/2026": 2, "31/01/2026": 2
    };

    // Funções de formatação e conversão
    function convertCurrencyToNumber(currencyString) {
        if (!currencyString) return 0;
        const numericString = currencyString.toString().replace(/R\$\s?/g, '').replace(/\./g, '').replace(',', '.');
        return parseFloat(numericString) || 0;
    }

    function formatCurrency(value) {
        const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.-]/g, '')) : Number(value);
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(numericValue);
    }

    function formatDateToDDMMAAAA(dateString) {
        const date = new Date(dateString);
        const offset = date.getTimezoneOffset();
        date.setMinutes(date.getMinutes() + offset);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    function getDatesBetween(startDateStr, endDateStr) {
        const dates = [];
        let currentDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);
        while (currentDate < endDate) {
            dates.push(formatDateToDDMMAAAA(currentDate.toISOString().split('T')[0]));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    }

    function checkMinLOS(startDateStr, endDateStr) {
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);
        const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        const checkinDateFormatted = formatDateToDDMMAAAA(startDateStr);
        const minLOS = MINLOS_DATA[checkinDateFormatted] || 1;
        if (nights < minLOS) {
            return { valid: false, message: `Para a data de check-in ${checkinDateFormatted}, a estadia mínima é de ${minLOS} noites. Por favor, ajuste suas datas.` };
        }
        return { valid: true };
    }

    // Funções da API
    const availabilityCache = {};
    async function fetchAvailability(startDate, endDate) {
        const cacheKey = `${startDate}-${endDate}`;
        if (availabilityCache[cacheKey]) return availabilityCache[cacheKey];
        const url = 'https://reservas.desbravador.com.br/reservas/modules/ws/interface.php';
        const payload = { "wsrolRQ": { "hotelLoginRQ": { "slug": "hotel-granja-brasil-resort", "origem": "rolweb", "ip": "191.31.44.244" }, "disponibilidadeRQ": { "disponibilidade": { "datainicio": startDate, "datafim": endDate, "detalhes": true, "cdvoucher": 0 } } } };
        try {
            const response = await fetch(url, { method: 'POST', headers: { 'Authorization': 'Basic cm9sRHNsOkJyNDVpMUAyMDE4', 'Content-Type': 'application/json' }, body: JSON.stringify(payload ) });
            if (!response.ok) throw new Error(`Erro na consulta de disponibilidade: ${response.status}`);
            const data = await response.json();
            availabilityCache[cacheKey] = data;
            return data;
        } catch (error) {
            console.error('Erro na API de disponibilidade:', error);
            throw new Error('Serviço indisponível no momento. Por favor, tente novamente mais tarde.');
        }
    }

    async function fetchHotelRates(startDate, endDate) {
        const url = `https://xeitj4h9fd.execute-api.us-east-1.amazonaws.com/prd/desbravador?start=${encodeURIComponent(startDate )}&end=${encodeURIComponent(endDate)}`;
        try {
            const response = await fetch(url, { method: 'GET', headers: { 'Authorization': 'Basic Og==', 'Content-Type': 'application/json' } });
            if (!response.ok) throw new Error(`Erro na consulta: ${response.status}`);
            const data = await response.json();
            if (!data.data || !data.data.dataFormatted || !Array.isArray(data.data.dataFormatted)) throw new Error('Formato de dados inválido retornado pela API');
            data.data.dataFormatted = data.data.dataFormatted.map(room => ({ ...room, valorMedio: convertCurrencyToNumber(room.valorMedio || room.total), total: convertCurrencyToNumber(room.total) }));
            return data;
        } catch (error) {
            console.error('Erro na API de tarifas:', error);
            throw new Error('Erro ao consultar tarifas. Por favor, tente novamente.');
        }
    }

    // Variáveis globais
    let conversationHistory = [];
    let currentQuoteData = null;
    let selectedRooms = [];
    let currentAvailabilityData = null;
    let isCheckingAvailability = false;
    let isProcessingQuickAction = false;
    const availabilityHistory = [];

    // Funções do chat
    function addMessage(content, isUser = false) {
        const messagesContainer = document.getElementById('chatMessages');
        const typingIndicator = document.getElementById('typingIndicator');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
        const avatar = document.createElement('div');
        avatar.className = `message-avatar ${isUser ? 'user-avatar' : 'bot-avatar'}`;
        avatar.textContent = isUser ? '👤' : '🤖';
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        if (typeof content === 'string') {
            messageContent.innerHTML = content;
        } else {
            messageContent.appendChild(content);
        }
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        // Adiciona o indicador de "digitando" se não existir
        if (!typingIndicator) {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'message bot typing-indicator';
            typingDiv.id = 'typingIndicator';
            typingDiv.innerHTML = `
                <div class="message-avatar bot-avatar">🤖</div>
                <div class="typing-indicator">
                    <div class="typing-dots">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                </div>`;
            messagesContainer.appendChild(typingDiv);
        }
        
        messagesContainer.insertBefore(messageDiv, document.getElementById('typingIndicator'));
        setTimeout(() => { messageDiv.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
        conversationHistory.push({ content: typeof content === 'string' ? content : content.outerHTML, isUser: isUser, timestamp: new Date() });
        setTimeout(setupButtonListeners, 50);
    }

    function showTyping() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.style.display = 'flex';
            document.getElementById('chatMessages').scrollTop = document.getElementById('chatMessages').scrollHeight;
        }
    }

    function hideTyping() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) typingIndicator.style.display = 'none';
    }

    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        return errorDiv;
    }

    function showNoAvailability(message) {
        const noAvailDiv = document.createElement('div');
        noAvailDiv.className = 'no-availability';
        noAvailDiv.textContent = message;
        noAvailDiv.style.display = 'block';
        return noAvailDiv;
    }

    function showLoading(message) {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading';
        loadingDiv.textContent = message;
        loadingDiv.style.display = 'block';
        return loadingDiv;
    }

    // Funções para controle dos campos de data
    function disableDateInputs() {
        document.getElementById('checkinDate').disabled = true;
        document.getElementById('checkoutDate').disabled = true;
    }

    function enableDateInputs() {
        document.getElementById('checkinDate').disabled = false;
        document.getElementById('checkoutDate').disabled = false;
    }

    function reset
