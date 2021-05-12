---
title: "Angular Route Guards"
date: 2021-05-12T12:14:07+02:00
draft: false
tags : [
    "Angular"
]
---

<h1 class="title"> Route Guards </h1>

<ul class="title">
    <li> Use route guards to prevent users from navigating to parts of an app without authorization </li>
    <li> Route Guards are used to secure the route paths </li>
     <li> To generate the route guard, we can make use of Angular CLI : 
     ng generate guard <guard-name> </li>
    <li> To generate the route guard, we can make use of Angular CLI : 
     ng generate guard <guard-name> </li>
     <li>    
     Route Guards have something called "interfaces" :
     - canActivate -> checks to see if a user can visit a route
    - canActivateChild -> cheks to see if a user can visit a router children 
    - canDecativate ->  checks to see if a user can exit a route
    - canLoad -> checks to see is a user can route to a module that lazy loaded
    - resolve -> performs route data retrieval before route activation  </li>
</ul>