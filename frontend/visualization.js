export function renderWordFrequencyChart(wordFrequency) {
    // 获取前15个高频词
    const topWords = wordFrequency.slice(0, 15);
    
    // 准备图表数据
    const labels = topWords.map(item => item.text);
    const data = topWords.map(item => item.count);
    
    // 清除旧图表
    const chartContainer = document.getElementById('wordFrequencyChart');
    chartContainer.innerHTML = '<canvas></canvas>';
    const canvas = chartContainer.querySelector('canvas');
    
    // 创建新图表
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '词频',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '频率'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '词语'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: '词频分析'
                }
            }
        }
    });
}

export function renderWordCloud(wordFrequency) {
    // 清除旧词云
    const wordCloudContainer = document.getElementById('wordCloud');
    wordCloudContainer.innerHTML = '';
    
    // 设置词云尺寸
    const width = wordCloudContainer.offsetWidth;
    const height = 400;
    
    // 准备词云数据
    const words = wordFrequency.slice(0, 100).map(item => ({
        text: item.text,
        size: 10 + (item.count * 5) // 根据词频调整大小
    }));
    
    // 创建词云布局
    const layout = d3.layout.cloud()
        .size([width, height])
        .words(words)
        .padding(5)
        .rotate(() => ~~(Math.random() * 2) * 90)
        .fontSize(d => d.size)
        .on("end", draw);
    
    layout.start();
    
    // 绘制词云
    function draw(words) {
        const svg = d3.select("#wordCloud").append("svg")
            .attr("width", layout.size()[0])
            .attr("height", layout.size()[1])
            .append("g")
            .attr("transform", `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`);
        
        svg.selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", d => `${d.size}px`)
            .style("fill", () => d3.schemeCategory10[Math.floor(Math.random() * 10)])
            .attr("text-anchor", "middle")
            .attr("transform", d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
            .text(d => d.text);
    }
}