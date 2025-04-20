import WorksheetScene from "../scenes/WorksheetScene";
import WorksheetService from "../services/WorksheetService";
import WorksheetDTO from "../dto/WorksheetDTO";
import ExportService from "../services/ExportService";

export default class WorksheetController {
    private scene: WorksheetScene;
    private worksheetService: WorksheetService;
    private exportService: ExportService;
    private worksheet: WorksheetDTO | null = null;

    constructor(scene: WorksheetScene) {
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
