---
title: "Angular Component Lifecycle Hooks"
date: 2021-05-10T11:43:11+02:00
draft: false
tags : [
    "Angular"
]
---

# 8 Lifecycle Hooks

 - **ngOnChanges()**
	 - Used in pretty muck any component that has an input
	 - Called whenever an input value changes
	 - Is called the first time before ngOnInit



 - **ngOnInit()**
	 - Used to initialize data in a component
	 - Called after input values are set when a component is initialized
	 - Added to every component by default by the Angular CLI
	 - Called only once


 - **ngDoCheck()**
	 - Called during all change detection runs
	 - A run through the view by Angular to update/detect changes


- **ngAfterContentInit()**
	 - Called only once after first ngDocheck()
	 - Called after the first run through of initializing content

	 
- **ngAfterContentChecked()**
   	 - Called after every ngDoCheck()
   	 - Waits till after ngAfterContentInit() on first run through


- **ngAfterViewInit()**
   	 - Called after Angular initializes component and child component content. 
   	 - Called only once after view is initialized


- **ngAfterViewChecked()**
	 - Called after all the content is initialized and checked. (Component and child components).
	 - First call is after ngAfterViewInit()
	 - Called after every ngAfterContentChecked() call is completed

     
- **ngOnDestroy**
	 - Used to clean up any necessary code when a component is removed from the DOM
	 - Fairly often used to unsubscribe from things like services
	 - Called only once just before component is removed from the DOM      

# Most used ones are :

 - ngOnChanges()
 - ngOnInit()
 - ngAfterViewInit()
 - ngOnDestroy()  