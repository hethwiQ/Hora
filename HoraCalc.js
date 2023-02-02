function bigONotation(callback) {
  let startTime = performance.now();
  callback();
  let endTime = performance.now();
  return endTime - startTime;
}

function sampleAlgorithm(n) {
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += i;
  }
  return sum;
}

let timeTaken = bigONotation(() => sampleAlgorithm(1000));
console.log(`Time taken: ${timeTaken} milliseconds`);
