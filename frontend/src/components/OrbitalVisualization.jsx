import { useEffect, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Play, Pause, RotateCcw, Zap } from "lucide-react";

const OrbitalVisualization = ({ params, isSimulating, animationTime = 10000 }) => {
  const svgRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const drawOrbitalSystem = useCallback(() => {
    if (!svgRef.current || !params) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 600;
    const height = 400;
    const centerX = width / 2;
    const centerY = height / 2;

    svg.attr('width', width).attr('height', height);

    // Create background with stars
    const stars = svg.append('g').attr('class', 'stars');
    for (let i = 0; i < 100; i++) {
      stars.append('circle')
        .attr('cx', Math.random() * width)
        .attr('cy', Math.random() * height)
        .attr('r', Math.random() * 1.5)
        .attr('fill', '#ffffff')
        .attr('opacity', Math.random() * 0.8 + 0.2);
    }

    // Draw Earth
    const earth = svg.append('g').attr('class', 'earth');
    earth.append('circle')
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('r', 20)
      .attr('fill', '#4ade80')
      .attr('stroke', '#22d3ee')
      .attr('stroke-width', 2);

    // Earth's orbit (reference)
    svg.append('circle')
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('r', 150)
      .attr('fill', 'none')
      .attr('stroke', '#475569')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '5,5')
      .attr('opacity', 0.3);

    // Calculate asteroid trajectory
    const asteroidSize = Math.max(2, Math.min(8, parseFloat(params.asteroidSize) / 50));
    const velocity = parseFloat(params.velocity) || 20;
    const approachAngle = (parseFloat(params.approachAngle) || 45) * (Math.PI / 180);
    
    // Asteroid starting position (off-screen)
    const startDistance = 300;
    const startX = centerX + Math.cos(approachAngle) * startDistance;
    const startY = centerY + Math.sin(approachAngle) * startDistance;
    
    // Impact point (Earth's surface)
    const impactX = centerX + Math.cos(approachAngle + Math.PI) * 20;
    const impactY = centerY + Math.sin(approachAngle + Math.PI) * 20;

    // Draw trajectory line
    svg.append('line')
      .attr('x1', startX)
      .attr('y1', startY)
      .attr('x2', impactX)
      .attr('y2', impactY)
      .attr('stroke', '#f97316')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '3,3')
      .attr('opacity', 0.6);

    // Create asteroid
    const asteroid = svg.append('g').attr('class', 'asteroid');
    asteroid.append('circle')
      .attr('r', asteroidSize)
      .attr('fill', '#dc2626')
      .attr('stroke', '#f97316')
      .attr('stroke-width', 1);

    // Position asteroid at start
    asteroid.attr('transform', `translate(${startX}, ${startY})`);

    // Add velocity indicator
    const velocityGroup = svg.append('g').attr('class', 'velocity-indicator');
    velocityGroup.append('text')
      .attr('x', 20)
      .attr('y', 30)
      .attr('fill', '#e2e8f0')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text(`Velocity: ${velocity} km/s`);

    // Add size indicator
    velocityGroup.append('text')
      .attr('x', 20)
      .attr('y', 50)
      .attr('fill', '#e2e8f0')
      .attr('font-size', '14px')
      .text(`Size: ${params.asteroidSize}m`);

    // Store elements for animation
    svg.datum({
      asteroid,
      startX,
      startY,
      impactX,
      impactY,
      earth
    });
  }, [params]);

  const showImpactEffect = useCallback((earth, impactX, impactY) => {
    const svg = d3.select(svgRef.current);
    
    // Create impact explosion
    const explosion = svg.append('g').attr('class', 'explosion');
    
    // Multiple explosion rings
    for (let i = 0; i < 3; i++) {
      explosion.append('circle')
        .attr('cx', impactX)
        .attr('cy', impactY)
        .attr('r', 0)
        .attr('fill', 'none')
        .attr('stroke', i === 0 ? '#ffffff' : i === 1 ? '#f97316' : '#dc2626')
        .attr('stroke-width', 3 - i)
        .attr('opacity', 1)
        .transition()
        .delay(i * 200)
        .duration(1000)
        .attr('r', 50 + i * 20)
        .attr('opacity', 0)
        .remove();
    }

    // Earth shake effect
    earth
      .transition()
      .duration(100)
      .attr('transform', 'translate(2, 0)')
      .transition()
      .duration(100)
      .attr('transform', 'translate(-2, 0)')
      .transition()
      .duration(100)
      .attr('transform', 'translate(0, 0)');
  }, []);

  const startAnimation = useCallback(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const data = svg.datum();
    
    if (!data) return;

    setIsPlaying(true);
    setCurrentTime(0);

    // Animate asteroid movement
    data.asteroid
      .transition()
      .duration(animationTime)
      .ease(d3.easeLinear)
      .attrTween('transform', () => {
        return (t) => {
          setCurrentTime(t * 100);
          const x = data.startX + (data.impactX - data.startX) * t;
          const y = data.startY + (data.impactY - data.startY) * t;
          return `translate(${x}, ${y})`;
        };
      })
      .on('end', () => {
        setIsPlaying(false);
        // Impact effect
        showImpactEffect(data.earth, data.impactX, data.impactY);
      });
  }, [animationTime, showImpactEffect]);

  const pauseAnimation = useCallback(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const data = svg.datum();
    
    if (data && data.asteroid) {
      data.asteroid.interrupt();
    }
    
    setIsPlaying(false);
  }, []);

  const resetAnimation = useCallback(() => {
    if (!svgRef.current) return;

    pauseAnimation();
    setCurrentTime(0);
    drawOrbitalSystem();
  }, [pauseAnimation, drawOrbitalSystem]);

  const getCompositionColor = useCallback((composition) => {
    switch (composition) {
      case 'rock': return '#8b5cf6';
      case 'metal': return '#6b7280';
      case 'ice': return '#22d3ee';
      case 'mixed': return '#f97316';
      default: return '#dc2626';
    }
  }, []);

  useEffect(() => {
    if (!params || !svgRef.current) return;
    drawOrbitalSystem();
  }, [params, drawOrbitalSystem]);

  useEffect(() => {
    if (isSimulating && !isPlaying) {
      startAnimation();
    } else if (!isSimulating && isPlaying) {
      pauseAnimation();
    }
  }, [isSimulating, isPlaying, startAnimation, pauseAnimation]);

  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-cosmic-blue" />
            <span>Orbital Trajectory</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge 
              className={`${getCompositionColor(params?.composition)} text-white`}
              style={{ backgroundColor: getCompositionColor(params?.composition) }}
            >
              {params?.composition || 'Unknown'}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Visualization */}
        <div className="bg-black/80 rounded-lg border border-border/50 overflow-hidden">
          <svg ref={svgRef} className="w-full h-auto" style={{ maxHeight: '400px' }} />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              onClick={isPlaying ? pauseAnimation : startAnimation}
              disabled={!params}
              size="sm"
              className="bg-gradient-cosmic hover:shadow-glow"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            
            <Button
              onClick={resetAnimation}
              disabled={!params}
              variant="outline"
              size="sm"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Progress:</span>
            <span className="text-sm font-mono font-bold text-primary">
              {currentTime.toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Trajectory Info */}
        {params && (
          <div className="grid grid-cols-2 gap-4 p-3 bg-muted/20 rounded-lg border border-border/50">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Approach Angle</div>
              <div className="font-semibold">{params.approachAngle || 45}°</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Impact Velocity</div>
              <div className="font-semibold flex items-center">
                <Zap className="w-3 h-3 mr-1 text-cosmic-orange" />
                {params.velocity || 20} km/s
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

OrbitalVisualization.propTypes = {
  params: PropTypes.shape({
    asteroidSize: PropTypes.string,
    velocity: PropTypes.string,
    composition: PropTypes.string,
    approachAngle: PropTypes.string
  }),
  isSimulating: PropTypes.bool,
  animationTime: PropTypes.number
};

export default OrbitalVisualization;