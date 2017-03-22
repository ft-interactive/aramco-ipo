import * as d3 from 'd3';
import EventEmitter from 'events';

const margin = { top: 30, bottom: 30, left: 25, right: 10 };

export default class MovableChart extends EventEmitter {
	constructor({ width, height, min, max }) {
		super();

		const container = document.createElement('div');
		container.classList.add('movable-chart');
		container.style.position = 'relative';

		this.width = width;
		this.height = height;

		this.min = min;
		this.max = max;

		this.elements = { container };
	}

	setYears(years) {
		this.years = years;
		return this;
	}

	update() {
		const { years, el, width, height, min, max, elements, xScale, yScale } = this;

		// make an svg path descriptor drawing a line between all the points
		const pathDescriptor = `M ${years.map(({ label, value }, i) => `${xScale(i)} ${yScale(value)}`).join(' L ')}`;

		elements.connectingLine.attr('d', pathDescriptor);

		years.forEach(({ label, value }, i) => {
				
			elements.dots[i]	
				.attr('cx', xScale(i))
				.attr('cy', yScale(value))
			;
		});

	}

	init(){
		const { years, el, width, height, min, max, elements } = this;

		const chartWidth = width - (margin.left + margin.right);
		const chartHeight = height - (margin.top + margin.bottom);
		const sliderWidth = chartWidth / years.length;
		const yScale = d3.scaleLinear()
						.domain([min, max])
						.range([chartHeight, 0]);

		const xScale = index => (sliderWidth * index) + (sliderWidth / 2);
		this.xScale = xScale;
		this.yScale = yScale;
		const priceAxis = d3.axisLeft(yScale);

		elements.container.innerHTML = '';

		elements.svg = d3.select(elements.container)
			.append("svg")
			.attr('width', width)
			.attr('height', height);


		elements.chartGroup = elements.svg.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		elements.chartGroup.append('rect')
			.attr('fill', 'white')
			.attr('width', chartWidth)
			.attr('height', chartHeight);

		elements.chartGroup.selectAll('text')
			.data(years)
			.enter()
			.append('text')
			.text( d => d.label)
			.attr("x", (d, i) => xScale(i))
			.attr("y", -10)
			.attr("text-anchor", "middle");

		elements.connectingLine = elements.chartGroup.append('path')
			.attr('class', 'movable-chart__connecting-line')
			.attr('fill', 'none');


		elements.dots = years.map(() => {
			return elements.chartGroup.append('circle')
				.attr('class', 'movable-chart__dot')
				.attr('r', '10');
		});

		// add y axis 
		elements.chartGroup.append("g")
				.attr("class", "axis")
				.call(priceAxis);

		// add mouse catchers
		years.forEach(({ label, value }, i) => {
			const mouseCatcher = document.createElement('div');
			mouseCatcher.classList.add('movable-chart__mouse-catcher');
			mouseCatcher.style.position = 'absolute';
			mouseCatcher.style.left = `${(sliderWidth * i) + margin.left}px`;
			mouseCatcher.style.top = `${margin.top}px`;
			mouseCatcher.style.height = `${chartHeight}px`;
			mouseCatcher.style.width = `${sliderWidth}px`;

			mouseCatcher.addEventListener('mousemove', (event) => {
				if (event.which !== 1) return;
				event.preventDefault();
				this.emit('update', { year: years[i].label, value: yScale.invert(event.offsetY) });
			});

			mouseCatcher.addEventListener('mousedown', (event) => {
				event.preventDefault();

				this.emit('update', { year: years[i].label, value: yScale.invert(event.offsetY) });
			});

			mouseCatcher.addEventListener('mouseup', (event) => {
				event.preventDefault();
				this.emit('update', { year: years[i].label, value: yScale.invert(event.offsetY) });
			});

			mouseCatcher.addEventListener('click', (event) => {
				event.preventDefault();
				console.log(years[i].label);
				console.log(yScale.invert(event.offsetY));
				console.log("the click worked");
				this.emit('update', { year: years[i].label, value: yScale.invert(event.offsetY) });
			})

			elements.container.appendChild(mouseCatcher);
		})		

		elements.container.appendChild(elements.svg.node());

		this.update();
	}
}
