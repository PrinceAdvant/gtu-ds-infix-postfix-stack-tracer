// GTU Data Structures: infix to postfix / prefix with a stack trace table, and postfix evaluation. MIT licence.
const F = {
  PREC: { '+': 1, '-': 1, '*': 2, '/': 2, '%': 2, '^': 3, '$': 3 },
  RIGHT: new Set(['^', '$']),
  tokens(s) {
    const t = s.match(/[A-Za-z_][A-Za-z0-9_]*|\d+(?:\.\d+)?|[-+*/%^$()]|\S/g) || [];
    const bad = t.find(x => !/^[A-Za-z0-9_.]+$/.test(x) && !'+-*/%^$()'.includes(x));
    if (bad) throw new Error('unknown symbol ' + bad);
    return t;
  },
  isOperand: x => /^[A-Za-z0-9_.]+$/.test(x),
  // rightAssocMode: 'normal' for postfix; 'reversed' when used on the reversed infix (prefix method)
  toPostfixTokens(tokens, reversed) {
    const stack = [], out = [], rows = [];
    const popWhile = op => {
      while (stack.length && stack[stack.length - 1] !== '(') {
        const top = stack[stack.length - 1], pt = F.PREC[top], po = F.PREC[op];
        const rightAssoc = F.RIGHT.has(op);
        // normal: pop if higher, or equal and left associative
        // reversed string: associativity flips, so pop equal only for the right associative operator
        const popEqual = reversed ? rightAssoc : !rightAssoc;
        if (pt > po || (pt === po && popEqual)) out.push(stack.pop()); else break;
      }
    };
    let expectOperand = true;
    for (const t of tokens) {
      if (F.isOperand(t)) { if (!expectOperand) throw new Error('two operands in a row near ' + t); out.push(t); expectOperand = false; }
      else if (t === '(') { if (!expectOperand) throw new Error('missing operator before ('); stack.push(t); }
      else if (t === ')') {
        if (expectOperand) throw new Error('empty brackets or operator before )');
        while (stack.length && stack[stack.length - 1] !== '(') out.push(stack.pop());
        if (!stack.length) throw new Error('unmatched )');
        stack.pop();
      } else {
        if (expectOperand) throw new Error('operator ' + t + ' has no left operand (unary minus is not supported)');
        popWhile(t); stack.push(t); expectOperand = true;
      }
      rows.push({ symbol: t, stack: stack.join(''), output: out.join(' ') });
    }
    if (expectOperand && tokens.length) throw new Error('expression ends with an operator');
    while (stack.length) { const x = stack.pop(); if (x === '(') throw new Error('unmatched ('); out.push(x); }
    rows.push({ symbol: '(end)', stack: '', output: out.join(' ') });
    return { out, rows };
  },
  toPostfix(s) { const r = F.toPostfixTokens(F.tokens(s), false); return { postfix: F.join(r.out), rows: r.rows }; },
  toPrefix(s) {
    const rev = F.tokens(s).reverse().map(t => t === '(' ? ')' : t === ')' ? '(' : t);
    const r = F.toPostfixTokens(rev, true);
    return { prefix: F.join(r.out.slice().reverse()), reversedInput: F.join(rev), rows: r.rows };
  },
  join(tokens) { return tokens.every(t => t.length === 1) ? tokens.join('') : tokens.join(' '); },
  evalPostfix(s) {
    const t = /\s/.test(s.trim()) ? s.trim().split(/\s+/) : s.trim().split('');
    const st = [], rows = [];
    for (const x of t) {
      if (/^\d+(\.\d+)?$/.test(x)) st.push(Number(x));
      else if (x in F.PREC) {
        if (st.length < 2) throw new Error('not enough operands for ' + x);
        const b = st.pop(), a = st.pop(); let v;
        switch (x) {
          case '+': v = a + b; break; case '-': v = a - b; break; case '*': v = a * b; break;
          case '/': if (b === 0) throw new Error('division by zero'); v = a / b; break;
          case '%': v = a % b; break; default: v = a ** b;
        }
        st.push(v); rows.push({ symbol: x, op: a + ' ' + x + ' ' + b + ' = ' + v, stack: st.join(', ') }); continue;
      } else throw new Error('postfix evaluation needs numbers, got ' + x);
      rows.push({ symbol: x, op: 'push', stack: st.join(', ') });
    }
    if (st.length !== 1) throw new Error('invalid postfix: ' + st.length + ' values left on the stack');
    return { value: st[0], rows };
  }
};
if (typeof module !== 'undefined') module.exports = F;
