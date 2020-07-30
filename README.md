# perl_assignment
A Perl assignment for spring 2020 (covid year)

## How I extracted the "key" from Syllabus Search

1. Go to [Syllabus Search page](https://www.wsl.waseda.jp/syllabus/JAA101.php)
1. Search for SILS, Spring term
1. Open devtool (command + option + j)
1. Paste the code below to the console
```javascript
// Showing all the results
func_showchg('JAA103SubCon', '500')

const tt = document.querySelectorAll('td > a') // getting all elements
const aa = [] /
tt.foreach(e => aa.push(e.getAttribute(‘onclick’))) 
const keys = aa.map(x => x.split(‘\’’)[3]) // extracting the key
copy(keys) // copying the keys array
```

## How I extracted the data
1. Goto https://www.wsl.waseda.jp/syllabus/JAA104.php?pKey=${key}&pLng=jp (change ${key} to one of the key in the keys array)
1. Using XPath, 
