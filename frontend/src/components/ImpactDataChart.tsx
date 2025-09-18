import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp } from "lucide-react";

interface ImpactData {
  kineticEnergy: number;
  craterSize: number;
  earthquakeMagnitude: number;
  casualties: number;
  economicLoss: number;
}

interface ImpactDataChartProps {
  data?: ImpactData;
  width?: number;
  height?: number;
}

const ImpactDataChart: React.FC<ImpactDataChartProps> = ({ 
  data, 
  width = 400, 
  height = 300 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data || !svgRef.current || !chartContainerRef.current) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    const containerWidth = chartContainerRef.current.clientWidth;
    const containerHeight = height;

    // Set up dimensions and margins
    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const chartWidth = containerWidth - margin.left - margin.right;
    const chartHeight = containerHeight - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', containerWidth)
      .attr('height', containerHeight);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Prepare data for visualization
    const chartData = [
      { 
        category: 'Energy', 
        value: data.kineticEnergy / 1e15, 
        unit: 'PJ',
        color: '#9333ea'
      },
      { 
        category: 'Crater', 
        value: data.craterSize, 
        unit: 'km',
        color: '#f97316'
      },
      { 
        category: 'Magnitude', 
        value: data.earthquakeMagnitude, 
        unit: '',
        color: '#dc2626'
      }
    ];

    // Set up scales
    const xScale = d3.scaleBand()
      .domain(chartData.map(d => d.category))
      .range([0, chartWidth])
      .padding(0.3);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(chartData, d => d.value) || 1])
      .range([chartHeight, 0]);

    // Create bars with gradient
    const defs = svg.append('defs');
    
    chartData.forEach((d, i) => {
      const gradient = defs.append('linearGradient')
        .attr('id', `gradient-${i}`)
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', 0).attr('y1', chartHeight)
        .attr('x2', 0).attr('y2', 0);
      
      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', d.color)
        .attr('stop-opacity', 0.8);
      
      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', d.color)
        .attr('stop-opacity', 1);
    });

    // Add bars
    g.selectAll('.bar')
      .data(chartData)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.category) || 0)
      .attr('width', xScale.bandwidth())
      .attr('y', chartHeight)
      .attr('height', 0)
      .attr('fill', (d, i) => `url(#gradient-${i})`)
      .attr('rx', 4)
      .attr('ry', 4)
      .style('filter', 'drop-shadow(0 4px 8px rgba(147, 51, 234, 0.3))')
      .transition()
      .duration(1000)
      .delay((d, i) => i * 200)
      .attr('y', d => yScale(d.value))
      .attr('height', d => chartHeight - yScale(d.value));

    // Add value labels on bars
    g.selectAll('.bar-label')
      .data(chartData)
      .enter().append('text')
      .attr('class', 'bar-label')
      .attr('x', d => (xScale(d.category) || 0) + xScale.bandwidth() / 2)
      .attr('y', chartHeight)
      .attr('text-anchor', 'middle')
      .attr('fill', '#e2e8f0')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text(d => `${d.value.toFixed(1)}${d.unit}`)
      .transition()
      .duration(1000)
      .delay((d, i) => i * 200)
      .attr('y', d => yScale(d.value) - 5);

    // Add x-axis
    const xAxis = d3.axisBottom(xScale);
    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(xAxis)
      .selectAll('text')
      .attr('fill', '#94a3b8')
      .attr('font-size', '12px');

    // Add y-axis
    const yAxis = d3.axisLeft(yScale).ticks(5);
    g.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .selectAll('text')
      .attr('fill', '#94a3b8')
      .attr('font-size', '12px');

    // Style axes
    g.selectAll('.domain')
      .attr('stroke', '#475569')
      .attr('stroke-width', 1);
    
    g.selectAll('.tick line')
      .attr('stroke', '#475569')
      .attr('stroke-width', 1);

  }, [data, width, height]);

  // Create damage timeline chart
  const createTimelineChart = () => {
    if (!data) return null;

    const timelineData = [
      { time: '0s', event: 'Impact', intensity: 100, color: '#dc2626' },
      { time: '1min', event: 'Shockwave', intensity: 80, color: '#f97316' },
      { time: '10min', event: 'Ejecta Fall', intensity: 60, color: '#eab308' },
      { time: '1hr', event: 'Seismic Activity', intensity: 40, color: '#22d3ee' },
      { time: '24hr', event: 'Climate Effects', intensity: 20, color: '#8b5cf6' }
    ];

    return (
      <div className="mt-6">
        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
          <TrendingUp className="w-4 h-4 mr-2 text-cosmic-blue" />
          Impact Timeline
        </h4>
        
        <div className="space-y-3">
          {timelineData.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-12 text-xs text-muted-foreground font-mono">
                {item.time}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-foreground">{item.event}</span>
                  <span className="text-xs text-muted-foreground">{item.intensity}%</span>
                </div>
                
                <div className="w-full bg-muted/30 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-1000 delay-300"
                    style={{ 
                      width: `${item.intensity}%`,
                      backgroundColor: item.color,
                      boxShadow: `0 0 8px ${item.color}50`
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <span>Impact Metrics</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {data ? (
            <div>
              <div ref={chartContainerRef} className="w-full">
                <svg ref={svgRef}></svg>
              </div>
              
              {createTimelineChart()}
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-3 animate-pulse" />
              <p className="text-muted-foreground">Run a simulation to see impact metrics</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImpactDataChart;