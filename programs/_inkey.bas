REM =========
REM INKEY.BAS
REM =========
while inkey$ <> \"\"
endwhile
dim x$
PRINT \"Press a character key (e.g., A)\"
repeat
  x$ = inkey$
until x$ <> \"\"
print x$
