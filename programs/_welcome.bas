REM ===========
REM WELCOME.BAS
REM ===========
cls
cursor off
graphics sss 0 0 255
dim i, bdwidth = 10
for i = 0 to bdwidth - 1
graphics sr i i screen(2) - 2 * i screen(3) - 2 * i
graphics u
next
dim limit = 200
dim width = screen(2), height = screen(3)
for i = 0 to limit step 10
graphics sss rnd(256) rnd(256) rnd(256)
graphics bp
graphics mt bdwidth height - bdwidth - limit + i
graphics lt bdwidth + i height - bdwidth
graphics mt width - bdwidth height - bdwidth - limit + i
graphics lt width - bdwidth - i height - bdwidth
graphics mt bdwidth bdwidth + limit - i
graphics lt bdwidth + i bdwidth
graphics mt width - bdwidth bdwidth + limit - i
graphics lt width - bdwidth - i bdwidth
graphics s
graphics u
next
graphics sfs 255 0 0 sss 255 255 0
graphics sf \"60px Arial\"
dim s$ = \"Welcome to Browser BASIC 1.0\"
dim w
graphics mtx s$ \"60px Arial\" w
graphics ft s$ (width - w) / 2 240
graphics st s$ (width - w) / 2 240
while inkey$ = \"\"
endwhile
cls
