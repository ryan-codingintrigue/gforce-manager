export default (tuning: string) => {
    const split = tuning.split(" ");
    if(split.length === 6) return split;
    throw Error("Not a valid tuning format");
};