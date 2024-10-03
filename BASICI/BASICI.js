/*
   GRAMMAR
   =======

   program := (stmt program | E)

   stmt := (assign | call | cls | cursor | data | dim | else | end | endif | 
            endwhile | for | graphics | if | input | label | locate | next | 
            print | read | rem | repeat | return | until | while)

   assign := var "=" (numexpr | strexpr)

   call := "CALL" id

   cls := "CLS"

   cursor := "CURSOR" ("OFF" | "ON")

   data := "DATA" datalist

   datalist := (["+" | "-"] (fltlit | intlit) | strlit)) ("," datalist | E)

   dim := "DIM" dimlist

   dimlist := var ("=" (numexpr | strexpr) | E) ("," dimlist | E)

   else := "ELSE"

   end := "END"

   endif := "ENDIF"

   endwhile := "ENDWHILE"

   for := "FOR" var "=" numexpr "TO" numexpr ("STEP" numexpr | E)

   graphics := "GRAPHICS" graphicslist

   graphicslist := ("a" intexpr intexpr intexpr numexpr numexpr boolexpr |
                    "bct" intexpr intexpr intexpr intexpr intexpr intexpr |
                    "bp" |
                    "cp" |
                    "cr" intexpr intexpr intexpr intexpr |
                    "f" |
                    "fr" intexpr intexpr intexpr intexpr |
                    "ft" intexpr intexpr |
                    "lt" intexpr intexpr |
                    "mt" intexpr intexpr |
                    "mtx" var |
                    "qct" intexpr intexpr intexpr intexpr |
                    "r" intexpr intexpr intexpr intexpr |
                    "s" |
                    "sf" strexpr |
                    "sfs" intexpr intexpr intexpr |
                    "sfs2" intexpr intexpr intexpr intexpr |
                    "slw" intexpr |
                    "sr" intexpr intexpr intexpr intexpr |
                    "sss" intexpr intexpr intexpr |
                    "sss2" intexpr intexpr intexpr intexpr |
                    "st" intexpr intexpr
                    "u")
 

| "l" intexpr intexpr |
                    "m" intexpr intexpr | "u") (graphicslist | E)

   if := "IF" boolexpr "THEN"

   input := "INPUT" var

   label := id ":"

   locate := "LOCATE" intexpr "," intexpr

   next := "NEXT"

   print := "PRINT" (printlist | E)

   printlist := (numexpr | strexpr) ("," printlist | ";" | E)

   read := "READ" var

   rem := "REM" arbitrary characters

   repeat := "REPEAT"

   return := "RETURN"

   until := "UNTIL" boolexpr
 
   while := "WHILE" boolexpr

   var := id ("[" intexpr "]" ("[" intexpr "]" | E) | E)

   boolexpr := boolterm boolexpr1

   boolexpr1 := ("OR" boolterm boolexpr1 | E)

   boolterm := boolfact boolterm1

   boolterm1 := ("AND" boolfact boolterm1 | E)

   boolfact := ("NOT" | E) ("(" boolexpr ")" | relexpr | "TRUE" | "FALSE" | boolfunc)

   boolfunc := "ISNAN" "(" numexpr ")"

   intexpr := intterm intexpr1

   intexpr1 := ("+" intterm intexpr1 | "-" intterm intexpr1 | E)

   intterm := intfact intterm1

   intterm1 := ("*" intfact intterm1 | "/" intfact intterm1 |
                "%" intfact intterm1 | E)

   intfact := ("-" | "+" | E) ("(" intexpr ")" | var | int | intfunc)

   intfunc := ("ABS" "(" intexpr ")" |
               "ASC" "(" strexpr ")" |
               "CEIL" "(" numexpr ")" |
               "FLOOR" "(" numexpr ")" |
               "INSTR" "(" intexpr "," strexpr "," strexpr ")" |
               "LEN" "(" strexpr ")" |
               "LENGTH" "(" var "," intexpr ")" |
               "RND" "(" intexpr ")" |
               "ROUND" "(" numexpr ")" |
               "SCREEN" "(" intexpr ")" |
               "SGN" "(" intexpr ")" |
               "TRUNC" "(" numexpr ")")

   numexpr := numterm numexpr1

   numexpr1 := ("+" numterm numexpr1 | "-" numterm numexpr1 | E)

   numterm := numfact numterm1

   numterm1 := ("*" numfact numterm1 | "/" numfact numterm1 |
                "%" numfact numterm1 | E)

   numfact := ("-" | "+" | E) ("(" numexpr ")" | var | num | numfunc)

   numfunc := ("ABS" "(" numexpr ")" |
               "ACOS" "(" numexpr ")" |
               "ASC" "(" strexpr ")" |
               "ASIN" "(" numexpr ")" |
               "ATAN" "(" numexpr ")" |
               "CEIL" "(" numexpr ")" |
               "COS" "(" numexpr ")" | 
               "EXP" "(" numexpr ")" | 
               "FLOOR" "(" numexpr ")" |
               "INSTR" "(" intexpr "," strexpr "," strexpr ")" |
               "LEN" "(" strexpr ")" |
               "LENGTH" "(" var "," intexpr ")" |
               "LOG" "(" numexpr ")" | 
               "PI" | 
               "POW" "(" numexpr "," numexpr ")" | 
               "RANDOM" "(" numexpr ")" |
               "RND" "(" intexpr ")" |
               "ROUND" "(" numexpr ")" |
               "SCREEN" "(" intexpr ")" |
               "SGN" "(" numexpr ")" |
               "SIN" "(" numexpr ")" | 
               "SQRT" "(" numexpr ")" | 
               "TAN" "(" numexpr ")" |
               "TODEGREES" "(" numexpr ")" |
               "TORADIANS" "(" numexpr ")" |
               "TRUNC" "(" numexpr ")" |
               "VAL" "(" strexpr ")")

   relexpr := (numexpr | strexpr) ("=" | "<>" | "<" | "<=" | ">" | ">=") (numexpr | strexpr)

   strexpr := strfact strexpr1

   strexpr1 := ("+" strfact | E)

   strfact := var | strlit | strfunc

   strfunc := ("BROWSER$" "(" intexpr ")" |
               "CHR$" "(" intexpr ")" |
               "DATETIME$" "(" intexpr ")" |
               "HEX$" "(" intexpr ")" |
               "INKEY$" |
               "LCASE$", "(", strexpr, ")" |
               "LEFT$" "(" strexpr "," intexpr ")" |
               "MID$" "(" strexpr "," intexpr "," intexpr ")" |
               "RIGHT$" "(" strexpr "," intexpr ")" | 
               "STR$" "(" numexpr ")" |
               "STRING$" "(" intexpr "," strexpr ")" |
               "TRIM$" "(" strexpr ")" |
               "UCASE$ "(" strexpr ")")
*/

