Notion provides a vast array of functions capable of some extremely powerful stuffs.

The table below provides description of all the functions notion provides.

## abs

Returns the absolute value of a number

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(number)`|`number`|`abs(1)` | `null`|

## add

Adds two numbers and returns their sum, or concatenates two strings.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(text,text)`|`text`|`add("text", "text")` | `"text" + "text"`|
|`(number,number)`|`number`|`add(1, 1)` | `1 + 1`|

## and

Returns the logical AND of its two arguments.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(checkbox,checkbox)`|`checkbox`|`and(true, true)` | `true and true`|

## cbrt

Returns the cube root of a number.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(number)`|`number`|`cbrt(1)` | `null`|

## ceil

Returns the smallest integer greater than or equal to a number.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(number)`|`number`|`ceil(1)` | `null`|

## concat

Concatenates its arguments and returns the result.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(text)`|`text`|`concat("text")` | `null`|

## contains

Returns true if the second argument is found in the first.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(text,text)`|`checkbox`|`contains("text", "text")` | `null`|

## date

Returns an integer number, between 1 and 31, corresponding to day of the month for the given.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(date)`|`number`|`date(now())` | `null`|

## dateAdd

Add to a date. The last argument, unit, can be one of: "years", "quarters", "months", "weeks", "days", "hours", "minutes", "seconds", or "milliseconds".

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(date,number,text)`|`date`|`dateAdd(now(), 1, "seconds")` | `null`|

## dateBetween

Returns the time between two dates. The last argument, unit, can be one of: "years", "quarters", "months", "weeks", "days", "hours", "minutes", "seconds", or "milliseconds".

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(date,date,text)`|`number`|`dateBetween(now(), now(), "seconds")` | `null`|

## dateSubtract

Subtract from a date. The last argument, unit, can be one of: "years", "quarters", "months", "weeks", "days", "hours", "minutes", "seconds", or "milliseconds".

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(date,number,text)`|`date`|`dateSubtract(now(), 1, "seconds")` | `null`|

## day

Returns an integer number corresponding to the day of the week for the given date: 0 for Sunday, 1 for Monday, 2 for Tuesday, and so on.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(date)`|`number`|`day(now())` | `null`|

## divide

Divides two numbers and returns their quotient.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(number,number)`|`number`|`divide(1, 1)` | `1 / 1`|

## empty

Tests if a value is empty.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(text)`|`checkbox`|`empty("text")` | `null`|
|`(number)`|`checkbox`|`empty(1)` | `null`|
|`(checkbox)`|`checkbox`|`empty(true)` | `null`|
|`(date)`|`checkbox`|`empty(now())` | `null`|

## end

Returns the end of a date range.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(date)`|`date`|`end(now())` | `null`|

## equal

Returns true if its arguments are equal, and false otherwise.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(number,number)`|`checkbox`|`equal(1, 1)` | `1 == 1`|
|`(text,text)`|`checkbox`|`equal("text", "text")` | `"text" == "text"`|
|`(checkbox,checkbox)`|`checkbox`|`equal(true, true)` | `true == true`|
|`(date,date)`|`checkbox`|`equal(now(), now())` | `now() == now()`|

## exp

Returns E^x, where x is the argument, and E is Euler's constant (2.718…), the base of the natural logarithm.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(number)`|`number`|`exp(1)` | `null`|

## floor

Returns the largest integer less than or equal to a number.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(number)`|`number`|`floor(1)` | `null`|

## format

Formats its argument as a string.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(text)`|`text`|`format("text")` | `null`|
|`(date)`|`text`|`format(now())` | `null`|
|`(number)`|`text`|`format(1)` | `null`|
|`(checkbox)`|`text`|`format(true)` | `null`|

## formatDate

Format a date using the Moment standard time format string.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(date,text)`|`text`|`formatDate(now(), "text")` | `null`|

## fromTimestamp

Returns a date constructed from a Unix millisecond timestamp, corresponding to the number of milliseconds since January 1, 1970.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(number)`|`date`|`fromTimestamp(1)` | `null`|

## hour

Returns an integer number, between 0 and 23, corresponding to hour for the given date.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(date)`|`number`|`hour(now())` | `null`|

## if

Switches between two options based on another value.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(checkbox,number,number)`|`number`|`if(true, 1, 1)` | `null`|
|`(checkbox,text,text)`|`text`|`if(true, "text", "text")` | `null`|
|`(checkbox,checkbox,checkbox)`|`checkbox`|`if(true, true, true)` | `null`|
|`(checkbox,date,date)`|`date`|`if(true, now(), now())` | `null`|

## join

Inserts the first argument between the rest and returns their concatenation.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(text)`|`text`|`join("text")` | `null`|

## larger

Returns true if the first argument is larger than the second.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(number,number)`|`checkbox`|`larger(1, 1)` | `1 > 1`|
|`(text,text)`|`checkbox`|`larger("text", "text")` | `"text" > "text"`|
|`(checkbox,checkbox)`|`checkbox`|`larger(true, true)` | `true > true`|
|`(date,date)`|`checkbox`|`larger(now(), now())` | `now() > now()`|

## largerEq

Returns true if the first argument is larger than or equal to than the second.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(number,number)`|`checkbox`|`largerEq(1, 1)` | `1 >= 1`|
|`(text,text)`|`checkbox`|`largerEq("text", "text")` | `"text" >= "text"`|
|`(checkbox,checkbox)`|`checkbox`|`largerEq(true, true)` | `true >= true`|
|`(date,date)`|`checkbox`|`largerEq(now(), now())` | `now() >= now()`|

## length

Returns the length of a string.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(text)`|`number`|`length("text")` | `null`|

## ln

