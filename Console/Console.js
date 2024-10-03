var Console = 
{
   // =========================================================================
   // Add arc to current path.
   //
   // Parameters:
   //
   // x      - x-coordinate of circle center
   // y      - y-coordinate of circle center
   // radius - circle radius
   // sa     - circle drawing start angle
   // ea     - circle drawing end angle 
   // cw     - circle drawn clockwise when true and anticlockwise when false
   //
   // Return value:
   // 
   // none
   // =========================================================================

   arc: function(x, y, radius, sa, ea, cw)
        {
           Console.cmds.push({ id: Console.CMD_ARC, x: x, y: y, radius: radius,
                               sa: sa, ea: ea, cw: cw });
        },

   // =========================================================================
   // Add bezier curve to current path.
   //
   // Parameters:
   //
   // cpx1 - x-coordinate of first control point
   // cpy1 - y-coordinate of first control point
   // cpx2 - x-coordinate of second control point
   // cpy2 - y-coordinate of Second control point
   // x    - x-coordinate of new position
   // y    - y-coordinate of new position
   //
   // Return value:
   // 
   // none
   // =========================================================================

   bezierCurveTo: function(cpx1, cpy1, cpx2, cpy2, x, y)
                  {
                     Console.cmds.push({ id: Console.CMD_BEZIERCURVETO,
                                         cpx1: cpx1, cpy1: cpy1, cpx2: cpx2,
                                         cpy2: cpy2, x: x, y: y });
                  },

   // =========================================================================
   // Begin a new path.
   //
   // Parameters:
   //
   // none
   //
   // Return value:
   //
   // none
   // =========================================================================

   beginPath: function()
              {
                 Console.cmds.push({ id: Console.CMD_BEGINPATH });
              },

   // =========================================================================
   // Clear the console and reset the cursor to the upper-left corner.
   //
   // Parameters:
   //
   // none
   //
   // Return value:
   //
   // none
   // =========================================================================

   clear: function()
          {
             for (var row = 0; row < Console.numRows; row++)
                for (var col = 0; col < Console.numCols; col++)
                   Console.screen[row][col] = " ";
             Console.row = 0;
             Console.col = 0;
             Console.cmds.length = 0;
             Console.render();
          },

   // =========================================================================
   // Clear rectangle.
   //
   // Parameters:
   //
   // x      - x-coordinate of upper-left corner
   // y      - y-coordinate of upper-left corner
   // width  - width of rectangle
   // height - height of rectangle
   //
   // Return value:
   //
   // none
   // =========================================================================

   clearRect: function(x, y, width, height)
              {
                 Console.cmds.push({ id: Console.CMD_CLEARRECT, x: x, y: y, 
                                     width: width, height: height });
              },

   // =========================================================================
   // Close current path.
   //
   // Parameters:
   //
   // none
   //
   // Return value:
   //
   // none
   // =========================================================================

   closePath: function()
              {
                 Console.cmds.push({ id: Console.CMD_CLOSEPATH });
              },

   // =========================================================================
   // Echo a message to the console starting at the cursor position, which is 
   // updated. The console scrolls when the message flows past the lower-right 
   // corner. The message is displayed in green text.
   //
   // Parameters:
   //
   // msg - the message to be displayed
   //
   // Return value:
   // 
   // none
   // =========================================================================

   echo: function(msg)
         {
            for (var i = 0; i < msg.length; i++)
               Console.writeChar(msg.charAt(i));
            Console.render();
         },

   // =========================================================================
   // Fill the current path.
   //
   // Parameters:
   //
   // none
   //
   // Return value:
   //
   // none
   // =========================================================================

   fill: function()
         {
            Console.cmds.push({ id: Console.CMD_FILL });
         },

   // =========================================================================
   // Fill rectangle.
   //
   // Parameters:
   //
   // x      - x-coordinate of upper-left corner
   // y      - y-coordinate of upper-left corner
   // width  - width of rectangle
   // height - height of rectangle
   //
   // Return value:
   //
   // none
   // =========================================================================

   fillRect: function(x, y, width, height)
             {
                Console.cmds.push({ id: Console.CMD_FILLRECT, x: x, y: y, 
                                    width: width, height: height });
             },

   // =========================================================================
   // Fill text.
   //
   // Parameters:
   //
   // text - text to be filled
   // x    - x-coordinate of leftmost character
   // y    - y-coordinate of leftmost character 
   //
   // Return value:
   //
   // none
   // =========================================================================

   fillText: function(text, x, y)
             {
                Console.cmds.push({ id: Console.CMD_FILLTEXT, text: text, x: x,
                                    y: y });
             },

   // =========================================================================
   // Get the height of the console screen.
   //
   // Parameters:
   //
   // none
   //
   // Return value:
   // 
   // height, in pixels
   // =========================================================================

   getHeight: function()
   {
      return Console.buffer.height;
   },

   // =========================================================================
   // Get the next character key value from the key buffer. Backspace, which is
   // are also stored in buffer, is ignored.
   //
   // Parameters:
   //
   // none
   //
   // Return value:
   //
   // character key value or -1 when no such value exists
   // =========================================================================

   getKey: function()
   {
      Console.render(); // update cursor

      while (Console.keyQueue.length != 0)
      {
         var ch = Console.keyQueue.shift();
         if (ch == "\b")
            continue;
         return ch;
      }
      return -1;
   },

   // =========================================================================
   // Get a line of input from the user and echo this input to the console.
   // Input may be in progress when this function is called and is only 
   // returned when the Return key has been pressed. Press Esc to cancel input.
   //
   // Parameters:
   //
   // callback - an optional parameter that references a no-parameter function 
   //            to be called when there is no input
   //
   // Return value:
   //
   // line of input or null when there is none or input is being gathered and 
   // the Return key has yet to be pressed
   // =========================================================================

   getLine: function(callback)
            {
               Console.render(); // update cursor
               if (Console.isEsc())
               {
                  for (var i = 0; i < Console.line.length; i++)
                      Console.echo("\b");
                  Console.line = "";
                  return null;
               }
               if (Console.keyQueue.length == 0)
               {
                  if (Console.line.length == 0)
                  {
                     if (callback != undefined)
                        callback();
                  }
                  return null;
               }
               var ch = Console.keyQueue.shift();
               if (ch == "\b") // handle backspace
               {
                  if (Console.line.length != 0)
                  {
                     Console.line = Console.line.substr(0, 
                                                        Console.line.length 
                                                        - 1);
                     Console.echo(ch);
                  }
                  return null;
               }
               Console.echo(ch);
               if (ch == "\n") // handle newline
               {
                  var temp = Console.line;
                  Console.line = "";
                  return temp;
               }
               else
                  Console.line += ch;
               return null;
            },

   // =========================================================================
   // Get the number of text columns of the console screen.
   //
   // Parameters:
   //
   // none
   //
   // Return value:
   // 
   // number of text columns
   // =========================================================================

   getNumCols: function()
   {
      return Console.numCols;
   },

   // =========================================================================
   // Get the number of text rows of the console screen.
   //
   // Parameters:
   //
   // none
   //
   // Return value:
   // 
   // number of text rows
   // =========================================================================

   getNumRows: function()
   {
      return Console.numRows;
   },

   // =========================================================================
   // Get the width of the console screen.
   //
   // Parameters:
   //
   // none
   //
   // Return value:
   // 
   // width, in pixels
   // =========================================================================

   getWidth: function()
   {
      return Console.buffer.width;
   },

   // =========================================================================
   // Hide the cursor.
   //
   // Parameters:
   //
   // none
   //
   // Return value:
   // 
   // none
   // =========================================================================

   hideCursor: function()
               {
                  Console.cursorVisible = false;
               },

   // =========================================================================
   // Initialize the console.
   //
   // Parameters:
   //
   // canvasName - the id attribute value of an existing canvas element
   // numCols    - number of desired columns to display (e.g., 80)
   // numRows    - number of desired rows to display (e.g., 25)
   //
   // Note: The minimum usable console is 2 columns by 2 rows.
   //
   // Return value:
   // 
   // none
   // =========================================================================

   init: function(canvasName, numCols, numRows)
         {
            var canvas = document.getElementById(canvasName);
            Console.numCols = numCols;
            Console.numRows = numRows;

            Console.ctx = canvas.getContext("2d");
//            Console.ctx.font = "bold 20px/20px monospace";
            Console.ctx.font = "15px monospace";
            Console.ctx.textBaseline = "top";

            Console.charWidth = Console.ctx.measureText("m").width;
            Console.charHeight = 20;
            canvas.width = Console.charWidth * numCols + 10;
            canvas.height = Console.charHeight * numRows + 10; 

            Console.buffer = document.createElement("canvas");
            Console.buffer.width = canvas.width;
            Console.buffer.height = canvas.height;

            Console.bufferCtx = Console.buffer.getContext("2d");
//            Console.bufferCtx.font = "bold 20px/20px monospace";
            Console.bufferCtx.font = "15px monospace";
            Console.bufferCtx.textBaseline = "top";

            Console.screen = new Array(numRows);
            for (var row = 0; row < numRows; row++)
               Console.screen[row] = new Array(numCols);

            Console.escPressed = false;
            Console.keyQueue = new Array();
            Console.cursorVisible = true;
            function keyDown(event)
            {
//alert("Down: keyCode = " + event.keyCode + ", charCode = " + event.charCode);
               if (Console.isChrome() || Console.isOpera() || Console.isSafari())
               {
                  if (event.keyCode == 8)
                  {
                     Console.keyQueue.push("\b");
                     event.preventDefault();
                  }
                  if (event.keyCode == 27)
                     Console.escPressed = true;
                  return;
               }
               if (Console.isFirefox())
               {
                  if (event.keyCode == 27)
                     Console.escPressed = true;
                  return;
               }
               if (Console.isIE())
               {
                  if (event.keyCode == 8)
                     Console.keyQueue.push("\b");
                  else
                  if (event.keyCode == 27)
                  {
                     Console.escPressed = true;
                     event.preventDefault();
                  }
                  return;
               }
            }
            canvas.addEventListener("keydown", keyDown, true);
            function keyPress(event)
            {
//alert("Press: keyCode = " + event.keyCode + ", charCode = " + event.charCode);
               if (Console.isChrome() || Console.isFirefox() || Console.isSafari())
               {
                  event.preventDefault();
                  if (event.keyCode == 8)
                  {
                     Console.keyQueue.push("\b");
                     return;
                  }
                  if (event.keyCode == 13) // return?
                  {
                     Console.keyQueue.push("\n");
                     return;
                  }
                  if (event.charCode != 0)
                     Console.keyQueue.push(String.fromCharCode(event.charCode))
                  return;
               }
               if (Console.isIE())
               {
                  if (event.keyCode == 13) // return?
                  {
                     Console.keyQueue.push("\n");
                     return;
                  }
                  if (event.charCode != 0)
                     Console.keyQueue.push(String.fromCharCode(event.charCode))
                  return;
               }
               if (Console.isOpera())
               {
                  event.preventDefault();
                  if (event.keyCode == 8)
                     return;
                  if (event.keyCode == 13) // return?
                  {
                     Console.keyQueue.push("\n");
                     return;
                  }
                  if (event.keyCode >= 32 && event.keyCode < 127)
                     Console.keyQueue.push(String.fromCharCode(event.keyCode))
                  return;
               }
            }
            canvas.addEventListener("keypress", keyPress, true);
            canvas.tabIndex = 0; // Place canvas in tab order.
            canvas.focus(); // Give keyboard focus to canvas. Doesn't work on 
                            // Internet Explorer.

            Console.cursorOn = true;
            Console.cursorCounter = 0;
            Console.cursorCounterMax = 5;

            Console.line = "";

            Console.cmds = new Array();

            Console.clear();
         },

   // =========================================================================
   // Return value of Console.escPressed and reset this Boolean flag to false. 
   // Console.escPressed is set to true in one of the key handlers registered 
   // in Console.init().
   //
   // Parameters:
   //
   // none
   //
   // Return value:
   // 
   // true when escape key pressed; otherwise, false
   // =========================================================================

   isEsc: function()
          {
             var temp = Console.escPressed;
             Console.escPressed = false;
             return temp;
          },

   // =========================================================================
   // Add line segment to current path.
   //
   // Parameters:
   //
   // x - x-coordinate of new position
   // y - y-coordinate of new position
   //
   // Return value:
   // 
   // none
   // =========================================================================

   lineTo: function(x, y)
           {
              Console.cmds.push({ id: Console.CMD_LINETO, x: x, y: y });
           },

   // =========================================================================
   // Measure text.
   //
   // Parameters:
   //
   // text - string of characters to be measured
   // font - font against which text is measured
   //
   // Return value:
   // 
   // none
   // =========================================================================

   measureText: function(text, font)
                {
                   var oldFont = Console.bufferCtx.font;
                   Console.bufferCtx.font = font;
                   var width = Console.bufferCtx.measureText(text).width;
                   Console.bufferCtx.font = oldFont;
                   return width;
                },

   // =========================================================================
   // Add move to position to current path.
   //
   // Parameters:
   //
   // x - x-coordinate of starting position
   // y - y-coordinate of starting position
   //
   // Return value:
   // 
   // none
   // =========================================================================

   moveTo: function(x, y)
           {
              Console.cmds.push({ id: Console.CMD_MOVETO, x: x, y: y });
           },

   // =========================================================================
   // Add quadratic curve to current path.
   //
   // Parameters:
   //
   // cpx - x-coordinate of control point
   // cpy - y-coordinate of control point
   // x   - x-coordinate of new position
   // y   - y-coordinate of new position
   //
   // Return value:
   // 
   // none
   // =========================================================================

   quadraticCurveTo: function(cpx, cpy, x, y)
                     {
                        Console.cmds.push({ id: Console.CMD_QUADRATICCURVETO, 
                                            cpx: cpx, cpy: cpy, x: x, y: y });
                     },

   // =========================================================================
   // Add rect to current path.
   //
   // Parameters:
   //
   // x      - x-coordinate of upper-left corner
   // y      - y-coordinate of upper-left corner
   // width  - width of rectangle
   // height - height of rectangle
   //
   // Return value:
   // 
   // none
   // =========================================================================

   rect: function(x, y, width, height)
         {
            Console.cmds.push({ id: Console.CMD_RECT, x: x, y: y, width: width,
                                height: height });
         },

   // =========================================================================
   // Set cursor position.
   //
   // Parameters:
   //
   // row - zero-based row
   // col - zero-based column
   //
   // Return value:
   // 
   // none
   // =========================================================================

   setCursorPos: function(row, col)
                 {
                    Console.row = row;
                    Console.col = col;
                    Console.render();
                 },

   // =========================================================================
   // Set fill style.
   //
   // Parameters:
   //
   // red - red value (0 - 255)
   // grn - green value (0 - 255)
   // blu - blue value (0 - 255)
   //
   // Return value:
   // 
   // none
   // =========================================================================

   setFillStyle: function(red, grn, blu)
                 {
                    Console.cmds.push({ id: Console.CMD_SETFILLSTYLE, red: red, 
                                        grn: grn, blu: blu });
                 },

   // =========================================================================
   // Set fill style with alpha.
   //
   // Parameters:
   //
   // red   - red value (0 - 255)
   // grn   - green value (0 - 255)
   // blu   - blue value (0 - 255)
   // alpha - alpha value (0.0 - 1.0) -- 0.0 is transparent
   //
   // Return value:
   // 
   // none
   // =========================================================================

   setFillStyle2: function(red, grn, blu, alpha)
                  {
                     Console.cmds.push({ id: Console.CMD_SETFILLSTYLE2, 
                                         red: red, grn: grn, blu: blu, 
                                         alpha: alpha });
                  },

   // =========================================================================
   // Set font.
   //
   // Parameters:
   //
   // font - string containing CSS-based font information
   //
   // Return value:
   // 
   // none
   // =========================================================================

   setFont: function(font)
            {
               Console.cmds.push({ id: Console.CMD_SETFONT, font: font });
            },

   // =========================================================================
   // Set line width.
   //
   // Parameters:
   //
   // width - line width
   //
   // Return value:
   // 
   // none
   // =========================================================================

   setLineWidth: function(width)
                 {
                    Console.cmds.push({ id: Console.CMD_LINEWIDTH, 
                                        width: width }); 
                 },

   // =========================================================================
   // Set stroke style.
   //
   // Parameters:
   //
   // red - red value (0 - 255)
   // grn - green value (0 - 255)
   // blu - blue value (0 - 255)
   //
   // Return value:
   // 
   // none
   // =========================================================================

   setStrokeStyle: function(red, grn, blu)
                   {
                      Console.cmds.push({ id: Console.CMD_SETSTROKESTYLE, 
                                          red: red, grn: grn, blu: blu });
                   },

   // =========================================================================
   // Set stroke style with alpha.
   //
   // Parameters:
   //
   // red   - red value (0 - 255)
   // grn   - green value (0 - 255)
   // blu   - blue value (0 - 255)
   // alpha - alpha value (0.0 - 1.0) -- 0.0 is transparent
   //
   // Return value:
   // 
   // none
   // =========================================================================

   setStrokeStyle2: function(red, grn, blu, alpha)
                    {
                       Console.cmds.push({ id: Console.CMD_SETSTROKESTYLE2, 
                                           red: red, grn: grn, blu: blu,
                                           alpha: alpha });
                    },


   // =========================================================================
   // Show the cursor.
   //
   // Parameters:
   //
   // none
   //
   // Return value:
   // 
   // none
   // =========================================================================

   showCursor: function()
               {
                  Console.cursorVisible = true;
               },

   // =========================================================================
   // Stroke the current path.
   //
   // Parameters:
   //
   // none
   //
   // Return value:
   //
   // none
   // =========================================================================

   stroke: function()
           {
              Console.cmds.push({ id: Console.CMD_STROKE });
           },

   // =========================================================================
   // Stroke rectangle.
   //
   // Parameters:
   //
   // x      - x-coordinate of upper-left corner
   // y      - y-coordinate of upper-left corner
   // width  - width of rectangle
   // height - height of rectangle
   //
   // Return value:
   //
   // none
   // =========================================================================

   strokeRect: function(x, y, width, height)
               {
                  Console.cmds.push({ id: Console.CMD_STROKERECT, x: x, y: y, 
                                      width: width, height: height });
               },

   // =========================================================================
   // Stroke text.
   //
   // Parameters:
   //
   // text - text to be stroked
   // x    - x-coordinate of leftmost character
   // y    - y-coordinate of leftmost character 
   //
   // Return value:
   //
   // none
   // =========================================================================

   strokeText: function(text, x, y)
               {
                  Console.cmds.push({ id: Console.CMD_STROKETEXT, text: text,
                                      x: x, y: y });
               },

   // =========================================================================
   // WARNING: The rest of the function properties in this namespace should be
   // considered private and may change in a future version of this library. If
   // your code depends upon them, it will break. Also, properties added to 
   // Console in init() (e.g., cursorOn and screen) should be considered 
   // private and may change in a future version. Don't access them!
   // =========================================================================

   CMD_ARC: 0,
   CMD_BEGINPATH: 1,
   CMD_BEZIERCURVETO: 2,
   CMD_CLEARRECT: 3,
   CMD_CLOSEPATH: 4,
   CMD_FILL: 5,
   CMD_FILLRECT: 6,
   CMD_FILLTEXT: 7,
   CMD_LINETO: 8,
   CMD_MOVETO: 9,
   CMD_QUADRATICCURVETO: 10,
   CMD_RECT: 11,
   CMD_SETFILLSTYLE: 12,
   CMD_SETFILLSTYLE2: 13,
   CMD_SETFONT: 14,
   CMD_SETLINEWIDTH: 15,
   CMD_SETSTROKESTYLE: 16,
   CMD_SETSTROKESTYLE2: 17,
   CMD_STROKE: 18,
   CMD_STROKERECT: 19,
   CMD_STROKETEXT: 20,

   // The following function is private and should not be called.

   isChrome: function()
             {
                return navigator.userAgent.indexOf("Chrome/") != -1;
             },

   // The following function is private and should not be called.

   isFirefox: function()
              {
                return navigator.userAgent.indexOf("Firefox/") != -1;
              },

   // The following function is private and should not be called.

   isIE: function()
         {
            return navigator.userAgent.indexOf("MSIE") != -1;
         },

   // The following function is private and should not be called.

   isOpera: function()
            {
               return navigator.userAgent.indexOf("Opera") != -1;
            },

   // The following function is private and should not be called.

   isSafari: function()
             {
                return navigator.userAgent.indexOf("Safari") != -1;
             },

   // The following function is private and should not be called.

   render: function()
           {
              Console.bufferCtx.fillStyle = "#000"; // black
              Console.bufferCtx.fillRect(0, 0, Console.ctx.canvas.width, 
                                         Console.ctx.canvas.height);
              for (var i = 0; i < Console.cmds.length; i++)
              {
                  var cmd = Console.cmds[i];
                  switch (cmd.id)
                  {
                     case Console.CMD_ARC:
                          Console.bufferCtx.arc(cmd.x, cmd.y, cmd.radius,
                                                cmd.sa, cmd.ea, cmd.cw);
                          break;

                     case Console.CMD_BEGINPATH:
                          Console.bufferCtx.beginPath();
                          break;

                     case Console.CMD_BEZIERCURVETO:
                          Console.bufferCtx.bezierCurveTo(cmd.cpx1, cmd.cpy1,
                                                          cmd.cpx2, cmd.cpy2,
                                                          cmd.x, cmd.y);
                          break;

                     case Console.CMD_CLEARRECT:
                          Console.bufferCtx.clearRect(cmd.x, cmd.y, cmd.width,
                                                      cmd.height);
                          break;

                     case Console.CMD_CLOSEPATH:
                          Console.bufferCtx.closePath();
                          break;

                     case Console.CMD_FILL:
                          Console.bufferCtx.fill();
                          break;

                     case Console.CMD_FILLRECT:
                          Console.bufferCtx.fillRect(cmd.x, cmd.y, cmd.width,
                                                     cmd.height);
                          break;

                     case Console.CMD_FILLTEXT:
                          Console.bufferCtx.fillText(cmd.text, cmd.x, cmd.y);
                          break;

                     case Console.CMD_LINETO:
                          Console.bufferCtx.lineTo(cmd.x, cmd.y);
                          break;

                     case Console.CMD_MOVETO:
                          Console.bufferCtx.moveTo(cmd.x, cmd.y);
                          break;

                     case Console.CMD_QUADRATICCURVETO:
                          Console.bufferCtx.quadraticCurveTo(cmd.cpx, cmd.cpy,
                                                             cmd.x, cmd.y);
                          break;

                     case Console.CMD_RECT:
                          Console.bufferCtx.rect(cmd.x, cmd.y, cmd.width, 
                                                 cmd.height);
                          break;

                     case Console.CMD_SETFILLSTYLE:
                          Console.bufferCtx.fillStyle = "rgb(" + cmd.red + "," +
                                                        cmd.grn + "," +
                                                        cmd.blu + ")";
                          break;

                     case Console.CMD_SETFILLSTYLE2:
                          Console.bufferCtx.fillStyle = "rgba(" + cmd.red + "," +
                                                        cmd.grn + "," +
                                                        cmd.blu + "," +
                                                        cmd.alpha + ")";
                          break;

                     case Console.CMD_SETFONT:
                          Console.bufferCtx.font = cmd.font;
                          break;

                     case Console.CMD_SETLINEWIDTH:
                          Console.bufferCtx.lineWidth = cmd.width;
                          break;

                     case Console.CMD_SETSTROKESTYLE:
                          Console.bufferCtx.strokeStyle = "rgb(" + cmd.red + 
                                                          "," + cmd.grn + "," +
                                                          cmd.blu + ")";
                          break;

                     case Console.CMD_SETSTROKESTYLE2:
                          Console.bufferCtx.strokeStyle = "rgba(" + cmd.red + 
                                                          "," + cmd.grn + "," +
                                                          cmd.blu + "," +
                                                          cmd.alpha + ")";
                          break;

                     case Console.CMD_STROKE:
                          Console.bufferCtx.stroke();
                          break;

                     case Console.CMD_STROKERECT:
                          Console.bufferCtx.strokeRect(cmd.x, cmd.y, cmd.width,
                                                       cmd.height);
                          break;

                     case Console.CMD_STROKETEXT:
                          Console.bufferCtx.strokeText(cmd.text, cmd.x, cmd.y);
                  }
              }
              Console.bufferCtx.fillStyle = "#0f0"; // green
//              Console.bufferCtx.font = "bold 20px/20px monospace";
              Console.bufferCtx.font = "15px monospace";
                var y = 0;
              for (var row = 0; row < Console.numRows; row++)
              {
                 var x = 0;
                 for (var col = 0; col < Console.numCols; col++)
                 {
                     var s = Console.screen[row][col];
                     if (s != " ")
                        Console.bufferCtx.fillText(s, x + 5, y + 5);
                     x += Console.charWidth;
                 }
                 y += Console.charHeight;
              }
              if (Console.cursorOn)
                 Console.bufferCtx.fillStyle = "#0f0"; // green
              else
                 Console.bufferCtx.fillStyle = "#000"; // black
              if (Console.cursorVisible)
                 Console.bufferCtx.fillText("_", 
                                            Console.col * Console.charWidth + 5,
                                            Console.row * Console.charHeight 
                                            + 5);
              if (++Console.cursorCounter == Console.cursorCounterMax)
              {
                 Console.cursorCounter = 0;
                 Console.cursorOn = !Console.cursorOn;
              }
              Console.ctx.drawImage(Console.buffer, 0, 0);
           },

   // The following function is private and should not be called.

   writeChar: function(ch)
              {
                 if (ch == "\b")
                 {
                    if (Console.col == 0 && Console.row == 0)
                       return; // cannot backspace past the upper-left corner
                    Console.col--;
                    if (Console.col < 0)
                    {
                       Console.col = Console.numCols - 1; 
                       Console.row--;
                    }
                    Console.screen[Console.row][Console.col] = " ";
                    return;
                 }
                 if (ch == "\n")
                 {
                    Console.col = 0;
                    if (++Console.row >= Console.numRows)
                       Console.scroll();
                    return;
                 }
                 if (Console.col == Console.numCols)
                 {
                    Console.col = 0;
                    if (++Console.row >= Console.numRows)
                       Console.scroll();
                 }          
                 Console.screen[Console.row][Console.col] = ch;
                 ++Console.col;
              },

   // The following function is private and should not be called.

   scroll: function()
           {
              Console.row = Console.numRows - 1;
              for (var row = 0; row < Console.numRows - 1; row++)
                  for (var col = 0; col < Console.numCols; col++)
                     Console.screen[row][col] = Console.screen[row + 1][col];
              for (var col = 0; col < Console.numCols; col++)
                 Console.screen[Console.numRows - 1][col] = " ";
           }
}