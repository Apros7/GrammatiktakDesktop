
export async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function unnestErrors(errors) {
    let unnested_errors = []
    for (let i = 0; i < errors.length; i++) {
        for (let j = 0; j < errors[i].length; j++) {
            unnested_errors.push(errors[i][j].concat([i]))
        }
    }
    return unnested_errors
}

export function create_id_from_raw_error(error) {
    return error[2][0] + error[0] + error[2][1]
}