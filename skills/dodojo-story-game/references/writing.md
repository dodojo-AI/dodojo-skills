# Writing a story game

## The map first

Write the map as plain text before any prose, and keep it with the work (not
in the page):

```
open      The lift stops between floors.        -> call (phone), climb (hatch)
call      The night desk answers, then static.  -> wait, climb           sets: heard_voice
climb     The shaft, a ladder, a door marked 7. -> door7, down
door7     LOCK: 4 digits, clue in 'open' (the inspection card: 1,9,?,?) and 'call' (the year)
...
END:true  You name the electrician. needs: clues:4,heard_voice
END:half  You get out, but the painting is gone. needs: escaped
```

For each scene: an id, one line of what happens, where its choices go, what
it sets or needs. For each puzzle: what is asked, where each clue is, the
answer. For each ending: what earns it.

## Scenes

- Open in the middle of something: a situation, not a backstory. Backstory
  comes in pieces, as the player needs it.
- One beat per scene: something happens or is found, then a decision.
- Concrete details the player can use: a number on a door, a smell of
  solder, a time on a ticket. Some of them are clues; most are texture; the
  player cannot tell which, and that is the fun.
- Second person, present tense, short paragraphs. Read it aloud: if a
  sentence trips, cut it.

## Choices

- Each choice is a short action in the player's voice, starting with a verb.
- Make choices that are hard because both sides are good (trust Lin, or
  check her story), not because one is obviously wrong.
- Signal consequence without spelling it out: a person remembers ("You
  didn't call me back last night").
- Let a missed clue come back another way later; let a wrong guess cost time
  or trust, not the whole story.

## Mysteries

- Write the truth first: what really happened, minute by minute, who knows
  what, who lies and why. Then decide what the player can find.
- Every suspect has a motive and an opportunity on paper; only one fits all
  the clues.
- The key contradiction is in plain sight, in two places the player can put
  side by side (a statement and a receipt, a photo and a timetable).
- The accusation asks for the culprit and one reason; a right name with the
  wrong reason gets the half ending, with a line on what was missed.

## Personal quests

- Build it on the shared memories the person picks: places in the order
  they happened, inside jokes, the photo from that day.
- Each stage's clue should be solvable by the recipient alone: a memory only
  the two of them share is a good lock; a fact only the maker knows is not.
- End on the real thing: the present, the plan, a message from the maker.
- Keep private details out unless the person asks for them, since the page
  may be shared.

## Endings

- Each ending names what the player did that led there.
- A bad ending offers "Go back to the last choice" and keeps the clues found.
- The best ending pays off the turn in the middle and the smallest detail
  from the first scene.
