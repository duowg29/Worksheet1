import WorksheetDTO from "../dto/WorksheetDTO";
import ExerciseService from "./ExerciseService";

export default class WorksheetService {
    private exerciseService: ExerciseService;

    constructor() {
        this.exerciseService = new ExerciseService();
    }

    createWorksheet(): WorksheetDTO {
        const exercises = this.exerciseService.createExercises();
        return new WorksheetDTO("", "", "", "", exercises);
    }
}
