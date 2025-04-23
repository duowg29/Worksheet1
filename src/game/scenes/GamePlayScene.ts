import Phaser from "phaser";
import WorksheetController from "../controllers/WorksheetController";
import WorksheetView from "../view/WorksheetView";
// Tải font từ Google Fonts
const loadFont = () => {
    const link = document.createElement("link");
    link.href =
        "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
};

export default class GamePlayScene extends Phaser.Scene {
    private worksheetController: WorksheetController;
    private worksheetView: WorksheetView;

    constructor() {
        super({ key: "GamePlayScene" });
    }

    preload(): void {
        loadFont();
    }

    create(): void {
        this.worksheetController = new WorksheetController(this);
        this.worksheetView = new WorksheetView(this);
        this.createWorksheet();
    }

    createWorksheet(): void {
        const worksheet = this.worksheetController.createWorksheet();
        this.worksheetView.createWorksheet(worksheet);
    }

    public getWorksheetController(): WorksheetController {
        return this.worksheetController;
    }

    public getWorksheetContainer(): Phaser.GameObjects.Container | null {
        return this.worksheetView.getWorksheetContainer();
    }

    public getButtonContainer(): Phaser.GameObjects.Container | null {
        return this.worksheetView.getButtonContainer();
    }

    public getWorksheetHeight(): number {
        return this.worksheetView.getWorksheetHeight();
    }
}
