/**
 * @class Bars
 */
class Bars {
    /*
    Constructor
     */
    constructor(_data, _target) {
        // Assign parameters as object fields
        this.data = _data;
        this.target = _target;

        // Elements
        this.svg = null;
        this.g = null;

        // Configs
        this.svgW = 360;
        this.svgH = 360;
        this.gMargin = {top: 50, right: 25, bottom: 75, left: 75};
        this.gW = this.svgW - (this.gMargin.right + this.gMargin.left);
        this.gH = this.svgH - (this.gMargin.top + this.gMargin.bottom);
        this.histogram = d3.histogram();
        this.scX = d3.scaleLinear().range([0, this.gW]);
        this.scY = d3.scaleLinear().range([this.gH, 0]);
        this.axisXG = null;
        this.axisX = d3.axisBottom();
        this.axisYG = null;
        this.axisY = d3.axisLeft();

        // Now init
        this.init();
    }

    /** @function init()
     * Perform one-time setup function
     *
     * @returns void
     */
    init() {
        // Define this vis
        const vis = this;

        // Set up the svg/g work space
        vis.svg = d3.select(`#${vis.target}`)
            .append('svg')
            .attr('width', vis.svgW)
            .attr('height', vis.svgH);
        vis.g = vis.svg.append('g')
            .attr('class', 'container')
            .style('transform', `translate(${vis.gMargin.left}px, ${vis.gMargin.top}px)`);

        vis.axisXG = vis.g.append('g')
            .attr('class', 'axis axisX')
            .style('transform', `translateY(${vis.gH + 15}px)`);
        vis.axisXG.append('text')
            .attr('class', 'label labelX')
            .style('transform', `translate(${vis.gW / 2}px, 40px)`)
            .style("font-size", "12px")
            .text('Age');
        vis.axisYG = vis.g.append('g')
            .attr('class', 'axis axisY')
            .style('transform', `translateX(${-15}px)`);
        vis.axisYG.append('text')
            .attr('class', 'label labelY')
            .style('transform', `rotate(-90deg) translate(-${vis.gH / 2}px, -30px)`)
            .style("font-size", "12px")
            .text('Totals');

        // Now wrangle
        vis.wrangle();
    }

    /** @function wrangle()
     * Preps data for vis
     *
     * @returns void
     */
    wrangle() {
        // Define this vis
        const vis = this;
        console.log('Data', vis.data);
        const ageMap = vis.data.map(d => d.age);

        vis.data_bins = vis.histogram(ageMap);
        vis.scX.domain(d3.extent(ageMap, d => d));
        vis.scY.domain([0, d3.max(vis.data_bins, d => d.length)])
        vis.axisX.scale(vis.scX).ticks(vis.data_bins.length);
        vis.axisY.scale(vis.scY)
        console.log(vis.scX.range() + ' / ' + vis.scX.domain());

        // Now render
        vis.render();
    }

    /** @function wrangle()
     * Builds, updates, removes elements in vis
     *
     * @returns void
     */
    render() {
        // Define this vis
        const vis = this;
        const showMe = vis.g.selectAll('.barG')
            .data(vis.data_bins)
            .join(
                enter => enter
                    .append('g')
                    .attr('class', 'barG')
                    .each(function(d, i) {
                        const g = d3.select(this);
                        const w = Math.round(vis.gW / vis.data_bins.length);
                        const h = vis.gH - vis.scY(d.length);
                        g.style('transform', `translate(${w * i}px, ${vis.gH - h}px`)
                        g.append('rect')
                            .attr('width', Math.floor(w * 0.8))
                            .attr('height', h)
                            .attr('x', Math.floor(w * 0.1))
                            .attr('fill', 'rgba(0, 0, 128, 1)')
                    })
            );

        vis.axisXG.call(vis.axisX);
        vis.axisYG.call(vis.axisY);
    }
}