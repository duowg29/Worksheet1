import Phaser from "phaser";

export default class BoxService {
    static createBox(
        scene: Phaser.Scene,
        x: number,
        y: number,
        title: string,
        text: string
    ): Phaser.GameObjects.Container {
        const boxWidth = scene.scale.width * 0.35;
        const padding = 12;

        const box = scene.add.container(x, y);

        const titleText = scene.add
            .text(0, 0, title, {
                fontFamily: "Arial",
                fontSize: `${scene.scale.width * 0.02}px`,
                fontStyle: "bold",
                color: "#000",
                align: "center",
                wordWrap: {
                    width: boxWidth - padding * 2,
                    useAdvancedWrap: true,
                },
            })
            .setOrigin(0.5, 0);

        const contentText = scene.add
            .text(0, titleText.height + padding, text, {
                fontFamily: "Arial",
                fontSize: `${scene.scale.width * 0.015}px`,
                color: "#000",
                align: "left",
                wordWrap: {
                    width: boxWidth - padding * 2,
                    useAdvancedWrap: true,
                },
            })
            .setOrigin(0.5, 0);
        const boxHeight = titleText.height + contentText.height + padding * 3;

        const background = scene.add
            .rectangle(0, boxHeight / 2, boxWidth, boxHeight, 0xffffff)
            .setStrokeStyle(4, 0x000000)
            .setOrigin(0.5);

        titleText.setY(padding);
        contentText.setY(titleText.y + titleText.height + padding);
        box.add([background, titleText, contentText]);

        box.setSize(boxWidth, boxHeight);
        box.setInteractive();
        box.on("pointerover", () => {
            box.setScale(1.1);
        });
        box.on("pointerout", () => {
            box.setScale(1);
        });
        return box;
    }
}
