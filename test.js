const F = require('./calc.js'), assert = require('assert');
const post = { 'A+B*C-D/E': 'ABC*+DE/-', '(A+B)*(C-D)': 'AB+CD-*', 'A^B^C': 'ABC^^', 'A-B-C': 'AB-C-', 'A+(B*C-(D/E^F)*G)*H': 'ABC*DEF^/G*-H*+', 'a * b + c': 'ab*c+' };
for (const [i, p] of Object.entries(post)) assert.strictEqual(F.toPostfix(i).postfix, p, i);
const pre = { 'A+B*C': '+A*BC', '(A+B)*(C-D)': '*+AB-CD', 'A^B^C': '^A^BC', 'A-B-C': '--ABC', 'A/B*C': '*/ABC', '(A-B/C)*(A/K-L)': '*-A/BC-/AKL' };
for (const [i, p] of Object.entries(pre)) assert.strictEqual(F.toPrefix(i).prefix, p, i);
assert.strictEqual(F.evalPostfix('5 6 2 + * 12 4 / -').value, 37);
assert.strictEqual(F.evalPostfix('231*+9-').value, -4);
assert.strictEqual(F.evalPostfix('2 3 2 ^ ^').value, 512); // 2^(3^2)
assert.throws(() => F.evalPostfix('2 +'));
assert.throws(() => F.toPostfix('(A+B'));
assert.throws(() => F.toPostfix('A+*B'));
assert.strictEqual(F.toPostfix('A+B*C').rows.length, 6); // 5 symbols + end row
console.log('All checks passed');
