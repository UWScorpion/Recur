Today, we will be working on top of the tab-harrypotter-practice project. Make sure you are working on a branch called `<name>_text_branch`.

### Passwords
You will be adding a text field to the EnterViewController.
Mock: https://projects.invisionapp.com/d/main#/console/14837786/308499798/preview  

- Only if the user taps the correct password for the house, can they enter.
  The standard rule of being allowed in only one house at a time applies! 
  The passwords are as follows:  
  Gryffindor: "Caput Draconis"  
  Hufflepuff: "Helga Hufflepuff"  
  Slytherin: "Pure-blood" or "Pure blood" (either password is correct)
  Ravenclaw: see following section
- If the user enters the wrong password, show a Wrong password! error message right below the text field, like this:
  Mock: https://projects.invisionapp.com/d/main#/console/14837786/308499796/preview
  As soon as the user starts entering a password again, hide the message.

### Ravenclaw

Ravenclaw members have to answer riddles correctly to gain entry to their room.
Mock: https://projects.invisionapp.com/d/main#/console/14837786/308499797/preview

Only if the user enters the right answer to the riddle, can they enter.  
The Question / Answers are as follows:

Q: "Which came first, the phoenix or the flame?"  
A: "A circle has no beginning."

Q: "Where do Vanished objects go?"  
A: "Into nonbeing, which is to say, everything."

Q: "Take away the whole and some still remains. What is it?"  
A: "Wholesome" or "wholesome" (either answer is correct)  

Q: "Spell it."  
A: "I-T" or "i-t" (either answer is correct)

Q: "What am I?"  
A: "A question"  

Q: "What room can you eat?"  
A: "A mushroom" or "a mushroom" or "mushroom" (any answer is correct)

Q: "Feed me and I live. Give me a drink and I die. What am I?"  
A: "A fire" or "a fire" or "fire" (any answer is correct)

- If the user enters the wrong answer, show a Wrong answer! error message right below the text field, like this:

Replace the question with a new random question.  
As soon as the user starts entering the next answer, hide the error message again. You can implement this a number of ways:  
1) User has to answer *all* questions in a row correctly to proceed.  
2) User has to answer *any* question correctly to proceed  
It's up to you!

Good luck!