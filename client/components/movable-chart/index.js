import * as d3 from 'd3';
import EventEmitter from 'events';

const margin = { top: 30, bottom: 30, left: 30, right: 10 };

export default class MovableChart extends EventEmitter {
	constructor({ years, width, height, min, max }) {
		super();

		this.el = document.createElement('div');
		this.el.classList.add('movable-chart');
		this.el.style.position = 'relative';
		this.years = years;
		this.width = width;
		this.height = height;
		this.min = min;
		this.max = max;
	}

	render() {
		const { el, years, width, height, min, max } = this;

		const chartWidth = width - (margin.left + margin.right);
		const chartHeight = height - (margin.top + margin.bottom);

		const sliderWidth = chartWidth / years.length;

		const yScale = d3.scaleLinear().domain([min, max]).range([0, chartHeight]);
		const xScale = index => (sliderWidth * index) + (sliderWidth / 2);

		el.innerHTML = '';

		const svg = d3.select(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));

		svg
			.attr('width', width)
			.attr('height', height)
		;

		const chartGroup = svg.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		chartGroup.append('rect')
			.attr('fill', 'white')
			.attr('width', chartWidth)
			.attr('height', chartHeight);

		// make an svg path descriptor drawing a line between all the points
		const pathDescriptor = `M ${years.map(({ label, value }, i) => `${xScale(i)} ${chartHeight - yScale(value)}`).join(' L ')}`;

		chartGroup.append('path')
			.attr('class', 'movable-chart__connecting-line')
			.attr('fill', 'none')
			.attr('d', pathDescriptor)
		;

		years.forEach(({ label, value }, i) => {
			chartGroup.append('circle')
				.attr('class', 'movable-chart__dot')
				.attr('r', '10')
				.attr('cx', xScale(i))
				.attr('cy', chartHeight - yScale(value))
			;
		});

		el.appendChild(svg.node());

		// add mouse catchers
		years.forEach(({ label, value }, i) => {
			const mouseCatcher = document.createElement('div');
			mouseCatcher.classList.add('movable-chart__mouse-catcher');
			mouseCatcher.style.position = 'absolute';
			mouseCatcher.style.left = `${(sliderWidth * i) + margin.left}px`;
			mouseCatcher.style.top = `${margin.top}px`;
			mouseCatcher.style.height = `${chartHeight}px`;
			mouseCatcher.style.width = `${sliderWidth}px`;

			const update = (offsetY) => {
				years[i].value = yScale.invert(chartHeight - offsetY);
				this.emit('update', { yearIndex: i, value });
				this.render();
			}

			mouseCatcher.addEventListener('mousemove', (event) => {
				if (event.which !== 1) return;
				event.preventDefault();
				update(event.offsetY);
			});

			mouseCatcher.addEventListener('mousedown', (event) => {
				event.preventDefault();
				update(event.offsetY);
			});

			// mouseCatcher.addEventListener('touchmove', (event) => {
			// 	event.preventDefault();
			// 	update(event.touches[0].clientY - mouseCatcher.getBoundingClientRect().top);
			// });

			// mouseCatcher.addEventListener('touchstart', (event) => {
			// 	event.preventDefault();
			// 	update(event.touches[0].clientY - mouseCatcher.getBoundingClientRect().top);
			// });

			el.appendChild(mouseCatcher);
		});
	}
}
