import * as d3 from 'd3';
import EventEmitter from 'events';

const margin = { top: 30, bottom: 30, left: 25, right: 10 };

export default class MovableChart extends EventEmitter {
	constructor({ years, width, height, min, max }) {
		super();

		this.el = document.createElement('div');
		this.el.classList.add('movable-chart');
		this.el.style.position = 'relative';
		this.width = width;
		this.height = height;
		this.svg = d3.select(this.el)
						.append("svg")
						.attr('width', width)
						.attr('height', height); 
		this.min = min;
		this.max = max;
	}

	setYears(years){
		this.years = years;
		this.init();
	}

	init(){
		const { years, el, width, height, svg, min, max } = this;

		const chartWidth = width - (margin.left + margin.right);
		const chartHeight = height - (margin.top + margin.bottom);
		const sliderWidth = chartWidth / years.length;
		const yScale = d3.scaleLinear()
						.domain([min, max])
						.range([chartHeight, 0]);

		const xScale = index => (sliderWidth * index) + (sliderWidth / 2);
		const priceAxis = d3.axisLeft(yScale);

		el.innerHTML = '';

		const chartGroup = svg.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		chartGroup.append('rect')
			.attr('fill', 'white')
			.attr('width', chartWidth)
			.attr('height', chartHeight);

		chartGroup.selectAll('text')
			.data(years)
			.enter()
			.append('text')
			.text( d => d.label)
			.attr("x", (d,i) => xScale(i))
			.attr("y", -10)
			.attr("text-anchor", "middle");

		// make an svg path descriptor drawing a line between all the points
		const pathDescriptor = `M ${years.map(({ label, value }, i) => `${xScale(i)} ${yScale(value)}`).join(' L ')}`;

		chartGroup.append('path')
			.attr('class', 'movable-chart__connecting-line')
			.attr('fill', 'none')
			.attr('d', pathDescriptor);

		years.forEach(({ label, value }, i) => {
			console.log(value);
			chartGroup.append('circle')
				.attr('class', 'movable-chart__dot')
				.attr('r', '10')
				.attr('cx', xScale(i))
				.attr('cy', yScale(value))
			;
		});

		el.appendChild(svg.node());

		// add y axis 
		chartGroup.append("g")
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

			el.appendChild(mouseCatcher);
		})		

	}
}
