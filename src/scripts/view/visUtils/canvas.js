/**
 * Returns a canvas object to aid positionning element on svg visualisations
 * Input:
 * - width, total width in pixel of the svg
 * - height, total height in pixel of the svg
 * - padding, list of top, bottom, left and right paddings
 * 
 * Ouput:
 * - w, width
 * - h, height
 * - innerWidth (iW), width - horizontal padding
 * - innerHeight (iH), height - vertical padding
 * - top (t), top padding
 * - bottom (b), height - bottom padding
 * - middle (m), halfway between top and bottom
 * - left (l), left padding
 * - right (r), width - right padding
 * - center (c), halfway between left and right
 * 
 *    left           center         right
 * +--+----------------+----------------+--+
 * |  |                |                |  |
 * +--+----------------+----------------+--+  top
 * |  |                |                |  |
 * |  |                |                |  |
 * |  |                |                |  |
 * +--+----------------+----------------+--+  middle
 * |  |                |                |  |
 * |  |                |                |  |
 * |  |                |                |  |
 * +--+----------------+----------------+--+  bottom
 * |  |                |                |  |
 * +--+----------------+----------------+--+
 */

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