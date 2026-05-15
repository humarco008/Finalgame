// Database delle animazioni di Ash
export const runningLinks = [
    'https://i.ibb.co/LLzcPL8/Dead-1.png',
    'https://i.ibb.co/xt6kZQsB/Dead-2.png',
    'https://i.ibb.co/fwbg23H/Jump-1.png',
    'https://i.ibb.co/FkNdHVRj/Jump-2.png',
    'https://i.ibb.co/QFNJ40fc/Jump-3.png',
    'https://i.ibb.co/k2mMn79r/Jump-4.png'
];

export const playerFrames = [];
export let framesLoaded = 0;

runningLinks.forEach((src, index) => {
    const img = new Image();
    img.src = src;
    img.onload = () => { framesLoaded++; };
    playerFrames[index] = img;
});

export const npcImage = new Image();
npcImage.src = 'https://i.ibb.co/xt6kZQsB/Dead-2.png';