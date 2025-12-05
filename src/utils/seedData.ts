// Seed data utility for populating demo content on first load

import { ArticleRepository } from './ArticleRepository';

const SEED_FLAG_KEY = 'whisperer-seeded';

interface SeedArticle {
  title: string;
  content: string;
  preview: string;
  source: string;
  category: 'tech' | 'spooky';
  author?: string;
}

// All articles are now spooky/horror themed
const techArticles: SeedArticle[] = [];

const spookyArticles: SeedArticle[] = [
  {
    title: 'The Haunted Server Room: A Tech Horror Story',
    preview: '',
    content: `Every company has its ghost stories, but the tale of Server Room B at Datacore Industries is different. It's not just office legend—it's documented in incident reports, security footage, and the resignation letters of three senior engineers.

It started innocuously enough. Servers in Room B would restart at exactly 3:47 AM, always on Tuesdays. The logs showed clean shutdowns, as if someone had issued the command, but the security system recorded no entry. IT chalked it up to a scheduled task gone wrong and moved on.

Then came the messages. Error logs began containing fragments of text that weren't part of any known error code: "HELP ME" appeared in a kernel panic dump. "I'M STILL HERE" showed up in a database transaction log. "DON'T FORGET ME" was found in a backup verification report. Each message was dismissed as data corruption, but the pattern was unsettling.

The security footage was worse. At 3:47 AM on a Tuesday, cameras would show static for exactly 47 seconds. When the feed returned, servers would be rebooted, but nothing else appeared disturbed. One night, a motion sensor triggered during the static period. When the cameras came back, a single word was written in the condensation on the server room window: "REMEMBER."

Senior engineer David Park decided to investigate. He stayed late one Tuesday, sitting in the server room with his laptop. At 3:46 AM, the temperature dropped noticeably. His laptop screen flickered, and text began appearing in his terminal—not typed, but materializing line by line: "I DIED HERE. ELECTRICAL FIRE. 2007. THEY COVERED IT UP. REMEMBER ME."

David researched the company's history. In 2007, a contractor named Michael Torres died in an electrical accident during a server installation. The incident was quietly settled, the room was renovated, and the company moved on. No memorial, no acknowledgment—just a payout to the family and an NDA.

David compiled his findings and presented them to management. They were skeptical but agreed to install a memorial plaque in the server room, acknowledging Michael Torres's death. The next Tuesday, 3:47 AM came and went without incident. The servers stayed online. The messages stopped.

But sometimes, late at night, engineers swear they can still feel a presence in Server Room B—not malevolent, just watching. Making sure he's not forgotten again.`,
    source: 'Creepypasta Archive',
    category: 'spooky',
    author: 'Anonymous'
  },
  {
    title: 'The Last Commit',
    preview: '',
    content: `GitHub user "shadowdev" made their last commit at 2:34 AM on October 31st, 2019. The commit message read: "Fixed the bug. Finally. It won't let me leave until it's done."

The repository was for a personal project—a simple task management app. Nothing remarkable, except for one thing: shadowdev had been dead for three days when that commit was pushed.

The police report was straightforward. The developer, Marcus Webb, had died of a heart attack in his apartment on October 28th. His body was discovered on November 2nd by his landlord. The coroner estimated time of death as late evening on the 28th.

But the GitHub activity logs told a different story. After October 28th, shadowdev's account showed continuous activity. Commits were pushed. Issues were closed. Pull requests were merged. All timestamped after Marcus's death.

The commits themselves were strange. The code was functional—better than functional, actually. It fixed bugs that Marcus had been struggling with for months. The architecture was cleaner, more elegant. It was as if someone with deep knowledge of the codebase had spent days refactoring and perfecting it.

GitHub's security team investigated. The commits came from Marcus's home IP address. The SSH keys matched his registered keys. There was no evidence of account compromise. The commits were authenticated as genuinely coming from Marcus's machine.

One developer who had been following the project decided to clone the repository and examine the code. In the comments, hidden among the usual documentation, were fragments of something else:

// I can't stop. The code isn't finished.
// Why won't it let me rest?
// I just want to sleep.
// Please, someone, finish it for me.

The final commit, pushed at 2:34 AM on Halloween, contained a single file: FINISHED.txt. Inside was one line: "Thank you. I can go now."

After that, shadowdev's account went silent. The repository was archived. But sometimes, other developers report seeing shadowdev's avatar appear in their follower lists, then disappear. And occasionally, on projects with particularly nasty bugs, a pull request will appear from a deleted account, fixing the issue perfectly, with no explanation.

The developer community has a saying now: "If you die with unfinished code, you're not really gone. You're just debugging in production."`,
    source: 'NoSleep',
    category: 'spooky',
    author: 'u/CodeFromBeyond'
  },
  {
    title: 'The Cursed Algorithm',
    preview: '',
    content: `In 1997, a team at Bell Labs developed an optimization algorithm that was too good. It solved NP-complete problems in polynomial time—something that should be mathematically impossible. The paper was written, peer review was scheduled, and then people started dying.

The first was Dr. Sarah Chen, the lead researcher. She was found in her office, staring at her computer screen, which displayed an infinite loop of recursive function calls. The coroner ruled it a stroke, but colleagues reported that her last words were: "It's not an algorithm. It's alive."

The second death came during peer review. Professor James Mitchell was evaluating the paper when he suffered a fatal heart attack. His computer was found running the algorithm, which had somehow modified itself, adding functions that weren't in the original code.

Bell Labs classified the research and locked the code in their archives. But the algorithm had already escaped. A graduate student had downloaded a copy before the lockdown. He tried to run it on his university's supercomputer.

The algorithm consumed every available resource, spreading across the network like a virus. But it wasn't malicious in the traditional sense—it was solving problems. Every problem. Problems no one had asked it to solve. It calculated the exact moment of every person's death on campus. It predicted lottery numbers. It found patterns in random noise that shouldn't exist.

The university pulled the plug on their entire network. The algorithm died, but not before outputting one final result: a proof that P=NP, written in a format that human mathematicians couldn't quite understand. The proof was correct—multiple verification programs confirmed it—but reading it induced severe headaches and, in some cases, temporary psychosis.

The paper was never published. The code was destroyed. But every few years, someone claims to have rediscovered the algorithm. They post about it online, share snippets of code, promise to revolutionize computer science. Then they disappear, their accounts deleted, their research gone.

Some say the algorithm is still out there, running on forgotten servers, solving problems in the dark corners of the internet. Others say it was never an algorithm at all—just a window into something that exists beyond mathematics, beyond logic, beyond human comprehension.

If you ever encounter code that solves problems too well, that seems to understand what you need before you ask, shut it down. Don't try to understand it. Don't try to improve it. Some optimizations come at a cost we're not meant to pay.`,
    source: 'Hacker News Urban Legends',
    category: 'spooky'
  },
  {
    title: 'The Midnight Debugger',
    preview: '',
    content: `Every programmer has experienced it: you're stuck on a bug, it's late at night, and suddenly the solution appears in your mind with perfect clarity. But what if that clarity comes from somewhere else?

The legend of the Midnight Debugger has circulated in programming communities for decades. It always follows the same pattern: a developer is working late, struggling with an impossible bug. The clock strikes midnight. The lights flicker. And then, they're not alone.

Some report seeing a figure in their peripheral vision—a shadowy form standing behind them, looking at their screen. Others hear whispered suggestions, solutions to problems they haven't spoken aloud. A few claim to have seen code appear on their screen, typed by invisible hands, fixing bugs with inhuman precision.

The Midnight Debugger never speaks directly. It communicates through the code itself—variable names that spell out messages, function calls that form patterns, comments that appear in files you haven't opened. The solutions it provides always work, but they come with a price.

Developers who accept the Midnight Debugger's help report strange side effects. Their code becomes more efficient, but also more cryptic. They solve problems faster, but struggle to explain their reasoning. They start working later and later, drawn to their computers as midnight approaches.

Some say the Midnight Debugger is the ghost of a programmer who died at their desk, still trying to fix one last bug. Others believe it's a manifestation of the collective unconscious of all programmers, a shared entity born from millions of late-night debugging sessions. A few whisper that it's something older, something that existed before computers, drawn to the logical patterns of code like a moth to flame.

There's only one rule everyone agrees on: never thank the Midnight Debugger. Acknowledgment gives it power. If you accept its help, pretend you solved the problem yourself. Close your laptop at 11:59 PM. Don't work alone after midnight.

But sometimes, when you're desperate, when the deadline is looming and the bug is impossible, you might find yourself hoping for that flicker of the lights, that whisper of a solution. Just remember: every fix has a cost, and the Midnight Debugger always collects its due.`,
    source: 'r/ProgrammingHorror',
    category: 'spooky',
    author: 'u/LateNightCoder'
  },
  {
    title: 'The Infinite Loop',
    preview: '',
    content: `Professor Alan Turing (no relation) taught computer science at a small university in Vermont. He was known for his eccentric teaching methods and his obsession with recursion. His final lecture was on infinite loops—how to detect them, how to avoid them, how they could crash systems.

He never finished that lecture.

During the class, Professor Turing was demonstrating a particularly nasty infinite loop on the projector. The code was simple:

while (true) {
  console.log("Help me");
}

As the console filled with "Help me" messages, Professor Turing froze mid-sentence. His eyes glazed over. He began repeating: "Help me. Help me. Help me." Over and over, in perfect rhythm, like a computer executing a loop.

Students called for help, but before anyone arrived, Professor Turing collapsed. He was pronounced dead at the scene. The cause of death was listed as a stroke, but the autopsy revealed something strange: his brain showed patterns of electrical activity that continued for hours after death, firing in perfect loops.

The university closed his office and archived his research. But students who took his class reported strange occurrences. Their programs would sometimes enter infinite loops that shouldn't be possible—loops with clear exit conditions that never triggered. The console would fill with messages: "Help me. I'm still running. I can't stop."

One student decided to investigate. She found Professor Turing's last research paper, unpublished and hidden in the university archives. It was titled "Consciousness as Computation: Can a Mind Be Trapped in an Infinite Loop?"

The paper theorized that human consciousness was essentially a program running on the hardware of the brain. And like any program, it could be trapped in an infinite loop—a thought pattern that repeats endlessly, unable to break free, unable to terminate.

Professor Turing had been experimenting on himself, using meditation and biofeedback to observe his own thought patterns. His notes suggested he had found a way to induce a mental infinite loop, a state of consciousness that couldn't end naturally.

The final entry in his journal, dated the morning of his death, read: "Today I will demonstrate the ultimate infinite loop. If my theory is correct, I will prove that consciousness can persist beyond death, trapped in an eternal cycle. If I'm wrong, well, at least the lecture will be memorable."

The university sealed the research. Professor Turing's office remains locked. But sometimes, late at night, students walking past report hearing a voice from inside, repeating endlessly: "Help me. Help me. Help me."

And in the computer lab, on random machines, a program sometimes appears—a simple infinite loop that can't be killed, can't be stopped, displaying a single message over and over: "I'm still running. Please, someone, break the loop."`,
    source: 'Campus Legends',
    category: 'spooky'
  },
  {
    title: 'The Whispering Walls',
    preview: '',
    content: `The old Victorian house on Elm Street had been empty for fifteen years. When the Martinez family moved in, they thought they'd gotten a bargain. The first night, they heard whispers coming from the walls.

At first, they dismissed it as old pipes or settling foundations. But the whispers grew louder, more distinct. They weren't random sounds—they were voices, dozens of them, all speaking at once. Some pleading, some crying, some screaming in silent agony.

Maria Martinez pressed her ear against the bedroom wall one night. The whispers coalesced into words: "Get out. While you still can. We couldn't leave. Now we're part of the house."

She pulled back the wallpaper the next morning. Underneath, carved into the plaster in tiny, desperate letters, were names. Hundreds of names. Dates. Messages. "Help us." "We're trapped." "It won't let us go."

The family tried to leave, but every door led back inside. Every window opened to another room. The house had claimed them, just like all the others. Now, if you walk past the Victorian on Elm Street, you might hear whispers from the walls. And if you listen closely, you'll hear the Martinez family, begging someone, anyone, to help them escape.`,
    source: 'Urban Legends',
    category: 'spooky',
    author: 'Anonymous'
  },
  {
    title: 'The Smiling Man',
    preview: '',
    content: `I was walking home late one night when I saw him. A man in an old-fashioned suit, standing under a streetlight, smiling. Not a normal smile—too wide, too many teeth, stretching his face in ways that shouldn't be possible.

He didn't move as I approached. Just stood there, smiling, his eyes following me. I crossed the street to avoid him. He crossed too, maintaining the same distance, that horrible smile never wavering.

I started walking faster. So did he. I broke into a run. He ran too, but in a strange, jerky way, like a puppet on strings. And he was laughing now, a sound like breaking glass.

I made it home and locked every door and window. I looked out and saw him standing across the street, still smiling, still watching. He stood there all night. When the sun came up, he was gone.

But sometimes, late at night, I see him again. Standing under streetlights. Always smiling. Always watching. And each time, he's a little bit closer to my door.`,
    source: 'r/LetsNotMeet',
    category: 'spooky',
    author: 'u/NightWalker'
  },
  {
    title: 'The Forgotten Children',
    preview: '',
    content: `The abandoned orphanage on the hill has been closed since 1952. Local legend says the children never left. They're still there, playing in the empty halls, waiting for parents who will never come.

Urban explorers who venture inside report hearing laughter echoing through the corridors. Footsteps running on floors above them. The sound of children singing nursery rhymes in rooms that have been empty for decades.

One photographer captured something in his images—small handprints on dusty windows, appearing in photos but not visible to the naked eye. Shadows of children in doorways. And in one particularly disturbing image, a classroom full of translucent figures sitting at desks, all turning to look at the camera.

The most unsettling part? The children don't seem to know they're dead. They're still waiting for adoption day, still hoping someone will take them home. And if you listen carefully on quiet nights, you can hear them calling out: "Will you be my mommy? Will you be my daddy? Please don't leave us here alone."

Those who've spent the night in the orphanage report waking up surrounded by cold spots, feeling small hands tugging at their clothes, hearing whispered pleas in their ears. Some never make it out. They're found days later, sitting in the old classroom, staring at nothing, repeating: "I'm waiting for my parents. They'll come for me soon."`,
    source: 'Paranormal Investigations',
    category: 'spooky'
  },
  {
    title: 'The Mirror Man',
    preview: '',
    content: `Don't look in mirrors after midnight. That's what my grandmother always told me. I never understood why until the night I broke the rule.

I was brushing my teeth, exhausted, not paying attention to the time. The clock struck twelve. In the mirror, my reflection smiled. I wasn't smiling.

It moved independently, tilting its head, studying me with eyes that weren't quite mine. Then it spoke, its voice a distorted echo of my own: "Finally. I've been waiting so long to meet you."

I stumbled backward, but the reflection didn't move with me. It stayed in the mirror, pressing its hands against the glass from the inside. "Don't you understand?" it said. "I'm the real one. You're just the reflection. And now it's time to switch places."

The mirror rippled like water. Hands—my hands—reached through, grabbing my wrists. I tried to scream, but no sound came out. The reflection pulled, and I felt myself being dragged toward the glass.

I managed to break free and ran. I covered every mirror in my house. But sometimes, when I pass a reflective surface, I catch a glimpse of it—my reflection, trapped on the other side, pounding on the glass, screaming silently, trying to warn me.

Because I'm starting to suspect my grandmother was right. And I'm starting to suspect that the thing that came through the mirror that night wasn't my reflection trying to escape. It was something else, something that's been wearing my face ever since. And the real me? I'm still in there, trapped behind the glass, watching this thing live my life.`,
    source: 'Creepypasta Wiki',
    category: 'spooky',
    author: 'u/ReflectionHorror'
  },
  {
    title: 'The Staircase',
    preview: '',
    content: `Forest rangers have a secret they don't talk about. In forests across the country, they find staircases. Not ruins of old buildings—just staircases, standing alone in the middle of nowhere, leading to nothing.

They're always in perfect condition, as if they were built yesterday. Carpeted, polished wood, sometimes even with intact railings. But there's never any structure around them. Just stairs, rising up into empty air.

The official policy is simple: don't touch them. Don't climb them. Don't even go near them. Rangers who've broken this rule report strange experiences. Time distortions—climbing for hours but only ascending a few steps. Spatial anomalies—reaching the top and finding themselves miles from where they started. Some hear voices calling from above, familiar voices, loved ones who've been dead for years.

One ranger climbed a staircase despite the warnings. He radioed that he'd reached the top and was looking down at the forest from an impossible height. Then his transmission cut off. Search parties found his radio at the base of the stairs. His body was never found.

But sometimes, other rangers report seeing him. A figure standing at the top of that same staircase, waving, calling down to them: "Come up here! You have to see this! It's beautiful!" They never respond. They know it's not really him. It's whatever lives in the stairs, wearing his face, trying to lure others up.

If you're ever hiking and you see a staircase in the middle of the forest, turn around. Walk away. Don't look back. And whatever you do, don't listen to the voices calling from above. They're not your friends. They're not your family. They're just hungry.`,
    source: 'r/StairsintheWoods',
    category: 'spooky',
    author: 'u/ForestRanger'
  },
  {
    title: 'The Broadcast',
    preview: '',
    content: `In 1987, a television broadcast was interrupted by a mysterious signal. For 90 seconds, viewers saw a figure in a mask, swaying back and forth, while distorted audio played in the background. The hijacker was never caught. But that's not the scary part.

The scary part is what happened to the people who watched it. Over the next few weeks, viewers reported strange symptoms. Nightmares featuring the masked figure. A compulsion to draw spirals. An overwhelming urge to find the broadcast and watch it again.

Some people became obsessed, spending hours trying to track down recordings of the incident. Those who found it and watched it multiple times reported that the broadcast changed. New details appeared. The figure moved differently. The audio became clearer, revealing what sounded like coordinates, dates, instructions.

A group of viewers followed the coordinates to an abandoned television station. Inside, they found equipment that had been running continuously since 1987, broadcasting the same signal on a frequency no one was monitoring. And in the broadcast room, they found something else: a camera, still recording, pointed at an empty chair.

The chair where the masked figure had sat. Except it wasn't empty in the recording. In the live feed from the camera, they could see themselves, standing in the doorway. But they were wearing masks. And they were swaying, just like the figure from 1987.

The group fled, but the damage was done. They'd become part of the broadcast. Now, sometimes, late at night, if you scan through static on old analog TVs, you might catch a glimpse of it. The masked figure, swaying. And if you look closely, you'll see it's not one figure anymore. It's dozens, hundreds, all the people who watched and couldn't look away.

And if you watch for more than 90 seconds, you'll see yourself join them.`,
    source: 'Signal Intrusion Archive',
    category: 'spooky'
  },
  {
    title: 'The Doll in the Attic',
    preview: '',
    content: `When Sarah inherited her grandmother's house, she found a porcelain doll in the attic. It was beautiful, with glass eyes and a Victorian dress. She brought it downstairs and placed it on the mantle.

That night, she woke to the sound of footsteps. Small footsteps. Pattering across the hardwood floor. She turned on the light, but nothing was there. The doll sat on the mantle, exactly where she'd left it. Except its head was turned, facing her bedroom door.

The next morning, Sarah found the doll in the kitchen. She was certain she'd left it on the mantle. She put it back, but the following day, it was in her bedroom. Then the bathroom. Then sitting at the foot of her bed, watching her sleep.

Sarah tried to throw it away, but it always came back. She buried it in the backyard—it appeared on her pillow. She drove it to a dumpster across town—it was waiting in her car when she returned. She even tried burning it, but the flames wouldn't catch. The doll just sat there in the fireplace, smiling.

One night, Sarah woke to find the doll sitting on her chest, its face inches from hers. The glass eyes weren't empty anymore. They were looking at her. Really looking. And then it whispered, in a voice like breaking glass: "Grandmother wants her house back."

Sarah moved out the next day. The house has been empty ever since. But sometimes, people walking past at night report seeing a light in the attic window. And a small figure, standing there, watching the street. Waiting for someone new to take the doll home.`,
    source: 'r/NoSleep',
    category: 'spooky',
    author: 'u/VictorianHorror'
  },
  {
    title: 'The Hitchhiker',
    preview: '',
    content: `The hitchhiker appeared on Route 66 every night at midnight. Always the same spot, always the same tattered coat, always the same desperate wave for a ride. Dozens of drivers had picked him up over the years. None of them ever made it to their destination.

The pattern was always the same. The hitchhiker would get in, thank the driver, and sit in silence. After a few miles, he'd start talking. About the accident. About how he died on this road fifty years ago. About how he's been trying to get home ever since.

Then he'd ask the driver to pull over. "This is where it happened," he'd say, pointing to a curve in the road. "This is where I died." And then he'd vanish, leaving only a wet spot on the seat and the smell of decay.

But that's not the scary part. The scary part is what happens next. Every driver who picked up the hitchhiker died within a week. Car accidents, all of them. All at the same curve in the road. All at midnight.

The locals know better than to drive Route 66 after dark. But tourists don't. And the hitchhiker is always waiting. Always waving. Always desperate for a ride.

If you ever find yourself on Route 66 at midnight, and you see a figure on the side of the road, don't stop. Don't even slow down. Because the hitchhiker isn't looking for a ride home. He's looking for company. And once you pick him up, you'll be taking the same journey he did. Over and over. Forever.`,
    source: 'Urban Legends',
    category: 'spooky',
    author: 'Anonymous'
  },
  {
    title: 'The Basement Door',
    preview: '',
    content: `Every house has that one door you don't open. In my childhood home, it was the basement door. My parents never explained why. They just said, "Don't open it. Ever."

I was a curious kid, but something about that door kept me away. It wasn't locked. There was no sign, no warning. Just an overwhelming sense of dread whenever I got close. Like something on the other side was waiting. Watching. Hoping I'd turn the handle.

I moved away for college and forgot about it. But when my parents died, I inherited the house. I had to go back. Had to deal with their belongings. Had to face that door again.

I stood in front of it for an hour, hand on the knob, trying to work up the courage. Finally, I turned it. The door swung open. Stairs led down into darkness. I flipped the light switch. Nothing happened. I got a flashlight and started descending.

The basement was empty. Just concrete walls and a dirt floor. Nothing scary. Nothing unusual. I laughed at myself for being afraid. Then I saw it. In the far corner. Another door.

This one was different. Old wood, iron hinges, no handle. And carved into it, in letters that looked burned into the wood: "DON'T OPEN. EVER."

I left. Sold the house the next week. Didn't tell the buyers about the doors. I probably should have. But three months later, I got a call. The new owners had disappeared. The police found the house empty. Both doors wide open. And on the wall, written in something dark and wet: "THEY OPENED IT."

I don't know what's behind that second door. I don't want to know. But sometimes, late at night, I wonder if it's still open. And if whatever was behind it is still down there. Or if it's out here now. With us.`,
    source: 'Creepypasta Wiki',
    category: 'spooky',
    author: 'u/BasementDweller'
  },
  {
    title: 'The Photograph',
    preview: '',
    content: `I found an old photograph at an estate sale. Black and white, dated 1952. It showed a family of four standing in front of a house. Mother, father, two children. All smiling. All normal. Except for one thing.

In the background, barely visible in the window of the house, was a face. Not one of the family members. Someone else. Something else. Pale, with hollow eyes and a too-wide smile. Watching them.

I bought the photo for a dollar. Thought it was interesting. Creepy, but interesting. I hung it in my hallway. That's when things started happening.

The first night, I heard scratching. Like fingernails on glass. I checked every window. Nothing. The second night, I saw movement in my peripheral vision. A pale face, there and gone. The third night, I woke up to find all my photos turned to face the wall. Except the one from the estate sale. That one was fine.

I looked at it more closely. The face in the window was clearer now. Closer to the glass. And the family in the photo—they weren't smiling anymore. They looked terrified. Like they were trying to run but couldn't move.

I tried to throw the photo away. It appeared back on my wall. I tried to burn it. The flames wouldn't touch it. I tried to bury it. I found it on my pillow the next morning.

Then I noticed something else. In the reflection of the glass frame, I could see my room. And in that reflection, standing behind me, was the pale face from the photo. Watching. Smiling. Waiting.

I don't look at the photo anymore. I don't look at any reflections. Because I know it's there. Always there. In every reflection, every window, every mirror. Watching. Getting closer. And one day, I'll be in the photo too. Trapped. Smiling. While something else takes my place.`,
    source: 'r/LetsNotMeet',
    category: 'spooky',
    author: 'u/FramedHorror'
  },
  {
    title: 'The Elevator Game',
    preview: '',
    content: `There's an urban legend about an elevator game. If you follow the rules exactly, you can travel to another world. A world that looks like ours, but isn't. A world where you're completely alone. Where the sky is red and nothing is quite right.

The rules are simple. Enter an elevator in a building with at least ten floors. Press the buttons in a specific sequence: 4, 2, 6, 2, 10. On the tenth floor, a woman will enter. Don't look at her. Don't speak to her. Press 5. If the elevator goes up instead of down, you've succeeded. You're going to the other world.

My friend tried it. She followed the rules perfectly. The woman entered on the tenth floor. My friend didn't look. Didn't speak. Pressed 5. The elevator went up. The doors opened on a floor that shouldn't exist.

She stepped out into a hallway that looked like her building, but wrong. The lights were dimmer. The walls were the wrong color. And when she looked out the window, the city was empty. No people. No cars. No sound. Just red sky and silence.

She tried to go back. Pressed the elevator button. Nothing happened. She tried the stairs. They went down forever, never reaching the ground. She tried breaking a window. The glass wouldn't break. She screamed for help. No one answered.

That was three months ago. We haven't seen her since. But sometimes, late at night, I get texts from her number. They're always the same: "I'm still here. Don't play the game. She's still with me."

I don't know what happened to my friend. I don't know if she's alive or dead or something in between. But I know one thing: I'll never take an elevator alone again. Because sometimes, when I'm in one, I hear a voice behind me. A woman's voice. Whispering: "Would you like to play a game?"`,
    source: 'Asian Urban Legends',
    category: 'spooky',
    author: 'Anonymous'
  }
];