Returns the natural logarithm of a number.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(number)`|`number`|`ln(1)` | `null`|

## log10

Returns the base 10 logarithm of a number.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(number)`|`number`|`log10(1)` | `null`|

## log2

Returns the base 2 logarithm of a number.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(number)`|`number`|`log2(1)` | `null`|

## max

Returns the largest of zero or more numbers.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(number)`|`number`|`max(1)` | `null`|

## min

Returns the smallest of zero or more numbers.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(number)`|`number`|`min(1)` | `null`|

## minute

Returns an integer number, between 0 and 59, corresponding to minutes in the given date.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(date)`|`number`|`minute(now())` | `null`|

## mod

Divides two numbers and returns their remainder.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(number,number)`|`number`|`mod(1, 1)` | `1 % 1`|

## month

Returns an integer number, between 0 and 11, corresponding to month in the given date according to local time. 0 corresponds to January, 1 to February, and so on.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(date)`|`number`|`month(now())` | `null`|

## multiply

Multiplies two numbers and returns their product.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(number,number)`|`number`|`multiply(1, 1)` | `1 * 1`|

## not

Returns the logical NOT of its argument.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(checkbox)`|`checkbox`|`not(true)` | `not true`|

## now

Returns the current date and time.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`()`|`date`|`now()` | `null`|

## or

Returns the logical OR of its two arguments.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(checkbox,checkbox)`|`checkbox`|`or(true, true)` | `true or true`|

## pow

Returns base to the exponent power, that is, baseexponent.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(number,number)`|`number`|`pow(1, 1)` | `1 ^ 1`|

## replace

Replaces the first match of a regular expression with a new value.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(text,text,text)`|`text`|`replace("text", "text", "text")` | `null`|
|`(number,text,text)`|`text`|`replace(1, "text", "text")` | `null`|
|`(checkbox,text,text)`|`text`|`replace(true, "text", "text")` | `null`|

## replaceAll

Replaces all matches of a regular expression with a new value.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(text,text,text)`|`text`|`replaceAll("text", "text", "text")` | `null`|
|`(number,text,text)`|`text`|`replaceAll(1, "text", "text")` | `null`|
|`(checkbox,text,text)`|`text`|`replaceAll(true, "text", "text")` | `null`|

## round

Returns the value of a number rounded to the nearest integer.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(number)`|`number`|`round(1)` | `null`|

## sign

Returns the sign of the x, indicating whether x is positive, negative or zero.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(number)`|`number`|`sign(1)` | `null`|

## slice

Extracts a substring from a string from the start index (inclusively) to the end index (optional and exclusively).

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(text,number)`|`text`|`slice("text", 1)` | `null`|
|`(text,number,number)`|`text`|`slice("text", 1, 1)` | `null`|

## smaller

Returns true if the first argument is smaller than the second.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(number,number)`|`checkbox`|`smaller(1, 1)` | `1 < 1`|
|`(text,text)`|`checkbox`|`smaller("text", "text")` | `"text" < "text"`|
|`(checkbox,checkbox)`|`checkbox`|`smaller(true, true)` | `true < true`|
|`(date,date)`|`checkbox`|`smaller(now(), now())` | `now() < now()`|

## smallerEq

Returns true if the first argument is smaller than or equal to than the second.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(number,number)`|`checkbox`|`smallerEq(1, 1)` | `1 <= 1`|
|`(text,text)`|`checkbox`|`smallerEq("text", "text")` | `"text" <= "text"`|
|`(checkbox,checkbox)`|`checkbox`|`smallerEq(true, true)` | `true <= true`|
|`(date,date)`|`checkbox`|`smallerEq(now(), now())` | `now() <= now()`|

## sqrt

Returns the positive square root of a number.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(number)`|`number`|`sqrt(1)` | `null`|

## start

Returns the start of a date range.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(date)`|`date`|`start(now())` | `null`|

## subtract

Subtracts two numbers and returns their difference.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(number,number)`|`number`|`subtract(1, 1)` | `1 - 1`|

## test

Tests if a string matches a regular expression.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(text,text)`|`checkbox`|`test("text", "text")` | `null`|
|`(number,text)`|`checkbox`|`test(1, "text")` | `null`|
|`(checkbox,text)`|`checkbox`|`test(true, "text")` | `null`|

## timestamp

Returns an integer number from a Unix millisecond timestamp, corresponding to the number of milliseconds since January 1, 1970.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(date)`|`number`|`timestamp(now())` | `null`|

## toNumber

Parses a number from text.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(text)`|`number`|`toNumber("text")` | `null`|
|`(date)`|`number`|`toNumber(now())` | `null`|
|`(number)`|`number`|`toNumber(1)` | `null`|
|`(checkbox)`|`number`|`toNumber(true)` | `null`|

## unaryMinus

Negates a number.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(number)`|`number`|`unaryMinus(1)` | `- 1`|

## unaryPlus

Converts its argument into a number.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(checkbox)`|`number`|`unaryPlus(true)` | `+ true`|
|`(text)`|`number`|`unaryPlus("text")` | `+ "text"`|
|`(number)`|`number`|`unaryPlus(1)` | `+ 1`|

## unequal

Returns false if its arguments are equal, and true otherwise.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(number,number)`|`checkbox`|`unequal(1, 1)` | `1 != 1`|
|`(text,text)`|`checkbox`|`unequal("text", "text")` | `"text" != "text"`|
|`(checkbox,checkbox)`|`checkbox`|`unequal(true, true)` | `true != true`|
|`(date,date)`|`checkbox`|`unequal(now(), now())` | `now() != now()`|

## year

Returns a number corresponding to the year of the given date.

|Arity|Result type|Example (Function)|Example (Operator)|
|-|-|-|-|
|`(date)`|`number`|`year(now())` | `null`|

