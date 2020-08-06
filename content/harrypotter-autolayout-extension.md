Today, we will be working on top of the tab-harrypotter-practice project. Make a new branch called `<name>_week2_branch` and work from there. There will be multiple harry potter extensions this week. We will grade them when you're done with the all 3 at the end of the week.

### Layout
First, modify StudentCell to be laid out using Autolayout instead of Manual Layout.  
Test this out by making sure this works in different screen sizes.

**BONUS** +10 points  
Mock: https://projects.invisionapp.com/d/main#/console/14774099/307399185/preview

*Data*  
Let's add a new concept to the student called points. This represents the number of points that they've earned their house during this school semester.  
Update all of the sample data to give the students points. You can use the data in the mock to populate the students for Gryffindor, and make up your own values for the other houses.

*Layout*  
Use Autolayout to add a new points view to StudentCell:  
- You will do add a new UIView to the right of the name label  
- Add another UILabel as a subview of that newly created UIView.  
- Populate the label using the data from our Student array.  
  If the number is positive, display the number on a GREEN background.  
  If the number is negative, display the positive version of that number on a RED number (show 10 on a RED background for -10)

And that's it for today!

