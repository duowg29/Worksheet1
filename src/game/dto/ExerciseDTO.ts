import QuestionDTO from "./QuestionDTO";
export default class ExerciseDTO {
    private title: string;
    public questions: QuestionDTO[];

    constructor(title: string, questions: QuestionDTO[]) {
        this.title = title;
        this.questions = questions;
    }

    getTitle(): string {
        return this.title;
    }
}