var BASICI = 
{
   // =========================================================================
   // Add line to program.
   //
   // Parameters:
   //
   // num -  integer-based line number of line
   //
   // text - BASIC statement to store on this line
   //
   // Return value:
   //
   // none
   // =========================================================================

   addLine: function(num, text)
            {
               var line = { num: num, text: text, next: null };
               if (BASICI.program == null)
               {
                  BASICI.program = line;
                  return;
               }
               var prevLine = null;
               var curLine = BASICI.program;
               while (curLine != null)
               {
                  if (curLine.num > num)
                  {
                     line.next = curLine;
                     if (prevLine == null)
                        BASICI.program = line;
                     else
                        prevLine.next = line;
                     return;
                  }
                  prevLine = curLine;
                  curLine = curLine.next;
               }
               prevLine.next = line;
            },

   // =========================================================================
   // Find program line.
   //
   // Parameters:
   //
   // num - integer-based line number of line
   //
   // Return value:
   //
   // reference to line object, or null when line not present
   // =========================================================================

   findLine: function(num)
             {
                var curLine = BASICI.program;
                while (curLine != null)
                   if (curLine.num == num)
                      return curLine;
                   else
                      curLine = curLine.next;
                return null;
             },

   // =========================================================================
   // Get program listing.
   //
   // Parameters:
   //
   // none
   //
   // Return value:
   //
   // string containing entire program listing
   // =========================================================================

   getListing: function()
               {
                  var s = "";
                  var curLine = BASICI.program;
                  while (curLine != null)
                  {
                     s += curLine.text + "\n";            
                     curLine = curLine.next;
                  }
                  return s;
               },

   // =========================================================================
   // Initialize interpreter.
   //
   // Parameters:
   //
   // none
   //
   // Return value:
   //
   // none
   // =========================================================================

   init: function()
         {
            BASICI.callStack = new Array();
            BASICI.forStack = new Array();
            BASICI.ifStack = new Array();
            BASICI.repeatStack = new Array();
            BASICI.whileStack = new Array();
            BASICI.new();
         },

   // =========================================================================
   // List the contents of the BASIC program.
   //
   // Parameters:
   //
   // begnum - beginning line number (-1 for first line)
   //
   // endnum - ending line number (-1 for last line)
   //
   // If begnum <> -1 and endnum <> -1, begnum must be less than or equal to 
   // endnum.
   //
   // Return value:
   //
   // none
   // 
   // 8 Feb 2020 - formatted line numbers to be five characters wide MDS
   // =========================================================================

   list: function(begnum, endnum)
         {
            var padLine;

            if (begnum != -1 && endnum != -1 && begnum > endnum)
               return;

            var curLine = BASICI.program;
            while (curLine != null)
            {
               if (curLine.num >= begnum && 
                   ((endnum != -1) ? curLine.num <= endnum : true)) {
                  Console.echo(curLine.num.toString().padStart(8,' ') + " " + curLine.text + "\n");
               }
               curLine = curLine.next;
            }
         },

   // =========================================================================
   // Erase existing BASIC program.
   //
   // Parameters:
   //
   // none
   //
   // Return value:
   //
   // none
   // =========================================================================

   new: function()
        {
           BASICI.input = false;
           BASICI.newRun = true;
           BASICI.program = null;
           BASICI.lastLine = null;
        },

   // =========================================================================
   // Remove line from program.
   //
   // Parameters:
   //
   // num - integer-based line number of line
   //
   // Return value:
   //
   // none
   // =========================================================================

   removeLine: function(num)
               {
                  var curLine = BASICI.program;
                  var prevLine = null;
                  while (curLine != null)
                  {
                     if (curLine.num == num)
                     {
                        if (prevLine == null)
                           BASICI.program = BASICI.program.next;
                        else
                           prevLine.next = curLine.next;
                        return;
                     }
                     prevLine = curLine;
                     curLine = curLine.next;
                  }
               },

   // =========================================================================
   // Renumber BASIC program, with starting line at 10 and successive lines at
   // successive multiples of 10.
   //
   // Parameters:
   //
   // none
   //
   // Return value:
   //
   // none
   // =========================================================================

   renum: function()
          {
             var tempLine = BASICI.program;
             var num = 10;
             while (tempLine != null)
             {
                tempLine.num = num;
                num += 10;
                tempLine = tempLine.next;
             }
          },

   // =========================================================================
   // Run the BASIC program.
   //
   // Parameters:
   //
   // none
   //
   // Return value:
   //
   // true when run still in progress; false when run finished
   // =========================================================================

   run: function()
        {
           if (BASICI.newRun)
           {
              BASICI.curLine = BASICI.program;
              BASICI.dataPtr = { line: null, numTokensToSkip: 0 };
              BASICI.vars = {};
              BASICI.autoAdvanceLine = true;
              BASICI.callStack.length = 0;
              BASICI.forStack.length = 0;
              BASICI.ifStack.length = 0;
              BASICI.repeatStack.length = 0;
              BASICI.whileStack.length = 0;
              BASICI.newRun = false;
           }
           if (BASICI.input)
           {
              try
              {
                 BASICI.store(BASICI.inputVar, Console.getLine());
                 if (BASICI.fetch(BASICI.inputVar) != null)
                    BASICI.input = false;
              }
              catch (err)
              {
                 Console.echo(err);
                 return false;
              }
              return true;
           }
           if (BASICI.curLine != null)
           {
              if (!Console.isEsc())
              {
                 try
                 {
                    Scanner.init(BASICI.curLine.text);
                    Scanner.scan();
                    var type = Scanner.Token.type;
                    BASICI.parseStmt();
                    if (type != Scanner.Token.END)
                    {
                       if (BASICI.autoAdvanceLine)
                          BASICI.curLine = BASICI.curLine.next;
                       else
                          BASICI.autoAdvanceLine = true;
                       return true;
                    }
                 }
                 catch (err)
                 {
                    Console.echo(err);
                 }
              }
           }
           BASICI.newRun = true;
           return false;
        }

   // =========================================================================
   // WARNING: The rest of the function properties in this namespace should be
   // considered private and may change in a future version of this library. If
   // your code depends upon them, it will break. Also, properties added to 
   // BASICI in init() (e.g., program and vars) should be considered private 
   // and may change in a future version. Don't access them!
   // =========================================================================
   // 
   //  The private functions have been moved to BASICI.Private1.js and         
   //  BASICI.Private2.js.  9 Feb 2020 MDS
   // 

}

//
//                                End of file
//
