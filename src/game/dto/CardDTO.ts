export default class CardDTO {
    id: string;
    header: string;
    cardId: string;

    constructor(id: string, header: string, cardId: string) {
        this.id = id;
        this.header = header;
        this.cardId = cardId;
    }
}
