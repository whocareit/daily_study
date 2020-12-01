function getRandomColor():string {
    const colorArray: string[] = [
        'magenta',
        'red',
        'volcano',
        'orange',
        'gold',
        'lime',
        'green',
        'cyan',
        'blue',
        'geekblue',
        'purple',
    ]
    return colorArray[Math.floor(Math.random()*colorArray.length)]
}
