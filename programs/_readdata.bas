REM ============
REM READDATA.BAS
REM ============
CURSOR OFF
DATA \"The\", \"quick\", \"brown\", \"fox\",
DATA \"jumped\", \"over\", \"the\", \"lazy\",
DATA \"dog.\", \"\"
DIM word$
REPEAT
READ word$
IF word$ <> \"\" THEN
PRINT word$
ENDIF
UNTIL word$ = \"\"
CURSOR ON
