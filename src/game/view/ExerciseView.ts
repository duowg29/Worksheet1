import Phaser from "phaser";
import ExerciseDTO from "../dto/ExerciseDTO";
import QuestionView from "./QuestionView";

export default class ExerciseView {
    private scene: Phaser.Scene;
    private container: Phaser.GameObjects.Container;
    private questionView: QuestionView;

    constructor(scene: Phaser.Scene, container: Phaser.GameObjects.Container) {
        this.scene = scene;
        this.container = container;
        this.questionView = new QuestionView(scene, container);
    }

    drawExercise(
        exercise: ExerciseDTO,
        exerciseNumber: number,
        yOffset: number
    ): number {
        this.container.add(
            this.scene.add
                .text(
                    this.scene.scale.width * 0.05,
                    yOffset,
                    `${exerciseNumber}. ${exercise.getTitle()}`,
                    {
                        fontFamily: "Nunito",
                        fontSize: `${this.scene.scale.width * 0.025}px`,
                        color: "#000",
                        fontStyle: "bold",
                    }
                )
                .setOrigin(0, 0)
        );
        yOffset += this.scene.scale.height * 0.06;

        let maxYOffset = yOffset;

        exercise.getQuestions().forEach((question: any, index: number) => {
            if (question.getType() === "table") {
                const tableWidth = this.scene.scale.width * 0.05;
                const tableHeight = this.scene.scale.height * 0.03;
                const xStart =
                    this.scene.scale.width * 0.1 +
                    (index % 3) * this.scene.scale.width * 0.3;
                const yStart =
                    yOffset +
                    Math.floor(index / 3) * this.scene.scale.height * 0.005;

                this.questionView.drawTableQuestion(
                    xStart,
                    yStart,
                    index + 1,
                    question,
                    tableWidth,
                    tableHeight
                );

                const tableSectionHeight =
                    yStart + tableHeight + this.scene.scale.height * 0.02;
                maxYOffset = Math.max(maxYOffset, tableSectionHeight);

                if (index % 3 === 2) {
                    yOffset += this.scene.scale.height * 0.08;
                }
            } else if (question.getType() === "fraction") {
                const xStart =
                    this.scene.scale.width * 0.08 +
                    (index % 3) * this.scene.scale.width * 0.25;
                const yStart =
                    yOffset +
                    Math.floor(index / 3) * this.scene.scale.height * 0.04;

                this.questionView.drawFractionQuestion(
                    xStart,
                    yStart,
                    index + 7,
                    question
                );

                const sectionHeight = yStart + this.scene.scale.height * 0.03;
                maxYOffset = Math.max(maxYOffset, sectionHeight);

                if (index % 3 === 2) {
                    yOffset += this.scene.scale.height * 0.05;
                }
            } else if (question.getType() === "variable") {
                const xStart =
                    this.scene.scale.width * 0.08 +
                    (index % 3) * this.scene.scale.width * 0.3;
                const yStart =
                    yOffset +
                    Math.floor(index / 3) * this.scene.scale.height * 0.05;

                this.questionView.drawVariableQuestion(
                    xStart,
                    yStart,
                    index + 13,
                    question
                );

                const sectionHeight = yStart + this.scene.scale.height * 0.04;
                maxYOffset = Math.max(maxYOffset, sectionHeight);

                if (index % 3 === 2) {
                    yOffset += this.scene.scale.height * 0.05;
                }
            }
        });

        return maxYOffset;
    }

    getQuestionView(): QuestionView {
        return this.questionView;
    }
}
