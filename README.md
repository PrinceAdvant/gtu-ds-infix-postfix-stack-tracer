# GTU Data Structures 3130702 infix to postfix and prefix converter with stack trace table, plus postfix evaluation

Infix to postfix is a classic DS stack question, and the marks are in the table: symbol, stack, output, row by row. Expression daalo, the page prints that exact table, the postfix and prefix forms, and evaluates a numeric postfix expression step by step. Practice expressions are my own.

Live page: https://princeadvant.github.io/gtu-ds-infix-postfix-stack-tracer/

## Facts used

- Operands go straight to the output. '(' is pushed. ')' pops to the output until the matching '('.
- For an operator, pop while the top has higher precedence, or equal precedence and the operator is left associative. Then push it.
- Precedence: ^ (highest, right associative), then * / %, then + - (left associative).
- Prefix by the reverse method: reverse the infix, swap ( and ), convert to postfix (popping on equal precedence only for ^), then reverse the result.
- Postfix evaluation: push numbers. On an operator pop b, then a, push a op b. The order matters for - and /.
- Default example: A+(B*C-(D/E^F)*G)*H becomes ABC*DEF^/G*-H*+.

## Test

`node test.js` checks 6 postfix and 6 prefix conversions, including right associative ^, three postfix evaluations, and error cases, and prints `All checks passed`.

## Tips

- Keep three columns (Symbol, Stack, Postfix) and fill one row per symbol. That table is what gets the marks.
- A^B^C is ABC^^ in postfix, not AB^C^. ^ is right associative.
- In postfix evaluation, the first value popped is the right operand: 8 2 - is 8 - 2 = 6.
- Check your answer: the number of operators in postfix must be one less than the number of operands.

## Practice with the real paper

GTU Hero has the Winter 2025 Data Structures (3130702) paper page: 70 marks, 25 questions extracted, with links to the Winter 2024 and Winter 2023 papers and the new scheme code BE03000081. Open it here: [gtuhero.com](https://gtuhero.com/gtu-papers/gujarat-technological-university-3130702-data-structures-winter-2025) (GTU Hero is my project).

## Licence

MIT
