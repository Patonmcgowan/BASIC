REM =========
REM GUESS.BAS
REM =========
DIM guess, guess$
PRINT \"Guessing Game\"
PRINT \"-------------\"
PRINT \"Guess randomly generated integer between 0 and 100.\"
PRINT
REPEAT
  DIM num = rnd(101)
  REPEAT
    REPEAT
      PRINT \"Enter integer between 0 and 100 inclusive: \";
      INPUT guess$
      IF guess$ = \"\" THEN
        guess$ = \" \"
      ENDIF
      IF LEFT$(guess$, 1) >= \"0\" AND LEFT$(guess$, 1) <= \"9\" THEN
        guess = TRUNC(VAL(guess$))
      ELSE
        guess = -1
      ENDIF
    UNTIL guess >= 0 AND guess <= 100
    IF guess > num THEN
      PRINT \"Guess too high!\"
    ELSE
      IF guess < num THEN
        PRINT \"Guess too low!\"
      ENDIF
    ENDIF
  UNTIL guess = num
  PRINT \"Correct!\"
  PRINT \"Play again (Y/N)?\";
  INPUT guess$
  IF LEFT$(UCASE$(guess$), 1) = \"N\" THEN
    END
  ENDIF
UNTIL FALSE
