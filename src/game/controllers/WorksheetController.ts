import WorksheetService from "../services/WorksheetService";
import WorksheetDTO from "../dto/WorksheetDTO";
import ExportService from "../services/ExportService";
import GamePlayScene from "../scenes/GamePlayScene";
import { Game } from "phaser";

export default class WorksheetController {
    private scene: GamePlayScene;
    private worksheetService: WorksheetService;
    private exportService: ExportService;
    private worksheet: WorksheetDTO | null = null;

    constructor(scene: GamePlayScene) {
        this.scene = scene;
        this.worksheetService = new WorksheetService();
        this.exportService = new ExportService(scene);
    }

    createWorksheet(): WorksheetDTO {
        this.worksheet = this.worksheetService.createWorksheet();
        return this.worksheet;
    }

    exportToPDF(): void {
        if (!this.worksheet) return;
        this.exportService.exportToPDF();
    }
}
