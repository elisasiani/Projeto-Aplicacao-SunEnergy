document.addEventListener('DOMContentLoaded', () => {
    const simulationForm = document.getElementById('solarSimulationForm');
    const resultsSection = document.getElementById('simulation-results-section');
    
    // Elementos para exibir os resultados
    const economiaAnualEl = document.getElementById('economiaAnual');
    const areaNecessariaEl = document.getElementById('areaNecessaria');
    const potenciaKitEl = document.getElementById('potenciaKit');
    const quantidadeModulosEl = document.getElementById('quantidadeModulos');
    const producaoMensalEl = document.getElementById('producaoMensal');
    const valorSistemaEl = document.getElementById('valorSistema');

    if (simulationForm) {
        simulationForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Obter dados do formulário
            const nome = document.getElementById('nome').value;
            const cep = document.getElementById('cep').value;
            const uf = document.getElementById('uf').value;
            const gastoMensal = parseFloat(document.getElementById('gastoMensal').value);
            const concessionaria = document.getElementById('concessionaria').value;
            const email = document.getElementById('email').value;

            // --- LÓGICA DE SIMULAÇÃO SIMPLIFICADA ---
            // Estes são valores MUITO aproximados e devem ser ajustados
            // com dados reais e específicos da empresa e região.

            // 1. Estimar Consumo Mensal em kWh
            // Assumindo uma tarifa média de R$ 0,85/kWh (varia MUITO por região e concessionária)
            const tarifaMediaEnergia = 0.85; 
            const consumoMensalKWh = gastoMensal / tarifaMediaEnergia;

            // 2. Potência do Kit (kWp)
            // Um sistema bem dimensionado pode gerar o equivalente ao consumo.
            // Fator de capacidade médio (varia com irradiação local, perdas, etc.) - ex: 120 kWh/mês por kWp instalado.
            // Este é um ponto CRÍTICO e precisa de dados de irradiação por UF ou CEP.
            // Para simplificar, vamos usar um fator geral.
            // Ex: Para cada 130 kWh de consumo, precisamos de aprox. 1 kWp.
            let fatorIrradiacao = 130; // kWh gerados por kWp por mês (média Brasil, varia muito)
            if (['SP', 'RJ', 'MG', 'ES', 'SUL'].includes(uf)) fatorIrradiacao = 120; // Sudeste e Sul um pouco menos
            if (['NE', 'N', 'CO'].some(reg => ['BA','SE','AL','PE','PB','RN','CE','PI','MA', 'TO','PA','AP','AM','RR','AC','RO', 'MT','MS','GO','DF'].includes(uf))) fatorIrradiacao = 140; // Nordeste, Norte, Centro-Oeste mais


            const potenciaKitKWp = consumoMensalKWh / fatorIrradiacao;

            // 3. Quantidade de Módulos
            // Assumindo painéis de 550W (0.55 kWp) - um tipo comum atualmente
            const potenciaModuloWp = 550;
            const quantidadeModulos = Math.ceil(potenciaKitKWp / (potenciaModuloWp / 1000));

            // 4. Área Necessária
            // Assumindo que cada módulo ocupa cerca de 2.3 m²
            const areaPorModuloM2 = 2.3;
            const areaNecessariaM2 = quantidadeModulos * areaPorModuloM2;

            // 5. Produção Mensal Estimada (kWh)
            // Recalcular com base na potência do kit para ser mais preciso
            const producaoMensalEstimadaKWh = potenciaKitKWp * fatorIrradiacao;

            // 6. Economia Anual Estimada
            // Pode ser um pouco menor que o gasto total devido a taxas mínimas, impostos, etc.
            // Vamos estimar que o sistema cubra 90-95% do gasto.
            const percentualCobertura = 0.95;
            const economiaMensalEstimada = gastoMensal * percentualCobertura;
            const economiaAnualEstimada = economiaMensalEstimada * 12;

            // 7. VALOR ESTIMADO DO SISTEMA FOTOVOLTAICO
            // Varia MUITO. Ex: R$ 4.000 a R$ 7.000 por kWp instalado.
            // Vamos usar uma média, mas isso deve vir de uma tabela de preços da SunEnergy.
            let custoPorKWp = 5500; // R$
            if (potenciaKitKWp < 3) custoPorKWp = 6500; // Sistemas menores tendem a ser mais caros por kWp
            else if (potenciaKitKWp > 10) custoPorKWp = 4500; // Sistemas maiores mais baratos por kWp
            
            const valorSistemaEstimado = potenciaKitKWp * custoPorKWp;

            // --- Fim da Lógica de Simulação ---

            // Exibir resultados
            if (economiaAnualEl) economiaAnualEl.textContent = `R$ ${economiaAnualEstimada.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            if (areaNecessariaEl) areaNecessariaEl.textContent = `${areaNecessariaM2.toFixed(1)} m²`;
            if (potenciaKitEl) potenciaKitEl.textContent = `${potenciaKitKWp.toFixed(2)} kWp`;
            if (quantidadeModulosEl) quantidadeModulosEl.textContent = `${quantidadeModulos}`;
            if (producaoMensalEl) producaoMensalEl.textContent = `${producaoMensalEstimadaKWh.toFixed(0)} kWh`;
            if (valorSistemaEl) valorSistemaEl.textContent = `R$ ${valorSistemaEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

            if (resultsSection) {
                resultsSection.style.display = 'block';
                resultsSection.scrollIntoView({ behavior: 'smooth' });
            }
            
            // Aqui você poderia enviar os dados para um backend
            console.log({
                nome, cep, uf, gastoMensal, concessionaria, email,
                economiaAnualEstimada, areaNecessariaM2, potenciaKitKWp,
                quantidadeModulos, producaoMensalEstimadaKWh, valorSistemaEstimado
            });
            // alert('Simulação realizada! Entraremos em contato em breve.');
        });
    }

    // --- LÓGICA PARA GRÁFICOS (Executada apenas se os elementos canvas existirem) ---
    const ctxRegioes = document.getElementById('regioesChart');
    const ctxMeses = document.getElementById('mesesChart');
    const ctxPaineis = document.getElementById('paineisChart');

    if (ctxRegioes || ctxMeses || ctxPaineis) {
        console.log("Elementos canvas de gráficos encontrados. Tentando gerar gráficos...");

        if (typeof Chart === 'undefined') {
            console.error("Chart.js NÃO está carregado! Verifique a inclusão do script no HTML.");
            return;
        }

        const sunEnergyColors = {
            amarelo: 'rgba(255, 215, 0, 0.8)',
            azul: 'rgba(0, 90, 156, 0.8)',
            cinza: 'rgba(204, 204, 204, 0.8)',
            pretoTexto: '#1a1a1a',
            amareloHover: 'rgba(255, 196, 0, 1)',
            azulHover: 'rgba(0, 64, 112, 1)',
            laranja: 'rgba(255, 165, 0, 0.8)',
            verdeAgua: 'rgba(75, 192, 192, 0.8)',
            azulClaro: 'rgba(100, 149, 237, 0.8)' // Cornflower blue
        };

        // --- DADOS SIMULADOS (Representando dados que seriam coletados e processados) ---
        // Em um sistema real, estes dados viriam de um backend/API,
        // potencialmente alimentado por IA analisando tendências de mercado.
        // Estes são valores fixos para esta demonstração front-end.

        const dadosMercado = {
            vendasPorRegiao: { // kWp instalados (exemplo)
                labels: ['Sudeste', 'Nordeste', 'Sul', 'Centro-Oeste', 'Norte'],
                data: [1850, 1100, 950, 720, 410] // Sudeste lidera, Nordeste crescendo
            },
            vendasPorMes: { // Unidades de sistemas vendidos (exemplo)
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                // Tendência: meses mais ensolarados ou com 13º podem ter pico
                data: [120, 135, 150, 140, 110, 90, 100, 130, 160, 180, 190, 150]
            },
            tiposPaineisMaisVendidos: { // Percentual de participação (exemplo)
                labels: ['Monocristalino >500W', 'Monocristalino 400-500W', 'Policristalino', 'Bifacial', 'Telhas Solares'],
                data: [45, 30, 10, 10, 5] // Monocristalinos de alta potência dominando
            }
        };

        // --- GRÁFICO DE REGIÕES ---
        if (ctxRegioes) {
            console.log("Gerando gráfico de Regiões...");
            new Chart(ctxRegioes, {
                type: 'bar',
                data: {
                    labels: dadosMercado.vendasPorRegiao.labels,
                    datasets: [{
                        label: 'Volume de Vendas Estimado (kWp)',
                        data: dadosMercado.vendasPorRegiao.data,
                        backgroundColor: [
                            sunEnergyColors.amarelo,
                            sunEnergyColors.azul,
                            sunEnergyColors.laranja,
                            sunEnergyColors.verdeAgua,
                            sunEnergyColors.cinza
                        ],
                        borderColor: [
                            sunEnergyColors.amareloHover,
                            sunEnergyColors.azulHover,
                            'rgba(255, 165, 0, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(150,150,150,1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    indexAxis: 'y', // Para gráfico de barras horizontais, se preferir
                    plugins: {
                        legend: { display: false }, // Label do dataset já é suficiente
                        title: {
                            display: true,
                            text: 'Distribuição Estimada de Vendas por Região (kWp)',
                            color: sunEnergyColors.pretoTexto,
                            font: { size: 16 }
                        }
                    },
                    scales: {
                        y: { ticks: { color: sunEnergyColors.pretoTexto }, grid: { color: 'transparent' } },
                        x: { beginAtZero: true, ticks: { color: sunEnergyColors.pretoTexto }, grid: { color: sunEnergyColors.cinza } }
                    }
                }
            });
        }

        // --- GRÁFICO DE MESES ---
        if (ctxMeses) {
            console.log("Gerando gráfico de Meses...");
            new Chart(ctxMeses, {
                type: 'line',
                data: {
                    labels: dadosMercado.vendasPorMes.labels,
                    datasets: [{
                        label: 'Vendas Mensais Estimadas (Unidades)',
                        data: dadosMercado.vendasPorMes.data,
                        fill: true,
                        backgroundColor: 'rgba(0, 90, 156, 0.2)', // Azul com transparência para área
                        borderColor: sunEnergyColors.azul,
                        pointBackgroundColor: sunEnergyColors.azul,
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: sunEnergyColors.azulHover,
                        tension: 0.3 // Suaviza a linha
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: {
                        legend: { display: true, position: 'bottom', labels: { color: sunEnergyColors.pretoTexto } },
                        title: {
                            display: true,
                            text: 'Tendência Estimada de Vendas Mensais',
                            color: sunEnergyColors.pretoTexto,
                            font: { size: 16 }
                        }
                    },
                    scales: {
                        y: { beginAtZero: false, ticks: { color: sunEnergyColors.pretoTexto }, grid: { color: sunEnergyColors.cinza } },
                        x: { ticks: { color: sunEnergyColors.pretoTexto }, grid: { color: 'transparent' } }
                    }
                }
            });
        }

        // --- GRÁFICO DE TIPOS DE PAINÉIS ---
        if (ctxPaineis) {
            console.log("Gerando gráfico de Painéis...");
            new Chart(ctxPaineis, {
                type: 'doughnut', // 'pie' também é uma opção
                data: {
                    labels: dadosMercado.tiposPaineisMaisVendidos.labels,
                    datasets: [{
                        label: 'Participação no Mercado',
                        data: dadosMercado.tiposPaineisMaisVendidos.data,
                        backgroundColor: [
                            sunEnergyColors.amarelo,
                            sunEnergyColors.azul,
                            sunEnergyColors.laranja,
                            sunEnergyColors.verdeAgua,
                            sunEnergyColors.cinza
                        ],
                        hoverOffset: 8,
                        borderColor: '#fff', // Borda branca entre as fatias
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'right', labels: { color: sunEnergyColors.pretoTexto, boxWidth: 20 } },
                        title: {
                            display: true,
                            text: 'Tipos de Painéis Mais Utilizados (Estimativa)',
                            color: sunEnergyColors.pretoTexto,
                            font: { size: 16 }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed !== null) {
                                        label += context.parsed + '%';
                                    }
                                    return label;
                                }
                            }
                        }
                    }
                }
            });
        }
    } else {
        // Condição para quando não estamos na página da empresa, para evitar logs desnecessários no console.
        if (window.location.pathname.includes("empresa.html")) {
             console.warn("Nenhum elemento canvas para gráficos (regioesChart, mesesChart, paineisChart) foi encontrado na página empresa.html. Verifique os IDs no HTML.");
        }
    }
}); // Fim do DOMContentLoaded