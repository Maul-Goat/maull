
import React, { useRef, useEffect } from 'react';

const TopoCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let animationTime = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawTopographicBackground = () => {
      animationTime += 0.3;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#8B5E7E');
      gradient.addColorStop(0.25, '#D68A95');
      gradient.addColorStop(0.5, '#E8B4C8');
      gradient.addColorStop(0.75, '#B8E0C8');
      gradient.addColorStop(1, '#90D5B0');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const gridSize = 60;
      ctx.strokeStyle = 'rgba(150, 100, 140, 0.12)';
      ctx.lineWidth = 1;
      
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.strokeRect(x, y, gridSize, gridSize);
        }
      }
      
      for (let y = 0; y < canvas.height; y += 80) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.22 - (y / canvas.height) * 0.12})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        
        for (let x = 0; x < canvas.width; x += 3) {
          const wave = Math.sin((x * 0.005) + (animationTime * 0.02) + (y * 0.003)) * 30;
          const distortion = Math.cos((y * 0.005) + (animationTime * 0.015)) * 20;
          const posY = y + wave + distortion;
          
          if (x === 0) {
            ctx.moveTo(x, posY);
          } else {
            ctx.lineTo(x, posY);
          }
        }
        ctx.stroke();
      }
      
      for (let i = 0; i < 8; i++) {
        const circleY = ((animationTime * 0.8 + i * 100) % (canvas.height + 200)) - 100;
        const circleX = canvas.width * (0.2 + Math.sin(animationTime * 0.003 + i) * 0.15);
        const radius = 80 + Math.sin(animationTime * 0.01 + i) * 30;
        
        const glowGradient = ctx.createRadialGradient(circleX, circleY, 0, circleX, circleY, radius);
        glowGradient.addColorStop(0, `rgba(255, 220, 230, ${0.25 - i * 0.025})`);
        glowGradient.addColorStop(0.6, 'rgba(200, 140, 160, 0.08)');
        glowGradient.addColorStop(1, 'rgba(200, 140, 160, 0)');
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(circleX, circleY, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      
      animationFrameId = requestAnimationFrame(drawTopographicBackground);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    drawTopographicBackground();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="topo-bg" />;
};

export default TopoCanvas;
