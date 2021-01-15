# Topic Mapping Interface - Page Layout doc.

- [Page Layouts](#page-layouts)
- [Controls Definition](#controls-definition)

## Page Layouts

There are currently 10 layouts available. The layouts are typically identified with a capital letter, definining the number of panels, and an optional small case letter (for size or position variants).

The layouts consider a 12x12 grid for a normal dashboard (common horizontal windows). In case of a vertical window, the layouts will be rendered in column, in a 6x24 grid.

### Layout A

Layout A is a simply 1 panel, taking the full available space. Exceptionally, unlike other layouts, it's column version is a 6x12 grid.
```
+----------------------+
|                      |
|          1           |
|                      |
|                      |
+----------------------+

+----------+
|          |
|    1     |
|          |
|          |
+----------+
```

### Layout B

#### Layout Ba
```
+----------++----------+
|          ||          |
|     1    ||     2    |
|          ||          |
|          ||          |
+----------++----------+

+----------+
|          |
|    1     |
|          |
|          |
+----------+
+----------+
|          |
|    2     |
|          |
|          |
+----------+
```
layout Bb:
+--------------++------+
|              ||      |
|        1     ||   2  |
|              ||      |
|              ||      |
+--------------++------+

## Controls Definition