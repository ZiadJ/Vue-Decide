#import pylab as plt
import matplotlib.pyplot as plt
import numpy as np
from math import *


def find_center(p1, p2, angle):
    # End points of the chord
    x1, y1 = p1 
    x2, y2 = p2 

    # Slope of the line through the chord
    slope = 999999 if x1 == x2 else (y1-y2)/(x1-x2)

    # Slope of a line perpendicular to the chord
    p_slope = -999999 if slope == 0 else -1/slope

    # Point on the line perpendicular to the chord
    # Note that this line also passes through the center of the circle
    xm, ym = (x1+x2)/2, (y1+y2)/2

    # Distance between p1 and p2
    d_chord = sqrt((x1-x2)**2 + (y1-y2)**2)

    # Distance between xm, ym and center of the circle (xc, yc)
    d_perp = d_chord/(2*tan(angle))

    # Equation of line perpendicular to the chord: y-ym = new_slope(x-xm)
    # Distance between xm,ym and xc, yc: (yc-ym)^2 + (xc-xm)^2 = d_perp^2
    # Substituting from 1st to 2nd equation for y,
    #   we get: (new_slope^2+1)(xc-xm)^2 = d^2

    # Solve for xc:
    xc = (d_perp)/sqrt(p_slope**2+1) + xm

    # Solve for yc:
    yc = (p_slope)*(xc-xm) + ym

    return xc, yc




if __name__=='__main__':
    p1 = [0, 0]
    p2 = [1, 0]
    angle = 90 * pi/180
    xc, yc = find_center(p1, p2,angle)

    # Calculate the radius and draw a circle
    r = sqrt((xc-p1[0])**2 + (yc-p1[1])**2)
    cir = plt.Circle((xc,yc), radius=r,  fc='y')
    plt.gca().add_patch(cir)

    # mark p1 and p2 and the center of the circle
    plt.plot(p1[0], p1[1], 'ro')
    plt.plot(p2[0], p2[1], 'ro')
    plt.plot(xc, yc, 'go')

    plt.show()



""" 
var findCenter = function(p1.x, p1.y, p2.x, p2.y, angle) {

var slope = p1.y === p2.y ? 99999999 : (p1.y - p2.y) / (p1.x - p2.x);

// Slope of a line perpendicular to the chord
var p_slope = slope === 0 ? -9999999 : -1 / slope;

// Point on the line perpendicular to the chord
// Note that this line also passes through the center of the circle
var xm = (p1.x + p2.x) / 2;
var ym = (p1.y + p2.y) / 2;

// Distance between Anchor1 and Anchor2
var d_chord = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

// Distance between xm, ym and center of the circle (xc, yc)
var d_perp = d_chord / (2 * Math.tan(angle * (Math.PI / 180)));

// Equation of line perpendicular to the chord: y-ym = p_slope(x-xm)
// Distance between xm,ym and xc, yc: (yc-ym)^2 + (xc-xm)^2 = d_perp^2
// Substituting from 1st to 2nd equation for y,
//   we get: (p_slope^2+1)(xc-xm)^2 = d^2
var xc = (d_perp / Math.sqrt(Math.pow(p_slope, 2) + 1) + xm).toFixed(2);

// yc = (p_slope)*(xc-xm)+ym
var yc = (p_slope * (xc - xm) + ym).toFixed(2);

var radius = Math.hypot(p1.x - xc, p1.y - yc).toFixed(2);

return {
    xc,
    yc,
    radius
};
}

console.log(findCenter(0, 1, 1, 1, 10));
"""