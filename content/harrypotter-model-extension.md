Today, we are continuing on our tab-harrypotter-practice project. Make sure you are working on your `<name>_week2_branch` branch!

## Data
First, let's create a data model called Student with these properties:  
`name (String)`  
`year (Int)`  
`image (UIImage)`

Inside StudentsViewController, replace the the array of String students with an array of Student. Use this link to give each student a year:   
http://harrypotter.wikia.com/wiki/1991%E2%80%931992_school_year
  
Give images to your students. Images for all the gryffindor students can be found in the resources repo:  
URL: https://github.com/sophaz/resources  
Folder: model-harrypotter

## Table View Cells
Mock: https://projects.invisionapp.com/d/main#/console/14774099/307403043/preview

Now, create a new `UITableViewCell` subclass, let's call it `StudentCell`.  
- Create it from a xib and hook up the IBOutlets for the 2 labels and image view.  
- Add a `configure(:)` method to the cell which takes a Student and populates its views.  
- Use the sample data that we created in the previous section to drive the table view.

And that's a wrap for today!

