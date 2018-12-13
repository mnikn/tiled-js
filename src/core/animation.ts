import * as _ from 'lodash';

const twinkleFrame: any[] = [{
        stroke: 'black',
        strokeWidth: 2,
        strokeDasharray: 2
    },
    {
        stroke: 'black',
        strokeWidth: 2,
        strokeDasharray: 2.5
    },
    {
        stroke: 'black',
        strokeWidth: 2,
        strokeDasharray: 3
    }
];

export function twinkle(element): Event {
    return element.animate(twinkleFrame, {
        duration: 1000,
        iterations: Infinity
    });
}