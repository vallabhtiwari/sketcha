export type Message = DrawMessage

export type DrawMessage = {
    type: "draw",
    payload: {
        startX: number,
        startY: number,
        endX: number,
        endY: number
    }
}