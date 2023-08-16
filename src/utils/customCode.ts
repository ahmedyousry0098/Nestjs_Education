
export function generateCustomCode(length:number = 4) {
    const generalChar = "abcdefghijklmnopqrstuvwxyz123456789"
    let randomChar: string = "";
    for (let i=0; i<length; i++) {
        randomChar += generalChar[Math.floor(Math.random()*generalChar.length)]
    }
    return randomChar
}