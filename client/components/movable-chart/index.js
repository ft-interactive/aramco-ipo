import * as d3 from 'd3';
import EventEmitter from 'events';

const margin = { top: 20, bottom: 25, left: 30, right: 10 };

export default class MovableChart extends EventEmitter {
	constructor({ name, width, height, min, max }) {
		super();

		const container = document.createElement('div');
		container.classList.add('movable-chart');
		container.style.position = 'relative';
		this.name = name;
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
		const { name, years, el, width, height, min, max, elements, xScale, yScale } = this;

		// make an svg path descriptor drawing a line between all the points
		const pathDescriptor = `M ${years.map(({ label, value }, i) => `${xScale(i)} ${yScale(value)}`).join(' L ')}`;

		elements.connectingLine.attr('d', pathDescriptor);

		years.forEach(({ value }, i) => {
			elements.dots[i]	
				.attr('cx', xScale(i))
				.attr('cy', yScale(value));
			elements.dotLabels[i]
				.text(() => { 
					if(name === 'oilPrice'){
						return "$" + value.toFixed(0);
					} 
				})
				.attr('x', xScale(i))
				.attr('y', yScale(value) + 25);
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
		priceAxis.tickSize(-chartWidth);
		priceAxis.tickValues([20,40,60,80,100])

		elements.container.innerHTML = '';

		elements.svg = d3.select(elements.container)
			.append("svg")
			.attr('width', width)
			.attr('height', height);

		elements.chartGroup = elements.svg.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		//add x axis year labels
		elements.chartGroup.selectAll('text')
			.data(years)
			.enter()
			.append('text')
			.text( d => d.label)
			.attr("x", (d, i) => xScale(i))
			.attr("y", -10)
			.attr("text-anchor", "middle");

		// add y axis 
		elements.chartGroup.append("g")
				.attr("class", "axis")
				.call(priceAxis)
				.selectAll('text')
				.attr('y', -5);

		//add connecting line
		elements.connectingLine = elements.chartGroup.append('path')
			.attr('class', 'movable-chart__connecting-line')
			.attr('fill', 'none');

		// add dots
		elements.dots = years.map(() => {
			return elements.chartGroup.append('circle')
				.attr('class', 'movable-chart__dot')
				.attr('r', '10');
		});

		elements.dotLabels = years.map( ({label, value }, i) => {
			return elements.chartGroup.append('text')
				.attr('class', 'movable-chart__dotLabel')
				.attr('text-anchor', 'middle');
		});

		// add mouse catchers
		years.forEach(({ label, value }, i) => {
			const mouseCatcher = document.createElement('div');
			let dragging;
			mouseCatcher.classList.add('movable-chart__mouse-catcher');
			mouseCatcher.style.position = 'absolute';
			mouseCatcher.style.left = `${(sliderWidth * i) + margin.left}px`;
			mouseCatcher.style.top = `${margin.top}px`;
			mouseCatcher.style.height = `${chartHeight}px`;
			mouseCatcher.style.width = `${sliderWidth}px`;

			const handleMouseEvent = (event) => {
				event.preventDefault();
				let clickDistance = event.offsetY || event.layerY;
				if (clickDistance > chartHeight){ return max }
				else if(clickDistance < 0 ){ return min }
				this.emit('update', { year: years[i].label, value: yScale.invert(clickDistance) });
			}

			mouseCatcher.addEventListener('mousemove', (event) => {
				if (!dragging) return;
				handleMouseEvent(event);
			});

			mouseCatcher.addEventListener('mousedown', (event) => {
					dragging = true;
					handleMouseEvent(event);
				}
			);

			mouseCatcher.addEventListener(
				'mouseup', 
				(event) => {
					dragging = false;
				}
			);

			const handleTouchEvent = (event) => {
				event.preventDefault();
				let yPosition = event.touches[0].clientY - event.target.getBoundingClientRect().top;
				if (yPosition < 0) yPosition = 0;
				else if (yPosition > chartHeight) yPosition = chartHeight;
				this.emit('update', { year: years[i].label, value: yScale.invert(yPosition) });
			};

			mouseCatcher.addEventListener('touchstart',  handleTouchEvent);
			mouseCatcher.addEventListener('touchmove',  handleTouchEvent);

			elements.container.appendChild(mouseCatcher);
		})		
		elements.container.appendChild(elements.svg.node());

		this.update();
	}
}
