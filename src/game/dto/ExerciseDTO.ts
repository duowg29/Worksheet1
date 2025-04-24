import QuestionDTO from "./QuestionDTO";

export default class ExerciseDTO {
    private title: string;
    private questions: QuestionDTO[];

    constructor(title: string, questions: QuestionDTO[]) {
        this.title = title;
        this.questions = questions;
    }

    getTitle(): string {
        return this.title;
    }

    getQuestions(): QuestionDTO[] {
        return this.questions;
    }
}
