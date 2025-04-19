import QuestionDTO from "./QuestionDTO";
export default class ExerciseDTO {
    title: string;
    questions: QuestionDTO[];

    constructor(title: string, questions: QuestionDTO[]) {
        this.title = title;
        this.questions = questions;
    }
}
