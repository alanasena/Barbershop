
 export const time = () => {
    const date = new Date()
    const realTime = {}
    realTime.day = date.getDay()
    realTime.hours = date.getHours()
    realTime.min = date.getMinutes()
    return realTime
}

export const getSundays = () =>{
    let today = new Date();
    let nextSunday = new Date();

    let sunday = new Date(today.getTime() - today.getDay() * 24 * 3600 * 1000);
    nextSunday.setDate(sunday.getDate() + 7);
    let obj = {}
    obj.sunday = sunday.getTime()
    obj.nextSunday = nextSunday.getTime()

    return obj
}

export const makeDate = (ms) =>{
    let date = new Date(ms)
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
}

export const fullTime = (num) => {
    let obj = {}
    
    switch(num){
        case 0:
            obj.day = 'Dom'
            obj.workTime = '10:00 as 15:00'
            break

        case 1:
            obj.day = 'Seg'
            obj.workTime = '10:00 as 15:30'
            break

        case 2:
            obj.day = 'Ter'
            obj.workTime = '10:00 as 14:30'
            break

        case 3:
            obj.day = 'Qua'
            obj.workTime = '10:00 as 14:30'
            break

        case 4:
            obj.day = 'Qui'
            obj.workTime = '10:00 as 15:00'
            break

        case 5:
            obj.day = 'Sex'
            obj.workTime = '10:00 as 15:30'
            break

        case 6:
            obj.day = 'Fim de semana'
            obj.workTime = 'Bom fim de semana!'
            break

        default:
            obj.day = 'Indefinido'
            obj.workTime = '00:00 as 00:00'
            break

    }
    return obj 
}

