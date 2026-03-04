import { LuFileText, LuGithub, LuLinkedin } from "react-icons/lu";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

export default function About() {
  const bioTitle = `
# Hey There I'm Matt!
<small>(Actually this is just text on a browser, but you get the idea.)</small>
`
  const bioContent = `
I'm a Systems and Cloud Administrator based in Toronto with over 15 years of experience in enterprise IT operations. I spend most of my time working with infrastructure, identity, cloud platforms, and the systems that keep organizations running day to day.

That is professional Matt though.

You are probably here because you want to know me, Matt, same guy, same name.

The year was 1985, it was a cold December night, December Friday the 13th if I remember correctly...

Oh, no life stories? Fine. Whatever. I didn't even want to tell you.

So let's start with the obvious. My full name is Mathew Ross. Yes, it only has one T. When I shorten it to Matt, I add another T. I have no explanation for this. It just happened, and now we all live with it, well, *I* live with it, you just know about it.

I try not to take life too seriously. Sometimes that works. Sometimes it means I worry, and then worry about worrying and then either I deal with it with the different mental health tools I’ve been taught. Or I don’t, and then we all get to deal with the fallout, cause I’m generous like that.

I love video games, board games, tabletop games, oh and did I mention games? Also, books, when I have the time. Movies, when I have a little bit of time and when I have all the time in the world, I doomscroll.

For a chunk of my life, I have described myself as a Jack of all Trades, Master of None, but then I got diagnosed with ADHD, and that seems a more apt description. So, I dabble. I rarely stick to one thing for long. If something interests me, I either learn a little about it or dive in, only to find myself cursing the passage of time and my complete disregard for it.

That gives you a decent idea of who I am.

The rest of the enigma that is Mathew or Matt, you will have to figure out on your own.

Or not. Or do. I don’t know, I’m not your mother.

<span class="tiny">[No way you'll find out more by reading my posts. K, bye!](/posts)</span>
`
  return (
    <div className="pageContent">
      {/* Manually implementing the Section structure */}
      <section id="about" className="section">
        <h3 className="sectionTitle">About Me</h3>
        
        <div className="sectionBody">
          {/* Skills & Location Pills */}
          <div className="aboutpillRow" style={{ marginBottom: "1.5rem" }}>
            <span className="aboutpill">Toronto, CA</span>
            <span className="aboutpill">AWS • Azure • M365</span>
          </div>

          {/* Bio Paragraphs */}
          <div className="sectionBody">
              <ReactMarkdown 
              remarkPlugins={[remarkGfm]} 
              rehypePlugins={[rehypeRaw]}
              >
                {bioTitle}
              </ReactMarkdown>
            <div className="bioContainer prose">
              <ReactMarkdown 
              remarkPlugins={[remarkGfm]} 
              rehypePlugins={[rehypeRaw]}
              >
                {bioContent}
              </ReactMarkdown>
            </div>
          </div>
          {/* Links */}
          <div className="linksRow" style={{ marginBottom: "2rem" }}>
            <a href="https://github.com/Khadren" className="linksbtn" target="_blank" rel="noreferrer">
              <LuGithub size={15} />
              <span>GitHub</span>
            </a>
            <a href="https://www.linkedin.com/in/mathewdross/" className="linksbtn" target="_blank" rel="noreferrer">
              <LuLinkedin size={15} />
              <span>LinkedIn</span>
            </a>
            <a href="/MathewRossResume.pdf" className="linksbtn" target="_blank" rel="noreferrer">
              <LuFileText size={15} />
              <span>Resume</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}