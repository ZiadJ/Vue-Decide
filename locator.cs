using System;
using System.Linq;
using System.Collections.Generic;

class Program
{
    // Assign fixed anchor points used for location
    static List<Vector2> AnchorPoints = new List<Vector2> {
        new Vector2(0, 0), // Point 1
        new Vector2(0, 1), // Point 2
        new Vector2(1, 1), // Point 3
        new Vector2(1, 0)  // Point 4
    };

    // Assign angles between the chords to the anchor points from the unknown location
    static List<float> AnchorAngles = new List<float> {
        90, // Angle between point 1 & 2
        90, // Angle between point 2 & 3
        91  // Angle between point 3 & 4
    };

    static void Main(string[] args)
    {
        var locator = new CircleLocator(AnchorPoints);
        locator.UpdateLocation(AnchorAngles);
    }
}


public class NavigationMath
{
    // Calculate the center of a circle given two points on it making an angle with the center of the circle
    public static Vector2 GetCenter(Vector2 p1, Vector2 p2, float angle)
    {
        // Slope of the line through the chord(defaults to 999999 when p1.y = p2.y)
        var slope = p1.y == p2.y
            ? 999999
            : (p1.y - p2.y) / (p1.x - p2.x);

        // Slope of perpendicular to chord(defaults to 999999 when slope = 0)
        var p_slope = slope == 0
            ? -999999
            : -1 / slope;

        // Point on the line perpendicular to the chord
        // Note that this line also passes through the center of the circle
        var xm = (p1.x + p2.x) / 2;
        var ym = (p1.y + p2.y) / 2;

        // Distance between Anchor1 and Anchor2
        var d_chord = sqrt(sqr(p1.x - p2.x) + sqr(p1.y - p2.y));

        // Distance between xm, ym and center of the circle (xc, yc)
        var d_perp = d_chord / (2 * tan(angle * Math.PI / 180));

        // Equation of line perpendicular to the chord: y-ym = p_slope(x-xm)
        // Distance between xm,ym and xc, yc: (yc-ym)^2 + (xc-xm)^2 = d_perp^2
        // Substituting from 1st to 2nd equation for y,
        //   we get: (p_slope^2+1)(xc-xm)^2 = d^2
        // Solve for xc:
        var xc = (float)(d_perp / sqrt(sqr(p_slope) + 1) + xm);
        // Solve for yc:
        float yc = p_slope * (xc - xm) + ym;

        return new Vector2(xc, yc);
    }

    // Calculate the intersection of two circles given their center location(c0 & c1) and radius(r1 & r2)
    public static int GetCircleIntersection(Vector2 c0, float r0, Vector2 c1, float r1, out Vector2 intersection1, out Vector2 intersection2)
    {
        // Find the distance between the centers
        var dx = c0.x - c1.x;
        var dy = c0.y - c1.y;
        var dist = sqrt(dx * dx + dy * dy);

        if (abs(dist - (r0 + r1)) < 0.00001)
        {
            intersection1 = Vector2.Lerp(c0, c1, r0 / (r0 + r1));
            intersection2 = intersection1;
            return 1;
        }

        // See how many solutions there are
        if (dist > r0 + r1)
        {
            // No solutions, the circles are too far apart
            intersection1 = new Vector2(float.NaN, float.NaN);
            intersection2 = new Vector2(float.NaN, float.NaN);
            return 0;
        }
        else if (dist < abs(r0 - r1))
        {
            // No solutions, one circle contains the other
            intersection1 = new Vector2(float.NaN, float.NaN);
            intersection2 = new Vector2(float.NaN, float.NaN);
            return 0;
        }
        else if ((dist == 0) && (r0 == r1))
        {
            // No solutions, the circles coincide
            intersection1 = new Vector2(float.NaN, float.NaN);
            intersection2 = new Vector2(float.NaN, float.NaN);
            return 0;
        }
        else
        {
            // Find a and h
            var a = (r0 * r0 -
                        r1 * r1 + dist * dist) / (2 * dist);
            var h = sqrt(r0 * r0 - a * a);

            // Find Anchor2
            var cx2 = c0.x + a * (c1.x - c0.x) / dist;
            var cy2 = c0.y + a * (c1.y - c0.y) / dist;

            // Get the points P3
            intersection1 = new Vector2(
                cx2 + h * (c1.y - c0.y) / dist,
                cy2 - h * (c1.x - c0.x) / dist
            );

            intersection2 = new Vector2(
                cx2 - h * (c1.y - c0.y) / dist,
                cy2 + h * (c1.x - c0.x) / dist
            );

            return 2;
        }
    }

