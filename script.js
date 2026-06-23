let taskCount = 0;
let modelId = 0;

function generate() {
    taskCount = parseInt(document.getElementById("taskCount").value);
    document.getElementById("models").innerHTML = "";
    modelId = 0;
    addModel();
}

function addModel() {
    modelId++;

    let div = document.createElement("div");
    div.className = "model";

    let html = `
        <b>Model Name:</b>
        <input id="name${modelId}" value="Model ${modelId}">
        <br>
    `;

    for (let i = 0; i < taskCount; i++) {
        html += `Task ${i+1}: <input id="m${modelId}t${i}" value="0.0"><br>`;
    }

    div.innerHTML = html;
    document.getElementById("models").appendChild(div);
}

function mean(a) {
    return a.reduce((x,y)=>x+y,0)/a.length;
}

function gm(a) {
    return Math.pow(a.reduce((x,y)=>x*y,1), 1/a.length);
}

function bmts(a) {
    const eps = 1e-12;
    const n = a.length;

    const sum = a.reduce((x,y)=>x+y,0);
    const p = a.map(x => x/(sum+eps));

    const entropy = -p.reduce((x,y)=>x + y*Math.log(y+eps),0);
    const entNorm = entropy / Math.log(n+eps);

    return mean(a) * entNorm;
}

function calculate() {
    let labels = [];
    let datasets = [];

    let table = `
    <table>
        <tr>
            <th>Model</th>
            <th>Mean</th>
            <th>Geometric Mean</th>
            <th>BMTS</th>
        </tr>
    `;

    for (let m = 1; m <= modelId; m++) {

        let name = document.getElementById(`name${m}`).value;
        let scores = [];

        for (let i = 0; i < taskCount; i++) {
            scores.push(parseFloat(document.getElementById(`m${m}t${i}`).value));
        }

        let avg = mean(scores);
        let geo = gm(scores);
        let score = bmts(scores);

        table += `
        <tr>
            <td>${name}</td>
            <td>${avg.toFixed(4)}</td>
            <td>${geo.toFixed(4)}</td>
            <td>${score.toFixed(4)}</td>
        </tr>`;

        labels = scores.map((_,i)=>"Task "+(i+1));

        datasets.push({
            label: name,
            data: scores,
            fill: true
        });
    }

    table += "</table>";

    document.getElementById("results").innerHTML = table;

    drawChart(labels, datasets);
}

function drawChart(labels, datasets) {
    if (window.chart) window.chart.destroy();

    window.chart = new Chart(document.getElementById("radarChart"), {
        type: 'radar',
        data: { labels, datasets },
        options: {
            scales: {
                r: { min: 0, max: 1 }
            }
        }
    });
}

function exportCSV() {
    let csv = "Model,Mean,GeometricMean,BMTS\n";

    for (let m = 1; m <= modelId; m++) {

        let name = document.getElementById(`name${m}`).value;
        let scores = [];

        for (let i = 0; i < taskCount; i++) {
            scores.push(parseFloat(document.getElementById(`m${m}t${i}`).value));
        }

        csv += `${name},${mean(scores)},${gm(scores)},${bmts(scores)}\n`;
    }

    let blob = new Blob([csv], {type: "text/csv"});
    let url = URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.href = url;
    a.download = "bmts_results.csv";
    a.click();
}

function toggleDark() {
    document.body.classList.toggle("dark");
}

function copyLatex() {
    const latex = `
\\mathrm{BMTS}=\\left(\\frac{1}{n}\\sum_{i=1}^{n}s_i\\right)
\\frac{-\\sum_{i=1}^{n}\\left(\\frac{s_i}{\\sum_j s_j}\\right)\\ln\\left(\\frac{s_i}{\\sum_j s_j}\\right)}{\\ln n}
`;

    navigator.clipboard.writeText(latex);
    alert("LaTeX copied!");
}
