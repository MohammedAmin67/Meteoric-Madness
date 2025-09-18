import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Zap, 
  Globe, 
  AlertTriangle,
  Eye,
  EyeOff
} from "lucide-react";

const ImpactDataChart = ({ 
  data, 
  width = 500, 
  height = 350 
}) => {
  const svgRef = useRef(null);
  const chartContainerRef = useRef(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    if (!data || !svgRef.current || !chartContainerRef.current) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    const containerWidth = chartContainerRef.current.clientWidth;
    const containerHeight = height;

    // Responsive dimensions
    const isSmallScreen = containerWidth < 640;
    const margin = { 
      top: 30, 
      right: isSmallScreen ? 20 : 40, 
      bottom: isSmallScreen ? 50 : 70, 
      left: isSmallScreen ? 70 : 90 
    };
    const chartWidth = Math.max(200, containerWidth - margin.left - margin.right);
    const chartHeight = Math.max(150, containerHeight - margin.top - margin.bottom);

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', containerWidth)
      .attr('height', containerHeight);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Prepare data for visualization with better scaling
    const chartData = [
      { 
        category: 'Energy', 
        value: Math.max(0.1, data.kineticEnergy / 1e15), 
        unit: 'PJ',
        color: '#9333ea',
        description: 'Kinetic Energy'
      },
      { 
        category: 'Crater', 
        value: Math.max(0.1, data.craterSize), 
        unit: 'km',
        color: '#f97316',
        description: 'Crater Size'
      },
      { 
        category: 'Magnitude', 
        value: Math.max(1, data.earthquakeMagnitude), 
        unit: '',
        color: '#dc2626',
        description: 'Earthquake'
      }
    ];

    // Set up scales with better responsive handling
    const xScale = d3.scaleBand()
      .domain(chartData.map(d => d.category))
      .range([0, chartWidth])
      .padding(isSmallScreen ? 0.3 : 0.4);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(chartData, d => d.value) * 1.2 || 1])
      .range([chartHeight, 0]);

    // Create gradients for bars
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
        .attr('stop-opacity', 0.6);
      
      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', d.color)
        .attr('stop-opacity', 1);

      // Glow filter
      const filter = defs.append('filter')
        .attr('id', `glow-${i}`)
        .attr('x', '-50%')
        .attr('y', '-50%')
        .attr('width', '200%')
        .attr('height', '200%');

      filter.append('feGaussianBlur')
        .attr('stdDeviation', '3')
        .attr('result', 'coloredBlur');

      const feMerge = filter.append('feMerge');
      feMerge.append('feMergeNode').attr('in', 'coloredBlur');
      feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
    });

    // Add bars with animation
    const bars = g.selectAll('.bar')
      .data(chartData)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.category) || 0)
      .attr('width', Math.max(20, xScale.bandwidth()))
      .attr('y', chartHeight)
      .attr('height', 0)
      .attr('fill', (d, i) => `url(#gradient-${i})`)
      .attr('rx', isSmallScreen ? 4 : 8)
      .attr('ry', isSmallScreen ? 4 : 8)
      .style('filter', (d, i) => `url(#glow-${i})`)
      .style('cursor', 'pointer');

    // Animate bars
    bars.transition()
      .duration(1200)
      .delay((d, i) => i * 300)
      .ease(d3.easeBackOut)
      .attr('y', d => yScale(d.value))
      .attr('height', d => Math.max(2, chartHeight - yScale(d.value)));

    // Add hover effects with properly contained tooltips
    bars.on('mouseover', function(event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('opacity', 0.8);
      
      // Create tooltip that stays within bounds
      const barX = (xScale(d.category) || 0) + xScale.bandwidth() / 2;
      const barY = yScale(d.value);
      
      // Calculate tooltip position to stay within chart bounds
      const tooltipWidth = isSmallScreen ? 80 : 120;
      const tooltipHeight = isSmallScreen ? 35 : 50;
      
      let tooltipX = barX;
      let tooltipY = barY - 20;
      
      // Adjust if tooltip would go outside chart
      if (tooltipX - tooltipWidth/2 < 0) tooltipX = tooltipWidth/2;
      if (tooltipX + tooltipWidth/2 > chartWidth) tooltipX = chartWidth - tooltipWidth/2;
      if (tooltipY - tooltipHeight < 0) tooltipY = barY + 40;
      
      const tooltip = g.append('g')
        .attr('class', 'tooltip')
        .attr('transform', `translate(${tooltipX}, ${tooltipY})`);
      
      // Tooltip background with proper sizing
      const tooltipBg = tooltip.append('rect')
        .attr('x', -tooltipWidth/2)
        .attr('y', -tooltipHeight/2)
        .attr('width', tooltipWidth)
        .attr('height', tooltipHeight)
        .attr('rx', 8)
        .attr('ry', 8)
        .attr('fill', 'rgba(0,0,0,0.95)')
        .attr('stroke', d.color)
        .attr('stroke-width', 2)
        .style('filter', 'drop-shadow(0px 4px 12px rgba(0,0,0,0.3))')
        .style('opacity', 0);

      // Animate tooltip appearance
      tooltipBg.transition()
        .duration(200)
        .style('opacity', 1);

      // Value text with better positioning
      tooltip.append('text')
        .attr('text-anchor', 'middle')
        .attr('y', isSmallScreen ? -8 : -12)
        .attr('fill', 'white')
        .attr('font-size', isSmallScreen ? '12px' : '16px')
        .attr('font-weight', 'bold')
        .text(`${d.value.toFixed(1)}${d.unit}`);
      
      // Description text (responsive)
      if (!isSmallScreen) {
        tooltip.append('text')
          .attr('text-anchor', 'middle')
          .attr('y', 8)
          .attr('fill', '#94a3b8')
          .attr('font-size', '12px')
          .text(d.description);
      }
    })
    .on('mouseout', function() {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('opacity', 1);
      
      g.select('.tooltip').remove();
    });

    // Add value labels with better positioning
    g.selectAll('.bar-label')
      .data(chartData)
      .enter().append('text')
      .attr('class', 'bar-label')
      .attr('x', d => (xScale(d.category) || 0) + xScale.bandwidth() / 2)
      .attr('y', chartHeight + (isSmallScreen ? 20 : 25))
      .attr('text-anchor', 'middle')
      .attr('fill', '#e2e8f0')
      .attr('font-size', isSmallScreen ? '11px' : '14px')
      .attr('font-weight', 'bold')
      .each(function(d) {
        // Wrap long text on small screens
        const text = d3.select(this);
        const value = `${d.value.toFixed(1)}${d.unit}`;
        
        if (isSmallScreen && value.length > 6) {
          text.text(d.value.toFixed(0) + d.unit);
        } else {
          text.text(value);
        }
      })
      .transition()
      .duration(1200)
      .delay((d, i) => i * 300 + 600)
      .attr('y', d => Math.max(15, yScale(d.value) - (isSmallScreen ? 6 : 10)));

    // Add x-axis with responsive styling
    const xAxis = d3.axisBottom(xScale);
    const xAxisGroup = g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(xAxis);

    xAxisGroup.selectAll('text')
      .attr('fill', '#94a3b8')
      .attr('font-size', isSmallScreen ? '10px' : '13px')
      .attr('font-weight', '500')
      .style('text-anchor', 'middle');

    // Add y-axis with better responsive handling
    const yAxisTicks = isSmallScreen ? 3 : 5;
    const yAxis = d3.axisLeft(yScale)
      .ticks(yAxisTicks)
      .tickFormat(d => {
        if (d >= 1000) return `${(d/1000).toFixed(0)}k`;
        if (d >= 100) return d.toFixed(0);
        return d.toFixed(1);
      });
      
    const yAxisGroup = g.append('g')
      .attr('class', 'y-axis')
      .call(yAxis);

    yAxisGroup.selectAll('text')
      .attr('fill', '#94a3b8')
      .attr('font-size', isSmallScreen ? '9px' : '11px');

    // Style axes
    g.selectAll('.domain')
      .attr('stroke', '#475569')
      .attr('stroke-width', 2);
    
    g.selectAll('.tick line')
      .attr('stroke', '#475569')
      .attr('stroke-width', 1);

    // Add grid lines (responsive)
    g.selectAll('.grid-line')
      .data(yScale.ticks(yAxisTicks))
      .enter().append('line')
      .attr('class', 'grid-line')
      .attr('x1', 0)
      .attr('x2', chartWidth)
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .attr('stroke', '#374151')
      .attr('stroke-width', 0.5)
      .attr('stroke-dasharray', '2,2')
      .attr('opacity', 0.3);

  }, [data, width, height, activeTab]);

  // Enhanced responsive timeline chart
  const createTimelineChart = () => {
    if (!data) return null;

    const timelineData = [
      { 
        time: '0s', 
        event: 'Impact', 
        intensity: 100, 
        color: '#dc2626',
        description: 'Initial asteroid collision with Earth'
      },
      { 
        time: '1min', 
        event: 'Shockwave', 
        intensity: 85, 
        color: '#f97316',
        description: 'Seismic waves propagate from impact site'
      },
      { 
        time: '10min', 
        event: 'Ejecta Fall', 
        intensity: 65, 
        color: '#eab308',
        description: 'Debris and molten material rains down'
      },
      { 
        time: '1hr', 
        event: 'Seismic Activity', 
        intensity: 45, 
        color: '#22d3ee',
        description: 'Secondary earthquakes triggered globally'
      },
      { 
        time: '24hr', 
        event: 'Climate Effects', 
        intensity: 25, 
        color: '#8b5cf6',
        description: 'Atmospheric dust affects global climate'
      }
    ];

    return (
      <div className="mt-4 sm:mt-8">
        <h4 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 flex items-center">
          <TrendingUp className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-cosmic-blue" />
          Impact Timeline
        </h4>
        
        <div className="space-y-3 sm:space-y-4">
          {timelineData.map((item, index) => (
            <div key={index} className="group hover:bg-muted/20 p-2 sm:p-3 rounded-lg transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="w-full sm:w-16 text-xs sm:text-sm text-muted-foreground font-mono font-bold flex-shrink-0">
                  {item.time}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 space-y-1 sm:space-y-0">
                    <span className="text-sm font-medium text-foreground truncate">{item.event}</span>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span className="text-xs text-muted-foreground">{item.intensity}%</span>
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                        style={{ borderColor: item.color, color: item.color }}
                      >
                        Active
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="w-full bg-muted/30 rounded-full h-2 sm:h-3 mb-2">
                    <div 
                      className="h-2 sm:h-3 rounded-full transition-all duration-1000 delay-300 relative overflow-hidden"
                      style={{ 
                        width: `${item.intensity}%`,
                        backgroundColor: item.color,
                        boxShadow: `0 0 10px ${item.color}50`
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Smart number formatting to prevent overflow
  const formatNumber = (value, type = 'default') => {
    if (!value) return '0';
    
    const num = parseFloat(value);
    
    switch (type) {
      case 'currency':
        if (num >= 1e12) return `$${(num / 1e12).toFixed(1)}T`;
        if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
        if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
        if (num >= 1e3) return `$${(num / 1e3).toFixed(0)}K`;
        return `$${num.toFixed(0)}`;
      
      case 'casualties':
        if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
        if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
        if (num >= 1e3) return `${(num / 1e3).toFixed(0)}K`;
        return num.toLocaleString();
      
      case 'area':
        if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M km²`;
        if (num >= 1e3) return `${(num / 1e3).toFixed(0)}K km²`;
        return `${num.toLocaleString()} km²`;
      
      default:
        if (num >= 1e12) return `${(num / 1e12).toFixed(1)}T`;
        if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
        if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
        if (num >= 1e3) return `${(num / 1e3).toFixed(0)}K`;
        return num.toLocaleString();
    }
  };

  // Enhanced responsive damage breakdown with auto-expanding containers
  const createDamageBreakdown = () => {
    if (!data) return null;

    const damageCategories = [
      {
        category: 'Infrastructure',
        percentage: 35,
        cost: data.damage.economicLoss * 0.35,
        color: '#dc2626',
        icon: '🏗️'
      },
      {
        category: 'Environmental',
        percentage: 25,
        cost: data.damage.economicLoss * 0.25,
        color: '#059669',
        icon: '🌍'
      },
      {
        category: 'Economic',
        percentage: 20,
        cost: data.damage.economicLoss * 0.20,
        color: '#f97316',
        icon: '💰'
      },
      {
        category: 'Agricultural',
        percentage: 15,
        cost: data.damage.economicLoss * 0.15,
        color: '#22d3ee',
        icon: '🌾'
      },
      {
        category: 'Other',
        percentage: 5,
        cost: data.damage.economicLoss * 0.05,
        color: '#8b5cf6',
        icon: '📊'
      }
    ];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {damageCategories.map((item, index) => (
          <div 
            key={index}
            className="p-3 sm:p-4 bg-muted/20 rounded-lg border border-border/30 hover:shadow-lg transition-all duration-300 min-w-0 flex-1"
          >
            <div className="flex items-start justify-between mb-3 gap-2">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                <span className="text-lg sm:text-xl flex-shrink-0">{item.icon}</span>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-semibold text-foreground truncate">{item.category}</h4>
                  <p className="text-xs text-muted-foreground">Damage estimate</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 min-w-0">
                <div className="text-sm sm:text-base font-bold truncate" style={{ color: item.color }}>
                  {item.percentage}%
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {formatNumber(item.cost, 'currency')}
                </div>
              </div>
            </div>
            
            <div className="w-full bg-muted/30 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-1000"
                style={{ 
                  width: `${item.percentage}%`,
                  backgroundColor: item.color,
                  boxShadow: `0 0 8px ${item.color}50`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-full space-y-4 sm:space-y-6">
      <Card className="bg-card/60 border-border/50 backdrop-blur-sm shadow-cosmic w-full">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-cosmic-orange flex-shrink-0">
                <BarChart3 className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-lg sm:text-xl">Impact Metrics</span>
                <div className="text-xs sm:text-sm text-muted-foreground font-normal">
                  Comprehensive damage analysis
                </div>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowComparison(!showComparison)}
              className="border-border hover:border-primary w-full sm:w-auto flex-shrink-0"
            >
              {showComparison ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showComparison ? 'Hide' : 'Show'} Details
            </Button>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="px-3 sm:px-6 w-full">
          {data ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6 w-full">
              <TabsList className="grid w-full grid-cols-3 bg-muted/30 h-auto">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-gradient-cosmic text-xs sm:text-sm py-2"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="timeline" 
                  className="data-[state=active]:bg-gradient-cosmic text-xs sm:text-sm py-2"
                >
                  Timeline
                </TabsTrigger>
                <TabsTrigger 
                  value="breakdown" 
                  className="data-[state=active]:bg-gradient-cosmic text-xs sm:text-sm py-2"
                >
                  Breakdown
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4 sm:space-y-6 w-full">
                <div ref={chartContainerRef} className="w-full min-h-[300px] sm:min-h-[350px] overflow-hidden">
                  <svg ref={svgRef} className="w-full h-full"></svg>
                </div>

                {/* Key Stats - Enhanced with better number formatting */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full">
                  <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-primary/10 to-cosmic-blue/10 rounded-lg border border-primary/20 min-w-0">
                    <Zap className="w-5 sm:w-6 h-5 sm:h-6 text-primary mx-auto mb-2" />
                    <div className="text-lg sm:text-xl font-bold text-primary break-words">
                      {(data.kineticEnergy / 1e15).toFixed(1)} PJ
                    </div>
                    <div className="text-xs text-muted-foreground">Energy Released</div>
                  </div>
                  
                  <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-cosmic-orange/10 to-warning/10 rounded-lg border border-cosmic-orange/20 min-w-0">
                    <Globe className="w-5 sm:w-6 h-5 sm:h-6 text-cosmic-orange mx-auto mb-2" />
                    <div className="text-lg sm:text-xl font-bold text-cosmic-orange break-words">
                      {data.craterSize.toFixed(0)} km
                    </div>
                    <div className="text-xs text-muted-foreground">Crater Diameter</div>
                  </div>
                  
                  <div className="text-center p-3 sm:p-4 bg-gradient-to-br from-destructive/10 to-warning/10 rounded-lg border border-destructive/20 min-w-0 sm:col-span-1">
                    <Activity className="w-5 sm:w-6 h-5 sm:h-6 text-destructive mx-auto mb-2" />
                    <div className="text-lg sm:text-xl font-bold text-destructive break-words">
                      {data.earthquakeMagnitude.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">Earthquake Magnitude</div>
                  </div>
                </div>

                {/* Enhanced Damage Summary with Smart Formatting */}
                {showComparison && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                    <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0" />
                        <span className="text-sm font-medium text-destructive">Casualties</span>
                      </div>
                      <div className="text-xl font-bold text-destructive break-words">
                        {formatNumber(data.damage.casualties, 'casualties')}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Estimated deaths</div>
                    </div>

                    <div className="p-4 bg-warning/10 rounded-lg border border-warning/20 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-warning text-sm">💰</span>
                        <span className="text-sm font-medium text-warning">Economic Loss</span>
                      </div>
                      <div className="text-xl font-bold text-warning break-words">
                        {formatNumber(data.damage.economicLoss, 'currency')}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Total damages</div>
                    </div>

                    <div className="p-4 bg-cosmic-orange/10 rounded-lg border border-cosmic-orange/20 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <Globe className="w-4 h-4 text-cosmic-orange flex-shrink-0" />
                        <span className="text-sm font-medium text-cosmic-orange">Affected Area</span>
                      </div>
                      <div className="text-xl font-bold text-cosmic-orange break-words">
                        {formatNumber(data.damage.affectedArea, 'area')}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Impact zone</div>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Timeline Tab */}
              <TabsContent value="timeline" className="w-full">
                {createTimelineChart()}
              </TabsContent>

              {/* Breakdown Tab */}
              <TabsContent value="breakdown" className="space-y-4 sm:space-y-6 w-full">
                <div className="flex items-center space-x-2 mb-4">
                  <AlertTriangle className="w-4 sm:w-5 h-4 sm:h-5 text-warning" />
                  <h3 className="text-base sm:text-lg font-semibold">Damage Analysis</h3>
                </div>
                {createDamageBreakdown()}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-8 sm:py-12 w-full">
              <BarChart3 className="w-12 sm:w-16 h-12 sm:h-16 text-muted-foreground mx-auto mb-4 animate-glow-pulse" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Ready for Analysis</h3>
              <p className="text-sm sm:text-base text-muted-foreground px-4">
                Run a simulation to see comprehensive impact metrics and damage analysis
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

ImpactDataChart.propTypes = {
  data: PropTypes.shape({
    kineticEnergy: PropTypes.number.isRequired,
    craterSize: PropTypes.number.isRequired,
    earthquakeMagnitude: PropTypes.number.isRequired,
    damage: PropTypes.shape({
      economicLoss: PropTypes.number.isRequired,
      casualties: PropTypes.number.isRequired,
      affectedArea: PropTypes.number.isRequired
    }).isRequired
  }),
  width: PropTypes.number,
  height: PropTypes.number
};

export default ImpactDataChart;