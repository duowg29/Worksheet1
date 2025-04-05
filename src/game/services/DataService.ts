import ClassDTO from "../dto/ClassDTO";
import CheatsheetDTO from "../dto/CheatsheetDTO";
import HeaderDTO from "../dto/HeaderDTO";
import ContentDTO from "../dto/ContentDTO";

let idCounter = 1;

function generateId(prefix: string): string {
    const id = `${prefix}${idCounter}`;
    idCounter++;
    return id;
}

export default class DataService {
    static loadClasses(jsonData: any): ClassDTO[] {
        if (!Array.isArray(jsonData)) {
            throw new Error("Dữ liệu không hợp lệ, jsonData phải là mảng.");
        }

        return jsonData.map((cls: any) => {
            if (!cls.cheatsheets || !Array.isArray(cls.cheatsheets)) {
                console.warn(
                    `Cảnh báo: cheatsheets không phải là mảng trong lớp học: ${cls.title}`
                );
                cls.cheatsheets = [];
            }

            return new ClassDTO(
                generateId("class"),
                cls.title,
                cls.cheatsheets.map((ch: any) => {
                    if (!ch.headers || !Array.isArray(ch.headers)) {
                        console.warn(
                            `Cảnh báo: headers không phải là mảng trong cheatsheet: ${ch.name}`
                        );
                        ch.headers = [];
                    }

                    return new CheatsheetDTO(
                        generateId("sheet"),
                        ch.name,
                        ch.headers.map((hd: any) => {
                            if (!hd.contents || !Array.isArray(hd.contents)) {
                                console.warn(
                                    `Cảnh báo: contents không phải là mảng trong header: ${hd.title}`
                                );
                                hd.contents = [];
                            }

                            const image = hd.image
                                ? {
                                      path: hd.image.path,
                                      x: hd.image.x,
                                      y: hd.image.y,
                                      width: hd.image.width,
                                      height: hd.image.height,
                                      rotation: hd.image.rotation,
                                  }
                                : null;

                            return new HeaderDTO(
                                generateId("header"),
                                hd.title,
                                hd.contents.map(
                                    (ct: any) =>
                                        new ContentDTO(
                                            generateId("content"),
                                            ct.text
                                        )
                                ),
                                image
                            );
                        })
                    );
                })
            );
        });
    }
}
