
export async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// may need sorting
export async function unnestErrors(errors) {
    let unnested_errors = []
    for (let i = 0; i < errors.length; i++) {
        for (let j = 0; j < errors[i].length; j++) {
            unnested_errors.push(errors[i][j].concat([i]))
        }
    }
    return unnested_errors
}

// function sortErrors(errors) {
//     const sortedList = errors.sort((a, b) => {
//         if (Array.isArray(a)) {
//           const aNum3 = a[1];
//           const aNum1 = a[0];
//           a = aNum3 + aNum1 / 10000;
//         }
      
//         if (Array.isArray(b)) {
//           const bNum3 = b[1];
//           const bNum1 = b[0];
//           b = bNum3 + bNum1 / 10000;
//         }
      
//         return a - b;
//       });
//     return sortedList 
// }