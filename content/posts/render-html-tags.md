---
title: "Render Html Tags"
date: 2019-01-02T19:45:06+01:00
draft: false
tags : [
    "php"
]
---

<h1 class="title"> Render HTML Tags </h1>

When you store HTML tags in your database, you would like to retrieve these datas as HTML Content, not  a string right ?

```PHP
<?php echo $row['description']; ?>`
```
Maybe when you want to display this data, it show  as a string character  : <br/>

```HTML
<ul><li>Hello, I am PHP</li></ul>
```

Don't worry, call your best elePHPhant 🐘 and use [htmlspecialchars_decode()](https://www.php.net/manual/fr/function.htmlspecialchars-decode.php)

> The htmlspecialchars() function converts some predefined characters to HTML entities
```PHP
<?php echo htmlspecialchars($row['description']); ?>
```


Hope, you enjoy this post 😉
