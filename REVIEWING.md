# Reviewing a page

Reviewers are verified local experts (travel professionals and people with a
background in Zimbabwe's history). A page names a reviewer only when that
person has actually reviewed it.

## How to review a page

1. Read the page against the sources in its `## Sources` section, and against
   anything you know first-hand.
2. Edit the page to fix anything wrong, out of date or unclear. Add a source
   for any new fact.
3. Update the review note near the top of the page to today's date and your
   name:

   ```mdx
   <Note>
     **Last reviewed: 25 October 2026 by Michelle Lawson** against <the sources
     you checked>.
   </Note>
   ```

4. Set `article:modified_time` in the frontmatter to the same date.
5. Open a pull request into `staging`. It ships with the next release.

## Rules

- Only add your name to a page you have reviewed yourself.
- Keep the author byline (`Written by …`) as it is; the review note is separate.
- If you can't confirm a fact, soften it or remove it rather than guess.
- Reviewers listed on [About this guide](https://www.travel-info.co.zw/about-this-guide):
  Michelle Lawson, Cynthia Fawcett.
