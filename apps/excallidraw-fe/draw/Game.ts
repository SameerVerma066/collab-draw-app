import { getExistingShapes } from "./http";

type Tool = "circle" | "pencil" | "rect";

type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
} | {
    type: "pencil";
    points: { x: number; y: number; }[];
};

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes: Shape[];
    private roomId: string;
    private clicked: boolean;
    private startX = 0;
    private startY = 0;
    private selectedTool: Tool = "pencil";
    private currentPath: { x: number; y: number; }[] = [];
    private isPanning: boolean = false;
    private previousX = 0;
    private previousY = 0;
    private viewportTransform = { x: 0, y: 0, scale: 1 };
    
    socket: WebSocket;
    
    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.existingShapes = [];
        this.roomId = roomId;
        this.socket = socket;
        this.clicked = false;
        
        // Bind handlers to the class instance
        this.mouseDownHandler = this.mouseDownHandler.bind(this);
        this.mouseUpHandler = this.mouseUpHandler.bind(this);
        this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
        this.keyDownHandler = this.keyDownHandler.bind(this);
        this.keyUpHandler = this.keyUpHandler.bind(this);
        this.mouseWheelHandler = this.mouseWheelHandler.bind(this);
        
        this.init();
        this.initHandlers();
        this.initMouseHandlers();
    }
    
    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
        this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
        this.canvas.removeEventListener("wheel", this.mouseWheelHandler);
        window.removeEventListener("keydown", this.keyDownHandler);
        window.removeEventListener("keyup", this.keyUpHandler);
    }
    
    setTool(tool: "circle" | "pencil" | "rect") {
        this.selectedTool = tool;
    }
    
    async init() {
        this.existingShapes = await getExistingShapes(this.roomId);
        this.clearCanvas();
    }
    
    initHandlers() {
        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === "chat") {
                const parsedShape = JSON.parse(message.message);
                this.existingShapes.push(parsedShape.shape);
                this.clearCanvas();
            }
        };
    }
    
    clearCanvas() {
        // Reset the transform before clearing to avoid artifacts from previous transforms
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Apply the current viewport transformation
        this.ctx.setTransform(
            this.viewportTransform.scale,
            0,
            0,
            this.viewportTransform.scale,
            this.viewportTransform.x,
            this.viewportTransform.y
        );

        this.ctx.strokeStyle = "#ffffff";
        this.ctx.lineWidth = 2 / this.viewportTransform.scale; // Adjust line width based on scale
        
        this.existingShapes.forEach((shape) => {
            if (shape.type === "rect") {
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            } else if (shape.type === "circle") {
                this.ctx.beginPath();
                this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();
            } else if (shape.type === "pencil") {
                if (shape.points && shape.points.length > 1) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
                    shape.points.forEach(point => {
                        this.ctx.lineTo(point.x, point.y);
                    });
                    this.ctx.stroke();
                    this.ctx.closePath();
                }
            }
        });
    }

    // Get mouse position relative to the canvas (screen coordinates)
    private getScreenMousePosition(e: MouseEvent) {
      const rect = this.canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }

    // Transform screen coordinates to world coordinates (after pan/zoom)
    private getTransformedMousePosition(e: MouseEvent) {
        const screenPos = this.getScreenMousePosition(e);
        const transformedX = (screenPos.x - this.viewportTransform.x) / this.viewportTransform.scale;
        const transformedY = (screenPos.y - this.viewportTransform.y) / this.viewportTransform.scale;
        return {
            x: transformedX,
            y: transformedY
        };
    }
    
    // Panning logic
    private updatePanning(e: MouseEvent) {
        const localX = this.getScreenMousePosition(e).x;
        const localY = this.getScreenMousePosition(e).y;
        this.viewportTransform.x += localX - this.previousX;
        this.viewportTransform.y += localY - this.previousY;
        this.previousX = localX;
        this.previousY = localY;
    }
    
    // Zooming logic
    private updateZooming(e: WheelEvent) {
        const oldScale = this.viewportTransform.scale;
        const oldX = this.viewportTransform.x;
        const oldY = this.viewportTransform.y;
        
        const localPos = this.getScreenMousePosition(e);
        
        // Calculate the new scale and clamp it to a reasonable range
        const newScale = this.viewportTransform.scale + e.deltaY * -0.01;
        this.viewportTransform.scale = Math.max(0.1, Math.min(newScale, 5));
        
        // Recalculate the viewport position to zoom towards the cursor
        this.viewportTransform.x = localPos.x - (localPos.x - oldX) * (this.viewportTransform.scale / oldScale);
        this.viewportTransform.y = localPos.y - (localPos.y - oldY) * (this.viewportTransform.scale / oldScale);
    }
    
    // Mouse event handlers
    
    mouseDownHandler(e: MouseEvent) {
        this.clicked = true;
        const pos = this.getTransformedMousePosition(e);
        const screenPos = this.getScreenMousePosition(e);
        this.startX = pos.x;
        this.startY = pos.y;
        
        this.previousX = screenPos.x;
        this.previousY = screenPos.y;
        
        if (this.isPanning) {
            this.canvas.style.cursor = "grabbing";
        } else if (this.selectedTool === "pencil") {
            this.currentPath = [{ x: this.startX, y: this.startY }];
        }
    }
    
    mouseUpHandler(e: MouseEvent) {
        if (!this.clicked) return;
        this.clicked = false;
        
        if (this.isPanning) {
            this.canvas.style.cursor = "grab";
            return;
        }

        let shape: Shape | null = null;
        const pos = this.getTransformedMousePosition(e);
        
        if (this.selectedTool === "rect") {
            shape = {
                type: "rect",
                x: this.startX,
                y: this.startY,
                width: pos.x - this.startX,
                height: pos.y - this.startY,
            };
        } else if (this.selectedTool === "circle") {
            const dx = pos.x - this.startX;
            const dy = pos.y - this.startY;
            const radius = Math.sqrt(dx * dx + dy * dy);
            shape = {
                type: "circle",
                radius,
                centerX: this.startX,
                centerY: this.startY,
            };
        } else if (this.selectedTool === "pencil" && this.currentPath.length > 1) {
            shape = {
                type: "pencil",
                points: this.currentPath,
            };
            this.currentPath = [];
        }
        
        if (shape) {
            this.existingShapes.push(shape);
            if (this.socket.readyState === 1) {
                this.socket.send(JSON.stringify({
                    type: "chat",
                    message: JSON.stringify({ shape }),
                    roomId: this.roomId
                }));
            } else {
                console.error("Websocket is not open", this.socket.readyState);
            }
        }
        this.clearCanvas();
    }
    
    mouseMoveHandler(e: MouseEvent) {
        if (!this.clicked) return;

        if (this.isPanning) {
            this.updatePanning(e);
            this.clearCanvas();
            return;
        }
        
        this.clearCanvas();
        this.ctx.strokeStyle = "rgba(255, 255, 255, 1)";
        const pos = this.getTransformedMousePosition(e);
        
        if (this.selectedTool === "rect") {
            const width = pos.x - this.startX;
            const height = pos.y - this.startY;
            this.ctx.strokeRect(this.startX, this.startY, width, height);
        } else if (this.selectedTool === "circle") {
            const dx = pos.x - this.startX;
            const dy = pos.y - this.startY;
            const radius = Math.sqrt(dx * dx + dy * dy);
            this.ctx.beginPath();
            this.ctx.arc(this.startX, this.startY, radius, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.closePath();
        } else if (this.selectedTool === "pencil") {
            this.currentPath.push({ x: pos.x, y: pos.y });
            this.ctx.beginPath();
            this.ctx.moveTo(this.currentPath[0].x, this.currentPath[0].y);
            this.currentPath.forEach(point => {
                this.ctx.lineTo(point.x, point.y);
            });
            this.ctx.stroke();
            this.ctx.closePath();
        }
    }
    
    mouseWheelHandler(e: WheelEvent) {
        e.preventDefault();
        this.updateZooming(e);
        this.clearCanvas();
    }
    
    // Keyboard handlers for panning mode
    keyDownHandler(e: KeyboardEvent) {
        if (e.code === "Space" && !this.isPanning) {
            e.preventDefault();
            this.isPanning = true;
            this.canvas.style.cursor = "grab";
        }
    }

    keyUpHandler(e: KeyboardEvent) {
        if (e.code === "Space") {
            e.preventDefault();
            this.isPanning = false;
            this.canvas.style.cursor = "default";
        }
    }
    
    initMouseHandlers() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler);
        this.canvas.addEventListener("mouseup", this.mouseUpHandler);
        this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
        this.canvas.addEventListener("wheel", this.mouseWheelHandler, { passive: false });
        window.addEventListener("keydown", this.keyDownHandler);
        window.addEventListener("keyup", this.keyUpHandler);
    }
}
