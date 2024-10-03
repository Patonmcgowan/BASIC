' My little BASIC subroutine program
'
' Written 8 Feb 2020 by Michael Scott
'
' This program proves the use of indents, blank lines, comments

dim i             ' Test comment
dim j
dim k

for j = 1 to 10   ' Test comment
  for k = 1 to 10
    call doIt     ' Call the subroutine
  next            ' Test comment
  print i;        ' Another test comment
next
print
end               ' Test comment

' A subroutine
doIt:             ' Test comment
  i = i + 1       ' Test comment
return            ' Test comment
