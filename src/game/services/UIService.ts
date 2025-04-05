export default class UIService {
    static createClassButtons(
        scene: Phaser.Scene,
        classes: any[],
        currentClassIndex: number,
        callback: (index: number) => void
    ): Phaser.GameObjects.Text[] {
        const buttons: Phaser.GameObjects.Text[] = [];
        const buttonWidth = scene.scale.width * 0.15;
        const buttonHeight = scene.scale.height * 0.05;
        const buttonSpacing = scene.scale.width * 0.02;

        classes.forEach((cls, index) => {
            const buttonY =
                scene.scale.width * 0.1 +
                index * (buttonHeight + buttonSpacing);
            const button = scene.add
                .text(scene.scale.width * 0.05, buttonY, cls.title, {
                    fontFamily: "Arial",
                    fontSize: `${scene.scale.width * 0.02}px`,
                    color: index === currentClassIndex ? "#000" : "#7f8c8d",
                    backgroundColor:
                        index === currentClassIndex ? "#3498db" : "#7f8c8d",
                    padding: { left: 10, right: 10, top: 5, bottom: 5 },
                })
                .setInteractive()
                .setOrigin(0.5);
            button.on("pointerover", () => {
                button.setScale(1.1);
            });

            button.on("pointerout", () => {
                button.setScale(1);
            });
            button.on("pointerup", () => callback(index));
            buttons.push(button);
        });

        return buttons;
    }

    static updateClassButtons(
        buttons: Phaser.GameObjects.Text[],
        currentClassIndex: number
    ) {
        buttons.forEach((button, index) => {
            button.setColor(index === currentClassIndex ? "#fff" : "#000");
            button.setBackgroundColor(
                index === currentClassIndex ? "#3498db" : "#7f8c8d"
            );
        });
    }
}
