import Phaser from "phaser";
import WorksheetController from "../controllers/WorksheetController";
import WorksheetView from "../view/WorksheetView";

export default class GamePlayScene extends Phaser.Scene {
    private worksheetController: WorksheetController;
    private worksheetView: WorksheetView;

    constructor() {
        super({ key: "GamePlayScene" });
    }

    preload(): void {
        this.load.script(
            "webfont",
            "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
        );
    }

    create(): void {
        this.worksheetController = new WorksheetController(this);
        this.worksheetView = new WorksheetView(this);

        // Chờ font tải xong trước khi tạo worksheet
        (window as any).WebFont.load({
            google: {
                families: ["Nunito:400,400i,700,700i"],
            },
            active: () => {
                console.log("Font Nunito loaded successfully");
                this.createWorksheet(); // Gọi sau khi font tải xong
            },
            inactive: () => {
                console.error("Failed to load font Nunito");
                this.createWorksheet(); // Vẫn tạo worksheet nếu font không tải được, để tránh treo ứng dụng
            },
        });
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
