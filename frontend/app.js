document.addEventListener('DOMContentLoaded', () => {
    const analyzeButton = document.getElementById('analyzeButton');
    const textInput = document.getElementById('textInput');
    const focusTermsInput = document.getElementById('focusTermsInput');
    const ngramSizeInput = document.getElementById('ngramSizeInput');
    const customStopWordsInput = document.getElementById('customStopWordsInput');
    const windowSizeInput = document.getElementById('windowSizeInput');
    const minFrequencyInput = document.getElementById('minFrequencyInput');
    const tokenCountElement = document.getElementById('token-count');
    const wordFrequencyChartContainer = document.getElementById('word-frequency-chart-container');
    const wordCloudContainer = document.getElementById('word-cloud-container');

    analyzeButton.addEventListener('click', async () => {
        const text = textInput.value;
        const terms = focusTermsInput.value.split(',').map(term => term.trim()).filter(term => term !== '');
        const ngram = parseInt(ngramSizeInput.value);
        const customStopWords = customStopWordsInput.value.split(',').map(word => word.trim()).filter(word => word !== '');
        const window = parseInt(windowSizeInput.value);
        const minFreq = parseInt(minFrequencyInput.value);

        const data = await fetchData(text, terms, ngram, customStopWords, window, minFreq);
        updateUI(data);
    });

    async function fetchData(text, terms, ngram, customStopWords, window, minFreq) {
        const language = 'auto'; // 自动检测语言
        try {
            const response = await fetch('/api/analyze', {   // 注意这里修改了API地址
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: text,
                    language: language,
                    focusTerms: terms,
                    ngramSize: ngram,
                    customStopWords: customStopWords,
                    windowSize: window,
                    minFrequency: minFreq
                })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Failed to fetch data:", error);
            return null;
        }
    }

    function updateUI(data) {
        if (!data) {
            tokenCountElement.textContent = 'Error occurred';
            return;
        }

        tokenCountElement.textContent = data.tokenCount;
        renderWordFrequencyChart(data.wordFrequency);
        renderWordCloud(data.wordFrequency);
    }

    function renderWordFrequencyChart(wordFrequency) {
        // Destroy existing chart
        if (window.wordFrequencyChart) {
            window.wordFrequencyChart.destroy();
        }

        const labels = wordFrequency.map(item => item.text);
        const counts = wordFrequency.map(item => item.count);

        const ctx = document.getElementById('word-frequency-chart').getContext('2d');
        window.wordFrequencyChart = new Chart(ctx, {
            type: 'bar',
            162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function renderWordCloud(wordFrequency) {
        // Clear existing word cloud
        wordCloudContainer.innerHTML = '';

        const width = 500;
        const height = 300;

        const svg = d3.select(wordCloudContainer)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);

        const fontScale = d3.scaleLinear()
            .domain([0, d3.max(wordFrequency, d => d.count)])
            .range([10, 50]);

        d3.cloud()
            .size([width, height])
            .words(wordFrequency, d => d.text)
            .padding(5)
            .rotate(() => ~~(Math.random() * 2) * 90)
            .font("Impact")
            .fontSize(d => fontScale(d.count))
            .on("end", words => {
                svg.selectAll("text")
                    .data(words)
                    .enter().append("text")
                    .style("font-size", d => `${d.size}px`)
                    .style("font-family", "Impact")
                    .style("fill", (d, i) => d3.schemeCategory10[i % 10])
                    .attr("text-anchor", "middle")
                    .attr("transform", d => `translate(${d.x},${d.y})rotate(${d.rotate})`)
                    .text(d => d.text);
            })
            .start();
    }
});
