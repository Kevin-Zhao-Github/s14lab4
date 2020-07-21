/**
 * @class Scatter
 */
class Scatter {

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
        this.scX = d3.scaleLinear().range([0, this.gW]);
        this.scY = d3.scaleLinear().range([this.gH, 0]);
        this.sizeScale = d3.scaleSqrt().range([0, 5]);
        this.points = null;
        this.numX = this.numY = this.xMin = this.xMax = this.yMin = this.yMax = -1;
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
            .text('Years of Experience');
        vis.axisYG = vis.g.append('g')
            .attr('class', 'axis axisY')
            .style('transform', `translateX(${-15}px)`);
        vis.axisYG.append('text')
            .attr('class', 'label labelY')
            .style('transform', `rotate(-90deg) translate(-${vis.gH / 2}px, -30px)`)
            .style("font-size", "12px")
            .text('Homework Hours');

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

        vis.scX.domain(d3.extent(data, d => d.experience_yr));
        vis.scY.domain([0, d3.max(data, d => d.hw1_hrs)]);

        vis.xMin = vis.scX.domain()[0];
        vis.xMax = vis.scX.domain()[1];
        vis.yMin = vis.scY.domain()[0];
        vis.yMax = vis.scY.domain()[1];

        vis.numX = vis.xMax - vis.xMin + 1;
        vis.numY = vis.yMax - vis.yMin + 1;

        vis.points = new Array(vis.numX * vis.numY).fill(0);

        vis.data.forEach(d => {
            vis.points[(d.experience_yr - vis.xMin) * vis.numY + (d.hw1_hrs - vis.yMin)]++;
        });

        vis.sizeScale.domain((d3.extent(vis.points)));

        console.log(vis.points);

        vis.axisX.scale(vis.scX);
        vis.axisY.scale(vis.scY)

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

        const showMe = vis.g.selectAll('.scatterG')
            .data(vis.points)
            .join(
                enter => enter
                    .append('g')
                    .attr('class', 'scatterG')
                    .each(function(d, i) {
                        const g = d3.select(this);
                        g.append('circle')
                            .attr('cy', Math.round(vis.scY(i % vis.numY + vis.yMin)))
                            .attr('cx', Math.round(vis.scX(Math.floor(i / vis.numY + vis.xMin))))
                            .attr('r', Math.round(vis.sizeScale(d)))
                            .attr('fill', 'rgba(0, 0, 128, 1)');
                    })
            );

        vis.axisXG.call(vis.axisX);
        vis.axisYG.call(vis.axisY);
    }
}