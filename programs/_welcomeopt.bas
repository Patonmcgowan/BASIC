REM ==============
REM WELCOMEOPT.BAS
REM ==============
cls
cursor off
graphics sss 0 0 255
dim i, bdwidth = 10
for i = 0 to bdwidth - 1
dim v = 2 * i
graphics sr i i screen(2) - v screen(3) - v
graphics u
next
dim limit = 200
dim width = screen(2), height = screen(3)
for i = 0 to limit step 10
graphics sss rnd(256) rnd(256) rnd(256)
graphics bp
dim a = height - bdwidth - limit + i
dim b = width - bdwidth
dim c = height - bdwidth
dim d = bdwidth + limit - i
dim e = bdwidth + i
dim f = b - i
graphics mt bdwidth a lt e c mt b a lt f c mt bdwidth d lt e bdwidth mt b d lt f bdwidth s u
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
