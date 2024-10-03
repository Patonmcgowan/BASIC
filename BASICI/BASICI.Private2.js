/*
  BASICI.Private2.js

  ------------------------------------------------------------------------------
  Revision History
  ~~~~~~~~~~~~~~~~
  
  08 Feb 2019 MDS - Moved out of BASICI.js
                  - Added line number padding to BASICI.list() so
                    line numbers are right justified (and indentation in source 
                    files is preserved).  Modified BASICI.parseIf() and 
                    BASICI.parseElse() functions to suit.
                  - Split private functions out of BASICI.js into 
                    BASICI.Private.js to reduce file size.
  ------------------------------------------------------------------------------
 */

var BASICIPrivate2 = 
{

   // The following function is private and should not be called.

   parseIntTerm: function()
                 {
                    var fact = BASICI.parseIntFact();
                    return BASICI.parseIntTerm1(fact);
                 },

   // The following function is private and should not be called.

   parseIntTerm1: function(fact)
                  {
                     while (Scanner.Token.type == Scanner.Token.STAR ||
                            Scanner.Token.type == Scanner.Token.SLASH ||
                            Scanner.Token.type == Scanner.Token.PERCENT)
                        switch (Scanner.Token.type)
                        {
                           case Scanner.Token.STAR:
                                Scanner.scan();
                                fact = fact * BASICI.parseIntFact();
                                fact = BASICI.parseIntTerm1(fact);
                                break;

                           case Scanner.Token.SLASH:
                                Scanner.scan();
                                fact = (fact / BASICI.parseIntFact()) | 0;
                                fact = BASICI.parseIntTerm1(fact);
                                break;

                           case Scanner.Token.PERCENT:
                                Scanner.scan();
                                fact = (fact % BASICI.parseIntFact()) | 0;
                                fact = BASICI.parseIntTerm1(fact);
                        }
                     return fact;
                  },

   // The following function is private and should not be called.

   parseLabel: function()
               {
                  Scanner.scan();
                  if ((Scanner.Token.type != Scanner.Token.EOLN) && 
                      (Scanner.Token.type != Scanner.Token.REM))
                     BASICI.throwError("extraneous text");
               },

   // The following function is private and should not be called.

   parseLocate: function()
                {
                   Scanner.scan();
                   var row = BASICI.parseIntExpr();
                   if (row < 1 || row > Console.getNumRows())
                      BASICI.throwError("row invalid");
                   if (Scanner.Token.type != Scanner.Token.COMMA)
                      BASICI.throwError("',' expected");
                   Scanner.scan();
                   var col = BASICI.parseIntExpr();
                   if (col < 1 || col > Console.getNumCols())
                      BASICI.throwError("column invalid");
                   if ((Scanner.Token.type != Scanner.Token.EOLN) && 
                       (Scanner.Token.type != Scanner.Token.REM))
                      BASICI.throwError("extraneous text");
                   Console.setCursorPos(row - 1, col - 1);
                },

   // The following function is private and should not be called.

   parseNext: function()
              {
                 Scanner.scan();
                 if ((Scanner.Token.type != Scanner.Token.EOLN) && 
                     (Scanner.Token.type != Scanner.Token.REM))
                    BASICI.throwError("extraneous text");
                 if (BASICI.forStack.length == 0)
                    BASICI.throwError("NEXT without FOR");
                 var forInfo = BASICI.forStack.pop();
                 Scanner.init(forInfo.retLine.text);
                 Scanner.scan(); // Token is now FOR. 
                 Scanner.scan(); // Token is now ID. 
                 Scanner.scan(); // Token is now EQ.
                 Scanner.scan(); // Now first token of expr.
                 BASICI.parseNumExpr();
                 Scanner.scan(); // Scan past TO token.
                 var endValue = BASICI.parseNumExpr();
                 var stepValue = 1;
                 if (Scanner.Token.type == Scanner.Token.STEP)
                 {
                    Scanner.scan();
                    stepValue = BASICI.parseNumExpr();
                 }
                 Scanner.init(BASICI.curLine.text);
                 Scanner.scan(); // Scan NEXT token.
                 Scanner.scan();
                 var id = forInfo.varName;
                 BASICI.vars[id] += stepValue;
                 if ((stepValue >= 0 && BASICI.vars[id] <= endValue) ||
                     (stepValue < 0 && BASICI.vars[id] >= endValue))
                 {
                    BASICI.forStack.push({ varName: id, 
                                           retLine: forInfo.retLine });
                    BASICI.curLine = forInfo.retLine;
                 }
              },

   // The following function is private and should not be called.

   parseNumExpr: function()
                 {
                    var term = BASICI.parseNumTerm();
                    return BASICI.parseNumExpr1(term);
                 },

   // The following function is private and should not be called.

   parseNumExpr1: function(term)
                  {
                     while (Scanner.Token.type == Scanner.Token.PLUS ||
                            Scanner.Token.type == Scanner.Token.MINUS)
                        switch (Scanner.Token.type)
                        {
                           case Scanner.Token.PLUS:
                                Scanner.scan();
                                term = term + BASICI.parseNumTerm();
                                term = BASICI.parseNumExpr1(term);
                                break;

                           case Scanner.Token.MINUS:
                                Scanner.scan();
                                term = term - BASICI.parseNumTerm();
                                term = BASICI.parseNumExpr1(term);
                        }
                     return term;
                  },

   // The following function is private and should not be called.

   parseNumFact: function()
                 {
                    var sign = 1;
                    switch (Scanner.Token.type)
                    {
                       case Scanner.Token.MINUS:
                            sign = -1;
                       case Scanner.Token.PLUS:
                            Scanner.scan();
                    }
                    switch (Scanner.Token.type)
                    {
                       case Scanner.Token.ABS:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            var fact = BASICI.parseNumExpr();
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            return Math.abs(fact) * sign;

                       case Scanner.Token.ACOS:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            var fact = BASICI.parseNumExpr();
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            return Math.acos(fact) * sign;

                       case Scanner.Token.ASC:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            var fact = BASICI.parseStrExpr();
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            return fact.charCodeAt(0);

                       case Scanner.Token.ASIN:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            var fact = BASICI.parseNumExpr();
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            return Math.asin(fact) * sign;

                       case Scanner.Token.ATAN:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            var fact = BASICI.parseNumExpr();
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            return Math.atan(fact) * sign;

                       case Scanner.Token.CEIL:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            var fact = BASICI.parseNumExpr();
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            return Math.ceil(fact) * sign;

                       case Scanner.Token.COS:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            var fact = BASICI.parseNumExpr();
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            return Math.cos(fact) * sign;

                       case Scanner.Token.EXP:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            var fact = BASICI.parseNumExpr();
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            return Math.exp(fact) * sign;

                       case Scanner.Token.FLOOR:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            var fact = BASICI.parseNumExpr();
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            return Math.floor(fact) * sign;

                       case Scanner.Token.FLTLIT:
                            var fact = parseFloat(Scanner.Token.lexeme);
                            Scanner.scan();
                            return fact * sign;

                       case Scanner.Token.ID:
                            var var_ = BASICI.parseVar();
                            if (BASICI.vars[var_.name] == undefined)
                               BASICI.throwError("undefined var " + var_.name);
                            var res = BASICI.fetch(var_);
                            if (typeof res != "number")
                               BASICI.throwError("numeric scalar expected");
                            return res * sign;

                       case Scanner.Token.INSTR:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            var fact1 = BASICI.parseIntExpr();
                            if (Scanner.Token.type != Scanner.Token.COMMA)
                               BASICI.throwError("',' expected");
                            Scanner.scan();
                            var fact2 = BASICI.parseStrExpr();
                            if (Scanner.Token.type != Scanner.Token.COMMA)
                               BASICI.throwError("',' expected");
                            Scanner.scan();
                            var fact3 = BASICI.parseStrExpr();
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            if (fact1 >= 0)
                               return fact2.indexOf(fact3) * sign;
                            else 
                               return fact2.lastIndexOf(fact3) * sign;

                       case Scanner.Token.INTLIT:
                            if (!BASICI.isValidInt(sign, Scanner.Token.lexeme))
                               BASICI.throwError("integer too large");
                            var fact = parseInt(Scanner.Token.lexeme);
                            Scanner.scan();
                            return fact * sign;

                       case Scanner.Token.LEN:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            var fact = BASICI.parseStrExpr();
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            return fact.length;

                       case Scanner.Token.LENGTH:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.ID)
                               BASICI.throwError("identifier expected");
                            var name = Scanner.Token.lexeme;
                            if (typeof BASICI.vars[name] != "object")
                               BASICI.throwError("array expected");
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.COMMA)
                               BASICI.throwError("',' expected");
                            Scanner.scan();
                            var fact = BASICI.parseIntExpr();
                            if (fact < 1 || fact > 2)
                               BASICI.throwError("dimension < 1 or > 2");
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            if (fact == 1)
                               return BASICI.vars[name].length;
                            if (typeof BASICI.vars[name][0] != "object")
                               BASICI.throwError("array is not 2D");
                            return BASICI.vars[name][0].length;

                       case Scanner.Token.LOG:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            var fact = BASICI.parseNumExpr();
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            return Math.log(fact) * sign;

                       case Scanner.Token.PI:
                            Scanner.scan();
                            return Math.PI * sign;

                       case Scanner.Token.LPAREN:
                            Scanner.scan();
                            var fact = BASICI.parseNumExpr();
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            return fact * sign;

                       case Scanner.Token.POW:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            var fact1 = BASICI.parseNumExpr();
                            if (Scanner.Token.type != Scanner.Token.COMMA)
                               BASICI.throwError("',' expected");
                            Scanner.scan();
                            var fact2 = BASICI.parseNumExpr();
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            return Math.pow(fact1, fact2) * sign;

                       case Scanner.Token.RANDOM:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            return Math.random() * sign;

                       case Scanner.Token.RND:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            var fact = BASICI.parseIntExpr();
                            if (fact < 0)
                               BASICI.throwError("integer factor < 0");
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            return (Math.random() * fact) | 0;

                       case Scanner.Token.ROUND:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            var fact = BASICI.parseNumExpr();
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            return Math.round(fact) * sign;

                       case Scanner.Token.SCREEN:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            var fact = BASICI.parseIntExpr();
                            if (fact < 0)
                               BASICI.throwError("integer factor < 0");
                            if (fact > 3)
                               BASICI.throwError("integer factor > 3");
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            switch (fact)
                            {
                               case 0: return Console.getNumCols();
                               case 1: return Console.getNumRows();
                               case 2: return Console.getWidth();
                               case 3: return Console.getHeight();
                            }                             

                       case Scanner.Token.SGN:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            var fact = BASICI.parseNumExpr();
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            if (fact == 0)
                               return 0;
                            else 
                            if (fact > 0)
                               return sign;
                            else
                               return -sign;

                       case Scanner.Token.SIN:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            var fact = BASICI.parseNumExpr();
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            return Math.sin(fact) * sign;

                       case Scanner.Token.SQRT:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            var fact = BASICI.parseNumExpr();
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            return Math.sqrt(fact) * sign;

                       case Scanner.Token.TAN:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            var fact = BASICI.parseNumExpr();
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            return Math.tan(fact) * sign;

                       case Scanner.Token.TODEGREES:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            var fact = BASICI.parseNumExpr();
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            return fact * sign * 180 / Math.PI;

                       case Scanner.Token.TORADIANS:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            var fact = BASICI.parseNumExpr();
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            return fact * sign * Math.PI / 180;

                       case Scanner.Token.TRUNC:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            var fact = BASICI.parseNumExpr();
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            return (fact | 0) * sign;

                       case Scanner.Token.VAL:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            var fact = BASICI.parseStrExpr();
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            var result = parseFloat(fact);
                            if (isNaN(result))
                               BASICI.throwError("number expected");
                            return result;

                       default: BASICI.throwError("bad syntax");
                    }
                 },

   // The following function is private and should not be called.

   parseNumTerm: function()
                 {
                    var fact = BASICI.parseNumFact();
                    return BASICI.parseNumTerm1(fact);
                 },

   // The following function is private and should not be called.

   parseNumTerm1: function(fact)
                  {
                     while (Scanner.Token.type == Scanner.Token.STAR ||
                            Scanner.Token.type == Scanner.Token.SLASH ||
                            Scanner.Token.type == Scanner.Token.PERCENT)
                        switch (Scanner.Token.type)
                        {
                           case Scanner.Token.STAR:
                                Scanner.scan();
                                fact = fact * BASICI.parseNumFact();
                                fact = BASICI.parseNumTerm1(fact);
                                break;

                           case Scanner.Token.SLASH:
                                Scanner.scan();
                                fact = fact / BASICI.parseNumFact();
                                fact = BASICI.parseNumTerm1(fact);
                                break;

                           case Scanner.Token.PERCENT:
                                Scanner.scan();
                                fact = fact % BASICI.parseNumFact();
                                fact = BASICI.parseNumTerm1(fact);
                        }
                     return fact;
                  },

   // The following function is private and should not be called.

   parsePrint: function()
               {
                  Scanner.scan();
                  if (Scanner.Token.type != Scanner.Token.EOLN)
                     BASICI.parsePrintList();
                  else
                     Console.echo("\n");
               },

   // The following function is private and should not be called.

   parsePrintList: function()
                   {
                      while (true)
                      {
                         switch (Scanner.Token.type)
                         {
                            case Scanner.Token.ID:
                                 var result;
                                 var name = Scanner.Token.lexeme;
                                 if (name.charAt(name.length - 1) != "$")
                                 {
                                    result = BASICI.parseNumExpr();
                                    if (result >= 0)
                                       Console.echo(" ");
                                    Console.echo(result + " ");
                                 }
                                 else
                                 {
                                    result = BASICI.parseStrExpr();
                                    Console.echo(result);
                                 }
                                 break;

                            case Scanner.Token.ABS:
                            case Scanner.Token.ACOS:
                            case Scanner.Token.ASC:
                            case Scanner.Token.ASIN:
                            case Scanner.Token.ATAN:
                            case Scanner.Token.CEIL:
                            case Scanner.Token.COS:
                            case Scanner.Token.EXP:
                            case Scanner.Token.FLOOR:
                            case Scanner.Token.FLTLIT:
                            case Scanner.Token.INSTR:
                            case Scanner.Token.INTLIT:
                            case Scanner.Token.LEN:
                            case Scanner.Token.LENGTH:
                            case Scanner.Token.LOG:
                            case Scanner.Token.LPAREN:
                            case Scanner.Token.MINUS:
                            case Scanner.Token.PI:
                            case Scanner.Token.PLUS:
                            case Scanner.Token.POW:
                            case Scanner.Token.RANDOM:
                            case Scanner.Token.RND:
                            case Scanner.Token.ROUND:
                            case Scanner.Token.SCREEN:
                            case Scanner.Token.SGN:
                            case Scanner.Token.SIN:
                            case Scanner.Token.SQRT:
                            case Scanner.Token.TAN:
                            case Scanner.Token.TODEGREES:
                            case Scanner.Token.TORADIANS:
                            case Scanner.Token.TRUNC:
                            case Scanner.Token.VAL:
                                 var result = BASICI.parseNumExpr();
                                 if (result >= 0)
                                    Console.echo(" ");
                                 Console.echo(result + " ");
                                 break;
  
                            case Scanner.Token.BROWSER:
                            case Scanner.Token.CHR:
                            case Scanner.Token.DATETIME:
                            case Scanner.Token.HEX:
                            case Scanner.Token.INKEY:
                            case Scanner.Token.LCASE:
                            case Scanner.Token.LEFT:
                            case Scanner.Token.MID:
                            case Scanner.Token.RIGHT:
                            case Scanner.Token.STR:
                            case Scanner.Token.STRING:
                            case Scanner.Token.STRLIT:
                            case Scanner.Token.TRIM:
                            case Scanner.Token.UCASE:
                                 var result = BASICI.parseStrExpr();
                                 Console.echo(result);
                                 break;

                            default:
                                 BASICI.throwError("\nbad syntax");
                         }
                         if (Scanner.Token.type == Scanner.Token.COMMA)
                            Scanner.scan();
                         else
                            break;
                      }
                      if (Scanner.Token.type == Scanner.Token.SEMICOLON)
                      {
                         Scanner.scan();
                         if ((Scanner.Token.type != Scanner.Token.EOLN) && 
                             (Scanner.Token.type != Scanner.Token.REM))
                            BASICI.throwError("\nextraneous text");
                      }
                      else
                        if ((Scanner.Token.type != Scanner.Token.EOLN) && 
                          (Scanner.Token.type != Scanner.Token.REM))
                          Console.echo("\n");
                      else
                         BASICI.throwError("\nextraneous text");
                   },

   // The following function is private and should not be called.

   parseRead: function()
              {
                 Scanner.scan();
                 if (Scanner.Token.type != Scanner.Token.ID)
                    BASICI.throwError("identifier expected");
                 var var_ = BASICI.parseVar();
                 if (BASICI.vars[var_.name] == undefined)
                    BASICI.throwError("undefined var " + var_.name);
                 if ((Scanner.Token.type != Scanner.Token.EOLN) && 
                     (Scanner.Token.type != Scanner.Token.REM))
                    BASICI.throwError("extraneous text");
                 var item = BASICI.getNextDataItem();
                 if (item == null)
                    return;
                 if (var_.name.charAt(var_.name.length - 1) != "$")
                 {
                    if (typeof item != "number")
                       BASICI.throwError("numeric literal expected");
                 }
                 else
                 {
                    if (typeof item != "string")
                       BASICI.throwError("string literal expected");
                 }
                 BASICI.store(var_, item);
              },

   // The following function is private and should not be called.

   parseRelExpr: function()
                 {
                    var fact;
                    switch (Scanner.Token.type)
                    {
                       case Scanner.Token.ID:
                            var var_ = BASICI.parseVar();
                            fact = BASICI.fetch(var_);
                            break;

                       case Scanner.Token.ABS:
                       case Scanner.Token.ACOS:
                       case Scanner.Token.ASC:
                       case Scanner.Token.ASIN:
                       case Scanner.Token.ATAN:
                       case Scanner.Token.CEIL:
                       case Scanner.Token.COS:
                       case Scanner.Token.EXP:
                       case Scanner.Token.FLOOR:
                       case Scanner.Token.FLTLIT:
                       case Scanner.Token.INSTR:
                       case Scanner.Token.INTLIT:
                       case Scanner.Token.LEN:
                       case Scanner.Token.LENGTH:
                       case Scanner.Token.LOG:
                       case Scanner.Token.LPAREN:
                       case Scanner.Token.MINUS:
                       case Scanner.Token.PI:
                       case Scanner.Token.PLUS:
                       case Scanner.Token.POW:
                       case Scanner.Token.RANDOM:
                       case Scanner.Token.ROUND:
                       case Scanner.Token.SCREEN:
                       case Scanner.Token.SGN:
                       case Scanner.Token.SIN:
                       case Scanner.Token.SQRT:
                       case Scanner.Token.TAN:
                       case Scanner.Token.TODEGREES:
                       case Scanner.Token.TORADIANS:
                       case Scanner.Token.TRUNC:
                       case Scanner.Token.VAL:
                            fact = BASICI.parseNumExpr();
                            break;

                       case Scanner.Token.BROWSER:
                       case Scanner.Token.CHR:
                       case Scanner.Token.DATETIME:
                       case Scanner.Token.HEX:
                       case Scanner.Token.INKEY:
                       case Scanner.Token.LCASE:
                       case Scanner.Token.LEFT:
                       case Scanner.Token.MID:
                       case Scanner.Token.RIGHT:
                       case Scanner.Token.STR:
                       case Scanner.Token.STRING:
                       case Scanner.Token.STRLIT:
                       case Scanner.Token.TRIM:
                       case Scanner.Token.UCASE:
                            fact = BASICI.parseStrExpr();
                            break;

                       default: BASICI.throwError("bad syntax");
                    }
                    switch (Scanner.Token.type)
                    {
                       case Scanner.Token.EQ:
                            Scanner.scan();
                            if (typeof fact == "number")
                               return fact == BASICI.parseNumExpr();
                            else
                               return fact == BASICI.parseStrExpr();

                       case Scanner.Token.NE:
                            Scanner.scan();
                            if (typeof fact == "number")
                               return fact != BASICI.parseNumExpr();
                            else
                               return fact != BASICI.parseStrExpr();

                       case Scanner.Token.LT:
                            Scanner.scan();
                            if (typeof fact == "number")
                               return fact < BASICI.parseNumExpr();
                            else
                               return fact < BASICI.parseStrExpr();

                       case Scanner.Token.LE:
                            Scanner.scan();
                            if (typeof fact == "number")
                               return fact <= BASICI.parseNumExpr();
                            else
                               return fact <= BASICI.parseStrExpr();

                       case Scanner.Token.GT:
                            Scanner.scan();
                            if (typeof fact == "number")
                               return fact > BASICI.parseNumExpr();
                            else
                               return fact > BASICI.parseStrExpr();

                       case Scanner.Token.GE:
                            Scanner.scan();
                            if (typeof fact == "number")
                               return fact >= BASICI.parseNumExpr();
                            else
                               return fact >= BASICI.parseStrExpr();

                       default: BASICI.throwError("bad syntax");
                    }
                 },

   // The following function is private and should not be called.

   parseRem: function()
             {
             },

   // The following function is private and should not be called.

   parseRepeat: function()
                {
                   Scanner.scan();
                   if ((Scanner.Token.type != Scanner.Token.EOLN) && 
                       (Scanner.Token.type != Scanner.Token.REM))
                      BASICI.throwError("extraneous text");
                   BASICI.repeatStack.push({ retLine: BASICI.curLine });
                },

   // The following function is private and should not be called.

   parseReturn: function()
                {
                   Scanner.scan();
                   if ((Scanner.Token.type != Scanner.Token.EOLN) && 
                       (Scanner.Token.type != Scanner.Token.REM))
                      BASICI.throwError("extraneous text");
                   if (BASICI.callStack.length == 0)
                      BASICI.throwError("RETURN without CALL");
                   BASICI.curLine = BASICI.callStack.pop().retLine;
                   BASICI.autoAdvanceLine = false;
                },

   // The following function is private and should not be called.

   parseStmt: function()
              {
                 switch (Scanner.Token.type)
                 {
                    case Scanner.Token.CALL:
                         BASICI.parseCall();
                         break;

                    case Scanner.Token.CLS:
                         BASICI.parseCls();
                         break;

                    case Scanner.Token.CURSOR:
                         BASICI.parseCursor();
                         break;

                    case Scanner.Token.DATA:
                         BASICI.parseData();
                         break;

                    case Scanner.Token.DIM:
                         BASICI.parseDim();
                         break;

                    case Scanner.Token.ELSE:
                         BASICI.parseElse();
                         break;

                    case Scanner.Token.END:
                         BASICI.parseEnd();
                         break;

                    case Scanner.Token.ENDIF:
                         BASICI.parseEndIf();
                         break;

                    case Scanner.Token.ENDWHILE:
                         BASICI.parseEndWhile();
                         break;

                    case Scanner.Token.FOR:
                         BASICI.parseFor();
                         break;

                    case Scanner.Token.GRAPHICS:
                         BASICI.parseGraphics();
                         break;

                    case Scanner.Token.ID:
                         BASICI.parseAssign();
                         break;

                    case Scanner.Token.IF:
                         BASICI.parseIf();
                         break;

                    case Scanner.Token.INPUT:
                         BASICI.parseInput();
                         break;

                    case Scanner.Token.LABEL:
                         BASICI.parseLabel();
                         break;

                    case Scanner.Token.LOCATE:
                         BASICI.parseLocate();
                         break;

                    case Scanner.Token.NEXT:
                         BASICI.parseNext();
                         break;

                    case Scanner.Token.PRINT:
                         BASICI.parsePrint();
                         break;

                    case Scanner.Token.READ:
                         BASICI.parseRead();
                         break;

                    case Scanner.Token.REM:
                         BASICI.parseRem();
                         break;

                    case Scanner.Token.REPEAT:
                         BASICI.parseRepeat();
                         break;

                    case Scanner.Token.RETURN:
                         BASICI.parseReturn();
                         break;

                    case Scanner.Token.UNTIL:
                         BASICI.parseUntil();
                         break;

                    case Scanner.Token.WHILE:
                         BASICI.parseWhile();
                         break;

                    default:
                         BASICI.throwError("illegal statement");
                 }
              },

   // The following function is private and should not be called.

   parseStrExpr: function()
                 {
                    var fact = BASICI.parseStrFact();
                    return BASICI.parseStrExpr1(fact);
                 },

   // The following function is private and should not be called.

   parseStrExpr1: function(fact)
                  {
                     while (Scanner.Token.type == Scanner.Token.PLUS)
                     {
                        Scanner.scan();
                        fact += BASICI.parseStrFact();
                     }
                     return fact;
                  },

   // The following function is private and should not be called.

   parseStrFact: function()
                 {
                    switch (Scanner.Token.type)
                    {
                       case Scanner.Token.BROWSER:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            var fact = BASICI.parseIntExpr();
                            if (fact < 0 || fact > 2)
                               BASICI.throwError("integer factor < 0 or > 2");
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            if (fact == 0)
                               return navigator.appName;
                            else
                            if (fact == 1)
                               return navigator.appVersion;
                            else
                               return navigator.userAgent;

                       case Scanner.Token.CHR:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            var fact = BASICI.parseIntExpr();
                            if (fact < 0)
                               BASICI.throwError("integer factor < 0");
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            return String.fromCharCode(fact);

                       case Scanner.Token.DATETIME:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            var fact = BASICI.parseIntExpr();
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            switch (fact)
                            {
                               case 0 : return new Date().toDateString();
                               case 1 : return new Date().toTimeString();
                               case 2 : return new Date().toLocaleDateString();
                               case 3 : return new Date().toLocaleTimeString();
                               case 4 : return new Date().toString();
                               case 5 : return new Date().toLocaleString();
                               default: BASICI.throwError("arg " + fact +
                                                          " out of range");
                            }

                       case Scanner.Token.HEX:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            var fact = BASICI.parseIntExpr();
                            if (fact < 0)
                               BASICI.throwError("integer factor < 0");
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            return fact.toString(16);

                       case Scanner.Token.ID:
                            var var_ = BASICI.parseVar();
                            if (BASICI.vars[var_.name] == undefined)
                               BASICI.throwError("undefined var " + var_.name);
                            var res = BASICI.fetch(var_);
                            if (typeof res != "string")
                               BASICI.throwError("string scalar expected");
                            return res;

                       case Scanner.Token.INKEY:
                            Scanner.scan();
                            var key = Console.getKey();
                            return (key == -1) ? "" : key;

                       case Scanner.Token.LCASE:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            var fact = BASICI.parseStrExpr();
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            return String.toLowerCase(fact);

                       case Scanner.Token.LEFT:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            var fact1 = BASICI.parseStrExpr();
                            if (Scanner.Token.type != Scanner.Token.COMMA)
                               BASICI.throwError("',' expected");
                            Scanner.scan();
                            var fact2 = BASICI.parseIntExpr();
                            if (fact2 < 0)
                               BASICI.throwError("integer factor < 0");
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            return fact1.substr(0, fact2);

                       case Scanner.Token.MID:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            var fact1 = BASICI.parseStrExpr();
                            if (Scanner.Token.type != Scanner.Token.COMMA)
                               BASICI.throwError("',' expected");
                            Scanner.scan();
                            var fact2 = BASICI.parseIntExpr();
                            if (fact2 < 0)
                               BASICI.throwError("integer factor < 0");
                            if (Scanner.Token.type != Scanner.Token.COMMA)
                               BASICI.throwError("',' expected");
                            Scanner.scan();
                            var fact3 = BASICI.parseIntExpr();
                            if (fact3 < 0)
                               BASICI.throwError("integer factor < 0");
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            return fact1.substr(fact2, fact3);

                       case Scanner.Token.RIGHT:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            var fact1 = BASICI.parseStrExpr();
                            if (Scanner.Token.type != Scanner.Token.COMMA)
                               BASICI.throwError("',' expected");
                            Scanner.scan();
                            var fact2 = BASICI.parseIntExpr();
                            if (fact2 < 0)
                               BASICI.throwError("integer factor < 0");
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            return fact1.substr(fact1.length - fact2, fact2);

                       case Scanner.Token.STR:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            var fact = BASICI.parseNumExpr();
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            return fact.toString();

                       case Scanner.Token.STRING:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            var fact1 = BASICI.parseIntExpr();
                            if (fact1 < 0)
                               BASICI.throwError("integer factor < 0");
                            if (Scanner.Token.type != Scanner.Token.COMMA)
                               BASICI.throwError("',' expected");
                            Scanner.scan();
                            var fact2 = BASICI.parseStrExpr();
                            if (fact2.length == 0)
                               BASICI.throwError("string length is 0");
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            var temp = "";
                            for (var i = 0; i < fact1; i++)
                                temp += fact2.charAt(0);
                            return temp;

                       case Scanner.Token.STRLIT:
                            var fact = Scanner.Token.lexeme;
                            Scanner.scan();
                            return fact;

                       case Scanner.Token.TRIM:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            var fact = BASICI.parseStrExpr();
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            return fact.replace(/^\s+|\s+$/g, '');

                       case Scanner.Token.UCASE:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            var fact = BASICI.parseStrExpr();
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            return String.toUpperCase(fact);

                       default: BASICI.throwError("bad syntax");
                    }
                 },

   // The following function is private and should not be called.

   parseUntil: function()
               {
                  Scanner.scan();
                  var isTrue = BASICI.parseBoolExpr();
                  if ((Scanner.Token.type != Scanner.Token.EOLN) && 
                      (Scanner.Token.type != Scanner.Token.REM))
                     BASICI.throwError("extraneous text");
                  if (BASICI.repeatStack.length == 0)
                     BASICI.throwError("UNTIL without REPEAT");
                  var repeatInfo = BASICI.repeatStack.pop();
                  if (!isTrue)
                  {
                     BASICI.curLine = repeatInfo.retLine;
                     BASICI.autoAdvanceLine = false;
                  }
               },

   // The following function is private and should not be called.

   parseVar: function(isDim)
             {
                var name = Scanner.Token.lexeme;
                var row = -1;
                var col = -1;
                Scanner.scan();
                if (Scanner.Token.type == Scanner.Token.LBRACKET)
                {
                   Scanner.scan();
                   row = BASICI.parseIntExpr();
                   if (isDim != undefined)
                   {
                      if (row < 1)
                         BASICI.throwError("array length less than 1 in " +
                                           "first dimension");
                   }
                   else
                   {
                      if (row < 0)
                         BASICI.throwError("first subscript less than 0");
                   }
                   if (Scanner.Token.type != Scanner.Token.RBRACKET)
                      throw ("']' expected");
                   Scanner.scan();
                }
                if (Scanner.Token.type == Scanner.Token.LBRACKET)
                {
                   Scanner.scan();
                   col = BASICI.parseIntExpr();
                   if (isDim != undefined)
                   {
                      if (col < 1)
                         BASICI.throwError("array length less than 1 in " +
                                           "second dimension");
                   }
                   else
                   {
                      if (col < 0)
                         BASICI.throwError("second subscript less than 0");
                   }
                   if (Scanner.Token.type != Scanner.Token.RBRACKET)
                      throw ("']' expected");
                   Scanner.scan();
                }
                return { name: name, row: row, col: col };
             },

   // The following function is private and should not be called.

   parseWhile: function()
               {
                  Scanner.scan();
                  var isTrue = BASICI.parseBoolExpr();
                  if ((Scanner.Token.type != Scanner.Token.EOLN) && 
                      (Scanner.Token.type != Scanner.Token.REM))
                    BASICI.throwError("extraneous text");
                  if (isTrue)
                  {
                     BASICI.whileStack.push({ retLine: BASICI.curLine });
                     return;
                  }
                  var counter = 0;
                  var tempLine = BASICI.curLine.next;
                  while (tempLine != null)
                  {
                    // var text = tempLine.text.toUpperCase();
                    var text = tempLine.text.toUpperCase().trim();
                     if (text.length >= 5 && text.substr(0, 5) == "WHILE")
                        counter++;
                     else
                     if (text.length >= 8 && text.substr(0, 8) == "ENDWHILE")
                        if (counter == 0)
                        {
                           BASICI.curLine = tempLine;
                           return;
                        }
                        else
                           counter--;
                     tempLine = tempLine.next;
                  }
                  BASICI.throwError("WHILE without ENDWHILE");
               },

   // The following function is private and should not be called.

   store: function(var_, value)
   {
      if (var_.row == -1 && var_.col == -1)
         BASICI.vars[var_.name] = value;

      if (var_.row != -1)
         if (var_.col == -1)
         {
            if (var_.row < 0 || var_.row >= BASICI.vars[var_.name].length)
               BASICI.throwError("subscript out of range");
            BASICI.vars[var_.name][var_.row] = value;
         }
         else
         {
            if (var_.row < 0 || var_.row >= BASICI.vars[var_.name].length)
               BASICI.throwError("row subscript out of range");
            if (var_.col < 0 || var_.col >= BASICI.vars[var_.name][0].length)
               BASICI.throwError("col subscript out of range");
            BASICI.vars[var_.name][var_.row][var_.col] = value;
         }     
   },

   // The following function is private and should not be called.

   throwError: function(errmsg)
               {
                  throw errmsg + " on line " + BASICI.curLine.num + "\n";
               }
}

BASICI = Object.assign(BASICI, BASICIPrivate2);
delete(BASICIPrivate2);

//
//                                End of file
//


