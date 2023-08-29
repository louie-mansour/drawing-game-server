export class DrawingPart {
    readonly base64Uri: string;
    readonly ownerId: string;

    constructor(args: ConstructorParams) {
        this.base64Uri = args.base64Image;
        this.ownerId = args.ownerId;
    }
}

interface ConstructorParams {
    base64Image: string,
    ownerId: string,
}