# Topic Mapping Interface - Page Layout doc.

- [Page Layouts](#page-layouts)
- [Controls Definition](#controls-definition)

## Page Layouts

There are currently 10 layouts available. The layouts are typically identified with a capital letter, definining the number of panels, and an optional small case letter (for size or position variants).

The layouts consider a 12x12 grid for a normal dashboard (common horizontal windows). In case of a vertical window, the layouts will be rendered in column, in a 6x24 grid.

### Layout A

Layout A is a simply 1 panel, taking the full available space. Exceptionally, unlike other layouts, its column version is a 6x12 grid.
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

### Layout Ba
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

### Layout Bb
```
+--------------++------+
|              ||      |
|      1       ||   2  |
|              ||      |
|              ||      |
+--------------++------+

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

### Layout Ca
```
+----------++----------+
|          ||    2     |
|     1    |+----------+
|          |+----------+
|          ||    3     |
+----------++----------+

+----------+
|          |
|    1     |
|          |
|          |
+----------+
+----------+
|    2     |
+----------+
+----------+
|    3     |
+----------+
```

### Layout Cb
```
+--------------++------+
|              ||  2   |
|       1      |+------+
|              |+------+
|              ||  3   |
+--------------++------+

+----------+
|          |
|    1     |
|          |
|          |
+----------+
+----------+
|    2     |
+----------+
+----------+
|    3     |
+----------+
```

### Layout Da
```
+----------++----------+
|          ||     2    |
|     1    |+----------+
|          |+----++----+
|          ||  3 || 4  |
+----------------++----+

+----------+
|          |
|    1     |
|          |
|          |
+----------+
+----------+
|    2     |
+----------+
+----++----+
|  3 || 4  |
+----++----+
```

### Layout Db
```
+----------++----++----+
|          ||  2 ||  3 |
|     1    |+----++----+
|          |+----------+
|          ||    4     |
+----------------------+

+----------+
|          |
|    1     |
|          |
|          |
+----------+
+----++----+
|  2 || 3  |
+----++----+
+----------+
|    4     |
+----------+
```

### Layout E
```
+----------++----++----+
|          ||  2 ||  3 |
|     1    |+----++----+
|          |+----++----+
|          ||  4 ||  5 |
+----------------++----+

+----------+
|          |
|    1     |
|          |
|          |
+----------+
+----++----+
|  2 || 3  |
+----++----+
+----++----+
|  4 || 5  |
+----++----+
```

### Layout Fa
```
+------++------++------+
|   1  ||   2  ||   3  |
+------++------++------+
+------++------++------+
|   4  ||   5  ||   6  |
+------++------++------+

+----++----+
|  1 || 2  |
+----++----+
+----++----+
|  3 || 4  |
+----++----+
+----++----+
|  5 || 6  |
+----++----+
```

### Layout Fb
```
+------++------++------+
|   1  ||   2  ||   5  |
+------++------++------+
+------++------++------+
|   3  ||   4  ||   6  |
+------++------++------+

+----++----+
|  1 || 2  |
+----++----+
+----++----+
|  3 || 4  |
+----++----+
+----++----+
|  5 || 6  |
+----++----+
```

## Controls Definition

The controls are defined with one string.

The first part of the string defines the number of controls, between `0` and `4` (included).
- **The string should not be empty.**
- **The number should not exceed 4.**

Then the string defines the size (in columns) of each controls. For example: `'1-3'` means 1 control spaning 3 columns, `'2-4-8'` means 2 controls, the first spaning 4 columns and the second 8.
- **Each control should have a size specified.**
- **The controls can only span 12 columns in total.**

If the page is rendered on a column format, the controls will be rendered in two rows of 6 columns.

The last part of the string defines how the controls should be aligned horizontally:
- `'...-l'`: left align
- `'...-r'`: right align
- `'...-c'`: center
- `'...-b'`: space between (spread)
- `'...-a'`: space around (spread with padding)

This part is optional and will default to left aligned.