    public static float GetDistance(Vector2 point1, Vector2 point2)
    {
        return (float)sqrt(sqr(point1.x - point2.x) + sqr(point1.y - point2.y));
    }

    public static double tan(double angle) { return Math.Tan(angle); }
    public static double sqr(double angle) { return Math.Pow(angle, 2); }
    public static double sqrt(double angle) { return Math.Sqrt(angle); }
    public static double abs(double angle) { return Math.Abs(angle); }
}


public class Vector2
{
    public float x;
    public float y;

    public Vector2(float _x, float _y) { x = _x; y = _y; }
    public Vector2(double _x, double _y) { x = (float)_x; y = (float)_y; }

    public static Vector2 Lerp(Vector2 value1, Vector2 value2, float amount)
    {
        return new Vector2(
            value1.x + (value2.x - value1.x) * amount,
            value1.y + (value2.y - value1.y) * amount);
    }
}


public class CircleLocation
{
    public Vector2 Anchor1;
    public Vector2 Anchor2;
    public float Angle;

    public Vector2 Center;
    public float Radius;

    public CircleLocation(Vector2 anchor1, Vector2 anchor2)
    {
        Anchor1 = anchor1;
        Anchor2 = anchor2;
    }

    public void UpdateCenter(float angle)
    {
        Angle = angle;
        Center = NavigationMath.GetCenter(Anchor1, Anchor2, angle);
        Radius = NavigationMath.GetDistance(Anchor1, Center);
    }
}


public class CircleLocator
{
    public Vector2 Min = new Vector2(0, 0);
    public Vector2 Max = new Vector2(0, 0);

    public List<CircleLocation> CircleLocations = new List<CircleLocation>();

    public List<Vector2> Locations = new List<Vector2>();

    public CircleLocator(List<Vector2> referencePoints)
    {
        if (referencePoints.Count <= 1)
            return;

        for (var i = 0; i < referencePoints.Count - 1; i++)
        {
            CircleLocations.Add(new CircleLocation(referencePoints[i], referencePoints[i + 1]));
        }

        Min.x = referencePoints.Select(p => p.x).Min();
        Min.y = referencePoints.Select(p => p.y).Min();
        Max.x = referencePoints.Select(p => p.x).Max();
        Max.y = referencePoints.Select(p => p.y).Max();

        foreach (var refPoint in referencePoints)
            Locations.Add(new Vector2(0, 0));
    }

    public bool IsWithinBounds(Vector2 point)
    {
        return (point.x > Min.x && point.x < Max.x)
            && (point.y > Min.y && point.y < Max.y);
    }

    private Vector2 l1, l2;

    public void UpdateLocation(List<float> angles)
    {

        Console.WriteLine("Number of anchor points: " + Locations.Count);
        Console.WriteLine("");

        var c = CircleLocations;

        for (var i = 0; i < CircleLocations.Count; i++)
        {
            c[i].UpdateCenter(angles[i]);

            if (i > 0)
            {
                var result = NavigationMath.GetCircleIntersection(
                    c[i].Center, c[i].Radius,
                    c[i - 1].Center, c[i - 1].Radius, out l1, out l2);

                if (result < 2)
                {
                    Console.WriteLine("{0}. No intersection was found for angles {1} and {2}",
                        i,
                        c[i - 1].Angle,
                        c[i].Angle);
                    continue;
                }

                if (IsWithinBounds(l1))
                    Locations[i - 1] = l1;
                else
                    Locations[i - 1] = l2;

                Console.WriteLine("{0}. Location from angles {1} & {2}:  [{3}, {4}]",
                    i,
                    c[i - 1].Angle,
                    c[i].Angle,
                    Math.Round(Locations[i - 1].x, 3),
                    Math.Round(Locations[i - 1].y, 3));
                Console.WriteLine("");
            }
        }
    }
}