export default function Canvas(
    width,
    height,
    padding
){

    let innerWidth = width - padding[2] - padding[3],
        innerHeight = height - padding[0] - padding[1],
        top = padding[0],
        middle = padding[0] + (height - padding[0] - padding[1])/2,
        bottom = height - padding[1],
        left = padding[2],
        center = padding[2] + (width - padding[2] - padding[3])/2,
        right = width - padding[3];

    return {
        innerWidth,
        innerHeight,
        top,
        middle,
        bottom,
        left,
        center,
        right,
        w: width,
        h: height,
        iW: innerWidth,
        iH: innerHeight,
        t: top,
        m: middle,
        b: bottom,
        l: left,
        c: center,
        r: right
    };
}