
/*
  BASICI.Private1.js

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

var BASICIPrivate1 = 
{


   // The following function is private and should not be called.

   createArray: function(var_)
   {
      BASICI.vars[var_.name] = new Array(var_.row);
      for (var i = 0; i < var_.row; i++)
      {
         if (var_.col != -1)
         {
            BASICI.vars[var_.name][i] = new Array(var_.col);
            for (var j = 0; j < var_.col; j++)
               if (var_.name.charAt(var_.name.length - 1) != "$")
                  BASICI.vars[var_.name][i][j] = 0;
               else
                  BASICI.vars[var_.name][i][j] = "";
         }
         else
         {
            if (var_.name.charAt(var_.name.length - 1) != "$")
               BASICI.vars[var_.name][i] = 0;
            else
               BASICI.vars[var_.name][i] = "";
         }
      }
   },

   // The following function is private and should not be called.

   fetch: function(var_)
   {
      if (var_.row == -1 && var_.col == -1)
         return BASICI.vars[var_.name];

      if (var_.row != -1)
         if (var_.col == -1)
         {
            if (var_.row < 0 || var_.row >= BASICI.vars[var_.name].length)
               BASICI.throwError("subscript out of range");
            return BASICI.vars[var_.name][var_.row];
         }
         else
         {
            if (var_.row < 0 || var_.row >= BASICI.vars[var_.name].length)
               BASICI.throwError("row subscript out of range");
            if (var_.col < 0 || var_.col >= BASICI.vars[var_.name][0].length)
               BASICI.throwError("col subscript out of range");
            return BASICI.vars[var_.name][var_.row][var_.col];
         }     
   },

   // The following function is private and should not be called.

   getNextDataItem: function()
                    {
                       var ptr = BASICI.dataPtr;
                       if (ptr.line == null)
                       {
                          var curLine = BASICI.program;
                          while (curLine != null)
                          {
                             Scanner.init(curLine.text);
                             Scanner.scan();
                             if (Scanner.Token.type == Scanner.Token.DATA)
                             {
                                Scanner.scan();
                                if (Scanner.Token.type == Scanner.Token.EOLN)
                                {
                                   BASICI.curLine = curLine;
                                   BASICI.throwError("literal expected");
                                }
                                ptr.line = curLine;
                                ptr.numTokensToSkip = 0;
                                break;
                             }
                             curLine = curLine.next;
                          }
                          if (curLine == null)
                             BASICI.throwError("no 'DATA' found from search " +
                                               "started");
                       }
                       else
                       {
                          Scanner.init(ptr.line.text);
                          Scanner.scan(); // Scan DATA.
                          for (var i = 0; i < ptr.numTokensToSkip; i++)
                             Scanner.scan(); // Skip +, -, literal, and comma.
                          Scanner.scan();
                          if (Scanner.Token.type == Scanner.Token.EOLN)
                          {
                             var curLine = ptr.line.next;
                             while (curLine != null)
                             {
                                Scanner.init(curLine.text);
                                Scanner.scan();
                                if (Scanner.Token.type == Scanner.Token.DATA)
                                {
                                   Scanner.scan();
                                   if (Scanner.Token.type == Scanner.Token.EOLN)
                                   {
                                      BASICI.curLine = curLine;
                                      BASICI.throwError("literal expected");
                                   }
                                   ptr.line = curLine;
                                   ptr.numTokensToSkip = 0;
                                   break;
                                }
                                curLine = curLine.next;
                             }
                             if (curLine == null)
                                BASICI.thowErrorMsg("no 'DATA' found from " +
                                                    "search started");
                          }
                       }
                       var item;
                       if (Scanner.Token.type == Scanner.Token.STRLIT)
                          item = Scanner.Token.lexeme;
                       else
                       {
                          var sign = 1;
                          switch (Scanner.Token.type)
                          {
                             case Scanner.Token.MINUS:
                                  sign = -1;

                             case Scanner.Token.PLUS:
                                  ptr.numTokensToSkip++;
                                  Scanner.scan();
                          }
                          switch (Scanner.Token.type)
                          {
                             case Scanner.Token.FLTLIT:
                                  item = sign * 
                                         parseFloat(Scanner.Token.lexeme);
                                  break;

                             case Scanner.Token.INTLIT:
                                  var lexeme = Scanner.Token.lexeme;
                                  if (!BASICI.isValidInt(sign, lexeme))
                                  {
                                     BASICI.curLine = curLine;
                                     BASICI.thowErrorMsg("integer too large");
                                  }
                                  item = sign * parseInt(lexeme);
                                  break;

                             default:
                                  BASICI.curLine = curLine;
                                  BASICI.throwError("numeric literal " +
                                                    "expected");
                          }
                       }
                       ptr.numTokensToSkip++;
                       Scanner.scan();
                       if (Scanner.Token.type != Scanner.Token.COMMA &&
                           Scanner.Token.type != Scanner.Token.EOLN)
                       {
                          BASICI.curLine = curLine;
                          BASICI.throwError("',' expected");
                       }
                       ptr.numTokensToSkip++;
                       return item;
                    },

   // The following function is private and should not be called.

   isValidInt: function(sign, lexeme)
               {
                  if (lexeme.length > 10)
                     return false;
                  if (lexeme.length == 10)
                  {
                     if (lexeme > "2147483648")
                        return false;
                     if (sign == 1 && lexeme == "2147483648")
                        return false;
                  }
                  return true;
               },

   // The following function is private and should not be called.

   parseAssign: function()
                {
                   var var_ = BASICI.parseVar();
                   if (BASICI.vars[var_.name] == undefined)
                      BASICI.throwError("undefined var " + var_.name);
                   if (Scanner.Token.type != Scanner.Token.EQ)
                      BASICI.throwError("'=' expected");
                   Scanner.scan();
                   if (var_.name.charAt(var_.name.length - 1) != '$')
                      BASICI.store(var_, BASICI.parseNumExpr());
                   else
                      BASICI.store(var_, BASICI.parseStrExpr());
                 if ((Scanner.Token.type != Scanner.Token.EOLN) && 
                     (Scanner.Token.type != Scanner.Token.REM))
                      BASICI.throwError("extraneous text");
                },

   // The following function is private and should not be called.

   parseBoolExpr: function()
                  {
                     var term = BASICI.parseBoolTerm();
                     return BASICI.parseBoolExpr1(term);
                  },

   // The following function is private and should not be called.

   parseBoolExpr1: function(term)
                   {
                      while (Scanner.Token.type == Scanner.Token.OR)
                      {
                         Scanner.scan();
                         var term2 = BASICI.parseBoolTerm();
                         term = term || term2;
                         term = BASICI.parseBoolExpr1(term);
                      }
                      return term;
                   },
 
   // The following function is private and should not be called.

   parseBoolFact: function()
                  {
                    var not = false;
                    if (Scanner.Token.type == Scanner.Token.NOT)
                    {
                       not = true;
                       Scanner.scan();
                    }
                    switch (Scanner.Token.type)
                    {
                       case Scanner.Token.FALSE:
                            Scanner.scan();
                            return (not) ? 1 : 0;

                       case Scanner.Token.ISINF:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            var fact = BASICI.parseNumExpr();
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            return (not) ? !(fact == Number.POSITIVE_INFINITY ||
                                             fact == Number.NEGATIVE_INFINITY)
                                         : (fact == Number.POSITIVE_INFINITY ||
                                            fact == Number.NEGATIVE_INFINITY);

                       case Scanner.Token.ISNAN:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            var fact = BASICI.parseNumExpr();
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            return (not) ? !isNaN(fact) : isNaN(fact);

                       case Scanner.Token.ISNINF:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            var fact = BASICI.parseNumExpr();
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            return (not) ? !(fact == Number.NEGATIVE_INFINITY)
                                         : (fact == Number.NEGATIVE_INFINITY);

                       case Scanner.Token.ISPINF:
                            Scanner.scan();
                            if (Scanner.Token.type != Scanner.Token.LPAREN)
                               BASICI.throwError("'(' expected");
                            Scanner.scan();
                            var fact = BASICI.parseNumExpr();
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            return (not) ? !(fact == Number.POSITIVE_INFINITY)
                                         : (fact == Number.POSITIVE_INFINITY);

                       case Scanner.Token.LPAREN:
                            Scanner.scan();
                            var fact = BASICI.parseBoolExpr();
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            return (not) ? !fact : fact;

                       case Scanner.Token.TRUE:
                            Scanner.scan();
                            return (not) ? 0 : 1;

                       default:
                            var fact = BASICI.parseRelExpr();
                            return (not) ? !fact : fact;
                    }
                 },

   // The following function is private and should not be called.

   parseBoolTerm: function()
                  {
                     var fact = BASICI.parseBoolFact();
                     return BASICI.parseBoolTerm1(fact);
                  },

   // The following function is private and should not be called.

   parseBoolTerm1: function(fact)
                   {
                      while (Scanner.Token.type == Scanner.Token.AND)
                      {
                         Scanner.scan();
                         var fact2 = BASICI.parseBoolFact();
                         fact = fact && fact2;
                         fact = BASICI.parseBoolTerm1(fact);
                      }
                      return fact;
                  },

   // The following function is private and should not be called.

   parseCall: function()
              { 
                 Scanner.scan();
                 if (Scanner.Token.type != Scanner.Token.ID)
                    BASICI.throwError("identifier expected");
                 var label = Scanner.Token.lexeme + ":";
                 Scanner.scan();
                 if ((Scanner.Token.type != Scanner.Token.EOLN) && 
                     (Scanner.Token.type != Scanner.Token.REM))
                    BASICI.throwError("extraneous text");
                 var tempLine = BASICI.program;
                 while (tempLine != null)
                 {
                    Scanner.init(tempLine.text);
                    Scanner.scan();
                    if (Scanner.Token.type == Scanner.Token.LABEL &&
                        label == Scanner.Token.lexeme)
                    {
                       BASICI.callStack.push({ retLine: BASICI.curLine.next });
                       BASICI.curLine = tempLine.next; // line after label
                       BASICI.autoAdvanceLine = false;
                       return;
                    }
                    tempLine = tempLine.next;
                 }
                 BASICI.throwError("unable to find subroutine");
              },

   // The following function is private and should not be called.

   parseCls: function()
             {
                Scanner.scan();
                 if ((Scanner.Token.type != Scanner.Token.EOLN) && 
                     (Scanner.Token.type != Scanner.Token.REM))
                   BASICI.throwError("extraneous text");
                Console.clear();
             },

   // The following function is private and should not be called.

   parseCursor: function()
                {
                   Scanner.scan();
                   switch (Scanner.Token.type)
                   {
                      case Scanner.Token.OFF:
                           Console.hideCursor();
                           break;
    
                      case Scanner.Token.ON:
                           Console.showCursor();
                           break;

                      default:
                           BASICI.throwError("bad syntax");
                   }
                   Scanner.scan();
                 if ((Scanner.Token.type != Scanner.Token.EOLN) && 
                     (Scanner.Token.type != Scanner.Token.REM))
                      BASICI.throwError("extraneous text");
                },

   // The following function is private and should not be called.

   parseData: function()
              {
                 Scanner.scan();
                 if (Scanner.Token.type == Scanner.Token.FLTLIT ||
                     Scanner.Token.type == Scanner.Token.INTLIT ||
                     Scanner.Token.type == Scanner.Token.STRLIT)
                    return;
                 if (Scanner.Token.type == Scanner.Token.MINUS ||
                     Scanner.Token.type == Scanner.Token.PLUS)
                 {
                    Scanner.scan();
                    if (Scanner.Token.type == Scanner.Token.FLTLIT ||
                        Scanner.Token.type == Scanner.Token.INTLIT)
                       return;
                 }
                 BASICI.throwError("literal expected");
              },

   // The following function is private and should not be called.

   parseDim: function()
             {
                Scanner.scan();
                BASICI.parseDimList();
             },

   // The following function is private and should not be called.

   parseDimList: function()
                 {
                    do
                    {
                       if (Scanner.Token.type != Scanner.Token.ID)
                          BASICI.throwError("identifier expected");
                       var var_ = BASICI.parseVar(true);
                       if (var_.row != -1)
                          BASICI.createArray(var_);
                       else
                       {
                          if (Scanner.Token.type == Scanner.Token.EQ)
                          {
                             Scanner.scan();
                             if (var_.name.charAt(var_.name.length - 1) != "$")
                                BASICI.store(var_, BASICI.parseNumExpr());
                             else
                                BASICI.store(var_, BASICI.parseStrExpr());
                          }
                          else
                          {
                             if (var_.name.charAt(var_.name.length - 1) != "$")
                                BASICI.store(var_, 0);
                             else
                                BASICI.store(var_, "");
                          }
                       }
                       switch (Scanner.Token.type)
                       {
                          case Scanner.Token.COMMA:
                               Scanner.scan();
                               break;

                          case Scanner.Token.EOLN:
                          case Scanner.Token.REM:
                               return;

                          default:
                               BASICI.throwError("extraneous text");
                       }
                    }
                    while (true);
                 },

   // The following function is private and should not be called.

   parseElse: function()
              {
                 Scanner.scan();
                 if ((Scanner.Token.type != Scanner.Token.EOLN) && 
                     (Scanner.Token.type != Scanner.Token.REM))
                    BASICI.throwError("extraneous text");
                 if (BASICI.ifStack.length == 0)
                    BASICI.throwError("ELSE without IF");
                 var counter = 0;
                 var tempLine = BASICI.curLine.next;
                 while (tempLine != null)
                 {
                    // var text = tempLine.text.toUpperCase();
                    var text = tempLine.text.toUpperCase().trim();
                    if (text.length >= 2 && text.substr(0, 2) == "IF")
                       counter++;
                    else
                    if (text.length >= 5 && text.substr(0, 5) == "ENDIF")
                       if (counter == 0)
                       {
                          BASICI.curLine = tempLine;
                          return;
                       }
                       else
                          counter--;
                    tempLine = tempLine.next;
                 }
                 BASICI.throwError("ELSE without ENDIF");
              },

   // The following function is private and should not be called.

   parseEnd: function()
             {
                Scanner.scan();
                if ((Scanner.Token.type != Scanner.Token.EOLN) && 
                    (Scanner.Token.type != Scanner.Token.REM))
                   BASICI.throwError("extraneous text");
             },

   // The following function is private and should not be called.

   parseEndIf: function()
               {
                  Scanner.scan();
                  if ((Scanner.Token.type != Scanner.Token.EOLN) && 
                      (Scanner.Token.type != Scanner.Token.REM))
                     BASICI.throwError("extraneous text");
                  if (BASICI.ifStack.length == 0)
                     BASICI.throwError("ENDIF without IF");
                  BASICI.ifStack.pop();
               },

   // The following function is private and should not be called.

   parseEndWhile: function()
                  {
                     Scanner.scan();
                     if ((Scanner.Token.type != Scanner.Token.EOLN) && 
                         (Scanner.Token.type != Scanner.Token.REM))
                        BASICI.throwError("extraneous text");
                     if (BASICI.whileStack.length == 0)
                        BASICI.throwError("ENDWHILE without WHILE");
                     var whileInfo = BASICI.whileStack.pop();
                     BASICI.curLine = whileInfo.retLine;
                     BASICI.autoAdvanceLine = false;
                  },

   // The following function is private and should not be called.

   parseFor: function()
             {
                Scanner.scan();
                if (Scanner.Token.type != Scanner.Token.ID)
                   BASICI.throwError("identifier expected");
                var var_ = BASICI.parseVar();
                if (BASICI.vars[var_.name] == undefined)
                   BASICI.throwError("undefined var " + var_.name);
                if (var_.name.charAt(var_.name.length - 1) == '$')
                   BASICI.throwError("numeric var expected");
                if (Scanner.Token.type != Scanner.Token.EQ)
                   BASICI.throwError("'=' expected");
                Scanner.scan();
                BASICI.store(var_, BASICI.parseNumExpr());
                if (Scanner.Token.type != Scanner.Token.TO)
                   BASICI.throwError("'TO' expected");
                Scanner.scan();
                var endValue = BASICI.parseNumExpr();
                var sign = 1;  
                if (Scanner.Token.type == Scanner.Token.STEP)
                {
                   Scanner.scan();
                   if (BASICI.parseNumExpr() < 0)
                      sign = -1;
                }
                if ((Scanner.Token.type != Scanner.Token.EOLN) && 
                    (Scanner.Token.type != Scanner.Token.REM))
                   BASICI.throwError("extraneous text");
                if ((sign == 1 && BASICI.fetch(var_) <= endValue) ||
                    (sign == -1 && BASICI.fetch(var_) >= endValue))
                {
                   BASICI.forStack.push({ varName: var_.name, 
                                          retLine: BASICI.curLine });
                   return;
                }
                var counter = 0;
                var tempLine = BASICI.curLine.next;
                while (tempLine != null)
                {
                   var text = tempLine.text.toUpperCase();
                   if (text.length >= 3 && text.substr(0, 3) == "FOR")
                      counter++;
                   else
                   if (text.length >= 4 && text.substr(0, 4) == "NEXT")
                      if (counter == 0)
                      {
                         BASICI.curLine = tempLine;
                         return;
                      }
                      else
                         counter--;
                   tempLine = tempLine.next;
                }
                BASICI.throwError("FOR without NEXT");
             },

   // The following function is private and should not be called.

   parseGraphics: function()
                  {
                     Scanner.scan();
                     BASICI.parseGraphicsList();
                  },

   parseGraphicsList: function()
                      {
                         do
                         {
                            if (Scanner.Token.type != Scanner.Token.ID)
                               BASICI.throwError("identifier expected");
                            var id = Scanner.Token.lexeme;
                            switch (id)
                            {
                               case "a":
                                    Scanner.scan();
                                    var x = BASICI.parseIntExpr();
                                    var y = BASICI.parseIntExpr();
                                    var r = BASICI.parseIntExpr();
                                    var sa = BASICI.parseNumExpr();
                                    var ea = BASICI.parseNumExpr();
                                    var cw = BASICI.parseBoolExpr();
                                    Console.arc(x, y, r, sa, ea, cw);
                                    break;

                               case "bct":
                                    Scanner.scan();
                                    var cpx1 = BASICI.parseIntExpr();
                                    var cpy1 = BASICI.parseIntExpr();
                                    var cpx2 = BASICI.parseIntExpr();
                                    var cpy2 = BASICI.parseIntExpr();
                                    var x = BASICI.parseIntExpr();
                                    var y = BASICI.parseIntExpr();
                                    Console.bezierCurveTo(cpx1, cpy1, cpx2, 
                                                          cpy2, x, y);
                                    break;

                               case "bp":
                                    Scanner.scan();
                                    Console.beginPath();
                                    break;

                               case "cp":
                                    Scanner.scan();
                                    Console.closePath();
                                    break;

                               case "cr":
                                    Scanner.scan();
                                    var x = BASICI.parseIntExpr();
                                    var y = BASICI.parseIntExpr();
                                    var w = BASICI.parseIntExpr();
                                    var h = BASICI.parseIntExpr();
                                    Console.clearRect(x, y, w, h);
                                    break;

                               case "f":
                                    Scanner.scan();
                                    Console.fill();
                                    break;

                               case "fr":
                                    Scanner.scan();
                                    var x = BASICI.parseIntExpr();
                                    var y = BASICI.parseIntExpr();
                                    var w = BASICI.parseIntExpr();
                                    var h = BASICI.parseIntExpr();
                                    Console.fillRect(x, y, w, h);
                                    break;

                               case "ft":
                                    Scanner.scan();
                                    var text = BASICI.parseStrExpr();
                                    var x = BASICI.parseIntExpr();
                                    var y = BASICI.parseIntExpr();
                                    Console.fillText(text, x, y);
                                    break;

                               case "lt":
                                    Scanner.scan();
                                    var x = BASICI.parseIntExpr();
                                    var y = BASICI.parseIntExpr();
                                    Console.lineTo(x, y);
                                    break;

                               case "mt":
                                    Scanner.scan();
                                    var x = BASICI.parseIntExpr();
                                    var y = BASICI.parseIntExpr();
                                    Console.moveTo(x, y);
                                    break;

                               case "mtx":
                                    Scanner.scan();
                                    var txt = BASICI.parseStrExpr();
                                    var font = BASICI.parseStrExpr();
                                    var var_ = BASICI.parseVar();
                                    if (BASICI.vars[var_.name] == undefined)
                                       BASICI.throwError("undefined var " +
                                                         var_.name);
                                    if (var_.name.
                                             charAt(var_.name.length - 1) ==
                                        '$')
                                       BASICI.throwError("numeric var " +
                                                         "expected");
                                    BASICI.store(var_, 
                                                 Console.measureText(txt, 
                                                                     font));
                                    break;

                               case "qct":
                                    Scanner.scan();
                                    var cpx = BASICI.parseIntExpr();
                                    var cpy = BASICI.parseIntExpr();
                                    var x = BASICI.parseIntExpr();
                                    var y = BASICI.parseIntExpr();
                                    Console.quadraticCurveTo(cpx, cpy, x, y);
                                    break;
                                    
                               case "r":
                                    Scanner.scan();
                                    var x = BASICI.parseIntExpr();
                                    var y = BASICI.parseIntExpr();
                                    var w = BASICI.parseIntExpr();
                                    var h = BASICI.parseIntExpr();
                                    Console.rect(x, y, w, h);
                                    break;

                               case "s":
                                    Scanner.scan();
                                    Console.stroke();
                                    break;

                               case "sf":
                                    Scanner.scan();
                                    var font = BASICI.parseStrExpr();
                                    Console.setFont(font);
                                    break;

                               case "sfs":
                                    Scanner.scan();
                                    var red = BASICI.parseIntExpr();
                                    var grn = BASICI.parseIntExpr();
                                    var blu = BASICI.parseIntExpr();
                                    Console.setFillStyle(red, grn, blu);
                                    break;

                               case "sfs2":
                                    Scanner.scan();
                                    var red = BASICI.parseIntExpr();
                                    var grn = BASICI.parseIntExpr();
                                    var blu = BASICI.parseIntExpr();
                                    var alpha = BASICI.parseNumExpr();
                                    Console.setFillStyle2(red, grn, blu, alpha);
                                    break;

                               case "slw":
                                    Scanner.scan();
                                    var w = BASICI.parseIntExpr();
                                    Console.setLineWidth(w);
                                    break;

                               case "sr":
                                    Scanner.scan();
                                    var x = BASICI.parseIntExpr();
                                    var y = BASICI.parseIntExpr();
                                    var w = BASICI.parseIntExpr();
                                    var h = BASICI.parseIntExpr();
                                    Console.strokeRect(x, y, w, h);
                                    break;

                               case "sss":
                                    Scanner.scan();
                                    var red = BASICI.parseIntExpr();
                                    var grn = BASICI.parseIntExpr();
                                    var blu = BASICI.parseIntExpr();
                                    Console.setStrokeStyle(red, grn, blu);
                                    break;

                               case "sss2":
                                    Scanner.scan();
                                    var red = BASICI.parseIntExpr();
                                    var grn = BASICI.parseIntExpr();
                                    var blu = BASICI.parseIntExpr();
                                    var alpha = BASICI.parseNumExpr();
                                    Console.setStrokeStyle2(red, grn, blu, 
                                                            alpha);
                                    break;

                               case "st":
                                    Scanner.scan();
                                    var text = BASICI.parseStrExpr();
                                    var x = BASICI.parseIntExpr();
                                    var y = BASICI.parseIntExpr();
                                    Console.strokeText(text, x, y);
                                    break;

                               case "u":
                                    Scanner.scan();
                                    Console.render();
                                    break;

                               default:
                                    BASICI.throwError("bad syntax");
                            }
                            if (Scanner.Token.type == Scanner.Token.EOLN)
                               return;
                         }
                         while (true); 
                      },

   // The following function is private and should not be called.

   parseIf: function()
            {
               Scanner.scan();
               var isTrue = BASICI.parseBoolExpr();
               if (Scanner.Token.type != Scanner.Token.THEN)
                  BASICI.throwError("'THEN' expected");
               Scanner.scan();
               if ((Scanner.Token.type != Scanner.Token.EOLN) && 
                   (Scanner.Token.type != Scanner.Token.REM))
                  BASICI.throwError("extraneous text");
               BASICI.ifStack.push({});
               if (isTrue)
                  return;
               var counter = 0;
               var tempLine = BASICI.curLine.next;
               while (tempLine != null)
               {
                  // var text = tempLine.text.toUpperCase();
                  var text = tempLine.text.toUpperCase().trim();
                  if (text.length >= 2 && text.substr(0, 2) == "IF")
                     counter++;
                  else
                  if (text.length >= 4 && text.substr(0, 4) == "ELSE")
                  {
                     if (counter == 0)
                     {
                        BASICI.curLine = tempLine;
                        return;
                     }
                  }
                  else
                  if (text.length >= 5 && text.substr(0, 5) == "ENDIF")
                     if (counter == 0)
                     {
                        BASICI.curLine = tempLine;
                        return;
                     }
                     else
                        counter--;
                  tempLine = tempLine.next;
               }
               BASICI.throwError("IF without ENDIF");
            },

   // The following function is private and should not be called.

   parseInput: function()
               {
                  Scanner.scan();
                  if (Scanner.Token.type != Scanner.Token.ID)
                     BASICI.throwError("identifier expected");
                  var var_ = BASICI.parseVar();
                  if (BASICI.vars[var_.name] == undefined)
                     BASICI.throwError("undefined var " + var_.name);
                  if (var_.name.charAt(var_.name.length - 1) != "$")
                     BASICI.throwError("string var expected");
                  if ((Scanner.Token.type != Scanner.Token.EOLN) && 
                      (Scanner.Token.type != Scanner.Token.REM))
                     BASICI.throwError("extraneous text");
                  BASICI.input = true;
                  BASICI.inputVar = var_;
               },

   // The following function is private and should not be called.

   parseIntExpr: function()
                 {
                    var term = BASICI.parseIntTerm();
                    return BASICI.parseIntExpr1(term);
                 },

   // The following function is private and should not be called.

   parseIntExpr1: function(term)
                  {
                     while (Scanner.Token.type == Scanner.Token.PLUS ||
                            Scanner.Token.type == Scanner.Token.MINUS)
                        switch (Scanner.Token.type)
                        {
                           case Scanner.Token.PLUS:
                                Scanner.scan();
                                term = term + BASICI.parseIntTerm();
                                term = BASICI.parseIntExpr1(term);
                                break;

                           case Scanner.Token.MINUS:
                                Scanner.scan();
                                term = term - BASICI.parseIntTerm();
                                term = BASICI.parseIntExpr1(term);
                        }
                     return term;
                  },

   // The following function is private and should not be called.

   parseIntFact: function()
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
                            var fact = BASICI.parseIntExpr();
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            return Math.abs(fact) * sign;

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

                       case Scanner.Token.ID:
                            var var_ = BASICI.parseVar();
                            if (BASICI.vars[var_.name] == undefined)
                               BASICI.throwError("undefined var " + var_.name);
                            var res = BASICI.fetch(var_);
                            if (typeof res != "number")
                               BASICI.throwError("numeric scalar expected");
                            return (res | 0) * sign;

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

                       case Scanner.Token.LPAREN:
                            Scanner.scan();
                            var fact = BASICI.parseIntExpr();
                            if (Scanner.Token.type != Scanner.Token.RPAREN)
                               BASICI.throwError("')' expected");
                            Scanner.scan();
                            return fact * sign;

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
                            var fact = BASICI.parseIntExpr();
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

                       default: BASICI.throwError("bad syntax");
                    }
                 }
}

BASICI = Object.assign(BASICI, BASICIPrivate1);
delete(BASICIPrivate1);

//
//                                End of file
//
