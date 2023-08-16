
export async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export async function unnestErrors(errors) {
    const unnested_errors = []
    for (let i = 0; i < errors.length; i++) {
        for (let j = 0; j < errors[i].length; j++) {
            unnested_errors.push(errors[i][j])
        }
    }
    return unnested_errors
}