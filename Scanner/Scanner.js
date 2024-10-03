/*
   GRAMMAR
   =======

   id := (letter | "_" ) id1 id2

   id1 := (letter | digit | "_" | E) id1

   id2 := ("$" | E)

   letter := (A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | 
              Q | R | S | T | U | V | W | X | Y | Z | a | b | c | d | e | f | 
              g | h | i | j | k | l | m | n | o | p | q | r | s | t | u | v | 
              w | x | y | z)

   digit := (0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9)

   fltlit := intlit ("." intlit | E)

   intlit := digit intlit1

   intlit1 := (digit | E) intlit1

   strlit := "\"" charlist "\""

   charlist := char charlist

   char := (any character | "\n")
*/

var Scanner = 
{
   // =========================================================================
   // Initialize the scanner.
   //
   // Parameters:
   //
   // text - text to be scanned
   //
   // Return value:
   //
   // none
   // =========================================================================

   init: function(text)
         {
            if (Scanner.Token == undefined)
            {
               Scanner.Token = {};
               Scanner.Token.ABS = 0;
               Scanner.Token.ACOS = 1;
               Scanner.Token.AND = 2;
               Scanner.Token.ASC = 3;
               Scanner.Token.ASIN = 4;
               Scanner.Token.ATAN = 5;
               Scanner.Token.BROWSER = 6;
               Scanner.Token.CALL = 7;
               Scanner.Token.CEIL = 8;
               Scanner.Token.CHR = 9;
               Scanner.Token.CLS = 10;
               Scanner.Token.COMMA = 11;
               Scanner.Token.COS = 12;
               Scanner.Token.CURSOR = 13;
               Scanner.Token.DATA = 14;
               Scanner.Token.DATETIME = 15;
               Scanner.Token.DIM = 16;
               Scanner.Token.ELSE = 17;
               Scanner.Token.END = 18;
               Scanner.Token.ENDIF = 19;
               Scanner.Token.ENDWHILE = 20;
               Scanner.Token.EOLN = 21;
               Scanner.Token.EQ = 22;
               Scanner.Token.EXP = 23;
               Scanner.Token.FALSE = 24;
               Scanner.Token.FILES = 25;
               Scanner.Token.FLOOR = 26;
               Scanner.Token.FLTLIT = 27;
               Scanner.Token.FOR = 28;
               Scanner.Token.GE = 29;
               Scanner.Token.GRAPHICS = 30;
               Scanner.Token.GT = 31;
               Scanner.Token.HELP = 32;
               Scanner.Token.HEX = 33;
               Scanner.Token.ID = 34;
               Scanner.Token.IF = 35;
               Scanner.Token.INKEY = 36;
               Scanner.Token.INPUT = 37;
               Scanner.Token.INSTR = 38;
               Scanner.Token.ISINF = 39;
               Scanner.Token.ISNAN = 40;
               Scanner.Token.ISNINF = 41;
               Scanner.Token.ISPINF = 42;
               Scanner.Token.INTLIT = 43;
               Scanner.Token.KILL = 44;
               Scanner.Token.LABEL = 45;
               Scanner.Token.LBRACKET = 46;
               Scanner.Token.LCASE = 47;
               Scanner.Token.LE = 48;
               Scanner.Token.LEFT = 49;
               Scanner.Token.LEN = 50;
               Scanner.Token.LENGTH = 51;
               Scanner.Token.LIST = 52;
               Scanner.Token.LOAD = 53;
               Scanner.Token.LOCATE = 54;
               Scanner.Token.LOG = 55;
               Scanner.Token.LPAREN = 56;
               Scanner.Token.LT = 57;
               Scanner.Token.MID = 58;
               Scanner.Token.MINUS = 59;
               Scanner.Token.NE = 60;
               Scanner.Token.NEW = 61;
               Scanner.Token.NEXT = 62;
               Scanner.Token.NOT = 63;
               Scanner.Token.OFF = 64;
               Scanner.Token.ON = 65;
               Scanner.Token.OR = 66;
               Scanner.Token.PERCENT = 67;
               Scanner.Token.PI = 68;
               Scanner.Token.PLUS = 69;
               Scanner.Token.POW = 70;
               Scanner.Token.PRINT = 71;
               Scanner.Token.RANDOM = 72;
               Scanner.Token.RBRACKET = 73;
               Scanner.Token.READ = 74;
               Scanner.Token.REM = 75;
               Scanner.Token.RENUM = 76;
               Scanner.Token.REPEAT = 77;
               Scanner.Token.RETURN = 78;
               Scanner.Token.RIGHT = 79;
               Scanner.Token.RND = 80;
               Scanner.Token.ROUND = 81;
               Scanner.Token.RPAREN = 82;
               Scanner.Token.RUN = 83;
               Scanner.Token.SAVE = 84;
               Scanner.Token.SCREEN = 85;
               Scanner.Token.SEMICOLON = 86;
               Scanner.Token.SGN = 87;
               Scanner.Token.SIN = 88;
               Scanner.Token.SLASH = 89;
               Scanner.Token.SQRT = 90;
               Scanner.Token.STAR = 91;
               Scanner.Token.STEP = 92;
               Scanner.Token.STR = 93;
               Scanner.Token.STRING = 94;
               Scanner.Token.STRLIT = 95;
               Scanner.Token.TAN = 96;
               Scanner.Token.THEN = 97;
               Scanner.Token.TO = 98;
               Scanner.Token.TODEGREES = 99;
               Scanner.Token.TORADIANS = 100;
               Scanner.Token.TRIM = 101;
               Scanner.Token.TRUE = 102;
               Scanner.Token.TRUNC = 103;
               Scanner.Token.UCASE = 104;
               Scanner.Token.UNKNOWN = 105;
               Scanner.Token.UNTIL = 106;
               Scanner.Token.VAL = 107;
               Scanner.Token.WHILE = 108;
               Scanner.rw = [ { id: "ABS", type: Scanner.Token.ABS },
                              { id: "ACOS", type: Scanner.Token.ACOS },
                              { id: "AND", type: Scanner.Token.AND },
                              { id: "ASC", type: Scanner.Token.ASC },
                              { id: "ASIN", type: Scanner.Token.ASIN },
                              { id: "ATAN", type: Scanner.Token.ATAN },
                              { id: "BROWSER$", type: Scanner.Token.BROWSER },
                              { id: "CALL", type: Scanner.Token.CALL },
                              { id: "CEIL", type: Scanner.Token.CEIL },
                              { id: "CHR$", type: Scanner.Token.CHR },
                              { id: "CLS", type: Scanner.Token.CLS },
                              { id: "COS", type: Scanner.Token.COS },
                              { id: "CURSOR", type: Scanner.Token.CURSOR },
                              { id: "DATA", type: Scanner.Token.DATA },
                              { id: "DATETIME$", type: Scanner.Token.DATETIME },
                              { id: "DIM", type: Scanner.Token.DIM },
                              { id: "ELSE", type: Scanner.Token.ELSE },
                              { id: "END", type: Scanner.Token.END },
                              { id: "ENDIF", type: Scanner.Token.ENDIF },
                              { id: "ENDWHILE", type: Scanner.Token.ENDWHILE },
                              { id: "EXP", type: Scanner.Token.EXP },
                              { id: "FALSE", type: Scanner.Token.FALSE },
                              { id: "FILES", type: Scanner.Token.FILES },
                              { id: "FLOOR", type: Scanner.Token.FLOOR },
                              { id: "FOR", type: Scanner.Token.FOR },
                              { id: "GRAPHICS", type: Scanner.Token.GRAPHICS },
                              { id: "HELP", type: Scanner.Token.HELP },
                              { id: "HEX$", type: Scanner.Token.HEX },
                              { id: "IF", type: Scanner.Token.IF },
                              { id: "INKEY$", type: Scanner.Token.INKEY },
                              { id: "INPUT", type: Scanner.Token.INPUT },
                              { id: "INSTR", type: Scanner.Token.INSTR },
                              { id: "ISINF", type: Scanner.Token.ISINF },
                              { id: "ISNAN", type: Scanner.Token.ISNAN },
                              { id: "ISNINF", type: Scanner.Token.ISNINF },
                              { id: "ISPINF", type: Scanner.Token.ISPINF },
                              { id: "KILL", type: Scanner.Token.KILL },
                              { id: "LCASE$", type: Scanner.Token.LCASE },
                              { id: "LEFT$", type: Scanner.Token.LEFT },
                              { id: "LEN", type: Scanner.Token.LEN },
                              { id: "LENGTH", type: Scanner.Token.LENGTH },
                              { id: "LIST", type: Scanner.Token.LIST },
                              { id: "LOAD", type: Scanner.Token.LOAD },
                              { id: "LOCATE", type: Scanner.Token.LOCATE },
                              { id: "LOG", type: Scanner.Token.LOG },
                              { id: "MID$", type: Scanner.Token.MID },
                              { id: "NEW", type: Scanner.Token.NEW },
                              { id: "NEXT", type: Scanner.Token.NEXT },
                              { id: "NOT", type: Scanner.Token.NOT },
                              { id: "OFF", type: Scanner.Token.OFF },
                              { id: "ON", type: Scanner.Token.ON },
                              { id: "OR", type: Scanner.Token.OR },
                              { id: "PI", type: Scanner.Token.PI },
                              { id: "POW", type: Scanner.Token.POW },
                              { id: "PRINT", type: Scanner.Token.PRINT },
                              { id: "RANDOM", type: Scanner.Token.RANDOM },
                              { id: "READ", type: Scanner.Token.READ },
                              { id: "REM", type: Scanner.Token.REM },
                              { id: "'", type: Scanner.Token.REM },
                              { id: "RENUM", type: Scanner.Token.RENUM },
                              { id: "REPEAT", type: Scanner.Token.REPEAT },
                              { id: "RETURN", type: Scanner.Token.RETURN },
                              { id: "RIGHT$", type: Scanner.Token.RIGHT },
                              { id: "RND", type: Scanner.Token.RND },
                              { id: "ROUND", type: Scanner.Token.ROUND },
                              { id: "RUN", type: Scanner.Token.RUN },
                              { id: "SAVE", type: Scanner.Token.SAVE },
                              { id: "SCREEN", type: Scanner.Token.SCREEN },
                              { id: "SGN", type: Scanner.Token.SGN },
                              { id: "SIN", type: Scanner.Token.SIN },
                              { id: "SQRT", type: Scanner.Token.SQRT },
                              { id: "STEP", type: Scanner.Token.STEP },
                              { id: "STR$", type: Scanner.Token.STR },
                              { id: "STRING$", type: Scanner.Token.STRING },
                              { id: "TAN", type: Scanner.Token.TAN },
                              { id: "THEN", type: Scanner.Token.THEN },
                              { id: "TO", type: Scanner.Token.TO },
                              { id: "TODEGREES", type: Scanner.Token.TODEGREES },
                              { id: "TORADIANS", type: Scanner.Token.TORADIANS },
                              { id: "TRIM$", type: Scanner.Token.TRIM },
                              { id: "TRUE", type: Scanner.Token.TRUE },
                              { id: "TRUNC", type: Scanner.Token.TRUNC },
                              { id: "UCASE$", type: Scanner.Token.UCASE },
                              { id: "UNTIL", type: Scanner.Token.UNTIL },
                              { id: "VAL", type: Scanner.Token.VAL },
                              { id: "WHILE", type: Scanner.Token.WHILE } ]
            }
            Scanner.Token.lexeme = ""
            Scanner.Token.type = Scanner.Token.EOLN;
            Scanner.text = text;
            Scanner.pos = -1;
            if (text.length == 0)
               return;
            Scanner.currentChar = text.charAt(++Scanner.pos);
         },

   // =========================================================================
   // Scan the next token.
   //
   // Parameters:
   //
   // none
   //
   // Return value:
   //
   // token type
   // =========================================================================

   scan: function()
         {
            if (Scanner.text.length == 0)
               return;
            while (Scanner.currentChar == " ")
               Scanner.consume();
            Scanner.Token.lexeme = "";
            Scanner.Token.type = Scanner.scanToken();
         },

   // =========================================================================
   // WARNING: The rest of the function properties in this namespace should be
   // considered private and may change in a future version of this library. If
   // your code depends upon them, it will break. Also, properties added to 
   // Scanner in init() (e.g., text and pos) should be considered private and
   // may change in a future version. Don"t access them!
   // =========================================================================

   // The following function is private and should not be called.

   consume: function()
            {
               Scanner.Token.lexeme += Scanner.currentChar;
               if (++Scanner.pos != Scanner.text.length)
                  Scanner.currentChar = Scanner.text.charAt(Scanner.pos);
               else
                  Scanner.currentChar = "\0";
            },

   // The following function is private and should not be called.

   ignore: function()
           {
              if (++Scanner.pos != Scanner.text.length)
                 Scanner.currentChar = Scanner.text.charAt(Scanner.pos);
              else
                 Scanner.currentChar = "\0";
           },

   // The following function is private and should not be called.

   isDigit: function(ch)
            {
               return ch >= "0" && ch <= "9";
            },

   // The following function is private and should not be called.

   isLetter: function(ch)
             {
                return (ch >= "A" && ch <= "Z") || (ch >= "a" && ch <= "z");
             },

   // The following function is private and should not be called.

   scanToken: function()
              {
                 switch (Scanner.currentChar)
                 {
                    case ",": Scanner.consume();
                              return Scanner.Token.COMMA;

                    case "'":
                              return Scanner.Token.REM;

                    case "\0": return Scanner.Token.EOLN;

                    case "=": Scanner.consume();
                              return Scanner.Token.EQ;

                    case ">": Scanner.consume();
                              if (Scanner.currentChar == "=")
                              {
                                 Scanner.consume();
                                 return Scanner.Token.GE;
                              }
                              return Scanner.Token.GT;

                    case "A":
                    case "B":
                    case "C":
                    case "D":
                    case "E":
                    case "F":
                    case "G":
                    case "H":
                    case "I":
                    case "J":
                    case "K":
                    case "L":
                    case "M":
                    case "N":
                    case "O":
                    case "P":
                    case "Q":
                    case "R":
                    case "S":
                    case "T":
                    case "U":
                    case "V":
                    case "W":
                    case "X":
                    case "Y":
                    case "Z": 
                    case "a":
                    case "b":
                    case "c":
                    case "d":
                    case "e":
                    case "f":
                    case "g":
                    case "h":
                    case "i":
                    case "j":
                    case "k":
                    case "l":
                    case "m":
                    case "n":
                    case "o":
                    case "p":
                    case "q":
                    case "r":
                    case "s":
                    case "t":
                    case "u":
                    case "v":
                    case "w":
                    case "x":
                    case "y":
                    case "z":
                    case "_":
                              Scanner.consume();
                              while (Scanner.isLetter(Scanner.currentChar) ||
                                     Scanner.isDigit(Scanner.currentChar) ||
                                     Scanner.currentChar == "_")
                                 Scanner.consume();
                              if (Scanner.currentChar == ":")
                              {
                                 Scanner.consume();
                                 return Scanner.Token.LABEL;
                              }
                              if (Scanner.currentChar == "$")
                                 Scanner.consume();
                              var id = Scanner.Token.lexeme.toUpperCase();
                              for (var i = 0; i < Scanner.rw.length; i++)
                                 if (Scanner.rw[i].id == id)
                                    return Scanner.rw[i].type;
                              return Scanner.Token.ID;

                    case "[": Scanner.consume();
                              return Scanner.Token.LBRACKET;

                    case "<": Scanner.consume();
                              if (Scanner.currentChar == "=")
                              {
                                 Scanner.consume();
                                 return Scanner.Token.LE;
                              }
                              else
                              if (Scanner.currentChar == ">")
                              {
                                 Scanner.consume();
                                 return Scanner.Token.NE;
                              }
                              return Scanner.Token.LT;

                    case "(": Scanner.consume();
                              return Scanner.Token.LPAREN;

                    case "-": Scanner.consume();
                              return Scanner.Token.MINUS;

                    case "0":
                    case "1":
                    case "2":
                    case "3":
                    case "4":
                    case "5":
                    case "6":
                    case "7":
                    case "8":
                    case "9": Scanner.consume();
                              while (Scanner.isDigit(Scanner.currentChar))
                                 Scanner.consume();
                              if (Scanner.currentChar != ".")
                                 return Scanner.Token.INTLIT;
                              Scanner.consume();
                              while (Scanner.isDigit(Scanner.currentChar))
                                 Scanner.consume();
                              return Scanner.Token.FLTLIT;

                    case "%": Scanner.consume();
                              return Scanner.Token.PERCENT;

                    case "+": Scanner.consume();
                              return Scanner.Token.PLUS;

                    case "]": Scanner.consume();
                              return Scanner.Token.RBRACKET;

                    case ")": Scanner.consume();
                              return Scanner.Token.RPAREN;

                    case ";": Scanner.consume();
                              return Scanner.Token.SEMICOLON;

                    case "/": Scanner.consume();
                              return Scanner.Token.SLASH;

                    case "*": Scanner.consume();
                              return Scanner.Token.STAR;

                    case "\"": Scanner.ignore();
                              while (Scanner.currentChar != "\"" && 
                                     Scanner.currentChar != "\0")
                                 Scanner.consume();
                              if (Scanner.currentChar == "\"")
                                 Scanner.ignore();
                              else
                                 return Scanner.Token.UNKNOWN;
                              return Scanner.Token.STRLIT;
 
                    default : Scanner.consume();
                              return Scanner.Token.UNKNOWN;
                 }
              }
}