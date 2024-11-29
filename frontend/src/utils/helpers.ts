export const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    const formattedTime = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
    return formattedTime
}
export const getUser = () => {
    return JSON.parse(localStorage.getItem("currentUser")!);
}