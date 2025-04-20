import ExerciseDTO from "../dto/ExerciseDTO";
import QuestionService from "./QuestionService";

export default class ExerciseService {
    private questionService: QuestionService;

    constructor() {
        this.questionService = new QuestionService();
    }

    createExercises(): ExerciseDTO[] {
        const exercises: ExerciseDTO[] = [];

        // Bài 1: Write two equivalent ratios (6 câu, mỗi câu có 1 bảng 3x2)
        const exercise1Questions = this.questionService.createTableQuestions(6);
        exercises.push(
            new ExerciseDTO("Write two equivalent ratios", exercise1Questions)
        );

        // Bài 2: Determine whether the ratios are equivalent (6 câu)
        const exercise2Questions =
            this.questionService.createFractionQuestions(6);
        exercises.push(
            new ExerciseDTO(
                "Determine whether the ratios are equivalent",
                exercise2Questions
            )
        );

        // Bài 3: Use equivalent ratios to find the unknown value (6 câu)
        const exercise3Questions =
            this.questionService.createVariableQuestions(6);
        exercises.push(
            new ExerciseDTO(
                "Use equivalent ratios to find the unknown value",
                exercise3Questions
            )
        );

        return exercises;
    }
}
