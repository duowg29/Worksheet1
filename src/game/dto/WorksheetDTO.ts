import ExerciseDTO from "./ExerciseDTO";

export interface TableData {
    topLeft: number;
    topRight: number;
    bottomLeft: number;
    bottomRight: number;
}

export default class WorksheetDTO {
    name: string;
    teacher: string;
    score: string;
    date: string;
    exercises: ExerciseDTO[];

    constructor(
        name: string,
        teacher: string,
        score: string,
        date: string,
        exercises: ExerciseDTO[]
    ) {
        this.name = name;
        this.teacher = teacher;
        this.score = score;
        this.date = date;
        this.exercises = exercises;
    }
}
