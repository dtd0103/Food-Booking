let salesChartInstance;

const verticalLinePlugin = {
	id: 'verticalLine',
	afterDraw: (chart) => {
		if (chart.tooltip && chart.tooltip._active && chart.tooltip._active.length) {
			const ctx = chart.ctx;
			ctx.save();
			const activePoint = chart.tooltip._active[0];
			const x = activePoint.element.x;
			const topY = chart.chartArea.top;
			const bottomY = chart.chartArea.bottom;

			ctx.beginPath();
			ctx.setLineDash([5, 5]);
			ctx.moveTo(x, topY);
			ctx.lineTo(x, bottomY);
			ctx.lineWidth = 1;
			ctx.strokeStyle = 'rgba(0,0,0,0.5)';
			ctx.stroke();
			ctx.restore();
		}
	}
};

// register plugin
Chart.register(verticalLinePlugin);

function getWeekNumber(d) {
	d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
	d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
	const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
	const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
	return weekNo;
}

function drawSalesChart(labels, dataValues, period, allExpectedData) {
	const ctx = document.getElementById('salesChart').getContext('2d');

	if (salesChartInstance) {
		salesChartInstance.destroy();
	}

	salesChartInstance = new Chart(ctx, {
		type: 'line',
		data: {
			labels: labels,
			datasets: [{
				label: 'Value',
				data: dataValues,
				backgroundColor: (context) => {
					const chart = context.chart;
					const { ctx, chartArea } = chart;
					if (!chartArea) {
						return;
					}
					const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);

					gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
					gradient.addColorStop(1, '#ff6800');
					return gradient;
				},
				borderColor: 'rgb(247, 147, 30)',
				borderWidth: 2,
				pointRadius: 0,
				pointBackgroundColor: 'rgb(247, 147, 30)',
				pointBorderColor: 'white',
				pointHoverRadius: 6,
				fill: 'origin',
				tension: 0.4
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			layout: {
				padding: {
					left: 0,
					right: 0,
					top: 0,
					bottom: 0
				}
			},
			scales: {
				y: {
					beginAtZero: true,
					position: 'right',
					grid: {
						color: '#e0e0e0',
						drawBorder: false,
					},
					ticks: {
						callback: function(value) {
							if (value >= 1000000000) {
								return (value / 1000000000).toFixed(0) + 'B';
							} else if (value >= 1000000) {
								return (value / 1000000).toFixed(0) + 'M';
							}
							return new Intl.NumberFormat('vi-VN').format(value);
						},
						color: '#6c757d',
						font: { size: 12 }
					},
					title: {
						display: false
					}
				},
				x: {
					grid: {
						display: false,
						drawBorder: false,
					},
					ticks: {
						color: '#6c757d',
						font: { size: 12 }
					},
					title: {
						display: false,
						font: { size: 14, weight: 'bold' },
						color: '#4a4a4a',
						padding: { top: 10 }
					}
				}
			},
			plugins: {
				tooltip: {
					enabled: true,
					intersect: false,
					mode: 'index',
					backgroundColor: 'rgba(0,0,0,0.8)',
					titleFont: { size: 14, weight: 'bold' },
					bodyFont: { size: 13 },
					padding: 10,
					displayColors: false,
					callbacks: {
						title: function(tooltipItems) {
							return '';
						},
						label: function(context) {
							if (context.parsed.y !== null) {
								return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(context.parsed.y);
							}
							return '';
						},
						footer: function(tooltipItems) {
							if (!tooltipItems.length || !allExpectedData) return '';
							const itemIndex = tooltipItems[0].dataIndex;
							const expectedItem = allExpectedData[itemIndex];

							if (period === 'day') {
								const date = new Date(expectedItem.rawLabel); // YYYY-MM-DD
								return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
							} else if (period === 'week') {
								const date = new Date(expectedItem.rawLabel); // rawLabel: Monday of week (YYYY-MM-DD)
								return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
							} else if (period === 'month') {
								const [year, month] = expectedItem.rawLabel.split('-'); // rawLabel: YYYY-MM
								const date = new Date(parseInt(year), parseInt(month) - 1, 1);
								return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
							}
							return '';
						}
					}
				},
				legend: {
					display: false
				},
				// Add plugin
				verticalLine: {},
				afterDraw: function(chart) {
					const ctx = chart.ctx;
					ctx.save();
					ctx.font = '12px Arial';
					ctx.fillStyle = '#6c757d';
					ctx.textAlign = 'right';
					ctx.textBaseline = 'bottom';
					const text = 'VALUE 1 = 1.000.000đ';
					ctx.fillText(text, chart.width - 20, chart.height - 10);
					ctx.restore();
				}
			}
		}
	});
}

const formatDate = (date) => date.toISOString().split('T')[0];

function generateExpectedLabels(period, startDate, endDate) {
	const expectedLabels = [];
	let loopDate = new Date(startDate);

	if (period === 'day') {
		while (loopDate <= endDate) {
			const rawLabel = formatDate(loopDate);
			const displayLabel = loopDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
			expectedLabels.push({ rawLabel, displayLabel });
			loopDate.setDate(loopDate.getDate() + 1);
		}
	} else if (period === 'week') {
		loopDate.setDate(loopDate.getDate() - (loopDate.getDay() === 0 ? 6 : loopDate.getDay() - 1));

		const finalEndDateForLoop = new Date(endDate);
		finalEndDateForLoop.setDate(endDate.getDate() + (7 - endDate.getDay()) % 7);

		while (loopDate <= finalEndDateForLoop) {
			const weekNo = getWeekNumber(loopDate);
			const rawLabel = formatDate(loopDate);
			const displayLabel = `W${weekNo}`;
			expectedLabels.push({ rawLabel, displayLabel });

			loopDate.setDate(loopDate.getDate() + 7);
		}
	} else if (period === 'month') {
		loopDate.setDate(1);

		const finalMonthYear = endDate.getFullYear() * 12 + endDate.getMonth();
		let currentMonthYear = loopDate.getFullYear() * 12 + loopDate.getMonth();

		while (currentMonthYear <= finalMonthYear) {
			const rawLabel = `${loopDate.getFullYear()}-${(loopDate.getMonth() + 1).toString().padStart(2, '0')}`;
			const displayLabel = loopDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
			expectedLabels.push({ rawLabel, displayLabel });

			loopDate.setMonth(loopDate.getMonth() + 1);
			currentMonthYear = loopDate.getFullYear() * 12 + loopDate.getMonth();
		}
	}
	return expectedLabels;
}


async function updateChartData(period) {
	let labels = [];
	let values = [];
	let actualStartDate = '';
	let actualEndDate = '';
	const today = new Date();
	const currentYear = today.getFullYear();
	const currentMonth = today.getMonth();

	if (period === 'day') {
		const sevenDaysAgo = new Date(today);
		sevenDaysAgo.setDate(today.getDate() - 6);
		actualStartDate = formatDate(sevenDaysAgo);
		actualEndDate = formatDate(today);
	} else if (period === 'week') {
		const dayOfWeek = (today.getDay() === 0) ? 6 : today.getDay() - 1;
		const startOfCurrentWeek = new Date(today);
		startOfCurrentWeek.setDate(today.getDate() - dayOfWeek);

		const twelveWeeksAgo = new Date(startOfCurrentWeek);
		twelveWeeksAgo.setDate(startOfCurrentWeek.getDate() - (11 * 7));

		actualStartDate = formatDate(twelveWeeksAgo);

		const endOfCurrentWeek = new Date(today);
		endOfCurrentWeek.setDate(today.getDate() + (7 - today.getDay()) % 7);
		actualEndDate = formatDate(endOfCurrentWeek);

	} else if (period === 'month') {
		const twelveMonthsAgo = new Date(currentYear, currentMonth - 11, 1);
		actualStartDate = formatDate(twelveMonthsAgo);
		actualEndDate = formatDate(today);
	}

	try {
		const response = await fetch(`/api/orders/sales-chart?period=${period}&startDate=${actualStartDate}&endDate=${actualEndDate}`);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const apiData = await response.json();

		const apiDataMap = new Map();
		if (Array.isArray(apiData)) {
			apiData.forEach(item => {
				let rawKey = item.label;
				if (period === 'week' && item.label && item.label.match(/^\d{4}-\d{2}-\d{2}$/)) {
					const itemDate = new Date(item.label);
					itemDate.setDate(itemDate.getDate() - (itemDate.getDay() === 0 ? 6 : itemDate.getDay() - 1));
					rawKey = formatDate(itemDate);
				}
				apiDataMap.set(rawKey, item.value);
			});
		}

		const allExpectedData = generateExpectedLabels(period, new Date(actualStartDate), new Date(actualEndDate));

		labels = allExpectedData.map(item => item.displayLabel);
		values = allExpectedData.map(item => apiDataMap.has(item.rawLabel) ? apiDataMap.get(item.rawLabel) : 0);

		drawSalesChart(labels, values, period, allExpectedData);

	} catch (error) {
		console.error("Error fetching or processing chart data:", error);
		labels = [];
		values = [];
		drawSalesChart(labels, values, period, []);
	}
}

document.addEventListener('DOMContentLoaded', function() {

	updateChartData('day');
	setActiveButton('dayBtn');

	document.getElementById('dayBtn').addEventListener('click', function() {
		updateChartData('day');
		setActiveButton('dayBtn');
	});
	document.getElementById('weekBtn').addEventListener('click', function() {
		updateChartData('week');
		setActiveButton('weekBtn');
	});
	document.getElementById('monthBtn').addEventListener('click', function() {
		updateChartData('month');
		setActiveButton('monthBtn');
	});

	function setActiveButton(activeId) {
		document.querySelectorAll('.chart-sort-type').forEach(btn => {
			btn.classList.remove('active');
		});
		document.getElementById(activeId).classList.add('active');
	}
});