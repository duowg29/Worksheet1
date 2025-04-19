import ExerciseDTO from "./ExerciseDTO";

export interface TableData {
    topLeft: number | string;
    topMiddle?: number | string;
    topRight?: number | string;
    bottomLeft: number | string;
    bottomMiddle?: number | string;
    bottomRight?: number | string;
}

export default class WorksheetDTO {
    private name: string;
    private teacher: string;
    private score: string;
    private date: string;
    public exercises: ExerciseDTO[];

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

    getName(): string {
        return this.name;
    }

    getTeacher(): string {
        return this.teacher;
    }

    getScore(): string {
        return this.score;
    }

    getDate(): string {
        return this.date;
    }
}
