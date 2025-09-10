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
        
        this.init();
        this.initHandlers();
        this.initMouseHandlers();
    }
    
    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
        this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
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
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeStyle = "#ffffff";
        this.ctx.lineWidth = 2;
        
        this.existingShapes.forEach((shape) => {
            if (shape.type === "rect") {
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            } else if (shape.type === "circle") {
                this.ctx.beginPath();
                this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.closePath();
            } else if (shape.type === "pencil") {
                // Defensive check to prevent TypeError
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

    // Adjust for canvas position on screen
    getMousePosition(e: MouseEvent) {
      const rect = this.canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
    
    mouseDownHandler(e: MouseEvent) {
        this.clicked = true;
        const pos = this.getMousePosition(e);
        this.startX = pos.x;
        this.startY = pos.y;
        
        if (this.selectedTool === "pencil") {
            this.currentPath = [{ x: this.startX, y: this.startY }];
        }
    }
    
    mouseUpHandler(e: MouseEvent) {
        if (!this.clicked) return;
        this.clicked = false;
        
        let shape: Shape | null = null;
        const pos = this.getMousePosition(e);
        
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
    }
    
    mouseMoveHandler(e: MouseEvent) {
        if (this.clicked) {
            this.clearCanvas();
            this.ctx.strokeStyle = "rgba(255, 255, 255, 1)";
            const pos = this.getMousePosition(e);
            
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
    }
    
    initMouseHandlers() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler);
        this.canvas.addEventListener("mouseup", this.mouseUpHandler);
        this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    }
}