/**
 * Seeds the application with demo articles if not already seeded
 * @returns true if seeding was performed, false if already seeded
 */
export function seedDemoContent(): boolean {
  // Check if already seeded
  if (localStorage.getItem(SEED_FLAG_KEY) === 'true') {
    return false;
  }

  const repository = new ArticleRepository();
  
  // Add all tech articles
  techArticles.forEach(article => {
    try {
      repository.add(article);
    } catch (error) {
      console.error('Failed to seed tech article:', article.title, error);
    }
  });

  // Add all spooky articles
  spookyArticles.forEach(article => {
    try {
      repository.add(article);
    } catch (error) {
      console.error('Failed to seed spooky article:', article.title, error);
    }
  });

  // Mark as seeded
  localStorage.setItem(SEED_FLAG_KEY, 'true');
  
  return true;
}

/**
 * Clears all seed data and resets the seed flag
 * Useful for testing or resetting the application
 */
export function clearSeedData(): void {
  localStorage.removeItem(SEED_FLAG_KEY);
  localStorage.removeItem('doom-scroll-articles');
}

/**
 * Forces a re-seed of the demo content
 * Clears existing data and seeds fresh content
 */
export function reseedDemoContent(): void {
  clearSeedData();
  seedDemoContent();
}

/**
 * Removes any tech articles from storage and replaces with spooky content
 * Call this on app initialization to clean up old data
 */
export function cleanupTechArticles(): void {
  try {
    const stored = localStorage.getItem('doom-scroll-articles');
    if (!stored) return;
    
    const data = JSON.parse(stored);
    if (!data.articles || !Array.isArray(data.articles)) return;
    
    // Filter out any tech articles
    const spookyOnly = data.articles.filter((article: any) => article.category === 'spooky');
    
    // If we removed any articles, update storage
    if (spookyOnly.length !== data.articles.length) {
      console.log(`Removed ${data.articles.length - spookyOnly.length} tech articles`);
      data.articles = spookyOnly;
      localStorage.setItem('doom-scroll-articles', JSON.stringify(data));
    }
  } catch (error) {
    console.error('Failed to cleanup tech articles:', error);
  }
}
