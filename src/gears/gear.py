from turtle import *
import math


toothWidth = 10
toothHeight = 15
radius = 60
innerRadius = radius - toothHeight
nTeeth = 14

points = []
(x, y) = (innerRadius, 0)
placement = 0
deg = 360/(2*nTeeth)
inner = True
curDeg = 0
while curDeg < (deg*2*nTeeth):
    point = [None, None]
    if inner:
        if placement == 1:
            curDeg += deg
            inner = False
        radians = curDeg*math.pi/180
        x = innerRadius * math.cos(radians)
        y = innerRadius * math.sin(radians)
        point = [x, y]
    else:
        if placement == 3:
            curDeg += deg
            inner = True
        radians = curDeg*math.pi/180
        x = radius * math.cos(radians)
        y = radius * math.sin(radians)
        point = [x, y]
    placement += 1
    if placement == 4:
        placement = 0
    points.append(point)



(x, y) = points[0]
pu()
goto(x,y)
pd()
[goto(x, y) for (x, y) in points[1:]]
pu()
done()

