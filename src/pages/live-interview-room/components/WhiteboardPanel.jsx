import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WhiteboardPanel = ({ 
  onClose = () => {},
  isVisible = false,
  collaborators = []
}) => {
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const tools = [
    { id: 'pen', name: 'Pen', icon: 'Pen' },
    { id: 'eraser', name: 'Eraser', icon: 'Eraser' },
    { id: 'rectangle', name: 'Rectangle', icon: 'Square' },
    { id: 'circle', name: 'Circle', icon: 'Circle' },
    { id: 'arrow', name: 'Arrow', icon: 'ArrowRight' },
    { id: 'text', name: 'Text', icon: 'Type' }
  ];

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500',
    '#800080', '#008000', '#000080', '#808080'
  ];

  const strokeWidths = [1, 2, 4, 6, 8];

  useEffect(() => {
    if (isVisible && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      context.lineCap = 'round';
      context.strokeStyle = color;
      context.lineWidth = strokeWidth;
      contextRef.current = context;
    }
  }, [isVisible, color, strokeWidth]);

  const startDrawing = (e) => {
    if (tool === 'pen' || tool === 'eraser') {
      setIsDrawing(true);
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      contextRef.current.beginPath();
      contextRef.current.moveTo(x, y);
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (tool === 'eraser') {
      contextRef.current.globalCompositeOperation = 'destination-out';
    } else {
      contextRef.current.globalCompositeOperation = 'source-over';
    }
    
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      contextRef.current.closePath();
      setIsDrawing(false);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveWhiteboard = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'whiteboard.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg shadow-elevation-3 w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
        {/* Whiteboard Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Icon name="PenTool" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-text-primary">Whiteboard</h3>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={saveWhiteboard}
              iconName="Download"
              iconPosition="left"
            >
              Save
            </Button>
            <button
              onClick={onClose}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-muted rounded-lg transition-colors duration-200"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted">
          {/* Tools */}
          <div className="flex items-center space-x-2">
            {tools.map((t) => (
              <button
                key={t.id}
                onClick={() => setTool(t.id)}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  tool === t.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-text-secondary hover:text-text-primary hover:bg-background'
                }`}
                title={t.name}
              >
                <Icon name={t.icon} size={18} />
              </button>
            ))}
          </div>

          {/* Colors */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-text-secondary mr-2">Color:</span>
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-6 h-6 rounded border-2 transition-all duration-200 ${
                  color === c ? 'border-text-primary scale-110' : 'border-border'
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>

          {/* Stroke Width */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-text-secondary mr-2">Size:</span>
            {strokeWidths.map((width) => (
              <button
                key={width}
                onClick={() => setStrokeWidth(width)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                  strokeWidth === width
                    ? 'bg-primary text-primary-foreground'
                    : 'text-text-secondary hover:text-text-primary hover:bg-background'
                }`}
                title={`${width}px`}
              >
                <div
                  className="rounded-full bg-current"
                  style={{ width: `${width + 2}px`, height: `${width + 2}px` }}
                />
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearCanvas}
              iconName="Trash2"
              iconPosition="left"
            >
              Clear
            </Button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full h-full bg-white cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />

          {/* Collaborator Cursors */}
          {collaborators.map((collaborator) => (
            <div
              key={collaborator.id}
              className="absolute pointer-events-none"
              style={{
                left: `${collaborator.cursor?.x || 0}px`,
                top: `${collaborator.cursor?.y || 0}px`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="flex items-center space-x-1">
                <div
                  className="w-3 h-3 rounded-full border-2 border-white"
                  style={{ backgroundColor: collaborator.color }}
                />
                <span
                  className="text-xs font-medium px-2 py-1 rounded-lg text-white"
                  style={{ backgroundColor: collaborator.color }}
                >
                  {collaborator.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted text-xs text-text-secondary">
          <div className="flex items-center space-x-4">
            <span>Tool: {tools.find(t => t.id === tool)?.name}</span>
            <span>Color: {color}</span>
            <span>Size: {strokeWidth}px</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>Synced with participants</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhiteboardPanel;